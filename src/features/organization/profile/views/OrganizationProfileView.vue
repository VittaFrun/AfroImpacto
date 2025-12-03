<template>
  <v-container fluid class="pa-0">
    <!-- Header con Banner -->
    <ProfileHeader
      :organization="organization"
      :is-own-profile="isOwnProfile"
      :loading="loading"
      @edit-banner="openEditBannerDialog"
      @edit-logo="openEditLogoDialog"
    />

    <!-- Contenido Principal -->
    <v-container class="mt-n8">
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="4" lg="3">
          <ProfileSidebar
            :organization="organization"
            :is-own-profile="isOwnProfile"
            :stats="stats"
            :loading="loading"
            @request-join="handleRequestJoin"
            @edit-profile="openEditProfileDialog"
          />
        </v-col>

        <!-- Contenido Principal con Tabs -->
        <v-col cols="12" md="8" lg="9">
          <v-card class="elevation-2" rounded="lg">
            <v-tabs
              v-model="activeTab"
              color="primary"
              class="profile-tabs"
              show-arrows
            >
              <v-tab value="about">
                <v-icon start>mdi-information</v-icon>
                <span class="tab-text">Sobre</span>
              </v-tab>
              <v-tab value="projects">
                <v-icon start>mdi-folder-multiple</v-icon>
                <span class="tab-text">Proyectos</span>
                <v-badge
                  v-if="stats.projectsCount > 0"
                  :content="stats.projectsCount"
                  color="primary"
                  inline
                  class="ml-2"
                />
              </v-tab>
              <v-tab value="team">
                <v-icon start>mdi-account-group</v-icon>
                <span class="tab-text">Equipo</span>
                <v-badge
                  v-if="stats.teamMembersCount > 0"
                  :content="stats.teamMembersCount"
                  color="info"
                  inline
                  class="ml-2"
                />
              </v-tab>
              <v-tab value="activity" v-if="isOwnProfile">
                <v-icon start>mdi-history</v-icon>
                <span class="tab-text">Actividad</span>
              </v-tab>
              <v-tab value="stats" v-if="isOwnProfile">
                <v-icon start>mdi-chart-line</v-icon>
                <span class="tab-text">Estadísticas</span>
              </v-tab>
            </v-tabs>

            <v-divider></v-divider>

            <v-window v-model="activeTab">
              <!-- Tab: Sobre -->
              <v-window-item value="about">
                <ProfileAboutSection
                  :organization="organization"
                  :is-own-profile="isOwnProfile"
                  @edit="openEditProfileDialog"
                />
              </v-window-item>

              <!-- Tab: Proyectos -->
              <v-window-item value="projects">
                <ProfileProjectsSection
                  :organization-id="organization?.id_organizacion"
                  :is-own-profile="isOwnProfile"
                  :loading="loadingProjects"
                />
              </v-window-item>

              <!-- Tab: Equipo -->
              <v-window-item value="team">
                <ProfileTeamSection
                  :organization-id="organization?.id_organizacion"
                  :is-own-profile="isOwnProfile"
                  :loading="loadingTeam"
                />
              </v-window-item>

              <!-- Tab: Actividad (solo para perfil propio) -->
              <v-window-item value="activity" v-if="isOwnProfile">
                <ProfileActivitySection
                  :organization-id="organization?.id_organizacion"
                />
              </v-window-item>

              <!-- Tab: Estadísticas (solo para perfil propio) -->
              <v-window-item value="stats" v-if="isOwnProfile">
                <ProfileStatsSection
                  :organization-id="organization?.id_organizacion"
                  :stats="stats"
                />
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialogs -->
    <EditProfileDialog
      v-model="editProfileDialog"
      :organization="organization"
      :loading="saving"
      @save="handleSaveProfile"
    />

    <EditBannerDialog
      v-model="editBannerDialog"
      :banner-url="organization?.banner"
      :loading="saving"
      @save="handleSaveBanner"
    />

    <EditLogoDialog
      v-model="editLogoDialog"
      :logo-url="organization?.logo"
      :organization="organization"
      :loading="saving"
      @save="handleSaveLogo"
      @remove="handleRemoveLogo"
    />

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useOrganizationProfileStore } from '../stores/organizationProfileStore';
import { useNotifications } from '@/composables/useNotifications';
import ProfileHeader from '../components/ProfileHeader.vue';
import ProfileSidebar from '../components/ProfileSidebar.vue';
import ProfileAboutSection from '../components/ProfileAboutSection.vue';
import ProfileProjectsSection from '../components/ProfileProjectsSection.vue';
import ProfileTeamSection from '../components/ProfileTeamSection.vue';
import ProfileActivitySection from '../components/ProfileActivitySection.vue';
import ProfileStatsSection from '../components/ProfileStatsSection.vue';
import EditProfileDialog from '../components/EditProfileDialog.vue';
import EditBannerDialog from '../components/EditBannerDialog.vue';
import EditLogoDialog from '../components/EditLogoDialog.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useOrganizationProfileStore();
const { showSuccess, showError } = useNotifications();

const activeTab = ref('about');
const editProfileDialog = ref(false);
const editBannerDialog = ref(false);
const editLogoDialog = ref(false);
const saving = ref(false);
const loading = ref(false);
const loadingProjects = ref(false);
const loadingTeam = ref(false);

const organizationId = computed(() => {
  return route.params.id ? parseInt(route.params.id) : null;
});

const isOwnProfile = computed(() => {
  // Si estamos en la ruta de settings, siempre es perfil propio
  if (route.path.includes('/settings/profile')) {
    return true;
  }
  
  if (!organizationId.value || !authStore.user) return false;
  // Verificar si el usuario es dueño de esta organización
  return authStore.user.organizacion?.id_organizacion === organizationId.value ||
         authStore.user.id_organizacion === organizationId.value;
});

const organization = computed(() => profileStore.organization);
const stats = computed(() => profileStore.stats);

function openEditProfileDialog() {
  editProfileDialog.value = true;
}

function openEditBannerDialog() {
  editBannerDialog.value = true;
}

function openEditLogoDialog() {
  editLogoDialog.value = true;
}

async function handleSaveProfile(profileData) {
  saving.value = true;
  try {
    await profileStore.updateProfile(profileData);
    showSuccess('Perfil actualizado correctamente');
    editProfileDialog.value = false;
  } catch (error) {
    showError('Error al actualizar el perfil');
  } finally {
    saving.value = false;
  }
}

async function handleSaveBanner(bannerUrl) {
  saving.value = true;
  try {
    await profileStore.updateBanner(bannerUrl);
    showSuccess('Banner actualizado correctamente');
    editBannerDialog.value = false;
  } catch (error) {
    showError('Error al actualizar el banner');
  } finally {
    saving.value = false;
  }
}

async function handleSaveLogo(logoUrl) {
  saving.value = true;
  try {
    await profileStore.updateLogo(logoUrl);
    showSuccess('Logo actualizado correctamente');
    editLogoDialog.value = false;
  } catch (error) {
    showError('Error al actualizar el logo');
  } finally {
    saving.value = false;
  }
}

async function handleRemoveLogo() {
  saving.value = true;
  try {
    await profileStore.updateLogo('');
    showSuccess('Logo eliminado correctamente');
    editLogoDialog.value = false;
  } catch (error) {
    showError('Error al eliminar el logo');
  } finally {
    saving.value = false;
  }
}

async function handleRequestJoin() {
  if (!organizationId.value) return;
  
  try {
    await profileStore.requestJoinTeam(organizationId.value);
    showSuccess('Solicitud enviada correctamente');
  } catch (error) {
    showError(error.response?.data?.message || 'Error al enviar la solicitud');
  }
}

onMounted(async () => {
  let orgIdToLoad = organizationId.value;
  
  // Si no hay ID en params pero es perfil propio, obtener el ID
  if (!orgIdToLoad && isOwnProfile.value) {
    orgIdToLoad = await profileStore.getOwnOrganizationId();
  }
  
  if (orgIdToLoad) {
    loading.value = true;
    try {
      await profileStore.fetchOrganizationProfile(orgIdToLoad);
      await profileStore.fetchStats(orgIdToLoad);
    } catch (error) {
      showError('Error al cargar el perfil');
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped>
.profile-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.profile-tabs .v-tab {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  min-height: 56px;
  padding: 0 24px;
}

.profile-tabs .v-tab--selected {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.tab-text {
  margin-left: 8px;
}

@media (max-width: 960px) {
  .tab-text {
    display: none;
  }
}
</style>

