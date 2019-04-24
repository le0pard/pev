import App from './pages/app'
import Dashboard from './pages/dashboard'
import PlanPage from './pages/plan'
import AboutPage from './pages/about'

// routes
export const routes = [{
  component: App,
  routes: [
    {
      path: '/',
      exact: true,
      component: Dashboard
    },
    {
      path: '/plans/:planID',
      exact: true,
      component: PlanPage
    },
    {
      path: '/about',
      exact: true,
      component: AboutPage
    }
  ]
}]
