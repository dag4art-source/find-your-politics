/* Small post-audit corrections applied after the main V2 question patch. */
(function(){
  const previous=window.FYP_V2_PATCH_BANK;
  window.FYP_V2_PATCH_BANK=function(state){
    if(previous)previous(state);
    if(!state.bank?.questions||state.bank.v2AuditFixed)return;
    const get=id=>state.bank.questions.find(x=>x.id===id);

    const q44=get('Q044');
    if(q44){
      q44.question='A regulation protects existing workers but makes firms less willing to hire inexperienced young people. What should take priority?';
      q44.question_sv='En regel skyddar de som redan har jobb men gör företag mindre villiga att anställa unga utan erfarenhet. Vad bör väga tyngst?';
      q44.dont_know_explainer='This tests the trade-off between stronger protection for people already in jobs and making it easier for inexperienced people to enter the labour market.';
      const text44={
        A:['Protect existing employees, even if it makes entry into the labour market harder.','Skydda befintliga anställda, även om det gör det svårare för nya att komma in på arbetsmarknaden.',-85],
        B:['Mostly protect existing employees, but allow some extra flexibility for new hiring.','Skydda främst befintliga anställda, men tillåt viss extra flexibilitet vid nyanställningar.',-35],
        C:['Make it easier for employers to hire inexperienced workers, even if employment protection becomes somewhat weaker.','Gör det lättare att anställa personer utan erfarenhet, även om anställningsskyddet blir något svagare.',55],
        D:['Prioritize labour-market entry and employer flexibility, even if existing employees have substantially less protection.','Prioritera inträde på arbetsmarknaden och arbetsgivares flexibilitet, även om befintliga anställda får betydligt svagare skydd.',90]
      };
      q44.answers.forEach(a=>{if(text44[a.key]){a.text=text44[a.key][0];a.text_sv=text44[a.key][1];a.score=text44[a.key][2]}});
    }

    const q59=get('Q059');
    if(q59){
      q59.question='Should unemployment and other income-replacement benefits be allowed to be generous when they are strongly linked to previous work and contributions, while people who cannot work still receive a separate basic safety net?';
      q59.question_sv='Bör arbetslöshetsersättning och andra inkomstrelaterade ersättningar kunna vara generösa när de är starkt kopplade till tidigare arbete och inbetalningar, samtidigt som personer som inte kan arbeta har ett separat grundläggande skyddsnät?';
      q59.dont_know_explainer='This separates the generosity of contribution-based income insurance from the basic safety net for people who cannot work or have not had the opportunity to build up contributions.';
      const text59={
        A:['No; contribution-based benefits should still be relatively limited.','Nej; även inbetalningsbaserade ersättningar bör vara relativt begränsade.',65],
        B:['They can be moderately generous.','De kan vara måttligt generösa.',35],
        C:['Yes; previous work and contributions can justify generous income replacement.','Ja; tidigare arbete och inbetalningar kan motivera generös inkomsttrygghet.',-25],
        D:['Yes; generous contribution-based insurance should be a central part of the welfare system.','Ja; generösa inbetalningsbaserade försäkringar bör vara en central del av välfärdssystemet.',-70]
      };
      q59.answers.forEach(a=>{if(text59[a.key]){a.text=text59[a.key][0];a.text_sv=text59[a.key][1];a.score=text59[a.key][2]}});
    }

    const q60=get('Q060');
    if(q60){
      q60.v2_kind='policy';q60.v2_weight=.65;q60.type='reality_check';q60.tags=['consistency_check'];
      q60.question='Even when a public service works reasonably well, should government generally keep providing it or look for opportunities to leave more to individuals, civil society or markets?';
      q60.question_sv='Även när en offentlig tjänst fungerar ganska bra, bör staten generellt fortsätta driva den eller söka möjligheter att lämna mer till individer, civilsamhälle eller marknad?';
      q60.dont_know_explainer='This is a consistency check on how broad you think the direct role of government should be.';
      const text60={A:['Keep it public; direct public responsibility has value in itself.','Behåll den offentlig; direkt offentligt ansvar har ett värde i sig.',-85],B:['Usually keep it public unless there is a clear reason to change.','Behåll den vanligtvis offentlig om det inte finns tydliga skäl att ändra.',-30],C:['Consider non-state alternatives when they can deliver the same goals well.','Överväg andra lösningar när de kan uppnå samma mål lika bra.',55],D:['Actively look for ways to reduce direct government provision.','Sök aktivt sätt att minska statens direkta utförarroll.',90]};
      q60.answers.forEach(a=>{if(text60[a.key]){a.text=text60[a.key][0];a.text_sv=text60[a.key][1];a.score=text60[a.key][2]}})
    }
    state.bank.v2AuditFixed=true;
  };
})();