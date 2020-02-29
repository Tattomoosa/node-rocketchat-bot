// functions that don't depend on the driver
const wasBefore = (bootDate, { ts }) => bootDate > ts['$date']
const fromBot = (message) => message.hasOwnProperty('bot')
export default (bot, message, messageOptions, lastUpdate) => ({
      fromSelf: bot.id === message.u._id,
      fromBot: fromBot(message),
      notInRoom: !messageOptions.roomParticipant,
      isErr: message.err != null,
      wasBeforeBoot: wasBefore(bot.bootDate, message),
      wasBeforeLastUpdate: wasBefore(lastUpdate, message),
      read: !message.unread,
    })
