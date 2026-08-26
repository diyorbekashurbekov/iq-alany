// Ортақ дыбық жүйесі — бөлек аудио файл қажет етпейді, дыбыстар кодпен генерацияланады

let soundCtx = null;

function soundEnsureCtx() {
  if (!soundCtx) {
    try {
      soundCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { /* дыбыс қолдау жоқ құрылғы */ }
  }
  return soundCtx;
}

function soundIsMuted() {
  return localStorage.getItem('iqarena_muted') === '1';
}

function soundToggleMute() {
  localStorage.setItem('iqarena_muted', soundIsMuted() ? '0' : '1');
  return soundIsMuted();
}

function soundTone(freq, startOffset, duration, type = 'sine', peakGain = 0.16) {
  const ctx = soundEnsureCtx();
  if (!ctx || soundIsMuted()) return;
  const t0 = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peakGain, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

const SOUND_PRESETS = {
  click: () => soundTone(520, 0, 0.06, 'triangle', 0.10),
  correct: () => { soundTone(523.25, 0, 0.14); soundTone(659.25, 0.09, 0.18); },
  wrong: () => soundTone(150, 0, 0.22, 'square', 0.12),
  levelup: () => { soundTone(523.25, 0, 0.12); soundTone(659.25, 0.1, 0.12); soundTone(783.99, 0.2, 0.22); },
  champion: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => soundTone(f, i * 0.13, 0.28));
  },
  gameover: () => { soundTone(392.0, 0, 0.18); soundTone(261.63, 0.12, 0.3); },
  eat: () => soundTone(700, 0, 0.07, 'triangle', 0.12),
};

window.Sound = {
  play(name) {
    const fn = SOUND_PRESETS[name];
    if (fn) fn();
  },
  isMuted: soundIsMuted,
  toggleMute: soundToggleMute
};
