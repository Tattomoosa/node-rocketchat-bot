require('dotenv').config()
const rocketman = require('../lib').default
const winston = require('winston')
const { exec } = require('child_process')
const c = require('chalk')

// colors
const errorColor = t => c.red(t)
const ignoreColor = t => c.bgGrey(t)
// rocketchat api logger so we can change its logging behavior
// (any object with methods debug, info, error, warning works)
const logFormat = winston.format.printf(
  ({ level, message }) => {
    let l_color
      = level === 'info' ? c.grey
      : level === 'warning' ? c.redBright
      : level === 'debug' ? c.blue
      : level === 'error' ? c.red
      : c.white
    return `${ c.grey('[[ ROCKET ]]') } ${ l_color(`${message}`) }`
})
const rocket_logger = winston.createLogger({
  format: logFormat,
  transports: [ new winston.transports.Console() ]
})

// shorthand
const log = console.log

// do the thing
rocketman({
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  name: 'nody boy',
  colors: true,
  ssl: true,
  rooms: ['GENERAL', 'bots'],
  logger: rocket_logger,
  // Recommended filter flags (Also default, pass empty array to remove)
  filterFlags: ['fromSelf', 'read'],
  wake: async e => {
    rocket_logger.level = 'error'
    log(`${c.green.bold(`${e.bot.username} is listening`)}`)
  },
  // process event
  process: async e => {
    // Circumstances under which we may not want to respond
    // Can be filtered automatically with the 'filterFlags'
    // option (recommended)
    const ignoreFlags = [
      [ e.isErr, errorColor('ERROR') ],
      [ e.read, ignoreColor(' Read ') ],
      [ e.wasBeforeBoot, ignoreColor(' Before Boot ') ],
      [ e.fromSelf, ignoreColor(' From Self ') ],
      [ e.fromBot, ignoreColor(' From Bot ') ],
      [ e.wasBeforeLastUpdate, ignoreColor(' Before Last Update ') ],
      [ !e.roomParticipant, ignoreColor(' Not in Room ') ],
    ]
    log(c.magenta('\nEVENT'))
    // Print flags
    const trueIgnores = ignoreFlags.filter(f => f[0])
    if (trueIgnores.length)
      log(trueIgnores.map(f => `${ f[1] } `).join(''))
    // Print room / message
    log(`${c.blue(await e.prettyRoom())}\n${e.prettyString()}`)
    // if any ignore flags are true
    if (trueIgnores.length > 0)
      return log(c.grey(' X IGNORE'))
    // Respond
    if (e.message.content.toLowerCase().startsWith(e.bot.username.toLowerCase())) {
      log(c.green(' -> RESPOND'))
      // execute shell command and respond with output
      exec('ls -l node_modules | wc -l', (err, stdout, stderr) =>
        err || stderr
          ? e.respond(`...something went wrong`)
          : e.respond(`Hi I'm ${e.bot.username}, I have ${
            stdout.slice(0, -1)} dependencies.`)
      )
      return
    }
    return log(c.grey(' X UNHANDLED'))
  }
})
