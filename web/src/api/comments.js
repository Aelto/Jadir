export default (router, data) => ({
  newComment: (postId, answersComment, authorName, _content) => {
    return fetch('http://localhost:3000/graphql', {
      method: 'post',
      headers: { 'Content-Type': 'application/json', 'x-access-token': data.account.token },
      body: JSON.stringify({
        query: `
          query NewComment($postId: Int!, $answersComment: Int, $authorName: String!, $_content: String!) {
            newComment(post_id: $postId, answers_comment: $answersComment, author_name: $authorName, content: $_content) {
              id
              content
              author_id
              answers_comment
              post_id
              creation_date
              author
            }
          }
        `,
        variables: { postId, answersComment, authorName, _content }
      })
    }).then(response => response.json())
  }
})
