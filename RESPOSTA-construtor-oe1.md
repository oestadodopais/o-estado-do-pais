OE1 parcial. O teste de aceitação do §2 não está cumprido.

Cabeças dos dois ramos `oe1-2026-10-04`:

* Motor: `9bfbb777f7d2f5af8b185475c8dd8027ebd76bad`.
* Sítio: [cabeça final registada](design/especime-v3/medicoes/oe1-2026-10-04/portoes/cabeca), incluindo o commit desta resposta.

Commits anteriores ao fecho: motor `aa537323`, `9bfbb777`; sítio `e1a28383`, `0c4c5fc2`, `a369b0ef`, `2522ac16`, `ff8692ba`, `27f06c27`, `dc53e891`.

Códigos finais lidos de ficheiro: [motor](design/especime-v3/medicoes/oe1-2026-10-04/portoes/motor.codigo), [build](design/especime-v3/medicoes/oe1-2026-10-04/portoes/build.codigo), [verify](design/especime-v3/medicoes/oe1-2026-10-04/portoes/verify.codigo), [typecheck](design/especime-v3/medicoes/oe1-2026-10-04/portoes/typecheck.codigo), [ledger](design/especime-v3/medicoes/oe1-2026-10-04/portoes/ledger.codigo). As cabeças acompanham os registos; --conferir-final exige zero e a cabeça atual.

| Linhas exportadas | Número |
|---|---:|
| Rubricas ministeriais | 16 |
| Programas, orçamento e execução | 40 |
| Funções, orçamento e execução | 20 |
| Eurostat, Portugal, Espanha e União | 30 |
| Totais, indicadores e consolidação | 44 |
| Derivadas de cada 100 euros | 36 |
| Total | 186 |

[Relatório](design/especime-v3/medicoes/oe1-2026-10-04/LEIA-ME.md) e [tabela integral, com ids, fontes, valores, períodos e localizadores](design/especime-v3/medicoes/oe1-2026-10-04/LINHAS.md).

Ficaram por fechar a receita consolidada AC+SS e o saldo nos mapas, a divergência da despesa bruta da Segurança Social e as necessidades de financiamento mensais. O OE1-b integra o conjunto, prova os dois formatos da bandeira e reconfere a L1 dos recibos gerados pelo livro. Nenhuma página do governo, entrada em WORKS ou declaração de rota foi acrescentada.

Custo OE1-b: [contadores e segundos ao último corte](design/especime-v3/medicoes/oe1-2026-10-04/custo-oe1b.json). Modelo: Codex gpt-6-astra. Os relatórios ficam comitados; os ficheiros da última execução são escritos depois do commit.

Falta autorizar [a proposta dos sete formatos de localizador](design/especime-v3/medicoes/oe1-2026-10-04/indice-localizadores.patch). O ensaio em memória passou; a guarda aplicada permanece intacta e o verify continua por fechar.

Falta também autorizar [o recorte do espécime do índice](design/especime-v3/medicoes/oe1-2026-10-04/feixe-recorte.patch): oito entradas, página integral intacta e teto conservado. O ensaio passou; o exportador aplicado ainda excede o teto.
