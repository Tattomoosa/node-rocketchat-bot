import c from 'chalk'

const flags = (flags, color) =>
  flags.length
    ? flags
        .map(f => pad(camelToTitleCase(f), 1))
        .map(f => `${ color(f) }`)
        .join(' ') + '\n'
    : ''

const toUpperCase = c => c.toUpperCase()

const camelToTitleCase = str =>
  str
    .replace( /([A-Z])/g, ' $1')
    .replace( /^[a-z]/, toUpperCase)

const pad = (str, by = 1) => {
  const p = Array(by).fill(' ').join('')
  return p + str + p
}
const formatRoomText = (name, type) => name ? name : type

const IGNORE_COLOR = c.bgGrey
const EVENT_COLOR = c.green
const NAME_COLOR = c.blueBright
const MSG_COLOR = c.whiteBright
const ROOM_COLOR = c.magenta

const room = (name, type) => ROOM_COLOR(pad(`(${formatRoomText(name, type)})`))
const roomType = type => descriptiveRoomType(type)
const ignoreFlags = f => flags(f, IGNORE_COLOR)
const processNotifier = () => EVENT_COLOR('<event>')
const processEndNotifier = () => EVENT_COLOR('</event>')
const name = n => `${ NAME_COLOR(pad(n)) }`
const content = content => `${ MSG_COLOR(pad(content)) }`

const processStart = async pm => [
    processNotifier(),
    '\n',
    ignoreFlags(pm.trueFlags),
    room(await pm.room.getName(pm.room.id), pm.room.type),
    name(pm.message.author.name),
    '\n',
    content(pm.message.content)
  ].join('')

const simpleIgnored = async pm => '[ignored message]' +
    ` (${ formatRoomText(await pm.room.getName(pm.room.id), pm.room.type) }) ` +
    [ pm.message.author.name, pm.message.content ].join(': ') + ' -- ' +
    trueFlags.join(' ')

export default {
  name,
  room,
  content,
  roomType,
  ignoreFlags,
  processNotifier,
  processEndNotifier,
  format: { roomText: formatRoomText, },
  processStart,
  simpleIgnored,
  // eventStart: async (trueFlags, message, pm) => [
}
