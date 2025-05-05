<template>
  <v-app>
    <app-header />
    <v-main>
      <hero-section />
      <user-types />
      <popular-projects />
      <testimonials />
      <impact-stats />
      <news-updates />
    </v-main>
    <app-footer />
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
  name: 'MainLayout',
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
