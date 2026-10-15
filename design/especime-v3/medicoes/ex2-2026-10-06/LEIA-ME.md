# EX2 · a leitura da semana diz o que cada número é

A leitura da semana abre com os números que mudaram de valor. O índice usa a mesma gramática: nome da medida, período, unidade antes dos dois pontos, os dois valores, a revisão da fonte e a data. A definição aparece uma vez no fim de cada grupo de linhas consecutivas da mesma medida, seguida pelos sinais que os seus recibos tenham. Nenhuma definição nem sinal foi escrito nesta passagem: vêm de `oQueEDaLinha`, e a W4 compara-os com os recibos construídos da mesma edição. A ausência por confirmar continua explícita.

A cabeça do código é `140f9458d0556248987d002652336d9d1a56891f`. A base da primeira construção é `83e7a1158ba065153db7c419b01d4222d26bdc56`. Construtor: Codex, identificação pedida no mandato e nos trailers. Não foi observada uma linha «tokens used» nesta sessão; o custo fica por apurar no registo do lançador. A leitura a frio recebida está em [LEITURA-EX2](../../critica/LEITURA-EX2-2026-10-06.md). Falta a leitura curta do diff e a conferência da direção antes de aterrar. Não houve publicação.

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

A cadeia de nenhuma mudança na primeira página já existia desde o EX1: `753e7ff0b750855630e0d3633f21b8d2687899be EX1: as explicações e a leitura da semana (as três rotas, a primeira explicação com o texto do §5 do brief, a leitura gerada do registo das correções, o bloco «Para perceber» da primeira página e a secção do índice)`. O texto efetivamente mostrado nas duas edições consta de [passagem-b.json](passagem-b.json).

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

Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/ex2-2026-10-06/portoes-b`, com o caminho absoluto da worktree na execução. A tranca foi respeitada. As variáveis `OEDP_SEMANA_JSON` e `OEDP_FRASES_JSON` guardaram as saídas estruturadas da corrida. Cabeça de início: `140f9458d0556248987d002652336d9d1a56891f`; cabeça de fim: `140f9458d0556248987d002652336d9d1a56891f`.

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

- `57df5897035084d55858184c3e1ddce144b62b74 EX2-b: unificar as revisões e conferir as definições por grupo`
- `8bf196d3ea2f53d2b629e16fb729eccbd7bbc914 EX2-b: conservar os títulos publicados sem marca de tradução`
- `20e47db33869beeb17865d9ce2c3e5092e80a52a EX2-b: gerar o relatório inteiro e retirar o manifesto do construtor`
- `134b015428412afc38d23984ccf0c1ea90750b7a EX2-b: conservar e conferir as provas das plantas e das capturas`
- `92e31db8a378499fd98f805c99914bb9840895dd EX2-b: conferir os valores da frase sem exigir o risco antigo`
- `140f9458d0556248987d002652336d9d1a56891f EX2-b: retirar a importação sem uso da página da semana`

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

A base foi `acc8cb3a`, no ramo `ex1d-2026-10-11`. A cabeça do código é `4a18402fb1f0b5904ceb015b9a3b256e22ab8981`. Construção pelo Codex, com a identificação `gpt-6-astra` e o raciocínio `high` pedidos no lançamento, que prevalece sobre o `xhigh` do mandato. O último commit contém apenas este relatório, as capturas e os registos de verificação. Não houve publicação nem mudança de ramo. A leitura a frio pelo Claude Opus 5.5 e a conferência do lugar de direção continuam por fazer antes de aterrar.

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

- `97a56b7a927c635d70d040aa10a2ba671a672574 EX1-d: esclarecer os juros e o saldo da execução`
- `01b7fe84767ae4db0ad4fe6cf41104c96874257a EX1-d: preparar a medição e as capturas da entrega`
- `4a18402fb1f0b5904ceb015b9a3b256e22ab8981 EX1-d: conferir os recibos e o recorte da página inteira`

Custo-alvo: trezentos mil símbolos. Não foi observada uma linha «tokens used» desta construção; custo efetivo e confronto com o alvo: [verify], a apurar no registo do lançador. Não se inventa uma contagem nem se afirma que o alvo foi cumprido.

## A passagem EX1-e

A comparação com sinal da EX1-d podia levar o leitor a entender que o défice era maior. Agora compara a dimensão dos défices ou excedentes. As afirmações sem apoio sobre a classificação dos juros e a promessa de atualização saíram. A contabilidade dos ramos voltou a abranger todo o texto de main, com uma mensagem própria e plantas que a exercem.

Base: `e8deccc1`, ramo `ex1d-2026-10-11`. Cabeça do código: `5256a36b7a344b594fac891399e1679a3f2a3041`. O commit final contém apenas este relatório, as capturas e os registos das conferências. As capturas são da construção desta cabeça do código; o commit de entrega não muda o código nem o HTML. Sem mudança de ramo, sem publicação e sem push. A identificação de autoria nos trailers é a pedida no mandato.

### Decisões por achado e questões

- **1, 2, 3, 7 e 9:** eram as cinco plantas nas cópias. A X10 da base já exigia maior, menor e igual para compara. A prova nova retira cada ramo de cada token isoladamente e exige a mensagem X10 que o nomeia.
- **4, EX1-7 fechada:** comparaSaldos lê as duas linhas do saldo e compara os seus módulos quando têm o mesmo sinal. Não afirma cumprimento de uma meta mensal. Os dez ramos estão declarados por extenso em ambas as línguas; a previsão anual e a unidade vêm da linha por token. Com sinais diferentes, diz apenas o que o Orçamento previa. Os dois zeros têm uma frase própria.
- **5 e 10, EX1-6 substituída:** o literal selado «Transfers of a general character between different levels of government» sustenta as transferências na abertura. «Public debt transactions» não sustenta a inclusão dos juros nem «que o Orçamento também prevê»: ambas saíram, com a promessa. A frase curta sobre não isolar os juros é auditada como conta, inteira, sob a condição sem_linhas; não usa aquele literal para afirmar uma localização dos juros.
- **6, EX1-8 substituída:** saiu o ciclo redundante de ausências por parágrafo e a respetiva recolha de ausências. Cada ocorrência de texto de ramo, escolhido ou não, em main tem de estar contida num parágrafo cujo token o escolheu. A procura atravessa elementos HTML e normaliza os espaços. Lê main com e sem os selos, para também apanhar texto disfarçado com a classe de um selo. As duas plantas de prosa sem token falham pela mensagem «X6 · contabilidade dos ramos». O ramo não escolhido acrescentado ao seu parágrafo falha pela igualdade X6 e também pela contabilidade; não se apresenta a igualdade como prova da regra nova. Os controlos em PT e EN preservam as duas contas corretas, com défice e excedente em parágrafos distintos.
- **8, EX1-9:** não existe uma conferência autónoma de perímetro nesta célula. A planta muda apenas o valor visível para o saldo da administração central; mantém data-claim, href e o restante selo. Falha pela igualdade da X6 com o valor da linha declarada, como o nome e a mensagem da planta dizem. Não depende da X8.
- **11, EX1-10:** «No fim de» e «apresentavam um saldo acumulado» substituem a abertura repetida e o fecho indevido. A frase distingue a conta das administrações públicas do outro ano, que entra por periodo. O exemplo do mandato dizia «parágrafo anterior», mas a ordem real coloca essa conta depois. Optou-se por não indicar posição. O apoio na nota interna é uma exceção estreita da auditoria: só a linha do saldo executado e os dois literais citados são admitidos. A nota inteira não é publicada.
- **12:** origens.mjs não precisava de correção. As duas origens foram conferidas contra os ficheiros e os registos dos pedidos no motor. A duração do typecheck continua com o lugar de direção; esta passagem não muda a maquinaria.

### Frases novas lidas do HTML

O guião de capturas extraiu estes textos do HTML construído, retirando os selos e normalizando os espaços. Os valores e os anos não foram transcritos à mão.

**PT**

> O Orçamento do Estado para 2026 diz, euro a euro, para onde vai o dinheiro. De cada cem euros, 17,07 vão para a saúde, 13,73 para a proteção social, 10,91 para a educação e 11,77 para os assuntos económicos. A maior fatia, 33,18, é a dos serviços gerais das administrações públicas, onde a classificação das funções conta as transferências entre administrações.

> Estes números não isolam o custo dos juros da dívida.

> No fim de agosto de 2026, as contas da administração central e da segurança social apresentavam um saldo acumulado de −845,8 milhões de euros, um défice (gastou mais do que recebeu); é um défice menor do que o que o Orçamento previa para o ano inteiro (−1 789,8 milhões de euros). É outra conta, diferente da das administrações públicas de 2025.

**EN**

> The State Budget for 2026 says, euro by euro, where the money goes. Of every hundred euros, 17,07 go to health, 13,73 to social protection, 10,91 to education and 11,77 to economic affairs. The largest share, 33,18, is general public services, where the classification of functions counts the transfers between levels of government.

> These figures do not isolate the cost of the interest on the debt.

> By the end of August 2026, the accounts of central government and social security showed a cumulative balance of −845,8 million euros, a deficit (it spent more than it took in); it is a smaller deficit than the one the Budget forecast for the full year (−1 789,8 million euros). This is a different account from that of general government in 2025.

### Ramos e provas

- sinal: positivo
- sinal: negativo
- sinal: zero
- comparaSaldos: deficitMaior
- comparaSaldos: deficitMenor
- comparaSaldos: deficitIgual
- comparaSaldos: excedenteMaior
- comparaSaldos: excedenteMenor
- comparaSaldos: excedenteIgual
- comparaSaldos: nulos
- comparaSaldos: diferentesNegativo
- comparaSaldos: diferentesPositivo
- comparaSaldos: diferentesZero
- compara: maior
- compara: menor
- compara: igual

Os 26 cenários nas duas línguas cobrem módulos menores, maiores e iguais em défices e excedentes, ambos nulos, cada lado isoladamente nulo e todos os pares de sinais diferentes. Comparam o resolvedor com a conta independente da célula e afirmam o ramo esperado. As 38 retiradas isoladas exigem que a X10 nomeie o ramo retirado. Os textos, caminhos e mensagens estão em [explicacao.json](portoes-e/explicacao.json), incluindo os dois controlos de coexistência.

A célula recontou 2 páginas, 117 folhas e 165 partes auditadas. As 34 plantas abaixo morderam. A mensagem de cada uma é a devolvida pela célula, não uma etiqueta do construtor.

| Planta | Mordeu | Mensagem |
|---|---|---|
| o ramo do sinal trocado (excedente por défice, ou o contrário) | sim | X6 · o parágrafo seccoes[3].conteudo[0].paragrafo difere da conta.<br>      esperado: No fim de 2025, a dívida pública valia 89,7 % do que o país produz …<br>      rendido:  No fim de 2025, a dívida pública valia 89,7 % do que o país produz … |
| EX1-e: o sinal da execução trocado | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… |
| EX1-e: ramo em prosa sem token, um défice (gastou mais do que recebeu) | sim | X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um défice (gastou mais do que recebeu)» |
| EX1-e: ramo em prosa sem token, um saldo nulo (recebeu o mesmo que gastou) | sim | X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um saldo nulo (recebeu o mesmo que gastou)» |
| EX1-e: ramo disfarçado com a classe de um selo | sim | X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um saldo nulo (recebeu o mesmo que gastou)» |
| EX1-d: o ramo do ano anterior acrescentado à execução | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um excedente (recebeu mais do que gastou)» |
| EX1-e: a comparação dos módulos invertida | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «é um défice maior do que o que o Orçamento previa para o ano inteir…» |
| EX1-e: o sinal da previsão trocado | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… |
| EX1-e: os dois sinais trocados | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um excedente (recebeu mais do que gastou)» \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «é um excedente menor do que o que o Orçamento previa para o ano int…» |
| EX1-e: valor de outro perímetro, igualdade X6 com selo intacto | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… |
| EX1-d: a previsão anual apresentada como mensal | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… |
| EX1-d: a contradição dos juros reposta | sim | X6 · o parágrafo naoDiz[0] difere da conta.<br>      esperado: O orçamento é uma previsão: o que se gasta de facto lê-se na execuç…<br>      rendido:  O orçamento é uma previsão: o que se gasta de facto lê-se na execuç… |
| as palavras de uma condição falsa rendidas (os três programas) | sim | X6 · o parágrafo seccoes[2].conteudo[0].paragrafo difere da conta.<br>      esperado: Até agosto de 2026, a administração central e a segurança social ti…<br>      rendido:  Até agosto de 2026, a administração central e a segurança social ti… |
| o nome de outra função | sim | X6 · o parágrafo abertura[0] difere da conta.<br>      esperado: O Orçamento do Estado para 2026 diz, euro a euro, para onde vai o d…<br>      rendido:  O Orçamento do Estado para 2026 diz, euro a euro, para onde vai o d… |
| um parágrafo a menos | sim | X6 · os parágrafos rendidos (abertura[0], seccoes[0].conteudo[1].paragrafo, seccoes[1].conteudo[0].paragrafo, seccoes[1].conteudo[2].paragrafo, seccoes[2].conteudo[1].paragrafo, seccoes[3].conteudo[0].paragrafo, naoDiz[0]) não são os que a conta dá (abertura[0], seccoes[0].conteudo[1].paragrafo, seccoes[1].conteudo[0].paragrafo, seccoes[1].conteudo[2].paragrafo, seccoes[2].conteudo[0].paragrafo, seccoes[2].conteudo[1].paragrafo, seccoes[3].conteudo[0].paragrafo, naoDiz[0]) |
| o ano trocado no título | sim | X5 · o título rendido («Para onde vai o dinheiro do Estado em 2025») não é o recomposto («Para onde vai o dinheiro do Estado em 2026») |
| o título de uma secção trocado | sim | X7 · os títulos das secções (Por programa \| Por ministério \| O que já se gastou este ano \| A dívida e o saldo \| O que isto não diz) não são os declarados (Por função \| Por ministério \| O que já se gastou este ano \| A dívida e o saldo \| O que isto não diz) |
| a ordem dos programas que mais gastaram trocada | sim | X6 · o parágrafo seccoes[2].conteudo[0].paragrafo difere da conta.<br>      esperado: Até agosto de 2026, a administração central e a segurança social ti…<br>      rendido:  Até agosto de 2026, a administração central e a segurança social ti… |
| a porta dos números tirada do fim | sim | X8 · falta a porta para os números e as fontes no fim \| X8 · as portas do fim (nenhuma) não são as declaradas (/livro-razao Números e fontes →) |
| o lado da dívida trocado | sim | X6 · o parágrafo seccoes[3].conteudo[0].paragrafo difere da conta.<br>      esperado: No fim de 2025, a dívida pública valia 89,7 % do que o país produz …<br>      rendido:  No fim de 2025, a dívida pública valia 89,7 % do que o país produz … \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «abaixo dos 81,7 % da média da União Europeia» |
| uma marca das palavras declaradas num parágrafo que a célula não compara | sim | X · a marca das palavras declaradas está num sítio que a célula da explicação não confere (explicacao): <p> «Uma frase que ninguém compara.» |
| uma figura declarada tirada da página | sim | F22 · a figura declarada «ministerios» da explicação «dinheiro-do-estado-2026» não está na página |
| o selo de um valor tirado | sim | X8 · o valor de «oe-2026-cem-euros-funcao-07» num parágrafo não tem ao lado o selo do seu recibo |
| uma linha que não é dos programas no token «maiores» | sim | X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.pt[6] tem linhas fora da família /^execucao-2026-08-despesa-programa-\d{3}$/: oe-2026-despesa-ministerio-saude \| X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.en[6] tem linhas fora da família /^execucao-2026-08-despesa-programa-\d{3}$/: oe-2026-despesa-ministerio-saude |
| um programa a menos no token «maiores» | sim | X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.pt[6] não tem a família inteira /^execucao-2026-08-despesa-programa-\d{3}$/ do livro: faltam execucao-2026-08-despesa-programa-020 \| X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.en[6] não tem a família inteira /^execucao-2026-08-despesa-programa-\d{3}$/ do livro: faltam execucao-2026-08-despesa-programa-020 |
| o ramo «zero» tirado do sinal do saldo | sim | X10 · dinheiro-do-estado-2026: o token «sinal» em seccoes[2].conteudo[1].paragrafo.pt[5] não declara o ramo «zero» \| X10 · dinheiro-do-estado-2026: o token «sinal» em seccoes[2].conteudo[1].paragrafo.en[5] não declara o ramo «zero» \| X10 · dinheiro-do-estado-2026: o token «sinal» em seccoes[3].conteudo[0].paragrafo.pt[9] não declara o ramo «zero» \| X10 · dinheiro-do-estado-2026: o token «sinal» em seccoes[3].conteudo[0].paragrafo.en[9] não declara o ramo «zero» |
| um «n» maior do que a lista no token «maiores» | sim | X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.pt[6] tem n=21, fora de 1 a 20 \| X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.en[6] tem n=21, fora de 1 a 20 |
| um literal que não está no campo que cita | sim | X · dinheiro-do-estado-2026: X2 · a folha «Para onde vai o dinheiro do Estado em » (titulo[0]), parte 1 («Para onde vai o dinheiro do Estado») cita «uma frase que nenhuma fonte escreveu», que não está no campo «excerto» da origem «dados-gov-oe-despesa-funcional» |
| uma conta fora de um ramo e de uma condição | sim | X · dinheiro-do-estado-2026: X2 · a folha « diz, euro a euro, para onde vai o dinheiro. De cada cem euros, » (abertura[0][2]), parte 1 (« diz, euro a euro,») está marcada como conta e não está num ramo do sinal nem em palavras guardadas por condições |
| uma folha sem auditoria | sim | X · dinheiro-do-estado-2026: X1 · a folha «Para onde vai o dinheiro do Estado em » (titulo[0]) não tem auditoria: uma explicação mudada precisa de nova leitura das origens |
| uma ligação com uma palavra que diz alguma coisa | sim | X · dinheiro-do-estado-2026: X1 · a folha « e » (abertura[0][14]) não tem auditoria: uma explicação mudada precisa de nova leitura das origens \| X · dinheiro-do-estado-2026: X1 · a auditoria tem uma folha (« e só », abertura[0][14]) que a declaração não tem |
| uma leitura do projeto sem dizer sobre o que é | sim | X · dinheiro-do-estado-2026: X2 · a folha «Para onde vai o dinheiro do Estado em » (titulo[0]), parte 1 («Para onde vai o dinheiro do Estado») é uma leitura do projeto e não diz sobre o que é («sobre») |
| uma porta do fim que a explicação não declara | sim | X · dinheiro-do-estado-2026: X2 · a folha « O detalhe por programa e por ministério, com a fonte de cada númer…» (naoDiz[0][2]), parte 2 («, com a fonte de cada número, está no recibo de cada um, a um toque.») aponta para a porta «estudo-oe-2026», que a explicação não declara no fim |
| o sha256 de uma origem trocado (com o motor ao lado) | sim | X3 · origem «dados-gov-oe-despesa-funcional»: o sha256 do ficheiro no motor (43bb18f15b66…) não é o do selo (000000000000…) \| X3 · origem «dados-gov-oe-despesa-funcional»: o sha256 do registo do pedido não é o do selo |

### Portões e capturas

Comando: `sh scripts/leituras/portoes.sh <worktree absoluta> design/especime-v3/medicoes/ex2-2026-10-06/portoes-e`, com RESEARCHHUB_DIR a apontar para o motor local apenas no ambiente da execução. Os códigos foram lidos de ficheiro depois de os processos terminarem. A tranca protegeu a corrida; as cabeças de início e fim coincidem.

| Portão | Código lido |
|---|---|
| [build](portoes-e/build.codigo) | 0 |
| [verify](portoes-e/verify.codigo) | 0 |
| [typecheck](portoes-e/typecheck.codigo) | 0 |
| [explicacao](portoes-e/explicacao.codigo) | 0 |
| [acertos](portoes-e/acertos.codigo) | 0 |

- [PT, 390 px, inteira](../../capturas/ex2-2026-10-06/ex1e-pt-390-inteira.png).
- [PT, 390 px, correcoes](../../capturas/ex2-2026-10-06/ex1e-pt-390-correcoes.png).
- [PT, 1280 px, inteira](../../capturas/ex2-2026-10-06/ex1e-pt-1280-inteira.png).
- [PT, 1280 px, correcoes](../../capturas/ex2-2026-10-06/ex1e-pt-1280-correcoes.png).
- [EN, 390 px, inteira](../../capturas/ex2-2026-10-06/ex1e-en-390-inteira.png).
- [EN, 390 px, correcoes](../../capturas/ex2-2026-10-06/ex1e-en-390-correcoes.png).
- [EN, 1280 px, inteira](../../capturas/ex2-2026-10-06/ex1e-en-1280-inteira.png).
- [EN, 1280 px, correcoes](../../capturas/ex2-2026-10-06/ex1e-en-1280-correcoes.png).

O [manifesto](capturas-ex1e.json) guarda a cabeça, os resumos SHA-256, os textos e as medidas de largura. Mede 0 erros de transbordo e abre os recibos dos dois saldos em cada combinação de língua e largura. A inspeção visual está em [inspecao-ex1e.json](inspecao-ex1e.json).

A conferência adicional dos números do relatório também passou. Os dois números históricos da planta L1 do EX2 estavam no registo de texto, mas não nos JSON que o detetor lê. Foram extraídos desse registo existente, com o seu SHA-256, para [apoio-numeros-historicos.json](portoes-e/apoio-numeros-historicos.json), sem mudar a medição histórica. O resultado está em [numeros-relatorio.log](portoes-e/numeros-relatorio.log).

O registo grande de alvos fica em [alvos.json.gz](portoes-e/alvos.json.gz). A descompressão foi comparada byte a byte com o original; [compressao.json](portoes-e/compressao.json) guarda o resumo e os tamanhos. Os códigos e as medições não foram alterados.

### Commits, trabalho reservado e custo

- `b52575ce EX1-e: registar a leitura, as plantas e o mandato`
- `804a8e98 EX1-e: comparar a dimensão dos défices e excedentes`
- `6bc09e3b EX1-e: retirar as afirmações sem apoio sobre os juros`
- `f6f3a11c EX1-e: contar os ramos em toda a página`
- `4fa31f08 EX1-e: provar o valor de outro perímetro com o selo intacto`
- `9e044ee0 EX1-e: distinguir o saldo acumulado e as duas contas`
- `9b6d66be EX1-e: preparar as provas e os artefactos da entrega`
- `5256a36b EX1-e: recusar ramos disfarçados com a classe dos selos`

Uma corrida inicial dos portões foi interrompida antes dos três códigos, quando uma planta adicional encontrou texto indevido disfarçado com a classe de um selo. A lacuna foi corrigida; essa tentativa não serve de prova. Uma segunda corrida foi interrompida para juntar os dois trailers num único bloco final das mensagens: o Git só reconhecia o último enquanto estavam separados por uma linha vazia. Foram reescritas apenas as mensagens dos oito commits locais, verificando que cada árvore de ficheiros ficou idêntica e que os dois trailers eram reconhecidos. A corrida final de portoes-e começou de novo na cabeça corrigida.

O último commit acrescenta só os artefactos da entrega. Ficam para JD1 as linhas próprias dos juros e o arredondamento previsto em EX1-5, por decisão do mandato; esta passagem não promete esses valores na página. A leitura a frio e a decisão de integração pertencem ao lugar de direção. Nenhum portão foi dispensado.

Custo-alvo: cento e cinquenta mil símbolos. Não foi observada uma linha «tokens used» desta construção; custo efetivo e confronto com o alvo: [verify], a apurar no registo do lançador. Não se inventa uma contagem.

## A passagem EX1-f

*Nota do lugar de direção (12.10.2026): as questões desta passagem tinham saído como EX1-9 e EX1-10 por erro do mandato, números que a passagem EX1-e já dera à conferência do perímetro e à redação da abertura; passam a EX1-11 (o saldo homólogo de 2025) e EX1-12 (as duas transferências), e os números da EX1-e ficam como estavam (o achado 5 da leitura curta da EX1-f).*

A X10 exigia todos os ramos mas não prendia as palavras ao caso que os escolhe. Agora cada token de valor declara, na própria edição, palavras obrigatórias e proibidas para cada ramo. A X10 confere todos, mesmo os não escolhidos, com a mensagem própria «X10 · palavras do ramo». A X6 confere também as palavras do trecho rendido de cada token que consegue isolar pelo prefixo e pelo sufixo do parágrafo. Alterações nesses limites continuam cobertas pela igualdade X6; não se apresenta esta conferência de palavras como um analisador semântico geral.

Base: `97cec12d`, ramo `ex1d-2026-10-11`. Cabeça do código: `46d75e775252a4f1c213ee295db5368d1acd1f32`. As capturas são da construção desta cabeça, a última que muda código; o commit final só acrescenta este relatório, capturas e registos das conferências. Nenhuma mudança de ramo ou publicação. Os trailers seguem o mandato.

### Decisões por achado e questões reservadas

- **1 a 5:** eram os cinco estragos das cópias da leitura. Os registos e o mandato foram comprometidos antes das correções.
- **6:** os oito tokens nas duas edições declaram o vocabulário de todos os seus ramos. A comparação usa palavras inteiras, com acentos, e aceita expressões como «the same». As plantas trocam menor por maior e retiram a palavra do sinal de diferentesPositivo, isoladamente nas duas línguas; outra retira a própria declaração das palavras. O ramo zero da outra conta passou de «zero balance» a «nil balance», para usar o vocabulário pedido; a auditoria acompanha a mudança.
- **7:** a comparação termina com os meses que ainda faltam, sem escrever números à mão. A parte tem apoio em unit da linha executada, «acumulados de janeiro a agosto», e no período anual da previsão. O excerto da linha do saldo contém a linha numérica do quadro, não a expressão «janeiro a agosto»; essa expressão está em unit e na nota. Regista-se esta precisão em relação ao mandato, sem atribuir palavras ao excerto que ele não contém.
- **EX1-11, reservada ao motor:** selar `execucao-2025-08-saldo-global-administracao-central-seguranca-social`, a partir do mesmo quadro. O excerto selado já traz o valor homólogo, mas o livro não tem essa linha. Só uma passagem própria poderá dizer que o saldo passou de excedente a défice nos mesmos oito meses. Não se transcreveu esse valor para a página.
- **8:** usa-se «contas públicas» e «parágrafo seguinte» nas duas edições. O HTML confirma que seccoes[3].conteudo[0].paragrafo vem imediatamente depois de seccoes[2].conteudo[1].paragrafo, embora haja um título de secção entre ambos. A auditoria apoia a distinção na nota autorizada da linha e nos campos publicados já citados; a posição é uma parte aponta, conferida contra a ordem dos parágrafos. A planta de posição contrária falha pela X2.
- **9, EX1-12, reservada ao bloco de higiene:** distinguir transferências entre administrações de transferências entre os serviços exige palavras seladas que distingam as duas. A passagem regista a questão e mantém o texto existente.
- **10:** a planta do sinal da previsão rende o ramo real diferentesPositivo que a inversão do sinal escolheria; mantém os valores e os selos originais, para isolar a escolha indevida das palavras. Tem de falhar tanto pela contabilidade dos ramos como pela conferência das palavras do ramo escolhido, em mensagens distintas. Os cenários continuam a provar a lógica dos sinais e dos módulos.
- **11:** o typecheck em zero segundos é o compilador nativo do TypeScript 7, provado pelo lugar de direção com um erro de tipo plantado em 12.10.2026 (M67); não se mudou a maquinaria.

As designações EX1-11 e EX1-12 acima são as do mandato EX1-f e substituem, nesta passagem, os usos desses números na secção histórica EX1-e. Não surgiu uma questão nova a numerar a partir de EX1-11.

### Frases novas lidas do HTML

Os anos e os valores abaixo foram extraídos da página construída pelo guião das capturas, retirando os selos e normalizando os espaços.

**PT**

> No fim de agosto de 2026, as contas da administração central e da segurança social apresentavam um saldo acumulado de −845,8 milhões de euros, um défice (gastou mais do que recebeu); é um défice menor do que o que o Orçamento previa para o ano inteiro (−1 789,8 milhões de euros), e ainda faltam os meses de setembro a dezembro. É outra conta, e não a das contas públicas de 2025 do parágrafo seguinte.

**EN**

> By the end of August 2026, the accounts of central government and social security showed a cumulative balance of −845,8 million euros, a deficit (it spent more than it took in); it is a smaller deficit than the one the Budget forecast for the full year (−1 789,8 million euros), and September to December are still to come. It is a different account, not the one of the public accounts of 2025 in the next paragraph.

### Palavras declaradas por ramo

Cada linha abaixo foi lida da própria declaração pela X10. A tabela conserva todas as ocorrências, incluindo os dois tokens sinal por língua.

| Caminho e edição | Ramo | Tem de conter | Não pode conter |
|---|---|---|---|
| seccoes[2].conteudo[1].paragrafo.pt[5] | positivo | excedente | défice, nulo |
| seccoes[2].conteudo[1].paragrafo.pt[5] | negativo | défice | excedente, nulo |
| seccoes[2].conteudo[1].paragrafo.pt[5] | zero | nulo | excedente, défice |
| seccoes[2].conteudo[1].paragrafo.pt[7] | deficitMaior | défice, maior | excedente, nulo, menor, igual |
| seccoes[2].conteudo[1].paragrafo.pt[7] | deficitMenor | défice, menor | excedente, nulo, maior, igual |
| seccoes[2].conteudo[1].paragrafo.pt[7] | deficitIgual | défice, igual | excedente, nulo, maior, menor |
| seccoes[2].conteudo[1].paragrafo.pt[7] | excedenteMaior | excedente, maior | défice, nulo, menor, igual |
| seccoes[2].conteudo[1].paragrafo.pt[7] | excedenteMenor | excedente, menor | défice, nulo, maior, igual |
| seccoes[2].conteudo[1].paragrafo.pt[7] | excedenteIgual | excedente, igual | défice, nulo, maior, menor |
| seccoes[2].conteudo[1].paragrafo.pt[7] | nulos | nulo | excedente, défice, maior, menor, igual |
| seccoes[2].conteudo[1].paragrafo.pt[7] | diferentesNegativo | défice | excedente, nulo, maior, menor, igual |
| seccoes[2].conteudo[1].paragrafo.pt[7] | diferentesPositivo | excedente | défice, nulo, maior, menor, igual |
| seccoes[2].conteudo[1].paragrafo.pt[7] | diferentesZero | nulo | excedente, défice, maior, menor, igual |
| seccoes[2].conteudo[1].paragrafo.en[5] | positivo | surplus | deficit, nil |
| seccoes[2].conteudo[1].paragrafo.en[5] | negativo | deficit | surplus, nil |
| seccoes[2].conteudo[1].paragrafo.en[5] | zero | nil | surplus, deficit |
| seccoes[2].conteudo[1].paragrafo.en[7] | deficitMaior | deficit, larger | surplus, nil, smaller, the same |
| seccoes[2].conteudo[1].paragrafo.en[7] | deficitMenor | deficit, smaller | surplus, nil, larger, the same |
| seccoes[2].conteudo[1].paragrafo.en[7] | deficitIgual | deficit, the same | surplus, nil, larger, smaller |
| seccoes[2].conteudo[1].paragrafo.en[7] | excedenteMaior | surplus, larger | deficit, nil, smaller, the same |
| seccoes[2].conteudo[1].paragrafo.en[7] | excedenteMenor | surplus, smaller | deficit, nil, larger, the same |
| seccoes[2].conteudo[1].paragrafo.en[7] | excedenteIgual | surplus, the same | deficit, nil, larger, smaller |
| seccoes[2].conteudo[1].paragrafo.en[7] | nulos | nil | surplus, deficit, larger, smaller, the same |
| seccoes[2].conteudo[1].paragrafo.en[7] | diferentesNegativo | deficit | surplus, nil, larger, smaller, the same |
| seccoes[2].conteudo[1].paragrafo.en[7] | diferentesPositivo | surplus | deficit, nil, larger, smaller, the same |
| seccoes[2].conteudo[1].paragrafo.en[7] | diferentesZero | nil | surplus, deficit, larger, smaller, the same |
| seccoes[3].conteudo[0].paragrafo.pt[5] | maior | acima | abaixo, igual |
| seccoes[3].conteudo[0].paragrafo.pt[5] | menor | abaixo | acima, igual |
| seccoes[3].conteudo[0].paragrafo.pt[5] | igual | igual | acima, abaixo |
| seccoes[3].conteudo[0].paragrafo.pt[9] | positivo | excedente | défice, nulo |
| seccoes[3].conteudo[0].paragrafo.pt[9] | negativo | défice | excedente, nulo |
| seccoes[3].conteudo[0].paragrafo.pt[9] | zero | nulo | excedente, défice |
| seccoes[3].conteudo[0].paragrafo.en[5] | maior | above | below, equal |
| seccoes[3].conteudo[0].paragrafo.en[5] | menor | below | above, equal |
| seccoes[3].conteudo[0].paragrafo.en[5] | igual | equal | above, below |
| seccoes[3].conteudo[0].paragrafo.en[9] | positivo | surplus | deficit, nil |
| seccoes[3].conteudo[0].paragrafo.en[9] | negativo | deficit | surplus, nil |
| seccoes[3].conteudo[0].paragrafo.en[9] | zero | nil | surplus, deficit |

### Plantas e cenários

Os 26 cenários de saldos continuam a confrontar o resolvedor com a conta independente; as 38 retiradas isoladas exigem a mensagem do ramo em falta. Os dois controlos de coexistência mantêm a execução em défice e as contas públicas em excedente, cada qual no seu parágrafo. A X10 verifica as palavras dos ramos independentemente destes cenários e sem consultar a auditoria das folhas.

A célula recontou 2 páginas, 117 folhas e 166 partes auditadas. Morderam 41 de 41 plantas. Todas as mensagens são as devolvidas pela célula, guardadas também em [explicacao.json](portoes-f/explicacao.json).

| Planta | Mordeu | Mensagem |
|---|---|---|
| o ramo do sinal trocado (excedente por défice, ou o contrário) | sim | X6 · o parágrafo seccoes[3].conteudo[0].paragrafo difere da conta.<br>      esperado: No fim de 2025, a dívida pública valia 89,7 % do que o país produz …<br>      rendido:  No fim de 2025, a dívida pública valia 89,7 % do que o país produz … \| X6 · palavras do ramo: seccoes[3].conteudo[0].paragrafo, ramo «positivo» falta «excedente» \| X6 · palavras do ramo: seccoes[3].conteudo[0].paragrafo, ramo «positivo» contém a palavra proibida «défice» |
| EX1-e: o sinal da execução trocado | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… \| X6 · palavras do ramo: seccoes[2].conteudo[1].paragrafo, ramo «negativo» falta «défice» \| X6 · palavras do ramo: seccoes[2].conteudo[1].paragrafo, ramo «negativo» contém a palavra proibida «excedente» |
| EX1-e: ramo em prosa sem token, um défice (gastou mais do que recebeu) | sim | X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um défice (gastou mais do que recebeu)» |
| EX1-e: ramo em prosa sem token, um saldo nulo (recebeu o mesmo que gastou) | sim | X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um saldo nulo (recebeu o mesmo que gastou)» |
| EX1-e: ramo disfarçado com a classe de um selo | sim | X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um saldo nulo (recebeu o mesmo que gastou)» |
| EX1-d: o ramo do ano anterior acrescentado à execução | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um excedente (recebeu mais do que gastou)» |
| EX1-e: a comparação dos módulos invertida | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… \| X6 · palavras do ramo: seccoes[2].conteudo[1].paragrafo, ramo «deficitMenor» falta «menor» \| X6 · palavras do ramo: seccoes[2].conteudo[1].paragrafo, ramo «deficitMenor» contém a palavra proibida «maior» \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «é um défice maior do que o que o Orçamento previa para o ano inteir…» |
| EX1-f: o sinal da previsão trocado rende diferentesPositivo | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… \| X6 · palavras do ramo: seccoes[2].conteudo[1].paragrafo, ramo «deficitMenor» falta «défice» \| X6 · palavras do ramo: seccoes[2].conteudo[1].paragrafo, ramo «deficitMenor» falta «menor» \| X6 · palavras do ramo: seccoes[2].conteudo[1].paragrafo, ramo «deficitMenor» contém a palavra proibida «excedente» \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «o Orçamento previa para o ano inteiro um excedente de −1 789,8 milh…» |
| EX1-e: os dois sinais trocados | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «um excedente (recebeu mais do que gastou)» \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «é um excedente menor do que o que o Orçamento previa para o ano int…» |
| EX1-e: valor de outro perímetro, igualdade X6 com selo intacto | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… |
| EX1-d: a previsão anual apresentada como mensal | sim | X6 · o parágrafo seccoes[2].conteudo[1].paragrafo difere da conta.<br>      esperado: No fim de agosto de 2026, as contas da administração central e da s…<br>      rendido:  No fim de agosto de 2026, as contas da administração central e da s… |
| EX1-d: a contradição dos juros reposta | sim | X6 · o parágrafo naoDiz[0] difere da conta.<br>      esperado: O orçamento é uma previsão: o que se gasta de facto lê-se na execuç…<br>      rendido:  O orçamento é uma previsão: o que se gasta de facto lê-se na execuç… |
| as palavras de uma condição falsa rendidas (os três programas) | sim | X6 · o parágrafo seccoes[2].conteudo[0].paragrafo difere da conta.<br>      esperado: Até agosto de 2026, a administração central e a segurança social ti…<br>      rendido:  Até agosto de 2026, a administração central e a segurança social ti… |
| o nome de outra função | sim | X6 · o parágrafo abertura[0] difere da conta.<br>      esperado: O Orçamento do Estado para 2026 diz, euro a euro, para onde vai o d…<br>      rendido:  O Orçamento do Estado para 2026 diz, euro a euro, para onde vai o d… |
| um parágrafo a menos | sim | X6 · os parágrafos rendidos (abertura[0], seccoes[0].conteudo[1].paragrafo, seccoes[1].conteudo[0].paragrafo, seccoes[1].conteudo[2].paragrafo, seccoes[2].conteudo[1].paragrafo, seccoes[3].conteudo[0].paragrafo, naoDiz[0]) não são os que a conta dá (abertura[0], seccoes[0].conteudo[1].paragrafo, seccoes[1].conteudo[0].paragrafo, seccoes[1].conteudo[2].paragrafo, seccoes[2].conteudo[0].paragrafo, seccoes[2].conteudo[1].paragrafo, seccoes[3].conteudo[0].paragrafo, naoDiz[0]) |
| o ano trocado no título | sim | X5 · o título rendido («Para onde vai o dinheiro do Estado em 2025») não é o recomposto («Para onde vai o dinheiro do Estado em 2026») |
| o título de uma secção trocado | sim | X7 · os títulos das secções (Por programa \| Por ministério \| O que já se gastou este ano \| A dívida e o saldo \| O que isto não diz) não são os declarados (Por função \| Por ministério \| O que já se gastou este ano \| A dívida e o saldo \| O que isto não diz) |
| a ordem dos programas que mais gastaram trocada | sim | X6 · o parágrafo seccoes[2].conteudo[0].paragrafo difere da conta.<br>      esperado: Até agosto de 2026, a administração central e a segurança social ti…<br>      rendido:  Até agosto de 2026, a administração central e a segurança social ti… |
| a porta dos números tirada do fim | sim | X8 · falta a porta para os números e as fontes no fim \| X8 · as portas do fim (nenhuma) não são as declaradas (/livro-razao Números e fontes →) |
| o lado da dívida trocado | sim | X6 · o parágrafo seccoes[3].conteudo[0].paragrafo difere da conta.<br>      esperado: No fim de 2025, a dívida pública valia 89,7 % do que o país produz …<br>      rendido:  No fim de 2025, a dívida pública valia 89,7 % do que o país produz … \| X6 · palavras do ramo: seccoes[3].conteudo[0].paragrafo, ramo «maior» falta «acima» \| X6 · palavras do ramo: seccoes[3].conteudo[0].paragrafo, ramo «maior» contém a palavra proibida «abaixo» \| X6 · contabilidade dos ramos: ocorrência sem parágrafo que a escolheu: «abaixo dos 81,7 % da média da União Europeia» |
| uma marca das palavras declaradas num parágrafo que a célula não compara | sim | X · a marca das palavras declaradas está num sítio que a célula da explicação não confere (explicacao): <p> «Uma frase que ninguém compara.» |
| uma figura declarada tirada da página | sim | F22 · a figura declarada «ministerios» da explicação «dinheiro-do-estado-2026» não está na página |
| o selo de um valor tirado | sim | X8 · o valor de «oe-2026-cem-euros-funcao-07» num parágrafo não tem ao lado o selo do seu recibo |
| uma linha que não é dos programas no token «maiores» | sim | X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.pt[6] tem linhas fora da família /^execucao-2026-08-despesa-programa-\d{3}$/: oe-2026-despesa-ministerio-saude \| X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.en[6] tem linhas fora da família /^execucao-2026-08-despesa-programa-\d{3}$/: oe-2026-despesa-ministerio-saude |
| um programa a menos no token «maiores» | sim | X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.pt[6] não tem a família inteira /^execucao-2026-08-despesa-programa-\d{3}$/ do livro: faltam execucao-2026-08-despesa-programa-020 \| X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.en[6] não tem a família inteira /^execucao-2026-08-despesa-programa-\d{3}$/ do livro: faltam execucao-2026-08-despesa-programa-020 |
| EX1-f (pt): deficitMenor diz maior | sim | X10 · palavras do ramo: dinheiro-do-estado-2026: seccoes[2].conteudo[1].paragrafo.pt[7], ramo «deficitMenor» falta «menor» \| X10 · palavras do ramo: dinheiro-do-estado-2026: seccoes[2].conteudo[1].paragrafo.pt[7], ramo «deficitMenor» contém a palavra proibida «maior» |
| EX1-f (pt): diferentesPositivo sem a palavra do sinal | sim | X10 · palavras do ramo: dinheiro-do-estado-2026: seccoes[2].conteudo[1].paragrafo.pt[7], ramo «diferentesPositivo» falta «excedente» |
| EX1-f (pt): ramo sem declaração das palavras | sim | X10 · palavras do ramo: dinheiro-do-estado-2026: seccoes[2].conteudo[1].paragrafo.pt[7], ramo «deficitMenor» não declara as palavras obrigatórias e proibidas |
| EX1-f (en): deficitMenor diz maior | sim | X10 · palavras do ramo: dinheiro-do-estado-2026: seccoes[2].conteudo[1].paragrafo.en[7], ramo «deficitMenor» falta «smaller» \| X10 · palavras do ramo: dinheiro-do-estado-2026: seccoes[2].conteudo[1].paragrafo.en[7], ramo «deficitMenor» contém a palavra proibida «larger» |
| EX1-f (en): diferentesPositivo sem a palavra do sinal | sim | X10 · palavras do ramo: dinheiro-do-estado-2026: seccoes[2].conteudo[1].paragrafo.en[7], ramo «diferentesPositivo» falta «surplus» |
| EX1-f (en): ramo sem declaração das palavras | sim | X10 · palavras do ramo: dinheiro-do-estado-2026: seccoes[2].conteudo[1].paragrafo.en[7], ramo «deficitMenor» não declara as palavras obrigatórias e proibidas |
| o ramo «zero» tirado do sinal do saldo | sim | X10 · dinheiro-do-estado-2026: o token «sinal» em seccoes[2].conteudo[1].paragrafo.pt[5] não declara o ramo «zero» \| X10 · dinheiro-do-estado-2026: o token «sinal» em seccoes[2].conteudo[1].paragrafo.en[5] não declara o ramo «zero» \| X10 · dinheiro-do-estado-2026: o token «sinal» em seccoes[3].conteudo[0].paragrafo.pt[9] não declara o ramo «zero» \| X10 · dinheiro-do-estado-2026: o token «sinal» em seccoes[3].conteudo[0].paragrafo.en[9] não declara o ramo «zero» |
| um «n» maior do que a lista no token «maiores» | sim | X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.pt[6] tem n=21, fora de 1 a 20 \| X9 · dinheiro-do-estado-2026: o token «maiores» em seccoes[2].conteudo[0].paragrafo.en[6] tem n=21, fora de 1 a 20 |
| EX1-f: a referência aponta para o parágrafo anterior | sim | X · dinheiro-do-estado-2026: X2 · a folha « do parágrafo seguinte.» (seccoes[2].conteudo[1].paragrafo[10]), parte 1 (« do parágrafo seguinte.») não aponta para o parágrafo anterior declarado \| X · dinheiro-do-estado-2026: X2 · a folha « do parágrafo seguinte.» (seccoes[2].conteudo[1].paragrafo[10]), parte 1 (« do parágrafo seguinte.») não diz a posição declarada nas duas línguas |
| um literal que não está no campo que cita | sim | X · dinheiro-do-estado-2026: X2 · a folha «Para onde vai o dinheiro do Estado em » (titulo[0]), parte 1 («Para onde vai o dinheiro do Estado») cita «uma frase que nenhuma fonte escreveu», que não está no campo «excerto» da origem «dados-gov-oe-despesa-funcional» |
| uma conta fora de um ramo e de uma condição | sim | X · dinheiro-do-estado-2026: X2 · a folha « diz, euro a euro, para onde vai o dinheiro. De cada cem euros, » (abertura[0][2]), parte 1 (« diz, euro a euro,») está marcada como conta e não está num ramo do sinal nem em palavras guardadas por condições |
| uma folha sem auditoria | sim | X · dinheiro-do-estado-2026: X1 · a folha «Para onde vai o dinheiro do Estado em » (titulo[0]) não tem auditoria: uma explicação mudada precisa de nova leitura das origens |
| uma ligação com uma palavra que diz alguma coisa | sim | X · dinheiro-do-estado-2026: X1 · a folha « e » (abertura[0][14]) não tem auditoria: uma explicação mudada precisa de nova leitura das origens \| X · dinheiro-do-estado-2026: X1 · a auditoria tem uma folha (« e só », abertura[0][14]) que a declaração não tem |
| uma leitura do projeto sem dizer sobre o que é | sim | X · dinheiro-do-estado-2026: X2 · a folha «Para onde vai o dinheiro do Estado em » (titulo[0]), parte 1 («Para onde vai o dinheiro do Estado») é uma leitura do projeto e não diz sobre o que é («sobre») |
| uma porta do fim que a explicação não declara | sim | X · dinheiro-do-estado-2026: X2 · a folha « O detalhe por programa e por ministério, com a fonte de cada númer…» (naoDiz[0][2]), parte 2 («, com a fonte de cada número, está no recibo de cada um, a um toque.») aponta para a porta «estudo-oe-2026», que a explicação não declara no fim |
| o sha256 de uma origem trocado (com o motor ao lado) | sim | X3 · origem «dados-gov-oe-despesa-funcional»: o sha256 do ficheiro no motor (43bb18f15b66…) não é o do selo (000000000000…) \| X3 · origem «dados-gov-oe-despesa-funcional»: o sha256 do registo do pedido não é o do selo |

### Portões e capturas

Comando: `sh scripts/leituras/portoes.sh <worktree absoluta> design/especime-v3/medicoes/ex2-2026-10-06/portoes-f`. RESEARCHHUB_DIR foi definido apenas no ambiente para conferir as origens contra o motor local. Códigos lidos dos ficheiros após terminarem os processos, pela tranca comum; as cabeças inicial e final coincidem.

| Portão | Código lido |
|---|---|
| [build](portoes-f/build.codigo) | 0 |
| [verify](portoes-f/verify.codigo) | 0 |
| [typecheck](portoes-f/typecheck.codigo) | 0 |
| [explicacao](portoes-f/explicacao.codigo) | 0 |
| [acertos](portoes-f/acertos.codigo) | 0 |

- [PT, 390 px, inteira](../../capturas/ex2-2026-10-06/ex1f-pt-390-inteira.png).
- [PT, 390 px, correcoes](../../capturas/ex2-2026-10-06/ex1f-pt-390-correcoes.png).
- [PT, 1280 px, inteira](../../capturas/ex2-2026-10-06/ex1f-pt-1280-inteira.png).
- [PT, 1280 px, correcoes](../../capturas/ex2-2026-10-06/ex1f-pt-1280-correcoes.png).
- [EN, 390 px, inteira](../../capturas/ex2-2026-10-06/ex1f-en-390-inteira.png).
- [EN, 390 px, correcoes](../../capturas/ex2-2026-10-06/ex1f-en-390-correcoes.png).
- [EN, 1280 px, inteira](../../capturas/ex2-2026-10-06/ex1f-en-1280-inteira.png).
- [EN, 1280 px, correcoes](../../capturas/ex2-2026-10-06/ex1f-en-1280-correcoes.png).

O [manifesto](capturas-ex1f.json) guarda a cabeça, as frases, a ordem dos parágrafos, os SHA-256 e as medidas de largura. As capturas têm 0 erros de transbordo medidos; os recibos dos dois saldos abriram em cada edição e largura. A [inspeção visual](inspecao-ex1f.json) regista a leitura das imagens.

### Commits e custo

- `012f7231 EX1-f: registar a leitura, as plantas e o mandato`
- `5d74e100 EX1-f: prender as palavras ao ramo que os valores escolhem`
- `85c4d331 EX1-f: dizer que ainda faltam setembro a dezembro`
- `bf2659ff EX1-f: apontar para as contas públicas do parágrafo seguinte`
- `15520b75 EX1-f: render o ramo real na planta do sinal da previsão`
- `46d75e77 EX1-f: preparar os acertos e as provas da entrega`

O último commit acrescenta apenas os artefactos da entrega. Permanecem reservadas as questões EX1-11 e EX1-12 acima, além das linhas dos juros e do arredondamento de EX1-5 para JD1. A leitura a frio e a integração pertencem ao lugar de direção. Nenhum portão foi dispensado.

Custo-alvo: cem mil símbolos. Não foi observada uma linha «tokens used» desta construção; custo efetivo e confronto com o alvo: [verify], a apurar no registo do lançador.
