<template>
  <div class="container-sobre">
    <div class="sobre-box">
      <h1 class="titulo">Sobre o Sistema</h1>
      <p class="descricao">
        Este é um sistema desenvolvido para o gerenciamento e controle de **Equipamentos de Proteção Individual (EPIs)**. 
        Nosso objetivo é facilitar o controle de estoque, entrega e relatórios de conformidade de segurança para empresas e funcionários.
      </p>
      
      <div class="funcionalidades">
        <h3>Principais Recursos:</h3>
        <ul>
          <li><i class="fas fa-check"></i> Gestão de Funcionários e setores.</li>
          <li><i class="fas fa-check"></i> Controle rigoroso de estoque de EPIs.</li>
          <li><i class="fas fa-check"></i> Histórico de entregas e devoluções.</li>
          <li><i class="fas fa-check"></i> Relatórios rápidos para auditoria.</li>
        </ul>
      </div>

      <button @click="voltar" class="botao-voltar">Voltar</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function voltar() {
  // Se o usuário estiver logado, manda para o app, senão vai para a home/login
  router.back() 
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container-sobre {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #F0F2F5;
  padding: 20px;
}

.sobre-box {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  border-radius: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.titulo {
  font-size: 28px;
  color: #1A1D21;
  font-weight: 600;
  margin-bottom: 20px;
}

.descricao {
  font-size: 16px;
  color: #5F6368;
  line-height: 1.6;
  margin-bottom: 25px;
}

.funcionalidades {
  margin-bottom: 30px;
}

.funcionalidades h3 {
  font-size: 16px;
  color: #1B5E20;
  margin-bottom: 12px;
}

.funcionalidades ul {
  list-style: none;
}

.funcionalidades li {
  font-size: 14px;
  color: #3C4043;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.funcionalidades i {
  color: #1B5E20;
}

.botao-voltar {
  padding: 12px 24px;
  background-color: #1B5E20;
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.botao-voltar:hover {
  background-color: #144616;
}
</style>