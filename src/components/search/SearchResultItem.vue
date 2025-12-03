<template>
  <v-list-item
    :class="['search-result-item', `type-${item.type}`]"
    @click="handleClick"
    :prepend-icon="getIcon"
    :title="getTitle"
    :subtitle="getSubtitle"
  >
    <template #prepend>
      <v-avatar
        :color="getColor"
        size="40"
        class="mr-3"
      >
        <v-icon color="white" size="20">{{ getIcon }}</v-icon>
      </v-avatar>
    </template>

    <template #append>
      <v-chip
        :color="getColor"
        size="small"
        variant="tonal"
        class="ml-2"
      >
        {{ getTypeLabel }}
      </v-chip>
    </template>
  </v-list-item>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  searchQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['click']);
const router = useRouter();

const getIcon = computed(() => {
  const icons = {
    proyecto: 'mdi-folder',
    tarea: 'mdi-format-list-checks',
    voluntario: 'mdi-account',
    fase: 'mdi-view-list',
    rol: 'mdi-account-group'
  };
  return icons[props.item.type] || 'mdi-file';
});

const getColor = computed(() => {
  const colors = {
    proyecto: 'primary',
    tarea: 'info',
    voluntario: 'success',
    fase: 'warning',
    rol: 'purple'
  };
  return colors[props.item.type] || 'grey';
});

const getTypeLabel = computed(() => {
  const labels = {
    proyecto: 'Proyecto',
    tarea: 'Tarea',
    voluntario: 'Voluntario',
    fase: 'Fase',
    rol: 'Rol'
  };
  return labels[props.item.type] || 'Item';
});

const getTitle = computed(() => {
  switch (props.item.type) {
    case 'proyecto':
      return props.item.nombre || props.item.name || 'Sin nombre';
    case 'tarea':
      return props.item.descripcion?.substring(0, 60) || 'Sin descripción';
    case 'voluntario':
      return props.item.usuario?.nombre || props.item.nombre || 'Voluntario';
    case 'fase':
      return props.item.nombre || props.item.name || 'Sin nombre';
    case 'rol':
      return props.item.nombre || 'Sin nombre';
    default:
      return 'Item';
  }
});

const getSubtitle = computed(() => {
  switch (props.item.type) {
    case 'proyecto':
      return props.item.descripcion?.substring(0, 80) || props.item.ubicacion || '';
    case 'tarea':
      return `Proyecto: ${props.item.proyecto?.nombre || 'N/A'} • Fase: ${props.item.fase?.nombre || 'N/A'}`;
    case 'voluntario':
      return props.item.usuario?.email || '';
    case 'fase':
      return `Proyecto: ${props.item.proyecto?.nombre || 'N/A'}`;
    case 'rol':
      return props.item.descripcion?.substring(0, 60) || '';
    default:
      return '';
  }
});

const handleClick = () => {
  emit('click', props.item);
  
  // Navegar según el tipo
  switch (props.item.type) {
    case 'proyecto':
      router.push(`/organization/projects/${props.item.id_proyecto || props.item.id}`);
      break;
    case 'tarea':
      if (props.item.proyecto?.id) {
        router.push(`/organization/projects/${props.item.proyecto.id}?task=${props.item.id_tarea || props.item.id}`);
      }
      break;
    case 'voluntario':
      router.push(`/organization/volunteers/${props.item.id_voluntario || props.item.id}`);
      break;
    case 'fase':
      if (props.item.proyecto?.id) {
        router.push(`/organization/projects/${props.item.proyecto.id}?phase=${props.item.id_fase || props.item.id}`);
      }
      break;
    case 'rol':
      // Los roles no tienen página propia, se muestran en proyectos
      if (props.item.id_proyecto) {
        router.push(`/organization/projects/${props.item.id_proyecto}?tab=roles`);
      }
      break;
  }
};
</script>

<style scoped>
.search-result-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 0;
}

.search-result-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

.type-proyecto {
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.type-tarea {
  border-left: 3px solid rgb(var(--v-theme-info));
}

.type-voluntario {
  border-left: 3px solid rgb(var(--v-theme-success));
}

.type-fase {
  border-left: 3px solid rgb(var(--v-theme-warning));
}

.type-rol {
  border-left: 3px solid rgb(var(--v-theme-purple));
}
</style>

