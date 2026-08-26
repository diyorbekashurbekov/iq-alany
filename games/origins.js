// Қайдан шықты? — әлемдегі қызықты өнертабыстар мен дәстүрлердің қай елден
// тарағанын табатын ойын. Мақсаты — географиялық және мәдени білімді дамыту.
//
// Дерек құрылымы {thing, country, tier} түрінде сақталады да, әр факт екі
// түрлі сұрақ ретінде қойылады (тура және кері бағытта) — бұл шектеулі
// фактілер санынан әлдеқайда көп нақты сұрақ комбинациясын береді, ешбір
// факт ойдан шығарылмайды.

const ORIGINS_DATA = [
  // tier 1 — жалпыға белгілі фактілер
  { thing: 'Кофе', country: 'Эфиопия', tier: 1 },
  { thing: 'Пицца', country: 'Италия', tier: 1 },
  { thing: 'Какао сусыны (шоколад)', country: 'Мексика', tier: 1 },
  { thing: 'Олимпиада ойындары', country: 'Греция', tier: 1 },
  { thing: 'Шай ішу дәстүрі', country: 'Қытай', tier: 1 },
  { thing: 'Джинсы шалбар', country: 'АҚШ', tier: 1 },
  { thing: 'Қазіргі футбол ережелері', country: 'Ұлыбритания', tier: 1 },
  { thing: 'Макарон (паста)', country: 'Италия', tier: 1 },
  { thing: 'Кино өнері', country: 'Франция', tier: 1 },
  { thing: 'Хэллоуин мерекесі', country: 'Ирландия', tier: 1 },
  { thing: 'Балет', country: 'Италия', tier: 1 },
  { thing: 'Опера', country: 'Италия', tier: 1 },
  { thing: 'Джаз музыкасы', country: 'АҚШ', tier: 1 },
  { thing: 'Рок-н-ролл музыкасы', country: 'АҚШ', tier: 1 },
  { thing: 'Кока-кола сусыны', country: 'АҚШ', tier: 1 },
  { thing: 'Заманауи цирк өнері', country: 'Ұлыбритания', tier: 1 },
  { thing: 'Круассан', country: 'Австрия', tier: 1 },
  { thing: 'Гамбургер', country: 'АҚШ', tier: 1 },
  { thing: 'Балмұздақтың ежелгі түрі', country: 'Қытай', tier: 1 },
  { thing: 'Санта Клаустың қазіргі бейнесі', country: 'АҚШ', tier: 1 },
  { thing: 'Хот-дог (сосиска)', country: 'Германия', tier: 1 },
  { thing: 'Кетчуп (қазіргі томат тұздығы)', country: 'АҚШ', tier: 1 },
  { thing: 'Валентин күні дәстүрі', country: 'Италия', tier: 1 },
  { thing: 'Кроссворд (сөзжұмбақ)', country: 'АҚШ', tier: 1 },
  { thing: 'Баскетбол', country: 'АҚШ', tier: 1 },
  { thing: 'Волейбол', country: 'АҚШ', tier: 1 },
  { thing: 'Гольф', country: 'Шотландия', tier: 1 },
  { thing: 'Заманауи теннис', country: 'Ұлыбритания', tier: 1 },
  { thing: 'Регби', country: 'Ұлыбритания', tier: 1 },
  { thing: 'Үстел теннисі (пинг-понг)', country: 'Ұлыбритания', tier: 1 },
  // tier 2 — орташа деңгей
  { thing: 'Шахмат ойыны', country: 'Үндістан', tier: 2 },
  { thing: 'Нөл (0) саны түсінігі', country: 'Үндістан', tier: 2 },
  { thing: 'Қағаз', country: 'Қытай', tier: 2 },
  { thing: 'Компас', country: 'Қытай', tier: 2 },
  { thing: 'Йога', country: 'Үндістан', tier: 2 },
  { thing: 'Самурай дәстүрі', country: 'Жапония', tier: 2 },
  { thing: 'Фламенко билі', country: 'Испания', tier: 2 },
  { thing: 'Танго билі', country: 'Аргентина', tier: 2 },
  { thing: 'Оригами', country: 'Жапония', tier: 2 },
  { thing: 'Пианино', country: 'Италия', tier: 2 },
  { thing: 'Го ойыны', country: 'Қытай', tier: 2 },
  { thing: 'Ойын карталары', country: 'Қытай', tier: 2 },
  { thing: 'Фейерверк', country: 'Қытай', tier: 2 },
  { thing: 'Заманауи театр өнерінің негізі', country: 'Греция', tier: 2 },
  { thing: 'Банк жүйесінің алғашқы түрі', country: 'Италия', tier: 2 },
  { thing: 'Ханами (сакура мерекесі)', country: 'Жапония', tier: 2 },
  { thing: 'Корида (бұқа шайқасы)', country: 'Испания', tier: 2 },
  { thing: 'Рио стиліндегі карнавал', country: 'Бразилия', tier: 2 },
  { thing: 'Сумо күресі', country: 'Жапония', tier: 2 },
  { thing: 'Регги музыкасы', country: 'Ямайка', tier: 2 },
  { thing: 'Багель наны', country: 'Польша', tier: 2 },
  { thing: 'Кимчи', country: 'Корея', tier: 2 },
  { thing: 'Суши', country: 'Жапония', tier: 2 },
  { thing: 'Тако', country: 'Мексика', tier: 2 },
  { thing: 'Матрешка қуыршағы', country: 'Ресей', tier: 2 },
  { thing: 'Балалайка аспабы', country: 'Ресей', tier: 2 },
  { thing: 'Диджериду аспабы', country: 'Австралия', tier: 2 },
  { thing: 'Но театры', country: 'Жапония', tier: 2 },
  { thing: 'Капоэйра (би-жекпе-жек)', country: 'Бразилия', tier: 2 },
  { thing: 'Александрия кітапханасы', country: 'Египет', tier: 2 },
  { thing: 'Алғашқы пошта маркасы', country: 'Ұлыбритания', tier: 2 },
  { thing: 'Боулингтің ежелгі түрі', country: 'Германия', tier: 2 },
  // tier 3 — қиынырақ, сирек кездесетін фактілер
  { thing: 'Ең көне үздіксіз жұмыс істейтін университет', country: 'Марокко', tier: 3 },
  { thing: 'Фарфор (керамика) өнері', country: 'Қытай', tier: 3 },
  { thing: 'Григориан күнтізбесі', country: 'Италия', tier: 3 },
  { thing: 'Демократия түсінігі', country: 'Греция', tier: 3 },
  { thing: 'Керлинг спорты', country: 'Шотландия', tier: 3 },
  { thing: 'Бумеранг', country: 'Австралия', tier: 3 },
  { thing: 'Виски', country: 'Шотландия', tier: 3 },
  { thing: 'Велосипедтің алғашқы нұсқасы', country: 'Германия', tier: 3 },
  { thing: 'Оқ-дәрі (гунпорошок)', country: 'Қытай', tier: 3 },
  { thing: 'Ұлы пирамида', country: 'Египет', tier: 3 },
  { thing: 'Мумия жасау дәстүрі', country: 'Египет', tier: 3 },
  { thing: 'Клинопись (сына жазуы)', country: 'Ирак', tier: 3 },
  { thing: 'Иероглиф жазуы', country: 'Египет', tier: 3 },
  { thing: 'Ұлы Жібек жолының басталу нүктесі', country: 'Қытай', tier: 3 },
  { thing: 'Баспа станогы (Гутенберг)', country: 'Германия', tier: 3 },
  { thing: 'Пифагор теоремасы', country: 'Греция', tier: 3 },
  { thing: 'Скрипканың заманауи түрі', country: 'Италия', tier: 3 },
  { thing: 'Рим тас жолдары', country: 'Италия', tier: 3 },
  { thing: 'Алгебра ғылымы', country: 'Ирак', tier: 3 },
  { thing: 'Механикалық сағаттың алғашқы түрлері', country: 'Қытай', tier: 3 },
  { thing: 'Тадж-Махал кесенесі', country: 'Үндістан', tier: 3 },
  { thing: 'Ұлы Қытай қорғаны', country: 'Қытай', tier: 3 },
  { thing: 'Стоунхендж ескерткіші', country: 'Ұлыбритания', tier: 3 },
  { thing: 'Мачу-Пикчу қала-қаласы', country: 'Перу', tier: 3 },
  { thing: 'Колизей амфитеатры', country: 'Италия', tier: 3 },
  { thing: 'Евклид геометриясы', country: 'Греция', tier: 3 },
  { thing: 'Гринвич нөлдік меридианы', country: 'Ұлыбритания', tier: 3 },
  { thing: 'Метрлік өлшем жүйесі', country: 'Франция', tier: 3 },
  { thing: 'Мұз үстіндегі хоккей', country: 'Канада', tier: 3 },
  { thing: 'Американдық футбол', country: 'АҚШ', tier: 3 },
  { thing: 'Ежелгі Олимпия стадионы', country: 'Греция', tier: 3 },
  { thing: 'Алғашқы автомобиль (бензинді)', country: 'Германия', tier: 3 },
];

function originsPickDistractors(pool, excludeItem, byField, count) {
  const seenValues = new Set([excludeItem[byField]]);
  const candidates = pool.filter(item => item !== excludeItem);
  const result = [];
  while (result.length < count && candidates.length > 0) {
    const idx = Math.floor(Math.random() * candidates.length);
    const candidate = candidates.splice(idx, 1)[0];
    if (!seenValues.has(candidate[byField])) {
      seenValues.add(candidate[byField]);
      result.push(candidate);
    }
  }
  return result;
}

function getOriginsQuestion(level) {
  const tier = level <= 2 ? 1 : level <= 4 ? 2 : 3;
  const pool = ORIGINS_DATA.filter(q => q.tier === tier);
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const isForward = Math.random() < 0.5;

  if (isForward) {
    const distractors = originsPickDistractors(pool, correct, 'country', 3);
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return {
      question: `«${correct.thing}» қай елден шықты?`,
      options: options.map(o => o.country),
      correctIndex: options.findIndex(o => o === correct)
    };
  } else {
    // 'country' бойынша аластаймыз (сол елдің басқа заты емес) — әйтпесе
    // екі опция да дұрыс жауап болып, сұрақ екіұдай болып кетер еді
    const distractors = originsPickDistractors(pool, correct, 'country', 3);
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return {
      question: `Мыналардың қайсысы ${correct.country} елінен шыққан?`,
      options: options.map(o => o.thing),
      correctIndex: options.findIndex(o => o === correct)
    };
  }
}

window.OriginsGame = createQuizGame({
  gameId: 'origins',
  bodyId: 'origins-body',
  levelId: 'origins-level',
  scoreId: 'origins-score',
  questionsPerLevel: 5,
  maxLevel: 6,
  getQuestion: getOriginsQuestion
});
