const printArgOption = ([arg, message]) => `
${arg.padStart(20)} : ${message}`

export default (topLine, optionMap) =>
  '```\n\n' + `\
  usage: ${ topLine }
  ${ optionMap.map(o => printArgOption(o)).join('') }
  ` + '\n\n```'
