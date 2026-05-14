import { createRouter, createWebHistory } from 'vue-router'
// Importa todos os componentes das páginas
import Home from '../views/Home.vue'
import CadastroEPI from '../views/CadastroEPI.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Estoque from '../views/Estoque.vue'
import Entregas from '../views/Entregas.vue'

// Define todas as rotas da aplicação
const routes = [
  {
    path: '/',           // URL raiz
    name: 'Home',
    component: Home    // Mostra o componente Home
  },
   {
        path: '/Cadastro',
        name: 'Cadastro',
        alias: '/Cadastro',
        component: () => import('../Views/Cadastro.vue')
    },
    
   {
        path: '/Login',
        name: 'Login',
        alias: '/Login',
        component: () => import('../Views/Login.vue')
    },
  {
        path: '/Relatorio',
        name: 'Relatorio',
        alias: '/Relatorio',
        component: () => import('../Views/Relatorio.vue')
    },
     {
        path: '/Dashboard',
        alias: '/Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
 
        children: [
            { path: '', redirect: '/dashboard/funcionario' },
            { path: 'entregas', name: 'entregas', component: Entregas },
            { path: 'relatorio', name: 'relatorio', component: Relatorio },
            { path: 'cadastro', name: 'dashboard-cadastro', component: Cadastro },
            { path: 'funcionario', name: 'funcionario', component: Funcionario }
        ]
    }
 

]
const router = createRouter({
  history: createWebHistory(),
  routes
})
 
router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
    const { data: { session } } = await supabase.auth.getSession()
 
    if (requiresAuth && !session) {
        return '/login'
    }
 
    return true
})
 
 
export default router



