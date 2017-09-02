
import routes from './routes'

import app from './views/app.vue'

const data = {
  global: {}
}

const router = new VueRouter({ routes })
router.push({ path: 'home' })

const appVue = new Vue({
  el: '.app-wrapper',
  components: { app },
  router,
  data
})
