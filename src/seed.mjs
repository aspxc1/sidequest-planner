import { createProject, makeWorkspace, uid } from './core.mjs';
export function exampleWorkspace() {
  const p = createProject({title:'Incident Brief',template:'ai'});
  p.example = true; p.status='building'; p.summary='An incident assistant that turns noisy logs into grounded, actionable summaries.';
  p.goal='Ingest application logs, group related errors, and produce a concise incident brief with source citations. Keep detection and alerting deterministic; use an LLM only to explain the evidence.';
  p.scope = {in:['Ingest structured JSON logs through a REST API','Group errors by service and incident window','Generate a grounded summary with source references','Expose incident history and a health endpoint'],out:['Autonomous remediation or production changes','Real-time log streaming at production scale','Multi-tenant billing and team permissions'],success:['A summary cites only events from its incident','Timeouts return the deterministic incident report','A clean checkout deploys with one documented command']};
  p.milestones = [
    {id:'m1',title:'Foundation & contracts',description:'Lock the scope, data model and ingestion contract.',due:'2026-11-15'},
    {id:'m2',title:'Ingestion & incident engine',description:'Validate logs, group events and expose incident history.',due:'2026-11-22'},
    {id:'m3',title:'Grounded AI summaries',description:'Add source-bound summaries, evaluations and safe fallbacks.',due:'2026-11-29'},
    {id:'m4',title:'Deploy & document',description:'Package the service and verify operational readiness.',due:'2026-12-06'}
  ];
  const rows = [
    ['Write the project brief','done','software','m1','high'],['Define ingestion API contract','done','software','m1','high'],['Model events and incidents','done','software','m1','medium'],['Compare architecture options','done','software','m1','medium'],
    ['Validate incoming log payloads','done','software','m2','high'],['Persist events in PostgreSQL','done','software','m2','high'],['Add incident grouping rules','doing','software','m2','high'],['Expose incident history endpoint','todo','software','m2','medium'],['Test duplicate event handling','todo','software','m2','high'],
    ['Build source-bound summary prompt','doing','gpt','m3','high'],['Create golden evaluation dataset','todo','gpt','m3','high'],['Add model timeout and fallback','backlog','mixed','m3','high'],['Validate structured model output','backlog','mixed','m3','medium'],['Track latency and token usage','backlog','gpt','m3','medium'],
    ['Containerize API and worker','backlog','software','m4','medium'],['Add CI integration checks','backlog','software','m4','medium'],['Verify rollback and health checks','backlog','software','m4','high'],['Write setup and operations guide','done','software','m4','low']
  ];
  p.tasks=rows.map(([title,status,kind,milestone,priority])=>({id:uid(),title,status,kind,milestone,priority,description:title==='Add incident grouping rules'?'Group events by service, error fingerprint and a configurable time window. Keep the rules deterministic and cover boundary cases.':'',due:''}));
  p.options=[
    {id:'o1',name:'Modular monolith',style:'One application, clear module boundaries',stack:'FastAPI · PostgreSQL · background worker',strengths:'Simple local setup and deployment. Shared validation and data models. Easy to trace an event end to end.',tradeoffs:'API and summary worker share a release cycle. Worker isolation needs explicit limits.',effort:'Small',selected:true},
    {id:'o2',name:'Event-driven services',style:'Independent ingestion and summary services',stack:'FastAPI · Redis Streams · PostgreSQL',strengths:'Independent scaling and retries. Slow model calls stay isolated from ingestion.',tradeoffs:'More infrastructure and delivery semantics to debug. Higher operational overhead for a side project.',effort:'Large',selected:false},
    {id:'o3',name:'Serverless pipeline',style:'Managed functions and a durable queue',stack:'Functions · managed queue · hosted database',strengths:'Managed execution and elastic capacity. Pay for work as it arrives.',tradeoffs:'Provider coupling, cold starts and local parity. Long model calls need careful timeout handling.',effort:'Medium',selected:false}
  ];
  p.components=[
    {id:uid(),name:'Log ingestion & validation',kind:'software',description:'Schema validation, idempotency and event persistence.'},
    {id:uid(),name:'Incident grouping engine',kind:'software',description:'Explicit rules, time windows and stable fingerprints.'},
    {id:uid(),name:'Summary generation',kind:'gpt',description:'External model API explains only the supplied event evidence.'},
    {id:uid(),name:'Summary output guard',kind:'mixed',description:'Validate model output, enforce citations and fall back to a rule-based report.'}
  ];
  p.apis=[{id:uid(),method:'POST',path:'/v1/events',description:'Ingest a validated event. Repeated event_id values are idempotent.',request:'{\n  "event_id": "evt_1042",\n  "service": "payments-api",\n  "level": "error",\n  "timestamp": "2026-11-13T10:42:00Z",\n  "message": "Database connection timeout"\n}',response:'202 Accepted\n{ "event_id": "evt_1042", "status": "accepted" }'},
    {id:uid(),method:'GET',path:'/v1/incidents/:id',description:'Retrieve grouped evidence and summary status.',request:'Path: id (UUID)\nAuthorization: project API token',response:'200 OK\n{ "id": "...", "status": "open", "events": [],\n  "summary": { "status": "pending", "text": null } }'}];
  p.entities=[{id:uid(),name:'Event',fields:'id             UUID · primary key\nevent_id       TEXT · unique\nservice        TEXT · indexed\nlevel          TEXT\nmessage        TEXT\noccurred_at    TIMESTAMPTZ\nincident_id    UUID · nullable FK → Incident',notes:'Store the original payload for traceability. Index service + occurred_at for bounded grouping queries.'},
    {id:uid(),name:'Incident',fields:'id             UUID · primary key\nfingerprint    TEXT · indexed\nservice        TEXT\nstatus         TEXT · open | resolved\nopened_at      TIMESTAMPTZ\nsummary        JSONB · nullable',notes:'An incident has many events. Store model name, prompt version, source event IDs and fallback reason with each summary.'}];
  p.deployment=[['Quality','Unit tests cover grouping boundaries',true],['Quality','Model evaluation dataset passes',false],['Quality','Timeout and fallback path verified',false],['Configuration','Environment variables documented',true],['Configuration','Secrets stay outside the repository',true],['Release','Container build is reproducible',false],['Release','Database migrations tested',false],['Release','Rollback procedure verified',false],['Operations','Health endpoint and structured logs ready',true],['Operations','Runbook covers failed summary jobs',false]].map(([group,title,done])=>({id:uid(),group,title,done}));
  p.decisions=[{id:uid(),title:'Keep incident detection deterministic',status:'accepted',date:'2026-11-12',context:'Detection must be reproducible and available even if the model provider is unavailable.',decision:'Use explicit grouping rules for detection. Use the model only to summarize existing evidence.',consequences:'More rule maintenance, but predictable incident boundaries and a reliable fallback.'},
    {id:uid(),title:'Start with a modular monolith',status:'accepted',date:'2026-11-11',context:'The first version needs a short feedback loop and a small deployment footprint.',decision:'Keep ingestion, grouping and summary orchestration in one codebase with a separate worker process.',consequences:'Share contracts and migrations; revisit independent services only when scaling pressure is measured.'}];
  const w=makeWorkspace(p);
  w.notes=[{id:uid(),title:'Make background jobs idempotent',category:'Backend',body:'Give each operation a stable idempotency key. Persist the result before acknowledging the job. Retries should converge on the same outcome.\n\nTest: replay the same job twice, including a crash between persistence and acknowledgement.',updatedAt:'2026-11-12'},
    {id:uid(),title:'A model call needs a failure contract',category:'AI / ML',body:'Define timeout, retry budget, output schema and fallback before integrating a model. Keep a small golden dataset and record prompt versions.\n\nSeparate the deterministic acceptance checks from subjective quality review.',updatedAt:'2026-11-13'}];
  return w;
}
