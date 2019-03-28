<template>
  <nav>
    <h1>Jadir</h1>
    
    <div class="controls" v-if="isLogged">
      <button v-on:click="signout">sign-out</button>
    </div>
    
    <div class="controls" v-else>
      <router-link to="/account/signin" class="signin">sign in</router-link>
      <router-link to="/account/signup" class="signup">sign up</router-link>
    </div>
  </nav>  
</template>

<script>
export default {
  computed: {
    isLogged () {
      return this.$store.state.account.login && this.$store.state.account.token;
    }
  },
  methods: {
    signout() {
      this.$store.dispatch('signout');
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  background: #f3f4f5;
  box-shadow: 0 1px 6px rgba(20, 20, 20, .1);
  border-bottom: solid 1px #E1E1E1;
}

.controls {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
}

.controls a + a {
  margin-left: 1em;
}
</style>
