<script setup lang="ts">
import type { Customer } from '@/views/clients/types'
import rocketImg from '@images/eCommerce/rocket.png'

const props = defineProps<Props>()
interface Props {
  customerData: Customer
}

const customerData = {
  id: props.customerData.id,
  fullName: `${props.customerData.user.first_name} ${props.customerData.user.last_name}`,
  firstName: props.customerData.user.first_name,
  lastName: props.customerData.user.last_name,
  company: '',
  role: '',
  username: props.customerData.user.email,
  country: props.customerData.country,
  contact: props.customerData.user.phone,
  email: props.customerData.user.email,
  currentPlan: '',
  status: props.customerData.user.status,
  avatar: props.customerData.user.avatar || '',
  taskDone: null,
  projectDone: null,
  taxId: 'Tax-8894',
  language: 'English',
}

const statusText = computed(() => {
  return customerData.status === 1 ? 'Active' : 'Inactive'
})
</script>

<template>
  <VRow>
    <!-- SECTION Customer Details -->
    <VCol cols="12">
      <VCard v-if="props.customerData">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            :color="!props.customerData ? 'primary' : undefined"
            :variant="!props.customerData.user.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.customerData.user.avatar"
              :src="props.customerData.user.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(customerData.fullName) }}
            </span>
          </VAvatar>

          <!-- 👉 Customer fullName -->
          <h5 class="text-h5 mt-4">
            {{ customerData.fullName }}
          </h5>
          <div class="text-body-1">
            Client ID #{{ props.customerData.id_no }}
          </div>

          <div class="d-flex mt-6">
            <div class="d-flex align-center">
              <VAvatar
                variant="tonal"
                color="error"
                rounded
                class="me-3"
              >
                <VIcon icon="tabler-currency-dollar" />
              </VAvatar>
              <div class="d-flex flex-column align-start">
                <h5 class="text-h5">
                  KSH {{ props.customerData.total_outstanding_amount }}
                </h5>
                <div class="text-body-1">
                  Due
                </div>
              </div>
            </div>
          </div>
        </VCardText>

        <!-- 👉 Customer Details -->
        <VCardText>
          <h5 class="text-h5">
            Details
          </h5>

          <VDivider class="my-4" />

          <VList class="card-list mt-2">
            <VListItem>
              <h6 class="text-h6">
                Name:
                <span class="text-body-1 d-inline-block">
                  {{ props.customerData.user.first_name }} {{ props.customerData.user.last_name }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Email:
                <span class="text-body-1 d-inline-block">
                  {{ props.customerData.user.email }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <div class="d-flex gap-x-2 align-center">
                <h6 class="text-h6">
                  Status:
                </h6>
                <VChip
                  label
                  :color="customerData.status === 1 ? 'success' : 'warning'"
                  size="small"
                >
                  {{ statusText }}
                </VChip>
              </div>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Contact:
                <span class="text-body-1 d-inline-block">
                  {{ props.customerData.user.phone }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Country:
                <span class="text-body-1 d-inline-block">
                  {{ props.customerData.country }}
                </span>
              </h6>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.current-plan {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)) 0%, #9e95f5 100%);
  color: #fff;
}
</style>
