/* Keep dynamically rendered screens in sync when switching SV / EN. */
(function(){
  if(typeof applyLang!=='function')return;

  const active=id=>document.getElementById(id)?.classList.contains('active');

  function refreshAcceptability(){
    if(typeof acceptability!=='function')return;
    const saved={};
    document.querySelectorAll('#partyAcceptability select').forEach(s=>saved[s.dataset.party]=s.value);
    acceptability();
    document.querySelectorAll('#partyAcceptability select').forEach(s=>{
      if(saved[s.dataset.party]!=null)s.value=saved[s.dataset.party];
    });
  }

  function refreshCheckpoint(){
    if(typeof checkpoint!=='function')return;
    const current=state.checkpointCount||0;
    /* checkpoint() increments the counter. Rewind temporarily so switching
       language redraws the same checkpoint instead of advancing its copy. */
    state.checkpointCount=Math.max(0,current-1);
    checkpoint();
    state.checkpointCount=current;
  }

  function refreshDynamicScreen(){
    if(active('screen-results') && typeof results==='function'){
      document.getElementById('saveResultCard')?.remove();
      results();
      return;
    }
    if(active('screen-acceptability')){
      refreshAcceptability();
      return;
    }
    if(active('screen-checkpoint')){
      refreshCheckpoint();
      return;
    }
    /* Quiz and comparison are already re-rendered by their own applyLang hooks. */
  }

  const previousApplyLang=applyLang;
  applyLang=function(){
    const out=previousApplyLang();
    requestAnimationFrame(refreshDynamicScreen);
    return out;
  };
})();
