<template>
  <div class="home">
    <Nav />
    <Menu class="menu" />
    <div class="content">
      <PostLister :posts="$store.state.posts" class="post-lister" />

      <div class="column">

        <div class="your-home">
          <h2>Your home</h2>
          <ul>
            <li>#all <a href="">🗑</a></li>
            <li>#first-post <a href="">🗑</a></li>
          </ul>

          <input type="text" class="small">
          <button class="small">add</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Nav from '../components/nav.vue'
import Menu from '../components/menu.vue'
import PostLister from '../components/post-lister.vue'

export default {
  created() {
    this.$store.dispatch('loadRecentPosts', { page: 0 });
  },
  components: { Nav, PostLister, Menu }
}
</script>


<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;

  .post-lister {
    flex-direction: column;
    flex-grow: 1;
  }

  .column {
    .your-home {
      padding: 1em;
      // box-shadow: 0 3px 6px var(--light-grey);
      // background: var(--light-grey);
      // border: solid 1px var(--black-text);
    }
  }
}
</style>
