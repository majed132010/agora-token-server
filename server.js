const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.APP_ID || '3a810a3ea5a24451ab56a6b7429c929c';
const APP_CERTIFICATE = process.env.APP_CERTIFICATE || '8fd58f69674f479484020a6c31e8f2bf';

app.get('/token', (req, res) => {
  const channel = req.query.channel || 'voice';
  const uid = parseInt(req.query.uid) || 0;
  const expireTime = 3600; // ساعة واحدة

  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channel,
    uid,
    RtcRole.PUBLISHER,
    privilegeExpireTime,
    privilegeExpireTime
  );

  res.json({ token });
});

app.get('/', (req, res) => {
  res.json({ status: 'Agora Token Server running ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Token server running on port ${PORT}`);
});
