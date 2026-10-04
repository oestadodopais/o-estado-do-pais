#!/usr/bin/env python3
"""Redige o relatório a partir das medidas, sem copiar números à mão."""
import json
from pathlib import Path
pasta=Path(__file__).resolve().parent
m=json.loads((pasta/'medidas.json').read_text())
v={e['nome']:e['valor'] for e in m['medidas']}
c=m['custo'];u=c['total_cumulativo_parcial'];cb=m['custo_h2b'];ub=cb['total_cumulativo_parcial']
def numero(x):return f'{x:,}'.replace(',', ' ').replace('.', ',')
portoes='\n'.join(f"| `{g}` | {p['codigo']} | {p['segundos']:g} | `{p['inicio']}` | `{p['fim']}` |" for g,p in m['portoes'].items())
commits='\n'.join(f"- `{s.split(' ',1)[0]}`: {s.split(' ',1)[1]}" for s in m['commits'])
ficheiros='\n'.join(f"| `{p['ficheiro']}` | {p['motivo']} |" for p in m['paginas_so_ficheiro'])
texto=f'''# H2 · a passagem de higiene de 04.10.2026

Depois das emendas H2-b, a implementação e as provas locais estão verdes na cabeça de código `{m['cabeca_codigo']}`. O ensaio histórico do H2 está verde na cabeça `{m['github']['headSha']}`; não houve publicação nesta passagem. A aceitação que exige uma corrida posterior de `main` depende da aterragem pelo diretor; este construtor não publicou `main` nem `h2-2026-10-04`. A linha final do H2 já foi recolhida; a desta passagem H2-b continua em `[verify]`, separada do contador parcial medido.

## A reprodução antes de mexer

Foram lidos o `CLAUDE.md`, o mapa inteiro e o brief. Antes da primeira alteração, o guião do brief produziu `brief-reproduzido.json`: as {v['medicoes_do_brief_reproduzidas']} medidas, os comandos e os conhecidos-positivos são integralmente iguais a `design/observatorio/medidas/BRIEF-H2.json`. Portanto, o §0 bate. Essa referência lê a cabeça presa `905105b7`; a base efetiva desta worktree era `{m['base']}`. Não se confundem as duas cabeças.

```sh
OEDP_MEDIDAS_JSON=design/especime-v3/medicoes/h2-2026-10-04/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-H2.py
```

## O mandato, ponto a ponto

| Ponto | Resultado e medida | Prova |
|---|---|---|
| 1 · estudo em curso | Évora declara `emCurso`, a razão e o horizonte de acompanhamento. A primeira página conserva {v['estudos_recentes_pt']} estudos em cada edição, com {v['marcas_em_curso_pt']} marca na portuguesa e {v['marcas_em_curso_en']} na inglesa, no estudo à cabeça. A marca imprime o ano lido da ficha. O prazo passado fecha a construção e exige decidir a ficha: prolongar a data ou retirar o estado. | `medidas.json`, `capturas.json`, E1 de `check:pais`, plantas e `tests/inicio/estudos-em-curso.mjs`. |
| 2 · I190 | {v['ligacoes_dentro_de_outras']} ligações dentro de outras nos {v['paginas_html']} HTML construídos, incluindo a lista inglesa. O título é a própria porta. A recusa de `a a` corre antes da saída antecipada dos documentos. | Varrimento integral em `medir-h2.mjs`; planta da ligação encaixada. |
| 3 · I191 | {v['portas_antigas_nas_areas']} portas para `/texto` ou `/text` nas {v['paginas_de_area']} páginas de área das duas edições. As pastas das áreas contêm {v['ficheiros_html_sob_pastas_das_areas']} ficheiros HTML, contando também os índices. O título liga à página do estudo; a porta auxiliar redundante foi retirada. | A2 de `check:areas`, `check:mortos` e planta da rota antiga. |
| 4 · I192 | Caminhos sem extensão só resolvem pela pasta com `index.html`; ficheiros com extensão resolvem pelo nome exato. Há {v['paginas_so_com_ficheiro_html']} página só em ficheiro, enumerada abaixo. | Planta de `/404` quando só existe `404.html`; a âncora interna do próprio ficheiro resolve a partir de `/404.html`. |
| 5 · I193 | A isenção conta apenas as palavras dentro do endereço completo da API do INE. Prosa antes ou depois do endereço continua sujeita à régua. | Controlos em memória de `check:lugar` e planta com prosa no mesmo bloco. |
| 6 · I194 | No H2, {v['corridas_locais_i194']} repetições locais, cada uma com {v['plantas_por_corrida_i194']} controlos e plantas. A troca mede bytes e hora iguais, outro inode e a mordida da D. A função `celulaDoDist` tem {v['celula_d_alterada']} alterações, por comparação literal com a base. A corrida remota `{m['github']['databaseId']}` passou. | `i194-repeticoes.json`, `github-i194.json`, `github-ensaio.json` e os logs. A corrida de `main` ainda fica por fazer na aterragem. |
| 7 · M49 | `PACOTE_RETIRA` filtra secções do diff e conserva os ficheiros; `PACOTE_MOTOR` leva ficheiros e diff da cabeça do motor com as exclusões declaradas. {v['controlos_do_pacote']} controlos e plantas passaram. | `tests/leituras/pacote.py`, `pacote-plantas.json`; cobre os dois lados, caminhos com espaços e acentos, bytes vindos do Git, extras e a conferência prévia do relatório. |
| 8 · registos | As {v['questoes_fechadas']} questões estão fechadas com data e commit; a M49 está feita. Inventário, chaves inglesas, revisão por ler e mapa atualizados. As {v['citacoes_mapa_conferidas']} citações do mapa conferem, com {v['citacoes_mapa_com_desvio']} desvios. Há {v['capturas_pagina_inteira']} capturas inteiras e {v['capturas_recorte']} recortes. | Esta pasta, as capturas, `mapa.log`, `medidas.json` e o resultado de `conferir-relatorio.py`. |

O estado é uma composição declarada, conferida palavra a palavra e na sua estrutura por `meta-do-estudo.mjs`. A régua da voz não ganha uma isenção livre: lugar, tema, data ou estado trocados e prosa acrescentada são recusados. A planta em memória que retira `emCurso` da cópia da ficha e retira a marca do HTML passa, provando que encerrar o acompanhamento não exige remendar o inventário. O resolvedor de recentes continua a devolver o conjunto completo de trabalhos, necessário à contagem das publicações; só muda a ordenação e a vista conserva o corte.

### Páginas que só existem como ficheiro

| Ficheiro | Razão |
|---|---|
{ficheiros}

## As plantas e o que mordem

As {v['plantas_sobre_dist']} plantas sobre o `dist/` saíram com o código de recusa esperado e cada ficheiro voltou ao mesmo resumo. Correram como prova do bloco, fora de `verify`, antes dos portões finais. Nenhuma foi acrescentada à cadeia que a célula D vigia.

| Planta | O que deve recusar |
|---|---|
| `h2-em-curso-retirado` | O estudo declarado em curso retirado da primeira página. |
| `h2-em-curso-fora-da-cabeca` | O estudo em curso presente mas fora da cabeça da lista. |
| `h2-em-curso-sem-marca` | A marca em palavras retirada da edição inglesa. |
| `h2-ligacao-dentro-de-outra` | Uma ligação dentro de outra na lista inglesa. |
| `h2-porta-so-com-html-irmao` | A porta `/404`, que antes passaria pelo ficheiro irmão. |
| `h2-indicador-fora-do-endereco` | «indicador» em prosa no bloco que também contém o endereço legítimo. |
| `h2-area-porta-antiga` | A porta antiga do texto numa área. |
| `h2-voz-estado-trocado` | A palavra do estado trocada, recusada pela conferência da voz. |

O registo atual completo está em `plantas-portoes-h2.json`, incluindo comando, mordida esperada e resumos antes e depois da reposição; a saída efetiva de cada recusa está no log da respetiva planta. No H2-b todas correram novamente pelo prefixo H2, na cabeça do código e com o estado seguido vazio antes de cada planta. Reproduzem-se com:

```sh
mkdir -p design/especime-v3/medicoes/h2-2026-10-04/reproducao
OEDP_MEDICOES=design/especime-v3/medicoes/h2-2026-10-04/reproducao node tests/pais/portoes.mjs --prefixo h2-
python3 tests/leituras/pacote.py
node scripts/verify-depois-do-build.mjs --prova --json design/especime-v3/medicoes/h2-2026-10-04/i194-reproduzida.json
```

A planta do pacote corrompe separadamente uma exclusão do diff e um ficheiro copiado do motor, confirma a recusa e repõe os dois lados. Conserva também o caso limpo sem as novas variáveis. Os códigos de aviso e erro da conferência numérica mantêm significados distintos: o relatório com números por conferir acompanha o pacote com aviso; uma conferência que nem consegue correr impede a montagem.

### A causa e a medida da I194

A redação anterior punha preparação, cópia, `touch -r` e substituição na cadeia separadas por `&&`. O próprio orquestrador divide essa cadeia em conferências independentes e lança-as em paralelo. A planta, portanto, não assegurava a ordem necessária para criar a cópia antes de lhe repor a hora e a substituir. Agora um único comando executa essas operações sincronamente. A planta só passa se a troca também saiu a zero, teve um único passo, preservou conteúdo e hora, mudou o inode e foi recusada pela célula D. Não há salto dependente da máquina nem retirada da planta.

Foi consultada a corrida histórica `37199669028`: tentativa inicial vermelha e repetição verde na mesma cabeça, guardadas em `github-historico.json`; a queixa original está em `i194-historico.log`. Esses logs não medem a ordem exata dos processos da tentativa antiga, pelo que não a invento. A falha de ordenação está demonstrada pela leitura do divisor da cadeia e da planta; a nova premissa foi medida localmente e no runner.

O único ramo publicado no H2 foi `h2-ensaio-i194-2026-10-04`, na cabeça `{m['github']['headSha']}`. O H2-b não publicou nenhum ramo. A [corrida `{m['github']['databaseId']}`]({m['github']['url']}) passou no `ubuntu-24.04`; `github-i194.json` conserva a medida da troca e a mordida. O ramo remoto foi apagado depois da conclusão; a consulta posterior encontra {v['ramos_de_ensaio_remotos_restantes']} referências (`github-ramo-apagado.json`). A exigência de duas corridas remotas, ramo e `main`, não é declarada cumprida: a segunda depende da publicação de `main`, excluída do mandato deste construtor.

## Os portões na cabeça do código

```sh
sh scripts/leituras/portoes.sh <esta-worktree> design/especime-v3/medicoes/h2-2026-10-04/portoes
```

Corrida pela tranca da máquina. Os códigos abaixo foram lidos de `portoes/build.codigo`, `portoes/verify.codigo` e `portoes/typecheck.codigo`, sem cadeia com `|`. `portoes/cabeca` e `portoes/cabeca.fim` contêm ambos `{m['cabeca_codigo']}`. Os resumos dos logs, já sem caminhos locais, estão em `medidas.json`.

| Portão | Código lido | Segundos | Início UTC | Fim UTC |
|---|---:|---:|---|---|
{portoes}

Os tempos dos portões usam carimbos com resolução de 1 segundo; o valor nulo de `typecheck` significa que terminou no mesmo segundo em que começou.

Entre commits correram as conferências tocadas pela mudança. Os registos originais do H2 foram feitos sobre árvores por comitar: os resumos de commit que escrevi não identificavam todo o código testado. O H2-b substitui os registos de `check:pais`, `gate:html`, `check:lugar` e do mapa por corridas na cabeça do código, com `git status --porcelain --untracked-files=no` vazio antes e depois. Os registos adicionais e cada planta sobre o `dist/` também escrevem cabeça e estado. Os restantes registos antigos conservam valor histórico, não são apresentados como provas da cabeça H2-b. No fecho correram os portões inteiros. Não houve paragem por um portão de número, fonte ou pessoa. A comparação com a base encontra {v['ficheiros_de_conteudo_alterados']} ficheiros alterados em `ledger/`, `registos/` ou `studies-src/`.

## Capturas e leitura visual

`captar-h2.mjs` serviu a construção desta cabeça apenas localmente, esperou pelas fontes e guardou a primeira página nas larguras {', '.join(str(x) for x in m['capturas']['larguras'])} px, nas edições portuguesa e inglesa, em `design/especime-v3/capturas/h2-2026-10-04/`. Há uma página inteira e um recorte dos estudos por combinação. `capturas.json` guarda as dimensões, a lista apresentada, as marcas e os resumos dos PNG; não encontrou transbordo horizontal nem erros de página.

A inspeção visual efetiva está registada em `leitura-visual.json`, com os ficheiros vistos e os critérios. A marca aparece junto da data, a ordem conserva o estudo em curso à cabeça e o texto permanece legível nas larguras pedidas.

## Commits e fecho

{commits}

Todos levam os trailers `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g`. O commit de entrega seguinte contém apenas esta pasta de medições e a pasta de capturas; o seu resumo está na resposta ao diretor, fora do próprio commit para não criar uma referência circular. Nenhum código mudou depois da cabeça verde acima.

Cada medida em `medidas.json` leva comando e conhecido-positivo. O coletor recusa uma premissa falsa; não se limita a imprimir contagens. `conferir-relatorio.py` foi corrido sobre este relatório e esta pasta, com o resultado em `conferencia-relatorio.json`, e o log e o código em `relatorio-trabalho.log` e `relatorio-trabalho.codigo`.

## Modelo, custo e o que falta

Modelo lido no registo de lançamento: `{m['modelo']}`. O instante inicial, o instante do último contador e o instante da leitura de fecho estão em `custo.json`. Até essa leitura decorreram {numero(c['segundos_ate_fecho'])} segundos. O contador cumulativo parcial da própria sessão era {numero(u['total_tokens'])} símbolos: {numero(u['input_tokens'])} de entrada (incluindo {numero(u['cached_input_tokens'])} em cache) e {numero(u['output_tokens'])} de saída. Esse contador é parcial e inclui entradas em cache; não é apresentado como a linha final «tokens used».

**Linha final «tokens used» do H2: {numero(c['tokens_used'])}.** Proveniência: o registo do lançador, lido pelo lugar de direção às 22:31 UTC de 04.10.2026 e comunicado no mandato H2-b; a linha foi também reconferida pelo construtor. O contador parcial anterior permanece em `custo.json` ao lado do total final e da proveniência. O tempo acima continua a ser o que foi medido até à leitura original.

A leitura a frio do H2 está em `LEITURA-H2-2026-10-04.md`. Ficam a releitura das emendas H2-b, a aterragem e a corrida de `main` sob responsabilidade do diretor, e a recolha da linha final do custo desta passagem após o encerramento. O ramo de trabalho não foi publicado. As chaves inglesas continuam com a revisão humana marcada por ler; não se atribui a este construtor essa revisão.
'''
texto+=f'''
## H2-b · as emendas depois da leitura a frio

A passagem parte de `{m['base_h2b']}`. Os achados plantados nas cópias do pacote não estavam no ramo; a divergência real de nome na contagem das áreas foi corrigida: {v['paginas_de_area']} páginas de área, a contagem da `check:areas`, e {v['ficheiros_html_sob_pastas_das_areas']} ficheiros HTML sob as pastas das áreas, com os índices. A medida conserva os dois nomes distintos e confirma as rotas declaradas contra os ficheiros existentes.

| Achado | Emenda e prova |
|---|---|
| 6 · I194 | A linha da questão fecha pela planta determinística e pela corrida de ensaio `37238803296`, no `ubuntu-24.04`, na cabeça `f7048ce0`. A aceitação do brief, o portão verde no ramo e em `main`, confirma-se na aterragem e é registada em `DECISIONS.md` §1.158 pelo lugar de direção. A célula D não foi alterada. |
| 7 · cabeça das provas | {v['plantas_h2_na_cabeca_limpa']} plantas H2 e {v['registos_de_trabalho_limpos']} registos de trabalho correram em `{m['cabeca_codigo']}` com `estado` vazio. O coletor recusa um registo de outra cabeça ou com diferenças seguidas. Os resultados ficaram fora da árvore enquanto corriam, para a escrita das provas não sujar a corrida seguinte. |
| 8 · argumento relativo | O repositório passa a caminho absoluto real antes da troca por marcas. A planta com `.` confirma que `relatorio.md` e `conferir-relatorio.py` conservam os pontos e que a conferência chega intacta ao pacote. |
| 9 · árvore suja | O pacote recusa modificações em ficheiros seguidos, com a razão escrita, antes de criar a pasta. Há plantas de alteração no sítio e no motor sintéticos; o controlo limpo inclui um `node_modules` ligado e não seguido. Nenhum ficheiro do motor real foi escrito. |
| 10 · data e horizonte | A E1 e os testes leem o dia UTC de `dist/version.json`. Uma data anterior exige decidir a ficha. O próprio dia-limite é válido. A marca diz «{m['primeiras']['pt'][0]['marca']}» / «{m['primeiras']['en'][0]['marca']}», com o ano vindo de `emCurso.ate`; as cadeias, o inventário e as capturas foram atualizados. |
| 11 · registos | O resto do estado antigo da I190 saiu. A linha H2 da revisão ficou dentro da tabela; a formulação nova mantém a revisão humana por ler. |
| 12 · custo | O H2 conserva o parcial e passa a citar a linha final de {numero(c['tokens_used'])} símbolos com proveniência. Esta passagem tem o parcial medido abaixo e a linha final em `[verify]`. As capturas foram refeitas por cima das anteriores, nas larguras e edições pedidas. |

As plantas novas são o prazo passado (com a exigência de decisão), o prazo do próprio dia e o futuro como controlos válidos, a data ausente ou impossível, a retirada explícita do estado, o ano errado na marca, o argumento `.` no pacote e as árvores seguidas sujas. Os testes do prazo correm mesmo sem fichas reais em curso; contam {v['controlos_prazo_e_composicao']} controlos e plantas de prazo e composição. A planta adicional `h2b-horizonte-trocado` põe um ano errado na página e exige a recusa do `gate:html`, conservando a proteção numérica. O seu resultado está em `plantas-portoes-h2b.json`. Todas as plantas que escrevem no `dist/` continuam fora do `verify`.

Os {v['controlos_do_pacote']} controlos e plantas do pacote estão em `pacote-plantas.json`; os testes apenas criam repositórios sintéticos temporários. Os registos de trabalho com a cabeça e o estado são enumerados por `registos_trabalho` em `medidas.json`.

Cabeça do código H2-b: `{m['cabeca_codigo']}`. Os códigos lidos de ficheiro são build {m['portoes']['build']['codigo']}, verify {m['portoes']['verify']['codigo']} e typecheck {m['portoes']['typecheck']['codigo']}, na corrida completa pela tranca mostrada acima. Os commits desta passagem são:

'''+'\n'.join(f"- `{s.split(' ',1)[0]}`: {s.split(' ',1)[1]}" for s in m['commits_h2b'])+f'''

O último commit, posterior a esta cabeça, contém só provas e capturas. O seu resumo consta da resposta H2-b, fora do próprio commit.

Modelo desta passagem: `{cb['modelo']}`. Até `{cb['fecho']}` decorreram {numero(cb['segundos_ate_fecho'])} segundos desde o mandato H2-b. O parcial medido desta passagem é {numero(ub['total_tokens'])} símbolos: {numero(ub['input_tokens'])} de entrada, dos quais {numero(ub['cached_input_tokens'])} em cache, e {numero(ub['output_tokens'])} de saída. É a diferença entre o contador anterior ao mandato e o último contador da mesma sessão, ambos conservados em `custo-h2b.json`; não inclui o trabalho H2 anterior. Linha final «tokens used» desta passagem: `[verify]`.

Não houve `push` nesta passagem. Ficam a releitura H2-b, a revisão humana das cadeias novas, a aterragem com a confirmação em `main` pelo lugar de direção e a recolha da linha final de custo. Nenhum bloqueio de número, fonte ou pessoa foi contornado.
'''
(pasta/'LEIA-ME.md').write_text(texto)
print('Relatório escrito a partir de medidas.json.')
