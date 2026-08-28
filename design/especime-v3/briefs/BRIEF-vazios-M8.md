# BRIEF · Os vazios, M8 · a medição cega do bloco

*Escrito a 28.08.2026 pelo lugar de direção (Claude Fable 5) para o medidor (Claude Sonnet). Corre sobre uma cópia do repositório (`git worktree add --detach`), nunca na árvore do construtor, com a construção do ramo `vazios-2026-08-28` feita nessa cópia (`npm ci` se faltar, `npm run build`). Não lês o brief do construtor nem o relatório dele antes de medir; lês só isto. Cada detetor é provado num caso conhecido vermelho antes de dar um zero. Sem travessões na prosa.*

## 0 · O que mudou, em três regras do diretor (28.08.2026)

1. «Execução da receita» saiu da disposição-padrão do concelho: sete medidas por página, pela mesma ordem de antes (população, poder de compra, desemprego registado, empresas, dívida total, índice de dívida, prazo médio de pagamento).
2. Quando a fonte imprime «N.d.», a página mostra «N.d.» como valor, com selo: onze linhas novas (nove do prazo médio de pagamento de dezembro de 2025, `<slug>-prazo-medio-de-pagamento-2025-12`, para Aljezur, Aljustrel, Almada, Batalha, Évora, Moimenta da Beira, Pedrógão Grande, Penedono, Trancoso; e `penedono-divida-dgal-2024` e `penedono-limite-divida-dgal-2024`); o índice de dívida de Penedono, calculado sobre duas entradas «N.d.», é «N.d.».
3. «sem linha ainda» e «no row yet» não rendem em lado nenhum; no bloco dos mandatos de Évora, o campo «Decidiu» do mandato 2017–2021, que não tem linha, não rende.

## 1 · As medições

1. **As duas frases de ausência em `dist/`**: ocorrências de «sem linha ainda» e de «no row yet» em todos os `index.html`, por rota; caso conhecido: uma cópia de uma página com a frase plantada, vista vermelha antes do zero.
2. **As peças por página**: em cada uma das 308 páginas de concelho nas duas edições, o número de `article.peca` e os nomes das medidas pela ordem; caso conhecido: a construção de `main` `35313eb` (oito peças, a sétima «Execução da receita»), que constróis também na cópia, ou lês da lista de medidas dessa revisão.
3. **As onze linhas**: para cada uma, o valor na página de concelho, o valor no recibo (`/livro-razao/<id>`), o `value` do YAML em `ledger/claims/<id>.yml`, e a marca impressa no ficheiro da fonte tal como o motor o aloja (a linha do YAML diz o documento, a página ou a posição, e o excerto; a cópia alojada está no motor, `~/Instruments/ResearchHub`, no caminho que a linha ou o manifesto `publisher/manifest.concelhos.json` indicam; lês o ficheiro com um extrator teu, provado numa cópia estragada). As quatro colunas iguais, carácter a carácter, ou a discordância com coordenada.
4. **Penedono**: dívida total «N.d.», índice de dívida «N.d.», com selo cada um; nenhum «NaN», «undefined», «null» ou «Infinity» visível em nenhuma das 616 páginas de concelho (caso conhecido: uma página com «NaN» plantado).
5. **Os nove do prazo médio de pagamento**: «N.d.» com selo nas duas edições; os outros 299 com número e selo.
6. **Nenhum vazio**: `src/data/concelhos.gerado.json` sem um valor nulo; nenhuma peça com `data-medida-vazia` em `dist/`.
7. **Os mandatos de Évora**: em `/municipios/evora` e `/en/municipalities/evora`, o campo «Decidiu» existe nos mandatos que têm linhas e não existe no de 2017–2021; nenhum campo vazio (um `dd` sem texto) no bloco.
8. **As contagens do livro-razão**: as que as páginas de índice imprimem (afirmações, calculadas, linhas de concelhos, concelhos) contra as tuas contagens dos ficheiros de `ledger/claims/` e da lista de concelhos; iguais ou discordância.
9. **O inventário e a superfície**: para cada linha `viva` de `design/especime-v3/INVENTARIO-FRASES.md`, pelo menos uma ocorrência do texto em `dist/` (nas dicas e nos `aria-label` também); para cada linha `retirada`, zero; a lista das que falham, com o texto. Caso conhecido: uma linha `viva` inventada que não rende.
10. **Évora intacta**: a camada das contas de Évora ainda mostra a execução da receita da prestação de contas do município (`evora-execucao-da-receita-2025` com selo na página de Évora); as duas leituras longas dos estudos de Évora constroem e cada figura tem a sua linha.
11. **A cadeia**: `npm run verify` e `npm run typecheck` na cópia, com o código de saída.

## 2 · O relatório

`design/especime-v3/medicoes/vazios-M8-sonnet.md` e o programa ao lado (código teu, do zero, sem importar nada do sítio): uma tabela por medição com os números, as discordâncias com coordenada e prova, os teus falsos alarmes com a causa, os casos conhecidos vistos vermelhos, o custo em símbolos. Nada é «ok» sem o número. Não corriges, não commitas, não tocas em nada fora de `medicoes/` na cópia.
