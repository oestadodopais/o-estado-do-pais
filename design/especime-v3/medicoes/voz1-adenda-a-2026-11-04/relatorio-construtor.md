# VOZ-1, adenda A: fecho dos cinco vermelhos

Concluída a 04.11.2026, na cabeça `79f932a4ac1769e69414a1ad22f10ed8c2e04d4b`. O build completo, as cinco conferências nomeadas e o typecheck passaram com código 0. `conferencias.json` conserva os códigos lidos dos ficheiros e os excertos finais dos registos.

## Causas e correções

1. **Voz retirada:** não voltou uma frase retirada. O teste procurava a linha 916 do inventário, mas a remoção de sete declarações na VOZ-1 deslocou a mesma frase para a linha 909. O texto é «The limit is set by article 52.º of Lei n.º 73/2013 : one and a half times the three-year average of net current revenue.», do bloco `b1-peca2`. Agora a seleção exige exatamente esse texto, nesse bloco, uma única vez. A planta injeta-o em `/en/municipalities/agueda/`, conservando a prova da pontuação na extração histórica. A outra planta municipal usa `/en/municipalities/abrantes/`; as duas restantes usam os registos de correções português e inglês. No dist conferido, Águeda e Abrantes continuam com a definição iniciada por «The council’s debt that counts towards the legal limit at year end», atribuída à DGAL. O controlo atual deu 0, e as quatro frases repostas deram 1, sem alterar os originais. As 1276 retiradas foram conferidas em memória.
2. **Código sem uso:** saíram as duas funções que exigiam critérios e histórico, e os rótulos que só serviam essa apresentação. A conferência identificou também imports da agenda e do livro e o alias local `M` do Método. Ao todo, saíram 16 declarações locais sem uso. Nenhuma era chamada por uma proteção ativa. Os campos públicos da agenda e os dados conservados continuam sujeitos às suas conferências. A decisão 1.220 regista o novo resumo do ficheiro do Método, `b1499ed402c7`; a prosa e o objeto exportado conservam-se.
3. **I6:** a ausência exata aponta para `/metodo` ou `/en/method`. A conferência exige a forma da edição e a porta do Método. As seis plantas repõem o endereço antigo, outro destino e o marcador antigo, nas duas edições. A exceção do selo, que é a porta do recibo, conserva-se.
4. **Feixe:** a amostra passou a vir de um campo real com ausência, encontrado no dist, em vez da página retirada. O cartão exige o texto exato e o destino do Método no domínio do sítio. As duas plantas repõem o destino antigo e o marcador antigo; ambas mordem.
5. **I7:** saiu a entrada redundante do marcador no índice; a entrada própria do Método fica. A conferência de destinos repetidos conserva-se. Acrescentou-se a recusa da página retirada no índice, no mapa ou na construção, e a exigência da redireção 308 para o Método, com e sem barra final. As 14 plantas novas cobrem estas situações nas duas edições. As 40 plantas do índice do sítio, incluindo as anteriores, morderam.

## Códigos finais

| Conferência | Código |
| --- | ---: |
| build | 0 |
| check:voz-retiradas | 0 |
| check:mortos | 0 |
| check:indice, com navegador e plantas | 0 |
| design:feixe | 0 |
| check:indice-do-sitio | 0 |
| typecheck | 0 |

O perfil fechado `voz1a` do escrivão corre estes sete comandos. Não corre `verify`, a bateria inteira dos três portões, nem capturas. O build correu uma vez nesta adenda. A primeira conferência de código morto deu 1 ao revelar as restantes declarações sem uso; a repetição corrigida deu 0. As outras conferências preliminares deram 0.

## Custo observado

Até à escrita deste relatório: 35 chamadas de ferramentas. Houve 6 invocações preliminares por `curto.sh` e 7 comandos finais pelo escrivão, ao todo 13 corridas de conferências. O build conta como uma invocação, não como cada comando interno. `custo.json` conserva esta leitura. As chamadas de commit e confirmação posteriores serão contadas na resposta final.

tokens used: 19320760, última leitura disponível ao escrever o relatório.

Sem alterações nos dados da agenda ou do calendário, sem alterações no motor e sem publicação. Não ficou uma das cinco conferências por resolver.
