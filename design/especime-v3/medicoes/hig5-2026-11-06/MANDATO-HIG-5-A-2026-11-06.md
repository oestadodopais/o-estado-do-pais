# Mandato HIG-5 A: a higiene de sexta-feira, a maquinaria que custou neste dia (06.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Opus 5.5, pela palavra do financiador de 02.11.2026). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, no sítio, na worktree `lote7-2026-11-06`, em `main` depois da aterragem do lote 6 (a REL1); o motor só lido. É a primeira passagem da HIG-5 (a fila, 7; sexta-feira, o dia da maquinaria): as cinco coisas da maquinaria que neste dia custaram uma recusa, uma construção ou uma decisão errada, e três Minor da mesma família. Nenhuma frase do leitor muda; a segunda passagem (HIG-5 B) traz as frases.*

## §0 Medido (06.11.2026, por este lugar, na worktree do lote 6, a cabeça b50d32c02)

- `scripts/leituras/aterrar.py:274` (`conferir_limite_diario`) recusa uma terceira aterragem concluída no mesmo dia UTC sem `ATERRAR_LOTE_EXTRA`. A §1.219 decidiu a 03.11.2026 que a cadência de duas por dia cai depois da AT1 medida; a AT1 foi medida neste dia (a §1.228), e o ARRANQUE já não a diz. `tests/leituras/pl1.py:72` a `:79` prova o limite.
- `scripts/leituras/aterrar.py:451` (`preparar`) só corre `npm run build` quando o `dist/version.json` falta; o `vercel-prebuilt` recusa um `dist/` que não seja da cabeça. No lote 5, o commit dos registos mudou a cabeça e o `dist/` teve de ser tirado à mão para a aterragem o reconstruir.
- `scripts/leituras/aterrar.py:182` (`blocos_conhecidos`) lê a fila com uma leitura própria que ignora uma linha de tipo inválido; o lançador lê-a com `fila.ler_fila`, que a recusa. Os registos do lote 5 escreveram a REL1 com o tipo «exatidão», aterraram, e só o lançamento seguinte a recusou.
- `scripts/leituras/pre-mandato.py` não confere os números do §0 de um mandato. O §0 da REL1 escreveu uma contagem somada à mão de uma listagem cortada (os gargalos: «Uma contagem do §0 de um mandato somada à mão de uma listagem cortada»).
- `scripts/frequencia-verificacoes.mjs` (a régua das frequências da REL1) confere todos os intervalos da história de um autor, pelo que um painel parado duas semanas deixa a construção vermelha para sempre; a sua lista de palavras não apanha várias formas; e nenhuma palavra do rótulo se liga ao período declarado (os Minor 62, 63 e 64).
- `tests/metodo/construido.mjs` não está na lista do `verify` nem em nenhum guião de `scripts/leituras/` nem no `portao.yml` (o Minor 58).

## §1 O que fazes

1. **A cadência.** O `conferir_limite_diario` deixa de recusar: conta as aterragens concluídas no dia UTC e escreve-as no recibo (`aterragens_do_dia`), e guarda o `ATERRAR_LOTE_EXTRA` se vier, sem o exigir. O teste de `tests/leituras/pl1.py` passa a provar que uma terceira aterragem passa e fica contada no recibo.
2. **O `dist/` da cabeça.** O `preparar` corre `npm run build` também quando o `commit` do `dist/version.json` não é a cabeça da worktree, e escreve no recibo porque construiu (em falta, ou de outra cabeça e qual). Um teste com um `dist/` de outra cabeça prova que constrói; o de um `dist/` da cabeça prova que não.
3. **A fila na aterragem.** As condições da aterragem leem a fila da cabeça com `fila.ler_fila` (a mesma função do lançador) e recusam, com a mensagem dela, uma fila que ela recuse. A planta: uma fila com o tipo «exatidão» numa linha, recusada.
4. **Os números do §0.** O `pre-mandato.py` confere, em todos os mandatos (também nos de `Acrescenta: nada`, antes de sair), os números da secção cujo título começa por `## §0`:
   - um número é uma sequência de algarismos com grupos de três separados por um espaço ou um espaço estreito e, se houver, uma vírgula decimal; contam os que têm três ou mais algarismos sem os espaços, ou uma vírgula decimal (as contagens; os números pequenos de um §0 são quase sempre nomes, como «o lote 5» ou «o Minor 62», e ficam fora);
   - não contam: as datas (dd.mm, dd.mm.aaaa, aaaa-mm-dd), as horas (hh:mm, hh:mm:ss), um ano de quatro algarismos sozinho entre 1900 e 2099, o que estiver entre crases ou entre « e », um número colado a uma letra, a um hífen, a um sublinhado, a um ponto ou a dois pontos (identificadores, versões, linhas de ficheiro), e um número depois de «§», «regra» ou «regras»;
   - os outros números têm de estar, tal como escritos, num ficheiro de medidas que o cabeçalho do mandato declara numa linha `Medidas: <ficheiro>`, relativa à pasta do mandato: um objeto JSON em que cada chave tem `valor` (o texto do número) e `comando` (o comando que o imprimiu), os dois não vazios;
   - recusa (código 9, com a lista): um número fora do ficheiro; um §0 com números e sem `Medidas:`; um ficheiro ilegível; uma entrada sem `comando`.

   As plantas: uma contagem de quatro algarismos a mais no §0, recusada; o cabeçalho sem `Medidas:` com essa contagem, recusado; uma entrada sem `comando`, recusada; uma contagem igual ao `valor` de uma entrada, aceite; e um §0 só com datas, horas, um ano, `§1.219`, «a regra 14», «o lote 5», `` `aterrar.py:274` `` e «ÉVORA 114 129» entre aspas, aceite. O §0 deste mandato não tem contagens e passa sem `Medidas:`.
5. **A régua das frequências.**
   - **A janela:** os intervalos entre dias seguidos contam só quando o dia mais recente do par cai nos últimos quatro períodos antes da data da construção; o intervalo do último dia à construção conta sempre. Um painel que volte depois de uma falha deixa de pôr a construção vermelha quando a falha sai da janela.
   - **As palavras:** a procura normaliza o rótulo (NFC, sem acentos, em minúsculas) e apanha também «diariamente», «semanalmente», «quinzenal», «trimestral», «semestral», «todos os dias», «cada dia», «todas as semanas», «every day», «each day», «every week», «fortnightly», «quarterly», «annually», «biweekly», «bi-weekly», com os plurais.
   - **O laço ao período:** cada palavra tem o seu período (dia 1, semana 7, quinzena 14, mês 30, trimestre 91, semestre 182, ano 365), e um autor da tabela com um rótulo cuja palavra diga outro período que o declarado é vermelho.
   - **O comentário:** passa a dizer a verdade da janela (o remédio é o painel correr; a construção volta a verde quando a falha sai dos últimos quatro períodos, ou com um rótulo novo por mandato; nunca o limite sobe).
   - **As plantas:** uma no ponto em que o `gate-html.mjs` chama a régua (a tabela da produção com «diária» para o painel, numa cópia), vermelha; um painel que volta depois de uma falha de três semanas, verde quando a falha sai da janela e vermelho antes; «semanalmente» para um autor fora da tabela, vermelho; «Diária» com o acento decomposto, vermelho.
6. **O `construido.mjs` no `verify`.** Um guião `check:metodo-construido` com `node tests/metodo/construido.mjs`, na lista do `verify` e por isso nas partes do GitHub (`scripts/verify-partes.mjs` lê a lista; o tempo do passo entra em `scripts/verify-partes-tempos.json`).
7. **O `portao.yml`** (o Minor 56): o comentário que diz que o nome do trabalho `portao` é o contexto obrigatório, e a etiqueta da versão ao lado do SHA fixado do `upload-artifact`, sem mudar o SHA.

Nenhuma régua que protege um número, uma fonte ou uma pessoa fica mais fraca; as que mudam de forma levam a planta que prova que mordem.

## §2 Quando paras

Se a fila de `main` não passar no `fila.ler_fila` (diz a linha); se o `verify-partes.mjs` não aceitar um passo novo sem mudar a divisão das partes; se uma régua só passar mais fraca.

## §3 O fim

`python3 -m unittest tests.leituras.pl1 tests.leituras.at1 tests.leituras.ferramenta_aterrar` (com `PYTHONPATH=tests/leituras`), os testes da régua das frequências, o `build` inteiro e o `gate:html`, com os códigos; o `pre-mandato.py` corrido sobre este mandato (código 0) e sobre a cópia dele com uma contagem de quatro algarismos a mais no §0 (código 9), com os dois códigos. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `HIG-5 A`. Setenta minutos, cem chamadas.
