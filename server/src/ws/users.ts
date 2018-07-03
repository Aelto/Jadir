import WsManager from '../ws-manager'
import * as interfaces from '../shared/interfaces'
import { endpoints } from '../shared/endpoints'
import dbQuery from '../db-query'
import { WSAEPROCLIM } from 'constants';

export default function(ws: WsManager, con: any) {

  ws.on(endpoints.setUserImage, async (wsClient, message: interfaces.query_setUserImage) => {
    if (!message.isAuth) {
      return ws.answer(wsClient, endpoints.setUserImage, {}, interfaces.MessageState.unauthorized)
    }

    try {
      const results = await dbQuery(con, `UPDATE users SET image_url = ? WHERE name = ?`, [message.message.image_url, message.login])

      ws.answer(wsClient, endpoints.setUserImage, { image_url: message.message.image_url } as interfaces.responseMessage_setUserImage)
    } catch (err) {
      ws.answer(wsClient, endpoints.setUserImage, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.getUserProfile, async (wsClient, message: interfaces.query_getUserProfile) => {
    try {
      const results = await dbQuery(con, `SELECT * FROM users WHERE name = ?`, [message.message.username])

      if (!results.length) {
        ws.answer(wsClient, endpoints.getUserProfile, {}, interfaces.MessageState.notFound)
      }

      const user = results[0]
      
      if (user.password)
        delete user.password

      ws.answer(wsClient, endpoints.getUserProfile, { user } as interfaces.responseMessage_getUserProfile)
    } catch (err) {
      ws.answer(wsClient, endpoints.getUserProfile, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.getUserScore, async (wsClient, message: interfaces.query_getUserScore) => {
    try {
      const postsScores = await dbQuery(con, `SELECT score FROM posts WHERE author = ?`, [message.message.name]) 
      const totalScore = postsScores.reduce((acc, post) => acc + post.score, 0)

      ws.answer(wsClient, endpoints.getUserScore, { score: totalScore, user: message.message.name } as interfaces.responseMessage_getUserScore, interfaces.MessageState.success, message.thenableId)
    } catch (err) {
      ws.answer(wsClient, endpoints.getUserScore, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.isUserAdmin, async (wsClient, message: interfaces.query_isUserAdmin) => {
    try {
      const users = await dbQuery(con, `SELECT role FROM users WHERE name = ?`, [message.message.username])

      if (users.length) {
        const user = users[0]
        
        ws.answer(wsClient, endpoints.isUserAdmin, { is_admin: user.role === interfaces.UserRole.admin } as interfaces.responseMessage_isUserAdmin, interfaces.MessageState.success, message.thenableId)
      }
      
      else {
        ws.answer(wsClient, endpoints.isUserAdmin, { is_admin: false } as interfaces.responseMessage_isUserAdmin, interfaces.MessageState.notFound, message.thenableId)
      }
    } catch (err) {
      ws.answer(wsClient, endpoints.isUserAdmin, { is_admin: false } as interfaces.responseMessage_isUserAdmin, interfaces.MessageState.databaseError, message.thenableId)
    }
  })

}