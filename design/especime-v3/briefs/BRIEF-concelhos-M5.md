# BRIEF · As páginas dos 308 concelhos, M5 · a medição cega das linhas e das páginas

*Escrito a 26.08.2026 pelo lugar de direção (Claude Fable 5) para o medidor (Claude Sonnet). Corre depois do P2 (dados), sobre a construção do ramo `concelhos-2026-08-26` congelada no diretório que o lugar de direção indicar, sobre as linhas em `ledger/claims/` do mesmo ramo, e sobre os ficheiros das fontes alojados no motor (`~/Instruments/ResearchHub/content/12 Concelhos/source/`, só leitura). Sem travessões na prosa deste ficheiro.*

## 0 · O que é

Uma re-derivação cega: código teu, do zero, sem ler o código do motor (`publisher/`, o estudo `12 Concelhos` fora de `source/`), o código do sítio (`src/`, `scripts/`), as notas dos construtores nem os briefs deles. Lês só esta lista, a Emenda 14 e a Emenda 19 de `design/especime-v3/direcao.md`, e a tabela-resumo de `design/especime-v3/medicoes/fontes-308-2026-08-26.md` (para saber que ficheiro é que fonte). Cada detetor é provado num caso conhecido antes de dar um zero. Nada é «ok» sem o número.

## 1 · As medições

1. **A amostra.** Tira 30 concelhos ao acaso dos 308 (semente escrita no relatório), mais Évora, Lisboa, Bragança, Penedono, Corvo, Sertã, as duas Lagoas e as duas Calhetas (que entram sempre). Para cada um e para cada medida com linha (população, poder de compra, empresas, desemprego, dívida, limite, índice, PMP): lê o valor **diretamente do ficheiro da fonte alojado** (o JSON do INE pelo `geocod`, o PDF da DGAL pela linha do nome, o ODS do IEFP pela linha do nome) com código teu, e compara com o `value` da linha `ledger/claims/<slug>-<medida>-<periodo>.yml` e com o que a página `/municipios/<slug>` rende (o texto do `data-claim`). Três colunas: fonte, linha, página. Qualquer diferença é um achado com coordenada. Caso conhecido: altera um valor numa cópia de uma linha e vê o teu comparador acusá-lo.
2. **As somas de controlo**, a partir dos ficheiros alojados e das linhas: população dos 308 = 11 424 031; empresas = 1 576 606; desemprego do continente = o total «Continente» do ODS; a dívida e o limite somados = a linha TOTAL do PDF (universo de 307). Diz o que bate e o que não bate, número a número.
3. **As ausências são as certas.** Conta as linhas por medida e compara com o que as fontes permitem: Penedono sem dívida, limite, índice e PMP; os 30 concelhos das ilhas sem desemprego; os 9 «N.d.» do PMP sem linha; nenhuma linha de execução da receita. Na página, cada ausência tem de render «sem linha ainda» e nunca um número; caso conhecido: a página de um concelho das ilhas, a peça do desemprego.
4. **A mesma estrutura em todos.** Nas 308 páginas (uma edição chega; a outra por amostra de 20): a mesma ordem das oito peças, os mesmos rótulos, unidades e períodos; conta as páginas que têm secções além das peças, do cartão, da barra e das portas (esperado: só Évora). Caso conhecido: Évora tem a faixa dos mandatos.
5. **Os selos.** Em 20 páginas ao acaso, cada peça com número tem um selo com a fonte que a linha diz, e o selo abre a página de linha certa (`/livro-razao/<id>`); a página de linha mostra o excerto, e o excerto contém o valor tal como publicado.
6. **O índice dos 308** (`/municipios`): 308 ligações, uma por concelho, os nomes iguais aos da Carta; a pesquisa dá 308 resultados possíveis, todos ligações.
7. **O mapa da primeira página:** 308 pontos dentro de `<a>`; o clique num ponto ao acaso abre a página certa (10 ao acaso, a 1280).
8. **O livro-razão do conjunto** (`/livro-razao/concelhos`): a contagem de linhas na página é igual ao número de ficheiros `ledger/claims/*.yml` com `study: concelhos-2026`; a pesquisa por «Bragança» mostra só as linhas de Bragança; o CSV do livro-razão tem o mesmo número de registos que ficheiros de linha.
9. **A escala.** Tamanho de `dist/` e número de páginas; o tempo do `npm run build` que o construtor mediu está na nota dele, mas tu não a lês: mede tu, uma vez, numa cópia do repositório fora do ramo de trabalho, e escreve o tempo.
10. **A régua do inventário**: `node scripts/medir-defeitos.mjs` (o único script do sítio que corres): autorreferência e blocos por classificar nas rotas `municipio`, `municipios`, `livro` e a nova do conjunto.

## 2 · O relatório

`design/especime-v3/medicoes/concelhos-M5-sonnet.md` e o programa ao lado: as tabelas (fonte, linha, página) da amostra; as somas; as contagens; as discordâncias com coordenada e prova; as tuas falsas alarmes com a causa; os casos conhecidos vistos vermelhos; o custo em símbolos. Não corriges, não commitas, não tocas em nada fora de `medicoes/`.
