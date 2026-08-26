// Сандар логикасы — тізбектегі заңдылықты тауып, келесі санды болжау

function buildSequence(level) {
  const seq = [0, 0, 0, 0, 0];
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (level === 1) {
    const step = rand(2, 5);
    seq[0] = rand(1, 10);
    for (let i = 1; i < 5; i++) seq[i] = seq[i - 1] + step;
  } else if (level === 2) {
    const step = rand(6, 12);
    seq[0] = rand(1, 15);
    for (let i = 1; i < 5; i++) seq[i] = seq[i - 1] + step;
  } else if (level === 3) {
    const a = rand(2, 6), b = rand(2, 6);
    seq[0] = rand(1, 10);
    for (let i = 1; i < 5; i++) seq[i] = seq[i - 1] + (i % 2 === 1 ? a : b);
  } else if (level === 4) {
    const factor = rand(2, 3);
    seq[0] = rand(1, 4);
    for (let i = 1; i < 5; i++) seq[i] = seq[i - 1] * factor;
  } else if (level === 5) {
    const add = rand(1, 3);
    seq[0] = rand(1, 4);
    for (let i = 1; i < 5; i++) seq[i] = seq[i - 1] * 2 + add;
  } else if (level === 6) {
    seq[0] = rand(1, 5);
    seq[1] = rand(1, 5);
    for (let i = 2; i < 5; i++) seq[i] = seq[i - 1] + seq[i - 2];
  } else if (level === 7) {
    let diff = rand(1, 3);
    seq[0] = rand(1, 10);
    for (let i = 1; i < 5; i++) {
      seq[i] = seq[i - 1] + diff;
      diff++;
    }
  } else {
    const startN = rand(2, 6);
    for (let i = 0; i < 5; i++) seq[i] = (startN + i) * (startN + i);
  }
  return seq;
}

function buildDistractors(correct) {
  const used = new Set([correct]);
  const options = [correct];
  while (options.length < 4) {
    const offset = (Math.floor(Math.random() * 9) - 4) || 3;
    const scale = Math.max(1, Math.round(Math.abs(correct) * 0.08));
    const candidate = correct + offset * scale;
    if (!used.has(candidate) && candidate !== correct) {
      used.add(candidate);
      options.push(candidate);
    }
  }
  // араластыру
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

function getNumberQuestion(level) {
  const seq = buildSequence(level);
  const correct = seq[4];
  const options = buildDistractors(correct);
  return {
    question: `Тізбекті жалғастыр: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ?`,
    options: options.map(String),
    correctIndex: options.indexOf(correct)
  };
}

window.NumbersGame = createQuizGame({
  gameId: 'numbers',
  bodyId: 'numbers-body',
  levelId: 'numbers-level',
  scoreId: 'numbers-score',
  questionsPerLevel: 5,
  maxLevel: 8,
  getQuestion: getNumberQuestion
});
