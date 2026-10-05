#!/usr/bin/env python3
"""C2 (05.10.2026): a cabeça e a árvore em que correu cada registo de trabalho desta pasta (a M50).

uso (da raiz do sítio): python3 design/especime-v3/medicoes/c2-2026-10-05/registos-de-trabalho.py

Os registos dos portões, das capturas de depois, das plantas, dos recibos e das medidas correram na cabeça do código com
a árvore limpa, e dizem-no eles próprios (`portoes/cabeca`, `portoes/estado.fim`, `apos-os-portoes.cabeca` e
`.estado`). Os registos intermédios correram entre dois commits, sobre mudanças ainda por commitar que passaram a ser o
commit seguinte. Este guião não o afirma de memória: prova-o onde um ficheiro o permite (os resumos das linhas
compostas em `aplicacao.json` contra os bytes do commit `8dbdcac2`; as cabeças que as leituras escreveram) e diz o
que só se lê pela ordem dos commits. Escreve `registos-de-trabalho.json`.
"""
import hashlib
import json
import os
import subprocess

PASTA = "design/especime-v3/medicoes/c2-2026-10-05"
NOVE = ["custo-unitario-do-trabalho-2024", "despesa-em-id-2024-ue", "formacao-bruta-de-capital-fixo-2024",
        "formacao-bruta-de-capital-fixo-2025", "pib-real-per-capita-2024", "pib-real-per-capita-2025",
        "posicao-de-investimento-internacional-2024", "posicao-de-investimento-internacional-2025",
        "saldo-da-balanca-corrente-2024"]


def git(*a):
    return subprocess.check_output(["git", *a], text=True).strip()


def j(rel):
    p = os.path.join(PASTA, rel)
    return json.load(open(p, encoding="utf-8")) if os.path.isfile(p) else None


def txt(rel):
    p = os.path.join(PASTA, rel)
    return open(p, encoding="utf-8").read().strip() if os.path.isfile(p) else None


ap = j("aplicacao.json") or {}
iguais = []
for l in ap.get("linhas", []):
    bytes_do_commit = subprocess.check_output(["git", "show", f"8dbdcac2:ledger/claims/{l['id']}.yml"])
    iguais.append(hashlib.sha256(bytes_do_commit).hexdigest() == l["depois_sha256"])
la, ld = j("leituras-antes.json") or {}, j("leituras-depois.json") or {}
mot = j("motor/motor-c2.json") or {}
registos = [
    {"registo": "brief-reproduzido.json", "cabeca": "006685ae", "arvore": "limpa no que o git segue",
     "prova": "o guião lê só a cabeça presa 3a253f73 pelo git (git show), e não a árvore"},
    {"registo": "capturas-antes.json", "cabeca": (j("capturas-antes.json") or {}).get("commit"), "arvore": "uma exportação do commit (git archive)",
     "prova": "o manifesto escreve o commit da exportação"},
    {"registo": "leituras-antes.json", "cabeca": la.get("cabeca"), "arvore": f"{la.get('linhas_do_livro_mudadas_na_arvore')} linha(s) do livro mudada(s)",
     "prova": "o próprio ficheiro escreve a cabeça e as linhas do livro mudadas na árvore"},
    {"registo": "aplicacao.json e aplicar-releituras.log", "cabeca": "006685ae", "arvore": "as linhas lidas pela cabeça presa 3a253f73 (git show), e escritas na árvore",
     "prova": f"o resumo de cada linha composta é o dos bytes do commit 8dbdcac2 em {sum(iguais)} de {len(iguais)} linhas",
     "linhas_iguais_ao_commit": sum(iguais)},
    {"registo": "selar-historias.log e .codigos, ledger-check-1.log e .codigo, leituras-depois.json", "cabeca": ld.get("cabeca"),
     "arvore": f"as nove linhas compostas e o registo das histórias, ainda por commitar ({ld.get('linhas_do_livro_mudadas_na_arvore')} linha(s) do livro mudada(s), dita(s) pelas leituras de depois)",
     "prova": "as linhas da árvore eram as compostas (a linha acima), e o commit seguinte, 8dbdcac2, é essas linhas e o registo das histórias"},
    {"registo": "ledger-check-2.log e .codigo", "cabeca": "8dbdcac2", "arvore": "as reconferências que o painel do fim escreveu nas nove linhas, ainda por commitar",
     "prova": "pela ordem dos commits: o commit seguinte, 9163309e, é exatamente as nove linhas que o painel escreveu"},
    {"registo": "build-sem-o-lugar-das-linhas.log e .codigo", "cabeca": "8dbdcac2", "arvore": "limpa no que o git segue",
     "prova": "pela ordem dos commits: a construção falhou antes do carimbo da versão; a queixa (a linha do custo unitário do trabalho de 2024 sem lugar declarado) só existe entre 8dbdcac2 e d08325c2, que a declarou"},
    {"registo": "build-a1-pela-primeira-geografia.log e .codigo", "cabeca": "69c727f3", "arvore": "limpa no que o git segue",
     "prova": "o próprio registo escreve «versão · 69c727f», do carimbo da construção", "versao_no_registo": "69c727f" in open(os.path.join(PASTA, "build-a1-pela-primeira-geografia.log"), encoding="utf-8").read()},
    {"registo": "motor/motor-c2.json", "cabeca": mot.get("cabeca"), "arvore": "limpa" if mot.get("arvore_limpa") else "suja",
     "prova": "o próprio ficheiro escreve a cabeça do motor e o estado da árvore"},
    {"registo": "portoes-b72e639d/", "cabeca": txt("portoes-b72e639d/cabeca"), "arvore": "limpa no que o git segue" if txt("portoes-b72e639d/estado.fim").replace("?? design/especime-v3/capturas/c2-2026-10-05/", "").replace("?? design/especime-v3/medicoes/c2-2026-10-05/", "").replace("?? node_modules", "").strip() == "" else "suja",
     "prova": "portoes-b72e639d/cabeca e estado.fim, escritos por scripts/leituras/portoes.sh (só ficheiros por seguir: esta pasta, a das capturas e a ligação das dependências)"},
    {"registo": "rotulos-escrever.log e .codigo, check-rotulos-depois-de-escrever.log e .codigo", "cabeca": "b72e639d",
     "arvore": "a construção dessa cabeça; o segundo correu com o inventário reescrito por commitar",
     "prova": "o inventário na árvore é, byte a byte, o do commit fdd7ec9a", "inventario_igual_ao_commit": hashlib.sha256(open("design/especime-v3/rotulos/INVENTARIO.json", "rb").read()).hexdigest() == hashlib.sha256(subprocess.check_output(["git", "show", "fdd7ec9a:design/especime-v3/rotulos/INVENTARIO.json"])).hexdigest()},
    {"registo": "check-voz-sem-a-contagem-nova.log, com o código na linha check:voz de resto-da-cadeia-na-69c727f3.codigos (os códigos das 6 conferências do fim da cadeia do build, corridas à mão sobre essa construção)", "cabeca": "69c727f3",
     "arvore": "a construção dessa cabeça, com as emendas da A1 e do executor das plantas por commitar (o commit 9789d36b), que o check:voz não lê",
     "prova": "pela ordem dos commits: a construção lida é a do registo build-a1-pela-primeira-geografia.log, que escreve «versão · 69c727f»; a queixa (a contagem de 72 sem linha no inventário) só existe entre 8dbdcac2 e 729562f8"},
    {"registo": "motor/gate-final.*", "cabeca": txt("motor/gate-final.cabeca"), "arvore": "limpa" if txt("motor/gate-final.estado") == "" else "suja",
     "prova": "motor/gate-final.cabeca e motor/gate-final.estado, escritos antes de correr o core.gate"},
    {"registo": "portoes/", "cabeca": txt("portoes/cabeca"), "arvore": "limpa no que o git segue" if txt("portoes/estado.fim") == "" else f"estado: {txt('portoes/estado.fim')}",
     "prova": "portoes/cabeca, portoes/cabeca.fim e portoes/estado.fim, escritos por scripts/leituras/portoes.sh"},
    {"registo": "plantas-pais.json, recibos-c2.json, capturas-depois.json, paginas-c2.json", "cabeca": txt("apos-os-portoes.cabeca"),
     "arvore": "limpa no que o git segue" if txt("apos-os-portoes.estado") == "" else f"estado: {txt('apos-os-portoes.estado')}",
     "prova": "apos-os-portoes.cabeca e apos-os-portoes.estado, escritos por apos-os-portoes.sh antes dos passos"},
]
saida = {"_": "Escrito por design/especime-v3/medicoes/c2-2026-10-05/registos-de-trabalho.py. Não se edita à mão.",
         "registos": registos,
         "linhas_compostas_iguais_ao_commit_8dbdcac2": sum(iguais),
         "conhecido_positivo": {"o_que": "a mesma comparação, contra os bytes da cabeça presa 3a253f73, dá diferente nas nove",
                                "encontrado": all(hashlib.sha256(subprocess.check_output(["git", "show", f"3a253f73:ledger/claims/{l['id']}.yml"])).hexdigest() != l["depois_sha256"]
                                                  for l in ap.get("linhas", [])) and bool(ap.get("linhas"))}}
with open(os.path.join(PASTA, "registos-de-trabalho.json"), "w", encoding="utf-8") as f:
    json.dump(saida, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"registos-de-trabalho: {len(registos)} registos; {sum(iguais)} de {len(iguais)} linhas compostas iguais ao commit 8dbdcac2; conhecido-positivo {saida['conhecido_positivo']['encontrado']}")
