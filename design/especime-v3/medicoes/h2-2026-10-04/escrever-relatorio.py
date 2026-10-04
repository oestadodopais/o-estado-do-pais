#!/usr/bin/env python3
"""Redige o relatório a partir das medidas, sem copiar números à mão."""
import json
from pathlib import Path
pasta=Path(__file__).resolve().parent
m=json.loads((pasta/'medidas.json').read_text())
v={e['nome']:e['valor'] for e in m['medidas']}
c=m['custo'];u=c['total_cumulativo_parcial']
def numero(x):return f'{x:,}'.replace(',', ' ').replace('.', ',')
portoes='\n'.join(f"| `{g}` | {p['codigo']} | {p['segundos']:g} | `{p['inicio']}` | `{p['fim']}` |" for g,p in m['portoes'].items())
commits='\n'.join(f"- `{s.split(' ',1)[0]}`: {s.split(' ',1)[1]}" for s in m['commits'])
ficheiros='\n'.join(f"| `{p['ficheiro']}` | {p['motivo']} |" for p in m['paginas_so_ficheiro'])
texto=f'''# H2 · a passagem de higiene de 04.10.2026

A implementação e as provas locais estão verdes na cabeça de código `{m['cabeca_codigo']}`. O ensaio autorizado no GitHub também está verde. A aceitação que exige uma corrida posterior de `main` depende da aterragem pelo diretor; este construtor não publicou `main` nem `h2-2026-10-04`. O total final da linha «tokens used» ainda não existe durante a sessão que escreve este relatório e fica marcado como `[verify]`, separado do contador parcial medido.

## A reprodução antes de mexer

Foram lidos o `CLAUDE.md`, o mapa inteiro e o brief. Antes da primeira alteração, o guião do brief produziu `brief-reproduzido.json`: as {v['medicoes_do_brief_reproduzidas']} medidas, os comandos e os conhecidos-positivos são integralmente iguais a `design/observatorio/medidas/BRIEF-H2.json`. Portanto, o §0 bate. Essa referência lê a cabeça presa `905105b7`; a base efetiva desta worktree era `{m['base']}`. Não se confundem as duas cabeças.

```sh
OEDP_MEDIDAS_JSON=design/especime-v3/medicoes/h2-2026-10-04/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-H2.py
```

## O mandato, ponto a ponto

| Ponto | Resultado e medida | Prova |
|---|---|---|
| 1 · estudo em curso | Évora declara `emCurso`, a razão e o horizonte de acompanhamento. A primeira página conserva {v['estudos_recentes_pt']} estudos em cada edição, com {v['marcas_em_curso_pt']} marca na portuguesa e {v['marcas_em_curso_en']} na inglesa, no estudo à cabeça. A data final declarada não é um temporizador: encerrar o acompanhamento é uma decisão na ficha. | `medidas.json`, `capturas.json`, E1 de `check:pais`, plantas e `tests/inicio/estudos-em-curso.mjs`. |
| 2 · I190 | {v['ligacoes_dentro_de_outras']} ligações dentro de outras nos {v['paginas_html']} HTML construídos, incluindo a lista inglesa. O título é a própria porta. A recusa de `a a` corre antes da saída antecipada dos documentos. | Varrimento integral em `medir-h2.mjs`; planta da ligação encaixada. |
| 3 · I191 | {v['portas_antigas_nas_areas']} portas para `/texto` ou `/text` nas {v['paginas_de_area']} páginas de áreas. O título liga à página do estudo; a porta auxiliar redundante foi retirada. | A2 de `check:areas`, `check:mortos` e planta da rota antiga. |
| 4 · I192 | Caminhos sem extensão só resolvem pela pasta com `index.html`; ficheiros com extensão resolvem pelo nome exato. Há {v['paginas_so_com_ficheiro_html']} página só em ficheiro, enumerada abaixo. | Planta de `/404` quando só existe `404.html`; a âncora interna do próprio ficheiro resolve a partir de `/404.html`. |
| 5 · I193 | A isenção conta apenas as palavras dentro do endereço completo da API do INE. Prosa antes ou depois do endereço continua sujeita à régua. | Controlos em memória de `check:lugar` e planta com prosa no mesmo bloco. |
| 6 · I194 | {v['corridas_locais_i194']} repetições locais, cada uma com {v['plantas_por_corrida_i194']} controlos e plantas. A troca mede bytes e hora iguais, outro inode e a mordida da D. A função `celulaDoDist` tem {v['celula_d_alterada']} alterações, por comparação literal com a base. A corrida remota `{m['github']['databaseId']}` passou. | `i194-repeticoes.json`, `github-i194.json`, `github-ensaio.json` e os logs. A corrida de `main` ainda fica por fazer na aterragem. |
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

Os registos efetivos estão em `plantas-portoes-h2.json` e `plantas-portoes-h2-voz-estado-trocado.json`, incluindo comando, mordida esperada e resumos antes e depois da reposição; a saída efetiva de cada recusa está no log da respetiva planta. A primeira passagem correu o prefixo H2; a planta adicional da voz correu pelo nome depois de introduzida. Hoje reproduzem-se juntas com:

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

O único ramo publicado foi `h2-ensaio-i194-2026-10-04`, na cabeça do código. A [corrida `{m['github']['databaseId']}`]({m['github']['url']}) passou no `ubuntu-24.04`; `github-i194.json` conserva a medida da troca e a mordida. O ramo remoto foi apagado depois da conclusão; a consulta posterior encontra {v['ramos_de_ensaio_remotos_restantes']} referências (`github-ramo-apagado.json`). A exigência de duas corridas remotas, ramo e `main`, não é declarada cumprida: a segunda depende da publicação de `main`, excluída do mandato deste construtor.

## Os portões na cabeça do código

```sh
sh scripts/leituras/portoes.sh <esta-worktree> design/especime-v3/medicoes/h2-2026-10-04/portoes
```

Corrida pela tranca da máquina. Os códigos abaixo foram lidos de `portoes/build.codigo`, `portoes/verify.codigo` e `portoes/typecheck.codigo`, sem cadeia com `|`. `portoes/cabeca` e `portoes/cabeca.fim` contêm ambos `{m['cabeca_codigo']}`. Os resumos dos logs, já sem caminhos locais, estão em `medidas.json`.

| Portão | Código lido | Segundos | Início UTC | Fim UTC |
|---|---:|---:|---|---|
{portoes}

Os tempos dos portões usam carimbos com resolução de 1 segundo; o valor nulo de `typecheck` significa que terminou no mesmo segundo em que começou.

Entre commits correram as conferências tocadas pela mudança, registadas nos ficheiros `*-trabalho.*` e nas plantas desta pasta. No fecho correram os portões inteiros. Não houve paragem por um portão de número, fonte ou pessoa. A comparação com a base encontra {v['ficheiros_de_conteudo_alterados']} ficheiros alterados em `ledger/`, `registos/` ou `studies-src/`.

## Capturas e leitura visual

`captar-h2.mjs` serviu a construção desta cabeça apenas localmente, esperou pelas fontes e guardou a primeira página nas larguras {', '.join(str(x) for x in m['capturas']['larguras'])} px, nas edições portuguesa e inglesa, em `design/especime-v3/capturas/h2-2026-10-04/`. Há uma página inteira e um recorte dos estudos por combinação. `capturas.json` guarda as dimensões, a lista apresentada, as marcas e os resumos dos PNG; não encontrou transbordo horizontal nem erros de página.

A inspeção visual efetiva está registada em `leitura-visual.json`, com os ficheiros vistos e os critérios. A marca aparece junto da data, a ordem conserva o estudo em curso à cabeça e o texto permanece legível nas larguras pedidas.

## Commits e fecho

{commits}

Todos levam os trailers `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g`. O commit de entrega seguinte contém apenas esta pasta de medições e a pasta de capturas; o seu resumo está na resposta ao diretor, fora do próprio commit para não criar uma referência circular. Nenhum código mudou depois da cabeça verde acima.

Cada medida em `medidas.json` leva comando e conhecido-positivo. O coletor recusa uma premissa falsa; não se limita a imprimir contagens. `conferir-relatorio.py` foi corrido sobre este relatório e esta pasta, com o resultado em `conferencia-relatorio.json`, e o log e o código em `relatorio-trabalho.log` e `relatorio-trabalho.codigo`.

## Modelo, custo e o que falta

Modelo lido no registo de lançamento: `{m['modelo']}`. O instante inicial, o instante do último contador e o instante da leitura de fecho estão em `custo.json`. Até essa leitura decorreram {numero(c['segundos_ate_fecho'])} segundos. O contador cumulativo parcial da própria sessão era {numero(u['total_tokens'])} símbolos: {numero(u['input_tokens'])} de entrada (incluindo {numero(u['cached_input_tokens'])} em cache) e {numero(u['output_tokens'])} de saída. Esse contador é parcial e inclui entradas em cache; não é apresentado como a linha final «tokens used».

**Linha final «tokens used»: `[verify]`.** O lançador só a escreve depois de este processo terminar. `custo-h2.py` lê essa linha quando existir e guarda `tokens_used`; durante esta execução, o valor é `null`. Não é possível citar honestamente um registo final que ainda não foi produzido. O tempo medido também é até à leitura registada, não uma duração futura inventada.

Ficam por fazer a leitura a frio pelo leitor indicado, com as cópias plantadas do seu pacote, a aterragem e a corrida de `main` sob responsabilidade do diretor, e a recolha da linha final do custo após o encerramento. O ramo de trabalho não foi publicado. As chaves inglesas continuam com a revisão humana marcada por ler; não se atribui a este construtor essa revisão.
'''
(pasta/'LEIA-ME.md').write_text(texto)
print('Relatório escrito a partir de medidas.json.')
