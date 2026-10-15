import {MAX_BACKPACK_DRIFS,MAX_BACKPACK_ORBS,normalizeDrif,normalizeOrb,resolveItem,effectiveItem,maxSize,ORBS,allowedOrbs} from './engine.js';

function backpackRoom(build,count=1){if((build.backpack?.length||0)+count>MAX_BACKPACK_DRIFS)throw Error('Plecak osiągnął limit zapisu. Usuń zbędne drify.');}
function existingIndex(list,index){if(!Number.isInteger(index)||index<0||index>=list.length)throw Error('Nie znaleziono wybranego drifu.');}

export function drifPlacementIssues(inst,item,drif,level=1,replaceIndex=null){
 if(!inst||!item)return ['Brak przedmiotu w tym slocie.'];
 if(item.fixedDrifs)return ['Wbudowanych drifów epika nie można wymieniać.'];
 try{normalizeDrif(drif);}catch{return ['Nieprawidłowy drif.'];}
 if(replaceIndex!==null&&(!Number.isInteger(replaceIndex)||replaceIndex<0||replaceIndex>=inst.drifs.length))return ['Nie znaleziono drifu do wymiany.'];
 const others=inst.drifs.filter((_,i)=>i!==replaceIndex),candidate={...inst,drifs:[...others,drif]},e=effectiveItem(candidate,item,level),issues=[];
 if(candidate.drifs.length>e.sockets)issues.push('Brak wolnego gniazda.');
 if(drif.size>maxSize(item.rank))issues.push('Za niska ranga przedmiotu dla tej wielkości.');
 if(others.some(d=>d.code===drif.code))issues.push('Ten efekt jest już w przedmiocie.');
 if(['Kalh','Unn','Val','Err'].includes(drif.code)&&item.slot!=='weapon')issues.push('Ten drif pasuje tylko do broni.');
 if(['Kalh','Unn','Val'].includes(drif.code)&&others.some(d=>['Kalh','Unn','Val'].includes(d.code)))issues.push('Broń ma już drif żywiołowy.');
 if(!['Set','Epik'].includes(item.kind)&&e.cost>e.capacity)issues.push(`Za mała pojemność: ${e.cost}/${e.capacity}.`);
 return issues;
}

export function addBackpackDrif(build,drif){
 const copy=normalizeDrif(drif);backpackRoom(build);(build.backpack??=[]).push(copy);
}

export function moveDrifToBackpack(build,catalog,slot,index){
 const inst=build.equipment[slot],item=resolveItem(inst,catalog);
 if(!inst||!item)throw Error('Brak przedmiotu.');
 if(item.fixedDrifs)throw Error('Wbudowany drif pozostaje w epiku.');
 existingIndex(inst.drifs,index);const copy=normalizeDrif(inst.drifs[index]);backpackRoom(build);
 (build.backpack??=[]).push(copy);inst.drifs.splice(index,1);
}

// A replacement keeps the old drif in the backpack. Moving from the backpack
// consumes exactly one record, even when several identical drifs are stored.
export function placeDrif(build,catalog,slot,drif,{backpackIndex=null,replaceIndex=null}={}){
 const inst=build.equipment[slot],item=resolveItem(inst,catalog);
 if(backpackIndex!==null)existingIndex(build.backpack||[],backpackIndex);
 const copy=normalizeDrif(backpackIndex===null?drif:build.backpack[backpackIndex]);
 const issues=drifPlacementIssues(inst,item,copy,build.level,replaceIndex);
 if(issues.length)throw Error(issues.join(' '));
 const old=replaceIndex===null?null:normalizeDrif(inst.drifs[replaceIndex]);
 backpackRoom(build,(old?1:0)-(backpackIndex===null?0:1));
 build.backpack??=[];
 if(backpackIndex!==null)build.backpack.splice(backpackIndex,1);
 if(old){build.backpack.push(old);inst.drifs[replaceIndex]=copy;}else inst.drifs.push(copy);
}

export function stashItemDrifs(build,catalog,slot){
 const inst=build.equipment[slot],item=resolveItem(inst,catalog);
 if(!inst||!item)return 0;
 const copies=item.fixedDrifs?[]:inst.drifs.map(normalizeDrif),orbs=inst.orbs.map(normalizeOrb);
 backpackRoom(build,copies.length);orbRoom(build,orbs.length);
 (build.backpack??=[]).push(...copies);(build.backpackOrbs??=[]).push(...orbs.map(o=>{if(o.code)delete o.exportEffect;return o;}));
 if(!item.fixedDrifs)inst.drifs=[];inst.orbs=[];return copies.length+orbs.length;
}
function orbRoom(build,count=1){if((build.backpackOrbs?.length||0)+count>MAX_BACKPACK_ORBS)throw Error('Plecak osiągnął limit zapisu orbów.');}
export function orbPlacementIssues(inst,item,orb){
 if(!inst||!item)return ['Brak przedmiotu.'];
 try{normalizeOrb(orb);}catch{return ['Nieprawidłowy orb.'];}
 if(!ORBS[orb.code])return ['Najpierw wybierz nazwę orba.'];
 const issues=[];
 if(inst.orbs.length>=item.orbSockets)issues.push('Brak wolnego gniazda orba.');
 if(orb.size>maxSize(item.rank))issues.push('Za niska ranga przedmiotu.');
 if(!allowedOrbs(item).includes(ORBS[orb.code].type))issues.push('Niewłaściwy rodzaj orba.');
 return issues;
}
export function addBackpackOrb(build,orb){const copy=normalizeOrb(orb);orbRoom(build);if(copy.code)delete copy.exportEffect;(build.backpackOrbs??=[]).push(copy);}
export function moveOrbToBackpack(build,slot,index){
 const inst=build.equipment[slot];if(!inst||!Number.isInteger(index)||!inst.orbs[index])throw Error('Nie znaleziono orba.');
 addBackpackOrb(build,inst.orbs[index]);inst.orbs.splice(index,1);
}
export function placeBackpackOrb(build,catalog,slot,index){
 const orb=build.backpackOrbs?.[index],inst=build.equipment[slot],item=resolveItem(inst,catalog);
 if(!orb)throw Error('Nie znaleziono orba w plecaku.');
 const issues=orbPlacementIssues(inst,item,orb);if(issues.length)throw Error(issues.join(' '));
 const copy=normalizeOrb(orb);delete copy.exportEffect;inst.orbs.push(copy);build.backpackOrbs.splice(index,1);
}
