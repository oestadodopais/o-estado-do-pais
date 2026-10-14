**RH1: a primeira entrega ficou vermelha; a passagem RH1-b, abaixo, fecha os três portões a zero.**

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
