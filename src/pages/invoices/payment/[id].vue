<script setup lang="ts">
import html2pdf from 'html2pdf.js'
import letterHead from '@images/letterhead/letter.jpeg'

const route = useRoute('invoices-view-id')

const { data: invoiceData } = await useApi<any>(`/invoices/${route.params.id}`)
const invoice = ref()
const feeNotes = ref([])
const payments = ref([])

if (invoiceData.value) {
  invoice.value = invoiceData.value.data
  feeNotes.value = invoiceData.value.data.fee_notes || []
  payments.value = invoiceData.value.data.payments || []
}

const printInvoice = () => {
  const invoiceElement = document.querySelector('.invoice-preview-wrapper')
  if (!invoiceElement)
    return

  const originalContent = document.body.innerHTML
  const printContent = invoiceElement.innerHTML

  document.body.innerHTML = printContent
  window.print()
  document.body.innerHTML = originalContent
}

const downloadPDF = () => {
  const element = document.querySelector('.invoice-preview-wrapper')
  if (!element || !invoice.value)
    return

  // Clone the element to modify it with download-specific styles
  const clone = element.cloneNode(true) as HTMLElement

  // Add print styles explicitly to the cloned element
  const style = document.createElement('style')

  style.textContent = `
    body {
      margin: 0;
      padding: 0;
      background-color: white;
    }
    .invoice-preview-wrapper {
      background-color: white !important;
      color: black !important;
      padding: 20px;
    }
    .letterhead-img {
      background-color: white !important;
    }
    .v-card {
      background-color: white !important;
    }
    table {
      border-collapse: collapse !important;
      width: 100%;
      background-color: white !important;
    }
    th, td {
      border: 1px solid #000 !important;
      background-color: white !important;
      color: black !important;
      padding: 8px;
      text-align: left;
    }
    thead th {
      background-color: #f1f1f1 !important;
    }
  `

  // Append the style to the cloned wrapper
  clone.appendChild(style)

  // Configure HTML2PDF options
  const options = {
    margin: 0,
    filename: `${invoice.value.invoice_number || 'Invoice'}.pdf`,
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  }

  // Generate PDF
  html2pdf().set(options).from(clone).save().finally(() => {
    // Clean up the temporary wrapper and the style after saving the PDF
    clone.remove()
    style.remove()
  })
}
</script>

<template>
  <section>
    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard
          v-if="invoice"
          class="invoice-preview-wrapper pa-6 pa-sm-12"
        >
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
                {{ invoice.client?.name || invoice.company?.name || invoice.business?.name }}
              </p>
              <p class="mb-0">
                {{ invoice.client?.kra_pin || invoice.company?.kra_pin || invoice.business?.kra_pin }}
              </p>
              <p class="mb-0">
                {{ invoice.client?.email || invoice.company?.email || invoice.business?.email }}
              </p>
            </VCol>

            <VCol>
              <h6 class="font-weight-medium text-lg mb-6 text-right">
                {{ invoice?.invoice_number }}
              </h6>
            </VCol>
          </VRow>

          <VTable
            density="compact"
            class="text-no-wrap"
          >
            <thead>
              <tr>
                <th>
                  <small>FeeNote No</small>
                </th>
                <th>
                  <small>Name</small>
                </th>
                <th>
                  <small>Date Created</small>
                </th>
                <th>
                  <small>Total Amount</small>
                </th>
                <th>
                  <small>Paid</small>
                </th>
                <th>
                  <small>Balance</small>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in feeNotes"
                :key="item.id"
              >
                <td>
                  <small>#FN{{ item.id }}</small>
                </td>
                <td>
                  <small>{{ item.fee_name }}</small>
                </td>
                <td>
                  <small>{{ new Date(item.created_at).toLocaleDateString('en-KE') }}</small>
                </td>
                <td>
                  <small>{{ item.amount }}</small>
                </td>
                <td>
                  <small>{{ item.paid }}</small>
                </td>
                <td>
                  <small>{{ item.balance }}</small>
                </td>
              </tr>
            </tbody>
          </VTable>

          <VDivider class="my-6 border-dashed" />

          <h3>Payments</h3>
          <VTable
            density="compact"
            class="text-no-wrap"
          >
            <thead>
              <tr>
                <th>
                  <small>Payment No</small>
                </th>
                <th>
                  <small>Amount</small>
                </th>
                <th>
                  <small>Payment Method</small>
                </th>
                <th>
                  <small>Transaction Reference</small>
                </th>
                <th>
                  <small>Payment Date</small>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in payments"
                :key="item.id"
              >
                <td>
                  <small>#PM{{ item.id }}</small>
                </td>
                <td>
                  <small>{{ item.amount }}</small>
                </td>
                <td>
                  <small>{{ item.payment_method }}</small>
                </td>
                <td>
                  <small>{{ item.transaction_reference }}</small>
                </td>
                <td>
                  <small>{{ new Date(item.date).toLocaleDateString('en-KE') }}</small>
                </td>
              </tr>
            </tbody>
          </VTable>

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
              color="secondary"
              variant="tonal"
              class="mb-4"
              @click="downloadPDF"
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

<style scoped lang="scss">
.invoice-preview-table {
  --v-table-header-color: var(--v-theme-surface);

  &.v-table .v-table__wrapper table thead tr th {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  }
}

@media print {
  //body * {
  //  visibility: hidden;
  //}

  .invoice-preview-wrapper {
    visibility: visible;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .invoice-preview-wrapper .v-card {
    box-shadow: none !important;
  }
  .v-table__wrapper table th,
  .v-table__wrapper table td {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
    padding: 8px;
    text-align: left;
  }

  .invoice-preview-table .v-table__wrapper table th:nth-child(8),
  .invoice-preview-table .v-table__wrapper table td:nth-child(8) {
    display: none !important;
  }

  .v-theme--dark {
    --v-theme-surface: 255, 255, 255;
    --v-theme-on-surface: 47, 43, 61;
    --v-theme-on-background: 47, 43, 61;
  }

  body {
    background: none !important;
    visibility: hidden;
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
