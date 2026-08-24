# BRIEF · Parte 3, P4 · as oito edições, sem código novo

*Escrito a 24.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). Sítio: ramo `parte3-2026-08-24`, depois da P1, da P2, da P3, da medição cega M1 e da primeira leitura cruzada do Codex, com os defeitos reais dessas duas corrigidos. Sem travessões na prosa deste ficheiro.*

## 0 · Numa frase

A P2 construiu as oito páginas de leitura de uma vez (o `getStaticPaths` sai do manifesto), pelo que a P4 não tem dados a acrescentar nem código a escrever: é a leitura, edição a edição, das cinco que o exemplar não cobriu (03 pt, 06 pt, 07 pt, 07 en, 09 pt), contra a sua edição arquivada e contra o registo, com as contagens a bater nas oito e cada coisa que se vir registada. **Nenhum código novo**, salvo a correção de um defeito que a leitura encontre, e essa com o seu estrago plantado.

## 1 · Ler primeiro

1. O plano §5 (a ordem e o que a P4 é), §8 (o risco do 08 pt, já coberto pelo exemplar).
2. `DECISIONS.md` §1.64 inteira (P1 a P3 e a leitura cruzada), `design/especime-v3/notas/parte3.md` inteira.
3. `design/especime-v3/medicoes/parte3-M1-sonnet.md` (o que a medição cega viu no exemplar) e `design/especime-v3/critica/2026-08-24-codex-leitura-parte3-1.md` (a primeira leitura cruzada, pontuada).
4. `design/especime-v3/ISSUES.md` (I64 a I66 e o que a ronda de correções acrescentou).

## 2 · O que se faz, edição a edição (as cinco)

Para cada uma das cinco páginas (`/estudos/avaliacao-economica-regional-de-portugal-2026/texto`, `/estudos/evora-economia-investidores-portas-abertas-2026/texto`, `/estudos/evora-orcamentado-pago-devido-2025/texto`, `/en/studies/evora-orcamentado-pago-devido-2025/text`, `/estudos/evora-os-pelouros-quem-os-teve-o-que-fizeram/texto`):

1. **A página lida de alto a baixo**, com a edição arquivada ao lado (`/documento`), e a nota diz o que se viu: os blocos, as tabelas, as listas, as ligações, os selos, as portas, a faixa, «As linhas deste documento», e o que difere da edição arquivada e porquê (a passagem de voz, o `charts=False`, o `prova` daquela edição).
2. **As contagens**: a faixa (blocos, algarismos, com linha do sítio) contra o manifesto e contra `dist/cadeia.json`; e uma tabela final com as oito edições, as três contagens de cada uma, e a soma igual às oito chaves da prova (829, 2 601, 196 e as outras).
3. **O 03 pt em particular**: as 7 ligações com o URL como etiqueta (até 283 caracteres) lidas a 1280 e a 390, e o que a `overflow-wrap` faz delas; a nota da faixa que diz que o D5 não corre; e a diferença entre a página de leitura e a edição arquivada, que aqui é um artefacto do claude.ai e não os bytes do motor (decisão 7): dizer, com uma amostra medida (a leitura do olho da edição arquivada contra o registo, unidade a unidade, com o número de iguais e de diferentes), até onde as duas coincidem. É a resposta honesta à pergunta 7 do plano, e fica escrita.
4. **O 06 pt**: a edição republicada a 24.08 dos bytes do motor; o D5 correu e bate; a página de leitura contra a arquivada devem diferir só na passagem de voz (5 operações, pelo `REGISTOS.md`). Medir.
5. **O par 07**: o único outro par bilingue; o comando de língua da página leva à irmã; as figuras com linha do sítio nas duas edições apontam para as mesmas linhas (o `site_id` é o mesmo nas duas línguas). Medir.
6. **O 09 pt**: 155 blocos, 297 figuras, os dois marcadores de glifo (`markers`) que o `REGISTOS.md` diz que a edição tem (2): verificar que o glifo está no texto e a figura o não engole.
7. **O móvel**: `node tests/texto/leitura.mjs` (a régua da forma da P2) corrida sobre as oito, ou estendida a elas se só media três; transbordo zero a 390 nas oito.

Um defeito encontrado numa destas leituras corrige-se **com o seu estrago plantado** e regista-se; um defeito do motor (do registo, da voz) regista-se em `ISSUES.md` e não se contorna.

## 3 · O registo

* `DECISIONS.md` §1.64, subsecção `#### P4 · as oito edições`: a tabela das oito com as contagens, o que cada uma das cinco leituras viu, a resposta medida à pergunta 7 para o 03 pt, e o que fica.
* `notas/parte3.md` §P4.
* `ISSUES.md`: o que for do motor.

## 4 · Aceitação

1. `npm run build` verde, `npm run verify` verde, `npm run typecheck` verde, `node scripts/medir-defeitos.mjs` com a rota `texto` a zero de autorreferência nas oito.
2. A tabela das oito edições com as contagens a bater com a prova.
3. As cinco leituras escritas, com o que se viu.
4. Commits no ramo (o registo; correções se as houver, cada uma com a sua planta); não fundir, não empurrar.
5. O relatório: «judgement calls for the seat» primeiro; o que se viu, edição a edição; contagens; commits; custo; o que ficou por fazer.

## 5 · Regras

As mesmas das etapas anteriores: as onze decisões não se reabrem; nenhum texto governado; nenhum byte de `registos/` ou `studies-src/`; prosa em português no Acordo, sem travessões; nunca `git add -A`; regra 14; escolhe, constrói, e põe a escolha à cabeça do relatório. Nunca stagear ficheiros de `design/especime-v3/medicoes/` que não sejam teus.
