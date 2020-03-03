import c from 'chalk'
import util from 'util'
// import roomTypes from './roomTypes'

const flags = (flags, color) =>
  flags.length
    ? flags
      .map(f => pad(camelToTitleCase(f), 1))
      .map(f => `${color(f)}`)
      .join(' ') + '\n'
    : ''

// const toUpperCase = c => c.toUpperCase()

const camelToTitleCase = str =>
  str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^[a-z]/, c => c.toUpperCase())

// const date = ts => new Date(ts)
const padTime = d => ('0' + d).substr(-2)
const time = d => {
  return (
    `${d.getHours()}:` +
    `${padTime(d.getMinutes())}:` +
    `${padTime(d.getSeconds())} ` +
    `${padTime(d.getMonth())}/` +
    `${padTime(d.getDate())}/` +
    `${padTime(d.getYear())} `
  )
  // const t = date.toISOString().split('T')
  // return t[1].split('.')[0] + ' ' + t[0].split('-').join('/')
}
const now = () => time(new Date())

const pad = (str, by = 1) => {
  const p = Array(by).fill(' ').join('')
  return p + str + p
}
const formatRoomText = (name, type) => name || type

const IGNORE_COLOR = c.bgGrey
const EVENT_COLOR = c.green
const NAME_COLOR = c.blueBright
const MSG_COLOR = c.whiteBright
const ROOM_COLOR = c.magenta

const room = (name, type) => ROOM_COLOR(pad(`(${formatRoomText(name, type)})`))
const ignoreFlags = f => flags(f, IGNORE_COLOR)
const processNotifier = ts => EVENT_COLOR(`<event (${time(ts)})>`)
const processEndNotifier = () => EVENT_COLOR('</event>')
const name = n => `${NAME_COLOR(pad(n))}`
const content = content => `${MSG_COLOR(pad(content))}`

const processStart = async pm => [
  processNotifier(pm.message.timestamp),
  '\n',
  ignoreFlags(pm.trueFlags),
  room(await pm.room.getName(pm.room.id), pm.room.type),
  name(pm.message.author.name),
  '\n',
  content(pm.message.content)
].join('')

const simpleIgnored = async (pm, filterOK) =>
  `[ ignored message ] (${time(pm.message.timestamp)}) ` +
  `message: [(${formatRoomText(pm.room
      ? await pm.room.getName(pm.room.id)
      : '', pm.room.type)}] ` +
  `${pm.message.author.name}: ${
      pm.message.content
        .split('\n').join('\\n')
        .split(/\s\s*/).join(' ')
  }] ` +
  `flags: [ ${pm.trueFlags.join(', ')} ] ` +
  `filterFn: ${filterOK ? 'passed' : 'failed'}`

const processFilter = ok => `[ filter function ] ${
  ok ? 'passed' : 'failed'
}`

const exceptionMsg = (pm, x) => '```\n' +
  `[[[ exception thrown ]]] (${now()})\n\n` +
  '```\n' + '``` json\n' +
  '[ message ]\n\n' +
  `${JSON.stringify({
    message: pm.message,
    err: pm.err,
    flags: pm.flags,
    bot: pm.bot,
    trueFlags: pm.trueFlags,
    room: pm.room,
    lastUpdate: pm.lastUpdate
  }, null, 2)}\n\n` +
  '```\n' + '``` bash \n' +
  '[ stack trace ]\n\n' +
  `${util.inspect(x)}` +
  '\n```'

const processIgnoreFlags = tf =>
  `[ no ignore flags ] ${!tf.length
  ? 'pass'
  : `failed: ${tf.join(', ')}`
  }`

export default {
  name,
  room,
  content,
  ignoreFlags,
  exceptionMsg,
  processNotifier,
  processEndNotifier,
  processIgnoreFlags,
  format: { roomText: formatRoomText },
  processFilter,
  processStart,
  simpleIgnored,
  time,
  now
  // eventStart: async (trueFlags, message, pm) => [
}
