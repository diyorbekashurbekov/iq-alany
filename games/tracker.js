// IQ Алаңы — Келушілер мен нәтижелерді қадағалау жүйесі (Telegram Bot + Telegram Mini App)

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
  getTelegramUser() {
    try {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        return window.Telegram.WebApp.initDataUnsafe.user || null;
      }
    } catch (e) {}
    return null;
  },

  isTelegramApp() {
    return !!this.getTelegramUser();
  },

  getCurrentPlayer() {
    const tgUser = this.getTelegramUser();
    if (tgUser) {
      const full = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ');
      return full || tgUser.username || 'Telegram ойыншысы';
    }
    try {
      if (window.Store && typeof window.Store.getPlayer === 'function') {
        const p = window.Store.getPlayer();
        if (p) return p;
      }
    } catch (e) {}
    return localStorage.getItem('iqarena_player') || '';
  },

  formatPlayerIdentity(explicitName) {
    const tgUser = this.getTelegramUser();
    if (tgUser) {
      const name = explicitName || [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') || tgUser.username || 'Ойыншы';
      const userLink = `<a href="tg://user?id=${tgUser.id}"><b>${name}</b></a>`;
      const uname = tgUser.username ? ` (@${tgUser.username})` : ' (юзернеймсіз)';
      const prem = tgUser.is_premium ? ' ⭐ <i>Premium</i>' : '';
      const lang = tgUser.language_code ? ` [${tgUser.language_code}]` : '';
      return `${userLink}${uname}${prem}${lang}\n🆔 <b>Telegram ID:</b> <code>${tgUser.id}</code>`;
    }
    const name = explicitName || this.getCurrentPlayer();
    if (name) {
      return `<b>${name}</b> <i>(Браузер арқылы)</i>`;
    }
    return '<i>Аты әлі жазылмаған (Қонақ)</i>';
  },

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
    if (this.isTelegramApp()) {
      browser = 'Telegram Mini App (Ішкі браузер)';
    } else if (/Edg\//i.test(ua)) browser = 'Edge';
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
          country: data.country_name || data.country || ''
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

  // Telegram Haptic Feedback (Телефонның дірілдеуі)
  haptic(type = 'light') {
    try {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        const h = window.Telegram.WebApp.HapticFeedback;
        if (type === 'success' || type === 'error' || type === 'warning') {
          h.notificationOccurred(type);
        } else if (type === 'selection') {
          h.selectionChanged();
        } else {
          h.impactOccurred(type); // 'light', 'medium', 'heavy', 'rigid', 'soft'
        }
      }
    } catch (e) {}
  },

  // 1. Сайтқа кірген кезде
  async logVisit() {
    if (sessionStorage.getItem('iq_visit_sent')) return;
    sessionStorage.setItem('iq_visit_sent', '1');

    const dev = this.getDeviceInfo();
    const loc = await this.getLocationInfo();
    const time = this.getFormattedTime();
    const playerBlock = this.formatPlayerIdentity();
    const isTg = this.isTelegramApp();

    let locStr = loc.ip;
    if (loc.city || loc.country) {
      locStr += ` (${[loc.city, loc.country].filter(Boolean).join(', ')})`;
    }

    const title = isTg
      ? '🟢 <b>[IQ Алаңы] Жаңа адам кірді (Telegram Mini App)!</b>'
      : '🟢 <b>[IQ Алаңы] Жаңа адам сайтқа кірді (Браузер)!</b>';

    const msg = [
      title,
      '',
      `👤 <b>Ойыншы:</b>\n${playerBlock}`,
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
    const modeName = mode === 'account' ? '☁️ Аккаунт' : (this.isTelegramApp() ? '📱 Telegram Mini App' : '👤 Қонақ режимі');
    const playerBlock = this.formatPlayerIdentity(name);

    const msg = [
      '👤 <b>[IQ Алаңы] Ойыншы тіркелді/кірді:</b>',
      '',
      playerBlock,
      `🔑 <b>Режим:</b> ${modeName}`,
      `📱 <b>Құрылғы:</b> ${dev.device}`,
      `🕒 <b>Уақыты:</b> ${time}`
    ].join('\n');

    await this.sendTelegram(msg);
  },

  // 3. Ойын аяқталғанда / нәтиже шыққанда
  async logGameResult({ gameId, level, score, maxLevel, passed, extra }) {
    const gameName = GAME_NAMES[gameId] || gameId;
    const playerBlock = this.formatPlayerIdentity();
    const time = this.getFormattedTime();

    let status = '';
    if (passed === true) {
      status = '✅ Деңгейден өтті!';
      this.haptic('success');
    } else if (passed === false) {
      status = '❌ Өтпеді (Қайталау)';
      this.haptic('error');
    } else {
      this.haptic('medium');
    }

    const lines = [
      '🎯 <b>[IQ Алаңы] Ойын нәтижесі!</b>',
      '',
      `👤 <b>Ойыншы:</b>\n${playerBlock}`,
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
    const playerBlock = this.formatPlayerIdentity();
    const time = this.getFormattedTime();
    this.haptic('success');

    const msg = [
      '🏆 <b>[IQ Алаңы] ЖАҢА РЕКОРД!</b>',
      '',
      `👤 <b>Ойыншы:</b>\n${playerBlock}`,
      `🎮 <b>Ойын:</b> ${gameName}`,
      `🚀 <b>Жаңа үздік деңгей:</b> ${level}`,
      `🕒 <b>Уақыты:</b> ${time}`
    ].join('\n');

    await this.sendTelegram(msg);
  },

  // 5. Жетістік ашылғанда
  async logAchievement(ach) {
    const playerBlock = this.formatPlayerIdentity();
    const time = this.getFormattedTime();
    this.haptic('success');

    const msg = [
      '🏅 <b>[IQ Алаңы] Жаңа жетістік ашылды!</b>',
      '',
      `👤 <b>Ойыншы:</b>\n${playerBlock}`,
      `🎖️ <b>Жетістік:</b> ${ach.icon || '⭐'} ${ach.title || ''}`,
      `📝 <b>Сипаттама:</b> ${ach.desc || ''}`,
      `🕒 <b>Уақыты:</b> ${time}`
    ].join('\n');

    await this.sendTelegram(msg);
  }
};

window.Tracker = Tracker;
