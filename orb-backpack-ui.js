import {ORBS,SIZES,MAX_BACKPACK_ORBS,resolveItem,normalizeOrb} from './engine.js';
import {addBackpackOrb,placeBackpackOrb,orbPlacementIssues} from './drif-inventory.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const option=(v,l,value)=>`<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${esc(l)}</option>`;
export function orbBackpackPanel(build,catalog){
 const bag=build.backpackOrbs||[];
 return `<section class="panel orb-backpack"><div class="panel-heading"><h2>Orby w plecaku <span class="muted small-text">${bag.length}</span></h2><button class="small" data-orb-bag-action="add" ${bag.length>=MAX_BACKPACK_ORBS?'disabled':''}>+ Dodaj orb</button></div><div class="panel-body">${bag.length?bag.map((o,i)=>`<div class="orb-bag-card"><div class="orb-bag-fields"><label>Efekt<select data-orb-bag="${i}" data-field="code">${!o.code?option('','Wybierz nazwę · kod '+o.sourceCode,''):''}${Object.values(ORBS).map(d=>option(d.code,d.code+' · '+d.label,o.code)).join('')}</select></label><label>Wielkość<select data-orb-bag="${i}" data-field="size" ${!o.code?'disabled':''}>${SIZES.map((s,j)=>option(j,s,o.size)).join('')}</select></label><label>Poziom<select data-orb-bag="${i}" data-field="level" ${!o.code?'disabled':''}>${Array.from({length:o.size===0?1:3},(_,j)=>option(j+1,j+1,o.level)).join('')}</select></label><button class="small" data-orb-bag-delete="${i}" aria-label="Usuń orb ${i+1} z plecaka">×</button></div><div class="orb-bag-place"><label>Osadź w<select id="orb-bag-destination-${i}" aria-label="Przedmiot dla orba ${i+1}">${Object.entries(build.equipment).filter(([,ins])=>!orbPlacementIssues(ins,resolveItem(ins,catalog),o).length).map(([slot,ins])=>option(slot,resolveItem(ins,catalog).name,'')).join('')||'<option value="">Brak pasującego wolnego gniazda</option>'}</select></label><button class="small" data-orb-bag-place="${i}" ${!Object.values(build.equipment).some(ins=>!orbPlacementIssues(ins,resolveItem(ins,catalog),o).length)?'disabled':''}>Osadź</button></div></div>`).join(''):'<p class="inline-note">Dodaj posiadane orby albo przenieś je z ekwipunku. Optymalizator uwzględni je razem z osadzonymi orbami.</p>'}</div></section>`;
}
export function createOrbBackpackUI({getBuild,getCatalog,render,toast}){
 return {
  click(b){try{
   const build=getBuild();
   if(b.dataset.orbBagAction==='add'){addBackpackOrb(build,{code:"Ba'ed",size:0,level:1});render();return true;}
   if('orbBagDelete' in b.dataset){build.backpackOrbs.splice(Number(b.dataset.orbBagDelete),1);render();return true;}
   if('orbBagPlace' in b.dataset){const i=Number(b.dataset.orbBagPlace),slot=document.querySelector('#orb-bag-destination-'+i).value;placeBackpackOrb(build,getCatalog(),slot,i);render();toast('Orb przeniesiony z plecaka do przedmiotu.');return true;}
  }catch(e){toast(e.message);return true;}return false;},
  change(el){if(!('orbBag' in el.dataset))return false;try{
   const build=getBuild(),o=build.backpackOrbs[Number(el.dataset.orbBag)],field=el.dataset.field,candidate={...o,[field]:field==='code'?el.value:Number(el.value)};if(!candidate.code)return true;delete candidate.exportEffect;candidate.level=Math.min(candidate.level,candidate.size===0?1:3);build.backpackOrbs[Number(el.dataset.orbBag)]=normalizeOrb(candidate);render();
  }catch(e){toast(e.message);render();}return true;}
 };
}
