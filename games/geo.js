// География шебері — жалаулар мен астаналар бойынша викторина

const GEO_DATA = [
  // tier 1 — жиі кездесетін елдер
  { name: 'Қазақстан', capital: 'Астана', iso: 'kz', tier: 1 },
  { name: 'Ресей', capital: 'Мәскеу', iso: 'ru', tier: 1 },
  { name: 'АҚШ', capital: 'Вашингтон', iso: 'us', tier: 1 },
  { name: 'Қытай', capital: 'Пекин', iso: 'cn', tier: 1 },
  { name: 'Жапония', capital: 'Токио', iso: 'jp', tier: 1 },
  { name: 'Германия', capital: 'Берлин', iso: 'de', tier: 1 },
  { name: 'Франция', capital: 'Париж', iso: 'fr', tier: 1 },
  { name: 'Ұлыбритания', capital: 'Лондон', iso: 'gb', tier: 1 },
  { name: 'Түркия', capital: 'Анкара', iso: 'tr', tier: 1 },
  { name: 'Италия', capital: 'Рим', iso: 'it', tier: 1 },
  { name: 'Испания', capital: 'Мадрид', iso: 'es', tier: 1 },
  { name: 'Бразилия', capital: 'Бразилиа', iso: 'br', tier: 1 },
  // tier 2 — орташа деңгей
  { name: 'Канада', capital: 'Оттава', iso: 'ca', tier: 2 },
  { name: 'Үндістан', capital: 'Дели', iso: 'in', tier: 2 },
  { name: 'Мексика', capital: 'Мехико', iso: 'mx', tier: 2 },
  { name: 'Египет', capital: 'Каир', iso: 'eg', tier: 2 },
  { name: 'Оңтүстік Корея', capital: 'Сеул', iso: 'kr', tier: 2 },
  { name: 'Аргентина', capital: 'Буэнос-Айрес', iso: 'ar', tier: 2 },
  { name: 'Швеция', capital: 'Стокгольм', iso: 'se', tier: 2 },
  { name: 'Норвегия', capital: 'Осло', iso: 'no', tier: 2 },
  { name: 'Польша', capital: 'Варшава', iso: 'pl', tier: 2 },
  { name: 'Украина', capital: 'Киев', iso: 'ua', tier: 2 },
  { name: 'Өзбекстан', capital: 'Ташкент', iso: 'uz', tier: 2 },
  { name: 'Сауд Арабиясы', capital: 'Эр-Рияд', iso: 'sa', tier: 2 },
  // tier 3 — қиынырақ
  { name: 'Швейцария', capital: 'Берн', iso: 'ch', tier: 3 },
  { name: 'Нидерланды', capital: 'Амстердам', iso: 'nl', tier: 3 },
  { name: 'Португалия', capital: 'Лиссабон', iso: 'pt', tier: 3 },
  { name: 'Грекия', capital: 'Афины', iso: 'gr', tier: 3 },
  { name: 'Финляндия', capital: 'Хельсинки', iso: 'fi', tier: 3 },
  { name: 'Марокко', capital: 'Рабат', iso: 'ma', tier: 3 },
  { name: 'Вьетнам', capital: 'Ханой', iso: 'vn', tier: 3 },
  { name: 'Тайланд', capital: 'Бангкок', iso: 'th', tier: 3 },
  { name: 'Кения', capital: 'Найроби', iso: 'ke', tier: 3 },
  { name: 'Иран', capital: 'Тегеран', iso: 'ir', tier: 3 },
  { name: 'Жаңа Зеландия', capital: 'Веллингтон', iso: 'nz', tier: 3 },
  { name: 'Чили', capital: 'Сантьяго', iso: 'cl', tier: 3 },
];

function pickRandom(arr, n, excludeIndexes = []) {
  const pool = arr.map((v, i) => i).filter(i => !excludeIndexes.includes(i));
  const chosen = [];
  while (chosen.length < n && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  return chosen.map(i => arr[i]);
}

function getGeoQuestion(level) {
  const tier = level <= 2 ? 1 : level <= 4 ? 2 : 3;
  const mode = level % 2 === 1 ? 'flag' : 'capital';
  const pool = GEO_DATA.filter(c => c.tier === tier);

  const correctIdx = Math.floor(Math.random() * pool.length);
  const correct = pool[correctIdx];
  const distractors = pickRandom(pool, 3, [correctIdx]);
  const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

  const question = mode === 'flag'
    ? `<img src="https://flagcdn.com/h120/${correct.iso}.png" alt="жалау" class="flag-img"><div>Бұл жалау қай елдікі?</div>`
    : `«${correct.capital}» қай елдің астанасы?`;

  return {
    question,
    options: options.map(c => c.name),
    correctIndex: options.findIndex(c => c.name === correct.name)
  };
}

window.GeoGame = createQuizGame({
  gameId: 'geo',
  bodyId: 'geo-body',
  levelId: 'geo-level',
  scoreId: 'geo-score',
  questionsPerLevel: 5,
  maxLevel: 5,
  getQuestion: getGeoQuestion
});
