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
      updated: "Bra — nu testar vi några frågor som är särskilt bra på att skilja dina toppalternativ åt.",
      low: "mer åt det första hållet",
      middle: "mitten",
      high: "mer åt det andra hållet"
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
      updated: "Good — the next questions are specifically chosen to separate your closest options.",
      low: "leans toward the first side",
      middle: "middle",
      high: "leans toward the second side"
    }
  };
  const c = k => copy[state.lang][k];

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

  function positionLabel(value) {
    if (value <= -35) return c("low");
    if (value >= 35) return c("high");
    return c("middle");
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
        `<div class="compare-cell you"><strong>${uv == null ? "—" : positionLabel(uv)}</strong>${uv == null ? `<small>${state.lang === "sv" ? "Inte testat ännu" : "Not tested yet"}</small>` : ""}</div>`,
        ...top3.map(r => `<div class="compare-cell"><strong>${positionLabel(pc[r.p][x.d])}</strong></div>`)
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

  // Keep core quiz intact, but intercept progression only during a comparison challenge.
  const coreAskNext = askNext;
  askNext = function() {
    if (comparisonState.testing) return comparisonAskNext();
    return coreAskNext();
  };

  // Add the comparison CTA every time results are rendered.
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

  // Language changes should update an open comparison screen too.
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
