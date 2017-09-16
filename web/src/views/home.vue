<template>
  <div class="home">

    <div class='page-number'>{{ page }}</div>

    <div class='post' v-for="post in posts">
      <h5 v-on:click="readPost(post.id)">{{ post.title }}</h5>
      <div>
        <div>by {{ post.author }}</div>
        <!-- <div>{{ Math.floor(Math.random() * 360) }} comments </div> -->
      </div>

      <div>
        <a class="tag" v-for="tag in post.tags.split(' ')" href="#">{{ tag }}</a>
      </div>
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
    posts: []
  }),
  watch: { '$route': 'syncPosts' },
  methods: {
    async syncPosts() {
      if (this.$route.params.page <= 0) {
        this.global.api.routes.route('/home/1')
      } else {
        const posts = await this.global.api.posts.getPostsPage(0)

        for (const post of posts.data.postsPage) this.posts.push(post)
      }
    },
    async readPost(id) {
      this.global.api.posts.viewPost((await this.global.api.posts.getPost(id)).data.post)
    }
  }
}

</script>

<style scoped>
.home .post {
  margin: 1em 20vw;

  border-bottom: solid 1px rgba(20, 20, 20, 0.2);
  padding-bottom: 1em;
}

.home .post h5 {
  display: inline-block;
  cursor: pointer;
}

.home .post h5:hover {
  text-decoration: underline;
}

.home .post div div {
  display: inline-block;
}

.home .post div div {
  margin-right: 1em;
}

.home .post a.tag {
  margin-right: 0.4em;
}
</style>