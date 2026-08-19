/* Find Your Politics V2 scoring engine - source-audit candidate */
(function(){
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const patchBank=()=>{if(window.FYP_V2_PATCH_BANK)window.FYP_V2_PATCH_BANK(state)};
  const usefulCount=()=>Object.values(state.answers).filter(a=>a&&(a.kind==='dealbreaker'||a.kind==='diagnostic'||a.score!=null||a.scores)).length;
  const evidence=a=>{if(!a||['dealbreaker','diagnostic','skip'].includes(a.kind))return[];if(a.scores)return Object.entries(a.scores).filter(([,v])=>Number.isFinite(v));return Number.isFinite(a.score)&&a.dimension?[[a.dimension,a.score]]:[]};

  vector=function(){
    patchBank();const sums={},den={};
    Object.values(state.answers).forEach(a=>{const aw=Number.isFinite(a?.weight)?a.weight:1;evidence(a).forEach(([d,s])=>{sums[d]=(sums[d]||0)+s*aw;den[d]=(den[d]||0)+aw})});
    const out={};Object.keys(sums).forEach(d=>out[d]=sums[d]/den[d]);return out;
  };

  function sensitivityFor(d){
    const explicit=state.dealbreakers?.[d];if(Number.isFinite(explicit))return explicit;
    const priority=(state.priorities||[]).some(p=>(priorityMap[p]||[]).includes(d));return priority ? .35 : .18;
  }

  ranking=function(){
    patchBank();const v=vector(),c=coords(),w=weights();
    return Object.keys(partyNames).map(p=>{
      let tot=0,ws=0,rawPenalty=0,details=[];
      Object.keys(v).forEach(d=>{if(c[p][d]==null)return;const dist=Math.abs(v[d]-c[p][d]),sim=clamp(1-dist/200,0,1),ww=w[d]||1,sensitivity=sensitivityFor(d);tot+=sim*ww;ws+=ww;let penalty=0;if(dist>60){const severity=Math.pow((dist-60)/140,2);penalty=severity*sensitivity*ww*18;rawPenalty+=penalty}details.push({d,dist,user:v[d],party:c[p][d],weight:ww,sensitivity,penalty})});
      const policy=ws?100*tot/ws:0,conflictPenalty=clamp(rawPenalty,0,30),fit=clamp(policy-conflictPenalty,0,100);return{p,policy,fit,conflictPenalty,details};
    }).sort((a,b)=>b.fit-a.fit||b.policy-a.policy);
  };

  function record(q,a){
    patchBank();state.history.push(q.id);const weight=Number.isFinite(q.v2_weight)?q.v2_weight:(q.type==='reality_check'?.8:1);
    if(q.v2_kind==='dealbreaker'){state.dealbreakers=state.dealbreakers||{};state.dealbreakers[q.dealbreaker_dimension]=a.dealbreaker_sensitivity;state.answers[q.id]={score:null,dimension:q.primary_dimension,kind:'dealbreaker',dealbreakerDimension:q.dealbreaker_dimension,sensitivity:a.dealbreaker_sensitivity,weight:0}}
    else if(q.v2_kind==='diagnostic')state.answers[q.id]={score:null,dimension:q.primary_dimension,kind:'diagnostic',diagnosticScore:a.score,weight:0};
    else if(a.scores)state.answers[q.id]={score:a.score,dimension:q.primary_dimension,scores:{...a.scores},kind:'policy',weight};
    else state.answers[q.id]={score:a.score,dimension:q.primary_dimension,scores:{[q.primary_dimension]:a.score},kind:'policy',weight};
    $('insightBanner')?.classList.add('hidden');askNext();
  }

  renderQuestion=function(q){
    patchBank();state.current=q;const n=usefulCount(),c=confidence();$('progressText').textContent=state.lang==='sv'?`${n} användbara svar`:`${n} useful answers`;$('confidenceLabel').textContent=`${confLabel(c)} · ${c}%`;$('progressBar').style.width=Math.min(100,n/state.batchTarget*100)+'%';$('questionMeta').textContent=categoryText(q);$('questionText').textContent=state.lang==='sv'?(q.question_sv||q.question):q.question;const box=$('answers');box.innerHTML='';q.answers.filter(x=>x.key!=='E').forEach(x=>{const b=document.createElement('button');b.className='answer';b.textContent=answerText(q,x);b.onclick=()=>record(q,x);box.appendChild(b)});$('backBtn').classList.toggle('hidden',!state.history.length);$('explainer').classList.add('hidden');$('explainerText').textContent=state.lang==='sv'?beginnerExplainSv(q.primary_dimension):q.dont_know_explainer;$('explainerTradeoff').textContent=state.lang==='sv'?beginnerTradeoffSv(q.primary_dimension):beginnerTradeoffEn(q.primary_dimension)
  };

  $('backBtn').onclick=()=>{if(!state.history.length)return;const id=state.history.pop(),saved=state.answers[id];if(saved?.kind==='dealbreaker'&&saved.dealbreakerDimension&&state.dealbreakers)delete state.dealbreakers[saved.dealbreakerDimension];delete state.answers[id];const q=state.bank.questions.find(x=>x.id===id);state.asked=state.asked.filter(x=>x!==id);show('screen-quiz');renderQuestion(q)};
  $('skipQuestionBtn').onclick=()=>{state.history.push(state.current.id);state.answers[state.current.id]={score:null,dimension:state.current.primary_dimension,kind:'skip',weight:0};askNext()};

  const baseChooseNext=chooseNext;
  chooseNext=function(){
    patchBank();const policyCount=Object.values(state.answers).filter(a=>a?.kind==='policy'&&(a.score!=null||a.scores)).length;
    if(policyCount>=12){const answered=new Set(Object.keys(state.answers)),v=vector(),r=ranking().filter(x=>state.acceptability[x.p]!=='veto').slice(0,3),c=coords(),candidates=state.bank.questions.filter(q=>q.v2_kind==='dealbreaker'&&!answered.has(q.id)&&!state.asked.includes(q.id));let best=null,bestScore=0;candidates.forEach(q=>{const d=q.dealbreaker_dimension;if(v[d]==null)return;const maxDist=Math.max(...r.map(x=>Math.abs(v[d]-c[x.p][d]))),priority=(state.priorities||[]).some(p=>(priorityMap[p]||[]).includes(d)),score=maxDist+(priority?20:0);if(maxDist>=85&&score>bestScore){best=q;bestScore=score}});const dbAnswered=Object.values(state.answers).filter(a=>a?.kind==='dealbreaker').length;if(best&&dbAnswered<2)return best}
    return baseChooseNext();
  };

  function metric(label,value,sub){return `<div class="v2-metric"><span>${label}</span><strong>${value}<small>/100</small></strong>${sub?`<em>${sub}</em>`:''}</div>`}
  results=function(){
    patchBank();show('screen-results');const ranked=ranking(),nonVeto=ranked.filter(r=>state.acceptability[r.p]!=='veto'),best=(nonVeto[0]||ranked[0])?.p,w=$('resultsList');w.innerHTML='';ranked.forEach((r,i)=>{const veto=state.acceptability[r.p]==='veto',isBest=r.p===best,e=document.createElement('div');e.className='result'+(isBest?' best-match':'')+(veto?' veto-result':'');const note=r.conflictPenalty>=.5?(state.lang==='sv'?`${r.conflictPenalty.toFixed(1)} poäng konfliktavdrag`:`${r.conflictPenalty.toFixed(1)} point conflict penalty`):'';e.innerHTML=(veto?`<div class="veto-banner">${t('excluded')}</div>`:'')+(isBest?`<div class="best-badge">${t('best_match')}</div>`:'')+`<div class="result-head"><div><div class="rank">#${i+1}</div><h3>${partyNames[r.p]}</h3></div></div><div class="v2-metrics">${metric('Policy Alignment',r.policy.toFixed(0),'')}${metric('Voting Fit',r.fit.toFixed(0),note)}</div>`+(isBest?`<div class="best-reason"><strong>${t('why_best')}</strong><br>${narrative(r,'align')}</div>`:'')+`<div class="result-narrative"><p><strong>${t('where_align')}:</strong> ${narrative(r,'align')}</p><p><strong>${t('where_disagree')}:</strong> ${narrative(r,'disagree')}</p></div><a class="party-link" href="${partyUrls[r.p]}" target="_blank" rel="noopener noreferrer">${t('visit')}</a>`;w.appendChild(e)});$('nextRead').innerHTML=state.lang==='sv'?'<h3>Vad bör du läsa på om innan du bestämmer dig?</h3><p>Titta särskilt på de frågor där dina två bästa återstående matchningar skiljer sig mest. Det är där mer kunskap sannolikt kan påverka ditt val.</p>':'<h3>What should you look at before deciding?</h3><p>Focus on the issues where your two strongest remaining matches differ most. That is where more information is most likely to affect your choice.</p>';$('continueFromResultsBtn').classList.toggle('hidden',!state.viewingEarlyResults)
  };

  const baseStartQuiz=startQuiz;startQuiz=function(){state.dealbreakers={};patchBank();baseStartQuiz()};
  window.FYP_V2={patchBank,sensitivityFor,version:'2.0-audit-candidate'};patchBank();
})();