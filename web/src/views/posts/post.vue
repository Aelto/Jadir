<template>
  <div class="post no-padding">

    <img alt=""
      v-bind:src="currentPost.image_url"
      v-if="currentPost.image_url">

    <div class="post-view">
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

      <div class='post-not-found' v-if="!currentPost && displayEmptyMessage">
        <h5>Post not found</h5>
      </div>

      <div class="comments-wrapper">
        <comment v-for="comment in comments" 
          :key="comment.id"
          :author="comment.author"
          :content="comment.content" 
          :creationdate="comment.creation_date"></comment>
      </div>
    </div>

  </div>
</template>

<script>
import postInfo from './post-info.vue'
import Comment from '../comments/comment.vue'
import { endpoints } from 'Shared/endpoints.ts'

export default {
  props: ['global', 'currentPost', 'account'],
  components: {
    postinfo: postInfo,
    comment: Comment
  },
  created() {
    setTimeout(function() {
      this.displayEmptyMessage = true
    }, 500)

    this.global.ws.onAnswer(endpoints.getPostComments, data => {
      console.log(data)

      this.comments = data.message.comments
    })

    this.fetchComments()
  },
  data: () => ({
    comments: [],
    displayEmptyMessage: false,
    newCommentContent: ''
  }),
  methods: {
    fetchComments() {
      if (this.currentPost === null)
        return

      this.global.api.comments.getPostComments(this.global.ws, this.currentPost.id)
    },

    upvotePost() {
      this.global.api.posts.votePost(this.global.ws, this.currentPost.id, true)
    },

    downvotePost() {
      this.global.api.posts.votePost(this.global.ws, this.currentPost.id, false)
    }
  }
}

</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;

  border-radius: 3px;
  background: white;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);

  border-bottom: solid 1px rgba(20, 20, 20, 0.2);
  padding-bottom: 1.5em;
  flex-grow: 1;
}

.post-view {
  padding: 1em;
}

img {
  max-width: 100%;
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