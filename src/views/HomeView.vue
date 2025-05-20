<template>
  <v-app>
    <div class="main-bg">
      <AppHeader />
      <HeroSection />
      <UserTypes />
      <PopularProjects />
      <Testimonials />
      <ImpactStats />
      <NewsUpdates />
      <AppFooter />
    </div>
  </v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import UserTypes from '@/components/UserTypes.vue'
import PopularProjects from '@/components/PopularProjects.vue'
import Testimonials from '@/components/Testimonials.vue'
import ImpactStats from '@/components/ImpactStats.vue'
import NewsUpdates from '@/components/NewsUpdates.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    HeroSection,
    UserTypes,
    PopularProjects,
    Testimonials,
    ImpactStats,
    NewsUpdates,
    AppFooter
  }
}
</script>

<style scoped>
.main-bg {
  min-height: 100vh;
  width: 100%;
background: linear-gradient(to bottom, #4ec7a5 30%, #3f51b5 100%);

}
</style>
