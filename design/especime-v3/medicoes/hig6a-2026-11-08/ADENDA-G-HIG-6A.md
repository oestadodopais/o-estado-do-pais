# Adenda G ao mandato HIG-6A: a camada 0 que precisa do motor corre na aterragem, e o motor sai da corrida do GitHub (08.11.2026)

Acrescenta: nada
Medidas: medidas-adenda-g-hig6a.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da aterragem recusada às 10:49 UTC. Sétima retoma, por decisão escrita: a corrida do GitHub não pode ler o motor, que é privado, e a chave que o deixaria ler é do financiador; o motor numa revisão fixada envelheceria (o Minor 12 da leitura curta). A mesma sessão e a mesma worktree.*

## §0 Medido

- A corrida `portão` 42471282619 (a cabeça 9fa332bdd): «construir» verde; as seis partes «conferir (0)» a «conferir (5)» vermelhas no passo «O motor da camada 0, numa revisão fixada», com «remote: Repository not found». `main` não mudou (96ce315c1).
- `gh secret list` mostra um só segredo, `PRIVACIDADE_PROIBIDOS`; não há `RESEARCHHUB_READ_TOKEN`, e o `github.token` só lê este repositório.
- O padrão que já existe: as conferências que leem o motor fazem a parte do motor quando `RESEARCHHUB_DIR` está presente, e a aterragem corre-as na máquina com o motor (`aterrar.py`, as linhas do `check:series` e do `check:cruzamento --with-origin`, depois de `self.github()` e antes de `fundir-main`).
- `conferirPartes` (`scripts/verify-partes.mjs`) exige que cada passo do `verify` fora do `build` esteja numa parte; `tests/leituras/camada-cadeia.mjs` exige o passo do motor na corrida do GitHub.
- Pela procura de `RESEARCHHUB_DIR` e `quantificadores` nos ficheiros que o `verify` chama: o `check:pre-mandato` (frases.mjs, hig6a.py, frases-ligacao.mjs, camada-cadeia.mjs; o pre_voo e o lancadores_copia dão o seu próprio motor de ensaio) e o `check:frases-reais` são os únicos passos que precisam do motor verdadeiro sem alternativa; os outros que o leem já passavam no GitHub sem ele antes da HIG-6A.

## §1 O que fazes

1. **Um passo declarado só com o motor:** um script `verify:com-motor` igual a `npm run check:pre-mandato && npm run check:frases-reais`. Os dois ficam no `verify` (a corrida inteira na máquina, `conferir-tudo.sh`, continua a corrê-los com o motor).
2. **A corrida do GitHub sem o motor:** a escolha das partes (`restantesDoVerify`, `conferirPartes`, `juntar` e o que mais as partes usem) tira exatamente os passos de `verify:com-motor`, nenhum outro, e recusa um `verify:com-motor` com um passo que não esteja no `verify`. O `portao.yml` perde o passo que tira o motor e o que exporta `RESEARCHHUB_DIR`. Se algum outro passo das partes falhar sem o motor, dizes qual e porquê, e não o mudas sem o dizer.
3. **A aterragem corre-os com o motor:** em `aterrar.py`, depois do `check:cruzamento --with-origin` e antes de `fundir-main`, `self.correr('camada-0', ['npm', 'run', 'verify:com-motor'])`, com o `RESEARCHHUB_DIR` da aterragem; vermelho recusa. Confirma que o `dist/` que esses passos leem está lá nesse ponto (o mesmo que o `check:series` lê). Uma planta em `tests/leituras/ferramenta_aterrar.py`: com `verify:com-motor` vermelho, a aterragem não funde nem publica.
4. **A guarda da cadeia** (`camada-cadeia.mjs`), no lugar das asserções do motor no GitHub: os dois passos uma vez no `verify`; `verify:com-motor` exatamente esses dois; as partes do GitHub tiram exatamente esses; `aterrar.py` corre `verify:com-motor` antes de `fundir-main`; nenhum passo do `portao.yml` refere `oestadodopais/motor` nem `RESEARCHHUB_READ_TOKEN`. Uma planta por asserção (tirar do `verify`, tirar de `verify:com-motor`, tirar da aterragem, pôr a aterragem a corrê-lo depois de `fundir-main`, um terceiro passo tirado das partes).
5. **O fecho:** `check:pre-mandato`, `check:frases-reais`, as conferências que cobrem as partes do GitHub e a aterragem (diz quais correste, com os códigos); prova que a escolha das partes, sem `RESEARCHHUB_DIR`, dá todos os passos do `verify` menos os dois; o `build` só se mudares algo que ele leia; os commits com o assunto a começar por `HIG-6A`; o relatório curto.

## §2 Quando paras

Só se um passo das partes, além dos dois, precisar do motor verdadeiro e não tiver alternativa; os teus erros de implementação corriges e segues, e dizes quais.

## §3 O fim

O §1, ponto 5. Quarenta e cinco minutos, sessenta chamadas.
