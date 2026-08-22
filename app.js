const signinModal=document.getElementById('signinModal');function openSignin(){signinModal.classList.add('open');document.getElementById('signinError').style.display='none'}function closeSignin(){signinModal.classList.remove('open')}
const DOCUMENTS={
Professional:[['Employment contract','Uploaded'],['Residence permit application','Not uploaded'],['Insurance certificate','Not uploaded'],['Proof of address (for DVV)','Pending arrival'],['Passport copy','Uploaded']],
Student:[['Admission letter','Uploaded'],['Proof of funds statement','Not uploaded'],['Insurance certificate','Not uploaded'],['Passport copy','Uploaded']],
Researcher:[['Hosting agreement','Uploaded'],['Salary confirmation letter','Not uploaded'],['Passport copy','Uploaded']]
};
const DEMO_ACCOUNTS={'meera.student':{pass:'Finland2026',persona:'Student'},'arjun.pro':{pass:'Finland2026',persona:'Professional'}};
const familyModal=document.getElementById('familyModal');
const PERSONAS={
Student:{name:'Meera',sub:'Student · Bengaluru → Helsinki',progress:42,
steps:[['done','✓','Secure study place','Completed · university admission'],['done','✓','Prepare residence permit','Documents ready · insurance pending'],['','3','Plan finances','Prove roughly €800/month living-cost funds'],['','4','Arrival setup','Identity code · municipality · services']],
tasks:[[1,'Confirm admission / offer','Done · pathway requirement'],[0,'Arrange required insurance','Before submitting your permit application'],[0,'Prepare proof of funds','~€800/month personal savings, student permit basis'],[0,'Plan post-arrival registration','Based on your city and situation']]},
Researcher:{name:'Divya',sub:'Researcher · Pune → Espoo',progress:55,
steps:[['done','✓','Sign hosting agreement','Completed · with research organisation'],['done','✓','Apply for researcher permit','Submitted · salary meets collective agreement'],['','3','Arrange family permit','For spouse and children, if applicable'],['','4','Arrival setup','Identity code · municipality · services']],
tasks:[[1,'Sign hosting agreement','Done · basis for researcher permit'],[1,'Confirm salary meets threshold','Done · min. approx €1,463/month in 2026'],[0,'Arrange family residence permit','If relocating with spouse or children'],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]},
Professional:{name:'Arjun',sub:'Professional with family · Chennai → Helsinki',progress:35,
steps:[['done','✓','Accept job offer','Completed · employer sponsoring permit'],['done','✓','Apply for employment permit','Documents submitted'],['','3','Plan for family','School & daycare research, spouse support'],['','4','Arrival setup','Identity code · municipality · housing']],
tasks:[[1,'Confirm employment contract & permit basis','Done · employer-sponsored'],[0,'Arrange housing','Before arrival or shortly after'],[0,'Research school and daycare options','For accompanying children'],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]}
};
let currentPersona='Student';
let completedStages=new Set();
function setBlur(on){
const ws=document.getElementById('workspace');if(ws)ws.classList.toggle('blurred',on);
const hd=document.querySelector('.dashboard');if(hd)hd.classList.toggle('blurred',on);
}
function showApp(){
document.querySelectorAll('.marketing').forEach(el=>el.style.display='none');
document.getElementById('workspace').style.display='';
window.scrollTo(0,0);
const b=document.getElementById('navAuthBtn');
b.textContent='Log out';
b.setAttribute('onclick','logout()');
}
function showMarketingSite(){
document.querySelectorAll('.marketing').forEach(el=>el.style.display='');
document.getElementById('workspace').style.display='none';
window.scrollTo(0,0);
const b=document.getElementById('navAuthBtn');
b.textContent='Build my roadmap';
b.setAttribute('onclick','openSignin()');
}
window.logout=function(){showMarketingSite()};
function showSkeleton(){
document.getElementById('heroName').textContent='Building your roadmap…';
document.getElementById('heroSub').textContent='Personalising for you…';
document.getElementById('heroPill').textContent='';
document.getElementById('heroProgress').style.width='0%';
document.getElementById('heroSteps').innerHTML=[1,2,3,4].map(()=>'<div class="step"><div class="dot" style="background:#e8edf2"></div><div style="flex:1"><div style="height:12px;background:#e8edf2;border-radius:6px;width:70%;margin-bottom:6px"></div><div style="height:9px;background:#edf1f5;border-radius:6px;width:50%"></div></div></div>').join('');
}
function showAppTab(tab){
document.getElementById('tabRoadmap').style.display=tab==='roadmap'?'':'none';
document.getElementById('tabDocuments').style.display=tab==='documents'?'':'none';
document.getElementById('tabbtn-roadmap').classList.toggle('active',tab==='roadmap');
document.getElementById('tabbtn-documents').classList.toggle('active',tab==='documents');
if(tab==='roadmap')updateProgress();
}
window.toggleStage=function(id){
const el=document.getElementById('detail-'+id);
if(el)el.style.display=el.style.display==='none'?'':'none';
};
window.markComplete=function(id,checked){
if(checked)completedStages.add(id);else completedStages.delete(id);
const card=document.querySelector('.rmcard[data-stage="'+id+'"]');
if(card)card.classList.toggle('done',checked);
updateProgress();
};
function updateProgress(){
const activeGrid=currentPersona==='Professional'?document.getElementById('fullRoadmapInner'):document.getElementById('simpleTaskCards');
const badge=document.getElementById('taskProgressBadge');
if(!activeGrid){badge.style.display='none';return}
const total=activeGrid.querySelectorAll('.rmcard').length;
const done=activeGrid.querySelectorAll('.rmcard.done').length;
if(total>0){badge.style.display='inline';badge.textContent=' ('+done+'/'+total+')';}
else{badge.style.display='none';}
}
function resetProgress(){
completedStages=new Set();
document.querySelectorAll('.rmcard').forEach(c=>c.classList.remove('done'));
document.querySelectorAll('.rmdetail').forEach(d=>d.style.display='none');
document.querySelectorAll('.rmcomplete input[type=checkbox]').forEach(cb=>cb.checked=false);
}
function buildSimpleTaskCards(tasks){
return tasks.map((x,i)=>{
const id='simple-'+i;
return '<div class="rmcard pre" data-stage="'+id+'" onclick="toggleStage(\''+id+'\')" style="margin-bottom:12px">'+
'<p class="rmtitle">'+x[1]+'</p>'+
'<p class="rmdesc">'+x[2]+'</p>'+
'<div class="rmdetail" id="detail-'+id+'" style="display:none" onclick="event.stopPropagation()">'+
'<ul class="rmchecklist"><li>'+x[2]+'</li></ul>'+
'<label class="rmcomplete"><input type="checkbox" '+(x[0]?'checked':'')+' onchange="markComplete(\''+id+'\',this.checked)"> Mark complete</label>'+
'</div></div>';
}).join('');
}
function studentOverride(family){
if(!family||!family.living){return{}}
if(family.living==='alone'){
return{sub:'Student · Bengaluru → Helsinki',
step3:['','3','Plan finances','Prove roughly €800/month living-cost funds'],
tasks:[[1,'Confirm admission / offer','Done · pathway requirement'],[0,'Arrange required insurance','Before submitting your permit application'],[0,'Prepare proof of funds','~€800/month personal savings, student permit basis'],[0,'Plan post-arrival registration','Based on your city and situation']]};
}
if(family.family==='spouse'){
return{sub:'Student, relocating with spouse · Bengaluru → Helsinki',
step3:['','3','Plan for spouse','Spouse residence permit on family ties, income requirement applies'],
tasks:[[1,'Confirm admission / offer','Done · pathway requirement'],[0,'Arrange required insurance','Before submitting your permit application'],[0,'Prepare proof of funds','~€800/month personal savings, student permit basis'],[0,'Arrange spouse residence permit','On family ties · income requirement ~€610/month for spouse'],[0,'Plan post-arrival registration','Based on your city and situation']]};
}
const ages=(family.ages||[]).join(', ');
return{sub:'Student with family · Bengaluru → Helsinki',
step3:['','3','Plan for family','Spouse and children\u2019s permits, school & daycare research'],
tasks:[[1,'Confirm admission / offer','Done · pathway requirement'],[0,'Arrange required insurance','Before submitting your permit application'],[0,'Prepare proof of funds','~€800/month personal savings, student permit basis'],[0,'Arrange spouse and children\u2019s residence permits','On family ties · income requirement per family member applies'],[0,'Research school and daycare options','For children aged '+ages],[0,'Plan post-arrival registration','Based on your city and situation']]};
}
function professionalOverride(family){
if(!family||!family.living){return{}}
if(family.living==='alone'){
return{sub:'Professional · Chennai → Helsinki',
step3:['','3','Finalise logistics','Insurance, banking prep and travel booking'],
tasks:[[1,'Confirm employment contract & permit basis','Done · employer-sponsored'],[0,'Arrange housing','Before arrival or shortly after'],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]};
}
if(family.family==='spouse'){
return{sub:'Professional, relocating with spouse · Chennai → Helsinki',
step3:['','3','Plan for spouse','Spouse residence permit and settling-in support'],
tasks:[[1,'Confirm employment contract & permit basis','Done · employer-sponsored'],[0,'Arrange housing','Before arrival or shortly after'],[0,'Arrange spouse residence permit','Based on your employment permit basis'],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]};
}
const ages=(family.ages||[]).join(', ');
return{sub:'Professional with family · Chennai → Helsinki',
step3:['','3','Plan for family','School & daycare research, spouse support'],
tasks:[[1,'Confirm employment contract & permit basis','Done · employer-sponsored'],[0,'Arrange housing','Before arrival or shortly after'],[0,'Arrange spouse and children\u2019s residence permits','Based on your employment permit basis'],[0,'Research school and daycare options','For children aged '+ages],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]};
}
function renderPersona(t,family){
resetProgress();
currentPersona=t;const p=PERSONAS[t];
const o=t==='Professional'?professionalOverride(family):t==='Student'?studentOverride(family):{};
const sub=o.sub||p.sub;
const steps=o.step3?[p.steps[0],p.steps[1],o.step3,p.steps[3]]:p.steps;
const tasks=o.tasks||p.tasks;
document.getElementById('heroName').textContent=p.name+"’s Finland roadmap";
document.getElementById('heroSub').textContent=t+' · '+sub.split(' · ').slice(1).join(' · ');
document.getElementById('heroPill').textContent=p.progress+'% ready';
document.getElementById('heroProgress').style.width=p.progress+'%';
document.getElementById('heroSteps').innerHTML=steps.map(s=>'<div class="step"><div class="dot '+s[0]+'">'+s[1]+'</div><div><strong>'+s[2]+'</strong><br><small>'+s[3]+'</small></div></div>').join('');
document.getElementById('appHeaderName').textContent=p.name+"’s Finland roadmap";
document.getElementById('appHeaderSub').textContent=t+' · '+sub.split(' · ').slice(1).join(' · ');
document.getElementById('appHeaderPill').textContent=p.progress+'% ready';
document.getElementById('appHeaderProgress').style.width=p.progress+'%';
document.getElementById('appHeaderPhases').innerHTML=buildPhaseTracker();
['Student','Researcher','Professional'].forEach(k=>document.getElementById('persona-card-'+k).classList.toggle('active',k===t));
const fri=document.getElementById('fullRoadmapInner'),stc=document.getElementById('simpleTaskCards');
if(t==='Professional'){
fri.style.display='';
stc.style.display='none';
const s5=document.getElementById('fr-stage5');
if(!family||!family.living||family.living==='alone'){s5.textContent='Housing support.'}
else if(family.family==='spouse'){s5.textContent='Housing support and spouse settling-in.'}
else{s5.textContent='Housing support, spouse settling-in, and school & daycare research for children aged '+(family.ages||[]).join(', ')+'.'}
}else{
fri.style.display='none';
stc.style.display='';
stc.innerHTML=buildSimpleTaskCards(tasks);
}
document.getElementById('documentList').innerHTML=buildDocumentList(t);
showAppTab('roadmap');
updateProgress();
}
function selectPersona(t){openSignin()}
renderPersona('Student');
function buildPhaseTracker(){
const phases=[['✓','Explore','done'],['✓','Apply','done'],['3','Travel','current'],['4','Activate',''],['5','Integrate','']];
return phases.map(ph=>{
const circleStyle=ph[2]==='done'?'background:#dff7f1;color:#087c6d':ph[2]==='current'?'background:var(--blue);color:#fff':'background:#edf3ff;color:var(--blue)';
const labelStyle=ph[2]==='current'?'color:var(--ink);font-weight:500':'color:var(--muted)';
return '<div style="flex:1;text-align:center"><div style="width:24px;height:24px;border-radius:50%;'+circleStyle+';font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 4px">'+ph[0]+'</div><p style="font-size:10px;margin:0;'+labelStyle+'">'+ph[1]+'</p></div>';
}).join('');
}
function buildDocumentList(t){
const docs=DOCUMENTS[t]||[];
return docs.map(d=>{
const done=d[1]==='Uploaded';
const badgeStyle=done?'background:#e8f8f4;color:#087c6d':'background:#f6f8fb;color:var(--muted)';
return '<div style="display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:14px;padding:13px 16px;margin-bottom:10px">'+
'<div><p style="margin:0;font-size:14px;font-weight:500">'+d[0]+'</p></div>'+
'<div style="display:flex;align-items:center;gap:10px"><span style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;'+badgeStyle+'">'+d[1]+'</span>'+
(done?'':'<button class="btn secondary" style="padding:6px 12px;font-size:12px">Upload</button>')+
'</div></div>';
}).join('');
}
function doSignin(){
const u=document.getElementById('signinUser').value.trim(),p=document.getElementById('signinPass').value.trim(),err=document.getElementById('signinError');
const acc=DEMO_ACCOUNTS[u];
if(!u||!p){err.textContent='Enter a username and password.';err.style.display='block';return}
if(!acc||acc.pass!==p){err.textContent='Incorrect username or password.';err.style.display='block';return}
err.style.display='none';closeSignin();showSkeleton();setBlur(true);openOnboard()
}
signinModal.addEventListener('click',e=>{if(e.target===signinModal)closeSignin()});
const modal=document.getElementById('modal');function openOnboard(){modal.classList.add('open')}function closeOnboard(){modal.classList.remove('open')}
function choose(t){
if(t==='Professional'||t==='Student'){closeOnboard();openFamilyQuestionnaire(t);return}
renderPersona(t);setBlur(false);showApp();const r=document.getElementById('result');r.style.display='block';r.innerHTML='<strong>'+t+' roadmap created.</strong><br>Next steps are prioritised around eligibility, documents, arrival and settling in.';setTimeout(closeOnboard,1300)
}

const famBox=document.getElementById('famWrap');
const famProg=document.getElementById('famProgress');
let famAnswers={};
let famPersona='Professional';

function famDrawProgress(step,total){
famProg.innerHTML='';
for(let i=0;i<total;i++){
const d=document.createElement('div');
d.style.cssText='flex:1;height:5px;border-radius:99px;background:'+(i<step?'var(--blue)':'#e8edf2');
famProg.appendChild(d);
}
}
function famHeader(){
const first=PERSONAS[famPersona].name;
return '<p style="font-size:20px;font-weight:500;margin:0 0 6px;">Hi '+first+', let us personalise your roadmap</p><p style="font-size:14px;color:#617387;margin:0 0 20px;line-height:1.6;">A few quick questions so we can tailor your tasks, timelines and family-related steps.</p>';
}
function famOptionBtn(label,handler){
return '<button onclick="'+handler+'" style="width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:15px;padding:15px 16px;font-size:14px;font-weight:500;cursor:pointer;margin-bottom:10px;">'+label+'</button>';
}
function openFamilyQuestionnaire(personaKey){
setBlur(true);
famPersona=personaKey;
famAnswers={};
familyModal.classList.add('open');
famDrawProgress(0,1);
famBox.innerHTML=famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 1</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Are you relocating alone, or with family?</p>'+
famOptionBtn('Just me','famAnswerLiving(&quot;alone&quot;)')+
famOptionBtn('With family','famAnswerLiving(&quot;family&quot;)');
}
window.famAnswerLiving=function(val){
famAnswers.living=val;
if(val==='alone'){famDrawProgress(1,1);famFinish()}
else{famDrawProgress(1,3);famRenderFamilyType()}
};
function famRenderFamilyType(){
famBox.innerHTML=famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 2</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Is it your spouse only, or kids too?</p>'+
famOptionBtn('Spouse only','famAnswerFamily(&quot;spouse&quot;)')+
famOptionBtn('Spouse and kids','famAnswerFamily(&quot;kids&quot;)');
}
window.famAnswerFamily=function(val){
famAnswers.family=val;
if(val==='spouse'){famDrawProgress(3,3);famFinish()}
else{famDrawProgress(2,3);famRenderKids()}
};
function famRenderKids(){
famBox.innerHTML=famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 3</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 4px;">How many kids, and how old is each?</p>'+
'<p style="font-size:13px;color:#617387;margin:0 0 14px;">This helps us bring in the right school and daycare steps at the right time.</p>'+
'<div id="kidRows">'+
'<div class="kidRow" style="border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;"><span style="font-size:13px;color:#617387;width:46px;">Kid 1</span><input class="kidAge" placeholder="Age" style="flex:1;box-sizing:border-box;border:1px solid var(--line);border-radius:10px;padding:9px 11px;font-size:14px;"></div>'+
'</div>'+
'<button onclick="famAddKid()" style="width:100%;text-align:left;background:none;border:none;color:var(--blue);font-size:13px;font-weight:700;cursor:pointer;padding:4px 0 14px;">+ Add another child</button>'+
'<p id="famAgeErr" style="display:none;color:#c0392b;font-size:12px;margin:0 0 10px;">Enter at least one age to continue.</p>'+
'<button onclick="famSubmitKids()" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:12px;padding:13px;font-weight:750;font-size:14px;cursor:pointer;">Continue →</button>';
}
window.famAddKid=function(){
const rows=document.getElementById('kidRows');
const n=rows.children.length+1;
const div=document.createElement('div');
div.className='kidRow';
div.style.cssText='border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;';
div.innerHTML='<span style="font-size:13px;color:#617387;width:46px;">Kid '+n+'</span><input class="kidAge" placeholder="Age" style="flex:1;box-sizing:border-box;border:1px solid var(--line);border-radius:10px;padding:9px 11px;font-size:14px;">';
rows.appendChild(div);
};
window.famSubmitKids=function(){
const ages=Array.from(document.querySelectorAll('.kidAge')).map(i=>i.value.trim()).filter(Boolean);
const e=document.getElementById('famAgeErr');
if(ages.length===0){e.style.display='block';return}
e.style.display='none';
famAnswers.ages=ages;
famDrawProgress(3,3);
famFinish();
};
function famFinish(){
let note;
if(famAnswers.living==='alone'){note='Just you. We will keep things simple and focused on your own permit and settling-in steps.'}
else if(famAnswers.family==='spouse'){note="You and your spouse. We will include spouse residence permit and settling-in steps."}
else{note='You, your spouse and '+(famAnswers.ages.length>1?'kids':'a child')+' aged '+famAnswers.ages.join(', ')+'. We will include family permits, plus school and daycare steps.'}
famBox.innerHTML='<div style="text-align:center;padding:6px 0 4px;">'+
'<div style="width:44px;height:44px;border-radius:50%;background:#dff7f1;color:#087c6d;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;margin:0 auto 16px;">✓</div>'+
'<p style="font-size:18px;font-weight:500;margin:0 0 8px;">Got it, thanks '+PERSONAS[famPersona].name+'</p>'+
'<p style="font-size:14px;color:#617387;line-height:1.6;margin:0 0 22px;">'+note+'</p>'+
'<button onclick="famComplete()" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:12px;padding:13px;font-weight:750;font-size:14px;cursor:pointer;">Build my roadmap →</button>'+
'</div>';
}
window.famComplete=function(){
familyModal.classList.remove('open');
renderPersona(famPersona,famAnswers);
setBlur(false);
showApp();
};
function recalc(){alert('Demo: roadmap recalculated from your profile, destination, stage and outstanding tasks.')}
// Base URL of your backend. Override by setting window.RELOCATION_API_BASE_URL before this script loads.
const RELOCATION_API_BASE_URL=(window.RELOCATION_API_BASE_URL||'http://localhost:8000');
const RELOCATION_API_ENDPOINT='/api/query';
function chatEscapeHtml(s){return String(s==null?'':s).replace(/[<>&]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;'}[c]})}
function chatAppendBubble(html,cls){const c=document.getElementById('chat');c.insertAdjacentHTML('beforeend','<div class="bubble'+(cls?(' '+cls):'')+'">'+html+'</div>');c.scrollTop=c.scrollHeight;return c.lastElementChild}
// Maps the app's three onboarding personas onto the backend's two-value user_type.
// Researcher counts as "professional" for this purpose — there's no separate
// backend category for it yet.
function mapUserType(persona){return persona==='Student'?'student':'professional'}
// Builds the exact profile fields the backend's /api/query endpoint accepts,
// live from whatever the user has actually selected so far (persona choice +
// family questionnaire answers). Nothing here is hardcoded/guessed — fields
// are simply omitted if the user hasn't answered that part yet.
function buildApiProfileFields(){
const persona=PERSONAS[currentPersona]||{};
const fields={};
const username=persona.name;
if(username)fields.username=username;
if(currentPersona)fields.user_type=mapUserType(currentPersona);
if(typeof famAnswers!=='undefined'&&famAnswers&&famAnswers.living){
fields.family_status=famAnswers.living==='alone'?'alone':'with_family';
}
const hasKids=!!(typeof famAnswers!=='undefined'&&famAnswers&&famAnswers.family==='kids'&&famAnswers.ages&&famAnswers.ages.length);
fields.has_kids=hasKids;
fields.kids_ages=hasKids?famAnswers.ages.map(function(a){return parseInt(a,10)}).filter(function(n){return Number.isFinite(n)}):[];
return fields;
}
// Lightweight Markdown-ish renderer for the assistant's answer text: turns
// **bold** into <strong>, groups of "- "/"\u2022 " lines into a <ul>, and blank-line
// separated blocks into paragraphs. Escapes first so raw HTML in the answer
// can never inject markup — the ** / - syntax survives escaping untouched.
function formatAnswerHtml(text){
if(!text)return '';
const escaped=chatEscapeHtml(text);
let styled=escaped.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
styled=styled.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener" style="color:var(--blue);text-decoration:none;font-weight:500;">$1</a>');
const blocks=styled.split(/\n\s*\n/);
return blocks.map(function(block){
const lines=block.split('\n').map(function(l){return l.trim()}).filter(Boolean);
if(!lines.length)return '';
const isList=lines.every(function(l){return /^[-\u2022]\s+/.test(l)});
if(isList){
return '<ul style="margin:4px 0 10px 18px;padding:0;">'+lines.map(function(l){return '<li style="margin-bottom:6px;line-height:1.5;">'+l.replace(/^[-\u2022]\s+/,'')+'</li>'}).join('')+'</ul>';
}
return '<p style="margin:0 0 10px;line-height:1.5;">'+lines.join('<br>')+'</p>';
}).join('');
}
function renderChatMeta(data){
let html='';
if(Array.isArray(data.actions)&&data.actions.length){
html+='<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(0,0,0,.08);"><p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#617387;margin:0 0 6px;">Suggested next steps</p>'+
data.actions.map(function(a){return '<div style="font-size:13px;margin-bottom:4px;">\u2022 '+chatEscapeHtml(a.title)+' <span style="color:#8a97a6;font-size:11px;">('+chatEscapeHtml(a.priority)+')</span></div>'}).join('')+
'</div>';
}
if(Array.isArray(data.sources)&&data.sources.length){
html+='<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(0,0,0,.08);"><p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#617387;margin:0 0 6px;">Sources</p>'+
data.sources.map(function(s){
// Simple backend uses {title, link, snippet}; the fuller backend uses {title, url, domain, official} — support both.
const href=s.url||s.link||'';
if(!href)return '';
return '<div style="font-size:13px;margin-bottom:4px;"><a href="'+chatEscapeHtml(href)+'" target="_blank" rel="noopener" style="color:var(--blue);text-decoration:none;">'+chatEscapeHtml(s.title||s.domain||href)+'</a>'+(s.official?' <span style="color:#087c6d;font-size:11px;">\u00b7 official</span>':'')+'</div>'
}).join('')+
'</div>';
}
if(Array.isArray(data.warnings)&&data.warnings.length){
html+='<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(0,0,0,.08);color:#9a6b1f;font-size:12px;line-height:1.5;">'+
data.warnings.map(function(w){return '\u26a0 '+chatEscapeHtml(w)}).join('<br>')+
'</div>';
}
if(data.confidence){
const colors={high:'#087c6d',medium:'#9a6b1f',low:'#c0392b'};
html+='<div style="margin-top:8px;font-size:11px;color:'+(colors[data.confidence]||'#617387')+';">Confidence: '+chatEscapeHtml(data.confidence)+'</div>';
}
return html;
}
// Formats an error response body into a readable string, handling both a
// plain string `detail` and FastAPI's validation-error shape, where `detail`
// is an array of {loc, msg, type} objects (this is what caused "[object
// Object]" before — string-concatenating an array/object doesn't stringify it usefully).
function formatErrorDetail(errBody){
if(!errBody)return '';
const d=errBody.detail;
if(!d)return '';
if(typeof d==='string')return d;
if(Array.isArray(d)){
return d.map(function(e){
if(e&&typeof e==='object'){
const field=Array.isArray(e.loc)?e.loc[e.loc.length-1]:'';
return (field?field+': ':'')+(e.msg||JSON.stringify(e));
}
return String(e);
}).join('; ');
}
try{return JSON.stringify(d)}catch(e){return String(d)}
}
async function ask(){
const i=document.getElementById('question'),q=i.value.trim();
if(!q)return;
const c=document.getElementById('chat');
c.insertAdjacentHTML('beforeend','<div class="bubble user">'+chatEscapeHtml(q)+'</div>');
i.value='';
c.scrollTop=c.scrollHeight;
const thinking=chatAppendBubble('<span style="opacity:.6">Thinking\u2026</span>');
const payload=Object.assign({text:q},buildApiProfileFields());
try{
const res=await fetch(RELOCATION_API_BASE_URL+RELOCATION_API_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
if(!res.ok){
let detail='';
try{const errBody=await res.json();detail=formatErrorDetail(errBody)}catch(e){}
throw new Error('Backend returned '+res.status+(detail?(': '+detail):''))
}
const data=await res.json();
thinking.innerHTML=formatAnswerHtml(data.answer||'')+renderChatMeta(data);
}catch(err){
console.error('Relocation chat request failed:',err);
thinking.innerHTML='I couldn\u2019t reach the assistant backend right now ('+chatEscapeHtml(err.message||'network error')+'). Make sure the backend API server is running at '+chatEscapeHtml(RELOCATION_API_BASE_URL)+' and try again.';
}
c.scrollTop=c.scrollHeight;
}modal.addEventListener('click',e=>{if(e.target===modal)closeOnboard()});