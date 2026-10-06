import type { Crop, SowTag } from '../types'

const LEAFY = new Set(['palak', 'methi', 'dhania', 'podina'])
const ROOTS = new Set(['mooli', 'gajar', 'shalgam', 'lehsan'])

export type CropIcon = 'leaf' | 'root' | 'vine'

export function iconFor(crop: Crop): CropIcon {
  if (LEAFY.has(crop.id)) return 'leaf'
  if (ROOTS.has(crop.id)) return 'root'
  return 'vine'
}

/** Urgency tag: where the selected month sits inside the crop's sowing window. */
export function sowTag(crop: Crop, month: number): SowTag {
  const w = [...crop.sow_months].sort((a, b) => a - b)
  if (w.length > 1 && month === w[0]) return { t: 'Mausam shuru', cls: 'bg-sage text-leaf' }
  if (w.length > 1 && month === w[w.length - 1]) return { t: 'Akhri mauqa', cls: 'bg-clay/15 text-clay' }
  return { t: "Abhi bo'o", cls: 'bg-sage text-leaf' }
}

/** Bar fill: faster crops → fuller bar. */
export function harvestPct(crop: Crop): number {
  const d = parseInt(crop.harvest_days, 10) || 45
  return Math.max(14, Math.min(100, Math.round(115 - d)))
}

export function romanMonthName(
  months: { id: number; roman: string }[],
  id: number,
): string {
  return months.find((m) => m.id === id)?.roman ?? ''
}

export function sowLabel(
  crop: Crop,
  months: { id: number; roman: string }[],
): string {
  return crop.sow_months.map((id) => romanMonthName(months, id)).join(' · ')
}
