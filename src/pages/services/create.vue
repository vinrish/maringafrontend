<script setup lang="ts">
const router = useRouter()

const formData = ref({
  name: '',
  price: '',
  description: '',
  status: true,
})

const formErrors = ref({
  name: '',
  price: '',
  description: '',
})

const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('error')
const isSnackbarVisible = ref(false)
const snackbarMessage = ref('')

const onSubmit = () => {
  formErrors.value = {
    name: '',
    price: '',
    description: '',
  }

  showAlert.value = false
  alertMessage.value = ''

  $api('/services', {
    method: 'POST',
    body: formData.value,
  }).then(response => {
    console.log('Data sent successfully:', response)
    alertMessage.value = 'Service created successfully!'
    alertColor.value = 'success'
    showAlert.value = true

    // snackbarMessage.value = 'Service created successfully!'
    // isSnackbarVisible.value = true

    // Redirect to the list page after a short delay
    setTimeout(() => {
      router.push('/services/list')
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

    <VSnackbar
      v-model="isSnackbarVisible"
      transition="scroll-y-reverse-transition"
      location="top end"
    >
      {{ snackbarMessage }}
    </VSnackbar>
    <VRow>
      <VCol md="12">
        <!-- 👉 Product Information -->
        <VCard
          class="mb-6"
          title="Service Information"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="formData.name"
                  label="Service Name"
                  placeholder="Name"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="formData.price"
                  label="Service Price"
                  placeholder="Price"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <span class="mb-1">Service Description (optional)</span>
                <ProductDescriptionEditor
                  v-model="formData.description"
                  placeholder="Service Description"
                  class="border rounded"
                />
              </VCol>

              <VCheckbox
                v-model="formData.status"
                label="Service Is Active"
              />

              <VDivider class="my-2" />

              <VBtn
                variant="tonal"
                color="primary"
                @click.prevent="onSubmit"
              >
                Save Service
              </VBtn>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<!-- <style scoped lang="scss"> -->

<!-- </style> -->
