<template>
  <v-container fluid class="pa-8 project-detail-view">
    <div v-if="projectLoading" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="projectError" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-alert type="error" prominent>
        {{ projectError }}
      </v-alert>
    </div>

    <div v-else-if="project">
      <!-- Modern Header -->
      <ModernCard
        :title="project.name"
        :subtitle="`${project.location} • ${formatDateRange(project.startDate, project.endDate)}`"
        icon="mdi-folder-heart"
        icon-color="primary"
        variant="gradient"
        class="mb-6 project-header-card"
      >
        <template #content>
          <v-row align="center">
            <v-col cols="12" md="8">
              <div class="d-flex align-center mb-3">
                <v-chip 
                  :color="getStatusColor(project.id_estado)" 
                  size="large"
                  class="mr-4"
                >
                  <v-icon start>{{ getStatusIcon(project.id_estado) }}</v-icon>
                  {{ getStatusText(project.id_estado) }}
                </v-chip>
                
                <v-chip 
                  color="info" 
                  variant="tonal"
                  size="small"
                  class="mr-2"
                >
                  <v-icon start>mdi-view-list</v-icon>
                  {{ project.phases?.length || 0 }} fases
                </v-chip>
                
                <v-chip 
                  color="success" 
                  variant="tonal"
                  size="small"
                >
                  <v-icon start>mdi-currency-usd</v-icon>
                  ${{ project.budget?.toLocaleString() || '0' }}
                </v-chip>
              </div>
              
              <p class="text-body-1 text-grey-darken-1 mb-0">
                {{ project.description }}
              </p>
        </v-col>
            
            <v-col cols="12" md="4" class="text-md-right">
              <div class="d-flex flex-column align-md-end gap-2">
                <div class="d-flex align-center gap-2">
                  <ModernButton
                    color="grey"
                    variant="outlined"
                    prepend-icon="mdi-arrow-left"
                    @click="router.back()"
                    size="small"
                  >
                    Volver
                  </ModernButton>
                  
                  <ModernButton
                    color="warning"
                    variant="outlined"
                    prepend-icon="mdi-pencil"
                    @click="openEditProjectDialog"
                    size="small"
                  >
                    Editar
                  </ModernButton>
                </div>
                
                <div class="d-flex align-center gap-2">
                <ModernButton
                  :color="project.es_publico ? 'success' : 'warning'"
                  variant="flat"
                  :prepend-icon="project.es_publico ? 'mdi-eye' : 'mdi-eye-off'"
                  @click="toggleProjectVisibility"
                  size="small"
                >
                  {{ project.es_publico ? 'Visible en Catálogo' : 'Oculto del Catálogo' }}
                </ModernButton>
                  
                  <ModernButton
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-content-save"
                    @click="saveProjectChanges"
                    :loading="isLoading('savingProject')"
                    size="small"
                  >
                    Guardar
                  </ModernButton>
                </div>
          </div>
        </v-col>
      </v-row>
        </template>
      </ModernCard>

      <v-row>
        <!-- Main Content Column -->
        <v-col cols="12" md="8">
          <!-- Project Overview Cards -->
          <v-row class="mb-6 stats-cards-row">
            <v-col cols="12" sm="6" md="3" class="stats-card-col">
              <ModernCard
                title="Presupuesto Total"
                subtitle="Inversión asignada"
                icon="mdi-currency-usd"
                icon-color="success"
                variant="filled"
                class="stats-card budget-card"
              >
                <template #content>
                  <div class="stats-content-compact">
                    <div class="stats-icon-compact success">
                      <v-icon size="20" color="white">mdi-currency-usd</v-icon>
                    </div>
                    <div class="stats-data-compact">
                      <div class="stats-value-compact success">
                        ${{ project.budget ? project.budget.toLocaleString() : '0' }}
                      </div>
                      <div class="stats-label-compact">COP</div>
                    </div>
                  </div>
                </template>
              </ModernCard>
            </v-col>
            
            <v-col cols="12" sm="6" md="3" class="stats-card-col">
              <ModernCard
                title="Fases del Proyecto"
                subtitle="Etapas definidas"
                icon="mdi-view-list"
                icon-color="info"
                variant="tonal"
                class="stats-card phases-card"
              >
                <template #content>
                  <div class="stats-content-compact">
                    <div class="stats-icon-compact info">
                      <v-icon size="20" color="white">mdi-view-list</v-icon>
                    </div>
                    <div class="stats-data-compact">
                      <div class="stats-value-compact info">
                        {{ project.phases?.length || 0 }}
                      </div>
                      <div class="stats-label-compact">fases</div>
                    </div>
                  </div>
                </template>
              </ModernCard>
            </v-col>
            
            <v-col cols="12" sm="6" md="3" class="stats-card-col">
              <ModernCard
                title="Tareas Totales"
                subtitle="Actividades planificadas"
                icon="mdi-format-list-checks"
                icon-color="primary"
                variant="outlined"
                class="stats-card tasks-card"
              >
                <template #content>
                  <div class="stats-content-compact">
                    <div class="stats-icon-compact primary">
                      <v-icon size="20" color="white">mdi-format-list-checks</v-icon>
                    </div>
                    <div class="stats-data-compact">
                      <div class="stats-value-compact primary">
                        {{ getTotalTasks() }}
                      </div>
                      <div class="stats-label-compact">tareas</div>
                    </div>
                  </div>
                </template>
              </ModernCard>
            </v-col>
            
            <v-col cols="12" sm="6" md="3" class="stats-card-col">
              <ModernCard
                title="Estado Actual"
                subtitle="Visibilidad del proyecto"
                icon="mdi-eye"
                icon-color="warning"
                variant="gradient"
                class="stats-card status-card"
              >
                <template #content>
                  <div class="stats-content-compact">
                    <div class="stats-icon-compact warning">
                      <v-icon size="20" color="white">{{ getStatusIcon(project.id_estado) }}</v-icon>
                    </div>
                    <div class="stats-data-compact">
                      <div class="d-flex flex-column gap-1">
                        <v-chip 
                          :color="getStatusColor(project.id_estado)" 
                          size="small"
                          class="status-chip-compact"
                        >
                          <v-icon start size="16">{{ getStatusIcon(project.id_estado) }}</v-icon>
                          {{ getStatusText(project.id_estado) }}
                        </v-chip>
                        <v-chip 
                          :color="project.es_publico ? 'success' : 'grey'" 
                          size="x-small"
                          variant="tonal"
                        >
                          <v-icon start size="12">{{ project.es_publico ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                          {{ project.es_publico ? 'En catálogo' : 'Oculto' }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </template>
              </ModernCard>
            </v-col>
          </v-row>

          <!-- Kanban Board -->
          <v-card class="pa-6 rounded-lg elevation-0 mb-6">
            <v-card-title class="text-h6 font-weight-bold">Tablero de Tareas</v-card-title>
            <v-divider class="mb-6"></v-divider>
            <div v-if="getAllTasks().length === 0" class="text-center py-8">
              <v-icon size="120" color="grey-lighten-1">mdi-format-list-checks</v-icon>
              <h3 class="text-h5 text-grey mt-4">No hay tareas definidas</h3>
              <p class="text-body-1 text-grey mb-4">
                Comienza agregando tareas a las fases de tu proyecto
              </p>
            </div>
            <kanban-board 
              v-else
              :tasks="getAllTasks()" 
              :phases="project.phases || []"
              @update:taskStatus="updateTaskStatusFromKanban" 
              @task-clicked="openEditTaskDialog"
            ></kanban-board>
          </v-card>

          <!-- Project Phases Management -->
          <ModernCard
            title="Gestión de Fases del Proyecto"
            subtitle="Organiza y gestiona las etapas del proyecto"
            icon="mdi-view-list"
            icon-color="primary"
            variant="default"
            class="mb-6"
          >
            <template #headerActions>
              <ModernButton
                color="primary"
                variant="flat"
                prepend-icon="mdi-plus"
                @click="openAddPhaseDialog"
                size="small"
              >
                Añadir Fase
              </ModernButton>
            </template>
            
            <template #content>
              <div v-if="!project.phases || project.phases.length === 0" class="text-center py-8">
                <v-icon size="120" color="grey-lighten-1">mdi-view-list-outline</v-icon>
                <h3 class="text-h5 text-grey mt-4">No hay fases definidas</h3>
                <p class="text-body-1 text-grey mb-4">
                  Comienza agregando las fases principales de tu proyecto
                </p>
                <ModernButton
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-plus"
                  @click="openAddPhaseDialog"
                >
                  Crear Primera Fase
                </ModernButton>
              </div>
              
              <div v-else>
                <v-expansion-panels variant="accordion" class="modern-expansion-panels">
                  <v-expansion-panel 
                    v-for="(phase, index) in project.phases" 
                    :key="phase.id || index"
                    class="phase-panel"
                  >
                    <v-expansion-panel-title class="phase-panel-title">
                  <div class="d-flex justify-space-between align-center w-100">
                        <div class="d-flex align-center">
                          <v-chip 
                            color="primary" 
                            size="small" 
                            class="mr-3"
                          >
                            {{ index + 1 }}
                          </v-chip>
                          <span class="font-weight-bold text-h6">{{ phase.name }}</span>
                        </div>
                        
                        <div class="d-flex align-center gap-2">
                          <v-chip 
                            :color="getPhaseStatusColor(phase)" 
                            size="small"
                            class="mr-2"
                          >
                            {{ getPhaseStatus(phase) }}
                          </v-chip>
                          
                          <v-btn 
                            icon="mdi-pencil" 
                            variant="text" 
                            color="warning" 
                            size="small"
                            @click.stop="openEditPhaseDialog(phase)"
                          ></v-btn>
                          
                          <v-btn 
                            icon="mdi-delete" 
                            variant="text" 
                            color="error" 
                            size="small"
                            @click.stop="openDeletePhaseDialog(phase.id)"
                          ></v-btn>
                    </div>
                  </div>
                </v-expansion-panel-title>
                    
                    <v-expansion-panel-text class="phase-panel-content">
                      <div class="mb-4">
                        <p class="text-body-1 text-grey-darken-1 mb-3">
                          {{ phase.description || 'Sin descripción' }}
                        </p>
                        
                        <div class="d-flex align-center gap-4 mb-4">
                          <div class="d-flex align-center">
                            <v-icon class="mr-2" color="info" size="small">mdi-format-list-checks</v-icon>
                            <span class="text-body-2">
                              {{ tasksByPhase(phase.id).length }} tarea(s)
                            </span>
                          </div>
                          
                          <div class="d-flex align-center">
                            <v-icon class="mr-2" color="success" size="small">mdi-check-circle</v-icon>
                            <span class="text-body-2">
                              {{ getCompletedTasksByPhase(phase.id) }} completada(s)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <v-divider class="mb-4"></v-divider>
                      
                      <!-- Tasks List -->
                      <div class="tasks-section">
                        <h4 class="text-subtitle-1 font-weight-bold mb-3">Tareas de esta Fase</h4>
                        
                        <div v-if="tasksByPhase(phase.id).length === 0" class="text-center py-4">
                          <v-icon size="64" color="grey-lighten-1">mdi-format-list-checks</v-icon>
                          <p class="text-body-2 text-grey mt-2">No hay tareas en esta fase</p>
                        </div>
                        
                        <div v-else>
                          <div 
                            v-for="task in tasksByPhase(phase.id)" 
                            :key="task.id"
                            class="task-item mb-3"
                          >
                            <ModernCard
                              :title="task.description"
                              :subtitle="`${task.prioridad} • ${formatDateRange(task.fecha_inicio, task.fecha_fin)}`"
                              icon="mdi-checkbox-marked-circle-outline"
                              icon-color="primary"
                              variant="outlined"
                              class="task-card"
                            >
                              <template #content>
                                <div class="d-flex align-center justify-space-between">
                                  <div class="d-flex align-center gap-2">
                                    <v-chip 
                                      :color="getTaskStatusColor(task.id_estado)" 
                                      size="small"
                                    >
                                      {{ getTaskStatus(task.id_estado) }}
                                    </v-chip>
                                    
                                    <v-chip 
                                      :color="getPriorityColor(task.prioridad)" 
                                      variant="tonal"
                                      size="x-small"
                                    >
                                      {{ task.prioridad }}
                                    </v-chip>
                                  </div>
                                  
                                  <div class="d-flex align-center gap-1">
                                    <v-btn 
                                      icon="mdi-pencil" 
                                      variant="text" 
                                      color="warning" 
                                      size="x-small"
                                      @click="openEditTaskDialog(task)"
                                    ></v-btn>
                                    
                                    <v-btn 
                                      icon="mdi-delete" 
                                      variant="text" 
                                      color="error" 
                                      size="x-small"
                                      @click="openDeleteTaskDialog(task.id)"
                                    ></v-btn>
                                  </div>
                                </div>
                        </template>
                            </ModernCard>
                    </div>
                        </div>
                        
                        <div class="text-center mt-4">
                          <ModernButton
                            color="primary"
                            variant="outlined"
                            prepend-icon="mdi-plus"
                            @click="openAddTaskDialog(null, phase.id)"
                            size="small"
                          >
                            Añadir Tarea a esta Fase
                          </ModernButton>
                        </div>
                      </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
              </div>
            </template>
          </ModernCard>


        </v-col>

        <!-- Sidebar Column -->
        <v-col cols="12" md="4">
          <!-- Project Management Card -->
          <ModernCard
            title="Gestión del Proyecto"
            subtitle="Herramientas de administración"
            icon="mdi-cog"
            icon-color="primary"
            variant="default"
            class="mb-6"
          >
            <template #content>
              <div class="management-actions">
                <ModernButton
                  color="info"
                  variant="outlined"
                  prepend-icon="mdi-account-cog"
                  @click="openRoleManagement"
                  block
                  class="mb-3"
                >
                  Gestionar Roles
                </ModernButton>
                
                <ModernButton
                  color="success"
                  variant="outlined"
                  prepend-icon="mdi-account-plus"
                  @click="openAssignVolunteerDialog"
                  block
                  class="mb-3"
                >
                  Asignar Voluntario
                </ModernButton>
                
                <ModernButton
                  color="warning"
                  variant="outlined"
                  prepend-icon="mdi-chart-line"
                  @click="openProjectReports"
                  block
                  class="mb-3"
                >
                  Ver Reportes
                </ModernButton>
                
                <ModernButton
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-download"
                  @click="exportProjectData"
                  block
                  class="mb-3"
                >
                  Exportar Datos
                </ModernButton>
                
                <v-divider class="my-4"></v-divider>
                
                <ModernButton
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-delete"
                  @click="openDeleteProjectDialog"
                  block
                >
                  Eliminar Proyecto
                </ModernButton>
              </div>
            </template>
          </ModernCard>

          <!-- Beneficios y Pago Card -->
          <ModernCard
            title="Beneficios y Pago"
            subtitle="Configuración de remuneración"
            icon="mdi-cash-multiple"
            icon-color="success"
            variant="default"
            class="mb-6"
          >
            <template #content>
              <div v-if="project?.beneficio" class="beneficio-info">
                <v-chip color="success" class="mb-2">
                  {{ getTipoPagoText(project.beneficio.tipo_pago) }}
                </v-chip>
                <div v-if="project.beneficio.monto > 0" class="mt-2">
                  <strong>Monto:</strong> ${{ formatCurrency(project.beneficio.monto) }} 
                  <span v-if="project.beneficio.frecuencia !== 'none'">
                    ({{ getFrecuenciaText(project.beneficio.frecuencia) }})
                  </span>
                </div>
                <div v-if="project.beneficio.descripcion_pago" class="mt-2 text-body-2">
                  {{ project.beneficio.descripcion_pago }}
                </div>
                <div class="mt-3 d-flex flex-wrap gap-2">
                  <v-chip v-if="project.beneficio.incluye_transporte" size="small" color="info">
                    <v-icon start size="small">mdi-bus</v-icon>
                    Transporte
                  </v-chip>
                  <v-chip v-if="project.beneficio.incluye_alimentacion" size="small" color="info">
                    <v-icon start size="small">mdi-food</v-icon>
                    Alimentación
                  </v-chip>
                  <v-chip v-if="project.beneficio.incluye_materiales" size="small" color="info">
                    <v-icon start size="small">mdi-toolbox</v-icon>
                    Materiales
                  </v-chip>
                  <v-chip v-if="project.beneficio.incluye_seguro" size="small" color="info">
                    <v-icon start size="small">mdi-shield-check</v-icon>
                    Seguro
                  </v-chip>
                </div>
              </div>
              <div v-else class="text-body-2 text-grey">
                No se han configurado beneficios aún
              </div>
              <ModernButton
                color="success"
                variant="outlined"
                prepend-icon="mdi-cash-multiple"
                @click="openBeneficioDialog"
                block
                class="mt-3"
              >
                {{ project?.beneficio ? 'Editar Beneficios' : 'Configurar Beneficios' }}
              </ModernButton>
            </template>
          </ModernCard>

          <!-- Vista Previa Card -->
          <ModernCard
            title="Vista Previa"
            subtitle="Cómo se verá en el catálogo"
            icon="mdi-eye"
            icon-color="primary"
            variant="default"
            class="mb-6"
          >
            <template #content>
              <ModernButton
                color="primary"
                variant="outlined"
                prepend-icon="mdi-eye"
                @click="openPreviewDialog"
                block
              >
                Ver Vista Previa
              </ModernButton>
            </template>
          </ModernCard>

          <!-- Solicitudes Card -->
          <ModernCard
            title="Solicitudes de Inscripción"
            subtitle="Gestionar solicitudes de voluntarios"
            icon="mdi-account-plus"
            icon-color="info"
            variant="default"
            class="mb-6"
          >
            <template #content>
              <div class="text-body-2 text-grey mb-3">
                {{ solicitudes.length }} solicitud{{ solicitudes.length !== 1 ? 'es' : '' }}
              </div>
              <ModernButton
                color="info"
                variant="outlined"
                prepend-icon="mdi-account-plus"
                @click="openSolicitudesDialog"
                block
              >
                Ver Solicitudes
              </ModernButton>
            </template>
          </ModernCard>

          <!-- Project Progress Card -->
          <ModernCard
            title="Progreso del Proyecto"
            subtitle="Estado general"
            icon="mdi-chart-pie"
            icon-color="success"
            variant="tonal"
            class="mb-6"
          >
            <template #content>
              <div class="progress-stats">
                <div class="d-flex justify-space-between align-center mb-3">
                  <span class="text-body-2">Fases Completadas</span>
                  <span class="text-h6 font-weight-bold">{{ getCompletedPhasesCount() }}/{{ project?.phases?.length || 0 }}</span>
                </div>
                
                <v-progress-linear
                  :model-value="getProjectProgress()"
                  color="success"
                  height="8"
                  rounded
                  class="mb-4"
                ></v-progress-linear>
                
                <div class="d-flex justify-space-between align-center mb-3">
                  <span class="text-body-2">Tareas Completadas</span>
                  <span class="text-h6 font-weight-bold">{{ getCompletedTasksCount() }}/{{ getTotalTasks() }}</span>
                </div>
                
                <v-progress-linear
                  :model-value="getTasksProgress()"
                  color="primary"
                  height="8"
                  rounded
                  class="mb-4"
                ></v-progress-linear>
                
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-success">{{ Math.round(getProjectProgress()) }}%</div>
                  <div class="text-caption text-grey">Progreso General</div>
                </div>
              </div>
            </template>
          </ModernCard>

          <!-- Team Members Card -->
          <ModernCard
            title="Equipo del Proyecto"
            subtitle="Voluntarios asignados"
            icon="mdi-account-group"
            icon-color="info"
            variant="outlined"
            class="mb-6"
          >
            <template #content>
              <div v-if="getAssignedVolunteers().length === 0" class="text-center py-4">
                <v-icon size="64" color="grey-lighten-1">mdi-account-group-outline</v-icon>
                <p class="text-body-2 text-grey mt-2">No hay voluntarios asignados</p>
                <ModernButton
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-account-plus"
                  @click="openAssignVolunteerDialog"
                  size="small"
                  class="mt-2"
                >
                  Asignar Voluntario
                </ModernButton>
              </div>
              
              <div v-else>
                <div 
                  v-for="volunteer in getAssignedVolunteers()" 
                  :key="volunteer.id"
                  class="volunteer-item d-flex align-center justify-space-between mb-3"
                >
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="primary" class="mr-3">
                      <v-icon color="white">mdi-account</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-body-2 font-weight-medium">{{ volunteer.name }}</div>
                      <div class="text-caption text-grey">{{ volunteer.role || 'Voluntario' }}</div>
                    </div>
                  </div>
                  
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    @click="openVolunteerMenu(volunteer)"
                  ></v-btn>
                </div>
              </div>
            </template>
          </ModernCard>

          <!-- Activity Log -->
          <ModernCard
            title="Actividad Reciente"
            subtitle="Últimas acciones"
            icon="mdi-history"
            icon-color="warning"
            variant="gradient"
          >
            <template #content>
              <div v-if="recentActivities.length === 0" class="text-center py-4">
                <v-icon size="64" color="grey-lighten-1">mdi-history</v-icon>
                <p class="text-body-2 text-grey mt-2">No hay actividad reciente</p>
              </div>
              
              <div v-else>
            <v-timeline density="compact" side="end">
                  <v-timeline-item 
                    v-for="(activity, index) in recentActivities.slice(0, 5)" 
                    :key="index" 
                    :dot-color="activity.color"
                    :icon="activity.icon" 
                    size="small"
                  >
                <div class="d-flex justify-space-between flex-grow-1">
                      <div class="text-body-2">{{ activity.description }}</div>
                      <div class="text-caption text-grey">{{ formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: es }) }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
              </div>
            </template>
          </ModernCard>
        </v-col>
      </v-row>
    </div>
    <div v-else>
       <v-alert type="warning" prominent>
        No se pudo encontrar el proyecto.
      </v-alert>
    </div>

    <!-- Modern Dialogs -->
    
    <!-- Task Management Dialog -->
    <ModernDialog
      v-model="taskDialog"
      :title="isViewingTask ? 'Ver Tarea' : (currentTask ? 'Editar Tarea' : 'Nueva Tarea')"
      :icon="isViewingTask ? 'mdi-eye' : (currentTask ? 'mdi-pencil' : 'mdi-plus')"
      max-width="700px"
    >
      <template #content>
        <v-form @submit.prevent="saveTask" v-if="!isViewingTask">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="taskForm.description"
                label="Descripción de la Tarea"
                placeholder="Describe qué se debe hacer..."
                variant="outlined"
                required
                :rules="[
                  v => !!v || 'La descripción es requerida',
                  v => !v || v.length >= 10 || 'La descripción debe tener al menos 10 caracteres',
                  v => !v || v.length <= 1000 || 'La descripción no puede exceder 1000 caracteres'
                ]"
                :error-messages="getError('description')"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="taskForm.startDate"
                label="Fecha de Inicio"
                type="date"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="taskForm.endDate"
                label="Fecha de Fin"
                type="date"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="taskForm.prioridad"
                :items="priorityOptions"
                label="Prioridad"
                variant="outlined"
                required
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="taskForm.complejidad"
                :items="complexityOptions"
                label="Complejidad"
                variant="outlined"
                required
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="taskForm.id_estado"
                :items="taskStatusOptions"
                label="Estado"
                variant="outlined"
                required
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="taskForm.phaseId"
                :items="project?.phases || []"
                :item-title="(phase) => phase.name || phase.nombre"
                item-value="id"
                label="Fase"
                variant="outlined"
                required
              ></v-select>
            </v-col>
          </v-row>
          </v-form>
        
        <!-- View Mode -->
        <div v-else-if="currentTask" class="task-view-mode">
          <v-row>
            <v-col cols="12">
              <div class="d-flex align-center mb-4">
                <v-chip 
                  :color="getTaskStatusColor(currentTask.id_estado)" 
                  size="large"
                  class="mr-3"
                >
                  <v-icon start>{{ getTaskStatusIcon(currentTask.id_estado) }}</v-icon>
                  {{ getTaskStatus(currentTask.id_estado) }}
                </v-chip>
                
                <v-chip 
                  :color="getPriorityColor(currentTask.prioridad)" 
                  variant="tonal"
                  class="mr-3"
                >
                  {{ currentTask.prioridad }}
                </v-chip>
                
                <v-chip 
                  color="info" 
                  variant="tonal"
                >
                  {{ currentTask.complejidad }}
                </v-chip>
              </div>
              
              <h3 class="text-h6 mb-3">{{ currentTask.descripcion }}</h3>
              
              <v-divider class="mb-4"></v-divider>
              
              <div class="task-details">
                <div class="d-flex align-center mb-3">
                  <v-icon class="mr-3" color="primary">mdi-calendar-range</v-icon>
                  <div>
                    <div class="text-body-2 text-grey">Período</div>
                    <div class="text-body-1">{{ formatDateRange(currentTask.fecha_inicio, currentTask.fecha_fin) }}</div>
                  </div>
                </div>
                
                <div class="d-flex align-center mb-3">
                  <v-icon class="mr-3" color="info">mdi-view-list</v-icon>
                  <div>
                    <div class="text-body-2 text-grey">Fase</div>
                    <div class="text-body-1">{{ getPhaseName(currentTask.id_fase) }}</div>
                  </div>
                </div>
                
              </div>
            </v-col>
          </v-row>
        </div>
      </template>
      
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="taskDialog = false"
        >
          {{ isViewingTask ? 'Cerrar' : 'Cancelar' }}
        </ModernButton>
        
        <ModernButton
          v-if="!isViewingTask"
          color="primary"
          variant="flat"
          @click="saveTask"
          :loading="isLoading('addingTask') || isLoading('updatingTask')"
        >
          {{ currentTask ? 'Actualizar' : 'Crear' }}
        </ModernButton>
        
        <ModernButton
          v-if="isViewingTask"
          color="warning"
          variant="outlined"
          prepend-icon="mdi-pencil"
          @click="switchToEditMode"
        >
          Editar
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Phase Management Dialog -->
    <ModernDialog
      v-model="phaseDialog"
      :title="currentPhase ? 'Editar Fase' : 'Nueva Fase'"
      :icon="currentPhase ? 'mdi-pencil' : 'mdi-plus'"
      max-width="600px"
    >
      <template #content>
          <v-form @submit.prevent="savePhase">
          <v-text-field
            v-model="phaseForm.name"
            label="Nombre de la Fase"
            placeholder="Ej: Planificación, Ejecución, Evaluación..."
            variant="outlined"
            required
            :rules="[
              v => !!v || 'El nombre es requerido',
              v => !v || v.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
              v => !v || v.length <= 100 || 'El nombre no puede exceder 100 caracteres'
            ]"
            :error-messages="getError('name')"
            class="mb-4"
          ></v-text-field>
          
          <v-textarea
            v-model="phaseForm.description"
            label="Descripción"
            placeholder="Describe los objetivos y actividades de esta fase..."
            variant="outlined"
            rows="4"
            class="mb-4"
          ></v-textarea>
          
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="phaseForm.orden"
                label="Orden"
                type="number"
                variant="outlined"
                min="1"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="phaseForm.fecha_inicio"
                label="Fecha de Inicio"
                type="date"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          </v-form>
      </template>
      
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="phaseDialog = false"
        >
          Cancelar
        </ModernButton>
        
        <ModernButton
          color="primary"
          variant="flat"
          @click="savePhase"
          :loading="isLoading('addingPhase') || isLoading('updatingPhase')"
        >
          {{ currentPhase ? 'Actualizar' : 'Crear' }}
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Project Edit Dialog -->
    <ModernDialog
      v-model="editProjectDialog"
      title="Editar Proyecto"
      icon="mdi-pencil"
      max-width="800px"
    >
      <template #content>
          <v-form @submit.prevent="saveProjectChanges">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="projectForm.name"
                label="Nombre del Proyecto"
                variant="outlined"
                required
                :rules="[
                  v => !!v || 'El nombre es requerido',
                  v => !v || v.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                  v => !v || v.length <= 100 || 'El nombre no puede exceder 100 caracteres'
                ]"
                :error-messages="getError('name')"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="projectForm.location"
                label="Ubicación"
                variant="outlined"
                required
                :rules="[
                  v => !!v || 'La ubicación es requerida',
                  v => !v || v.length >= 3 || 'La ubicación debe tener al menos 3 caracteres'
                ]"
                :error-messages="getError('location')"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="projectForm.description"
                label="Descripción"
                variant="outlined"
                rows="3"
                required
                :rules="[
                  v => !!v || 'La descripción es requerida',
                  v => !v || v.length >= 10 || 'La descripción debe tener al menos 10 caracteres',
                  v => !v || v.length <= 1000 || 'La descripción no puede exceder 1000 caracteres'
                ]"
                :error-messages="getError('description')"
              ></v-textarea>
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="projectForm.objective"
                label="Objetivo"
                variant="outlined"
                rows="2"
                required
                :rules="[
                  v => !!v || 'El objetivo es requerido',
                  v => !v || v.length >= 10 || 'El objetivo debe tener al menos 10 caracteres',
                  v => !v || v.length <= 1000 || 'El objetivo no puede exceder 1000 caracteres'
                ]"
                :error-messages="getError('objective')"
              ></v-textarea>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="projectForm.startDate"
                label="Fecha de Inicio"
                type="date"
                variant="outlined"
                required
                :rules="[v => !!v || 'La fecha de inicio es requerida']"
                :error-messages="getError('startDate')"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="projectForm.endDate"
                label="Fecha de Fin"
                type="date"
                variant="outlined"
                required
                :rules="[v => !!v || 'La fecha de fin es requerida']"
                :error-messages="getError('endDate') || getError('dates')"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="projectForm.budget"
                label="Presupuesto Total"
                type="number"
                variant="outlined"
                prefix="$"
                suffix="COP"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="projectForm.id_estado"
                :items="projectStatusOptions"
                label="Estado del Proyecto"
                variant="outlined"
                required
                hint="Estado del proyecto (Activo/Inactivo)"
                persistent-hint
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-switch
                v-model="projectForm.es_publico"
                label="Visible en Catálogo de Voluntarios"
                color="success"
                hint="Si está activo, el proyecto aparecerá en el catálogo público para voluntarios"
                persistent-hint
              ></v-switch>
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="projectForm.requisitos"
                label="Requisitos para Participar"
                placeholder="Lista los requisitos para participar en este proyecto (ej: Ser mayor de 18 años, Disponibilidad de tiempo, Compromiso con la causa, etc.)"
                variant="outlined"
                rows="4"
                hint="Separa cada requisito con un salto de línea o viñetas"
                persistent-hint
              ></v-textarea>
            </v-col>
          </v-row>
          </v-form>
      </template>
      
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="editProjectDialog = false"
        >
          Cancelar
        </ModernButton>
        
        <ModernButton
          color="primary"
          variant="flat"
          @click="saveProjectChanges"
        >
          Guardar Cambios
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Volunteer Assignment Dialog -->
    <ModernDialog
      v-model="assignVolunteerDialog"
      title="Asignar Voluntario"
      icon="mdi-account-plus"
      max-width="600px"
    >
      <template #content>
        <v-form @submit.prevent="assignVolunteerToTask">
          <v-select
            v-model="selectedTaskForAssignmentId"
            :items="getAllTasks()"
            item-title="descripcion"
            item-value="id"
            label="Seleccionar Tarea"
            variant="outlined"
            required
            class="mb-4"
          ></v-select>
          
          <v-select
            v-model="selectedVolunteerId"
            :items="availableVolunteers"
            item-title="name"
            item-value="id_voluntario"
            label="Seleccionar Voluntario"
            variant="outlined"
            required
            class="mb-4"
          ></v-select>
          
          <v-select
            v-model="assignedRole"
            :items="availableProjectRoles"
            item-title="label"
            item-value="value"
            label="Rol Asignado"
            variant="outlined"
            required
            :loading="roleStore.loading"
            class="mb-4"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-chip size="small" :color="getRoleTypeColor(item.raw.tipo_rol)">
                    {{ getRoleTypeLabel(item.raw.tipo_rol) }}
                  </v-chip>
                </template>
              </v-list-item>
            </template>
          </v-select>
          
          <v-textarea
            v-model="assignmentNotes"
            label="Notas de Asignación"
            placeholder="Instrucciones especiales o comentarios..."
            variant="outlined"
            rows="3"
          ></v-textarea>
        </v-form>
      </template>
      
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="assignVolunteerDialog = false"
        >
          Cancelar
        </ModernButton>
        
        <ModernButton
          color="primary"
          variant="flat"
          @click="assignVolunteerToTask"
        >
          Asignar
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Manage Roles Dialog (Lista de Roles) -->
    <ModernDialog
      v-model="manageRolesDialog"
      title="Gestión de Roles"
      icon="mdi-account-cog"
      max-width="900px"
    >
      <template #content>
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6">Roles del Proyecto</h3>
          <ModernButton
            color="primary"
            variant="flat"
            prepend-icon="mdi-plus"
            @click="() => { manageRolesDialog = false; openAddRoleDialog(); }"
          >
            Nuevo Rol
          </ModernButton>
        </div>
        
        <div v-if="roleStore.loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="text-body-2 text-grey mt-2">Cargando roles...</p>
        </div>
        
        <div v-else-if="!projectRoles || projectRoles.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
          <p class="text-body-1 text-grey mt-4">No hay roles creados aún</p>
          <ModernButton
            color="primary"
            variant="outlined"
            prepend-icon="mdi-plus"
            @click="() => { manageRolesDialog = false; openAddRoleDialog(); }"
            class="mt-4"
          >
            Crear Primer Rol
          </ModernButton>
        </div>
        
        <v-list v-else class="pa-0">
          <v-list-item
            v-for="role in projectRoles"
            :key="role.id_rol || role.id"
            class="mb-2 border rounded-lg"
          >
            <template #prepend>
              <v-avatar :color="role.color || '#2196F3'" size="40">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
            </template>
            
            <v-list-item-title class="font-weight-medium">
              {{ role.nombre || role.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ role.descripcion || role.description || 'Sin descripción' }}
            </v-list-item-subtitle>
            
            <template #append>
              <div class="d-flex align-center gap-2">
                <v-chip
                  :color="getRoleTypeColor(role.tipo_rol)"
                  size="small"
                  variant="tonal"
                >
                  {{ getRoleTypeLabel(role.tipo_rol) }}
                </v-chip>
                
                <v-chip
                  :color="role.activo ? 'success' : 'error'"
                  size="small"
                  variant="tonal"
                >
                  {{ role.activo ? 'Activo' : 'Inactivo' }}
                </v-chip>
                
                <v-btn
                  icon="mdi-pencil"
                  color="primary"
                  size="small"
                  variant="text"
                  @click="() => { manageRolesDialog = false; openEditRoleDialog(role); }"
                ></v-btn>
                
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  size="small"
                  variant="text"
                  @click="confirmDeleteRole(role.id_rol || role.id)"
                  :disabled="role.tipo_rol === 'sistema'"
                ></v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </template>
      
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="manageRolesDialog = false"
        >
          Cerrar
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Role Management Dialog (Crear/Editar) -->
    <ModernDialog
      v-model="roleDialog"
      :title="currentRole ? 'Editar Rol' : 'Nuevo Rol'"
      :icon="currentRole ? 'mdi-pencil' : 'mdi-plus'"
      max-width="600px"
    >
      <template #content>
          <v-form @submit.prevent="saveRole">
          <v-select
            v-model="roleForm.tipo_rol"
            :items="roleTypes"
            item-title="label"
            item-value="value"
            label="Tipo de Rol"
            variant="outlined"
            required
            :disabled="!!currentRole"
            :rules="[v => !!v || 'El tipo de rol es requerido']"
            class="mb-4"
            @update:model-value="onRoleTypeChange"
          ></v-select>
          
          <v-text-field
            v-model="roleForm.name"
            label="Nombre del Rol"
            variant="outlined"
            required
            :rules="[v => !!v || 'El nombre es requerido']"
            class="mb-4"
          ></v-text-field>
          
          <v-textarea
            v-model="roleForm.description"
            label="Descripción"
            variant="outlined"
            rows="3"
            placeholder="Describe las responsabilidades de este rol..."
            class="mb-4"
          ></v-textarea>

          <v-switch
            v-model="roleForm.activo"
            label="Rol activo"
            color="primary"
            class="mb-4"
          ></v-switch>
          
          <v-color-picker
            v-model="roleForm.color"
            label="Color del Rol"
            mode="hex"
            hide-mode-switch
          ></v-color-picker>
          </v-form>
      </template>
      
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="roleDialog = false"
        >
          Cancelar
        </ModernButton>
        
        <ModernButton
          color="primary"
          variant="flat"
          @click="saveRole"
        >
          {{ currentRole ? 'Actualizar' : 'Crear' }}
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Confirm Delete Dialogs -->
    <ModernDialog
      v-model="confirmDeleteProjectDialog"
      title="Confirmar Eliminación"
      icon="mdi-alert"
      type="warning"
      max-width="500px"
    >
      <template #content>
        <p class="text-body-1 mb-2">¿Estás seguro de que quieres eliminar este proyecto?</p>
        <p class="text-body-2 text-grey">Esta acción no se puede deshacer. Se eliminarán todas las fases y tareas asociadas.</p>
      </template>
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="confirmDeleteProjectDialog = false"
          :disabled="isLoading('deletingProject')"
        >
          Cancelar
        </ModernButton>
        <ModernButton
          color="error"
          variant="flat"
          @click="confirmDeleteProject"
          :loading="isLoading('deletingProject')"
        >
          Eliminar
        </ModernButton>
      </template>
    </ModernDialog>

    <ModernDialog
      v-model="confirmDeletePhaseDialog"
      title="Confirmar Eliminación de Fase"
      icon="mdi-alert"
      type="warning"
      max-width="500px"
    >
      <template #content>
        <p class="text-body-1 mb-2">¿Estás seguro de que quieres eliminar esta fase?</p>
        <p class="text-body-2 text-grey">Se eliminarán todas las tareas asociadas a esta fase.</p>
      </template>
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="confirmDeletePhaseDialog = false"
          :disabled="isLoading('deletingPhase')"
        >
          Cancelar
        </ModernButton>
        <ModernButton
          color="error"
          variant="flat"
          @click="confirmDeletePhase"
          :loading="isLoading('deletingPhase')"
        >
          Eliminar
        </ModernButton>
      </template>
    </ModernDialog>

    <ModernDialog
      v-model="confirmDeleteTaskDialog"
      title="Confirmar Eliminación de Tarea"
      icon="mdi-alert"
      type="warning"
      max-width="500px"
    >
      <template #content>
        <p class="text-body-1 mb-2">¿Estás seguro de que quieres eliminar esta tarea?</p>
        <p class="text-body-2 text-grey">Esta acción no se puede deshacer.</p>
      </template>
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="confirmDeleteTaskDialog = false"
          :disabled="isLoading('deletingTask')"
        >
          Cancelar
        </ModernButton>
        <ModernButton
          color="error"
          variant="flat"
          @click="confirmDeleteTask"
          :loading="isLoading('deletingTask')"
        >
          Eliminar
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Beneficios Dialog -->
    <ModernDialog
      v-model="beneficioDialog"
      :title="project?.beneficio ? 'Editar Beneficios' : 'Configurar Beneficios'"
      icon="mdi-cash-multiple"
      max-width="700px"
    >
      <template #content>
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="beneficioForm.tipo_pago"
                :items="[
                  { title: 'Voluntariado', value: 'volunteer' },
                  { title: 'Estipendio', value: 'stipend' },
                  { title: 'Salario', value: 'salary' },
                  { title: 'Honorarios', value: 'honorarium' }
                ]"
                label="Tipo de Remuneración"
                variant="outlined"
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="beneficioForm.frecuencia"
                :items="[
                  { title: 'Sin frecuencia', value: 'none' },
                  { title: 'Mensual', value: 'monthly' },
                  { title: 'Semanal', value: 'weekly' },
                  { title: 'Por proyecto', value: 'project' }
                ]"
                label="Frecuencia de Pago"
                variant="outlined"
                :disabled="beneficioForm.tipo_pago === 'volunteer'"
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6" v-if="beneficioForm.tipo_pago !== 'volunteer'">
              <v-text-field
                v-model.number="beneficioForm.monto"
                label="Monto"
                type="number"
                variant="outlined"
                prefix="$"
                suffix="COP"
                min="0"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="beneficioForm.descripcion_pago"
                label="Descripción del Pago"
                variant="outlined"
                rows="3"
                placeholder="Describe los detalles de la remuneración..."
              ></v-textarea>
            </v-col>
            
            <v-col cols="12">
              <v-divider class="my-2"></v-divider>
              <p class="text-subtitle-2 mb-2">Beneficios Adicionales</p>
              
              <v-checkbox
                v-model="beneficioForm.incluye_transporte"
                label="Incluye Transporte"
                color="success"
                hide-details
              ></v-checkbox>
              
              <v-checkbox
                v-model="beneficioForm.incluye_alimentacion"
                label="Incluye Alimentación"
                color="success"
                hide-details
              ></v-checkbox>
              
              <v-checkbox
                v-model="beneficioForm.incluye_materiales"
                label="Incluye Materiales de Trabajo"
                color="success"
                hide-details
              ></v-checkbox>
              
              <v-checkbox
                v-model="beneficioForm.incluye_seguro"
                label="Incluye Seguro de Accidentes"
                color="success"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="beneficioDialog = false"
          :disabled="isLoading('savingBeneficio')"
        >
          Cancelar
        </ModernButton>
        <ModernButton
          color="success"
          variant="flat"
          @click="saveBeneficio"
          :loading="isLoading('savingBeneficio')"
        >
          Guardar
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Solicitudes Dialog -->
    <ModernDialog
      v-model="solicitudesDialog"
      title="Solicitudes de Inscripción"
      icon="mdi-account-plus"
      max-width="900px"
    >
      <template #content>
        <div v-if="solicitudes.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-inbox</v-icon>
          <p class="text-body-1 text-grey mt-4">No hay solicitudes pendientes</p>
        </div>
        
        <v-list v-else>
          <v-list-item
            v-for="solicitud in solicitudes"
            :key="solicitud.id_solicitud"
            class="mb-2"
          >
            <template #prepend>
              <v-avatar color="primary" size="40">
                {{ solicitud.voluntario?.usuario?.nombre?.charAt(0) || 'V' }}
              </v-avatar>
            </template>
            
            <v-list-item-title>
              {{ solicitud.voluntario?.usuario?.nombre || 'Voluntario' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ solicitud.voluntario?.usuario?.email || '' }}
            </v-list-item-subtitle>
            
            <template #append>
              <div class="d-flex align-center gap-2">
                <v-chip
                  :color="solicitud.estado === 'aprobada' ? 'success' : solicitud.estado === 'rechazada' ? 'error' : 'warning'"
                  size="small"
                  class="mr-2"
                >
                  {{ solicitud.estado === 'aprobada' ? 'Aprobada' : solicitud.estado === 'rechazada' ? 'Rechazada' : 'Pendiente' }}
                </v-chip>
                
                <v-btn
                  v-if="solicitud.estado === 'pendiente'"
                  icon="mdi-check"
                  color="success"
                  size="small"
                  variant="text"
                  @click="updateSolicitudEstado(solicitud.id_solicitud, 'aprobada')"
                  :loading="isLoading('updatingSolicitud')"
                ></v-btn>
                
                <v-btn
                  v-if="solicitud.estado === 'pendiente'"
                  icon="mdi-close"
                  color="error"
                  size="small"
                  variant="text"
                  @click="updateSolicitudEstado(solicitud.id_solicitud, 'rechazada')"
                  :loading="isLoading('updatingSolicitud')"
                ></v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </template>
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="solicitudesDialog = false"
        >
          Cerrar
        </ModernButton>
      </template>
    </ModernDialog>

    <!-- Vista Previa Dialog -->
    <ModernDialog
      v-model="previewDialog"
      title="Vista Previa del Proyecto"
      icon="mdi-eye"
      max-width="1000px"
    >
      <template #content>
        <ProjectCatalogPreview :project="project" />
      </template>
      <template #actions>
        <ModernButton
          color="grey"
          variant="outlined"
          @click="previewDialog = false"
        >
          Cerrar
        </ModernButton>
      </template>
    </ModernDialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from '@/plugins/axios';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';
import { useEstadoStore } from '@/features/organization/stores/estadoStore';
import { useProyectoBeneficioStore } from '@/features/organization/projects/stores/proyectoBeneficioStore';
import { useSolicitudInscripcionStore } from '@/features/organization/projects/stores/solicitudInscripcionStore';
import { useFormularioInscripcionStore } from '@/features/organization/projects/stores/formularioInscripcionStore';
import { useFormValidation } from '@/features/organization/projects/composables/useFormValidation';
import { useProjectOperations } from '@/features/organization/projects/composables/useProjectOperations';
import {
  PROJECT_STATUS_OPTIONS,
  TASK_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  COMPLEXITY_OPTIONS,
  getStatusIcon,
  getStatusColor,
  getStatusText,
  getTaskStatusIcon,
  getTaskStatusColor,
  getTaskStatusText,
  getPriorityColor
} from '@/features/organization/projects/constants/projectConstants';
import KanbanBoard from '../components/KanbanBoard.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import ModernCard from '@/components/ui/ModernCard.vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ProjectCatalogPreview from '../components/ProjectCatalogPreview.vue';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const route = useRoute();
const router = useRouter();

const projectStore = useProjectStore();
const volunteerStore = useVolunteerStore();
const roleStore = useRoleStore();
const estadoStore = useEstadoStore();
const beneficioStore = useProyectoBeneficioStore();
const solicitudStore = useSolicitudInscripcionStore();
const formularioStore = useFormularioInscripcionStore();

// Composables
const { 
  errors: validationErrors, 
  validateProjectForm, 
  validatePhaseForm, 
  validateTaskForm,
  clearErrors,
  getError
} = useFormValidation();

const { 
  loadingStates, 
  handleOperation, 
  isLoading 
} = useProjectOperations();

const { loading: projectLoading, error: projectError } = storeToRefs(projectStore);
const { customRoles, projectRoles } = storeToRefs(roleStore);
const { volunteers } = storeToRefs(volunteerStore);
const { allEstados } = storeToRefs(estadoStore);

const project = computed(() => projectStore.getProjectById(parseInt(route.params.id, 10)));

onMounted(async () => {
  const projectId = parseInt(route.params.id, 10);
  if (projectId) {
    await projectStore.fetchProjectById(projectId);
    // Cargar roles del proyecto
    await roleStore.fetchProjectRoles(projectId);
    // Cargar solicitudes del proyecto
    await solicitudStore.fetchByProject(projectId);
    solicitudes.value = solicitudStore.allSolicitudes;
  }
  // Cargar estados disponibles
  await estadoStore.fetchEstados();
});


const editProjectDialog = ref(false);

// Dialog states
const phaseDialog = ref(false);
const currentPhase = ref(null);
const phaseForm = ref({ name: '', description: '', orden: 1 });
const manageRolesDialog = ref(false);
const assignVolunteerDialog = ref(false);
const selectedVolunteerId = ref(null);
const assignedRole = ref(null); // Cambiar de string a number (id_rol)
const selectedTaskForAssignmentId = ref(null);
const taskDialog = ref(false);
const currentTask = ref(null);
const taskForm = ref({
  description: '',
  startDate: '',
  endDate: '',
  prioridad: 'Media',
  complejidad: 'Media',
  id_estado: 1,
  phaseId: null
});
const isViewingTask = ref(false);

// Confirm dialogs
const confirmDeleteProjectDialog = ref(false);
const confirmDeletePhaseDialog = ref(false);
const confirmDeleteTaskDialog = ref(false);
const phaseToDelete = ref(null);
const taskToDelete = ref(null);

// Beneficios y Solicitudes dialogs
const beneficioDialog = ref(false);
const beneficioForm = ref({
  tipo_pago: 'volunteer',
  monto: 0,
  frecuencia: 'none',
  descripcion_pago: '',
  incluye_transporte: false,
  incluye_alimentacion: false,
  incluye_materiales: false,
  incluye_seguro: false
});
const previewDialog = ref(false);
const solicitudesDialog = ref(false);
const solicitudes = ref([]);


// Options for selects - ahora usando constantes
const priorityOptions = PRIORITY_OPTIONS;
const complexityOptions = COMPLEXITY_OPTIONS;
const taskStatusOptions = TASK_STATUS_OPTIONS;
const projectStatusOptions = computed(() => {
  // Si hay estados cargados, usarlos, sino usar los predeterminados
  if (allEstados.value && allEstados.value.length > 0) {
    return allEstados.value.map(estado => ({
      title: estado.nombre.charAt(0).toUpperCase() + estado.nombre.slice(1),
      value: estado.id_estado,
      icon: getStatusIcon(estado.id_estado),
      color: getStatusColor(estado.id_estado)
    }));
  }
  return PROJECT_STATUS_OPTIONS;
});

// Snackbar state
const snackbar = ref({ show: false, text: '', color: '' });

function showSnackbar(text, color = 'success') {
  snackbar.value = { show: true, text, color };
}

// Computed property for tasks by phase for the structural view
const tasksByPhase = computed(() => {
  return (phaseId) => {
    if (!project.value || !project.value.phases) return [];
    const phase = project.value.phases.find(p => p.id === phaseId);
    return phase?.tareas || [];
  };
});

// Activity Log
const recentActivities = ref([]);
const logActivity = (description, icon = 'mdi-history', color = 'grey') => {
  recentActivities.value.unshift({ description, icon, color, timestamp: new Date() });
  if (recentActivities.value.length > 7) { // Increased size a bit
    recentActivities.value.pop();
  }
};

// Functions for phase management
function openAddPhaseDialog() {
  currentPhase.value = null;
  phaseForm.value = { 
    name: '', 
    description: '', 
    orden: (project.value?.phases?.length || 0) + 1 
  };
  phaseDialog.value = true;
}

function openEditPhaseDialog(phase) {
  currentPhase.value = phase;
  phaseForm.value = { ...phase };
  phaseDialog.value = true;
}

async function savePhase() {
  if (!project.value) return;
  
  clearErrors();
  if (!validatePhaseForm(phaseForm.value)) {
    showSnackbar('Por favor corrige los errores en el formulario', 'error');
    return;
  }
  
  const phaseData = {
    nombre: phaseForm.value.name,
    descripcion: phaseForm.value.description,
    orden: phaseForm.value.orden || (project.value.phases?.length || 0) + 1
  };
  
  const operation = currentPhase.value
    ? () => projectStore.updateProjectPhase(project.value.id, currentPhase.value.id, phaseData)
    : () => projectStore.addProjectPhase(project.value.id, phaseData);
  
  const successMessage = currentPhase.value
    ? `Fase '${phaseForm.value.name}' actualizada correctamente`
    : `Fase '${phaseForm.value.name}' añadida correctamente`;
  
  await handleOperation(
    operation,
    currentPhase.value ? 'updatingPhase' : 'addingPhase',
    successMessage,
    'Error al guardar la fase',
    async () => {
      logActivity(
        currentPhase.value 
          ? `Fase '${phaseForm.value.name}' actualizada` 
          : `Nueva fase '${phaseForm.value.name}' añadida`,
        'mdi-check-circle',
        'success'
      );
      await projectStore.fetchProjectById(project.value.id);
      phaseDialog.value = false;
      phaseForm.value = { name: '', description: '', orden: 1 };
    }
  );
}

function openDeletePhaseDialog(phaseId) {
  phaseToDelete.value = phaseId;
  confirmDeletePhaseDialog.value = true;
}

async function confirmDeletePhase() {
  if (!phaseToDelete.value) return;
  
  await handleOperation(
    () => projectStore.deleteProjectPhase(project.value.id, phaseToDelete.value),
    'deletingPhase',
    'Fase eliminada correctamente',
    'Error al eliminar la fase',
    async () => {
      logActivity('Fase eliminada', 'mdi-delete', 'error');
      await projectStore.fetchProjectById(project.value.id);
      confirmDeletePhaseDialog.value = false;
      phaseToDelete.value = null;
    }
  );
}


function openDeleteTaskDialog(taskId) {
  taskToDelete.value = taskId;
  confirmDeleteTaskDialog.value = true;
}

async function confirmDeleteTask() {
  if (!taskToDelete.value) return;
  
  await handleOperation(
    () => projectStore.deleteProjectTask(project.value.id, taskToDelete.value),
    'deletingTask',
    'Tarea eliminada correctamente',
    'Error al eliminar la tarea',
    async () => {
      logActivity('Tarea eliminada', 'mdi-delete', 'error');
      await projectStore.fetchProjectById(project.value.id);
      confirmDeleteTaskDialog.value = false;
      taskToDelete.value = null;
    }
  );
}

// Functions for task management (with logging)
const saveTask = async () => {
  if (!project.value) return;

  clearErrors();
  if (!validateTaskForm(taskForm.value)) {
    showSnackbar('Por favor corrige los errores en el formulario', 'error');
    return;
  }

  const taskData = {
    descripcion: taskForm.value.description,
    fecha_inicio: taskForm.value.startDate,
    fecha_fin: taskForm.value.endDate,
    prioridad: taskForm.value.prioridad || 'Media',
    complejidad: taskForm.value.complejidad || 'Media',
    id_estado: taskForm.value.id_estado || 1,
    id_fase: taskForm.value.phaseId
  };

  const operation = currentTask.value
    ? () => projectStore.updateProjectTask(project.value.id, currentTask.value.id, taskData)
    : () => projectStore.addProjectTask(project.value.id, taskData);

  const successMessage = currentTask.value
    ? `Tarea '${taskForm.value.description}' actualizada correctamente`
    : `Tarea '${taskForm.value.description}' añadida correctamente`;

  await handleOperation(
    operation,
    currentTask.value ? 'updatingTask' : 'addingTask',
    successMessage,
    'Error al guardar la tarea',
    async () => {
      logActivity(
        currentTask.value
          ? `Tarea '${taskForm.value.description}' actualizada`
          : `Nueva tarea '${taskForm.value.description}' añadida`,
        'mdi-check-circle',
        'success'
      );
      await projectStore.fetchProjectById(project.value.id);
      taskDialog.value = false;
      currentTask.value = null;
      isViewingTask.value = false;
      taskForm.value = {
        description: '',
        startDate: '',
        endDate: '',
        prioridad: 'Media',
        complejidad: 'Media',
        id_estado: 1,
        phaseId: null
      };
    }
  );
};

const saveProjectChanges = async () => {
  if (!project.value) return;
  
  clearErrors();
  if (!validateProjectForm(projectForm.value)) {
    showSnackbar('Por favor corrige los errores en el formulario', 'error');
    return;
  }
  
  const projectData = {
    nombre: projectForm.value.name,
    descripcion: projectForm.value.description,
    objetivo: projectForm.value.objective,
    ubicacion: projectForm.value.location,
    fecha_inicio: projectForm.value.startDate,
    fecha_fin: projectForm.value.endDate,
    presupuesto_total: projectForm.value.budget,
    id_estado: projectForm.value.id_estado,
    es_publico: projectForm.value.es_publico,
    requisitos: projectForm.value.requisitos || null
  };
  
  await handleOperation(
    () => projectStore.updateProject(project.value.id, projectData),
    'savingProject',
    'Proyecto actualizado correctamente',
    'Error al actualizar el proyecto',
    async () => {
      logActivity('Proyecto actualizado', 'mdi-content-save', 'success');
      await projectStore.fetchProjectById(project.value.id);
      editProjectDialog.value = false;
    }
  );
};

const projectForm = ref({
  name: '',
  description: '',
  objective: '',
  location: '',
  startDate: '',
  endDate: '',
  budget: 0,
  id_estado: 2, // Por defecto: Activo (según BD: 1=inactivo, 2=activo)
  es_publico: false, // Por defecto: No visible en catálogo
  requisitos: '' // Requisitos del proyecto
});

const openEditProjectDialog = () => {
  if (project.value) {
    projectForm.value = { 
      name: project.value.name || '',
      description: project.value.description || '',
      objective: project.value.objective || '',
      location: project.value.location || '',
      startDate: project.value.startDate || '',
      endDate: project.value.endDate || '',
      budget: project.value.budget || 0,
      id_estado: project.value.id_estado || 2, // Por defecto: Activo
      es_publico: project.value.es_publico !== undefined ? project.value.es_publico : false,
      requisitos: project.value.requisitos || ''
    };
  }
  editProjectDialog.value = true;
};

const openAddTaskDialog = (task = null, phaseId = null) => {
  currentTask.value = task;
  isViewingTask.value = !!task;
  if (task) {
    taskForm.value = { 
      description: task.descripcion,
      startDate: task.fecha_inicio,
      endDate: task.fecha_fin,
      prioridad: task.prioridad,
      complejidad: task.complejidad,
      id_estado: task.id_estado,
      phaseId: task.id_fase
    };
    logActivity(`Abriendo diálogo para ${isViewingTask.value ? 'ver' : 'editar'} tarea: ${task.descripcion}.`, 'mdi-playlist-edit', 'warning');
  } else {
    taskForm.value = {
      description: '',
      startDate: '',
      endDate: '',
      prioridad: 'Media',
      complejidad: 'Media',
      id_estado: 1,
      phaseId: phaseId || (project.value?.phases?.length > 0 ? project.value.phases[0].id : null)
    };
    logActivity('Abriendo diálogo para añadir nueva tarea.', 'mdi-playlist-plus', 'info');
  }
  taskDialog.value = true;
};

const openEditTaskDialog = (task) => {
  openAddTaskDialog(task);
};

const roleDialog = ref(false);
const currentRole = ref(null);
const roleForm = ref({ 
  name: '', 
  description: '',
  tipo_rol: 'proyecto',
  id_organizacion: null,
  id_proyecto: null,
  activo: true,
  color: '#2196F3' 
});

const roleTypes = [
  { label: 'Rol del Sistema (Global)', value: 'sistema', disabled: true }, // Solo admin puede crear
  { label: 'Rol de Organización (Reutilizable)', value: 'organizacion' },
  { label: 'Rol de Proyecto (Específico)', value: 'proyecto' }
];

const onRoleTypeChange = () => {
  // Limpiar campos según el tipo seleccionado
  if (roleForm.value.tipo_rol === 'sistema') {
    roleForm.value.id_organizacion = undefined;
    roleForm.value.id_proyecto = undefined;
  } else if (roleForm.value.tipo_rol === 'organizacion') {
    roleForm.value.id_proyecto = undefined;
    // Establecer id_organizacion del proyecto actual si existe
    if (project.value?.id_organizacion) {
      roleForm.value.id_organizacion = project.value.id_organizacion;
    } else {
      roleForm.value.id_organizacion = undefined;
    }
  } else if (roleForm.value.tipo_rol === 'proyecto') {
    roleForm.value.id_organizacion = undefined;
    // Establecer id_proyecto del proyecto actual
    if (project.value?.id_proyecto) {
      roleForm.value.id_proyecto = project.value.id_proyecto;
    } else {
      roleForm.value.id_proyecto = undefined;
    }
  }
};

const openAddRoleDialog = () => {
  currentRole.value = null;
  const projectId = project.value?.id_proyecto;
  roleForm.value = { 
    name: '', 
    description: '',
    tipo_rol: 'proyecto', // Por defecto, rol de proyecto
    id_organizacion: undefined, // No enviar null, usar undefined
    id_proyecto: projectId || undefined, // No enviar null, usar undefined
    activo: true,
    color: '#2196F3' 
  };
  roleDialog.value = true;
};

const openEditRoleDialog = (role) => {
  currentRole.value = role;
  roleForm.value = { 
    id: role.id || role.id_rol,
    id_rol: role.id_rol || role.id,
    name: role.name || role.nombre || '',
    nombre: role.nombre || role.name || '',
    description: role.description || role.descripcion || '',
    descripcion: role.descripcion || role.description || '',
    tipo_rol: role.tipo_rol || 'sistema',
    id_organizacion: role.id_organizacion || null,
    id_proyecto: role.id_proyecto || null,
    activo: role.activo !== undefined ? role.activo : true,
    color: role.color || '#2196F3'
  };
  roleDialog.value = true;
};

const saveRole = async () => {
  if (!roleForm.value.name?.trim()) {
    showSnackbar('El nombre del rol es requerido', 'warning');
    return;
  }

  if (!roleForm.value.tipo_rol) {
    showSnackbar('El tipo de rol es requerido', 'warning');
    return;
  }

  // Validar campos según tipo
  if (roleForm.value.tipo_rol === 'organizacion' && !roleForm.value.id_organizacion) {
    showSnackbar('La organización es requerida para roles de organización', 'warning');
    return;
  }

  if (roleForm.value.tipo_rol === 'proyecto' && !roleForm.value.id_proyecto) {
    showSnackbar('El proyecto es requerido para roles de proyecto', 'warning');
    return;
  }

  try {
    if (currentRole.value) {
      // Incluir el id_rol para la actualización
      const roleToUpdate = {
        ...roleForm.value,
        id_rol: currentRole.value.id_rol || currentRole.value.id
      };
      await roleStore.updateRole(roleToUpdate);
      logActivity(`Rol '${roleForm.value.name}' actualizado`, 'mdi-account-cog', 'success');
    } else {
      await roleStore.addRole(roleForm.value);
      logActivity(`Nuevo rol '${roleForm.value.name}' creado`, 'mdi-account-plus', 'primary');
    }
    roleDialog.value = false;
    // Recargar roles del proyecto para asegurar sincronización
    if (project.value?.id_proyecto) {
      await roleStore.fetchProjectRoles(project.value.id_proyecto);
    }
  } catch (error) {
    console.error('Error saving role:', error);
    // El error ya se muestra en el store
  }
};

const confirmDeleteRole = async (roleId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
    try {
      await roleStore.deleteRole(roleId);
      showSnackbar('Rol eliminado correctamente', 'success');
      logActivity('Rol eliminado', 'mdi-delete', 'error');
      // Recargar roles después de eliminar
      if (project.value?.id_proyecto) {
        await roleStore.fetchProjectRoles(project.value.id_proyecto);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      showSnackbar('Error al eliminar el rol', 'error');
    }
  }
};

const updateTaskStatusFromKanban = async ({ taskId, newStatus }) => {
  if (!project.value) return;
  try {
    const taskToUpdate = getAllTasks().find(task => task.id === parseInt(taskId, 10));
    if (taskToUpdate) {
      const taskData = { 
        descripcion: taskToUpdate.descripcion,
        fecha_inicio: taskToUpdate.fecha_inicio,
        fecha_fin: taskToUpdate.fecha_fin,
        prioridad: taskToUpdate.prioridad,
        complejidad: taskToUpdate.complejidad,
        id_estado: newStatus,
        id_fase: taskToUpdate.id_fase
      };
      await projectStore.updateProjectTask(project.value.id, taskToUpdate.id, taskData);
      
      // Actualizar el estado localmente sin recargar todo el proyecto
      if (project.value.phases) {
        project.value.phases.forEach(phase => {
          if (phase.tareas) {
            phase.tareas.forEach(task => {
              if (task.id === parseInt(taskId, 10)) {
                task.id_estado = newStatus;
              }
            });
          }
        });
      }
      
      logActivity(`Estado de la tarea '${taskToUpdate.descripcion}' actualizado`, 'mdi-check-circle', 'success');
      // No recargar todo el proyecto para evitar el loading
      // await projectStore.fetchProjectById(project.value.id);
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    showSnackbar(error.message || 'Error al actualizar el estado de la tarea', 'error');
    // Si hay error, recargar para sincronizar
    if (project.value?.id) {
      await projectStore.fetchProjectById(project.value.id);
    }
  }
};

const availableProjectRoles = computed(() => {
  if (!projectRoles.value || !Array.isArray(projectRoles.value)) {
    return [];
  }
  return projectRoles.value
    .filter(rol => rol.activo !== false)
    .map(rol => ({
      value: rol.id_rol,
      label: `${rol.nombre}${rol.tipo_rol ? ` (${getRoleTypeLabel(rol.tipo_rol)})` : ''}`,
      tipo_rol: rol.tipo_rol || 'sistema',
      ...rol
    }));
});

const getRoleTypeLabel = (tipo) => {
  const labels = {
    'sistema': 'Sistema',
    'organizacion': 'Organización',
    'proyecto': 'Proyecto'
  };
  return labels[tipo] || 'Sistema';
};

const getRoleTypeColor = (tipo) => {
  const colors = {
    'sistema': 'primary',
    'organizacion': 'info',
    'proyecto': 'success'
  };
  return colors[tipo] || 'primary';
};

const availableVolunteers = computed(() => {
  // Obtener voluntarios con solicitudes aprobadas para este proyecto
  const solicitudesAprobadas = solicitudes.value.filter(s => s.estado === 'aprobada');
  
  if (solicitudesAprobadas.length === 0) {
    return [];
  }

  // Mapear desde las solicitudes para obtener datos completos del voluntario
  return solicitudesAprobadas.map(solicitud => {
    const voluntario = solicitud.voluntario;
    const usuario = voluntario?.usuario;
    
    return {
      id_voluntario: solicitud.id_voluntario || voluntario?.id_voluntario,
      name: usuario?.nombre || voluntario?.nombre || 'Voluntario sin nombre',
      email: usuario?.email || voluntario?.email || '',
      // Incluir datos completos para referencia
      voluntario: voluntario,
      usuario: usuario
    };
  });
});

const openAssignVolunteerDialog = async () => {
  // Recargar solicitudes del proyecto para obtener voluntarios aprobados actualizados
  if (project.value?.id_proyecto) {
    await solicitudStore.fetchByProject(project.value.id_proyecto);
    solicitudes.value = solicitudStore.allSolicitudes;
  }
  
  // Cargar roles del proyecto
  if (project.value?.id_proyecto) {
    await roleStore.fetchProjectRoles(project.value.id_proyecto);
  }
  
  // Verificar que hay voluntarios aprobados disponibles
  if (availableVolunteers.value.length === 0) {
    showSnackbar('No hay voluntarios aprobados disponibles para asignar. Primero aprueba las solicitudes de inscripción.', 'warning');
    return;
  }
  
  assignVolunteerDialog.value = true;
};

const assignVolunteerToTask = async () => {
  if (!selectedTaskForAssignmentId.value || !selectedVolunteerId.value) {
    showSnackbar('Por favor selecciona una tarea y un voluntario', 'warning');
    return;
  }

  if (!assignedRole.value) {
    showSnackbar('Por favor selecciona un rol', 'warning');
    return;
  }

  try {
    // Usar el endpoint de asignacion directamente con id_rol
    const response = await axios.post('/asignacion', {
      id_tarea: selectedTaskForAssignmentId.value,
      id_voluntario: selectedVolunteerId.value,
      id_rol: assignedRole.value
    });
    
    logActivity(`Voluntario asignado a tarea`, 'mdi-account-check', 'success');
    showSnackbar('Voluntario asignado correctamente');
    
    // Refresh project data
    await projectStore.fetchProjectById(project.value.id);
    
    // Reset form
    assignVolunteerDialog.value = false;
    selectedVolunteerId.value = null;
    assignedRole.value = null;
    selectedTaskForAssignmentId.value = null;
    assignmentNotes.value = '';
  } catch (error) {
    console.error('Error assigning volunteer:', error);
    showSnackbar(error.response?.data?.message || error.message || 'Error al asignar voluntario', 'error');
  }
};

// Additional helper functions
function getAllTasks() {
  if (!project.value || !project.value.phases) return [];
  return project.value.phases.flatMap(phase => phase.tareas || []);
}

function getTotalTasks() {
  return getAllTasks().length;
}

function getCompletedTasksByPhase(phaseId) {
  if (!project.value || !project.value.phases) return 0;
  const phase = project.value.phases.find(p => p.id === phaseId);
  if (!phase || !phase.tareas) return 0;
  return phase.tareas.filter(task => task.id_estado === 3).length; // Assuming 3 is completed
}

// Estados del proyecto - ahora usando funciones de constantes (ya importadas arriba)

function getPhaseStatus(phase) {
  if (!phase.tareas || phase.tareas.length === 0) return 'Sin tareas';
  const completed = phase.tareas.filter(task => task.id_estado === 3).length;
  const total = phase.tareas.length;
  if (completed === total) return 'Completada';
  if (completed > 0) return 'En progreso';
  return 'Pendiente';
}

function getPhaseStatusColor(phase) {
  if (!phase.tareas || phase.tareas.length === 0) return 'grey';
  const completed = phase.tareas.filter(task => task.id_estado === 3).length;
  const total = phase.tareas.length;
  if (completed === total) return 'success';
  if (completed > 0) return 'info';
  return 'warning';
}

// Funciones de estado de tarea - ahora usando funciones de constantes (ya importadas arriba)
function getTaskStatus(taskStatusId) {
  return getTaskStatusText(taskStatusId);
}

// Funciones de formato
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('COP', '').trim();
}

function getTipoPagoText(tipo) {
  const tipos = {
    'volunteer': 'Voluntariado',
    'stipend': 'Estipendio',
    'salary': 'Salario',
    'honorarium': 'Honorarios'
  };
  return tipos[tipo] || tipo;
}

function getFrecuenciaText(frecuencia) {
  const frecuencias = {
    'none': 'Sin frecuencia',
    'monthly': 'Mensual',
    'weekly': 'Semanal',
    'project': 'Por proyecto'
  };
  return frecuencias[frecuencia] || frecuencia;
}

// Funciones de beneficios
async function openBeneficioDialog() {
  if (project.value?.beneficio) {
    // Cargar beneficios existentes
    beneficioForm.value = {
      tipo_pago: project.value.beneficio.tipo_pago || 'volunteer',
      monto: project.value.beneficio.monto || 0,
      frecuencia: project.value.beneficio.frecuencia || 'none',
      descripcion_pago: project.value.beneficio.descripcion_pago || '',
      incluye_transporte: project.value.beneficio.incluye_transporte || false,
      incluye_alimentacion: project.value.beneficio.incluye_alimentacion || false,
      incluye_materiales: project.value.beneficio.incluye_materiales || false,
      incluye_seguro: project.value.beneficio.incluye_seguro || false
    };
  } else {
    // Resetear formulario
    beneficioForm.value = {
      tipo_pago: 'volunteer',
      monto: 0,
      frecuencia: 'none',
      descripcion_pago: '',
      incluye_transporte: false,
      incluye_alimentacion: false,
      incluye_materiales: false,
      incluye_seguro: false
    };
  }
  beneficioDialog.value = true;
}

async function saveBeneficio() {
  const projectId = project.value?.id;
  if (!projectId) return;

  await handleOperation(
    async () => {
      const beneficioData = {
        id_proyecto: projectId,
        ...beneficioForm.value
      };

      // Verificar si ya existe
      const existing = await beneficioStore.getBeneficioByProject(projectId);
      
      if (existing) {
        return await beneficioStore.updateBeneficio(projectId, beneficioData);
      } else {
        return await beneficioStore.createBeneficio(beneficioData);
      }
    },
    'savingBeneficio',
    'Beneficios guardados correctamente',
    'Error al guardar los beneficios',
    async () => {
      await projectStore.fetchProjectById(projectId);
      beneficioDialog.value = false;
    }
  );
}

function openPreviewDialog() {
  previewDialog.value = true;
}

async function openSolicitudesDialog() {
  const projectId = project.value?.id;
  if (!projectId) return;

  await handleOperation(
    () => solicitudStore.fetchByProject(projectId),
    'loadingSolicitudes',
    '',
    'Error al cargar las solicitudes',
    () => {
      solicitudes.value = solicitudStore.allSolicitudes;
      solicitudesDialog.value = true;
    }
  );
}

async function updateSolicitudEstado(solicitudId, nuevoEstado) {
  await handleOperation(
    () => solicitudStore.updateSolicitud(solicitudId, { estado: nuevoEstado }),
    'updatingSolicitud',
    `Solicitud ${nuevoEstado === 'aprobada' ? 'aprobada' : nuevoEstado === 'rechazada' ? 'rechazada' : 'actualizada'} correctamente`,
    'Error al actualizar la solicitud',
    async () => {
      await solicitudStore.fetchByProject(project.value.id);
      solicitudes.value = solicitudStore.allSolicitudes;
      
      // Si se aprobó, recargar voluntarios para que aparezcan disponibles
      if (nuevoEstado === 'aprobada') {
        if (volunteerStore.fetchVolunteers) {
          await volunteerStore.fetchVolunteers();
        }
      }
      
      // Recargar proyecto para actualizar asignaciones
      await projectStore.fetchProjectById(project.value.id);
    }
  );
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Fechas no especificadas';
  const start = new Date(startDate).toLocaleDateString('es-CO');
  const end = new Date(endDate).toLocaleDateString('es-CO');
  return `${start} - ${end}`;
}

async function toggleProjectVisibility() {
  if (!project.value) return;
  try {
    const newVisibility = !project.value.es_publico;
    await projectStore.updateProject(project.value.id, { 
      es_publico: newVisibility,
      // Mantener todos los demás campos
      nombre: project.value.name,
      descripcion: project.value.description,
      objetivo: project.value.objective,
      ubicacion: project.value.location,
      fecha_inicio: project.value.startDate,
      fecha_fin: project.value.endDate,
      presupuesto_total: project.value.budget,
      id_estado: project.value.id_estado
    });
    await projectStore.fetchProjectById(project.value.id);
    logActivity(`Visibilidad del proyecto cambiada a ${newVisibility ? 'Visible en catálogo' : 'Oculto del catálogo'}`, 'mdi-eye', 'info');
    showSnackbar(`Proyecto ${newVisibility ? 'visible' : 'oculto'} en el catálogo de voluntarios`);
  } catch (error) {
    console.error('Error toggling project visibility:', error);
    showSnackbar(error.message || 'Error al cambiar la visibilidad del proyecto', 'error');
  }
}

// New functions for enhanced management
function switchToEditMode() {
  isViewingTask.value = false;
}

// getTaskStatusIcon ya está importado de constantes

function getPhaseName(phaseId) {
  if (!project.value?.phases) return 'Sin fase';
  const phase = project.value.phases.find(p => p.id === phaseId);
  return phase?.name || 'Sin fase';
}

function getProjectProgress() {
  if (!project.value?.phases) return 0;
  const totalTasks = getTotalTasks();
  const completedTasks = getCompletedTasksCount();
  return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
}

function getTasksProgress() {
  return getProjectProgress();
}

function getCompletedPhasesCount() {
  if (!project.value?.phases) return 0;
  return project.value.phases.filter(phase => {
    if (!phase.tareas || phase.tareas.length === 0) return false;
    return phase.tareas.every(task => task.id_estado === 3);
  }).length;
}

function getCompletedTasksCount() {
  return getAllTasks().filter(task => task.id_estado === 3).length;
}

function getAssignedVolunteers() {
  if (!project.value || !project.value.phases) return [];
  
  // Obtener todas las asignaciones de todas las tareas del proyecto
  const asignaciones = [];
  
  project.value.phases.forEach(phase => {
    if (phase.tareas) {
      phase.tareas.forEach(tarea => {
        if (tarea.asignaciones) {
          tarea.asignaciones.forEach(asignacion => {
            asignaciones.push({
              id: asignacion.id_asignacion,
              id_voluntario: asignacion.id_voluntario || asignacion.voluntario?.id_voluntario,
              name: asignacion.voluntario?.usuario?.nombre || asignacion.voluntario?.nombre || 'Voluntario',
              role: asignacion.rol?.nombre || asignacion.rol_asignado || 'Voluntario',
              taskId: tarea.id,
              taskDescription: tarea.descripcion,
              phaseName: phase.name
            });
          });
        }
      });
    }
  });

  // Eliminar duplicados por voluntario (mostrar solo una vez por voluntario)
  const uniqueVolunteers = new Map();
  asignaciones.forEach(asignacion => {
    const key = asignacion.id_voluntario;
    if (!uniqueVolunteers.has(key)) {
      uniqueVolunteers.set(key, asignacion);
    }
  });

  return Array.from(uniqueVolunteers.values());
}

async function openRoleManagement() {
  // Cargar roles del proyecto antes de abrir el diálogo
  if (project.value?.id_proyecto) {
    await roleStore.fetchProjectRoles(project.value.id_proyecto);
  }
  manageRolesDialog.value = true;
}

function openProjectReports() {
  // Implement project reports functionality
  showSnackbar('Funcionalidad de reportes en desarrollo', 'info');
}

function exportProjectData() {
  // Implement export functionality
  const projectData = {
    project: project.value,
    phases: project.value?.phases || [],
    tasks: project.value?.phases?.flatMap(phase => phase.tareas || []) || [],
    volunteers: getAssignedVolunteers(),
    progress: {
      phases: getCompletedPhasesCount(),
      tasks: getCompletedTasksCount(),
      total: getTotalTasks()
    }
  };
  
  const dataStr = JSON.stringify(projectData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `proyecto-${project.value?.name || 'sin-nombre'}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  logActivity('Datos del proyecto exportados', 'mdi-download', 'success');
  showSnackbar('Datos exportados correctamente');
}

function openDeleteProjectDialog() {
  confirmDeleteProjectDialog.value = true;
}

async function confirmDeleteProject() {
  await handleOperation(
    () => projectStore.deleteProject(project.value.id),
    'deletingProject',
    null,
    'Error al eliminar el proyecto',
    () => {
      logActivity('Proyecto eliminado', 'mdi-delete', 'error');
      router.push('/organization/dashboard/projects');
    }
  );
}

function openVolunteerMenu(volunteer) {
  // Implement volunteer menu functionality
  showSnackbar(`Menú para ${volunteer.name} en desarrollo`, 'info');
}

// Additional variables
const assignmentNotes = ref('');


</script>

<style scoped>
.project-detail-view {
  background-color: #f8f9fa;
}

/* Modern Expansion Panels */
.modern-expansion-panels {
  border-radius: 12px;
  overflow: hidden;
}

.phase-panel {
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.phase-panel-title {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
  padding: 16px 20px;
}

.phase-panel-content {
  padding: 20px;
  background: rgba(var(--v-theme-surface), 0.5);
}

/* Task Cards */
.task-item {
  transition: all 0.3s ease;
}

.task-item:hover {
  transform: translateY(-2px);
}

.task-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.task-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.1);
}

/* Project Header Card */
.project-header-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

/* Gap utility */
.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

/* Management Actions */
.management-actions {
  padding: 8px 0;
}

/* Progress Stats */
.progress-stats {
  padding: 16px 0;
}

/* Volunteer Items */
.volunteer-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.1);
  transition: all 0.3s ease;
}

.volunteer-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
  padding: 8px 12px;
}

.volunteer-item:last-child {
  border-bottom: none;
}

/* Task View Mode */
.task-view-mode {
  padding: 16px 0;
}

.task-details {
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
}

/* Enhanced Card Styles */
.management-actions .v-btn {
  margin-bottom: 8px;
}

.management-actions .v-btn:last-child {
  margin-bottom: 0;
}

/* Progress Bars */
.v-progress-linear {
  border-radius: 4px;
}

/* Activity Timeline */
.v-timeline-item {
  padding-bottom: 16px;
}

/* Statistics Cards Styles */
.stats-cards-row {
  margin-bottom: 24px;
}

.stats-card-col {
  margin-bottom: 16px;
}

.stats-card {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Compact Stats Content */
.stats-content-compact {
  display: flex;
  align-items: center;
  padding: 16px;
  min-height: 80px;
}

.stats-icon-compact {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.stats-icon-compact.success {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
}

.stats-icon-compact.info {
  background: linear-gradient(135deg, #2196F3, #42A5F5);
}

.stats-icon-compact.primary {
  background: linear-gradient(135deg, #9C27B0, #BA68C8);
}

.stats-icon-compact.warning {
  background: linear-gradient(135deg, #FF9800, #FFB74D);
}

.stats-data-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stats-value-compact {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 2px;
}

.stats-value-compact.success {
  color: #4CAF50;
}

.stats-value-compact.info {
  color: #2196F3;
}

.stats-value-compact.primary {
  color: #9C27B0;
}

.stats-label-compact {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-chip-compact {
  font-weight: 600;
  font-size: 0.75rem;
}

/* Budget Card Special Styling */
.budget-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.1) 100%);
  border: 1px solid rgba(76, 175, 80, 0.2);
}

/* Phases Card Special Styling */
.phases-card {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.1) 100%);
  border: 1px solid rgba(33, 150, 243, 0.2);
}

/* Tasks Card Special Styling */
.tasks-card {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.05) 0%, rgba(156, 39, 176, 0.1) 100%);
  border: 1px solid rgba(156, 39, 176, 0.2);
}

/* Status Card Special Styling */
.status-card {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 152, 0, 0.1) 100%);
  border: 1px solid rgba(255, 152, 0, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stats-content-compact {
    padding: 12px;
    min-height: 70px;
  }
  
  .stats-icon-compact {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
  
  .stats-value-compact {
    font-size: 1.25rem;
  }
  
  .phase-panel-title {
    padding: 12px 16px;
  }
  
  .phase-panel-content {
    padding: 16px;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
    align-items: stretch;
  }
  
  .volunteer-item {
    padding: 12px 0;
  }
  
  .task-details {
    padding: 12px;
  }
  
  .management-actions .v-btn {
    margin-bottom: 12px;
  }
}

@media (max-width: 600px) {
  .stats-cards-row {
    margin-bottom: 16px;
  }
  
  .stats-card-col {
    margin-bottom: 12px;
  }
  
  .stats-content-compact {
    flex-direction: column;
    text-align: center;
    padding: 16px 12px;
    min-height: 90px;
  }
  
  .stats-icon-compact {
    margin-right: 0;
    margin-bottom: 8px;
  }
  
  .stats-value-compact {
    font-size: 1.1rem;
  }
}
</style>

