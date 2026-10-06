#!/usr/bin/env python3
"""EX1: o custo do bloco em símbolos e em segundos, lido do registo da sessão do construtor (a cópia do guião do RP4-c).

Uso: python3 design/especime-v3/medicoes/ex1-2026-10-05/custo.py <registo da sessão do construtor, .jsonl> [<ficheiro de saída>]

O registo é o ficheiro que a ferramenta escreve para a sessão do agente (uma linha por acontecimento). Cada
resposta do modelo traz o seu `usage`; uma resposta com várias partes repete o mesmo `id` em várias linhas, e
conta-se uma vez: os campos de entrada pela última linha desse `id`, e o de saída pelo maior valor que as linhas
desse `id` registam. Escreve `custo.json` nesta pasta (ou o ficheiro que o segundo argumento nomear, nesta pasta: a
passagem RP4-m-b escreve `custo-rp4mb.json`, e o do bloco fica como estava), sem o caminho do registo (que é da máquina) e com o
resumo sha256 dos bytes lidos, para que a leitura se possa repetir sobre o mesmo ficheiro.

A SAÍDA É UM MÍNIMO, E O GUIÃO MEDE PORQUÊ: na maior parte das respostas o registo guarda o `usage` de um momento
do fluxo, antes de a resposta acabar (uma resposta com dezenas de milhares de caracteres de raciocínio regista
uma saída de poucos símbolos). O guião conta as respostas com mais de mil caracteres e dez símbolos de saída
ou menos, e escreve a contagem ao lado da soma: a soma da saída é um mínimo, e não a saída.

O que isto NÃO é: o total que a ferramenta reporta ao lugar de direção quando o agente acaba (esse lê-se do lado
de quem lançou); aqui somam-se os campos de cada resposta até ao momento da leitura, e o registo continua a
crescer até ao fim da sessão.
"""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
# A PASSAGEM RP4-c-b (05.10.2026): `--desde <instante ISO>` conta só as entradas do registo desde esse instante (a passagem
# corre na mesma sessão do bloco), e a saída pode ser um caminho dentro desta pasta (`rp4cb/custo.json`).
args = [a for a in sys.argv[1:]]
DESDE = None
if "--desde" in args:
    i = args.index("--desde"); DESDE = args[i + 1]; del args[i:i + 2]
registo = Path(args[0])
SAIDA = args[1] if len(args) > 1 else "custo.json"
dados = registo.read_bytes()
por_id = {}
modelos = {}
primeira = ultima = None
for linha in dados.decode("utf-8").splitlines():
    d = json.loads(linha)
    t = d.get("timestamp")
    if DESDE and (not t or t < DESDE):
        continue
    if t:
        primeira = primeira or t
        ultima = t
    m = d.get("message")
    if isinstance(m, dict) and m.get("usage") and m.get("id"):
        anterior = por_id.get(m["id"], {})
        u = dict(m["usage"])
        u["output_tokens"] = max(int(u.get("output_tokens") or 0), int(anterior.get("output_tokens") or 0))
        u["_caracteres"] = int(anterior.get("_caracteres") or 0) + len(json.dumps(m.get("content"), ensure_ascii=False))
        por_id[m["id"]] = u
        modelos[m.get("model")] = modelos.get(m.get("model"), 0) + 1
CAMPOS = ("input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens", "output_tokens")
somas = {k: sum(int(u.get(k) or 0) for u in por_id.values()) for k in CAMPOS}
saida_por_momento = sum(1 for u in por_id.values() if u["_caracteres"] > 1000 and int(u.get("output_tokens") or 0) <= 10)


def instante(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


agora = datetime.now(timezone.utc)
saida = {
    "o_que": "o custo do bloco EX1, lido do registo da sessão do construtor (custo.py)" if SAIDA == "custo.json" and not DESDE
              else f"o custo da passagem que escreveu {SAIDA}, lido do registo da sessão do seu construtor (custo.py)",
    "registo_sha256": hashlib.sha256(dados).hexdigest(),
    "respostas_do_modelo": len(por_id),
    "modelos": modelos,
    "simbolos": somas,
    "simbolos_de_entrada": somas["input_tokens"] + somas["cache_creation_input_tokens"] + somas["cache_read_input_tokens"],
    "simbolos_de_entrada_quer_dizer": "a entrada de cada resposta, somada: a nova, a escrita na cache e a lida da cache",
    "simbolos_de_saida_minimo": somas["output_tokens"],
    "respostas_com_a_saida_de_um_momento_do_fluxo": saida_por_momento,
    "simbolos_de_saida_quer_dizer": "um mínimo: em tantas respostas quantas a contagem ao lado, o registo guardou a saída de um momento do fluxo e não a final",
    "primeira_entrada": primeira,
    "ultima_entrada": ultima,
    "lido_em": agora.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "segundos": int((agora - instante(primeira)).total_seconds()) if primeira else None,
    "segundos_quer_dizer": "da primeira entrada do registo da sessão até ao momento desta leitura",
    "desde": DESDE,
    "desde_quer_dizer": "só as entradas do registo desde este instante (a passagem que escreveu o ficheiro); null quer dizer o registo inteiro",
}
(AQUI / SAIDA).parent.mkdir(parents=True, exist_ok=True)
(AQUI / SAIDA).write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({k: saida[k] for k in ("respostas_do_modelo", "simbolos_de_entrada", "simbolos_de_saida_minimo", "respostas_com_a_saida_de_um_momento_do_fluxo", "segundos")}, ensure_ascii=False))
