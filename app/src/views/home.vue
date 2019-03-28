<template>
  <div class="home">
    <Nav />
    <div class="content">

      <div class="post"
        v-for="post of $store.state.posts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <div class="description">
          by <span>{{ post.author }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Nav from '../components/nav.vue'

export default {
  created() {
    this.$store.dispatch('loadRecentPosts', { page: 0 });

    console.log(this.$store);
  },
  components: { Nav }
}
</script>


<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  .post {

  }
}
</style>
