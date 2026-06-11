<template>
  <footer class="footer">
    <span class="ano">© 2026</span>
    <span class="slogan">SegurON, a segurança que faz diferença</span>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: white;
  border-top: 1px solid #ddd;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.ano {
  position: absolute;
  left: 20px;
  font-weight: bold;
  color: #333;
}

.slogan {
  color: #333;
  font-style: italic;
}
</style>