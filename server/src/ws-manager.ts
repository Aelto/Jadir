import * as Websocket from 'ws'
import * as http from 'http'
import TokenUserMap from './token-user-map'
import { MessageInterface } from './shared/interfaces'
import * as interfaces from './shared/interfaces'

export default class WsManager {
  events: { [key: string]: (wsClient: Websocket, message: MessageInterface) => void }
  clients: TokenUserMap

  constructor() {
    this.events = {}

    this.clients = new TokenUserMap()
  }

  on(name: string, fn: (wsClient: Websocket, message: MessageInterface) => void) {
    this.events[name] = fn

    return this
  }

  _onmessage(message: any, ws: any) {
    if (message.token && this.clients.doesUserExist(message.token)) {
      message.isAuth = this.clients.isUserAuth(message.token, message.login)

      this.clients.updateActivity(message.token)
    }

    this.emit(message.title, message, ws)
  }

  emit(name: string, obj: any, ws: any) {
    const chosenEvent = this.events[name]
    if (chosenEvent && typeof chosenEvent === 'function') {
      chosenEvent(ws, obj)
    }
  }

  send(wsClient: Websocket, name: string, message: { [key: string]: any }, state: interfaces.MessageState, thenableId: number | null = null) {
    wsClient.send(JSON.stringify({ title: name, message: message, state, thenableId }))
  }

  answer(wsClient: Websocket, name: string, message: { [key: string]: any }, state: interfaces.MessageState = interfaces.MessageState.success, thenableId: number | null = null) {
    this.send(wsClient, name + '-done', message, state, thenableId)
  }

  accept(app: any, path: string) {
    this.on('synchronize', (wsClient: Websocket, message: MessageInterface) => {
      const token = this.clients.addUser(wsClient)

      this.answer(wsClient, 'synchronize', { token })
    })

    this.on('login', (wsClient: Websocket, message: MessageInterface) => {
      
    })

    app.ws(path, (ws: Websocket, req: any) => {
      ws.on('message', (message: any) => {
        this._onmessage(JSON.parse(message), ws)
      })
    })

    return this
  }
}