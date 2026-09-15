// IQ Алаңы — Келушілер мен нәтижелерді қадағалау жүйесі (Telegram Bot)

const TRACKER_CONFIG = {
  botToken: '8864316889:AAHf9GBBtJ1Dyj3pPEuAcWkomPHL-TtL_SU',
  chatId: '5827497367', // Diyarbek Telegram Chat ID
  siteName: 'IQ Алаңы',
  siteUrl: 'https://diyorbekashurbekov.github.io/iq-alany/'
};

const GAME_NAMES = {
  twenty48: '🟩 2048',
  snake: '🐍 Жылан',
  simon: '🎨 Түстер тізбегі',
  whack: '🔨 Кроттарды ұста',
  numbers: '🔢 Логика жұмбақтары',
  memory: '🧩 Жады ойыны',
  geo: '🌍 География шебері',
  origins: '🧭 Қайдан шықты?',
  world: '🌐 Әлем білімі'
};

const Tracker = {
  getFormattedTime() {
    try {
      return new Date().toLocaleString('kk-KZ', {
        timeZone: 'Asia/Almaty',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return new Date().toLocaleString();
    }
  },

  getDeviceInfo() {
    const ua = navigator.userAgent || '';
    let device = 'Компьютер (PC)';
    if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
      device = 'Планшет';
    } else if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
      device = 'Смартфон (Телефон)';
    }

    let os = 'Белгісіз ОЖ';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS (Apple)';
    else if (/Macintosh|Mac OS/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';

    let browser = 'Белгісіз браузер';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/Chrome\//i.test(ua)) browser = 'Chrome';
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';
    else if (/Firefox\//i.test(ua)) browser = 'Firefox';
    else if (/Opera|OPR\//i.test(ua)) browser = 'Opera';

    return {
      device: `${device} · ${os}`,
      browser,
      screen: `${window.screen.width}x${window.screen.height}`
    };
  },

  async getLocationInfo() {
    try {
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return {
          ip: data.ip || '',
          city: data.city || '',
          country: data.country_name || data.country || '',
          org: data.org || ''
        };
      }
    } catch (e) {
      try {
        const res2 = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2000) });
        if (res2.ok) {
          const data2 = await res2.json();
          return { ip: data2.ip || '', city: '', country: '' };
        }
      } catch (err) {}
    }
    return { ip: 'Белгісіз', city: '', country: '' };
  },

  async sendTelegram(text) {
    if (!TRACKER_CONFIG.botToken || !TRACKER_CONFIG.chatId) {
      console.warn('Tracker: Telegram Bot токені немесе Chat ID орнатылмаған.');
      return;
    }
    try {
      const url = `https://api.telegram.org/bot${TRACKER_CONFIG.botToken}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TRACKER_CONFIG.chatId,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });
    } catch (e) {
      console.error('Tracker хабарлама жіберу қатесі:', e);
    }
  },

  getCurrentPlayer() {
    try {
      if (window.Store && typeof window.Store.getPlayer === 'function') {
        const p = window.Store.getPlayer();
        if (p) return p;
      }
    } catch (e) {}
    return localStorage.getItem('iqarena_player') || '';
  },

  // 1. Сайтқа кірген кезде
  async logVisit() {
    if (sessionStorage.getItem('iq_visit_sent')) return;
    sessionStorage.setItem('iq_visit_sent', '1');

    const dev = this.getDeviceInfo();
    const loc = await this.getLocationInfo();
    const time = this.getFormattedTime();
    const player = this.getCurrentPlayer() || 'Аты әлі жазылмаған';

    let locStr = loc.ip;
    if (loc.city || loc.country) {
      locStr += ` (${[loc.city, loc.country].filter(Boolean).join(', ')})`;
    }

    const msg = [
      '🟢 <b>[IQ Алаңы] Жаңа адам сайтқа кірді!</b>',
      '',
      `👤 <b>Ойыншы:</b> ${player}`,
      `📱 <b>Құрылғы:</b> ${dev.device}`,
      `🌐 <b>Браузер:</b> ${dev.browser} (${dev.screen})`,
      `📍 <b>IP / Орны:</b> ${locStr}`,
      `🕒 <b>Уақыты:</b> ${time}`,
      `🔗 <b>Сілтеме:</b> ${window.location.href}`
    ].join('\n');

    await this.sendTelegram(msg);
  },

  // 2. Ойыншы атын жазғанда немесе аккаунтпен кіргенде
  async logPlayerName(name, mode = 'guest') {
    if (!name) return;
    const time = this.getFormattedTime();
    const dev = this.getDeviceInfo();
    const modeName = mode === 'account' ? '☁️ Аккаунт' : '👤 Қонақ режимі';

    const msg = [
      '👤 <b>[IQ Алаңы] Ойыншы кірді/атын жазды</b>',
      '',
      `✨ <b>Аты-жөні:</b> ${name}`,
      `🔑 <b>Режим:</b> ${modeName}`,
      `📱 <b>Құрылғы:</b> ${dev.device}`,
      `🕒 <b>Уақыты:</b> ${time}`
    ].join('\n');

    await this.sendTelegram(msg);
  },

  // 3. Ойын аяқталғанда / нәтиже шыққанда
  async logGameResult({ gameId, level, score, maxLevel, passed, extra }) {
    const gameName = GAME_NAMES[gameId] || gameId;
    const player = this.getCurrentPlayer() || 'Белгісіз ойыншы';
    const time = this.getFormattedTime();

    let status = '';
    if (passed === true) {
      status = '✅ Деңгейден өтті!';
    } else if (passed === false) {
      status = '❌ Өтпеді (Қайталау)';
    }

    const lines = [
      '🎯 <b>[IQ Алаңы] Ойын нәтижесі!</b>',
      '',
      `👤 <b>Ойыншы:</b> ${player}`,
      `🎮 <b>Ойын:</b> ${gameName}`,
      level !== undefined ? `⭐ <b>Деңгей:</b> ${level}${maxLevel ? ` / ${maxLevel}` : ''}` : '',
      status ? `📊 <b>Күйі:</b> ${status}` : '',
      score !== undefined && score !== null ? `🔢 <b>Ұпай:</b> ${score}` : '',
      extra ? `ℹ️ <b>Ақпарат:</b> ${extra}` : '',
      `🕒 <b>Уақыты:</b> ${time}`
    ].filter(Boolean);

    await this.sendTelegram(lines.join('\n'));
  },

  // 4. Жаңа рекорд / үздік деңгей орнатылғанда
  async logNewBest(gameId, level) {
    const gameName = GAME_NAMES[gameId] || gameId;
    const player = this.getCurrentPlayer() || 'Ойыншы';
    const time = this.getFormattedTime();

    const msg = [
      '🏆 <b>[IQ Алаңы] ЖАҢА РЕКОРД!</b>',
      '',
      `👤 <b>Ойыншы:</b> ${player}`,
      `🎮 <b>Ойын:</b> ${gameName}`,
      `🚀 <b>Жаңа үздік деңгей:</b> ${level}`,
      `🕒 <b>Уақыты:</b> ${time}`
    ].join('\n');

    await this.sendTelegram(msg);
  },

  // 5. Жетістік ашылғанда
  async logAchievement(ach) {
    const player = this.getCurrentPlayer() || 'Ойыншы';
    const time = this.getFormattedTime();

    const msg = [
      '🏅 <b>[IQ Алаңы] Жаңа жетістік ашылды!</b>',
      '',
      `👤 <b>Ойыншы:</b> ${player}`,
      `🎖️ <b>Жетістік:</b> ${ach.icon || '⭐'} ${ach.title || ''}`,
      `📝 <b>Сипаттама:</b> ${ach.desc || ''}`,
      `🕒 <b>Уақыты:</b> ${time}`
    ].join('\n');

    await this.sendTelegram(msg);
  }
};

window.Tracker = Tracker;
