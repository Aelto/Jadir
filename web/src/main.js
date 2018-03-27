import routes from './routes'
import app from './views/app.vue'
import WsManager from './ws-manager.js'
import api from './api/api.ts'

const ws = new WsManager()
ws.addOnclose(e => console.log("Connection to server closed"))
ws.open(`${location.hostname}:${location.port}`)
.then(manager => ws.synchronize())
.then(res => {
  console.log(res)

  const router = new VueRouter({ routes, mode: 'history' })
  const data = {
    global: {
      ws,
      api,
      route: (to) => {
        router.push({ path: to })
      }
    },

    currentPost: null,
    
    account: {
      logged: false,
      username: null,
      profile: null
    }
  }

  data.global.updateProfileData = () => {
    if (!data.account.username) {
      throw new Error('no username in memory to update profile data')
    }

    api.users.getUserProfile(ws, data.account.username)
  }
  data.global.setCurrentPost = p => data.currentPost = p
  data.global.setCurrentPostScore = score => data.currentPost.score = score
  data.global.setAccountUsername = username => {
    data.account.username = username
    data.account.logged = true

    ws.setUsername(username)
  }
  data.global.search = (searchContent) => {
    api.posts.getPagePostsSearch(ws, 0, searchContent)
  }
  data.global.setLocalStorageAccount = (login, token) => {
    localStorage.session = JSON.stringify({ login, token })
  }
  data.global.logoff = () => {
    data.account.username = null
    data.account.logged = false

    data.global.setLocalStorageAccount('', '')
  }


  ws.onAnswer('signinToken', res => {
    data.global.setAccountUsername(res.message.login)
    data.global.updateProfileData()
  })

  ws.onAnswer('getUserProfile', res => {
    data.account.profile = res.message.user
  })

  if (localStorage.session) {
    const session = JSON.parse(localStorage.session)    

    if (session.login && session.token) {
      api.account.signinToken(ws, session.login, session.token)
    }
  }

  const appVue = new Vue({
    el: '.app-wrapper',
    components: { app },
    router,
    data
  })

})


