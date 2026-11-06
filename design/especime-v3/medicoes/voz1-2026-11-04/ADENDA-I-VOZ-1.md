# Adenda I ao mandato VOZ-1: a construção pequena da régua das frases leva a data (06.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree, sobre b8d18be68. A tua passagem H ficou verde no `build`; as conferências dirigidas deste lugar sobre ela deram um vermelho fora das que pediste.*

## §0 Medido por este lugar

- `npm run check:primeira` sai a 1 em b8d18be68 (pasta `lote4-conferir-2026-11-04-l`): `tests/inicio/regua-das-frases.mjs` copia três páginas para uma construção pequena numa pasta temporária e corre `scripts/medir-defeitos.mjs --json` sobre ela; desde a H, esse guião lê `version.json` da construção para o dia da marca 'novo', e a cópia pequena não o tem (ENOENT). Em d77b1ba41 a mesma conferência estava a 0.

## §1 O que fazes

1. A construção pequena leva o `version.json` da construção de onde copia, como leva as páginas.
2. Sem `version.json`, o `medir-defeitos.mjs` falha a dizer que falta a data da construção, e não a inventa.
3. Corres `check:primeira` e `check:voz`, e o `build` inteiro.

## §2 O fim

Os códigos das três; commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `VOZ-1 I`. Quinze minutos, quinze chamadas.
