<script setup lang="ts">
const router = useRouter()

const formData = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  phone: '',
  email: '',
  password: '',
  kra_pin: '',
  id_no: '',
  post_address: '',
  post_code: '',
  city: '',
  county: '',
  country: '',
  position: '',
  department: '',
  company_id: null,
  employee_status: '',
  employee_type: '',
  joining_date: '',
  birth_date: '',
  salary: '',
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

const { data: companyData, execute: fetchCreateData } = await useApi<any>(createUrl('/employees/create'))

const companiesList = computed(() =>
  companyData.value.companies.map(company => ({
    text: company.name,
    value: company.id,
  })),
)

const employeeTypeList = computed(() =>
  companyData.value.employeeTypeList.map(employeeType => ({
    text: employeeType.label,
    value: employeeType.value,
  })),
)

const employeeStatusList = computed(() =>
  companyData.value.employeeStatusList.map(employeeStatus => ({
    text: employeeStatus.label,
    value: employeeStatus.value,
  })),
)

// Call the fetch function on component mount
fetchCreateData()

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

  $api('/employees', {
    method: 'POST',
    body: submissionData,
  }).then(response => {
    console.log('Data sent successfully:', response)
    alertMessage.value = 'Employee created successfully!'
    alertColor.value = 'success'
    showAlert.value = true

    // snackbarMessage.value = 'Service created successfully!'
    // isSnackbarVisible.value = true

    // Redirect to the list page after a short delay
    setTimeout(() => {
      router.push('/hrm/employees/list')
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
        <VExpansionPanelTitle>Employee Details</VExpansionPanelTitle>

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
                        v-model="formData.id_no"
                        label="Employee ID Number"
                        placeholder="ID Number"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.kra_pin"
                        label="Employee KRA PIN"
                        placeholder="KRA PIN"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.email"
                        label="Email"
                        placeholder="Email"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.phone"
                        label="Phone"
                        placeholder="Phone"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppDateTimePicker
                        v-model="formData.birth_date"
                        label="Date of Birth"
                        placeholder="Select date"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.post_address"
                        label="Address"
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
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel>
        <VExpansionPanelTitle>Employment Details</VExpansionPanelTitle>

        <VExpansionPanelText>
          <VRow>
            <VCol md="12">
              <!-- 👉 Product Information -->
              <VCard
                class="mb-6"
                title="Employee Documents"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppAutocomplete
                        v-model="formData.company_id"
                        :items="companiesList"
                        item-title="text"
                        item-value="value"
                        label="Company"
                        placeholder="Select Company"
                        clearable
                        clear-icon="tabler-x"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.department"
                        label="Department"
                        placeholder="Department"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.position"
                        label="Position"
                        placeholder="Position"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        v-model="formData.salary"
                        label="Salary"
                        placeholder="Salary"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppSelect
                        v-model="formData.employee_type"
                        :items="employeeTypeList"
                        item-title="text"
                        item-value="value"
                        label="Employment Type"
                        placeholder="Select"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppSelect
                        v-model="formData.employee_status"
                        :items="employeeStatusList"
                        item-title="text"
                        item-value="value"
                        label="Employment Status"
                        placeholder="Select"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppDateTimePicker
                        v-model="formData.joining_date"
                        label="Joining Date"
                        placeholder="Select date"
                      />
                    </VCol>

                    <VDivider class="my-2" />

                    <VCheckbox
                      v-model="formData.allow_login"
                      label="Enable Employee Login"
                    />

                    <VDivider class="my-2" />

                    <VBtn
                      variant="tonal"
                      color="primary"
                      @click.prevent="onSubmit"
                    >
                      Save Employee
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
