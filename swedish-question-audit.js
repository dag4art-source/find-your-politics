/* Swedish language + beginner-mode audit, 2026-08-22. Pure wording/UI layer: no scores or dimensions changed. */
(function(){
  const categorySv={
    Economy:'Ekonomi',Taxes:'Skatter',Labour:'Arbetsmarknad',Welfare:'Välfärd',Crime:'Brott & trygghet',Migration:'Migration',Citizenship:'Medborgarskap',Integration:'Integration',Housing:'Bostäder',Healthcare:'Vård',Education:'Skola',Climate:'Klimat',Energy:'Energi',EU:'EU',Defence:'Försvar',State:'Statens roll',Government:'Statens roll','Social values':'Värderingar'
  };

  /* Swedish question-category labels should never fall back to English. */
  const baseCategoryText=categoryText;
  categoryText=function(q){
    if(state.lang==='sv')return categorySv[q.category]||prioritySv[q.category]||q.category;
    return baseCategoryText(q);
  };

  /* Beginner explainers: concrete Swedish, one idea at a time, minimal political jargon. */
  const explainSv={
    market_economy:'Vem ska styra flest ekonomiska beslut? Företag och konsumenter genom marknaden, eller staten genom regler, investeringar och ägande?',
    tax_work_income:'Det handlar om skatt på lön och andra inkomster från arbete. Lägre skatt betyder mer kvar efter skatt. Högre skatt ger staten mer pengar att använda.',
    tax_wealth_property:'Det handlar om skatt på stora tillgångar, till exempel dyra fastigheter och stora förmögenheter, inte om skatt på lön.',
    welfare_qualification:'Det handlar om vilka villkor som ska gälla för att få olika välfärdsförmåner, till exempel hur länge man bott eller arbetat i Sverige.',
    unemployment_security:'Det handlar om hur stor del av inkomsten man ska kunna behålla när man blir arbetslös.',
    sickness_social_insurance:'Det handlar om balansen mellan ekonomisk trygghet när man är sjuk och krav på att återgå i arbete när det är möjligt.',
    labour_flexibility:'Det handlar om balansen mellan trygghet för den som har ett jobb och hur lätt det ska vara för arbetsgivare att anställa, ändra organisationen eller säga upp.',
    inequality_focus:'Det handlar om hur viktigt det är att minska ekonomiska skillnader jämfört med att prioritera tillväxt och högre levnadsstandard.',
    public_ownership:'Det handlar om hur många företag staten själv bör äga, särskilt inom viktiga eller strategiska områden.',
    crime_punishment:'Det handlar om hur brottspolitiken ska väga hårdare straff och polisinsatser mot förebyggande arbete och rehabilitering.',
    surveillance_powers:'Det handlar om hur mycket övervakning och andra polisbefogenheter som är rimliga för att bekämpa grov brottslighet.',
    asylum_migration:'Det handlar om hur öppen eller restriktiv Sveriges asylpolitik bör vara för människor som söker skydd.',
    skilled_migration:'Det handlar om människor som flyttar till Sverige för att arbeta, inte om asyl.',
    citizenship_requirements:'Det handlar om vilka krav som bör gälla för att bli svensk medborgare, till exempel språk, tid i landet och egen försörjning.',
    integration:'Det handlar om vad som ska räknas som lyckad integration: språk, arbete och deltagande i samhället, och hur mycket kulturell anpassning som också bör krävas.',
    housing_supply:'Det handlar om hur Sverige ska få fram fler bostäder: mer offentligt byggande och styrning, eller enklare regler och större utrymme för privata byggare.',
    rent_regulation:'Det handlar om hur hyror ska bestämmas: främst genom regler och förhandlingar, eller mer genom marknaden.',
    healthcare_choice:'Det handlar om hur stor roll privata vårdgivare ska få ha i vård som betalas med skattepengar.',
    education_choice:'Det handlar om hur mycket familjer ska kunna välja skola jämfört med hur mycket systemet ska styras gemensamt.',
    school_discipline:'Det handlar om hur mycket skolan ska betona ordning, tydliga krav och lärarnas auktoritet jämfört med stöd och inkludering.',
    welfare_private_profit:'Det handlar om privata företag som driver skola, vård eller omsorg med skattepengar och samtidigt gör vinst.',
    climate_cost_sensitivity:'Det handlar om hur stora kostnader hushåll och företag bör acceptera för att minska utsläppen snabbare.',
    nuclear_energy:'Det handlar om vilken roll kärnkraft ska ha i Sveriges framtida elproduktion.',
    eu_integration:'Det handlar om vilka beslut Sverige bör fatta tillsammans med andra EU-länder och vilka beslut Sverige bör behålla själv.',
    social_values:'Det handlar om hur aktiv staten bör vara i frågor om familj, relationer, kön och andra sociala normer.',
    state_scope:'Det handlar om hur mycket staten själv ska göra och finansiera jämfört med vad individer, företag och civilsamhället ska sköta.',
    defence_spending:'Det handlar om hur mycket pengar Sverige bör lägga på försvaret jämfört med andra offentliga utgifter.'
  };
  const tradeoffSv={
    market_economy:'Mer marknad kan ge konkurrens och flexibilitet. Mer statlig styrning kan ge större kontroll och samordning.',
    tax_work_income:'Mer pengar kvar efter skatt eller mer pengar till offentliga utgifter.',
    tax_wealth_property:'Mer beskattning av stora tillgångar eller starkare incitament att spara och investera.',
    welfare_qualification:'Bred tillgång till välfärd eller tydligare krav på arbete, bosättning eller inbetalningar.',
    unemployment_security:'Starkare ekonomisk trygghet vid arbetslöshet eller starkare ekonomiska drivkrafter att snabbt hitta nytt arbete.',
    sickness_social_insurance:'Stark ekonomisk trygghet vid sjukdom eller stramare regler för att minska felaktiga utbetalningar och underlätta återgång i arbete.',
    labour_flexibility:'Trygghet för anställda eller större flexibilitet för arbetsgivare och lättare inträde på arbetsmarknaden.',
    inequality_focus:'Mindre ekonomiska skillnader eller större fokus på tillväxt och möjligheter.',
    public_ownership:'Direkt offentlig kontroll eller mindre statligt ägande och större privat ansvar.',
    crime_punishment:'Hårdare straff och kontroll eller mer förebyggande arbete och rehabilitering.',
    surveillance_powers:'Trygghet och polisens verktyg eller integritet och rättssäkerhet.',
    asylum_migration:'Skydd för människor på flykt eller en mer begränsad invandring.',
    skilled_migration:'Lättare att rekrytera internationell kompetens eller stramare kontroll över arbetskraftsinvandringen.',
    citizenship_requirements:'Lättare tillgång till medborgarskap eller högre krav innan man blir medborgare.',
    integration:'Frihet att behålla sin kultur eller större krav på anpassning till svenska normer.',
    housing_supply:'Mer offentlig styrning eller enklare regler och större marknadsutrymme för att bygga fler bostäder.',
    rent_regulation:'Stabilare och mer reglerade hyror eller större möjlighet för hyror att spegla efterfrågan.',
    healthcare_choice:'Mer offentlig kontroll eller större valfrihet mellan offentliga och privata vårdgivare.',
    education_choice:'Större valfrihet för familjer eller mer gemensam styrning för att motverka skillnader mellan skolor.',
    school_discipline:'Mer ordning och tydligare auktoritet eller större fokus på stöd och inkludering.',
    welfare_private_profit:'Begränsa vinstuttag eller tillåta vinst när kvalitetskraven uppfylls.',
    climate_cost_sensitivity:'Snabbare utsläppsminskningar eller lägre kostnader för hushåll och företag.',
    nuclear_energy:'Mer kärnkraft eller större fokus på andra energislag.',
    eu_integration:'Mer gemensamt beslutsfattande i EU eller mer svensk självbestämmanderätt.',
    social_values:'Staten driver vissa värderingar aktivt eller håller sig mer neutral i människors privata liv.',
    state_scope:'En större offentlig roll eller mer ansvar hos individer, företag och civilsamhälle.',
    defence_spending:'Mer pengar till försvar eller mer pengar kvar till andra offentliga behov.'
  };
  beginnerExplainSv=d=>explainSv[d]||'Frågan handlar om en verklig politisk avvägning. Välj det alternativ som ligger närmast hur du själv tycker att samhället bör fungera.';
  beginnerTradeoffSv=d=>tradeoffSv[d]||'Olika alternativ prioriterar olika värden och accepterar olika kostnader eller risker.';

  /* Fix a handful of Swedish strings that were correct in meaning but sounded translated or unnecessarily technical. */
  const previousPatch=window.FYP_V2_PATCH_BANK;
  window.FYP_V2_PATCH_BANK=function(s){
    if(previousPatch)previousPatch(s);
    if(!s.bank?.questions||s.bank.swedishLanguageAudited)return;
    const q=id=>s.bank.questions.find(x=>x.id===id);
    const set=(id,questionSv,answers)=>{
      const z=q(id);if(!z)return;if(questionSv)z.question_sv=questionSv;
      z.answers.forEach(a=>{if(answers?.[a.key])a.text_sv=answers[a.key]});
    };

    set('Q001','Vad bör i första hand styra Sveriges ekonomi?',{
      A:'Staten bör styra en större del av investeringarna och den ekonomiska utvecklingen.',
      B:'Marknaden bör styra det mesta, men staten bör styra viktiga sektorer.',
      C:'Marknaden bör vara utgångspunkten, medan staten sätter tydliga och rättvisa regler.',
      D:'Staten bör lägga sig i ekonomiska beslut så lite som möjligt.'
    });
    set('Q008','Vilken roll bör fackförbund och kollektivavtal ha på arbetsmarknaden?',{
      A:'Facken bör få större inflytande och anställda starkare rättsligt skydd.',
      B:'Dagens modell med kollektivavtal bör i stort sett behållas.',
      C:'Behåll kollektivavtalen men ge större utrymme för individuella lösningar.',
      D:'Fack och kollektivavtal bör ha betydligt mindre betydelse på arbetsmarknaden.'
    });
    set('Q009','Hur bör välfärdsförmåner fungera för personer som nyligen har flyttat lagligt till Sverige?',{
      A:'De bör i stort sett ha samma tillgång som andra som bor i Sverige.',
      B:'Vissa förmåner kan kräva en tids bosättning, men systemet bör i huvudsak vara öppet för alla boende.',
      C:'Flera förmåner bör kräva arbete, inbetalningar eller ett visst antal år i Sverige.',
      D:'Full tillgång bör i stor utsträckning kräva medborgarskap eller många års inbetalningar.'
    });
    set('Q012','Ett privat företag driver skola eller vård med skattepengar, uppfyller kvalitetskraven och gör vinst. Vad tycker du bör gälla?',{
      A:'Vinst bör i regel inte vara tillåten.',B:'Vinst bör bara tillåtas i mycket begränsad omfattning.',C:'Vinst är okej om kvaliteten är hög och verksamheten granskas ordentligt.',D:'Vinst är inget politiskt problem om kvaliteten håller och människor har verklig valfrihet.'
    });
    set('Q016','Bör polisen få använda vissa tvångsmedel mot personer som ännu inte misstänks för ett bestämt brott, om underrättelser pekar på koppling till gängbrottslighet?',{
      A:'Nej, det bör krävas misstanke om ett bestämt brott.',B:'Bara i undantagsfall och med stark kontroll från domstol.',C:'Ja, vid grov organiserad brottslighet och med tydliga rättssäkerhetskrav.',D:'Ja, i större omfattning när polisen bedömer att det finns ett allvarligt gänghot.'
    });
    set('Q019','Vilka krav bör ställas för att bli svensk medborgare?',{
      A:'Det bör vara relativt lätt efter en period av laglig bosättning.',B:'Krav på svenska, grundläggande samhällskunskap och att man inte har begått grova brott.',C:'Krav på språk, samhällskunskap, egen försörjning och längre tid i Sverige.',D:'Mycket höga krav och större möjligheter att återkalla medborgarskap där grundlagen tillåter det.'
    });
    set('Q020','Vad bör krävas för att integration ska räknas som lyckad, utöver att följa lagen?',{
      A:'Språk och deltagande i samhället räcker. Kulturell identitet är en privat fråga.',B:'Språk, arbete och viss anpassning till gemensamma samhällsnormer.',C:'Tydlig anpassning till svenska kulturella normer.',D:'Målet bör vara att människor i hög grad anpassar sig till svensk kultur.'
    });
    set('Q023','Hur bör Sverige framför allt få fram fler bostäder?',{
      A:'Mer offentligt och kommunalt byggande, tillsammans med tydligare reglering.',B:'Offentliga investeringar kombinerat med enklare regler för privat byggande.',C:'Förenkla planregler och tillstånd, med offentliga investeringar i infrastruktur där det behövs.',D:'Betydligt enklare planregler och tillstånd, med större ansvar för privata byggare.'
    });
    set('Q026','Vem bör få driva vård som finansieras med skattepengar?',{
      A:'Nästan bara offentliga vårdgivare.',B:'Främst offentliga vårdgivare, med ett begränsat antal privata alternativ.',C:'Det bör finnas ett tydligt val mellan offentliga och privata vårdgivare.',D:'Det bör finnas bred konkurrens mellan olika vårdgivare inom ett skattefinansierat system.'
    });
    set('Q031','Hur bör Sverige väga snabbare klimatomställning mot kostnader för hushåll och företag?',{
      A:'Minska utsläppen snabbare även om kostnaderna märks tydligt.',B:'Behåll höga klimatambitioner men skydda hushåll och företag från de största kostnaderna.',C:'Sänk tempot när klimatåtgärder blir tydligt dyra för hushåll eller företag.',D:'Dra ned på åtgärder som höjer levnadskostnaderna, även om utsläppen då minskar långsammare.'
    });
    set('Q033','Vilken roll bör kärnkraften ha i Sveriges framtida elproduktion?',{
      A:'Fasa ut kärnkraften med tiden.',B:'Behåll den kärnkraft som finns men satsa nya investeringar främst på annat.',C:'Bygg ny kärnkraft tillsammans med förnybar energi.',D:'Gör en stor utbyggnad av kärnkraft till en nationell prioritet.'
    });
    set('Q035','Hur mycket mer makt bör Sverige flytta till EU?',{
      A:'Flytta mer beslutskraft till EU när gemensamma lösningar fungerar bättre.',B:'Samarbeta nära inom EU men var försiktig med att flytta mer makt dit.',C:'Behåll hellre beslut i Sverige även om vi då går miste om vissa fördelar med EU-samarbetet.',D:'Arbeta aktivt för att flytta tillbaka betydande makt från EU till Sverige.'
    });
    set('Q040','När lagar och politik påverkar familjeliv, kön och vuxnas relationer, vilken princip bör styra?',{
      A:'Politiken bör aktivt stärka jämlikhet och skydd mot diskriminering.',B:'Alla ska ha samma rättigheter, men staten bör inte gynna ett visst sätt att leva.',C:'Politiken bör ge visst företräde åt traditionella sociala normer och familjenormer.',D:'Politiken bör aktivt stärka traditionella sociala värderingar och familjenormer.'
    });
    set('Q051','Ett parti håller med dig om ekonomi, brott och vård men driver starkt sociala värderingar som du motsätter dig. Hur mycket bör det påverka ditt val?');
    set('Q052','Ett parti ligger nära dig i de flesta svenska sakfrågor men vill ha mycket djupare EU-integration än du. Hur mycket bör det påverka ditt val?');
    set('Q053','Ett parti ligger nära dig i de flesta frågor men dess klimatpolitik skulle höja dina levnadskostnader tydligt. Hur mycket bör det påverka ditt val?');
    set('Q054','Ett parti ligger nära dig ekonomiskt men har en mycket mer restriktiv eller mycket mer öppen invandringspolitik än du. Hur mycket bör det påverka ditt val?');
    set('Q055','Ett parti håller med dig om straff men vill ge polisen övervakningsbefogenheter som du tycker går för långt. Hur mycket bör det påverka ditt val?');
    set('Q056','Vilken beskrivning ligger närmast din syn på vad staten bör göra?',{
      A:'Staten bör aktivt forma samhället för att öka jämlikhet och trygghet.',B:'Staten bör ingripa pragmatiskt där det tydligt förbättrar resultatet.',C:'Staten bör göra ett mindre antal kärnuppgifter riktigt bra.',D:'Så många beslut som möjligt bör lämnas till individer, marknader och civilsamhälle.'
    });
    set('Q057','Skulle du acceptera något större ekonomiska skillnader om vanliga människors levnadsstandard samtidigt ökade snabbare?',{
      A:'Nej.',B:'Bara i liten utsträckning.',C:'Ja.',D:'Ja, tydligt. Högre levnadsstandard är mycket viktigare än storleken på skillnaderna.'
    });

    s.bank.swedishLanguageAudited=true;
  };
})();
