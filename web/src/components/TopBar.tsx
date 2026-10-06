import type { HealthState } from '../types'

function LeafLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21c-5 0-8-3.5-8-8 0-5 4-9 12-10-.5 8-1 13-4 18z"
        fill="#3f5a3a"
      />
      <path
        d="M12 21c0-6 2-11 7-14"
        stroke="#1d3a24"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TopBar({ health }: { health: HealthState }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-cream/85 border-b border-sand">
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <LeafLogo />
          <span className="font-display font-bold text-xl tracking-tight">
            Baghbaan
          </span>
        </a>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-moss">
            {health === 'checking' && (
              <>
                <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                check ho raha…
              </>
            )}
            {health === 'online' && (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500" />
                AI online
              </>
            )}
            {health === 'offline' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                kitabi mode
              </>
            )}
          </span>
          <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-leaf text-cream font-semibold">
            Hacktoberfest 2026 · Touch Grass
          </span>
        </div>
      </div>
    </header>
  )
}
