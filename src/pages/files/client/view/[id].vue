<script setup lang="ts">
const route = useRoute('files-client-view-id')
const currentFolder = ref(null)
const folderHistory = ref<number[]>([])

const folderContents = ref({
  subfolders: [],
  files: [],
})

const selectedFile = ref(null)

const fetchFolderContents = async (folderId: number) => {
  const { data } = await useApi<any>(`/client-folders/${folderId}/content`)

  currentFolder.value = data.value.folder
  folderContents.value = {
    subfolders: data.value.subfolders,
    files: data.value.files,
  }

  folderHistory.value.push(folderId)
}

const filePreviewUrl = computed(() =>
  selectedFile.value && currentFolder.value
    ? `${import.meta.env.VITE_FILE_BASE_URL}/storage/client_files/${currentFolder.value.path}/${selectedFile.value}`
    : '',
)

const previewFile = (fileName: string) => {
  selectedFile.value = fileName
}

const closePreview = () => {
  selectedFile.value = null
}

const goBack = () => {
  if (folderHistory.value.length > 1) {
    // Pop the current folder and load the previous one in the stack
    folderHistory.value.pop()

    const previousFolderId = folderHistory.value[folderHistory.value.length - 1]

    fetchFolderContents(previousFolderId)
  }
}

fetchFolderContents(route.params.id)

// const goBack = () => {
//   if (currentFolder.value && currentFolder.value.parent_folder_id)
//     fetchFolderContents(currentFolder.value.parent_folder_id)
// }
</script>

<template>
  <div>
    <!-- Breadcrumb or Folder Path -->
    <div
      v-if="currentFolder"
      class="mb-4"
    >
      <h3>{{ currentFolder.name }}</h3>
    </div>

    <div
      v-if="folderHistory.length > 1"
      class="mb-4"
    >
      <VBtn
        variant="outlined"
        color="warning"
        @click="goBack"
      >
        <VIcon
          start
          icon="tabler-arrow-left"
        /> Back
      </VBtn>
    </div>

    <!-- Folder and File Listing -->
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <h4>Folders</h4>
        <VRow>
          <VCol
            v-for="folder in folderContents.subfolders"
            :key="folder.id"
            cols="12"
            sm="6"
          >
            <VCard
              class="mb-4"
              @click="fetchFolderContents(folder.id)"
            >
              <VCardItem>
                <VCardTitle>{{ folder.name }}</VCardTitle>
              </VCardItem>
              <VCardActions>
                <VIcon
                  color="warning"
                  icon="tabler-folder-open"
                />
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCol>

      <!-- Files Column -->
      <VCol
        cols="12"
        md="6"
      >
        <h4>Files</h4>
        <VRow>
          <VCol
            v-for="file in folderContents.files"
            :key="file"
            cols="12"
            sm="6"
          >
            <VCard
              class="mb-4"
              @click="previewFile(file)"
            >
              <VCardItem>
                <VCardTitle>{{ file }}</VCardTitle>
              </VCardItem>
              <VCardActions>
                <VIcon
                  color="warning"
                  icon="tabler-file-invoice"
                />
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <!-- File Preview Modal -->
    <VDialog
      v-model="selectedFile"
      persistent
      max-width="800px"
    >
      <VCard>
        <VCardTitle class="headline">
          Previewing: {{ selectedFile }}
        </VCardTitle>
        <VCardActions>
          <VBtn
            color="primary"
            @click="closePreview"
          >
            Close
          </VBtn>
        </VCardActions>
        <VCardText>
          <iframe
            v-if="filePreviewUrl"
            :src="filePreviewUrl"
            width="100%"
            height="500px"
          />
          <div v-else>
            No preview available.
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}
</style>
