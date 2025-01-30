<script setup lang="ts">
const router = useRouter()
const route = useRoute('hrm-employees-edit-id')

const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('error')
const panel = ref(0)

const formData = reactive({
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

const { data: editData, execute: fetchEditData } = await useApi<any>(`/employees/${route.params.id}/edit`)

fetchEditData()

const companiesList = computed(() =>
  editData.value?.companies
    ? editData.value.companies.map(company => ({
      text: company.name,
      value: company.id,
    }))
    : [],
)

const employeeTypeList = computed(() =>
  editData.value.employeeTypeList.map(employeeType => ({
    text: employeeType.label,
    value: employeeType.value,
  })),
)

const employeeStatusList = computed(() =>
  editData.value.employeeStatusList.map(employeeStatus => ({
    text: employeeStatus.label,
    value: employeeStatus.value,
  })),
)

watch(editData, newEditData => {
  console.log('Form Data after API fetch:', newEditData)
  if (newEditData?.employee) {
    const employee = newEditData.employee

    formData.first_name = employee.user.first_name || ''
    formData.last_name = employee.user.last_name || ''
    formData.middle_name = employee.user.middle_name || ''
    formData.email = employee.user.email || ''
    formData.phone = employee.user.phone || ''
    formData.post_address = employee.post_address || ''
    formData.post_code = employee.post_code || ''
    formData.kra_pin = employee.kra_pin || ''
    formData.id_no = employee.id_no || ''
    formData.city = employee.city || ''
    formData.county = employee.county || ''
    formData.country = employee.country || ''
    formData.password = employee.password || ''
    formData.birth_date = employee.birth_date || ''
    formData.joining_date = employee.joining_date || ''
    formData.company_id = employee.company_id || ''
    formData.employee_status = employee.employee_status
    formData.employee_type = employee.employee_type
    formData.department = employee.department || ''
    formData.position = employee.position || ''
    formData.salary = employee.salary || ''
    formData.allow_login = !!employee.user.allow_login
  }
  else {
    console.log('Form Data after API fetch error:')
  }
})

const onSubmit = () => {
  $api(`/employees/${route.params.id}`, {
    method: 'PATCH',
    body: formData,
  }).then(() => {
    alertMessage.value = 'Employee updated successfully!'
    alertColor.value = 'success'
    showAlert.value = true
    setTimeout(() => {
      router.push('/hrm/employees/list')
    }, 1500)
  }).catch(() => {
    alertMessage.value = 'An unexpected error occurred. Please try again.'
  })
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
                      Update Employee
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
