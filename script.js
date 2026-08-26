// Ортақ утилиталар: ойыншы аты, экрандар арасында ауысу, ұпайды сақтау

const Store = {
  getPlayer() {
    return localStorage.getItem('iqarena_player') || '';
  },
  setPlayer(name) {
    localStorage.setItem('iqarena_player', name);
  },
  getBest(gameId) {
    const key = `iqarena_best_${gameId}_${this.getPlayer()}`;
    return JSON.parse(localStorage.getItem(key) || 'null');
  },
  setBest(gameId, value) {
    const key = `iqarena_best_${gameId}_${this.getPlayer()}`;
    localStorage.setItem(key, JSON.stringify(value));
    checkAchievements();
  },
  getUnlocked() {
    const key = `iqarena_achievements_${this.getPlayer()}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  setUnlocked(list) {
    const key = `iqarena_achievements_${this.getPlayer()}`;
    localStorage.setItem(key, JSON.stringify(list));
  }
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

const GAMES = [
  {
    id: 'twenty48',
    icon: '🟩',
    title: '2048',
    desc: 'Бірдей сандарды біріктіріп, 2048 санына жет. Классикалық басқатырғыш.',
    screen: 'screen-twenty48',
    start: () => window.Twenty48Game.start()
  },
  {
    id: 'snake',
    icon: '🐍',
    title: 'Жылан',
    desc: 'Жеміс жинап, жыланды өсір. Жылдамдық деңгей сайын артады.',
    screen: 'screen-snake',
    start: () => window.SnakeGame.start()
  },
  {
    id: 'simon',
    icon: '🎨',
    title: 'Түстер тізбегі',
    desc: 'Жанған түстер тізбегін жаттап, қайталап шық. Жады сынағы!',
    screen: 'screen-simon',
    start: () => window.SimonGame.start()
  },
  {
    id: 'whack',
    icon: '🔨',
    title: 'Кроттарды ұста',
    desc: 'Жылдам саусақ, жылдам көз — кроттар шыққанда тез бас!',
    screen: 'screen-whack',
    start: () => window.WhackGame.start()
  },
  {
    id: 'numbers',
    icon: '🔢',
    title: 'Сандар логикасы',
    desc: 'Заңдылықты тауып, келесі санды тап. Деңгей сайын қиындай береді.',
    screen: 'screen-numbers',
    start: () => window.NumbersGame.start()
  },
  {
    id: 'memory',
    icon: '🧩',
    title: 'Жады ойыны',
    desc: 'Бірдей жұптарды тауып, жадыңды шыңда. Тор деңгей сайын үлкейеді.',
    screen: 'screen-memory',
    start: () => window.MemoryGame.start()
  },
  {
    id: 'geo',
    icon: '🌍',
    title: 'География шебері',
    desc: 'Елдерді, жалауларды және астаналарды таны.',
    screen: 'screen-geo',
    start: () => window.GeoGame.start()
  },
  {
    id: 'origins',
    icon: '🧭',
    title: 'Қайдан шықты?',
    desc: 'Кофе, шахмат, пицца... әрқайсысы қай елден шыққанын білесің бе?',
    screen: 'screen-origins',
    start: () => window.OriginsGame.start()
  },
  {
    id: 'world',
    icon: '🌐',
    title: 'Әлем білімі',
    desc: 'География, жануарлар, ғарыш, IT — жалпы білімің қаншалықты кең?',
    screen: 'screen-world',
    start: () => window.WorldGame.start()
  }
];

// Snake, 2048, Simon, Whack-a-mole сияқты ойындар таймер/пернетақта тыңдаушыларын
// қолданады — хабқа қайту кезінде осыларды міндетті түрде тоқтату керек (жады ағуын болдырмау үшін)
window.ActiveGameStop = null;

// ---------- Жетістіктер (achievements) ----------
const T48_CHAMPION_LEVEL = 11; // twenty48.js-тегі t48Level() 2048 санына жеткенде осы мәнге тең болады

const ACHIEVEMENTS = [
  { id: 'first_step', icon: '🥇', title: 'Алғашқы қадам', desc: 'Кез келген ойында 1-деңгейден өт', check: b => Object.values(b).some(x => x && x.level >= 1) },
  { id: 'memory_master', icon: '🧠', title: 'Жады шебері', desc: 'Түстер тізбегінде 10+ ұзындыққа жет', check: b => b.simon && b.simon.level >= 10 },
  { id: 'snake_hero', icon: '🐍', title: 'Жылан батыры', desc: 'Жыланда 5-деңгейге жет', check: b => b.snake && b.snake.level >= 5 },
  { id: 't48_winner', icon: '🟩', title: '2048 жеңімпазы', desc: '2048 санына жет', check: b => b.twenty48 && b.twenty48.level >= T48_CHAMPION_LEVEL },
  { id: 'geo_master', icon: '🌍', title: 'Жер шары', desc: 'География ойынында барлық деңгейден өт', check: b => b.geo && b.geo.level >= 6 },
  { id: 'origins_master', icon: '🧭', title: 'Әлem білгірі', desc: '"Қайдан шықты?" ойынында барлық деңгейден өт', check: b => b.origins && b.origins.level >= 6 },
  { id: 'world_master', icon: '🌐', title: 'Энциклопедист', desc: '"Әлем білімі" ойынында барлық деңгейден өт', check: b => b.world && b.world.level >= 6 },
  { id: 'whack_master', icon: '🔨', title: 'Реакция королі', desc: 'Кроттар ойынында барлық деңгейден өт', check: b => b.whack && b.whack.level >= 5 },
  { id: 'numbers_master', icon: '🔢', title: 'Логика данышпаны', desc: 'Сандар логикасында барлық деңгейден өт', check: b => b.numbers && b.numbers.level >= 8 },
  { id: 'all_star', icon: '👑', title: 'IQ чемпионы', desc: 'Барлық ойындарда кемінде 1 деңгей жеңу', check: b => GAMES.every(g => b[g.id] && b[g.id].level >= 1) },
];

function checkAchievements() {
  const bests = {};
  GAMES.forEach(g => { bests[g.id] = Store.getBest(g.id); });
  const unlocked = Store.getUnlocked();
  let changed = false;
  ACHIEVEMENTS.forEach(a => {
    if (!unlocked.includes(a.id) && a.check(bests)) {
      unlocked.push(a.id);
      changed = true;
      showAchievementToast(a);
    }
  });
  if (changed) Store.setUnlocked(unlocked);
}

function showAchievementToast(achievement) {
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <span class="achievement-toast-icon">${achievement.icon}</span>
    <div>
      <div class="achievement-toast-title">Жаңа жетістік!</div>
      <div class="achievement-toast-name">${achievement.title}</div>
    </div>
  `;
  document.body.appendChild(toast);
  Sound.play('levelup');
  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3600);
}

function renderAchievementsPanel() {
  const unlocked = Store.getUnlocked();
  const panel = document.getElementById('achievements-panel');
  if (!panel) return;
  document.getElementById('achievements-count').textContent = `${unlocked.length} / ${ACHIEVEMENTS.length}`;
  panel.innerHTML = ACHIEVEMENTS.map(a => `
    <div class="badge ${unlocked.includes(a.id) ? 'unlocked' : 'locked'}" title="${a.title} — ${a.desc}">
      <span class="badge-icon">${unlocked.includes(a.id) ? a.icon : '🔒'}</span>
      <span class="badge-title">${a.title}</span>
    </div>
  `).join('');
}

// ---------- Мерекелік конфетти анимациясы (деңгейден толық өткенде) ----------
function celebrateConfetti() {
  const colors = ['#6c8cff', '#7fd8c9', '#ffd166', '#ff8b8b', '#a78bfa'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = (Math.random() * 0.3) + 's';
    p.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3200);
  }
}

function bestLabel(gameId) {
  const best = Store.getBest(gameId);
  if (!best) return 'Әлі ойналмаған';
  return `Үздік деңгей: ${best.level}`;
}

function renderHub() {
  document.getElementById('hub-player-name').textContent = Store.getPlayer() || 'Ойыншы';
  const grid = document.getElementById('game-grid');
  grid.innerHTML = '';
  GAMES.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card game-card';
    card.innerHTML = `
      <span class="icon">${game.icon}</span>
      <h3>${game.title}</h3>
      <p>${game.desc}</p>
      <span class="best">${bestLabel(game.id)}</span>
    `;
    card.addEventListener('click', () => {
      Sound.play('click');
      showScreen(game.screen);
      game.start();
    });
    grid.appendChild(card);
  });
  renderAchievementsPanel();
  renderStatsStrip();
  const muteBtn = document.getElementById('btn-mute');
  if (muteBtn) muteBtn.textContent = Sound.isMuted() ? '🔇' : '🔊';
}

function renderStatsStrip() {
  let totalLevel = 0;
  let gamesPlayed = 0;
  GAMES.forEach(g => {
    const best = Store.getBest(g.id);
    if (best) {
      totalLevel += best.level;
      gamesPlayed++;
    }
  });
  const totalLevelEl = document.getElementById('stat-total-level');
  const gamesPlayedEl = document.getElementById('stat-games-played');
  const achievementsEl = document.getElementById('stat-achievements');
  if (totalLevelEl) totalLevelEl.textContent = totalLevel;
  if (gamesPlayedEl) gamesPlayedEl.textContent = `${gamesPlayed}/${GAMES.length}`;
  if (achievementsEl) achievementsEl.textContent = `${Store.getUnlocked().length}/${ACHIEVEMENTS.length}`;
}

function goHub() {
  if (window.ActiveGameStop) {
    window.ActiveGameStop();
    window.ActiveGameStop = null;
  }
  renderHub();
  showScreen('screen-hub');
}

// Сұрақ-жауап түріндегі ойындарға арналған ортақ қозғалтқыш
// (география, футбол сияқты ойындар осыны пайдаланады)
function createQuizGame({ gameId, bodyId, levelId, scoreId, questionsPerLevel, maxLevel, getQuestion, passRatio = 0.7 }) {
  let level = 1;
  let totalScore = 0;
  let qIndex = 0;
  let correctInLevel = 0;

  function updateStats() {
    document.getElementById(levelId).textContent = level;
    document.getElementById(scoreId).textContent = totalScore;
  }

  function renderQuestion() {
    const body = document.getElementById(bodyId);
    const q = getQuestion(level);
    body.innerHTML = `
      <div class="panel">
        <div class="sub-hint">Сұрақ ${qIndex + 1} / ${questionsPerLevel} · Деңгей ${level}</div>
        <div class="question-text">${q.question}</div>
        <div class="options-grid" id="${gameId}-options"></div>
        <div class="feedback-row" id="${gameId}-feedback"></div>
        <div style="margin-top:20px;">
          <button class="btn btn-primary" id="${gameId}-next" style="display:none">Келесі →</button>
        </div>
      </div>
    `;
    const optionsEl = document.getElementById(`${gameId}-options`);
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i, q, optionsEl));
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(i, q, optionsEl) {
    const buttons = optionsEl.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);
    const feedback = document.getElementById(`${gameId}-feedback`);
    if (i === q.correctIndex) {
      buttons[i].classList.add('correct');
      feedback.textContent = 'Дұрыс! 🎉';
      feedback.className = 'feedback-row ok';
      correctInLevel++;
      totalScore++;
      Sound.play('correct');
    } else {
      buttons[i].classList.add('wrong');
      buttons[q.correctIndex].classList.add('correct');
      feedback.textContent = 'Қате. Дұрысы белгіленді.';
      feedback.className = 'feedback-row bad';
      Sound.play('wrong');
    }
    updateStats();
    const nextBtn = document.getElementById(`${gameId}-next`);
    nextBtn.style.display = 'inline-block';
    nextBtn.addEventListener('click', advance, { once: true });
  }

  function advance() {
    qIndex++;
    if (qIndex >= questionsPerLevel) {
      finishLevel();
    } else {
      renderQuestion();
    }
  }

  function finishLevel() {
    const body = document.getElementById(bodyId);
    const passed = correctInLevel / questionsPerLevel >= passRatio;
    const isLast = level >= maxLevel;

    if (passed) {
      const best = Store.getBest(gameId);
      if (!best || level > best.level) Store.setBest(gameId, { level });
      if (isLast) { Sound.play('champion'); celebrateConfetti(); }
      else Sound.play('levelup');
    } else {
      Sound.play('gameover');
    }

    body.innerHTML = `
      <div class="panel result-panel">
        <div class="result-emoji">${passed ? (isLast ? '🏆' : '✅') : '🙂'}</div>
        <h3>${passed ? (isLast ? 'Сен чемпионсың!' : `Деңгей ${level} аяқталды!`) : `Деңгей ${level} аяқталмады`}</h3>
        <p class="sub-hint">Дұрыс жауап: ${correctInLevel} / ${questionsPerLevel}</p>
        <div class="result-actions">
          ${!passed ? `<button class="btn btn-primary" id="${gameId}-retry">Қайталап көру</button>` : ''}
          ${passed && !isLast ? `<button class="btn btn-primary" id="${gameId}-nextlevel">Келесі деңгей →</button>` : ''}
          <button class="btn btn-ghost" data-back>← Хабқа оралу</button>
        </div>
      </div>
    `;
    if (!passed) {
      document.getElementById(`${gameId}-retry`).addEventListener('click', () => beginLevel(level));
    }
    if (passed && !isLast) {
      document.getElementById(`${gameId}-nextlevel`).addEventListener('click', () => beginLevel(level + 1));
    }
    body.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', goHub));
  }

  function beginLevel(lvl) {
    level = lvl;
    qIndex = 0;
    correctInLevel = 0;
    updateStats();
    renderQuestion();
  }

  function start() {
    level = 1;
    totalScore = 0;
    beginLevel(1);
  }

  return { start };
}

document.addEventListener('DOMContentLoaded', () => {
  const existing = Store.getPlayer();
  if (existing) {
    goHub();
  }

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('player-name').value.trim();
    if (!name) return;
    Store.setPlayer(name);
    goHub();
  });

  document.getElementById('btn-change-name').addEventListener('click', () => {
    document.getElementById('player-name').value = Store.getPlayer();
    showScreen('screen-login');
  });

  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', goHub);
  });

  const muteBtn = document.getElementById('btn-mute');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const muted = Sound.toggleMute();
      muteBtn.textContent = muted ? '🔇' : '🔊';
      if (!muted) Sound.play('click');
    });
  }
});

// PWA: қолданбаны телефон/компьютерге "орнатуға" және офлайн жұмыс істеуге мүмкіндік береді.
// file:// арқылы ашқанда браузерлер service worker-ді бұғаттайды — бұл қалыпты жағдай,
// сайт https (мыс. GitHub Pages) арқылы орналастырылғанда ғана толық іске қосылады.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
