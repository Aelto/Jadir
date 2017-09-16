<template>
  <div class="app flex col-reverse">

    <comp-nav :global='global' :account='account'></comp-nav>

    <router-view :global='global' :account='account' :current-post="currentPost"></router-view>
  </div>
</template>

<script>
import nav from './nav.vue'
import home from './home.vue'

export default {
  props: ['global', 'account', 'currentPost'],
  components: {
    'comp-nav': nav,
    'comp-home': home
  },
}

</script>

<style>

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app .nav + div {
  flex-grow: 1;
  background: rgb(245, 245, 245);

  z-index: var(--z-content);
  padding-top: 5em;
}

</style>