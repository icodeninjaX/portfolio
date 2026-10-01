import { cursorAt, demoPhase, demos, smooth } from './demo-timeline';
export const SCREEN_W=1440, SCREEN_H=800, CHROME=64;
const round=(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
const text=(ctx:CanvasRenderingContext2D,value:string,x:number,y:number,size:number,color:string,weight=400)=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.fillText(value,x,y);};
export function drawReplay(ctx:CanvasRenderingContext2D, images:HTMLImageElement[], project:number,t:number) {
  const d=demos[project], phase=demoPhase(t), w=SCREEN_W,h=SCREEN_H-CHROME;
  ctx.clearRect(0,0,w,SCREEN_H);ctx.fillStyle='#172131';ctx.fillRect(0,0,w,SCREEN_H);
  const draw=(index:number,opacity:number)=>{if(!images[index])return;ctx.globalAlpha=opacity;ctx.drawImage(images[index],0,CHROME,w,h);ctx.globalAlpha=1;};
  draw(phase.view,1);
  // Brief view dissolve occurs after the corresponding cursor click.
  if(t>=0.18&&t<0.23){draw(0,1-smooth(0.18,0.23,t));}
  if(t>=0.84&&t<0.89){draw(1,1-smooth(0.84,0.89,t));}
  const selection=smooth(0.31,0.40,t)*(1-smooth(0.70,0.75,t));
  const [rx,ry,rw,rh]=d.selection;
  if(selection>0){ctx.globalAlpha=selection;ctx.fillStyle=d.accent+'16';ctx.strokeStyle=d.accent;ctx.lineWidth=3;round(ctx,rx*w,CHROME+ry*h,rw*w,rh*h,10);ctx.fill();ctx.stroke();ctx.globalAlpha=1;}
  if(phase.modal>0){ctx.fillStyle=`rgba(3,8,18,${phase.modal*.53})`;ctx.fillRect(0,CHROME,w,h);}
  ctx.fillStyle='#182230';ctx.fillRect(0,0,w,CHROME);
  ['#ff766e','#e7c765','#73c59c'].forEach((color,i)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(26+i*23,31,5,0,Math.PI*2);ctx.fill();});
  text(ctx,d.name,115,40,23,'#e7ecf5',700);
  ctx.fillStyle='#243244';round(ctx,420,14,595,36,8);ctx.fill();
  text(ctx,`${d.name.toLowerCase()} / ${d.views[phase.view].toLowerCase()}`,442,39,17,'#a9b9ce');
  text(ctx,'SCROLL REPLAY',1175,39,15,d.accent,700);
  if(phase.modal<.9){const [cx,cy]=cursorAt(project,t);drawCursor(ctx,cx*w,CHROME+cy*h,phase.click,d.accent);}
  // A thin progress line makes the scrub direction visible without auto-playing.
  ctx.fillStyle=d.accent;ctx.fillRect(0,SCREEN_H-3,w*t,3);
}
export function drawCursor(ctx:CanvasRenderingContext2D,x:number,y:number,click:number,accent:string) {
  ctx.save();ctx.translate(x,y);
  if(click>0){ctx.strokeStyle=accent;ctx.globalAlpha=click;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,12+(1-click)*29,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
  ctx.shadowColor='#0008';ctx.shadowBlur=8;ctx.fillStyle='#fff';ctx.strokeStyle='#151d2e';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,29);ctx.lineTo(8,21);ctx.lineTo(15,36);ctx.lineTo(21,32);ctx.lineTo(14,18);ctx.lineTo(26,18);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
}
export function drawDetail(ctx:CanvasRenderingContext2D,image:HTMLImageElement,project:number,t:number) {
  const d=demos[project],w=900,h=500;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#152132';ctx.strokeStyle='#60748f';ctx.lineWidth=2;round(ctx,2,2,w-4,h-4,24);ctx.fill();ctx.stroke();
  ctx.fillStyle=d.accent;ctx.fillRect(34,39,5,32);
  text(ctx,d.detail[0],58,65,27,'#eaf0fa',700);text(ctx,'×',845,66,36,'#a8b7ca');
  text(ctx,d.detail[1],40,142,37,'#ffffff',700);text(ctx,d.detail[2],40,190,25,'#a2b2c9');
  text(ctx,d.detail[3],40,248,31,d.accent,700);
  const [x,y,cw,ch]=d.crop;
  const cropHeight=Math.min(122,824*(ch*image.height)/(cw*image.width));
  ctx.save();round(ctx,38,285,824,122,12);ctx.clip();ctx.drawImage(image,x*image.width,y*image.height,cw*image.width,ch*image.height,38,285+(122-cropHeight)/2,824,cropHeight);ctx.restore();
  text(ctx,'INTERFACE DETAIL / PORTFOLIO WALKTHROUGH',40,461,16,'#8b9bb3');
  // Cursor approaches the close control in the same scroll timeline.
  const move=smooth(.53,.63,t);drawCursor(ctx,650+move*195,375-move*319,demoPhase(t).click,d.accent);
}
