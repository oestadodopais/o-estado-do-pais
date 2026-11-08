# COR-AGUA H: paragem pela área dos selos a 390 px

A H2 limpa fica verde e a planta `registo-sem-classe` recusa pela H2. Porém, 14 dos 42 selos do registo não passam a prova de área inteira a 390 px, mesmo com a classe. Paragem pelo §2, sem alargar a dispensa. O código 0 da H2 não prova essa condição: a comparação da faixa só inclui os alvos que já passam a 390 px.

Retirada a regra da adenda C que esticava a entrelinha. A classe nova está apenas na frase das correções textuais, dentro de `data-texto-estudo`. Entram em prosa corrida 42 selos, 21 em português e 21 em inglês. Nenhum alvo fora do registo mudou de família. A seleção dirigida do escrivão acrescenta a planta nova às três conferências habituais; a chamada habitual conserva o custo anterior.

| Conferência | Código |
| --- | --- |
| `check:voz` | 0 |
| `check:formato` | 0 |
| `check:selos` | 0 |
| `check:edicoes` | 0 |
| `typecheck` | 0 |
| `alvos` | 0 |
| `build` | 0 |

Os 14 casos a 390 px, com o caminho exato do elemento, a caixa, o toque medido e o resultado, estão no ficheiro de medidas.

| Rota | Selo | Toque medido em px |
| --- | --- | --- |
| `correcoes/pt` | a.src-chip «fonte · DGADR» | 53.8 × 26.5 |
| `correcoes/pt` | a.src-chip «linha · O Estado do País» | 52.3 × 26.3 |
| `correcoes/pt` | a.src-chip «fonte · Gulbenkian» | 53.3 × 44.7 |
| `correcoes/pt` | a.src-chip «fonte · Gulbenkian» | 53.3 × 44.7 |
| `correcoes/pt` | a.src-chip «linha · O Estado do País» | 52.3 × 26.3 |
| `correcoes/pt` | a.src-chip «fonte · DGADR» | 53.6 × 44.7 |
| `correcoes/pt` | a.src-chip «fonte · Marques, Cruz & Associados» | 53.3 × 44.7 |
| `correcoes/en` | a.src-chip «source · DGADR» | 61.9 × 26.3 |
| `correcoes/en` | a.src-chip «source · Gulbenkian» | 61.9 × 27 |
| `correcoes/en` | a.src-chip «source · Gulbenkian» | 61.9 × 26.3 |
| `correcoes/en` | a.src-chip «row · O Estado do País» | 44.7 × 26.3 |
| `correcoes/en` | a.src-chip «row · O Estado do País» | 44.7 × 26.3 |
| `correcoes/en` | a.src-chip «source · ERSAR» | 62.2 × 25.4 |
| `correcoes/en` | a.src-chip «source · Marques, Cruz & Associado» | 62.2 × 25.4 |

Algumas caixas medidas ultrapassam 44 px nos dois eixos mas falham os pontos de toque da régua; conserva-se o resultado `ok: false`, sem o substituir pela dimensão da caixa.

Até à escrita: 32 chamadas, oito corridas contando a medição das famílias, sem ajudantes. A resposta final inclui o commit e a verificação final.
