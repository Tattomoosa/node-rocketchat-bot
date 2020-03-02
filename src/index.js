import { driver } from '@rocket.chat/sdk'
import processMessage from './processMessage'
import createLoggers from './logger'
import prettyPrint from './prettyPrint'

console.log(process.env.NODE_ENV)

// Default only use colors if TTY.
const isTTY = Boolean(process.stdout.isTTY)

const defaultLogLevels = {
  rocket: 'warn',
  bot: process.env.NODE_ENV === 'development'
    ? 'debug'
    : 'info',
  user: 'debug'
}

// Accept all
const defaultFilterFn = _event => true

export default async ({
  host = '',
  username = '',
  password,
  author = '',
  // message on exception, message author if true
  // or specified user if string
  messageOnException = null,
  ssl: useSsl = true,
  rooms: _rooms,
  // run on wake
  onConnection,
  // run on message
  onMessage,
  // use colors?
  colors = isTTY,
  // pretty output?
  pretty = isTTY,
  loggers = null,
  // logLevels = { rocket: 'warn', bot: 'info', user: 'debug' },
  logLevels,
  // pass a function here to ignore messages you can't ignore with flags
  filterFn = defaultFilterFn,
  // flags:
  // pass empty array to disable defaults, not recommended
  // except 'read' if you want to track message edits
  ignoreFlags = ['fromSelf', 'read', 'notInRoom']
  // ignoreFlags = []
}) => {
  // if true, author. otherwise, presume a string or false or null, all work out
  const messageExceptions =
    messageOnException === true
      ? author
      : messageOnException
  const levels = Object.assign({}, defaultLogLevels, logLevels)
  console.log(levels)
  if (!loggers) { loggers = createLoggers({ colors, levels, username }) }
  // Initialize
  loggers.bot.info('[ init ] initializing...')
  if (!colors && pretty) {
    loggers.bot.warn('[ invalid options ] pretty setting requires colors. disabling...')
    pretty = false
  }
  driver.useLog(loggers.rocket)

  // Connect
  loggers.bot.info('[ connect ] connecting...')
  await driver.connect({ host, useSsl })

  // Log in
  loggers.bot.info('[ login ] logging in...')
  const id = await driver.login({ username, password })

  // Subscribe
  loggers.bot.info('[ subcribe ] subscribing...')
  await driver.joinRooms(_rooms)
  await driver.subscribeToMessages()

  // Make bot
  const bootDate = Date.now()
  let lastUpdate = bootDate
  const bot = { id, username, bootDate }

  // Wake (first callback)
  loggers.bot.info('[ wake ] waking bot...')
  await onConnection({ log: loggers.user, loggers: loggers, bot: { ...bot } })

  // Start message loop
  loggers.bot.info('[ ready ] reacting to messages...')
  driver.reactToMessages(async (err, message, messageOptions) => {
    const pm = processMessage({
      err,
      message,
      messageOptions,
      lastUpdate,
      ignoreFlags,
      bot,
      loggers,
      driver
    })

    const filterOK = filterFn(pm)
    loggers.bot.debug(`[ passes filter function ] ${
      filterOK
        ? 'pass'
        : 'fail'}`)
    // No ignore flags are true
    const trueIgnoreFlags = pm.trueFlags.filter(f => ignoreFlags.includes(f))
    const noIgnoreFlags = !trueIgnoreFlags.length
    // const noIgnoreFlags  = !pm.trueFlags.some(f => ignoreFlags.includes(f))
    // Any respondTo string is true
    // TODO
    loggers.bot.debug(`[ no ignore flags ] ${noIgnoreFlags
      ? 'pass'
      : `fail: ${
        trueIgnoreFlags
          .map(f => `[ ${f} ]`)
          .join(' ')
          } `}`)
    if (err) { loggers.bot.warn('Error in message: ' + err) }
    if (filterOK && noIgnoreFlags) {
      loggers.bot.debug('[ all ok ] triggering response')
      if (pretty) { console.log(await prettyPrint.processStart(pm)) }

      try {
        await onMessage(pm)
      } catch (x) {
        const exceptionMsg = prettyPrint.exceptionMsg(pm, x)
        loggers.user.error(exceptionMsg)
        if (messageExceptions) { driver.sendDirectToUser(exceptionMsg, messageExceptions) }
      }

      if (pretty) { console.log(prettyPrint.processEndNotifier()) }
    } else loggers.bot.info(await prettyPrint.simpleIgnored(pm, filterOK))

    lastUpdate = Date.now()
  })
}
