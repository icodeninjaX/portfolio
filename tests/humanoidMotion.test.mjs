import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import * as THREE from "three";
import { HumanoidAnimator, sampleOfficeJump } from "../lib/humanoidMotion.ts";

// Read the actual shipped GLB skeletons without a browser or texture mocks.
function loadRig(model) {
  const bytes = fs.readFileSync(new URL("../public/models/" + model + ".glb", import.meta.url));
  const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  const boneIndices = new Set(json.skins.flatMap((skin) => skin.joints));
  const nodes = json.nodes.map((node, index) => {
    const object = boneIndices.has(index) ? new THREE.Bone() : new THREE.Object3D();
    object.name = node.name ?? "";
    if (node.translation) object.position.fromArray(node.translation);
    if (node.rotation) object.quaternion.fromArray(node.rotation);
    if (node.scale) object.scale.fromArray(node.scale);
    return object;
  });
  json.nodes.forEach((node, index) => (node.children ?? []).forEach((child) => nodes[index].add(nodes[child])));
  const root = new THREE.Group();
  json.scenes[json.scene ?? 0].nodes.forEach((index) => root.add(nodes[index]));
  const animator = new HumanoidAnimator(root);
  const point = (name) => animator.joints[name].bone.getWorldPosition(new THREE.Vector3());
  return { root, animator, point };
}
const idle = { speed: 0, isGrounded: true, verticalVelocity: 0, isJumping: false, pose: "default" };

for (const model of ["male_avatar", "Aurora", "Celeste", "Lyra"]) {
  test(model + ": arms hang beside the torso and feet stay at their original floor height", () => {
    const { animator, point } = loadRig(model);
    const floor = point("LeftFoot").y;
    animator.update(idle, 1 / 60);
    for (const side of ["Left", "Right"]) {
      const shoulder = point(side + "Arm"), elbow = point(side + "ForeArm"), hand = point(side + "Hand");
      assert.ok(shoulder.y - elbow.y > 0.2, "elbow must be below the shoulder");
      assert.ok(elbow.y - hand.y > 0.17, "hand must hang below the elbow");
      assert.ok(Math.abs(hand.x - shoulder.x) < 0.1, "arm must not stick sideways");
      assert.ok(Math.abs(point(side + "Foot").y - floor) < 0.015, "feet stay grounded");
      assert.ok(hand.z > elbow.z, "elbows flex forward");
    }
  });

  test(model + ": knees bend forward and support feet remain fixed while walking", () => {
    const { animator, point, root } = loadRig(model);
    const walk = { ...idle, speed: 1.9 };
    let plantedSamples = 0;
    let previous = null;
    for (let frame = 0; frame < 180; frame++) {
      root.position.z += walk.speed / 60;
      animator.update(walk, 1 / 60);
      const ankle = point("LeftFoot"), hip = point("LeftUpLeg"), knee = point("LeftLeg");
      const line = ankle.clone().sub(hip).normalize();
      const projection = hip.clone().addScaledVector(line, knee.clone().sub(hip).dot(line));
      assert.ok(knee.z > projection.z - 0.005, "knees must not bend backward");
      if (previous && frame > 45 && ankle.distanceTo(previous) < 0.002) plantedSamples++;
      previous = ankle;
    }
    assert.ok(plantedSamples > 20, "stance must contain stationary support-foot frames");
  });

  test(model + ": seated pelvis is lowered only by the caller, knees and feet face forward", () => {
    const { animator, point } = loadRig(model);
    const originalHips = point("Hips").y;
    animator.update({ ...idle, pose: "seated" }, 1 / 60);
    assert.ok(Math.abs(point("Hips").y - originalHips) < 0.01);
    assert.ok(point("LeftLeg").z > point("LeftUpLeg").z + 0.25);
    assert.ok(point("LeftFoot").y < point("LeftLeg").y - 0.2);
  });

  test(model + ": all poses return to a grounded neutral stance without residual twists", () => {
    const { animator, point } = loadRig(model);
    animator.update(idle, 1 / 60);
    const neutralHand = point("LeftHand"), neutralFoot = point("LeftFoot");
    for (const pose of ["crouching", "crawling", "sliding", "dancing", "singing", "flinching", "driver", "seated"]) {
      for (let frame = 0; frame < 30; frame++) animator.update({ ...idle, pose }, 1 / 60);
      for (let frame = 0; frame < 90; frame++) animator.update(idle, 1 / 60);
      assert.ok(point("LeftHand").distanceTo(neutralHand) < 0.015, pose + " resets hands");
      assert.ok(point("LeftFoot").distanceTo(neutralFoot) < 0.005, pose + " resets feet");
      for (const { bone } of Object.values(animator.joints)) {
        assert.ok(bone.quaternion.toArray().every(Number.isFinite));
        assert.ok(Math.abs(bone.quaternion.length() - 1) < 1e-5);
      }
    }
  });

  test(model + ": rotating the character preserves the same anatomical pose", () => {
    const first = loadRig(model), second = loadRig(model);
    second.root.rotation.y = Math.PI / 2;
    first.animator.update(idle, 1 / 60);
    second.animator.update(idle, 1 / 60);
    const expected = first.point("LeftHand").applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    assert.ok(expected.distanceTo(second.point("LeftHand")) < 1e-6);
  });
}

test("distance-based phase is identical at 30, 60 and 120 fps and stops during idle/flight", () => {
  const phases = [30, 60, 120].map((fps) => {
    const { animator } = loadRig("male_avatar");
    for (let i = 0; i < fps * 2; i++) animator.update({ ...idle, speed: 1.9 }, 1 / fps);
    const phase = animator.phase;
    animator.update(idle, 1 / fps);
    animator.update({ ...idle, speed: 1.9, isGrounded: false, isJumping: true }, 1 / fps);
    assert.equal(animator.phase, phase);
    return phase;
  });
  assert.ok(Math.max(...phases) - Math.min(...phases) < 1e-10);
});

test("NPC jump height and velocity share a continuous grounded-to-flight-to-landing cycle", () => {
  assert.equal(sampleOfficeJump(0).height, 0);
  assert.equal(sampleOfficeJump(1.45 * 0.94).height, 0);
  const apex = sampleOfficeJump(1.45 * (0.15 + 0.63 / 2));
  assert.ok(Math.abs(apex.height - 0.55) < 1e-8);
  assert.ok(Math.abs(apex.verticalVelocity) < 1e-8);
  assert.equal(apex.isGrounded, false);
  const t = 0.35, step = 1e-5;
  const derivative = (sampleOfficeJump(t + step).height - sampleOfficeJump(t - step).height) / (2 * step);
  assert.ok(Math.abs(derivative - sampleOfficeJump(t).verticalVelocity) < 1e-6);
});

test("live motion mutations stop gait immediately and repeated landings settle", () => {
  const { animator, point } = loadRig("male_avatar");
  const motion = { ...idle, speed: 1.9 };
  animator.update(motion, 1 / 60);
  assert.ok(animator.phase > 0);
  motion.speed = 0;
  const phase = animator.phase;
  for (let frame = 0; frame < 120; frame++) animator.update(motion, 1 / 60);
  assert.equal(animator.phase, phase, "blocked movement stops step progression");
  const standingHeight = point("Hips").y;
  for (let jump = 0; jump < 3; jump++) {
    motion.isGrounded = false;
    motion.isJumping = true;
    motion.verticalVelocity = 3;
    for (let frame = 0; frame < 20; frame++) animator.update(motion, 1 / 60);
    motion.verticalVelocity = -3;
    for (let frame = 0; frame < 20; frame++) animator.update(motion, 1 / 60);
    motion.isGrounded = true;
    motion.isJumping = false;
    motion.verticalVelocity = 0;
    for (let frame = 0; frame < 7; frame++) animator.update(motion, 1 / 60);
    assert.ok(point("Hips").y < standingHeight - 0.035, "landing absorbs impact");
    for (let frame = 0; frame < 90; frame++) animator.update(motion, 1 / 60);
    assert.ok(Math.abs(point("Hips").y - standingHeight) < 0.002, "landing returns to standing height");
  }
});
