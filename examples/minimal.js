require('dotenv').config()
const bot = require('../lib').default

/* create a file called .env in your project directory and dotenv will pull
 * the values. The file should look like this:
 *
 * HOST=your.host.whatever.com
 * USERNAME=bot
 * PASSWORD=password
 *
 * Take care not to commit this file to a git repository
 */

bot({
  // from .env
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  // use ssl for https
  ssl: true,
  // join room(s)
  rooms: ['bots'],
  // when ready (can also console.log)
  wake: async e => e.log.info(`${e.bot.username} ready`),
  // on message
  process: async e => {
    if (e.flags.isMentioned)
      e.respond(`hi ${e.message.author.name} thanks for mentioning me`)
  }
})

// more detailed help in nodebot.js
