<script setup lang="ts">
import { router } from '@/plugins/1.router'

const formData = ref({
  name: '',
  address: '',
  notes: '',
  postal_code: '',
  country: '',
  county: '',
  town: '',
  website: '',
  industry: '',
  revenue: '',
  email: '',
  phone: '',
  employees: '',
  client_id: null,
  reg_date: '',
  reg_number: '',
  kra_pin: '',
  fiscal_year: '',
  kra_obligations: '',
})

const formErrors = ref({
  name: '',
  price: '',
  description: '',
})

const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('error')
const panel = ref(0)

const employeeList = [
  { text: '1-10', value: '1-10' },
  { text: '11-50', value: '11-50' },
  { text: '51-200', value: '51-200' },
  { text: '201-500', value: '201-500' },
  { text: '501-1000', value: '501-1000' },
  { text: '1001-5000', value: '1001-5000' },
  { text: '50001-10000', value: '50001-10000' },
  { text: '10000+', value: '10000+' },
]

const { data: createData, execute: fetchCreateData } = await useApi<any>(createUrl('/companies/create'))

// const clientsList = computed((): Client[] => createData.value?.clients || [])
const clientsList = computed(() =>
  createData.value.clients.map(client => ({
    text: `${client.user.first_name} ${client.user.middle_name} ${client.user.last_name}`,
    value: client.id,
  })),
)

console.log(createData.value.clients)

fetchCreateData()

const onSubmit = () => {
  formErrors.value = {
    name: '',
    price: '',
    description: '',
  }

  showAlert.value = false
  alertMessage.value = ''

  $api('/companies', {
    method: 'POST',
    body: formData.value,
  }).then(response => {
    console.log('Data sent successfully:', response)
    alertMessage.value = 'Company created successfully!'
    alertColor.value = 'success'
    showAlert.value = true

    // snackbarMessage.value = 'Service created successfully!'
    // isSnackbarVisible.value = true

    // Redirect to the list page after a short delay
    setTimeout(() => {
      router.push('/companies/list')
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

    <VExpansionPanels v-model="panel">
      <!-- SECTION Delivery Address -->
      <VExpansionPanel>
        <VExpansionPanelTitle>Company Details</VExpansionPanelTitle>

        <VExpansionPanelText>
          <VRow>
            <VCol md="12">
              <!-- 👉 Product Information -->
              <VCard
                class="mb-6"
                title="Company Information"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.name"
                        label="Company Name"
                        placeholder="Company Name"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.email"
                        label="Company Email"
                        placeholder="Company Email"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.phone"
                        label="Company Phone"
                        placeholder="Company Phone"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.address"
                        label="Company Address"
                        placeholder="Address"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.postal_code"
                        label="Postal Code"
                        placeholder="Postal Code"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.country"
                        label="Country"
                        placeholder="Country"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.county"
                        label="County"
                        placeholder="Country"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.town"
                        label="City/Town"
                        placeholder="City/Town"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.website"
                        label="Website"
                        placeholder="Website"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.industry"
                        label="Industry"
                        placeholder="Industry"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.revenue"
                        label="Revenue"
                        placeholder="Revenue"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppSelect
                        v-model="formData.employees"
                        :items="employeeList"
                        item-title="text"
                        item-value="value"
                        label="Employees"
                        placeholder="Select Employees"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="12"
                    >
                      <span class="mb-1">Company Description (optional)</span>
                      <ProductDescriptionEditor
                        v-model="formData.notes"
                        placeholder="Service Description"
                        class="border rounded"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel>
        <VExpansionPanelTitle>Company Identification Documents</VExpansionPanelTitle>

        <VExpansionPanelText>
          <VRow>
            <VCol md="12">
              <!-- 👉 Product Information -->
              <VCard
                class="mb-6"
                title="Company Documents"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.reg_number"
                        label="Company Registration Number"
                        placeholder="Registration Number"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppDateTimePicker
                        v-model="formData.reg_date"
                        label="Company Registration Date"
                        placeholder="Select date"
                        :config="{ dateFormat: 'F j, Y' }"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.kra_pin"
                        label="Company KRA PIN"
                        placeholder="KRA PIN"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.fiscal_year"
                        label="Fiscal Year"
                        placeholder="Fiscal Year"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.kra_obligations"
                        label="KRA Obligations"
                        placeholder="KRA Obligations"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppAutocomplete
                        v-model="formData.client_id"
                        :items="clientsList"
                        item-title="text"
                        item-value="value"
                        label="Select Client"
                        placeholder="Select Client"
                      />
                    </VCol>

                    <VDivider class="my-2" />

                    <VBtn
                      variant="tonal"
                      color="primary"
                      @click.prevent="onSubmit"
                    >
                      Save Company
                    </VBtn>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>
