(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const toast=(msg)=>{const el=$('[data-toast]');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.classList.remove('show'),2600)};
 let savedTheme='light';try{savedTheme=localStorage.getItem('hbe-theme')||'light'}catch{}if(savedTheme==='dark')document.body.classList.add('dark');
 $('[data-theme-toggle]')?.addEventListener('click',()=>{document.body.classList.toggle('dark');(()=>{try{localStorage.setItem('hbe-theme',document.body.classList.contains('dark')?'dark':'light')}catch{}})()});
 $('[data-menu-toggle]')?.addEventListener('click',e=>{const nav=$('#site-nav');const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open))});
 $$('[data-current-year]').forEach(el=>el.textContent=new Date().getFullYear());
 // Local progress tracker, no account or server required.
 const getProgress=()=>{try{return JSON.parse(localStorage.getItem('hbe-progress')||'{}')}catch{return {}}};
 const setProgress=p=>{try{localStorage.setItem('hbe-progress',JSON.stringify(p));return true}catch{return false}};
 const markLesson=(id)=>{const p=getProgress();p.lessons=p.lessons||[];if(!p.lessons.includes(id))p.lessons.push(id);p.minutes=(p.minutes||0)+5;p.streak=p.streak||1;setProgress(p);toast('أحسنت! تم حفظ تقدمك على هذا الجهاز.');updateDashboard()};
 $$('[data-complete-lesson]').forEach(btn=>btn.addEventListener('click',()=>markLesson(btn.dataset.completeLesson)));
 function updateDashboard(){const p=getProgress();const lessons=p.lessons||[];$$('[data-stat-lessons]').forEach(el=>el.textContent=lessons.length);$$('[data-stat-minutes]').forEach(el=>el.textContent=p.minutes||0);$$('[data-stat-streak]').forEach(el=>el.textContent=p.streak||0);$$('[data-progress-count]').forEach(el=>el.textContent=lessons.length);$$('[data-progress-bar]').forEach(el=>el.style.width=Math.min(100,lessons.length*10)+'%');}
 updateDashboard();
 // Lesson filtering
 const search=$('[data-lesson-search]'), level=$('[data-lesson-level]'), lessonCards=$$('[data-lesson-card]');
 function filterLessons(){const q=(search?.value||'').trim().toLowerCase(),l=level?.value||'all';lessonCards.forEach(c=>{const text=c.textContent.toLowerCase();c.hidden=!(text.includes(q)&&(l==='all'||c.dataset.level===l))})}
 search?.addEventListener('input',filterLessons);level?.addEventListener('change',filterLessons);
 // Flashcards
 const deck=[
 ['Hello','مرحبًا','A1'],['Good morning','صباح الخير','A1'],['Thank you','شكرًا لك','A1'],['Please','من فضلك','A1'],['How are you?','كيف حالك؟','A1'],['I understand','أنا أفهم','A1'],['Could you repeat that?','هل يمكنك إعادة ذلك؟','A2'],['I am looking for…','أنا أبحث عن…','A2'],['In my opinion','في رأيي','B1'],['It depends on…','يعتمد ذلك على…','B1'],['As far as I know','على حد علمي','B2'],['To some extent','إلى حدّ ما','B2'],['Nevertheless','مع ذلك / رغم ذلك','C1'],['Consequently','وبناءً على ذلك','C1']];
 let cardIndex=0,showTranslation=false;const word=$('[data-flash-word]'),translation=$('[data-flash-translation]'),flash=$('[data-flashcard]'),counter=$('[data-flash-counter]');
 function renderCard(){if(!word)return;word.textContent=deck[cardIndex][0];translation.textContent=showTranslation?deck[cardIndex][1]:'اضغط لإظهار المعنى';if(counter)counter.textContent=`${cardIndex+1} / ${deck.length}`;flash?.setAttribute('aria-label',showTranslation?`${deck[cardIndex][0]}: ${deck[cardIndex][1]}`:deck[cardIndex][0])}
 flash?.addEventListener('click',()=>{showTranslation=!showTranslation;renderCard()});
 $('[data-flash-next]')?.addEventListener('click',()=>{cardIndex=(cardIndex+1)%deck.length;showTranslation=false;renderCard()});
 $('[data-flash-prev]')?.addEventListener('click',()=>{cardIndex=(cardIndex-1+deck.length)%deck.length;showTranslation=false;renderCard()});renderCard();
 // Placement quiz: 20 practice questions across five guidance bands.
 const quizRoot=$('[data-placement-quiz]');
 if(quizRoot){
 const qs=[
 {q:'Choose the correct greeting.',opts:['Good morning.','Yesterday blue.','I am table.'],a:0,l:'A1'},
 {q:'Complete: I ___ a student.',opts:['is','am','are'],a:1,l:'A1'},
 {q:'Choose the correct plural of “child”.',opts:['childs','childes','children'],a:2,l:'A1'},
 {q:'Complete: She ___ happy.',opts:['are','am','is'],a:2,l:'A1'},
 {q:'Choose the correct question.',opts:['Where you live?','Where do you live?','Where are live you?'],a:1,l:'A1'},
 {q:'What is the opposite of “expensive”?',opts:['cheap','busy','heavy'],a:0,l:'A2'},
 {q:'Complete: Yesterday, we ___ to the park.',opts:['go','went','gone'],a:1,l:'A2'},
 {q:'Choose the natural sentence.',opts:['He doesn’t like coffee.','He don’t likes coffee.','He not like coffee.'],a:0,l:'A2'},
 {q:'Complete: There ___ some milk in the fridge.',opts:['are','is','be'],a:1,l:'A2'},
 {q:'Choose the polite request.',opts:['Give me water now.','Water!','Could I have some water, please?'],a:2,l:'A2'},
 {q:'Complete: I have lived here ___ 2022.',opts:['for','since','during'],a:1,l:'B1'},
 {q:'Choose the correct continuation: If it rains, …',opts:['we will stay inside.','we stayed inside tomorrow.','we staying inside.'],a:0,l:'B1'},
 {q:'“I’m looking forward to ___ you.”',opts:['see','seeing','saw'],a:1,l:'B1'},
 {q:'Choose the best connector: I was tired; ___, I finished the task.',opts:['however','because of','unless'],a:0,l:'B1'},
 {q:'What does “reliable” mean?',opts:['easy to break','able to be trusted','very expensive'],a:1,l:'B1'},
 {q:'Choose the most natural formal phrase.',opts:['Send me it fast.','I’d appreciate your response.','Gimme an answer.'],a:1,l:'B2'},
 {q:'“Despite ___ late, she joined the meeting.”',opts:['to arrive','arriving','arrived'],a:1,l:'B2'},
 {q:'Choose the correct sentence.',opts:['The results have been carefully analysed.','The results carefully has analysed.','The results has been carefully analyse.'],a:0,l:'B2'},
 {q:'“Albeit” is closest in meaning to…',opts:['because','although','as soon as'],a:1,l:'C1'},
 {q:'Choose the most precise academic wording.',opts:['This proves everything for sure.','The evidence appears to support this conclusion.','Everybody knows this is true.'],a:1,l:'C1'}
 ];let i=0,answers=Array(qs.length).fill(null),finished=false;
 const qEl=$('[data-question]'),optsEl=$('[data-options]'),step=$('[data-quiz-step]'),fill=$('[data-quiz-fill]'),next=$('[data-quiz-next]'),prev=$('[data-quiz-prev]'),result=$('.result-box',quizRoot);
 function render(){finished=false;const q=qs[i];qEl.textContent=q.q;optsEl.innerHTML='';q.opts.forEach((o,j)=>{const b=document.createElement('button');b.className='option'+(answers[i]===j?' selected':'');b.type='button';b.textContent=o;b.setAttribute('aria-pressed',String(answers[i]===j));b.addEventListener('click',()=>{answers[i]=j;render()});optsEl.appendChild(b)});step.textContent=`السؤال ${i+1} من ${qs.length}`;fill.style.width=(i/qs.length*100)+'%';prev.disabled=i===0;next.disabled=false;next.textContent=i===qs.length-1?'عرض النتيجة':'التالي';optsEl.style.display='grid';result.classList.remove('visible');result.style.display='none';prev.hidden=false;next.hidden=false;const msg=$('[data-quiz-message]');if(msg)msg.textContent=answers[i]===null?'اختر إجابة قبل المتابعة.':'تم حفظ إجابتك لهذا السؤال.'}
 function finish(){const missing=answers.findIndex(a=>a===null);if(missing!==-1){i=missing;render();const msg=$('[data-quiz-message]');if(msg)msg.textContent='أجب عن هذا السؤال أولًا.';return}finished=true;const score=answers.reduce((n,a,j)=>n+(a===qs[j].a?1:0),0);const lev=score<=4?'A1':score<=8?'A2':score<=12?'B1':score<=16?'B2':'C1';$('[data-result-score]').textContent=`${score}/${qs.length}`;$('[data-result-level]').textContent=lev;const summary=$('[data-result-summary]');if(summary)summary.textContent=score<=8?'ابدأ بالأساسيات وركز على الجمل والمفردات اليومية.':score<=15?'لديك أساس جيد؛ راجع الموضوعات الصعبة واستمر بالممارسة.':'أظهرت أداءً قويًا في هذه العينة؛ استمر في تطوير الدقة والطلاقة.';optsEl.style.display='none';result.style.display='block';result.classList.add('visible');fill.style.width='100%';step.textContent='اكتمل الاختبار';next.hidden=true;prev.hidden=true;const d=getProgress();d.quizHistory=Array.isArray(d.quizHistory)?d.quizHistory:[];d.quizHistory.push({score,total:qs.length,level:lev,date:new Date().toISOString()});d.minutes=(d.minutes||0)+10;setProgress(d);updateDashboard()}
 next.addEventListener('click',()=>{if(i<qs.length-1){if(answers[i]===null){const msg=$('[data-quiz-message]');if(msg)msg.textContent='اختر إجابة قبل المتابعة.';return}i++;render()}else finish()});prev.addEventListener('click',()=>{if(i>0){i--;render()}});$('[data-quiz-restart]')?.addEventListener('click',()=>{i=0;answers=Array(qs.length).fill(null);finished=false;render()});render();
 }
 // Contact form: static site, opens the configured mail client.
 $('[data-contact-form]')?.addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const name=$('[name="name"]',f).value.trim(),email=$('[name="email"]',f).value.trim(),message=$('[name="message"]',f).value.trim();if(!name||!email||!message){toast('يرجى إكمال الحقول المطلوبة.');return}const recipient='gnathussinbder@gmail.com';const subject=encodeURIComponent('رسالة من موقع Hussein Badr English');const body=encodeURIComponent(`الاسم: ${name}\nالبريد: ${email}\n\n${message}`);window.location.href=`mailto:${recipient}?subject=${subject}&body=${body}`;toast('سيُفتح تطبيق البريد لإرسال الرسالة.');});
 // Backup / restore progress
 $('[data-export-progress]')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(getProgress(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hussein-badr-learning-progress.json';a.click();URL.revokeObjectURL(a.href)});
 $('[data-import-progress]')?.addEventListener('change',async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!data||typeof data!=='object')throw 0;setProgress(data);updateDashboard();toast('تم استيراد نسخة التقدم.')}catch{toast('تعذّر قراءة الملف. اختر نسخة JSON صحيحة.')}});

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
 $('[data-save-skills]')?.addEventListener('click',()=>{const d=getProgress();d.skillsSessions=(d.skillsSessions||0)+1;d.minutes=(d.minutes||0)+5;setProgress(d);updateDashboard();toast('تم حفظ تمرين المهارات محليًا.')});
 // Inline checks inside lesson detail pages.
 $$('[data-inline-answer]').forEach(btn=>btn.addEventListener('click',()=>{const parent=btn.parentElement;$$('[data-inline-answer]',parent).forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('selected')});const note=$('[data-inline-feedback]');if(note)note.textContent=btn.dataset.correct==='true'?'صحيح! أحسنت.':'ليست هذه الإجابة؛ راجع الخيار المميز.'}));

})();
