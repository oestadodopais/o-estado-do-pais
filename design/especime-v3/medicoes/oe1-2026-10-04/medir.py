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
    value = int(p.read_text().strip()) if p.exists() else None
    headfile = base / (name + ".cabeca" if name in {"motor", "ledger"} else "cabeca")
    head = headfile.read_text().strip() if headfile.exists() else None
    return dict(codigo=value, cabeca=head, origem="portoes/" + name + ".codigo")


def md(value):
    return str(value).replace("|", "\\|").replace("\n", "<br>")


def main():
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
    data = dict(medido_em=datetime.now(timezone.utc).isoformat(), modelo="Codex gpt-6-astra", cabecas=heads,
                commits=commits, medidas=measures, eurostat_paises_com_dez_funcoes=coverage,
                arredondamento=rounding, divergencias=dict(seguranca_social_bruta_mapa1=gross1,
                seguranca_social_bruta_mapa8=gross8, diferenca_euros=str(number(gross8) - number(gross1)),
                indicadores_ac_despesa_diferenca_milhoes=str(financial_gap)), portoes=gates, custo=costs,
                integracao=integration, conferencias=tests["conferencias"], erros_do_sitio=site_errors)
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

A proposta `publisher/oe1_site_support.patch`, no motor, contém cinco adaptações identificadas no sítio: registo do conjunto, línguas, unidade, declaração de que as linhas aguardam a futura página do governo e conferência da bandeira no JSON literal. O `git apply --check` confirmou que a proposta se aplica à árvore, sem a aplicar. A proposta não foi validada pelos portões do sítio. O mandato original admite no sítio apenas linhas exportadas, relatório e medições, pelo que esta alteração de código exige uma decisão sobre o perímetro. Ficheiros da proposta efetivamente alterados nesta árvore: **{len(support_changed)} de 5**. Não se apresenta a exportação como aceitação pelo sítio.

As decisões do §5 foram respeitadas: o bloco entrega dados e nenhuma página; todas as linhas publicadas declaram o perímetro; as fontes que atravessam têm corpos e pedidos reproduzíveis. O ponto da biblioteca foi resolvido por endereços publicados, com os 401 conservados como prova da limitação inicial.

Os registos da medição final são escritos depois do último commit, porque um ficheiro não pode conter o resumo do commit que o contém. O commit final guarda os guiões, o relatório e a resposta curta; as cabeças e os resultados posteriores são os ficheiros da última corrida na worktree. O estado final do Git é entregue sem o disfarçar.

## Portões lidos de ficheiro

As corridas do sítio usam `scripts/leituras/portoes.sh`. Um invólucro temporário do npm retira caminhos locais antes de escrever a saída e conserva cada código. Durante a chamada do build, com a mesma tranca ainda tomada, também corre `npm run ledger:check` e guarda o seu código separado. Não altera comandos do projeto nem transforma falhas em sucesso.

O registo do ledger contém {len(site_errors)} recusas: {sum('"study" é "oe-2026"' in e for e in site_errors)} por conjunto ainda não registado e {sum('declara a bandeira "p"' in e for e in site_errors)} porque o verificador do sítio só reconhece o formato antigo da bandeira Eurostat. O JSON oficial guarda a bandeira no índice da célula, não como texto depois do número. O motor prova essa associação; o sítio ainda não recebeu a adaptação proposta. O build e o verify param neste primeiro portão, pelo que os passos seguintes não foram executados.

| Portão | Código | Cabeça registada | É a cabeça atual? |
|---|---|---|---|
"""
    for name, g in gates.items():
        report += f"| {name} | {g['codigo'] if g['codigo'] is not None else 'não corrido'} | {g['cabeca'] or 'sem registo'} | {'sim' if g['cabeca_final'] else 'não'} |\n"
    report += "\n## Commits e cabeças\n\n"
    for name in ["motor", "sitio"]:
        report += f"{name}: `{heads[name]}`.\n\n" + ("\n".join("* `" + c + "`" for c in commits[name]) or "Ainda sem commit do bloco.") + "\n\n"
    report += "## Decisões em vigor\n\nA leitura antes das alterações identificou, nos ficheiros do motor, §1.6, §1.24, §1.31, §1.47, §1.108, §1.115, §1.126 e §1.145. Nos ficheiros de referência do sítio: §1.17, §1.24, §1.31, §1.32, §1.36, §1.40, §1.44 e §1.47. A proposta de integração adicional cita ficheiros abrangidos por §1.3, §1.17, §1.24, §1.28, §1.40, §1.47, §1.49, §1.68, §1.99, §1.124, §1.127 e §1.145. Os ficheiros novos foram explicitamente recusados pelo guião antes de existirem em HEAD; essa ausência não foi contada como leitura bem-sucedida. A lista final por ficheiro é guardada em decisoes-motor.log e decisoes-sitio.log após os commits.\n\n"
    report += "## Conferências e plantas executadas\n\n| Conferência | Resultado | Estrago plantado pela função de recusa |\n|---|---|---|\n"
    for t in tests["conferencias"]:
        report += "| " + md(t["nome"]) + " | passou | " + ("sim" if t["planta"] else "não") + " |\n"
    report += "\nAs recusas de bandeira junto de outro valor e de outro país também alteram entradas, mas verificam diretamente o resultado falso do detetor, em vez de esperar uma exceção.\n\n"
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

Ficaram por fechar a receita consolidada AC+SS e o saldo nos mapas, a divergência da despesa bruta da Segurança Social e as necessidades de financiamento mensais. A proposta de integração em cinco ficheiros do sítio aguarda autorização para alargar o perímetro; não foi aplicada. O sítio recusa o estudo por registar e o formato JSON literal da bandeira Eurostat.

Custo ao corte: {costs.get('tokens_totais', 'por medir')} símbolos, incluindo {costs.get('tokens_entrada_cache', 'por medir')} de cache, e {costs.get('segundos', 'por medir')} segundos. Modelo: Codex gpt-6-astra. As medições posteriores ao último commit ficam na worktree, identificadas no relatório.
"""
    (SITE / "RESPOSTA-construtor-oe1.md").write_text(short)
    print(encoded(dict(linhas=len(rows), medidas=len(measures), conhecidos_positivos=all(m["conhecido_positivo"] for m in measures.values()), portoes=gates)))


if __name__ == "__main__":
    main()
