import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import JoinUs from '../views/JoinUs.vue'
import FAQ from '../views/FAQ.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import Bind from '../views/Bind.vue'
import Show from '../views/Show.vue'
import Profile from '../views/Profile.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/joinus',
    name: 'JoinUs',
    component: JoinUs
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/bind',
    name: 'Bind',
    component: Bind
  },
  {
    path: '/show',
    name: 'Show',
    component: Show
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
