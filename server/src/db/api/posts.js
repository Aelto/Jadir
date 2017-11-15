const mysql = require('mysql')

exports.createPost = function createPost(con, title, description, tags, author, authorId) {
  return new Promise((resolve, reject) => {
    const date = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    con.query(
      `INSERT INTO posts (title, author_id, author, content, tags, date)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [title, authorId, author, description, tags, date],
      (err, results, fields) => {
        if (err) reject(err)
        else resolve(results.length ? results[0] : results)
      }
    )
  })
}

exports.getPost = function getPost(con, id) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM posts WHERE id=?`, [id], (err, results, fields) => {
      if (err) reject(err)
      else if (!results.length) {
        resolve(null)
      } else if (results.length === 1) {
        resolve(results[0])
      }
      if (results.length > 1) {
        reject(`Duplicate in data, found ${results.length} where id = ${id}`)
      }
    })
  })
}

function getPostVotes(con, id) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM posts_votes WHERE post_id=?`, [id], (err, results, fields) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}
exports.getPostVotes = getPostVotes

exports.getPostVoteFromUser = function getPostVoteFromUser(con, user_id, post_id) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT is_upvote FROM posts_votes WHERE post_id=? AND user_id=?`,
      [post_id, user_id],
      (err, results, fields) => {
      
      if (err) reject(err)
      else if (!results.length)
        return resolve(null)
      else resolve(results[0])
    })
  })
}

exports.newPostVote = function newPostVote(con, post_id, user_id, vote_value) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO posts_votes (post_id, user_id, is_upvote)
       VALUES (?, ?, ?)`,
       [post_id, user_id, vote_value ? 1 : 0],
       (err, results, fields) => {
         if (err) reject(err)
         else resolve({ post_id, user_id, vote_value })
       }
    )
  })
}

exports.updatePostVote = function updatePostVote(con, post_id, user_id, vote_value) {
  return new Promise((resolve, reject) => {
    con.query(
      `UPDATE posts_votes SET is_upvote=? where post_id=? AND user_id=?`,
      [vote_value ? 1 : 0, post_id, user_id],
      (err, results, fields) => {
        if (err) reject(err)
        else resolve({ post_id, user_id, vote_value })
      }
    )
  })
}

exports.getPostVoteScore = function getPostVoteScore(con, id) {
  return getPostVotes(con, id)
  .then(votes => {
    let score = 0
    for (const vote of votes) {
      score += vote.is_upvote ? 1 : -1
    }

    return score
  })
}

exports.votePost = function votePost(con, post_id, vote_value) {
  return new Promise((resolve, reject) => {
    con.query(`insert`)
  })
}

exports.getPosts = function getPosts(con, firstId, lastId) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM posts WHERE id BETWEEN ? and ?`, [firstId, lastId], (err, results, fields) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}
