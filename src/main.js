// Import System requirements
import Vue from 'vue'
import VueRouter from 'vue-router'

import { sync } from 'vuex-router-sync'
import routes from './routes'
import store from './store'

// Import Helpers for filters
import { domain, count, prettyDate, pluralize } from './filters'

// Handy debugging function for Vue.
import 'vue-clicky'

// Import Views - Top level
import AppView from './components/App.vue'

// Import Install and register helper items
Vue.filter('count', count)
Vue.filter('domain', domain)
Vue.filter('prettyDate', prettyDate)
Vue.filter('pluralize', pluralize)

Vue.use(VueRouter)

// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !(router.app.$store.getters.authenticated)) {
    window.console.log('Not authenticated')
    router.push('/')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

// Check local storage to handle refreshes (not its hanled by localstorage vuex)
/*
if (window.localStorage) {
  var localUserString = window.localStorage.getItem('username') || 'null'
  var localUser = JSON.parse(localUserString)

  if (localUser && store.state.username !== localUser) {
    console.log('commiting store')
    store.commit('SET_USERNAME', localUser)
    store.commit('SET_TOKEN', window.localStorage.getItem('token'))
  }
}
*/

sync(store, router)

// Start out app!
// eslint-disable-next-line no-new
new Vue({
  el: '#root',
  router: router,
  store,
  render: h => h(AppView)
})
