import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {randomUUID} from 'node:crypto';
import '../scripts/build.mjs';
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
test('standalone bundle starts and renders every required view', () => {
  for(const [route,title] of Object.entries({overview:'Incident Brief',scope:'Scope &amp; brief',roadmap:'Roadmap',board:'Task board',architecture:'Architecture',api:'API &amp; data',decisions:'Technical decisions',deploy:'Deployment checklist',ideas:'A good idea is a starting point.',notes:'Notes worth keeping'})){
    const values=new Map();const app={innerHTML:'',contains:()=>false};
    const document={activeElement:null,querySelector:s=>s==='#app'?app:{addEventListener(){}},addEventListener(){}};
    runInNewContext(script,{document,window:{addEventListener(){}},localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},location:{hash:`#${route}`},crypto:{randomUUID},console,Blob,setTimeout,clearTimeout});
    assert.ok(app.innerHTML.includes(`<h1>${title}</h1>`),`${route} renders its heading`);
    assert.ok(!app.innerHTML.includes('Local storage needs attention'),`${route} saves a valid initial workspace`);
  }
});
