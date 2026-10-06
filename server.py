#!/usr/bin/env python3
"""
Baghbaan — tiny server.

Serves the static site and proxies garden questions to the local
open-weight model (no cloud, no API key leaves this machine).

Env:
    BAGHBAAN_API_KEY   Bearer key for the local model server.
                       Falls back to ~/workspace/ali-model/.api_key
    MODEL_URL          Model base URL (default http://127.0.0.1:8080)
    PORT               Port to listen on (default 8000)

Run:
    python3 server.py
Then open http://localhost:8000
"""
import json
import os
import urllib.request
import urllib.error
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA_FILE = HERE / "data" / "karachi-calendar.json"
MODEL_URL = os.environ.get("MODEL_URL", "http://127.0.0.1:8080").rstrip("/")


def load_api_key():
    key = os.environ.get("BAGHBAAN_API_KEY")
    if key:
        return key.strip()
    fallback = Path.home() / "workspace" / "ali-model" / ".api_key"
    if fallback.exists():
        return fallback.read_text().strip()
    return None


def load_dataset():
    with open(DATA_FILE, encoding="utf-8") as f:
        return json.load(f)


def find_relevant_crops(dataset, question):
    """Cheap keyword match: which crops is the user asking about?"""
    q = question.lower()
    hits = []
    for crop in dataset["crops"]:
        names = [crop["name"].lower(), crop["name_en"].lower()] + [a.lower() for a in crop.get("aliases", [])]
        if any(n in q for n in names):
            hits.append(crop)
    return hits


def month_mentioned(dataset, question):
    q = question.lower()
    for m in dataset["months"]:
        if m["name"].lower() in q or m["roman"].lower() in q:
            return m
    return None


def dataset_answer(dataset, question):
    """Honest fallback: answer straight from the curated data, no model."""
    crops = find_relevant_crops(dataset, question)
    month = month_mentioned(dataset, question)
    lines = []
    if crops:
        for c in crops:
            months = ", ".join(dataset["months"][m - 1]["roman"] for m in c["sow_months"])
            lines.append(
                f"{c['name']} ({c['name_en']}): bone ka waqt {months}. "
                f"Tayyar {c['harvest_days']} me. {c['tip']}"
            )
    else:
        # No crop matched — list what's sowable in the mentioned (or current) month.
        mid = month["id"] if month else 10
        sowable = [c for c in dataset["crops"] if mid in c["sow_months"]]
        mname = dataset["months"][mid - 1]["roman"]
        lines.append(f"{mname} me ye sab lag sakta hai: " + ", ".join(c["name"] for c in sowable) + ".")
        lines.append(dataset["meta"]["watering_october"] if mid == 10 else "")
    return " ".join(l for l in lines if l)


SYSTEM_PROMPT = """Tum Baghbaan ho — Karachi ke kitchen garden ka dostana ustad.
Sirf Roman Urdu me jawab do. Lehja garam, seedha, insano wala — koi robotic jumla nahi.
Tumhe neeche KITABI MALOOMAT di gayi hai. Jawab SIRF isi maloomat ki bunyad par do — apne se naye tath (facts) mat gharo.
Agar sawal maloomat se bahar ho, to seedha kaho ke ye mere kitab me nahi, nursery wale se poocho.
Jawab chota rakho (4-5 jumle)."""


def ask_model(question, dataset):
    """Forward to the local model with dataset facts injected. Raises on failure."""
    key = load_api_key()
    if not key:
        raise RuntimeError("no-api-key")

    crops = find_relevant_crops(dataset, question)
    facts = []
    for c in crops or dataset["crops"]:
        months = ", ".join(dataset["months"][m - 1]["roman"] for m in c["sow_months"])
        facts.append(
            f"- {c['name']} ({c['name_en']}): bone ka maheene {months}; "
            f"tayyari {c['harvest_days']}; jagah {', '.join(c['space'])}; "
            f"pani: {c['water']}; mashwara: {c['tip']}"
        )
    facts.append("Pani ka usool (October): " + dataset["meta"]["watering_october"])

    body = {
        "model": "ali-qwen",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "KITABI MALOOMAT:\n" + "\n".join(facts) + "\n\nSAWAL: " + question},
        ],
        "max_tokens": 220,
        "temperature": 0.6,
    }
    req = urllib.request.Request(
        MODEL_URL + "/v1/chat/completions",
        data=json.dumps(body).encode(),
        method="POST",
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + key},
    )
    # NOTE: the key is only ever sent to the local model URL. It is never
    # logged, never written to disk, never leaves this machine.
    with urllib.request.urlopen(req, timeout=75) as r:
        data = json.load(r)
    answer = data["choices"][0]["message"]["content"].strip()
    return answer, [c["name"] for c in crops]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(HERE), **kwargs)

    def log_message(self, *args):
        pass  # keep the terminal quiet; never log request bodies

    def _json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/health":
            dataset = load_dataset()
            model_ok = False
            try:
                with urllib.request.urlopen(MODEL_URL + "/health", timeout=5) as r:
                    model_ok = json.load(r).get("status") == "ok"
            except Exception:
                pass
            return self._json({"model": "ok" if model_ok else "down",
                               "crops": len(dataset["crops"])})
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/ask":
            return self._json({"error": "not found"}, 404)
        length = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
        except Exception:
            return self._json({"error": "bad request"}, 400)
        question = (payload.get("question") or "").strip()[:500]
        if not question:
            return self._json({"error": "empty question"}, 400)

        dataset = load_dataset()
        try:
            answer, facts_used = ask_model(question, dataset)
            return self._json({"answer": answer, "source": "model", "facts_used": facts_used})
        except Exception:
            # Model unreachable/slow/misbehaving — fall back to the book.
            return self._json({
                "answer": dataset_answer(dataset, question),
                "source": "dataset",
                "facts_used": [],
                "notice": "Model se rabta nahi ho saka (ya waqt lag gaya) — is liye kitab wali pakki maloomat de raha hun.",
            })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Baghbaan chal raha hai: http://localhost:{port}")
    print("Rokne ke liye Ctrl+C")
    srv.serve_forever()
