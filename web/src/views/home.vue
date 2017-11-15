<template>
  <div class="home">

    <div class='page-number'>{{ page }}</div>

    <postdisplay :post="post" :global="global" v-for="(post, index) in posts" v-bind:style="'animation-delay: ' + index * 0.15 + 's'"></postdisplay>

    <div class='no-posts' v-if="!posts.length && displayEmptyMessage">
      <h1>This page seems empty</h1>
    </div>

    <div class='page-navigation'>
      <button class="previous" v-on:click="previousPage" v-if="$route.params.page > 1">Previous page</button>
      <button class="next" v-on:click="nextPage" v-if="posts.length">Next page</button>
    </div>

  </div>
</template>

<script>
import postDisplay from './post-display.vue'

export default {
  props: ['global', 'homePagePosts', 'page'],
  components: {
    postdisplay: postDisplay 
  },
  created() {
    this.syncPosts()
  },
  data: () => ({
    posts: [],
    displayEmptyMessage: false
  }),
  watch: { '$route': 'syncPosts' },
  methods: {
    async syncPosts() {
      if (this.$route.params.page <= 0) {
        this.global.api.routes.route('/home/1')
      } else {
        const posts = await this.global.api.posts.getPostsPage(this.$route.params.page)

        this.posts = posts.data.postsPage
        if (!this.posts.length) {
          this.displayEmptyMessage = true
        }
      }
    },

    nextPage() {
      this.global.api.routes.route(`/home/${parseInt(this.$route.params.page) + 1}`)
    },
    previousPage() {
      this.global.api.routes.route(`/home/${parseInt(this.$route.params.page) - 1}`)
    }
  }
}

</script>

<style scoped>

.home .post {
  margin: 1.5em 20vw;

  border-bottom: solid 1px rgba(20, 20, 20, 0.2);
  padding-bottom: 1.5em;
  
}

.home .post:nth-child(-n + 10) {
  animation: fade-in-right cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s forwards;
  opacity: 0;
}

.home .page-navigation {
  display: flex;
  justify-content: center;
  padding-bottom: 1em;
}

.home .page-navigation button, .home .page-navigation .next {
  margin: 1em;
}

.home .no-posts {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}
</style>