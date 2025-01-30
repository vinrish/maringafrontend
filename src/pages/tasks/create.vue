<script setup lang="ts">

</script>

<template>
  <div>
    <VAlert
      v-if="showAlert"
      :type="alertColor"
      closable
      title="Status"
      @click:close="showAlert = false"
    >
      {{ alertMessage }}
    </VAlert>

    <VRow>
      <VCol md="12">
        <!-- 👉 Product Information -->
        <VCard
          class="mb-6"
          title="Task Information"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  label="Task Name"
                  placeholder="Name"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  item-title="text"
                  item-value="value"
                  label="Select Client"
                  placeholder="Select Client"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppDateTimePicker
                  label="Task Start Date"
                  placeholder="Select date"
                  :config="{ dateFormat: 'F j, Y' }"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppDateTimePicker
                  label="Task End Date"
                  placeholder="Select date"
                  :config="{ dateFormat: 'F j, Y' }"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  item-title="text"
                  item-value="value"
                  label="Select Services"
                  placeholder="Select Services"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete
                  label="Employees"
                  item-title="text"
                  item-value="value"
                  placeholder="Select Employee"
                  chips
                  multiple
                  closable-chips
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  label="Total Fee"
                  placeholder="0.00"
                  :disabled="true"
                />
              </VCol>

              <VDivider class="my-2" />

              <VBtn
                variant="tonal"
                color="primary"
              >
                Save Task
              </VBtn>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
