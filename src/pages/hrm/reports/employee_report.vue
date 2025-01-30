<script setup lang="ts">
const route = useRoute()
const selectedCompany = ref(route.query.company || null)
const selectedMonth = ref(route.query.month || null)
const selectedYear = ref(route.query.year || null)

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

const payslips = ref([])

const getPayslipsData = async () => {
  // Prepare formData with the selected values
  const formData = {
    company_id: selectedCompany.value,
    month: selectedMonth.value,
    year: selectedYear.value,
  }

  try {
    // Make the POST request to fetch payroll data
    const response = await $api('/payroll/payslips', {
      method: 'POST',
      body: formData,
    })

    payslips.value = response.payslips
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
}

getPayslipsData()
</script>

<template>
  <section>
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
              @click="getPayslipsData"
            >
              Fetch Payslips
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VRow>
      <VCol
        v-for="payslip in payslips"
        cols="12"
        md="4"
      >
        <VCard class="invoice-preview-wrapper pa-6 pa-sm-12">
          <div class="invoice-header-preview d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row bg-var-theme-background gap-6 rounded pa-2 mb-2">
            <div>
              <h5 class="text-base text-wrap align-center">
                {{ payslip.employee.company.name }}
              </h5>
              <h5 class="text-base text-wrap text-center">
                {{ payslip.employee.company.kra_pin }}
              </h5>
            </div>
          </div>

          <VRow class="print-row mb-2 justify-center">
            <h6 class="text-h6 text-center">
              {{ new Date(payslip.payroll_date).toDateString() }}
            </h6>
          </VRow>

          <div>
            <table class="w-100">
              <tbody class="text-no-wrap">
                <tr>
                  <td class="pe-16">
                    Name:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.employee.user.first_name }} {{ payslip.employee.user.last_name }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16">
                    ID:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.employee.id_no }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    KRA PIN:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.employee.kra_pin }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    Gross Salary:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.employee.salary }}
                    </h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <VDivider class="my-2" />

          <div>
            <table class="w-100">
              <tbody>
                <tr>
                  <td class="pe-16">
                    Deductions:
                  </td>
                </tr>
                <tr>
                  <td class="pe-16">
                    NSSF:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.nssf_employee_contribution }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    Taxable Income:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.taxable_income }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    Income Tax:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.paye }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    Insurance Relief:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.nhif_relief }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    AHL Relief:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.housing_levy_relief }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    Personal Relief:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.paye_relief }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    P.A.Y.E:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.paye_net }}
                    </h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <VDivider class="my-2" />

          <div>
            <table class="w-100">
              <tbody>
                <tr>
                  <td class="pe-16">
                    PAY AFTER TAX:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ (Number(payslip.taxable_income) - Number(payslip.paye_net)).toFixed(2) }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    SHIF:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.nhif_employee_contribution }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16 text-no-wrap text-base text-sm text-left">
                    Housing Levy:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.housing_levy }}
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16">
                    NET PAY:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-base font-weight-medium">
                      {{ payslip.net_salary }}
                    </h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style scoped lang="scss">
@media print {
  .v-theme--dark {
    --v-theme-surface: 255, 255, 255;
    --v-theme-on-surface: 47, 43, 61;
    --v-theme-on-background: 47, 43, 61;
  }

  body {
    background: none !important;
  }

  .invoice-header-preview,
  .invoice-preview-wrapper {
    padding: 0 !important;
    width: 80mm; /* 80mm width for thermal printer */
  }

  .v-card {
    box-shadow: none !important;
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }

  .v-table__wrapper {
    overflow: visible !important; /* Ensure rows are not hidden */
  }

  .vue-devtools__anchor {
    display: none;
  }

  table {
    border-collapse: collapse !important;
    width: 100%; /* Ensure the table fills the width */
    margin: 0;
  }

  table th,
  table td {
    border: 1px solid black !important;
    padding: 4px 8px; /* Adjust padding for thermal printing */
    //text-align: left;
    font-size: 0.75rem; /* Smaller font size for better fit */
  }

  table thead th {
    background-color: rgba(var(--v-theme-surface), 0.1);
    font-weight: bold;
  }

  /* Ensure that all rows are visible */
  tr {
    display: table-row !important;
  }

  tr td {
    word-wrap: break-word; /* Ensure content wraps properly */
  }

  /* Optional: Hide unnecessary UI elements during print */
  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .product-buy-now {
    display: none;
  }
}
</style>
