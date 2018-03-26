<template>
  <div class="nav">

    <div class="search-area">
      <input class="search-input" type="text" placeholder="search by title or by tag with #"
        v-model="searchContent"
        v-on:keypress.enter="search()">
    </div>

    <div class='wrapper' v-if="account.logged === false">
      <div class="bar"></div>
      <router-link to="/signin">Log in</router-link>
      or
      <router-link to="/signup">Sign up</router-link>
    </div>

    <div class='wrapper' v-else>
      <router-link to="/new-post">New post</router-link>

      <a href="#" 
        v-on:click="logoff">Disconnect</a>

      <div>Logged as <span>{{ account.username }}</span></div>

      <div class='profile-pic' style="background-image: url('/assets/img/dog.jpg')"></div>
    </div>

  </div>
</template>

<script>

export default {
  props: ['global', 'account'],
  data: () => ({
    searchContent: ''
  }),
  methods: {
    logoff() {
      this.global.logoff()
    },

    search() {
      if (!this.searchContent) {
        this.global.route(`/`)
      }

      else if (this.searchContent.startsWith('#')) {
        const firstTag = this.searchContent.split(' ')[0]
          .replace('#', '')
          .trim()

        this.global.route(`/tag/${firstTag}`)
      }

      else {
        this.global.route(`/search/${this.searchContent}`)
      }
    }
  }
}

</script>

<style>

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
  padding: 1em;
  align-items: center;
  z-index: var(--z-nav);
  font-weight: 900;
  filter: drop-shadow(0 0 2px rgba(20, 20, 20, 0.08));
}

.nav .search-area {
  flex-grow: 1;
  display: flex;
}

.nav .search-area .search-input {
  margin: 0;
  flex-grow: 1;
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