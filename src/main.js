const express = require('express');
const app = express();

const { initializeTelegramBot, subscriptions } = require('./telegram-bot');
initializeTelegramBot(); 

const adminApp = require('./admin-panel');
app.get('/', (req, res) => {
    res.send('Please go to the bot named assignmentrashiBot');
  });
  
  app.get('/admin', (req, res) => {
    res.send('Admin Panel');
  });
app.use('/admin', adminApp);

const PORT = 5500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
