import { endpoints } from '../../../server/src/shared/endpoints.ts'
import * as interfaces from '../../../server/src/Shared/interfaces'

export function getPostComments(ws: any, id: number) {
  ws.send(endpoints.getPostComments, { id } as interfaces.message_getPostComments)
}

export function createPostComment(ws: any, post_id: number, 
  answers_comment: number | null, content: string) {
  ws.send(endpoints.createPostComment, {
    post_id, answers_comment, content
  } as interfaces.message_createPostComment)
}