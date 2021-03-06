import MainView from './components/Main.vue'
import LoginView from './components/Login.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import OverviewView from './components/views/Overview.vue'
import DashboardView from './components/views/Dashboard.vue'
import BetsView from './components/views/Bets.vue'
import TasksView from './components/views/Tasks.vue'
import SettingView from './components/views/Setting.vue'
import AccessView from './components/views/Access.vue'
import ServerView from './components/views/Server.vue'
import ReposView from './components/views/Repos.vue'

// Routes
const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: MainView,
    children: [
      {
        path: '',
        component: OverviewView,
        name: 'Overview',
        meta: {
          description: ''
        }
      }, {
        path: 'dashboard',
        alias: '',
        component: DashboardView,
        name: 'My Dashboard',
        meta: {
          description: 'Overall user statistic',
          auth: true
        }
      }, {
        path: 'bets',
        component: BetsView,
        name: 'Bets',
        meta: {
          description: 'Listing of your last bets',
          auth: true
        }
      }, {
        path: 'tasks',
        component: TasksView,
        name: 'Tasks',
        meta: {description: 'Tasks page in the form of a timeline'}
      }, {
        path: 'setting',
        component: SettingView,
        name: 'Settings',
        meta: {description: 'User settings page'}
      }, {
        path: 'access',
        component: AccessView,
        name: 'Access',
        meta: {description: 'Example of using maps'}
      }, {
        path: 'server',
        component: ServerView,
        name: 'Servers',
        meta: {description: 'List of our servers'}
      }, {
        path: 'repos',
        component: ReposView,
        name: 'Repository',
        meta: {description: 'List of popular javascript repos'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
