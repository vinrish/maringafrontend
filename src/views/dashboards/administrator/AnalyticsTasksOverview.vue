<script setup lang="ts">
const props = defineProps({
  tasksOverview: {
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
          Tasks Overview
        </div>
        <div class="text-success font-weight-medium">
          +{{ tasksOverview.completed_percentage }}%
        </div>
      </div>
      <h4 class="text-h4">
        {{ tasksOverview.total_tasks }}
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
              <span>Complete</span>
            </div>
            <h5 class="text-h5">
              {{ tasksOverview.completed_percentage }}%
            </h5>
            <div class="text-body-2 text-disabled">
              {{ tasksOverview.completed_tasks }}
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
              <span class="me-2">Due</span>
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
              {{ tasksOverview.due_percentage }}%
            </h5>
            <div class="text-body-2 text-disabled">
              {{ tasksOverview.due_tasks }}
            </div>
          </div>
        </VCol>
      </VRow>

      <div class="mt-6">
        <VProgressLinear
          :model-value="tasksOverview.completed_percentage"
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
