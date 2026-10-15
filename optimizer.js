import {MODS,ORBS,SLOTS,ceil,calculate,resolveItem,effectiveItem,maxSize,drifValue,drifCost,penalty,allowedOrbs,orbResult,MAX_BACKPACK_DRIFS,MAX_BACKPACK_ORBS} from './engine.js';

const clone=structuredClone;
const now=()=>globalThis.performance?.now?.()??Date.now();
const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
const elements=new Set(['Kalh','Unn','Val']);
const weaponOnly=new Set(['Kalh','Unn','Val','Err']);
const modCodes=Object.keys(MODS),modIndex=Object.fromEntries(modCodes.map((c,i)=>[c,i]));
const orbCodes=Object.keys(ORBS),orbIndex=Object.fromEntries(orbCodes.map((c,i)=>[c,i]));
export const optimizerDefaults=()=>({mode:'power',targets:[],includeOrbs:true,lockedSlots:[],seconds:8});
export function targetValue(result,target){return target.kind==='orb'?(result.orbs.find(o=>o.code===target.code&&o.active)?.effect||0):(result.psycho[target.code]?.value||0);}
export function targetLimit(target){return target.goal==='cap'?MODS[target.code]?.cap:target.goal==='value'?Number(target.value):Infinity;}
export function compareScores(a,b){if(!b)return 1;for(let i=0;i<a.length;i++){const delta=a[i]-b[i];if(Math.abs(delta)>1e-7)return delta>0?1:-1;}return 0;}
export function inventorySignature(build){
 const record=g=>JSON.stringify([g.code,g.size,g.level,g.sourceCode??null,...(!g.code?[g.exportEffect]:[])]);
 return {drifs:[...(build.backpack||[]),...Object.values(build.equipment).flatMap(i=>i.drifs)].map(record).sort(),orbs:[...(build.backpackOrbs||[]),...Object.values(build.equipment).flatMap(i=>i.orbs)].map(record).sort()};
}

function domainContext(build,catalog,options,kind,base){
 const isDrif=kind==='drif',prop=isDrif?'drifs':'orbs',bag=isDrif?'backpack':'backpackOrbs';
 const items=Object.entries(build.equipment).map(([slot,inst])=>{
  const item=resolveItem(inst,catalog);if(!item)throw Error(`Brak danych przedmiotu: ${SLOTS[slot]}.`);
  const e=effectiveItem(inst,item,build.level);
  return {slot,inst,item,e,frozen:options.lockedSlots.includes(slot)||(isDrif?!!item.fixedDrifs:!options.includeOrbs),limit:isDrif?e.sockets:item.orbSockets};
 });
 const units=[],current=items.map(()=>[]),fixed=items.map(()=>[]);
 function add(g,origin){
  const id=units.length,locked=origin>=0&&(items[origin].frozen||(!isDrif&&!ORBS[g.code])),code=(isDrif?modIndex:orbIndex)[g.code];
  const unit={id,g:clone(g),origin,locked,code,choices:[],values:[],costs:[],powers:[]};units.push(unit);
  if(origin>=0){current[origin].push(id);if(locked)fixed[origin].push(id);}
  for(let j=0;j<items.length;j++){
   const {item,inst,e,frozen,limit}=items[j];
   const fits=limit>0&&!frozen&&g.size<=maxSize(item.rank)&&(isDrif?(!weaponOnly.has(g.code)||item.slot==='weapon'):(!!ORBS[g.code]&&allowedOrbs(item).includes(ORBS[g.code].type)));
   if(fits&&!locked)unit.choices.push(j);
   if(isDrif){unit.values[j]=inst.charged?ceil(drifValue(g,item.kind)*(1+e.boost/100)):0;unit.costs[j]=drifCost(g,item.kind);}
   else{const copy={...g};if(j!==origin&&ORBS[g.code])delete copy.exportEffect;const r=orbResult(copy,inst,item);unit.values[j]=inst.charged?r.effect:0;unit.powers[j]=inst.charged&&!r.unresolved?r.power:0;}
  }
  // Try the existing destination first; exact ties should keep the build stable.
  unit.choices.sort((a,b)=>(b===origin)-(a===origin));
 }
 items.forEach(({inst},i)=>inst[prop].forEach(g=>add(g,i)));(build[bag]||[]).forEach(g=>add(g,-1));
 const movable=units.filter(u=>!u.locked),targets=(options.mode==='modifiers'?options.targets:[]).filter(t=>t.kind===kind);
 const fixedValues=modCodes.map(c=>(base.psycho[c]?.set||0)+(base.psycho[c]?.synergy||0));
 function legal(list,index){
  const {limit,item,e}=items[index];if(list.length>limit)return false;
  let cost=0,elementCount=0;const seen=new Set();
  for(const id of list){const u=units[id],g=u.g;
   if(u.locked&&u.origin===index){}else if(!u.choices.includes(index))return false;
   if(isDrif){if(g.size>maxSize(item.rank)||seen.has(g.code)||(weaponOnly.has(g.code)&&item.slot!=='weapon'))return false;seen.add(g.code);if(elements.has(g.code))elementCount++;cost+=u.costs[index];}
   else if(ORBS[g.code]&&(g.size>maxSize(item.rank)||!allowedOrbs(item).includes(ORBS[g.code].type)))return false;
  }
  return !isDrif||(elementCount<=1&&(['Set','Epik'].includes(item.kind)||cost<=e.capacity+1e-8));
 }
 for(let i=0;i<fixed.length;i++)if(!legal(fixed[i],i))throw Error(`Zablokowane kamienie w „${items[i].item.name}” przekraczają ograniczenia. Popraw konfigurację lub odblokuj przedmiot.`);
 const bagLimit=isDrif?MAX_BACKPACK_DRIFS:MAX_BACKPACK_ORBS,originallyEquipped=units.filter(u=>u.origin>=0).length;
 function score(state){
  const values=isDrif?[...fixedValues]:Array(orbCodes.length).fill(0),sums=isDrif?Array(modCodes.length).fill(0):null,counts=isDrif?Array(modCodes.length).fill(0):null,powers=isDrif?null:Array(orbCodes.length).fill(0),active=isDrif?null:Array(orbCodes.length).fill(false);
  let used=0,capacity=0,moves=0,originalPlaced=0;
  for(let j=0;j<state.length;j++)for(const id of state[j]){
   const u=units[id];used++;if(u.origin>=0)originalPlaced++;if(u.origin!==j)moves++;if(isDrif){if(!['Set','Epik'].includes(items[j].item.kind))capacity+=u.costs[j];if(items[j].inst.charged){sums[u.code]+=u.values[j];counts[u.code]++;}}
   else if(u.code!==undefined&&items[j].inst.charged&&(!active[u.code]||u.values[j]>values[u.code])){active[u.code]=true;values[u.code]=u.values[j];powers[u.code]=u.powers[j];}
  }
  // Removing a previously equipped unit also counts as a move.
  moves+=originallyEquipped-originalPlaced;
  let power=0;
  if(isDrif)for(let k=0;k<values.length;k++){values[k]=Math.min(MODS[modCodes[k]].cap??Infinity,ceil(sums[k]*(penalty(counts[k])??0)+fixedValues[k]));power+=values[k]*MODS[modCodes[k]].mult;}
  else power=powers.reduce((a,v)=>a+v,0);
  const overflow=Math.max(0,units.length-used-bagLimit);
  return [-overflow,...targets.map(t=>Math.min(values[(isDrif?modIndex:orbIndex)[t.code]]||0,targetLimit(t))),power,-capacity,-used,-moves];
 }
 const valid=state=>state.every(legal)&&units.length-state.flat().length<=bagLimit;
 return {kind,prop,bag,items,units,current,fixed,movable,targets,legal,score,valid};
}

async function searchDomain(ctx,milliseconds,control,report){
 const deadline=now()+milliseconds,{units,items,legal,score,movable}=ctx;
 let nodes=0,ticks=0,stopped=false,exact=false,best=null,bestScore=null,lastReport=0;
 // Seeded randomness makes the same budget and inventory reproducible in tests.
 let seed=control.seed??0x81728;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
 const copy=s=>s.map(x=>[...x]);
 function consider(state,s=score(state)){nodes++;if(s[0]===0&&compareScores(s,bestScore)>0){best=copy(state);bestScore=s;}return s;}
 if(ctx.valid(ctx.current))consider(ctx.current);
 consider(ctx.fixed);
 async function checkpoint(force=false){
  if(force||!(++ticks%256)){
   if(now()-lastReport>300){lastReport=now();report({phase:ctx.kind,nodes,bestScore});await pause();}
   if(control.cancelled?.()||now()>=deadline||(control.maxNodes&&nodes>=control.maxNodes))stopped=true;
  }
  return stopped;
 }
 function locations(state){const loc=Array(units.length).fill(-1);state.forEach((list,j)=>list.forEach(id=>loc[id]=j));return loc;}
 // Enumerate every legal assignment for small inventories. Larger spaces use
 // multiple starts and relocation/exchange neighborhoods; no optimality claim.
 let combinations=1;for(const u of movable){combinations*=u.choices.length+1;if(combinations>180000)break;}
 if(combinations<=180000){
  const state=copy(ctx.fixed),ordered=[...movable].sort((a,b)=>a.choices.length-b.choices.length||a.id-b.id);
  async function enumerate(index){
   nodes++;if(await checkpoint())return;
   if(index===ordered.length){for(const list of state)list.sort((a,b)=>a-b);consider(state);return;}
   const u=ordered[index];
   for(const j of [...u.choices,-1]){
    if(j>=0){state[j].push(u.id);if(!legal(state[j],j)){state[j].pop();continue;}}
    await enumerate(index+1);
    if(j>=0)state[j].splice(state[j].indexOf(u.id),1);
    if(stopped)return;
   }
  }
  await enumerate(0);exact=!stopped;
 }else{
  // Each scan evaluates real global effects, including repeat penalties, hard
  // caps and the strongest orb. It can remove counterproductive extra drifs.
  async function improve(start,randomized=false){
   let state=copy(start),currentScore=score(state),round=0;
   while(!stopped&&round++<80){
    let next=null,nextScore=currentScore;const loc=locations(state);
    const order=[...movable];if(randomized)for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    const seenBackpack=new Set();
    for(const u of order){
     const from=loc[u.id];
     // Identical unused backpack records have the same moves and effects.
     // Evaluate one representative per scan, but retain every owned record.
     if(from<0&&u.origin<0){const key=JSON.stringify(u.g);if(seenBackpack.has(key))continue;seenBackpack.add(key);}
     for(const to of [...u.choices,-1]){
      if(to===from)continue;
      const oldFrom=from>=0?state[from]:null,oldTo=to>=0?state[to]:null;
      if(from>=0)state[from]=oldFrom.filter(id=>id!==u.id);
      if(to>=0)state[to]=[...oldTo,u.id].sort((a,b)=>a-b);
      if(to<0||legal(state[to],to)){
       const s=consider(state);if(compareScores(s,nextScore)>0){next=copy(state);nextScore=s;}
      }
      if(from>=0)state[from]=oldFrom;if(to>=0)state[to]=oldTo;
      if(await checkpoint())break;
     }
     if(stopped)break;
     // Exchange with another equipped unit; a backpack unit may evict one to
     // the backpack. This resolves full sockets and many capacity conflicts.
     for(let j=0;j<items.length;j++)for(const vId of [...state[j]]){
      const v=units[vId];if(v.locked||v.id===u.id||j===from||!u.choices.includes(j)||(from>=0&&!v.choices.includes(from)))continue;
      const oldFrom=from>=0?state[from]:null,oldTo=state[j];
      state[j]=oldTo.filter(id=>id!==v.id).concat(u.id).sort((a,b)=>a-b);
      if(from>=0)state[from]=oldFrom.filter(id=>id!==u.id).concat(v.id).sort((a,b)=>a-b);
      if(legal(state[j],j)&&(from<0||legal(state[from],from))){const s=consider(state);if(compareScores(s,nextScore)>0){next=copy(state);nextScore=s;}}
      state[j]=oldTo;if(from>=0)state[from]=oldFrom;
      if(await checkpoint())break;
     }
     if(stopped)break;
     // On random restarts accept the first improving unit, changing the order
     // of fills instead of always following the same greedy path.
     if(randomized&&next)break;
    }
    if(!next)break;state=next;currentScore=nextScore;
    if(await checkpoint(true))break;
   }
   return state;
  }
  if(best)await improve(best);
  if(!stopped)await improve(ctx.fixed);
  let restarts=0;
  while(!stopped){
   const start=copy(restarts%4===0?ctx.fixed:(best||ctx.fixed));
   // Clearing several movable stones together also explores a two-for-one
   // replacement that single swaps cannot reach.
   if(restarts%4!==0){const fraction=.2+random()*.6;for(let j=0;j<start.length;j++)start[j]=start[j].filter(id=>units[id].locked||random()>fraction);}
   await improve(start,true);restarts++;
   if(await checkpoint(true))break;
  }
 }
 if(!best)throw Error('Nie znaleziono poprawnego rozmieszczenia. Sprawdź blokady przedmiotów i miejsce w plecaku.');
 return {state:best,score:bestScore,exact,nodes,cancelled:!!control.cancelled?.()};
}

export async function optimizeBuild(input,catalog,settings={},control={}){
 const build=clone(input),options={...optimizerDefaults(),...settings},started=now();
 options.lockedSlots=Array.isArray(options.lockedSlots)?options.lockedSlots.filter(s=>SLOTS[s]):[];
 options.seconds=Math.max(.05,Math.min(30,Number(options.seconds)||8));
 if(options.mode==='modifiers'){
  if(!options.targets?.length)throw Error('Wybierz co najmniej jeden modyfikator.');
  for(const t of options.targets){const def=(t.kind==='drif'?MODS:t.kind==='orb'?ORBS:{})[t.code];if(!def||!['max','cap','value'].includes(t.goal)||(t.goal==='cap'&&(t.kind!=='drif'||def.cap==null))||(t.goal==='value'&&(!Number.isFinite(Number(t.value))||Number(t.value)<=0)))throw Error('Nieprawidłowy cel optymalizacji.');if(t.kind==='orb'&&!options.includeOrbs)throw Error('Włącz rozmieszczanie orbów, aby wybrać ich efekt jako cel.');}
 }
 const stripped=clone(build);for(const i of Object.values(stripped.equipment)){i.drifs=[];i.orbs=[];}const base=calculate(stripped,catalog);
 const drifs=domainContext(build,catalog,options,'drif',base),orbs=domainContext(build,catalog,options,'orb',base);
 let totalNodes=0;const reports=phase=>p=>control.onProgress?.({...p,nodes:totalNodes+p.nodes,elapsed:now()-started,phase});
 // Drifs and orbs have separate sockets and independent effects. Optimizing
 // each domain preserves the ordered objective and the sum of their powers.
 const ms=options.seconds*1000,orbShare=orbs.movable.some(u=>u.choices.length)?(drifs.movable.some(u=>u.choices.length)?.28:1):0;
 const d=await searchDomain(drifs,Math.max(10,ms*(1-orbShare)),control,reports('drif'));totalNodes+=d.nodes;
 const o=await searchDomain(orbs,Math.max(10,ms-(now()-started)),control,reports('orb'));totalNodes+=o.nodes;
 const candidate=clone(build);let recalculatedOrbs=0;
 for(const [ctx,result] of [[drifs,d],[orbs,o]]){
  const placed=new Set();
  ctx.items.forEach(({slot},j)=>{candidate.equipment[slot][ctx.prop]=result.state[j].map(id=>{
   placed.add(id);const u=ctx.units[id],gem=clone(u.g);
   if(ctx.kind==='orb'&&u.origin!==j&&gem.code&&gem.exportEffect!==undefined){delete gem.exportEffect;recalculatedOrbs++;}
   return gem;
  });});
  candidate[ctx.bag]=ctx.units.filter(u=>!placed.has(u.id)).map(u=>{const gem=clone(u.g);if(ctx.kind==='orb'&&u.origin>=0&&gem.code)delete gem.exportEffect;return gem;});
 }
 if(JSON.stringify(inventorySignature(build))!==JSON.stringify(inventorySignature(candidate)))throw Error('Nie udało się zachować pełnej listy kamieni. Wynik nie został zastosowany.');
 return {build:candidate,exact:d.exact&&o.exact,nodes:totalNodes,elapsed:now()-started,cancelled:d.cancelled||o.cancelled,recalculatedOrbs,changed:JSON.stringify(build)!==JSON.stringify(candidate)};
}
