import { ref } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

export function useProjectOperations() {
  const notificationStore = useNotificationStore();
  const loadingStates = ref({
    savingProject: false,
    deletingProject: false,
    addingPhase: false,
    updatingPhase: false,
    deletingPhase: false,
    addingTask: false,
    updatingTask: false,
    deletingTask: false,
    assigningVolunteer: false,
    togglingVisibility: false,
    updatingStates: false
  });

  const handleOperation = async (
    operation,
    loadingKey,
    successMessage,
    errorMessage,
    onSuccess = null,
    onError = null
  ) => {
    loadingStates.value[loadingKey] = true;
    
    try {
      const result = await operation();
      
      if (successMessage) {
        notificationStore.success('Operación Exitosa', successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorMsg = error.message || errorMessage || 'Ha ocurrido un error';
      notificationStore.error('Error', errorMsg);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      loadingStates.value[loadingKey] = false;
    }
  };

  const setLoading = (key, value) => {
    loadingStates.value[key] = value;
  };

  const isLoading = (key) => {
    return loadingStates.value[key] || false;
  };

  return {
    loadingStates,
    handleOperation,
    setLoading,
    isLoading
  };
}

