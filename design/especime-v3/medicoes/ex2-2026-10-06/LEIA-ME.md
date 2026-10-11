# EX2 · a leitura da semana diz o que cada número é

A leitura da semana abre com os números que mudaram de valor. O índice usa a mesma gramática: nome da medida, período, unidade antes dos dois pontos, os dois valores, a revisão da fonte e a data. A definição aparece uma vez no fim de cada grupo de linhas consecutivas da mesma medida, seguida pelos sinais que os seus recibos tenham. Nenhuma definição nem sinal foi escrito nesta passagem: vêm de `oQueEDaLinha`, e a W4 compara-os com os recibos construídos da mesma edição. A ausência por confirmar continua explícita.

A cabeça do código é `8c3a08b9dcfb48595be70d6d47385b0427cc3b62`. A base da primeira construção é `d1becbf8f167643ca8d53a4479f8f6bbee0f7183`. Construtor: Codex, identificação pedida no mandato e nos trailers. Não foi observada uma linha «tokens used» nesta sessão; o custo fica por apurar no registo do lançador. A leitura a frio recebida está em [LEITURA-EX2](../../critica/LEITURA-EX2-2026-10-06.md). Falta a leitura curta do diff e a conferência da direção antes de aterrar. Não houve publicação.

## Medidas e decisão da unidade

O comando `node design/especime-v3/medicoes/ex2-2026-10-06/medir-base.mjs` produziu [base.json](base.json): 3195 linhas no livro, 3184 no âmbito, 41 unidades, 25 começadas por palavra. A construção final tem a janela 2026-09-30 a 2026-10-06, 9 mudanças e 0 ausências por confirmar. Há 6 definições na semana portuguesa, uma por grupo; as contagens de cada página estão em [entrega-b.json](entrega-b.json).

**A unidade antes dos dois pontos é a decisão da direção, confirmada pelo mandato desta passagem.** O ensaio `node design/especime-v3/medicoes/ex2-2026-10-06/medir-unidades.mjs`, em [unidades.json](unidades.json), não decidiu pela geometria: empatou. Cada forma teve 164 amostras, a 390 e 1280 px, nas duas edições. A forma antes dos valores teve 0 transbordos e 183 linhas; a forma entre parênteses teve 0 transbordos e 183 linhas. O desempate usou a contagem de unidades por edição com parênteses aninhados: 0 contra 10. Contadas as amostras em ambas as larguras, são 0 contra 20. Essa distinção está em [passagem-b.json](passagem-b.json), produzida por `node design/especime-v3/medicoes/ex2-2026-10-06/medir-passagem-b.mjs`.

O ensaio mede apenas unidade e valores. Não inclui o período. A adjacência do período com o ano de base dos volumes encadeados fica como limite para o bloco dos recibos, juntamente com as referências para dizer se um valor é alto ou baixo. As capturas conferem a frase inteira construída.

A régua das frases compostas leu 12 páginas em 24 passagens e encontrou 0 falhas. As capturas finais têm 40 ficheiros, página inteira e recorte, com 0 transbordos. As anteriores conservam o sufixo `-antes` e o [manifesto próprio](capturas-antes.json). Comandos: `node tests/explicacoes/frases-compostas.mjs --json design/especime-v3/medicoes/ex2-2026-10-06/frases-compostas-b.json` e `node design/especime-v3/medicoes/ex2-2026-10-06/captar-ex2.mjs`. Fontes: [régua](frases-compostas-b.json), [capturas](capturas-b.json).

O guião da entrega encontrou 0 alterações no livro, nas declarações de dados e no recibo. O teto da L1 não mudou. Saiu apenas a dispensa das antigas portas dos marcadores de título, que já não são obrigatórias.

## A passagem EX2-b

As decisões e a ligação entre cada achado e as plantas estão em [passagem-b.json](passagem-b.json).

- **Achados 1, 2, 7, 8, 9.** Eram estragos nas cópias da direção; não se corrigiu o ramo por eles.
- **Achados 3.** O índice escreve a unidade antes dos dois pontos e a revisão pelos mesmos componente e cadeias da semana. A W confere o resumo contra o livro. A M3 deixa de exigir o valor anterior riscado e conserva a conferência da identidade, da entrada, dos valores e da data. Plantas: «a unidade colada ao número»; «valor anterior errado no índice».
- **Achados 4, 5.** A palavra do lado diz «a fonte reviu para cima» ou «a fonte reviu para baixo», com as gémeas inglesas. O nome vem de nomeNaSemana nas duas páginas e é o mesmo nos anos da mesma medida. Uma definição por grupo, sob a última linha, é comparada com todos os recibos desse grupo. Os sinais dos recibos acompanham a definição, sem repetição. A semana abre com os valores e fecha com as contagens; conserva a secção da forma e a frase de nenhuma mudança de ramo na primeira página. Plantas: «a palavra da revisão trocada»; «o nome da fonte em vez»; «a definição repetida no grupo»; «a definição em falta no grupo»; «uma palavra trocada no sinal»; «o sinal em falta no grupo»; «as contagens à cabeça»; «a frase de nenhuma mudança».
- **Achados 6.** O título conserva o nome publicado do documento; a falta de tradução deixa de produzir a marca. O título português leva lang="pt" na edição inglesa. A A4 recusa a marca, confere o nome e a língua; a L1 deixa de dispensar a antiga porta. Plantas: «marca de incerteza num título»; «título publicado com palavras trocadas»; «título português sem língua».
- **Achados 10.** A W2 compõe o nome de nomeNaSemana e o qualificador dos dados da linha, sem ler nenhum deles da página. Plantas: «o qualificador da União Europeia retirado»; «o nome da fonte em vez».
- **Achados 11.** A entrada do resumo declarado tem de estar diretamente dentro da lista de mudanças que a W confere. Plantas: «um resumo declarado fora da lista».
- **Achados 12.** A geometria empatou. A contagem dos parênteses aninhados apoiou o desempate, mas a unidade antes dos dois pontos é uma decisão da direção confirmada neste mandato. O ensaio curto não inclui o período; a adjacência do ano com o ano de base fica como limite para os recibos.
- **Achados 13.** As alterações ao brief pertencem à direção, posteriores à primeira entrega. Nenhuma alteração nesta passagem.
- **Achados 14.** O relatório inteiro, incluindo as questões abertas e esta secção, é saída do escrever-relatorio.mjs. A conferência regenera-o e compara os bytes.
- **Achados 15.** As células do selo da definição e dos seus pedaços marcados são vazias nesta construção: as definições não têm algarismos nem esses pedaços. As plantas sintéticas continuam a testar os auxiliares; não são prova de auditaSelo sobre uma definição real com valor.
- **Achados 16.** O manifesto das plantas do construtor foi retirado do repositório. As plantas de leitura a frio pertencem à direção, nas cópias do pacote; esta passagem não constrói nem commita esse manifesto.

A medição antes da mudança, `node design/especime-v3/medicoes/ex2-2026-10-06/medir-titulos-b.mjs`, está em [titulos-antes-b.json](titulos-antes-b.json). O componente lia `titleUnverified` nas edições inglesas dos estudos da água e acrescentava o marcador. As edições portuguesas não tinham essa declaração. A língua do texto já era reconhecida como portuguesa. A falta de tradução não é incerteza sobre o nome publicado.

A cadeia de nenhuma mudança na primeira página já existia desde o EX1: `c6558836f045b3fbb723ff694639f738ca886adc EX1: as explicações e a leitura da semana (as três rotas, a primeira explicação com o texto do §5 do brief, a leitura gerada do registo das correções, o bloco «Para perceber» da primeira página e a secção do índice)`. O texto efetivamente mostrado nas duas edições consta de [passagem-b.json](passagem-b.json).

As células do selo da definição e dos pedaços marcados são vazias nesta construção: 0 definições com algarismos e 0 pedaços marcados, entre 22 definições. As plantas sintéticas dos auxiliares não provam `auditaSelo` numa definição real com valor. Este limite fica declarado, sem aumentar a prova que existe.

## Plantas e mensagens

As plantas estragam cópias em memória ou o navegador. Exigem o controlo intacto e a mensagem da célula que julga a página. Os ficheiros completos são [semana-b.json](semana-b.json), [frases-compostas-b.json](frases-compostas-b.json) e [titulos-plantas-b.json](titulos-plantas-b.json). Comandos: `node tests/explicacoes/semana.mjs --prova --json design/especime-v3/medicoes/ex2-2026-10-06/semana-b.json`, a régua visual indicada acima e `node tests/pais/pais.mjs --json design/especime-v3/medicoes/ex2-2026-10-06/titulos-plantas-b.json`. A antiga dispensa do marcador de título também foi testada por `OEDP_MEDICOES=design/especime-v3/medicoes/ex2-2026-10-06 node tests/pais/portoes.mjs --only lugar-marcador-de-titulo`, em [plantas-portoes-lugar-marcador-de-titulo.json](plantas-portoes-lugar-marcador-de-titulo.json). As plantas da cópia do livro continuam em `semana-b.json → w1`.

| Planta | Mordeu | Mensagem observada |
|---|---|---|
| lugar-marcador-de-titulo | sim |   L1 · páginas com dois destinos iguais fora da mobília         2717  (teto 2716) ACIMA DO TETO |
| a frase de um bloco citado com uma palavra trocada | sim | W2 · a frase do bloco «precos» na página da semana não é a que a primeira página rende.       esperada: Os preços: os combustíveis sobem mais do que o resto: Em agosto de 2026, os combustíveis estavam 23,78 % mais caros do que um ano antes. Os preços no seu conjunto subiram 3,30 %.       rendida:  Os preços: os combustíveis sobem mais do que o resto: Ontem, Em agosto de 2026, os combustíveis estavam 23,78 % mais caros do que um ano antes. Os preços no seu conjunto subiram 3,30 %. |
| uma marca das frases compostas num parágrafo que esta célula não compara | sim | W · a marca das frases compostas da semana está num sítio que esta célula não confere (leituraDaSemana): &lt;p&gt; «Uma frase que ninguém compara.» |
| o literal de agora de uma mudança só da forma trocado | sim | W2 · fluxo-de-credito-as-empresas-2025: o literal de agora não é o da última entrada da janela (3,0, entrada 0) |
| uma contagem trocada | sim | W2 · a frase das contagens difere da conta desta célula.       esperada: Entre 30.09.2026 e 06.10.2026, 90 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência.       rendida:  Entre 30.09.2026 e 06.10.2026, 91 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência. |
| a janela de outro dia | sim | W2 · a janela acaba a 2026-10-05, e o carimbo da construção é de 2026-10-06 &#124; W2 · a frase das contagens difere da conta desta célula.       esperada: Entre 29.09.2026 e 05.10.2026, 90 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência.       rendida:  Entre 30.09.2026 e 06.10.2026, 90 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência. |
| uma mudança a menos | sim | W2 · as mudanças da página (8) não são, pela ordem, as que esta célula conta (9): da mudança mais recente para a mais antiga |
| a unidade colada ao número | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| a palavra do lado trocada | sim | W2 · custo-unitario-do-trabalho-2024: a palavra do lado não é a da conta («subiu») |
| o valor de antes de outra entrada | sim | W2 · custo-unitario-do-trabalho-2024: o valor de antes não é o da primeira mudança da janela (17,7, entrada 1) |
| uma palavra trocada na frase, leituraDaSemana, pt | sim | W4 · custo-unitario-do-trabalho-2024: a frase mostrada não é a do recibo da mesma linha e edição |
| uma frase retirada, leituraDaSemana, pt | sim | EX2 · custo-unitario-do-trabalho-2024: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a frase de outra linha, leituraDaSemana, pt | sim | EX2 · custo-unitario-do-trabalho-2024: a frase ou ausência não é um parágrafo da própria linha |
| uma ausência numa frase confirmada, leituraDaSemana, pt | sim | W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a definição repetida no grupo, leituraDaSemana, pt | sim | EX2 · formacao-bruta-de-capital-fixo-2025: o grupo tem 2 frases ou ausências; exige uma por grupo, sob a última mudança &#124; EX2 · formacao-bruta-de-capital-fixo-2025: a definição não está sob a última mudança do grupo |
| a definição em falta no grupo, leituraDaSemana, pt | sim | EX2 · formacao-bruta-de-capital-fixo-2025: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · formacao-bruta-de-capital-fixo-2024: a frase confirmada tem de aparecer, sem ausência &#124; W4 · formacao-bruta-de-capital-fixo-2025: a frase confirmada tem de aparecer, sem ausência |
| uma palavra trocada no sinal, leituraDaSemana, pt | sim | W4 · o sinal mostrado não é o do recibo da mesma linha e edição |
| o sinal em falta no grupo, leituraDaSemana, pt | sim | W4 · o grupo não tem os sinais dos recibos, uma vez cada |
| uma frase por confirmar publicada, leituraDaSemana, pt | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar retirada, leituraDaSemana, pt | sim | EX2 · oe-2026-cem-euros-funcao-01: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar com palavras trocadas, leituraDaSemana, pt | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| uma frase fora da lista, leituraDaSemana, pt | sim | EX2 · uma frase ou ausência está fora de uma mudança de valor |
| uma palavra trocada na frase, leituraDaSemana, en | sim | W4 · custo-unitario-do-trabalho-2024: a frase mostrada não é a do recibo da mesma linha e edição |
| uma frase retirada, leituraDaSemana, en | sim | EX2 · custo-unitario-do-trabalho-2024: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a frase de outra linha, leituraDaSemana, en | sim | EX2 · custo-unitario-do-trabalho-2024: a frase ou ausência não é um parágrafo da própria linha |
| uma ausência numa frase confirmada, leituraDaSemana, en | sim | W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a definição repetida no grupo, leituraDaSemana, en | sim | EX2 · formacao-bruta-de-capital-fixo-2025: o grupo tem 2 frases ou ausências; exige uma por grupo, sob a última mudança &#124; EX2 · formacao-bruta-de-capital-fixo-2025: a definição não está sob a última mudança do grupo |
| a definição em falta no grupo, leituraDaSemana, en | sim | EX2 · formacao-bruta-de-capital-fixo-2025: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · formacao-bruta-de-capital-fixo-2024: a frase confirmada tem de aparecer, sem ausência &#124; W4 · formacao-bruta-de-capital-fixo-2025: a frase confirmada tem de aparecer, sem ausência |
| uma palavra trocada no sinal, leituraDaSemana, en | sim | W4 · o sinal mostrado não é o do recibo da mesma linha e edição |
| o sinal em falta no grupo, leituraDaSemana, en | sim | W4 · o grupo não tem os sinais dos recibos, uma vez cada |
| uma frase por confirmar publicada, leituraDaSemana, en | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar retirada, leituraDaSemana, en | sim | EX2 · oe-2026-cem-euros-funcao-01: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar com palavras trocadas, leituraDaSemana, en | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| uma frase fora da lista, leituraDaSemana, en | sim | EX2 · uma frase ou ausência está fora de uma mudança de valor |
| uma palavra trocada na frase, indice, pt | sim | W4 · custo-unitario-do-trabalho-2024: a frase mostrada não é a do recibo da mesma linha e edição |
| uma frase retirada, indice, pt | sim | EX2 · custo-unitario-do-trabalho-2024: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a frase de outra linha, indice, pt | sim | EX2 · custo-unitario-do-trabalho-2024: a frase ou ausência não é um parágrafo da própria linha |
| uma ausência numa frase confirmada, indice, pt | sim | W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a definição repetida no grupo, indice, pt | sim | EX2 · formacao-bruta-de-capital-fixo-2025: o grupo tem 2 frases ou ausências; exige uma por grupo, sob a última mudança &#124; EX2 · formacao-bruta-de-capital-fixo-2025: a definição não está sob a última mudança do grupo |
| a definição em falta no grupo, indice, pt | sim | EX2 · formacao-bruta-de-capital-fixo-2025: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · formacao-bruta-de-capital-fixo-2024: a frase confirmada tem de aparecer, sem ausência &#124; W4 · formacao-bruta-de-capital-fixo-2025: a frase confirmada tem de aparecer, sem ausência |
| uma palavra trocada no sinal, indice, pt | sim | W4 · o sinal mostrado não é o do recibo da mesma linha e edição |
| o sinal em falta no grupo, indice, pt | sim | W4 · o grupo não tem os sinais dos recibos, uma vez cada |
| uma frase por confirmar publicada, indice, pt | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar retirada, indice, pt | sim | EX2 · oe-2026-cem-euros-funcao-01: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar com palavras trocadas, indice, pt | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| uma frase fora da lista, indice, pt | sim | EX2 · uma frase ou ausência está fora de uma mudança de valor |
| uma palavra trocada na frase, indice, en | sim | W4 · custo-unitario-do-trabalho-2024: a frase mostrada não é a do recibo da mesma linha e edição |
| uma frase retirada, indice, en | sim | EX2 · custo-unitario-do-trabalho-2024: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a frase de outra linha, indice, en | sim | EX2 · custo-unitario-do-trabalho-2024: a frase ou ausência não é um parágrafo da própria linha |
| uma ausência numa frase confirmada, indice, en | sim | W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a definição repetida no grupo, indice, en | sim | EX2 · formacao-bruta-de-capital-fixo-2025: o grupo tem 2 frases ou ausências; exige uma por grupo, sob a última mudança &#124; EX2 · formacao-bruta-de-capital-fixo-2025: a definição não está sob a última mudança do grupo |
| a definição em falta no grupo, indice, en | sim | EX2 · formacao-bruta-de-capital-fixo-2025: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · formacao-bruta-de-capital-fixo-2024: a frase confirmada tem de aparecer, sem ausência &#124; W4 · formacao-bruta-de-capital-fixo-2025: a frase confirmada tem de aparecer, sem ausência |
| uma palavra trocada no sinal, indice, en | sim | W4 · o sinal mostrado não é o do recibo da mesma linha e edição |
| o sinal em falta no grupo, indice, en | sim | W4 · o grupo não tem os sinais dos recibos, uma vez cada |
| uma frase por confirmar publicada, indice, en | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar retirada, indice, en | sim | EX2 · oe-2026-cem-euros-funcao-01: o grupo tem 0 frases ou ausências; exige uma por grupo, sob a última mudança &#124; W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar com palavras trocadas, indice, en | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| uma frase fora da lista, indice, en | sim | EX2 · uma frase ou ausência está fora de uma mudança de valor |
| selo retirado, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo de outra linha, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo de outra edição, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| definição de outra linha, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| entrada de outra linha, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo fora do resumo, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| frase fora da lista, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo retirado, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo de outra linha, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo de outra edição, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| definição de outra linha, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| entrada de outra linha, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo fora do resumo, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| frase fora da lista, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| a unidade colada ao número, indice, pt | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| o qualificador da União Europeia retirado, indice, pt | sim | W2 · despesa-em-id-2024-ue: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| o nome da fonte em vez do nome da medida, indice, pt | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| a palavra da revisão trocada por movimento da economia, indice, pt | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| um resumo declarado fora da lista, indice, pt | sim | W · a marca das frases compostas da semana está num sítio que esta célula não confere (indice): &lt;p&gt; «Custo do trabalho por unidade produzida (custo unitário do t» |
| a unidade colada ao número, indice, en | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| o qualificador da União Europeia retirado, indice, en | sim | W2 · despesa-em-id-2024-ue: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| o nome da fonte em vez do nome da medida, indice, en | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| a palavra da revisão trocada por movimento da economia, indice, en | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| um resumo declarado fora da lista, indice, en | sim | W · a marca das frases compostas da semana está num sítio que esta célula não confere (indice): &lt;p&gt; «Labour cost per unit of output (unit labour cost), 2024, thr» |
| a unidade colada ao número, leituraDaSemana, pt | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| o qualificador da União Europeia retirado, leituraDaSemana, pt | sim | W2 · despesa-em-id-2024-ue: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| o nome da fonte em vez do nome da medida, leituraDaSemana, pt | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| a palavra da revisão trocada por movimento da economia, leituraDaSemana, pt | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada &#124; W2 · custo-unitario-do-trabalho-2024: a palavra do lado não é a da conta («subiu») |
| um resumo declarado fora da lista, leituraDaSemana, pt | sim | W · a marca das frases compostas da semana está num sítio que esta célula não confere (leituraDaSemana): &lt;p&gt; «Custo do trabalho por unidade produzida (custo unitário do t» |
| as contagens à cabeça da página, leituraDaSemana, pt | sim | W2 · a frase das contagens não fecha a página |
| a frase de nenhuma mudança da primeira página retirada, leituraDaSemana, pt | sim | W2 · nenhuma frase da primeira página mudou, e a página não o diz assim |
| a unidade colada ao número, leituraDaSemana, en | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| o qualificador da União Europeia retirado, leituraDaSemana, en | sim | W2 · despesa-em-id-2024-ue: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| o nome da fonte em vez do nome da medida, leituraDaSemana, en | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| a palavra da revisão trocada por movimento da economia, leituraDaSemana, en | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada &#124; W2 · custo-unitario-do-trabalho-2024: a palavra do lado não é a da conta («subiu») |
| um resumo declarado fora da lista, leituraDaSemana, en | sim | W · a marca das frases compostas da semana está num sítio que esta célula não confere (leituraDaSemana): &lt;p&gt; «Labour cost per unit of output (unit labour cost), 2024, thr» |
| as contagens à cabeça da página, leituraDaSemana, en | sim | W2 · a frase das contagens não fecha a página |
| a frase de nenhuma mudança da primeira página retirada, leituraDaSemana, en | sim | W2 · nenhuma frase da primeira página mudou, e a página não o diz assim |
| inventário: um resumo declarado fora da lista, /explicacoes/leitura-da-semana | sim | bloco por classificar em /explicacoes/leitura-da-semana: «Uma revisão declarada fora da lista que a célula confere.» |
| inventário: um resumo declarado fora da lista, /en/explainers/weekly-reading | sim | bloco por classificar em /en/explainers/weekly-reading: «Uma revisão declarada fora da lista que a célula confere.» |
| inventário: um resumo declarado fora da lista, /indice | sim | bloco por classificar em /indice: «Uma revisão declarada fora da lista que a célula confere.» |
| inventário: um resumo declarado fora da lista, /en/index | sim | bloco por classificar em /en/index: «Uma revisão declarada fora da lista que a célula confere.» |
| explicações, flex, pt, 390 | sim | FC1 · /explicacoes/ a 390 px: uma frase composta dentro de um contentor flex (a): «Para onde vai o dinheiro do Estado em 2026» |
| explicações, largura, pt, 390 | sim | FC2 · /explicacoes/ a 390 px: o documento tem 2018 px numa janela de 390 |
| primeira página, flex, pt, 390 | sim | FC1 · / a 390 px: uma frase composta dentro de um contentor flex (p.pp-frase): «Em agosto de 2026, os combustíveis estavam 23,78 %fonte · INE mais car» / FC2 · / a 390 px: o documento tem 545 px numa janela de 390 |
| primeira página, largura, pt, 390 | sim | FC2 · / a 390 px: o documento tem 2018 px numa janela de 390 |
| comparação dos cartões, flex, pt, 390 | sim | FC1 · /precos/ a 390 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura): «A variação é maior do que a da média da União Europeia. O Banco Centra» |
| comparação dos cartões, largura, pt, 390 | sim | FC2 · /precos/ a 390 px: o documento tem 2018 px numa janela de 390 |
| definição dos cartões aberta, flex, pt, 390 | sim | FC1 · /precos/ a 390 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura.cartao-medida-o-que-e): «Em agosto de 2026 os preços no consumidor estavam, em média, 3,30 % ac» |
| definição dos cartões aberta, largura, pt, 390 | sim | FC2 · /precos/ a 390 px: o documento tem 2018 px numa janela de 390 |
| explicações, flex, pt, 1280 | sim | FC1 · /explicacoes/ a 1280 px: uma frase composta dentro de um contentor flex (a): «Para onde vai o dinheiro do Estado em 2026» |
| explicações, largura, pt, 1280 | sim | FC2 · /explicacoes/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| primeira página, flex, pt, 1280 | sim | FC1 · / a 1280 px: uma frase composta dentro de um contentor flex (p.pp-frase): «Em agosto de 2026, os combustíveis estavam 23,78 %fonte · INE mais car» |
| primeira página, largura, pt, 1280 | sim | FC2 · / a 1280 px: o documento tem 2094 px numa janela de 1280 |
| comparação dos cartões, flex, pt, 1280 | sim | FC1 · /precos/ a 1280 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura): «A variação é maior do que a da média da União Europeia. O Banco Centra» |
| comparação dos cartões, largura, pt, 1280 | sim | FC2 · /precos/ a 1280 px: o documento tem 2375 px numa janela de 1280 |
| definição dos cartões aberta, flex, pt, 1280 | sim | FC1 · /precos/ a 1280 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura.cartao-medida-o-que-e): «Em agosto de 2026 os preços no consumidor estavam, em média, 3,30 % ac» |
| definição dos cartões aberta, largura, pt, 1280 | sim | FC2 · /precos/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| explicações, flex, en, 390 | sim | FC1 · /en/explainers/ a 390 px: uma frase composta dentro de um contentor flex (a): «Where the State’s money goes in 2026» |
| explicações, largura, en, 390 | sim | FC2 · /en/explainers/ a 390 px: o documento tem 2018 px numa janela de 390 |
| primeira página, flex, en, 390 | sim | FC1 · /en/ a 390 px: uma frase composta dentro de um contentor flex (p.pp-frase): «In August 2026, fuel was 23,78 %source · INE more expensive than a yea» / FC2 · /en/ a 390 px: o documento tem 487 px numa janela de 390 |
| primeira página, largura, en, 390 | sim | FC2 · /en/ a 390 px: o documento tem 2018 px numa janela de 390 |
| comparação dos cartões, flex, en, 390 | sim | FC1 · /en/prices/ a 390 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura): «The change is larger than the European Union average. The European Cen» |
| comparação dos cartões, largura, en, 390 | sim | FC2 · /en/prices/ a 390 px: o documento tem 2018 px numa janela de 390 |
| definição dos cartões aberta, flex, en, 390 | sim | FC1 · /en/prices/ a 390 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura.cartao-medida-o-que-e): «In August 2026 consumer prices were, on average, 3,30 % above a year e» |
| definição dos cartões aberta, largura, en, 390 | sim | FC2 · /en/prices/ a 390 px: o documento tem 2018 px numa janela de 390 |
| explicações, flex, en, 1280 | sim | FC1 · /en/explainers/ a 1280 px: uma frase composta dentro de um contentor flex (a): «Where the State’s money goes in 2026» |
| explicações, largura, en, 1280 | sim | FC2 · /en/explainers/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| primeira página, flex, en, 1280 | sim | FC1 · /en/ a 1280 px: uma frase composta dentro de um contentor flex (p.pp-frase): «In August 2026, fuel was 23,78 %source · INE more expensive than a yea» |
| primeira página, largura, en, 1280 | sim | FC2 · /en/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| comparação dos cartões, flex, en, 1280 | sim | FC1 · /en/prices/ a 1280 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura): «The change is larger than the European Union average. The European Cen» |
| comparação dos cartões, largura, en, 1280 | sim | FC2 · /en/prices/ a 1280 px: o documento tem 2375 px numa janela de 1280 |
| definição dos cartões aberta, flex, en, 1280 | sim | FC1 · /en/prices/ a 1280 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura.cartao-medida-o-que-e): «In August 2026 consumer prices were, on average, 3,30 % above a year e» |
| definição dos cartões aberta, largura, en, 1280 | sim | FC2 · /en/prices/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| marca de incerteza num título, indice/index.html | sim | A4: indice/index.html: um título de estudo leva a marca de incerteza. A4: indice/index.html: um título de estudo leva a marca de incerteza. |
| marca de incerteza num título, en/index/index.html | sim | A4: en/index/index.html: um título de estudo leva a marca de incerteza. A4: en/index/index.html: um título de estudo leva a marca de incerteza. |
| marca de incerteza num título, correcoes/index.html | sim | A4: correcoes/index.html: um título de estudo leva a marca de incerteza. A4: correcoes/index.html: um título de estudo leva a marca de incerteza. |
| marca de incerteza num título, en/corrections/index.html | sim | A4: en/corrections/index.html: um título de estudo leva a marca de incerteza. A4: en/corrections/index.html: um título de estudo leva a marca de incerteza. |
| valor anterior errado no índice, indice/index.html | sim | M3: indice/index.html (indice): custo-unitario-do-trabalho-2024 mistura correções, repete o valor ou difere da correção declarada. |
| valor anterior errado no índice, en/index/index.html | sim | M3: en/index/index.html (indice): custo-unitario-do-trabalho-2024 mistura correções, repete o valor ou difere da correção declarada. |
| título publicado com palavras trocadas | sim | A4: en/index/index.html: o título de evora-contas-da-camara-2010-2025/en difere do arquivo ou da língua que o texto tem. |
| título português sem língua | sim | A4: en/index/index.html: o título de onde-esta-a-agua/en difere do arquivo ou da língua que o texto tem. |

Os ensaios iniciais estão em [ensaios-b/](ensaios-b/). A prova dos títulos encontrou a exigência antiga de riscar o valor anterior na M3. A conferência HTML foi chamada antes de gerar os cartões de partilha, um erro da preparação parcial do construtor. Corrigiu-se a M3 com uma planta de valor errado e geraram-se os cartões antes da corrida completa. A primeira corrida completa encontrou uma importação sem uso na página da semana, deixada pela extração do componente comum. Essa importação foi retirada e os três portões repetidos na nova cabeça; a tentativa anterior conserva os seus códigos e registos em ensaios-b.

## Portões na cabeça do código

Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/ex2-2026-10-06/portoes-b`, com o caminho absoluto da worktree na execução. A tranca foi respeitada. As variáveis `OEDP_SEMANA_JSON` e `OEDP_FRASES_JSON` guardaram as saídas estruturadas da corrida. Cabeça de início: `8c3a08b9dcfb48595be70d6d47385b0427cc3b62`; cabeça de fim: `8c3a08b9dcfb48595be70d6d47385b0427cc3b62`.

| Portão | Código lido de ficheiro | Ficheiro |
|---|---:|---|
| build | 0 | [build.codigo](portoes-b/build.codigo) |
| verify | 0 | [verify.codigo](portoes-b/verify.codigo) |
| typecheck | 0 | [typecheck.codigo](portoes-b/typecheck.codigo) |

A entrega foi medida por `node design/especime-v3/medicoes/ex2-2026-10-06/medir-entrega.mjs`. Este relatório inteiro foi gerado por `node design/especime-v3/medicoes/ex2-2026-10-06/escrever-relatorio.mjs`; não contém secções acrescentadas à mão. A regeneração e os bytes das capturas conferem-se com `node design/especime-v3/medicoes/ex2-2026-10-06/conferir-artefactos-b.mjs`, em [artefactos-b.json](artefactos-b.json). A observação visual, escrita pelo construtor, fica em [inspecao-visual-b.json](inspecao-visual-b.json), distinta da leitura a frio.

## Questões e limites

- **EX2-1.** Resolvida pela direção na correção do brief, antes desta passagem.
- **EX2-2.** A leitura a frio recebida foi tratada por esta passagem. Falta a leitura curta do diff e a conferência da direção antes de aterrar, pela regra do projeto. Não houve publicação.
- **EX2-3.** As referências para dizer se um valor é alto ou baixo e o ano de base dos volumes encadeados ficam para o bloco dos recibos. A adjacência do período com o ano de base não foi medida no ensaio curto das unidades.

## Commits desta passagem anteriores às provas finais

- `e4d604147894941036937041c55fc6edcae9cd04 EX2-b: unificar as revisões e conferir as definições por grupo`
- `7ec04a82836dd7693a00d18114c22fc12c7b3fd7 EX2-b: conservar os títulos publicados sem marca de tradução`
- `e762dd43a25c3ad9b9e45c8b7218415ce0e50550 EX2-b: gerar o relatório inteiro e retirar o manifesto do construtor`
- `421d0513befe6dcc517a46532bf8ab5adf83bf3b EX2-b: conservar e conferir as provas das plantas e das capturas`
- `92e31db8a378499fd98f805c99914bb9840895dd EX2-b: conferir os valores da frase sem exigir o risco antigo`
- `8c3a08b9dcfb48595be70d6d47385b0427cc3b62 EX2-b: retirar a importação sem uso da página da semana`

## Páginas construídas, lidas do HTML

### leituraDaSemana, PT

- **custo-unitario-do-trabalho-2024**. Custo do trabalho por unidade produzida (custo unitário do trabalho), 2024, variação em três anos, %: de 17,7 para 17,9, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É quanto subiu em três anos o custo do trabalho por cada unidade produzida: o que se paga pelo trabalho a dividir pelo que ele produz.

- **despesa-em-id-2024-ue**. Despesa em investigação e desenvolvimento, União Europeia, 2024, % do PIB: de 2,24 para 2,26, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É o que se gastou em investigação e desenvolvimento num ano, pelas empresas, pelas administrações públicas, pelo ensino superior e pelas instituições sem fins lucrativos, em percentagem do PIB, o valor de tudo o que a economia produz num ano.

- **formacao-bruta-de-capital-fixo-2024**. Investimento em bens duradouros para produzir (formação bruta de capital fixo), 2024, % do PIB: de 20,4 para 20,5, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

- **formacao-bruta-de-capital-fixo-2025**. Investimento em bens duradouros para produzir (formação bruta de capital fixo), 2025, % do PIB: de 20,7 para 21,0, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É o que as empresas, o Estado, as famílias e as instituições sem fim lucrativo que produzem no país compraram num ano, descontado o que venderam, em bens que duram mais de um ano, como edifícios, máquinas e programas informáticos, em percentagem do PIB, o valor de tudo o que o país produz num ano.

- **pib-real-per-capita-2024**. PIB real por habitante, 2024, euros por habitante · volumes encadeados (2015): de 20 430 para 20 520, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

- **pib-real-per-capita-2025**. PIB real por habitante, 2025, euros por habitante · volumes encadeados (2015): de 20 600 para 20 700, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É o valor de tudo o que o país produziu no ano, por habitante, descontada a subida dos preços, a que a fonte chama volumes encadeados.

- **posicao-de-investimento-internacional-2024**. O que o país tem no exterior menos o que deve (posição de investimento internacional), 2024, % do PIB: de −58,9 para −58,3, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

- **posicao-de-investimento-internacional-2025**. O que o país tem no exterior menos o que deve (posição de investimento internacional), 2025, % do PIB: de −50,2 para −49,6, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É a diferença entre o que os residentes em Portugal têm no resto do mundo e o que lhe devem, em percentagem do PIB, o valor de tudo o que o país produz num ano.

  Negativa quer dizer que o país deve ao exterior mais do que tem lá. (Recibo: `posicao-de-investimento-internacional-2024`.)

- **saldo-da-balanca-corrente-2024**. Saldo da balança corrente, 2024, % do PIB (média de três anos): de 0,3 para 0,4, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É a diferença entre o que Portugal recebeu do resto do mundo e o que lhe pagou, em bens, serviços e rendimentos, na média dos últimos três anos e em percentagem do PIB, o valor de tudo o que o país produz num ano. Positivo quer dizer que o país recebeu mais do que pagou.

### leituraDaSemana, EN

- **custo-unitario-do-trabalho-2024**. Labour cost per unit of output (unit labour cost), 2024, three-year change, %: from 17,7 to 17,9, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is how much the cost of labour per unit produced rose over three years: what is paid for labour divided by what it produces.

- **despesa-em-id-2024-ue**. Spending on research and development, European Union, 2024, % of GDP: from 2,24 to 2,26, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is what was spent on research and development in a year, by companies, government, higher education and non-profit institutions, as a percentage of GDP, the value of everything the economy produces in a year.

- **formacao-bruta-de-capital-fixo-2024**. Investment in durable goods used for production (gross fixed capital formation), 2024, % of GDP: from 20,4 to 20,5, the source revised it upwards, on 05.10.2026. source · Eurostat

- **formacao-bruta-de-capital-fixo-2025**. Investment in durable goods used for production (gross fixed capital formation), 2025, % of GDP: from 20,7 to 21,0, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is what companies, the State, households and non-profit institutions that produce in the country acquired in a year, less what they disposed of, in assets that last more than a year, such as buildings, machinery and software, as a percentage of GDP, the value of everything the country produces in a year.

- **pib-real-per-capita-2024**. Real GDP per capita, 2024, euro per capita · chain linked volumes (2015): from 20 430 to 20 520, the source revised it upwards, on 05.10.2026. source · Eurostat

- **pib-real-per-capita-2025**. Real GDP per capita, 2025, euro per capita · chain linked volumes (2015): from 20 600 to 20 700, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is the value of everything the country produced in the year, per inhabitant, excluding the rise in prices, which the source calls chain linked volumes.

- **posicao-de-investimento-internacional-2024**. What the country owns abroad minus what it owes (net international investment position), 2024, % of GDP: from −58,9 to −58,3, the source revised it upwards, on 05.10.2026. source · Eurostat

- **posicao-de-investimento-internacional-2025**. What the country owns abroad minus what it owes (net international investment position), 2025, % of GDP: from −50,2 to −49,6, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is the difference between what residents of Portugal own in the rest of the world and what they owe to it, as a percentage of GDP, the value of everything the country produces in a year.

  Negative means the country owes abroad more than it owns there. (Recibo: `posicao-de-investimento-internacional-2024`.)

- **saldo-da-balanca-corrente-2024**. Current account balance, 2024, % of GDP (three-year average): from 0,3 to 0,4, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is the difference between what Portugal received from the rest of the world and what it paid to it, in goods, services and income, averaged over the last three years and as a percentage of GDP, the value of everything the country produces in a year. Positive means the country received more than it paid.

### indice, PT

- **custo-unitario-do-trabalho-2024**. Custo do trabalho por unidade produzida (custo unitário do trabalho), 2024, variação em três anos, %: de 17,7 para 17,9, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É quanto subiu em três anos o custo do trabalho por cada unidade produzida: o que se paga pelo trabalho a dividir pelo que ele produz.

- **despesa-em-id-2024-ue**. Despesa em investigação e desenvolvimento, União Europeia, 2024, % do PIB: de 2,24 para 2,26, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É o que se gastou em investigação e desenvolvimento num ano, pelas empresas, pelas administrações públicas, pelo ensino superior e pelas instituições sem fins lucrativos, em percentagem do PIB, o valor de tudo o que a economia produz num ano.

- **formacao-bruta-de-capital-fixo-2024**. Investimento em bens duradouros para produzir (formação bruta de capital fixo), 2024, % do PIB: de 20,4 para 20,5, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

- **formacao-bruta-de-capital-fixo-2025**. Investimento em bens duradouros para produzir (formação bruta de capital fixo), 2025, % do PIB: de 20,7 para 21,0, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É o que as empresas, o Estado, as famílias e as instituições sem fim lucrativo que produzem no país compraram num ano, descontado o que venderam, em bens que duram mais de um ano, como edifícios, máquinas e programas informáticos, em percentagem do PIB, o valor de tudo o que o país produz num ano.

- **pib-real-per-capita-2024**. PIB real por habitante, 2024, euros por habitante · volumes encadeados (2015): de 20 430 para 20 520, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

- **pib-real-per-capita-2025**. PIB real por habitante, 2025, euros por habitante · volumes encadeados (2015): de 20 600 para 20 700, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É o valor de tudo o que o país produziu no ano, por habitante, descontada a subida dos preços, a que a fonte chama volumes encadeados.

- **posicao-de-investimento-internacional-2024**. O que o país tem no exterior menos o que deve (posição de investimento internacional), 2024, % do PIB: de −58,9 para −58,3, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

- **posicao-de-investimento-internacional-2025**. O que o país tem no exterior menos o que deve (posição de investimento internacional), 2025, % do PIB: de −50,2 para −49,6, a fonte reviu para cima, em 05.10.2026. fonte · Eurostat

  É a diferença entre o que os residentes em Portugal têm no resto do mundo e o que lhe devem, em percentagem do PIB, o valor de tudo o que o país produz num ano.

  Negativa quer dizer que o país deve ao exterior mais do que tem lá. (Recibo: `posicao-de-investimento-internacional-2024`.)

### indice, EN

- **custo-unitario-do-trabalho-2024**. Labour cost per unit of output (unit labour cost), 2024, three-year change, %: from 17,7 to 17,9, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is how much the cost of labour per unit produced rose over three years: what is paid for labour divided by what it produces.

- **despesa-em-id-2024-ue**. Spending on research and development, European Union, 2024, % of GDP: from 2,24 to 2,26, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is what was spent on research and development in a year, by companies, government, higher education and non-profit institutions, as a percentage of GDP, the value of everything the economy produces in a year.

- **formacao-bruta-de-capital-fixo-2024**. Investment in durable goods used for production (gross fixed capital formation), 2024, % of GDP: from 20,4 to 20,5, the source revised it upwards, on 05.10.2026. source · Eurostat

- **formacao-bruta-de-capital-fixo-2025**. Investment in durable goods used for production (gross fixed capital formation), 2025, % of GDP: from 20,7 to 21,0, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is what companies, the State, households and non-profit institutions that produce in the country acquired in a year, less what they disposed of, in assets that last more than a year, such as buildings, machinery and software, as a percentage of GDP, the value of everything the country produces in a year.

- **pib-real-per-capita-2024**. Real GDP per capita, 2024, euro per capita · chain linked volumes (2015): from 20 430 to 20 520, the source revised it upwards, on 05.10.2026. source · Eurostat

- **pib-real-per-capita-2025**. Real GDP per capita, 2025, euro per capita · chain linked volumes (2015): from 20 600 to 20 700, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is the value of everything the country produced in the year, per inhabitant, excluding the rise in prices, which the source calls chain linked volumes.

- **posicao-de-investimento-internacional-2024**. What the country owns abroad minus what it owes (net international investment position), 2024, % of GDP: from −58,9 to −58,3, the source revised it upwards, on 05.10.2026. source · Eurostat

- **posicao-de-investimento-internacional-2025**. What the country owns abroad minus what it owes (net international investment position), 2025, % of GDP: from −50,2 to −49,6, the source revised it upwards, on 05.10.2026. source · Eurostat

  It is the difference between what residents of Portugal own in the rest of the world and what they owe to it, as a percentage of GDP, the value of everything the country produces in a year.

  Negative means the country owes abroad more than it owns there. (Recibo: `posicao-de-investimento-internacional-2024`.)

## A passagem EX1-d

A explicação deixa de dizer que os juros faltam aos agregados: diz que estes números não os isolam. A referência à execução «acima» passa a indicar a posição na página. O saldo da execução passa a dizer se houve défice ou excedente, pelo sinal da linha, e a comparar o saldo acumulado com o saldo previsto para o ano inteiro, pelo token `compara`.

A base foi `d7564f21`, no ramo `ex1d-2026-10-11`. A cabeça do código é `7355de78920d6efaf5484e73667dea067e0a9f9b`. Construção pelo Codex, com a identificação `gpt-6-astra` e o raciocínio `high` pedidos no lançamento, que prevalece sobre o `xhigh` do mandato. O último commit contém apenas este relatório, as capturas e os registos de verificação. Não houve publicação nem mudança de ramo. A leitura a frio pelo Claude Opus 5.5 e a conferência do lugar de direção continuam por fazer antes de aterrar.

### As linhas e o perímetro

O perímetro é a conta consolidada da administração central e da segurança social, em contabilidade pública. A execução acumula janeiro a agosto. As quatro linhas pertencem ao mesmo quadro da Síntese da Execução Orçamental, identificado nos localizadores abaixo. A previsão é o Orçamento Inicial reproduzido nessa síntese.

| Linha | Valor | Unidade | Período | Localizador |
|---|---|---|---|---|
| `execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social` | 80 464,5 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | p. 49 do ficheiro, página impressa 45, Despesa efetiva, Execução Acumulada 2026 |
| `execucao-2026-08-receita-efetiva-administracao-central-seguranca-social` | 79 618,7 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | p. 49 do ficheiro, página impressa 45, Receita efetiva, Execução Acumulada 2026 |
| `execucao-2026-08-saldo-global-administracao-central-seguranca-social` | −845,8 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | p. 49 do ficheiro, página impressa 45, Saldo global, Execução Acumulada 2026 |
| `oe-2026-saldo-global-administracao-central-seguranca-social` | −1 789,8 | milhões de euros | 2026 | p. 49 do ficheiro, página impressa 45, Saldo global, Orçamento Inicial 2026 |

O guião `captar-ex1d.mjs` confirma a identidade receita menos despesa igual a saldo, em décimos inteiros de milhão, sem arredondar nem criar uma linha nova. A [medição e o manifesto das capturas](capturas-ex1d.json) conservam os campos lidos, as frases do HTML, a cabeça e os resumos SHA-256 das imagens. O saldo não é uma medida de dívida emitida, como a ressalva da própria linha explica.

### As decisões pequenas e os limites

- **EX1-5, para JD1.** O valor em euros do Ministério das Finanças permanece como a fonte o publicou. O arredondamento para mil milhões depende de uma linha derivada no motor e fica por fazer, por decisão expressa do mandato.
- **EX1-6.** Aplica-se a alternativa autorizada «que entra noutra classificação». O excerto selado `eurostat-cofog-divisao-01` nomeia literalmente «Public debt transactions», mas não explicita os juros. A descrição `dados-gov-oe-despesa-funcional` identifica a classificação funcional, sem explicitar essa inclusão. Não se acrescentou uma definição obtida fora das origens seladas. Os dois selos conferiram contra os ficheiros e os registos locais dos pedidos no motor. A abertura conserva o texto, como o mandato determina; a leitura a frio deve conhecer o limite destes apoios.
- **EX1-7.** Existe saldo anual do mesmo perímetro, por isso a comparação entra. «Acima» compara os valores com sinal, não a dimensão do défice. Os ramos são «acima», «abaixo» e «em linha», com «para o ano inteiro» e o valor anual visíveis. «Dentro do que o Orçamento previa» sugeriria cumprimento de uma meta para agosto que nenhuma destas linhas estabelece. Não se conclui se a execução está dentro do previsto para agosto nem como fechará o ano.
- **EX1-8.** A X6 tratava os ramos não escolhidos como palavras proibidas na página inteira. Com o défice da execução e o excedente do ano anterior, isso recusava duas frases corretas. Cada ausência passou a ser conferida no seu parágrafo; a igualdade integral do texto e a lista dos caminhos mantêm-se. As plantas trocam o sinal da execução, acrescentam-lhe o excedente da outra conta, invertem a comparação, mudam o perímetro, fazem passar a previsão anual por mensal e repõem a contradição dos juros. Nenhum portão de número, fonte ou pessoa foi dispensado.

### As três frases, lidas da página

Os textos abaixo retiram apenas os selos e normalizam os espaços; os números foram lidos do HTML, não compostos à mão.

**PT**

> Estes números não isolam o custo dos juros da dívida, que o Orçamento também prevê e que entra noutra classificação; quando as linhas dos juros existirem no livro-razão, esta explicação diz quanto são.

> O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês, e a execução até agosto é a que esta explicação mostra acima.

> Até agosto de 2026, as contas da administração central e da segurança social fecharam com um saldo de −845,8 milhões de euros, um défice (gastou mais do que recebeu); o saldo acumulado está acima do que o Orçamento previa para o ano inteiro (−1 789,8 milhões de euros).

**EN**

> These figures do not isolate the cost of the interest on the debt, which the Budget also forecasts and which falls under another classification; when the interest entries exist in the ledger, this explainer will say how much it is.

> The budget is a forecast: what is actually spent is read in the budget execution, month by month, and the execution to August is the one this explainer shows above.

> By August 2026, the accounts of central government and social security closed with a balance of −845,8 million euros, a deficit (it spent more than it took in); the cumulative balance is above what the Budget forecast for the full year (−1 789,8 million euros).

### Conferências e capturas

Comando dos portões: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/ex2-2026-10-06/portoes-d`, com `<worktree>` substituído pelo caminho absoluto apenas na execução. A tranca foi tomada pelo guião. Os códigos abaixo foram lidos dos ficheiros depois do fim dos processos, sem canalização. As cabeças de início e de fim coincidem com a cabeça do código.

| Portão | Código lido |
|---|---|
| [build](portoes-d/build.codigo) | 0 |
| [verify](portoes-d/verify.codigo) | 0 |
| [typecheck](portoes-d/typecheck.codigo) | 0 |
| [explicacao](portoes-d/explicacao.codigo) | 0 |
| [acertos](portoes-d/acertos.codigo) | 0 |

A célula X recontou 2 páginas, auditou 94 folhas e 139 partes, e as 29 plantas morderam. As origens foram também conferidas com o motor local por `RESEARCHHUB_DIR=<motor> node tests/explicacoes/explicacao.mjs --prova --json design/especime-v3/medicoes/ex2-2026-10-06/portoes-d/explicacao.json`. O guião dos acertos foi corrido com `node design/especime-v3/medicoes/ex1-2026-10-05/acertos-ex1.mjs --json design/especime-v3/medicoes/ex2-2026-10-06/portoes-d/acertos.json`.

As 8 capturas são a página inteira e o recorte das correções, a 390 e a 1 280 px, nas duas edições. Foram inspecionadas visualmente: sem cortes nem transbordos. O guião mediu 0 erros de transbordo e abriu os recibos dos dois saldos em cada combinação de língua e largura. Comando: `RESEARCHHUB_DIR=<motor> node design/especime-v3/medicoes/ex2-2026-10-06/captar-ex1d.mjs`.

- [PT, 390 px](../../capturas/ex2-2026-10-06/ex1d-pt-390-correcoes.png).
- [PT, 1280 px](../../capturas/ex2-2026-10-06/ex1d-pt-1280-correcoes.png).
- [EN, 390 px](../../capturas/ex2-2026-10-06/ex1d-en-390-correcoes.png).
- [EN, 1280 px](../../capturas/ex2-2026-10-06/ex1d-en-1280-correcoes.png).

Uma corrida inicial foi interrompida durante a geração dos cartões, antes de obter os três códigos, para corrigir o guião de capturas: equivalência dos espaços dos milhares nos recibos e recorte fora da janela sobre a página inteira. Essa tentativa não serve de prova; os registos finais são os de `portoes-d`.

O resultado detalhado do portão de alvos fica em `portoes-d/alvos.json.gz`, comprimido sem perda depois da corrida. A descompressão foi comparada byte a byte com o original; o portão e os seus códigos não foram alterados.

### Commits e custo

- `e33ea4fadc4699653377d3911622110d6ebf405c EX1-d: esclarecer os juros e o saldo da execução`
- `77dab7c2a659c7227c647fe728d7062021bae231 EX1-d: preparar a medição e as capturas da entrega`
- `7355de78920d6efaf5484e73667dea067e0a9f9b EX1-d: conferir os recibos e o recorte da página inteira`

Custo-alvo: trezentos mil símbolos. Não foi observada uma linha «tokens used» desta construção; custo efetivo e confronto com o alvo: [verify], a apurar no registo do lançador. Não se inventa uma contagem nem se afirma que o alvo foi cumprido.
