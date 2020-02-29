import { driver } from '@rocket.chat/sdk'
import processMessage from './processMessage'
import createLoggers from './logger'
import prettyPrint from './prettyPrint'
// import roomTypes from './roomTypes'
// import createIgnoreFlags from './ignoreFlags'

const isTTY = Boolean(process.stdout.isTTY)

const defaultLogLevels = {
  rocket: 'warn',
  bot: 'info',
  user: 'debug'
}

export default async ({
  host = '',
  username = '',
  password,
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
  // logLevel = { rocket: 'warn', bot: 'info', user: 'debug' },
  logLevels = {},
  // pass a function here to ignore messages you can't ignore with flags
  filterFn = () => true,
  // flags:
  // pass empty array to disable defaults, not recommended
  // except maybe 'read' if you want to track message edits for some reason
  ignoreFlags = ['fromSelf', 'read', 'notInRoom']
}) => {
  const levels = Object.assign({}, defaultLogLevels, logLevels)
  if (!loggers) { loggers = createLoggers({ colors, levels, username }) }
  // Initialize
  loggers.bot.debug('[ init ] initializing...')
  if (!colors && pretty) {
    loggers.bot.warn('[ invalid options ] pretty setting requires colors. disabling...')
    pretty = false
  }
  driver.useLog(loggers.rocket)

  // Connect
  loggers.bot.debug('[ connect ] connecting...')
  await driver.connect({ host, useSsl })

  // Log in
  loggers.bot.debug('[ login ] logging in...')
  const id = await driver.login({ username, password })

  // Subscribe
  loggers.bot.debug('[ subcribe ] subscribing...')
  await driver.joinRooms(_rooms)
  await driver.subscribeToMessages()

  // Make bot
  const bootDate = Date.now()
  let lastUpdate = bootDate
  const bot = { id, username, bootDate }

  // Wake (first callback)
  loggers.bot.debug('[ wake() ] waking bot...')
  await onConnection({ log: loggers.user, loggers: loggers, bot: { ...bot } })

  // Start message loop
  loggers.bot.debug('[ process() ready ] reacting to messages...')
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

    if (pm && filterFn(pm)) {
      if (pretty) { console.log(await prettyPrint.processStart(pm)) }

      await onMessage(pm)

      if (pretty) { console.log(prettyPrint.processEndNotifier()) }
    } else if (loggers.bot.level === 'debug') { loggers.bot.debug(prettyPrint.simpleIgnored(pm)) }

    lastUpdate = Date.now()
  })
}
