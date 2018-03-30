<template>
  <div class="signup no-background">

    <div class="card">
      <h1>Sign up</h1>

      <div class="informations" v-if="informationMessage.length > 0">
        {{ informationMessage }}
      </div>

      <p>
        <input type='text' placeholder="login" ref="logininput"
          v-model="login">
        <input type='password' placeholder="password"
          v-model="password">
        <input type='password' placeholder="confirm password"
          v-model="passwordConfirm"
          v-on:keypress.enter="submitSignup">
        <button
          v-on:click="submitSignup">Submit</button>
      </p>

      <router-link to='/signin'>already got an account?</router-link>
    </div>

  </div>
</template>

<script>
import { endpoints } from 'Shared/endpoints.ts'

export default {
  props: ['global'],
  data: () => ({
    login: '',
    password: '',
    passwordConfirm: '',
    informationMessage: ''
  }),
  created() {
    setTimeout(() => this.$refs.logininput.focus(), 100)
    
    this.global.ws.onAnswer(endpoints.signup, data => {
      if (data.message.success) {
        this.global.route('/signin')
      }

      else {
        if (data.message.message === 'user-already-exists') {
          this.informationMessage = 'The user already exists'
        }
      }
    })
  },
  methods: {
    submitSignup() {
      if (!this.password || !this.passwordConfirm || !this.login) {
        this.showInformation('You must enter a username and a password')
      }

      else if (this.password !== this.passwordConfirm) {
        this.showInformation('The entered passwords do not match')
      }
      
      else if (this.login.length && this.password.length) {
        this.global.api.account.signup(this.global.ws, this.login, this.password)
      }
    },

    showInformation(str) {
      this.informationMessage = ''
      setTimeout(() => {
        this.informationMessage = str
      }, 100)
    }
  }
}
</script>

<style scoped>
.signup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
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