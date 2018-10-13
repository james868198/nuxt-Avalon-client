// const express = require('express')
// const consola = require('consola')
// const { Nuxt, Builder } = require('nuxt')

import express from 'express'
import consola from 'consola'
import socket from 'socket.io'
import http from 'http'

import { Nuxt, Builder } from 'nuxt'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

let server = http.createServer(app)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  let io = socket(server)
  console.log('socket test')

  io.on('connection', sk => {
    let curRoomName = 'hall'
    sk.userName = ''

    console.log('socket start, id:%s', sk.id)
    // socket.emit('chat', { name: 'bar' }); // 發送資料

    sk.on('test', data => {
      sk.emit('chat', data)
    })
  })
}
start()
