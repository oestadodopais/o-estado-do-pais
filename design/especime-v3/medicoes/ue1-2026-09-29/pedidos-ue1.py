#!/usr/bin/env python3
"""UE1: o ritmo dos pedidos do bloco, lido no registo do motor, e o intervalo com o cliente partilhado.

Uso (da raiz do sítio): python3 design/especime-v3/medicoes/ue1-2026-09-29/pedidos-ue1.py <worktree do motor>

Lê indicators/out/ue1-2026-09-29/pedidos.jsonl no motor (os 37 pedidos de 29.09.2026) e diz quantos
foram, a quem, e em quantos segundos; e mede, com o cliente que o guião corrigido partilha, a espera
entre dois pedidos ao mesmo anfitrião (sem pedir nada: chama só o regulador do cliente). Escreve
motor/pedidos-ue1.json. Não pede nada à rede.
"""
import collections
import datetime
import importlib.util
import json
import pathlib
import sys
import time
from urllib.parse import urlsplit

AQUI = pathlib.Path(__file__).resolve().parent
MOTOR = pathlib.Path(sys.argv[1]).expanduser().resolve()
sys.path.insert(0, str(MOTOR))
registo = MOTOR / "indicators/out/ue1-2026-09-29/pedidos.jsonl"
ps = [json.loads(l) for l in registo.read_text(encoding="utf-8").splitlines()]
horas = [datetime.datetime.fromisoformat(p["timestamp_utc"].replace("Z", "+00:00")) for p in ps]
por = collections.Counter(urlsplit(p["url"]).netloc for p in ps)
spec = importlib.util.spec_from_file_location("pedir_ue1", MOTOR / "indicators/out/ue1-2026-09-29/pedir.py")
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
c = m.cliente()
t0 = time.time()
c._throttle("http://publications.europa.eu/a")
c._throttle("http://publications.europa.eu/b")
espera = round(time.time() - t0, 1)
medidas = {
    "pedidos": {"valor": len(ps), "comando": "as linhas de indicators/out/ue1-2026-09-29/pedidos.jsonl, no motor", "o_que": "o primeiro é o RDF da Áustria", "encontrado": ps[0]["file"].endswith("op-country-AUT.rdf")},
    "pedidos_lidos": {"valor": sum(1 for p in ps if p["estado"] == "lido"), "comando": "o mesmo, os de estado «lido»", "o_que": "o da dívida pública está entre eles", "encontrado": any("divida-publica" in p["file"] and p["estado"] == "lido" for p in ps)},
    "pedidos_ao_servico_das_publicacoes": {"valor": por["publications.europa.eu"], "comando": "o mesmo, pelo anfitrião", "o_que": "o anfitrião aparece", "encontrado": por["publications.europa.eu"] > 0},
    "pedidos_ao_eurostat": {"valor": por["ec.europa.eu"], "comando": "o mesmo, pelo anfitrião", "o_que": "o anfitrião aparece", "encontrado": por["ec.europa.eu"] > 0},
    "segundos_do_primeiro_ao_ultimo_pedido": {"valor": int((max(horas) - min(horas)).total_seconds()), "comando": "a diferença entre a primeira e a última timestamp_utc do registo", "o_que": "as horas leram-se", "encontrado": len(horas) == len(ps)},
    "espera_com_o_cliente_partilhado": {"valor": espera, "comando": "cliente() do pedir.py corrigido, duas chamadas seguidas ao regulador do mesmo anfitrião, em segundos", "o_que": "o mesmo cliente volta nas duas chamadas", "encontrado": m.cliente() is c},
}
(AQUI / "motor").mkdir(exist_ok=True)
(AQUI / "motor" / "pedidos-ue1.json").write_text(json.dumps({"bloco": "UE1", "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for k, v in medidas.items():
    print(f"  {k}: {v['valor']}")
