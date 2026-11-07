(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const toast=(msg)=>{const el=$('[data-toast]');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.classList.remove('show'),2600)};
 let savedTheme=null;try{savedTheme=localStorage.getItem('hbe-theme')}catch{}if(!savedTheme)savedTheme=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';if(savedTheme==='dark')document.body.classList.add('dark');
 const themeBtn=$('[data-theme-toggle]');const syncTheme=()=>themeBtn?.setAttribute('aria-pressed',String(document.body.classList.contains('dark')));syncTheme();
 $('[data-theme-toggle]')?.addEventListener('click',()=>{document.body.classList.toggle('dark');syncTheme();(()=>{try{localStorage.setItem('hbe-theme',document.body.classList.contains('dark')?'dark':'light')}catch{}})()});
 $('[data-menu-toggle]')?.addEventListener('click',e=>{const nav=$('#site-nav');const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open))});
 const closeMenu=()=>{const nav=$('#site-nav'),tg=$('[data-menu-toggle]');if(nav&&nav.classList.contains('open')){nav.classList.remove('open');tg?.setAttribute('aria-expanded','false')}};
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});$$('#site-nav a').forEach(a=>a.addEventListener('click',closeMenu));
 $$('[data-current-year]').forEach(el=>el.textContent=new Date().getFullYear());
 // Local progress tracker, no account or server required.
 const getProgress=()=>{try{return JSON.parse(localStorage.getItem('hbe-progress')||'{}')}catch{return {}}};
 const setProgress=p=>{try{localStorage.setItem('hbe-progress',JSON.stringify(p));return true}catch{return false}};
 const dayKey=d=>d.toLocaleDateString('en-CA');
 function touchDay(p){const t=dayKey(new Date());if(p.lastDay===t)return;const y=dayKey(new Date(Date.now()-864e5));p.streak=p.lastDay===y?(p.streak||0)+1:1;p.lastDay=t}
 const markLesson=(id)=>{const p=getProgress();p.lessons=Array.isArray(p.lessons)?p.lessons:[];if(p.lessons.includes(id)){toast('أكملت هذا الدرس سابقًا.');return}p.lessons.push(id);p.minutes=(p.minutes||0)+5;touchDay(p);if(!setProgress(p)){toast('تعذّر حفظ التقدم؛ قد يكون التخزين المحلي معطّلًا في متصفحك.');return}toast('أحسنت! تم حفظ تقدمك على هذا الجهاز.');updateDashboard()};
 $$('[data-complete-lesson]').forEach(btn=>btn.addEventListener('click',()=>markLesson(btn.dataset.completeLesson)));
 function updateDashboard(){const p=getProgress();const lessons=Array.isArray(p.lessons)?p.lessons:[];$$('[data-complete-lesson]').forEach(b=>{const done=lessons.includes(b.dataset.completeLesson);b.disabled=done;b.textContent=done?'تم إنجاز الدرس ✓':'أكملت الدرس ✓'});$$('[data-lesson-id]').forEach(c=>{const done=lessons.includes(c.dataset.lessonId);let badge=$('.done-badge',c);if(done&&!badge){badge=document.createElement('span');badge.className='pill green done-badge';badge.textContent='مكتمل ✓';$('.lesson-meta',c)?.appendChild(badge)}if(!done&&badge)badge.remove()});$$('[data-stat-lessons]').forEach(el=>el.textContent=lessons.length);$$('[data-stat-minutes]').forEach(el=>el.textContent=p.minutes||0);$$('[data-stat-streak]').forEach(el=>el.textContent=p.streak||0);$$('[data-progress-count]').forEach(el=>el.textContent=lessons.length);$$('[data-progress-bar]').forEach(el=>el.style.width=Math.min(100,lessons.length*10)+'%');}
 updateDashboard();
 // Lesson filtering
 const search=$('[data-lesson-search]'), level=$('[data-lesson-level]'), lessonCards=$$('[data-lesson-card]');
 function filterLessons(){const q=(search?.value||'').trim().toLowerCase(),l=level?.value||'all';let shown=0;lessonCards.forEach(c=>{const text=c.textContent.toLowerCase();const ok=text.includes(q)&&(l==='all'||c.dataset.level===l);c.hidden=!ok;if(ok)shown++});const empty=$('[data-lesson-empty]');if(empty)empty.hidden=shown!==0}
 search?.addEventListener('input',filterLessons);level?.addEventListener('change',filterLessons);
 // Flashcards with spaced repetition (Leitner boxes, stored locally)
 const fullDeck=window.HBE_CARDS||[];
 const DAYS=[0,1,3,7,14,30];
 const cardState=c=>(getProgress().cards||{})[c[0]];
 const isDue=c=>{const s=cardState(c);return !s||s.due<=Date.now()};
 let fLevel='all',fMode='all',deck=[],cardIndex=0,showTranslation=false;
 const word=$('[data-flash-word]'),translation=$('[data-flash-translation]'),flash=$('[data-flashcard]'),counter=$('[data-flash-counter]'),grade=$('[data-flash-grade]');
 function renderCard(){
  if(!word)return;
  if(!deck.length){word.textContent='لا توجد بطاقات للمراجعة الآن 🎉';translation.textContent='عد لاحقًا أو اختر «كل البطاقات».';if(counter)counter.textContent='0 / 0';if(grade)grade.hidden=true;flash?.setAttribute('aria-label','لا توجد بطاقات');return}
  const c=deck[cardIndex];word.textContent=c[0];translation.textContent=showTranslation?c[1]:'اضغط لإظهار المعنى';
  if(counter)counter.textContent=`${cardIndex+1} / ${deck.length} · ${c[2]}`;
  if(grade)grade.hidden=!showTranslation;
  flash?.setAttribute('aria-label',showTranslation?`${c[0]}: ${c[1]}`:`${c[0]}. اضغط لإظهار المعنى`);
 }
 function buildDeck(){deck=fullDeck.filter(c=>(fLevel==='all'||c[2]===fLevel)&&(fMode==='all'||isDue(c)));cardIndex=0;showTranslation=false;renderCard()}
 const flip=()=>{if(!deck.length)return;showTranslation=!showTranslation;renderCard()};
 const go=d=>{if(!deck.length)return;cardIndex=(cardIndex+d+deck.length)%deck.length;showTranslation=false;renderCard()};
 function rate(ok){
  if(!deck.length)return;const p=getProgress();p.cards=p.cards&&typeof p.cards==='object'?p.cards:{};const c=deck[cardIndex];const s=p.cards[c[0]]||{box:0};
  s.box=ok?Math.min(5,s.box+1):1;s.due=Date.now()+(ok?DAYS[s.box]:0)*864e5;p.cards[c[0]]=s;touchDay(p);
  if(!setProgress(p)){toast('تعذّر حفظ التقدم في هذا المتصفح.')}
  toast(ok?'ممتاز! ستعود هذه البطاقة لاحقًا.':'سنعيد هذه البطاقة قريبًا.');
  if(fMode==='due'){deck.splice(cardIndex,1);if(cardIndex>=deck.length)cardIndex=0;showTranslation=false;renderCard()}else go(1);
 }
 flash?.addEventListener('click',flip);
 flash?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}else if(e.key==='ArrowLeft'){e.preventDefault();go(1)}else if(e.key==='ArrowRight'){e.preventDefault();go(-1)}});
 $('[data-flash-next]')?.addEventListener('click',()=>go(1));
 $('[data-flash-prev]')?.addEventListener('click',()=>go(-1));
 $('[data-flash-speak]')?.addEventListener('click',()=>speakEnglish(deck[cardIndex]?.[0]));
 $('[data-flash-know]')?.addEventListener('click',()=>rate(true));
 $('[data-flash-again]')?.addEventListener('click',()=>rate(false));
 $('[data-flash-level]')?.addEventListener('change',e=>{fLevel=e.target.value;buildDeck()});
 $('[data-flash-mode]')?.addEventListener('change',e=>{fMode=e.target.value;buildDeck()});
 buildDeck();
 // Placement quiz: 20 practice questions across five guidance bands.
 const quizRoot=$('[data-placement-quiz]');
 if(quizRoot){
 const qs=window.HBE_QS;let i=0,answers=Array(qs.length).fill(null),finished=false;
 const qEl=$('[data-question]'),optsEl=$('[data-options]'),step=$('[data-quiz-step]'),fill=$('[data-quiz-fill]'),next=$('[data-quiz-next]'),prev=$('[data-quiz-prev]'),result=$('.result-box',quizRoot);
 function render(){finished=false;const q=qs[i];qEl.textContent=q.q;optsEl.innerHTML='';q.opts.forEach((o,j)=>{const b=document.createElement('button');b.className='option'+(answers[i]===j?' selected':'');b.type='button';b.textContent=o;b.setAttribute('aria-pressed',String(answers[i]===j));b.addEventListener('click',()=>{answers[i]=j;render()});optsEl.appendChild(b)});step.textContent=`السؤال ${i+1} من ${qs.length}`;fill.style.width=(i/qs.length*100)+'%';prev.disabled=i===0;next.disabled=false;next.textContent=i===qs.length-1?'عرض النتيجة':'التالي';optsEl.style.display='grid';result.classList.remove('visible');result.style.display='none';prev.hidden=false;next.hidden=false;const msg=$('[data-quiz-message]');if(msg)msg.textContent=answers[i]===null?'اختر إجابة قبل المتابعة.':'تم حفظ إجابتك لهذا السؤال.'}
 function finish(){const missing=answers.findIndex(a=>a===null);if(missing!==-1){i=missing;render();const msg=$('[data-quiz-message]');if(msg)msg.textContent='أجب عن هذا السؤال أولًا.';return}finished=true;const score=answers.reduce((n,a,j)=>n+(a===qs[j].a?1:0),0);const lev=score<=4?'A1':score<=8?'A2':score<=12?'B1':score<=16?'B2':'C1';$('[data-result-score]').textContent=`${score}/${qs.length}`;$('[data-result-level]').textContent=lev;const summary=$('[data-result-summary]');if(summary)summary.textContent=score<=8?'ابدأ بالأساسيات وركز على الجمل والمفردات اليومية.':score<=15?'لديك أساس جيد؛ راجع الموضوعات الصعبة واستمر بالممارسة.':'أظهرت أداءً قويًا في هذه العينة؛ استمر في تطوير الدقة والطلاقة.';optsEl.style.display='none';result.style.display='block';result.classList.add('visible');fill.style.width='100%';step.textContent='اكتمل الاختبار';next.hidden=true;prev.hidden=true;const d=getProgress();d.quizHistory=Array.isArray(d.quizHistory)?d.quizHistory:[];d.quizHistory.push({score,total:qs.length,level:lev,date:new Date().toISOString()});d.minutes=(d.minutes||0)+10;touchDay(d);setProgress(d);updateDashboard()}
 next.addEventListener('click',()=>{if(i<qs.length-1){if(answers[i]===null){const msg=$('[data-quiz-message]');if(msg)msg.textContent='اختر إجابة قبل المتابعة.';return}i++;render()}else finish()});prev.addEventListener('click',()=>{if(i>0){i--;render()}});$('[data-quiz-restart]')?.addEventListener('click',()=>{i=0;answers=Array(qs.length).fill(null);finished=false;render()});render();
 }
 // Contact form: static site, opens the configured mail client.
 $('[data-contact-form]')?.addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const name=$('[name="name"]',f).value.trim(),email=$('[name="email"]',f).value.trim(),message=$('[name="message"]',f).value.trim();if(!name||!email||!message){toast('يرجى إكمال الحقول المطلوبة.');return}const recipient='gnathussinbder@gmail.com';const subject=encodeURIComponent('رسالة من موقع Hussein Badr English');const body=encodeURIComponent(`الاسم: ${name}\nالبريد: ${email}\n\n${message}`);window.location.href=`mailto:${recipient}?subject=${subject}&body=${body}`;toast('سيُفتح تطبيق البريد لإرسال الرسالة.');});
 // Backup / restore progress
 $('[data-export-progress]')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(getProgress(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hussein-badr-learning-progress.json';a.click();URL.revokeObjectURL(a.href)});
 $('[data-import-progress]')?.addEventListener('change',async e=>{try{const raw=JSON.parse(await e.target.files[0].text());if(!raw||typeof raw!=='object'||Array.isArray(raw))throw 0;const num=(v,max)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.round(v))):0;const clean={lessons:[...new Set((Array.isArray(raw.lessons)?raw.lessons:[]).filter(x=>typeof x==='string'&&/^lesson-([1-9]|1[0-8])$/.test(x)))],minutes:num(raw.minutes,100000),streak:num(raw.streak,10000),skillsSessions:num(raw.skillsSessions,100000),exercises:num(raw.exercises,100000),cards:(()=>{const o={};if(raw.cards&&typeof raw.cards==='object'){Object.entries(raw.cards).slice(0,300).forEach(([k,v])=>{if(v&&Number.isFinite(v.box)&&Number.isFinite(v.due))o[String(k).slice(0,80)]={box:num(v.box,5),due:Math.max(0,Math.round(v.due))}})}return o})(),lastDay:typeof raw.lastDay==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.lastDay)?raw.lastDay:undefined,quizHistory:(Array.isArray(raw.quizHistory)?raw.quizHistory:[]).filter(q=>q&&Number.isFinite(q.score)&&Number.isFinite(q.total)).slice(-50).map(q=>({score:num(q.score,100),total:num(q.total,100),level:String(q.level||'').slice(0,3),date:String(q.date||'').slice(0,40)}))};if(!setProgress(clean))throw 0;updateDashboard();toast('تم استيراد نسخة التقدم.')}catch{toast('تعذّر قراءة الملف. اختر نسخة JSON صحيحة.')}e.target.value=''});

 // Browser speech synthesis and optional speech recognition for the skills practice page.
 function speakEnglish(text){if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){toast('النطق الصوتي غير مدعوم في هذا المتصفح.');return}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='en-US';u.rate=.88;window.speechSynthesis.speak(u)}
 document.addEventListener('click',e=>{const button=e.target.closest('[data-speak]');if(button)speakEnglish(button.getAttribute('data-speak')||button.textContent)});
 const listenPhrases=['Could you tell me where the station is?','I would like to make a reservation for two people.','The meeting has been moved to Thursday afternoon.','Although the journey was long, we enjoyed the trip.','The evidence suggests that the plan could work.'];let listenIndex=0;
 $('[data-speak-current]')?.addEventListener('click',()=>speakEnglish($('[data-listening-phrase]')?.textContent));
 $('[data-listening-next]')?.addEventListener('click',()=>{listenIndex=(listenIndex+1)%listenPhrases.length;const node=$('[data-listening-phrase]');if(node)node.textContent=listenPhrases[listenIndex];const note=$('[data-listening-feedback]');if(note)note.textContent='استمع إلى الجملة قبل إظهار النص.'});
 $('[data-reveal-listening]')?.addEventListener('click',()=>{const note=$('[data-listening-feedback]');if(note)note.textContent=`النص: ${$('[data-listening-phrase]')?.textContent||''}`});
 $('[data-speak-prompt]')?.addEventListener('click',()=>speakEnglish($('[data-speaking-prompt]')?.textContent));
 $('[data-start-speaking]')?.addEventListener('click',()=>{const out=$('[data-speaking-result]');const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){if(out)out.textContent='التعرف على الكلام غير متاح في هذا المتصفح. اقرأ العبارة بصوت مسموع واستخدم التقييم الذاتي.';return}try{const rec=new SR();rec.lang='en-US';rec.interimResults=false;rec.maxAlternatives=1;if(out)out.textContent='جارٍ الاستماع. اسمح للمتصفح باستخدام الميكروفون إن طُلب ذلك.';rec.onresult=e=>{if(out)out.textContent=`النص الذي التقطه المتصفح: “${e.results[0][0].transcript}”. قارن النتيجة بالجملة المعروضة؛ هذا مؤشر تقريبي فقط.`};rec.onerror=e=>{if(out)out.textContent=`تعذّر التسجيل (${e.error}). يمكنك المتابعة بالتقييم الذاتي.`};rec.start()}catch{if(out)out.textContent='تعذّر بدء التسجيل. تحقق من أذونات الميكروفون.'}});
 $$('[data-self-check]').forEach(cb=>cb.addEventListener('change',()=>{const n=$$('[data-self-check]:checked').length;const out=$('[data-self-score]');if(out)out.textContent=`حددت ${n} من 4 مهارات.`}));
 $('[data-save-skills]')?.addEventListener('click',()=>{const d=getProgress();d.skillsSessions=(d.skillsSessions||0)+1;d.minutes=(d.minutes||0)+5;touchDay(d);setProgress(d);updateDashboard();toast('تم حفظ تمرين المهارات محليًا.')});
 // Inline checks inside lesson detail pages.
 $$('[data-inline-answer]').forEach(btn=>btn.addEventListener('click',()=>{const parent=btn.parentElement;$$('[data-inline-answer]',parent).forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('selected')});const note=$('[data-inline-feedback]');if(note)note.textContent=btn.dataset.correct==='true'?'صحيح! أحسنت.':'ليست هذه الإجابة؛ راجع الخيار المميز.'}));

 // Offline support (only on https / localhost)
 if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
 window.HBE={getProgress,setProgress,touchDay,toast,updateDashboard,speak:speakEnglish};

})();
