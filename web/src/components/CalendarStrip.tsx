import type { CalendarData } from '../types'
import { Reveal } from './Reveal'

interface CalendarStripProps {
  data: CalendarData
  month: number
  onMonth: (m: number) => void
}

export function CalendarStrip({ data, month, onMonth }: CalendarStripProps) {
  const pick = (m: number) => {
    onMonth(m)
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="calendar" className="max-w-5xl mx-auto px-5 pb-16">
      <Reveal as="h2" className="font-display font-bold text-3xl sm:text-4xl">
        Saal bhar ka calendar
      </Reveal>
      <Reveal as="p" className="text-moss mt-2">
        Kisi mahine par click karo — planner wahi jump kar jayega.
      </Reveal>
      <Reveal className="mt-6 flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 cal-strip">
        {data.months.map((m) => {
          const n = data.crops.filter((c) => c.sow_months.includes(m.id)).length
          const active = m.id === month
          return (
            <button
              key={m.id}
              onClick={() => pick(m.id)}
              className={`shrink-0 w-28 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${
                active
                  ? 'bg-leaf text-cream border-leaf shadow-lg'
                  : 'bg-white/70 border-sand'
              }`}
            >
              <p className="font-display font-bold text-lg leading-tight">{m.roman}</p>
              <p className={`text-xs mt-0.5 ${active ? 'text-cream/70' : 'text-moss'}`}>
                {n} faslein
              </p>
              <div className="mt-2 flex gap-1">
                {n === 0 ? (
                  <span className="text-[11px] opacity-60">—</span>
                ) : (
                  Array.from({ length: Math.min(n, 6) }, (_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        active ? 'bg-cream/70' : 'bg-clay'
                      }`}
                    />
                  ))
                )}
              </div>
            </button>
          )
        })}
      </Reveal>
    </section>
  )
}
