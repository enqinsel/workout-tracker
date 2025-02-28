import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DayView from '../views/DayView.vue'
import { auth } from '../firebase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/day/:id',
      name: 'day',
      component: DayView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.path !== '/' // Ana sayfa hariç tüm sayfalar auth gerektirir
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
