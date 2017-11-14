<template>
  <div class="post">

    <div class='post-content' v-if="currentPost">
      <h5>{{ currentPost.title }}</h5>
      <div>{{ currentPost.content }}</div>
      <div>
        <div>by {{ currentPost.author }}</div>
      </div>

      <div>
        <a class="tag" v-for="tag in currentPost.tags.split(' ')" href="#">{{ tag }}</a>
      </div>
    </div>

    <div class="answer-wrapper" v-if="account.logged">
      <textarea name="" id="" cols="30" rows="10" v-model="newCommentContent"></textarea>

      <button v-on:click="newComment()">Send</button>
    </div>

    <div class="comments-wrapper">

      <div class="comment" v-for="comment in comments">
        <div>{{ comment.content }}</div>
        <div class='author-wrapper'>
          <div class='profile-pic' style="background-image: url('/assets/img/dog.jpg')"></div>
          <div class="col">
            <a class='author' href='#'>@{{ comment.author }}</a>
            <div class="comments">{{ comment.creation_date_ago }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class='post post-not-found' v-if="!currentPost && displayEmptyMessage">
      <h5>Post not found</h5>
    </div>

  </div>
</template>

<script>
export default {
  props: ['global', 'currentPost', 'account'],
  created() {
    this.checkData()
      .then(() => this.global.api.posts.getPostComments(this.currentPost.id))
      .then(data => {
        this.comments = data.data.postComments

        for (let i = 0; i < this.comments.length; i++) {
          const diff = Date.now() - new Date(data.data.postComments[0].creation_date)

          const hours = Math.ceil(diff / (1000 * 3600))

          if (hours >= 24) {
            this.comments[i].creation_date_ago = Math.floor(hours / 24) + ' days ago'
          } else {
            this.comments[i].creation_date_ago = hours + ' hours ago'
          }
        }
        // for (const comment of data.data.postComments)
        // this.comments.push(comment)
      })

    setTimeout(function() {
      this.displayEmptyMessage = true
    }, 500);
  },
  data: () => ({
    comments: [],
    displayEmptyMessage: false,
    newCommentContent: 'Write a wonderful a comment...'
  }),
  watch: { '$route': 'checkData' },
  methods: {
    checkData() {
      // no data could be fetched from memory,
      // need to request the data to the server
      if (this.currentPost === null || String(this.currentPost.id) !== this.$route.params.id) {
        return this.global.api.posts.getPost(this.$route.params.id)
          .then(response => {
            this.global.api.posts.setCurrentPost(response.data.post)
          })
      }

      return Promise.resolve()
    },

    newComment(answers_comment = null) {
      if (!this.account.logged && this.account.username)
        return

      this.global.api.comments.newComment(this.currentPost.id, answers_comment, this.account.username, this.newCommentContent)
      .then(r => this.comments.push(r.data.newComment))
      .then(() => this.newCommentContent = '')
    }
  }
}
</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  padding: 1em 20vw;
}

.post .post-content {
  border-bottom: solid 1px rgba(20, 20, 20, 0.2);
  padding-bottom: 1em;
  margin-bottom: 1em;
}

.post .post-content div div {
  display: inline-block;
}

.post .post-content div div {
  margin-right: 1em;
}

.post .post-content a.tag {
  margin-right: 0.4em;
}


.post .answer-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 1em;
}

.post .answer-wrapper textarea {
  width: 90%;
  max-width: 90%;
  min-width: 45%;
  min-height: 150px;
}

.post .comments-wrapper {}

.post .comments-wrapper .comment {
  margin-bottom: 1em;
  box-shadow: -7px 0 6px -10px;
  padding: 1em 0.5em;
  box-shadow: -6px 0 8px -6px rgba(20, 20, 20, 0.2), 0 0 1px 0 rgba(20, 20, 20, 0.1);
  background: white;
  animation: fade-in-right cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s forwards;
}

.post .comments-wrapper .comment .author-wrapper {
  display: flex;
  align-items: center;
}

.post .comments-wrapper .comment .author-wrapper .author {
  display: flex;
}

.post .comments-wrapper .comment .author-wrapper .profile-pic {
  background-size: cover;
  background-position: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.3);
  cursor: pointer;
  margin-right: 1em;
  animation: pop cubic-bezier(0.6, 0.2, 0.45, 1.2) 0.3s forwards;
}
</style>