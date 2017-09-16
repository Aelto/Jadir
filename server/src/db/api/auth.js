const apiUsers = require('./users')

exports.signin = function signin(req, res, connection, tokenUserMap) {
  apiUsers.getUserBy_NamePassword(connection, req.body.name, req.body.password).then(
    results => {
      if (!results.length) return res.status(401).send({ message: 'could not authenticate' })

      if (tokenUserMap.doesUserExistByName(req.body.name)) {
        return res.status(200).send({ token: tokenUserMap.getToken(req.body.name), name: req.body.name })
      } else {
        return res.status(200).send({ token: tokenUserMap.addUser(req.body.name), name: req.body.name })
      }
    },
    err => res.send({ err })
  )
}
