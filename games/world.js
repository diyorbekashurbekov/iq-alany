// Әлем білімі — география, елдер, жануарлар, ғарыш, IT және тағам туралы
// кең ауқымды викторина. Тақырыптар араласып сұралады.
//
// Деректер бірнеше файлға бөлінген (world-data-1.js, world-data-2.js, ...) —
// жаңа топтама қосу үшін жаңа world-data-N.js файлын жасап, төмендегі тізімге
// қосу жеткілікті. index.html және sw.js-ке де жаңа файлды қосу керек.

const WORLD_DATA = [...WORLD_DATA_1, ...WORLD_DATA_2];

function worldShuffleOptions(item) {
  const correctText = item.options[item.correctIndex];
  const shuffled = [...item.options].sort(() => Math.random() - 0.5);
  return { options: shuffled, correctIndex: shuffled.indexOf(correctText) };
}

let worldLastLevel = null;
let worldUsed = [];

function getWorldQuestion(level) {
  if (level !== worldLastLevel) {
    worldLastLevel = level;
    worldUsed = [];
  }
  const tier = level <= 2 ? 1 : level <= 4 ? 2 : 3;
  const pool = WORLD_DATA.filter(q => q.tier === tier);
  let available = pool.filter(q => !worldUsed.includes(q));
  if (available.length === 0) {
    worldUsed = [];
    available = pool;
  }
  const item = available[Math.floor(Math.random() * available.length)];
  worldUsed.push(item);
  const { options, correctIndex } = worldShuffleOptions(item);
  return { question: item.question, options, correctIndex };
}

window.WorldGame = createQuizGame({
  gameId: 'world',
  bodyId: 'world-body',
  levelId: 'world-level',
  scoreId: 'world-score',
  questionsPerLevel: 5,
  maxLevel: 6,
  getQuestion: getWorldQuestion
});
