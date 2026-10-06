# I Built a Gardening App That Works With No Internet — on a Model I Fine-Tuned Myself

*Hacktoberfest 2026 · Week 1: Touch Grass 🌿*

---

Every October, my mother starts talking about planting palak and methi. Every October, I nod — and plant nothing, because I never know *when* exactly to sow what, and Google gives me advice for Ohio.

So for Hacktoberfest Week 1 ("Touch Grass" — build something with open-source AI that gets people off the screen and into the world), I built **Baghbaan**: a kitchen-garden planner for Karachi. Pick a month, pick your space (gamla, balcony, or zameen), and it tells you what to plant right now. There's also a "ask Baghbaan" box that answers gardening questions in Roman Urdu.

Here's the part I'm proud of: the answers come from an AI model running **on my own machine**. No API key. No cloud bill. No internet required. You could ask it about dhania from a rooftop with zero signal bars, and it would still answer.

## The problem

Karachi has a real gardening window that most apps ignore. October–November is *the* time for winter vegetables here — palak, methi, dhania, mooli, gajar — but every planting calendar I found was written for USDA zones. My neighbors get their advice from the nursery wala, which is great, except he's not available at 11pm when you're actually holding the seed packet.

I wanted something simple: honest local timing, in the language people actually speak at home (Roman Urdu), available even when the internet isn't.

## The build

Baghbaan is deliberately small. One HTML file, Tailwind, vanilla JS. A Python server (stdlib only — zero dependencies) that serves the page and proxies questions to the model. And a curated JSON dataset: 16 crops, 12 months, watering rules, all specific to Karachi's climate.

The model is the interesting part. It's a Qwen2.5-7B-Instruct that I fine-tuned myself with QLoRA on a free Colab T4 — 85 examples, loss went from 3.85 to 1.39 — then converted to GGUF and served with llama.cpp on my own machine. Total running cost: $0/month.

But here's an honest confession: my fine-tune was trained on playful cartoon dialogue, not agriculture. Left alone, it would happily invent gardening facts. So I don't let it. Every question gets answered with the curated dataset injected into the prompt, and the app shows which dataset facts were used. If the model can't be reached, the app falls back to the dataset directly with a small notice. **The dataset is the source of truth; the model is the friendly voice.** I'd rather show you an honest fallback than a confident hallucination.

The whole thing runs with `python3 server.py`. No pip install. No build step.

## Why open matters here

The challenge asked us to explain why open innovation matters for what we built. For Baghbaan, it's not philosophical — it's practical:

1. **It works where the internet doesn't.** The whole point of "touch grass" is being outside. A cloud AI is a brick on a rooftop with no signal. A local model answers anyway.
2. **It costs nothing to run.** No per-question meter means a student, a retiree, or my mother can ask a hundred questions without thinking about it.
3. **My questions stay home.** Nothing I type is uploaded to anyone's server for training or profiling.
4. **I can change how it behaves.** Because the weights are mine to fine-tune, the next version can learn from actual Karachi gardeners — their soil, their balconies, their mistakes. Try asking a closed API to do that.

## What I learned

- Small models + good data beat big models + hope. Grounding a playful 7B model with a curated dataset gave me correct answers with personality — the best of both.
- Local inference on CPU is *slow* (30–60 seconds for a thoughtful answer). That's the real tradeoff, and it's why the instant dataset-driven planner is the core of the app, not the chat box.
- Writing the dataset taught me more about gardening than the model ever could. I now know when to plant lehsan. My mother is impressed.

## What's next

- More crops, and a "meri kiyari" feature to track what you actually planted.
- Fine-tune the model on real gardening Q&A so it needs less hand-holding.
- A proper offline PWA so the whole thing installs on a phone and works in the field.

If you're in Karachi: October hai, beej bone ka waqt hai. Palak lagao. 🌱

---

*Repo: coming soon · Built with Qwen2.5-7B (open weights), llama.cpp, Python stdlib, and one JSON file of honest gardening data.*
