# BRIEF · M11b, a segunda medição do mesmo bloco, depois dos seis consertos

*29.08.2026, lugar de direção (Claude Fable 5) para a medidora (Claude Sonnet). A cópia nova está em `m11b-dist/` na tua pasta (o ramo em `d8c3ae3`); a anterior, `m11-dist/`, fica para comparar. O mesmo método da M11: código teu, um positivo conhecido por detetor, nada de árvores do repositório. Sem travessões.*

O construtor diz que consertou seis coisas depois da leitura cruzada. Mede só estas, nas duas edições, às sete larguras (320, 360, 390, 430, 768, 1024, 1280):

1. **Alvos em duas dimensões**: a caixa de cada nome visível da rede (abaixo de 1024) tem largura e altura ≥ 44 px; o mais pequeno por largura (o construtor diz 44,0 × 44,0 de 320 a 768 e 99,3 × 44,0 a 1024 e 1280; e diz que antes «Beja» media 27,8 × 44 e «Faro» 29,0 × 44, confirma na cópia antiga); nenhum par de alvos com retângulos que se intersetem.
2. **Sem pontuação**: nenhum `::before` nem `::after` dos itens da lista com `content` que não seja `none` ou vazio, a todas as larguras; e o intervalo entre nomes em linha (o `column-gap`, lido do estilo calculado da `ul`).
3. **A ordem do documento**: a lista dos nomes vem antes do mapa no DOM (`compareDocumentPosition`); acima de 1024 a lista está à esquerda do mapa no ecrã; abaixo de 1024 o mapa está acima da lista no ecrã (a `order` aplicada), e diz os valores de `order` lidos.
4. **A regra das duas formas**: às sete larguras, abaixo de 1024 a rede em linha está visível e a lista da coluna esquerda não existe como forma separada (é a mesma `ul` com outra disposição, ou não; descreve o que encontras); a partir de 1024, a disposição em colunas. O atributo `data-alvo-abaixo-de` não ocorre na página (0 ocorrências).
5. **O par nos 29 pares**, nos dois sentidos, com o rato e com o foco de teclado (antes mediste três; agora todos), e só na unidade apontada. Diz quantos dos 29 × 2 × 2 casos passaram.
6. **As alturas da página** depois dos consertos, a 390 e a 1280, nas duas edições (o construtor diz 7 383 pt e 7 357 en a 390; 4 003 e 3 987 a 1280).

Entrega: `resultados-b.json`, `RELATORIO-M11b.md`, e na tua última mensagem a tabela com o número do construtor ao lado do teu e «concorda» ou «discorda», os positivos conhecidos que acrescentaste, e o custo.
