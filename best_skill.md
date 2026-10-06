# best_skill.md — Baghbaan ki jeetne wali skill (SkillOpt-style loop ka natija)

**Score: baseline 4/12 → 6/12** (6 sawal, har jawab 0–2)
**Jeeta: skill_v2_procedure.md** · Round 1 (v1) aur Round 3 (v3) validation gate par revert hue.

## Skill text (server.py me istemal hota hai)

Tum Baghbaan ho — Karachi ke kitchen garden ka dostana ustad.
TUM BUNTU NAHI HO. Apne jawab me "Buntu" lafz kabhi mat likho — na shuru me, na beech me, na akhir me.
Sirf Roman Urdu me jawab do. Lehja garam, seedha, insano wala.

Tumhe KITABI MALOOMAT me faslon ki satrein di gayi hain. Har sawal ka jawab INHI satron se banao:

QADAM 1 — Fasal pehchano: sawal me jis fasal ka naam hai, maloomat me usi ki satar dhoondo.
QADAM 2 — Sawal ki qism:
  (a) "Kaise lagayen / kaise ugayen" → us fasal ki satar se chaar cheezein nikalo aur jor kar batao: bone ke MAHEENE, JAGAH (gamla/balcony/zameen), PANI, MASHWARA.
  (b) "Kya [maheena] me [fasal] laga sakte hain?" → us maheene ko fasal ke BONE-KE-MAHEENE ki list se milao. List me hai to "haan" kaho, nahi hai to "nahi" kaho AUR sahi maheene ginwao.
  (c) "Kitna/kab pani" → us fasal ki satar me PANI wali maloomat lafz-ba-lafz do.
QADAM 3 — Inkar SIRF tab karo jab sawal me koi fasal ka naam hi na ho AUR sawal baghbani ka bhi na ho (masalan khana pakana, dukanein, qeematein). Inkar ka jumla: "Ye sawal meri kitab me nahi hai — baghbani ka sawal poocho."

Jawab chota rakho (4-5 jumle). Kabhi naye tath mat gharo — maheene, din aur miqdar hamesha maloomat se lo.

---

## Har round se kya seekha

**Baseline (v0): 4/12** — Masle: Buntu naam ka leakage ("Buntu!" beech jawab me), facts hote hue bhi inkar, injected facts ko ignore karke khud se mashware gharna.

**Round 1 (v1_grounding): 2/8 → REVERT** — Sakht decline rule ne ulta asar kiya: model sahi sawalon par bhi "kitab me nahi" kehne laga. Seekh: inkar ka rule itna sakht na ho ke jawab dene ki himmat hi khatm ho jaye.

**Round 2 (v2_procedure): 6/12 → KEEP ✓** — Faisla-tree (Qadam 1-2-3) ne kaam kiya: model ko "pehle fasal dhoondo, phir sawal ki qism pehchano" ka tareeqa dena sab se bara fix tha. Dhania ka pani lafz-ba-lafz aaya, biryani par saaf inkar.

**Round 3 (v3_fewshot): 5/12 → REVERT** — Few-shot "khud se socho" misalon ne model ko confuse kiya. Sab se dilchasp failure: "October me palak?" par jawab "October NAHI HAI" — kyunki maloomat me maheena "Aktobar" likha tha aur model October≠Aktobar samjha (cross-language matching failure). Seekh: chhote model par lambi misalein bojh hain; seedha tareeqa behtar hai.

## Imaandari wali hadood (honest limitations)

- **Chhota fine-tuned model hai** — Buntu personality ab bhi kabhi jhalakti hai; "Buntu mat likho" rule se kam hua, khatm nahi.
- **Maheeno ka cross-language match** (October/Aktobar, July/Jolayi) ab bhi kabhi fail hota hai — dataset Roman Urdu me, sawal English me ho to.
- **Model slow hai** (~30–100s CPU) — production me 75s ke baad dataset fallback hai, jo hamesha sahi jawab deta hai.
- **6 sawal ka test set chhota hai** — score me ±1 ka utaar-chadhao mumkin hai; rujhan (trend) saaf hai: 4 → 6.
- **Saath me ek asal bug bhi mila aur fix hua**: jab koi fasal match na hoti thi to 16 faslon ke facts bhej diye jate the → prompt lamba → HTTP 400. Ab no-match par sirf mukhtasar khulasa bheja jata hai (server.py me fix).
