# O estado de `main` depois da parte 3 (noite de 24.08.2026)

*Escrito pelo lugar de direção (Claude Fable 5) ao fecho da sessão da parte 3,
depois da fusão. O ramo `parte3-2026-08-24` saiu de `main` `8d724f2` e voltou a
`main` por avanço em linha reta em `3e87b2f` (28 commits, 69 ficheiros),
empurrado e verificado no ar: construção da Vercel às 21:59 UTC,
`verify:deploy` ✓ com as invariantes de produção todas verdes. Esta nota e a
subsecção «A fusão» da §1.64 seguem no commit seguinte. Nada por commitar.*

## O que está no ar

* **Oito páginas de leitura, compostas pelo sítio a partir dos registos de
  conteúdo do motor**, em `/estudos/<slug>/texto` e `/en/studies/<slug>/text`:
  03 pt, 04 pt e en, 06 pt, 07 pt e en, 08 pt, 09 pt. Cada uma é uma transcrição
  do registo fixado (829 blocos, 2 601 algarismos, 39 ligações no total), medida
  carácter a carácter pelo portão a cada construção. **`noindex` e fora do mapa
  do sítio**, pelo contrato desta sessão: visíveis nos seus endereços (200 no
  ar, `<meta name="robots" content="noindex, follow">`), fora da pesquisa;
  indexar é decisão da sessão de UX, uma linha em `astro.config.mjs` e o
  `noindex` da vista.
* **A nona origem, `data-registo`** (`DECISIONS.md` §2.2, item 9): o registo de
  conteúdo na página que o transcreve, com as suas marcas (a edição, o bloco, a
  unidade, a figura, a linha do motor, a conta), todas comparadas com o registo,
  nenhuma dispensa, só na rota `texto`.
* **Os selos e as portas:** 196 figuras têm linha no livro-razão do sítio e
  levam o selo; 2 405 têm só linha do motor e levam a porta para «As linhas
  deste documento» na própria página (2 363 na própria figura, 42 a seguir à
  ligação do documento que as contém). Nos 119 valores em que o documento
  arredonda, a página imprime o do documento e o selo abre o exato (decisão 3).
  As três contas da faixa abrem o corpo, onde o que contam se vê.
* **A travessia:** `registos/` na raiz, escrita pelo exportador do motor
  (`publisher/export_records_site.py`, motor `d64a4d2`), com o manifesto de
  resumos de origem e deste lado; `check:documentos` ganhou as conferências D1 a
  D6 (o D5 corre em sete edições e não corre no 03 pt, dito a cada construção).
* **`check:cadeia`** percorre a cadeia de cada algarismo (o resumo de origem, a
  linha do motor, a linha do sítio quando há, a posição no registo, a marca na
  página, a saída) e escreve `dist/cadeia.json`; as oito chaves `registos_*`
  estão na prova (41 chaves, quatro vistas), recontadas pelo portão.
* **A edição arquivada não mudou um byte**: `/documento` continua a ser a
  edição de registo, e a página do estudo ganhou a porta «Ler no sítio →» ao
  lado de «Ler o documento →» só onde há registo (decisão 9).

## Como foi provado

* Vinte e oito estragos plantados nas etapas e nas rondas (P1 seis, P2 dez, P3
  cinco em sete corridas, correções 1 quatro, P4 um, correções 2 dois), mais os
  controlos negativos, cada um visto vermelho com a frase da sua conferência e
  verde depois de reposto; e os oito conhecidos-positivos do exportador no
  portão do motor.
* A leitura do olho do sítio (`src/lib/eyetext.mjs`) provada contra os
  registos fixados nas cinco edições cujos bytes alojados são os do motor:
  2 614 unidades iguais carácter a carácter, as 113 operações de voz conferidas
  pelo outro caminho (157 conferências, `scripts/provar-eyetext.mjs`).
* Duas medições cegas (Claude Sonnet, código próprio): M1 sobre o exemplar (04
  pt e en, 08 pt), zero discordâncias fora do controlo; M2 sobre as oito, quinze
  medições, zero discordâncias fora do controlo, os dois ficheiros de prova
  iguais às suas somas.
* Duas leituras cruzadas do Codex (`gpt-5.6-sol`, xhigh, pacotes calados,
  plantas registadas antes): a primeira 5 de 5 plantas e o controlo limpo, com
  um achado real (as 42 figuras dentro de ligações sem porta própria, corrigido
  com a porta a seguir à ligação); a segunda 6 de 7 plantas e o controlo limpo,
  com um achado real (as portas da faixa abriam uma agregação, corrigido) e uma
  falha explicada (a frase da Emenda 15 no aparelho do 03 pt não foi apanhada;
  a rede mecânica dessa classe é a régua do inventário, que imprime e não
  fecha).
* A régua do inventário de frases aprendeu a origem antes de contar as páginas:
  a rota `texto` lê autorreferência 0 e zero blocos por classificar nas oito, e
  nenhuma outra rota mexeu.

## O que fica para o diretor e para a sessão de UX

1. **Indexar as páginas de leitura** (tirar o `noindex`, entrar no mapa do
   sítio): uma linha, depois de as ver. Há cinco capturas em
   `design/especime-v3/capturas/parte3/`.
2. ~~**As oito chaves `registos_*` no Método**~~ **Feito a 25.08.2026 pela
   palavra do diretor (§1.65):** três das oito (`registos_edicoes`,
   `registos_algarismos`, `registos_com_linha_do_sitio`) entraram na prova da
   regra 2, «O motor»; as outras cinco ficam em `dist/prova.json` como detalhe.
3. **I66**, o selo entre a figura e o símbolo da unidade («51,95 ■ fonte %»),
   32 casos nas oito edições: forma, para a sessão de UX, com as duas definições
   contadas no registo.
4. **I68**, a altura das linhas das tabelas com portas a seguir a ligações
   (bloco 62 do 04): forma, para a sessão de UX.
5. **I65**, seis edições acabam num troço sem título porque a passagem de voz
   cortou o título e deixou o corpo: é do motor (os registos estão fixados).
6. **I67**, as 9 linhas que o motor exclui da travessia sem identificador: é do
   motor; enquanto forem prosa, o âmbito conta-se 2 405 deste lado e 2 396 no
   plano.
7. **O 03 pt**: a edição arquivada é o artefacto e não os bytes do motor; a
   medição da P4 diz que 464 das 469 unidades são iguais e as 5 diferenças são
   os 10 cortes da voz. Dar ao 03 uma edição completa continua a ser decisão do
   motor (decisão 7).
8. **I64**, um estrago no arquivo mata o `check:documentos` com um rasto de
   pilha em vez da lista: pequeno, para uma sessão de manutenção.

## Custo, como reportado

Opus (construtor): P1 ≈305k · P2 ≈634k · P3 ≈292k · correções 1 ≈319k · P4
≈345k · correções 2 ≈119k, ≈2,0M em seis corridas, acima dos 720k a 1,13M do
plano (as leituras de contexto, os estragos corridos duas vezes, e duas
reformulações depois de a medição mostrar que uma premissa do brief era falsa).
Sonnet (medidor cego): M1 ≈299k · M2 ≈306k. Codex (leitor de outra família,
orçamento próprio): 292 467 + 229 537. O lugar de direção: ≈650k, lido no
contador da sessão. Total Claude ≈3,2M contra os 1,02M a 1,65M do plano; o
excesso é dos construtores e do lugar de direção, e está dito por extenso na
§1.64.
