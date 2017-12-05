const crypto = require('crypto')
const apiUsers = require('./users')

const key = "private"
const hashPassword = pwd => crypto.createHash('sha512', key).update(pwd).digest('base64')

function signin(req, res, connection, tokenUserMap) {
  apiUsers.getUserBy_NamePassword(connection, req.body.name, hashPassword(req.body.password)).then(
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
exports.signin = signin

exports.signup = async function signup(req, res, connection, tokenUserMap) {
  const alreadyExistingUser = await apiUsers.getUserByName(connection, req.body.name)

  if (alreadyExistingUser !== null)
    return res.status(500).send({ err: 'user-already-exists' })

  const hashedPassword = hashPassword(req.body.password)

  try {
    const insertResult = await apiUsers.addUser(connection, req.body.name, hashedPassword)
    return res.status(200).send({ name: req.body.name, signup: true })
  } catch (err) {
    res.status(500).send({ err: 'database-error' })
  }
}