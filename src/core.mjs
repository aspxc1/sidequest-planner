export const statuses = ['backlog', 'todo', 'doing', 'done'];
export const kinds = ['software', 'gpt', 'mixed'];
export const uid = () => globalThis.crypto.randomUUID();
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const progress = tasks => tasks.length ? Math.round(tasks.filter(t => t.status === 'done').length / tasks.length * 100) : 0;
export const templates = [
  {id:'ai', category:'AI / ML', name:'Incident Brief', subtitle:'Turn noisy logs into useful incident summaries.', stack:'Python · FastAPI · PostgreSQL', goal:'Build an incident assistant that grounds every summary in evidence and handles model failure safely.', tasks:[['Validate and normalize log events','software'],['Store incidents and source evidence','software'],['Build a grounded summary prompt','gpt'],['Create an evaluation dataset','gpt'],['Add timeouts and deterministic fallback','mixed'],['Ship a repeatable deployment','software']]},
  {id:'backend', category:'Backend', name:'QueuePilot', subtitle:'A reliable job queue with retries and observability.', stack:'Node.js · PostgreSQL · Redis', goal:'Build a background-job service with idempotent processing, bounded retries and clear job visibility.', tasks:[['Define the job API and state model','software'],['Persist jobs with idempotency keys','software'],['Implement worker leases and retries','software'],['Add dead-letter queue inspection','software'],['Test concurrency and recovery','software'],['Deploy and document the runbook','software']]},
  {id:'devops', category:'DevOps', name:'Deploy Lens', subtitle:'Track deployment health and rollback readiness.', stack:'Go · Docker · GitHub Actions', goal:'Build a deployment tracker that records releases, checks health and makes rollback reproducible.', tasks:[['Define release and environment models','software'],['Build the deployment event endpoint','software'],['Add health checks and alert rules','software'],['Create CI release pipeline','software'],['Test rollback in staging','software'],['Publish operational runbook','software']]},
  {id:'blank', category:'Backend', name:'Your next project', subtitle:'Start with a blank brief and build your own plan.', stack:'Your stack, your scope', goal:'', tasks:[]}
];
export function createProject({title, template = 'blank', category}) {
  if (typeof title !== 'string' || !title.trim()) throw new Error('Give your project a name.');
  const idea = templates.find(t => t.id === template) || templates[3];
  const milestones = ['Define the foundation', 'Build the core', 'Validate & ship'].map((name,i) => ({id:uid(), title:name, description:['Agree on scope, contracts and the first useful deliverable.','Implement the main workflow and its failure paths.','Test realistic scenarios and make deployment repeatable.'][i],due:''}));
  return {id:uid(), title:title.trim(), category:category || idea.category, summary:idea.subtitle, goal:idea.goal, status:'planning', example:false, createdAt:today(), updatedAt:today(), scope:{in:[],out:[],success:[]}, milestones,
    tasks:idea.tasks.map(([name,kind],i) => ({id:uid(),title:name,kind,status:'backlog',priority:i<2?'high':'medium',milestone:milestones[Math.floor(i/2)].id,description:'',due:''})),
    options:[],components:[],apis:[],entities:[],deployment:[['Configuration','Environment variables documented'],['Quality','Automated checks pass'],['Release','Deployment steps are repeatable'],['Release','Rollback verified'],['Operations','Logs and health checks available']].map(([group,name]) => ({id:uid(),group,title:name,done:false})),decisions:[]};
}
export const makeWorkspace = project => ({schemaVersion:1,activeProject:project.id,projects:[project],notes:[]});

// Explicitly reconstruct records so unrecognized and prototype properties never enter app state.
export function validateWorkspace(input) {
  const fail = () => { throw new Error('This backup is not a valid Sidequest workspace. Your current work has not changed.'); };
  const obj = x => { if (!x || typeof x !== 'object' || Array.isArray(x)) fail(); return x; };
  const str = (x, max=100000) => { if(typeof x !== 'string' || x.length > max) fail(); return x; };
  const id = x => { str(x,100); if (!x) fail(); return x; };
  const bool = x => { if(typeof x !== 'boolean') fail(); return x; };
  const choice = (x,options) => { if(!options.includes(x)) fail(); return x; };
  const arr = (x,fn) => { if(!Array.isArray(x) || x.length>2000) fail(); return x.map(fn); };
  const records = (x,fn) => { const a = arr(x, r => fn(obj(r))); if(new Set(a.map(r=>r.id)).size!==a.length) fail(); return a; };
  obj(input); if(input.schemaVersion!==1) fail();
  const projects = records(input.projects, p => {
    const scope = obj(p.scope);
    const milestones = records(p.milestones, m => ({id:id(m.id),title:str(m.title,300),description:str(m.description),due:str(m.due,10)}));
    const tasks = records(p.tasks,t=>({id:id(t.id),title:str(t.title,300),description:str(t.description),status:choice(t.status,statuses),kind:choice(t.kind,kinds),priority:choice(t.priority,['low','medium','high']),milestone:str(t.milestone,100),due:str(t.due,10)}));
    if(tasks.some(t=>t.milestone && !milestones.some(m=>m.id===t.milestone))) fail();
    return {id:id(p.id),title:str(p.title,300),category:choice(p.category,['Backend','AI / ML','DevOps']),summary:str(p.summary),goal:str(p.goal),status:choice(p.status,['planning','building','paused','shipped']),example:bool(p.example),createdAt:str(p.createdAt,10),updatedAt:str(p.updatedAt,10),
      scope:{in:arr(scope.in,x=>str(x,1000)),out:arr(scope.out,x=>str(x,1000)),success:arr(scope.success,x=>str(x,1000))},milestones,tasks,
      options:records(p.options,o=>({id:id(o.id),name:str(o.name,300),style:str(o.style),stack:str(o.stack),strengths:str(o.strengths),tradeoffs:str(o.tradeoffs),effort:str(o.effort),selected:bool(o.selected)})),
      components:records(p.components,c=>({id:id(c.id),name:str(c.name,300),kind:choice(c.kind,kinds),description:str(c.description)})),
      apis:records(p.apis,a=>({id:id(a.id),method:choice(a.method,['GET','POST','PUT','PATCH','DELETE','EVENT']),path:str(a.path,1000),description:str(a.description),request:str(a.request),response:str(a.response)})),
      entities:records(p.entities,e=>({id:id(e.id),name:str(e.name,300),fields:str(e.fields),notes:str(e.notes)})),
      deployment:records(p.deployment,d=>({id:id(d.id),title:str(d.title,1000),group:str(d.group,100),done:bool(d.done)})),
      decisions:records(p.decisions,d=>({id:id(d.id),title:str(d.title,300),status:choice(d.status,['proposed','accepted','superseded']),context:str(d.context),decision:str(d.decision),consequences:str(d.consequences),date:str(d.date,10)}))};
  });
  if(!projects.length || !projects.some(p=>p.id===input.activeProject)) fail();
  return {schemaVersion:1,activeProject:id(input.activeProject),projects,notes:records(input.notes,n=>({id:id(n.id),title:str(n.title,300),category:str(n.category,100),body:str(n.body),updatedAt:str(n.updatedAt,10)}))};
}
