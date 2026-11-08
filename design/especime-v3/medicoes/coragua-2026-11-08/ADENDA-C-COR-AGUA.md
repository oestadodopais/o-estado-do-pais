# Adenda C ao mandato COR-AGUA: os corpos alojados das linhas novas, o teto da L1, o PRR e o fecho (08.11.2026)

Acrescenta: frases
Frases: coragua/FRASES-COR-AGUA-prr.json
Medidas: medidas-adenda-c-coragua.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois do teu fecho parcial da adenda B (da7d6603d no sítio, 5df4e79 no motor). Terceira retoma, a mesma sessão e as mesmas worktrees. Este lugar correu fora da tua caixa o build, a corrida inteira e o `core.gate`; o que deram está no §0. Duas das causas abaixo são deste lugar: a adenda A pediu as cópias fora do git e um `sha256` em cada linha, sem medir onde o pacote procura os corpos; e não nomeou o teto da L1, que cresce com as linhas novas.*

## §0 Medido

- **O build da cabeça pára só na L1:** 3 518 páginas com dois destinos iguais fora da mobília, contra o teto de 3 479 (`scripts/lugar-tetos-b1.json`). As 39 páginas novas estão medidas, contra a medição da VOZ-2A F:
  - 34 são os recibos das 17 linhas novas, nas duas edições, cada um com a porta do Método duas vezes, como todos os recibos;
  - 5 são as edições arquivadas novas (`agua-nao-faturada` pt e en, `onde-esta-a-agua` en, `alentejo-algarve` en, `evora-quinze-anos-cinco-mandatos` pt), cada uma com a porta do seu estudo duas vezes.
  
  Nenhuma página sai. O registo das correções, nas duas edições, passa de 46 a 49 destinos repetidos, o que a L1 não conta.
- **O pacote da leitura a frio recusa (M83):** 14 das 17 linhas novas declaram `document.source_sha256` sem corpo alojado na cabeça do motor.
  - **Oito** citam cinco cópias: o edital da campanha de 2026 da EDIA, o anuário de 2024 da DGADR, o RASARP de 2025 (volume 1) da ERSAR, o estudo da Gulbenkian de 2020 e o Relatório 4/2016 do Tribunal de Contas. Estão em `raw/fontes/`, fora do git, como a adenda A pediu. O pacote procura o corpo no git do motor, em `<estudo>/source/`, com o recibo `<ficheiro>.pedido.json` ao lado, como têm as outras linhas do sítio. O motor já aloja assim PDF maiores do que estes; os cinco somam cerca de 62 MB, o maior 32,6 MB.
  - **Seis** são as linhas dos valores que a edição anterior imprimia. O seu `sha256` é o do ficheiro da edição arquivada no sítio (`studies-src/_edicoes/`), onde o pacote não procura.
- **O `core.gate` do motor** na cabeça 5df4e79, fora da tua caixa: PASS, código 0, nenhuma suite impedida.
- **O resto da corrida inteira** (sem build, sobre o `dist/` da cabeça): 67 passos, 7 vermelhos.
  - `check:voz` e `check:lugar`: a L1, acima.
  - `check:lingua` e `check:eo1`, a mesma causa: os localizadores das linhas novas estão em português, os seus documentos não estão declarados portugueses na tabela das línguas, e nas páginas inglesas dos recibos os localizadores saem sem `lang="pt-PT"`.
  - `check:formato`, 20 desvios de duas regras:
    - a F1: os anos que três linhas têm como valor (2016, 2019 e 2021, com a unidade «ano») tratados como quantidades de milhares, nos recibos, nos índices do livro e no registo das correções;
    - a F4: o «%» colado ao número nas frases inglesas do registo das correções. A adenda A escreveu-as assim, e a casa escreve «76 %» também na edição inglesa.
  - `check:alvos`, a H2: na faixa de 641 a 1 023 px, doze selos ficam abaixo dos 44 px de toque, entre eles os selos novos do registo das correções («row · O Estado do País», «fonte · calculado», «source · calculated», «fonte · ERSAR»).
  - `provar:eyetext`: quinze problemas, todos da ED1, três por documento, com as mensagens do registo: `documento atual saiu da prova`, `controlo da cláusula do ficheiro falhou` e `planta não chegou à cláusula do ficheiro`. Os documentos são `onde-esta-a-agua` pt e en, `agua-nao-faturada` pt e en e `alentejo-algarve` en.
- **O PRR:** as duas edições de `agua-nao-faturada` imprimem duas vezes «instantâneo de 29 de julho de 2026» / «snapshot of 29 July 2026» e uma vez a frase do total atualizado «para o instantâneo do próprio dia». Os pagos impressos são a soma do instantâneo de 3 de agosto que puseste nos dados. Este lugar procurou um instantâneo de 29 de julho e não o achou: nem nas cópias do motor, nem na API do dados.gov.pt (que hoje só lista o recurso atual), nem no arquivo da Internet. A consulta ao arquivo funciona: acha uma captura de março de 2026.
- **Os teus três ajudantes** (`reguas`, `motor_fontes`, `graficos`) gastaram cerca de 60 milhões de símbolos de entrada, o dobro dos cerca de 29 milhões da sessão principal. O lançador contou-os como «outras sessões».

## §1 O que fazes

1. **Os corpos das cinco cópias no motor.** Os cinco ficheiros, copiados de `OEDP_FONTES_AGUA` e conferidos pelo `sha256`, entram no git do motor em `content/01 Energy Water and Climate/source/agua-2026-11-08/`, cada um com o seu `.pedido.json` no formato das outras fontes alojadas. O recibo faz-se do `fetch-log.tsv`: só os campos que o registo tem, e os outros a `null`, nunca inventados.
   - Fica uma cópia canónica de cada ficheiro. Se o `raw/manifest.json` e o `fetch.py` ficarem, apontam para os mesmos `sha256`.
   - A prova: o pacote monta-se sem corpos em falta, com `PACOTE_ESTUDOS="content/01 Energy Water and Climate"` e `PACOTE_MOTOR` na cabeça do motor, numa pasta temporária fora das worktrees.
2. **As edições arquivadas como corpo.** O `scripts/leituras/pacote.py` aprende um caso: uma linha cujo `source_url` é uma rota de edição arquivada do próprio sítio (`/estudos/<estudo>/documento/<data>` ou `/en/studies/<estudo>/document/<data>`, no domínio do sítio) tem o corpo no repositório do sítio, na cabeça, em `studies-src/_edicoes/<estudo>.<língua>.<data>.html`.
   - O corpo confere-se pelo `sha256` como os outros, copia-se para `sitio/<caminho>` e lista-se em `CORPOS-ALOJADOS.md`.
   - Nas provas do pacote que já existem, três plantas: uma linha certa copia-se; um `sha256` errado recusa; uma linha do domínio do sítio que não é uma rota arquivada continua a recusar.
3. **O teto da L1** passa a 3 518, pela medição, como na VOZ-2A F: um ficheiro de medição na pasta das medições da COR-AGUA e o `scripts/lugar-tetos-b1.json` a apontar para ele, com a razão.
   - A medição lista as 39 rotas novas (os 34 recibos e as 5 edições) e nenhuma retirada, e mostra que as outras páginas conservam os mesmos destinos repetidos.
   - A régua L1 e as suas exclusões não mudam: a parte da L1 em `scripts/check-lugar.mjs` fica igual à da cabeça d2c65af9d, com a prova da VOZ-2A F.
   - Se o que fizeres nesta passagem mudar o conjunto das páginas, mede de novo e diz porquê.
4. **O PRR.** A lista declarada acima fica aplicada nas duas edições. Tem oito entradas: as quatro que mudam o texto, e quatro FICA que repetem as da lista da COR-AGUA, porque a camada 0 pede-as a cada lista que toca o estudo. A lista aplicada (`--aplicada`) dá zero na camada 0 sobre o `dist/` da cabeça. A entrada `agua-nao-faturada` do registo das correções passa a estas frases, letra por letra:
   - pt «A eficiência da rega passou ao valor que a DGADR publica, 76 %, sem a média ponderada de 83 a 85 % que era uma conta deste estudo; os 71 % de agricultores sem contador passaram a dizer que vêm de um inquérito da Gulbenkian feito em 2019 a quem rega explorações de 5 hectares ou mais, e não de 2021; e os valores do PRR passaram a ter a data do instantâneo de onde vêm, com os dados da edição inglesa iguais aos da portuguesa.»
   - en «Irrigation efficiency moved to the figure DGADR publishes, 76 %, without the 83 to 85 % weighted average that was this study's own calculation; the 71 % of farmers without a meter now say they come from a Gulbenkian survey carried out in 2019 among those who irrigate holdings of 5 hectares or more, not from 2021; and the PRR values now carry the date of the snapshot they come from, with the English edition's data the same as the Portuguese edition's.»
   
   A exceção da voz dessa entrada (`scripts/voz-excecoes.json`, `correcao_textual`) segue a frase nova, com o mesmo âmbito. A frase inglesa da entrada `onde-esta-a-agua` muda só no espaço antes de cada «%» («76 %», «about 95 %», «the 71 %»); o resto fica letra por letra.
5. **Os outros vermelhos da corrida**, cada um na forma da casa, sem mudar o que a régua protege:
   - **a língua:** os documentos das linhas novas declarados portugueses na tabela onde os outros documentos portugueses estão, e os localizadores com `lang="pt-PT"` nas páginas inglesas;
   - **os anos:** um ano que uma linha tem como valor imprime-se como ano, não agrupado. Procura como a casa já escreve os valores de ano e segue essa forma. Se não houver forma da casa, a F1 aprende os anos com unidade de ano, com uma planta que prove que um valor de milhares não agrupado continua a recusar;
   - **o «%» nas frases inglesas do registo**, como no ponto 4;
   - **os selos do registo das correções** com a área de toque de 44 px na faixa da H2, como os outros selos fora da prosa corrida, ou o registo declarado como prosa corrida se a régua já tiver essa classe e o registo for prosa. Diz qual escolheste e porquê;
   - **a ED1 do `provar:eyetext`:** lê a causa (os cinco documentos têm agora uma edição arquivada) e corrige-a na prova, sem tirar documentos da prova. Os cinco ficam lá dentro, e as plantas voltam a chegar à cláusula.
6. **A pasta `adenda-a-interrompida/`** sai, como a adenda B pedia.
7. **O fecho:**
   - o build integral;
   - `check:lugar`, `check:voz`, `check:lingua`, `check:eo1`, `check:formato`, `check:alvos`, `provar:eyetext`, `check:paridade`, `check:pre-mandato`, `check:frases-reais`, `ledger:check`, `check:edicoes`, `check:selos`, `check:publicadores`, `check:graficos` e `typecheck`;
   - as provas do pacote e a montagem do ponto 1.
   
   O `core.gate` e as conferências que a tua caixa impede (`check:frases-compostas`, as suites de rede do motor) corre-as este lugar depois. Os commits levam o assunto a começar por `COR-AGUA`, no sítio e no motor, com o gate do motor adiado (`OEDP_GATE=adiado`). O relatório curto diz o que mudou para o leitor e cada código.

## §2 Quando paras

Como no §2 da adenda A. Paras também se uma conferência que protege um número ou uma fonte exigir, para ficar verde, mais do que o §1 diz; não a alargas sem a planta que prove que ainda morde.

## §3 O fim

O ponto 7. Setenta e cinco minutos e cento e vinte chamadas, contando as chamadas dos ajudantes que lances; faz a passagem sem ajudantes, salvo se um trabalho independente o justificar, e diz quantas chamadas gastou cada um. Se não chegar, paras num commit limpo, com o trabalho feito comitado, e dizes onde ficou.
