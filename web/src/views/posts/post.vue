<template>
  <div class="post no-padding"
    v-if="currentPost !== null">

    <img alt=""
      v-bind:src="currentPost.image_url"
      v-if="currentPost.image_url"
      v-on:click="toggleFullImageView">

    <div class="post-view">
      <div class='post-content' v-if="currentPost">
        <h5>{{ currentPost.title }}</h5>

        <postinfo :author="currentPost.author" :score="currentPost.score" :tags="currentPost.tags" :date="currentPost.date" :global="global">
        </postinfo>

        <div class="post-description" ref="postcontent"></div>

        <div class="upvote-wrapper" v-if="account.logged">
          <button class="up default link-style" v-on:click="upvotePost"
            v-bind:class="{ active: postVote !== null && postVote }">upvote</button>
          <button class="down default link-style" v-on:click="downvotePost"
            v-bind:class="{ active: postVote !== null && !postVote }">downvote</button>
        </div>
      </div>

      <newcomment v-if="account.logged" :current-post-id="currentPost.id" :global="global" :account="account" :attached-comment:="null">
      </newcomment>

      <div class='post-not-found' v-if="!currentPost && displayEmptyMessage">
        <h5>Post not found</h5>
      </div>

      <div class="comments-wrapper">
        <comment v-for="comment in comments" 
          :key="comment.id"
          :author="comment.author"
          :content="comment.content" 
          :creationdate="comment.creation_date"
          :global="global"
          :current-post-id="currentPost.id"
          :children-comments="comment.children_comments"
          :comment-id="comment.id"></comment>
      </div>
    </div>

  </div>
</template>

<script>
import postInfo from './post-info.vue'
import Comment from '../comments/comment.vue'
import { endpoints } from 'Shared/endpoints.ts'
import newComment from '../comments/new-comment.vue'

export default {
  props: ['global', 'currentPost', 'account'],
  components: {
    postinfo: postInfo,
    comment: Comment,
    newcomment: newComment
  },
  data: () => ({
    comments: [],
    displayEmptyMessage: false,
    newCommentContent: '',
    displayFullImage: false,
    postVote: false,
    md: window.markdownit()
  }),
  watch: {
    'currentPost': 'setPostContent'
  },
  created() {
    setTimeout(function() {
      this.displayEmptyMessage = true
    }, 500)

    this.global.ws.onAnswer(endpoints.getPost, data => {
      this.global.route(`/post/${data.message.post.id}`)
      this.global.setCurrentPost(data.message.post)
      this.updatePostVote()
    })

    this.global.ws.onAnswer(endpoints.getPostComments, data => {
      this.comments = data.message.comments
    })

    this.global.ws.onAnswer(endpoints.votePost, data => {
      this.global.setCurrentPostScore(data.message.score)
      this.updatePostVote()
    })

    this.global.ws.onAnswer(endpoints.createPostComment, data => {
      data.message.author = this.account.username
      if (data.message.answers_comment === null) {
        this.comments.push(data.message)
      }

      else {
        this.appendCommentToComment(data.message)
      }
    })

    this.global.api.posts.getPost(this.global.ws, this.$route.params.id)
    this.fetchComments()
  },
  methods: {
    fetchComments() {
      this.global.api.comments.getPostComments(this.global.ws, this.$route.params.id)
    },

    upvotePost() {
      this.global.api.posts.votePost(this.global.ws, this.currentPost.id, true)
    },

    downvotePost() {
      this.global.api.posts.votePost(this.global.ws, this.currentPost.id, false)
    },

    appendCommentToComment(comment, comments = this.comments) {
      for (const subComment of comments) {
        
        if (subComment.id === comment.answers_comment) {

          if (subComment.children_comments) {
            subComment.children_comments.push(comment)
          }
          else subComment.children_comments = [comment]

          return true
        }

        else if (subComment.children_comments) {
          if (this.appendCommentToComment(comment, subComment.children_comments))
            return true
        }

      }

      return false
    },
    
    toggleFullImageView() {
      this.displayFullImage = !this.displayFullImage
    },

    updatePostVote() {
      this.global.api.posts.getPostUserVote(this.global.ws, this.$route.params.id)
      .then(res => {
        if (res.message.post_vote === null) {
          this.postVote = null
        }
        else this.postVote = res.message.post_vote.is_upvote
      })
    },

    setPostContent() {
      if (!this.$refs.postcontent) // TODO: Find an other way to delay the content parsing
        return setTimeout(() => this.setPostContent(), 25)

      this.$refs.postcontent.innerHTML = this.md.render(this.currentPost.content)
    }
  }
}

</script>

<style scoped>
.post {
  position: relative;
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

.post-view .post-description {
  font-family: 'Encode Sans';
  margin: 0;

  white-space: pre-wrap;
  word-wrap: break-word;
}

img {
  max-width: 100%;
  margin: auto;
}

img.full-view-image {
    box-shadow: 0 -100px 40px 40px rgba(20, 20, 20, 0.3);
    background: white;
    transition: 0.5s margin;  
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

.upvote-wrapper {
  display: flex;
  /* justify-content: space-around; */
  padding: 1em;
}

.upvote-wrapper button {
  cursor: pointer;
  background: none;
  outline: none;
  border: 0;
  text-decoration: none;
}

.upvote-wrapper button:hover {
  text-decoration: underline;
}

.upvote-wrapper button.active {
  font-weight: bold;
}
</style>