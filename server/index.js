import express from 'express'
import http from 'http'
import { Nuxt, Builder } from 'nuxt'
import consola from 'consola'

// Import and Set Nuxt.js options

import config from '../nuxt.config.js'
config.dev = !(process.env.NODE_ENV === 'production')
const app = express()
const host = config.server.host || '127.0.0.1'
const port = config.server.port || 3000

consola.info(host, port)
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
}
start()
