<script setup lang="ts">
interface Company {
  id: number
  name: string
  phone: string
  reg_date: string
  reg_number: string
}

const props = defineProps<{ companies: Company[] }>()

const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Reg No.', key: 'reg_number' },
  { title: 'Reg Date', key: 'reg_date' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filteredCompanies = computed(() =>
  props.companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)

const paginatedCompanies = computed(() => {
  if (itemsPerPage.value === filteredCompanies.value.length)
    return filteredCompanies.value

  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return filteredCompanies.value.slice(start, end)
})

// Handle "All" option for items per page
const handleItemsPerPageChange = (value: number | string) => {
  if (value === 'All') {
    itemsPerPage.value = filteredCompanies.value.length
    page.value = 1 // Reset to the first page
  }
  else {
    itemsPerPage.value = Number.parseInt(value as string, 10)
  }
}
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-space-between flex-wrap align-center gap-4">
        <h5 class="text-h5">
          Related Companies
        </h5>
        <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 5, title: '5' },
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: 'All', title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="handleItemsPerPageChange"
          />
        </div>
        <div>
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Company"
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
      :items="paginatedCompanies"
      item-value="id"
      :items-length="filteredCompanies.length"
      class="text-wrap"
      @update:options="updateOptions"
    >
      <template #item.name="{ item }">
        <div class="d-flex flex-column">
          <h6 class="text-base">
            <RouterLink
              :to="{ name: 'companies-view-id', params: { id: item.id } }"
              class="font-weight-medium text-link"
            >
              {{ item.name }}
            </RouterLink>
          </h6>
        </div>
      </template>
      <!-- Date -->
      <template #item.reg_date="{ item }">
        {{ new Date(item.reg_date).toLocaleDateString('en-KE') }}
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
                value="edit"
                :to="{ name: 'companies-edit-id', params: { id: item.id } }"
              >
                Edit
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
          :total-items="filteredCompanies.length"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>
