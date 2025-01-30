<script setup lang="ts">

// 👉 Store
import AddPaymentDrawer from '@/views/payments/AddPaymentDrawer.vue'

const searchQuery = ref('')
const selectedStatus = ref()
const isAddCustomerDrawerOpen = ref(false)

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const { data: feeNoteData, execute: fetchFeeNotes } = await useApi<any>(createUrl('/fee_notes', {
  query: {
    q: searchQuery,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const feeNotes = computed((): FeeNote[] => feeNoteData.value.fee_notes)
const totalFeeNotes = computed(() => feeNoteData.value.total)

const displayName = computed(() => {
  return feeNotes.value.map(feeNote => {
    if (feeNote.client)
      return `${feeNote.client.user.first_name} ${feeNote.client.user.last_name}`
    else if (feeNote.company)
      return feeNote.company.name

    return ''
  })
})

// Call the fetch function on component mount
fetchFeeNotes()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Headers
const headers = [
  { title: 'Full Name', key: 'displayName' },
  { title: 'Total Amount', key: 'amount' },
  { title: 'Amount Paid', key: 'total_paid' },
  { title: 'Task', key: 'task.name' },
  { title: 'Payment Status', key: 'payment_status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const status = [
  { title: 'Pending', value: 'pending' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
]

const widgetData = ref([
  { title: 'Session', value: '21,459', change: 29, desc: 'Total Users', icon: 'tabler-users', iconColor: 'primary' },
  { title: 'Paid Users', value: '4,567', change: 18, desc: 'Last Week Analytics', icon: 'tabler-user-plus', iconColor: 'error' },
  { title: 'Active Users', value: '19,860', change: -14, desc: 'Last Week Analytics', icon: 'tabler-user-check', iconColor: 'success' },
  { title: 'Pending Users', value: '237', change: 42, desc: 'Last Week Analytics', icon: 'tabler-user-search', iconColor: 'warning' },
])
</script>

<template>
  <section>
    <!-- 👉 Widgets -->
    <div class="d-flex mb-6">
      <VRow>
        <template
          v-for="(data, id) in widgetData"
          :key="id"
        >
          <VCol
            cols="12"
            md="3"
            sm="6"
          >
            <VCard>
              <VCardText>
                <div class="d-flex justify-space-between">
                  <div class="d-flex flex-column gap-y-1">
                    <div class="text-body-1 text-high-emphasis">
                      {{ data.title }}
                    </div>
                    <div class="d-flex gap-x-2 align-center">
                      <h4 class="text-h4">
                        {{ data.value }}
                      </h4>
                      <div
                        class="text-base"
                        :class="data.change > 0 ? 'text-success' : 'text-error'"
                      >
                        ({{ prefixWithPlus(data.change) }}%)
                      </div>
                    </div>
                    <div class="text-sm">
                      {{ data.desc }}
                    </div>
                  </div>
                  <VAvatar
                    :color="data.iconColor"
                    variant="tonal"
                    rounded
                    size="42"
                  >
                    <VIcon
                      :icon="data.icon"
                      size="26"
                    />
                  </VAvatar>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </template>
      </VRow>
    </div>

    <VCard class="mb-6">
      <VCardItem class="pb-4">
        <VCardTitle>Filters</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <!-- 👉 Select Status -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStatus"
              placeholder="Select Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div>

        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search Fee Note"
            />
          </div>

          <!-- 👉 Export button -->
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
          >
            Export
          </VBtn>

        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="feeNotes"
        :items-length="totalFeeNotes"
        :headers="headers"
        class="text-no-wrap"
        show-select
        @update:options="updateOptions"
      >
        <!-- Name -->
        <template #item.displayName="{ item }">
          {{ item.client ? `${item.client.user.first_name} ${item.client.user.last_name}` : item.company ? item.company.name : '' }}
        </template>

        <template #item.payment_status="{ item }">
          {{ item.payment_status }} <!-- Ensure this is correctly bound -->
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">

          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="download"
                  prepend-icon="tabler-wallet"
                  @click="isAddCustomerDrawerOpen = true"
                >
                  Make Payment
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="tabler-trash"
                  @click="deleteProduct(item.id)"
                >
                  Delete
                </VListItem>

                <VListItem
                  value="duplicate"
                  prepend-icon="tabler-copy"
                >
                  Duplicate
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
            :total-items="totalFeeNotes"
          />
        </template>
      </VDataTableServer>
    </VCard>

    <AddPaymentDrawer v-model:is-drawer-open="isAddCustomerDrawerOpen" />
  </section>
</template>
