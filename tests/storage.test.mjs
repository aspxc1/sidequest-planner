import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore, STORAGE_KEY } from '../src/storage.mjs';
import { makeWorkspace, createProject } from '../src/core.mjs';
import { exampleWorkspace } from '../src/seed.mjs';
const memory = () => { const values = new Map(); return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)}; };
test('saved data reloads exactly and the example conforms to the import schema', () => {
  const backing=memory(); const store=createStore(backing);
  const w=exampleWorkspace(); assert.equal(store.load(),null); store.save(w);
  assert.deepEqual(createStore(backing).load(),w);
});
test('a stale tab cannot overwrite a newer workspace', () => {
  const backing=memory(); const first=createStore(backing), second=createStore(backing);
  first.load(); second.load();
  const w=makeWorkspace(createProject({title:'First'})); first.save(w);
  assert.throws(()=>second.save(makeWorkspace(createProject({title:'Second'}))),/another tab/);
  assert.equal(createStore(backing).load().projects[0].title,'First');
});
test('corrupt data stays intact and a quota failure is reported', () => {
  const backing=memory(); backing.setItem(STORAGE_KEY,'broken');
  assert.throws(()=>createStore(backing).load());
  assert.equal(backing.getItem(STORAGE_KEY),'broken');
  const unavailable=createStore({getItem:()=>null,setItem:()=>{throw new Error('Quota exceeded');}});
  unavailable.load();
  assert.throws(()=>unavailable.save(makeWorkspace(createProject({title:'Unsaved'}))),/Quota/);
});
