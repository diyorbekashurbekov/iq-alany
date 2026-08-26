// 2048 — бірдей сандарды біріктіріп, үлкен санға жету

const T48_SIZE = 4;
const T48_MILESTONES = [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
const T48_COLORS = {
  2: '#eef2ff', 4: '#e0e7ff', 8: '#c7d2fe', 16: '#a5b4fc',
  32: '#93c5fd', 64: '#60a5fa', 128: '#fcd34d', 256: '#fbbf24',
  512: '#f59e0b', 1024: '#f97316', 2048: '#ef4444'
};

let t48Board = [];
let t48Score = 0;
let t48KeyHandler = null;
let t48TouchStart = null;

function t48EmptyBoard() {
  return Array.from({ length: T48_SIZE }, () => Array(T48_SIZE).fill(0));
}

function t48SpawnTile() {
  const empty = [];
  for (let r = 0; r < T48_SIZE; r++) {
    for (let c = 0; c < T48_SIZE; c++) {
      if (t48Board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  t48Board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function t48SlideRow(row) {
  const vals = row.filter(v => v !== 0);
  let gained = 0;
  for (let i = 0; i < vals.length - 1; i++) {
    if (vals[i] === vals[i + 1]) {
      vals[i] *= 2;
      gained += vals[i];
      vals.splice(i + 1, 1);
    }
  }
  while (vals.length < T48_SIZE) vals.push(0);
  return { row: vals, gained };
}

function t48Transpose(board) {
  return board[0].map((_, c) => board.map(row => row[c]));
}

function t48Move(direction) {
  let board = t48Board.map(r => [...r]);
  let rotated = false, reversed = false;

  if (direction === 'up' || direction === 'down') {
    board = t48Transpose(board);
    rotated = true;
  }
  if (direction === 'right' || direction === 'down') {
    board = board.map(r => [...r].reverse());
    reversed = true;
  }

  let totalGained = 0;
  let moved = false;
  const newBoard = board.map(row => {
    const before = row.join(',');
    const { row: slid, gained } = t48SlideRow(row);
    totalGained += gained;
    if (slid.join(',') !== before) moved = true;
    return slid;
  });

  let finalBoard = newBoard;
  if (reversed) finalBoard = finalBoard.map(r => [...r].reverse());
  if (rotated) finalBoard = t48Transpose(finalBoard);

  return { board: finalBoard, gained: totalGained, moved };
}

function t48HasMoves() {
  for (let r = 0; r < T48_SIZE; r++) {
    for (let c = 0; c < T48_SIZE; c++) {
      if (t48Board[r][c] === 0) return true;
      if (c < T48_SIZE - 1 && t48Board[r][c] === t48Board[r][c + 1]) return true;
      if (r < T48_SIZE - 1 && t48Board[r][c] === t48Board[r + 1][c]) return true;
    }
  }
  return false;
}

function t48MaxTile() {
  return Math.max(...t48Board.flat());
}

function t48Level() {
  const max = t48MaxTile();
  let level = 1;
  T48_MILESTONES.forEach((m, i) => { if (max >= m) level = i + 2; });
  return Math.min(level, T48_MILESTONES.length + 1);
}

function t48UpdateStats() {
  document.getElementById('twenty48-level').textContent = t48Level();
  document.getElementById('twenty48-score').textContent = t48Score;
}

function t48Render() {
  const body = document.getElementById('twenty48-body');
  let grid = document.getElementById('t48-grid');
  if (!grid) {
    body.innerHTML = `
      <p class="sub-hint" style="text-align:center;">Көрсеткі пернелерімен (немесе саусақпен) сырғыт, бірдей сандарды біріктір</p>
      <div class="t48-grid" id="t48-grid"></div>
    `;
    grid = document.getElementById('t48-grid');
  }
  grid.innerHTML = '';
  t48Board.forEach(row => {
    row.forEach(val => {
      const cell = document.createElement('div');
      cell.className = 't48-cell';
      if (val) {
        cell.textContent = val;
        cell.style.background = T48_COLORS[val] || '#dc2626';
        cell.style.color = val <= 8 ? '#3b3f5c' : '#fff';
      }
      grid.appendChild(cell);
    });
  });
}

function t48GameOver() {
  const level = t48Level();
  const best = Store.getBest('twenty48');
  if (!best || level > best.level) Store.setBest('twenty48', { level });

  if (t48MaxTile() >= 2048) { Sound.play('champion'); celebrateConfetti(); }
  else Sound.play('gameover');

  const body = document.getElementById('twenty48-body');
  body.innerHTML = `
    <div class="panel result-panel">
      <div class="result-emoji">${t48MaxTile() >= 2048 ? '🏆' : '🙂'}</div>
      <h3>${t48MaxTile() >= 2048 ? 'Сен 2048-ге жеттің! Чемпионсың!' : 'Ойын аяқталды'}</h3>
      <p class="sub-hint">Ең үлкен сан: ${t48MaxTile()} · Ұпай: ${t48Score}</p>
      <div class="result-actions">
        <button class="btn btn-primary" id="t48-retry">Қайта ойнау</button>
        <button class="btn btn-ghost" data-back>← Хабқа оралу</button>
      </div>
    </div>
  `;
  document.getElementById('t48-retry').addEventListener('click', t48StartRound);
  body.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', goHub));
}

function t48Handle(direction) {
  const { board, gained, moved } = t48Move(direction);
  if (!moved) return;
  t48Board = board;
  t48Score += gained;
  if (gained > 0) Sound.play('correct');
  t48SpawnTile();
  t48UpdateStats();
  t48Render();
  if (!t48HasMoves()) {
    setTimeout(t48GameOver, 300);
  }
}

function t48StartRound() {
  t48Board = t48EmptyBoard();
  t48Score = 0;
  t48SpawnTile();
  t48SpawnTile();
  t48UpdateStats();
  t48Render();
}

const T48_KEY_MAP = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
  a: 'left', d: 'right', w: 'up', s: 'down'
};

window.Twenty48Game = {
  start() {
    t48StartRound();

    t48KeyHandler = (e) => {
      const dir = T48_KEY_MAP[e.key];
      if (dir) {
        e.preventDefault();
        t48Handle(dir);
      }
    };
    document.addEventListener('keydown', t48KeyHandler);

    const grid = () => document.getElementById('t48-grid');
    const onTouchStart = (e) => { t48TouchStart = [e.touches[0].clientX, e.touches[0].clientY]; };
    const onTouchEnd = (e) => {
      if (!t48TouchStart) return;
      const dx = e.changedTouches[0].clientX - t48TouchStart[0];
      const dy = e.changedTouches[0].clientY - t48TouchStart[1];
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;
      if (Math.abs(dx) > Math.abs(dy)) t48Handle(dx > 0 ? 'right' : 'left');
      else t48Handle(dy > 0 ? 'down' : 'up');
      t48TouchStart = null;
    };
    document.getElementById('twenty48-body').addEventListener('touchstart', onTouchStart);
    document.getElementById('twenty48-body').addEventListener('touchend', onTouchEnd);

    window.ActiveGameStop = () => {
      document.removeEventListener('keydown', t48KeyHandler);
    };
  }
};
