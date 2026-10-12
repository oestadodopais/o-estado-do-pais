# BRIEF, bloco da republicação de 20.08.2026 (lado do sítio): as linhas do PRR, os documentos do 04, 07 e 08, e a cópia arquivada

*Escrito a 2026-08-20 pelo lugar de direção (Claude Fable 5, a delegar), sob a
delegação da direção desse dia. É a segunda metade do bloco cuja primeira metade
correu no motor (`~/Instruments/ResearchHub/content/04 Évora Public Money/BRIEF-reextracao-2026-08-20.md`
e o relatório do seu construtor, que o lugar de direção entrega com este brief).
Corre num ramo novo do sítio, criado de `main` **depois** da fusão do bloco das
decisões (`decisoes-2026-08-20`). Grafia: Acordo de 1990. Sem travessões. Nada
inventado; `[a verificar]` para o que não se sabe. Onde este ficheiro e a
`IDENTIDADE.md` discordarem, ganha a constituição.*

## 0. O que o bloco entrega

1. **As sete linhas do PRR atravessam outra vez**, do motor para o sítio, com o
   instantâneo que a reextração de 20.08 leu (a data é a que o relatório do
   motor diz; não se escreve de cabeça): `python3 publisher/export_site_rows.py
   --write`, corrido na raiz do motor, com o manifesto que a primeira metade
   preparou. As linhas cujo valor mexeu levam a `atualizacao` tipada que a V16
   exige; as que não mexeram não levam entrada; `computed_over`, `access_date`,
   `reference_date` e `document.edition` seguem o instantâneo novo nas cinco
   somas. Depois, `npm run check:cruzamento -- --with-origin` tem de passar (é
   a conferência que a §1.48 deixou vermelha por esta razão).
2. **A frase da conta das duas linhas derivadas deixa de envelhecer.**
   `evora-prr-execucao-2026` e `evora-prr-vencido-quota-2026` publicavam em
   `derivation` os números do instantâneo de 2026-08-03 («= 50,36», «= 61,64»)
   com valores já movidos (achados 3 e 4 da leitura cruzada do bloco das
   decisões, §1.48). A causa é a forma: uma frase com números literais fica
   para trás a cada reextração. Passa a dizer a conta **por palavras e sem
   algarismos** nas duas edições (por exemplo «O que já foi pago, a dividir pelo
   que foi aprovado e atribuído ao concelho, vezes cem.»), e a expressão
   `check`, reavaliada em cada construção, é a que traz os números. A mudança
   entra no `publisher/manifest.evora.json` (campos `derivation` e
   `derivation_en` das duas linhas) e atravessa pelo exportador; a história da
   linha regista-a pelo tipo que o `ledger/README.md` fixa para uma frase da
   casa que estava errada sem o valor estar (lê-se a lista fechada e o que ela
   diz de `proveniencia`; se nenhum tipo servir, pára-se e diz-se).
3. **Os documentos do 04, 07 e 08 republicados.** As edições regeneradas pela
   primeira metade entram pelo caminho que `studies-src/manifest.yml` documenta
   no seu cabeçalho: os bytes para `_raw/<slug>.<lingua>.html`, `node
   scripts/normalize-study.mjs` para `<slug>/<lingua>.html`, a linha do
   manifesto com `sha256_raw`, `sha256_normalized`, `fetched_utc`, `origin` e
   `origin_ref` (o commit do motor de onde os bytes saíram, lido do `git log`
   do motor). `npm run check:documentos` tem de passar. No arquivo
   (`src/data/studies.mjs`), a entrada de cada documento republicado diz a data
   de hoje no campo que o arquivo tem para isso (`updated`; lê-se o ficheiro
   antes de escrever) e, no 04, a razão é substantiva (os números da página
   mudaram com o instantâneo); no 07 e no 08 a razão é de ponteiro (os excertos
   ganharam a janela corrigida; nenhum valor mexeu, e o portão das edições do
   motor é a prova). Se o arquivo não tiver campo para a razão, ela fica na
   entrada do `DECISIONS.md` e não se inventa campo.
4. **A cópia arquivada, em vez do alojamento.** A direção decidiu a 20.08, por
   delegação sobre a recomendação do lugar de direção, não alojar o ficheiro do
   PRR (licença «não especificada») nem pedir autorização, e em vez disso dar
   ao leitor a porta para uma captura datada do Internet Archive dos ficheiros
   sobre que a soma foi feita. Duas partes:
   - **motor**: um passo pequeno, `publisher/arquivar_instantaneo.py`, que pede
     ao Internet Archive a captura («Save Page Now», `https://web.archive.org/save/<url>`)
     de cada um dos três endereços datados que a reextração de 20.08 leu (os
     endereços estão no manifesto da travessia e no `MANIFEST.json` da vertical;
     o 19.08 confirmou que o Archive guarda ficheiros destes: há uma captura de
     44 329 912 bytes de um ficheiro de fevereiro, HTTP 200), espera a resposta,
     lê pela API CDX (`https://web.archive.org/cdx/search/cdx?url=<url>&output=json`)
     o carimbo e o resumo SHA-1 em base32 da captura, compara esse resumo com o
     SHA-1 dos bytes que o motor leu (calculado sobre a cache, não copiado), e
     escreve no `manifest.evora.json`, em cada ficheiro de `computed_over` das
     cinco somas, `archived: { url, at, digest_match }`. Um pedido de cada vez,
     com intervalo; se o Archive recusar ou a captura não bater certo, o campo
     diz isso (`archived: { status: "recusado" | "sem correspondência", … }`) e
     nada se inventa;
   - **sítio**: o formato ganha o campo `document.computed_over.files[].archived`
     (`url` https em `web.archive.org`, `at` data-hora, `digest_match` booleano),
     o validador (`scripts/check-ledger.mjs`) aceita-o só com essa forma, o
     exportador leva-o (V15/V16 não mudam), a página da linha mostra, no bloco
     «Calculado sobre», uma porta por ficheiro, «cópia arquivada pelo Internet
     Archive» / «copy archived by the Internet Archive», só quando
     `digest_match` é verdadeiro, e o `gate:html` confere a porta contra o campo
     (extensão da conferência que já lê `computed_over`; nenhum portão novo). O
     marcador `[a verificar]` das três somas **fica**: a regra do excerto nulo
     pede a recontagem mecânica na construção sobre um ficheiro que o sítio
     serve, e uma cópia de terceiro não a permite; a entrada do `DECISIONS.md`
     di-lo, e deixa à direção a pergunta de se a norma muda para aceitar uma
     captura de terceiro cujo resumo bate certo.
5. **Os registos**: `DECISIONS.md` §1.49 (`Afecta: nenhum`, salvo se algum texto
   governado mudar, o que este brief não pede), com as contagens antes e depois
   (régua e `dist/prova.json`), as provas plantadas, o que mudou em cada
   documento, a cadência decidida (uma reextração do PRR por mês, com a
   varredura mensal, e não por dia; a cadeia de `proveniencia` das linhas é a
   razão) e a pergunta sobre a norma da cópia arquivada; a §4.1 atualizada item
   a item (a republicação sai; a frase da conta sai; a cópia arquivada entra
   com a pergunta); `PLANO-fases.md` «The next session» item 3 (c) decidida e
   «Standing items» com a cadência; `IDENTIDADE.md` §12 se algum limite escrito
   lá deixar de ser verdade (lê-se antes).

## 1. As provas, antes de contar

- a V16 já foi provada na primeira metade; aqui prova-se a **porta arquivada**:
  (a) uma porta rendida para um ficheiro sem `archived` tem de fechar o
  `gate:html`; (b) `archived.url` fora de `web.archive.org` tem de fechar o
  `ledger:check`; (c) `digest_match: false` não pode render porta nenhuma
  (plantar e ver a página sem a porta, e o portão a não se queixar); cada
  estrago reposto e a reposição conferida;
- `check:documentos` a fechar com um byte trocado num documento republicado e
  a reabrir depois de reposto;
- `check:cruzamento -- --with-origin` vermelho antes do `--write` (é o estado
  herdado) e verde depois, as duas saídas citadas.

## 2. Regras

- Ramo do sítio: `republicacao-2026-08-20`, de `main` depois da fusão do bloco
  das decisões. No motor, `git add` só por caminhos explícitos e `git commit`
  logo a seguir; não tocar em `content/10 Housing/`, `indicators/`, `.gitignore`.
- Nenhum portão novo; extensões de conferências que existem, cada uma provada.
- Estado renderizado, nunca escrito; sem travessões; Acordo de 1990.
- Não fundir, não empurrar para `main`; no fim `git push -u origin
  republicacao-2026-08-20` e parar. O lugar de direção faz a leitura cruzada, a
  pré-visualização, recolhe a palavra da direção, funde, corre `verify:deploy`,
  regenera o pacote de desenho se algo visual mudou.

## 3. O relatório

Commits dos dois lados; a saída do exportador (linhas alteradas, entradas
escritas); as três capturas do Archive com carimbo e correspondência de resumo
(ou a recusa, com o código); os documentos republicados com os resumos novos; as
provas com as frases dos portões; contagens antes e depois; o que ficou por
fazer e porquê; tokens.
