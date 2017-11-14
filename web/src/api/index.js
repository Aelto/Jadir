import posts from './posts.js'
import auth from './auth.js'
import routes from './routes.js'
import comments from './comments.js'

const index = (router, data) => ({
  posts: posts(router, data),
  auth: auth(router, data),
  routes: routes(router, data),
  comments: comments(router, data)
})

export default index