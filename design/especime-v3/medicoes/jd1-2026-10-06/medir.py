"""Mede o JD1 nos livros, pedidos, provas e códigos; compõe o relatório sem contagens manuais.

RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/jd1-2026-10-06/medir.py
"""
import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITE = AQUI.parents[3]
MOTOR = Path(os.environ["RESEARCHHUB_DIR"])
sys.path.insert(0, str(MOTOR))
from publisher import jd1_test
from correr import limpa


def js(expression):
    return json.loads(subprocess.check_output(["node", "--input-type=module", "-e", expression], cwd=SITE, text=True))


def git(repo, *args):
    return subprocess.check_output(["git", *args], cwd=repo, text=True).strip()


def file_json(p):
    return json.loads(p.read_text())


def code(name, pasta="portoes"):
    p = AQUI / pasta / (name + ".codigo")
    return int(p.read_text().strip()) if p.exists() else "[verify]"


def head(name):
    p = AQUI / "portoes" / name
    return p.read_text().strip() if p.exists() else "[verify]"


def main():
    manifest = file_json(MOTOR / "publisher/manifest.jd1.json")
    ids = {r["site_id"] for r in manifest["rows"]}
    livro = file_json(MOTOR / "content/20 Orcamento do Estado/ledger.json")
    linhas = [r for r in livro["claims"] if r["id"] in ids]
    serie = next(s for s in file_json(MOTOR / "content/13 Dominios/series-periodo.json")["series"] if s["id"] == "serie-obrigacoes-do-tesouro-10-anos-rendibilidade")
    pasta = MOTOR / "indicators/out/jd1-2026-10-06"
    pedidos = [json.loads(s) for s in (pasta / "pedidos.jsonl").read_text().splitlines()]
    extracoes = [json.loads(s) for s in (pasta / "extracoes.jsonl").read_text().splitlines()]
    financiamento = next(p for p in pedidos if p["file"].endswith("igcp-financiamento-setembro-2026.pdf"))
    financiamento_texto = next(e for e in extracoes if e["origem"] == financiamento["file"])
    financiamento_paginas = [str(n) for n, texto in enumerate((pasta / financiamento_texto["file"]).read_text().split("\f"), 1) if texto.strip()]
    for p in pedidos:
        assert hashlib.sha256((pasta / p["file"]).read_bytes()).hexdigest() == p["sha256"]
    for e in extracoes:
        assert hashlib.sha256((pasta / e["file"]).read_bytes()).hexdigest() == e["sha256"]
    familias = js("import {FAMILIAS_JD1 as f} from './design/especime-v3/medicoes/jd1-2026-10-06/familias.mjs'; console.log(JSON.stringify(f));")
    frase_serie = js("import {SERIES_R4 as s} from './design/especime-v3/medicoes/r4-2026-10-05/series-r4.mjs'; console.log(JSON.stringify(s.find(x => x.serie === 'serie-obrigacoes-do-tesouro-10-anos-rendibilidade')));")
    por = js("import {LINHAS_POR_CONFIRMAR_NA_FONTE as l} from './src/data/o-que-e-das-familias.mjs'; import {SERIES_POR_CONFIRMAR_NA_FONTE as s} from './src/data/o-que-e-das-series.mjs'; console.log(JSON.stringify({l,s}));")
    por_novas = sorted(ids & set(por["l"]))
    assert not por_novas and serie["id"] not in por["s"]
    mapa = {k: f for f in familias for k in f["chaves"]}
    def familia(id):
        return mapa[re.sub(r"-\d{4}(?:-\d{2})?(?=(?:-ue)?$)", "", id)]
    plantas = jd1_test.run()
    caminhos_protegidos = [":(glob)indicators/*.json", "indicators/vintages.json", ".maintenance-locks", "sweeps", "publisher/recortes/manifest.regioes.json"]
    protegidos = git(MOTOR, "diff", "--name-only", "465d01e7853f2729fcaa4ba63160b6338ba5de1e", "--", *caminhos_protegidos)
    protegidos += git(MOTOR, "status", "--porcelain", "--", *caminhos_protegidos)
    assert not protegidos, "JD1: ficheiro de outra corrida alterado"
    captura = file_json(AQUI / "capturas.json") if (AQUI / "capturas.json").exists() else {"capturas": [], "problemas": ["[verify]"]}
    visual = file_json(AQUI / "inspecao-visual.json") if (AQUI / "inspecao-visual.json").exists() else {"capturas": []}
    enquadramento = file_json(AQUI / "plantas-enquadramento.json") if (AQUI / "plantas-enquadramento.json").exists() else {"plantas": [], "erros": ["[verify]"]}
    plantas += enquadramento["plantas"] + captura.get("plantas", [])
    if (AQUI / "plantas-l1.json").exists():
        plantas += file_json(AQUI / "plantas-l1.json")
    indice = file_json(AQUI / "indice.json") if (AQUI / "indice.json").exists() else {}
    for planta in indice.get("medida", {}).get("plantas_localizadores", {}).get("plantas", []):
        if planta["nome"].startswith("JD1:"):
            plantas.append(dict(nome=planta["nome"], mensagem=planta["queixa_I1"], planta=True, passou=planta["mordeu"], queixas=planta["queixas_I3"]))
    rotulos = file_json(AQUI / "rotulos.json") if (AQUI / "rotulos.json").exists() else {}
    for planta in rotulos.get("plantas", []):
        if planta["nome"].startswith("jd1-"):
            plantas.append(dict(nome=planta["nome"], mensagem=planta["queixa"], planta=True, passou=planta["mordeu"]))
    l1 = file_json(AQUI / "l1-jd1.json") if (AQUI / "l1-jd1.json").exists() else {}
    (AQUI / "plantas.json").write_text(json.dumps(plantas, ensure_ascii=False, indent=2) + "\n")
    for c in captura["capturas"]:
        assert hashlib.sha256((SITE / c["ficheiro"]).read_bytes()).hexdigest() == c["sha256"], "JD1: captura alterada"
    dados = dict(linhas=len(linhas), diretas=sum(not r.get("derived_from") for r in linhas), derivadas=sum(bool(r.get("derived_from")) for r in linhas),
                 familias=len(familias), por_confirmar_novas=len(por_novas), pedidos=len(pedidos), http_200=sum(p["http"] == 200 for p in pedidos),
                 pedidos_lidos=sum(p["estado"] == "lido" for p in pedidos), extracoes=len(extracoes),
                 serie=dict(id=serie["id"], pontos=len(serie["pontos"]), primeiro=serie["primeiro_periodo"], ultimo=serie["pontos"][-1], lacunas=len(serie["lacunas"])),
                 inspecao_visual=len(visual["capturas"]),
                 capturas=len(captura["capturas"]), interacoes=len(captura.get("interacoes", [])), problemas_capturas=captura["problemas"],
                 problemas_enquadramento=enquadramento["erros"],
                 plantas=sum(p["planta"] for p in plantas), conferencias=len(plantas),
                 portoes={n: code(n) for n in ["build", "verify", "typecheck", "motor"]},
                 portoes_iniciais={n: code(n, "portoes-iniciais") for n in ["build", "verify", "typecheck"]},
                 portoes_lingua={n: code(n, "portoes-lingua") for n in ["build", "verify", "typecheck"]},
                 portoes_l1={n: code(n, "portoes-l1") for n in ["build", "verify", "typecheck"]},
                 l1=l1.get("contagens", {}),
                 conferencias_focadas={n: code(n) for n in ["indice", "rotulos", "tipos_guardas"]},
                 preflight=int((AQUI / "preflight.codigo").read_text()),
                 cabecas_codigo=dict(sitio=head("cabeca"), motor=head("motor.cabeca")),
                 ficheiros_protegidos_alterados=len(protegidos.splitlines()) if protegidos else 0)
    if "--final" in sys.argv:
        assert set(dados["portoes"].values()) == {0}, "JD1: portões por fechar"
        assert set(dados["conferencias_focadas"].values()) == {0}, "JD1: guardas por fechar"
        assert indice and rotulos, "JD1: plantas dos guardas em falta"
        assert not captura["problemas"] and captura["capturas"], "JD1: capturas por conferir"
        assert not enquadramento["erros"] and enquadramento["plantas"], "JD1: enquadramento por conferir"
        assert all(p["passou"] for p in plantas) and captura.get("plantas"), "JD1: planta por fechar"
        assert visual["construcao"] == captura["construcao"], "JD1: inspeção visual de outra construção"
        assert {c["ficheiro"] for c in visual["capturas"]} == {c["ficheiro"] for c in captura["capturas"] if c["largura"] in [390, 1280]}, "JD1: inspeção visual incompleta"
        assert captura["construcao"] == dados["cabecas_codigo"]["sitio"], "JD1: capturas de outra construção"
        assert git(MOTOR, "rev-parse", "HEAD") == dados["cabecas_codigo"]["motor"], "JD1: portão do motor de outra cabeça"
    (AQUI / "medicoes.json").write_text(json.dumps(dados, ensure_ascii=False, indent=2) + "\n")
    comando = "RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/jd1-2026-10-06/medir.py" + (" --final" if "--final" in sys.argv else "")
    out = ["# JD1 · juros e dívida do Estado", "", "Relatório gerado pelos livros e pelos registos reais. A leitura a frio do Opus e a conferência do lugar de direção ficam por realizar.", "",
           f"Comando: `{comando}`. As contagens estão em `medicoes.json`; as provas em `plantas.json`; os pedidos originais e as extrações em `<motor>/indicators/out/jd1-2026-10-06/`.", "",
           f"O bloco acrescenta {dados['linhas']} linhas: {dados['diretas']} leituras diretas e {dados['derivadas']} percentagens calculadas sobre operandos do livro. Tem {dados['familias']} famílias novas e {dados['por_confirmar_novas']} linhas novas por confirmar na fonte.", "",
           "## Cabeças do código e portões", "", f"Sítio: `{dados['cabecas_codigo']['sitio']}`. Motor: `{dados['cabecas_codigo']['motor']}`.", "",
           "| Portão | Código lido do ficheiro |", "|---|---:|"]
    out += [f"| {n} | {v} |" for n, v in dados["portoes"].items()]
    out += ["", "Os portões do sítio correm com `RESEARCHHUB_DIR=<motor> sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/jd1-2026-10-06/portoes`, pela tranca comum. O motor corre `python3 -m core.gate`. O guião `correr.py` guarda o código real do processo e retira caminhos pessoais dos registos, sem alterar os códigos escritos pelo guião dos portões. Os ficheiros de código de saída são conservados em `portoes/`. Os commits posteriores que só guardem medições e capturas não mudam as cabeças do código.", "", "## Linhas", "",
            "O valor direto conserva a escrita da fonte. O livro apresenta separadores portugueses, sem converter unidades. Nas linhas calculadas o valor é o resultado da conta, não uma percentagem impressa pelo INE.", "",
            "| Linha | Valor da fonte ou cálculo | Unidade | Documento e localizador |", "|---|---:|---|---|"]
    for r in linhas:
        doc = r.get("document", {})
        texto = "Cálculo sobre " + ", ".join(r["derived_from"]) if r.get("derived_from") else doc["title"] + ", " + doc["edition"] + "; " + r["evidence"]["locator"]
        value = r["source_value"] if r.get("source_value") else "cálculo: " + r["value"]
        out.append(f"| `{r['id']}` | {value} | {r['unit']} | {texto} |")
    out += ["", "## Excertos e frases com os apoios", ""]
    for r in linhas:
        f = familia(r["id"])
        out += ["### " + r["id"], ""]
        if r.get("derived_from"):
            out += [r["derivation"], "", "`" + r["check"] + "`", ""]
        else:
            out += [f"Fonte: {r['source_url']}. Acesso: {r['fetched_at']}. Corpo: `{r['evidence']['file']}`. SHA-256: `{r['evidence']['sha256']}`.", "", "```text", r["source_excerpt"], "```", ""]
        out += ["Português: " + "".join(p["pt"] for p in f["partes"]), "", "Inglês: " + "".join(p["en"] for p in f["partes"]), "", "Apoios, parte a parte:", ""]
        for p in f["partes"]:
            if p["classe"] == "diz":
                apoios = "; ".join((a.get("origem") or "própria linha") + ": " + a["campo"] + " «" + a["literal"] + "»" for a in p["apoios"])
                out.append("- «" + p["pt"] + "»: " + apoios + ".")
        out.append("")
    last = serie["pontos"][-1]
    out += ["## Série", "", f"`{serie['id']}`: {len(serie['pontos'])} pontos mensais, desde {serie['primeiro_periodo']} até {serie['ultimo_periodo']}, com {len(serie['lacunas'])} lacunas declaradas. Último ponto: **{last['valor']} {serie['unit']}**, período **{last['periodo']}**.", "",
            "O início do pedido veio do índice de conteúdos recebido nesta corrida. A unidade foi relida na ficha de metadados: «All the yields are expressed in percentages per annum.» A série mostra a rendibilidade de obrigações no mercado secundário, antes de impostos, com maturidade residual próxima de dez anos; não é o custo da emissão do IGCP.", "", "Excerto literal do último ponto:", "", "```text", last["excerto"], "```", "",
            "A declaração e a identidade da série vivem em `publisher/dominios_series.py`. O corredor correu com seleção explícita desta série, relendo o corpo já recebido pelo cliente da casa, e reconstruiu e comparou as restantes. O relatório está em `<motor>/indicators/out/jd1-2026-10-06/series/corredor.json`. A exportação foi feita por `publisher/export_series.py`, com as conferências de travessia e idempotência.", "",
            "Português: " + "".join(p["pt"] for p in frase_serie["partes"]), "", "Inglês: " + "".join(p["en"] for p in frase_serie["partes"]), "", "Apoios da frase da série, parte a parte:", ""]
    for p in frase_serie["partes"]:
        if p["classe"] == "diz":
            apoios = "; ".join((a.get("origem") or "própria série") + ": " + a["campo"] + " «" + a["literal"] + "»" for a in p["apoios"])
            out.append("- «" + p["pt"] + "»: " + apoios + ".")
    out += ["", "## Pedidos e extrações", "", f"Pedidos efetivos: **{len(pedidos)}**, dos quais **{dados['http_200']}** responderam com HTTP 200. O registo copiado para a pasta do corredor não conta como um novo pedido. Extrações registadas: **{len(extracoes)}**, incluindo a coluna portuguesa da nota do IGCP.", "",
            "| Ficheiro | Estado | HTTP | Endereço | SHA-256 |", "|---|---|---:|---|---|"]
    out += [f"| `{p['file']}` | {p['estado']} | {p['http'] if p['http'] is not None else 'sem resposta'} | {p['url']} | `{p['sha256']}` |" for p in pedidos]
    out += ["", "## O que ficou de fora e questões", "",
            "- **JD1-1, versões das contas:** os valores portugueses do Eurostat são anteriores à notificação de setembro. Foram recebidos e conferidos, mas não substituem os juros portugueses do INE. A linha da União conserva o campo `updated` do corpo do Eurostat no excerto. Uma comparação usa duas versões das contas e deve dizê-lo.",
            "- **JD1-2, percentagens não impressas:** o quadro dos juros não imprime a percentagem do PIB. Entraram as linhas do PIB da mesma notificação e as contas explícitas, com os operandos no livro. Não se reproduziram como se fossem percentagens publicadas pelo INE.",
            f"- **JD1-3, realizado e previsão:** a atualização do programa de financiamento foi recebida (HTTP {financiamento['http']}) e lida nas páginas {', '.join(financiamento_paginas)} da extração `{financiamento_texto['file']}`. Tem previsões e um perímetro diferente do quadro anual de necessidades brutas; ficou como fonte de investigação, sem linha nova. A publicação anual fornece os montantes realizados usados no livro.",
            "- **JD1-4, âmbito:** não se usou o BPstat. Não se criou cartão, bloco de primeira página ou explicação. A síntese orçamental não foi confundida com as contas nacionais e a dívida direta não foi confundida com a dívida de Maastricht.",
            "- **JD1-5, pedido inicial:** a primeira tentativa do PDF do INE ficou recusada sem resposta HTTP; a repetição trouxe o documento. O pedido falhado permanece no registo, com corpo vazio e o respetivo resumo.",
            "- **JD1-6, tranca comum:** à entrada dos portões, o ficheiro da tranca mostrou escritas sobrepostas de outra corrida e do JD1. A leitura está em `tranca.json`, com a hora e o resumo do guião. O guião pedido foi usado sem alterações; verifica a existência antes de escrever, pelo que a entrada não é atómica e não garante exclusão entre corridas simultâneas. Os códigos e os ficheiros da construção JD1 pertencem à sua própria worktree. O guião também não mantém uma fila de chegada; as leituras durante a espera registam as trocas de titular enquanto o JD1 aguardava. A correção da tranca fica para o lugar de direção.",
            "- **JD1-7, enquadramento corrigido:** a primeira construção associava os juros portugueses em milhões de euros à linha da União em percentagem do PIB, apenas pelo identificador. A seleção passou a exigir unidade e período iguais. Uma conferência independente lê as referências no HTML dos recibos e recusa a unidade ou o período trocados; integra o `check:cartao`. A linha europeia mantém-se no livro, com a ressalva de versão descrita acima.",
            "", "## Plantas e guardas", "", f"Os guiões registam {len(plantas)} provas, das quais {dados['plantas']} são plantas. Cada recusa afirma a mensagem esperada; os ficheiros reais conservam-se. Comandos: `python3 -m publisher.jd1_test`, no motor; `node tests/linha/enquadramento-uniao.mjs --prova --out design/especime-v3/medicoes/jd1-2026-10-06/plantas-enquadramento.json` e o guião das capturas, no sítio.", "",
            "| Planta | Mensagem exigida |", "|---|---|"]
    out += [f"| {p['nome']} | `{p['mensagem']}` |" for p in plantas if p["planta"]]
    out += ["", "As plantas cobrem a unidade, a ordem dos anos, os bytes do corpo, a geografia, o ano do denominador, a seleção do corredor, a unidade da taxa, a comparabilidade do enquadramento, os destinos repetidos, os localizadores dos nomes, as unidades e entradas do livro e a disposição da ligação ao documento.", "",
            "As contagens dos testes do OE1 passaram a referir o seu manifesto, mantendo as recusas `Nomes: livro sem as linhas esperadas ou com repetição` e `Nomes: manifesto sem as linhas esperadas`. A contagem das séries passou a comparar os identificadores declarados e derivados; retirar uma série é recusado com `as séries publicadas não são exatamente as declaradas e derivadas`. As cópias de teste do corredor passaram a copiar a pasta de escrita, evitando uma ligação à fonte real; a prova confere que não acrescenta corridas à fonte real.", "",
            f"Ficheiros protegidos de outras corridas alterados: {dados['ficheiros_protegidos_alterados']}, medidos por `git diff --name-only` desde a cabeça inicial do motor e por `git status --porcelain` sobre os caminhos indicados no mandato.", "",
            "## Correções da conferência dos recibos", "", "A primeira corrida foi conservada em `portoes-iniciais/` como diagnóstico. Os seus códigos, lidos dos ficheiros: " + ", ".join(f"{n}={v}" for n, v in dados["portoes_iniciais"].items()) + ". Os códigos válidos para a entrega são os da tabela inicial, em `portoes/`.", "",
            "A corrida seguinte ficou em `portoes-lingua/`, também como diagnóstico: " + ", ".join(f"{n}={v}" for n, v in dados["portoes_lingua"].items()) + ". Faltava declarar a língua dos novos títulos, rótulos, organismos e edições. Essa tabela foi completada durante a verificação desta corrida; as cabeças de entrada e saída estão nos registos. A construção válida para a entrega incorpora as declarações desde o início.", "",
            "A corrida conservada em `portoes-l1/` mediu " + ", ".join(f"{n}={v}" for n, v in dados["portoes_l1"].items()) + ". A L1 recusou o crescimento do número de recibos. A medição `l1-jd1.json`, feita por `node design/especime-v3/medicoes/jd1-2026-10-06/medir-l1.mjs --write`, conta os destinos e as vezes de cada destino: " + json.dumps(dados["l1"], ensure_ascii=False) + ". Só entram os recibos declarados no cruzamento JD1; cada um conserva as portas do Método da família. O teto aponta para esta medição e as plantas verificam a comparação, a divergência do registo e uma repetição nova no HTML da série, sem escrever no HTML real.", "",
            "A conferência diagnóstica `node scripts/verify-depois-do-build.mjs --paralelo 4 --json design/especime-v3/medicoes/jd1-2026-10-06/preflight.json` terminou com código " + str(dados["preflight"]) + ". Os resultados de cada passo estão no JSON. O índice não reconhecia os localizadores JD1 e a conferência de unidades confundia o estudo inteiro com o bloco OE1. O índice passou a exigir a identidade, o período e a página de cada formato novo. A unidade é conferida separadamente nos conjuntos declarados OE1 e JD1, com recusa de omissões e duplicações. As conferências focadas posteriores mediram " + json.dumps(dados["conferencias_focadas"], ensure_ascii=False) + ". Comandos: `node tests/livro/indice.mjs --navegador --prova --json design/especime-v3/medicoes/jd1-2026-10-06/indice.json`, `node scripts/inventario-rotulos.mjs --prova --json design/especime-v3/medicoes/jd1-2026-10-06/rotulos.json` e `npm run typecheck`. Cada planta nova conserva a mensagem que foi exigida.", "",
            "A frase calculada deixou de chamar casa ao projeto. A nota do motor foi alinhada, sem alterar montantes, operandos ou contas. As contagens do índice foram relidas pelo guião `inventario.mjs`, que conserva a classificação da voz; os registos estão em `inventario.json` e `inventario-final.json`.", "",
            "No telemóvel, a porta do documento conserva a mesma âncora e a área de toque. O rótulo da página fica acima do endereço, que já não o comprime. A planta repõe a disposição em fila numa cópia do navegador e exige a mensagem indicada na tabela.", "",
            "## Capturas e entrega", "", f"Capturas: {dados['capturas']}. Inspeção visual: {dados['inspecao_visual']} imagens, registadas com os seus resumos em `inspecao-visual.json`. Casos de interação conferidos: {dados['interacoes']}, com a abertura dos pedidos da série e, onde necessário, o deslocamento da tabela pelo teclado. Problemas registados pelo guião: {len(captura['problemas'])}. Comando: `node design/especime-v3/medicoes/jd1-2026-10-06/captar.mjs`. Ficheiros em `design/especime-v3/capturas/jd1-2026-10-06/`; dimensões, frases, resumos e cabeça da construção em `capturas.json`.", "",
            f"Para a leitura a frio, o diff do motor é `git diff 465d01e7853f2729fcaa4ba63160b6338ba5de1e {dados['cabecas_codigo']['motor']}` na worktree do motor; o do sítio é `git diff 1172e3f8 {dados['cabecas_codigo']['sitio']}` na worktree do sítio. Os documentos e extrações estão na pasta da corrida do motor, os recibos construídos em `dist/livro-razao/` e `dist/en/ledger/`, e as imagens nas capturas desta entrega.", "",
            "A entrega inclui as fontes, extrações, recibos e as plantas reproduzíveis para a leitura a frio. Não houve envio para o remoto nem alteração de `ISSUES.md`. A linha «tokens used» não foi exposta nesta sessão; custo não medido.", ""]
    (AQUI / "LEIA-ME.md").write_text(limpa("\n".join(out)))
    print(json.dumps(dados, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
