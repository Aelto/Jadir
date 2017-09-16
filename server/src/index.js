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
    }

    type Post {
      id: Int!
      title: String!
      author_id: Int!
      content: String!
      tags: String!
      author: String!
    }

    type User {
      id: Int!
      name: String!
      password: String
      role: Int!
      posts: [Post]
    }
  `)

const root = {
  post: async ({ id }, req, res) => {
    try {
      return (await api.posts.getPost(connection, id)) || []
    } catch (err) {
      console.log(err)
    }
  },
  postsPage: async ({ number }, req, res) => {
    try {
      return (await api.posts.getPosts(connection, number * 10, number * 10 + 10)) || []
    } catch (err) {
      console.log(err)
    }
  },
  user: async ({ id, name }, req, res) => {
    try {
      if (id) {
        const user = await api.users.getUserById(connection, id)
        console.log(user)
        return user
      } else if (name) {
        return await api.users.getUserByName(connection, name)
      }
    } catch (err) {
      console.log(err)
    }
  },
  newPost: async ({ title, content, tags }, req, res) => {
    if (!isAuth(req)) throw new Error('Unauthorized')

    const user = tokenUserMap.getUser(req.headers['x-access-token'])

    try {
      const userData = await api.users.getUserByName(connection, user.name)

      if (userData === null) throw new Error('Could not find user in database')

      const results = await api.posts.createPost(connection, title, content, tags, user.name, userData.id)
      return await api.posts.getPost(connection, results.insertId)
    } catch (err) {
      throw err
    }
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
    console.log(post)
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

app.listen(port)
console.log(`server listening on port ${chalk.magenta(port)}`)
