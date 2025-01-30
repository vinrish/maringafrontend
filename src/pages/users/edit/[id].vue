<script setup lang="ts">
const router = useRouter()
const route = useRoute('obligations-edit-id')

const formData = reactive({
  name: '',
  description: '',
  fee: '',
  amount: '',
  type: '0',
  privacy: false,
  start_date: '',
  due_date: '',
  frequency: '',
  status: '',
  is_recurring: '',
  employee_ids: [],
  service_ids: [],
  client_id: null,
  company_id: null,
  business_id: null,
})

const formErrors = ref({
  name: '',
  price: '',
  description: '',
})

const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('error')

const { data: editData, execute: fetchEditData } = await useApi<any>(`/obligations/${route.params.id}/edit`)

fetchEditData()

console.log('Fetched Edit Data:', editData.value)

// const clientsList = computed((): Client[] => createData.value?.clients || [])
const clientsList = computed(() =>
  editData.value.clients.map(client => ({
    text: `${client.first_name} ${client.last_name}`,
    value: client.id,
  })),
)

const employeesList = computed(() =>
  editData.value.employees.map(employee => ({
    text: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  })),
)

const servicesList = computed(() =>
  editData.value.services.map(service => ({
    text: service.name,
    value: service.id,
    price: service.price,
  })),
)

const selectedServices = ref([])

const companiesList = computed(() =>
  editData.value.companies.map(company => ({
    text: company.name,
    value: company.id,
  })),
)

const businessesList = computed(() =>
  editData.value.businesses.map(business => ({
    text: business.name,
    value: business.id,
  })),
)

watch(editData, newEditData => {
  console.log('Form Data after API fetch:', newEditData)
  if (newEditData?.obligation) {
    const obligation = newEditData.obligation

    formData.name = obligation.name || ''
    formData.description = obligation.description || ''
    formData.fee = obligation.fee || ''
    formData.amount = obligation.amount || ''
    formData.type = obligation.type.toString() || '0'
    formData.privacy = obligation.privacy || false
    formData.start_date = obligation.start_date || ''
    formData.frequency = obligation.frequency !== null ? obligation.frequency : '';
    formData.status = obligation.status || ''
    formData.is_recurring = obligation.is_recurring || ''
    formData.client_id = obligation.client_id || null
    formData.company_id = obligation.company_id || null
    formData.business_id = obligation.business_id || null
    formData.service_ids = obligation.service_ids || []
    formData.employee_ids = obligation.employee_ids || []

    selectedServices.value = obligation.services.map(service => ({
      value: service.id,
      text: service.name,
      price: service.price,
      adjusted_price: service.pivot.price || service.price, // Use the adjusted price from pivot or original
    }))

    // Populate employee_ids for autocomplete
    // formData.employee_ids = obligation.employees.map(employee => ({
    //   value: employee.id,
    //   text: `${employee.user.first_name} ${employee.user.last_name}`,
    // }))

    formData.employee_ids = obligation.employees.map(employee => employee.id)

    console.log('Form Data after API fetch:', formData)
  }
  else {
    console.log('Form Data after API fetch error:')
  }
})

const totalFee = computed(() => {
  return selectedServices.value.reduce((total, service) => {
    return total + Number.parseFloat(service.adjusted_price || 0) // Use adjusted_price for total
  }, 0).toFixed(2) // Ensure it's a number before formatting
})

watch(selectedServices, () => {
  formData.fee = totalFee.value // Update formData.fee whenever selectedServices change
})

const selectedService = ref(null)

const onServiceSelect = serviceId => {
  const service = servicesList.value.find(s => s.value === serviceId)
  if (service && !selectedServices.some(s => s.value === serviceId)) {
    selectedServices.push(reactive({ ...service, adjusted_price: service.price }))
    formData.service_ids.push({ id: serviceId, adjusted_price: service.price })
  }
  selectedService.value = null
}

watch(
  selectedServices,
  newSelectedServices => {
    formData.fee = newSelectedServices.reduce((total, service) => {
      return total + Number.parseFloat(service.adjusted_price || 0)
    }, 0).toFixed(2)
  },
  { deep: true },
)

const resetSelection = () => {
  // Clear selected clients, companies, and businesses when type changes
  formData.client_id = null
  formData.company_id = null
  formData.business_id = null
  selectedServices.value = []
}

const frequencyList = [
  { text: 'Daily', value: 0 },
  { text: 'Weekly', value: 1 },
  { text: 'Monthly', value: 2 },
  { text: 'Quartely', value: 3 },
  { text: 'Semi-Anually', value: 4 },
  { text: 'Annualy', value: 5 },
]

const onSubmit = () => {
  formErrors.value = {
    name: '',
    price: '',
    description: '',
  }

  showAlert.value = false
  alertMessage.value = ''

  formData.service_ids = selectedServices.value.map(service => service.value) // Only IDs
  formData.adjusted_prices = selectedServices.value.map(service => ({
    id: service.value,
    adjusted_price: service.adjusted_price || service.price,
  }))
  formData.employee_ids = formData.employee_ids.map(employee =>
    typeof employee === 'object' ? employee.value : employee
  )

  $api(`/obligations/${route.params.id}`, {
    method: 'PATCH',
    body: formData,
  }).then(response => {
    console.log('Data sent successfully:', response)
    alertMessage.value = 'Obligation created successfully!'
    alertColor.value = 'success'
    showAlert.value = true

    // snackbarMessage.value = 'Service created successfully!'
    // isSnackbarVisible.value = true

    // Redirect to the list page after a short delay
    setTimeout(() => {
      router.push('/obligations/list')
    }, 1500)
  }).catch(error => {
    if (error.response && error.response.errors) {
      const errors = error.response.errors

      formErrors.value = {
        name: errors.name ? errors.name[0] : '',
        price: errors.price ? errors.price[0] : '',
        description: errors.description ? errors.description[0] : '',
      }

      alertMessage.value = Object.values(errors).flat().join(', ')
    }
    else {
      alertMessage.value = 'An unexpected error occurred. Please try again.'
      console.error('Failed to send data:', error)
    }
    alertColor.value = 'error'
    showAlert.value = true
  })
  console.log(formData)
}
</script>

<template>
  <div>
    <VAlert
      v-if="showAlert"
      :type="alertColor"
      closable
      title="Status"
      @click:close="showAlert = false"
    >
      {{ alertMessage }}
    </VAlert>
    <VRow>
      <VCol md="12">
        <!-- 👉 Product Information -->
        <VCard
          class="mb-6"
          title="Obligation Information"
        >
          <VCardText>
            <VRow>
              <VRadioGroup
                v-model="formData.type"
                inline
                @change="resetSelection"
              >
                <VRadio
                  label="Client"
                  value="0"
                  density="compact"
                />
                <VRadio
                  label="Company"
                  value="1"
                  density="compact"
                />

                <VRadio
                  label="Business"
                  value="2"
                  density="compact"
                />
              </VRadioGroup>

              <VDivider class="my-3" />

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="formData.name"
                  label="Obligation Name"
                  placeholder="Name"
                />
              </VCol>

              <VCol
                v-if="formData.type === '0'"
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="formData.client_id"
                  :items="clientsList"
                  item-title="text"
                  item-value="value"
                  label="Select Client"
                  placeholder="Select Client"
                />
              </VCol>

              <VCol
                v-if="formData.type === '1'"
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="formData.company_id"
                  :items="companiesList"
                  item-title="text"
                  item-value="value"
                  label="Select Company"
                  placeholder="Select Company"
                />
              </VCol>

              <VCol
                v-if="formData.type === '2'"
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="formData.business_id"
                  :items="businessesList"
                  item-title="text"
                  item-value="value"
                  label="Select Business"
                  placeholder="Select Business"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppDateTimePicker
                  v-model="formData.start_date"
                  label="Obligation Start Date"
                  placeholder="Select date"
                  :config="{ dateFormat: 'F j, Y' }"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="selectedService"
                  :items="servicesList"
                  item-title="text"
                  item-value="value"
                  label="Select Services"
                  placeholder="Select Services"
                  @update:model-value="onServiceSelect"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="formData.frequency"
                  :items="frequencyList"
                  item-title="text"
                  item-value="value"
                  label="Recurring"
                  placeholder="Select Employees"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete
                  v-model="formData.employee_ids"
                  label="Employees"
                  :items="employeesList"
                  item-title="text"
                  item-value="value"
                  placeholder="Select Employee"
                  chips
                  multiple
                  closable-chips
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <h6>Selected Services</h6>
                <VRow
                  v-for="(service, index) in selectedServices"
                  :key="service.value"
                >
                  <VCol
                    cols="12"
                    md="10"
                  >
                    <AppTextField
                      v-model="service.text"
                      placeholder="Service Name"
                      disabled
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <AppTextField
                      v-model="service.adjusted_price"
                      placeholder="Price"
                      type="number"
                    />
                  </VCol>
                </VRow>
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="formData.fee"
                  label="Total Fee"
                  placeholder="0.00"
                  disabled
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <span class="mb-1">Obligation Description (optional)</span>
                <ProductDescriptionEditor
                  v-model="formData.description"
                  placeholder="Obligation Description"
                  class="border rounded"
                />
              </VCol>

              <VDivider class="my-2" />

              <VBtn
                variant="tonal"
                color="primary"
                @click.prevent="onSubmit"
              >
                Update Obligation
              </VBtn>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
