
import app from './views/app.vue'
import home from './views/home.vue'
import signin from './views/signin.vue'
import signup from './views/signup.vue'

export default [
  { path: '/home', component: home },
  { path: '/signup', component: signup },
  { path: '/signin', component: signin },
]