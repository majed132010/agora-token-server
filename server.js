const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.APP_ID || '3a810a3ea5a24451ab56a6b7429c929c';
const APP_CERTIFICATE = process.env.APP_CERTIFICATE || '8fd58f69674f479484020a6c31e8f2bf';

app.get('/token', (req, res) => {
  try {
    const channel = req.query.channel || 'voice';
    const uid = parseInt(req.query.uid) || 0;
    const expireTime = 3600;
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    console.log('Generating token for channel:', channel, 'uid:', uid);
    console.log('APP_ID:', APP_ID);
    console.log('APP_CERTIFICATE length:', APP_CERTIFICATE ? APP_CERTIFICATE.length : 0);

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channel,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpireTime,
      privilegeExpireTime
    );

    console.log('Token generated successfully, length:', token ? token.length : 0);
    res.json({ token });
  } catch (err) {
    console.error('Token generation error:', err);
    res.status(500).json({ error: err.message, token: '' });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    status: 'Agora Token Server running ✅',
    app_id_set: !!APP_ID,
    cert_set: !!APP_CERTIFICATE,
    cert_length: APP_CERTIFICATE ? APP_CERTIFICATE.length : 0
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Token server running on port ${PORT}`);
  console.log('APP_ID:', APP_ID);
  console.log('APP_CERTIFICATE set:', !!APP_CERTIFICATE);
});
