// ── Domain types for the Baghbaan garden planner ─────────────────────────────

export interface Crop {
  id: string
  name: string
  name_en: string
  aliases: string[]
  sow_months: number[]
  space: string[]
  sun: string
  water: string
  harvest_days: string
  level: string
  tip: string
}

export interface MonthInfo {
  id: number
  name: string
  roman: string
  mood: string
}

export interface SpaceInfo {
  id: string
  label: string
  desc: string
}

export interface CalendarMeta {
  city: string
  watering_october: string
  general_tips: string[]
  note: string
}

export interface CalendarData {
  crops: Crop[]
  meta: CalendarMeta
  months: MonthInfo[]
  spaces: SpaceInfo[]
}

// ── API contracts (must match server.py) ─────────────────────────────────────

export type HealthState = 'checking' | 'online' | 'offline'

export interface HealthResponse {
  model: string
  crops: number
}

export type AnswerSource = 'model' | 'dataset'

export interface AskResponse {
  answer: string
  source: AnswerSource
  facts_used: string[]
  notice: string | null
}

export type SpaceId = string // 'sab' | 'gamla' | 'balcony' | 'zameen'

export interface SowTag {
  t: string
  cls: string
}
