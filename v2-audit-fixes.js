/* Small post-audit corrections applied after the main V2 question patch. */
(function(){
  const previous=window.FYP_V2_PATCH_BANK;
  window.FYP_V2_PATCH_BANK=function(state){
    if(previous)previous(state);
    if(!state.bank?.questions||state.bank.v2AuditFixed)return;
    const get=id=>state.bank.questions.find(x=>x.id===id);
    const rewrite=(id,question,questionSv,answers)=>{
      const q=get(id);if(!q)return;
      if(question)q.question=question;if(questionSv)q.question_sv=questionSv;
      q.answers.forEach(a=>{const x=answers?.[a.key];if(x){a.text=x[0];a.text_sv=x[1];if(Number.isFinite(x[2]))a.score=x[2]}});
    };

    /* Reference-point audit: make comparative answer scales explicit where the old wording
       could leave users asking "higher/lower than what?". Scores and dimensions are unchanged. */
    rewrite('Q003',
      "Compared with today's system, how should Sweden tax high employment incomes?",
      'Jämfört med dagens system, hur bör Sverige beskatta höga arbetsinkomster?',{
        A:['Increase tax on high employment incomes substantially.','Höj skatten på höga arbetsinkomster betydligt.',-90],
        B:["Keep tax on high employment incomes broadly around today's level.",'Behåll skatten på höga arbetsinkomster ungefär på dagens nivå.',-25],
        C:['Lower tax on high employment incomes somewhat.','Sänk skatten på höga arbetsinkomster något.',55],
        D:['Lower tax on high employment incomes substantially.','Sänk skatten på höga arbetsinkomster betydligt.',95]
      });

    rewrite('Q006',
      'What role should the state have as an owner of companies?',
      'Vilken roll bör staten ha som ägare av företag?',{
        A:['The state should own a broad range of strategically important companies.','Staten bör äga ett brett urval av strategiskt viktiga företag.',-85],
        B:['The state should own selected essential or strategic companies case by case.','Staten bör äga vissa viktiga eller strategiska företag från fall till fall.',-25],
        C:['Most commercial activity should be privately owned.','Det mesta kommersiella bör vara privatägt.',60],
        D:['The state should own very few commercial companies.','Staten bör äga mycket få kommersiella företag.',95]
      });

    rewrite('Q007',
      'Compared with today, how should the balance between employment protection and employer flexibility change?',
      'Jämfört med i dag, hur bör balansen mellan anställningsskydd och arbetsgivares flexibilitet förändras?',{
        A:['Strengthen employee protections substantially.','Stärk anställningsskyddet betydligt.',-90],
        B:["Keep roughly today's balance.",'Behåll ungefär dagens balans.',-20],
        C:['Make hiring, restructuring and dismissal somewhat easier.','Gör det något lättare att anställa, omorganisera och säga upp.',55],
        D:['Give employers substantially more flexibility.','Ge arbetsgivare betydligt större flexibilitet.',95]
      });

    rewrite('Q017',
      "Compared with today, how restrictive should Sweden's asylum policy be?",
      'Jämfört med i dag, hur restriktiv bör Sveriges asylpolitik vara?',{
        A:['More open than today.','Mer öppen än i dag.',-90],
        B:["Keep roughly today's level while strongly protecting genuine asylum claims.",'Behåll ungefär dagens nivå och ett starkt skydd för personer med verkliga asylskäl.',-25],
        C:['More restrictive than today.','Mer restriktiv än i dag.',60],
        D:['Reduce asylum migration to a minimum for an extended period.','Minska asylinvandringen till ett minimum under en längre tid.',95]
      });

    rewrite('Q018',
      'Compared with today, how open should Sweden be to skilled workers from outside the EU?',
      'Jämfört med i dag, hur öppet bör Sverige vara för kvalificerad arbetskraft utanför EU?',{
        A:['Much more restrictive than today.','Mycket mer restriktiv än i dag.',-90],
        B:['Somewhat more restrictive, mainly allowing clear shortage occupations.','Något mer restriktiv och främst tillåta yrken med tydlig arbetskraftsbrist.',-25],
        C:["Keep broadly today's openness for qualified workers with proper employment terms.",'Behåll ungefär dagens öppenhet för kvalificerad arbetskraft med korrekta villkor.',60],
        D:['Become more open and actively attract substantially more international talent.','Bli mer öppen och arbeta aktivt för att locka betydligt mer internationell kompetens.',95]
      });

    rewrite('Q028',
      'How much school choice should families have?',
      'Hur stor valfrihet bör familjer ha när de väljer skola?',{
        A:['Limited choice; equal access and school planning should take priority.','Begränsad valfrihet; jämlik tillgång och skolplanering bör väga tyngst.',-90],
        B:['Some choice, under tight common rules.','Viss valfrihet, under strikta gemensamma regler.',-35],
        C:['Broad choice, with strong quality and admissions rules.','Bred valfrihet, med starka kvalitets- och antagningsregler.',55],
        D:['Very broad choice and competition between schools.','Mycket bred valfrihet och konkurrens mellan skolor.',90]
      });

    rewrite('Q038',
      "Over the next few years, how should Sweden's defence spending develop from today's level?",
      'Hur bör Sveriges försvarsutgifter utvecklas från dagens nivå under de närmaste åren?',{
        A:["Reduce spending from today's level and prioritize domestic needs.",'Minska utgifterna från dagens nivå och prioritera andra inhemska behov.',-90],
        B:['Keep spending around the level needed to meet core commitments, avoiding major additional increases.','Behåll utgifterna kring den nivå som krävs för grundläggande åtaganden och undvik stora ytterligare ökningar.',-25],
        C:['Increase spending substantially given the security environment.','Öka utgifterna betydligt med tanke på säkerhetsläget.',60],
        D:["Make defence one of the state's highest spending priorities.",'Gör försvaret till en av statens allra högsta utgiftsprioriteringar.',95]
      });

    rewrite('Q042',
      'How broad should the role of government be?',
      'Hur omfattande bör statens roll vara?',{
        A:['Government should take a broad role in solving social and economic problems.','Staten bör ha en bred roll i att lösa sociala och ekonomiska problem.',-90],
        B:['Government should intervene where markets or institutions clearly fail.','Staten bör ingripa där marknader eller institutioner tydligt misslyckas.',-25],
        C:['Government should focus on core functions and otherwise leave more to individuals and markets.','Staten bör fokusera på kärnuppgifter och i övrigt lämna mer till individer och marknader.',60],
        D:['Government should have a much smaller role overall.','Staten bör ha en mycket mindre roll totalt sett.',95]
      });

    /* Construct-purity review: narrow four questions so each answer scale maps more cleanly
       to its model dimension. Scores and party coordinates remain unchanged. */
    const q4=get('Q004');
    if(q4){
      q4.question="Compared with today's system, how heavily should Sweden tax large accumulated assets, such as expensive property and very large fortunes?";
      q4.question_sv='Jämfört med dagens system, hur hårt bör Sverige beskatta stora samlade tillgångar, till exempel dyra fastigheter och mycket stora förmögenheter?';
      q4.dont_know_explainer='This is about the overall tax burden on large accumulated assets rather than tax on wages. Different asset taxes can be designed differently, so this question only estimates the broad direction of your preference.';
      const t4={
        A:["Tax large accumulated assets substantially more than today.",'Beskatta stora samlade tillgångar betydligt mer än i dag.',-95],
        B:["Tax them somewhat more than today.",'Beskatta dem något mer än i dag.',-30],
        C:["Keep the overall tax burden on large assets relatively low and roughly around today's direction.",'Håll den samlade beskattningen av stora tillgångar relativt låg och ungefär i dagens riktning.',55],
        D:["Reduce the overall tax burden on large assets further.",'Sänk den samlade beskattningen av stora tillgångar ytterligare.',90]
      };q4.answers.forEach(a=>{if(t4[a.key]){a.text=t4[a.key][0];a.text_sv=t4[a.key][1];a.score=t4[a.key][2]}});
    }

    const q10=get('Q010');
    if(q10){
      q10.question='When someone who has been working loses their job, how much of their previous income should unemployment insurance replace?';
      q10.question_sv='När någon som har arbetat förlorar jobbet, hur stor del av den tidigare inkomsten bör arbetslöshetsförsäkringen ersätta?';
      q10.dont_know_explainer='This question focuses on income protection during unemployment. Requirements to look for work are a separate issue.';
      const t10={
        A:['A large share, so income falls relatively little while the person looks for work.','En stor andel, så att inkomsten minskar relativt lite medan personen söker arbete.',-95],
        B:['A fairly large share, but clearly less than normal earnings.','En ganska stor andel, men tydligt mindre än den vanliga arbetsinkomsten.',-35],
        C:['A more limited share, leaving a clear financial difference between work and unemployment.','En mer begränsad andel, så att det finns en tydlig ekonomisk skillnad mellan arbete och arbetslöshet.',55],
        D:['A low share, with strong emphasis on the financial incentive to return to work.','En låg andel, med stark betoning på det ekonomiska incitamentet att återgå i arbete.',95]
      };q10.answers.forEach(a=>{if(t10[a.key]){a.text=t10[a.key][0];a.text_sv=t10[a.key][1];a.score=t10[a.key][2]}});
    }

    const q11=get('Q011');
    if(q11){
      q11.question='When illness genuinely prevents someone from working, how should sickness insurance balance income protection against strict eligibility and return-to-work requirements?';
      q11.question_sv='När sjukdom faktiskt hindrar någon från att arbeta, hur bör sjukförsäkringen balansera inkomsttrygghet mot strikta villkor och krav på återgång i arbete?';
      q11.dont_know_explainer='This asks about the overall balance between protecting income during medically justified absence and using stricter rules to encourage or require a return to work when possible.';
      const t11={
        A:['Prioritize strong income protection and relatively accessible eligibility when illness is medically supported.','Prioritera stark inkomsttrygghet och relativt lättillgänglig ersättning när sjukdomen är medicinskt styrkt.',-90],
        B:['Keep a strong safety net, with clear medical checks and rehabilitation support.','Behåll ett starkt skyddsnät, med tydliga medicinska kontroller och stöd för rehabilitering.',-30],
        C:['Use stricter eligibility and stronger return-to-work requirements when work may be possible.','Använd stramare villkor och starkare krav på återgång i arbete när arbete kan vara möjligt.',50],
        D:['Use very strict eligibility and make benefits more limited when a return to work is considered possible.','Använd mycket strikta villkor och mer begränsad ersättning när återgång i arbete bedöms vara möjlig.',90]
      };q11.answers.forEach(a=>{if(t11[a.key]){a.text=t11[a.key][0];a.text_sv=t11[a.key][1];a.score=t11[a.key][2]}});
    }

    const q24=get('Q024');
    if(q24){
      q24.question='In general, how should rents for ordinary rental apartments be set?';
      q24.question_sv='Hur bör hyror för vanliga hyresrätter i allmänhet bestämmas?';
      q24.dont_know_explainer='This isolates the rent-setting principle itself: stronger collective/regulatory control versus rents that respond more directly to market demand. Effects on housing construction are tested separately.';
      const t24={
        A:['Mostly through strong regulation or collective rent-setting, with limited influence from market demand.','Främst genom stark reglering eller kollektiv hyressättning, med begränsad påverkan från marknadens efterfrågan.',-95],
        B:['Mostly regulated, but with somewhat more room for differences between locations and apartments.','Främst reglerade, men med något större utrymme för skillnader mellan lägen och bostäder.',-40],
        C:['More market-responsive rents, while keeping meaningful tenant protections.','Mer marknadsanpassade hyror, men med tydliga skydd för hyresgäster.',55],
        D:['Mostly set by market demand, with only basic tenant protections.','Främst bestämda av marknadens efterfrågan, med endast grundläggande hyresgästskydd.',95]
      };q24.answers.forEach(a=>{if(t24[a.key]){a.text=t24[a.key][0];a.text_sv=t24[a.key][1];a.score=t24[a.key][2]}});
    }

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