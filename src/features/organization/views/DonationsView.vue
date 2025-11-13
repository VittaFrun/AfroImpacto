<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Gestión de Donaciones</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Registra, visualiza y gestiona todas las donaciones recibidas para tus proyectos.
    </p>

    <!-- Statistics Cards (MetricStatCard - same style as dashboard) -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Total Recibido"
          icon="mdi-cash-multiple"
          iconColor="success"
          :value="formatCurrency(totalAmount)"
          valueColor="success"
          trendText="+15%"
        >
          <template #detail>
            <span class="text-success">{{ donations.length }} donaciones</span>
            <span class="text-grey">•</span>
            <span class="text-grey">Total acumulado</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Verificadas"
          icon="mdi-check-circle"
          iconColor="primary"
          :value="verifiedCount"
          valueColor="primary"
        >
          <template #detail>
            <span class="text-primary">{{ verifiedCount }} verificadas</span>
            <span class="text-grey">•</span>
            <span class="text-grey">{{ Math.round((verifiedCount / donations.length) * 100) || 0 }}% del total</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Pendientes"
          icon="mdi-clock-outline"
          iconColor="warning"
          :value="pendingCount"
          valueColor="warning"
        >
          <template #detail>
            <span class="text-warning">{{ pendingCount }} pendientes</span>
            <span class="text-grey">•</span>
            <span class="text-grey">Por verificar</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Este Mes"
          icon="mdi-chart-line"
          iconColor="info"
          :value="formatCurrency(monthlyAmount)"
          valueColor="info"
        >
          <template #detail>
            <span class="text-info">{{ formatCurrency(monthlyAmount) }} recibidos</span>
            <span class="text-grey">•</span>
            <span class="text-grey">Este mes</span>
          </template>
        </MetricStatCard>
      </v-col>
    </v-row>

    <v-card class="pa-6 rounded-lg elevation-0">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Historial de Donaciones</span>
        <v-btn 
          color="primary" 
          variant="flat" 
          @click="openAddDialog"
          class="modern-btn"
          size="large"
        >
          <v-icon start>mdi-plus-circle</v-icon>
          Registrar Donación
        </v-btn>
      </v-card-title>
      <v-divider class="my-4"></v-divider>
      
      <!-- Search and Filters -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Buscar por monto, método o proyecto..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            dense
            hide-details
            clearable
            class="modern-input"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="statusFilter"
            label="Filtrar por estado"
            :items="statusOptions"
            variant="outlined"
            dense
            hide-details
            clearable
            class="modern-input"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="methodFilter"
            label="Filtrar por método"
            :items="methodOptions"
            variant="outlined"
            dense
            hide-details
            clearable
            class="modern-input"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-menu v-model="dateMenu" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn 
                v-bind="props" 
                variant="outlined" 
                block
                class="modern-btn"
              >
                <v-icon start>mdi-calendar-range</v-icon>
                Fechas
              </v-btn>
            </template>
            <v-card min-width="300" class="modern-card">
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="dateFrom"
                      label="Desde"
                      type="date"
                      variant="outlined"
                      dense
                      class="modern-input"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="dateTo"
                      label="Hasta"
                      type="date"
                      variant="outlined"
                      dense
                      class="modern-input"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="applyDateFilter" class="modern-btn">
                  Aplicar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <!-- Donations Table -->
      <v-data-table
        :headers="headers"
        :items="filteredDonations"
        :search="search"
        class="elevation-0 donations-table modern-table"
        :loading="loading"
        loading-text="Cargando donaciones..."
        no-data-text="No hay donaciones registradas"
        :items-per-page="10"
      >
        <template v-slot:item.amount="{ item }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="success" size="small">mdi-currency-usd</v-icon>
            <span class="font-weight-bold text-success text-h6">
              {{ formatCurrency(item.amount) }}
            </span>
          </div>
        </template>
        
        <template v-slot:item.date="{ item }">
          <div class="d-flex flex-column">
            <div class="font-weight-bold">{{ formatDate(item.date) }}</div>
            <div class="text-caption text-grey">{{ formatTime(item.date) }}</div>
          </div>
        </template>
        
        <template v-slot:item.verified="{ item }">
          <v-chip 
            :color="item.statusColor" 
            size="small" 
            class="modern-chip"
            :class="`status-${item.statusText.toLowerCase()}`"
          >
            <v-icon start size="small">{{ getStatusIcon(item.statusText) }}</v-icon>
            {{ item.statusText }}
          </v-chip>
        </template>
        
        <template v-slot:item.method="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" :color="getMethodColor(item.methodName)" class="mr-3">
              <v-icon :color="getMethodColor(item.methodName) === 'primary' ? 'white' : 'primary'">
                {{ getMethodIcon(item.methodName) }}
              </v-icon>
            </v-avatar>
            <span class="font-weight-medium">{{ item.methodName }}</span>
          </div>
        </template>
        
        <template v-slot:item.projects="{ item }">
          <div class="d-flex flex-wrap">
            <v-chip 
              v-for="project in item.projects.slice(0, 2)" 
              :key="project.id" 
              class="ma-1 modern-chip" 
              color="blue-grey" 
              variant="tonal" 
              size="small"
            >
              {{ project.proyecto?.nombre || 'Proyecto' }}
            </v-chip>
            <v-chip 
              v-if="item.projects.length > 2" 
              class="ma-1 modern-chip" 
              color="grey" 
              variant="tonal" 
              size="small"
            >
              +{{ item.projects.length - 2 }}
            </v-chip>
          </div>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <div class="d-flex align-center">
            <v-tooltip text="Ver detalles">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-eye" 
                  variant="text" 
                  color="info" 
                  size="small" 
                  @click="viewDonation(item)"
                  v-bind="props"
                  class="action-btn"
                ></v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip text="Verificar donación" v-if="!item.verified && item.statusText === 'Pendiente'">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-check-circle" 
                  variant="text" 
                  color="success" 
                  size="small" 
                  @click="verifyDonation(item)"
                  v-bind="props"
                  class="action-btn"
                ></v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip text="Rechazar donación" v-if="!item.verified && item.statusText === 'Pendiente'">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-close-circle" 
                  variant="text" 
                  color="error" 
                  size="small" 
                  @click="rejectDonation(item)"
                  v-bind="props"
                  class="action-btn"
                ></v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip text="Editar donación">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-pencil" 
                  variant="text" 
                  color="warning" 
                  size="small" 
                  @click="editDonation(item)"
                  v-bind="props"
                  class="action-btn"
                ></v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip text="Eliminar donación">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-delete" 
                  variant="text" 
                  color="error" 
                  size="small" 
                  @click="confirmDeleteDonation(item)"
                  v-bind="props"
                  class="action-btn"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modern Add/Edit Donation Dialog -->
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="modern-dialog-header">
          <div class="d-flex align-center">
            <v-avatar :color="isEditing ? 'warning' : 'primary'" class="mr-4">
              <v-icon color="white">{{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h5 font-weight-bold">
                {{ isEditing ? 'Editar Donación' : 'Registrar Nueva Donación' }}
              </h2>
              <p class="text-body-2 text-grey mb-0">
                {{ isEditing ? 'Modifica los datos de la donación' : 'Completa la información de la nueva donación' }}
              </p>
            </div>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="donationForm.amount"
                  label="Monto de la Donación"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'El monto es requerido', v => v > 0 || 'El monto debe ser mayor a 0']"
                  required
                  prepend-inner-icon="mdi-currency-usd"
                  class="modern-input"
                  hint="Ingresa el monto en pesos colombianos"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="donationForm.methodId"
                  label="Método de Pago"
                  :items="methodOptions"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  :rules="[v => !!v || 'El método de pago es requerido']"
                  required
                  class="modern-input"
                  prepend-inner-icon="mdi-credit-card"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="donationForm.date"
                  label="Fecha de la Donación"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'La fecha es requerida']"
                  required
                  class="modern-input"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <div class="d-flex align-center">
                    <v-switch
                      v-model="donationForm.verified"
                      label="Donación Verificada"
                      color="success"
                      hide-details
                      class="mr-4"
                    ></v-switch>
                    <v-icon :color="donationForm.verified ? 'success' : 'warning'">
                      {{ donationForm.verified ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                    </v-icon>
                  </div>
                  <p class="text-caption text-grey mt-2">
                    {{ donationForm.verified ? 'Esta donación ha sido verificada' : 'Esta donación está pendiente de verificación' }}
                  </p>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="donationForm.conditions"
                  label="Condiciones de la Donación"
                  variant="outlined"
                  rows="3"
                  class="modern-input"
                  hint="Especifica cualquier condición especial de la donación"
                  persistent-hint
                  prepend-inner-icon="mdi-text"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="modern-dialog-actions pa-6">
          <v-btn 
            color="grey" 
            variant="outlined" 
            @click="closeDialog"
            class="modern-btn"
            size="large"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            :color="isEditing ? 'warning' : 'primary'" 
            variant="flat" 
            @click="saveDonation" 
            :loading="loading"
            class="modern-btn"
            size="large"
          >
            <v-icon start>{{ isEditing ? 'mdi-content-save' : 'mdi-check' }}</v-icon>
            {{ isEditing ? 'Actualizar' : 'Registrar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modern Reject Dialog -->
    <v-dialog v-model="rejectDialog" max-width="600px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="modern-dialog-header">
          <div class="d-flex align-center">
            <v-avatar color="error" class="mr-4">
              <v-icon color="white">mdi-close-circle</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h5 font-weight-bold">Rechazar Donación</h2>
              <p class="text-body-2 text-grey mb-0">Proporciona el motivo del rechazo</p>
            </div>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="rejectForm" v-model="rejectValid">
            <v-textarea
              v-model="rejectReason"
              label="Motivo del Rechazo"
              variant="outlined"
              rows="4"
              :rules="[v => !!v || 'El motivo es requerido']"
              required
              class="modern-input"
              hint="Explica por qué se rechaza esta donación"
              persistent-hint
              prepend-inner-icon="mdi-text"
            ></v-textarea>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="modern-dialog-actions pa-6">
          <v-btn 
            color="grey" 
            variant="outlined" 
            @click="rejectDialog = false"
            class="modern-btn"
            size="large"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="error" 
            variant="flat" 
            @click="confirmRejectDonation" 
            :loading="loading"
            class="modern-btn"
            size="large"
          >
            <v-icon start>mdi-check</v-icon>
            Rechazar Donación
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modern Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="modern-dialog-header">
          <div class="d-flex align-center">
            <v-avatar color="error" class="mr-4">
              <v-icon color="white">mdi-delete</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h5 font-weight-bold">Confirmar Eliminación</h2>
              <p class="text-body-2 text-grey mb-0">Esta acción no se puede deshacer</p>
            </div>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-alert type="warning" variant="tonal" class="mb-4">
            <v-icon start>mdi-alert</v-icon>
            ¿Estás seguro de que deseas eliminar la donación de 
            <strong>{{ formatCurrency(donationToDelete?.amount) }}</strong>?
          </v-alert>
        </v-card-text>
        
        <v-card-actions class="modern-dialog-actions pa-6">
          <v-btn 
            color="grey" 
            variant="outlined" 
            @click="deleteDialog = false"
            class="modern-btn"
            size="large"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="error" 
            variant="flat" 
            @click="deleteDonation" 
            :loading="loading"
            class="modern-btn"
            size="large"
          >
            <v-icon start>mdi-delete</v-icon>
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MetricStatCard from '@/components/ui/MetricStatCard.vue';
import { useDonationStore } from '@/features/organization/stores/donationStore';
import { storeToRefs } from 'pinia';
import { formatDate, formatCurrency } from '@/utils/formatters';

const donationStore = useDonationStore();
const { donations, loading, error } = storeToRefs(donationStore);

// Reactive data
const search = ref('');
const statusFilter = ref('');
const methodFilter = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const dateMenu = ref(false);
const dialog = ref(false);
const rejectDialog = ref(false);
const deleteDialog = ref(false);
const valid = ref(false);
const rejectValid = ref(false);
const isEditing = ref(false);
const donationToDelete = ref(null);
const donationToReject = ref(null);
const rejectReason = ref('');

// Form data
const donationForm = ref({
  amount: '',
  methodId: '',
  date: '',
  conditions: '',
  verified: false
});

// Table headers
const headers = ref([
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Monto', key: 'amount', sortable: true },
  { title: 'Fecha', key: 'date', sortable: true },
  { title: 'Estado', key: 'verified', sortable: true },
  { title: 'Método', key: 'method', sortable: true },
  { title: 'Proyectos', key: 'projects', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
]);

// Filter options
const statusOptions = ref([
  'Verificado',
  'Pendiente',
  'Rechazado',
  'Procesando'
]);

const methodOptions = ref([
  { text: 'Transferencia Bancaria', value: 1 },
  { text: 'Tarjeta de Crédito', value: 2 },
  { text: 'Efectivo', value: 3 },
  { text: 'Cheque', value: 4 },
  { text: 'Criptomonedas', value: 5 }
]);

// Computed properties
const filteredDonations = computed(() => {
  let filtered = donations.value;
  
  if (statusFilter.value) {
    filtered = filtered.filter(d => d.statusText === statusFilter.value);
  }
  
  if (methodFilter.value) {
    filtered = filtered.filter(d => d.methodId === methodFilter.value);
  }
  
  if (dateFrom.value) {
    filtered = filtered.filter(d => new Date(d.date) >= new Date(dateFrom.value));
  }
  
  if (dateTo.value) {
    filtered = filtered.filter(d => new Date(d.date) <= new Date(dateTo.value));
  }
  
  return filtered;
});

const totalAmount = computed(() => {
  return donations.value.reduce((sum, d) => sum + d.amount, 0);
});

const verifiedCount = computed(() => {
  return donations.value.filter(d => d.verified).length;
});

const pendingCount = computed(() => {
  return donations.value.filter(d => d.statusText === 'Pendiente').length;
});

const monthlyAmount = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return donations.value
    .filter(d => {
      const donationDate = new Date(d.date);
      return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
    })
    .reduce((sum, d) => sum + d.amount, 0);
});

// Methods
function openAddDialog() {
  isEditing.value = false;
  donationForm.value = {
    amount: '',
    methodId: '',
    date: new Date().toISOString().split('T')[0],
    conditions: '',
    verified: false
  };
  dialog.value = true;
}

function editDonation(donation) {
  isEditing.value = true;
  donationForm.value = {
    amount: donation.amount,
    methodId: donation.methodId,
    date: donation.date.split('T')[0],
    conditions: donation.conditions || '',
    verified: donation.verified
  };
  dialog.value = true;
}

function viewDonation(donation) {
  // TODO: Implement donation detail view
  console.log('View donation:', donation);
}

function confirmDeleteDonation(donation) {
  donationToDelete.value = donation;
  deleteDialog.value = true;
}

function rejectDonation(donation) {
  donationToReject.value = donation;
  rejectReason.value = '';
  rejectDialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  donationForm.value = {
    amount: '',
    methodId: '',
    date: '',
    conditions: '',
    verified: false
  };
}

function applyDateFilter() {
  dateMenu.value = false;
}

async function saveDonation() {
  if (!valid.value) return;
  
  try {
    if (isEditing.value) {
      await donationStore.updateDonation(donationToDelete.value.id, donationForm.value);
    } else {
      await donationStore.addDonation(donationForm.value);
    }
    closeDialog();
  } catch (err) {
    console.error('Error saving donation:', err);
  }
}

async function verifyDonation(donation) {
  try {
    await donationStore.verifyDonation(donation.id);
  } catch (err) {
    console.error('Error verifying donation:', err);
  }
}

async function confirmRejectDonation() {
  if (!rejectValid.value) return;
  
  try {
    await donationStore.rejectDonation(donationToReject.value.id, rejectReason.value);
    rejectDialog.value = false;
    donationToReject.value = null;
    rejectReason.value = '';
  } catch (err) {
    console.error('Error rejecting donation:', err);
  }
}

async function deleteDonation() {
  if (!donationToDelete.value) return;
  
  try {
    await donationStore.deleteDonation(donationToDelete.value.id);
    deleteDialog.value = false;
    donationToDelete.value = null;
  } catch (err) {
    console.error('Error deleting donation:', err);
  }
}

// Helper functions
// formatDate removida - ahora se usa desde @/utils/formatters

function formatTime(date) {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
}

function getStatusIcon(status) {
  const icons = {
    'Verificado': 'mdi-check-circle',
    'Pendiente': 'mdi-clock-outline',
    'Rechazado': 'mdi-close-circle',
    'Procesando': 'mdi-loading'
  };
  return icons[status] || 'mdi-help-circle';
}

function getMethodIcon(method) {
  const icons = {
    'Transferencia Bancaria': 'mdi-bank',
    'Tarjeta de Crédito': 'mdi-credit-card',
    'Efectivo': 'mdi-cash',
    'Cheque': 'mdi-file-document',
    'Criptomonedas': 'mdi-bitcoin'
  };
  return icons[method] || 'mdi-help-circle';
}

function getMethodColor(method) {
  const colors = {
    'Transferencia Bancaria': 'primary',
    'Tarjeta de Crédito': 'info',
    'Efectivo': 'success',
    'Cheque': 'warning',
    'Criptomonedas': 'orange'
  };
  return colors[method] || 'grey';
}

// Lifecycle
onMounted(() => {
  donationStore.fetchDonations();
});
</script>

<style scoped>
/* Modern Card Styles */
.stats-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--afro-border, rgba(0, 0, 0, 0.08));
  border-radius: var(--afro-radius-lg, 16px) !important;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(var(--v-theme-primary-rgb), 0.2);
}

/* Modern Button Styles */
.modern-btn {
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.modern-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

/* Modern Input Styles */
.modern-input {
  border-radius: 12px !important;
}

.modern-input :deep(.v-field) {
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.modern-input :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Modern Table Styles */
.modern-table {
  border-radius: 16px !important;
  overflow: hidden !important;
}

.modern-table :deep(.v-data-table__wrapper) {
  border-radius: 16px !important;
}

.modern-table :deep(.v-data-table-header) {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef) !important;
}

.modern-table :deep(.v-data-table-header th) {
  font-weight: 700 !important;
  color: #495057 !important;
}

/* Modern Chip Styles */
.modern-chip {
  border-radius: 20px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.modern-chip:hover {
  transform: scale(1.05) !important;
}

.status-verificado {
  background: linear-gradient(135deg, #28a745, #20c997) !important;
  color: white !important;
}

.status-pendiente {
  background: linear-gradient(135deg, #ffc107, #fd7e14) !important;
  color: white !important;
}

.status-rechazado {
  background: linear-gradient(135deg, #dc3545, #e83e8c) !important;
  color: white !important;
}

/* Modern Dialog Styles */
.modern-dialog {
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
}

.modern-dialog-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  padding: 24px !important;
}

.modern-dialog-actions {
  background: rgba(248, 249, 250, 0.8) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
}

/* Modern Card Styles */
.modern-card {
  border-radius: var(--afro-radius-lg, 16px) !important;
  border: 1px solid var(--afro-border, rgba(0, 0, 0, 0.08)) !important;
  box-shadow: 0 8px 24px -8px rgba(16, 24, 40, 0.12) !important;
}

/* Action Button Styles */
.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border-radius: 8px !important;
}

.action-btn:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Donations Table Specific */
.donations-table {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.donations-table :deep(.v-data-table__tr:hover) {
  background: rgba(var(--v-theme-primary-rgb), 0.02) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modern-dialog {
    margin: 16px !important;
    max-width: calc(100vw - 32px) !important;
  }
  
  .modern-btn {
    width: 100% !important;
    margin-bottom: 8px !important;
  }
  
  .action-btn {
    margin: 2px !important;
  }
}

/* Animation for dialog entrance */
.modern-dialog {
  animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading states */
.modern-btn:deep(.v-btn__loader) {
  color: white !important;
}

/* Focus states */
.modern-input:deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary-rgb), 0.2) !important;
}
</style>