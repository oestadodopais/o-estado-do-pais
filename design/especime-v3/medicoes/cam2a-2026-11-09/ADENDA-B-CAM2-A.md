# Adenda B ao mandato CAM2-A: o número do Método, a base da comparação do mesmo dia e o fecho (09.11.2026)

Acrescenta: nada
Medidas: medidas-direcao-adenda-b-cam2a.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da paragem da adenda A pelo §2 (b2ef207c6). Segunda retoma, a mesma sessão. As duas paragens vieram de regras deste lugar, e não do trabalho: a implementação está ensaiada e guardada no patch.*

## §0 Medido

- **A comparação da adenda A** (`comparacao-adenda-a-cam2a.json`, em b2ef207c6): 192 páginas HTML diferentes em 9 878. Os exemplos que leste são de três espécies:
  - o número de conferências da corrida inteira no Método (67 passa a 68), que a conferência nova muda com razão;
  - os dados que dependem do dia da construção (o calendário da agenda, a próxima leitura dos recibos, a janela da leitura semanal), porque a base foi construída a 08.11 e a tua construção a 09.11;
  - `prova.json` (o commit, o instante e a contagem).
- **O dia da construção** só se fixa por variável na leitura da semana (`OEDP_DIA_DA_CONSTRUCAO`, em `src/lib/leitura-da-semana.mjs`). O calendário e os recibos leem o relógio.
- **A nova base.** Este lugar reconstruiu o `dist/` de f362f5ccd a 09.11.2026, na mesma pasta que `OEDP_DIST_BASE` nomeia.

## §1 O que fazes

1. **Aplica** `CAM2-A-adenda-a-interrompida.patch` e conclui o mandato, com as adendas A e B por cima.
2. **A regra das páginas** passa a ser esta:
   - a base é o `dist/` de f362f5ccd construído a 09.11.2026 (o `construido_em` de `version.json` di-lo);
   - ficam fora da comparação `version.json` e `prova.json`;
   - as únicas diferenças admitidas nas páginas são o número de conferências da corrida inteira no Método, de 67 para 68, nas duas edições, e nada mais nessas páginas;
   - todas as outras páginas e ficheiros são iguais byte a byte.
   
   Constrói no mesmo dia UTC da base. Se a tua construção passar da meia-noite UTC, diz-o e pára, porque a base deixa de servir.
3. **Uma diferença que reste:** dizes qual é. Se vier só do relógio, sem texto, número ou ligação novos (o mesmo campo de data que a adenda A viu), lista-a no relatório sem parar. Se mudar texto, um número ou uma ligação, pára.
4. **A conferência que a sandbox recusa** (`tests/leituras/ferramentas.py` no `check:leituras`, pelo `listen EPERM` em 127.0.0.1) corre-a este lugar fora da sandbox. Dizes os outros códigos.
5. **O fecho** é o ponto 7 do mandato, com os commits da implementação pelo `comitar.sh` e o assunto a começar por `CAM2-A`.

## §2 Quando paras

Como no §2 do mandato, com o teto de 3 000 da adenda A e as regras do ponto 3 acima.

## §3 O fim

O ponto 7 do mandato. Setenta e cinco minutos e cento e vinte chamadas, sem ajudantes.
