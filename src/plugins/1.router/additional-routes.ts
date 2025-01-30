import type { RouteRecordRaw } from 'vue-router/auto'

// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie<Record<string, unknown> | null | undefined>('userData')
      const userRole = userData.value?.role_id

      if (userRole === 1)
        return { name: 'dashboards-administrator' }

      if (userRole === 2)
        return { name: 'dashboards-client-dash' }

      return { name: 'login', query: to.query }
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
]

export const routes: RouteRecordRaw[] = [
  {
    path: '/companies',
    name: 'companies-list',
    meta: {
      action: 'view',
      subject: 'company',
    },
    component: () => import('@/pages/companies/list.vue'),
  },

  {
    path: '/companies/view/:id',
    name: 'companies-view-id',
    meta: {
      action: 'view',
      subject: 'company',
    },
    component: () => import('@/pages/companies/view/[id].vue'),
  },

  {
    path: '/businesses',
    name: 'businesses-list',
    meta: {
      action: 'view',
      subject: 'business',
    },
    component: () => import('@/pages/businesses/list.vue'),
  },

  {
    path: '/businesses/view/:id',
    name: 'businesses-view-id',
    meta: {
      action: 'view',
      subject: 'business',
    },
    component: () => import('@/pages/businesses/view/[id].vue'),
  },
]
