És o construtor da passagem de correção **F2.2c** do bloco F2.2b do projeto O Estado do País: as corridas prontas a armar. O sítio é Astro e o motor é Python. O Codex (gpt-6-astra) construiu o F2.2b; o Claude Opus 5.5 leu-o a frio e achou as cinco plantas e defeitos reais; o lugar de direção (Claude Fable 5.1) fez a triagem e fixou as decisões abaixo. Esta passagem corrige o que a triagem mandou e mais nada.

Trabalhas em duas worktrees, e em nenhuma outra árvore:
- a do motor, `<worktree do motor>`, no ramo `f22b-2026-09-28` (cabeça `5335e12`);
- a do sítio, `<worktree do sítio>`, no ramo `f22b-2026-09-28`, onde o lugar de direção já juntou `main` (cabeça `22510cd9`, mais o commit da leitura e deste prompt).

Nunca `git checkout` noutra árvore, nunca `push`, nunca `git add -A` nem `git add .`: só caminhos explícitos. Usa `git -C <worktree>` e caminhos absolutos. Prosa nova em português (Acordo Ortográfico), sem travessões. **Nenhum ficheiro que escrevas leva um caminho da máquina nem o nome do utilizador da máquina.**

## O que lês primeiro

1. No sítio: o brief `design/observatorio/BRIEF-F22b-as-corridas-prontas-a-armar.md`, inteiro; a leitura a frio `design/especime-v3/critica/LEITURA-f22b-2026-09-29.md`, com a triagem no cabeçalho; o teu relatório `design/especime-v3/medicoes/f22b-2026-09-28/LEIA-ME.md`; e `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`.
2. No motor: o diff do ramo contra `master` (`git -C <worktree do motor> diff master...HEAD`) e os ficheiros que cada ponto abaixo nomeia.

## O teste de aceitação, dito antes

Feito quer dizer:
- cada ponto abaixo feito, com a sua planta a morder e o controlo a passar;
- o portão do motor (`python3 -m core.gate`) a 0 na cabeça final do motor;
- os três portões do sítio (`npm run build`, `npm run verify`, `npm run typecheck`) a 0 na cabeça final do sítio, cada um no seu comando, com o código escrito num ficheiro em `design/especime-v3/medicoes/f22b-2026-09-28/portoes/f22c/` depois de o processo acabar, e a cabeça guardada ao lado;
- a secção F2.2c no relatório e a resposta curta;
- nenhum segredo, caminho da máquina ou nome do utilizador em ficheiro nenhum.

## O mandato

**0 · O `master` do motor entra no ramo.** O commit `68318e0` (C1e) muda `indicators/refresh.py`: acrescenta `transporte_por_classificar` e muda o `probe` e o `get`. Junta `master` ao ramo do motor com `git merge`. O conflito em `refresh.py` resolve-se a conservar as duas coisas: a classificação do transporte da C1e e o que o F2.2b acrescentou para a retoma. As plantas das duas mordem: `indicators/refresh_rede_real_test.py`, `indicators/rotinas_test.py` e o `provar_fluxo.py`.

**1 · A poda das quatro reconferências volta (o achado 8).** A §1.92(2) vale: uma linha guarda as últimas quatro reconferências, e a história inteira vive no índice do arquivo.
- `OEDP_CONSERVAR_VERIFICACOES` sai de todo o lado: `refresh.py`, `painel.py`, `painel.yml`, `corredor.yml` e os testes.
- A guarda das linhas (`guarda_linha` em `publicar_rotina.py`) aceita uma linha se e só se existir uma lista não vazia `novas` de entradas desta corrida tal que `vd == (va + novas)[-MAX_VERIFICACOES:]`. As entradas novas conferem-se como hoje: os campos, a data do dia, o autor e o endereço. `MAX_VERIFICACOES` importa-se de `indicators/refresh.py`, que fica a única fonte.
- Tudo o resto recusa-se: uma entrada antiga reescrita, uma apagada fora da poda das mais velhas, uma poda abaixo do limite, uma reordenação.
- Plantas:
  - uma linha com quatro reconferências e uma nova, podada a quatro (aceite);
  - uma linha antiga com seis e uma nova, que fica com quatro, como `append_verification` a deixa (aceite);
  - uma entrada antiga reescrita (recusa);
  - uma poda a mais (recusa).
- A célula 13 do corredor continua a exigir no máximo quatro.

**2 · A espera pelo portão (os achados 6 e 12).**
- Verde só com a conclusão `success`.
- As plantas dão ao próprio `esperar_portao`, por um dublê da API e não por uma função posta no seu lugar, uma corrida que corresponde ao SHA, ao ramo, ao evento e ao caminho e que acabou. Com `success` dá verde. Com `failure`, `cancelled`, `timed_out`, `skipped`, `action_required`, `startup_failure`, `neutral` e `stale` dá vermelho, com a conclusão na razão.
- Os erros da API dizem a sua causa. A espera guarda o último erro (o estado HTTP e a mensagem):
  - um 400, 401, 404 ou 410 param logo, com a causa;
  - um 403 ou 429 de limite, um 5xx ou uma falha de rede repetem-se dentro do teto;
  - esgotado o teto, a razão diz o último erro.
  - Uma planta por classe.
- O cabeçalho `X-GitHub-Api-Version: 2026-03-10` fica. O lugar de direção leu a página a 29.09.2026 às 21:03 UTC, com o estado 200: `https://docs.github.com/en/rest/about-the-rest-api/api-versions`. A página dá «2026-03-10 (latest)» entre as versões suportadas, «Requests without the X-GitHub-Api-Version header will default to use the 2022-11-28 version.» e «If you specify an API version that is no longer supported, you will receive a 410 Gone response.». O endereço, a hora e os excertos entram nas provas, e o comentário do código cita-os.

**3 · A reforma dos agentes (o achado 7).** `reformar_agentes.main` com `--aplicar` chama `provar_corridas` antes de qualquer `launchctl`. As plantas correm o próprio `main` com `--aplicar`, sobre definições sintéticas numa pasta temporária, com um `launchctl` de dublê que regista as chamadas:
- sem prova, com a prova de uma só corrida, com identificadores repetidos, e com um ensaio no lugar de uma corrida real: recusa, com zero chamadas ao dublê;
- com a prova certa: as chamadas esperadas, pela ordem, e o arquivo conferido byte a byte antes de apagar.

**4 · A guarda antes de qualquer `push` (o achado 13).** O repositório do sítio é público, e o brief põe a guarda antes do `push`. A ordem nova de `publicar()`:
1. `fetch`;
2. a guarda contra `main`;
3. se recusar, o candidato não sai da corrida: o diff fica como artefacto da corrida do motor, que é privado, e a issue no motor diz porquê e liga a corrida;
4. se passar, o ramo datado, o portão, a segunda guarda contra o `main` do momento, e o avanço.

As plantas:
- uma mudança de valor: recusa, zero `push`, o artefacto e a issue;
- o caminho verde: dois `push`, o mesmo SHA.

Os fluxos que chamam `publicar()` (o corredor e a retoma) ganham o passo que guarda o artefacto. O comentário do código e os documentos dizem esta ordem.

**5 · O vigia das rotinas (o achado 10).**
- Uma corrida devida que correu dormente não é um alarme. Reconhece-se pelos trabalhos da corrida, lidos na API: o trabalho real está `skipped`. O vigia diz que ela correu dormente e fica à espera da próxima.
- Um alarme por rotina e por data devida. O título leva a rotina e a data (por exemplo «O vigia não confirmou o painel de 2026-10-05»). Antes de abrir, o vigia procura uma issue aberta com esse título e não abre outra.
- Plantas:
  - a corrida devida dormente: sem issue;
  - a mesma corrida falhada em dois dias seguidos: uma só issue;
  - a corrida que falta: uma issue;
  - a corrida verde com o carimbo: sem issue.

**6 · O despacho à mão do vigia volta a correr sempre (o achado 16).** O F2.1 decidiu que ele corre sempre, «para que se possa pôr o vigia à prova sem esperar pelo interruptor».
- Vale para o corredor e para as duas rotinas novas.
- Só a corrida agendada respeita o interruptor.
- O `provar_fluxo.py` volta a esperar que um despacho desarmado corra.
- O comentário do `vigia.yml` volta a dizê-lo.

**7 · O limiar (o achado 11).**
- Só o silêncio de rede (sem resposta) conta como calado e se repete noutro runner.
- Uma resposta HTTP de erro, ou uma página sem números, é um achado com a sua causa: o estado HTTP, ou que a página não tem números. Não se repete, e chega à issue com a causa mesmo com a severidade `notice`.
- O limiar não bloqueia o carimbo das linhas, nem calado nem com erro. É o que faz o painel do portátil: em `refresh.py`, um limiar ilegível é um aviso, e o carimbo escreve-se. `inteira` deixa de depender do limiar, e o que falhou nele vai à issue.
- Plantas:
  - um 503: o achado com o estado, sem retoma, com o carimbo escrito;
  - uma página sem números: o achado, com o carimbo escrito;
  - um silêncio de rede: repete-se noutro runner.

**8 · O varrimento do portátil faz exatamente o que fazia (o achado 17).** O agente do portátil corre o `sweeps/monthly.sh` de `master` a 01.10.2026 às 09:00, na hora da máquina. O que aterrar antes disso tem de lhe dar o mesmo resultado.
- Sem argumentos, o guião corre os mesmos passos, pela mesma ordem, com `core.sweep --write` e `core.describe --quiet`.
- O relatório `sweeps/sweep-AAAA-MM-DD.md` fica onde sempre esteve.
- O código de saída é o do guião antigo: o do calendário, se falhou; senão, o do vigia das publicações.
- A pasta do sítio, sem argumentos, continua a ser `OEDP_SITE` ou o repositório irmão. O README do motor di-lo como a compatibilidade do portátil até à reforma.
- O caminho do runner também passa `--write` e `--quiet`, e mantém a sua própria regra de saída, escrita no README.
- Plantas: a lista dos passos e das bandeiras sem argumentos, conferida contra a do guião antigo (lida de `master`); e o código de saída nos dois casos.

**9 · O modo pelo ambiente (o achado 15).** O modo que o trabalho `modo` decide passa pelo ambiente ao passo de publicação no corredor e na retoma, como no painel, em vez de `MODO=real` escrito na linha.

**10 · As plantas que faltam (os achados 14 e 18).**
- O ramo `fontes.mjs` de `guarda_estado`, incluindo `valoresNovos` diferente de zero e uma exportação a mais.
- Um ficheiro criado, um apagado e um com o modo mudado: cada um recusado.
- O `main` de `publicar_rotina` e o de `fechar_painel`, com um despacho e com um modo que não é o real: recusa.
- A guarda corrida sobre os ficheiros reais do sítio na cabeça do ramo: `src/data/verificacao.mjs` e `src/data/fontes.mjs` lidos por `dados_js`, e um diff plausível de uma corrida, aceite.
- O teste de `decisoes.py` prova também que `OEDP_SITE` é aceite: código 0 sobre um sítio sintético.

**11 · As medidas ditas como são (os achados 9, 19, 20 e 23).**
- O `medidas.json` não apresenta constantes como medidas. Os quatro zeros dos efeitos externos passam a uma secção `declaracoes`, dita como declaração do construtor. O lugar de direção mede à parte, na aterragem, os interruptores e as corridas despachadas.
- Cada afirmação do relatório que o pacote não prova ganha o comando e a saída, ou sai do relatório. São elas: o §0 reproduzido (com o código e a hora); a conferência de que nenhuma outra construção corria antes de cada portão; os ensaios de isolamento (o comando e o ambiente, sem valores secretos); e a reparação do `core.bare` e das opções locais do git.
- O `medir.py` deixa de afirmar a conferência das mudanças posteriores aos portões. Fá-la o lugar de direção na aterragem, entre a cabeça dos portões e a final.
- O `core-inicial.log`, e qualquer registo do pacote com a disposição de pastas da máquina (`<caminho-local>`), passam às marcas dos outros (`<worktree do sítio>`, `<worktree do motor>`).
- O `medir.py` procura caminhos pessoais em todos os ficheiros do pacote, com um conhecido-positivo.

A linha do F2.2b no registo das melhorias é agora a M41, renumerada pelo lugar de direção. Se lhe mexeres, fica M41. O §2 da frescura ficou na forma de `main`, e não lhe mexes.

## O que não se faz

É o §3 do brief, à letra:
- nenhum segredo criado, lido ou escrito;
- nenhum interruptor posto a `sim`;
- nenhum agente do `launchd` tocado;
- nenhuma corrida despachada;
- nenhuma mudança às páginas do sítio;
- nenhum `push`.

Os ficheiros do motor que não se tocam continuam a não se tocar: `indicators/*.json` na raiz, `indicators/vintages.json`, `.maintenance-locks/`, `publisher/recortes/manifest.regioes.json`, e `sweeps/`, salvo `sweeps/decisoes.py` e `sweeps/monthly.sh`.

## As regras de trabalho

- **A regra de paragem.** Só um portão que protege um número, uma fonte ou uma pessoa te faz parar. Se, ao medir, achares que uma decisão acima está errada num ponto: medes, dizes, paras nesse ponto e fazes os outros.
- **Commits pequenos, por caminhos explícitos.**
  - No motor, o trailer `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>`. O pre-commit corre `python3 -m core.gate`, cerca de dois minutos e meio.
  - No sítio, os trailers contíguos `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g`.
- **Uma construção de cada vez na máquina.** Outro construtor corre portões noutra worktree do sítio ao mesmo tempo. Antes de cada corrida inteira do sítio, `pgrep -fl "astro build|npm run verify|npm run build"`, e esperas se houver outra.
- **O relatório escreve-se também quando paras a meio.** A secção F2.2c leva:
  - a tabela destes pontos, com a medida de cada um;
  - as plantas;
  - os commits dos dois repositórios;
  - os códigos dos portões, lidos de ficheiro;
  - o custo em símbolos e segundos.
- **A resposta curta** vai em `design/especime-v3/medicoes/f22b-2026-09-28/RESPOSTA-construtor-f22c.md`, no sítio, e entra no último commit. A tua última mensagem desta sessão vai para fora do ramo.
- Um relatório nunca afirma comunicações com o diretor.

## No fim

Respondes com:
- as cabeças finais dos dois ramos e os commits;
- o caminho do relatório;
- as saídas dos portões, lidas dos ficheiros;
- o que ficou por fazer.
