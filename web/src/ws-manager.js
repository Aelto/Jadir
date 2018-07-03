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

    /**
     * a list of `unique-id: Promise`
     */
    this.thenables = {}

    /**
     * the counter used as a unique id in this.thenables
     */
    this.counter = 0
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
    if (message.thenableId) {
      this.consumeThenable(message.thenableId, message)
    }

    this.emit(message.title, message)
  }

  _onclose(e) {
    this.oncloseEvents.forEach(fn => fn())
  }

  addOnclose(fn) {
    this.oncloseEvents.push(fn)
  }

  send(name, message, thenableId = null) {
    console.log('sent %c' + name, 'color: green')

    if (this.username === null) {
      this.ws.send(JSON.stringify({ title: name, message, thenableId, token: this.token || null }))
    }

    else {
      this.ws.send(JSON.stringify({ title: name, login: this.username, message, thenableId, token: this.token || null }))
    }

  }

  generateNewId() {
    this.counter = (this.counter + 1) % 1000

    return this.counter
  }

  hasThenable(id) {
    return !!this.thenables[id]
  }

  consumeThenable(id, data = null) {
    if (!this.hasThenable(id))
      return

    this.thenables[id](data)

    delete this.thenables[id]
  }

  thenable(name, message) {
    const uniqueId = this.generateNewId()
    const promise = new Promise(resolve => {
      this.thenables[uniqueId] = resolve
    })
    
    this.send(name, message, uniqueId)

    return promise 
  }

  /**
   * simply opens the websocket connection.
   */
  open(address) {
    return new Promise((resolve, reject) => {
      if (window.location.protocol === 'https:') {
        this.ws = new WebSocket(`wss://${address}/ws`)
      }

      else {
        this.ws = new WebSocket(`ws://${address}/ws`)
      }
      

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