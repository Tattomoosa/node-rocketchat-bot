![](https://travis-ci.com/Tattomoosa/node-rocketchat-bot.svg?branch=master)

# Node Rocket Bot

NodeJS RocketChat Bot Framework

## About

This library is intended to be "batteries-included" in that it handles all
server communication and only exposes a handful of callbacks the user needs to
manipulate directly. That said, check the raw field on the event callback
for raw RocketChat API driver access.

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
require('dotenv').config()
const bot = require('node-rocketchat-bot')

bot({
  // from .env file
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
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
Most of the time running `npm lint-fix` will fix any style inconsistencies.
