export interface Customer {
  id: number
  uuid: string
  kra_pin: string
  id_no: string
  post_address: string
  post_code: string | null
  city: string
  county: string
  country: string
  notes: string
  folder_path: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  user_id: number
  user: {
    id: number
    first_name: string
    middle_name: string
    last_name: string
    email: string
    avatar: string | null
    phone: string
    status: number
    allow_login: number
  }
}

export interface Company {
  id: number
  name: string
  phone: string
  reg_date: string
  reg_number: string
}

export interface Business {
  id: number
  name: string
  phone: string
  reg_date: string
  reg_number: string
}

export interface ApiResponse extends Customer {
  client: Customer
  companies: (Company | null)[]
  businesses: (Business | null)[]
  total_fee_note_amount: number
  total_paid_amount: number
  total_outstanding_amount: number
}

export interface ExtendedCustomer extends Customer {
  companies: Company[]
  businesses: Business[]
  total_paid_amount: number
  total_fee_note_amount: number
  total_outstanding_amount: number
}
