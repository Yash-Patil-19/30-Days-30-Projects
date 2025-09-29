
const rooms = [...document.querySelectorAll('.room')];
let currentRoomIndex = 0;
const maxAttempts = 6;
let attemptsLeft = maxAttempts;
let totalSeconds = 10 * 60; 

const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('progress');
const attemptsEl = document.getElementById('attempts');


attemptsEl.textContent = attemptsLeft;
updateProgress();
startTimer();


let timerInterval = null;
function startTimer(){
  renderTimer();
  timerInterval = setInterval(() => {
    totalSeconds--;
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      lockGameOver();
      return;
    }
    renderTimer();
  }, 1000);
}
function renderTimer(){
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2,'0');
  const ss = String(totalSeconds % 60).padStart(2,'0');
  timerEl.textContent = `Time: ${mm}:${ss}`;
}
function penalize(seconds){
  totalSeconds = Math.max(0, totalSeconds - seconds);
  renderTimer();
}


function showRoom(index){
  rooms.forEach((r, i)=> r.classList.toggle('active', i === index));
  currentRoomIndex = index;
  updateProgress();
}
function updateProgress(){
  progressEl.textContent = `Room ${Math.min(currentRoomIndex+1,4)} of 4`;
}


const answer1Input = document.getElementById('answer1');
const submit1 = document.getElementById('submit1');
const feedback1 = document.getElementById('feedback1');


submit1.addEventListener('click', () => {
  const val = (answer1Input.value || '').trim().toLowerCase();
  if(!val){ feedback1.textContent = 'Write something first.'; return; }
  if(val === 'echo'){
    feedback1.style.color = 'green';
    feedback1.textContent = 'Door unlocked!';
    setTimeout(()=> unlockNextRoom(), 700);
  } else {
    wrongAttempt(feedback1);
  }
});


const tiles = Array.from(document.querySelectorAll('#tiles .tile'));
const seqDisplay = document.getElementById('seqDisplay');
const clearSeqBtn = document.getElementById('clearSeq');
const submit2 = document.getElementById('submit2');
const feedback2 = document.getElementById('feedback2');
let currentSequence = [];


const targetSequence = ['⭐','🔥','🚀','🌸']; 

tiles.forEach(tile => {
  tile.addEventListener('click', () => {
    const sym = tile.dataset.symbol;
    currentSequence.push(sym);
    updateSeqDisplay();

    tile.animate([{ transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 120 });
  });
});

clearSeqBtn.addEventListener('click', () => {
  currentSequence = [];
  updateSeqDisplay();
});

submit2.addEventListener('click', () => {
  if(currentSequence.length === 0){ feedback2.textContent = 'Choose a sequence first.'; return; }

  const s = currentSequence.join(',');
  if(s === targetSequence.join(',')){
    feedback2.style.color = 'green';
    feedback2.textContent = 'Correct sequence — door unlocked!';
    setTimeout(()=> unlockNextRoom(), 700);
  } else {
    wrongAttempt(feedback2);
  }
});

function updateSeqDisplay(){
  seqDisplay.textContent = currentSequence.length ? `Sequence: ${currentSequence.join(' ')}` : 'Sequence: —';
}


const scrambled = document.getElementById('scrambled');
const answer3Input = document.getElementById('answer3');
const submit3 = document.getElementById('submit3');
const feedback3 = document.getElementById('feedback3');


const targetWord = 'park';
scrambled.textContent = 'R K A P';

submit3.addEventListener('click', () => {
  const val = (answer3Input.value || '').trim().toLowerCase();
  if(!val){ feedback3.textContent = 'Type a guess.'; return; }
  if(val === targetWord){
    feedback3.style.color = 'green';
    feedback3.textContent = 'Final lock opened!';
    setTimeout(()=> finishGame(), 800);
  } else {
    wrongAttempt(feedback3);
  }
});


const hintButtons = Array.from(document.querySelectorAll('.hint'));
hintButtons.forEach(btn=>{
  btn.addEventListener('click', (e) => {
    const roomId = Number(btn.dataset.room);
    giveHint(roomId);
  });
});
function giveHint(room){
  penalize(30);
  if(room === 1){
    feedback1.style.color = '#b45309';
    feedback1.textContent = 'Hint: You hear this when you shout in a canyon.';
  } else if(room === 2){
    feedback2.style.color = '#b45309';
    feedback2.textContent = 'Hint: Think of an order: star, fire, rocket, flower.';
  } else if(room === 3){
    feedback3.style.color = '#b45309';
    feedback3.textContent = 'Hint: The place where cars rest (4 letters).';
  }
}


function wrongAttempt(feedbackEl){
  attemptsLeft = Math.max(0, attemptsLeft - 1);
  attemptsEl.textContent = attemptsLeft;
  penalize(12);
  feedbackEl.style.color = '#dc2626';
  feedbackEl.textContent = 'Incorrect. Try again.';
  if(attemptsLeft <= 0) {
    lockGameOver();
  }
}


function unlockNextRoom(){
  const nextIndex = currentRoomIndex + 1;
  if(nextIndex < rooms.length - 1) {
    showRoom(nextIndex);
  } else {
    finishGame();
  }
}

function finishGame(){
  clearInterval(timerInterval);
  showRoom(3); 
  progressEl.textContent = 'Escaped!';
  timerEl.textContent = 'Time: —';
  const finalCard = document.querySelector('#room-4 .card');
  finalCard.insertAdjacentHTML('beforeend','<p style="margin-top:14px;font-weight:700;color:#047857">Congratulations — you solved it!</p>');
}


function lockGameOver(){

  clearInterval(timerInterval);
  alert('Time or attempts exhausted. Game over. Press Restart to try again.');

  showRoom(3);
  const finalCard = document.querySelector('#room-4 .card');
  finalCard.insertAdjacentHTML('beforeend','<p style="margin-top:14px;font-weight:700;color:#b91c1c">Game over. Try again.</p>');
}


document.getElementById('reset').addEventListener('click', resetCurrentRoom);
document.getElementById('restart').addEventListener('click', restartGame);

function resetCurrentRoom(){

  if(currentRoomIndex === 0){
    answer1Input.value = '';
    feedback1.textContent = '';
  } else if(currentRoomIndex === 1){
    currentSequence = [];
    updateSeqDisplay();
    feedback2.textContent = '';
  } else if(currentRoomIndex === 2){
    answer3Input.value = '';
    feedback3.textContent = '';
  }
}

function restartGame(){

  attemptsLeft = maxAttempts;
  attemptsEl.textContent = attemptsLeft;
  totalSeconds = 10 * 60;

  answer1Input.value = '';
  feedback1.textContent = '';
  currentSequence = [];
  updateSeqDisplay();
  feedback2.textContent = '';
  answer3Input.value = '';
  feedback3.textContent = '';
 
  showRoom(0);

  if(timerInterval) clearInterval(timerInterval);
  startTimer();
}


document.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    if(currentRoomIndex === 0) submit1.click();
    else if(currentRoomIndex === 1) submit2.click();
    else if(currentRoomIndex === 2) submit3.click();
  }
});
