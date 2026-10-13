# Mandato do bloco de higiene de 13.10.2026 (as questões Minor das leituras de 12.10, os caminhos antigos do motor, o mapa dos construtores)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 13.10.2026, pela §1.177 (o bloco de higiene semanal junta os Minor) e pela §1.190 (este é o primeiro bloco lançado com o escrivão, o invólucro e a medição dos pontos: a passagem de ensaio das alavancas 1, 2 e 4 do plano de eficiência). O construtor é o Codex `gpt-6-astra` em `high`, nas duas worktrees (o sítio e o motor). A leitura a frio é do Claude Opus 5.5 em `high`, com cinco plantas, porque o bloco é mecânico e não muda nenhum número. Sem travessões na prosa.*

## 0 · O que se mede antes de tocar em nada

`git status` e `git log --oneline -5` nas duas worktrees; os três portões do sítio por `sh scripts/leituras/portoes.sh <worktree absoluta> <pasta nova>` e o portão do motor por `sh scripts/leituras/curto.sh <registo> python3 -m core.gate` na worktree do motor, com os códigos guardados em ficheiros que o relatório cita (têm de ser zero antes de começar; se não forem, para e diz). Os números do relatório lêem-se dos ficheiros que a máquina escreveu.

## 1 · As questões, bloco a bloco

Cada questão fecha-se de uma de duas maneiras: a correção, com o ficheiro e a linha, ou a razão escrita de a deixar como está. As ambiguidades pequenas decidem-se e anotam-se (uma linha por decisão, numeradas `HIG-1`, `HIG-2`...); só se para por uma dúvida que mude o que uma página diz.

**ER1 (a §1.184 e o relatório da ER1-f).** ER1-12: o conjunto da diferença de `medir-c.mjs` é vazio por construção; a medida passa a comparar algo que possa diferir, ou o guião diz por escrito por que razão a diferença é sempre vazia e a medida sai.

**EX1 (a §1.185 e a I222).** EX1-11: o saldo dos mesmos oito meses de 2025 continua por selar no motor para a explicação do dinheiro do Estado; se a fonte o imprimir, sela-se pelo circuito do JD1 e exporta-se; se não, a explicação diz a ausência exata. EX1-12: as duas transferências da explicação distinguem-se com palavras seladas da fonte, ou a frase que as junta sai. EX1-13: a oração «do parágrafo seguinte» sai (um título fica entre os dois parágrafos) e «outra conta» ganha a explicação em palavras correntes. EX1-14: o ramo `diferentesNegativo` da comparação dos saldos imprimiria «um défice de −1 789,8», um duplo negativo; corrige-se o ramo e planta-se o caso para a célula o ver.

**RP4-n (a §1.187).** RP4N-12: os caminhos nos briefs antigos e o `Path.home()` do extrator do motor (o caminho fica por variável de ambiente ou relativo ao repositório). RP4N-13: as marcas «[a verificar]» que ainda estejam em `meta` e `og:description` saem, pela §1.172, com a frase da ausência onde fizer falta. RP4N-19 a RP4N-23 (a leitura da RP4-n-i): as mensagens de duas plantas que nenhum controlo imprime passam a imprimir-se; o inventário das frases ganha as cadeias novas do recibo; as três legendas iguais no recibo dos ministérios passam a dizer o que cada uma conta; a ligação da prova que parte a meio da palavra a 390 px deixa de partir (uma captura a 390 px prova-o); o custo da passagem i fica explicado numa linha do relatório da RP4-n em `design/especime-v3/medicoes/rp4n-2026-10-06/`. RP4N-24 a RP4N-27 (a leitura da RP4-n-j): o relatório da RP4-n-j ganha o comando do inventário, a cabeça da construção de que as contagens se leram, a lista das dezassete recusas do publicador, e as razões do custo acima do alvo.

**JD1 (a §1.186).** JD1-11: as âncoras do mapa do repositório perdidas na reversão voltam. JD1-12: o âmbito único de `registarLeitura` diz-se no código ou alarga-se. JD1-15: a frase da comparação sem verbo e a repetir a definição ganha verbo e perde a repetição. JD1-16: o perímetro deixa de se definir por si; o excerto do INE sustenta a cláusula de exclusão, e a frase apoia-se nele. JD1-17: o cabeçalho «O nome na fonte» mostra o nome da medida na fonte, e a proveniência o título do documento, em todos os recibos do JD1, nas duas edições.

**V1 (a §1.188).** V1-39: a prova das duas corridas no relatório da V1-d é uma simulação com um valor fixado pelo guião `medir_v1d.py`; a medida passa a ler as corridas reais (os recibos gravados), e o guião diz de onde leu. V1-40: as três linhas de arrumação do resumo diário ganham rótulo. V1-41 está fechada pela M78 (o rasto do pacote), não se toca.

## 2 · Os caminhos antigos do motor (JD1-9, RP4N-16)

Na worktree do motor, o detetor de caminhos da casa (`design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py` do sítio, a função `tem_caminho`) corre sobre todos os ficheiros seguidos; cada caminho da máquina em comentários, manifestos ou guiões antigos passa a `<casa>`, a variável de ambiente ou a caminho relativo ao repositório, conforme o uso; o relatório lista os ficheiros tocados e o que cada um dizia, sem copiar o caminho. Os ficheiros das outras corridas (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`, `publisher/recortes/manifest.regioes.json`) não se tocam: se um deles tiver um caminho, o relatório di-lo e fica para o lugar de direção.

## 3 · O mapa dos construtores

`design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md` ganha, no fim, uma secção datada de 13.10.2026 com os guiões novos da §1.190 (`escrivao.py`, `comitar.sh`, `curto.sh`, `pontos.py`, `PROMPT-construtor-comum.md`) e o que mudou em `construir-codex.sh`, `retomar-codex.sh`, `portoes.sh` e `pacote.py`, em quatro a oito frases, e a linha de «posto em dia» no cabeçalho, como as anteriores. As âncoras em vez de números de linha (M-A) não são deste bloco.

## 4 · As regras do bloco

As regras comuns do prompt que o lançador pôs à frente deste mandato valem inteiras: comitas por `comitar.sh`, só ficheiros explícitos; os portões por `portoes.sh` e tudo o que imprima muito por `curto.sh`; nada de `sleep` em turnos separados; nunca `git push`, nunca `git add -A`, nunca `git checkout` fora das duas worktrees. Nenhum número de página muda neste bloco: se uma correção pedir um número novo, para nessa questão e deixa-a dita. Um portão que proteja um número, uma fonte ou uma pessoa nunca se enfraquece; o que mudar de forma leva uma planta. Commits pequenos, um por questão ou por grupo de questões do mesmo ficheiro, com os trailers (`Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>`; no sítio também `Claude-Session: https://claude.ai/code/session_01FHYNTtspyh84DJTCarQ444`).

## 5 · A entrega

No fim, os três portões do sítio e o portão do motor na cabeça final, com os códigos lidos dos ficheiros; capturas a 390 e 1 280 px das páginas tocadas (os recibos do JD1, a explicação do dinheiro do Estado, o recibo dos ministérios), nas duas edições, pelo guião das capturas do projeto (`scripts/leituras/captar.mjs`), em `design/especime-v3/capturas/higiene-2026-10-13/`. O relatório, em `design/especime-v3/medicoes/higiene-2026-10-13/RELATORIO.md`, com: a tabela das questões e o que se fez a cada uma (ou a razão de ficar); as decisões `HIG-n`; os ficheiros do motor tocados pelo §2; as cabeças finais e do código dos dois repositórios e a lista dos commits; os códigos dos portões lidos dos ficheiros; o que ficou aberto; e a linha «tokens used» se a vires. Os pontos da semana mede-os o lançador.
