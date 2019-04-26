<template>
  <div class="post-lister">

  <Post class="post" v-for="(post, index) of posts" :key="post.id"
    :date="post.date"
    :score="post.score"
    :author="post.score"
    :tags="post.tags"
    :image_url="post.image_url"
    :title="post.title"
    :id="post.id"
    :index="index" />

  </div>
</template>

<script>
import Post from './post.vue'

export default {
  components: {
    Post
  },
  props: ['posts']
}
</script>

<style lang="scss" scoped>
.post-lister {
  display: flex;
  padding: 1em;

  .post {

    & + .post {
      margin-top: 2em;
    }
  }
}
</style>
