<script setup lang="ts">

// 👉 Store
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedRows = ref([])
const assignDialog = ref(false)
const employeesList = ref([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const { data: taskData, execute: fetchTasks } = await useApi<any>(createUrl('/tasks', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const tasks = computed((): Task[] => {
  return taskData.value.tasks.map(task => ({
    ...task,
    assigned: task.employees.map(emp => `${emp.user.first_name} ${emp.user.last_name}`).join(', ') || 'Unassigned',
  }))
})

const totalTasks = computed(() => taskData.value.total)

// Call the fetch function on component mount
fetchTasks()

// onMounted(fetchTasks)
watch([selectedStatus, searchQuery, itemsPerPage, page, sortBy, orderBy], fetchTasks)

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Headers
const headers = [
  { title: 'Task Name', key: 'name' },
  { title: 'Status', key: 'status_label' },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Assigned To', key: 'assigned' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const status = [
  { title: 'Complete', value: 'complete' },
  { title: 'Due', value: 'due' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Upcoming', value: 'upcoming' },
  { title: 'All', value: '' },
]

const widgetData = ref([
  { title: 'Session', value: '21,459', change: 29, desc: 'Total Users', icon: 'tabler-users', iconColor: 'primary' },
  { title: 'Paid Users', value: '4,567', change: 18, desc: 'Last Week Analytics', icon: 'tabler-user-plus', iconColor: 'error' },
  { title: 'Active Users', value: '19,860', change: -14, desc: 'Last Week Analytics', icon: 'tabler-user-check', iconColor: 'success' },
  { title: 'Pending Users', value: '237', change: 42, desc: 'Last Week Analytics', icon: 'tabler-user-search', iconColor: 'warning' },
])

const completeSelectedTasks = async () => {
  if (selectedRows.value.length === 0) {
    alert('Please select at least one task to complete.')
    return
  }

  const selectedTaskIds = selectedRows.value

  try {
    // Send all tasks in one request
    await $api('/tasks/complete', {
      method: 'POST',
      body: JSON.stringify({ task_ids: selectedTaskIds }),
    })
    console.log(`Tasks ${selectedTaskIds.join(', ')} marked as complete`)
    await fetchTasks() // Refresh task list
  } catch (error) {
    console.error('Failed to complete tasks:', error)
  }
}

// const completeSelectedTasks = async () => {
//   console.log(selectedRows.value)
//   if (selectedRows.value.length === 0) {
//     alert('Please select at least one task to complete.')
//
//     return
//   }
//
//   const selectedTaskIds = selectedRows.value
//
//   // Loop through selected tasks and mark them as complete
//   for (const taskId of selectedTaskIds) {
//     try {
//       await $api('/tasks/complete', {
//         method: 'POST',
//         body: JSON.stringify({ task_ids: selectedTaskIds }),
//       })
//       console.log(`Task ${taskId} marked as complete`)
//       await fetchTasks()
//     }
//     catch (error) {
//       console.error(`Failed to complete task ${taskId}`, error)
//     }
//   }
// }

const editedItem = ref<Task | null>(null)
const editedIndex = ref(-1)

const formData = ref({
  employee_ids: [],
})

const fetchEmployees = async () => {
  try {
    const response = await $api('/tasks/create', { method: 'GET' })
    employeesList.value = response.employees.map(employee => ({
      value: employee.id,
      text: `${employee.first_name} ${employee.middle_name} ${employee.last_name}`,
    }))
  } catch (error) {
    console.error('Failed to fetch employees:', error)
  }
}

// Open the assign dialog and populate the form data
const assignItem = async (item: Task) => {
  await fetchEmployees()

  editedIndex.value = tasks.value.indexOf(item)
  editedItem.value = { ...item }
  formData.value.employee_ids = item.employees.map(emp => emp.id) // Pre-fill selected employees
  assignDialog.value = true
}

// Close the dialog
const close = () => {
  assignDialog.value = false
  editedIndex.value = -1
  formData.value.employee_ids = []
}

const save = async () => {
  if (!formData.value.employee_ids.length) {
    alert('Please select at least one employee.')

    return
  }

  try {
    const response = await $api(`/tasks/${editedItem.value.id}/reassign`, {
      method: 'PATCH',
      body: JSON.stringify({ employee_ids: formData.value.employee_ids }),
    })

    console.log('Task reassigned successfully:', response)
    await fetchTasks() // Refresh the task list
    close()
  }
  catch (error) {
    console.error('Failed to reassign task:', error)
  }
}
</script>

<template>
  <section>
    <!-- 👉 Widgets -->
    <div class="d-flex mb-6">
      <VRow>
        <template
          v-for="(data, id) in widgetData"
          :key="id"
        >
          <VCol
            cols="12"
            md="3"
            sm="6"
          >
            <VCard>
              <VCardText>
                <div class="d-flex justify-space-between">
                  <div class="d-flex flex-column gap-y-1">
                    <div class="text-body-1 text-high-emphasis">
                      {{ data.title }}
                    </div>
                    <div class="d-flex gap-x-2 align-center">
                      <h4 class="text-h4">
                        {{ data.value }}
                      </h4>
                      <div
                        class="text-base"
                        :class="data.change > 0 ? 'text-success' : 'text-error'"
                      >
                        ({{ prefixWithPlus(data.change) }}%)
                      </div>
                    </div>
                    <div class="text-sm">
                      {{ data.desc }}
                    </div>
                  </div>
                  <VAvatar
                    :color="data.iconColor"
                    variant="tonal"
                    rounded
                    size="42"
                  >
                    <VIcon
                      :icon="data.icon"
                      size="26"
                    />
                  </VAvatar>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </template>
      </VRow>
    </div>

    <VCard class="mb-6">
      <VCardItem class="pb-4">
        <VCardTitle>Filters</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <!-- 👉 Select Status -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStatus"
              placeholder="Select Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div>

        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search Task"
            />
          </div>

          <!-- 👉 Export button -->
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
          >
            Export
          </VBtn>

          <VBtn
            variant="tonal"
            color="success"
            prepend-icon="tabler-check"
            @click="completeSelectedTasks"
          >
            Complete
          </VBtn>

          <!-- 👉 Add user button -->
          <VBtn
            prepend-icon="tabler-plus"
            @click="isAddNewUserDrawerVisible = true"
          >
            Add Task
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :items="tasks"
        :items-length="totalTasks"
        :headers="headers"
        class="text-no-wrap"
        show-select
        @update:options="updateOptions"
      >
        <!-- Name -->
        <template #item.name="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-base">
              <RouterLink
                :to="{ name: 'tasks-list', params: { id: item.id } }"
                class="font-weight-medium text-link"
              >
                {{ item.name }}
              </RouterLink>
            </h6>
          </div>
        </template>

        <!-- Date -->
        <template #item.due_date="{ item }">
          {{ new Date(item.due_date).toDateString() }}
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            size="small"
            label
            class="text-capitalize"
          >
            {{ item.status }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="assignItem(item)">
            <VIcon icon="tabler-user" />
            <VTooltip
              location="top"
              activator="parent"
            >
              Reassign
            </VTooltip>
          </IconBtn>

          <IconBtn>
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <VBtn
            icon
            variant="text"
            color="medium-emphasis"
          >
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem :to="{ name: 'apps-user-view-id', params: { id: item.id } }">
                  <template #prepend>
                    <VIcon icon="tabler-eye" />
                  </template>

                  <VListItemTitle>View</VListItemTitle>
                </VListItem>

                <VListItem link>
                  <template #prepend>
                    <VIcon icon="tabler-pencil" />
                  </template>
                  <VListItemTitle>Edit</VListItemTitle>
                </VListItem>

                <VListItem @click="deleteTask(item.id)">
                  <template #prepend>
                    <VIcon icon="tabler-trash" />
                  </template>
                  <VListItemTitle>Delete</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalTasks"
          />
        </template>
      </VDataTableServer>

      <VDialog
        v-model="assignDialog"
        max-width="600px"
      >
        <VCard title="Reassign Task">
          <VCardText>
            <VCol cols="12">
              <AppAutocomplete
                v-model="formData.employee_ids"
                label="Assign to Employees"
                :items="employeesList"
                item-title="text"
                item-value="value"
                placeholder="Select Employees"
                chips
                multiple
                closable-chips
              />
            </VCol>
          </VCardText>

          <VCardText>
            <div class="d-flex gap-4 justify-end">
              <VBtn
                color="error"
                variant="outlined"
                @click="close"
              >
                Cancel
              </VBtn>
              <VBtn
                color="success"
                variant="elevated"
                @click="save"
              >
                Save
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VDialog>
    </VCard>
  </section>
</template>
