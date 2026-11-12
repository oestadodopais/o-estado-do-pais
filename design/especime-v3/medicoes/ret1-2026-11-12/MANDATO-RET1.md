# Mandato RET1: os oito estudos que a auditoria condenou saem do que se constrói (12.11.2026)

Acrescenta: frases
Medidas: medidas-ret1.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), na worktree do sítio `ret1-2026-11-12`, sobre o `main` de 12.11.2026 depois do CR3. O motor não muda. A medição em que assenta é a de `retirada-oito.py` (nesta pasta, só leitura; é o guião do REC2 com os oito estudos), e a saída é `RETIRADA-dos-oito.json`. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `RET1`. O teu relatório vai para `RELATORIO-RET1.txt`, nesta pasta, com quinze linhas no máximo; as medidas e os registos para esta pasta (`medidas-do-construtor-ret1.json`, `ret1-conferencias/`), só os códigos e as últimas vinte linhas, sem caminhos da máquina. Lê primeiro `design/especime-v3/medicoes/rec2-2026-11-11/MANDATO-REC2.md` e os seus dois relatórios: é o mesmo trabalho, com uma diferença, que é não haver sucessor.*

## Porquê

A 12.11.2026 o lugar de direção decidiu, com a palavra do financiador como leitor, que o que não está verificado não fica no ar. Oito estudos saem até voltarem reescritos e julgados:

- `evora-quem-governou-a-camara-2009-2025` e `evora-economia-e-dinheiro-publico-de-fora-da-camara`: a auditoria de 08 e 09.11.2026 achou neles erros reais (no primeiro, três painéis sobre pessoas nomeadas dizem dos seus relatórios uma coisa que os relatórios desmentem; no segundo, nenhuma linha do livro do estudo tem a cópia da fonte conferida).
- `agua-nao-faturada` e `onde-esta-a-agua`: o portão do motor conta neles centenas de números sem linha no livro, e a auditoria por amostra de 12.11.2026 achou no primeiro o progresso para a meta calculado sobre o ano errado.
- `avaliacao-economica-regional-de-portugal-2026`, `which-door-is-yours`, `alentejo-algarve` e `evolucao-de-portugal-desde-1981`: as auditorias por amostra de 12.11.2026 acharam em cada um uma conclusão que as fontes não sustentam, e nos três últimos dados que a fonte já mudou.

Nada se apaga do repositório: os documentos, os registos e as listas dos oito ficam onde estão, e o motor não muda. Muda o que se constrói e o que as réguas esperam encontrar construído.

## §0 O que se mediu (por `retirada-oito.py`, sobre o `dist/` da cabeça de partida; a lista por estudo está em `RETIRADA-dos-oito.json`, e as contagens em `medidas-ret1.json`)

1. **As páginas.** Cada um dos oito tem as suas rotas próprias construídas (a página, o documento e, onde existem, as edições datadas, por língua) e é ligado a partir de outras páginas (as áreas, o índice dos estudos, as páginas dos lugares, a página de entrada).
2. **O objeto de cada um,** lido do campo `subject` de `src/data/studies.mjs`: Évora nos dois primeiros; o Alentejo em `alentejo-algarve`; nenhum nos outros cinco (`agua-nao-faturada`, `onde-esta-a-agua`, `avaliacao-economica-regional-de-portugal-2026`, `which-door-is-yours` e `evolucao-de-portugal-desde-1981`).
3. **Os retirados que os têm por sucessor.** `evora-quinze-anos-cinco-mandatos` tem os dois de Évora entre os seus três sucessores; `evora-os-pelouros-quem-os-teve-o-que-fizeram` tem só o de quem governou; `evora-economia-investidores-portas-abertas-2026` e `evora-prometido-pago-auditado-2026` têm só o da economia. `scripts/estudos-retirados-conferir.mjs` recusa hoje uma retirada sem sucessor e um sucessor que não esteja publicado.
4. **As linhas do livro** com um dos oito no campo `study` (a conta por estudo está nas medidas): ficam.
5. **As contagens.** A linha `estudos-publicados` vale `13` e a `estudos-evora-publicados` vale `4`.

Outras medidas da mesma coisa: a contagem do arquivo que o próprio sítio publica (as duas linhas do ponto 5, conferidas na construção contra `src/data/studies.mjs`). Não há outra medição publicada.

## O que fazes

1. **Os oito passam a retirados, sem sucessor.** O estado `retirado` deixa de exigir `sucedidoPor`. Um trabalho retirado sem sucessor publicado tem por destino a página do seu objeto, na língua do pedido, quando essa página existe construída (para Évora, a página do concelho); quando o trabalho não tem objeto, ou o objeto não tem página, o destino é o índice dos estudos. A regra vale também para um retirado cujos sucessores estejam todos retirados; se sobrar um só sucessor publicado, o destino é esse; se sobrarem vários, a página do objeto, como hoje. O destino lê-se dos dados, nunca se escreve à mão. Plantas: um destino que não existe construído recusa; um sucessor retirado escolhido como destino recusa; um retirado sem objeto vai para o índice dos estudos e não para outra página.

2. **Os endereços antigos.** Cada rota própria dos oito (a página, o documento, a edição datada, nas duas línguas, e as rotas de texto que já redirecionam) passa a redirecionamento permanente em `vercel.json` para o destino do ponto 1, gerado pelo guião do REC2. Os redirecionamentos dos quatro retirados do ponto 3 do §0 recalculam-se pela regra nova, sem cadeias (nenhum redirecionamento aponta para uma rota que redireciona). A régua confere que cada rota que os oito tinham na cabeça de partida tem um redirecionamento, que o destino existe construído e que a origem já não existe.

3. **Nenhuma página construída aponta para os oito.** O índice dos estudos, as áreas, as páginas dos lugares, a página de entrada, o mapa do sítio, as novidades, a agenda, as leituras: a régua do REC2 que confere a ausência de ligações para os retirados corre sobre o sítio inteiro e passa a incluir estes oito. Uma página que fique sem estudos para mostrar (uma área, um lugar) mostra o que a casa já mostra quando não há estudo, sem frase nova.

4. **As linhas do livro dos oito ficam,** com o seu valor, a sua fonte e o seu recibo. O recibo de cada uma deixa de ter uma ligação para um estudo retirado: mostra o estudo de onde a linha veio só quando esse estudo está publicado. Se alguma régua exigir que o campo `study` de uma linha seja um estudo publicado, passa a aceitar um estudo retirado, com uma planta que recuse um estudo que não exista. Nenhum valor muda.

5. **As listas que só encolhem, encolhem,** e as que repetem frases dos oito saltam os retirados, como no REC2: `ledger/frases/por-registar.json`, `scripts/voz-excecoes.json`, `src/data/datas-de-publicacao.json`, as listas VOZ, as leituras, as correções em curso (as do bloco COR-AGUA incluídas) e as entradas da agenda que só existiam para os oito. As páginas de amostra dos testes que usem um dos oito passam para um estudo vivo, e cada planta prova que ainda morde. O teto da L1 desce para o valor medido. Para cada lista, o relatório diz quantas entradas saíram.

6. **As duas linhas do livro que contam estudos.**
   - `estudos-publicados` passa ao valor que a construção contar, com uma entrada nova na sua história, de natureza atualização e com a data `2026-11-13`. A razão, letra por letra:

   «Oito estudos saíram do arquivo a 13.11.2026 para serem reescritos: uma auditoria achou neles erros, números sem a cópia da fonte ou dados que a fonte já reviu.»

   Em inglês:

   «Eight studies left the archive on 13.11.2026 to be rewritten: an audit found errors in them, figures without a stored copy of the source, or data the source has since revised.»

   - `estudos-evora-publicados` passa ao valor que a construção contar, com uma entrada nova na sua história, de natureza atualização e com a data `2026-11-13`, e a `derivation` a dizer os estudos que ficam. A razão, letra por letra:

   «Dois estudos de Évora saíram do arquivo a 13.11.2026 para serem reescritos: uma auditoria achou neles erros e números sem a cópia da fonte.»

   Em inglês:

   «Two Évora studies left the archive on 13.11.2026 to be rewritten: an audit found errors in them and figures without a stored copy of the source.»

   A data das duas entradas é a da aterragem, 13.11.2026. Se chegares a este ponto ainda a 12 (hora UTC) e uma régua recusar a data por ser futura, não a enfraqueças: deixa este ponto para o fim e fá-lo depois das 00:00 UTC; se o tempo acabar antes, diz no relatório que ficou por fazer e este lugar fá-lo.

7. **A prova.** O `build` da cabeça e as conferências que cada ponto toca, com as plantas, cada código lido de um ficheiro. A lista inteira do `verify` corre-a o lugar de direção por guião depois da tua passagem. No relatório: a lista dos redirecionamentos gerados, com o destino de cada um; as duas frases do ponto 6 como o HTML construído as imprime, nas duas línguas; e o que o recibo de uma das linhas dos oito mostra no lugar do estudo.

## O que fica como está, por decisão

`studies-src/`, `registos/`, o motor, as entradas antigas de `src/data/correcoes.mjs` e os ficheiros de `design/`. Os valores das linhas dos oito (este lugar confere-as uma a uma contra a fonte num bloco próprio). Os cinco estudos que ficam.

## Quando paras

Só numa régua que proteja um número, uma fonte ou uma pessoa e só passe enfraquecida: paras nesse ponto, dizes qual e porquê, e fazes os outros. Para tudo o resto: decide, anota e continua. Se a camada 0 pedir a lista das frases prescritas, escreve-a como `frases-ret1.json` nesta pasta e declara-a no cabeçalho deste mandato, sem mudar mais nada nele.

## O fim

Os sete pontos, cada um no seu commit (se o tempo não chegar, a ordem é a dos números, e os pontos 1 a 3 primeiro), e o relatório curto: ponto a ponto o que ficou feito, as plantas, as listas que mexeram e as contas, os redirecionamentos, os códigos, o que ficou por correr fora da sandbox.
