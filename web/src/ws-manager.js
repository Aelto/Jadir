export default class WsManager {
  constructor() {
    /**
     * created for later, will be the
     * variable holding the reference
     * of the connection websocket.
     */
    this.ws = null

    /**
     * created for later, will be the
     * variable storing all the event
     * functions by their names.
     */
    this.events = {}

    /**
     * created for later, will be passed
     * into each of the messages sent
     * to the server to identify us.
     */
    this.token = 'none'

    /**
     * created for later, this is the
     * name used for login
     */
    this.username = null

    /**
     * a list of functions executed
     * when the onclose event is fired
     */
    this.oncloseEvents = []
  }

  on(name, fn) {
    this.events[name] = fn
  }

  onAnswer(name, fn) {
    this.events[name + '-done'] = fn
  }

  emit(name, obj) {
    const chosenEvent = this.events[name]
    if (chosenEvent && typeof chosenEvent === 'function') {
      chosenEvent(obj)
    }
  }

  _onmessage(message) {
    this.emit(message.title, message)
  }

  _onclose(e) {
    this.oncloseEvents.forEach(fn => fn())
  }

  addOnclose(fn) {
    this.oncloseEvents.push(fn)
  }

  send(name, message) {
    console.log('sent %c' + name, 'color: green')

    if (this.username === null) {
      this.ws.send(JSON.stringify({ title: name, message, token: this.token || null }))
    }

    else {
      this.ws.send(JSON.stringify({ title: name, login: this.username, message, token: this.token || null }))
    }

  }

  thenable(name, message) {
    return new Promise((resolve, reject) => {
      this.on(name + '-done', message => {
        resolve(message)
      })

      this.send(name, message)
    })
  }

  /**
   * simply opens the websocket connection.
   */
  open(address) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`ws://${address}/ws`)

      this.ws.onopen = _ => resolve(this)

      this.ws.onclose = e => this._onclose(e)

      this.ws.onmessage = e => {
        this._onmessage(JSON.parse(e.data))
      }
    })
  }

  /**
   * hit the server to let it know we want
   * to get a fresh new clientId, which
   * will be used for every request sent
   * to the server via a ws connection.
   */
  synchronize() {
    return new Promise((resolve, reject) => {
      // this event will be emitted once the
      // synchronisation is done.
      this.on('synchronize-done', response => {
        this.token = response.message.token
        resolve(response)
      })

      this.send('synchronize', {})
    })
  }

  setUsername(username) {
    this.username = username
  }
}