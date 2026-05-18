<template>
  <div class="home-content">
    <AppHeader />
    <!-- Botão para entrar no sistema -->
    <RouterLink to="/app" class="btn-entrar">
      Acessar Sistema EPI
    </RouterLink>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.home-content {
  display: flex;
  width: 100%;
  height: auto;
}
</style>