# FP1, FP1-b, FP1-c e FP1-d: novidades e datas na primeira página

**Estado final da FP1-d: construção e conferências sem navegador a zero, com três conferências pendentes por permissão da sandbox.** A construção final terminou com código 0 em 417 segundos. Voz, palavras, língua, navegação, cartão, L1, índice do sítio e tipos passaram também isoladamente. As capturas renovadas pelo escrivão passaram. `check:indice`, `check:primeira` e `check:frases-compostas` terminaram com código 1 por `listen EPERM: operation not permitted 127.0.0.1`; ficam para execução fora da sandbox. Não se declara a verificação completa nem a publicação do ramo.

A FP1 parou em 44 recusas de `check:formas`: o cabeçalho tentava mostrar um período ausente. A FP1-b corrigiu a presença dos campos, mas parou na RP4N-h porque apresentava uma data de alojamento da cópia como leitura na fonte. A FP1-c omite a linha «lidos por este projeto a» quando `access_date_kind` é `hosted-copy`. O bloco inferior conserva «Cópia alojada a» e a prova. Não foi alterada a RP4N-h nem criada uma frase nova.

A conferência final percorreu 8 228 recibos, incluindo 44 sem período, 182 com reconferência do painel e quatro páginas de cópia alojada. As cinco plantas recusaram um campo ausente acrescentado, uma próxima leitura passada, uma releitura do painel retirada e o alojamento apresentado como leitura nas duas línguas. As outras quatro linhas do cabeçalho mantêm as condições da FP1-b.

## Leitura a frio e correções da FP1-d

1. A caixa omitira as edições sem `date`, apesar de o arquivo já lhes atribuir uma data gerada. A seleção usa agora `dataPublicacao`, como «Estudos recentes» e «publicado a». A marca «novo» usa `e.data`, a mesma data que se imprime. A régua recusa retirar o estudo com data gerada, retirar a marca e trocar o título de uma peça.
2. As datas de publicação mantêm-se. Comentários junto das declarações distinguem a entrada no ar, `publicado`, da última reescrita, `escrita`, e identificam os commits, as decisões e o recibo de aterragem indicados pela direção. A referência da explicação de 2027 foi corrigida no relatório para `a68946d7d`, §1.203.
3. A próxima leitura só aparece para linhas não derivadas com reconferência do painel semanal. A releitura deixa de se repetir quando coincide com o dia da leitura já mostrada. Foram medidos 8 228 recibos, 182 próximas leituras, 148 datas de releitura separadas e 7 184 datas de leitura. As plantas recusam uma próxima leitura numa derivada, numa linha sem releituras e um período ausente mostrado como `undefined`.
4. `data-editorial` ficou restrito a elementos `time`, nas páginas e contextos autorizados e com origens de uma lista fechada. O portão usa `scripts/datas-editoriais.mjs`; a planta de um número fora desses contextos foi recusada na corrida do portão. O `why` identifica as duas réguas que comparam as datas com as fontes, em vez de lhes atribuir uma cobertura que não tinham.
5. `/estudos/` mostra o estado declarado de Évora. A comparação da ficha foi alargada às duas formas das listas, sem dispensar o lugar, tema, data ou estado; a planta de estado trocado é recusada. A voz confere os títulos e dispensa apenas os elementos conferidos, sem isentar a caixa inteira. A medição L1 recusa o código de erro do processo filho e exige a cabeça de `dist/version.json` igual à cabeça do Git. O comentário do calendário foi corrigido. Sem ficheiro de carimbo, `carimboDaConstrucao` devolve `null`; a caixa e a linha de atualização não se rendem e o recibo não promete uma data. A ausência foi conferida numa pasta temporária, sem arrancar `astro dev`.
6. A data da construção aparece uma única vez. «O que se passa» voltou ao período dos dados; o inventário foi atualizado. A caixa diz «números relidos na fonte a» e «figures re-read at the source on». A regra da voz apanhava `read` dentro de `re-read`; a fronteira da palavra passou a ser explícita, com uma planta que conserva a proibição de `read at the source on`. A atualização reproduz a primeira frase da última entrada do registo: neste caso, «Estudo publicado · A casa em Portugal e na Europa», com a forma inglesa do próprio registo e a porta para as correções.

O item do Orçamento mantém-se na caixa e logo abaixo na discussão: a caixa é a lista por data; a discussão é a porta permanente. A repetição foi mantida por decisão explícita do mandato.

`typecheck` executa `tsc -p tsconfig.check.json`: confere os módulos de `src/lib`, `src/data` e `src/i18n`, as configurações declaradas e `api/**/*.js`, com `checkJs` e `strict`. Não confere os ficheiros `.astro`, os guiões de `scripts/` ou `src/data/sobre.mjs`; o código 0 não cobre essas superfícies.

## O que mudou no HTML construído

A caixa «O que há de novo» está acima de «O que se discute», nas duas línguas. Mostra cinco peças por data decrescente, com o tipo e a ligação. A linha de atualização lê o carimbo preparado antes do Astro e depois copiado para `dist/version.json`; a última releitura lê `VERIFICACAO.verificadoEm`.

«Estudos recentes» já tinha a data de publicação em todas as entradas medidas. Foi acrescentada a marca «novo», calculada com a data declarada da edição e o dia UTC da construção. `/estudos/` já tinha datas e ordem decrescente; foi acrescentada a prioridade dos estudos em curso.

Na versão final da FP1-d, «O que se passa» conserva apenas o período dos dados; o dia da construção aparece só na caixa. O cabeçalho do recibo apresenta os campos existentes e calcula a segunda-feira estritamente posterior à construção apenas para as linhas acompanhadas pelo painel, nas condições da FP1-d. O recibo da dívida pública de 2025 mostrou a próxima leitura em 02.11.2026, pela construção de 27.10.2026. O bloco antigo que mostrava a próxima verificação pelo calendário da fonte foi retirado. A cobertura dos campos e do calendário passou na FP1-c, juntamente com a RP4N-h e as restantes conferências de `check:cartao`.

Os recibos de páginas que só têm data de edição conservam o rótulo de edição; essa data não passou a ser um período de dados. As exceções de «conferido a» e «lido na fonte a» em `scripts/voz-palavras.mjs` foram lidas. Não foi criada uma emenda da voz.

## Peças datadas, na caixa e fora dela

A lista seguinte nomeia as 25 peças da edição portuguesa. As cinco primeiras entram na caixa. As restantes 20 ficam fora apenas pela posição na ordenação decrescente da data, com desempate pela identidade. A edição inglesa conserva as mesmas identidades e datas; `pecas-fp1d.json` guarda ambas as listas e os títulos de cada língua.

| Posição | Data | Peça | Origem |
|---|---|---|---|
| 1 | 2026-10-27 | O Orçamento de 2027 antes do voto na generalidade: o que os partidos e o Governo já disseram, ao lado do que a UTAO mede | `discussao:orcamento-2027-generalidade`: `publicacao.declarada` |
| 2 | 2026-10-26 | Estudo publicado · A casa em Portugal e na Europa | `atualizacao:registo`: `mudancas.ultima` |
| 3 | 2026-10-26 | A casa em Portugal e na Europa | `estudo:a-casa-em-portugal-e-na-europa`: `publicacao.declarada` |
| 4 | 2026-10-21 | Para onde vai o dinheiro do Estado em 2027, pela proposta de Orçamento | `explicacao:dinheiro-do-estado-2027`: `publicacao.declarada` |
| 5 | 2026-10-20 | O Orçamento de 2027: o que muda e para quem | `estudo:orcamento-2027-o-que-muda-e-para-quem`: `publicacao.gerada` |
| 6 | 2026-10-19 | As parcerias rodoviárias: o que o Estado paga, o que vai pagar e o que não está no quadro | `discussao:parcerias-rodoviarias`: `publicacao.declarada` |
| 7 | 2026-10-19 | O orçamento da Saúde para 2027: 3,0 % sem PRR ou −1,5 % no total? As duas contas, o que muda por dentro e o que ficou por dizer | `discussao:saude-no-orcamento`: `publicacao.declarada` |
| 8 | 2026-10-06 | Para onde vai o dinheiro do Estado em 2026 | `explicacao:dinheiro-do-estado-2026`: `publicacao.declarada` |
| 9 | 2026-10-01 | Évora 2027, Capital Europeia da Cultura: o que a candidatura prometeu, o que o painel europeu escreveu e o dinheiro nos atos públicos | `estudo:evora-2027-capital-europeia-da-cultura`: `publicacao.gerada` |
| 10 | 2026-10-01 | As contas da Câmara de Évora, 2010 a 2025: o orçamento, a cobrança, a dívida e a certificação | `estudo:evora-contas-da-camara-2010-2025`: `publicacao.gerada` |
| 11 | 2026-10-01 | A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara | `estudo:evora-economia-e-dinheiro-publico-de-fora-da-camara`: `publicacao.gerada` |
| 12 | 2026-10-01 | Quem governou a Câmara de Évora, 2009 a 2025: as eleições, os executivos, os pelouros e as decisões | `estudo:evora-quem-governou-a-camara-2009-2025`: `publicacao.gerada` |
| 13 | 2026-09-16 | Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em linhas | `estudo:evora-2027-prometido-painel-dinheiro`: `publicacao.gerada` |
| 14 | 2026-08-24 | Penalizações por Reforma Antecipada em Portugal | `estudo:penalizacoes-por-reforma-antecipada-2026`: `publicacao.gerada` |
| 15 | 2026-08-15 | Évora — Prometido, Pago, Auditado 2026 | `estudo:evora-prometido-pago-auditado-2026`: `publicacao.gerada` |
| 16 | 2026-08-12 | Água Não Faturada | `estudo:agua-nao-faturada`: `publicacao.gerada` |
| 17 | 2026-08-12 | Alentejo & Algarve — Economy, Society, Strategy | `estudo:alentejo-algarve`: `publicacao.gerada` |
| 18 | 2026-08-12 | Avaliação Económica Regional de Portugal 2026 | `estudo:avaliacao-economica-regional-de-portugal-2026`: `publicacao.gerada` |
| 19 | 2026-08-12 | Evolução de Portugal desde 1981 | `estudo:evolucao-de-portugal-desde-1981`: `publicacao.gerada` |
| 20 | 2026-08-12 | Évora — Economia, Investidores, Portas Abertas 2026 | `estudo:evora-economia-investidores-portas-abertas-2026`: `publicacao.gerada` |
| 21 | 2026-08-12 | Évora — Orçamentado, Pago, Devido 2025 | `estudo:evora-orcamentado-pago-devido-2025`: `publicacao.gerada` |
| 22 | 2026-08-12 | Évora — Os Pelouros, Quem Os Teve, O Que Fizeram | `estudo:evora-os-pelouros-quem-os-teve-o-que-fizeram`: `publicacao.gerada` |
| 23 | 2026-08-12 | Évora — Quinze Anos, Cinco Mandatos | `estudo:evora-quinze-anos-cinco-mandatos`: `publicacao.gerada` |
| 24 | 2026-08-12 | Onde está a água? | `estudo:onde-esta-a-agua`: `publicacao.gerada` |
| 25 | 2026-08-12 | Which Door Is Yours — public funding in Portugal, August 2026 | `estudo:which-door-is-yours`: `publicacao.gerada` |

`publicacao.gerada` lê `src/data/datas-de-publicacao.json`; `publicacao.declarada` lê a edição de `studies.mjs` com publicação declarada ou o `publicado` da peça indicada. `mudancas.ultima` lê a primeira entrada de `mudancasDoRegisto`. Os rótulos de origem não substituem a identidade da peça, que a régua também confere.

As datas acrescentadas às declarações foram:

* Saúde e parcerias: 19.10.2026. O commit `f5ce0ef40`, de 19.10, introduziu os dois itens no ficheiro; `67b99bc30` continuou-os no mesmo dia. O `DECISIONS.md`, §1.201, regista o V2-b no ar às 20:42 UTC de 19.10. As datas 09.10 e 15.10 do mandato inicial pertencem às afirmações citadas, não à publicação destes itens. O §4 do mandato mandava usar o histórico conferido.
* Orçamento na generalidade: 27.10.2026, pela publicação às 00:30 UTC declarada no §4 do mandato. O histórico local confirma a cabeça de aterragem `6c6ae4313`, cujo commit é de 26.10 às 23:30 UTC; o commit, por si só, não mede a hora da publicação no ar.
* Explicação de 2026: 06.10.2026. O ficheiro entrou em `753e7ff0b`; a aterragem em 06.10 está no §1.170 e os portões da fusão estão registados em `f3f988e70`.
* Explicação de 2027: 21.10.2026, pelo registo da aterragem do EX4 em `a68946d7d` e pelo §1.203 do `DECISIONS.md`.

`origens.mjs` contém proveniência das explicações, não uma explicação autónoma. Não recebeu uma data de publicação nem uma entrada. Na FP1-d, as edições sem data declarada usam a data gerada que já serve o arquivo; só a ausência de ambas impediria a entrada. Não foi atribuída uma data a partir do nome de um ficheiro ou de uma data citada no texto.

## Os períodos dos valores

A base foi construída nesta worktree antes das alterações: `build` 0, 394 segundos, cabeça `6c6ae4313`. Não foi usado o `dist/` da árvore principal. `base.json` guarda a medição.

Foram contadas 62 ocorrências de valores nos cinco blocos: preços 16, habitação 14, trabalho 16, Estado 6 e pobreza 10. Estas contagens incluem as repetições nas listas de números. Essas listas já tinham o período por linha, as colunas da dívida já tinham o ano por coluna, e as frases tinham o período, exceto a peça de comparação do IHPC. Na construção alterada foram acrescentados dois períodos nessa peça e 19 períodos junto dos rótulos das barras. Os cartões das medidas já rendiam o período junto do valor; a primeira página não contém esses cartões. As novas datas usam `DataDaLinha`, com a mesma forma do resto da página.

A conferência estática da primeira página passou com 76 plantas. A comparação da prosa só retira as novas anotações depois de conferir que a data e a linha correspondem ao campo declarado. Na FP1-c, as capturas não registaram transbordos horizontais. A conferência completa de geometria da primeira página continua pendente por EPERM.

## L1, frases e plantas

A base e a construção alterada mediram 3 404 páginas na L1. As duas primeiras páginas já pertenciam à contagem: na FP1, cada uma passou de 20 para 23 destinos repetidos. Na FP1-d passou para 24: aos destinos das correções, do estudo da habitação e da explicação de 2027 juntou-se o estudo do Orçamento, datado pelo ficheiro gerado. A nova medição e as cinco plantas passaram com código 0, incluindo o processo filho de `check:lugar`. A caixa conserva as cinco peças mais recentes; tirar a habitação da caixa contrariaria esse critério e retiraria o destaque pedido.

`medir-l1-fp1.mjs` e `l1-fp1.json` guardam a comparação, a justificação de cada agravamento e cinco plantas mordidas. O teto não precisa de subir. Na FP1-b, a referência `medicao` em `scripts/lugar-tetos-b1.json` passou a apontar para `design/especime-v3/medicoes/fp1-2026-10-27/l1-fp1.json`. Na FP1-d, o guião passou a respeitar o código completo de `check:lugar` e a conferir a cabeça da construção antes de guardar a medição.

A nova régua `tests/inicio/novidades.mjs` passou nas duas línguas. As cinco plantas pedidas morderam em cada uma: entrada sem página, data futura, ordem trocada, peça mais recente ausente e data sem marca de origem. A régua entra em `check:primeira` e `check:datas`. A N1B recebeu a classificação estrutural da caixa como mobília. A FP1-b acrescentou duas plantas N1B que recusam a caixa como bloco e a conferência dos campos e do calendário dos recibos. As plantas específicas dos períodos novos continuam pendentes.

O inventário é `design/especime-v3/INVENTARIO-FRASES.md`, lido pela maquinaria de `scripts/medir-defeitos.mjs` e da voz. Foram recolhidas 22 cadeias novas na superfície e dez rótulos nos dois recibos medidos: duas linhas do inventário foram substituídas e 30 acrescentadas. A entrada correspondente está em `critica/REVISOES-DO-INVENTARIO.md`. Estas mudanças passaram pelo `check:voz` na FP1-b. A régua `check:frases-compostas` mede geometria no navegador; não é o inventário das frases.

## Como a construção entrega as datas às páginas

`scripts/stamp-version.mjs --preparar` guarda o carimbo em `.astro/version.json` antes do Astro construir as páginas. O passo posterior copia o mesmo carimbo para `dist/version.json`, sem recalcular a hora, e recusa uma cabeça diferente. O `package.json` passou a executar a preparação antes de `astro build`. Assim, a página e o ficheiro publicado usam o mesmo `construido_em`, em vez de a página tentar ler um ficheiro que só existia depois da construção. `src/lib/construcao.mjs` lê esse carimbo e calcula a segunda-feira estritamente posterior ao seu dia UTC.

O `package.json` também inclui a régua das novidades em `check:primeira` e `check:datas`, e a conferência dos recibos em `check:datas`. `scripts/voz-pais.mjs` valida a caixa pela régua das novidades antes de a descontar da prosa fechada dos blocos; admite a marca de estudo novo e a data de atualização na frase existente. `ledger/allowlist.yml` documenta o uso de `data-editorial` para as datas editoriais e de calendário, sustentado pelas conferências das datas. Nenhum campo de origem foi criado no livro-razão para essas datas.

Na FP1-b, `scripts/check-pais.mjs` passou a comparar a lista pela ordem pedida, com os estudos em curso primeiro e depois a data decrescente. A planta de ordem trocada continua a recusar. `tests/discussao/itens.mjs` passou a esperar a caixa de novidades antes da discussão. Só desconta as repetições de ligações na caixa depois de conferir datas, títulos e marcas de origem. Foram acrescentadas plantas que retiram a caixa, trocam a data ou o título e deslocam uma ligação para fora dela. Na construção final, as 752 plantas da discussão passaram e foram conferidas 714 portas de integração; as 157 conferências OG1 também passaram.

Não se alteraram `check:formas` nem a RP4N-h para contornar as recusas. Não foi acrescentada outra frase para o leitor além das cadeias previstas no mandato; os rótulos de edição já existentes foram preservados.

## Códigos e limites da verificação

| Comando ou conferência | FP1 | FP1-b | FP1-c | FP1-d |
|---|---|---|---|---|
| `build` | Base 0; alterado 1 | 1, 1, 0 | 0 | 1, depois 0 |
| `check:formas` | 1 | 0 | 0 | 0 na construção |
| `gate:html`, `check:datas`, `check:registo`, `ledger:check` | 0 na cadeia | 0 | 0 | 0 na construção |
| `check:voz` | Final por correr | 0 | 0 | 0 na construção e isoladamente |
| `check:palavras` | Por correr | 0 | Não repetida | 0 |
| `check:lingua`, `check:navegacao` | Final por correr | 0 | 0 | 0 |
| `check:cartao` | Por correr | 1 | 0 | 0 |
| `check:lugar` | Base e medição 0 | Código completo por correr | 0 | 0; nova medição 0 |
| `check:indice-do-sitio` | Por correr | Por correr | 0 | 0 |
| `check:indice` | Por correr | Por correr | 1 por EPERM | 1 por EPERM |
| `check:primeira` | Estática 0 | Inteira por correr | 1 por EPERM | 1 por EPERM; novidades e parte estática passaram |
| `check:frases-compostas` | Por correr | Por correr | 1 por EPERM | 1 por EPERM |
| `check:discussao` | Final por correr | 0 | 0 | 0 na construção |
| `typecheck` | 0 antes dos últimos acertos | Por repetir | 0 | 0 final; primeiro acerto de tipos teve código 1 |
| Capturas pelo escrivão | Não feitas | Não feitas | 0 | 0 |
| Portões completos e `verify` | Não corridos | Não corridos | Não corridos | Não corridos |

`codigos.json` separa as quatro passagens e guarda os códigos isolados, durações e nomes dos registos. Nos passos internos da construção, o código 0 é demonstrado pela passagem ao comando seguinte na cadeia `&&` e pelo código 0 final. Os registos copiados estão limpos de caminhos da máquina. `fp1d-build-final.log` guarda a construção final; os registos individuais conservam as três recusas de permissão.

As duas primeiras construções da FP1-b terminaram, respetivamente, na ordem antiga da lista de estudos e na posição antiga da discussão. Essas comparações de mobília foram ajustadas à ordem pedida, com plantas; a terceira construção passou. A recusa posterior da RP4N-h levou à paragem e só foi corrigida com a decisão explícita da FP1-c.

A sequência final tentou as três conferências com navegador. Todas recusaram a abertura do servidor local com a mensagem `Error: listen EPERM: operation not permitted 127.0.0.1`. Não se pediu escalada nem se alteraram as réguas. O código 0 do guião que coordena estas tentativas significa que continuou após as recusas de permissão autorizadas pelo mandato; não substitui os códigos 1 individuais.

## Capturas e commits

Na FP1-d, o `captar.mjs`, através do escrivão, voltou a produzir 30 capturas integrais e 20 recortes: primeira página, recibo da dívida pública de 2025 e `/estudos/`, em português e inglês, a 390, 768, 1024, 1280 e 1600 px. Os recortes mostram a caixa de novidades e o cabeçalho do recibo. Não houve falhas nem transbordos horizontais nas medidas recolhidas.

O manifesto está em `capturas.json`, o pedido em `pedido-capturas.json` e o resultado do escrivão em `fp1d-capturas.log`. O manifesto conserva os hashes das imagens e dos recursos e a cabeça completa da construção, anterior ao commit desta passagem. As imagens ficam fora do repositório, na pasta `<temporario>/fp1d-capturas/`. Foram inspecionados os cabeçalhos a 390 px nas duas línguas e os topos da primeira página e de `/estudos/` nas cinco larguras e nas duas línguas. Esta inspeção não substitui as três conferências bloqueadas.

O commit `a157e8306` guardou as primeiras três passagens. A FP1-d prepara um segundo commit, pelo `comitar.sh`, com as correções da leitura a frio e este relatório. O resultado do pedido e a cabeça resultante são comunicados na resposta final, sem inventar antecipadamente o identificador do próprio commit. Os trailers são os fornecidos pelo mandato, incluindo a sessão Claude indicada na FP1-c. Não há publicação nem `git push` nesta passagem.

## Custo

A FP1 terminou com 47 chamadas e oito comandos de construção ou conferência: duas construções e seis corridas isoladas, incluindo a medição do inventário. A FP1-b terminou com 48 chamadas e nove comandos: três construções e seis conferências isoladas, além de uma verificação auxiliar de sintaxe.

A FP1-c correu oito comandos de construção ou conferência: uma construção e sete conferências isoladas. Correu ainda um pedido de capturas, separado dessa contagem. Os passos internos de cada construção não contam como corridas independentes. Não houve corridas completas dos portões em nenhuma das quatro passagens.

`custo.json` guarda as contagens das chamadas e o último evento de tokens consultado antes do pedido final de commit. O custo em pontos pertence ao lançador.

Na medição anterior ao pedido de commit, a FP1-c tinha 22 chamadas e as três passagens somavam 117.

tokens used: 17363935, acumulados no último evento consultado.

Na FP1-d correram 21 comandos de construção, conferência ou medição: duas construções, 17 conferências isoladas e duas medições (L1 e cabeçalhos/lista de peças). Houve ainda dois controlos auxiliares, da isenção editorial e da ausência do carimbo, e um pedido de capturas. As 19 plantas das novidades, oito dos recibos, duas da isenção editorial e cinco da L1 passaram. Os códigos intermédios de tipo, forma e voz estão conservados; não são apresentados como resultados finais.

Na medição de fecho dos artefactos, a FP1-d tinha 47 chamadas; as quatro passagens somavam 166. O pedido de commit e a inspeção do resultado vêm depois desta medição.

tokens used: 24357313, acumulados no último evento consultado.
