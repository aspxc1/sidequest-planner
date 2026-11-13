import { readFile, mkdir, writeFile } from 'node:fs/promises';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
export async function build(){
  const [shell,style,...scripts]=await Promise.all([read('src/shell.html'),read('src/style.css'),...['core.mjs','storage.mjs','seed.mjs','app.js'].map(s=>read(`src/${s}`))]);
  const js=scripts.map(s=>s.replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'')).join('\n');
  const html=shell.replace('/* STYLES */',style).replace('/* APPLICATION */',()=>`(()=>{\n'use strict';\n${js}\n})();`.replace(/<\/script/gi,'<\\/script'));
  await mkdir(new URL('../dist/',import.meta.url),{recursive:true});
  await writeFile(new URL('../dist/index.html',import.meta.url),html);
  console.log(`Built standalone app (${Math.round(Buffer.byteLength(html)/1024)} KB)`);
  return html;
}
await build();
