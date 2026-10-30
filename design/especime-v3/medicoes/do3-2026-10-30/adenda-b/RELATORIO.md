# DO3, adenda B: identificação do estudo, recortes inteiros e portas

## Alterações

- §1, `923c6e25`: título do estudo lido da edição publicada, com o prefixo do mandato, ligação e entrada no índice. Os títulos dos recortes passaram a h3; títulos subordinados acompanham a hierarquia. As duas frases passaram nos marcadores e na conferência da voz.
- §2, `c1f7f923`: comparação do HTML de cada secção inteira, incluindo as dobras, os seus destinos e texto entre blocos. A normalização conserva a conferência dos selos e dos valores; só adapta a hierarquia, os atributos de associação dos títulos e o espaço em branco. A ligação de subida e o contador de secções pertencem ao índice do estudo e ficam fora do recorte de origem. Nenhum nó do recorte rendido é retirado antes da comparação.
- §3, `b12e6851`: a explicação integrada fica sem portas finais nem portas da discussão. Na página própria, o comportamento permanece ativo por omissão. As réguas recusam a reposição das portas dentro do dossiê.

As réguas da superfície, da voz e do lugar continuam a usar conferirLeitura. Só dispensam o conteúdo que passou pela comparação integral. As plantas novas recusam uma frase numa dobra, uma ligação trocada e texto entre blocos nas duas edições. Nenhuma régua de número, fonte ou pessoa foi enfraquecida.

## Conferências

Códigos finais já lidos: dossiês 0, explicações 0, discussão 0, voz 0, lugar 0, CSS 0, tipos 0, HTML 0 e build integral 0. O build correu sobre `b12e6851`. Alvos 0, frases compostas 0 e capturas 0, lidos dos respetivos ficheiros .codigo. As frases compostas recusaram 76 de 76 plantas. As primeiras tentativas registaram uma anotação de tipo em falta e a ausência de version.json após a geração preliminar pelo Astro; ambas foram corrigidas antes dos commits correspondentes.

## Medição das secções no HTML final

Comando: `sh scripts/leituras/curto.sh <temporario>/medicao.log node scripts/medir-dossie.mjs <temporario>/medicao.json`. Palavras sem os elementos `.src-chip`, `.vh`, scripts e estilos; inclui o conteúdo das dobras. Figuras contam elementos marcados com selo. As subsecções da explicação já entram no total da explicação.

### pt

| Secção | Palavras | Figuras com selo | Valores com selo |
| --- | ---: | ---: | ---: |
| Em resumo | 624 | 23 | 0 |
| O que este projeto conclui | 945 | 39 | 0 |
| O que muda para quem trabalha por conta de outrem | 999 | 30 | 0 |
| O que muda para quem ganha o salário mínimo e para quem trabalha para o Estado | 633 | 11 | 0 |
| O que muda para quem recebe pensão | 416 | 4 | 0 |
| O que muda para quem arrenda ou compra casa | 391 | 2 | 0 |
| O que muda para as empresas | 524 | 9 | 0 |
| Para onde vai o dinheiro do Estado em 2027, pela proposta de Orçamento | 795 | 0 | 79 |
| ↳ Por função, como o mapa a escreve | 150 | 0 | 30 |
| ↳ Sem as operações relacionadas com a dívida pública | 170 | 0 | 25 |
| ↳ O que muda da lei de 2026 para a proposta de 2027 | 143 | 0 | 13 |
| ↳ A Saúde: a função e o programa | 64 | 0 | 2 |
| ↳ O que isto não diz | 147 | 0 | 1 |
| O que se discute | 237 | 0 | 5 |
| O calendário | 6 | 0 | 0 |

### en

| Secção | Palavras | Figuras com selo | Valores com selo |
| --- | ---: | ---: | ---: |
| In brief | 602 | 23 | 0 |
| What this project concludes | 924 | 39 | 0 |
| What changes for employees | 1040 | 30 | 0 |
| What changes for those on the minimum wage and for those who work for the State | 629 | 11 | 0 |
| What changes for pensioners | 410 | 4 | 0 |
| What changes for those who rent or buy a home | 379 | 2 | 0 |
| What changes for companies | 535 | 9 | 0 |
| Where the State’s money goes in 2027, by the Budget proposal | 718 | 0 | 79 |
| ↳ By function, as the map writes it | 127 | 0 | 30 |
| ↳ Without the operations related to public debt | 150 | 0 | 25 |
| ↳ What changes from the 2026 law to the 2027 proposal | 135 | 0 | 13 |
| ↳ Health: the function and the programme | 59 | 0 | 2 |
| ↳ What this does not say | 138 | 0 | 1 |
| Under discussion | 209 | 0 | 5 |
| The calendar | 6 | 0 | 0 |

Estrutura medida nas duas edições: sete títulos h3 nos recortes, zero IDs repetidos, zero grupos de portas dentro da explicação integrada e dois grupos conservados na página original. O ficheiro estrutura.json guarda os títulos e destinos medidos.

## Capturas e fecho

Dez páginas, nas duas edições e nas larguras 390, 768, 1024, 1280 e 1600 px, mais trinta recortes, sobre a cabeça `b12e685157a6fa8216bf8ac5a5a237c7b7a7a91e`. O manifesto regista zero erros e nenhum documento mais largo do que a janela. Inspecionados cinco recortes: título português a 390 px, título inglês a 1600 px, resumo português a 390 px, resumo inglês a 1280 px e fim da explicação inglesa a 390 px. Sem corte de texto visível nesses recortes.

Os PNG ficam locais na pasta de capturas, por serem ignorados pelo repositório. O manifesto é versionado. As três alterações têm os commits indicados acima; as provas ficam num commit do §4.

Custo desta adenda: 49 chamadas de ferramentas, incluindo o commit das provas e a verificação final; 15 corridas dirigidas de conferências, incluindo as duas tentativas falhadas e corrigidas, e um build integral. Gerações preliminares do Astro, cartões, medições e capturas não entram nas 15 conferências.

tokens used: 26007956, último total acumulado exposto pela sessão antes do commit das provas.

A primeira tentativa de commit das provas foi recusada por incluir alvos.json, ignorado pelo repositório. Esse ficheiro fica local; os códigos e os registos da conferência são versionados.
