<template>

  <div class="comment">
    <pre class="comment-content">{{ content }}</pre>
    <div class='author-wrapper'>
      <time-diff class='date' :before="new Date(creationdate)" :after="now"></time-diff> by
      <a class='author'
        v-on:click="goToProfile()">@{{ author }}</a>
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
import TimeDiff from '../time-diff.vue'

export default {
  name: "comment",
  props: ['content', 'author', 'creationdate', 'commentId', 'global', 'childrenComments', 'currentPostId'],
  components: {
    newcomment: newComment,
    TimeDiff
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
    newCommentWindowShown: false,
    now: Date.now()
  }),
  methods: {
    toggleAnswerWindow() {
      this.newCommentWindowShown = !this.newCommentWindowShown
    },

    goToProfile() {
      this.global.route(`/profile/${this.author}`)
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
  font-size: .8rem;
}

.comment .author-wrapper .author {
  display: flex;
  font-size: 1rem;
  margin-left: .2em
}

.comment .author-wrapper .date {
  margin-right: .2em;
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