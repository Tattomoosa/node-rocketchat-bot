require('dotenv').config()
const bot = require('../lib')

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
  author: process.env.AUTHOR,
  // use ssl for https
  ssl: true,
  // join room(s) - will also join any room it's mentioned in
  rooms: ['bots'],
  // counts as a 'name' - matched by tags
  ignoreFlags: ['fromSelf', 'read', 'notInRoom'],
  messageOnException: true,
  // when ready (can also console.log)
  onConnection: async e => e.log.info(`${e.bot.username} ready`),
  // on message
  onMessage: async e => {
    e.bork(e)
  }
})
