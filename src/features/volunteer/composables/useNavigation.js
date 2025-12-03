import { useRoute } from 'vue-router';
import { computed } from 'vue';

export function useNavigation() {
  const route = useRoute();

  const isActive = (path, exact = false) => {
    if (exact) {
      return route.path === path;
    }
    return route.path.startsWith(path);
  };

  return {
    isActive
  };
}

