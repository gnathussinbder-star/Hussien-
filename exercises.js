(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const L=window.HBE_LESSONS||[], QS=window.HBE_QS||[];
 const H=()=>window.HBE||{};
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
 const phrases=(lvl,lesson)=>L.filter(l=>(!lesson||l.id===lesson)&&(!lvl||lvl==='all'||l.level===lvl)).flatMap(l=>l.phrases.map(p=>({en:p[0],ar:p[1]})));
 const reward=m=>{const h=H();if(!h.getProgress)return;const p=h.getProgress();p.exercises=(p.exercises||0)+1;p.minutes=(p.minutes||0)+m;h.touchDay(p);h.setProgress(p);h.updateDashboard&&h.updateDashboard()};
 const strip=w=>w.replace(/^[^A-Za-z’']+|[^A-Za-z’']+$/g,'');
 const finish=(root,score,total,again)=>{root.innerHTML=`<div class="result-score">${score}/${total}</div><p class="muted">أنهيت التمرين وتم حفظ تقدمك على هذا الجهاز.</p><button class="btn secondary" type="button" data-again>إعادة التمرين</button>`;$('[data-again]',root).onclick=again};

 // ---- Word order
 function mountOrder(root,items,done){
  let i=0,score=0,tries=0,ans=[],bank=[];
  const load=()=>{if(i>=items.length){draw();return}const t=items[i].en.split(/\s+/);let b=shuffle(t.map((w,k)=>({w,k})));if(t.length>1&&b.every((x,k)=>x.k===k))b=b.reverse();bank=b;ans=[];tries=0;draw()};
  const draw=()=>{
   if(i>=items.length){finish(root,score,items.length,()=>{items=shuffle(items);i=0;score=0;load()});done&&done(score,items.length);return}
   root.innerHTML=`<div class="muted">الجملة ${i+1} من ${items.length}</div><p class="ex-ar">${esc(items[i].ar)}</p><div class="ex-answer" dir="ltr" data-ans aria-label="جملتك"></div><div class="ex-bank" dir="ltr" data-bank></div><p class="muted" data-msg role="status" aria-live="polite"></p><div class="actions"><button class="btn secondary" type="button" data-clear>مسح</button><button class="btn primary" type="button" data-check>تحقق</button></div>`;
   const A=$('[data-ans]',root),B=$('[data-bank]',root),chk=$('[data-check]',root),msg=$('[data-msg]',root);
   const chip=(o,from)=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=o.w;b.onclick=()=>{if(chk.dataset.next)return;if(from==='bank'){bank=bank.filter(x=>x!==o);ans.push(o)}else{ans=ans.filter(x=>x!==o);bank.push(o)}paint()};return b};
   const paint=()=>{A.replaceChildren(...ans.map(o=>chip(o,'ans')));B.replaceChildren(...bank.map(o=>chip(o,'bank')))};
   paint();
   $('[data-clear]',root).onclick=()=>{if(chk.dataset.next)return;bank=bank.concat(ans);ans=[];paint();msg.textContent=''};
   chk.onclick=()=>{
    if(chk.dataset.next){i++;load();return}
    if(ans.length!==items[i].en.split(/\s+/).length){msg.className='muted';msg.textContent='رتّب كل الكلمات أولًا.';return}
    tries++;
    if(ans.map(o=>o.w).join(' ')===items[i].en){if(tries===1)score++;msg.className='ok';msg.textContent='صحيح! أحسنت.';chk.textContent=i===items.length-1?'عرض النتيجة':'التالية';chk.dataset.next='1'}
    else{msg.className='bad';msg.textContent='الترتيب غير صحيح بعد. جرّب مرة أخرى.'}
   };
  };
  items=shuffle(items);load();
 }

 // ---- Fill the blank
 const POOL=[...new Set(L.flatMap(l=>l.phrases.flatMap(p=>p[0].split(/\s+/).map(strip))).filter(w=>w.length>=3).map(w=>w.toLowerCase()))];
 function buildCloze(it){
  const t=it.en.split(/\s+/),all=t.map((w,k)=>[k,strip(w)]);
  let c=all.filter(x=>x[1].length>=4);if(!c.length)c=all.filter(x=>x[1].length>=2);
  const [k,word]=c[Math.floor(Math.random()*c.length)];
  const fmt=w=>k===0?w.charAt(0).toUpperCase()+w.slice(1):w;
  const d=shuffle(POOL.filter(w=>w!==word.toLowerCase()&&Math.abs(w.length-word.length)<=3)).slice(0,2).map(fmt);
  return{ar:it.ar,sentence:t.map((w,j)=>j===k?w.replace(word,'_____'):w).join(' '),opts:shuffle([word,...d]),answer:word};
 }
 function mountCloze(root,items,done){
  let qs=shuffle(items).map(buildCloze),i=0,score=0;
  const draw=()=>{
   if(i>=qs.length){finish(root,score,qs.length,()=>{qs=shuffle(items).map(buildCloze);i=0;score=0;draw()});done&&done(score,qs.length);return}
   const q=qs[i];
   root.innerHTML=`<div class="muted">السؤال ${i+1} من ${qs.length}</div><p class="ex-ar">${esc(q.ar)}</p><p class="english" dir="ltr">${esc(q.sentence)}</p><div class="options" dir="ltr">${q.opts.map(o=>`<button class="option" type="button" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div><p class="muted" data-msg role="status" aria-live="polite"></p><div class="actions"><button class="btn primary" type="button" data-next hidden>${i===qs.length-1?'عرض النتيجة':'التالي'}</button></div>`;
   let locked=false;const msg=$('[data-msg]',root);
   $$('[data-o]',root).forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const ok=b.dataset.o===q.answer;if(ok)score++;
    $$('[data-o]',root).forEach(x=>{x.disabled=true;if(x.dataset.o===q.answer)x.classList.add('selected')});if(!ok)b.classList.add('wrong');
    msg.className=ok?'ok':'bad';msg.textContent=ok?'صحيح! أحسنت.':`الإجابة الصحيحة: ${q.answer}`;$('[data-next]',root).hidden=false});
   $('[data-next]',root).onclick=()=>{i++;draw()};
  };
  draw();
 }

 // ---- Grammar quiz
 function mountQuiz(root,pool,n,done){
  const make=()=>shuffle(pool).slice(0,n).map(q=>({q:q.q,l:q.l,o:shuffle(q.opts.map((t,k)=>({t,ok:k===q.a})))}));
  let qs=make(),i=0,score=0,wrong=[];
  const draw=()=>{
   if(i>=qs.length){finish(root,score,qs.length,()=>{qs=make();i=0;score=0;wrong=[];draw()});
    if(wrong.length)root.insertAdjacentHTML('beforeend',`<div class="card" style="margin-top:14px"><h3>راجع هذه الأسئلة</h3>${wrong.map(w=>`<p dir="ltr" style="text-align:left"><b>${esc(w.q)}</b><br>✓ ${esc(w.a)}</p>`).join('')}</div>`);
    done&&done(score,qs.length);return}
   const q=qs[i];
   root.innerHTML=`<div class="muted">السؤال ${i+1} من ${qs.length} · ${esc(q.l)}</div><h3 lang="en" dir="ltr" style="text-align:left">${esc(q.q)}</h3><div class="options" dir="ltr">${q.o.map((o,k)=>`<button class="option" type="button" data-k="${k}">${esc(o.t)}</button>`).join('')}</div><p class="muted" data-msg role="status" aria-live="polite"></p><div class="actions"><button class="btn primary" type="button" data-next hidden>${i===qs.length-1?'عرض النتيجة':'التالي'}</button></div>`;
   let locked=false;const msg=$('[data-msg]',root);
   $$('[data-k]',root).forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const ok=q.o[b.dataset.k].ok;if(ok)score++;else wrong.push({q:q.q,a:q.o.find(o=>o.ok).t});
    $$('[data-k]',root).forEach(x=>{x.disabled=true;if(q.o[x.dataset.k].ok)x.classList.add('selected')});if(!ok)b.classList.add('wrong');
    msg.className=ok?'ok':'bad';msg.textContent=ok?'صحيح! أحسنت.':'ليست هذه الإجابة؛ راجع الخيار المميز.';$('[data-next]',root).hidden=false});
   $('[data-next]',root).onclick=()=>{i++;draw()};
  };
  draw();
 }

 // ---- Lesson pages: practice built from the lesson's own phrases
 $$('[data-order-root][data-lesson]').forEach(r=>mountOrder(r,phrases('all',r.dataset.lesson),()=>reward(2)));
 $$('[data-cloze-root][data-lesson]').forEach(r=>mountCloze(r,phrases('all',r.dataset.lesson),()=>reward(2)));

 // ---- Exercises hub
 if($('[data-ex-page]')){
  const panels=$$('[data-panel]');
  const pool=()=>[...QS,...L.map(l=>({...l.quiz,l:l.level}))];
  const run=p=>{
   const kind=p.dataset.panel,lvl=$('[data-level]',p).value,host=$('[data-host]',p);
   if(kind==='order')mountOrder(host,shuffle(phrases(lvl)).slice(0,6),()=>reward(3));
   else if(kind==='cloze')mountCloze(host,shuffle(phrases(lvl)).slice(0,6),()=>reward(3));
   else{const q=pool().filter(x=>lvl==='all'||x.l===lvl);mountQuiz(host,q,Math.min(10,q.length),()=>reward(4))}
  };
  $$('[data-tab]').forEach(t=>t.onclick=()=>{$$('[data-tab]').forEach(x=>x.setAttribute('aria-selected',String(x===t)));panels.forEach(p=>p.hidden=p.dataset.panel!==t.dataset.tab)});
  panels.forEach(p=>{$('[data-start]',p).onclick=()=>run(p);$('[data-level]',p).onchange=()=>run(p)});
  run(panels[0]);
  $$('[data-tab]').forEach(t=>t.addEventListener('click',()=>{const p=panels.find(x=>x.dataset.panel===t.dataset.tab);if(p&&!$('[data-host]',p).children.length)run(p)}));
 }

 // ---- Phrasebook filter
 const pb=$('[data-phrasebook]');
 if(pb){
  const q=$('[data-phrase-search]'),lv=$('[data-phrase-level]'),cards=$$('[data-phrase]'),cnt=$('[data-phrase-count]'),empty=$('[data-phrase-empty]');
  const f=()=>{const t=q.value.trim().toLowerCase(),l=lv.value;let n=0;cards.forEach(c=>{const ok=c.textContent.toLowerCase().includes(t)&&(l==='all'||c.dataset.level===l);c.hidden=!ok;if(ok)n++});cnt.textContent=n;empty.hidden=n!==0};
  q.addEventListener('input',f);lv.addEventListener('change',f);f();
 }

 // ---- Certificate
 const cert=$('[data-cert]');
 if(cert){
  const p=(H().getProgress?H().getProgress():{})||{},n=Array.isArray(p.lessons)?p.lessons.length:0,NEED=10;
  $('[data-cert-count]').textContent=n;
  if(n<NEED){$('[data-cert-locked]').hidden=false;$('[data-cert-need]').textContent=NEED-n}
  else{
   $('[data-cert-ready]').hidden=false;
   const name=$('[data-cert-name]'),out=$('[data-cert-out]');
   const date=new Date().toLocaleDateString('ar-EG-u-nu-latn',{year:'numeric',month:'long',day:'numeric'});
   $('[data-cert-date]').textContent=date;$('[data-cert-lessons]').textContent=n;
   const sync=()=>{out.textContent=name.value.trim()||'اسم المتعلّم'};name.addEventListener('input',sync);sync();
   $('[data-cert-print]').addEventListener('click',()=>{if(!name.value.trim()){name.focus();return}window.print()});
  }
 }
})();
