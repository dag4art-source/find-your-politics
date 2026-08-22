/* Swedish UI language polish - 2026-08-22 */
(function(){
  if(typeof I!=='undefined' && I.sv){
    Object.assign(I.sv,{
      home_eyebrow:'Sverige 2026 · Hitta din politiska profil',
      home_title:'Du behöver inte kunna politik för att veta vad du tycker.',
      home_subtitle:'Ett blint test som anpassar sig efter dina svar. Först hjälper det dig att förstå vad du själv tycker, sedan visar det vilka svenska partier som ligger närmast.',
      what_body:'Ett test som hjälper dig hitta din politiska profil. Du svarar på frågor om hur du tycker att samhället bör fungera. Partinamnen hålls dolda tills du får resultatet.',
      how_body:'Testet börjar brett och anpassar sig sedan efter dina svar. Det ställer fler frågor bara när de faktiskt kan göra resultatet tydligare. Du får se var du håller med partierna, var ni skiljer er och vilka konflikter som kan spela roll.',
      beginner_body:'Håll det enkelt. Jag följer inte politik så noga och vill ha vardagligt språk och tydliga förklaringar.',
      intermediate_body:'Jag kan grunderna och är bekväm med en del politiska detaljer.',
      advanced_body:'Jag följer politik och är bekväm med mer komplicerade avvägningar.',
      priority_body:'Välj upp till fyra. De väger tyngre i din matchning. Du får fortfarande frågor om andra områden, eftersom en fråga kan vara lågprioriterad för dig men ändå bli en viktig skiljelinje.',
      checkpoint:'Mellankoll',
      results_intro:'Två mått hjälper dig att förstå resultatet. Det ena visar hur nära du och partiet ligger i sakfrågorna. Det andra visar hur väl partiet fungerar som ett realistiskt alternativ för dig när stora konflikter och partier du själv har uteslutit räknas in.',
      policy_alignment_help:'Hur nära dina svar ligger partiets politiska positioner i sakfrågorna.',
      voting_fit_help:'Din sakpolitiska matchning justerad för stora konflikter och partier du själv har uteslutit.',
      method_note:'Det här är en experimentell modell baserad på politiska positioner. Poängen visar politisk närhet, inte en objektiv sanning och inte ett råd om hur du bör rösta.',
      best_match:'Partiet som passar dig bäst i praktiken',
      why_best:'Varför det ligger närmast dig',
      where_align:'Där ni tycker lika',
      where_disagree:'Där ni skiljer er',
      excluded:'Du har uteslutit partiet'
    });
  }

  function polishSwedishUi(){
    const isSv=typeof state!=='undefined' && state.lang==='sv';
    document.title=isSv?'Find Your Politics - Sverige 2026':'Find Your Politics - Sweden 2026';

    const meta=document.querySelector('.meta');
    if(meta)meta.textContent=isSv?'Sverige 2026 · V2.0 granskningsversion':'Sweden 2026 · V2.0 audit candidate';

    const switcher=document.querySelector('.language-switch');
    if(switcher)switcher.setAttribute('aria-label',isSv?'Språk':'Language');

    const role=document.querySelector('.creator-role');
    if(role)role.textContent=isSv?'Varumärkesstrateg, copywriter och AI-entusiast':'Brand strategist, copywriter & AI enthusiast';

    const legend=[...document.querySelectorAll('#screen-results .score-legend strong')];
    if(legend[0])legend[0].textContent=isSv?'Sakpolitisk matchning':'Policy Alignment';
    if(legend[1])legend[1].textContent=isSv?'Praktisk matchning':'Voting Fit';

    document.querySelectorAll('#screen-results .v2-metric > span').forEach(el=>{
      const s=el.textContent.trim();
      if(s==='Policy Alignment'||s==='Sakpolitisk matchning')el.textContent=isSv?'Sakpolitisk matchning':'Policy Alignment';
      if(s==='Voting Fit'||s==='Praktisk matchning')el.textContent=isSv?'Praktisk matchning':'Voting Fit';
    });

    if(isSv){
      document.querySelectorAll('#screen-results .v2-metric em').forEach(el=>{
        const m=el.textContent.match(/^([0-9.,]+)\s+poäng konfliktavdrag$/i);
        if(m)el.textContent=`Konfliktavdrag: ${m[1]} poäng`;
      });
    }

    document.querySelectorAll('[data-i18n="trust_3"]').forEach(el=>{
      if(isSv && el.textContent==='100% privat')el.textContent='100 % privat';
    });
  }

  if(typeof applyLang==='function'){
    const previousApplyLang=applyLang;
    applyLang=function(){
      const out=previousApplyLang();
      polishSwedishUi();
      return out;
    };
  }

  let scheduled=false;
  const observer=new MutationObserver(()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;polishSwedishUi()});
  });
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',polishSwedishUi);
  polishSwedishUi();
})();
