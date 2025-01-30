<script setup lang="ts">
import girlUsingMobile from '@images/pages/girl-using-mobile.png'

interface Permission {
  name: string
  view: boolean
  create: boolean
  delete: boolean
  manage: boolean
}

interface RoleDetails {
  name: string
  permissions: Permission[]
}

interface Roles {
  role: string
  users: string[]
  details: RoleDetails
}

// 👉 Roles List
const roles = ref<Roles[]>([])

const { data } = await useApi<Roles>('roles')

if (data.value)
  roles.value = data.value

const isRoleDialogVisible = ref(false)

const roleDetail = ref<RoleDetails>({
  name: '',
  permissions: [],
})

const isAddRoleDialogVisible = ref(false)

const editPermission = (value: RoleDetails) => {
  isRoleDialogVisible.value = true
  roleDetail.value = { ...value }
}
</script>

<template>
  <VRow>
    <!-- 👉 Roles -->
    <VCol
      v-for="item in roles"
      :key="item.role"
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard>
        <VCardText class="d-flex align-center pb-4">
          <div class="text-body-1">
            Total {{ item.users.length }} users
          </div>

          <VSpacer />

          <div class="v-avatar-group">
            <template
              v-for="(user, index) in item.users"
              :key="user"
            >
              <VAvatar
                v-if="item.users.length > 4 && item.users.length !== 4 && index < 3"
                size="40"
                :image="user"
              />

              <VAvatar
                v-if="item.users.length === 4"
                size="40"
                :image="user"
              />
            </template>
            <VAvatar
              v-if="item.users.length > 4"
              :color="$vuetify.theme.current.dark ? '#373B50' : '#EEEDF0'"
            >
              <span>
                +{{ item.users.length - 3 }}
              </span>
            </VAvatar>
          </div>
        </VCardText>

        <VCardText>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h5 class="text-h5">
                {{ item.role }}
              </h5>
              <div class="d-flex align-center">
                <a
                  href="javascript:void(0)"
                  @click="editPermission(item.details)"
                >
                  Edit Role
                </a>
              </div>
            </div>
            <IconBtn>
              <VIcon
                icon="tabler-copy"
                class="text-high-emphasis"
              />
            </IconBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Add New Role -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard
        class="h-100"
        :ripple="false"
      >
        <VRow
          no-gutters
          class="h-100"
        >
          <VCol
            cols="5"
            class="d-flex flex-column justify-end align-center mt-5"
          >
            <img
              width="85"
              :src="girlUsingMobile"
            >
          </VCol>

          <VCol cols="7">
            <VCardText class="d-flex flex-column align-end justify-end gap-4">
              <VBtn
                size="small"
                @click="isAddRoleDialogVisible = true"
              >
                Add New Role
              </VBtn>
              <div class="text-end">
                Add new role,<br> if it doesn't exist.
              </div>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
      <AddEditRoleDialog
        v-model:is-dialog-visible="isAddRoleDialogVisible"
        :role-permissions="roleDetail"
      />
    </VCol>
  </VRow>

  <AddEditRoleDialog
    v-model:is-dialog-visible="isRoleDialogVisible"
    v-model:role-permissions="roleDetail"
  />
</template>
