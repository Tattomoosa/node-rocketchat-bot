const printArgOption = (arg, message) => `
      ${arg}
            ${message}
`

export default (usageStr, optionMap) =>
  '```' + `\
  ${usageStr}
  ${optionMap.map(o => printArgOption(o))}
  \
  ` + '```'
