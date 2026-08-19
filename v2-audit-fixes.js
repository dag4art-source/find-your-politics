/* Small post-audit correction applied after the main V2 question patch. */
(function(){
  const previous=window.FYP_V2_PATCH_BANK;
  window.FYP_V2_PATCH_BANK=function(state){
    if(previous)previous(state);
    if(!state.bank?.questions||state.bank.v2AuditFixed)return;
    const q=state.bank.questions.find(x=>x.id==='Q060');
    if(q){
      q.v2_kind='policy';q.v2_weight=.65;q.type='reality_check';q.tags=['consistency_check'];
      q.question='Even when a public service works reasonably well, should government generally keep providing it or look for opportunities to leave more to individuals, civil society or markets?';
      q.question_sv='Även när en offentlig tjänst fungerar ganska bra, bör staten generellt fortsätta driva den eller söka möjligheter att lämna mer till individer, civilsamhälle eller marknad?';
      q.dont_know_explainer='This is a consistency check on how broad you think the direct role of government should be.';
      const text={A:['Keep it public; direct public responsibility has value in itself.','Behåll den offentlig; direkt offentligt ansvar har ett värde i sig.',-85],B:['Usually keep it public unless there is a clear reason to change.','Behåll den vanligtvis offentlig om det inte finns tydliga skäl att ändra.',-30],C:['Consider non-state alternatives when they can deliver the same goals well.','Överväg andra lösningar när de kan uppnå samma mål lika bra.',55],D:['Actively look for ways to reduce direct government provision.','Sök aktivt sätt att minska statens direkta utförarroll.',90]};
      q.answers.forEach(a=>{if(text[a.key]){a.text=text[a.key][0];a.text_sv=text[a.key][1];a.score=text[a.key][2]}})
    }
    state.bank.v2AuditFixed=true;
  };
})();