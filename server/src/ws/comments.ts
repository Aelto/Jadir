import WsManager from '../ws-manager'
import * as interfaces from '../shared/interfaces'
import { endpoints } from '../shared/endpoints'
import dbQuery from '../db-query'

export default function(ws: WsManager, con: any) {

  ws.on(endpoints.getPostComments, async (wsClient, message: interfaces.query_getPostComments) => {
    const id = message.message.id || 0

    try {
      const results = await dbQuery(con, 
        `SELECT c.*, u.name as author FROM comments as c
         LEFT JOIN users as u on c.author_id = u.id
         WHERE c.id=?`,
         [id])

      ws.answer(wsClient, endpoints.getPostComments, { comments: results } as interfaces.responseMessage_getPostComments)
    } catch (err) {
      ws.answer(wsClient, endpoints.getPostComments, {}, interfaces.MessageState.databaseError)
    }
  })

}