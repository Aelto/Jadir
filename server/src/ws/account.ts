import WsManager from '../ws-manager'
import * as interfaces from '../shared/interfaces'
import { endpoints } from '../shared/endpoints'
import dbQuery from '../db-query'
import { WSAEPROCLIM } from 'constants';
const uuidv4 = require('uuid/v4')

const crypto = require('crypto')
const key = "private"
const hashPassword = pwd => crypto.createHash('sha512', key).update(pwd).digest('base64')

export default function(ws: WsManager, con: any) {

  ws.on(endpoints.signup, async (wsClient, message: interfaces.query_signup) => {
    let alreadyExistingUser: [interfaces.User] = null
    try {
      alreadyExistingUser = await dbQuery(con,
      `SELECT * FROM users WHERE name = ?`, [message.message.login])
    } catch (err) {
      return ws.answer(wsClient, endpoints.signup, {}, interfaces.MessageState.databaseError)
    }

    if (alreadyExistingUser.length) {
      ws.answer(wsClient, endpoints.signup, 
        { success: false, message: 'user-already-exists' } as interfaces.responseMessage_signup,
        interfaces.MessageState.databaseError)
    }

    else {
      try {
        await dbQuery(con,
          `INSERT INTO users (name, password, role) VALUES (?, ?, ?)`,
          [message.message.login, hashPassword(message.message.password), interfaces.UserRole.standard])

        return ws.answer(wsClient, endpoints.signup, { success: true, message: null } as interfaces.responseMessage_signup)
      } catch (err) {
        return ws.answer(wsClient, endpoints.signup, {}, interfaces.MessageState.databaseError)
      }
    }
  })

  ws.on(endpoints.signin, async (wsClient, message: interfaces.query_signin) => {
    try {
      const user: [interfaces.User] | null = await dbQuery(con,
        `SELECT * from users WHERE name = ? AND password = ?`,
        [message.message.login, hashPassword(message.message.password)])

      if (user.length) {
        const token = uuidv4()

        await dbQuery(con,
          `UPDATE users
           SET token = ?
           WHERE name = ?`,
          [token, message.message.login])

        ws.clients.authentifyUser(message.token, message.message.login)
        ws.answer(wsClient, endpoints.signin, { login: message.message.login, success: true, token } as interfaces.responseMessage_signin)
      }

      else {
        ws.answer(wsClient, endpoints.signin, { login: '', success: false } as interfaces.responseMessage_signin, interfaces.MessageState.notFound)
      }
    } catch (err) {
      ws.answer(wsClient, endpoints.signin, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.signinToken, async (wsClient, message: interfaces.query_signinToken) => {
    try {
      const users: [interfaces.User] | null = await dbQuery(con,
        `SELECT * FROM users WHERE name = ? AND token = ?`,
        [message.message.login, message.message.token])

      if (users.length) {
        ws.clients.authentifyUser(message.token, message.message.login)

        ws.answer(wsClient, endpoints.signinToken, {
          login: message.message.login,
          success: true,
          token: message.message.token
        } as interfaces.responseMessage_signinToken)
      }

      else {
        ws.answer(wsClient, endpoints.signinToken, { login: '', success: false } as interfaces.responseMessage_signin, interfaces.MessageState.notFound)
      }
    } catch (err) {
      ws.answer(wsClient, endpoints.signinToken, {}, interfaces.MessageState.databaseError)
    }
  })

}