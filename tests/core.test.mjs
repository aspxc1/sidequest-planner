import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, validateWorkspace, progress, makeWorkspace, templates, selectArchitecture } from '../src/core.mjs';

test('each idea creates an independent project with valid milestone references', () => {
  for (const idea of templates.filter(t => t.id !== 'blank')) {
    const p = createProject({ title: 'Test project', template: idea.id });
    const q = createProject({ title: 'Second project', template: idea.id });
    assert.notEqual(p.id, q.id);
    assert.ok(p.tasks.length > 0);
    assert.ok(p.tasks.every(t => p.milestones.some(m => m.id === t.milestone)));
    p.tasks[0].title = 'Changed';
    assert.notEqual(q.tasks[0].title, 'Changed');
    assert.equal(validateWorkspace(makeWorkspace(p)).projects[0].title, 'Test project');
  }
});
test('progress derives from task status and handles no tasks', () => {
  assert.equal(progress([]), 0);
  assert.equal(progress([{ status: 'done' }, { status: 'todo' }]), 50);
  assert.equal(progress([{ status: 'done' }]), 100);
});
test('workspace backup roundtrip preserves Unicode and code-like text', () => {
  const p = createProject({ title: '<script> & مشروع', template: 'blank' });
  const w = makeWorkspace(p);
  assert.deepEqual(validateWorkspace(JSON.parse(JSON.stringify(w))), w);
});
test('malformed imports, invalid status, duplicate IDs and dangling references are rejected', () => {
  const original = makeWorkspace(createProject({title:'Valid',template:'backend'}));
  for (const change of [
    w => w.projects[0].tasks = {},
    w => w.projects[0].tasks[0].status = 'imaginary',
    w => w.projects[0].tasks[0].milestone = 'missing',
    w => w.projects[0].tasks.push({...w.projects[0].tasks[0]}),
    w => w.projects[0].scope = null,
    w => w.activeProject = 'missing',
    w => w.schemaVersion = 90,
    w => w.notes.push({id:'x',title:'x',body:5,category:'General'})
  ]) {
    const w = structuredClone(original); change(w);
    assert.throws(() => validateWorkspace(w), /backup/i);
  }
});
test('blank title is rejected; extra prototype properties do not roundtrip', () => {
  assert.throws(() => createProject({title:'  ',template:'blank'}));
  const w = makeWorkspace(createProject({title:'Valid',template:'blank'}));
  assert.equal(w.projects[0].tasks.length,0);
  const result = validateWorkspace(JSON.parse(JSON.stringify(w).replace('"schemaVersion":1','"__proto__":{"polluted":true},"schemaVersion":1')));
  assert.equal(Object.hasOwn(result,'__proto__'),false);
  assert.equal({}.polluted,undefined);
});
test('selecting an approach with a maximum-length name keeps a reloadable decision', () => {
  const p=createProject({title:'Long names',template:'blank'});
  p.options.push({id:'long',name:'A'.repeat(300),style:'One process',stack:'JS',strengths:'Simple',tradeoffs:'Shared release',effort:'Small',selected:false});
  selectArchitecture(p,'long');
  assert.equal(p.options[0].selected,true);
  assert.ok(p.decisions[0].title.length<=300);
  assert.equal(validateWorkspace(makeWorkspace(p)).projects[0].decisions.length,1);
});
test('backup dates must be real calendar dates, not markup or malformed strings', () => {
  const base=makeWorkspace(createProject({title:'Dates',template:'blank'}));
  for(const date of ['<b>x</b>','2026-02-30','2026-13-01','Nov 13']){
    const w=structuredClone(base);w.projects[0].milestones[0].due=date;
    assert.throws(()=>validateWorkspace(w),/backup/i);
  }
});
test('large Unicode backups roundtrip without a smaller import size ceiling', () => {
  const w=makeWorkspace(createProject({title:'Unicode',template:'blank'}));
  w.notes=Array.from({length:15},(_,i)=>({id:`note-${i}`,title:'Reusable note',category:'General',body:'项'.repeat(100000),updatedAt:'2026-11-13'}));
  const text=JSON.stringify(w);
  assert.ok(Buffer.byteLength(text,'utf8')>4*1024*1024);
  assert.deepEqual(validateWorkspace(JSON.parse(text)),w);
});
