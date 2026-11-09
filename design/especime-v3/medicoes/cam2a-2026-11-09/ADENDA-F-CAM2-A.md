# Adenda F ao mandato CAM2-A: as citações conferidas sem máscara, as frases geradas de um modelo de texto fora da cobertura, e a palavra a seguir ao número (09.11.2026)

Acrescenta: nada
Medidas: medidas-direcao-adenda-f-cam2a.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta da adenda E (cinco plantas em cinco). Sexta retoma, a mesma sessão, por decisão escrita.*

## §0 Medido (pela leitura curta, no `dist/` de 5314456eb, com os módulos do bloco)

- **A citação com outro número.** Com a presença mascarada, uma página que imprime «A variação foi de 9,0» quando o registo e o excerto dizem 8,0 passa: `conferirRegisto` sem erros, e a cobertura sem erros. A conferência das citações lê o texto registado (`f.pt`), nunca a frase impressa. Das 22 entradas, 4 têm algarismos dentro das citações portuguesas.
- **As frases geradas.** As linhas das revisões da leitura da semana («…: publicado X; a fonte escreve agora Y, na releitura de <data>.», e o inglês) estão tipadas como `atribuicao` e na lista das por registar. Mudando o indicador revisto, o painel recusa-se: «frase sem registo» duas vezes e «já não está no dist» duas vezes. Os modelos de texto estão em `src/i18n/strings.mjs` (a linha das revisões) e em `src/data/metodo.mjs` (a linha do painel no Método).
- **A palavra a seguir ao número.** Nenhuma planta mostra que uma palavra a seguir a um número fica na chave. «morreram ⟦número⟧ pessoas» e «morreram ⟦número⟧ crianças» dão chaves diferentes no código, mas uma máscara que engolisse a palavra seguinte passava as plantas.

## §1 O que fazes

1. **As citações sem máscara.** Para cada entrada do registo, a frase impressa na página que lhe corresponde, encontrada pela chave mascarada, tem as mesmas citações que o registo, letra por letra e com os números, nas duas línguas. Uma planta: a página imprime 9,0 dentro da citação e o registo diz 8,0, e a conferência recusa.
2. **Os modelos de texto.**
   - Uma lista fechada dos modelos de texto que geram frases a partir do livro-razão: a linha das revisões, nas duas línguas, e a linha do painel no Método, nas duas línguas.
   - Cada modelo vira uma expressão regular. As partes variáveis (o nome do indicador, os valores, as unidades e as datas) são as únicas que aceitam texto livre, e o resto é literal.
   - Uma frase que case com um modelo, inteira, sai da cobertura e conta à parte. Dizes quantas, por língua.
   - A lista fica presa por sha256, com a data e a razão, como as marcas. Juntar um modelo exige o pino novo e a razão no mesmo commit.
   - Uma conferência garante que cada modelo da lista existe, com o mesmo texto, no ficheiro que o gera.
   - **Plantas:**
     - a linha de revisão de um indicador que hoje não está revisto passa;
     - uma frase escrita à mão, com uma atribuição, não casa e pede registo;
     - uma linha de modelo com uma oração acrescentada no fim não casa;
     - um modelo na lista que já não existe no ficheiro recusa-se.
3. **A palavra a seguir ao número:** uma planta em que uma palavra a seguir a um número muda («8 pessoas» para «8 crianças», «8 mil» para «8 milhões») e a chave muda.
4. **A lista inicial e a semente** regeneram-se, com os pinos novos, sobre o `dist/` da cabeça. Dizes as contagens antes e depois.
5. **A simulação do painel seguinte** sobre o `dist/` da cabeça: as datas e os valores mudados, e outro indicador revisto. A cobertura passa, e dizes o comando.
6. **O fecho:**
   - o `build`;
   - `check:frases-afirmacao` com e sem o motor, `check:mortos`, `ledger:check` com e sem o motor, `check:pre-mandato` e `typecheck`, com os códigos.
   
   Os commits vão pelo `comitar.sh`, com o assunto a começar por `CAM2-A`.

## §2 Quando paras

Como no §2 do mandato, com o teto de 4 000. Pára também se um modelo de texto só se puder descrever com uma parte livre que aceite uma frase escrita à mão.

## §3 O fim

O ponto 6. Trinta minutos e quarenta chamadas, sem ajudantes.
