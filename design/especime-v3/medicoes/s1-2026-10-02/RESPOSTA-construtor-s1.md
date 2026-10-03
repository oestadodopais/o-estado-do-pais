# Resposta do construtor do S1, com a passagem S1-b

*Claude Opus 5.5 (a definição `construtor`), ramo `s1-2026-10-02`: o S1 a 02.10.2026 e a passagem S1-b a 03.10.2026. O relatório inteiro é `LEIA-ME.md`, na mesma pasta, com a secção «S1-b» no fim; os números da passagem estão em `medidas.json` (prefixo `s1b_`) e os do S1 em `medidas-s1.json`. Sem travessões.*

## A passagem S1-b

- **A chave (o achado 2).** A função manda `p_chave`, a variável sensível `SUGESTOES_CHAVE` limpa das pontas. Sem a chave, como sem o sal, a sugestão não chegou e a base não é chamada. A célula prova os dois caminhos, e prova que cada corpo enviado à base leva a chave.
- **A marca de hora a hora (o achado 4).** `sha256(sal | ip | hora)`, com a hora UTC inteira; a célula prova que a marca muda de hora para hora e que tem sempre 64 caracteres.
- **O endereço e a proveniência (o achado 10).** Sem `x-forwarded-for`, a sugestão não chegou. O `?de=` só se lê de um `Referer` da origem pública do pedido. Ao medir antes de construir li no código do `@vercel/node` que o `request.url` de uma função vem em `http`, e o esquema público vem no `x-forwarded-proto`: uma comparação simples de origens perdia a página em todos os envios no ar, e há uma planta que o prova. Que o código do ar é este é inferido, não provado.
- **O texto do limite (o achado 6)**: «numa hora» / «within one hour», com as duas frases antigas retiradas no inventário e uma planta que as morde se voltarem.
- **As regras da base (o achado 8).** A célula lê as 2 migrações por ordem e confere as regras em vigor no fim contra a tabela declarada e os textos: 1 função viva, com a chave, e 2 tarefas vivas. As plantas em memória correm em cada corrida do portão e mordem todas.
- **As fugas (o achado 9).** Nenhuma resposta traz o sal, a chave ou o endereço, com três plantas. O detetor apanha a chave com valor e as formas entre aspas, com plantas e controlos.
- **A H16 compara as páginas (o achado 16)**, com a planta das identidades trocadas. **O `verify:deploy` tem um controlo gravado da região (o achado 17)**: duas respostas reais da Vercel, com o endereço, a hora, o cliente e o sha256, e a planta da leitura errada.
- **Os registos (os achados 13 e 15)**: nenhum ficheiro do bloco com o identificador da equipa, e as horas dos envios de ensaio ao segundo do registo.
- **A célula da função**: 17 casos verdes e 28 plantas, cada uma a morder com a queixa que nomeia.
- **A prova do comportamento não chamou a base real.** A chave só existe na Vercel, e por isso a prova usou uma chave de ensaio e uma base simulada: 15 pedidos e 6 envios guardados pela simulação. Que a base real aceita a chave verdadeira prova-se só no primeiro envio depois de aterrar, porque o `verify:deploy` faz um GET e não manda sugestão nenhuma.
- **Duas consequências da migração, para a nota do diretor.** O limite passa a ser cinco por hora do relógio, e a mesma pessoa pode mandar mais cinco logo depois de a hora mudar. Uma marca vive entre uma hora e quase duas (inferido da agenda da tarefa).
- **Portões**: `build` 0, `verify` 0 e `typecheck` 0 na cabeça `c4ff98b5`, lidos de `portoes-b/`.
- **Custo da passagem**: 282 775 símbolos e 3 246 segundos de parede, das duas leituras em ficheiro.
- **Por fazer**: as duas decisões do diretor (a recusa do Método e a nota); a prova contra a base real depois de aterrar; o identificador da equipa em ficheiros de outros blocos, que não são meus; o nome da equipa em 2 versões da história do ramo (o registo do lugar de direção no commit do brief e a redação do meu guião do S1), que um `--ff-only` leva para a `main` e que só sai reescrevendo o ramo, decisão da aterragem; a leitura a frio da passagem.

## O S1

- **Não aterra sem duas decisões do diretor.** A nota do que fica guardado está à letra e é rascunho; ao lê-la contra a função, a marca que ela diz «cifrada» é um resumo com sal (um pseudónimo do endereço durante uma hora, e não um anonimato), e o artigo 13.º do Regulamento (UE) 2016/679 pede coisas que ela não diz (quem responde pelo tratamento, a base legal, quem recebe os dados, o direito de reclamar). E a caixa contradiz a recusa publicada no Método, «Este projeto não guarda dados pessoais dos leitores nem os põe no repositório», que é do diretor pela política da autonomia: parei nesse ponto, não lhe toquei, e deixo no relatório uma proposta de redação.
- **A função**: um 303 relativo para as páginas estáticas, pela tabela das rotas; os campos em branco como `null`; o corte em caracteres; só o GET e o POST; no `typecheck`; em Dublin (`vercel inspect` lista a função em `dub1`). A célula `check:sugestoes`, no `verify`: 12 casos verdes e 15 plantas que mordem.
- **As páginas**: as 10 da caixa construídas, com os 24 textos do brief à letra; as 8 do resultado com `noindex` e fora do mapa do sítio, os 2 formulários dentro dele; sem guião nenhum.
- **A porta do rodapé** está em 7452 páginas, as mesmas que levam a das correções, ao lado dela e com `?de=` igual ao caminho da página; o portão de HTML conta-a e a H16 do `check:alvos` mede-a; os 25 documentos alojados não têm nenhuma das duas.
- **A privacidade e os mortos**: `api/` sem segredo, sem caminho e sem nome, com 10 plantas; os mortos leem `api/`; o `verify:deploy` pede o 303 e a região da função, e hoje falha só nisso, como deve antes de a função estar no ar.
- **A prova de caminho**: a pré-visualização `Ready`, com a função em `dub1`; atrás da autenticação, o `x-vercel-id` da pré-visualização é o da borda, e contornar a proteção pedia criar um segredo no projeto, que não criei. O comportamento contra a base real: 11 pedidos, 5 envios guardados, a armadilha e a vazia sem chamar a base, e o sexto envio da hora na mesma marca recusado.
- **As cinco linhas de ensaio na base**, para o lugar de direção confirmar e apagar: o envio português às 21:26:24 UTC de 02.10.2026, e o inglês e os três do limite às 21:26:25, com os identificadores em `prova-do-caminho/respostas.json` e no relatório.
- **Decisões**: a função importa a tabela das rotas; o `Location` relativo; os textos à letra, com o apóstrofo do brief, que a régua das frases lê como `&#39;`; a dispensa da sentinela de «Language» só para a frase inteira da nota inglesa; as regras da base, ditas por extenso, conferidas pelo portão contra o registo da base; a frase da página das correções é minha e está por ler.
- **Onde o brief não bate**: a §1.29 é a das quatro linhas retiradas, e o endereço das correções é a §1.26.
- **Capturas**: 16, com 0 problemas.
- **Portões**: `build` 0, `verify` 0 e `typecheck` 0 na cabeça `b4ab49e4`, lidos de `portoes/`.
- **Por fazer**: as duas decisões do diretor; apagar as linhas de ensaio e a pré-visualização; o passo da leitura da caixa no `CLAUDE.md` ao aterrar; a leitura a frio por outra família e a releitura do diff do inventário (o bloco `s1` está «por ler»).
- **Custo**: 810 299 símbolos e 6091 segundos de parede, das duas leituras em ficheiro.
