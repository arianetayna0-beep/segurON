import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CadastroEPI from '../views/CadastroEPI.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Estoque from '../views/Estoque.vue'
import Entrega from '../views/Entrega.vue'
import Relatorios from '../views/Relatorios.vue' // Corrigido o nome da importação para bater com o uso abaixo
import Cadastro from '../views/Cadastro.vue'
import Sobre from '../views/Sobre.vue'

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
    path: '/sobre',
    name: 'Sobre',
    component: Sobre
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro
  },
  {
    path: '/app',
    // name removido daqui para eliminar o "Vue Router warn" no console
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
      
      // Bate com o link: to="/app/entregas"
      { 
        path: 'entregas', 
        name: 'entregas', 
        component: Entrega 
      },
      
      // Bate com o link: to="/app/relatorio"
      { 
        path: 'relatorio', 
        name: 'relatorio', 
        component: Relatorios // Corrigido para bater com a importação lá de cima
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