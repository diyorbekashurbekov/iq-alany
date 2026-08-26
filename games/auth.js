// Аккаунт (Firebase Authentication) және ортақ рейтинг (Firestore) логикасы.
// Firebase бапталмаса (games/firebase-init.js ішінде REPLACE_ME тұрса),
// бұл файлдағы функциялар үнсіз ештеңе істемейді — сайт қонақ режимінде
// қалыпты жұмыс істей береді.

window.CloudUser = null; // ағымдағы Firebase user объектісі (немесе null)
window.CloudData = null; // { bests: {gameId: {level}}, achievements: [id...] }

function authErrorText(code) {
  const map = {
    'auth/email-already-in-use': 'Бұл email бұрын тіркелген. "Кіру" батырмасын басып көріңіз.',
    'auth/invalid-email': 'Email мекенжайы дұрыс емес.',
    'auth/weak-password': 'Құпия сөз кемінде 6 таңбадан тұруы керек.',
    'auth/user-not-found': 'Мұндай email тіркелмеген. "Тіркелу" батырмасын басыңыз.',
    'auth/wrong-password': 'Құпия сөз қате.',
    'auth/invalid-credential': 'Email немесе құпия сөз қате.',
    'auth/too-many-requests': 'Тым көп әрекет жасалды. Сәл күтіп қайталаңыз.',
    'auth/network-request-failed': 'Интернет байланысын тексеріңіз.'
  };
  return map[code] || 'Қате шықты. Қайталап көріңіз.';
}

function totalLevelOf(bests) {
  return Object.values(bests || {}).reduce((sum, b) => sum + (b && b.level ? b.level : 0), 0);
}

const CloudSync = {
  async loadUserDoc(uid) {
    const snap = await window.firestoreDb.collection('users').doc(uid).get();
    if (snap.exists) return snap.data();
    const fresh = { displayName: '', bests: {}, achievements: [], createdAt: Date.now() };
    await window.firestoreDb.collection('users').doc(uid).set(fresh);
    return fresh;
  },

  async migrateGuestProgress(guestName) {
    // Аккаунт жаңа ашылғанда, сол сессиядағы қонақ атының локалды
    // прогресін бұлтқа көшіреді (жоғалтпау үшін)
    if (!guestName) return;
    GAMES.forEach(g => {
      const key = `iqarena_best_${g.id}_${guestName}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const value = JSON.parse(raw);
        const existing = window.CloudData.bests[g.id];
        if (!existing || value.level > existing.level) {
          window.CloudData.bests[g.id] = value;
        }
      }
    });
    const achKey = `iqarena_achievements_${guestName}`;
    const rawAch = localStorage.getItem(achKey);
    if (rawAch) {
      const ids = JSON.parse(rawAch);
      const merged = new Set([...(window.CloudData.achievements || []), ...ids]);
      window.CloudData.achievements = [...merged];
    }
    await this.persistAll();
  },

  async persistAll() {
    if (!window.CloudUser) return;
    const uid = window.CloudUser.uid;
    await window.firestoreDb.collection('users').doc(uid).update({
      bests: window.CloudData.bests,
      achievements: window.CloudData.achievements
    });
    await this.updateLeaderboardEntry();
  },

  async saveBest(gameId, value) {
    if (!window.CloudUser) return;
    window.CloudData.bests[gameId] = value;
    const uid = window.CloudUser.uid;
    await window.firestoreDb.collection('users').doc(uid).update({
      [`bests.${gameId}`]: value
    });
    await this.updateLeaderboardEntry();
  },

  async saveAchievements(list) {
    if (!window.CloudUser) return;
    window.CloudData.achievements = list;
    const uid = window.CloudUser.uid;
    await window.firestoreDb.collection('users').doc(uid).update({ achievements: list });
  },

  async updateLeaderboardEntry() {
    if (!window.CloudUser) return;
    const uid = window.CloudUser.uid;
    await window.firestoreDb.collection('leaderboard').doc(uid).set({
      displayName: window.CloudUser.displayName || 'Ойыншы',
      totalLevel: totalLevelOf(window.CloudData.bests),
      gamesPlayed: Object.keys(window.CloudData.bests).length,
      achievementsCount: (window.CloudData.achievements || []).length,
      updatedAt: Date.now()
    });
  },

  async fetchLeaderboard(limit) {
    const snap = await window.firestoreDb.collection('leaderboard')
      .orderBy('totalLevel', 'desc')
      .limit(limit || 20)
      .get();
    return snap.docs.map(d => d.data());
  }
};

window.CloudSync = CloudSync;

window.Auth = {
  isReady() {
    return !!window.firebaseReady;
  },

  async register(email, password, displayName, guestName) {
    const cred = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: displayName || email.split('@')[0] });
    window.CloudUser = cred.user;
    window.CloudData = await CloudSync.loadUserDoc(cred.user.uid);
    await window.firestoreDb.collection('users').doc(cred.user.uid).update({ displayName: window.CloudUser.displayName });
    await CloudSync.migrateGuestProgress(guestName);
  },

  async login(email, password) {
    const cred = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
    window.CloudUser = cred.user;
    window.CloudData = await CloudSync.loadUserDoc(cred.user.uid);
  },

  async logout() {
    await window.firebaseAuth.signOut();
    window.CloudUser = null;
    window.CloudData = null;
  }
};
