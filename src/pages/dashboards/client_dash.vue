<script setup lang="ts">
import CustomerBioPanel from '@/views/dashboards/client/CustomerBioPanel.vue'
import type { ApiResponse, ExtendedCustomer } from '@/views/clients/types'
import CustomerTabOverview from '@/views/dashboards/client/CustomerTabOverview.vue'
import CustomerCompanyTable from '@/views/dashboards/client/CustomerCompanyTable.vue'
import CustomerTabSecurity from '@/views/dashboards/client/CustomerTabSecurity.vue'
import CustomerBusinessTable from '@/views/clients/view/CustomerBusinessTable.vue'

definePage({
  meta: {
    action: 'view',
    subject: 'client_dash',
  },
})

// const route = useRoute('apps-ecommerce-customer-details-id')
const customerData = ref<ExtendedCustomer>()
const companies = ref([])
const businesses = ref([])
const userTab = ref(null)

const tabs = [
  { title: 'Overview', icon: 'tabler-user' },
  { title: 'Security', icon: 'tabler-lock' },
  { title: 'Address & Billing', icon: 'tabler-map-pin' },
  { title: 'Notifications', icon: 'tabler-bell' },
]

const { data } = await useApi<ApiResponse>('client-dashboard')

if (data.value) {
  customerData.value = {
    ...data.value.client,
    total_outstanding_amount: data.value.total_outstanding_amount,
    companies: data.value.company_details,
  }
  companies.value = data.value.company_details
  businesses.value = data.value.businesses
}

console.log(customerData.value)
</script>

<template>
  <div>
    <!-- 👉 Header  -->
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <h4 class="text-h4 mb-1">
          Customer ID #{{ customerData?.id_no }}
        </h4>
        <div class="text-body-1">
          Aug 17, 2020, 5:48 (ET)
        </div>
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
            <CustomerTabOverview />
          </VWindowItem>
          <VWindowItem>
            <CustomerTabSecurity />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>

    <VRow v-if="customerData">
      <VCol>
        <CustomerCompanyTable :companies="companies ?? []" />
      </VCol>

      <VCol>
        <CustomerBusinessTable :businesses="businesses ?? []" />
      </VCol>
    </VRow>
  </div>
</template>
