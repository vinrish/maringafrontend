<script setup lang="ts">

// 👉 Store

const searchQuery = ref('')
const selectedStatus = ref()
const selectedRows = ref([])
const isDialogVisible = ref(false)
const isConfirmDialogOpen = ref(false)
const isSnackbarScrollReverseVisible = ref(false)
const snackbarMessage = ref('')
const clientId = ref<number | null>(null)

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const { data: clientData, execute: fetchClients } = await useApi<any>(createUrl('/clients', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const clients = computed((): Client[] => {
  return clientData.value.customers.map(customer => ({
    ...customer,
    fullName: `${customer.user.first_name} ${customer.user.middle_name} ${customer.user.last_name}`,
    phone: customer.user.phone,
    status: customer.user.status,
  }))
})

const totalClients = computed(() => clientData.value.total)

// Call the fetch function on component mount
fetchClients()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Headers
const headers = [
  { title: 'Full Name', key: 'fullName' },
  { title: 'Phone', key: 'phone' },
  { title: 'KRA P/I.N', key: 'kra_pin' },
  { title: 'Joining Date', key: 'created_at' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const status = ref([
  { title: 'Active', value: '1' },
  { title: 'Inactive', value: '0' },
])

const resolveStatus = (statusVal: number) => {
  if (statusVal === 1)
    return { text: 'Active', color: 'success' }
  if (statusVal === 0)
    return { text: 'Inactive', color: 'error' }
}

const widgetData = ref([
  { title: 'Session', value: '21,459', change: 29, desc: 'Total Users', icon: 'tabler-users', iconColor: 'primary' },
  { title: 'Paid Users', value: '4,567', change: 18, desc: 'Last Week Analytics', icon: 'tabler-user-plus', iconColor: 'error' },
  { title: 'Active Users', value: '19,860', change: -14, desc: 'Last Week Analytics', icon: 'tabler-user-check', iconColor: 'success' },
  { title: 'Pending Users', value: '237', change: 42, desc: 'Last Week Analytics', icon: 'tabler-user-search', iconColor: 'warning' },
])

const deleteClient = async () => {
  isConfirmDialogOpen.value = false
  isDialogVisible.value = true

  $api(`clients/${clientId.value}`, {
    method: 'DELETE',
  }).then(response => {
    if (response.message) {
      snackbarMessage.value = response.message
      isSnackbarScrollReverseVisible.value = true

      fetchClients()
    }
  }).catch(() => {
    snackbarMessage.value = 'Failed to delete client'
    isSnackbarScrollReverseVisible.value = true
    fetchClients()
  }).finally(() => {
    isDialogVisible.value = false
  })
}

const onConfirmation = (id: number) => {
  clientId.value = id
  isConfirmDialogOpen.value = true
}

const onCancel = () => {
  isConfirmDialogOpen.value = false
}
</script>

<template>
  <section>
    <VDialog
      v-model="isConfirmDialogOpen"
      max-width="500"
    >
      <VCard class="text-center px-10 py-6">
        <VCardText>
          <VBtn
            icon
            variant="outlined"
            color="warning"
            class="my-4"
            style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
          >
            <span class="text-5xl">!</span>
          </VBtn>

          <h6 class="text-lg font-weight-medium">
            Are you sure you want to delete Client?
          </h6>
        </VCardText>

        <VCardText class="d-flex align-center justify-center gap-2">
          <VBtn
            variant="elevated"
            @click="deleteClient(clientId)"
          >
            Confirm
          </VBtn>

          <VBtn
            color="secondary"
            variant="tonal"
            @click="onCancel"
          >
            Cancel
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VSnackbar
      v-model="isSnackbarScrollReverseVisible"
      transition="scroll-y-reverse-transition"
      location="top end"
    >
      {{ snackbarMessage }}
    </VSnackbar>
    <VDialog
      v-model="isDialogVisible"
      width="300"
    >
      <VCard
        color="primary"
        width="300"
      >
        <VCardText class="pt-3">
          Deleting Client. Please stand by.....
          <VProgressLinear
            indeterminate
            bg-color="rgba(var(--v-theme-surface), 0.1)"
            :height="8"
            class="mb-0 mt-4"
          />
        </VCardText>
      </VCard>
    </VDialog>
    <VCard class="mb-6">
      <!-- 👉 Widgets  -->
      <VCardText>
        <VRow>
          <template
            v-for="(data, id) in widgetData"
            :key="id"
          >
            <VCol
              cols="12"
              sm="6"
              md="3"
              class="px-6"
            >
              <div
                class="d-flex justify-space-between"
                :class="$vuetify.display.xs
                  ? id !== widgetData.length - 1 ? 'border-b pb-4' : ''
                  : $vuetify.display.sm
                    ? id < (widgetData.length / 2) ? 'border-b pb-4' : ''
                    : ''"
              >
                <div class="d-flex flex-column">
                  <h4 class="text-h4">
                    {{ data.value }}
                  </h4>

                  <div class="text-body-1">
                    {{ data.title }}
                  </div>
                </div>

                <VAvatar
                  variant="tonal"
                  rounded
                  size="42"
                >
                  <VIcon
                    :icon="data.icon"
                    size="26"
                    class="text-high-emphasis"
                  />
                </VAvatar>
              </div>
            </VCol>
            <VDivider
              v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
                : $vuetify.display.smAndUp ? id % 2 === 0
                  : false"
              vertical
              inset
              length="60"
            />
          </template>
        </VRow>
      </VCardText>
    </VCard>

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
              placeholder="Search Client"
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

          <!-- 👉 Add user button -->
          <VBtn
            prepend-icon="tabler-plus"
            @click="isAddNewUserDrawerVisible = true"
          >
            Add Client
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :items="clients"
        :items-length="totalClients"
        :headers="headers"
        class="text-no-wrap"
        show-select
        @update:options="updateOptions"
      >
        <!-- Name -->
        <template #item.fullName="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar
              size="34"
              :variant="!item.avatar ? 'tonal' : undefined"
            >
              <VImg
                v-if="item.avatar"
                :src="item.avatar"
              />
              <span v-else>{{ avatarText(item.fullName) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                <RouterLink
                  :to="{ name: 'clients-view-id', params: { id: item.id } }"
                  class="font-weight-medium text-link"
                >
                  {{ item.fullName }}
                </RouterLink>
              </h6>
              <div class="text-sm">
                {{ item.user.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- Date -->
        <template #item.created_at="{ item }">
          {{ new Date(item.created_at).toLocaleDateString('en-KE') }}
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            v-bind="resolveStatus(item.status)"
            size="small"
            label
            class="text-capitalize"
          >
            {{ item.status }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <!--          <IconBtn> -->
          <!--            <VIcon icon="tabler-edit" /> -->
          <!--          </IconBtn> -->

          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="view"
                  prepend-icon="tabler-eye"
                  :to="{ name: 'clients-view-id', params: { id: item.id } }"
                >
                  View
                </VListItem>

                <VListItem
                  value="edit"
                  prepend-icon="tabler-pencil"
                  :to="{ name: 'clients-edit-id', params: { id: item.id } }"
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="tabler-trash"
                  @click="onConfirmation(item.id)"
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
            :total-items="totalClients"
          />
        </template>
      </VDataTableServer>
    </VCard>
  </section>
</template>
