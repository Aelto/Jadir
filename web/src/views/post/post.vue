<template>
  <div class="post">

    <div class='post-content' v-if="currentPost">
      <h5>{{ currentPost.title }}</h5>

      <postinfo :author="currentPost.author" :score="currentPost.score" :tags="currentPost.tags">
      </postinfo>

      <div>{{ currentPost.content }}</div>

      <div class="score" v-if="account.logged">
        <button class="up" v-on:click="upvotePost">upvote</button>
        <button class="down" v-on:click="downvotePost">downvote</button>
      </div>
    </div>

    <div class="answer-wrapper" v-if="account.logged">
      <textarea name="" id="" cols="30" rows="10" v-model="newCommentContent" placeholder="Write a wonderful a comment..."></textarea>
      <div class="char-limit">{{ newCommentContent.length }} / 1024</div>

      <button v-on:click="newComment()" :class="{ disabled: newCommentContent.length > 1024 }">Send</button>
    </div>

    <div class="comments-wrapper">
      <comment v-for="comment in comments" 
        :key="comment.id"
        :author="comment.author"
        :content="comment.content" 
        :creationdate="comment.creation_date"></comment>
    </div>

    <div class='post post-not-found' v-if="!currentPost && displayEmptyMessage">
      <h5>Post not found</h5>
    </div>

  </div>
</template>

<script>
import postInfo from './post-info.vue'
import Comment from '../comment/comment.vue'

export default {
  props: ['global', 'currentPost', 'account'],
  components: {
    postinfo: postInfo,
    comment: Comment
  },
  created() {
    this.checkData()
      .then(() => this.global.api.posts.getPostComments(this.currentPost.id))
      .then(data => {
        this.comments = data.data.postComments
      })

    setTimeout(function() {
      this.displayEmptyMessage = true
    }, 500);
  },
  data: () => ({
    comments: [],
    displayEmptyMessage: false,
    newCommentContent: ''
  }),
  watch: { '$route': 'checkData' },
  methods: {
    checkData() {
      // no data could be fetched from memory,
      // need to request the data to the server
      if (this.currentPost === null || String(this.currentPost.id) !== this.$route.params.id) {
        return this.global.api.posts.getPost(this.$route.params.id)
        .then(response => this.global.api.posts.setCurrentPost(response.data.post))
      }

      return Promise.resolve()
    },

    newComment(answers_comment = null) {
      if (!this.account.logged || !this.account.username)
        return

      this.global.api.comments.newComment(this.currentPost.id, answers_comment, this.account.username, this.newCommentContent.slice(0, 1024))
      .then(r => {
        console.log('TODO: creation_date_ago not done on newly created comments')
        this.comments.push(r.data.newComment)
      })
      .then(() => this.newCommentContent = '')
    },

    upvotePost() {
      if (!this.account.logged || !this.account.username)
        return

      this.global.api.posts.votePost(this.currentPost.id, true, this.account.username)
      .then(success => {
        this.currentPost.score = success.data.votePost
      }, failure => console.log('failure: ', failure))
    },

    downvotePost() {
      if (!this.account.logged || !this.account.username)
        return

      this.global.api.posts.votePost(this.currentPost.id, false, this.account.username)
      .then(success => {
        this.currentPost.score = success.data.votePost
      }, failure => console.log('failure: ', failure))
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

.post .post-content h5 {
  margin-bottom: 0;
}

.post .post-content a.tag {
  margin-right: 0.4em;
}

/**
 * Answer input wrapper
 **/
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

.post .comments-wrapper {
  display: flex;
  flex-direction: column-reverse;
}
</style>