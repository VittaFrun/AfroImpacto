<template>
  <v-container fluid class="pa-8">
    <!-- Header Section -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-2">
        {{ isEditing ? 'Editar Proyecto' : 'Crear Nuevo Proyecto' }}
        </h1>
        <p class="text-body-1 text-grey-darken-1">
          {{ isEditing ? 'Modifica la información del proyecto existente' : 'Completa la información básica del proyecto. Los ajustes finales se harán en la vista de gestión.' }}
        </p>
      </div>
      <ModernButton
        color="grey"
        variant="outlined"
        prepend-icon="mdi-arrow-left"
        @click="router.back()"
      >
        Volver
      </ModernButton>
    </div>

    <ModernCard
      :title="isEditing ? 'Editar Información del Proyecto' : 'Información Básica del Proyecto'"
      :subtitle="isEditing ? 'Modifica los datos del proyecto' : 'Paso 1: Define la información fundamental del proyecto'"
      icon="mdi-folder-plus"
      icon-color="primary"
      variant="default"
    >
      <template #content>
        <v-stepper v-model="currentStep" class="elevation-0 modern-stepper">
          <v-stepper-header class="elevation-0 modern-stepper-header">
            <v-stepper-item 
              title="Información Básica" 
              :value="1" 
              :complete="currentStep > 1"
              class="modern-stepper-item"
            >
              <template v-slot:icon>
                <v-icon :color="currentStep >= 1 ? 'primary' : 'grey'">
                  {{ currentStep > 1 ? 'mdi-check' : 'mdi-information' }}
                </v-icon>
              </template>
            </v-stepper-item>
          <v-divider></v-divider>
            <v-stepper-item 
              title="Fases del Proyecto" 
              :value="2" 
              :complete="currentStep > 2"
              class="modern-stepper-item"
            >
              <template v-slot:icon>
                <v-icon :color="currentStep >= 2 ? 'primary' : 'grey'">
                  {{ currentStep > 2 ? 'mdi-check' : 'mdi-view-list' }}
                </v-icon>
              </template>
            </v-stepper-item>
          <v-divider></v-divider>
            <v-stepper-item 
              title="Revisión y Envío" 
              :value="3"
              class="modern-stepper-item"
            >
              <template v-slot:icon>
                <v-icon :color="currentStep >= 3 ? 'primary' : 'grey'">
                  {{ currentStep > 3 ? 'mdi-check' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-stepper-item>
        </v-stepper-header>

        <v-stepper-window>
          <!-- Step 1: Basic Information -->
          <v-stepper-window-item :value="1">
              <div class="pa-6">
                <v-form ref="basicForm" v-model="basicFormValid">
              <v-row>
                    <!-- Project Name -->
                <v-col cols="12">
                      <v-card variant="outlined" class="pa-4 mb-4">
                        <div class="d-flex align-center mb-3">
                          <v-icon class="mr-2" color="primary">mdi-folder-text</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Información Básica</span>
                        </div>
                        <v-text-field
                          v-model="project.name"
                          label="Nombre del Proyecto"
                          variant="outlined"
                          color="primary"
                          :rules="[v => !!v || 'El nombre es requerido', v => v.length >= 3 || 'Mínimo 3 caracteres']"
                          required
                          prepend-icon="mdi-folder-text"
                          hint="Nombre descriptivo del proyecto"
                          persistent-hint
                          density="comfortable"
                        />
                      </v-card>
                </v-col>
                    
                    <!-- Description and Objective -->
                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4 mb-4 h-100">
                        <div class="d-flex align-center mb-3">
                          <v-icon class="mr-2" color="info">mdi-text</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Descripción</span>
                        </div>
                        <v-textarea
                          v-model="project.description"
                          label="Descripción del Proyecto"
                          variant="outlined"
                          color="primary"
                          :rows="4"
                          :rules="[v => !!v || 'La descripción es requerida', v => v.length >= 10 || 'Mínimo 10 caracteres']"
                          required
                          prepend-icon="mdi-text"
                          hint="Describe brevemente el proyecto y su propósito"
                          persistent-hint
                          density="comfortable"
                          auto-grow
                        />
                      </v-card>
                </v-col>
                    
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4 mb-4 h-100">
                        <div class="d-flex align-center mb-3">
                          <v-icon class="mr-2" color="success">mdi-target</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Objetivo</span>
                        </div>
                        <v-textarea
                          v-model="project.objective"
                          label="Objetivo Principal"
                          variant="outlined"
                          color="primary"
                          :rows="4"
                          :rules="[v => !!v || 'El objetivo es requerido']"
                          required
                          prepend-icon="mdi-target"
                          hint="Define claramente qué se quiere lograr con este proyecto"
                          persistent-hint
                          density="comfortable"
                          auto-grow
                        />
                      </v-card>
                </v-col>
                    
                    <!-- Location -->
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4 mb-4">
                        <div class="d-flex align-center mb-3">
                          <v-icon class="mr-2" color="warning">mdi-map-marker</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Ubicación</span>
                        </div>
                        <v-text-field
                          v-model="project.location"
                          label="Ubicación del Proyecto"
                          variant="outlined"
                          color="primary"
                          :rules="[v => !!v || 'La ubicación es requerida']"
                          required
                          prepend-icon="mdi-map-marker"
                          hint="Ciudad, región o área donde se desarrollará"
                          persistent-hint
                          density="comfortable"
                        />
                      </v-card>
                </v-col>
                    
                    <!-- Project Dates -->
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4">
                        <div class="d-flex align-center mb-3">
                          <v-icon class="mr-2" color="primary">mdi-calendar-range</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Fechas del Proyecto</span>
                        </div>
                        <v-row>
                          <v-col cols="6">
                            <v-menu
                              v-model="startDateMenu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              min-width="320"
                              max-width="320"
                            >
                              <template v-slot:activator="{ props }">
                                <v-text-field
                                  v-model="formattedStartDate"
                                  label="Fecha de Inicio"
                                  variant="outlined"
                                  color="success"
                                  prepend-inner-icon="mdi-calendar-start"
                                  class="modern-input"
                                  density="compact"
                                  readonly
                                  v-bind="props"
                                ></v-text-field>
                      </template>
                              <v-card class="google-style-calendar" elevation="12">
                                <!-- Header with selected date -->
                                <div class="calendar-selected-header">
                                  <div class="selected-year">{{ selectedStartYear }}</div>
                                  <div class="selected-date">{{ formattedSelectedStartDate }}</div>
                                </div>
                                
                                <!-- Month navigation -->
                                <div class="calendar-month-nav">
                                  <v-btn
                                    icon="mdi-chevron-left"
                                    variant="text"
                                    size="small"
                                    @click="navigateStartMonth(-1)"
                                    class="nav-btn"
                                  ></v-btn>
                                  <span class="month-year">{{ selectedStartMonthYear }}</span>
                                  <v-btn
                                    icon="mdi-chevron-right"
                                    variant="text"
                                    size="small"
                                    @click="navigateStartMonth(1)"
                                    class="nav-btn"
                                  ></v-btn>
                                </div>
                                
                                <!-- Calendar -->
                                <v-date-picker
                                  v-model="project.startDate"
                                  @update:model-value="updateStartDate"
                                  color="success"
                                  locale="es"
                                  class="google-calendar"
                                  :show-adjacent-months="false"
                                  :hide-header="true"
                                ></v-date-picker>
                              </v-card>
                            </v-menu>
                          </v-col>
                          <v-col cols="6">
                            <v-menu
                              v-model="endDateMenu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              min-width="320"
                              max-width="320"
                            >
                              <template v-slot:activator="{ props }">
                                <v-text-field
                                  v-model="formattedEndDate"
                                  label="Fecha de Fin"
                                  variant="outlined"
                                  color="success"
                                  prepend-inner-icon="mdi-calendar-end"
                                  class="modern-input"
                                  density="compact"
                                  readonly
                                  v-bind="props"
                                ></v-text-field>
                    </template>
                              <v-card class="google-style-calendar" elevation="12">
                                <!-- Header with selected date -->
                                <div class="calendar-selected-header">
                                  <div class="selected-year">{{ selectedEndYear }}</div>
                                  <div class="selected-date">{{ formattedSelectedEndDate }}</div>
                                </div>
                                
                                <!-- Month navigation -->
                                <div class="calendar-month-nav">
                                  <v-btn
                                    icon="mdi-chevron-left"
                                    variant="text"
                                    size="small"
                                    @click="navigateEndMonth(-1)"
                                    class="nav-btn"
                                  ></v-btn>
                                  <span class="month-year">{{ selectedEndMonthYear }}</span>
                                  <v-btn
                                    icon="mdi-chevron-right"
                                    variant="text"
                                    size="small"
                                    @click="navigateEndMonth(1)"
                                    class="nav-btn"
                                  ></v-btn>
                                </div>
                                
                                <!-- Calendar -->
                                <v-date-picker
                                  v-model="project.endDate"
                                  @update:model-value="updateEndDate"
                                  color="success"
                                  locale="es"
                                  class="google-calendar"
                                  :show-adjacent-months="false"
                                  :hide-header="true"
                                ></v-date-picker>
                              </v-card>
                            </v-menu>
                </v-col>
                        </v-row>
                        <div class="text-caption text-grey mt-2">
                          Define el período de ejecución del proyecto
                        </div>
                      </v-card>
                </v-col>
                    
                    <!-- Budget -->
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4">
                        <div class="d-flex align-center mb-3">
                          <v-icon class="mr-2" color="success">mdi-currency-usd</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Presupuesto Total</span>
                        </div>
                        <v-text-field
                          v-model="formattedBudget"
                          @input="handleBudgetInput"
                          label="Presupuesto en Pesos Colombianos"
                          variant="outlined"
                          color="primary"
                          :rules="[v => !!v || 'El presupuesto es requerido', validateBudget]"
                          required
                          prepend-inner-icon="mdi-currency-usd"
                          class="modern-input"
                          hint="Ingresa el presupuesto estimado"
                          persistent-hint
                          suffix="COP"
                        ></v-text-field>
                        <div class="text-caption text-grey mt-2">
                          Presupuesto estimado para la ejecución del proyecto
                        </div>
                      </v-card>
                </v-col>
                    
                    <!-- Cover Image Upload -->
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4">
                        <div class="d-flex align-center mb-3">
                          <v-icon class="mr-2" color="primary">mdi-image</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Imagen de Portada</span>
                        </div>
                        <DragDropFileUpload
                          title="Arrastra imagen aquí"
                          subtitle="o haz clic para seleccionar"
                          button-text="Seleccionar"
                          :multiple="false"
                          accept="image/*"
                          :max-files="1"
                          :max-size="5 * 1024 * 1024"
                          @files-selected="handleCoverImageSelected"
                          @file-removed="handleCoverImageRemoved"
                        />
                        <div v-if="coverImagePreview" class="mt-3">
                          <v-img
                            :src="coverImagePreview"
                            max-height="120"
                            contain
                            class="rounded-lg"
                            style="border: 2px solid #e0e0e0;"
                          ></v-img>
                        </div>
                      </v-card>
                </v-col>
                    
                    <!-- Document Upload -->
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4">
                        <div class="d-flex align-center mb-3">
                          <v-icon class="mr-2" color="primary">mdi-paperclip</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Documentos</span>
                        </div>
                        <DragDropFileUpload
                          title="Arrastra documentos aquí"
                          subtitle="o haz clic para seleccionar"
                          button-text="Seleccionar"
                          :multiple="true"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                          :max-files="5"
                          :max-size="10 * 1024 * 1024"
                          @files-selected="handleDocumentsSelected"
                          @file-removed="handleDocumentRemoved"
                        />
                      </v-card>
                    </v-col>
                    
                    <!-- Next Step Button -->
                    <v-col cols="12">
                      <div class="d-flex justify-end mt-4">
                        <ModernButton
                          color="primary"
                          variant="flat"
                          append-icon="mdi-arrow-right"
                          @click="nextStep"
                          :disabled="!canProceedToNextStep"
                          size="large"
                        >
                          Continuar a Fases
                        </ModernButton>
                      </div>
                </v-col>
              </v-row>
                </v-form>

                <!-- Payment Configuration -->
                <div class="mt-8">
                  <PaymentConfiguration v-model="project" />
                </div>
              </div>
          </v-stepper-window-item>

          <!-- Step 2: Project Phases -->
          <v-stepper-window-item :value="2">
              <div class="pa-6">
                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 d-flex align-center">
                    <v-icon class="mr-2" color="primary">mdi-view-list</v-icon>
                    Fases del Proyecto
                  </h3>
                  <p class="text-body-2 text-grey">
                    Define las fases principales del proyecto. Puedes agregar más fases después en la vista de gestión.
                  </p>
                </div>
                
                <v-form ref="phaseForm" v-model="phaseFormValid">
              <v-row align="center">
                <v-col cols="12" md="5">
                      <v-text-field
                        v-model="newPhase.name"
                        label="Nombre de la Fase"
                        variant="outlined"
                        color="primary"
                        :rules="[v => !!v || 'El nombre es requerido']"
                        required
                        prepend-inner-icon="mdi-format-list-numbered"
                        class="modern-input"
                        hide-details="auto"
                      ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                      <v-text-field
                        v-model="newPhase.description"
                        label="Descripción de la Fase"
                        variant="outlined"
                        color="primary"
                        prepend-inner-icon="mdi-text"
                        class="modern-input"
                        hide-details="auto"
                      ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                      <ModernButton
                        color="primary"
                        variant="flat"
                        prepend-icon="mdi-plus"
                        @click="addPhase"
                        :disabled="!newPhase.name"
                        block
                      >
                        Añadir
                      </ModernButton>
                </v-col>
              </v-row>
                </v-form>
                
                <div v-if="project.phases.length > 0" class="mt-6">
                  <h4 class="text-subtitle-1 font-weight-bold mb-4">Fases Agregadas</h4>
                  <div class="phases-list">
                <transition-group name="list" tag="div">
                      <ModernCard
                        v-for="(phase, index) in project.phases"
                        :key="index"
                        :title="phase.name"
                        :subtitle="phase.description || 'Sin descripción'"
                        icon="mdi-view-list"
                        icon-color="info"
                        variant="outlined"
                        class="mb-3 phase-item"
                      >
                        <template #headerActions>
                          <v-btn
                            icon="mdi-delete"
                            variant="text"
                            color="error"
                            size="small"
                            @click="removePhase(index)"
                          ></v-btn>
                    </template>
                      </ModernCard>
                </transition-group>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-1">mdi-view-list-outline</v-icon>
                  <h4 class="text-h6 text-grey mt-4">No hay fases agregadas</h4>
                  <p class="text-body-2 text-grey">
                    Agrega al menos una fase para organizar mejor tu proyecto
                  </p>
                </div>
                
                <!-- Action Buttons -->
                <div class="d-flex justify-space-between align-center mt-6">
                  <ModernButton
                    color="grey"
                    variant="outlined"
                    prepend-icon="mdi-arrow-left"
                    @click="currentStep = 1"
                  >
                    Volver a Información Básica
                  </ModernButton>
                  
                  <ModernButton
                    color="primary"
                    variant="flat"
                    append-icon="mdi-arrow-right"
                    @click="nextStep"
                    size="large"
                  >
                    Continuar a Revisión
                  </ModernButton>
                </div>
              </div>
          </v-stepper-window-item>

            <!-- Step 3: Review and Submit -->
          <v-stepper-window-item :value="3">
              <div class="pa-6">
                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 d-flex align-center">
                    <v-icon class="mr-2" color="primary">mdi-eye</v-icon>
                    Revisión del Proyecto
                  </h3>
                  <p class="text-body-2 text-grey">
                    Revisa toda la información antes de crear el proyecto. Recuerda que el proyecto se creará como "No Público" y podrás hacer ajustes finales en la vista de gestión.
                  </p>
                </div>
                
                <v-row>
                  <!-- Project Summary -->
                  <v-col cols="12" md="8">
                    <ModernCard
                      title="Resumen del Proyecto"
                      subtitle="Información básica del proyecto"
                      icon="mdi-file-document"
                      icon-color="primary"
                      variant="filled"
                    >
                      <template #content>
              <v-list density="compact" class="py-0">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Nombre:</v-list-item-title>
                            <v-list-item-subtitle>{{ project.name || 'No especificado' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Descripción:</v-list-item-title>
                            <v-list-item-subtitle>{{ project.description || 'No especificada' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Objetivo:</v-list-item-title>
                            <v-list-item-subtitle>{{ project.objective || 'No especificado' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Ubicación:</v-list-item-title>
                            <v-list-item-subtitle>{{ project.location || 'No especificada' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Fechas:</v-list-item-title>
                            <v-list-item-subtitle>
                              {{ project.startDate || 'No especificada' }} - {{ project.endDate || 'No especificada' }}
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold">Presupuesto:</v-list-item-title>
                            <v-list-item-subtitle>
                              {{ project.budget ? `$${project.budget.toLocaleString()} COP` : 'No especificado' }}
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold">Estado:</v-list-item-title>
                            <v-list-item-subtitle>
                              <v-chip color="warning" size="small">
                                <v-icon start>mdi-eye-off</v-icon>
                                No Público
                              </v-chip>
                            </v-list-item-subtitle>
                </v-list-item>
              </v-list>
                      </template>
                    </ModernCard>
                  </v-col>
                  
                  <!-- Files and Phases Summary -->
                  <v-col cols="12" md="4">
                    <!-- Cover Image Preview -->
                    <ModernCard
                      v-if="coverImagePreview"
                      title="Imagen de Portada"
                      icon="mdi-image"
                      icon-color="success"
                      variant="tonal"
                      class="mb-4"
                    >
                      <template #content>
                        <v-img
                          :src="coverImagePreview"
                          max-height="150"
                          contain
                          class="rounded-lg"
                        ></v-img>
                      </template>
                    </ModernCard>
                    
                    <!-- Documents Summary -->
                    <ModernCard
                      v-if="project.files && project.files.length > 0"
                      title="Documentos Adjuntos"
                      :subtitle="`${project.files.length} archivo(s)`"
                      icon="mdi-paperclip"
                      icon-color="info"
                      variant="outlined"
                      class="mb-4"
                    >
                      <template #content>
                        <div class="file-list">
                          <div v-for="file in project.files" :key="file.name" class="d-flex align-center mb-2">
                            <v-icon class="mr-2" color="info">{{ getFileIcon(file) }}</v-icon>
                            <span class="text-body-2">{{ file.name }}</span>
              </div>
              </div>
                      </template>
                    </ModernCard>
                    
                    <!-- Phases Summary -->
                    <ModernCard
                      v-if="project.phases && project.phases.length > 0"
                      title="Fases del Proyecto"
                      :subtitle="`${project.phases.length} fase(s)`"
                      icon="mdi-view-list"
                      icon-color="primary"
                      variant="gradient"
                    >
                      <template #content>
                        <div class="phases-summary">
                          <div v-for="(phase, index) in project.phases" :key="index" class="d-flex align-center mb-2">
                            <v-chip size="small" color="primary" class="mr-2">{{ index + 1 }}</v-chip>
                            <span class="text-body-2 font-weight-medium">{{ phase.name }}</span>
              </div>
              </div>
                      </template>
                    </ModernCard>
                  </v-col>
                </v-row>
                
                <!-- Next Steps Info -->
                <v-alert type="info" variant="tonal" class="mt-6">
                  <v-icon start>mdi-information</v-icon>
                  <div>
                    <strong>Próximos pasos:</strong>
                    <ul class="mt-2 mb-0">
                      <li>El proyecto se creará como "No Público"</li>
                      <li>Podrás gestionar roles de voluntarios en la vista de gestión</li>
                      <li>Podrás agregar más fases y tareas detalladas</li>
                      <li>Podrás cambiar el estado a "Público" cuando esté listo</li>
                    </ul>
              </div>
                </v-alert>
                
                <!-- Action Buttons -->
                <div class="d-flex justify-space-between align-center mt-6">
                  <ModernButton
                    color="grey"
                    variant="outlined"
                    prepend-icon="mdi-arrow-left"
                    @click="currentStep = 2"
                  >
                    Volver a Fases
                  </ModernButton>
                  
                  <ModernButton
                    color="success"
                    variant="flat"
                    prepend-icon="mdi-check"
                    :loading="isLoading"
                    :disabled="!canSubmit"
                    @click="submitProject"
                    size="large"
                  >
                    Crear Proyecto
                  </ModernButton>
                </div>
              </div>
          </v-stepper-window-item>
        </v-stepper-window>
        </v-stepper>
      </template>
      
      <template #actions>
        <div class="d-flex align-center w-100">
          <ModernButton
            v-if="currentStep > 1"
            color="grey"
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            @click="currentStep--"
          >
            Atrás
          </ModernButton>
          
          <v-spacer></v-spacer>
          
          <ModernButton
            v-if="currentStep < 3"
            color="primary"
            variant="flat"
            append-icon="mdi-arrow-right"
            @click="nextStep"
            :disabled="!canProceedToNextStep"
          >
            Siguiente
          </ModernButton>
          
          <ModernButton
            v-if="currentStep === 3"
            color="success"
            variant="flat"
            prepend-icon="mdi-check"
            @click="submitProject"
            :loading="isLoading"
            :disabled="isLoading || !canSubmit"
          >
            {{ isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto' }}
          </ModernButton>
        </div>
      </template>
    </ModernCard>

    <!-- Success Notification -->
    <v-dialog v-model="notification.show" max-width="500" persistent>
      <v-card class="success-notification-card">
        <v-card-text class="text-center pa-8">
          <div class="mb-4">
            <v-icon 
              :color="notification.type === 'success' ? 'success' : 'error'" 
              size="64"
              class="notification-icon"
            >
              {{ notification.icon }}
            </v-icon>
          </div>
          
          <h2 class="text-h5 font-weight-bold mb-3" :class="notification.type === 'success' ? 'text-success' : 'text-error'">
            {{ notification.title }}
          </h2>
          
          <p class="text-body-1 text-grey-darken-1 mb-4">
            {{ notification.message }}
          </p>
          
          <div v-if="notification.type === 'success'" class="text-caption text-grey mb-4">
            Serás redirigido automáticamente a la vista de gestión de proyectos...
          </div>
          
          <v-progress-circular
            v-if="notification.type === 'success'"
            indeterminate
            color="success"
            size="24"
            class="mb-4"
          ></v-progress-circular>
          
          <div v-if="notification.type === 'error'" class="mt-4">
            <ModernButton
              color="error"
              variant="flat"
              @click="notification.show = false"
            >
              Entendido
            </ModernButton>
          </div>
        </v-card-text>
    </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { storeToRefs } from 'pinia';
import ModernButton from '@/components/ui/ModernButton.vue';
import ModernCard from '@/components/ui/ModernCard.vue';
import DragDropFileUpload from '@/components/ui/DragDropFileUpload.vue';
import PaymentConfiguration from '@/components/ui/PaymentConfiguration.vue';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const { error } = storeToRefs(projectStore);

const currentStep = ref(1);
const isLoading = ref(false);
const basicFormValid = ref(false);
const phaseFormValid = ref(false);
const isEditing = computed(() => !!route.query.id);

const project = ref({
  id: null,
  name: '',
  description: '',
  objective: '',
  location: '',
  startDate: '',
  endDate: '',
  budget: 0,
  coverImage: null,
  files: [],
  phases: [],
  // Payment Information
  paymentType: 'volunteer',
  paymentAmount: 0,
  paymentFrequency: 'none',
  paymentDescription: '',
  includesTransport: false,
  includesMeals: false,
  includesMaterials: false,
  includesInsurance: false
});

const coverImagePreview = ref(null);
const newPhase = ref({ name: '', description: '' });
const formattedBudget = ref('');

// Notification state
const notification = ref({
  show: false,
  type: 'success',
  title: '',
  message: '',
  icon: 'mdi-check-circle'
});

// Date picker variables
const startDateMenu = ref(false);
const endDateMenu = ref(false);

// Google-style calendar variables
const currentStartDate = ref(new Date());
const currentEndDate = ref(new Date());

// Computed properties for validation
const canProceedToNextStep = computed(() => {
  switch (currentStep.value) {
    case 1:
      return basicFormValid.value;
    case 2:
      return true; // Phases are optional
    default:
      return false;
  }
});

const canSubmit = computed(() => {
  return basicFormValid.value && project.value.name && project.value.description;
});

// Computed properties for Google-style calendar
const selectedStartYear = computed(() => {
  if (!project.value.startDate) return new Date().getFullYear();
  return new Date(project.value.startDate).getFullYear();
});

const selectedEndYear = computed(() => {
  if (!project.value.endDate) return new Date().getFullYear();
  return new Date(project.value.endDate).getFullYear();
});

const formattedSelectedStartDate = computed(() => {
  if (!project.value.startDate) return 'Selecciona una fecha';
  const date = new Date(project.value.startDate);
  const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  return `${dayName}, ${monthName} ${day}`;
});

const formattedSelectedEndDate = computed(() => {
  if (!project.value.endDate) return 'Selecciona una fecha';
  const date = new Date(project.value.endDate);
  const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  return `${dayName}, ${monthName} ${day}`;
});

const selectedStartMonthYear = computed(() => {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const month = months[currentStartDate.value.getMonth()];
  const year = currentStartDate.value.getFullYear();
  return `${month} ${year}`;
});

const selectedEndMonthYear = computed(() => {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const month = months[currentEndDate.value.getMonth()];
  const year = currentEndDate.value.getFullYear();
  return `${month} ${year}`;
});

// Computed properties for date formatting (for input fields)
const formattedStartDate = computed(() => {
  if (!project.value.startDate) return '';
  return new Date(project.value.startDate).toLocaleDateString('es-CO');
});

const formattedEndDate = computed(() => {
  if (!project.value.endDate) return '';
  return new Date(project.value.endDate).toLocaleDateString('es-CO');
});

// Validation functions
function validateBudget(value) {
  if (!value) return 'El presupuesto es requerido';
  const numericValue = parseFloat(value.replace(/[^\d]/g, ''));
  return numericValue > 0 || 'El presupuesto debe ser mayor a 0';
}

// Budget formatting functions
function formatCurrency(value) {
  if (!value) return '';
  const numericValue = parseFloat(value.toString().replace(/[^\d]/g, ''));
  if (isNaN(numericValue)) return '';
  return numericValue.toLocaleString('es-CO');
}

function handleBudgetInput(event) {
  const value = event.target.value;
  const numericValue = parseFloat(value.replace(/[^\d]/g, ''));
  
  if (!isNaN(numericValue)) {
    project.value.budget = numericValue;
    formattedBudget.value = formatCurrency(numericValue);
  } else {
    formattedBudget.value = '';
    project.value.budget = 0;
  }
}

// Date picker functions
function updateStartDate(date) {
  project.value.startDate = date;
  startDateMenu.value = false;
}

function updateEndDate(date) {
  project.value.endDate = date;
  endDateMenu.value = false;
}

// Month navigation functions
function navigateStartMonth(direction) {
  const newDate = new Date(currentStartDate.value);
  newDate.setMonth(newDate.getMonth() + direction);
  currentStartDate.value = newDate;
}

function navigateEndMonth(direction) {
  const newDate = new Date(currentEndDate.value);
  newDate.setMonth(newDate.getMonth() + direction);
  currentEndDate.value = newDate;
}

// File handling functions
function handleCoverImageSelected(files) {
  if (files.length > 0) {
    project.value.coverImage = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      coverImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(files[0]);
  }
}

function handleCoverImageRemoved() {
    project.value.coverImage = null;
    coverImagePreview.value = null;
}

function handleDocumentsSelected(files) {
  project.value.files = [...(project.value.files || []), ...files];
}

function handleDocumentRemoved(file) {
  project.value.files = project.value.files.filter(f => f !== file);
}

// Helper functions
function getFileIcon(file) {
  const type = file.type || '';
  if (type.startsWith('image/')) return 'mdi-image';
  if (type.includes('pdf')) return 'mdi-file-pdf-box';
  if (type.includes('word')) return 'mdi-file-word-box';
  if (type.includes('excel')) return 'mdi-file-excel-box';
  if (type.includes('powerpoint')) return 'mdi-file-powerpoint-box';
  return 'mdi-file';
}

// Navigation functions
function nextStep() {
  if (canProceedToNextStep.value) {
    currentStep.value++;
  }
}

function addPhase() {
  if (newPhase.value.name) {
    project.value.phases.push({ ...newPhase.value });
    newPhase.value.name = '';
    newPhase.value.description = '';
  }
}

function removePhase(index) {
  project.value.phases.splice(index, 1);
}

// Notification functions
function showSuccessNotification() {
  notification.value = {
    show: true,
    type: 'success',
    title: '¡Proyecto Creado Exitosamente!',
    message: `El proyecto "${project.value.name}" ha sido creado y está listo para gestión.`,
    icon: 'mdi-check-circle'
  };
}

function showErrorNotification(message) {
  notification.value = {
    show: true,
    type: 'error',
    title: 'Error al Crear Proyecto',
    message: message,
    icon: 'mdi-alert-circle'
  };
}

onMounted(async () => {
  if (isEditing.value) {
    const projectId = parseInt(route.query.id);
    const existingProject = await projectStore.fetchProjectById(projectId);
    if (existingProject) {
      project.value = { 
        ...existingProject,
        coverImage: null,
        files: [],
       };
      if (existingProject.coverImage) {
        coverImagePreview.value = existingProject.coverImage;
      }
    }
  }
});

async function submitProject() {
  isLoading.value = true;

  try {
    // Preparar datos del proyecto en formato JSON
    const projectData = {
      nombre: project.value.name,
      descripcion: project.value.description,
      objetivo: project.value.objective,
      ubicacion: project.value.location,
      fecha_inicio: project.value.startDate ? new Date(project.value.startDate).toISOString().split('T')[0] : null,
      fecha_fin: project.value.endDate ? new Date(project.value.endDate).toISOString().split('T')[0] : null,
      presupuesto_total: project.value.budget,
      id_estado: 0 // No publico por defecto
      // id_organizacion se obtiene automáticamente del usuario logueado en el backend
    };

    console.log('Sending project data:', projectData);
    
    const newProject = await projectStore.addProject(projectData);
    
    if (newProject) {
      // Mostrar notificación de éxito
      showSuccessNotification();
      
      // Redirigir después de un breve delay para que se vea la notificación
      setTimeout(() => {
        router.push('/organization/projects');
      }, 2000);
    }
  } catch (err) {
    console.error('Error creating project:', err);
    showErrorNotification('Error al crear el proyecto. Por favor, inténtalo de nuevo.');
  } finally {
  isLoading.value = false;
  }
}
</script>

<style scoped>
/* Modern Stepper Styles */
.modern-stepper {
  border-radius: 16px !important;
}

.modern-stepper-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef) !important;
  border-radius: 16px 16px 0 0 !important;
  padding: 20px !important;
}

.modern-stepper-item {
  transition: all 0.3s ease !important;
}

.modern-stepper-item:hover {
  transform: scale(1.02) !important;
}

/* Phase Item Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.phase-item {
  transition: all 0.3s ease !important;
}

.phase-item:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* File List Styles */
.file-list {
  max-height: 200px;
  overflow-y: auto;
}

.file-list::-webkit-scrollbar {
  width: 6px;
}

.file-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.file-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.file-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Phases Summary */
.phases-summary {
  max-height: 150px;
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modern-stepper-header {
    padding: 16px !important;
  }
  
  .phase-item {
    margin-bottom: 12px !important;
  }
}

/* Animation for stepper items */
.modern-stepper-item {
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Google-Style Calendar */
.google-style-calendar {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  overflow: hidden !important;
  background: white !important;
  max-width: 320px !important;
  width: 320px !important;
  font-family: 'Roboto', sans-serif !important;
}

/* Selected Date Header */
.calendar-selected-header {
  background: linear-gradient(135deg, #4caf50, #45a049) !important;
    color: white !important;
  padding: 20px 24px !important;
  position: relative !important;
}

.selected-year {
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  opacity: 0.9 !important;
  margin-bottom: 4px !important;
}

.selected-date {
  font-size: 1.5rem !important;
  font-weight: 500 !important;
  line-height: 1.2 !important;
  text-transform: capitalize !important;
}

/* Month Navigation */
.calendar-month-nav {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 16px 24px !important;
  background: white !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

.month-year {
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #333 !important;
  text-transform: capitalize !important;
}

.nav-btn {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  color: #666 !important;
  transition: all 0.2s ease !important;
}

.nav-btn:hover {
  background: rgba(76, 175, 80, 0.1) !important;
  color: #4caf50 !important;
}

.nav-btn .v-icon {
  font-size: 20px !important;
}

/* Calendar Body */
.google-calendar {
  width: 100% !important;
  max-width: 320px !important;
  padding: 0 !important;
}

.google-calendar .v-date-picker-month {
  padding: 16px 24px 24px !important;
  width: 100% !important;
}

.google-calendar .v-date-picker-month__weekday {
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  color: #666 !important;
  padding: 8px 0 !important;
  text-align: center !important;
  width: calc(100% / 7) !important;
  display: inline-block !important;
  text-transform: lowercase !important;
}

.google-calendar .v-date-picker-month__day {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  min-height: 36px !important;
  border-radius: 50% !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  margin: 2px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  color: #333 !important;
}

.google-calendar .v-date-picker-month__day:hover {
  background: rgba(76, 175, 80, 0.1) !important;
  color: #4caf50 !important;
}

.google-calendar .v-date-picker-month__day--selected {
  background: #4caf50 !important;
  color: white !important;
  font-weight: 500 !important;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3) !important;
}

.google-calendar .v-date-picker-month__day--today {
  background: rgba(76, 175, 80, 0.1) !important;
  border: 1px solid #4caf50 !important;
  color: #4caf50 !important;
  font-weight: 500 !important;
}

.google-calendar .v-date-picker-month__day--today:hover {
  background: rgba(76, 175, 80, 0.2) !important;
}

/* Week container */
.google-calendar .v-date-picker-month__week {
  display: flex !important;
  justify-content: space-between !important;
  width: 100% !important;
  margin-bottom: 4px !important;
}

/* Adjacent months styling */
.google-calendar .v-date-picker-month__day--adjacent {
  color: #ccc !important;
  opacity: 0.6 !important;
}

.google-calendar .v-date-picker-month__day--adjacent:hover {
  background: rgba(0, 0, 0, 0.05) !important;
  opacity: 0.8 !important;
  color: #999 !important;
}

/* Date input field styles */
.modern-input.v-text-field--readonly .v-field {
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.modern-input.v-text-field--readonly .v-field:hover {
  background: rgba(76, 175, 80, 0.02) !important;
  border-color: rgba(76, 175, 80, 0.3) !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .google-style-calendar {
    max-width: 300px !important;
    width: 300px !important;
  }
  
  .google-calendar {
    max-width: 300px !important;
  }
  
  .google-calendar .v-date-picker-month__day {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    font-size: 0.8rem !important;
  }
  
  .calendar-selected-header {
    padding: 16px 20px !important;
  }
  
  .selected-date {
    font-size: 1.25rem !important;
  }
  
  .calendar-month-nav {
    padding: 12px 20px !important;
  }
  
  .google-calendar .v-date-picker-month {
    padding: 12px 20px 20px !important;
  }
}

/* Success Notification Styles */
.success-notification-card {
  border-radius: 16px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  border: 2px solid rgba(76, 175, 80, 0.2) !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%) !important;
}

.notification-icon {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Error notification styles */
.success-notification-card.error {
  border-color: rgba(244, 67, 54, 0.2) !important;
  background: linear-gradient(135deg, #ffffff 0%, #fff8f8 100%) !important;
}
</style>