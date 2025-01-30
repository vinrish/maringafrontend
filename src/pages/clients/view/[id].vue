<script setup lang="ts">
import CustomerBioPanel from '@/views/clients/view/CustomerBioPanel.vue'
import type { ApiResponse, ExtendedCustomer } from '@/views/clients/types'
import CustomerTabSecurity from '@/views/clients/view/CustomerTabSecurity.vue'
import CustomerTabOverview from '@/views/clients/view/CustomerTabOverview.vue'

const route = useRoute('clients-view-id')
const customerData = ref<ExtendedCustomer>()

// const customerData = ref<Customer | null>(null)
const userTab = ref(null)

const tabs = [
  { title: 'Overview', icon: 'tabler-user' },
  { title: 'Security', icon: 'tabler-lock' },
  { title: 'Notifications', icon: 'tabler-bell' },
]

const { data } = await useApi<ApiResponse>(`/clients/${route.params.id}`)

if (data.value) {
  const companiesArray = Object.values(data.value.companies ?? {})

  customerData.value = {
    ...data.value.client,
    companies: companiesArray.filter(company => company !== null),
    businesses: (data.value.businesses ?? []).filter(business => business !== null),
    total_paid_amount: data.value.total_paid_amount,
    total_fee_note_amount: data.value.total_fee_note_amount,
    total_outstanding_amount: data.value.total_outstanding_amount,
  }
}
</script>

<template>
  <div>
    <!-- 👉 Header  -->
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <h4 class="text-h4 mb-1">
          Client ID #{{ customerData?.id_no }}
        </h4>
        <div class="text-body-1">
          Aug 17, 2020, 5:48 (ET)
        </div>
      </div>
      <div class="d-flex gap-4">
        <VBtn
          variant="tonal"
          color="error"
        >
          Delete Client
        </VBtn>
      </div>
    </div>

    <!-- 👉 Customer Profile  -->
    <VRow v-if="customerData">
      <VCol
        v-if="customerData"
        cols="12"
        md="5"
        lg="4"
      >
        <CustomerBioPanel :customer-data="customerData" />
      </VCol>
      <VCol
        cols="12"
        md="7"
        lg="8"
      >
        <VTabs
          v-model="userTab"
          class="v-tabs-pill mb-3 disable-tab-transition"
        >
          <VTab
            v-for="tab in tabs"
            :key="tab.title"
          >
            <VIcon
              size="20"
              start
              :icon="tab.icon"
            />
            {{ tab.title }}
          </VTab>
        </VTabs>
        <VWindow
          v-model="userTab"
          class="disable-tab-transition"
          :touch="false"
        >
          <VWindowItem>
            <CustomerTabOverview
              :companies="customerData?.companies"
              :businesses="customerData?.businesses"
              :obligations="customerData?.obligations"
              :feenotes="customerData?.feenotes"
            />
          </VWindowItem>
          <VWindowItem>
            <CustomerTabSecurity />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
    <div v-else>
      <VAlert
        type="error"
        variant="tonal"
      >
        Client with ID  {{ route.params.id }} not found!
      </VAlert>
    </div>
  </div>
</template>
