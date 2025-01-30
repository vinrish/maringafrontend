<script setup lang="ts">
import CompanyDirectorTable from '@/views/companies/view/CompanyDirectorTable.vue'
import CompanyFeeNoteTable from '@/views/companies/view/CompanyFeeNoteTable.vue'

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
    <CompanyDirectorTable />
  </VCol>

  <VCol>
    <CompanyFeeNoteTable :feenotes="feenotes ?? []" />
  </VCol>
</template>
