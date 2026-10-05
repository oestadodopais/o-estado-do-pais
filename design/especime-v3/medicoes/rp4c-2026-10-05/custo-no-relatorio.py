#!/usr/bin/env python3
"""RP4-c-b: escreve o parágrafo do custo da passagem no relatório a partir do `medidas.json` (as medidas `rp4cb.custo.*` e
`rp4cb.custo-da-sessao.*`), para nenhum número do custo se escrever à mão. Troca o marcador `CUSTO_RP4CB`, ou o parágrafo
que ele já escreveu (o que vem depois de «**O custo.** » até ao fim da linha), pelo de agora.

Uso: python3 design/especime-v3/medicoes/rp4c-2026-10-05/custo-no-relatorio.py"""
import json, re
from pathlib import Path
AQUI = Path(__file__).resolve().parent
m = {x["nome"]: x["valor"] for x in json.loads((AQUI / "medidas.json").read_text(encoding="utf-8"))["medidas"]}
def n(v):
    return f"{v:,}".replace(",", " ") if isinstance(v, int) else str(v)
texto = (f"Modelo: Claude Opus 5.5 em todas as respostas (`rp4cb/custo.json`, escrito por `custo.py` sobre o registo da sessão do "
         f"construtor, só desde o primeiro comando desta passagem, às 20:07:55 UTC). {n(m['rp4cb.custo.segundos'])} segundos desde então até à "
         f"leitura, {n(m['rp4cb.custo.respostas_do_modelo'])} respostas do modelo, {n(m['rp4cb.custo.simbolos_de_entrada'])} símbolos de entrada "
         f"(a nova, a escrita na cache e a lida da cache), e uma saída de pelo menos {n(m['rp4cb.custo.simbolos_de_saida_minimo'])} símbolos (em "
         f"{n(m['rp4cb.custo.respostas_com_a_saida_de_um_momento_do_fluxo'])} respostas o registo guardou a saída de um momento do fluxo). A sessão "
         f"inteira, o bloco e a passagem (`rp4cb/custo-da-sessao.json`): {n(m['rp4cb.custo-da-sessao.segundos'])} segundos, "
         f"{n(m['rp4cb.custo-da-sessao.respostas_do_modelo'])} respostas e {n(m['rp4cb.custo-da-sessao.simbolos_de_entrada'])} símbolos de entrada. "
         f"O total cumulativo que a ferramenta reporta lê-se do lado de quem lançou.")
p = AQUI / "LEIA-ME.md"
s = p.read_text(encoding="utf-8")
i = s.index("## RP4-c-b, a passagem do peso")
a, b = s[:i], s[i:]
if "CUSTO_RP4CB" in b:
    b = b.replace("CUSTO_RP4CB", texto)
else:
    b = re.sub(r"(\*\*O custo\.\*\* )[^\n]*", lambda x: x.group(1) + texto, b, count=1)
p.write_text(a + b, encoding="utf-8")
print(texto)
