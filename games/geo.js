// География шебері — жалаулар мен астаналар бойынша викторина.
// БҰҰ-ға мүше барлық 193 мемлекет + Ватикан (195 ел). ISO кодтары
// flagcdn.com арқылы нақты жалау суретін жүктеу үшін қолданылады.

const GEO_DATA = [
  // ===== tier 1 — ең танымал елдер =====
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
  { name: 'Канада', capital: 'Оттава', iso: 'ca', tier: 1 },
  { name: 'Үндістан', capital: 'Дели', iso: 'in', tier: 1 },
  { name: 'Мексика', capital: 'Мехико', iso: 'mx', tier: 1 },
  { name: 'Египет', capital: 'Каир', iso: 'eg', tier: 1 },
  { name: 'Оңтүстік Корея', capital: 'Сеул', iso: 'kr', tier: 1 },
  { name: 'Аргентина', capital: 'Буэнос-Айрес', iso: 'ar', tier: 1 },
  { name: 'Австрия', capital: 'Вена', iso: 'at', tier: 1 },
  { name: 'Бельгия', capital: 'Брюссель', iso: 'be', tier: 1 },
  { name: 'Чехия', capital: 'Прага', iso: 'cz', tier: 1 },
  { name: 'Дания', capital: 'Копенгаген', iso: 'dk', tier: 1 },
  { name: 'Ирландия', capital: 'Дублин', iso: 'ie', tier: 1 },
  { name: 'Беларусь', capital: 'Минск', iso: 'by', tier: 1 },
  { name: 'Ауғанстан', capital: 'Кабул', iso: 'af', tier: 1 },
  { name: 'Бангладеш', capital: 'Дакка', iso: 'bd', tier: 1 },
  { name: 'Грузия', capital: 'Тбилиси', iso: 'ge', tier: 1 },
  { name: 'Индонезия', capital: 'Джакарта', iso: 'id', tier: 1 },
  { name: 'Ирак', capital: 'Бағдат', iso: 'iq', tier: 1 },
  { name: 'Израиль', capital: 'Иерусалим', iso: 'il', tier: 1 },
  { name: 'Қырғызстан', capital: 'Бішкек', iso: 'kg', tier: 1 },
  { name: 'Малайзия', capital: 'Куала-Лумпур', iso: 'my', tier: 1 },
  { name: 'Моңғолия', capital: 'Ұланбатыр', iso: 'mn', tier: 1 },
  { name: 'Солтүстік Корея', capital: 'Пхеньян', iso: 'kp', tier: 1 },
  { name: 'Пәкістан', capital: 'Исламабад', iso: 'pk', tier: 1 },
  { name: 'Филиппин', capital: 'Манила', iso: 'ph', tier: 1 },
  { name: 'Сингапур', capital: 'Сингапур', iso: 'sg', tier: 1 },
  { name: 'Біріккен Араб Әмірліктері', capital: 'Абу-Даби', iso: 'ae', tier: 1 },
  { name: 'Эфиопия', capital: 'Аддис-Абеба', iso: 'et', tier: 1 },
  { name: 'Нигерия', capital: 'Абуджа', iso: 'ng', tier: 1 },
  { name: 'Оңтүстік Африка Республикасы', capital: 'Претория', iso: 'za', tier: 1 },
  { name: 'Куба', capital: 'Гавана', iso: 'cu', tier: 1 },
  { name: 'Ямайка', capital: 'Кингстон', iso: 'jm', tier: 1 },
  { name: 'Панама', capital: 'Панама қаласы', iso: 'pa', tier: 1 },
  { name: 'Колумбия', capital: 'Богота', iso: 'co', tier: 1 },
  { name: 'Перу', capital: 'Лима', iso: 'pe', tier: 1 },
  { name: 'Венесуэла', capital: 'Каракас', iso: 've', tier: 1 },
  { name: 'Австралия', capital: 'Канберра', iso: 'au', tier: 1 },
  // ===== tier 2 — орташа деңгей =====
  { name: 'Швеция', capital: 'Стокгольм', iso: 'se', tier: 2 },
  { name: 'Норвегия', capital: 'Осло', iso: 'no', tier: 2 },
  { name: 'Польша', capital: 'Варшава', iso: 'pl', tier: 2 },
  { name: 'Украина', capital: 'Киев', iso: 'ua', tier: 2 },
  { name: 'Өзбекстан', capital: 'Ташкент', iso: 'uz', tier: 2 },
  { name: 'Сауд Арабиясы', capital: 'Эр-Рияд', iso: 'sa', tier: 2 },
  { name: 'Болгария', capital: 'София', iso: 'bg', tier: 2 },
  { name: 'Хорватия', capital: 'Загреб', iso: 'hr', tier: 2 },
  { name: 'Кипр', capital: 'Никосия', iso: 'cy', tier: 2 },
  { name: 'Эстония', capital: 'Таллин', iso: 'ee', tier: 2 },
  { name: 'Венгрия', capital: 'Будапешт', iso: 'hu', tier: 2 },
  { name: 'Исландия', capital: 'Рейкьявик', iso: 'is', tier: 2 },
  { name: 'Латвия', capital: 'Рига', iso: 'lv', tier: 2 },
  { name: 'Литва', capital: 'Вильнюс', iso: 'lt', tier: 2 },
  { name: 'Люксембург', capital: 'Люксембург', iso: 'lu', tier: 2 },
  { name: 'Молдова', capital: 'Кишинев', iso: 'md', tier: 2 },
  { name: 'Монако', capital: 'Монако', iso: 'mc', tier: 2 },
  { name: 'Румыния', capital: 'Бухарест', iso: 'ro', tier: 2 },
  { name: 'Сербия', capital: 'Белград', iso: 'rs', tier: 2 },
  { name: 'Словакия', capital: 'Братислава', iso: 'sk', tier: 2 },
  { name: 'Словения', capital: 'Любляна', iso: 'si', tier: 2 },
  { name: 'Албания', capital: 'Тирана', iso: 'al', tier: 2 },
  { name: 'Босния және Герцеговина', capital: 'Сараево', iso: 'ba', tier: 2 },
  { name: 'Ватикан', capital: 'Ватикан', iso: 'va', tier: 2 },
  { name: 'Армения', capital: 'Ереван', iso: 'am', tier: 2 },
  { name: 'Әзірбайжан', capital: 'Баку', iso: 'az', tier: 2 },
  { name: 'Камбоджа', capital: 'Пномпень', iso: 'kh', tier: 2 },
  { name: 'Иордания', capital: 'Амман', iso: 'jo', tier: 2 },
  { name: 'Кувейт', capital: 'Кувейт қаласы', iso: 'kw', tier: 2 },
  { name: 'Лаос', capital: 'Вьентьян', iso: 'la', tier: 2 },
  { name: 'Ливан', capital: 'Бейрут', iso: 'lb', tier: 2 },
  { name: 'Мальдив аралдары', capital: 'Мале', iso: 'mv', tier: 2 },
  { name: 'Мьянма', capital: 'Нейпьидо', iso: 'mm', tier: 2 },
  { name: 'Непал', capital: 'Катманду', iso: 'np', tier: 2 },
  { name: 'Оман', capital: 'Маскат', iso: 'om', tier: 2 },
  { name: 'Палестина', capital: 'Рамалла', iso: 'ps', tier: 2 },
  { name: 'Катар', capital: 'Доха', iso: 'qa', tier: 2 },
  { name: 'Шри-Ланка', capital: 'Шри-Джаяварденепура-Котте', iso: 'lk', tier: 2 },
  { name: 'Сирия', capital: 'Дамаск', iso: 'sy', tier: 2 },
  { name: 'Тәжікстан', capital: 'Душанбе', iso: 'tj', tier: 2 },
  { name: 'Түрікменстан', capital: 'Ашғабат', iso: 'tm', tier: 2 },
  { name: 'Йемен', capital: 'Сана', iso: 'ye', tier: 2 },
  { name: 'Алжир', capital: 'Алжир қаласы', iso: 'dz', tier: 2 },
  { name: 'Ангола', capital: 'Луанда', iso: 'ao', tier: 2 },
  { name: 'Ботсвана', capital: 'Габороне', iso: 'bw', tier: 2 },
  { name: 'Камерун', capital: 'Яунде', iso: 'cm', tier: 2 },
  { name: 'Конго Демократиялық Республикасы', capital: 'Киншаса', iso: 'cd', tier: 2 },
  { name: 'Гана', capital: 'Аккра', iso: 'gh', tier: 2 },
  { name: 'Кот-д’Ивуар', capital: 'Ямусукро', iso: 'ci', tier: 2 },
  { name: 'Ливия', capital: 'Триполи', iso: 'ly', tier: 2 },
  { name: 'Мадагаскар', capital: 'Антананариву', iso: 'mg', tier: 2 },
  { name: 'Мали', capital: 'Бамако', iso: 'ml', tier: 2 },
  { name: 'Маврикий', capital: 'Порт-Луи', iso: 'mu', tier: 2 },
  { name: 'Мозамбик', capital: 'Мапуту', iso: 'mz', tier: 2 },
  { name: 'Намибия', capital: 'Виндхук', iso: 'na', tier: 2 },
  { name: 'Руанда', capital: 'Кигали', iso: 'rw', tier: 2 },
  { name: 'Сенегал', capital: 'Дакар', iso: 'sn', tier: 2 },
  { name: 'Сомали', capital: 'Могадишо', iso: 'so', tier: 2 },
  { name: 'Судан', capital: 'Хартум', iso: 'sd', tier: 2 },
  { name: 'Танзания', capital: 'Додома', iso: 'tz', tier: 2 },
  { name: 'Тунис', capital: 'Тунис қаласы', iso: 'tn', tier: 2 },
  { name: 'Уганда', capital: 'Кампала', iso: 'ug', tier: 2 },
  { name: 'Замбия', capital: 'Лусака', iso: 'zm', tier: 2 },
  { name: 'Зимбабве', capital: 'Хараре', iso: 'zw', tier: 2 },
  { name: 'Багам аралдары', capital: 'Нассау', iso: 'bs', tier: 2 },
  { name: 'Барбадос', capital: 'Бриджтаун', iso: 'bb', tier: 2 },
  { name: 'Коста-Рика', capital: 'Сан-Хосе', iso: 'cr', tier: 2 },
  { name: 'Доминикан Республикасы', capital: 'Санто-Доминго', iso: 'do', tier: 2 },
  { name: 'Сальвадор', capital: 'Сан-Сальвадор', iso: 'sv', tier: 2 },
  { name: 'Гватемала', capital: 'Гватемала қаласы', iso: 'gt', tier: 2 },
  { name: 'Гаити', capital: 'Порт-о-Пренс', iso: 'ht', tier: 2 },
  { name: 'Гондурас', capital: 'Тегусигальпа', iso: 'hn', tier: 2 },
  { name: 'Никарагуа', capital: 'Манагуа', iso: 'ni', tier: 2 },
  { name: 'Тринидад және Тобаго', capital: 'Порт-оф-Спейн', iso: 'tt', tier: 2 },
  { name: 'Боливия', capital: 'Сукре', iso: 'bo', tier: 2 },
  { name: 'Эквадор', capital: 'Кито', iso: 'ec', tier: 2 },
  { name: 'Парагвай', capital: 'Асунсьон', iso: 'py', tier: 2 },
  { name: 'Уругвай', capital: 'Монтевидео', iso: 'uy', tier: 2 },
  { name: 'Фиджи', capital: 'Сува', iso: 'fj', tier: 2 },
  { name: 'Папуа-Жаңа Гвинея', capital: 'Порт-Морсби', iso: 'pg', tier: 2 },
  // ===== tier 3 — қиынырақ, сирек кездесетін елдер =====
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
  { name: 'Лихтенштейн', capital: 'Вадуц', iso: 'li', tier: 3 },
  { name: 'Мальта', capital: 'Валлетта', iso: 'mt', tier: 3 },
  { name: 'Черногория', capital: 'Подгорица', iso: 'me', tier: 3 },
  { name: 'Солтүстік Македония', capital: 'Скопье', iso: 'mk', tier: 3 },
  { name: 'Сан-Марино', capital: 'Сан-Марино', iso: 'sm', tier: 3 },
  { name: 'Андорра', capital: 'Андорра-ла-Велья', iso: 'ad', tier: 3 },
  { name: 'Бахрейн', capital: 'Манама', iso: 'bh', tier: 3 },
  { name: 'Бутан', capital: 'Тхимпху', iso: 'bt', tier: 3 },
  { name: 'Бруней', capital: 'Бандар-Сери-Бегаван', iso: 'bn', tier: 3 },
  { name: 'Тимор-Лешти', capital: 'Дили', iso: 'tl', tier: 3 },
  { name: 'Бенин', capital: 'Порто-Ново', iso: 'bj', tier: 3 },
  { name: 'Буркина-Фасо', capital: 'Уагадугу', iso: 'bf', tier: 3 },
  { name: 'Бурунди', capital: 'Гитега', iso: 'bi', tier: 3 },
  { name: 'Кабо-Верде', capital: 'Прая', iso: 'cv', tier: 3 },
  { name: 'Орталық Африка Республикасы', capital: 'Банги', iso: 'cf', tier: 3 },
  { name: 'Чад', capital: 'Нджамена', iso: 'td', tier: 3 },
  { name: 'Коморос', capital: 'Морони', iso: 'km', tier: 3 },
  { name: 'Конго Республикасы', capital: 'Браззавиль', iso: 'cg', tier: 3 },
  { name: 'Джибути', capital: 'Джибути қаласы', iso: 'dj', tier: 3 },
  { name: 'Экваторлық Гвинея', capital: 'Малабо', iso: 'gq', tier: 3 },
  { name: 'Эритрея', capital: 'Асмара', iso: 'er', tier: 3 },
  { name: 'Эсватини', capital: 'Мбабане', iso: 'sz', tier: 3 },
  { name: 'Габон', capital: 'Либревиль', iso: 'ga', tier: 3 },
  { name: 'Гамбия', capital: 'Банжул', iso: 'gm', tier: 3 },
  { name: 'Гвинея', capital: 'Конакри', iso: 'gn', tier: 3 },
  { name: 'Гвинея-Бисау', capital: 'Бисау', iso: 'gw', tier: 3 },
  { name: 'Лесото', capital: 'Масеру', iso: 'ls', tier: 3 },
  { name: 'Либерия', capital: 'Монровия', iso: 'lr', tier: 3 },
  { name: 'Малави', capital: 'Лилонгве', iso: 'mw', tier: 3 },
  { name: 'Мавритания', capital: 'Нуакшот', iso: 'mr', tier: 3 },
  { name: 'Нигер', capital: 'Ниамей', iso: 'ne', tier: 3 },
  { name: 'Сан-Томе және Принсипи', capital: 'Сан-Томе', iso: 'st', tier: 3 },
  { name: 'Сейшел аралдары', capital: 'Виктория', iso: 'sc', tier: 3 },
  { name: 'Сьерра-Леоне', capital: 'Фритаун', iso: 'sl', tier: 3 },
  { name: 'Оңтүстік Судан', capital: 'Джуба', iso: 'ss', tier: 3 },
  { name: 'Того', capital: 'Ломе', iso: 'tg', tier: 3 },
  { name: 'Антигуа және Барбуда', capital: 'Сент-Джонс', iso: 'ag', tier: 3 },
  { name: 'Белиз', capital: 'Бельмопан', iso: 'bz', tier: 3 },
  { name: 'Доминика', capital: 'Розо', iso: 'dm', tier: 3 },
  { name: 'Гренада', capital: 'Сент-Джорджес', iso: 'gd', tier: 3 },
  { name: 'Сент-Китс және Невис', capital: 'Бастер', iso: 'kn', tier: 3 },
  { name: 'Сент-Люсия', capital: 'Кастри', iso: 'lc', tier: 3 },
  { name: 'Сент-Винсент және Гренадины', capital: 'Кингстаун', iso: 'vc', tier: 3 },
  { name: 'Гайана', capital: 'Джорджтаун', iso: 'gy', tier: 3 },
  { name: 'Суринам', capital: 'Парамарибо', iso: 'sr', tier: 3 },
  { name: 'Кирибати', capital: 'Тарава', iso: 'ki', tier: 3 },
  { name: 'Маршалл аралдары', capital: 'Маджуро', iso: 'mh', tier: 3 },
  { name: 'Микронезия', capital: 'Палікир', iso: 'fm', tier: 3 },
  { name: 'Науру', capital: 'Ярен', iso: 'nr', tier: 3 },
  { name: 'Палау', capital: 'Нгерулмуд', iso: 'pw', tier: 3 },
  { name: 'Самоа', capital: 'Апиа', iso: 'ws', tier: 3 },
  { name: 'Соломон аралдары', capital: 'Хониара', iso: 'sb', tier: 3 },
  { name: 'Тонга', capital: 'Нукуалофа', iso: 'to', tier: 3 },
  { name: 'Тувалу', capital: 'Фунафути', iso: 'tv', tier: 3 },
  { name: 'Вануату', capital: 'Порт-Вила', iso: 'vu', tier: 3 },
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

let geoLastLevel = null;
let geoUsed = [];

function getGeoQuestion(level) {
  if (level !== geoLastLevel) {
    geoLastLevel = level;
    geoUsed = [];
  }
  const tier = level <= 2 ? 1 : level <= 4 ? 2 : 3;
  const mode = level % 2 === 1 ? 'flag' : 'capital';
  const pool = GEO_DATA.filter(c => c.tier === tier);

  let available = pool.filter(c => !geoUsed.includes(c));
  if (available.length === 0) {
    geoUsed = [];
    available = pool;
  }
  const correct = available[Math.floor(Math.random() * available.length)];
  geoUsed.push(correct);
  const correctIdx = pool.indexOf(correct);
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
  maxLevel: 6,
  getQuestion: getGeoQuestion
});
