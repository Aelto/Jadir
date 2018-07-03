import { endpoints } from '../../../server/src/shared/endpoints.ts'
import * as interfaces from '../../../server/src/Shared/interfaces'

export function getPagePosts(ws: any, page: number) {
  ws.send(endpoints.getPagePosts, { page } as interfaces.message_getPagePosts)
}

export function getPagePostsSearch(ws: any, page: number, search: string) {
  ws.send(endpoints.getPagePostsSearch, { page, search } as interfaces.message_getPagePostsSearch)
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

export function getPostScore(ws: any, id: number) {
  ws.send(endpoints.getPostScore, {
    post_id: id
  } as interfaces.message_getPostScore)
}

export function getUserPosts(ws: any, username: string) {
  ws.send(endpoints.getUserPosts, {
    username
  } as interfaces.message_getUserPosts)
}

export function getPostUserVote(ws: any, id: number) {
  return ws.thenable("getPostUserVote", { id })
}

export function deletePost(ws: any, post_id: number) {
  return ws.thenable(endpoints.deletePost, { post_id } as interfaces.message_deletePost)
}