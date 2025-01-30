<script setup lang="ts">

const props = defineProps({
  statistics: {
    type: Array,
    required: true,
  },
})

const statistics = [
  {
    title: 'Clients',
    stats: props.statistics.total_clients,
    icon: 'tabler-chart-pie-2',
    color: 'primary',
  },
  {
    title: 'Companies',
    stats: props.statistics.total_companies,
    icon: 'tabler-users',
    color: 'info',
  },
  {
    title: 'Businesses',
    stats: props.statistics.total_businesses,
    icon: 'tabler-shopping-cart',
    color: 'error',
  },
  {
    title: 'Services',
    stats: props.statistics.total_services,
    icon: 'tabler-currency-dollar',
    color: 'success',
  },
  {
    title: 'Obligations',
    stats: props.statistics.total_obligations,
    icon: 'tabler-currency-dollar',
    color: 'success',
  },
  {
    title: 'Tasks',
    stats: props.statistics.total_tasks,
    icon: 'tabler-shopping-cart',
    color: 'error',
  },

]
</script>

<template>
  <VCard title="Statistics">
    <template #append>
      <span class="text-sm text-disabled">Updated 1 month ago</span>
    </template>

    <VCardText>
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="12"
          md="2"
        >
          <div class="d-flex align-center gap-4 mt-md-9 mt-0">
            <VAvatar
              :color="item.color"
              variant="tonal"
              rounded
              size="40"
            >
              <VIcon :icon="item.icon" />
            </VAvatar>

            <div class="d-flex flex-column">
              <h5 class="text-h5">
                {{ item.stats }}
              </h5>
              <div class="text-sm">
                {{ item.title }}
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
