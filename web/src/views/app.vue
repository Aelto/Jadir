<template>
  <div class="app flex col-reverse">

    <img src="/assets/img/adrian-infernus.jpg" alt="" class="background-img">

    <comp-menu :global="global"></comp-menu>

    <div class="content background">
      <comp-nav :global='global' :account="account"></comp-nav>
      <router-view class='content-view' :global='global' :account="account" :current-post="currentPost"></router-view>
    </div>

  </div>
</template>

<script>
import nav from './nav.vue'
import explore from './explore.vue'
import menu from './menu.vue'

export default {
  props: ['global', 'currentPost', 'account'],
  components: {
    'comp-nav': nav,
    'comp-explore': explore,
    'comp-menu': menu
  },
}

</script>

<style>

.app {
  position: relative;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}

.app .content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: whitesmoke;
  padding: 0 3em;
}

.app .background-img {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  opacity: .1;
}

.app .content .content-view {
  flex-grow: 1;
  border-radius: 3px;
  
  z-index: var(--z-content-view);
}

.app .content .content-view:not(.no-background) {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);
}

.app .content .content-view:not(.no-padding) {
  padding: 1em;
}

</style>