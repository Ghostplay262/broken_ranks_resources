import {PROFESSIONS} from './engine.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rankNames=['Uczeń','Adept','Mistrz'];
const sameName=(a,b)=>a.toLocaleLowerCase('pl')===b.toLocaleLowerCase('pl');
export function skillRank(level){return level?rankNames[Math.floor((level-1)/7)]+' '+['I','II','III','IV','V','VI','VII'][(level-1)%7]:'Nieprzydzielona';}

export function skillRows(build,skillsData){
 const defs=skillsData.skills,grouped=new Map();
 for(const [i,skill] of build.skills.entries()){
  const key=skill.name+'|'+skill.level;
  if(grouped.has(key))grouped.get(key).indices.push(i);
  else grouped.set(key,{...skill,indices:[i],def:defs.find(d=>sameName(d.name,skill.name))});
 }
 for(const def of defs.filter(d=>!d.legacy&&(!d.profession||d.profession===build.profession))){
  if(!build.skills.some(s=>sameName(s.name,def.name)))grouped.set(def.name+'|0',{name:def.name,level:0,indices:[],def});
 }
 const order=s=>s.def?defs.indexOf(s.def):defs.length;
 return [...grouped.values()].sort((a,b)=>order(a)-order(b));
}

// Keep the original flat 0–21 representation and every imported duplicate record.
export function setSkillLevel(build,skillsData,name,indices,level){
 const def=skillsData.skills.find(d=>sameName(d.name,name));
 if(!Array.isArray(indices)||indices.some(i=>!Number.isInteger(i)||!build.skills[i]||!sameName(build.skills[i].name,name)))return false;
 const max=Math.min(21,Math.max(def?.maxLevel||21,...indices.map(i=>build.skills[i].level)));
 if(!Number.isInteger(level)||level<0||level>max)return false;
 if(indices.length)for(const i of indices)build.skills[i].level=level;
 else if(level)build.skills.push({name,level});
 return true;
}

function skillControls(skill){
 const tier=skill.level?Math.floor((skill.level-1)/7):0,step=skill.level?(skill.level-1)%7+1:1,max=Math.max(skill.def?.maxLevel||21,skill.level);
 if(skill.def?.fixed)return '<div class="skill-fixed"><span class="badge">UMIEJĘTNOŚĆ STAŁA</span><span>Nie wymaga rozwijania poziomów.</span></div>';
 return `<div class="skill-controls" data-rank="${tier}"><div class="skill-control-heading"><span>Stopień</span><button class="skill-reset" type="button" data-skill-select="0" data-skill-control="reset" aria-label="Wyzeruj: ${esc(skill.name)}" ${skill.level?'':'disabled'}>Wyzeruj</button></div><div class="skill-ranks" role="group" aria-label="Stopień: ${esc(skill.name)}">${rankNames.map((name,index)=>{const value=Math.min(index*7+step,max),disabled=index*7>=max;return `<button type="button" class="skill-rank-choice" data-rank="${index}" data-skill-select="${value}" data-skill-control="rank-${index}" aria-label="${name}: ${esc(skill.name)}" aria-pressed="${tier===index}" title="${name}" ${disabled?'disabled':''}><span class="skill-rank-dot" aria-hidden="true">${tier===index?'✓':''}</span><span>${name}</span></button>`;}).join('')}</div><div class="skill-control-heading"><span>Poziom w stopniu</span><strong>${esc(skillRank(skill.level))}</strong></div><div class="skill-levels" role="group" aria-label="Poziom: ${esc(skill.name)}">${Array.from({length:7},(_,index)=>{const value=tier*7+index+1;return `<button type="button" class="skill-level-dot" data-skill-select="${value}" data-skill-control="level-${index+1}" aria-label="${rankNames[tier]} ${index+1}: ${esc(skill.name)}" aria-pressed="${skill.level===value}" ${value>max?'disabled':''}>${index+1}</button>`;}).join('')}</div></div>`;
}

function skillValues(skill,build){
 const def=skill.def,previewLevel=def?.fixed?1:skill.level||1,level=def?.levels?.find(l=>l.level===previewLevel),required=level?.requiredLevel??def?.minLevel;
 const values=level?.values||[],notes=[...(def?.notes||[]),...(level?.notes||[])];
 return `<div class="skill-data"><div class="skill-data-heading"><span>${def?.fixed?'Wartości umiejętności':skill.level?'Wartości · '+skillRank(skill.level):'Podgląd · '+skillRank(previewLevel)}</span>${!skill.level&&!def?.fixed?'<small>Nieprzydzielona</small>':''}</div>${values.length?`<dl class="skill-values">${values.map(v=>`<div><dt>${esc(v.label)}</dt><dd>${esc(v.value)}</dd></div>`).join('')}</dl>`:'<p class="inline-note">Brak zweryfikowanych wartości dla tego poziomu.</p>'}${notes.length?`<ul class="skill-notes ${level?.uncertain?'gold':''}">${notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}${def?.mechanics?.length?`<details class="skill-mechanics"><summary>Zasady i wzory</summary><dl>${def.mechanics.map(m=>`<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('')}</dl></details>`:''}<div class="skill-caption">${required?`<span class="${build.level<required?'red':'muted'}">Wymagany poz. postaci: ${required}</span>`:'<span></span>'}${def?.source?`<a href="${esc(def.source)}" target="_blank" rel="noreferrer">WikiBR ↗</a>`:''}</div></div>`;
}

export function skillsView(build,skillsData){
 const rows=skillRows(build,skillsData),sections=['Klasowe','Ogólne','Specjalne','Pasywne','Pozostałe'];
 const groupOf=s=>s.def?.legacy||s.def?.profession&&s.def.profession!==build.profession?'Pozostałe':s.def?.category||'Pozostałe';
 return `<div class="skills-intro panel"><div class="panel-body"><div class="skills-intro-heading"><div><div class="eyebrow">KSIĘGA UMIEJĘTNOŚCI · POZIOM ${build.level}</div><h2>Umiejętności postaci</h2></div><label class="skill-profession">Klasa postaci<select id="profession" aria-label="Klasa postaci">${PROFESSIONS.map(p=>`<option value="${esc(p)}" ${p===build.profession?'selected':''}>${esc(p)}</option>`).join('')}</select></label></div><p class="muted">Wybierz stopień: żółty Uczeń, pomarańczowy Adept lub czerwony Mistrz. Następnie ustaw poziom 1–7.</p><p class="inline-note">Wartości bazowe z WikiBR zmieniają się wraz z wyborem poziomu. Modyfikatory postaci i przebieg walki nie są tutaj symulowane.</p>${rows.some(s=>s.indices.length>1)?'<div class="notice">Powtórzone wpisy o tej samej nazwie i poziomie pokazujemy razem. Oryginalne rekordy pozostają zachowane w eksporcie.</div>':''}</div></div>${sections.map(category=>{
  const list=rows.filter(s=>groupOf(s)===category);if(!list.length)return '';
  return `<section class="panel skill-section"><div class="panel-heading"><h2>${category==='Klasowe'?'Umiejętności klasowe':category}</h2><span class="muted">${list.length}</span></div><div class="skill-grid">${list.map(s=>`<article class="skill-card ${s.level?'learned':''}" data-skill-card data-skill-name="${esc(s.name)}" data-skill-indices="${s.indices.join(',')}"><div class="skill-card-heading"><span class="skill-portrait" aria-hidden="true">${s.def?.image?`<img class="${s.def.imagePresentation==='banner-icon'?'skill-banner-icon':''}" src="${esc(s.def.image)}" alt="" loading="lazy" decoding="async">`:'<span>?</span>'}</span><div class="skill-title"><h3>${esc(s.name)}</h3><span class="skill-current-rank">${s.def?.fixed?'Umiejętność ogólna':esc(skillRank(s.level))}</span>${s.indices.length>1?`<span class="badge">${s.indices.length} wpisy</span>`:''}</div></div><p class="skill-description">${esc(s.def?.description||(s.def?.legacy?'Wpis zachowany z importu. Aktualna tabela wiki nie zawiera tej wersji umiejętności.':'Własna umiejętność. Możesz zapisać jej poziom w buildzie.'))}</p>${skillControls(s)}${skillValues(s,build)}</article>`).join('')}</div></section>`;
 }).join('')}<section class="panel"><div class="panel-body"><h3>Dodaj inną umiejętność</h3><div class="fields skill-add"><label>Nazwa<input id="new-skill-name" maxlength="100" placeholder="Nazwa z gry"></label><button data-action="add-skill">Dodaj</button></div><button class="small" data-action="local-save">Zapisz build na tym urządzeniu</button></div></section>`;
}

export function skillsComparison(previous,current){
 const names=[...new Set([...previous.skills,...current.skills].map(s=>s.name))];
 const value=(b,name)=>Math.max(0,...b.skills.filter(s=>s.name===name).map(s=>s.level));
 return `<section class="panel skill-compare"><div class="panel-heading"><h2>Porównanie umiejętności</h2></div><div class="table-scroll"><table><thead><tr><th>Umiejętność</th><th class="num">Zapamiętany</th><th class="num">Bieżący</th><th class="num">Różnica poziomów</th></tr></thead><tbody>${names.length?names.map(name=>{const a=value(previous,name),b=value(current,name);return `<tr><td>${esc(name)}</td><td class="num">${skillRank(a)}</td><td class="num">${skillRank(b)}</td><td class="num ${b>a?'cyan':b<a?'red':'muted'}">${b>a?'+':''}${b-a}</td></tr>`;}).join(''):'<tr><td colspan="4" class="muted">W tych buildach nie przydzielono jeszcze umiejętności.</td></tr>'}</tbody></table></div></section>`;
}
