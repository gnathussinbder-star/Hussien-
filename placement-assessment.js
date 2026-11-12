/* Hussein Badr English – Placement Assessment v1.0 prototype
   Front-end only: no server, reviewer portal, final CEFR decision, or certificate issuance. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const sections = [
    { id: 'listening', name: 'الاستماع Listening', tag: 'LISTENING', desc: 'استمع إلى المقطع الصوتي ثم اختر الإجابة الأدق.', items: [
      { level: 'Pre-A1', audio: 'Hello. My name is Sara.', q: 'What is the speaker’s name?', opts: ['Sara', 'Sarah’s teacher', 'Sally'], a: 0 },
      { level: 'A1', audio: 'The class starts at eight thirty in the morning.', q: 'When does the class start?', opts: ['8:00', '8:30', '9:30'], a: 1 },
      { level: 'A1', audio: 'David usually walks to school, but today his father is driving him.', q: 'How is David going to school today?', opts: ['By bus', 'On foot', 'By car'], a: 2 },
      { level: 'A2', audio: 'At the café: “Could I have a cup of tea and a cheese sandwich, please?” “Of course. Anything else?” “No, thank you.”', q: 'What does the customer order?', opts: ['Coffee and cake', 'Tea and a cheese sandwich', 'Juice and a salad'], a: 1 },
      { level: 'A2', audio: 'Attention passengers. The train to Manchester will now leave from platform number three, not platform number five.', q: 'Which platform should passengers use?', opts: ['Platform 2', 'Platform 3', 'Platform 5'], a: 1 },
      { level: 'B1', audio: 'Maya planned to take the earlier bus, but it was cancelled. She decided to work from the library until the next one arrived.', q: 'Why did Maya go to the library?', opts: ['Her meeting was at the library', 'Her bus was cancelled', 'She had forgotten her books'], a: 1 },
      { level: 'B1', audio: 'The museum is free on the first Sunday of each month. On other days, visitors need to buy a ticket online or at the entrance.', q: 'When can visitors enter without paying?', opts: ['Every Sunday', 'The first Sunday of each month', 'Every first day of the week'], a: 1 },
      { level: 'B2', audio: 'Although the report was completed on time, the manager postponed the presentation because the financial figures still needed independent verification.', q: 'Why was the presentation postponed?', opts: ['The report was late', 'The figures needed checking', 'The manager was unavailable'], a: 1 },
      { level: 'B2', audio: 'The speaker argues that remote work can improve concentration, provided that teams agree on clear communication routines and realistic deadlines.', q: 'What condition does the speaker emphasize?', opts: ['Employees must work longer hours', 'Teams need clear routines and deadlines', 'Offices should be closed permanently'], a: 1 },
      { level: 'C1', audio: 'The proposal is not without merit; nevertheless, its projected savings depend on assumptions that have yet to be tested under ordinary operating conditions.', q: 'What is the speaker’s main reservation?', opts: ['The proposal has no advantages', 'The projected savings rely on untested assumptions', 'The operating costs are already known to be lower'], a: 1 }
    ]},
    { id: 'reading', name: 'القراءة Reading', tag: 'READING', desc: 'اقرأ النص القصير ثم أجب عن السؤال المرتبط به.', items: [
      { level: 'Pre-A1', passage: 'Lina has a cat. Its name is Mimi. The cat is white.', q: 'What colour is Mimi?', opts: ['Black', 'White', 'Brown'], a: 1 },
      { level: 'A1', passage: 'Omar gets up at seven. He eats breakfast and walks to work. He starts work at eight.', q: 'How does Omar go to work?', opts: ['By car', 'By train', 'On foot'], a: 2 },
      { level: 'A1', passage: 'The small shop sells bread, milk, fruit and water. It closes at six in the evening.', q: 'When does the shop close?', opts: ['At six in the evening', 'At seven in the morning', 'At noon'], a: 0 },
      { level: 'A2', passage: 'Nora wanted to buy a new phone, but she decided to wait because her current phone still worked well. She saved the money for a short trip instead.', q: 'Why did Nora postpone buying a phone?', opts: ['The shop was closed', 'Her current phone was still working', 'She lost her money'], a: 1 },
      { level: 'A2', passage: 'The community centre offers free exercise classes on Tuesday and Thursday evenings. Participants should bring comfortable clothes and a bottle of water.', q: 'What should participants bring?', opts: ['A notebook and a pen', 'Sports equipment supplied by the centre', 'Comfortable clothes and water'], a: 2 },
      { level: 'B1', passage: 'A local library has extended its opening hours during exam season. The change was introduced after students reported that the previous schedule did not give them enough quiet study time.', q: 'What led to the change in opening hours?', opts: ['Requests from students', 'A shortage of books', 'A new building contract'], a: 0 },
      { level: 'B1', passage: 'Many people assume that learning a language requires long study sessions. However, short and regular practice can be more manageable and may help learners maintain a consistent routine.', q: 'What is the main point of the passage?', opts: ['Long sessions are always necessary', 'Regular short practice can be useful', 'Language learning should be avoided during busy periods'], a: 1 },
      { level: 'B2', passage: 'The company introduced a four-day working week on a trial basis. Productivity remained stable, while employee satisfaction increased. The management team cautioned, however, that the results might not apply equally to every department.', q: 'Why is the conclusion limited?', opts: ['The trial was cancelled', 'Productivity fell sharply', 'Different departments may respond differently'], a: 2 },
      { level: 'B2', passage: 'Public transport improvements are often evaluated by passenger numbers alone. Yet accessibility, reliability and the effect on journey times can be equally important when assessing whether a service meets residents’ needs.', q: 'Which idea does the writer emphasize?', opts: ['Passenger numbers are the only useful measure', 'Several factors should be considered', 'Journey times are unrelated to service quality'], a: 1 },
      { level: 'C1', passage: 'While the study offers persuasive evidence of a correlation, its observational design precludes a confident claim that the intervention itself caused the observed change. Further research would be needed to rule out plausible alternative explanations.', q: 'What limitation does the passage identify?', opts: ['The study cannot establish causation with confidence', 'The study found no relationship at all', 'The intervention was never examined'], a: 0 }
    ]},
    { id: 'grammar', name: 'القواعد Grammar', tag: 'GRAMMAR', desc: 'اختر الصياغة الصحيحة أو الأنسب للسياق.', items: [
      { level: 'Pre-A1', q: 'Choose the correct sentence.', opts: ['I am happy.', 'I is happy.', 'I are happy.'], a: 0 },
      { level: 'A1', q: 'She ___ two brothers.', opts: ['have', 'has', 'having'], a: 1 },
      { level: 'A1', q: 'They ___ at home yesterday.', opts: ['was', 'were', 'are'], a: 1 },
      { level: 'A2', q: 'We ___ dinner when the phone rang.', opts: ['were having', 'have', 'are having'], a: 0 },
      { level: 'A2', q: 'There isn’t ___ sugar left.', opts: ['many', 'a few', 'much'], a: 2 },
      { level: 'B1', q: 'I have worked here ___ 2021.', opts: ['since', 'for', 'during'], a: 0 },
      { level: 'B1', q: 'If I ___ enough time, I would take another course.', opts: ['have', 'had', 'will have'], a: 1 },
      { level: 'B2', q: 'The applications ___ by the committee next week.', opts: ['will review', 'will be reviewed', 'are reviewing'], a: 1 },
      { level: 'B2', q: 'Despite ___ tired, he completed the assignment.', opts: ['being', 'was', 'to be'], a: 0 },
      { level: 'C1', q: 'Hardly ___ the announcement when the audience began to ask questions.', opts: ['had she finished', 'she had finished', 'did she finished'], a: 0 }
    ]},
    { id: 'vocabulary', name: 'المفردات والاستخدام Vocabulary & Usage', tag: 'VOCABULARY', desc: 'اختر الكلمة أو العبارة الأنسب للمعنى والسياق.', items: [
      { level: 'Pre-A1', q: 'Which word means the opposite of “hot”?', opts: ['Cold', 'Tall', 'Fast'], a: 0 },
      { level: 'A1', q: 'You use a ___ to tell the time.', opts: ['clock', 'plate', 'window'], a: 0 },
      { level: 'A1', q: 'Choose the correct word: “I am ___ of dogs.” (I feel afraid.)', opts: ['afraid', 'hungry', 'empty'], a: 0 },
      { level: 'A2', q: 'The opposite of “arrive” is…', opts: ['borrow', 'leave', 'follow'], a: 1 },
      { level: 'A2', q: 'Choose the natural collocation.', opts: ['make a decision', 'do a decision', 'build a decision'], a: 0 },
      { level: 'B1', q: 'A “reliable” person is someone you can…', opts: ['trust', 'avoid', 'interrupt'], a: 0 },
      { level: 'B1', q: '“Put off a meeting” means…', opts: ['cancel or postpone it', 'prepare the room', 'attend it early'], a: 0 },
      { level: 'B2', q: 'Choose the closest meaning of “substantial” in “a substantial improvement”.', opts: ['Very small', 'Important or considerable', 'Temporary and uncertain'], a: 1 },
      { level: 'B2', q: 'Which phrase is most appropriate in a formal email?', opts: ['Give me the details.', 'I would appreciate further information.', 'Send it over, okay?'], a: 1 },
      { level: 'C1', q: '“The evidence is compelling” means the evidence is…', opts: ['convincing and persuasive', 'irrelevant and incomplete', 'deliberately misleading'], a: 0 }
    ]}
  ];
  const questions = sections.flatMap(s => s.items.map((q, idx) => ({ ...q, sectionId: s.id, sectionName: s.name, sectionTag: s.tag, sectionDesc: s.desc, localIndex: idx + 1 })));
  const DRAFT_KEY = 'hbe-placement-assessment-draft-v1';
  const $intro = $('#pa-intro'), $quiz = $('#pa-quiz'), $writing = $('#pa-writing'), $speaking = $('#pa-speaking'), $result = $('#pa-result');
  let learnerName = '', answers = Array(questions.length).fill(null), index = 0, writingText = '', audioBlob = null, audioFileName = '', mediaRecorder = null, audioChunks = [], recordTimer = null, recordSeconds = 0, audioUrl = '';
  const show = (el) => { [$intro, $quiz, $writing, $speaking, $result].forEach(x => x.hidden = x !== el); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const notify = (msg) => { const el = $('[data-toast]'); if (!el) return; el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2800); };
  const wordCount = (s) => (String(s).trim().match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
  const draft = () => ({ version: 1, learnerName, answers, index, stage: !$quiz.hidden ? 'quiz' : !$writing.hidden ? 'writing' : !$speaking.hidden ? 'speaking' : 'intro', writingText, savedAt: new Date().toISOString() });
  const saveDraft = () => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft())); } catch (_) {} };
  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch (_) {} };
  const loadDraft = () => { try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); return d && d.version === 1 && Array.isArray(d.answers) ? d : null; } catch (_) { return null; } };
  const resumeBtn = $('#pa-resume');
  if (loadDraft()) resumeBtn.hidden = false;
  $('#pa-name').addEventListener('input', e => { learnerName = e.target.value.trim(); $('#pa-start').disabled = !learnerName || !$('#pa-consent').checked; });
  $('#pa-consent').addEventListener('change', e => { $('#pa-start').disabled = !$('#pa-name').value.trim() || !e.target.checked; });
  $('#pa-start').addEventListener('click', () => { learnerName = $('#pa-name').value.trim(); if (!learnerName || !$('#pa-consent').checked) return; answers = Array(questions.length).fill(null); index = 0; writingText = ''; saveDraft(); renderQuestion(); show($quiz); });
  resumeBtn.addEventListener('click', () => { const d = loadDraft(); if (!d) return; learnerName = String(d.learnerName || ''); answers = d.answers.slice(0, questions.length); while (answers.length < questions.length) answers.push(null); index = Math.max(0, Math.min(questions.length - 1, Number(d.index) || 0)); writingText = String(d.writingText || ''); $('#pa-name').value = learnerName; $('#pa-writing-answer').value = writingText; updateWordCount(); if (d.stage === 'writing') show($writing); else if (d.stage === 'speaking') { show($speaking); $('#pa-recorder-message').textContent = 'تمت استعادة النص والإجابات. التسجيل الصوتي لا يمكن استعادته من المسودة؛ سجّل إجابة جديدة أو اختر ملفًا.'; } else { renderQuestion(); show($quiz); } });

  function renderMap() {
    const map = $('#pa-question-map'); map.innerHTML = '';
    questions.forEach((q, n) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'pa-map-btn' + (answers[n] !== null ? ' answered' : '') + (n === index ? ' current' : ''); b.textContent = String(n + 1); b.setAttribute('aria-label', `الانتقال إلى السؤال ${n + 1}`); b.addEventListener('click', () => { index = n; renderQuestion(); }); map.appendChild(b); });
  }
  function renderQuestion() {
    const q = questions[index], section = sections.find(s => s.id === q.sectionId);
    $('#pa-section-title').textContent = section.name;
    $('#pa-section-desc').textContent = section.desc;
    $('#pa-counter').textContent = `السؤال ${index + 1} من ${questions.length}`;
    const pct = Math.round(index / questions.length * 100);
    $('#pa-progress-percent').textContent = `${pct}%`;
    $('#pa-progress-fill').style.width = `${pct}%`;
    $('#pa-skill-tag').textContent = q.sectionTag;
    $('#pa-level-tag').textContent = q.level;
    $('#pa-question').textContent = q.q;
    const passage = $('#pa-passage'); passage.hidden = !q.passage; passage.textContent = q.passage || '';
    const audioBox = $('#pa-audio-box'); audioBox.hidden = !q.audio; $('#pa-audio-status').textContent = '';
    $('#pa-play-audio').dataset.audio = q.audio || '';
    const opts = $('#pa-options'); opts.innerHTML = '';
    q.opts.forEach((option, n) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'pa-option'; b.setAttribute('aria-pressed', String(answers[index] === n)); const k = document.createElement('span'); k.className = 'pa-option-key'; k.textContent = String.fromCharCode(65 + n); const t = document.createElement('span'); t.textContent = option; b.append(k, t); b.addEventListener('click', () => { answers[index] = n; saveDraft(); renderQuestion(); $('#pa-question-message').textContent = 'تم حفظ إجابتك على هذا الجهاز.'; }); opts.appendChild(b); });
    $('#pa-prev').disabled = index === 0; $('#pa-next').textContent = index === questions.length - 1 ? 'الانتقال إلى الكتابة' : 'التالي';
    $('#pa-question-message').textContent = answers[index] === null ? 'اختر إجابة للمتابعة. يمكنك التنقل بين الأسئلة ومراجعتها.' : 'تم اختيار إجابة لهذا السؤال.';
    renderMap();
  }
  $('#pa-play-audio').addEventListener('click', () => {
    const text = $('#pa-play-audio').dataset.audio;
    if (!text) return;
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { $('#pa-audio-status').textContent = 'الصوت التلقائي غير مدعوم في هذا المتصفح.'; return; }
    window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; utterance.rate = 0.88;
    const voices = window.speechSynthesis.getVoices(); const voice = voices.find(v => /^en-US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)); if (voice) utterance.voice = voice;
    utterance.onstart = () => $('#pa-audio-status').textContent = 'يعمل المقطع الصوتي…'; utterance.onend = () => $('#pa-audio-status').textContent = 'انتهى المقطع.'; utterance.onerror = () => $('#pa-audio-status').textContent = 'تعذّر تشغيل الصوت.'; window.speechSynthesis.speak(utterance);
  });
  $('#pa-prev').addEventListener('click', () => { if (index > 0) { index--; saveDraft(); renderQuestion(); } });
  $('#pa-next').addEventListener('click', () => {
    if (answers[index] === null) { $('#pa-question-message').textContent = 'اختر إجابة قبل المتابعة.'; return; }
    if (index < questions.length - 1) { index++; saveDraft(); renderQuestion(); }
    else { const missing = answers.findIndex(a => a === null); if (missing !== -1) { index = missing; renderQuestion(); $('#pa-question-message').textContent = 'توجد أسئلة غير مجابة. أكملها قبل الانتقال.'; return; } saveDraft(); show($writing); $('#pa-writing-answer').focus(); }
  });

  $('#pa-writing-answer').addEventListener('input', e => { writingText = e.target.value; updateWordCount(); saveDraft(); });
  function updateWordCount() { $('#pa-word-count').textContent = wordCount($('#pa-writing-answer').value); }
  $('#pa-writing-back').addEventListener('click', () => { writingText = $('#pa-writing-answer').value; saveDraft(); index = questions.length - 1; renderQuestion(); show($quiz); });
  $('#pa-writing-next').addEventListener('click', () => { writingText = $('#pa-writing-answer').value.trim(); if (writingText.length < 30) { $('#pa-writing-message').textContent = 'اكتب إجابة أطول قليلًا حتى يتمكن المراجع من تقييمها.'; return; } saveDraft(); show($speaking); });

  const recordStart = $('#pa-record-start'), recordStop = $('#pa-record-stop'), recordDownload = $('#pa-record-download'), audioPreview = $('#pa-audio-preview');
  function setAudio(blob, filename) { audioBlob = blob; audioFileName = filename || 'speaking-response'; if (audioUrl) URL.revokeObjectURL(audioUrl); audioUrl = URL.createObjectURL(blob); audioPreview.src = audioUrl; audioPreview.hidden = false; recordDownload.disabled = false; $('#pa-submit').disabled = false; $('#pa-recorder-message').textContent = 'تم تجهيز التسجيل على هذا الجهاز. تذكّر تنزيله وإرفاقه عند إرسال ملف الإجابات للمراجعة.'; }
  function fmtTime(n) { return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`; }
  recordStart.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { $('#pa-recorder-message').textContent = 'التسجيل المباشر غير مدعوم في هذا المتصفح. استخدم خيار اختيار ملف صوتي من الجهاز.'; return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); audioChunks = [];
      const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? { mimeType: 'audio/webm;codecs=opus' } : undefined;
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.ondataavailable = e => { if (e.data && e.data.size) audioChunks.push(e.data); };
      mediaRecorder.onstop = () => { const type = mediaRecorder.mimeType || 'audio/webm'; const blob = new Blob(audioChunks, { type }); setAudio(blob, `hussein-badr-speaking-${Date.now()}.webm`); stream.getTracks().forEach(t => t.stop()); clearInterval(recordTimer); $('#pa-record-indicator').classList.remove('live'); $('#pa-record-status').textContent = 'اكتمل التسجيل'; recordStart.disabled = false; recordStop.disabled = true; };
      mediaRecorder.start(); recordSeconds = 0; $('#pa-record-time').textContent = fmtTime(recordSeconds); $('#pa-record-indicator').classList.add('live'); $('#pa-record-status').textContent = 'جارٍ التسجيل'; recordStart.disabled = true; recordStop.disabled = false; recordDownload.disabled = true; $('#pa-submit').disabled = true;
      recordTimer = setInterval(() => { recordSeconds++; $('#pa-record-time').textContent = fmtTime(recordSeconds); if (recordSeconds >= 180 && mediaRecorder?.state === 'recording') mediaRecorder.stop(); }, 1000);
    } catch (err) { $('#pa-recorder-message').textContent = 'لم نتمكن من الوصول إلى الميكروفون. تحقق من إذن المتصفح أو اختر ملفًا صوتيًا جاهزًا.'; }
  });
  recordStop.addEventListener('click', () => { if (mediaRecorder?.state === 'recording') mediaRecorder.stop(); });
  function downloadAudio() { if (!audioBlob) return; const url = URL.createObjectURL(audioBlob); const a = document.createElement('a'); a.href = url; a.download = audioFileName || 'speaking-response.webm'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); }
  recordDownload.addEventListener('click', downloadAudio);
  $('#pa-audio-file').addEventListener('change', e => { const f = e.target.files?.[0]; if (!f) return; setAudio(f, f.name); $('#pa-record-status').textContent = 'تم اختيار ملف صوتي'; $('#pa-record-time').textContent = '—'; });
  $('#pa-speaking-back').addEventListener('click', () => { saveDraft(); show($writing); });

  function buildReport() {
    const scores = sections.map(s => { const start = questions.findIndex(q => q.sectionId === s.id); const correct = s.items.reduce((n, q, i) => n + (answers[start + i] === q.a ? 1 : 0), 0); return { id: s.id, name: s.name, score: correct, total: s.items.length, percent: Math.round(correct / s.items.length * 100) }; });
    const date = new Date(); $('#pa-result-name').textContent = learnerName; $('#pa-result-date').textContent = date.toLocaleString('ar-IQ');
    const results = $('#pa-skill-results'); results.innerHTML = '';
    scores.forEach(s => { const row = document.createElement('article'); row.className = 'pa-skill-row'; const head = document.createElement('div'); head.className = 'pa-skill-row-head'; const name = document.createElement('span'); name.textContent = s.name; const score = document.createElement('span'); score.textContent = `${s.score}/${s.total}`; head.append(name, score); const track = document.createElement('div'); track.className = 'pa-skill-track'; const fill = document.createElement('span'); fill.style.width = `${s.percent}%`; track.appendChild(fill); row.append(head, track); results.appendChild(row); });
    $('#pa-speaking-result-status').textContent = audioBlob ? 'يوجد تسجيل صوتي محلي — بانتظار المراجعة البشرية.' : 'لم يتم إرفاق تسجيل؛ لا يمكن إكمال المراجعة.';
    $('#pa-download-audio-final').hidden = !audioBlob;
    return { scores, date: date.toISOString() };
  }
  let finalSubmission = null;
  function exportAnswers() {
    if (!finalSubmission) return;
    const blob = new Blob([JSON.stringify(finalSubmission, null, 2)], { type: 'application/json;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `HBE-placement-submission-${Date.now()}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  $('#pa-submit').addEventListener('click', () => {
    writingText = $('#pa-writing-answer').value.trim(); if (writingText.length < 30) { $('#pa-recorder-message').textContent = 'أكمل مهمة الكتابة أولًا قبل تسليم المحاولة.'; show($writing); $('#pa-writing-message').textContent = 'اكتب إجابة أطول قليلًا.'; return; }
    if (!audioBlob) { $('#pa-recorder-message').textContent = 'سجّل إجابة أو اختر ملفًا صوتيًا قبل إنهاء الاختبار.'; return; }
    const { scores, date } = buildReport();
    finalSubmission = { product: 'Hussein Badr English Placement Assessment', version: 'Prototype 1.0', status: 'PRELIMINARY_PENDING_HUMAN_REVIEW', learnerName, completedAt: date, objectiveScores: scores, writing: writingText, speakingFileName: audioFileName, answers: questions.map((q, i) => ({ questionNumber: i + 1, section: q.sectionId, selectedOption: answers[i] === null ? null : answers[i] + 1 })), notice: 'Front-end prototype. Not uploaded to a server. No final CEFR level or certificate has been issued.' };
    clearDraft(); show($result);
  });
  $('#pa-print').addEventListener('click', () => window.print());
  $('#pa-export').addEventListener('click', exportAnswers);
  $('#pa-download-audio-final').addEventListener('click', downloadAudio);
  $('#pa-new-attempt').addEventListener('click', () => { if (!confirm('هل تريد بدء محاولة تجريبية جديدة؟ سيُعاد ضبط الإجابات الحالية على هذا الجهاز.')) return; learnerName = ''; answers = Array(questions.length).fill(null); index = 0; writingText = ''; audioBlob = null; audioFileName = ''; finalSubmission = null; $('#pa-name').value = ''; $('#pa-consent').checked = false; $('#pa-start').disabled = true; $('#pa-writing-answer').value = ''; $('#pa-audio-file').value = ''; audioPreview.removeAttribute('src'); audioPreview.hidden = true; recordDownload.disabled = true; $('#pa-submit').disabled = true; $('#pa-record-status').textContent = 'جاهز للتسجيل'; $('#pa-record-time').textContent = '00:00'; resumeBtn.hidden = true; clearDraft(); updateWordCount(); show($intro); });
})();
