export const STATS={str:'Siła',dex:'Zręczność',power:'Moc',knowledge:'Wiedza',int:'Inteligencja',hp:'PŻ',mana:'Mana',stamina:'Kondycja'};
export const RESISTS={slash:'Sieczne',pierce:'Kłute',blunt:'Obuchowe',fire:'Ogień',cold:'Zimno',energy:'Energia',charm:'Uroki'};
export const LABELS={...STATS,...RESISTS,damage:'Obrażenia'};
export const SLOTS={head:'Hełm',neck:'Amulet',chest:'Zbroja',cloak:'Płaszcz',hands:'Rękawice',belt:'Pas',weapon:'Broń',offhand:'Tarcza / karwasze',legs:'Spodnie',feet:'Buty',ring1:'Pierścień I',ring2:'Pierścień II'};
export const PROFESSIONS=['Barbarzyńca','Druid','Łucznik','Mag Ognia','Rycerz','Sheed','Voodoo'];
export const SIZES=['Sub','Bi','Magni','Arcy'];
export const MAXLEVEL=[6,11,16,21];
export const ORNAMENTS=['B1','B2','B3','S1','S2','S3','G1','G2','G3'];
export const ORN_STATS=[0,.03,.06,.1,.15,.2,.25,.35,.5];
export const ORN_UP=[0,0,0,.1,.15,.25,.5,.8,1];
export const ORN_ORB=[0,0,0,.05,.1,.2,.3,.5,.75];
export const ORN_DRIF=[0,0,0,0,0,0,3,8,15];
export const ORN_CAP=[0,0,0,0,0,0,1,2,4];
const rawMods=[
['Amad','Redukcja zużycia kondycji',1,2,4,60],['Ann','Regeneracja many',.15,1,80/3,80],['Eras','Regeneracja kondycji',.15,1,80/3,80],['Err','Wyssanie many',.5,3,16,40],['Lun','Odporność na efekty krępujące i ukazanie',.5,1,4,60],['Verd','Szansa na odczarowanie',.5,2,4,60],['Von','Redukcja zużycia many',1,2,4,60],['Elen','Podwójne losowanie obrony',1,2,4,80],['Grod','Odporność na trafienie krytyczne',.5,2,8,60],['Grud','Obrona mentalna',1.5,1,2,null],['Tall','Obrona wręcz',1.5,1,2,null],['Tovi','Obrona dystansowa',1.5,1,2,null],['Alorn','Redukcja otrzymanych obrażeń',.5,4,32,40],['Faln','Redukcja obrażeń krytycznych',1,1,2,60],['Farid','Szansa na unik',.5,4,32,60],['Holm','Szansa na redukcję obrażeń',.5,3,16,60],['Iori','Redukcja obrażeń biernych',1,3,8,80],['Jorn','Redukcja obrażeń odbierających % PŻ',1,1,2,60],['Abaf','Modyfikator obrażeń magicznych',.5,3,16,null],['Astah','Modyfikator obrażeń fizycznych',.5,3,16,null],['Band','Szansa na trafienie krytyczne',.5,4,32,60],['Kalh','Dodatkowe obrażenia od zimna',.35,3,16,60],['Teld','Szansa na podwójny atak',.5,4,32,60],['Unn','Dodatkowe obrażenia od ognia',.35,3,16,60],['Val','Dodatkowe obrażenia od energii',.35,3,16,60],['Dur','Podwójne losowanie trafienia',.5,2,8,60],['Ling','Modyfikator trafień dystansowych',1,3,8,null],['Lorb','Przełamanie odporności na uroki',1,2,4,60],['Oda','Modyfikator trafień mentalnych',1,3,8,null],['Ulk','Modyfikator trafień wręcz',1,3,8,null],['root','Odporność na unieruchomienie',0,0,4,null],['pa','Dodatkowe PA',0,0,500,null],['circle','Dodatkowe kółko ataku',0,0,1000,null],['fate','Oszukać przeznaczenie',0,0,100,null]];
export const MODS=Object.fromEntries(rawMods.map(([code,label,step,cost,mult,cap])=>[code,{code,label,step,cost,mult,cap}]));
export const SYNERGY=['Ann','Eras','Astah','Abaf','Grod','root','Dur','Verd','Teld','Holm','Band','Farid','Ling','Oda','Ulk','Tovi','Grud','Tall','Elen','Iori','Amad','Von','Alorn'];
const rawOrbs=[
["M'ren",'Redukcja rozładowania sprzętu','Uniwersalny',10,0],["N'xen",'Szybszy odpoczynek','Uniwersalny',10,0],["Q'zen",'Dodatkowy daimonit','Uniwersalny',5,0],["P'ren",'Dodatkowe PXP','Uniwersalny',5,0],["R'xen",'Dodatkowe doświadczenie','Uniwersalny',5,0],["S'len",'Większy udźwig','Uniwersalny',50,0],["V'lan",'Dodatkowe złoto','Uniwersalny',5,0],
["Ba'ed",'Redukcja obrażeń wręcz','Defensywny',3,16],["De'ed",'Redukcja obrażeń dystansowych','Defensywny',3,16],["Ge'ed",'Redukcja obrażeń mentalnych','Defensywny',3,16],["Lu'ed",'Redukcja obrażeń czempionów i elit','Defensywny',3,4],["Mi'ed",'Redukcja obrażeń obszarowych','Defensywny',3,4],["Na'ed",'Większa obrona po trafieniu','Defensywny',5,8],["Re'ed",'Unik przy ciężkich ranach','Defensywny',10,8],["Vo'ed",'Redukcja obrażeń zwykłych przeciwników','Defensywny',3,4],["Ze'ed",'Redukcja obrażeń bossów','Defensywny',3,16],
["Cu'at",'Większa celność po chybieniu','Ofensywny',3,8],["Fu'at",'Przejęcie zdrowia','Ofensywny',10,8],["Ha'at",'Siła ataku przy ciężkich ranach','Ofensywny',10,4],["Ka'at",'Obrażenia na zwykłych przeciwników','Ofensywny',5,16],["Li'at",'Mocniejszy atak krytyczny','Ofensywny',5,16],["Pa'at",'Obrażenia na czempiony i elity','Ofensywny',5,8],["Po'at",'Przejęcie many','Ofensywny',10,4],["Se'at",'Przejęcie kondycji','Ofensywny',10,4],["Te'at",'Przełamanie Farida i Holma','Ofensywny',10,4],["Ti'at",'Obrażenia na bossów','Ofensywny',5,8]];
export const ORBS=Object.fromEntries(rawOrbs.map(([code,label,type,base,mult])=>[code,{code,label,type,base,mult}]));
export const ceil=(x,places=2)=>Math.ceil((x-1e-9)*10**places)/10**places;
export const resource=k=>['hp','mana','stamina'].includes(k)?10:1;
export const blankPoints=()=>Object.fromEntries(Object.keys(STATS).map(k=>[k,0]));
export const MAX_BACKPACK_DRIFS=1000;
export const MAX_BACKPACK_ORBS=1000;
export function normalizeOrb(o){
 const number=v=>Number.isFinite(v)&&v>=0&&v<=100000;
 if(!o||(!Object.hasOwn(ORBS,o.code)&&!(o.code===null&&Number.isInteger(o.sourceCode)&&o.sourceCode>=0&&o.sourceCode<=10000&&number(o.exportEffect)))||!Number.isInteger(o.size)||o.size<0||o.size>3||!Number.isInteger(o.level)||o.level<1||o.level>(o.size===0?1:3)||(o.exportEffect!==undefined&&!number(o.exportEffect)))throw Error('Nieprawidłowy orb.');
 return {code:o.code,size:o.size,level:o.level,...(o.sourceCode!==undefined?{sourceCode:o.sourceCode}:{}),...(o.exportEffect!==undefined?{exportEffect:o.exportEffect}:{})};
}
export function normalizeDrif(d){
 if(!d||!Object.hasOwn(MODS,d.code)||!MODS[d.code].cost||!Number.isInteger(d.size)||d.size<0||d.size>3||!Number.isInteger(d.level)||d.level<1||d.level>MAXLEVEL[d.size])throw Error('Nieprawidłowy drif.');
 return {code:d.code,size:d.size,level:d.level};
}
export const emptyBuild=()=>({version:1,name:'Nowy build',level:1,profession:'Rycerz',points:blankPoints(),equipment:{},skills:[],backpack:[],backpackOrbs:[]});
export function instance(item){return {itemId:item.id,ornament:0,charged:true,upgrades:[],reforge:[],drifs:structuredClone(item.fixedDrifs||[]),orbs:[],synergy:'Band',...(item.kind==='Synergetyk'?{synergyLevel:item.level}:{})};}
export function resolveItem(inst,catalog){
 if(!inst)return null;
 const base=inst.custom||catalog.items.find(i=>i.id===inst.itemId);
 if(!base?.levels)return base;
 const data=base.levels[inst.synergyLevel||base.level];
 return data?{...base,...data,id:base.id,family:base.family,levels:base.levels}:base;
}
export function baseStats(build){return Object.fromEntries(Object.keys(STATS).map(k=>[k,(resource(k)===10?200:10)+(build.points[k]||0)*resource(k)]));}
export function synergyValue(code,level){const step=['Ann','Eras'].includes(code)?.15:['Grud','Tall','Tovi','Ling','Oda','Ulk','Elen','Iori','Amad','Von'].includes(code)?1:.5;return ceil(Math.max(0,(level-20)/10)*step);}
export function maxSize(rank){return rank>=10?3:rank>=7?2:rank>=4?1:0;}
export function drifValue(d,kind){const level=kind==='Set'?MAXLEVEL[d.size]:d.level;const m=MODS[d.code];if(!m?.cost)return 0;return ceil(m.step*(level+[0,1,3,5][d.size]+Math.max(0,level-18)));}
export function drifCost(d,kind){const l=kind==='Set'?MAXLEVEL[d.size]:d.level;return (MODS[d.code]?.cost||0)*(l<=6?1:l<=11?2:l<=16?3:4);}
export function penalty(n){return n<=3?1:({4:.95,5:.87,6:.8,7:.74,8:.69,9:.64,10:.59,11:.54,12:.5}[n]??null);}
export function upgradeEfficiency(rank,index){const n=index+1;if(rank<=3)return n>=9?2:1;if(rank<=6)return n>=8?2:1;if(rank<=9)return n>=10?3:n>=7?2:1;return n>=10?4:n>=8?3:n>=6?2:1;}
export function canOrnament(item){return ['Rar','Set','Epik','Legenda'].includes(item.kind);}
export function allowedOrbs(item){if(['ring','neck'].includes(item.slot))return ['Uniwersalny'];if(item.slot==='offhand')return ['Ofensywny','Defensywny'];if(['head','feet','legs','chest'].includes(item.slot))return ['Defensywny'];return ['Ofensywny'];}
export function effectiveItem(inst,item,level){
 const o=canOrnament(item)?inst.ornament:0,raw={...item.stats};if(item.damagePerLevel)raw.damage=(raw.damage||0)+item.damagePerLevel*level;
 const bonus={},upgrades={},issues=[];
 const native=Object.keys(STATS).filter(k=>raw[k]>0),resistKeys=Object.keys(RESISTS).filter(k=>raw[k]>0);
 const reforgePool=native.reduce((a,k)=>a+raw[k]/resource(k),0)*ORN_STATS[o];
 const resistPool=resistKeys.reduce((a,k)=>a+raw[k],0)*ORN_STATS[o];
 // Expected allocation of the whole pool. The game's individual random roll
 // is preserved as a snapshot on import, never reconstructed from the mean.
 for(const k of native)bonus[k]=reforgePool/native.length*resource(k);
 for(const k of resistKeys)bonus[k]=resistPool/resistKeys.length;
 if(raw.damage)bonus.damage=raw.damage*ORN_STATS[o]*(item.kind==='Epik'?1:.5);
 const naturalBonus={...bonus};
 for(const move of inst.reforge||[]){const {from,to,points}=move;if(!STATS[from]||!STATS[to]||from===to||!(raw[from]>0)||!(raw[to]>0)||!Number.isFinite(points)||points<0||reforgePool<5){issues.push('Nieprawidłowe przekucie: użyj dwóch bazowych statystyk i puli co najmniej 5 punktów.');continue;}if((bonus[from]||0)+1e-8<points*resource(from)){issues.push('Przekucie przekracza dostępny bonus inkrustacji.');continue;}bonus[from]=bonus[from]-points*resource(from);bonus[to]=(bonus[to]||0)+points*resource(to);}
 for(let j=0;j<(inst.upgrades||[]).length;j++){const k=inst.upgrades[j];if(!STATS[k]&&!(k==='damage'&&item.slot==='weapon')){issues.push('Niedozwolona statystyka ulepszenia.');continue;}const amount=k==='damage'?3:upgradeEfficiency(item.rank,j+(inst.snapshot?.upgradeLevel||0))*resource(k);upgrades[k]=(upgrades[k]||0)+amount*(1+ORN_UP[o]);}
 for(const k in upgrades)upgrades[k]=ceil(upgrades[k],0);
 const stats={};for(const k of new Set([...Object.keys(raw),...Object.keys(bonus),...Object.keys(upgrades),...Object.keys(inst.snapshot?.stats||{})]))stats[k]=inst.snapshot?ceil((inst.snapshot.stats[k]??raw[k]??0)+(upgrades[k]||0),0):ceil((raw[k]||0)+(bonus[k]||0),0)+(upgrades[k]||0);
 const sockets=item.sockets+(item.kind==='Rar'&&[2,3].includes(item.rank)&&o>=6?1:0);
 const capacity=item.capacity+(item.kind==='Rar'?ORN_CAP[o]:0);
 const cost=(inst.drifs||[]).reduce((a,d)=>a+drifCost(d,item.kind),0);
 return {stats,raw,bonus,naturalBonus,upgrades,reforgePool,resistPool,sockets,capacity,cost,boost:(item.boost||0)+ORN_DRIF[o],issues,ornament:o};
}
export function requirements(item,build){const base=baseStats(build),issues=[];if(build.level<item.level)issues.push(`Poziom ${item.level}`);if(item.profession&&item.profession.toLocaleLowerCase('pl')!==build.profession.toLocaleLowerCase('pl'))issues.push(`Profesja: ${item.profession}`);for(const [k,v] of Object.entries(item.requirements||{}))if((base[k]||0)<v)issues.push(`${STATS[k]||k}: ${v} bazowo`);return issues;}
export function orbResult(orb,inst,item){const def=ORBS[orb.code],o=canOrnament(item)?inst.ornament:0;const idx=orb.size===0?0:1+(orb.size-1)*3+orb.level-1;const factors=[1,1.3,1.36,1.45,1.7,1.84,2.05,2.5,2.8,3.25];const values=[50,65,68,72,85,92,102,125,140,162];const base=def?(orb.code==="S'len"?values[idx]:ceil(def.base*factors[idx])):null;const effect=orb.exportEffect??(def?ceil(base+def.base*ORN_ORB[o]):null);const coeff=[1,4,4.8,6,9.3,11.2,14,20,24,30][idx];const quality=[0,0,0,.67,1.33,2.67,4,6.67,10][o];return {effect,base,power:def?(coeff+quality)*def.mult:null,coeff,quality,unresolved:!def};}
export function calculate(build,catalog){
 const stats={...baseStats(build)},psycho={},orbs=[],items=[],issues=[],setRows=[],missing=[];
 const addMod=(code,drif,syn,set,n=0)=>{if(!MODS[code]){issues.push(`Nieznany modyfikator ${code}.`);return;}const row=psycho[code]??={code,drif:0,synergy:0,set:0,n:0};row.drif+=drif;row.synergy+=syn;row.set+=set;row.n+=n;};
 const spent=Object.values(build.points).reduce((a,v)=>a+v,0),budget=4*build.level+1;
 if(spent>budget)issues.push(`Przekroczony budżet punktów o ${spent-budget}.`);
 const equipped=[];
 for(const [slot,inst] of Object.entries(build.equipment)){
  const item=resolveItem(inst,catalog);if(!item){issues.push(`Brak przedmiotu w slocie ${SLOTS[slot]}.`);continue;}
  if(inst.snapshot?.missing?.length){const note=`${item.name}: potwierdź ${inst.snapshot.missing.map(k=>LABELS[k]).join(', ')} — brak w eksporcie.`;missing.push(note);issues.push(note);}
  const e=effectiveItem(inst,item,build.level),local=[];
  if((slot.startsWith('ring')?'ring':slot)!==item.slot)local.push('Niewłaściwy slot przedmiotu.');
  const unmet=requirements(item,build);if(unmet.length)local.push(`Wymagania: ${unmet.join(', ')}.`);
  if(item.uncertain||item.historical)local.push(...item.notes);
  if(inst.drifs.length>e.sockets)local.push(`Za dużo drifów: ${inst.drifs.length}/${e.sockets}.`);
  if(item.kind!=='Set'&&item.kind!=='Epik'&&e.cost>e.capacity)local.push(`Przekroczona pojemność: ${e.cost}/${e.capacity}.`);
  if(inst.orbs.length>item.orbSockets)local.push('Przekroczona liczba orbów.');
  let elements=0;const seen=new Set();
  for(const d of inst.drifs){if(seen.has(d.code))local.push(`Powtórzony drif ${d.code} w przedmiocie.`);seen.add(d.code);if(d.size>maxSize(item.rank))local.push(`${SIZES[d.size]} ${d.code} nie pasuje do rangi.`);if(d.level<1||d.level>MAXLEVEL[d.size])local.push('Niedozwolony poziom drifu.');if(['Kalh','Unn','Val'].includes(d.code))elements++;if(['Kalh','Unn','Val','Err'].includes(d.code)&&item.slot!=='weapon')local.push(`${d.code} można osadzić tylko w broni.`);if(inst.charged)addMod(d.code,ceil(drifValue(d,item.kind)*(1+e.boost/100)),0,0,1);}
  if(elements>1)local.push('Broń może mieć tylko jeden drif żywiołowy.');
  if(inst.charged){for(const [code,value] of Object.entries(item.mods||{}))addMod(code,0,0,value);if(item.kind==='Synergetyk'){const c=inst.synergy;addMod(c,0,synergyValue(c,item.level),0);}}
  inst.orbs.forEach((orb,index)=>{const r=orbResult(orb,inst,item);if(!ORBS[orb.code]){const note=`${item.name}: wybierz nazwę orba o kodzie ${orb.sourceCode}.`;missing.push(note);local.push(`Wybierz nazwę orba o kodzie ${orb.sourceCode}.`);}else{if(orb.size>maxSize(item.rank))local.push(`Orb ${SIZES[orb.size]} nie pasuje do rangi.`);if(!allowedOrbs(item).includes(ORBS[orb.code].type))local.push(`Niewłaściwy rodzaj orba ${orb.code}.`);}orbs.push({...r,...orb,item:item.name,slot,index,charged:inst.charged,active:false});});
  for(const [k,v] of Object.entries(e.stats))stats[k]=(stats[k]||0)+v;
  local.push(...e.issues);issues.push(...local.map(s=>`${item.name}: ${s}`));items.push({slot,inst,item,...e,issues:local});equipped.push({item,inst});
 }
 // A shield requires a one-handed weapon. Bracers may accompany any weapon.
 const weapon=items.find(i=>i.item.slot==='weapon'),offhand=items.find(i=>i.item.slot==='offhand');
 if(weapon&&offhand&&offhand.item.category==='Tarcze'&&weapon.item.category!=='Miecze jednoręczne')issues.push('Tarcza wymaga broni jednoręcznej.');
 for(const set of Object.values(catalog.sets||{})){
  const members=equipped.filter(x=>x.item.set===set.name);if(!members.length)continue;
  const n=members.length,charged=members.filter(x=>x.inst.charged).length,table={3:[0,0,.4,1],4:[0,0,.25,.5,1],5:[0,0,.2,.4,.6,1]}[set.size];
  if(!table){issues.push(`${set.name}: nieustalony rozmiar setu.`);continue;}
  let factor=table[Math.min(charged,set.size)];if(set.level===100&&n===set.size&&charged<set.size)factor=Math.max(.6,factor);
  setRows.push({name:set.name,n,size:set.size,charged,factor});
  for(const [k,v] of Object.entries(set.stats))stats[k]=(stats[k]||0)+ceil(v*factor,0);
  for(const [k,v] of Object.entries(set.mods)){if(['pa','fate'].includes(k)&&!(n===set.size&&charged===set.size))continue;addMod(k,0,0,ceil(v*factor));}
 }
 for(const orb of orbs){if(!orb.charged||orb.unresolved)continue;const other=orbs.find(o=>o.code===orb.code&&o.active);if(!other)orb.active=true;else if(orb.effect>other.effect){other.active=false;orb.active=true;}}
 let psychoPower=0;
 for(const p of Object.values(psycho)){p.penalty=penalty(p.n);if(p.penalty===null){issues.push(`${p.code}: kara dla ${p.n} drifów nie jest opisana w źródle.`);p.penalty=0;p.unresolved=true;}p.beforeCap=ceil(p.drif*p.penalty+p.synergy+p.set);p.cap=MODS[p.code].cap;p.value=Math.min(p.cap??Infinity,p.beforeCap);p.wasted=ceil(p.beforeCap-p.value);p.power=p.value*MODS[p.code].mult;psychoPower+=p.power;}
 const statPower=['str','dex','power','knowledge','int'].reduce((a,k)=>a+(stats[k]||0),0)+2*(stats.damage||0)+['hp','mana','stamina'].reduce((a,k)=>a+(stats[k]||0)/10,0);
 const resistPower=['slash','pierce','blunt'].reduce((a,k)=>a+(stats[k]||0)*.4,0)+['fire','cold','energy'].reduce((a,k)=>a+(stats[k]||0)*.3,0)+(stats.charm||0)*.6;
 const levelPower=build.level*(build.level+1)/8,orbPower=orbs.filter(o=>o.active).reduce((a,o)=>a+o.power,0);
 const parts={stats:statPower,resists:resistPower,level:levelPower,psycho:psychoPower,orbs:orbPower};const total=ceil(Object.values(parts).reduce((a,v)=>a+v,0),0);
 return {stats,base:baseStats(build),parts,total,psycho,orbs,items,sets:setRows,issues:[...new Set(issues)],missing,complete:missing.length===0,spent,budget,remaining:budget-spent,valid:issues.length===0};
}
export function validateBuild(input,catalog){
 const numeric=(v,lo=0,hi=100000)=>Number.isFinite(v)&&v>=lo&&v<=hi;
 const integer=(v,lo,hi)=>Number.isInteger(v)&&numeric(v,lo,hi);
 const statsMap=(data,allowed=LABELS)=>{if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Nieprawidłowe statystyki.');const out={};for(const [k,v] of Object.entries(data)){if(!Object.hasOwn(allowed,k)||!numeric(v,-100000))throw Error('Nieprawidłowa statystyka.');out[k]=v;}return out;};
 if(!input||input.version!==1||!integer(input.level,1,1000)||!PROFESSIONS.includes(input.profession)||!input.points||!input.equipment)throw Error('Nieprawidłowy format buildu.');
 const out=emptyBuild();out.name=String(input.name||'Importowany build').slice(0,100);out.level=input.level;out.profession=input.profession;
 if(input.backpack!==undefined){if(!Array.isArray(input.backpack)||input.backpack.length>MAX_BACKPACK_DRIFS)throw Error('Nieprawidłowy plecak.');out.backpack=input.backpack.map(normalizeDrif);}
 if(input.backpackOrbs!==undefined){if(!Array.isArray(input.backpackOrbs)||input.backpackOrbs.length>MAX_BACKPACK_ORBS)throw Error('Nieprawidłowy plecak orbów.');out.backpackOrbs=input.backpackOrbs.map(normalizeOrb);}
 for(const k in STATS){const v=input.points[k]??0;if(!integer(v,0,100000))throw Error('Nieprawidłowe punkty postaci.');out.points[k]=v;}
 if(input.skills!==undefined){if(!Array.isArray(input.skills)||input.skills.length>200)throw Error('Nieprawidłowa lista umiejętności.');out.skills=input.skills.map(s=>{if(typeof s.name!=='string'||!s.name.trim()||!integer(s.level,0,21))throw Error('Nieprawidłowa umiejętność.');return {name:s.name.slice(0,100),level:s.level};});}
 if(input.importInfo){const v=input.importInfo;out.importInfo={source:'overlay',...(numeric(v.referencePower)?{referencePower:v.referencePower}:{}),notes:Array.isArray(v.notes)?v.notes.slice(0,50).map(s=>String(s).slice(0,300)):[]};}
 for(const [slot,original] of Object.entries(input.equipment)){
  if(!SLOTS[slot]||!original)throw Error('Nieznany slot.');
  const alias=catalog.aliases?.[original.itemId],x={...original,...(alias||{})};
  const known=catalog.items.find(i=>i.id===x.itemId);let custom;
  if(!known&&!x.custom)throw Error('Przedmiot jest nieznany lub został usunięty z katalogu.');
  if(x.custom){
   const c=x.custom;
   if(!Object.keys(SLOTS).some(s=>(s.startsWith('ring')?'ring':s)===c.slot)||!['Rar','Set','Epik','Legenda','Synergetyk','Questowy','Zwykły'].includes(c.kind)||!integer(c.rank,1,12)||!integer(c.level,1,1000)||!integer(c.sockets,0,3)||!integer(c.orbSockets,0,2)||!numeric(c.capacity,0,1000)||!numeric(c.boost,0,1000))throw Error('Nieprawidłowy własny przedmiot.');
   custom={...(known||{}),id:'custom',name:String(c.name).slice(0,100),kind:known?.kind||c.kind,slot:known?.slot||c.slot,category:String(c.category||'Własny').slice(0,80),rank:c.rank,level:c.level,sockets:c.sockets,orbSockets:c.orbSockets,capacity:c.capacity,boost:c.boost,stats:statsMap(c.stats),requirements:statsMap(c.requirements,STATS),mods:{...(known?.mods||{})},source:known?.source||'',notes:['Własne dane użytkownika.'],uncertain:false};
  }
  if(!integer(x.ornament,0,8)||typeof x.charged!=='boolean'||!Array.isArray(x.upgrades)||x.upgrades.length>100||!Array.isArray(x.drifs)||x.drifs.length>3||!Array.isArray(x.orbs)||x.orbs.length>2||!Array.isArray(x.reforge)||x.reforge.length>100)throw Error('Nieprawidłowe modyfikacje przedmiotu.');
  if(x.upgrades.some(k=>!STATS[k]&&k!=='damage'))throw Error('Nieprawidłowe ulepszenie.');
  for(const d of x.drifs)if(!MODS[d.code]?.cost||!integer(d.size,0,3)||!integer(d.level,1,MAXLEVEL[d.size]))throw Error('Nieprawidłowy drif.');
  for(const o of x.orbs)if((!ORBS[o.code]&&!(o.code===null&&integer(o.sourceCode,0,10000)&&numeric(o.exportEffect)))||!integer(o.size,0,3)||!integer(o.level,1,o.size===0?1:3)||(o.exportEffect!==undefined&&!numeric(o.exportEffect)))throw Error('Nieprawidłowy orb.');
  for(const m of x.reforge)if(!STATS[m.from]||!STATS[m.to]||!numeric(m.points))throw Error('Nieprawidłowe przekucie.');
  const item=custom||known;
  if(item.fixedDrifs&&(x.drifs.length!==item.fixedDrifs.length||x.drifs.some((d,i)=>d.code!==item.fixedDrifs[i].code||d.size!==item.fixedDrifs[i].size)))throw Error('Nie można zmienić wbudowanych drifów epika.');
  if(item.kind==='Synergetyk'&&(!SYNERGY.includes(x.synergy)||(item.levels&&!item.levels[x.synergyLevel||item.level])))throw Error('Nieprawidłowy poziom lub bonus synergetyka.');
  const ins={itemId:x.itemId,ornament:canOrnament(item)?x.ornament:0,charged:x.charged,upgrades:[...x.upgrades],reforge:x.reforge.map(m=>({from:m.from,to:m.to,points:m.points})),drifs:x.drifs.map(d=>({code:d.code,size:d.size,level:d.level})),orbs:x.orbs.map(o=>({code:o.code,size:o.size,level:o.level,...(o.sourceCode!==undefined?{sourceCode:o.sourceCode}:{}),...(o.exportEffect!==undefined?{exportEffect:o.exportEffect}:{})})),synergy:x.synergy||'Band',...(item.kind==='Synergetyk'?{synergyLevel:x.synergyLevel||item.level}:{}),...(custom?{custom}:{})};
  if(x.snapshot){const snap=x.snapshot;if(!integer(snap.upgradeLevel,0,100)||!Array.isArray(snap.missing)||snap.missing.some(k=>!LABELS[k]))throw Error('Nieprawidłowy zapis statystyk z eksportu.');ins.snapshot={stats:statsMap(snap.stats),upgrades:statsMap(snap.upgrades),upgradeLevel:snap.upgradeLevel,missing:[...new Set(snap.missing)]};}
  out.equipment[slot]=ins;
 }
 return out;
}
