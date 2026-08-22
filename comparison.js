/* Find Your Politics V1.2 — Top 3 comparison module */
(() => {
  const comparisonState = { top3: [], dimensions: [], testing: false, remaining: 0 };

  const copy = {
    sv: {
      compare: "Jämför mina topp 3 →",
      eyebrow: "Dina närmaste alternativ",
      title: "Jämför dina topp 3",
      intro: "Här visar vi bara de frågor som faktiskt hjälper till att skilja dina tre närmaste realistiska alternativ åt.",
      whatSeparates: "Det här skiljer dem mest",
      you: "Du",
      test: "Testa skillnaderna →",
      back: "← Tillbaka till resultatet",
      noMore: "Vi har redan testat de viktigaste skillnaderna mellan dina topp 3.",
      updated: "Bra - nu testar vi några frågor som är särskilt bra på att skilja dina toppalternativ åt."
    },
    en: {
      compare: "Compare my top 3 →",
      eyebrow: "Your closest options",
      title: "Compare your top 3",
      intro: "This view shows only the issues that actually help distinguish your three closest practical options.",
      whatSeparates: "What separates them most",
      you: "You",
      test: "Test the differences →",
      back: "← Back to results",
      noMore: "We have already tested the most useful differences between your top 3.",
      updated: "Good - the next questions are specifically chosen to separate your closest options."
    }
  };
  const c = k => copy[state.lang][k];

  const positionLabels = {
    market_economy:{sv:["Mer statlig styrning","Blandad modell","Mer marknad"],en:["More government direction","Mixed model","More market"]},
    tax_work_income:{sv:["Högre skatt på arbete","Ungefär mitten","Lägre skatt på arbete"],en:["Higher tax on work","Around the middle","Lower tax on work"]},
    tax_wealth_property:{sv:["Högre skatt på stora tillgångar","Ungefär mitten","Lägre skatt på stora tillgångar"],en:["Higher tax on large assets","Around the middle","Lower tax on large assets"]},
    welfare_qualification:{sv:["Mer generell tillgång","Blandad modell","Striktare kvalificering"],en:["More universal access","Mixed model","Stricter qualification"]},
    unemployment_security:{sv:["Mer generös ersättning","Ungefär mitten","Mer begränsad ersättning"],en:["More generous benefits","Around the middle","More limited benefits"]},
    sickness_social_insurance:{sv:["Starkare inkomstskydd","Balans","Striktare villkor"],en:["Stronger income protection","Balanced","Stricter eligibility"]},
    labour_flexibility:{sv:["Starkare anställningsskydd","Balans","Mer arbetsgivarflexibilitet"],en:["Stronger employment protection","Balanced","More employer flexibility"]},
    inequality_focus:{sv:["Mer fokus på jämlikhet","Blandad prioritering","Mer fokus på tillväxt och möjligheter"],en:["More focus on equality","Mixed priority","More focus on growth and opportunity"]},
    public_ownership:{sv:["Mer statligt ägande","Blandad modell","Mindre statligt ägande"],en:["More state ownership","Mixed model","Less state ownership"]},
    crime_punishment:{sv:["Mer förebyggande och rehabilitering","Balans","Hårdare straff och kontroll"],en:["More prevention and rehabilitation","Balanced","Tougher punishment and enforcement"]},
    surveillance_powers:{sv:["Mer integritet","Balans","Mer polisövervakning"],en:["More privacy","Balanced","More police surveillance"]},
    asylum_migration:{sv:["Öppnare asylpolitik","Ungefär mitten","Restriktivare asylpolitik"],en:["More open asylum policy","Around the middle","More restrictive asylum policy"]},
    skilled_migration:{sv:["Mer restriktiv arbetskraftsinvandring","Ungefär mitten","Öppnare arbetskraftsinvandring"],en:["More restrictive skilled migration","Around the middle","More open skilled migration"]},
    citizenship_requirements:{sv:["Lägre krav för medborgarskap","Ungefär mitten","Striktare krav för medborgarskap"],en:["Lower citizenship requirements","Around the middle","Stricter citizenship requirements"]},
    integration:{sv:["Mindre krav på kulturell anpassning","Ungefär mitten","Mer krav på kulturell anpassning"],en:["Less cultural adaptation required","Around the middle","More cultural adaptation required"]},
    housing_supply:{sv:["Mer offentlig styrning","Blandad modell","Mer marknadsdrivet byggande"],en:["More public direction","Mixed model","More market-led housing"]},
    rent_regulation:{sv:["Mer reglerade hyror","Ungefär mitten","Mer marknadsbaserade hyror"],en:["More regulated rents","Around the middle","More market-based rents"]},
    healthcare_choice:{sv:["Främst offentlig vård","Blandad modell","Mer valfrihet och privata alternativ"],en:["Mostly public provision","Mixed model","More choice and private provision"]},
    education_choice:{sv:["Mindre skolval","Ungefär mitten","Mer skolval"],en:["Less school choice","Around the middle","More school choice"]},
    school_discipline:{sv:["Mer stöd och inkludering","Balans","Mer ordning och disciplin"],en:["More support and inclusion","Balanced","More order and discipline"]},
    welfare_private_profit:{sv:["Mindre utrymme för vinst","Ungefär mitten","Mer utrymme för vinst"],en:["Less room for profit","Around the middle","More room for profit"]},
    climate_cost_sensitivity:{sv:["Snabbare klimatåtgärder trots kostnader","Balans","Mer fokus på kostnader"],en:["Faster climate action despite costs","Balanced","More focus on costs"]},
    nuclear_energy:{sv:["Mindre kärnkraft","Ungefär mitten","Mer kärnkraft"],en:["Less nuclear power","Around the middle","More nuclear power"]},
    eu_integration:{sv:["Mer nationell kontroll","Ungefär mitten","Mer EU-integration"],en:["More national control","Around the middle","More EU integration"]},
    social_values:{sv:["Mer progressiva värderingar","Neutral/blandad","Mer konservativa värderingar"],en:["More progressive values","Neutral/mixed","More conservative values"]},
    state_scope:{sv:["Bredare statlig roll","Balans","Mer begränsad statlig roll"],en:["Broader government role","Balanced","More limited government role"]},
    defence_spending:{sv:["Lägre försvarsutgifter","Ungefär mitten","Högre försvarsutgifter"],en:["Lower defence spending","Around the middle","Higher defence spending"]}
  };

  function ensureScreen() {
    if (document.getElementById("screen-compare")) return;
    const section = document.createElement("section");
    section.id = "screen-compare";
    section.className = "screen compare-screen";
    section.innerHTML = `
      <p class="eyebrow" id="compareEyebrow"></p>
      <h1 id="compareTitle"></h1>
      <p class="muted compare-intro" id="compareIntro"></p>
      <div id="comparePartyStrip" class="compare-party-strip"></div>
      <div class="compare-section-title" id="compareSectionTitle"></div>
      <div id="compareRows" class="compare-rows"></div>
      <div id="compareSummary" class="compare-summary"></div>
      <div class="compare-actions">
        <button id="testDifferencesBtn" class="primary"></button>
        <button id="backToResultsBtn" class="ghost"></button>
      </div>`;
    const footer = document.querySelector(".site-footer");
    footer.parentNode.insertBefore(section, footer);
    document.getElementById("testDifferencesBtn").onclick = testDifferences;
    document.getElementById("backToResultsBtn").onclick = () => { show("screen-results"); };
  }

  function practicalTop3() {
    const ranked = ranking();
    const practical = ranked.filter(r => state.acceptability[r.p] !== "veto");
    return (practical.length >= 3 ? practical : ranked).slice(0, 3);
  }

  function separatingDimensions(top3) {
    const pc = coords();
    const user = vector();
    const dims = state.model.dimensions.map(d => d.dimension).map(d => {
      const vals = top3.map(r => pc[r.p][d]).filter(v => v != null);
      if (vals.length < 3) return null;
      const spread = Math.max(...vals) - Math.min(...vals);
      const hasUser = user[d] != null;
      const priorityBoost = (weights()[d] || 1) > 1 ? 12 : 0;
      const userRelevance = hasUser ? 10 : 2;
      return { d, spread, score: spread + priorityBoost + userRelevance };
    }).filter(Boolean).filter(x => x.spread >= 20)
      .sort((a,b) => b.score - a.score);
    return dims.slice(0, 6);
  }

  function positionLabel(d,value) {
    const labels=positionLabels[d]?.[state.lang];
    if(!labels){
      if(value<=-35)return state.lang==='sv'?'Mer åt ena hållet':'Leans one way';
      if(value>=35)return state.lang==='sv'?'Mer åt andra hållet':'Leans the other way';
      return state.lang==='sv'?'Ungefär mitten':'Around the middle';
    }
    if (value <= -35) return labels[0];
    if (value >= 35) return labels[2];
    return labels[1];
  }

  function renderCompare() {
    ensureScreen();
    const top3 = practicalTop3();
    comparisonState.top3 = top3;
    comparisonState.dimensions = separatingDimensions(top3);
    const pc = coords(), user = vector();

    document.getElementById("compareEyebrow").textContent = c("eyebrow");
    document.getElementById("compareTitle").textContent = c("title");
    document.getElementById("compareIntro").textContent = c("intro");
    document.getElementById("compareSectionTitle").textContent = c("whatSeparates");
    document.getElementById("testDifferencesBtn").textContent = c("test");
    document.getElementById("backToResultsBtn").textContent = c("back");

    const strip = document.getElementById("comparePartyStrip");
    strip.innerHTML = `<div class="compare-party you-card"><span>${c("you")}</span><strong>${state.lang === "sv" ? "Din profil" : "Your profile"}</strong></div>` +
      top3.map((r,i) => `<div class="compare-party"><span>#${i+1}</span><strong>${partyNames[r.p]}</strong><small>${r.fit.toFixed(0)}/100</small></div>`).join("");

    const rows = document.getElementById("compareRows");
    rows.innerHTML = comparisonState.dimensions.map(x => {
      const uv = user[x.d];
      const cells = [
        `<div class="compare-cell you"><strong>${uv == null ? "—" : positionLabel(x.d,uv)}</strong>${uv == null ? `<small>${state.lang === "sv" ? "Inte testat ännu" : "Not tested yet"}</small>` : ""}</div>`,
        ...top3.map(r => `<div class="compare-cell"><strong>${positionLabel(x.d,pc[r.p][x.d])}</strong></div>`)
      ].join("");
      return `<div class="compare-row"><div class="compare-topic"><strong>${dimName(x.d)}</strong><span>${state.lang === "sv" ? "skillnad mellan partierna" : "difference between parties"}: ${Math.round(x.spread)}</span></div><div class="compare-grid">${cells}</div></div>`;
    }).join("");

    const names = top3.map(r => partyNames[r.p]).join(", ");
    const issues = comparisonState.dimensions.slice(0,3).map(x => dimName(x.d)).join(", ");
    document.getElementById("compareSummary").innerHTML = state.lang === "sv"
      ? `<strong>Vad valet mellan ${names} främst handlar om för dig</strong><p>Just nu är de mest användbara skiljelinjerna ${issues}. Det är de områden där mer information eller några fler svar mest sannolikt kan påverka ordningen.</p>`
      : `<strong>What the choice between ${names} mainly comes down to for you</strong><p>Right now, the most useful dividing lines are ${issues}. These are the areas where more information or a few more answers are most likely to change the order.</p>`;

    show("screen-compare");
  }

  function unansweredTargetQuestions() {
    const dims = comparisonState.dimensions.map(x => x.d);
    const dimRank = Object.fromEntries(dims.map((d,i) => [d, dims.length-i]));
    return state.bank.questions
      .filter(q => !state.asked.includes(q.id) && dims.includes(q.primary_dimension) && difficultyAllowed(q))
      .sort((a,b) => (dimRank[b.primary_dimension]||0) - (dimRank[a.primary_dimension]||0) + (b.type === "discriminator" ? 2 : 0) - (a.type === "discriminator" ? 2 : 0))
      .slice(0,5);
  }

  function testDifferences() {
    const qs = unansweredTargetQuestions();
    if (!qs.length) {
      document.getElementById("compareSummary").innerHTML += `<p class="compare-note">${c("noMore")}</p>`;
      return;
    }
    comparisonState.testing = true;
    comparisonState.remaining = qs.length;
    state.comparisonQueue = qs.map(q => q.id);
    state.viewingEarlyResults = true;
    show("screen-quiz");
    const banner = document.getElementById("insightBanner");
    banner.textContent = c("updated");
    banner.classList.remove("hidden");
    comparisonAskNext();
  }

  function comparisonAskNext() {
    if (!comparisonState.testing) return false;
    const queue = state.comparisonQueue || [];
    while (queue.length) {
      const id = queue.shift();
      const q = state.bank.questions.find(x => x.id === id);
      if (!q || state.answers[id]) continue;
      if (!state.asked.includes(id)) state.asked.push(id);
      state.current = q;
      renderQuestion(q);
      return true;
    }
    comparisonState.testing = false;
    state.comparisonQueue = [];
    results();
    return true;
  }

  const coreAskNext = askNext;
  askNext = function() {
    if (comparisonState.testing) return comparisonAskNext();
    return coreAskNext();
  };

  const coreResults = results;
  results = function() {
    coreResults();
    ensureScreen();
    let btn = document.getElementById("compareTop3Btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "compareTop3Btn";
      btn.className = "primary compare-top3-btn";
      btn.onclick = renderCompare;
      const actions = document.querySelector("#screen-results .result-actions");
      actions.insertBefore(btn, actions.firstChild);
    }
    btn.textContent = c("compare");
  };

  const coreApplyLang = applyLang;
  applyLang = function() {
    coreApplyLang();
    const screen = document.getElementById("screen-compare");
    if (screen && screen.classList.contains("active")) renderCompare();
    const btn = document.getElementById("compareTop3Btn");
    if (btn) btn.textContent = c("compare");
  };

  ensureScreen();
})();
