import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';
import { useAuthStore } from '@/features/auth/stores/authStore';

export const useSearchStore = defineStore('search', () => {
  // State
  const query = ref('');
  const isOpen = ref(false);
  const isLoading = ref(false);
  const searchHistory = ref(JSON.parse(localStorage.getItem('search-history') || '[]'));
  const recentSearches = ref(JSON.parse(localStorage.getItem('recent-searches') || '[]'));

  // Store connections
  const projectStore = useProjectStore();
  const volunteerStore = useVolunteerStore();
  const authStore = useAuthStore();

  // Computed properties
  const hasQuery = computed(() => query.value.trim().length > 0);
  const canSearch = computed(() => hasQuery.value && !isLoading.value);

  // Search results
  const searchResults = ref({
    projects: [],
    volunteers: [],
    organizations: [],
    tasks: [],
    total: 0
  });

  // Search suggestions
  const suggestions = computed(() => {
    if (!hasQuery.value) return recentSearches.value.slice(0, 5);
    
    const queryLower = query.value.toLowerCase();
    const allSuggestions = [
      ...recentSearches.value,
      ...searchHistory.value
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(queryLower) && 
      suggestion !== query.value
    );
    
    return [...new Set(allSuggestions)].slice(0, 5);
  });

  // Actions
  async function search(searchQuery = query.value) {
    if (!searchQuery.trim()) return;
    
    isLoading.value = true;
    query.value = searchQuery.trim();
    
    try {
      // Add to search history
      addToHistory(searchQuery);
      
      // Perform search based on user role
      const results = await performSearch(searchQuery);
      searchResults.value = results;
      
      // Add to recent searches
      addToRecentSearches(searchQuery);
      
    } catch (error) {
      console.error('Search error:', error);
      searchResults.value = {
        projects: [],
        volunteers: [],
        organizations: [],
        tasks: [],
        total: 0
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function performSearch(searchQuery) {
    const results = {
      projects: [],
      volunteers: [],
      organizations: [],
      tasks: [],
      total: 0
    };

    // Search projects
    if (authStore.canViewProjects) {
      try {
        const projects = await projectStore.fetchProjects();
        results.projects = projects.filter(project => 
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } catch (error) {
        console.error('Error searching projects:', error);
      }
    }

    // Search volunteers (if user has permission)
    if (authStore.canManageUsers || authStore.isOrganization) {
      try {
        const volunteers = await volunteerStore.fetchVolunteers();
        results.volunteers = volunteers.filter(volunteer => 
          volunteer.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          volunteer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          volunteer.habilidades?.some(skill => 
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } catch (error) {
        console.error('Error searching volunteers:', error);
      }
    }

    // Search tasks within projects
    if (authStore.canViewProjects) {
      try {
        const projects = await projectStore.fetchProjects();
        const allTasks = [];
        
        projects.forEach(project => {
          if (project.phases) {
            project.phases.forEach(phase => {
              if (phase.tareas) {
                phase.tareas.forEach(task => {
                  if (task.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())) {
                    allTasks.push({
                      ...task,
                      projectName: project.name,
                      phaseName: phase.name
                    });
                  }
                });
              }
            });
          }
        });
        
        results.tasks = allTasks;
      } catch (error) {
        console.error('Error searching tasks:', error);
      }
    }

    results.total = results.projects.length + results.volunteers.length + 
                   results.organizations.length + results.tasks.length;

    return results;
  }

  function addToHistory(searchQuery) {
    const history = searchHistory.value;
    const index = history.indexOf(searchQuery);
    
    if (index > -1) {
      history.splice(index, 1);
    }
    
    history.unshift(searchQuery);
    
    // Keep only last 20 searches
    if (history.length > 20) {
      history.splice(20);
    }
    
    searchHistory.value = history;
    localStorage.setItem('search-history', JSON.stringify(history));
  }

  function addToRecentSearches(searchQuery) {
    const recent = recentSearches.value;
    const index = recent.indexOf(searchQuery);
    
    if (index > -1) {
      recent.splice(index, 1);
    }
    
    recent.unshift(searchQuery);
    
    // Keep only last 10 recent searches
    if (recent.length > 10) {
      recent.splice(10);
    }
    
    recentSearches.value = recent;
    localStorage.setItem('recent-searches', JSON.stringify(recent));
  }

  function clearHistory() {
    searchHistory.value = [];
    localStorage.removeItem('search-history');
  }

  function clearRecentSearches() {
    recentSearches.value = [];
    localStorage.removeItem('recent-searches');
  }

  function removeFromHistory(searchQuery) {
    const history = searchHistory.value;
    const index = history.indexOf(searchQuery);
    
    if (index > -1) {
      history.splice(index, 1);
      searchHistory.value = history;
      localStorage.setItem('search-history', JSON.stringify(history));
    }
  }

  function removeFromRecentSearches(searchQuery) {
    const recent = recentSearches.value;
    const index = recent.indexOf(searchQuery);
    
    if (index > -1) {
      recent.splice(index, 1);
      recentSearches.value = recent;
      localStorage.setItem('recent-searches', JSON.stringify(recent));
    }
  }

  function setQuery(newQuery) {
    query.value = newQuery;
  }

  function clearQuery() {
    query.value = '';
    searchResults.value = {
      projects: [],
      volunteers: [],
      organizations: [],
      tasks: [],
      total: 0
    };
  }

  function openSearch() {
    isOpen.value = true;
  }

  function closeSearch() {
    isOpen.value = false;
    clearQuery();
  }

  function toggleSearch() {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) {
      clearQuery();
    }
  }

  // Quick search functions
  function quickSearchProjects(query) {
    return projectStore.projects.filter(project => 
      project.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  function quickSearchVolunteers(query) {
    return volunteerStore.volunteers.filter(volunteer => 
      volunteer.nombre?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Search filters
  const searchFilters = ref({
    projects: true,
    volunteers: true,
    organizations: true,
    tasks: true
  });

  function toggleFilter(filter) {
    searchFilters.value[filter] = !searchFilters.value[filter];
  }

  function resetFilters() {
    searchFilters.value = {
      projects: true,
      volunteers: true,
      organizations: true,
      tasks: true
    };
  }

  // Search analytics
  const searchStats = ref({
    totalSearches: 0,
    popularSearches: [],
    searchTrends: []
  });

  function trackSearch(searchQuery) {
    searchStats.value.totalSearches++;
    
    // Update popular searches
    const popular = searchStats.value.popularSearches;
    const existing = popular.find(item => item.query === searchQuery);
    
    if (existing) {
      existing.count++;
    } else {
      popular.push({ query: searchQuery, count: 1 });
    }
    
    // Sort by count and keep top 10
    popular.sort((a, b) => b.count - a.count);
    if (popular.length > 10) {
      popular.splice(10);
    }
  }

  return {
    // State
    query,
    isOpen,
    isLoading,
    searchHistory,
    recentSearches,
    searchResults,
    searchFilters,
    searchStats,
    
    // Computed
    hasQuery,
    canSearch,
    suggestions,
    
    // Actions
    search,
    performSearch,
    addToHistory,
    addToRecentSearches,
    clearHistory,
    clearRecentSearches,
    removeFromHistory,
    removeFromRecentSearches,
    setQuery,
    clearQuery,
    openSearch,
    closeSearch,
    toggleSearch,
    
    // Quick search
    quickSearchProjects,
    quickSearchVolunteers,
    
    // Filters
    toggleFilter,
    resetFilters,
    
    // Analytics
    trackSearch,
  };
});

