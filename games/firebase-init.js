// Firebase баптаулары.
//
// Қалай баптау керек (Firebase Console — тегін, Google аккаунт жеткілікті):
//   1. https://console.firebase.google.com/ сайтына кіріп, "Add project" басыңыз.
//   2. Жоба жасалған соң, "</> Web app" (веб қолданба) қосыңыз — атын кез келген
//      қойыңыз, Firebase Hosting керек емес.
//   3. Сізге көрсетілетін firebaseConfig объектісін көшіріп, төмендегі
//      FIREBASE_CONFIG орнына қойыңыз.
//   4. Сол жоба ішінде: Build → Authentication → Get started → Email/Password
//      провайдерін іске қосыңыз.
//   5. Build → Firestore Database → Create database → production mode.
//      Content Database жасалған соң, "Rules" бөліміне мына ережелерді
//      қойыңыз (firestore.rules файлын қараңыз) және "Publish" басыңыз.

const FIREBASE_CONFIG = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME.appspot.com',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME'
};

window.firebaseReady = false;
window.firestoreDb = null;
window.firebaseAuth = null;

(function initFirebase() {
  if (FIREBASE_CONFIG.apiKey === 'REPLACE_ME') {
    console.warn('Firebase баптаулары әлі толтырылмаған — тек қонақ режимі жұмыс істейді.');
    return;
  }
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    window.firestoreDb = firebase.firestore();
    window.firebaseAuth = firebase.auth();
    window.firebaseReady = true;
  } catch (e) {
    console.error('Firebase іске қосылмады:', e);
  }
})();
