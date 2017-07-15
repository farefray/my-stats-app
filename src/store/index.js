import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters: {
    authenticated: state => {
      return state.username !== null && state.token !== null
    }
  },
  actions,
  mutations,
  plugins: [createPersistedState()]
})
