<template>

  <div class="comment">
    <pre class="comment-content">{{ content }}</pre>
    <div class='author-wrapper'>
      <div class="date">{{ creation_date_ago }} by</div>
      <a class='author' href='#'>@{{ author }}</a>
    </div>

    <button class='default link-style answer-button'
      v-if="newCommentWindowShown"
      v-on:click="toggleAnswerWindow">cancel</button>
    <button class="default link-style answer-button"
      v-else
      v-on:click="toggleAnswerWindow">
      answer
    </button>

    <newcomment
      v-if="newCommentWindowShown"
      :current-post-id="currentPostId" :global="global" :account="account" :attached-comment="commentId"
      v-on:toggle="toggleAnswerWindow">

    </newcomment>

    <comment
      v-if="childrenComments.length"
      v-for="subComment in childrenComments"
      :key="subComment.id"
      :author="subComment.author"
      :content="subComment.content" 
      :creationdate="subComment.creation_date"
      :global="global"
      :current-post-id="currentPostId"
      :children-comments="subComment.children_comments"
      :comment-id="subComment.id">
    </comment>

  </div>

</template>

<script>
import newComment from './new-comment.vue'

export default {
  name: "comment",
  props: ['content', 'author', 'creationdate', 'commentId', 'global', 'childrenComments', 'currentPostId'],
  components: {
    newcomment: newComment
  },
  computed: {
    creation_date_ago() {
      const diff = Date.now() - new Date(this.creationdate)
      const hours = Math.ceil(diff / (1000 * 3600))
      if (hours >= 24) {
        return Math.floor(hours / 24) + ' days ago'
      } else {
        return hours + ' hours ago'
      }
    }
  },
  data: () => ({
    newCommentWindowShown: false
  }),
  methods: {
    toggleAnswerWindow() {
      this.newCommentWindowShown = !this.newCommentWindowShown
    }
  }
}
</script>

<style scoped>
.comment {
  padding: 1em 0;
  animation-name: commentAppear;
  animation-duration: 1s;
  animation-iteration-count: 1;
  transform-origin: top center;
}

.comment .comment-content {
  font-family: 'Encode Sans';
  margin: 0;

  white-space: pre-wrap;
  word-wrap: break-word;
}

.comment .author-wrapper {
  display: flex;
  align-items: center;
}

.comment .author-wrapper .author {
  display: flex;
}

.comment .author-wrapper .date {
  font-size: .8em;
  padding-right: .2em;
}

button.answer-button {
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
}
button.answer-button:hover {
  text-decoration: underline;
}

.comment .comment {
  padding-left: 1em;
  border-left: solid 1px rgba(145, 145, 145, 0.1);
  padding-bottom: 0;
}

@keyframes commentAppear {
  from {
    transform: scaleY(0)
  }

  to {
    transform: scaleY(1)
  }
}
</style>