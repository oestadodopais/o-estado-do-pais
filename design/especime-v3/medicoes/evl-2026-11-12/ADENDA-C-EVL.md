# Adenda C do EVL: os sete vermelhos das conferências, em três causas (12.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `evl-2026-11-12`; a outra pasta com escrita é a worktree do motor `evl-2026-11-12`, onde não tens nada a mudar. Uma correção: quarenta e cinco minutos e sessenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVL`. O teu relatório vai para `design/especime-v3/medicoes/evl-2026-11-12/RELATORIO-EVL-C.txt`, com dez linhas, e as tuas medidas e registos para a mesma pasta (`medidas-do-construtor-evl-c.json`, `evl-c-conferencias/`), não para a raiz do repositório.*

## Porquê

O `build` da cabeça parou no `check:voz`. Para não descobrir uma causa de cada vez, este lugar correu quarenta e duas conferências sobre o `dist/` da cabeça `2f31e7247`, sem parar na primeira: trinta e cinco verdes, sete vermelhas, em três causas. O resumo e os três registos estão em `conferir-dirigidas-evl/`, nesta pasta. As três são omissões do mandato deste lugar: não nomeou estas listas nem pôs estas conferências na prova.

## §0 O que se mediu

1. **A voz** (`check:voz` e `check:voz-retiradas`). A lista fechada B1 recusa os textos das duas medidas novas do cartão na página de entrada e na lista dos estudos, nas duas línguas: treze recusas em cada página de entrada e sete em cada lista. Os nomes das medidas deste cartão têm uma referência de ano a meio, e chegam à régua partidos em nós de texto; os nomes das medidas dos outros cartões não têm.
2. **A língua** (`check:lingua`, e o `check:eo1`, que a repete). Onze recusas: os dois títulos de documento e os dois organismos das linhas novas não têm língua declarada em `src/i18n/lingua-dos-titulos.mjs`; as quatro linhas com `document.locator` não têm o documento declarado; e três localizadores saem na edição inglesa sem a marca de língua.
3. **Os alvos** (`check:alvos`, as três fatias, a célula H2). Quatro selos de fonte do cartão, os da medida calculada, na página de entrada e na lista dos estudos, nas duas línguas, ficam sem a área de toque de quarenta e quatro píxeis entre as larguras de tablet: a régua mede-os com cerca de vinte e nove de altura.

## O que fazes

1. **A voz.** A lista fechada passa a reconhecer o nome de uma medida de um cartão pelo texto inteiro do seu elemento, com as referências de ano resolvidas, contra o nome declarado em `src/data/leituras.mjs`, e o valor, a unidade e o selo pelo caminho que já serve os outros cartões; não se acrescentam cadeias soltas à lista. Plantas: um nome de medida com uma palavra trocada recusa; um ano trocado recusa; um texto solto no cartão que não seja de uma medida declarada recusa.

2. **A língua.** As declarações que faltam, na forma das que existem: o relatório de atividades e contas da associação é português; o segundo relatório de monitorização do painel é inglês; os dois organismos, como a casa declara os organismos portugueses. Os localizadores levam a marca que a regra pede em cada edição. Nada no texto dos recibos muda.

3. **Os alvos.** O selo de fonte de uma medida de cartão tem a mesma área de toque que os selos das medidas dos outros cartões, em todas as larguras. Diz o que distinguia estes quatro.

4. **A prova.** `check:voz`, `check:voz-retiradas`, `check:lingua` e `check:eo1`, sobre um `dist/` reconstruído se a sandbox deixar, com cada código lido de um ficheiro. O `check:alvos` precisa do navegador: corre-o este lugar, com o `build` inteiro e as outras conferências.

## O que fica como está, por decisão

As frases do cartão e dos recibos, os nomes das medidas com os seus anos, as cinco linhas, o motor.

## Quando paras

Se a voz só passar tirando o ano do nome de uma medida, ou a língua só passar mudando o texto de um recibo. Para tudo o resto: decide, anota e continua.

## O fim

O relatório em dez linhas: os três pontos, as plantas, os códigos, o que ficou por correr.
