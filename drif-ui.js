import {MODS,SIZES,MAXLEVEL,SLOTS,drifValue,drifCost,ceil,resolveItem} from './engine.js';
import {drifPlacementIssues} from './drif-inventory.js';
import {esc,itemImage} from './widgets.js';

const fmt=n=>Number(n).toLocaleString('pl-PL',{maximumFractionDigits:2});
export const drifName=d=>['Subdrif','Bidrif','Magnidrif','Arcydrif'][d.size]+' '+d.code;

export function drifImage(d,assets){
 const entry=assets.entries.find(a=>a.code===d.code&&a.size===d.size);
 return `<span class="drif-image" aria-hidden="true">${entry?`<img src="${esc(entry.image)}" alt="" width="70" height="70" loading="lazy" decoding="async">`:'◈'}</span>`;
}

export function drifEffect(d,item=null,boost=0){
 const base=drifValue(d,item?.kind),value=ceil(base*(1+boost/100));
 return item?`${fmt(base)}% × ${fmt(1+boost/100)} = ${fmt(value)}% przed karą`:`${fmt(base)}% · potęga ${drifCost(d)}`;
}

export function drifSlider(d,source,index,slot='',fixedLevel=false){
 const value=fixedLevel?MAXLEVEL[d.size]:d.level,max=MAXLEVEL[d.size],id=`drif-level-${source}-${slot}-${index}`;
 return `<div class="drif-level-control"><label for="${id}">Poziom <output data-drif-level-label for="${id}">${value}</output><span>/ ${max}</span></label><input id="${id}" type="range" min="1" max="${max}" step="1" value="${value}" data-drif-level-source="${source}" data-drif-index="${index}" data-drif-slot="${slot}" aria-label="Poziom: ${esc(drifName(d))}" aria-valuetext="Poziom ${value} z ${max}" style="--fill:${(value-1)/(max-1)*100}%" ${fixedLevel?'disabled':''}>${fixedLevel?'<small class="muted">Set wykorzystuje maksymalny poziom drifu.</small>':''}</div>`;
}

export function equippedDrifs(inst,item,e,slot,assets){
 if(!e.sockets)return '';
 return `<div class="editor-section equipped-drifs"><div class="section-title"><h3>Drify <span class="muted small-text">${inst.drifs.length}/${e.sockets}</span></h3>${item.fixedDrifs?'<span class="badge">WBUDOWANE</span>':`<button class="small" data-action="add-drif" ${inst.drifs.length>=e.sockets?'disabled':''}>+ Wybierz drif</button>`}</div><p class="mod-caption">Wzmocnienie: <b class="gold">${fmt(e.boost)}%</b>${!['Set','Epik'].includes(item.kind)?` · pojemność <b data-drif-capacity class="${e.cost>e.capacity?'red':''}">${e.cost}/${e.capacity}</b>`:''}</p><div class="equipped-drif-list">${inst.drifs.map((d,index)=>`<article class="drif-card" data-drif-card><div class="drif-card-heading">${drifImage(d,assets)}<div><strong>${esc(drifName(d))}</strong><small>${esc(MODS[d.code].label)}</small></div></div>${drifSlider(d,'equipment',index,slot,item.kind==='Set')}<p class="drif-effect" data-drif-effect>${drifEffect(d,item,e.boost)}</p>${!inst.charged?'<p class="inline-note red">Sprzęt rozładowany — efekt nieaktywny.</p>':''}${item.fixedDrifs?'<p class="inline-note">Ten drif jest na stałe związany z epikiem.</p>':`<div class="drif-card-actions"><button class="small" data-replace-drif="${index}">Zmień</button><button class="small" data-store-drif="${index}">Do plecaka ↗</button></div>`}</article>`).join('')}</div>${!inst.drifs.length?'<p class="inline-note">Wybierz nowy drif z katalogu lub osadź jeden z plecaka.</p>':''}</div>`;
}

export function backpackPanel(build,assets){
 const bag=build.backpack||[];
 return `<section class="panel backpack-panel" id="drif-backpack"><div class="panel-heading"><div><div class="eyebrow">ZAPASOWE DRIFY</div><h2>Plecak <span class="backpack-count">${bag.length}</span></h2></div><button class="small" data-action="add-backpack-drif">+ Dodaj drif</button></div><div class="panel-body"><p class="inline-note backpack-note">Drify w plecaku nie dodają powera. Możesz je osadzić w sprzęcie lub zmienić ich poziom przed wyborem.</p>${bag.length?`<div class="backpack-grid">${bag.map((d,index)=>`<article class="drif-card" data-drif-card><div class="drif-card-heading">${drifImage(d,assets)}<div><strong>${esc(drifName(d))}</strong><small>${esc(MODS[d.code].label)}</small></div></div>${drifSlider(d,'backpack',index)}<p class="drif-effect" data-drif-effect>${drifEffect(d)}</p><div class="drif-card-actions"><button class="small" data-equip-backpack="${index}">Osadź w sprzęcie</button><button class="small quiet" data-delete-backpack="${index}" aria-label="Usuń z plecaka: ${esc(drifName(d))}, poziom ${d.level}">Usuń</button></div></article>`).join('')}</div>`:'<div class="backpack-empty"><span aria-hidden="true">◇</span><p>Plecak jest pusty</p><small>Dodaj drif z katalogu albo użyj „Do plecaka” przy drifie w ekwipunku.</small></div>'}</div></section>`;
}

export function drifPickerShell(target,build,catalog,size=0,level=1){
 const item=target.kind==='equipment'?resolveItem(build.equipment[target.slot],catalog):null;
 return `<div class="dialog-head"><div><div class="eyebrow">KATALOG DRIFÓW</div><h2>${item?`Wybierz drif · ${esc(item.name)}`:'Dodaj drif do plecaka'}</h2></div><button class="icon-button" data-action="close-drif-picker" aria-label="Zamknij katalog drifów">×</button></div>${item?`<div class="drif-source-switch"><button data-drif-source="catalog" class="active" aria-pressed="true">Katalog WikiBR</button><button data-drif-source="backpack" aria-pressed="false">Z plecaka (${build.backpack.length})</button></div>`:''}<div class="drif-picker-filters"><input type="search" id="drif-search" placeholder="Szukaj nazwy lub efektu…" aria-label="Szukaj drifu"><label id="drif-size-label">Wielkość<select id="drif-size">${SIZES.map((s,i)=>`<option value="${i}" ${i===size?'selected':''}>${s}</option>`).join('')}</select></label>${item?'<label class="check"><input id="drif-compatible" type="checkbox" checked>Tylko pasujące</label>':''}</div><div class="drif-picker-level" id="drif-picker-level"><label for="catalog-drif-level">Poziom nowego drifu <output id="catalog-drif-level-output">${level}</output></label><input type="range" id="catalog-drif-level" min="1" max="${MAXLEVEL[size]}" step="1" value="${level}" aria-valuetext="Poziom ${level} z ${MAXLEVEL[size]}" style="--fill:${(level-1)/(MAXLEVEL[size]-1)*100}%"><span id="catalog-drif-level-max">Maks. ${MAXLEVEL[size]}</span></div><div id="drif-catalog-count" class="muted" aria-live="polite"></div><div id="drif-catalog" class="drif-catalog-grid"></div><div class="dialog-foot"><span>${target.replaceIndex!==null&&target.replaceIndex!==undefined?'Wymieniany drif trafi do plecaka.':'Wybierz drif, aby go dodać.'}</span><a href="https://wikibr.pl/index.php/Drify" target="_blank" rel="noreferrer">Grafiki i dane: WikiBR ↗</a></div>`;
}

export function drifCatalogContents({target,source,query,size,level,compatibleOnly},build,catalog,assets){
 const inst=build.equipment[target.slot],item=resolveItem(inst,catalog);
 const rows=source==='backpack'?build.backpack.map((d,index)=>({drif:d,index})):Object.values(MODS).filter(m=>m.cost).map(m=>({drif:{code:m.code,size,level}}));
 const normalized=query.toLocaleLowerCase('pl').trim();
 const filtered=rows.map(row=>({...row,issues:target.kind==='equipment'?drifPlacementIssues(inst,item,row.drif,build.level,target.replaceIndex):[]})).filter(row=>(drifName(row.drif)+' '+MODS[row.drif.code].label).toLocaleLowerCase('pl').includes(normalized)&&(!compatibleOnly||!row.issues.length));
 return {count:filtered.length,html:filtered.length?filtered.map(({drif:d,index,issues})=>`<button class="drif-catalog-card" ${source==='backpack'?`data-pick-backpack="${index}"`:`data-pick-drif="${d.code}"`} ${issues.length?'disabled':''}>${drifImage(d,assets)}<span><strong>${esc(drifName(d))}</strong><small>${esc(MODS[d.code].label)}</small><span class="drif-catalog-meta">Poz. ${d.level} · <b>${fmt(drifValue(d,item?.kind))}%</b> · potęga ${drifCost(d,item?.kind)}</span>${item?.kind==='Set'?'<small>W secie działa na maks. poziomie.</small>':''}${issues.length?`<small class="red">${esc(issues.join(' '))}</small>`:`<span class="drif-pick-label">${target.kind==='backpack'?'Dodaj do plecaka':target.replaceIndex!==null?'Wymień drif':'Osadź drif'} →</span>`}</span></button>`).join(''):`<div class="no-data">${source==='backpack'&&!build.backpack.length?'Plecak jest pusty. Dodaj drify z katalogu.':'Brak pasujących drifów. Zmień filtry, wielkość lub poziom.'}</div>`};
}

export function drifDestinationDialog(build,catalog,assets,index){
 const d=build.backpack[index];
 return `<div class="dialog-head"><div><div class="eyebrow">Z PLECAKA DO EKWIPUNKU</div><h2>Gdzie osadzić ${esc(drifName(d))}?</h2></div><button class="icon-button" data-action="close-drif-destination" aria-label="Zamknij wybór przedmiotu">×</button></div><div class="drif-destination-intro">${drifImage(d,assets)}<span>Poziom ${d.level} · ${drifEffect(d)}</span></div><div class="drif-destination-grid">${Object.entries(SLOTS).map(([slot,label])=>{const inst=build.equipment[slot],item=resolveItem(inst,catalog),issues=drifPlacementIssues(inst,item,d,build.level);return `<button class="drif-destination" data-drif-destination="${slot}" data-bag-index="${index}" ${issues.length?'disabled':''}>${itemImage(item)}<span><small>${label}</small><strong>${esc(item?.name||'Pusty slot')}</strong><small class="${issues.length?'muted':'cyan'}">${issues.length?esc(issues[0]):'Osadź tutaj →'}</small></span></button>`;}).join('')}</div><div class="dialog-foot"><span>Chcesz wymienić drif w zajętym gnieździe? W edytorze przedmiotu wybierz „Zmień”, następnie „Z plecaka”.</span></div>`;
}
