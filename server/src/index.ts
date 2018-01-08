import * as path from 'path'
import * as express from 'express'
import wsInit from './ws/ws'
import dbInit from './db-init'

const webRoot = path.join(__dirname, `../../app/`)

const connection = dbInit()
const app = express()
const expressWs = require('express-ws')(app)

const ws = wsInit(app, connection)

app.use('/app', express.static(webRoot))
app.use('/assets', express.static(path.join(webRoot, '/assets')))
app.get('/', (req, res) => res.sendFile(path.join(webRoot, `index.html`)))

ws.accept(app, '/ws')
app.get('*', (req, res) => res.sendFile(path.join(webRoot, `index.html`)))

const port = 3000
app.listen(port)
console.log(`server started on port ${port}`)