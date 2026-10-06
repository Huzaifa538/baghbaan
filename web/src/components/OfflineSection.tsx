import { Reveal } from './Reveal'

const CARDS = [
  {
    bg: 'bg-leaf',
    title: 'Apna model, apni machine',
    text: 'Jawab dene wala AI open-weight model hai jo laptop par hi chalta hai. Signal ho ya na ho — kheth me, chhat par, kahin bhi — Baghbaan jawab dega.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    bg: 'bg-clay',
    title: 'Bilkul muft',
    text: 'Na API key, na monthly bill, na per-sawal paisa. Model ek dafa download karo — phir jitna marzi poocho, hamesha ke liye.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 2v20M17 6.5c0-2-2.5-3.5-5-3.5S7 4.5 7 6.5s2.5 3.5 5 3.5 5 1.5 5 3.5-2.5 3.5-5 3.5-5-1.5-5-3.5" />
      </svg>
    ),
  },
  {
    bg: 'bg-moss',
    title: 'Tumhara data, tumhare paas',
    text: 'Tumhare sawal kahin upload nahi hote. Aur chaho to model ko aur sikhaya bhi ja sakta hai — apni zameen, apne beej, apna AI. Yehi open innovation hai.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </svg>
    ),
  },
]

export function OfflineSection() {
  return (
    <section className="max-w-5xl mx-auto px-5 py-16">
      <Reveal as="h2" className="font-display font-bold text-3xl sm:text-4xl text-center">
        Net gaya to? <span className="italic text-leaf">Koi baat nahi.</span>
      </Reveal>
      <Reveal
        as="p"
        className="text-center text-moss mt-3 max-w-xl mx-auto"
      >
        Baghbaan ka dimagh kisi company ke server par nahi — tumhare apne
        computer par chalta hai. Yehi is project ki jaan hai.
      </Reveal>
      <Reveal className="mt-10 grid sm:grid-cols-3 gap-5">
        {CARDS.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl bg-white/60 border border-sand p-6 crop-card"
          >
            <div
              className={`w-11 h-11 rounded-xl ${c.bg} text-cream flex items-center justify-center mb-4`}
            >
              {c.icon}
            </div>
            <h3 className="font-display font-bold text-lg">{c.title}</h3>
            <p className="text-sm text-moss mt-2 leading-relaxed">{c.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
