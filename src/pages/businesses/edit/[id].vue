<script setup lang="ts">
const router = useRouter()
const route = useRoute('businesses-edit-id')

const formData = reactive({
  name: '',
  business_address: '',
  business_email: '',
  business_phone: '',
  client_id: null,
  registration_date: '',
  business_no: '',
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

const { data: editData, execute: fetchEditData } = await useApi<any>(`/businesses/${route.params.id}/edit`)

fetchEditData()

console.log('Fetched Edit Data:', editData.value)

// const clientsList = computed((): Client[] => createData.value?.clients || [])
const clientsList = computed(() =>
  editData.value.clients.map(client => ({
    text: `${client.user.first_name} ${client.user.middle_name} ${client.user.last_name}`,
    value: client.id,
  })),
)

watch(editData, newEditData => {
  console.log('Form Data after API fetch:', newEditData)
  if (newEditData?.business) {
    const business = newEditData.business

    formData.name = business.name || ''
    formData.business_no = business.business_no || ''
    formData.business_address = business.business_address || ''
    formData.registration_date = business.registration_date || ''
    formData.business_phone = business.business_phone
    formData.business_email = business.business_email
    formData.client_id = business.client_id || null

    console.log('Form Data after API fetch:', formData)
  }
  else {
    console.log('Form Data after API fetch error:')
  }
})

const onSubmit = () => {
  formErrors.value = {
    name: '',
    price: '',
    description: '',
  }

  showAlert.value = false
  alertMessage.value = ''

  $api(`/businesses/${route.params.id}`, {
    method: 'PATCH',
    body: formData,
  }).then(response => {
    console.log('Data sent successfully:', response)
    alertMessage.value = 'Business created successfully!'
    alertColor.value = 'success'
    showAlert.value = true

    // snackbarMessage.value = 'Service created successfully!'
    // isSnackbarVisible.value = true

    // Redirect to the list page after a short delay
    setTimeout(() => {
      router.push('/businesses/list')
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

    <VExpansionPanels v-model="panel">
      <!-- SECTION Delivery Address -->
      <VExpansionPanel>
        <VExpansionPanelTitle>Business Details</VExpansionPanelTitle>

        <VExpansionPanelText>
          <VRow>
            <VCol md="12">
              <!-- 👉 Product Information -->
              <VCard
                class="mb-6"
                title="Business Information"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.name"
                        label="Business Name"
                        placeholder="Business Name"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.business_email"
                        label="Business Email"
                        placeholder="Business Email"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.business_phone"
                        label="Business Phone"
                        placeholder="Business Phone"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.business_address"
                        label="Business Address"
                        placeholder="Address"
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
        <VExpansionPanelTitle>Business Identification Documents</VExpansionPanelTitle>

        <VExpansionPanelText>
          <VRow>
            <VCol md="12">
              <!-- 👉 Product Information -->
              <VCard
                class="mb-6"
                title="Business Documents"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.business_no"
                        label="Business Registration Number"
                        placeholder="Registration Number"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppDateTimePicker
                        v-model="formData.registration_date"
                        label="Business Registration Date"
                        placeholder="Select date"
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
                      Update Business
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
