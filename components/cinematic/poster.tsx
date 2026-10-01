"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { observeJourney } from './scroll';
import { activeDemo, demos, getPlayback } from './demo-timeline';

/** A readable single-view alternative remains when motion or WebGL is unavailable. */
export function StudioPoster() {
  const [frame,setFrame]=useState({project:0,view:0,step:0});
  useEffect(()=>{
    const state={progress:0,visible:true,mobile:false};let previous='';
    return observeJourney(state,()=>{
      const project=activeDemo(state.progress),play=getPlayback(state.progress,project);
      const key=`${project}:${play.view}:${play.step}`;
      if(key===previous)return;previous=key;setFrame({project,view:play.view,step:play.step});
      const caption=document.getElementById('studio-caption');if(caption)caption.textContent=`0${project+1} / ${demos[project].name} · ${demos[project].views[play.view]}`;
    });
  },[]);
  const demo=demos[frame.project];
  return <>
    <div className="stage-story" aria-hidden="true"><span>0{frame.project+1} / PRODUCT WALKTHROUGH</span><p>{demo.name}<small>{demo.steps[frame.step]}</small></p></div>
    <div className="studio-poster demo-poster" aria-hidden="true"><div className="demo-static-browser"><div className="demo-static-chrome"><i/><i/><i/><span>{demo.name} / {demo.views[frame.view]}</span></div><Image src={`/studio/demo-${frame.project}-${frame.view}.webp`} alt="" width={1427} height={728} unoptimized loading="eager" /></div></div>
    <div className="demo-steps" aria-hidden="true">{demo.steps.map((step,i)=><span className={i===frame.step?'is-active':''} key={step}><b>0{i+1}</b>{step}</span>)}<div className="demo-progress-track"><i id="demo-progress"/></div></div>
  </>;
}
