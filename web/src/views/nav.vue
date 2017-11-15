<template>
  <div class='nav'>

    <router-link to="/home/1" class='home'>Jadir</router-link>

    <div class='wrapper' v-if="account.logged === false">
      <div class="bar"></div>
      <router-link to="/signin">Log in</router-link>
      or
      <router-link to="/signup">Sign up</router-link>
    </div>

    

    <div class='wrapper' v-else>
      <div class="bar"></div>
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

@keyframes grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.nav {
  display: flex;
  flex-direction: row;
  box-shadow: 0 0 6px rgba(20, 20, 20, 0.2);
  padding: 1em;
  align-items: center;
  z-index: var(--z-nav);
  font-weight: 900
}

.nav a {
  /* color: currentColor; */
}

.nav .home {
  font-weight: bold;
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

.nav .wrapper .bar {
  flex-grow: 1;
  height: 3px;
  background: currentColor;
  opacity: 0.8;
  padding: 0;
  /* transform-origin: right; */
  margin: 0 5vw;
  animation: grow cubic-bezier(0.86, 0, 0.07, 1) 0.9s forwards;
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