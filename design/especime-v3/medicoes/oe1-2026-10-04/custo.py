"""Lê contadores da sessão, sem copiar mensagens ou caminhos para o relatório."""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

root = str(Path(sys.argv[1]).resolve())
directory = Path.home() / ".codex" / "sessions" / "2026" / "10" / "04"
passagem = next((p for p in ["oe1b", "oe1c"] if "--" + p in sys.argv), None)
if passagem:
    rotulo = {"oe1b": "OE1-b", "oe1c": "OE1-c"}[passagem]
    prefixo = {"oe1b": "OE1-b, do lugar de direção", "oe1c": "# OE1-c ·"}[passagem]
    # Só metadados e contadores saem deste processo. A ordem identifica o corte.
    allowed = {root, str(Path.cwd().resolve())}
    records = []
    starts = []
    for path in sorted(directory.glob("*.jsonl")):
        with path.open() as f:
            meta = json.loads(f.readline())
            if meta.get("payload", {}).get("cwd") not in allowed:
                continue
            events = []
            model = None
            for line in f:
                try:
                    j = json.loads(line)
                except ValueError:
                    continue
                p = j.get("payload", {})
                if j.get("type") == "turn_context":
                    model = p.get("model")
                if j.get("type") == "response_item" and p.get("role") == "user" and any(
                    part.get("text", "").startswith(prefixo) for part in p.get("content", [])):
                    starts.append(j["timestamp"])
                if j.get("type") == "event_msg" and p.get("type") == "token_count" and p.get("info"):
                    events.append((j["timestamp"], p["info"]["total_token_usage"]))
            records.append((meta["payload"]["id"], model, events))
    assert starts, f"A ordem {rotulo} não foi identificada no registo"
    start = min(starts)
    entries = []
    for sid, model, events in records:
        before = next((usage for stamp, usage in reversed(events) if stamp < start), {})
        if not events or events[-1][0] < start:
            continue
        stamp, after = events[-1]
        delta = {k: v - before.get(k, 0) for k, v in after.items()}
        assert all(v >= 0 for v in delta.values()), "Contador não cumulativo"
        entries.append(dict(sessao=sid, modelo=model, ultima_medicao=stamp,
                            contador_anterior=before, contador_atual=after, incremento=delta))
    assert entries
    now = datetime.now(timezone.utc)
    data = dict(passagem=rotulo, inicio=start, medido_em=now.isoformat(),
                segundos=int((now - datetime.fromisoformat(start.replace("Z", "+00:00"))).total_seconds()),
                sessoes=entries, tokens_totais=sum(s["incremento"]["total_tokens"] for s in entries),
                tokens_entrada_cache=sum(s["incremento"].get("cached_input_tokens", 0) for s in entries),
                tokens_entrada_sem_cache=sum(s["incremento"]["input_tokens"]-s["incremento"].get("cached_input_tokens", 0) for s in entries),
                tokens_saida=sum(s["incremento"]["output_tokens"] for s in entries),
                limite=f"Incremento desde o último contador anterior à ordem {rotulo} até ao último disponível. Inclui cache e revisões automáticas; não é preço monetário.")
    data["conhecido_positivo"] = sum(s["incremento"]["total_tokens"] for s in entries[1:]) < data["tokens_totais"]
    Path(__file__).with_name(f"custo-{passagem}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({k: data[k] for k in ["inicio", "segundos", "tokens_totais", "tokens_entrada_cache", "tokens_saida", "conhecido_positivo"]}))
    raise SystemExit(0)
sessions = []
for path in sorted(directory.glob("*.jsonl")):
    with path.open() as f:
        first = json.loads(f.readline())
    if first.get("payload", {}).get("cwd") != root:
        continue
    model = None
    usage = None
    observed = None
    with path.open() as f:
        for line in f:
            try:
                j = json.loads(line)
            except ValueError:
                continue
            p = j.get("payload", {})
            if j.get("type") == "turn_context":
                model = p.get("model")
            if j.get("type") == "event_msg" and p.get("type") == "token_count" and p.get("info"):
                usage = p["info"]["total_token_usage"]
                observed = j.get("timestamp")
    if usage:
        sessions.append(dict(sessao=first["payload"]["id"], modelo=model, inicio=first["timestamp"],
                             ultima_medicao=observed, tokens=usage))
assert sessions and any(s["modelo"] == "gpt-6-astra" for s in sessions), "Sessão do construtor não identificada"
now = datetime.now(timezone.utc)
start = min(datetime.fromisoformat(s["inicio"].replace("Z", "+00:00")) for s in sessions)
data = dict(origem="Eventos token_count das sessões deste bloco, filtrados pela worktree em memória.",
            medido_em=now.isoformat(), segundos=int((now - start).total_seconds()), sessoes=sessions,
            tokens_totais=sum(s["tokens"]["total_tokens"] for s in sessions),
            tokens_entrada_cache=sum(s["tokens"].get("cached_input_tokens", 0) for s in sessions),
            tokens_entrada_sem_cache=sum(s["tokens"]["input_tokens"]-s["tokens"].get("cached_input_tokens", 0) for s in sessions),
            tokens_saida=sum(s["tokens"]["output_tokens"] for s in sessions),
            limite="Corte no último contador disponível; mensagens e trabalho posteriores não estão incluídos.")
# Conhecido positivo: remover uma sessão com utilização diminui o total.
data["conhecido_positivo"] = sum(s["tokens"]["total_tokens"] for s in sessions[1:]) < data["tokens_totais"]
Path(__file__).with_name("custo.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({k: data[k] for k in ["segundos", "tokens_totais", "tokens_entrada_cache", "tokens_entrada_sem_cache", "tokens_saida", "conhecido_positivo"]}))
