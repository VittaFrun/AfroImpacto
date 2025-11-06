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
        :prependIcon="'mdi-arrow-left'"
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
                <v-form ref="basicForm" v-model="basicFormValid" @submit.prevent>
              <v-row>
                    <!-- Project Name - Full Width -->
                <v-col cols="12">
                      <v-card variant="outlined" class="pa-6 form-section-card">
                        <div class="d-flex align-center mb-4">
                          <v-icon class="mr-3" color="primary" size="24">mdi-folder-text</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Información Básica del Proyecto</span>
                        </div>
                        <v-text-field
                          v-model="project.name"
                          label="Nombre del Proyecto"
                          variant="outlined"
                          color="primary"
                          :rules="nameRules"
                          required
                          prepend-inner-icon="mdi-folder-text"
                          hint="Nombre descriptivo del proyecto"
                          persistent-hint
                          density="comfortable"
                          class="modern-input mb-0"
                          hide-details="auto"
                        />
                      </v-card>
                </v-col>
                    
                    <!-- Description and Objective - Side by Side -->
                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-6 form-section-card h-100">
                        <div class="d-flex align-center mb-4">
                          <v-icon class="mr-3" color="info" size="24">mdi-text</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Descripción</span>
                        </div>
                        <v-textarea
                          v-model="project.description"
                          label="Descripción del Proyecto"
                          variant="outlined"
                          color="primary"
                          :rows="5"
                          :rules="descriptionRules"
                          required
                          prepend-inner-icon="mdi-text"
                          hint="Describe brevemente el proyecto y su propósito"
                          persistent-hint
                          density="comfortable"
                          auto-grow
                          class="modern-input"
                          hide-details="auto"
                        />
                      </v-card>
                </v-col>
                    
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-6 form-section-card h-100">
                        <div class="d-flex align-center mb-4">
                          <v-icon class="mr-3" color="success" size="24">mdi-target</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Objetivo</span>
                        </div>
                        <v-textarea
                          v-model="project.objective"
                          label="Objetivo Principal"
                          variant="outlined"
                          color="primary"
                          :rows="5"
                          :rules="objectiveRules"
                          required
                          prepend-inner-icon="mdi-target"
                          hint="Define claramente qué se quiere lograr con este proyecto"
                          persistent-hint
                          density="comfortable"
                          auto-grow
                          class="modern-input"
                          hide-details="auto"
                        />
                      </v-card>
                </v-col>
                    
                    <!-- Location and Budget - Side by Side -->
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-6 form-section-card">
                        <div class="d-flex align-center mb-4">
                          <v-icon class="mr-3" color="warning" size="24">mdi-map-marker</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Ubicación</span>
                        </div>
                        <v-text-field
                          v-model="project.location"
                          label="Ubicación del Proyecto"
                          variant="outlined"
                          color="primary"
                          :rules="locationRules"
                          required
                          prepend-inner-icon="mdi-map-marker"
                          hint="Ciudad, región o área donde se desarrollará"
                          persistent-hint
                          density="comfortable"
                          class="modern-input mb-0"
                          hide-details="auto"
                        />
                      </v-card>
                </v-col>
                    
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-6 form-section-card">
                        <div class="d-flex align-center mb-4">
                          <v-icon class="mr-3" color="success" size="24">mdi-currency-usd</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Presupuesto Total</span>
                        </div>
                        <v-text-field
                          :model-value="budgetInput"
                          @update:model-value="handleBudgetInput"
                          @blur="formatBudgetDisplay"
                          label="Presupuesto en Pesos Colombianos"
                          variant="outlined"
                          color="primary"
                          :rules="budgetRules"
                          required
                          prepend-inner-icon="mdi-currency-usd"
                          class="modern-input mb-0"
                          hint="Ingresa el presupuesto estimado (solo números)"
                          persistent-hint
                          suffix="COP"
                          hide-details="auto"
                        />
                      </v-card>
                    </v-col>
                    
                    <!-- Project Dates - Full Width -->
                    <v-col cols="12">
                      <v-card variant="outlined" class="pa-6 form-section-card">
                        <div class="d-flex align-center mb-4">
                          <v-icon class="mr-3" color="primary" size="24">mdi-calendar-range</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Fechas del Proyecto</span>
                        </div>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-menu
                              v-model="startDateMenu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              :offset-y="true"
                              :offset-x="false"
                              location="bottom"
                              :min-width="400"
                              :max-width="420"
                              :z-index="1000"
                            >
                              <template v-slot:activator="{ props: menuProps }">
                                <v-text-field
                                  :model-value="formattedStartDate"
                                  label="Fecha de Inicio *"
                                  variant="outlined"
                                  color="primary"
                                  prepend-inner-icon="mdi-calendar-start"
                                  class="modern-input date-input"
                                  density="comfortable"
                                  readonly
                                  hint="Selecciona la fecha de inicio del proyecto"
                                  persistent-hint
                                  :rules="startDateRules"
                                  :error="!!startDateError"
                                  :error-messages="startDateError"
                                  v-bind="menuProps"
                                  hide-details="auto"
                                >
                                  <template v-if="project.startDate" v-slot:append-inner>
                                    <v-icon 
                                      color="error" 
                                      size="small"
                                      @click.stop="clearStartDate"
                                      class="cursor-pointer"
                                    >
                                      mdi-close-circle
                                    </v-icon>
                      </template>
                                </v-text-field>
                              </template>
                              <v-card class="corporate-date-picker" elevation="4">
                                <!-- Calendar Grid -->
                                <div class="corporate-picker-body">
                                  <v-date-picker
                                    v-model="startDatePickerValue"
                                    @update:model-value="handleStartDateChange"
                                    color="primary"
                                    locale="es"
                                    :min="minDate"
                                    :max="maxStartDate"
                                    show-adjacent-months
                                    class="corporate-calendar"
                                  />
                                </div>
                                
                                <!-- Footer with Selected Date and Confirm Button -->
                                <div class="corporate-picker-footer">
                                  <div class="selected-date-text">
                                    <span class="date-label">{{ formattedSelectedStartDateFull || 'Selecciona una fecha' }}</span>
                                  </div>
                                  <ModernButton
                                    color="primary"
                                    variant="text"
                                    size="small"
                                    @click="confirmStartDate"
                                    :disabled="!startDatePickerValue"
                                    text="Confirmar"
                                  />
                                </div>
                              </v-card>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-menu
                              v-model="endDateMenu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              :offset-y="true"
                              :offset-x="false"
                              location="bottom"
                              :min-width="400"
                              :max-width="420"
                              :z-index="1000"
                            >
                              <template v-slot:activator="{ props: menuProps }">
                                <v-text-field
                                  :model-value="formattedEndDate"
                                  label="Fecha de Fin *"
                                  variant="outlined"
                                  color="primary"
                                  prepend-inner-icon="mdi-calendar-end"
                                  class="modern-input date-input"
                                  density="comfortable"
                                  readonly
                                  hint="Selecciona la fecha de finalización del proyecto"
                                  persistent-hint
                                  :rules="endDateRules"
                                  :error="!!endDateError"
                                  :error-messages="endDateError"
                                  v-bind="menuProps"
                                  hide-details="auto"
                                >
                                  <template v-if="project.endDate" v-slot:append-inner>
                                    <v-icon 
                                      color="error" 
                                      size="small"
                                      @click.stop="clearEndDate"
                                      class="cursor-pointer"
                                    >
                                      mdi-close-circle
                                    </v-icon>
                    </template>
                                </v-text-field>
                              </template>
                              <v-card class="corporate-date-picker" elevation="4">
                                <!-- Calendar Grid -->
                                <div class="corporate-picker-body">
                                  <v-date-picker
                                    v-model="endDatePickerValue"
                                    @update:model-value="handleEndDateChange"
                                    color="primary"
                                    locale="es"
                                    :min="minEndDate"
                                    :max="maxDate"
                                    show-adjacent-months
                                    class="corporate-calendar"
                                  />
                                </div>
                                
                                <!-- Footer with Selected Date and Confirm Button -->
                                <div class="corporate-picker-footer">
                                  <div class="selected-date-text">
                                    <span class="date-label">{{ formattedSelectedEndDateFull || 'Selecciona una fecha' }}</span>
                                  </div>
                                  <ModernButton
                                    color="primary"
                                    variant="text"
                                    size="small"
                                    @click="confirmEndDate"
                                    :disabled="!endDatePickerValue"
                                    text="Confirmar"
                                  />
                                </div>
                              </v-card>
                            </v-menu>
                </v-col>
                        </v-row>
                        <v-alert
                          v-if="dateRangeError"
                          type="error"
                          variant="tonal"
                          density="compact"
                          class="mt-4"
                        >
                          {{ dateRangeError }}
                        </v-alert>
                      </v-card>
                </v-col>
                    
                    <!-- Cover Image and Documents - Side by Side -->
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-6 form-section-card h-100">
                        <div class="d-flex align-center mb-4">
                          <v-icon class="mr-3" color="primary" size="24">mdi-image</v-icon>
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
                        <div v-if="coverImagePreview" class="mt-4">
                          <v-img
                            :src="coverImagePreview"
                            max-height="150"
                            contain
                            class="rounded-lg cover-image-preview"
                          />
                        </div>
                      </v-card>
                </v-col>
                    
                <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-6 form-section-card h-100">
                        <div class="d-flex align-center mb-4">
                          <v-icon class="mr-3" color="primary" size="24">mdi-paperclip</v-icon>
                          <span class="text-subtitle-1 font-weight-bold">Documentos Adjuntos</span>
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
                    
                    <!-- Payment Configuration - Full Width -->
                    <v-col cols="12">
                      <v-card variant="outlined" class="pa-6 form-section-card">
                        <PaymentConfiguration 
                          :model-value="paymentData" 
                          @update:model-value="updatePaymentData" 
                        />
                      </v-card>
                    </v-col>
                    
                    <!-- Next Step Button -->
                    <v-col cols="12">
                      <div class="d-flex justify-end mt-6">
                        <ModernButton
                          color="primary"
                          variant="flat"
                          :appendIcon="'mdi-arrow-right'"
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
                        :rules="phaseNameRules"
                        required
                        prepend-inner-icon="mdi-format-list-numbered"
                        class="modern-input"
                        hide-details="auto"
                      />
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
                      />
                </v-col>
                <v-col cols="12" md="2">
                      <ModernButton
                        color="primary"
                        variant="flat"
                        :prependIcon="'mdi-plus'"
                        @click="addPhase"
                        :disabled="!canAddPhase"
                        block
                      >
                        Añadir
                      </ModernButton>
                </v-col>
              </v-row>
                </v-form>
                
                <div v-if="project.phases && project.phases.length > 0" class="mt-6">
                  <h4 class="text-subtitle-1 font-weight-bold mb-4">Fases Agregadas</h4>
                  <div class="phases-list">
                <transition-group name="list" tag="div">
                      <ModernCard
                        v-for="(phase, index) in project.phases"
                        :key="getPhaseKey(phase, index)"
                        :title="phase.name || phase.nombre"
                        :subtitle="(phase.description || phase.descripcion) || 'Sin descripción'"
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
                          />
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
                    :prependIcon="'mdi-arrow-left'"
                    @click="currentStep = 1"
                  >
                    Volver a Información Básica
                  </ModernButton>
                  
                  <ModernButton
                    color="primary"
                    variant="flat"
                    :appendIcon="'mdi-arrow-right'"
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
                              {{ formatDateForReview(project.startDate) }} - {{ formatDateForReview(project.endDate) }}
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold">Presupuesto:</v-list-item-title>
                            <v-list-item-subtitle>
                              {{ formatBudgetForReview(project.budget) }}
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold">Estado del Proyecto:</v-list-item-title>
                            <v-list-item-subtitle>
                              <v-chip color="info" size="small">
                                <v-icon start>mdi-play-circle</v-icon>
                                En Proceso
                              </v-chip>
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold">Visibilidad:</v-list-item-title>
                            <v-list-item-subtitle>
                              <v-chip color="warning" size="small">
                                <v-icon start>mdi-eye-off</v-icon>
                                Oculto del Catálogo
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
                        />
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
                          <div v-for="file in project.files" :key="getFileKey(file)" class="d-flex align-center mb-2">
                            <v-icon class="mr-2" color="info">{{ getFileIcon(file) }}</v-icon>
                            <span class="text-body-2">{{ getFileName(file) }}</span>
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
                          <div v-for="(phase, index) in project.phases" :key="getPhaseKey(phase, index)" class="d-flex align-center mb-2">
                            <v-chip size="small" color="primary" class="mr-2">{{ index + 1 }}</v-chip>
                            <div class="d-flex flex-column flex-grow-1">
                              <span class="text-body-2 font-weight-medium">{{ phase.name || phase.nombre }}</span>
                              <span v-if="phase.description || phase.descripcion" class="text-caption text-grey">
                                {{ phase.description || phase.descripcion }}
                              </span>
                            </div>
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
                      <li>El proyecto se creará con estado "En Proceso"</li>
                      <li>El proyecto estará oculto del catálogo de voluntarios por defecto</li>
                      <li>Podrás gestionar roles de voluntarios en la vista de gestión</li>
                      <li>Podrás agregar más fases y tareas detalladas</li>
                      <li>Podrás hacer el proyecto visible en el catálogo cuando esté listo</li>
                    </ul>
              </div>
                </v-alert>
                
                <!-- Action Buttons -->
                <div class="d-flex justify-space-between align-center mt-6">
                  <ModernButton
                    color="grey"
                    variant="outlined"
                    :prependIcon="'mdi-arrow-left'"
                    @click="currentStep = 2"
                  >
                    Volver a Fases
                  </ModernButton>
                  
                  <ModernButton
                    color="success"
                    variant="flat"
                    :prependIcon="'mdi-check'"
                    :loading="isLoading"
                    :disabled="!canSubmit"
                    @click="submitProject"
                    size="large"
                  >
                    {{ isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto' }}
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
            :prependIcon="'mdi-arrow-left'"
            @click="currentStep--"
          >
            Atrás
          </ModernButton>
          
          <v-spacer />
          
          <ModernButton
            v-if="currentStep < 3"
            color="primary"
            variant="flat"
            :appendIcon="'mdi-arrow-right'"
            @click="nextStep"
            :disabled="!canProceedToNextStep"
          >
            Siguiente
          </ModernButton>
          
          <ModernButton
            v-if="currentStep === 3"
            color="success"
            variant="flat"
            :prependIcon="'mdi-check'"
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
      <v-card class="success-notification-card" :class="{ error: notification.type === 'error' }">
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
          />
          
          <div v-if="notification.type === 'error'" class="mt-4">
            <ModernButton
              color="error"
              variant="flat"
              @click="notification.show = false"
              text="Entendido"
            />
          </div>
        </v-card-text>
    </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { storeToRefs } from 'pinia';
import ModernButton from '@/components/ui/ModernButton.vue';
import ModernCard from '@/components/ui/ModernCard.vue';
import DragDropFileUpload from '@/components/ui/DragDropFileUpload.vue';
import PaymentConfiguration from '@/components/ui/PaymentConfiguration.vue';

// Router and Store
const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const { error } = storeToRefs(projectStore);

// State
const currentStep = ref(1);
const isLoading = ref(false);
const basicFormValid = ref(false);
const phaseFormValid = ref(false);
const isEditing = computed(() => !!route.query.id);

// Project data - using reactive for deep reactivity
const project = reactive({
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
  phases: []
});

// Payment data - separate reactive object for PaymentConfiguration
const paymentData = reactive({
  paymentType: 'volunteer',
  paymentAmount: 0,
  paymentFrequency: 'none',
  paymentDescription: '',
  includesTransport: false,
  includesMeals: false,
  includesMaterials: false,
  includesInsurance: false
});

// UI State
const coverImagePreview = ref(null);
const newPhase = reactive({ name: '', description: '' });
const budgetInput = ref('');
const phaseForm = ref(null);
const basicForm = ref(null);

// Date picker state
const startDateMenu = ref(false);
const endDateMenu = ref(false);
const currentStartDate = ref(new Date());
const currentEndDate = ref(new Date());

// Date picker values (temporary selection)
const startDatePickerValue = ref(null);
const endDatePickerValue = ref(null);

// Date errors
const startDateError = ref('');
const endDateError = ref('');
const dateRangeError = ref('');

// Computed dates for validation
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const maxDate = computed(() => {
  const maxDateObj = new Date();
  maxDateObj.setFullYear(maxDateObj.getFullYear() + 10);
  return maxDateObj.toISOString().split('T')[0];
});

const maxStartDate = computed(() => {
  if (project.endDate && project.endDate !== '') {
    try {
      const dateStr = project.endDate.includes('T') ? project.endDate.split('T')[0] : project.endDate;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
    } catch (e) {
      // Ignore
    }
  }
  return maxDate.value;
});

const minEndDate = computed(() => {
  if (project.startDate && project.startDate !== '') {
    try {
      const dateStr = project.startDate.includes('T') ? project.startDate.split('T')[0] : project.startDate;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
    } catch (e) {
      // Ignore
    }
  }
  return minDate.value;
});

// Notification state
const notification = ref({
  show: false,
  type: 'success',
  title: '',
  message: '',
  icon: 'mdi-check-circle'
});

// Validation Rules
const nameRules = [
  v => !!v || 'El nombre es requerido',
  v => (v && v.length >= 3) || 'Mínimo 3 caracteres',
  v => (v && v.length <= 100) || 'Máximo 100 caracteres'
];

const descriptionRules = [
  v => !!v || 'La descripción es requerida',
  v => (v && v.length >= 10) || 'Mínimo 10 caracteres',
  v => (v && v.length <= 1000) || 'Máximo 1000 caracteres'
];

const objectiveRules = [
  v => !!v || 'El objetivo es requerido',
  v => (v && v.length >= 10) || 'El objetivo debe tener al menos 10 caracteres',
  v => (v && v.length <= 500) || 'Máximo 500 caracteres'
];

const locationRules = [
  v => !!v || 'La ubicación es requerida',
  v => (v && v.length >= 3) || 'Mínimo 3 caracteres',
  v => (v && v.length <= 100) || 'Máximo 100 caracteres'
];

const budgetRules = [
  v => !!v || 'El presupuesto es requerido',
  v => {
    const numericValue = parseFloat(v?.toString().replace(/[^\d]/g, '') || '0');
    return numericValue > 0 || 'El presupuesto debe ser mayor a 0';
  }
];

const startDateRules = [
  v => !!v || 'La fecha de inicio es requerida'
];

const endDateRules = [
  v => !!v || 'La fecha de fin es requerida'
];

const phaseNameRules = [
  v => !!v || 'El nombre es requerido'
];

// Computed Properties
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
  return basicFormValid.value && 
         project.name && 
         project.description &&
         project.objective &&
         project.location &&
         project.startDate && project.startDate !== '' &&
         project.endDate && project.endDate !== '' &&
         project.budget > 0;
});

const canAddPhase = computed(() => {
  return !!(newPhase.name && newPhase.name.trim());
});

// Date formatting computed properties
const formattedStartDate = computed(() => {
  if (!project.startDate || project.startDate === '') return '';
  try {
    const dateStr = project.startDate.includes('T') ? project.startDate.split('T')[0] : project.startDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    return '';
  }
});

const formattedEndDate = computed(() => {
  if (!project.endDate || project.endDate === '') return '';
  try {
    const dateStr = project.endDate.includes('T') ? project.endDate.split('T')[0] : project.endDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    return '';
  }
});

const selectedStartYear = computed(() => {
  if (!project.startDate || project.startDate === '') return currentStartDate.value.getFullYear();
  try {
    const dateStr = project.startDate.includes('T') ? project.startDate.split('T')[0] : project.startDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return currentStartDate.value.getFullYear();
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return currentStartDate.value.getFullYear();
    return date.getFullYear();
  } catch (e) {
    return currentStartDate.value.getFullYear();
  }
});

const selectedEndYear = computed(() => {
  if (!project.endDate || project.endDate === '') return currentEndDate.value.getFullYear();
  try {
    const dateStr = project.endDate.includes('T') ? project.endDate.split('T')[0] : project.endDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return currentEndDate.value.getFullYear();
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return currentEndDate.value.getFullYear();
    return date.getFullYear();
  } catch (e) {
    return currentEndDate.value.getFullYear();
  }
});

const formattedSelectedStartDate = computed(() => {
  if (!project.startDate || project.startDate === '') return 'Selecciona una fecha';
  try {
    const dateStr = project.startDate.includes('T') ? project.startDate.split('T')[0] : project.startDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Selecciona una fecha';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return 'Selecciona una fecha';
  const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
    return `${dayName}, ${monthName} ${date.getDate()}`;
  } catch (e) {
    return 'Selecciona una fecha';
  }
});

const formattedSelectedEndDate = computed(() => {
  if (!project.endDate || project.endDate === '') return 'Selecciona una fecha';
  try {
    const dateStr = project.endDate.includes('T') ? project.endDate.split('T')[0] : project.endDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Selecciona una fecha';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return 'Selecciona una fecha';
  const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
    return `${dayName}, ${monthName} ${date.getDate()}`;
  } catch (e) {
    return 'Selecciona una fecha';
  }
});

// Full date format for footer (e.g., "Enero 15, 2025")
const formattedSelectedStartDateFull = computed(() => {
  if (!startDatePickerValue.value) return 'Selecciona una fecha';
  try {
    const dateStr = typeof startDatePickerValue.value === 'string' 
      ? startDatePickerValue.value 
      : startDatePickerValue.value.toISOString().split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Selecciona una fecha';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return 'Selecciona una fecha';
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (e) {
    return 'Selecciona una fecha';
  }
});

const formattedSelectedEndDateFull = computed(() => {
  if (!endDatePickerValue.value) return 'Selecciona una fecha';
  try {
    const dateStr = typeof endDatePickerValue.value === 'string' 
      ? endDatePickerValue.value 
      : endDatePickerValue.value.toISOString().split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Selecciona una fecha';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return 'Selecciona una fecha';
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (e) {
    return 'Selecciona una fecha';
  }
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

// Helper Functions
function formatCurrency(value) {
  if (!value || value === 0) return '';
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^\d]/g, ''));
  if (isNaN(numericValue) || numericValue === 0) return '';
  return numericValue.toLocaleString('es-CO');
}

function formatDateForReview(dateString) {
  if (!dateString) return 'No especificada';
  try {
    const dateStr = dateString.includes('T') ? dateString.split('T')[0] : dateString;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Fecha inválida';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return 'Fecha inválida';
  }
}

function formatBudgetForReview(budget) {
  if (!budget || budget === 0) return 'No especificado';
  return `$${budget.toLocaleString('es-CO')} COP`;
}

function getPhaseKey(phase, index) {
  return phase.id || `phase-${index}-${phase.name || ''}`;
}

function getFileKey(file) {
  return file.name || file.file?.name || `file-${Date.now()}`;
}

function getFileName(file) {
  return file.name || file.file?.name || 'Archivo sin nombre';
}

function getFileIcon(file) {
  const type = file.type || file.file?.type || '';
  if (type.startsWith('image/')) return 'mdi-image';
  if (type.includes('pdf')) return 'mdi-file-pdf-box';
  if (type.includes('word')) return 'mdi-file-word-box';
  if (type.includes('excel')) return 'mdi-file-excel-box';
  if (type.includes('powerpoint')) return 'mdi-file-powerpoint-box';
  return 'mdi-file';
}

// Budget Input Handler
function handleBudgetInput(value) {
  const cleanValue = value?.toString().replace(/[^\d]/g, '') || '';
  budgetInput.value = cleanValue;
  
  if (cleanValue && cleanValue !== '') {
    const numericValue = parseFloat(cleanValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      project.budget = numericValue;
  } else {
      project.budget = 0;
    }
  } else {
    project.budget = 0;
  }
}

function formatBudgetDisplay() {
  if (project.budget && project.budget > 0) {
    budgetInput.value = formatCurrency(project.budget);
  }
}

// Date Picker Functions
function handleStartDateChange(date) {
  // Update the picker value when user clicks on calendar
  if (date) {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    startDatePickerValue.value = dateStr;
    
    // Update month/year selectors to match selected date
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      selectedStartMonth.value = month;
      selectedStartYear.value = year;
      currentStartDate.value = new Date(year, month - 1, day);
  }
}
}

function handleEndDateChange(date) {
  // Update the picker value when user clicks on calendar
  if (date) {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    endDatePickerValue.value = dateStr;
    
    // Update month/year selectors to match selected date
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      selectedEndMonth.value = month;
      selectedEndYear.value = year;
      currentEndDate.value = new Date(year, month - 1, day);
    }
  }
}

function confirmStartDate() {
  if (startDatePickerValue.value) {
    const dateStr = typeof startDatePickerValue.value === 'string' 
      ? startDatePickerValue.value 
      : startDatePickerValue.value.toISOString().split('T')[0];
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      project.startDate = dateStr;
      startDateError.value = '';
      
      // Update current date for navigation
      try {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (!isNaN(dateObj.getTime())) {
          currentStartDate.value = dateObj;
        }
      } catch (e) {
        console.error('Error parsing start date:', e);
      }
      
      // Validate date range
      validateDateRange();
      
      // Close menu
  startDateMenu.value = false;
}
  }
}

function confirmEndDate() {
  if (endDatePickerValue.value) {
    const dateStr = typeof endDatePickerValue.value === 'string' 
      ? endDatePickerValue.value 
      : endDatePickerValue.value.toISOString().split('T')[0];
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      project.endDate = dateStr;
      endDateError.value = '';
      
      // Update current date for navigation
      try {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (!isNaN(dateObj.getTime())) {
          currentEndDate.value = dateObj;
        }
      } catch (e) {
        console.error('Error parsing end date:', e);
      }
      
      // Validate date range
      validateDateRange();
      
      // Close menu
  endDateMenu.value = false;
}
  }
}

function clearStartDate() {
  project.startDate = '';
  startDatePickerValue.value = null;
  startDateError.value = '';
  dateRangeError.value = '';
}

function clearEndDate() {
  project.endDate = '';
  endDatePickerValue.value = null;
  endDateError.value = '';
  dateRangeError.value = '';
}

function validateDateRange() {
  dateRangeError.value = '';
  startDateError.value = '';
  endDateError.value = '';
  
  if (!project.startDate || !project.endDate) {
    return;
  }
  
  try {
    const startDateStr = project.startDate.includes('T') ? project.startDate.split('T')[0] : project.startDate;
    const endDateStr = project.endDate.includes('T') ? project.endDate.split('T')[0] : project.endDate;
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDateStr) || !/^\d{4}-\d{2}-\d{2}$/.test(endDateStr)) {
      return;
    }
    
    const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return;
    }
    
    if (endDate <= startDate) {
      dateRangeError.value = 'La fecha de fin debe ser posterior a la fecha de inicio.';
      endDateError.value = 'La fecha de fin debe ser posterior a la fecha de inicio.';
    }
  } catch (e) {
    console.error('Error validating date range:', e);
  }
}

function updateStartMonthYear() {
  // Update the calendar view when month/year changes
  if (selectedStartMonth.value && selectedStartYear.value) {
    const newDate = new Date(selectedStartYear.value, selectedStartMonth.value - 1, 1);
    currentStartDate.value = newDate;
    
    // Update picker value to show the new month in calendar
    if (!startDatePickerValue.value) {
      // If no date selected, set to first day of selected month
      startDatePickerValue.value = `${selectedStartYear.value}-${String(selectedStartMonth.value).padStart(2, '0')}-01`;
    } else {
      // Keep current day but update month/year
      const dateStr = typeof startDatePickerValue.value === 'string' 
        ? startDatePickerValue.value 
        : startDatePickerValue.value.toISOString().split('T')[0];
      const [currentYear, currentMonth, day] = dateStr.split('-');
      
      // Validate day exists in new month
      const daysInMonth = new Date(selectedStartYear.value, selectedStartMonth.value, 0).getDate();
      const validDay = Math.min(parseInt(day), daysInMonth);
      
      startDatePickerValue.value = `${selectedStartYear.value}-${String(selectedStartMonth.value).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`;
    }
  }
}

function updateEndMonthYear() {
  // Update the calendar view when month/year changes
  if (selectedEndMonth.value && selectedEndYear.value) {
    const newDate = new Date(selectedEndYear.value, selectedEndMonth.value - 1, 1);
    currentEndDate.value = newDate;
    
    // Update picker value to show the new month in calendar
    if (!endDatePickerValue.value) {
      // If no date selected, set to first day of selected month
      endDatePickerValue.value = `${selectedEndYear.value}-${String(selectedEndMonth.value).padStart(2, '0')}-01`;
    } else {
      // Keep current day but update month/year
      const dateStr = typeof endDatePickerValue.value === 'string' 
        ? endDatePickerValue.value 
        : endDatePickerValue.value.toISOString().split('T')[0];
      const [currentYear, currentMonth, day] = dateStr.split('-');
      
      // Validate day exists in new month
      const daysInMonth = new Date(selectedEndYear.value, selectedEndMonth.value, 0).getDate();
      const validDay = Math.min(parseInt(day), daysInMonth);
      
      endDatePickerValue.value = `${selectedEndYear.value}-${String(selectedEndMonth.value).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`;
    }
  }
}

function navigateStartMonth(direction) {
  // Legacy function - kept for compatibility
  const newDate = new Date(currentStartDate.value);
  newDate.setMonth(newDate.getMonth() + direction);
  currentStartDate.value = newDate;
  selectedStartMonth.value = newDate.getMonth() + 1;
  selectedStartYear.value = newDate.getFullYear();
}

function navigateEndMonth(direction) {
  // Legacy function - kept for compatibility
  const newDate = new Date(currentEndDate.value);
  newDate.setMonth(newDate.getMonth() + direction);
  currentEndDate.value = newDate;
  selectedEndMonth.value = newDate.getMonth() + 1;
  selectedEndYear.value = newDate.getFullYear();
}

// Watch for menu open to sync picker values
watch(startDateMenu, (isOpen) => {
  if (isOpen) {
    // Use nextTick to ensure DOM is ready
    setTimeout(() => {
      // Sync picker value with current project date
      if (project.startDate && project.startDate !== '') {
        const dateStr = project.startDate.includes('T') ? project.startDate.split('T')[0] : project.startDate;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [year, month, day] = dateStr.split('-').map(Number);
          startDatePickerValue.value = dateStr;
          selectedStartMonth.value = month;
          selectedStartYear.value = year;
          currentStartDate.value = new Date(year, month - 1, day);
        } else {
          startDatePickerValue.value = null;
          const today = new Date();
          selectedStartMonth.value = today.getMonth() + 1;
          selectedStartYear.value = today.getFullYear();
        }
      } else {
        startDatePickerValue.value = null;
        const today = new Date();
        selectedStartMonth.value = today.getMonth() + 1;
        selectedStartYear.value = today.getFullYear();
        // Set initial view date to today
        startDatePickerValue.value = today.toISOString().split('T')[0];
      }
    }, 50);
  }
});

watch(endDateMenu, (isOpen) => {
  if (isOpen) {
    // Use nextTick to ensure DOM is ready
    setTimeout(() => {
      // Sync picker value with current project date
      if (project.endDate && project.endDate !== '') {
        const dateStr = project.endDate.includes('T') ? project.endDate.split('T')[0] : project.endDate;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [year, month, day] = dateStr.split('-').map(Number);
          endDatePickerValue.value = dateStr;
          selectedEndMonth.value = month;
          selectedEndYear.value = year;
          currentEndDate.value = new Date(year, month - 1, day);
        } else {
          endDatePickerValue.value = null;
          const today = new Date();
          selectedEndMonth.value = today.getMonth() + 1;
          selectedEndYear.value = today.getFullYear();
        }
      } else {
        endDatePickerValue.value = null;
        const today = new Date();
        selectedEndMonth.value = today.getMonth() + 1;
        selectedEndYear.value = today.getFullYear();
        // Set initial view date to today or start date
        if (project.startDate && project.startDate !== '') {
          const startDateStr = project.startDate.includes('T') ? project.startDate.split('T')[0] : project.startDate;
          endDatePickerValue.value = startDateStr;
          const [year, month] = startDateStr.split('-').map(Number);
          selectedEndMonth.value = month;
          selectedEndYear.value = year;
        } else {
          endDatePickerValue.value = today.toISOString().split('T')[0];
        }
      }
    }, 50);
  }
});

// Payment Configuration Handler
function updatePaymentData(data) {
  if (data) {
    Object.assign(paymentData, {
      paymentType: data.paymentType ?? 'volunteer',
      paymentAmount: data.paymentAmount ?? 0,
      paymentFrequency: data.paymentFrequency ?? 'none',
      paymentDescription: data.paymentDescription ?? '',
      includesTransport: data.includesTransport ?? false,
      includesMeals: data.includesMeals ?? false,
      includesMaterials: data.includesMaterials ?? false,
      includesInsurance: data.includesInsurance ?? false
    });
  }
}

// File Handlers
function handleCoverImageSelected(files) {
  if (files && files.length > 0) {
    project.coverImage = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      coverImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(files[0]);
  }
}

function handleCoverImageRemoved() {
  project.coverImage = null;
    coverImagePreview.value = null;
}

function handleDocumentsSelected(files) {
  if (files && files.length > 0) {
    project.files = [...(project.files || []), ...files];
  }
}

function handleDocumentRemoved(file) {
  if (project.files) {
    project.files = project.files.filter(f => f !== file && f.file !== file);
  }
}

// Phase Management
function addPhase() {
  if (canAddPhase.value) {
    const phaseToAdd = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newPhase.name.trim(),
      description: newPhase.description?.trim() || '',
      orden: (project.phases?.length || 0) + 1
    };
    
    if (!project.phases) {
      project.phases = [];
    }
    project.phases.push(phaseToAdd);
    
    // Reset form
    newPhase.name = '';
    newPhase.description = '';
    if (phaseForm.value) {
      phaseForm.value.reset();
    }
  }
}

function removePhase(index) {
  if (project.phases && index >= 0 && index < project.phases.length) {
    project.phases.splice(index, 1);
  }
}

// Navigation
function nextStep() {
  if (canProceedToNextStep.value) {
    currentStep.value++;
  }
}

// Notification Functions
function showSuccessNotification() {
  notification.value = {
    show: true,
    type: 'success',
    title: '¡Proyecto Creado Exitosamente!',
    message: `El proyecto "${project.name}" ha sido creado y está listo para gestión.`,
    icon: 'mdi-check-circle'
  };
}

function showErrorNotification(message) {
  notification.value = {
    show: true,
    type: 'error',
    title: 'Error al Crear Proyecto',
    message: message || 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
    icon: 'mdi-alert-circle'
  };
}

// Date formatting for submission
function formatDateForSubmission(dateString) {
  if (!dateString || dateString === '') return null;
  const dateStr = dateString.includes('T') ? dateString.split('T')[0] : dateString;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (year && month && day) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return null;
  }
}

// Validate dates
function validateDates() {
  if (!project.startDate || project.startDate === '' || !project.endDate || project.endDate === '') {
    return { valid: false, message: 'Por favor selecciona las fechas de inicio y fin del proyecto.' };
  }
  
  try {
    const startDateStr = project.startDate.includes('T') ? project.startDate.split('T')[0] : project.startDate;
    const endDateStr = project.endDate.includes('T') ? project.endDate.split('T')[0] : project.endDate;
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDateStr) || !/^\d{4}-\d{2}-\d{2}$/.test(endDateStr)) {
      return { valid: false, message: 'Las fechas seleccionadas no son válidas.' };
    }
    
    const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { valid: false, message: 'Las fechas seleccionadas no son válidas.' };
    }
    
    if (endDate <= startDate) {
      return { valid: false, message: 'La fecha de fin debe ser posterior a la fecha de inicio.' };
    }
    
    return { valid: true };
  } catch (e) {
    console.error('Error validating dates:', e);
    return { valid: false, message: 'Error al validar las fechas. Por favor, verifica que sean correctas.' };
      }
    }

// Submit Project
async function submitProject() {
  // Validate form
  if (!canSubmit.value) {
    showErrorNotification('Por favor completa todos los campos requeridos (nombre, descripción, objetivo, ubicación, fechas y presupuesto).');
    return;
  }

  // Validate dates
  const dateValidation = validateDates();
  if (!dateValidation.valid) {
    showErrorNotification(dateValidation.message);
    return;
  }

  // Validate budget
  if (!project.budget || project.budget <= 0) {
    showErrorNotification('El presupuesto debe ser mayor a 0.');
    return;
  }

  isLoading.value = true;

  try {
    // Prepare project data according to diagrama.txt schema
    const projectData = {
      nombre: project.name.trim(),
      descripcion: project.description.trim(),
      objetivo: project.objective.trim(),
      ubicacion: project.location.trim(),
      fecha_inicio: formatDateForSubmission(project.startDate),
      fecha_fin: formatDateForSubmission(project.endDate),
      presupuesto_total: Number(project.budget) || 0,
      categoria: null, // Can be added later in project edit view
      imagen_principal: null, // Will be uploaded separately after project creation
      documento: null, // Will be uploaded separately after project creation
      id_estado: 1, // En Proceso por defecto (según diagrama)
      es_publico: false // No visible en catálogo por defecto (según diagrama default: true, pero lo dejamos false para control)
    };

    // Final validation
    if (!projectData.nombre || !projectData.descripcion || !projectData.objetivo || !projectData.ubicacion) {
      showErrorNotification('Por favor completa todos los campos de texto requeridos.');
      isLoading.value = false;
      return;
    }

    if (!projectData.fecha_inicio || !projectData.fecha_fin) {
      showErrorNotification('Por favor selecciona las fechas de inicio y fin del proyecto.');
      isLoading.value = false;
      return;
    }

    // Create project
    const newProject = await projectStore.addProject(projectData);
    
    // Create phases if any
    if (newProject && newProject.id && project.phases && project.phases.length > 0) {
      try {
        // Filter out phases that don't have required data
        const validPhases = project.phases.filter(phase => {
          const hasName = (phase.name || phase.nombre || '').trim() !== '';
          const hasDescription = (phase.description || phase.descripcion || '').trim() !== '';
          return hasName && hasDescription;
        });
        
        if (validPhases.length === 0) {
          console.log('No valid phases to create');
        } else {
          console.log(`Creating ${validPhases.length} phase(s) for project ${newProject.id}`);
          
          for (let index = 0; index < validPhases.length; index++) {
            const phase = validPhases[index];
            
            const phaseData = {
              nombre: (phase.name || phase.nombre || '').trim(),
              descripcion: (phase.description || phase.descripcion || '').trim(),
              orden: phase.orden || (index + 1)
            };
            
            console.log(`Creating phase ${index + 1}/${validPhases.length} for project ${newProject.id}:`, phaseData);
            
            try {
              await projectStore.addProjectPhase(newProject.id, phaseData);
              console.log(`Phase ${index + 1} created successfully`);
            } catch (singlePhaseError) {
              console.error(`Error creating phase ${index + 1}:`, singlePhaseError);
              // Continue with next phase even if one fails
            }
          }
        }
      } catch (phaseError) {
        console.error('Error creating phases:', phaseError);
        const phaseErrorMessage = phaseError.response?.data?.message || 
                                  phaseError.response?.data?.error || 
                                  phaseError.message || 
                                  'Error al crear algunas fases';
        showErrorNotification(`Proyecto creado, pero hubo un error al crear las fases: ${phaseErrorMessage}`);
      }
    } else {
      console.log('No phases to create or project not created successfully');
    }
    
    // Refresh projects list
    await projectStore.fetchProjects();
    
    // Show success notification
      showSuccessNotification();
      
    // Redirect after delay
      setTimeout(() => {
      router.push('/organization/dashboard/projects');
      }, 2000);
  } catch (err) {
    console.error('Error creating project:', err);
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error || 
                        err.message || 
                        'Error al crear el proyecto. Por favor, inténtalo de nuevo.';
    showErrorNotification(errorMessage);
  } finally {
  isLoading.value = false;
  }
}

// Initialize component
onMounted(async () => {
  // Initialize phases array
  if (!Array.isArray(project.phases)) {
    project.phases = [];
  }
  
  // Load existing project if editing
  if (isEditing.value) {
    try {
      const projectId = parseInt(route.query.id);
      if (projectId && !isNaN(projectId)) {
        const existingProject = await projectStore.fetchProjectById(projectId);
        if (existingProject) {
          // Map existing project data
          Object.assign(project, {
            id: existingProject.id,
            name: existingProject.name || '',
            description: existingProject.description || '',
            objective: existingProject.objective || '',
            location: existingProject.location || '',
            startDate: existingProject.startDate || '',
            endDate: existingProject.endDate || '',
            budget: existingProject.budget || 0,
            coverImage: null,
            files: [],
            phases: existingProject.phases || []
          });
          
          // Load payment data
          if (existingProject.paymentType) {
            Object.assign(paymentData, {
              paymentType: existingProject.paymentType,
              paymentAmount: existingProject.paymentAmount || 0,
              paymentFrequency: existingProject.paymentFrequency || 'none',
              paymentDescription: existingProject.paymentDescription || '',
              includesTransport: existingProject.includesTransport || false,
              includesMeals: existingProject.includesMeals || false,
              includesMaterials: existingProject.includesMaterials || false,
              includesInsurance: existingProject.includesInsurance || false
            });
          }
          
          // Set cover image preview
          if (existingProject.coverImage) {
            coverImagePreview.value = existingProject.coverImage;
          }
          
          // Format budget
          if (existingProject.budget) {
            budgetInput.value = formatCurrency(existingProject.budget);
          }
          
          // Sync dates
          if (existingProject.startDate) {
            try {
              const dateStr = existingProject.startDate.includes('T') ? existingProject.startDate.split('T')[0] : existingProject.startDate;
              if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const [year, month, day] = dateStr.split('-').map(Number);
                currentStartDate.value = new Date(year, month - 1, day);
              }
            } catch (e) {
              console.error('Error parsing start date:', e);
            }
          }
          
          if (existingProject.endDate) {
            try {
              const dateStr = existingProject.endDate.includes('T') ? existingProject.endDate.split('T')[0] : existingProject.endDate;
              if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const [year, month, day] = dateStr.split('-').map(Number);
                currentEndDate.value = new Date(year, month - 1, day);
              }
            } catch (e) {
              console.error('Error parsing end date:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading project for editing:', err);
      showErrorNotification('Error al cargar el proyecto. Por favor, inténtalo de nuevo.');
    }
  }
});
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

/* Form Section Cards */
.form-section-card {
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  min-height: 100%;
}

.form-section-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(var(--v-theme-primary-rgb), 0.2) !important;
}

/* Cover Image Preview */
.cover-image-preview {
  border: 2px solid rgba(var(--v-theme-outline), 0.12) !important;
  transition: all 0.3s ease !important;
}

.cover-image-preview:hover {
  border-color: rgba(var(--v-theme-primary-rgb), 0.3) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modern-stepper-header {
    padding: 16px !important;
  }
  
  .phase-item {
    margin-bottom: 12px !important;
  }
  
  .form-section-card {
    padding: 20px !important;
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

/* Corporate Date Picker Styles - Clean White Design with Green Accent */
.corporate-date-picker {
  background: white !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  min-width: 400px !important;
  max-width: 420px !important;
  width: 400px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  position: relative !important;
  z-index: 1000 !important;
  margin: 0 !important;
}

/* Header styles removed - using default v-date-picker header */

.corporate-picker-body {
  padding: 12px 16px !important;
  background: white !important;
  min-height: 300px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.corporate-calendar {
  width: 100% !important;
  max-width: 100% !important;
}

.corporate-calendar :deep(.v-date-picker-month) {
  padding: 0 8px !important;
  width: 100% !important;
  max-width: 100% !important;
}

.corporate-calendar :deep(.v-date-picker-month__week) {
  padding: 0 4px !important;
  width: 100% !important;
  margin: 0 !important;
}

.corporate-calendar :deep(.v-date-picker-month__weekday) {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #424242 !important;
  padding: 10px 4px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  width: calc(100% / 7) !important;
  text-align: center !important;
  overflow: visible !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}

.corporate-calendar :deep(.v-date-picker-month__day) {
  width: 42px !important;
  height: 42px !important;
  min-width: 42px !important;
  min-height: 42px !important;
  font-size: 0.875rem !important;
  color: #424242 !important;
  border-radius: 50% !important;
  margin: 3px !important;
  position: relative !important;
}

.corporate-calendar :deep(.v-date-picker-month__day:hover) {
  background: rgba(78, 199, 165, 0.1) !important;
  color: #424242 !important;
}

.corporate-calendar :deep(.v-date-picker-month__day--selected) {
  background: transparent !important;
  color: #424242 !important;
  font-weight: 700 !important;
  border: none !important;
  box-shadow: none !important;
}

/* Remove any background overlays that cause color superposition */
.corporate-calendar :deep(.v-date-picker-month__day--selected::before),
.corporate-calendar :deep(.v-date-picker-month__day--selected::after) {
  display: none !important;
}

.corporate-calendar :deep(.v-date-picker-month__day--today) {
  background: rgba(78, 199, 165, 0.08) !important;
  border: 1.5px solid #4EC7A5 !important;
  color: #424242 !important;
  font-weight: 600 !important;
}

/* Ensure today doesn't override selected style */
.corporate-calendar :deep(.v-date-picker-month__day--today.v-date-picker-month__day--selected) {
  background: transparent !important;
  border: none !important;
  color: #424242 !important;
  font-weight: 700 !important;
}

/* Turquoise accent for date picker header */
.corporate-calendar :deep(.v-date-picker-header) {
  color: #424242 !important;
}

.corporate-calendar :deep(.v-date-picker-header__btn) {
  color: #424242 !important;
}

.corporate-calendar :deep(.v-date-picker-header__btn:hover) {
  background: rgba(78, 199, 165, 0.1) !important;
}

.corporate-calendar :deep(.v-date-picker-month__day--adjacent) {
  color: #bdbdbd !important;
  opacity: 0.6 !important;
}

.corporate-picker-footer {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 16px !important;
  background: white !important;
  border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
  position: relative !important;
  z-index: 1 !important;
}

.selected-date-text {
  flex: 1 !important;
}

.date-label {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  color: #424242 !important;
}

/* Ensure v-menu content doesn't overlap */
:deep(.v-menu__content) {
  z-index: 1000 !important;
  position: fixed !important;
}

:deep(.v-overlay__content) {
  z-index: 1000 !important;
}

/* Legacy styles kept for compatibility */
.date-picker-card {
  border-radius: 12px !important;
  overflow: hidden !important;
  min-width: 300px !important;
  max-width: 340px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(25, 118, 210, 0.2) !important;
}

.date-picker-header {
  background: linear-gradient(135deg, #1976d2, #1565c0) !important;
  color: white !important;
  padding: 16px 20px !important;
}

.text-white-secondary {
  color: rgba(255, 255, 255, 0.85) !important;
}

.month-nav-btn {
  color: white !important;
  margin: 0 2px !important;
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
}

.month-nav-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 50% !important;
}

.date-picker-body {
  padding: 12px 16px !important;
  background: white !important;
}

.date-picker-actions {
  padding: 10px 16px !important;
  border-top: 1px solid rgba(25, 118, 210, 0.12) !important;
  background: #fafafa !important;
  display: flex !important;
  gap: 8px !important;
}

.date-input {
  cursor: pointer !important;
}

.date-input .v-field {
  cursor: pointer !important;
}

.date-input .v-field--focused {
  border-color: #1976d2 !important;
}

.cursor-pointer {
  cursor: pointer !important;
}

/* Google-Style Calendar (Legacy - kept for compatibility) */
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

.success-notification-card.error {
  border-color: rgba(244, 67, 54, 0.2) !important;
  background: linear-gradient(135deg, #ffffff 0%, #fff8f8 100%) !important;
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
</style>
