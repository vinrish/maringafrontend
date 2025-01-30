<script setup lang="ts">
definePage({
  meta: {
    action: 'view',
    subject: 'business',
  },
})
import BusinessTabOverview from '@/views/businesses/view/BusinessTabOverview.vue'
import BusinessBioPanel from '@/views/businesses/view/BusinessBioPanel.vue'

const route = useRoute('businesses-view-id')

const businessData = ref<Business | null>(null)
const userTab = ref(null)

const tabs = [
  { title: 'Overview', icon: 'tabler-user' },
]

const { data } = await useApi<Business>(`/businesses/${route.params.id}`)

if (data.value) {
  businessData.value = {
    ...data.value.business,
    directors: (data.value.directors ?? []).map(director => ({
      id: director.id,
      name: `${director.client.user.first_name} ${director.client.user.middle_name || ''} ${director.client.user.last_name}`.trim(),
      phone: director.client.user.phone,
      email: director.client.user.email,
    })),
    owner: data.value.business.client,
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
          Business ID #{{ businessData?.phone }}
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
          Delete Business
        </VBtn>
      </div>
    </div>

    <!-- 👉 Customer Profile  -->
    <VRow v-if="businessData">
      <VCol
        v-if="businessData"
        cols="12"
        md="5"
        lg="4"
      >
        <BusinessBioPanel :business-data="businessData" />
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
            <BusinessTabOverview :feenotes="businessData?.feenotes" />
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
