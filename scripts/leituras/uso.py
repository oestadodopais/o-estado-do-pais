#!/usr/bin/env python3
"""O uso das duas subscrições, lido do terminal, antes de um bloco pesado.

uso: python3 scripts/leituras/uso.py

Claude: a linha de estado do Claude Code escreve o que a ferramenta lhe dá em
`~/.claude/usage-latest.json` a cada resposta (`rate_limits.five_hour` e
`rate_limits.seven_day`, cada um com `used_percentage` e `resets_at`).

Codex: o Codex escreve uma leitura dos limites em cada evento `token_count` dos
registos das suas sessões (`~/.codex/sessions/AAAA/MM/DD/rollout-*.jsonl`):
`rate_limits.primary` e `rate_limits.secondary`, cada um com `used_percent`,
`window_minutes` e `resets_at`. A leitura é tão fresca quanto a última corrida
do Codex nesta máquina: o guião diz de quando é, e se a janela já foi reposta
depois dela diz isso em vez de mostrar uma percentagem velha.

Não escreve nada e não fala com rede nenhuma. Sai a 0 se leu as duas, a 1 se
alguma não se pôde ler: uma ausência diz-se, não se adivinha.
"""

import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

CLAUDE = Path.home() / ".claude" / "usage-latest.json"
CODEX = Path.home() / ".codex" / "sessions"
# Quantos registos do Codex, dos mais recentes, se abrem à procura de uma leitura.
REGISTOS_A_ABRIR = 12


def quando(epoch):
    return datetime.fromtimestamp(epoch, tz=timezone.utc).strftime("%d.%m.%Y %H:%M UTC")


def janela(minutos):
    if minutos is None:
        return "janela"
    if minutos % 1440 == 0:
        dias = minutos // 1440
        return "semana" if dias == 7 else f"janela de {dias} dias"
    if minutos % 60 == 0:
        return f"janela de {minutos // 60} horas"
    return f"janela de {minutos} minutos"


def claude():
    try:
        dados = json.loads(CLAUDE.read_text(encoding="utf-8"))
    except (OSError, ValueError) as erro:
        print(f"Claude: não se leu {CLAUDE} ({erro.__class__.__name__}); pede-se o número ao diretor.")
        return False
    limites = dados.get("rate_limits") or {}
    escrito = quando(CLAUDE.stat().st_mtime)
    linhas = []
    for chave, nome in (("five_hour", "janela de 5 horas"), ("seven_day", "semana")):
        lido = limites.get(chave)
        if not lido or lido.get("used_percentage") is None:
            continue
        repoe = lido.get("resets_at")
        linhas.append(
            f"  {nome}: {lido['used_percentage']}% usados"
            + (f", repõe a {quando(repoe)}" if repoe else "")
        )
    if not linhas:
        print(f"Claude: {CLAUDE} não traz limites (escrito a {escrito}); pede-se o número ao diretor.")
        return False
    print(f"Claude (escrito pela linha de estado a {escrito}):")
    print("\n".join(linhas))
    return True


def ultima_leitura_do_codex():
    """A leitura de limites mais recente, pela data do próprio evento."""
    try:
        registos = sorted(CODEX.rglob("rollout-*.jsonl"), key=lambda p: p.stat().st_mtime, reverse=True)
    except OSError:
        return None
    melhor = None
    for registo in registos[:REGISTOS_A_ABRIR]:
        try:
            with registo.open("r", encoding="utf-8", errors="replace") as linhas:
                for linha in linhas:
                    if '"rate_limits"' not in linha:
                        continue
                    try:
                        evento = json.loads(linha)
                    except ValueError:
                        continue
                    carga = evento.get("payload") or {}
                    limites = carga.get("rate_limits") if isinstance(carga, dict) else None
                    if not limites:
                        continue
                    marca = evento.get("timestamp") or ""
                    if melhor is None or marca > melhor[0]:
                        melhor = (marca, limites)
        except OSError:
            continue
    return melhor


def codex():
    lida = ultima_leitura_do_codex()
    if lida is None:
        print(f"Codex: nenhuma leitura de limites nos {REGISTOS_A_ABRIR} registos mais recentes de {CODEX}; pede-se o número ao diretor.")
        return False
    marca, limites = lida
    agora = time.time()
    print(f"Codex (última leitura: {marca}; plano «{limites.get('plan_type')}»):")
    alguma = False
    for chave in ("primary", "secondary"):
        lido = limites.get(chave)
        if not lido or lido.get("used_percent") is None:
            continue
        alguma = True
        nome = janela(lido.get("window_minutes"))
        repoe = lido.get("resets_at")
        if repoe and repoe < agora:
            print(
                f"  {nome}: reposta a {quando(repoe)}, sem leitura depois da reposição "
                f"(a última dizia {lido['used_percent']}% usados); a primeira corrida do Codex dá o número novo."
            )
        else:
            print(
                f"  {nome}: {lido['used_percent']}% usados"
                + (f", repõe a {quando(repoe)}" if repoe else "")
            )
    if not alguma:
        print("  a leitura não traz nenhuma janela com percentagem; pede-se o número ao diretor.")
    return alguma


if __name__ == "__main__":
    leu_claude = claude()
    leu_codex = codex()
    sys.exit(0 if (leu_claude and leu_codex) else 1)
