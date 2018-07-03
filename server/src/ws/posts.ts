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

  ws.on(endpoints.getPagePostsSearch, async (wsClient, message: interfaces.query_getPagePostsSearch) => {
    const page = message.message.page || 0

    try {
      if (message.message.search.startsWith('#')) {
        const firstTag = message.message.search.split(' ')[0]
          .slice(1)
        const results = await dbQuery(con, `SELECT * FROM posts WHERE tags like ? ORDER BY date DESC LIMIT ?, ?`, [`%${firstTag}%`, page * 20, page + 20])

        ws.answer(wsClient, endpoints.getPagePostsSearch, { posts: results })
      }

      else {
        const results = await dbQuery(con, `SELECT * FROM posts WHERE title LIKE ? ORDER BY date DESC LIMIT ?, ?`, [`%${message.message.search}%`, page * 20, page + 20])

      ws.answer(wsClient, endpoints.getPagePostsSearch, { posts: results })
      }
    } catch (err) {
      ws.answer(wsClient, endpoints.getPagePosts, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.getUserPosts, async (wsClient, message: interfaces.query_getUserPosts) => {
    try {
      const results = await dbQuery(con, `SELECT * FROM posts WHERE author = ? ORDER BY date DESC`, [message.message.username])

      ws.answer(wsClient, endpoints.getUserPosts, {
        posts: results,
        username: message.message.username
      } as interfaces.responseMessage_getUserPosts)
    } catch (err) {
      ws.answer(wsClient, endpoints.getUserPosts, {}, interfaces.MessageState.databaseError)
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

    if (!message.message.title.trim().length) {
      return ws.answer(wsClient, endpoints.newPost, {}, interfaces.MessageState.error)
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
          .toLocaleString()
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
        `SELECT is_upvote FROM posts_votes WHERE post_id = ? and user_id = ?`,
      [message.message.post_id, user.id])

      if (results.length) {
        const vote = results[0]

        if (!!vote.is_upvote !== message.message.is_upvote) {
          await dbQuery(con,
            `UPDATE posts_votes SET is_upvote = ?
              WHERE post_id = ? AND user_id = ?;
              
            UPDATE posts SET score = score ${message.message.is_upvote ? '+ 2' : '- 2'}
              WHERE id = ?`,
            [message.message.is_upvote, message.message.post_id, user.id,
             message.message.post_id])
        }

        else {
          await dbQuery(con,
            `DELETE FROM posts_votes WHERE post_id = ? and user_id = ?;
            
            UPDATE posts SET score = score ${message.message.is_upvote ? '- 1' : '+ 1'}
              WHERE id = ?`,
            [message.message.post_id, user.id, message.message.post_id])
        }
      }

      else {
        await dbQuery(con,
          `INSERT INTO posts_votes
            (post_id, user_id, is_upvote)
           VALUES (?, ?, ?);
           
           UPDATE posts SET score = score ${message.message.is_upvote ? '+ 1' : '- 1'}
           WHERE id = ?`,
          [message.message.post_id, user.id, message.message.is_upvote, message.message.post_id])
      }

      const scores = await dbQuery(con, `SELECT score FROM posts where id = ?`, [message.message.post_id])
      if (scores.length) {
        ws.answer(wsClient, endpoints.votePost, { score: scores[0].score } as interfaces.responseMessage_votePost)
      }

      else {
        ws.answer(wsClient, endpoints.votePost, {}, interfaces.MessageState.databaseError)
      }
    } catch (err) {
      ws.answer(wsClient, endpoints.votePost, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.getPostScore, async (wsClient, message: interfaces.query_getPostScore) => {
    let votes: [interfaces.PostVote] | null = null
    try {
      votes = await dbQuery(con, `SELECT is_upvote FROM posts_votes WHERE post_id = ?`,
        [message.message.post_id])
    } catch (err) {
      ws.answer(wsClient, endpoints.votePost, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.getPostUserVote, async (wsClient, message: interfaces.query_getPostUserVote) => {
    if (!message.isAuth) {
      return ws.answer(wsClient, endpoints.getPostUserVote, {}, interfaces.MessageState.unauthorized)
    }

    try {
      const votes: [interfaces.PostVote] = await dbQuery(con, `SELECT is_upvote FROM posts_votes WHERE post_id = ? AND user_id = (SELECT id FROM users WHERE name = ?)`,
        [message.message.id, message.login])
      const post_vote: interfaces.PostVote | null = votes[0] || null

      if (post_vote === null) {
        ws.answer(wsClient, endpoints.getPostUserVote, { post_vote: { is_upvote: null }, user: message.login }, interfaces.MessageState.success, message.thenableId)
      }

      else {
        ws.answer(wsClient, endpoints.getPostUserVote, { post_vote: { is_upvote: !!post_vote.is_upvote }, user: message.login }, interfaces.MessageState.success, message.thenableId)
      }

    } catch (err) {
      ws.answer(wsClient, endpoints.getPostUserVote, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.deletePost, async (wsClient, message: interfaces.query_deletePost) => {
    if (!message.isAuth) {
      return ws.answer(wsClient, endpoints.deletePost, {} as interfaces.responseMessage_deletePost, interfaces.MessageState.unauthorized, message.thenableId)
    }
    
    let user = null
    try {
      const users = await dbQuery(con, `SELECT id, name, role FROM users WHERE name = ?`, [message.login])

      if (users.length) {
        user = users[0]
      }
    } catch (err) {
      return ws.answer(wsClient, endpoints.deletePost, {} as interfaces.responseMessage_deletePost, interfaces.MessageState.databaseError, message.thenableId)
    }

    if (user === null) {
      return ws.answer(wsClient, endpoints.deletePost, {} as interfaces.responseMessage_deletePost, interfaces.MessageState.unauthorized, message.thenableId)
    }

    let post = null
    try {
      const posts = await dbQuery(con, `SELECT id, author_id FROM posts WHERE id = ?`, [message.message.post_id])

      if (posts.length) {
        post = posts[0]
      }
    } catch (err) {
      return ws.answer(wsClient, endpoints.deletePost, {} as interfaces.responseMessage_deletePost, interfaces.MessageState.databaseError, message.thenableId)
    }

    if (post === null) {
      return ws.answer(wsClient, endpoints.deletePost, {} as interfaces.responseMessage_deletePost, interfaces.MessageState.notFound, message.thenableId)
    }

    if (user.id !== post.author_id && user.role !== interfaces.UserRole.admin) {
      return ws.answer(wsClient, endpoints.deletePost, {} as interfaces.responseMessage_deletePost, interfaces.MessageState.unauthorized, message.thenableId)
    }

    try {
      await dbQuery(con, `DELETE FROM comments WHERE post_id = ?`, [message.message.post_id])
      await dbQuery(con, `DELETE FROM posts_votes WHERE post_id = ?`, [message.message.post_id])
      await dbQuery(con, `DELETE FROM posts WHERE id = ?`, [message.message.post_id])  
    } catch (err) {
      return ws.answer(wsClient, endpoints.deletePost, {} as interfaces.responseMessage_deletePost, interfaces.MessageState.databaseError, message.thenableId)
    }

    return ws.answer(wsClient, endpoints.deletePost, {} as interfaces.responseMessage_deletePost, interfaces.MessageState.success, message.thenableId)
  })
}