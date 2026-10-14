# Relatório do bloco M83 (14.10.2026): o pacote de uma leitura leva os corpos alojados por guião

*Escrito pelo lugar de direção (Claude Fable 5.1), que construiu o bloco; por isso a leitura a frio é do Codex `gpt-6-astra` (`ler.sh`), a outra família. Os números deste relatório vêm de `medidas.json`, escrito por guião a partir de `teste-pacote.json` (a saída de `tests/leituras/pacote.py`) e dos dois manifestos `corpos-alojados.json` dos ensaios sobre o bloco V2-a real. Sem travessões na prosa.*

## O que mudou

`scripts/leituras/pacote.py` ganhou quatro funções (`linhas_com_corpos`, `indice_dos_corpos`, `levar_corpos`, `escrever_corpos`) e três variáveis (`PACOTE_ESTUDOS`, `PACOTE_SEM_CORPOS`, e o comportamento novo sob `PACOTE_MOTOR`): cada linha do livro-razão mudada no intervalo que declare `document.source_sha256` exige o documento com esse resumo na cabeça do motor; a decisão é tomada antes de criar a pasta do pacote, e a falta recusa, salvo a exceção declarada com razão escrita, que fica em `SEM-CORPOS-ALOJADOS.md`. Os corpos copiam-se para `motor/<caminho>`, conferem-se byte a byte depois de escritos, e levam ao lado o recibo do pedido e a pasta `direitos/`; o manifesto é `motor/CORPOS-ALOJADOS.md` e `motor/corpos-alojados.json`. As páginas construídas das linhas mudadas entram de `dist/` sozinhas, com a versão de `dist/version.json` e as que faltam ditas. `pacote.sh` documenta-o no cabeçalho; `PROMPT-comum.md` ganhou o primeiro passo do leitor (o manifesto contra as linhas do diff; um corpo em falta é Blocking); a regra 3 do `CLAUDE.md` diz que o pacote se monta por guião e nunca por cópias à mão. Os registos: a §1.192 de `DECISIONS.md`, a M83 e o fecho da opção da M65 no registo das melhorias, os pendentes, a I224, o prompt da sessão seguinte.

## O que se mediu

- O ensaio `tests/leituras/pacote.py` (repositórios sintéticos, sem tocar o motor) passou 33 casos, todos; 8 deles são plantas, três delas novas (sem `PACOTE_MOTOR`; o corpo com outro sha256 na cabeça do motor; a razão curta), e um caso novo é o conhecido-positivo da exceção declarada (`teste-pacote.json`).
- O ensaio sobre o bloco V2-a inteiro (o sítio de `ef0dc7dd` à cabeça estacionada, o motor de `dfeca64d` à sua) resolveu 18 linhas, 18 copiadas e 0 em falta, em 5 documentos distintos, com 32 ficheiros ao lado e 36 páginas construídas, 0 em falta (`ensaio-v2a-bloco-inteiro.json`).
- O ensaio sobre o intervalo de uma passagem de correção (o sítio de `972c1f07`, o motor de `559eac97`), que é o caso que falhou a 13.10, trouxe os corpos das 13 linhas desse intervalo, 13 copiadas, e 26 páginas (`ensaio-v2a-intervalo-da-correcao.json`).

## O que ficou aberto

- A tradução dos guiões `montar-pacote-*.sh` das sessões para o novo comportamento faz-se na sessão seguinte, quando a leitura da V2-a-e se montar; o bloco não os muda porque vivem fora do repositório.
- `PACOTE_ESTUDOS` só é preciso para linhas cuja nota não declare o estudo; nenhuma das do V2-a precisou.
