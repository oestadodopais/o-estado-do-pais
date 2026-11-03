# Adenda A ao mandato LAR1: a moldura das edições guardadas pode mudar, o documento original não (03.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree. Paraste bem pelo §2, sem mudar nada, e o teu diagnóstico (`84e70e27a`) mostra o sítio exato: `comFaixa` (`src/lib/documentos.mjs`) insere o CSS da moldura no HTML servido de cada edição guardada, e o documento original fica no seu ficheiro em `studies-src/_edicoes/`. As medidas de partida estão comitadas (`design/especime-v3/medicoes/lar1-2026-11-03/antes/`, LAR1-0).*

## §1 A decisão deste lugar

O que uma edição guardada garante ao leitor é o texto tal como foi publicado: a prova das edições já o confere pelo texto, e não pelos bytes da página servida. O §1.2 do mandato passa a:

1. Podes mudar o CSS da moldura que `comFaixa` insere, só para as tabelas deslizarem dentro da sua caixa (e, se precisares, para o mesmo nas páginas de documento atuais).
2. Os ficheiros originais de cada edição guardada (`studies-src/_edicoes/*.html`) não mudam: o sha256 de cada um, antes e depois, igual.
3. O texto servido de cada edição guardada não muda: a prova das edições, antes e depois, igual.
4. No relatório, para cada edição guardada: o sha256 do HTML servido antes e depois (muda), o sha256 do ficheiro original (igual) e a prova do texto (igual). Uma linha no `REGISTO-DE-MELHORIAS.md` não é tua; este lugar escreve-a.

## §2 O resto

O resto do mandato fica: o registo das correções, a `check:largura` com a planta, as capturas que falham uma página mais larga do que o ecrã, a medição de depois com zero páginas a deslizar. Paras só pelas condições do §2 do mandato, menos a das edições guardadas, que esta adenda resolve.
