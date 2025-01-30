<script setup lang="ts">
definePage({
  meta: {
    action: 'view',
    subject: 'company',
  },
})

import CustomerTabSecurity from '@/views/clients/view/CustomerTabSecurity.vue'
import CompanyBioPanel from '@/views/companies/view/CompanyBioPanel.vue'
import CompanyTabOverview from '@/views/companies/view/CompanyTabOverview.vue'

const route = useRoute('companies-view-id')

const companyData = ref<Company | null>(null)
const userTab = ref(null)

const tabs = [
  { title: 'Overview', icon: 'tabler-user' },
]

const { data } = await useApi<Company>(`/companies/${route.params.id}`)

if (data.value) {
  companyData.value = {
    ...data.value.company,
    directors: (data.value.directors ?? []).map(director => ({
      id: director.id,
      name: `${director.client.user.first_name} ${director.client.user.middle_name || ''} ${director.client.user.last_name}`.trim(),
      phone: director.client.user.phone,
      email: director.client.user.email,
    })),
    owner: data.value.company.client,
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
          Company ID #{{ companyData?.phone }}
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
          Delete Company
        </VBtn>
      </div>
    </div>

    <!-- 👉 Customer Profile  -->
    <VRow v-if="companyData">
      <VCol
        v-if="companyData"
        cols="12"
        md="5"
        lg="4"
      >
        <CompanyBioPanel :company-data="companyData" />
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
            <CompanyTabOverview :feenotes="companyData?.feenotes" />
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
