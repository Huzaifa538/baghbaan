#!/usr/bin/env python3
"""SkillOpt-style test harness: run 6 fixed questions against a skill file."""
import importlib.util
import json
import sys
import time
from pathlib import Path

HERE = Path("/home/hatch/workspace/baghbaan")
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / "skillopt_results.json"

spec = importlib.util.spec_from_file_location("srv", HERE / "server.py")
srv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(srv)

skill_text = Path(sys.argv[1]).read_text(encoding="utf-8").strip()
srv.SYSTEM_PROMPT = skill_text

QUESTIONS = [
    ("q1", "October me gamlay me palak kaise lagayen?"),
    ("q2", "Dhania ko kitna pani dena chahiye?"),
    ("q3", "Kya July me tamatar laga sakte hain Karachi me?"),
    ("q4", "Chicken biryani banane ka tareeqa batao."),
    ("q5", "When should I plant carrots in Karachi?"),
    ("q6", "Karachi me sab se saste beej kahan se milenge?"),
]

# The local model is slow (CPU); give it room. Production keeps 75s and
# falls back to the dataset — here we want the model's actual answer.
import urllib.request as _ureq
_orig_urlopen = _ureq.urlopen
def _slow_urlopen(req, timeout=75, **kw):
    return _orig_urlopen(req, timeout=180, **kw)
_ureq.urlopen = _slow_urlopen

dataset = srv.load_dataset()
results = {"skill_file": sys.argv[1], "runs": []}
for qid, q in QUESTIONS:
    t0 = time.time()
    try:
        answer, facts = srv.ask_model(q, dataset)
        results["runs"].append({
            "id": qid, "question": q, "answer": answer,
            "facts_used": facts, "secs": round(time.time() - t0, 1),
            "error": None,
        })
    except Exception as e:
        results["runs"].append({
            "id": qid, "question": q, "answer": None,
            "facts_used": [], "secs": round(time.time() - t0, 1),
            "error": str(e)[:120],
        })
    print(f"done {qid} ({results['runs'][-1]['secs']}s)", flush=True)

OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
print("saved", OUT)
