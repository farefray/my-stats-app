<template>
  <div :class="['wrapper', classes]">
    <header class="main-header">
	<span class="logo-mini">
		<a href="/"><img src="/static/img/logo.svg" alt="Logo" class="img-responsive center-block logo"></a>
	</span>
      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="javascript:;" class="sidebar-toggle" data-toggle="offcanvas" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu" v-if="isLoggedIn()">
          <ul class="nav navbar-nav">
            <!-- Messages-->
            <li class="dropdown messages-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-envelope-o"></i>
                <span class="label label-success">{{ userInfo.messages | count }}</span>
              </a>
              <ul class="dropdown-menu">
                <li class="header">You have {{ userInfo.messages | count }} message(s)</li>
                <li v-if="userInfo.messages.length > 0">
                  <!-- inner menu: contains the messages -->
                  <ul class="menu">
                    <li>
                      <!-- start message -->
                      <a href="javascript:;">
                        <!-- Message title and timestamp -->
                        <h4>
                          Support Team
                          <small>
                            <i class="fa fa-clock-o"></i> 5 mins</small>
                        </h4>
                        <!-- The message -->
                        <p>Why not consider this a test message?</p>
                      </a>
                    </li>
                    <!-- end message -->
                  </ul>
                  <!-- /.menu -->
                </li>
                <li class="footer" v-if="userInfo.messages.length > 0">
                  <a href="javascript:;">See All Messages</a>
                </li>
              </ul>
            </li>
            <!-- /.messages-menu -->

            <!-- Notifications Menu -->
            <li class="dropdown notifications-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-bell-o"></i>
                <span class="label label-warning">{{ userInfo.notifications | count }}</span>
              </a>
              <ul class="dropdown-menu">
                <li class="header">You have {{ userInfo.notifications | count }} notification(s)</li>
                <li v-if="userInfo.notifications.length > 0">
                  <!-- Inner Menu: contains the notifications -->
                  <ul class="menu">
                    <li>
                      <!-- start notification -->
                      <a href="javascript:;">
                        <i class="fa fa-users text-aqua"></i> 5 new members joined today
                      </a>
                    </li>
                    <!-- end notification -->
                  </ul>
                </li>
                <li class="footer" v-if="userInfo.notifications.length > 0">
                  <a href="javascript:;">View all</a>
                </li>
              </ul>
            </li>

            <!-- Tasks Menu -->
            <li class="dropdown tasks-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-flag-o"></i>
                <span class="label label-danger">{{ userInfo.tasks | count }} </span>
              </a>
              <ul class="dropdown-menu">
                <li class="header">You have {{ userInfo.tasks | count }} task(s)</li>
                <li v-if="userInfo.tasks.length > 0">
                  <!-- Inner menu: contains the tasks -->
                  <ul class="menu">
                    <li>
                      <!-- Task item -->
                      <a href="javascript:;">
                        <!-- Task title and progress text -->
                        <h3>
                          Design some buttons
                          <small class="pull-right">20%</small>
                        </h3>
                        <!-- The progress bar -->
                        <div class="progress xs">
                          <!-- Change the css width attribute to simulate progress -->
                          <div class="progress-bar progress-bar-aqua" style="width: 20%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                            <span class="sr-only">20% Complete</span>
                          </div>
                        </div>
                      </a>
                    </li>
                    <!-- end task item -->
                  </ul>
                </li>
                <li class="footer" v-if="userInfo.tasks.length > 0">
                  <a href="javascript:;">View all tasks</a>
                </li>
              </ul>
            </li>
            <li style="height: 100%;">
              <a href="#" style="padding-bottom:0;" class="no-hover">
              <Dropdown placement="bottom-end">
                <Avatar shape="square" icon="person" v-bind:src="avatar" size="small">
                  <span class="hidden-xs">{{ username }}</span>
                </Avatar>
                <Icon type="arrow-down-b"></Icon>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <a href="" v-on:click.stop.prevent="logout()"><i class="fa fa-circle-o text-red"></i> Logout</a>
                  </DropdownItem>
                  <DropdownItem>
                    <router-link to="/settings">
                      <span class="page"><i class="fa fa-circle-o text-blue"></i> Settings</span>
                    </router-link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              </a>
            </li>
          </ul>
        </div>
        <div class="navbar-custom-menu" v-else>
          <ul class="nav navbar-nav">
            <li class="dropdown user user-menu">
              <router-link to="/login">
                <i class="fa fa-circle-o text-green"></i>
                <span class="page"> Login \ Register</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <sidebar :loggedIn="isLoggedIn()" :picture-url="avatar" />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          {{$route.name.toUpperCase() }}
          <small>{{ $route.meta.description }}</small>
        </h1>
        <ol class="breadcrumb">
          <li>
            <a href="javascript:;">
              <i class="fa fa-home"></i>Home</a>
          </li>
          <li class="active">{{$route.name.toUpperCase()}}</li>
        </ol>
      </section>

      <router-view></router-view>
    </div>
    <!-- /.content-wrapper -->

    <!-- Main Footer -->
    <footer class="main-footer">
      <strong>Copyright &copy; {{year}}
        <a href="javascript:;">BettingStats</a>.</strong> All rights reserved.
    </footer>
  </div>
  <!-- ./wrapper -->
</template>

<script>
import { mapState } from 'vuex'
import config from '../config'
import Sidebar from './Sidebar'

export default {
  name: 'Dash',
  components: {
    Sidebar
  },
  data: function () {
    return {
      // section: 'Dash',
      year: new Date().getFullYear(),
      classes: {
        fixed_layout: config.fixedLayout,
        hide_logo: config.hideLogoOnMobile
      },
      error: '',
      avatar: ''
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'username',
      'token'
    ])
  },
  methods: {
    isLoggedIn () {
      return this.username !== null && this.token !== null
    },
    logout () {
      this.$store.commit('SET_USERNAME', null)
      this.$store.commit('SET_TOKEN', null)

      if (window.localStorage) {
        window.localStorage.setItem('username', null)
        window.localStorage.setItem('token', null)
      }

      this.$router.push('/')
    },
    changeloading () {
      this.$store.commit('TOGGLE_SEARCHING')
    }
  }
}
</script>

<style lang="scss">
.wrapper.fixed_layout {
  .main-header {
    position: fixed;
    width: 100%;
  }

  .content-wrapper {
    padding-top: 50px;
  }

  .main-sidebar {
    position: fixed;
    height: 100vh;
  }
}

.wrapper.hide_logo {
  @media (max-width: 767px) {
    .main-header .logo {
      display: none;
    }
  }
}

.logo-mini,
.logo-lg {
  text-align: left;

  img {
    padding: .4em !important;
  }
}

.logo-lg {
  img {
    display: -webkit-inline-box;
    width: 25%;
  }
}

.user-panel {
  height: 4em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}

  a.no-hover:hover {
    background: rgba(0,0,0,0.0) !important;
  }
</style>
