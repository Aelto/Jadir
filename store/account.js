export const account = () => ({
  email: null,
  token: null,
})

export const mutations = {
  setAccount (state, { email, token }) {
    state.email = email
    state.token = token
  },

  removeAccount (state) {
    state.email = null
    state.token = null
  },
}