import WsManager from '../ws-manager'
import * as interfaces from '../shared/interfaces'
import { endpoints } from '../shared/endpoints'

export default function(ws: WsManager, con: any) {

  ws.on(endpoints.move, (wsClient, message: interfaces.stateUpdate) => {
    if (!message.token)
      return

    ws.clients.updateState(ws.clients.getUser(message.token), message.message.newState)
  })

}