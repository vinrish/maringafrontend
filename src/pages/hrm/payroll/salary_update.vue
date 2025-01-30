<script setup lang="ts">

const selectedCompany = ref()
const selectedMonth = ref()
const selectedYear = ref()

const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('error')

const monthsList = [
  { text: 'JANUARY', value: 1 },
  { text: 'FEBRUARY', value: 2 },
  { text: 'MARCH', value: 3 },
  { text: 'APRIL', value: 4 },
  { text: 'MAY', value: 5 },
  { text: 'JUNE', value: 6 },
  { text: 'JULY', value: 7 },
  { text: 'AUGUST', value: 8 },
  { text: 'SEPTEMBER', value: 9 },
  { text: 'OCTOBER', value: 10 },
  { text: 'NOVEMBER', value: 11 },
  { text: 'DECEMBER', value: 12 },
]

const currentYear = new Date().getFullYear()

const yearsList = computed(() => {
  return Array.from({ length: 11 }, (_, index) => ({
    text: (currentYear - 10 + index).toString(),
    value: currentYear - 10 + index,
  }))
})

const { data: companyData, execute: fetchCompanyData } = await useApi<any>(createUrl('/payroll'))

const companiesList = computed(() =>
  companyData.value.companies.map(company => ({
    text: company.name,
    value: company.id,
  })),
)

fetchCompanyData()

const employeeData = ref([])

const getCompanyEmployees = async () => {
  // Prepare formData with the selected values
  const formData = {
    company_id: selectedCompany.value,
  }

  try {
    // Make the POST request to fetch payroll data
    const response = await $api('/employees/by-company', {
      method: 'POST',
      body: formData,
    })

    employeeData.value = response.employees.map(employee => ({
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
    }))

    console.log(response)
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
}

const formData = computed(() => ({
  salaries: employeeData.value.map(employee => ({
    employee_id: employee.id,
    salary: employee.salary,
    month: selectedMonth.value,
    year: selectedYear.value,
  })),
}))

const onSubmit = () => {
  const data = formData.value

  // Send a PATCH request to the API
  $api('/employees/update-salaries', {
    method: 'PATCH',
    body: data,
  })
    .then(response => {
      console.log('Data sent successfully:', response)
      alertMessage.value = 'Salary updated successfully!'
      alertColor.value = 'success'
      showAlert.value = true

      setTimeout(() => {
        getCompanyEmployees()
      }, 1500)
    })
    .catch(error => {
      if (error.response && error.response.errors) {
        const errors = error.response.errors

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
  <section>
    <VCard class="mb-6">
      <!-- 👉 Widgets  -->
      <VCardText>
        <VRow>
          <!-- 👉 Select Status -->
          <VCol
            cols="12"
            md="5"
          >
            <AppAutocomplete
              v-model="selectedCompany"
              :items="companiesList"
              item-title="text"
              item-value="value"
              placeholder="Select Company"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <VCol
            cols="12"
            sm="2"
          >
            <AppSelect
              v-model="selectedMonth"
              placeholder="Select Month"
              :items="monthsList"
              item-title="text"
              item-value="value"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <VCol
            cols="12"
            sm="2"
          >
            <AppSelect
              v-model="selectedYear"
              placeholder="Select Year"
              :items="yearsList"
              item-title="text"
              item-value="value"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <VCol
            cols="12"
            sm="3"
          >
            <VBtn
              prepend-icon="tabler-checkmark"
              @click="getCompanyEmployees"
            >
              Fetch Data
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VAlert
      v-if="showAlert"
      :type="alertColor"
      closable
      title="Status"
      @click:close="showAlert = false"
    >
      {{ alertMessage }}
    </VAlert>

    <VCard class="mb-6">
      <VCardText class="d-flex flex-wrap gap-4">
        <VCol
          cols="12"
          md="12"
        >
          <h6>Company Employees</h6>
          <VRow
            v-for="(employee, index) in employeeData"
            :key="employee.value"
          >
            <VCol
              cols="12"
              md="2"
            >
              <AppTextField
                v-model="employee.first_name"
                placeholder="First Name"
                :disabled="true"
              />
            </VCol>
            <VCol
              cols="12"
              md="2"
            >
              <AppTextField
                v-model="employee.last_name"
                placeholder="Price"
                :disabled="true"
              />
            </VCol>
            <VCol
              cols="12"
              md="2"
            >
              <AppTextField
                v-model="employee.department"
                placeholder="Department"
                :disabled="true"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
            >
              <AppTextField
                v-model="employee.position"
                placeholder="Position"
                :disabled="true"
              />
            </VCol>
            <VCol
              cols="12"
              md="2"
            >
              <AppTextField
                v-model="employee.salary"
                placeholder="Position"
              />
            </VCol>
          </VRow>

          <VDivider class="my-2" />

          <VBtn
            variant="tonal"
            color="primary"
            @click.prevent="onSubmit"
          >
            Update Salary
          </VBtn>
        </VCol>
      </VCardText>
    </VCard>
  </section>
</template>
