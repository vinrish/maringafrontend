<script setup lang="ts">
interface Director {
  id: number
  name: string
  phone: string
  email: string
}

const route = useRoute('businesses-view-id')
const businessId = ref(route.params.id)
const clientId = ref('')

const isDialogVisible = ref(false)

const searchQuery = ref('')

// const directors = ref<Director[]>([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Phone', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const { data: createData, execute: fetchCreateData } = await useApi<any>(createUrl('/directors/create'))

// const clientsList = computed((): Client[] => createData.value?.clients || [])
const clientsList = computed(() =>
  createData.value.clients.map(client => ({
    text: client.name,
    value: client.id,
  })),
)

const { data: directorData, execute: fetchDirectors } = await useApi<any>(createUrl('/directors', {
  query: {
    business_id: businessId.value,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const directors = computed((): Director[] => {
  return directorData.value.directors.map(director => ({
    ...director,
    name: `${director.client.user.first_name} ${director.client.user.middle_name} ${director.client.user.last_name}`,
    phone: director.client.user.phone,
    email: director.client.user.email,
  }))
})

const totalDirectors = computed(() => directorData.value.total)

watch([businessId, searchQuery], fetchDirectors, { immediate: true })

fetchDirectors()

const saveDirector = async () => {
  if (!(businessId.value && clientId.value)) {
    alert('Please select both Business and Client.')
  }
  else {
    const submissionData = {
      business_id: businessId.value,
      client_id: clientId.value,
    }

    $api('/directors', {
      method: 'POST',
      body: submissionData,
    }).then(() => {
      isDialogVisible.value = false

      // Optionally refresh the directors list or show a success message
      alert('Director added successfully!')
      fetchDirectors()
    }).catch(error => {
      alert('Error occurred while saving directdirector.client')
    })
  }
}
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-space-between flex-wrap align-center gap-4">
        <h5 class="text-h5">
          Directors
        </h5>
        <div>
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Director"
            style=" max-inline-size: 200px; min-inline-size: 200px;"
          />
        </div>
        <div>
          <VDialog
            v-model="isDialogVisible"
            max-width="600"
          >
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                variant="outlined"
                color="primary"
                @click="fetchCreateData"
              >
                Add Director
              </VBtn>
            </template>
            <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
            <VCard title="Add Director">
              <VCardText>
                <VRow>
                  <VCol
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <AppSelect
                      v-model="businessId"
                      item-title="text"
                      item-value="value"
                      label="Select Business"
                      placeholder="Select Business"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <AppSelect
                      v-model="clientId"
                      :items="clientsList"
                      item-title="text"
                      item-value="value"
                      label="Select Client"
                      placeholder="Select Client"
                    />
                  </VCol>
                </VRow>
              </VCardText>

              <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="isDialogVisible = false"
                >
                  Close
                </VBtn>
                <VBtn @click="saveDirector">
                  Save
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
        </div>
      </div>
    </VCardText>

    <VDivider />
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="directors"
      item-value="id"
      :items-length="totalDirectors"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- Date -->
      <template #item.reg_date="{ item }">
        {{ new Date(item.reg_date).toDateString() }}
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-dots-vertical" />
          <VMenu activator="parent">
            <VList>
              <VListItem value="view">
                View
              </VListItem>
              <VListItem
                value="delete"
                @click="deleteOrder(item.id)"
              >
                Delete
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
          :total-items="totalDirectors"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>
