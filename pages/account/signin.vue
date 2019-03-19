<template>
  <div class="signin">

    <div class="content">
      <h1>Sign in</h1>
      <form action="">
        <label for="email">Email</label>
        <input type="text" id="email">
        <label for="password">Password</label>
        <input type="text" id="password">

        <input type="submit" value="sign in">
        <span>Need an account? <nuxt-link to="signup">Sign up!</nuxt-link> or <nuxt-link to="/">cancel</nuxt-link></span>
      </form>
    </div>

  </div>
</template>

<script>
export default {
  
}
</script>


<style scoped>
.signin {
  width: 100%;
  height: 100vh;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(/undraw_social_share_algy.svg);
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

form {
  display: flex;
  flex-direction: column;
  padding: 1em;
  background: white;
}

form a {
  font-weight: bold;
}


form input + label {
  margin-top: 1em;
}

form input[type=submit] {
  margin-top: 2em;
}

form span {
  font-size: .9em;
  opacity: .95;
}

</style>
