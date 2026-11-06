# Adenda F ao mandato VOZ-1: o nome de cada linha do registo é o do seu recibo (05.11.2026)

Acrescenta: frases

*A mesma sessão e a mesma worktree, sobre d77b1ba41. A segunda leitura curta do Claude Opus 5.5 apanhou as cinco plantas e deu um achado real que o leitor vê, e dois menores na mesma linha do registo.*

## §0 Medido por este lugar (no `dist/` de d77b1ba41, por guião)

- Nas duas edições das correções, as linhas de `credito-malparado-2024` e `credito-malparado-2025` nomeiam a medida pelo título inglês do conjunto de dados da fonte (`document.title`, com `lang="en"` na edição portuguesa): 'Gross non-performing loans, domestic and foreign entities - % of gross loans, 2024'. O recibo de cada uma tem por título «Crédito malparado» / «Non-performing loans», que é o que o registo imprimia antes da VOZ-1 E.
- A linha de `evora-prr-vencido-aprovado-2026` repete a data, nas duas edições: o nome já acaba em «no instantâneo de 19.08.2026», e a forma acrescenta «, 19.08.2026».
- A isenção dos títulos copiados no `gate-html` cobre o `[data-correcao-titulo]` inteiro, incluindo as palavras da casa que o compõem (« na União Europeia», a vírgula, o período).
- Os títulos dos recibos, lidos nos dois `dist/`: «Dívida das famílias» / «Household debt» também na linha da União, e «Dívida pública» / «Government debt».

## §1 O que fazes

1. Cada linha das revisões de proveniência nomeia a sua linha pelo título que o recibo dessa linha imprime, na edição da página; depois «na União Europeia» / «in the European Union» quando a linha é a comparação da União de um cartão (`contextoDaRevisao`), como hoje; depois «, ⟦período⟧», salvo quando o título já imprime esse período.
2. A régua do registo confere cada linha contra o título do recibo da sua linha, e não contra a mesma composição que a vista usa; plantas: um título que não é o do recibo, e um período repetido.
3. A isenção dos títulos copiados cobre só o título copiado, e não as palavras da casa à volta dele.
4. Medes por guião, depois, nas duas edições: as linhas repetidas em cada lista (zero), as linhas cujo nome difere do título do seu recibo (zero) e as linhas com o período repetido (zero).

## §2 Quando paras

Se o título do recibo de alguma linha não a distinguir de outra mesmo com a União e o período (diz quais).

## §3 O fim

O `build` inteiro verde; `check:registo`, `check:voz`, `check:discussao`, `gate:html` e `tests/voz/agenda-voz1.mjs`, com os códigos e as plantas; as três medidas do §1.4; a lista das revisões copiada do `dist/` nas duas edições, no relatório. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `VOZ-1 F`. Vinte e cinco minutos, trinta chamadas.
