<template>
  <v-container>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Organizaciones</h1>
        <p class="text-body-1 text-grey">
          Descubre organizaciones que están haciendo la diferencia
        </p>
      </div>
    </div>

    <!-- Filtros -->
    <OrganizationFilters
      v-model:filters="filters"
      @update:filters="handleFiltersChange"
    />

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-body-1 text-grey mt-4">Cargando organizaciones...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="organizations.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-domain-off</v-icon>
      <p class="text-body-1 text-grey mt-4">
        No se encontraron organizaciones con los filtros seleccionados
      </p>
      <ModernButton
        color="primary"
        variant="outlined"
        prepend-icon="mdi-filter-off"
        class="mt-4"
        @click="clearFilters"
      >
        Limpiar Filtros
      </ModernButton>
    </div>

    <!-- Grid de Organizaciones -->
    <v-row v-else>
      <v-col
        v-for="org in organizations"
        :key="org.id_organizacion"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <OrganizationCard
          :organization="org"
          @click="goToProfile(org)"
        />
      </v-col>
    </v-row>

    <!-- Paginación -->
    <div v-if="organizations.length > 0" class="d-flex justify-center mt-6">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @update:model-value="handlePageChange"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOrganizationsStore } from '../stores/organizationsStore';
import OrganizationCard from '../components/OrganizationCard.vue';
import OrganizationFilters from '../components/OrganizationFilters.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const router = useRouter();
const organizationsStore = useOrganizationsStore();

const organizations = ref([]);
const loading = ref(false);
const filters = ref({
  search: '',
  tipo: null,
  pais: null,
  areaEnfoque: null
});
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 12;

function handleFiltersChange(newFilters) {
  filters.value = newFilters;
  currentPage.value = 1;
  loadOrganizations();
}

function handlePageChange(page) {
  currentPage.value = page;
  loadOrganizations();
}

function clearFilters() {
  filters.value = {
    search: '',
    tipo: null,
    pais: null,
    areaEnfoque: null
  };
  currentPage.value = 1;
  loadOrganizations();
}

function goToProfile(org) {
  router.push({
    name: 'organization-public-profile',
    params: { id: org.id_organizacion }
  });
}

async function loadOrganizations() {
  loading.value = true;
  try {
    const data = await organizationsStore.fetchOrganizations({
      ...filters.value,
      page: currentPage.value,
      limit: itemsPerPage
    });
    organizations.value = data.items || [];
    totalPages.value = Math.ceil((data.total || 0) / itemsPerPage);
  } catch (error) {
    console.error('Error loading organizations:', error);
    organizations.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadOrganizations();
});
</script>

<style scoped>
</style>

