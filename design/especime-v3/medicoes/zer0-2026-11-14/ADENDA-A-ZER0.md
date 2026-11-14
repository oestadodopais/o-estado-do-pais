# Adenda A do ZER0: seis frases revistas pela leitura a frio, e dois reparos pequenos (14.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `zer0-2026-11-14`; a outra pasta com escrita é a worktree do motor `zer0-2026-11-14`, e só lhe mexes se um ponto o obrigar, dizendo o quê. Uma construção normal: setenta e cinco minutos e cento e vinte chamadas; não lances sessões auxiliares, não corras o portão inteiro do motor nem a lista inteira do `verify`. Um commit no fim de cada ponto numerado, com o assunto a começar por `ZER0`. O teu relatório vai para `RELATORIO-ZER0-A.txt`, nesta pasta, com doze linhas no máximo; os registos para `zer0-a-conferencias/`, nesta pasta, só os códigos e as últimas vinte linhas de cada um, sem caminhos da máquina. Lê `FOLHA-zer0-adenda-A.md`, nesta pasta: cada frase nova é a da folha, letra por letra.*

## Porquê

A leitura a frio do bloco (Claude Opus, cinco plantas em cinco) achou que três descrições das linhas do Plano de Recuperação e Resiliência de Évora dizem a listagem duas vezes, que uma se lê como se o concelho tivesse sido pago, que a página das regiões ficou sem dizer em palavras simples o que é um valor abaixo de cem, que no recibo do empréstimo a ligação para repetir a leitura abre a página antiga, e que o guião que confere o HTML não compara as frases do empréstimo com a folha. O Codex julgou as seis frases novas antes desta adenda (o juízo está resumido no cabeçalho da folha).

## §0 O que se mediu

As cinco descrições estão em `src/data/o-que-e-das-familias.mjs` (as entradas `evora-prr-aprovado`, `evora-prr-execucao`, `evora-prr-pago`, `evora-prr-vencido-aprovado` e `evora-prr-vencido-quota`), com o texto de hoje que a folha transcreve, e a lista das leituras dos cartões em `tests/cartao/` prende-as. A frase das regiões é o campo `significadoV` de `home.instr1` em `src/i18n/strings.mjs`, nas duas edições. No recibo construído do empréstimo há duas ligações para o relatório: a da prova abre a página 99 e a de repetir a leitura abre a página 84, que vem do caminho da verificação de 01.09.2026. O guião `conferir-zer0.mjs`, nesta pasta, lê a razão da correção do empréstimo da própria linha e procura-a no HTML construído dessa linha.

Outras medidas publicadas da mesma coisa: nenhuma; não entra número novo.

As listas fechadas que este ponto faz mexer: as leituras provadas dos cartões (cinco descrições nas duas edições), o inventário das frases e o dos rótulos se as contarem. Mede cada uma antes e depois.

## O que fazes

1. **As cinco descrições** (A1 a A5 da folha), nas duas edições, com as leituras provadas a acompanhar. Confere no HTML construído dos cinco recibos, nas duas edições, que cada descrição nova está, seguida da data do instantâneo como antes, e que a antiga não está.

2. **A caixa das regiões** (A6 da folha): a segunda frase da folha acrescenta-se à primeira, no mesmo campo, nas duas edições. Confere no HTML construído das duas páginas.

3. **O recibo do empréstimo.** A ligação de repetir a leitura abre a página que a linha cita (a 99), e não a página de uma verificação anterior à correção. É uma regra do recibo, para qualquer linha cuja página citada mudou depois da última verificação: mede quantas linhas estão nesse caso, corrige a regra, e uma planta mostra que morde. O histórico das verificações, com a frase de que a releitura confirmou o valor anterior, fica como está, porque é verdade.

4. **O guião `conferir-zer0.mjs`.** Para o empréstimo, as cadeias esperadas (o excerto e a razão da correção nas duas edições) passam a vir da folha decidida, escritas no guião, e não da linha; uma planta em memória (a razão com dois euros em vez de um) tem de o fazer recusar. Estende-o às seis frases desta adenda.

5. **A prova.** O `build` a zero; `check:cartao`, `check:leituras`, `check:frases-afirmacao` com o motor e como a corrida do GitHub o corre (`env -u RESEARCHHUB_DIR GITHUB_ACTIONS=true`), `check:frases-reais`, `check:rotulos`, `check:voz`, `ledger:check`, `check:incorporar`, o `typecheck`, e o guião do ponto 4, cada código lido de um ficheiro.

## O que fica como está, por decisão

Os nomes das linhas (os da folha decidida do bloco). O estado «por confirmar na fonte» das somas sobre o ficheiro do plano, que é do bloco seguinte. As datas de leitura das linhas eleitorais. Tudo o que o bloco já construiu e esta adenda não nomeia.

## Quando paras

Só pelo que protege um número, uma fonte ou uma pessoa. Se uma frase da folha não couber numa régua, não a mudes: pára nesse ponto, diz qual é a régua e o que recusa, e faz os outros.

## O fim

Os cinco pontos, cada um no seu commit, e o relatório: o que mudou para o leitor, as listas com o antes e o depois, quantas linhas tinham a ligação de repetir a leitura a abrir outra página, os códigos.
