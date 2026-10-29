const state = {
  asked:[], current:null, round:0,
  sums:Object.fromEntries(TRAITS.map(t=>[t,0])), counts:Object.fromEntries(TRAITS.map(t=>[t,0])),
  domainCounts:{}, finalQueue:[], result:null
};

const $ = id => document.getElementById(id);
const screens = ['intro-screen','quiz-screen','analyzing-screen','result-screen'];
function showScreen(id){ screens.forEach(s=>{const el=$(s); el.hidden=s!==id; el.classList.toggle('screen--active',s===id);}); window.scrollTo({top:0,behavior:'smooth'}); }
function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }
function traitIndex(t){ return TRAITS.indexOf(t); }
function vectorObject(arr){ return Object.fromEntries(TRAITS.map((t,i)=>[t,arr[i]])); }
function avgUser(){ return Object.fromEntries(TRAITS.map(t=>[t,state.counts[t] ? state.sums[t]/state.counts[t] : 3])); }
function distance(user, char){ const v=CHARACTERS[char].vector; return TRAITS.reduce((s,t,i)=>s+Math.abs(user[t]-v[i]),0)/TRAITS.length; }
function rankings(){ const u=avgUser(); return Object.keys(CHARACTERS).map(k=>({key:k,d:distance(u,k)})).sort((a,b)=>a.d-b.d); }
function varianceForTrait(keys,t){ const i=traitIndex(t), vals=keys.map(k=>CHARACTERS[k].vector[i]), mean=vals.reduce((a,b)=>a+b,0)/vals.length; return vals.reduce((s,x)=>s+(x-mean)**2,0)/vals.length; }
function recentIds(){ try{return JSON.parse(localStorage.getItem('hgRecentQuestions')||'[]')}catch{return []} }
function saveRecent(ids){ try{localStorage.setItem('hgRecentQuestions',JSON.stringify(ids.slice(-24)))}catch{} }

function reset(){
  state.asked=[];state.current=null;state.round=0;state.finalQueue=[];state.result=null;state.domainCounts={};
  TRAITS.forEach(t=>{state.sums[t]=0;state.counts[t]=0});
}

function chooseInitialEight(){
  const recent = new Set(recentIds());
  let pool = QUESTIONS.filter(q=>!recent.has(q.id));
  if(pool.length<24) pool=[...QUESTIONS];
  let best=null, bestScore=-Infinity;
  const attempts=6000;
  for(let n=0;n<attempts;n++){
    const picked=[], used=new Set();
    while(picked.length<8){
      const i=Math.floor(Math.random()*pool.length);
      if(!used.has(i)){used.add(i);picked.push(pool[i]);}
    }
    const counts=Object.fromEntries(TRAITS.map(t=>[t,0])); const domains={};
    picked.forEach(q=>{q.traits.forEach(t=>counts[t]++);domains[q.domain]=(domains[q.domain]||0)+1;});
    const covered=TRAITS.filter(t=>counts[t]>0).length;
    const over=TRAITS.reduce((sum,t)=>sum+Math.max(0,counts[t]-2)**2,0);
    const domainPenalty=Object.values(domains).reduce((sum,c)=>sum+Math.max(0,c-2)*3,0);
    const score=covered*100 - over*12 - domainPenalty + Math.random();
    if(score>bestScore){bestScore=score;best=picked;}
    if(covered===14 && over===0 && domainPenalty===0) break;
  }
  return best;
}

let initialQueue=[];
function buildAdaptiveFour(){
  const top=rankings().slice(0,3).map(r=>r.key);
  const used=new Set(state.asked.map(q=>q.id));
  const pool=QUESTIONS.filter(q=>!used.has(q.id));
  const need=TRAITS.filter(t=>state.counts[t]<2);
  let best=null,bestScore=-Infinity;

  // Search four-question combinations that close every remaining coverage gap.
  // ~100k combinations with the current bank: fast enough in-browser and guarantees
  // the final 12-round profile measures every trait at least twice whenever possible.
  for(let a=0;a<pool.length-3;a++) for(let b=a+1;b<pool.length-2;b++)
  for(let c=b+1;c<pool.length-1;c++) for(let d=c+1;d<pool.length;d++){
    const set=[pool[a],pool[b],pool[c],pool[d]];
    const add=Object.fromEntries(TRAITS.map(t=>[t,0]));
    set.forEach(q=>q.traits.forEach(t=>add[t]++));
    if(need.some(t=>state.counts[t]+add[t]<2)) continue;
    const domainAdds={}; set.forEach(q=>domainAdds[q.domain]=(domainAdds[q.domain]||0)+1);
    let score=0;
    set.forEach(q=>q.traits.forEach(t=>score += varianceForTrait(top,t)*5));
    score -= Object.entries(domainAdds).reduce((sum,[dom,cnt])=>sum+Math.max(0,(state.domainCounts[dom]||0)+cnt-2)*2.5,0);
    score += Math.random()*.15;
    if(score>bestScore){bestScore=score;best=set;}
  }
  if(best) return shuffle(best);

  // Fallback: greedy coverage + discrimination if an exact four-question cover is impossible.
  const chosen=[]; const tempCounts={...state.counts}; const tempDomains={...state.domainCounts};
  while(chosen.length<4){
    let pick=null,pickScore=-Infinity;
    for(const q of pool){
      if(chosen.includes(q)) continue;
      let score=Math.random();
      q.traits.forEach(t=>{
        if(tempCounts[t]===0) score+=30;
        else if(tempCounts[t]===1) score+=18;
        score+=varianceForTrait(top,t)*4;
      });
      score -= (tempDomains[q.domain]||0)*2.5;
      if(score>pickScore){pickScore=score;pick=q;}
    }
    if(!pick) break;
    chosen.push(pick); pick.traits.forEach(t=>tempCounts[t]++); tempDomains[pick.domain]=(tempDomains[pick.domain]||0)+1;
  }
  return chosen;
}

function startQuiz(){ reset(); initialQueue=chooseInitialEight(); showScreen('quiz-screen'); nextQuestion(); }

function nextQuestion(){
  if(state.round===8 && state.finalQueue.length===0) state.finalQueue=buildAdaptiveFour();
  let q;
  if(state.round<8) q=initialQueue[state.round]; else q=state.finalQueue[state.round-8];
  if(!q){ finishQuiz(); return; }
  state.current=q; state.round++;
  renderQuestion(q);
}

function renderQuestion(q){
  $('round-label').textContent=String(state.round).padStart(2,'0')+' / 12';
  $('phase-label').textContent=state.round<=8?'PROFILE':'REFINING';
  $('progress-bar').style.width=`${(state.round/12)*100}%`;
  $('question-text').textContent=q.text;
  const box=$('answers'); box.innerHTML='';
  shuffle(q.answers).forEach((a,i)=>{
    const b=document.createElement('button'); b.className='answer-btn';
    b.innerHTML=`<span class="num">${String(i+1).padStart(2,'0')}</span><span>${a.text}</span>`;
    b.addEventListener('click',()=>answer(q,a)); box.appendChild(b);
  });
}

function answer(q,a){
  q.traits.forEach((t,i)=>{state.sums[t]+=a.scores[i];state.counts[t]++});
  state.asked.push(q); state.domainCounts[q.domain]=(state.domainCounts[q.domain]||0)+1;
  if(state.round>=12){ finishQuiz(); } else nextQuestion();
}

function strongestTraitSentence(user){
  const ordered=TRAITS.map(t=>({t,v:user[t],dev:Math.abs(user[t]-3)})).sort((a,b)=>b.dev-a.dev).slice(0,3);
  const phrases={
    care:v=>v>3.5?'other people’s wellbeing has real weight in your decisions':'you can separate care from obligation when necessary',
    loyalty:v=>v>3.5?'personal loyalty often outweighs abstract principles':'you can put a larger goal ahead of personal allegiance',
    autonomy:v=>v>3.5?'you resist being managed and prefer your own judgment':'you are relatively comfortable working inside agreed structures',
    strategy:v=>v>3.5?'you naturally think beyond the immediate move':'you tend to solve the situation in front of you before optimizing the long game',
    directness:v=>v>3.5?'you would rather make tension explicit than leave it vague':'you often prefer subtlety over confrontation',
    charisma:v=>v>3.5?'you are comfortable influencing the emotional temperature of a room':'you do not need social visibility to feel effective',
    persona:v=>v>3.5?'you can adapt how you present yourself without feeling entirely false':'calculated self-presentation is not your natural first move',
    risk:v=>v>3.5?'you tolerate meaningful risk better than most':'you prefer avoidable risk to have a very good reason',
    moral:v=>v>3.5?'you can accept morally messy means when the outcome feels important enough':'you maintain fairly firm limits on what an acceptable solution can require',
    control:v=>v>3.5?'you become more comfortable taking control when things drift':'you are relatively willing to leave agency distributed among people',
    structure:v=>v>3.5?'clear systems and expectations help you operate well':'you are comfortable improvising when formal structure gets in the way',
    guarded:v=>v>3.5?'you protect vulnerable information carefully':'you are comparatively willing to let people see what you feel',
    systems:v=>v>3.5?'you look for mechanisms and leverage rather than isolated symptoms':'you tend to trust direct experience more than abstract systems',
    symbolic:v=>v>3.5?'you naturally use imagery, story or meaning as part of how you think':'you tend to favor concrete usefulness over symbolism'
  };
  const p=ordered.map(x=>phrases[x.t](x.v));
  return `Across very different situations, ${p[0]}, ${p[1]}, and ${p[2]}.`;
}

function closestDifference(primary,runner,user){
  const pv=vectorObject(CHARACTERS[primary].vector), rv=vectorObject(CHARACTERS[runner].vector);
  const diffs=TRAITS.map(t=>({t,gap:Math.abs(pv[t]-rv[t]),toward:Math.abs(user[t]-pv[t])<Math.abs(user[t]-rv[t])})).filter(x=>x.toward).sort((a,b)=>b.gap-a.gap);
  const t=diffs[0]?.t || 'strategy';
  const labels={care:'how strongly other people’s wellbeing changes your choices',loyalty:'how much personal loyalty outweighs larger goals',autonomy:'how strongly you resist external control',strategy:'how far ahead you naturally plan',directness:'how directly you handle tension',charisma:'how much you use social energy',persona:'how fluidly you adapt your public presentation',risk:'how much uncertainty you tolerate',moral:'how flexible your methods become under pressure',control:'how much control you want over outcomes',structure:'how much you rely on order and procedure',guarded:'how much of your inner state you keep protected',systems:'how much you solve through mechanisms and leverage',symbolic:'how much you think through story, image and symbolism'};
  return `You share several patterns with ${CHARACTERS[runner].name}, but ${labels[t]} pulled you closer to ${CHARACTERS[primary].name}.`;
}

function finishQuiz(){
  const ids=[...recentIds(),...state.asked.map(q=>q.id)]; saveRecent(ids);
  const ranks=rankings(); const primary=ranks[0].key, runner=ranks[1].key; const user=avgUser();
  state.result={primary,runner,user,ranks};
  showScreen('analyzing-screen');
  setTimeout(()=>renderResult(),2100);
}

function renderResult(){
  const {primary,runner,user,ranks}=state.result; const c=CHARACTERS[primary], r=CHARACTERS[runner];
  const gap=ranks[1].d-ranks[0].d;
  $('match-strength').textContent=gap>.28?'VERY STRONG MATCH':gap>.12?'STRONG MATCH':'CLOSE MATCH';
  $('character-name').textContent=c.name; $('character-archetype').textContent=c.archetype;
  $('core-pattern').textContent=c.core+' '+strongestTraitSentence(user);
  $('why-list').innerHTML=c.why.map(x=>`<li>${x}</li>`).join('');
  $('edge-text').textContent=c.edge; $('blind-text').textContent=c.blind; $('pressure-text').textContent=c.pressure;
  $('runner-name').textContent=r.name; $('runner-text').textContent=closestDifference(primary,runner,user);
  $('portrait-title').textContent=`BECOME ${c.name.toUpperCase()}`;
  $('portrait-prompt').textContent=portraitPrompt(primary);
  showScreen('result-screen');
}

function portraitPrompt(key){
  const c=CHARACTERS[key];
  return `Use my uploaded selfie as the identity reference. Create a cinematic, photorealistic Panem-world portrait of ME as the ${c.name} archetype (${c.archetype}). Preserve my recognizable facial identity, apparent age, facial geometry and realistic skin texture. Do not make me look like the actor who played the character and do not create a face-swap effect. Translate the archetype through wardrobe, posture, setting and atmosphere: ${c.visual}. Premium film-poster composition, restrained world-building, believable materials, subtle dramatic lighting. Keep my gender presentation consistent with the selfie unless I ask otherwise.`;
}

function toast(msg){ const t=$('toast');t.textContent=msg;t.classList.add('toast--show');setTimeout(()=>t.classList.remove('toast--show'),1800); }
function copyText(text,msg='COPIED'){ navigator.clipboard?.writeText(text).then(()=>toast(msg)).catch(()=>toast('SELECT AND COPY MANUALLY')); }

$('start-btn').addEventListener('click',startQuiz);
$('quit-btn').addEventListener('click',()=>{if(confirm('Quit this run?')){reset();showScreen('intro-screen')}});
$('restart-btn').addEventListener('click',startQuiz);
$('share-btn').addEventListener('click',()=>{
  if(!state.result)return; const c=CHARACTERS[state.result.primary], r=CHARACTERS[state.result.runner];
  copyText(`I took “Which Hunger Games Character Are You?”\n\nMy match: ${c.name} — ${c.archetype}\nClosest alternative: ${r.name}`,'RESULT COPIED');
});
$('portrait-btn').addEventListener('click',()=>$('portrait-dialog').showModal());
$('portrait-close').addEventListener('click',()=>$('portrait-dialog').close());
$('copy-prompt-btn').addEventListener('click',()=>copyText($('portrait-prompt').textContent,'PORTRAIT PROMPT COPIED'));
$('portrait-dialog').addEventListener('click',e=>{if(e.target===$('portrait-dialog'))$('portrait-dialog').close()});

showScreen('intro-screen');
