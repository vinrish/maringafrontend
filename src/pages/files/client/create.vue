<script setup lang="ts">
const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('error')
const isSnackbarScrollReverseVisible = ref(false)
const snackbarMessage = ref('')

// const folders = reactive([]) // Stores folder data
const selectedFolder = ref(null)

const fileName = ref('')
const selectedFile = ref<File | null>(null)

const { data: folderData, execute: fetchFolders } = await useApi<any>(createUrl('/client-folders'))

const foldersList = computed(() =>
  folderData.value.client_folders.map(folder => ({
    text: folder.folder_name,
    value: folder.client_id,
  })),
)

fetchFolders()

const uploadFile = async () => {
  // Validate inputs
  if (!selectedFolder.value || !selectedFile.value || !fileName.value) {
    alertMessage.value = 'Please select a folder, file, and provide a name'
    showAlert.value = true

    return
  }

  const formData = new FormData()

  // Append the file and file_name
  // if (selectedFile.value instanceof File) {
  formData.append('file', selectedFile.value)
  formData.append('file_name', fileName.value)

  // }
  // else {
  //   alertMessage.value = 'Selected file is invalid'
  //   showAlert.value = true
  //
  //   return
  // }

  // Make the API request
  try {
    $api(`/client-folders/${selectedFolder.value}/upload`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (response.message) {
        snackbarMessage.value = response.message
        isSnackbarScrollReverseVisible.value = true
        fetchFolders()
      }
      else {
        throw new Error('File upload failed')
      }
    })
  }
  catch (error) {
    alertMessage.value = error.message || 'An error occurred while uploading the file'
    showAlert.value = true
  }
}
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

    <VSnackbar
      v-model="isSnackbarScrollReverseVisible"
      transition="scroll-y-reverse-transition"
      location="top end"
    >
      {{ snackbarMessage }}
    </VSnackbar>
    <VRow>
      <VCol md="12">
        <!-- 👉 Product Information -->
        <VCard
          class="mb-6"
          title="File Information"
        >
          <VCardText>
            <VRow>
              <!--              <VCol -->
              <!--                cols="12" -->
              <!--                md="4" -->
              <!--              > -->
              <!--                <AppTextField -->
              <!--                  v-model="fileName" -->
              <!--                  label="File Name" -->
              <!--                  placeholder="Name" -->
              <!--                  :rules="[requiredValidator]" -->
              <!--                /> -->
              <!--              </VCol> -->

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="selectedFolder"
                  :items="foldersList"
                  item-title="text"
                  item-value="value"
                  label="Select Folder"
                  placeholder="Select Folder"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  item-title="text"
                  item-value="value"
                  label="Select Folder"
                  placeholder="Select Folder"
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <VCard class="mb-6">
                  <VCardItem>
                    <template #title>
                      File
                    </template>
                    <template #append>
                      <span class="text-primary font-weight-medium text-sm cursor-pointer">Add Media from URL</span>
                    </template>
                  </VCardItem>

                  <VCardText>
                    <DropZone
                      v-model="selectedFile"
                      @update:model-value="(file) => { fileName = file?.name || '' }"
                    />
                  </VCardText>
                </VCard>
              </VCol>

              <VDivider class="my-2" />

              <VBtn
                variant="tonal"
                color="primary"
                @click="uploadFile"
              >
                Upload File
              </VBtn>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
