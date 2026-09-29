A passagem **F2.2d**: retomas a mesma sessão para corrigir o que a releitura a frio da F2.2c achou. A releitura foi do Claude Opus 5.5 e achou as cinco plantas. Está no sítio, em `design/especime-v3/critica/LEITURA-f22c-2026-09-29.md`, com a triagem do lugar de direção no cabeçalho. Lê-a inteira antes de começar.

As regras de sempre, as da F2.2c:
- as duas worktrees e mais nenhuma árvore; caminhos explícitos; nenhum `push`;
- uma construção de cada vez na máquina: antes de cada corrida inteira do sítio, `pgrep -fl "astro build|npm run verify|npm run build"`, e esperas se houver outra; outro construtor pode estar a construir noutra worktree;
- os mesmos trailers: `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>`, e no sítio também `Claude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g`;
- nenhum segredo, caminho da máquina ou nome do utilizador em ficheiro nenhum;
- o que não se faz é o §3 do brief, à letra.

## O mandato

**1 · O que impede a aterragem (o achado 11).** As plantas do varrimento leem o guião antigo com `git show master:sweeps/monthly.sh`. A corrida `portao` do motor não tem um `master` local: é o `actions/checkout` sem `fetch-depth` nem outras referências. Assim, o `core.gate` ficaria vermelho no GitHub no primeiro `push` de um ramo, e vazio num `push` a `master`.
- O guião antigo passa a ser uma cópia fixa ao lado do teste, lida de `68318e0`, com o seu sha256 conferido pelo próprio teste.
- A prova corre também num clone raso do ramo do motor, sem `master` local, como o GitHub o faz: `git clone --depth 1 --branch f22b-2026-09-28 file://<worktree do motor> <pasta temporária>`, com o `core.gate` ou o teste do varrimento lá dentro. A saída e o código vão para as provas.

**2 · O varrimento do portátil (os achados 3 e 12).**
- O caminho sem argumentos imprime os cinco cabeçalhos do guião antigo, com o mesmo texto e nos mesmos sítios, incluindo o do calendário que falhou.
- Encontra a sua pasta sem o `git`, pela pasta do próprio guião.
- A planta compara as linhas `python3` e as linhas `echo` com as da cópia fixa do guião antigo.

**3 · O relatório dá o bloco inteiro (o achado 5).** O mandato da F2.2c só mandava sair o que não tinha prova. O `LEIA-ME.md` volta a ter, para o bloco todo, o F2.2b, a F2.2c e esta passagem:
- a tabela do mandato do brief, os pontos 1 a 6, com a medida de cada um no estado corrigido;
- as plantas;
- todos os commits dos dois repositórios, incluindo `01362b78` e `77d9e407` no sítio;
- os portões;
- o custo do bloco inteiro: a construção, a retoma, a F2.2c e esta, cada uma com o seu contador.

O texto de `77d9e407` serve de base, sem as afirmações que a primeira triagem achou sem prova e com cada comportamento já corrigido. As secções F2.2c e F2.2d ficam depois.

**4 · A recusa e o TLS num runner (o achado 7).** Ficam como estão, e passam a estar ditos e provados. Num runner do GitHub, uma ligação recusada e um erro de TLS contam como «sem resposta» e repetem-se noutro runner, nas linhas e no limiar. O INE já bloqueou IPs de runners: a I116 do sítio regista uma noite com a ligação «recusado», a 03.09. Escrever «inacessível» por isso seria falso.
- É uma regra diferente da do portátil (a C1e), de propósito. O comentário do código di-lo, com a I116.
- As plantas da recusa e do TLS passam a existir, nas linhas e no limiar.

**5 · O limiar (os achados 8, 10 e 14).**
- O silêncio do limiar guarda-se à parte dos anfitriões das linhas. `inteira` não depende dele, mesmo que um dia uma linha esteja no mesmo anfitrião. A planta põe uma linha no anfitrião do limiar.
- Uma retoma que lê o limiar tira o aviso do silêncio da tentativa anterior: a issue não diz «sem resposta» de um limiar que foi lido. Há planta.
- As três mensagens do limiar do portátil e o comentário da I115 voltam, com o texto de `master`: quem os lê é a revisão de segunda-feira. A classificação do painel do GitHub vive só no ramo `para_retoma`. O comentário que cita «unreachable» fica verdadeiro.

**6 · As plantas e as provas que faltam (os achados 9, 15, 16 e 17).**
- Uma linha com quatro reconferências e uma nova, sem poda (cinco ao todo): recusa.
- A célula 13 do corredor: corre-a e guarda a saída e o código nas provas, ou tira a afirmação do relatório.
- O comentário da versão da API diz de quem é cada leitura. A do lugar de direção, às 21:03 UTC, com o estado 200, dá «2026-03-10 (latest)». A tua dá a tabela com 2026-03-10 entre as versões suportadas, sem a palavra «latest», e fica com a hora e o excerto. Nenhuma se apresenta como confirmação da outra.
- As cabeças dos registos de execução dizem onde o código correu. Uma corrida sobre a junção por registar di-lo, com a árvore. O `medidas.json` descreve o commit do relatório como ele é.

**7 · O prompt do lugar de direção (o achado 13).** `prompts/PROMPT-f22c-construtor.md` volta ao texto que o lugar de direção escreveu, que é o de `fb1dd0dd`. O detetor do `medir.py` deixa de contar o exemplo com reticências (`<pasta-pessoal>/...`), que não é um caminho, e o relatório di-lo. Os prompts do lugar de direção não se mudam; um problema com eles diz-se.

## No fim

- O `core.gate` a 0 na cabeça final do motor.
- Os três portões do sítio a 0 na cabeça final do sítio, em `portoes/f22d/`, cada um no seu comando, com o código escrito num ficheiro e a cabeça ao lado.
- A secção F2.2d no relatório.
- A resposta curta em `design/especime-v3/medicoes/f22b-2026-09-28/RESPOSTA-construtor-f22d.md`, no último commit.
- Respondes com as cabeças dos dois ramos, os commits, as saídas dos portões lidas dos ficheiros e o que ficou por fazer.
