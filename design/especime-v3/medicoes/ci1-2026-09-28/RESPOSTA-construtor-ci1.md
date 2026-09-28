# CI1 · a resposta curta do construtor

*Claude Opus 5.5, 28.09.2026. O relatório inteiro é `design/especime-v3/medicoes/ci1-2026-09-28/LEIA-ME.md`; cada número está em `medidas.json`, ao lado. Sem travessões.*

**A cabeça.** O código e os portões estão em `7b63369e`; a cabeça final do ramo `ci1-2026-09-28` é o commit que traz esta resposta, e só acrescenta ficheiros a esta pasta, que nenhum portão lê.

**Os commits**, sobre `1c1952c9`: `85a719b2` (as ferramentas de medição), `790e255b` (o `verify` depois do `build`), `96bbb7f1` (a corrida «portão» passa a usá-lo), `27b13b92` (a paridade das línguas uma vez por processo, com as plantas no `provar:guardas`), `7b63369e` (as provas e o guião das medidas), e o último.

**O que mudou.** A corrida corre, depois do `build`, só os 16 passos do `verify` que o `build` não correu (`passos_corridos_pelo_guiao`), lado a lado, no mesmo trabalho `portao`, com três células (a união é o `verify` inteiro; nenhuma conferência mexeu no `dist/`; o `dist/` é desta cabeça) e 7 plantas em cada corrida (`plantas_do_guiao_mordidas`). A construção do Astro passou de 225,6 s para 9,5 s locais (`build_antes_astro_s`, `build_depois_astro_s`), porque o `t()` deixou de conferir a paridade das duas línguas em cada chamada (53,9 % da construção perfilada, `perfil_paridade_pct`) e passou a conferi-la uma vez por processo; o `dist/` sai igual byte a byte, com 0 diferenças fora do carimbo (`diferencas_final`). O `npm run verify` à mão não mudou.

**Os portões**, na cabeça `7b63369e`, códigos lidos de `portoes/*.codigo`: `npm run build` 0 (`portao_build_codigo`), `npm run verify` 0 (`portao_verify_codigo`), `npm run typecheck` 0 (`portao_typecheck_codigo`).

**O que ficou por fazer.** As duas corridas no GitHub, com `tempos-da-corrida.mjs`, e a planta vermelha lá, que são do lugar de direção (a previsão é de 8,3 minutos, `previsao_ci_depois_min`, contra a metade de 13,9); o `check:alvos` é agora o chão da corrida, pela espera `networkidle` de cada uma das suas 230 passagens (`alvos_passagens`), e mexer-lhe fica para decisão; o mapa do repositório e o registo das melhorias, pelo lugar de direção.
