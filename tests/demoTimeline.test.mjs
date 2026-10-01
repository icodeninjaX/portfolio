import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoPhase,getPlayback,cursorAt,demos,activeDemo} from '../components/cinematic/demo-timeline.ts';

test('each demo opens a view, inspects a record, closes it and opens the final view',()=>{
  for(let project=0;project<3;project++){
    const at=t=>getPlayback(project+1+t*.9,project);
    assert.equal(at(.05).view,0);
    assert.equal(at(.26).view,1);
    assert.equal(at(.55).modal,1);
    assert.equal(at(.77).modal,0);
    assert.equal(at(.95).view,2);
  }
});
test('cursor reaches the actual project navigation before the screen switches',()=>{
  demos.forEach((demo,project)=>{
    assert.deepEqual(cursorAt(project,.155),[...demo.nav[0]]);
    assert.equal(demoPhase(.155).view,0);
    assert.deepEqual(cursorAt(project,.815),[...demo.nav[1]]);
    assert.equal(demoPhase(.815).view,1);
  });
});
test('scrubbing backwards restores the exact view, cursor and modal with no playback clock',()=>{
  const first=getPlayback(1.48,0),cursor=cursorAt(0,first.t);
  getPlayback(1.86,0);getPlayback(2.4,1);
  assert.deepEqual(getPlayback(1.48,0),first);
  assert.deepEqual(cursorAt(0,first.t),cursor);
  for(let i=0;i<100;i++)assert.deepEqual(getPlayback(1.48,0),first);
});
test('project handoffs stay visible and the active label follows the new project',()=>{
  for(const boundary of [2,3]){
    for(let p=boundary-.08;p<=boundary+.04;p+=.005){
      const weights=[0,1,2].map(i=>getPlayback(p,i).opacity);
      assert.ok(weights.some(w=>w>=.49));
    }
    assert.equal(activeDemo(boundary+.05),boundary-1);
  }
});
