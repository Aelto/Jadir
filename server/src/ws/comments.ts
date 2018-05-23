import WsManager from '../ws-manager'
import * as interfaces from '../shared/interfaces'
import { endpoints } from '../shared/endpoints'
import dbQuery from '../db-query'
import { CommentsTree } from '../shared/interfaces';

export default function(ws: WsManager, con: any) {

  const recursiveBuildCommentsTree = (list: any, unparsedCommentsIndices: [number], currentComment) => {
    currentComment.children_comments = [] as [CommentsTree]

    const stillUnparsedComments = [] as [number]
    for (const index of unparsedCommentsIndices) {
      if (list[index].answers_comment === currentComment.id) {
        currentComment.children_comments.push(list[index])
      }

      else {
        stillUnparsedComments.push(index)
      }
    }

    for (const subComment of currentComment.children_comments)
      recursiveBuildCommentsTree(list, stillUnparsedComments, subComment)
  }

  ws.on(endpoints.getPostComments, async (wsClient, message: interfaces.query_getPostComments) => {
    const id = message.message.id || 0

    try {
      const comments = await dbQuery(con, 
        `SELECT c.*, u.name as author FROM comments as c
         LEFT JOIN users as u on c.author_id = u.id
         WHERE c.post_id=? AND c.root_id IS NULL`,
         [id])

      for (const comment of comments) {
        if (comment.root_id !== null)
          continue

        const subComments = await dbQuery(con,
          `SELECT c.*, u.name as author FROM comments as c
          LEFT JOIN users as u on c.author_id = u.id
          WHERE c.root_id = ?`,
          [comment.id])

        if (subComments.length) {
          comment.children_comments = subComments

          let i: number = subComments.length
          const indicesArray: [number] = new Array(i) as [number]
          while (i--)
            indicesArray[i] = i

          recursiveBuildCommentsTree(subComments, indicesArray, comment)
        }
        else comment.children_comments = []

      }

      ws.answer(wsClient, endpoints.getPostComments, { comments } as interfaces.responseMessage_getPostComments)
    } catch (err) {
      ws.answer(wsClient, endpoints.getPostComments, {}, interfaces.MessageState.databaseError)
    }
  })

  ws.on(endpoints.createPostComment, async (wsClient, message: interfaces.query_createPostComment) => {
    if (!message.isAuth) {
      return ws.answer(wsClient, endpoints.createPostComment, {}, interfaces.MessageState.unauthorized)
    }

    if (!message.message.content.trim().length) {
      return ws.answer(wsClient, endpoints.createPostComment, {}, interfaces.MessageState.error)
    }

    let user: interfaces.User = null
    try {
      const results = await dbQuery(con, 'SELECT * FROM users WHERE name = ?', [message.login])
      
      if (!results.length) {
        return ws.answer(wsClient, endpoints.createPostComment, {}, interfaces.MessageState.unauthorized)
      }

      user = results[0]
    } catch (err) {
      return ws.answer(wsClient, endpoints.createPostComment, {}, interfaces.MessageState.databaseError)
    }

    try {
      let root_id = null
      if (message.message.answers_comment !== null) {
        const res = await dbQuery(con,
          `SELECT root_id FROM comments WHERE id = ?`, [message.message.answers_comment])

        if (res.length)
          root_id = res[0].root_id
      }

      const insertResult = await dbQuery(con,
        `INSERT INTO comments (answers_comment, author_id, post_id, content, creation_date, root_id)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [message.message.answers_comment, user.id, message.message.post_id,
          message.message.content, new Date()
          .toLocaleString()
          .slice(0, 19)
          .replace('T', ' '), root_id === null ? message.message.answers_comment : root_id])

      const results = await dbQuery(con,
        `SELECT * from comments WHERE id = ?`, [insertResult.insertId])

      if (results.length) {
        const comment: interfaces.Comment = results[0]

        ws.answer(wsClient, endpoints.createPostComment, {
          answers_comment: comment.answers_comment,
          content: comment.content,
          creation_date: comment.creation_date,
          author_id: comment.author_id,
          id: comment.id,
          post_id: comment.post_id
        } as interfaces.responseMessage_createPostComment)
      }

      else {
        ws.answer(wsClient, endpoints.createPostComment, {}, interfaces.MessageState.databaseError)
      }
    } catch (error) {
      ws.answer(wsClient, endpoints.createPostComment, {}, interfaces.MessageState.databaseError)
    }
  })
}