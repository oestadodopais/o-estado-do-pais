# V2-b: paragem antes da construção

A entrega dos três itens está bloqueada. A afirmação qualitativa do CFP não cabe na forma numérica usada pelo V2-a, e a conferência de origem já falha em ficheiros das pensões na cabeça de partida. Nenhuma página nova foi construída, nenhuma linha foi criada ou exportada e nenhum portão foi alterado.

## As provas da paragem

### V2B-1: a linha obrigatória do CFP não tem grandeza numérica

O §0.4 pede `afirmacao-cfp-parecer-05-2026-oe2027`. A linha continua ausente. O documento e as palavras existem: o problema é a forma da linha. A marca do V2-a é `afirmacao: true`, confirmada em `src/lib/ledger.mjs`, nas três linhas e no relatório do V2-a. Não é só o prefixo.

`publisher/oe1_common.py`, função `observation`, exige `value` e `unit` e chama `number(value)`. O validador do sítio, `src/lib/ledger.mjs`, exige uma cadeia de valor não vazia, uma unidade e a presença do valor no excerto. O V2-a já registou esta limitação no seu `LEIA-ME.md`: a conclusão do CFP ficou como apoio, sem número inventado nem afirmação independente.

`medir-partida.py` executa a recusa numérica real do motor e um ensaio do validador real do sítio, só em memória. O ensaio usa o excerto e a data lidos do PDF, deixa `value` e `unit` vazios e não escreve uma linha. As mensagens são:

- Motor: `Número ausente ou ambíguo: `.
- Motor: `Número ausente ou ambíguo: endossa as previsões macroeconómicas`.
- Sítio: `[afirmacao-cfp-parecer-05-2026-oe2027.yml] V2A valor: não aparece no excerto`.
- Sítio: `[afirmacao-cfp-parecer-05-2026-oe2027.yml] "value" tem de ser uma string não vazia, com o valor tal como publicado.`.
- Sítio: `[afirmacao-cfp-parecer-05-2026-oe2027.yml] falta "unit".`.

O número do parecer, o ano e a previsão do PIB não são valores desta afirmação. Atribuir-lhe qualquer um deles seria mudar o significado dos dados. Também não se substituiu a citação obrigatória por uma linha do PIB nem por prosa sem token.

Decisão: parar nesta questão, pelo §1 e pela regra dos portões que protegem números. O mandato prevê alargar o resolvedor para ler campos literais, mas não define a forma de uma afirmação sem grandeza nem a apresentação do seu recibo. A solução recomendada para um mandato corrigido é uma forma explícita de afirmação textual, sem `value` nem `unit`, com proveniência, atribuição, data e excerto obrigatórios e plantas próprias nos dois lados da exportação. Isso altera o contrato do livro e dos recibos; não foi tratado como uma ambiguidade pequena nem implementado nesta passagem.

### V2B-2: o endosso e o aviso são uma frase contínua

A capa, lida por `pdftotext -layout` e vista na renderização, diz Parecer n.º 05/2026, de 2026-10-07. A conclusão foi lida e vista na página 20 do PDF. O corpo corresponde ao recibo do pedido e ao resumo da linha do PIB: `b4ec1e5dbac4157d5ef0d111fefa135e693ee4158cf851e9623ec0314636c2cb`.

O parágrafo integral é:

> Nos termos do número 4 do artigo 4.º do Regulamento n.º 473/2013 do Parlamento Europeu e do Conselho de 21 de maio de 2013, em resultado da análise efetuada às previsões macroeconómicas subjacentes à Proposta de Orçamento do Estado para 2027 do XXV Governo Constitucional, com base na informação atualmente disponível e ponderando os riscos identificados, tendo em conta que a evolução para o crescimento nominal previsto para 2027 respeita os princípios legais supramencionados, o Conselho das Finanças Públicas endossa as previsões macroeconómicas apresentadas, dando nota que os riscos para o crescimento real apresentam um pendor descendente.

O §0.4 fala em duas frases e manda acabar a do endosso em «endossa as previsões macroeconómicas». O PDF continua «apresentadas, dando nota que os riscos…» na mesma frase. Decisão pequena: a citação fiel é o parágrafo contínuo acima, sem o dividir, repetir ou truncar. Esta decisão não resolve a falta de forma da linha.

A extração selada na linha atual do PIB contém «número 4do artigo»; a leitura por `pdftotext` e a imagem da página mostram o espaço em «número 4 do artigo». A linha existente não foi corrigida nem reexportada nesta passagem. O novo excerto, quando houver forma para o alojar, deve preservar o espaço confirmado.

Documento no motor: `content/15 Orcamento do Estado 2027/source/v2a/cfp-parecer.pdf`. Recibo: `content/15 Orcamento do Estado 2027/source/v2a/cfp-parecer.pdf.pedido.json`. `cfp-inspecao.json` regista as imagens da capa e da conclusão vistas nesta passagem, com dimensões e sha256; as imagens ficam fora do repositório. As páginas de direitos já alojadas em `source/v2a/direitos/` ficaram intactas. Nenhum pedido novo à rede; a tranca HTTP alternativa não foi usada.

### V2B-3: a origem das pensões já não coincide na partida

`RESEARCHHUB_DIR=<motor> npm run check:cruzamento -- --with-origin` saiu a 1. `cruzamento.log` guarda a saída e `cruzamento.json` os resumos. Os ficheiros divergentes são:

- `publisher/recortes/penalizacao-legal-um-ano-antecipacao-2026.yml`: registo `6d9c0cf390e73c3e0e68f6effbaf6e01b49b1c8dd03de847c3b40384d8542049`; motor `47e45757e6bbc0f9d3012eb24b7d4320080e9dfec2fb100c7ef4389c293cc5dd`.
- `content/13 Dominios/pensao-rp4n.json`: registo `e27a34453a0d8c92a8548b2067f247a23e64195934e721238cca70fc69c44108`; motor `3ebe8c2d6fc96479d795fbf7d5dbdf044ecb575e5cd87dd6cd0e761def3d5684`.

Os bytes do commit anterior do motor coincidem com o resumo registado no sítio em ambos os casos. O diff do commit `101887c` troca as referências ao commit antigo pelas referências traduzidas da história nova. Não se alteraram os números; os bytes da proveniência mudaram e o cruzamento acusa essa mudança.

Decisão: manter a recusa. Não atualizar resumos à mão nem tocar nos ficheiros de outra corrida. A retoma precisa de uma travessia regular destes artefactos corrigidos, com a conferência de origem verde. Este erro antecede qualquer alteração do V2-b.

## A repetição do §0

Cabeça do sítio: `9b10c3f4ad381f98b32ece7d2935329d4f0816a7`. Cabeça do motor: `101887c7621b314e07f12acedcf78829e0a3e745`. `git merge-base --is-ancestor main HEAD` no sítio e `git merge-base --is-ancestor master HEAD` no motor deram 0 e 0. Não houve fusão.

O guião conferiu individualmente 18 identificadores: 3 afirmações e 15 linhas numéricas. `partida.json` guarda, por linha, valor, unidade, período, fonte, documento, atribuição, data, excerto, ressalva e sha256 do YAML. Os valores das quinze linhas coincidem com o §0 após normalizar apenas os espaços de milhares. Todas têm ressalva.

| Identificador | Valor | Unidade | Período |
|---|---|---|---|
| `afirmacao-leitao-amaro-saude-oe2027-2026-10-09` | 3 | % | 2026-10-09 |
| `afirmacao-rtp-saude-queda-oe2027-2026-10-09` | 1,5 | % de queda | 2026-10-09 |
| `afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09` | 1 700 | milhões de euros | 2026-10-09 |
| `oe-2027-saude-despesa-total-consolidada-2026` | 18 125,9 | milhões de euros | 2026 |
| `oe-2027-saude-despesa-total-consolidada-2027` | 17 858,4 | milhões de euros | 2027 |
| `oe-2027-saude-despesa-total-consolidada-variacao` | −1,5 | % | 2027 |
| `oe-2027-saude-despesa-efetiva-consolidada-2026` | 18 062,4 | milhões de euros | 2026 |
| `oe-2027-saude-despesa-efetiva-consolidada-2027` | 17 803,1 | milhões de euros | 2027 |
| `oe-2027-saude-despesa-efetiva-consolidada-variacao` | −1,4 | % | 2027 |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026` | 17 291,3 | milhões de euros | 2026 |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027` | 17 803,1 | milhões de euros | 2027 |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao` | 3,0 | % | 2027 |
| `oe-2027-ppp-rodoviario-encargos-brutos-2027` | 1 152 | milhões de euros | 2027 |
| `oe-2027-ppp-rodoviario-receitas-2027` | 263 | milhões de euros | 2027 |
| `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | 889 | milhões de euros | 2027 |
| `oe-2027-ppp-total-encargos-liquidos-2027` | 1 438 | milhões de euros | 2027 |
| `oe-2027-cenario-pib-real-crescimento-2027` | 2,1 | % | 2027 |
| `oe-2027-cenario-ihpc-2026` | 2,9 | % | 2026 |

As três afirmações, lidas dos ficheiros:

- `afirmacao-leitao-amaro-saude-oe2027-2026-10-09`: RTP; «Leitão Amaro reitera que os portugueses "têm mais dinheiro no bolso" e apela à responsabilidade de PS e Chega»; Título e corpo da notícia; atribuição «António Leitão Amaro, ministro da Presidência»; data 2026-10-09; excerto «Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%».
- `afirmacao-rtp-saude-queda-oe2027-2026-10-09`: RTP; «OE2027. Verbas para a saúde com queda de 1,5%»; Título e corpo da notícia; atribuição «RTP»; data 2026-10-09; excerto «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.».
- `afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09`: PCP; «Governo, Chega e PS dançam o bailarico. Quem paga a conta são os trabalhadores!»; Intervenção na Assembleia da República; atribuição «Paulo Raimundo / PCP»; data 2026-10-09; excerto «Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias».

A comparação do item 2 foi refeita como números, retirando os espaços de milhares e interpretando a vírgula decimal. Os valores 1 152, 263, 889, 1 438 são todos diferentes de 1 700. As condições individuais estão em `partida.json`, campo `item_2.diferentes`. Esta condição não bloqueia o item.

**V2B-4, diferença medida:** a explicação tem as secções `por-funcao, por-ministerio, execucao, divida-e-saldo`. O §0 enumera só as três primeiras; existe também `divida-e-saldo`. Nenhuma linha citada pela explicação coincide com as linhas do V2-a. A porta temática continuaria a ser necessária, exatamente na secção `por-funcao` fixada pelo mandato. Não foi acrescentada enquanto os itens estão bloqueados.

## Verificações e entrega

- `npm run build`: passou na cabeça de partida; código 0; registo `portoes-partida/build.log`.
- `npm run verify`: passou na cabeça de partida; código 0; registo `portoes-partida/verify.log`.
- `npm run typecheck`: passou na cabeça de partida; código 0; registo `portoes-partida/typecheck.log`.
- `python3 -m core.gate`: passou na cabeça de partida; código 0; registo `portoes-partida/motor.log`.
- `RESEARCHHUB_DIR=<motor> npm run check:series`: passou com a origem; código 0; registo `series.log`.
- `RESEARCHHUB_DIR=<motor> npm run check:cruzamento -- --with-origin`: falhou na cabeça de partida; código 1; registo `cruzamento.log`.
- `medir-partida.py`: passou, incluindo as provas da recusa esperada; código 0; registo `medicao.log`.

**V2B-5:** o pedido dos portões de partida foi feito pelo escrivão, com o motor, numa pasta temporária, com a árvore limpa. Estava à espera da tranca de outra worktree quando se confirmou o bloqueio de origem. Tentou-se encerrar apenas esse processo em espera; a sandbox recusou `PermissionError: [Errno 1] Operation not permitted`. Não se pediu escalada nem se removeu a tranca de outra construção. O resultado efetivamente recebido consta da lista acima.

Os ficheiros do lançador foram afastados por mudança de nome, conservando o descritor aberto, e repostos no fim. `registos-lancador.json` compara o sha256 imediatamente antes e depois de cada mudança de nome. O registo pode crescer durante a corrida; não se afirma que o seu conteúdo ficou imóvel entre a saída e o regresso. Nenhum ficheiro `RELATORIO.*` entra no commit.

A medição pode repetir-se com `python3 design/especime-v3/medicoes/v2b-2026-10-12/medir-partida.py --motor <motor> --saida <temporario>/partida.json`. As duas provas da recusa não escrevem nos livros. `escrever-relatorio.py` gera este relatório a partir dos JSON guardados.

| Entrega do mandato | Estado |
|---|---|
| Nova afirmação do CFP e exportação | Bloqueadas pela V2B-1 |
| Três itens e sete partes em cada edição | Não construídos |
| Auditoria das palavras e cinco plantas dos itens | Não implementadas |
| Primeira página, rodapé e portas de integração | Não alterados |
| Capturas das páginas e manifesto | Não realizados, pois as páginas não existem |
| Prova dos toques no telefone | Não realizada |
| Portões na cabeça final de implementação | Não há cabeça de implementação |
| Leitura da direção e leitura a frio | Não lançadas |

Nenhuma parte obrigatória foi omitida numa página publicada, pois nenhuma página foi construída. As frases opcionais não foram selecionadas. Os bloqueios não foram contornados com conclusões, recomendações ou opiniões de substituição. Não houve publicação, push ou commit no motor. A entrega é este relatório de paragem e as medições, não a aceitação do V2-b.

tokens used: não disponível.
