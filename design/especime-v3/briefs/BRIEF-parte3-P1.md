# BRIEF · Parte 3, P1 · a travessia dos registos de conteúdo

*Escrito a 24.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). Sítio: ramo `parte3-2026-08-24`, saído de `main` `8d724f2`, construção de base verde (334 páginas, 33 chaves da prova, 13 s). Motor: `master` `cbaf7ca`, sem remoto, portão de base PASS (74 s). O plano é a `design/especime-v3/ESTIMATIVA-PARTE3-2026-08-24.md`; as onze decisões do diretor estão em `ESTADO-DO-MAIN-2026-08-24.md` e nenhuma se reabre. Sem travessões na prosa deste ficheiro; os nomes de ficheiro dentro de crases levam os caracteres que têm.*

## 0 · Numa frase

Os registos de conteúdo do motor das oito edições alojadas atravessam para `registos/` na raiz do sítio, byte a byte, com um manifesto de travessia escrito pelo exportador do motor (resumos de origem E resumos deste lado) e conferido a cada construção por seis conferências novas do `check:documentos`, cada uma provada num estrago plantado. É a §1 do plano, aplicada; o padrão é o das duas travessias que já existem (`ledger/cruzamentos/`, `studies-src/manifest.yml`).

## 1 · Ler primeiro, por esta ordem

1. `ESTIMATIVA-PARTE3-2026-08-24.md` §0, §1 inteira, §3.2 (a forma da casa para os estragos plantados) e §5.
2. `ESTADO-DO-MAIN-2026-08-24.md` (as onze decisões; a 7 e a 8 tocam esta etapa).
3. Motor, em leitura: `publisher/REGISTOS.md`; `publisher/export_records.py` (`EDITIONS`, `record_name`, `manifests()`, `check_r5`, `serialise`); `publisher/export_agenda.py` e `publisher/export_site_rows.py`, que são os dois exportadores que já escrevem dentro do repositório do sítio (o caminho `SITE`, a forma do registo de travessia, a leitura de `studies.mjs` do sítio, a disciplina «n nova(s) · n alterada(s) · n inalterada(s)»); `publisher/export_agenda_test.py` (a forma de um módulo de conhecidos-positivos); `core/gate.py` (`TEST_MODULES` e os comentários de registo).
4. Sítio: `scripts/check-documentos.mjs`; `scripts/check-cruzamento.mjs` (a conferência de aceitação, o modo `--with-origin`); `src/lib/documentos.mjs` (o padrão de encontrar a raiz a subir); `studies-src/manifest.yml`; `src/data/studies.mjs`; `DECISIONS.md` §1.49 (o bloco de republicação: a travessia, os estragos, a leitura cruzada) e §1.63 (a forma de uma entrada nova, com `**Afecta:**`).
5. `git log -5 --format=%B` nos dois repositórios: a forma das mensagens de commit (título de uma frase, corpo em prosa, os dois trailers `Co-Authored-By` e `Claude-Session` no sítio; no motor o `Co-Authored-By`).

## 2 · O que já está medido (24.08, pelo lugar de direção; conferir se quiser, não re-derivar)

**As oito edições em âmbito, e a tabela edição do motor ↔ edição do sítio** (a tabela é a coisa que o exportador declara; não existe em lado nenhum hoje):

| estudo do motor | `lang` do motor | slug do sítio | `lang` do sítio | origem dos bytes alojados |
|---|---|---|---|---|
| `03 Regional Economy` | `pt-PT` | `avaliacao-economica-regional-de-portugal-2026` | `pt` | artefacto (claude.ai, 12.08) |
| `04 Évora Public Money` | `pt-PT` | `evora-prometido-pago-auditado-2026` | `pt` | `researchhub` |
| `04 Évora Public Money` | `en` | `evora-prometido-pago-auditado-2026` | `en` | `researchhub` |
| `06 Évora Economy` | `pt-PT` | `evora-economia-investidores-portas-abertas-2026` | `pt` | `researchhub` (republicado 24.08) |
| `07 Évora Municipal Accounts` | `pt-PT` | `evora-orcamentado-pago-devido-2025` | `pt` | `researchhub` |
| `07 Évora Municipal Accounts` | `en` | `evora-orcamentado-pago-devido-2025` | `en` | `researchhub` |
| `08 Évora Mandates` | `pt-PT` | `evora-quinze-anos-cinco-mandatos` | `pt` | `researchhub` |
| `09 Évora Pelouros` | `pt-PT` | `evora-os-pelouros-quem-os-teve-o-que-fizeram` | `pt` | `researchhub` (republicado 24.08) |

As quatro edições do motor sem edição alojada (03 en, 06 en, 08 en, 09 en) **não atravessam**, e a corrida di-lo em voz alta. A 16.ª edição do sítio (pensões) está fora do âmbito (decisão 8).

**D5, medido edição a edição:** o `edicao_html_sha256` do `records.manifest.json` do motor é igual ao `sha256_normalized` do `studies-src/manifest.yml` nas **seis** edições com `origin: researchhub`. No 03 pt difere por natureza: o motor prova a edição contra `Technical Source/artifact_pt.html` (um fragmento sem `head` nem `body`), e o sítio aloja o artefacto de 12.08. **O D5 não corre para o 03 pt** (decisão 7), e fica dito na saída do portão a cada construção, nunca em silêncio.

**Os ficheiros do motor:** os doze registos, os doze `.cortes.json` e os seis manifestos estão limpos no git em `cbaf7ca` (o último toque foi `e365672`), todos `estado: fixado`, e os resumos em disco batem 12/12 (registo e cortes). O motor tem ficheiros alheios por commitar (`content/11 Seguranca Social/*`, `indicators/*.json`, um `.maintenance-locks/*`): **não são nossos, não se tocam, não se commitam.**

**Contagens do âmbito:** 829 blocos, 2 601 figuras, 39 ligações (03 pt 7, 04 pt 16, 04 en 16, as outras cinco a zero; as 46 do P0 do motor contam também as 7 do 03 en, que não atravessa), iguais às do plano depois do P0. *(Corrigido pelo lugar de direção depois da M2: dizia 46.)*

## 3 · Lado do motor: o exportador (a única peça do motor que esta sessão constrói)

### 3.1 `publisher/export_records_site.py`

* **Uso:** `python3 publisher/export_records_site.py` (ensaio: prova tudo, não escreve nada) e `--write` (prova tudo e escreve no sítio). Sem outros argumentos; um argumento desconhecido devolve 2, como o `export_records.py`.
* `SITE = Path.home() / "Instruments" / "OEstadoDoPais"` e o destino `SITE / "registos"`, pelo padrão dos dois exportadores irmãos.
* **A tabela `SITE_EDITIONS`** (a de cima), declarada no ficheiro com a chave `(estudo, lang do motor)` e o valor `(slug, lang do sítio)`. Uma edição do motor que não esteja na tabela não atravessa e é impressa como tal («`03 en`: sem edição alojada no sítio»).
* **O que lê, e prova antes de escrever, edição a edição:** o `records.manifest.json` do estudo (exige `estado: "fixado"`); o resumo em disco do registo e do `.cortes.json` contra o manifesto (uma diferença é `Fail`, mesmo que o R5 do motor já a apanhe: um exportador que confia no vizinho é o produtor a assinar por si próprio); que os três ficheiros estão **limpos no git** (`git status --porcelain -- <os três caminhos>` vazio), e toma `origin_ref = "<caminho relativo à raiz do motor> @ <git rev-parse HEAD>"`; que o `slug/lang` existe em `src/data/studies.mjs` do sítio (o padrão da A11 do `export_agenda.py`: lê o ficheiro, não inventa); e lê `studies-src/manifest.yml` do sítio para dizer, por edição, se o D5 vai poder correr: com `origin: researchhub` compara `edicao_html_sha256` com `sha256_normalized` e **imprime** o resultado (não recusa: o ciclo da §1.4 do plano escreve primeiro e republica os bytes depois, e é o D5 do sítio que fecha a construção enquanto não baterem); com `artifact_url` imprime que o D5 não corre e nomeia o ficheiro que o motor prova.
* **O que escreve com `--write`:** `registos/<slug>/<lang>.record.json` e `registos/<slug>/<lang>.cortes.json`, **byte a byte iguais** aos do motor (não reserializar); e `registos/manifest.json`, com a forma da §1.2 do plano:

```
{
 "_": [ "Registo de travessia: os registos de conteúdo do motor. FICHEIRO GERADO.",
        "Escrito por ResearchHub/publisher/export_records_site.py.",
        "Conferido a cada construção por scripts/check-documentos.mjs (D1 a D6)." ],
 "exporter": "ResearchHub/publisher/export_records_site.py",
 "origin": "ResearchHub",
 "registos": {
  "evora-prometido-pago-auditado-2026/pt": {
   "rh_study": "04 Évora Public Money",
   "rh_edition": "Évora — Prometido, Pago, Auditado 2026 (pt-PT)",
   "rh_lang": "pt-PT",
   "origin_ref": "content/04 Évora Public Money/Évora — Prometido, Pago, Auditado 2026 (pt-PT).record.json @ <commit>",
   "origin_record_sha256": "…", "exported_record_sha256": "…",
   "origin_cortes_sha256": "…", "exported_cortes_sha256": "…",
   "rh_manifest_sha256": "<sha256 dos bytes do records.manifest.json do estudo>",
   "edicao_html": "Évora — Prometido, Pago, Auditado 2026 (pt-PT).html",
   "edicao_html_sha256": "…",
   "estado": "fixado", "fixado_em": "2026-08-24",
   "blocos": 102, "referencias": 326, "prova": "render-sem-graficos",
   "exported_at": "2026-08-24"
  }
 }
}
```

  Os dois `origin_*` vêm do manifesto do motor; os dois `exported_*` são o resumo dos bytes escritos deste lado. Serem iguais entre si é o esperado, e serem dois é o ponto (o de origem prova que o ficheiro é o do motor; o exportado prova que ninguém lhe tocou depois de chegar).
* **Serialização canónica**, a mesma do `export_records.py`: `json.dumps(obj, ensure_ascii=False, sort_keys=True, indent=1) + "\n"`.
* **Idempotência com data**, pelo padrão do exportador de linhas: uma entrada cujos campos de origem não mudaram mantém o `exported_at` que já estava no manifesto do sítio; a corrida imprime «n nova(s) · n alterada(s) · n inalterada(s)»; correr `--write` duas vezes sem nada ter mudado escreve os mesmos bytes (é uma das conferências do teste).
* **Recusas** (`Fail`, código 1, a mensagem nomeia o ficheiro e diz o que fazer): manifesto do motor sem `estado: fixado`; resumo em disco diferente do manifesto (registo ou cortes); ficheiro sujo no git; `slug/lang` que o `studies.mjs` do sítio não declara; um ficheiro em `registos/` do sítio que esta corrida não escreveria (órfão de um estudo retirado ou de uma tabela mudada): recusa e nomeia, porque apagar é decisão de quem retira e não do exportador; e um `manifest.json` do sítio ilegível. Nada é removido pelo exportador.

### 3.2 `publisher/export_records_site_test.py`

Conhecidos-positivos, cada um num estrago plantado numa cópia (pastas temporárias, e o `SITE` apontado para uma cópia mínima; nunca `content/`, nunca o sítio real), no estilo do `export_agenda_test.py`:

1. manifesto do motor com `estado: rascunho` → recusa;
2. um byte mudado num registo em disco → recusa;
3. `.cortes.json` em falta → recusa;
4. tabela a apontar para um `slug` que o `studies.mjs` da cópia não tem → recusa;
5. idempotência: duas escritas seguidas dão bytes iguais e o `exported_at` não mexe;
6. uma origem que mudou (o resumo do registo é outro) refaz só essa entrada, com data nova; as outras ficam iguais, byte a byte;
7. um ficheiro órfão no destino → recusa e nomeia-o;
8. a corrida limpa no fim, sobre a cópia, passa.

Registar em `core/gate.py` `TEST_MODULES`, com o comentário na forma dos vizinhos (não é um portão novo; é o conhecido-positivo de um módulo novo, pelo mesmo argumento do `export_agenda_test`). `python3 -m core.gate` tem de dar PASS.

### 3.3 `publisher/REGISTOS.md`

Uma secção nova, «A travessia para o sítio»: os dois comandos, a tabela, o que o manifesto do sítio guarda, as seis conferências que o sítio faz à chegada (uma linha cada), e o ciclo de re-travessia da §1.4 do plano por extenso (os cinco passos, nenhum à mão; um registo velho pára a construção do sítio). Sem travessões na prosa.

### 3.4 O commit do motor

Um commit, com os caminhos explícitos (`publisher/export_records_site.py`, `publisher/export_records_site_test.py`, `core/gate.py`, `publisher/REGISTOS.md`), **nunca `git add -A`**, nunca os ficheiros alheios de `content/11`, `indicators/` ou `.maintenance-locks/`. Não correr `export_records.py --write` (os registos estão fixados e não mudam nesta etapa). O `NEXT.md` do motor não se toca na P1: o lugar de direção escreve-o no fecho da sessão.

## 4 · Lado do sítio

### 4.1 `registos/` na raiz

Escrito pelo exportador com `--write`; entra no git (conferir que nenhuma regra do `.gitignore` o apanha). Mais um `registos/README.md` curto, no espírito do cabeçalho de `studies-src/manifest.yml`: o que é, FICHEIRO GERADO e nunca à mão, os dois comandos do motor, as seis conferências (uma linha cada), a exceção do 03 pt, o ciclo de re-travessia. Sem algarismos que fiquem velhos (não escrever «oito» nem contagens).

### 4.2 `scripts/check-documentos.mjs`: as seis conferências D1 a D6

Mesma severidade (fecham a construção) e mesma forma das três de hoje (uma lista de erros, cada um com o que falhou e o que fazer). O portão lê `registos/manifest.json` **com o seu próprio leitor** (não importa `src/lib/registos.mjs`), e corre **sem o motor e sem rede**, porque corre no construtor remoto da Vercel.

| | O que é provado | O estrago que o fecha |
|---|---|---|
| D1 | cada entrada do manifesto tem ficheiro em `registos/<slug>/<lang>.record.json`, e o sha256 dos bytes é `exported_record_sha256` (e é também `origin_record_sha256`: o ficheiro atravessa byte a byte, e dois resumos diferentes entre si são um manifesto a mentir) | um carácter editado num registo |
| D2 | nenhum ficheiro em `registos/` (fora `manifest.json` e `README.md`) sem entrada no manifesto | deixar cair um registo de um estudo retirado, ou uma pasta com um slug enganado |
| D3 | o `<lang>.cortes.json` existe e bate com `exported_cortes_sha256` | apagar ou editar o ficheiro de operações |
| D4 | o `slug` é um trabalho de `src/data/studies.mjs` e a `lang` é uma edição declarada desse trabalho | um registo de uma edição que o arquivo não tem |
| D5 | quando a linha de `studies-src/manifest.yml` para o mesmo `slug/lang` tem `origin: researchhub`: `edicao_html_sha256 === sha256_normalized`. Quando tem `artifact_url`: **não corre**, e o portão imprime a cada construção, em voz alta e com o ficheiro nomeado: «"avaliacao-economica-regional-de-portugal-2026/pt": o D5 não corre: os bytes alojados são um artefacto do claude.ai e a edição que o motor prova é «Technical Source/artifact_pt.html», que o sítio não aloja (DECISIONS §1.64)». Uma edição sem linha nenhuma no `manifest.yml` é erro (um registo de um documento que o sítio não aloja) | o motor republica o `.html` e o registo fica velho, ou o contrário |
| D6 | `blocos` e `referencias` do manifesto batem com o ficheiro: `blocks.length`, e a soma de `figures[]` em todas as unidades (título, parágrafo, cada item de lista, cada célula de tabela) | um manifesto que promete 326 sobre um registo com 325 |

O relatório do portão, no fim: «registos de conteúdo · n atravessados · D5 correu em k e não corre em m», com as exceções nomeadas, na linha cinzenta que já existe para os documentos. A frase verde final passa a cobrir as duas coisas.

**`--with-origin`** (só quando o motor está em disco, fora do `npm run build`, pelo padrão do `check-cruzamento.mjs`): `origin_record_sha256` e `origin_cortes_sha256` contra o `records.manifest.json` do motor, e `rh_manifest_sha256` contra os bytes desse manifesto. Se o motor não está, diz que não correu e não falha.

### 4.3 `src/lib/registos.mjs`

O leitor do sítio, para a P2 usar: `manifestoDosRegistos()`, `todosOsRegistos()` (lista de `{ slug, lang, ficheiro, cortes, entrada }`, ordenada), `registoDaEdicao(slug, lang)` (o JSON lido, ou `null`), `temRegisto(slug, lang)`, `registosDoEstudo(slug)`. A raiz encontra-se a subir, pelo padrão de `encontraOrigem()` em `documentos.mjs` (na construção o módulo é empacotado para dentro de `dist/`). Um `slug/lang` pedido que não está no manifesto devolve `null`, e um ficheiro nomeado pelo manifesto que não existe atira. Sem consumidores nesta etapa; uma prova de fumo em `node -e` chega, e o `typecheck` tem de continuar verde.

### 4.4 Os seis estragos plantados, na forma da casa

Um por conferência: a cópia alterada, o resumo do ficheiro registado **antes**, a conferência a fechar com o seu próprio nome e código 1, o ficheiro reposto do git, `git status --porcelain` limpo, o resumo de volta ao que era. Registar a tabela (planta · o que se mudou · a frase do portão · exit) em `design/especime-v3/notas/parte3.md`, secção «P1», que é o ficheiro de notas deste bloco (as etapas seguintes acrescentam as suas secções).

### 4.5 O registo

* `DECISIONS.md`: uma entrada nova, `### 1.64 A parte 3: as páginas de leitura constroem-se dos registos de conteúdo do motor`, com `**Afecta:** nenhum`, um parágrafo de cabeça (o que a parte 3 é, o plano e as onze decisões de 24.08, por referência) e a subsecção `#### P1 · a travessia` (o que atravessou e de onde, a forma do manifesto, as seis conferências, os estragos com a frase de cada um, a exceção do 03 pt com a razão medida, o ciclo de re-travessia, o que fica por fazer). As subsecções P2 a P4 e as leituras cruzadas entram nas etapas seguintes na mesma entrada. Grafia: a do ficheiro onde entra.
* `README.md` do sítio: onde descreve a árvore e o `check:documentos`, acrescentar `registos/` e as seis conferências em poucas linhas, sem contagens que envelheçam.
* `design/especime-v3/ISSUES.md`: um defeito fora do âmbito encontrado pelo caminho regista-se lá, não se corrige aqui.

## 5 · Aceitação

1. Motor: `python3 -m core.gate` PASS com o módulo novo na lista; `python3 publisher/export_records_site.py --write` duas vezes seguidas escreve os mesmos bytes; a saída do ensaio mostra as oito edições, as quatro que não atravessam, e o D5 por edição.
2. Sítio: `npm run build` verde com `registos/` no lugar; `node scripts/check-documentos.mjs` imprime os oito registos e a exceção do 03 pt; `npm run typecheck` verde.
3. As seis plantas, cada uma fechada com exit 1 e a mensagem da sua conferência, e reposta.
4. Commits: um no motor; no sítio os que fizerem sentido (os dados da travessia, o portão, o leitor, o registo), cada um com a construção verde. Ramo `parte3-2026-08-24`; não mudar de ramo, não fundir, não empurrar.
5. O relatório final, nesta ordem: **«judgement calls for the seat» primeiro** (cada decisão que tomaste sem regra escrita, com a alternativa que não escolheste); o que foi construído, com os caminhos; as plantas, com as frases; as contagens medidas; os commits (hash e título); o custo em símbolos desta corrida, como o vires; o que ficou por fazer, dito por extenso. Rotular cada afirmação como verificado ou inferido.

## 6 · Regras desta etapa

* As onze decisões não se reabrem. Se algo do que encontrares as contradiz, **pára e diz**, em vez de contornar.
* Nenhum texto governado se toca (`src/data/sobre.mjs`, `src/data/metodo.mjs`); a `IDENTIDADE.md` não se toca na P1.
* Prosa nova em português: Acordo de 1990, **sem travessões** (nem «—» nem «–»), com o ponto médio «·» como separador; o que é nome de ficheiro copia-se com os caracteres que tem. O portão de HTML não vê estes ficheiros, mas a casa lê-os.
* Nunca `git add -A`; nunca `dist/` ou `node_modules/`; nunca um ficheiro que não seja desta etapa. Mensagens de commit na forma da casa (lidas do `git log`), com os trailers do repositório.
* Regra 14 da casa: uma conferência só conta depois de fechar sobre um estrago plantado; uma saída vazia não prova ausência.
* Regra 15: nunca relatar um ficheiro pelo nome; abrir e ler.
* Se o lugar de direção tiver de decidir alguma coisa (uma forma que o plano não fixa e muda o resultado), escolhe a que segue o padrão mais próximo da casa, constrói, e põe a escolha à cabeça do relatório. Não pares por isso.
