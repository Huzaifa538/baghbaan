import type { CalendarData, SpaceId } from '../types'
import { CropCard } from './CropCard'
import { Reveal } from './Reveal'

interface PlannerProps {
  data: CalendarData
  month: number
  space: SpaceId
  onMonth: (m: number) => void
  onSpace: (s: SpaceId) => void
}

export function Planner({ data, month, space, onMonth, onSpace }: PlannerProps) {
  const mood = data.months.find((m) => m.id === month)?.mood ?? ''
  const crops = data.crops.filter(
    (c) => c.sow_months.includes(month) && (space === 'sab' || c.space.includes(space)),
  )

  return (
    <section id="planner" className="max-w-5xl mx-auto px-5 py-14">
      <Reveal as="h2" className="font-display font-bold text-3xl sm:text-4xl">
        Is mahine kya bo'on?
      </Reveal>
      <Reveal as="p" className="text-moss mt-2">
        Mahina aur jagah chuno — baqi Baghbaan sambhal lega.
      </Reveal>

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-moss mb-2">
          Mahina
        </p>
        <div className="flex flex-wrap gap-2">
          {data.months.map((m) => (
            <button
              key={m.id}
              onClick={() => onMonth(m.id)}
              className={`chip px-3.5 py-1.5 rounded-full border border-sand bg-white/60 text-sm font-medium ${
                m.id === month ? 'active' : ''
              }`}
            >
              {m.roman}
            </button>
          ))}
        </div>
        <p className="mt-3 italic text-clay font-display text-lg">“{mood}”</p>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-moss mb-2">
          Jagah
        </p>
        <div className="flex flex-wrap gap-2">
          {[{ id: 'sab', label: 'Sab' }, ...data.spaces].map((s) => (
            <button
              key={s.id}
              onClick={() => onSpace(s.id)}
              className={`chip px-4 py-1.5 rounded-full border border-sand bg-white/60 text-sm font-medium ${
                s.id === space ? 'active' : ''
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Reveal className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {crops.map((c, i) => (
          <CropCard key={c.id} crop={c} month={month} months={data.months} index={i} />
        ))}
      </Reveal>
      {crops.length === 0 && (
        <p className="mt-8 text-center text-moss italic">
          Is mahine is jagah ke liye kuch khaas nahi — mahina ya jagah badal kar
          dekho.
        </p>
      )}

      <div className="mt-10 rounded-2xl bg-sand/70 border border-sand p-5 flex gap-4 items-start">
        <svg
          className="shrink-0 mt-0.5"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3v10m0 0c-4 0-7-2.5-7-6 4 0 7 2.5 7 6zm0 0c4 0 7-2.5 7-6-4 0-7 2.5-7 6z"
            stroke="#c2703e"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M12 13v8" stroke="#1d3a24" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p className="text-sm text-ink/80 leading-relaxed">
          <strong>Pani ka usool (October):</strong> {data.meta.watering_october}
        </p>
      </div>
    </section>
  )
}
