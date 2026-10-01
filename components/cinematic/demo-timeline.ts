export const demos = [
  { name: 'TRACKY', accent: '#35e5d6', views: ['Dashboard', 'Transactions', 'Budgets'], steps: ['Spending overview', 'Open transactions', 'Inspect an expense', 'Explore budgets'], nav: [[0.086,0.36],[0.088,0.493]], row: [0.57,0.469], selection: [0.23,0.415,0.74,0.10], detail: ['Transaction details', 'Dubai Chewy', 'Food', '−₱240.00'], crop: [0.23,0.415,0.74,0.105] },
  { name: 'Coop-Tracker', accent: '#aca7ff', views: ['Dashboard', 'Members', 'Loans'], steps: ['Financial overview', 'Open members', 'Inspect member shares', 'Explore loans'], nav: [[0.45,0.042],[0.51,0.042]], row: [0.92,0.44], selection: [0.068,0.393,0.865,0.098], detail: ['Member overview', 'Keith Vergara', 'Member ID: 1', '5 capital shares'], crop: [0.068,0.393,0.865,0.098] },
  { name: '371admin', accent: '#f3aa64', views: ['Dashboard', 'Devices', 'Offline devices'], steps: ['Operations overview', 'Open device monitoring', 'Inspect a device', 'Filter offline devices'], nav: [[0.075,0.195],[0.714,0.132]], row: [0.54,0.612], selection: [0.174,0.54,0.802,0.15], detail: ['Device overview', 'XJEEP-0000164', 'TAGUIG Tsc · X-Jeep Screen', 'Offline / needs attention'], crop: [0.174,0.54,0.802,0.15] },
] as const;
export const smooth = (a: number, b: number, x: number) => { const t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); };
export function demoPhase(t: number) {
  const view = t < 0.18 ? 0 : t < 0.84 ? 1 : 2;
  const modal = smooth(0.43,0.49,t)*(1-smooth(0.66,0.72,t));
  return { view, modal, step: t<0.18?0:t<0.43?1:t<0.74?2:3, click: Math.max(...[0.155,0.43,0.665,0.815].map(at=>Math.max(0,1-Math.abs(t-at)/0.035))) };
}
export function getPlayback(progress: number, project: number) {
  const start = project + 1;
  const enter = project === 0 ? 1 : smooth(start-0.08,start+0.04,progress);
  const leave = project === 2 ? 0 : smooth(start+0.92,start+1.04,progress);
  const t = Math.max(0,Math.min(1,(progress-start)/0.9));
  return { t, opacity:enter*(1-leave), x:(1-enter)*1.8-leave*1.8, ...demoPhase(t) };
}
export function activeDemo(progress: number) { return Math.max(0,Math.min(2,Math.floor(progress-0.96))); }
export function cursorAt(project: number, t: number): [number, number] {
  const d=demos[project];
  const keys: [number,number,number][]=[[0,0.73,0.72],[0.12,...d.nav[0]],[0.20,...d.nav[0]],[0.39,...d.row],[0.49,...d.row],[0.63,0.72,0.27],[0.71,0.72,0.27],[0.79,...d.nav[1]],[0.87,...d.nav[1]],[1,0.69,0.65]];
  let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;
  const a=keys[i],b=keys[i+1],f=smooth(a[0],b[0],t);
  return [a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f];
}
