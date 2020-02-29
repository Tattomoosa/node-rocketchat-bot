import roomTypes from './roomTypes'


export default ({
  err,
  message,
  messageOptions,
  lastUpdate,
  flags,
  ignoreFlags,
  bot,
  loggers,
  driver,
}) => {
  const {
    getRoomName,
    sendToRoomId,
    sendDirectToUser,
    disconnect,
    unsubscribeAll,
    setReaction,
  } = driver
  const rawEvent = { err, message, messageOptions }
  if (ignoreFlags.filter(f => flags[f]).length > 0)
    return
  const roomName = async () => await getRoomName(message.rid)
  const respond = async content => await sendToRoomId(content, message.rid)
  const respondDirect = async content => await sendDirectToUser(content, message.u.username)
  const wrapLog = (name, fn) => async (...args) => {
    loggers.bot.info([`[ ${name} ]`, ...args].join(' | '))
    return await fn(...args)
  }
  return {
    flags: { ...flags },
    // bot state
    bot: { ...bot },
    message: {
      id: message._id,
      unread: message.unread,
      content: message.msg,
      mentions: message.mentions,
      author: { ...message.u },
      timestamp: message.ts['$date'],
    },
    room: {
      id: message.rid,
      getName: roomName,
      type: roomTypes[messageOptions.roomType],
    },
    lastUpdate,
    respond: wrapLog('respond', respond),
    respondToUser: wrapLog('respond direct', respondDirect),
    sendToRoom: wrapLog('sendToRoom', driver.sendToRoom),
    sendDirectToUser: wrapLog('send to user direct', driver.sendDirectToUser),
    log: loggers.user,
    loggers: loggers,
    disconnect,
    unsubscribeAll,
    setReaction,
    // Raw rocketchat driver/response
    raw: { driver, event: { ...rawEvent } },
  }
}
