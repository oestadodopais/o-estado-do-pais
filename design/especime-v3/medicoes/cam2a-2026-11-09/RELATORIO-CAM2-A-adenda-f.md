# CAM2-A: fecho da adenda F

A presença mascarada deixava passar uma citação impressa com outro número. Agora todas as ocorrências com a mesma chave são conferidas contra as citações do registo, sem máscara, em PT e EN. Uma ocorrência correta não esconde outra adulterada. A prova contra o excerto continua intacta.

Implementação: `c745e734568d62309e4236de89a22c4fd0275a20`. A semente regenerada é igual byte a byte à anterior: 22 entradas, todas por julgar. A lista inicial e os pinos foram atualizados sobre a cabeça d9a6489a9.

| Contagem | Antes PT | Depois PT | Antes EN | Depois EN |
| --- | ---: | ---: | ---: | ---: |
| Frases na cobertura | 1313 | 1310 | 1164 | 1161 |
| Por registar | 1291 | 1288 | 1142 | 1139 |

Saem da cobertura 4 ocorrências PT e 4 EN, contadas à parte. São seis chaves únicas retiradas; em cada língua, as duas revisões da quota das exportações diferem apenas nos números e já partilhavam a chave. Restam 2427 pendentes, abaixo do teto de 4000.

Os quatro modelos são os textos da revisão semanal e do painel no Método, nas duas línguas. A expressão regular casa a frase inteira, só na coleção respetiva. As partes fixas são literais; indicador, unidade e período vêm de alternativas exatas do catálogo do livro-razão. Valores e datas têm gramática numérica. Nenhum campo aceita prosa livre. A conferência recompõe os modelos dos dois ficheiros de origem. O mesmo código do pino das marcas confere o histórico e o índice dos modelos, com data e razão novas no commit da mudança.

As plantas recusam 9,0 na página quando o registo diz 8,0, também na edição inglesa; uma ocorrência adulterada entre ocorrências corretas; uma palavra trocada depois do número, incluindo pessoas/crianças e mil/milhões; prosa manual; uma oração acrescentada ao modelo; e um modelo divergente do seu ficheiro de origem.

A simulação usa `abandono-escolar-precoce-2024`, ausente das revisões atuais, valores de ensaio e a data 16.11.2026. Mudou 8 ocorrências e terminou com 0 recusas. Lê o `dist/` e altera a projeção textual em memória, sem escrever nas páginas. Comando: `node scripts/simular-painel-frases.mjs dist <medidas.json>`. Os exemplos completos e as contagens por estudo estão nas medidas.

| Conferência final | Motor | Código |
| --- | --- | ---: |
| `npm run build` | com | 0 |
| `npm run ledger:check` | com | 0 |
| `npm run ledger:check` | sem | 0 |
| `npm run check:pre-mandato` | com | 0 |
| `npm run typecheck` | com | 0 |
| `npm run check:mortos` | com | 0 |
| `npm run check:frases-afirmacao` | com | 0 |
| `npm run check:frases-afirmacao` | sem | 0 |

As quatro corridas anteriores ao fecho também tiveram código zero: plantas, mortos, frases com motor e simulação. São doze corridas no total, contando cada comando principal uma vez; não se contam novamente os subcomandos do build nem os preflights automáticos do commit.

Com o motor, o livro-razão diz `corpos lidos`, 795/795 linhas, e o registo lê 21 linhas de suporte. Sem motor, ambos declaram que não leram os corpos e `limpa=false`. O código zero sem motor não equivale a uma prova local limpa.

As saídas longas correram por `sh scripts/leituras/curto.sh <registo> <comando...>`. A semente foi gerada por `node scripts/gerar-frases-afirmacao.mjs dist <destino-novo> <medidas.json>`. Não houve corrida inteira dos portões, capturas, rede, instalação ou ajudantes. Não se repetiu a comparação das páginas dispensada pela adenda E.

O custo até à escrita do relatório está nas medidas; a resposta final inclui as chamadas do fecho. A linha tokens used não foi exposta.
