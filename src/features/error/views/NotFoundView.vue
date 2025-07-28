<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Página no encontrada</h2>
      <p class="error-message">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      <v-btn class="home-link" @click="goBack">Volver</v-btn>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
  color: #2c3e50;
  font-family: 'Arial', sans-serif;
  text-align: center;
  overflow: hidden;
}

.error-content {
  animation: fadeIn 1s ease-in-out;
}

.error-code {
  font-size: 10rem;
  font-weight: bold;
  color: #4ec7a5;
  margin: 0;
  animation: slideUp 0.8s ease-in-out;
}

.error-title {
  font-size: 2rem;
  margin: 20px 0;
  animation: slideUp 0.9s ease-in-out;
}

.error-message {
  font-size: 1.2rem;
  margin-bottom: 30px;
  animation: slideUp 1s ease-in-out;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4ec7a5;
  color: #ffffff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  animation: slideUp 1.1s ease-in-out;
}

.home-link:hover {
  background-color: #3ca58a;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>