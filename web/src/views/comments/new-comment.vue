<template>
  <div class="new-comment">

    <textarea name="newcomment" id="" cols="60" rows="20" ref="newcomment"
      v-model="newCommentContent">

    </textarea>
    <button v-on:click="submitComment">Submit</button>

  </div>
</template>

<script>
import { endpoints } from 'Shared/endpoints.ts'

export default {
  props: ['global', 'currentPostId', 'account', 'attachedComment'],
  created() {
    setTimeout(() => {
      this.$refs.newcomment.focus()
    }, 25)
  },
  data: () => ({
    newCommentContent: ''
  }),
  methods: {
    submitComment() {
      if (!this.newCommentContent.trim().length) {
        return
      }

      this.global.api.comments.createPostComment(
        this.global.ws, 
        this.currentPostId,
        this.attachedComment,
        this.newCommentContent)

      this.newCommentContent = ''

      this.$emit('toggle')
    }
  }
}

</script>

<style scoped>
.new-comment {
  padding-bottom: 1em;
}

textarea {
  width: 100%;
  min-height: 150px;
  display: block;
}
</style>