export default (router, data) => ({
  authenticate: (name, password) => {
    return fetch(`http://${location.hostname}:3000/signin`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    })
      .then(res => res.json())
      .then(obj => {
        if (obj.message === "could not authenticate") {
          return false
        } 
        
        else {
          data.account.logged = true
          data.account.token = obj.token
          data.account.username = obj.name

          localStorage.session = JSON.stringify({ name, password })

          return true
        }
      })
  },
  signup: (login, password) => {
    return fetch(`http://${location.hostname}:3000/signup`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: login, password })
    })
  }
})
