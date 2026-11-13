import { validateWorkspace } from './core.mjs';
export const STORAGE_KEY = 'sidequest.workspace.v1';
export function createStore(storage) {
  let lastRaw;
  return {
    load() { const raw=storage.getItem(STORAGE_KEY); lastRaw=raw; return raw===null ? null : validateWorkspace(JSON.parse(raw)); },
    save(workspace) {
      if(storage.getItem(STORAGE_KEY)!==lastRaw) throw new Error('Your workspace changed in another tab. Export this tab’s work, then reload to see the latest version.');
      const raw=JSON.stringify(validateWorkspace(workspace));
      storage.setItem(STORAGE_KEY,raw); lastRaw=raw;
    },
    replace(workspace) { const raw=JSON.stringify(validateWorkspace(workspace)); storage.setItem(STORAGE_KEY,raw); lastRaw=raw; }
  };
}
