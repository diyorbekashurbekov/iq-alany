// Simon — жанған түстер тізбегін жаттап, дәл сол ретпен қайталау (жады/IQ ойыны)

const SIMON_FREQS = [329.63, 261.63, 392.0, 440.0]; // қызыл, көк, жасыл, сары

let simonSequence = [];
let simonPlayerStep = 0;
let simonAwaiting = false;
let simonTimeouts = [];
let simonAudioCtx = null;

function simonPlayTone(index) {
  if (window.Sound && window.Sound.isMuted()) return;
  try {
    if (!simonAudioCtx) simonAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = simonAudioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = SIMON_FREQS[index];
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) { /* дыбыс жоқ құрылғыларда үнсіз жалғастыра береді */ }
}

function simonSetTimeout(fn, ms) {
  const id = setTimeout(fn, ms);
  simonTimeouts.push(id);
  return id;
}

function simonClearTimeouts() {
  simonTimeouts.forEach(id => clearTimeout(id));
  simonTimeouts = [];
}

function simonUpdateStats() {
  document.getElementById('simon-level').textContent = simonSequence.length || 1;
  const best = Store.getBest('simon');
  document.getElementById('simon-best').textContent = best ? best.level : 0;
}

function simonFlashPad(index, duration = 420) {
  const pad = document.querySelectorAll('.simon-pad')[index];
  if (!pad) return;
  pad.classList.add('active');
  simonPlayTone(index);
  simonSetTimeout(() => pad.classList.remove('active'), duration * 0.7);
}

function simonPlaySequence() {
  simonAwaiting = false;
  const hint = document.getElementById('simon-hint');
  if (hint) hint.textContent = 'Қара және жатта...';
  simonSequence.forEach((step, i) => {
    simonSetTimeout(() => simonFlashPad(step), i * 550);
  });
  simonSetTimeout(() => {
    simonPlayerStep = 0;
    simonAwaiting = true;
    const h = document.getElementById('simon-hint');
    if (h) h.textContent = 'Енді өзің қайталап көр!';
  }, simonSequence.length * 550);
}

function simonNextRound() {
  simonSequence.push(Math.floor(Math.random() * 4));
  simonUpdateStats();
  simonSetTimeout(simonPlaySequence, 600);
}

function simonHandlePad(index) {
  if (!simonAwaiting) return;
  simonFlashPad(index, 250);
  if (index === simonSequence[simonPlayerStep]) {
    simonPlayerStep++;
    if (simonPlayerStep === simonSequence.length) {
      simonAwaiting = false;
      const h = document.getElementById('simon-hint');
      if (h) h.textContent = 'Дұрыс! Келесі деңгей дайындалуда...';
      simonNextRound();
    }
  } else {
    simonGameOver();
  }
}

function simonGameOver() {
  simonAwaiting = false;
  const reached = simonSequence.length;
  const best = Store.getBest('simon');
  if (!best || reached > best.level) Store.setBest('simon', { level: reached });

  if (reached >= 15) {
    Sound.play('champion');
    celebrateConfetti();
  } else {
    Sound.play('gameover');
  }

  const body = document.getElementById('simon-body');
  body.innerHTML = `
    <div class="panel result-panel">
      <div class="result-emoji">${reached >= 15 ? '🏆' : '🙂'}</div>
      <h3>Тізбек үзілді</h3>
      <p class="sub-hint">Жеткен ұзындық: ${reached} · Үздік: ${best && best.level > reached ? best.level : reached}</p>
      <div class="result-actions">
        <button class="btn btn-primary" id="simon-retry">Қайта ойнау</button>
        <button class="btn btn-ghost" data-back>← Хабқа оралу</button>
      </div>
    </div>
  `;
  document.getElementById('simon-retry').addEventListener('click', simonStartRound);
  body.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', goHub));
}

function simonRenderBoard() {
  const body = document.getElementById('simon-body');
  body.innerHTML = `
    <p class="sub-hint" id="simon-hint" style="text-align:center;">Дайын болсаң — тізбек басталады</p>
    <div class="simon-grid">
      <button class="simon-pad" data-i="0"></button>
      <button class="simon-pad" data-i="1"></button>
      <button class="simon-pad" data-i="2"></button>
      <button class="simon-pad" data-i="3"></button>
    </div>
  `;
  document.querySelectorAll('.simon-pad').forEach(pad => {
    pad.addEventListener('click', () => simonHandlePad(Number(pad.dataset.i)));
  });
}

function simonStartRound() {
  simonClearTimeouts();
  simonSequence = [];
  simonPlayerStep = 0;
  simonAwaiting = false;
  simonRenderBoard();
  simonUpdateStats();
  simonNextRound();
}

window.SimonGame = {
  start() {
    simonStartRound();
    window.ActiveGameStop = () => {
      simonClearTimeouts();
      simonAwaiting = false;
    };
  }
};
