<script setup lang="ts">
const loading = ref(false)
const selectedCompany = ref()
const selectedMonth = ref()
const selectedYear = ref()
const selectedRows = ref([])
const isDialogVisible = ref(false)
const isSnackbarScrollReverseVisible = ref(false)
const snackbarMessage = ref('')
const isApproveDialogVisible = ref(false)
const isExportDialogVisible = ref(false)
const selectedExportFormat = ref('csv')

const exportFormats = [
  { text: 'CSV', value: 'csv' },
  { text: 'Excel', value: 'xlsx' },
  { text: 'PDF', value: 'pdf' },
]

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

// Headers
const headers = [
  { title: 'Employee Name', key: 'name' },
  { title: 'Gross Pay', key: 'grossSalary', sortable: false },
  { title: 'Other Taxable Pay', key: 'otherTaxablePay', sortable: false, mobile: true },
  { title: 'NSSF employee', key: 'nssfEmployee' },
  { title: 'Taxable Pay', key: 'taxableIncome' },
  { title: 'Paye', key: 'paye' },
  { title: 'Paye Relief', key: 'payeRelief' },
  { title: 'SHIF', key: 'nhifEmployee' },
  { title: 'Insurance Relief', key: 'nhifRelief' },
  { title: 'Housing Levy', key: 'housingLevy' },
  { title: 'AHL Relief', key: 'housingLevyRelief' },
  { title: 'Net Paye', key: 'payeNet' },
  { title: 'Total Deductions', key: 'totalDeductions' },
  { title: 'Net Salary', key: 'netSalary' },
  { title: 'NSSF employer', key: 'nssfEmployer' },
  { title: 'Total NSSF', key: 'totalNSSF' },
]

const exportPayroll = async () => {
  if (!selectedExportFormat.value) {
    console.error('Please select an export format.')

    return
  }

  const formData = {
    company_id: selectedCompany.value,
    month: selectedMonth.value,
    year: selectedYear.value,
  }

  try {
    const response = await $api(`/payroll/export/${selectedExportFormat.value}`, {
      method: 'POST',
      body: formData,
      responseType: 'blob',
    })

    const blob = new Blob([response], { type: response.type })
    const url = URL.createObjectURL(blob)

    const selectedCompanyName = companiesList.value.find(c => c.value === selectedCompany.value)?.text || 'Unknown_Company'
    const selectedMonthName = monthsList.find(m => m.value === selectedMonth.value)?.text || 'Unknown_Month'

    // Construct filename
    const fileName = `Payroll_${selectedCompanyName}_${selectedMonthName}_${selectedYear.value}.${selectedExportFormat.value}`

    // Create a temporary link and trigger the download
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  catch (error) {
    console.error('Error exporting payroll:', error)
  }
}

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
    const response = await $api('/payroll/company', {
      method: 'POST',
      body: formData,
    })

    payrollData.value = response.payrolls.map(payroll => ({
      id: payroll.id,
      name: `${payroll.employee.user.first_name || ''} ${payroll.employee.user.middle_name || ''} ${payroll.employee.user.last_name || ''}`.trim(), // Combine names
      grossSalary: payroll.gross_salary,
      otherTaxablePay: 0,
      nssfEmployee: payroll.nssf_employee_contribution,
      nssfEmployer: payroll.nssf_employer_contribution,
      taxableIncome: payroll.taxable_income,
      paye: payroll.paye,
      payeNet: payroll.paye_net,
      payeRelief: payroll.paye_relief,
      nhifEmployee: payroll.nhif_employee_contribution,
      nhifRelief: payroll.nhif_relief,
      housingLevy: payroll.housing_levy,
      housingLevyRelief: payroll.housing_levy_relief,
      netSalary: payroll.net_salary,
      totalNSSF: (Number(payroll.nssf_employee_contribution)) + (Number(payroll.nssf_employer_contribution)),
      totalDeductions: payroll.total_deductions,
    }))

    console.log(response)

    loading.value = false
  }
  catch (error) {
    console.error('Error fetching data:', error)
    loading.value = false
  }
}

const approvePayroll = async () => {
  isDialogVisible.value = false
  loading.value = true
  isApproveDialogVisible.value = true

  const formData = {
    company_id: selectedCompany.value,
    month: selectedMonth.value,
    year: selectedYear.value,
  }

  try {
    const response = await $api('/payroll/approve', {
      method: 'POST',
      body: formData,
    })

    isApproveDialogVisible.value = false
    loading.value = false
    snackbarMessage.value = response.message
    isSnackbarScrollReverseVisible.value = true
  }
  catch (error) {
    console.error('Error fetching data:', error)
    isApproveDialogVisible.value = false
    loading.value = false
  }
}

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
</script>

<template>
  <section>
    <VSnackbar
      v-model="isSnackbarScrollReverseVisible"
      transition="scroll-y-reverse-transition"
      location="top end"
    >
      {{ snackbarMessage }}
    </VSnackbar>

    <VDialog
      v-model="isApproveDialogVisible"
      width="300"
    >
      <VCard
        color="primary"
        width="300"
      >
        <VCardText class="pt-3">
          Approving Payrolls. Please stand by
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
          <VBtn
            :disabled="loading"
            append-icon="mdi-refresh"
            text="Refresh"
            variant="outlined"
            @click="getPayrollData"
          />

          <!-- 👉 Export button -->
          <!--          <VBtn -->
          <!--            variant="outlined" -->
          <!--            color="secondary" -->
          <!--            prepend-icon="tabler-upload" -->
          <!--          > -->
          <!--            Export -->
          <!--          </VBtn> -->
          <VDialog
            v-model="isExportDialogVisible"
            width="400"
          >
            <VCard>
              <VCardTitle>Select Export Format</VCardTitle>
              <VCardText>
                <VRadioGroup
                  v-model="selectedExportFormat"
                  :items="exportFormats"
                  inline
                />
              </VCardText>
              <VCardActions>
                <VSpacer />
                <VBtn
                  color="primary"
                  @click="exportPayroll"
                >
                  Export
                </VBtn>
                <VBtn
                  color="secondary"
                  @click="isExportDialogVisible = false"
                >
                  Cancel
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>

          <!-- Export Button -->
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-upload"
            @click="isExportDialogVisible = true"
          >
            Export
          </VBtn>

          <div>
            <VDialog
              v-model="isDialogVisible"
              max-width="600"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  variant="outlined"
                  color="primary"
                >
                  Approve Payroll
                </VBtn>
              </template>
              <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
              <VCard title="Approve Payroll">
                <VCardText>
                  <h4 class="text-center success">
                    Are you sure you want to approve the payrolls?
                  </h4>
                  <h2 class="text-center mt-2 text-info-500">
                    This Action is Irreversible!
                  </h2>
                </VCardText>

                <VCardText class="d-flex justify-end flex-wrap gap-3">
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    @click="isDialogVisible = false"
                  >
                    Close
                  </VBtn>
                  <VBtn @click="approvePayroll">
                    Approve
                  </VBtn>
                </VCardText>
              </VCard>
            </VDialog>
          </div>
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
        <template #item.status="{ item: employee }">
          <span v-if="employee.payroll && employee.payroll.payroll_status === 'final'">
            {{ employee.payroll.payroll_status }}
          </span>
          <span
            v-if="employee.payroll && employee.payroll.payroll_status === 'draft'"
            "
          >
            {{ employee.payroll.payroll_status }}
          </span>
          <span v-if="!employee.payroll || employee.payroll.payroll_status === null">
            pending
          </span>
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
