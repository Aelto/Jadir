export function _fetch(type, url, opt) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()

    if (type === 'GET') {
      let params = ''
      if (opt.data) {
        console.log(opt.data)
        params =
          '?' +
          Object.keys(opt.data)
            .map(key => key + '=' + opt.data[key])
            .join('&')
      }

      req.open(type, url + params, true)
      // req.setRequestHeader('content-type', 'application/x-www-form-urlencoded')

      if (opt.token) {
        req.setRequestHeader('x-access-token', opt.token)
      }

      req.onload = () => {
        if (req.status == 200) resolve(req.responseText, url)
        else reject(req.responseText, url)
      }

      req.send(null)
    }

    if (type === 'POST') {
      req.open(type, url, true)
      // if (!req.data) req.setRequestHeader('content-type', 'application/x-www-form-urlencoded')

      if (opt.token) {
        req.setRequestHeader('x-access-token', opt.token)
      }

      req.onload = () => {
        if (req.status == 200) resolve(req.responseText, url)
        else reject(req.responseText, url)
      }

      if (opt.data) {
        req.setRequestHeader('Content-type', 'application/json')
        req.send(JSON.stringify(opt.data))
      } else req.send()
    }
  })
}
