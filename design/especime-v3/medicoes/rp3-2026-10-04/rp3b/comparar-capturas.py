#!/usr/bin/env python3
"""RP3-b: as capturas da cabeça rebaseada contra as da primeira entrega, imagem a imagem, em capturas-rp3b-comparacao.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/rp3-2026-10-04/rp3b/comparar-capturas.py

Lê os dois manifestos do captor (`capturas-rp3.json`, da primeira entrega, e `rp3b/capturas-rp3b.json`, da cabeça
rebaseada), refaz o sha256 de cada imagem nos dois lados a partir dos bytes (as da primeira entrega estão no
repositório, as novas na pasta que o captor recebeu), confere que cada um é o que o seu manifesto diz, e emparelha as
imagens pelo nome (o recibo ou o antes, a edição e a largura).

AS IMAGENS DA CABEÇA REBASEADA NÃO FICAM NO REPOSITÓRIO quando são todas iguais às da primeira entrega: seriam 18 MB
repetidos em cada cópia do repositório para mostrar o que as da primeira entrega já mostram. Este guião corre com elas
ainda no disco, e o ficheiro que escreve guarda o que leu nesse momento; para as refazer, o captor com
`RP3_CAPTURAS_MANIFESTO=rp3b/capturas-rp3b.json` e a pasta `rp3b/capturas`, como diz o relatório.
"""
import hashlib
import json
import os

PASTA = "design/especime-v3/medicoes/rp3-2026-10-04"
velho = json.load(open(f"{PASTA}/capturas-rp3.json", encoding="utf-8"))
novo = json.load(open(f"{PASTA}/rp3b/capturas-rp3b.json", encoding="utf-8"))
sha = lambda rel: hashlib.sha256(open(rel, "rb").read()).hexdigest() if os.path.isfile(rel) else None
imagens = lambda m: {os.path.basename(r["ficheiro"]): r for r in m["resultados"] + m["antes"]}
V, N = imagens(velho), imagens(novo)
pares = []
for nome in sorted(set(V) | set(N)):
    v, n = V.get(nome), N.get(nome)
    pares.append({
        "imagem": nome,
        "sha256_primeira_entrega": v and v["sha256"],
        "sha256_cabeca_rebaseada": n and n["sha256"],
        "os_bytes_da_primeira_dizem_o_mesmo": bool(v) and sha(v["ficheiro"]) == v["sha256"],
        "os_bytes_da_rebaseada_dizem_o_mesmo": bool(n) and sha(n["ficheiro"]) == n["sha256"],
        "iguais": bool(v and n) and v["sha256"] == n["sha256"],
    })
saida = {
    "_": f"Escrito por {PASTA}/rp3b/comparar-capturas.py. Não se edita à mão.",
    "construcao_da_primeira_entrega": velho["construcao"]["commit"],
    "construcao_da_cabeca_rebaseada": novo["construcao"]["commit"],
    "imagens": len(pares),
    "iguais": sum(1 for p in pares if p["iguais"]),
    "diferentes": [p["imagem"] for p in pares if not p["iguais"]],
    "problemas_na_cabeca_rebaseada": novo["problemas"],
    "pedidos_para_fora_recusados_na_cabeca_rebaseada": novo["pedidos_recusados_para_fora"],
    "conhecido_positivo": {
        "o_que": "o sha256 refeito dos bytes de cada imagem dos dois lados é o que o seu manifesto diz (o método de comparação lê as imagens, não só os manifestos)",
        "encontrado": all(p["os_bytes_da_primeira_dizem_o_mesmo"] and p["os_bytes_da_rebaseada_dizem_o_mesmo"] for p in pares),
    },
    "as_imagens_da_cabeca_rebaseada": ("apagadas depois desta comparação, por serem todas iguais às da primeira entrega" if all(p["iguais"] for p in pares)
                                        else "ficam no repositório, porque há imagens diferentes"),
    "pares": pares,
}
with open(f"{PASTA}/rp3b/capturas-rp3b-comparacao.json", "w", encoding="utf-8") as f:
    f.write(json.dumps(saida, ensure_ascii=False, indent=2) + "\n")
print(f"capturas: {saida['iguais']} de {saida['imagens']} iguais; diferentes: {saida['diferentes']}; conhecido-positivo: {saida['conhecido_positivo']['encontrado']}")
raise SystemExit(0 if saida["conhecido_positivo"]["encontrado"] else 1)
