<template>
  <!-- Container principal que divide a tela em Sidebar + Conteúdo -->
  <div class="shell">
    <!-- ===== SIDEBAR: Menu lateral fixo ===== -->
    <aside class="sidebar">
      <!-- Logo/Título do sistema -->
      <h1 class="logo">
        <i class="fas fa-shield-alt"></i>
        SegurON
      </h1>

      <!-- Menu de navegação ajustado para bater com o arquivo de rotas (/app/...) -->
      <nav class="menu">
        <RouterLink to="/app/funcionarios" class="menu-item" active-class="active">
          <i class="fas fa-users"></i>
          <span>Funcionários</span>
        </RouterLink>

        <RouterLink to="/app/entregas" class="menu-item" active-class="active">
          <i class="fas fa-box"></i>
          <span>Entregas de EPI</span>
        </RouterLink>

        <RouterLink to="/app/estoque" class="menu-item" active-class="active">
          <i class="fas fa-chart-bar"></i>
          <span>Estoque</span>
        </RouterLink>
      </nav>

      <!-- Botão de logout -->
      <button @click="sair" class="botao-sair">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sair</span>
      </button>
    </aside>

    <!-- ===== CONTEÚDO CENTRAL ===== -->
    <main class="conteudo">
      <!-- Onde as sub-rotas (/app/funcionarios, etc.) serão renderizadas -->
      <RouterView />
    </main>
  </div>
</template>

<script setup>
// ===== IMPORTAÇÕES =====
import { useRouter, RouterLink, RouterView } from 'vue-router' // Adicionado RouterLink e RouterView aqui
import { useSupabase } from '../composables/useSupabase'
import { ref } from 'vue'
// ===== CONFIGURAÇÃO =====
const router = useRouter()

// Usamos uma estrutura segura para evitar travar o componente caso o useSupabase falhe
let supabase = null
try {
  const supabaseInstance = useSupabase()
  if (supabaseInstance) {
    supabase = supabaseInstance.supabase
  }
} catch (error) {
  console.error("Não foi possível carregar a instância do Supabase:", error)
}

// ===== FUNÇÃO: FAZER LOGOUT =====
async function sair() {
  try {
    if (supabase) {
      await supabase.auth.signOut()
    } else {
      console.warn("Supabase não inicializado, redirecionando apenas localmente.")
    }
    router.push('/login')
  } catch (err) {
    console.error('Erro ao fazer logout:', err)
    // Força o redirecionamento mesmo se a API do Supabase falhar
    router.push('/login')
  }
}
</script>

<style scoped>
/* ===== ESTILOS GERAIS ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ===== CONTAINER PRINCIPAL: SHELL ===== */
.shell {
  display: flex;
  height: 100vh;
  background-color: #FFFFFF;
}

/* ===== SIDEBAR: Menu lateral fixo ===== */
.sidebar {
  width: 250px;
  background-color: #1c5c03;
  color: #FFFFFF;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
}

/* ===== LOGO ===== */
.logo {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo i {
  font-size: 28px;
}

/* ===== MENU DE NAVEGAÇÃO ===== */
.menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ===== ITENS DO MENU ===== */
.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #FFFFFF;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 12px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  border-left: 4px solid #FFFFFF;
  padding-left: 16px;
}

.menu-item i {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

/* ===== BOTÃO SAIR ===== */
.botao-sair {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
}

.botao-sair:hover {
  background-color: rgb(182, 0, 0);
}

.botao-sair:active {
  transform: scale(0.98);
}

.botao-sair i {
  font-size: 18px;
}

/* ===== CONTEÚDO CENTRAL ===== */
.conteudo {
  flex-grow: 1;
  margin-left: 250px;
  padding: 30px;
  overflow-y: auto;
  background-color: #FFFFFF;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  .conteudo {
    margin-left: 200px;
    padding: 20px;
  }
  .logo {
    font-size: 20px;
    margin-bottom: 30px;
  }
  .menu-item {
    padding: 12px 15px;
    font-size: 14px;
  }
}


@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    position: absolute;
    height: auto;
  }
  .conteudo {
    margin-left: 0;
    padding: 15px;
  }
}
</style>