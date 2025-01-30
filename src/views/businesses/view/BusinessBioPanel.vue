<script setup lang="ts">
const props = defineProps<Props>()
interface Props {
  businessData: Business
}

const companyData = {
  id: props.businessData.id,
  name: props.businessData.name,
}
</script>

<template>
  <VRow>
    <!-- SECTION Customer Details -->
    <VCol cols="12">
      <VCard v-if="props.businessData">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            :color="!props.businessData ? 'primary' : undefined"
            :variant="!props.businessData.logo ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.businessData.logo"
              :src="props.businessData.logo"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(businessData.name) }}
            </span>
          </VAvatar>

          <!-- 👉 Customer fullName -->
          <h5 class="text-h5 mt-4">
            {{ businessData.name }}
          </h5>
          <div class="text-body-1">
            Business No #{{ props.businessData.business_no	 }}
          </div>

          <div class="d-flex mt-6">
            <div class="d-flex align-center">
              <VAvatar
                variant="tonal"
                color="success"
                rounded
                class="me-4"
              >
                <VIcon icon="tabler-currency-dollar" />
              </VAvatar>
              <div class="d-flex flex-column align-start">
                <h5 class="text-h5">
                  {{ props.businessData.total_paid_amount }}
                </h5>
                <div class="text-body-1">
                  Paid
                </div>
              </div>
            </div>
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
                  {{ props.businessData.total_outstanding_amount }}
                </h5>
                <div class="text-body-1">
                  Due
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex align-center">
            <VAvatar
              variant="tonal"
              color="info"
              rounded
              class="me-3"
            >
              <VIcon icon="tabler-currency-dollar" />
            </VAvatar>
            <div class="d-flex flex-column align-start">
              <h5 class="text-h5">
                {{ props.businessData.total_fee_note_amount }}
              </h5>
              <div class="text-body-1">
                Total
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
                Business name:
                <span class="text-body-1 d-inline-block">
                  {{ props.businessData.name }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Business No.:
                <span class="text-body-1 d-inline-block">
                  {{ props.businessData.business_no	 }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Email:
                <span class="text-body-1 d-inline-block">
                  {{ props.businessData.business_email }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Contact:
                <span class="text-body-1 d-inline-block">
                  {{ props.businessData.business_phone }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Reg Date:
                <span class="text-body-1 d-inline-block">
                  {{ new Date(props.businessData.registration_date).toLocaleDateString('en-KE') }}
                </span>
              </h6>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <VCol cols="12">
      <VCard v-if="props.businessData">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            :color="!props.businessData ? 'primary' : undefined"
            :variant="!props.businessData.logo ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.businessData.logo"
              :src="props.businessData.logo"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.businessData.client.user.first_name) }} {{ avatarText(props.businessData.client.user.last_name) }}
            </span>
          </VAvatar>

          <!-- 👉 Customer fullName -->
          <h5 class="text-h5 mt-4">
            {{ props.businessData.client.user.first_name }} {{ props.businessData.client.user.last_name }}
          </h5>
          <div class="text-body-1">
            Owner ID #{{ props.businessData.client.id_no }}
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
                Owner:
                <span class="text-body-1 d-inline-block">
                  {{ props.businessData.client.user.first_name }} {{ props.businessData.client.user.last_name }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                KRA:
                <span class="text-body-1 d-inline-block">
                  {{ props.businessData.client.kra_pin }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Email:
                <span class="text-body-1 d-inline-block">
                  {{ props.businessData.client.user.email }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Contact:
                <span class="text-body-1 d-inline-block">
                  {{ props.businessData.client.user.phone }}
                </span>
              </h6>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
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
