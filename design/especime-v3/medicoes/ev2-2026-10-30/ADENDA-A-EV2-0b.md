# Adenda A ao mandato EV2-0b: a planta lê a saída do guião antigo sem a decodificar à força (30.10.2026, 12:37 UTC)

Acrescenta: nada

*A mesma sessão, a mesma worktree; a tua correção foi comitada pelo lugar de direção como `EV2-0b-1`, para a retoma passar o pré-voo. Escrita pelo lugar de direção do dia (Claude Opus 5.5), que correu as conferências pelo teu relatório: o guião corrigido sai com 0 no `/bin/sh` da máquina com `LANG=en_GB.UTF-8` e imprime a linha «pelo id»; `python3 tests/leituras/listas-de-uma-linha.py` dá 1, com `test_guiao_corrigido` ok e `test_linha_antiga_morde` em erro: `UnicodeDecodeError` no `subprocess.run(..., text=True)`, porque a mensagem do guião antigo traz o primeiro byte do `»` sozinho (é esse o defeito).*

1. Em `tests/leituras/listas-de-uma-linha.py`, a função `correr` lê a saída com `errors='replace'` (ou em bytes, decodificando com `errors='replace'`), para a metade da planta que corre a linha antiga poder ver o código diferente de 0 e a mensagem «unbound variable». Nada mais muda.
2. Não corres conferências: o lugar de direção corre o teste e o `check:leituras` depois do teu commit, como fez agora.
3. Um commit, «EV2-0b-2: a planta das listas de uma linha lê a saída do guião antigo sem a decodificar à força», só com o teste, e estas duas linhas no fim da mensagem:

Co-Authored-By: Codex gpt-6.1-sol <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L

Dez minutos, quinze chamadas. Paras e dizes se o commit precisar de outro ficheiro.
