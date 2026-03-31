export type Contact = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
}

export type Column = {
  id: string
  slug: string
  title: string
  description: string
  content: string
  thumbnail: string | null
  tags: string[]
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  created_at: string
  scheduled_at: string | null
  updated_at: string
}

export type Ad = {
  id: string
  name: string
  position: 'header' | 'sidebar' | 'footer' | 'inline'
  type: 'adsense' | 'affiliate' | 'direct'
  code: string
  is_active: boolean
  page: string
  priority: number
}

export type Ward = {
  name: string
  population: number
  crime: number
  crime_per1000: number
  foreign_pct: number
  child_pct: number
  traffic: number
  fire: number
  danger_rank: number
  streetlight_per_km2: number
  rent_1k: number
  rent_1ldk: number
  rent_family: number
  nursery: number
  hospital: number
  park_area_pct: number
  safety_score?: number
}
