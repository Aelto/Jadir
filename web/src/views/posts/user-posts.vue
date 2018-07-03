<template>
  <div class="user-posts">
    
    <postdisplay 
      v-for="(post, index) in posts"
      :post="post"
      :global="global"
      :key="index"
      v-bind:style="'animation-delay: ' + index * 0.05 + 's'"></postdisplay>

    <div class='no-posts' v-if="!posts.length && displayEmptyMessage">
      <h1>This page seems empty</h1>
    </div>

  </div>
</template>

<script>
import { endpoints } from 'Shared/endpoints.ts'
import PostDisplay from './post-display.vue'

export default {
  props: ['global'],
  components: {
    postdisplay: PostDisplay
  },
  watch: {
    '$route': 'syncPosts'
  },
  data: () => ({
    posts: [],
    displayEmptyMessage: false
  }),
  created() {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      if (!this.$route.params.user)
        return

      this.global.ws.onAnswer(endpoints.getUserPosts, e => {
        if (e.message.posts)
          this.posts = e.message.posts

        if (!this.posts.length)
          this.displayEmptyMessage = true
      })

      this.global.api.posts.getUserPosts(this.global.ws, this.$route.params.user)
    },
  }
}

</script>

<style scoped>



</style>