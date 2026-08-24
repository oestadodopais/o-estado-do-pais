# BRIEF · Parte 3, P3 · o `check:cadeia` e as oito chaves na prova

*Escrito a 24.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). Sítio: ramo `parte3-2026-08-24`, depois da P1 (a travessia) e da P2 (o renderizador, a rota `texto`, a nona origem, L1 a L7). O plano é a `ESTIMATIVA-PARTE3-2026-08-24.md` §4; o contrato do motor chama-lhe B4a («`check:cadeia`, um guião da construção do sítio»). Sem travessões na prosa deste ficheiro.*

## 0 · Numa frase

Um guião que, por edição com registo, percorre a cadeia de cada algarismo da página de leitura até onde ela chega, diz qual das duas formas ela tem (completa: até à linha do sítio e ao selo; do motor: até à entrada em «As linhas deste documento»), recusa a construção quando um algarismo não tem nenhuma das duas, e entrega as oito contagens à prova, cada uma recontada pelo portão por conta própria.

## 1 · Ler primeiro

1. O plano §4 inteiro (as duas formas da cadeia, as oito chaves, a nota da granularidade, os cinco estragos) e §0.3.
2. `DECISIONS.md` §1.64 (as subsecções P1 e P2, escritas pelos construtores anteriores) e §2.2 item 7 (a sétima origem: como uma chave da prova é recontada, e as três vistas `dist`, `ledger`, `modulo`).
3. `src/lib/prova.mjs` inteiro; `scripts/gate-html.mjs`: `contasDoPortao()`, `conta()`, `PROVA_VISTA`, a releitura de `dist/prova.json` no fim (`comparavel`, `diferencas`) e a recusa «a chave existe na prova e o portão não a sabe contar»; o ramo `verificaTexto` da P2 (é dali que vêm as marcas que este guião lê).
4. `scripts/check-dados.mjs` e `scripts/check-cruzamento.mjs` (a forma de um guião da casa que corre depois da construção e imprime o que conferiu).
5. `src/data/metodo.mjs`, só para saberes o que **não** se toca (abaixo).

## 2 · O que já está decidido, e uma decisão do lugar de direção

* As oito chaves, com os valores medidos no plano para o âmbito de oito edições: `registos_edicoes` 8 · `registos_blocos` 829 · `registos_algarismos` 2 601 · `registos_resolvidos` 2 601 · `registos_por_resolver` 0 · `registos_com_linha_do_sitio` 196 · `registos_com_resumo_de_origem` 510 · `registos_sem_resumo_de_origem` 2 091. Se a tua conta der outro número, a diferença explica-se e regista-se; não se ajusta a régua ao número.
* **A faixa por edição já existe desde a P2** (`data-registo-conta`, três contas por página, recontadas contra o registo em disco): é a segunda opção da nota de granularidade do plano, escolhida pelo lugar de direção. As oito chaves são **totais do sítio**.
* **As chaves não entram nas listas `prova` do Método nesta sessão.** `src/data/metodo.mjs` é texto governado (a página rende-o carácter a carácter, e a amarra das decisões prende o seu resumo), e acrescentar rótulos novos à prova de uma regra é uma edição de texto governado que só o diretor decide. As chaves existem em `prova.mjs`, saem em `dist/prova.json` com a sua vista, são recontadas pelo portão, e a sua porta é o arquivo (`/estudos`), de onde cada leitura se abre. Nenhuma página as rende nesta sessão; a nota da etapa e o relatório dizem-no, e o lugar de direção põe a decisão ao diretor no fecho.

## 3 · `scripts/check-cadeia.mjs`

* **Uso:** `node scripts/check-cadeia.mjs`; entra em `package.json` como `check:cadeia`, e corre em `build` e em `verify` **depois** de `gate:html` (lê `dist/`). Corre sem rede e sem o motor.
* **O que lê, com o seu próprio leitor:** `registos/manifest.json` e cada `.record.json`; `ledger/cruzamentos/evora.json` (o mapa `(rh_study, rh_id) → site_id`); `ledger/claims/<site_id>.yml` (para saber que a linha do sítio existe e qual o seu `value`); as páginas construídas de `dist/estudos/<slug>/texto/index.html` e `dist/en/studies/<slug>/text/index.html`.
* **O que percorre, figura a figura**, e o que exige em cada passo:
  1. **o resumo de origem:** `source_sha256` com 64 hexadecimais minúsculos e `source_digest_em` presente, **ou** `source_sha256: null` com `source_digest_kind` de um dos cinco da lista fechada (`portal-estatico`, `pdf-sem-resumo`, `raw-sem-manifesto`, `derivado`, `api-viva`), e nunca os dois. É o R7 do motor lido deste lado;
  2. **a linha do motor:** `figures[].row` não vazia;
  3. **a linha do sítio, se houver:** `(rh_study do manifesto, row)` no registo de travessia; quando há, `ledger/claims/<site_id>.yml` existe;
  4. **a posição no registo:** o bloco, a unidade e o índice da figura, e `text[start:end] === printed`;
  5. **a marca na página rendida:** um elemento `data-registo` com essa coordenada, cujo texto é `printed`;
  6. **a saída:** com linha do sítio, um selo colado cujo `href` é a página dessa linha; sem linha do sítio, a porta `#linha-<row>` e a entrada existente em «As linhas deste documento» (ou, dentro de uma ligação do documento, só a entrada).
  Um algarismo com os seis passos até ao selo é **cadeia completa**; até à entrada é **cadeia do motor**; sem nenhuma das duas é **erro, e fecha a construção**.
* **O que imprime:** por edição, uma linha de guião («`04 pt` · 102 blocos · 326 algarismos · 12 completas · 314 do motor · 0 por resolver · 63 com resumo de origem · 263 com motivo»), e no fim os totais das oito chaves. Escreve `dist/cadeia.json` com os totais e os totais por edição (e mais nada: não é uma segunda cópia dos registos), para a medição cega e a leitura cruzada terem um ficheiro a comparar.
* **O que recusa** (código 1, mensagem que nomeia a edição e a coordenada): os cinco estragos da §5.

## 4 · As oito chaves na prova e no portão

* `src/lib/prova.mjs`: as oito chaves, cada uma com a sua frase bilingue em `FRASES` (na forma das vizinhas: uma frase curta que diz como o número é obtido), a porta `routePath('estudos', lang)`, e `detalhe` onde ajudar (por exemplo, os motivos em `registos_sem_resumo_de_origem`). A prova lê `registos/` com o leitor de `src/lib/registos.mjs`, e o registo de travessia das linhas como `linhasCruzadas()` já lê.
* `scripts/gate-html.mjs`, `contasDoPortao()`: as oito recontagens **por conta própria**, cada uma com a sua vista declarada em `conta()`: as que se contam sobre o `dist/` (as páginas de leitura que existem, as marcas `data-registo-bloco` e `data-registo`, os selos e as portas) são `dist`; as que só se podem contar sobre os ficheiros de `registos/` (os resumos de origem) são uma segunda leitura desses ficheiros, com a vista `registos`, declarada na tabela de vistas com uma linha a dizer o que ela é (a mesma disciplina de `ledger`). Se `PROVA_VISTA` ou a releitura de `dist/prova.json` só aceitarem as três vistas de hoje, acrescenta a quarta onde elas se declaram, e nunca a mascares como `ledger`.
* O portão continua a recusar uma chave que ele não saiba contar; a releitura de `dist/prova.json` no fim tem de passar com as oito.

## 5 · Os cinco estragos plantados (§4.3 do plano), cada um na forma da casa

| | O estrago | O que o fecha, e com que frase |
|---|---|---|
| 1 | um algarismo sem linha: uma marca `data-registo` na página construída cuja coordenada não é figura nenhuma do registo (ou uma figura numa cópia do registo com `row` vazia, com o manifesto da cópia a bater) | `registos_por_resolver` ≠ 0 no `check:cadeia`, e o L4 do `gate:html` |
| 2 | uma linha sem resumo de origem: numa cópia do registo (com o manifesto da cópia a bater), uma figura com `source_sha256: null` e sem `source_digest_kind`, e outra com um motivo fora dos cinco | o passo 1 do `check:cadeia` |
| 3 | uma contagem escrita à mão: a faixa da página com «326 algarismos» trocado por «327» | a recontagem do portão (P2, L5) e a comparação de `dist/prova.json` |
| 4 | um valor do sítio impresso no lugar do valor do documento: `167 372 756` trocado por `167 372 755,84` dentro da marca | L4 (o `printed`), e o `check:cadeia` no passo 5 |
| 5 | um selo ao lado de uma figura sem linha do sítio | L6, e o `check:cadeia` no passo 6 |

Para os que exigem uma cópia do registo: constrói-se a cópia numa pasta temporária apontada por uma variável de ambiente que o guião e o portão leem (a mesma convenção de `OEDP_STUDIES_DIR` em `documentos.mjs`, se existir uma para `registos/`; se não existir, cria-se `OEDP_REGISTOS_DIR` em `src/lib/registos.mjs`, no portão e no guião, e fica dita na nota). `registos/` não muda um byte.

Cada estrago: o resumo registado antes, a corrida a fechar com a frase, o ficheiro reposto, `git status --porcelain` limpo. Tabela em `notas/parte3.md`, secção «P3».

## 6 · O registo

* `DECISIONS.md` §1.64, subsecção `#### P3 · o check:cadeia e as oito chaves`: as duas formas da cadeia por extenso, o que o guião percorre, as oito chaves com as vistas, os cinco estragos com as frases, e **a decisão de não tocar no Método**, com a razão (texto governado) e o que o diretor pode decidir depois.
* `README.md` do sítio: `check:cadeia` na lista dos passos da construção e nos comandos.
* `notas/parte3.md` §P3.

## 7 · Aceitação

1. `npm run build` verde com `check:cadeia` dentro; `npm run verify` verde; `npm run typecheck` verde.
2. As oito chaves em `dist/prova.json`, cada uma com a sua vista, e os totais iguais aos do plano ou com a diferença explicada.
3. Os cinco estragos fechados com exit 1 e a frase certa, e repostos.
4. Commits no ramo, cada um verde; não fundir, não empurrar.
5. O relatório: «judgement calls for the seat» primeiro; caminhos, contagens, commits, custo, o que ficou por fazer; verificado ou inferido em cada afirmação.

## 8 · Regras

* As onze decisões não se reabrem. Nenhum texto governado se toca (`sobre.mjs`, `metodo.mjs`). Nenhum byte de `registos/` nem de `studies-src/` muda.
* Prosa nova em português: Acordo de 1990, sem travessões, ponto médio como separador.
* Nunca `git add -A`; nunca `dist/`; mensagens na forma da casa com os dois trailers.
* Regra 14: uma conferência só conta depois de fechar sobre um estrago.
* Onde o plano deixa uma forma em aberto, segue o padrão mais próximo da casa, constrói, e põe a escolha à cabeça do relatório.
