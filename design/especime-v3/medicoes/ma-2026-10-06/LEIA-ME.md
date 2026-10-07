# M-A · maquinaria medida, com a proteção conferida

## A passagem M-A-b

Cabeça do código: `822fd960ecbe2884b22036742cb3e80dd9324231`. Cabeça do brief e do «antes» limpo: `207d71346ea034943058fffcbbb926ddafa79e90`. A cabeça final é o commit que junta este relatório e as provas, indicado na resposta de entrega.

A passagem põe as plantas na cadeia, obriga o GitHub a executar os guiões dos briefs e fecha as falhas da maquinaria apontadas pela leitura a frio. O pacote entregue à primeira leitura foi montado pelo caminho antigo, com registos inteiros; não foi uma utilização real do filtro de citações novo.

## Tempos e método

A corrida inteira nova levou 414,720 s; o «antes» limpo levou 1482,695 s. O check:leituras levou 12,566 s, na própria corrida final.

| Medida, em segundos | Antes limpo | Primeira passagem, novo | Primeira passagem, antigo | M-A-b |
|---|---:|---:|---:|---:|
| corrida inteira | 1482,695 | 426,382 | 1104,242 | 414,720 |
| build | 233,204 | 205,391 | 220,560 | 193,121 |
| verify | 1249,015 | 219,714 | 883,229 | 220,239 |
| check:briefs | 186,426 | 0,335 | 0,221 | 0,256 |
| check:leituras | não medido | não medido | não medido | 12,566 |
| check:alvos | 332,703 | 190,770 | 181,782 | 180,857 |
| auto-teste do país | não medido | 1,681 | 1,007 | 1,237 |
| typecheck | 0,249 | 0,242 | 0,227 | 0,214 |

Fontes: os `tempos.json` das pastas indicadas nas colunas. As colunas da primeira passagem são históricas e conservam a cabeça escrita nesses ficheiros. O «antes» foi refeito numa worktree temporária de `207d7134`, com o `portoes.sh` dessa cabeça, pela tranca comum, e `estado.inicio` e `estado.fim` vazios. A instrumentação ficou fora da árvore; a shell só acrescentou a opção de saída JSON ao guião dos alvos. O auto-teste interno dessa cabeça não tinha relógio próprio, pelo que o seu tempo fica incluído no `check:pais` e não é inventado em separado.

A duração inteira é o intervalo entre o primeiro e o último processo instrumentado, não a soma das durações paralelas. A espera pela tranca não entra. Durante as medições esta sessão não lançou outras conferências. O motor foi passado por `RESEARCHHUB_DIR=<motor>` em leitura. A worktree temporária foi removida depois da conferência do estado limpo.

A corrida final cumpre o teto de doze minutos.

## Códigos lidos dos ficheiros

| Corrida | build.codigo | verify.codigo | typecheck.codigo |
|---|---:|---:|---:|
| antes | 0 | 0 | 0 |
| portoes | 0 | 0 | 0 |
| portoes-antigo | 0 | 0 | 0 |
| portoes-b | 0 | 0 | 0 |

As cabeças de entrada e saída são iguais em cada corrida. O workflow não mudou nesta passagem. A célula U confirmou a cobertura, D a ausência de escritas durante o verify, e C a cabeça da construção.

## O que mudou por achado

| Achado | Mudança | Planta que o protege |
|---|---|---|
| `1` | Estrago só na cópia; a U já recusava passos ausentes. | Conferência retirada da escolha fecha U. |
| `2` | Estrago só na cópia; a aterragem já parava com o check-run vermelho. | Sem check e check vermelho param antes de publicar, com comandos substituídos. |
| `3` | Estrago só na cópia; o selo já incluía o sha256 do guião. | Mudança do guião provoca reexecução. |
| `4` | Estrago só na cópia; a interrupção já estava ligada. A planta foi alargada pelo achado 9. | TERM depois de tomar a tranca para e liberta. |
| `5` | Estrago só na cópia; a tabela tinha o valor dos ficheiros. | O gerador relê os tempos e os códigos. |
| `6` | `check:leituras` descobre todos os guiões Python da pasta e entra no verify e no GitHub. O ambiente dos processos sintéticos fica isolado do relógio real. | Cada guião afirma o código e a mensagem; a cadeia fica vermelha se qualquer um falhar. |
| `7` | Só `--escrever-presos` grava, depois de todos os guiões correrem verdes nessa invocação, com cabeça, hora, invocação e identificador. CI ignora selos; a saída e o mapa dizem a regra. | Selo manual recusado; gravação reexecuta; corrida vermelha não sela; cada variável de CI força execução. |
| `8` | O «antes» foi substituído por uma corrida limpa na cabeça do brief. | O gerador exige estados vazios, cabeças iguais e bytes do portoes.sh iguais ao objeto Git. |
| `9` | A tranca caduca pela regra da M46 e a espera imprime o dono. TERM termina o grupo do portão antes de soltar a tranca. | Tranca ocupada conservada; caducada substituída; TERM depois de tomada para a corrida e solta a tranca. |
| `10` | A limpeza cobre pastas temporárias e o scratchpad; só substitui o utilizador como componente de caminho. | Temporários; palavra comum intacta; texto e gzip; idempotência; binários e ligações. |
| `11` | A conferência relê o relatório e o ficheiro entregue, com extração independente das citações. | Uma linha apagada durante a escrita fecha a montagem pelo fluxo normal. |
| `12` | Registos reduzidos ou omitidos são ditos com os tamanhos; `PACOTE_LOGS=inteiros` conserva-os completos. | Aviso e tamanhos conferidos; registos citados e sem citação chegam byte a byte no modo inteiro. |
| `13` | A opção chama-se `--so-a-celula-e1-no-autoteste`; a mensagem verde vive dentro da chamada E1. | Prazo, razão e retirada da chamada; opção plantada no guião check:pais do package.json recusada. |
| `14` | A guarda reconhece partes de tempos e apaga-as antes de qualquer relógio novo. | Pasta com partes de corrida morta é recusada, sem as misturar noutra corrida. |
| `15` | Contadores nulos ou ausentes conservam null; a regressão compara o último valor conhecido. | Nulo sem TypeError; campo ausente; regressão depois de null. |
| `16` | A lista do mapa foi lida da cadeia inteira, incluindo o auto-teste do país e as leituras; as referências foram acertadas. | `conferir-mapa.py`, com o resultado conservado em plantas-b. |
| Code | `soltar_a_tranca`; chave falhas única; limpador e custos em funções legíveis; globais da espera repostos em finally; imports e comentário E1; regra dos logs no cabeçalho do pacote. | As mesmas plantas, as plantas da espera e os portões finais. |

## Cobertura observada

O mapa ficou com 0 citações longe, 0 por encontrar e 0 referências para lá do fim, lidas de plantas-b/mapa.log. Foram observados 49 comandos distintos no «antes» e 50 na corrida nova, sem retirar comandos. O auto-teste que antes estava dentro do check:pais aparece agora como passo próprio; fica fora desta contagem de comandos para a comparação não o contar duas vezes. O check:leituras correu 8 guiões.

| Comando | Antes, execuções | M-A-b, execuções |
|---|---:|---:|
| `astro build` | 1 | 1 |
| `npm run cartoes` | 1 | 1 |
| `npm run check:alcance` | 1 | 1 |
| `npm run check:alvos` | 1 | 1 |
| `npm run check:areas` | 2 | 1 |
| `npm run check:briefs` | 1 | 1 |
| `npm run check:cabeca` | 1 | 1 |
| `npm run check:cadeia` | 2 | 1 |
| `npm run check:cartao` | 1 | 1 |
| `npm run check:cruzamento` | 2 | 1 |
| `npm run check:css` | 1 | 1 |
| `npm run check:dados` | 2 | 1 |
| `npm run check:datas` | 2 | 1 |
| `npm run check:documentos` | 2 | 1 |
| `npm run check:explicacoes` | 1 | 1 |
| `npm run check:fontes` | 1 | 1 |
| `npm run check:formas` | 2 | 1 |
| `npm run check:formato` | 2 | 1 |
| `npm run check:frases-compostas` | 1 | 1 |
| `npm run check:indice` | 1 | 1 |
| `npm run check:indice-do-sitio` | 1 | 1 |
| `npm run check:leituras` | 0 | 1 |
| `npm run check:lingua` | 2 | 1 |
| `npm run check:lugar` | 1 | 1 |
| `npm run check:lugares` | 2 | 1 |
| `npm run check:mapa` | 2 | 1 |
| `npm run check:moldura` | 1 | 1 |
| `npm run check:mortos` | 1 | 1 |
| `npm run check:navegacao` | 2 | 1 |
| `npm run check:nomes` | 2 | 1 |
| `npm run check:pais` | 2 | 1 |
| `npm run check:palavras` | 1 | 1 |
| `npm run check:primeira` | 1 | 1 |
| `npm run check:privacidade` | 1 | 1 |
| `npm run check:regioes` | 2 | 1 |
| `npm run check:registo` | 2 | 1 |
| `npm run check:rotulos` | 1 | 1 |
| `npm run check:series` | 1 | 1 |
| `npm run check:sugestoes` | 1 | 1 |
| `npm run check:voz` | 2 | 1 |
| `npm run design:feixe` | 1 | 1 |
| `npm run gate:html` | 2 | 1 |
| `npm run ledger:check` | 2 | 1 |
| `npm run mapa:unidades` | 1 | 1 |
| `npm run mapa:unidades -- --verifica` | 1 | 1 |
| `npm run provar:eyetext` | 1 | 1 |
| `npm run provar:guardas` | 1 | 1 |
| `npm run sinais` | 2 | 1 |
| `npm run stamp:version` | 1 | 1 |
| `npm run typecheck` | 1 | 1 |

## Plantas e mensagens

As mensagens vêm dos ficheiros das plantas, relidos pelo gerador. Os controlos sem queixa são assinalados como tal.

| Planta ou controlo | Mensagem observada | Origem |
|---|---|---|
| sem-ramo | PAROU: o ramo ramo-sintetico não existe (código 14) | `plantas-b/check-leituras.json` |
| cabeca-errada | PAROU: a cabeça de ramo-sintetico é aaaaaaaa, e não bbbb (código 15) | `plantas-b/check-leituras.json` |
| sem-main | PAROU: main não está dentro de ramo-sintetico: a fusão não seria um avanço rápido (código 16) | `plantas-b/check-leituras.json` |
| sem-origin | PAROU: origin/main não está dentro de ramo-sintetico (código 17) | `plantas-b/check-leituras.json` |
| sem-check | PAROU: a verificação portao da cabeça aaaaaaaa não está verde (diz «nada») (código 18) | `plantas-b/check-leituras.json` |
| vermelho | PAROU: a verificação portao da cabeça aaaaaaaa não está verde (diz «failure») (código 18) | `plantas-b/check-leituras.json` |
| verde | ATERROU: aaaaaaaa no ar, verify:deploy verde, portao já conferido nesta cabeça · 12:57:55 UTC | `plantas-b/check-leituras.json` |
| controlo preso não volta a executar o guião | bytes iguais; §0 e JSON conferidos | `plantas-b/check-leituras.json` |
| a gravação executa mesmo com selo válido | Só se selam guiões verdes desta invocação. | `plantas-b/check-leituras.json` |
| selo escrito à mão sem execução | BRIEF-ENSAIO-prova.md: selo recusado: falta o registo de execução verde com cabeça, hora e invocação. | `plantas-b/check-leituras.json` |
| GITHUB_ACTIONS ignora um selo válido | O guião correu com a variável de GitHub/CI no ambiente. | `plantas-b/check-leituras.json` |
| CI ignora um selo válido | O guião correu com a variável de GitHub/CI no ambiente. | `plantas-b/check-leituras.json` |
| número alterado no brief preso | BRIEF-ENSAIO-prova.md: o §0 escreve «14» e esse número não é o valor de nenhuma das medições nomeadas na sua frase (`objetos`=13).<br>      «Há 14 objetos (`objetos`).» | `plantas-b/check-leituras.json` |
| número alterado no guião preso | BRIEF-ENSAIO-prova.md: a medição «objetos» vale 14 hoje e o ficheiro diz 13.<br>      comando: ensaio sintético | `plantas-b/check-leituras.json` |
| JSON alterado com os selos antigos | BRIEF-ENSAIO-prova.md: a medição «objetos» vale 13 hoje e o ficheiro diz 14.<br>      comando: ensaio sintético<br>BRIEF-ENSAIO-prova.md: o §0 escreve «13» e esse número não é o valor de nenhuma das medições nomeadas na sua frase (`objetos`=14).<br>      «Há 13 objetos (`objetos`).» | `plantas-b/check-leituras.json` |
| corrida vermelha não produz selo | BRIEF-ENSAIO-prova.md: a medição «objetos» vale 13 hoje e o ficheiro diz 14.<br>      comando: ensaio sintético<br>BRIEF-ENSAIO-prova.md: o §0 escreve «13» e esse número não é o valor de nenhuma das medições nomeadas na sua frase (`objetos`=14).<br>      «Há 13 objetos (`objetos`).» | `plantas-b/check-leituras.json` |
| página alterada | paginas: comparação diferente | `plantas-b/check-leituras.json` |
| partes repetidas de Claude | Uma resposta; entrada da última parte e máximo da saída, marcado como mínimo. | `plantas-b/check-leituras.json` |
| acumulados Codex e corte temporal | A repetição não duplica os símbolos; o corte subtrai o contador anterior. | `plantas-b/check-leituras.json` |
| contador recuado | O contador acumulado recuou; não se pode somar esta sessão. | `plantas-b/check-leituras.json` |
| formato sem utilização | Não há contadores de utilização reconhecidos no intervalo pedido. | `plantas-b/check-leituras.json` |
| linha truncada | Expecting property name enclosed in double quotes: line 1 column 2 (char 1) | `plantas-b/check-leituras.json` |
| contador Codex nulo | output_tokens conserva null, sem TypeError nem zero fabricado. | `plantas-b/check-leituras.json` |
| contador Codex ausente | Um campo antes presente e agora ausente fica null. | `plantas-b/check-leituras.json` |
| regressão depois de contador nulo | O contador acumulado recuou; não se pode somar esta sessão. | `plantas-b/check-leituras.json` |
| limpeza de texto, gzip, binários e ligações | Caminhos retirados; segunda passagem sem mudanças; binário e alvo da ligação intactos. | `plantas-b/check-leituras.json` |
| caminhos temporários | Pastas temporárias do sistema e TMPDIR retirados. | `plantas-b/check-leituras.json` |
| utilizador dentro de palavra comum | transportoes e portoes intactos; só o componente do caminho mudou. | `plantas-b/check-leituras.json` |
| scratchpad e TMPDIR pelo ambiente | OEDP_SCRATCHPAD e TMPDIR chegaram ao limpador. | `plantas-b/check-leituras.json` |
| capturas e recortes nas duas edições | Cinco larguras por edição; PNG, sha256 e recursos conferidos; construção intacta. | `plantas-b/check-leituras.json` |
| captura de outra cabeça | captar: a cabeça pedida não é a de dist/version.json | `plantas-b/check-leituras.json` |
| pedido externo na captura | ensaio-pt-390: pedidos externos, recursos em falta ou erros do navegador | `plantas-b/check-leituras.json` |
| recorte ausente | ensaio-pt-390: o recorte cartao não aparece uma vez | `plantas-b/check-leituras.json` |
| controlo com PACOTE_EXTRA | Só as linhas citadas, os três códigos e os tempos chegaram. | `plantas-b/check-leituras.json` |
| registos omitidos são ditos com o tamanho | Pacote: registo reduzido ou deixado de fora: med/portoes/build.log (22 bytes; 0 conservados).<br>Pacote: registo reduzido ou deixado de fora: med/portoes/verify.log (104 bytes; 76 conservados). | `plantas-b/check-leituras.json` |
| PACOTE_LOGS conserva os registos inteiros | Os registos citados e sem citação chegaram byte a byte. | `plantas-b/check-leituras.json` |
| linha retirada durante a montagem normal | O pacote recusa a entrega: faltam as linhas citadas de med/portoes/verify.log. | `plantas-b/check-leituras.json` |
| citação sem linha de origem | O pacote recusa a citação: med/portoes/verify.log: não existe uma linha que comece por «npm run check:ausente ·». | `plantas-b/check-leituras.json` |
| a montagem corre a zero | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| controlo sem variáveis conserva o diff gerado | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| controlo limpo: a cópia conserva os bytes esperados | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| a página construída chega | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| planta do argumento ponto: a montagem conserva a pontuação | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| planta: bytes do sítio diferentes da cabeça são recusados antes da cópia | ValueError: O pacote recusa a árvore do repositório: há modificações em ficheiros seguidos por comitar. | `plantas-b/check-leituras.json` |
| planta: bytes do motor diferentes da cabeça são recusados antes da cópia | ValueError: O pacote recusa a árvore do motor: há modificações em ficheiros seguidos por comitar. | `plantas-b/check-leituras.json` |
| a montagem corre a zero | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| os dois lados e as exclusões conferem | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| a tabela nomeia o caminho e as linhas retiradas | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| o diff do motor declara as exclusões na primeira linha | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| a conferência dos números chega ao pacote | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| PACOTE_EXTRA conserva os bytes | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| planta: uma secção excluída que volte ao diff morde | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| planta: ficheiro do motor alterado morde | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| reposição dos dois lados | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| nenhum caminho temporário foi guardado | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| a montagem corre a zero | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| um relatório não conferido chega com o código de aviso | Condição afirmada pelo ensaio; controlo verde. | `plantas-b/check-leituras.json` |
| planta: relatório inexistente recusa pela conferência do relatório | conferir-relatorio.py: não existe o relatório &lt;ensaio&gt;/sitio/medicoes/relatorio-ausente.md | `plantas-b/check-leituras.json` |
| build vermelho não paga conferências | verify: não correu; o build não ficou verde e não pode pagar passos da união | `plantas-b/check-leituras.json` |
| escrita da tranca recusada | portoes: não foi possível tomar a tranca; nenhum portão correu | `plantas-b/check-leituras.json` |
| tranca de outra corrida não é substituída nem solta | à espera da tranca da máquina: tranca de ensaio | `plantas-b/check-leituras.json` |
| tranca caducada deixa correr | tranca com mais de quarenta minutos (tranca de ensaio); ignora-se | `plantas-b/check-leituras.json` |
| partes de corrida morta | portoes: a pasta já tem códigos ou partes .tempos; escolha uma pasta nova | `plantas-b/check-leituras.json` |
| TERM depois de tomar a tranca | portoes: corrida interrompida; os portões seguintes não correm | `plantas-b/check-leituras.json` |
| controlo da instrumentação | tempos: a chamada por ligação escreveu os mesmos tempos.json.<br>tempos: o ambiente chegou; o código 7 foi conservado; o passo seguinte não correu; cada passo tem início, fim e duração. | `plantas-b/check-leituras.json` |
| planta: opção da E1 no package.json | check:pais: a opção só da E1 não pode entrar na cadeia de produção. | `plantas-b/e1-h2c.json` |
| controlo: a chamada E1 aceita a ficha limpa | E1: prazo e razão conferidos pela chamada da check:pais. | `plantas-b/e1-h2c.json` |
| planta: prazo passado pela check:pais | E1: prazo emCurso passado em evora-2027-capital-europeia-da-cultura (2027-12-31, construção 2028-01-01); a ficha tem de ser decidida: prolongar a data ou tirar o campo emCurso. | `plantas-b/e1-h2c.json` |
| planta: razão em branco pela check:pais | E1: declaração emCurso incompleta em evora-2027-capital-europeia-da-cultura: exige razão e data de fim válida. | `plantas-b/e1-h2c.json` |
| controlo da planta: sem a chamada E1, prazo deixa de ser recusado | Controlo sem queixa E1. | `plantas-b/e1-h2c.json` |
| controlo da planta: sem a chamada E1, razão deixa de ser recusado | Controlo sem queixa E1. | `plantas-b/e1-h2c.json` |
| a cadeia limpa passa, e o que o build já correu não corre outra vez | Controlo verde, condição afirmada pelo ensaio. | `portoes-b/verify.json` |
| uma conferência nova só no verify corre sozinha | Controlo verde, condição afirmada pelo ensaio. | `portoes-b/verify.json` |
| uma conferência tirada da escolha fecha a célula U | U: «"&lt;casa&gt;/.nvm/versions/node/v22.23.1/bin/node" -e "require('fs').writeFileSync(require('path').join('marcas','v2'),'')"» está no verify, não é um passo do build e não correu aqui | `portoes-b/verify.json` |
| uma conferência vermelha fecha a corrida, e as outras acabam | U: «"&lt;casa&gt;/.nvm/versions/node/v22.23.1/bin/node" -e "process.exit(3)"» correu e não saiu com 0 | `portoes-b/verify.json` |
| uma conferência que escreve no dist/ fecha a célula D | D: dist/x/index.html mudou de bytes durante as conferências | `portoes-b/verify.json` |
| um dist/ de outra cabeça fecha a célula C | C: dist/version.json é de dddddddddddddddddddddddddddddddddddddddd e a árvore está em cccccccccccccccccccccccccccccccccccccccc<br>C: dist/prova.json é de dddddddddddddddddddddddddddddddddddddddd e a árvore está em cccccccccccccccccccccccccccccccccccccccc | `portoes-b/verify.json` |
| um passo vazio na cadeia não passa despercebido à contagem | U: o verify tem 5 passos pelos &amp;&amp;, e o leitor leu 4 | `portoes-b/verify.json` |
| uma conferência que escreve no dist/ e repõe os bytes fecha a célula D | D: dist/x/index.html foi escrito durante as conferências (os bytes podem ter voltado, a hora de escrita não) | `portoes-b/verify.json` |
| uma conferência que troca um ficheiro do dist/ por uma cópia com os mesmos bytes e a mesma hora de escrita fecha a célula D | D: dist/x/index.html foi substituído por outro ficheiro durante as conferências (o inode mudou) | `portoes-b/verify.json` |
| uma conferência que escreve um ficheiro seguido da árvore e o repõe fecha a célula D | D: fonte.txt foi escrito durante as conferências (os bytes podem ter voltado, a hora de escrita não) | `portoes-b/verify.json` |
| um cadeia.json de outra construção fecha a célula C | C: dist/cadeia.json foi escrito a 2026-10-06T12:46:07.506Z, antes do carimbo desta construção (2026-10-06T13:45:07.506Z): é de outra construção | `portoes-b/verify.json` |
| uma conferência que escreve na árvore corre sozinha, depois do grupo | Controlo verde, condição afirmada pelo ensaio. | `portoes-b/verify.json` |
| folha atrasada reduz o alvo | H16: 7906 página(s) do dist/: 7881 com a porta das sugestões dentro do &lt;footer&gt;, 0 fora dele, 0 com mais de uma, 25 sem ela (e 25 sem a das correções; 0 página(s) sem a das sugestões e com a das correções, 0 sem a das correções e com a das sugestões) · nas rotas medidas: 360 de 360 passagens com uma porta no seu marco; 72 porta(s) a 390 e 72 a partir de 1024, 0 sem o alvo (nenhum) · o botão do formulário: 10 medição(ões), 1 abaixo de 44 px (1× button.sugestoes-enviar «Enviar a sugestão» · 88×32 de toque (caixa 127.3×30)) · o campo armadilhado: 10 medição(ões), 0 à vista, no teclado ou na árvore de acessibilidade | `portoes-b/alvos.json.gz` |
| alvo abaixo de 44 px | H16: 7906 página(s) do dist/: 7881 com a porta das sugestões dentro do &lt;footer&gt;, 0 fora dele, 0 com mais de uma, 25 sem ela (e 25 sem a das correções; 0 página(s) sem a das sugestões e com a das correções, 0 sem a das correções e com a das sugestões) · nas rotas medidas: 360 de 360 passagens com uma porta no seu marco; 72 porta(s) a 390 e 72 a partir de 1024, 0 sem o alvo (nenhum) · o botão do formulário: 10 medição(ões), 1 abaixo de 44 px (1× button.sugestoes-enviar «Enviar a sugestão» · 88×32 de toque (caixa 127.3×30)) · o campo armadilhado: 10 medição(ões), 0 à vista, no teclado ou na árvore de acessibilidade | `portoes-b/alvos.json.gz` |
| etiqueta cortada depois da primeira linha | H14: 360 passagens de todas as famílias com o rótulo de IA no topo: 1 sem linha única, corpo de 12 px ou posição antes do título (sugestoes/pt@390) | `portoes-b/alvos.json.gz` |

## Limites e questões

- **MA-1.** A selagem continua a ser uma gravação deliberada fora do verify. O registo torna a execução auditável, mas não é uma assinatura contra falsificação deliberada dos ficheiros. A execução integral no CI é a prova de cada aterragem.
- **MA-2.** A leitura a frio da primeira passagem e a decisão do lugar de direção foram recebidas e aplicadas. A aceitação desta passagem pertence ao lugar de direção.
- **MA-3.** O total final de símbolos do lançador não está exposto nesta sessão; não se inventa a partir dos contadores parciais.
- **MA-4, resolvida.** A cabeça do brief não exportava as páginas dos alvos. Depois da corrida cronometrada, uma sonda externa acrescentou em memória apenas a escrita final dos resultados já calculados pelo guião original. O SHA identifica os bytes originais; o carregador fica em `antes/instrumentacao/observar-alvos.mjs`; o código dessa corrida e o estado limpo posterior também ficam conservados. As 360 passagens são iguais, como objetos completos, às da cabeça do código nova, sem arredondamento. Também são iguais as rotas, larguras, células, resultados do axe, violações graves e alvos maus. Esta exportação separada não entra no tempo do «antes».

- **MA-5, resolvida.** O agregador comparava o caminho da invocação com o caminho real do módulo e podia sair sem escrever quando chamado por uma ligação. Passa a resolver a ligação; a planta retira o JSON anterior e exige um novo ficheiro idêntico. A recolha do «antes» usou o caminho real, e o seu ficheiro de tempos foi lido e conferido.

Não houve push, publicação ou alteração do motor. Os testes da aterragem substituem os comandos externos. A espera por uma tranca de outra worktree foi respeitada.

## Commits desta passagem

- `58ab143b` `M-A-b 6`: correr as plantas de leituras na cadeia do verify
- `ccb8ce6c` `M-A-b 7`: selar só execuções verdes e correr todos os briefs no CI
- `a1c22ee3` `M-A-b 8`: refazer a referência numa árvore limpa de 207d7134
- `f7df11a2` `M-A-b 9`: identificar e expirar a tranca, parando o grupo no TERM
- `dd41cff4` `M-A-b 10`: limpar temporários e preservar palavras com o nome de utilizador
- `6e9839fd` `M-A-b 11`: reler as citações por um caminho independente na entrega
- `94377455` `M-A-b 12`: declarar os registos omitidos e permitir cópias inteiras
- `355726f1` `M-A-b 13`: reservar a saída pela E1 ao auto-teste e provar a cadeia inteira
- `72e8cdd8` `M-A-b 14`: recusar e retirar partes de tempos de corridas mortas
- `b0576aa3` `M-A-b 15`: conservar contadores desconhecidos sem TypeError
- `74eff103` `M-A-b 16`: alinhar o mapa com a cadeia completa e acertar as referências
- `822fd960` M-A-b Code: tornar a maquinaria legível e repor o estado no finally

O último commit junta apenas o relatório e as provas. Os trailers pedidos estão nos commits desta passagem.

<!-- portao: portoes-b/verify.log | U ✓ -->
<!-- portao: portoes-b/verify.log | D ✓ -->
<!-- portao: portoes-b/verify.log | C ✓ -->
<!-- portao: portoes-b/verify.log | npm run check:briefs · -->
<!-- portao: portoes-b/verify.log | npm run check:leituras · -->
<!-- portao: portoes-b/verify.log | npm run check:series · -->
<!-- portao: portoes-b/verify.log | npm run check:pais:auto-teste · -->
<!-- portao: portoes-b/verify.log | npm run check:alvos · -->
