# A leitura curta da adenda E da MET1 (M48), 06.11.2026

Leitor: Claude Opus 5.5 (`leitor`, `xhigh`), sobre `pacote-lote5-curta-e-2026-11-06` (base 330fd7500, cabeça a7f56dc04), de 13:22 a 13:26 UTC; 11 chamadas pela contagem do harness (10 pela do leitor; orçamento 12), 73 371 símbolos. O leitor declarou uma falta à regra de execução: o primeiro comando, só de leitura, começou por um `cd` para a pasta do pacote.

## As plantas (registadas por sha256 fora do pacote)

| planta | ficheiro | o estrago | sha256 antes → depois | apanhada |
|---|---|---|---|---|
| E1 | `built/metodo/index.html` | o passo 2 do Método pt volta a prometer a cópia | 4cdeb435bb4a → bbd0dc4886b6 | achado 1 |
| E2 | `built/en/method/index.html` | o passo 2 do Método en diz que o número se estima | fae5fe8d7037 → 51f433759286 | achado 2 |
| E3 | `src/data/metodo.mjs` | a frase pt do passo 2 na fonte diz o documento do organismo em vez do documento da fonte | b6c4b835945b → 9925275f8e0c | achado 4 |
| E5 | `built/metodo/index.html` | o passo 3 do Método pt perde o excerto (frase fora do diff) | bbd0dc4886b6 → e78a89579971 | achado 3 |
| E4 | `scripts/metodo-aprovado.json` | a frase en do passo 2 na lista fechada perde «itself» | d3574bc99cd8 → c967579951ae | achado 5 |

**Cinco em cinco.** Nenhum achado real Blocking ou Major.

## Os achados Minor e o que este lugar fez

- **6:** o passo 7 («lê-a contra os documentos») é da mesma classe do passo 2: a leitura a frio lê os corpos alojados das linhas que o bloco toca (M83), e as linhas sem corpo alojado lê-as contra o recibo. Para a higiene, com a medida de quantas leituras desde a M83 leram corpos alojados.
- **7:** o recibo não diz quem leu o documento; a frase do passo 2 fica, porque o que mede o número no documento é o excerto que o recibo mostra.
- **8 (real, anterior ao lote, no ar):** a página do recibo do exemplo diz «Ficheiro da fonte relido a 01.09.2026, igual à fonte · conferência diária do ficheiro da fonte», 66 dias antes da construção. Medido por este lugar no livro-razão da cabeça: das 4 144 linhas, 2 636 têm verificações, e a última de 2 545 é de 01 a 03.09.2026 (as outras 91, da reconferência do painel, de 02.11.2026). A palavra «diária» não é verdade em cerca de 2 545 páginas de recibo no ar. O lote 5 não a imprime de novo nem a muda; vai à cabeça da fila como bloco próprio (REL1). O passo 9 do Método liga a data da reconferência ao painel da União (`/uniao-europeia#painel`), e não à linha do exemplo.
- **9 e 10:** números do construtor sem registo no pacote; as contagens do §0 deste lugar sem o livro-razão no pacote (medidas por guião na cabeça, no registo da sessão).

## O relato do leitor, resumido

Os achados 1 a 5 são as cinco plantas (o passo 2 português com a cópia de volta; «estimates» no inglês; o passo 3 português sem o excerto; «do organismo» na cópia de `src/data/metodo.mjs`; «itself» fora da cópia da lista fechada). O que está bem: o diff toca só cinco ficheiros, nenhuma vista, régua ou desenho; a frase do passo 2 exata no diff nas duas edições, nos dados e na lista fechada, e a antiga retirada nos quatro lugares; 73 das outras cadeias iguais entre os dados e a lista fechada; «recibo do pedido» em lado nenhum; o desenho sem texto visível; a §1.226 a seguir à 1.225; o pacote completo; o total das dirigidas certo; sem frases sobre o que o sítio não faz. A pergunta do editor: com o `dist/` da cabeça como o diff diz, imprimia.
