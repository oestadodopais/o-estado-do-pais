**PL1 ficou incompleto e sem commits.** Parei pela condição do §4: `check:leituras` devolveu **1** numa conferência existente, `tests/leituras/ferramentas.py`, porque a sandbox recusou o servidor local:

```text
Error: listen EPERM: operation not permitted 127.0.0.1
```

Ficaram implementados na worktree:

- `fila.py`, `pre-mandato.py` e os três medidores pedidos.
- Guardas da fila nos dois lançadores e pré-voo completo na retoma.
- Lotes, custos por bloco, limite diário e identificação das conferências no recibo.
- `--dirigidas`, secção semanal, aviso sobre «Fable only» e guarda da fusão.
- Mapa, ARRANQUE e custo inicial do PL1, com medições desconhecidas a `null`.

Nenhuma página do leitor nem o `CLAUDE.md` mudou.

| Conferência | Resultado |
|---|---:|
| Fila, versão final | 0 |
| Lotes, custos, métricas e pré-mandato | 0 |
| Medidores | 0 |
| Fusão | 0 |
| Pré-voo e lançadores, versão final | 0 |
| `--dirigidas`, dois passos | `01-a.code=0`, `03-check_c.code=0` |
| `conferir-regras.py` | 0 |
| `conferir-mapa.py` | 0 |
| `check:leituras` | 1, impedimento acima |
| Privacidade isolada | 1, faltava página construída |

Os ensaios de aterragem passaram dentro de `check:leituras`, depois de corrigida a preparação do arquivo dos recibos. Os três portões pelo escrivão **não correram**; não existem códigos `.codigo` dessa corrida.

A fila provou as cinco recusas: maquinaria antes de conteúdo pronto, maquinaria depois de navegação, bloco ausente, tipo inválido e ordem repetida. Provou também as duas passagens pedidas: sexta-feira e condição explícita.

`estado.py --sem-rede` saiu com **0**:

| Bloco | Tipo | Horas | Pontos | Símbolos das leituras |
|---|---|---|---:|---:|
| DO1 | navegação | por medir | 5 | 173129 |
| FP2 | por classificar | por medir | 2 | por medir |
| HB1-e | conteúdo | por medir | 5 | 316363 |
| OG1-B | por classificar | por medir | 6 | 517855 |
| OG1-B4 | conteúdo | por medir | 2 | por medir |
| OG1-C | por classificar | por medir | 3 | 333343 |
| PL1 | maquinaria | por medir | por medir | por medir |

Os símbolos por frase ficaram todos «por medir».

Ambiguidades resolvidas na implementação:

- **PL1-1:** prevalece a regra específica do mandato sobre «só lança a cabeça» na introdução da fila.
- **PL1-2:** prefixos de registos: `registos`, `OG1-C-r` e nomes terminados em `-r`.
- **PL1-3:** o lançamento exige declaração explícita `OEDP_ACRESCENTA` ou `Acrescenta:`; evita tentar inferir o âmbito pela prosa.
- **PL1-4:** sem pasta de conferências correspondente, o recibo diz «por medir».

Ficam abertos os commits, os três portões, a privacidade sobre o construído, a comparação real com o sítio publicado e a eventual leitura programática do contador «Fable only».

Contagem: **25 chamadas de orquestração, 39 operações internas; 13 corridas dirigidas de conferências, nenhuma corrida dos três portões.** A linha «tokens used» não foi exposta.