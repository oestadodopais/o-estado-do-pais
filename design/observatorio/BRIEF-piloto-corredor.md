# Brief · o piloto do corredor diário (01.09.2026)

*Escrito a 01.09.2026 pelo lugar de direção (Claude Fable 5) para o Opus construir na semana em que tiver folga, depois de o diretor criar a chave de implantação e decidir a hora (`FRESCURA-E-AUTOMACAO.md` §9). O desenho está lá; este brief diz só o que se constrói no piloto, o que fica de fora, e as medidas de aceitação. Sem travessões na prosa.*

## 1 · O que o piloto faz

A conferência diária das linhas que já existem, e o selo «conferido em» no sítio. **Não publica valores novos**: no piloto, um período novo da mesma medida é registado no relatório e na *issue* e fica por publicar até uma sessão o rever; a política do §4 do desenho entra inteira só depois de quatro semanas de corridas verdes (o teste de saída da fase 1).

1. No motor: `indicators/refresh.py` passa a receber os caminhos do sítio e do arquivo por parâmetro (ou por variáveis de ambiente), a cobrir as linhas dos concelhos (as 2 447 de `12 Concelhos`, chamando ou absorvendo `releitura_concelhos.py`) além das 32 do painel, e a escrever o índice do arquivo (`indice.jsonl`) e os ficheiros por sha256; a política do piloto (publicar só a conferência) é um interruptor explícito, `--so-conferir`.
2. No motor: o fluxo `.github/workflows/corredor.yml`, `on: schedule` à hora decidida (UTC) e `workflow_dispatch` para correr à mão; Python e Node instalados no fluxo; o sítio obtido com a chave de implantação; a corrida; os portões do sítio; o commit com caminhos explícitos e o `push`; a *issue* com o relatório quando algo pára. Um segundo fluxo, `vigia.yml`, à tarde, corre `--check-heartbeat` e falha alto.
3. No arquivo (`oestadodopais/arquivo`): o vintage zero, com todos os endereços do livro-razão descarregados uma vez, indexados, e as sete capturas de 30.08 da nota da I87 como primeiras linhas (endereços e sha256 na nota, no Desktop do diretor); os que não respondem, como linhas de ausência.
4. No sítio: a frase do cabeçalho passa a dizer a última conferência real («conferido em dd.mm.aaaa às hh:mm»), com os números da corrida; o recibo de cada linha mostra as três datas (o período, a publicação pela fonte onde a linha a tiver, a conferência); o estado da fonte («sem resposta desde») rendido no selo quando existir. A página «O que mudou» pode nascer no piloto só com as entradas de conferência («conferido; 0 valores novos»), nas duas edições, se a folga chegar; senão espera.

## 2 · O que fica de fora do piloto

A publicação automática de valores novos; o correio ao diretor (o aviso é o do GitHub e a *issue*); a testemunha de fora (Wayback, Arquivo.pt); a página «O arquivo das fontes»; a segunda corrida do dia.

## 3 · As medidas de aceitação, escritas antes

- Uma corrida completa no GitHub, verde de ponta a ponta, com o relatório a dizer quantas linhas conferiu (todas as que têm endereço de máquina), quantas fontes não responderam e quanto tempo levou; o tempo medido fica escrito para se comparar com os 300 minutos por mês estimados.
- Estragos plantados, cada um visto vermelho pela corrida numa cópia: um ficheiro de fonte alterado num byte (o sha256 muda, o arquivo guarda, a releitura corre, a classificação é a certa); um leitor partido (a corrida pára e não escreve o valor); um endereço a 404 (a linha de ausência no índice, o estado «sem resposta desde», e a página não diz «hoje» para essa linha); um portão do sítio vermelho (nada se empurra); uma tentativa de escrever no arquivo uma versão já guardada (recusada); uma linha do índice reescrita (o portão do arquivo falha).
- O interruptor de homem morto provado: com a corrida da manhã desligada, o fluxo da tarde falha e a falha é visível.
- No sítio, depois da corrida: `verify:deploy` verde; o cabeçalho com a data e a hora da conferência real; o inventário do livro-razão igual antes e depois (nenhum número novo); `check:voz` com as cadeias novas no inventário.
- O agente `launchd` continua a correr às segundas durante a primeira semana; as duas corridas concordam (o relatório de segunda diz «igual» para as 32); só então o agente é descarregado, por decisão do diretor.
- Medição cega do Sonnet numa cópia (as contagens, os sha256, o índice) e leitura do Codex com plantas antes da fusão de qualquer coisa no sítio.

## 4 · Estimativa e modelo

Construtor Claude Opus 5, da ordem de 0,5 a 0,8 M símbolos (o `refresh.py` já faz a metade do trabalho; a outra metade é o fluxo, o arquivo e as três datas no sítio); medição Sonnet da ordem de 0,3 M; leitura Codex da ordem de 0,15 M. Antes de começar: a chave de implantação e o repositório do arquivo criados pelo diretor, e a hora decidida.
