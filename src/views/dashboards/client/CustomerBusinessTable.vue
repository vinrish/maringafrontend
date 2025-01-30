<script setup lang="ts">
interface Business {
  id: number
  name: string
  phone: string
  reg_date: string
  reg_number: string
}

const props = defineProps<{ businesses: Business[] | null }>()

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
  { title: 'Reg No.', key: 'business_no' },
  { title: 'Reg Date', key: 'registration_date' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filteredBusinesses = computed(() =>
  (props.businesses ?? []).filter(business =>
    business.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-space-between flex-wrap align-center gap-4">
        <h5 class="text-h5">
          Related Businesses
        </h5>
        <div>
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Business"
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
      :items="filteredBusinesses"
      item-value="id"
      :items-length="filteredBusinesses.length"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- Date -->
      <template #item.registration_date="{ item }">
        {{ new Date(item.registration_date).toLocaleDateString('en-KE') }}
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
                :to="{ name: 'businesses-edit-id', params: { id: item.id } }"
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
          :total-items="filteredBusinesses.length"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>
