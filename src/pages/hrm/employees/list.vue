<script setup lang="ts">

// 👉 Store
const searchQuery = ref('')
const selectedStatus = ref()
const selectedRows = ref([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const { data: employeeData, execute: fetchEmployees } = await useApi<any>(createUrl('/employees', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const employees = computed((): Employee[] => {
  return employeeData.value.employees.map(employee => ({
    ...employee,
    fullName: `${employee.user.first_name} ${employee.user.middle_name} ${employee.user.last_name}`,
    phone: employee.user.phone,
    status: employee.user.status,
    company: employee?.company?.name,
  }))
})

const totalEmployees = computed(() => employeeData.value.total)

// Call the fetch function on component mount
fetchEmployees()

// Headers
const headers = [
  { title: 'Full Name', key: 'fullName' },
  { title: 'Phone', key: 'phone' },
  { title: 'KRA P/I.N', key: 'kra_pin' },
  { title: 'Company', key: 'company' },
  { title: 'Position', key: 'position' },
  { title: 'Joining Date', key: 'joining_date' },
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

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const deleteEmployee = async (employeeId: number) => {
  await useApi<any>(`/employees/${employeeId}`, { method: 'DELETE' })

  // Show success message (you can use a toast library if available)
  alert('Employee deleted successfully.')

  // Refetch employee data to update the table
  await fetchEmployees()
}
</script>

<template>
  <section>
<!--    <VCard class="mb-6">-->
<!--      &lt;!&ndash; 👉 Widgets  &ndash;&gt;-->
<!--      <VCardText>-->
<!--        <VRow>-->
<!--          <template-->
<!--            v-for="(data, id) in widgetData"-->
<!--            :key="id"-->
<!--          >-->
<!--            <VCol-->
<!--              cols="12"-->
<!--              sm="6"-->
<!--              md="3"-->
<!--              class="px-6"-->
<!--            >-->
<!--              <div-->
<!--                class="d-flex justify-space-between"-->
<!--                :class="$vuetify.display.xs-->
<!--                  ? id !== widgetData.length - 1 ? 'border-b pb-4' : ''-->
<!--                  : $vuetify.display.sm-->
<!--                    ? id < (widgetData.length / 2) ? 'border-b pb-4' : ''-->
<!--                    : ''"-->
<!--              >-->
<!--                <div class="d-flex flex-column">-->
<!--                  <h4 class="text-h4">-->
<!--                    {{ data.value }}-->
<!--                  </h4>-->

<!--                  <div class="text-body-1">-->
<!--                    {{ data.title }}-->
<!--                  </div>-->
<!--                </div>-->

<!--                <VAvatar-->
<!--                  variant="tonal"-->
<!--                  rounded-->
<!--                  size="42"-->
<!--                >-->
<!--                  <VIcon-->
<!--                    :icon="data.icon"-->
<!--                    size="26"-->
<!--                    class="text-high-emphasis"-->
<!--                  />-->
<!--                </VAvatar>-->
<!--              </div>-->
<!--            </VCol>-->
<!--            <VDivider-->
<!--              v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1-->
<!--                : $vuetify.display.smAndUp ? id % 2 === 0-->
<!--                  : false"-->
<!--              vertical-->
<!--              inset-->
<!--              length="60"-->
<!--            />-->
<!--          </template>-->
<!--        </VRow>-->
<!--      </VCardText>-->
<!--    </VCard>-->

    <VCard class="mb-6">
<!--      <VCardItem class="pb-4">-->
<!--        <VCardTitle>Filters</VCardTitle>-->
<!--      </VCardItem>-->

<!--      <VCardText>-->
<!--        <VRow>-->
<!--          &lt;!&ndash; 👉 Select Status &ndash;&gt;-->
<!--          <VCol-->
<!--            cols="12"-->
<!--            sm="4"-->
<!--          >-->
<!--            <AppSelect-->
<!--              v-model="selectedStatus"-->
<!--              placeholder="Select Status"-->
<!--              :items="status"-->
<!--              clearable-->
<!--              clear-icon="tabler-x"-->
<!--            />-->
<!--          </VCol>-->
<!--        </VRow>-->
<!--      </VCardText>-->

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
              { value: 150, title: '150' },
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
              placeholder="Search Employee"
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
          <VBtn prepend-icon="tabler-plus">
            <RouterLink
              :to="{ name: 'hrm-employees-create' }"
              class="font-weight-medium text-link"
            >
              Add Employee
            </RouterLink>
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="employees"
        :items-length="totalEmployees"
        :headers="headers"
        class="text-no-wrap"
        height="400"
        fixed-header
        density="compact"
        @update:options="updateOptions"
      >
        <!-- Name -->
        <template #item.fullName="{ item }">
          <div class="d-flex align-center gap-x-4">
            <div class="d-flex flex-column">
              <h6 class="text-base">
                <RouterLink
                  :to="{ name: 'hrm-employees-list', params: { id: item.id } }"
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

        <template #item.company="{ item }">
          <div class="text-body-2 text-wrap">
            <RouterLink
              :to="{ name: 'companies-list', params: { id: item.company_id } }"
              class="font-weight-medium text-link"
            >
              {{ item.company }}
            </RouterLink>
          </div>
        </template>

        <template #item.position="{ item }">
          <div class="text-body-2 text-wrap clamp-text">
            {{ item.position }}
          </div>
        </template>

        <!-- Date -->
        <template #item.joining_date="{ item }">
          {{ new Date(item.joining_date).toLocaleDateString('en-KE') }}
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
                  :to="{ name: 'hrm-employees-edit-id', params: { id: item.id } }"
                >
                  View
                </VListItem>

                <VListItem
                  value="edit"
                  prepend-icon="tabler-pencil"
                  :to="{ name: 'hrm-employees-edit-id', params: { id: item.id } }"
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="tabler-trash"
                  @click="deleteEmployee(item.id)"
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
            :total-items="totalEmployees"
          />
        </template>
      </VDataTableServer>
    </VCard>
  </section>
</template>

<style scoped lang="scss">

</style>
