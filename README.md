# 🌱 Baghbaan — Karachi Kitchen Garden Planner

**Hacktoberfest 2026 · Week 1: "Touch Grass" entry**

Baghbaan Karachi ke liye ek kitchen-garden planner hai — mahina chuno, jagah (gamla / balcony / zameen) batao, aur woh batayega ke is waqt kya bona chahiye. Aur agar koi sawal ho to "Baghbaan se poocho" — jawab tumhare **apne computer par chalne wale open-weight AI model** se aayega. Bina internet ke. Bilkul muft.

## Kyun banaya?

Week 1 ka theme hai **"Touch Grass"** — aisi cheez banao jo logon ko screen se utha kar bahar le jaye. Karachi me October sardi wali sabziyon ka behtreen waqt hai, lekin aksar logon ko pata nahi hota ke kab kya lagana hai. Baghbaan ye masla hal karta hai — aur is ka dimagh cloud par nahi, tumhari apni machine par chalta hai.

## Architecture

```
┌──────────────┐      ┌──────────────┐      ┌───────────────────┐
│  index.html  │─────▶│  server.py   │─────▶│  local AI model   │
│  (planner +  │      │  (stdlib     │      │  ali-qwen (Qwen2.5 │
│   Q&A UI)    │      │   proxy)     │      │  7B, fine-tuned,  │
└──────────────┘      └──────┬───────┘      │  llama.cpp, :8080)│
                             │              └───────────────────┘
                             ▼
                      ┌──────────────┐
                      │  curated     │
                      │  Karachi     │
                      │  dataset     │
                      │  (JSON)      │
                      └──────────────┘
```

- **Frontend** (`index.html`): static, Tailwind CDN, vanilla JS. Month/space pickers dataset se instant suggestions dete hain.
- **Backend** (`server.py`): sirf Python stdlib, koi dependency nahi. Static files serve karta hai aur `/api/ask` ko local model tak pahunchata hai — dataset ke facts prompt me inject karke, taake jawab sahi rahe.
- **Dataset** (`data/karachi-calendar.json`): Karachi ke liye curated planting calendar — 16 faslein, 12 mahine, pani ke usool. Yehi sach ka source hai.
- **Model**: `ali-qwen` — QLoRA fine-tuned Qwen2.5-7B-Instruct, llama.cpp se local serve ho raha hai (OpenAI-compatible API). Dostana Roman Urdu jawab deta hai; facts dataset se aate hain.

### Fallback

Agar model se rabta na ho (server down, slow), to app khamoshi se toot-ti nahi — dataset se seedha jawab deti hai aur chhota sa notice dikhati hai. Planner to waise bhi hamesha kaam karta hai.

## Features

- **Planner** — mahina + jagah chuno, dataset se instant suggestions (filter ke saath).
- **Saal-bhar calendar strip** — 12 mahine ke cards (har mahine me kitni faslein bo sakti hain, chhote dots ke saath); click karo to planner wahi jump kar jata hai.
- **Crop cards** — difficulty + urgency tag ("Abhi bo'o" / "Mausam shuru" / "Akhri mauqa", bone wali khirki ke hisab se) aur fasal-tayyar hone ka progress bar.
- **"Baghbaan se poocho"** — tajweez-shuda sawalon ke chips (click = fill + submit), model ke jawab ka intezar me seconds ka ticker, aur jawab copy karne ka button. Jawab hamesha dataset-facts se grounded; `facts_used` chips batate hain kaun se facts istemal hue.
- **Hero stats** — gin-ti wali animation (16 faslein · 12 mahine · Rs 0 hamesha).
- **Scroll reveals** — halki fade+rise animation sections par (IntersectionObserver, reduced-motion ka khayal).
- **Offline-first** — model local hai; na chale to dataset fallback + notice. App kabhi toot-ti nahi.

## Chalane ka tareeqa

```bash
# 1. Model server (agar pehle se nahi chal raha)
#    health check: curl http://127.0.0.1:8080/health

# 2. API key env var me (ya ~/.workspace/ali-model/.api_key se khud uth lega)
export BAGHBAAN_API_KEY="tumhari-key"

# 3. App server
cd baghbaan
python3 server.py
# → http://localhost:8000 kholo
```

Koi `pip install` nahi. Koi build step nahi.

## Repo layout

```
baghbaan/
├── index.html                  # poori app (UI + logic)
├── server.py                   # static server + model proxy (stdlib only)
├── data/
│   └── karachi-calendar.json   # curated Karachi planting dataset
├── README.md
├── DEV-ARTICLE-DRAFT.md        # Hacktoberfest submission article (draft)
└── .gitignore
```

## Dataset ke baare me imandari se

Ye ek starter guide hai, agronomy ki kitab nahi. Sowing windows Karachi ke mausam ke hisab se curated hain (halki sardi Nov–Feb, sakht garmi, barsat Jul–Sep). Shak ho to apne ilaqe ke nursery wale se pooch lena — woh sab se bara expert hai.

## License

MIT — karo jo marzi, bas Baghbaan ka naam le lena. 🌱
