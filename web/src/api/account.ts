import { endpoints } from '../../../server/src/shared/endpoints.ts'
import * as interfaces from '../../../server/src/Shared/interfaces'

export function signup(ws: any, login: string, password: string) {
  ws.send(endpoints.signup, { login, password } as interfaces.message_signup)
}

export function signin(ws: any, login: string, password: string) {
  ws.send(endpoints.signin, { login, password } as interfaces.message_signin)
}

export function signinToken(ws: any, login: string, token: string) {
  ws.send(endpoints.signinToken, { login, token } as interfaces.message_signinToken)
}

export function logoff(ws: any, login: string, token: string) {
  ws.send() // TODO
}