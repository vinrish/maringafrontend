<script setup lang="ts">
interface FeeNote {
  id: number
  name: string
  amount: number
  status: string
  created_at: string
}

const props = defineProps<{ feenotes: FeeNote[] }>()
const feenotes = computed(() => props.feenotes || [])

const searchQuery = ref('')

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
  { title: 'Task Name', key: 'name' },
  { title: 'Amount', key: 'amount' },
  { title: 'Task Status', key: 'status' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filteredFeeNotes = computed(() =>
  feenotes.value.filter(feenote =>
    feenote.task.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    feenote.status.toLowerCase().includes(searchQuery.value.toLowerCase())
  ),
)
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-space-between flex-wrap align-center gap-4">
        <h5 class="text-h5">
          FeeNotes
        </h5>
        <div>
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Fee Note"
            style=" max-inline-size: 200px; min-inline-size: 200px;"
          />
        </div>
      </div>
    </VCardText>

    <VDivider />
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="filteredFeeNotes"
      item-value="id"
      :items-length="filteredFeeNotes.length"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- Name -->
      <template #item.name="{ item }">
        <div class="d-flex flex-column">
          <h6 class="text-sm-h6 text-base text-wrap">
            {{ item.task.name }}
          </h6>
        </div>
      </template>

      <template #item.amount="{ item }">
        <span>{{ item.amount | currency }}</span>
      </template>

      <template #item.status="{ item }">
        <span>{{ item.task.status === '0' ? 'Incomplete' : 'Complete' }}</span>
      </template>

      <template #item.created_at="{ item }">
        {{ new Date(item.created_at).toLocaleDateString('en-KE') }}
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
          :total-items="filteredFeeNotes.length"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>
