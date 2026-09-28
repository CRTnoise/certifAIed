(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = {o1:'#ff8205',o2:'#fa500f',o3:'#e10500',o4:'#c3002f',gold:'#ffaf00',paper:'#f4f1ec',mute:'#a3a0a8',dim:'#6d6a73',line:'#2c2c34',ink3:'#222228',blue:'#2c8cff'};
function setup(cv){if(cv.dataset.h===undefined)cv.dataset.h=cv.getAttribute('height')||'';const r=cv.getBoundingClientRect();const dpr=devicePixelRatio||1;const h=+cv.dataset.h||r.height;if(cv.dataset.h)cv.style.height=h+'px';cv.width=Math.max(1,r.width*dpr);cv.height=h*dpr;const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return {x,w:r.width,h};}
function bind(id,fn){const el=$('#'+id),o=$('#'+id+'o');const f=()=>{if(o)o.textContent=el.value;fn();};el.addEventListener('input',f);return f;}
const redraws=[];let lastW=innerWidth,rzT;addEventListener('resize',()=>{if(innerWidth===lastW)return;lastW=innerWidth;clearTimeout(rzT);rzT=setTimeout(()=>redraws.forEach(f=>f()),120);});

/* ---------- units nav & progress ---------- */
const UNITS=$$('section.unit').map(s=>({id:s.id,n:+s.dataset.unit,t:s.querySelector('h2').textContent,phase:s.querySelector('.uhead .tag').textContent}));
const side=$('#side');let lastPhase='';
UNITS.forEach(u=>{if(u.phase!==lastPhase){const h=document.createElement('h4');h.textContent=u.phase;side.appendChild(h);lastPhase=u.phase;}
  const a=document.createElement('a');a.href='#'+u.id;a.dataset.u=u.n;a.innerHTML='<b>'+String(u.n).padStart(2,'0')+'</b><span></span><em></em>';a.querySelector('span').textContent=u.t;side.appendChild(a);});
const ex=document.createElement('h4');ex.textContent='After the course';side.appendChild(ex);
const aa=document.createElement('a');aa.href='#arsenal';aa.innerHTML='<b>Q&amp;A</b><span>Interview arsenal</span><em style="background:none"></em>';side.appendChild(aa);
side.addEventListener('click',e=>{if(e.target.closest('a')&&innerWidth<=1000){side.classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false');}});
$('#menuBtn').onclick=()=>{const o=side.classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',o);document.body.classList.toggle('menu-open',o);};
addEventListener('keydown',e=>{if(e.key==='Escape'&&side.classList.contains('open'))$('#menuBtn').click();});
side.addEventListener('click',e=>{if(e.target.closest('a'))document.body.classList.remove('menu-open');});
const track=$('#track');for(let i=0;i<16;i++)track.appendChild(document.createElement('i'));
let solved={};try{solved=JSON.parse(localStorage.getItem('cai_solved')||'{}')}catch(e){}
function save(){try{localStorage.setItem('cai_solved',JSON.stringify(solved))}catch(e){}}
function progress(){let done=0;UNITS.forEach(u=>{const qs=$$('#'+u.id+' .quiz');const ok=qs.length&&qs.every((q,i)=>solved[u.id+'_'+i]);const a=side.querySelector('a[data-u="'+u.n+'"]');a.classList.toggle('done',ok);track.children[u.n-1].classList.toggle('on',ok);if(ok)done++;});$('#progtxt').textContent=done+' / 16 units cleared';}
UNITS.forEach(u=>{$$('#'+u.id+' .quiz').forEach((q,i)=>{const key=u.id+'_'+i;const bs=[...q.querySelectorAll('button')];const ans=+q.dataset.a;
  const mark=()=>{bs[ans].classList.add('right');q.querySelector('.ex').hidden=false;if(!q.querySelector('.ok')){const s=document.createElement('span');s.className='ok';s.textContent='cleared';q.querySelector('.q').appendChild(s);}};
  if(solved[key])mark();
  bs.forEach((b,j)=>b.onclick=()=>{if(j===ans){bs.forEach(x=>x.classList.remove('wrong'));mark();solved[key]=1;save();progress();}else{b.classList.add('wrong');}});});});
progress();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){side.querySelectorAll('a').forEach(a=>a.classList.toggle('cur',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-40% 0px -55% 0px'});
$$('section.unit').forEach(s=>io.observe(s));

/* ---------- hero mosaic ---------- */
(function(){const cv=$('#mosaic');const pal=[C.o2,C.o1,C.o3,C.o4,C.gold,C.o2,C.o2,C.o1];let S,cols,rows,cells;
 function init(){S=setup(cv);const sz=S.w<600?28:44;cols=Math.ceil(S.w/sz)+1;rows=Math.ceil(S.h/sz)+1;cells=[];for(let i=0;i<cols*rows;i++)cells.push(pal[(Math.random()*pal.length)|0]);draw(sz);S.sz=sz;}
 function draw(sz){const x=S.x;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){x.fillStyle=cells[r*cols+c];x.fillRect(c*sz,r*sz,sz,sz);}
   x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=1;for(let c=0;c<=cols;c++){x.beginPath();x.moveTo(c*sz+.5,0);x.lineTo(c*sz+.5,S.h);x.stroke();}
   x.fillStyle='#1a0a00';x.font='11px Silkscreen, monospace';x.fillText('LOSS ↓',12,S.h-12);x.fillText('ATTENTION IS ALL YOU NEED',S.w-220,22);}
 init();redraws.push(init);
 let vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(cv);
 if(!RM)setInterval(()=>{if(!vis||document.hidden)return;for(let k=0;k<3;k++)cells[(Math.random()*cells.length)|0]=pal[(Math.random()*pal.length)|0];draw(S.sz);},260);})();

/* ---------- missions ---------- */
const MISSIONS={
1:['Get the MSE below 1.0 by hand.','Get within 0.05 of the best possible MSE.','Set a negative slope w and watch the error squares explode (MSE above 10).'],
2:['With η ≤ 0.2, reach the lowest valley (loss within 0.02 of the global minimum).','Make it diverge: θ leaves the chart.','Get stuck: settle in a valley that is NOT the lowest (tip: move θ₀, use a small η).'],
3:['Look at all five activation functions.','Find the one whose derivative is zero almost everywhere (it cannot be trained with gradients).'],
4:['Underfit: pick a degree where the verdict says underfitting.','Find a good fit: validation MSE below 0.08.','Overfit: make validation MSE at least 3× the training MSE.','Draw a new noisy sample and check your good degree still works.'],
5:['Do 5 merges and read which pairs got merged.','Merge until no pair repeats (BPE stops).','Type your own sentence (press Enter) and train BPE on it.'],
6:['Find two words with cosine above 0.95.','Find two words with negative cosine (opposite directions).','Run the king − man + woman analogy.'],
7:['Find a keep-rate where "robot" still has more than 10% of its signal.','Drop the keep-rate to 0.6 and see the start of the sentence vanish.'],
8:['Click "it" and check which word gets the most weight.','Untick scaling and set dₖ ≥ 128: watch the softmax collapse (entropy below 0.3).','Tick scaling back on: the distribution recovers at any dₖ.'],
9:['Visit all four heads.','Turn the causal mask off (BERT-style) and see the upper triangle fill in.'],
10:['Greedy decoding: set top-k = 1 and sample. Every sample is identical.','Creative mode: temperature ≥ 1.5, sample, and get at least 6 different words.','Nucleus: set top-p ≤ 0.5 and see how many tokens survive.'],
11:['Find a rank where you train less than 0.1% of the matrix.','Make LoRA pointless: train more than 40% of the matrix.'],
12:['Run the default question and find the cited source.','Ask about the touch panel and see a different chunk win.','Ask something the documents do not cover (e.g. "Who won the World Cup?") and see the model abstain.'],
13:['Step through the whole loop to the final answer.','Count the tool calls the agent made (answer: in the log).'],
14:['Use 2×2 patches: how many tokens does the image become?','Push diffusion to t = 100 (pure noise).','Find the t where you can no longer recognise the figure.'],
15:['Make a 7B model run above 60 tokens/s at 450 GB/s.','Fit a 70B model under 48 GB total.','Make the KV cache bigger than the weights.'],
16:['Reach recall 1.00 (catch every defect).','Reach precision 1.00 (no false alarms).','Find the threshold with the best F1 (within 0.01 of the maximum).']};
let mdone={};try{mdone=JSON.parse(localStorage.getItem('cai_missions')||'{}')}catch(e){}
$$('.lab').forEach((lab,i)=>{const n=i+1;const ul=document.createElement('ul');ul.className='missions';ul.innerHTML='<span class="tag">Missions · auto-checked</span>';(MISSIONS[n]||[]).forEach((t,j)=>{const li=document.createElement('li');li.dataset.k=n+'_'+j;li.innerHTML='<span></span>';li.firstChild.textContent=t;if(mdone[n+'_'+j])li.classList.add('done');ul.appendChild(li);});lab.querySelector('.lb').appendChild(ul);});
function M(n,j){const k=n+'_'+j;if(mdone[k])return;mdone[k]=1;try{localStorage.setItem('cai_missions',JSON.stringify(mdone))}catch(e){}const li=document.querySelector('.missions li[data-k="'+k+'"]');if(li)li.classList.add('done');}
window.__M=M;

/* ---------- Lab 1 ---------- */
(function(){const cv=$('#c1');const pts=[];let seed=3;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 for(let i=0;i<14;i++){const x=0.3+i*0.5;pts.push([x,0.8*x+1+(rnd()-0.5)*1.6]);}
 const n=pts.length,mx=pts.reduce((a,p)=>a+p[0],0)/n,my=pts.reduce((a,p)=>a+p[1],0)/n;let sxy=0,sxx=0;pts.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my);sxx+=(p[0]-mx)**2});const bw=sxy/sxx,bb=my-bw*mx;
 const mse=(w,b)=>pts.reduce((a,p)=>a+(w*p[0]+b-p[1])**2,0)/n;const best=mse(bw,bb);$('#best1').textContent=best.toFixed(3);
 function draw(){const S=setup(cv),x=S.x,w=+$('#w1').value,b=+$('#b1').value;const X=v=>30+v/7.4*(S.w-40),Y=v=>S.h-20-v/8*(S.h-30);
  x.strokeStyle=C.line;for(let i=0;i<=8;i++){x.beginPath();x.moveTo(30,Y(i));x.lineTo(S.w,Y(i));x.stroke();}
  x.save();x.beginPath();x.rect(0,0,S.w,S.h);x.clip();
  pts.forEach(p=>{const py=w*p[0]+b;const side=Math.min(S.h,Math.abs(Y(py)-Y(p[1])));const top=Math.max(-S.h,Math.min(Y(py),Y(p[1])));x.fillStyle='rgba(250,80,15,.18)';x.strokeStyle='rgba(250,80,15,.6)';x.fillRect(X(p[0]),top,side,side);x.strokeRect(X(p[0]),top,side,side);});
  x.strokeStyle=C.paper;x.lineWidth=2;x.beginPath();x.moveTo(X(0),Y(b));x.lineTo(X(7.4),Y(w*7.4+b));x.stroke();x.lineWidth=1;x.restore();
  pts.forEach(p=>{x.fillStyle=C.gold;x.fillRect(X(p[0])-4,Y(p[1])-4,8,8);});
  const m=mse(w,b);$('#mse1').textContent=m.toFixed(3);if(m<1)M(1,0);if(m-best<0.05)M(1,1);if(w<0&&m>10)M(1,2);}
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
  if(inside(th)){x.fillStyle=C.o2;x.fillRect(X(th)-7,Y(L(th))-7,14,14);}else{x.fillStyle=C.o3;x.font='13px Geist Mono, monospace';x.fillText('diverged: θ left the chart',12,22);}
  $('#k2').textContent=k;$('#t2').textContent=isFinite(th)?th.toFixed(3):'∞';$('#l2').textContent=inside(th)?L(th).toFixed(3):'∞';}
 function check(){const lr=+$('#lr2').value;if(!inside(th)){M(2,1);return;}const l=L(th);if(lr<=0.2&&l-gmin<0.02)M(2,0);if(Math.abs(dL(th))<0.01&&l-gmin>0.05)M(2,2);}
 function step(){if(!inside(th)||Math.abs(th)>1e6){return;}th=th-(+$('#lr2').value)*dL(th);k++;trail.push(th);draw();check();}
 $('#step2').onclick=step;$('#run2').onclick=()=>{clearInterval(timer);let i=0;if(RM){for(;i<25;i++)step();return;}timer=setInterval(()=>{step();if(++i>=25)clearInterval(timer);},90);};
 $('#reset2').onclick=reset;bind('s2',reset);bind('lr2',()=>{});$('#lr2o').textContent=$('#lr2').value;$('#s2o').textContent=$('#s2').value;reset();redraws.push(draw);
 window.__lab2={step,reset};})();

/* ---------- Lab 3 ---------- */
(function(){const cv=$('#c3');const F={step:[t=>t>0?1:0,'The original perceptron. Its derivative is zero almost everywhere, so gradient descent gets no signal through it.'],sigmoid:[t=>1/(1+Math.exp(-t)),'Squashes to (0,1). Flat at both ends, derivative at most 0.25, so gradients shrink in deep stacks.'],tanh:[Math.tanh,'Like sigmoid but centred on zero, range (−1,1). Still saturates at the ends.'],ReLU:[t=>Math.max(0,t),'max(0, z). Cheap, derivative 1 for positive inputs. The default in most networks. Neurons stuck below zero can "die".'],GELU:[t=>0.5*t*(1+Math.tanh(0.7978845608*(t+0.044715*t**3))),'A smooth ReLU. Used in BERT and GPT-style models.']};
 let cur='ReLU';const seen=new Set();const box=$('#act3');Object.keys(F).forEach(k=>{const b=document.createElement('button');b.className='btn';b.textContent=k;b.onclick=()=>{cur=k;draw();};box.appendChild(b);});
 function draw(){[...box.children].forEach(b=>b.classList.toggle('on',b.textContent===cur));const S=setup(cv),x=S.x;const X=v=>(v+5)/10*S.w,Y=v=>S.h/2-v*(S.h/2-16)/2.2;
  x.strokeStyle=C.line;x.beginPath();x.moveTo(0,Y(0));x.lineTo(S.w,Y(0));x.moveTo(X(0),0);x.lineTo(X(0),S.h);x.stroke();
  const f=F[cur][0];x.strokeStyle=C.o2;x.lineWidth=3;x.beginPath();for(let i=0;i<=400;i++){const t=-5+10*i/400;i?x.lineTo(X(t),Y(f(t))):x.moveTo(X(t),Y(f(t)));}x.stroke();
  x.strokeStyle=C.gold;x.lineWidth=1.5;x.setLineDash([4,4]);x.beginPath();for(let i=0;i<=400;i++){const t=-5+10*i/400,h=1e-3;let d=(f(t+h)-f(t-h))/(2*h);d=Math.max(-2,Math.min(2,d));i?x.lineTo(X(t),Y(d)):x.moveTo(X(t),Y(d));}x.stroke();x.setLineDash([]);x.lineWidth=1;
  x.font='12px Geist Mono, monospace';x.fillStyle=C.o2;x.fillText('φ(z)',10,18);x.fillStyle=C.gold;x.fillText("φ'(z) derivative",60,18);
  $('#actnote').textContent=F[cur][1];seen.add(cur);if(seen.size===5)M(3,0);if(cur==='step')M(3,1);}
 draw();redraws.push(draw);})();

/* ---------- Lab 4 ---------- */
(function(){const cv=$('#c4');let tr=[],va=[],good=false;
 function sample(){tr=[];va=[];for(let i=0;i<15;i++){const x=-1+2*(i+Math.random()*0.8)/15;tr.push([x,Math.sin(Math.PI*x)+(Math.random()-.5)*0.5]);}for(let i=0;i<40;i++){const x=Math.random()*2-1;va.push([x,Math.sin(Math.PI*x)+(Math.random()-.5)*0.5]);}}
 function fit(d){const m=d+1;const A=Array.from({length:m},()=>Array(m+1).fill(0));tr.forEach(([x,y])=>{const p=[];for(let i=0;i<m;i++)p.push(x**i);for(let i=0;i<m;i++){for(let j=0;j<m;j++)A[i][j]+=p[i]*p[j];A[i][m]+=p[i]*y;}});for(let i=0;i<m;i++)A[i][i]+=1e-10;
  for(let i=0;i<m;i++){let mx=i;for(let r=i+1;r<m;r++)if(Math.abs(A[r][i])>Math.abs(A[mx][i]))mx=r;[A[i],A[mx]]=[A[mx],A[i]];for(let r=0;r<m;r++){if(r===i)continue;const f=A[r][i]/A[i][i];for(let c=i;c<=m;c++)A[r][c]-=f*A[i][c];}}
  return A.map((r,i)=>r[m]/r[i]);}
 const ev=(c,x)=>c.reduce((a,v,i)=>a+v*x**i,0);
 function draw(){const d=+$('#d4').value,c=fit(d);const S=setup(cv),x=S.x;const X=v=>(v+1.05)/2.1*S.w,Y=v=>S.h/2-v*(S.h/2-14)/1.8;
  x.strokeStyle=C.dim;x.setLineDash([3,4]);x.beginPath();for(let i=0;i<=200;i++){const t=-1+2*i/200;i?x.lineTo(X(t),Y(Math.sin(Math.PI*t))):x.moveTo(X(t),Y(Math.sin(Math.PI*t)));}x.stroke();x.setLineDash([]);
  x.save();x.beginPath();x.rect(0,0,S.w,S.h);x.clip();x.strokeStyle=C.o2;x.lineWidth=2.5;x.beginPath();for(let i=0;i<=400;i++){const t=-1+2*i/400;const yy=Math.max(-10,Math.min(10,ev(c,t)));i?x.lineTo(X(t),Y(yy)):x.moveTo(X(t),Y(yy));}x.stroke();x.restore();x.lineWidth=1;
  va.forEach(p=>{x.strokeStyle=C.mute;x.strokeRect(X(p[0])-3.5,Y(p[1])-3.5,7,7);});tr.forEach(p=>{x.fillStyle=C.gold;x.fillRect(X(p[0])-4,Y(p[1])-4,8,8);});
  const m=(s)=>s.reduce((a,p)=>a+(ev(c,p[0])-p[1])**2,0)/s.length;const a=m(tr),b=m(va);$('#tr4').textContent=a.toFixed(3);$('#va4').textContent=b>999?'>999':b.toFixed(3);
  const under=a>0.15,over=b>=3*a&&d>=6;$('#verdict4').textContent=under?'underfitting: too simple for a sine':over?'overfitting: memorised the noise':'a reasonable fit';
  if(under)M(4,0);if(b<0.08){M(4,1);if(good)M(4,3);}if(over)M(4,2);window.__lab4={a,b,d};}
 sample();bind('d4',draw);$('#d4o').textContent=$('#d4').value;$('#new4').onclick=()=>{good=!!mdone['4_1'];sample();draw();};draw();redraws.push(draw);})();

/* ---------- Lab 5 BPE ---------- */
(function(){let words,merges;
 function reset(){words=$('#t5').value.split(/\s+/).filter(Boolean).map(w=>[...w,'_']);merges=0;$('#last5').textContent='none';render();}
 function render(){const c=$('#chips5');c.innerHTML='';let n=0;words.forEach(w=>w.forEach(t=>{const s=document.createElement('span');s.className='chip';s.textContent=t;c.appendChild(s);n++;}));$('#n5').textContent=merges;$('#c5').textContent=n;}
 function merge(){const cnt={};words.forEach(w=>{for(let i=0;i<w.length-1;i++){const k=w[i]+'\u0001'+w[i+1];cnt[k]=(cnt[k]||0)+1;}});let best=null,bc=1;for(const k in cnt)if(cnt[k]>bc){bc=cnt[k];best=k;}
  if(!best){$('#last5').textContent='no pair appears twice: BPE is done';M(5,1);return false;}const [a,b]=best.split('\u0001');
  words=words.map(w=>{const o=[];for(let i=0;i<w.length;i++){if(i<w.length-1&&w[i]===a&&w[i+1]===b){o.push(a+b);i++;}else o.push(w[i]);}return o;});merges++;$('#last5').textContent='"'+a+'" + "'+b+'" → "'+a+b+'" ('+bc+'×)';render();if(merges>=5)M(5,0);return true;}
 $('#m5').onclick=merge;$('#r5').onclick=reset;$('#t5').addEventListener('change',()=>{reset();M(5,2);});$('#t5').addEventListener('keydown',e=>{if(e.key==='Enter'){reset();M(5,2);}});reset();window.__lab5={merge};})();

/* ---------- Lab 6 embeddings ---------- */
(function(){const cv=$('#c6');const W={king:[0.62,0.78],queen:[0.2,0.8],man:[0.66,0.34],woman:[0.24,0.36],prince:[0.7,0.66],princess:[0.28,0.68],robot:[0.88,-0.52],machine:[0.96,-0.38],sensor:[0.82,-0.7],apple:[-0.78,-0.3],banana:[-0.88,-0.1],bread:[-0.66,-0.5]};
 let sel=[],extra=null;const cos=(a,b)=>(a[0]*b[0]+a[1]*b[1])/(Math.hypot(...a)*Math.hypot(...b));let X,Y;
 function draw(){const S=setup(cv);const x=S.x;X=v=>S.w/2+v*(S.w/2-70);Y=v=>S.h/2-v*(S.h/2-30);
  x.strokeStyle=C.line;x.beginPath();x.moveTo(0,S.h/2);x.lineTo(S.w,S.h/2);x.moveTo(S.w/2,0);x.lineTo(S.w/2,S.h);x.stroke();
  sel.forEach(k=>{x.strokeStyle=C.o2;x.lineWidth=2;x.beginPath();x.moveTo(X(0),Y(0));x.lineTo(X(W[k][0]),Y(W[k][1]));x.stroke();x.lineWidth=1;});
  if(extra){x.strokeStyle=C.gold;x.setLineDash([4,4]);x.beginPath();x.moveTo(X(W.king[0]),Y(W.king[1]));x.lineTo(X(extra[0]),Y(extra[1]));x.stroke();x.setLineDash([]);x.fillStyle=C.gold;x.fillRect(X(extra[0])-6,Y(extra[1])-6,12,12);}
  x.font='13px Geist Mono, monospace';for(const k in W){const on=sel.includes(k);x.fillStyle=on?C.o2:C.paper;x.fillRect(X(W[k][0])-4,Y(W[k][1])-4,8,8);x.fillStyle=on?C.o1:C.mute;x.fillText(k,X(W[k][0])+8,Y(W[k][1])+4);}}
 function pick(best){extra=null;sel.push(best);if(sel.length>2)sel=[best];
  if(sel.length===2){const c=cos(W[sel[0]],W[sel[1]]);$('#o6').innerHTML='cos('+sel[0]+', '+sel[1]+') = <b>'+c.toFixed(3)+'</b>';if(c>0.95&&sel[0]!==sel[1])M(6,0);if(c<0)M(6,1);}else $('#o6').textContent='Selected '+best+'. Click another word.';draw();}
 cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;let best=null,bd=40;for(const k in W){const d=Math.hypot(X(W[k][0])-mx,Y(W[k][1])-my);if(d<bd){bd=d;best=k;}}if(best)pick(best);});
 $('#an6').onclick=()=>{sel=[];extra=[W.king[0]-W.man[0]+W.woman[0],W.king[1]-W.man[1]+W.woman[1]];let best,bs=-2;for(const k in W){if(['king','man','woman'].includes(k))continue;const c=cos(extra,W[k]);if(c>bs){bs=c;best=k;}}$('#o6').innerHTML='king − man + woman lands at the gold square. Nearest word: <b>'+best+'</b> (cos '+bs.toFixed(3)+')';M(6,2);draw();};
 $('#clr6').onclick=()=>{sel=[];extra=null;$('#o6').textContent='Click one word, then another.';draw();};draw();redraws.push(draw);window.__lab6={pick,W,X:()=>X,Y:()=>Y};})();

/* ---------- Lab 7 ---------- */
(function(){const cv=$('#c7');const words='the robot on line three that the team repaired last week after the long night shift finally stopped'.split(' ');
 function draw(){const S=setup(cv),x=S.x,k=+$('#k7').value,n=words.length,bw=S.w/n;x.font='10px Geist Mono, monospace';
  words.forEach((w,i)=>{const v=Math.pow(k,n-1-i);const h=v*(S.h-44);x.fillStyle=i===1?C.gold:C.o2;x.fillRect(i*bw+2,S.h-24-h,bw-4,h);x.fillStyle=C.mute;x.fillText(w.slice(0,Math.max(2,Math.floor(bw/7))),i*bw+2,S.h-8);});
  const left=Math.pow(k,n-2)*100;x.fillStyle=C.gold;x.font='12px Geist Mono, monospace';x.fillText('"robot" signal left: '+left.toFixed(2)+'%',10,16);if(left>10)M(7,0);if(k<=0.6)M(7,1);}
 bind('k7',draw);$('#k7o').textContent=$('#k7').value;draw();redraws.push(draw);})();

/* ---------- Lab 8 ---------- */
(function(){const toks=['The','robot','picked','up','the','ball','because','it','was','light'];
 const S={0:[3,1,0,0,1,0,0,0,0,0],1:[1,3,1,0,0,1,0,1,0,0],2:[0,2,2,2,0,2,0,0,0,0],3:[0,0,2,3,0,1,0,0,0,0],4:[0,0,0,0,2,3,0,0,0,0],5:[0,1,2,1,1,3,0,0,0,1],6:[0,0,1,0,0,0,2,1,1,0],7:[0,1.3,0,0,0,2.4,0.4,0.6,0.3,0.9],8:[0,0,0,0,0,0,0,2,2,1],9:[0,0.5,0,0,0,1.6,0,1.2,1,1.5]};
 let cur=7,wasCollapsed=false;const box=$('#sent8');toks.forEach((t,i)=>{const b=document.createElement('button');b.className='tokbtn';b.textContent=t;b.onclick=()=>{cur=i;draw();};box.appendChild(b);});
 function draw(){[...box.children].forEach((b,i)=>b.classList.toggle('on',i===cur));const dk=+$('#dk8').value,sc=$('#sc8').checked;
  const raw=S[cur].map(v=>v*Math.sqrt(dk)/2);const s=raw.map(v=>sc?v/Math.sqrt(dk):v);const m=Math.max(...s);const e=s.map(v=>Math.exp(v-m));const Z=e.reduce((a,b)=>a+b,0);const p=e.map(v=>v/Z);
  const bars=$('#bars8');bars.innerHTML='';toks.forEach((t,i)=>{const r=document.createElement('div');r.className='row';r.innerHTML='<span></span><div class="b"><i></i></div><span></span>';r.children[0].textContent=t;r.querySelector('i').style.width=(p[i]*100)+'%';r.children[2].textContent=p[i].toFixed(3);bars.appendChild(r);});
  const ent=-p.reduce((a,v)=>a+(v>0?v*Math.log(v):0),0);const top=p.indexOf(Math.max(...p));
  $('#n8').textContent='Query: "'+toks[cur]+'". Top weight: "'+toks[top]+'". Entropy '+ent.toFixed(2)+' nats (higher = more spread out). '+(!sc&&dk>=128?'Unscaled with large dₖ: softmax collapses onto one token, gradients vanish.':'Scaled scores keep the softmax soft and trainable.');
  if(cur===7&&top===5)M(8,0);if(!sc&&dk>=128&&ent<0.3){M(8,1);wasCollapsed=true;}if(sc&&wasCollapsed)M(8,2);window.__lab8={ent,top};}
 bind('dk8',draw);$('#dk8o').textContent=$('#dk8').value;$('#sc8').onchange=draw;draw();})();

/* ---------- Lab 9 ---------- */
(function(){const cv=$('#c9');const toks=['<s>','The','robot','saw','the','ball','and','it','rolled'];const n=toks.length;
 const heads={'Head 1 · previous token':(i,j)=>j===i-1?4:(j===i?1:0),'Head 2 · pronoun → noun':(i,j)=>(i===7&&j===5)?5:(i===7&&j===2)?3:(j===i?1.5:0),'Head 3 · attention sink (first token)':(i,j)=>j===0?3:(j===i?1:0),'Head 4 · verb ↔ subject':(i,j)=>((i===3||i===8)&&(j===2||j===7))?3.5:(j===i?1:0)};
 let cur=Object.keys(heads)[0];const seen=new Set();const box=$('#h9');Object.keys(heads).forEach(k=>{const b=document.createElement('button');b.className='btn';b.textContent=k.split(' · ')[0];b.title=k;b.onclick=()=>{cur=k;draw();};box.appendChild(b);});
 function draw(){[...box.children].forEach(b=>b.classList.toggle('on',b.title===cur));const mask=$('#m9').checked;const S=setup(cv),x=S.x;const pad=64,cell=Math.max(8,Math.min((S.w-pad-10)/n,(S.h-pad-10)/n));
  x.font='12px Geist Mono, monospace';
  for(let i=0;i<n;i++){const row=[];for(let j=0;j<n;j++)row.push(mask&&j>i?-Infinity:heads[cur](i,j));const m=Math.max(...row);const e=row.map(v=>v===-Infinity?0:Math.exp(v-m));const Z=e.reduce((a,b)=>a+b,0);
   for(let j=0;j<n;j++){const p=e[j]/Z;const X0=pad+j*cell,Y0=pad+i*cell;if(mask&&j>i){x.fillStyle='#16161a';x.fillRect(X0+1,Y0+1,cell-2,cell-2);x.fillStyle=C.dim;x.fillText('×',X0+cell/2-4,Y0+cell/2+4);}else{x.fillStyle=`rgba(250,80,15,${0.08+p*0.92})`;x.fillRect(X0+1,Y0+1,cell-2,cell-2);}}
   x.fillStyle=C.mute;x.textAlign='right';x.fillText(toks[i],pad-8,pad+i*cell+cell/2+4);x.textAlign='left';}
  for(let j=0;j<n;j++){x.save();x.translate(pad+j*cell+cell/2+4,pad-8);x.rotate(-Math.PI/3);x.fillStyle=C.mute;x.fillText(toks[j],0,0);x.restore();}
  $('#n9').textContent=cur+'. Rows = the token doing the looking (query); columns = tokens looked at (keys). '+(mask?'Grey × cells are the future, blocked by the causal mask.':'No mask: every token sees the whole sentence, as in BERT.');
  seen.add(cur);if(seen.size===4)M(9,0);if(!mask)M(9,1);}
 $('#m9').onchange=draw;draw();redraws.push(draw);})();

/* ---------- Lab 10 ---------- */
(function(){const toks=['ball','box','part','tool','sensor','cable','pace','signal','banana','courage'];const logits=[3.2,2.6,2.3,2.0,1.4,1.1,0.2,-0.3,-1.2,-2.0];
 function probs(){const T=+$('#T10').value,K=+$('#K10').value,P=+$('#P10').value;const s=logits.map(l=>l/T);const m=Math.max(...s);let p=s.map(v=>Math.exp(v-m));let Z=p.reduce((a,b)=>a+b,0);p=p.map(v=>v/Z);
  const order=p.map((v,i)=>i).sort((a,b)=>p[b]-p[a]);const keep=new Set();let cum=0;for(const i of order){if(keep.size>=K)break;if(cum>=P&&keep.size>0)break;keep.add(i);cum+=p[i];}
  const q=p.map((v,i)=>keep.has(i)?v:0);Z=q.reduce((a,b)=>a+b,0);return {q:q.map(v=>v/Z),kept:keep.size};}
 function draw(){const {q,kept}=probs();const bars=$('#bars10');bars.innerHTML='';toks.forEach((t,i)=>{const r=document.createElement('div');r.className='row';r.innerHTML='<span></span><div class="b"><i></i></div><span></span>';r.children[0].textContent=t;r.querySelector('i').style.width=(q[i]*100)+'%';if(q[i]===0)r.style.opacity=.35;r.children[2].textContent=q[i].toFixed(3);bars.appendChild(r);});
  if(+$('#P10').value<=0.5)M(10,2);return kept;}
 $('#s10').onclick=()=>{const {q}=probs();const o=$('#out10');o.innerHTML='';const got=new Set();for(let s=0;s<20;s++){let r=Math.random(),i=0;for(;i<q.length-1;i++){r-=q[i];if(r<=0)break;}while(q[i]===0&&i>0)i--;got.add(toks[i]);const c=document.createElement('span');c.className='chip';c.textContent=toks[i];o.appendChild(c);}
  if(+$('#K10').value===1)M(10,0);if(+$('#T10').value>=1.5&&got.size>=6)M(10,1);window.__lab10={distinct:got.size};};
 ['T10','K10','P10'].forEach(id=>{bind(id,draw);$('#'+id+'o').textContent=$('#'+id).value;});draw();})();

/* ---------- Lab 11 ---------- */
(function(){const cv=$('#c11');const fmt=n=>n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'k':String(n);
 function draw(){const d=+$('#d11').value,r=+$('#r11').value;const full=d*d,lo=2*d*r;const pct=lo/full*100;$('#f11').textContent=fmt(full);$('#l11').textContent=fmt(lo);$('#p11').textContent=pct.toFixed(3)+'%';
  const S=setup(cv),x=S.x;const sz=Math.min(S.h-34,(S.w-90)/2.3);const t=Math.max(2,sz*r/d);const y0=8;x.font='12px Geist Mono, monospace';
  x.fillStyle=C.ink3;x.fillRect(10,y0,sz,sz);x.fillStyle=C.mute;x.fillText('W '+d+'×'+d,12,y0+sz+18);
  const bx=10+sz+34;x.fillStyle=C.paper;x.font='20px Geist, sans-serif';x.fillText('+',10+sz+10,y0+sz/2+7);
  x.fillStyle=C.o2;x.fillRect(bx,y0,t,sz);const ax=bx+t+26;x.fillStyle=C.paper;x.fillText('·',bx+t+8,y0+sz/2+7);x.fillStyle=C.o1;x.fillRect(ax,y0,sz,t);
  x.font='12px Geist Mono, monospace';x.fillStyle=C.mute;x.fillText('B·A (r='+r+')',bx,y0+sz+18);
  if(pct<0.1)M(11,0);if(pct>40)M(11,1);}
 bind('d11',draw);bind('r11',draw);$('#d11o').textContent=$('#d11').value;$('#r11o').textContent=$('#r11').value;draw();redraws.push(draw);})();

/* ---------- Lab 12 RAG ---------- */
(function(){const docs=[{src:'AMR_manual.pdf p.12',t:'Check the AMR battery charge cycles every 2 weeks and replace packs below 80% capacity.'},{src:'AMR_manual.pdf p.4',t:'The fleet manager API assigns missions to AMRs based on priority and battery level.'},{src:'Schneider_HMI.pdf p.30',t:'Clean the HMI touch panel weekly with a dry cloth; never use solvents.'},{src:'Safety_rules.pdf p.2',t:'Wear safety shoes in the production area. Stop the line with the red emergency button.'},{src:'Line3_log.txt',t:'Line 3 conveyor jammed twice in September; the belt tension was adjusted.'}];
 const stop=new Set('the a an and or of to in on with how often should is be are what when do does every who which i my it for from at by this that was were can you your me'.split(' '));
 const stem=w=>w.length>4?w.replace(/(ing|ed|es|s)$/,''):w;
 const tk=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w&&!stop.has(w)).map(stem);
 function score(q,d){const a=new Set(tk(q)),b=new Set(tk(d.t+' '+d.src.replace(/[_.]/g,' ')));let i=0;a.forEach(w=>{if(b.has(w))i++;});return a.size&&b.size?i/Math.sqrt(a.size*b.size):0;}
 let timers=[];
 function run(){timers.forEach(clearTimeout);timers=[];const q=$('#q12').value.trim()||'(empty question)',k=+$('#k12').value;const sc=docs.map(d=>({...d,s:score(q,d)})).sort((a,b)=>b.s-a.s);const top=sc.slice(0,k);const hit=top[0].s>=0.15;
  const vec=tk(q).slice(0,6).map((w,i)=>((w.charCodeAt(0)*37+w.length*13+i*11)%200/100-1).toFixed(2));
  const ans=hit?'(the model answers from the context and cites ['+top[0].src+'])':'I don\'t know: none of the retrieved documents cover this. (Relevance too low, so the pipeline tells the model to abstain.)';
  const steps=[['1 · Embed the question',q+'\n→ ['+(vec.length?vec.join(', '):'0.00')+', …]  (hundreds of numbers in a real model)'],['2 · Search the vector store ('+docs.length+' chunks) · relevance',sc.map(d=>d.s.toFixed(2)+'  '+d.src).join('\n')],['3 · Keep top-'+k,top.map(d=>'['+d.src+'] '+d.t).join('\n')],['4 · Build the prompt','SYSTEM: Answer only from the context. If it is not there, say you don\'t know. Cite sources.\nCONTEXT:\n'+top.map(d=>'['+d.src+'] '+d.t).join('\n')+'\nQUESTION: '+q],['5 · Generate',ans]];
  const box=$('#st12');box.innerHTML='';steps.forEach((s,i)=>{const d=document.createElement('div');d.className='st';d.innerHTML='<span class="tag"></span><div></div>';d.children[0].textContent=s[0];d.children[1].textContent=s[1];box.appendChild(d);if(RM)d.classList.add('on');else timers.push(setTimeout(()=>d.classList.add('on'),i*220));});
  if(hit&&top[0].src.startsWith('AMR_manual.pdf p.12'))M(12,0);if(hit&&top[0].src.startsWith('Schneider'))M(12,1);if(!hit)M(12,2);window.__lab12={top:top[0].src,hit};}
 $('#go12').onclick=run;bind('k12',()=>{});$('#k12o').textContent=$('#k12').value;run();
 $('#q12').addEventListener('keydown',e=>{if(e.key==='Enter')run();});})();

/* ---------- Lab 13 agent ---------- */
(function(){const S=[['USER','Is line 3 healthy enough to run a double shift tomorrow?'],['THOUGHT','I need the current status of line 3, then any recent incidents.'],['ACTION · tool call 1','get_machine_status({"line": 3})'],['OBSERVATION','{"line":3,"state":"running","oee":0.81,"alarms":[]}'],['THOUGHT','Running, no alarms. Check the maintenance log for recurring problems.'],['ACTION · tool call 2','search_docs({"query": "line 3 incidents September"})'],['OBSERVATION','[Line3_log.txt] Conveyor jammed twice in September; belt tension adjusted.'],['THOUGHT','Two jams, fixed since. Enough to answer, with a caveat.'],['FINAL ANSWER','Line 3 is running with no active alarms (OEE 81%). It jammed twice in September; belt tension was adjusted since. It looks fit for a double shift; I suggest a belt check before the second shift. [Line3_log.txt]  ·  2 tool calls used.']];
 let i=0;const box=$('#st13');S.forEach(s=>{const d=document.createElement('div');d.className='st';d.innerHTML='<span class="tag"></span><div></div>';d.children[0].textContent=s[0];d.children[1].textContent=s[1];box.appendChild(d);});
 function show(){[...box.children].forEach((d,k)=>{d.hidden=k>i;d.classList.toggle('on',k===i);});$('#n13').textContent=i>=S.length-1?'Done':'Next step';$('#n13').disabled=i>=S.length-1;if(i>=S.length-1){M(13,0);M(13,1);}}
 $('#n13').onclick=()=>{if(i<S.length-1){i++;show();}};$('#r13').onclick=()=>{i=0;show();};show();})();

/* ---------- Lab 14 ---------- */
(function(){const cv=$('#c14');const art=['................','......oooo......','....oooooooo....','...oggoooggoo...','...oggoooggoo...','..oooooooooooo..','..oooorrrroooo..','..ooorrrrrrooo..','...oooorrooooo..','....oooooooo....','.....oooooo.....','......o..o......','.....oo..oo.....','................','................','................'];
 const col={'.':[20,20,24],o:[250,80,15],g:[255,175,0],r:[195,0,47]};let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};const noise=[];for(let i=0;i<256;i++)noise.push([rnd(),rnd(),rnd()].map(v=>(v-.5)*2));
 function draw(){const S=setup(cv),x=S.x,p=+$('#p14').value,t=+$('#t14').value/100;const a=Math.sqrt(Math.max(0,1-t*t)),b=t;const px=Math.max(4,Math.floor(Math.min(S.h-20,S.w*0.45)/16));
  for(let r=0;r<16;r++)for(let c=0;c<16;c++){const base=col[art[r][c]];const nn=noise[r*16+c];const v=base.map((ch,k)=>Math.round(Math.max(0,Math.min(255,a*ch+b*(128+nn[k]*127)))));x.fillStyle=`rgb(${v.join(',')})`;x.fillRect(10+c*px,10+r*px,px,px);}
  x.strokeStyle=C.paper;x.lineWidth=1.5;for(let k=0;k<=16;k+=p){x.beginPath();x.moveTo(10+k*px,10);x.lineTo(10+k*px,10+16*px);x.stroke();x.beginPath();x.moveTo(10,10+k*px);x.lineTo(10+16*px,10+k*px);x.stroke();}x.lineWidth=1;
  const g=16/p,np=g*g;const sx=30+16*px;const avail=S.w-sx-10;const perRow=Math.max(1,Math.floor(avail/10));const w=Math.max(4,Math.min(18,avail/Math.min(np,perRow)-2));const cols=Math.max(1,Math.floor(avail/(w+2)));
  x.font='12px Geist Mono, monospace';x.fillStyle=C.mute;x.fillText('→ '+np+' patch tokens',sx,24);
  for(let k=0;k<np;k++){const rr=Math.floor(k/g),cc=k%g;const c0=col[art[rr*p+Math.floor(p/2)][cc*p+Math.floor(p/2)]];x.fillStyle=`rgb(${c0.join(',')})`;x.fillRect(sx+(k%cols)*(w+2),36+Math.floor(k/cols)*(w+2),w,w);}
  $('#n14').textContent='Patch '+p+'×'+p+' px → '+np+' tokens. Diffusion t = '+Math.round(t*100)+'%: signal weight '+a.toFixed(2)+', noise weight '+b.toFixed(2)+'. A diffusion model learns to walk this slider backward.';
  if(p===2)M(14,0);if(t>=1)M(14,1);if(t>=0.9)M(14,2);}
 bind('p14',draw);bind('t14',draw);$('#p14o').textContent=$('#p14').value;$('#t14o').textContent=$('#t14').value;draw();redraws.push(draw);})();

/* ---------- Lab 15 ---------- */
(function(){const cv=$('#c15');
 function draw(){const P=+$('#P15').value,B=+$('#B15').value,Ck=+$('#C15').value,BW=+$('#W15').value;const wg=P*B/8;const layers=Math.round(32*Math.sqrt(P/7));const kv=2*layers*8*128*2*Ck*1024/1e9;const tot=wg+kv;const ts=BW/(wg+kv*0.5);
  $('#wg15').textContent=wg.toFixed(1)+' GB';$('#kv15').textContent=kv.toFixed(2)+' GB';$('#tt15').textContent=tot.toFixed(1)+' GB';$('#ts15').textContent=Math.round(ts)+' tok/s';
  const S=setup(cv),x=S.x;const max=Math.max(80,tot*1.1);const X=v=>10+v/max*(S.w-20);x.fillStyle=C.o2;x.fillRect(X(0),20,X(wg)-X(0),34);x.fillStyle=C.gold;x.fillRect(X(wg),20,X(tot)-X(wg),34);
  x.font='11px Geist Mono, monospace';[8,16,24,48,80].forEach(g=>{if(g>max)return;x.strokeStyle=C.mute;x.setLineDash([3,3]);x.beginPath();x.moveTo(X(g),10);x.lineTo(X(g),70);x.stroke();x.setLineDash([]);x.fillStyle=C.mute;x.fillText(g+'GB',X(g)-14,86);});
  x.fillStyle=C.o2;x.fillRect(10,S.h-30,10,10);x.fillStyle=C.mute;x.fillText('weights',24,S.h-21);x.fillStyle=C.gold;x.fillRect(90,S.h-30,10,10);x.fillStyle=C.mute;x.fillText('KV cache',104,S.h-21);x.fillStyle=C.dim;if(S.w>=420)x.fillText('dashed: common GPU memory sizes',180,S.h-21);
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
  x.strokeStyle=C.paper;x.lineWidth=2;x.beginPath();x.moveTo(X(th),0);x.lineTo(X(th),S.h-20);x.stroke();x.lineWidth=1;x.font='12px Geist Mono, monospace';x.fillStyle=C.mute;x.fillText('score 0',10,S.h-4);x.fillText('score 1',S.w-60,S.h-4);x.fillStyle=C.o1;x.fillText('flagged as defect →',Math.min(X(th)+6,S.w-150),14);
  const s=stats(th);$('#tp16').textContent=s.tp;$('#fp16').textContent=s.fp;$('#fn16').textContent=s.fn;$('#tn16').textContent=s.tn;$('#pr16').textContent=s.pr.toFixed(2);$('#rc16').textContent=s.rc.toFixed(2);$('#f116').textContent=s.f1.toFixed(2);
  if(s.rc>=1)M(16,0);if(s.pr>=1&&s.tp>0)M(16,1);if(s.f1>=bestF1-0.01)M(16,2);}
 bind('th16',draw);$('#th16o').textContent=$('#th16').value;draw();redraws.push(draw);})();

/* ---------- Interview Q&A ---------- */
const QA=[
['Fundamentals','Explain bias vs variance.','Bias is error from a model too simple to capture the pattern (underfits). Variance is error from sensitivity to the particular training sample (overfits). More capacity lowers bias and raises variance; regularisation, more data and early stopping control variance. Diagnose with train vs validation curves.'],
['Fundamentals','What is a loss function? Give two examples and when to use them.','A single number measuring how wrong predictions are, which gradient descent minimises. MSE for regression (penalises big errors quadratically); cross-entropy for classification (−log of the probability of the correct class, punishes confident mistakes).'],
['Fundamentals','Explain backpropagation to a non-specialist, then precisely.','Plain: after a wrong guess, each weight gets blamed in proportion to how much it contributed, working backward from the output. Precise: forward pass computes and caches activations; backward pass applies the chain rule layer by layer, multiplying local derivatives, giving ∂L/∂w for every weight in about 2× the forward cost.'],
['Fundamentals','Why do we need non-linear activations?','Composed linear layers collapse into one linear map. Non-linearities (ReLU, GELU) let depth represent complex functions.'],
['Fundamentals','SGD vs Adam?','SGD steps along the gradient with one global learning rate (often with momentum). Adam keeps running averages of gradients and squared gradients to give each parameter an adaptive step; converges faster with less tuning. AdamW decouples weight decay and is the LLM default.'],
['Fundamentals','What is the vanishing gradient problem and how is it solved?','Gradients shrink as they are multiplied through many layers or time steps, so early layers stop learning. Fixes: ReLU-family activations, good initialisation, normalisation layers, residual connections, gates in LSTMs, and for sequences, attention.'],
['Fundamentals','BatchNorm vs LayerNorm?','BatchNorm normalises each feature across the batch; depends on batch statistics, great for CNNs. LayerNorm normalises across features of a single example; independent of batch size and sequence length, so transformers use it (or RMSNorm).'],
['Fundamentals','What does dropout do and why does it work?','Randomly zeroes a fraction of activations during training, preventing co-adaptation; acts like training an ensemble of sub-networks. Disabled at inference.'],
['Transformers','How does a transformer work? (the big one)','Tokens → embeddings + positional information → N blocks of [multi-head self-attention + feed-forward], each wrapped with residual connection and layer norm → linear + softmax over vocabulary. Attention: softmax(QKᵀ/√dₖ)V gives each token a relevance-weighted mix of others. A causal mask for generation. Trained with next-token cross-entropy; parallel over positions, which is why it scales.'],
['Transformers','What are Q, K and V?','Three learned linear projections of each token. The query says what a token looks for, the key says what it offers for matching, the value is the content passed on. Scores = q·k; weights = softmax of scores; output = weighted sum of values.'],
['Transformers','Why divide by √dₖ?','Dot products of dₖ-dimensional random vectors have variance ≈ dₖ. Large scores saturate softmax, giving near one-hot weights and vanishing gradients. Scaling keeps variance ≈ 1.'],
['Transformers','Why multi-head attention?','Each head attends in its own subspace, so the layer can capture several relations at once (position, coreference, syntax) at the same cost as one full-width head.'],
['Transformers','Why positional encoding? Sinusoidal vs learned vs RoPE?','Attention is permutation-invariant. Sinusoidal: fixed waves, unique per position. Learned: a trainable vector per position, limited to trained length. RoPE: rotates Q and K by position so scores depend on relative distance; extrapolates better; used in Llama/Mistral.'],
['Transformers','What is the causal mask?','Sets attention scores to future positions to −∞ before softmax so each token only sees earlier ones. Allows parallel training on all positions of a sequence while keeping generation honest.'],
['Transformers','Encoder-only vs decoder-only vs encoder-decoder?','Encoder (BERT): bidirectional, masked-word objective, best for classification and embeddings. Decoder (GPT, Llama): causal, next-token, generation. Encoder-decoder (T5, original Transformer): cross-attention from decoder to encoder, suited to translation and summarisation.'],
['Transformers','What is the complexity of self-attention and how is long context handled?','O(n²·d) time, O(n²) memory for scores. Mitigations: FlashAttention (IO-aware, no stored n×n matrix), sliding-window or sparse attention, GQA to shrink KV cache, RoPE scaling for longer contexts, retrieval instead of stuffing everything.'],
['Transformers','What role does the feed-forward layer play?','Applied per token after attention; about two-thirds of parameters. Attention mixes information between tokens; the FFN transforms each token\'s representation and is thought to store much factual knowledge.'],
['Embeddings','What is an embedding and how is it trained?','A dense vector representing a token, sentence or item, where geometric closeness reflects similarity. Token embeddings are rows of a learned matrix trained by backprop with the rest of the model; word2vec trains them via context prediction; sentence embedders use contrastive learning on similar/dissimilar pairs.'],
['Embeddings','Cosine similarity vs Euclidean distance?','Cosine compares direction, ignoring magnitude; standard for text embeddings. On unit-normalised vectors, cosine ranking and Euclidean ranking are equivalent, and cosine equals the dot product.'],
['Embeddings','How does a vector database find neighbours fast?','Approximate nearest neighbour indexes: HNSW (navigable layered graph), IVF (cluster then search a few clusters), product quantization to compress vectors. Trade a little recall for orders of magnitude speed.'],
['LLMs','How is ChatGPT-style model built, end to end?','Pre-train a decoder transformer on trillions of tokens (next-token loss) → SFT on instruction/answer pairs → preference tuning (RLHF with a reward model and PPO, or DPO) → safety tuning and evaluation → deploy with sampling settings and a system prompt.'],
['LLMs','Explain temperature, top-k and top-p.','Temperature divides logits before softmax: lower = sharper/safer, higher = more diverse. Top-k keeps the k most likely tokens. Top-p keeps the smallest set whose cumulative probability ≥ p, adapting to confidence.'],
['LLMs','Why do LLMs hallucinate and how do you reduce it?','They are trained to produce likely text, not verified truth, and lack facts outside training data. Reduce with RAG and citations, instructions to abstain, lower temperature, tool use for calculations, fine-tuning on grounded answers, and faithfulness evaluation.'],
['LLMs','RLHF vs DPO?','RLHF: train a reward model on human preferences, then optimise the policy with PPO plus a KL penalty to the SFT model. DPO: a closed-form objective optimising the policy directly on preference pairs; no reward model or RL loop; simpler and more stable.'],
['LLMs','What are scaling laws / Chinchilla?','Loss decreases as a power law in parameters, data and compute. Chinchilla: compute-optimal training uses ~20 tokens per parameter; many earlier models were undertrained. Small deployed models are often trained far beyond that because inference cost dominates.'],
['LLMs','Fine-tuning vs RAG vs prompting: how do you choose?','Prompting first (cheapest). RAG when the model needs specific, changing or private knowledge with citations. Fine-tuning to change behaviour, tone, format or to make a small model match a big one on a narrow task. They combine.'],
['LLMs','Explain LoRA.','Freeze W, learn ΔW = B·A with rank r ≪ d, scaled by α/r, with B initialised to zero. Trains <1% of parameters, adapters are small and swappable, and can be merged back into W with zero inference overhead. QLoRA does this on a 4-bit base model.'],
['RAG & agents','Walk me through a RAG pipeline you would build.','Ingest and clean documents → chunk (300–800 tokens, overlap, structure-aware) → embed → store with metadata. Query: rewrite if needed → hybrid search (vectors + BM25) → rerank with a cross-encoder → top 3–5 into a prompt that demands grounded, cited answers → generate. Evaluate retrieval (context precision/recall) and generation (faithfulness, relevancy) on a golden set.'],
['RAG & agents','How do you pick chunk size?','Trade-off: small chunks retrieve precisely but lose context; large ones keep context but dilute relevance and cost tokens. Split along document structure, add overlap, test several sizes on your evaluation set; consider parent-document retrieval (search small, return the larger section).'],
['RAG & agents','What is LangChain and what does LangGraph add?','LangChain: components and a standard interface for LLM apps (models, prompts, retrievers, tools, output parsers) composed with LCEL. LangGraph: builds stateful agents as graphs with nodes, conditional edges, loops, persistence and human-in-the-loop, for control that a linear chain can\'t express.'],
['RAG & agents','How does function calling work?','Tools are described with names and JSON schemas; the model outputs a structured call; the application executes it, returns the result as a message, and the model continues. The model never executes code itself.'],
['RAG & agents','What is ReAct?','An agent pattern interleaving reasoning (thoughts) with actions (tool calls) and observations, looping until a final answer. Grounds reasoning in real tool results.'],
['RAG & agents','What is MCP?','Model Context Protocol: an open client-server standard for exposing tools, resources and prompts to AI applications, so one integration works across many hosts.'],
['RAG & agents','What are the risks of agents and how do you control them?','Compounding errors, loops, cost blow-ups, prompt injection through tool outputs, over-privileged actions. Controls: step limits, schema validation, least-privilege tools, human approval for irreversible actions, tracing, sandboxing, evaluation of trajectories.'],
['Efficiency','What is the KV cache?','Stored keys and values of past tokens so each decoding step computes attention only for the new token. Memory grows with layers × KV heads × head dim × sequence length × batch. GQA/MQA and PagedAttention reduce and manage it.'],
['Efficiency','Why is decoding memory-bound, and what helps?','Each generated token reads every weight once for ~2 FLOPs per weight, far below what the chip can compute per byte. Tokens/s ≈ bandwidth ÷ bytes read. Helps: quantization (fewer bytes), batching (reuse each read), speculative decoding (verify many tokens per pass), MoE (fewer active weights), faster memory.'],
['Efficiency','Explain quantization and its trade-offs.','Represent weights (and sometimes activations) with fewer bits: FP16 → INT8 → INT4. Cuts memory and bandwidth roughly proportionally; small accuracy loss to ~4-bit, worse below. Methods: GPTQ, AWQ, GGUF k-quants; QAT for best quality. Outliers are the main difficulty.'],
['Efficiency','What is knowledge distillation?','Train a small student to match a large teacher\'s output distributions (soft labels), transferring behaviour at a fraction of the size.'],
['Efficiency','What is a Mixture of Experts?','Each layer has many FFN experts and a router sends each token to a few (e.g. 2 of 8). Total parameters large, active compute per token small. Challenges: load balancing, memory to hold all experts.'],
['Production','Which metrics for an imbalanced defect-detection problem?','Not accuracy. Precision, recall, F1, PR-AUC; choose the threshold by the cost of a missed defect versus a false alarm, usually favouring recall.'],
['Production','How would you evaluate an LLM feature before shipping?','Define success criteria; build a golden dataset from real cases including edge cases; automatic checks (format, exact match), LLM-as-judge with a rubric validated against human labels, RAG metrics if relevant; latency and cost; red-team for safety and injection; regression-test on every prompt or model change; monitor in production.'],
['Production','What is data drift and how do you detect it?','The input distribution in production departs from training data (or the input→label relation changes: concept drift). Detect with statistical tests on feature distributions, monitoring prediction confidence and live metrics; respond by retraining or updating retrieval data.'],
['Production','What does the EU AI Act mean for an engineer?','Risk-based rules. High-risk uses need risk management, data governance, technical documentation, logging, human oversight, accuracy and robustness; some uses are banned; general-purpose model providers have transparency and documentation duties. In practice: document data and evaluations, keep humans in the loop, log decisions.'],
['Huawei context','What do you know about Huawei\'s AI stack?','Ascend NPUs (e.g. Ascend 910 series for training, smaller chips for edge) programmed through the CANN toolkit; MindSpore as the deep-learning framework (with MindSpore Lite for devices); ModelArts as the cloud AI development platform; Pangu models. HCIA-AI covers this ecosystem. Relevant ideas: on-device AI, NPU-friendly quantization, efficient inference.']];
const qa=$('#qa');let lastCat='';QA.forEach(([cat,q,a],i)=>{if(cat!==lastCat){const h=document.createElement('h3');h.className='tag';h.style.cssText='margin:28px 0 8px;font-size:12px;color:#ff8205';h.textContent=cat;qa.appendChild(h);lastCat=cat;}
 const d=document.createElement('details');d.innerHTML='<summary><b></b><span></span></summary><div class="a"></div>';d.querySelector('b').textContent='Q'+String(i+1).padStart(2,'0');d.querySelector('span').textContent=q;d.querySelector('.a').textContent=a;qa.appendChild(d);});
})();

/* offline + install support (GitHub Pages) */
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
