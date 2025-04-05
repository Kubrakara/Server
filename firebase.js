const admin = require("firebase-admin");

// ✅ ÇÖZÜM: JSON içeriğini ortam değişkeninden alıyoruz
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db };
