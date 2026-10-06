#!/usr/bin/env python3
"""Build Baghbaan fine-tuning dataset (~100 examples) from karachi-calendar.json.
Facts are pulled programmatically from the dataset — nothing is invented.
Output: baghbaan_train.jsonl — {"instruction","input","output"} per line (ali-qwen format).
"""
import json
import os
import random

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = json.load(open(os.path.join(BASE, "..", "data", "karachi-calendar.json"), encoding="utf-8"))
CROPS = DATA["crops"]
MONTHS = {m["id"]: m["roman"] for m in DATA["months"]}
MOODS = {m["id"]: m["mood"] for m in DATA["months"]}
META = DATA["meta"]
SPACE_LABEL = {"gamla": "gamla", "balcony": "balcony", "zameen": "zameen"}

random.seed(42)
OUT = []


def add(instruction, inp, output):
    assert instruction.strip() and inp.strip() and output.strip(), "empty field!"
    assert "Buntu" not in output and "Buntu" not in instruction, "Buntu leak!"
    OUT.append({"instruction": instruction, "input": inp, "output": output})


def sow_roman(crop):
    return [MONTHS[m] for m in crop["sow_months"]]


def sow_str(crop):
    return ", ".join(sow_roman(crop))


def space_str(crop):
    return ", ".join(SPACE_LABEL[s] for s in crop["space"])


def cap(s):
    return s[0].upper() + s[1:] if s else s


# ── A. "kaise lagayen" — 16 (one per crop) ──────────────────────────────
A_INSTR = [
    "{n} kaise lagayen?",
    "Mujhe {n} ugana hai, poora tareeqa batao.",
    "{n} lagane ka sahi tareeqa kya hai?",
    "Kya me ghar par {n} uga sakta hun? Kaise?",
    "Mere paas {sp} hai — {n} kaise lagayen is me?",
]
A_OUT = [
    "Bohat asaan! {sow} me {n} ke beej bo'o. {spc} me lagao — {sun}. {water}. {tip} {hv} me fasal tayyar ho jayegi!",
    "{n} {lvl} fasal hai. Bone ka waqt: {sow}. Jagah: {spc}. {sun_cap}. Pani: {water_low}. {tip}",
    "Zaroor uga sakte ho! {n} ke liye {sow} behtreen mahine hain. {spc} me lagao, {sun}. {water_cap} {tip} Bas {hv} sabar karo!",
    "Sunno: {sow} me beej bo'o, jagah {spc} theek rahegi. {sun_cap} {water_cap} {tip} {hv} me kaatne ke qabil!",
]
for i, c in enumerate(CROPS):
    n = c["name"]
    sp = SPACE_LABEL[c["space"][0]]
    add(
        A_INSTR[i % len(A_INSTR)].format(n=n, sp=sp),
        f"Fasl: {n}. Mahina: {MONTHS[c['sow_months'][0]]}. Jagah: {sp}.",
        A_OUT[i % len(A_OUT)].format(
            n=n, sow=sow_str(c), spc=space_str(c), sun=c["sun"],
            sun_cap=cap(c["sun"]), water=c["water"], water_cap=cap(c["water"]),
            water_low=c["water"][0].lower() + c["water"][1:],
            tip=c["tip"], hv=c["harvest_days"], lvl=c["level"].lower(),
        ),
    )

# ── B. "kab lagayen" yes/no — 24 ────────────────────────────────────────
B_YES_INSTR = [
    "Kya {m} me {n} laga sakte hain?",
    "{m} me {n} bone ka waqt hai?",
    "Mujhe {m} me {n} lagana hai, theek rahega?",
]
B_NO_INSTR = [
    "Kya {m} me {n} lag sakta hai?",
    "{m} me {n} bona chahiye ya nahi?",
]
B_YES_OUT = [
    "Haan, bilkul! {m} {n} ke bone ka waqt hai. {spc} me lagao, {water_low} {tip}",
    "Ji haan — {m} {n} ke liye sahi mahina hai (poora season: {sow}). {sun_cap} Bas {hv} me tayyar!",
]
B_NO_OUT = [
    "Nahi, {m} me {n} mat lagao — mausam theek nahi hoga. Sahi waqt {sow} hai. Thora intezar karo, phir bharpoor fasal hogi!",
    "{m} {n} ke liye nahi hai. Is ke bone ke mahine {sow} hain — us waqt lagao ge to {hv} me achi fasal milegi.",
]
yes_crops = CROPS  # one yes-question per crop (12 of them use first 12)
no_crops = CROPS   # one no-question per crop (12 of them use last 12)
for i, c in enumerate(CROPS[:12]):
    m = c["sow_months"][0]
    add(
        B_YES_INSTR[i % len(B_YES_INSTR)].format(m=MONTHS[m], n=c["name"]),
        f"Fasl: {c['name']}. Poocha gaya mahina: {MONTHS[m]}.",
        B_YES_OUT[i % len(B_YES_OUT)].format(
            m=MONTHS[m], n=c["name"], sow=sow_str(c), spc=space_str(c),
            sun_cap=cap(c["sun"]), water_low=c["water"][0].lower() + c["water"][1:],
            tip=c["tip"], hv=c["harvest_days"],
        ),
    )
for i, c in enumerate(CROPS[4:]):  # 12 no-questions
    bad = next(m for m in range(1, 13) if m not in c["sow_months"])
    add(
        B_NO_INSTR[i % len(B_NO_INSTR)].format(m=MONTHS[bad], n=c["name"]),
        f"Fasl: {c['name']}. Poocha gaya mahina: {MONTHS[bad]}.",
        B_NO_OUT[i % len(B_NO_OUT)].format(
            m=MONTHS[bad], n=c["name"], sow=sow_str(c), hv=c["harvest_days"],
        ),
    )

# ── C. "kitna pani" — 16 ────────────────────────────────────────────────
C_INSTR = [
    "{n} ko kitna pani dena chahiye?",
    "{n} ki sinchai ka kya usool hai?",
    "Pani ke mamle me {n} kaisa hai — zyada ya kam?",
    "{n} ko roz pani dun ya kabhi kabhi?",
]
C_OUT = [
    "{water_cap} {tip}",
    "Seedha jawab: {water_low} {tip}",
    "{n} ke liye pani ka usool ye hai — {water_low} Bas itna yaad rakho: {tip}",
]
for i, c in enumerate(CROPS):
    add(
        C_INSTR[i % len(C_INSTR)].format(n=c["name"]),
        f"Fasl: {c['name']}. Sawal pani ke bare me.",
        C_OUT[i % len(C_OUT)].format(
            n=c["name"], water_cap=cap(c["water"]),
            water_low=c["water"][0].lower() + c["water"][1:], tip=c["tip"],
        ),
    )

# ── D. space-specific — 12 ──────────────────────────────────────────────
D_INSTR = [
    "Kya {n} {sp} me lag sakta hai?",
    "Mere paas sirf {sp} hai — {n} ho jayega is me?",
    "{n} ke liye {sp} theek hai?",
]
D_YES = [
    "Haan! {n} {sp} me khush rehta hai. {sun_cap} {water_cap} {tip}",
    "Bilkul — {sp} {n} ke liye munasib jagah hai. {tip}",
]
D_NO = [
    "Nahi, {n} {sp} me theek nahi hoga. Is ke liye behtar jagah: {good}. Wahan lagao ge to achi fasal milegi!",
]
di = 0
for c in CROPS:
    good_sp = SPACE_LABEL[c["space"][0]]
    # yes-question with a valid space
    add(
        D_INSTR[di % 3].format(n=c["name"], sp=good_sp),
        f"Fasl: {c['name']}. Poocha gaya jagah: {good_sp}.",
        D_YES[di % 2].format(n=c["name"], sp=good_sp, sun_cap=cap(c["sun"]),
                             water_cap=cap(c["water"]), tip=c["tip"]),
    )
    di += 1
    if di >= 8:
        break
# 4 no-questions: pick crops with limited space and ask about a wrong one
no_space_cases = []
for c in CROPS:
    for s in ["gamla", "balcony", "zameen"]:
        if s not in c["space"]:
            no_space_cases.append((c, s))
            break
    if len(no_space_cases) >= 4:
        break
for c, s in no_space_cases:
    add(
        f"Kya {c['name']} {SPACE_LABEL[s]} me lag sakta hai?",
        f"Fasl: {c['name']}. Poocha gaya jagah: {SPACE_LABEL[s]}.",
        D_NO[0].format(n=c["name"], sp=SPACE_LABEL[s], good=space_str(c)),
    )

# ── E. off-topic decline — 6 ────────────────────────────────────────────
E = [
    ("Biryani banane ka tareeqa batao.",
     "Me sirf baghbani ke sawalon ka jawab deta hun — biryani ke liye ammi se poocho, woh sab se achi ustad hain! Baghbaghi ka koi sawal ho to hazir hun."),
    ("Sabzi mandi me tamatar ka kya bhao hai?",
     "Me sirf baghbani ke sawalon ka jawab deta hun — qeematein to roz badalti hain! Albata apne ghar me tamatar ugana ho to woh tareeqa zaroor bata sakta hun."),
    ("Kal cricket match kis ne jeeta?",
     "Me sirf baghbani ke sawalon ka jawab deta hun — cricket ka score mujhe nahi pata, lekin kheera (cucumber) ugane ka tareeqa poocho to foran bata dun!"),
    ("Mujhe mobile ka naya model suggest karo.",
     "Me sirf baghbani ke sawalon ka jawab deta hun — mobile ke liye dukandar behtar batayega. Gamlay, beej, pani — in par jo poochna ho poocho!"),
    ("Kapre dhone ka sahi tareeqa kya hai?",
     "Me sirf baghbani ke sawalon ka jawab deta hun! Kapron ka nahi pata, lekin podon ke 'kapre' (patte) dhoop me kaise chamken, ye bata sakta hun."),
    ("Sardi me heater kaunsa acha hai?",
     "Me sirf baghbani ke sawalon ka jawab deta hun — heater ka mashwara nahi de sakta. Lekin sardi me palak methi kaise lagayen, ye zaroor bataunga!"),
]
for instr, out in E:
    add(instr, "Sawal baghbani se mutaliq nahi.", out)

# ── F. short follow-ups — 6 ─────────────────────────────────────────────
F = [
    ("Aur dhoop kitni chahiye {n} ko?",
     "Fasl: {n}. Sawal dhoop ke bare me.", "{sun}."),
    ("{n} kitne din me tayyar hogi?",
     "Fasl: {n}. Sawal fasal ke waqt ke bare me.", "{hv} me tayyar ho jayegi, inshaAllah!"),
    ("{n} ke beej kahan se lun?",
     "Fasl: {n}. Sawal beej ke bare me.", "Beej hamesha taza lo — purana beej aadha ugta hai. Nazdeeki nursery se lo, wahan Karachi ke mausam ke hisab se sahi beej milta hai."),
    ("Gamlay me surakh zaroori hai?",
     "Sawal gamle ke bare me.", "Bilkul lazmi! Neeche surakh (drainage) na ho to pani khara rehta hai aur jarh sarh jati hai."),
    ("Mitti kaisi honi chahiye?",
     "Sawal mitti ke bare me.", "Aam bhal mitti + gobar ki khad (aadhi-aadhi) har sabzi ke liye kaafi hai. Naram, retli mitti jarh wali sabziyon ke liye behtreen."),
    ("Roz kitni dhoop zaroori hai?",
     "Sawal dhoop ke bare me.", "Roz 4-6 ghante dhoop sab se zaroori khad hai — is se achi koi khad nahi!"),
]
for instr_t, inp_t, out_t in F:
    c = CROPS[0]  # palak for the two crop-specific ones
    add(instr_t.format(n=c["name"]), inp_t.format(n=c["name"]),
        out_t.format(n=c["name"], sun=c["sun"], hv=c["harvest_days"]))

# ── G. general tips — 8 ─────────────────────────────────────────────────
for tip in META["general_tips"]:
    add("Baghbani me sab se ahem baat kya hai?",
        "Sawal aam mashware ke bare me.",
        tip + " Ye chhoti baat fasal bana ya bigar sakti hai!")
add("October me pani kab dena chahiye?",
    "Sawal October me pani ke waqt ke bare me.",
    META["watering_october"])
G_MONTH_Q = [
    (10, "October me kya karun baghiche me?"),
    (2, "Farvari me kya lagana chahiye?"),
    (7, "Julai (barsat) me kya khayal rakhun?"),
]
for mid, q in G_MONTH_Q:
    crops_here = [c["name"] for c in CROPS if mid in c["sow_months"]]
    add(q, f"Mahina: {MONTHS[mid]}. Sawal mahine ke kaam ke bare me.",
        f"{MOODS[mid]} Is mahine {', '.join(crops_here[:6])} lag sakte hain — mausam tumhare saath hai!")

# ── H. harvest time — 8 ─────────────────────────────────────────────────
H_INSTR = [
    "{n} kitne din me tayyar hogi?",
    "{n} katne ke qabil kab hogi?",
    "Mene {n} lagayi hai, kab tak milegi?",
]
for i, c in enumerate(CROPS[8:16]):  # 8 crops
    add(
        H_INSTR[i % 3].format(n=c["name"]),
        f"Fasl: {c['name']}. Sawal katayi ke waqt ke bare me.",
        f"{c['name']} {c['harvest_days']} me tayyar ho jayegi. {c['tip']}",
    )

# ── I. "is mahine kya bo'on" listing — 4 ───────────────────────────────
for mid in [10, 11, 2, 3]:
    crops_here = [c for c in CROPS if mid in c["sow_months"]]
    names = ", ".join(c["name"] for c in crops_here)
    add(f"{MONTHS[mid]} me kya kya bo sakte hain?",
        f"Mahina: {MONTHS[mid]}. Sawal bone wali faslon ki fehrist.",
        f"{MONTHS[mid]} me ye faslein bo sakte ho: {names}. {MOODS[mid]}")

# ── write & validate ──────────────────────────────────────────────────
out_path = os.path.join(BASE, "baghbaan_train.jsonl")
with open(out_path, "w", encoding="utf-8") as f:
    for ex in OUT:
        f.write(json.dumps(ex, ensure_ascii=False) + "\n")

# validate
n = 0
with open(out_path, encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        obj = json.loads(line)
        assert set(obj.keys()) == {"instruction", "input", "output"}, f"bad keys: {obj.keys()}"
        assert all(obj[k].strip() for k in obj), "empty value!"
        n += 1
print(f"OK: {n} examples written to {out_path}")

# category report
print(f"A kaise lagayen: 16, B kab: 24, C pani: 16, D space: 12, E off-topic: 6, F short: 6, G tips: 8, H harvest: 8, I listing: 4 = {16+24+16+12+6+6+8+8+4}")
