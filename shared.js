/* Shared behaviour: chapters, story player, progress bar, counters, back-to-top */
const LB=["Purpose","Why left behind or retired","Scientific contribution","Current status","Why it still matters today"];
const TAG={moon:"MOON",mars:"MARS",beyond:"BEYOND"};
function renderChapters(items,key){
  let h="";
  items.forEach((d,n)=>{
    const art=`<div class="art" style="color:var(--ac)"><div class="ph"><img src="${d.img}" style="transform-origin:${d.o||"50% 50%"};--z:${d.z||1.25}" alt="${d.n}" onload="this.closest('.art').classList.add('has')"><span>${d.cap||"Left behind · NASA image"}</span></div>${d.svg||""}</div>`;
    const body=d.h?d.h:`<div class="meta"><span><b>Mission:</b> ${d.m}</span><span><b>Year:</b> ${d.y}</span></div><dl>${[d.p,d.w,d.s,d.t,d.x].map((v,j)=>`<div><dt>${LB[j]}</dt><dd>${v}</dd></div>`).join("")}<div><dt>Official NASA information source</dt><dd><a href="${d.u}" target="_blank" rel="noopener">${d.u.replace("https://","")}</a></dd></div></dl>`;
    h+=`<article class="ch ${d.a||""}" id="h${n+1}">${art}<div class="card"><div class="num">${TAG[key]} · STORY ${n+1} OF ${items.length}</div><h3>${d.n}</h3><p class="q">“${d.q}”</p>${body}</div></article>`;
  });
  document.getElementById("app").innerHTML=h;
  const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add("in")),{threshold:.15});
  document.querySelectorAll(".ch").forEach(c=>io.observe(c));
  const PERS={moon:{n:"Lunar Control",r:.88,p:.75,v:/david|daniel|alex|george|mark|male/i,i:"Lunar Control. Incoming transmission from the Moon.",o:"End of transmission."},mars:{n:"Mars Surface Report",r:1,p:1.2,v:/samantha|zira|susan|karen|hazel|aria|jenny|female/i,i:"Mars surface report. Signal received.",o:"Signal complete."},beyond:{n:"Deep Space Signal",r:.8,p:.6,v:/david|daniel|alex|george|male/i,i:"Deep space signal detected. Receiving transmission.",o:"Signal fading. End of transmission."}}[key];
  let AC,FX=[];
  function ac(){if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C()}if(AC&&AC.state=="suspended")AC.resume();return AC}
  function noise(g,f,type){const a=ac(),b=a.createBuffer(1,a.sampleRate*2,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=a.createBufferSource();s.buffer=b;s.loop=true;const fl=a.createBiquadFilter();fl.type=type;fl.frequency.value=f;const gn=a.createGain();gn.gain.value=g;s.connect(fl);fl.connect(gn);gn.connect(a.destination);s.start();FX.push(s)}
  function tone(f,t,dur,g){const a=ac(),o=a.createOscillator(),gn=a.createGain();o.frequency.value=f;gn.gain.setValueAtTime(0,a.currentTime+t);gn.gain.linearRampToValueAtTime(g,a.currentTime+t+.02);gn.gain.exponentialRampToValueAtTime(.0001,a.currentTime+t+dur);o.connect(gn);gn.connect(a.destination);o.start(a.currentTime+t);o.stop(a.currentTime+t+dur+.05)}
  function fxStop(){FX.forEach(s=>{try{s.stop()}catch(e){}});FX=[]}
  function fxStart(){if(!voice||!ac())return;fxStop();
    if(key=="moon"){tone(2525,0,.25,.12);noise(.012,2500,"bandpass")}
    else if(key=="mars"){tone(1200,0,1.2,.1);noise(.02,500,"lowpass")}
    else{noise(.008,300,"lowpass");[55,82.4,110].forEach(f=>{const a=ac(),o=a.createOscillator(),gn=a.createGain();o.frequency.value=f;gn.gain.value=.03;o.connect(gn);gn.connect(a.destination);o.start();FX.push(o)})}}
  function fxEnd(){if(!voice||!ac())return;if(key=="moon")tone(2475,0,.25,.12);else if(key=="mars")tone(800,0,1,.1);else tone(220,0,1.5,.05);setTimeout(fxStop,300)}
  function pickV(){const vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));return vs.find(v=>PERS.v.test(v.name))||vs[0]}
  let tok=0,voice=true;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function say(t){return new Promise(r=>{if(!voice||!window.speechSynthesis)return r();const u=new SpeechSynthesisUtterance(t);u.rate=PERS.r;u.pitch=PERS.p;const pv=pickV();if(pv)u.voice=pv;u.onend=u.onerror=()=>r();setTimeout(r,t.length*110);speechSynthesis.speak(u)})}
  const rs=()=>document.querySelectorAll(".pl").forEach(x=>{x.dataset.s="";x.textContent="▶ Hear its story"});
  document.querySelectorAll(".ch").forEach((c,i)=>{
    const a=c.querySelector(".art"),w=document.createElement("div");w.className="col";a.replaceWith(w);w.append(a);
    w.insertAdjacentHTML("beforeend",'<div class="story"><div class="row"><button class="pl">▶ Hear its story</button><button class="vo" title="Voice on/off">🔊</button></div><p class="live"></p></div>');
    const b=w.querySelector(".pl"),L=w.querySelector(".live");
    w.querySelector(".vo").onclick=()=>{voice=!voice;document.querySelectorAll(".vo").forEach(x=>x.textContent=voice?"🔊":"🔇");if(!voice){fxStop();if(window.speechSynthesis)speechSynthesis.cancel()}};
    b.onclick=async()=>{const was=b.dataset.s=="1",my=++tok;document.querySelectorAll(".ch.on").forEach(x=>x.classList.remove("on"));if(window.speechSynthesis)speechSynthesis.cancel();rs();fxStop();if(was)return;
      b.dataset.s="1";b.textContent="■ Stop";c.classList.add("on");L.textContent="";
      L.innerHTML='<span class="sys">📡 '+PERS.n+' · live</span>';fxStart();const lines=[PERS.i,...items[i].st,PERS.o];
      for(let k=0;k<lines.length;k++){const t=lines[k];if(my!=tok)return;const p=document.createElement("span");if(k==0||k==lines.length-1)p.className="sys";L.append(p);const sp=say(t);for(const ch of t){if(my!=tok)return;p.textContent+=ch;await sleep(28)}await sp;await sleep(500)}
      if(my==tok){fxEnd();c.classList.remove("on");b.dataset.s="";b.textContent="↺ Hear again"}};
  });
  if(location.hash){const t=document.querySelector(location.hash);t&&setTimeout(()=>t.scrollIntoView(),150)}
}
function common(){
  const co=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;co.unobserve(x.target);const n=+x.target.dataset.n;let v=0;const t=setInterval(()=>{v++;x.target.textContent=v;if(v>=n)clearInterval(t)},1400/n)}),{threshold:.6});
  document.querySelectorAll(".stats b").forEach(b=>co.observe(b));
  const pg=document.getElementById("pg");addEventListener("scroll",()=>{pg.style.width=100*scrollY/(document.documentElement.scrollHeight-innerHeight)+"%"});
  document.body.insertAdjacentHTML("beforeend",'<button id="top" aria-label="Back to top">↑</button>');document.getElementById("top").onclick=()=>scrollTo({top:0});
}
common();
