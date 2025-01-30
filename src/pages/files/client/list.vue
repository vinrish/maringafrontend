<script setup lang="ts">
const { data: folderData, execute: fetchClientFolders } = await useApi<any>(createUrl('/client-folders'))

const clientFolders = computed(() => folderData.value.client_folders)

fetchClientFolders()
</script>

<template>
  <section>
    <VRow>
      <VCol
        v-for="folder in clientFolders"
        cols="8"
        md="2"
      >
        <VCard
          class="mb-6"
          :to="{ name: 'files-client-view-id', params: { id: folder.id } }"
        >
          <VCardItem class="pb-4 justify-center">
            <VCardTitle>{{ folder.folder_name }}</VCardTitle>
          </VCardItem>

          <VCardText class="d-flex justify-center">
            <VIcon
              color="warning"
              icon="tabler-folder-open"
              size="48"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>
