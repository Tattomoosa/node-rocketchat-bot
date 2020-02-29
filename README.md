# Rocketman

NodeJS RocketChat Bot Framework

## Getting started

1. `$ git clone https://github.com/Tattomoosa/node-rocketchat-bot`
2. Create file `.env` like this:
  ```
  HOST=<host address>
  USERNAME=<bot username>
  PASSWORD=<password>
  ```
3. `$ npm install && npm start`

## About

This library is intended to be "batteries-included" in that it handles all
server communication and only exposes a handful of callbacks the user needs to
manipulate directory. That said, check the raw field on the event callback
for raw RocketChat API driver access.

## Simple Example

Responds to `@` mentions.

``` javascript
require('dotenv').config()
const bot = require('../lib').default

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
