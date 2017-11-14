<template>
  <div class="home">

    <div class='page-number'>{{ page }}</div>

    <div class='post' v-for="(post, index) in posts" v-bind:style="'animation-delay: ' + index * 0.15 + 's'">
      <h5 v-on:click="readPost(post.id)">{{ post.title }}</h5>
      
      <div class='tags'>
        <a class="tag" v-for="tag in post.tags.split(' ')" href="#">{{ tag }}</a>
      </div>

      <div class='author-wrapper'>
        <div class='profile-pic' style="background-image: url('/assets/img/dog.jpg')"
          v-bind:style="`animation-delay: ${index * 0.15}s`"></div>
        <div class="col">
          <a class='author' href='#'>@{{ post.author }}</a>
          <div class="comments">{{ Math.floor(Math.random() * 360) }} comments</div>
        </div>
      </div>
    </div>

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

export default {
  props: ['global', 'homePagePosts', 'page'],
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
    async readPost(id) {
      this.global.api.posts.viewPost((await this.global.api.posts.getPost(id)).data.post)
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

.home .post h5 {
  display: inline-block;
  cursor: pointer;
  margin-bottom: 0em;
}

.home .post h5:hover {
  text-decoration: underline;
}

.home .post a.tag {
  margin-right: 0.4em;
}

.home .post .author-wrapper {
  display: flex;
  align-items: center;
  margin-top: 1em;
}

.home .post .author {
  display: flex;
}

.home .post .profile-pic {
  background-size: cover;
  background-position: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.3);
  cursor: pointer;
  margin-right: 1em;
}

.home .post:nth-child(-n + 10) .profile-pic {
  animation: pop cubic-bezier(0.6, 0.2, 0.45, 1.2) 0.3s forwards;
  transform: scale(0);
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