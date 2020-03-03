![](https://travis-ci.com/Tattomoosa/node-rocketchat-bot.svg?branch=master)
[![npm version](https://badge.fury.io/js/node-rocketchat-bot.svg)](https://badge.fury.io/js/node-rocketchat-bot)

# Node RocketChat Bot

NodeJS RocketChat Bot Framework

## About

This library is intended to be "batteries-included" with the goal of making deploying a RocketChat bot as easy as possible.

## Features

* A menu helper make usage or choice menus extremely easy.
* Easily filter incoming messages with a flag system.
* And/or filter from the message directly.
* Send a direct message to you if an exception is thrown in your code, with readable debugging information.
* Logs in color. Or not. Default: Color only to TTY.
* Independent color logging levels for your bot, this library, and the API
* A `pretty` mode which logs messages in an easy-to-read format to help the debugging process.

## Usage

Install and save with [npm](https://www.npmjs.com/):

```
$ npm i node-rocketchat-bot --save
```

*or* [yarn](https://yarnpkg.com/):

```
$ yarn add node-rocketchat-bot -S
```

## Simple Example

Responds to `@` mentions.

``` javascript
const bot = require('node-rocketchat-bot')

bot({
  // recommended - using 'dotenv' library with .env file
  host: 'HOSTNAME',
  username: 'USERNAME',
  password: 'PASSWORD',
  // use ssl for https
  ssl: true,
  // join room(s)
  rooms: ['bots'],
  // when ready (e.log.info logs to console, can also console.log)
  onWake: async event => event.log.info(`${e.bot.username} ready`),
  // on message
  onMessage: async event => {
    if (event.flags.isMentioned)
      event.respond(`hi ${e.message.author.name} thanks for mentioning me`)
  }
})
```

## Flags

Built in flags that can be ignored or checked easily.

* `isMentioned`
* `spokenOf`
* `startsWithName`
* `fromSelf`
* `fromBot`
* `notInRoom`
* `isErr`
* `wasBeforeBoot`
* `wasBeforeLastUpdate`
* `read`

### Ignore Flags

By default, `fromSelf`, `notInRoom`, `wasBeforeLastUpdate`, `read` and `wasBeforeBoot` are ignored.

To ignore nothing (not recommmended) pass an empty array.

``` javascript
bot({
  // ...
  ignoreFlags: []
  // ...
})
```

If providing your own flags to ignore, defaults will be lost. If you want to preserve default behavior you must pass all default flags:

``` javascript

bot({
  // ...
  ignoreFlags: [
    // defaults
    'fromSelf'
    'notInRoom',
    'wasBeforeLastUpdate',
    'read',
    'wasBeforeBoot',
    // user
    'isErr'
    ],
  // ...
})
```

Want another flag? [Open an issue](https://github.com/Tattomoosa/node-rocketchat-bot/issues/new)

## Logging

Within `onWake` or `onMessage`, `event.log` has functions `debug`, `info`,
`warn`, `error`. These functions will print in different colors to the console
and function generally like `console.log`, although they won't expand objects
in the same way or take multiple arguments (yet?).

Each function will log only if `event.log.level` is at their level or greater:

``` javascript
// when e.log.level === 'debug' only
e.log.debug('value is valid')
// when e.log.level === 'info' || 'debug'
e.log.info('step completed')
// when e.log.level === 'warn' || 'info' || 'debug'
e.log.warn('value unexpected, handling...')
// when e.log.level === 'error' || 'warn' || 'info' || 'debug'
e.log.error('value unexpected, cannot handle')
```

In addition to these logs, you will see logs from `node-rocketchat-bot` (`bot`)
and maybe from the `rocketchat-sdk` (`rocketchat`) as well. `bot` is set to
`info` and `rocket` is set to `warn`. These can be changed
with the `logLevels` argument:
``` javascript
bot({
  // ...
  // all values shown are default
  logLevels: {
    user: 'debug',
    bot: 'info',
    // unspecified arguments also fall back to defaults
    // rocket: 'warn',
  }
  // ...
})
```

## Development

1. `$ git clone https://github.com/Tattomoosa/node-rocketchat-bot`
2. Create file `.env` like this for a test bot.
  ```
  HOST=<host address>
  USERNAME=<bot username>
  PASSWORD=<password>
  ```
3. `$ npm install && npm start`

There is a pre-commit hook for [StandardJS](https://standardjs.com/) style.
Most of the time running `npm run lintfix` will fix any style inconsistencies.
