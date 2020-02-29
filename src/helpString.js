const printArgOption = ([arg, message]) => `
${arg.padStart(20)} : ${message}`

export default (usageStr, optionMap) =>
  '```\n' + `\
  usage: ${ usageStr }
  ${ optionMap.map(o => printArgOption(o)).join('') } \
  ` + '\n```'
