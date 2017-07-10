<template>
<div class="container container-table">
  <div class="row vertical-5p">
    <div class="container">
      <router-link to="/">
        <img src="/static/img/logo.svg" class="center-block logo">
      </router-link>
      <div class="alert alert-success col-md-4 col-sm-offset-4" v-if="registered">You have successfully registered. Now you can login!
      </div>
      <div class="text-center col-md-4 col-sm-offset-4 vertical-2p">
        <!-- login form -->
        <form class="ui form" @submit.prevent="processAuth">
          <div class="input-group">
            <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
            <input class="form-control" name="username" placeholder="Username" type="text" v-model="username">
          </div>

          <div class="input-group">
            <span class="input-group-addon"><i class="fa fa-lock"></i></span>
            <input class="form-control" name="password" placeholder="Password" type="password" v-model="password">
          </div>
          <transition name="fade">
            <button type="submit" v-bind:class="'btn btn-success ' + loading" v-if="!register">Login</button>
          </transition>
          <button v-on:click.stop.prevent="registerClick()" v-bind:class="'btn btn-default ' + loading" v-if="!registered">
            <template v-if="!register">Register</template>
            <template v-else>Submit</template>
          </button>
        </form>

        <!-- errors -->
        <div v-if=response class="text-red">
          <p>{{response}}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import api from '../api'

export default {
  name: 'Login',
  data (router) {
    return {
      section: 'Login',
      register: false,
      registered: false, // just registered
      loading: '',
      username: '',
      password: '',
      response: ''
    }
  },
  methods: {
    registerClick () {
      if (this.register) {
        return this.processAuth()
      }

      this.resetResponse()
      this.register = true
    },
    processAuth () {
      const {
        username,
        password,
        register
      } = this

      this.toggleLoading()
      this.resetResponse()
      this.$store.commit('TOGGLE_LOADING')

      var _this = this
      /* Making API call to authenticate a user */
      api.request('post', register ? 'users' : 'auth/login', {
        username,
        password
      }).then(response => {
          _this.toggleLoading()
          window.console.log(response)

          var data = response.data
          if (_this.register) {
            // successfull registration
            _this.registered = true
            _this.register = false
            return
          }

          /* Setting user in the state and caching record to the localStorage */
          if (data.username) {
            var token = 'Bearer ' + data.token

            _this.$store.commit('SET_USER', data.username)
            _this.$store.commit('SET_TOKEN', token)

            if (window.localStorage) {
              window.localStorage.setItem('user', JSON.stringify(data.username))
              window.localStorage.setItem('token', token)
            }

            _this.$router.push(data.redirect !== undefined ? data.redirect : '/')
          }
        }).catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data)
            console.log(_this)
            _this.response = error.response.data.message
            console.log(error.response.status)
            console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
          console.log(error.config)
        })
    },
    toggleLoading () {
      this.loading = (this.loading === '') ? 'loading' : ''
    },
    resetResponse () {
      this.response = ''
    }
  }
}
</script>

<style>
html,
body,
.container-table {
  height: 100%;
  background-color: #f5f5f5 !important;
}

.container-table {
  display: table;
  color: white;
}

.vertical-center-row {
  display: table-cell;
  vertical-align: middle;
}

.vertical-2p {
  padding-top: 2%;
}

.vertical-5p {
  padding-top: 5%;
}

.logo {
  width: 15em;
}

.input-group {
  padding-bottom: 1em;
  height: 4em;
}

.input-group input {
  height: 4em;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active для <2.1.8 */ {
  opacity: 0
}
</style>
