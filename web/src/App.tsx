import { useEffect, useState } from 'react'
import type { CalendarData, HealthState, SpaceId } from './types'
import { fetchCalendar, fetchHealth } from './lib/api'
import { TopBar } from './components/TopBar'
import { Hero } from './components/Hero'
import { Planner } from './components/Planner'
import { CalendarStrip } from './components/CalendarStrip'
import { AskSection } from './components/AskSection'
import { OfflineSection } from './components/OfflineSection'
import { Footer } from './components/Footer'

export default function App() {
  const [data, setData] = useState<CalendarData | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [month, setMonth] = useState(10)
  const [space, setSpace] = useState<SpaceId>('sab')
  const [health, setHealth] = useState<HealthState>('checking')

  useEffect(() => {
    fetchCalendar()
      .then((d) => {
        setData(d)
        const now = new Date().getMonth() + 1
        setMonth(d.months.some((m) => m.id === now) ? now : 10)
      })
      .catch(() => setLoadError(true))

    fetchHealth()
      .then((h) => setHealth(h.model === 'ok' ? 'online' : 'offline'))
      .catch(() => setHealth('offline'))
  }, [])

  return (
    <>
      <TopBar health={health} />
      <Hero />
      {loadError ? (
        <main className="max-w-5xl mx-auto px-5 py-20 text-center">
          <p className="font-display font-bold text-2xl">Calendar load nahi hua</p>
          <p className="text-moss mt-2">
            data/karachi-calendar.json nahi mila — server se page serve karo
            (python3 server.py).
          </p>
        </main>
      ) : data ? (
        <main>
          <Planner
            data={data}
            month={month}
            space={space}
            onMonth={setMonth}
            onSpace={setSpace}
          />
          <CalendarStrip data={data} month={month} onMonth={setMonth} />
          <AskSection />
          <OfflineSection />
        </main>
      ) : (
        <main className="max-w-5xl mx-auto px-5 py-20 text-center text-moss">
          <p className="thinking-dots">
            <span />
            <span />
            <span />
          </p>
          <p className="mt-3 italic">Baghbaan tayyar ho raha hai…</p>
        </main>
      )}
      <Footer />
    </>
  )
}
