<script setup lang="ts">
const searchQuery = ref('')
const selectedStatus = ref()
const selectedRows = ref([])
const isPaymentDialogOpen = ref(false)
const selectedInvoice = ref<any>(null)
const isSnackbarScrollReverseVisible = ref(false)
const snackbarMessage = ref('')

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const { data: invoiceData, execute: fetchInvoices } = await useApi<any>(createUrl('/invoices', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const invoices = computed(() => {
  return invoiceData.value.invoices || []
})

const totalInvoices = computed(() => invoiceData.value.total)

// Call the fetch function on component mount
fetchInvoices()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const status = ref([
  { title: 'Pending', value: 0 },
  { title: 'Partial', value: 1 },
  { title: 'Paid', value: 2 },
])

const headers = [
  { title: 'Invoice Number', key: 'invoice_number' },
  { title: 'Client / Company', key: 'client_name' },
  { title: 'Total Amount', key: 'total_amount' },
  { title: 'Amount Paid', key: 'amount_paid' },
  { title: 'Status', key: 'status' },
  { title: 'Created', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const resolveStatus = (statusVal: string) => {
  if (statusVal === 'Complete')
    return { text: 'Paid', color: 'success' }
  if (statusVal === 'Partial')
    return { text: 'Partial', color: 'warning' }
  if (statusVal === 'Pending')
    return { text: 'Pending', color: 'error' }
}

const openPaymentDialog = (invoice: any) => {
  selectedInvoice.value = invoice
  isPaymentDialogOpen.value = true
}

// Close the dialog
const closePaymentDialog = () => {
  isPaymentDialogOpen.value = false
}

const paymentMethodList = [
  { text: 'Cash', value: 'cash' },
  { text: 'Mpesa', value: 'mpesa' },
  { text: 'Cheque', value: 'cheque' },
  { text: 'Bank Transfer', value: 'banktransfer' },
]

const submitPayment = () => {
  const formData = {
    amount: selectedInvoice.value.paymentAmount,
    payment_method: selectedInvoice.value.paymentMethod,
    transaction_reference: selectedInvoice.value.transactionReference,
    paid_at: selectedInvoice.value.paidAt,
  }

  $api(`/invoices/${selectedInvoice.value.id}/pay`, {
    method: 'POST',
    body: formData,
  }).then(response => {
    isPaymentDialogOpen.value = false
    snackbarMessage.value = response.message
    isSnackbarScrollReverseVisible.value = true
    fetchInvoices()
  })
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
              placeholder="Search Invoice"
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
      <VDataTable
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :items="invoices"
        :items-length="totalInvoices"
        :headers="headers"
        class="text-no-wrap"
        show-select
        @update:options="updateOptions"
      >
        <!-- Name -->
        <template #item.invoice_number="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar
              size="34"
              :variant="!item.avatar ? 'tonal' : undefined"
            >
              <VImg
                v-if="item.avatar"
                :src="item.avatar"
              />
              <span v-else>{{ avatarText(item.invoice_number) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                <RouterLink
                  :to="{ name: 'invoices-view-id', params: { id: item.id } }"
                  class="font-weight-medium text-link"
                >
                  {{ item.invoice_number }}
                </RouterLink>
              </h6>
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
          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="view"
                  prepend-icon="tabler-eye"
                  :to="{ name: 'invoices-view-id', params: { id: item.id } }"
                >
                  View
                </VListItem>

                <VListItem
                  value="view"
                  prepend-icon="tabler-cash"
                  :to="{ name: 'invoices-payment-id', params: { id: item.id } }"
                >
                  Payments
                </VListItem>

                <VListItem
                  prepend-icon="tabler-eye"
                  @click="openPaymentDialog(item)"
                >
                  Make payment
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
            :total-items="totalInvoices"
          />
        </template>
      </VDataTable>

      <VDialog
        v-model="isPaymentDialogOpen"
        persistent
        max-width="600px"
      >
        <DialogCloseBtn @click="closePaymentDialog" />
        <VCard>
          <VCardTitle>
            Make Payment for Invoice {{ selectedInvoice?.invoice_number }}
          </VCardTitle>
          <VDivider />
          <VCardText>
            <form>
              <!-- Payment form fields -->
              <AppTextField
                v-model="selectedInvoice.paymentAmount"
                label="Amount to Pay"
              />
              <AppSelect
                v-model="selectedInvoice.paymentMethod"
                :items="paymentMethodList"
                item-title="text"
                item-value="value"
                label="Payment Method"
                placeholder="Select Payment Method"
              />
              <AppTextField
                v-model="selectedInvoice.transactionReference"
                label="Reference Number"
              />
              <AppDateTimePicker
                v-model="selectedInvoice.paidAt"
                label="Paid At"
              />
            </form>
          </VCardText>
          <VDivider />
          <VCardActions>
            <VSpacer />
            <VBtn
              color="secondary"
              @click="closePaymentDialog"
            >
              Cancel
            </VBtn>
            <VBtn
              color="primary"
              @click="submitPayment"
            >
              Submit Payment
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VCard>
  </section>
</template>

<style scoped lang="scss">

</style>
