import * as http from 'http'
import WsManager from '../ws-manager'

import stateUpdate from './state-update'
import posts from './posts'
import comments from './comments'
import account from './account'
import users from './users'

export default function(app: any, con: any): WsManager {
  const ws = new WsManager()

  const inactivityInterval = setInterval(() => {
    ws.clients.removeInactiveUsers(1000 * 60 * 24) // inactive for 24 minutes 
  }, 1000 * 60) // every minute

  stateUpdate(ws, con)
  posts(ws, con)
  comments(ws, con)
  account(ws, con)
  users(ws, con)

  return ws
}