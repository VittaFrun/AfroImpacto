import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
  const activeSection = ref('inicio');
  const drawer = ref(false);
  const sectionToScroll = ref(null);

  function setActiveSection(section) {
    activeSection.value = section;
  }

  function toggleDrawer() {
    drawer.value = !drawer.value;
  }

  function setSectionToScroll(section) {
    sectionToScroll.value = section;
  }

  return { activeSection, drawer, sectionToScroll, setActiveSection, toggleDrawer, setSectionToScroll };
});
