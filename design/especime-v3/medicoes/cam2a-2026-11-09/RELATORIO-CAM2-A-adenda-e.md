# CAM2-A: fecho da adenda E

A chave anterior prendia as datas e os valores do painel. A identidade agora substitui cada sequência numérica por `⟦número⟧` antes do sha256. A deteção, as citações, os excertos e a proveniência conservam os números. Os quatro imports mortos da medição foram removidos.

Implementação: `5314456ebdd0cb03048595b6e84d44bd10a002c3`. Base da regeneração: `d21c48f0b14e40dc0ed1605638b685d39c5de8dc`, já com o painel de 09.11.2026. A lista inicial e o pino da semente foram regenerados; o histórico das marcas não foi reiniciado.

| Medida | Antes PT | Depois PT | Antes EN | Depois EN |
| --- | ---: | ---: | ---: | ---: |
| Frases únicas | 1317 | 1313 | 1168 | 1164 |
| Por registar | 1295 | 1291 | 1146 | 1142 |

As 22 entradas bilingues continuam por julgar. Comparadas sem o identificador, são iguais às anteriores: texto, tipos, linhas e locais não mudaram. Restam 2433 pendentes, abaixo do teto de 4000.

O antes é o inventário e a semente regenerados sobre o mesmo `dist/`, com o código anterior. A lista comitada antes da revisão do painel tinha 1292 entradas PT e 1143 EN; não servia como inventário atual. As medidas guardam ambas as contagens e as contagens por estudo.

As plantas exercitam datas, valores, percentagens, separadores e espaços de milhares; uma palavra diferente exige registo; duas frases que só diferem nos números contam uma vez. A presença aceita a data revista, mas um número alterado na citação guardada continua a ser recusado contra o excerto. A semente lê o texto da ocorrência concreta para não misturar variantes numéricas deduplicadas.

| Conferência | Código |
| --- | ---: |
| `npm run ledger:check` (ledger-com-motor) | 0 |
| `npm run ledger:check` (ledger-sem-motor) | 0 |
| `npm run check:pre-mandato` (pre-mandato) | 0 |
| `npm run check:frases-afirmacao` (frases-com-motor) | 0 |
| `npm run check:frases-afirmacao` (frases-sem-motor) | 0 |
| `npm run build` (build) | 0 |
| `npm run check:mortos` (mortos) | 0 |
| `npm run typecheck` (typecheck) | 0 |
| `node tests/leituras/frases-afirmacao.mjs` (plantas) | 0 |
| `npm run check:frases-afirmacao` (frases-pre-build) | 0 |

Com `RESEARCHHUB_DIR`, as conferências dizem `corpos lidos`: 795/795 linhas no livro-razão e 21 linhas de suporte do registo. Sem essa variável, dizem que não leram os corpos e `limpa=false`; o código zero não declara prova local limpa.

Comandos de geração, antes e depois: `lerPaginas("dist")`, `semear(paginas, loadClaims())` e `medidas(paginas, resultado)`. A geração depois correu por `node scripts/gerar-frases-afirmacao.mjs dist <destino-novo> <medidas.json>`. Todas as conferências com saída longa correram por `sh scripts/leituras/curto.sh <registo> <comando...>`. Para a corrida sem motor, o ambiente removeu apenas `RESEARCHHUB_DIR`.

Não se repetiu a comparação das páginas, conforme a adenda E. O build é o da implementação acima; o commit do relatório não altera código nem conteúdo do leitor. Não houve corrida inteira dos portões, capturas, rede, instalação de dependências ou ajudantes.

Custo até à escrita deste relatório: 32 chamadas de ferramentas, 37 operações internas e 10 corridas de conferências, contando cada comando principal uma vez e excluindo as verificações automáticas do commit. A resposta final inclui as chamadas do fecho. A linha tokens used não foi exposta.
