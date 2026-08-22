/* Review and change answered questions after results */
(function(){
  const isSv=()=>state.lang==='sv';
  const T=(sv,en)=>isSv()?sv:en;

  function ensureScreen(){
    if(document.getElementById('screen-review'))return;
    const section=document.createElement('section');
    section.id='screen-review';
    section.className='screen review-screen';
    section.innerHTML=`
      <p class="eyebrow" id="reviewEyebrow"></p>
      <h1 id="reviewTitle"></h1>
      <p class="muted review-intro" id="reviewIntro"></p>
      <div id="reviewList" class="review-list"></div>
      <div class="review-actions">
        <button id="reviewBackBtn" class="primary"></button>
      </div>
      <div id="reviewUpdated" class="review-updated" aria-live="polite"></div>`;
    const footer=document.querySelector('.site-footer');
    footer.parentNode.insertBefore(section,footer);
    document.getElementById('reviewBackBtn').onclick=()=>results();
  }

  function answerLabel(q,a){
    return isSv() ? (a.text_sv||a.text||'') : (a.text||'');
  }

  function sameScores(a,b){
    const ak=Object.keys(a||{}).sort(),bk=Object.keys(b||{}).sort();
    if(ak.length!==bk.length||ak.some((k,i)=>k!==bk[i]))return false;
    return ak.every(k=>Number(a[k])===Number(b[k]));
  }

  function selectedKey(q,saved){
    if(!saved)return null;
    if(saved.kind==='skip')return 'SKIP';
    if(saved.kind==='dealbreaker'){
      return q.answers.find(a=>a.dealbreaker_sensitivity===saved.sensitivity)?.key||null;
    }
    if(saved.kind==='diagnostic'){
      return q.answers.find(a=>Number(a.score)===Number(saved.diagnosticScore))?.key||null;
    }
    if(saved.scores){
      const byScores=q.answers.find(a=>a.scores&&sameScores(a.scores,saved.scores));
      if(byScores)return byScores.key;
    }
    return q.answers.find(a=>Number(a.score)===Number(saved.score))?.key||null;
  }

  function saveAnswer(q,a){
    state.dealbreakers=state.dealbreakers||{};
    const previous=state.answers[q.id];
    if(previous?.kind==='dealbreaker'&&previous.dealbreakerDimension){
      delete state.dealbreakers[previous.dealbreakerDimension];
    }
    const weight=Number.isFinite(q.v2_weight)?q.v2_weight:(q.type==='reality_check' ? .8 : 1);
    if(q.v2_kind==='dealbreaker'){
      state.dealbreakers[q.dealbreaker_dimension]=a.dealbreaker_sensitivity;
      state.answers[q.id]={score:null,dimension:q.primary_dimension,kind:'dealbreaker',dealbreakerDimension:q.dealbreaker_dimension,sensitivity:a.dealbreaker_sensitivity,weight:0};
    } else if(q.v2_kind==='diagnostic'){
      state.answers[q.id]={score:null,dimension:q.primary_dimension,kind:'diagnostic',diagnosticScore:a.score,weight:0};
    } else if(a.scores){
      state.answers[q.id]={score:a.score,dimension:q.primary_dimension,scores:{...a.scores},kind:'policy',weight};
    } else {
      state.answers[q.id]={score:a.score,dimension:q.primary_dimension,scores:{[q.primary_dimension]:a.score},kind:'policy',weight};
    }
  }

  function saveSkip(q){
    const previous=state.answers[q.id];
    if(previous?.kind==='dealbreaker'&&previous.dealbreakerDimension&&state.dealbreakers){
      delete state.dealbreakers[previous.dealbreakerDimension];
    }
    state.answers[q.id]={score:null,dimension:q.primary_dimension,kind:'skip',weight:0};
  }

  function answeredQuestions(){
    if(window.FYP_V2_PATCH_BANK)window.FYP_V2_PATCH_BANK(state);
    const order=new Map((state.asked||[]).map((id,i)=>[id,i]));
    return Object.keys(state.answers||{})
      .map(id=>state.bank?.questions?.find(q=>q.id===id))
      .filter(Boolean)
      .sort((a,b)=>(order.get(a.id)??999)-(order.get(b.id)??999));
  }

  function renderReview(){
    ensureScreen();
    if(window.FYP_V2_PATCH_BANK)window.FYP_V2_PATCH_BANK(state);
    document.getElementById('reviewEyebrow').textContent=T('Dina svar','Your answers');
    document.getElementById('reviewTitle').textContent=T('Granska och ändra dina svar','Review and change your answers');
    document.getElementById('reviewIntro').textContent=T(
      'Här kan du gå tillbaka till frågorna du redan har svarat på. Ändrar du ett svar räknas din profil om direkt när du går tillbaka till resultatet.',
      'Here you can revisit the questions you already answered. If you change an answer, your profile is recalculated when you return to the results.'
    );
    document.getElementById('reviewBackBtn').textContent=T('Tillbaka till uppdaterat resultat →','Back to updated result →');
    document.getElementById('reviewUpdated').textContent='';

    const list=document.getElementById('reviewList');
    list.innerHTML='';
    answeredQuestions().forEach((q,index)=>{
      const saved=state.answers[q.id],chosen=selectedKey(q,saved);
      const card=document.createElement('article');
      card.className='review-card';
      const opts=q.answers.filter(a=>a.key!=='E').map(a=>
        `<button type="button" class="review-option${chosen===a.key?' selected':''}" data-key="${a.key}">${answerLabel(q,a)}</button>`
      ).join('');
      card.innerHTML=`
        <div class="review-card-head"><small>${index+1}. ${typeof categoryText==='function'?categoryText(q):q.category}</small><small>${q.id}</small></div>
        <p class="review-question">${isSv()?(q.question_sv||q.question):q.question}</p>
        <div class="review-options">${opts}<button type="button" class="review-option skip-option${chosen==='SKIP'?' selected':''}" data-key="SKIP">${T('Jag är osäker / inget av dessa passar','I’m not sure / none of these fit')}</button></div>`;
      card.querySelectorAll('.review-option').forEach(btn=>{
        btn.onclick=()=>{
          const key=btn.dataset.key;
          if(key==='SKIP')saveSkip(q);
          else {
            const a=q.answers.find(x=>x.key===key);
            if(a)saveAnswer(q,a);
          }
          card.querySelectorAll('.review-option').forEach(x=>x.classList.remove('selected'));
          btn.classList.add('selected');
          document.getElementById('reviewUpdated').textContent=T('Svaret är ändrat. Resultatet räknas om när du går tillbaka.','Answer changed. Your result will be recalculated when you go back.');
        };
      });
      list.appendChild(card);
    });
    show('screen-review');
  }

  function ensureButton(){
    const results=document.getElementById('screen-results');
    if(!results)return;
    let btn=document.getElementById('reviewAnswersBtn');
    if(!btn){
      btn=document.createElement('button');
      btn.id='reviewAnswersBtn';
      btn.className='ghost';
      btn.onclick=renderReview;
      const actions=results.querySelector('.result-actions');
      const restart=document.getElementById('restartBtn');
      if(actions)actions.insertBefore(btn,restart||null);
    }
    btn.textContent=T('Granska mina svar','Review my answers');
  }

  const previousResults=results;
  results=function(){
    previousResults();
    ensureButton();
  };

  if(typeof applyLang==='function'){
    const previousApplyLang=applyLang;
    applyLang=function(){
      const out=previousApplyLang();
      ensureButton();
      if(document.getElementById('screen-review')?.classList.contains('active'))renderReview();
      return out;
    };
  }

  ensureScreen();
  ensureButton();
})();
