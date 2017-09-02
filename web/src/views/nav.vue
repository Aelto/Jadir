<template>
  
  <div class='nav'>

    <router-link to="/home">Home</router-link>

    <div class='wrapper'>

    <router-link to="/signin">Sign in</router-link>
    <router-link to="/signup">Sign up</router-link>

    </div>

  </div>

</template>

<script>
export default {
  props: ['global']
}

</script>

<style scoped>


.nav {
  display: flex;
  flex-direction: row;
  box-shadow: 0 0 6px rgba(20, 20, 20, 0.2);
  padding: 1em;
  align-items: center;
  z-index: var(--z-nav);
}

.nav a {
  padding: 0.3em;
  text-decoration: none;
}

.nav a:hover {
  text-decoration: underline;
}

.nav .wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end
}


</style>