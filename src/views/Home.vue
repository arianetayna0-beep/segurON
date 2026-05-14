<template>
  <div class="home-content">
    <AppHeader />
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