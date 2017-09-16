import app from './views/app.vue'
import home from './views/home.vue'
import signin from './views/signin.vue'
import signup from './views/signup.vue'
import newPost from './views/new-post.vue'
import post from './views/post.vue'

export default [
  {
    path: '/',
    beforeEnter: (to, form, next) => next('/home/1')
  },
  {
    path: '/home',
    beforeEnter: (to, from, next) => next('/home/1')
  },
  {
    path: '/home/:page',
    component: home,
    props: { home: true }
  },
  { path: '/signup', component: signup },
  { path: '/signin', component: signin },
  { path: '/new-post', component: newPost },
  { path: '/post/:id', component: post, props: { post: true } }
]
