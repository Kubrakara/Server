const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Expo } = require("expo-server-sdk");
const { db } = require("./firebase");
const checkApiKey = require("./middleware/apiKey");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔐 API key middleware burada
app.use(checkApiKey);

const expo = new Expo();
const TOKENS_COLLECTION = "pushTokens";

// ... (saveToken, getAllTokens fonksiyonları aynı)

// 💾 Token kaydetme
app.post("/register-token", async (req, res) => {
  const { token } = req.body;
  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).send({ error: "Invalid Expo Push Token" });
  }
  try {
    await saveToken(token);
    res.send({ success: true });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// 📤 Bildirim gönderme
app.post("/send-notification", async (req, res) => {
  const { title, body, data } = req.body;

  try {
    const tokens = await getAllTokens();
    const messages = tokens.map((pushToken) => ({
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    res.send({ success: true, tickets });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// Test route
app.get("/", (req, res) => res.send("✅ API Key protected backend"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
