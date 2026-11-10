# Adenda E ao mandato REC1: os oito vermelhos da corrida inteira (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2). A corrida inteira (`conferir-tudo.sh --build`) sobre a cabeça `85e2575dd` deu 70 passos e 8 vermelhos; as caudas dos oito registos estão em `e/vermelhos-da-corrida-inteira.txt`, nesta pasta. Nenhuma das conferências dirigidas das passagens anteriores corria estes passos. Uma decisão deste lugar muda com esta medição (o ponto 1). A quinta retoma vai com decisão escrita.*

## Uma decisão que muda

1. **As novidades da página inicial voltam a ser as de antes do bloco, nos dois modos.** Esconder as atualizações dos estudos esvaziou a caixa, e com ela partiram a conferência dos alvos (faltam as entradas reais das novidades), a das sobreposições na página inicial em quatro larguras e, muito provavelmente, mais duas. A caixa das novidades lista publicações e atualizações de estudos com o rótulo que já tinham; a história de cada estudo recomeça quando a sua edição de lançamento aterrar, e até lá a caixa fica como estava. Tira o filtro e a condição de presença das novidades, os rótulos e as plantas que entraram por causa deles nas adendas B a D, e repõe o que as conferências das novidades faziam antes do bloco. As listas de mudanças dos lugares e do índice continuam a seguir o registo, como está. A linha das datas da página inicial fica onde estava antes do bloco.

## Os outros vermelhos

2. **`check:fontes`** recusa em ensaio todas as linhas de proveniência completa por terem `noindex`. Em ensaio toda a página tem `noindex` por desenho: a regra passa a ler o mesmo interruptor (em ensaio, a proveniência completa não se distingue pelo `noindex`; as de proveniência incompleta continuam fora do mapa do sítio; com data, como hoje). Planta nos dois modos.

3. **`design:feixe`** procura no registo construído uma entrada de correção como amostra. Em ensaio usa uma amostra que exista (um recibo de linha com história, onde o mesmo componente se desenha) ou a cópia com data; a régua continua a conferir o que conferia.

4. **`check:explicacoes`, a célula da semana:** as duas plantas das afirmações textuais no registo ficam como as células da discussão ficaram na adenda D (em ensaio, o registo vazio afirmado e a história lida no recibo; com data, como hoje).

5. **`provar:guardas`** deixou de conseguir carregar `src/i18n/strings.mjs` porque esse módulo passou a importar `site.config.mjs` por caminho relativo. Corrige de modo que o provador das guardas volte a correr, sem tirar ao módulo das frases o que ele precisa para escolher o modo.

6. **`check:voz-retiradas` e `check:largura`:** vê pelos registos se ficam verdes com o ponto 1. Se não ficarem, corrige a causa de cada um com a mesma regra dos outros pontos: o que a régua protege continua protegido, nos dois modos, com planta.

7. **Procura as irmãs.** Antes de fechar, procura em `tests/` e em `scripts/` outras conferências do `verify` que leiam a página do registo construída, a meta `robots` ou as listas de mudanças dos lugares e do índice, e que nenhuma passagem tenha corrido em ensaio; corre-as. A lista do que correste, com os códigos, vai no relatório.

## O relatório

Curto, em `RELATORIO-REC1-E.txt`: ponto a ponto; os oito passos, cada um com o código nos dois modos e a linha do registo citada letra por letra; o que o leitor vê diferente em relação à cabeça anterior (as novidades de volta). Os commits com o assunto a começar por `REC1`.

## Quando paras

Numa régua que proteja um número, uma fonte ou uma pessoa e só passe enfraquecida. Para o resto: deixa, diz e continua.

## O fim

Os oito passos com código zero em ensaio, e as irmãs do ponto 7. Sem a corrida inteira nem as capturas, que são do lugar de direção. Setenta e cinco minutos, cento e vinte chamadas.
