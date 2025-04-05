const admin = require("firebase-admin");
const serviceAccount = require("./alertapp-server-firebase-adminsdk-fbsvc-33b1c76e8b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db };
