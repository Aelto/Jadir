const uuidv4 = require('uuid/v4')

module.exports = class TokenUserMap {
  constructor() {
    this.map = {}
    this.mapInverse = {}
  }

  addUser(name) {
    const token = uuidv4()

    this.map[token] = {
      name,
      token,
      createDate: Date.now(),
      lastActivity: Date.now()
    }

    this.mapInverse[name] = token

    return token
  }

  getUser(token) {
    return this.map[token]
  }

  getToken(name) {
    return this.mapInverse[name]
  }

  getUserByName(name) {
    return this.getUser(this.mapInverse[name])
  }

  doesUserExist(token) {
    return token in this.map
  }

  doesUserExistByName(name) {
    return name in this.mapInverse
  }

  deleteUser(token) {
    const deleted = this.getUser(token)
    delete this.mapInverse[deleted.name]
    delete this.map[token]

    return deleted
  }

  deleteUserByName(name) {
    this.deleteUser(this.mapInverse[name])
  }

  updateActivity(token) {
    this.getUser(token).lastActivity = Date.now()
  }

  removeInactiveUsers(delay = 1000 * 60) {
    const now = Date.now()
    const keys = Object.keys(this.map)
    let i = 0
    while (i < keys.length) {
      if (now - this.map[keys[i]].lastActivity > delay) this.deleteUser(keys[i])

      i++
    }
  }
}
