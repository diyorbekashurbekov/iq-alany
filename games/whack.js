// Кроттарды ұста — реакция мен зейінді дамытатын жылдамдық ойыны

const WHACK_LEVELS = [
  { duration: 15, moleUp: 950, target: 8 },
  { duration: 15, moleUp: 800, target: 10 },
  { duration: 15, moleUp: 680, target: 12 },
  { duration: 15, moleUp: 560, target: 14 },
  { duration: 15, moleUp: 450, target: 16 },
];
const WHACK_HOLES = 9;

let whackLevel = 1;
let whackScore = 0;
let whackTimeLeft = 0;
let whackSpawnId = null;
let whackTickId = null;
let whackHideTimeouts = {};
let whackActiveHole = -1;

function whackUpdateStats() {
  document.getElementById('whack-level').textContent = whackLevel;
  document.getElementById('whack-score').textContent = whackScore;
  document.getElementById('whack-time').textContent = whackTimeLeft;
}

function whackRenderBoard() {
  const config = WHACK_LEVELS[whackLevel - 1];
  const body = document.getElementById('whack-body');
  body.innerHTML = `
    <p class="sub-hint" style="text-align:center;">Мақсат: ${config.target} ұпай жинау · Кроттар шыққанда тез бас!</p>
    <div class="whack-grid" id="whack-grid"></div>
  `;
  const grid = document.getElementById('whack-grid');
  for (let i = 0; i < WHACK_HOLES; i++) {
    const hole = document.createElement('div');
    hole.className = 'whack-hole';
    hole.dataset.index = i;
    hole.innerHTML = '<span class="mole">🐹</span>';
    hole.addEventListener('click', () => whackHit(i));
    grid.appendChild(hole);
  }
}

function whackSpawnMole() {
  const holes = document.querySelectorAll('.whack-hole');
  const emptyIndexes = [...holes].map((h, i) => i).filter(i => !holes[i].classList.contains('up'));
  if (emptyIndexes.length === 0) return;
  const idx = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  const config = WHACK_LEVELS[whackLevel - 1];
  holes[idx].classList.add('up');
  whackHideTimeouts[idx] = setTimeout(() => {
    holes[idx].classList.remove('up');
    delete whackHideTimeouts[idx];
  }, config.moleUp * 0.85);
}

function whackHit(index) {
  const hole = document.querySelectorAll('.whack-hole')[index];
  if (!hole.classList.contains('up')) return;
  hole.classList.remove('up');
  hole.classList.add('hit');
  setTimeout(() => hole.classList.remove('hit'), 200);
  if (whackHideTimeouts[index]) {
    clearTimeout(whackHideTimeouts[index]);
    delete whackHideTimeouts[index];
  }
  whackScore++;
  Sound.play('click');
  whackUpdateStats();
}

function whackTick() {
  whackTimeLeft--;
  whackUpdateStats();
  if (whackTimeLeft <= 0) whackEndRound();
}

function whackEndRound() {
  clearInterval(whackSpawnId);
  clearInterval(whackTickId);
  Object.values(whackHideTimeouts).forEach(id => clearTimeout(id));
  whackHideTimeouts = {};

  const config = WHACK_LEVELS[whackLevel - 1];
  const passed = whackScore >= config.target;
  const isLast = whackLevel >= WHACK_LEVELS.length;

  if (passed) {
    const best = Store.getBest('whack');
    if (!best || whackLevel > best.level) Store.setBest('whack', { level: whackLevel });
    if (isLast) { Sound.play('champion'); celebrateConfetti(); }
    else Sound.play('levelup');
  } else {
    Sound.play('gameover');
  }

  const body = document.getElementById('whack-body');
  body.innerHTML = `
    <div class="panel result-panel">
      <div class="result-emoji">${passed ? (isLast ? '🏆' : '✅') : '🙂'}</div>
      <h3>${passed ? (isLast ? 'Сен чемпионсың!' : `Деңгей ${whackLevel} аяқталды!`) : `Деңгей ${whackLevel} аяқталмады`}</h3>
      <p class="sub-hint">Ұпай: ${whackScore} / мақсат ${config.target}</p>
      <div class="result-actions">
        ${!passed ? `<button class="btn btn-primary" id="whack-retry">Қайталап көру</button>` : ''}
        ${passed && !isLast ? `<button class="btn btn-primary" id="whack-nextlevel">Келесі деңгей →</button>` : ''}
        <button class="btn btn-ghost" data-back>← Хабқа оралу</button>
      </div>
    </div>
  `;
  if (!passed) {
    document.getElementById('whack-retry').addEventListener('click', () => whackStartLevel(whackLevel));
  }
  if (passed && !isLast) {
    document.getElementById('whack-nextlevel').addEventListener('click', () => whackStartLevel(whackLevel + 1));
  }
  body.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', goHub));
}

function whackStartLevel(level) {
  whackLevel = level;
  whackScore = 0;
  whackTimeLeft = WHACK_LEVELS[level - 1].duration;
  whackHideTimeouts = {};
  whackRenderBoard();
  whackUpdateStats();

  clearInterval(whackSpawnId);
  clearInterval(whackTickId);
  whackSpawnId = setInterval(whackSpawnMole, WHACK_LEVELS[level - 1].moleUp);
  whackTickId = setInterval(whackTick, 1000);
}

window.WhackGame = {
  start() {
    whackStartLevel(1);
    window.ActiveGameStop = () => {
      clearInterval(whackSpawnId);
      clearInterval(whackTickId);
      Object.values(whackHideTimeouts).forEach(id => clearTimeout(id));
      whackHideTimeouts = {};
    };
  }
};
