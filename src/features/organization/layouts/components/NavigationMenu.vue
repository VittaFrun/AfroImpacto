<template>
  <v-list nav density="compact" class="mt-4">
    <template v-for="item in navigationItems" :key="item.id">
      <!-- Items simples -->
      <v-list-item
        v-if="!item.type || item.type === 'item'"
        :value="item.id"
        :to="item.route"
        :active="isActive(item.route, item.exact)"
        link
        class="nav-item mx-2 mb-1"
      >
        <template v-slot:prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- Items con submenú -->
      <v-list-group
        v-else-if="item.type === 'group'"
        :value="item.id"
        class="nav-group mx-2 mb-1"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            class="nav-item-parent"
          >
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>

        <!-- Submenú Items -->
        <v-list-item
          v-for="child in item.children"
          :key="child.id"
          :value="child.id"
          :to="child.route"
          :active="isActive(child.route)"
          class="nav-item-child"
          link
        >
          <template v-slot:prepend>
            <v-icon size="small" class="ml-0">{{ child.icon }}</v-icon>
          </template>
          <v-list-item-title class="text-no-wrap">{{ child.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </template>
  </v-list>
</template>

<script setup>
import { navigationItems } from '@/features/organization/config/navigationConfig'
import { useNavigation } from '@/features/organization/composables/useNavigation'

const { isActive } = useNavigation()
</script>

