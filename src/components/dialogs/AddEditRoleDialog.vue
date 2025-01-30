<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'

interface Permission {
  name: string
  view: boolean
  create: boolean
  delete: boolean
  manage: boolean
}

interface Roles {
  name: string
  permissions: Permission[]
}

interface Props {
  rolePermissions?: Roles
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:rolePermissions', value: Roles): void
}

const props = withDefaults(defineProps<Props>(), {
  rolePermissions: () => ({
    name: '',
    permissions: [],
  }),
})

const emit = defineEmits<Emit>()

const defaultPermissions: Permission[] = [
  'Client',
  'Company',
  'Business',
  'File',
  'Hrm',
  'Task',
  'Fee_note',
  'Payment',
  'Employee',
  'Service',
  'Invoice',
  'Obligation',
  'User',
  'Payroll',
  'Client_dash',
  'Admin_dash',
  'Employee_dash',
  'All',
].map(name => ({
  name,
  view: false,
  create: false,
  delete: false,
  manage: false,
}))

const permissions = ref<Permission[]>([])
const isSelectAll = ref(false)
const role = ref('')
const refPermissionForm = ref<VForm>()

const checkedCount = computed(() =>
  permissions.value.reduce(
    (count, p) => count + Object.values(p).filter(v => typeof v === 'boolean' && v).length,
    0,
  ),
)

const isIndeterminate = computed(() =>
  checkedCount.value > 0 && checkedCount.value < permissions.value.length * 5,
)

watch(isSelectAll, val => {
  permissions.value = permissions.value.map(p => ({
    ...p,
    view: val,
    create: val,
    delete: val,
    manage: val,
  }))
})

watch(() => props.isDialogVisible, visible => {
  if (visible) {
    role.value = props.rolePermissions?.name || ''
    permissions.value = defaultPermissions.map(defaultPermission => {
      const matched = props.rolePermissions?.permissions.find(p => p.name === defaultPermission.name)

      return matched || defaultPermission
    })
  }
  else {
    permissions.value = []
  }
}, { immediate: true })

const onSubmit = async () => {
  try {
    const roleData = {
      name: role.value,
      permissions: permissions.value,
    }

    if (props.rolePermissions?.name)
      await $api(`/roles/${props.rolePermissions.name}`, { method: 'PUT', body: roleData })
    else
      await $api('/roles', { method: 'POST', body: roleData })

    emit('update:rolePermissions', roleData)
    emit('update:isDialogVisible', false)
    refPermissionForm.value?.reset()
  }
  catch (error) {
    console.error('Error saving role permissions:', error)
  }
}
</script>

<template>
  <VDialog
    v-model="props.isDialogVisible"
    width="900"
  >
    <VCard>
      <VCardTitle>{{ props.rolePermissions?.name ? 'Edit Role' : 'New Role' }}</VCardTitle>
      <VCardText>
        <VForm ref="refPermissionForm">
          <AppTextField
            v-model="role"
            label="Role Name"
          />
          <VTable>
            <thead>
              <tr>
                <th>Permission</th>
                <th>View</th>
                <th>Create</th>
                <th>Delete</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="permission in permissions"
                :key="permission.name"
              >
                <td>{{ permission.name }}</td>
                <td><VCheckbox v-model="permission.view" /></td>
                <td><VCheckbox v-model="permission.create" /></td>
                <td><VCheckbox v-model="permission.delete" /></td>
                <td><VCheckbox v-model="permission.manage" /></td>
              </tr>
            </tbody>
          </VTable>
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn @click="onSubmit">
          Submit
        </VBtn>
        <VBtn @click="$emit('update:isDialogVisible', false)">
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;

    .v-checkbox {
      min-inline-size: 4.75rem;
    }

    &:not(:first-child) {
      padding-inline: 0.5rem;
    }

    .v-label {
      white-space: nowrap;
    }
  }
}
</style>
