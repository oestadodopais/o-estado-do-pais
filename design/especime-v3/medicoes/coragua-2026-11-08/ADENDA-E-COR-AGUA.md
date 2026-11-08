# Adenda E ao mandato COR-AGUA: os rótulos das secções na conferência das atribuições (08.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da tua paragem pelo §1.5 da adenda D (08bce71b2). Quinta retoma, a mesma sessão. Paraste bem: o caso `reference-code` da adenda B e a janela antiga não cabiam juntos, e a decisão era deste lugar.*

## §0 Medido

- Os dois estudos da água numeram as secções com rótulos de dois algarismos e zero à esquerda, cada um sozinho no seu elemento: `<span class="snum">01</span>` a `<span class="snum">08</span>` em «Onde está a água», e de 01 a 07 em «Água não faturada» (no `dist/` de 61689dfcb).
- A versão de cf5bd5b leria o `08` como o valor 8 e recusá-lo-ia ao pé de um cabeçalho que nomeie outra entidade. Isso é uma recusa falsa: um rótulo de secção não é uma quantidade.

## §1 O que fazes

1. **A decisão:** um número com zero à esquerda que é o texto inteiro do seu elemento (o rótulo de uma secção, como `<span class="snum">08</span>` ou `<div>08</div>`) não é uma quantidade. A conferência salta-o e escreve-o na saída como rótulo, nunca em silêncio.
   - O caso `reference-code` da adenda B continua a dar 0, por esta regra.
   - Uma planta nova: o mesmo HTML com `<div>8%</div>`, e outra com `<div>8</div>`, sem zero à esquerda, ao pé do cabeçalho do INE, continuam a recusar.
2. **O resto da adenda D**, do ponto 1 ao 8, com o mesmo §2. Se outro caso de cf5bd5b não couber com um teste da adenda B, resolve-o só com uma exclusão de uma forma que nunca é quantidade (um rótulo, um código, uma data escrita como data). Essa exclusão vale em todas as páginas e tem uma planta que prove que uma quantidade na mesma posição continua a recusar. Nunca estreitas a janela nem saltas uma frase, e dizes cada exclusão no relatório.

## §2 Quando paras

Como no §2 da adenda D, menos o caso acima.

## §3 O fim

O ponto 8 da adenda D, com os mesmos setenta e cinco minutos e cento e vinte chamadas, contando as dos ajudantes, desde o início desta retoma.
