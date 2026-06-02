<template>
  <div class="container-login">
    
    <button @click="irParaHome" class="botao-flutuante-voltar" title="Voltar para a Página Inicial">
      <i class="pi pi-arrow-left"></i>
    </button>

    <div class="modal-box">
      <h1 class="titulo">Entrar</h1>

      <form @submit.prevent="fazerLogin" class="formulario">
        <div class="form-group">
          <label for="email" class="label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Email"
            class="input"
            required
          />
        </div>

        <div class="form-group relative">
          <label for="senha" class="label">Senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="••••••••••••••"
            class="input"
            required
          />
          <a href="#" class="esqueceu-senha-link">
            <i class="fas fa-question-circle"></i>
            Esqueceu a senha?
          </a>
        </div>

        <div class="opcoes-container">
          <div class="lembrar-group">
            <input
              id="lembrar"
              v-model="lembrarDeMim"
              type="checkbox"
              class="checkbox"
            />
            <label for="lembrar" class="label-check">Lembrar de mim</label>
          </div>
        </div>

        <div v-if="erro" class="mensagem-erro">
          <i class="fas fa-exclamation-circle"></i>
          {{ erro }}
        </div>

        <button
          type="submit"
          class="botao-entrar"
          :disabled="carregando"
        >
          <i v-if="carregando" class="fas fa-spinner fa-spin"></i>
          <span v-else>Entrar</span>
        </button>
      </form>

      <p class="rodape-modal">
        Não possui uma conta? <a href="#" @click.prevent="router.push('/cadastro')" class="link-cadastrar">Cadastrar-se</a>
      </p>
    </div>
  </div>
</template>

<script setup>
// ===== IMPORTAÇÕES =====
import { ref } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import { useRouter } from 'vue-router'


// ===== CONFIGURAÇÃO =====
const { supabase } = useSupabase()
const router = useRouter()

// ===== VARIÁVEIS REATIVAS =====
const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)
const lembrarDeMim = ref(false)

// ===== FUNÇÃO PARA VOLTAR PARA A HOME =====
function irParaHome() {
  router.push('/') // Redireciona para a rota raiz do sistema
}



async function fazerLogin() {
  erro.value = ''

  if (!email.value || !senha.value) {
    erro.value = 'Por favor, preencha todos os campos'
    return
  }

  carregando.value = true

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: senha.value
    })

    if (error) {
      erro.value = 'E-mail ou senha incorretos. Tente novamente.'
      carregando.value = false
      return
    }

    router.push('/app')
  }
  catch (err) {
    erro.value = 'Erro ao fazer login. Tente novamente mais tarde.'
    console.error('Erro ao fazer login:', err)
    carregando.value = false
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

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ===== CONTAINER PRINCIPAL ===== */
.container-login {
  position: relative; /* Importante para o botão flutuante se posicionar em relação à tela */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-image: url('../assets/Login.jpg'); 
  background-size: cover;       
  background-position: center;  
  background-repeat: no-repeat;
  padding: 20px;
}

/* ===== BOTÃO FLUTUANTE DE VOLTAR ===== */
.botao-flutuante-voltar {
  position: absolute;
  top: 24px;
  right: 24px; /* Fixado no canto superior direito. Se preferir no esquerdo, troque para left: 24px */
  width: 44px;
  height: 44px;
  border-radius: 50%; /* Deixa o botão redondo igual ao botão de voltar do print */
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  color: #1B5E20; /* Seta na cor verde do tema */
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10; /* Garante que fica por cima de tudo */
}

.botao-flutuante-voltar:hover {
  background-color: #FFFFFF;
  transform: scale(1.05); /* Dá um leve feedback de aumento ao passar o mouse */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ===== MODAL BOX ===== */
.modal-box {
  width: 100%;
  max-width: 460px;
  padding: 60px 40px;
  border-radius: 28px; 
  background-color: rgba(255, 255, 255, 0.93); 
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== TÍTULO ===== */
.titulo {
  font-size: 30px;
  color: #1A1D21;
  font-weight: 600;
  margin-bottom: 45px;
  text-align: center;
}

/* ===== FORMULÁRIO ===== */
.formulario {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.relative {
  position: relative;
}

/* ===== LABELS E INPUTS ===== */
.label, .label-check {
  font-size: 14px;
  font-weight: 500;
  color: #3C4043;
}

.label-check {
  cursor: pointer;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  font-size: 16px;
  color: #1A1D21;
  background-color: #FFFFFF;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #1B5E20;
  box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
}

/* ===== LINKS E OPÇÕES ===== */
.esqueceu-senha-link {
  position: absolute;
  right: 12px;
  bottom: 14px;
  font-size: 12px;
  color: #1B5E20;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.opcoes-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 5px;
}

.lembrar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox {
  width: 18px;
  height: 18px;
  accent-color: #1B5E20;
  cursor: pointer;
}

/* ===== MENSAGEM DE ERRO ===== */
.mensagem-erro {
  width: 100%;
  padding: 12px 16px;
  background-color: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  color: #DC2626;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== BOTÕES E RODAPÉ ===== */
.botao-entrar {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  background-color: #1B5E20;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
}

.botao-entrar:hover:not(:disabled) {
  background-color: #144616;
}

.rodape-modal {
  font-size: 13px;
  color: #5F6368;
  text-align: center;
  margin-top: 35px;
  width: 100%;
}

.link-cadastrar {
  color: #1B5E20;
  text-decoration: none;
  font-weight: 600;
}

.link-cadastrar:hover {
  text-decoration: underline;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 600px) {
  .modal-box {
    padding: 40px 20px;
    border-radius: 20px;
  }
  .botao-flutuante-voltar {
    top: 16px;
    right: 16px;
  }
}
</style>