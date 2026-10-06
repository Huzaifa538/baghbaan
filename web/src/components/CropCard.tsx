import type { CSSProperties } from 'react'
import type { Crop } from '../types'
import { harvestPct, iconFor, sowLabel, sowTag } from '../lib/garden'

function CropIcon({ kind }: { kind: 'leaf' | 'root' | 'vine' }) {
  if (kind === 'leaf') {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21c-5 0-8-3.5-8-8 0-5 4-9 12-10-.5 8-1 13-4 18z"
          fill="#dce5d0"
          stroke="#3f5a3a"
          strokeWidth="1.5"
        />
        <path d="M12 21c0-6 2-11 7-14" stroke="#3f5a3a" strokeWidth="1.5" />
      </svg>
    )
  }
  if (kind === 'root') {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3c3 4 3 8 0 10-3-2-3-6 0-10z"
          fill="#e8b48a"
          stroke="#c2703e"
          strokeWidth="1.5"
        />
        <path
          d="M12 13v4m0 0l-3 3m3-3l3 3"
          stroke="#c2703e"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 20C6 12 10 6 18 5c-1 8-6 13-12 15z"
        fill="#f3e2c7"
        stroke="#c2703e"
        strokeWidth="1.5"
      />
      <circle cx="15" cy="12" r="2.2" fill="#c2703e" />
    </svg>
  )
}

interface CropCardProps {
  crop: Crop
  month: number
  months: { id: number; roman: string }[]
  index: number
}

export function CropCard({ crop, month, months, index }: CropCardProps) {
  const tag = sowTag(crop, month)
  const pct = harvestPct(crop)
  const delay = { animationDelay: `${Math.min(index * 60, 400)}ms` } as CSSProperties

  return (
    <article
      className="crop-card fade-in rounded-2xl bg-white/70 border border-sand p-5"
      style={delay}
    >
      <div className="flex items-start justify-between gap-2">
        <CropIcon kind={iconFor(crop)} />
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              crop.level === 'Asaan' ? 'bg-sage text-leaf' : 'bg-sand text-clay'
            }`}
          >
            {crop.level}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tag.cls}`}>
            {tag.t}
          </span>
        </div>
      </div>
      <h3 className="font-display font-bold text-2xl mt-3">{crop.name}</h3>
      <p className="text-xs text-moss uppercase tracking-wider">{crop.name_en}</p>
      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex gap-2">
          <dt className="text-moss w-16 shrink-0">Bo'o</dt>
          <dd className="font-medium">{sowLabel(crop, months)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-moss w-16 shrink-0">Pani</dt>
          <dd>{crop.water}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-moss">Fasal tayyar</span>
          <span className="font-semibold">≈ {crop.harvest_days}</span>
        </div>
        <div className="h-1.5 rounded-full bg-sand overflow-hidden">
          <div className="h-full rounded-full bg-leaf" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="mt-3 text-sm italic text-ink/75 border-l-2 border-clay pl-3">
        “{crop.tip}”
      </p>
    </article>
  )
}
