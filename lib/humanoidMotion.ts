import * as THREE from "three";

export type HumanoidPose = "default" | "seated" | "crouching" | "sliding" | "crawling" | "dancing" | "singing" | "flinching" | "driver";
export interface HumanoidMotionState {
  speed: number;
  isGrounded: boolean;
  verticalVelocity: number;
  isJumping: boolean;
  isRunning?: boolean;
  pose?: HumanoidPose;
  jumpProgress?: number;
  seatWeight?: number;
  steerAngle?: number;
  lookAtTarget?: THREE.Vector3 | null;
}
export const damping = (rate: number, dt: number) => 1 - Math.exp(-rate * Math.max(0, dt));
const clamp = THREE.MathUtils.clamp;
const TAU = Math.PI * 2;

/** The height and velocity have the same clock; preparation and recovery stay on the floor. */
export function sampleOfficeJump(elapsed: number) {
  const progress = (Math.max(0, elapsed) % 1.45) / 1.45;
  const flightTime = (progress - 0.15) * 1.45;
  const duration = 0.63 * 1.45;
  const airborne = flightTime >= 0 && flightTime < duration;
  const gravity = 8 * 0.55 / (duration * duration);
  return {
    progress,
    isGrounded: !airborne,
    height: airborne ? Math.max(0, gravity * flightTime * (duration - flightTime) / 2) : 0,
    verticalVelocity: airborne ? gravity * (duration / 2 - flightTime) : 0,
  };
}

interface Joint {
  bone: THREE.Bone;
  local: THREE.Quaternion;
  world: THREE.Quaternion;
  position: THREE.Vector3;
  direction: THREE.Vector3;
}
interface FootState {
  anchor: THREE.Vector3;
  planted: boolean;
}

/**
 * Anatomical directions live in model space (+Y up, +Z forward).
 * Each target is converted through the ACTUAL parent transform. Never add a
 * guessed Euler angle to a bone whose local axes depend on the exported asset.
 */
export class HumanoidAnimator {
  readonly joints: Record<string, Joint> = {};
  phase = 0;
  private time = 0;
  private initialized = false;
  private wasGrounded = true;
  private landing = 0;
  private blend = 0;
  private seat = 0;
  private hipsOffset = 0;
  private feet: FootState[] = [
    { anchor: new THREE.Vector3(), planted: false },
    { anchor: new THREE.Vector3(), planted: false },
  ];
  private rootQ = new THREE.Quaternion();
  private inverseRoot = new THREE.Matrix4();
  private parentQ = new THREE.Quaternion();
  private q = new THREE.Quaternion();
  private targetQ = new THREE.Quaternion();
  private rotation = new THREE.Quaternion();
  private euler = new THREE.Euler();
  private a = new THREE.Vector3();
  private b = new THREE.Vector3();
  private c = new THREE.Vector3();
  private d = new THREE.Vector3();
  private hip = new THREE.Vector3();
  private ankle = new THREE.Vector3();
  private knee = new THREE.Vector3();
  private pole = new THREE.Vector3();
  private localTarget = new THREE.Vector3();
  private upperDirection = new THREE.Vector3();
  private lowerDirection = new THREE.Vector3();
  private handSpread: Record<string, THREE.Vector3> = {};
  private fingers: { joint: Joint; axis: THREE.Vector3; bend: number; side: string }[] = [];

  private root: THREE.Object3D;

  constructor(root: THREE.Object3D) {
    this.root = root;
    root.updateWorldMatrix(true, true);
    root.getWorldQuaternion(this.rootQ);
    const inverseQ = this.rootQ.clone().invert();
    this.inverseRoot.copy(root.matrixWorld).invert();
    root.traverse((node) => {
      if (!(node as THREE.Bone).isBone) return;
      const bone = node as THREE.Bone;
      const child = bone.children.find((item) => (item as THREE.Bone).isBone);
      const direction = child
        ? child.getWorldPosition(new THREE.Vector3()).sub(bone.getWorldPosition(new THREE.Vector3())).normalize().applyQuaternion(inverseQ)
        : new THREE.Vector3(0, 1, 0);
      this.joints[bone.name] = {
        bone, local: bone.quaternion.clone(),
        world: inverseQ.clone().multiply(bone.getWorldQuaternion(new THREE.Quaternion())),
        position: bone.getWorldPosition(new THREE.Vector3()).applyMatrix4(this.inverseRoot),
        direction,
      };
    });
    for (const side of ["Left", "Right"]) {
      const index = this.joints[side + "HandIndex1"];
      const pinky = this.joints[side + "HandPinky1"];
      const middle = this.joints[side + "HandMiddle1"];
      const hand = this.joints[side + "Hand"];
      if (index && pinky && hand && middle) {
        this.handSpread[side] = index.position.clone().sub(pinky.position).normalize();
        hand.direction.copy(middle.position).sub(hand.position).normalize();
        const palm = new THREE.Vector3().crossVectors(hand.direction, this.handSpread[side]).normalize()
          .multiplyScalar(side === "Left" ? 1 : -1);
        for (const [name, joint] of Object.entries(this.joints)) {
          if (!name.startsWith(side + "Hand") || !/[123]$/.test(name)) continue;
          const axis = new THREE.Vector3().crossVectors(joint.direction, palm).normalize()
            .applyQuaternion(joint.world.clone().invert());
          const bend = name.includes("Thumb") ? 0.08 : name.endsWith("1") ? 0.16 : 0.3;
          this.fingers.push({ joint, axis, bend, side });
        }
      }
    }
  }

  private position(name: string, out: THREE.Vector3) {
    this.joints[name].bone.getWorldPosition(out).applyMatrix4(this.inverseRoot);
    return out;
  }

  private setWorld(name: string, world: THREE.Quaternion, alpha: number) {
    const joint = this.joints[name];
    if (!joint) return;
    joint.bone.parent!.getWorldQuaternion(this.parentQ).invert();
    this.targetQ.copy(this.parentQ).multiply(this.rootQ).multiply(world);
    joint.bone.quaternion.slerp(this.targetQ, alpha);
    joint.bone.updateWorldMatrix(false, false);
  }

  private aim(name: string, direction: THREE.Vector3, alpha: number, handSide?: string, palmsDown = false) {
    const joint = this.joints[name];
    if (!joint) return;
    direction.normalize();
    this.rotation.setFromUnitVectors(joint.direction, direction);
    this.q.copy(this.rotation).multiply(joint.world);
    if (handSide && this.handSpread[handSide]) {
      // Index-finger side faces forward at rest; palms face inward, without a bent wrist.
      this.c.copy(this.handSpread[handSide]).applyQuaternion(this.rotation);
      this.c.addScaledVector(direction, -this.c.dot(direction)).normalize();
      if (palmsDown) this.d.set(handSide === "Left" ? -1 : 1, 0, 0);
      else this.d.set(0, 0, 1);
      this.d.addScaledVector(direction, -this.d.dot(direction)).normalize();
      const angle = Math.atan2(this.a.crossVectors(this.c, this.d).dot(direction), this.c.dot(this.d));
      this.rotation.setFromAxisAngle(direction, angle);
      this.q.premultiply(this.rotation);
    }
    this.setWorld(name, this.q, alpha);
  }

  private torso(name: string, pitch: number, yaw: number, roll: number, alpha: number) {
    const joint = this.joints[name];
    if (!joint) return;
    this.q.setFromEuler(this.euler.set(pitch, yaw, roll)).multiply(joint.world);
    this.setWorld(name, this.q, alpha);
  }

  private solveLeg(side: string, target: THREE.Vector3, alpha: number) {
    const thigh = this.joints[side + "UpLeg"];
    const shin = this.joints[side + "Leg"];
    const foot = this.joints[side + "Foot"];
    if (!thigh || !shin || !foot) return;
    this.position(side + "UpLeg", this.hip);
    const upperLength = thigh.position.distanceTo(shin.position);
    const lowerLength = shin.position.distanceTo(foot.position);
    this.a.copy(target).sub(this.hip);
    const distance = clamp(this.a.length(), 0.08, (upperLength + lowerLength) * 0.998);
    this.a.normalize();
    const along = (upperLength * upperLength - lowerLength * lowerLength + distance * distance) / (2 * distance);
    const outward = Math.sqrt(Math.max(0, upperLength * upperLength - along * along));
    // Knees always bend toward the front of the person.
    this.pole.set(0, 0, 1).addScaledVector(this.a, -this.a.z).normalize();
    this.knee.copy(this.hip).addScaledVector(this.a, along).addScaledVector(this.pole, outward);
    this.ankle.copy(this.hip).addScaledVector(this.a, distance);
    this.upperDirection.copy(this.knee).sub(this.hip);
    this.lowerDirection.copy(this.ankle).sub(this.knee);
    this.aim(side + "UpLeg", this.upperDirection, alpha);
    this.aim(side + "Leg", this.lowerDirection, alpha);
    this.q.copy(foot.world);
    this.setWorld(side + "Foot", this.q, alpha);
  }

  update(input: HumanoidMotionState, delta: number) {
    const dt = Math.min(Math.max(delta, 0), 0.05);
    this.time += dt;
    this.root.updateWorldMatrix(true, false);
    this.root.getWorldQuaternion(this.rootQ);
    this.inverseRoot.copy(this.root.matrixWorld).invert();
    const pose = input.pose ?? "default";
    const seated = pose === "seated" || pose === "driver";
    const airborne = !input.isGrounded;
    const running = !!input.isRunning || input.speed > 3.1;
    const moving = input.speed > 0.08 && !airborne && !seated && !input.isJumping &&
      (pose === "default" || pose === "crouching" || pose === "crawling");
    if (!this.wasGrounded && input.isGrounded) this.landing = 0.24;
    this.wasGrounded = input.isGrounded;
    this.landing = Math.max(0, this.landing - dt);
    this.blend = THREE.MathUtils.lerp(this.blend, moving ? 1 : 0, damping(12, dt));
    this.seat = THREE.MathUtils.lerp(this.seat, input.seatWeight ?? (seated ? 1 : 0), this.initialized ? damping(14, dt) : 1);
    // Faster running adds flight time instead of spinning the legs at cartoon speed.
    const sprint = clamp((input.speed - 3.5) / 6, 0, 1);
    const stance = running ? 0.36 - sprint * 0.11 : 0.62;
    const halfStride = running ? 0.46 + sprint * 0.04 : 0.42;
    if (moving) this.phase += dt * input.speed * stance / (halfStride * 2);
    const alpha = this.initialized ? damping(22, dt) : 1;
    const cycle = this.phase * TAU;
    const jump = input.jumpProgress;
    const prepare = jump !== undefined && jump < 0.15 ? Math.sin(jump / 0.15 * Math.PI) : 0;
    const compression = Math.max(prepare * 0.09, Math.sin(this.landing / 0.24 * Math.PI) * 0.1);
    const crouch = pose === "crouching";
    const crawl = pose === "crawling";
    // Seated world height is owned by the caller. Do not lower it a second time.
    const hipTarget = crouch ? -0.36 : crawl ? -0.62 : pose === "sliding" ? -0.48 :
      -compression - this.blend * (0.045 + Math.cos(cycle * 2) * 0.043);
    this.hipsOffset = THREE.MathUtils.lerp(this.hipsOffset, hipTarget, alpha);
    const hips = this.joints.Hips;
    if (hips) {
      hips.bone.position.y = hips.position.y + this.hipsOffset;
      this.torso("Hips", 0, Math.sin(cycle) * this.blend * 0.035, Math.cos(cycle) * this.blend * 0.02, alpha);
    }
    const lean = crawl ? 0.85 : crouch ? 0.3 : running && moving ? 0.1 : 0;
    this.torso("Spine", lean * 0.5 + Math.sin(this.time * 1.6) * 0.006, -Math.sin(cycle) * this.blend * 0.04, 0, alpha);
    this.torso("Spine1", lean * 0.75, -Math.sin(cycle) * this.blend * 0.055, 0, alpha);
    this.torso("Spine2", lean, -Math.sin(cycle) * this.blend * 0.07, 0, alpha);

    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? "Left" : "Right";
      const sign = i === 0 ? 1 : -1;
      const foot = this.joints[side + "Foot"];
      const thigh = this.joints[side + "UpLeg"];
      const shin = this.joints[side + "Leg"];
      if (!foot || !thigh || !shin) continue;
      const phase = (this.phase + i * 0.5) % 1;
      const swing = clamp((phase - stance) / (1 - stance), 0, 1);
      const inStance = phase < stance;
      const travel = inStance ? halfStride * (1 - 2 * phase / stance)
        : halfStride * (-1 + 2 * (swing * swing * (3 - 2 * swing)));
      this.localTarget.copy(foot.position);
      this.localTarget.z += travel * this.blend;
      this.localTarget.y += Math.sin(Math.PI * swing) * (running ? 0.24 : 0.13) * this.blend;
      const lock = this.feet[i];
      const canPlant = moving && pose === "default" && inStance && this.blend > 0.98;
      if (canPlant) {
        if (!lock.planted) lock.anchor.copy(this.localTarget).applyMatrix4(this.root.matrixWorld);
        this.localTarget.copy(lock.anchor).applyMatrix4(this.inverseRoot);
        this.position(side + "UpLeg", this.hip);
        // Release overextended anchors (sudden turns, teleports or sprint speed changes).
        if (this.localTarget.distanceTo(this.hip) > thigh.position.distanceTo(shin.position) + shin.position.distanceTo(foot.position)) {
          lock.planted = false;
          this.localTarget.copy(foot.position);
          this.localTarget.z += travel * this.blend;
        } else lock.planted = true;
      } else lock.planted = false;
      if (this.seat > 0.001) {
        this.position(side + "UpLeg", this.hip);
        const upperLength = thigh.position.distanceTo(shin.position);
        const lowerLength = shin.position.distanceTo(foot.position);
        this.b.set(this.hip.x, this.hip.y - lowerLength, this.hip.z + upperLength * 0.98);
        this.localTarget.lerp(this.b, this.seat);
      } else if (airborne) {
        this.localTarget.y += input.verticalVelocity > 0 ? 0.14 : 0.06;
        this.localTarget.z -= input.verticalVelocity > 0 ? 0.12 : 0.04;
      } else if (crawl) {
        this.localTarget.y += 0.05;
        this.localTarget.z -= 0.24;
      } else if (pose === "sliding") {
        this.localTarget.z += i === 0 ? 0.6 : -0.12;
      } else if (pose === "dancing") {
        this.localTarget.y += Math.max(0, Math.sin(this.time * 5 + i * Math.PI)) * 0.09;
      }
      this.solveLeg(side, this.localTarget, canPlant && lock.planted ? 1 : alpha);

      // Upper arms hang from shoulders; elbows flex forward. Opposite arm leads each leg.
      let shoulderAngle = -Math.cos(cycle + i * Math.PI) * (running ? 0.65 : 0.3) * this.blend - 0.045;
      let elbowAngle = running && moving ? 1.25 : 0.16 + this.blend * 0.1;
      let spread = 0.065;
      let palmsDown = false;
      if (this.seat > 0.001) {
        shoulderAngle = THREE.MathUtils.lerp(shoulderAngle, 0.12, this.seat);
        elbowAngle = THREE.MathUtils.lerp(elbowAngle, 1.45, this.seat);
        palmsDown = true;
      }
      if (pose === "driver") {
        const steering = clamp(input.steerAngle ?? 0, -1, 1);
        shoulderAngle = 0.55 + sign * steering * 0.18;
        elbowAngle = 0.95 - sign * steering * 0.12;
      }
      else if (airborne) { shoulderAngle = input.verticalVelocity > 0 ? 0.65 : 0.35; elbowAngle = 0.8; spread = 0.14; }
      else if (crouch) { shoulderAngle = 0.32; elbowAngle = 0.55; }
      else if (crawl) { shoulderAngle = 0.5; elbowAngle = 0.25; }
      else if (pose === "flinching") { shoulderAngle = 0.85; elbowAngle = 1.5; }
      else if (pose === "dancing") { shoulderAngle = 0.8 + Math.sin(this.time * 4 + i) * 0.45; elbowAngle = 0.9; spread = 0.3; }
      else if (pose === "singing" && i === 1) { shoulderAngle = 0.4; elbowAngle = 1; }
      this.upperDirection.set(sign * spread, -Math.cos(shoulderAngle), Math.sin(shoulderAngle));
      this.aim(side + "Arm", this.upperDirection, alpha);
      this.lowerDirection.set(sign * 0.035, -Math.cos(shoulderAngle + elbowAngle), Math.sin(shoulderAngle + elbowAngle));
      this.aim(side + "ForeArm", this.lowerDirection, alpha);
      // Hands continue the forearm line, with only a tiny typing motion at the wrist.
      if (palmsDown) this.lowerDirection.y = Math.sin(this.time * 9 + i) * 0.025;
      this.aim(side + "Hand", this.lowerDirection, alpha, side, palmsDown);
      for (const finger of this.fingers) {
        if (finger.side !== side) continue;
        this.rotation.setFromAxisAngle(finger.axis, finger.bend * (running && moving ? 1.8 : 1));
        this.q.copy(finger.joint.local).multiply(this.rotation);
        finger.joint.bone.quaternion.slerp(this.q, alpha);
      }
    }
    let yaw = 0, pitch = 0;
    if (input.lookAtTarget && this.joints.Head) {
      this.localTarget.copy(input.lookAtTarget).applyMatrix4(this.inverseRoot);
      this.position("Head", this.a);
      this.localTarget.sub(this.a);
      const distance = Math.hypot(this.localTarget.x, this.localTarget.z);
      if (distance < 7.5 && this.localTarget.z > 0) {
        yaw = clamp(Math.atan2(this.localTarget.x, this.localTarget.z), -0.65, 0.65);
        pitch = clamp(-Math.atan2(this.localTarget.y, distance), -0.2, 0.2);
      }
    }
    this.torso("Neck", pitch * 0.3, yaw * 0.3, 0, alpha);
    this.torso("Head", pitch, yaw, 0, alpha);
    this.root.updateWorldMatrix(false, true);
    this.initialized = true;
  }
}
