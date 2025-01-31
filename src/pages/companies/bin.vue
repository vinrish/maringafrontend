<script setup lang="ts">
definePage({
  meta: {
    action: 'view',
    subject: 'company',
  },
})

// 👉 Store
const searchQuery = ref('')
const selectedStatus = ref()
const selectedRows = ref([])
const isDialogVisible = ref(false)
const isConfirmDialogOpen = ref(false)
const isSnackbarScrollReverseVisible = ref(false)
const snackbarMessage = ref('')
const companyId = ref<number | null>(null)

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const { data: companyData, execute: fetchCompanies } = await useApi<any>(createUrl('/recycle-bin/companies', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const companies = computed((): Company[] => companyData.value.companies || [])
const totalCompanies = computed(() => companyData.value.total)

// Call the fetch function on component mount
fetchCompanies()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Headers
const headers = [
  { title: 'Company Name', key: 'name' },
  { title: 'Owner', key: 'client_name' },
  { title: 'Phone', key: 'phone' },
  { title: 'KRA P/I.N', key: 'kra_pin' },
  { title: 'Registration No.', key: 'reg_number' },
  { title: 'Reg Date', key: 'reg_date' },
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

const deleteCompany = async () => {
  isConfirmDialogOpen.value = false
  isDialogVisible.value = true

  $api(`companies/${companyId.value}`, {
    method: 'DELETE',
  }).then(response => {
    if (response.message) {
      snackbarMessage.value = response.message
      isSnackbarScrollReverseVisible.value = true

      fetchCompanies()
    }
  }).catch(() => {
    snackbarMessage.value = 'Failed to delete client'
    isSnackbarScrollReverseVisible.value = true
    fetchCompanies()
  }).finally(() => {
    isDialogVisible.value = false
  })
}

const restoreCompany = async (id: number) => {
  companyId.value = id
  isConfirmDialogOpen.value = false
  isDialogVisible.value = true

  $api(`companies/${companyId.value}/restore`, {
    method: 'POST',
  }).then(response => {
    if (response.message) {
      snackbarMessage.value = response.message
      isSnackbarScrollReverseVisible.value = true

      fetchCompanies()
    }
  }).catch(response => {
    snackbarMessage.value = response.message // 'Failed to restore company'
    isSnackbarScrollReverseVisible.value = true
    fetchCompanies()
  }).finally(() => {
    isDialogVisible.value = false
  })
}

const onConfirmation = (id: number) => {
  companyId.value = id
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
            Are you sure you want to delete Company?
          </h6>
        </VCardText>

        <VCardText class="d-flex align-center justify-center gap-2">
          <VBtn
            variant="elevated"
            @click="deleteCompany(companyId)"
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
          Deleting Company. Please stand by.....
          <VProgressLinear
            indeterminate
            bg-color="rgba(var(--v-theme-surface), 0.1)"
            :height="8"
            class="mb-0 mt-4"
          />
        </VCardText>
      </VCard>
    </VDialog>
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
              { value: totalCompanies, title: 'All' },
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
              placeholder="Search Company"
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
            Add Company
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :items="companies"
        :items-length="totalCompanies"
        :headers="headers"
        class="text-no-wrap"
        show-select
        @update:options="updateOptions"
      >
        <!-- Name -->
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar
              size="34"
              :variant="!item.avatar ? 'tonal' : undefined"
            >
              <VImg
                v-if="item.avatar"
                :src="item.avatar"
              />
              <span v-else>{{ avatarText(item.name) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base text-wrap">
                <RouterLink
                  :to="{ name: 'companies-view-id', params: { id: item.id } }"
                  class="font-weight-medium text-link"
                >
                  {{ item.name }}
                </RouterLink>
              </h6>
            </div>
          </div>
        </template>

        <!-- Owner -->
        <template #item.client_name="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-base text-body-1 text-wrap">
              <RouterLink
                :to="{ name: 'clients-view-id', params: { id: item.client_id } }"
                class="font-weight-medium text-link"
              >
                {{ item.client_name }}
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
                <VListItem
                  value="view"
                  prepend-icon="tabler-eye"
                  @click="restoreCompany(item.id)"
                >
                  Restore
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
            :total-items="totalCompanies"
          />
        </template>
      </VDataTableServer>
    </VCard>
  </section>
</template>
