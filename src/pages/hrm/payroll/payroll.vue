<script setup lang="ts">
const searchQuery = ref('')
const selectedCompany = ref()
const selectedMonth = ref()
const selectedYear = ref()
const selectedRows = ref([])
const isDialogVisible = ref(false)
const isSnackbarScrollReverseVisible = ref(false)
const snackbarMessage = ref('')
const loading = ref(false)
const router = useRouter()
const isConfirmDialogOpen = ref(false)

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const monthsList = [
  { text: 'JANUARY', value: 1 },
  { text: 'FEBRUARY', value: 2 },
  { text: 'MARCH', value: 3 },
  { text: 'APRIL', value: 4 },
  { text: 'MAY', value: 5 },
  { text: 'JUNE', value: 6 },
  { text: 'JULY', value: 7 },
  { text: 'AUGUST', value: 8 },
  { text: 'SEPTEMBER', value: 9 },
  { text: 'OCTOBER', value: 10 },
  { text: 'NOVEMBER', value: 11 },
  { text: 'DECEMBER', value: 12 },
]

const currentYear = new Date().getFullYear()

const yearsList = computed(() => {
  return Array.from({ length: 11 }, (_, index) => ({
    text: (currentYear - 10 + index).toString(),
    value: currentYear - 10 + index,
  }))
})

const { data: companyData, execute: fetchCompanyData } = await useApi<any>(createUrl('/payroll'))

const companiesList = computed(() =>
  companyData.value.companies.map(company => ({
    text: company.name,
    value: company.id,
  })),
)

// Call the fetch function on component mount
fetchCompanyData()

const payrollData = ref([])

const getPayrollData = async () => {
  loading.value = true

  // Prepare formData with the selected values
  const formData = {
    company_id: selectedCompany.value,
    month: selectedMonth.value,
    year: selectedYear.value,
  }

  try {
    // Make the POST request to fetch payroll data
    const response = await $api('/payroll', {
      method: 'POST',
      body: formData,
    })

    loading.value = false

    payrollData.value = response.employees.map(employee => ({
      id: employee.id,
      name: `${employee.user.first_name || ''} ${employee.user.middle_name || ''} ${employee.user.last_name || ''}`.trim(), // Combine names
      id_no: employee.id_no,
      kra_pin: employee.kra_pin,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      status: employee.payroll?.payroll_status || 'pending',
      payroll_status: employee.payroll ? 'Generated' : 'Not Generated',
      payroll_id: employee.payroll?.id,
    }))

    console.log(response)
  }
  catch (error) {
    loading.value = false
    console.error('Error fetching data:', error)
  }
}

const resolveStatus = (statusVal: string) => {
  switch (statusVal.toLowerCase()) {
    case 'final':
      return { text: 'Final', color: 'success' }
    case 'draft':
      return { text: 'Draft', color: 'warning' }
    case 'pending':
      return { text: 'Pending', color: 'error' }
    default:
      return { text: 'Unknown', color: 'grey' }
  }
}

const generatePayroll = async () => {
  isConfirmDialogOpen.value = false
  isDialogVisible.value = true

  // Prepare formData with the selected values
  const formData = {
    employee_ids: selectedRows.value,
    month: selectedMonth.value,
    year: selectedYear.value,
  }

  $api('/payroll/generate', {
    method: 'POST',
    body: formData,
  }).then(response => {
    if (response.message) {
      isDialogVisible.value = false
      snackbarMessage.value = response.message
      isSnackbarScrollReverseVisible.value = true
    }
    else if (response.payrolls && response.payrolls.error) {
      isDialogVisible.value = false
      snackbarMessage.value = response.payrolls.error
      isSnackbarScrollReverseVisible.value = true
    }
    else if (response.payrolls && Array.isArray(response.payrolls) && response.payrolls.length > 0) {
      isDialogVisible.value = false
      snackbarMessage.value = 'Payroll generated successfully.'
      isSnackbarScrollReverseVisible.value = true
      getPayrollData()
    }
    else {
      isDialogVisible.value = false
      snackbarMessage.value = 'An unexpected error occurred. Please try again.'
      isSnackbarScrollReverseVisible.value = true
    }
  }).catch(response => {
    isDialogVisible.value = false
    snackbarMessage.value = response.message
  })
}

const onConfirmation = () => {
  isConfirmDialogOpen.value = true
}

const onCancel = () => {
  isConfirmDialogOpen.value = false
}

// Headers
const headers = [
  { title: 'Employee Name', key: 'name' },
  { title: 'ID No.', key: 'id_no' },
  { title: 'KRA P.I.N', key: 'kra_pin', sortable: false },
  { title: 'Department', key: 'department' },
  { title: 'Position', key: 'position' },
  { title: 'Gross Salary', key: 'salary' },
  { title: 'Status', key: 'status' },
  { title: 'Payroll Status', key: 'payroll_status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const viewPayslips = () => {
  router.push({
    name: 'hrm-reports-employee-report',
    query: {
      company: selectedCompany.value,
      month: selectedMonth.value,
      year: selectedYear.value,
    },
  })
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
            Are you sure you want to generate payrol for selected employees?
          </h6>
        </VCardText>

        <VCardText class="d-flex align-center justify-center gap-2">
          <VBtn
            variant="elevated"
            @click="generatePayroll"
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
          Generating Payrolls. Please stand by
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
          <!-- 👉 Select Status -->
          <VCol
            cols="12"
            md="5"
          >
            <AppAutocomplete
              v-model="selectedCompany"
              :items="companiesList"
              item-title="text"
              item-value="value"
              placeholder="Select Company"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <VCol
            cols="12"
            sm="2"
          >
            <AppSelect
              v-model="selectedMonth"
              placeholder="Select Month"
              :items="monthsList"
              item-title="text"
              item-value="value"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <VCol
            cols="12"
            sm="2"
          >
            <AppSelect
              v-model="selectedYear"
              placeholder="Select Year"
              :items="yearsList"
              item-title="text"
              item-value="value"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <VCol
            cols="12"
            sm="3"
          >
            <VBtn
              :disabled="loading"
              prepend-icon="tabler-checkmark"
              @click="getPayrollData"
            >
              Fetch Data
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard class="mb-6">
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
              placeholder="Search Service"
            />
          </div>

          <!-- 👉 Export button -->
          <VBtn
            variant="outlined"
            color="info"
            prepend-icon="tabler-upload"
          >
            EXCEL
          </VBtn>
          <VBtn
            variant="tonal"
            color="warning"
            prepend-icon="tabler-upload"
          >
            PDF
          </VBtn>

          <!-- 👉 Add user button -->
          <VBtn
            prepend-icon="tabler-plus"
            @click="onConfirmation"
          >
            Generate Payroll
          </VBtn>

          <VBtn
            variant="outlined"
            color="success"
            prepend-icon="tabler-receipt"
            @click="viewPayslips"
          >
            View Payslips
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :headers="headers"
        show-select
        :items="payrollData"
        :items-length="payrollData.length"
        class="text-wrap"
        :loading="loading"
        @update:options="updateOptions"
      >
        <template #loading>
          <VSkeletonLoader type="table-row@10" />
        </template>

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
          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="view"
                  prepend-icon="tabler-eye"
                  :to="{ name: 'hrm-payroll-payslip-id', params: { id: item.payroll_id } }"
                >
                  View Payslip
                </VListItem>

                <VListItem
                  value="edit"
                  prepend-icon="tabler-pencil"
                >
                  Finalize
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
            :total-items="payrollData.length"
          />
        </template>
      </VDataTableServer>
    </VCard>
  </section>
</template>

<style scoped lang="scss">

</style>
