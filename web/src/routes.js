import app from './views/app.vue'
import explore from './views/explore.vue'
import post from './views/posts/post.vue'
import signup from './views/signup.vue'
import signin from './views/signin.vue'
import newPost from './views/posts/new-post.vue'
import profile from './views/profile.vue'
import userPosts from './views/posts/user-posts.vue'

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
    component: explore,
    name: 'explore'
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
    path: '/tag/:tag',
    component: explore,
    name: 'tag'
  },
  {
    path: '/search/:search',
    component: explore,
    name: 'search'
  },
  {
    path: '/profile/:user',
    component: profile,
    name: 'profile'
  },
  {
    path: '/posts/:user',
    component: userPosts,
    name: 'user-post'
  },
  {
    path: '*',
    beforeEnter: (to, from, next) => {

      next('/')
    }
  },
]
