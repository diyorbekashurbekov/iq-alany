// Футбол білгірі — футбол әлемі туралы викторина

const FOOTBALL_DATA = [
  // tier 1 — жалпы ережелер
  { tier: 1, question: 'Футбол командасында алаңда (қақпашымен қоса) неше ойыншы болады?', options: ['9', '10', '11', '12'], correctIndex: 2 },
  { tier: 1, question: 'Футбол матчының негізгі уақыты неше минутқа созылады?', options: ['60', '80', '90', '120'], correctIndex: 2 },
  { tier: 1, question: 'Әлем чемпионаты неше жылда бір рет өтеді?', options: ['2 жылда', '3 жылда', '4 жылда', '5 жылда'], correctIndex: 2 },
  { tier: 1, question: 'Доп қақпаға толық түскенде не деп аталады?', options: ['Пенальти', 'Гол', 'Офсайд', 'Аут'], correctIndex: 1 },
  { tier: 1, question: 'Ойыншы бір матчта екі сары карточка алса, не болады?', options: ['Ойыннан шығарылады (қызыл карточка)', 'Жаттығуға жіберіледі', 'Ештеңе болмайды', 'Айыппұл төлейді'], correctIndex: 0 },
  { tier: 1, question: 'Пенальти соғу нүктесі қақпадан қанша қашықтықта орналасқан?', options: ['9 метр', '11 метр', '15 метр', '20 метр'], correctIndex: 1 },
  { tier: 1, question: 'ФИФА қандай спорт түрін басқарады?', options: ['Баскетбол', 'Волейбол', 'Футбол', 'Хоккей'], correctIndex: 2 },
  { tier: 1, question: 'Допты қолмен ұстауға негізінен кімге рұқсат етілген?', options: ['Қорғаушыға', 'Шабуылшыға', 'Қақпашыға (өз алаңында)', 'Ешкімге'], correctIndex: 2 },
  { tier: 1, question: 'Команда басшысы, алаңда белгі тағатын ойыншы қалай аталады?', options: ['Капитан', 'Легионер', 'Резерв', 'Төреші'], correctIndex: 0 },
  { tier: 1, question: 'Әлем чемпионатын тарихта ең көп (5 рет) жеңіп алған ел?', options: ['Германия', 'Аргентина', 'Бразилия', 'Италия'], correctIndex: 2 },
  // tier 2 — клубтар мен турнирлер
  { tier: 2, question: 'Реал Мадридтің Испаниядағы басты қарсыласы қай клуб?', options: ['Атлетико Мадрид', 'Барселона', 'Севилья', 'Валенсия'], correctIndex: 1 },
  { tier: 2, question: 'Англияның ең жоғарғы футбол дивизионы қалай аталады?', options: ['Ла Лига', 'Бундеслига', 'Премьер-лига', 'Серия А'], correctIndex: 2 },
  { tier: 2, question: 'Еуропа клубтары арасындағы ең мәртебелі турнир қалай аталады?', options: ['Еуропа лигасы', 'Чемпиондар лигасы', 'Кубок УЕФА', 'Суперкубок'], correctIndex: 1 },
  { tier: 2, question: '2022 жылғы әлем чемпионаты қай елде өтті?', options: ['Ресей', 'Бразилия', 'Катар', 'Германия'], correctIndex: 2 },
  { tier: 2, question: 'Лионель Месси негізінен қай елдің құрамасында ойнайды?', options: ['Испания', 'Бразилия', 'Аргентина', 'Португалия'], correctIndex: 2 },
  { tier: 2, question: 'Криштиану Роналду қай елдің азаматы?', options: ['Испания', 'Португалия', 'Италия', 'Франция'], correctIndex: 1 },
  { tier: 2, question: 'Ойын кезіндегі бас төреші қалай аталады?', options: ['Капитан', 'Легионер', 'Төреші (арбитр)', 'Комментатор'], correctIndex: 2 },
  { tier: 2, question: 'Қазіргі ережелер бойынша, ресми матчта команда әдетте неше рет ойыншы алмастыра алады?', options: ['3', '5', '7', 'Шексіз'], correctIndex: 1 },
  { tier: 2, question: 'ФИФА-ның бас штабы қай қалада орналасқан?', options: ['Женева', 'Цюрих', 'Париж', 'Лондон'], correctIndex: 1 },
  { tier: 2, question: 'Допты аяқпен шебер басқарып жүруді қалай атайды?', options: ['Пас', 'Дриблинг', 'Офсайд', 'Корнер'], correctIndex: 1 },
  // tier 3 — тарих пен қызық фактілер
  { tier: 3, question: '2010 жылғы әлем чемпионатының чемпионы қай ел болды?', options: ['Голландия', 'Испания', 'Германия', 'Уругвай'], correctIndex: 1 },
  { tier: 3, question: 'Әлем чемпионаттары тарихында ең көп гол соққан ойыншы (2022 ж. дейін) кім?', options: ['Пеле', 'Мирослав Клозе', 'Роналдо (Бразилия)', 'Месси'], correctIndex: 1 },
  { tier: 3, question: 'Шабуылшы допты алар алдында соңғы қорғаушыдан да, доптан да қақпаға жақын тұрса, бұл қалай аталады?', options: ['Корнер', 'Аут', 'Офсайд', 'Фол'], correctIndex: 2 },
  { tier: 3, question: 'Бразилия құрамасының әйгілі лақап аты қандай?', options: ['Селесао', 'Альбиселесте', 'Тримонтиум', 'Аззурри'], correctIndex: 0 },
  { tier: 3, question: '1986 жылғы әлем чемпионатында Марадонаның қолымен соққан атақты голы қалай аталады?', options: ['Алтын гол', 'Құдай қолы', 'Ерекше гол', 'Кездейсоқ гол'], correctIndex: 1 },
  { tier: 3, question: 'Италия құрамасының лақап аты қандай?', options: ['Аззурри', 'Селесао', 'Ла Ростерос', 'Ди Маннсшафт'], correctIndex: 0 },
  { tier: 3, question: 'Футболда бұрыштық соққы (корнер) қашан беріледі?', options: ['Доп қорғаушыдан соңғы рет тиіп, өз қақпа сызығынан шыққанда', 'Ойыншы фол жасағанда', 'Доп ойыннан тыс кеткенде', 'Гол соғылғанда'], correctIndex: 0 },
  { tier: 3, question: 'Әлем чемпионатын алғаш рет 1930 жылы қай ел қабылдады?', options: ['Бразилия', 'Уругвай', 'Франция', 'Италия'], correctIndex: 1 },
  { tier: 3, question: '«Хет-трик» дегеніміз не?', options: ['Бір ойыншының бір матчта 3 гол соғуы', 'Командаға берілген 3 карточка', '3 матчта жеңіске жету', 'Допты 3 рет қағу'], correctIndex: 0 },
  { tier: 3, question: 'Германия құрамасының лақап аты қандай?', options: ['Ди Маннсшафт', 'Тримонтиум', 'Ла Фурия', 'Селесао'], correctIndex: 0 },
];

let footballLastLevel = null;
let footballUsed = [];

function getFootballQuestion(level) {
  if (level !== footballLastLevel) {
    footballLastLevel = level;
    footballUsed = [];
  }
  const tier = level <= 2 ? 1 : level <= 4 ? 2 : 3;
  const pool = FOOTBALL_DATA.filter(q => q.tier === tier);
  let available = pool.filter(q => !footballUsed.includes(q));
  if (available.length === 0) {
    footballUsed = [];
    available = pool;
  }
  const q = available[Math.floor(Math.random() * available.length)];
  footballUsed.push(q);
  return { question: q.question, options: q.options, correctIndex: q.correctIndex };
}

window.FootballGame = createQuizGame({
  gameId: 'football',
  bodyId: 'football-body',
  levelId: 'football-level',
  scoreId: 'football-score',
  questionsPerLevel: 5,
  maxLevel: 6,
  getQuestion: getFootballQuestion
});
