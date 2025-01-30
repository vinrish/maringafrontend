import type { App } from 'vue'

import { createMongoAbility } from '@casl/ability'
import { abilitiesPlugin } from '@casl/vue'
import type { Rule } from './ability'
import { useAuthStore } from '@/stores/authStore'

export default function (app: App) {
  const authStore = useAuthStore()

  const userAbilityRules = authStore.userAbilityRules as Rule[] || []

  // useCookie<Rule[]>('userAbilityRules')
  const initialAbility = createMongoAbility(userAbilityRules ?? [])

  watch(
    () => authStore.userAbilityRules,
    newRules => {
      initialAbility.update(newRules)
    },
    { deep: true },
  )

  app.use(abilitiesPlugin, initialAbility, {
    useGlobalProperties: true,
  })
}
