# Adenda D ao mandato CAM2-A: todas as entradas por julgar, a cobertura pelo par e os Minor da leitura curta (09.11.2026)

Acrescenta: nada
Medidas: medidas-direcao-adenda-d-cam2a.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta da adenda C (cinco plantas em cinco, sem Blocking nem Major reais). Quarta retoma, a mesma sessão, por decisão escrita.*

## §0 Medido (pela leitura curta, na worktree da cabeça 155fd74a5)

- **A entrada da saúde sem o PRR** (`f-c209fd0eb6f9bc7aa54eb5cd`) diz «O número do ministro coincide com a variação…». A sua única linha é `utao-saude-sem-prr-2027`, cujo excerto não fala do ministro. Por ter a citação presa, a entrada é da semente e não fica por julgar: o juiz nunca a veria.
- **O par que falta.** Há 260 frases portuguesas cujo par inglês o detetor apanha, sem estarem nem no registo nem na lista das por registar.
- **Os negativos que faltam.** `tiposDaFrase` dá `atribuicao` a «No que diz respeito à saúde», «No que se refere à saúde», «estado de alerta», «O Sistema Nacional de Alerta» e ao nome «O alerta da UTAO».
- **As provas e as medidas.** Nenhuma prova exercita a metade histórica do pino das marcas. O relatório da adenda C escreve quatro números sem medida guardada (1033, 1085, 4 000 e 178), e o campo `pares.en_para_pt.falhas_antes` repete o `falhas_depois`.

## §1 O que fazes

1. **Todas as entradas ficam `juizo: "por julgar"`**, as da semente também, até ao juiz da CAM2-B.
   - A conferência recusa qualquer outro valor em qualquer entrada.
   - A citação presa continua a conferir-se: é uma condição necessária, não suficiente.
   - O README diz porquê: a citação presa prova as palavras citadas, e não o resto da frase.
2. **A cobertura pelo par, nos dois sentidos.** Uma frase cujo par na outra língua o detetor apanha entra na cobertura, com os tipos do par. Fica no registo ou na lista das por registar como as outras. Dizes quantas entraram por língua.
3. **Os negativos de 7:** `diz respeito`, `se refere a` (sem sujeito que fale), `estado de alerta`, os nomes próprios com `Alerta`, e `alerta` como nome depois de artigo. Cada um com uma planta real. O pino das marcas muda no mesmo commit, com a razão.
4. **A prova do histórico do pino:** um histórico simulado em que um commit muda as marcas sem o pino novo, e um commit seguinte o repara. A recusa do primeiro mantém-se.
5. **As medidas.** Os números do relatório ficam em medidas guardadas, e o campo repetido corrige-se.
6. **A lista inicial** regenera-se no fim, com o pino novo, e o relatório traz as contagens por coleção e por língua.
7. **O fecho:** o ponto 8 da adenda C. A base de f362f5ccd é a do mesmo dia (a mesma pasta de `OEDP_DIST_BASE`), e as únicas diferenças nas páginas são as do Método. Os commits vão pelo `comitar.sh`, com o assunto a começar por `CAM2-A`.

## §2 Quando paras

Como no §2 do mandato, com o teto de 4 000.

## §3 O fim

O ponto 7. Quarenta e cinco minutos e sessenta chamadas, sem ajudantes.
