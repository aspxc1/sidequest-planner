const E = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths = {
  logo:'M5 5h7v7H5zM17 5h7v7h-7zM5 17h7v7H5zM17 24v-7h7M17 17l7 7',
  overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  scope:'M8 3h8l3 3v15H5V3h3M8 9h8M8 13h8M8 17h5',
  roadmap:'M5 4v16M5 6h13l-3 4 3 4H5',
  board:'M3 4h18v16H3zM9 4v16M15 4v16M5 8h2M11 8h2M17 8h2M5 12h2M11 12h2',
  architecture:'M9 3h6v5H9zM3 16h6v5H3zM15 16h6v5h-6zM12 8v4M6 16v-4h12v4',
  api:'M8 6l-6 6 6 6M16 6l6 6-6 6M14 3l-4 18',
  decisions:'M12 3l8 4v6c0 4-8 8-8 8s-8-4-8-8V7zM8 12l3 3 5-6',
  deploy:'M12 3v12M7 8l5-5 5 5M4 15v6h16v-6',
  ideas:'M9 18h6M9 21h6M8 14c-4-5-1-11 4-11s8 6 4 11l-1 2H9z',
  notes:'M5 3h14v18H5zM9 7h6M9 11h6M9 15h4',
  plus:'M12 5v14M5 12h14',search:'M21 21l-6-6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  arrow:'M5 12h14M14 7l5 5-5 5',chevron:'M9 5l7 7-7 7',check:'M5 12l4 4L19 6',
  close:'M6 6l12 12M18 6L6 18',edit:'M14 5l5 5M4 20l5-1L21 7l-5-5L4 14z',
  trash:'M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7',
  clock:'M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  lock:'M5 10h14v11H5zM8 10V6a4 4 0 0 1 8 0v4M12 14v3',
  menu:'M4 6h16M4 12h16M4 18h16',download:'M12 3v12M7 10l5 5 5-5M4 17v4h16v-4',
  upload:'M12 16V4M7 9l5-5 5 5M4 17v4h16v-4',
  software:'M8 3v3M16 3v3M8 18v3M16 18v3M3 8h3M3 16h3M18 8h3M18 16h3M6 6h12v12H6zM9 9h6v6H9z',
  gpt:'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',
  mixed:'M4 8h10l-3-3M20 16H10l3 3M14 8l-3 3M10 16l3-3',
  folder:'M3 5h7l2 3h9v12H3z',alert:'M12 3L2 21h20zM12 9v5M12 17h.01',minus:'M5 12h14'
};
const icon = (name, cls='') => `<svg class="${cls}" viewBox="0 0 ${name==='logo'?'29 29':'24 24'}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.folder}"/></svg>`;
const labels = {overview:'Overview',scope:'Scope & brief',roadmap:'Roadmap',board:'Task board',architecture:'Architecture',api:'API & data',decisions:'Decisions',deploy:'Deployment',ideas:'Idea shelf',notes:'Notes library'};
const statusLabel = {backlog:'Backlog',todo:'To do',doing:'In progress',done:'Done',planning:'Planning',building:'Building',paused:'Paused',shipped:'Shipped'};
const kindLabel = {software:'Software',gpt:'GPT / API',mixed:'Mixed'};
const badge=(text,cls='')=>`<span class="badge ${cls}">${E(text)}</span>`;
const kindBadge=k=>badge(kindLabel[k],k);
const btn=(label,action,cls='',ico='',attrs='')=>`<button class="btn ${cls}" data-action="${action}" ${attrs}>${ico?icon(ico):''}${E(label)}</button>`;
const editBtn=(type,id)=>`<button class="icon-btn" data-action="edit-record" data-type="${type}" data-id="${E(id)}" aria-label="Edit ${E(type)}">${icon('edit')}</button>`;
const link=(label,view)=>`<button class="text-btn" data-nav="${view}">${E(label)} ${icon('arrow')}</button>`;
const dateLabel=(date)=>{if(!date)return 'No date set';const d=new Date(`${date}T12:00:00`);return E(Number.isNaN(d.getTime())?date:d.toLocaleDateString('en',{month:'short',day:'numeric'}));};
let store, workspace, storageIssue='', corruptRaw='', blockSave=false;
try { store=createStore(localStorage); workspace=store.load(); if(!workspace){workspace=exampleWorkspace();store.save(workspace);} }
catch(error){ workspace=exampleWorkspace();storageIssue=`Local storage needs attention. ${error.message} Export your work before closing this tab.`;blockSave=true;try{corruptRaw=localStorage.getItem(STORAGE_KEY)||'';}catch{} }
let route=Object.hasOwn(labels,location.hash.slice(1))?location.hash.slice(1):'overview';
let query='', boardKind='all', boardMilestone='all', boardPriority='all', apiTab='apis', menuOpen=false, dragId='', dialogContext=null, toastTimer, lastFocus;
const project=()=>workspace.projects.find(p=>p.id===workspace.activeProject);
function toast(message){const node=document.querySelector('#toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3200);}
function persist(message='Saved locally'){
  project().updatedAt=today();
  if(!blockSave) try{store.save(workspace);storageIssue='';}catch(error){storageIssue=`Save failed. ${error.message} Export your work before closing this tab.`;blockSave=true;}
  render(); if(message)toast(storageIssue?'Changes kept in this tab. Export a backup.':message);
}
function nav(view){route=view;query='';menuOpen=false;location.hash=view;render();window.scrollTo(0,0);document.querySelector('#main').focus({preventScroll:true});}
function render(){
  const p=project();
  const active=document.activeElement,focus=active&&document.querySelector('#app').contains(active)?{tag:active.tagName,attrs:Object.fromEntries(['id','data-id','data-action','data-nav','data-type','data-tab','data-check','data-status','data-milestone'].map(k=>[k,active.getAttribute(k)]))}:null;
  document.title=`${labels[route]} · ${p.title} — Sidequest`;
  document.querySelector('#app').innerHTML=`<div class="shell ${menuOpen?'menu-open':''}">
  <button class="drawer-backdrop" data-action="menu" aria-label="Close navigation"></button>
  <aside class="sidebar" aria-label="Workspace navigation">
    <div class="brand"><span class="brand-mark">${icon('logo')}</span>sidequest<span style="font-weight:400;color:#839b8b;font-size:18px">.</span></div>
    <div class="project-picker"><label for="project-select">YOUR PROJECT</label><select id="project-select">${workspace.projects.map(x=>`<option value="${E(x.id)}" ${x.id===p.id?'selected':''}>${E(x.title)}</option>`).join('')}</select></div>
    <button class="new-project row" data-action="new-project">${icon('plus')} New project</button>
    <div class="nav-label">PROJECT</div><nav class="nav">${['overview','scope','roadmap','board','architecture','api','decisions','deploy'].map(v=>`<button data-nav="${v}" class="${route===v&&!query?'active':''}" ${route===v&&!query?'aria-current="page"':''}>${icon(v)}<span>${labels[v]}</span>${['board','decisions'].includes(v)?`<span class="count">${v==='board'?p.tasks.length:p.decisions.length}</span>`:''}</button>`).join('')}</nav>
    <div class="nav-label">WORKSPACE</div><nav class="nav">${['ideas','notes'].map(v=>`<button data-nav="${v}" class="${route===v&&!query?'active':''}" ${route===v&&!query?'aria-current="page"':''}>${icon(v)}<span>${labels[v]}</span></button>`).join('')}</nav>
    <div class="sidebar-footer"><span class="local-dot"></span> Local workspace<p>Your projects stay in this browser.<br>Build something worth finishing.</p></div>
  </aside>
  <div class="workspace"><header class="topbar"><button class="icon-btn mobile-menu" data-action="menu" aria-label="Open navigation" aria-expanded="${menuOpen}">${icon('menu')}</button><div class="breadcrumb"><span class="project-crumb">${E(p.title)}</span><span class="crumb-slash">/</span><span class="current">${labels[route]}</span></div><div class="top-actions"><label class="searchbox">${icon('search')}<input id="search" type="search" placeholder="Search your workspace" aria-label="Search your workspace" value="${E(query)}"><span class="key">Ctrl K</span></label><span class="save-state">${icon(storageIssue?'alert':'check')}${storageIssue?'Unsaved changes':'Saved locally'}</span>${btn('Backup','backup','','download')}</div></header>
  ${storageIssue?`<div class="storage-error" role="alert">${icon('alert')}<span>${E(storageIssue)}</span>${btn('Export backup','export','','download')}</div>`:''}
  <main class="main" id="main" tabindex="-1">${content()}</main></div></div>`;
  if(focus){const replacement=[...document.querySelectorAll('#app button,#app input,#app select,#main')].find(el=>el.tagName===focus.tag&&Object.entries(focus.attrs).every(([k,v])=>el.getAttribute(k)===v));(replacement||document.querySelector('#main')).focus({preventScroll:true});}
}
function heading(title,description,actions=''){return `<div class="page-heading"><div><h1>${E(title)}</h1>${description?`<p>${E(description)}</p>`:''}</div>${actions?`<div class="heading-actions">${actions}</div>`:''}</div>`;}
function empty(title,description,action=''){return `<div class="empty"><h3>${E(title)}</h3><p>${E(description)}</p>${action}</div>`;}
function content(){if(query.trim())return searchView();return ({overview:overviewView,scope:scopeView,roadmap:roadmapView,board:boardView,architecture:architectureView,api:apiView,decisions:decisionsView,deploy:deployView,ideas:ideasView,notes:notesView})[route]();}
function overviewView(){
  const p=project(), done=p.tasks.filter(t=>t.status==='done').length, percent=progress(p.tasks), selected=p.options.find(o=>o.selected),next=p.tasks.find(t=>t.status==='doing')||p.tasks.find(t=>t.status==='todo')||p.tasks.find(t=>t.status!=='done');
  return `${heading(p.title,p.summary,btn('Edit brief','edit-brief','','edit')+btn('Open task board','open-board','primary','board'))}
  <div class="project-meta" style="margin-top:-12px;margin-bottom:26px">${badge(statusLabel[p.status],p.status)}<span>${E(p.category)}</span><span>·</span><span>${p.milestones.length} milestones</span>${p.example?badge('Example project','example'):''}</div>
  <div class="overview-grid"><section class="panel"><div class="panel-head"><h2>Project roadmap</h2>${link('View roadmap','roadmap')}</div><div class="progress-summary"><span><strong>${done}</strong> of ${p.tasks.length} tasks complete</span><strong>${percent}%</strong></div><div style="margin:0 24px 5px" class="progress-track" role="progressbar" aria-label="Project tasks complete" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${percent}%"></div></div>
  <div class="milestone-list">${p.milestones.length?p.milestones.map((m,i)=>{const tasks=p.tasks.filter(t=>t.milestone===m.id),pc=progress(tasks),complete=tasks.length&&pc===100,current=tasks.some(t=>t.status==='doing');return `<div class="milestone-row"><div class="milestone-node ${complete?'complete':current?'current':''}">${complete?icon('check'):i+1}</div><div class="milestone-info"><h3>${E(m.title)}</h3><p>${tasks.filter(t=>t.status==='done').length}/${tasks.length} tasks · ${complete?'Complete':current?'In progress':'Upcoming'}</p></div><div class="milestone-tail">${dateLabel(m.due)}<div class="progress-track"><div class="progress-fill" style="width:${pc}%"></div></div></div></div>`;}).join(''):empty('Plan your first milestone','Give the project its first deliverable.',btn('Add milestone','new-milestone','small','plus'))}</div>
  ${next?`<div class="next-strip"><span class="next-label">UP NEXT</span><button data-action="edit-record" data-type="task" data-id="${E(next.id)}">${E(next.title)}</button>${kindBadge(next.kind)}${icon('arrow')}</div>`:''}</section>
  <div class="overview-aside"><section class="panel"><div class="panel-head"><h2>Project brief</h2>${link('Scope','scope')}</div><div class="panel-body"><p class="brief-text">${E(p.goal||'Define the outcome you want to achieve in your project brief.')}</p><div class="brief-stats"><div><span>ARCHITECTURE</span><strong>${E(selected?.name||'To be decided')}</strong></div><div><span>IN SCOPE</span><strong>${p.scope.in.length} deliverables</strong></div></div></div></section>
  <section class="panel"><div class="panel-head"><h2>Latest decisions</h2>${link('All','decisions')}</div><div class="panel-body">${p.decisions.length?p.decisions.slice(-2).reverse().map(d=>`<div class="decision-preview"><button data-action="edit-record" data-type="decision" data-id="${E(d.id)}">${E(d.title)}</button><small>${badge(d.status,d.status)} <span style="margin-left:7px">${dateLabel(d.date)}</span></small></div>`).join(''):empty('Keep the reasoning','Record your first technical decision.',btn('Add decision','new-decision','small'))}</div></section></div></div>
  <section class="panel boundaries"><div class="panel-head"><h2>Implementation boundary</h2>${link('Architecture','architecture')}</div><div class="boundary-grid"><div class="boundary-column"><h3>${icon('software')} DETERMINISTIC SOFTWARE</h3>${p.components.filter(c=>c.kind==='software').slice(0,3).map(c=>`<div class="boundary-entry">${icon('check')}${E(c.name)}</div>`).join('')||'<p class="brief-text">Add the components with explicit rules and repeatable behavior.</p>'}<p class="boundary-note">Explicit rules. Testable outputs. No model dependency.</p></div><div class="boundary-column ai"><h3>${icon('gpt')} GPT / API COMPONENTS</h3>${p.components.filter(c=>c.kind!=='software').slice(0,3).map(c=>`<div class="boundary-entry">${icon(c.kind)}${E(c.name)}${c.kind==='mixed'?badge('Mixed','mixed'):''}</div>`).join('')||'<p class="brief-text">Add model-based components when your project needs them.</p>'}<p class="boundary-note">Define evaluation criteria, provider timeouts and a software fallback.</p></div></div></section>
  <div class="section-footer">${icon('lock')} Everything here is saved locally. Use Backup to keep a portable copy.</div>`;
}
function scopeView(){const p=project();return `${heading('Scope & brief','Keep the first version small enough to ship.',btn('Edit brief','edit-brief','primary','edit'))}<div class="scope-layout"><div><section class="panel"><div class="panel-head"><h2>The outcome</h2>${badge(statusLabel[p.status],p.status)}</div><div class="panel-body"><p class="scope-goal">${E(p.goal||'What should someone be able to do when this project is finished? Add an outcome to focus your build.')}</p></div></section><section class="panel"><div class="panel-head"><h2>In scope</h2><span class="muted">${p.scope.in.length}</span></div><div class="panel-body">${scopeList(p.scope.in,'check','')||'<p class="brief-text">List the features your first version will deliver.</p>'}</div></section></div><div><section class="panel"><div class="panel-head"><h2>Out of scope</h2></div><div class="panel-body">${scopeList(p.scope.out,'minus','out')||'<p class="brief-text">Write down the tempting ideas you are deliberately leaving for later.</p>'}</div></section><section class="panel"><div class="panel-head"><h2>Definition of done</h2></div><div class="panel-body">${scopeList(p.scope.success,'check','')||'<p class="brief-text">Define observable acceptance criteria for a finished project.</p>'}</div></section></div></div>${workspace.projects.length>1?`<div class="trash-project">${btn('Archive by deleting project','delete-project','quiet danger','trash')}</div>`:''}`;}
function scopeList(items,ico,cls){return items.length?`<ul class="scope-list ${cls}">${items.map(s=>`<li>${icon(ico)}<span>${E(s)}</span></li>`).join('')}</ul>`:'';}
function taskLine(t){return `<div class="task-line ${t.status==='done'?'done':''}"><button class="task-check ${t.status==='done'?'done':''}" data-action="toggle-task" data-id="${E(t.id)}" aria-label="${t.status==='done'?'Reopen':'Complete'} ${E(t.title)}">${t.status==='done'?icon('check'):''}</button><button class="task-line-title" data-action="edit-record" data-type="task" data-id="${E(t.id)}">${E(t.title)}</button>${kindBadge(t.kind)}${badge(statusLabel[t.status],t.status)}</div>`;}
function roadmapView(){const p=project(),unassigned=p.tasks.filter(t=>!t.milestone);return `${heading('Roadmap','From first contract to first deployment. Each milestone is a working deliverable.',btn('Add milestone','new-milestone','primary','plus'))}<div class="panel">${p.milestones.length?p.milestones.map(m=>{const ts=p.tasks.filter(t=>t.milestone===m.id);return `<section class="roadmap-section"><div><div class="row between"><h3>${E(m.title)}</h3>${editBtn('milestone',m.id)}</div><p>${E(m.description)}</p><small class="muted">${icon('clock')} ${dateLabel(m.due)} · ${progress(ts)}%</small><div class="progress-track"><div class="progress-fill" style="width:${progress(ts)}%"></div></div></div><div>${ts.map(taskLine).join('')||'<p class="brief-text">No tasks yet. Add the work that delivers this milestone.</p>'}<div style="margin-top:15px">${btn('Add task','new-task','quiet small','plus',`data-milestone="${E(m.id)}"`)}</div></div></section>`;}).join(''):empty('Start with a deliverable','Add a milestone, then break it into tasks.',btn('Add milestone','new-milestone','primary','plus'))}${unassigned.length?`<section class="roadmap-section"><div><h3>Unassigned tasks</h3><p>Choose a milestone in the task editor.</p></div><div>${unassigned.map(taskLine).join('')}</div></section>`:''}</div>`;}
function boardView(){const p=project(),tasks=p.tasks.filter(t=>(boardKind==='all'||t.kind===boardKind)&&(boardMilestone==='all'||t.milestone===boardMilestone)&&(boardPriority==='all'||t.priority===boardPriority));return `${heading('Task board','A little less planning. A little more building.',btn('Add task','new-task','primary','plus'))}<div class="toolbar"><select id="filter-kind" aria-label="Filter by component">${selectOptions(['all',...kinds],boardKind,{all:'All components',...kindLabel})}</select><select id="filter-milestone" aria-label="Filter by milestone"><option value="all">All milestones</option>${p.milestones.map(m=>`<option value="${E(m.id)}" ${boardMilestone===m.id?'selected':''}>${E(m.title)}</option>`).join('')}</select><select id="filter-priority" aria-label="Filter by priority">${selectOptions(['all','high','medium','low'],boardPriority,{all:'All priorities',high:'High priority',medium:'Medium priority',low:'Low priority'})}</select><span class="push muted" style="font-size:11px">${tasks.length} tasks · Drag to move, or use status menus</span></div><div class="board">${statuses.map(s=>`<section class="lane" data-lane="${s}" aria-label="${statusLabel[s]}"><div class="lane-title"><span class="dot" style="color:${{backlog:'#8e9a8a',todo:'#6b8795',doing:'#b58b45',done:'#518463'}[s]}"></span>${statusLabel[s]} <span class="lane-count">${tasks.filter(t=>t.status===s).length}</span><button class="icon-btn" data-action="new-task" data-status="${s}" aria-label="Add task to ${statusLabel[s]}">${icon('plus')}</button></div>${tasks.filter(t=>t.status===s).map(taskCard).join('')||'<div class="empty-lane">No tasks here. Room to build.</div>'}</section>`).join('')}</div>`;}
function taskCard(t){const m=project().milestones.find(x=>x.id===t.milestone);return `<article class="task-card" draggable="true" data-task="${E(t.id)}"><button class="task-title" data-action="edit-record" data-type="task" data-id="${E(t.id)}">${E(t.title)}</button><div class="row between">${kindBadge(t.kind)}${badge(t.priority+' priority',t.priority)}</div>${m?`<div class="task-milestone">${icon('roadmap')} ${E(m.title)}</div>`:''}<select class="task-status" data-id="${E(t.id)}" aria-label="Status for ${E(t.title)}">${selectOptions(statuses,t.status,statusLabel)}</select></article>`;}
function selectOptions(options,current,names={}){return options.map(s=>`<option value="${E(s)}" ${s===current?'selected':''}>${E(names[s]||s)}</option>`).join('');}
function architectureView(){const p=project();return `${heading('Architecture','Compare the tradeoffs. Keep a record of why this structure fits.',btn('Add option','new-option','primary','plus'))}${p.options.length?`<section class="panel comparison-wrap"><table class="comparison"><caption class="skip">Architecture options and tradeoffs</caption><thead><tr><th scope="col">Approach</th>${p.options.map(o=>`<td class="${o.selected?'selected':''}">${o.selected?badge('Selected approach','accepted'):badge('Alternative')}<h3>${E(o.name)}</h3><p>${E(o.style)}</p><div class="option-actions">${o.selected?'':btn('Choose this','choose-option','small','check',`data-id="${E(o.id)}"`)}${editBtn('option',o.id)}</div></td>`).join('')}</tr></thead><tbody>${[['Stack','stack'],['Strengths','strengths'],['Tradeoffs','tradeoffs'],['Build effort','effort']].map(([label,key])=>`<tr><th scope="row">${label}</th>${p.options.map(o=>`<td class="${o.selected?'selected':''}"><p>${E(o[key]||'Not recorded yet')}</p></td>`).join('')}</tr>`).join('')}</tbody></table></section>`:`<section class="panel">${empty('Compare before you commit','Add two approaches and make the tradeoffs explicit.',btn('Add architecture option','new-option','primary','plus'))}</section>`}<div class="spacer"></div><section class="panel"><div class="panel-head"><h2>Component boundaries</h2>${btn('Add component','new-component','small','plus')}</div><div class="panel-body"><p class="brief-text">Separate repeatable software behavior from model-dependent behavior. Mark orchestration that crosses both as mixed.</p><div class="components">${p.components.map(c=>`<div class="component-row">${icon(c.kind)}<div class="grow"><div class="row between"><h3>${E(c.name)}</h3>${kindBadge(c.kind)}</div><p>${E(c.description)}</p></div>${editBtn('component',c.id)}</div>`).join('')}</div>${!p.components.length?empty('Map your components','Name each component and choose its execution boundary.') : ''}</div></section>`;}
function apiView(){const p=project();return `${heading('API & data','Contracts first. Keep request shapes, responses and relationships close to the code.',btn(apiTab==='apis'?'Add endpoint':'Add entity',apiTab==='apis'?'new-api':'new-entity','primary','plus'))}<div class="tabs" role="tablist" aria-label="Technical notes"><button role="tab" aria-selected="${apiTab==='apis'}" class="${apiTab==='apis'?'active':''}" data-action="api-tab" data-tab="apis">API contracts <span class="muted">${p.apis.length}</span></button><button role="tab" aria-selected="${apiTab==='entities'}" class="${apiTab==='entities'?'active':''}" data-action="api-tab" data-tab="entities">Data models <span class="muted">${p.entities.length}</span></button></div><div class="record-list">${apiTab==='apis'?p.apis.map(a=>`<article class="panel"><div class="record-head"><div class="row"><span class="method">${E(a.method)}</span><h3 class="mono">${E(a.path)}</h3></div>${editBtn('api',a.id)}</div><div class="record-body"><p>${E(a.description)}</p><div class="label">Request</div><pre>${E(a.request||'No request notes yet.')}</pre><div class="label">Response</div><pre>${E(a.response||'No response notes yet.')}</pre></div></article>`).join(''):p.entities.map(e=>`<article class="panel"><div class="record-head"><h3>${E(e.name)}</h3>${editBtn('entity',e.id)}</div><div class="record-body"><div class="label">Fields & relationships</div><pre>${E(e.fields)}</pre><div class="label">Model notes</div><p>${E(e.notes||'No model notes yet.')}</p></div></article>`).join('')}</div>${!p[apiTab].length?`<section class="panel">${empty(apiTab==='apis'?'Define the first contract':'Model the core entities',apiTab==='apis'?'Document inputs, outputs and failure responses.':'Record fields, keys and relationships.',btn(apiTab==='apis'?'Add endpoint':'Add entity',apiTab==='apis'?'new-api':'new-entity','primary','plus'))}</section>`:''}`;}
function decisionsView(){const p=project();return `${heading('Technical decisions','Keep the context your future self will need.',btn('Record decision','new-decision','primary','plus'))}<div class="record-list">${p.decisions.slice().reverse().map(d=>`<article class="panel"><div class="record-head"><div><div class="row" style="margin-bottom:10px">${badge(d.status,d.status)}<small class="muted">${dateLabel(d.date)}</small></div><h3>${E(d.title)}</h3></div>${editBtn('decision',d.id)}</div><div class="record-body"><div class="label">Context</div><p>${E(d.context)}</p><div class="label">Decision</div><p>${E(d.decision)}</p><div class="label">Consequences</div><p>${E(d.consequences)}</p></div></article>`).join('')}</div>${!p.decisions.length?`<section class="panel">${empty('The why belongs here','Record the context, choice and consequences of a technical decision.',btn('Record decision','new-decision','primary','plus'))}</section>`:''}`;}
function deployView(){const p=project(),done=p.deployment.filter(d=>d.done).length,pc=p.deployment.length?Math.round(done/p.deployment.length*100):0;return `${heading('Deployment checklist','Make shipping repeatable, observable and reversible.',btn('Add check','new-check','primary','plus'))}<section class="panel"><div class="checklist-summary"><strong>${done} / ${p.deployment.length} ready</strong><div class="progress-track"><div class="progress-fill" style="width:${pc}%"></div></div><span>${pc===100&&p.deployment.length?'All checks complete. Ready for your release review.':'Check off the evidence before you ship.'}</span></div>${[...new Set(p.deployment.map(d=>d.group))].map(group=>`<section class="checklist-group"><h3>${E(group)}</h3>${p.deployment.filter(d=>d.group===group).map(d=>`<div class="checklist-item"><input type="checkbox" id="check-${E(d.id)}" data-check="${E(d.id)}" ${d.done?'checked':''}><label for="check-${E(d.id)}">${E(d.title)}</label>${editBtn('check',d.id)}</div>`).join('')}</section>`).join('')||empty('Build your release checklist','Add the checks that make a deployment reliable.',btn('Add check','new-check','primary','plus'))}</section>`;}
function ideasView(){return `${heading('A good idea is a starting point.','Pick a small, useful system. Each starter includes milestones, tasks and a deployment checklist.')}<div class="ideas">${templates.filter(t=>t.id!=='blank').map(t=>`<article class="idea">${badge(t.category)}<h2>${E(t.name)}</h2><p>${E(t.subtitle)}</p><div class="stack">${E(t.stack)}</div><ul>${t.tasks.slice(0,3).map(([title])=>`<li>${E(title)}</li>`).join('')}</ul>${btn('Start this project','new-project','primary','arrow',`data-template="${t.id}"`)}</article>`).join('')}</div><div class="blank-idea">${icon('ideas')}<div class="grow"><h3>Already have something in mind?</h3><p>Start with a blank brief and make it your own.</p></div>${btn('Blank project','new-project','','plus','data-template="blank"')}</div>`;}
function notesView(){return `${heading('Notes worth keeping','Patterns, lessons and snippets you can take into your next project.',btn('Add note','new-note','primary','plus'))}<div class="notes-grid">${workspace.notes.map(n=>`<article class="note"><div class="row between">${badge(n.category)}${editBtn('note',n.id)}</div><h3>${E(n.title)}</h3><p class="note-copy">${E(n.body)}</p><div class="note-footer"><span>WORKSPACE NOTE</span><span>Updated ${dateLabel(n.updatedAt)}</span></div></article>`).join('')}</div>${!workspace.notes.length?`<section class="panel">${empty('Keep the lesson, reuse the pattern','Your notes are shared across every project in this workspace.',btn('Write a note','new-note','primary','plus'))}</section>`:''}`;}
function searchView(){const q=query.toLowerCase().trim(),results=[];workspace.projects.forEach(p=>{if([p.title,p.summary,p.goal].some(s=>s.toLowerCase().includes(q)))results.push({title:p.title,subtitle:p.summary,kind:'Project',view:'overview',project:p.id});for(const [key,type,view] of [['tasks','Task','board'],['milestones','Milestone','roadmap'],['decisions','Decision','decisions'],['options','Option','architecture'],['components','Component','architecture'],['apis','Endpoint','api'],['entities','Entity','api']])p[key].forEach(r=>{if(Object.values(r).filter(v=>typeof v==='string').join(' ').toLowerCase().includes(q))results.push({title:r.title||r.name||`${r.method} ${r.path}`,subtitle:p.title,kind:type,view,project:p.id,id:r.id,type:{tasks:'task',milestones:'milestone',decisions:'decision',options:'option',components:'component',apis:'api',entities:'entity'}[key]});});});workspace.notes.forEach(n=>{if(`${n.title} ${n.body} ${n.category}`.toLowerCase().includes(q))results.push({title:n.title,subtitle:n.category,kind:'Note',view:'notes',id:n.id,type:'note'});});return `${heading('Search workspace',`${results.length} result${results.length===1?'':'s'} for “${query}”`)}<div class="panel">${results.slice(0,100).map(r=>`<button class="search-result" data-action="search-result" data-project="${E(r.project||workspace.activeProject)}" data-view="${r.view}" data-type="${r.type||''}" data-id="${E(r.id||'')}">${badge(r.kind)}<div class="grow"><strong>${E(r.title)}</strong><p>${E(r.subtitle)}</p></div>${icon('arrow')}</button>`).join('')||empty('No matches yet','Try a project, task, technical decision or reusable note.')}</div>`;}

const collections={task:'tasks',milestone:'milestones',option:'options',component:'components',api:'apis',entity:'entities',decision:'decisions',check:'deployment',note:'notes'};
function collection(type){return type==='note'?workspace.notes:project()[collections[type]];}
function field(label,name,value='',type='text',extra=''){
  const control=type==='textarea'?`<textarea id="f-${name}" name="${name}" ${extra}>${E(value)}</textarea>`:`<input id="f-${name}" name="${name}" type="${type}" value="${E(value)}" ${extra}>`;
  return `<div class="field"><label for="f-${name}">${label}</label>${control}</div>`;
}
function selectField(label,name,values,current,names={}){return `<div class="field"><label for="f-${name}">${label}</label><select name="${name}" id="f-${name}">${selectOptions(values,current,names)}</select></div>`;}
function showDialog(title,body,footer='',context=null){
  const d=document.querySelector('#editor');lastFocus=document.activeElement;dialogContext=context;
  d.innerHTML=`<form id="record-form"><div class="dialog-head"><h2 id="dialog-title">${E(title)}</h2><button type="button" class="icon-btn" data-action="close" aria-label="Close dialog">${icon('close')}</button></div><div class="form-body"><div id="form-error" class="form-error" role="alert" hidden></div>${body}</div>${footer?`<div class="form-footer">${footer}</div>`:''}</form>`;
  // All non-submit dialog actions are explicitly buttons, not accidental form submissions.
  d.querySelectorAll('button').forEach(b=>{if(!b.hasAttribute('type'))b.type='button';});
  if(!d.open)d.showModal();d.querySelector('input:not([type=hidden]),textarea,select')?.focus();
}
function closeDialog(){document.querySelector('#editor').close();dialogContext=null;}
function editor(type,id='',preset={}){
  const p=project(),r=id?collection(type)?.find(x=>x.id===id):{},v=r||{};
  let body='',title='';const required='required maxlength="300"';
  const two=(a,b)=>`<div class="form-grid">${a}${b}</div>`;
  if(type==='project'){
    const t=templates.find(t=>t.id===preset.template)||templates[3];title='Start a new project';
    body=selectField('Starting point','template',templates.map(t=>t.id),t.id,Object.fromEntries(templates.map(t=>[t.id,t.id==='blank'?'Blank project':`${t.name} · ${t.category}`])))+field('Project name','title',t.id==='blank'?'':t.name,'text',required)+selectField('Project category','category',['Backend','AI / ML','DevOps'],t.category)+`<p class="brief-text">Start small. You can change the brief, scope and tasks at any time.</p>`;
  }else if(type==='brief'){
    title='Edit project brief';body=field('Project name','title',p.title,'text',required)+field('Short description','summary',p.summary,'textarea','maxlength="2000"')+two(selectField('Category','category',['Backend','AI / ML','DevOps'],p.category),selectField('Project status','status',['planning','building','paused','shipped'],p.status,statusLabel))+field('What should this project achieve?','goal',p.goal,'textarea','class="long" maxlength="100000"')+field('In scope <span class="hint">· one deliverable per line</span>','in',p.scope.in.join('\n'),'textarea','maxlength="100000"')+field('Out of scope <span class="hint">· one item per line</span>','out',p.scope.out.join('\n'),'textarea','maxlength="100000"')+field('Definition of done <span class="hint">· one criterion per line</span>','success',p.scope.success.join('\n'),'textarea','maxlength="100000"');
  }else if(type==='task'){
    title=id?'Edit task':'Add a task';
    body=field('Task name','title',v.title,'text',required)+field('Implementation notes','description',v.description,'textarea','maxlength="100000"')+two(selectField('Status','status',statuses,v.status||preset.status||'todo',statusLabel),selectField('Component boundary','kind',kinds,v.kind||'software',kindLabel))+two(selectField('Priority','priority',['high','medium','low'],v.priority||'medium'),selectField('Milestone','milestone',['',...p.milestones.map(m=>m.id)],v.milestone||preset.milestone||'',{'':'No milestone',...Object.fromEntries(p.milestones.map(m=>[m.id,m.title]))}))+field('Due date (optional)','due',v.due,'date')+`<p class="brief-text">GPT/API work should include an evaluation plan and a fallback. Use Mixed for orchestration that combines software rules and model calls.</p>`;
  }else if(type==='milestone'){
    title=id?'Edit milestone':'Add a milestone';body=field('Milestone name','title',v.title,'text',required)+field('What will be working?','description',v.description,'textarea','maxlength="100000"')+field('Target date (optional)','due',v.due,'date');
  }else if(type==='option'){
    title=id?'Edit architecture option':'Add architecture option';body=field('Approach name','name',v.name,'text',required)+field('Structure in one sentence','style',v.style,'text','maxlength="1000"')+field('Stack','stack',v.stack,'text','maxlength="2000"')+field('Strengths','strengths',v.strengths,'textarea','maxlength="100000"')+field('Tradeoffs','tradeoffs',v.tradeoffs,'textarea','maxlength="100000"')+selectField('Build effort','effort',['Small','Medium','Large'],v.effort||'Medium');
  }else if(type==='component'){
    title=id?'Edit component':'Add a component';body=field('Component name','name',v.name,'text',required)+selectField('Execution boundary','kind',kinds,v.kind||'software',kindLabel)+field('Responsibility & failure behavior','description',v.description,'textarea','maxlength="100000"');
  }else if(type==='api'){
    title=id?'Edit endpoint':'Add an endpoint';body=two(selectField('Method','method',['GET','POST','PUT','PATCH','DELETE','EVENT'],v.method||'GET'),field('Path or event name','path',v.path,'text','required maxlength="1000"'))+field('Behavior & errors','description',v.description,'textarea','maxlength="100000"')+field('Request / input contract','request',v.request,'textarea','class="code" maxlength="100000"')+field('Response / output contract','response',v.response,'textarea','class="code" maxlength="100000"');
  }else if(type==='entity'){
    title=id?'Edit data model':'Add a data model';body=field('Entity name','name',v.name,'text',required)+field('Fields, keys & relationships','fields',v.fields,'textarea','class="code" maxlength="100000"')+field('Constraints & model notes','notes',v.notes,'textarea','maxlength="100000"');
  }else if(type==='decision'){
    title=id?'Edit technical decision':'Record a decision';body=field('Decision title','title',v.title,'text',required)+two(selectField('Status','status',['proposed','accepted','superseded'],v.status||'proposed'),field('Date','date',v.date||today(),'date','required'))+field('Context — why is a choice needed?','context',v.context,'textarea','maxlength="100000"')+field('Decision — what did you choose?','decision',v.decision,'textarea','required maxlength="100000"')+field('Consequences — what does it trade off?','consequences',v.consequences,'textarea','maxlength="100000"');
  }else if(type==='check'){
    title=id?'Edit deployment check':'Add deployment check';body=field('Check','title',v.title,'text','required maxlength="1000"')+field('Group','group',v.group||'Release','text','required maxlength="100"');
  }else if(type==='note'){
    title=id?'Edit reusable note':'Keep a reusable note';body=field('Note title','title',v.title,'text',required)+selectField('Category','category',['Backend','AI / ML','DevOps','General'],v.category||'General')+field('Pattern, lesson or snippet','body',v.body,'textarea','required class="long" maxlength="100000"')+`<p class="brief-text">Workspace notes are available from all your projects.</p>`;
  }
  const footer=(id?btn('Delete','delete-record','danger','trash'):'')+btn('Cancel','close','quiet')+`<button class="btn primary" type="submit">${type==='project'?'Create project':'Save changes'}</button>`;
  showDialog(title,body,footer,{type,id,preset});
}
function saveRecord(event){
  event.preventDefault();if(!dialogContext)return;const c=dialogContext;
  if(c.type==='confirm-delete'){performDelete(c);return;}
  if(c.type==='confirm-import'){performImport(c.workspace);return;}
  if(c.type==='backup')return;
  const data=Object.fromEntries(new FormData(event.target).entries());Object.keys(data).forEach(k=>data[k]=data[k].trim());
  if(['title','name','path','group','decision','body'].some(k=>Object.hasOwn(data,k)&&['title','name','path','group'].includes(k)&&!data[k])){formError('Add a name before saving.');return;}
  const p=project();
  if(c.type==='project'&&workspace.projects.length>=2000){formError('This workspace supports 2,000 projects. Export a backup before removing old records.');return;}
  if(c.type==='brief'&&['in','out','success'].some(key=>lines(data[key]).length>2000||lines(data[key]).some(line=>line.length>1000))){formError('Each scope section supports up to 2,000 lines, with 1,000 characters per line. Shorten the scope before saving.');return;}
  if(collections[c.type]&&!c.id&&collection(c.type).length>=2000){formError('This collection supports 2,000 records. Export a backup before removing old records.');return;}
  if(c.type==='project'){
    const newProject=createProject({title:data.title,template:data.template,category:data.category});workspace.projects.push(newProject);workspace.activeProject=newProject.id;route='overview';location.hash='overview';boardMilestone='all';
  }else if(c.type==='brief'){
    Object.assign(p,{title:data.title,summary:data.summary,goal:data.goal,status:data.status,category:data.category,scope:{in:lines(data.in),out:lines(data.out),success:lines(data.success)}});
  }else{
    const list=collection(c.type),original=c.id?list.find(x=>x.id===c.id):null;
    const defaults={task:{description:'',due:''},milestone:{description:'',due:''},option:{selected:false},check:{done:false},note:{updatedAt:today()}}[c.type]||{};
    const record={...defaults,...original,...data,id:c.id||uid()};
    if(c.type==='note')record.updatedAt=today();
    if(original)list[list.indexOf(original)]=record;else list.push(record);
  }
  closeDialog();persist(c.type==='project'?'Project created':'Changes saved');
}
function lines(s){return s.split('\n').map(v=>v.trim()).filter(Boolean);}
function formError(message){const el=document.querySelector('#form-error');el.hidden=false;el.textContent=message;el.scrollIntoView({block:'nearest'});}
function confirmDelete(type,id){const r=type==='project'?project():collection(type).find(x=>x.id===id);const message=type==='project'?'This removes the project, its tasks and its technical records. Reusable workspace notes stay. Export a backup first if you want to keep a copy.':type==='milestone'?'Tasks will stay on the board without an assigned milestone.':'This record will be removed from your local workspace.';showDialog(`Delete ${r.title||r.name||r.path}?`,`<p class="brief-text">${E(message)}</p>`,btn('Cancel','close','quiet')+`<button type="submit" class="btn danger">Delete ${E(type)}</button>`,{type:'confirm-delete',recordType:type,id});}
function performDelete(c){
  if(c.recordType==='project'){
    if(workspace.projects.length<2)return;workspace.projects=workspace.projects.filter(p=>p.id!==c.id);workspace.activeProject=workspace.projects[0].id;route='overview';boardMilestone='all';
  }else{const list=collection(c.recordType),index=list.findIndex(r=>r.id===c.id);if(index>=0)list.splice(index,1);if(c.recordType==='milestone')project().tasks.forEach(t=>{if(t.milestone===c.id)t.milestone='';});}
  closeDialog();persist('Deleted');
}
function download(name,data,type='application/json'){
  const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
function exportWorkspace(){download(`sidequest-backup-${today()}.json`,JSON.stringify(workspace,null,2));toast('Backup exported');}
function backupDialog(){
  showDialog('Your local workspace',`<p class="brief-text">${workspace.projects.length} project${workspace.projects.length===1?'':'s'} and ${workspace.notes.length} reusable notes are saved in this browser. Export a JSON backup to keep a copy you can restore anywhere.</p><div class="backup-actions">${btn('Export backup','export','primary','download')}${btn('Import backup','import','','upload')}${corruptRaw?btn('Download original data','export-original','','download'):''}</div><details class="paste-backup"><summary>Restore from pasted JSON</summary>${field('Backup JSON','backup-json','','textarea','class="code" placeholder="Paste the contents of a Sidequest backup"')}${btn('Check backup','import-paste','','check')}</details><div class="backup-detail"><strong>Local means this browser and this address.</strong><p>Nothing is sent to a server. Clearing browser data or changing the app address can make this workspace unavailable. Import your backup to move between browsers or devices.</p><p style="margin-top:12px">For consistent storage, use the included local server at <code>http://localhost:4173</code>. The standalone HTML version also works offline; keep it in the same folder.</p></div>`,btn('Done','close','quiet'),{type:'backup'});
}
async function readImport(file){
  try{
    const imported=validateWorkspace(JSON.parse(await file.text()));
    showDialog('Restore this workspace?',`<p class="brief-text">This backup contains ${imported.projects.length} project${imported.projects.length===1?'':'s'} and ${imported.notes.length} notes. Restoring replaces this workspace.</p><div class="notice" style="margin:20px 0 0">${icon('download')}<p>A backup of your current workspace will download before it is replaced.</p></div>`,btn('Cancel','close','quiet')+`<button type="submit" class="btn primary">Restore backup</button>`,{type:'confirm-import',workspace:imported});
  }catch(error){showDialog('Backup could not be opened',`<p class="brief-text">${E(error instanceof SyntaxError?'The file is not valid JSON. Choose a Sidequest backup.':error.message)}</p><p class="brief-text" style="margin-top:12px">Your current workspace has not changed.</p>`,btn('Choose another file','import','','upload')+btn('Close','close','quiet'));}
}
function performImport(imported){
  exportWorkspace();
  try{if(!store)store=createStore(localStorage);store.replace(imported);}catch(error){formError(`Restore could not be saved: ${error.message}. Your current workspace is unchanged.`);return;}
  workspace=imported;blockSave=false;storageIssue='';corruptRaw='';boardMilestone='all';boardKind='all';boardPriority='all';closeDialog();nav('overview');toast('Workspace restored');
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-nav],[data-action]');if(!target)return;
  if(target.dataset.nav){nav(target.dataset.nav);return;}
  const {action,id,type}=target.dataset;
  if(action==='close'){closeDialog();return;}
  if(action==='menu'){menuOpen=!menuOpen;render();document.querySelector(menuOpen?'.nav .active':'.mobile-menu')?.focus();return;}
  if(action==='open-board'){nav('board');return;}
  if(action==='new-project'){editor('project','',{template:target.dataset.template});return;}
  if(action==='edit-brief'){editor('brief');return;}
  if(action==='edit-record'){editor(type,id);return;}
  if(action==='delete-record'&&dialogContext){const c=dialogContext;confirmDelete(c.type,c.id);return;}
  if(action==='delete-project'){confirmDelete('project',project().id);return;}
  const newTypes={'new-task':'task','new-milestone':'milestone','new-option':'option','new-component':'component','new-api':'api','new-entity':'entity','new-decision':'decision','new-check':'check','new-note':'note'};
  if(newTypes[action]){editor(newTypes[action],'',{status:target.dataset.status,milestone:target.dataset.milestone});return;}
  if(action==='toggle-task'){const t=project().tasks.find(t=>t.id===id);t.status=t.status==='done'?'todo':'done';persist(t.status==='done'?'Task complete':'Task reopened');return;}
  if(action==='choose-option'){
    try{selectArchitecture(project(),id);persist('Architecture selected. Decision recorded.');}catch(error){toast(error.message);}return;
  }
  if(action==='api-tab'){apiTab=target.dataset.tab;render();return;}
  if(action==='backup'){backupDialog();return;}
  if(action==='export'){exportWorkspace();return;}
  if(action==='export-original'){download(`sidequest-original-${today()}.txt`,corruptRaw,'text/plain');return;}
  if(action==='import'){document.querySelector('#import-file').click();return;}
  if(action==='import-paste'){const text=document.querySelector('#f-backup-json').value;if(!text.trim()){formError('Paste a Sidequest JSON backup first.');return;}readImport(new Blob([text],{type:'application/json'}));return;}
  if(action==='search-result'){
    workspace.activeProject=target.dataset.project;route=target.dataset.view;apiTab=type==='entity'?'entities':'apis';query='';persist('');if(type&&id)editor(type,id);return;
  }
});
document.addEventListener('submit',event=>{if(event.target.id==='record-form')saveRecord(event);});
document.addEventListener('change',event=>{
  const t=event.target;
  if(t.id==='project-select'){workspace.activeProject=t.value;boardMilestone='all';boardKind='all';boardPriority='all';query='';persist('Project opened');}
  if(t.id==='filter-kind'){boardKind=t.value;render();}
  if(t.id==='filter-milestone'){boardMilestone=t.value;render();}
  if(t.id==='filter-priority'){boardPriority=t.value;render();}
  if(t.classList.contains('task-status')){const task=project().tasks.find(x=>x.id===t.dataset.id);task.status=t.value;persist(`Moved to ${statusLabel[t.value]}`);}
  if(t.dataset.check){const check=project().deployment.find(x=>x.id===t.dataset.check);check.done=t.checked;persist(check.done?'Check complete':'Check reopened');}
  if(t.id==='f-template'){const idea=templates.find(x=>x.id===t.value);document.querySelector('#f-title').value=idea.id==='blank'?'':idea.name;document.querySelector('#f-category').value=idea.category;}
  if(t.id==='import-file'&&t.files[0]){readImport(t.files[0]);t.value='';}
});
document.addEventListener('input',event=>{if(event.target.id==='search'){query=event.target.value;document.querySelector('#main').innerHTML=content();}});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.querySelector('#search').focus();}if(event.key==='Escape'&&!document.querySelector('#editor').open){if(query){query='';render();}else if(menuOpen){menuOpen=false;render();document.querySelector('.mobile-menu')?.focus();}}});
document.addEventListener('dragstart',event=>{const card=event.target.closest('[data-task]');if(card){dragId=card.dataset.task;event.dataTransfer.setData('text/plain',dragId);event.dataTransfer.effectAllowed='move';card.classList.add('dragging');}});
document.addEventListener('dragend',()=>{dragId='';document.querySelectorAll('.dragging,.drag-over').forEach(el=>el.classList.remove('dragging','drag-over'));});
document.addEventListener('dragover',event=>{const lane=event.target.closest('[data-lane]');if(lane&&dragId){event.preventDefault();lane.classList.add('drag-over');event.dataTransfer.dropEffect='move';}});
document.addEventListener('dragleave',event=>{const lane=event.target.closest('[data-lane]');if(lane&&!lane.contains(event.relatedTarget))lane.classList.remove('drag-over');});
document.addEventListener('drop',event=>{const lane=event.target.closest('[data-lane]');if(lane&&dragId){event.preventDefault();const task=project().tasks.find(t=>t.id===dragId);if(task){task.status=lane.dataset.lane;persist(`Moved to ${statusLabel[task.status]}`);}dragId='';}});
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(Object.hasOwn(labels,h)&&h!==route){route=h;query='';render();}});
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY||event.key===null){blockSave=true;storageIssue='This workspace changed in another tab. Export any work in this tab, then reload to use the latest version.';render();}});
document.querySelector('#editor').addEventListener('close',()=>{if(lastFocus?.isConnected)lastFocus.focus();});
render();
