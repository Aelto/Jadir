import { endpoints } from '../../../server/src/shared/endpoints.ts'
import * as interfaces from '../../../server/src/Shared/interfaces'

export function getPostComments(ws: any, id: number) {
  ws.send(endpoints.getPostComments, { id } as interfaces.message_getPostComments)
}