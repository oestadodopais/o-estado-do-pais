# Adenda A ao mandato VEL1: as correções da leitura a frio (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2), depois da leitura a frio do bloco pelo Claude Opus 5.5 (`leitor`), que apanhou as cinco plantas do pacote, e depois da primeira corrida real do ramo no GitHub (a corrida 42897032498: verde em 24,7 minutos, contra 42,6 a 52,1 das quatro últimas; o `construir` em 8,9 minutos; as oito partes entre 8,4 e 14,9; o `portao` em 0,6). As dezoito conferências que saíram do `build` correram em partes novas e passaram: esse achado fecha pela medida. Ficam seis correções pequenas. Orçamento de uma construção normal: setenta e cinco minutos e cento e vinte chamadas, um commit por ponto. O teu relatório vai para `RELATORIO-VEL1-A.txt`.*

## O que corriges

1. **Depois de um erro do vigia, a aterragem espera pela corrida até ao fim.** Hoje pergunta seis vezes com trinta segundos de intervalo, e uma falha de rede no começo de uma corrida de vinte e cinco minutos acaba em «não ficou verde». Passa a perguntar de trinta em trinta segundos até a corrida ficar concluída, com o mesmo teto que o vigia tinha (noventa minutos desde o início da espera); uma consulta que falhe conta como mais uma espera, e não como vermelho. O que conta como verde não muda: a mesma cabeça, concluída, com sucesso. Plantas: o `gh` falso falha duas vezes, a corrida fica pendente dez consultas e depois verde, e aterra; pendente até ao teto, recusa; concluída e cancelada, recusa.

2. **A repetição da instalação do Chromium tem o seu próprio teto.** A primeira tentativa e a repetição passam a dois passos, cada um com cinco minutos, o segundo só quando o primeiro falha.

3. **A chave da cache não fica sem versão.** Se a leitura da versão do Playwright der vazio, o passo falha com essa mensagem.

4. **Uma resposta da API que não se consiga ler corre a corrida inteira.** Hoje `portao-dispensa.mjs` lança, o `antecedente` fica vermelho e nada corre. Passa a responder «nao», como quando a consulta falha. Planta com uma resposta que não é JSON e outra com a forma errada.

5. **A prova da listagem das fatias dos alvos** compara hoje a função de repartir consigo própria. Passa a comparar a união das três listas com o inventário das rotas que o passo único percorria, lido do mesmo sítio de onde a régua o lê quando corre. E a régua confere que o `dist/` existe antes de pedir o inventário, para a mensagem «Corra o build primeiro» voltar.

6. **Os tempos do plano** passam a ser os desta corrida real, lidos dos registos das oito partes que este lugar pôs na pasta (`tempos-github-42897032498.json`), para as três fatias dos alvos e os passos que saíram do `build` deixarem de ser estimativas.

## O que fica como está

O resumo do commit da ação `actions/cache` (v4.2.3) foi lido por este lugar na API do GitHub e está certo: a corrida usou-o. A linha do VEL1 na fila foi corrigida por este lugar neste commit.

## A prova

As plantas dos pontos 1, 4 e 5; `check:leituras` (a ferramenta que abre uma porta local falha na tua sandbox: diz o código dela e os das outras); `check:projecao-portoes`, `check:repositorio`, `check:mortos`, `typecheck`. A corrida do GitHub corre-a este lugar outra vez.

## Quando paras

Só se um ponto não se cumprir sem que uma conferência deixe de correr ou passe a medir menos. Para tudo o resto: deixa, diz e continua.

## O fim

Os seis pontos e o relatório. Setenta e cinco minutos, cento e vinte chamadas.
