import { endpoints } from '../../../server/src/shared/endpoints.ts'
import * as interfaces from '../../../server/src/Shared/interfaces'

export function setUserImage(ws: any, image_url: string) {
  ws.send(endpoints.setUserImage, { image_url } as interfaces.message_setUserImage)
}

export function getUserProfile(ws: any, username: string) {
  ws.send(endpoints.getUserProfile, { username } as interfaces.message_getUserProfile)
}