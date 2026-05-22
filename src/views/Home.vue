<template>
  <div class="background">
    <AppHeader />
    <div class="home-content">
      <div class="conteudo">
        <h1 class="titulo">segur<span>ON</span></h1>
        <h2 class="subtitulo">Segurança que faz a diferença.</h2>
      </div>
    </div>
    <div class="image-section">
      <img src="../assets/Homesite2.jpg" alt="Imagem de Segurança" class="images-section">
      <img src="../assets/Homesite1.jpg" alt="Imagem de Segurança" class="images-section">
    </div>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import { RouterLink } from 'vue-router'
</script>


<style scoped>
.home-content {
  width: 100%;
  background-image: url(../assets/Homesite3.png);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 70vh;
}

.images-section {
  display: flex;
  width: 30rem;
  height: 20rem;
  margin-top: 3rem;
}

.image-section{
  display: flex;
  justify-content: center;
  gap: 5rem;
  height: 30rem;
  background-color: #3d8127;
}


.conteudo {
  text-align: center;
  margin-top: 8rem;
  color: #ffffff;
}

.titulo {
  font-size: 5rem;
  font-weight: bold;
  color: white;
    text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.6);
  
}

.titulo span {
  color: #0d9e0a;
}

.botao{
  width: 10rem;
  height: 3rem;
  border-radius: 1rem;
  border: none;
  color: #3d8127;
  font-weight: bold;
  cursor: pointer;
}

.botao:hover{
  background-color: #3d8127;
  color: white;
  transition: 0.3s;
}

.subtitulo {
  font-size: 40px;
  font-weight: bold;
  color: #ffffff;
    /* Cria uma leve aura clara ao redor das letras para desgrudar do fundo escuro */
  text-shadow: 0px 0px 40px rgba(255, 255, 255, 0.6); 
}

.botao {
  margin-top: 20px;
  font-size: 25px;
}

.sessao-verde {
  background: #3d8127;
  padding: 50px;
}

.imagem {
  border-radius: 10px;
}
</style>
