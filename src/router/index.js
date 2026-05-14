import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CadastroEPI from '../views/CadastroEPI.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Estoque from '../views/Estoque.vue'
import Entrega from '../views/Entrega.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('../views/CadastroFuncionario.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/relatorio',
    name: 'Relatorio',
    component: () => import('../views/Relatorios.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard/funcionario' },
      { path: 'entregas', name: 'entregas', component: Entrega },
      { path: 'estoque', name: 'estoque', component: Estoque },
      { path: 'cadastro-epi', name: 'cadastro-epi', component: CadastroEPI },
      { path: 'funcionario', name: 'funcionario', component: () => import('../views/CadastroFuncionario.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



