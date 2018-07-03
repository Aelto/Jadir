<template>
  <div class="menu">

    <div class="jadir">jadir<span>{{ this.$route.path }}</span></div>

    <router-link to="/explore/1" class='option home'>Home</router-link>

    <router-link class="option"
      :to="myPostsUrl">My posts</router-link>

    <router-link to="/features" class="option">Features</router-link>

  </div>
</template>

<script>

export default {
  props: ['global', 'account'],
  computed: {
    myPostsUrl() {
      return `/posts/${this.account.username}`
    }
  },
  methods: {}
}

</script>

<style scoped>

.menu {
  min-width: 200px;
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);

  display: flex;
  flex-direction: column;
  /* padding-top: 6em; */

  z-index: var(--z-menu);
  background: white;
}

.menu .option {
  display: flex;
  padding: .5em;
  font-size: 1.2em;
  cursor: pointer;
}

.menu .option .filler {
  flex-grow: 1;
}

.menu .option:hover {
  background: whitesmoke;
}

.jadir {
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  padding: .5em;
}

.jadir span {
  font-size: 30%;
}

</style>