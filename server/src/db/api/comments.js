const mysql = require('mysql')

exports.getComment = function getComment(con, id) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT c.*, u.name as author FROM comments as c
       LEFT JOIN users as u on c.author_id = u.id
       WHERE c.id=?`,
      [id],
      (err, results, fields) => {
        if (err) reject(err)
        else if (!results.length) {
          resolve(null)
        } else if (results.length === 1) {
          resolve(results[0])
        }
        if (results.length > 1) {
          reject(`Duplicate in data, found ${results.length} where id = ${id}`)
        }
      }
    )
  })
}

exports.getPostComments = function getPostComments(con, id) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT c.*, u.name as author FROM comments as c
       LEFT JOIN users as u on c.author_id = u.id
       WHERE c.post_id=?
       ORDER BY c.creation_date`,
      [id],
      (err, results, fields) => {
        if (err) reject(err)
        else resolve(results)
      }
    )
  })
}

exports.createPostComment = function createPostComment(con, post_id, answers_comment, author_id, content) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO comments (answers_comment, author_id, post_id, content)
      VALUES (?, ?, ?, ?)`,
      [answers_comment, author_id, post_id, content],
      (err, results, fields) => {
        if (err) reject(err)
        else resolve(results.length ? results[0] : results)
      }
    )
  })
}
