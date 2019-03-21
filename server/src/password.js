const crypto = require('crypto');
const getConfig = require('./config.js');

const {
  private_hash_key,
  prefix_hash_string,
  suffix_hash_string
} = getConfig();

exports.hashPassword = pwd => crypto
  .createHash('sha512', private_hash_key)
  .update(prefix_hash_string)
  .update(pwd)
  .update(suffix_hash_string)
  .digest('base64');