/* Confirmed Reddit feedback fixes - 2026-08-22 */
(function(){
  const sv=()=>state.lang==='sv';
  const tx=(a,b)=>sv()?a:b;
  let questionReadyAt=0;

  /* 1) Selected priority areas must actually appear early in the adaptive test. */
  const previousChooseNext=chooseNext;
  chooseNext=function(){
    if(state.priorities?.length && Object.values(state.answers).filter(a=>a?.kind==='policy').length<8){
      const v=vector();
      for(const priority of state.priorities){
        const dims=priorityMap[priority]||[];
        const covered=dims.some(d=>v[d]!=null);
        if(covered)continue;
        const candidates=state.bank.questions.filter(q=>
          !state.asked.includes(q.id) &&
          !q.tags?.includes('dealbreaker_probe') &&
          dims.includes(q.primary_dimension) &&
          (typeof difficultyAllowed!=='function' || difficultyAllowed(q))
        );
        if(candidates.length){
          candidates.sort((a,b)=>{
            const typeA=a.type==='discovery'?0:a.type==='discriminator'?1:2;
            const typeB=b.type==='discovery'?0:b.type==='discriminator'?1:2;
            const diff=x=>x.difficulty==='easy'?0:x.difficulty==='medium'?1:2;
            return typeA-typeB || diff(a)-diff(b);
          });
          return candidates[0];
        }
      }
    }
    return previousChooseNext();
  };

  /* 2) Make the non-scoring option impossible to miss. */
  const previousRenderQuestion=renderQuestion;
  renderQuestion=function(q){
    const out=previousRenderQuestion(q);
    const answers=document.getElementById('answers');
    if(answers && !answers.querySelector('.no-fit-answer')){
      const b=document.createElement('button');
      b.className='no-fit-answer';
      b.type='button';
      b.innerHTML=tx(
        'Jag är osäker / inget av dessa passar<small>Det påverkar inte ditt resultat.</small>',
        'I’m not sure / none of these fit<small>This will not affect your result.</small>'
      );
      b.onclick=()=>document.getElementById('skipQuestionBtn')?.click();
      answers.appendChild(b);
    }
    questionReadyAt=performance.now()+350;
    return out;
  };

  /* Prevent an extremely fast second tap from answering the newly rendered question. */
  document.addEventListener('click',e=>{
    if(!e.target.closest('.answer,.no-fit-answer'))return;
    if(performance.now()<questionReadyAt){e.preventDefault();e.stopImmediatePropagation()}
  },true);

  /* 3) No live party-match hints during the blind part of the test. */
  function removeLiveMatchHints(){
    document.querySelectorAll('#screen-quiz .insight-banner.enhanced').forEach(b=>{
      b.classList.add('hidden');b.textContent='';b.classList.remove('enhanced');
    });
  }

  /* 4) Comparison: party label inside every rectangle + human explanation of the dimension. */
  const dimExplain={
    market_economy:{sv:'Hur mycket ekonomin bör styras av staten jämfört med marknaden.',en:'How much the economy should be directed by government versus markets.'},
    tax_work_income:{sv:'Hur högt Sverige bör beskatta inkomster från arbete.',en:'How heavily Sweden should tax income from work.'},
    tax_wealth_property:{sv:'Hur stora förmögenheter, tillgångar och dyr egendom bör beskattas.',en:'How large fortunes, assets and expensive property should be taxed.'},
    welfare_qualification:{sv:'Hur lätt eller svårt det bör vara att kvalificera sig för välfärdsförmåner.',en:'How easy or difficult it should be to qualify for welfare benefits.'},
    unemployment_security:{sv:'Hur generös ekonomisk trygghet vid arbetslöshet bör vara.',en:'How generous income protection during unemployment should be.'},
    sickness_social_insurance:{sv:'Balansen mellan stark sjukförsäkring, villkor och återgång i arbete.',en:'The balance between strong sickness insurance, eligibility rules and return to work.'},
    labour_flexibility:{sv:'Balansen mellan anställningsskydd och arbetsgivares flexibilitet.',en:'The balance between employment protection and employer flexibility.'},
    inequality_focus:{sv:'Hur mycket politiken bör prioritera mindre ekonomiska skillnader.',en:'How strongly policy should prioritize reducing economic inequality.'},
    public_ownership:{sv:'Hur stor roll staten bör ha som ägare av företag.',en:'How large a role government should have as an owner of companies.'},
    crime_punishment:{sv:'Balansen mellan hårdare straff, förebyggande arbete och rehabilitering.',en:'The balance between tougher punishment, prevention and rehabilitation.'},
    surveillance_powers:{sv:'Hur mycket övervakning och polisiära befogenheter som är rimliga för ökad säkerhet.',en:'How much surveillance and police power is justified in the name of security.'},
    asylum_migration:{sv:'Hur öppen eller restriktiv Sveriges asylpolitik bör vara.',en:'How open or restrictive Sweden’s asylum policy should be.'},
    skilled_migration:{sv:'Hur öppet Sverige bör vara för internationell arbetskraft och kompetens.',en:'How open Sweden should be to international workers and skilled migration.'},
    citizenship_requirements:{sv:'Hur strikta krav som bör gälla för svenskt medborgarskap.',en:'How strict the requirements for Swedish citizenship should be.'},
    integration:{sv:'Vad lyckad integration bör kräva utöver att följa lagen.',en:'What successful integration should require beyond obeying the law.'},
    housing_supply:{sv:'Hur fler bostäder bör skapas och hur mycket regler som bör begränsa byggandet.',en:'How more housing should be created and how much regulation should constrain building.'},
    rent_regulation:{sv:'Hur mycket hyror bör regleras jämfört med att bestämmas av marknaden.',en:'How much rents should be regulated versus determined by the market.'},
    healthcare_choice:{sv:'Hur stor valfrihet och privat medverkan som bör finnas i skattefinansierad vård.',en:'How much patient choice and private provision should exist in tax-funded healthcare.'},
    education_choice:{sv:'Hur mycket familjer bör kunna välja skola jämfört med mer central styrning.',en:'How much families should be able to choose schools versus stronger central control.'},
    school_discipline:{sv:'Hur mycket skolan bör betona ordning, krav och disciplin.',en:'How strongly schools should emphasize order, expectations and discipline.'},
    welfare_private_profit:{sv:'Om privata aktörer bör få göra vinst i skattefinansierad välfärd.',en:'Whether private providers should be allowed to profit from tax-funded welfare.'},
    climate_cost_sensitivity:{sv:'Hur mycket kostnader hushåll och företag bör bära för snabbare klimatåtgärder.',en:'How much cost households and businesses should bear for faster climate action.'},
    nuclear_energy:{sv:'Vilken roll kärnkraft bör ha i Sveriges framtida energisystem.',en:'What role nuclear power should have in Sweden’s future energy system.'},
    eu_integration:{sv:'Hur mycket makt Sverige bör dela med EU jämfört med nationell kontroll.',en:'How much authority Sweden should share with the EU versus keep nationally.'},
    social_values:{sv:'Hur aktiv staten bör vara i frågor om familj, relationer och sociala normer.',en:'How active government should be on family, relationships and social norms.'},
    state_scope:{sv:'Hur bred statens roll bör vara jämfört med individer, marknad och civilsamhälle.',en:'How broad government’s role should be versus individuals, markets and civil society.'},
    defence_spending:{sv:'Hur högt försvar bör prioriteras jämfört med andra offentliga utgifter.',en:'How highly defence should be prioritized relative to other public spending.'}
  };

  function findDimensionFromRow(row){
    const label=(row.querySelector('.compare-topic strong')?.textContent||'').trim().toLowerCase();
    if(!state.model)return null;
    return state.model.dimensions.map(x=>x.dimension).find(d=>{
      const name=(typeof dimName==='function'?dimName(d):d).trim().toLowerCase();
      return name===label || d.toLowerCase()===label;
    })||null;
  }

  function improveComparison(){
    const rows=[...document.querySelectorAll('#compareRows .compare-row')];
    if(!rows.length)return;
    const ranked=ranking();
    const practical=ranked.filter(r=>state.acceptability[r.p]!=='veto');
    const top=(practical.length>=3?practical:ranked).slice(0,3);
    rows.forEach(row=>{
      const d=findDimensionFromRow(row);
      const topic=row.querySelector('.compare-topic');
      if(d && topic && !topic.querySelector('.dimension-explainer')){
        const s=document.createElement('span');s.className='dimension-explainer';s.textContent=dimExplain[d]?.[state.lang]||'';topic.appendChild(s)
      }
      const cells=[...row.querySelectorAll('.compare-cell')];
      const labels=[tx('Du','You'),...top.map(r=>partyNames[r.p])];
      cells.forEach((cell,i)=>{
        if(cell.querySelector('.compare-cell-party'))return;
        const tag=document.createElement('small');tag.className='compare-cell-party';tag.textContent=labels[i]||'';cell.prepend(tag)
      })
    })
  }

  /* 5) Save a private result/profile image locally as PNG. */
  function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines=99){
    const words=String(text||'').split(/\s+/);let line='',lines=0;
    for(let i=0;i<words.length;i++){
      const test=line?line+' '+words[i]:words[i];
      if(ctx.measureText(test).width>maxWidth && line){ctx.fillText(line,x,y);y+=lineHeight;lines++;line=words[i];if(lines>=maxLines)return y}
      else line=test;
    }
    if(line&&lines<maxLines){ctx.fillText(line,x,y);y+=lineHeight}
    return y;
  }

  function saveResultPng(){
    const ranked=ranking(),top=ranked.find(r=>state.acceptability[r.p]!=='veto')||ranked[0];
    if(!top)return;
    const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1500;const ctx=canvas.getContext('2d');
    ctx.fillStyle='#F5F2EA';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#171717';ctx.font='800 34px system-ui, sans-serif';ctx.fillText('Find Your Politics',80,90);
    ctx.font='700 22px system-ui, sans-serif';ctx.fillStyle='#6B6A64';ctx.fillText(tx('Min politiska profil','My political profile'),80,135);

    ctx.fillStyle='#FFFFFF';ctx.strokeStyle='#D8D5CC';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(70,185,1060,300,28);ctx.fill();ctx.stroke();
    ctx.fillStyle='#171717';ctx.font='800 28px system-ui, sans-serif';ctx.fillText(tx('Starkaste praktiska match','Strongest practical match'),110,240);
    ctx.font='900 54px system-ui, sans-serif';ctx.fillText(partyNames[top.p],110,315);
    ctx.font='700 25px system-ui, sans-serif';ctx.fillStyle='#6B6A64';ctx.fillText(`Policy Alignment ${Math.round(top.policy)}/100`,110,375);ctx.fillText(`Voting Fit ${Math.round(top.fit)}/100`,110,420);

    const tr=typeof traits==='function'?traits():[];
    ctx.fillStyle='#171717';ctx.font='800 30px system-ui, sans-serif';ctx.fillText(tx('Din profil','Your profile'),80,555);
    ctx.font='650 24px system-ui, sans-serif';ctx.fillStyle='#383838';let y=610;
    tr.slice(0,6).forEach(t=>{ctx.fillText('• '+t,100,y);y+=48});
    if(!tr.length){ctx.fillStyle='#6B6A64';ctx.fillText(tx('Profilen är bred och blandad.','Your profile is broad and mixed.'),100,y);y+=48}

    ctx.fillStyle='#171717';ctx.font='800 30px system-ui, sans-serif';ctx.fillText(tx('Några av dina politiska axlar','Some of your political axes'),80,y+35);y+=85;
    const v=vector();
    const axes=[['market_economy',tx('Mer stat','More state'),tx('Mer marknad','More market')],['tax_work_income',tx('Högre skatt på arbete','Higher work tax'),tx('Lägre skatt på arbete','Lower work tax')],['crime_punishment',tx('Förebyggande','Prevention'),tx('Hårdare straff','Tougher punishment')],['asylum_migration',tx('Öppnare','More open'),tx('Restriktivare','More restrictive')],['social_values',tx('Socialt liberal','Socially liberal'),tx('Socialt konservativ','Socially conservative')],['eu_integration',tx('Nationell kontroll','National control'),tx('Mer EU','More EU')],['nuclear_energy',tx('Mindre kärnkraft','Less nuclear'),tx('Mer kärnkraft','More nuclear')]];
    axes.filter(a=>Number.isFinite(v[a[0]])).slice(0,6).forEach(a=>{
      ctx.font='650 19px system-ui, sans-serif';ctx.fillStyle='#6B6A64';ctx.fillText(a[1],80,y);const rw=ctx.measureText(a[2]).width;ctx.fillText(a[2],1120-rw,y);
      const x1=80,x2=1120,cy=y+25;ctx.strokeStyle='#C7C4BB';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x1,cy);ctx.lineTo(x2,cy);ctx.stroke();
      const px=x1+((v[a[0]]+100)/200)*(x2-x1);ctx.fillStyle='#171717';ctx.beginPath();ctx.arc(px,cy,11,0,Math.PI*2);ctx.fill();y+=95
    });

    ctx.fillStyle='#6B6A64';ctx.font='600 20px system-ui, sans-serif';
    y=Math.max(y+20,1310);y=wrapText(ctx,tx('Ett oberoende självupptäckartest. Det här är inte ett råd om hur du bör rösta.','An independent political self-discovery test. This is not advice on how you should vote.'),80,y,1040,30,3);
    ctx.font='600 18px system-ui, sans-serif';ctx.fillText('find-your-politics · Sweden 2026',80,1435);

    const a=document.createElement('a');a.download='find-your-politics-result.png';a.href=canvas.toDataURL('image/png');a.click();
  }

  function addSaveCard(){
    if(!document.getElementById('screen-results')?.classList.contains('active'))return;
    if(document.getElementById('saveResultCard'))return;
    const anchor=document.querySelector('#screen-results .v13-results')||document.getElementById('resultsList');if(!anchor)return;
    const card=document.createElement('div');card.id='saveResultCard';card.className='save-result-card';
    card.innerHTML=`<div class="small-label">${tx('Spara privat','Save privately')}</div><h3>${tx('Spara din profil som PNG','Save your profile as PNG')}</h3><p>${tx('Skapar en bild med din politiska profil och starkaste match. Ingenting laddas upp.','Creates an image with your political profile and strongest match. Nothing is uploaded.')}</p><button id="saveResultPngBtn" class="ghost">${tx('Spara PNG','Save PNG')}</button>`;
    anchor.after(card);card.querySelector('#saveResultPngBtn').onclick=saveResultPng;
  }

  function polish(){removeLiveMatchHints();improveComparison();addSaveCard()}
  let scheduled=false;
  const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;polish()})});
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',polish);polish();
})();
