# Baghbaan Training Dataset — Notes

## Kya hai
`baghbaan_train.jsonl` — 100 training examples, Huzaifa ke "isko train karo hamare project k hawalae se" ke liye.
Har line ek JSON object hai, ali-qwen wale format me:
`{"instruction": "...", "input": "...", "output": "..."}`

## Kaise banaya
- `build_dataset.py` script se generate kiya — **saare facts `data/karachi-calendar.json` se programmatically uthaye gaye**, haath se nahi likhe. Koi invented fact nahi.
- Voice/rules `best_skill.md` se liye gaye: Roman Urdu, garam dostana lehja, "Buntu" ka zikr kabhi nahi, sirf dataset facts, ghalat sawal par polite decline.
- Seed fixed (`random.seed(42)`) — dobara chalane par same dataset.

## Category breakdown (100 total)
| Category | Count | Misaal |
|---|---|---|
| A. kaise lagayen (how to plant) | 16 | har fasal ke liye 1 |
| B. kab lagayen (yes/no per month) | 24 | 12 haan + 12 nahi (sahi mahine ke saath) |
| C. kitna pani (watering) | 16 | har fasal ke liye 1 |
| D. space-specific (gamla/balcony/zameen) | 12 | 8 haan + 4 nahi |
| E. off-topic decline | 6 | biryani, cricket, mobile... → polite decline |
| F. short follow-ups | 6 | dhoop, mitti, drainage... |
| G. general tips | 8 | 4 aam usool + October watering + 3 mahine ke mashware |
| H. harvest time | 8 | katayi kab hogi |
| I. month listing | 4 | "Aktobar me kya bo'on?" |

## Validation
- ✅ 100/100 lines valid JSON, har ek me exactly 3 keys (instruction/input/output), koi empty value nahi
- ✅ 0x "Buntu" leak
- ✅ Fact cross-check: saare "haan/nahi" mahine-jawab aur space-jawab dataset se match (0 errors)
- ✅ Avg output ~154 chars (2–5 jumle, Roman Urdu)

## Training recipe (agla qadam — training ABHI nahi hui)
Same recipe as ali-qwen:
- Base: `unsloth/Qwen2.5-7B-Instruct`, QLoRA, free Colab T4
- 3 epochs (~30 steps @ 100 examples)
- Phir GGUF convert → llama.cpp par serve (existing `~/workspace/ali-model/` pipeline)
- **Note:** training se pehle 10–15 examples ko Huzaifa se review karwana behtar hoga (quality gate).

## Files
- `baghbaan_train.jsonl` — the dataset
- `build_dataset.py` — generator (reproducible)
- `DATASET_NOTES.md` — ye file
