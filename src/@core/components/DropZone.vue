<script setup lang="ts">
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Object as PropType<File | null>,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const dropZoneRef = ref<HTMLDivElement>()
interface FileData {
  file: File
  url: string
}

const fileData = ref<FileData[]>([])
const { open, onChange } = useFileDialog({ accept: 'image/*,application/pdf' })

function onDrop(DroppedFiles: File[] | null) {
  DroppedFiles?.forEach(file => {
    if (!['image/', 'application/pdf'].some(type => file.type.startsWith(type))) {
      alert('Only image and PDF files are allowed')

      return
    }

    const fileUrl = file.type.startsWith('image/') ? useObjectUrl(file).value ?? '' : ''

    fileData.value.push({ file, url: fileUrl })

    // Emit the selected file
    emit('update:modelValue', file)
  })
}

onChange((selectedFiles: FileList | null) => {
  if (!selectedFiles)
    return

  for (const file of selectedFiles) {
    if (!['image/', 'application/pdf'].some(type => file.type.startsWith(type))) {
      alert('Only image and PDF files are allowed')
      continue
    }

    const fileUrl = file.type.startsWith('image/') ? useObjectUrl(file).value ?? '' : ''

    fileData.value.push({ file, url: fileUrl })

    // Emit the selected file
    emit('update:modelValue', file)
  }
})

useDropZone(dropZoneRef, onDrop)
</script>

<template>
  <div class="flex">
    <div class="w-full h-auto relative">
      <div
        ref="dropZoneRef"
        class="cursor-pointer"
        @click="() => open()"
      >
        <div
          v-if="fileData.length === 0"
          class="d-flex flex-column justify-center align-center gap-y-2 pa-12 drop-zone rounded"
        >
          <IconBtn
            variant="tonal"
            class="rounded-sm"
          >
            <VIcon icon="tabler-upload" />
          </IconBtn>
          <h4 class="text-h4">
            Drag and drop your file here.
          </h4>
          <span class="text-disabled">or</span>
          <VBtn
            variant="tonal"
            size="small"
          >
            Browse Files
          </VBtn>
        </div>

        <div
          v-else
          class="d-flex justify-center align-center gap-3 pa-8 drop-zone flex-wrap"
        >
          <VRow class="match-height w-100">
            <template
              v-for="(item, index) in fileData"
              :key="index"
            >
              <VCol
                cols="12"
                sm="4"
              >
                <VCard :ripple="false">
                  <VCardText
                    class="d-flex flex-column"
                    @click.stop
                  >
                    <template v-if="item.url">
                      <VImg
                        :src="item.url"
                        width="200px"
                        height="150px"
                        class="w-100 mx-auto"
                      />
                    </template>
                    <template v-else>
                      <div class="w-100 h-150 d-flex align-center justify-center border rounded bg-light">
                        <span class="text-muted">PDF File</span>
                      </div>
                      <div class="mt-2">
                        <span class="clamp-text text-wrap">{{ item.file.name }}</span>
                        <span>{{ item.file.size / 1000 }} KB</span>
                      </div>
                    </template>
                  </VCardText>
                  <VCardActions>
                    <VBtn
                      variant="text"
                      block
                      @click.stop="fileData.splice(index, 1)"
                    >
                      Remove File
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </template>
          </VRow>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 1px dashed rgba(var(--v-theme-on-surface), var(--v-border-opacity));
}
</style>
