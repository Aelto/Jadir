<template>
  <router-view></router-view>
</template>

<script>
import Nav from './components/nav.vue'

export default {
  created() {
    this.$store.dispatch('syncLocalstorageSession');
  },
  components: { Nav }
}
</script>


<style lang="scss">
:root {
  --black-text: rgb(40, 40, 40);
  --green-main: #41ba90;
  --light-grey: #f3f4f5;
  --red-main: #d63031;
}

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  margin: 0 auto;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--black-text);
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

input {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 1em;
  padding: .3em;
  border-radius: 4px;
  border: solid 1px #E1E1E1;
}

input[type=submit], button {
  background: var(--green-main);
  color: white;
  cursor: pointer;
  font-size: 1em;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  padding: .4em 1em;
  border-radius: 4px;
  border: none;
}

a {
  text-decoration: none;
  color: var(--black-text);

  &:hover {
    text-decoration: underline;
  }
}
</style>
