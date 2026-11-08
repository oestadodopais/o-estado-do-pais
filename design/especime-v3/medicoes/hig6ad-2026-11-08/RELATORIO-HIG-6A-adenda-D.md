# HIG-6A, adenda D: paragem por falsos positivos na presença

O ensaio da regra de presença recusou incorretamente V009 e V121 da VOZ-2B. As duas frases completas estão nas páginas declaradas de «A casa em Portugal e na Europa», respetivamente em inglês e português. Aplica-se a condição do §2: «se a regra das entradas na página recusar a VOZ-2B por frases que lá estão».

O erro é da implementação ensaiada: a extração retirava `.src-chip`, como a régua da voz, mas estas duas entradas incluem literalmente as etiquetas `source · Eurostat` e `fonte · Eurostat`. A leitura do HTML conservando essas etiquetas confirmou a presença das duas frases completas. A verificação de presença precisa de conservar esse texto; esta passagem parou sem instalar a correção, por aplicação da condição do mandato.

A mesma extração recusou V053 e V176 na repetição aplicada da VOZ-2A. O ensaio não foi instalado: os quatro ficheiros de produção foram repostos byte a byte a partir da cabeça. O patch e os resultados ficam como diagnóstico.

Antes da paragem, a regra das asserções na forma do motor passou as oito declarações da VOZ-2A, incluindo V188, sem recusas. O ensaio lê os padrões do motor e procura citações presentes na nova que cubram todas as ocorrências; lê os livros da origem declarada no manifesto e das composições que a importam. Essa implementação também foi reposta, pois as suas plantas e a integração ficaram por fazer.

Medições:

| Corrida | Resultado |
| --- | --- |
| Asserções da VOZ-2A na forma do motor | 8 declarações, 0 recusas, código 0 |
| Inventário das listas A e B | Nenhuma frase com menos de 12 carateres; nenhuma entrada sem páginas |
| Regras ensaiadas sobre A aplicada | Presença 2; restantes regras 0 |
| Regras ensaiadas sobre B | Voz 0, números 0, quantificadores 28, presença 2, pares 7, frases sem entrada 15 |
| Diagnóstico dos quatro casos de presença | Etiquetas de fonte retiradas pelo extrator |
| Leitura integral das frases V009 e V121 com as etiquetas | Ambas presentes, código 0 |

As duas linhas A e B pertencem à mesma corrida. Foram cinco corridas de medição, todas por `curto.sh`; não correram as conferências de fecho. Os ensaios chamaram as funções diretamente sobre o `dist` já existente de `0b80e965b582cc00cfc985ede46ab3cd964996f0`. Não se correu nem se declarou verde o pré-mandato na cabeça atual `c0c99631d7997bc783fbc2690405545e9ec3a260`.

Ficaram pendentes a instalação da regra das asserções e as suas plantas, a cadeia no verify e a disponibilização do motor na CI, as plantas da ligação, a verificação de presença, a opção de lista aplicada, os menores e todo o fecho solicitado. Motor e listas não foram alterados. A contagem final de chamadas fica na resposta depois do commit e da conferência da árvore.
