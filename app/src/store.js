import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: {
      login: null,
      token: null,
    },
    posts: []
  },
  mutations: {
    signin(state, { login, token }) {
      state.account.login = login;
      state.account.token = token;
    },

    setPosts(state, { posts }) {
      state.posts = posts;
    }
    
  },
  actions: {
    signin(context, { login, token }) {
      localStorage.setItem('account', JSON.stringify({ token, login }));
      context.commit('signin', { login, token });
    },

    signout(context) {
      localStorage.removeItem('account');
      context.commit('signin', { login: null, token: null });
    },

    syncLocalstorageSession(context) {
      if (localStorage.account) {
        const account = JSON.parse(localStorage.account);

        if (account.login && account.token) {
          context.commit('signin', { login: account.login, token: account.token });
        }
      }
    },

    async loadRecentPosts(context, { page }) {
      const response = await fetch(`/api/posts/recent/${page}`);
      const { posts } = await response.json();

      context.commit('setPosts', { posts });
    }
  }
})
