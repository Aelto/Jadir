<template>
  <div class='nav'>

    <router-link to="/home/1">Home</router-link>

    <div class='wrapper' v-if="account.logged === false">
      <router-link to="/signin">Sign in</router-link>
      <router-link to="/signup">Sign up</router-link>
    </div>

    <div class='wrapper' v-else>
      <router-link to="/new-post">New post</router-link>
      <div>Logged as <span>{{ account.username }}</span></div>

      <div class='profile-pic' style="background-image: url('/assets/img/dog.jpg')"></div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['global', 'account']
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

.nav a, .nav div {
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
  justify-content: flex-end;
  align-items: center;
}

.nav .profile-pic {
  background-size: cover;
  background-position: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-left: 1em;
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.2);
  cursor: pointer;
}
</style>