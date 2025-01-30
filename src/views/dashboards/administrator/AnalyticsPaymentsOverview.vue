<script setup lang="ts">
const props = defineProps({
  paymentsOverview: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex align-center justify-space-between">
        <div class="text-body-1">
          Payments Overview
        </div>
        <div class="text-success font-weight-medium">
          +{{ paymentsOverview.paid_percentage }}%
        </div>
      </div>
      <h4 class="text-h4">
        {{ paymentsOverview.total_needed }}
      </h4>
    </VCardText>

    <VCardText>
      <VRow no-gutters>
        <VCol cols="5">
          <div class="py-2">
            <div class="d-flex align-center mb-3">
              <VAvatar
                color="info"
                variant="tonal"
                :size="24"
                rounded
                class="me-2"
              >
                <VIcon
                  size="18"
                  icon="tabler-shopping-cart"
                />
              </VAvatar>
              <span>Paid</span>
            </div>
            <h5 class="text-h5">
              {{ paymentsOverview.paid_percentage }}%
            </h5>
            <div class="text-body-2 text-disabled">
              {{ paymentsOverview.total_paid }}
            </div>
          </div>
        </VCol>

        <VCol cols="2">
          <div class="d-flex flex-column align-center justify-center h-100">
            <VDivider
              vertical
              class="mx-auto"
            />

            <VAvatar
              size="24"
              color="rgba(var(--v-theme-on-surface), var(--v-hover-opacity))"
              class="my-2"
            >
              <div class="text-overline text-disabled">
                VS
              </div>
            </VAvatar>

            <VDivider
              vertical
              class="mx-auto"
            />
          </div>
        </VCol>

        <VCol
          cols="5"
          class="text-end"
        >
          <div class="py-2">
            <div class="d-flex align-center justify-end mb-3">
              <span class="me-2">UnPaid</span>
              <VAvatar
                color="primary"
                variant="tonal"
                :size="24"
                rounded
              >
                <VIcon
                  size="18"
                  icon="tabler-link"
                />
              </VAvatar>
            </div>
            <h5 class="text-h5">
              {{ paymentsOverview.unpaid_percentage }}%
            </h5>
            <div class="text-body-2 text-disabled">
              {{ paymentsOverview.total_unpaid }}
            </div>
          </div>
        </VCol>
      </VRow>

      <div class="mt-6">
        <VProgressLinear
          :model-value="paymentsOverview.paid_percentage"
          color="#00CFE8"
          height="10"
          bg-color="primary"
          :rounded-bar="false"
          rounded
        />
      </div>
    </VCardText>
  </VCard>
</template>
