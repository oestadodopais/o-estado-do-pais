# Adenda B ao mandato COR-AGUA: o que o livro-razão exige, o PRR, e a segunda passagem até ao fim (08.11.2026)

Acrescenta: nada
Medidas: medidas-adenda-b-coragua.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da tua paragem pelo §2 da adenda A (6ccf66d93). Segunda retoma. A mesma sessão e as mesmas worktrees; a lista declarada na adenda A não muda, e a camada 0 já a conferiu.*

## §0 O que a paragem mostrou

- A CA41 e a CA42 mudam a eficiência (de 75 % para 76 %) numa frase que traz o 4212 hm³ sem o mudar. O 4212 é a soma da rega e da pecuária das oito regiões no CSV técnico do motor, e as cópias regionais não estão guardadas. O §1.2 da adenda A dizia «cada número que a lista escreve», e devia dizer cada número que a lista acrescenta ou muda.
- O PRR: as cópias locais do motor têm instantâneos de 24 e 27 de julho e de 3 de agosto de 2026, e o título das duas edições diz «instantâneo de 29 de julho de 2026»; os pagos que o título imprime são a soma do de 3 de agosto. Um instantâneo de 29 de julho pode existir no dados.gov.pt e não estar nas cópias; este lugar confere-o fora desta passagem.
- O aplicador temporário de HTML perdeu os comentários (sem `comment:true`); a normalização recusou-o, e repuseste tudo.

## §1 O que fazes

1. **O livro-razão, como fica:** o §1.2 da adenda A aplica-se aos números que a lista acrescenta ou muda. Um número que uma `nova` traz igual da sua `frase` (o 4212 hm³ da CA41 e da CA42) fica com a resolução que tem hoje, e o relatório lista-o, com a origem que achaste, como uma falha de proveniência para a auditoria; não lhe escreves um excerto.
2. **O PRR:** nos dados dos gráficos e das tabelas das duas edições, os valores do PRR passam a ser os do instantâneo cujas somas o título imprime (diz qual, pelo ficheiro e pelo sha256); a data que o texto dá ao instantâneo não muda nesta passagem. O relatório diz cada valor do PRR que mudou numa edição, com o antes e o depois.
3. **O aplicador:** corriges o teu erro (os comentários conservados) e retomas a partir de `adenda-a-interrompida/sitio.patch` e `motor.patch`, repetindo as conferências que eles já tinham.
4. **O resto da adenda A**, até ao fecho do seu §1.9, com o mesmo §2: só paras por uma frase da lista que, bem aplicada, não possa ficar como está escrita. A pasta `adenda-a-interrompida/` sai no fecho, depois de o trabalho entrar.

## §2 Quando paras

Como no §2 da adenda A; o 4212 e o PRR já não são razão para parar.

## §3 O fim

O §1.9 da adenda A. Setenta e cinco minutos, cento e vinte chamadas, sem contar as dos agentes que lances; se não chegar, paras num commit limpo, com o trabalho feito comitado, e dizes onde ficou.
