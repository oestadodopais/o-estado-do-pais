# Adenda C aos mandatos VOZ-2A e VOZ-2B: a V157 e as fontes do estudo 14 (07.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da paragem da VOZ-2A às 00:51 UTC de 07.11.2026. A paragem estava certa nas duas coisas que disse. Retomas a mesma sessão e a mesma worktree, sobre a cabeça que lá está (o commit desta adenda por cima das tuas provas).*

## §0 Medido (07.11.2026, por este lugar, por guião)

- **As fontes do estudo 14.** As cópias de 15.09.2026 estão agora na worktree do motor, em `raw/fontes/` (descarregadas do arquivo do Drive e copiadas por `fetch.py --origem`: `FETCH: PASS`, 53 ficheiros do registo, 53 com o resumo do registo, 0 em falta, 0 com resumo errado), e os textos página a página em `raw/txt/` (`extract.py`: `EXTRACT: PASS`, 43 extraídos, 10 saltados, as ausências do registo e os ficheiros sem texto). As duas pastas são ignoradas pelo Git: nada a comitar. A prova de que são as certas: `build_doc.py`, corrido na cabeça limpa do motor (983b19e), reescreve o `.md` português do estudo 14 byte a byte igual ao comitado (`DOC: PASS`; `git status` vazio).
- **A V157.** O seu par inglês («The sha256 digest, the byte count and the content type of every response are in the manifest of the copies, which travels with this study.»), nas mesmas duas páginas inglesas, entra na lista da VOZ-2A como V307, da classe `SAI`, para as duas edições dizerem o mesmo.
- A conferência das frases novas (`node design/especime-v3/medicoes/voz2-adenda-a-2026-11-07/conferir-novas.mjs`, código 0) conta agora os algarismos colados a letras, como o leitor de números do estudo 14; sem a V307 dá vermelho, com o número de `sha256` só no português.

## §1 O que fazes

1. Aplicas a tua patch da adenda B e continuas a geração do estudo 14 com `build_doc.py`, que agora tem as fontes, e depois com `make_en.py`; a V307 sai do inglês como a V157 do português.
2. As correspondências da tradução que a V161 deixou por atualizar atualizas-las como parte de aplicar o campo `nova` da V161, sem frase nova.
3. O resto é o das adendas A e B e o dos mandatos, sem mudança.

## §2 Quando paras

Como na adenda A.

## §3 O fim

Como na adenda A.
