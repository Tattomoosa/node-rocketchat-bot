import winston from 'winston'
import c from 'chalk'

const logFormatColor = (tag, tag_color) => winston.format.printf(
  ({ level, message }) => {
    const l_color
      = level === 'info' ? tag_color
      : level === 'warning' ? c.redBright
      : level === 'debug' ? c.blue
      : level === 'error' ? c.red
      : c.white
    return `${ tag_color(`[[ ${ tag } ]]`) } ${ l_color(`${message}`) }`
})
const logFormat = tag => winston.format.printf(({ message }) => `[[ ${ tag } ]] ${message}`)
const createFormat = (tag, useColor, color) =>
  useColor
  ? logFormatColor(tag, color)
  : logFormat(tag)

export default ({
  colors = true,
  level = 'info',
  username = 'user',
}) => ({
  rocket: winston.createLogger({
    format: createFormat('rocket', colors, c.grey),
    transports: [ new winston.transports.Console() ],
    level,
  }),
  bot: winston.createLogger({
    format: createFormat('bot', colors, c.cyan),
    transports: [ new winston.transports.Console() ],
    level,
  }),
  user: winston.createLogger({
    format: createFormat(username, colors, c.cyanBright),
    transports: [ new winston.transports.Console() ],
    level,
  }),
})
