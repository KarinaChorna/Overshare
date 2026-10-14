/* ============================ DATA ============================ */
const ME = { name:'Karina', emoji:'✦', tag:'@karina' };

const FRIENDS = [
  {id:'f1', name:'Tobi',  emoji:'🦊', color:'--pal-sb1'},
  {id:'f2', name:'Mia',   emoji:'🌸', color:'--pal-fu1'},
  {id:'f3', name:'Jonah', emoji:'🐿️', color:'--pal-pk2'},
  {id:'f4', name:'Priya', emoji:'🦋', color:'--pal-nf1'},
];
const F = id => FRIENDS.find(f=>f.id===id);

let QUIZZES = [
  { id:'q1', subject:'SOCIAL STUDIES', sub:'who are you', code:'SOC', bg:['--pal-lp1','--pal-lp2'], text:'#6E1F45', creator:'Overshare', format:'Quiz', questions:[
    {a:'Summer',b:'Winter',ea:'☀️',eb:'❄️'},
    {a:'Ocean',b:'Mountains',ea:'🌊',eb:'⛰️'},
    {a:'Double text',b:'Die wondering',ea:'💬',eb:'😶'},
    {a:'Expose camera roll',b:'Expose all messages',ea:'📸',eb:'💬'},
    {a:'Marry your first share suggestion',b:'Marry me',ea:'💍',eb:'😏'},
  ]},
  { id:'q2', subject:'ASTRONOMY', sub:'written in the stars', code:'AST', bg:['--pal-pw1','--pal-pw2'], text:'#2E2440', creator:'Overshare', format:'Quiz', questions:[
    {a:'Attachment issues',b:'Commitment issues',ea:'🥹',eb:'🏃'},
    {a:'Catch feelings',b:'Catch a case',ea:'💘',eb:'🚔'},
    {a:'Fall for a red flag',b:'Become one',ea:'🚩',eb:'😈'},
    {a:'Have a delulu era',b:'Have a villain era',ea:'🌈',eb:'😼'},
    {a:'Hopeless Romantic',b:'Hopeful Skeptic',ea:'💌',eb:'🤨'},
  ]},
];
let createdQuizIds = [];

// predictions[quizId][friendId] = {answers:[0/1,...]}  (I predicted for friend)
let predictions = { q1:{ f3:{answers:[0,1,0,1,0]} } };
// responses[quizId][friendId] = {answers:[0/1,...]}     (friend's real answers, simulated)
let responses = { q1:{ f3:{answers:[0,0,0,1,1]} } };
// guessesFromFriends[quizId][friendId] = {answers:[...]} (friend predicted about ME)
let guessesFromFriends = { q1:{ f2:{answers:[1,0,1,0,1]} } };
// myAnswers[quizId][friendId] = my honest answers to a quiz a friend sent me
let myAnswers = {};
// quizProgress[quizId][friendId] = {answers:[...], idx:N} — autosaved in-progress state for a quiz I'm answering, cleared once submitted
let quizProgress = {};

let CONFESSIONS = [
  { id:'cf1', subject:'PSYCHOLOGY', sub:'for research purposes', code:'PSY', bg:['--pal-fu1','--pal-dfu2'], text:'#FBEAF3', creator:'Overshare', mode:'choice', format:'Quiz', questions:[
    {text:'What animal energy do I give off?', options:['Raccoon with emotional intelligence','Cat that pretends to not care but secretly does','Tiny fox plotting something evil','Crow collecting shiny problems','Deer that panics gracefully']},
  ]},
  { id:'cf3', subject:'AFTER HOURS', sub:'shh', code:'A.H.', bg:['--pal-nf1','--pal-nf2'], text:'#FBEFF6', creator:'Overshare', mode:'reveal', format:'Pick Your Poison', pickCount:1, prompts:[
    'Last person you stalked online', 'Last lie', 'Last screenshot', 'Last time you played dumb', 'Last thing you did to get a reaction out of someone',
  ]},
  { id:'cf4', subject:'PHILOSOPHY', sub:'fight me', code:'PHI', bg:['--pal-sb1','--pal-sb2'], text:'#062A3D', creator:'Overshare', mode:'choice', format:'Case Study', questions:[
    {text:'If I disappeared, what would you assume?', options:['Government involvement','Character development','Went to jail','Kidnapped','Left the country / on the run','Fell asleep']},
  ]},
  { id:'cf5', subject:'MATHEMATICS', sub:'figure you out', code:'MATH', bg:['--pal-pk1','--pal-pk2'], text:'#6B2431', creator:'Overshare', mode:'predict', format:'Prediction', questions:[
    {text:'Your reaction when I text you?', options:["Damn, not her again","My favorite notification of the day","OMG yay, she texted me","She's so stupid","Is she mad?","I love her so much","Why can't she leave me alone?"]},
  ]},
  { id:'cf6', subject:'CHEMISTRY', sub:"let's test your reaction", code:'CHEM', bg:['--pal-fu1','--pal-fu2'], text:'#3D0A29', creator:'Overshare', mode:'choice', format:'Assessment', questions:[
    {text:'Have you ever mentioned me to a friend?', options:['Yes','No']},
    {text:'Have I said something before that triggered you?', options:['Yes','No']},
    {text:'Is there something you\u2019re hesitant for me to know about you?', options:['Yes','No']},
    {text:'Have you ever pretended to agree with me?', options:['Yes','No']},
    {text:'Have you ever tested me in some way?', options:['Yes','No']},
  ]},
];
let createdConfessionIds = [];
let profileTab = 'created'; // 'created' | 'taken' — which grid shows on the Profile screen
let score = 0; // Overshare Score — +1 per quiz/confession sent, +1 per quiz/confession taken
let scoreVisibility = 'private'; // 'private' | 'public'
let notifSettings = { quizInvites:true, messages:true, friendActivity:true }; // Settings > Notifications
let whoCanSend = 'everyone'; // 'everyone' | 'friends' | 'none' — Settings > Who can send me quizzes
let privacySettings = { privateAccount:false, showActivity:true }; // Settings > Privacy
let blockedFriendIds = []; // Settings > Blocked friends
function awardScore(n){ score += n; }
// confessionPredictions[confessionId][friendId] = [optionIndex,...] — my guesses, mode:'predict' only
let confessionPredictions = { cf5:{ f1:[2] } };
// confessionAnswers[confessionId][friendId] = [optionIndex,...] for mode:'choice'/'predict'
// confessionAnswers[confessionId][friendId] = [{promptIndex,promptText,answerText},...] for mode:'reveal'
let confessionAnswers = { cf4:{ f3:[2] }, cf5:{ f1:[5] } };

let messages = {
  f1: [ {type:'text',from:'them',text:'okay but who even is this app for'}, {type:'text',from:'me',text:'YOU. i need to figure you out'}, {type:'confessionReady', confessionId:'cf5', friendId:'f1', perspective:'sent'} ],
  f2: [ {type:'text',from:'them',text:'sent you something'}, {type:'incomingQuizToAnswer', quizId:'q1', friendId:'f2'} ],
  f3: [ {type:'text',from:'me',text:'ok i think i know you by now'}, {type:'resultReady', quizId:'q1', friendId:'f3', perspective:'sent'}, {type:'text',from:'me',text:'ok i need the real truth now'}, {type:'confessionReady', confessionId:'cf4', friendId:'f3', perspective:'sent'} ],
  f4: [ {type:'text',from:'them',text:'send me a quiz!! i wanna know what you think'}, {type:'confessionToAnswer', confessionId:'cf1', friendId:'f4'} ],
};

/* ============================ STATE ============================ */
let state = {
  view:'home',

  feedIndex:0,
  subIndex:{},        // per quiz id -> current horizontal panel index while browsing
  activeConv:null,
};
QUIZZES.forEach(q=> state.subIndex[q.id]=0 );
const favorites = {}; // card id -> true when favorited (in-memory, like state/quizProgress)
function favBtnHTML(id){
  const on = !!favorites[id];
  return `<button type="button" class="favBtn${on?' on':''}" data-fav="${id}" aria-label="Favorite" aria-pressed="${on}" onclick="toggleFav(event,'${id}')"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg></button>`;
}
function toggleFav(e,id){
  e.stopPropagation();
  favorites[id] = !favorites[id];
  document.querySelectorAll('.favBtn[data-fav="'+id+'"]').forEach(btn=>{
    btn.classList.toggle('on', favorites[id]);
    btn.setAttribute('aria-pressed', favorites[id]);
  });
  if(!favorites[id]){
    const savedList = document.getElementById('savedList');
    const card = savedList && savedList.querySelector('.quizBubble[data-qid="'+id+'"]');
    if(card){ card.remove(); if(!savedList.children.length) renderSavedList(); }
  }
}
/* ============================ SAVED VIEW ============================ */
function openSavedView(){
  const root=document.getElementById('overlayRoot');
  root.innerHTML = `
  <div class="overlay" style="background:var(--cream); color:var(--ink);">
    <div class="oTop" style="position:relative; padding:56px 22px 14px;">
      <button class="iconBtn" style="background:rgba(30,18,32,.06); color:var(--ink);" onclick="closeOverlay()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div style="font-weight:800; font-size:15px; letter-spacing:.04em;">LIKES</div>
      <div style="width:38px;"></div>
    </div>
    <div id="savedList" style="flex:1; overflow-y:auto; padding:8px 18px 40px; display:flex; flex-direction:column; gap:24px;"></div>
  </div>`;
  renderSavedList();
}
function renderSavedList(){
  const list = document.getElementById('savedList');
  if(!list) return;
  const items = Object.keys(favorites).filter(id=>favorites[id]).map(id=>{
    const q = QUIZZES.find(x=>x.id===id);
    if(q) return {kind:'quiz', item:q};
    const c = CONFESSIONS.find(x=>x.id===id);
    if(c) return {kind:'confession', item:c};
    return null;
  }).filter(Boolean);
  if(!items.length){
    list.innerHTML = `<div class="emptyNote">no saved quizzes yet — tap the heart on a card to save it here.</div>`;
    return;
  }
  list.innerHTML = items.map(({kind,item},i)=> kind==='quiz' ? quizCardHTML(item,i) : confessionCardHTML(item,i) ).join('');
  list.querySelectorAll('.quizBubble').forEach(card=>{
    card.addEventListener('click', e=>{
      if(e.target.closest('.favBtn')) return;
      const id = card.dataset.qid;
      if(QUIZZES.some(x=>x.id===id)) openBrowse(id); else openBrowseConfession(id);
    });
  });
}

/* ============================ HELPERS ============================ */
function v(name){ return `var(${name})`; }
/* Trackpad/mouse-wheel navigation for horizontal swipe tracks (laptops don't fire touch swipes) */
function addWheelNav(el, onStep, opts={}){
  let locked=false, accum=0;
  el.addEventListener('wheel', e=>{
    const dx = opts.horizontalOnly ? e.deltaX : (Math.abs(e.deltaX)>=Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
    if(opts.horizontalOnly && Math.abs(e.deltaX) < Math.abs(e.deltaY)*1.15) return; // let vertical scroll pass through
    if(Math.abs(dx) < 2) return;
    e.preventDefault();
    if(locked) return;
    accum += dx;
    if(Math.abs(accum) > 40){
      onStep(accum>0?1:-1);
      accum=0;
      locked=true;
      setTimeout(()=>{ locked=false; }, 420);
    }
  }, {passive:false});
}
function showToast(msg, ms=2200){
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(t._tm); t._tm=setTimeout(()=>t.classList.remove('show'), ms);
}
function pct(arr,idx){ return arr[idx]; }
function scoreCopy(score,total){
  const r=score/total;
  if(r===1) return "you know them scarily well.";
  if(r>=.8) return "you were almost right.";
  if(r>=.5) return "not bad, not bad.";
  if(r>=.25) return "might need to study them harder.";
  return "who even are you two.";
}
function computeScore(pred,actual){
  let s=0; pred.forEach((p,i)=>{ if(p===actual[i]) s++; }); return s;
}
function randAnswers(n){ return Array.from({length:n},()=>Math.random()<0.5?0:1); }
/* counts real sent/answered activity across ALL card types by scanning messages, since predictions/myAnswers only ever tracked Either/Or */
function countActivity(){
  let sent=0, taken=0;
  FRIENDS.forEach(f=>{
    (messages[f.id]||[]).forEach(m=>{
      if(m.type==='quizSent' || m.type==='confessionSent') sent++;
      else if((m.type==='resultReady' || m.type==='confessionReady') && m.perspective==='sent') sent++;
      else if((m.type==='resultReady' || m.type==='confessionReady') && m.perspective==='received') taken++;
    });
  });
  return {sent, taken};
}

/* status bar color updates with current panel bg brightness */
function setStatusColor(hex){ document.getElementById('statusbar').style.setProperty('--statuscolor', hex); document.getElementById('statusbar').style.color=hex; }

/* ============================ FEED RENDER ============================ */


function stampHTML(code){ return `<div class="stamp"><span>${code}</span></div>`; }

function panelCover(q){
  return `
  <div class="panel coverPanel" style="background:linear-gradient(160deg, ${v(q.bg[0])}, ${v(q.bg[1])}); color:${q.text};">
    <div class="grain"></div>
    ${stampHTML(q.code)}
    ${q.creator==='Overshare' ? '<div class="eyebrow">OVERSHARE ORIGINAL</div>' : '<div class="eyebrow">OVERSHARE</div>'}
    <h1>${q.subject}</h1>
    ${q.sub ? `<div class="sub">${q.sub}</div>` : ''}
    <div class="meta">${q.questions.length} QUESTION${q.questions.length===1?'':'S'}</div>
    <div class="swipehint">SWIPE TO BEGIN <span class="arrow">→</span></div>
  </div>`;
}
function panelPreviewQ(q,idx){
  const qq=q.questions[idx];
  return `
  <div class="panel" style="background:linear-gradient(200deg, ${v(q.bg[1])}, ${v(q.bg[0])}); color:${q.text};">
    <div class="grain"></div>
    <div class="miniTag">${q.subject}</div>
    <div class="qLabel">QUESTION ${String(idx+1).padStart(2,'0')}</div>
    <div class="qStack">
      <div class="choice" style="background:rgba(255,255,255,.92); color:${isLightText(q.text) ? 'var(--ink)' : q.text};">${qq.a}</div>
      <div class="qOr">or</div>
      <div class="choice" style="background:rgba(255,255,255,.92); color:${isLightText(q.text) ? 'var(--ink)' : q.text};">${qq.b}</div>
    </div>
    <div class="previewNote">what would they pick?${idx<q.questions.length-1?' <span class="arrow">→</span>':''}</div>
  </div>`;
}
function panelFinal(q){
  return `
  <div class="panel finalPanel" style="background:linear-gradient(160deg, ${v(q.bg[1])}, ${v(q.bg[0])}); color:${q.text};">
    <div class="grain"></div>
    <h2>who do you want to ask?</h2>
    <p>they'll answer honestly — no predictions, no guessing.</p>
    <button class="bigBtn" style="background:${q.text==='#FBF5EB' ? '#fff' : 'linear-gradient(100deg, var(--pal-pw1), var(--pal-pw2))'}; color:${q.text==='#FBF5EB' ? 'var(--plum)' : '#2E2440'};" onclick="openFriendPicker('${q.id}')">choose someone →</button>
  </div>`;
}

function confessionKindLabel(c){
  if(c.format) return c.format.toUpperCase();
  if(c.mode==='reveal') return 'PICK YOUR POISON';
  if(c.mode==='predict') return 'PREDICTION';
  const allBinary = c.questions.every(q=>q.options.length===2);
  if(allBinary && c.questions.every(q=>q.options.includes('Yes') && q.options.includes('No'))) return 'ASSESSMENT';
  if(allBinary) return 'EITHER / OR';
  return 'CONFESSION';
}

function renderFeed(){
  const list = document.getElementById('feedList');
  // interleave quizzes and confessions so the feed feels mixed rather than grouped
  const combined = [];
  const maxLen = Math.max(QUIZZES.length, CONFESSIONS.length);
  for(let i=0;i<maxLen;i++){
    if(QUIZZES[i]) combined.push({ kind:'quiz', item:QUIZZES[i] });
    if(CONFESSIONS[i]) combined.push({ kind:'confession', item:CONFESSIONS[i] });
  }
  list.innerHTML = combined.map(({kind,item},i)=> kind==='quiz' ? quizCardHTML(item,i) : confessionCardHTML(item,i) ).join('');
  combined.forEach(({kind,item})=>{
    if(kind==='quiz') attachCardSwipe(item, openBrowse, item.questions.length);
    else attachCardSwipe(item, openBrowseConfession, item.mode==='reveal' ? 1 : item.questions.length, item.mode==='reveal' ? `PICK ${item.pickCount}` : null);
  });
}

function quizCardHTML(q,i){
  return `<div class="quizBubble" data-qid="${q.id}" style="background:linear-gradient(150deg, ${v(q.bg[0])}, ${v(q.bg[1])}); color:${q.text}; animation-delay:${i*.05}s;">
      <div class="stamp"><span>${q.code}</span></div>
      ${q.creator==='Overshare' ? '<div class="bEyebrow">OVERSHARE ORIGINAL</div>' : '<div class="bEyebrow">OVERSHARE</div>'}
      <h2>${q.subject}</h2>
      ${q.sub ? `<div class="bSub">${q.sub}</div>` : ''}
      <div class="teaserWrap"><div class="teaserTrack" id="teaserTrack-${q.id}">
        ${q.questions.map(qq=>`
        <div class="teaserPage">
          <div class="teaserRow">
            <div class="teaserChip">${qq.a}</div>
            <div class="teaserChip">${qq.b}</div>
          </div>
        </div>`).join('')}
      </div></div>
      <div class="bFoot">
        <div class="pill" id="pill-${q.id}">1/${q.questions.length}</div>
        ${favBtnHTML(q.id)}
      </div>
    </div>`;
}

function isLightText(hex){
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16), g = parseInt(h.substring(2,4),16), b = parseInt(h.substring(4,6),16);
  return (r*299 + g*587 + b*114)/1000 > 150;
}

function confessionCardHTML(c,i){
  const kindLabel = confessionKindLabel(c);
  const quoteClass = 'confQuote' + (isLightText(c.text) ? ' onDark' : '');
  let teaserPages;
  if(c.mode==='reveal'){
    teaserPages = `<div class="teaserPage confTeaserPage revealTeaserPage">
      <div class="revealTeaser">
        ${c.prompts.map((_,pi)=>`<div class="revealTile" style="color:${isLightText(c.text) ? 'var(--ink)' : c.text};">${pi+1}</div>`).join('')}
      </div>
      <div class="confOptCount">${c.prompts.length} HIDDEN &middot; PICK ${c.pickCount}</div>
    </div>`;
  } else {
    teaserPages = c.questions.map(qq=>{
      if(!qq.text || !qq.text.trim()){
        return `<div class="teaserPage">
          <div class="teaserRow">
            ${qq.options.map(o=>`<div class="teaserChip">${o}</div>`).join('')}
          </div>
        </div>`;
      }
      return `<div class="teaserPage confTeaserPage">
        <div class="${quoteClass}">${qq.text}</div>
        <div class="confOptCount">${qq.options.length} OPTIONS</div>
      </div>`;
    }).join('');
  }
  return `<div class="quizBubble" data-qid="${c.id}" style="background:linear-gradient(150deg, ${v(c.bg[0])}, ${v(c.bg[1])}); color:${c.text}; animation-delay:${i*.05}s;">
      <div class="stamp"><span>${c.code}</span></div>
      ${c.creator==='Overshare' ? '<div class="bEyebrow">OVERSHARE ORIGINAL</div>' : '<div class="bEyebrow">OVERSHARE</div>'}
      <h2>${c.subject}</h2>
      ${c.sub ? `<div class="bSub">${c.sub}</div>` : ''}
      <div class="teaserWrap"><div class="teaserTrack" id="teaserTrack-${c.id}">${teaserPages}</div></div>
      <div class="bFoot">
        <div class="pill" id="pill-${c.id}">${c.mode==='reveal' ? `PICK ${c.pickCount}` : `1/${c.questions.length}`}</div>
        ${favBtnHTML(c.id)}
      </div>
    </div>`;
}

function attachCardSwipe(item, onOpen, total, staticPillText){
  const card = document.querySelector('.quizBubble[data-qid="'+item.id+'"]');
  const track = document.getElementById('teaserTrack-'+item.id);
  const pill = document.getElementById('pill-'+item.id);
  if(!card || !track) return;
  card.style.touchAction = 'pan-y';
  let idx=0, dragging=false, axis=null, x0=0, y0=0, startIdx=0;
  card.addEventListener('pointerdown', e=>{
    if(e.target.closest('.favBtn')) return;
    dragging=true; axis=null; x0=e.clientX; y0=e.clientY; startIdx=idx;
    try{ card.setPointerCapture(e.pointerId); }catch(err){}
  });
  card.addEventListener('pointermove', e=>{
    if(!dragging) return;
    const dx=e.clientX-x0, dy=e.clientY-y0;
    if(!axis){
      if(Math.abs(dx)>8 || Math.abs(dy)>8) axis = Math.abs(dx)>Math.abs(dy) ? 'x' : 'y';
      else return;
    }
    if(axis!=='x') return;
    const w = card.getBoundingClientRect().width;
    track.style.transition='none';
    track.style.transform = `translateX(${-startIdx*100 + (dx/w)*100}%)`;
  });
  card.addEventListener('pointerup', e=>{
    if(!dragging) return; dragging=false;
    const dx=e.clientX-x0;
    if(axis==='x'){
      const w=card.getBoundingClientRect().width;
      let ni=startIdx;
      if(Math.abs(dx)>w*0.18) ni += dx<0?1:-1;
      ni=Math.max(0,Math.min(total-1,ni));
      idx=ni;
      track.style.transition='transform .3s cubic-bezier(.2,.9,.25,1)';
      track.style.transform=`translateX(${-idx*100}%)`;
      pill.textContent = staticPillText || `${idx+1}/${total}`;
    } else if(axis===null){
      onOpen(item.id);
    }
    axis=null;
  });
  card.addEventListener('pointercancel', ()=>{ dragging=false; axis=null; });
  addWheelNav(card, dir=>{
    idx = Math.max(0, Math.min(total-1, idx+dir));
    track.style.transition='transform .3s cubic-bezier(.2,.9,.25,1)';
    track.style.transform=`translateX(${-idx*100}%)`;
    pill.textContent = staticPillText || `${idx+1}/${total}`;
  }, {horizontalOnly:true});
}
function openBrowse(quizId){
  const q = QUIZZES.find(x=>x.id===quizId);
  let idx = 0;
  const root = document.getElementById('overlayRoot');
  const panels = [panelCover(q), ...q.questions.map((_,qi)=>panelPreviewQ(q,qi)), panelFinal(q)];
  root.innerHTML = `
  <div class="overlay" style="background:${v(q.bg[0])};">
    <div class="oTop" style="position:absolute; z-index:20; left:0; right:0;">
      <button class="iconBtn" style="background:rgba(255,255,255,.3); color:${q.text};" onclick="closeOverlay()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div style="width:38px;"></div>
    </div>
    <div class="oDots" id="browseDots" style="color:${q.text};">${panels.map((_,i)=>`<div class="od ${i===0?'on':''}"></div>`).join('')}</div>
    <button class="navArrow left hide" id="browsePrev" style="color:${q.text};" onclick="window.__browsePrev && window.__browsePrev()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="navArrow right" id="browseNext" style="color:${q.text};" onclick="window.__browseNext && window.__browseNext()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
    <div class="oTrack" style="touch-action:none;"><div class="oInner" id="browseInner">${panels.join('')}</div></div>
  </div>`;
  setStatusColor(q.text);
  const track = root.querySelector('.oTrack');
  const inner = document.getElementById('browseInner');
  const dots = document.getElementById('browseDots');
  const prevBtn = document.getElementById('browsePrev');
  const nextBtn = document.getElementById('browseNext');
  function goto(ni, animate){
    ni = Math.max(0, Math.min(panels.length-1, ni)); idx = ni;
    inner.style.transition = animate ? 'transform .34s cubic-bezier(.2,.9,.25,1)' : 'none';
    inner.style.transform = `translateX(${-idx*100}%)`;
    if(dots) [...dots.children].forEach((d,i)=> d.classList.toggle('on', i===idx));
    if(prevBtn) prevBtn.classList.toggle('hide', idx===0);
    if(nextBtn) nextBtn.classList.toggle('hide', idx===panels.length-1);
  }
  window.__predGoto = goto; // reuse generic helper
  window.__browsePrev = ()=> goto(idx-1, true);
  window.__browseNext = ()=> goto(idx+1, true);
  addWheelNav(track, dir=> goto(idx+dir, true));
  let dragging=false, x0=0, startIdx=0;
  track.addEventListener('pointerdown', e=>{ if(e.target.closest('button,[onclick],input')) return; dragging=true; x0=e.clientX; startIdx=idx; try{ track.setPointerCapture(e.pointerId); }catch(err){} });
  track.addEventListener('pointermove', e=>{
    if(!dragging) return;
    const dx=e.clientX-x0, w=track.getBoundingClientRect().width;
    inner.style.transition='none';
    inner.style.transform=`translateX(${-startIdx*100 + (dx/w)*100}%)`;
  });
  track.addEventListener('pointerup', e=>{
    if(!dragging) return; dragging=false;
    const dx=e.clientX-x0, w=track.getBoundingClientRect().width;
    let ni=startIdx;
    if(Math.abs(dx)>w*0.16) ni += dx<0?1:-1;
    goto(ni, true);
  });
  track.addEventListener('pointercancel', ()=> goto(idx,true));
}

/* ============================ FRIEND PICKER ============================ */
function openFriendPicker(quizId){
  const root=document.getElementById('overlayRoot');
  root.innerHTML = `
  <div class="sheetBackdrop" id="fpBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <h3>who do you want to ask?</h3>
      <div class="hint">they'll answer honestly — you'll see their answers once they're done</div>
      <div class="friendGrid">
        ${FRIENDS.map(f=>`
          <div class="friendPick" onclick="pickFriend('${quizId}','${f.id}')">
            <div class="avatar" style="background:${v(f.color)}; color:#fff;">${f.name[0].toUpperCase()}</div>
            <div class="fname">${f.name}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('fpBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('fpBackdrop').addEventListener('click', e=>{ if(e.target.id==='fpBackdrop') closeSheet(); });
}
function closeSheet(){
  const bd=document.querySelector('.sheetBackdrop');
  if(!bd) return;
  bd.classList.remove('show');
  setTimeout(()=>{ if(bd.parentNode) bd.remove(); }, 260);
}
function pickFriend(quizId, friendId){
  closeSheet();
  setTimeout(()=> sendEitherOrQuiz(quizId, friendId), 200);
}

/* ============================ SEND (DIRECT, NO PREDICTION) ============================ */
function sendEitherOrQuiz(quizId, friendId){
  const q = QUIZZES.find(x=>x.id===quizId);
  const f = F(friendId);
  messages[friendId] = messages[friendId]||[];
  messages[friendId].push({type:'quizSent', quizId, friendId});
  awardScore(1);
  renderConvList();
  showSentScreen(q, f, quizId);
  // simulate friend answering after a delay
  setTimeout(()=>{
    responses[quizId] = responses[quizId]||{};
    responses[quizId][friendId] = {answers: randAnswers(q.questions.length)};
    const arr = messages[friendId];
    const m = arr.find(m=>m.type==='quizSent' && m.quizId===quizId);
    if(m){ m.type='resultReady'; m.perspective='sent'; }
    renderConvList();
    if(state.view==='messages' && state.activeConv===friendId) renderThread(friendId);
    showToast(`${f.name} answered your quiz!`);
    document.getElementById('navPing').style.display = state.view==='messages' ? 'none':'block';
  }, 3200);
}
function showSentScreen(q, f, quizId){
  const root=document.getElementById('overlayRoot');
  root.innerHTML = `
  <div class="overlay" style="background:linear-gradient(170deg, ${v(q.bg[0])}, ${v(q.bg[1])}); color:${q.text};">
    <div class="grain"></div>
    <div class="doneScreen">
      <div class="stampBig">${q.code}</div>
      <h2>sent!</h2>
      <div class="doneActions">
        <button class="bigBtn" style="background:#fff; color:${isLightText(q.text) ? 'var(--ink)' : q.text};" onclick="openFriendPicker('${quizId}')">ask someone else</button>
        <button class="ghostBtn" onclick="closeOverlay()">discover more quizzes</button>
      </div>
    </div>
  </div>`;
}

/* generic swipe used inside overlays (predict/answer) */
function attachOverlaySwipe(trackEl, innerId, maxIdx, startIdx, onSettle){
  let dragging=false,x0=0,idx=startIdx;
  const inner=document.getElementById(innerId);
  trackEl.addEventListener('pointerdown', e=>{ if(e.target.closest('button,[onclick],input')) return; dragging=true; x0=e.clientX; try{ trackEl.setPointerCapture(e.pointerId); }catch(err){} });
  trackEl.addEventListener('pointermove', e=>{
    if(!dragging) return;
    const dx=e.clientX-x0; const w=trackEl.getBoundingClientRect().width;
    inner.style.transition='none';
    let next = -idx*100 + (dx/w)*100;
    inner.style.transform=`translateX(${next}%)`;
  });
  trackEl.addEventListener('pointerup', e=>{
    if(!dragging) return; dragging=false;
    const dx=e.clientX-x0; const w=trackEl.getBoundingClientRect().width;
    let ni=idx;
    if(Math.abs(dx)>w*0.18) ni += dx<0?1:-1;
    ni=Math.max(0,Math.min(maxIdx,ni));
    idx=ni;
    if(onSettle) onSettle(ni);
    else if(window.__predGoto) window.__predGoto(ni); else if(window.__ansGoto) window.__ansGoto(ni);
  });
  addWheelNav(trackEl, dir=>{
    const ni=Math.max(0,Math.min(maxIdx, idx+dir));
    idx=ni;
    if(onSettle) onSettle(ni);
    else if(window.__predGoto) window.__predGoto(ni); else if(window.__ansGoto) window.__ansGoto(ni);
  });
}
function closeOverlay(){ document.getElementById('overlayRoot').innerHTML=''; setStatusColor('#1E1220'); }

/* ============================ ANSWER OVERLAY (recipient answers honestly) ============================ */
function openAnswer(quizId, friendId){
  const q = QUIZZES.find(x=>x.id===quizId);
  const f = F(friendId);
  const saved = quizProgress[quizId] && quizProgress[quizId][friendId];
  const answers = saved ? [...saved.answers] : new Array(q.questions.length).fill(null);
  let idx = saved ? saved.idx : 0;
  const root=document.getElementById('overlayRoot');

  function dotsHTML(){
    return `<div class="hypo" style="color:${q.text};">
      <div class="label">${idx>=q.questions.length ? 'answers locked in' : 'answering honestly…'}</div>
      <div class="dots">${q.questions.map((_,i)=>`<div class="d ${answers[i]!==null?'on':''}"></div>`).join('')}</div>
    </div>`;
  }
  function questionPanel(qi){
    const qq=q.questions[qi];
    const a=answers[qi];
    const cls0 = a===0?'selected':(a===1?'dim':'');
    const cls1 = a===1?'selected':(a===0?'dim':'');
    return `<div class="oPanel">
      <div class="qLabel">QUESTION ${String(qi+1).padStart(2,'0')}</div>
      <div class="qStack">
        <button class="ansBtn2 choice ${cls0}" data-i="0" style="background:rgba(255,255,255,.92); color:${isLightText(q.text) ? 'var(--ink)' : q.text};">${qq.a}</button>
        <div class="qOr">or</div>
        <button class="ansBtn2 choice ${cls1}" data-i="1" style="background:rgba(255,255,255,.92); color:${isLightText(q.text) ? 'var(--ink)' : q.text};">${qq.b}</button>
      </div>
      <div class="previewNote">what's actually true for you?</div>
    </div>`;
  }
  function finalPanel(){
    return `<div class="oPanel">
      <h2 style="font-family:'Fredoka',sans-serif; font-weight:700; font-size:28px; margin-bottom:10px;">send your answers?</h2>
      <p style="opacity:.75; font-weight:600; font-size:13px; margin-bottom:26px;">${f.name} will see exactly what you picked — no guessing involved.</p>
      <button class="bigBtn" id="revealBtn" style="background:#fff; color:${isLightText(q.text) ? 'var(--ink)' : q.text};" disabled>send to ${f.name} →</button>
    </div>`;
  }
  const total = q.questions.length + 1; // questions + final panel

  function render(){
    root.innerHTML = `
    <div class="overlay" style="background:linear-gradient(170deg, ${v(q.bg[0])}, ${v(q.bg[1])}); color:${q.text};">
      <div class="grain"></div>
      <div class="oTop" style="position:absolute; z-index:20; left:0; right:0;">
        <button class="iconBtn" style="background:rgba(255,255,255,.25); color:${q.text};" onclick="exitAnswerAndSave()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style="text-align:center;">
          <div style="font-weight:800; font-size:11px; letter-spacing:.12em; opacity:.75;">${f.name.toUpperCase()} WANTS TO KNOW</div>
          <div class="forWho">${q.subject}</div>
        </div>
        <div style="width:38px;"></div>
      </div>
      ${dotsHTML()}
      <button class="navArrow left hide" id="ansPrev" style="color:${q.text};">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="navArrow right" id="ansNext" style="color:${q.text};">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <div class="oTrack" style="touch-action:none;"><div class="oInner" id="ansInner">
        ${q.questions.map((_,i)=>questionPanel(i)).join('')}
        ${finalPanel()}
      </div></div>
    </div>`;
    const track = root.querySelector('.oTrack');
    const inner = document.getElementById('ansInner');
    const prevBtn = document.getElementById('ansPrev');
    const nextBtn = document.getElementById('ansNext');

    function goto(ni,animate){
      ni=Math.max(0,Math.min(q.questions.length,ni)); idx=ni;
      inner.style.transition= animate?'transform .34s cubic-bezier(.2,.9,.25,1)':'none';
      inner.style.transform=`translateX(${-idx*100}%)`;
      refreshDots();
      if(prevBtn) prevBtn.classList.toggle('hide', idx===0);
      if(nextBtn) nextBtn.classList.toggle('hide', idx===total-1);
      const rb=document.getElementById('revealBtn');
      if(rb){ const done=answers.every(a=>a!==null); rb.disabled=!done; rb.style.opacity=1; rb.style.background=done?'#fff':'rgba(255,255,255,.55)'; }
    }
    function refreshDots(){ const h=root.querySelector('.hypo'); if(h) h.outerHTML=dotsHTML(); }
    function bindAnswerButtons(){
      root.querySelectorAll('.ansBtn2').forEach(btn=>{
        btn.onclick=()=>{
          const qi=idx, chosen=Number(btn.dataset.i);
          answers[qi]=chosen;
          const sibs=btn.parentElement.querySelectorAll('.ansBtn2');
          sibs.forEach(s=>s.classList.remove('selected','dim'));
          btn.classList.add('selected');
          [...sibs].filter(s=>s!==btn).forEach(s=>s.classList.add('dim'));
          refreshDots();
          setTimeout(()=>goto(idx+1,true),260);
        };
      });
      const rb=document.getElementById('revealBtn');
      if(rb) rb.onclick=()=>finish(answers);
    }
    function finish(finalAnswers){
      myAnswers[quizId]=myAnswers[quizId]||{};
      myAnswers[quizId][friendId]=finalAnswers;
      if(quizProgress[quizId]) delete quizProgress[quizId][friendId];
      const arr=messages[friendId];
      const m=arr.find(m=>m.type==='incomingQuizToAnswer' && m.quizId===quizId);
      if(m){ m.type='resultReady'; m.perspective='received'; awardScore(1); }
      renderConvList();
      closeOverlay();
      showToast(`Sent to ${f.name}`);
      if(state.view==='messages' && state.activeConv===friendId) renderThread(friendId);
    }
    window.exitAnswerAndSave = ()=>{
      quizProgress[quizId] = quizProgress[quizId] || {};
      quizProgress[quizId][friendId] = { answers:[...answers], idx };
      renderConvList();
      closeOverlay();
    };

    bindAnswerButtons();
    prevBtn.onclick = ()=> goto(idx-1, true);
    nextBtn.onclick = ()=> goto(idx+1, true);
    addWheelNav(track, dir=> goto(idx+dir, true));
    let dragging=false, x0=0, startIdx=0;
    track.addEventListener('pointerdown', e=>{ if(e.target.closest('button,[onclick],input')) return; dragging=true; x0=e.clientX; startIdx=idx; try{ track.setPointerCapture(e.pointerId); }catch(err){} });
    track.addEventListener('pointermove', e=>{
      if(!dragging) return;
      const dx=e.clientX-x0, w=track.getBoundingClientRect().width;
      inner.style.transition='none';
      inner.style.transform=`translateX(${-startIdx*100 + (dx/w)*100}%)`;
    });
    track.addEventListener('pointerup', e=>{
      if(!dragging) return; dragging=false;
      const dx=e.clientX-x0, w=track.getBoundingClientRect().width;
      let ni=startIdx;
      if(Math.abs(dx)>w*0.18) ni += dx<0?1:-1;
      goto(ni, true);
    });
    track.addEventListener('pointercancel', ()=> goto(idx,true));
    goto(idx, false);
  }
  render();
}

/* ============================ REVEAL OVERLAY ============================ */
function openReveal(quizId, friendId, perspective){
  const q=QUIZZES.find(x=>x.id===quizId);
  const f=F(friendId);
  const answers = perspective==='sent'
    ? (responses[quizId]&&responses[quizId][friendId]&&responses[quizId][friendId].answers) || randAnswers(q.questions.length)
    : (myAnswers[quizId]&&myAnswers[quizId][friendId]) || randAnswers(q.questions.length);
  const root=document.getElementById('overlayRoot');
  root.innerHTML = `
  <div class="overlay" style="background:linear-gradient(180deg, ${v(q.bg[0])} 0%, var(--cream) 40%); color:var(--ink);">
    <div class="oTop" style="padding-top:56px;">
      <button class="iconBtn" style="background:rgba(255,255,255,.5); color:var(--ink);" onclick="closeOverlay()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div style="font-weight:800; font-size:11px; letter-spacing:.12em; color:${q.text};">${q.subject}</div>
      <div style="width:38px;"></div>
    </div>
    <div class="revealHead">
      <div class="scoreLine">${perspective==='sent' ? f.name.toUpperCase()+"'S ANSWERS" : 'WHAT YOU SENT'}</div>
      <div class="witty">${perspective==='sent' ? 'straight answers, no guessing.' : 'sent — no take-backs.'}</div>
    </div>
    <div class="revealList">
      ${q.questions.map((qq,i)=>{
        const chosen = answers[i];
        return `<div class="revCard">
          <div class="qtxt">${qq.a.toUpperCase()} OR ${qq.b.toUpperCase()}?</div>
          <div class="optionList">
            <div class="optionRow ${chosen===0?'chosenOpt':''}">${qq.a}</div>
            <div class="optionRow ${chosen===1?'chosenOpt':''}">${qq.b}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
  setStatusColor('#1E1220');
}

/* ============================ CONFESSIONS ============================ */
function confCoverPanel(c){
  const count = c.mode==='reveal' ? c.prompts.length : c.questions.length;
  const noun = count===1 ? 'QUESTION' : 'QUESTIONS';
  const metaLabel = c.mode==='reveal' ? `${count} HIDDEN ${noun}` : `${count} ${noun}`;
  return `
  <div class="panel coverPanel" style="background:linear-gradient(160deg, ${v(c.bg[0])}, ${v(c.bg[1])}); color:${c.text};">
    <div class="grain"></div>
    ${stampHTML(c.code)}
    ${c.creator==='Overshare' ? '<div class="eyebrow">OVERSHARE ORIGINAL</div>' : '<div class="eyebrow">OVERSHARE</div>'}
    <h1>${c.subject}</h1>
    ${c.sub ? `<div class="sub">${c.sub}</div>` : ''}
    <div class="meta">${metaLabel}</div>
    <div class="swipehint">SWIPE TO BEGIN <span class="arrow">→</span></div>
  </div>`;
}
function confQPanel(c, idx){
  const qq = c.questions[idx];
  return `
  <div class="panel" style="background:linear-gradient(200deg, ${v(c.bg[1])}, ${v(c.bg[0])}); color:${c.text};">
    <div class="grain"></div>
    <div class="miniTag">${c.subject}</div>
    <div class="qLabel">QUESTION ${String(idx+1).padStart(2,'0')}</div>
    <div style="font-family:'Fredoka',sans-serif; font-weight:600; font-size:21px; line-height:1.25; margin-bottom:20px; max-width:300px; color:${c.text};${isLightText(c.text) ? ' text-shadow:0 1px 5px rgba(0,0,0,.3);' : ''}">${qq.text}</div>
    <div class="optionList">
      ${qq.options.map(o=>`<div class="optionRow">${o}</div>`).join('')}
    </div>
    <div class="previewNote">what would they pick?${idx<c.questions.length-1?' <span class="arrow">→</span>':''}</div>
  </div>`;
}
function confRevealInfoPanel(c){
  const shuffled = [...c.prompts].sort(()=>Math.random()-0.5);
  return `
  <div class="panel" style="background:linear-gradient(200deg, ${v(c.bg[1])}, ${v(c.bg[0])}); color:${c.text};">
    <div class="grain"></div>
    <div class="miniTag">${c.subject}</div>
    <div class="qLabel">HIDDEN QUESTIONS</div>
    <div class="revealTeaser" style="justify-content:center; max-width:280px;">
      ${c.prompts.map((_,pi)=>`<div class="revealTile" style="color:${isLightText(c.text) ? 'var(--ink)' : c.text};">${pi+1}</div>`).join('')}
    </div>
    <div class="optionList" style="margin:14px 0;">
      ${shuffled.map(p=>`<div class="optionRow">${p}</div>`).join('')}
    </div>
    <div class="previewNote">pick ${c.pickCount} to answer honestly — order's scrambled, so you won't know which is which</div>
  </div>`;
}
function confFinalPanel(c){
  const isPredict = c.mode==='predict';
  return `
  <div class="panel finalPanel" style="background:linear-gradient(160deg, ${v(c.bg[1])}, ${v(c.bg[0])}); color:${c.text};">
    <div class="grain"></div>
    <h2>${isPredict ? 'who are you figuring out?' : 'who do you want to ask?'}</h2>
    <p>${isPredict ? "predict how they'd answer, then send — you'll see how close you got." : "they'll answer honestly — no predictions, no guessing."}</p>
    <button class="bigBtn" style="background:${c.text==='#FBF5EB' ? '#fff' : 'linear-gradient(100deg, var(--pal-pw1), var(--pal-pw2))'}; color:${c.text==='#FBF5EB' ? 'var(--plum)' : '#2E2440'};" onclick="openFriendPickerConfession('${c.id}')">${isPredict ? 'choose your subject →' : 'choose someone →'}</button>
  </div>`;
}

function openBrowseConfession(confessionId){
  const c = CONFESSIONS.find(x=>x.id===confessionId);
  let idx = 0;
  const root = document.getElementById('overlayRoot');
  const panels = c.mode==='reveal'
    ? [confCoverPanel(c), confRevealInfoPanel(c), confFinalPanel(c)]
    : [confCoverPanel(c), ...c.questions.map((_,qi)=>confQPanel(c,qi)), confFinalPanel(c)];
  root.innerHTML = `
  <div class="overlay" style="background:${v(c.bg[0])};">
    <div class="oTop" style="position:absolute; z-index:20; left:0; right:0;">
      <button class="iconBtn" style="background:rgba(255,255,255,.3); color:${c.text};" onclick="closeOverlay()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div style="width:38px;"></div>
    </div>
    <div class="oDots" id="browseDots" style="color:${c.text};">${panels.map((_,i)=>`<div class="od ${i===0?'on':''}"></div>`).join('')}</div>
    <button class="navArrow left hide" id="browsePrev" style="color:${c.text};" onclick="window.__browsePrev && window.__browsePrev()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="navArrow right" id="browseNext" style="color:${c.text};" onclick="window.__browseNext && window.__browseNext()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
    <div class="oTrack" style="touch-action:none;"><div class="oInner" id="browseInner">${panels.join('')}</div></div>
  </div>`;
  setStatusColor(c.text);
  const track = root.querySelector('.oTrack');
  const inner = document.getElementById('browseInner');
  const dots = document.getElementById('browseDots');
  const prevBtn = document.getElementById('browsePrev');
  const nextBtn = document.getElementById('browseNext');
  function goto(ni, animate){
    ni = Math.max(0, Math.min(panels.length-1, ni)); idx = ni;
    inner.style.transition = animate ? 'transform .34s cubic-bezier(.2,.9,.25,1)' : 'none';
    inner.style.transform = `translateX(${-idx*100}%)`;
    if(dots) [...dots.children].forEach((d,i)=> d.classList.toggle('on', i===idx));
    if(prevBtn) prevBtn.classList.toggle('hide', idx===0);
    if(nextBtn) nextBtn.classList.toggle('hide', idx===panels.length-1);
  }
  window.__predGoto = goto;
  window.__browsePrev = ()=> goto(idx-1, true);
  window.__browseNext = ()=> goto(idx+1, true);
  addWheelNav(track, dir=> goto(idx+dir, true));
  let dragging=false, x0=0, startIdx=0;
  track.addEventListener('pointerdown', e=>{ if(e.target.closest('button,[onclick],input')) return; dragging=true; x0=e.clientX; startIdx=idx; try{ track.setPointerCapture(e.pointerId); }catch(err){} });
  track.addEventListener('pointermove', e=>{
    if(!dragging) return;
    const dx=e.clientX-x0, w=track.getBoundingClientRect().width;
    inner.style.transition='none';
    inner.style.transform=`translateX(${-startIdx*100 + (dx/w)*100}%)`;
  });
  track.addEventListener('pointerup', e=>{
    if(!dragging) return; dragging=false;
    const dx=e.clientX-x0, w=track.getBoundingClientRect().width;
    let ni=startIdx;
    if(Math.abs(dx)>w*0.16) ni += dx<0?1:-1;
    goto(ni, true);
  });
  track.addEventListener('pointercancel', ()=> goto(idx,true));
}

function openFriendPickerConfession(confessionId){
  const root=document.getElementById('overlayRoot');
  root.innerHTML = `
  <div class="sheetBackdrop" id="fpBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <h3>who do you want to ask?</h3>
      <div class="hint">they'll answer honestly — you'll see their answers once they're done</div>
      <div class="friendGrid">
        ${FRIENDS.map(f=>`
          <div class="friendPick" onclick="pickFriendConfession('${confessionId}','${f.id}')">
            <div class="avatar" style="background:${v(f.color)}; color:#fff;">${f.name[0].toUpperCase()}</div>
            <div class="fname">${f.name}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('fpBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('fpBackdrop').addEventListener('click', e=>{ if(e.target.id==='fpBackdrop') closeSheet(); });
}
function pickFriendConfession(confessionId, friendId){
  const c = CONFESSIONS.find(x=>x.id===confessionId);
  closeSheet();
  if(c.mode==='predict') setTimeout(()=> openPredictConfession(confessionId, friendId), 200);
  else setTimeout(()=> doSendConfession(confessionId, friendId), 200);
}
function doSendConfession(confessionId, friendId){
  const c = CONFESSIONS.find(x=>x.id===confessionId);
  const f = F(friendId);
  messages[friendId] = messages[friendId]||[];
  messages[friendId].push({type:'confessionSent', confessionId, friendId});
  awardScore(1);
  renderConvList();
  if(state.view==='messages' && state.activeConv===friendId) renderThread(friendId);
  showConfessionSentScreen(c, f, confessionId);
  setTimeout(()=>{
    confessionAnswers[confessionId] = confessionAnswers[confessionId]||{};
    if(c.mode==='reveal'){
      const fillerAnswers = [
        "honestly? not the whole story, but close enough.",
        "ask me in person for this one.",
        "longer than you'd think.",
        "worse than you're picturing, ngl.",
        "not proud of this one 😅",
        "you'd never guess, so let's leave it there.",
      ];
      const idxs = c.prompts.map((_,i)=>i).sort(()=>Math.random()-0.5).slice(0,c.pickCount);
      confessionAnswers[confessionId][friendId] = idxs.map(pi=>({ promptIndex:pi, promptText:c.prompts[pi], answerText:fillerAnswers[Math.floor(Math.random()*fillerAnswers.length)] }));
    } else {
      confessionAnswers[confessionId][friendId] = c.questions.map(qq=> Math.floor(Math.random()*qq.options.length));
    }
    const arr = messages[friendId];
    const m = arr.find(mm=>mm.type==='confessionSent' && mm.confessionId===confessionId);
    if(m){ m.type='confessionReady'; m.perspective='sent'; }
    renderConvList();
    if(state.view==='messages' && state.activeConv===friendId) renderThread(friendId);
    showToast(c.mode==='predict' ? `${f.name} answered — see how close you got` : `${f.name} answered your quiz`);
  }, 3200);
}
function showConfessionSentScreen(c, f, confessionId){
  const root=document.getElementById('overlayRoot');
  root.innerHTML = `
  <div class="overlay" style="background:linear-gradient(170deg, ${v(c.bg[0])}, ${v(c.bg[1])}); color:${c.text};">
    <div class="grain"></div>
    <div class="doneScreen">
      <div class="stampBig">${c.code}</div>
      <h2>sent!</h2>
      <div class="doneActions">
        <button class="bigBtn" style="background:#fff; color:${isLightText(c.text) ? 'var(--ink)' : c.text};" onclick="openFriendPickerConfession('${confessionId}')">${c.mode==='predict' ? 'take this on someone else' : 'ask someone else'}</button>
        <button class="ghostBtn" onclick="closeOverlay()">discover more</button>
      </div>
    </div>
  </div>`;
}

function openPredictConfession(confessionId, friendId){
  const c = CONFESSIONS.find(x=>x.id===confessionId);
  const f = F(friendId);
  const answers = new Array(c.questions.length).fill(null);
  let idx=0;
  const root = document.getElementById('overlayRoot');
  function qPanel(qi){
    const qq = c.questions[qi];
    return `<div class="oPanel">
      <div class="qLabel">QUESTION ${String(qi+1).padStart(2,'0')}</div>
      <div style="font-family:'Fredoka',sans-serif; font-weight:600; font-size:21px; line-height:1.25; margin-bottom:22px; max-width:300px; color:${c.text};${isLightText(c.text) ? ' text-shadow:0 1px 5px rgba(0,0,0,.3);' : ''}">${qq.text}</div>
      <div class="optionList">
        ${qq.options.map((o,oi)=>`<button class="optBtn" data-i="${oi}">${o}</button>`).join('')}
      </div>
      <div class="previewNote">what do you think ${f.name} would pick?</div>
    </div>`;
  }
  function finalPanel(){
    return `<div class="oPanel">
      <h2 style="font-family:'Fredoka',sans-serif; font-weight:700; font-size:28px; margin-bottom:10px;">ready to send?</h2>
      <p style="opacity:.75; font-weight:600; font-size:13px; margin-bottom:26px;">your predictions stay hidden until ${f.name} answers.</p>
      <button class="bigBtn" id="cfSendBtn" style="background:#fff; color:${c.text};" disabled>send to ${f.name} →</button>
    </div>`;
  }
  function render(){
    root.innerHTML = `
    <div class="overlay" style="background:linear-gradient(170deg, ${v(c.bg[0])}, ${v(c.bg[1])}); color:${c.text};">
      <div class="grain"></div>
      <div class="oTop">
        <button class="iconBtn" style="background:rgba(255,255,255,.3); color:${c.text};" onclick="closeOverlay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style="text-align:center;">
          <div style="font-weight:800; font-size:11px; letter-spacing:.12em; opacity:.75;">FIGURING OUT</div>
          <div class="forWho">${f.name}</div>
        </div>
        <div style="width:38px;"></div>
      </div>
      <div class="hypo" style="color:${c.text};"><div class="dots">${c.questions.map((_,i)=>`<div class="d ${answers[i]!==null?'on':''}"></div>`).join('')}</div></div>
      <div class="oTrack"><div class="oInner" id="cfInner">
        ${c.questions.map((_,i)=>qPanel(i)).join('')}
        ${finalPanel()}
      </div></div>
    </div>`;
    attachOverlaySwipe(document.querySelector('.oTrack'),'cfInner', c.questions.length, idx);
    window.__ansGoto = goto;
    goto(idx,false);
    bind();
  }
  function bind(){
    root.querySelectorAll('.optBtn').forEach(btn=>{
      btn.onclick=()=>{
        answers[idx]=Number(btn.dataset.i);
        const sibs=btn.parentElement.querySelectorAll('.optBtn');
        sibs.forEach(s=>s.classList.remove('selected','dim'));
        btn.classList.add('selected');
        [...sibs].filter(s=>s!==btn).forEach(s=>s.classList.add('dim'));
        refreshDots(); setTimeout(()=>goto(idx+1,true),260);
      };
    });
    const sb=document.getElementById('cfSendBtn');
    if(sb) sb.onclick=()=>finish();
  }
  function refreshDots(){ const h=root.querySelector('.hypo .dots'); if(h) h.innerHTML = c.questions.map((_,i)=>`<div class="d ${answers[i]!==null?'on':''}"></div>`).join(''); }
  function goto(ni,animate){
    ni=Math.max(0,Math.min(c.questions.length,ni)); idx=ni;
    const inner=document.getElementById('cfInner');
    inner.style.transition = animate ? 'transform .34s cubic-bezier(.2,.9,.25,1)' : 'none';
    inner.style.transform = `translateX(${-idx*100}%)`;
    refreshDots();
    const sb=document.getElementById('cfSendBtn');
    if(sb){ const done=answers.every(a=>a!==null); sb.disabled=!done; sb.style.opacity=1; sb.style.background=done?'#fff':'rgba(255,255,255,.55)'; }
  }
  function finish(){
    confessionPredictions[confessionId] = confessionPredictions[confessionId]||{};
    confessionPredictions[confessionId][friendId] = answers;
    doSendConfession(confessionId, friendId);
  }
  render();
}

function openAnswerConfession(confessionId, friendId){
  const c = CONFESSIONS.find(x=>x.id===confessionId);
  if(c.mode==='reveal') openAnswerConfessionReveal(c, friendId); else openAnswerConfessionChoice(c, friendId);
}

function openAnswerConfessionChoice(c, friendId){
  const confessionId = c.id;
  const f = F(friendId);
  const answers = new Array(c.questions.length).fill(null);
  let idx=0;
  const root = document.getElementById('overlayRoot');
  function qPanel(qi){
    const qq = c.questions[qi];
    return `<div class="oPanel">
      <div class="qLabel">QUESTION ${String(qi+1).padStart(2,'0')}</div>
      <div style="font-family:'Fredoka',sans-serif; font-weight:600; font-size:21px; line-height:1.25; margin-bottom:22px; max-width:300px;">${qq.text}</div>
      <div class="optionList">
        ${qq.options.map((o,oi)=>`<button class="optBtn" data-i="${oi}">${o}</button>`).join('')}
      </div>
    </div>`;
  }
  function finalPanel(){
    return `<div class="oPanel">
      <h2 style="font-family:'Fredoka',sans-serif; font-weight:700; font-size:28px; margin-bottom:10px;">send your answers?</h2>
      <p style="opacity:.75; font-weight:600; font-size:13px; margin-bottom:26px;">${f.name} will see exactly what you picked — no guessing involved.</p>
      <button class="bigBtn" id="cfSendBtn" style="background:#fff; color:${c.text};" disabled>send to ${f.name} →</button>
    </div>`;
  }
  function render(){
    root.innerHTML = `
    <div class="overlay" style="background:linear-gradient(170deg, var(--periwinkle), var(--lavender)); color:var(--ink);">
      <div class="grain"></div>
      <div class="oTop">
        <button class="iconBtn" style="background:rgba(255,255,255,.3);" onclick="closeOverlay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style="text-align:center;">
          <div style="font-weight:800; font-size:11px; letter-spacing:.12em; opacity:.75;">QUIZ FROM ${f.name.toUpperCase()}</div>
        </div>
        <div style="width:38px;"></div>
      </div>
      <div class="hypo" style="color:var(--ink);"><div class="dots">${c.questions.map((_,i)=>`<div class="d ${answers[i]!==null?'on':''}"></div>`).join('')}</div></div>
      <div class="oTrack"><div class="oInner" id="cfInner">
        ${c.questions.map((_,i)=>qPanel(i)).join('')}
        ${finalPanel()}
      </div></div>
    </div>`;
    attachOverlaySwipe(document.querySelector('.oTrack'),'cfInner', c.questions.length, idx);
    window.__ansGoto = goto;
    goto(idx,false);
    bind();
  }
  function bind(){
    root.querySelectorAll('.optBtn').forEach(btn=>{
      btn.onclick=()=>{
        answers[idx]=Number(btn.dataset.i);
        const sibs=btn.parentElement.querySelectorAll('.optBtn');
        sibs.forEach(s=>s.classList.remove('selected','dim'));
        btn.classList.add('selected');
        [...sibs].filter(s=>s!==btn).forEach(s=>s.classList.add('dim'));
        refreshDots(); setTimeout(()=>goto(idx+1,true),260);
      };
    });
    const sb=document.getElementById('cfSendBtn');
    if(sb) sb.onclick=()=>finish();
  }
  function refreshDots(){ const h=root.querySelector('.hypo .dots'); if(h) h.innerHTML = c.questions.map((_,i)=>`<div class="d ${answers[i]!==null?'on':''}"></div>`).join(''); }
  function goto(ni,animate){
    ni=Math.max(0,Math.min(c.questions.length,ni)); idx=ni;
    const inner=document.getElementById('cfInner');
    inner.style.transition = animate ? 'transform .34s cubic-bezier(.2,.9,.25,1)' : 'none';
    inner.style.transform = `translateX(${-idx*100}%)`;
    refreshDots();
    const sb=document.getElementById('cfSendBtn');
    if(sb){ const done=answers.every(a=>a!==null); sb.disabled=!done; sb.style.opacity=1; sb.style.background=done?'#fff':'rgba(255,255,255,.55)'; }
  }
  function finish(){
    confessionAnswers[confessionId] = confessionAnswers[confessionId]||{};
    confessionAnswers[confessionId][friendId] = answers;
    const arr = messages[friendId];
    const m = arr.find(mm=>mm.type==='confessionToAnswer' && mm.confessionId===confessionId);
    if(m){ m.type='confessionReady'; m.perspective='received'; awardScore(1); }
    renderConvList();
    closeOverlay();
    showToast(`Sent to ${f.name}`);
    if(state.view==='messages' && state.activeConv===friendId) renderThread(friendId);
  }
  render();
}

function openAnswerConfessionReveal(c, friendId){
  const confessionId = c.id;
  const f = F(friendId);
  const picked = []; // array of prompt indices, in pick order
  const root = document.getElementById('overlayRoot');
  function render(){
    root.innerHTML = `
    <div class="overlay" style="background:linear-gradient(170deg, var(--periwinkle), var(--lavender)); color:var(--ink); overflow-y:auto;">
      <div class="grain"></div>
      <div class="oTop">
        <button class="iconBtn" style="background:rgba(255,255,255,.3);" onclick="closeOverlay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style="text-align:center;">
          <div style="font-weight:800; font-size:11px; letter-spacing:.12em; opacity:.75;">QUIZ FROM ${f.name.toUpperCase()}</div>
        </div>
        <div style="width:38px;"></div>
      </div>
      <div style="padding:96px 26px 140px; display:flex; flex-direction:column; align-items:center; gap:22px;">
        <div style="text-align:center;">
          <div style="font-family:'Fredoka',sans-serif; font-weight:700; font-size:22px; margin-bottom:6px;">pick ${c.pickCount} numbers</div>
          <div style="font-size:13px; font-weight:600; opacity:.75;">whatever you reveal, answer honestly.</div>
        </div>
        <div class="revealTeaser" id="revealGrid" style="justify-content:center; max-width:320px;">
          ${c.prompts.map((_,pi)=>`<div class="revealTile" data-i="${pi}" style="cursor:pointer;">${pi+1}</div>`).join('')}
        </div>
        <div id="revealAnswers" style="width:100%; max-width:320px; display:flex; flex-direction:column; gap:14px;"></div>
        <button class="bigBtn" id="cfSendBtn" style="background:#fff; color:${c.text};" disabled>send to ${f.name} →</button>
      </div>
    </div>`;
    bind();
  }
  function bind(){
    root.querySelectorAll('.revealTile').forEach(tile=>{
      tile.onclick=()=>{
        const pi = Number(tile.dataset.i);
        if(picked.includes(pi)) return;
        if(picked.length>=c.pickCount) { showToast(`you can only pick ${c.pickCount}`); return; }
        picked.push(pi);
        tile.style.background = 'var(--periwinkle)';
        tile.style.color = '#fff';
        tile.style.pointerEvents = 'none';
        renderAnswerRows();
      };
    });
    document.getElementById('cfSendBtn').onclick = ()=> finish();
  }
  function renderAnswerRows(){
    const wrap = document.getElementById('revealAnswers');
    wrap.innerHTML = picked.map(pi=>`
      <div>
        <div style="font-weight:800; font-size:11px; letter-spacing:.08em; opacity:.65; margin-bottom:6px;">#${pi+1} · ${c.prompts[pi]}</div>
        <textarea class="revealInput" data-i="${pi}" placeholder="answer honestly..." style="width:100%; min-height:64px; border:none; border-radius:14px; padding:12px 14px; font-family:'Manrope'; font-weight:600; font-size:13.5px; background:#fff; box-shadow:3px 4px 0 rgba(30,18,32,.18); resize:none;"></textarea>
      </div>`).join('');
    wrap.querySelectorAll('.revealInput').forEach(inp=> inp.oninput = updateSendState );
    updateSendState();
  }
  function updateSendState(){
    const sb = document.getElementById('cfSendBtn');
    const inputs = [...document.querySelectorAll('.revealInput')];
    const done = picked.length===c.pickCount && inputs.every(i=>i.value.trim());
    sb.disabled = !done;
    sb.style.opacity = 1;
    sb.style.background = done ? '#fff' : 'rgba(255,255,255,.55)';
  }
  function finish(){
    const inputs = [...document.querySelectorAll('.revealInput')];
    const answers = inputs.map(inp=>({ promptIndex:Number(inp.dataset.i), promptText:c.prompts[Number(inp.dataset.i)], answerText:inp.value.trim() }));
    confessionAnswers[confessionId] = confessionAnswers[confessionId]||{};
    confessionAnswers[confessionId][friendId] = answers;
    const arr = messages[friendId];
    const m = arr.find(mm=>mm.type==='confessionToAnswer' && mm.confessionId===confessionId);
    if(m){ m.type='confessionReady'; m.perspective='received'; awardScore(1); }
    renderConvList();
    closeOverlay();
    showToast(`Sent to ${f.name}`);
    if(state.view==='messages' && state.activeConv===friendId) renderThread(friendId);
  }
  render();
}

function openConfessionResults(confessionId, friendId, perspective){
  const c = CONFESSIONS.find(x=>x.id===confessionId);
  const f = F(friendId);
  const answers = (confessionAnswers[confessionId] && confessionAnswers[confessionId][friendId]) || [];
  const preds = (confessionPredictions[confessionId] && confessionPredictions[confessionId][friendId]) || [];
  const root = document.getElementById('overlayRoot');
  const isPredict = c.mode==='predict';
  const score = isPredict ? computeScore(preds, answers) : null;
  const bodyHTML = c.mode==='reveal'
    ? answers.map(a=>`<div class="revCard">
          <div class="qtxt">#${a.promptIndex+1} · ${a.promptText}</div>
          <div style="margin-top:10px; font-weight:600; font-size:14px; line-height:1.4;">${a.answerText}</div>
        </div>`).join('')
    : c.questions.map((qq,i)=>{
        const chosen = answers[i];
        const predicted = isPredict ? preds[i] : null;
        return `<div class="revCard">
          <div class="qtxt">${qq.text}</div>
          <div class="optionList">
            ${qq.options.map((o,oi)=>{
              let cls='', icon='';
              if(isPredict){
                if(oi===chosen){ cls='correctOpt'; icon=' <span style="color:#2E7D46;">✓</span>'; }
                else if(oi===predicted){ cls='wrongOpt'; icon=' <span style="color:var(--burgundy);">✗</span>'; }
              } else if(oi===chosen) cls='chosenOpt';
              return `<div class="optionRow ${cls}">${o}${icon}</div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('');
  root.innerHTML = `
  <div class="overlay" style="background:linear-gradient(180deg, ${v(c.bg[0])} 0%, var(--cream) 40%); color:var(--ink);">
    <div class="oTop" style="padding-top:56px;">
      <button class="iconBtn" style="background:rgba(255,255,255,.5); color:var(--ink);" onclick="closeOverlay()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div style="font-weight:800; font-size:11px; letter-spacing:.12em; color:${c.text};">${c.subject}</div>
      <div style="width:38px;"></div>
    </div>
    <div class="revealHead">
      ${isPredict ? `
        <div class="scoreLine">HYPOTHESIS RESULTS</div>
        <div class="score">${score} / ${c.questions.length}</div>
        <div class="witty">${scoreCopy(score, c.questions.length)}</div>
      ` : `
        <div class="scoreLine">${perspective==='sent' ? f.name.toUpperCase()+"'S ANSWERS" : 'WHAT YOU SENT'}</div>
        <div class="witty">${perspective==='sent' ? 'straight answers, no guessing.' : 'sent — no take-backs.'}</div>
      `}
    </div>
    <div class="revealList">
      ${bodyHTML}
    </div>
  </div>`;
  setStatusColor('#1E1220');
}

/* ============================ MESSAGES VIEW ============================ */
function lastPreview(friendId){
  const arr = messages[friendId]||[];
  if(!arr.length) return 'say hi';
  const m = arr[arr.length-1];
  if(m.type==='text') return (m.from==='me'?'You: ':'')+m.text;
  if(m.type==='quizSent') return 'Waiting for their answers…';
  if(m.type==='incomingQuizToAnswer'){
    const p = quizProgress[m.quizId] && quizProgress[m.quizId][friendId];
    if(p){ const q=QUIZZES.find(x=>x.id===m.quizId); const answered=p.answers.filter(a=>a!==null).length; return `Answering… ${answered}/${q.questions.length}`; }
    return 'Sent you a quiz to answer';
  }
  if(m.type==='resultReady') return 'Answers are in — tap to see';
  if(m.type==='confessionSent') return 'Waiting on their answer…';
  if(m.type==='confessionToAnswer') return 'Sent you a quiz';
  if(m.type==='confessionReady') return m.perspective==='sent' ? 'They answered your quiz' : 'Quiz sent';
  return '';
}
function hasPing(friendId){
  const arr=messages[friendId]||[];
  return arr.some(m=>m.type==='incomingQuizToAnswer' || m.type==='resultReady' || m.type==='confessionToAnswer' || (m.type==='confessionReady' && m.perspective==='sent'));
}
function renderConvList(){
  const el = document.getElementById('convList');
  el.innerHTML = FRIENDS.map(f=>`
    <div class="convRow" onclick="openThread('${f.id}')">
      <div class="avatar" style="background:${v(f.color)}; color:#fff;">${f.name[0].toUpperCase()}</div>
      <div class="convMeta"><div class="name">${f.name}</div><div class="prev">${lastPreview(f.id)}</div></div>
      ${hasPing(f.id) ? '<div class="pingDot"></div>' : ''}
    </div>`).join('');
  const anyPing = FRIENDS.some(f=>hasPing(f.id));
  document.getElementById('navPing').style.display = (anyPing && state.view!=='messages') ? 'block':'none';
}
function openThread(friendId){
  state.activeConv = friendId;
  document.getElementById('convListScreen').style.display='none';
  document.getElementById('threadScreen').style.display='flex';
  const f=F(friendId);
  document.getElementById('threadAvatar').style.background=v(f.color);
  document.getElementById('threadAvatar').style.color='#fff';
  document.getElementById('threadAvatar').textContent=f.name[0].toUpperCase();
  document.getElementById('threadName').textContent=f.name;
  renderThread(friendId);
  document.getElementById('navPing').style.display='none';
}
function closeThread(){
  document.getElementById('convListScreen').style.display='block';
  document.getElementById('threadScreen').style.display='none';
  state.activeConv=null;
  renderConvList();
}
function renderThread(friendId){
  const arr = messages[friendId]||[];
  const body = document.getElementById('threadBody');
  body.innerHTML = arr.map(m=>{
    if(m.type==='text') return `<div class="bubble ${m.from==='me'?'me':'them'}">${m.text}</div>`;
    const q = QUIZZES.find(x=>x.id===m.quizId);
    if(m.type==='quizSent'){
      return `<div class="quizMsgCard" style="background:linear-gradient(150deg, ${v(q.bg[0])}, ${v(q.bg[1])}); color:${q.text};">
        <div class="tag">QUIZ SENT · ${q.subject}</div>
        <div class="qt">waiting on ${F(friendId).name}…</div>
        <div class="cta">answers locked until they respond</div>
      </div>`;
    }
    if(m.type==='incomingQuizToAnswer'){
      const p = quizProgress[m.quizId] && quizProgress[m.quizId][friendId];
      const answered = p ? p.answers.filter(a=>a!==null).length : 0;
      return `<div class="quizMsgCard" onclick="openAnswer('${m.quizId}','${friendId}')" style="background:linear-gradient(150deg, ${v(q.bg[0])}, ${v(q.bg[1])}); color:${q.text};">
        <div class="tag">${q.subject} · FROM ${F(friendId).name.toUpperCase()}</div>
        <div class="qt">${p ? `${answered}/${q.questions.length} answered so far` : 'someone wants to know what you\u2019d pick.'}</div>
        <div class="cta">${p ? 'continue answering →' : 'answer honestly →'}</div>
      </div>`;
    }
    if(m.type==='resultReady'){
      return `<div class="quizMsgCard" onclick="openReveal('${m.quizId}','${friendId}','${m.perspective}')" style="background:linear-gradient(150deg, ${v(q.bg[0])}, ${v(q.bg[1])}); color:${q.text};">
        <div class="tag">${q.subject} · ANSWERS READY</div>
        <div class="qt">they answered</div>
        <div class="cta">view answers →</div>
      </div>`;
    }
    if(m.type==='confessionSent'){
      const c=CONFESSIONS.find(x=>x.id===m.confessionId);
      const n = c.mode==='reveal' ? c.pickCount : c.questions.length;
      const label = c.mode==='reveal' ? `PICK ${n}` : `${n} QUESTION${n>1?'S':''}`;
      return `<div class="confessionCard">
        <div class="cfTag">QUIZ SENT · ${label}</div>
        <div class="cfTitle">waiting on ${F(friendId).name}…</div>
        <div class="cta">answers locked until they respond</div>
      </div>`;
    }
    if(m.type==='confessionToAnswer'){
      const c=CONFESSIONS.find(x=>x.id===m.confessionId);
      return `<div class="confessionCard" onclick="openAnswerConfession('${m.confessionId}','${friendId}')">
        <div class="cfTag">QUIZ · FROM ${F(friendId).name.toUpperCase()}</div>
        <div class="cfTitle">they want to ask you something</div>
        <div class="cta">answer honestly →</div>
      </div>`;
    }
    if(m.type==='confessionReady'){
      return `<div class="confessionCard" onclick="openConfessionResults('${m.confessionId}','${friendId}','${m.perspective}')">
        <div class="cfTag">QUIZ · ${m.perspective==='sent' ? F(friendId).name.toUpperCase()+' ANSWERED' : 'YOU ANSWERED'}</div>
        <div class="cfTitle">${m.perspective==='sent' ? 'their answers are in' : "sent — here's what you said"}</div>
        <div class="cta">view answers →</div>
      </div>`;
    }
    return '';
  }).join('');
  body.scrollTop = body.scrollHeight+999;
}
function sendTextMsg(){
  const inp=document.getElementById('composerInput');
  const val=inp.value.trim(); if(!val || !state.activeConv) return;
  messages[state.activeConv].push({type:'text', from:'me', text:val});
  inp.value='';
  renderThread(state.activeConv);
  renderConvList();
}

/* ============================ PROFILE VIEW ============================ */
function renderProfile(){
  const {sent:sentCount, taken:takenCount} = countActivity();
  const created = QUIZZES.filter(q=>createdQuizIds.includes(q.id));
  const createdConf = CONFESSIONS.filter(c=>createdConfessionIds.includes(c.id));
  const takenQuizIds = new Set(), takenConfIds = new Set();
  FRIENDS.forEach(f=>{
    (messages[f.id]||[]).forEach(m=>{
      if(m.perspective==='received'){
        if(m.type==='resultReady') takenQuizIds.add(m.quizId);
        else if(m.type==='confessionReady') takenConfIds.add(m.confessionId);
      }
    });
  });
  const takenQuizzes = QUIZZES.filter(q=>takenQuizIds.has(q.id));
  const takenConf = CONFESSIONS.filter(c=>takenConfIds.has(c.id));
  const showQuizzes = profileTab==='created' ? created : takenQuizzes;
  const showConf = profileTab==='created' ? createdConf : takenConf;
  const emptyMsg = profileTab==='created' ? 'nothing published yet — tap "+ Create" to run your first quiz.' : 'no quizzes taken yet — answer one from a friend to see it here.';
  document.getElementById('profileScreen').innerHTML = `
    <div class="profHead">
      <div class="profAvatar">${ME.name[0].toUpperCase()}</div>
      <div><div class="profName">${ME.name}</div><div class="profHandle">${ME.tag}</div><div class="profScore">✦ ${score}</div></div>
      <button class="iconBtn gearBtn" style="background:rgba(30,18,32,.06); color:var(--ink);" onclick="openSettings()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
      <button class="iconBtn savedBtn" style="background:rgba(30,18,32,.06); color:var(--ink); margin-left:8px;" onclick="openSavedView()" aria-label="Saved">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>
      </button>
    </div>
    <div class="actTabs">
      <button class="${profileTab==='created'?'active':''}" onclick="switchProfileTab('created')">Created · ${created.length+createdConf.length}</button>
      <button class="${profileTab==='taken'?'active':''}" onclick="switchProfileTab('taken')">Taken · ${takenQuizzes.length+takenConf.length}</button>
    </div>
    ${(showQuizzes.length+showConf.length) ? `<div class="grid2">${showQuizzes.map(q=>`
      <div class="miniCard" style="background:linear-gradient(160deg, ${v(q.bg[0])}, ${v(q.bg[1])}); color:${q.text};" onclick="jumpToQuiz('${q.id}')">
        <div class="stampMini">${q.code}</div>
        <div class="mSub">${q.subject}</div>
        ${q.sub ? `<div class="mSub2">${q.sub}</div>` : ''}
      </div>`).join('')}${showConf.map(c=>`
      <div class="miniCard" style="background:linear-gradient(160deg, ${v(c.bg[0])}, ${v(c.bg[1])}); color:${c.text};" onclick="jumpToConfession('${c.id}')">
        <div class="stampMini">${c.code}</div>
        <div class="mSub">${c.subject}</div>
        ${c.sub ? `<div class="mSub2">${c.sub}</div>` : ''}
      </div>`).join('')}</div>` : `<div class="emptyNote">${emptyMsg}</div>`}
    <div class="secTitle" style="margin-top:14px;"><span>ACTIVITY</span></div>
    <div class="emptyNote" style="padding-top:0;">${sentCount+takenCount>0 ? `${sentCount} quizzes sent · ${takenCount} quizzes answered` : 'your quiz activity will show up here'}</div>
  `;
}
function switchProfileTab(tab){
  profileTab = tab;
  renderProfile();
}
function jumpToQuiz(quizId){
  openBrowse(quizId);
}
function jumpToConfession(confessionId){
  openBrowseConfession(confessionId);
}
function toggleScoreVisibility(el){
  scoreVisibility = scoreVisibility==='public' ? 'private' : 'public';
  el.classList.toggle('on', scoreVisibility==='public');
  const label = el.previousElementSibling;
  if(label) label.textContent = scoreVisibility==='public' ? 'PUBLIC' : 'PRIVATE';
}
function openSettings(){
  const root=document.getElementById('overlayRoot');
  root.innerHTML=`
  <div class="sheetBackdrop" id="setBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <h3>Settings</h3>
      <div class="hint">account & app preferences</div>
      <div class="settingsList">
        <div class="settItem" style="cursor:pointer;" onclick="openEditProfile()">Edit profile <span>›</span></div>
        <div class="settItem" style="cursor:pointer;" onclick="openNotificationSettings()">Notifications <span>›</span></div>
        <div class="settItem" style="cursor:pointer;" onclick="openWhoCanSend()">Who can send me quizzes <span>›</span></div>
        <div class="settItem" style="cursor:pointer;" onclick="openPrivacySettings()">Privacy <span>›</span></div>
        <div class="settItem" style="cursor:pointer;" onclick="openBlockedFriends()">Blocked friends <span>›</span></div>
        <div class="settItem">Score visibility <span style="font-weight:800; font-size:11px; letter-spacing:.04em; opacity:.7;">${scoreVisibility==='public'?'PUBLIC':'PRIVATE'}</span>
          <div class="tswitch ${scoreVisibility==='public'?'on':''}" onclick="toggleScoreVisibility(this)"><div class="knob"></div></div>
        </div>
        <div class="settItem" style="color:var(--burgundy); cursor:pointer;" onclick="logOut()">Log out <span>›</span></div>
      </div>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('setBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('setBackdrop').addEventListener('click', e=>{ if(e.target.id==='setBackdrop') closeSheet(); });
}
function backToSettings(){ closeSheet(); setTimeout(openSettings,200); }

function openEditProfile(){
  const root=document.getElementById('overlayRoot');
  root.innerHTML=`
  <div class="sheetBackdrop" id="setBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <button class="backLink" onclick="backToSettings()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
      <h3>Edit profile</h3>
      <div class="hint">this is how you appear across Overshare</div>
      <div class="field"><label>NAME</label>
        <input id="epNameInput" value="${ME.name.replace(/"/g,'&quot;')}" placeholder="Name">
      </div>
      <div class="field"><label>HANDLE</label>
        <input id="epTagInput" value="${ME.tag.replace(/"/g,'&quot;')}" placeholder="@handle">
      </div>
      <button class="publishBtn" onclick="saveProfileEdits()">Save</button>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('setBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('setBackdrop').addEventListener('click', e=>{ if(e.target.id==='setBackdrop') closeSheet(); });
}
function saveProfileEdits(){
  const name=document.getElementById('epNameInput').value.trim();
  const tag=document.getElementById('epTagInput').value.trim();
  if(!name){ showToast('enter a name'); return; }
  ME.name=name;
  if(tag) ME.tag = tag.startsWith('@') ? tag : '@'+tag;
  if(document.getElementById('profileScreen')) renderProfile();
  showToast('Profile updated');
  backToSettings();
}

function openNotificationSettings(){
  const root=document.getElementById('overlayRoot');
  const rows=[
    {key:'quizInvites', label:'New quiz invites'},
    {key:'messages', label:'Messages'},
    {key:'friendActivity', label:'Friend activity'},
  ];
  root.innerHTML=`
  <div class="sheetBackdrop" id="setBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <button class="backLink" onclick="backToSettings()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
      <h3>Notifications</h3>
      <div class="hint">choose what Overshare can notify you about</div>
      <div class="settingsList">
        ${rows.map(r=>`
        <div class="settItem">${r.label}
          <div class="tswitch ${notifSettings[r.key]?'on':''}" onclick="toggleNotif('${r.key}',this)"><div class="knob"></div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('setBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('setBackdrop').addEventListener('click', e=>{ if(e.target.id==='setBackdrop') closeSheet(); });
}
function toggleNotif(key,el){
  notifSettings[key]=!notifSettings[key];
  el.classList.toggle('on', notifSettings[key]);
}

function openWhoCanSend(){
  const root=document.getElementById('overlayRoot');
  const opts=[['everyone','Everyone'],['friends','Friends only'],['none','No one']];
  root.innerHTML=`
  <div class="sheetBackdrop" id="setBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <button class="backLink" onclick="backToSettings()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
      <h3>Who can send me quizzes</h3>
      <div class="hint">control who's allowed to send you quizzes to answer</div>
      <div class="settingsList" id="whoCanSendList">
        ${opts.map(([val,label])=>`
        <div class="settItem" style="cursor:pointer;" data-val="${val}" onclick="setWhoCanSend('${val}',this)">${label} <span>${whoCanSend===val?'✓':''}</span></div>`).join('')}
      </div>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('setBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('setBackdrop').addEventListener('click', e=>{ if(e.target.id==='setBackdrop') closeSheet(); });
}
function setWhoCanSend(val,el){
  whoCanSend=val;
  const list=document.getElementById('whoCanSendList');
  if(list) list.querySelectorAll('.settItem').forEach(row=>{
    row.querySelector('span').textContent = row.dataset.val===val ? '✓' : '';
  });
}

function openPrivacySettings(){
  const root=document.getElementById('overlayRoot');
  root.innerHTML=`
  <div class="sheetBackdrop" id="setBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <button class="backLink" onclick="backToSettings()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
      <h3>Privacy</h3>
      <div class="hint">manage who can see your activity</div>
      <div class="settingsList">
        <div class="settItem">Private account
          <div class="tswitch ${privacySettings.privateAccount?'on':''}" onclick="togglePrivacy('privateAccount',this)"><div class="knob"></div></div>
        </div>
        <div class="settItem">Show activity status
          <div class="tswitch ${privacySettings.showActivity?'on':''}" onclick="togglePrivacy('showActivity',this)"><div class="knob"></div></div>
        </div>
      </div>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('setBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('setBackdrop').addEventListener('click', e=>{ if(e.target.id==='setBackdrop') closeSheet(); });
}
function togglePrivacy(key,el){
  privacySettings[key]=!privacySettings[key];
  el.classList.toggle('on', privacySettings[key]);
}

function openBlockedFriends(){
  const root=document.getElementById('overlayRoot');
  root.innerHTML=`
  <div class="sheetBackdrop" id="setBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <button class="backLink" onclick="backToSettings()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
      <h3>Blocked friends</h3>
      <div class="hint">blocked friends can't send or see your quizzes</div>
      <div class="settingsList">
        ${FRIENDS.map(f=>{ const blocked=blockedFriendIds.includes(f.id); return `
        <div class="settItem">
          <span style="display:flex; align-items:center; gap:10px;"><span class="avatar" style="width:32px; height:32px; font-size:14px; background:${v(f.color)}; color:#fff;">${f.name[0].toUpperCase()}</span>${f.name}</span>
          <button class="chip ${blocked?'on':''}" style="padding:7px 12px; font-size:11px;" onclick="toggleBlockFriend('${f.id}',this)">${blocked?'Blocked':'Block'}</button>
        </div>`; }).join('')}
      </div>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('setBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('setBackdrop').addEventListener('click', e=>{ if(e.target.id==='setBackdrop') closeSheet(); });
}
function toggleBlockFriend(id,el){
  const i=blockedFriendIds.indexOf(id);
  const blocked = i===-1;
  if(blocked) blockedFriendIds.push(id); else blockedFriendIds.splice(i,1);
  el.classList.toggle('on', blocked);
  el.textContent = blocked ? 'Blocked' : 'Block';
}

function logOut(){
  closeSheet();
  showToast('Logged out');
}

/* ============================ CREATE QUIZ ============================ */
const CARD_PALETTES = [
  {bg:['--pal-lp1','--pal-lp2'], text:'#6E1F45'},
  {bg:['--pal-pw1','--pal-pw2'], text:'#2E2440'},
  {bg:['--pal-sb1','--pal-sb2'], text:'#062A3D'},
  {bg:['--pal-fu1','--pal-fu2'], text:'#3D0A29'},
  {bg:['--pal-nf1','--pal-nf2'], text:'#FBEFF6'},
  {bg:['--pal-pk1','--pal-pk2'], text:'#6B2431'},
  {bg:['--pal-fu1','--pal-dfu2'], text:'#FBEAF3'},
];
function randomPalette(){ return CARD_PALETTES[Math.floor(Math.random()*CARD_PALETTES.length)]; }
function openCreateQuiz(){
  const subjects=[
    {code:'SOC',name:'SOCIAL STUDIES',sub:'who are you',bg:['--periwinkle','--lavender'],text:'#221226'},
    {code:'AST',name:'ASTRONOMY',sub:'written in the stars',bg:['--ink','--periwinkle'],text:'#FBF5EB'},
  ];
  let selSubject=0, qRows=[{a:'',b:''},{a:'',b:''},{a:'',b:''}];
  let subMode='default', customSub='';
  let subjectTitle = subjects[0].name;
  const pal = randomPalette();
  const emphBg = isLightText(pal.text) ? v(pal.bg[1]) : pal.text;
  const emphFg = isLightText(pal.text) ? '#fff' : v(pal.bg[0]);
  const root=document.getElementById('overlayRoot');
  function render(){
    const s = subjects[selSubject];
    root.innerHTML=`
    <div class="sheetBackdrop" id="cqBackdrop">
      <div class="sheet" style="background:linear-gradient(165deg, ${v(pal.bg[0])}, ${v(pal.bg[1])}); color:${pal.text};">
        <div class="sheetHandle"></div>
        <button class="backLink" style="color:${pal.text}; opacity:.7;" onclick="closeSheet(); setTimeout(openCreateChooser,200);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
        <h3 style="color:${pal.text};">New quiz</h3>
        <div class="hint" style="color:${pal.text}; opacity:.7;">write a few either/or questions — friends answer honestly, no predicting involved. published quizzes are always anonymous — only you can see they're yours, from your profile.</div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBJECT</label>
          <div class="chipRow">${subjects.map((s2,i)=>`<div class="chip ${i===selSubject?'on':''}" style="${i===selSubject?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__cqSubject(${i})">${s2.name}</div>`).join('')}</div>
          <input placeholder="Subject title" value="${subjectTitle.replace(/"/g,'&quot;')}" class="cqSubjectInput" style="margin-top:10px;">
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBTITLE</label>
          <div class="chipRow">
            <div class="chip ${subMode==='default'?'on':''}" style="${subMode==='default'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__cqSubMode('default')">Use "${s.sub}"</div>
            <div class="chip ${subMode==='custom'?'on':''}" style="${subMode==='custom'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__cqSubMode('custom')">Write my own</div>
            <div class="chip ${subMode==='skip'?'on':''}" style="${subMode==='skip'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__cqSubMode('skip')">Skip</div>
          </div>
          ${subMode==='custom' ? `<input placeholder="e.g. ${s.sub}" value="${customSub.replace(/"/g,'&quot;')}" class="cqSubInput" style="margin-top:10px;">` : ''}
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">QUESTIONS</label>
          <div id="cqRows">${qRows.map((r,i)=>rowHTML(i,r)).join('')}</div>
          ${qRows.length<5 ? `<button class="addQBtn" style="color:${pal.text}; opacity:.7;" onclick="window.__cqAddRow()">+ add another question</button>`:''}
        </div>
        <button class="publishBtn" style="background:${pal.text}; color:${v(pal.bg[0])};" onclick="window.__cqPublish()">Publish to Discover</button>
      </div>
    </div>`;
    requestAnimationFrame(()=>{ const el=document.getElementById('cqBackdrop'); if(el) el.classList.add('show'); });
    document.getElementById('cqBackdrop').addEventListener('click', e=>{ if(e.target.id==='cqBackdrop') closeSheet(); });
    bindRowInputs();
    const subInp = root.querySelector('.cqSubInput');
    if(subInp) subInp.oninput = ()=>{ customSub = subInp.value; };
    const subjInp = root.querySelector('.cqSubjectInput');
    if(subjInp) subjInp.oninput = ()=>{ subjectTitle = subjInp.value; };
  }
  function rowHTML(i,r){
    return `<div class="qRow">
      <input placeholder="Option A" value="${r.a.replace(/"/g,'&quot;')}" data-i="${i}" data-side="a">
      <input placeholder="Option B" value="${r.b.replace(/"/g,'&quot;')}" data-i="${i}" data-side="b">
      ${qRows.length>1?`<button class="rm" onclick="window.__cqRemoveRow(${i})">×</button>`:''}
    </div>`;
  }
  function bindRowInputs(){
    root.querySelectorAll('#cqRows input').forEach(inp=>{
      inp.oninput = ()=>{ qRows[inp.dataset.i][inp.dataset.side]=inp.value; };
    });
  }
  window.__cqSubject = (i)=>{ selSubject=i; subjectTitle=subjects[i].name; render(); };
  window.__cqSubMode = (mode)=>{ subMode=mode; render(); };
  window.__cqAddRow = ()=>{ if(qRows.length<5){ qRows.push({a:'',b:''}); render(); } };
  window.__cqRemoveRow = (i)=>{ if(qRows.length>1){ qRows.splice(i,1); render(); } };
  window.__cqPublish = ()=>{
    const valid = qRows.filter(r=>r.a.trim() && r.b.trim());
    if(!valid.length){ showToast('add at least one full question'); return; }
    if(!subjectTitle.trim()){ showToast('enter a subject title'); return; }
    const s = subjects[selSubject];
    const id = 'u'+Date.now();
    const newQuiz = { id, subject:subjectTitle.trim(), sub:subMode==='skip' ? '' : (subMode==='custom' && customSub.trim()) ? customSub.trim() : s.sub, code:s.code, bg:pal.bg, text:pal.text,
      creator:'Anonymous', mine:true,
      questions: valid.map(r=>({a:r.a.trim(), b:r.b.trim()})) };
    QUIZZES.unshift(newQuiz);
    createdQuizIds.push(id);
    state.subIndex[id]=0;
    state.feedIndex=0;
    closeSheet();
    renderFeed();
    switchView('home');
    showToast('Published to Discover');
  };
  render();
}

function openCreateConfession(){
  const subjects=[
    {code:'PSY',name:'PSYCHOLOGY',sub:'for research purposes',bg:['--plum','--burgundy'],text:'#FBF5EB'},
    {code:'PHI',name:'PHILOSOPHY',sub:'fight me',bg:['--dusty-blue','--periwinkle'],text:'#221226'},
  ];
  let selSubject=0, qRows=[{text:'', options:['','']}];
  let subMode='default', customSub='';
  let subjectTitle = subjects[0].name;
  const pal = randomPalette();
  const emphBg = isLightText(pal.text) ? v(pal.bg[1]) : pal.text;
  const emphFg = isLightText(pal.text) ? '#fff' : v(pal.bg[0]);
  const root=document.getElementById('overlayRoot');
  function render(){
    const s = subjects[selSubject];
    root.innerHTML=`
    <div class="sheetBackdrop" id="ccBackdrop">
      <div class="sheet" style="background:linear-gradient(165deg, ${v(pal.bg[0])}, ${v(pal.bg[1])}); color:${pal.text};">
        <div class="sheetHandle"></div>
        <button class="backLink" style="color:${pal.text}; opacity:.7;" onclick="closeSheet(); setTimeout(openCreateChooser,200);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
        <h3 style="color:${pal.text};">New quiz</h3>
        <div class="hint" style="color:${pal.text}; opacity:.7;">write questions with your own answer options — they answer honestly, no guessing involved.</div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBJECT</label>
          <div class="chipRow">${subjects.map((s2,i)=>`<div class="chip ${i===selSubject?'on':''}" style="${i===selSubject?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__ccSubject(${i})">${s2.name}</div>`).join('')}</div>
          <input placeholder="Subject title" value="${subjectTitle.replace(/"/g,'&quot;')}" class="ccSubjectInput" style="margin-top:10px;">
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBTITLE</label>
          <div class="chipRow">
            <div class="chip ${subMode==='default'?'on':''}" style="${subMode==='default'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__ccSubMode('default')">Use "${s.sub}"</div>
            <div class="chip ${subMode==='custom'?'on':''}" style="${subMode==='custom'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__ccSubMode('custom')">Write my own</div>
            <div class="chip ${subMode==='skip'?'on':''}" style="${subMode==='skip'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__ccSubMode('skip')">Skip</div>
          </div>
          ${subMode==='custom' ? `<input placeholder="e.g. ${s.sub}" value="${customSub.replace(/"/g,'&quot;')}" class="ccSubInput" style="margin-top:10px;">` : ''}
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">QUESTION</label>
          <div id="ccRows">${qRows.map((r,qi)=>qRowHTML(r,qi)).join('')}</div>
        </div>
        <button class="publishBtn" style="background:${pal.text}; color:${v(pal.bg[0])};" onclick="window.__ccPublish()">Publish to Discover</button>
      </div>
    </div>`;
    requestAnimationFrame(()=>{ const el=document.getElementById('ccBackdrop'); if(el) el.classList.add('show'); });
    document.getElementById('ccBackdrop').addEventListener('click', e=>{ if(e.target.id==='ccBackdrop') closeSheet(); });
    bindInputs();
    const subInp = root.querySelector('.ccSubInput');
    if(subInp) subInp.oninput = ()=>{ customSub = subInp.value; };
    const subjInp = root.querySelector('.ccSubjectInput');
    if(subjInp) subjInp.oninput = ()=>{ subjectTitle = subjInp.value; };
  }
  function qRowHTML(r, qi){
    return `<div class="confQBlock">
      <div class="qRow">
        <input placeholder="e.g. What animal energy do I give off?" value="${r.text.replace(/"/g,'&quot;')}" data-qi="${qi}" class="ccQText">
        ${qRows.length>1?`<button class="rm" onclick="window.__ccRemoveQ(${qi})">×</button>`:''}
      </div>
      ${r.options.map((o,oi)=>`
        <div class="qRow">
          <input placeholder="Option ${oi+1}" value="${o.replace(/"/g,'&quot;')}" data-qi="${qi}" data-oi="${oi}" class="ccOptText">
          ${r.options.length>2?`<button class="rm" onclick="window.__ccRemoveOpt(${qi},${oi})">×</button>`:''}
        </div>`).join('')}
      ${r.options.length<5?`<button class="addQBtn" style="color:${pal.text}; opacity:.7;" onclick="window.__ccAddOpt(${qi})">+ add option</button>`:''}
    </div>`;
  }
  function bindInputs(){
    root.querySelectorAll('.ccQText').forEach(inp=>{ inp.oninput=()=>{ qRows[inp.dataset.qi].text=inp.value; }; });
    root.querySelectorAll('.ccOptText').forEach(inp=>{ inp.oninput=()=>{ qRows[inp.dataset.qi].options[inp.dataset.oi]=inp.value; }; });
  }
  window.__ccSubject=(i)=>{ selSubject=i; subjectTitle=subjects[i].name; render(); };
  window.__ccSubMode=(mode)=>{ subMode=mode; render(); };
  window.__ccAddQ=()=>{ if(qRows.length<3){ qRows.push({text:'',options:['','']}); render(); } };
  window.__ccRemoveQ=(qi)=>{ if(qRows.length>1){ qRows.splice(qi,1); render(); } };
  window.__ccAddOpt=(qi)=>{ if(qRows[qi].options.length<5){ qRows[qi].options.push(''); render(); } };
  window.__ccRemoveOpt=(qi,oi)=>{ if(qRows[qi].options.length>2){ qRows[qi].options.splice(oi,1); render(); } };
  window.__ccPublish=()=>{
    const valid = qRows
      .map(r=>({ text:r.text.trim(), options:r.options.map(o=>o.trim()).filter(Boolean) }))
      .filter(r=>r.text && r.options.length>=2);
    if(!valid.length){ showToast('write at least one full question with 2+ options'); return; }
    if(!subjectTitle.trim()){ showToast('enter a subject title'); return; }
    const s = subjects[selSubject];
    const id = 'ucf'+Date.now();
    const newConfession = { id, subject:subjectTitle.trim(), sub:subMode==='skip' ? '' : (subMode==='custom' && customSub.trim()) ? customSub.trim() : s.sub, code:s.code, bg:pal.bg, text:pal.text, creator:'Anonymous', mine:true, mode:'choice', format:'Confession', questions:valid };
    CONFESSIONS.unshift(newConfession);
    createdConfessionIds.push(id);
    closeSheet();
    renderFeed();
    switchView('home');
    showToast('Published to Discover');
  };
  render();
}

function openCreateYesNo(){
  const subjects=[
    {code:'CHEM',name:'CHEMISTRY',sub:"let's test your reaction",bg:['--orange','--pink'],text:'#221226'},
    {code:'ECO',name:'ECONOMICS',sub:'worth the risk',bg:['--sun','--cream'],text:'#221226'},
  ];
  let selSubject=0, qRows=[{text:''}];
  let subMode='default', customSub='';
  let subjectTitle = subjects[0].name;
  const pal = randomPalette();
  const emphBg = isLightText(pal.text) ? v(pal.bg[1]) : pal.text;
  const emphFg = isLightText(pal.text) ? '#fff' : v(pal.bg[0]);
  const root=document.getElementById('overlayRoot');
  function render(){
    const s = subjects[selSubject];
    root.innerHTML=`
    <div class="sheetBackdrop" id="ynBackdrop">
      <div class="sheet" style="background:linear-gradient(165deg, ${v(pal.bg[0])}, ${v(pal.bg[1])}); color:${pal.text};">
        <div class="sheetHandle"></div>
        <button class="backLink" style="color:${pal.text}; opacity:.7;" onclick="closeSheet(); setTimeout(openCreateChooser,200);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
        <h3 style="color:${pal.text};">New quiz</h3>
        <div class="hint" style="color:${pal.text}; opacity:.7;">write yes/no questions — they just tap Yes or No, no guessing involved.</div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBJECT</label>
          <div class="chipRow">${subjects.map((s2,i)=>`<div class="chip ${i===selSubject?'on':''}" style="${i===selSubject?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__ynSubject(${i})">${s2.name}</div>`).join('')}</div>
          <input placeholder="Subject title" value="${subjectTitle.replace(/"/g,'&quot;')}" class="ynSubjectInput" style="margin-top:10px;">
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBTITLE</label>
          <div class="chipRow">
            <div class="chip ${subMode==='default'?'on':''}" style="${subMode==='default'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__ynSubMode('default')">Use "${s.sub}"</div>
            <div class="chip ${subMode==='custom'?'on':''}" style="${subMode==='custom'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__ynSubMode('custom')">Write my own</div>
            <div class="chip ${subMode==='skip'?'on':''}" style="${subMode==='skip'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__ynSubMode('skip')">Skip</div>
          </div>
          ${subMode==='custom' ? `<input placeholder="e.g. ${s.sub}" value="${customSub.replace(/"/g,'&quot;')}" class="ynSubInput" style="margin-top:10px;">` : ''}
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">QUESTIONS</label>
          <div id="ynRows">${qRows.map((r,qi)=>rowHTML(r,qi)).join('')}</div>
          ${qRows.length<5 ? `<button class="addQBtn" style="color:${pal.text}; opacity:.7;" onclick="window.__ynAddQ()">+ add another question</button>`:''}
        </div>
        <button class="publishBtn" style="background:${pal.text}; color:${v(pal.bg[0])};" onclick="window.__ynPublish()">Publish to Discover</button>
      </div>
    </div>`;
    requestAnimationFrame(()=>{ const el=document.getElementById('ynBackdrop'); if(el) el.classList.add('show'); });
    document.getElementById('ynBackdrop').addEventListener('click', e=>{ if(e.target.id==='ynBackdrop') closeSheet(); });
    bindInputs();
    const subInp = root.querySelector('.ynSubInput');
    if(subInp) subInp.oninput = ()=>{ customSub = subInp.value; };
    const subjInp = root.querySelector('.ynSubjectInput');
    if(subjInp) subjInp.oninput = ()=>{ subjectTitle = subjInp.value; };
  }
  function rowHTML(r,qi){
    return `<div class="qRow">
      <input placeholder="e.g. Have I ever lied to you?" value="${r.text.replace(/"/g,'&quot;')}" data-qi="${qi}" class="ynQText">
      ${qRows.length>1?`<button class="rm" onclick="window.__ynRemoveQ(${qi})">×</button>`:''}
    </div>`;
  }
  function bindInputs(){
    root.querySelectorAll('.ynQText').forEach(inp=>{ inp.oninput=()=>{ qRows[inp.dataset.qi].text=inp.value; }; });
  }
  window.__ynSubject=(i)=>{ selSubject=i; subjectTitle=subjects[i].name; render(); };
  window.__ynSubMode=(mode)=>{ subMode=mode; render(); };
  window.__ynAddQ=()=>{ if(qRows.length<5){ qRows.push({text:''}); render(); } };
  window.__ynRemoveQ=(qi)=>{ if(qRows.length>1){ qRows.splice(qi,1); render(); } };
  window.__ynPublish=()=>{
    const valid = qRows.map(r=>({text:r.text.trim(), options:['Yes','No']})).filter(r=>r.text);
    if(!valid.length){ showToast('write at least one yes/no question'); return; }
    if(!subjectTitle.trim()){ showToast('enter a subject title'); return; }
    const s = subjects[selSubject];
    const id = 'uyn'+Date.now();
    const newConfession = { id, subject:subjectTitle.trim(), sub:subMode==='skip' ? '' : (subMode==='custom' && customSub.trim()) ? customSub.trim() : s.sub, code:s.code, bg:pal.bg, text:pal.text, creator:'Anonymous', mine:true, mode:'choice', questions:valid };
    CONFESSIONS.unshift(newConfession);
    createdConfessionIds.push(id);
    closeSheet();
    renderFeed();
    switchView('home');
    showToast('Published to Discover');
  };
  render();
}

function openCreateHidden(){
  const subjects=[
    {code:'A.H.',name:'AFTER HOURS',sub:'shh',bg:['--ink','--burgundy'],text:'#FBF5EB'},
  ];
  let selSubject=0, pickCount=1, prompts=['',''];
  let subMode='default', customSub='';
  let subjectTitle = subjects[0].name;
  const pal = randomPalette();
  const emphBg = isLightText(pal.text) ? v(pal.bg[1]) : pal.text;
  const emphFg = isLightText(pal.text) ? '#fff' : v(pal.bg[0]);
  const root=document.getElementById('overlayRoot');
  function render(){
    const s = subjects[selSubject];
    root.innerHTML=`
    <div class="sheetBackdrop" id="hdBackdrop">
      <div class="sheet" style="background:linear-gradient(165deg, ${v(pal.bg[0])}, ${v(pal.bg[1])}); color:${pal.text};">
        <div class="sheetHandle"></div>
        <button class="backLink" style="color:${pal.text}; opacity:.7;" onclick="closeSheet(); setTimeout(openCreateChooser,200);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
        <h3 style="color:${pal.text};">New quiz</h3>
        <div class="hint" style="color:${pal.text}; opacity:.7;">list numbered prompts — they'll pick a few and answer honestly, the rest stay hidden. just like After Hours.</div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBJECT</label>
          <div class="chipRow">${subjects.map((s2,i)=>`<div class="chip ${i===selSubject?'on':''}" style="${i===selSubject?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__hdSubject(${i})">${s2.name}</div>`).join('')}</div>
          <input placeholder="Subject title" value="${subjectTitle.replace(/"/g,'&quot;')}" class="hdSubjectInput" style="margin-top:10px;">
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBTITLE</label>
          <div class="chipRow">
            <div class="chip ${subMode==='default'?'on':''}" style="${subMode==='default'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__hdSubMode('default')">Use "${s.sub}"</div>
            <div class="chip ${subMode==='custom'?'on':''}" style="${subMode==='custom'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__hdSubMode('custom')">Write my own</div>
            <div class="chip ${subMode==='skip'?'on':''}" style="${subMode==='skip'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__hdSubMode('skip')">Skip</div>
          </div>
          ${subMode==='custom' ? `<input placeholder="e.g. ${s.sub}" value="${customSub.replace(/"/g,'&quot;')}" class="hdSubInput" style="margin-top:10px;">` : ''}
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">HOW MANY SHOULD THEY PICK?</label>
          <div class="chipRow">${[1,2,3].map(n=>`<div class="chip ${pickCount===n?'on':''}" style="${pickCount===n?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__hdPick(${n})">${n}</div>`).join('')}</div>
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">HIDDEN PROMPTS</label>
          <div id="hdRows">${prompts.map((p,pi)=>rowHTML(p,pi)).join('')}</div>
          ${prompts.length<8 ? `<button class="addQBtn" style="color:${pal.text}; opacity:.7;" onclick="window.__hdAddPrompt()">+ add another prompt</button>`:''}
        </div>
        <button class="publishBtn" style="background:${pal.text}; color:${v(pal.bg[0])};" onclick="window.__hdPublish()">Publish to Discover</button>
      </div>
    </div>`;
    requestAnimationFrame(()=>{ const el=document.getElementById('hdBackdrop'); if(el) el.classList.add('show'); });
    document.getElementById('hdBackdrop').addEventListener('click', e=>{ if(e.target.id==='hdBackdrop') closeSheet(); });
    bindInputs();
    const subInp = root.querySelector('.hdSubInput');
    if(subInp) subInp.oninput = ()=>{ customSub = subInp.value; };
    const subjInp = root.querySelector('.hdSubjectInput');
    if(subjInp) subjInp.oninput = ()=>{ subjectTitle = subjInp.value; };
  }
  function rowHTML(p,pi){
    return `<div class="qRow">
      <input placeholder="e.g. Last lie" value="${p.replace(/"/g,'&quot;')}" data-pi="${pi}" class="hdPText">
      ${prompts.length>2?`<button class="rm" onclick="window.__hdRemovePrompt(${pi})">×</button>`:''}
    </div>`;
  }
  function bindInputs(){
    root.querySelectorAll('.hdPText').forEach(inp=>{ inp.oninput=()=>{ prompts[inp.dataset.pi]=inp.value; }; });
  }
  window.__hdSubject=(i)=>{ selSubject=i; subjectTitle=subjects[i].name; render(); };
  window.__hdSubMode=(mode)=>{ subMode=mode; render(); };
  window.__hdPick=(n)=>{ pickCount=n; render(); };
  window.__hdAddPrompt=()=>{ if(prompts.length<8){ prompts.push(''); render(); } };
  window.__hdRemovePrompt=(pi)=>{ if(prompts.length>2){ prompts.splice(pi,1); render(); } };
  window.__hdPublish=()=>{
    const valid = prompts.map(p=>p.trim()).filter(Boolean);
    if(valid.length<2){ showToast('add at least 2 hidden prompts'); return; }
    if(!subjectTitle.trim()){ showToast('enter a subject title'); return; }
    const pc = Math.min(pickCount, valid.length);
    const s = subjects[selSubject];
    const id = 'uhd'+Date.now();
    const newConfession = { id, subject:subjectTitle.trim(), sub:subMode==='skip' ? '' : (subMode==='custom' && customSub.trim()) ? customSub.trim() : s.sub, code:s.code, bg:pal.bg, text:pal.text, creator:'Anonymous', mine:true, mode:'reveal', pickCount:pc, prompts:valid };
    CONFESSIONS.unshift(newConfession);
    createdConfessionIds.push(id);
    closeSheet();
    renderFeed();
    switchView('home');
    showToast('Published to Discover');
  };
  render();
}

function openCreatePredict(){
  const subjects=[
    {code:'MATH',name:'MATHEMATICS',sub:'figure you out',bg:['--cream','--pink'],text:'#221226'},
  ];
  const shapes=[
    {id:'eitheror', label:'Either/Or'},
    {id:'choice', label:'Choose One'},
    {id:'yesno', label:'Yes/No'},
  ];
  let selSubject=0, selShape='choice';
  let qRow = {text:'', options:['','']};
  let eoRows = [{a:'',b:''},{a:'',b:''},{a:'',b:''}];
  let ynRows = [{text:''}];
  let subMode='default', customSub='';
  let subjectTitle = subjects[0].name;
  const pal = randomPalette();
  const emphBg = isLightText(pal.text) ? v(pal.bg[1]) : pal.text;
  const emphFg = isLightText(pal.text) ? '#fff' : v(pal.bg[0]);
  const root=document.getElementById('overlayRoot');
  function applyShape(shape){
    selShape = shape;
    if(shape==='choice') qRow.options = ['',''];
  }
  function render(){
    const s = subjects[selSubject];
    root.innerHTML=`
    <div class="sheetBackdrop" id="pdBackdrop">
      <div class="sheet" style="background:linear-gradient(165deg, ${v(pal.bg[0])}, ${v(pal.bg[1])}); color:${pal.text};">
        <div class="sheetHandle"></div>
        <button class="backLink" style="color:${pal.text}; opacity:.7;" onclick="closeSheet(); setTimeout(openCreateChooser,200);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>
        <h3 style="color:${pal.text};">New quiz</h3>
        <div class="hint" style="color:${pal.text}; opacity:.7;">${selShape==='eitheror' ? "write a few either/or options — you'll guess how they'd answer before sending." : "write one question, then guess how they'd answer before sending — you'll see how close you got."}</div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">ANSWER FORMAT</label>
          <div class="chipRow">${shapes.map(sh=>`<div class="chip ${selShape===sh.id?'on':''}" style="${selShape===sh.id?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__pdShape('${sh.id}')">${sh.label}</div>`).join('')}</div>
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBJECT</label>
          <div class="chipRow">${subjects.map((s2,i)=>`<div class="chip ${i===selSubject?'on':''}" style="${i===selSubject?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__pdSubject(${i})">${s2.name}</div>`).join('')}</div>
          <input placeholder="Subject title" value="${subjectTitle.replace(/"/g,'&quot;')}" class="pdSubjectInput" style="margin-top:10px;">
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">SUBTITLE</label>
          <div class="chipRow">
            <div class="chip ${subMode==='default'?'on':''}" style="${subMode==='default'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__pdSubMode('default')">Use "${s.sub}"</div>
            <div class="chip ${subMode==='custom'?'on':''}" style="${subMode==='custom'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__pdSubMode('custom')">Write my own</div>
            <div class="chip ${subMode==='skip'?'on':''}" style="${subMode==='skip'?`background:${emphBg}; border-color:${emphBg}; color:${emphFg};`:''}" onclick="window.__pdSubMode('skip')">Skip</div>
          </div>
          ${subMode==='custom' ? `<input placeholder="e.g. ${s.sub}" value="${customSub.replace(/"/g,'&quot;')}" class="pdSubInput" style="margin-top:10px;">` : ''}
        </div>
        <div class="field"><label style="color:${pal.text}; opacity:.7;">${selShape==='choice' ? 'QUESTION' : 'QUESTIONS'}</label>
          <div id="pdRows">${qRowHTML()}</div>
          ${selShape==='eitheror' && eoRows.length<5 ? `<button class="addQBtn" style="color:${pal.text}; opacity:.7;" onclick="window.__pdAddRow()">+ add another question</button>`:''}
          ${selShape==='yesno' && ynRows.length<5 ? `<button class="addQBtn" style="color:${pal.text}; opacity:.7;" onclick="window.__pdAddYn()">+ add another question</button>`:''}
        </div>
        <button class="publishBtn" style="background:${pal.text}; color:${v(pal.bg[0])};" onclick="window.__pdPublish()">Publish to Discover</button>
      </div>
    </div>`;
    requestAnimationFrame(()=>{ const el=document.getElementById('pdBackdrop'); if(el) el.classList.add('show'); });
    document.getElementById('pdBackdrop').addEventListener('click', e=>{ if(e.target.id==='pdBackdrop') closeSheet(); });
    bindInputs();
    const subInp = root.querySelector('.pdSubInput');
    if(subInp) subInp.oninput = ()=>{ customSub = subInp.value; };
    const subjInp = root.querySelector('.pdSubjectInput');
    if(subjInp) subjInp.oninput = ()=>{ subjectTitle = subjInp.value; };
  }
  function qRowHTML(){
    if(selShape==='eitheror'){
      return eoRows.map((r,i)=>`<div class="qRow">
        <input placeholder="Option A" value="${r.a.replace(/"/g,'&quot;')}" data-i="${i}" data-side="a" class="pdEoText">
        <input placeholder="Option B" value="${r.b.replace(/"/g,'&quot;')}" data-i="${i}" data-side="b" class="pdEoText">
        ${eoRows.length>1?`<button class="rm" style="background:${emphBg}; color:${emphFg}; opacity:.7;" onclick="window.__pdRemoveRow(${i})">×</button>`:''}
      </div>`).join('');
    }
    const qInput = `<div class="qRow">
        <input placeholder="e.g. Your reaction when I text you?" value="${qRow.text.replace(/"/g,'&quot;')}" class="pdQText">
      </div>`;
    if(selShape==='yesno'){
      return ynRows.map((r,i)=>`<div class="qRow">
        <input placeholder="e.g. Have I ever lied to you?" value="${r.text.replace(/"/g,'&quot;')}" data-i="${i}" class="pdYnText">
        ${ynRows.length>1?`<button class="rm" style="background:${emphBg}; color:${emphFg}; opacity:.7;" onclick="window.__pdRemoveYn(${i})">×</button>`:''}
      </div>`).join('');
    }
    return `<div class="confQBlock">${qInput}
      ${qRow.options.map((o,oi)=>`
        <div class="qRow">
          <input placeholder="Option ${oi+1}" value="${o.replace(/"/g,'&quot;')}" data-oi="${oi}" class="pdOptText">
          ${qRow.options.length>2?`<button class="rm" style="background:${emphBg}; color:${emphFg}; opacity:.7;" onclick="window.__pdRemoveOpt(${oi})">×</button>`:''}
        </div>`).join('')}
      ${qRow.options.length<5?`<button class="addQBtn" style="color:${pal.text}; opacity:.7;" onclick="window.__pdAddOpt()">+ add option</button>`:''}
    </div>`;
  }
  function bindInputs(){
    const qInp = root.querySelector('.pdQText');
    if(qInp) qInp.oninput = ()=>{ qRow.text = qInp.value; };
    root.querySelectorAll('.pdOptText').forEach(inp=>{ inp.oninput=()=>{ qRow.options[inp.dataset.oi]=inp.value; }; });
    root.querySelectorAll('.pdEoText').forEach(inp=>{ inp.oninput=()=>{ eoRows[inp.dataset.i][inp.dataset.side]=inp.value; }; });
    root.querySelectorAll('.pdYnText').forEach(inp=>{ inp.oninput=()=>{ ynRows[inp.dataset.i].text=inp.value; }; });
  }
  window.__pdShape=(shape)=>{ applyShape(shape); render(); };
  window.__pdSubject=(i)=>{ selSubject=i; subjectTitle=subjects[i].name; render(); };
  window.__pdSubMode=(mode)=>{ subMode=mode; render(); };
  window.__pdAddOpt=()=>{ if(qRow.options.length<5){ qRow.options.push(''); render(); } };
  window.__pdRemoveOpt=(oi)=>{ if(qRow.options.length>2){ qRow.options.splice(oi,1); render(); } };
  window.__pdAddRow=()=>{ if(eoRows.length<5){ eoRows.push({a:'',b:''}); render(); } };
  window.__pdRemoveRow=(i)=>{ if(eoRows.length>1){ eoRows.splice(i,1); render(); } };
  window.__pdAddYn=()=>{ if(ynRows.length<5){ ynRows.push({text:''}); render(); } };
  window.__pdRemoveYn=(i)=>{ if(ynRows.length>1){ ynRows.splice(i,1); render(); } };
  window.__pdPublish=()=>{
    const s = subjects[selSubject];
    let questions;
    if(selShape==='eitheror'){
      questions = eoRows.filter(r=>r.a.trim() && r.b.trim()).map(r=>({ text:'', options:[r.a.trim(), r.b.trim()] }));
      if(!questions.length){ showToast('add at least one full question'); return; }
    } else if(selShape==='yesno'){
      questions = ynRows.filter(r=>r.text.trim()).map(r=>({ text:r.text.trim(), options:['Yes','No'] }));
      if(!questions.length){ showToast('add at least one full question'); return; }
    } else {
      const text = qRow.text.trim();
      const options = qRow.options.map(o=>o.trim()).filter(Boolean);
      if(!text || options.length<2){ showToast('write a question with at least 2 options'); return; }
      questions = [{text, options}];
    }
    if(!subjectTitle.trim()){ showToast('enter a subject title'); return; }
    const id = 'upd'+Date.now();
    const newConfession = { id, subject:subjectTitle.trim(), sub:subMode==='skip' ? '' : (subMode==='custom' && customSub.trim()) ? customSub.trim() : s.sub, code:s.code, bg:pal.bg, text:pal.text, creator:'Anonymous', mine:true, mode:'predict', format:'Prediction', questions };
    CONFESSIONS.unshift(newConfession);
    createdConfessionIds.push(id);
    closeSheet();
    renderFeed();
    switchView('home');
    showToast('Published to Discover');
  };
  render();
}

function openCreateChooser(){
  const root=document.getElementById('overlayRoot');
  root.innerHTML=`
  <div class="sheetBackdrop" id="ccpBackdrop">
    <div class="sheet">
      <div class="sheetHandle"></div>
      <h3>What do you want to create?</h3>
      <div class="hint">all published anonymously and only show up as yours on your profile</div>
      <div class="doneActions">
        <button class="bigBtn" style="background:linear-gradient(100deg, ${v('--pal-pw1')}, ${v('--pal-pw2')}); color:#2E2440;" onclick="closeSheet(); setTimeout(openCreateQuiz,200);">Either/Or</button>
        <button class="bigBtn" style="background:linear-gradient(100deg, ${v('--pal-pk1')}, ${v('--pal-pk2')}); color:#6B2431;" onclick="closeSheet(); setTimeout(openCreateConfession,200);">Choose One</button>
        <button class="bigBtn" style="background:linear-gradient(100deg, ${v('--pal-lp1')}, ${v('--pal-lp2')}); color:#6E1F45;" onclick="closeSheet(); setTimeout(openCreateYesNo,200);">Yes/No</button>
        <button class="bigBtn" style="background:linear-gradient(100deg, ${v('--pal-pw1')}, ${v('--pal-pw2')}); color:#2E2440;" onclick="closeSheet(); setTimeout(openCreatePredict,200);">Predict</button>
        <button class="bigBtn" style="background:linear-gradient(100deg, ${v('--pal-fu1')}, ${v('--pal-dfu2')}); color:#FBEAF3;" onclick="closeSheet(); setTimeout(openCreateHidden,200);">Hidden</button>
      </div>
    </div>
  </div>`;
  requestAnimationFrame(()=>{ const el=document.getElementById('ccpBackdrop'); if(el) el.classList.add('show'); });
  document.getElementById('ccpBackdrop').addEventListener('click', e=>{ if(e.target.id==='ccpBackdrop') closeSheet(); });
}

/* ============================ NAV ============================ */
function switchView(view){
  state.view=view;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(view+'-view').classList.add('active');
  document.querySelectorAll('.navBtn').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  document.getElementById('bottomnav').style.display='flex';
  setStatusColor('#1E1220');
  if(view==='messages'){ renderConvList(); document.getElementById('navPing').style.display='none'; }
  if(view==='profile'){ renderProfile(); }
}

/* ============================ INIT ============================ */
renderFeed();
renderConvList();
switchView('home');
