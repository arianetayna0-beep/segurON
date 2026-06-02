<template>
  <div class="pagina">
    <AppHeader />

    <main class="sobre-container">
    <div class="sobre-card">
      <h1>Sobre o SegurON</h1>

      <p>
        O <strong>SegurON</strong> é um sistema de controle de Equipamentos de
        Proteção Individual (EPIs) desenvolvido pelos estudantes
        <strong>Gabriela Fernandes</strong>,
        <strong>Ariane Macedo</strong> e
        <strong>Maicon Oliveira</strong>.
      </p>

      <p>
        Este sistema foi criado para auxiliar empresas no gerenciamento e
        controle de EPIs, oferecendo uma solução prática e eficiente para o
        acompanhamento de estoque, entregas e conformidade com as normas de
        segurança do trabalho.
      </p>

      <p>
        Nosso objetivo é facilitar o controle de estoque, entrega e geração de
        relatórios, contribuindo para uma gestão mais organizada e segura para
        empresas e funcionários.
      </p>

      <h2>Principais Recursos</h2>

      <ul>
        <li>Gestão de funcionários e setores;</li>
        <li>Controle rigoroso de estoque de EPIs;</li>
        <li>Histórico de entregas e devoluções;</li>
        <li>Relatórios rápidos para auditorias;</li>
        <li>Rastreamento completo dos equipamentos entregues;</li>
        <li>Maior controle e conformidade com normas de segurança.</li>
      </ul>

      <div class="missao">
        <h2>Nossa Missão</h2>
        <p>
          Promover uma gestão eficiente dos Equipamentos de Proteção Individual,
          garantindo mais segurança, organização e praticidade no ambiente de
          trabalho.
        </p>
      </div>
    </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import Footer from '../components/Footer.vue'
</script>

<style scoped>
.sobre-container {
  min-height: 100vh;
  background: #3d8127;
  padding: 50px 20px;
  display: flex;
  justify-content: center;
}

.sobre-card {
  max-width: 900px;
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #3d8127;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
}

h2 {
  color: #3d8127;
  margin-top: 30px;
  margin-bottom: 15px;
}

p {
  line-height: 1.8;
  color: #444;
  text-align: justify;
  margin-bottom: 15px;
}

ul {
  margin-left: 20px;
}

li {
  margin-bottom: 10px;
  color: #444;
}

.missao {
  margin-top: 30px;
  padding: 20px;
  background: #f0f8ed;
  border-left: 5px solid #3d8127;
  border-radius: 8px;
}
</style>