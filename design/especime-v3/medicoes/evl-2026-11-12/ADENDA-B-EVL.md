# Adenda B do EVL: um número dentro de uma citação ligado à linha de outro documento (12.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `evl-2026-11-12`; a outra pasta com escrita é a worktree do motor `evl-2026-11-12`. Uma correção: quarenta e cinco minutos e sessenta chamadas, metade do portão do motor; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVL`. O teu relatório vai para `design/especime-v3/medicoes/evl-2026-11-12/RELATORIO-EVL-B.txt`, com dez linhas, e as tuas medidas e registos para a mesma pasta (`medidas-do-construtor-evl-b.json`, `evl-b-gate.log`, `evl-b-conferencias/`): na adenda A ficaram na raiz do repositório, e este lugar teve de os mudar.*

## Porquê

A tua lista dos selos por unidade deixou este lugar conferir as catorze ligações. Treze estão certas. Uma liga um número à medida errada, e tu próprio a assinalaste: na unidade `N01.2` do texto julgado, dentro de uma citação das contas da associação, o segundo número está ligado à linha do relato ao painel. O valor é o mesmo e a medida é outra: as contas falam do que o Governo tem a financiar; a linha do painel é o que o relatório de progresso dava como já transferido. Com as linhas novas no livro do sítio, esse número passou a levar o leitor ao recibo errado.

## §0 O que se mediu

1. No gabarito do estudo 19, a unidade `N01.2` tem dois marcadores dentro da citação das contas: o primeiro resolve na linha própria `evb-ln030`, das contas; o segundo resolve em `14:painel-transferido`, do segundo relatório de monitorização. Os dois números estão no mesmo excerto da mesma página das contas, que é o excerto da `evb-ln030`.
2. As outras treze ligações da tua lista conferem com a medida da linha: a manchete, a resposta, o primeiro achado, as duas citações do painel, a leitura, os limites e o quadro dos agregados.

## O que fazes

1. **No motor, a ligação certa.** O segundo número da citação da `N01.2` passa a resolver numa linha própria nova, das contas de 2025 da associação, com o mesmo documento, a mesma página e o mesmo excerto da `evb-ln030`, e o valor que o excerto traz. A medida, para o motor: os milhões de euros a financiar pelo Governo, segundo as contas da associação. A linha do relato ao painel deixa de ter essa ocorrência. O texto julgado não muda: muda só o marcador, nas duas línguas (na inglesa, a citação portuguesa leva os marcadores e a tradução entre parêntesis fica como está).

2. **No motor, a classe.** Uma régua nova, com planta: um número dentro de uma citação, quando resolve numa linha, tem de resolver numa linha cujo documento é o documento a que a citação está atribuída (o mesmo resumo do corpo alojado). Corre-a nos dois estudos com texto julgado e nas duas línguas, e lista o que achar; cada caso achado corrige-se como o do ponto 1, se a linha certa existir ou se o excerto da citação a provar, e pára nessa unidade se não. A planta: o caso da `N01.2` como estava recusa.

3. **A cadeia do estudo e o portão.** O gabarito, o contrato, o livro, os registos e o manifesto do estudo 19 regeneram-se; os dois HTML ficam byte a byte como estão (o texto não muda), e dizes os resumos. O `core.gate` inteiro, uma vez, com código zero.

4. **No sítio.** Os dois registos do estudo 19 atravessam outra vez (o exportador dos registos com `OEDP_SITE` na worktree do sítio e `--write`; fica só o que é do 19; o que mais ele tocar volta ao que estava). A ocorrência da `N01.2` deixa de ter selo, nas duas línguas; as outras treze ficam. Conferências: `check:registo`, `check:documentos`, `check:cruzamento` (com o motor), `ledger:check`, a régua do texto da página, `typecheck`. A lista dos selos por unidade refaz-se com o `dist/` que existir ou a partir dos registos, e dizes de qual.

## O que fica como está, por decisão

O texto julgado, as frases do cartão e dos recibos, as cinco linhas novas do sítio.

## Quando paras

Se a linha nova da `N01.2` não provar o valor no excerto das contas, inteiro e único na página. Para tudo o resto: decide, anota e continua.

## O fim

O relatório em dez linhas: os quatro pontos, a planta, o que a régua nova achou nos dois estudos, os resumos dos dois HTML, os códigos, o código do portão.
