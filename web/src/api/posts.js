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
    return fetch('http://localhost:3000/graphql', {
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
            }
          }
        `,
        variables: { title, content, tags }
      })
    }).then(response => response.json())
  },

  setCurrentPost: post => (data.currentPost = post),

  getPost: id =>
    fetch('http://localhost:3000/graphql', {
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
        }
      }
    `
      })
    }).then(response => response.json()),

  getPostsPage: id =>
    fetch('http://localhost:3000/graphql', {
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
        }
      }
    `
      })
    }).then(response => response.json())
})

export default posts