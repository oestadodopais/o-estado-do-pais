# Identidade — as regras

O estudo de identidade v2 é a **origem** deste sistema. Este ficheiro é a
**regra**. Onde os dois discordarem, ganha este ficheiro, e a divergência fica
registada em `DECISIONS.md`.

Existe porque a auditoria de 13.08.2026 encontrou **643 das 1.528 linhas de
`src/styles/site.css` — 42% — debaixo de secções sem qualquer correspondência no
estudo**. Não foi uma decisão má; foram seis tipos de página resolvidos um a um,
sem nada contra que os resolver. Este ficheiro existe para que o sétimo tipo de
página não precise de um sétimo estudo.

É curto de propósito. Uma constituição que não se lê não é imposta por ninguém.

---

## 1. Três tipos, três funções, sem sobreposição

| Tipo | Função | Onde aparece |
|---|---|---|
| Serifada | A marca | **Só** no `.wordmark`. Em mais lado nenhum. |
| Monoespaçada | Valores medidos, rótulos, mobília | Todo o `<Claim>`, eyebrows, metadados, eixos |
| Sem serifa | Prosa | Lede, corpo, descrições, legendas |

**O caso que o estudo não resolveu — um número no meio de uma frase.** A regra
não é «algarismos vão a mono». É esta:

> A monoespaçada é a marca de **um valor que tem linha no livro-razão** — não a
> marca de um algarismo. Um valor do livro-razão vai sempre a mono, através de
> `<Claim>`. Uma data de referência, um número de secção ou um nome próprio com
> algarismos fica na letra da frase que o rodeia.

Por isso «Portugal está **18** pontos abaixo da média da UE-27. O valor de 2024 é
provisório.» está **certo** com duas letras: o 18 é uma medição, o 2024 é uma
data. A letra distingue-os, e essa distinção é o produto.

---

## 2. Cor com significado

- **Amarelo `--yellow`** — marca de medição. A barra da distância, o município
  aceso, as barras de composição, a região que está a ser lida. **Nunca como cor
  de texto. Nunca decoração.**
- **Oxblood `--oxblood`** — erro admitido. O registo de correções, e mais nada.
  Nunca ênfase, nunca alerta, nunca «só desta vez».
- **Tudo o resto** — `--paper`, `--paper-2`, `--paper-3`, `--ink`, `--muted`,
  `--rule`, `--rule-strong`.

**A regra para um caso novo: não há acento novo.** Um tipo de página novo não
ganha uma cor. Se for preciso distinguir alguma coisa, distingue-se com peso de
fio, com fundo (`--paper-2` / `--paper-3`) ou com a letra monoespaçada. Nunca com
matiz. Um segundo acento destrói o significado do primeiro.

---

## 3. As três disposições, e nenhuma quarta

O invólucro tem 1.180px e a prosa mede 60–68ch. A diferença **não é espaço
vazio**: é a coluna do aparelho. Uma página cuja segunda coluna está vazia ou a
enche, ou estreita o invólucro.

Um tipo de página novo escolhe **uma destas três**. Não inventa a quarta.

- **A · Rótulo e corpo** — coluna de rótulo de 220px, corpo a 68ch.
  Para texto com secções nomeadas. Em uso: `/metodo`.
- **B · Corpo e aparelho** — corpo a 68ch, coluna de 300px com o aparelho:
  proveniência, ressalvas, contagens, ligações ao livro-razão, o que a página
  **não** sabe. Para páginas de leitura e páginas de linha do livro-razão.
  Em uso: `/livro-razao/<id>` e `/municipios/<slug>` — o sétimo tipo de página
  escolheu esta das três, partilha as suas regras de grelha, e não trouxe acento
  novo (15.08.2026; `DECISIONS.md` §1.34).
- **C · Instrumento** — largura toda, o instrumento enche-a.
  Só para instrumentos.

---

## 4. As três camadas

Relance → Leitura breve → Fundo. **A profundidade abre-se no sítio, nunca noutra
página.**

Aplica-se a instrumentos **e** a páginas de leitura de estudo:

| Camada | Num instrumento | Numa página de leitura |
|---|---|---|
| Relance | O número, sozinho | A medida que faz o estudo valer a pena |
| Leitura breve | Uma frase, e a distância desenhada | Uma frase do que o estudo concluiu |
| Fundo | Método, ressalvas, proveniência | Método, ressalvas, proveniência, e o documento |

**Todo o instrumento leva as três.** O instrumento n.º 2 leva hoje só duas — não
tem camada 2. Ou ganha uma leitura breve, ou declara por escrito porque não a
tem.

---

## 5. O selo de proveniência

O Método promete, nas duas línguas: *«O selo de proveniência junto a cada número
é a porta para essa linha.»* Então:

1. **O selo é sempre uma ligação** para a linha do livro-razão. Um selo que não
   liga a lado nenhum não é um selo — é uma legenda, e a promessa fica falsa.
2. **Dois estados, e os dois têm de existir na página.** Quadrado cheio quando a
   proveniência está completa; a tracejado quando falta um campo. Um estado que
   nunca foi desenhado ao lado do outro ainda não é uma distinção.
3. **Onde aparece um valor, aparece o selo.** Sem excepção de página.
4. **No cabeçalho, o selo é só o glifo.** A única excepção ao rótulo visível:
   nas contagens da mobília do cabeçalho o quadrado (cheio ou a tracejado)
   basta, e o rótulo do estudo e o marcador ficam para leitores de ecrã. A
   ligação continua a ser a linha própria do valor. (2026-08-16, DECISIONS §1.37.)

---

## 6. Uma só linguagem de incerteza

Um marcador: **`[a verificar]`**. Uma classe: `.marcador`. Uma página que o
explica — **`/a-verificar` · `/en/to-verify`**, construída a 15.08.2026, ligada
do bloco «O que falta nesta linha» de cada linha incompleta e do Método. A
segunda formulação, `[descrição em preparação]`, esteve viva sete vezes em três
páginas até essa data e saiu: vinha de uma descrição de trabalho em
`src/data/studies.mjs`, que passou ao marcador único. `.tbv` é retirada.

Substitui as quatro formulações que a auditoria encontrou em uso ao mesmo
tempo: «fonte por confirmar», `[a verificar]`, `[descrição em preparação]`,
`[endereço a confirmar]`. Um marcador público que não é explicado em lado nenhum
é pior do que não marcar.

---

## 7. Estados desenhados, não deixados

Todo o componente tem de ter desenhado o estado **cheio, vazio, parcial e
velho** — não só o feliz.

- **Uma grelha nunca mostra célula vazia.** Ou a contagem é uma constante do
  desenho, ou a última célula tem um estado próprio. Cinco peças numa grelha de
  quatro colunas não é um acaso de largura: é aritmética que não fecha.
- **Uma linha de índice sem descrição di-lo**, em vez de repetir o título.
- **Uma página por escrever declara o que lhe falta**, em vez de fingir corpo.

---

## 8. O que o portão confere, e o que não pode conferir

O livro-razão tem portão desde o primeiro dia. A identidade não tinha nenhum:
todas as regras acima seguravam-se por atenção. As regras 1, 2, 5 e 6 são
mecânicas e passam a ser conferidas no build (`gate:identidade`):

- nenhum literal de cor fora de `tokens.css`;
- `--yellow` nunca como `color`;
- a família serifada só em `.wordmark`;
- todo o `.src-chip` é uma âncora;
- nenhum marcador de incerteza fora do formato ruled.

**O que o portão não vê**, e continua a ser trabalho de quem revê: se a segunda
coluna está a fazer alguma coisa (regra 3), se um instrumento tem as três
camadas (regra 4), e se um estado vazio foi desenhado ou apenas não aconteceu
ainda (regra 7).

---

*Origem: Observatório — Estudo de Identidade v2, 12.08.2026, arquivado em
`studies-src/_identidade/`. Regras derivadas da auditoria de 13.08.2026.*
