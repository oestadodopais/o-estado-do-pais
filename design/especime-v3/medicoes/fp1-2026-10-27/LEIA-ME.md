# FP1, FP1-b e FP1-c: novidades e datas na primeira página

**Estado: implementação verificada, com três conferências de navegador pendentes por permissão da sandbox.** Na FP1-c, `build`, `check:cartao`, `check:lugar`, `check:indice-do-sitio` e `typecheck` terminaram com código 0. As capturas pelo escrivão terminaram com código 0. `check:indice`, `check:primeira` e `check:frases-compostas` terminaram com código 1 por `listen EPERM: operation not permitted 127.0.0.1`; o lugar de direção terá de as correr fora da sandbox. Não se declara a verificação completa nem a publicação do ramo.

A FP1 parou em 44 recusas de `check:formas`: o cabeçalho tentava mostrar um período ausente. A FP1-b corrigiu a presença dos campos, mas parou na RP4N-h porque apresentava uma data de alojamento da cópia como leitura na fonte. A FP1-c omite a linha «lidos por este projeto a» quando `access_date_kind` é `hosted-copy`. O bloco inferior conserva «Cópia alojada a» e a prova. Não foi alterada a RP4N-h nem criada uma frase nova.

A conferência final percorreu 8 228 recibos, incluindo 44 sem período, 182 com reconferência do painel e quatro páginas de cópia alojada. As cinco plantas recusaram um campo ausente acrescentado, uma próxima leitura passada, uma releitura do painel retirada e o alojamento apresentado como leitura nas duas línguas. As outras quatro linhas do cabeçalho mantêm as condições da FP1-b.

## O que mudou no HTML construído

A caixa «O que há de novo» está acima de «O que se discute», nas duas línguas. Mostra cinco peças por data decrescente, com o tipo e a ligação. A linha de atualização lê o carimbo preparado antes do Astro e depois copiado para `dist/version.json`; a última releitura lê `VERIFICACAO.verificadoEm`.

«Estudos recentes» já tinha a data de publicação em todas as entradas medidas. Foi acrescentada a marca «novo», calculada com a data declarada da edição e o dia UTC da construção. `/estudos/` já tinha datas e ordem decrescente; foi acrescentada a prioridade dos estudos em curso.

A frase de «O que se passa» conserva o período dos dados e acrescenta o dia da construção. O novo cabeçalho do recibo acrescenta as datas na ordem pedida e calcula a segunda-feira estritamente posterior à construção. O recibo da dívida pública de 2025 mostrou a próxima leitura em 02.11.2026, pela construção de 27.10.2026. O bloco antigo que mostrava a próxima verificação pelo calendário da fonte foi retirado. A cobertura dos campos e do calendário passou na FP1-c, juntamente com a RP4N-h e as restantes conferências de `check:cartao`.

Os recibos de páginas que só têm data de edição conservam o rótulo de edição; essa data não passou a ser um período de dados. As exceções de «conferido a» e «lido na fonte a» em `scripts/voz-palavras.mjs` foram lidas. Não foi criada uma emenda da voz.

## As cinco peças medidas

| Data declarada | Título rendido em português | Campo de origem |
|---|---|---|
| 2026-10-27 | O Orçamento de 2027 antes do voto na generalidade: o que os partidos e o Governo já disseram, ao lado do que a UTAO mede | `discussao:orcamento-2027-generalidade.publicado` |
| 2026-10-26 | O que mudou | `mudancas:ultima` |
| 2026-10-26 | A casa em Portugal e na Europa | `studies:a-casa-em-portugal-e-na-europa/pt` |
| 2026-10-21 | Para onde vai o dinheiro do Estado em 2027, pela proposta de Orçamento | `explicacao:dinheiro-do-estado-2027.publicado` |
| 2026-10-19 | As parcerias rodoviárias: o que o Estado paga, o que vai pagar e o que não está no quadro | `discussao:parcerias-rodoviarias.publicado` |

A seleção inglesa tem as mesmas cinco identidades e datas, usando a edição inglesa do estudo e as rotas inglesas. `pecas.json` guarda a medição portuguesa, com as ligações.

As datas acrescentadas às declarações foram:

* Saúde e parcerias: 19.10.2026. O commit `f5ce0ef40`, de 19.10, introduziu os dois itens no ficheiro; `67b99bc30` continuou-os no mesmo dia. O `DECISIONS.md`, §1.201, regista o V2-b no ar às 20:42 UTC de 19.10. As datas 09.10 e 15.10 do mandato inicial pertencem às afirmações citadas, não à publicação destes itens. O §4 do mandato mandava usar o histórico conferido.
* Orçamento na generalidade: 27.10.2026, pela publicação às 00:30 UTC declarada no §4 do mandato. O histórico local confirma a cabeça de aterragem `6c6ae4313`, cujo commit é de 26.10 às 23:30 UTC; o commit, por si só, não mede a hora da publicação no ar.
* Explicação de 2026: 06.10.2026. O ficheiro entrou em `753e7ff0b`; a aterragem em 06.10 está no §1.170 e os portões da fusão estão registados em `f3f988e70`.
* Explicação de 2027: 21.10.2026, pelo registo da aterragem do EX4 em `a5f97262b` e pelo §1.203 do `DECISIONS.md`.

`origens.mjs` contém proveniência das explicações, não uma explicação autónoma. Não recebeu uma data de publicação nem uma entrada. As edições de estudos sem `date` ficam fora da caixa. Não foi atribuída uma data a partir do nome de um ficheiro ou de uma data citada no texto.

## Os períodos dos valores

A base foi construída nesta worktree antes das alterações: `build` 0, 394 segundos, cabeça `6c6ae4313`. Não foi usado o `dist/` da árvore principal. `base.json` guarda a medição.

Foram contadas 62 ocorrências de valores nos cinco blocos: preços 16, habitação 14, trabalho 16, Estado 6 e pobreza 10. Estas contagens incluem as repetições nas listas de números. Essas listas já tinham o período por linha, as colunas da dívida já tinham o ano por coluna, e as frases tinham o período, exceto a peça de comparação do IHPC. Na construção alterada foram acrescentados dois períodos nessa peça e 19 períodos junto dos rótulos das barras. Os cartões das medidas já rendiam o período junto do valor; a primeira página não contém esses cartões. As novas datas usam `DataDaLinha`, com a mesma forma do resto da página.

A conferência estática da primeira página passou com 76 plantas. A comparação da prosa só retira as novas anotações depois de conferir que a data e a linha correspondem ao campo declarado. Na FP1-c, as capturas não registaram transbordos horizontais. A conferência completa de geometria da primeira página continua pendente por EPERM.

## L1, frases e plantas

A base e a construção alterada mediram 3 404 páginas na L1. As duas primeiras páginas já pertenciam à contagem: cada uma passou de 20 para 23 destinos repetidos. Os três destinos acrescentados são as correções, o estudo da habitação e a explicação de 2027. A caixa conserva as cinco peças mais recentes; tirar a habitação da caixa contrariaria esse critério e retiraria o destaque pedido.

`medir-l1-fp1.mjs` e `l1-fp1.json` guardam a comparação, a justificação de cada agravamento e cinco plantas mordidas. O teto não precisa de subir. Na FP1-b, a referência `medicao` em `scripts/lugar-tetos-b1.json` passou a apontar para `design/especime-v3/medicoes/fp1-2026-10-27/l1-fp1.json`. O guião da medição não guardou o código completo do processo filho de `check:lugar`; o código 0 aqui referido é o da medição e das suas plantas.

A nova régua `tests/inicio/novidades.mjs` passou nas duas línguas. As cinco plantas pedidas morderam em cada uma: entrada sem página, data futura, ordem trocada, peça mais recente ausente e data sem marca de origem. A régua entra em `check:primeira` e `check:datas`. A N1B recebeu a classificação estrutural da caixa como mobília. A FP1-b acrescentou duas plantas N1B que recusam a caixa como bloco e a conferência dos campos e do calendário dos recibos. As plantas específicas dos períodos novos continuam pendentes.

O inventário é `design/especime-v3/INVENTARIO-FRASES.md`, lido pela maquinaria de `scripts/medir-defeitos.mjs` e da voz. Foram recolhidas 22 cadeias novas na superfície e dez rótulos nos dois recibos medidos: duas linhas do inventário foram substituídas e 30 acrescentadas. A entrada correspondente está em `critica/REVISOES-DO-INVENTARIO.md`. Estas mudanças passaram pelo `check:voz` na FP1-b. A régua `check:frases-compostas` mede geometria no navegador; não é o inventário das frases.

## Como a construção entrega as datas às páginas

`scripts/stamp-version.mjs --preparar` guarda o carimbo em `.astro/version.json` antes do Astro construir as páginas. O passo posterior copia o mesmo carimbo para `dist/version.json`, sem recalcular a hora, e recusa uma cabeça diferente. O `package.json` passou a executar a preparação antes de `astro build`. Assim, a página e o ficheiro publicado usam o mesmo `construido_em`, em vez de a página tentar ler um ficheiro que só existia depois da construção. `src/lib/construcao.mjs` lê esse carimbo e calcula a segunda-feira estritamente posterior ao seu dia UTC.

O `package.json` também inclui a régua das novidades em `check:primeira` e `check:datas`, e a conferência dos recibos em `check:datas`. `scripts/voz-pais.mjs` valida a caixa pela régua das novidades antes de a descontar da prosa fechada dos blocos; admite a marca de estudo novo e a data de atualização na frase existente. `ledger/allowlist.yml` documenta o uso de `data-editorial` para as datas editoriais e de calendário, sustentado pelas conferências das datas. Nenhum campo de origem foi criado no livro-razão para essas datas.

Na FP1-b, `scripts/check-pais.mjs` passou a comparar a lista pela ordem pedida, com os estudos em curso primeiro e depois a data decrescente. A planta de ordem trocada continua a recusar. `tests/discussao/itens.mjs` passou a esperar a caixa de novidades antes da discussão. Só desconta as repetições de ligações na caixa depois de conferir datas, títulos e marcas de origem. Foram acrescentadas plantas que retiram a caixa, trocam a data ou o título e deslocam uma ligação para fora dela. Na construção final, as 752 plantas da discussão passaram e foram conferidas 714 portas de integração; as 157 conferências OG1 também passaram.

Não se alteraram `check:formas` nem a RP4N-h para contornar as recusas. Não foi acrescentada outra frase para o leitor além das cadeias previstas no mandato; os rótulos de edição já existentes foram preservados.

## Códigos e limites da verificação

| Comando ou conferência | FP1 | FP1-b | FP1-c |
|---|---|---|---|
| `build` | Base 0; alterado 1 | 1, 1, 0 | 0, 408 segundos |
| `check:formas` | 1, 44 campos ausentes | 0 na construção final | 0 na construção |
| `gate:html`, `check:datas`, `check:registo`, `ledger:check` | 0 na cadeia da construção | 0 na construção final | 0 na construção |
| `check:primeira` | Estática 0; novidades 0 | Inteira por correr | 1 por EPERM; estática com 76 plantas e novidades com dez plantas passaram antes da recusa |
| `check:voz` | Final por correr | 0 | 0 na construção |
| `check:palavras` | Por correr | 0 | Não repetida; a correção não acrescentou palavras para o leitor |
| `check:lingua`, `check:navegacao` | Final por correr | 0 | 0 na construção |
| `check:cartao` | Por correr | 1, RP4N-h | 0 |
| `check:lugar` | Base 0; medição 0 | Código completo por correr | 0, código completo |
| `check:indice-do-sitio` | Por correr | Por correr | 0 |
| `check:indice` | Por correr | Por correr | 1 por EPERM |
| `check:frases-compostas` | Por correr | Por correr | 1 por EPERM |
| `check:discussao` | Final por correr | 0 na construção | 0 na construção |
| `typecheck` | 0 antes dos últimos acertos | Final por correr | 0 |
| Capturas pelo escrivão | Não feitas | Não feitas | 0 |
| Portões completos e `verify` | Não corridos | Não corridos | Não corridos |

`codigos.json` separa as três passagens e guarda os códigos isolados, durações e nomes dos registos. Nos passos internos da construção, o código 0 é demonstrado pela passagem ao comando seguinte na cadeia `&&` e pelo código 0 final. Os registos copiados estão limpos de caminhos da máquina. `fp1c-build.log` guarda a construção final; os registos individuais conservam as três recusas de permissão.

As duas primeiras construções da FP1-b terminaram, respetivamente, na ordem antiga da lista de estudos e na posição antiga da discussão. Essas comparações de mobília foram ajustadas à ordem pedida, com plantas; a terceira construção passou. A recusa posterior da RP4N-h levou à paragem e só foi corrigida com a decisão explícita da FP1-c.

A sequência final tentou as três conferências com navegador. Todas recusaram a abertura do servidor local com a mensagem `Error: listen EPERM: operation not permitted 127.0.0.1`. Não se pediu escalada nem se alteraram as réguas. O código 0 do guião que coordena estas tentativas significa que continuou após as recusas de permissão autorizadas pelo mandato; não substitui os códigos 1 individuais.

## Capturas e commit

O `captar.mjs`, através do escrivão, produziu 30 capturas integrais e 20 recortes: primeira página, recibo da dívida pública de 2025 e `/estudos/`, em português e inglês, a 390, 768, 1024, 1280 e 1600 px. Os recortes mostram a caixa de novidades e o cabeçalho do recibo. Não houve falhas nem transbordos horizontais nas medidas recolhidas.

O manifesto está em `capturas.json`, o pedido em `pedido-capturas.json` e o resultado do escrivão em `fp1c-capturas.log`. O manifesto conserva os hashes das imagens e dos recursos e a cabeça completa da construção, anterior ao commit desta passagem. As imagens ficam fora do repositório, na pasta `<temporario>/fp1c-capturas/`. Foram inspecionados os cabeçalhos a 390 px nas duas línguas e os topos da primeira página e de `/estudos/` nas cinco larguras e nas duas línguas. Esta inspeção não substitui as três conferências bloqueadas.

Foi preparado um único commit com a mudança das três passagens e este relatório, a pedir pelo `comitar.sh` depois de fechar os artefactos. O resultado do pedido e a cabeça resultante são comunicados na resposta final, sem inventar antecipadamente o identificador do próprio commit. Os trailers são os fornecidos pelo mandato, incluindo a sessão Claude indicada na FP1-c. Não há publicação nem `git push` nesta passagem.

## Custo

A FP1 terminou com 47 chamadas e oito comandos de construção ou conferência: duas construções e seis corridas isoladas, incluindo a medição do inventário. A FP1-b terminou com 48 chamadas e nove comandos: três construções e seis conferências isoladas, além de uma verificação auxiliar de sintaxe.

A FP1-c correu oito comandos de construção ou conferência: uma construção e sete conferências isoladas. Correu ainda um pedido de capturas, separado dessa contagem. Os passos internos de cada construção não contam como corridas independentes. Não houve corridas completas dos portões em nenhuma das três passagens.

`custo.json` guarda as contagens das chamadas e o último evento de tokens consultado antes do pedido final de commit. O custo em pontos pertence ao lançador.

Na medição anterior ao pedido de commit, a FP1-c tinha 22 chamadas e as três passagens somavam 117.

tokens used: 17363935, acumulados no último evento consultado.
