import { useEffect, useState } from 'react'

/** Animates 0 → target with an ease-out cubic, once on mount. */
export function useCountUp(target: number, durationMs = 1000): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - t0) / durationMs, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return value
}
