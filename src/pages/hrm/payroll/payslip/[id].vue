<script setup lang="ts">
const route = useRoute('hrm-payroll-payslip-id')

const { data: payslipData } = await useApi<any>(`/payroll_print/${route.params.id}`)
const payslip = ref()

if (payslipData.value)
  payslip.value = payslipData.value.payroll

const printInvoice = () => {
  window.print()
}

const formatNumber = (value: number | string): string => {
  if (!value)
    return '0'

  return Number(value).toLocaleString()
}
</script>

<template>
  <section>
    <VRow class="justify-center">
      <VCol
        cols="12"
        md="4"
      >
        <VCard
          v-if="payslip"
          class="invoice-preview-wrapper pa-6 pa-sm-12"
        >
          <div class="invoice-header-preview d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row bg-var-theme-background gap-6 rounded pa-2 mb-2">
            <div>
              <h5 class="text-wrap text-center">
                {{ payslip.employee.company.name }}
              </h5>
              <h5 class="text-base text-wrap text-center">
                {{ payslip.employee.company.kra_pin }}
              </h5>
            </div>
          </div>

          <VRow class="print-row mb-2 justify-center">
            <h6 class="text-h6 text-center">
              {{ new Date(payslip.year, payslip.month - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) }} Payslip
            </h6>
          </VRow>

          <div class="details-section">
            <div class="detail-item">
              <span class="label">Name:</span>
              <span class="value">
                {{ payslip.employee.user.first_name }} {{ payslip.employee.user.last_name }}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">ID:</span>
              <span class="value">{{ payslip.employee.id_no }}</span>
            </div>
            <div class="detail-item">
              <span class="label">KRA PIN:</span>
              <span class="value">{{ payslip.employee.kra_pin }}</span>
            </div>
          </div>

          <VDivider class="my-2" />

          <div class="deductions-section">
            <strong><h4>PAYMENTS</h4></strong>
            <div class="detail-item">
              <span class="label">Gross Salary:</span>
              <span class="value">{{ formatNumber(payslip.employee.salary) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Other Pay:</span>
              <span class="value">{{ formatNumber(payslip?.other_pay) }}</span>
            </div>
          </div>

          <VDivider class="my-2" />

          <div class="deductions-section">
            <strong><h4>DEDUCTIONS:</h4></strong>
            <div class="deduction-item">
              <span class="label">NSSF:</span>
              <span class="value">{{ formatNumber(payslip.nssf_employee_contribution) }}</span>
            </div>
            <div class="deduction-item">
              <span class="label">Taxable Income:</span>
              <span class="value">{{ formatNumber(payslip.taxable_income) }}</span>
            </div>
            <div class="deduction-item">
              <span class="label">Income Tax:</span>
              <span class="value">{{ formatNumber(payslip.paye) }}</span>
            </div>
            <div class="deduction-item">
              <span class="label">Personal Relief:</span>
              <span class="value">-{{ formatNumber(payslip.paye_relief) }}</span>
            </div>
            <div class="deduction-item">
              <span class="label">Insurance Relief:</span>
              <span class="value">-{{ formatNumber(payslip.nhif_relief) }}</span>
            </div>
            <div class="deduction-item">
              <span class="label">AHL Relief:</span>
              <span class="value">-{{ formatNumber(payslip.housing_levy_relief) }}</span>
            </div>
            <div class="deduction-item">
              <span class="label">P.A.Y.E:</span>
              <span class="value">{{ formatNumber(payslip.paye_net) }}</span>
            </div>
            <div class="pay-item">
              <span class="label">SHIF:</span>
              <span class="value">{{ formatNumber(payslip.nhif_employee_contribution) }}</span>
            </div>
            <div class="pay-item">
              <span class="label">Housing Levy:</span>
              <span class="value">{{ formatNumber(payslip.housing_levy) }}</span>
            </div>
            <VDivider class="my-2" />
            <div class="deduction-item">
              <span class="label">Total Deductions:</span>
              <span class="value">{{ formatNumber(payslip.total_deductions) }}</span>
            </div>
          </div>

          <VDivider class="my-2" />

          <div class="net-pay-section">
            <div class="pay-item">
              <span class="label">NET PAY:</span>
              <span class="value">{{ formatNumber(payslip.net_salary) }}</span>
            </div>
          </div>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <VCard>
          <VCardText>
            <VBtn
              block
              prepend-icon="tabler-send"
              class="mb-4"
            >
              Send Payslip
            </VBtn>

            <VBtn
              block
              color="secondary"
              variant="tonal"
              class="mb-4"
            >
              Download
            </VBtn>

            <div class="d-flex flex-wrap gap-4">
              <VBtn
                variant="tonal"
                color="secondary"
                class="flex-grow-1"
                @click="printInvoice"
              >
                Print
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.detail-item,
.deduction-item,
.pay-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0; /* Reduce vertical padding */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 0; /* Ensure no additional spacing */
}

.detail-item:last-child,
.deduction-item:last-child,
.pay-item:last-child {
  border-bottom: none; /* Remove border for the last item */
}

.details-section,
.deductions-section,
.net-pay-section {
  margin-bottom: 0.5rem; /* Reduce section spacing */
}

.label {
  font-weight: bold;
}

.value {
  text-align: end;
}

@media print {
  body {
    background: none !important;
    visibility: hidden;
  }

  .detail-item,
  .deduction-item,
  .pay-item {
    border-bottom: none; /* Remove borders */
    margin: 0; /* Remove any extra margins */
    padding: 0.1rem 0; /* Adjust padding to make it tighter */
  }

  .details-section,
  .deductions-section,
  .net-pay-section {
    margin: 0; /* Remove margins between sections */
    padding: 0; /* Remove extra padding */
  }

  .invoice-preview-wrapper {
    visibility: visible;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 !important;
    margin: 0 !important;
    width: 80mm;
  }

  .v-card {
    box-shadow: none !important;
    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }

  .vue-devtools__anchor {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .d-print-none {
    display: none !important;
  }
}
</style>
