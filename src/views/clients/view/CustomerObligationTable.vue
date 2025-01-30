<script setup lang="ts">
interface Obligation {
  id: number
  name: string
  start_date: any
  next_run: any
  amount: number
}

const props = defineProps<{ obligations: Obligation[] }>()
const obligations = computed(() => props.obligations || [])

const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Start Date', key: 'start_date' },
  { title: 'Next Run', key: 'next_run' },
  { title: 'Amount', key: 'fee' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filteredObligations = computed(() =>
  props.obligations.filter(obligation =>
    obligation.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-space-between flex-wrap align-center gap-4">
        <h5 class="text-h5">
          Obligations
        </h5>
        <div>
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Obligation"
            style=" max-inline-size: 200px; min-inline-size: 200px;"
          />
        </div>
      </div>
    </VCardText>

    <VDivider />
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="filteredObligations"
      item-value="id"
      :items-length="filteredObligations.length"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- Name -->
      <template #item.name="{ item }">
        <div class="d-flex flex-column">
          <h6 class="text-sm-h6 text-wrap">
            {{ item.name }}
          </h6>
        </div>
      </template>

      <!-- Date -->
      <template #item.start_date="{ item }">
        {{ new Date(item.start_date).toLocaleDateString('en-KE') }}
      </template>

      <!-- Date -->
      <template #item.next_run="{ item }">
        {{ new Date(item.next_run).toLocaleDateString('en-KE') }}
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-dots-vertical" />
          <VMenu activator="parent">
            <VList>
              <VListItem value="view">
                View
              </VListItem>
              <VListItem
                value="delete"
                @click="deleteOrder(item.id)"
              >
                Delete
              </VListItem>
            </VList>
          </VMenu>
        </IconBtn>
      </template>

      <!-- pagination -->
      <template #bottom>
        <TablePagination
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total-items="filteredObligations.length"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>
