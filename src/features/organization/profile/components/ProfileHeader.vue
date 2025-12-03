<template>
  <div class="profile-header">
    <!-- Banner -->
    <div
      class="banner-container"
      :style="bannerStyle"
    >
      <div v-if="isOwnProfile" class="banner-overlay">
        <v-btn
          icon="mdi-camera"
          color="white"
          variant="flat"
          size="small"
          @click="$emit('edit-banner')"
          class="banner-edit-btn"
        >
          <v-icon>mdi-camera</v-icon>
          <v-tooltip activator="parent">Cambiar banner</v-tooltip>
        </v-btn>
      </div>
    </div>

    <!-- Avatar y Info -->
    <v-container>
      <div class="profile-info-container">
        <div class="avatar-wrapper">
          <v-avatar
            :size="avatarSize"
            class="profile-avatar"
            :style="{ borderColor: organization?.color_primario || '#1976D2' }"
          >
            <v-img
              v-if="organization?.logo"
              :src="organization.logo"
              :alt="organization.nombre"
            />
            <v-icon v-else size="64" color="grey">mdi-domain</v-icon>
          </v-avatar>
          <v-btn
            v-if="isOwnProfile"
            icon="mdi-camera"
            color="primary"
            size="small"
            class="avatar-edit-btn"
            @click="$emit('edit-logo')"
          >
            <v-icon>mdi-camera</v-icon>
            <v-tooltip activator="parent">Cambiar logo</v-tooltip>
          </v-btn>
        </div>

        <div class="profile-info">
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ organization?.nombre || 'Cargando...' }}
          </h1>
          <div class="d-flex align-center flex-wrap gap-3 mb-2">
            <v-chip
              v-if="organization?.tipo"
              color="primary"
              variant="tonal"
              size="small"
            >
              {{ organization.tipo }}
            </v-chip>
            <div v-if="organization?.pais || organization?.ciudad" class="d-flex align-center text-body-2 text-grey">
              <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
              <span>{{ [organization.ciudad, organization.pais].filter(Boolean).join(', ') }}</span>
            </div>
            <div v-if="organization?.sitio_web" class="d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-web</v-icon>
              <a :href="organization.sitio_web" target="_blank" class="text-body-2 text-primary text-decoration-none">
                {{ organization.sitio_web }}
              </a>
            </div>
          </div>
          <p v-if="organization?.descripcion" class="text-body-1 text-grey-darken-1 mb-0">
            {{ organization.descripcion }}
          </p>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  organization: {
    type: Object,
    default: null
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['edit-banner', 'edit-logo']);

const avatarSize = computed(() => {
  return window.innerWidth < 960 ? 120 : 150;
});

const bannerStyle = computed(() => {
  const bannerUrl = props.organization?.banner;
  const primaryColor = props.organization?.color_primario || '#1976D2';
  
  // Si hay banner, usarlo; si no, usar gradiente con color primario
  if (bannerUrl) {
    return {
      backgroundImage: `url(${bannerUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: primaryColor
    };
  }
  
  return {
    backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: primaryColor
  };
});
</script>

<style scoped>
.profile-header {
  position: relative;
  background: white;
}

.banner-container {
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.banner-container:hover .banner-overlay {
  opacity: 1;
}

.banner-edit-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}

.profile-info-container {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding-top: 16px;
  flex-wrap: wrap;
}

.avatar-wrapper {
  position: relative;
  margin-top: -75px;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-info {
  flex: 1;
  min-width: 250px;
}

@media (max-width: 960px) {
  .banner-container {
    height: 200px;
  }
  
  .avatar-wrapper {
    margin-top: -60px;
  }
  
  .profile-avatar {
    width: 120px !important;
    height: 120px !important;
  }
}
</style>

