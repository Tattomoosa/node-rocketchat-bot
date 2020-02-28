const { driver } = require('@rocket.chat/sdk')

const wasBefore = (bootDate, { ts }) => bootDate > ts['$date']

const descriptiveRoomType = c => c === 'd' ? 'direct message' : ''

export default async ({
  host = '',
  username = '',
  password,
  ssl: useSsl = true,
  rooms: _rooms,
  wake,
  process,
  logger = null,
  // pass empty array to disable defaults
  // WARNING: not recommended
  filterFlags = ['fromSelf', 'read'],
}) => {
  if (logger)
    driver.useLog(logger)
  await driver.connect({ host, useSsl })
  const id = await driver.login({ username, password })
  await driver.joinRooms(_rooms)
  await driver.subscribeToMessages()
  const bootDate = Date.now()
  const bot = { id, username, bootDate, }
  let lastUpdate = bootDate
  await wake({ bot: { ...bot } })
  driver.reactToMessages( async (err, message, messageOptions) => {
    const flags = {
      fromSelf: bot.id === message.u._id,
      fromBot: message.hasOwnProperty('bot'),
      roomParticipant: messageOptions.roomParticipant,
      isErr: message.err != null,
      wasBeforeBoot: wasBefore(bootDate, message),
      wasBeforeLastUpdate: wasBefore(lastUpdate, message),
      read: !message.unread,
    }
    if (filterFlags.filter(f => flags[f]).length > 0)
      return
    await process({
      ...flags,
      bot: { ...bot },
      message: {
        id: message._id,
        unread: message.unread,
        content: message.msg,
        author: { ...message.u },
        timestamp: message.ts['$date'],
      },
      room: {
        getRoomName: async () => await driver.getRoomName(message.rid),
        type: descriptiveRoomType(messageOptions.roomType)
      },
      prettyString: () => `${ message.u.name } : ${ message.msg }`,
      prettyRoom: async () => `${ await driver.getRoomName(message.rid)
          ? await driver.getRoomName(message.rid)
          : ''  }${ descriptiveRoomType(messageOptions.roomType) }`,
      respond: msg => driver.sendToRoomId(msg, message.rid),
      sendToRoom: async (content, room) => driver.sendToRoom(content, room),
      sendToUsername: async (content, username) => driver.sendDirectToUser(content, username),
      disconnect: async () => driver.disconnect(),
      unsubscribeAll: async () => driver.unsubscribeAll(),
      // Raw rocketchat driver/response
      raw: { driver, event: { err, message, messageOptions } },
    })
    lastUpdate = Date.now()
  })
}
