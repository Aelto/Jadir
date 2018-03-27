<template>
  <div class="menu">

    <div class="jadir">jadir</div>

    <router-link to="/explore/1" class='option home'>Home</router-link>
    <router-link to="/explore/1" class='option'>My posts</router-link>

  </div>
</template>

<script>

export default {
  props: ['global'],
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
  padding: .5em;
  font-size: 1.2em;
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

</style>