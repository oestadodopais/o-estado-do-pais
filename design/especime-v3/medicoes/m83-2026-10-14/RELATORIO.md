# Relatório do bloco M83 (14.10.2026): o pacote de uma leitura leva os corpos alojados por guião

*Escrito pelo lugar de direção (Claude Fable 5.1), que construiu o bloco; por isso a leitura a frio é do Codex `gpt-6-astra` (`ler.sh`), a outra família. Os números deste relatório vêm de `medidas.json`, escrito por `medir.py` a partir de `teste-pacote.json` (a saída de `tests/leituras/pacote.py`), dos dois manifestos `corpos-alojados.json` dos ensaios sobre o bloco V2-a real e de `inventario-do-nome.json`; os comandos estão em `COMANDOS.md`. Sem travessões na prosa.*

## O que mudou

`scripts/leituras/pacote.py` ganhou cinco funções (`sha256_de`, `linhas_com_corpos`, `indice_dos_corpos`, `levar_corpos`, `escrever_corpos`) e três variáveis (`PACOTE_ESTUDOS`, `PACOTE_SEM_CORPOS`, e o comportamento novo sob `PACOTE_MOTOR`): cada linha do livro-razão mudada no intervalo que declare `document.source_sha256` exige o documento com esse resumo na cabeça do motor; a decisão é tomada antes de criar a pasta do pacote, e a falta recusa, salvo a exceção declarada com razão escrita, que fica em `SEM-CORPOS-ALOJADOS.md`. Os corpos copiam-se para `motor/<caminho>`, conferem-se byte a byte depois de escritos, e levam ao lado o recibo do pedido e a pasta `direitos/`; o manifesto é `motor/CORPOS-ALOJADOS.md` e `motor/corpos-alojados.json`. As páginas construídas das linhas mudadas entram de `dist/` sozinhas, com a versão de `dist/version.json` e as que faltam ditas. `pacote.sh` documenta-o no cabeçalho; `PROMPT-comum.md` ganhou o primeiro passo do leitor (o manifesto contra as linhas do diff; um corpo em falta é Blocking); a regra 3 do `CLAUDE.md` diz que o pacote se monta por guião e nunca por cópias à mão. Os registos: a §1.192 de `DECISIONS.md`, a M83 e o fecho da opção da M65 no registo das melhorias, os pendentes, a I224, o prompt da sessão seguinte.

## O que se mediu

- O ensaio `tests/leituras/pacote.py` (repositórios sintéticos, sem tocar o motor) passou 41 casos, todos; 11 deles são plantas, cinco delas da M83 (sem `PACOTE_MOTOR`; o corpo com outro sha256 na cabeça do motor; a razão curta; a declaração de sha256 ilegível; 64 hexadecimais com lixo atrás), e os casos novos cobrem ainda o conhecido-positivo da exceção declarada, o corpo sem recibo nem direitos ao lado dito no estado, a página pedida à mão contada, e as formas do sha256 lidas do YAML (`teste-pacote.json`).
- O ensaio sobre o bloco V2-a inteiro (o sítio de `ef0dc7dd` à cabeça estacionada, o motor de `dfeca64d` à sua, sem `content/*` no diff do motor) resolveu 18 linhas, 18 copiadas e 0 em falta, todas pelos recibos do sítio (18) e nenhuma pelas fontes do estudo (0), em 5 documentos distintos, com 32 ficheiros ao lado (18 linhas com recibo do pedido e 18 com direitos) e 36 páginas construídas, 0 em falta; `PACOTE_ESTUDOS` não foi preciso (0 estudos extra) (`ensaio-v2a-bloco-inteiro.json`).
- O ensaio sobre o intervalo da passagem de correção (o sítio de `972c1f07`, o motor de `559eac97`), que é o caso que falhou a 13.10, trouxe os corpos das 13 linhas desse intervalo, 13 copiadas, 1 documento distinto, 28 ficheiros ao lado e 26 páginas (`ensaio-v2a-intervalo-da-correcao.json`).
- O inventário do nome do financiador nas duas histórias, por `medir-inventario.py` com as 7 cadeias passadas pelo ambiente, medido na história de `main` do sítio e de `master` do motor: no sítio, 2640 commits, 2632 com a identidade pessoal, 133 com o nome da conta nos diffs, 2 com o nome completo, 5 com o nome próprio e o apelido, 2 com o correio dentro de ficheiros, 4 mensagens com o nome da conta, 0 ficheiros da cabeça; no motor, 662 commits, 657 com a identidade pessoal, 36 com o nome da conta nos diffs, 1 nome de ficheiro com o nome da conta, e na cabeça 3 ficheiros com o nome próprio e o apelido e 1 com o nome da conta; a cidade aparece em 2 commits e 3 ficheiros da cabeça do motor, todos conteúdos de terceiros (a lista de códigos NUTS do Eurostat, contratos públicos, um texto legal), não dele. Fora do Git: 2 grafias do domínio sem titular visível no `whois`; 1 membro na organização, 0 públicos; 0 forks, 0 estrelas e 0 pull requests no repositório público (`inventario-do-nome.json`). Os 3 conhecidos-positivos do guião passaram (`conhecidos-positivos.json`, por `provar-inventario.py`).

## A passagem de correção (depois da leitura do Codex, na mesma manhã)

A leitura (`design/especime-v3/critica/LEITURA-M83-2026-10-14.md`) mordeu as cinco plantas e deu cinco Major e dois Minor reais, todos corrigidos antes de aterrar:

- **Achado 4 (o sha256 só com aspas duplas):** `SHA_DA_LINHA` lê aspas duplas, simples ou nenhumas, `null` é «sem documento», e qualquer outra declaração de `source_sha256` recusa a montagem em vez de passar por «sem documento» (`linhas_com_corpos`); três casos novos no ensaio, um deles planta.
- **Achado 6 (o recibo e os direitos opcionais em silêncio):** cada linha copiada regista `recibo_do_pedido` e `direitos`, o estado diz «copiado · sem recibo do pedido ao lado» ou «sem pasta direitos/ ao lado», a montagem imprime o aviso, e o prompt comum do leitor diz que um corpo sem recibo é Major salvo razão no brief; os estudos antigos do motor não têm recibos ao lado, por isso a falta diz-se em vez de recusar (o cabeçalho de `pacote.py` explica-o); um caso novo no ensaio.
- **Achado 7 (os nomes de ficheiro e a `refs/original`):** o plano da §1.192 ganha o `--path-rename` para o nome de ficheiro do motor, a conferência percorre também os nomes de ficheiro e a cabeça, e os clones da máquina substituem-se por clones novos em vez de `fetch` e `reset`, o que apaga a `refs/original`.
- **Achado 8 (a árvore igual contra o commit das citações):** o plano diz agora que a árvore da cabeça reescrita do sítio fica igual à de hoje e que o mapa, as cabeças fixadas e as citações entram num commit normal por cima, pelo portão; e que no motor a cabeça muda nos quatro ficheiros que ainda trazem o nome.
- **Achado 9 (medições sem comando):** `COMANDOS.md` com os comandos e as bases dos dois ensaios reais, `medir-inventario.py` e `inventario-do-nome.json` para o inventário do nome (as cadeias pelo ambiente, nunca escritas), `medir.py` para `medidas.json`; os manifestos dizem a origem da resolução de cada linha e os estudos percorridos, por isso o «`PACOTE_ESTUDOS` não foi preciso» passa a ler-se do ficheiro.
- **Achado 10 (as páginas pedidas à mão fora da contagem):** o manifesto conta `paginas_das_linhas` (pedidas ou acrescentadas) e, à parte, `paginas_acrescentadas_de_dist`; um caso novo no ensaio.
- **Achado 11 (as contagens do relatório):** cinco funções, e as plantas contadas pelo prefixo «planta» em `medir.py`.

## A segunda passagem de correção (depois da segunda leitura, `LEITURA-M83-b-2026-10-14.md`)

A leitura curta da primeira correção mordeu as cinco plantas e deu cinco Major e um Minor reais, corrigidos nesta passagem:

- **Achado 4 (a chave só no início da linha e sem aspas):** a chave `source_sha256` lê-se onde estiver, em bloco ou em fluxo (`document: {source_sha256: …}`), com ou sem aspas na chave e no valor (`sha_declarado`); cada ocorrência ou é 64 hexadecimais, ou null, ou recusa, e dois valores distintos recusam; o caso das formas no ensaio ganhou a linha em fluxo e a linha com a chave entre aspas.
- **Achado 5 (a cidade trocada em conteúdos de terceiros):** os dois commits e os três ficheiros do motor que trazem a cidade são conteúdos de terceiros (a lista NUTS do Eurostat, um relatório das pensões, contratos públicos, um texto legal); a §1.192 diz-o e a reescrita deixa de tocar na cidade, porque os bytes selados de uma fonte não se alteram.
- **Achado 6 (a garantia por `assert`):** `medir-inventario.py` recusa escrever por uma verificação explícita, provada com `python3 -O` e um rótulo igual à cadeia (código 1, nenhum ficheiro).
- **Achado 7 (o Git falhado como zero):** cada comando do Git que falhe para o guião com código 1 e sem ficheiro (provado com uma pasta inexistente); o `whois` e o `gh` que falhem ficam registados como erro no seu campo.
- **Achado 9 (as afirmações sobre o GitHub sem medida):** o guião mede também os membros da organização, os forks, as estrelas e os pull requests do repositório público, e a §1.192 cita-os do ficheiro.
- **Achado 10 (as contagens):** a §1.192 cita os casos do ensaio pelo ficheiro.

## A terceira passagem de correção (depois da terceira leitura, `LEITURA-M83-c-2026-10-14.md`)

A leitura curta da segunda correção mordeu as cinco plantas e deixou quatro coisas reais, corrigidas nesta passagem:

- **Achado 3 (a expressão regular truncava e ignorava o âmbito):** o resumo lê-se do YAML inteiro da linha com o PyYAML, em `document.source_sha256` e só aí (`sha_declarado`); uma chave parecida fora de `document` ou um sha256 dentro de `crop` não contam, 64 hexadecimais com lixo atrás recusam, e sem o PyYAML o guião recusa em vez de ler menos; a corrida `portão` ganha um passo que instala o módulo quando o runner não o traz; dois casos novos no ensaio, um deles planta.
- **Achado 1, a segunda metade (a conferência exigia zero de uma cadeia que fica em conteúdos de terceiros):** a §1.192 diz que a conferência exige zero das cadeias da identidade e confere a cidade à parte, só nos conteúdos de terceiros já identificados.
- **Achado 4, a segunda metade (a mensagem de recusa dizia os rótulos):** a mensagem diz quantos, nunca quais; `provar-inventario.py` corre os conhecidos-positivos do inventário (a fuga com `python3 -O` e maiúsculas trocadas, o Git falhado, o controlo) e regista código, ficheiro e mensagem em `conhecidos-positivos.json`.
- **Achado 7 (os manifestos fora do pacote da leitura, e as provas sem comando):** o pacote da leitura seguinte leva a pasta das medições inteira por `PACOTE_EXTRA`, e os comandos das provas estão em `COMANDOS.md` com o resultado em ficheiro.
- **Achado 8 (as contagens mudavam com cada commit):** o inventário mede a história de `main` e de `master`, as referências que aterram, e diz a cabeça medida; a §1.192 cita essas contagens.

## O que ficou aberto

- A tradução dos guiões `montar-pacote-*.sh` das sessões para o novo comportamento faz-se na sessão seguinte, quando a leitura da V2-a-e se montar; o bloco não os muda porque vivem fora do repositório.
- `PACOTE_ESTUDOS` só é preciso para linhas cuja nota não declare o estudo; nenhuma das do V2-a precisou.
