<template>
  <router-view />
</template>


<script>
import HomeView from './views/HomeView.vue';
import MainLayout from './views/HomeView.vue';

export default {
  name: 'App',
  components: {
    MainLayout
  }
};

</script>
