import app from './views/app.vue'
import explore from './views/explore.vue'
import post from './views/posts/post.vue'
import signup from './views/signup.vue'
import signin from './views/signin.vue'
import newPost from './views/posts/new-post.vue'

export default [
  {
    path: '/',
    beforeEnter: (to, from, next) => next('/explore/1')
  },
  {
    path: '/explore',
    beforeEnter: (to, from, next) => next('/explore/1')
  },
  {
    path: '/explore/:page',
    component: explore
  },
  {
    path: '/post/:id',
    component: post
  },
  {
    path: '/signup',
    component: signup
  },
  {
    path: '/signin',
    component: signin
  },
  {
    path: '/new-post',
    component: newPost
  },
  {
    path: '*',
    beforeEnter: (to, from, next) => {
      console.log('from', from)

      next('/')
    }
  },
]
