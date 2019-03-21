<template>
  <div class="signin">

    <div class="content">
      <h1>Sign in</h1>

      <div id="form">
        <div class="error"
          v-for="error in errors" :key="error">{{ error }}</div>

        <label for="username">Username</label>
        <input type="text" id="username" v-model="username"
          v-on:load="e => e.focus()">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password"
          v-on:keypress.enter="submit">

        <button v-on:click="submit">sign in</button>
        <span>Need an account? <router-link to="signup">Sign up!</router-link> or <router-link to="/">cancel</router-link></span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data: () => ({
    username: '',
    password: '',
    errors: [],
  }),
  methods: {
    checkForm() {
      this.errors = [];

      if (!this.username) {
        this.errors.push('username required');
      }

      if (!this.password) {
        this.errors.push('password required');
      }

      return this.errors.length <= 0;
    },
    async submit() {
      if (!this.checkForm()) {
        return;
      }

      try {
        const { message, token } = await fetchPost('/api/account/signin', {
          name: this.username,
          password: this.password
        });

        if (message !== 'signed-in') {
          throw new Error(message);
        }

        this.$store.dispatch('signin', { login: this.username, token });
        this.$router.push('/');
      }
      catch (err) {
        this.errors = [err.message];
      }
    }
  }
}
</script>


<style scoped lang="scss">
.signin {
  width: 100%;
  height: 100vh;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(/static/undraw_social_share_algy.svg);
  background-position: 0% 65%;
  background-repeat: no-repeat;
  filter: drop-shadow(0 0 2px grey);
}

.content {
  box-shadow: 0 4px 12px rgba(20, 20, 20, .2);
  border-radius: 6px;
  overflow: hidden;
  border-top: solid 3px currentColor;
}

h1 {
  background: #f3f4f5;
  padding: 1em;
}

#form {
  display: flex;
  flex-direction: column;
  padding: 1em;
  background: white;

  a {
    font-weight: bold;
  }


  input + label {
    margin-top: 1em;
  }

  button {
    margin-top: 2em;
  }

  span {
    font-size: .9em;
    opacity: .95;
  }

  @keyframes errorAppear {
      from {
        transform: translate(-3px, 0);
      }

      to {
        transform: translate(0, 0);
      }
    }

  .error {
    background: var(--light-grey);
    border-left: solid 3px var(--red-main);
    border-radius: 3px;
    padding: 1em;
    margin-bottom: 1em;

    animation-name: errorAppear;
    animation-duration: .6s;
  }
}


</style>
