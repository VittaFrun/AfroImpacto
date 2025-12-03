<template>
  <v-card
    :variant="variant"
    :class="['notification-item-card', { 'unread': !read, 'clickable': clickable }]"
    @click="handleClick"
    :ripple="clickable"
  >
    <v-card-text class="pa-3">
      <div class="d-flex align-start">
        <v-avatar
          :color="getTypeColor(type)"
          size="40"
          class="mr-3"
        >
          <v-icon :color="getIconColor(type)" size="20">
            {{ getTypeIcon(type) }}
          </v-icon>
        </v-avatar>
        
        <div class="flex-grow-1">
          <div class="d-flex justify-space-between align-start mb-1">
            <h4 class="text-subtitle-2 font-weight-bold mb-0">
              {{ title }}
            </h4>
            <div class="d-flex align-center gap-1">
              <span class="text-caption text-grey">
                {{ formatTime(createdAt) }}
              </span>
              <v-btn
                v-if="showDelete"
                icon
                size="x-small"
                variant="text"
                @click.stop="handleDelete"
                class="ml-1"
              >
                <v-icon size="14" color="grey">mdi-close</v-icon>
              </v-btn>
            </div>
          </div>
          
          <p v-if="message" class="text-body-2 text-grey-darken-1 mb-2">
            {{ message }}
          </p>
          
          <!-- Actions -->
          <div v-if="(actions && actions.length > 0) || hasContextualActions" class="d-flex gap-1 flex-wrap">
            <v-btn
              v-for="action in contextualActions"
              :key="action.label"
              size="x-small"
              variant="outlined"
              :color="getTypeColor(type)"
              @click.stop="handleAction(action)"
            >
              <v-icon start size="14">{{ action.icon }}</v-icon>
              {{ action.label }}
            </v-btn>
          </div>
        </div>
        
        <div v-if="!read && showReadIndicator" class="ml-2">
          <v-icon size="12" color="primary">mdi-circle</v-icon>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: [Date, String],
    required: true
  },
  actions: {
    type: Array,
    default: () => []
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  clickable: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  showReadIndicator: {
    type: Boolean,
    default: true
  },
  idNotificacion: {
    type: Number,
    default: null
  },
  data: {
    type: Object,
    default: () => ({})
  },
  idProyecto: {
    type: Number,
    default: null
  },
  tipoEntidad: {
    type: String,
    default: null
  },
  idEntidad: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['click', 'action', 'delete', 'read']);

const hasContextualActions = computed(() => {
  return props.idProyecto || props.tipoEntidad;
});

const contextualActions = computed(() => {
  const actions = props.actions || [];
  const contextual = [];

  // Agregar acciones contextuales basadas en el tipo de entidad
  if (props.tipoEntidad === 'proyecto' && props.idProyecto) {
    contextual.push({
      label: 'Ver Proyecto',
      action: 'view-project',
      icon: 'mdi-folder-open',
      data: { id_proyecto: props.idProyecto }
    });
  } else if (props.tipoEntidad === 'tarea' && props.idEntidad && props.idProyecto) {
    contextual.push({
      label: 'Ver Tarea',
      action: 'view-task',
      icon: 'mdi-checkbox-marked-circle',
      data: { id_tarea: props.idEntidad, id_proyecto: props.idProyecto }
    });
  } else if (props.tipoEntidad === 'asignacion' && props.idEntidad && props.idProyecto) {
    contextual.push({
      label: 'Ver Tarea',
      action: 'view-task',
      icon: 'mdi-account-check',
      data: { id_tarea: props.idEntidad, id_proyecto: props.idProyecto }
    });
  } else if (props.tipoEntidad === 'comentario' && props.idEntidad && props.idProyecto) {
    contextual.push({
      label: 'Ver Comentarios',
      action: 'view-comments',
      icon: 'mdi-comment',
      data: { id_entidad: props.idEntidad, tipo_entidad: props.tipoEntidad, id_proyecto: props.idProyecto }
    });
  }

  return [...actions, ...contextual];
});

const getTypeColor = (type) => {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };
  return colors[type] || 'grey';
};

const getIconColor = (type) => {
  return 'white';
};

const getTypeIcon = (type) => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  };
  return icons[type] || 'mdi-bell';
};

const formatTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return formatDistanceToNow(dateObj, { 
      addSuffix: true, 
      locale: es 
    });
  } catch (error) {
    return '';
  }
};

const handleClick = () => {
  if (props.clickable) {
    if (!props.read) {
      emit('read', props.id);
    }
    emit('click', props.id);
  }
};

const handleAction = (action) => {
  emit('action', { notificationId: props.id, action });
  if (!props.read) {
    emit('read', props.id);
  }
};

const handleDelete = () => {
  emit('delete', props.id);
};
</script>

<style scoped>
.notification-item-card {
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.notification-item-card.unread {
  border-left-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.02);
}

.notification-item-card.clickable {
  cursor: pointer;
}

.notification-item-card.clickable:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

