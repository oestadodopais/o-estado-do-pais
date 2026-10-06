# M-A · maquinaria medida, com a proteção conferida

Cabeça do brief: `207d71346ea034943058fffcbbb926ddafa79e90`. Cabeça do código nas duas corridas finais: `225f482574447483b200da460bc3183439306b86`. A cabeça final da entrega é o commit que junta este relatório e as provas; é indicada na mensagem final da sessão. O código medido fica identificado independentemente dessa documentação.

## Resultado e método

A corrida nova levou 426,382 s, lidos de `portoes/tempos.json`. Cumpre o teto de doze minutos.
Os códigos vêm dos ficheiros `*.codigo`, nunca de uma cadeia com pipe. As três corridas usaram a mesma máquina, a tranca comum e o motor em leitura por `RESEARCHHUB_DIR=<motor>`. Esta sessão não lançou outras conferências durante cada medição. A espera pela tranca antecede a primeira marca e não entra no tempo da corrida. A presença de processos normais do sistema não é uma garantia de máquina fisicamente ociosa.

O instrumento do ponto 1 foi aplicado à cabeça do brief antes de qualquer otimização. `tempos-shell.py` mede cada comando do npm, conserva a paragem e o código de falha e passa o ambiente inteiro. `tempos.mjs` mede os passos do executor paralelo e reúne as marcas. A duração inteira é o intervalo entre a primeira entrada instrumentada e o fim da última, incluindo os intervalos entre passos. Não é a soma das durações paralelas.

Fontes: `antes/tempos.json`, `portoes/tempos.json` e `portoes-antigo/tempos.json`. `resumo.json`, `conferencias.json` e esta tabela são escritos por `relatorio.py`; nenhum tempo é transcrito à mão.

| Medida, em segundos | Cabeça do brief | Código, guião novo | Mesmo código, guião antigo |
|---|---:|---:|---:|
| Corrida inteira | 1408,540 | 426,382 | 1104,242 |
| build | 223,672 | 205,391 | 220,560 |
| verify | 1183,914 | 219,714 | 883,229 |
| check:briefs | 172,984 | 0,335 | 0,221 |
| check:alvos | 332,594 | 190,770 | 181,782 |
| Auto-teste do país, soma | 56,984 | 1,681 | 1,007 |
| typecheck | 0,738 | 0,242 | 0,227 |

O guião antigo é a cópia exata de `scripts/leituras/portoes.sh` na cabeça do brief, conservada em `portoes-antigo.sh`; a igualdade dos bytes é conferida por `relatorio.py`. Na comparação final recebeu a mesma shell de instrumentação pelo ambiente. A limpeza foi chamada depois, porque o guião antigo não a conhece.

## Códigos lidos dos ficheiros

| Corrida | build.codigo | verify.codigo | typecheck.codigo |
|---|---:|---:|---:|
| antes | 0 | 0 | 0 |
| portoes | 0 | 0 | 0 |
| portoes-antigo | 0 | 0 | 0 |

As cabeças de entrada e saída de cada corrida são iguais. O workflow `.github/workflows/portao.yml` é byte a byte o da cabeça do brief. Não há diferenças em `src/`, `public/` ou `ledger/`. Nenhuma página de leitor foi redesenhada.

## Os pontos do mandato

1. **Tempos.** Instrumento aplicado primeiro, com planta de código não nulo, herança do ambiente e paragem do passo seguinte. A linha inteira, o verify e cada conferência ficam identificados no mesmo JSON.
2. **Encadeamento.** Quatro processos locais, medidos nesta corrida. U confirma 45 passos: 20 pagos pelo build verde e 25 corridos aqui. D e C estão verdes em `portoes/verify.json`. Não se fez uma procura exaustiva do grau mais rápido; o grau escolhido cumpre o teto e não deu falhas de memória ou portas. O workflow continua a escolher o grau pelo seu anfitrião. `series-com-motor.codigo` e `series-sem-motor.codigo` conservam ambos os ensaios; o segundo declara a parte que não pode ler sem motor.
3. **Briefs.** `presos.json` prende o brief, o guião, o JSON de medidas e a versão do conferidor por sha256. A forma do JSON, os conhecidos positivos e a ligação dos números às frases continuam a ser conferidos em cada corrida. Só a execução do guião é reutilizada. Uma alteração de qualquer selo volta a executar. Os selos novos gravam-se com `--escrever-presos` depois de tudo verde; a conferência habitual é só de leitura para conservar D. Ver MA-1.
4. **País.** A chamada da célula E1 no conferidor real é a mesma. Cada caso do ensaio corre essa célula e copia só o carimbo, em vez de copiar a construção e repetir células alheias. As plantas de prazo e razão continuam a morder; a retirada da chamada numa cópia é detetada. A conferência normal continua inteira. O auto-teste mudou da importação dentro de `check:pais` para o passo explícito `check:pais:auto-teste` no verify.
5. **Alvos.** `load`, fontes e quadro de pintura substituem a espera fixa. As 360 passagens são exatamente iguais nas páginas, rotas, larguras, células, axe e alvos maus das três corridas. A igualdade é de objetos completos, sem arredondar medidas. `comparacao-alvos.json` conserva também o ensaio seletivo, e `resumo.json` confere as duas corridas finais contra o antes. As folhas atrasadas, a etiqueta cortada e o botão pequeno falham nas células originais.
6. **Aterragem.** Os códigos 14 a 18 e as etapas do motor, da publicação, da Vercel e do verify:deploy ficam. A consulta da corrida de main faz-se uma vez: imprime o endereço devolvido, ou a página de corridas quando o identificador ainda não existe. O ensaio substitui comandos externos e não faz uma aterragem real.
7. **Pacote.** Os registos dos portões ficam fora das cópias inteiras e do diff, também por PACOTE_EXTRA. O pacote junta códigos, tempos e linhas citadas com o número da linha e o sha256 da origem. Citação inexistente recusa a montagem; linha retirada recusa a entrega. As plantas anteriores do pacote H2 continuam verdes.
8. **Ferramentas comuns.** Custos Claude e Codex, limpeza de texto e gzip e capturas com recortes vivem em `scripts/leituras/`. O limpador corre ao terminar os portões, incluindo um vermelho, e antes de soltar a tranca. Os testes cobrem formatos, contadores repetidos e recuados, campos ausentes, idempotência, binários, ligações, as cinco larguras nas duas línguas, recortes, cabeça errada e pedidos externos. As cópias históricas ficam como evidência, sem serem pontos de manutenção para blocos seguintes.

## A mesma lista de conferências

A união observada tem 50 comandos ou auto-testes distintos antes e depois. A tabela vem das entradas de `tempos.json`, não de uma promessa no package.json. O passo npm que envolve o auto-teste é normalizado para a entrada interna `auto-teste:pais`, que já existia no antes. O verify passa a ter um passo explícito adicional por essa mudança de lugar; as células protegidas são as mesmas. As repetições pagas pelo build e a segunda invocação do auto-teste deixam de gastar tempo.

| Conferência ou passo | Antes, execuções | Novo, execuções | Antigo na cabeça do código, execuções |
|---|---:|---:|---:|
| `astro build` | 1 | 1 | 1 |
| `auto-teste:pais` | 2 | 1 | 1 |
| `npm run cartoes` | 1 | 1 | 1 |
| `npm run check:alcance` | 1 | 1 | 1 |
| `npm run check:alvos` | 1 | 1 | 1 |
| `npm run check:areas` | 2 | 1 | 2 |
| `npm run check:briefs` | 1 | 1 | 1 |
| `npm run check:cabeca` | 1 | 1 | 1 |
| `npm run check:cadeia` | 2 | 1 | 2 |
| `npm run check:cartao` | 1 | 1 | 1 |
| `npm run check:cruzamento` | 2 | 1 | 2 |
| `npm run check:css` | 1 | 1 | 1 |
| `npm run check:dados` | 2 | 1 | 2 |
| `npm run check:datas` | 2 | 1 | 2 |
| `npm run check:documentos` | 2 | 1 | 2 |
| `npm run check:explicacoes` | 1 | 1 | 1 |
| `npm run check:fontes` | 1 | 1 | 1 |
| `npm run check:formas` | 2 | 1 | 2 |
| `npm run check:formato` | 2 | 1 | 2 |
| `npm run check:frases-compostas` | 1 | 1 | 1 |
| `npm run check:indice` | 1 | 1 | 1 |
| `npm run check:indice-do-sitio` | 1 | 1 | 1 |
| `npm run check:lingua` | 2 | 1 | 2 |
| `npm run check:lugar` | 1 | 1 | 1 |
| `npm run check:lugares` | 2 | 1 | 2 |
| `npm run check:mapa` | 2 | 1 | 2 |
| `npm run check:moldura` | 1 | 1 | 1 |
| `npm run check:mortos` | 1 | 1 | 1 |
| `npm run check:navegacao` | 2 | 1 | 2 |
| `npm run check:nomes` | 2 | 1 | 2 |
| `npm run check:pais` | 2 | 1 | 2 |
| `npm run check:palavras` | 1 | 1 | 1 |
| `npm run check:primeira` | 1 | 1 | 1 |
| `npm run check:privacidade` | 1 | 1 | 1 |
| `npm run check:regioes` | 2 | 1 | 2 |
| `npm run check:registo` | 2 | 1 | 2 |
| `npm run check:rotulos` | 1 | 1 | 1 |
| `npm run check:series` | 1 | 1 | 1 |
| `npm run check:sugestoes` | 1 | 1 | 1 |
| `npm run check:voz` | 2 | 1 | 2 |
| `npm run design:feixe` | 1 | 1 | 1 |
| `npm run gate:html` | 2 | 1 | 2 |
| `npm run ledger:check` | 2 | 1 | 2 |
| `npm run mapa:unidades` | 1 | 1 | 1 |
| `npm run mapa:unidades -- --verifica` | 1 | 1 | 1 |
| `npm run provar:eyetext` | 1 | 1 | 1 |
| `npm run provar:guardas` | 1 | 1 | 1 |
| `npm run sinais` | 2 | 1 | 2 |
| `npm run stamp:version` | 1 | 1 | 1 |
| `npm run typecheck` | 1 | 1 | 1 |

Linhas de controlo para o pacote:

<!-- portao: portoes/verify.log | U ✓ -->
<!-- portao: portoes/verify.log | D ✓ -->
<!-- portao: portoes/verify.log | C ✓ -->
<!-- portao: portoes/verify.log | npm run check:briefs · -->
<!-- portao: portoes/verify.log | npm run check:series · -->
<!-- portao: portoes/verify.log | npm run check:pais:auto-teste · -->
<!-- portao: portoes/verify.log | npm run check:alvos · -->

## Plantas e mensagens

As mensagens abaixo vêm dos JSON ou registos de ensaio nomeados. Os controlos verdes provam a passagem limpa; as plantas vermelhas conservam a queixa. Não são falhas da entrega.

| Planta ou controlo | Mensagem observada | Ficheiro |
|---|---|---|
| a cadeia limpa passa, e o que o build já correu não corre outra vez | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-runner.json` |
| uma conferência nova só no verify corre sozinha | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-runner.json` |
| uma conferência tirada da escolha fecha a célula U | U: «"&lt;casa&gt;/.nvm/versions/node/v22.23.1/bin/node" -e "require('fs').writeFileSync(require('path').join('marcas','v2'),'')"» está no verify, não é um passo do build e não correu aqui | `plantas-runner.json` |
| uma conferência vermelha fecha a corrida, e as outras acabam | U: «"&lt;casa&gt;/.nvm/versions/node/v22.23.1/bin/node" -e "process.exit(3)"» correu e não saiu com 0 | `plantas-runner.json` |
| uma conferência que escreve no dist/ fecha a célula D | D: dist/x/index.html mudou de bytes durante as conferências | `plantas-runner.json` |
| um dist/ de outra cabeça fecha a célula C | C: dist/version.json é de dddddddddddddddddddddddddddddddddddddddd e a árvore está em cccccccccccccccccccccccccccccccccccccccc<br>C: dist/prova.json é de dddddddddddddddddddddddddddddddddddddddd e a árvore está em cccccccccccccccccccccccccccccccccccccccc | `plantas-runner.json` |
| um passo vazio na cadeia não passa despercebido à contagem | U: o verify tem 5 passos pelos &amp;&amp;, e o leitor leu 4 | `plantas-runner.json` |
| uma conferência que escreve no dist/ e repõe os bytes fecha a célula D | D: dist/x/index.html foi escrito durante as conferências (os bytes podem ter voltado, a hora de escrita não) | `plantas-runner.json` |
| uma conferência que troca um ficheiro do dist/ por uma cópia com os mesmos bytes e a mesma hora de escrita fecha a célula D | D: dist/x/index.html foi substituído por outro ficheiro durante as conferências (o inode mudou) | `plantas-runner.json` |
| uma conferência que escreve um ficheiro seguido da árvore e o repõe fecha a célula D | D: fonte.txt foi escrito durante as conferências (os bytes podem ter voltado, a hora de escrita não) | `plantas-runner.json` |
| um cadeia.json de outra construção fecha a célula C | C: dist/cadeia.json foi escrito a 2026-10-06T08:49:10.326Z, antes do carimbo desta construção (2026-10-06T09:48:10.327Z): é de outra construção | `plantas-runner.json` |
| uma conferência que escreve na árvore corre sozinha, depois do grupo | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-runner.json` |
| build vermelho não paga conferências | verify: não correu; o build não ficou verde e não pode pagar passos da união | `plantas-portoes.json` |
| escrita da tranca recusada | portoes: não foi possível tomar a tranca; nenhum portão correu | `plantas-portoes.json` |
| tranca de outra corrida não é substituída nem solta | à espera da tranca da máquina | `plantas-portoes.json` |
| controlo preso não volta a executar o guião | bytes iguais; §0 e JSON conferidos | `plantas-briefs.json` |
| número alterado no brief preso | BRIEF-ENSAIO-prova.md: o §0 escreve «14» e esse número não é o valor de nenhuma das medições nomeadas na sua frase (`objetos`=13).<br>      «Há 14 objetos (`objetos`).» | `plantas-briefs.json` |
| número alterado no guião preso | BRIEF-ENSAIO-prova.md: a medição «objetos» vale 14 hoje e o ficheiro diz 13.<br>      comando: ensaio sintético | `plantas-briefs.json` |
| JSON alterado com os selos antigos | BRIEF-ENSAIO-prova.md: a medição «objetos» vale 13 hoje e o ficheiro diz 14.<br>      comando: ensaio sintético<br>BRIEF-ENSAIO-prova.md: o §0 escreve «13» e esse número não é o valor de nenhuma das medições nomeadas na sua frase (`objetos`=14).<br>      «Há 13 objetos (`objetos`).» | `plantas-briefs.json` |
| controlo: a chamada E1 aceita a ficha limpa | Controlo sem queixa; condição conferida pelo ensaio. | `e1-h2c.json` |
| planta: prazo passado pela check:pais | E1: prazo emCurso passado em evora-2027-capital-europeia-da-cultura (2027-12-31, construção 2028-01-01); a ficha tem de ser decidida: prolongar a data ou tirar o campo emCurso. | `e1-h2c.json` |
| planta: razão em branco pela check:pais | E1: declaração emCurso incompleta em evora-2027-capital-europeia-da-cultura: exige razão e data de fim válida. | `e1-h2c.json` |
| controlo da planta: sem a chamada E1, prazo deixa de ser recusado | Controlo sem queixa; condição conferida pelo ensaio. | `e1-h2c.json` |
| controlo da planta: sem a chamada E1, razão deixa de ser recusado | Controlo sem queixa; condição conferida pelo ensaio. | `e1-h2c.json` |
| sem-ramo | PAROU: o ramo ramo-sintetico não existe (código 14) | `plantas-aterrar.json` |
| cabeca-errada | PAROU: a cabeça de ramo-sintetico é aaaaaaaa, e não bbbb (código 15) | `plantas-aterrar.json` |
| sem-main | PAROU: main não está dentro de ramo-sintetico: a fusão não seria um avanço rápido (código 16) | `plantas-aterrar.json` |
| sem-origin | PAROU: origin/main não está dentro de ramo-sintetico (código 17) | `plantas-aterrar.json` |
| sem-check | PAROU: a verificação portao da cabeça aaaaaaaa não está verde (diz «nada») (código 18) | `plantas-aterrar.json` |
| vermelho | PAROU: a verificação portao da cabeça aaaaaaaa não está verde (diz «failure») (código 18) | `plantas-aterrar.json` |
| verde | ATERROU: aaaaaaaa no ar, verify:deploy verde, portao já conferido nesta cabeça · 09:57:38 UTC | `plantas-aterrar.json` |
| controlo com PACOTE_EXTRA | Só a linha citada, os três códigos e os tempos chegaram. | `plantas-pacote-ma.json` |
| linha retirada do pacote | O pacote recusa a entrega: faltam as linhas citadas de med/portoes/verify.log. | `plantas-pacote-ma.json` |
| citação sem linha de origem | O pacote recusa a citação: med/portoes/verify.log: não existe uma linha que comece por «npm run check:ausente ·». | `plantas-pacote-ma.json` |
| a montagem corre a zero | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| controlo sem variáveis conserva o diff gerado | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| controlo limpo: a cópia conserva os bytes esperados | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| a página construída chega | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| planta do argumento ponto: a montagem conserva a pontuação | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| planta: bytes do sítio diferentes da cabeça são recusados antes da cópia | ValueError: O pacote recusa a árvore do repositório: há modificações em ficheiros seguidos por comitar. | `plantas-pacote-h2.json` |
| planta: bytes do motor diferentes da cabeça são recusados antes da cópia | ValueError: O pacote recusa a árvore do motor: há modificações em ficheiros seguidos por comitar. | `plantas-pacote-h2.json` |
| a montagem corre a zero | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| os dois lados e as exclusões conferem | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| a tabela nomeia o caminho e as linhas retiradas | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| o diff do motor declara as exclusões na primeira linha | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| a conferência dos números chega ao pacote | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| PACOTE_EXTRA conserva os bytes | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| planta: uma secção excluída que volte ao diff morde | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| planta: ficheiro do motor alterado morde | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| reposição dos dois lados | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| nenhum caminho temporário foi guardado | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| a montagem corre a zero | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| um relatório não conferido chega com o código de aviso | Controlo sem queixa; condição conferida pelo ensaio. | `plantas-pacote-h2.json` |
| planta: relatório inexistente recusa pela conferência do relatório | conferir-relatorio.py: não existe o relatório &lt;ensaio&gt;/sitio/medicoes/relatorio-ausente.md | `plantas-pacote-h2.json` |
| partes repetidas de Claude | Uma resposta; entrada da última parte e máximo da saída, marcado como mínimo. | `plantas-ferramentas.json` |
| acumulados Codex e corte temporal | A repetição não duplica os símbolos; o corte subtrai o contador anterior. | `plantas-ferramentas.json` |
| contador recuado | O contador acumulado recuou; não se pode somar esta sessão. | `plantas-ferramentas.json` |
| formato sem utilização | Não há contadores de utilização reconhecidos no intervalo pedido. | `plantas-ferramentas.json` |
| linha truncada | Expecting property name enclosed in double quotes: line 1 column 2 (char 1) | `plantas-ferramentas.json` |
| limpeza de texto, gzip, binários e ligações | Caminhos retirados; segunda passagem sem mudanças; binário e alvo da ligação intactos. | `plantas-ferramentas.json` |
| capturas e recortes nas duas edições | Cinco larguras por edição; PNG, sha256 e recursos conferidos; construção intacta. | `plantas-ferramentas.json` |
| captura de outra cabeça | captar: a cabeça pedida não é a de dist/version.json | `plantas-ferramentas.json` |
| pedido externo na captura | ensaio-pt-390: pedidos externos, recursos em falta ou erros do navegador | `plantas-ferramentas.json` |
| recorte ausente | ensaio-pt-390: o recorte cartao não aparece uma vez | `plantas-ferramentas.json` |
| folha atrasada reduz o alvo | H16: 7906 página(s) do dist/: 7881 com a porta das sugestões dentro do &lt;footer&gt;, 0 fora dele, 0 com mais de uma, 25 sem ela (e 25 sem a das correções; 0 página(s) sem a das sugestões e com a das correções, 0 sem a das correções e com a das sugestões) · nas rotas medidas: 360 de 360 passagens com uma porta no seu marco; 72 porta(s) a 390 e 72 a partir de 1024, 0 sem o alvo (nenhum) · o botão do formulário: 10 medição(ões), 1 abaixo de 44 px (1× button.sugestoes-enviar «Enviar a sugestão» · 88×32 de toque (caixa 127.3×30)) · o campo armadilhado: 10 medição(ões), 0 à vista, no teclado ou na árvore de acessibilidade | `portoes/alvos.json.gz` |
| alvo abaixo de 44 px | H16: 7906 página(s) do dist/: 7881 com a porta das sugestões dentro do &lt;footer&gt;, 0 fora dele, 0 com mais de uma, 25 sem ela (e 25 sem a das correções; 0 página(s) sem a das sugestões e com a das correções, 0 sem a das correções e com a das sugestões) · nas rotas medidas: 360 de 360 passagens com uma porta no seu marco; 72 porta(s) a 390 e 72 a partir de 1024, 0 sem o alvo (nenhum) · o botão do formulário: 10 medição(ões), 1 abaixo de 44 px (1× button.sugestoes-enviar «Enviar a sugestão» · 88×32 de toque (caixa 127.3×30)) · o campo armadilhado: 10 medição(ões), 0 à vista, no teclado ou na árvore de acessibilidade | `portoes/alvos.json.gz` |
| etiqueta cortada depois da primeira linha | H14: 360 passagens de todas as famílias com o rótulo de IA no topo: 1 sem linha única, corpo de 12 px ou posição antes do título (sugestoes/pt@390) | `portoes/alvos.json.gz` |
| ambiente, falha e passo seguinte no instrumento | tempos: o ambiente chegou; o código 7 foi conservado; o passo seguinte não correu; cada passo tem início, fim e duração. | `tempos-planta.log` |

## Limites e questões abertas

- **MA-1.** Os selos de briefs novos ou alterados exigem `python3 scripts/check-briefs.py --escrever-presos` fora do verify. A gravação automática durante o verify não foi feita: escrever num ficheiro seguido fecharia D. Sem a gravação deliberada, o guião volta a correr e conserva a proteção; perde-se só o ganho até selar.
- **MA-2.** A leitura a frio do Opus e a conferência do lugar de direção ficam pendentes. O construtor não as substitui por autoaprovação. O pacote da entrega inclui os guiões inteiros, os tempos e o workflow; a cópia com cinco estragos é preparada separadamente para a leitura.
- **MA-3.** Não foi exposta nesta sessão uma linha final «tokens used» do lançador. O custo final fica por ler do lado que lançou; os contadores parciais de uma sessão não o substituem.

Não houve push, publicação, alteração do motor ou edição do ISSUES.md. Não se mediu o tempo de uma aterragem real, porque não faz parte da autorização do construtor.

## Commits do código e dos ensaios

- `0553c18c` M-A 1: medir cada passo e conservar a referência anterior
- `897f50f7` M-A 2: correr a união conferida dos portões pela tranca
- `37bd6c3b` M-A 3: prender as medições verdes dos briefs por sha256
- `5eec0908` M-A 4: provar a ligação da E1 uma vez no verify
- `f247897d` M-A 5: esperar pela página e provar as mesmas medidas
- `0ec35088` M-A 6: indicar a corrida de main sem esperar pela repetição
- `0ff9ccda` M-A 7: entregar só os registos citados e conferir a sua presença
- `225f4825` M-A 8: reunir custos, limpeza e capturas com provas próprias

O commit final de documentação acrescenta este relatório e as medições. Os dois trailers estão em cada commit da entrega.
