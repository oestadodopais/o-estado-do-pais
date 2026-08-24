# BRIEF · Parte 3, ronda de correções 1 · depois da M1 e da primeira leitura cruzada

*Escrito a 24.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). Sítio: ramo `parte3-2026-08-24`, depois da P3. Os achados vêm da medição cega M1 (`design/especime-v3/medicoes/parte3-M1-sonnet.md`) e da primeira leitura cruzada (`design/especime-v3/critica/2026-08-24-codex-leitura-parte3-1.md`). Sem travessões na prosa deste ficheiro.*

## 0 · A regra desta ronda

Cada defeito real corrige-se **com o seu estrago plantado** (a conferência que passa a fechá-lo, vista vermelha e verde), regista-se na §1.64 do `DECISIONS.md` (subsecção «A primeira leitura cruzada e a medição cega», com a tabela das plantas apanhadas, a triagem e o que mudou) e em `notas/parte3.md`. Um achado que não é defeito (uma falsa alarme do medidor, uma leitura que a triagem rejeitou) fica escrito com a razão. Nada se corrige em silêncio.

## 1 · O achado da leitura cruzada (High 3): a porta da figura dentro de uma ligação do documento

**O defeito.** Uma figura sem linha do sítio que está dentro de uma ligação do próprio documento (no 04: os anos e os números dos relatórios dentro das ligações para as fichas do Tribunal de Contas, **21 ocorrências por edição, 42 no âmbito**; o leitor contou 22 e 44, e a P3 mediu 21 e 42, com a lista das coordenadas na sua nota) ficou em `<span data-registo>` sem porta própria; a porta estava só na entrada de «As linhas deste documento». A `IDENTIDADE.md` §5.3 e §10 não abrem exceção: onde aparece um valor, aparece a porta.

**A correção, decidida pelo lugar de direção (é a gémea da regra do selo, já escrita no contrato da P2):** a porta vai **imediatamente depois da ligação do documento**, uma âncora por figura sem linha do sítio que a ligação contém, na ordem das figuras: `<a class="texto-figura-porta-apos" href="#linha-<row>" aria-label="<rótulo>: <row>">` **sem nó de texto** (a leitura do olho não a vê, porque não tem texto; o eyetext do sítio já ignora um elemento de linha vazio), com o glifo pela folha (`::after`, a seta «→» pequena, na letra do instrumento, sem cor) e alvo de toque suficiente. O `aria-label` usa a chave nova `estudos.textoPortaDaLinha` («linha do motor» / «engine row») mais o identificador. Uma figura **com** linha do sítio dentro de uma ligação já leva o selo depois da ligação (regra da P2); a ordem, quando há várias figuras numa ligação, é a das figuras, selos e portas intercalados.

**O que muda nas conferências:** o L6 passa a exigir, para cada figura sem linha do sítio dentro de uma ligação do documento, a porta imediatamente depois da ligação (e continua a aceitar a forma direta fora de ligações); o `check:cadeia` (passo 6) passa a exigir o mesmo para contar a cadeia do motor como resolvida. **Plantas:** uma figura dentro de uma ligação sem a porta a seguir (L6 fecha; `check:cadeia` fecha); uma porta a seguir à ligação a abrir a entrada de outra linha (L6 fecha).

**A medida:** 42 ocorrências nas duas edições do 04 (medir e registar); zero nas outras seis (medir). A régua do inventário não muda (a âncora não tem texto).

**O que a P3 deixou pronto para esta correção:** o `check:cadeia` (C6) conta hoje essas 42 figuras como «dentro de uma ligação, sem porta nem selo», e por isso as chaves `registos_resolvidos` e `registos_por_resolver` ficaram com a vista `registos` em vez de `dist`. Depois da correção: o C6 exige a porta a seguir à ligação, e as duas chaves passam à vista `dist` (recontadas nas páginas construídas), com a tabela de vistas da §2.2 (origem 7) e a §1.64 P3 atualizadas.

## 2 · Os achados da medição cega M1

**Nenhum defeito real.** O medidor (Claude Sonnet, código próprio em Python, sem importar nada do sítio) mediu as doze medições nas três edições do exemplar e encontrou **zero discordâncias** em onze delas (blocos, unidades carácter a carácter, figuras, ênfase e ligações, selos e portas, cabeçalhos de tabela, «As linhas deste documento», as contagens do aparelho, algarismos fora de marca, mobília dentro do corpo); a medição 9, o controlo contra a edição arquivada, deu as 13 diferenças por edição do 04 que o desenho prevê (a passagem de voz e as legendas dos gráficos), listadas e não julgadas. O leitor do medidor foi provado com 21 defeitos plantados, todos apanhados; nenhuma falsa alarme. **A medição 6 aceitou a forma «figura dentro de uma ligação, com entrada»** porque o seu brief a dava como legítima; depois desta ronda, a M2 mede a forma nova (a porta a seguir à ligação).

Duas observações do medidor, para registar e não corrigir: o âmbito da medição 9 ficou pelos blocos dentro do `<article>` (inferido, e é a leitura certa); e um quinto balde na medição 6 («sem linha, sem porta nem entrada») deu zero nas três edições.

## 2b · Duas contagens da prosa do registo, corrigidas

* **«2 396 não têm linha no livro-razão deste sítio»** está escrito em quatro sítios (um comentário em `scripts/gate-html.mjs`, um em `src/views/TextoView.astro`, a §1.64 P2 e a §2.2 item 9 do `DECISIONS.md`). Do lado do sítio, as figuras sem linha são **2 405** (2 601 menos 196): o plano contou 2 396 porque tirou as 9 figuras cujas linhas o manifesto de travessia **do motor** declara `excluded` com razão escrita, e essas 9 também não têm linha deste lado. Reescrever os quatro sítios com 2 405, com a frase «(9 delas de linhas que o motor excluiu da travessia, com a razão escrita no seu manifesto)», e deixar a §1.64 a dizer que o plano contava 2 396 e porquê.
* O exemplo do guião no brief da P3 («63 com resumo de origem · 263 com motivo») era um número ilustrativo do lugar de direção e estava errado; o medido é 0 e 326 para o 04 pt. Não há nada a corrigir no código; fica dito na §1.64 como lição (um brief não escreve números que não mediu).

## 3 · O registo

* `DECISIONS.md` §1.64, subsecção `#### A medição cega M1 e a primeira leitura cruzada`: a tabela das seis plantas (cinco apanhadas, o controlo limpo), a triagem, o achado real e a correção com as suas plantas, as falsas alarmes do medidor com a causa, e o que fica.
* `notas/parte3.md`: a secção «Correções 1».
* `ISSUES.md`: o que for do motor ou de outra fase.

## 4 · Aceitação

`npm run build`, `npm run verify`, `npm run typecheck` verdes; `node scripts/provar-eyetext.mjs` verde; `node scripts/medir-defeitos.mjs` com a rota `texto` a zero; cada planta vista vermelha e verde; commits no ramo com os dois trailers; o relatório com os «judgement calls for the seat» primeiro.

## 5 · Regras

As mesmas: as onze decisões não se reabrem; nenhum texto governado; nenhum byte de `registos/` ou `studies-src/`; prosa em português no Acordo, sem travessões; nunca `git add -A`; nunca stagear `design/especime-v3/medicoes/`; regra 14.
