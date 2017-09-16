<template>
  <div class="signin">

    <div class="card">
      <h1>Sign in</h1>

      <p>
        <input type='text' placeholder="login"
          v-model="login">
        <input type='password' placeholder="password"
          v-model="password">
        <button
          v-on:click="authenticate">Login</button>
      </p>

      <router-link to='/signup'>need an account?</router-link>
    </div>

  </div>
</template>

<script>

export default {
  props: ['global'],
  data: () => ({
    login: 'Aeltoth',
    password: 'password'
  }),
  methods: {
    authenticate() {
      this.global.api.auth.authenticate(this.login, this.password)
      .then(() => this.global.api.routes.route('/home/1'))
    }
  }
}

</script>

<style scoped>

.signin {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card {
  margin: 0 auto;
  padding: 1em;
  box-shadow: 0 0 6px rgba(20, 20, 20, 0.2);
  background: white;
}

</style>