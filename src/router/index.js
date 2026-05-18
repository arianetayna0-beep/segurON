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
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/app',
    name: 'Dashboard',
    component: Dashboard, // Layout com a Sidebar e o <RouterView />
    meta: { requiresAuth: true },
    children: [
      // Quando entrar em /app, joga direto para os funcionários
      { path: '', redirect: '/app/funcionarios' }, 
      
      // Bate com o link: to="/app/funcionarios"
      { 
        path: 'funcionarios', 
        name: 'funcionarios', 
        component: () => import('../views/CadastroFuncionario.vue') 
      },
      
      // Bate com o link: to="/app/entregas" (Corrigido para plural!)
      { 
        path: 'entregas', 
        name: 'entregas', 
        component: Entrega 
      },
      
      // Bate com o link: to="/app/relatorio"
      { 
        path: 'relatorio', 
        name: 'relatorio', 
        component: () => import('../views/Relatorios.vue') 
      },
      
      // Outras rotas internas
      { path: 'estoque', name: 'estoque', component: Estoque },
      { path: 'cadastro-epi', name: 'cadastro-epi', component: CadastroEPI }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router