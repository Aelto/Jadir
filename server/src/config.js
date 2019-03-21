const fs = require('fs');
const consola = require('consola');

const CONFIG_PATH = 'config.json';

module.exports = function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH));
  }
  catch (err) {
    consola.error('error when reading configuration file,');
    consola.error(err);
  }
}