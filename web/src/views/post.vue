<template>
  <div class="post">

    <div class='post' v-if="currentPost">
      <h5>{{ currentPost.title }}</h5>
      <div>{{ currentPost.content }}</div>
      <div>
        <div>by {{ currentPost.author }}</div>
      </div>

      <div>
        <a class="tag" v-for="tag in currentPost.tags.split(' ')" href="#">{{ tag }}</a>
      </div>
    </div>

    <div class='post post-not-found' v-else>
      <h5>Post not found</h5>
    </div>

  </div>
</template>

<script>

export default {
  props: ['global', 'currentPost'],
  created() {
    this.checkData()
  },
  watch: { '$route': 'checkData' },
  methods: {
    checkData() {
      // no data could be fetched from memory,
      // need to request the data to the server
      if (this.currentPost === null || String(this.currentPost.id) !== this.$route.params.id) {
        this.global.api.posts.getPost(this.$route.params.id)
          .then(response => {
            this.global.api.posts.setCurrentPost(response.data.post)
          })
      }
    }
  }
}

</script>

<style scoped>
.post .post {
  margin: 1em 20vw;

  border-bottom: solid 1px rgba(20, 20, 20, 0.2);
  padding-bottom: 1em;
}

.post .post div div {
  display: inline-block;
}

.post .post div div {
  margin-right: 1em;
}

.post .post a.tag {
  margin-right: 0.4em;
}
</style>