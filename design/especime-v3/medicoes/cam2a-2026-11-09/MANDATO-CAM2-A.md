# Mandato CAM2-A: o registo das frases com afirmação, a cobertura por régua e os corpos alojados no `ledger:check` (escrito a 09.11.2026)

Acrescenta: nada
Medidas: medidas-cam2a.json

*Escrito pelo lugar de direção (Claude Opus 5.5), pelo plano em vigor (`design/observatorio/PLANO-risco-zero-2026-11-08.md`, a §1.234, a camada 2) e pelo desenho de 08.11.2026. O construtor é o Codex `gpt-6-astra` (`high`), sem rede, na worktree do sítio `cam2a-2026-11-09` (a partir de `main` em f362f5ccd), com o motor da COR-AGUA (`master` em 9cdd232, só para ler, em `RESEARCHHUB_DIR`). É a primeira de três passagens da camada 2: esta, só guiões e sem modelo; a CAM2-B, o juiz de outra família com plantas, também sobre as frases de um mandato antes do construtor; a CAM2-C, a régua dos instantâneos datados. O que já chegou ao leitor como erro foram frases (atribuições, causas, o universo de um número), não números: os números têm o livro-razão e as réguas, e as frases ainda não.*

## §0 Medido (09.11.2026, por este lugar)

Com `python3 design/especime-v3/medicoes/cam2a-2026-11-09/medir-cam2a.py <dist> . "$RESEARCHHUB_DIR"` sobre o `dist/` de f362f5ccd e o motor em 9cdd232; a saída está em `medidas-f362f5ccd.txt`, na mesma pasta.

- **As frases candidatas.** As marcas de atribuição e de causa são as do guião da AUD1 (`listar-frases.py`, comitado nesta pasta), contadas uma vez por estudo.
  - Nas páginas portuguesas: 702 frases (571 com marca de atribuição, 144 com marca de causa), em 41 páginas. Destas, 642 estão num parágrafo sem ligação a uma fonte nem linha do livro-razão. O guião da AUD1 dá o mesmo total sobre o mesmo `dist/`.
  - Nas páginas inglesas, com marcas equivalentes escritas por este lugar: 530 (444 e 94), em 36 páginas; 477 sem ligação nem linha.
  - A diferença entre as duas línguas diz que as marcas inglesas não equivalem às portuguesas. Medem-se pelos pares, no primeiro ponto do §1.
- **As afirmações que já têm prova.** O livro-razão do sítio tem 4161 linhas, das quais 92 com `afirmacao: true`: as afirmações de pessoas e de partidos, com o excerto, o documento e `attributed_to`. Cinco módulos de bloco as conferem contra o corpo selado, cada um com o seu caminho no motor: `scripts/afirmacoes-og1.mjs`, `scripts/afirmacoes-eo1.mjs`, `scripts/afirmacoes-hb1.mjs`, `scripts/afirmacoes-v2d.mjs` e a V2A em `scripts/afirmacoes.mjs`.
- **Os corpos alojados.**
  - 795 linhas declaram `document.source_sha256`, e o corpo de cada uma está alojado, pelo sha256. Procurou-se em 2178 ficheiros de `content/*/source/` no git do motor e em 29 edições arquivadas do sítio (`studies-src/_edicoes/`): 795 encontradas, 0 sem corpo, em cerca de cinco segundos.
  - A M83 só confere isto no pacote (`scripts/leituras/pacote.py`), e só para as linhas mudadas; o `ledger:check` não o confere.
- **Os excertos.**
  - O excerto de 277 dessas linhas aparece palavra por palavra no texto do corpo (`pdftotext` para os PDF e o texto do HTML, com NFKC, sem a hifenização e com os espaços juntos).
  - As outras são quadros, registos JSON de séries e excertos compostos de várias células, cada um com o seu `excerpt_method`.
  - Uma conferência geral dos excertos de todas as linhas não cabe neste bloco. Este confere os excertos das linhas que sustentam uma frase do registo.
- **A lição da COR-AGUA.** Três dos erros que as leituras apanharam eram frases escritas por este lugar: o universo do inquérito da Gulbenkian, a eficiência da rega e a conclusão do rácio sem as qualificações. Cada um custou uma passagem.

## §1 O que fazes

1. **O detetor das frases com afirmação.** Um módulo da casa (`scripts/frases-com-afirmacao.mjs`, ou o nome que servir), sem modelo.
   - As marcas: as portuguesas de `listar-frases.py` e as inglesas equivalentes.
   - O corte em frases e o texto sem selos são os que a camada 0 já usa (`frasesDoTexto` e `textoParaProcura`).
   - Onde corre: nos documentos e nas páginas dos estudos, nos temas e nas explicações, nas duas edições.
   - As inglesas medem-se pelos pares. Uma frase portuguesa com marca cujo par inglês o detetor não apanhe conta como uma falha do detetor (os pares encontram-se pelos blocos, como a paridade os alinha); dizes quantas há antes e depois de afinar as marcas inglesas.
   - Os tipos: `atribuicao`, `causa` e `leitura`. A `leitura` é uma frase marcada como deste projeto, com `(cálculo: …)` ou `(inferência)`.
2. **O registo, no livro-razão do sítio:** `ledger/frases/<estudo>.json`, ou a forma que servir a `src/lib/ledger.mjs`. Uma entrada por frase com afirmação:
   - o identificador e o tipo;
   - `pt` e `en`, o par, como as páginas os imprimem sem selos;
   - `linhas`: os identificadores das linhas do livro-razão que a sustentam, cada uma com `excerpt` e `document.source_sha256`;
   - para uma `leitura`, a conta ou a razão.
   
   As frases de uma página sem estudo (os temas e as explicações) vão num ficheiro por página. O `ledger/README.md` diz o formato.
3. **A cobertura, por régua, na cadeia** (`check:frases-afirmacao`, no `verify` e na corrida `portão`). Cada frase que o detetor apanha no `dist/` tem de estar num de dois sítios: no registo, letra por letra depois de normalizada, na sua língua; ou na lista das por registar (`ledger/frases/por-registar.json`, com o estudo, a língua e o sha256 da frase normalizada). Esta passagem gera a lista a partir do `dist/` da cabeça.
   - A lista só encolhe. Uma entrada nova recusa-se em qualquer commit; uma entrada cuja frase já não está no `dist/` também se recusa, e sai da lista.
   - Escolhes o mecanismo que garante que a lista só encolhe também na corrida do GitHub, e dizes qual.
   - Uma frase reescrita deixa de bater e passa a precisar de registo. É isso que se quer.
4. **As conferências do registo, por guião, cada uma com a sua planta:**
   1. cada linha nomeada existe e tem `excerpt` e `document.source_sha256`;
   2. o `pt` e o `en` de cada entrada estão no texto da sua edição, o mesmo que a cobertura lê;
   3. uma citação do `pt` entre aspas angulares, de doze ou mais carateres, está palavra por palavra (normalizada) no excerto de uma das linhas; o `en` tem uma citação se e só se o `pt` a tiver;
   4. com `RESEARCHHUB_DIR`, o corpo de cada linha nomeada está alojado pelo sha256, e o excerto está no texto desse corpo, com a normalização do §0 ou uma melhor, dita no README. Sem `RESEARCHHUB_DIR`, a conferência diz que não leu os corpos, e essa linha nunca se lê como limpa;
   5. uma `leitura` tem a marca na frase, e a conta ou a razão na entrada.
5. **A M83 no `ledger:check`.** Com `RESEARCHHUB_DIR`, cada linha que declara `document.source_sha256` tem o corpo alojado com esse sha256, no git do motor ou numa edição arquivada do sítio. As 795 de hoje passam; uma linha nova sem corpo recusa-se.
   - Usa o índice dos corpos de `pacote.py` sem o copiar: um módulo partilhado, ou o mesmo código chamado. O pacote continua a fazer o que faz hoje.
   - Na corrida do GitHub, sem o motor privado, diz que não leu.
   - Na máquina corre com o motor na aterragem, como o `check:series`: o `aterrar.sh` chama-o no seu próprio comando e lê o código de um ficheiro.
   - Uma planta.
6. **A semente do registo, por guião.** Entra no registo, com a sua linha, cada frase que o detetor apanha num parágrafo que cite uma única linha com `afirmacao: true`, quando a citação está no excerto dessa linha e o par inglês se encontra pelos blocos; dizes quantas entraram. Nenhuma entrada se escreve à mão. As outras ficam na lista das por registar, que a AUD1 esvazia, estudo a estudo.
7. **O fecho:**
   - o `build` inteiro verde;
   - `check:frases-afirmacao` com as suas plantas, `ledger:check` com e sem `RESEARCHHUB_DIR`, `check:paridade`, `check:voz`, `check:pre-mandato` e `typecheck`, com os códigos;
   - nenhuma página do leitor muda: compara as páginas do `dist/` da cabeça com as de f362f5ccd, byte a byte, fora `version.json`, e dizes o comando.
   
   O relatório traz as contagens (as frases por estudo e por língua, as do registo, as por registar, e as falhas do detetor pelos pares, antes e depois) e os comandos. Os commits levam o assunto a começar por `CAM2-A`, com `OEDP_GATE=adiado`.

## §2 Quando paras

- Se uma conferência que protege um número, uma fonte ou uma pessoa só passar mais fraca.
- Se o detetor precisar de um modelo.
- Se a cobertura só correr com rede, ou com o motor na corrida do GitHub.
- Se alguma página do leitor tiver de mudar.
- Se a lista das por registar passar das mil e quinhentas entradas: diz porquê.

## §3 O fim

O ponto 7. Setenta e cinco minutos e cento e vinte chamadas, sem ajudantes.
