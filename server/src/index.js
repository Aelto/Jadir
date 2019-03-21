const path = require('path');
const express = require('express');
const consola = require('consola');
const { dbInit } = require('./db-init.js');
const app = express();
const port = 3000;

const dist_folder = path.join(__dirname, '..', '..', 'app', 'dist');
const static_folder = path.join(__dirname, '..', '..', 'static');

const connection = dbInit();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(dist_folder));
app.use('/static', express.static(static_folder));
app.use('/api', require('./controllers'));

app.get('*', (req, res) => res.sendFile(path.join(dist_folder, 'index.html')));

app.listen(port, () => consola.info(`server listening on port ${port}`));