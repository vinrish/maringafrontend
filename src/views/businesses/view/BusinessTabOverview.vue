<script setup lang="ts">
import BusinessDirectorTable from '@/views/businesses/view/BusinessDirectorTable.vue'
import BusinessFeeNoteTable from '@/views/businesses/view/BusinessFeeNoteTable.vue'

interface Director {
  id: number
  name: string
  phone: string
  email: string
}

interface FeeNote {
  id: number
  name: string
  amount: number
  status: string
  created_at: string
}

const props = defineProps< {
  feenotes: FeeNote[] | null
}>()
</script>

<template>
  <VCol>
    <BusinessDirectorTable />
  </VCol>

  <VCol>
    <BusinessFeeNoteTable :feenotes="feenotes ?? []" />
  </VCol>
</template>
