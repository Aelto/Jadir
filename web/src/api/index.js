import posts from './posts.js'
import auth from './auth.js'
import routes from './routes.js'

const index = (router, data) => ({
  posts: posts(router, data),
  auth: auth(router, data),
  routes: routes(router, data)
})

export default index