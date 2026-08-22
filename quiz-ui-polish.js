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

  function polish(){
    removeDuplicateHesitation();
    placeReviewButton();
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
