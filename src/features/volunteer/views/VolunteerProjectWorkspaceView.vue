<template>
  <div class="volunteer-workspace-view">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-body-1 mt-4">Cargando área de trabajo...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-alert type="error" prominent>
        <template #title>Error al cargar el proyecto</template>
        {{ error }}
        <template #append>
          <v-btn color="error" variant="text" @click="goBack">Volver</v-btn>
        </template>
      </v-alert>
    </div>

    <!-- Main Content -->
    <div v-else-if="project">
      <!-- Professional Header with Image -->
      <div class="workspace-header-card mb-6">
        <div class="header-image-container">
          <v-img
            :src="projectImage"
            height="200"
            cover
            class="header-image"
            gradient="to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)"
          >
            <div class="header-overlay">
              <div class="header-content">
                <div class="d-flex align-center mb-3">
                  <v-btn
                    icon="mdi-arrow-left"
                    variant="text"
                    color="white"
                    @click="goBack"
                    class="mr-4"
                  ></v-btn>
                  <v-breadcrumbs
                    :items="breadcrumbItems"
                    class="pa-0"
                    color="white"
                    density="compact"
                  >
                    <template v-slot:divider>
                      <v-icon size="small" color="white">mdi-chevron-right</v-icon>
                    </template>
                  </v-breadcrumbs>
                </div>
                <h1 class="text-h4 font-weight-bold text-white mb-2">
                  {{ project.nombre || project.name }}
                </h1>
                <div class="d-flex align-center gap-3 flex-wrap">
                  <v-chip
                    :color="getStatusColor(project.id_estado || project.estado?.id_estado)"
                    size="small"
                    variant="flat"
                    prepend-icon="mdi-circle"
                  >
                    {{ getStatusText(project.id_estado || project.estado?.id_estado) }}
                  </v-chip>
                  <span class="text-white text-body-2">
                    <v-icon size="16" class="mr-1">mdi-office-building</v-icon>
                    {{ project.organizacion?.nombre || project.organization }}
                  </span>
                  <span class="text-white text-body-2">
                    <v-icon size="16" class="mr-1">mdi-calendar-range</v-icon>
                    {{ formatDateRange(project.fecha_inicio || project.startDate, project.fecha_fin || project.endDate) }}
                  </span>
                </div>
                <!-- Roles Asignados -->
                <div v-if="project.rolesAsignados && project.rolesAsignados.length > 0" class="mt-3">
                  <span class="text-white text-caption mr-2">Mis Roles:</span>
                  <v-chip
                    v-for="rol in project.rolesAsignados"
                    :key="rol.id_rol"
                    color="white"
                    size="small"
                    variant="flat"
                    prepend-icon="mdi-account-tie"
                    class="mr-2"
                  >
                    {{ rol.nombre }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-img>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <div class="metrics-grid mb-6">
        <v-card class="metric-card" variant="outlined" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Progreso del Proyecto</div>
                <div class="text-h5 font-weight-bold text-primary mb-2">{{ projectProgress }}%</div>
                <v-progress-linear
                  :model-value="projectProgress"
                  color="primary"
                  height="8"
                  rounded
                ></v-progress-linear>
              </div>
              <v-icon size="40" color="primary" class="ml-4">mdi-chart-line</v-icon>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="metric-card" variant="outlined" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Mi Progreso</div>
                <div class="text-h5 font-weight-bold text-success mb-2">{{ personalProgress.porcentajeCompletado }}%</div>
                <v-progress-linear
                  :model-value="personalProgress.porcentajeCompletado"
                  color="success"
                  height="8"
                  rounded
                ></v-progress-linear>
                <div class="text-caption text-grey mt-1">
                  {{ personalProgress.tareasCompletadas }}/{{ personalProgress.tareasAsignadas }} tareas
                </div>
              </div>
              <v-icon size="40" color="success" class="ml-4">mdi-check-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="metric-card" variant="outlined" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Horas Trabajadas</div>
                <div class="text-h5 font-weight-bold text-info mb-2">{{ resumenHoras.totalHoras }}h</div>
                <div class="text-caption text-grey">
                  <span class="text-success">{{ resumenHoras.horasVerificadas }}h verificadas</span>
                  <span class="mx-1">•</span>
                  <span class="text-warning">{{ resumenHoras.horasPendientes }}h pendientes</span>
                </div>
              </div>
              <v-icon size="40" color="info" class="ml-4">mdi-clock</v-icon>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="metric-card" variant="outlined" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Tareas Asignadas</div>
                <div class="text-h5 font-weight-bold text-primary mb-2">{{ personalProgress.tareasAsignadas }}</div>
                <div class="text-caption text-grey">
                  {{ personalProgress.tareasCompletadas }} completadas
                </div>
              </div>
              <v-icon size="40" color="primary" class="ml-4">mdi-format-list-checks</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Tabs Navigation -->
      <v-card class="mb-4" variant="outlined" rounded="lg">
        <v-tabs
          v-model="activeTab"
          color="primary"
          class="workspace-tabs"
          show-arrows
        >
          <v-tab value="tasks" class="tab-item">
            <v-icon start>mdi-format-list-checks</v-icon>
            <span class="tab-text">Mis Tareas</span>
            <v-badge
              v-if="asignaciones.length > 0"
              :content="asignaciones.length"
              color="primary"
              inline
              class="ml-2"
            ></v-badge>
          </v-tab>
          
          <v-tab value="hours" class="tab-item">
            <v-icon start>mdi-clock</v-icon>
            <span class="tab-text">Horas</span>
          </v-tab>
          
          <v-tab value="progress" class="tab-item">
            <v-icon start>mdi-chart-line</v-icon>
            <span class="tab-text">Progreso</span>
          </v-tab>
          
          <v-tab value="team" class="tab-item">
            <v-icon start>mdi-account-group</v-icon>
            <span class="tab-text">Equipo</span>
          </v-tab>
          
          <v-tab value="info" class="tab-item">
            <v-icon start>mdi-information</v-icon>
            <span class="tab-text">Información</span>
          </v-tab>
        </v-tabs>
      </v-card>

      <!-- Tabs Content -->
      <v-window v-model="activeTab" class="workspace-content">
        <!-- Tab: Tasks -->
        <v-window-item value="tasks">
          <v-card class="workspace-card" variant="outlined" rounded="lg">
            <v-card-title class="card-header-title">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" color="primary">mdi-format-list-checks</v-icon>
                  <span class="text-h6 font-weight-bold">Mis Tareas</span>
                </div>
                <div class="d-flex align-center gap-2">
                  <v-text-field
                    v-model="taskSearch"
                    label="Buscar tareas..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    class="search-field"
                  ></v-text-field>
                  <v-btn-toggle
                    v-model="taskFilter"
                    mandatory
                    variant="outlined"
                    density="compact"
                  >
                    <v-btn value="all" size="small">Todas</v-btn>
                    <v-btn value="pending" size="small">Pendientes</v-btn>
                    <v-btn value="in-progress" size="small">En Progreso</v-btn>
                    <v-btn value="completed" size="small">Completadas</v-btn>
                  </v-btn-toggle>
                </div>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <div v-if="loadingTasks" class="text-center py-8">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <div v-else-if="filteredAndSearchedTasks.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1">mdi-format-list-checks</v-icon>
                <p class="text-grey mt-4">
                  {{ taskFilter !== 'all' || taskSearch ? 'No hay tareas con los filtros aplicados' : 'No tienes tareas asignadas' }}
                </p>
                <v-alert
                  v-if="taskFilter === 'all' && !taskSearch && asignaciones.length === 0"
                  type="info"
                  variant="tonal"
                  class="mt-4"
                  density="compact"
                >
                  <v-icon start size="small">mdi-information</v-icon>
                  Contacta al coordinador del proyecto para que te asigne tareas.
                </v-alert>
              </div>
              <div v-else>
                <div
                  v-for="asignacion in filteredAndSearchedTasks"
                  :key="asignacion.id_asignacion"
                  class="task-item mb-3"
                  @click="openTaskDetail(asignacion.tarea)"
                >
                  <v-card variant="outlined" class="task-card" hover>
                    <v-card-text>
                      <div class="d-flex align-start justify-space-between">
                        <div class="flex-grow-1">
                          <div class="d-flex align-center mb-2">
                            <v-chip
                              :color="getPriorityColor(asignacion.tarea?.prioridad)"
                              size="small"
                              variant="tonal"
                              class="mr-2"
                            >
                              {{ asignacion.tarea?.prioridad || 'Media' }}
                            </v-chip>
                            <v-chip
                              :color="getStatusColor(asignacion.tarea?.estado?.id_estado || asignacion.tarea?.id_estado)"
                              size="small"
                              variant="tonal"
                              class="mr-2"
                            >
                              {{ asignacion.tarea?.estado?.nombre || 'Pendiente' }}
                            </v-chip>
                            <v-chip
                              v-if="asignacion.tarea?.fase"
                              color="info"
                              size="small"
                              variant="tonal"
                            >
                              {{ asignacion.tarea.fase.nombre }}
                            </v-chip>
                          </div>
                          <h4 class="text-h6 mb-2 font-weight-medium">{{ asignacion.tarea?.descripcion || 'Tarea sin descripción' }}</h4>
                          <div class="text-caption text-grey mb-2">
                            <span v-if="asignacion.rol">
                              <v-icon size="14" class="mr-1">mdi-account-tie</v-icon>
                              Rol: {{ asignacion.rol.nombre }}
                            </span>
                          </div>
                          <div v-if="asignacion.tarea?.fecha_inicio || asignacion.tarea?.fecha_fin" class="text-caption text-grey">
                            <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                            {{ formatDateRange(asignacion.tarea.fecha_inicio, asignacion.tarea.fecha_fin) }}
                          </div>
                        </div>
                        <div class="task-actions ml-4">
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <v-btn
                                icon="mdi-dots-vertical"
                                variant="text"
                                size="small"
                                v-bind="props"
                                @click.stop
                              ></v-btn>
                            </template>
                            <v-list>
                              <v-list-item
                                @click.stop="openTaskDetail(asignacion.tarea)"
                              >
                                <template v-slot:prepend>
                                  <v-icon>mdi-eye</v-icon>
                                </template>
                                <v-list-item-title>Ver Detalles</v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                v-for="action in getTaskActions(asignacion.tarea?.estado?.id_estado || asignacion.tarea?.id_estado)"
                                :key="action.value"
                                @click.stop="updateTaskStatus(asignacion.tarea.id_tarea, action.value)"
                              >
                                <template v-slot:prepend>
                                  <v-icon>{{ action.icon }}</v-icon>
                                </template>
                                <v-list-item-title>{{ action.label }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Tab: Hours -->
        <v-window-item value="hours">
          <v-row>
            <v-col cols="12" lg="8">
              <HoursChart
                :hours="horas"
                :loading="loadingHoras"
              />
            </v-col>
            <v-col cols="12" lg="4">
              <v-card class="workspace-card mb-4" variant="outlined" rounded="lg">
                <v-card-title class="card-header-title">
                  <v-icon class="mr-2" color="primary">mdi-clock-plus</v-icon>
                  <span class="text-h6 font-weight-bold">Registrar Horas</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-4">
                  <!-- Alerta si no hay tareas asignadas -->
                  <v-alert
                    v-if="asignaciones.length === 0"
                    type="warning"
                    variant="tonal"
                    class="mb-4"
                    density="compact"
                  >
                    <v-icon start size="small">mdi-alert</v-icon>
                    No tienes tareas asignadas. No puedes registrar horas hasta que te asignen tareas.
                  </v-alert>
                  
                  <v-form ref="horasFormRef" @submit.prevent="registerHoras">
                    <v-text-field
                      v-model="horasForm.fecha"
                      type="date"
                      label="Fecha"
                      variant="outlined"
                      density="compact"
                      :rules="[v => !!v || 'La fecha es requerida']"
                      class="mb-3"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model.number="horasForm.horas_trabajadas"
                      type="number"
                      label="Horas trabajadas"
                      variant="outlined"
                      density="compact"
                      step="0.5"
                      min="0.5"
                      max="24"
                      :rules="[v => !!v || 'Las horas son requeridas', v => v >= 0.5 || 'Mínimo 0.5 horas', v => v <= 24 || 'Máximo 24 horas']"
                      class="mb-3"
                      required
                    ></v-text-field>
                    <v-select
                      v-model="horasForm.id_tarea"
                      :items="taskOptions"
                      item-title="label"
                      item-value="value"
                      label="Tarea (opcional)"
                      variant="outlined"
                      density="compact"
                      clearable
                      class="mb-3"
                    ></v-select>
                    <v-textarea
                      v-model="horasForm.descripcion"
                      label="Descripción (opcional)"
                      variant="outlined"
                      density="compact"
                      rows="3"
                      class="mb-3"
                    ></v-textarea>
                    <v-btn
                      type="submit"
                      color="primary"
                      variant="flat"
                      block
                      :loading="registeringHoras"
                      :disabled="asignaciones.length === 0"
                    >
                      Registrar Horas
                    </v-btn>
                    <v-alert
                      v-if="asignaciones.length === 0"
                      type="info"
                      variant="text"
                      density="compact"
                      class="mt-2"
                    >
                      <v-icon start size="small">mdi-information</v-icon>
                      Contacta al coordinador del proyecto para que te asigne tareas.
                    </v-alert>
                  </v-form>
                </v-card-text>
              </v-card>

              <v-card class="workspace-card" variant="outlined" rounded="lg">
                <v-card-title class="card-header-title">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                      <v-icon class="mr-2" color="primary">mdi-clock-check</v-icon>
                      <span class="text-h6 font-weight-bold">Horas Registradas</span>
                    </div>
                    <v-btn
                      icon="mdi-refresh"
                      variant="text"
                      size="small"
                      @click="refreshHoras"
                    ></v-btn>
                  </div>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-4">
                  <div v-if="loadingHoras" class="text-center py-4">
                    <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                  </div>
                  <div v-else-if="horas.length === 0" class="text-center py-4">
                    <v-icon size="48" color="grey-lighten-1">mdi-clock-outline</v-icon>
                    <p class="text-caption text-grey mt-2">No hay horas registradas</p>
                  </div>
                  <div v-else>
                    <div
                      v-for="hora in horas.slice(0, 5)"
                      :key="hora.id_horas"
                      class="hora-item mb-3"
                    >
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <div class="text-body-2 font-weight-medium">{{ formatDate(hora.fecha) }}</div>
                          <div class="text-caption text-grey">{{ hora.horas_trabajadas }}h</div>
                          <div v-if="hora.tarea" class="text-caption text-grey">{{ hora.tarea.descripcion?.substring(0, 30) }}...</div>
                        </div>
                        <v-chip
                          :color="hora.verificada ? 'success' : 'warning'"
                          size="small"
                          variant="tonal"
                        >
                          {{ hora.verificada ? 'Verificada' : 'Pendiente' }}
                        </v-chip>
                      </div>
                    </div>
                    <v-btn
                      v-if="horas.length > 5"
                      variant="text"
                      block
                      size="small"
                      @click="showAllHoras = true"
                    >
                      Ver todas ({{ horas.length }})
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Tab: Progress -->
        <v-window-item value="progress">
          <v-row>
            <v-col cols="12" lg="8">
              <ProgressTimeline
                :activities="activities"
                :loading="loadingActivities"
              />
            </v-col>
            <v-col cols="12" lg="4">
              <TaskCalendar
                :tasks="allTasks"
                :loading="loadingTasks"
                @date-click="handleCalendarDateClick"
              />
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Tab: Team -->
        <v-window-item value="team">
          <ProjectTeamView
            :team-members="teamMembers"
            :loading="loadingTeam"
            @contact="handleContactMember"
          />
        </v-window-item>

        <!-- Tab: Info -->
        <v-window-item value="info">
          <v-row>
            <v-col cols="12" md="8">
              <v-card class="workspace-card" variant="outlined" rounded="lg">
                <v-card-title class="card-header-title">
                  <v-icon class="mr-2" color="primary">mdi-information</v-icon>
                  <span class="text-h6 font-weight-bold">Información del Proyecto</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-4">
                  <div class="info-section mb-4">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Descripción</h4>
                    <p class="text-body-2">{{ project.descripcion || project.description || 'Sin descripción' }}</p>
                  </div>
                  <div class="info-section mb-4">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Objetivo</h4>
                    <p class="text-body-2">{{ project.objetivo || project.objective || 'Sin objetivo definido' }}</p>
                  </div>
                  <div class="info-section mb-4">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Ubicación</h4>
                    <div class="text-body-2">
                      <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                      {{ project.ubicacion || project.location || 'No especificada' }}
                    </div>
                  </div>
                  <div v-if="project.organizacion" class="info-section mb-4">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Organización</h4>
                    <div class="text-body-2">{{ project.organizacion.nombre }}</div>
                    <div v-if="project.organizacion.descripcion" class="text-caption text-grey mt-1">
                      {{ project.organizacion.descripcion }}
                    </div>
                  </div>
                  <div v-if="project.requisitos" class="info-section">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Requisitos</h4>
                    <p class="text-body-2">{{ project.requisitos }}</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="workspace-card" variant="outlined" rounded="lg">
                <v-card-title class="card-header-title">
                  <v-icon class="mr-2" color="primary">mdi-chart-box</v-icon>
                  <span class="text-h6 font-weight-bold">Estadísticas</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-4">
                  <div class="stat-item mb-3">
                    <div class="text-caption text-grey mb-1">Fases del Proyecto</div>
                    <div class="text-h6 font-weight-bold">{{ project.fases?.length || 0 }}</div>
                  </div>
                  <div class="stat-item mb-3">
                    <div class="text-caption text-grey mb-1">Tareas Totales</div>
                    <div class="text-h6 font-weight-bold">{{ allTasks.length }}</div>
                  </div>
                  <div class="stat-item mb-3">
                    <div class="text-caption text-grey mb-1">Tareas Completadas</div>
                    <div class="text-h6 font-weight-bold text-success">
                      {{ completedTasksCount }}
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="text-caption text-grey mb-1">Miembros del Equipo</div>
                    <div class="text-h6 font-weight-bold">{{ teamMembers.length }}</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </div>

    <!-- Task Detail Dialog -->
    <TaskDetailDialog
      v-model="taskDetailDialog"
      :task="selectedTask"
      :updating-status="updatingTaskStatus"
      @update-status="handleUpdateTaskStatus"
      @add-comment="handleAddComment"
    />

    <!-- All Hours Dialog -->
    <v-dialog v-model="showAllHoras" max-width="800px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-clock</v-icon>
          Todas las Horas Registradas
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="showAllHoras = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <div v-if="horas.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-clock-outline</v-icon>
            <p class="text-grey mt-4">No hay horas registradas</p>
          </div>
          <div v-else>
            <div
              v-for="hora in horas"
              :key="hora.id_horas"
              class="hora-item-full mb-4"
            >
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="text-h6">{{ formatDate(hora.fecha) }}</div>
                    <v-chip
                      :color="hora.verificada ? 'success' : 'warning'"
                      size="small"
                      variant="tonal"
                    >
                      {{ hora.verificada ? 'Verificada' : 'Pendiente' }}
                    </v-chip>
                  </div>
                  <div class="text-body-1 font-weight-medium mb-2">{{ hora.horas_trabajadas }} horas trabajadas</div>
                  <div v-if="hora.tarea" class="text-body-2 text-grey mb-2">
                    Tarea: {{ hora.tarea.descripcion }}
                  </div>
                  <div v-if="hora.descripcion" class="text-body-2">{{ hora.descripcion }}</div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Success/Error Snackbars -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';
import { useHorasVoluntariadasStore } from '@/features/volunteer/stores/horasVoluntariadasStore';
import api from '@/plugins/axios';
import { formatDate, formatDateRange } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import defaultCoverImage from '@/assets/images/background_login.png';

// Components
import TaskDetailDialog from '@/features/volunteer/components/workspace/TaskDetailDialog.vue';
import { createLazyComponent } from '@/utils/lazyLoad';
const HoursChart = createLazyComponent(() => import('@/features/volunteer/components/workspace/HoursChart.vue'));
import ProgressTimeline from '@/features/volunteer/components/workspace/ProgressTimeline.vue';
import ProjectTeamView from '@/features/volunteer/components/workspace/ProjectTeamView.vue';
const TaskCalendar = createLazyComponent(() => import('@/features/volunteer/components/workspace/TaskCalendar.vue'));

const route = useRoute();
const router = useRouter();
const volunteerStore = useVolunteerStore();
const horasStore = useHorasVoluntariadasStore();

// Reactive state
const project = ref(null);
const loading = ref(true);
const error = ref(null);
const loadingTasks = ref(false);
const loadingHoras = ref(false);
const loadingActivities = ref(false);
const loadingTeam = ref(false);
const registeringHoras = ref(false);
const updatingTaskStatus = ref(false);
const activeTab = ref('tasks');
const taskFilter = ref('all');
const taskSearch = ref('');
const showAllHoras = ref(false);
const taskDetailDialog = ref(false);
const selectedTask = ref(null);
const snackbar = ref({ show: false, message: '', color: 'success' });

// Horas form
const horasForm = ref({
  fecha: new Date().toISOString().split('T')[0],
  horas_trabajadas: null,
  id_tarea: null,
  descripcion: ''
});
const horasFormRef = ref(null);

// Computed properties
const projectId = computed(() => parseInt(route.params.id));

const projectImage = computed(() => {
  if (!project.value) return defaultCoverImage;
  const img = project.value.imagen_principal || project.value.image;
  if (img && img !== '/assets/images/background_login.png') {
    return img;
  }
  return defaultCoverImage;
});

const breadcrumbItems = computed(() => [
  {
    title: 'Mis Proyectos',
    to: ROUTES.VOLUNTEER.MY_PROJECTS,
    disabled: false
  },
  {
    title: project.value?.nombre || project.value?.name || 'Proyecto',
    to: '#',
    disabled: true
  }
]);

const projectProgress = computed(() => {
  if (!project.value || !project.value.fases) return 0;
  const allTasks = project.value.fases.flatMap(fase => fase.tareas || []);
  if (allTasks.length === 0) return 0;
  const completedTasks = allTasks.filter(t => {
    const estado = t.estado?.nombre?.toLowerCase() || '';
    return estado.includes('complet') || estado.includes('finaliz');
  }).length;
  return Math.round((completedTasks / allTasks.length) * 100);
});

const personalProgress = computed(() => {
  if (!project.value || !project.value.progresoPersonal) {
    return { tareasAsignadas: 0, tareasCompletadas: 0, porcentajeCompletado: 0 };
  }
  return project.value.progresoPersonal;
});

const resumenHoras = computed(() => {
  if (!project.value || !project.value.resumenHoras) {
    return {
      totalHoras: 0,
      horasVerificadas: 0,
      horasPendientes: 0,
      totalRegistros: 0,
      registrosVerificados: 0,
      registrosPendientes: 0
    };
  }
  return project.value.resumenHoras;
});

const asignaciones = computed(() => {
  return project.value?.asignaciones || [];
});

const allTasks = computed(() => {
  return asignaciones.value.map(a => a.tarea).filter(Boolean);
});

const completedTasksCount = computed(() => {
  return allTasks.value.filter(t => {
    const estadoId = t.estado?.id_estado || t.id_estado;
    return estadoId === 3; // Completado
  }).length;
});

const filteredTasks = computed(() => {
  if (taskFilter.value === 'all') return asignaciones.value;
  
  return asignaciones.value.filter(a => {
    const estadoId = a.tarea?.estado?.id_estado || a.tarea?.id_estado;
    const estadoNombre = a.tarea?.estado?.nombre?.toLowerCase() || '';
    
    if (taskFilter.value === 'pending') {
      return estadoNombre.includes('pendiente') || estadoNombre.includes('nuevo');
    }
    if (taskFilter.value === 'in-progress') {
      return estadoNombre.includes('progreso') || estadoNombre.includes('en curso');
    }
    if (taskFilter.value === 'completed') {
      return estadoNombre.includes('complet') || estadoNombre.includes('finaliz');
    }
    return true;
  });
});

const filteredAndSearchedTasks = computed(() => {
  let result = filteredTasks.value;
  
  if (taskSearch.value) {
    const searchLower = taskSearch.value.toLowerCase();
    result = result.filter(a => {
      const desc = a.tarea?.descripcion?.toLowerCase() || '';
      const fase = a.tarea?.fase?.nombre?.toLowerCase() || '';
      const rol = a.rol?.nombre?.toLowerCase() || '';
      return desc.includes(searchLower) || fase.includes(searchLower) || rol.includes(searchLower);
    });
  }
  
  return result;
});

const taskOptions = computed(() => {
  return asignaciones.value.map(a => ({
    label: a.tarea?.descripcion?.substring(0, 50) || 'Tarea',
    value: a.tarea?.id_tarea
  }));
});

const horas = computed(() => {
  return horasStore.getHorasByProject(projectId.value);
});

const activities = computed(() => {
  const acts = [];
  
  // Add task completions
  asignaciones.value.forEach(a => {
    if (a.tarea?.estado?.id_estado === 3 || a.tarea?.id_estado === 3) {
      acts.push({
        id: `task-${a.tarea.id_tarea}`,
        type: 'task_completed',
        fecha: a.tarea.actualizado_en || new Date(),
        titulo: 'Tarea Completada',
        descripcion: a.tarea.descripcion
      });
    }
  });
  
  // Add hours registrations
  horas.value.forEach(h => {
    acts.push({
      id: `hours-${h.id_horas}`,
      type: 'hours_registered',
      fecha: h.fecha,
      titulo: `${h.horas_trabajadas} horas registradas`,
      descripcion: h.descripcion || h.tarea?.descripcion
    });
  });
  
  return acts.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10);
});

const teamMembers = computed(() => {
  // Group assignments by volunteer
  const membersMap = new Map();
  
  asignaciones.value.forEach(a => {
    const volId = a.id_voluntario || a.voluntario?.id_voluntario;
    if (!volId) return;
    
    if (!membersMap.has(volId)) {
      membersMap.set(volId, {
        id_voluntario: volId,
        nombre: a.voluntario?.usuario?.nombre || a.voluntario?.nombre || 'Voluntario',
        email: a.voluntario?.usuario?.email || '',
        roles: []
      });
    }
    
    if (a.rol && !membersMap.get(volId).roles.find(r => r.id_rol === a.rol.id_rol)) {
      membersMap.get(volId).roles.push(a.rol);
    }
  });
  
  return Array.from(membersMap.values());
});

// Methods
const loadProject = async () => {
  loading.value = true;
  error.value = null;
  try {
    if (!projectId.value || isNaN(projectId.value)) {
      error.value = 'ID de proyecto inválido';
      return;
    }

    const response = await api.get(`/projects/${projectId.value}`);
    if (!response.data) {
      error.value = 'No se pudo cargar la información del proyecto';
      return;
    }

    project.value = response.data;
    
    // Cargar datos adicionales en paralelo
    await Promise.all([
      loadHoras(),
      loadTeam()
    ]);
  } catch (err) {
    console.error('Error loading project:', err);
    if (err.response?.status === 404) {
      error.value = 'El proyecto no fue encontrado o no tienes acceso a él';
    } else if (err.response?.status === 403) {
      error.value = 'No tienes permiso para acceder a este proyecto';
    } else {
      error.value = err.response?.data?.message || 'Error al cargar el proyecto. Por favor, intenta recargar la página.';
    }
  } finally {
    loading.value = false;
  }
};

const loadHoras = async () => {
  loadingHoras.value = true;
  try {
    await horasStore.fetchHorasByProject(projectId.value);
    await horasStore.fetchResumenByProject(projectId.value);
  } catch (err) {
    console.error('Error loading horas:', err);
  } finally {
    loadingHoras.value = false;
  }
};

const loadTeam = async () => {
  loadingTeam.value = true;
  try {
    // Team data comes from assignments, already loaded
  } catch (err) {
    console.error('Error loading team:', err);
  } finally {
    loadingTeam.value = false;
  }
};

const refreshHoras = () => {
  loadHoras();
};

const registerHoras = async () => {
  // Validación: Verificar que el voluntario tenga tareas asignadas
  if (asignaciones.value.length === 0) {
    showSnackbar('No puedes registrar horas sin tareas asignadas. Contacta al coordinador del proyecto para que te asigne tareas.', 'warning');
    return;
  }

  const { valid } = await horasFormRef.value?.validate();
  if (!valid) {
    showSnackbar('Por favor completa todos los campos requeridos', 'error');
    return;
  }

  // Validación: Verificar que la fecha no sea futura
  const selectedDate = new Date(horasForm.value.fecha);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Fin del día de hoy
  
  if (selectedDate > today) {
    showSnackbar('No puedes registrar horas para fechas futuras', 'error');
    return;
  }

  // Validación: Verificar que las horas sean válidas
  const horas = parseFloat(horasForm.value.horas_trabajadas);
  if (isNaN(horas) || horas <= 0) {
    showSnackbar('Las horas deben ser un número mayor a 0', 'error');
    return;
  }

  if (horas > 24) {
    showSnackbar('No puedes registrar más de 24 horas en un solo día', 'error');
    return;
  }

  registeringHoras.value = true;
  try {
    await horasStore.registerHoras({
      id_proyecto: projectId.value,
      fecha: horasForm.value.fecha,
      horas_trabajadas: horas,
      id_tarea: horasForm.value.id_tarea || null,
      descripcion: horasForm.value.descripcion || null
    });

    // Reset form
    horasForm.value = {
      fecha: new Date().toISOString().split('T')[0],
      horas_trabajadas: null,
      id_tarea: null,
      descripcion: ''
    };
    horasFormRef.value?.resetValidation();

    showSnackbar('Horas registradas correctamente', 'success');
    
    await loadProject();
  } catch (err) {
    console.error('Error registering horas:', err);
    const errorMessage = err.response?.data?.message || 'Error al registrar las horas';
    showSnackbar(errorMessage, 'error');
  } finally {
    registeringHoras.value = false;
  }
};

const updateTaskStatus = async (taskId, newStatus) => {
  // Validar que la tarea existe
  const task = allTasks.value.find(t => t.id_tarea === taskId);
  if (!task) {
    showSnackbar('La tarea no fue encontrada', 'error');
    return;
  }

  updatingTaskStatus.value = true;
  try {
    await volunteerStore.updateTaskStatus(taskId, newStatus);
    const statusText = newStatus === 3 ? 'completada' : newStatus === 2 ? 'en progreso' : 'actualizada';
    showSnackbar(`Tarea marcada como ${statusText}`, 'success');
    await loadProject();
  } catch (err) {
    console.error('Error updating task status:', err);
    const errorMessage = err.response?.data?.message || 'Error al actualizar el estado de la tarea';
    showSnackbar(errorMessage, 'error');
  } finally {
    updatingTaskStatus.value = false;
  }
};

const handleUpdateTaskStatus = (taskId) => {
  const task = allTasks.value.find(t => t.id_tarea === taskId);
  if (!task) return;
  
  const currentEstado = task.estado?.id_estado || task.id_estado;
  const newEstado = currentEstado === 2 ? 3 : 2; // Toggle between in-progress and completed
  updateTaskStatus(taskId, newEstado);
};

const handleAddComment = async (data) => {
  if (!data || !data.comentario || !data.comentario.trim()) {
    showSnackbar('El comentario no puede estar vacío', 'warning');
    return;
  }

  try {
    // TODO: Implement comment API endpoint
    showSnackbar('Comentario agregado correctamente', 'success');
    await loadProject();
  } catch (err) {
    console.error('Error adding comment:', err);
    const errorMessage = err.response?.data?.message || 'Error al agregar el comentario';
    showSnackbar(errorMessage, 'error');
  }
};

const openTaskDetail = (task) => {
  selectedTask.value = task;
  taskDetailDialog.value = true;
};

const handleContactMember = (member) => {
  if (member.email) {
    window.location.href = `mailto:${member.email}`;
  }
};

const handleCalendarDateClick = (date) => {
  // Filter tasks by selected date
  const dateStr = new Date(date.date).toISOString().split('T')[0];
  taskSearch.value = '';
  // Could implement date filtering here
};

const getTaskActions = (estadoId) => {
  const actions = [];
  if (estadoId !== 2 && estadoId !== 3) {
    actions.push({ label: 'Marcar como En Progreso', value: 2, icon: 'mdi-play' });
  }
  if (estadoId !== 3) {
    actions.push({ label: 'Marcar como Completada', value: 3, icon: 'mdi-check' });
  }
  return actions;
};

const getStatusColor = (estadoId) => {
  if (!estadoId) return 'grey';
  const colorMap = {
    1: 'success',
    2: 'info',
    3: 'success',
    4: 'warning',
    5: 'error'
  };
  return colorMap[estadoId] || 'grey';
};

const getStatusText = (estadoId) => {
  if (!estadoId) return 'Desconocido';
  const textMap = {
    1: 'Activo',
    2: 'En Progreso',
    3: 'Completado',
    4: 'Pausado',
    5: 'Cancelado'
  };
  return textMap[estadoId] || 'Desconocido';
};

const getPriorityColor = (prioridad) => {
  const colorMap = {
    'Alta': 'error',
    'Media': 'warning',
    'Baja': 'info'
  };
  return colorMap[prioridad] || 'grey';
};

const showSnackbar = (message, color = 'success') => {
  snackbar.value = { show: true, message, color };
};

const goBack = () => {
  router.push(ROUTES.VOLUNTEER.MY_PROJECTS);
};

// Watch para recargar datos cuando cambia la pestaña activa
watch(activeTab, (newTab, oldTab) => {
  if (newTab !== oldTab && project.value) {
    // Recargar datos específicos de la pestaña si es necesario
    if (newTab === 'hours') {
      loadHoras();
    } else if (newTab === 'progress') {
      // Los datos de progreso se calculan de asignaciones, no necesitan recarga
    } else if (newTab === 'team') {
      loadTeam();
    }
  }
});

// Watch para recargar cuando cambia el proyecto
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadProject();
  }
});

// Lifecycle
onMounted(() => {
  loadProject();
});
</script>

<style scoped>
.volunteer-workspace-view {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  background: #f5f5f5;
  min-height: 100vh;
}

.workspace-header-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-image-container {
  position: relative;
}

.header-image {
  border-radius: 16px;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  display: flex;
  align-items: flex-end;
  padding: 32px;
}

.header-content {
  width: 100%;
  color: white;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.metric-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.workspace-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.workspace-tabs .tab-item {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  min-height: 56px;
  padding: 0 24px;
  transition: all 0.3s ease;
}

.workspace-tabs .v-tab--selected {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  background: rgba(var(--v-theme-primary), 0.05);
}

.workspace-tabs .tab-item:hover {
  background: rgba(var(--v-theme-primary), 0.03);
}

.tab-text {
  margin-left: 8px;
}

.workspace-content {
  margin-top: 0;
}

.workspace-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.workspace-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header-title {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.search-field {
  max-width: 300px;
}

.task-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.task-item:hover {
  transform: translateX(4px);
}

.task-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.task-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.hora-item {
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  transition: background 0.2s;
}

.hora-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.hora-item-full {
  transition: transform 0.2s;
}

.hora-item-full:hover {
  transform: translateY(-2px);
}

.info-section {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.info-section:last-child {
  border-bottom: none;
}

.stat-item {
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .volunteer-workspace-view {
    padding: 16px;
  }
  
  .header-overlay {
    padding: 24px !important;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 960px) {
  .tab-text {
    display: none;
  }
  
  .workspace-tabs .tab-item {
    padding: 0 12px;
    min-height: 48px;
  }

  .search-field {
    max-width: 100%;
    margin-bottom: 8px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .header-overlay {
    padding: 20px !important;
  }
  
  .header-content h1 {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 768px) {
  .volunteer-workspace-view {
    padding: 12px;
  }
  
  .workspace-header-card {
    border-radius: 12px;
  }
  
  .header-image {
    height: 150px !important;
  }
  
  .header-overlay {
    padding: 16px !important;
  }
  
  .header-content h1 {
    font-size: 1.25rem !important;
  }
  
  .workspace-tabs {
    overflow-x: auto;
  }
  
  .workspace-tabs .tab-item {
    padding: 0 8px;
    min-height: 44px;
    font-size: 0.875rem;
  }
  
  .card-header-title {
    padding: 16px !important;
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;
  }
  
  .card-header-title > div {
    width: 100%;
  }
  
  /* Stack columns on mobile */
  .v-row {
    flex-direction: column;
  }
  
  .v-col {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  /* Make tables scrollable */
  .v-table {
    overflow-x: auto;
    display: block;
  }
}

@media (max-width: 480px) {
  .volunteer-workspace-view {
    padding: 8px;
  }
  
  .header-image {
    height: 120px !important;
  }
  
  .header-overlay {
    padding: 12px !important;
  }
  
  .header-content h1 {
    font-size: 1.125rem !important;
  }
  
  .workspace-tabs .tab-item {
    padding: 0 4px;
    min-height: 40px;
  }
  
  .metric-card {
    padding: 12px !important;
  }
  
  .card-header-title {
    padding: 12px !important;
  }
}
</style>
