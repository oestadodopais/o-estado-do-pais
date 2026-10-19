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


## A passagem de correção de 19.10.2026

Esta secção substitui a promessa anterior de deixar os códigos finais apenas na resposta. Não houve publicação nem fusão das worktrees reais. O motor ficou sem alterações, nenhum portão existente foi modificado e o registo aberto do lançador foi preservado fora da worktree antes dos portões.

1. **Portões na cabeça final do código (achado 5).** Depois do commit das correções, os três portões correm por `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>/portoes`. O recibo seguinte só acrescenta prova: a cabeça conferida é a do commit anterior ao recibo, que não muda código. Este ponto verifica a proveniência dos resultados; as plantas vermelhas abaixo provam as recusas do código, sem modificar os portões.
2. **Recusa de main antes de publicar (achado 6).** `test_main_recusado` confere código 9, ausência de qualquer `git push`, ausência de chamadas a GitHub, npm e Vercel, e o motivo da recusa antes de qualquer passo de publicação. Na cópia sem a recusa, continua a haver código 9, mas o ensaio fica vermelho porque houve um push simulado: `plantas-correcao.log`, planta `main-sem-recusa`, código 1.
3. **Mensagem obrigatória em fundir (achado 7).** O cliente recebe `fundir.sh <main|master> <mensagem>` ou `fundir.sh <main|master> -F <ficheiro>`. O escrivão exige título com fusão e data válida em DD.MM.AAAA, autoria e, no sítio, `Claude-Session`, sem travessões. Passa a mensagem inteira a `git merge -m`. A validação comum da mensagem também serve `comitar`, incluindo a linha de sessão no sítio e as duas formas de travessão; esta é a alteração por arrasto necessária para manter as mesmas regras. O resultado distingue avanço rápido, ausência de alterações e commit de fusão. `test_fusao_sem_avanco_rapido` confere pais e mensagem completa, incluindo os trailers; `test_protocolo_cliente_e_batimento` prova o cliente, o ficheiro de mensagem e o avanço rápido sem commit novo. `test_mensagem_sem_trailer_recusada_antes_de_fundir` exige recusa antes de qualquer processo Git, cabeça e bytes conservados. `test_regras_da_mensagem` cobre sessão, título, data, travessões e a exceção da sessão no motor. As cópias sem validação e com `--no-edit` ficam vermelhas, ambas com código 1: plantas `fusao-sem-validacao` e `fusao-sem-mensagem`.
4. **Conflitos distintos de modificações (achado 4).** A mesma fusão altera `.gitignore` sem conflito e conflita em `linha`. A consulta usa `git diff --cached --name-only --diff-filter=U`: o ficheiro integrado sem conflito está no índice, não na diferença entre o índice e os ficheiros de trabalho. `test_conflito_aborta_e_repoe_bytes` exige só `linha` e repõe cabeça, estado e todos os bytes, incluindo o ficheiro não seguido. Na planta `conflitos-M`, o resultado medido é só `.gitignore`, em vez de `linha`, e o ensaio falha com código 1. Não são os dois ficheiros previstos no mandato: no índice, M exclui o conflito U; a distinção que se queria provar fica demonstrada pela lista errada registada.
5. **Teto da espera pela tranca (achado 11).** A espera usa relógio monotónico, teto de 60 minutos e aviso inicial repetido a cada cinco minutos. Esgotado o teto, sai a 75, grava dono, teto e duração no passo `tranca` de `aterragem.json`, preserva a tranca alheia e não publica. `test_tranca_sempre_fresca_tem_teto` mantém o batimento em paralelo e encurta o teto para um segundo por `OEDP_ENSAIO_TRANCA_TETO`, variável reservada ao ensaio e que não permite ultrapassar 3 600 segundos. `test_teto_padrao_e_avisos_de_cinco_em_cinco_minutos` mede 3 600 segundos e 12 avisos num relógio simulado. Na planta `tranca-sem-teto`, o processo não termina dentro dos cinco segundos permitidos pelo ensaio; este fica vermelho com `TimeoutExpired` e código 1, sem deixar o processo a correr.

As cinco plantas correram apenas em cópias temporárias. `plantas-correcao.log` guarda cada substituição exata, os sha256 do guião original e da cópia alterada, o comando, a falha e o código medido. O executor das plantas terminou a 0 porque todas deram o vermelho previsto. Os caminhos locais foram substituídos antes de guardar os registos.

| Conferência | Código | Prova |
|---|---|---|
| `python3 -m unittest discover -s tests/leituras -p 'ferramenta_*.py' -v`, por `curto.sh` | 0 | `ensaios-correcao.log`: 29 ensaios em 30.860 segundos |
| Cinco plantas em cópias, por `curto.sh` | 0 no executor; 1 em cada planta | `plantas-correcao.log` |
| `python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`, por `curto.sh` | 0 | `mapa-correcao.log`; achado 17 corrigido de linha 2 para linha 1 |
| `sh -n scripts/leituras/fundir.sh scripts/leituras/aterrar.sh` | 0 | Sintaxe dos clientes |
| `git diff --check` | 0 | Espaços conferidos antes do commit |

Os Minor 9, 10, 12, 13, 14, 15 e 16 ficam para a higiene semanal, sem correções adicionais nesta passagem. O custo semanal continua a cargo do lançador; não está disponível uma linha `tokens used` durante esta escrita.

Recibo final: `portoes-final.json` confirma a cabeça `e7d20ccb9bc504a19846b9d1b7a05ce15847122f` no início e no fim, árvore limpa e build código 0 em 220 segundos, verify código 0 em 340 segundos, typecheck código 0 em 1 segundo, lidos dos ficheiros da corrida pelo escrivão. O commit do recibo contém apenas esse ficheiro e esta linha; a cabeça conferida é a do commit anterior e o recibo não muda código.
