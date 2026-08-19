const __nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init){
  const url=typeof input==="string"?input:(input&&input.url)||"";
  if(url.endsWith("data/questions.json")){
    const parts=await Promise.all([1,2,3,4].map(i=>__nativeFetch(`data/questions-${i}.json`).then(r=>{if(!r.ok)throw new Error(`Question data ${i} failed`);return r.json()})));
    return new Response(JSON.stringify({version:"0.2-question-bank",questions:parts.flatMap(p=>p.questions)}),{status:200,headers:{"Content-Type":"application/json"}});
  }
  return __nativeFetch(input,init);
};
const v13css=document.createElement("link");v13css.rel="stylesheet";v13css.href="enhancement.css";document.head.appendChild(v13css);
window.addEventListener("load",()=>{const s=document.createElement("script");s.src="enhancement.js";document.body.appendChild(s);});
