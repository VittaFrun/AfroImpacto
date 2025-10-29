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
                    :color="project.id_estado === 0 ? 'success' : 'warning'"
                    variant="flat"
                    :prepend-icon="project.id_estado === 0 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="toggleProjectVisibility"
                    size="small"
                  >
                    {{ project.id_estado === 0 ? 'Hacer Público' : 'Hacer Privado' }}
                  </ModernButton>
                  
                  <ModernButton
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-content-save"
                    @click="saveProjectChanges"
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
                      <v-chip 
                        :color="getStatusColor(project.id_estado)" 
                        size="small"
                        class="status-chip-compact"
                      >
                        <v-icon start size="16">{{ getStatusIcon(project.id_estado) }}</v-icon>
                        {{ getStatusText(project.id_estado) }}
                      </v-chip>
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
                            @click.stop="confirmDeletePhase(phase.id)"
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
                                      @click="confirmDeleteTask(task.id)"
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
                  @click="confirmDeleteProject"
                  block
                >
                  Eliminar Proyecto
                </ModernButton>
              </div>
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
                :rules="[v => !!v || 'La descripción es requerida']"
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
                item-title="nombre"
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
            :rules="[v => !!v || 'El nombre es requerido']"
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
                :rules="[v => !!v || 'El nombre es requerido']"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="projectForm.location"
                label="Ubicación"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="projectForm.description"
                label="Descripción"
                variant="outlined"
                rows="3"
                required
              ></v-textarea>
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="projectForm.objective"
                label="Objetivo"
                variant="outlined"
                rows="2"
                required
              ></v-textarea>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="projectForm.startDate"
                label="Fecha de Inicio"
                type="date"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="projectForm.endDate"
                label="Fecha de Fin"
                type="date"
                variant="outlined"
                required
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
            
            <v-col cols="12">
              <v-select
                v-model="projectForm.id_estado"
                :items="projectStatusOptions"
                label="Estado del Proyecto"
                variant="outlined"
                required
              ></v-select>
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
            :items="project?.tasks || []"
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
            :items="customRoles"
            item-title="name"
            item-value="name"
            label="Rol Asignado"
            variant="outlined"
            required
            class="mb-4"
          ></v-select>
          
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

    <!-- Role Management Dialog -->
    <ModernDialog
      v-model="roleDialog"
      :title="currentRole ? 'Editar Rol' : 'Nuevo Rol'"
      :icon="currentRole ? 'mdi-pencil' : 'mdi-plus'"
      max-width="500px"
    >
      <template #content>
          <v-form @submit.prevent="saveRole">
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

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';
import KanbanBoard from '../components/KanbanBoard.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import ModernCard from '@/components/ui/ModernCard.vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const route = useRoute();
const router = useRouter();

const projectStore = useProjectStore();
const volunteerStore = useVolunteerStore();
const roleStore = useRoleStore();

const { loading: projectLoading, error: projectError } = storeToRefs(projectStore);
const { customRoles } = storeToRefs(roleStore);
const { volunteers } = storeToRefs(volunteerStore);

const project = computed(() => projectStore.getProjectById(parseInt(route.params.id, 10)));

onMounted(() => {
  const projectId = parseInt(route.params.id, 10);
  if (projectId) {
    projectStore.fetchProjectById(projectId);
  }
  // Assuming volunteerStore has a fetchVolunteers action
  if (volunteerStore.fetchVolunteers) {
    volunteerStore.fetchVolunteers();
  }
  roleStore.fetchRoles();
});


const editProjectDialog = ref(false);

// Dialog states
const phaseDialog = ref(false);
const currentPhase = ref(null);
const phaseForm = ref({ name: '', description: '' });
const manageRolesDialog = ref(false);
const assignVolunteerDialog = ref(false);
const selectedVolunteerId = ref(null);
const assignedRole = ref('');
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

// Options for selects
const priorityOptions = [
  { title: 'Alta', value: 'Alta' },
  { title: 'Media', value: 'Media' },
  { title: 'Baja', value: 'Baja' }
];

const complexityOptions = [
  { title: 'Alta', value: 'Alta' },
  { title: 'Media', value: 'Media' },
  { title: 'Baja', value: 'Baja' }
];

const taskStatusOptions = [
  { title: 'Pendiente', value: 1 },
  { title: 'En Progreso', value: 2 },
  { title: 'Completada', value: 3 }
];

const projectStatusOptions = [
  { title: 'No Público', value: 0 },
  { title: 'Público', value: 1 }
];

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

function savePhase() {
  if (!project.value) return;
  
  const phaseData = {
    nombre: phaseForm.value.name,
    descripcion: phaseForm.value.description,
    orden: phaseForm.value.orden,
    id_proyecto: project.value.id
  };
  
  if (currentPhase.value) {
    projectStore.updateProjectPhase(project.value.id, currentPhase.value.id, phaseData);
    showSnackbar('Fase actualizada correctamente');
  } else {
    projectStore.addProjectPhase(project.value.id, phaseData);
    showSnackbar('Fase añadida correctamente');
  }
  phaseDialog.value = false;
}

function confirmDeletePhase(phaseId) {
  if (confirm('¿Estás seguro de que quieres eliminar esta fase? Se eliminarán todas las tareas asociadas.')) {
    projectStore.deleteProjectPhase(project.value.id, phaseId);
    showSnackbar('Fase eliminada correctamente', 'error');
  }
}


function confirmDeleteTask(taskId) {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    projectStore.deleteProjectTask(project.value.id, taskId);
    showSnackbar('Tarea eliminada correctamente', 'error');
  }
}

// Functions for task management (with logging)
const saveTask = () => {
  if (!project.value) return;

  const taskData = {
    descripcion: taskForm.value.description,
    fecha_inicio: taskForm.value.startDate,
    fecha_fin: taskForm.value.endDate,
    prioridad: taskForm.value.prioridad || 'Media',
    complejidad: taskForm.value.complejidad || 'Media',
    id_estado: taskForm.value.id_estado || 1,
    id_fase: taskForm.value.phaseId
  };

  if (currentTask.value) {
    // Update existing task
    projectStore.updateProjectTask(project.value.id, currentTask.value.id, taskData);
    logActivity(`Tarea '${taskForm.value.description}' actualizada.`, 'mdi-check-circle', 'success');
    showSnackbar('Tarea actualizada correctamente');
  } else {
    // Add new task
    projectStore.addProjectTask(project.value.id, taskData);
    logActivity(`Nueva tarea '${taskForm.value.description}' añadida.`, 'mdi-plus-circle', 'primary');
    showSnackbar('Tarea añadida correctamente');
  }
  taskDialog.value = false;
  currentTask.value = null;
  isViewingTask.value = false;
  // Reset form
  taskForm.value = {
    description: '',
    startDate: '',
    endDate: '',
    prioridad: 'Media',
    complejidad: 'Media',
    id_estado: 1,
    phaseId: null
  };
};

const saveProjectChanges = async () => {
  if (!project.value) return;
  
  try {
    const projectData = {
      nombre: projectForm.value.name,
      descripcion: projectForm.value.description,
      objetivo: projectForm.value.objective,
      ubicacion: projectForm.value.location,
      fecha_inicio: projectForm.value.startDate,
      fecha_fin: projectForm.value.endDate,
      presupuesto_total: projectForm.value.budget,
      id_estado: projectForm.value.id_estado
    };
    
    await projectStore.updateProject(project.value.id, projectData);
    logActivity('Proyecto actualizado', 'mdi-content-save', 'success');
    showSnackbar('Proyecto actualizado correctamente');
    editProjectDialog.value = false;
    // Refresh project data
    projectStore.fetchProjectById(project.value.id);
  } catch (error) {
    console.error('Error updating project:', error);
    logActivity('Error al actualizar el proyecto', 'mdi-alert', 'error');
    showSnackbar('Error al actualizar el proyecto', 'error');
  }
};

const projectForm = ref({
  name: '',
  description: '',
  objective: '',
  location: '',
  startDate: '',
  endDate: '',
  budget: 0,
  id_estado: 0
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
      id_estado: project.value.id_estado || 0
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
  color: '#2196F3' 
});

const openAddRoleDialog = () => {
  currentRole.value = null;
  roleForm.value = { 
    name: '', 
    description: '',
    color: '#2196F3' 
  };
  roleDialog.value = true;
};

const openEditRoleDialog = (role) => {
  currentRole.value = role;
  roleForm.value = { 
    name: role.name || '',
    description: role.description || '',
    color: role.color || '#2196F3'
  };
  roleDialog.value = true;
};

const saveRole = async () => {
  if (!roleForm.value.name.trim()) {
    showSnackbar('El nombre del rol es requerido', 'warning');
    return;
  }

  try {
  if (currentRole.value) {
      await roleStore.updateRole(roleForm.value);
    showSnackbar('Rol actualizado correctamente');
      logActivity(`Rol '${roleForm.value.name}' actualizado`, 'mdi-account-cog', 'success');
  } else {
      await roleStore.addRole(roleForm.value);
    showSnackbar('Rol añadido correctamente');
      logActivity(`Nuevo rol '${roleForm.value.name}' creado`, 'mdi-account-plus', 'primary');
  }
  roleDialog.value = false;
  } catch (error) {
    console.error('Error saving role:', error);
    showSnackbar('Error al guardar el rol', 'error');
  }
};

const confirmDeleteRole = async (roleId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
    try {
      await roleStore.deleteRole(roleId);
    showSnackbar('Rol eliminado correctamente', 'error');
      logActivity('Rol eliminado', 'mdi-delete', 'error');
    } catch (error) {
      console.error('Error deleting role:', error);
      showSnackbar('Error al eliminar el rol', 'error');
    }
  }
};

const updateTaskStatusFromKanban = ({ taskId, newStatus }) => {
  if (!project.value) return;
  const taskToUpdate = getAllTasks().find(task => task.id === parseInt(taskId, 10));
  if (taskToUpdate) {
    const taskData = { ...taskToUpdate, id_estado: newStatus };
    projectStore.updateProjectTask(project.value.id, taskToUpdate.id, taskData);
    logActivity(`Estado de la tarea '${taskToUpdate.descripcion}' actualizado`, 'mdi-check-circle', 'success');
  }
};

const availableVolunteers = computed(() => {
  if (!volunteers.value || !Array.isArray(volunteers.value)) {
    return [];
  }
  return volunteers.value.map(v => ({
    id_voluntario: v.id,
    name: v.name || v.nombre || 'Voluntario sin nombre',
  }));
});

const openAssignVolunteerDialog = () => {
  // Load volunteers if not already loaded
  if (volunteerStore.fetchVolunteers) {
    volunteerStore.fetchVolunteers();
  }
  assignVolunteerDialog.value = true;
};

const assignVolunteerToTask = async () => {
  if (!selectedTaskForAssignmentId.value || !selectedVolunteerId.value) {
    showSnackbar('Por favor selecciona una tarea y un voluntario', 'warning');
    return;
  }

  try {
    // For now, we'll just log the assignment since the backend endpoint might not exist yet
    logActivity(`Voluntario asignado a tarea`, 'mdi-account-check', 'success');
    showSnackbar('Voluntario asignado correctamente');
    
    // Reset form
    assignVolunteerDialog.value = false;
    selectedVolunteerId.value = null;
    assignedRole.value = '';
    selectedTaskForAssignmentId.value = null;
    assignmentNotes.value = '';
  } catch (error) {
    console.error('Error assigning volunteer:', error);
    showSnackbar('Error al asignar voluntario', 'error');
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

function getStatusIcon(statusId) {
  switch (statusId) {
    case 0: return 'mdi-eye-off'; // No Público
    case 1: return 'mdi-eye'; // Público
    default: return 'mdi-help-circle';
  }
}

function getStatusColor(statusId) {
  switch (statusId) {
    case 0: return 'warning'; // No Público
    case 1: return 'success'; // Público
    default: return 'grey';
  }
}

function getStatusText(statusId) {
  switch (statusId) {
    case 0: return 'No Público';
    case 1: return 'Público';
    default: return 'Desconocido';
  }
}

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

function getTaskStatus(taskStatusId) {
  switch (taskStatusId) {
    case 1: return 'Pendiente';
    case 2: return 'En Progreso';
    case 3: return 'Completada';
    default: return 'Desconocido';
  }
}

function getTaskStatusColor(taskStatusId) {
  switch (taskStatusId) {
    case 1: return 'warning';
    case 2: return 'info';
    case 3: return 'success';
    default: return 'grey';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'Alta': return 'error';
    case 'Media': return 'warning';
    case 'Baja': return 'success';
    default: return 'grey';
  }
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Fechas no especificadas';
  const start = new Date(startDate).toLocaleDateString('es-CO');
  const end = new Date(endDate).toLocaleDateString('es-CO');
  return `${start} - ${end}`;
}

function toggleProjectVisibility() {
  if (!project.value) return;
  const newStatus = project.value.id_estado === 0 ? 1 : 0;
  projectStore.updateProject(project.value.id, { id_estado: newStatus }).then(() => {
    projectStore.fetchProjectById(project.value.id);
    logActivity(`Estado del proyecto cambiado a ${newStatus === 1 ? 'Público' : 'No Público'}`, 'mdi-eye', 'info');
  });
}

// New functions for enhanced management
function switchToEditMode() {
  isViewingTask.value = false;
}

function getTaskStatusIcon(statusId) {
  switch (statusId) {
    case 1: return 'mdi-clock-outline';
    case 2: return 'mdi-progress-clock';
    case 3: return 'mdi-check-circle';
    default: return 'mdi-help-circle';
  }
}

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
  // This would need to be implemented based on your volunteer assignment logic
  // For now, returning empty array
  return [];
}

function openRoleManagement() {
  openAddRoleDialog();
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

function confirmDeleteProject() {
  if (confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
    projectStore.deleteProject(project.value.id).then(() => {
      logActivity('Proyecto eliminado', 'mdi-delete', 'error');
      showSnackbar('Proyecto eliminado correctamente', 'error');
      router.push('/organization/dashboard/projects');
    }).catch(error => {
      console.error('Error deleting project:', error);
      showSnackbar('Error al eliminar el proyecto', 'error');
    });
  }
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

