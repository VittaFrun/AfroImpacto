import { useRouter } from 'vue-router';
import { useUiStore } from '@/stores/uiStore';
import { nextTick } from 'vue';

export function useScrollToSection() {
  const router = useRouter();
  const uiStore = useUiStore();

  const scrollToSection = async (sectionId, offset = 72) => {
    if (router.currentRoute.value.path !== '/') {
      await router.push('/');
      await nextTick();
    }

    let element = document.getElementById(sectionId);

    // Fallback for sections that might not have a direct ID but are components
    if (!element) {
      const componentRef = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (componentRef) {
        element = componentRef;
      }
    }
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    if (uiStore.drawer) {
      uiStore.toggleDrawer();
    }
  };

  return { scrollToSection };
}
