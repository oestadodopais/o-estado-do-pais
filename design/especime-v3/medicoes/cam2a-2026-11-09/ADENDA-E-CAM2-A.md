# Adenda E ao mandato CAM2-A: a chave de uma frase sem os algarismos, e os imports mortos (09.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois de a corrida `portão` do GitHub dar vermelho na cabeça d21c48f0b, que junta a CAM2-A e o painel semanal de 09.11.2026. Quinta retoma, a mesma sessão, por decisão escrita. Os dois vermelhos vêm de uma falha de desenho e de uma conferência que este lugar não pôs na lista dirigida.*

## §0 Medido (na corrida `portão` `42634296115` e no `dist/` de d21c48f0b, com os módulos do bloco)

- **A parte 4: `check:frases-afirmacao` com o código 1.** Recusou oito frases sem registo e duas entradas da lista cuja frase já não está no `dist/`, todas em `/explicacoes/leitura-da-semana` e em `/metodo`, nas duas línguas. As frases mudaram só na data do painel. Por exemplo, «Os números do painel são relidos na fonte, a última vez a 09.11.2026; …» estava na lista com «02.11.2026», e «… a fonte escreve agora 8,0, na releitura de 09.11.2026.» também. A chave da frase é o texto inteiro, e o painel muda datas e valores todas as semanas. Sem correção, cada painel de segunda-feira fica preso pela cobertura.
- **A parte 5: `check:mortos` com o código 1.** `scripts/medir-frases-afirmacao.mjs` importa `inventario`, `parDaFrase`, `tiposDaFrase` e `tiposComContexto` sem os usar. A lista dirigida deste lugar depois das adendas C e D não tinha o `check:mortos`.

## §1 O que fazes

1. **A chave sem os algarismos.** A chave de uma frase, na cobertura, no registo e na lista das por registar, troca cada número por um marcador único antes do sha256: uma sequência de algarismos com os seus separadores internos (`.`, `,`, `:`, `/`, `%` colado e o espaço de milhares). O mesmo vale para as datas.
   - O registo guarda o `pt` e o `en` como as páginas os imprimem. A presença compara as formas com o marcador.
   - O README diz porquê. Os números têm a sua proveniência no livro-razão (a regra 1) e nas réguas dos números. A camada 2 guarda as palavras das atribuições e das causas. O painel e as revisões mudam datas e valores nas frases todas as semanas.
2. **As plantas:**
   - uma frase que muda só uma data ou um valor conserva a chave;
   - uma frase que muda uma palavra ganha uma chave nova e pede registo;
   - duas frases que diferem só nos números contam como a mesma.
3. **A lista inicial e a semente** regeneram-se com a chave nova, com os pinos novos, sobre o `dist/` da cabeça d21c48f0b, que já tem o painel. Dizes as contagens por língua, antes e depois da chave nova.
4. **Os imports mortos** de `scripts/medir-frases-afirmacao.mjs` saem.
5. **O fecho:**
   - o `build`;
   - `check:frases-afirmacao` com e sem o motor, `check:mortos`, `ledger:check` com e sem o motor, `check:pre-mandato` e `typecheck`, com os códigos.
   
   A comparação das páginas da adenda D vale para o código da CAM2-A; o painel muda as datas por desenho, e não se repete. Os commits vão pelo `comitar.sh`, com o assunto a começar por `CAM2-A`.

## §2 Quando paras

Como no §2 do mandato, com o teto de 4 000.

## §3 O fim

O ponto 5. Trinta minutos e quarenta chamadas, sem ajudantes.
