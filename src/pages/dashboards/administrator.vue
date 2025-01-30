<script setup lang="ts">
import AnalyticsWebsiteAnalytics from '@/views/dashboards/administrator/AnalyticsWebsiteAnalytics.vue'
import DashboardStatistics from '@/views/dashboards/administrator/DashboardStatistics.vue'
import AnalyticsPaymentsOverview from '@/views/dashboards/administrator/AnalyticsPaymentsOverview.vue'
import AnalyticsTasksOverview from '@/views/dashboards/administrator/AnalyticsTasksOverview.vue'

definePage({
  meta: {
    action: 'view',
    subject: 'admin_dash',
  },
})

const { data: dashboardData, execute: fetchDashboardData } = await useApi<any>(createUrl('/dashboard'))

const statistics = computed(() => {
  return dashboardData.value.statistics
})

const platformAnalytics = computed(() => {
  return dashboardData.value.platform_analytics
})

const paymentsOverview = computed(() => {
  return dashboardData.value.payments_overview
})

const tasksOverview = computed(() => {
  return dashboardData.value.task_overview
})

fetchDashboardData()
</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="12"
      lg="12"
    >
      <DashboardStatistics
        class="h-100"
        :statistics="statistics"
      />
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <AnalyticsWebsiteAnalytics :platform-analytics="platformAnalytics" />
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <AnalyticsPaymentsOverview :payments-overview="paymentsOverview" />
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <AnalyticsTasksOverview :tasks-overview="tasksOverview" />
    </VCol>
  </VRow>
</template>
