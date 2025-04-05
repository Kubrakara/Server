const admin = require("firebase-admin");
const serviceAccount = require("./alertapp-firebase-adminsdk.json"); // Bu dosyayı projeye dahil et

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { db };
