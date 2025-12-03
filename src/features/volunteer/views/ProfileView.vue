<template>
  <div class="profile-view">
    <!-- Header Section -->
    <div class="page-header">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h1 class="afro-heading-2 mb-2">Mi Perfil de Voluntario</h1>
          <p class="afro-body-small">
            Mantén tu información actualizada para mejores oportunidades
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-download"
            class="professional-outlined-btn"
            @click="exportProfile"
          >
            Exportar Perfil
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Profile Overview Card -->
    <div class="afro-card afro-card-elevated mb-6">
      <div class="profile-overview">
        <div class="profile-avatar-section">
          <v-avatar size="120" color="primary" class="profile-avatar">
            <v-img
              v-if="profile.avatar"
              :src="profile.avatar"
              alt="Avatar del usuario"
            ></v-img>
            <v-icon v-else size="64" color="white">mdi-account</v-icon>
          </v-avatar>
          <v-btn
            icon
            variant="outlined"
            size="small"
            class="avatar-edit-btn"
            @click="editAvatar"
          >
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </div>
        
        <div class="profile-info">
          <h2 class="profile-name">{{ profile.nombre || 'Nombre no especificado' }}</h2>
          <p class="profile-email">{{ profile.email }}</p>
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{ profileStats.projectsCompleted }}</span>
              <span class="stat-label">Proyectos Completados</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profileStats.hoursVolunteered }}</span>
              <span class="stat-label">Horas Voluntariado</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profileStats.skillsCount }}</span>
              <span class="stat-label">Habilidades</span>
            </div>
          </div>
        </div>
        
        <div class="profile-status">
          <v-chip
            :color="getStatusColor(profile.estado)"
            size="large"
            variant="flat"
          >
            <v-icon start>{{ getStatusIcon(profile.estado) }}</v-icon>
            {{ profile.estado || 'Activo' }}
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <v-card class="afro-card-elevated">
      <v-tabs v-model="activeTab" bg-color="transparent" color="primary" class="profile-tabs">
        <v-tab value="personal" class="profile-tab">
          <v-icon start color="primary-light">mdi-account</v-icon>
          Información Personal
        </v-tab>
        <v-tab value="skills" class="profile-tab">
          <v-icon start color="success-light">mdi-school</v-icon>
          Habilidades
        </v-tab>
        <v-tab value="availability" class="profile-tab">
          <v-icon start color="info-light">mdi-calendar</v-icon>
          Disponibilidad
        </v-tab>
        <v-tab value="portfolio" class="profile-tab">
          <v-icon start color="warning-light">mdi-briefcase</v-icon>
          Portfolio
        </v-tab>
        <v-tab value="achievements" class="profile-tab">
          <v-icon start color="accent-light">mdi-trophy</v-icon>
          Logros y Certificados
        </v-tab>
      </v-tabs>
      
      <v-divider></v-divider>
      
      <v-window v-model="activeTab">
        <!-- Personal Information Tab -->
        <v-window-item value="personal">
          <div class="tab-content">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.nombre"
                  label="Nombre Completo"
                  prepend-icon="mdi-account"
                  :rules="[v => !!v || 'El nombre es requerido']"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.email"
                  label="Correo Electrónico"
                  prepend-icon="mdi-email"
                  readonly
                  disabled
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.telefono"
                  label="Teléfono"
                  prepend-icon="mdi-phone"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.ubicacion"
                  label="Ubicación"
                  prepend-icon="mdi-map-marker"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="profile.jornada"
                  :items="jornadaOptions"
                  label="Jornada Preferida"
                  prepend-icon="mdi-clock"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="profile.estado"
                  :items="estadoOptions"
                  label="Estado Actual"
                  prepend-icon="mdi-account-check"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="profile.biografia"
                  label="Biografía"
                  prepend-icon="mdi-text"
                  :rows="4"
                  placeholder="Cuéntanos sobre ti, tus intereses y motivaciones..."
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  auto-grow
                />
              </v-col>
            </v-row>
            
            <div class="form-actions">
              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-content-save"
                class="professional-save-btn"
                @click="savePersonalInfo"
                :loading="saving"
              >
                Guardar Información
              </v-btn>
              <v-btn
                variant="outlined"
                prepend-icon="mdi-refresh"
                @click="resetForm"
              >
                Restablecer
              </v-btn>
            </div>
          </div>
        </v-window-item>

        <!-- Skills Tab -->
        <v-window-item value="skills">
          <div class="tab-content">
            <!-- Add New Skill -->
            <div class="afro-card mb-6">
              <div class="card-header-professional">
                <div class="header-icon">
                  <v-icon color="primary">mdi-school-outline</v-icon>
                </div>
                <div class="header-content">
                  <h3 class="card-title">Agregar Nueva Habilidad</h3>
                  <p class="card-subtitle">Completa los datos de tu nueva habilidad</p>
                </div>
              </div>
              <div class="card-content">
                <v-row>
              <v-col cols="12" md="5">
                    <v-text-field
                      v-model="newSkill.name"
                      label="Nombre de la habilidad"
                      variant="outlined"
                      prepend-inner-icon="mdi-school"
                    ></v-text-field>
              </v-col>
                  <v-col cols="12" md="3">
                <v-select
                      v-model="newSkill.level"
                      :items="skillLevels"
                  label="Nivel"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                    <v-select
                      v-model="newSkill.category"
                      :items="skillCategories"
                      label="Categoría"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-btn
                      color="success"
                      variant="flat"
                      block
                      @click="addSkill"
                      :disabled="!newSkill.name"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
              </v-col>
            </v-row>
              </div>
            </div>

            <!-- Skills List -->
              <div class="skills-section">
                <div class="section-header-professional">
                  <div class="header-content">
                    <h3 class="section-title">
                      <v-icon class="title-icon" color="primary">mdi-account-star-outline</v-icon>
                      Mis Habilidades
                    </h3>
                    <p class="section-subtitle">Gestiona tus habilidades y competencias profesionales</p>
                  </div>
                  <div class="header-badge">
                    <v-chip color="primary" variant="tonal" size="large">
                      <v-icon start>mdi-school</v-icon>
                      {{ skills.length }} habilidades
                    </v-chip>
                  </div>
                </div>
              
              <div v-if="skills.length === 0" class="afro-empty-state">
                <div class="afro-empty-state-icon">
                  <v-icon size="48" color="grey-lighten-1">mdi-school-outline</v-icon>
                </div>
                <div class="afro-empty-state-title">Sin habilidades registradas</div>
                <div class="afro-empty-state-description">
                  Agrega tus habilidades para mejores coincidencias con proyectos
                </div>
              </div>
              
              <div v-else class="skills-grid">
                <div
                  v-for="skill in skills"
                  :key="skill.id"
                  class="skill-card afro-card"
                >
                  <div class="skill-header">
                    <div class="skill-info">
                      <h4 class="skill-name">{{ skill.name }}</h4>
                      <v-chip
                        :color="getSkillCategoryColor(skill.category)"
                        size="small"
                        variant="tonal"
                      >
                        {{ skill.category }}
                      </v-chip>
                    </div>
                    <div class="skill-actions">
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        @click="editSkill(skill)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        color="error"
                        @click="deleteSkill(skill.id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  
                  <div class="skill-progress">
                    <div class="progress-header">
                      <span class="progress-label">{{ skill.level }}</span>
                      <span class="progress-percentage">{{ skill.progress }}%</span>
                    </div>
                    <v-progress-linear
                      :model-value="skill.progress"
                      :color="getSkillLevelColor(skill.level)"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>
                  
                  <div class="skill-description">
                    <p>{{ skill.description || 'Sin descripción' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Availability Tab -->
        <v-window-item value="availability">
          <div class="tab-content">
            <div class="availability-section">
              <!-- Header Section -->
              <div class="availability-header">
                <div class="header-content">
                  <h2 class="section-title">
                    <v-icon class="title-icon" color="primary">mdi-calendar-clock</v-icon>
                    Mi Disponibilidad
                  </h2>
                  <p class="section-subtitle">Configura tus horarios y días preferidos para participar en proyectos</p>
                </div>
                <div class="header-stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ availability.schedules.length }}</div>
                    <div class="stat-label">Horarios</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ availability.days.length }}</div>
                    <div class="stat-label">Días</div>
                  </div>
                </div>
              </div>

              <!-- Availability Cards -->
              <div class="availability-cards">
                <div class="availability-card">
                  <div class="card-header-professional">
                    <div class="header-icon">
                      <v-icon color="primary">mdi-clock-outline</v-icon>
                    </div>
                    <div class="header-content">
                      <h3 class="card-title">Horarios Preferidos</h3>
                      <p class="card-subtitle">Selecciona los horarios en los que prefieres trabajar</p>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="checkbox-group">
                      <v-checkbox
                        v-for="schedule in scheduleOptions"
                        :key="schedule.value"
                        v-model="availability.schedules"
                        :value="schedule.value"
                        :label="schedule.label"
                        color="primary"
                        class="availability-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </div>
                
                <div class="availability-card">
                  <div class="card-header-professional">
                    <div class="header-icon">
                      <v-icon color="primary">mdi-calendar-week</v-icon>
                    </div>
                    <div class="header-content">
                      <h3 class="card-title">Días de la Semana</h3>
                      <p class="card-subtitle">Elige los días en los que estás disponible</p>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="checkbox-group">
                      <v-checkbox
                        v-for="day in weekDays"
                        :key="day.value"
                        v-model="availability.days"
                        :value="day.value"
                        :label="day.label"
                        color="primary"
                        class="availability-checkbox"
                      ></v-checkbox>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Actions Section -->
              <div class="availability-actions-professional">
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-calendar-check"
                  class="professional-save-btn"
                  @click="saveAvailability"
                  :loading="saving"
                >
                  Guardar Disponibilidad
                </v-btn>
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-refresh"
                  @click="resetAvailability"
                >
                  Restablecer
                </v-btn>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Portfolio Tab -->
        <v-window-item value="portfolio">
            <div class="tab-content">
              <div class="portfolio-section">
                <div class="section-header-professional">
                  <div class="header-content">
                    <h3 class="section-title">
                      <v-icon class="title-icon" color="primary">mdi-briefcase-outline</v-icon>
                      Mi Portfolio
                    </h3>
                    <p class="section-subtitle">Muestra tus proyectos y trabajos más destacados</p>
                  </div>
                </div>
              
              <div v-if="portfolio.length === 0" class="afro-empty-state">
                <div class="afro-empty-state-icon">
                  <v-icon size="48" color="grey-lighten-1">mdi-briefcase-outline</v-icon>
                </div>
                <div class="afro-empty-state-title">Sin proyectos en portfolio</div>
                <div class="afro-empty-state-description">
                  Los proyectos completados aparecerán aquí
                </div>
              </div>
              
              <div v-else class="portfolio-grid">
                <div
                  v-for="item in portfolio"
                  :key="item.id"
                  class="portfolio-item afro-card"
                >
                  <div class="portfolio-image">
                    <v-img
                      :src="item.image"
                      height="150px"
                      cover
                    ></v-img>
                  </div>
                  <div class="portfolio-content">
                    <h4 class="portfolio-title">{{ item.title }}</h4>
                    <p class="portfolio-description">{{ item.description }}</p>
                    <div class="portfolio-meta">
                      <span class="portfolio-date">{{ formatDate(item.date) }}</span>
                      <v-chip
                        :color="getProjectStatusColor(item.status)"
                        size="small"
                        variant="tonal"
                      >
                        {{ item.status }}
            </v-chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Achievements Tab -->
        <v-window-item value="achievements">
          <div class="tab-content">
            <div class="achievements-section">
              <!-- Points Summary -->
              <v-card variant="outlined" class="mb-4">
                <v-card-text>
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-caption text-grey mb-1">Puntos Totales</div>
                      <div class="text-h4 font-weight-bold text-primary">{{ totalPoints }}</div>
                    </div>
                    <v-icon size="64" color="warning">mdi-star-circle</v-icon>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Certificates Section -->
              <div class="section-header-professional mb-4">
                <div class="header-content">
                  <h3 class="section-title">
                    <v-icon class="title-icon" color="primary">mdi-certificate</v-icon>
                    Mis Certificados
                  </h3>
                  <p class="section-subtitle">Certificados obtenidos por tu participación en proyectos</p>
                </div>
              </div>

              <div v-if="loadingCertificados" class="text-center py-8">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <div v-else-if="certificados.length === 0" class="afro-empty-state mb-6">
                <div class="afro-empty-state-icon">
                  <v-icon size="48" color="grey-lighten-1">mdi-certificate-outline</v-icon>
                </div>
                <div class="afro-empty-state-title">Sin certificados</div>
                <div class="afro-empty-state-description">
                  Los certificados aparecerán aquí cuando completes proyectos
                </div>
              </div>
              <div v-else class="certificates-grid mb-6">
                <v-card
                  v-for="certificado in certificados"
                  :key="certificado.id_certificado"
                  variant="outlined"
                  class="certificate-card"
                >
                  <v-card-text>
                    <div class="d-flex align-start gap-3">
                      <v-icon size="40" color="primary">mdi-certificate</v-icon>
                      <div class="flex-grow-1">
                        <h4 class="text-h6 mb-1">{{ certificado.nombre }}</h4>
                        <p class="text-body-2 text-grey mb-2">{{ certificado.descripcion }}</p>
                        <div class="d-flex align-center gap-2 mb-2">
                          <v-chip size="small" variant="tonal" color="primary">
                            {{ certificado.tipo }}
                          </v-chip>
                          <span class="text-caption text-grey">
                            Emitido: {{ formatDate(certificado.fecha_emision) }}
                          </span>
                        </div>
                        <div v-if="certificado.codigo_verificacion" class="text-caption text-grey">
                          Código: {{ certificado.codigo_verificacion }}
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Achievements Section -->
              <div class="section-header-professional mb-4">
                <div class="header-content">
                  <h3 class="section-title">
                    <v-icon class="title-icon" color="warning">mdi-trophy-outline</v-icon>
                    Mis Logros
                  </h3>
                  <p class="section-subtitle">Reconoce tus logros y logros obtenidos</p>
                </div>
              </div>

              <div v-if="loadingLogros" class="text-center py-8">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <div v-else-if="voluntarioLogros.length === 0" class="afro-empty-state">
                <div class="afro-empty-state-icon">
                  <v-icon size="48" color="grey-lighten-1">mdi-trophy-outline</v-icon>
                </div>
                <div class="afro-empty-state-title">Sin logros obtenidos</div>
                <div class="afro-empty-state-description">
                  Los logros aparecerán aquí conforme completes proyectos
                </div>
              </div>
              <div v-else class="achievements-grid">
                <v-card
                  v-for="voluntarioLogro in voluntarioLogros"
                  :key="voluntarioLogro.id_voluntario_logro"
                  variant="outlined"
                  class="achievement-card"
                >
                  <v-card-text>
                    <div class="d-flex align-start gap-3">
                      <v-icon
                        :icon="voluntarioLogro.logro?.icono || 'mdi-trophy'"
                        size="40"
                        :color="getLogroColor(voluntarioLogro.logro?.tipo)"
                      ></v-icon>
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between mb-1">
                          <h4 class="text-h6">{{ voluntarioLogro.logro?.nombre }}</h4>
                          <v-chip size="small" variant="tonal" color="warning" v-if="voluntarioLogro.logro?.puntos">
                            +{{ voluntarioLogro.logro.puntos }} pts
                          </v-chip>
                        </div>
                        <p class="text-body-2 text-grey mb-2">{{ voluntarioLogro.logro?.descripcion }}</p>
                        <div class="d-flex align-center gap-2">
                          <v-chip size="small" variant="tonal" :color="getLogroColor(voluntarioLogro.logro?.tipo)">
                            {{ voluntarioLogro.logro?.tipo }}
                          </v-chip>
                          <span class="text-caption text-grey">
                            Obtenido: {{ formatDate(voluntarioLogro.fecha_obtenido) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useCertificadoStore } from '@/features/volunteer/stores/certificadoStore';
import { useLogroStore } from '@/features/volunteer/stores/logroStore';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const certificadoStore = useCertificadoStore();
const logroStore = useLogroStore();
const volunteerStore = useVolunteerStore();

const { certificados, loading: loadingCertificados } = storeToRefs(certificadoStore);
const { voluntarioLogros, loading: loadingLogros } = storeToRefs(logroStore);

const totalPoints = computed(() => {
  return voluntarioLogros.value.reduce((total, vl) => total + (vl.logro?.puntos || 0), 0);
});

// Reactive data
const activeTab = ref('personal');
const saving = ref(false);

// Profile data
const profile = ref({
  nombre: user.value?.nombre || '',
  email: user.value?.email || '',
  telefono: '',
  ubicacion: '',
  jornada: 'Flexible',
  estado: 'Activo',
  biografia: '',
  avatar: null
});

// Profile stats
const profileStats = ref({
  projectsCompleted: 3,
  hoursVolunteered: 156,
  skillsCount: 8
});

// Skills data
const skills = ref([
  {
    id: 1,
    name: 'Educación',
    level: 'Experto',
    category: 'Educación',
    progress: 90,
    description: 'Experiencia en enseñanza y desarrollo educativo'
  },
  {
    id: 2,
    name: 'Comunicación',
    level: 'Intermedio',
    category: 'Habilidades Blandas',
    progress: 70,
    description: 'Comunicación efectiva y trabajo en equipo'
  },
  {
    id: 3,
    name: 'Organización',
    level: 'Avanzado',
    category: 'Gestión',
    progress: 85,
    description: 'Planificación y organización de proyectos'
  },
  {
    id: 4,
    name: 'Liderazgo',
    level: 'Intermedio',
    category: 'Habilidades Blandas',
    progress: 60,
    description: 'Liderazgo de equipos y coordinación'
  }
]);

const newSkill = ref({
  name: '',
  level: 'Intermedio',
  category: 'Habilidades Blandas'
});

// Availability data
const availability = ref({
  schedules: ['Mañana', 'Tarde'],
  days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
});

// Portfolio data
const portfolio = ref([
  {
    id: 1,
    title: 'Educación Comunitaria',
    description: 'Programa de alfabetización para adultos',
    image: '/src/assets/images/education-project.jpg',
    date: '2024-01-15',
    status: 'Completado'
  },
  {
    id: 2,
    title: 'Salud Preventiva',
    description: 'Campaña de vacunación infantil',
    image: '/src/assets/images/health-project.jpg',
    date: '2024-02-01',
    status: 'En Progreso'
  }
]);

const getLogroColor = (tipo) => {
  const colorMap = {
    'proyecto': 'primary',
    'horas': 'success',
    'tareas': 'info',
    'especial': 'warning',
    'default': 'grey'
  };
  return colorMap[tipo] || colorMap.default;
};

// Options
const jornadaOptions = [
  'Completa',
  'Media Jornada',
  'Flexible',
  'Fines de Semana'
];

const estadoOptions = [
  'Activo',
  'Inactivo',
  'Disponible',
  'Ocupado'
];

const skillLevels = [
  'Principiante',
  'Intermedio',
  'Avanzado',
  'Experto'
];

const skillCategories = [
  'Educación',
  'Salud',
  'Tecnología',
  'Arte y Cultura',
  'Deportes',
  'Habilidades Blandas',
  'Gestión',
  'Otros'
];

const scheduleOptions = [
  { label: 'Mañana (6:00 - 12:00)', value: 'Mañana' },
  { label: 'Tarde (12:00 - 18:00)', value: 'Tarde' },
  { label: 'Noche (18:00 - 24:00)', value: 'Noche' },
  { label: 'Flexible', value: 'Flexible' }
];

const weekDays = [
  { label: 'Lunes', value: 'Lunes' },
  { label: 'Martes', value: 'Martes' },
  { label: 'Miércoles', value: 'Miércoles' },
  { label: 'Jueves', value: 'Jueves' },
  { label: 'Viernes', value: 'Viernes' },
  { label: 'Sábado', value: 'Sábado' },
  { label: 'Domingo', value: 'Domingo' }
];

// Methods
const savePersonalInfo = async () => {
  saving.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Show success message
    console.log('Información guardada exitosamente');
  } catch (error) {
    console.error('Error al guardar:', error);
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  profile.value = {
    nombre: user.value?.nombre || '',
    email: user.value?.email || '',
    telefono: '',
    ubicacion: '',
    jornada: 'Flexible',
    estado: 'Activo',
    biografia: '',
    avatar: null
  };
};

const addSkill = () => {
  if (!newSkill.value.name) return;
  
  const skill = {
    id: Date.now(),
    name: newSkill.value.name,
    level: newSkill.value.level,
    category: newSkill.value.category,
    progress: getLevelProgress(newSkill.value.level),
    description: ''
  };
  
  skills.value.push(skill);
  
  // Reset form
  newSkill.value = {
    name: '',
    level: 'Intermedio',
    category: 'Habilidades Blandas'
  };
};

const editSkill = (skill) => {
  // Implement edit functionality
  console.log('Edit skill:', skill);
};

const deleteSkill = (skillId) => {
  const index = skills.value.findIndex(s => s.id === skillId);
  if (index > -1) {
    skills.value.splice(index, 1);
  }
};

const saveAvailability = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Disponibilidad guardada');
  } catch (error) {
    console.error('Error al guardar disponibilidad:', error);
  }
};

const resetAvailability = () => {
  availability.value = {
    schedules: [],
    days: []
  };
};

const exportProfile = () => {
  // Implement profile export
  console.log('Exporting profile...');
};

const editAvatar = () => {
  // Implement avatar edit
  console.log('Edit avatar');
};

// Helper functions
const getStatusColor = (status) => {
  const colorMap = {
    'Activo': 'success',
    'Inactivo': 'error',
    'Disponible': 'info',
    'Ocupado': 'warning'
  };
  return colorMap[status] || 'grey';
};

const getStatusIcon = (status) => {
  const iconMap = {
    'Activo': 'mdi-check-circle',
    'Inactivo': 'mdi-close-circle',
    'Disponible': 'mdi-clock-outline',
    'Ocupado': 'mdi-clock-alert'
  };
  return iconMap[status] || 'mdi-help-circle';
};

const getSkillCategoryColor = (category) => {
  const colorMap = {
    'Educación': 'primary',
    'Salud': 'success',
    'Tecnología': 'info',
    'Arte y Cultura': 'warning',
    'Deportes': 'error',
    'Habilidades Blandas': 'purple',
    'Gestión': 'indigo',
    'Otros': 'grey'
  };
  return colorMap[category] || 'grey';
};

const getSkillLevelColor = (level) => {
  const colorMap = {
    'Principiante': 'error',
    'Intermedio': 'warning',
    'Avanzado': 'info',
    'Experto': 'success'
  };
  return colorMap[level] || 'grey';
};

const getLevelProgress = (level) => {
  const progressMap = {
    'Principiante': 25,
    'Intermedio': 50,
    'Avanzado': 75,
    'Experto': 100
  };
  return progressMap[level] || 50;
};

const getProjectStatusColor = (status) => {
  const colorMap = {
    'Completado': 'success',
    'En Progreso': 'info',
    'Pausado': 'warning'
  };
  return colorMap[status] || 'grey';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO');
};

onMounted(async () => {
  // Load profile data
  if (user.value?.voluntario?.id_voluntario) {
    await certificadoStore.fetchByVolunteer(user.value.voluntario.id_voluntario);
    await logroStore.fetchVoluntarioLogros(user.value.voluntario.id_voluntario);
  }
});
</script>

<style scoped>
.profile-view {
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

/* Profile Overview */
.profile-overview {
  display: flex;
  align-items: center;
  gap: var(--afro-space-xl);
  padding: var(--afro-space-xl);
}

.profile-avatar-section {
  position: relative;
}

.profile-avatar {
  border: 4px solid var(--afro-surface);
  box-shadow: var(--afro-shadow-lg);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--afro-surface);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: var(--afro-text-2xl);
  font-weight: 700;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.profile-email {
  font-size: var(--afro-text-base);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-lg);
}

.profile-stats {
  display: flex;
  gap: var(--afro-space-xl);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: var(--afro-text-xl);
  font-weight: 700;
  color: var(--afro-primary);
}

.stat-label {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

.profile-status {
  display: flex;
  align-items: center;
}

/* Tabs */
.profile-tabs {
  border-bottom: 1px solid var(--afro-border);
}

.tab-content {
  padding: var(--afro-space-xl);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--afro-space-md);
  margin-top: var(--afro-space-xl);
  padding-top: var(--afro-space-lg);
  border-top: 1px solid var(--afro-border);
}

/* Skills Section */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-lg);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--afro-space-lg);
}

.skill-card {
  padding: var(--afro-space-lg);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--afro-space-md);
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.skill-actions {
  display: flex;
  gap: var(--afro-space-xs);
}

.skill-progress {
  margin-bottom: var(--afro-space-md);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-xs);
}

.progress-label {
  font-size: var(--afro-text-sm);
  font-weight: 500;
  color: var(--afro-text-primary);
}

.progress-percentage {
  font-size: var(--afro-text-sm);
  font-weight: 600;
  color: var(--afro-primary);
}

.skill-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  line-height: 1.5;
}

/* Professional Section Headers */
.section-header-professional {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--afro-space-xl);
  padding: var(--afro-space-lg);
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: var(--afro-radius-lg);
  border: 1px solid var(--afro-border-light);
}

.section-header-professional .header-content {
  flex: 1;
}

.section-title {
  display: flex;
  align-items: center;
  margin: 0 0 var(--afro-space-sm) 0;
  font-size: var(--afro-text-xl);
  font-weight: 700;
  color: var(--afro-text-primary);
  gap: var(--afro-space-sm);
}

.title-icon {
  font-size: 24px !important;
}

.section-subtitle {
  margin: 0;
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  line-height: 1.5;
}

.header-badge {
  flex-shrink: 0;
  margin-left: var(--afro-space-lg);
}

/* Professional Card Headers */
.card-header-professional {
  display: flex;
  align-items: flex-start;
  gap: var(--afro-space-md);
  padding: var(--afro-space-lg);
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-bottom: 1px solid var(--afro-border-light);
  margin: calc(-1 * var(--afro-space-lg)) calc(-1 * var(--afro-space-lg)) var(--afro-space-lg) calc(-1 * var(--afro-space-lg));
}

.header-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--afro-primary-light), var(--afro-primary));
  border-radius: var(--afro-radius-md);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}

.header-icon .v-icon {
  color: white !important;
  font-size: 24px !important;
}

.card-header-professional .header-content {
  flex: 1;
}

.card-title {
  margin: 0 0 var(--afro-space-xs) 0;
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
}

.card-subtitle {
  margin: 0;
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  line-height: 1.4;
}

/* Availability Section - Professional Design */
.availability-section {
  padding: var(--afro-space-lg);
}

.availability-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--afro-space-xl);
  padding: var(--afro-space-xl);
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: var(--afro-radius-lg);
  border: 1px solid #bae6fd;
}

.availability-header .header-content {
  flex: 1;
}

.availability-header .section-title {
  font-size: var(--afro-text-2xl);
  margin-bottom: var(--afro-space-sm);
}

.availability-header .section-subtitle {
  font-size: var(--afro-text-base);
  color: #0369a1;
}

.header-stats {
  display: flex;
  gap: var(--afro-space-lg);
}

.stat-item {
  text-align: center;
  padding: var(--afro-space-md);
  background: white;
  border-radius: var(--afro-radius-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 80px;
}

.stat-value {
  font-size: var(--afro-text-2xl);
  font-weight: 700;
  color: var(--afro-primary);
  line-height: 1;
}

.stat-label {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: var(--afro-space-xs);
}

/* Availability Cards */
.availability-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--afro-space-xl);
  margin-bottom: var(--afro-space-xl);
}

.availability-card {
  background: white;
  border-radius: var(--afro-radius-lg);
  border: 1px solid var(--afro-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.availability-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-body {
  padding: var(--afro-space-lg);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.availability-checkbox {
  padding: var(--afro-space-sm) 0;
  border-radius: var(--afro-radius-sm);
  transition: all 0.2s ease;
}

.availability-checkbox:hover {
  background-color: #f8fafc;
}

/* Professional Actions */
.availability-actions-professional {
  display: flex;
  gap: var(--afro-space-md);
  justify-content: center;
  padding: var(--afro-space-xl);
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: var(--afro-radius-lg);
  border: 1px solid var(--afro-border-light);
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-header-professional {
    flex-direction: column;
    gap: var(--afro-space-md);
  }
  
  .header-badge {
    margin-left: 0;
    align-self: flex-start;
  }
  
  .availability-header {
    flex-direction: column;
    gap: var(--afro-space-lg);
    text-align: center;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .availability-cards {
    grid-template-columns: 1fr;
    gap: var(--afro-space-lg);
  }
  
  .availability-actions-professional {
    flex-direction: column;
  }
  
  .card-header-professional {
    flex-direction: column;
    text-align: center;
    gap: var(--afro-space-sm);
  }
  
  .header-icon {
    align-self: center;
  }
}

/* Portfolio Section */
.portfolio-section {
  padding: var(--afro-space-lg);
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--afro-space-lg);
}

.portfolio-item {
  overflow: hidden;
}

.portfolio-image {
  margin-bottom: var(--afro-space-md);
}

.portfolio-content {
  padding: var(--afro-space-md);
}

.portfolio-title {
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-sm);
}

.portfolio-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-md);
  line-height: 1.5;
}

.portfolio-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.portfolio-date {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

/* Achievements Section */
.achievements-section {
  padding: var(--afro-space-lg);
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--afro-space-lg);
}

.certificate-card {
  transition: all 0.3s ease;
}

.certificate-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--afro-space-lg);
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: var(--afro-space-lg);
  padding: var(--afro-space-lg);
}

.achievement-icon {
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.achievement-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-sm);
  line-height: 1.5;
}

.achievement-date {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-view {
    padding: var(--afro-space-md);
  }
  
  .profile-overview {
    flex-direction: column;
    text-align: center;
    gap: var(--afro-space-lg);
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .skills-grid,
  .portfolio-grid,
  .achievements-grid,
  .certificates-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-card {
    flex-direction: column;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile-stats {
    flex-direction: column;
    gap: var(--afro-space-md);
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
}

/* Profile Tabs Styling */
.profile-tabs {
  border-bottom: 1px solid var(--afro-border);
}

.profile-tab {
  color: #64748b !important; /* Soft gray instead of black */
  font-weight: 500;
  transition: all 0.3s ease;
}

.profile-tab .v-icon {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.profile-tab:hover {
  color: #475569 !important; /* Slightly darker on hover */
  background-color: rgba(59, 130, 246, 0.05);
}

.profile-tab:hover .v-icon {
  opacity: 1;
  transform: scale(1.05);
}

.profile-tab.v-tab--selected {
  color: #2563eb !important; /* Primary blue when active */
  font-weight: 600;
}

.profile-tab.v-tab--selected .v-icon {
  opacity: 1;
  color: #2563eb !important;
}

/* Custom colors for different tab icons */
.profile-tab .v-icon[color="primary-light"] {
  color: #3b82f6 !important; /* Soft blue */
}

.profile-tab .v-icon[color="success-light"] {
  color: #10b981 !important; /* Soft green */
}

.profile-tab .v-icon[color="info-light"] {
  color: #06b6d4 !important; /* Soft cyan */
}

.profile-tab .v-icon[color="warning-light"] {
  color: #f59e0b !important; /* Soft amber */
}

.profile-tab .v-icon[color="accent-light"] {
  color: #ec4899 !important; /* Soft pink */
}
</style>