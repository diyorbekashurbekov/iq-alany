// Жылан — классикалық аркада ойыны, жылдамдық деңгей сайын артады

const SNK_CELL = 20;
const SNK_COLS = 20;
const SNK_ROWS = 20;
const SNK_START_SPEED = 160;
const SNK_MIN_SPEED = 70;

let snkSnake, snkDir, snkNextDir, snkFood, snkScore, snkFoodEaten, snkSpeed, snkLoopId, snkCtx, snkKeyHandler;

function snkRandCell() {
  return {
    x: Math.floor(Math.random() * SNK_COLS),
    y: Math.floor(Math.random() * SNK_ROWS)
  };
}

function snkPlaceFood() {
  let cell;
  do {
    cell = snkRandCell();
  } while (snkSnake.some(s => s.x === cell.x && s.y === cell.y));
  snkFood = cell;
}

function snkLevel() {
  return Math.floor(snkFoodEaten / 5) + 1;
}

function snkUpdateStats() {
  document.getElementById('snake-level').textContent = snkLevel();
  document.getElementById('snake-score').textContent = snkScore;
}

function snkDraw() {
  const ctx = snkCtx;
  ctx.fillStyle = '#22283b';
  ctx.fillRect(0, 0, SNK_COLS * SNK_CELL, SNK_ROWS * SNK_CELL);

  ctx.fillStyle = '#ff8b8b';
  ctx.beginPath();
  ctx.arc(snkFood.x * SNK_CELL + SNK_CELL / 2, snkFood.y * SNK_CELL + SNK_CELL / 2, SNK_CELL / 2 - 2, 0, Math.PI * 2);
  ctx.fill();

  snkSnake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#7fd8c9' : '#6c8cff';
    const x = seg.x * SNK_CELL + 1, y = seg.y * SNK_CELL + 1, s = SNK_CELL - 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, s, s, 5);
    else ctx.rect(x, y, s, s);
    ctx.fill();
  });
}

function snkTick() {
  snkDir = snkNextDir;
  const head = { x: snkSnake[0].x + snkDir.x, y: snkSnake[0].y + snkDir.y };

  if (head.x < 0 || head.x >= SNK_COLS || head.y < 0 || head.y >= SNK_ROWS ||
      snkSnake.some(s => s.x === head.x && s.y === head.y)) {
    snkGameOver();
    return;
  }

  snkSnake.unshift(head);
  if (head.x === snkFood.x && head.y === snkFood.y) {
    Sound.play('eat');
    snkScore += 10;
    snkFoodEaten++;
    snkPlaceFood();
    snkUpdateStats();
    const newSpeed = Math.max(SNK_MIN_SPEED, SNK_START_SPEED - snkFoodEaten * 6);
    if (newSpeed !== snkSpeed) {
      snkSpeed = newSpeed;
      clearInterval(snkLoopId);
      snkLoopId = setInterval(snkTick, snkSpeed);
    }
  } else {
    snkSnake.pop();
  }
  snkDraw();
}

function snkGameOver() {
  clearInterval(snkLoopId);
  Sound.play('gameover');
  const level = snkLevel();
  const best = Store.getBest('snake');
  if (!best || level > best.level) Store.setBest('snake', { level });

  const body = document.getElementById('snake-body');
  body.innerHTML = `
    <div class="panel result-panel">
      <div class="result-emoji">🐍</div>
      <h3>Ойын аяқталды</h3>
      <p class="sub-hint">Ұпай: ${snkScore} · Жеткен деңгей: ${level}</p>
      <div class="result-actions">
        <button class="btn btn-primary" id="snake-retry">Қайта ойнау</button>
        <button class="btn btn-ghost" data-back>← Хабқа оралу</button>
      </div>
    </div>
  `;
  document.getElementById('snake-retry').addEventListener('click', snkStartRound);
  body.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', goHub));
}

function snkStartRound() {
  const body = document.getElementById('snake-body');
  body.innerHTML = `
    <p class="sub-hint" style="text-align:center;">Көрсеткі пернелерімен (немесе WASD) басқар</p>
    <canvas id="snake-canvas" width="${SNK_COLS * SNK_CELL}" height="${SNK_ROWS * SNK_CELL}"></canvas>
  `;
  snkCtx = document.getElementById('snake-canvas').getContext('2d');

  snkSnake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
  snkDir = { x: 1, y: 0 };
  snkNextDir = { x: 1, y: 0 };
  snkScore = 0;
  snkFoodEaten = 0;
  snkSpeed = SNK_START_SPEED;
  snkPlaceFood();
  snkUpdateStats();
  snkDraw();

  clearInterval(snkLoopId);
  snkLoopId = setInterval(snkTick, snkSpeed);
}

const SNK_KEY_MAP = {
  ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
  a: { x: -1, y: 0 }, d: { x: 1, y: 0 }, w: { x: 0, y: -1 }, s: { x: 0, y: 1 }
};

window.SnakeGame = {
  start() {
    snkStartRound();

    snkKeyHandler = (e) => {
      const dir = SNK_KEY_MAP[e.key];
      if (!dir) return;
      e.preventDefault();
      if (dir.x === -snkDir.x && dir.y === -snkDir.y) return;
      snkNextDir = dir;
    };
    document.addEventListener('keydown', snkKeyHandler);

    window.ActiveGameStop = () => {
      clearInterval(snkLoopId);
      document.removeEventListener('keydown', snkKeyHandler);
    };
  }
};
