# Três ferramentas determinísticas, 15.10.2026

Implementação do mandato nas ferramentas de construção. Não muda páginas, números, fontes ou portões existentes. Não houve publicação, aterragem real, mudança no motor nem leitura a frio nesta passagem.

## O que ficou implementado

- `sh scripts/leituras/aterrar.sh <worktree absoluta> <saída nova>` toma a tranca comum, recusa árvores sujas, main, falta de antepassado e motor ausente ou sujo. Publica o ramo sem forçar; espera o portão da cabeça e guarda o endereço e o código. Corre séries e cruzamento separadamente, relendo os códigos de ficheiro. A fusão por avanço rápido e a publicação de main são comandos separados. Filtra a lista da Vercel pela cabeça completa e por produção, confirma o lançamento e corre `verify:deploy`. Só depois apaga o ramo remoto, destaca a worktree e apaga o ramo local com a recusa normal do Git. Cada passo terminado fica em `aterragem.json`, com código, hora e cabeça. Nenhuma criação de lançamento pela API foi transposta do guião antigo.
- `sh scripts/leituras/fundir.sh main` ou `master` pede a operação ao escrivão da worktree. Recusa modificações seguidas e operações Git em curso; não escolhe um lado e desliga a reutilização automática de resoluções de conflitos. Um conflito devolve código 1, lista os ficheiros, aborta e confere a reposição. O escrivão mantém o batimento durante a fusão e regista o resultado pelo protocolo existente.
- `sh scripts/leituras/pre-voo.sh <worktree> <motor>` imprime códigos por condição: modificações seguidas, antepassados, dependências locais, cada cache existente na principal do motor, trancas e destinos dos registos. O lançador chama-o antes do Codex, recusa o arranque a vermelho e guarda os ficheiros `.escrivao.log` e `.pontos.json` numa pasta temporária externa. Define `RESEARCHHUB_LOCK_DIR` quando falta.

## Ensaios e comandos

Todos os comandos com saída longa correram por `sh scripts/leituras/curto.sh <temporario>/registo.log <comando>`. Os repositórios dos ensaios são descartáveis; as publicações, GitHub, Vercel e npm são simulados. As fusões, os conflitos, as árvores e o protocolo do escrivão usam Git e processos reais nos temporários.

| Comando | Código | Resultado medido |
|---|---|---|
| `python3 -m unittest discover -s tests/leituras -p 'ferramenta_*.py' -v` | 0 | 25 ensaios, 25.368 segundos, em `ensaios.log` |
| `python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md` | 0 | Três linhas novas e três citações novas reconhecidas; ver `mapa-antes.log` e `mapa-depois.log` |
| `sh -n scripts/leituras/aterrar.sh scripts/leituras/fundir.sh scripts/leituras/pre-voo.sh scripts/leituras/construir-codex.sh` | 0 | Sintaxe dos guiões conferida |
| `git diff --check` | 0 | Sem erros de espaços |
| `sh scripts/leituras/pre-voo.sh <worktree> <motor>` antes do commit | 9 | Recusa real pelas modificações seguidas desta implementação; restantes condições passaram, incluindo as oito caches listadas |

As plantas obrigatórias passaram: ficheiro por registar e corrida vermelha impedem a fusão; a procura da bandeira de publicação forçada no código não a encontra; o conflito repõe a cabeça e todos os bytes da árvore, incluindo um ficheiro não seguido; dependências ausentes e master por fundir impedem o arranque. Os restantes ensaios conferem falhas das duas conferências do motor, publicação de main, Vercel e verificação do lançamento sem apagar ramos; cabeça errada e estruturas JSON inválidas do GitHub; tranca ocupada e caducada; fusão por avanço rápido e por commit de fusão; caches em falta e registos dentro do relatório; cliente, batimento e arranque completo do lançador com Codex simulado.

## Portões e cabeça

A corrida `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>/portoes` terminou com código 0 na cabeça `6818d0c609380eeafd827576d538e8bba810bc94`. Os ficheiros foram relidos: build 0, verify 0 e typecheck 0. O recibo `portoes-primeira.json` guarda as duas cabeças iguais, as horas e as durações medidas: build 210 segundos, verify 338 segundos e typecheck 0 segundos à resolução dos marcadores de segundo. Nenhum portão existente foi alterado.

Depois desta corrida acrescentou-se a recusa explícita das estruturas JSON inválidas do GitHub, provada pela suite atualizada. A cabeça final, com essa recusa e este relatório, será novamente conferida pelos mesmos três portões depois do commit; os códigos dessa corrida final são devolvidos na resposta da passagem, sem um novo commit que voltasse a mudar a cabeça. O pré-voo nas duas worktrees reais, depois do primeiro commit, devolveu 0; a saída está em `pre-voo-real.log`. O registo aberto do lançador antigo foi preservado fora da worktree por mudança de nome, conservando o descritor aberto. As provas dos portões ficam fora da worktree durante a corrida. O processo do lançador que já estava em execução poderá ainda escrever o ficheiro de pontos no destino antigo ao terminar; a alteração do destino aplica-se aos lançamentos seguintes, e o pré-voo deteta esse ficheiro se ficar junto do relatório.

## Limites e decisões de implementação

A pasta de saída da aterragem tem de ficar fora das árvores do sítio e do motor: os registos não podem sujar a cabeça que a própria ferramenta volta a conferir antes da fusão e da limpeza. A worktree aterrada é conservada, destacada na cabeça que passou; não se remove a pasta. A integração externa foi exercida por simulação, não por publicação real. A direção continua responsável por chamar a aterragem apenas depois dos portões locais e da leitura a frio.

As esperas do GitHub e da Vercel são limitadas a 45 consultas, separadas por um minuto. O `gh run watch` usa intervalo de 60 segundos e código de saída; as consultas têm teto de dois minutos e os comandos longos de cinquenta. A tranca recebe batimento para não caducar enquanto a aterragem espera. Uma falha conserva o ramo para diagnóstico e não desfaz uma publicação já concluída.

O mapa já tinha 103 citações afastadas, cinco não encontradas e quatro referências para lá do fim do ficheiro. Os valores não mudaram; só as citações reconhecidas passaram de 440 para 443. O conferidor devolve 0 mesmo com estes avisos. A correção das referências antigas está fora das três linhas autorizadas.

O endereço de `Claude-Session` foi copiado do último commit e conferido contra `CLAUDE_CODE_BRIDGE_SESSION_ID` do processo, porque o mandato não o incluía. Não se reconstruiu um identificador.

A sintaxe das consultas foi conferida na ajuda instalada da Vercel e na documentação oficial de [Vercel list](https://vercel.com/docs/cli/list), [gh run list](https://cli.github.com/manual/gh_run_list) e [gh run watch](https://cli.github.com/manual/gh_run_watch).

## Custo

A última suite de ensaios mediu 25.368 segundos. O custo semanal em pontos é medido pelo lançador antes e depois da passagem. A linha `tokens used` não está disponível durante a escrita deste relatório; não se atribui uma contagem inferida. A primeira corrida dos portões mediu 548 segundos na soma das três fases, pelos marcadores guardados em `portoes-primeira.json`. A corrida final terá o seu recibo externo, depois do commit deste relatório.
