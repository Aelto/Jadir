import routes from './routes'
import { _fetch } from './utils'

import app from './views/app.vue'
import api from './api/index.js'

const router = new VueRouter({ routes })
const data = {
  global: {},
  
  account: {
    logged: false,
    token: null,
    username: null
  },

  currentPost: null,
  homePagePosts: []
}
data.global.api = api(router, data)

const appVue = new Vue({
  el: '.app-wrapper',
  components: { app },
  router,
  data
})
