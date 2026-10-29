QUESTIONS.push(
Q('hs40','money',['strategy','risk','systems'],'You have enough money for either a big thing you really want now or to keep saving for something better later.',[
 ['Wait and compare what each option actually gives me.',5,2,5],['Buy the thing I want now. Money is also for enjoying life.',2,5,2],['Set a limit and only buy if I stay above it.',4,2,4],['Look for a cheaper or second-hand version first.',4,2,5],['Keep saving. Future options are worth more to me.',5,1,4],['If I have wanted it for months, I trust that and buy it.',3,4,2]
]),
Q('hs41','school',['autonomy','symbolic','structure'],'Your school has an old tradition almost everyone complains about, but teachers insist it is “part of the school.”',[
 ['Keep it. Traditions can matter even if they are a bit weird.',2,4,5],['Replace it with something that actually means something now.',4,5,4],['Let people choose whether to participate.',5,2,3],['Redesign it without completely throwing it away.',3,5,4],['Ask what the tradition was supposed to represent in the first place.',3,3,4],['Stop pretending everyone cares and move on.',5,1,1]
]),
Q('hs42','friends',['care','guarded','control'],'A friend calls you really upset late at night over a breakup or friendship drama.',[
 ['Stay with them until they calm down.',5,1,1],['Help them separate what can be fixed tonight from what cannot.',5,2,4],['Take over one practical thing if I can.',5,3,5],['Listen without turning it into advice unless they ask.',5,1,1],['Keep my own feelings out of it and be the stable person.',4,5,3],['Give them one clear next step so they stop spiraling.',4,3,4]
]),
Q('hs43','school',['systems','strategy','control'],'You have multiple assignments, a test and a group project all due in the same week.',[
 ['Map everything out and look for what depends on what.',5,5,3],['Choose the most important thing and ignore the rest for a bit.',4,5,5],['Make a schedule and stick to it as closely as possible.',4,5,4],['Ask whether any deadlines can realistically move.',4,5,3],['Break each thing into the smallest next step and start there.',5,4,3],['Take control of the group-project part so at least one moving piece is predictable.',4,4,5]
]),
Q('hs44','social',['loyalty','charisma','structure'],'You are helping organize a party or school event where several people in the friend group do not get along.',[
 ['Plan who is with who so obvious conflicts are less likely.',4,2,5],['Invite everyone and trust people to behave.',3,4,2],['Keep my closest friends together even if the overall plan is less tidy.',5,2,3],['Ask one socially smart friend to help me think through the group dynamics.',4,4,4],['Create enough structure that people are not forced into awkward situations.',4,3,5],['Focus on making the event fun. Good energy can fix a lot.',3,5,2]
]),
Q('hs45','social',['persona','guarded','charisma'],'Someone gives you a really personal compliment in front of other people.',[
 ['Just say thank you and let the moment happen.',3,2,3],['Deflect with humor.',4,4,5],['Compliment them back and move the attention away from me.',4,3,4],['Enjoy it. Being seen is not automatically embarrassing.',4,1,5],['Feel awkward, but do not ruin the compliment by arguing with it.',2,4,2],['Turn it into something lighter before it gets too personal.',5,5,4]
]),
Q('hs46','school',['autonomy','care','strategy'],'There is an annoying problem at school everyone complains about, but nobody actually does anything.',[
 ['Start a small group and see if anyone joins.',4,4,5],['Fix the part that affects me and stop waiting for everyone else.',5,2,2],['Find out who actually has the power to change it.',4,3,5],['Make a simple proposal so saying yes becomes easier than ignoring it.',4,4,5],['Help if someone else organizes it, but I do not want to own the whole thing.',2,4,2],['Do one visible useful thing first and see if that creates momentum.',4,5,4]
]),
Q('hs47','summer',['risk','autonomy','strategy'],'You have three options for summer: a safe paid job, something exciting with less money, or a risky opportunity that could open bigger doors.',[
 ['Take the safe job if it gives me independence and money.',1,3,4],['Take the exciting option. I would rather care about what I am doing.',4,4,3],['Take the risky one if the downside is survivable.',5,5,5],['Think about which one changes my options next year, not just this summer.',3,4,5],['Choose the one where I have the most freedom.',3,5,4],['Try to negotiate or combine options before accepting the choices as fixed.',3,4,5]
]),
Q('hs48','friends',['directness','guarded','loyalty'],'You send an important message to a close friend and they ignore it for days while still being active online.',[
 ['Ask directly whether something is wrong.',5,2,5],['Wait. If they need space, I can give it.',1,4,4],['Send one follow-up and then stop chasing.',3,4,3],['Feel hurt, but do not show it unless it becomes a pattern.',2,5,4],['Tell them clearly that being ignored bothered me.',5,2,5],['Assume there may be context I cannot see and give it more time.',1,3,4]
]),
Q('hs49','school',['symbolic','systems','risk'],'Your class or club has tried the obvious ways to solve the same problem and none of them worked.',[
 ['Change the question completely and look at the problem from another angle.',5,5,4],['Break the problem into smaller parts and test them one by one.',2,5,2],['Try the weird idea everyone keeps dismissing.',5,3,5],['Ask someone outside the group how they would solve it.',4,4,4],['Stop adding ideas and find the one constraint every solution hits.',2,5,2],['Run a small experiment that is cheap to fail.',4,5,4]
]),
Q('hs50','friends',['symbolic','care','loyalty'],'You want to make a close friend’s birthday feel special without spending a lot of money.',[
 ['Make something personal that only they will fully get.',5,5,5],['Plan time around something they genuinely love doing.',3,5,5],['Choose one small thing connected to a shared memory.',5,4,4],['Ask them what they actually want instead of guessing.',2,5,4],['Recreate an old joke or moment from your friendship.',5,5,5],['Keep it simple. Being there matters more than producing a huge gesture.',2,5,5]
]),
Q('hs51','style',['persona','autonomy','symbolic'],'There is an unwritten dress code in a school setting where you want people to take you seriously.',[
 ['Follow it closely. Clothes are not the battle I care about.',4,2,1],['Fit the vibe, but include one thing that feels unmistakably me.',4,4,4],['Dress how I want if I am comfortable with it.',1,5,4],['Use the expected look strategically because people judge before they know you.',5,3,3],['Push it just enough to see what people actually care about.',3,5,4],['Make the expected look more interesting instead of rejecting it.',5,3,5]
])
);

// Touch devices can keep CSS :hover stuck after a tap. Neutralize that state so
// the next question never looks as if an answer is already selected.
if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
  const touchStyle = document.createElement('style');
  touchStyle.textContent = `
    .answer-btn { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    .answer-btn:hover,
    .answer-btn:focus,
    .answer-btn:focus-visible {
      border-color: #2c2b2b !important;
      background: linear-gradient(180deg,#151517,#111113) !important;
      transform: none !important;
      outline: none !important;
    }
    .answer-btn:active {
      border-color: var(--gold2) !important;
      background: #191814 !important;
      transform: scale(.995) !important;
    }
  `;
  document.head.appendChild(touchStyle);
}
