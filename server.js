const express = require("express");
const fetch = require("node-fetch");
const { db } = require("./firebase_config");

const app = express();
app.use(express.json());

/**
 * Firestore'dan tüm push token'ları çek
 */
const getAllTokens = async () => {
  const snapshot = await db.collection("pushTokens").get();
  return snapshot.docs.map((doc) => doc.data().token);
};

/**
 * Expo'ya push bildirimi gönder
 */
const sendExpoPush = async (tokens, title, body, data = {}) => {
  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data,
  }));

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  return response.json();
};

/**
 * Firestore'dan tüm tokenları alıp bildirimi Expo'ya gönder
 */
app.get("/send", async (req, res) => {
  const title = "🔥 Yangın Alarmı";
  const body =
    "Bölgenizde hızla yayılan bir yangın tespit edildi. Yetkililerin tahliye talimatlarını takip ediniz.";
  const data = { screen: "Home" };

  try {
    const tokens = await getAllTokens();

    if (!tokens.length) {
      return res
        .status(404)
        .json({ success: false, message: "Firestore'da token bulunamadı." });
    }

    const result = await sendExpoPush(tokens, title, body, data);
    return res.json({ success: true, sent: tokens.length, result });
  } catch (err) {
    console.error("❌ Bildirim hatası:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log(
    "🔥 Sadece Firestore -> Expo bildirim sunucusu çalışıyor (port 3000)"
  );
});
