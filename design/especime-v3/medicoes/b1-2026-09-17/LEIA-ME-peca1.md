# B1, primeira peça: passagem de correção

Cabeça final conferida: `8de4e841f5623f6a198bf7b1da2de32c205580f8`. Ramo: `b1-2026-09-17`. Correções feitas nesta worktree, sem push. Os ficheiros das edições, os registos, as linhas do livro-razão e os temas dos estudos não mudaram nesta passagem. [Conferência de integridade e resumos das quatro páginas](integridade-correcao-peca1.json).

Esta é a verificação do construtor depois da [leitura a frio](leitura-a-frio-peca1.md), não uma nova leitura independente. A cabeça acima contém os commits das correções; os resultados finais, as capturas e este relatório são artefactos medidos nessa cabeça e ficam na worktree para recolha.

| Achado | Resultado da triagem e da correção |
|---|---|
| 1, 2, 3, 5, 8 | Plantas limitadas às cópias do pacote, conforme a triagem recebida. Nenhuma correção nas fontes por estes achados. |
| 4 | Efeito do pacote. A passagem atual mede a cabeça final que está escrita acima. |
| 6 | A marca compara a língua da edição com a página. A lista PT diz «(em inglês)» e a EN «(in Portuguese)» quando necessário. Marcas medidas: PT: 1; EN: 3. |
| 7 | Só há Fontes e verificação com valor, nome da medida, fonte e data de verificação do livro-razão. 79 recibos em 7 páginas. Sem linha no sítio, ou sem os quatro campos, não se inventa um recibo. Identificadores e marcadores técnicos saíram. L6 confere campos, ordem, porta e ausência da secção quando está vazia. |
| 9 | A exclusão de ligações transcritas fica limitada à rota estudo. A decomposição medida da L1 está abaixo. |
| 10 | 26 páginas de estudo têm um rótulo de IA no topo, pelo mesmo componente e texto do rodapé. A célula espera 1 nessa rota e conserva a razão da primeira exposição. A H14 mede a linha única no navegador, o corpo mínimo de 12 px e a posição antes do título. A porta mantém o alvo de 44 px. Nas larguras das capturas fica numa linha; abaixo de 390 px conserva a quebra natural para manter o corpo mínimo. |
| 11, 15, 16 | Dez redirecionamentos 301 em vercel.json. As rotas antigas não têm ficheiros em dist/. A célula confere origem, destino exato e existente, código e canónica única sem barra final, como no restante sítio. A planta troca um destino da tabela. H3 volta a exigir um título em cada HTML, sem exceção para redirecionamentos. A amostra de texto longo da acessibilidade abre agora o corpo na rota nova. A conferência das ligações segue as entradas 301 exatas para conferir o ficheiro e a âncora, mantendo válidas as portas antigas das páginas de área. |
| 12 | As contagens leem a página do lugar na língua da lista. Página ilegível ou secção em falta produz erro explícito. Plantas exercitam a edição inglesa, a página ausente e a secção ausente. |
| 13 | check:voz conta 7 temas distintos, não 13 estudos. |
| 14 | Os três títulos aprovados definem a leitura pela ordem. A célula confere a pertença de todos os blocos e o começo do texto. 2 registos com leitura e 8 sem leitura, ditos expressamente pelo portão. |
| 17 | Só data-registo-unidade sai da leitura das palavras proibidas. A posição da secção e Subir são conferidos, com plantas próprias. |
| 18 | O git log com os trailers e a comparação integral com a tabela de fazer.py estão copiados abaixo. |
| 19, da direção | Os espaços dos milhares são inseparáveis e os selos, incluindo o marcador interior, levam white-space: nowrap. A C5 exige U+00A0 entre os algarismos na página; a C4 continua literal no registo. Uma planta volta a pôr um espaço quebrável. As vinte capturas medem zero valores partidos, zero selos partidos e zero deslocamento lateral. |

A retirada das entradas sem recibo elimina também as portas para essas entradas. Os números permanecem transcritos, com marca e linha do motor conferidas por L4 e C5. L6 e C6 continuam a recusar um selo em figura sem linha do sítio. A edição publicada continua acessível no fim. Os nomes das fontes são citações verificadas. Quando o selo declara um campo por confirmar, a definição existente aparece junto do primeiro marcador da página. Nas 95 ocorrências de linhas do sítio, 16 não têm todos os campos pedidos e ficam fora da secção. São contagens por edição, não de linhas distintas. Os nomes aprovados das figuras, das medidas de domínio e do projeto entram pela mesma ordem que no livro-razão, antes do rótulo da fonte. A L6 refaz a escolha a partir dessas declarações. Linhas sem nome de medida ou outro campo do recibo não recebem nomes inventados nem títulos de documento apresentados como nomes de medida.

| Registo | Leitura | Recibos apresentados |
|---|---|---|
| evora-quinze-anos-cinco-mandatos/pt | não | 16 |
| evora-economia-investidores-portas-abertas-2026/pt | não | 8 |
| evora-orcamentado-pago-devido-2025/pt | não | 20 |
| evora-os-pelouros-quem-os-teve-o-que-fizeram/pt | não | 5 |
| evora-prometido-pago-auditado-2026/pt | não | 5 |
| evora-2027-prometido-painel-dinheiro/pt | sim | 0 |
| avaliacao-economica-regional-de-portugal-2026/pt | não | 0 |
| evora-orcamentado-pago-devido-2025/en | não | 20 |
| evora-prometido-pago-auditado-2026/en | não | 5 |
| evora-2027-prometido-painel-dinheiro/en | sim | 0 |

## L1: o que saiu da contagem

A referência anterior ao B1 é a [medição guardada do E1](../e1-2026-09-16/l1-composicao-2026-09-16.txt). A [medição desta passagem](l1-correcao.json) conta o mesmo HTML com e sem a exclusão. O [medidor](medir-l1-correcao.mjs) guarda as páginas e os destinos repetidos, por família e modo. A comparação reúne as antigas páginas de texto e as novas páginas de estudo para medir a retirada efetiva das portas.

| Passo medido | Páginas que saem | Contagem restante |
|---|---|---|
| Referência antes do B1 | | 2286 |
| Portas duplicadas retiradas da apresentação, seis páginas de estudo e as duas listas | 8 | 2278 |
| Ligações deixadas de contar dentro das unidades transcritas, só nas páginas de estudo | 7 | ver teto abaixo |

**Teto medido: 2271.** É o valor único em [lugar-tetos-b1.json](../../../../scripts/lugar-tetos-b1.json), lido por check-lugar.mjs e conferido pelo gerador deste relatório contra a medição. O modo antigo, global, e o modo limitado ao estudo dão a mesma contagem nesta construção; a planta numa página de outra família prova que a exclusão deixou de se aplicar ao sítio inteiro.

## Portões na cabeça final

```text
Cabeça: 8de4e841f5623f6a198bf7b1da2de32c205580f8
Ramo: b1-2026-09-17

npm run build
Código: 0
Registo: build-peca1.log
Início: 2026-09-17T20:00:04.066482+00:00
Fim: 2026-09-17T20:05:01.038864+00:00

npm run verify
Código: 0
Registo: verify-peca1.log
Início: 2026-09-17T20:05:01.044593+00:00
Fim: 2026-09-17T20:13:17.516857+00:00

npm run typecheck
Código: 0
Registo: typecheck-peca1.log
Início: 2026-09-17T20:13:17.523198+00:00
Fim: 2026-09-17T20:13:17.750797+00:00
```

Cada comando correu separadamente. Registos completos: [build](build-peca1.log), [verify](verify-peca1.log), [typecheck](typecheck-peca1.log). As [22 plantas desta passagem](correcao-plantas-todos.json) deram código diferente de zero com a falha esperada e repuseram os bytes originais. A [conferência depois da reposição](reposicao-correcao-peca1.json) também deu 0. As plantas antigas permanecem como provas históricas da construção anterior.

## Temas: comparação com a maqueta

Tabela TEMA_DO_ESTUDO copiada de [fazer.py](../../maquetas/b1/fazer.py), comparada entrada a entrada com WORKS. O gerador lê a atribuição Python com ast.literal_eval; não executa a maqueta nem toma «coincide» como prova.

| Estudo | fazer.py | studies.mjs | Igual |
|---|---|---|---|
| evora-2027-prometido-painel-dinheiro | cultura | cultura | sim |
| evora-prometido-pago-auditado-2026 | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| evora-quinze-anos-cinco-mandatos | governo-e-democracia | governo-e-democracia | sim |
| evora-economia-investidores-portas-abertas-2026 | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| evora-orcamentado-pago-devido-2025 | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| evora-os-pelouros-quem-os-teve-o-que-fizeram | governo-e-democracia | governo-e-democracia | sim |
| penalizacoes-por-reforma-antecipada-2026 | seguranca-social-e-pensoes | seguranca-social-e-pensoes | sim |
| onde-esta-a-agua | agua | agua | sim |
| agua-nao-faturada | agua | agua | sim |
| avaliacao-economica-regional-de-portugal-2026 | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| which-door-is-yours | investimento | investimento | sim |
| alentejo-algarve | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| evolucao-de-portugal-desde-1981 | populacao | populacao | sim |

## Commits e trailers

Saída de `git log --format='%h %s%n%(trailers)' 2bf8b238b912fcb89da74096281305c75f0a3b3c..HEAD`:

```text
8de4e841 B1: o relatório mostra o histórico e a comparação dos temas
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

ae2017f7 B1: limita a exclusão da L1 ao estudo e regista o teto medido
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

4b2bfe1e B1: os valores selados conservam os milhares na mesma linha
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

db054276 B1: só a transcrição fica fora das palavras proibidas
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

a7252d7e B1: a lista de títulos aprovada define a fronteira da leitura
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

96db6564 B1: a voz conta os temas distintos conferidos
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

894ec78d B1: reconta os estudos na página de cada língua e recusa ausências
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

8541b934 B1: as dez rotas antigas redirecionam no servidor com 301
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

1613032d B1: repõe a divulgação de IA no topo de cada estudo
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

0056c6a7 B1: fontes e verificação mostram apenas recibos do sítio
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

38e0c86e B1: a marca da língua acompanha a edição nas duas listas
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

3e80034a A leitura a frio da peça 1 (Claude Opus, 5 de 5 plantas apanhadas, 34 achados), filada com o bloco
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

3da02ca5 O relatório e as quarenta capturas da peça 1 do B1, tal como o construtor os deixou
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

dd33e1ef O diagnóstico do título distingue os redirecionamentos válidos
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

fadc289d A edição fixada tem uma porta de leitura e a planta da voz segue o corpo
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

779906dd A porta da edição fixada é conferida contra a nova rota do estudo
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

64fbdeda Os portões conferem a forma B1 e a voz fica presa à lista fechada
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

9bb41e7e As portas existentes abrem o estudo e a componente de edições sai
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

5dcbc538 O estudo abre no texto e a lista separa o país dos lugares
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

fb701acc Os estudos distinguem o tema do lugar e transcrevem a abertura da água
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub
```

## Vinte capturas depois

[Resumos SHA-256, larguras e medidas](capturas-depois-peca1.json). As vinte capturas antes mantêm os resumos originais, conferidos novamente. As capturas de janela a 390 e 1280 também foram refeitas.

| Largura | Estudo PT | Estudo EN | Lista PT | Lista EN |
|---|---|---|---|---|
| 390 | [PNG](../../capturas/b1-2026-09-17/depois-estudo-pt-390.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudo-en-390.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-pt-390.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-en-390.png) |
| 768 | [PNG](../../capturas/b1-2026-09-17/depois-estudo-pt-768.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudo-en-768.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-pt-768.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-en-768.png) |
| 1024 | [PNG](../../capturas/b1-2026-09-17/depois-estudo-pt-1024.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudo-en-1024.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-pt-1024.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-en-1024.png) |
| 1280 | [PNG](../../capturas/b1-2026-09-17/depois-estudo-pt-1280.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudo-en-1280.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-pt-1280.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-en-1280.png) |
| 1600 | [PNG](../../capturas/b1-2026-09-17/depois-estudo-pt-1600.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudo-en-1600.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-pt-1600.png) | [PNG](../../capturas/b1-2026-09-17/depois-estudos-en-1600.png) |

[Navegação medida](navegacao-correcao-peca1.json): 19 verificações, incluindo as dez rotas antigas com e sem barra, a abertura do índice e uma secção com oito recibos. A mesma prova mede os valores e selos dos dez corpos a 390 px, com as fontes abertas, e exige zero quebras.

A configuração dos redirecionamentos segue a [documentação oficial do Vercel](https://vercel.com/docs/project-configuration/vercel-json#routes). A prova local confere a tabela e o resultado construído; não houve lançamento nem teste de produção nesta passagem.
