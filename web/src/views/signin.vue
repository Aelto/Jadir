<template>
  <div class="signin no-background">

    <div class="card">
      <h1>Sign in</h1>

      <div class="informations" v-if="informationMessage.length">
        {{ informationMessage }}
      </div>

      <p>
        <input type='text' ref="logininput" placeholder="login"
          v-model="login">
        <input type='password' placeholder="password"
          v-model="password"
          v-on:keypress.enter="authenticate">
        <button
          v-on:click="authenticate">Login</button>
      </p>

      <router-link to='/signup'>need an account?</router-link>
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
    informationMessage: ''
  }),
  created() {
    setTimeout(() => this.$refs.logininput.focus(), 100)

    this.global.ws.onAnswer(endpoints.signin, data => {
      console.log(data)

      if (data.state === 200) {
        this.global.setAccountUsername(data.message.login)
        this.global.route('/')

        this.global.setLocalStorageAccount(data.message.login, data.message.token)
      }

      else {

        if (data.state === 404) {
          this.showInformation('Login or password is incorrect')
        }

        else {
          this.showInformation('Something went wrong on our end, please try again')
        }

      }

    })
  },
  methods: {
    authenticate() {
      if (!this.login.length || !this.password.length) {
        return this.showInformation('Please enter a password and a login')
      }

      this.global.api.account.signin(this.global.ws, this.login, this.password)
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

@keyframes messageSlide {
  from {
    transform: translate3d(-5px, 0, 0);

  }
  to {
    transform: translate3d(0px, 0, 0);
  }
}

.signin {
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
  animation-name: messageSlide;
  animation-duration: .5s;
  transform-origin: left;
}
</style>