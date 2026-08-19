(function(){
  const sv=()=>document.documentElement.lang==='sv';
  const T=(a,b)=>sv()?a:b;
  const norm=s=>(s||'').toLowerCase().replace(/[^a-z0-9åäö]+/g,' ').trim();

  function removeEmDashes(root=document.body){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{if(n.nodeValue&&/[—–]/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/\s*[—–]\s*/g,' - ')});
    if(/[—–]/.test(document.title))document.title=document.title.replace(/\s*[—–]\s*/g,' - ')
  }

  function sourceCleanup(){
    document.querySelectorAll('.source-mini').forEach(x=>x.remove());
    document.querySelectorAll('.result .party-link').forEach(a=>{a.textContent=T('Officiell källa ↗','Official source ↗')})
  }

  function highlightImportant(){
    document.querySelectorAll('#screen-results .method-box').forEach(box=>{
      const h=box.querySelector('h3');
      if(h&&/^(Viktigt|Important)$/i.test(h.textContent.trim())){
        box.classList.add('important-callout');
        const p=box.querySelector('p');
        if(p)p.textContent=T(
          'Vi strävar efter att vara så objektiva som möjligt. Modellen bygger på offentligt tillgängliga officiella partipositioner och på hur partierna själva beskriver sin politik. Poängen är ett mått på politisk närhet - inte en objektiv sanning och inte ett råd om hur du bör rösta.',
          'We aim to be as objective as possible. The model is based on publicly available official party positions and on how the parties themselves describe their policies. The score is an alignment measure - not an objective truth and not advice on how you should vote.'
        )
      }
    })
  }

  function moveResultActions(){
    const list=document.getElementById('resultsList');if(!list)return;
    const cards=[...list.querySelectorAll('.result')];if(cards.length<3)return;
    let mid=document.getElementById('midResultActions');
    if(!mid){mid=document.createElement('div');mid.id='midResultActions';mid.className='mid-result-actions';cards[2].after(mid)}
    const compare=document.getElementById('compareTop3Btn');
    const cont=document.getElementById('continueFromResultsBtn');
    if(compare&&compare.parentElement!==mid)mid.appendChild(compare);
    if(cont&&cont.parentElement!==mid)mid.appendChild(cont);
    if(compare)compare.classList.remove('hidden')
  }

  function updateLanguageExtras(){
    const method=document.getElementById('methodologyLink');
    if(method)method.textContent=T('Metod & källor','Methodology & sources');
    const about=document.getElementById('homeAboutLink');
    if(about)about.textContent=T('Om projektet →','About the project →');
    const title=document.querySelector('.creator-title');
    const role=document.querySelector('.creator-role');
    if(title)title.textContent=T('Ett oberoende experiment av Danijel Brakus','An independent experiment by Danijel Brakus');
    if(role)role.textContent='Brand strategist, copywriter & AI enthusiast'
  }

  function removeShareFeature(){document.querySelectorAll('.share-card,.share-status,#shareProfileBtn').forEach(x=>x.remove())}

  function dedupeVetoHelper(){
    const helpers=[...document.querySelectorAll('#screen-acceptability .veto-helper')];helpers.slice(1).forEach(x=>x.remove());
    const buttons=[...document.querySelectorAll('#screen-acceptability #vetoNone')];buttons.slice(1).forEach(x=>x.remove())
  }

  function comparisonAccents(){
    const rows=[...document.querySelectorAll('#compareRows .compare-row')];
    if(!rows.length||typeof vector!=='function'||typeof coords!=='function'||!state.model)return;
    const ranked=(typeof ranking==='function'?ranking():[]);
    const practical=ranked.filter(r=>state.acceptability[r.p]!=='veto');
    const top=(practical.length>=3?practical:ranked).slice(0,3);
    const u=vector(),pc=coords();
    rows.forEach(row=>{
      const cells=[...row.querySelectorAll('.compare-cell')];
      cells.forEach(c=>{c.classList.remove('match-close');delete c.dataset.matchLabel});
      const topic=norm(row.querySelector('.compare-topic strong')?.textContent||'');
      let d=null;
      for(const x of state.model.dimensions){
        const labels=[x.dimension, typeof dimName==='function'?dimName(x.dimension):''];
        if(labels.some(label=>norm(label)===topic)){d=x.dimension;break}
      }
      if(!d||u[d]==null||cells.length<4)return;
      const distances=top.map(r=>Math.abs(u[d]-pc[r.p][d]));
      const min=Math.min(...distances);
      distances.forEach((dist,idx)=>{
        if(Math.abs(dist-min)<0.0001&&cells[idx+1]){
          const party=partyNames[top[idx].p];
          cells[idx+1].classList.add('match-close');
          cells[idx+1].dataset.matchLabel=T(`Närmast dig: ${party}`,`Closest to you: ${party}`)
        }
      })
    })
  }

  function challengeFallback(){
    if(typeof vector!=='function'||typeof coords!=='function'||!state.bank)return;
    const ranked=ranking().filter(r=>state.acceptability[r.p]!=='veto').slice(0,3),pc=coords(),v=vector();
    const unused=state.bank.questions.filter(q=>!state.asked.includes(q.id));
    const qs=unused.map(q=>{const vals=ranked.map(r=>pc[r.p][q.primary_dimension]).filter(Number.isFinite);const spread=vals.length>1?Math.max(...vals)-Math.min(...vals):0;return{q,score:spread+(v[q.primary_dimension]==null?25:0)+(q.type==='discriminator'?12:0)}}).sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.q);
    if(!qs.length)return;state.comparisonQueue=qs.map(q=>q.id);state.viewingEarlyResults=true;const first=qs[0];state.comparisonQueue.shift();if(!state.asked.includes(first.id))state.asked.push(first.id);state.current=first;show('screen-quiz');renderQuestion(first)
  }

  document.addEventListener('click',e=>{const ch=e.target.closest('#challengeResultBtn');if(ch&&!ch.onclick){e.preventDefault();challengeFallback()}},true);

  function polish(){updateLanguageExtras();sourceCleanup();highlightImportant();moveResultActions();comparisonAccents();removeShareFeature();dedupeVetoHelper();removeEmDashes();const meta=document.querySelector('.meta');if(meta)meta.textContent='Sweden 2026 · V2.0 audit candidate'}

  let scheduled=false;const obs=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;polish()})});
  obs.observe(document.body,{childList:true,subtree:true});window.addEventListener('load',polish);polish();
})();