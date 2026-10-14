**RH1: implementação entregue com o portão de privacidade vermelho.**

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
