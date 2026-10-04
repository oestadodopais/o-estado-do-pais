"""Mede o bloco OE1 e escreve o relatório, sem adquirir nem originar números.

Uso: python3 design/especime-v3/medicoes/oe1-2026-10-04/medir.py <worktree-do-motor>
Os caminhos recebidos são usados em memória e nunca escritos nos artefactos.
"""
from __future__ import annotations
import copy
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from decimal import Decimal
import yaml

HERE = Path(__file__).resolve().parent
SITE = Path(__file__).resolve().parents[4]
MOTOR = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(MOTOR))
from publisher.oe1_build import build, encoded
from publisher.oe1_pdf import cell
from publisher.oe1_common import number


def git(root, *args):
    return subprocess.check_output(["git", *args], cwd=root, text=True).strip()


def count_measure(rows, predicate):
    value = sum(bool(predicate(r)) for r in rows)
    removed = next((i for i, r in enumerate(rows) if predicate(r)), None)
    if removed is None:
        raise ValueError("Medida sem conhecido positivo")
    altered = rows[:removed] + rows[removed + 1:]
    return dict(valor=value, conhecido_positivo=sum(bool(predicate(r)) for r in altered) == value - 1,
                planta="Retirar uma entrada que contribui para a contagem diminui a medida em um.")


def gate(name):
    base = HERE / "portoes"
    p = base / (name + ".codigo")
    def stamp(file):
        return datetime.fromisoformat(file.read_text().strip().replace("Z", "+00:00")) if file.exists() else None
    start, end = stamp(base / (name + ".inicio")), stamp(base / (name + ".fim"))
    runstart = start if name == "motor" else stamp(HERE / "corrida-sitio.inicio")
    # O portoes.sh escreve segundos inteiros; o corredor escreve microssegundos.
    finished = (start is not None and end is not None and runstart is not None
                and end >= start and end >= runstart
                and start >= runstart.replace(microsecond=0))
    value = int(p.read_text().strip()) if p.exists() and finished else None
    headfile = base / (name + ".cabeca" if name in {"motor", "ledger"} else "cabeca")
    head = headfile.read_text().strip() if headfile.exists() else None
    return dict(codigo=value, cabeca=head, origem="portoes/" + name + ".codigo")


def md(value):
    return str(value).replace("|", "\\|").replace("\n", "<br>")


def main():
    close = "--fecho" in sys.argv
    ledger, manifest, rounding = build()
    rows = ledger["claims"]
    committed = json.loads((MOTOR / "content/20 Orcamento do Estado/ledger.json").read_text())
    assert committed == ledger, "O livro em disco diverge das fontes"
    crossing = json.loads((SITE / "ledger/cruzamentos/oe1.json").read_text())["rows"]
    checks = []
    for r in rows:
        p = SITE / "ledger/claims" / (r["id"] + ".yml")
        raw = p.read_bytes()
        line = yaml.safe_load(raw)
        assert hashlib.sha256(raw).hexdigest() == crossing[r["id"]]["exported_row_sha256"], "Bytes diferentes da travessia"
        literal = line["excerpt"] == r["source_excerpt"] if not r.get("derived_from") else line["check"] == r["check"]
        assert literal, "Excerto ou conta diferentes da origem"
        checks.append(dict(id=r["id"], literal=literal, travessia=True))
    counts = {
        "linhas_construidas": lambda r: True,
        "valores_publicados_por_fontes": lambda r: not r.get("derived_from"),
        "linhas_derivadas": lambda r: bool(r.get("derived_from")),
        "rubricas_ministeriais": lambda r: "codigo_ministerio" in r,
        "programas_orcamento": lambda r: "programa" in r,
        "programas_execucao_agosto": lambda r: r["id"].startswith("execucao-2026-08-despesa-programa-"),
        "funcoes_orcamento": lambda r: r["id"].startswith("oe-2026-despesa-funcao-"),
        "funcoes_execucao_julho": lambda r: r["id"].startswith("execucao-2026-07-despesa-funcao-"),
        "eurostat_pt_es_ue": lambda r: r["id"].startswith("despesa-por-funcao-"),
        "bandeiras_provisorias": lambda r: r.get("source_flag") == "p",
        "notas_com_armadilhas": lambda r: "regional e local" in r["note"] and "Mais Transparência" in r["note"],
    }
    measures = {key: count_measure(rows, fn) for key, fn in counts.items()}
    measures["linhas_exportadas_conferidas"] = count_measure(checks, lambda r: r["literal"] and r["travessia"])
    test_log = (MOTOR / "content/20 Orcamento do Estado/provas/testes.log").read_text()
    tests, end = json.JSONDecoder().raw_decode(test_log)
    assert "OE1_TEST: PASS" in test_log[end:] and all(t["passou"] for t in tests["conferencias"])
    measures["conferencias_do_leitor"] = count_measure(tests["conferencias"], lambda t: t["passou"])
    source = MOTOR / "content/20 Orcamento do Estado/source"
    catalog = json.loads((source / "dados-catalogo.json").read_text())["data"]
    measures["conjuntos_cc_by"] = count_measure(catalog, lambda d: d["license"] == "cc-by")
    receipts = [json.loads(p.read_text()) for p in (source / "mapas").glob("*.pedido.json")]
    measures["xml_obtidos"] = count_measure(receipts, lambda r: r["estado"] == 200)
    # Recontagem das dez funções nos 27 países, nas duas matrizes publicadas.
    eu = {"BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE"}
    coverage = {}
    for year in [2024, 2025]:
        j = json.loads((source / f"eurostat-gov-10a-exp-{year}.json").read_text())
        cells = []
        for geo in sorted(eu):
            for n in range(1, 11):
                coords = dict(freq="A", unit="PC_GDP", sector="S13", cofog99=f"GF{n:02}", na_item="TE", geo=geo, time=str(year))
                idx = 0
                for dim, size in zip(j["id"], j["size"]):
                    idx = idx * size + j["dimension"][dim]["category"]["index"][coords[dim]]
                cells.append(dict(geo=geo, presente=str(idx) in j.get("value", {})))
        coverage[str(year)] = sorted(g for g in eu if sum(c["presente"] for c in cells if c["geo"] == g) == 10)
        measures[f"eurostat_celulas_27_{year}"] = count_measure(cells, lambda c: c["presente"])
    # Fontes contraditórias ficam medidas, sem escolher um valor por conveniência.
    gross1 = cell("pdf/OE2026_doc02_Mapa01.pdf", 2, "Segurança Social")[0]
    gross8 = cell("pdf/OE2026_doc09_Mapa08.pdf", 2, "Despesa total")[0]
    byid = {r["id"]: r for r in rows}
    budget = lambda part: number(byid["oe-2026-" + part + "-administracao-central"]["value"])
    financial_gap = budget("despesa-orcamental") - budget("ativos-e-passivos-da-despesa") - budget("despesa-efetiva")
    heads = {"motor": git(MOTOR, "rev-parse", "HEAD"), "sitio": git(SITE, "rev-parse", "HEAD")}
    bases = {"motor": "d2495a7d0d023dccb6eb4014b917bf06554438f6", "sitio": "eee1677fff963ce0758a23067b9fdf32185f3147"}
    commits = {k: git(root, "log", "--format=%H %s", bases[k] + "..HEAD").splitlines() for k, root in [("motor", MOTOR), ("sitio", SITE)]}
    gates = {k: gate(k) for k in ["motor", "build", "verify", "typecheck", "ledger"]}
    site_errors = []
    log = HERE / "portoes/ledger.log"
    if log.exists():
        text = log.read_text()
        pos = 0
        while (start := text.find("\n{", pos)) >= 0:
            item, length = json.JSONDecoder().raw_decode(text[start + 1:])
            site_errors.extend(item.get("erros_do_livro", []))
            pos = start + 1 + length
    for key, fragment in [("recusas_estudo_no_sitio", '"study" é "oe-2026"'),
                          ("recusas_bandeira_no_sitio", 'declara a bandeira "p"')]:
        if any(fragment in e for e in site_errors):
            measures[key] = count_measure(site_errors, lambda e: fragment in e)
    for k, g in gates.items():
        g["cabeca_final"] = g["cabeca"] == heads["motor" if k == "motor" else "sitio"]
    costs = json.loads((HERE / "custo.json").read_text()) if (HERE / "custo.json").exists() else {"estado": "por medir"}
    support = ["src/i18n/lingua-dos-titulos.mjs", "src/i18n/unidades.mjs", "src/data/studies.mjs",
               "src/data/areas.mjs", "src/lib/ledger.mjs"]
    support_changed = git(SITE, "diff", "--name-only", bases["sitio"], "--", *support).splitlines()
    integration = dict(ficheiros_da_proposta=support, ficheiros_alterados=support_changed,
                       proposta_aplicada=len(support_changed) == len(support))
    bcost_path = HERE / "custo-oe1b.json"
    bcost = json.loads(bcost_path.read_text()) if bcost_path.exists() else None
    btests_path = HERE / "oe1b-plantas.log"
    btests = json.loads(btests_path.read_text())["bandeiras"] if btests_path.exists() else []
    if btests:
        measures["plantas_bandeira_oe1b"] = count_measure(btests, lambda t: t["mordeu"])
        measures["ficheiros_integrados_oe1b"] = count_measure(support_changed, lambda f: f in support)
    inventory_counts = []
    if bcost is not None and (SITE / "dist/livro-razao/index.html").exists():
        js = "import fs from 'node:fs';import {parse} from 'node-html-parser';console.log(JSON.stringify(['dist/livro-razao/index.html','dist/en/ledger/index.html'].map(f=>parse(fs.readFileSync(f,'utf8')).querySelector('p.livro-contas').textContent.trim().replace(/\\s+/g,' '))));"
        inventory_counts = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", js], cwd=SITE, text=True))
        inventory = (SITE / "design/especime-v3/INVENTARIO-FRASES.md").read_text()
        assert all("| conteudo | " + s + " | k2 | viva |" in inventory for s in inventory_counts)
        measures["contagens_reconferidas_no_inventario"] = count_measure(inventory_counts, lambda s: s in inventory)
    l1_path = HERE / "l1-oe1b.json"
    l1 = json.loads(l1_path.read_text()) if l1_path.exists() else None
    if l1 is not None:
        assert all(p["mordeu"] for p in l1["conhecidos_positivos"])
        measures["l1_recibos_novos"] = count_measure(l1["entradas"], lambda p: True)
        measures["l1_plantas"] = count_measure(l1["conhecidos_positivos"], lambda p: p["mordeu"])
    tail_path = HERE / "oe1b-cauda/resultados.json"
    tail = json.loads(tail_path.read_text()) if tail_path.exists() else None
    if tail is not None:
        chain = json.loads((SITE / "package.json").read_text())["scripts"]["verify"].split(" && ")
        expected = chain[chain.index("npm run check:lugar") + 1:]
        assert [r["comando"] for r in tail] == expected
        assert int((HERE / "oe1b-cauda.codigo").read_text()) == int(any(r["codigo"] != 0 for r in tail))
        measures["verificacoes_apos_l1"] = count_measure(tail, lambda r: r["codigo"] == 0)
    clock_tests = json.loads((HERE / "plantas-tempos.json").read_text())["casos"]
    measures["provas_da_precisao_dos_tempos"] = count_measure(clock_tests, lambda t: t["passou"])
    cpath = HERE / "oe1c-provas.json"
    cproof = json.loads(cpath.read_text()) if cpath.exists() else None
    if cproof:
        for path, sha in cproof["implementacao"].items():
            assert hashlib.sha256((SITE / path).read_bytes()).hexdigest() == sha, "Código diferente da prova OE1-c"
        assert cproof["lista_igual_a_proposta"] and cproof["teto_e_margem_iguais"]
        measures.update(cproof["medidas"])
    proposal = json.loads((HERE / "proposta-localizadores.json").read_text())
    digest = hashlib.sha256((SITE / "tests/livro/indice.mjs").read_bytes()).hexdigest()
    proved_digest = cproof["implementacao"]["tests/livro/indice.mjs"] if cproof else None
    assert digest in {proposal["guarda_sha256"], proposal["candidato_sha256"], proved_digest}
    proposal_applied = digest in {proposal["candidato_sha256"], proved_digest}
    measures["plantas_da_proposta_de_localizadores"] = count_measure(proposal["plantas"], lambda t: t["mordeu"])
    bundle = json.loads((HERE / "proposta-feixe.json").read_text())
    bundle_digest = hashlib.sha256((SITE / "scripts/design-bundle.mjs").read_bytes()).hexdigest()
    proved_bundle = cproof["implementacao"]["scripts/design-bundle.mjs"] if cproof else None
    assert bundle_digest in {bundle["guarda_sha256"], bundle["candidato_sha256"], proved_bundle}
    bundle_applied = bundle_digest in {bundle["candidato_sha256"], proved_bundle}
    measures["plantas_do_recorte_proposto"] = count_measure(bundle["plantas"], lambda t: t["mordeu"])
    data = dict(medido_em=datetime.now(timezone.utc).isoformat(), modelo="Codex gpt-6-astra", cabecas=heads,
                commits=commits, medidas=measures, eurostat_paises_com_dez_funcoes=coverage,
                arredondamento=rounding, divergencias=dict(seguranca_social_bruta_mapa1=gross1,
                seguranca_social_bruta_mapa8=gross8, diferenca_euros=str(number(gross8) - number(gross1)),
                indicadores_ac_despesa_diferenca_milhoes=str(financial_gap)), portoes=gates, custo=costs,
                integracao=integration, conferencias=tests["conferencias"], erros_do_sitio=site_errors,
                oe1b=dict(custo=bcost, plantas=btests, contagens_no_html=inventory_counts, verificacoes_apos_l1=tail,
                    provas_tempos=clock_tests, proposta_localizadores=dict(aplicada=proposal_applied, provas=proposal),
                    proposta_feixe=dict(aplicada=bundle_applied, provas=bundle),
                    l1=dict(ficheiro="l1-oe1b.json", contagens=l1["contagens"], conhecidos_positivos=l1["conhecidos_positivos"]) if l1 else None))
    if close:
        data["cabecas_na_medicao"] = data.pop("cabecas")
        data["portoes_na_medicao"] = data.pop("portoes")
        data["oe1b"]["custo_na_medicao"] = data["oe1b"].pop("custo")
        data["verificacao_final"] = {n: dict(codigo_ficheiro="portoes/"+n+".codigo",
            cabeca_ficheiro="portoes/"+(n+".cabeca" if n in {"motor", "ledger"} else "cabeca")) for n in gates}
        data["nota_do_fecho"] = "A medição é um instantâneo datado. Os ficheiros de verificacao_final são escritos pela corrida posterior ao commit e conferidos por --conferir-final."
    if cproof:
        data["oe1c"] = dict(provas=cproof, custo_na_medicao=json.loads((HERE / "custo-oe1c.json").read_text()),
            resultado_final="oe1c-final.json", resposta_final="OE1-c-resultado.md")
    assert all(m["conhecido_positivo"] for m in measures.values())
    (HERE / "medidas.json").write_text(encoded(data))
    table = ["| Id | Fonte | Valor literal da fonte, ou cálculo assinalado | Unidade | Período | Localizador |", "|---|---|---|---|---|---|"]
    for r in rows:
        derived = bool(r.get("derived_from"))
        origin = "Cálculo, pelas linhas de origem" if derived else r["attributed_to"][0]
        value = "Cálculo: " + r["value"] if derived else r["source_value"]
        loc = r["check"] if derived else "[" + md(r["evidence"]["locator"]) + "](" + r["source_url"] + ")"
        table.append("| " + " | ".join([md(r["id"]), md(origin), md(value), md(r["unit"]), md(r["reference_date"]), loc]) + " |")
    (HERE / "LINHAS.md").write_text("# As linhas construídas e exportadas pelo tubo\n\n" + "\n".join(table) + "\n")
    report = f"""# OE1: o dinheiro do Estado

O teste de aceitação integral do §2 não está cumprido. Foram construídas e exportadas **{len(rows)} linhas**, das quais **{measures['valores_publicados_por_fontes']['valor']} transcrevem valores publicados** e **{measures['linhas_derivadas']['valor']} são contas declaradas**. As lacunas de fonte estão identificadas abaixo. Os resultados efetivos dos portões constam da tabela, sem converter uma tentativa em sucesso.

## Mandato e medida

| Item | Medida e resultado |
|---|---|
| 1. Fontes à mão da máquina | 11 XML recebidos por endereços publicados; 14 conjuntos do dados.gov.pt com código de licença cc-by; matrizes Eurostat de 2024 e 2025 e 30 pedidos individuais; mapas PDF; sínteses de julho e agosto e anexo XLSX de agosto. Recibos de pedido, data, estado HTTP, bytes e SHA-256 no motor. |
| 2. Leitores | Leitores separados para XML, XLS, JSON-stat e PDF; cliente comum na aquisição. Provas no módulo publisher.oe1_test, registado em core.gate. O anexo XLSX é uma segunda leitura de 26 valores da síntese. |
| 3. Linhas | Parcial: 16 rubricas orgânicas por ministério, incluindo Encargos Gerais do Estado; 20 programas no orçamento; 20 programas executados até agosto; dez funções no orçamento e dez executadas até julho; 30 células Eurostat; totais, indicadores, diferenças de consolidação e 36 derivadas. Faltam os totais consolidados de receita e saldo dos mapas e as necessidades de financiamento mensais. A tabela integral está neste relatório e em LINHAS.md. |
| 4. Portões | Códigos e cabeças lidos de ficheiro na tabela abaixo. Uma cabeça diferente não é uma prova da cabeça final. |
| 5. Relatório | Este ficheiro, LINHAS.md, medidas.json, medir.py, custo.json e a resposta curta. Cada contagem tem um conhecido positivo executado pelo guião. |

## O que a leitura corrigiu e o que ficou por selar

1. A biblioteca e a vista XML deram 401. A página pública deu 200, mas a abertura da lista falhava porque `theForm` não estava definido. O navegador usa o User-Agent da casa e associa esse nome ao formulário público existente, sem autenticação. A resposta pública da lista revela os 11 links; todos deram 200 no cliente comum. O navegador só localiza; os leitores consomem os corpos obtidos pelo motor.
2. Os XML publicados não incluem os mapas 7, 8 e 9, nem os totais ministeriais. Os 16 totais foram lidos da coluna POR MINISTÉRIOS do Mapa 4 PDF e fecham exatamente com os 20 programas do Mapa 1 XML. Encargos Gerais do Estado não é um ministério governamental. Os nomes mantêm a grafia da fonte, incluindo COESAO e HABITACÃO.
3. A despesa total consolidada AC+SS está impressa no Mapa 1. Não se encontrou uma receita total consolidada AC+SS nem um saldo correspondente impressos nos mapas lidos. Não se fabricou a consolidação somando subsetores. Receita, despesa e saldo efetivos AC+SS são linhas próprias da síntese, identificadas como tal, e não substituem esta lacuna dos mapas.
4. A despesa bruta da Segurança Social é `{gross1}` no Mapa 1 e `{gross8}` no Mapa 8: diferença medida de `{number(gross8)-number(gross1)}` euros. O total consolidado coincide. Não atravessou uma escolha entre os dois totais brutos.
5. O catálogo funcional só publica julho de 2026 à data de acesso. A síntese mais recente é agosto, publicada a 30.09.2026. Não se fez passar julho por agosto: funções até julho, programas e contas até agosto. Nenhuma execução é só a despesa do mês; é acumulada desde janeiro.
6. Saldo não é dívida emitida. Foram preservados os saldos e os fluxos líquidos de ativos e passivos que a síntese publica. Não se encontrou nos indicadores mensais uma linha que permita afirmar que uma parcela exata da despesa foi financiada por dívida. O quadro de capacidade/necessidade em contabilidade nacional refere-se ao primeiro semestre, outro período e outra ótica. Esse ponto fica por selar.
7. Os indicadores AC do orçamento não fecham entre despesa orçamental, ativos e passivos da despesa e despesa efetiva: a diferença medida é `{financial_gap}` milhões. Os valores são transcritos com aviso e não usados para calcular uma parcela financiada por dívida.
8. Os XLS funcionais não imprimem a unidade. A escala em milhões foi conferida com receita, despesa e saldo da conta AC na síntese de julho, para orçamento e execução, seis correspondências exatas. As dez funções e o código 99 fecham com a despesa efetiva: diferença de -0,1 milhões no orçamento e zero em julho. O limite de arredondamento, calculado sobre onze parcelas e um total a uma décima, é 0,60 milhões. A diferença não foi apagada nem redistribuída.
9. O Eurostat de 2024 tem as dez funções dos 27 países. Em 2025, apenas {', '.join(coverage['2025'])} tem as dez. Portugal e Espanha conservam a bandeira provisória p, com explicação em português e inglês. A União é o agregado publicado, não uma média calculada.
10. O modelo de Évora citado no brief vem do Município de Évora, não da DGAL. O §0 foi reproduzido: 3009 linhas iniciais, zero EO e zero COFOG Eurostat. Não se alterou a linha de Évora.

As duas armadilhas do brief constam das notas: mapas e Eurostat têm perímetros diferentes; citam-se dados e documentos oficiais, nunca os portais oe.gov.pt ou Mais Transparência. As quotas ministeriais usam despesa **bruta da AC**, com operações financeiras e transferências internas. As quotas funcionais usam despesa **efetiva consolidada da AC**, incluindo no denominador a diferença de consolidação. Não são repartições da mesma grandeza.

## Fontes e licenças

| Fonte | Endereço de descoberta e licença lida |
|---|---|
| Mapas da lei | [Ficheiros de dados da EO](https://www.eo.gov.pt/politicaorcamental/Paginas/OEpagina_ficheirosdeDados.aspx). O XML não declara licença aberta; a página indica todos os direitos reservados. O sítio recebe transcrições e referências, não cópias dos ficheiros. |
| Mapas PDF | [Orçamento aprovado](https://www.eo.gov.pt/politicaorcamental/Paginas/OrcamentosEstado.aspx?Ano=2026&TipoOE=Or%C3%A7amento+Estado+Aprovado). Sem licença aberta indicada; aviso de direitos da EO. Nos mapas 8 e 9 a fonte originária impressa é IGFSS, IP. |
| dados.gov.pt | [API do catálogo da EO](https://dados.gov.pt/api/1/datasets/?organization=5ae97f98c8d8c915d5faa3b5&page_size=100). Os 14 conjuntos declaram cc-by; não se inventou uma versão da licença. Cada linha aponta ao recurso efetivamente obtido. |
| Eurostat | [gov_10a_exp](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024). A [política de reutilização](https://ec.europa.eu/eurostat/help/copyright-notice) autoriza reutilizar os dados com indicação da fonte; a referência a CC BY 4.0 nessa página diz respeito ao conteúdo editorial. |
| Síntese e anexo | [Página oficial mensal](https://www.eo.gov.pt/execucaoorcamental/Paginas/Sintese-da-Execucao-Orcamental-Mensal.aspx). Sem licença aberta indicada no documento; aviso de direitos da EO. As linhas apontam ao PDF e à página exata; o XLSX é conferência independente no motor. |

## Provas e integração

O ensaio e a escrita passam pelo exportador comum. Cada YAML é confrontado com o resumo da travessia; cada excerto publicado é confrontado com a transcrição do leitor. As derivadas têm a conta em palavras nas duas línguas, origens e check. Foram inspecionadas visualmente as seis páginas do Mapa 4, a segunda página dos mapas 1, 8 e 9 e as páginas 49, 50 e 72 da síntese de agosto.

O módulo de testes planta alterações em valores, ano XML e XLS, unidade, programa, coordenada geográfica, presença da célula, bandeira, licença, arredondamento, denominador, período e livro gerado. O relatório dos testes está nos registos do motor. As regressões do exportador e dos leitores existentes são corridas pelo portão comum.

A primeira corrida do motor falhou por impedimento de localhost na caixa de areia, caches ausentes e uma regressão na aceitação das bandeiras antigas. A regressão foi corrigida, mantendo o formato antigo e acrescentando o caso JSON-stat de uma célula. As três caches de recortes foram copiadas das fixtures versionadas desta mesma worktree, conservando o cabeçalho que declara a origem; não foram regeneradas a partir de PDFs nem apresentadas como uma nova leitura das fontes.

A proposta `publisher/oe1_site_support.patch`, no motor, identificou cinco adaptações no sítio. O mandato OE1-b autorizou essa integração, o nome do conjunto e as plantas das bandeiras. Ficheiros da proposta efetivamente alterados nesta árvore: **{len(support_changed)} de 5**. A aplicação inclui o nome pedido no OE1-b e reforça a comparação do valor em decimal e a ligação da bandeira ao país e ao período. A secção OE1-b descreve as alterações. Os portões abaixo dizem o resultado real, independentemente da existência da proposta.

As decisões do §5 foram respeitadas: o bloco entrega dados para a futura página do governo; as linhas usam os recibos da família de páginas já existente no livro-razão, sem novos componentes ou declarações de rota; todas as linhas publicadas declaram o perímetro; as fontes que atravessam têm corpos e pedidos reproduzíveis. O ponto da biblioteca foi resolvido por endereços publicados, com os 401 conservados como prova da limitação inicial.

O relatório, os guiões e a resposta curta ficam comitados antes da última corrida. Os códigos, as cabeças, os tempos e o custo são ficheiros de execução, escritos depois desse commit. As referências abaixo apontam para esses ficheiros, permitindo registar a cabeça final sem voltar a alterar a prosa comitada. O modo --conferir-final do guião recusa um código diferente de zero, uma corrida por terminar ou uma cabeça diferente da atual.

## Portões lidos de ficheiro

As corridas do sítio usam `scripts/leituras/portoes.sh`. Um invólucro temporário do npm retira caminhos locais antes de escrever a saída e conserva cada código. Durante a chamada do build, com a mesma tranca ainda tomada, também corre `npm run ledger:check` e guarda o seu código separado. Não altera comandos do projeto nem transforma falhas em sucesso.

O registo atual do ledger contém {len(site_errors)} recusas. Na passagem inicial havia 186 por conjunto ainda não registado e 20 por formato da bandeira. O JSON oficial guarda a bandeira no índice da célula, não como texto depois do número. O OE1-b acrescenta essa conferência ao sítio. Só um código zero de cada comando abaixo comprova a conclusão de todos os seus passos.

| Portão | Código | Cabeça registada | É a cabeça atual? |
|---|---|---|---|
"""
    for name, g in gates.items():
        if close:
            meta = data["verificacao_final"][name]
            report += f"| {name} | [ler código]({meta['codigo_ficheiro']}) | [ler cabeça]({meta['cabeca_ficheiro']}) | conferida por --conferir-final |\n"
        else:
            report += f"| {name} | {g['codigo'] if g['codigo'] is not None else 'em curso ou sem registo'} | {g['cabeca'] or 'sem registo'} | {'sim' if g['cabeca_final'] else 'não'} |\n"
    report += "\n## Commits e cabeças\n\n"
    if close:
        report += "A cabeça final do sítio, incluindo o commit deste relatório, está em [portoes/cabeca](portoes/cabeca). A lista seguinte é a dos commits anteriores ao commit de fecho.\n\n"
    for name in ["motor", "sitio"]:
        report += f"{name}{', cabeça na medição preparatória' if close else ''}: `{heads[name]}`.\n\n" + ("\n".join("* `" + c + "`" for c in commits[name]) or "Ainda sem commit do bloco.") + "\n\n"
    report += "## Decisões em vigor\n\nA leitura antes das alterações identificou, nos ficheiros do motor, §1.6, §1.24, §1.31, §1.47, §1.108, §1.115, §1.126 e §1.145. Nos ficheiros de referência do sítio: §1.17, §1.24, §1.31, §1.32, §1.36, §1.40, §1.44 e §1.47. A proposta de integração adicional cita ficheiros abrangidos por §1.3, §1.17, §1.24, §1.28, §1.40, §1.47, §1.49, §1.68, §1.99, §1.124, §1.127 e §1.145. Os ficheiros novos foram explicitamente recusados pelo guião antes de existirem em HEAD; essa ausência não foi contada como leitura bem-sucedida. A lista final por ficheiro é guardada em decisoes-motor.log e decisoes-sitio.log após os commits.\n\n"
    report += "## Conferências e plantas executadas\n\n| Conferência | Resultado | Estrago plantado pela função de recusa |\n|---|---|---|\n"
    for t in tests["conferencias"]:
        report += "| " + md(t["nome"]) + " | passou | " + ("sim" if t["planta"] else "não") + " |\n"
    report += "\nAs recusas de bandeira junto de outro valor e de outro país também alteram entradas, mas verificam diretamente o resultado falso do detetor, em vez de esperar uma exceção.\n\n"
    if bcost is not None:
        report += """## OE1-b

Esta passagem integra as mesmas 186 linhas. O livro do motor, os YAML e o registo da travessia conservam os seus bytes; as lacunas de fonte descritas acima mantêm-se.

| Ficheiro | Alteração e razão |
|---|---|
| src/data/studies.mjs | Regista oe-2026 em INTERNAL_SOURCES com o nome «O dinheiro do Estado por ministério e por função (OE1)» e a nota de que aguarda a página do governo. Não acrescenta WORKS, conjunto ou rota. |
| src/data/areas.mjs | Declara que estas linhas aguardam a página do governo; o agregado da União conserva a regra europeia existente. Não atribui funções a ministérios. |
| src/i18n/lingua-dos-titulos.mjs | Declara a língua dos títulos, rótulos, fonte e edições lidos nas fontes, conservando os nomes. |
| src/i18n/unidades.mjs | Acrescenta apenas «milhões de euros» para «million euros», facto de dicionário. Não altera a unidade de nenhuma linha. O recurso a português com lang mantém-se para unidades sem tradução declarada. |
| src/lib/ledger.mjs | Confere as sete coordenadas, o único índice de valor, o índice da bandeira e o seu significado no JSON-stat. Compara o literal numérico em decimal. No formato anterior confere valor, período e localização indicada no pedido; conserva o formato regional com várias coordenadas. |
| tests/linha/cadeias-proveniencia.mjs | Executa as plantas dos dois formatos no mesmo validateLedger chamado pelo ledger:check. Altera cópias em memória e repõe as linhas originais. |
| design/especime-v3/INVENTARIO-FRASES.md | Reconfere duas contagens geradas pelo livro: 3195 linhas e 366 derivadas, nas duas línguas. Copia o texto do HTML e conserva a classificação e o formato do K2. Não altera palavras das páginas nem a emenda de voz do inventário. |
| medir.py; medidas.json | Reconstroem as contagens, os conhecidos positivos e o relatório; distinguem provas preparatórias dos ficheiros da corrida final. |
| custo.py; custo-oe1b.json | Medem o incremento dos contadores desde a ordem OE1-b e o tempo decorrido. |
| npm-sem-caminhos.py | Conserva os códigos, retira identificadores locais da saída e admite uma pasta separada para a comparação da base. |
| base-l1.py; base-l1.json | Constroem a versão de partida nesta worktree e conferem a reposição dos ficheiros. |
| medir-l1.mjs; l1-oe1b.json; scripts/lugar-tetos-b1.json | Comparam as listas completas, os padrões e as plantas; registam a contagem medida da L1. |
| cauda-verify.py; oe1b-cauda/ | Correm os comandos que a falha L1 tinha impedido de executar e conservam cada resultado, incluindo as falhas. |
| provar-tempos.py; plantas-tempos.json | Conferem a diferença de precisão dos relógios e a recusa de resultados antigos ou incompletos. |
| provar-localizadores.py; indice-localizadores.patch | Ensaiam a proposta dos sete formatos sem alterar a guarda aplicada. |
| provar-feixe.py; feixe-recorte.patch | Ensaiam o recorte do espécime numa pasta temporária, com a página e o teto intactos. |
| LEIA-ME.md; LINHAS.md; RESPOSTA-construtor-oe1.md; registos desta pasta | Reúnem as linhas, os resultados e as limitações; incluem os registos anteriores que estavam por commitar. |

O primeiro ledger:check desta passagem encontrou uma dependência ausente nas cópias temporárias de um teste: a worktree usava os módulos do diretório ascendente, mas a cópia isolada não os encontrava. Foi criada uma ligação relativa, ignorada pelo Git, para as dependências já instaladas. Nenhum pacote foi instalado ou alterado. A segunda corrida tem o código em oe1b-ledger-dependencias.codigo.

A primeira corrida completa encontrou quatro erros no inventário: as duas contagens antigas já não se rendiam e as duas novas ainda não estavam medidas. Esses códigos e mensagens estão em oe1b-portoes-inventario-antigo/. A recontagem atualiza apenas essas duas linhas de medição, dentro do perímetro de relatórios e medições; não acrescenta prosa às páginas. O campo k2 conserva quem fixou a classificação e o formato, e a razão identifica a recontagem OE1-b. Não se declara uma nova leitura editorial ou uma comunicação com a direção.

As plantas obrigam a recusar outro valor, outro país, outra célula, outro período, valor ausente, duas células, bandeira ausente ou deslocada, significado alterado, dimensão repetida e diferença numérica além da precisão float64. Os dois formatos reais passam antes e depois das plantas. No formato regional anterior, o pedido contém várias regiões e o excerto tem de nomear uma delas; não se afirma que o pedido identifique uma única região.

A guarda do fecho também foi vista a morder: --conferir-final saiu com código 1 enquanto a nova corrida estava por terminar, apesar de ainda existirem códigos antigos nos ficheiros. O registo é oe1b-planta-corrida-incompleta.log. A cabeça testada é portoes/cabeca, lida depois da obtenção da tranca; corrida-sitio.cabeca regista apenas a cabeça no momento de entrar na fila.

| Planta | Mordeu |
|---|---|
"""
        for t in btests:
            report += f"| {md(t['nome'])} | {'sim' if t['mordeu'] else 'não'} |\n"
        if l1 is not None:
            c = l1["contagens"]
            report += f"""
### OE1-b: a medição da L1

Depois da recontagem do inventário, o build, o ledger e o typecheck passaram, mas o verify recusou a L1: {c['estudos']} páginas com destinos repetidos, acima do teto de {c['antes']}. Os registos dessa corrida estão em oe1b-portoes-l1-anterior/.

A primeira comparação recusou a medição antiga do E1: já havia diferenças anteriores ao OE1 em páginas como /correcoes. A base foi por isso construída de novo nesta mesma worktree, com os ficheiros afetados repostos temporariamente a partir de {l1['commit_da_base']}, pela tranca, e todos os bytes atuais e o dist repostos no fim. base-l1.json identifica os ficheiros e prova a reposição. Os cabeçalhos Git dessa comparação conservam a cabeça da worktree; o commit dos ficheiros temporários está declarado separadamente. Não são os portões da cabeça final.

medir-l1.mjs corre a régua sem limite de amostra. Encontrou exatamente {c['entradas']} entradas, as 186 linhas OE1 nas duas línguas, zero saídas e zero alterações nas {c['antes']} entradas anteriores. Comparou ainda os padrões de links com {c['linhas_antigas_conferidas_no_html']} recibos antigos: nenhum padrão novo. Quatro plantas recusam recibo em falta, agravamento antigo, página extra e padrão desconhecido.

A atualização de scripts/lugar-tetos-b1.json é uma medição de apoio ao ponto 5 do OE1-b. Aponta a l1-oe1b.json e usa a contagem medida de {c['estudos']}; scripts/check-lugar.mjs permanece igual. A razão segue a regra escrita no início dessa régua: o teto pode acompanhar recibos novos com os mesmos padrões, mas não o agravamento de uma página antiga. Não se alteraram componentes, palavras das páginas, WORKS ou a declaração das rotas.

"""
        if tail is not None:
            report += f"Os {len(tail)} comandos posteriores à L1 foram também corridos separadamente: {sum(r["codigo"] == 0 for r in tail)} a 0 e {sum(r["codigo"] != 0 for r in tail)} com falha, para conferir os passos que a falha anterior impediu de executar. Os códigos e tempos estão em oe1b-cauda/resultados.json. Esta prova preparatória não substitui a corrida inteira na cabeça final, pela tranca.\n\n"
        report += "A precisão dos tempos também foi conferida: cinco casos isolados em plantas-tempos.json. Um início no mesmo segundo do corredor é aceite quando o fim é posterior; um fim antigo, um fim ausente e uma corrida anterior aos microssegundos do novo início são recusados. Um código de falha conserva-se como falha.\n\n"
        report += "### OE1-b: localizadores dos nomes no índice\n\n"
        report += "O check:indice recusou 150 rótulos publicados porque a sua lista fechada ainda só conhece quatro formatos de name_source. O motor escreve mais sete formatos: caminho da dimensão COFOG, célula XLS, campo XML, código ministerial e três formas de localizar linhas nos PDF. Não se mudou um rótulo nem se fabricou um localizador para caber na lista antiga.\n\n"
        report += "A proposta em indice-localizadores.patch acrescenta apenas essas sete formas a tests/livro/indice.mjs, cada uma com o leitor que a escreve nomeado. O ensaio corre a proposta em memória: índice a 0, 150 rótulos reconhecidos, quatro formatos anteriores conservados e doze plantas recusadas. A guarda aplicada foi conservada durante esse ensaio. As provas estão em proposta-localizadores.json e proposta-indice.log.\n\n"
        report += ("A proposta está aplicada; os códigos finais abaixo conferem a cabeça entregue.\n\n" if proposal_applied else "A proposta não está aplicada. Esta extensão da guarda da origem dos nomes fica fora das cinco adaptações expressamente enumeradas no OE1-b e requer ampliação do perímetro. O verify continua por fechar por esta razão.\n\n")
        report += "### OE1-b: o recorte do espécime de desenho\n\n"
        report += f"O design:feixe recusou o cartão 13, que copia o índice inteiro: 908545 bytes, acima do teto de 656,48046875 KiB. A regra escrita em scripts/design-bundle.mjs manda que, na próxima ultrapassagem, o retrato passe a recorte. A proposta feixe-recorte.patch conserva as primeiras oito entradas na ordem da página e declara o recorte no próprio espécime. No ensaio, o cartão mediu {bundle['bytes_cartao']} bytes; a página conservou as {bundle['conteudo']['origem']} entradas e o mesmo SHA-256. O teto e a margem não mudam.\n\n"
        report += "O ensaio gerou os cartões numa pasta temporária, sem alterar o gerador aplicado. As três plantas existentes do feixe morderam. Uma quarta retirou o recorte e voltou a exceder o teto do cartão 13. As provas estão em proposta-feixe.json e nos registos ao lado.\n\n"
        report += ("O recorte está aplicado apenas ao exportador dos espécimes.\n\n" if bundle_applied else "A proposta não está aplicada. Esta alteração do exportador dos espécimes fica fora das cinco adaptações enumeradas no OE1-b e requer ampliação do perímetro. É a segunda razão por que o verify continua por fechar.\n\n")
        report += "\nCódigos finais: " + ", ".join(f"[{n}](portoes/{n}.codigo)" if close else f"{n}={g['codigo']}" for n,g in gates.items()) + ". As cabeças estão ao lado, na mesma pasta.\n\n"
        report += "Custo desta passagem: [custo-oe1b.json](custo-oe1b.json), medido pelo incremento dos contadores desde a ordem OE1-b, com construção e revisões automáticas discriminadas. O ficheiro conserva o corte temporal e é atualizado após a corrida final.\n\n"
    if cproof:
        crop = cproof["feixe"]["recorte"]
        report += f"""## OE1-c

As duas extensões autorizadas estão aplicadas. Esta passagem conserva os bytes das 186 linhas e de todo o livro do sítio. O motor mantém a cabeça 9bfbb777f7d2f5af8b185475c8dd8027ebd76bad e não recebeu alterações.

| Ficheiro | Mudança e prova |
|---|---|
| tests/livro/indice.mjs | Recebe exatamente as sete expressões da proposta, com o leitor nomeado; as quatro anteriores permanecem iguais. As doze plantas substituem uma linha por uma cópia em memória, chamam as mesmas células I1 e I3 e exigem a queixa do localizador daquela linha e as duas queixas da busca. A reposição volta a conferir I1 e I3 limpas. |
| package.json | Acrescenta --prova ao comando check:indice para as doze plantas correrem dentro do verify. |
| scripts/design-bundle.mjs | Recorta só o espécime 13 para as primeiras oito entradas, na ordem original, com a nota e a porta para a página completa. A quarta planta retira o limite em memória e exige que o cartão 13 falhe apenas pelo teto. |
| medir-oe1c.py; oe1c-provas.json | Conferem a lista contra o patch autorizado, os valores do teto e da margem contra a cabeça anterior, os registos das plantas e os bytes das 186 linhas. No modo --final leem os códigos e as cabeças e escrevem o resultado da corrida e a resposta pedida. |
| medir.py; medidas.json | Incorporam as cinco medidas OE1-c, cada uma com conhecido positivo, e os resumos dos ficheiros efetivamente ensaiados. --conferir-final conserva a exigência de cinco zeros, tempos atuais e cabeças finais. |
| custo.py; custo-oe1c.json | Medem o incremento dos contadores desde a ordem OE1-c, separado da passagem anterior. |
| LEIA-ME.md; RESPOSTA-construtor-oe1.md; registos desta pasta | Guardam o estado, as provas e as limitações; o primeiro commit incluiu os cinco corrida-sitio.* e custo-oe1b.json que estavam por comitar. |

Os ensaios preparatórios estão a 0 em [oe1c-indice.codigo](oe1c-indice.codigo) e [oe1c-feixe.codigo](oe1c-feixe.codigo). I1, I3, as doze plantas dos localizadores, os quatro formatos anteriores e as quatro plantas do feixe passaram. A lista das queixas efetivas está em [oe1c-provas.json](oe1c-provas.json), com os resumos dos ficheiros de código ensaiados.

O primeiro ensaio da nova planta do feixe saiu a 1: a comparação do teste convertia o domínio legível com acento para punycode, mas o exportador escreve o domínio legível. O teste passou a comparar o endereço literal que o exportador já escreve. A página, as oito entradas e a ordem estavam corretas. O registo da falha conserva-se em oe1c-feixe-primeira.log; nenhuma regra do teto foi mudada.

| Medida do recorte | Resultado do ensaio |
|---|---:|
| Entradas na página integral | {crop['entradas_na_pagina']} |
| Entradas no espécime | {crop['entradas_no_recorte']} |
| Bytes do espécime | {crop['bytes_cartao']} |
| Bytes sem o recorte, na planta | {crop['bytes_sem_recorte']} |
| Teto em bytes, inalterado | {crop['teto_bytes']} |
| Margem, inalterada | {crop['margem']} |

O SHA-256 da página integral manteve-se {crop['pagina_sha256']}. A planta sem recorte retém o título e a nota da configuração atual, por isso os seus bytes diferem do espécime integral anterior ao OE1-c.

A corrida inteira seguinte é feita na cabeça que inclui este relatório, pela tranca. Os códigos efetivos são lidos de [motor.codigo](portoes/motor.codigo), [ledger.codigo](portoes/ledger.codigo), [build.codigo](portoes/build.codigo), [verify.codigo](portoes/verify.codigo) e [typecheck.codigo](portoes/typecheck.codigo), com as cabeças ao lado. O [resultado final OE1-c](OE1-c-resultado.md) e [oe1c-final.json](oe1c-final.json) são escritos depois dessa corrida, sem atribuir à cabeça final os resultados preparatórios. --conferir-final exige os cinco zeros. Outro vermelho faz parar para relato.

As queixas «história do valor» e data-linha-claim fora do livro, dentro do JSON das plantas anteriores, são resultados esperados dessas plantas, não defeitos da cabeça. Não foram alteradas.

As decisões em vigor estão registadas em decisoes-oe1c.log. Os commits desta passagem, anteriores ao commit do relatório, constam da lista de commits acima; a cabeça final está em portoes/cabeca.

O custo desta passagem é o corte de [custo-oe1c.json](custo-oe1c.json), pelos contadores, com cache e revisões automáticas separados. O modo --oe1c de custo.py usa o momento da ordem OE1-c. Modelo: Codex gpt-6-astra. Os registos da execução final são escritos depois do commit, para poderem nomear a cabeça que foi realmente testada.

As lacunas de receita consolidada AC+SS, saldo dos mapas, despesa bruta da Segurança Social e necessidades de financiamento mensais mantêm as razões descritas no início deste relatório. Não se acrescentou um valor para as preencher.

"""
    report += "## Custo medido\n\nModelo: Codex gpt-6-astra, confirmado pelo registo da sessão. O custo em símbolos é o acumulado dos eventos token_count até à medição, separado entre construção e revisão automática. Inclui entradas lidas da cache; não é o preço monetário. Mensagens posteriores à medição ficam fora desse corte.\n\n```json\n" + encoded(costs) + "```\n\n"
    report += "## Tabela integral das linhas\n\n" + "\n".join(table) + "\n"
    (HERE / "LEIA-ME.md").write_text(report)
    folder = "design/especime-v3/medicoes/oe1-2026-10-04/"
    short = f"""OE1 parcial. O teste de aceitação do §2 não está cumprido.

Cabeças dos dois ramos `oe1-2026-10-04`:

* Motor: `{heads['motor']}`.
* Sítio: `{heads['sitio']}`.

Commits: motor {', '.join('`' + c.split()[0][:8] + '`' for c in reversed(commits['motor']))}; sítio {', '.join('`' + c.split()[0][:8] + '`' for c in reversed(commits['sitio']))}.

Códigos lidos de ficheiro: motor **{gates['motor']['codigo']}**; ledger **{gates['ledger']['codigo']}**; build **{gates['build']['codigo']}**; verify **{gates['verify']['codigo']}**; typecheck **{gates['typecheck']['codigo']}**. As cabeças acompanham os registos em `portoes/`.

| Linhas exportadas | Número |
|---|---:|
| Rubricas ministeriais | 16 |
| Programas, orçamento e execução | 40 |
| Funções, orçamento e execução | 20 |
| Eurostat, Portugal, Espanha e União | 30 |
| Totais, indicadores e consolidação | 44 |
| Derivadas de cada 100 euros | 36 |
| Total | 186 |

[Relatório]({folder}LEIA-ME.md) e [tabela integral, com ids, fontes, valores, períodos e localizadores]({folder}LINHAS.md).

Ficaram por fechar a receita consolidada AC+SS e o saldo nos mapas, a divergência da despesa bruta da Segurança Social e as necessidades de financiamento mensais. O OE1-b integra o conjunto, prova os dois formatos da bandeira e reconfere a L1 dos recibos gerados pelo livro. Nenhuma página do governo, entrada em WORKS ou declaração de rota foi acrescentada.

Custo OE1-b ao corte: {(bcost or {}).get('tokens_totais', 'por medir')} símbolos, incluindo {(bcost or {}).get('tokens_entrada_cache', 'por medir')} de cache, e {(bcost or {}).get('segundos', 'por medir')} segundos. Modelo: Codex gpt-6-astra. O custo da construção inicial permanece no relatório. As medições posteriores ao último commit ficam na worktree, identificadas no relatório.
"""
    if not proposal_applied:
        short += "\nFalta ainda autorizar a proposta indice-localizadores.patch, que ensaiou os sete formatos dos localizadores no verificador do índice com código 0. A guarda aplicada continua a recusar esses formatos e o verify fica por fechar.\n"
    (SITE / "RESPOSTA-construtor-oe1.md").write_text(short)
    if close:
        short = short.replace("Commits:", "Commits anteriores ao fecho:")
        short = short.replace(f"* Sítio: `{heads['sitio']}`.", "* Sítio: [cabeça final registada](" + folder + "portoes/cabeca), incluindo o commit desta resposta.")
        a, b = short.index("Códigos lidos de ficheiro:"), short.index("| Linhas exportadas")
        short = short[:a] + "Códigos finais lidos de ficheiro: " + ", ".join(f"[{n}]({folder}portoes/{n}.codigo)" for n in gates) + ". As cabeças acompanham os registos; --conferir-final exige zero e a cabeça atual.\n\n" + short[b:]
        short = short[:short.index("Custo OE1-b ao corte:")] + "Custo OE1-b: [contadores e segundos ao último corte](" + folder + "custo-oe1b.json). Modelo: Codex gpt-6-astra. Os relatórios ficam comitados; os ficheiros da última execução são escritos depois do commit.\n"
        if not proposal_applied:
            short += "\nFalta autorizar [a proposta dos sete formatos de localizador](" + folder + "indice-localizadores.patch). O ensaio em memória passou; a guarda aplicada permanece intacta e o verify continua por fechar.\n"
        if not bundle_applied:
            short += "\nFalta também autorizar [o recorte do espécime do índice](" + folder + "feixe-recorte.patch): oito entradas, página integral intacta e teto conservado. O ensaio passou; o exportador aplicado ainda excede o teto.\n"
        (SITE / "RESPOSTA-construtor-oe1.md").write_text(short)
    if cproof and close:
        short = f"""OE1-c: as duas extensões estão aplicadas e ensaiadas. O OE1 integral continua parcial pelas lacunas de fonte.

Motor: `{heads['motor']}`. Sítio: [cabeça final](""" + folder + """portoes/cabeca), incluindo o commit desta resposta.

Commits anteriores ao fecho: """ + ", ".join("`" + c.split()[0][:8] + "`" for c in reversed(commits['sitio'])) + """. O motor não recebeu commits nesta passagem.

Doze plantas dos localizadores e quatro do feixe morderam. As 186 linhas conservam os seus bytes; os quatro formatos anteriores, o teto e a margem mantêm-se.

Códigos da corrida final: """ + ", ".join(f"[{n}]({folder}portoes/{n}.codigo)" for n in gates) + """. Os códigos e as cabeças são lidos de ficheiro depois da corrida inteira pela tranca; --conferir-final exige os cinco zeros e a cabeça atual.

[Resultado final com cabeças, commits, códigos e custo](""" + folder + """OE1-c-resultado.md). [Relatório, secção OE1-c](""" + folder + """LEIA-ME.md). [Tabela integral das 186 linhas](""" + folder + """LINHAS.md).

Continuam por selar a receita consolidada AC+SS e o saldo nos mapas, a divergência da despesa bruta da Segurança Social e as necessidades de financiamento mensais. As razões mantêm-se no relatório.

Custo OE1-c: [contadores e segundos ao corte](""" + folder + """custo-oe1c.json). Modelo: Codex gpt-6-astra. Relatório e resposta curta comitados; registos da execução final escritos depois do commit. Nenhum push.
"""
        (SITE / "RESPOSTA-construtor-oe1.md").write_text(short)
    print(encoded(dict(linhas=len(rows), medidas=len(measures), conhecidos_positivos=all(m["conhecido_positivo"] for m in measures.values()), portoes=gates)))


if __name__ == "__main__":
    if "--conferir-final" in sys.argv:
        results = {n: gate(n) for n in ["motor", "ledger", "build", "verify", "typecheck"]}
        for n, g in results.items():
            assert g["codigo"] == 0, f"{n}: código diferente de zero ou corrida por terminar"
            assert g["cabeca"] == git(MOTOR if n == "motor" else SITE, "rev-parse", "HEAD"), f"{n}: outra cabeça"
        assert (HERE / "portoes/cabeca.fim").read_text().strip() == git(SITE, "rev-parse", "HEAD")
        print(encoded(results))
    else:
        main()
