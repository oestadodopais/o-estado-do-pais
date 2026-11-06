# Adenda J ao mandato VOZ-1: todas as cópias pequenas levam a data da construção (06.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree, sobre bbb4b74e2 (os registos do lote 4 e a VOZ-1 de volta à fila para esta adenda, por cima da tua I).*

## §0 Medido por este lugar

- A corrida `portão` do GitHub na cabeça 5402e3f1f (06.11.2026, 06:51 a 07:55 UTC) saiu a 1 num passo só, `npm run check:explicacoes`; a mesma conferência, corrida por este lugar sobre o `dist/` de 5959498cf, sai a 1 com 'Falta a data da construção: version.json ausente.': `tests/explicacoes/inventario.mjs` faz uma cópia pequena e corre `scripts/medir-defeitos.mjs` sobre ela, sem o `version.json`. A adenda I acertou só a cópia de `tests/inicio/regua-das-frases.mjs`.
- Uma procura por texto (este lugar) dá estes dois como os únicos que fazem uma pasta temporária e chamam `medir-defeitos.mjs`; mas há testes que chamam outros guiões com `OEDP_DIST` numa cópia, e alguns desses guiões chamam `medir-defeitos.mjs` (por exemplo `check-voz.mjs`). A procura por texto não chega para dizer que são só dois.

## §1 O que fazes

1. A cópia de `tests/explicacoes/inventario.mjs` leva o `version.json` da construção de onde copia.
2. Medes por guião, e não por procura de texto, todos os testes e guiões que correm `medir-defeitos.mjs`, direta ou indiretamente, com `OEDP_DIST` numa cópia ou numa pasta temporária: cada um leva o `version.json`. Dizes a lista no relatório.
3. O `medir-defeitos.mjs` continua a falhar sem a data, como a I o deixou.
4. Corres `check:explicacoes`, `check:primeira`, `check:voz` e cada conferência que a medida do §1.2 nomear.

## §2 O fim

Os códigos; commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `VOZ-1 J`. Vinte minutos, vinte e cinco chamadas.
