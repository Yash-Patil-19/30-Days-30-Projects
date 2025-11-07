(function(){
  const quotes = [
    "Practice makes progress. Keep typing to improve your speed and accuracy.",
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter.",
    "Typing well takes patience. Focus on accuracy first, then speed will follow.",
    "Build small habits: five minutes of focused typing each day can make a difference.",
    "Performance is the result of consistent practice, not one-off effort."
  ];

  const quoteEl = document.getElementById('quote');
  const input = document.getElementById('input');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const timeEl = document.getElementById('time');
  const wpmEl = document.getElementById('wpm');
  const accuracyEl = document.getElementById('accuracy');
  const errorsEl = document.getElementById('errors');
  const progressEl = document.getElementById('progress');
  const timeSelect = document.getElementById('timeSelect');
  const bestEl = document.getElementById('best');

  let duration = parseInt(timeSelect.value,10);
  let timer = null;
  let startTime = null;
  let finished = false;
  let targetText = '';

  const BEST_KEY = 'typing_best_wpm_v1';

  function pickText(){
    targetText = quotes[Math.floor(Math.random()*quotes.length)];
    quoteEl.textContent = targetText;
  }

  function formatTime(s){
    const mm = Math.floor(s/60).toString().padStart(2,'0');
    const ss = Math.max(0, Math.floor(s%60)).toString().padStart(2,'0');
    return `${mm}:${ss}`;
  }

  function updateStats(){
    const now = Date.now();
    const elapsed = Math.max(1, (now - startTime)/1000); 
    const typed = input.value;
    const charsTyped = typed.length;
    const words = charsTyped / 5;
    const minutes = elapsed/60;
    const wpm = Math.round(minutes>0 ? words / minutes : 0);

    let errors = 0;
    for(let i=0;i<typed.length;i++){
      if(typed[i] !== (targetText[i] || '')) errors++;
    }
    const correct = Math.max(0, charsTyped - errors);
    const accuracy = charsTyped === 0 ? 100 : Math.round((correct / charsTyped)*100);

    wpmEl.textContent = isFinite(wpm) ? wpm : 0;
    accuracyEl.textContent = `${accuracy}%`;
    errorsEl.textContent = errors;

    const progress = Math.min(100, Math.round((charsTyped / targetText.length)*100));
    progressEl.style.width = progress + '%';
  }

  function startTest(){
    resetTest(false);
    duration = parseInt(timeSelect.value,10);
    timeEl.textContent = formatTime(duration);
    startBtn.disabled = true;
    timeSelect.disabled = true;
    input.focus();
    startTime = Date.now();
    finished = false;

    timer = setInterval(()=>{
      const secondsPassed = Math.floor((Date.now()-startTime)/1000);
      const timeLeft = Math.max(0, duration - secondsPassed);
      timeEl.textContent = formatTime(timeLeft);
      updateStats();

      if(timeLeft <= 0){
        finishTest();
      }
    },250);
  }

  function finishTest(){
    if(finished) return;
    finished = true;
    clearInterval(timer);
    updateStats();

    const finalWpm = parseInt(wpmEl.textContent,10) || 0;
    const best = parseInt(localStorage.getItem(BEST_KEY) || '0',10);
    if(finalWpm > best){
      localStorage.setItem(BEST_KEY, finalWpm);
      bestEl.textContent = finalWpm;
    } else {
      bestEl.textContent = best || '-';
    }

    startBtn.disabled = false;
    timeSelect.disabled = false;
  }

  function resetTest(clearText=true){
    clearInterval(timer);
    startTime = null;
    finished = true;
    wpmEl.textContent = '0';
    accuracyEl.textContent = '100%';
    errorsEl.textContent = '0';
    progressEl.style.width = '0%';
    duration = parseInt(timeSelect.value,10);
    timeEl.textContent = formatTime(duration);
    startBtn.disabled = false;
    timeSelect.disabled = false;
    if(clearText) input.value = '';
    pickText();
    const best = parseInt(localStorage.getItem(BEST_KEY) || '0',10);
    bestEl.textContent = best || '-';
  }


  input.addEventListener('input', ()=>{
    if(!startTime && input.value.length>0 && !startBtn.disabled){

      startTest();
    }
    if(startTime && !finished){
      updateStats();
    }
  });

  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Tab'){
      e.preventDefault();
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = input.value.substring(0,start) + '\t' + input.value.substring(end);
      input.selectionStart = input.selectionEnd = start + 1;
    }
  });

  startBtn.addEventListener('click', startTest);
  resetBtn.addEventListener('click', ()=>resetTest(true));
  timeSelect.addEventListener('change', ()=>{
    duration = parseInt(timeSelect.value,10);
    timeEl.textContent = formatTime(duration);
  });

  resetTest(true);
})();