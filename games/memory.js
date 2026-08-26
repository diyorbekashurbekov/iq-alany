// Жады ойыны — бірдей суреттердің жұбын тауып сәйкестендіру

const MEMORY_EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍋', '🥝', '🍍', '🥑', '🐶', '🐱', '🐰', '🦁', '🐸'];

const MEMORY_LEVELS = [
  { pairs: 3, cols: 3 },
  { pairs: 6, cols: 4 },
  { pairs: 8, cols: 4 },
  { pairs: 10, cols: 5 },
  { pairs: 15, cols: 5 },
];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MemoryState = { level: 1, moves: 0, flipped: [], matchedCount: 0, total: 0, lock: false };

function memoryUpdateStats() {
  document.getElementById('memory-level').textContent = MemoryState.level;
  document.getElementById('memory-moves').textContent = MemoryState.moves;
}

function renderMemoryLevel(level) {
  const config = MEMORY_LEVELS[level - 1];
  const emojis = shuffleArray([...MEMORY_EMOJIS].slice(0, config.pairs).concat([...MEMORY_EMOJIS].slice(0, config.pairs)));

  MemoryState.level = level;
  MemoryState.moves = 0;
  MemoryState.flipped = [];
  MemoryState.matchedCount = 0;
  MemoryState.total = emojis.length;
  MemoryState.lock = false;
  memoryUpdateStats();

  const body = document.getElementById('memory-body');
  body.innerHTML = `
    <p class="sub-hint" style="text-align:center;">Бірдей екі суретті тауып, жұптап шық</p>
    <div class="memory-grid" id="memory-grid" style="grid-template-columns: repeat(${config.cols}, 1fr);"></div>
  `;
  const grid = document.getElementById('memory-grid');
  emojis.forEach((emoji, i) => {
    const tile = document.createElement('div');
    tile.className = 'memory-tile';
    tile.dataset.value = emoji;
    tile.dataset.index = i;
    tile.textContent = '❔';
    tile.addEventListener('click', () => handleTileClick(tile));
    grid.appendChild(tile);
  });
}

function handleTileClick(tile) {
  if (MemoryState.lock) return;
  if (tile.classList.contains('revealed') || tile.classList.contains('matched')) return;

  tile.classList.add('revealed');
  tile.textContent = tile.dataset.value;
  MemoryState.flipped.push(tile);

  if (MemoryState.flipped.length === 2) {
    MemoryState.moves++;
    memoryUpdateStats();
    const [a, b] = MemoryState.flipped;
    if (a.dataset.value === b.dataset.value) {
      Sound.play('correct');
      a.classList.add('matched');
      b.classList.add('matched');
      MemoryState.flipped = [];
      MemoryState.matchedCount += 2;
      if (MemoryState.matchedCount === MemoryState.total) {
        setTimeout(memoryFinishLevel, 500);
      }
    } else {
      Sound.play('wrong');
      MemoryState.lock = true;
      setTimeout(() => {
        a.classList.remove('revealed');
        b.classList.remove('revealed');
        a.textContent = '❔';
        b.textContent = '❔';
        MemoryState.flipped = [];
        MemoryState.lock = false;
      }, 700);
    }
  }
}

function memoryFinishLevel() {
  const level = MemoryState.level;
  const isLast = level >= MEMORY_LEVELS.length;
  const best = Store.getBest('memory');
  if (!best || level > best.level) Store.setBest('memory', { level });

  if (isLast) { Sound.play('champion'); celebrateConfetti(); }
  else Sound.play('levelup');

  const body = document.getElementById('memory-body');
  body.innerHTML = `
    <div class="panel result-panel">
      <div class="result-emoji">${isLast ? '🏆' : '✅'}</div>
      <h3>${isLast ? 'Сен чемпионсың!' : `Деңгей ${level} аяқталды!`}</h3>
      <p class="sub-hint">Жұмсалған қадам: ${MemoryState.moves}</p>
      <div class="result-actions">
        ${!isLast ? `<button class="btn btn-primary" id="memory-nextlevel">Келесі деңгей →</button>` : ''}
        <button class="btn btn-ghost" data-back>← Хабқа оралу</button>
      </div>
    </div>
  `;
  if (!isLast) {
    document.getElementById('memory-nextlevel').addEventListener('click', () => renderMemoryLevel(level + 1));
  }
  body.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', goHub));
}

window.MemoryGame = {
  start() {
    renderMemoryLevel(1);
  }
};
