export default (router, data) => ({
  authenticate: (name, password) => {
    return fetch('http://localhost:3000/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    })
      .then(res => res.json())
      .then(obj => {
        data.account.logged = true
        data.account.token = obj.token
        data.account.username = obj.name
      })
  }
})
