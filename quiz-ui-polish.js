/* Final quiz/result action placement polish - 2026-08-22 */
(function(){
  function placeReviewButton(){
    const review=document.getElementById('reviewAnswersBtn');
    const challenge=document.getElementById('challengeResultBtn');
    if(review&&challenge&&challenge.parentElement){
      if(challenge.nextElementSibling!==review)challenge.after(review);
      review.classList.remove('hidden');
    }
  }

  function removeDuplicateHesitation(){
    document.querySelectorAll('.never-thought').forEach(el=>el.remove());
  }

  function simplifyPriorityStep(){
    const equal=document.getElementById('equalBtn');
    if(equal)equal.remove();
    if(typeof I!=='undefined'){
      if(I.sv)I.sv.priority_body='Välj upp till fyra frågor som betyder mest för dig. Det är helt valfritt. Om du inte väljer något behandlas alla områden lika. De områden du väljer väger tyngre i din matchning.';
      if(I.en)I.en.priority_body='Choose up to four issues that matter most to you. This is completely optional. If you choose none, all areas are treated equally. The areas you select will carry more weight in your match.';
    }
    const body=document.querySelector('#screen-priorities [data-i18n="priority_body"]');
    if(body&&typeof t==='function')body.textContent=t('priority_body');
  }

  function keepBackButtonAvailable(){
    const back=document.getElementById('backBtn');
    if(!back)return;
    back.classList.remove('hidden');
    back.onclick=()=>{
      if(state.history?.length){
        const id=state.history.pop();
        const saved=state.answers[id];
        if(saved?.kind==='dealbreaker'&&saved.dealbreakerDimension&&state.dealbreakers){
          delete state.dealbreakers[saved.dealbreakerDimension];
        }
        delete state.answers[id];
        const q=state.bank.questions.find(x=>x.id===id);
        state.asked=state.asked.filter(x=>x!==id);
        show('screen-quiz');
        renderQuestion(q);
      }else{
        show('screen-priorities');
      }
    };
  }

  if(typeof renderQuestion==='function'){
    const previousRenderQuestion=renderQuestion;
    renderQuestion=function(q){
      const out=previousRenderQuestion(q);
      keepBackButtonAvailable();
      return out;
    };
  }

  function polish(){
    removeDuplicateHesitation();
    placeReviewButton();
    simplifyPriorityStep();
    keepBackButtonAvailable();
  }

  let scheduled=false;
  const observer=new MutationObserver(()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;polish()});
  });
  observer.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',polish);
  document.addEventListener('click',()=>setTimeout(polish,0));
  polish();
})();
