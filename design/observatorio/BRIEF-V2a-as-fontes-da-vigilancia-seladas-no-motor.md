# Brief V2-a · as fontes da vigilância seladas no motor: o Orçamento do Estado para 2027 (os quadros da Saúde e das parcerias rodoviárias), três afirmações públicas como foram ditas, e o parecer do Conselho das Finanças Públicas (12.10.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 12.10.2026, pela §1.181 de `DECISIONS.md` (o projeto vigia o país e age sobre o que encontra; a regra 5 na forma da afirmação) e pela secção 8 da carta dos conteúdos, a partir do varrimento à mão do Codex de 11.10.2026 (o memorando `VARRIMENTO-2026-10-11.md`, as fichas 1, 2, 3 e 6, na pasta da sessão de 11.10, fora do repositório; a cópia entra neste bloco em `design/observatorio/VARRIMENTO-2026-10-11.md` com os caminhos da máquina substituídos). O construtor é o Codex `gpt-6-astra` em `high`, no motor e no sítio; a leitura a frio é do Claude Opus 5.5 em `xhigh`, com cinco estragos plantados, porque o bloco toca fontes. Um bloco, uma mudança: as fontes de três itens do painel seladas no motor e exportadas para o livro-razão, sem página nova (a página é o V2-b). Sem travessões na prosa.*

## 0 · O que se mede antes de construir

Na cabeça que o guião das medições lê (`design/observatorio/medidas/BRIEF-V2a.py`, com o JSON ao lado), o livro-razão tem 3 211 linhas (`linhas_do_livro_na_partida`) e 0 delas citam o Orçamento do Estado para 2027 (`linhas_que_citam_o_oe2027_na_partida`): o bloco acrescenta as suas linhas sem tocar nas outras, e o relatório repete as duas contagens na cabeça final. Na worktree do motor, antes de tocar em nada: `python3 -m core.gate` na cabeça de partida, com o código de saída guardado em `portoes/inicial.codigo` na pasta das medições do bloco, que tem de ser zero e que o relatório cita; o que o cliente da casa (`core/http.py`, `HttpClient`) e o circuito de selagem do JD1 (`publisher/jd1.py`, `publisher/jd1_recortes.py`, `publisher/manifest.jd1.json`) e da RP4-n (`publisher/definition_sources.py`, `publisher/recortes/rp4n-origens.json`) já fazem, para este bloco reutilizar o mesmo caminho (alojar, selar a célula ou o excerto com a página, gerar a linha, exportar pelo `export_site_rows.py` com o registo do cruzamento) e não abrir outro; as decisões em vigor sobre os ficheiros que o bloco toca (`python3 scripts/leituras/decisoes-em-vigor.py` do sítio). No sítio: `npm run ledger:check` na cabeça de partida, com o código guardado em ficheiro, que tem de ser zero; o `README.md` do livro (os campos de uma linha, em especial `attributed_to`, `document`, `excerpt`, `source_flag`). Os números do §0 escrevem-se no relatório por guião.

## 1 · O que o bloco é

Os números e as afirmações de três itens do painel, lidos na fonte e selados pelo motor, como linhas do livro-razão nas duas edições, cada uma com o documento alojado pelo cliente da casa (o pedido, a resposta, a data, o sha256), a página ou o caminho, o excerto literal e, nas afirmações, a quem o documento atribui as palavras. **Os números do memorando do varrimento são a expectativa a conferir, nunca o valor: o valor é o que o documento alojado imprime (a regra 1).** Se um documento não imprimir o que o memorando diz, a linha diz o que o documento imprime, e o relatório regista a diferença.

### 1.1 · O relatório do Orçamento do Estado para 2027

A Proposta de Lei n.º 110/XVII/2.ª, entregue a 08.10.2026 (a página da iniciativa em parlamento.pt, `https://www.parlamento.pt/ActividadeParlamentar/Paginas/DetalheIniciativa.aspx?BID=377352`, alojada como prova da entrega e da data), e o relatório do Orçamento, o PDF ligado nessa página pela ligação «Relatório» (o endereço longo de `app.parlamento.pt/webutils/docs/doc.pdf?…&fich=9f7df920-f4f9-4d0e-a884-df3cde4db960.pdf`; o construtor lê a ligação na página alojada e não a copia do memorando), alojado inteiro com o recibo.

As linhas, uma família `oe-2027-saude` e uma família `oe-2027-ppp`, com os valores lidos nas células do PDF (o quadro 5.37, programa Saúde, na página impressa 287, a 303 do ficheiro; o quadro 4.25, as parcerias público-privadas, na página impressa 107, a 123 do ficheiro), em milhões de euros, o ano e a coluna como o quadro os imprime (a estimativa de 2026, o orçamento de 2027, a variação publicada):

| linha | o que o quadro imprime, segundo o memorando (a conferir no PDF) |
|---|---|
| `oe-2027-saude-despesa-total-consolidada-2026` | 18 125,9 (estimativa 2026) |
| `oe-2027-saude-despesa-total-consolidada-2027` | 17 858,4 (orçamento 2027) |
| `oe-2027-saude-despesa-total-consolidada-variacao` | −1,5 % (a variação publicada pelo quadro) |
| `oe-2027-saude-despesa-efetiva-consolidada-2026` | 18 062,4 |
| `oe-2027-saude-despesa-efetiva-consolidada-2027` | 17 803,1 |
| `oe-2027-saude-despesa-efetiva-consolidada-variacao` | −1,4 % |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026` | 17 291,3 |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027` | 17 803,1 |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao` | 3,0 % |
| `oe-2027-ppp-rodoviario-encargos-brutos-2027` | 1 152 |
| `oe-2027-ppp-rodoviario-receitas-2027` | 263 |
| `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | 889 |
| `oe-2027-ppp-total-encargos-liquidos-2027` | 1 438 |

As variações entram como a fonte as publica (não se calculam); a nota do quadro 4.25 sobre valores de caixa e preços constantes de 2027 entra no excerto ou na nota da linha, como a fonte a escreve. O nome de cada medida é o do quadro (a regra 2), com o perímetro no nome («programa Saúde», «despesa efetiva consolidada», «sem PRR», «setor rodoviário», «encargos líquidos»). As frases «o que é» apoiam-se nas palavras do relatório ou dizem a ausência exata, pela K17.

### 1.2 · As três afirmações, como foram ditas

Linhas de uma família nova, `afirmacao`, uma por afirmação, com o valor que a afirmação diz, a unidade, a data, a fonte (quem publica), o documento alojado (a página, com o sha256), o excerto literal com as palavras exatas e `attributed_to` com o nome e o cargo como o documento os escreve:

1. **`afirmacao-leitao-amaro-saude-oe2027-2026-10-09`**: o valor 3 (%), as palavras «Se retirarmos isso, o orçamento da Saúde sobre 3%» (a grafia da transcrição; «isso» é o PRR, e o excerto leva a frase anterior que o diz, se a página a tiver), atribuídas a António Leitão Amaro, ministro da Presidência, na entrevista publicada pela RTP a 09.10.2026 (`https://www.rtp.pt/noticias/politica/leitao-amaro-reitera-que-os-portugueses-tem-mais-dinheiro-no-bolso-e-apela-a-responsabilidade-de-ps-e-chega_n1770773`).
2. **`afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09`**: o valor 1 700 (milhões de euros), as palavras «Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», atribuídas a Paulo Raimundo na intervenção na Assembleia da República a 09.10.2026, pela transcrição publicada pelo PCP (`https://www.pcp.pt/governo-chega-ps-dancam-bailarico-quem-paga-conta-sao-trabalhadores`; o cargo como a página o escreve, ou sem cargo se a página não o escrever). **Se o Diário da Assembleia da República da sessão de 09.10.2026 estiver publicado quando o bloco correr** (o guião do V1 lê a I Série; a página `https://www.parlamento.pt/DAR/Paginas/DAR1Serie.aspx`), a fonte primária passa a ser o DAR (alojado, com a página e o excerto) e a transcrição do partido fica como segunda fonte declarada na linha; se não estiver, a linha diz que a fonte é a transcrição do partido e o relatório regista que o DAR fica por alojar.
3. **`afirmacao-rtp-saude-queda-oe2027-2026-10-09`**: o valor −1,5 (%), o título «OE2027. Verbas para a saúde com queda de 1,5%» e a frase da notícia que diz de que medida fala, atribuídos à RTP (a notícia de 09.10.2026, `https://www.rtp.pt/noticias/economia/oe2027-verbas-para-a-saude-com-queda-de-15_v1770667`).

Os termos de cada sítio conferem-se antes de alojar (o `robots.txt` e os termos, registados no registo de fontes, como o V1 faz): a RTP e o PCP foram lidos pelo varrimento de 11.10 com o agente da casa, sem recusa; o que um sítio não permitir alojar não se aloja, e a linha diz a ausência com a razão.

### 1.3 · O parecer do Conselho das Finanças Públicas

O Parecer n.º 05/2026 do CFP, «Previsões macroeconómicas subjacentes à Proposta de Orçamento do Estado para 2027», datado de 07.10.2026 (`https://www.cfp.pt/uploads/publicacoes_ficheiros/cfp-parecer-05-2026.pdf`, com a página da publicação alojada), alojado inteiro. As linhas: `oe-2027-cenario-pib-real-crescimento-2027` (a taxa de crescimento real do PIB prevista pelo Governo para 2027, que o memorando dá como 2,1 %, lida no quadro do parecer, páginas 19 e 20 do PDF, ou no relatório do Orçamento, o que a imprimir como previsão; a linha diz qual) e `oe-2027-cenario-ihpc-2026` (2,9 % para 2026, lida do mesmo lugar); e uma linha `afirmacao-cfp-riscos-oe2027-2026-10-07` com as palavras do parecer sobre os riscos («os riscos para o crescimento real apresentam um pendor descendente», com a página), atribuídas ao Conselho das Finanças Públicas, sem valor numérico se o parecer não o der na frase (o campo do valor diz a ausência como o livro permitir; se o livro não permitir uma linha sem valor, a frase sela-se como excerto da linha do crescimento, e o relatório di-lo).

## 2 · As regras do bloco

- **Lê-se na fonte e sela-se o que ela imprime** (a regra 1): nenhum valor do memorando entra sem ser lido na célula ou na frase do documento alojado; a diferença, se houver, fica no relatório e a linha fica com o documento.
- **A afirmação como foi dita** (a regra 5, a segunda forma): as palavras exatas, a pessoa ou a entidade com o nome e o cargo como o documento os escreve, a data, o documento a um toque, e nenhum adjetivo; nada sobre a vida privada de ninguém. O juízo (a comparação com as fontes, a conclusão, a opinião) é do V2-b, na página, e não entra nas linhas.
- **O formato das afirmações no livro.** O `README.md` do livro diz hoje que `attributed_to` é uma lista de entidades, que nenhuma linha credita um partido (§1.31) e que a frase do partido volta quando o formato souber marcá-lo (§1.44); a §1.181 (07.10.2026) abriu a segunda forma da regra 5, a afirmação de uma pessoa ou de um partido como foi dita. O bloco dá ao livro essa forma: a família `afirmacao` leva o campo `afirmacao: true`, `attributed_to` com o nome e o cargo como o documento os escreve (por exemplo `["António Leitão Amaro, ministro da Presidência"]`, `["Paulo Raimundo"]`, `["Conselho das Finanças Públicas"]`; o partido entra na lista quando é o documento do partido que publica as palavras, por exemplo `["Paulo Raimundo", "PCP"]`), o validador exige nessas linhas o `attributed_to` não vazio, o `excerpt` com as palavras exatas e o valor dentro delas, `document.kind` em `html` ou `pdf` e a data; a nota da página continua a ser «Como consta do documento.»; o `README.md` ganha a secção da família com a data e a referência à §1.181, e as frases das §1.31 e §1.44 ganham a nota de que, desde esta entrada, uma linha de afirmação credita quem a disse como o documento o escreve, como registo do que consta, nunca como juízo nem ordenação (nenhuma tabela por partido, como o Método diz).
- **A célula das afirmações** (uma K nova, no `ledger:check` ou ao lado): para cada linha da família `afirmacao`, o excerto é literal no corpo alojado (pelo sha256 e pela procura das palavras), o `attributed_to` existe, a data é a do documento, a porta (`source_url`) é a do pedido registado, e o valor da linha aparece no excerto; cinco plantas, cada uma a afirmar a mensagem pela qual falha: o excerto alterado, a atribuição trocada, a data errada, a porta trocada, um valor que não está no excerto.
- **Os quadros**: o valor de cada célula lê-se pela extração de texto com a posição da coluna e da linha (como o JD1 faz com os quadros do IGCP), com o recorte da página guardado em `publisher/recortes/` e o sha256 no manifesto, e o recibo liga ao recorte; uma planta troca a coluna e outra a linha do quadro.
- **Os ficheiros de outras corridas não se tocam** (a regra 11); o pre-commit do motor corre `python3 -m core.gate`.
- **A língua**: as frases «o que é» nas duas edições, com as palavras da fonte (a K17); o inventário das frases com as cadeias novas; sem travessões.

## 3 · A entrega e as medidas de aceitação

1. No motor: os documentos alojados (a página da iniciativa, o relatório do Orçamento, as três páginas das afirmações, o parecer do CFP e a sua página), cada um com o recibo do pedido e o sha256; as linhas geradas e exportadas; o `python3 -m core.gate` a 0 na cabeça do código.
2. No sítio: as linhas em `ledger/claims/` (as treze do Orçamento, as duas ou três do cenário, as quatro afirmações), com os recibos a render nas duas edições; `npm run ledger:check`, `check:cruzamento --with-origin` com o motor ao lado e os três portões inteiros a 0 na cabeça do código, pela tranca; a célula das afirmações com as cinco plantas a morder, mais as duas dos quadros.
3. As capturas dos recibos da despesa total da Saúde de 2027, dos encargos líquidos rodoviários e da afirmação do PCP, nas duas edições, a 390 e a 1 280 px, na cabeça final.
4. O relatório `design/especime-v3/medicoes/v2a-2026-10-12/LEIA-ME.md` com os números por guião (as linhas, os documentos, os sha256, as diferenças contra o memorando), o custo pela linha «tokens used» e as questões `V2A-1`, `V2A-2`, e assim por diante; a cópia do memorando do varrimento em `design/observatorio/VARRIMENTO-2026-10-11.md`.

O que não está no bloco: a página do painel e os textos dos itens (o V2-b, pelo lugar de direção); as afirmações do PS sobre as cirurgias (a janela e o universo por fechar na fonte; fica para depois da produção do SNS selada); os 200 milhões do PRR (a resolução por publicar no Diário da República); a inflação e o desemprego de setembro e de agosto (as séries do corredor já os trazem, ou trazem na próxima corrida).

## 4 · O custo

O custo-alvo é de trezentos mil símbolos (§1.177), em `high`; se o passar, o relatório di-lo e diz porquê. A leitura a frio pelo Opus em `xhigh`, com os corpos alojados no pacote (M65).
