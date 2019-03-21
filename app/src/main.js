import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

window.fetchPost = (url, body) => fetch(url, {
  method: 'post',
  mode: 'cors',
  cache: 'no-cache',
  credentials: "same-origin",
  headers: { "Content-Type": "application/json" },
  redirect: 'follow',
  referrer: "no-referrer",
  body: JSON.stringify(body)
})
.then(response => response.json());

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
