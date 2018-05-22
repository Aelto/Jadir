<template>
  <div class="explore">
    
    <postdisplay 
      v-for="(post, index) in posts"
      :post="post"
      :global="global"
      :key="index"
      v-bind:style="'animation-delay: ' + index * 0.05 + 's'"></postdisplay>

    <div class='no-posts' v-if="!posts.length && displayEmptyMessage">
      <h1>This page seems empty</h1>
    </div>

    <div class='page-navigation'>
      <button class="previous" v-on:click="previousPage" v-if="$route.params.page > 1">Previous page</button>

      <div class="current-page">{{ $route.params.page }}</div>

      <button class="next" v-on:click="nextPage" v-if="posts.length >= 20">Next page</button>
    </div>

  </div>
</template>


<script>
import { endpoints } from 'Shared/endpoints.ts'
import PostDisplay from './posts/post-display.vue'

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
    this.global.ws.onAnswer(endpoints.getPagePosts, e => {
      if (e.message.posts)
        this.posts = e.message.posts

      if (!this.posts.length)
        this.displayEmptyMessage = true
    })

    this.global.ws.onAnswer(endpoints.getPagePostsSearch, e => {
      this.posts = e.message.posts

      if (!this.posts.length)
        this.displayEmptyMessage = true
    })

    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {

      if (this.$route.name === 'explore') {
        this.syncPosts()
      }

      else if (this.$route.name === 'tag') {
        this.syncTagSearch()
      }

      else {
        this.syncSearch()
      }
    },
    
    syncPosts() {
      this.posts = []
      this.global.api.posts.getPagePosts(this.global.ws, this.$route.params.page - 1)
    },

    syncTagSearch() {
      this.posts = []
      this.global.search(`#${this.$route.params.tag}`)
    },

    syncSearch() {
      this.posts = []
      this.global.search(this.$route.params.search)
    },

    nextPage() {
      this.global.route(`/explore/${parseInt(this.$route.params.page) + 1}`)
    },
    previousPage() {
      this.global.route(`/explore/${parseInt(this.$route.params.page) - 1}`)
    }
  }
}

</script>

<style scoped>

.post {
  animation: fade-in-right cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s forwards;
  opacity: 0;
}
.page-navigation {
  display: flex;
  justify-content: center;
  padding-bottom: 1em;
  align-items: center;
}
.page-navigation button, .page-navigation .next {
  margin: 1em;
}
.no-posts {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  animation-name: messagePop;
  animation-duration: .25s;
  animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1)
}
@keyframes messagePop {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

</style>