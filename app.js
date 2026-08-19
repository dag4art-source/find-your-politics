const state={
  model:null,bank:null,lang:"sv",knowledgeLevel:"beginner",priorities:[],answers:{},asked:[],history:[],
  current:null,acceptability:{},batchTarget:8,viewingEarlyResults:false,checkpointCount:0,lastInsightIndex:-1
};
const partyNames={S:"Socialdemokraterna",SD:"Sverigedemokraterna",M:"Moderaterna",V:"Vänsterpartiet",C:"Centerpartiet",KD:"Kristdemokraterna",MP:"Miljöpartiet",L:"Liberalerna"};
const partyUrls={S:"https://www.socialdemokraterna.se/",SD:"https://www.sd.se/",M:"https://moderaterna.se/",V:"https://www.vansterpartiet.se/",C:"https://www.centerpartiet.se/",KD:"https://kristdemokraterna.se/",MP:"https://www.mp.se/",L:"https://www.liberalerna.se/"};
const priorityMap={
"Economy & jobs":["market_economy","labour_flexibility","inequality_focus"],
"Taxes & cost of living":["tax_work_income","tax_wealth_property","climate_cost_sensitivity"],
"Crime & safety":["crime_punishment","surveillance_powers"],
"Housing":["housing_supply","rent_regulation"],
"Healthcare":["healthcare_choice","welfare_private_profit"],
"Schools & education":["education_choice","school_discipline","welfare_private_profit"],
"Immigration & integration":["asylum_migration","skilled_migration","citizenship_requirements","integration"],
"Climate & energy":["climate_cost_sensitivity","nuclear_energy"],
"Welfare & social security":["welfare_qualification","unemployment_security","sickness_social_insurance"],
"EU & Europe":["eu_integration"],"Defence & security":["defence_spending"],"Rights, freedoms & social values":["social_values"]
};
const prioritySv={
"Economy & jobs":"Ekonomi & jobb","Taxes & cost of living":"Skatter & levnadskostnader","Crime & safety":"Brott & trygghet","Housing":"Bostäder",
"Healthcare":"Vård","Schools & education":"Skola & utbildning","Immigration & integration":"Invandring & integration","Climate & energy":"Klimat & energi",
"Welfare & social security":"Välfärd & social trygghet","EU & Europe":"EU & Europa","Defence & security":"Försvar & säkerhet","Rights, freedoms & social values":"Rättigheter, frihet & värderingar"
};
const I={
sv:{
home_eyebrow:"Sverige 2026 · Politisk självupptäckt",
home_title:"Du behöver inte kunna politik för att veta vad du tror på.",
home_subtitle:"Ett blint, adaptivt politiskt test som hjälper dig förstå dina egna åsikter först — och först därefter visar vilka svenska partier som ligger närmast dem.",
home_body:"<p>Demokrati fungerar bara när människor deltar. Och meningsfullt deltagande börjar med att förstå vad du faktiskt tycker.</p><p>Många väljare — särskilt förstagångsväljare — vet ännu inte var de står politiskt, vilka frågor som betyder mest för dem eller vilket parti som representerar dem bäst.</p><p><strong>Det här testet är gjort för dem.</strong></p>",
trust_1:"Inget konto",trust_2:"Ingen spårning",trust_3:"100% privat",trust_4:"Inga politiska sponsorer",
cta_find:"Hitta min politik →",read_more:"Läs hur det fungerar",read_close:"Stäng",
what:"Vad",what_body:"Ett politiskt självupptäckartest. Du svarar på frågor om hur du tycker att samhället bör fungera. Partinamnen hålls dolda tills resultatet.",
why:"Varför",why_body:"För att det är lättare att välja parti när du först förstår dina egna åsikter — särskilt om det är ditt första val eller om du inte brukar följa politik.",
how:"Hur",how_body:"Testet börjar brett och anpassar sig sedan. Det ställer fler frågor bara när de faktiskt kan förbättra resultatet. Du får se var du håller med, var du skiljer dig och vilka konflikter som kan spela roll.",
one_thing:"En snabb sak först",knowledge_title:"Hur bekväm är du med politik?",knowledge_body:"Det finns inget bättre svar. Det här styr bara hur komplexa frågorna får bli.",
beginner_title:"Nybörjare",beginner_body:"Håll det enkelt. Jag följer inte politik så noga och vill ha vardagligt språk och tydliga förklaringar.",
intermediate_title:"Mellannivå",intermediate_body:"Jag kan grunderna och är bekväm med viss politisk detaljnivå.",
advanced_title:"Avancerad",advanced_body:"Jag följer politik och är bekväm med mer komplexa avvägningar.",
knowledge_note:"Din kunskapsnivå påverkar inte resultatet — bara hur frågorna ställs.",
priority_eyebrow:"Vad bör regeringen fokusera på?",priority_title:"Vilka frågor betyder mest när du väljer vem som ska styra?",priority_body:"Välj upp till fyra. De får större vikt i din matchning. Du får fortfarande frågor om andra områden — något kan vara låg prioritet för regeringen men ändå bli en viktig konflikt för dig.",
start_questions:"Starta frågorna",equal_issues:"Jag är inte säker ännu — behandla allt lika",
back:"← Tillbaka",dont_know:"Jag vet inte — förklara",plain_english:"Förklarat enkelt",real_tradeoff:"Den verkliga avvägningen",still_unsure:"Fortfarande osäker — hoppa över frågan",
checkpoint:"Checkpoint",profile_so_far:"Din profil hittills",see_current:"Visa mitt resultat nu",
not_only_policy:"Politik är mer än sakfrågor",accept_title:"Finns det partier du aldrig skulle rösta på?",accept_body:"Det ändrar inte din sakpolitiska matchning. Det påverkar bara vilka partier som räknas som realistiska alternativ för dig.",
show_results:"Visa mitt resultat",your_result:"Ditt resultat",results_title:"Här landade din politik.",
results_intro:"Två olika mått hjälper dig förstå resultatet. Det ena visar ren sakpolitisk närhet. Det andra visar hur rimligt partiet faktiskt är för dig när stora konflikter och egna veto räknas in.",policy_alignment_help:"Hur nära dina svar ligger partiets politiska positioner.",voting_fit_help:"Sakpolitisk närhet minus stora konflikter, med dina egna uteslutna partier tydligt markerade.",
important:"Viktigt",method_note:"Det här är en experimentell modell baserad på politiska positioner. Poängen är ett matchningsmått — inte en objektiv sanning och inte en rekommendation om hur du bör rösta.",
continue_testing:"Fortsätt testa",start_over:"Börja om",
consider:"Skulle överväga",maybe:"Kanske",unlikely:"Mycket osannolikt",never:"Skulle aldrig rösta på",
best_match:"Din starkaste praktiska match",why_best:"Varför detta passar dig bäst",where_align:"Där ni ligger nära",where_disagree:"Där ni skiljer er",excluded:"Uteslutet av dig",visit:"Besök partiets officiella webbplats ↗"
},
en:{
home_eyebrow:"Sweden 2026 · Political self-discovery",
home_title:"You don’t need to know politics to know what you believe.",
home_subtitle:"A blind, adaptive political test that helps you discover your own views first — and only then shows which Swedish parties are closest to them.",
home_body:"<p>Democracy only works when people participate. And meaningful participation starts with understanding what you actually think.</p><p>A lot of voters — especially first-time voters — don’t yet know where they stand politically, which issues matter most to them, or which party represents them best.</p><p><strong>This test is made for them.</strong></p>",
trust_1:"No account",trust_2:"No tracking",trust_3:"100% private",trust_4:"No political sponsors",
cta_find:"Find my politics →",read_more:"Read how it works",read_close:"Close",
what:"What",what_body:"A political self-discovery test. You answer questions about how you think society should work. Party names stay hidden until the result.",
why:"Why",why_body:"Because choosing a party is easier when you first understand your own views — especially if this is your first election or you don’t follow politics closely.",
how:"How",how_body:"The test starts broad, then adapts. It asks more questions only when they can improve your result. You’ll see where you align, where you disagree, and which conflicts may matter.",
one_thing:"One quick thing first",knowledge_title:"How comfortable are you with politics?",knowledge_body:"There’s no better answer. This only changes how complex the questions can become.",
beginner_title:"Beginner",beginner_body:"Keep it simple. I don’t follow politics closely and want everyday language.",
intermediate_title:"Intermediate",intermediate_body:"I know the basics and I’m comfortable with some policy detail.",
advanced_title:"Advanced",advanced_body:"I follow politics and I’m comfortable with more complex trade-offs.",
knowledge_note:"Your knowledge level does not affect your result — only how the questions are asked.",
priority_eyebrow:"What should government focus on?",priority_title:"Which issues matter most when you choose who should govern?",priority_body:"Choose up to four. We’ll give them more weight in your match. You’ll still be asked about other topics — something can be a low priority and still become an important disagreement.",
start_questions:"Start the questions",equal_issues:"I’m not sure yet — treat all issues equally",
back:"← Back",dont_know:"I don’t know — explain this",plain_english:"In plain English",real_tradeoff:"The real trade-off",still_unsure:"Still unsure — skip",
checkpoint:"Checkpoint",profile_so_far:"Your profile so far",see_current:"Show my current result",
not_only_policy:"Politics isn’t only policy",accept_title:"Are there parties you would never vote for?",accept_body:"This does not change your policy alignment. It only affects your practical shortlist.",
show_results:"Show my results",your_result:"Your result",results_title:"Here’s where your politics landed.",
results_intro:"Two different measures help explain your result. One shows pure policy similarity. The other shows how plausible the party is for you once major conflicts and your own vetoes are considered.",policy_alignment_help:"How closely your answers match the party’s political positions.",voting_fit_help:"Policy similarity after major conflicts, with parties you excluded clearly marked.",
important:"Important",method_note:"This is an experimental model based on political positions. The score is an alignment measure — not an objective truth and not advice on how you should vote.",
continue_testing:"Continue testing",start_over:"Start over",
consider:"Would consider",maybe:"Maybe",unlikely:"Very unlikely",never:"Would never vote for",
best_match:"Your strongest practical match",why_best:"Why this fits you best",where_align:"Where you align",where_disagree:"Where you disagree",excluded:"Excluded by you",visit:"Visit official party website ↗"
}};
const $=id=>document.getElementById(id);
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
function t(k){return I[state.lang][k]||k}
function applyLang(){
  document.documentElement.lang=state.lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
  document.querySelectorAll("[data-i18n-html]").forEach(el=>el.innerHTML=t(el.dataset.i18nHtml));
  $("langSv").classList.toggle("active",state.lang==="sv");$("langEn").classList.toggle("active",state.lang==="en");
  $("readMoreBtn").textContent=$("readMorePanel").classList.contains("hidden")?t("read_more"):t("read_close");
  renderPriorities();
  if(state.current && $("screen-quiz").classList.contains("active")) renderQuestion(state.current);
}
$("langSv").onclick=()=>{state.lang="sv";applyLang()};
$("langEn").onclick=()=>{state.lang="en";applyLang()};
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"})}
Promise.all([fetch("data/model.json").then(r=>r.json()),fetch("data/questions.json").then(r=>r.json())]).then(([m,b])=>{state.model=m;state.bank=b;applyLang();});
$("startBtn").onclick=()=>show("screen-knowledge");
$("readMoreBtn").onclick=()=>{$("readMorePanel").classList.toggle("hidden");$("readMoreBtn").textContent=$("readMorePanel").classList.contains("hidden")?t("read_more"):t("read_close")};
document.querySelectorAll(".knowledge-card").forEach(b=>b.onclick=()=>{state.knowledgeLevel=b.dataset.level;show("screen-priorities")});
function renderPriorities(){
  const g=$("priorityGrid"); if(!g)return; g.innerHTML="";
  Object.keys(priorityMap).forEach(key=>{
    const b=document.createElement("button");b.className="priority"+(state.priorities.includes(key)?" selected":"");
    b.textContent=state.lang==="sv"?prioritySv[key]:key;
    b.onclick=()=>{if(state.priorities.includes(key))state.priorities=state.priorities.filter(x=>x!==key);else if(state.priorities.length<4)state.priorities.push(key);renderPriorities()};
    g.appendChild(b);
  });
}
$("priorityNext").onclick=()=>startQuiz();
$("equalBtn").onclick=()=>{state.priorities=[];startQuiz()};
function startQuiz(){state.answers={};state.asked=[];state.history=[];state.batchTarget=8;show("screen-quiz");askNext()}
function vector(){const d={};Object.values(state.answers).forEach(a=>{if(a.score==null)return;(d[a.dimension]??=[]).push(a.score)});const v={};Object.entries(d).forEach(([k,a])=>v[k]=mean(a));return v}
function coords(){const c={};Object.keys(partyNames).forEach(p=>c[p]={});state.model.dimensions.forEach(d=>Object.keys(partyNames).forEach(p=>c[p][d.dimension]=d[p+"_score"]));return c}
function weights(){const w={};state.model.dimensions.forEach(d=>w[d.dimension]=1);state.priorities.forEach(p=>(priorityMap[p]||[]).forEach(d=>w[d]=2));return w}
function ranking(){
  const v=vector(),c=coords(),w=weights();
  return Object.keys(partyNames).map(p=>{let tot=0,ws=0,details=[];Object.keys(v).forEach(d=>{if(c[p][d]==null)return;const dist=Math.abs(v[d]-c[p][d]),sim=Math.max(0,1-dist/200),ww=w[d]||1;tot+=sim*ww;ws+=ww;details.push({d,dist,user:v[d],party:c[p][d],weight:ww})});return{p,fit:ws?100*tot/ws:0,details}}).sort((a,b)=>b.fit-a.fit)
}
function confidence(){const n=Object.keys(state.answers).length,r=ranking(),gap=(r[0]?.fit||0)-(r[1]?.fit||0),breadth=Math.min(1,Object.keys(vector()).length/12),depth=Math.min(1,n/18);return Math.round(100*(.45*breadth+.4*depth+.15*Math.min(1,gap/12)))}
function confLabel(c){if(state.lang==="sv") return c<40?"Tidigt utkast":c<60?"Tar form":c<75?"Användbart resultat":c<90?"Starkt resultat":"Mycket starkt resultat";return c<40?"Early picture":c<60?"Taking shape":c<75?"Useful result":c<90?"Strong result":"Very strong result"}
function difficultyAllowed(q){if(state.knowledgeLevel==="beginner")return q.difficulty==="easy"||q.difficulty==="medium";if(state.knowledgeLevel==="intermediate")return q.difficulty!=="advanced"||Object.keys(state.answers).length>=12;return true}
function difficultyBoost(q){if(state.knowledgeLevel==="beginner")return q.difficulty==="easy"?18:(q.difficulty==="medium"?5:-40);if(state.knowledgeLevel==="intermediate")return q.difficulty==="medium"?12:(q.difficulty==="easy"?6:0);return q.difficulty==="advanced"?14:6}
function chooseNext(){
  let rem=state.bank.questions.filter(q=>!state.asked.includes(q.id)&&!q.tags.includes("dealbreaker_probe")&&difficultyAllowed(q));
  if(!rem.length)rem=state.bank.questions.filter(q=>!state.asked.includes(q.id)&&!q.tags.includes("dealbreaker_probe"));
  if(!rem.length)return null;
  const v=vector(),r=ranking().slice(0,3).map(x=>x.p),c=coords(),w=weights();
  if(Object.keys(state.answers).length<8){const pd=new Set(state.priorities.flatMap(p=>priorityMap[p]||[]));const a=rem.filter(q=>q.type==="discovery"&&(pd.has(q.primary_dimension)||v[q.primary_dimension]==null));return [...(a.length?a:rem)].sort((x,y)=>difficultyBoost(y)-difficultyBoost(x))[0]||rem[0]}
  let best=null,bs=-1;
  rem.forEach(q=>{const vals=r.map(p=>c[p][q.primary_dimension]).filter(x=>x!=null);if(vals.length<2)return;const spread=Math.max(...vals)-Math.min(...vals);const score=spread+(v[q.primary_dimension]==null?20:0)+((w[q.primary_dimension]||1)>1?15:0)+(q.type==="discriminator"?10:0)+difficultyBoost(q);if(score>bs){bs=score;best=q}});
  return best||rem[0]
}
function answerText(q,a){if(state.lang==="sv") return a.text_sv || a.text;return a.text}
function categoryText(q){return state.lang==="sv" ? (prioritySv[q.category]||q.category) : q.category}
function renderQuestion(q){
  state.current=q;const n=Object.keys(state.answers).length,c=confidence();
  $("progressText").textContent=state.lang==="sv"?`${n} användbara svar`:`${n} useful answers`;
  $("confidenceLabel").textContent=`${confLabel(c)} · ${c}%`;$("progressBar").style.width=Math.min(100,n/state.batchTarget*100)+"%";
  $("questionMeta").textContent=categoryText(q);$("questionText").textContent=state.lang==="sv"?(q.question_sv||q.question):q.question;
  const a=$("answers");a.innerHTML="";
  q.answers.filter(x=>x.key!=="E").forEach(x=>{const b=document.createElement("button");b.className="answer";b.textContent=answerText(q,x);b.onclick=()=>{state.history.push(q.id);state.answers[q.id]={score:x.score,dimension:q.primary_dimension};$("insightBanner").classList.add("hidden");askNext()};a.appendChild(b)});
  $("backBtn").classList.toggle("hidden",!state.history.length);$("explainer").classList.add("hidden");
  $("explainerText").textContent=state.lang==="sv" ? beginnerExplainSv(q.primary_dimension) : q.dont_know_explainer;
  $("explainerTradeoff").textContent=state.lang==="sv" ? beginnerTradeoffSv(q.primary_dimension) : beginnerTradeoffEn(q.primary_dimension)
}
function askNext(){if(Object.keys(state.answers).length>=state.batchTarget)return checkpoint();const q=chooseNext();if(!q)return acceptability();state.asked.push(q.id);renderQuestion(q)}
$("backBtn").onclick=()=>{if(!state.history.length)return;const id=state.history.pop();delete state.answers[id];const q=state.bank.questions.find(x=>x.id===id);state.asked=state.asked.filter(x=>x!==id);show("screen-quiz");renderQuestion(q)};
$("explainBtn").onclick=()=>$("explainer").classList.toggle("hidden");
$("skipQuestionBtn").onclick=()=>{state.history.push(state.current.id);state.answers[state.current.id]={score:null,dimension:state.current.primary_dimension};askNext()};
function beginnerExplainSv(d){
 const m={market_economy:"Det handlar om vem som främst ska styra ekonomiska beslut: människor och företag på en marknad, eller staten genom regler, ägande och investeringar.",tax_work_income:"Det handlar om skatt på pengar människor tjänar genom arbete. Lägre skatt ger mer kvar i plånboken. Högre skatt ger mer pengar till offentliga tjänster.",tax_wealth_property:"Det handlar om skatt på det människor äger, till exempel fastigheter, arv eller stora förmögenheter, snarare än lön.",welfare_qualification:"Det handlar om vem som ska få tillgång till välfärdsförmåner och hur snabbt efter att man flyttat till Sverige.",crime_punishment:"Det handlar om hur mycket brottspolitiken ska fokusera på hårdare straff jämfört med förebyggande arbete och rehabilitering.",surveillance_powers:"Det handlar om hur mycket integritet samhället bör offra för att ge polisen bättre verktyg mot grov brottslighet.",asylum_migration:"Det handlar om hur Sverige ska balansera skydd för människor på flykt mot landets kapacitet att ta emot och integrera.",skilled_migration:"Det handlar om människor som flyttar till Sverige för att arbeta, inte om asyl.",integration:"Det handlar om vad integration egentligen ska kräva: språk, arbete och laglydnad, eller också större kulturell anpassning.",housing_supply:"Det handlar om hur fler bostäder ska byggas: mer offentlig styrning eller mer marknadsdrivna lösningar.",rent_regulation:"Det handlar om hur mycket hyror ska regleras jämfört med att låta efterfrågan och marknaden styra.",healthcare_choice:"Det handlar om huruvida skattefinansierad vård främst ska ges av offentliga aktörer eller om privata alternativ också ska ha stor plats.",education_choice:"Det handlar om hur mycket familjer ska kunna välja skola och hur mycket staten ska styra systemet.",climate_cost_sensitivity:"Det handlar om hur mycket högre kostnader hushåll och företag bör acceptera för snabbare utsläppsminskningar.",nuclear_energy:"Det handlar om vilken roll kärnkraft ska ha jämfört med förnybar energi i framtidens elsystem.",eu_integration:"Det handlar om hur mycket beslut Sverige bör fatta tillsammans med EU jämfört med att behålla nationell kontroll.",social_values:"Det handlar om hur mycket staten ska försöka påverka människors privata sociala och moraliska värderingar.",state_scope:"Det handlar om hur många samhällsproblem staten själv bör försöka lösa jämfört med att lämna mer till individer, företag och civilsamhället.",defence_spending:"Det handlar om hur högt försvar ska prioriteras jämfört med andra offentliga behov."};return m[d]||"Frågan handlar om en verklig politisk avvägning. Inget svar är objektivt rätt — målet är att hitta vilket perspektiv som känns mest rimligt för dig."
}
function beginnerTradeoffSv(d){const m={market_economy:"Mer marknad kan ge konkurrens och flexibilitet. Mer statlig styrning kan ge större kontroll och samordning.",tax_work_income:"Mer pengar kvar privat eller mer pengar till gemensamma tjänster.",crime_punishment:"Hårdare straff och kontroll eller mer fokus på att förebygga brott och minska återfall.",surveillance_powers:"Trygghet och polisens verktyg kontra integritet och rättssäkerhet.",asylum_migration:"Humanitärt ansvar kontra mottagnings- och integrationskapacitet.",climate_cost_sensitivity:"Snabbare klimatåtgärder kontra hushållens och företagens kostnader.",eu_integration:"Gemensam europeisk handlingskraft kontra svensk självbestämmanderätt.",social_values:"Aktiv politisk värderingsstyrning kontra att staten håller sig borta från privata livsval."};return m[d]||"Varje alternativ skyddar något viktigt men accepterar samtidigt en annan kostnad eller risk."}
function beginnerTradeoffEn(d){const m={market_economy:"More competition and flexibility versus more public control and coordination.",crime_punishment:"Tougher punishment and control versus prevention and rehabilitation.",surveillance_powers:"Public safety and police tools versus privacy and legal safeguards.",asylum_migration:"Humanitarian responsibility versus reception and integration capacity.",climate_cost_sensitivity:"Faster climate action versus household and business costs.",eu_integration:"Shared European power versus Swedish national control.",social_values:"Active political value-setting versus keeping government out of private life."};return m[d]||"Each option protects something valuable while accepting a different cost or risk."}
function traits(){const v=vector(),out=[],add=(d,lo,hi)=>{if(v[d]==null)return;if(v[d]>=45)out.push(hi);else if(v[d]<=-45)out.push(lo)};if(state.lang==="sv"){add("market_economy","Mer statligt orienterad ekonomi","Marknadsorienterad ekonomi");add("crime_punishment","Mer förebyggande brottspolitik","Tuffare mot grov brottslighet");add("social_values","Socialt liberal","Socialt konservativ");add("nuclear_energy","Förnybart först","Starkt för kärnkraft");add("eu_integration","Föredrar mer nationell kontroll","För djupare EU-integration")}else{add("market_economy","More state-oriented economically","Market-oriented economically");add("crime_punishment","Prevention-first on crime","Tougher on serious crime");add("social_values","Socially liberal","Socially conservative");add("nuclear_energy","Renewables-first","Strongly pro-nuclear");add("eu_integration","Prefers national autonomy","Pro deeper EU integration")}return out.slice(0,5)}
function checkpoint(){state.checkpointCount++;show("screen-checkpoint");const r=ranking(),c=confidence(),gap=(r[0]?.fit||0)-(r[1]?.fit||0),strong=c>=72&&gap>=7&&Object.keys(state.answers).length>=10,idx=(state.checkpointCount-1)%4;const svStrong=["Vi börjar få en tydlig bild.","Din politiska profil blir förvånansvärt skarp.","Du har redan ett användbart resultat.","Vi kan stanna här — eller utmana resultatet."];const enStrong=["We’re getting a pretty clear picture.","Your political profile is becoming surprisingly sharp.","You already have a useful result.","We could stop here — or challenge the result."];const svOpen=["Vi har lärt oss mycket. Några saker är fortfarande oklara.","Din profil börjar ta form.","Intressant — du passar inte snyggt i en enda politisk låda.","Vi börjar ringa in det."];const enOpen=["We’ve learned a lot. A few things are still unresolved.","Your profile is taking shape.","Interesting — you don’t fit neatly into one political box.","We’re narrowing it down."];const body=strong?(state.lang==="sv"?"Du kan stanna nu och få ett meningsfullt resultat. Fortsätter du fokuserar nästa frågor bara på sådant som kan utmana din nuvarande match.":"You can stop now and see a meaningful result. If you continue, the next questions focus only on things that could challenge your current match."):(gap<3?(state.lang==="sv"?"Dina toppmatchningar ligger fortfarande nära varandra. Nästa frågor väljs specifikt för att skilja dem åt.":"Your top matches are still very close. The next questions are chosen specifically to separate them."):(state.lang==="sv"?"Några viktiga delar av din profil är fortfarande otillräckligt testade. Nästa frågor fokuserar på just dem.":"A few important parts of your profile are still under-tested. The next questions focus on those gaps."));$("checkpointConfidence").textContent=`${c}%`;$("checkpointTitle").textContent=(strong?(state.lang==="sv"?svStrong:enStrong):(state.lang==="sv"?svOpen:enOpen))[idx];$("checkpointBody").innerHTML=`<p>${body}</p>`;const p=$("profileTraits");p.innerHTML="";traits().forEach(x=>{const s=document.createElement("span");s.className="trait";s.textContent=x;p.appendChild(s)});$("continueBtn").textContent=strong?(state.lang==="sv"?"Utmana mitt resultat":"Challenge my result"):(state.lang==="sv"?"Fortsätt":"Keep going")}
$("continueBtn").onclick=()=>{state.batchTarget=Object.keys(state.answers).length+4;show("screen-quiz");askNext()};
$("earlyResultBtn").onclick=()=>{state.viewingEarlyResults=true;acceptability()};
function acceptability(){show("screen-acceptability");const w=$("partyAcceptability");w.innerHTML="";Object.entries(partyNames).forEach(([p,n])=>{const row=document.createElement("div");row.className="party-row";row.innerHTML=`<strong>${n}</strong><select data-party="${p}"><option value="consider">${t("consider")}</option><option value="maybe">${t("maybe")}</option><option value="unlikely">${t("unlikely")}</option><option value="veto">${t("never")}</option></select>`;w.appendChild(row)})}
$("acceptabilityNext").onclick=()=>{document.querySelectorAll("#partyAcceptability select").forEach(s=>state.acceptability[s.dataset.party]=s.value);results()};
function dimName(d){const sv={market_economy:"ekonomi och marknad",tax_work_income:"skatt på arbete",tax_wealth_property:"skatt på förmögenhet och egendom",welfare_qualification:"villkor för välfärd",unemployment_security:"arbetslöshetsförsäkring",sickness_social_insurance:"sjukförsäkring",labour_flexibility:"arbetsmarknadens flexibilitet",inequality_focus:"ekonomisk jämlikhet",public_ownership:"statligt ägande",crime_punishment:"brott och straff",surveillance_powers:"polisens övervakningsbefogenheter",asylum_migration:"asylpolitik",skilled_migration:"arbetskraftsinvandring",citizenship_requirements:"krav för medborgarskap",integration:"integration",housing_supply:"bostadsbyggande",rent_regulation:"hyresreglering",healthcare_choice:"valfrihet i vården",education_choice:"skolval",school_discipline:"ordning och disciplin i skolan",welfare_private_profit:"vinst i skattefinansierad välfärd",climate_cost_sensitivity:"klimatkostnader",nuclear_energy:"kärnkraft",eu_integration:"EU-integration",social_values:"sociala värderingar",state_scope:"statens roll",defence_spending:"försvarsutgifter"};const en={market_economy:"economy and markets",tax_work_income:"tax on work",tax_wealth_property:"tax on wealth and property",welfare_qualification:"welfare eligibility",unemployment_security:"unemployment insurance",sickness_social_insurance:"sickness insurance",labour_flexibility:"labour-market flexibility",inequality_focus:"economic inequality",public_ownership:"public ownership",crime_punishment:"crime and punishment",surveillance_powers:"police surveillance powers",asylum_migration:"asylum policy",skilled_migration:"skilled migration",citizenship_requirements:"citizenship requirements",integration:"integration",housing_supply:"housing supply",rent_regulation:"rent regulation",healthcare_choice:"healthcare choice",education_choice:"school choice",school_discipline:"school discipline",welfare_private_profit:"profit in tax-funded welfare",climate_cost_sensitivity:"climate-policy costs",nuclear_energy:"nuclear energy",eu_integration:"EU integration",social_values:"social values",state_scope:"role of government",defence_spending:"defence spending"};return state.lang==="sv"?(sv[d]||d.replaceAll("_"," ")):(en[d]||d.replaceAll("_"," "))}
function narrative(r,kind){const arr=[...r.details].sort((a,b)=>kind==="align"?a.dist-b.dist:b.dist-a.dist).filter(x=>kind==="align"?x.dist<=50:x.dist>=70).slice(0,3);if(!arr.length)return state.lang==="sv"?(kind==="align"?"Vi har ännu inte tillräckligt med data för att sammanfatta starka likheter.":"Ingen stor konflikt har upptäckts ännu."):(kind==="align"?"We don’t yet have enough data to summarize strong alignment.":"No major disagreement has emerged yet.");const names=arr.map(x=>dimName(x.d)).join(", ");return state.lang==="sv"?(kind==="align"?`Du och partiet ligger särskilt nära varandra kring ${names}.`:`De tydligaste skillnaderna mellan dig och partiet gäller ${names}.`):(kind==="align"?`You and the party are especially close on ${names}.`:`The clearest differences between you and the party concern ${names}.`)}
function results(){show("screen-results");const ranked=ranking(),nonVeto=ranked.filter(r=>state.acceptability[r.p]!=="veto"),best=(nonVeto[0]||ranked[0])?.p,w=$("resultsList");w.innerHTML="";ranked.forEach((r,i)=>{const veto=state.acceptability[r.p]==="veto",isBest=r.p===best,e=document.createElement("div");e.className="result"+(isBest?" best-match":"")+(veto?" veto-result":"");e.innerHTML=(veto?`<div class="veto-banner">${t("excluded")}</div>`:"")+(isBest?`<div class="best-badge">${t("best_match")}</div>`:"")+`<div class="result-head"><div><div class="rank">#${i+1}</div><h3>${partyNames[r.p]}</h3></div><div class="score">${r.fit.toFixed(0)}<span class="score-denom">/100</span></div></div>`+(isBest?`<div class="best-reason"><strong>${t("why_best")}</strong><br>${narrative(r,"align")}</div>`:"")+`<div class="result-narrative"><p><strong>${t("where_align")}:</strong> ${narrative(r,"align")}</p><p><strong>${t("where_disagree")}:</strong> ${narrative(r,"disagree")}</p></div><a class="party-link" href="${partyUrls[r.p]}" target="_blank" rel="noopener noreferrer">${t("visit")}</a>`;w.appendChild(e)});$("nextRead").innerHTML=state.lang==="sv"?"<h3>Vad bör du läsa på om innan du bestämmer dig?</h3><p>Titta särskilt på de frågor där dina två bästa återstående matchningar skiljer sig mest. Det är där mer kunskap sannolikt kan påverka ditt val.</p>":"<h3>What should you look at before deciding?</h3><p>Focus on the issues where your two strongest remaining matches differ most. That’s where more information is most likely to affect your choice.</p>";$("continueFromResultsBtn").classList.toggle("hidden",!state.viewingEarlyResults)}
$("continueFromResultsBtn").onclick=()=>{state.viewingEarlyResults=false;state.batchTarget=Object.keys(state.answers).length+4;show("screen-quiz");askNext()};
$("restartBtn").onclick=()=>location.reload();