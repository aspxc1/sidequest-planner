import { createServer } from 'node:http';
import { readFile, watch } from 'node:fs';
import { build } from './build.mjs';
const port=Number(process.env.SIDEQUEST_PORT||4173);
let rebuilding;
watch(new URL('../src/',import.meta.url),()=>{clearTimeout(rebuilding);rebuilding=setTimeout(()=>build().catch(console.error),100);});
const server=createServer((req,res)=>{
  if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return;}
  if(!['/','/index.html'].includes(req.url?.split('?')[0])){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return;}
  readFile(new URL('../dist/index.html',import.meta.url),(error,html)=>{if(error){res.writeHead(500);res.end('Build unavailable. Run npm run build.');return;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"});res.end(html);});
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. If Sidequest is running, open http://localhost:${port}. Otherwise set SIDEQUEST_PORT to another port.`:error.message);process.exit(1);});
server.listen(port,'127.0.0.1',()=>console.log(`Sidequest ready at http://localhost:${port}`));
