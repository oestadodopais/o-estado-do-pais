# Adenda H ao mandato VOZ-2A: as duas línguas a mudar juntas, a régua alargada, as asserções e a data (08.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura a frio da VOZ-2A (o Opus `leitor`, cinco plantas em cinco), que achou frases reescritas numa língua e não na outra. O erro é deste lugar: a lista foi feita língua a língua pela régua, e a régua não apanha as mesmas formas nas duas. A mesma sessão; a worktree `voz2s-2026-11-07` (o sítio em e28270820, com os dois commits desta adenda por cima, 8ad95a920 e efdc3c482) e o motor `voz2-2026-11-07` (ce0cf75).*

## §0 Medido (por este lugar, sobre o `dist/` de e28270820 e sobre as páginas no ar)

- O guião `design/especime-v3/medicoes/voz2a-2026-11-07/conferir-pares.mjs` (deste lugar, comitado) compara, em cada estudo com as duas línguas, os blocos do documento da edição anterior com os da edição da VOZ-2A: 20 blocos mudados numa língua sem par na outra, em seis estudos, e 2 blocos do estudo da economia mudados sem entrada na lista.
- Os dois do estudo da economia são da composição: a frase curta dos pontos cegos saiu do português (a V238 tirou a longa no estudo de origem), e a frase do Turismo de Portugal ganhou a frase da freguesia que a V189 escreveu para outro estudo. As páginas no ar mostram a frase curta em português na página e no documento do estudo da economia e na página do estudo do prometido.
- As páginas dos estudos, comparadas por este lugar com as páginas no ar: os mesmos pares; e na página do orçamentado, duas frases portuguesas mudadas pela reescrita do documento, a do relatório que abre a série e a das tabelas plurianuais (esta perdia um facto, e a V198 nova conserva-o).
- A régua da voz não apanha as formas com n (neste, nesta), a forma inglesa do plural do verbo entrar na negativa, nem as contrações inglesas da negação. Uma cópia alargada da régua sobre o `dist/` inteiro apanha só frases que a lista já nomeia; fora dos onze estudos da VOZ-2B, nenhuma outra.
- No motor: a V310 e a V311 trazem um quantificador sem citação declarada; o par inglês da V182 não tem asserção; a `review` da `so-previsionais` fala das respostas do registo e não dos documentos municipais lidos. A planta da isenção mede só o tamanho da lista.

## §1 O que fazes

1. **A lista** (8ad95a920): aplicas as entradas V309 a V328 e V330, e as formas novas da V171, V198, V238, V317 e V325, como aplicaste as anteriores, nos documentos e nas páginas que cada uma lista, nas duas línguas e nas composições. Os números não mudam; o guião das frases novas dá zero recusas e zero diferenças de números entre línguas.
2. **O que a lista não nomeia não muda.** Uma composição não muda uma frase que a lista não manda mudar nesse estudo. Em concreto: no estudo da economia, o português volta a imprimir a frase curta dos pontos cegos onde a imprimia (o documento e a página), e o bloco do Turismo de Portugal volta à forma da edição guardada, sem a frase da freguesia; na página do estudo do prometido, a frase curta volta em português; na página do orçamentado, a frase do relatório que abre a série volta à forma que tinha. O inglês destes lugares fica como está.
3. **A régua da voz** (`scripts/voz-autorreferencia.mjs`): na `PROPRIA`, as formas com n ao lado das com d (`[dn]?este documento` e as outras cinco), e as formas inglesas `do not enter` e `did not enter`; na `NEGACAO`, `cannot`, `can't`, `don't`, `didn't` e `won't`, com os dois apóstrofos. Uma planta por forma nova em `tests/voz/voz2a.mjs`. As FICA V327 e V328 entram nas exceções com as suas páginas. A planta da isenção passa a exigir o conjunto exato, igual aos estudos de `FRASES-VOZ-2B.json`, e não só o tamanho.
4. **As asserções no motor:** a `so-previsionais` (14, e 19 pela importação) ganha a citação portuguesa da V310, com o mesmo `id`, e a `review` passa a dizer o que sustenta a quantificação: os documentos municipais que o estudo lista como lidos, todos previsionais, relidos um a um; a `hospital-registos-sem-identidade-declarada` (04, e 18 pela importação) ganha a citação inglesa do par da V182. Mudam as impressões digitais em `composto_de` que mudam com elas. Se uma asserção ou um `ignore` citar a forma antiga de uma frase que esta adenda muda, reancoras ou retiras, e dizes qual.
5. **A data das edições:** o texto das treze edições fecha-se hoje e aterra hoje; a data das treze edições e das sete entradas do registo passa de 07.11.2026 a 08.11.2026, e a `EDICAO` do guião dos pares já a tem. Nenhuma edição guardada muda.
6. **O guião dos pares entra na cadeia** do `check:voz`, como as plantas da VOZ-2A, e dá código 0 no fim: zero blocos sem par, zero mudanças fora da lista, a planta interna a 1 e o controlo a 0.
7. **O fecho:** o `build` inteiro; `check:voz`, `check:edicoes`, `check:registo`, `check:lugar`, `check:datas`, `check:discussao`, `typecheck`, o guião das frases novas e o dos pares, com os códigos; o `core.gate` fora da sandbox; os commits do sítio (assunto a começar por `VOZ-2A`) e do motor; o relatório com a classe antes e depois pela régua alargada e o que mudou em cada estudo.

## §2 Quando paras

Se uma entrada só se aplica mudando uma frase que a lista não nomeia; se outro quantificador aparecer (dizes qual); se a régua alargada apanhar uma frase fora da lista (dizes qual); como nas adendas anteriores para o resto.

## §3 O fim

O §4 do mandato. Setenta e cinco minutos, cento e vinte chamadas.
