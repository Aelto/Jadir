<template>
  <div class="home">
    <div class="content">

      <div class="posts">
        <PostDisplay
          v-for="(post, index) of this.$store.state.posts" 
          :title="post.title"
          :id="post.id"
          :author="post.author"
          :score="post.score"
          :tags="post.tags"
          :date="post.date"
          :image_url="post.image_url"
          :key="post.id"
          :style="'animation-delay: ' + index * 0.05 + 's'"></PostDisplay>
      </div>

    </div>
  </div>
</template>

<script>
import PostDisplay from '../components/posts/post-display.vue';

export default {
  created() {
    this.$store.dispatch('loadRecentPosts', { page: 0 });
  },
  components: { PostDisplay }
}
</script>


<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2em;
}
</style>
