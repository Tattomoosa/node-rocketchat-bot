import c from 'chalk'

export default {
  eventNotifier: () => c.magenta('EVENT'),
  flags: flags => {
    const trueIgnores = flags.filter(f => f[0])
    if (!trueIgnores.length) return
    trueIgnores.map(f => `${ f[1] } `).join('')
  }
}
