<template>
  <div class="container-cadastro">
    <div class="modal-box">
      <h1 class="titulo">Cadastro</h1>

      <form @submit.prevent="fazerCadastro" class="formulario">
        
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

        <div class="form-group">
          <label for="senha" class="label">Criar senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="••••••••••••••"
            class="input"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmarSenha" class="label">Confirmar Senha</label>
          <input
            id="confirmarSenha"
            v-model="confirmarSenha"
            type="password"
            placeholder="••••••••••••••"
            class="input"
            required
          />
        </div>

        <div v-if="erro" class="mensagem-erro">
          <i class="fas fa-exclamation-circle"></i>
          {{ erro }}
        </div>
        
        <div v-if="sucesso" class="mensagem-sucesso">
          <i class="fas fa-check-circle"></i>
          {{ sucesso }}
        </div>

        <button
          type="submit"
          class="botao-cadastrar"
          :disabled="carregando"
        >
          <i v-if="carregando" class="fas fa-spinner fa-spin"></i>
          <span v-else>Confirmar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import { useRouter } from 'vue-router'

// ===== CONFIGURAÇÕES =====
const { supabase } = useSupabase()
const supabaseClient = supabase?.auth ? supabase : supabase.supabase;

// ===== VARIÁVEIS REATIVAS =====
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const erro = ref('')
const sucesso = ref('')
const carregando = ref(false)

// ===== FUNÇÃO DE CADASTRO =====
async function fazerCadastro() {
  erro.value = ''
  sucesso.value = ''

  // Validações básicas de senha
  if (senha.value !== confirmarSenha.value) {
    erro.value = 'As senhas não coincidem!'
    return
  }

  if (senha.value.length < 6) {
    erro.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }

  carregando.value = true

  try {
    // Criar o usuário no Supabase
    const { data, error } = await supabaseClient.auth.signUp({
      email: email.value,
      password: senha.value
    })

    if (error) {
      erro.value = 'Erro ao cadastrar: ' + error.message
      carregando.value = false
      return
    }

    sucesso.value = 'Cadastro realizado com sucesso!'
    
    // Limpa os campos
    email.value = ''
    senha.value = ''
    confirmarSenha.value = ''

    // Redireciona para a tela de login após 2 segundos
    setTimeout(() => {
      router.push('/login') 
    }, 2000)

  } catch (err) {
    erro.value = 'Ocorreu um erro inesperado. Tente novamente.'
    console.error(err)
  } finally {
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
.container-cadastro {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  
  /* Puxa a mesma imagem de fundo do login */
  background-image: url('../assets/Login.jpg'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
}

/* ===== MODAL BOX (Caixa branca fosca) ===== */
.modal-box {
  width: 100%;
  max-width: 460px;
  padding: 60px 40px;
  border-radius: 28px; /* Cantos arredondados idênticos ao print */
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
  font-size: 32px;
  color: #1A1D21;
  font-weight: 600;
  margin-bottom: 35px;
  text-align: center;
}

/* ===== FORMULÁRIO ===== */
.formulario {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espaçamento equilibrado entre os campos */
}

/* ===== GRUPOS DE FORMULÁRIO ===== */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* ===== LABELS ===== */
.label {
  font-size: 14px;
  font-weight: 500;
  color: #3C4043;
}

/* ===== INPUTS ===== */
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

.input::placeholder {
  color: #9AA0A6;
}

.input:focus {
  outline: none;
  border-color: #1B5E20;
  box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
}

/* ===== MENSAGENS DE FEEDBACK ===== */
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

.mensagem-sucesso {
  width: 100%;
  padding: 12px 16px;
  background-color: #DCFCE7;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
  color: #166534;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== BOTÃO CONFIRMAR ===== */
.botao-cadastrar {
  width: 100%;
  margin-top: 15px;
  padding: 14px;
  background-color: #1B5E20; /* Verde do tema */
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

.botao-cadastrar:hover:not(:disabled) {
  background-color: #144616;
}

.botao-cadastrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 600px) {
  .modal-box {
    padding: 40px 20px;
    border-radius: 20px;
  }

  .titulo {
    font-size: 28px;
    margin-bottom: 25px;
  }
}
</style>