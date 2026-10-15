import {optimizeBuild} from './optimizer.js';
let cancelled=false;
self.onmessage=async event=>{
 if(event.data.type==='cancel'){cancelled=true;return;}
 if(event.data.type!=='start')return;
 cancelled=false;
 try{const result=await optimizeBuild(event.data.build,event.data.catalog,event.data.options,{cancelled:()=>cancelled,onProgress:progress=>self.postMessage({type:'progress',progress})});self.postMessage({type:'result',result});}
 catch(error){self.postMessage({type:'error',message:error.message});}
};
