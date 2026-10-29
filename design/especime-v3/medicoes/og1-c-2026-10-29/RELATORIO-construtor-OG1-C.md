Implementado e comitado. Os quatro portões finais passaram: **`build=0`, `verify=0`, `typecheck=0`, `motor=0`**. As duas worktrees estão limpas.

- Motor: `a7c378a6a`, **OG1-C1**.
- Sítio: `c14a57140`, **OG1-C2**.

O leitor encontra agora «Quem fala, segundo a fonte» nas 16 páginas de afirmações, nas duas edições, com a frase selada e a nota do modo. A edição inglesa marca a frase original como `pt-PT`. O Método recebeu exatamente a cláusula fornecida.

As provas contêm **13 atribuições por passagem, 2 por documento e 1 por entrevista**. As nove `speaker_label` foram conservadas.

**Verificação**

| Comando ou conferência | Corridas | Resultado |
|---|---:|---|
| `python3 -m publisher.oe2027_generalidade_test`, incluindo `--record` | 4 | 129 → 178 checks; última saída 0 |
| Teste OG1 do sítio, versões anterior e nova | 3 | 636 → 786 checks; últimas saídas 0 |
| `npm run ledger:check` | 2 | Última saída 0 |
| `npm run check:discussao` | 2 | Última saída 0 |
| `npm run check:cartao` | 2 | Última saída 0 |
| `npm run check:voz` | 2 | Última saída 0 |
| `npm run gate:html`, isolado | 2 | Preparação incompleta; passou depois no `build` final |
| `npm run check:lingua` | 1 | 0 |
| `python3 scripts/leituras/conferir-mapa.py …` | 1 | 0 |
| Conferência direta de `conferirOg1()` | 1 | 57 linhas relidas, 14 plantas recusadas, zero erros |

As cinco plantas novas da régua OG1 morderam. As plantas de frase alterada e nota de modo trocada foram recusadas nas duas edições. As 16 âncoras foram conferidas nos corpos alojados e as 32 páginas construídas foram verificadas.

A medição inicial do sítio falhou por ausência de `dist/`. A versão anterior do teste foi conservada e executada depois da construção, dando os 636 checks. As primeiras conferências da construção parcial encontraram a falta do carimbo e dos cartões de partilha. Esses passos foram completados na preparação e na corrida final. No motor, corrigi uma planta que usava um bloco repetido e, por isso, não testava corretamente a ordem entre frase e citação.

As contagens de `html_blocks()` coincidiram exatamente com o mandato:

| Ficheiro | Blocos |
|---|---:|
| `ps.html` | 140 |
| `pcp-comunicado.html` | 282 |
| `pcp-raimundo.html` | 295 |
| `be-dn.html` | 86 |
| `il-eco.html` | 275 |
| `livre-cm.html` | 213 |
| `rtp-audicao.html` | 132 |
| `eco-juros.html` | 291 |
| `observador-audicao.html` | 254 |
| `rtp-aominuto-28.html` | 721 |

**Livro e exportação**

O `ledger.json` mantém **112 linhas**. Apenas 16 mudaram, exclusivamente pela adição de `atribuicao`. Nenhum `value`, `excerpt`, `attributed_to` ou `published_at` mudou.

A geração do livro, das provas, do LEIA-ME e a exportação terminaram com código 0. O manifesto das linhas exportadas permaneceu igual.

A exportação alterou estes ficheiros no sítio:

- `ledger/provas/og1a/provas.json`
- `ledger/cruzamentos/og1a-provas.json`
- `ledger/cruzamentos/og1a.json`

**Nenhum ficheiro de `ledger/claims/` mudou.** Também não mudou `src/data/discussao-og1.mjs`, nem foi criada uma correção pública.

**Decisões de implementação**

- **OG1-C-1:** `source_sha256` ficou no nível da prova, mantendo `atribuicao` exatamente igual à linha relida no motor.
- **OG1-C-2:** conservei a atualização adicional de `og1a.json`: o exportador atualizou 16 datas de exportação, 16 resumos de linhas de origem e 57 referências ao resumo do livro.
- **OG1-C-3:** a vista importa diretamente as provas. O portão de HTML ganhou apenas o campo `atribuicao.frase`, conferido contra essa prova, mantendo as restantes guardas.
- **OG1-C-4:** a §1.210 ainda não existia e a amarra do Método recusou a mudança. Registei a decisão já comunicada no mandato e o carimbo medido `d12253bd3404`; o relato de fecho ficou explicitamente reservado à direção.
- **OG1-C-5:** atualizei `verificacao.json` para os 178 checks, evitando conservar a contagem anterior no LEIA-ME regenerado.
- **OG1-C-6:** o pre-commit executou automaticamente `core.gate`, apesar do adiamento previsto no mandato. Passou. O `core.gate` final também passou; não alterei nem contornei o hook.

Não foi necessário mudar `VOZ-MARCADORES.md`, a L1 ou outras listas de língua. O conferidor do mapa terminou com código 0, mantendo avisos sobre referências antigas.

Ficam para a direção a leitura a frio, as capturas e o relato de fecho da §1.210. Não houve publicação nem `push`.

**Consumo medido:** 93 chamadas de ferramentas; 20 conferências específicas; uma corrida completa pelo escrivão; uma execução automática adicional de `core.gate` no commit.

tokens used: **11 570 943**, último contador disponível antes deste relatório.