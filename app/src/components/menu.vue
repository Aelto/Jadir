<template>
  <menu>
    <router-link to='/' active-class="active">explore</router-link>
    <router-link to='/profile'>profile</router-link>
  </menu>  
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
menu {
  z-index: var(--z-menu);
  padding: .6em 1em;

  border-bottom: solid 1px var(--light-grey);

  a {
    text-decoration: underline;
    text-underline-position: under;
    color: var(--green-main);
    font-size: .9em;

    & + a {
      margin-left: 1em;
    }

    &.active {
      font-weight: bold;
    }
  }
}
</style>
