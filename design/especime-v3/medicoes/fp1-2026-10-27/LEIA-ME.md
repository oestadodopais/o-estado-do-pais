# FP1: relatório das cinco passagens

FP1-e implementada em `94dbf653d`. A construção dessa cabeça terminou com código 0. As conferências pedidas passaram, exceto `check:alvos`, que terminou com código 1 por `listen EPERM: operation not permitted 127.0.0.1`. A conferência dos alvos fica para execução fora da sandbox. A medição L1 e as capturas pertencem à cabeça comitada; entram neste segundo commit de comprovativos.

## O que mudou para o leitor

A primeira página começa por «O que há de novo», com as cinco peças mais recentes e as respetivas datas. As datas são as mesmas do arquivo: a publicação declarada quando existe, ou a data do ficheiro gerado usada por `dataPublicacao`. A marca «novo» usa a data que se imprime, comparada com o dia UTC da construção, até sete dias inclusive, e tem agora um espaço explícito antes do rótulo nas duas línguas. Na faixa de 641 a 1023 px, as ligações da caixa têm pelo menos 44 px de altura. Esta regra não altera as faixas de 390 e 1280 px.

O estudo «O Orçamento de 2027: o que muda e para quem» publica-se a 21.10.2026 nas duas edições. O comentário cita `6ec741c2d` e a §1.202. A data de 20.10 é a entrada no arquivo, não a aterragem; a história do contador ficou intacta. No empate de datas, os estudos precedem os outros tipos; depois usa-se a identidade da peça, para manter a mesma ordem nas duas línguas.

A peça «atualização» só é criada quando a última entrada do registo é uma correção ou atualização de valor. Uma publicação não a cria. Quando existe, usa os campos `reason`, `old_value` e `new_value` da própria entrada, com as marcas `data-correcao-*`, a ligação para as correções e a marca da fonte. As plantas conferem uma correção real e recusam a retirada da identidade de um valor. A última entrada atual anuncia uma publicação, pelo que a caixa não mostra «atualização».

O carimbo da construção é identificado apenas na linha «Atualizado a … · números do painel relidos na fonte a …», com a forma inglesa «Updated on … · panel figures re-read at the source on …». Isto não quer dizer que o dia não apareça noutra data: o intervalo «Entre 21.10.2026 e 27.10.2026» da leitura semanal é um período diferente e fica. «O que se passa» mostra só o período dos dados. O item do Orçamento repete-se na caixa e na discussão por decisão explícita: a primeira é a lista por data, a segunda é a porta permanente.

Os recibos só mostram os campos existentes. A data de alojamento de uma cópia não se apresenta como leitura na fonte. Só linhas não derivadas com releitura do painel recebem a próxima segunda-feira; a data de releitura não se repete quando coincide com a leitura já impressa. A medição da FP1-d encontrou 8 228 recibos, 182 próximas leituras, 148 releituras separadas e 7 184 datas de leitura. Esta passagem conserva essas regras. O portão e a vista usam agora a mesma função `eDerivada`.

`/estudos/` mostra o estado declarado de Évora e ordena os estudos em curso primeiro, depois as datas. Uma edição sem data, ou um estudo em curso sem data final, interrompe a construção com o identificador da peça; não se imprime `[verify]` ao leitor.

## As peças com data

As cinco primeiras posições entram na caixa. Todas as restantes ficam fora por serem a sexta ou posterior. O desempate está escrito no código e explicado acima. `pecas-fp1e.json` guarda as duas edições.

| Posição | Data | Peça | Campo ou ficheiro de origem |
|---|---|---|---|
| 1 | 2026-10-27 | O Orçamento de 2027 antes do voto na generalidade: o que os partidos e o Governo já disseram, ao lado do que a UTAO mede | `publicado da declaração` |
| 2 | 2026-10-26 | A casa em Portugal e na Europa | `studies.mjs: editions[].date` |
| 3 | 2026-10-21 | O Orçamento de 2027: o que muda e para quem | `studies.mjs: editions[].date` |
| 4 | 2026-10-21 | Para onde vai o dinheiro do Estado em 2027, pela proposta de Orçamento | `publicado da declaração` |
| 5 | 2026-10-19 | As parcerias rodoviárias: o que o Estado paga, o que vai pagar e o que não está no quadro | `publicado da declaração` |
| 6 | 2026-10-19 | O orçamento da Saúde para 2027: 3,0 % sem PRR ou −1,5 % no total? As duas contas, o que muda por dentro e o que ficou por dizer | `publicado da declaração` |
| 7 | 2026-10-06 | Para onde vai o dinheiro do Estado em 2026 | `publicado da declaração` |
| 8 | 2026-10-01 | Évora 2027, Capital Europeia da Cultura: o que a candidatura prometeu, o que o painel europeu escreveu e o dinheiro nos atos públicos | `src/data/datas-de-publicacao.json` |
| 9 | 2026-10-01 | As contas da Câmara de Évora, 2010 a 2025: o orçamento, a cobrança, a dívida e a certificação | `src/data/datas-de-publicacao.json` |
| 10 | 2026-10-01 | A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara | `src/data/datas-de-publicacao.json` |
| 11 | 2026-10-01 | Quem governou a Câmara de Évora, 2009 a 2025: as eleições, os executivos, os pelouros e as decisões | `src/data/datas-de-publicacao.json` |
| 12 | 2026-09-16 | Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em linhas | `src/data/datas-de-publicacao.json` |
| 13 | 2026-08-24 | Penalizações por Reforma Antecipada em Portugal | `src/data/datas-de-publicacao.json` |
| 14 | 2026-08-15 | Évora — Prometido, Pago, Auditado 2026 | `src/data/datas-de-publicacao.json` |
| 15 | 2026-08-12 | Água Não Faturada | `src/data/datas-de-publicacao.json` |
| 16 | 2026-08-12 | Alentejo & Algarve — Economy, Society, Strategy | `src/data/datas-de-publicacao.json` |
| 17 | 2026-08-12 | Avaliação Económica Regional de Portugal 2026 | `src/data/datas-de-publicacao.json` |
| 18 | 2026-08-12 | Evolução de Portugal desde 1981 | `src/data/datas-de-publicacao.json` |
| 19 | 2026-08-12 | Évora — Economia, Investidores, Portas Abertas 2026 | `src/data/datas-de-publicacao.json` |
| 20 | 2026-08-12 | Évora — Orçamentado, Pago, Devido 2025 | `src/data/datas-de-publicacao.json` |
| 21 | 2026-08-12 | Évora — Os Pelouros, Quem Os Teve, O Que Fizeram | `src/data/datas-de-publicacao.json` |
| 22 | 2026-08-12 | Évora — Quinze Anos, Cinco Mandatos | `src/data/datas-de-publicacao.json` |
| 23 | 2026-08-12 | Onde está a água? | `src/data/datas-de-publicacao.json` |
| 24 | 2026-08-12 | Which Door Is Yours — public funding in Portugal, August 2026 | `src/data/datas-de-publicacao.json` |

## Proveniência das datas e maquinaria

Os comentários junto dos campos distinguem a publicação da escrita. Para os dois itens da discussão citam a fusão com main `ac663f373`, a cabeça publicada `39f0195c` e as §§1.200 e 1.201. Para a explicação de 2026 citam a §1.170 e a fusão com main `d51f831a9`, com a prova `f3f988e70`; `escrita` conserva a data inicial de 05.10, usada para ordenar a lista, e a reescrita de 12.10 está identificada pela §1.185. Para a explicação de 2027 citam a cabeça publicada `a5f97262b`, §1.203, às 19:35 UTC de 21.10. O Orçamento na generalidade cita o recibo de aterragem às 00:30 UTC de 27.10 indicado pela direção. Estes registos de aterragem substituem as referências que apenas provavam commits de construção.

`stamp-version.mjs --preparar` cria o carimbo em `.astro/version.json` antes do Astro; o passo posterior copia o mesmo carimbo para `dist/version.json`, sem recalcular a hora. O `package.json` colocou essa preparação antes da construção e integrou as réguas de novidades e datas. Sem o ficheiro, `carimboDaConstrucao` devolve `null`; a caixa e a atualização não se rendem e o recibo não promete uma data. Foi conferida a ausência do ficheiro, sem arrancar `astro dev`.

`scripts/voz-pais.mjs` compara os títulos com as peças declaradas e dispensa apenas os elementos conferidos, sem isentar a caixa inteira. O inventário contém os rótulos e as duas frases de «O que se passa» dentro da sua tabela. Os rótulos «atualização» e «update» são condicionais à presença dessa peça. A condição do inventário só admite esses dois textos no bloco FP1; uma planta recusa qualquer outro texto ou bloco. A correção da fronteira de `read` conserva a palavra proibida e aceita a frase aprovada com `re-read`.

A isenção `data-editorial` fica limitada a elementos `time`, nas páginas, contextos e origens autorizados. O `why` de `ledger/allowlist.yml` identifica `novidades.mjs` para as duas primeiras páginas e `datas-do-recibo.mjs` para os recibos. A planta usa agora um `time` com origem válida fora do contexto e percorre a mesma função que chama a recusa no portão. O controlo dentro do contexto passa. A planta de `undefined` chama a própria guarda da comparação, tanto com o elemento ausente como com o elemento presente e texto ausente; não depende da contagem das linhas.

A base inicial foi construída antes de qualquer alteração. Foram contadas 62 ocorrências de valores nos cinco blocos. As listas e os cartões já tinham os períodos; foram acrescentados dois períodos à comparação do IHPC e 19 aos rótulos das barras. Os números e as fontes não foram alterados.

`typecheck` executa `tsc -p tsconfig.check.json`, com `checkJs` e `strict`: abrange os módulos de `src/lib`, `src/data` e `src/i18n`, as configurações declaradas e `api/**/*.js`. Não abrange `.astro`, `scripts/` nem `src/data/sobre.mjs`.

## Passagens, achados e conferências

| Passagem | Resultado e correção seguinte | Chamadas confirmadas |
|---|---|---|
| FP1 | Parou em 44 campos ausentes; a FP1-b condicionou a presença. | 47 |
| FP1-b | Parou na distinção entre leitura e alojamento; a FP1-c omitiu o campo indevido. | 48 |
| FP1-c | Construção e cartão a zero; primeiro commit `a157e8306`. | 24 |
| FP1-d | Corrigiu a seleção por data gerada, o calendário e a isenção; commit `32cc14fac`. | 50 |
| FP1-e | Corrige C2, H2, a publicação do estudo, a atualização e as plantas; resultados abaixo. | medição em custo.json |

A soma das quatro passagens fechadas é 169 chamadas. Foi recontada no registo de execução identificado pelo `pontos.json` do lançador, com separação pelos mandatos. Os turnos do lançador contam eventos de uso e não são a mesma medida. `custo.json` conserva essa distinção e a contagem da FP1-e.

A corrida inteira anterior encontrou C2 (marca colada) e H2 (alvos curtos). As duas réguas ficaram intactas. A primeira construção FP1-e parou na voz porque os rótulos condicionais eram tratados como frases sempre presentes; a primeira correção para «retirada» também foi recusada, por serem palavras que aparecem noutros textos. A forma final é a condição estreita descrita acima. Os códigos intermédios são conservados em `codigos.json`.

| Conferência FP1-e | Código observado |
|---|---|
| `build` da cabeça comitada | 0 |
| `check:css` | 0 |
| `check:alvos` | 1 por EPERM |
| `check:primeira:estatica` | 0 |
| `check:datas` | 0 |
| `check:voz` | 0 |
| `check:palavras` | 0 |
| `check:lingua` | 0 |
| `check:navegacao` | 0 |
| `check:cartao` | 0 |
| `check:lugar` | 0 |
| `check:indice-do-sitio` | 0 |
| `check:registo` | 0 |
| `ledger:check` | 0 |
| `typecheck` | 0 |

Os passos da construção só são indicados como zero quando a cadeia `&&` avançou. O guião das conferências continua após uma recusa de permissão autorizada; o seu código não substitui o código de cada conferência. Não se correu `verify` nem a corrida inteira dos portões nesta passagem.

## L1, capturas e commits

A medição L1 exige uma worktree limpa, o código zero do processo filho e a cabeça de `dist/version.json` igual ao Git. Nesta passagem corre depois do commit da implementação. O `l1-fp1.json` e os comprovativos finais entram no segundo commit. Não se altera o `dist/` à mão para trocar a cabeça.

As capturas foram refeitas pelo escrivão sobre `94dbf653d`: 30 páginas inteiras e 20 recortes, nas larguras 390, 768, 1024, 1280, 1600 px e nas duas edições. O manifesto `capturas.json` tem `ok: true`, sem falhas, e inclui os hashes das imagens. `pedido-capturas.json` conserva o pedido. As imagens ficam fora do repositório. A inspeção visual cobriu a caixa em português e inglês e as primeiras páginas e estudos nas cinco larguras.

A L1 terminou com código 0, 3404 páginas contadas e zero páginas novas; o teto não subiu. As cinco plantas da medição morderam. `l1-fp1.json` identifica a cabeça `94dbf653d`, construída depois do primeiro commit com a worktree limpa. Os excertos dos registos FP1-e conservam os resultados sem caminhos da máquina.

A contagem em `custo.json` é uma fotografia dos eventos já observados no registo do lançador. Não antecipa as chamadas do segundo commit nem da conferência final. A passagem gastou duas construções, 17 conferências isoladas, duas medições, dois controlos de sintaxe e uma corrida de capturas. Não correu os portões completos. O que fica aberto é a execução de `check:alvos` fora da sandbox.
