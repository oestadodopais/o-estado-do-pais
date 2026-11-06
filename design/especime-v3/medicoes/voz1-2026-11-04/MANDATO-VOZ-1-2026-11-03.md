# Mandato VOZ-1: as páginas do leitor deixam de falar de si próprias (03.11.2026)

Acrescenta: frases

*Escrito pelo lugar de direção (Claude Opus 5.5, pela palavra do financiador de 02.11.2026). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, na worktree `lote4-2026-11-04`, por cima da PAI2. Só o sítio. O financiador, como leitor, a 03.11.2026: as frases sobre o que o projeto não faz e sobre o que uma coisa não é "feels like we are apologising for nothing"; e, às 22:06 UTC, com a captura da secção "O que isto não diz" da explicação do Orçamento de 2027: "why do we still have this kind of content". A Emenda 15 (21.08.2026) já o proíbe; nenhuma régua o media.*

## §0 Medido (03.11.2026, por este lugar, no `dist/` da EV3 e nas fontes da cabeça do lote 4)

- Nas páginas do leitor em português, fora do livro-razão, do Método e do Sobre: 216 formas e 387 ocorrências de frases em que o sítio, a página ou a peça falam de si (304 nos documentos dos estudos, que são da VOZ-2). Fora dos estudos, a classe está em quatro sítios:
  - as duas explicações do dinheiro do Estado (`src/data/explicacoes/dinheiro-do-estado-2026.mjs` e `-2027.mjs`, a secção `naoDiz` e uma frase da de 2026), com o título comum "O que isto não diz" (`oQueIstoNaoDiz` em `src/i18n/strings.mjs`);
  - a leitura da semana na primeira página (`umaRevisao`, `variasRevisoes`, `revisoesK`, "que aqui ainda têm o valor anterior");
  - a agenda (`src/data/agenda.json`, cópia do motor `agenda/agenda.json`) e o calendário das fontes (`src/data/calendario.json`, cópia do motor `indicators/calendar.json`, ficheiro de outras corridas que não se toca: a regra 11), com as notas da maquinaria ("a direção ainda não leu a pergunta", "este parágrafo está aqui para que o leitor…", "a comparação com ela não é feita aqui", "ersar.pt não respondeu hoje", as menções a `curl` e `WebFetch`);
  - o registo das correções: cada entrada acaba num identificador ("Afirmação: correcoes-publicadas").
- O marcador "[a verificar]" com a sua definição ("um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado", `definicao` em `src/i18n/strings.mjs`) imprime-se em 18 páginas portuguesas e nas inglesas correspondentes, contra a regra 1.
- As três classes que se tratam: a defesa de si próprio sai; o que uma fonte não publica fica, dito como facto da fonte; a definição de uma fonte fica.

## §1 As frases (pt e en; os tokens ficam como estão no ficheiro)

1. **O título da secção das duas explicações** (`oQueIstoNaoDiz`):
   - pt «Como ler estes números»
   - en «How to read these figures»
2. **A secção da explicação de 2027** (`naoDiz`, pela ordem de hoje e com as mesmas condições e os mesmos tokens):
   - pt «É o mapa de uma proposta: o que o Parlamento aprovar pode ser diferente, e o que se gasta de facto lê-se depois, na execução.»
   - pt « O mapa cobre só o subsetor da Administração Central; a Segurança Social, com as pensões, não está nele.»
   - pt (a condição de hoje) « Os valores não são consolidados, porque contam as transferências entre serviços, e por isso a despesa total do mapa é maior do que a despesa total consolidada, ⟦CONS27⟧ em ⟦periodo CONS27⟧.»
   - pt « A conta sem as operações relacionadas com a dívida pública calcula-se a partir do mapa, que só dá o nome a essa subfunção, sem dizer o que entra nela. A despesa efetiva consolidada por função dos dados abertos, a base da leitura de ⟦BASE_DE_2026⟧, ainda não está publicada para ⟦F27('01')⟧.»
   - en de cada frase, com o mesmo sentido e os mesmos tokens (escreves-las tu a partir destas; este lugar lê-as no `dist/` antes da leitura a frio).
3. **A secção da explicação de 2026** (`naoDiz`):
   - pt (a condição de hoje) «O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês, e a execução até agosto está acima.»
   - as outras duas frases ficam como estão (dizem a medida e onde está o detalhe).
   - en da primeira, com o mesmo sentido.
4. **A frase da explicação de 2026** "Esta página mostra as duas medidas, cada uma com a sua definição, e não as soma nem corrige nenhuma." sai, nas duas edições; a frase antes dela já diz que as duas percentagens não medem a mesma despesa.
5. **A leitura da semana:**
   - pt `umaRevisao` « deles, ainda com o valor de antes da revisão»; `variasRevisoes` « deles, ainda com o valor de antes da revisão»; `revisoesK` «Os números que a fonte reviu, ainda com o valor de antes da revisão»
   - en `umaRevisao` « of them, still showing the value from before the revision»; `variasRevisoes` « of them, still showing the value from before the revision»; `revisoesK` «The numbers the source revised, still showing the value from before the revision»
6. **O marcador:** "[a verificar]" e a sua definição saem de todas as páginas; o campo que falta diz a ausência exata:
   - pt «por confirmar na fonte»
   - en «to be confirmed at the source»
   A régua que o marcador protege (a marca a tracejado do selo, a página fora dos motores de busca até o recibo estar completo) muda de forma e continua a morder, com planta. A página `/a-verificar/` (e a inglesa) deixa de existir, com redireção para o Método. Medes as páginas que o imprimem antes e depois (zero depois).

## §2 A agenda, o calendário e o registo: o que a página mostra

1. **O calendário das fontes:** cada acontecimento mostra o que é, quem o publica, quando (a data anunciada, ou pt "sem data anunciada", en "no announced date") e as páginas do sítio que atualiza. As notas de como a data se observou, a evidência indireta e o estado das leituras deixam de se imprimir; ficam nos dados.
2. **A agenda:** cada item mostra o título, a pergunta, o estado em duas palavras e a data. O critério, o proponente, a decisão e o histórico deixam de se imprimir; ficam nos dados e no repositório, que é público.
3. **O registo das correções:** o identificador no fim de cada entrada ("Afirmação: …") deixa de se imprimir; a porta "linha" de cada entrada continua a levar ao recibo, e o identificador fica nos atributos de que as réguas precisam.
4. Nada disto toca os ficheiros do motor; a cópia de `agenda.json` e de `calendario.json` fica igual à do motor.

## §3 A prevenção, por guião, no que há e no que vier

1. **No mandato:** o `scripts/leituras/voz-do-mandato.py` (e a tabela `design/especime-v3/VOZ-MARCADORES.md`) ganha os marcadores da negação sobre o próprio sítio ou a própria peça: o sítio, a página, a peça, a explicação, o estudo, o projeto ou "aqui" como sujeito de uma negação ou da narração do que se fez. Planta: uma frase do leitor com "Esta explicação não diz…" faz o pré-mandato falhar.
2. **No `build`:** a régua da voz conta essa classe em todas as páginas do leitor, fora do Método, do Sobre, dos recibos e da Privacidade, e falha com uma frase que seja. A lista das ledes logo a seguir ao `<h1>` é fechada (as que hoje dizem o que a página é); uma lede nova falha até entrar na lista. Plantas: a frase da explicação de 2026 reposta dá vermelho; a lede "Corrigir em silêncio é a forma mais barata de mentir." reposta dá vermelho.
3. **Na leitura a frio:** o `scripts/leituras/PROMPT-comum.md` ganha uma pergunta fixa: há alguma frase em que o sítio ou a peça falam de si, do que não fazem ou do que não são? Um achado sobre o que uma frase dá a entender corrige-se reescrevendo a frase, nunca acrescentando uma ressalva.
4. Os documentos dos estudos ficam fora desta régua até à VOZ-2, por uma isenção nomeada e datada, que a VOZ-2 tira.

## §4 Quando paras

- Se uma frase do §1 não puder ficar como está escrita (diz qual e porquê).
- Se a régua do marcador tiver de enfraquecer.
- Se uma página de leitor só puder cumprir a régua nova perdendo um facto sobre uma fonte (diz qual).

## §5 O fim

- O `build` inteiro verde.
- As conferências que a mudança toca, com os códigos, e as plantas do §1.6 e do §3.
- As medidas de antes e de depois: as páginas com "[a verificar]", as frases da classe por página, e as ledes.
- As frases do §1 copiadas do `dist/` nas duas edições, no relatório.
- Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`.
- Setenta minutos, cento e dez chamadas.
