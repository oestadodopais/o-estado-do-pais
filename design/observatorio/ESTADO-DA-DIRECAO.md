# O estado da direção · ler primeiro em cada sessão

*Escrito pelo lugar de direção (Claude Fable 5.2) a 10.11.2026, por palavra do financiador: uma sessão nova tem de saber tudo o que a anterior sabia, sem que nada fique por olhar. Este ficheiro é a fotografia; o `CLAUDE.md` são as regras; o `DECISIONS.md` é a história. **Atualiza-se no fim de cada bloco e antes de fechar uma sessão**, a secção 4 inteira e a data aqui: **estado de 11.11.2026, 13:20 UTC**. Sem travessões. O diário de trabalho com os caminhos da máquina e os comandos de retoma está fora do git, em `.claude/direcao/` na árvore principal do sítio.*

## 1. O que o financiador quer, pela ordem dele

1. **Nada errado no sítio.** Corrigir primeiro o que está publicado; nenhum erro novo chega ao ar.
2. **Salvaguardas robustas e eficientes,** que apanhem os erros antes de irem para o ar.
3. **Textos melhores:** a leitura independente de uma inteligência artificial sobre os documentos todos. O que se passa, o que foi feito, o que isso faz às pessoas, aos serviços e às cidades, se foi bem ou mal feito, o quadro inteiro. Com o rigor de um jornal profissional.
4. **Um ritmo diário vivo:** a vigilância das notícias de manhã, a caixa das sugestões, e o que merecer coberto no mesmo dia.
5. **Custo e rapidez:** uso eficiente das subscrições e a mudança pronta no ar o mais depressa possível.
6. **Um Método legível** (com a cadeia mostrada, talvez animada) e a qualidade medida e a melhorar.

O financiador é o primeiro leitor e tem pouca experiência técnica: fala-se-lhe em inglês simples, com decisões e resultados, nunca com perguntas de processo. Decide o lugar de direção; dele são só o dinheiro e as subscrições, a exposição legal, o correio para fora e o que é destrutivo ou irreversível. A 10.11.2026 disse ainda: **as regras herdadas não são para manter por existirem; o lugar de direção questiona tudo e traz a melhor alternativa, com medida.**

## 2. O que se decidiu e está em vigor (além do `CLAUDE.md`, que ainda não o diz)

- **O lugar de direção é o Claude Fable 5.2** desde 09.11.2026 (o `CLAUDE.md` ainda diz 5.1).
- **O recomeço:** até ao lançamento o sítio é uma edição de ensaio (a marca em todas as páginas, `noindex`, o registo das correções a contar do lançamento). No ar desde 10.11.2026 (REC1). Uma página só entra no lançamento depois de auditada por outra família. A data do lançamento é do financiador; a recomendação deste lugar é lançar quando os quatro estudos de Évora e os três nacionais mais fortes tiverem passado.
- **A norma editorial** (`NORMA-EDITORIAL-2026-11-10.md`, nesta pasta): a resposta à cabeça; «O que concluímos» com factos; «O que está bem, o que está mal»; «Para quem»; as afirmações com veredicto; «A nossa leitura» dita uma vez como nossa; recomendações; o que vigiar; limites no fim; 4 000 palavras no máximo num estudo e 900 num item.
- **A regra de publicação:** as fontes guardam-se primeiro; os números entram pelo livro-razão; a análise escreve-a o Fable a `xhigh`; o texto inteiro é julgado por outra família contra as cópias das fontes, com plantas de sentido, antes de se construir; o que foi julgado é o que se publica, aplicado e conferido por guião (`core.texto_julgado` no motor); todos os meses uma amostra auditada, com a taxa de erro publicada.
- **Regras mudadas a 10.11.2026** (por escrever no `CLAUDE.md` e numa decisão nova do `DECISIONS.md`):
  - o orçamento de uma passagem de construtor declara-se no mandato pelo tamanho (correção: 30 minutos e 60 chamadas; construção normal: 75 e 120; construção grande: 150 e 240, com `CODEX_TETO_SEGUNDOS`), com um commit no fim de cada ponto numerado;
  - as regras de paragem de um mandato só para o que protege um número, uma fonte ou uma pessoa; para o resto, «deixa, diz e continua»;
  - o relatório do construtor e o resumo do lançador têm nomes diferentes; as medidas do construtor nunca vão para o ficheiro `Medidas:` do mandato;
  - a maquinaria que corta um gargalo medido não espera pela sexta-feira;
  - cada planta confere-se falsa na fonte antes de entrar; o prompt do juiz diz que uma atribuição não é uma frase sobre as fontes;
  - um valor lido de uma digitalização degradada confere-se na imagem da página;
  - as fontes de um estudo vivem na pasta `source/` do estudo no motor, seguidas pelo git;
  - duas construções podem correr ao mesmo tempo (uma no motor, outra no sítio): medido a 10.11.2026, sem conflito;
  - um bloco que muda todas as páginas corre a lista inteira do `verify` logo na primeira passagem.

## 3. O que está no ar

- `main` do sítio: `740595bbb` (o EVA, 11.11.2026, no ar desde as 04:40:55 UTC), sobre `ccca806e0` (REC1 e VEL1, 10.11.2026). `master` do motor: `247e604` (MOT1, MOT2 e o EVA, com a linha de 2021 a atravessar, 11.11.2026).
- Treze estudos vivos. Os seis de Évora substituídos deixaram de ter páginas com o REC2 (11.11.2026); os endereços antigos redirecionam para os sucessores.
- **O estudo das contas da Câmara de Évora está no ar com o texto julgado** (edição única de 11.11.2026), e a linha da execução da receita de 2021 vale 87,72. **Erros conhecidos que ainda estão no ar:** nos outros estudos de Évora, 230 erros reais achados em cinco estudos auditados, com listas julgadas; nas páginas inglesas do livro, os valores na forma portuguesa (EVA-9).

## 4. Em curso, bloco a bloco (atualizar sempre)

| Bloco | O que é | Estado a 11.11.2026, 13:20 UTC | O passo seguinte |
| --- | --- | --- | --- |
| **EVA** | o estudo das contas da Câmara de Évora reescrito pela norma e julgado em três voltas (44 plantas válidas em 44) | **aterrado a 11.11.2026, 04:40:55 UTC** (`740595bbb`; `aterrar.sh` com código 0; do último commit ao ar 32,5 minutos; o ar conferido por pedido direto: a manchete, «publicado a 11.11.2026», o recibo de 2021 com 87,72 e a frase da fonte anterior, a rota datada com 308 para o documento corrente): o motor em `247e604`; no sítio a travessia (nove pontos) e as adendas A, B e C; quatro leituras do Opus com cinco plantas em cinco; a corrida inteira por guião verde na cabeça `e83b0bcea` (72 passos); as capturas (80, cinco larguras, duas edições) no Drive; a decisão 1.239; o custo em `custo-eva-2026-11-11.json` (nove passagens, 26 pontos pelo contador da conta, partilhados em parte com o VEL1) | nada por fazer no bloco; a cópia deste ficheiro em `main` ainda diz «a aterrar» e acerta-se na aterragem seguinte; doze Minor (EVA-1 a EVA-12) para a higiene; o Google Doc do texto no Drive do financiador é anterior a três trocas pequenas |
| **VEL1** | a corrida `portão` em metade do tempo sem tirar uma conferência | **aterrado a 10.11.2026, 22:44 UTC** (`ccca806e0`), com as regras em linha (o `CLAUDE.md`, a decisão 1.238, este ficheiro, o arranque); a corrida do ramo em 25,2 minutos; a corrida de `main` dispensada pela do ramo em 22 segundos; do último commit ao ar 38,5 minutos, ainda com o guião de aterragem antigo | a aterragem seguinte usa o guião novo (as conferências com o motor durante a espera, a worktree tirada no fim): medir o tempo do commit ao ar; depois o VEL2 (publicar o `dist/` que o GitHub conferiu, sem construir duas vezes na máquina; encolher as plantas que correm o sítio inteiro) |
| **REC2** | os seis estudos de Évora substituídos deixam de ter páginas; os endereços antigos vão para o sucessor | **a aterrar a 11.11.2026** (a cabeça que aterra traz este registo): os oito pontos e a adenda A; duas leituras do Opus com cinco plantas em cinco; a corrida inteira por guião com um só vermelho, de um ficheiro de registo deste lugar, corrigido e reconferido; 38 redirecionamentos; o arquivo de 19 para 13 estudos; o título fora de ordem do estudo das contas corrigido; a decisão 1.240; o custo em `custo-rec2-2026-11-11.json` (11 pontos) | conferir o ar depois da aterragem (um endereço antigo com 301, o índice com 13); três Minor (REC2-1 a REC2-3) para a higiene |
| **EVB** | o estudo de Évora 2027 | a lista de correções julgada (125 entradas) | a análise do Fable pela norma, o texto inteiro ao juiz, a construção como o EVA |
| **IT0** | a cadeia geral dos itens diários (hoje só serve o Orçamento) | por mandatar; sobe na fila para logo depois do EVB | mandatar; o primeiro item por volta de 18.11.2026 |
| **EVC e FON1** | os estudos «quem governou» e «a economia e o dinheiro de fora» | auditados (54 e 62 erros reais), mas sem as fontes guardadas: metade ou mais dos números não se pode conferir | recolher e guardar as fontes (FON1); depois a cadeia inteira |
| **Os nove estudos nacionais e regionais** | orçamento de 2027, habitação, água (dois), economia regional, «which door is yours», Alentejo e Algarve, Portugal desde 1981, reforma antecipada | por auditar | primeiro uma revisão da carteira: ficar, fundir ou retirar cada um |
| **O Método e a auditoria mensal** | a página do Método a dizer o que corre de facto, com a taxa de erro medida; a amostra mensal | por fazer | depois de três estudos passarem pela cadeia |
| **A arrumação** | uma pasta única para o sítio, o motor, as worktrees e o arquivo; a aterragem tira a worktree do bloco | 91 GB libertados a 10.11.2026 | a mudança de pasta por guião, com conferência dos caminhos de que dependem o correio diário, os hooks, a aterragem e a memória do projeto |

## 5. O que este lugar prometeu ao financiador (10.11.2026)

- 11.11 (quarta-feira): o estudo das contas no ar (feito às 04:40 UTC); o VEL1 aterrado (feito a 10.11); a pasta única (por fazer, depois do correio das 07:30); confirmar que o correio das 07:30 chegou sozinho.
- Até 13.11 (sexta-feira): o REC2 (feito a 11.11) e o EVB.
- Semana de 16.11: os outros dois estudos de Évora, depois das fontes; o IT0 e o primeiro item diário.
- A 16.11 (segunda-feira): trocar a estimativa «tudo por volta de 08.12» por uma medida em dias e pontos por estudo.
- Avisar quando o Codex passar dos oitenta por cento da semana (a 11.11 às 11:55 UTC: 78%; o Claude a 72% às 11:10).

## 6. O que espera pela palavra do financiador

- Os dois arquivos da reescrita de outubro (12,6 GB) e as worktrees com ficheiros por registar: apagar ou guardar.
- A data do lançamento.
- **O passo das decisões da manhã:** em ensaio, aprovado só para 12.11.2026 (ver a secção «Em ensaio»); o custo mede-se nesse dia.
- A sessão inteira que acorda sozinha de manhã para trabalhar nos blocos: só depois de vários itens feitos à mão.

### Em ensaio desde 11.11.2026: as decisões da manhã por correio

Um passo automático lê o correio do dia e envia ao financiador as decisões do lugar de direção, tema a tema. Aprovado por ele só para 12.11.2026; fica ou sai conforme o que se medir nesse dia (se chega a horas, se as decisões são boas, quanto custa). Os pormenores de como está posto e do que conferir estão na cópia local deste ficheiro (`.claude/direcao/`), que é a que cada sessão lê primeiro.

## 7. A rotina de cada sessão, logo de manhã

1. Ler este ficheiro, o `CLAUDE.md` e o diário local; `estado.py` e `uso.py`.
2. **Ler as decisões que o passo automático enviou** (guardadas fora do repositório, ao lado do correio do dia) e a resposta do financiador, se a houver: este lugar confirma ou corrige. **Confirmar o correio das 07:30** (chegou, e os números batem com o que se recolheu) e **ler o relatório da manhã**: decidir tema a tema (nada, vigiar, cobrir), com a razão. A decisão vai no correio do dia seguinte. Até o IT0 existir não se publica nada por esta via.
3. Ler a caixa das sugestões pelo conector, sem copiar nada para o repositório.
4. Retomar o primeiro bloco da secção 4 que não esteja à espera de nada.
5. No fim de cada bloco: atualizar a secção 4 e a data do cabeçalho, o custo do bloco, a fila, os gargalos.
