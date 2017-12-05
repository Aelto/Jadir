<template>
  <div class="signup">

    <div class="card">
      <h1>Sign up</h1>

      <div class="informations" v-if="informationMessage.length > 0">
        {{ informationMessage }}
      </div>

      <p>
        <input type='text' placeholder="login"
          v-model="login">
        <input type='password' placeholder="password"
          v-model="password">
        <input type='password'placeholder="confirm password"
          v-model="passwordConfirm">
        <button
          v-on:click="submitSignup">Submit</button>
      </p>

      <router-link to='/signin'>already got an account?</router-link>
    </div>

  </div>
</template>

<script>

export default {
  props: ['global'],
  data: () => ({
    login: '',
    password: '',
    passwordConfirm: '',
    informationMessage: ''
  }),
  methods: {
    submitSignup() {
      if (this.password !== this.passwordConfirm) {
        return this.informationMessage = "The entered passwords do not match"
      }

      this.global.api.auth.signup(this.login, this.password)
      .then(success => {
        if (success) this.global.api.routes.route('/signup/done')
        else this.informationMessage = "This username is already used"
      }, err => {
        this.informationMessage = err
      })
      .catch(err => {
        this.informationMessage = err
      })
    }
  }
}

</script>

<style scoped>

.signup {
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

.informations {
  padding: .8em;
  background: rgba(200, 200, 200, 0.15);
  border-radius: 3px;
  margin: 1rem;
}

</style>