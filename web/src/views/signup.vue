<template>
  <div class="signup">

    <div class="card">
      <h1>Sign up</h1>

      <p>
        <input type='text' placeholder="login">
        <input type='password' placeholder="password">
        <input type='password'placeholder="confirm password">
        <button>Submit</button>
      </p>

      <router-link to='/signin'>already got an account?</router-link>
    </div>

  </div>
</template>

<script>

export default {
  props: ['global'],
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

</style>