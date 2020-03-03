import roomTypes from './roomTypes'
import createFlags from './flags'
import menu from './menu'

export default ({
  err,
  message,
  messageOptions,
  lastUpdate,
  bot,
  loggers,
  driver
}) => {
  const {
    getRoomName, sendToRoomId, sendDirectToUser,
    disconnect, unsubscribeAll, setReaction
  } = driver
  const flags = createFlags(bot, message, messageOptions, lastUpdate)
  // const rawEvent = { err, message, messageOptions }
  // if (ignoreFlags.filter(f => flags[f]).length > 0) { return }
  const roomName = async () => getRoomName(message.rid)
  const respond = async content => sendToRoomId(content, message.rid)
  const respondDirect = async content => sendDirectToUser(content, message.u.username)
  // Wraps operations with a logging function
  const wrapLog = (name, fn) => async (...args) => {
    loggers.bot.info(`[ ${name} ] -> "${args.join(', ')}"`)
    return fn(...args)
  }
  return {
    err,
    flags: { ...flags },
    trueFlags: Object.keys(flags).filter(f => flags[f]),
    // bot state
    bot: { ...bot },
    message: {
      id: message._id,
      unread: message.unread,
      content: message.msg,
      mentions: message.mentions,
      author: { ...message.u },
      timestamp: new Date(message.ts.$date)
    },
    room: {
      id: message.rid,
      getName: roomName,
      type: roomTypes[messageOptions.roomType]
    },
    lastUpdate,
    respond: wrapLog('respond', respond),
    respondToUser: wrapLog('respond direct', respondDirect),
    sendToRoom: wrapLog('send to room', driver.sendToRoom),
    sendDirectToUser: wrapLog('send to user direct', driver.sendDirectToUser),
    log: loggers.user,
    disconnect: wrapLog('disconnect', disconnect),
    unsubscribeAll: wrapLog('unsubscribe all', unsubscribeAll),
    setReaction: wrapLog('set reaction', setReaction),
    // Raw rocketchat driver/response
    // raw: { driver, event: { ...rawEvent } },
    ops: {
      menu
    }
  }
}
