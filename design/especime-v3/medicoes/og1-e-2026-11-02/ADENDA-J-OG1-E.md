# Adenda J ao mandato OG1-E: as frases retiradas continuam a morder com a extração nova, e a recusa da entrada antiga provada pela voz verdadeira (03.11.2026)

Acrescenta: nada

*A sessão da OG1-E, as mesmas worktrees (o sítio `og1e-2026-11-02`, por cima de 875c35298; o motor `og1e-2026-11-02`, ccc647c). Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta da adenda I. A tua mudança da extração da voz é certa para as frases vivas e enfraqueceu, sem querer, uma régua sobre a definição de uma fonte: pela regra 4, corrige-se antes de aterrar. Uma só passagem (a M99). Nenhuma frase do leitor muda.*

## §0 Medido (03.11.2026, por este lugar, no código da cabeça)

- `scripts/voz-edicoes.mjs`, `textoDaVoz` (perto das linhas 43 e 49): junta o texto de um elemento com marca de língua aos vizinhos sem espaço, sempre que um dos vizinhos é uma marca, sem olhar ao que está entre eles. Desde a I, as duas extrações de `scripts/medir-defeitos.mjs` passam por ela (perto das linhas 943 e 965).
- `scripts/titulos-publicados.mjs:10`, `fraseRetiradaNoTexto`: a comparação de uma frase retirada é exata (a frase escapada, com fronteiras de palavra), sem normalizar espaços; `ondeVolta`, em `medir-defeitos.mjs`, também.
- `design/especime-v3/INVENTARIO-FRASES.md:3900`: a definição retirada da DGAL, «The council’s debt that counts towards the legal limit at year end (DGAL’s “ dívida total ”, without non-budget debts and the exceptions in the law).», guarda os espaços que a extração antiga juntava às aspas à volta do termo marcado. Com a extração nova, uma página que voltasse a essa definição extrai «“dívida total”» e a retirada deixa de a apanhar. A leitura contou-a como a única linha retirada com um espaço dentro das aspas, em 1 238; confirma-o por guião sobre todas as retiradas.
- `tests/edicoes/voz.mjs` (perto das linhas 40 a 46): a planta da entrada antiga chama o predicado com as duas cadeias normalizadas do mesmo inventário, e a linha «código 1» é escrita, não lida.

## §1 As retiradas mordem com a extração nova

A comparação de uma frase retirada aplica às duas partes a mesma normalização dos espaços junto das aspas e das marcas de língua, em `fraseRetiradaNoTexto` e em `ondeVolta`, de modo que nenhuma retirada que mordia antes da I deixe de morder. Nenhuma retirada sai da lista; uma forma acrescentada a uma retirada só a alarga. Prova por guião: cada uma das 1 238 linhas retiradas, posta numa cópia de uma página na forma que a extração antiga lia e na que a nova lê, é recusada pela voz nas duas; o relatório dá a contagem. Planta: uma cópia da página da dívida de um concelho com a definição retirada da DGAL é recusada pelo `check:voz`, com o código lido.

## §2 A extração não junta palavras através de blocos

`textoDaVoz` só tira o espaço entre vizinhos dentro do mesmo bloco (texto em linha); entre elementos de bloco (`p`, `li`, `div`, `td`, `dd`, `dt`, `h1` a `h6`, `section`, `article`, `figcaption`, `summary`) o separador fica. Plantas: `<li><span lang="pt-PT">X</span></li><li>Y</li>` extrai «X Y»; o caso em linha da I continua a dar o texto publicado.

## §3 A recusa da entrada antiga provada pela voz verdadeira

A planta da entrada antiga corre a voz verdadeira (o caminho de `check:voz`, por `medir-defeitos.mjs`) sobre uma cópia do `dist/` com a entrada antiga da habitação em `/correcoes/` e em `/en/corrections/`, e lê o código de saída (1); o controlo com as páginas atuais lê 0. O registo imprime os códigos lidos, nunca uma cadeia escrita.

## §4 O fim

Os commits por secção; o `build` inteiro pelo escrivão, verde, com `check:voz`, `check:registo`, `check:lingua` e o `typecheck`. Trinta minutos, cinquenta chamadas. Paras e dizes: se uma retirada deixar de morder em alguma das duas formas; se fechar o §1 pedir que uma régua que protege um número, uma fonte ou uma pessoa enfraqueça.
