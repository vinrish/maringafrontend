export default [
  {
    title: 'Dashboard',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Administrator',
        to: 'dashboards-administrator',
        action: 'view',
        subject: 'admin_dash',
      },
      {
        title: 'Client Dashboard',
        to: 'dashboards-client-dash',
        action: 'view',
        subject: 'client_dash',
      },
      {
        title: 'Employee Dashboard',
        to: 'dashboards-employee-dash',
        action: 'view',
        subject: 'employee_dash',
      },
    ],
  },
  {
    title: 'Clients',
    icon: { icon: 'tabler-users' },
    children: [
      {
        title: 'List',
        to: 'clients-list',
        action: 'view',
        subject: 'client',
      },
      {
        title: 'Create',
        to: 'clients-create',
        action: 'create',
        subject: 'client',
      },
    ],
  },
  {
    title: 'Companies',
    icon: { icon: 'tabler-buildings' },
    children: [
      {
        title: 'List',
        to: 'companies-list',
        action: 'view',
        subject: 'company',
      },
      {
        title: 'Create',
        to: 'companies-create',
        action: 'create',
        subject: 'company',
      },
      {
        title: 'Recycle Bin',
        to: 'companies-bin',
        action: 'view',
        subject: 'company',
      },
    ],
  },
  {
    title: 'Businesses',
    icon: { icon: 'tabler-briefcase' },
    children: [
      {
        title: 'List',
        to: 'businesses-list',
        action: 'view',
        subject: 'business',
      },
      {
        title: 'Create',
        to: 'businesses-create',
        action: 'create',
        subject: 'business',
      },
    ],
  },
  {
    title: 'File Manager',
    icon: { icon: 'tabler-folder-open' },
    children: [
      {
        title: 'Client Files',
        children: [
          {
            title: 'List',
            to: 'files-client-list',
            action: 'view',
            subject: 'file',
          },
          {
            title: 'Create',
            to: 'files-client-create',
          },
        ],
      },
    ],
  },
  {
    title: 'HR & Payroll',
    icon: { icon: 'tabler-building-bank' },
    children: [
      {
        title: 'Employees',
        children: [
          {
            title: 'List',
            to: 'hrm-employees-list',
            action: 'view',
            subject: 'employee',
          },
          {
            title: 'Create',
            to: 'hrm-employees-create',
          },
        ],
      },
      {
        title: 'Payroll',
        children: [
          {
            title: 'Payroll',
            to: 'hrm-payroll-payroll',
            action: 'view',
            subject: 'hrm',
          },
          {
            title: 'Update Salary',
            to: 'hrm-payroll-salary-update',
          },
        ],
      },
      {
        title: 'Report',
        icon: { icon: 'tabler-report' },
        children: [
          {
            title: 'Report',
            to: 'hrm-reports-report',
            action: 'view',
            subject: 'hrm',
          },
          {
            title: 'Employee Pay Report',
            to: 'hrm-reports-employee-report',
          },
        ],
      },
    ],
  },
  {
    title: 'Services',
    icon: { icon: 'tabler-server-cog' },
    children: [
      {
        title: 'List',
        to: 'services-list',
        action: 'view',
        subject: 'service',
      },
      {
        title: 'Create',
        to: 'services-create',
      },
    ],
  },
  {
    title: 'Obligations',
    icon: { icon: 'tabler-settings-dollar ' },
    children: [
      {
        title: 'List',
        to: 'obligations-list',
        action: 'view',
        subject: 'obligation',
      },
      {
        title: 'Create',
        to: 'obligations-create',
      },
    ],
  },
  {
    title: 'Tasks',
    icon: { icon: 'tabler-list-details ' },
    children: [
      {
        title: 'List',
        to: 'tasks-list',
        action: 'view',
        subject: 'task',
      },
      {
        title: 'Create',
        to: 'tasks-create',
      },
    ],
  },
  {
    title: 'Fee Notes',
    icon: { icon: 'tabler-cash' },
    children: [
      {
        title: 'List',
        to: 'fee-notes-list',
        action: 'view',
        subject: 'fee_note',
      },
      {
        title: 'Summary',
        children: [
          {
            title: 'Client',
            to: 'fee-notes-summary-client-client-summary',
            action: 'view',
            subject: 'fee_note',
          },
          {
            title: 'Company',
            to: 'fee-notes-summary-company-company-summary',
          },
        ],
      },
      {
        title: 'Create',
        to: 'fee-notes-create',
      },
    ],
  },
  {
    title: 'Invoices',
    icon: { icon: 'tabler-file-dollar' },
    children: [
      {
        title: 'List',
        to: 'invoices-list',
        action: 'view',
        subject: 'invoice',
      },
    ],
  },
  {
    title: 'Roles & Permissions',
    icon: { icon: 'tabler-lock' },
    children: [
      { title: 'Roles', to: 'roles' },
    ],
  },
]
