# O estado de `main` ao fim de 24.08.2026

*Escrito pelo lugar de direção (Claude Fable 5) ao fecho do dia. Oito commits
em `main` desde `2a21ec8` (22.08), cinco já publicados e verificados no ar ao
início da tarde, três locais à espera do próximo deploy. Nada por commitar.*

## O que foi ao ar (deploy das 14:0x, `verify:deploy` ✓)

* **I63 fechada** (`9e2f11d` + motor `b2b4bfe`): a `reason_en` da linha 89 diz
  «and», editada dos dois lados de uma vez como a V17 exige; o `--write` deu
  0 alteradas.
* **I60 fechada** (`675f828`): o 09 pt-PT servido dos bytes do motor, origem
  `researchhub` com ficheiro e commit; a ilha `rcpt-data` voltou a ser uma, e a
  página perdeu ~616 KB sem mudança visível.
* **O painel semanal de 24.08** (`30912d4`): 32 afirmações reverificadas, cada
  uma no seu endereço Eurostat, 0 alarmes; `verificadoEm` 18 → 24.08.
* O registo das ISSUES com as duas fechadas (`77d911f`), e o arquivo das
  pensões da outra sessão (`5cb083e`), que seguiu no mesmo push.

## O que espera o próximo deploy (local, construção verde)

* **A estimativa da parte 3** (`c093609`):
  `ESTIMATIVA-PARTE3-2026-08-24.md`, 583 linhas, cada número rotulado. A
  restrição medida que muda o desenho: 2 396 das 2 601 figuras do âmbito não
  têm linha no livro-razão do sítio, e 119 das 196 que têm imprimem outra
  cadeia — a página de leitura é uma transcrição de um documento fixado, não
  uma composição da casa.
* **A frase do marcador no Método** (`d6d2564`, `DECISIONS §1.63`): a regra 9
  explica «(inferência)» nas duas línguas, com «o modelo»; cumpre a condição
  escrita do corte da voz do 03.
* **O 06 pt republicado** (`51003f1`): texto igual ao do motor medido carácter
  a carácter, troca só de proveniência de bytes. **O 03 pt não pôde trocar**: a
  edição que o motor prova é o `artifact_pt.html`, que não é um HTML completo
  (sem `head` nem `body`, medido) e a faixa exige um ficheiro auto-contido. O
  D5 da parte 3 não corre para o 03 pt, fica dito.

## As onze decisões do diretor sobre a parte 3 (24.08, «as recommended»)

1. A nona origem `data-registo` entra (a forma da oitava; o portão compara com
   o `printed` da figura). 2. Porta e não selo para as figuras sem linha do
   sítio. 3. Nos 119 valores que divergem, a porta basta. 4. P0 bloqueante —
   **feito no motor à tarde** (o eyetext perdia todas as ligações; 46
   acrescentadas com prova de pureza; `estado: fixado` refrescado). 5. A frase
   do Método, com «o modelo». 6. A rota chama-se `texto`/`text`. 7. O 06
   republicado; o 03 fica, com a razão medida. 8. A 16.ª edição (pensões) fora
   do âmbito. 9. A ausência diz-se pela porta que falta, não por uma frase.
   10. O exemplar da P2 é o par 04 **mais** o 08 pt. 11. Sem prancha nova; a
   leitura compõe-se das peças fixadas e mede-se contra a `IDENTIDADE.md`.

## A próxima sessão (a construção da parte 3, P1 a P4)

Abre no sítio, com a `ESTIMATIVA-PARTE3-2026-08-24.md` e estas onze decisões
como prompt. P1 a travessia (`registos/`, o manifesto, as seis conferências
D1–D6), P2 o renderizador com a rota `texto` sobre o exemplar 04+08 pt (a
leitura do olho portada, o `data-registo`, o recibo do motor), P3 o
`check:cadeia` com as oito chaves na prova, P4 as restantes edições. Leituras
cruzadas do Codex ao fim de P2 e de P4, com as seis plantas da §7. Custo
estimado: 1,02M a 1,65M símbolos Claude mais ≈530k de Codex em orçamento
próprio. Notas para essa sessão: as 7 ligações do 03 têm o URL como etiqueta
(~300 caracteres) e compor isso é decisão de gabarito; a régua do inventário
de frases tem de aprender a origem `data-registo` antes de contar as páginas
de leitura.
