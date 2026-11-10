# Mandato REC1: a edição de ensaio e o registo das correções a começar no lançamento (10.11.2026)

Acrescenta: frases

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, na worktree do sítio `rec1-2026-11-10`. O motor não muda. A medição em que assenta é a do recomeço (10.11.2026, um leitor Opus, só em leitura, sobre a cabeça 3ecbce1a2), que o §0 resume com os ficheiros e as linhas.*

## Porquê

O Estado do País ainda não foi mostrado a ninguém, e o que nele se lê está a ser auditado contra as fontes, estudo a estudo. Até essa auditoria fechar, o projeto está em ensaio, e deve dizê-lo. A decisão do lugar de direção, com a palavra do financiador: há uma linha de partida, o lançamento. O registo das correções passa a contar a partir dela; antes dela a página do registo não lista nada. Não se apaga nenhum dado: a história dos valores nas linhas do livro-razão, a história selada e as reconferências ficam como estão, porque protegem números. Muda só o que a página do registo mostra, e o projeto passa a dizer que está em ensaio e a pedir aos motores de busca que não o indexem.

Fica fora deste bloco, por decisão: a história nos recibos das linhas (fica), as edições guardadas e as faixas dos estudos (cada estudo recomeça a sua história quando a sua edição de lançamento aterrar, no bloco de conteúdo dele), e os seis estudos de Évora a que os quatro sucederam (o REC2).

## §0 Medido (10.11.2026)

- **O interruptor.** `site.config.mjs` apresenta-se como a única fonte de verdade sobre o domínio, o nome e a edição. Toda a página construída passa por `src/layouts/Base.astro`; a primeira coisa do `<main>` é o `RotuloDeIA`, e o `gate:html` exige um por página, antes do título. Os documentos alojados não passam pelo `Base.astro`: levam a faixa de `src/lib/documentos.mjs`, e o `gate:html` exige-lhe o texto sem algarismos e o rótulo de IA letra a letra.
- **A indexação.** O `robots.txt` gera-o `src/pages/robots.txt.js`; nenhuma régua lhe lê o conteúdo. A meta `robots` sai do `Base.astro` quando a página passa `noindex` (hoje as linhas com proveniência por confirmar e os estudos sem leitura); os documentos já levam `noindex, follow`, e o `gate:html` exige-lhes uma só marca. O `gate:html` conta as páginas de linha sem `noindex` e compara-as com a prova (`src/lib/prova.mjs`, as linhas sem nenhum campo de proveniência por confirmar); `tests/indice/indice.mjs` exige `noindex` numa porta fora do mapa do sítio; o `verify:deploy` recusa o cabeçalho `X-Robots-Tag` no domínio canónico.
- **O registo.** A página `/correcoes` (e `/en/corrections`) monta-se em `src/views/CorrecoesView.astro` e `src/components/RegistoCorrecoes.astro`, com `mudancasDoRegisto` e `entradasDoRegisto` (`src/lib/mudancas.mjs`) e `CORRECOES_TEXTO` (`src/data/correcoes.mjs`). Conferem o que ela mostra contra os dados: o `gate:html` (a contagem das correções contra a prova, e `conferirTextoHtml`), o `check:edicoes` (cada entrada de texto uma vez na página), `check:pais` (as chaves das correções), e as provas (`src/lib/prova.mjs`, a chave `correcoes`, que sai em `/prova.json`).
- **As duas linhas que contam história.** `correcoes-publicadas` e `edicoes-publicadas` (linhas do livro com `study: "o-estado-do-pais"`) imprimem-se em `/correcoes`, `/livro-razao`, `/indice` e nas três páginas inglesas correspondentes; nomeiam-nas `src/data/areas.mjs`, `lugar-das-linhas.mjs`, `nomes-das-medidas.mjs`, `o-que-e-das-familias.mjs`, `src/i18n/unidades.mjs` e os testes `tests/cartao/leituras-provadas.json`, `tests/edicoes/contagem.mjs`, `lingua.mjs`, `reguas.mjs`, `tests/inicio/linhas-da-casa.mjs`, `tests/linha/correcao-de-campo.mjs`, `historia-do-valor.mjs`. O mecanismo que já existe para uma linha deixar de se publicar é `publication: 'withdrawn'` (três linhas hoje), e o `gate:html` exige que o identificador de uma linha retirada não sobreviva em nenhum ficheiro publicado (`scripts/linhas-retiradas.mjs`).
- **As frases.** A política em `/correcoes` diz hoje «Quando o que se publicou aqui está errado, corrige-se à vista: a entrada diz o que estava, o que ficou, a data e o motivo, e nada se apaga.» (em inglês «…and nothing is deleted.»).

## §1 O que fazes

1. **O interruptor.** Um campo `LANCAMENTO` em `site.config.mjs`, hoje `null` (depois, uma data ISO), e uma função pequena que o lê (por exemplo `emEnsaio()` e `desdeOLancamento(data)`). Tudo o que este mandato pede lê esse campo, e mais nada o decide.

2. **A marca de ensaio.** Com `LANCAMENTO` a `null`, todas as páginas mostram no cabeçalho (o `Masthead`, sem mexer na ordem do `RotuloDeIA`) a marca «Edição de ensaio» (em inglês «Test edition»), com o texto acessível «O Estado do País está em ensaio até ao lançamento: o que aqui se lê está a ser relido contra as fontes.» («O Estado do País is in testing until launch: what you read here is being re-read against the sources.»). A faixa dos documentos alojados leva a mesma marca, sem algarismos. Com uma data, a marca não se imprime em lado nenhum.

3. **Os motores de busca.** Com `LANCAMENTO` a `null`: todas as páginas levam uma só meta `robots` com `noindex, follow` (as que já a levam ficam com uma só), e o `robots.txt` responde `Disallow: /`. Não se toca no `vercel.json` nem em cabeçalhos. As três réguas do §0 passam a ler o mesmo campo: em ensaio, a contagem das linhas indexáveis é zero dos dois lados; com uma data, medem o que medem hoje. Prova cada uma nos dois modos (ponto 6).

4. **O registo das correções.** A página do registo, nas duas línguas, só lista entradas com data igual ou posterior ao lançamento; em ensaio não lista nenhuma e não imprime nenhuma contagem. As réguas que conferem a página contra os dados aplicam o mesmo filtro, e a chave `correcoes` das provas conta o que a página mostra. Os dados não mudam: `src/data/correcoes.mjs`, os blocos `corrections:` das linhas, `ledger/historias-valores.json` e as reconferências ficam byte a byte, e o `ledger:check`, o `check:cruzamento` e a história selada não se tocam. Os recibos das linhas continuam a mostrar a história de cada valor.
   - As frases da página, letra por letra. A política, em ensaio: «A partir do lançamento, quando o que se publicou aqui estiver errado, corrige-se à vista: a entrada diz o que estava, o que ficou, a data e o motivo, e nada se apaga.» («From launch onward, when something published here is wrong, it is corrected in the open: the entry says what it was, what it became, the date and the reason, and nothing is deleted.»). Com uma data: «Desde o lançamento, quando o que se publicou aqui está errado, corrige-se à vista: a entrada diz o que estava, o que ficou, a data e o motivo, e nada se apaga.» («Since launch, when something published here is wrong, it is corrected in the open: the entry says what it was, what it became, the date and the reason, and nothing is deleted.»).
   - No lugar do registo, em ensaio: «O registo começa no lançamento. Até lá, O Estado do País está em ensaio, e o que aqui se lê está a ser relido contra as fontes.» («The register starts at launch. Until then O Estado do País is in testing, and what you read here is being re-read against the sources.»). Com uma data e sem entradas: «Sem correções desde o lançamento.» («No corrections since launch.»).
   - As outras frases da página que hoje falam das correções passadas (a contagem, as entradas, as frases sobre os seis estudos) deixam de se imprimir por não haver entradas; se alguma for texto fixo e não entrada, diz qual e não a reescrevas: páras nela (§2).

5. **As duas linhas que contam história** passam a `publication: 'withdrawn'`, pelo mecanismo que existe, com os identificadores fora de todos os ficheiros publicados e dos dados que os nomeiam (a lista do §0). A história selada delas fica como está. Os testes que as liam pela cache pública passam a lê-las como retiradas ou mudam de linha de amostra, com a planta de cada um a morder como antes. As linhas `estudos-publicados` e `estudos-evora-publicados` não mudam neste bloco.

6. **Cada régua do mostrado prova-se nos dois modos.** Em ensaio: a página do registo vazia, e uma planta que lhe ponha uma entrada, uma segunda meta `robots` num documento, uma página sem `noindex`, ou a marca de ensaio com um algarismo na faixa, é recusada. Com uma data antiga numa cópia (por exemplo o primeiro dia de agosto de 2026): tudo se mostra como hoje e as plantas de hoje mordem como hoje. Uma régua que só corresse em ensaio passava por não haver nada para ler: não a deixes assim.

7. **A frase de ensaio na página de endereço `/metodo`, e na inglesa correspondente.**
   Em ensaio, antes do parágrafo que explica «Estudo atualizado» e «Estudo corrigido», entra a frase «O Estado do País está em ensaio até ao lançamento; o que se segue vale a partir dele.» («O Estado do País is in testing until launch; what follows applies from then on.»). Com uma data não se imprime.

8. **O que não tocas.** O motor. Os dados da história (ponto 4). As edições guardadas, o `manifest.yml`, as faixas «corrigido a» e «atualizado a» dos estudos, as novidades da página inicial. Os seis estudos com `sucedidoPor`. O texto de qualquer estudo.

9. **O fecho.** As conferências que a mudança toca, pelos seus comandos (`gate:html` nas células tocadas, `check:edicoes`, `check:pais`, `check:registo`, `ledger:check`, `check:lingua`, `check:voz`, `check:lugar`, os testes do índice e do início, `typecheck`, o `build`); a corrida inteira (`conferir-tudo.sh`) uma vez, na passagem de aterragem; as capturas, nas cinco larguras e nas duas línguas, da página inicial, de uma página de estudo, de um documento alojado e de `/correcoes`. Os commits com o assunto a começar por `REC1`. O relatório curto: o que o leitor vê diferente, os ficheiros tocados por classe, as plantas e o que cada uma deu nos dois modos, os códigos, o que ficou aberto.

## §2 Quando paras

- Uma régua que protege um número, uma fonte ou uma pessoa só passar se for enfraquecida.
- A retirada das duas linhas pedir que se mexa na história selada ou no valor de outra linha.
- Uma frase fixa da página do registo, do Método ou de outra página ficar inexata com a mudança e não estar neste mandato: dizes a frase e o ficheiro, e não a reescreves.
- O teto de uma passagem: paras num commit são e dizes o que falta.

Os teus erros de implementação corriges e segues, e dizes quais.

## §3 O fim

O ponto 9 do §1. Duas passagens no máximo, de setenta e cinco minutos e cento e vinte chamadas cada uma; a segunda é a de aterragem.

*O motor não muda neste bloco: para as conferências que o leem, usa-se a worktree do motor indicada em `RESEARCHHUB_DIR`, parada em `master` (b4d0bbe), só para ler.*
