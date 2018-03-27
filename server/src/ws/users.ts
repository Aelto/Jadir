import WsManager from '../ws-manager'
import * as interfaces from '../shared/interfaces'
import { endpoints } from '../shared/endpoints'
import dbQuery from '../db-query'

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

}