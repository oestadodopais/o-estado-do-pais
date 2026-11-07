# VIG2: resumo da vigilância em partes

O resumo mínimo já não impede a gravação da corrida quando as designações e os cabeçalhos acumulados excedem o limite. O motor reserva as designações dos atos e iniciativas, depois os cabeçalhos do DAR, e distribui descrições e oradores pelo espaço restante. Cada parte fica abaixo de 2500 bytes UTF-8. A primeira contém as linhas comuns e a indicação das restantes; a arrumação fica na última.

`detalhes_resumo` devolve a lista `partes`, mantendo `texto` como primeira parte. `executar` grava `resumo/<dia>.md`, `resumo/<dia>-2.md` e seguintes. O recibo acrescenta `resumo.partes.quantidade` e `resumo.partes.bytes`, pela ordem das partes. O campo anterior `limite_superior_simbolos` mede a primeira parte. As referências de arquivo e catálogo voltam a ser definidas em cada parte que delas precisa. Uma segunda corrida do mesmo dia elimina apenas partes numéricas desse dia que tenham sobrado.

A verificação lê os ficheiros, confere os bytes com o recibo, a numeração e a união das designações e dos cabeçalhos contra o índice, incluindo duplicações. Corre também durante a escrita. A prova através de `executar`, com transporte simulado, confirma a gravação do índice, recibo e estado.

## Provas e códigos

| Prova pedida | Código | Resultado |
| --- | --- | --- |
| Acumulação cujo mínimo excede o limite | 0 | Três partes; todas as designações e os oito cabeçalhos presentes |
| Designação retirada | 0 | Verificador recusa a adulteração |
| Parte acima do limite | 0 | Verificador recusa 2500 e 2501 bytes |
| Número de partes errado na primeira | 0 | Verificador recusa a adulteração |
| Índice de 12.10, uma parte igual à versão anterior | 0 | Igualdade byte a byte, 2489 bytes |

O código 0 das plantas significa que a recusa esperada foi observada. A referência histórica foi produzida pelo código anterior à alteração sobre o índice de 12.10 do repositório. Não foi usada como referência a cópia de resumo já guardada, que difere dessa saída. SHA-256 da referência congelada: `ace8d3246898dd6dea6ed006261a67fd0e400607b72636a81735fd497c1b3328`.

`python3 -m vigilancia.tests`: duas corridas, códigos 0 e 0, com 74 e 75 provas, respetivamente. A segunda inclui a passagem de nove para dez partes, separadores no título, escrita e recibo, partes ausentes, duplicação, cabeçalho DAR retirado e linha indivisível. As cinco plantas existentes continuam a recusar excerto alterado, autoria trocada, data errada, corpo truncado e vazio falso, nas fixtures sintéticas e nas provas reais. Evidência selecionada em `provas-vig2.log`.

`python3 -m core.gate`: código 1, em 649 segundos. A suite `vigilancia.tests` passou com 75 provas dentro do gate. As cinco suites `core.http_test`, `publisher.dominios_series_test`, `indicators.provas_test`, `indicators.refresh_rede_real_test`, `core.http_nome_test` falharam ao abrir servidores locais em `socket.bind`, todas com a mensagem exata `PermissionError: [Errno 1] Operation not permitted`. Esta recusa da sandbox fica por resolver fora desta passagem; não constitui um gate verde. Uma única corrida; não foram pedidos portões do sítio nem capturas.

## Medição reproduzível

Um comando, a partir da raiz do sítio, reconstrói a fixture usada pelas provas, mede e grava as partes numa pasta nova e corre individualmente as cinco provas pedidas:

```sh
python3 design/especime-v3/medicoes/vig2-2026-11-07/medir-partes.py <motor> <temporario>/vig2-novo
```

A cópia real do índice de 07.11 pertence ao lugar de direção e não foi fornecida nesta worktree. Este ensaio reproduz apenas a escala da medida: cinco atos e 5096 declarações em oito números do DAR, 5101 entradas. Todos os títulos, descrições, oradores, ligações e a razão da falha são sintéticos. Os títulos extensos forçam o mínimo a exceder o limite. Não é uma reconstrução do conteúdo real de 07.11.

| Medida | Bytes UTF-8 |
| --- | ---: |
| Mínimo sintético antes da divisão | 3568 |
| Parte 1 | 475 |
| Parte 2 | 2480 |
| Parte 3 | 2486 |

O JSON `medidas-vig2.json` guarda as medidas e os códigos. Os três ficheiros `sintetico-2026-11-07*.md` conservam a saída medida. Nenhuma designação foi omitida, nenhum limite foi alargado e não houve pedidos de rede.

## Limites e entrega

Uma linha ou bloco indivisível que não caiba com a numeração continua a recusar. As linhas comuns têm de caber na primeira parte; a exigência de as manter juntas impede dividir esse bloco. As provas de linha demasiado longa verificam a recusa tanto de uma designação como de uma razão de falha. A vigilância não foi executada contra fontes nem armada.

Não foram alterados dados de corridas, fontes, permissões, tetos, indicadores, vintages, locks, sweeps ou manifestos do publicador. As alterações do motor estão limitadas ao resumo, verificação, provas e documentação. No sítio ficam apenas o relatório e os artefactos da medição.

Commit do motor: `1c38c4a3bb890ad0b4a5b244c7af728ecc0293ac`. O escrivão confirmou o commit e o hook declarou `core.gate adiado para a aterragem (OEDP_GATE=adiado)`. Commit do sítio: o que contém este relatório. Ambos pelo escrivão, sem publicação de ramos.

Consumo: 37 chamadas de ferramentas de orquestração, incluindo esperas, e 58 invocações internas. Inclui os dois commits e a inspeção final das duas worktrees. Quatro corridas explícitas de conferência ou medição: duas suites da vigilância, uma medição com as cinco provas individuais e um gate final, que também integra a suite da vigilância. Portões do sítio: zero. Capturas: zero. A contagem de tokens não foi exposta.
