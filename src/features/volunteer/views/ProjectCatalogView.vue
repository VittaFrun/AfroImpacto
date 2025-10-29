<template>
  <div class="project-catalog-view">
    <!-- Header Section -->
    <div class="page-header">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h1 class="afro-heading-2 mb-2">Catálogo de Proyectos</h1>
          <p class="afro-body-small">
            Descubre proyectos increíbles y únete como voluntario para crear un impacto positivo
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-refresh"
            @click="refreshProjects"
          >
            Actualizar
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="afro-grid afro-grid-4 mb-6">
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ publicProjects.length }}</div>
          <div class="afro-metric-label">Proyectos Activos</div>
          <div class="metric-icon">
            <v-icon size="32" color="success">mdi-check-circle</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ totalVolunteers }}</div>
          <div class="afro-metric-label">Voluntarios</div>
          <div class="metric-icon">
            <v-icon size="32" color="info">mdi-account-group</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ totalHours }}</div>
          <div class="afro-metric-label">Horas Voluntariado</div>
          <div class="metric-icon">
            <v-icon size="32" color="warning">mdi-clock-check</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ communitiesImpacted }}</div>
          <div class="afro-metric-label">Comunidades Impactadas</div>
          <div class="metric-icon">
            <v-icon size="32" color="primary">mdi-heart-multiple</v-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="afro-card afro-card-elevated mb-6">
      <div class="filters-section">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Buscar proyectos..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="locationFilter"
              :items="locationOptions"
              label="Ubicación"
              variant="outlined"
              clearable
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="categoryFilter"
              :items="categoryOptions"
              label="Categoría"
              variant="outlined"
              clearable
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Ordenar"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Projects Grid -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="afro-body mt-4">Cargando proyectos...</p>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="afro-empty-state">
      <div class="afro-empty-state-icon">
        <v-icon size="64" color="grey-lighten-1">mdi-folder-search-outline</v-icon>
      </div>
      <div class="afro-empty-state-title">No hay proyectos disponibles</div>
      <div class="afro-empty-state-description">
        {{ search ? 'No se encontraron proyectos con los filtros aplicados' : 'No hay proyectos públicos disponibles en este momento' }}
      </div>
    </div>

    <div v-else class="projects-grid">
      <div
        v-for="project in paginatedProjects"
        :key="project.id"
        class="project-card afro-card-elevated"
        @click="viewProject(project)"
      >
        <!-- Project Image -->
        <div class="project-image">
          <v-img
            :src="project.image"
            height="200px"
            cover
            class="project-cover"
          >
            <div class="project-overlay">
              <div class="project-status-chip">
                <v-chip
                  color="success"
                  size="small"
                  variant="flat"
                >
                  Disponible
                </v-chip>
              </div>
            </div>
          </v-img>
        </div>

        <!-- Project Content -->
        <div class="project-content">
          <div class="project-header">
            <h3 class="project-title">{{ project.name }}</h3>
            <div class="project-category">
              <v-chip
                :color="getCategoryColor(project.category)"
                size="small"
                variant="tonal"
              >
                {{ project.category }}
              </v-chip>
            </div>
          </div>

          <p class="project-description">{{ project.description }}</p>

          <!-- Project Meta -->
          <div class="project-meta">
            <div class="meta-item">
              <v-icon size="16" color="grey">mdi-domain</v-icon>
              <span>{{ project.organization }}</span>
            </div>
            <div class="meta-item">
              <v-icon size="16" color="grey">mdi-map-marker</v-icon>
              <span>{{ project.location }}</span>
            </div>
            <div class="meta-item">
              <v-icon size="16" color="grey">mdi-calendar</v-icon>
              <span>{{ formatDateRange(project.startDate, project.endDate) }}</span>
            </div>
          </div>

          <!-- Project Stats -->
          <div class="project-stats">
            <div class="stat-item">
              <span class="stat-value">{{ project.volunteersCount || 0 }}</span>
              <span class="stat-label">Voluntarios</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ project.budget || 0 }}</span>
              <span class="stat-label">Presupuesto</span>
            </div>
          </div>

          <!-- Project Actions -->
          <div class="project-actions">
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              @click.stop="viewProject(project)"
            >
              <v-icon start>mdi-eye</v-icon>
              Ver Detalles
            </v-btn>
            <v-btn
              color="success"
              variant="outlined"
              size="small"
              @click.stop="joinProject(project)"
              :disabled="isAlreadyJoined(project)"
            >
              <v-icon start>mdi-account-plus</v-icon>
              {{ isAlreadyJoined(project) ? 'Inscrito' : 'Inscribirse' }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        color="primary"
      ></v-pagination>
    </div>

    <!-- Project Detail Dialog -->
    <v-dialog v-model="projectDetailDialog" max-width="900px" scrollable>
      <v-card v-if="selectedProject" class="project-detail-dialog">
        <!-- Header with Image -->
        <div class="dialog-header">
          <v-img
            :src="selectedProject.image"
            height="250px"
            cover
            class="dialog-image"
          >
            <div class="image-overlay">
              <div class="project-status-badge">
                <v-chip
                  color="success"
                  size="large"
                  variant="flat"
                  prepend-icon="mdi-check-circle"
                >
                  Proyecto Disponible
                </v-chip>
              </div>
            </div>
          </v-img>
        </div>

        <!-- Content -->
        <v-card-text class="dialog-content">
          <!-- Project Title and Category -->
          <div class="project-title-section">
            <h2 class="project-title">{{ selectedProject.name }}</h2>
            <div class="project-category-badge">
              <v-chip
                :color="getCategoryColor(selectedProject.category)"
                size="large"
                variant="tonal"
                prepend-icon="mdi-tag"
              >
                {{ selectedProject.category }}
              </v-chip>
            </div>
          </div>

          <!-- Project Stats -->
          <div class="project-stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <v-icon color="primary" size="24">mdi-account-group</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ selectedProject.volunteersCount || 0 }}</div>
                  <div class="stat-label">Voluntarios</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <v-icon color="success" size="24">mdi-currency-usd</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">${{ selectedProject.budget?.toLocaleString() || '0' }}</div>
                  <div class="stat-label">Presupuesto</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <v-icon color="info" size="24">mdi-calendar-range</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ getProjectDuration(selectedProject.startDate, selectedProject.endDate) }}</div>
                  <div class="stat-label">Duración</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <v-icon color="warning" size="24">mdi-map-marker</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ selectedProject.location }}</div>
                  <div class="stat-label">Ubicación</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Description -->
          <div class="project-description-section">
            <h3 class="section-title">
              <v-icon class="mr-2" color="primary">mdi-text</v-icon>
              Descripción del Proyecto
            </h3>
            <p class="project-description-text">{{ selectedProject.description }}</p>
          </div>

          <!-- Project Objective -->
          <div class="project-objective-section">
            <h3 class="section-title">
              <v-icon class="mr-2" color="success">mdi-target</v-icon>
              Objetivo
            </h3>
            <p class="project-objective-text">{{ selectedProject.objective || 'Objetivo no especificado' }}</p>
          </div>

          <!-- Project Details -->
          <div class="project-details-section">
            <h3 class="section-title">
              <v-icon class="mr-2" color="info">mdi-information</v-icon>
              Detalles del Proyecto
            </h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-icon">
                  <v-icon color="primary">mdi-domain</v-icon>
                </div>
                <div class="detail-content">
                  <div class="detail-label">Organización</div>
                  <div class="detail-value">{{ selectedProject.organization }}</div>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">
                  <v-icon color="success">mdi-calendar-start</v-icon>
                </div>
                <div class="detail-content">
                  <div class="detail-label">Fecha de Inicio</div>
                  <div class="detail-value">{{ formatDate(selectedProject.startDate) }}</div>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">
                  <v-icon color="warning">mdi-calendar-end</v-icon>
                </div>
                <div class="detail-content">
                  <div class="detail-label">Fecha de Finalización</div>
                  <div class="detail-value">{{ formatDate(selectedProject.endDate) }}</div>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">
                  <v-icon color="info">mdi-map-marker-radius</v-icon>
                </div>
                <div class="detail-content">
                  <div class="detail-label">Ubicación Específica</div>
                  <div class="detail-value">{{ selectedProject.location }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Requirements Section -->
          <div class="project-requirements-section">
            <h3 class="section-title">
              <v-icon class="mr-2" color="purple">mdi-clipboard-list</v-icon>
              Requisitos para Participar
            </h3>
            <div class="requirements-list">
              <div class="requirement-item">
                <v-icon color="success" size="20">mdi-check-circle</v-icon>
                <span>Ser mayor de 18 años</span>
              </div>
              <div class="requirement-item">
                <v-icon color="success" size="20">mdi-check-circle</v-icon>
                <span>Disponibilidad de {{ getProjectDuration(selectedProject.startDate, selectedProject.endDate) }}</span>
              </div>
              <div class="requirement-item">
                <v-icon color="success" size="20">mdi-check-circle</v-icon>
                <span>Compromiso con la causa</span>
              </div>
              <div class="requirement-item">
                <v-icon color="success" size="20">mdi-check-circle</v-icon>
                <span>Disponibilidad para reuniones semanales</span>
              </div>
            </div>
          </div>

          <!-- Payment Information Section -->
          <div class="project-payment-section">
            <h3 class="section-title">
              <v-icon class="mr-2" color="success">mdi-cash-multiple</v-icon>
              Información de Remuneración
            </h3>
            <div class="payment-info-card">
              <div class="payment-type">
                <div class="payment-type-icon">
                  <v-icon 
                    :color="getPaymentTypeColor(selectedProject.paymentType)" 
                    size="32"
                  >
                    {{ getPaymentTypeIcon(selectedProject.paymentType) }}
                  </v-icon>
                </div>
                <div class="payment-type-content">
                  <div class="payment-type-label">Tipo de Remuneración</div>
                  <div class="payment-type-value">{{ getPaymentTypeText(selectedProject.paymentType) }}</div>
                </div>
              </div>
              
              <div v-if="selectedProject.paymentAmount" class="payment-amount">
                <div class="payment-amount-label">Monto</div>
                <div class="payment-amount-value">
                  ${{ selectedProject.paymentAmount?.toLocaleString() }}
                  <span class="payment-frequency">{{ getPaymentFrequencyText(selectedProject.paymentFrequency) }}</span>
                </div>
              </div>
              
              <div v-if="selectedProject.paymentDescription" class="payment-description">
                <div class="payment-description-label">Detalles de Pago</div>
                <div class="payment-description-text">{{ selectedProject.paymentDescription }}</div>
              </div>
              
              <div class="payment-benefits">
                <div class="payment-benefits-label">Beneficios Adicionales</div>
                <div class="payment-benefits-list">
                  <div v-if="selectedProject.includesTransport" class="benefit-item">
                    <v-icon color="success" size="20">mdi-check-circle</v-icon>
                    <span>Transporte incluido</span>
                  </div>
                  <div v-if="selectedProject.includesMeals" class="benefit-item">
                    <v-icon color="success" size="20">mdi-check-circle</v-icon>
                    <span>Alimentación incluida</span>
                  </div>
                  <div v-if="selectedProject.includesMaterials" class="benefit-item">
                    <v-icon color="success" size="20">mdi-check-circle</v-icon>
                    <span>Materiales de trabajo incluidos</span>
                  </div>
                  <div v-if="selectedProject.includesInsurance" class="benefit-item">
                    <v-icon color="success" size="20">mdi-check-circle</v-icon>
                    <span>Seguro de accidentes incluido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Benefits Section -->
          <div class="project-benefits-section">
            <h3 class="section-title">
              <v-icon class="mr-2" color="orange">mdi-gift</v-icon>
              Beneficios de Participar
            </h3>
            <div class="benefits-grid">
              <div class="benefit-item">
                <v-icon color="primary" size="24">mdi-certificate</v-icon>
                <span>Certificado de participación</span>
              </div>
              <div class="benefit-item">
                <v-icon color="success" size="24">mdi-account-heart</v-icon>
                <span>Experiencia en trabajo social</span>
              </div>
              <div class="benefit-item">
                <v-icon color="info" size="24">mdi-account-group</v-icon>
                <span>Red de contactos profesionales</span>
              </div>
              <div class="benefit-item">
                <v-icon color="warning" size="24">mdi-heart</v-icon>
                <span>Impacto positivo en la comunidad</span>
              </div>
            </div>
          </div>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="dialog-actions">
          <v-btn
            color="grey"
            variant="outlined"
            @click="projectDetailDialog = false"
            prepend-icon="mdi-close"
          >
            Cerrar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            variant="flat"
            size="large"
            @click="joinProject(selectedProject)"
            :disabled="isAlreadyJoined(selectedProject)"
            prepend-icon="mdi-account-plus"
          >
            {{ isAlreadyJoined(selectedProject) ? 'Ya estás inscrito' : 'Inscribirse al Proyecto' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Reactive data
const loading = ref(false);
const search = ref('');
const locationFilter = ref('');
const categoryFilter = ref('');
const sortBy = ref('name');
const currentPage = ref(1);
const itemsPerPage = ref(9);
const projectDetailDialog = ref(false);
const selectedProject = ref(null);
const joinedProjects = ref([]);

// Mock data - replace with real data from API
const publicProjects = ref([
  {
    id: 1,
    name: 'Educación Comunitaria',
    description: 'Programa de alfabetización para adultos en comunidades afrodescendientes',
    objective: 'Reducir el analfabetismo en comunidades vulnerables',
    organization: 'Fundación Esperanza',
    location: 'Bogotá, Colombia',
    category: 'Educación',
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    budget: 5000000,
    volunteersCount: 15,
    image: '/src/assets/images/education-project.jpg',
    // Payment Information
    paymentType: 'stipend',
    paymentAmount: 800000,
    paymentFrequency: 'monthly',
    paymentDescription: 'Estipendio mensual por participación activa en el programa educativo',
    includesTransport: true,
    includesMeals: true,
    includesMaterials: true,
    includesInsurance: false
  },
  {
    id: 2,
    name: 'Salud Preventiva',
    description: 'Campaña de vacunación infantil y educación en salud',
    objective: 'Mejorar la salud infantil en comunidades rurales',
    organization: 'Salud para Todos',
    location: 'Medellín, Colombia',
    category: 'Salud',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    budget: 3000000,
    volunteersCount: 12,
    image: '/src/assets/images/health-project.jpg',
    // Payment Information
    paymentType: 'volunteer',
    paymentAmount: 0,
    paymentFrequency: 'none',
    paymentDescription: 'Proyecto de voluntariado sin remuneración económica',
    includesTransport: true,
    includesMeals: false,
    includesMaterials: true,
    includesInsurance: true
  },
  {
    id: 3,
    name: 'Desarrollo Económico',
    description: 'Talleres de emprendimiento y microfinanzas',
    objective: 'Fomentar el emprendimiento en comunidades',
    organization: 'Emprende Juntos',
    location: 'Cali, Colombia',
    category: 'Trabajo Social',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    budget: 8000000,
    volunteersCount: 20,
    image: '/src/assets/images/economic-project.jpg',
    // Payment Information
    paymentType: 'salary',
    paymentAmount: 1200000,
    paymentFrequency: 'monthly',
    paymentDescription: 'Salario mensual por coordinación de talleres y capacitaciones',
    includesTransport: true,
    includesMeals: true,
    includesMaterials: true,
    includesInsurance: true
  },
  {
    id: 4,
    name: 'Cultura y Tradición',
    description: 'Preservación de tradiciones afrodescendientes',
    objective: 'Mantener vivas las tradiciones culturales',
    organization: 'Raíces Culturales',
    location: 'Cartagena, Colombia',
    category: 'Cultura',
    startDate: '2024-04-01',
    endDate: '2024-12-31',
    budget: 2000000,
    volunteersCount: 8,
    image: '/src/assets/images/culture-project.jpg',
    // Payment Information
    paymentType: 'honorarium',
    paymentAmount: 500000,
    paymentFrequency: 'project',
    paymentDescription: 'Honorario por proyecto al finalizar las actividades culturales',
    includesTransport: false,
    includesMeals: true,
    includesMaterials: true,
    includesInsurance: false
  },
  {
    id: 5,
    name: 'Medio Ambiente',
    description: 'Conservación de ecosistemas locales',
    objective: 'Proteger el medio ambiente local',
    organization: 'Verde Futuro',
    location: 'Santa Marta, Colombia',
    category: 'Medio Ambiente',
    startDate: '2024-05-01',
    endDate: '2024-10-31',
    budget: 4000000,
    volunteersCount: 18,
    image: '/src/assets/images/environment-project.jpg',
    // Payment Information
    paymentType: 'stipend',
    paymentAmount: 600000,
    paymentFrequency: 'monthly',
    paymentDescription: 'Estipendio mensual por participación en actividades de conservación',
    includesTransport: true,
    includesMeals: false,
    includesMaterials: true,
    includesInsurance: true
  },
  {
    id: 6,
    name: 'Tecnología Social',
    description: 'Capacitación en herramientas digitales',
    objective: 'Reducir la brecha digital',
    organization: 'Tech Solidario',
    location: 'Barranquilla, Colombia',
    category: 'Tecnología',
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    budget: 6000000,
    volunteersCount: 25,
    image: '/src/assets/images/tech-project.jpg',
    // Payment Information
    paymentType: 'salary',
    paymentAmount: 1500000,
    paymentFrequency: 'monthly',
    paymentDescription: 'Salario mensual por capacitación en tecnologías digitales',
    includesTransport: true,
    includesMeals: true,
    includesMaterials: true,
    includesInsurance: true
  }
]);

// Computed properties
const categoryOptions = computed(() => {
  const categories = [...new Set(publicProjects.value.map(p => p.category))];
  return categories;
});

const sortOptions = computed(() => [
  { title: 'Nombre', value: 'name' },
  { title: 'Fecha de inicio', value: 'startDate' },
  { title: 'Presupuesto', value: 'budget' },
  { title: 'Ubicación', value: 'location' }
]);

const locationOptions = computed(() => {
  const locations = [...new Set(publicProjects.value.map(p => p.location))];
  return locations;
});

const filteredProjects = computed(() => {
  let filtered = [...publicProjects.value];

  // Search filter
  if (search.value) {
    const query = search.value.toLowerCase();
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.location.toLowerCase().includes(query) ||
      project.organization.toLowerCase().includes(query)
    );
  }

  // Location filter
  if (locationFilter.value) {
    filtered = filtered.filter(project => project.location === locationFilter.value);
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(project => project.category === categoryFilter.value);
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'startDate':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'budget':
        return b.budget - a.budget;
      case 'location':
        return a.location.localeCompare(b.location);
      default:
        return 0;
    }
  });

  return filtered;
});

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProjects.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / itemsPerPage.value);
});

const totalVolunteers = computed(() => {
  return publicProjects.value.reduce((sum, p) => sum + (p.volunteersCount || 0), 0);
});

const totalHours = computed(() => {
  return publicProjects.value.reduce((sum, p) => sum + Math.floor(Math.random() * 500), 0);
});

const communitiesImpacted = computed(() => {
  return publicProjects.value.length * 3;
});

// Methods
function viewProject(project) {
  selectedProject.value = project;
  projectDetailDialog.value = true;
}

function joinProject(project) {
  if (!isAlreadyJoined(project)) {
    joinedProjects.value.push(project.id);
    console.log('Joined project:', project.name);
    // Show success message
  }
}

function isAlreadyJoined(project) {
  return project && joinedProjects.value.includes(project.id);
}

function refreshProjects() {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

function getCategoryColor(category) {
  const colorMap = {
    'Educación': 'primary',
    'Salud': 'success',
    'Trabajo Social': 'info',
    'Cultura': 'warning',
    'Medio Ambiente': 'success',
    'Tecnología': 'purple'
  };
  return colorMap[category] || 'grey';
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Fechas no especificadas';
  const start = new Date(startDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
  const end = new Date(endDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
  return `${start} - ${end}`;
}

function formatDate(date) {
  if (!date) return 'Fecha no especificada';
  return new Date(date).toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function getProjectDuration(startDate, endDate) {
  if (!startDate || !endDate) return 'No especificado';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} días`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} mes${months > 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} año${years > 1 ? 's' : ''}`;
  }
}

// Payment Information Functions
function getPaymentTypeText(paymentType) {
  const types = {
    'volunteer': 'Voluntariado',
    'stipend': 'Estipendio',
    'salary': 'Salario',
    'honorarium': 'Honorario',
    'commission': 'Comisión',
    'bonus': 'Bono'
  };
  return types[paymentType] || 'No especificado';
}

function getPaymentTypeIcon(paymentType) {
  const icons = {
    'volunteer': 'mdi-heart',
    'stipend': 'mdi-cash',
    'salary': 'mdi-bank',
    'honorarium': 'mdi-gift',
    'commission': 'mdi-percent',
    'bonus': 'mdi-star'
  };
  return icons[paymentType] || 'mdi-cash';
}

function getPaymentTypeColor(paymentType) {
  const colors = {
    'volunteer': 'grey',
    'stipend': 'success',
    'salary': 'primary',
    'honorarium': 'warning',
    'commission': 'info',
    'bonus': 'purple'
  };
  return colors[paymentType] || 'grey';
}

function getPaymentFrequencyText(frequency) {
  const frequencies = {
    'none': '',
    'daily': '/día',
    'weekly': '/semana',
    'monthly': '/mes',
    'project': '/proyecto',
    'hourly': '/hora'
  };
  return frequencies[frequency] || '';
}

onMounted(() => {
  // Load projects data
  console.log('ProjectCatalogView mounted');
});
</script>

<style scoped>
.project-catalog-view {
  padding: var(--afro-space-lg);
  background: var(--afro-background);
  min-height: 100vh;
}

/* Page Header */
.page-header {
  margin-bottom: var(--afro-space-xl);
}

.header-actions {
  display: flex;
  gap: var(--afro-space-md);
}

/* Metrics Cards */
.afro-metric-card {
  padding: var(--afro-space-lg);
  text-align: center;
  position: relative;
}

.metric-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--afro-space-sm);
}

.metric-icon {
  position: absolute;
  top: var(--afro-space-md);
  right: var(--afro-space-md);
  opacity: 0.1;
}

/* Filters Section */
.filters-section {
  padding: var(--afro-space-lg);
}

/* Loading and Error States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--afro-space-3xl);
  text-align: center;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--afro-space-lg);
  margin-bottom: var(--afro-space-xl);
}

.project-card {
  cursor: pointer;
  transition: all var(--afro-transition-normal);
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--afro-shadow-xl);
}

.project-image {
  position: relative;
}

.project-cover {
  transition: transform var(--afro-transition-normal);
}

.project-card:hover .project-cover {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: var(--afro-space-md);
  right: var(--afro-space-md);
}

.project-content {
  padding: var(--afro-space-lg);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--afro-space-md);
}

.project-title {
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin: 0;
  flex: 1;
  margin-right: var(--afro-space-md);
}

.project-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--afro-space-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-xs);
  margin-bottom: var(--afro-space-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--afro-space-xs);
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

.project-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--afro-space-md);
  padding: var(--afro-space-sm);
  background: var(--afro-secondary-50);
  border-radius: var(--afro-radius-md);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-primary);
}

.stat-label {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

.project-actions {
  display: flex;
  gap: var(--afro-space-sm);
  flex-wrap: wrap;
}

/* Project Detail Dialog */
.project-detail-dialog {
  border-radius: var(--afro-radius-xl);
  overflow: hidden;
}

.dialog-header {
  position: relative;
}

.dialog-image {
  border-radius: 0;
}

.image-overlay {
  position: absolute;
  top: var(--afro-space-lg);
  right: var(--afro-space-lg);
}

.project-status-badge {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--afro-radius-lg);
  padding: var(--afro-space-xs);
}

.dialog-content {
  padding: var(--afro-space-xl);
}

.project-title-section {
  margin-bottom: var(--afro-space-xl);
  text-align: center;
}

.project-title {
  font-size: var(--afro-text-2xl);
  font-weight: 700;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-md);
  line-height: 1.2;
}

.project-category-badge {
  display: flex;
  justify-content: center;
}

.project-stats-section {
  margin-bottom: var(--afro-space-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--afro-space-lg);
}

.stat-card {
  display: flex;
  align-items: center;
  padding: var(--afro-space-lg);
  background: var(--afro-surface);
  border-radius: var(--afro-radius-lg);
  border: 1px solid var(--afro-border);
  transition: all var(--afro-transition-fast);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--afro-shadow-md);
}

.stat-icon {
  margin-right: var(--afro-space-md);
  padding: var(--afro-space-sm);
  background: var(--afro-primary-50);
  border-radius: var(--afro-radius-md);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--afro-text-lg);
  font-weight: 700;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.stat-label {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title {
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-md);
  display: flex;
  align-items: center;
}

.project-description-section,
.project-objective-section,
.project-details-section,
.project-requirements-section,
.project-payment-section,
.project-benefits-section {
  margin-bottom: var(--afro-space-xl);
}

.project-description-text,
.project-objective-text {
  font-size: var(--afro-text-base);
  color: var(--afro-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--afro-space-lg);
}

.detail-item {
  display: flex;
  align-items: center;
  padding: var(--afro-space-md);
  background: var(--afro-surface);
  border-radius: var(--afro-radius-md);
  border: 1px solid var(--afro-border);
}

.detail-icon {
  margin-right: var(--afro-space-md);
  padding: var(--afro-space-sm);
  background: var(--afro-secondary-50);
  border-radius: var(--afro-radius-sm);
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: var(--afro-space-sm);
  padding: var(--afro-space-sm);
  background: var(--afro-success-50);
  border-radius: var(--afro-radius-md);
  border-left: 4px solid var(--afro-success);
}

.requirement-item span {
  font-size: var(--afro-text-base);
  color: var(--afro-text-primary);
}

/* Payment Information Styles */
.payment-info-card {
  background: var(--afro-surface);
  border-radius: var(--afro-radius-lg);
  border: 1px solid var(--afro-border);
  padding: var(--afro-space-lg);
}

.payment-type {
  display: flex;
  align-items: center;
  margin-bottom: var(--afro-space-lg);
  padding-bottom: var(--afro-space-lg);
  border-bottom: 1px solid var(--afro-border);
}

.payment-type-icon {
  margin-right: var(--afro-space-md);
  padding: var(--afro-space-md);
  background: var(--afro-success-50);
  border-radius: var(--afro-radius-md);
}

.payment-type-content {
  flex: 1;
}

.payment-type-label {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-type-value {
  font-size: var(--afro-text-lg);
  font-weight: 700;
  color: var(--afro-text-primary);
}

.payment-amount {
  margin-bottom: var(--afro-space-lg);
  padding-bottom: var(--afro-space-lg);
  border-bottom: 1px solid var(--afro-border);
}

.payment-amount-label {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-amount-value {
  font-size: var(--afro-text-2xl);
  font-weight: 700;
  color: var(--afro-success);
  display: flex;
  align-items: baseline;
  gap: var(--afro-space-xs);
}

.payment-frequency {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  font-weight: 500;
}

.payment-description {
  margin-bottom: var(--afro-space-lg);
  padding-bottom: var(--afro-space-lg);
  border-bottom: 1px solid var(--afro-border);
}

.payment-description-label {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-description-text {
  font-size: var(--afro-text-base);
  color: var(--afro-text-primary);
  line-height: 1.5;
}

.payment-benefits-label {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-benefits-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-sm);
}

.payment-benefits-list .benefit-item {
  display: flex;
  align-items: center;
  gap: var(--afro-space-sm);
  padding: var(--afro-space-sm);
  background: var(--afro-success-50);
  border-radius: var(--afro-radius-md);
  border-left: 4px solid var(--afro-success);
}

.payment-benefits-list .benefit-item span {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-primary);
  font-weight: 500;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--afro-space-md);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--afro-space-sm);
  padding: var(--afro-space-md);
  background: var(--afro-surface);
  border-radius: var(--afro-radius-md);
  border: 1px solid var(--afro-border);
  transition: all var(--afro-transition-fast);
}

.benefit-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--afro-shadow-sm);
}

.benefit-item span {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-primary);
  font-weight: 500;
}

.dialog-actions {
  padding: var(--afro-space-lg) var(--afro-space-xl);
  background: var(--afro-surface);
  border-top: 1px solid var(--afro-border);
}

/* Responsive Design for Dialog */
@media (max-width: 768px) {
  .dialog-content {
    padding: var(--afro-space-lg);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .project-title {
    font-size: var(--afro-text-xl);
  }
  
  .dialog-actions {
    padding: var(--afro-space-md);
    flex-direction: column;
    gap: var(--afro-space-sm);
  }
  
  .dialog-actions .v-btn {
    width: 100%;
  }
  
  .payment-type {
    flex-direction: column;
    text-align: center;
  }
  
  .payment-type-icon {
    margin-right: 0;
    margin-bottom: var(--afro-space-sm);
  }
  
  .payment-amount-value {
    font-size: var(--afro-text-xl);
    justify-content: center;
  }
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--afro-space-xl);
}

/* Responsive Design */
@media (max-width: 768px) {
  .project-catalog-view {
    padding: var(--afro-space-md);
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .afro-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--afro-space-md);
  }
  
  .header-actions {
    width: 100%;
  }
  
  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-title {
    margin-right: 0;
    margin-bottom: var(--afro-space-sm);
  }
  
  .project-actions {
    flex-direction: column;
  }
  
  .project-actions .v-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .afro-grid-4 {
    grid-template-columns: 1fr;
  }
}
</style>