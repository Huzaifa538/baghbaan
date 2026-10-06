import { useEffect, useRef, useState } from 'react'
import type { AskResponse } from '../types'
import { askBaghbaan } from '../lib/api'
import { Reveal } from './Reveal'

const SUGGESTED = [
  'October me palak kaise lagayen?',
  'Gamle me dhania ke liye kitni mitti chahiye?',
  'Methi ko kitna pani chahiye?',
  'Balcony me kya ug sakta hai?',
]

type AskPhase = 'idle' | 'thinking' | 'done'

export function AskSection() {
  const [question, setQuestion] = useState('')
  const [phase, setPhase] = useState<AskPhase>('idle')
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<AskResponse | null>(null)
  const [failed, setFailed] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearInterval(timerRef.current), [])

  const run = async (q: string) => {
    const text = q.trim()
    if (!text || phase === 'thinking') return
    setQuestion(text)
    setPhase('thinking')
    setAnswer('')
    setResult(null)
    setFailed(false)
    setCopied(false)
    setElapsed(0)
    const t0 = Date.now()
    timerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - t0) / 1000))
    }, 500)

    try {
      const d = await askBaghbaan(text)
      setResult(d)
      setAnswer(d.answer)
      setPhase('done')
    } catch {
      setFailed(true)
      setAnswer(
        'Server se rabta nahi ho saka. Neeche diye gaye mahine ke hisab se faslen dekho — woh hamesha kaam karti hain.',
      )
      setPhase('done')
    } finally {
      window.clearInterval(timerRef.current)
    }
  }

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(answer.trim())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const badge = () => {
    if (phase === 'thinking')
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cream/20 text-cream">
          …
        </span>
      )
    if (failed || result?.source === 'dataset')
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400/25 text-amber-200">
          📖 Kitabi maloomat
        </span>
      )
    return (
      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-400/25 text-green-200">
        🌱 Baghbaan AI · local model
      </span>
    )
  }

  return (
    <section id="poocho" className="bg-leaf text-cream">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <Reveal
          as="p"
          className="text-clay font-semibold tracking-widest text-xs uppercase mb-2"
        >
          Tumhara sawal, Baghbaan ka jawab
        </Reveal>
        <Reveal as="h2" className="font-display font-bold text-3xl sm:text-4xl">
          Baghbaan se poocho
        </Reveal>
        <Reveal as="p" className="mt-2 text-cream/70">
          Masalan: <em>"gamlay me dhania kab lagana hai?"</em> — jawab tumhare
          apne computer par chalne wale AI model se aayega.
        </Reveal>

        <div className="mt-6 rounded-2xl bg-cream text-ink p-2 flex flex-col sm:flex-row gap-2">
          <textarea
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void run(question)
              }
            }}
            placeholder="Apna sawal yahan likho…"
            className="flex-1 bg-transparent px-4 py-3 outline-none resize-none placeholder:text-ink/40"
          />
          <button
            onClick={() => void run(question)}
            disabled={phase === 'thinking'}
            className="px-6 py-3 rounded-xl bg-clay text-cream font-semibold hover:brightness-110 active:scale-95 transition shrink-0 disabled:opacity-60"
          >
            {phase === 'thinking' ? '…' : 'Poocho →'}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED.map((q) => (
            <button key={q} className="sug-chip" onClick={() => void run(q)}>
              {q}
            </button>
          ))}
        </div>

        {phase !== 'idle' && (
          <div className="mt-5 rounded-2xl bg-cream/10 border border-cream/20 p-6 fade-in">
            <div className="flex items-center gap-2 mb-3">
              {badge()}
              <span className="text-cream/60 text-xs">Baghbaan</span>
            </div>
            {phase === 'thinking' && (
              <div className="thinking-dots py-2">
                <span />
                <span />
                <span />
                <span className="text-cream/60 text-sm ml-1">
                  {elapsed === 0
                    ? 'soch raha hai…'
                    : `${elapsed}s — model soch raha hai`}
                </span>
              </div>
            )}
            {phase === 'done' && (
              <>
                <p className="leading-relaxed text-cream/95">{answer}</p>
                <button
                  onClick={() => void copyAnswer()}
                  className="mt-3 text-xs font-medium px-3.5 py-1.5 rounded-full bg-cream/15 text-cream/85 hover:bg-cream/25 active:scale-95 transition"
                >
                  {copied ? 'Copy ho gaya ✓' : 'Jawab copy karo'}
                </button>
                {result?.notice && (
                  <p className="mt-3 text-xs text-cream/60 italic">{result.notice}</p>
                )}
                {(result?.facts_used?.length ?? 0) > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result!.facts_used.map((f) => (
                      <span
                        key={f}
                        className="text-[11px] px-2 py-1 rounded-full bg-cream/15 text-cream/80"
                      >
                        📖 {f}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
