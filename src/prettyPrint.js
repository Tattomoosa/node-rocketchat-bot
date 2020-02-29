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
  str.replace( /([A-Z])/g, ' $1')
    .replace( /^[a-z]/, toUpperCase)
const pad = (str, by = 1) => {
  const p = Array(by).fill(' ').join('')
  return p + str + p
}
const formatRoomText = (name, type) => name ? name : type

const IGNORE_COLOR = c.bgGrey
const EVENT_COLOR = c.cyanBright
const NAME_COLOR = c.blueBright
const MSG_COLOR = c.whiteBright
const ROOM_COLOR = c.magenta

export default {
  eventNotifier: () =>    EVENT_COLOR('event =========================================================================='),
  eventEndNotifier: () => EVENT_COLOR('================================================================================'),
  roomType: type => descriptiveRoomType(type),
  room: (name, type) => ROOM_COLOR(
      pad(`(${formatRoomText(name, type)})`)),
  ignoreFlags: f => flags(f, IGNORE_COLOR),
  name: name => `${ NAME_COLOR(pad(name)) }`,
  content: content => `${ MSG_COLOR(pad(content)) }`,
  customFlags: flags,
  format: {
    roomText: formatRoomText,
  }
}
