const wasBefore = (bootDate, { ts }) => bootDate > ts.$date
const fromBot = message => 'bot' in message

export default (bot, message, messageOptions, lastUpdate) => ({
  // "positive" tags, likely to trigger a response
  isMentioned: 'mentions' in message &&
    message.mentions.map(m => m._id).some(id => id === bot.id),
  spokenOf: message.msg.toLowerCase().includes(bot.username.toLowerCase()),
  startsWithName: message.msg.toLowerCase()
    .startsWith(bot.username.toLowerCase()),
  // "ignore" tags, likely to be messages we don't want
  fromSelf: bot.id === message.u._id,
  fromBot: fromBot(message),
  notInRoom: !messageOptions.roomParticipant,
  isErr: message.err != null,
  wasBeforeBoot: wasBefore(bot.bootDate, message),
  wasBeforeLastUpdate: wasBefore(lastUpdate, message),
  read: !message.unread
})
