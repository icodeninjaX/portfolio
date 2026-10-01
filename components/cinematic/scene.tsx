"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { activeDemo, demos, getPlayback } from './demo-timeline';
import { drawDetail, drawReplay, SCREEN_H, SCREEN_W } from './demo-renderer';
import { createJourneyController, observeJourney, type JourneyController } from './scroll';

function BrowserReplay({ project, progress, visible, settled }: { project:number; progress:RefObject<number>; visible:boolean; settled:()=>void }) {
  const invalidate=useThree(s=>s.invalidate);
  const group=useRef<THREE.Group>(null), detail=useRef<THREE.Group>(null);
  const face=useRef<THREE.MeshBasicMaterial>(null), edge=useRef<THREE.MeshStandardMaterial>(null), popup=useRef<THREE.MeshBasicMaterial>(null);
  const sources=useRef<HTMLImageElement[]>([]), lastTime=useRef(-1);
  const media=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=SCREEN_W;canvas.height=SCREEN_H;
    const detailCanvas=document.createElement('canvas');detailCanvas.width=900;detailCanvas.height=500;
    const texture=new THREE.CanvasTexture(canvas),detailTexture=new THREE.CanvasTexture(detailCanvas);
    for(const tex of [texture,detailTexture]){tex.colorSpace=THREE.SRGBColorSpace;tex.minFilter=THREE.LinearFilter;tex.generateMipmaps=false;}
    return {canvas,detailCanvas,texture,detailTexture};
  },[]);
  const mediaRef=useRef(media);
  useLayoutEffect(()=>{mediaRef.current=media;lastTime.current=-1;},[media]);
  useEffect(()=>{
    let disposed=false,completed=0;
    sources.current=[];
    const images=[0,1,2].map(view=>{
      const image=new Image();
      const finish=()=>{if(disposed)return;completed++;if(completed===3){lastTime.current=-1;settled();invalidate();}};
      image.onload=()=>{if(!disposed)sources.current[view]=image;finish();};
      // Keep the static fallback visible if any required replay view is unavailable.
      image.onerror=()=>{if(!disposed)invalidate();};
      image.src=`/studio/demo-${project}-${view}.webp`;return image;
    });
    return ()=>{disposed=true;images.forEach(image=>{image.onload=null;image.onerror=null;});};
  },[project,settled,invalidate]);
  useEffect(()=>()=>{media.texture.dispose();media.detailTexture.dispose();},[media]);
  useFrame(()=>{
    if(!group.current||!visible)return;
    const state=getPlayback(progress.current,project);
    group.current.visible=state.opacity>.002;
    if(!group.current.visible)return;
    const zoom=state.modal;
    // Camera blocking follows the interaction: overview, navigation, detail, then return.
    group.current.position.set(state.x,-0.12+zoom*.12,zoom*.22);
    group.current.rotation.set(.12-Math.sin(state.t*Math.PI)*.20,-.22+Math.sin(state.t*Math.PI*1.7)*.33,-.015+state.t*.03);
    group.current.scale.setScalar(.97+zoom*.025);
    if(face.current){face.current.opacity=state.opacity;face.current.depthWrite=state.opacity>.95;}
    if(edge.current){edge.current.opacity=state.opacity;edge.current.depthWrite=state.opacity>.95;}
    if(detail.current){detail.current.visible=zoom>.002;detail.current.position.set(.15,0.12,.08+zoom*.82);detail.current.rotation.set(.035*zoom,-.08*zoom,0);detail.current.scale.setScalar(.93+zoom*.07);}
    if(popup.current){popup.current.opacity=state.opacity*zoom;popup.current.depthWrite=zoom>.95;}
    if(sources.current.filter(Boolean).length===3&&Math.abs(lastTime.current-state.t)>.00001){
      const owned=mediaRef.current;
      const ctx=owned.canvas.getContext('2d'),detailCtx=owned.detailCanvas.getContext('2d');
      if(ctx&&detailCtx){drawReplay(ctx,sources.current,project,state.t);drawDetail(detailCtx,sources.current[1],project,state.t);owned.texture.needsUpdate=true;owned.detailTexture.needsUpdate=true;lastTime.current=state.t;}
    }
  });
  const width=7,height=width*SCREEN_H/SCREEN_W;
  return <group ref={group} visible={false}>
    <mesh position={[0,0,-.07]}><boxGeometry args={[width+.045,height+.045,.13]}/><meshStandardMaterial ref={edge} transparent color="#54647b" metalness={.6} roughness={.3}/></mesh>
    <mesh><planeGeometry args={[width,height]}/><meshBasicMaterial ref={face} transparent map={media.texture} toneMapped={false}/></mesh>
    <group ref={detail} visible={false}><mesh><planeGeometry args={[4.75,4.75*500/900]}/><meshBasicMaterial ref={popup} transparent map={media.detailTexture} toneMapped={false}/></mesh></group>
  </group>;
}

function Structure({ visible, controller, onReady }: { dark:boolean; visible:boolean; controller:RefObject<JourneyController>; onReady:()=>void }) {
  const {camera,invalidate}=useThree();
  const progress=useRef(-1),completed=useRef(0),revealed=useRef(false),frames=useRef(0),revealFrame=useRef(0);
  const settled=useCallback(()=>{completed.current++;invalidate();},[invalidate]);
  useEffect(()=>{invalidate();return controller.current.subscribe(invalidate);},[controller,invalidate]);
  useEffect(()=>{invalidate();return()=>cancelAnimationFrame(revealFrame.current);},[visible,invalidate]);
  useFrame(({gl},delta)=>{
    const state=controller.current.state;if(!visible||!state.visible)return;
    if(progress.current<0)progress.current=state.progress;
    const diff=state.progress-progress.current;
    progress.current=Math.abs(diff)<.0004?state.progress:progress.current+diff*(1-Math.exp(-Math.min(delta,.05)*10));
    const aspect=(camera as THREE.PerspectiveCamera).aspect;
    const fov=(camera as THREE.PerspectiveCamera).fov*Math.PI/180;
    const distance=Math.max(7.6/(2*Math.tan(fov/2)*aspect*.94),4.8/(2*Math.tan(fov/2)*.84));
    camera.position.set(0,.15,distance);camera.lookAt(0,0,0);
    const id=activeDemo(progress.current),play=getPlayback(progress.current,id);
    const bar=document.getElementById('demo-progress');if(bar)bar.style.transform=`scaleX(${play.t})`;
    if(process.env.NODE_ENV!=='production'){
      gl.domElement.dataset.progress=progress.current.toFixed(4);gl.domElement.dataset.frames=String(++frames.current);
      gl.domElement.dataset.demo=String(id);gl.domElement.dataset.phase=play.t.toFixed(4);gl.domElement.dataset.view=String(play.view);gl.domElement.dataset.modal=play.modal.toFixed(3);
      gl.domElement.dataset.drawCalls=String(gl.info.render.calls);
    }
    if(Math.abs(diff)>=.0004)invalidate();
    if(!revealed.current&&completed.current>=3){revealed.current=true;revealFrame.current=requestAnimationFrame(onReady);}
  },-1);
  return <><ambientLight intensity={1.8}/><directionalLight position={[0,4,6]} intensity={3}/>
    {demos.map((demo,i)=><BrowserReplay key={demo.name} project={i} progress={progress} visible={visible} settled={settled}/>)}</>;
}
export default function Scene({ dark, visible }: { dark: boolean; visible: boolean }) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const reveal = useCallback(() => setReady(true), []);
  const controller = useRef<JourneyController>(createJourneyController());
  const cleanup = useRef<(() => void) | null>(null);
  const mounted = useRef(false);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; cleanup.current?.(); };
  }, []);
  useEffect(() => {
    const journey = controller.current;
    return observeJourney(journey.state, journey.notify);
  }, []);
  if (failed) return null;
  return <div className={`studio-canvas ${ready ? "is-ready" : ""}`} aria-hidden="true">
    <Canvas frameloop={visible ? "demand" : "never"} dpr={[1, 1.5]} camera={{ position: [2.1, 0.7, 10.5], fov: 38, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={<span />}
      onCreated={({ gl }) => {
        const lost = (e: Event) => {
          e.preventDefault();
          // R3F intentionally releases its context on route/Activity teardown.
          // Only a loss in a mounted, visible canvas is a runtime failure.
          if (mounted.current && gl.domElement.isConnected && gl.domElement.getBoundingClientRect().width > 0) setFailed(true);
        };
        gl.domElement.addEventListener("webglcontextlost", lost);
        cleanup.current = () => gl.domElement.removeEventListener("webglcontextlost", lost);
      }}>
      <Structure dark={dark} visible={visible} controller={controller} onReady={reveal} />
    </Canvas>
  </div>;
}


