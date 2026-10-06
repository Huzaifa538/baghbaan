import { useCountUp } from '../hooks/useCountUp'

export function Hero() {
  const crops = useCountUp(16)
  const months = useCountUp(12)

  return (
    <section className="relative overflow-hidden paper-grain">
      <svg
        className="hero-leaf -left-10 top-10 w-64"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M100 190C40 190 15 140 15 90 15 45 55 10 110 10c-8 60-9 120-10 180z"
          fill="#dce5d0"
        />
      </svg>
      <svg
        className="hero-leaf -right-14 bottom-0 w-80"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M100 190C160 190 185 140 185 90 185 45 145 10 90 10c8 60 9 120 10 180z"
          fill="#e9dfc6"
        />
      </svg>
      <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <p className="text-clay font-semibold tracking-widest text-xs uppercase mb-4">
          Karachi · Kitchen Garden Planner
        </p>
        <h1 className="font-display font-bold text-5xl sm:text-7xl leading-[1.02] tracking-tight">
          Karachi ki mitti,
          <br />
          <span className="italic text-leaf">tumhare haath.</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-moss text-base sm:text-lg leading-relaxed">
          Baghbaan tumhara garden dost hai. Mahina chuno, jagah batao — woh
          batayega ke is waqt kya bona chahiye, aur sawal poocho to jawab bhi
          dega. Sab kuch tumhare apne computer par chalta hai —{' '}
          <strong>net ho ya na ho.</strong>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#planner"
            className="px-6 py-3 rounded-full bg-leaf text-cream font-semibold hover:bg-ink transition"
          >
            October ki fasal dekho ↓
          </a>
          <a
            href="#poocho"
            className="px-6 py-3 rounded-full border-2 border-leaf text-leaf font-semibold hover:bg-leaf hover:text-cream transition"
          >
            Baghbaan se poocho
          </a>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6 sm:gap-10">
          <div>
            <p className="font-display font-bold text-3xl text-leaf">{crops}</p>
            <p className="text-moss text-xs mt-1">faslein</p>
          </div>
          <div className="w-px h-10 bg-sand" />
          <div>
            <p className="font-display font-bold text-3xl text-leaf">{months}</p>
            <p className="text-moss text-xs mt-1">mahine ka calendar</p>
          </div>
          <div className="w-px h-10 bg-sand" />
          <div>
            <p className="font-display font-bold text-3xl text-leaf">Rs 0</p>
            <p className="text-moss text-xs mt-1">hamesha, koi bill nahi</p>
          </div>
        </div>
      </div>
    </section>
  )
}
