const path = require('path')
const chalk = require('chalk')
const express = require('express')
const app = express()

const port = 3000
const webRoot = path.join(__dirname, `../../app/`)

app.use('/app', express.static(webRoot))
app.get('/', (req, res) => res.sendFile(path.join(webRoot, `index.html`)))

app.listen(port)
console.log(`server listening on port ${chalk.magenta(port)}`)