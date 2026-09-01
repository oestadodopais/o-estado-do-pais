# O estado de `main` depois do bloco «o observatório a sério» (01.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5). De manhã a sessão de 01.09.2026 não construiu nada no sítio: escreveu a carta dos conteúdos, o inventário das fontes verificado na fonte primária, o desenho da frescura e da automação, o brief da forma dos domínios, a diligência legal lida na fonte e a política da autonomia, e pôs a visão no repositório (§1.88). À tarde, depois de o diretor adotar as recomendações, construíram-se e leram-se em cruzado o rótulo de IA (§1.89, fundido) e as 314 linhas do primeiro domínio (§1.90), e a cabeça nova arrancou. `main` está verde em cada commit (construção, `verify`, `typecheck` a 0) com uma exceção dita na secção da tarde. Sem travessões na prosa.*

## O que muda no ar

**À tarde, sim.** De manhã o `push` de `077d2b7..8ba6dd4` não lançou (o Vercel estava ligado ao repositório antigo); à tarde o diretor autorizou a religação pela linha de comandos, o plano Hobby recusou o repositório privado da organização (409), o diretor decidiu passar o repositório a público depois da passagem a segredos e dados pessoais (nenhum segredo; os dados eram os dele; o brief para o advogado emendado em `38d9166`), o repositório passou a público e o Vercel ficou ligado a `github.com/oestadodopais/o-estado-do-pais`. O primeiro lançamento depois disso foi o de `38d9166`: construído pelo Vercel a partir do repositório da organização (16 minutos, «Ready»), com `verify:deploy` verde («o que está no ar é o que está no repositório»); trouxe para o ar o carimbo semanal de 31.08 (`3198666`) e nada mais. A seguir, pela ordem, o rótulo de IA em todas as páginas e as 314 linhas do primeiro domínio, cada um depois da sua leitura cruzada: o lançamento de `cfa5045` ficou «Ready» às 15:47 UTC (16 minutos) e trouxe o rótulo (visto na primeira página no ar: «Texto gerado por IA sob a política da casa · responsável editorial: Nuno dos Santos», a ficha com «Publicação gratuita»); o de `c9a87c8` ficou «Ready» às 16:06 UTC (19 minutos) e trouxe as 2 916 linhas, com `verify:deploy` verde («o que está no ar é o que está no repositório»). Entre os dois, o lançamento de `a08e7cb` falhou no portão das decisões e nunca chegou ao ar (a secção da tarde diz porquê).

## O que muda no repositório

| commit | o que |
|---|---|
| `3198666` | o painel semanal de 31.08 (32 iguais, 0 alarmes, 4 avisos de carimbo) |
| `8997e26` | `VISAO.md` (o rascunho de 30.08 com duas emendas datadas); `PENDENTES-DO-DIRETOR.md` (as três respostas a «Feitas», a visão como segunda leitura, a linha da DRQPE anotada) |
| `90aca8e` | `design/observatorio/`: a carta, a frescura e a automação, a forma dos domínios, a diligência legal com o manifesto, a política da autonomia, o brief da divulgação, o brief do piloto; `CLAUDE.md` do projeto |
| (este commit) | o inventário das fontes (41 linhas da primeira vaga verificadas, 43 candidatas, o registo da verificação e a recomendação linha a linha), a pasta `inventario/` com os briefs e os quatro lotes, os dois ficheiros de plantas, a leitura do Codex e a medição do Sonnet, as emendas à carta e à diligência que os lotes pediram, a §1.88, esta nota, a cópia do prompt seguinte |

No motor: `3d4a302`, os quatro ficheiros da Segurança Social do bloco de 24.08 (manifesto 12 de 12). No cofre: a nota do Inbox triada e arquivada; a nota de continuidade em `Handoffs/` com o texto do plano de fim de vida.

## O que a verificação disse (o essencial; o resto em `INVENTARIO-DAS-FONTES.md` §4)

Das 41 linhas da primeira vaga, 20 verificadas por inteiro, 20 parciais (catorze só pela data da próxima difusão, que o Eurostat não serve em HTML), 1 mal formulada e corrigida, 0 ausentes. Onze linhas da carta mudaram com o que se leu. Fecham-se de caminho a I99 (os dois indicadores da população são a mesma tabela) e as células `[a verificar]` do estudo da água não faturada (o RASARP 2025 confirma os 26,5 %), em blocos pequenos por fazer. Depois da fusão, a amostra cega do Sonnet (3 de 3 plantas; nenhuma discrepância real em 87 comparações; ≈431 mil símbolos) e a leitura a frio do Codex (2 de 3 plantas; 16 achados graves e 28 maiores, quase todos reais e consertados: a tabela truncada, os estados sem regra, a frase de §5, dezanove células da carta).

## O que a tarde construiu e fundiu

| bloco | construtor | leitura cruzada | onde ficou |
|---|---|---|---|
| a verificação dos achados F1 a F4 e F9 da Segurança Social | (verificação, não construção) | Sonnet 3 de 3 plantas, Codex 3 de 3; as revisões de enquadramento escritas no relatório | motor `3720458`, empurrado |
| o rótulo de IA em todas as páginas, a secção da política, a ficha da primeira página | Opus, ≈590 mil em duas passagens | Codex 3 de 3 (`critica/2026-09-01-codex-leitura-rotulo.md`); a medição cega não correu (bloco de forma sem números) | `a185a2c` (fusão), `a08e7cb` (registos), `cfa5045` (emenda), `307796f` |
| as 314 linhas do primeiro domínio (E2, E4, T3, T4b, T5 e o ganho médio nos 308 concelhos) | Opus, ≈1,2 M em duas passagens | Sonnet 3 de 3 (95 de 101 células), Codex 3 de 3 (dezasseis achados consertados) | motor `7d6d486` (fusão), `77ce780`/fusão (o estrago independente do ambiente), `e7942c0` (as verificações), empurrado; sítio: rebaseado sobre `307796f` (`c72c4ff`, os quatro portões a 0) e fundido em `main` como `787b474`; a §1.90 é o registo |
| a cabeça nova como contentor | Opus, ≈760 mil em duas passagens | Sonnet 4 de 4 plantas, Codex 3 de 3 (`critica/2026-09-01-*-cabeca.*`) | fundida em `main` como `dd4a81cb`; a §1.91 é o registo |
| o piloto do corredor a duas velocidades | Opus, primeira passagem verde nos três ramos; segunda em curso | Sonnet 3 de 3 plantas (o arquivo contra a fonte viva), Codex 3 de 3 (o pacote dos dois ramos) | ramos `corredor-2026-09-01` (motor empurrado; sítio e arquivo locais), por fundir; a §1.92 em rascunho |

**A exceção à regra do commit verde.** `a08e7cb` saiu para o repositório com o `verify` a 1: a §1.89 dizia `Afecta: todos`, que não é um dos quatro nomes da amarra, e o lugar de direção escondeu o estado de saída atrás de um `tail`. Apanhado minutos depois pelo próprio registo e pelo construtor dos domínios, que rebaseou sobre esse commit e recusou consertá-lo no ramo dele (bem). `cfa5045` repõe a regra: `Afecta: sobre · metodo` com os carimbos dos dois textos e `Sem alteração` com a razão (a secção da política vive em `src/data/politica-ia.mjs` e nas vistas; `sobre.mjs` e `metodo.mjs` não mexeram, e a amarra só vê esses dois ficheiros, o que fica dito na própria entrada). O Vercel constrói com `npm run build`, e o primeiro passo dessa cadeia é o `ledger:check`, que traz a amarra: o lançamento de `a08e7cb` falhou (`● Error` aos 15 segundos, «§1.89: **Afecta:** nomeia "todos"», lido nos registos do Vercel), o ar ficou no lançamento anterior (`38d9166`), e foi o lançamento de `cfa5045` que trouxe o rótulo (a secção de cima diz como acabou). Dito com as duas versões porque o lugar de direção escreveu primeiro que o lançamento não tinha sido afetado, e estava errado.

**Por arrumar, sem pressa:** `scripts/gate-html.mjs` importa `temLeitura` (desde 26.08) e declara `TAGS_SVG` (desde 16.08) sem os usar; são código morto anterior ao rótulo, não uma regra desligada.

## O que fica

1. **Do diretor**: a escolha da tabela do inventário (§5); as quatro perguntas da carta (§6); as três afinações do brief da forma e a frase que substitui «Âmbito» e «Densidade»; a hora do corredor (06:10 UTC proposta), a chave de implantação e o repositório do arquivo; a tradução do texto da divulgação e a frase do rótulo; a hora do advogado (as perguntas 1 a 5 primeiro); o texto do plano de fim de vida; os pendentes de antes (as oito páginas de leitura, a indexação, o Parnaso, a DRQPE só se quiser).
2. **Do Opus, quando houver folga e depois da escolha**: o rótulo de IA em todas as páginas (o mais urgente: o artigo 50.º está em vigor desde 2 de agosto); a cabeça nova como contentor e depois os domínios da primeira vaga um a um, pela ordem estreita; o piloto do corredor quando a chave existir; o bloco pequeno da I87; o fecho das células da água; a I99.
3. **Do Sonnet e do Codex**: a verificação dos achados F1 a F4 e F9 do bloco da Segurança Social, antes de qualquer peça ou carta.
4. **Abertos**: I95, I96, I99 (respondida, por aplicar no motor), I101, I102, I103.
