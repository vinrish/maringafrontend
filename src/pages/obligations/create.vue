<script setup lang="ts">
import { router } from '@/plugins/1.router'

const formData = ref({
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

const { data: createData, execute: fetchCreateData } = await useApi<any>(createUrl('/obligations/create'))

// const clientsList = computed((): Client[] => createData.value?.clients || [])
const clientsList = computed(() =>
  createData.value.clients.map(client => ({
    text: `${client.first_name} ${client.last_name}`,
    value: client.id,
  })),
)

const employeesList = computed(() =>
  createData.value.employees.map(employee => ({
    text: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  })),
)

const servicesList = computed(() =>
  createData.value.services.map(service => ({
    text: service.name,
    value: service.id,
    price: service.price,
  })),
)

const selectedServices = ref([])

console.log(selectedServices)

const companiesList = computed(() =>
  createData.value.companies.map(company => ({
    text: company.name,
    value: company.id,
  })),
)

const businessesList = computed(() =>
  createData.value.businesses.map(business => ({
    text: business.name,
    value: business.id,
  })),
)

console.log(createData.value.clients)

fetchCreateData()

// const totalFee = computed(() => {
//   return selectedServices.value.reduce((total, service) => total + Number.parseFloat(service.price || 0), 0).toFixed(2)
// })

const totalFee = computed(() => {
  return selectedServices.value
    .reduce((total, service) => total + Number.parseFloat(service.adjusted_price || 0), 0)
    .toFixed(2)
})

watch(totalFee, newTotal => {
  formData.value.fee = newTotal
})

const selectedService = ref(null)

const onServiceSelect = serviceId => {
  const service = servicesList.value.find(s => s.value === serviceId)
  if (service && !selectedServices.value.some(s => s.value === serviceId)) {
    selectedServices.value.push({ ...service, adjusted_price: service.price })
    formData.value.service_ids.push({ id: serviceId, adjusted_price: service.price })
  }
  selectedService.value = null // Reset selectedService to allow re-selection
}

const removeService = index => {
  // Remove the service from the selectedServices array
  const removedService = selectedServices.value.splice(index, 1)[0]

  // Update the formData.service_ids to remove the service
  formData.value.service_ids = formData.value.service_ids.filter(
    service => service.id !== removedService.value,
  )
}

const resetSelection = () => {
  // Clear selected clients, companies, and businesses when type changes
  formData.value.client_id = null
  formData.value.company_id = null
  formData.value.business_id = null
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

  // formData.value.service_ids = selectedServices.value.map(service => service.value)
  formData.value.service_ids = selectedServices.value.map(service => ({
    id: service.value,
    adjusted_price: service.adjusted_price,
  }))

  $api('/obligations', {
    method: 'POST',
    body: formData.value,
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
  console.log(formData.value)
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
                    md="8"
                  >
                    <AppTextField
                      v-model="service.text"
                      placeholder="Service Name"
                      :disabled="true"
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
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VBtn
                      variant="tonal"
                      color="error"
                      @click="removeService(index)"
                    >
                      Remove
                    </VBtn>
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
                  :disabled="true"
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
                Save Obligation
              </VBtn>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped lang="scss">

</style>
