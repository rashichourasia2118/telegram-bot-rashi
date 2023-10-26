const { Telegraf } = require('telegraf');

const subscriptions = {};

function initializeTelegramBot() {
  const bot = new Telegraf('6413883006:AAG1Q3S9G9r-CMgUm9rSRySMUkiAUePzn6U');

  bot.start((ctx) => {
    ctx.reply('Welcome to the Telegram Bot! Type /subscribe {city} to get daily weather updates for a specific city.');
  });

  bot.command('subscribe', (ctx) => {
    const message = ctx.message.text;
    const [, city] = message.split(' ');

    if (!city) {
      ctx.reply('Please provide a city name after the /subscribe command. Example: /subscribe London');
    } else {
      const userId = ctx.from.id;

      subscriptions[userId] = city;

      ctx.reply(`You are now subscribed to daily weather updates for ${city}`);
    }
  });

  bot.launch().then(() => {
    console.log('Bot is running');
  });
}

module.exports = { initializeTelegramBot, subscriptions };
