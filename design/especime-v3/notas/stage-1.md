# Nota da etapa 1 · fundações: as duas entradas da constituição, os tipos alojados, os tokens v3, o cabeçalho partilhado

*Quem construiu: **Claude Opus**, construtor A, sozinho, sem subagentes. Ramo
`redesenho-v3`, cortado de `origin/main` = `77e82eb`. Nada foi empurrado, nada
foi posto no ar, `vercel.json` não foi tocado. Escrita no Acordo de 1990, sem
travessões.*

*Esta nota foi escrita no ponto de controlo a seguir à subetapa 1c, antes de
qualquer auditoria, e completada no fim. Todos os números que ela traz vêm de um
comando que está escrito ao lado deles.*

---

## 0. Os commits

| Commit | Subetapa | O quê |
| --- | --- | --- |
| `a21cc2a` | 1a | `IDENTIDADE`, `DECISIONS` §1.50: a letra passa a ser alojada aqui, e a cor passa a ser o par de estados |
| `7643251` | 1b | tipos: as três famílias alojadas aqui, convertidas sem perda, e a régua que as mede |
| `7650aed` | 1c | tokens: a paleta v3, o par de estados, e a folha partilhada sem os dois acentos da v2 |
| *(o commit que contém esta nota)* | 1d | cabeçalho, rodapé, selo: a navegação em versaletes, o selo à altura da linha, e o alvo medido |

*(O commit da 1d não se nomeia a si próprio: um ficheiro não pode trazer no nome
nem no corpo o resumo do commit que o contém. É o quarto commit do ramo a partir
de `2adf2cd`, e `git log --oneline` di-lo em uma linha.)*

---

## 1. Subetapa 1a · as duas entradas da constituição

`DECISIONS.md` **§1.50**, escrita a seguir à §1.49 e na gramática das §1.48 e
§1.49: `**Afecta:** nenhum`, com a mesma razão entre parênteses que a §1.49 usa
(a constituição não é texto governado no sentido do `**Afecta:**`; é quem os
cita). Regista o que abre a fase, o que muda na `IDENTIDADE.md` §1, o que muda na
§2, o que a §8 passa a dizer, e o que a entrada não faz.

`IDENTIDADE.md` §1: a tabela dos três tipos passa a Spectral (prosa e marca),
Bitter (valores, rótulos, eixos, o transcrito) e Spectral SC (antetítulos e
rótulos de secção); «Sem tipos de rede» passa a «Só tipos alojados aqui»;
entram as três notas novas (Bitter em caixa alta só dentro dos instrumentos,
algarismos tabulares versais nos instrumentos, e a regra do valor com linha no
livro-razão a mudar de letra e não de sentido).

`IDENTIDADE.md` §2: reescrita para o par de estados, com as medições dentro
(2,09:1 do âmbar sobre papel, 7,85:1 do contorno, 6,37:1 do ocre, 7,73:1 do
cobalto, 3,70:1 entre âmbar e cobalto). O amarelo e o oxblood retiram-se, com o
motivo. Não há segundo nem terceiro papel.

`IDENTIDADE.md` §8: a lista das regras de folha de estilos ainda sem conferência
de máquina passa a nomear `--amber`, `--ochre`, `--cobalt` e a caixa alta de
Bitter, e acrescenta «nenhum anfitrião de tipos de terceiros».

**O que não se tocou:** a §5 (a única citação do Método na constituição), um byte
de `src/data/metodo.mjs` ou de `src/data/sobre.mjs`, e as duas frases do Método
que o plano §12 rascunhou.

```
npm run ledger:check
  → amarra das decisões · 13 entrada(s) a partir da §1.38 · 2 texto(s)
    governado(s) · 1 citação(ões) da constituição conferida(s), de 42 entre «…»
  → ✓ cada texto no ar tem uma decisão registada que o governa, e cada frase
      que a constituição lhe cita está lá.
```

(Eram 12 entradas e 43 citações antes; a entrada nova é a §1.50 e a citação a
menos é «só desta vez», que saiu com o parágrafo do oxblood.)

`npm run build` verde.

---

## 2. Subetapa 1b · os tipos, alojados aqui

O registo completo está em `design/especime-v3/TIPOS.md`: origem, commit fixado,
caminho de cada ficheiro, SHA-256 de montante e de jusante, ficheiro de licença
e o seu resumo, autor e licença lidos na tabela `name`, ferramenta e versão. O
que segue é o essencial.

**`vercel.json`, lido nesta etapa.** Não tem `Content-Security-Policy` e não tem
política de tipos. Os cabeçalhos que declara são `X-Robots-Tag` (só no anfitrião
da pré-visualização), `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
`X-Frame-Options`, `Strict-Transport-Security` e `Permissions-Policy`. Nenhum
restringe a origem de um tipo. **Não foi tocado.**

**Origem: os repositórios das próprias famílias.** Não foi preciso o
`google/fonts`.

```
git ls-remote https://github.com/productiontype/Spectral.git HEAD
  → dbc06862d7030eedb1b01b60cdad8f6102f4ddfa  HEAD
git ls-remote https://github.com/solmatas/BitterPro.git HEAD
  → de749c69b5ffdb4b109c10d8fc331c3ecc4e39c5  HEAD
```

**Uma correção ao que o brief supunha.** O brief dava o Bitter como sendo «de
Huerta Tipográfica / Sol Matas». A tabela `name` do ficheiro diz
`designer = "Sol Matas, and Bitter project Authors"` e
`manufacturer = "Sol Matas"`, e não nomeia a Huerta Tipográfica; a organização
`huertatipografica` no GitHub tem 22 repositórios e nenhum do Bitter. Verificado:
Sol Matas, `solmatas/BitterPro`, «The Bitter Project Authors». A ligação
histórica à Huerta fica **`[verify]`** e não é escrita em lado nenhum do sítio.
O Spectral confirma-se: `designer = "Jean-Baptiste Levee"`,
`manufacturer = "Production Type"`.

**Oito ficheiros WOFF2, 711 428 bytes**, mais três `OFL.txt`. Conversão só de
contentor (`font.flavor = 'woff2'; font.save(...)`), com **fontTools 4.61.1** e
**brotli 1.2.0**, sem subconjunto e sem tocar em nome nenhum. O `woff2_compress`
não está nesta máquina e não foi usado.

**A conferência da conversão**, seis coisas comparadas entre o TTF de montante e
o WOFF2, nos oito ficheiros: número de glifos, resumo da ordem de glifos, resumo
da tabela `name` inteira, número de pontos no `cmap`, `unitsPerEm` e lista de
tabelas. **As seis batem certo nos oito.** Glifos: 1480 → 1480 nos sete do
Spectral e do Spectral SC, 1542 → 1542 no Bitter. Registos de `name`: 26, 26, 28,
28, 26, 20, 22 e 61, iguais dos dois lados. `cmap`: 878 nos Spectral, 977 no
Bitter, iguais dos dois lados.

### A régua dos tipos, e o achado que contraria a sessão de desenho

`node scripts/medir-tipos.mjs` (Chromium sem cabeça, Playwright 1.60.0 como
dependência de desenvolvimento, fora do `npm run build`; a página de prova é
servida de `dist/` e liga a folha real do sítio). Medição inteira em
`design/especime-v3/medicoes/2026-08-20-etapa-1b-tipos.json`.

**Os tabulares do Bitter são reais**, e a Emenda 5 fica confirmada com números.
Cadeias de sete glifos a 100px:

| | «1111111» | «0000000» |
| --- | --- | --- |
| Bitter 400, `normal` | **284,438 px** | **448,938 px** |
| Bitter 400, `tabular-nums` | **441 px** | **441 px** |
| Bitter 600, `normal` | **296,266 px** | **445,828 px** |
| Bitter 600, `tabular-nums` | **441 px** | **441 px** |

441 px em sete algarismos são 63 px cada, 0,63 em.

**Os tabulares do Spectral não são precisos**: as quatro larguras dão **350 px**
(`normal` e `tabular-nums`, as duas cadeias). Não é a feature a falhar; os
algarismos de defeito do Spectral já têm todos a mesma marcha, 500 unidades em
1000, lidas no `hmtx`.

**O `onum` do Spectral NÃO está inerte, e a conclusão da sessão de desenho vinha
de comparar o par errado.** O Spectral tem quatro conjuntos de algarismos:
versais tabulares (o defeito), versais proporcionais (`.LP`), antigos
proporcionais (`.OP`) e antigos tabulares (`.OT`). O `onum` mapeia o defeito para
`.OT` e o `.LP` para `.OP`, 44 substituições lidas na `GSUB`. Como o defeito e o
`.OT` têm a mesma marcha, comparar `normal` com `oldstyle-nums` não pode mostrar
nada:

| Comparação | «1111111» | «0000000» | O que prova |
| --- | --- | --- | --- |
| `normal` → `oldstyle-nums` | 350 → **350 px** | 350 → **350 px** | nada: os dois conjuntos são tabulares |
| `lining-nums proportional-nums` → `oldstyle-nums proportional-nums` | 297,5 → **285,5 px** | 387,813 → **398 px** | **os antigos entram** |

O mesmo no Spectral SC, com os mesmos quatro números. O Bitter também tem antigos
e também entram (284,438 e 448,938 px contra **291,672** e **461,078 px**), e não
são pedidos em lado nenhum: o aparelho quer versais tabulares.

**O que isto decidiu para a folha:** a prosa pede `oldstyle-nums proportional-nums`
e recebe antigos proporcionais a sério; o aparelho pede
`tabular-nums lining-nums` e recebe tabulares a sério. `proportional-nums`
entra porque `oldstyle-nums` sozinho daria antigos **tabulares**, que numa frase
corrida abrem buracos; a constituição visual §2 pede antigos na prosa e
tabulares versais nas tabelas e réguas, e é isto que cumpre as duas metades.

### Nenhum anfitrião de terceiros

```
npm run build && grep -r "fonts.googleapis.com\|fonts.gstatic.com" dist/
  → (nada impresso)   código de saída: 1
```

Positivo conhecido, para provar que o comando não está partido:
`grep -rl "fonts.googleapis.com" design/especime-v3/maquetas/` imprime
`OpcaoB.dc.html`, `Estudo.dc.html`, `Agenda.dc.html` e outras. As maquetas não
são construídas e não entram em `dist/`.

**Conferido no navegador** (Chromium sem cabeça, servidor local sobre `dist/`):
as oito fichas `@font-face` são declaradas; os dois pedidos de pré-carga,
`/tipos/spectral/Spectral-Regular.woff2` e `/tipos/bitter/Bitter%5Bwght%5D.woff2`,
respondem **200**, e nenhum pedido falha. O nome de ficheiro com parênteses retos
escreve-se codificado na folha e na pré-carga, com a mesma cadeia dos dois lados.

---

## 3. Subetapa 1c · os tokens v3 e a folha partilhada

### O que entrou e o que saiu

Entraram: `--paper #F6F7F4`, `--ink #17191B`, `--g1 #585D5B`, `--g2 #7F8681`,
`--g3 #D9DDD8`, `--amber #E0A21A`, `--ochre #7A5300`, `--cobalt #1F4E8C`,
`--cobalt-palavra`, e os derivados `--rule` = `--g3`, `--rule-strong` = `--g2`,
`--muted` = `--g1`, `--axis` = `--g2`, `--focus` = `--ink`, `--onamber` =
`--ink`. As letras: `--f-prosa`, `--f-instr`, `--f-versal`, com pilhas de recuo
reais.

Saíram: `--yellow`, `--oxblood`, `--onyellow`, `--dotcol`, `--shadow`,
`--paper-2`, `--paper-3`, `--f-sans`, `--f-serif`, `--f-mono`.

**`--cobalt-palavra` não estava na lista do brief e teve de existir**: a proposta
escura do plano §3 (f) exige que a palavra «dentro do limiar» clareie para
`#7FA6DC` enquanto o marcador fica no cobalto escuro, e sem duas fichas isso não
se escreve. Em claro as duas são o mesmo valor.

**`--onamber` fica declarado e ainda não é usado por regra nenhuma**: o marcador
de estado é a régua da etapa 2. Está aqui porque `IDENTIDADE.md` §2 fixa o
contorno como parte do marcador, e a régua do contraste mede-o.

### O que a folha ganhou

- **115 regras** passam de `--f-mono` a `--f-instr` com
  `font-variant-numeric: tabular-nums lining-nums` (91 ganharam a declaração, 21
  tinham-na sem `lining-nums` e foram ajustadas, 2 ficaram fora do bloco da
  família e foram ajustadas à mão). 5 regras passam de `--f-sans` a `--f-prosa`,
  1 de `--f-serif` a `--f-prosa` (a marca).
- A prosa do `body` ganha `oldstyle-nums proportional-nums`.
- `.eyebrow` e `.agenda-item-eyebrow` passam a `--f-versal`, caixa baixa,
  `.05em`, peso 600: versaletes editoriais de Spectral SC, e não caixa alta de
  Bitter, que a Emenda 5 guarda para dentro dos instrumentos. As maquetas
  desenham a navegação e as sobrancelhas em Bitter versalete alto; as maquetas
  não ganham.
- Todos os painéis de `--paper-2` e `--paper-3` passam a `--paper`. Onde já havia
  moldura, só o fundo mudou; `.figura`, `.quadro-estados-col` e `.linha-check`
  ganharam `1px solid var(--rule)`; `.instr` e `.leitura` perderam a sombra e
  ficaram com a moldura; `.linha-excerto` levanta-se agora só pelo fio de 3px.
- As barras de composição: calha a `--g3`, preenchimento a `--ink`. A aresta
  desenhada que a v2 tinha de acrescentar (o amarelo media 1,65:1 sobre a calha)
  deixou de ser precisa: tinta sobre `--g3` mede **12,83:1**.
- O ponto aceso do mapa e da legenda passa de amarelo a tinta, com anel de papel.
- O estado lido dos chips passa a bloco de tinta com texto de papel.
- O registo de correções passa de oxblood a tinta, **sem mudança de forma**: a
  forma (valor antigo riscado a cinzento, novo a tinta, a data) é da etapa 4 e
  espera a decisão (c).

### Os desenhos que escrevem a cor no gabarito, e o conflito com o brief

O brief §5.2 pede que, depois da passagem,
`grep -n "yellow\|oxblood\|--f-sans\|--f-serif\|--f-mono" src/styles/site.css src/components src/views src/layouts`
imprima **nada**. Imprime nada em `src/styles/site.css`, e não imprime nada em
`src/layouts`. **Imprime quatro linhas** que esta etapa não pode tocar:

```
src/components/InstrumentoConvergencia.astro:187   fill="var(--yellow)"
src/views/AgendaView.astro:673                     fill="var(--yellow)"
src/views/MunicipioView.astro:275                  fill="var(--yellow)"
src/views/MunicipioView.astro:388                  fill="var(--yellow)"
```

O brief supõe que todos os usos do amarelo estão na folha; quatro estão escritos
no atributo `fill` do próprio gabarito, e o brief §2 proíbe tocar em
`src/views/` e em qualquer outro componente, mandando remapear a regra na folha.
Foi o que se fez: um atributo de apresentação de SVG perde para qualquer
declaração de folha de estilos, e `site.css` ganhou um bloco nomeado com seis
regras que remapeiam os cinco `<rect>` e o `<circle>`.

**Conferido em Chromium sem cabeça, com `getComputedStyle`**, em `/`,
`/municipios/evora/` e `/agenda/`:

| Desenho | Selector | `fill` calculado |
| --- | --- | --- |
| barra da distância (convergência) | `.rule-svg [data-gap] rect` | `rgb(23, 25, 27)` = tinta |
| chapa do rótulo do marcador | `.rule-svg .mk rect` | `rgb(246, 247, 244)` = papel |
| chapa do rótulo de Évora | `.map-svg [data-aceso] rect` | `rgb(246, 247, 244)` = papel |
| ponto aceso do mapa | `.map-svg .mun-lit` | `rgb(23, 25, 27)`, contorno papel |
| dívida contra o tecto legal | `.mun-distancia-svg rect` | `rgb(23, 25, 27)` |
| série do índice | `.mun-serie-svg rect` | `rgb(23, 25, 27)` |
| janela de publicação | `.agenda-eixo-svg rect` | `rgb(127, 134, 129)` = `--g2` |

**Recomendação, e o item fica parado:** as quatro linhas saem quando as etapas
2 a 4 reescreverem esses desenhos, e o bloco de remapeamento sai com elas. Até
lá, o critério de saída do brief lê-se como cumprido em `site.css` e incumprido
em três ficheiros que a etapa 1 está proibida de abrir. Está em `ISSUES.md` como
**I12**.

### A letra, conferida na página construída

`getComputedStyle` na primeira página, depois de `document.fonts.ready`:
`body` → **Spectral**; `.wordmark` → **Spectral**; `.eyebrow` → **Spectral SC**;
`.claim-value` → **Bitter**; `.src-chip` → **Bitter**. Fichas carregadas na
primeira página: Spectral 400, Spectral 500, Spectral 600, Spectral SC 600,
Bitter 100-900.

### As duas tabelas do contraste

`node scripts/medir-contraste.mjs`. A régua ganhou um resolvedor de `var()`, para
seguir os derivados; sem ele mediria a cadeia «var(--g3)» e atirava. `PARES` foi
reescrito para 21 pares, cada um com `onde` a apontar a regra da folha.

**Claro (`:root`)**

| par | limiar | medido | |
| --- | --- | --- | --- |
| ink / paper (texto) | 4,5 | 16,39:1 | ✓ |
| muted / paper (texto) | 4,5 | 6,24:1 | ✓ |
| paper / ink (texto) | 4,5 | 16,39:1 | ✓ |
| ink / g3 (texto) | 4,5 | 12,83:1 | ✓ |
| ochre / paper (texto) | 4,5 | 6,37:1 | ✓ |
| cobalt-palavra / paper (texto) | 4,5 | 7,73:1 | ✓ |
| rule-strong / paper (interface) | 3 | 3,47:1 | ✓ |
| axis / paper (interface) | 3 | 3,47:1 | ✓ |
| g2 / paper (interface) | 3 | 3,47:1 | ✓ |
| focus / paper (interface) | 3 | 16,39:1 | ✓ |
| ink / g3 (interface) | 3 | 12,83:1 | ✓ |
| muted / g3 (interface) | 3 | 4,88:1 | ✓ |
| paper / ink (interface) | 3 | 16,39:1 | ✓ |
| **amber / paper (interface)** | 3 | **2,09:1** | **✗** |
| onamber / amber (interface) | 3 | 7,85:1 | ✓ |
| cobalt / paper (interface) | 3 | 7,73:1 | ✓ |
| **ink / cobalt (interface)** | 3 | **2,12:1** | **✗** |
| amber / cobalt (interface) | 3 | 3,70:1 | ✓ |
| rule / paper (decoração) | 0 | 1,28:1 | · |
| g3 / paper (decoração) | 0 | 1,28:1 | · |
| rule-strong / paper (decoração) | 0 | 3,47:1 | · |

**Escuro (a proposta do plano §3 f)**

| par | limiar | medido | |
| --- | --- | --- | --- |
| ink / paper (texto) | 4,5 | 15,38:1 | ✓ |
| muted / paper (texto) | 4,5 | 9,52:1 | ✓ |
| paper / ink (texto) | 4,5 | 15,38:1 | ✓ |
| ink / g3 (texto) | 4,5 | 9,19:1 | ✓ |
| ochre / paper (texto) | 4,5 | 8,00:1 | ✓ |
| cobalt-palavra / paper (texto) | 4,5 | 7,18:1 | ✓ |
| rule-strong / paper (interface) | 3 | 5,80:1 | ✓ |
| axis / paper (interface) | 3 | 5,80:1 | ✓ |
| g2 / paper (interface) | 3 | 5,80:1 | ✓ |
| focus / paper (interface) | 3 | 15,38:1 | ✓ |
| ink / g3 (interface) | 3 | 9,19:1 | ✓ |
| muted / g3 (interface) | 3 | 5,69:1 | ✓ |
| paper / ink (interface) | 3 | 15,38:1 | ✓ |
| amber / paper (interface) | 3 | 8,00:1 | ✓ |
| **onamber / amber (interface)** | 3 | **1,92:1** | **✗** |
| **cobalt / paper (interface)** | 3 | **2,16:1** | **✗** |
| ink / cobalt (interface) | 3 | 7,12:1 | ✓ |
| amber / cobalt (interface) | 3 | 3,70:1 | ✓ |
| rule / paper (decoração) | 0 | 1,67:1 | · |
| g3 / paper (decoração) | 0 | 1,67:1 | · |
| rule-strong / paper (decoração) | 0 | 5,80:1 | · |

**0 falhas de texto nos dois temas.** Os dois blocos escuros são iguais ficha a
ficha (a régua confere-o).

**Os quatro pares de interface abaixo de 3:1 são dois pares simétricos, e a
simetria é o resultado.** Em cada tema, cada marcador de estado é segurado por
si próprio ou pelo seu contorno, e nunca por nenhum dos dois:

| | o marcador sozinho | o contorno |
| --- | --- | --- |
| âmbar em claro | 2,09:1 ✗ | **7,85:1 ✓** |
| cobalto em claro | **7,73:1 ✓** | 2,12:1 ✗, e não faz falta |
| âmbar em escuro | **8,00:1 ✓** | 1,92:1 ✗, e não faz falta |
| cobalto em escuro | 2,16:1 ✗ | **7,12:1 ✓** |

O âmbar sobre papel a 2,09:1 é a medição que a Emenda 1 escreveu e é a razão do
contorno existir. Nenhum destes quatro é uma falha por resolver: são a mesma
regra vista dos dois lados.

### As deltas contra a base `77e82eb`

**Régua dos defeitos: os dois ficheiros JSON são idênticos, campo a campo.** Era
o resultado esperado, e é a prova de que a etapa 1 não mexeu em markup nenhum:
307 páginas; porta de correções 307/307; primeira página 0 valores sem selo e 0
selos para outra linha; frases de moldura 77 distintas e 2 367 ocorrências;
`[descrição em preparação]` 0; linhas com `#page=` 23 de 132; linhas com recorte
22 de 132; localizadores internos 0.

**Régua do contraste**, 19 pares na base contra 21 agora (18 comparáveis por
tema depois de resolver os que só existem de um dos lados):

- **saíram 12 pares** (nos dois temas): `ink/paper-2`, `ink/paper-3`,
  `muted/paper-2`, `muted/paper-3`, `oxblood/paper`, `oxblood/paper-2`,
  `oxblood/paper-3`, `onyellow/yellow`, `dotcol/paper`, `yellow/paper`,
  `yellow/paper-3`, `focus/paper-2`;
- **entraram 11 pares**: `ink/g3`, `ochre/paper`, `cobalt-palavra/paper`,
  `g2/paper`, `muted/g3`, `amber/paper`, `onamber/amber`, `cobalt/paper`,
  `ink/cobalt`, `amber/cobalt`, `g3/paper`;
- **mudaram de valor**, em claro: `ink/paper` 16,67 → **16,39**; `muted/paper`
  6,87 → **6,24**; `paper/ink` 16,67 → **16,39**; `rule-strong/paper` 1,83 →
  **3,47**; `rule/paper` 1,29 → **1,28**; `axis/paper` 3,56 → **3,47**;
  `focus/paper` 16,67 → **16,39**;
- **mudaram de valor**, em escuro: `ink/paper` 15,07 → **15,38**; `muted/paper`
  6,64 → **9,52**; `paper/ink` 15,07 → **15,38**; `rule-strong/paper` 1,78 →
  **5,80**; `rule/paper` 1,28 → **1,67**; `axis/paper` 3,45 → **5,80**;
  `focus/paper` 15,07 → **15,38**.

**A falha que a v2 carregava fechou-se.** `rule-strong/paper` era o par das 19
fronteiras de caixa e media 1,83:1 em claro e 1,78:1 em escuro, abaixo dos 3:1
da 1.4.11, e estava registado como defeito conhecido em `DECISIONS.md` §4. Com
`--rule-strong` = `--g2` passa a **3,47:1** e **5,80:1**: passa nos dois temas.
Também fecha `yellow/paper-3` (1,65:1), que era a calha das barras de composição
e obrigava à aresta desenhada, e `yellow/paper` (2,00:1).

Em troca, três pares de texto perderam décimas em claro (`ink/paper` e
`paper/ink` de 16,67 para 16,39, `muted/paper` de 6,87 para 6,24), porque o papel
deixou de ser quente e a tinta deixou de ser castanha: os dois continuam muito
acima de 4,5:1, e em escuro `muted/paper` **melhorou** de 6,64 para 9,52.

Ficheiros: `design/especime-v3/medicoes/2026-08-20-etapa-1c-7650aed-{defeitos,contraste}.json`.

**Uma nota sobre o nome dos ficheiros.** O brief pede
`2026-08-20-etapa-1c-<sha>-…`. O `<sha>` é o do commit `7650aed`, que é a
subetapa 1c, e por isso os dois ficheiros não podem estar dentro dele: um
ficheiro não pode trazer no nome o resumo do commit que o contém. Vão no commit
da 1d, com o nome certo, e esta nota diz porquê.


---

## 4. Subetapa 1d · a mobília partilhada

### O cabeçalho

**A navegação passou a ser uma lista de chaves de rota.** `ROTAS_NAV` em
`Masthead.astro`, com os rótulos a virem de `s.nav`. A decisão (a) do plano §3
custa **uma linha**: `const OITAVO_ITEM = null;` passa a
`const OITAVO_ITEM = 'correcoes';`, e o item entra antes de «Sobre». Nenhuma
cadeia nova é precisa: `nav.correcoes` já existe nas duas edições, e o rodapé já
o usa.

**Medido com oito itens, em Chromium sem cabeça**, acrescentando o oitavo por
JavaScript para que a decisão não possa partir a composição:

| largura | itens | linhas da navegação | altura da barra | transbordo horizontal | item mais largo |
| --- | --- | --- | --- | --- | --- |
| 320px | 8 | 3 | 157,6px | **0px** | 99,4px |
| 390px | 8 | 3 | 157,6px | **0px** | 99,4px |
| 1280px | 8 | 1 | 48,4px | **0px** | 99,4px |

Nenhuma das três larguras transborda. A 320 e a 390 a barra ocupa três linhas e
157,6px de altura, e isso é o que a decisão custa em ecrã estreito: fica dito,
porque é uma coisa que se vê e não um número que se esconde.

**A navegação vai em Spectral SC, e não em caixa alta de Bitter.** As maquetas
desenham-na em Bitter versalete alto; a Emenda 5 guarda a caixa alta de Bitter
para dentro dos instrumentos, e uma barra de navegação não é um instrumento. As
maquetas não ganham. Conferido no navegador:
`getComputedStyle(item).fontFamily` → `"Spectral SC"`, `textTransform` →
`lowercase`.

**As duas leituras ficam a tinta**, como a Emenda 1 obriga sobre o corpo §3 da
constituição visual, que lhes dava cobalto e âmbar. Já estavam a tinta desde a
v2; o que mudou é que agora está escrito porquê, na folha e na `IDENTIDADE.md`
§2, e assinalado à direção (plano §3 i, ISSUES I3). Perderam também a caixa
alta, pela regra nova da §1: são Bitter, e o cabeçalho não é um instrumento.

**A ligação de idioma leva a cadeia de pesquisa consigo, e só na primeira
página.** `Astro.url.search` acrescentado a `outra` quando a rota é `home`. Numa
construção estática esse valor é vazio, e é honesto dizê-lo: esta linha é o
contrato do lado do servidor, e quem a mantém em dia enquanto o leitor muda de
estado é o JavaScript da etapa 2, que encontra a ligação por `.lang`. O que ela
garante hoje é que a rendição sem JavaScript continua correcta.

**A variante compacta** não mudou: a marca encolhe para uma linha nas páginas
interiores, e a cabeça de 250px acaba.

### O rodapé

Conferido, lendo o componente: **rende a navegação e a ligação de idioma, e mais
nada**. A linha de autoria, a do domínio e a data de edição saíram a 16.08.2026
(§1.39) e não voltaram. Passa a Spectral SC, como a navegação do cabeçalho.

As oito secções do rodapé ficam como estavam, com «Correções» incluída. Um
rodapé mais completo do que o cabeçalho não é uma incoerência: o rodapé é o
índice do sítio, o cabeçalho é a barra de leitura, e é o cabeçalho que espera a
decisão (a).

### O selo

Lidos primeiro, como o brief manda: `Claim.astro`, `Provenance.astro`, e
`auditaSelo()` e `seloDaLinha()` em `scripts/gate-html.mjs`. **O que o portão
compara ficou intacto**: a classe `.src-chip` numa âncora, o `href` da linha
daquele valor, o atributo `data-selo-etiqueta`, o texto visível («fonte» /
«source») e o marcador, e a cadeia inteira com o texto oculto. Nenhum byte do
`Provenance.astro` mudou fora dos comentários. O que mudou é a forma, e vive
toda em `site.css`.

**A forma nova**, conferida com `getComputedStyle` na página de linha:
`display: inline`, `font-variant-caps: small-caps`, Bitter a `12px`,
`background-color: rgba(0, 0, 0, 0)` e `border-width: 0px`. Sem caixa própria,
sem fundo, sem moldura: o quadrado e a palavra sentam-se na linha da prosa, e o
sublinhado da palavra é o que diz que ali há uma porta. A entrelinha da prosa em
volta continua nos **27,65px** que `--t-leitura` × `--lh-leitura` dá, ou seja o
selo não empurrou a linha.

**As versaletes do Bitter são reais**, e não maiúsculas encolhidas pelo
navegador: «fonte» a 100px em Bitter mede **244,188 px** com
`font-variant-caps: normal` e **299,078 px** com `small-caps`. É por isso que o
selo pode dizer a palavra em versaletes sem infringir a regra de que a caixa
alta de Bitter só entra dentro dos instrumentos.

**O alvo de toque**, e é aqui que a medição mudou o desenho. O alvo vem de um
`::after` posicionado e centrado, que alarga o que se toca sem alargar o que se
compõe. Medido em Chromium sem cabeça, com `getClientRects()` por fragmento
(um elemento em linha que parte tem dois fragmentos, e o centro da união dos
dois pode cair fora dos dois):

| página | largura | selos | alvo ≥ 44×44 | alvo mínimo | pares de alvos sobrepostos |
| --- | --- | --- | --- | --- | --- |
| `/livro-razao/divida-publica-2025` | 1280 | 1 | **1/1** | **52,5 × 44 px** | 0 |
| `/livro-razao/divida-publica-2025` | 390 | 1 | **1/1** | **52,5 × 44 px** | 0 |
| `/` | 1280 | 27 com caixa (17 em painéis fechados) | 6/27 | 39,6 × 14 px | **0** |
| `/` | 390 | 27 com caixa | 6/27 | 52,5 × 14 px | **0** |
| `/municipios/evora` | 1280 | 91 | 8/91 | 52,5 × 10,3 px | **0** |

**Porque não são 44px em todo o lado, e porque isso é a escolha certa.** Os
selos empilham-se: medidas as distâncias verticais entre selos consecutivos na
primeira página, há pares a **3,1px**, **18,2px** e **22,4px**. Duas áreas de
44px a 18px uma da outra sobrepõem-se por 26, e a de baixo, que vem depois no
documento, apanha o clique da de cima. **Uma área sobreposta não é um alvo
maior: é uma porta que abre a linha do vizinho**, e num sítio cuja promessa é
que o selo abre a linha DAQUELE número isso é pior do que um alvo pequeno. A
primeira versão desta regra tinha 44px em todo o lado e media **84 pares de
alvos sobrepostos** na primeira página; a versão que ficou tem **zero**, nas
três páginas medidas.

Sete lugares levam a área do tamanho da unidade: `.compo-n`, `.figura`,
`.glance`, `.brief-text`, `.prov-vals`, `.mun-campos` e `.deep-v` dentro de
`.linha-bloco`. A saída certa não é encolher a área, é dar altura à fila, e as
filas são a primeira página (etapa 2, plano §13, «o selo como o maior alvo de
cada fila, >= 44px») e a página do município (etapa 3). Fica em ISSUES como
**I13**.

**Uma medição que não é uma regressão, e conferi-o.** Sete selos da fila de
proveniência do instrumento da convergência (`/`) não se deixam apanhar por
`elementFromPoint` depois de `scrollIntoView`: o ponto fica fora da janela.
Guardei a etapa 1d com `git stash`, reconstruí em `7650aed` e medi outra vez: os
mesmos sete, com o mesmo resultado, **antes** de a 1d tocar no selo. Não é desta
etapa. ISSUES **I14**.

**O selo nunca fica aninhado dentro de outro alvo** (Emenda 2). Escrito no
comentário de cabeça do `Provenance.astro`, com o motivo e com os lugares onde
morde (as peças da primeira página, etapa 2; os cartões dos índices, etapa 3), e
com o limite dito: o portão confere que o selo é uma âncora para a linha daquele
valor, **não confere que não está aninhado**, e por isso a regra segura-se por
atenção e pela leitura cruzada. Não foi escrito na `IDENTIDADE.md` §5 porque o
brief §2 dá a esta etapa a §1 e a §2 e mais nada; fica aqui para a cadeira
decidir se sobe à constituição.

### `PortaDeCorreccoes.astro` e `Frase.astro`

**Tipo, e mais nada.** Os dois rendem endereços de correio, e um endereço de
correio é transcrito: `IDENTIDADE.md` §1 v3 põe o que é transcrito em Bitter.
`.ligacao-email` ganhou `--f-instr` e os tabulares versais. Nenhum outro byte
dos dois componentes mudou: a prosa que eles rendem já ia em Spectral pela
regra do `body`, os marcadores já iam em Bitter pela regra do `.marcador`, e os
anos de referência (`{ ref: … }`) ficam na letra da frase que os rodeia, que é
exactamente o que a §1 pede.

### A construção, o portão e as réguas depois da 1d

```
npm run build     → verde
npm run verify    → ledger:check ✓ · check:cruzamento ✓ · check:documentos ✓
                    gate:html ✓ · check:dados ✓
```

**Régua dos defeitos: idêntica campo a campo à da 1c, e portanto à da base
`77e82eb`.** A 1d mudou a maneira como a navegação é rendida (de sete âncoras
escritas à mão para sete âncoras rendidas de uma lista) e não mudou uma ligação,
um texto nem uma contagem: 307 páginas, 307/307 portas de correções, 0 valores
sem selo, 77 frases de moldura distintas em 2 367 ocorrências, 23 linhas com
`#page=`, 22 com recorte, 0 localizadores internos.

**Régua do contraste: sem alteração face à 1c**, porque a 1d não tocou em
`tokens.css` nem em `PARES`. 0 falhas de texto nos dois temas; os mesmos quatro
pares de interface abaixo de 3:1, que são os dois pares simétricos do marcador e
do seu contorno.

### As capturas

32 ficheiros em `design/especime-v3/capturas/etapa-1/`, nomeados
`rota-largura-edicao-tema.png`: quatro rotas (`/`, `/livro-razao/divida-publica-2025`,
`/metodo`, `/municipios/evora`), duas larguras (1280 e 390), duas edições (pt e
en) e dois temas (claro e escuro). Página inteira, Chromium sem cabeça, depois
de `document.fonts.ready`. **A estrutura destas páginas ainda é a v2**: o que
elas mostram é a letra, os tokens e a mobília.

---

## 5. O que fica dito, e não descoberto depois

1. **Quatro literais `var(--yellow)` sobrevivem em três ficheiros que esta etapa
   não pode abrir** (I12). Remapeados por regra, conferidos no navegador, e o
   critério de saída do brief cumpre-se em `site.css` e não nos três ficheiros.
2. **O alvo de 44px do selo não cabe onde as filas são de 18px** (I13). Escolhi
   zero portas erradas em vez de alvos maiores, e a saída é layout, que é das
   etapas 2 e 3.
3. **41 regras põem Bitter em caixa alta fora de um instrumento** (I15), contra
   a regra que esta etapa acabou de escrever. As três da mobília partilhada
   foram corrigidas aqui; as outras são das etapas 2 a 4.
4. **As páginas de documento de estudo ficam fora da letra da constituição**
   (I11): `src/lib/documentos.mjs` escreve as suas próprias pilhas de sistema.
5. **`README.md` e `scripts/design-bundle.mjs` descrevem a identidade v2** e
   ficam errados a partir de `a21cc2a` (I16). Nenhum dos dois entra na
   construção.
6. **Sete selos da primeira página não se deixam medir** (I14), e conferi que já
   era assim antes desta etapa.
7. **O `onum` do Spectral não estava inerte** (§2), e a folha usa-o. Se a direção
   preferir a prosa em algarismos versais, é uma declaração em `site.css`.
8. **`--onamber` está declarado e ainda não é usado**, e `--cobalt-palavra` não
   estava na lista do brief e teve de existir para a proposta escura se escrever.
9. **O escuro é uma proposta** e muda por decisão da direção (plano §3 f), com o
   comentário do ficheiro a dizê-lo.
10. **A régua do contraste ganhou um resolvedor de `var()`** além do `PARES` que
    o brief me dá: sem ele a régua atirava sobre os tokens derivados. É uma
    régua, não um portão, e não entra em `npm run build`.
11. **Nenhum portão novo**, e nenhuma extensão de portão. Esta etapa não mudou
    uma linha de `gate-html.mjs`, `check-ledger.mjs` ou `check-dados.mjs`: as
    duas réguas novas (`medir-tipos.mjs`) e a alterada (`medir-contraste.mjs`)
    correm à mão e fora da construção. Não foi preciso plantar defeito nenhum
    porque não foi preciso conferência nova; o que precisava de prova, provou-se
    por medição no navegador e por positivo conhecido no `grep`.

## 6. Quem fez o quê, e quanto custou

Tudo o que está acima foi construído por **Claude Opus**, num só fio, sem
subagentes e sem delegação. Nenhuma parte desta etapa correu noutro modelo.

**Contagem de fichas:** a única contagem que esta sessão me reporta é o
orçamento que sobra, e não o que gastei. No fim da etapa 1d o contador dizia
**cerca de 14,60 milhões de fichas por usar**, de um teto de 15 milhões, o que
põe o gasto desta etapa na ordem das **400 mil fichas**, dentro da escala de 250
a 350 mil que o brief estimou, mas acima dela. Não tenho um número exacto e não
o invento: o que existe é este.
