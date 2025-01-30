import { defineStore } from 'pinia'
import { ability } from '@/plugins/casl/ability'
import { router } from '@/plugins/1.router'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const userData = ref<any | null>(null)
    const userAbilityRules = ref()

    // ability.update(userAbilityRules)

    const setUserData = (data: Record<string, any>) => {
      userData.value = data
    }

    const setUserAbilityRules = (rules: any) => {
      userAbilityRules.value = rules
      ability.update(rules)
    }

    const fetchUserAbilities = async () => {
      try {
        // Make the API call
        const response = await useApi<any>(createUrl('/abilities'))

        console.log('API Response:', response)

        // Unwrap response data if needed
        const data = response.data?.value || response.data

        if (data) {
          console.log('Extracted Data:', data)

          const { userAbilityRules } = data

          if (userAbilityRules) {
            // Update the store with the fetched data
            // setUserData(userData)
            setUserAbilityRules(userAbilityRules)
            console.log('User data and rules updated successfully.')
          }
          else {
            console.error('Missing expected data in response:', data)
          }
        }
        else {
          console.error('Response does not contain valid data:', response)
        }
      }
      catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    const clearUserData = async () => {
      try {
        // Make logout API call
        const response = await $api('logout', { method: 'POST' })

        console.log('Logout response:', response)

        if (response.status === 200) {
          // Clear access token
          useCookie('accessToken').value = null
          useCookie('userData').value = null

          // Reset user data and abilities
          userData.value = []
          userAbilityRules.value = []
          ability.update([])

          console.log('User data and ability rules cleared.')

          // Redirect to login
          router.push({ name: 'login' })
        }
        else {
          console.error('Failed to log out: Unexpected response', response)
        }
      }
      catch (error) {
        console.error('Logout failed:', error)
      }
    }

    return {
      userData,
      userAbilityRules,
      setUserData,
      setUserAbilityRules,
      fetchUserAbilities,
      clearUserData,
    }
  },
  {
    persist: true,
  },
)
