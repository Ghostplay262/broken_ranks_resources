import {STATS,LABELS,SLOTS,ORNAMENTS,MODS,PROFESSIONS,emptyBuild,instance,resource,resolveItem,effectiveItem,validateBuild} from './engine.js';

const slots={1:'head',2:'legs',3:'feet',4:'weapon',5:'offhand',6:'chest',7:'cloak',8:'hands',9:'ring1',10:'ring2',11:'neck',12:'belt'};
const fields={Strength:'str',Dexterity:'dex',Power:'power',Knowledge:'knowledge',Intelligence:'int',Life:'hp',Health:'hp',Mana:'mana',Stamina:'stamina',Damage:'damage',ResistSlash:'slash',ResistBlunt:'blunt',ResistPierce:'pierce',ResistFire:'fire',ResistEnergy:'energy',ResistCold:'cold',ResistCharm:'charm'};
const bases={BaseStrength:'str',BaseDexterity:'dex',BasePower:'power',BaseKnowledge:'knowledge',BaseIntelligence:'int',BaseHealth:'hp',BaseMana:'mana',BaseStamina:'stamina'};
const cleanName=s=>String(s??'').trim().replace(/^["„”]+|["„”]+$/g,'').trim();
const key=s=>cleanName(s).toLocaleLowerCase('pl');
const number=(v,label,min=0,max=100000)=>{if(!Number.isFinite(v)||v<min||v>max)throw Error(`Nieprawidłowa wartość: ${label}.`);return v;};

export function parseBuild(text,catalog,skillsData={skills:[]}){
 if(typeof text!=='string'||text.length>1000000)throw Error('Maksymalny rozmiar eksportu to 1 MB.');
 let input;try{input=JSON.parse(text.replace(/^\uFEFF/,'').trim());}catch{throw Error('Wklej cały eksport JSON, od { do }.');}
 if(input?.version===1)return {build:validateBuild(input,catalog),format:'Kuźnia',notes:[],ignored:0};
 if(!input?.stats||!input.equipped||!Array.isArray(input.equipmentList)||!Array.isArray(input.skills))throw Error('Nie rozpoznano eksportu nakładki ani formatu Kuźni.');
 if(input.equipmentList.length>10000||input.skills.length>200)throw Error('Eksport zawiera zbyt wiele rekordów.');
 const b=emptyBuild(),notes=[];b.name=cleanName(input.stats.Name)||'Importowany build';
 b.level=number(input.stats.Level,'poziom',1,1000);
 for(const [source,target] of Object.entries(bases)){
  const v=number(input.stats[source],source),base=resource(target)===10?200:10;
  const points=(v-base)/resource(target);if(!Number.isInteger(points)||points<0)throw Error(`Nie można odtworzyć punktów: ${STATS[target]}.`);
  b.points[target]=points;
 }
 b.skills=input.skills.map(s=>({name:cleanName(s.Name),level:number(s.Level,'poziom umiejętności',0,21)}));
 const scores=PROFESSIONS.map(prof=>[prof,b.skills.filter(s=>skillsData.skills.some(d=>d.profession===prof&&key(d.name)===key(s.name))).length]).sort((a,z)=>z[1]-a[1]);
 b.profession=scores[0]?.[1]>0?scores[0][0]:'Rycerz';
 notes.push('Eksport nie zawiera profesji ani stanu naładowania. Sprawdź je przed wczytaniem.');
 const rows=new Map(input.equipmentList.map(x=>[String(x.EqId),x]));let used=0;
 for(const [sourceSlot,id] of Object.entries(input.equipped)){
  if(id===0||id===null)continue;
  const slot=slots[sourceSlot];if(!slot)throw Error(`Nieznany numer slotu: ${sourceSlot}.`);
  const row=rows.get(String(id));if(!row)throw Error(`Brak danych przedmiotu w slocie ${SLOTS[slot]}.`);
  if(/skin|historic/i.test(String(row.Type)))continue;
  const wanted=slot.startsWith('ring')?'ring':slot,name=cleanName(row.Name);
  const matches=catalog.items.flatMap(i=>i.slot!==wanted?[]:i.levels?Object.entries(i.levels).filter(([,v])=>key(v.name)===key(name)).map(([level])=>({item:i,level:Number(level)})):key(i.name)===key(name)?[{item:i}]:[]);
  const typeMap={rar:'Rar',epic:'Epik',legend:'Legenda',set:'Set',synergy:'Synergetyk'};
  const typed=matches.filter(m=>m.item.kind===typeMap[row.Type]);
  const match=typed.length===1?typed[0]:matches.length===1?matches[0]:null;
  if(!match)throw Error(matches.length?`Niejednoznaczny przedmiot: ${name} (${row.Type}).`:`Przedmiotu „${name}” nie ma w aktualnym katalogu. Nie wczytano częściowego buildu.`);
  const ins=instance(match.item);if(match.level)ins.synergyLevel=match.level;
  const ornament=ORNAMENTS.indexOf(row.Ornaments);if(ornament<0&&match.item.kind!=='Synergetyk')throw Error(`Nieznany ornament: ${row.Ornaments} (${name}).`);
  ins.ornament=Math.max(0,ornament);
  const item=resolveItem(ins,catalog),estimate=effectiveItem(ins,item,b.level),snapshot={stats:{...estimate.stats},upgrades:{},upgradeLevel:number(row.UpgradeLevel??0,'ulepszenie',0,100),missing:[]},provided=new Set();
  for(const [source,target] of Object.entries(fields))if(row[source]!==undefined){snapshot.stats[target]=number(row[source],`${name}: ${source}`,-100000);provided.add(target);}
  for(const [source,v] of Object.entries(row.Upgrades||{})){
   const target=fields[source];if(!target)throw Error(`Nieznana statystyka ulepszenia: ${source}.`);snapshot.upgrades[target]=number(v,'ulepszenie');
  }
  for(const k of Object.keys(LABELS))if(!provided.has(k)&&((item.stats[k]||0)!==0||(snapshot.upgrades[k]||0)!==0||k==='damage'&&slot==='weapon'))snapshot.missing.push(k);
  // Durability is intentionally not mapped to stamina. No reconstruction of
  // the random inlay roll or the order of previous upgrade steps is possible.
  ins.snapshot=snapshot;
  ins.drifs=(row.Drifs||[]).map(d=>{
   const code=Object.keys(MODS).find(c=>MODS[c].cost&&key(d.Name).split(/\s+/).at(-1)===key(c));
   const size={small:0,medium:1,big:2,giant:3}[d.Size];
   if(!code||size===undefined)throw Error(`Nieznany drif: ${d.Name} / ${d.Size}.`);
   return {code,size,level:number(d.Level,'poziom drifu',1,21)};
  });
  ins.orbs=(row.Orbs||[]).map(o=>{
   const level=number(o.Level,'poziom orba',1,10);
   return {code:null,sourceCode:number(o.PsychoCode,'kod orba',0,10000),size:level===1?0:Math.floor((level-2)/3)+1,level:level===1?1:(level-2)%3+1,exportEffect:Math.abs(number(o.Value,'efekt orba',-100000))};
  });
  b.equipment[slot]=ins;used++;
 }
 const ignored=input.equipmentList.length-used;
 if(ignored)notes.push(`Pominięto niezałożone przedmioty i skiny: ${ignored}.`);
 notes.push('Rzeczywiste statystyki zachowano. Brakujące wartości pochodzą tymczasowo z katalogu i wymagają potwierdzenia.');
 if(Object.values(b.equipment).some(i=>i.orbs.length))notes.push('Nazwy orbów wymagają przypisania do numerycznych kodów. Efekty procentowe z eksportu są zachowane.');
 b.importInfo={source:'overlay',...(Number.isFinite(input.stats.Might)?{referencePower:input.stats.Might}:{}),notes};
 return {build:validateBuild(b,catalog),format:'Eksport nakładki',notes,ignored};
}
