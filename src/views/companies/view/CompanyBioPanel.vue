<script setup lang="ts">
const props = defineProps<Props>()
interface Props {
  companyData: Company
}

const companyData = {
  id: props.companyData.id,
  name: props.companyData.name,
}
</script>

<template>
  <VRow>
    <!-- SECTION Customer Details -->
    <VCol cols="12">
      <VCard v-if="props.companyData">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            :color="!props.companyData ? 'primary' : undefined"
            :variant="!props.companyData.logo ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.companyData.logo"
              :src="props.companyData.logo"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(companyData.name) }}
            </span>
          </VAvatar>

          <!-- 👉 Customer fullName -->
          <h5 class="text-h5 mt-4">
            {{ companyData.name }}
          </h5>
          <div class="text-body-1">
            Client ID #{{ props.companyData.id_no }}
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
                  {{ props.companyData.total_paid_amount }}
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
                  {{ props.companyData.total_outstanding_amount }}
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
                {{ props.companyData.total_fee_note_amount }}
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
                Company name:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.name }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                KRA:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.kra_pin }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Email:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.email }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Contact:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.phone }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Registration No:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.reg_number }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Reg Date:
                <span class="text-body-1 d-inline-block">
                  {{ new Date(props.companyData.reg_date).toLocaleDateString('en-KE') }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Employees:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.employees }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Address:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.address }}
                </span>
              </h6>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <VCol cols="12">
      <VCard v-if="props.companyData">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            :color="!props.companyData ? 'primary' : undefined"
            :variant="!props.companyData.logo ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.companyData.logo"
              :src="props.companyData.logo"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.companyData.client.user.first_name) }} {{ avatarText(props.companyData.client.user.last_name) }}
            </span>
          </VAvatar>

          <!-- 👉 Customer fullName -->
          <h5 class="text-h5 mt-4">
            {{ props.companyData.client.user.first_name }} {{ props.companyData.client.user.last_name }}
          </h5>
          <div class="text-body-1">
            Owner ID #{{ props.companyData.client.id_no }}
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
                  {{ props.companyData.client.user.first_name }} {{ props.companyData.client.user.last_name }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                KRA:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.client.kra_pin }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Email:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.client.user.email }}
                </span>
              </h6>
            </VListItem>

            <VListItem>
              <h6 class="text-h6">
                Contact:
                <span class="text-body-1 d-inline-block">
                  {{ props.companyData.client.user.phone }}
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
