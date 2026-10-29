**Parei pela condição expressa no §7:** a regra nova recusa `og1-il-prioridades`, uma afirmação real.

A prova no corpo alojado é:

- **Bloco 150:** contém a citação «A prioridade é baixar o IRS e o ISP», mas não contém o alias `Mariana Leitão`.
- **Bloco 152:** contém a frase que nomeia Mariana Leitão.
- O modo declarado é `entrevista`.

A recusa foi reproduzida com a mensagem:

> OG1: a citação começa antes da frase num bloco que não nomeia quem fala

**OG1-C-7:** a regra do §2 também abrange entrevistas, mas esta entrevista identifica quem responde depois do título citado. Não introduzi uma exceção nem alterei a fonte. A direção precisa de decidir esse caso.

Os códigos foram lidos dos ficheiros em `/tmp/og1-c-adenda-conferencias/`:

| Conferência | Ficheiro | Código |
|---|---|---:|
| Teste do motor antes das alterações, 178 checks | `motor-antes.codigo` | 0 |
| Teste OG1 do sítio antes das alterações, 786 checks | `sitio-antes.codigo` | 0 |
| Reprodução da recusa da entrevista | `prevalidacao-entrevista.codigo` | 1 |

A pré-validação inicial confirmou que o PS passa como `documento`, no bloco 58, antes de parar na entrevista.

Ficaram **alterações parciais, não comitadas**, apenas no motor:

- `publisher/oe2027_generalidade.py`: regras novas e cálculo de `bloco_da_citacao`.
- `extracoes.json`: modo do PS e segundo alias do Chega.

O livro, as provas e os ficheiros de `ledger/claims/` não foram regenerados nem alterados. As restantes correções da adenda ficaram por fazer. O trabalho preexistente em `design/observatorio/ARRANQUE.md` foi preservado.

Não houve commits, exportação ou corrida dos portões pelo escrivão nesta adenda. Foram **5 chamadas de ferramentas**, com **3 conferências registadas**, além da pré-validação inicial que acionou a paragem.

tokens used: **12 400 723**, último contador acumulado observado nesta sessão.