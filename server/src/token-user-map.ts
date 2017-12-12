const uuidv4 = require('uuid/v4')

interface StateInterface {
  current: string,
  previous: string
}

interface UserInterface {
  name: string | null,
  token: string,
  ws: WebSocket,
  createDate: number,
  lastActivity: number,
  state: StateInterface
}

export default class TokenUserMap {
  map: { [key: string]: UserInterface }
  mapInverse: any

  constructor() {
    this.map = {}
    this.mapInverse = {}
  }

  addUser(ws: any) {
    const token = uuidv4()

    this.map[token] = {
      name: null,
      token,
      ws,
      createDate: Date.now(),
      lastActivity: Date.now(),
      state: {
        current: '',
        previous: ''
      }
    }

    // this.mapInverse[name] = token

    return token
  }

  getUser(token: string) {
    return this.map[token]
  }

  getToken(name: any) {
    return this.mapInverse[name]
  }

  getUserByName(name: any) {
    return this.getUser(this.mapInverse[name])
  }

  doesUserExist(token: any) {
    return token in this.map
  }

  doesUserExistByName(name: any) {
    return name in this.mapInverse
  }

  deleteUser(token: any) {
    const deleted = this.getUser(token)

    console.log(`deleting user [${deleted.name}] from cache`)

    delete this.mapInverse[deleted.name]
    delete this.map[token]

    return deleted
  }

  deleteUserByName(name: any) {
    this.deleteUser(this.mapInverse[name])
  }

  updateActivity(token: any) {
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

  updateState(user: UserInterface, newState: string) {
    user.state.previous = user.state.current

    user.state.current = newState
  }

  authentifyUser(token: string, name: string) {
    if (!this.doesUserExist(token)) {
      throw new Error(`User with token: [${token}] and login: [${name}] does not exist`)
    }

    this.getUser(token).name = name
    this.mapInverse[name] = token
  }

  isUserAuth(token: string, login: string = '') {
    if (!this.doesUserExist(token))
      return false

    return this.getUser(token).name === login
  }
}