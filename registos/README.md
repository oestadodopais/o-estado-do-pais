# Os registos de conteúdo

**FICHEIRO GERADO, esta pasta inteira. Nada aqui se escreve nem se edita à mão.**

Um **registo de conteúdo** é o texto de uma edição do motor de investigação
(ResearchHub) partido em blocos, com cada algarismo que o livro-razão do motor
bate ligado à sua linha. É o que este sítio lê para compor uma página de leitura
com o seu próprio gabarito, sem receber saída renderizada e sem analisar HTML
alheio.

```
registos/<slug>/<lingua>.record.json    o registo, byte a byte como o motor o escreveu
registos/<slug>/<lingua>.cortes.json    as operações da passagem de voz que o fizeram
registos/manifest.json                  o registo de travessia: o que atravessou, e de onde
```

É a terceira travessia da fronteira entre os dois sistemas, e segue o padrão da
segunda (`ledger/cruzamentos/`, as linhas do livro-razão) e não o da primeira
(`studies-src/`, os bytes de um documento): um registo é conteúdo com resumo,
como uma linha, e não bytes servidos, como um documento.

## Quem escreve isto

O motor, e mais ninguém:

```bash
python3 publisher/export_records_site.py           # ensaio: prova tudo, não escreve nada
python3 publisher/export_records_site.py --write   # prova tudo, e só depois escreve aqui
```

O exportador recusa e não escreve um byte se o manifesto do estudo não disser
`estado: fixado`, se um resumo em disco não for o que esse manifesto declara, se
os ficheiros do motor não estiverem limpos no git, ou se o `slug` e a língua não
forem um trabalho e uma edição de `src/data/studies.mjs` deste sítio. Um ficheiro
desta pasta que a corrida não escreveria é nomeado e **não é apagado**: apagar é
decisão de quem retira uma edição. O contrato inteiro está em
`ResearchHub/publisher/REGISTOS.md`, na secção «A travessia para o sítio».

## Quem confere, e o quê

`npm run check:documentos`, a cada construção, com seis conferências que fecham a
construção como as três dos documentos alojados:

* **D1** cada entrada do manifesto tem ficheiro, e o resumo dos bytes é o
  `exported_record_sha256`, e é também o `origin_record_sha256`: o ficheiro
  atravessa byte a byte, e dois resumos diferentes entre si são um manifesto a
  mentir.
* **D2** nenhum ficheiro nesta pasta, fora o `manifest.json` e este `README.md`,
  sem entrada no manifesto.
* **D3** o `<lingua>.cortes.json` existe e bate com o `exported_cortes_sha256`.
* **D4** o `slug` é um trabalho de `src/data/studies.mjs` e a língua é uma edição
  declarada desse trabalho.
* **D5** quando os bytes alojados do documento vieram do motor, o
  `edicao_html_sha256` do registo é o `sha256_normalized` que o
  `studies-src/manifest.yml` declara para o mesmo `slug/lingua`. Sem esta, a
  página de leitura e a edição arquivada afastam-se em silêncio.
* **D6** os `blocos` e as `referencias` que o manifesto promete são o que o
  ficheiro contém, recontados pelo portão.

Há ainda `node scripts/check-documentos.mjs --with-origin`, que confere os
resumos de origem contra o `records.manifest.json` do próprio motor. Só corre
onde o motor está em disco, e por isso **não entra no `npm run build`**: a
construção acontece num construtor remoto onde o motor não existe, e uma
conferência que dependesse dele seria uma conferência do ambiente e não do
conteúdo.

## A edição em que o D5 não corre

`avaliacao-economica-regional-de-portugal-2026` pt. Os bytes que este sítio aloja
são um artefacto do claude.ai, e a edição que o motor prova é o
`Technical Source/artifact_pt.html`, que não é um ficheiro HTML auto-contido e
que este sítio não aloja. Para essa edição nada prova que a página de leitura e a
edição arquivada sejam o mesmo documento, e por isso **o portão di-lo em voz alta
a cada construção**, com o ficheiro nomeado, em vez de o resolver por omissão.
Dar ao 03 uma edição completa é decisão futura do motor. Ver `DECISIONS.md`
§1.64.

## Quando o motor refaz um registo

Cinco passos, e nenhum à mão:

1. `python3 publisher/export_records.py --write` no motor, e commite: o
   `records.manifest.json` do estudo passa a ter resumos novos;
2. `python3 publisher/export_records_site.py --write`, que reescreve os ficheiros
   e a entrada do `manifest.json` desta pasta, com o commit novo no `origin_ref`;
3. `npm run check:documentos` recusa a construção enquanto os resumos não
   baterem dos dois lados;
4. se o `.html` entregue mudou, os bytes alojados atravessam pelo caminho de
   sempre (`_raw/`, `scripts/normalize-study.mjs`, a linha do
   `studies-src/manifest.yml` com o `origin_ref`), e o D5 volta a bater;
5. o bloco de republicação do `DECISIONS.md` §1.49 aplica-se por inteiro:
   leitura cruzada de outra família com plantas, e a palavra do diretor antes de
   fundir.

**Não há reconstrução automática nem sincronização, e é deliberado.** Um registo
velho **pára** a construção, como um documento editado já a pára. Uma segunda
cópia do texto de um documento é exactamente a coisa que sai de passo em
silêncio, e a única defesa que funciona é a construção recusar-se a correr.
