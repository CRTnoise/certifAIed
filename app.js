(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = {o1:'#ff8205',o2:'#fa500f',o3:'#e10500',o4:'#c3002f',gold:'#ffaf00',paper:'#f4f1ec',mute:'#a3a0a8',dim:'#6d6a73',line:'#2c2c34',ink3:'#222228',blue:'#2c8cff'};
const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const ROOT=document.documentElement;

/* ---------- language ---------- */
let LANG=ROOT.getAttribute('data-lang')==='fr'?'fr':'en';
const tr=(en,fr)=>LANG==='fr'?fr:en;
const nf=(x,d)=>{const s=x.toFixed(d);return LANG==='fr'?s.replace('.',','):s;};
const langHooks=[];
function setLang(l){LANG=l==='fr'?'fr':'en';ROOT.setAttribute('data-lang',LANG);ROOT.lang=LANG;store.set('cai_lang',LANG);
  document.title='CertifAIed';$('#langBtn').setAttribute('aria-label',tr('Passer en français','Switch to English'));
  langHooks.forEach(f=>{try{f()}catch(e){console.error(e)}});}
window.__setLang=setLang;window.__lang=()=>LANG;

function setup(cv){if(cv.dataset.h===undefined)cv.dataset.h=cv.getAttribute('height')||'';const r=cv.getBoundingClientRect();const dpr=devicePixelRatio||1;const h=+cv.dataset.h||r.height;if(cv.dataset.h)cv.style.height=h+'px';cv.width=Math.max(1,r.width*dpr);cv.height=h*dpr;const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return {x,w:r.width,h};}
function bind(id,fn){const el=$('#'+id),o=$('#'+id+'o');const f=()=>{if(o)o.textContent=el.value;fn();};el.addEventListener('input',f);return f;}
const redraws=[];let lastW=innerWidth,rzT;addEventListener('resize',()=>{if(innerWidth===lastW)return;lastW=innerWidth;clearTimeout(rzT);rzT=setTimeout(()=>redraws.forEach(f=>f()),120);});
langHooks.push(()=>redraws.forEach(f=>f()));

/* ---------- units nav & progress ---------- */
const UNITS=$$('section.unit').map(s=>{const h=s.querySelector('.uhead h2');return {id:s.id,n:+s.dataset.unit,en:h.querySelector('[data-l="en"]').textContent,fr:h.querySelector('[data-l="fr"]').textContent,phase:s.querySelector('.uhead .tag').textContent};});
const side=$('#side');let lastPhase='';
const bi=(en,fr)=>{const w=document.createElement('span');const a=document.createElement('span');a.dataset.l='en';a.textContent=en;const b=document.createElement('span');b.dataset.l='fr';b.textContent=fr;w.append(a,b);return w;};
UNITS.forEach(u=>{if(u.phase!==lastPhase){const h=document.createElement('h4');h.textContent=u.phase;side.appendChild(h);lastPhase=u.phase;}
  const a=document.createElement('a');a.href='#'+u.id;a.dataset.u=u.n;const b=document.createElement('b');b.textContent=String(u.n).padStart(2,'0');const em=document.createElement('em');a.append(b,bi(u.en,u.fr),em);side.appendChild(a);});
const ex=document.createElement('h4');ex.appendChild(bi('After the course','Après le cours'));side.appendChild(ex);
const aa=document.createElement('a');aa.href='#arsenal';const ab=document.createElement('b');ab.textContent='Q&A';const ae=document.createElement('em');ae.style.background='none';aa.append(ab,bi('Interview questions','Questions d’entretien'),ae);side.appendChild(aa);
const about=document.createElement('a');about.href='#top';about.className='aboutBtn';const bb=document.createElement('b');bb.textContent='i';const be=document.createElement('em');be.style.background='none';about.append(bb,bi('About this course','À propos du cours'),be);side.appendChild(about);
function closeMenu(){side.classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');}
side.addEventListener('click',e=>{if(e.target.closest('a')&&innerWidth<=1000)closeMenu();});
$('#menuBtn').onclick=()=>{const o=side.classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',o);document.body.classList.toggle('menu-open',o);};
addEventListener('keydown',e=>{if(e.key==='Escape'&&side.classList.contains('open'))closeMenu();});
$('#langBtn').onclick=()=>setLang(LANG==='fr'?'en':'fr');
const track=$('#track');for(let i=0;i<16;i++)track.appendChild(document.createElement('i'));
let solved={};try{solved=JSON.parse(store.get('cai_solved','{}'))||{}}catch(e){solved={}}
function saveSolved(){store.set('cai_solved',JSON.stringify(solved));}
function progress(){let done=0;UNITS.forEach(u=>{const qs=$$('#'+u.id+' .quiz');const ok=qs.length&&qs.every((q,i)=>solved[u.id+'_'+i]);const a=side.querySelector('a[data-u="'+u.n+'"]');a.classList.toggle('done',!!ok);track.children[u.n-1].classList.toggle('on',!!ok);if(ok)done++;});$('#progtxt').textContent=tr(done+' / 16 units cleared',done+' / 16 unités validées');}
langHooks.push(progress);
function markQuiz(q){const bs=[...q.querySelector('.opts').children];const ans=+q.dataset.a;bs[ans].classList.add('right');q.querySelector('.ex').hidden=false;if(!q.querySelector('.ok')){const s=bi('cleared','validé');s.className='ok';q.querySelector('.q').appendChild(s);}}
function applySolved(){UNITS.forEach(u=>$$('#'+u.id+' .quiz').forEach((q,i)=>{if(solved[u.id+'_'+i])markQuiz(q);}));progress();}
UNITS.forEach(u=>{$$('#'+u.id+' .quiz').forEach((q,i)=>{const key=u.id+'_'+i;const bs=[...q.querySelector('.opts').children];const ans=+q.dataset.a;
  bs.forEach((b,j)=>b.onclick=()=>{if(j===ans){bs.forEach(x=>x.classList.remove('wrong'));markQuiz(q);solved[key]=1;saveSolved();progress();}else{b.classList.add('wrong');}});});});
applySolved();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){side.querySelectorAll('a[data-u]').forEach(a=>a.classList.toggle('cur',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-40% 0px -55% 0px'});
$$('section.unit').forEach(s=>io.observe(s));

/* ---------- startup screen (one time) ---------- */
const su=$('#startup');
const goBtn=()=>su.querySelector('[data-l="'+LANG+'"] .su-go');
function openIntro(step){su.dataset.step=step;ROOT.setAttribute('data-onboard','1');setTimeout(()=>{const f=step==='1'?su.querySelector('[data-pick]'):goBtn();if(f)f.focus();},30);}
function closeIntro(){store.set('cai_onboarded','1');ROOT.removeAttribute('data-onboard');}
if(ROOT.getAttribute('data-onboard')==='1'){su.dataset.step='1';}
$$('#startup [data-pick]').forEach(b=>b.onclick=()=>{setLang(b.dataset.pick);su.dataset.step='2';su.scrollTop=0;const g=goBtn();if(g)g.focus();});
$$('#startup .su-go').forEach(b=>b.onclick=closeIntro);
$$('#startBack,#startup [data-back]').forEach(b=>b.onclick=()=>{su.dataset.step='1';su.scrollTop=0;});
document.addEventListener('click',e=>{const t=e.target.closest('.aboutBtn');if(t){e.preventDefault();openIntro('2');}});
addEventListener('keydown',e=>{if(e.key==='Escape'&&ROOT.getAttribute('data-onboard')==='1'&&su.dataset.step==='2')closeIntro();});
(function(){const g=$('#suPix');if(!g)return;const pal=[C.o2,C.o1,C.o3,C.o4,C.gold,C.o2,C.o1];for(let i=0;i<48;i++){const d=document.createElement('i');d.style.background=pal[(Math.random()*pal.length)|0];d.style.animationDelay=(i%12)*40+'ms';g.appendChild(d);}})();

/* ---------- hero mosaic ---------- */
(function(){const cv=$('#mosaic');const pal=[C.o2,C.o1,C.o3,C.o4,C.gold,C.o2,C.o2,C.o1];let S,cols,rows,cells;
 function init(){S=setup(cv);const sz=S.w<600?28:44;cols=Math.ceil(S.w/sz)+1;rows=Math.ceil(S.h/sz)+1;cells=[];for(let i=0;i<cols*rows;i++)cells.push(pal[(Math.random()*pal.length)|0]);S.sz=sz;draw(sz);}
 function draw(sz){const x=S.x;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){x.fillStyle=cells[r*cols+c];x.fillRect(c*sz,r*sz,sz,sz);}
   x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=1;for(let c=0;c<=cols;c++){x.beginPath();x.moveTo(c*sz+.5,0);x.lineTo(c*sz+.5,S.h);x.stroke();}
   x.fillStyle='#1a0a00';x.font='11px Silkscreen, monospace';x.fillText(tr('LOSS ↓','PERTE ↓'),12,S.h-12);x.fillText('ATTENTION IS ALL YOU NEED',S.w-220,22);}
 init();redraws.push(init);
 let vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(cv);
 if(!RM)setInterval(()=>{if(!vis||document.hidden)return;for(let k=0;k<3;k++)cells[(Math.random()*cells.length)|0]=pal[(Math.random()*pal.length)|0];draw(S.sz);},260);})();

/* ---------- missions ---------- */
const MISSIONS={
1:[['Get the MSE below 1.0 by hand.','Faites descendre la MSE sous 1,0 à la main.'],['Get within 0.05 of the best possible MSE.','Approchez-vous à 0,05 près de la meilleure MSE possible.'],['Set a negative slope w and watch the error squares explode (MSE above 10).','Donnez une pente w négative et regardez les carrés d’erreur exploser (MSE au-dessus de 10).']],
2:[['With η ≤ 0.2, reach the lowest valley (loss within 0.02 of the global minimum).','Avec η ≤ 0,2, atteignez la vallée la plus basse (perte à 0,02 près du minimum global).'],['Make it diverge: θ leaves the chart.','Faites-le diverger : θ sort du graphique.'],['Get stuck: settle in a valley that is NOT the lowest (tip: move θ₀, use a small η).','Restez coincé : stabilisez-vous dans une vallée qui N’EST PAS la plus basse (astuce : déplacez θ₀, prenez un petit η).']],
3:[['Look at all five activation functions.','Regardez les cinq fonctions d’activation.'],['Find the one whose derivative is zero almost everywhere (it cannot be trained with gradients).','Trouvez celle dont la dérivée est nulle presque partout (impossible à entraîner par gradient).']],
4:[['Underfit: pick a degree where the verdict says underfitting.','Sous-apprentissage : choisissez un degré où le verdict l’indique.'],['Find a good fit: validation MSE below 0.08.','Trouvez un bon ajustement : MSE de validation sous 0,08.'],['Overfit: make validation MSE at least 3× the training MSE.','Surapprentissage : rendez la MSE de validation au moins 3× plus grande que celle d’entraînement.'],['Draw a new noisy sample and check your good degree still works.','Tirez un nouvel échantillon bruité et vérifiez que votre bon degré marche encore.']],
5:[['Do 5 merges and read which pairs got merged.','Faites 5 fusions et lisez quelles paires ont été fusionnées.'],['Merge until no pair repeats (BPE stops).','Fusionnez jusqu’à ce qu’aucune paire ne se répète (BPE s’arrête).'],['Type your own sentence (press Enter) and train BPE on it.','Tapez votre propre phrase (Entrée) et entraînez BPE dessus.']],
6:[['Find two words with cosine above 0.95.','Trouvez deux mots avec un cosinus au-dessus de 0,95.'],['Find two words with negative cosine (opposite directions).','Trouvez deux mots avec un cosinus négatif (directions opposées).'],['Run the king − man + woman analogy.','Lancez l’analogie roi − homme + femme.']],
7:[['Find a keep-rate where "robot" still has more than 10% of its signal.','Trouvez un taux de conservation où « robot » garde plus de 10 % de son signal.'],['Drop the keep-rate to 0.6 and see the start of the sentence vanish.','Descendez le taux à 0,6 et regardez le début de la phrase disparaître.']],
8:[['Click "it" and check which word gets the most weight.','Cliquez sur « elle » et vérifiez quel mot reçoit le plus de poids.'],['Untick scaling and set dₖ ≥ 128: watch the softmax collapse (entropy below 0.3).','Décochez la mise à l’échelle et mettez dₖ ≥ 128 : le softmax s’effondre (entropie sous 0,3).'],['Tick scaling back on: the distribution recovers at any dₖ.','Recochez la mise à l’échelle : la distribution redevient douce, quel que soit dₖ.']],
9:[['Visit all four heads.','Visitez les quatre têtes.'],['Turn the causal mask off (BERT-style) and see the upper triangle fill in.','Désactivez le masque causal (façon BERT) et regardez le triangle supérieur se remplir.']],
10:[['Greedy decoding: set top-k = 1 and sample. Every sample is identical.','Décodage glouton : top-k = 1, puis échantillonnez. Tous les tirages sont identiques.'],['Creative mode: temperature ≥ 1.5, sample, and get at least 6 different words.','Mode créatif : température ≥ 1,5, échantillonnez et obtenez au moins 6 mots différents.'],['Nucleus: set top-p ≤ 0.5 and see how many tokens survive.','Noyau : top-p ≤ 0,5, et regardez combien de tokens survivent.']],
11:[['Find a rank where you train less than 0.1% of the matrix.','Trouvez un rang où vous entraînez moins de 0,1 % de la matrice.'],['Make LoRA pointless: train more than 40% of the matrix.','Rendez LoRA inutile : entraînez plus de 40 % de la matrice.']],
12:[['Run the default question and find the cited source.','Lancez la question par défaut et trouvez la source citée.'],['Ask about the touch panel and see a different chunk win.','Posez une question sur l’écran tactile et regardez un autre chunk gagner.'],['Ask something the documents do not cover (e.g. "Who won the World Cup?") and see the model abstain.','Demandez quelque chose que les documents ne couvrent pas (ex. « Qui a gagné la Coupe du monde ? ») et regardez le modèle s’abstenir.']],
13:[['Step through the whole loop to the final answer.','Avancez dans toute la boucle jusqu’à la réponse finale.'],['Count the tool calls the agent made (answer: in the log).','Comptez les appels d’outils de l’agent (réponse : dans le journal).']],
14:[['Use 2×2 patches: how many tokens does the image become?','Prenez des patchs 2×2 : combien de tokens devient l’image ?'],['Push diffusion to t = 100 (pure noise).','Poussez la diffusion à t = 100 (bruit pur).'],['Find the t where you can no longer recognise the figure.','Trouvez le t où vous ne reconnaissez plus la figure.']],
15:[['Make a 7B model run above 60 tokens/s at 450 GB/s.','Faites tourner un modèle 7B au-dessus de 60 tokens/s à 450 Go/s.'],['Fit a 70B model under 48 GB total.','Faites tenir un modèle 70B sous 48 Go au total.'],['Make the KV cache bigger than the weights.','Rendez le cache KV plus gros que les poids.']],
16:[['Reach recall 1.00 (catch every defect).','Atteignez un rappel de 1,00 (attrapez chaque défaut).'],['Reach precision 1.00 (no false alarms).','Atteignez une précision de 1,00 (aucune fausse alerte).'],['Find the threshold with the best F1 (within 0.01 of the maximum).','Trouvez le seuil au meilleur F1 (à 0,01 près du maximum).']]};
let mdone={};try{mdone=JSON.parse(store.get('cai_missions','{}'))||{}}catch(e){mdone={}}
$$('.lab').forEach((lab,i)=>{const n=i+1;const ul=document.createElement('ul');ul.className='missions';const tg=bi('Missions · auto-checked','Missions · vérifiées automatiquement');tg.className='tag';ul.appendChild(tg);(MISSIONS[n]||[]).forEach((t,j)=>{const li=document.createElement('li');li.dataset.k=n+'_'+j;li.appendChild(bi(t[0],t[1]));ul.appendChild(li);});lab.querySelector('.lb').appendChild(ul);});
function applyMissions(){$$('.missions li').forEach(li=>li.classList.toggle('done',!!mdone[li.dataset.k]));}
applyMissions();
function M(n,j){const k=n+'_'+j;if(mdone[k])return;mdone[k]=1;store.set('cai_missions',JSON.stringify(mdone));const li=document.querySelector('.missions li[data-k="'+k+'"]');if(li)li.classList.add('done');}
window.__M=M;

/* ---------- progress backup ---------- */
(function(){const box=$('#bkBox'),txt=$('#bkText'),msg=$('#bkMsg'),apply=$('#bkApply');if(!box)return;
 const say=(en,fr)=>{msg.textContent=tr(en,fr);};
 $('#bkExport').onclick=()=>{const code=btoa(unescape(encodeURIComponent(JSON.stringify({v:1,s:solved,m:mdone,l:LANG}))));box.hidden=false;apply.hidden=true;txt.value=code;
   const sel=()=>{txt.focus();txt.select();say('Code selected. Copy it and keep it somewhere safe.','Code sélectionné. Copiez-le et gardez-le en lieu sûr.');};
   try{navigator.clipboard.writeText(code).then(()=>say('Copied. Keep this code somewhere safe to restore your progress on any device.','Copié. Gardez ce code en lieu sûr pour restaurer votre progression sur n’importe quel appareil.'),sel);}catch(e){sel();}};
 $('#bkImport').onclick=()=>{box.hidden=false;apply.hidden=false;txt.value='';txt.focus();say('Paste your code, then press Restore.','Collez votre code, puis appuyez sur Restaurer.');};
 apply.onclick=()=>{try{const o=JSON.parse(decodeURIComponent(escape(atob(txt.value.trim()))));if(!o||typeof o!=='object'||(!o.s&&!o.m))throw 0;
   Object.assign(solved,o.s||{});Object.assign(mdone,o.m||{});saveSolved();store.set('cai_missions',JSON.stringify(mdone));store.set('cai_onboarded','1');applySolved();applyMissions();
   const n=Object.keys(o.s||{}).length+Object.keys(o.m||{}).length;say('Restored '+n+' saved items.',n+' éléments restaurés.');apply.hidden=true;}
   catch(e){say('That code isn’t valid. Copy the whole code and try again.','Ce code n’est pas valide. Copiez le code en entier et réessayez.');}};
})();

/* ---------- Lab 1 ---------- */
(function(){const cv=$('#c1');const pts=[];let seed=3;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 for(let i=0;i<14;i++){const x=0.3+i*0.5;pts.push([x,0.8*x+1+(rnd()-0.5)*1.6]);}
 const n=pts.length,mx=pts.reduce((a,p)=>a+p[0],0)/n,my=pts.reduce((a,p)=>a+p[1],0)/n;let sxy=0,sxx=0;pts.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my);sxx+=(p[0]-mx)**2});const bw=sxy/sxx,bb=my-bw*mx;
 const mse=(w,b)=>pts.reduce((a,p)=>a+(w*p[0]+b-p[1])**2,0)/n;const best=mse(bw,bb);
 function draw(){const S=setup(cv),x=S.x,w=+$('#w1').value,b=+$('#b1').value;const X=v=>30+v/7.4*(S.w-40),Y=v=>S.h-20-v/8*(S.h-30);
  x.strokeStyle=C.line;for(let i=0;i<=8;i++){x.beginPath();x.moveTo(30,Y(i));x.lineTo(S.w,Y(i));x.stroke();}
  x.save();x.beginPath();x.rect(0,0,S.w,S.h);x.clip();
  pts.forEach(p=>{const py=w*p[0]+b;const side=Math.min(S.h,Math.abs(Y(py)-Y(p[1])));const top=Math.max(-S.h,Math.min(Y(py),Y(p[1])));x.fillStyle='rgba(250,80,15,.18)';x.strokeStyle='rgba(250,80,15,.6)';x.fillRect(X(p[0]),top,side,side);x.strokeRect(X(p[0]),top,side,side);});
  x.strokeStyle=C.paper;x.lineWidth=2;x.beginPath();x.moveTo(X(0),Y(b));x.lineTo(X(7.4),Y(w*7.4+b));x.stroke();x.lineWidth=1;x.restore();
  pts.forEach(p=>{x.fillStyle=C.gold;x.fillRect(X(p[0])-4,Y(p[1])-4,8,8);});
  const m=mse(w,b);$('#mse1').textContent=nf(m,3);$('#best1').textContent=nf(best,3);if(m<1)M(1,0);if(m-best<0.05)M(1,1);if(w<0&&m>10)M(1,2);}
 bind('w1',draw);bind('b1',draw);$('#w1o').textContent=$('#w1').value;$('#b1o').textContent=$('#b1').value;
 $('#best1btn').onclick=()=>{$('#w1').value=bw.toFixed(2);$('#b1').value=bb.toFixed(2);$('#w1o').textContent=$('#w1').value;$('#b1o').textContent=$('#b1').value;draw();};
 draw();redraws.push(draw);})();

/* ---------- Lab 2 ---------- */
(function(){const cv=$('#c2');const L=t=>0.12*(t-1)**2+0.6*Math.sin(3*t),dL=t=>0.24*(t-1)+1.8*Math.cos(3*t);
 let gmin=Infinity;for(let t=-4;t<=5;t+=0.001)gmin=Math.min(gmin,L(t));
 let th,k,trail,timer=null;function reset(){clearInterval(timer);th=+$('#s2').value;k=0;trail=[th];draw();}
 function inside(t){return isFinite(t)&&t>=-4&&t<=5;}
 function draw(){const S=setup(cv),x=S.x;const X=v=>(v+4)/9*S.w,Y=v=>S.h-16-(v+0.8)/4.4*(S.h-28);
  x.strokeStyle=C.line;x.beginPath();x.moveTo(0,Y(0));x.lineTo(S.w,Y(0));x.stroke();
  x.strokeStyle=C.mute;x.lineWidth=2;x.beginPath();for(let i=0;i<=300;i++){const t=-4+9*i/300;i?x.lineTo(X(t),Y(L(t))):x.moveTo(X(t),Y(L(t)));}x.stroke();x.lineWidth=1;
  const vis=trail.filter(inside);x.strokeStyle='rgba(250,80,15,.5)';x.beginPath();vis.forEach((t,i)=>{i?x.lineTo(X(t),Y(L(t))):x.moveTo(X(t),Y(L(t)));});x.stroke();
  vis.forEach(t=>{x.fillStyle='rgba(255,130,5,.5)';x.fillRect(X(t)-3,Y(L(t))-3,6,6);});
  if(inside(th)){x.fillStyle=C.o2;x.fillRect(X(th)-7,Y(L(th))-7,14,14);}else{x.fillStyle=C.o3;x.font='13px Geist Mono, monospace';x.fillText(tr('diverged: θ left the chart','divergence : θ a quitté le graphique'),12,22);}
  $('#k2').textContent=k;$('#t2').textContent=isFinite(th)?nf(th,3):'∞';$('#l2').textContent=inside(th)?nf(L(th),3):'∞';}
 function check(){const lr=+$('#lr2').value;if(!inside(th)){M(2,1);return;}const l=L(th);if(lr<=0.2&&l-gmin<0.02)M(2,0);if(Math.abs(dL(th))<0.01&&l-gmin>0.05)M(2,2);}
 function step(){if(!inside(th)||Math.abs(th)>1e6){return;}th=th-(+$('#lr2').value)*dL(th);k++;trail.push(th);draw();check();}
 $('#step2').onclick=step;$('#run2').onclick=()=>{clearInterval(timer);let i=0;if(RM){for(;i<25;i++)step();return;}timer=setInterval(()=>{step();if(++i>=25)clearInterval(timer);},90);};
 $('#reset2').onclick=reset;bind('s2',reset);bind('lr2',()=>{});$('#lr2o').textContent=$('#lr2').value;$('#s2o').textContent=$('#s2').value;reset();redraws.push(draw);
 window.__lab2={step,reset};})();

/* ---------- Lab 3 ---------- */
(function(){const cv=$('#c3');const F={
 step:[t=>t>0?1:0,'The original perceptron. Its derivative is zero almost everywhere, so gradient descent gets no signal through it.','Le perceptron d’origine. Sa dérivée est nulle presque partout : la descente de gradient ne reçoit aucun signal à travers elle.'],
 sigmoid:[t=>1/(1+Math.exp(-t)),'Squashes to (0,1). Flat at both ends, derivative at most 0.25, so gradients shrink in deep stacks.','Écrase les valeurs dans (0,1). Plate aux deux extrémités, dérivée au plus 0,25 : les gradients rétrécissent dans les réseaux profonds.'],
 tanh:[Math.tanh,'Like sigmoid but centred on zero, range (−1,1). Still saturates at the ends.','Comme la sigmoïde mais centrée sur zéro, valeurs dans (−1,1). Sature encore aux extrémités.'],
 ReLU:[t=>Math.max(0,t),'max(0, z). Cheap, derivative 1 for positive inputs. The default in most networks. Neurons stuck below zero can "die".','max(0, z). Peu coûteuse, dérivée 1 pour les entrées positives. Le choix par défaut dans la plupart des réseaux. Les neurones bloqués sous zéro peuvent « mourir ».'],
 GELU:[t=>0.5*t*(1+Math.tanh(0.7978845608*(t+0.044715*t**3))),'A smooth ReLU. Used in BERT and GPT-style models.','Une ReLU lissée. Utilisée dans BERT et les modèles de type GPT.']};
 let cur='ReLU';const seen=new Set();const box=$('#act3');Object.keys(F).forEach(k=>{const b=document.createElement('button');b.className='btn';b.textContent=k;b.onclick=()=>{cur=k;draw();};box.appendChild(b);});
 function draw(){[...box.children].forEach(b=>b.classList.toggle('on',b.textContent===cur));const S=setup(cv),x=S.x;const X=v=>(v+5)/10*S.w,Y=v=>S.h/2-v*(S.h/2-16)/2.2;
  x.strokeStyle=C.line;x.beginPath();x.moveTo(0,Y(0));x.lineTo(S.w,Y(0));x.moveTo(X(0),0);x.lineTo(X(0),S.h);x.stroke();
  const f=F[cur][0];x.strokeStyle=C.o2;x.lineWidth=3;x.beginPath();for(let i=0;i<=400;i++){const t=-5+10*i/400;i?x.lineTo(X(t),Y(f(t))):x.moveTo(X(t),Y(f(t)));}x.stroke();
  x.strokeStyle=C.gold;x.lineWidth=1.5;x.setLineDash([4,4]);x.beginPath();for(let i=0;i<=400;i++){const t=-5+10*i/400,h=1e-3;let d=(f(t+h)-f(t-h))/(2*h);d=Math.max(-2,Math.min(2,d));i?x.lineTo(X(t),Y(d)):x.moveTo(X(t),Y(d));}x.stroke();x.setLineDash([]);x.lineWidth=1;
  x.font='12px Geist Mono, monospace';x.fillStyle=C.o2;x.fillText('φ(z)',10,18);x.fillStyle=C.gold;x.fillText(tr("φ'(z) derivative","φ'(z) dérivée"),60,18);
  $('#actnote').textContent=tr(F[cur][1],F[cur][2]);seen.add(cur);if(seen.size===5)M(3,0);if(cur==='step')M(3,1);}
 draw();redraws.push(draw);})();

/* ---------- Lab 4 ---------- */
(function(){const cv=$('#c4');let tr4=[],va=[],good=false;
 function sample(){tr4=[];va=[];for(let i=0;i<15;i++){const x=-1+2*(i+Math.random()*0.8)/15;tr4.push([x,Math.sin(Math.PI*x)+(Math.random()-.5)*0.5]);}for(let i=0;i<40;i++){const x=Math.random()*2-1;va.push([x,Math.sin(Math.PI*x)+(Math.random()-.5)*0.5]);}}
 function fit(d){const m=d+1;const A=Array.from({length:m},()=>Array(m+1).fill(0));tr4.forEach(([x,y])=>{const p=[];for(let i=0;i<m;i++)p.push(x**i);for(let i=0;i<m;i++){for(let j=0;j<m;j++)A[i][j]+=p[i]*p[j];A[i][m]+=p[i]*y;}});for(let i=0;i<m;i++)A[i][i]+=1e-10;
  for(let i=0;i<m;i++){let mx=i;for(let r=i+1;r<m;r++)if(Math.abs(A[r][i])>Math.abs(A[mx][i]))mx=r;[A[i],A[mx]]=[A[mx],A[i]];for(let r=0;r<m;r++){if(r===i)continue;const f=A[r][i]/A[i][i];for(let c=i;c<=m;c++)A[r][c]-=f*A[i][c];}}
  return A.map((r,i)=>r[m]/r[i]);}
 const ev=(c,x)=>c.reduce((a,v,i)=>a+v*x**i,0);
 function draw(){const d=+$('#d4').value,c=fit(d);const S=setup(cv),x=S.x;const X=v=>(v+1.05)/2.1*S.w,Y=v=>S.h/2-v*(S.h/2-14)/1.8;
  x.strokeStyle=C.dim;x.setLineDash([3,4]);x.beginPath();for(let i=0;i<=200;i++){const t=-1+2*i/200;i?x.lineTo(X(t),Y(Math.sin(Math.PI*t))):x.moveTo(X(t),Y(Math.sin(Math.PI*t)));}x.stroke();x.setLineDash([]);
  x.save();x.beginPath();x.rect(0,0,S.w,S.h);x.clip();x.strokeStyle=C.o2;x.lineWidth=2.5;x.beginPath();for(let i=0;i<=400;i++){const t=-1+2*i/400;const yy=Math.max(-10,Math.min(10,ev(c,t)));i?x.lineTo(X(t),Y(yy)):x.moveTo(X(t),Y(yy));}x.stroke();x.restore();x.lineWidth=1;
  va.forEach(p=>{x.strokeStyle=C.mute;x.strokeRect(X(p[0])-3.5,Y(p[1])-3.5,7,7);});tr4.forEach(p=>{x.fillStyle=C.gold;x.fillRect(X(p[0])-4,Y(p[1])-4,8,8);});
  const m=(s)=>s.reduce((a,p)=>a+(ev(c,p[0])-p[1])**2,0)/s.length;const a=m(tr4),b=m(va);$('#tr4').textContent=nf(a,3);$('#va4').textContent=b>999?'>999':nf(b,3);
  const under=a>0.15,over=b>=3*a&&d>=6;$('#verdict4').textContent=under?tr('underfitting: too simple for a sine','sous-apprentissage : trop simple pour une sinusoïde'):over?tr('overfitting: memorised the noise','surapprentissage : a mémorisé le bruit'):tr('a reasonable fit','un ajustement raisonnable');
  if(under)M(4,0);if(b<0.08){M(4,1);if(good)M(4,3);}if(over)M(4,2);window.__lab4={a,b,d};}
 sample();bind('d4',draw);$('#d4o').textContent=$('#d4').value;$('#new4').onclick=()=>{good=!!mdone['4_1'];sample();draw();};draw();redraws.push(draw);})();

/* ---------- Lab 5 BPE ---------- */
(function(){const DEF={en:'low lower lowest newer newest wider widest',fr:'manger mangeons mangez changer changeons changez ranger rangeons'};
 let words,merges,last=null;const inp=$('#t5');
 function reset(){words=inp.value.split(/\s+/).filter(Boolean).map(w=>[...w,'_']);merges=0;last=null;render();}
 function lastText(){if(last===null)return tr('none','aucune');if(last==='done')return tr('no pair appears twice: BPE is done','aucune paire n’apparaît deux fois : BPE a terminé');return '"'+last[0]+'" + "'+last[1]+'" → "'+last[0]+last[1]+'" ('+last[2]+'×)';}
 function render(){const c=$('#chips5');c.innerHTML='';let n=0;words.forEach(w=>w.forEach(t=>{const s=document.createElement('span');s.className='chip';s.textContent=t;c.appendChild(s);n++;}));$('#n5').textContent=merges;$('#c5').textContent=n;$('#last5').textContent=lastText();}
 function merge(){const cnt={};words.forEach(w=>{for(let i=0;i<w.length-1;i++){const k=w[i]+'\u0001'+w[i+1];cnt[k]=(cnt[k]||0)+1;}});let best=null,bc=1;for(const k in cnt)if(cnt[k]>bc){bc=cnt[k];best=k;}
  if(!best){last='done';render();M(5,1);return false;}const [a,b]=best.split('\u0001');
  words=words.map(w=>{const o=[];for(let i=0;i<w.length;i++){if(i<w.length-1&&w[i]===a&&w[i+1]===b){o.push(a+b);i++;}else o.push(w[i]);}return o;});merges++;last=[a,b,bc];render();if(merges>=5)M(5,0);return true;}
 inp.value=DEF[LANG];
 $('#m5').onclick=merge;$('#r5').onclick=reset;inp.addEventListener('change',()=>{reset();M(5,2);});inp.addEventListener('keydown',e=>{if(e.key==='Enter'){reset();M(5,2);}});reset();
 langHooks.push(()=>{if(inp.value===DEF.en||inp.value===DEF.fr){inp.value=DEF[LANG];reset();}else render();});
 window.__lab5={merge};})();

/* ---------- Lab 6 embeddings ---------- */
(function(){const cv=$('#c6');const W={king:[0.62,0.78],queen:[0.2,0.8],man:[0.66,0.34],woman:[0.24,0.36],prince:[0.7,0.66],princess:[0.28,0.68],robot:[0.88,-0.52],machine:[0.96,-0.38],sensor:[0.82,-0.7],apple:[-0.78,-0.3],banana:[-0.88,-0.1],bread:[-0.66,-0.5]};
 const FRW={king:'roi',queen:'reine',man:'homme',woman:'femme',prince:'prince',princess:'princesse',robot:'robot',machine:'machine',sensor:'capteur',apple:'pomme',banana:'banane',bread:'pain'};
 const nm=k=>LANG==='fr'?FRW[k]:k;
 let sel=[],extra=null,state='idle',res=null;const cos=(a,b)=>(a[0]*b[0]+a[1]*b[1])/(Math.hypot(...a)*Math.hypot(...b));let X,Y;
 function out(){const o=$('#o6');if(state==='idle')o.textContent=tr('Click one word, then another.','Cliquez sur un mot, puis sur un autre.');
  else if(state==='one')o.textContent=tr('Selected '+nm(sel[0])+'. Click another word.',nm(sel[0])+' sélectionné. Cliquez sur un autre mot.');
  else if(state==='two'){o.innerHTML='';o.append('cos('+nm(sel[0])+', '+nm(sel[1])+') = ');const b=document.createElement('b');b.textContent=nf(res,3);o.append(b);}
  else if(state==='an'){o.innerHTML='';o.append(tr('king − man + woman lands at the gold square. Nearest word: ','roi − homme + femme atterrit sur le carré doré. Mot le plus proche : '));const b=document.createElement('b');b.textContent=nm(res[0]);o.append(b,' (cos '+nf(res[1],3)+')');}}
 function draw(){const S=setup(cv);const x=S.x;X=v=>S.w/2+v*(S.w/2-70);Y=v=>S.h/2-v*(S.h/2-30);
  x.strokeStyle=C.line;x.beginPath();x.moveTo(0,S.h/2);x.lineTo(S.w,S.h/2);x.moveTo(S.w/2,0);x.lineTo(S.w/2,S.h);x.stroke();
  sel.forEach(k=>{x.strokeStyle=C.o2;x.lineWidth=2;x.beginPath();x.moveTo(X(0),Y(0));x.lineTo(X(W[k][0]),Y(W[k][1]));x.stroke();x.lineWidth=1;});
  if(extra){x.strokeStyle=C.gold;x.setLineDash([4,4]);x.beginPath();x.moveTo(X(W.king[0]),Y(W.king[1]));x.lineTo(X(extra[0]),Y(extra[1]));x.stroke();x.setLineDash([]);x.fillStyle=C.gold;x.fillRect(X(extra[0])-6,Y(extra[1])-6,12,12);}
  x.font='13px Geist Mono, monospace';for(const k in W){const on=sel.includes(k);x.fillStyle=on?C.o2:C.paper;x.fillRect(X(W[k][0])-4,Y(W[k][1])-4,8,8);x.fillStyle=on?C.o1:C.mute;x.fillText(nm(k),X(W[k][0])+8,Y(W[k][1])+4);}
  out();}
 function pick(best){extra=null;sel.push(best);if(sel.length>2)sel=[best];
  if(sel.length===2){const c=cos(W[sel[0]],W[sel[1]]);res=c;state='two';if(c>0.95&&sel[0]!==sel[1])M(6,0);if(c<0)M(6,1);}else state='one';draw();}
 cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;let best=null,bd=40;for(const k in W){const d=Math.hypot(X(W[k][0])-mx,Y(W[k][1])-my);if(d<bd){bd=d;best=k;}}if(best)pick(best);});
 $('#an6').onclick=()=>{sel=[];extra=[W.king[0]-W.man[0]+W.woman[0],W.king[1]-W.man[1]+W.woman[1]];let best,bs=-2;for(const k in W){if(['king','man','woman'].includes(k))continue;const c=cos(extra,W[k]);if(c>bs){bs=c;best=k;}}res=[best,bs];state='an';M(6,2);draw();};
 $('#clr6').onclick=()=>{sel=[];extra=null;state='idle';draw();};draw();redraws.push(draw);window.__lab6={pick,W,X:()=>X,Y:()=>Y};})();

/* ---------- Lab 7 ---------- */
(function(){const cv=$('#c7');const SENT={en:'the robot on line three that the team repaired last week after the long night shift finally stopped',fr:'le robot de la ligne trois que l’équipe a réparé la semaine dernière après la longue nuit s’est enfin arrêté'};
 function draw(){const words=SENT[LANG].split(' ');const S=setup(cv),x=S.x,k=+$('#k7').value,n=words.length,bw=S.w/n;x.font='10px Geist Mono, monospace';
  words.forEach((w,i)=>{const v=Math.pow(k,n-1-i);const h=v*(S.h-44);x.fillStyle=i===1?C.gold:C.o2;x.fillRect(i*bw+2,S.h-24-h,bw-4,h);x.fillStyle=C.mute;x.fillText(w.slice(0,Math.max(2,Math.floor(bw/7))),i*bw+2,S.h-8);});
  const left=Math.pow(k,n-2)*100;x.fillStyle=C.gold;x.font='12px Geist Mono, monospace';x.fillText(tr('"robot" signal left: '+nf(left,2)+'%','signal restant de « robot » : '+nf(left,2)+' %'),10,16);if(left>10)M(7,0);if(k<=0.6)M(7,1);}
 bind('k7',draw);$('#k7o').textContent=$('#k7').value;draw();redraws.push(draw);})();

/* ---------- Lab 8 ---------- */
(function(){const TOK={en:['The','robot','picked','up','the','ball','because','it','was','light'],fr:['Le','robot','a','ramassé','la','balle','car','elle','était','légère']};
 const S={0:[3,1,0,0,1,0,0,0,0,0],1:[1,3,1,0,0,1,0,1,0,0],2:[0,2,2,2,0,2,0,0,0,0],3:[0,0,2,3,0,1,0,0,0,0],4:[0,0,0,0,2,3,0,0,0,0],5:[0,1,2,1,1,3,0,0,0,1],6:[0,0,1,0,0,0,2,1,1,0],7:[0,1.3,0,0,0,2.4,0.4,0.6,0.3,0.9],8:[0,0,0,0,0,0,0,2,2,1],9:[0,0.5,0,0,0,1.6,0,1.2,1,1.5]};
 let cur=7,wasCollapsed=false;const box=$('#sent8');TOK.en.forEach((t,i)=>{const b=document.createElement('button');b.className='tokbtn';b.onclick=()=>{cur=i;draw();};box.appendChild(b);});
 function draw(){const toks=TOK[LANG];[...box.children].forEach((b,i)=>{b.textContent=toks[i];b.classList.toggle('on',i===cur);});const dk=+$('#dk8').value,sc=$('#sc8').checked;
  const raw=S[cur].map(v=>v*Math.sqrt(dk)/2);const s=raw.map(v=>sc?v/Math.sqrt(dk):v);const m=Math.max(...s);const e=s.map(v=>Math.exp(v-m));const Z=e.reduce((a,b)=>a+b,0);const p=e.map(v=>v/Z);
  const bars=$('#bars8');bars.innerHTML='';toks.forEach((t,i)=>{const r=document.createElement('div');r.className='row';r.innerHTML='<span></span><div class="b"><i></i></div><span></span>';r.children[0].textContent=t;r.querySelector('i').style.width=(p[i]*100)+'%';r.children[2].textContent=nf(p[i],3);bars.appendChild(r);});
  const ent=-p.reduce((a,v)=>a+(v>0?v*Math.log(v):0),0);const top=p.indexOf(Math.max(...p));const collapsed=!sc&&dk>=128;
  $('#n8').textContent=tr('Query: "'+toks[cur]+'". Top weight: "'+toks[top]+'". Entropy '+nf(ent,2)+' nats (higher = more spread out). '+(collapsed?'Unscaled with large dₖ: softmax collapses onto one token, gradients vanish.':'Scaled scores keep the softmax soft and trainable.'),
    'Requête : « '+toks[cur]+' ». Poids le plus fort : « '+toks[top]+' ». Entropie '+nf(ent,2)+' nat (plus haut = plus étalé). '+(collapsed?'Sans mise à l’échelle et avec un grand dₖ, le softmax s’effondre sur un seul token : les gradients disparaissent.':'Des scores mis à l’échelle gardent un softmax doux et entraînable.'));
  if(cur===7&&top===5)M(8,0);if(!sc&&dk>=128&&ent<0.3){M(8,1);wasCollapsed=true;}if(sc&&wasCollapsed)M(8,2);window.__lab8={ent,top};}
 bind('dk8',draw);$('#dk8o').textContent=$('#dk8').value;$('#sc8').onchange=draw;draw();langHooks.push(draw);})();

/* ---------- Lab 9 ---------- */
(function(){const cv=$('#c9');const TOK={en:['<s>','The','robot','saw','the','ball','and','it','rolled'],fr:['<s>','Le','robot','vit','la','balle','et','elle','roula']};const n=9;
 const HEADS=[{en:'Head 1 · previous token',fr:'Tête 1 · token précédent',f:(i,j)=>j===i-1?4:(j===i?1:0)},
  {en:'Head 2 · pronoun → noun',fr:'Tête 2 · pronom → nom',f:(i,j)=>(i===7&&j===5)?5:(i===7&&j===2)?3:(j===i?1.5:0)},
  {en:'Head 3 · attention sink (first token)',fr:'Tête 3 · puits d’attention (premier token)',f:(i,j)=>j===0?3:(j===i?1:0)},
  {en:'Head 4 · verb ↔ subject',fr:'Tête 4 · verbe ↔ sujet',f:(i,j)=>((i===3||i===8)&&(j===2||j===7))?3.5:(j===i?1:0)}];
 let cur=0;const seen=new Set();const box=$('#h9');HEADS.forEach((h,i)=>{const b=document.createElement('button');b.className='btn';b.onclick=()=>{cur=i;draw();};box.appendChild(b);});
 function draw(){const toks=TOK[LANG];[...box.children].forEach((b,i)=>{const nm=tr(HEADS[i].en,HEADS[i].fr);b.textContent=nm.split(' · ')[0];b.title=nm;b.classList.toggle('on',i===cur);});
  const mask=$('#m9').checked;const S=setup(cv),x=S.x;const pad=64,cell=Math.max(8,Math.min((S.w-pad-10)/n,(S.h-pad-10)/n));const hf=HEADS[cur].f;
  x.font='12px Geist Mono, monospace';
  for(let i=0;i<n;i++){const row=[];for(let j=0;j<n;j++)row.push(mask&&j>i?-Infinity:hf(i,j));const m=Math.max(...row);const e=row.map(v=>v===-Infinity?0:Math.exp(v-m));const Z=e.reduce((a,b)=>a+b,0);
   for(let j=0;j<n;j++){const p=e[j]/Z;const X0=pad+j*cell,Y0=pad+i*cell;if(mask&&j>i){x.fillStyle='#16161a';x.fillRect(X0+1,Y0+1,cell-2,cell-2);x.fillStyle=C.dim;x.fillText('×',X0+cell/2-4,Y0+cell/2+4);}else{x.fillStyle=`rgba(250,80,15,${0.08+p*0.92})`;x.fillRect(X0+1,Y0+1,cell-2,cell-2);}}
   x.fillStyle=C.mute;x.textAlign='right';x.fillText(toks[i],pad-8,pad+i*cell+cell/2+4);x.textAlign='left';}
  for(let j=0;j<n;j++){x.save();x.translate(pad+j*cell+cell/2+4,pad-8);x.rotate(-Math.PI/3);x.fillStyle=C.mute;x.fillText(toks[j],0,0);x.restore();}
  $('#n9').textContent=tr(HEADS[cur].en+'. Rows = the token doing the looking (query); columns = tokens looked at (keys). '+(mask?'Grey × cells are the future, blocked by the causal mask.':'No mask: every token sees the whole sentence, as in BERT.'),
    HEADS[cur].fr+'. Lignes = le token qui regarde (requête) ; colonnes = les tokens regardés (clés). '+(mask?'Les cases grises × sont le futur, bloqué par le masque causal.':'Sans masque : chaque token voit toute la phrase, comme dans BERT.'));
  seen.add(cur);if(seen.size===4)M(9,0);if(!mask)M(9,1);}
 $('#m9').onchange=draw;draw();redraws.push(draw);})();

/* ---------- Lab 10 ---------- */
(function(){const TOK={en:['ball','box','part','tool','sensor','cable','pace','signal','banana','courage'],fr:['balle','boîte','pièce','outil','capteur','câble','rythme','signal','banane','courage']};const logits=[3.2,2.6,2.3,2.0,1.4,1.1,0.2,-0.3,-1.2,-2.0];
 function probs(){const T=+$('#T10').value,K=+$('#K10').value,P=+$('#P10').value;const s=logits.map(l=>l/T);const m=Math.max(...s);let p=s.map(v=>Math.exp(v-m));let Z=p.reduce((a,b)=>a+b,0);p=p.map(v=>v/Z);
  const order=p.map((v,i)=>i).sort((a,b)=>p[b]-p[a]);const keep=new Set();let cum=0;for(const i of order){if(keep.size>=K)break;if(cum>=P&&keep.size>0)break;keep.add(i);cum+=p[i];}
  const q=p.map((v,i)=>keep.has(i)?v:0);Z=q.reduce((a,b)=>a+b,0);return {q:q.map(v=>v/Z),kept:keep.size};}
 let lastOut=[];
 function draw(){const toks=TOK[LANG];const {q,kept}=probs();const bars=$('#bars10');bars.innerHTML='';toks.forEach((t,i)=>{const r=document.createElement('div');r.className='row';r.innerHTML='<span></span><div class="b"><i></i></div><span></span>';r.children[0].textContent=t;r.querySelector('i').style.width=(q[i]*100)+'%';if(q[i]===0)r.style.opacity=.35;r.children[2].textContent=nf(q[i],3);bars.appendChild(r);});
  const o=$('#out10');o.innerHTML='';lastOut.forEach(i=>{const c=document.createElement('span');c.className='chip';c.textContent=toks[i];o.appendChild(c);});
  if(+$('#P10').value<=0.5)M(10,2);return kept;}
 $('#s10').onclick=()=>{const {q}=probs();lastOut=[];const got=new Set();for(let s=0;s<20;s++){let r=Math.random(),i=0;for(;i<q.length-1;i++){r-=q[i];if(r<=0)break;}while(q[i]===0&&i>0)i--;got.add(i);lastOut.push(i);}draw();
  if(+$('#K10').value===1)M(10,0);if(+$('#T10').value>=1.5&&got.size>=6)M(10,1);window.__lab10={distinct:got.size};};
 ['T10','K10','P10'].forEach(id=>{bind(id,draw);$('#'+id+'o').textContent=$('#'+id).value;});draw();langHooks.push(draw);})();

/* ---------- Lab 11 ---------- */
(function(){const cv=$('#c11');const fmt=n=>n>=1e6?nf(n/1e6,2)+'M':n>=1e3?nf(n/1e3,1)+'k':String(n);
 function draw(){const d=+$('#d11').value,r=+$('#r11').value;const full=d*d,lo=2*d*r;const pct=lo/full*100;$('#f11').textContent=fmt(full);$('#l11').textContent=fmt(lo);$('#p11').textContent=nf(pct,3)+tr('%',' %');
  const S=setup(cv),x=S.x;const sz=Math.min(S.h-34,(S.w-90)/2.3);const t=Math.max(2,sz*r/d);const y0=8;x.font='12px Geist Mono, monospace';
  x.fillStyle=C.ink3;x.fillRect(10,y0,sz,sz);x.fillStyle=C.mute;x.fillText('W '+d+'×'+d,12,y0+sz+18);
  const bx=10+sz+34;x.fillStyle=C.paper;x.font='20px Geist, sans-serif';x.fillText('+',10+sz+10,y0+sz/2+7);
  x.fillStyle=C.o2;x.fillRect(bx,y0,t,sz);const ax=bx+t+26;x.fillStyle=C.paper;x.fillText('·',bx+t+8,y0+sz/2+7);x.fillStyle=C.o1;x.fillRect(ax,y0,sz,t);
  x.font='12px Geist Mono, monospace';x.fillStyle=C.mute;x.fillText('B·A (r='+r+')',bx,y0+sz+18);
  if(pct<0.1)M(11,0);if(pct>40)M(11,1);}
 bind('d11',draw);bind('r11',draw);$('#d11o').textContent=$('#d11').value;$('#r11o').textContent=$('#r11').value;draw();redraws.push(draw);})();

/* ---------- Lab 12 RAG ---------- */
(function(){const docs=[
 {src:'AMR_manual.pdf p.12',en:'Check the AMR battery charge cycles every 2 weeks and replace packs below 80% capacity.',fr:'Vérifier les cycles de charge de la batterie de l’AMR toutes les 2 semaines et remplacer les packs sous 80 % de capacité.'},
 {src:'AMR_manual.pdf p.4',en:'The fleet manager API assigns missions to AMRs based on priority and battery level.',fr:'L’API du gestionnaire de flotte attribue les missions aux AMR selon la priorité et le niveau de batterie.'},
 {src:'HMI_panel.pdf p.30',en:'Clean the HMI touch panel weekly with a dry cloth; never use solvents.',fr:'Nettoyer l’écran tactile de l’IHM chaque semaine avec un chiffon sec ; ne jamais utiliser de solvant.'},
 {src:'Safety_rules.pdf p.2',en:'Wear safety shoes in the production area. Stop the line with the red emergency button.',fr:'Porter des chaussures de sécurité en zone de production. Arrêter la ligne avec le bouton d’arrêt d’urgence rouge.'},
 {src:'Line3_log.txt',en:'Line 3 conveyor jammed twice in September; the belt tension was adjusted.',fr:'Le convoyeur de la ligne 3 s’est bloqué deux fois en septembre ; la tension de la courroie a été réglée.'}];
 const DEFQ={en:'How often should the AMR battery be checked?',fr:'À quelle fréquence faut-il vérifier la batterie de l’AMR ?'};
 const STOP={en:new Set('the a an and or of to in on with how often should is be are what when do does every who which i my it for from at by this that was were can you your me'.split(' ')),
  fr:new Set('le la les l un une des de du d et ou à au aux en dans sur avec pour par comment quand quel quelle quels quelles qui que qu quoi est sont être faut il ils elle elles on je j me mon ma mes nous vous ce cet cette ces se s a ai été fréquence souvent combien doit dois peut peux t y'.split(' '))};
 const stem=w=>w.length>4?(LANG==='fr'?w.replace(/(es|s|x)$/,''):w.replace(/(ing|ed|es|s)$/,'')):w;
 const tk=s=>s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu,' ').split(/\s+/).filter(w=>w&&!STOP[LANG].has(w)).map(stem);
 function score(q,d){const a=new Set(tk(q)),b=new Set(tk(d[LANG]+' '+d.src.replace(/[_.]/g,' ')));let i=0;a.forEach(w=>{if(b.has(w))i++;});return a.size&&b.size?i/Math.sqrt(a.size*b.size):0;}
 let timers=[];const qi=$('#q12');qi.value=DEFQ[LANG];
 function run(){timers.forEach(clearTimeout);timers=[];const q=qi.value.trim()||tr('(empty question)','(question vide)'),k=+$('#k12').value;const sc=docs.map(d=>({...d,s:score(q,d)})).sort((a,b)=>b.s-a.s);const top=sc.slice(0,k);const hit=top[0].s>=0.15;
  const vec=tk(q).slice(0,6).map((w,i)=>((w.charCodeAt(0)*37+w.length*13+i*11)%200/100-1)).map(v=>nf(v,2));
  const T=d=>d[LANG];
  const ans=hit?tr('(the model answers from the context and cites ['+top[0].src+'])','(le modèle répond à partir du contexte et cite ['+top[0].src+'])'):tr('I don\'t know: none of the retrieved documents cover this. (Relevance too low, so the pipeline tells the model to abstain.)','Je ne sais pas : aucun des documents récupérés ne traite de ce sujet. (Pertinence trop faible, le pipeline demande donc au modèle de s’abstenir.)');
  const steps=[[tr('1 · Embed the question','1 · Encoder la question (embedding)'),q+'\n→ ['+(vec.length?vec.join(tr(', ','; ')):nf(0,2))+tr(', …]  (hundreds of numbers in a real model)','; …]  (des centaines de nombres dans un vrai modèle)')],
   [tr('2 · Search the vector store ('+docs.length+' chunks) · relevance','2 · Chercher dans la base vectorielle ('+docs.length+' chunks) · pertinence'),sc.map(d=>nf(d.s,2)+'  '+d.src).join('\n')],
   [tr('3 · Keep top-'+k,'3 · Garder le top-'+k),top.map(d=>'['+d.src+'] '+T(d)).join('\n')],
   [tr('4 · Build the prompt','4 · Construire le prompt'),tr('SYSTEM: Answer only from the context. If it is not there, say you don\'t know. Cite sources.\nCONTEXT:\n','SYSTÈME : Réponds uniquement à partir du contexte. Si l’information n’y est pas, dis que tu ne sais pas. Cite tes sources.\nCONTEXTE :\n')+top.map(d=>'['+d.src+'] '+T(d)).join('\n')+tr('\nQUESTION: ','\nQUESTION : ')+q],
   [tr('5 · Generate','5 · Générer'),ans]];
  const box=$('#st12');box.innerHTML='';steps.forEach((s,i)=>{const d=document.createElement('div');d.className='st';d.innerHTML='<span class="tag"></span><div></div>';d.children[0].textContent=s[0];d.children[1].textContent=s[1];box.appendChild(d);if(RM)d.classList.add('on');else timers.push(setTimeout(()=>d.classList.add('on'),i*220));});
  if(hit&&top[0].src.startsWith('AMR_manual.pdf p.12'))M(12,0);if(hit&&top[0].src.startsWith('HMI'))M(12,1);if(!hit)M(12,2);window.__lab12={top:top[0].src,hit};}
 $('#go12').onclick=run;bind('k12',()=>{});$('#k12o').textContent=$('#k12').value;run();
 qi.addEventListener('keydown',e=>{if(e.key==='Enter')run();});
 langHooks.push(()=>{if(qi.value===DEFQ.en||qi.value===DEFQ.fr)qi.value=DEFQ[LANG];run();});})();

/* ---------- Lab 13 agent ---------- */
(function(){const S=[
 [['USER','UTILISATEUR'],['Is line 3 healthy enough to run a double shift tomorrow?','La ligne 3 est-elle assez fiable pour tourner en double équipe demain ?']],
 [['THOUGHT','PENSÉE'],['I need the current status of line 3, then any recent incidents.','Il me faut l’état actuel de la ligne 3, puis les incidents récents.']],
 [['ACTION · tool call 1','ACTION · appel d’outil 1'],['get_machine_status({"line": 3})','get_machine_status({"line": 3})']],
 [['OBSERVATION','OBSERVATION'],['{"line":3,"state":"running","oee":0.81,"alarms":[]}','{"line":3,"state":"running","oee":0.81,"alarms":[]}']],
 [['THOUGHT','PENSÉE'],['Running, no alarms. Check the maintenance log for recurring problems.','En marche, aucune alarme. Je consulte le journal de maintenance pour d’éventuels problèmes récurrents.']],
 [['ACTION · tool call 2','ACTION · appel d’outil 2'],['search_docs({"query": "line 3 incidents September"})','search_docs({"query": "incidents ligne 3 septembre"})']],
 [['OBSERVATION','OBSERVATION'],['[Line3_log.txt] Conveyor jammed twice in September; belt tension adjusted.','[Line3_log.txt] Convoyeur bloqué deux fois en septembre ; tension de la courroie réglée.']],
 [['THOUGHT','PENSÉE'],['Two jams, fixed since. Enough to answer, with a caveat.','Deux blocages, corrigés depuis. Assez pour répondre, avec une réserve.']],
 [['FINAL ANSWER','RÉPONSE FINALE'],['Line 3 is running with no active alarms (OEE 81%). It jammed twice in September; belt tension was adjusted since. It looks fit for a double shift; I suggest a belt check before the second shift. [Line3_log.txt]  ·  2 tool calls used.','La ligne 3 tourne sans alarme active (TRS 81 %). Elle s’est bloquée deux fois en septembre ; la tension de la courroie a été réglée depuis. Elle semble apte à une double équipe ; je conseille de vérifier la courroie avant la deuxième équipe. [Line3_log.txt]  ·  2 appels d’outils utilisés.']]];
 let i=0;const box=$('#st13');S.forEach(()=>{const d=document.createElement('div');d.className='st';d.innerHTML='<span class="tag"></span><div></div>';box.appendChild(d);});
 function show(){[...box.children].forEach((d,k)=>{d.children[0].textContent=tr(...S[k][0]);d.children[1].textContent=tr(...S[k][1]);d.hidden=k>i;d.classList.toggle('on',k===i);});
  const btn=$('#n13');const end=i>=S.length-1;btn.textContent=end?tr('Done','Terminé'):tr('Next step','Étape suivante');btn.disabled=end;if(end){M(13,0);M(13,1);}}
 $('#n13').onclick=()=>{if(i<S.length-1){i++;show();}};$('#r13').onclick=()=>{i=0;show();};show();langHooks.push(show);})();

/* ---------- Lab 14 ---------- */
(function(){const cv=$('#c14');const art=['................','......oooo......','....oooooooo....','...oggoooggoo...','...oggoooggoo...','..oooooooooooo..','..oooorrrroooo..','..ooorrrrrrooo..','...oooorrooooo..','....oooooooo....','.....oooooo.....','......o..o......','.....oo..oo.....','................','................','................'];
 const col={'.':[20,20,24],o:[250,80,15],g:[255,175,0],r:[195,0,47]};let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};const noise=[];for(let i=0;i<256;i++)noise.push([rnd(),rnd(),rnd()].map(v=>(v-.5)*2));
 function draw(){const S=setup(cv),x=S.x,p=+$('#p14').value,t=+$('#t14').value/100;const a=Math.sqrt(Math.max(0,1-t*t)),b=t;const px=Math.max(4,Math.floor(Math.min(S.h-20,S.w*0.45)/16));
  for(let r=0;r<16;r++)for(let c=0;c<16;c++){const base=col[art[r][c]];const nn=noise[r*16+c];const v=base.map((ch,k)=>Math.round(Math.max(0,Math.min(255,a*ch+b*(128+nn[k]*127)))));x.fillStyle=`rgb(${v.join(',')})`;x.fillRect(10+c*px,10+r*px,px,px);}
  x.strokeStyle=C.paper;x.lineWidth=1.5;for(let k=0;k<=16;k+=p){x.beginPath();x.moveTo(10+k*px,10);x.lineTo(10+k*px,10+16*px);x.stroke();x.beginPath();x.moveTo(10,10+k*px);x.lineTo(10+16*px,10+k*px);x.stroke();}x.lineWidth=1;
  const g=16/p,np=g*g;const sx=30+16*px;const avail=S.w-sx-10;const perRow=Math.max(1,Math.floor(avail/10));const w=Math.max(4,Math.min(18,avail/Math.min(np,perRow)-2));const cols=Math.max(1,Math.floor(avail/(w+2)));
  x.font='12px Geist Mono, monospace';x.fillStyle=C.mute;x.fillText(tr('→ '+np+' patch tokens','→ '+np+' tokens de patch'),sx,24);
  for(let k=0;k<np;k++){const rr=Math.floor(k/g),cc=k%g;const c0=col[art[rr*p+Math.floor(p/2)][cc*p+Math.floor(p/2)]];x.fillStyle=`rgb(${c0.join(',')})`;x.fillRect(sx+(k%cols)*(w+2),36+Math.floor(k/cols)*(w+2),w,w);}
  $('#n14').textContent=tr('Patch '+p+'×'+p+' px → '+np+' tokens. Diffusion t = '+Math.round(t*100)+'%: signal weight '+nf(a,2)+', noise weight '+nf(b,2)+'. A diffusion model learns to walk this slider backward.',
    'Patch '+p+'×'+p+' px → '+np+' tokens. Diffusion t = '+Math.round(t*100)+' % : poids du signal '+nf(a,2)+', poids du bruit '+nf(b,2)+'. Un modèle de diffusion apprend à parcourir ce curseur à l’envers.');
  if(p===2)M(14,0);if(t>=1)M(14,1);if(t>=0.9)M(14,2);}
 bind('p14',draw);bind('t14',draw);$('#p14o').textContent=$('#p14').value;$('#t14o').textContent=$('#t14').value;draw();redraws.push(draw);})();

/* ---------- Lab 15 ---------- */
(function(){const cv=$('#c15');
 function draw(){const P=+$('#P15').value,B=+$('#B15').value,Ck=+$('#C15').value,BW=+$('#W15').value;const wg=P*B/8;const layers=Math.round(32*Math.sqrt(P/7));const kv=2*layers*8*128*2*Ck*1024/1e9;const tot=wg+kv;const ts=BW/(wg+kv*0.5);
  const GB=tr(' GB',' Go');$('#wg15').textContent=nf(wg,1)+GB;$('#kv15').textContent=nf(kv,2)+GB;$('#tt15').textContent=nf(tot,1)+GB;$('#ts15').textContent=Math.round(ts)+' tok/s';
  const S=setup(cv),x=S.x;const max=Math.max(80,tot*1.1);const X=v=>10+v/max*(S.w-20);x.fillStyle=C.o2;x.fillRect(X(0),20,X(wg)-X(0),34);x.fillStyle=C.gold;x.fillRect(X(wg),20,X(tot)-X(wg),34);
  x.font='11px Geist Mono, monospace';[8,16,24,48,80].forEach(g=>{if(g>max)return;x.strokeStyle=C.mute;x.setLineDash([3,3]);x.beginPath();x.moveTo(X(g),10);x.lineTo(X(g),70);x.stroke();x.setLineDash([]);x.fillStyle=C.mute;x.fillText(g+tr('GB','Go'),X(g)-14,86);});
  x.fillStyle=C.o2;x.fillRect(10,S.h-30,10,10);x.fillStyle=C.mute;x.fillText(tr('weights','poids'),24,S.h-21);x.fillStyle=C.gold;x.fillRect(90,S.h-30,10,10);x.fillStyle=C.mute;x.fillText(tr('KV cache','cache KV'),104,S.h-21);x.fillStyle=C.dim;if(S.w>=440)x.fillText(tr('dashed: common GPU memory sizes','pointillés : mémoires GPU courantes'),180,S.h-21);
  if(Math.abs(P-7)<0.01&&BW===450&&ts>60)M(15,0);if(P>=70&&tot<48)M(15,1);if(kv>wg)M(15,2);window.__lab15={wg,kv,tot,ts};}
 ['P15','C15','W15'].forEach(id=>{bind(id,draw);$('#'+id+'o').textContent=$('#'+id).value;});$('#B15').onchange=draw;draw();redraws.push(draw);})();

/* ---------- Lab 16 ---------- */
(function(){const cv=$('#c16');let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};const pts=[];
 for(let i=0;i<60;i++){const s=Math.min(.99,Math.max(.01,0.3+(rnd()+rnd()-1)*0.35));pts.push({s,y:0,j:rnd()});}for(let i=0;i<14;i++){const s=Math.min(.99,Math.max(.01,0.7+(rnd()+rnd()-1)*0.3));pts.push({s,y:1,j:rnd()});}
 const stats=th=>{let tp=0,fp=0,fn=0,tn=0;pts.forEach(p=>{const pr=p.s>=th;if(pr&&p.y)tp++;else if(pr)fp++;else if(p.y)fn++;else tn++;});const pr=tp+fp?tp/(tp+fp):0,rc=tp/(tp+fn),f1=pr+rc?2*pr*rc/(pr+rc):0;return {tp,fp,fn,tn,pr,rc,f1};};
 let bestF1=0;for(let t=0;t<=1.0001;t+=0.01)bestF1=Math.max(bestF1,stats(+t.toFixed(2)).f1);
 function draw(){const th=+$('#th16').value;const S=setup(cv),x=S.x;const X=v=>10+v*(S.w-20);
  x.fillStyle='rgba(250,80,15,.08)';x.fillRect(X(th),0,S.w-X(th),S.h-20);
  pts.forEach(p=>{const Y=p.y?30+p.j*60:110+p.j*70;x.fillStyle=p.y?C.o2:C.mute;x.fillRect(X(p.s)-4,Y-4,8,8);});
  x.strokeStyle=C.paper;x.lineWidth=2;x.beginPath();x.moveTo(X(th),0);x.lineTo(X(th),S.h-20);x.stroke();x.lineWidth=1;x.font='12px Geist Mono, monospace';x.fillStyle=C.mute;x.fillText('score 0',10,S.h-4);x.fillText('score 1',S.w-60,S.h-4);x.fillStyle=C.o1;const lab=tr('flagged as defect →','signalé comme défaut →');x.fillText(lab,Math.min(X(th)+6,S.w-x.measureText(lab).width-6),14);
  const s=stats(th);$('#tp16').textContent=s.tp;$('#fp16').textContent=s.fp;$('#fn16').textContent=s.fn;$('#tn16').textContent=s.tn;$('#pr16').textContent=nf(s.pr,2);$('#rc16').textContent=nf(s.rc,2);$('#f116').textContent=nf(s.f1,2);
  if(s.rc>=1)M(16,0);if(s.pr>=1&&s.tp>0)M(16,1);if(s.f1>=bestF1-0.01)M(16,2);}
 bind('th16',draw);$('#th16o').textContent=$('#th16').value;draw();redraws.push(draw);})();

/* ---------- Interview Q&A (bilingual) ---------- */
const CAT={'Fundamentals':'Fondamentaux','Transformers':'Transformers','Embeddings':'Embeddings','LLMs':'LLM','RAG & agents':'RAG et agents','Efficiency':'Efficacité','Production':'Production','Industry':'Écosystème'};
const QA=[
['Fundamentals','Explain bias vs variance.','Bias is error from a model too simple to capture the pattern (underfits). Variance is error from sensitivity to the particular training sample (overfits). More capacity lowers bias and raises variance; regularisation, more data and early stopping control variance. Diagnose with train vs validation curves.',
 'Expliquez le biais et la variance.','Le biais est l’erreur d’un modèle trop simple pour capter la structure (sous-apprentissage). La variance est l’erreur due à la sensibilité à l’échantillon d’entraînement particulier (surapprentissage). Plus de capacité baisse le biais et augmente la variance ; la régularisation, plus de données et l’arrêt précoce contrôlent la variance. On diagnostique avec les courbes d’entraînement et de validation.'],
['Fundamentals','What is a loss function? Give two examples and when to use them.','A single number measuring how wrong predictions are, which gradient descent minimises. MSE for regression (penalises big errors quadratically); cross-entropy for classification (−log of the probability of the correct class, punishes confident mistakes).',
 'Qu’est-ce qu’une fonction de perte ? Donnez deux exemples et quand les utiliser.','Un nombre unique qui mesure à quel point les prédictions sont fausses, et que la descente de gradient minimise. La MSE pour la régression (pénalise les grosses erreurs au carré) ; l’entropie croisée pour la classification (−log de la probabilité de la bonne classe, punit les erreurs commises avec assurance).'],
['Fundamentals','Explain backpropagation to a non-specialist, then precisely.','Plain: after a wrong guess, each weight gets blamed in proportion to how much it contributed, working backward from the output. Precise: forward pass computes and caches activations; backward pass applies the chain rule layer by layer, multiplying local derivatives, giving ∂L/∂w for every weight in about 2× the forward cost.',
 'Expliquez la rétropropagation à un non-spécialiste, puis précisément.','Simplement : après une mauvaise prédiction, chaque poids reçoit une part de responsabilité proportionnelle à sa contribution, en remontant depuis la sortie. Précisément : la passe avant calcule et garde en mémoire les activations ; la passe arrière applique la règle de dérivation en chaîne couche par couche, en multipliant les dérivées locales, et donne ∂L/∂w pour chaque poids pour environ 2× le coût de la passe avant.'],
['Fundamentals','Why do we need non-linear activations?','Composed linear layers collapse into one linear map. Non-linearities (ReLU, GELU) let depth represent complex functions.',
 'Pourquoi a-t-on besoin d’activations non linéaires ?','Des couches linéaires composées se réduisent à une seule application linéaire. Les non-linéarités (ReLU, GELU) permettent à la profondeur de représenter des fonctions complexes.'],
['Fundamentals','SGD vs Adam?','SGD steps along the gradient with one global learning rate (often with momentum). Adam keeps running averages of gradients and squared gradients to give each parameter an adaptive step; converges faster with less tuning. AdamW decouples weight decay and is the LLM default.',
 'SGD ou Adam ?','SGD avance le long du gradient avec un taux d’apprentissage global unique (souvent avec momentum). Adam garde des moyennes glissantes des gradients et de leurs carrés pour donner à chaque paramètre un pas adaptatif ; il converge plus vite avec moins de réglages. AdamW découple la pénalisation des poids (weight decay) et c’est le choix par défaut pour les LLM.'],
['Fundamentals','What is the vanishing gradient problem and how is it solved?','Gradients shrink as they are multiplied through many layers or time steps, so early layers stop learning. Fixes: ReLU-family activations, good initialisation, normalisation layers, residual connections, gates in LSTMs, and for sequences, attention.',
 'Qu’est-ce que la disparition du gradient et comment la résout-on ?','Les gradients rétrécissent à force d’être multipliés à travers de nombreuses couches ou pas de temps, et les premières couches cessent d’apprendre. Remèdes : activations de la famille ReLU, bonne initialisation, couches de normalisation, connexions résiduelles, portes des LSTM et, pour les séquences, l’attention.'],
['Fundamentals','BatchNorm vs LayerNorm?','BatchNorm normalises each feature across the batch; depends on batch statistics, great for CNNs. LayerNorm normalises across features of a single example; independent of batch size and sequence length, so transformers use it (or RMSNorm).',
 'BatchNorm ou LayerNorm ?','BatchNorm normalise chaque caractéristique sur le batch ; dépend des statistiques du batch, excellent pour les CNN. LayerNorm normalise sur les caractéristiques d’un seul exemple ; indépendant de la taille du batch et de la longueur de séquence, d’où son usage dans les transformers (ou RMSNorm).'],
['Fundamentals','What does dropout do and why does it work?','Randomly zeroes a fraction of activations during training, preventing co-adaptation; acts like training an ensemble of sub-networks. Disabled at inference.',
 'Que fait le dropout et pourquoi ça marche ?','Il met à zéro au hasard une fraction des activations pendant l’entraînement, ce qui empêche la co-adaptation ; c’est comme entraîner un ensemble de sous-réseaux. Désactivé à l’inférence.'],
['Transformers','How does a transformer work? (the big one)','Tokens → embeddings + positional information → N blocks of [multi-head self-attention + feed-forward], each wrapped with residual connection and layer norm → linear + softmax over vocabulary. Attention: softmax(QKᵀ/√dₖ)V gives each token a relevance-weighted mix of others. A causal mask for generation. Trained with next-token cross-entropy; parallel over positions, which is why it scales.',
 'Comment fonctionne un transformer ? (la grande question)','Tokens → embeddings + information de position → N blocs [auto-attention multi-têtes + feed-forward], chacun entouré d’une connexion résiduelle et d’une normalisation → couche linéaire + softmax sur le vocabulaire. L’attention softmax(QKᵀ/√dₖ)V donne à chaque token un mélange des autres pondéré par la pertinence. Masque causal pour la génération. Entraîné à l’entropie croisée sur le token suivant ; parallèle sur les positions, d’où sa capacité à passer à l’échelle.'],
['Transformers','What are Q, K and V?','Three learned linear projections of each token. The query says what a token looks for, the key says what it offers for matching, the value is the content passed on. Scores = q·k; weights = softmax of scores; output = weighted sum of values.',
 'Que sont Q, K et V ?','Trois projections linéaires apprises de chaque token. La requête (query) dit ce que le token cherche, la clé (key) ce qu’il offre pour la correspondance, la valeur (value) le contenu transmis. Scores = q·k ; poids = softmax des scores ; sortie = somme des valeurs pondérée.'],
['Transformers','Why divide by √dₖ?','Dot products of dₖ-dimensional random vectors have variance ≈ dₖ. Large scores saturate softmax, giving near one-hot weights and vanishing gradients. Scaling keeps variance ≈ 1.',
 'Pourquoi diviser par √dₖ ?','Le produit scalaire de vecteurs aléatoires de dimension dₖ a une variance ≈ dₖ. De grands scores saturent le softmax, donnent des poids quasi one-hot et font disparaître les gradients. La mise à l’échelle garde une variance ≈ 1.'],
['Transformers','Why multi-head attention?','Each head attends in its own subspace, so the layer can capture several relations at once (position, coreference, syntax) at the same cost as one full-width head.',
 'Pourquoi l’attention multi-têtes ?','Chaque tête fait son attention dans son propre sous-espace : la couche capte plusieurs relations à la fois (position, coréférence, syntaxe) pour le même coût qu’une seule tête pleine largeur.'],
['Transformers','Why positional encoding? Sinusoidal vs learned vs RoPE?','Attention is permutation-invariant. Sinusoidal: fixed waves, unique per position. Learned: a trainable vector per position, limited to trained length. RoPE: rotates Q and K by position so scores depend on relative distance; extrapolates better; used in Llama/Mistral.',
 'Pourquoi un encodage positionnel ? Sinusoïdal, appris ou RoPE ?','L’attention est invariante par permutation. Sinusoïdal : des ondes fixes, uniques pour chaque position. Appris : un vecteur entraînable par position, limité à la longueur vue à l’entraînement. RoPE : fait tourner Q et K selon la position pour que les scores dépendent de la distance relative ; extrapole mieux ; utilisé par Llama et Mistral.'],
['Transformers','What is the causal mask?','Sets attention scores to future positions to −∞ before softmax so each token only sees earlier ones. Allows parallel training on all positions of a sequence while keeping generation honest.',
 'Qu’est-ce que le masque causal ?','Il met à −∞ les scores vers les positions futures avant le softmax, pour que chaque token ne voie que les précédents. Cela permet d’entraîner en parallèle sur toutes les positions d’une séquence sans tricher lors de la génération.'],
['Transformers','Encoder-only vs decoder-only vs encoder-decoder?','Encoder (BERT): bidirectional, masked-word objective, best for classification and embeddings. Decoder (GPT, Llama): causal, next-token, generation. Encoder-decoder (T5, original Transformer): cross-attention from decoder to encoder, suited to translation and summarisation.',
 'Encodeur seul, décodeur seul ou encodeur-décodeur ?','Encodeur (BERT) : bidirectionnel, objectif de mots masqués, idéal pour la classification et les embeddings. Décodeur (GPT, Llama) : causal, token suivant, génération. Encodeur-décodeur (T5, Transformer d’origine) : attention croisée du décodeur vers l’encodeur, adapté à la traduction et au résumé.'],
['Transformers','What is the complexity of self-attention and how is long context handled?','O(n²·d) time, O(n²) memory for scores. Mitigations: FlashAttention (IO-aware, no stored n×n matrix), sliding-window or sparse attention, GQA to shrink KV cache, RoPE scaling for longer contexts, retrieval instead of stuffing everything.',
 'Quelle est la complexité de l’auto-attention et comment gère-t-on les longs contextes ?','O(n²·d) en temps, O(n²) en mémoire pour les scores. Parades : FlashAttention (optimisé pour les accès mémoire, sans stocker la matrice n×n), attention à fenêtre glissante ou creuse, GQA pour réduire le cache KV, mise à l’échelle de RoPE pour des contextes plus longs, et la recherche documentaire plutôt que tout mettre dans le prompt.'],
['Transformers','What role does the feed-forward layer play?','Applied per token after attention; about two-thirds of parameters. Attention mixes information between tokens; the FFN transforms each token\'s representation and is thought to store much factual knowledge.',
 'Quel rôle joue la couche feed-forward ?','Appliquée à chaque token après l’attention ; environ deux tiers des paramètres. L’attention mélange l’information entre tokens ; le FFN transforme la représentation de chaque token et stockerait une grande partie des connaissances factuelles.'],
['Embeddings','What is an embedding and how is it trained?','A dense vector representing a token, sentence or item, where geometric closeness reflects similarity. Token embeddings are rows of a learned matrix trained by backprop with the rest of the model; word2vec trains them via context prediction; sentence embedders use contrastive learning on similar/dissimilar pairs.',
 'Qu’est-ce qu’un embedding et comment l’entraîne-t-on ?','Un vecteur dense qui représente un token, une phrase ou un objet, où la proximité géométrique traduit la similarité. Les embeddings de tokens sont les lignes d’une matrice apprise par rétropropagation avec le reste du modèle ; word2vec les apprend en prédisant le contexte ; les modèles d’embeddings de phrases utilisent l’apprentissage contrastif sur des paires similaires et dissemblables.'],
['Embeddings','Cosine similarity vs Euclidean distance?','Cosine compares direction, ignoring magnitude; standard for text embeddings. On unit-normalised vectors, cosine ranking and Euclidean ranking are equivalent, and cosine equals the dot product.',
 'Similarité cosinus ou distance euclidienne ?','Le cosinus compare la direction et ignore la norme ; c’est le standard pour les embeddings de texte. Sur des vecteurs normalisés, les classements par cosinus et par distance euclidienne sont équivalents, et le cosinus est égal au produit scalaire.'],
['Embeddings','How does a vector database find neighbours fast?','Approximate nearest neighbour indexes: HNSW (navigable layered graph), IVF (cluster then search a few clusters), product quantization to compress vectors. Trade a little recall for orders of magnitude speed.',
 'Comment une base vectorielle trouve-t-elle vite les voisins ?','Avec des index de plus proches voisins approximatifs : HNSW (graphe navigable en couches), IVF (regrouper puis ne chercher que dans quelques groupes), quantification produit pour compresser les vecteurs. On échange un peu de rappel contre des ordres de grandeur de vitesse.'],
['LLMs','How is a ChatGPT-style model built, end to end?','Pre-train a decoder transformer on trillions of tokens (next-token loss) → SFT on instruction/answer pairs → preference tuning (RLHF with a reward model and PPO, or DPO) → safety tuning and evaluation → deploy with sampling settings and a system prompt.',
 'Comment construit-on un modèle type ChatGPT, de bout en bout ?','Pré-entraîner un transformer décodeur sur des milliers de milliards de tokens (perte du token suivant) → SFT sur des paires instruction/réponse → alignement sur les préférences (RLHF avec un modèle de récompense et PPO, ou DPO) → réglage de sécurité et évaluation → déploiement avec des paramètres d’échantillonnage et un prompt système.'],
['LLMs','Explain temperature, top-k and top-p.','Temperature divides logits before softmax: lower = sharper/safer, higher = more diverse. Top-k keeps the k most likely tokens. Top-p keeps the smallest set whose cumulative probability ≥ p, adapting to confidence.',
 'Expliquez la température, top-k et top-p.','La température divise les logits avant le softmax : plus basse = plus tranché et sûr, plus haute = plus varié. Top-k garde les k tokens les plus probables. Top-p garde le plus petit ensemble dont la probabilité cumulée atteint p, et s’adapte à la confiance du modèle.'],
['LLMs','Why do LLMs hallucinate and how do you reduce it?','They are trained to produce likely text, not verified truth, and lack facts outside training data. Reduce with RAG and citations, instructions to abstain, lower temperature, tool use for calculations, fine-tuning on grounded answers, and faithfulness evaluation.',
 'Pourquoi les LLM hallucinent-ils et comment réduire ce problème ?','Ils sont entraînés à produire un texte probable, pas une vérité vérifiée, et ignorent les faits absents de leurs données. On réduit le problème avec le RAG et les citations, des consignes pour s’abstenir, une température plus basse, des outils pour les calculs, du fine-tuning sur des réponses sourcées et une évaluation de la fidélité.'],
['LLMs','RLHF vs DPO?','RLHF: train a reward model on human preferences, then optimise the policy with PPO plus a KL penalty to the SFT model. DPO: a closed-form objective optimising the policy directly on preference pairs; no reward model or RL loop; simpler and more stable.',
 'RLHF ou DPO ?','RLHF : entraîner un modèle de récompense sur des préférences humaines, puis optimiser la politique avec PPO et une pénalité KL par rapport au modèle SFT. DPO : un objectif en forme fermée qui optimise directement la politique sur des paires de préférences ; pas de modèle de récompense ni de boucle RL ; plus simple et plus stable.'],
['LLMs','What are scaling laws / Chinchilla?','Loss decreases as a power law in parameters, data and compute. Chinchilla: compute-optimal training uses ~20 tokens per parameter; many earlier models were undertrained. Small deployed models are often trained far beyond that because inference cost dominates.',
 'Que sont les lois d’échelle / Chinchilla ?','La perte baisse selon une loi de puissance en fonction des paramètres, des données et du calcul. Chinchilla : l’entraînement optimal en calcul utilise ~20 tokens par paramètre ; beaucoup de modèles plus anciens étaient sous-entraînés. Les petits modèles déployés sont souvent entraînés bien au-delà, car le coût d’inférence domine.'],
['LLMs','Fine-tuning vs RAG vs prompting: how do you choose?','Prompting first (cheapest). RAG when the model needs specific, changing or private knowledge with citations. Fine-tuning to change behaviour, tone, format or to make a small model match a big one on a narrow task. They combine.',
 'Fine-tuning, RAG ou prompting : comment choisir ?','D’abord le prompting (le moins cher). Le RAG quand le modèle a besoin de connaissances précises, changeantes ou privées, avec des citations. Le fine-tuning pour changer le comportement, le ton, le format, ou pour qu’un petit modèle égale un grand sur une tâche étroite. Les trois se combinent.'],
['LLMs','Explain LoRA.','Freeze W, learn ΔW = B·A with rank r ≪ d, scaled by α/r, with B initialised to zero. Trains <1% of parameters, adapters are small and swappable, and can be merged back into W with zero inference overhead. QLoRA does this on a 4-bit base model.',
 'Expliquez LoRA.','On gèle W et on apprend ΔW = B·A de rang r ≪ d, mis à l’échelle par α/r, avec B initialisé à zéro. On entraîne moins de 1 % des paramètres, les adaptateurs sont petits et interchangeables, et on peut les fusionner dans W sans surcoût à l’inférence. QLoRA fait la même chose sur un modèle de base en 4 bits.'],
['RAG & agents','Walk me through a RAG pipeline you would build.','Ingest and clean documents → chunk (300–800 tokens, overlap, structure-aware) → embed → store with metadata. Query: rewrite if needed → hybrid search (vectors + BM25) → rerank with a cross-encoder → top 3–5 into a prompt that demands grounded, cited answers → generate. Evaluate retrieval (context precision/recall) and generation (faithfulness, relevancy) on a golden set.',
 'Décrivez un pipeline RAG que vous construiriez.','Ingérer et nettoyer les documents → découper en chunks (300–800 tokens, avec chevauchement, en suivant la structure) → calculer les embeddings → stocker avec des métadonnées. Requête : reformuler si besoin → recherche hybride (vecteurs + BM25) → reclasser avec un cross-encoder → mettre les 3–5 meilleurs dans un prompt qui exige des réponses sourcées → générer. Évaluer la recherche (précision/rappel du contexte) et la génération (fidélité, pertinence) sur un jeu de référence.'],
['RAG & agents','How do you pick chunk size?','Trade-off: small chunks retrieve precisely but lose context; large ones keep context but dilute relevance and cost tokens. Split along document structure, add overlap, test several sizes on your evaluation set; consider parent-document retrieval (search small, return the larger section).',
 'Comment choisir la taille des chunks ?','C’est un compromis : de petits chunks sont précis mais perdent le contexte ; de gros gardent le contexte mais diluent la pertinence et coûtent des tokens. Découper selon la structure du document, ajouter du chevauchement, tester plusieurs tailles sur son jeu d’évaluation ; envisager la recherche « document parent » (chercher petit, renvoyer la section plus large).'],
['RAG & agents','What is LangChain and what does LangGraph add?','LangChain: components and a standard interface for LLM apps (models, prompts, retrievers, tools, output parsers) composed with LCEL. LangGraph: builds stateful agents as graphs with nodes, conditional edges, loops, persistence and human-in-the-loop, for control that a linear chain can\'t express.',
 'Qu’est-ce que LangChain et qu’apporte LangGraph ?','LangChain : des composants et une interface standard pour les applis LLM (modèles, prompts, retrievers, outils, parseurs de sortie) assemblés avec LCEL. LangGraph : construit des agents avec état sous forme de graphes (nœuds, arêtes conditionnelles, boucles, persistance, humain dans la boucle), pour un contrôle qu’une chaîne linéaire ne peut pas exprimer.'],
['RAG & agents','How does function calling work?','Tools are described with names and JSON schemas; the model outputs a structured call; the application executes it, returns the result as a message, and the model continues. The model never executes code itself.',
 'Comment fonctionne l’appel de fonctions ?','Les outils sont décrits par un nom et un schéma JSON ; le modèle produit un appel structuré ; l’application l’exécute, renvoie le résultat sous forme de message, et le modèle continue. Le modèle n’exécute jamais de code lui-même.'],
['RAG & agents','What is ReAct?','An agent pattern interleaving reasoning (thoughts) with actions (tool calls) and observations, looping until a final answer. Grounds reasoning in real tool results.',
 'Qu’est-ce que ReAct ?','Un schéma d’agent qui alterne raisonnement (pensées), actions (appels d’outils) et observations, en boucle jusqu’à la réponse finale. Le raisonnement s’appuie sur de vrais résultats d’outils.'],
['RAG & agents','What is MCP?','Model Context Protocol: an open client-server standard for exposing tools, resources and prompts to AI applications, so one integration works across many hosts.',
 'Qu’est-ce que MCP ?','Model Context Protocol : un standard client-serveur ouvert pour exposer des outils, des ressources et des prompts aux applications d’IA, pour qu’une même intégration fonctionne avec de nombreux hôtes.'],
['RAG & agents','What are the risks of agents and how do you control them?','Compounding errors, loops, cost blow-ups, prompt injection through tool outputs, over-privileged actions. Controls: step limits, schema validation, least-privilege tools, human approval for irreversible actions, tracing, sandboxing, evaluation of trajectories.',
 'Quels sont les risques des agents et comment les maîtriser ?','Erreurs qui s’accumulent, boucles, coûts qui explosent, injection de prompt via les sorties d’outils, actions avec trop de privilèges. Garde-fous : limite d’étapes, validation des schémas, outils au moindre privilège, validation humaine des actions irréversibles, traçage, bac à sable, évaluation des trajectoires.'],
['Efficiency','What is the KV cache?','Stored keys and values of past tokens so each decoding step computes attention only for the new token. Memory grows with layers × KV heads × head dim × sequence length × batch. GQA/MQA and PagedAttention reduce and manage it.',
 'Qu’est-ce que le cache KV ?','Les clés et valeurs des tokens passés, gardées en mémoire pour que chaque étape de décodage ne calcule l’attention que pour le nouveau token. La mémoire croît avec couches × têtes KV × dimension de tête × longueur de séquence × batch. GQA/MQA et PagedAttention la réduisent et la gèrent.'],
['Efficiency','Why is decoding memory-bound, and what helps?','Each generated token reads every weight once for ~2 FLOPs per weight, far below what the chip can compute per byte. Tokens/s ≈ bandwidth ÷ bytes read. Helps: quantization (fewer bytes), batching (reuse each read), speculative decoding (verify many tokens per pass), MoE (fewer active weights), faster memory.',
 'Pourquoi le décodage est-il limité par la mémoire, et qu’est-ce qui aide ?','Chaque token généré lit tous les poids une fois pour ~2 FLOP par poids, bien en dessous de ce que la puce peut calculer par octet. Tokens/s ≈ bande passante ÷ octets lus. Ce qui aide : la quantification (moins d’octets), le batching (réutiliser chaque lecture), le décodage spéculatif (vérifier plusieurs tokens par passe), les MoE (moins de poids actifs), une mémoire plus rapide.'],
['Efficiency','Explain quantization and its trade-offs.','Represent weights (and sometimes activations) with fewer bits: FP16 → INT8 → INT4. Cuts memory and bandwidth roughly proportionally; small accuracy loss to ~4-bit, worse below. Methods: GPTQ, AWQ, GGUF k-quants; QAT for best quality. Outliers are the main difficulty.',
 'Expliquez la quantification et ses compromis.','Représenter les poids (et parfois les activations) avec moins de bits : FP16 → INT8 → INT4. Réduit la mémoire et la bande passante à peu près proportionnellement ; petite perte de précision jusqu’à ~4 bits, plus forte en dessous. Méthodes : GPTQ, AWQ, k-quants GGUF ; QAT pour la meilleure qualité. Les valeurs aberrantes (outliers) sont la principale difficulté.'],
['Efficiency','What is knowledge distillation?','Train a small student to match a large teacher\'s output distributions (soft labels), transferring behaviour at a fraction of the size.',
 'Qu’est-ce que la distillation de connaissances ?','Entraîner un petit élève à reproduire les distributions de sortie d’un grand professeur (étiquettes douces), pour transférer son comportement à une fraction de la taille.'],
['Efficiency','What is a Mixture of Experts?','Each layer has many FFN experts and a router sends each token to a few (e.g. 2 of 8). Total parameters large, active compute per token small. Challenges: load balancing, memory to hold all experts.',
 'Qu’est-ce qu’un mélange d’experts (MoE) ?','Chaque couche contient de nombreux experts FFN et un routeur envoie chaque token vers quelques-uns (ex. 2 sur 8). Beaucoup de paramètres au total, peu de calcul actif par token. Difficultés : équilibrer la charge, et la mémoire nécessaire pour garder tous les experts.'],
['Production','Which metrics for an imbalanced defect-detection problem?','Not accuracy. Precision, recall, F1, PR-AUC; choose the threshold by the cost of a missed defect versus a false alarm, usually favouring recall.',
 'Quelles métriques pour un problème de détection de défauts déséquilibré ?','Pas l’exactitude. Précision, rappel, F1, aire sous la courbe PR ; choisir le seuil selon le coût d’un défaut manqué par rapport à une fausse alerte, en privilégiant souvent le rappel.'],
['Production','How would you evaluate an LLM feature before shipping?','Define success criteria; build a golden dataset from real cases including edge cases; automatic checks (format, exact match), LLM-as-judge with a rubric validated against human labels, RAG metrics if relevant; latency and cost; red-team for safety and injection; regression-test on every prompt or model change; monitor in production.',
 'Comment évalueriez-vous une fonctionnalité LLM avant de la livrer ?','Définir des critères de réussite ; construire un jeu de référence à partir de cas réels, cas limites compris ; contrôles automatiques (format, correspondance exacte), LLM-juge avec une grille validée par des annotations humaines, métriques RAG si pertinent ; latence et coût ; red-teaming pour la sécurité et l’injection ; tests de non-régression à chaque changement de prompt ou de modèle ; suivi en production.'],
['Production','What is data drift and how do you detect it?','The input distribution in production departs from training data (or the input→label relation changes: concept drift). Detect with statistical tests on feature distributions, monitoring prediction confidence and live metrics; respond by retraining or updating retrieval data.',
 'Qu’est-ce que la dérive des données et comment la détecter ?','La distribution des entrées en production s’éloigne de celle des données d’entraînement (ou la relation entrée→étiquette change : dérive de concept). On la détecte avec des tests statistiques sur les distributions, en surveillant la confiance des prédictions et les métriques en direct ; on y répond en réentraînant ou en mettant à jour les données de recherche.'],
['Production','What does the EU AI Act mean for an engineer?','Risk-based rules. High-risk uses need risk management, data governance, technical documentation, logging, human oversight, accuracy and robustness; some uses are banned; general-purpose model providers have transparency and documentation duties. In practice: document data and evaluations, keep humans in the loop, log decisions.',
 'Que change l’AI Act européen pour un ingénieur ?','Des règles fondées sur le risque. Les usages à haut risque exigent gestion des risques, gouvernance des données, documentation technique, journalisation, supervision humaine, exactitude et robustesse ; certains usages sont interdits ; les fournisseurs de modèles à usage général ont des obligations de transparence et de documentation. En pratique : documenter les données et les évaluations, garder un humain dans la boucle, journaliser les décisions.'],
['Industry','Which hardware and software stacks run AI today?','Mostly NVIDIA GPUs with CUDA, with PyTorch on top and TensorRT or vLLM for serving. Alternatives: AMD GPUs with ROCm, Google TPUs with JAX/XLA, AWS Trainium/Inferentia, Huawei Ascend NPUs with CANN and MindSpore, Apple silicon with Core ML/MLX. On devices: phone and PC NPUs through ONNX Runtime, ExecuTorch or LiteRT. The key point: frameworks sit on vendor kernels, so portability (ONNX, quantized formats) matters.',
 'Quelles piles matérielles et logicielles font tourner l’IA aujourd’hui ?','Surtout des GPU NVIDIA avec CUDA, PyTorch par-dessus, et TensorRT ou vLLM pour le service. Alternatives : GPU AMD avec ROCm, TPU Google avec JAX/XLA, AWS Trainium/Inferentia, NPU Huawei Ascend avec CANN et MindSpore, puces Apple avec Core ML/MLX. Sur les appareils : NPU de téléphones et de PC via ONNX Runtime, ExecuTorch ou LiteRT. L’essentiel : les frameworks reposent sur les noyaux des constructeurs, donc la portabilité (ONNX, formats quantifiés) compte.']];
const qa=$('#qa');let lastCat='';QA.forEach(([cat,q,a,qf,af],i)=>{if(cat!==lastCat){const h=document.createElement('h3');h.className='tag qacat';h.appendChild(bi(cat,CAT[cat]||cat));qa.appendChild(h);lastCat=cat;}
 const d=document.createElement('details');const s=document.createElement('summary');const b=document.createElement('b');b.textContent='Q'+String(i+1).padStart(2,'0');s.append(b,bi(q,qf));const an=document.createElement('div');an.className='a';an.appendChild(bi(a,af));d.append(s,an);qa.appendChild(d);});
})();

/* offline + install support (GitHub Pages) */
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
