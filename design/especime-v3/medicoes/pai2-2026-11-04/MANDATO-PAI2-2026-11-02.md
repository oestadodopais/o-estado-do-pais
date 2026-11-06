# Mandato PAI2: o país num quadro (todas as medidas do país numa página, por tema), e o aviso da revisão da fonte em cada medida

Acrescenta: frases

*Nota do lugar de direção de 03.11.2026, antes do lançamento.*
- **A worktree** é a `lote4-2026-11-04`, que parte da cabeça do lote 3 (a EV3, no ar desde 03.11.2026, e a LAR1 e a FP3, por aterrar), e não `main` de 02.11.
- **As medidas do §0 são de 02.11.2026.** Confere-as no `dist/` desta cabeça antes de mudar, e diz no relatório as que mudaram. A primeira página de 03.11.2026 ainda diz "a fonte reviu 3 deles, que aqui ainda têm o valor anterior".
- **A régua nova `check:largura`** (a LAR1) falha qualquer página mais larga do que o ecrã, nas cinco larguras. As tabelas novas por tema deslizam dentro da sua caixa, como as dos documentos depois da LAR1, e a página não.
- **Os commits** levam os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`.

*Escrito pelo lugar de direção (Claude Opus 5.5) a 02.11.2026, para o Codex `gpt-6-astra` a `high`, numa worktree a partir de `main` depois de o lote 1 de 02.11 aterrar (a SEL1 e a PAI1). Prosa em português, sem travessões. A decisão: o financiador, como leitor, a 02.11.2026: os indicadores oficiais dão a leitura do país, mas não se veem de forma coerente. Medido: nenhuma página mostra as medidas do país juntas; estão repartidas pelas sete portas; o Temas é um índice sem números desde 30.09.2026 (a §1.143, o N1: um cartão nacional inteiro vive numa página de assunto e em mais nenhuma). Este bloco não desfaz a §1.143: os cartões inteiros ficam nas portas; o quadro é uma forma compacta, uma linha por medida, que liga ao cartão.*

## §0 O que o lugar de direção mediu (02.11.2026, pela ficha do Sonnet e por guião, no `dist/` da cabeça do lote 1)

1. `src/data/dominios.mjs:859-931`, `DOMINIO_DAS_MEDIDAS`: 49 medidas em nove domínios; as portas (`ENTRADAS`, `src/data/primeira-pagina.mjs:290`, cartões em :302-456) mostram 47 cartões (`CartaoDaMedida` por `EntradaView`): preços 6, salários, pensões e apoios 7, pobreza e desigualdade 4, emprego 7, habitação 6, educação e saúde 4, Estado e economia 13. Dos 47: 45 com o valor anterior, 27 com a União Europeia, 10 com os 27 países, 12 com a série.
2. `/temas/` (`TemasView`, `TemasDoPais`, `IndiceDosAssuntos`): oito entradas (as sete portas e os lugares) e os dossiês; nenhum número.
3. A célula N1C (`tests/inicio/blocos-unicos.mjs:58-62`) recusa um `main article[data-cartao-medida]` de uma medida das `ENTRADAS` fora da sua página de assunto e de `areas/`.
4. **A revisão da fonte não se vê nas medidas:** o painel semanal escreve `verifications` com `result: diverge` e `found`; a 02.11 há três por aplicar (`desempenho-das-exportacoes-2024` 17,1 e a fonte 17,0; `desempenho-das-exportacoes-2025` 8,2 e 8,0; `sobrecarga-do-custo-da-habitacao-2025-ue` 7,7 e 7,6); só o recibo (`/livro-razao/<id>/`, `LinhaView.astro:1658-1680`) e, desde a PAI1, "A leitura da semana" o dizem; os cartões das portas mostram o valor selado sem aviso.

## §1 O orçamento

Uma passagem pelo lançador (`OEDP_BLOCO=PAI2`), setenta e cinco minutos e cento e vinte chamadas. Um commit por secção do §2; as conferências que a mudança toca; o `npm run build` inteiro pelo escrivão no fim.

## §2 O que muda

1. **O quadro do país em `/temas/` e `/en/themes/`:** depois do índice de hoje, uma secção por porta, pela ordem das portas, cada uma com uma tabela compacta das medidas dessa porta (as mesmas e pela mesma ordem dos cartões das `ENTRADAS`), uma linha por medida, com as colunas do §3.1: o nome da medida (a ligação para o cartão na sua porta, pela âncora do cartão), Portugal (o valor com a unidade e o período, e o selo depois da medida inteira), o valor anterior com o seu período, a União Europeia quando o cartão a tem, e o estado face à referência da Comissão quando o cartão o tem, com as mesmas palavras que o cartão usa (a mesma função, sem frases novas). As medidas reunidas (o desemprego e o da MIP) aparecem uma vez, como no cartão. Abaixo de 600 px, cada linha empilha as colunas com o rótulo de cada uma.
2. **Não é um cartão:** um componente próprio (por exemplo `QuadroDoPais.astro`), sem `data-cartao-medida`, sem a faixa dos 27 países, sem a série e sem a leitura; a N1C continua a recusar um cartão inteiro fora da sua porta, e uma planta prova-o.
3. **O aviso da revisão da fonte, em todas as formas que mostram uma medida** (o cartão das portas, a linha do quadro e qualquer outra que a régua encontre): quando a última reconferência de uma linha é `diverge` sem correção nem atualização depois dela, a medida mostra a frase do §3.2, com a ligação ao recibo. Os valores continuam os selados; o aviso não muda nenhum número.
4. **A régua `check:quadro`** (no `verify` e na corrida `portão`): o quadro tem cada medida das `ENTRADAS` uma e uma só vez, nas duas edições; o valor, o anterior e a União de cada linha conferem com o livro e com o cartão da mesma medida; o aviso aparece em todas e só nas medidas com uma divergência por aplicar, contadas de forma independente das `verifications`. **Plantas**, cada uma numa cópia: uma medida que falta no quadro; um valor trocado numa linha; uma divergência por aplicar sem aviso num cartão; um aviso numa medida sem divergência; um cartão inteiro copiado para o Temas (a N1C); e um controlo que passa.
5. **As réguas que estas páginas arrastam** mudam de forma com elas, pela mesma função, cada uma com a sua planta: a voz, o inventário das frases, `check:datas`, os alvos de toque, as sobreposições, a L1, `check:selos` e o mapa dos construtores.

## §3 As frases (palavra por palavra)

1. Os cabeçalhos das colunas: pt «Medida», «Portugal», «Antes», «União Europeia», «Referência da Comissão»; en «Measure», «Portugal», «Before», «European Union», «Commission reference».
2. O aviso da revisão da fonte: pt «A fonte reviu este número para ⟦found⟧ na releitura de ⟦data⟧; o valor acima é o publicado até a revisão se aplicar.»; en «The source revised this figure to ⟦found⟧ in the re-reading of ⟦date⟧; the value above is the one published until the revision is applied.» (`⟦found⟧` como a fonte o escreve, com a vírgula na edição portuguesa e o ponto na inglesa.)
3. O título de cada secção do quadro é o nome da porta, como o índice já o escreve; o título da parte do quadro: pt «As medidas do país»; en «The country's measures».

## §4 O relatório e o que pára

O relatório diz as medidas do quadro por porta (contadas no HTML construído da cabeça, nunca pelo nome do campo), as que têm aviso, as réguas que mudaram de forma e as suas plantas, os commits e os códigos lidos dos ficheiros `.codigo`; e as capturas do Temas e de uma porta nas cinco larguras e nas duas edições ficam para o lugar de direção. Paras e dizes: se a única forma de pôr uma medida no quadro for um cartão inteiro; se uma medida das `ENTRADAS` não tiver valor anterior ou período no livro (dizes qual; a célula fica vazia, nunca inventada); se uma frase do §3 for apanhada por um marcador da voz (diz qual; muda a frase, não a lista).
