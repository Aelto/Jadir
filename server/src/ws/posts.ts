import WsManager from '../ws-manager'
import * as interfaces from '../shared/interfaces'
import { endpoints } from '../shared/endpoints'
import dbQuery from '../db-query'

export default function(ws: WsManager, con: any) {

  ws.on(endpoints.getPagePosts, async (wsClient, message: interfaces.query_getPagePosts) => {
    const page = message.message.page || 0

    try {
      const results = await dbQuery(con, `SELECT * FROM posts ORDER BY date DESC LIMIT ?, ?`, [page * 20, page + 20])

      ws.answer(wsClient, endpoints.getPagePosts, { posts: results })
    } catch (err) {
      ws.answer(wsClient, endpoints.getPagePosts, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.getPost, async (wsClient, message: interfaces.query_getPost) => {
    let id = 0

    if (message.message.id && message.message.id > 0)
      id = message.message.id

    try {
      const results: any = await dbQuery(con, `SELECT * FROM posts where id = ?`, [id])

      if (results.length) {
        ws.answer(wsClient, endpoints.getPost, { post: results[0] } as interfaces.responseMessage_getPost)
      }

      else {
        ws.answer(wsClient, endpoints.getPost, {}, interfaces.MessageState.notFound)       
      }
    } catch (err) {
      ws.answer(wsClient, endpoints.getPost, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.newPost, async (wsClient, message: interfaces.query_newPost) => {
    if (!message.isAuth) {
      return ws.answer(wsClient, endpoints.newPost, {}, interfaces.MessageState.unauthorized)
    }

    let user: interfaces.User = null
    try {
      const results = await dbQuery(con, 'SELECT * FROM users WHERE name = ?', [message.login])
      
      if (!results.length) {
        return ws.answer(wsClient, endpoints.newPost, {}, interfaces.MessageState.unauthorized)
      }

      user = results[0]
    } catch (err) {
      return ws.answer(wsClient, endpoints.newPost, {}, interfaces.MessageState.databaseError)
    }

    let results
    try {
      results = await dbQuery(con,
        `INSERT INTO posts (title, date, author_id, content, tags, author, score, image_url)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
        [message.message.title, new Date()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '), user.id, message.message.content, message.message.tags, user.name, message.message.image_url])
    } catch(err) {
      ws.answer(wsClient, endpoints.newPost, {}, interfaces.MessageState.databaseError)
    }

    try {
      const posts: any = await dbQuery(con, `SELECT * FROM posts where id = ?`, [results.insertId])
      if (posts.length) {
        ws.answer(wsClient, endpoints.newPost, {
          post: posts[0]
        } as interfaces.responseMessage_newPost)
      }

      else {
        ws.answer(wsClient, endpoints.newPost, {}, interfaces.MessageState.databaseError)
      }
    } catch (err) {
      ws.answer(wsClient, endpoints.newPost, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.votePost, async (wsClient, message: interfaces.query_votePost) => {
    if (!message.isAuth) {
      return ws.answer(wsClient, endpoints.votePost, {}, interfaces.MessageState.unauthorized)
    }

    let user: interfaces.User = null
    try {
      const results = await dbQuery(con, 'SELECT * FROM users WHERE name = ?', [message.login])
      
      if (!results.length) {
        return ws.answer(wsClient, endpoints.votePost, {}, interfaces.MessageState.unauthorized)
      }

      user = results[0]
    } catch (err) {
      return ws.answer(wsClient, endpoints.votePost, {}, interfaces.MessageState.databaseError)
    }

    try {
      const results = await dbQuery(con,
        `SELECT * FROM posts_votes WHERE post_id = ? and user_id = ?`,
      [message.message.post_id, user.id])

      if (results.length) {
        await dbQuery(con,
          `UPDATE posts_votes SET is_upvote = ?
            WHERE post_id = ? AND user_id = ?`,
          [message.message.is_upvote, message.message.post_id, user.id])
      }

      else {
        await dbQuery(con,
          `INSERT INTO posts_votes
            (post_id, user_id, is_upvote)
           VALUES (?, ?, ?)`,
          [message.message.post_id, user.id, message.message.is_upvote])
      }

      ws.answer(wsClient, endpoints.votePost, {} as interfaces.responseMessage_votePost)
    } catch (err) {
      ws.answer(wsClient, endpoints.votePost, {}, interfaces.MessageState.databaseError)
    }
  })
}