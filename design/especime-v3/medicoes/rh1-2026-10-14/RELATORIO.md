**RH1: a primeira entrega ficou vermelha; as passagens RH1-b, RH1-c e RH1-d, abaixo, fecham os três portões a zero.**

O texto até à secção «A passagem RH1-b» conserva o registo histórico da primeira entrega.

O novo varrimento encontrou uma ocorrência pessoal preexistente em `scripts/textos-aprovados.json`, no campo `responsavel` (linha 41). O relatório identifica o ficheiro e o campo, nunca o conteúdo. Esse campo alimenta guardas de HTML e de língua; não foi apagado, substituído por uma identidade pública nem dispensado do varrimento. A questão RH1-3 fica aberta antes da aterragem.

Para o leitor não mudou nenhuma página nem nenhum valor. O portão passa a conferir nomes e conteúdo de todos os ficheiros seguidos, incluindo gzip e binários, e recebe uma lista privada independente dos autores do Git. As constantes `BASE` e `MOTOR` do C1 ficaram intactas. O motor não foi tocado e nada foi publicado.

| Ponto do mandato | Entrega e referência na cabeça do código |
|---|---|
| 1 | Leitura de `PRIVACIDADE_PROIBIDOS`, espaços e linhas vazias ignorados, comparação sem distinguir caixa, recusa por posição da linha de valores curtos, identidades públicas ou UTF-8 inválido. Ausência ou vazio em CI recusa explicitamente. `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:53`, `:71`. |
| 2 | `IDENTIDADES_DO_PROJETO`, exclusão dos autores públicos e conservação das exclusões anteriores. Conhecido-positivo pelos autores, depois pela primeira cadeia do segredo, depois pelo nome pessoal da casa. Sem fonte, `dist/` e `api/` recusam com aviso. `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:34`, `:75`, `:93`, `:118`; `scripts/check-privacidade.py:121`, `:233`. |
| 3 | Segredo também em `tem_caminho()`, antes das exceções de caminhos. Varrimento do nome e dos bytes de todos os ficheiros seguidos, com gzip descomprimido e Unicode noutra caixa. A estrutura local dos registos conserva a guarda anterior. O JSON é conferido antes de qualquer escrita ou impressão. `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:129`; `scripts/check-privacidade.py:184`, `:189`, `:204`, `:281`. |
| 4 | O lançador dos portões exporta o ficheiro privado quando falta a variável; a entrada direta da conferência também o carrega. Importar o módulo não lê o ficheiro. CI nunca recorre ao ficheiro local. `scripts/leituras/portoes.sh:17`; `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:40`; `scripts/check-privacidade.py:294`. |
| 5 | Segredo ao nível do trabalho `portao`, disponível ao build e ao verify, com comentário sobre a recusa quando ausente. `.github/workflows/portao.yml:69`. |
| 6 | Repositório temporário e cadeias sintéticas, sem leitura do ficheiro privado. Descoberta automática pela pasta das leituras; JD1 conservado. `tests/leituras/privacidade-segredo.py:20`; `scripts/check-leituras.py:28`. |
| 7 | Medição reproduzível, provas sintéticas, resultados e registos dos portões. `design/especime-v3/medicoes/rh1-2026-10-14/medir.py:22`, `medidas.json`, `leituras-sandbox.json`, `portoes-resumo.json` e `portoes/`. |

A medição da cabeça do código conferiu 24 494 ficheiros seguidos e encontrou uma ocorrência. As 14 plantas do varrimento e as 39 plantas do ensaio sintético morderam, 53 ao todo. O ensaio leu duas cadeias sintéticas. Fonte: `medidas.json`.

As plantas cobrem ausência e vazio em `GITHUB_ACTIONS` e em `CI`, cada identidade pública e uma cadeia curta, espaços nas pontas, Git reescrito sem a base antiga, autores pessoais conservados, conhecido-positivo pelo segredo e pela casa, ausência de todas as fontes, ficheiro seguido, gzip, nome de ficheiro, outra caixa com acento, binário, identidades públicas aceites, segredo em `dist/` e em `api/`, recusa da saída JSON antes da escrita, carregamento local, precedência do ambiente e ausência de leitura local no CI. A planta do nome de ficheiro confirma que nem a saída de erro revela a cadeia.

A suite preliminar de leituras, dentro da sandbox, recusou o servidor local de `tests/leituras/ferramentas.py`: `Error: listen EPERM: operation not permitted 127.0.0.1`. Essa limitação não foi tratada como êxito. Pelo escrivão, `check:leituras` passou a código 0, incluindo RH1, JD1 e ferramentas. Fontes: `leituras-sandbox.json`, `portoes/verify.log` e `portoes-resumo.json`.

| Portão | Código lido | Ficheiro |
|---|---|---|
| build | 0 | `portoes/build.codigo` |
| verify | 1 | `portoes/verify.codigo` |
| typecheck | 0 | `portoes/typecheck.codigo` |
| motor | ausente, não executado | `portoes/motor.codigo` não existe; motor fora do âmbito |

A única conferência vermelha no verify foi `check:privacidade`, a código 1. Leu 14 798 ficheiros de `dist/`, sem ocorrências; a API e o incorporador passaram. O varrimento dos seguidos leu 24 496 ficheiros e encontrou a mesma ocorrência no oráculo. A diferença para a medição anterior são os dois ficheiros de provas entretanto comitados. As células de imutabilidade e de coerência da cabeça passaram. Fontes: `portoes-resumo.json` e `portoes/verify.json`.

A worktree começou limpa em `00fc78e5`, o commit do mandato sobre a base indicada `d8bb2924`. Os commits de implementação são `74842500` e `a56b0fd7`; a cabeça do código é `a56b0fd7a4912241152b24bb1309d9fb8062836b`. O último commit de provas antes dos portões é `f694c58cb4228465d48dafa22905832c5c1ceded`, a cabeça lida de `portoes/cabeca` e de `portoes/cabeca.fim`. A árvore estava limpa ao arrancar. Não houve escrita do construtor durante a corrida. A entrega posterior acrescenta apenas este relatório, o resumo dos resultados e os registos dos portões.

Questões e decisões:

- **RH1-1, decidida:** após reescrever a história, a base antiga pode deixar de existir. Nesse caso, os autores vêm de `HEAD`; não se tenta ler o inventário da base ausente. Conserva-se a constante histórica do C1, e a planta do repositório sintético prova a alternativa. Com a base presente, conserva-se a leitura anterior.
- **RH1-2, decidida:** um nome de ficheiro pode conter a própria cadeia proibida. O resultado interno guarda o nome, mas a verificação final recusa o JSON inteiro, indicando apenas a quantidade de cadeias. Não há fuga pelo diagnóstico nem dispensa do ficheiro.
- **RH1-3, aberta:** migrar o campo pessoal do oráculo para uma fonte privada, conservando as guardas que o leem em `scripts/gate-html.mjs:384`, `:4497` e `scripts/check-lingua.mjs:153`. O RH1 não enfraquece essas guardas nem aceita a ocorrência para obter verde. A entrega para aqui quanto à aterragem.
- **RH1-4, decidida:** o pedido de quatro códigos não autoriza tocar no motor. Foram lidos os três códigos existentes; a ausência do quarto fica explícita.
- **RH1-5, decidida:** uma pasta cujo nome seja a identidade pública do projeto não torna essa identidade pessoal. Mantém-se a recusa do caminho local completo, mas exclui-se o nome público isolado. Há planta própria.

O segredo de produção e o ficheiro privado ficam a cargo do lugar de direção. A sua configuração não foi criada nem validada por esta passagem. A auditoria dos artefactos RH1 não encontrou cadeias pessoais das fontes disponíveis nem estrutura local proibida.

## A passagem RH1-b

A RH1-3 ficou resolvida. `responsavel` e `lingua_do_responsavel` saíram do oráculo; o comentário regista a decisão de 14.10.2026 e a §1.192 (`scripts/textos-aprovados.json:40`). A comparação dos campos do oráculo antes e depois encontrou apenas essas duas remoções e a mudança do comentário `_`. Nenhum texto aprovado foi alterado.

A proteção pessoal passou para `check:privacidade`. Saíram do portão de HTML a leitura do nome, as formas, o detetor, os contadores e a conferência cruzada do rótulo com o Método (`scripts/gate-html.mjs:374`, `:4418`). Essa conferência cruzada era redundante: o detetor da privacidade lê todo o HTML construído, incluindo os documentos alojados, e os ficheiros seguidos, incluindo as declarações das regras e do rótulo. Conservam-se no portão de HTML as comparações exatas dos textos aprovados.

A forma abreviada não desapareceu com o oráculo: o detetor conserva a forma inteira e acrescenta primeiro e último elementos dos nomes com mais de duas partes, respeitando o mínimo de quatro caracteres e a exclusão das identidades públicas (`design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:86`). As formas vêm das fontes privadas e dos autores pessoais, nunca de uma identidade escrita no oráculo. A guarda do JSON abrange também as formas derivadas (`scripts/check-privacidade.py:312`).

A decisão sobre a L9 foi tomada depois da medição `rotulo-nome-antes-b.json`, pelo guião `medir-b.py:32`. Antes de alterar código, foram lidas 7 935 páginas HTML de `dist/`: zero ocorrências literais e zero atributos rendidos `data-rotulo-nome`. Em 362 ficheiros de `src/`, encontrou-se uma menção literal, no comentário de `src/components/RotuloDeIA.astro`, e zero atributos em tags. Depois dos portões, a mesma medição deu os mesmos resultados (`portoes-b-resumo.json`).

Saiu, por isso, a parte da L9 que comparava o nome e a sua língua. Ficaram a conferência da língua da frase do rótulo e o seu conhecido-positivo (`scripts/check-lingua.mjs:805`). O portão de HTML conserva ainda a recusa de marcas de nome no rótulo (`scripts/gate-html.mjs:5628`). A constante de língua sem consumidores saiu de `src/data/politica-ia.mjs`; os comentários desse ficheiro e do componente foram atualizados. Nenhum valor rendido em página mudou.

A leitura das dependências encontrou um consumidor ativo adicional do campo removido: `design/observatorio/medidas/BRIEF-M5.py`. Passou a ler as fontes privadas do mesmo detetor (`:156`), conservou os dois predicados e passou a provar ambos com cadeias sintéticas em memória. O JSON das suas medições foi regenerado, com os mesmos valores e comandos atualizados. `check:briefs` passou a zero na conferência local e nos portões. Os guiões históricos do M5 continuam como registo da passagem antiga; as plantas pessoais que serviam vivem agora na conferência corrente e na suite das leituras.

As plantas transferidas estão em `scripts/check-privacidade.py:204`. Correm com `--prova` na conferência normal. O ensaio `tests/leituras/privacidade-rh1b.py:17`, descoberto pelo `check:leituras`, acrescenta um repositório temporário, corridas completas, reposições e a prova de que um detetor cego faz as plantas falharem.

| Planta ou proteção antiga | Equivalente atual, pelo identificador da planta |
|---|---|
| Conhecido-positivo da forma inteira de `FORMAS_DO_NOME` | `transferida-nome-inteiro` |
| Documento alojado com «for» seguido da forma abreviada, §1.138 | `transferida-documento-alojado-for-abreviado` e `transferida-documento-alojado-en`; corridas completas em ambas as rotas no teste RH1-b |
| Nome em HTML cru, também fora do texto visível | `transferida-atributo`, `transferida-json-ld` e `transferida-m5-pagina-com-comentario` |
| M5, planta do nome numa cadeia de uma vista | `transferida-m5-vista`; corrida completa com um ficheiro seguido em `src/views/Ensaio.astro` |
| M5, planta do nome numa página construída | `transferida-m5-pagina-com-comentario`; corrida completa em `dist/sobre/index.html` |
| Ausência de nome nas fontes de `public/` | `transferida-fonte-publica`, pelo mesmo leitor dos ficheiros seguidos |
| Ausência de nome no rótulo e nas regras do Método | `transferida-rotulo` e `transferida-regra-do-metodo`; corrida completa na página do Método |
| Aceitação de texto público inócuo | `transferida-controlo-publico` e reposição do repositório sintético limpo |

As 29 plantas do ensaio RH1-b morderam; entre elas estão as 11 plantas transferidas que também correram na conferência de privacidade dos portões. A regressão RH1 e JD1 passou. A medição da cabeça do código conferiu 24 522 ficheiros seguidos, sem ocorrências; os portões conferiram 24 524, também sem ocorrências, incluindo os dois ficheiros de provas acrescentados entre ambas as corridas. Fontes: `medidas-b.json`, `portoes-b-resumo.json` e `portoes-b/verify.log`.

A decisão dos alvos ficou limitada ao que foi mandado: `.gitignore:59` ignora `design/especime-v3/medicoes/**/alvos.json`; a cópia de `portoes/alvos.json` desta entrega foi removida. Tinha 31 993 754 bytes, medidos antes da remoção em `rotulo-nome-antes-b.json`. O guião dos alvos e os lançadores dos portões não foram alterados. Na nova corrida, `portoes-b/alvos.json` foi criado, tem 31 993 754 bytes, está ignorado e não está seguido. O teste confirma ainda que a regra não ignora `public/alvos.json`. As cópias antigas não foram tocadas.

| Portão RH1-b | Código lido | Ficheiro |
|---|---|---|
| build | 0 | `portoes-b/build.codigo` |
| verify | 0 | `portoes-b/verify.codigo` |
| typecheck | 0 | `portoes-b/typecheck.codigo` |

As células de união, imutabilidade e coerência da cabeça passaram. A corrida começou com a árvore limpa, e não houve escrita do construtor durante os portões. `check:privacidade`, `check:briefs` e `check:leituras` passaram a zero, incluindo o ensaio RH1-b. O motor não foi tocado e nada foi publicado.

A passagem começou em `fbb4c19b`, o mandato acrescentado pelo lugar de direção. A cabeça do código é `e94cda066090def21ff7b5f36326a24bb1ac659e`. O último commit de provas antes dos portões é `3ad344e339841a369fdebd3771eab96e0a10e2b1`, confirmado em `portoes-b/cabeca` e `portoes-b/cabeca.fim`. O commit posterior de entrega acrescenta apenas os registos, o resumo, a auditoria e esta secção do relatório.

- **RH1-6, decidida:** conservar também a forma abreviada, tanto pelo segredo como pelos autores pessoais. A planta do documento alojado, a da forma vinda do Git e a da guarda de saída provam as três utilizações.
- **RH1-7, decidida:** retirar a conferência cruzada pessoal do rótulo e do Método, redundante com a leitura integral do `dist/` e dos ficheiros seguidos. As plantas de ambas as superfícies ficaram na privacidade; as comparações dos textos aprovados continuam no HTML.
- **RH1-8, decidida após medir:** retirar a parte da L9 dedicada ao nome, porque nenhuma marca é rendida. Conservar a língua da frase e a recusa da marca no rótulo pelo portão de HTML.
- **RH1-9, decidida:** migrar também a dependência ativa do M5. Apagar o campo deixando essa leitura quebrada teria fechado o verify por uma falha de execução, sem preservar a sua medição.

Não ficou nenhuma questão desta correção por resolver. A reescrita da história e a configuração dos segredos de produção continuam fora desta passagem.

## A passagem RH1-c

A passagem começou limpa em `5c48da4c`, com o mandato e a leitura a frio acrescentados pelo lugar de direção. Foram tratados o achado 6, os achados 8 a 11 e a observação sobre as plantas dentro do achado 1. Os defeitos numerados 1, 3, 4, 5 e 7 eram plantas nas cópias do pacote e não existiam no ramo. O achado 2 pertence à reescrita posterior da história; nenhuma cadeia pessoal foi reproduzida nesta entrega.

| Achado real | Correção e referência na cabeça do código |
|---|---|
| 6, normalização | `_ler_proibidos` retira BOM e espaços das pontas, normaliza em NFC e recusa controlos, caracteres de formato, separadores interiores e valores curtos, indicando só a posição da linha. `contem_cadeias` compara o texto em NFC com `casefold`. `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:55`, `:119`. As plantas do BOM, da forma abreviada limpa, da página em NFD e do formato recusado vivem em `scripts/check-privacidade.py:212`. |
| 8, representações | A comparação dos bytes inclui UTF-16 nas duas ordens e Latin-1; a comparação do texto desfaz entidades HTML e escapes Unicode quando os encontra. `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:105`, `:119`. Há uma planta em memória por codificação e por forma de entidade ou escape em `scripts/check-privacidade.py:237`. Flate fica explicitamente fora, na RH1-10 abaixo. |
| 9, identidades públicas | Cada identidade é ensaiada como segredo que tem de ser recusado e como autor do Git que tem de ser excluído. As leituras do Git são simuladas em memória, sem usar nem alterar a cache dos autores reais. `scripts/check-privacidade.py:194`; `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:159`, `:171`. |
| 1, observação sobre a decisão | `recusar_rastreado` contém a união por `or` e é chamada pelo varrimento real e pelas plantas. Estas isolam uma cadeia pessoal sem estrutura local, uma estrutura sem cadeia e um controlo inócuo. `scripts/check-privacidade.py:189`, `:237`, `:290`. O ensaio troca essa união por `and` em memória e confirma que as plantas do próprio portão ficam vermelhas. `tests/leituras/privacidade-rh1c.py:58`. |
| 10, localização da guarda | O comentário em `scripts/gate-html.mjs:374` aponta para `check:privacidade` no `verify`, e esta secção explicita a obrigação de ambos os portões. |
| 11, reprodução | `design/especime-v3/medicoes/rh1-2026-10-14/medir-b.py:57`, com `--reproduzir-b`, reproduz as contagens das auditorias e mede `marca_depois` e `alvos`. O resultado desta passagem está em `medidas-c.json`, no campo `reproducao_b`. A condição relativa ao segredo da conta está explicitada abaixo. |

A conferência pessoal saiu do `gate:html`, que corre no `build`, e vive em `check:privacidade`, que corre no `verify`; ambos são obrigatórios no portão do GitHub e nos portões locais, e uma construção sozinha nunca foi condição de aterragem. A recusa de `data-rotulo-nome` dentro do rótulo permanece no HTML; a decisão sobre a antiga contagem global continua fundamentada na medição anterior da RH1-b.

O nome da conta do GitHub é detetado quando essa cadeia estiver no segredo `PRIVACIDADE_PROIBIDOS`, que o lugar de direção cria com o financiador. Esta passagem não criou nem confirmou esse segredo de produção, e não atribui proteção antecipada a uma cadeia que ainda não esteja configurada.

As 45 plantas do ensaio RH1-c passaram. Incluem as plantas em memória do portão, a recusa da corrida por caracteres interiores inválidos, CRLF, o mínimo depois de NFC, a ausência de descodificação de entidades num texto sem entidades e as mutações da união e das exclusões públicas. As plantas de UTF-16, Latin-1, entidade nomeada, entidade decimal, entidade hexadecimal e escape Unicode são individuais. O `check:leituras` descobriu o novo guião e passou a zero, assim como RH1, RH1-b e JD1. `check:briefs` também passou. Fontes: `medidas-c.json` e `portoes-c/verify.log`.

A medição da cabeça do código conferiu 24 551 ficheiros seguidos, sem ocorrências, e as 38 plantas do varrimento passaram. Nos portões foram lidos 24 553 ficheiros seguidos e 14 798 ficheiros de `dist/`, sem ocorrências. A diferença nos seguidos corresponde aos dois ficheiros de provas comitados antes da corrida. As 38 plantas dos seguidos e as 26 plantas de `dist/` passaram. Não se somam estes conjuntos ao ensaio RH1-c, porque há plantas comuns. Fontes: `medidas-c.json` e `portoes-c-resumo.json`.

Os comandos de reprodução, a partir da raiz da worktree, são:

```sh
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/reproduzir-b-local.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-b.py --reproduzir-b
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/medicao-c.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/resumo-portoes-c.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py --portoes
```

A reprodução das auditorias conta os ficheiros nas cabeças históricas `6c107622` e `24f4298c`, excluindo o próprio registo de cada auditoria. Na segunda acrescenta o `portoes-b/alvos.json` local, cuja presença é exigida, pois estava ignorado. Reproduziu 26 e 51 ficheiros. Não conta retroativamente os ficheiros acrescentados na RH1-c. A medição de `marca_depois` lê o `dist/` e o `src/` presentes e publica `versao_dist`, para identificar a construção realmente lida; `alvos` mede o ficheiro local e consulta o Git quanto à exclusão e ao seguimento. O resultado guardado em `medidas-c.json` foi obtido antes dos novos portões, sobre a construção da RH1-b.

| Portão RH1-c | Código lido | Ficheiro |
|---|---|---|
| build | 0 | `portoes-c/build.codigo` |
| verify | 0 | `portoes-c/verify.codigo` |
| typecheck | 0 | `portoes-c/typecheck.codigo` |

As células de união, imutabilidade e coerência da cabeça passaram. A cabeça do código é `a1f6094e0f5625b71f32f9bf2a8c488930ecd49a`. O último commit de provas é `34129b6f2566a8e43f110b52fa74ab50cdf29576`, igual à cabeça de início e de fim dos portões. A árvore estava limpa ao arrancar e não houve escrita do construtor durante a corrida. A entrega posterior acrescenta apenas o relatório e os artefactos dos resultados. O motor não foi tocado e nada foi publicado.

- **RH1-10, aberta e fora deste bloco:** o detetor não descomprime fluxos Flate dos PDF. A contagem pelo `git ls-files -z`, filtrada pela extensão em `medir-c.py:44`, encontrou zero PDF seguidos no repositório do sítio. Os corpos alojados vivem no motor, que não foi conferido nesta passagem. A ausência de PDF seguidos aqui não demonstra proteção de fluxos comprimidos.
- **RH1-11, decidida:** só LF separa entradas do segredo; CRLF é aceite pelas pontas. Um separador Unicode interior é recusado, em vez de dividir silenciosamente a linha em duas cadeias aceites. As linhas vazias continuam ignoradas, e uma lista vazia em CI continua recusada.
- **RH1-12, decidida:** reproduzir o âmbito histórico das auditorias pelas cabeças registadas, em vez de apresentar a contagem atual de uma pasta que entretanto cresceu como se fosse a contagem anterior. A cópia local ignorada dos alvos permanece uma condição explícita da segunda reprodução.

## A passagem RH1-d

A passagem começou limpa em `de3d740b`. O achado 1 e os achados 7 a 9 eram reais; os achados 2 a 6 eram plantas nas cópias do pacote e não existiam no ramo. Foram corrigidos os espaços interiores e o custo da conferência, sem retirar nenhuma superfície do varrimento. Nenhuma página ou valor mudou.

| Achado real | Correção e referência na cabeça do código RH1-d |
|---|---|
| 1, espaços interiores | `_ler_proibidos` colapsa os espaços reconhecidos por `str.split()` antes de NFC e da validação. A procura admite sequências de espaços Unicode, espaços inseparáveis, quebras e as suas representações HTML e Unicode. `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:55`, `:106`, `:177`, `:181`. As plantas do segredo e da página vivem em `scripts/check-privacidade.py:260`. |
| 7, custo | As formas NFC e NFD, em minúsculas e `casefold`, são calculadas uma vez e guardadas em cache. A expressão regular em bytes reúne as codificações e as representações, partilha prefixos e começa os ramos por bytes literais. Cada chamada pesquisa uma única cópia do corpo em bytes minúsculos, sem descodificar o ficheiro nem normalizar o seu texto. `design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:106`, `:181`. O tempo mede-se em `design/especime-v3/medicoes/rh1-2026-10-14/medir-d.py:23`. |
| 8, referências | Na secção RH1-c, o filtro dos PDF passou a apontar para `medir-c.py:44` e a mutação para `tests/leituras/privacidade-rh1c.py:58`. As restantes referências dessa secção foram conferidas por `git show` na cabeça `a1f6094e`, que a secção documenta. As referências da presente tabela foram conferidas na cabeça RH1-d. |
| 9, auditoria | `design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py:57`, com `--auditar c`, escreve a auditoria histórica e reproduziu os 78 ficheiros e `passou=true`. Com `--auditar d`, a mesma função escreve a auditoria desta entrega. Os comandos estão abaixo. |

As 49 plantas novas em memória do portão cobrem o segredo com espaços duplos, inseparáveis e tabuladores; a página com espaços duplos, inseparáveis, quebra de linha, `&nbsp;`, `&#160;` e `&#xA0;`, nas codificações representáveis; e as formas NFC e NFD em minúsculas, `casefold` e maiúsculas, em UTF-8, UTF-16 nas duas ordens e Latin-1. Há controlo inócuo. A forma NFD com marcas combinantes não tem representação literal em Latin-1, pelo que essa combinação não é apresentada como ensaiada.

O ensaio `tests/leituras/privacidade-rh1d.py:13` passou as 88 plantas. Acrescenta os restantes espaços reconhecidos por `str.split()`, entidades nomeadas, decimais e hexadecimais, escapes, formas misturadas, caixa mista, uma cadeia que não é a primeira da lista, e a prova de que o corpo não é descodificado nem normalizado. Conserva também entidades e escapes de caracteres ASCII. Um detetor cego põe as plantas vermelhas. As antigas provas de rejeição dos espaços interiores no RH1-c foram substituídas pelas provas de normalização do RH1-d; NUL e caracteres de formato continuam recusados. Fonte: `medidas-d.json`.

O custo foi medido antes de mudar o detetor e depois do commit do código, na mesma máquina. Ambas as corridas executaram `python3 scripts/check-privacidade.py --prova`, com código 0, sobre a mesma construção identificada em `versao_dist`. Leram 14 798 ficheiros de `dist/`; os seguidos passaram de 24 579 para 24 581, pelos novos guiões. O temporizador mede o subprocesso com `time.perf_counter()`. Antes da alteração foi usado um invólucro temporário equivalente; o comando e o temporizador ficaram versionados em `medir-d.py:23`. As cabeças e os tempos sem arredondamento estão em `tempo-antes-d.json` e `tempo-depois-d.json`. Repetir uma medição exige usar a versão do detetor correspondente à cabeça registada.

| Corrida | Tempo da privacidade, em segundos | Fonte |
|---|---|---|
| Isolada, antes da RH1-d | 367,6 | `tempo-antes-d.json`, arredondado em `custo-d.json` |
| Isolada, depois da RH1-d | 54,6 | `tempo-depois-d.json`, arredondado em `custo-d.json` |
| Portões RH1-b | 119,9 | `portoes-b/verify.log` |
| Portões RH1-c | 371,6 | `portoes-c/verify.log` |
| Portões RH1-d | 59,9 | `portoes-d/verify.log` e `portoes-d-resumo.json` |

A meta de regressar à ordem do custo da RH1-b foi atingida. A comparação isolada e a corrida dos portões são medições distintas; os seus tempos não são apresentados como se fossem a mesma corrida.

Comandos das medições, das provas e das auditorias, a partir da raiz da worktree:

```sh
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/tempo-antes-d.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-d.py --tempo antes
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/tempo-depois-d.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-d.py --tempo depois
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/medicao-d.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-d.py
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/auditoria-c-reproduzida-d.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py --auditar c
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/auditoria-d.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py --auditar d
sh scripts/leituras/curto.sh design/especime-v3/medicoes/rh1-2026-10-14/resumo-portoes-d.log python3 design/especime-v3/medicoes/rh1-2026-10-14/medir-d.py --portoes
```

O resumo `custo-d.json` é reproduzido por este comando, que arredonda apenas os tempos isolados e lê os outros do registo:

```sh
python3 - <<'PY'
import json
from pathlib import Path
import re
import subprocess
p=Path('design/especime-v3/medicoes/rh1-2026-10-14')
r={'isolada': {fase: round(json.loads((p/('tempo-'+fase+'-d.json')).read_text())['segundos'],1) for fase in ('antes','depois')}, 'portoes':{}}
for fase in ('b','c','d'):
    linha=subprocess.check_output(['grep','-E','^✓ npm run check:privacidade ',str(p/('portoes-'+fase)/'verify.log')],text=True)
    r['portoes'][fase]=float(re.search(r'· ([0-9.]+) s ·',linha)[1])
(p/'custo-d.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(r,ensure_ascii=False))
PY
```

A auditoria RH1-c lê os ficheiros seguidos em `5dc59f27`, exclui o próprio registo e acrescenta as cópias locais ignoradas dos alvos RH1-b e RH1-c. Confere os corpos desses ficheiros, em vez de apenas recontar os nomes. A auditoria RH1-d confere os ficheiros presentes na pasta das medições, incluindo os alvos locais ignorados, antes de escrever o seu próprio registo; o âmbito atual não é confundido com o histórico. Ambas leem as fontes privadas disponíveis pelo mesmo detetor e conferem a saída antes de a escrever. A auditoria desta entrega passou, sem ocorrências, em `auditoria-entrega-d.json`.

| Portão RH1-d | Código lido | Ficheiro |
|---|---|---|
| build | 0 | `portoes-d/build.codigo` |
| verify | 0 | `portoes-d/verify.codigo` |
| typecheck | 0 | `portoes-d/typecheck.codigo` |

Os portões conferiram 24 588 ficheiros seguidos e 14 798 ficheiros de `dist/`, sem ocorrências. As 87 plantas dos seguidos e as 26 de `dist/` passaram. `check:leituras`, incluindo RH1, RH1-b, RH1-c, RH1-d e JD1, e `check:briefs` passaram a zero. As células de união, imutabilidade e coerência da cabeça passaram. Fontes: `portoes-d-resumo.json` e `portoes-d/verify.log`.

A cabeça do código é `9157e23ebbf7835e56582895cdf0aa2f2868e0d0`. O último commit de provas é `68711cddb0aaa9cfc18ee7840064a1cde6608540`, igual à cabeça de início e de fim dos portões. A árvore estava limpa ao arrancar e não houve escrita do construtor durante a corrida. O commit posterior acrescenta apenas o relatório e os resultados. O motor não foi tocado e nada foi publicado.

- **RH1-13, decidida pelo mandato, substitui a RH1-11 quanto aos espaços:** LF continua a separar entradas do segredo. Os outros espaços interiores que `str.split()` reconhece passam a um espaço comum antes da validação. Na página, LF também é uma variante de espaço entre palavras. As plantas provam ambos os lados.
- **RH1-14, decidida pela conservação da proteção:** a procura em bytes conserva também maiúsculas não ASCII, caixa mista, entidades e escapes de letras ASCII e combinações de representações dentro de uma cadeia. Essas formas eram cobertas pela descodificação anterior e têm plantas próprias.

A questão RH1-10 sobre fluxos Flate de PDF continua aberta e fora deste bloco. Não ficou nenhum achado real do mandato RH1-d por resolver.
