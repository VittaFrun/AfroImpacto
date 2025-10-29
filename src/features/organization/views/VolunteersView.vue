<template>
  <v-container fluid class="pa-8">
    <!-- Header Section -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-2">Gestión de Voluntarios</h1>
        <p class="text-body-1 text-grey-darken-1">
          Administra y coordina el equipo de voluntarios de tu organización
        </p>
      </div>
      <ModernButton
        color="primary"
        size="large"
        prepend-icon="mdi-account-plus"
        @click="openAddVolunteerDialog"
      >
        Agregar Voluntario
      </ModernButton>
    </div>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <ModernCard
          title="Total Voluntarios"
          subtitle="Registrados en la plataforma"
          icon="mdi-account-group"
          icon-color="primary"
          variant="filled"
        >
          <template #content>
            <div class="text-center py-4">
              <div class="text-h3 font-weight-bold text-primary mb-2">{{ totalVolunteers }}</div>
              <v-progress-linear
                :model-value="volunteerGrowth"
                color="primary"
                height="6"
                rounded
                class="mb-2"
              ></v-progress-linear>
              <div class="text-caption text-grey">+{{ volunteerGrowth }}% este mes</div>
            </div>
          </template>
        </ModernCard>
      </v-col>
      
      <v-col cols="12" md="3">
        <ModernCard
          title="Activos"
          subtitle="Participando en proyectos"
          icon="mdi-account-check"
          icon-color="success"
          variant="tonal"
        >
          <template #content>
            <div class="text-center py-4">
              <div class="text-h3 font-weight-bold text-success mb-2">{{ activeVolunteers }}</div>
              <div class="text-caption text-grey">{{ activePercentage }}% del total</div>
            </div>
          </template>
        </ModernCard>
      </v-col>
      
      <v-col cols="12" md="3">
        <ModernCard
          title="Horas Voluntariadas"
          subtitle="Este mes"
          icon="mdi-clock-outline"
          icon-color="info"
          variant="outlined"
        >
          <template #content>
            <div class="text-center py-4">
              <div class="text-h3 font-weight-bold text-info mb-2">{{ monthlyHours }}</div>
              <div class="text-caption text-grey">Horas registradas</div>
            </div>
          </template>
        </ModernCard>
      </v-col>
      
      <v-col cols="12" md="3">
        <ModernCard
          title="Evaluaciones"
          subtitle="Promedio de calificación"
          icon="mdi-star"
          icon-color="warning"
          variant="gradient"
        >
          <template #content>
            <div class="text-center py-4">
              <div class="text-h3 font-weight-bold text-warning mb-2">{{ averageRating }}</div>
              <div class="d-flex justify-center">
                <v-rating
                  :model-value="averageRating"
                  color="warning"
                  size="small"
                  readonly
                  half-increments
                ></v-rating>
              </div>
            </div>
          </template>
        </ModernCard>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <ModernCard
      title="Lista de Voluntarios"
      subtitle="Gestiona la información y estado de cada voluntario"
      icon="mdi-account-multiple"
      icon-color="primary"
      variant="default"
    >
      <template #headerActions>
        <v-text-field
          v-model="search"
          label="Buscar voluntarios..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="modern-input"
          style="max-width: 300px;"
        ></v-text-field>
      </template>

      <template #content>
        <v-data-table
          :headers="headers"
          :items="filteredVolunteers"
          :search="search"
          class="elevation-0 modern-table"
          :loading="loading"
          loading-text="Cargando voluntarios..."
          no-data-text="No hay voluntarios registrados"
          :items-per-page="10"
        >
          <template v-slot:item.avatar="{ item }">
            <v-avatar :color="getAvatarColor(item.name)" size="40">
              <span class="text-white font-weight-bold">
                {{ getInitials(item.name) }}
              </span>
            </v-avatar>
          </template>
          
          <template v-slot:item.status="{ item }">
            <v-chip 
              :color="getStatusColor(item.status)" 
              size="small" 
              class="modern-chip"
            >
              <v-icon start size="small">{{ getStatusIcon(item.status) }}</v-icon>
              {{ item.status }}
            </v-chip>
          </template>
          
          <template v-slot:item.skills="{ item }">
            <div class="d-flex flex-wrap">
              <v-chip 
                v-for="skill in item.skills.slice(0, 2)" 
                :key="skill" 
                class="ma-1 modern-chip" 
                color="blue-grey" 
                variant="tonal" 
                size="small"
              >
                {{ skill }}
              </v-chip>
              <v-chip 
                v-if="item.skills.length > 2" 
                class="ma-1 modern-chip" 
                color="grey" 
                variant="tonal" 
                size="small"
              >
                +{{ item.skills.length - 2 }}
              </v-chip>
            </div>
          </template>
          
          <template v-slot:item.rating="{ item }">
            <div class="d-flex align-center">
              <v-rating
                :model-value="item.rating"
                color="warning"
                size="small"
                readonly
                half-increments
                density="compact"
              ></v-rating>
              <span class="ml-2 text-caption text-grey">{{ item.rating }}</span>
            </div>
          </template>
          
          <template v-slot:item.actions="{ item }">
            <div class="d-flex align-center">
              <v-tooltip text="Ver perfil">
                <template v-slot:activator="{ props }">
                  <ModernButton
                    icon="mdi-eye"
                    variant="text"
                    color="info"
                    size="small"
                    @click="viewVolunteer(item)"
                    v-bind="props"
                    class="action-btn"
                  ></ModernButton>
                </template>
              </v-tooltip>
              
              <v-tooltip text="Editar voluntario">
                <template v-slot:activator="{ props }">
                  <ModernButton
                    icon="mdi-pencil"
                    variant="text"
                    color="warning"
                    size="small"
                    @click="editVolunteer(item)"
                    v-bind="props"
                    class="action-btn"
                  ></ModernButton>
                </template>
              </v-tooltip>
              
              <v-tooltip text="Evaluar voluntario">
                <template v-slot:activator="{ props }">
                  <ModernButton
                    icon="mdi-star"
                    variant="text"
                    color="primary"
                    size="small"
                    @click="evaluateVolunteer(item)"
                    v-bind="props"
                    class="action-btn"
                  ></ModernButton>
                </template>
              </v-tooltip>
              
              <v-tooltip text="Eliminar voluntario">
                <template v-slot:activator="{ props }">
                  <ModernButton
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    size="small"
                    @click="confirmDeleteVolunteer(item)"
                    v-bind="props"
                    class="action-btn"
                  ></ModernButton>
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </template>
    </ModernCard>

    <!-- Add/Edit Volunteer Dialog -->
    <ModernDialog
      v-model="volunteerDialog"
      :title="isEditing ? 'Editar Voluntario' : 'Agregar Nuevo Voluntario'"
      :subtitle="isEditing ? 'Modifica la información del voluntario' : 'Completa los datos del nuevo voluntario'"
      :icon="isEditing ? 'mdi-pencil' : 'mdi-account-plus'"
      :icon-color="isEditing ? 'warning' : 'primary'"
      max-width="800px"
      @confirm="saveVolunteer"
      @cancel="closeVolunteerDialog"
      :confirm-loading="saving"
    >
      <template #content>
        <v-form ref="volunteerForm" v-model="formValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="volunteerForm.name"
                label="Nombre Completo"
                variant="outlined"
                :rules="[v => !!v || 'El nombre es requerido']"
                required
                prepend-inner-icon="mdi-account"
                class="modern-input"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="volunteerForm.email"
                label="Correo Electrónico"
                type="email"
                variant="outlined"
                :rules="[v => !!v || 'El email es requerido', v => /.+@.+\..+/.test(v) || 'Email inválido']"
                required
                prepend-inner-icon="mdi-email"
                class="modern-input"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="volunteerForm.phone"
                label="Teléfono"
                variant="outlined"
                :rules="[v => !!v || 'El teléfono es requerido']"
                required
                prepend-inner-icon="mdi-phone"
                class="modern-input"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="volunteerForm.status"
                label="Estado"
                :items="statusOptions"
                variant="outlined"
                :rules="[v => !!v || 'El estado es requerido']"
                required
                prepend-inner-icon="mdi-account-check"
                class="modern-input"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="volunteerForm.bio"
                label="Biografía"
                variant="outlined"
                rows="3"
                class="modern-input"
                hint="Cuéntanos sobre ti y tus motivaciones para ser voluntario"
                persistent-hint
                prepend-inner-icon="mdi-text"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="volunteerForm.skills"
                label="Habilidades"
                variant="outlined"
                multiple
                chips
                closable-chips
                class="modern-input"
                prepend-inner-icon="mdi-tools"
                hint="Selecciona o agrega tus habilidades"
                persistent-hint
              ></v-combobox>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </ModernDialog>

    <!-- Delete Confirmation Dialog -->
    <ModernDialog
      v-model="deleteDialog"
      title="Confirmar Eliminación"
      subtitle="Esta acción no se puede deshacer"
      icon="mdi-delete"
      icon-color="error"
      max-width="500px"
      @confirm="deleteVolunteer"
      @cancel="deleteDialog = false"
      :confirm-loading="deleting"
      confirm-text="Eliminar"
      confirm-color="error"
      confirm-icon="mdi-delete"
    >
      <template #content>
        <v-alert type="warning" variant="tonal" class="mb-4">
          <v-icon start>mdi-alert</v-icon>
          ¿Estás seguro de que deseas eliminar al voluntario 
          <strong>{{ volunteerToDelete?.name }}</strong>?
        </v-alert>
        <p class="text-body-2 text-grey">
          Esta acción eliminará permanentemente toda la información del voluntario 
          y no se podrá recuperar.
        </p>
      </template>
    </ModernDialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import ModernCard from '@/components/ui/ModernCard.vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';

// Reactive data
const search = ref('');
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const volunteerDialog = ref(false);
const deleteDialog = ref(false);
const formValid = ref(false);
const isEditing = ref(false);
const volunteerToDelete = ref(null);

// Form data
const volunteerForm = ref({
  name: '',
  email: '',
  phone: '',
  status: '',
  bio: '',
  skills: []
});

// Mock data
const volunteers = ref([
  {
    id: 1,
    name: 'María González',
    email: 'maria@email.com',
    phone: '+57 300 123 4567',
    status: 'Activo',
    bio: 'Apasionada por el trabajo social y la educación',
    skills: ['Educación', 'Comunicación', 'Liderazgo'],
    rating: 4.5,
    hours: 120
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    phone: '+57 300 234 5678',
    status: 'Inactivo',
    bio: 'Especialista en tecnología y desarrollo comunitario',
    skills: ['Tecnología', 'Desarrollo', 'Mentoría'],
    rating: 4.2,
    hours: 95
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana@email.com',
    phone: '+57 300 345 6789',
    status: 'Activo',
    bio: 'Profesional en psicología con enfoque comunitario',
    skills: ['Psicología', 'Counselling', 'Grupos'],
    rating: 4.8,
    hours: 150
  }
]);

// Table headers
const headers = ref([
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Teléfono', key: 'phone', sortable: true },
  { title: 'Estado', key: 'status', sortable: true },
  { title: 'Habilidades', key: 'skills', sortable: false },
  { title: 'Calificación', key: 'rating', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
]);

// Options
const statusOptions = ref(['Activo', 'Inactivo', 'Suspendido', 'En Revisión']);

// Computed properties
const filteredVolunteers = computed(() => {
  if (!search.value) return volunteers.value;
  return volunteers.value.filter(v => 
    v.name.toLowerCase().includes(search.value.toLowerCase()) ||
    v.email.toLowerCase().includes(search.value.toLowerCase()) ||
    v.skills.some(skill => skill.toLowerCase().includes(search.value.toLowerCase()))
  );
});

const totalVolunteers = computed(() => volunteers.value.length);
const activeVolunteers = computed(() => volunteers.value.filter(v => v.status === 'Activo').length);
const activePercentage = computed(() => 
  totalVolunteers.value > 0 ? Math.round((activeVolunteers.value / totalVolunteers.value) * 100) : 0
);
const monthlyHours = computed(() => volunteers.value.reduce((sum, v) => sum + v.hours, 0));
const averageRating = computed(() => {
  const total = volunteers.value.reduce((sum, v) => sum + v.rating, 0);
  return total > 0 ? (total / volunteers.value.length).toFixed(1) : 0;
});
const volunteerGrowth = computed(() => 15); // Mock growth percentage

// Methods
function openAddVolunteerDialog() {
  isEditing.value = false;
  volunteerForm.value = {
    name: '',
    email: '',
    phone: '',
    status: '',
    bio: '',
    skills: []
  };
  volunteerDialog.value = true;
}

function editVolunteer(volunteer) {
  isEditing.value = true;
  volunteerForm.value = { ...volunteer };
  volunteerDialog.value = true;
}

function viewVolunteer(volunteer) {
  // TODO: Implement volunteer detail view
  console.log('View volunteer:', volunteer);
}

function evaluateVolunteer(volunteer) {
  // TODO: Implement volunteer evaluation
  console.log('Evaluate volunteer:', volunteer);
}

function confirmDeleteVolunteer(volunteer) {
  volunteerToDelete.value = volunteer;
  deleteDialog.value = true;
}

function closeVolunteerDialog() {
  volunteerDialog.value = false;
  volunteerForm.value = {
    name: '',
    email: '',
    phone: '',
    status: '',
    bio: '',
    skills: []
  };
}

async function saveVolunteer() {
  if (!formValid.value) return;
  
  saving.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isEditing.value) {
      const index = volunteers.value.findIndex(v => v.id === volunteerForm.value.id);
      if (index !== -1) {
        volunteers.value[index] = { ...volunteerForm.value };
      }
    } else {
      const newVolunteer = {
        ...volunteerForm.value,
        id: Date.now(),
        rating: 0,
        hours: 0
      };
      volunteers.value.push(newVolunteer);
    }
    
    closeVolunteerDialog();
  } catch (error) {
    console.error('Error saving volunteer:', error);
  } finally {
    saving.value = false;
  }
}

async function deleteVolunteer() {
  if (!volunteerToDelete.value) return;
  
  deleting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    volunteers.value = volunteers.value.filter(v => v.id !== volunteerToDelete.value.id);
    deleteDialog.value = false;
    volunteerToDelete.value = null;
  } catch (error) {
    console.error('Error deleting volunteer:', error);
  } finally {
    deleting.value = false;
  }
}

// Helper functions
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getAvatarColor(name) {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
  const index = name.length % colors.length;
  return colors[index];
}

function getStatusColor(status) {
  const colors = {
    'Activo': 'success',
    'Inactivo': 'grey',
    'Suspendido': 'error',
    'En Revisión': 'warning'
  };
  return colors[status] || 'grey';
}

function getStatusIcon(status) {
  const icons = {
    'Activo': 'mdi-check-circle',
    'Inactivo': 'mdi-account-off',
    'Suspendido': 'mdi-account-cancel',
    'En Revisión': 'mdi-clock-outline'
  };
  return icons[status] || 'mdi-help-circle';
}

// Lifecycle
onMounted(() => {
  // Load volunteers data
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style scoped>
/* Action button styles */
.action-btn {
  margin: 2px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.action-btn:hover {
  transform: scale(1.1) !important;
}

/* Custom styles for this view */
.volunteer-stats-card {
  transition: all 0.3s ease !important;
}

.volunteer-stats-card:hover {
  transform: translateY(-4px) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .action-btn {
    margin: 1px !important;
  }
}
</style>