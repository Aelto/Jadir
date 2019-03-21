const { getConnection } = require('../db-init.js');

module.exports = function(req, variables) {
  return new Promise(resolve => {
    getConnection()
    .query(req, variables, (err, results, fields) => {

      if (err) {
        throw err
      }

      else {
        resolve(results)
      }

    })
  })
}
