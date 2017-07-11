export default {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USERNAME (state, username) {
    state.username = username
  },
  SET_TOKEN (state, token) {
    state.token = token
  }
}
