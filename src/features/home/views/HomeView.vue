<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useUiStore } from '@/stores/uiStore';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import HeroSection from '../components/HeroSection.vue';
import UserTypes from '../components/UserTypes.vue';
import Testimonials from '../components/Testimonials.vue';
import ImpactStats from '../components/ImpactStats.vue';
import NewsUpdates from '../components/NewsUpdates.vue';
import AboutUs from '../components/AboutUs.vue';

const uiStore = useUiStore();

// Define refs for each section component
const inicioRef = ref(null);
const perfilesRef = ref(null);
const nosotrosRef = ref(null);

const sectionRefs = {
  inicio: inicioRef,
  perfiles: perfilesRef,
  nosotros: nosotrosRef,
};

const sectionOffsets = ref({});

const calculateSectionOffsets = () => {
  const newOffsets = {};
  for (const sectionName in sectionRefs) {
    const sectionComponent = sectionRefs[sectionName].value;
    const element = sectionComponent?.$el;
    if (element && element.offsetTop !== undefined) {
      newOffsets[sectionName] = element.offsetTop;
    } else {
      // Fallback for components that might not have a direct $el
      const domElement = document.getElementById(sectionName);
      if (domElement) {
        newOffsets[sectionName] = domElement.offsetTop;
      }
    }
  }
  sectionOffsets.value = newOffsets;
};

const handleScroll = () => {
  // The threshold is the point on the screen that determines which section is active.
  // Using 1/3 of the window height is a good starting point.
  const scrollPosition = window.scrollY + window.innerHeight / 3;

  const sortedSections = Object.entries(sectionOffsets.value)
    .sort(([, offsetA], [, offsetB]) => offsetA - offsetB);

  let currentActive = 'inicio'; // Default to 'inicio'
  for (const [sectionName, sectionOffset] of sortedSections) {
    if (scrollPosition >= sectionOffset) {
      currentActive = sectionName;
    } else {
      break; // Since sections are sorted, we can stop once we pass the active one
    }
  }
  
  if (uiStore.activeSection !== currentActive) {
    uiStore.setActiveSection(currentActive);
  }
};

onMounted(async () => {
  // Use nextTick to ensure the DOM is fully rendered before calculating offsets
  await nextTick();
  calculateSectionOffsets();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', calculateSectionOffsets, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', calculateSectionOffsets);
});
</script>

<template>
  <div>
    <AppHeader />
    <HeroSection id="inicio" ref="inicioRef" data-section-id="inicio" />
    <div class="main-content-wrapper">
      <UserTypes id="perfiles" ref="perfilesRef" data-section-id="perfiles" />
      <AboutUs id="nosotros" ref="nosotrosRef" data-section-id="nosotros" />
      <Testimonials />
      <ImpactStats />
      <NewsUpdates />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.main-content-wrapper {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #4ec7a5 1%, #3f51b5 100%);
  padding-top: 0;
}
</style>