<script setup lang="ts">
import CustomerCompanyTable from '@/views/clients/view/CustomerCompanyTable.vue'
import CustomerBusinessTable from '@/views/clients/view/CustomerBusinessTable.vue'
import CustomerObligationTable from '@/views/clients/view/CustomerObligationTable.vue'
import CustomerFeeNoteTable from '@/views/clients/view/CustomerFeeNoteTable.vue'

interface Company {
  id: number
  name: string
  phone: string
  reg_date: string
  reg_number: string
}

interface Business {
  id: number
  name: string
  phone: string
  reg_date: string
  reg_number: string
}

interface Obligation {
  id: number
  name: string
  start_date: any
  next_run: any
  amount: number
}

interface FeeNote {
  id: number
  name: string
  amount: number
  status: string
  created_at: string
}

const props = defineProps<{
  companies: Company[] | null
  businesses: Business[] | null
  obligations: Obligation[] | null
  feenotes: FeeNote[] | null
}>()
</script>

<template>
  <VCol>
    <CustomerCompanyTable :companies="companies ?? []" />
  </VCol>

  <VCol>
    <CustomerBusinessTable :businesses="businesses ?? []" />
  </VCol>

  <VCol>
    <CustomerObligationTable :obligations="obligations ?? []" />
  </VCol>

  <VCol>
    <CustomerFeeNoteTable :feenotes="feenotes ?? []" />
  </VCol>
</template>
