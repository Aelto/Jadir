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
    currentProfile: null,
    
    account: {
      logged: false,
      username: null,
      profile: null
    }
  }

  let updateProfileDataCallbacks = {}
  data.global.updateProfileData = (username = data.account.username, callback = null) => {
    if (!username) {
      throw new Error('no username in memory to update profile data')
    }

    updateProfileDataCallbacks[username] = callback

    if (!ws.events['getUserProfile-done']) {
      ws.onAnswer('getUserProfile', res => {
        console.log(res)
        // update self profile data only when it is equals
        // to the username in memory
        if (res.message.user.name === data.account.username) {
          data.global.setProfile(res.message.user)
        }
  
        if (updateProfileDataCallbacks[res.message.user.name] !== null) {
          updateProfileDataCallbacks[res.message.user.name](res)

          delete updateProfileDataCallbacks[res.message.user.name]
        }
      })
    }

    api.users.getUserProfile(ws, username)
  }

  data.global.setProfile = profile => data.account.profile = profile

  data.global.setCurrentPost = p => data.currentPost = p
  data.global.setCurrentProfile = p => data.currentProfile = p
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

  window.test = (id) => { // TODO
    api.posts.getPostUserVote(data.global.ws, id)
    .then(console.log)
  }


  ws.onAnswer('signinToken', res => {
    data.global.setAccountUsername(res.message.login)
    data.global.updateProfileData()
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


