<script setup lang="ts">
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-2 flex-column">
          <VAvatar
            variant="tonal"
            color="primary"
            icon="tabler-currency-dollar"
            rounded
          />
          <h5 class="text-h5">
            Account Balance
          </h5>
          <div>
            <h5 class="text-h5 text-primary mb-1">
              $7480
              <span class="text-body-1 d-inline-block">Balance Left</span>
            </h5>
            <p class="mb-0">
              Account balance
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-2 flex-column">
          <VAvatar
            variant="tonal"
            color="success"
            icon="tabler-gift"
            rounded
          />
          <h5 class="text-h5">
            Invoices
          </h5>
          <div>
            <VChip
              color="success"
              class="mb-2"
              label
              size="small"
            >
              Invoices Not Paid
            </VChip>
            <p class="mb-0">
              20
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-2 flex-column">
          <VAvatar
            variant="tonal"
            color="warning"
            icon="tabler-star"
            rounded
          />
          <h5 class="text-h5">
            Tasks
          </h5>
          <div>
            <h5 class="text-h5 text-warning mb-1">
              15
              <span class="text-body-1 d-inline-block">Tasks</span>
            </h5>
            <p class="mb-0">
              Receive notification when tasks are complete
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-2 flex-column">
          <VAvatar
            variant="tonal"
            color="info"
            icon="tabler-discount"
            rounded
          />
          <h5 class="text-h5">
            Obligations
          </h5>
          <div>
            <h5 class="text-h5 text-info mb-1">
              21
              <span class="text-body-1 d-inline-block">Obligations added</span>
            </h5>
            <p class="mb-0">
              Your obligations
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
