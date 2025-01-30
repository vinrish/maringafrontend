<script setup lang="ts">
import letterHead from '@images/letterhead/letter.jpeg'

const route = useRoute('fee-notes-summary-company-details-id')

const { data: summaryData } = await useApi<any>(`/summary-company/${route.params.id}`)
const summary = ref()
const feeNotes = ref()
const payment = ref()

if (summaryData.value) {
  summary.value = summaryData.value
  feeNotes.value = summaryData.value.fee_notes
  payment.value = summaryData.value.summary
}

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const isDialogVisible = ref(false)
const isSnackbarScrollReverseVisible = ref(false)
const snackbarMessage = ref('')

const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// 👉 Print Invoice
const printInvoice = () => {
  window.print()
}

const headers = [
  { title: 'FeeNote No', key: 'id' },
  { title: 'Name', key: 'fee_name' },
  { title: 'Date Created', key: 'created_at' },
  { title: 'Total Amount', key: 'amount' },
  { title: 'Paid', key: 'paid' },
  { title: 'Balance', key: 'balance' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const generateInvoice = () => {
  isDialogVisible.value = true

  const formData = {
    fee_note_ids: selectedRows.value,
    company_id: route.params.id,
  }

  $api('invoices', {
    method: 'POST',
    body: formData,
  }).then(response => {
    isDialogVisible.value = false

    // Handle success response
    if (response.message) {
      snackbarMessage.value = response.message
      isSnackbarScrollReverseVisible.value = true
    }
  }).catch(response => {
    isDialogVisible.value = false

    if (response?.data) {
      const { message, used_fee_note_ids } = response.data

      if (used_fee_note_ids && used_fee_note_ids.length > 0)
        snackbarMessage.value = `${message} Fee Note IDs: ${used_fee_note_ids.join(', ')}`
      else
        snackbarMessage.value = message || 'An error occurred while generating the invoice. Please try again.'

      isSnackbarScrollReverseVisible.value = true
    }
    else {
      // Generic error message
      snackbarMessage.value = 'An error occurred while generating the invoice. Please try again.'
      isSnackbarScrollReverseVisible.value = true
    }
  })
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    width="300"
  >
    <VCard
      color="primary"
      width="300"
    >
      <VCardText class="pt-3">
        Generating Invoice. Please stand by
        <VProgressLinear
          indeterminate
          bg-color="rgba(var(--v-theme-surface), 0.1)"
          :height="8"
          class="mb-0 mt-4"
        />
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
  <section v-if="summary && feeNotes && payment">
    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard class="invoice-preview-wrapper pa-6 pa-sm-12">
          <!-- SECTION Header -->
          <div class="invoice-header-preview d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row bg-var-theme-background gap-6 rounded pa-6 mb-6">
            <VImg
              :src="letterHead"
              height="auto"
              width="100%"
              class="letterhead-img"
            />
          </div>
          <!-- !SECTION -->

          <!-- 👉 Payment Details -->
          <VRow class="print-row mb-6">
            <VCol class="text-no-wrap">
              <h6 class="text-h6 mb-4">
                Bill To:
              </h6>

              <p class="mb-0">
                {{ summary.company_name }}
              </p>
              <p class="mb-0">
                {{ summary.kra_pin }}
              </p>
              <p class="mb-0">
                {{ summary.reg_number }},
              </p>
              <p class="mb-0">
                {{ summary.phone }}
              </p>
              <p class="mb-0">
                {{ summary.email }}
              </p>
            </VCol>
          </VRow>

          <!-- 👉 invoice Table -->
          <VDataTableServer
            v-model:items-per-page="itemsPerPage"
            v-model:model-value="selectedRows"
            v-model:page="page"
            :items="feeNotes"
            :items-length="feeNotes.length"
            :headers="headers"
            class="invoice-preview-table border text-high-emphasis overflow-hidden mb-6"
            show-select
            @update:options="updateOptions"
          >
            <template #item.id="{ item }">
              #FN{{ item.id }}
            </template>

            <template #item.created_at="{ item }">
              {{ new Date(item.created_at).toLocaleDateString('en-KE') }}
            </template>

            <template #item.actions="{ item }">
              <IconBtn>
                <VIcon icon="tabler-dots-vertical" />
                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      value="view"
                      prepend-icon="tabler-eye"
                    >
                      View
                    </VListItem>

                    <VListItem
                      value="edit"
                      prepend-icon="tabler-pencil"
                    >
                      Make Payment
                    </VListItem>
                  </VList>
                </VMenu>
              </IconBtn>
            </template>
          </VDataTableServer>

          <!-- 👉 Total -->
          <div class="d-flex justify-space-between flex-column flex-sm-row print-row">
            <div class="mb-2">
              <p>Thanks for your business</p>
            </div>

            <div>
              <table class="w-100">
                <tbody>
                  <tr>
                    <td class="pe-16">
                      Subtotal:
                    </td>
                    <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                      <h6 class="text-base font-weight-medium">
                        {{ payment.total_sum }}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-16">
                      Total Paid:
                    </td>
                    <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                      <h6 class="text-base font-weight-medium">
                        {{ payment.total_paid }}
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>

              <VDivider class="my-2" />

              <table class="w-100">
                <tbody>
                  <tr>
                    <td class="pe-16">
                      Balance:
                    </td>
                    <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                      <h6 class="text-base font-weight-medium">
                        {{ payment.total_due }}
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <VDivider class="my-6 border-dashed" />

          <p class="mb-0">
            <span class="text-high-emphasis font-weight-medium me-1">
              Note:
            </span>
            <span>It was a pleasure working with you and your team. We hope you will keep us in mind for future services. Thank You!</span>
          </p>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <VCard>
          <VCardText>
            <!-- 👉 Send Invoice Trigger button -->
            <VBtn
              block
              prepend-icon="tabler-send"
              class="mb-4"
              @click="generateInvoice"
            >
              Generate Invoice
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

    <!-- 👉 Add Payment Sidebar -->
    <InvoiceAddPaymentDrawer v-model:isDrawerOpen="isAddPaymentSidebarVisible" />

    <!-- 👉 Send Invoice Sidebar -->
    <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendPaymentSidebarVisible" />
  </section>
  <section v-else>
    <VAlert
      type="error"
      variant="tonal"
    >
      Invoice with ID  {{ route.params.id }} not found!
    </VAlert>
  </section>
</template>

<style lang="scss">
.invoice-preview-table {
  --v-table-header-color: var(--v-theme-surface);

  &.v-table .v-table__wrapper table thead tr th {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  }
}

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
  }

  .product-buy-now {
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

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }

  .v-table__wrapper {
    overflow: hidden !important;
  }

  .vue-devtools__anchor {
    display: none;
  }

  table {
    border-collapse: collapse !important;
    width: 100%;
  }

  table th,
  table td {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
    padding: 8px;
    text-align: left;
  }

  table thead th {
    background-color: rgba(var(--v-theme-surface), 0.1);
  }
}
</style>
