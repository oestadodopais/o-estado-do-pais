# LAR1, Adenda A: resultado verificado

A correção fica no CSS. Os valores e os nomes ocultos do registo podem quebrar linha, com `white-space: normal` e `overflow-wrap: anywhere`. Os pares curtos continuam em linha quando cabem, sem uma regra que torne excertos inteiros indivisíveis.

Na moldura, as tabelas usam `display: block`, `max-width: 100%` e `overflow-x: auto`; os seus pais podem encolher com `min-width: 0`. O conteúdo largo continua dentro da caixa da tabela. Não foi aplicado corte horizontal ao documento. O HTML original e o guião da moldura não foram editados.

## O caso adicional encontrado pela régua

A primeira corrida encontrou um único excesso: 474 px a 390 no documento das penalizações por reforma antecipada. A causa restante era o SHA-256 mostrado em `.metodo code`, fora da tabela. Foi acrescentado `overflow-wrap: anywhere` nessa seleção da moldura, sem alterar os caracteres do identificador. Este ajuste adicional de CSS é necessário para o objetivo de nenhuma página deslizar e fica explicitado para além da hipótese inicial centrada nas tabelas.

## Preservação das edições

As oito edições guardadas têm o SHA-256 do HTML servido antes e depois, o SHA-256 do original e a igualdade do texto e da prova registados, por rota, em [depois/edicoes.json](depois/edicoes.json). Os oito HTML servidos mudaram; os oito originais e os oito textos ficaram iguais. A prova existente `provaDosBytesDaEdicao` passou antes e depois sem alteração à régua. A referência anterior está em [edicoes-antes.json](edicoes-antes.json).

## Largura e capturas

A `check:largura` final mediu 128 páginas únicas, 78 famílias e todos os 37 documentos, em 640 combinações. Zero excessos. A medição demorou 10.449 segundos, abaixo de três minutos. Usa quatro páginas de navegador reutilizadas; não foi cortada cobertura.

A amostra calcula as famílias do próprio `dist/`, incluindo famílias novas, e acrescenta todos os documentos atuais e guardados. O teste da seleção prova ambos os comportamentos. A conferência entra em `verify`, cuja lista é lida por `conferir-tudo.sh`. A planta repõe `nowrap` num valor textual longo real em cada língua: o comando dá código 1; a releitura sem a planta dá verde.

O guião recebido no §0 foi repetido sem alterações. Os resultados finais estão em [depois/familias.json](depois/familias.json) e [depois/documentos.json](depois/documentos.json), com zero excessos e zero erros.

O capturador mede imediatamente antes do PNG e recusa a página que excede a largura pedida. O manifesto conserva a largura medida também nas recusas. O teste do capturador real recusou uma página de 800 px numa janela de 390 e aceitou o controlo. Foram ainda feitas 20 capturas reais, nas duas línguas e nas cinco larguras, do registo e da edição guardada de Évora 2027. Pedido e manifesto estão em `depois/`; os PNG e recortes ficam em `<temporario>/lar1-capturas`, fora do repositório.

## Conferências e custo

Os códigos e os tempos por corrida estão em [depois/conferencias.json](depois/conferencias.json). O build final ficou verde. CSS, moldura, sobreposição, alvos e typecheck passaram na primeira corrida; o único ajuste posterior na página foi a quebra do código longo do método, e a construção integral e as réguas de largura e capturas voltaram a correr. Não houve enfraquecimento de nenhuma régua.

| Fase | Conferência | Código | Segundos |
| --- | --- | ---: | ---: |
| inicial | `build` | 0 | 602 |
| inicial | `check:alvos` | 0 | 429 |
| inicial | `check:capturas-largura` | 0 | 2 |
| inicial | `check:css` | 0 | 7 |
| inicial | `check:largura` | 1 | 19 |
| inicial | `check:largura:planta` | 1 | 2 |
| inicial | `check:moldura` | 0 | 156 |
| inicial | `check:sobreposicao` | 0 | 10 |
| inicial | `lar1:medir` | 1 | 42 |
| inicial | `typecheck` | 0 | 1 |
| build-final | `build` | 0 | 658 |
| largura-final | `check:capturas-largura` | 0 | 1 |
| largura-final | `check:largura` | 0 | 11 |
| largura-final | `check:largura:planta` | 1 | 1 |
| largura-final | `lar1:medir` | 0 | 37 |

Foram executados 15 comandos nos perfis, incluindo duas construções integrais; também passaram os dois testes locais acima. Nenhuma corrida dos três portões e nenhuma execução integral de `verify`. Houve três verificações explícitas dos hashes e do texto das edições (antes, depois da primeira construção e depois da final). Até à escrita deste relatório: 50 chamadas de ferramentas; a resposta final regista o total após o commit e a inspeção.

Cabeça da construção e das capturas: `f438cc041f8eccf051d928b2a8a41fa1f87ff39c`. As regras de produção foram comitadas por caminhos explícitos pelo escrivão. O motor e o `REGISTO-DE-MELHORIAS.md` ficaram intactos.
