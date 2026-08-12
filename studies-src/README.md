# Os documentos originais dos estudos

Esta pasta é onde se pousa o **documento de um estudo, tal como foi publicado**.
Nada aqui é escrito ou editado por este sítio: o que estiver nestes ficheiros é
servido como está.

```
studies-src/
  <slug>/
    pt.html      a edição portuguesa
    en.html      a edição inglesa
  _raw/
    <slug>.<lingua>.html   os bytes tal como foram descarregados
  manifest.yml             uma linha por edição alojada
```

## Pôr um estudo no sítio

1. **Pousar o ficheiro.** `studies-src/<slug>/pt.html`, auto-contido: estilos,
   scripts e imagens dentro do próprio ficheiro. O `<slug>` é o do trabalho em
   [`src/data/studies.mjs`](../src/data/studies.mjs) — o mesmo que já está no
   endereço `/estudos/<slug>`.
2. `npm run build`.

Não há passo 3. O endereço `/estudos/<slug>/documento` passa a existir, a página
do estudo passa a ligar para ele e o portão passa a conferi-lo. **A pasta é a
declaração**: não há registo para actualizar nem rota para escrever.

Para a edição inglesa, `en.html`, servido em `/en/studies/<slug>/document`.

## Se o documento vier de um artefacto claude.ai

O anfitrião não serve o documento do autor: serve-o embrulhado num runtime seu.
Há então dois passos antes do build, e nenhum é à mão:

```bash
# 1. guardar os bytes descarregados, tal e qual
cp <descarga>.html studies-src/_raw/<slug>.<lingua>.html

# 2. tirar o runtime — função pura, e que pára se o invólucro não for o esperado
node scripts/normalize-study.mjs \
     studies-src/_raw/<slug>.<lingua>.html \
     studies-src/<slug>/<lingua>.html
```

O segundo comando imprime os dois resumos e as três medidas que a linha do
`manifest.yml` precisa. **Acrescente-a**: sem ela o build pára, porque um
documento alojado sem proveniência declarada não é um documento alojado.

Se o normalizador atirar, **não contorne**. O molde do invólucro está escrito
por extenso no cabeçalho de [`scripts/normalize-study.mjs`](../scripts/normalize-study.mjs);
se o anfitrião o mudou, deriva-se outra vez dos bytes e reescreve-se ali.

## O manifesto, e porque tem dois resumos

| Campo | O que é |
| --- | --- |
| `sha256_normalized` | o resumo do ficheiro alojado. **É o invariante** — o mesmo documento dá sempre o mesmo valor. É o que `check:documentos` confere. |
| `sha256_raw` | o resumo dos bytes descarregados. **Não é reproduzível**: o runtime do anfitrião muda sozinho, e os mesmos bytes de autor dão descargas diferentes em semanas diferentes. É registo, não verificação. |

É por isso que `_raw/` está versionado: sem os bytes, `sha256_raw` seria uma
afirmação sobre uma coisa que já não existe. Ver [`DECISIONS.md`](../DECISIONS.md) §1.20.

## O que o build faz ao ficheiro

Uma coisa, e só uma: **acrescenta uma faixa no topo do `<body>`** — a marca do
observatório ligada de volta à página do estudo, uma nota a dizer o que o leitor
está a ver, e a linha de autoria da casa. CSS embebido, sem um único pedido de
rede.

Abaixo dessa faixa, o documento vai **byte a byte** como está aqui. O `<head>`
não é tocado. Os estilos não são tocados. Os scripts não são tocados.

O portão de HTML confere exactamente isso: reconstrói «ficheiro de origem + faixa»
e compara com o que foi construído. Se não for igual ao carácter, o build pára.

## Regras que o build impõe

| O que | O que acontece |
| --- | --- |
| pasta com um slug que não é de nenhum trabalho | o build pára |
| ficheiro que não é `pt.html` nem `en.html` | o build pára |
| `en.html` num trabalho que não tem edição inglesa no arquivo | o build pára |
| ficheiro sem `<body>` nem `</head>` | o build pára — a faixa não saberia onde entrar |
| documento construído diferente de «origem + faixa» | o portão fecha |
| documento em disco sem linha no `manifest.yml` | o portão fecha |
| linha no `manifest.yml` sem documento em disco | o portão fecha |
| um byte trocado num documento alojado | o portão fecha |

## O que ainda é da sua conta

- **As datas.** `date` e `updated` de cada edição vivem em `src/data/studies.mjs`
  e continuam por confirmar. Pousar o documento não as descobre.
- **A página do observatório.** `/estudos/<slug>` continua a dizer que está por
  escrever, e continua fora do índice, até alguém a escrever: a leitura curta,
  os números do estudo com linha no livro-razão, a proveniência. O documento
  estar cá **não** é a migração estar feita.
- **Os números do documento** não passam pelo livro-razão, e não podem passar:
  são de um trabalho já publicado, com a sua própria proveniência lá dentro. É
  por isso que o corpo do documento está dispensado do varrimento de algarismos
  — e por isso que a faixa, que é nossa, não pode ter nenhum. Ver DECISIONS §1.19.
