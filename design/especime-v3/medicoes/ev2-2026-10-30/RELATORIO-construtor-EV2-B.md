**Parei pelo portão da voz do sítio.** Duas frases voltaram à primeira página com a edição datada, mas continuam marcadas como retiradas no inventário, nas linhas 3010 e 3037. Não as alterei.

Commits confirmados:

- **Motor:** `db5edb2d` — EV2-1c, contagens autorizadas em 2876.
- **Sítio:** `ae7720fe2` — EV2-2, sem alterações nesta passagem.
- Ambas as árvores estão limpas.

Códigos lidos:

| Ficheiro | Resultado |
|---|---|
| `build.codigo` | **1** |
| `verify.codigo` | **125**, não correu |
| `typecheck.codigo` | **0** |
| `motor.codigo` | Ainda ausente; processo em execução |

O hook do commit correu o `core.gate` e passou: `OEDP_GATE=adiado` não foi transmitido ao escrivão pelo guião. A corrida final foi lançada uma única vez.

As duas páginas construídas mostram **29.10.2026**. [Relatório completo](<temporário>).

Consumo: **29 chamadas**, uma corrida dos portões finais e um `core.gate` adicional concluído no hook.