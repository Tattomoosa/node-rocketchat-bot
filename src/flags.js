const wasBefore = (bootDate, { ts }) => bootDate > ts.$date
const fromBot = message => 'bot' in message

export default (bot, message, messageOptions, lastUpdate) => ({
  fromSelf: bot.id === message.u._id,
  isMentioned: message.mentions.map(m => m._id).some(id => id === bot.id),
  spokenOf: message.msg.toLowerCase().includes(bot.username.toLowerCase()),
  fromBot: fromBot(message),
  notInRoom: !messageOptions.roomParticipant,
  isErr: message.err != null,
  wasBeforeBoot: wasBefore(bot.bootDate, message),
  wasBeforeLastUpdate: wasBefore(lastUpdate, message),
  read: !message.unread
})
