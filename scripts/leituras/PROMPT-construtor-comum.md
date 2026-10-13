# As regras comuns a todas as passagens do Codex construtor (13.10.2026, §1.190)

O lançador (`scripts/leituras/construir-codex.sh`) põe este texto à frente do prompt de cada passagem. O que ele diz vale para todas; o prompt da passagem diz o que esta faz.

## Os commits

Não corres `git add` nem `git commit`: o `.git` é só de leitura na tua sandbox e cada pedido de escalada custava uma revisão automática que lia a sessão inteira. Comitas por `sh scripts/leituras/comitar.sh "<mensagem>" <ficheiro> [<ficheiro>...]` (ou `-F <ficheiro com a mensagem>`), que entrega o pedido ao escrivão do lançador e espera pelo resultado numa só chamada. Só ficheiros, em caminhos relativos à raiz da worktree em que o corres: nunca pastas, nunca `.`, nunca `-A`. A mensagem leva os trailers: `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e, no repositório do sítio, a linha `Claude-Session:` que o prompt da passagem dá; no motor só o `Co-Authored-By`. Os hooks correm no commit (no motor, o `core.gate` do pre-commit, cerca de dois minutos e meio): o resultado traz as suas últimas linhas, e um hook vermelho é um commit recusado que corriges antes de repetir o pedido. Um ficheiro apagado comita-se listando-o. Nunca `git push`, nunca `git checkout` fora das worktrees em que foste lançado, nunca `--force`, nunca `git stash`.

## Os portões, os testes e as saídas longas

Os três portões do sítio correm por `sh scripts/leituras/portoes.sh <worktree absoluta> <pasta de saída nova>`, que escreve os códigos em ficheiros: lês `build.codigo`, `verify.codigo` e `typecheck.codigo`, e os registos só por `grep` ou `tail`. Qualquer outro comando que possa imprimir mais do que sessenta linhas (um `npm run check:*`, um `python3 -m pytest`, um `python3 -m core.gate`, um `npm run build`, uma medição) corre por `sh scripts/leituras/curto.sh <registo> <comando...>`, que guarda a saída inteira no registo e imprime o código, a duração, as linhas de falha e as últimas oito; quando precisares de mais, `grep -n` no registo. Os comandos longos correm em primeiro plano, com o tempo limite da ferramenta até trinta minutos; se tiveres de pôr um em segundo plano, esperas por ele numa só chamada (`for i in $(seq 1 90); do [ -f <ficheiro do fim> ] && break; sleep 20; done`), nunca com `sleep` repetidos em turnos separados.

## A leitura dos ficheiros

Nunca imprimes um ficheiro inteiro com mais de duzentas linhas: `grep -n` para encontrar, `sed -n 'a,bp'` para ler intervalos até cento e vinte linhas, `git diff --stat` antes de `git diff`, `git log --oneline -5`. O mapa do repositório (`design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`) lê-se pelas secções que o prompt da passagem nomeia, não de uma ponta à outra. O que já leste não voltas a imprimir.

## O que nunca entra num ficheiro

Nada pessoal, nenhum segredo, nenhum caminho desta máquina nem o nome do utilizador, em ficheiro nenhum dos dois repositórios: nos registos escreves `<worktree>`, `<motor>` ou `<temporario>` no lugar de um caminho. Nenhum número que não tenhas medido; o que não se confirmou na fonte diz-se como ausência, nunca como frase plausível. Prosa nova em português do Acordo Ortográfico, sem travessões.

## Quando a sandbox recusa

Se um comando falhar por permissão da sandbox, não pedes escalada (não há quem a aprove): procuras o caminho dentro destas regras (o escrivão para os commits, `/tmp` ou a pasta de saída para ficheiros temporários, a pasta com escrita para o resto) e, se não houver, anotas no relatório o que ficou por fazer e porquê. O `node_modules` da worktree do sítio já está instalado dentro dela pelo lugar de direção: não corres `npm ci` nem `npm install`. Quando a passagem toca o motor ou aloja fontes, o lançador liga a rede da sandbox, e as suites do motor que abrem servidores locais correm; se uma suite falhar por permissão mesmo assim, anota a mensagem exata e segue.

## O relatório

No fim respondes com o que o prompt da passagem pede, mais a linha «tokens used» se a vires. O custo em pontos da semana mede-o o lançador, antes e depois da passagem, e não precisa de ti.
