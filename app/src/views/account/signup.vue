<template>
  <div class="signup">

    <div class="content">
      <h1>Sign up</h1>
      <div id="form">
        <div class="error"
          v-for="error in errors" :key="error">{{ error }}</div>

        <div class="info-success"
          v-if="createdAccount">successfully created <span>{{ createdAccount }}</span>, you will be redirected soon</div>

        <label for="username">Username</label>
        <input type="text" id="username" v-model="username">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password">
        <label for="password-confirm">Confirm password</label>
        <input type="password" id="password-confirm" v-model="passwordConfirm">

        <button value="sign up"
          v-on:click="submit">sign up</button>
        
        <span>Already got an account? <router-link to="signin">Sign in!</router-link> or <router-link to="/">cancel</router-link></span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data: () => ({
    username: '',
    password: '',
    passwordConfirm: '',
    errors: [],
    createdAccount: ''
  }),
  methods: {
    checkForm(e) {
      this.errors = [];

      if (!this.username) {
        this.errors.push('username required');
      }

      if (!this.password) {
        this.errors.push('password required');
      }

      if (!this.passwordConfirm) {
        this.errors.push('password confirmation required');
      }

      if (this.password !== this.passwordConfirm) {
        this.errors.push('passwords do not match');
      }

      return this.errors.length <= 0;
    },

    submit() {
      if (!this.checkForm) {
        return;
      }

      fetchPost('/api/account/signup', {
        name: this.username,
        password: this.password
      })
      .then(res => {
        if (res.message === 'created') {
          this.createdAccount = this.username;

          setTimeout(() => this.$router.push('/account/signin'), 5000);
        }
        else {
          this.errors = [res.message];  
        }
      })
      .catch(err => {
        this.errors = [err.message];
      });
    }
  }
}
</script>


<style scoped lang="scss">
.signup {
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

    .error, .info-success {
      background: var(--light-grey);
      border-left: solid 3px var(--red-main);
      border-radius: 3px;
      padding: 1em;
      margin-bottom: 1em;

      animation-name: errorAppear;
      animation-duration: .6s;
    }

    .info-success {
      border-left: solid 3px var(--green-main);

      span {
        font-weight: bold;
      }
    }
  }
}

</style>
