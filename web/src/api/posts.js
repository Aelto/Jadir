const posts = (router, data) => ({
  /**
   * Make the supplied post the current viewed post
   * Automatically redirects to the /post/:id route
   */
  viewPost: post => {
    data.currentPost = post

    router.push({ path: `/post/${post.id}` })
  },

  viewPostById: id => {
    router.push({ path: `/post/${post.id}` })
  },

  createPost: (title, content, tags) => {
    return fetch(`http://${location.hostname}:3000/graphql`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', 'x-access-token': data.account.token },
      body: JSON.stringify({
        query: `
          query NewPost($title: String!, $content: String!, $tags: String!) {
            newPost(title: $title, content: $content, tags: $tags) {
              id
              title
              content
              author
              tags
              score
            }
          }
        `,
        variables: { title, content, tags }
      })
    }).then(response => response.json())
  },

  votePost: (post_id, vote_value) => {
    if (!data.account.token || !data.account.username || !data.account.logged)
      return Promise.resolve('Unauthorized')

    return fetch(`http://${location.hostname}:3000/graphql`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', 'x-access-token': data.account.token },
      body: JSON.stringify({
        query: `
          query VotePost($post_id: Int!, $vote_value: Boolean!, $username: String!) {
            votePost(post_id: $post_id, vote_value: $vote_value, user_name: $username)
          }
        `,
        variables: { post_id, vote_value, username: data.account.username }
      })
    }).then(response => response.json())
  },

  setCurrentPost: post => (data.currentPost = post),

  getPost: id =>
    fetch(`http://${location.hostname}:3000/graphql`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', 'x-access-token': data.account.token },
      body: JSON.stringify({
        query: `
      {
        post(id: ${id}) {
          id
          title
          content
          author
          tags
          score
        }
      }
    `
      })
    }).then(response => response.json()),

  getPostComments: id =>
    fetch(`http://${location.hostname}:3000/graphql`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', 'x-access-token': data.account.token },
      body: JSON.stringify({
        query: `
      {
        postComments(id: ${id}) {
          id
          content
          author_id
          answers_comment
          post_id
          creation_date
          author
        }
      }
    `
      })
    }).then(response => response.json()),

  getPostsPage: id =>
    fetch(`http://${location.hostname}:3000/graphql`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', 'x-access-token': data.account.token },
      body: JSON.stringify({
        query: `
      {
        postsPage(number: ${id}) {
          id
          title
          content
          author
          tags
          score
        }
      }
    `
      })
    }).then(response => response.json())
})

export default posts
