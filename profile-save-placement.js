/* Keep the PNG save action directly under the political profile on results. */
(function(){
  function placeSaveCard(){
    const results=document.getElementById('screen-results');
    if(!results?.classList.contains('active'))return;
    const profile=results.querySelector('.profile-summary');
    const card=document.getElementById('saveResultCard');
    if(!profile||!card)return;
    if(profile.nextElementSibling!==card)profile.after(card);
  }

  let scheduled=false;
  const observer=new MutationObserver(()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;placeSaveCard()});
  });
  observer.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',placeSaveCard);
  document.addEventListener('click',()=>setTimeout(placeSaveCard,0));
  placeSaveCard();
})();
