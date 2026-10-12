# ER1: o recibo incorporável

A entrega permite copiar cada número com a sua fonte, período, data, atribuição e recibo, nas duas edições. O Método ficou por alterar: a secção sobre o conjunto de dados pressuposta no brief não existe nesta base e a amarra do texto governado recusou a sondagem de alteração; o ficheiro foi reposto byte a byte. A leitura a frio do Opus e a conferência do lugar de direção continuam por fazer.

Relatório gerado por `node design/especime-v3/medicoes/er1-2026-10-06/fechar.mjs`, a partir dos ficheiros desta pasta. Construtor indicado no lançamento: Codex gpt-6-astra, raciocínio xhigh.

Base: `f5fb384e5c7a6664a137ada57667700ed5eace96`. Cabeça do código: `645ecde7ea61c044d7c0648b020c6392a48674ce`. A cabeça final da entrega é o commit que contém este relatório e as provas; lê-se com `git rev-parse HEAD` e consta da resposta da sessão. Não se grava aqui um resumo autorreferente.

| Commit de código |
|---|
| 16ddc66c22876784284c7240ca1d9a5699ea4a08 ER1: incorporar cada número com fonte e atualização pelo JSON |
| 0c63b7a496dab5a93b238625821897db3455cfbf ER1: guardar o blogue de ensaio e exercer a releitura no navegador |
| 8252915ed97cc4a96eacc20881722201e470c17d ER1: conferir o código antes de ler a prosa no portão do índice |
| eeb282d97baa9dad851a8ba7e0df700a570bbc34 ER1: comparar o texto literal que o navegador copia |
| 645ecde7ea61c044d7c0648b020c6392a48674ce ER1: conferir o campo usado pelo botão de cópia |

## O que se mediu antes de construir

O brief foi medido de novo em antes-brief.json pelo guião do brief; antes.json guarda a cabeça, os cabeçalhos e os casos relevantes do livro. Há 15 linhas com tentativas que não confirmaram o número. Há 365 linhas sem access_date, 22 sem reference_date e 365 sem fonte direta. São campos ausentes reais, incluindo linhas calculadas, não datas ou fontes que o incorporador possa inventar.

A redação do brief que manda usar a última entrada de verifications precisa de correção: inacessivel ou diverge não são confirmação. O JSON apresentado usa a confirmação igual mais recente, posterior à última mudança para o valor de agora, ou access_date. Uma tentativa sem confirmação não avança a data. A ordem do vetor não decide qual é a última data. As plantas de datas em celula.json exercem esta diferença.

O código estático usa access_date da linha. Quando faltam campos, diz Calculado, período não indicado ou data de leitura não indicada, nas traduções declaradas em strings.mjs. Conserva as ressalvas da linha. A atribuição completa vem da licença existente.

## Código pronto a copiar

Linha de exemplo: `custo-unitario-do-trabalho-2024`. Os blocos seguintes são extraídos dos recibos construídos, sem transcrição manual de números.

Português:

```html
<p class="oedp-numero" lang="pt-PT" data-oedp="custo-unitario-do-trabalho-2024" data-oedp-valor="17,9" data-oedp-lido="2026-10-05"><a href="https://oestadodopaís.pt/livro-razao/custo-unitario-do-trabalho-2024">Custo do trabalho por unidade produzida (custo unitário do trabalho), 2024: 17,9 <span lang="pt-PT">variação em três anos, %</span></a> <span lang="en">Eurostat</span>, lido a 05.10.2026 · O Estado do País, oestadodopaís.pt, CC BY 4.0</p><script async src="https://oestadodopaís.pt/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>
```

Inglês:

```html
<p class="oedp-numero" lang="en" data-oedp="custo-unitario-do-trabalho-2024" data-oedp-valor="17,9" data-oedp-lido="2026-10-05"><a href="https://oestadodopaís.pt/en/ledger/custo-unitario-do-trabalho-2024">Labour cost per unit of output (unit labour cost), 2024: 17,9 <span lang="en">three-year change, %</span></a> <span lang="en">Eurostat</span>, read on 05.10.2026 · O Estado do País, oestadodopaís.pt, CC BY 4.0</p><script async src="https://oestadodopaís.pt/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>
```

O botão usa a área de transferência; se esta não existir ou recusar, seleciona todo o campo. A célula do navegador exerceu esses caminhos nas duas edições. Sem JavaScript, o campo continua disponível e o botão fica oculto.

## O guião e o blogue de ensaio

public/incorporar.js tem 3322 bytes, é gerado por scripts/gerar-incorporar.mjs a partir da função ES2015 em scripts/incorporar-cliente.mjs e não tem dependências. O gerador confere os bytes publicados em modo --conferir. O guião só procura os seus parágrafos, valida o identificador, pede exclusivamente o JSON dessa linha à origem fixa e constrói o resultado com nós de texto. Não usa HTML, código ou endereços vindos do JSON. O pedido omite credenciais e referenciador e recusa redirecionamentos. O elemento script também omite o referenciador e usa crossorigin anonymous.

A atualização acompanha revisões da mesma linha. Não muda automaticamente para um novo período ou outro identificador. Cada parágrafo é pedido apenas uma vez mesmo quando a página cola várias cópias do guião. Não há consulta periódica enquanto a página permanece aberta.

O modelo HTML é tests/incorporar/blogue.html; tests/incorporar/navegador.mjs preenche-o com o código construído e serve-o numa origem local diferente do dist. Apenas o argumento da origem e o src do guião são mapeados ao servidor local; os pedidos entre portas distintas são reais, sem fulfill.

| Caso | Resultado provado |
|---|---|
| Valor atual | Custo do trabalho por unidade produzida (custo unitário do trabalho), 2024: 17,9 variação em três anos, % Eurostat, lido a 05.10.2026 · O Estado do País, oestadodopaís.pt, CC BY 4.0 |
| Valor antigo | Custo do trabalho por unidade produzida (custo unitário do trabalho), 2024: 17,9 variação em três anos, % Eurostat, lido a 05.10.2026 · O Estado do País, oestadodopaís.pt, CC BY 4.0 · Este número foi atualizado a 05.10.2026 |
| Identificador inexistente | O pedido falha e o parágrafo colado fica inteiro, sem aviso inventado. |
| Releitura sem mudar o valor | Valor 17,9, data 2026-10-06, sem aviso de mudança de valor. |

capturas-prova.json guarda texto, atributos e todos os pedidos em cada edição. O valor antigo do ensaio (17,7) vem de corrections e passa ao publicado (17,9). A data fictícia do caso releitura é calculada apenas no ensaio, nunca escrita no livro ou nas páginas entregues. Os modos sem JavaScript, sem CORS, resposta indisponível, JSON malformado, identidade errada e redirecionamento preservaram o texto colado. Cookies no ensaio: 0. Não houve pedidos a outras origens, corpo nos pedidos ou referenciador, nem alteração do parágrafo da página anfitriã.

Estas células exercem os caminhos do guião auditado. A busca estática não é uma prova geral sobre qualquer JavaScript que alguém possa escrever no futuro; a leitura a frio deve conferir os caminhos que os ensaios não cobrem.

## Cabeçalhos

| Caminho | CORS antes | CORS depois | X-Frame-Options antes e depois |
|---|---|---|---|
| /livro-razao/custo-unitario-do-trabalho-2024.json | ausente | * | SAMEORIGIN |
| /livro-razao.json | ausente | * | SAMEORIGIN |
| /livro-razao.csv | ausente | * | SAMEORIGIN |
| /incorporar.js | ausente | * | SAMEORIGIN |
| /livro-razao/custo-unitario-do-trabalho-2024 | ausente | ausente | SAMEORIGIN |
| /en/ledger/custo-unitario-do-trabalho-2024 | ausente | ausente | SAMEORIGIN |
| / | ausente | ausente | SAMEORIGIN |
| /js/copiar-incorporacao.js | ausente | ausente | SAMEORIGIN |
| /metodo | ausente | ausente | SAMEORIGIN |

A única regra nova é:

```json
[
  {
    "src": "^/(?:livro-razao/(.*)\\.json|livro-razao\\.json|livro-razao\\.csv|incorporar\\.js)$",
    "headers": {
      "Access-Control-Allow-Origin": "*"
    },
    "continue": true
  }
]
```

Os cabeçalhos anteriores e todas as restantes rotas foram comparados com a base e permanecem idênticos. cabecalhos.json guarda a comparação e as regras completas. O ensaio local aplica essas regras e a planta sem CORS falha entre portas reais. O verify:deploy foi alargado à mesma conferência, incluindo o guião, os dados e as páginas HTML; ainda não foi executado contra uma publicação desta cabeça porque esta sessão não publicou nem fez push.

## Réguas e plantas

Foram conferidos 6390 recibos e 3195 JSON. O portão recompõe o código carácter a carácter e confere os 12 campos da apresentação por uma implementação que não importa o compositor. Confere a leitura literal do campo, incluindo comentários que o navegador copiaria, e exige que esse seja o campo usado pelo botão. Só depois retira o textarea da leitura da prosa nos portões de HTML, voz, língua, lugar e índice. Não há uma classe que dispense conteúdo arbitrário da conferência. A L1 conserva o teto existente: o texto dentro do campo não cria ligações na página e o botão não é uma ligação.

As frases novas foram declaradas nas duas línguas e acrescentadas ao inventário com leitura editorial por fazer. Os valores de teto dos portões não foram elevados.

| Planta | Mensagem afirmada | Mordeu |
|---|---|---|
| valor-trocado | ER1 código: o pedaço difere da linha, carácter a carácter. | sim |
| codigo-em-falta | ER1 código: falta o único código do recibo. | sim |
| marca-no-paragrafo | ER1 código: marca fora do campo do recibo da própria linha. | sim |
| codigo-editavel | ER1 código: marca fora do campo do recibo da própria linha. | sim |
| campo-conferido-fora-do-bloco | ER1 código: o campo conferido não é o que o botão copia. | sim |
| comentario-no-codigo | ER1 código: o pedaço difere da linha, carácter a carácter. | sim |
| leitura-nao-literal | ER1 código: falta a leitura literal do campo. | sim |
| cors-em-falta | ER1 CORS: /livro-razao/custo-unitario-do-trabalho-2024.json tem estado ou cabeçalho incorreto. | sim |
| cors-em-html | ER1 CORS: / tem estado ou cabeçalho incorreto. | sim |
| moldura-aberta | ER1 moldura: / perdeu SAMEORIGIN. | sim |
| json-nome | ER1 JSON: a apresentação difere da linha. | sim |
| json-periodo | ER1 JSON: a apresentação difere da linha. | sim |
| json-valor | ER1 JSON: a apresentação difere da linha. | sim |
| json-unidade | ER1 JSON: a apresentação difere da linha. | sim |
| json-unidadeLang | ER1 JSON: a apresentação difere da linha. | sim |
| json-fonte | ER1 JSON: a apresentação difere da linha. | sim |
| json-fonteLang | ER1 JSON: a apresentação difere da linha. | sim |
| json-data | ER1 JSON: a apresentação difere da linha. | sim |
| json-leitura | ER1 JSON: a apresentação difere da linha. | sim |
| json-atribuicao | ER1 JSON: a apresentação difere da linha. | sim |
| json-notas | ER1 JSON: a apresentação difere da linha. | sim |
| json-atualizacao | ER1 JSON: a apresentação difere da linha. | sim |
| pedido-de-fora | ER1 privacidade: endereço fora da origem fixa do projeto. | sim |
| cookie | ER1 privacidade: API fora dos elementos próprios. | sim |
| armazenamento | ER1 privacidade: API fora dos elementos próprios. | sim |
| pagina-anfitria | ER1 privacidade: leitura fora dos parágrafos próprios. | sim |
| credenciais | ER1 privacidade: o pedido perdeu a opção credentials: 'omit'. | sim |
| redirecionamento | ER1 privacidade: o pedido perdeu a opção redirect: 'error'. | sim |
| indice-codigo-alterado | ER1 código: o pedaço difere da linha, carácter a carácter. | sim |
| indice-marca-fora-do-campo | ER1 código: marca fora do campo do recibo da própria linha. | sim |
| indice-comentario-no-codigo | ER1 código: o pedaço difere da linha, carácter a carácter. | sim |

As mensagens acima são afirmadas pelas células, não só pelo código de saída. celula.json, privacidade-prova.json e indice-plantas.json conservam cada resultado.

Os casos abaixo exercitam a conservação do texto e da data perante dados ou pedidos sem confirmação. São condições de robustez verificadas, não mensagens de rejeição de um portão.

| Caso | Condição provada | Passou |
|---|---|---|
| data-inacessivel-pt | Uma tentativa sem confirmação não avança a data de leitura. | sim |
| data-diverge-pt | Uma tentativa sem confirmação não avança a data de leitura. | sim |
| data-inacessivel-en | Uma tentativa sem confirmação não avança a data de leitura. | sim |
| data-diverge-en | Uma tentativa sem confirmação não avança a data de leitura. | sim |
| sem-cors-pt | O pedido recusado conserva o código colado inteiro. | sim |
| falha-pt | O pedido recusado conserva o código colado inteiro. | sim |
| json-malformado-pt | O pedido recusado conserva o código colado inteiro. | sim |
| outra-linha-pt | O pedido recusado conserva o código colado inteiro. | sim |
| redirecionamento-pt | O pedido recusado conserva o código colado inteiro. | sim |
| sem-cors-en | O pedido recusado conserva o código colado inteiro. | sim |
| falha-en | O pedido recusado conserva o código colado inteiro. | sim |
| json-malformado-en | O pedido recusado conserva o código colado inteiro. | sim |
| outra-linha-en | O pedido recusado conserva o código colado inteiro. | sim |
| redirecionamento-en | O pedido recusado conserva o código colado inteiro. | sim |

## Capturas e leitura a frio

Há 30 capturas, nas larguras 390, 768, 1024, 1280, 1600 px, nas duas edições: bloco no recibo, blogue com JavaScript e blogue sem JavaScript. O navegador confirmou ausência de transbordo horizontal.

| Captura | Resumo dos bytes |
|---|---|
| [blogue-normal-pt-390.png](capturas/blogue-normal-pt-390.png) | 55ff087ae91dda5c3d3b19eefd2fc19a00fc99196c0591dca92fb9414e679915 |
| [blogue-normal-pt-768.png](capturas/blogue-normal-pt-768.png) | bbc5da5e8dee0d351a5f08f0ba64aba1a3b9b6e5eaf17760f331604c73fc016f |
| [blogue-normal-pt-1024.png](capturas/blogue-normal-pt-1024.png) | 10870015ad7647ffda0b357db831080a0a24e5d99e6f3454cef9348ae5f1f098 |
| [blogue-normal-pt-1280.png](capturas/blogue-normal-pt-1280.png) | e5f633b47a04e2dd1aec515cc098768dab25d8db62568fe4b467760c5719fd74 |
| [blogue-normal-pt-1600.png](capturas/blogue-normal-pt-1600.png) | 31105c6fe22f47ec7044968d05ce640a9291dfff8ad7058aa892a7f3faf5d35a |
| [blogue-sem-js-pt-390.png](capturas/blogue-sem-js-pt-390.png) | 06229a72613828fdab19bec099849d673faddf09fab9eae69a75280510fe634a |
| [blogue-sem-js-pt-768.png](capturas/blogue-sem-js-pt-768.png) | 2069eb59f0e8334b09946b3b5a18be4efa8825638dca50a71ea947170f267396 |
| [blogue-sem-js-pt-1024.png](capturas/blogue-sem-js-pt-1024.png) | 1471b538232c74bf2d73f1ea2f0c8e2bf4aabf2691399c223089dec86f5fbe00 |
| [blogue-sem-js-pt-1280.png](capturas/blogue-sem-js-pt-1280.png) | 74ad433960c97052001d542426c52fbc94b5e8e0fcc2cfc3528cda1dbf519ffe |
| [blogue-sem-js-pt-1600.png](capturas/blogue-sem-js-pt-1600.png) | d77c0c2b30b2605795dd564ac9f2079d2370b6812f4d8957923608394f3d4dac |
| [blogue-normal-en-390.png](capturas/blogue-normal-en-390.png) | 4b6cfd3728365addda9d17d1f939ca236c75c955cb4b9176c1106b19c5524129 |
| [blogue-normal-en-768.png](capturas/blogue-normal-en-768.png) | af0d41f5f4b8744393f3b666ec1ee4855203906dcbef5d705c09c0d12018e95f |
| [blogue-normal-en-1024.png](capturas/blogue-normal-en-1024.png) | 883396da120f56f47c76568cbf3866960d92c378c771b7c7a2dd5dce3289021d |
| [blogue-normal-en-1280.png](capturas/blogue-normal-en-1280.png) | 8db95a0318628c5d5dad6205ba65466569ee282c5ef7cccc9f09d16ebe275136 |
| [blogue-normal-en-1600.png](capturas/blogue-normal-en-1600.png) | 7c9b1563009b618866ce82e456dacbd2c89a717f2b4f68ff534545334b8b5bd0 |
| [blogue-sem-js-en-390.png](capturas/blogue-sem-js-en-390.png) | 49376e59a1d7e06fb53e4be44b86887103a0d129f8b3d22f832294a28dcafd33 |
| [blogue-sem-js-en-768.png](capturas/blogue-sem-js-en-768.png) | 6ca37449a79c1b576bacf7c28676dc378de69f1193a6847d5fe9ab45ffbcecbe |
| [blogue-sem-js-en-1024.png](capturas/blogue-sem-js-en-1024.png) | b01901d538835cb88ea62cce7172923464102d3405932574da07973d860dc203 |
| [blogue-sem-js-en-1280.png](capturas/blogue-sem-js-en-1280.png) | 7e27ae3d9a75a39c4ab68ebe2b1aea4760f688b7929db2c8c80d3621ef1ddc28 |
| [blogue-sem-js-en-1600.png](capturas/blogue-sem-js-en-1600.png) | 7aa7353629d7557ccc903838cd12ee86581830229254157b2fd6fbe24f6d2640 |
| [recibo-pt-390.png](capturas/recibo-pt-390.png) | cd4578afa8cc16f244320d23c015c4ce871140a2fe58e1405bf9ce91b8c24f55 |
| [recibo-pt-768.png](capturas/recibo-pt-768.png) | 1a2be044cd2a86b46941fbc37eee7ddb09091bb9f71bfbdc1f531b79042ef6e4 |
| [recibo-pt-1024.png](capturas/recibo-pt-1024.png) | 603ae58989974d3d11318abc1035aaeb7d714e983bcf67ad26dabf91d34b9eff |
| [recibo-pt-1280.png](capturas/recibo-pt-1280.png) | 7b56fe5c9b7bb180b057624abc7dc83dad081ad7abd7abf6eea12490d55786db |
| [recibo-pt-1600.png](capturas/recibo-pt-1600.png) | ab3bd80a9bb4dab087affd4bd46fe141bbf534419482fe279abfd3eca9208f86 |
| [recibo-en-390.png](capturas/recibo-en-390.png) | 4f9d361346d130ba0d216e5f59db3a219781559ebbf096ece239f8468d989cd6 |
| [recibo-en-768.png](capturas/recibo-en-768.png) | 219323e892abc9af91f56dbe7d710f276ac26ad5b8758aa9a785a4bafadcf6e4 |
| [recibo-en-1024.png](capturas/recibo-en-1024.png) | 1c8a0130d753271df3d25d41dd84172500adc99e3ed9e843cd9f2322db246e4e |
| [recibo-en-1280.png](capturas/recibo-en-1280.png) | 672384189e217fa12f588a6a78c4aa21ee4edfd4327d2f27d475b8474eff2b79 |
| [recibo-en-1600.png](capturas/recibo-en-1600.png) | 6a53875bc6341fb972624c49c83444932e0ecbc4dc88eb45e8d420fcb10553ac |

leitura/ contém os ficheiros de código alterados, o diff, o brief, a linha JSON, os recibos construídos e as páginas HTML de ensaio. As capturas estão também copiadas dentro do pacote, com os mesmos resumos dos originais. pacote.json guarda os resumos dos ficheiros. ensaio-cego/ contém 5 estragos só em cópias. controlo-plantas.json, fora do pacote do leitor, guarda os resumos antes e depois e a mensagem de cada planta. São defeitos deliberados para avaliar a leitura, não defeitos por corrigir no código de entrega.

## Portões inteiros

Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/er1-2026-10-06/portoes`. O guião esperou pelas construções que ocupavam a tranca; tranca-observada.json regista a passagem da espera para outro bloco, com renovação recente. O ER1 não interveio na tranca alheia. Os códigos seguintes foram lidos de ficheiros depois de o guião acabar. Cabeça no início e no fim: `645ecde7ea61c044d7c0648b020c6392a48674ce`; dist/version.json confirma a mesma cabeça.

| Portão | Código lido | Início UTC | Fim UTC |
|---|---|---|---|
| build | 0 | 2026-10-06T14:18:42Z | 2026-10-06T14:22:36Z |
| verify | 0 | 2026-10-06T14:22:36Z | 2026-10-06T14:42:50Z |
| typecheck | 0 | 2026-10-06T14:42:50Z | 2026-10-06T14:42:50Z |

A primeira corrida ficou guardada em portoes-primeira/. O verify terminou com código 1: ✗ I2 · as datas ISO à vista; ✗ I6 · o marcador com um destino só. As datas de atributos e os marcadores dentro do código foram tomados por prosa. O portão do índice passou a usar a mesma comparação integral antes da retirada do campo, com plantas pela sua própria leitura. A corrida seguinte ficou guardada em portoes-segunda/, na cabeça `8252915ed97cc4a96eacc20881722201e470c17d`, com os códigos 0, 0, 0. Depois dessa corrida, as sondagens parser-antes.json e campo-copia-antes.json demonstraram que a comparação genérica perdia comentários literais e que o campo marcado podia estar fora do bloco de cópia. Foram fechadas ambas as falhas, com plantas que afirmam as mensagens de rejeição e uma comparação com inputValue no navegador. As sondagens guardam a cabeça e o resumo do comparador anterior; não são ensaios para repetir contra o comparador corrigido. A corrida inteira em portoes/, na cabeça corrigida, é a que vale para a entrega.

Os logs em portoes/ só foram limpos de caminhos locais e nomes da conta. O motor não existe nesta worktree; check:series correu no modo sem motor admitido no lançamento.

## Questões abertas

- ER1-1: confirmar na leitura a frio a escolha de usar só releituras com resultado igual. A implementação protege a verdade da data; antes.json e as plantas documentam a divergência do brief.
- ER1-2: falta a frase e a ligação de exemplo na página Método, nas duas edições. metodo-contexto.json guarda os títulos reais e confirma que os ficheiros de dados e de vista estão idênticos à base: a secção do conjunto de dados pressuposta no brief não existe. O ensaio de alteração em metodo-proposta.json terminou com código 1 e a mensagem «✗ "metodo": o texto mudou depois da última decisão que o governa, ou a decisão foi registada contra outro texto.». A proposta foi só uma sondagem da amarra, não uma secção pronta do Método. O resumo original e o reposto coincidem: `f15e24c3a84aeffa158e4bf9b619eded77470e82352ad133387fb33532ff4d16`. A direção precisa de registar a alteração do texto governado; não se alterou nem enfraqueceu a amarra. A documentação do conjunto de dados em ledger/README.md foi atualizada.
- ER1-3: falta a leitura a frio do Opus e a conferência do lugar de direção. O pacote está preparado, mas esta construção não se apresenta como leitura independente.
- ER1-4: falta verify:deploy no endereço publicado depois de aterrar. A configuração e os pedidos locais foram conferidos; não equivalem a afirmar cabeçalhos já publicados.

A linha tokens used não foi exposta nesta sessão.
