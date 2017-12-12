export enum MessageState {
  success = 200,
  error = 1,
  databaseError = 500,
  notFound = 404,
  unauthorized = 401
}

export enum UserRole {
  admin = 1,
  standard = 2
}

export interface MessageInterface {
  title: string,
  message: any,
  state: MessageState,
  token: string,
  isAuth: boolean
}

export interface MessageAuthInterface extends MessageInterface {
  login: string
}

/**
 * Post
 */
export interface Post {
  id: number,
  title: string,
  description: string,
  date: number,
  author_id: number,
  tags: string,
  author: string,
  score: number,
  image_url: string
}

/**
 * Comment
 */
export interface Comment {
  id: number,
  answers_comment: number | null,
  author_id: number,
  post_id: number,
  content: string,
  creation_date: number
}

/**
 * User
 */
export interface User {
  id: number,
  name: string,
  password: string,
  role: UserRole
}

//#region stateUpdate
export interface message_stateUpdate {
  newState: string
}
export interface stateUpdate extends MessageInterface {
  message: message_stateUpdate
}
//#endregion

//#region signup
export interface message_signup {
  login: string,
  password: string
}

export interface query_signup extends MessageInterface {
  message: message_signup
}

export interface responseMessage_signup {
  success: boolean
  message: string | null
}

export interface response_signup extends MessageInterface {
  message: responseMessage_signup
}
//#endregion

//#region signin
export interface message_signin {
  login: string,
  password: string
}

export interface query_signin extends MessageInterface {
  message: message_signin
}

export interface responseMessage_signin {
  success: boolean
  login: string
}

export interface response_signin extends MessageInterface {
  message: responseMessage_signin
}
//#endregion


//#region signinToken
export interface message_signinToken {
  login: string,
  token: string
}

export interface query_signinToken extends MessageInterface {
  message: message_signinToken
}

export interface responseMessage_signinToken {
  success: boolean
  login: string
}

export interface response_signinToken extends MessageInterface {
  message: responseMessage_signinToken
}
//#endregion


//#region GetPostComments
export interface message_getPostComments {
  id: number
}

export interface query_getPostComments extends MessageInterface {
  message: message_getPostComments
}

export interface responseMessage_getPostComments {
  comments: [Comment]
}

export interface response_getPostComments extends MessageInterface {
  message: responseMessage_getPostComments
}
//#endregion

//#region newPost
export interface message_newPost {
  title: string,
  content: string,
  tags: string,
  image_url: string
}

export interface query_newPost extends MessageAuthInterface {
  message: message_newPost
}

export interface responseMessage_newPost {
  post: Post
}

export interface response_newPost extends MessageAuthInterface {
  message: responseMessage_newPost
}
//#endregion newPost

//#region getPost
export interface message_getPost {
  id: number
}

export interface query_getPost extends MessageInterface {
  message: message_getPost
}

export interface responseMessage_getPost {
  post: Post
}

export interface response_getPost extends MessageInterface {
  message: responseMessage_getPost
}
//#endregion

//#region getPagePosts
export interface message_getPagePosts {
  page: number
}

export interface query_getPagePosts extends MessageInterface {
  message: message_getPagePosts
}

export interface responseMessage_getPagePosts {
  posts: [Post]
}

export interface response_getPagePosts extends MessageInterface {
  message: responseMessage_getPagePosts
}
//#endregion

//#region votePost
export interface message_votePost {
  post_id: number,
  is_upvote: boolean
}

export interface query_votePost extends MessageAuthInterface {
  message: message_votePost
}

export interface responseMessage_votePost {
}

export interface response_votePost extends MessageAuthInterface {
  message: responseMessage_votePost
}
//#endregion