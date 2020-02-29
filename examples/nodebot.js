require('dotenv').config()
const bot = require('../lib')
// const { exec } = require('child_process')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const c = require('chalk')

// nodebot help
const helpMenu = {
  usage: '(nodebot|@nodebot) [option]',
  options: [
    ['help', 'print this message'],
    ['why', 'why javascript?'],
    ['fact', 'true javascript facts'],
    ['get', 'get the repo'],
    ['dependencies', 'count dependencies'],
    ['secret', '?!']
  ]
}

const features = {
  heading: 'node-rocket-bot features',
  features: [
    ['tags', 'filter out common messages easily with tags'],
    ['help menu', 'help menu helper']
  ]
}

bot({
  /* create a file called .env in your project directory and dotenv will pull
   * the values. The file should look like this:
   *
   * HOST=your.host.whatever.com
   * USERNAME=bot
   * PASSWORD=password
   *
   * DO NOT COMMIT THIS FILE INTO YOUR GIT REPOSITORY
   */
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  //
  author: process.env.AUTHOR,
  messageOnException: process.env.AUTHOR,
  // whether to use pretty log output - default is
  // process.stdout.isTTY which should be good enough
  // (pretty output to stdout, basic to files or other
  // programs)
  // pretty: true,
  // use SSL - true for https
  ssl: true,
  // rooms to join on login
  rooms: ['bots'],
  // these are also the default ignore flags
  // messages with these flags won't make it to your bot
  ignoreFlags: ['fromSelf', 'read', 'notInRoom'],
  // less logging
  logLevels: {
    rocket: 'warn',
    user: 'debug',
    bot: 'info'
  },
  pretty: false,
  // only events that return true come through to process at all.
  // filtering out events in a filterFn is more efficient than waiting
  // until they end up in process. but does it really matter? not so much.
  filterFn: e =>
    e.flags.isMentioned ||
    e.message.content.toLowerCase().startsWith(e.bot.username.toLowerCase()),
  // after connection and login.
  // use this for any sort of one-time start behavior
  onConnection: async e => {
    // turn off most raw rocketchat api logging info
    e.loggers.rocket.level = 'warn'
    // set to debug to see basic log of ignored events
    // set to at least info to see log of sent messages
    e.loggers.bot.level = 'info'
    // this is the log to use if you want info/warn/debug/error API
    // note that it doesn't expand objects, so you should still use
    // console.log for that
    e.log.level = 'debug'
    e.log.info(`${e.bot.username} is listening`)
  },
  // process message
  onMessage: async e => {
    e.log.info('processing...')
    // get 1st 'argument'
    // for true commandline arguments you can use eg the 'yargs' package
    const words = e.message.content.split(' ')
    const operation = words[1] ? words[1].toLowerCase() : ''
    e.log.info(`operation is "${operation}"`)
    let response = null
    switch (operation) {
      case 'h': case '?': case 'help':
        response = e.ops.menu(helpMenu.usage, helpMenu.options)
        response += '\n ^ i have a helper making menus like this ez!'
        break
      case 'shh': case 'secret':
        response = 'I will not tell you my secret'
        e.respondToUser('There are no secrets in javascript. `nodebot get` ' +
          'to see all of mine')
        break
      case 'get':
        response = 'You can find me on ' +
          '[github](https://github.com/Tattomoosa/node-rocketchat-bot)'
        break
      case 'deps': case 'dep': case 'dependencies': case 'd': {
        const { stdout, stderr } = await exec('ls -l node_modules | wc -l')
        if (stderr) e.log.error(stderr)
        response = `I have ${stdout.slice(0, -1)} dependencies, and I'm \
                    sure they all do something really important and difficult \
                    to write from scratch.`
        break
      }
      case 'why': case 'node': case 'javascript':
        response = 'Why JavaScript? '
        response += pickRandom([
          'First the browser. Then the servers. Then the desktop. Then the world.',
          'Write once. Transpile. Polyfill. Build. Monkeypatch. Minify. ' +
          'Take it out of the browser. Put it in a browser that looks like an app. ' +
          'Add ads. Trackers. Crypto-miners.... Run anywhere.',
          'The *fastest* slow language',
          'The front end is *the end*, ok?',
          'Model-View-Control The World',
          "Because *it's not Java* -- not even a little bit!",
          "It's easy to be asynchronous when you're single-threaded",
          'The JavaScript left-pad function is so powerful it can take out whole chunks of the internet'
        ])
        break
      case 'features': case 'lib': case 'library':
        response = e.ops.menu(features.heading, features.features)
        break
      case 'fact': case 'f': case 'facts':
        response = 'According to javascript, '
        response += '`' + pickRandom([
          `Math.min() = ${Math.min()}`,
          `1 < 2 < 3 = ${1 < 2 < 3}`,
          `'5' + 3 = ${'5' + 3}\` but \`'5' - 3 = ${'5' - 3} `,
          `'b' + 'a' + + 'a' + 'a' = ${'b' + 'a' + +'a' + 'a'}`,
          `[1, 2, 3] + [4, 5, 6] = ${[1, 2, 3] + [4, 5, 6]}`,
          `true + true = ${true + true}`,
          `typeof NaN = ${typeof NaN}`,
          `typeof null = ${typeof null}`
        ]) + '`'
        break
      case '':
        response = 'What? Maybe try `nodebot help`?'
        break
      default: response = 'unknown command'
    }
    if (response) {
      e.log.info(' -> ')
      // you can respond as many times as you want to a message
      // and there is no need to await them.
      e.respond(response)
      return
    }
    e.log.info(c.grey(' X UNHANDLED'))
  }
})

const pickRandom = a => a[Math.floor(Math.random() * a.length)]
