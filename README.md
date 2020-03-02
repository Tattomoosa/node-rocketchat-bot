![](https://travis-ci.com/Tattomoosa/node-rocketchat-bot.svg?branch=master)
[![npm version](https://badge.fury.io/js/node-rocketchat-bot.svg)](https://badge.fury.io/js/node-rocketchat-bot)

# Node RocketChat Bot

NodeJS RocketChat Bot Framework

## About

This library is intended to be "batteries-included" in that it handles all
server communication and only exposes a handful of callbacks the user needs to
manipulate directly. That said, check the raw field on the event callback
for raw RocketChat API driver access.

## Features

* Independent color logging levels for your bot, this library, and the rocketchat API
* A help helper
* Easily filter incoming messages with a tag system.
* And/or filter from the raw data directly.
* Send a direct message if an exception is thrown with debugging information.

## Usage

Install and save with npm:

```
$ npm i node-rocketchat-bot --save
```

*or* yarn:

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
  // when ready (can also console.log)
  onConnection: async e => e.log.info(`${e.bot.username} ready`),
  // on message
  onMessage: async e => {
    if (e.flags.isMentioned)
      e.respond(`hi ${e.message.author.name} thanks for mentioning me`)
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
