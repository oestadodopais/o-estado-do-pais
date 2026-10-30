# DO3: leitura do Orçamento numa página

HTML medido: `b0d9f8ea6d5d12284ef756db8e6098745ba6ab1b`. A correção `193b6d8a` altera apenas conferências. As correções posteriores `2086ca90` e `fa5ec165` dão altura mínima de toque à ligação final. A medição textual precede essas alterações de CSS; o conteúdo não mudou.

O único build terminou com código 1 na última conferência, `check:discussao`. A explicação integrada traz portas próprias para os itens. A régua passou a conferir essas portas pelas linhas da explicação e a conservar a pertença das três entradas do bloco. A conferência dirigida corrigida deu 0; o build não foi repetido.

Códigos lidos: build 1; discussão 0; HTML 0; formas 0 (segunda corrida dirigida); dossiês 0; tipos 0. Frases compostas 0, com 76 de 76 plantas. Alvos 1: seis medições da ligação final abaixo da altura exigida entre 641 e 1023 px. O CSS foi corrigido para aplicar 44 px e espaçamento à própria ligação; a conferência de alvos ainda não foi repetida. A primeira captura falhou porque o seletor abrangia várias tabelas; a segunda retira esse recorte ambíguo. Não correram verify, core.gate nem a corrida inteira de aterragem.

## Medição

Comando: `sh scripts/leituras/curto.sh <temporario>/do3-medicao.log node scripts/medir-dossie.mjs <temporario>/medicao-final.json`.

Palavras: texto do HTML separado por espaços, excluindo `.src-chip`, `.vh`, scripts e estilos. Inclui o texto das dobras. Figuras: elementos `[data-registo]` com selo; valores: elementos `[data-claim]`; selos: ligações `a.src-chip`. A contagem de figuras mede elementos, não ocorrências do nome de um atributo. Por exemplo, Em resumo tem 23 figuras e 23 selos, tanto no dossiê como no estudo publicado.

## pt

| Secção | Palavras | Figuras com selo | Valores | Selos |
| --- | ---: | ---: | ---: | ---: |
| Em resumo | 624 | 23 | 0 | 23 |
| O que este projeto conclui | 945 | 39 | 0 | 39 |
| O que muda para quem trabalha por conta de outrem | 999 | 30 | 0 | 30 |
| O que muda para quem ganha o salário mínimo e para quem trabalha para o Estado | 633 | 11 | 0 | 11 |
| O que muda para quem recebe pensão | 416 | 4 | 0 | 4 |
| O que muda para quem arrenda ou compra casa | 391 | 2 | 0 | 2 |
| O que muda para as empresas | 524 | 9 | 0 | 9 |
| Para onde vai o dinheiro do Estado em 2027, pela proposta de Orçamento | 854 | 0 | 81 | 59 |
| ↳ Por função, como o mapa a escreve | 150 | 0 | 30 | 20 |
| ↳ Sem as operações relacionadas com a dívida pública | 170 | 0 | 25 | 15 |
| ↳ O que muda da lei de 2026 para a proposta de 2027 | 143 | 0 | 13 | 13 |
| ↳ A Saúde: a função e o programa | 99 | 0 | 4 | 2 |
| ↳ O que isto não diz | 147 | 0 | 1 | 1 |
| O que se discute | 237 | 0 | 7 | 5 |
| O calendário | 6 | 0 | 0 | 1 |

## en

| Secção | Palavras | Figuras com selo | Valores | Selos |
| --- | ---: | ---: | ---: | ---: |
| In brief | 602 | 23 | 0 | 23 |
| What this project concludes | 924 | 39 | 0 | 39 |
| What changes for employees | 1040 | 30 | 0 | 30 |
| What changes for those on the minimum wage and for those who work for the State | 629 | 11 | 0 | 11 |
| What changes for pensioners | 410 | 4 | 0 | 4 |
| What changes for those who rent or buy a home | 379 | 2 | 0 | 2 |
| What changes for companies | 535 | 9 | 0 | 9 |
| Where the State’s money goes in 2027, by the Budget proposal | 769 | 0 | 81 | 59 |
| ↳ By function, as the map writes it | 127 | 0 | 30 | 20 |
| ↳ Without the operations related to public debt | 150 | 0 | 25 | 15 |
| ↳ What changes from the 2026 law to the 2027 proposal | 135 | 0 | 13 | 13 |
| ↳ Health: the function and the programme | 90 | 0 | 4 | 2 |
| ↳ What this does not say | 138 | 0 | 1 | 1 |
| Under discussion | 209 | 0 | 7 | 5 |
| The calendar | 6 | 0 | 0 | 1 |

## Réguas adaptadas

- Recorte único: identidade e título fixos, texto, listas e tabelas comparados com studies-src; as dez plantas da leitura são recusadas.
- HTML: L1 a L6 percorrem os blocos escolhidos e mantêm a comparação de cada figura, linha e porta. Plantas de valor, destino e bloco nas duas edições. A explicação passa pela célula original.
- Superfície, voz e lista B1: só os recortes comparados saem da prosa livre; palavras novas ou alteradas continuam recusadas. Índice, ordem, destino final e pertenças conferidos.
- Inventário: quatro frases novas do mandato; saem seis entradas dos cartões, cujos fragmentos continuam nas fontes. Nenhum marcador da voz foi alterado.
- Datas: saem as datas dos cartões retirados; a edição de cada recorte fica presa ao dossiê, e uma data de publicação avulsa continua recusada. Plantas de edição adulterada, retirada e cartão indevido.
- Lugar e L1: as ligações do corpo transcrito seguem a mesma exclusão do estudo apenas depois da comparação do recorte; destino adulterado é recusado pela função comum.
- F22: presença, escala, valores, ordem e rótulos dos gráficos conferidos também no dossiê; plantas de barra adulterada e gráfico retirado.
- Discussão: cada porta da explicação conserva a condição pelas suas linhas; o bloco conserva as três pertenças. Seis plantas novas verificam retirada, destino e repetição.
- Alvos: a amostra do dossiê conserva as duas edições e as cinco larguras; nova planta reduz a porta final a um alvo inválido.
- Frases compostas: os números do estudo entram na medição; plantas de flex e largura no estudo e na explicação integrados.

## Commits

- `b75e31a98`: §2.1, composição da página.
- `416e53aa6`: §2.2, comparação de cada bloco com o HTML de origem.
- `b0d9f8ea6`: §2.3, réguas, plantas e medição.
- `193b6d8a`: correção das réguas dos gráficos e das portas da explicação.

- `2086ca90`: primeiro ajuste de altura no contentor da ligação.
- `fa5ec165`: aplicação da altura à própria ligação.

## Limites e custo

A espera pela tranca partilhada atrasou a construção. As primeiras conferências tiveram falhas de preparação e uma reconstrução concorrente; os resultados finais acima são os da construção imutável. Não se enfraqueceu uma régua de número, fonte ou pessoa. A leitura por outra família e a aterragem ficam para o lugar de direção. Contagens finais de chamadas e de conferências na resposta do construtor.

A corrida integral de build não foi repetida. As duas regenerações finais pelo Astro servem apenas as capturas após a correção de CSS e não equivalem a um build conferido.

## Capturas finais

Capturas com código 0, cabeça `fa5ec1658c922ff17395071cf0317ae47f6b0fbf`: dez páginas, nas duas edições e nas larguras 390, 768, 1024, 1280 e 1600 px, mais trinta recortes. O manifesto não regista erros nem documentos mais largos do que a janela. A altura do recorte da ligação final não substitui a repetição de check:alvos, que fica pendente.

Custo: 39 corridas dirigidas de conferências registadas, incluindo tentativas falhadas, e uma corrida integral de build. O inventário dos registos está em contagem-conferencias.json. As gerações de Astro, carimbos, cartões, medições e capturas não entram nas 39 conferências.

Inspeção visual de três recortes: resumo português a 390 px, abertura inglesa a 1600 px e ligação final portuguesa a 768 px. Sem corte de texto visível nesses recortes. Os PNG são ignorados pelo repositório e ficam locais na pasta de capturas; o manifesto é versionado. A primeira tentativa de commit das provas foi recusada por incluir esses PNG.

Chamadas de ferramentas: 120. tokens used, último total exposto antes do fecho: 17477326.
