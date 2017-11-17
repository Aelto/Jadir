const path = require('path')
const chalk = require('chalk')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const bodyParser = require('body-parser')
const initDatabase = require('./db/db-init.js')
const TokenUserMap = require('./token-user-map.js')

const api = require('./db/api/all')

const webRoot = path.join(__dirname, `../../app/`)
const port = 3000

const app = express()
const connection = initDatabase(app)

const tokenUserMap = new TokenUserMap()
const isAuth = req => req.headers['x-access-token'] && tokenUserMap.doesUserExist(req.headers['x-access-token'])

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/app', express.static(webRoot))
app.use('/assets', express.static(path.join(webRoot, '/assets')))
app.get('/', (req, res) => res.sendFile(path.join(webRoot, `index.html`)))

app.get('/is-auth', (req, res) => {
  if (!isAuth(req)) res.status(401).send({ response: 'no' })

  res.send({ response: 'yes' })
})

const schema = buildSchema(`
    type Query {
      post(id: Int!): Post
      postsPage(number: Int!): [Post]!
      newPost(title: String!, content: String!, tags: String!): Post!
      user(id: Int, name: String): User
      comment(id: Int!): Comment
      postComments(id: Int!): [Comment]!
      newComment(post_id: Int!, author_name: String!, answers_comment: Int, content: String!): Comment
      votePost(post_id: Int!, vote_value: Boolean!, user_name: String!): Int!
      getPostVotes(post_id: Int!): [Post_vote]
      getPostVoteScore(post_id: Int!): Int!
    }

    type Post {
      id: Int!
      title: String!
      author_id: Int!
      content: String!
      tags: String!
      author: String!
      score: Int!
    }

    type User {
      id: Int!
      name: String!
      role: Int!
      posts: [Post]
    }

    type Comment {
      id: Int!
      content: String!
      author_id: Int!
      answers_comment: Int
      post_id: Int!
      creation_date: String!
      author: String!
    }

    type Post_vote {
      id: Int!
      post_id: Int!
      user_id: Int!
      is_upvote: Boolean!
    }
  `)

const root = {}

root.post = async ({ id }, req, res) => {
  try {
    const post = await api.posts.getPost(connection, id)
    const score = await api.posts.getPostVoteScore(connection, id)

    post.score = score
    return post
  } catch (err) {
    console.log(err)
  }
}

root.postsPage = async ({ number }, req, res) => {
  try {
    const posts = await api.posts.getPosts(connection, (number - 1) * 20, (number - 1) * 20 + 20)
    
    for (const post of posts) {
      const score = await api.posts.getPostVoteScore(connection, post.id)
      post.score = score
    }

    return posts || []
  } catch (err) {
    console.log(err)
  }
}

root.user = async ({ id, name }, req, res) => {
  try {
    if (id) {
      const user = await api.users.getUserById(connection, id)
      return user
    } else if (name) {
      return await api.users.getUserByName(connection, name)
    }
  } catch (err) {
    console.log(err)
  }
}

root.newPost = async ({ title, content, tags }, req, res) => {
  if (!isAuth(req))  {
    res.status(401)
    return { error: 'Unauthorized' }
    // throw new Error('Unauthorized')
  }

  const user = tokenUserMap.getUser(req.headers['x-access-token'])

  try {
    const userData = await api.users.getUserByName(connection, user.name)

    if (userData === null) throw new Error('Could not find user in database')

    if (userData.name !== user.name) throw new Error('Unauthorized')

    const results = await api.posts.createPost(connection, title, content, tags, user.name, userData.id)
    return await root.post({ id: results.insertId }, req, res)
  } catch (err) {
    throw err
  }
}

root.comment = async ({ id }, req, res) => {
  try {
    const comment = await api.comments.getComment(connection, id)

    return comment
  } catch (err) {
    throw err
  }
}

root.postComments = async ({ id }, req, res) => {
  try {
    const posts = await api.comments.getPostComments(connection, id)
    return posts || []
  } catch (err) {
    throw err
  }
}

root.getPostVotes = async ({ post_id }, req, res) => {
  try {
    const votes = await api.posts.getPostVote(connection, post_id)
    
    return votes
  } catch (err) {
    throw err
  }
}

root.getPostVoteScore = async ({ post_id }, req, res) => {
  try {
    const score = await api.posts.getPostVoteScore(connection, post_id)
    return score
  } catch (err) {
    throw err
  }
}

root.votePost = async ({ post_id, vote_value, user_name }, req, res) => {
  try {
    if (!isAuth(req)) throw new Error('Unauthorized')

    const user = tokenUserMap.getUser(req.headers['x-access-token'])

    if (user.name !== user_name) {
      return await api.posts.getPostVoteScore(connection, post_id)
    }
    
    const userData = await api.users.getUserByName(connection, user.name)

    const postVoteFromUser = await api.posts.getPostVoteFromUser(connection, userData.id, post_id)

    if (postVoteFromUser === null) {
      await api.posts.newPostVote(connection, post_id, userData.id, vote_value)
    }

    else if (vote_value !== postVoteFromUser.is_upvote) {
      await api.posts.updatePostVote(connection, post_id, userData.id, vote_value)
    }

    const newScore = await api.posts.getPostVoteScore(connection, post_id)
    return newScore
  } catch (err) {
    console.log(err)
  }
}

root.newComment = async ({ post_id, author_name, answers_comment, content }, req, res) => {
  if (!isAuth(req)) throw new Error('Unauthorized')

  const user = tokenUserMap.getUser(req.headers['x-access-token'])

  try {
    if (user.name !== author_name) throw new Error('Unauthorized')

    const userData = await api.users.getUserByName(connection, user.name)
    if (userData === null) throw new Error('Could not find user in database')

    const comment = await api.comments.createPostComment(connection, post_id, answers_comment, userData.id, content)

    return await api.comments.getComment(connection, comment.insertId)
  } catch (err) {
    throw err
  }
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, `temp.html`)))

app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }))

app.post('/signin', (req, res) => api.auth.signin(req, res, connection, tokenUserMap))

app.post('/users/:userName', (req, res) =>
  api.users.addUser(connection, req.params.userName).then(results => res.send({ results }), err => res.send({ err }))
)

app.post('/posts/new-post', async (req, res) => {
  if (!req.body.title || !req.body.content || !req.body.tags)
    return res.status(400).send({ message: 'Requires a title, a content and tags to create a post' })

  const user = tokenUserMap.getUser(req.headers['x-access-token'])

  try {
    const userData = await api.users.getUserByName(connection, user.name)

    if (userData === null) throw 'Could not find user in database'

    const results = await api.posts.createPost(connection, req.body.title, req.body.content, req.body.tags, user.name, userData.id)
    return res.status(200).send({ title: req.body.title, author: user.name, id: results.insertId })
  } catch (err) {
    res.status(500).send({ err })
  }
})

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await api.posts.getPost(connection, req.params.id)
    res.status(200).send(post)
  } catch (err) {
    res.status(500).send({ err })
  }
})

app.get('/posts/page/:pageNumber', async (req, res) => {
  try {
    const posts = await api.posts.getPosts(connection, req.params.pageNumber * 10, req.params.pageNumber * 10 + 10)
    res.status(200).send(posts)
  } catch (err) {
    res.status(500).send({ err })
  }
})

app.get('/users/id/:userId', (req, res) =>
  api.users.getUserById(connection, req.params.userId).then(results => res.send({ user: results }), err => res.send({ err }))
)

app.get('/users/name/:userName', (req, res) => {
  api.users.getUserByName(connection, req.params.userName).then(
    user => {
      if (user === null) {
        res.status(404).send({ user: null })
        return
      } else {
        if (password in user) {
          delete user.password
        }

        res.status(200).send({ user })
      }
    },
    err => res.status(500).send({ err })
  )
})

app.get('*', (req, res) => res.sendFile(path.join(webRoot, `index.html`)))

app.listen(port)
console.log(`server listening on port ${chalk.magenta(port)}`)
