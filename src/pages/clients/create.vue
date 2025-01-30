<script setup lang="ts">
import { router } from '@/plugins/1.router'

const formData = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  post_address: '',
  notes: '',
  post_code: '',
  country: '',
  county: '',
  password: '',
  city: '',
  id_no: '',
  email: '',
  phone: '',
  kra_pin: '',
  allow_login: true,
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

const onSubmit = () => {
  formErrors.value = {
    name: '',
    price: '',
    description: '',
  }

  showAlert.value = false
  alertMessage.value = ''

  const submissionData = {
    ...formData.value,
    allow_login: formData.value.allow_login ? 1 : 0,
  }

  $api('/clients', {
    method: 'POST',
    body: submissionData,
  }).then(response => {
    console.log('Data sent successfully:', response)
    alertMessage.value = 'Client created successfully!'
    alertColor.value = 'success'
    showAlert.value = true

    // snackbarMessage.value = 'Service created successfully!'
    // isSnackbarVisible.value = true

    // Redirect to the list page after a short delay
    setTimeout(() => {
      router.push('/clients/list')
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
        <VExpansionPanelTitle>Client Details</VExpansionPanelTitle>

        <VExpansionPanelText>
          <VRow>
            <VCol md="12">
              <!-- 👉 Product Information -->
              <VCard
                class="mb-6"
                title="Personal Information"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.first_name"
                        label="First Name"
                        placeholder="First Name"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.middle_name"
                        label="Middle Name"
                        placeholder="Middle Name"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.last_name"
                        label="Last Name"
                        placeholder="Last Name"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.email"
                        label="Client Email"
                        placeholder="Client Email"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.phone"
                        label="Client Phone"
                        placeholder="Client Phone"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.post_address"
                        label="Client Address"
                        placeholder="Address"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.post_code"
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
                        v-model="formData.city"
                        label="City/Town"
                        placeholder="City/Town"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="12"
                    >
                      <span class="mb-1">Client Description (optional)</span>
                      <ProductDescriptionEditor
                        v-model="formData.notes"
                        placeholder="Client Description"
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
        <VExpansionPanelTitle>Client Identification Documents</VExpansionPanelTitle>

        <VExpansionPanelText>
          <VRow>
            <VCol md="12">
              <!-- 👉 Product Information -->
              <VCard
                class="mb-6"
                title="Client Documents"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.id_no"
                        label="Client ID Number"
                        placeholder="ID Number"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.kra_pin"
                        label="Client KRA PIN"
                        placeholder="KRA PIN"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.password"
                        label="Password"
                        placeholder="Password"
                      />
                    </VCol>

                    <VCheckbox
                      v-model="formData.allow_login"
                      label="Enable Client Login"
                    />

                    <VDivider class="my-2" />

                    <VBtn
                      variant="tonal"
                      color="primary"
                      @click.prevent="onSubmit"
                    >
                      Save Client
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
