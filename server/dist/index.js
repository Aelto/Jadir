"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const chalk = require("chalk");
const fs = require("fs");
const ws_1 = require("./ws/ws");
const db_init_1 = require("./db-init");
const webRoot = path.join(__dirname, `../../app/`);
const configPath = path.join(__dirname, `../global.config.json`);
if (!fs.existsSync(configPath)) {
    console.log(`${chalk.red('error')} could not find global config at ${configPath}`);
    process.exit(1);
}
const globalConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const connection = db_init_1.default(globalConfig.database);
const app = express();
const expressWs = require('express-ws')(app);
const ws = ws_1.default(app, connection);
app.use('/app', express.static(webRoot));
app.use('/assets', express.static(path.join(webRoot, '/assets')));
app.get('/', (req, res) => res.sendFile(path.join(webRoot, `index.html`)));
ws.accept(app, '/ws');
app.get('*', (req, res) => res.sendFile(path.join(webRoot, `index.html`)));
const port = globalConfig.port;
app.listen(port);
console.log(`server started on port ${port}`);
