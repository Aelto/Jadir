import app from './views/app.vue'
import home from './views/home.vue'
import signin from './views/signin.vue'
import signup from './views/signup.vue'
import newPost from './views/new-post.vue'
import post from './views/post/post.vue'

let beforeSigninRoute = null

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
  { path: '/signin', component: signin,
    beforeEnter: (to, from, next) => {
      beforeSigninRoute = from

      next()
    }
  },
  { path: '/signin/done', 
    beforeEnter: (to, from, next) => {
      if (beforeSigninRoute === null) {
        next('/')
      }

      else {
        next(beforeSigninRoute.path)
      }
    }
  },
  { path: '/new-post', component: newPost },
  { path: '/post/:id', component: post, props: { post: true } },
  { 
    path: '*',
    beforeEnter: (to, from, next) => next('/home')
  }
]
