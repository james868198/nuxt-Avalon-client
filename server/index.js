// const express = require('express')
// const consola = require('consola')
// const { Nuxt, Builder } = require('nuxt')

import express from 'express'
import consola from 'consola'
import Socket from 'socket.io'
import http from 'http'
import { Nuxt, Builder } from 'nuxt'

// Import and Set Nuxt.js options

import config from '../nuxt.config.js'
config.dev = !(process.env.NODE_ENV === 'production')

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

let server = http.createServer(app)

const start = async () => {
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

    let users = 0
    let rooms = {
        hall: {
            name: 'hall',
            users: 0,
            maxUsers: null
        }
    }
    let io = Socket(server)
    console.log('socket test')

    io.on('connection', socket => {
        let curRoomName = rooms.hall.name
        socket.userName = ''
        socket.join(curRoomName)
        console.log('socket start, id:%s', socket.id)

        socket.emit('message', {
            userName: 'system',
            message: `Welcome to join us.`
        })
        socket.on('setUserName', data => {
            socket.userName = data.userName
            console.log('socket get user name')
            socket.emit('socketId', {
                id: socket.id
            })
            users++
            socket.to(curRoomName).emit('message', {
                userName: 'system',
                message: `Now we have ${users} players.
                Welcome new player ${socket.userName}.`
            })
        })

        socket.on('chat', data => {
            console.log('socket chat', data)
            socket.to(curRoomName).emit('message', data)
            socket.emit('message', data)
        })

        socket.on('createRoom', () => {
            console.log('create room')
        })

        socket.on('disconnect', () => {
            users--
            console.log('socket disconnect')
        })
    })
}
start()
