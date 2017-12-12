import { endpoints } from '../../../server/src/shared/endpoints.ts'
import * as interfaces from '../../../server/src/Shared/interfaces'

export function getPagePosts(ws: any, page: number) {
  ws.send(endpoints.getPagePosts, { page } as interfaces.message_getPagePosts)
}

export function getPost(ws: any, id: number) {
  ws.send(endpoints.getPost, { id } as interfaces.message_getPost)
}

export function newPost(ws: any, title: string, description: string, tags: string, image_url: string = '') {
  ws.send(endpoints.newPost, { 
    title, 
    content: description, 
    tags, 
    image_url: image_url.length ? image_url : null
  } as interfaces.message_newPost)
}

export function votePost(ws: any, id: number, is_upvote: boolean) {
  ws.send(endpoints.votePost, {
    post_id: id,
    is_upvote
  } as interfaces.message_votePost)
}