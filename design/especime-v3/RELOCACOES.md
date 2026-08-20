# Registo de relocações · redesenho v3, fase 1

*Regra (resposta 2 da direção à crítica cruzada, 20.08.2026): texto e números só se movem por uma relocação autorizada, escrita antes do movimento. Cada entrada diz a rota de origem, a rota de destino, o componente, o âmbito, a língua, a contagem de ocorrências (origem → destino, por edição) e a linha ou a chave da prova. O rótulo de âmbito visível e o valor movem-se como uma unidade. Não existe a exceção «já existia algures no sítio antigo». Uma frase de maqueta sem rota de origem e sem linha não é relocação: é texto novo, entra pelas cadeias com o seu inglês e fica listada em «Texto novo», para a revisão de voz.*

Estados: **autorizada** (escrita aqui antes da etapa), **feita** (a etapa confirmou as contagens na construção), **recusada** (com o motivo).

## Relocações

| id | origem (rota) | destino (rota) | componente | âmbito | língua | ocorrências (origem → destino) | linha ou chave | etapa | estado |
|---|---|---|---|---|---|---|---|---|---|
| R1 | `/` e `/en`, secção `#numeros`, células `.figura` | `/` e `/en`, o painel (`#painel`), peças Relance e Leitura breve | `figuras.mjs` → `Peca.astro` | País | pt, en | 8 nomes, 8 linhas de medida, 8 frases → 8 + 8 + 8 por edição (a peça aberta repete a frase da peça fechada; sem corte) | `divida-publica-2025`, `posicao-de-investimento-internacional-2025`, `custo-unitario-do-trabalho-2025`, `precos-da-habitacao-2025`, `taxa-de-emprego-2025`, `criancas-em-creche-2025`, `abandono-escolar-precoce-2025`, `sobrecarga-do-custo-da-habitacao-2025` | 2 | feita · 8 + 8 + 8 por edição, conferido na construção (as oito peças rendem nome, linha de medida e a frase INTEIRA; as frases curtas da prancha não entram) |
| R2 | `/municipios/evora` e `/en/municipalities/evora`, o relance (as oito medidas de `municipios.mjs`) | `/` e `/en`, o painel no âmbito Município = Évora, com o rótulo de âmbito «Évora · município» na mesma unidade | `municipios.mjs` → `Peca.astro` | Município (Évora) | pt, en | 8 → 8 + 8 (duplicação autorizada; a página do município mantém as suas) | `evora-populacao-2025`, `evora-poder-de-compra-2023`, `evora-desemprego-registado-2024`, `evora-empresas-2024`, `evora-divida-dgal-2024`, `evora-indice-de-divida-2024`, `evora-execucao-da-receita-2025`, `evora-prazo-medio-de-pagamento-2025` | 2 | feita · 8 → 8 + 8, conferido; a frase de cada peça é a `nota` do mosaico do relance, e não a frase da leitura breve, que o registo não autoriza mover |
| R3 | `/` e `/en`, secção `#mapa` (Instrumento n.º 2): a contagem da CAOP, as contagens por parcela, a legenda de cobertura, a frase «O que o mapa não diz», a fonte e a data de leitura | `/` e `/en`, a ficha do mapa na cabeça (âmbito País e escolha de concelho) | `InstrumentoMapa.astro` → `MapaRespira.astro` | País | pt, en | **a citação da CAOP 1 → 2 por edição; a frase de neutralidade 1 → 2 por edição; a linha de fonte compacta 1 por edição** (contagens medidas na etapa 2i; ver a nota) | `municipios-portugal-caop-2025`, `municipios-continente-caop-2025`, `municipios-acores-caop-2025`, `municipios-madeira-caop-2025`; chaves `municipios_com_pagina`, `municipios_total` | 2 | feita · 1 → 1 por edição; a secção `#mapa` saiu e a ficha entrou na cabeça, com a contagem por parcela, a legenda de neutralidade palavra por palavra e a fonte da CAOP. **Revista na 2g, mesma rota e mesmo âmbito**: a ficha ficou compacta (cobertura, neutralidade, contagens por parcela, e uma linha de fonte montada dos campos da própria linha da CAOP com o selo de sempre) e o resto do que a v2 publicava desceu para uma camada de fundo `<details>` por baixo do mapa — a citação inteira (`data-verbatim="caop-fonte"`, sem uma palavra mudada), a porta do CSV e as duas dicas de uso. O rótulo dessa camada é `inicio.mapa.deepTitulo`, que é `home.instr2.deepTitulo` relocado com a secção, e entra na contagem desta relocação: **13 chaves relocadas, e não 12**. **Contada na 2i, contra a construção, porque a contagem «1 → 1» não era verdade**: (a) a CITAÇÃO da CAOP aparece **duas vezes por edição** — na camada do aparelho por baixo do mapa e no estado vazio de um concelho sem página, as duas com `data-verbatim="caop-fonte"`, as duas conferidas carácter a carácter, e a segunda vem da mesma rota e do mesmo âmbito (`grep -o 'data-verbatim="caop-fonte"' dist/index.html \| wc -l` → 2, o mesmo em `dist/en/index.html`); (b) a LINHA DE FONTE COMPACTA da ficha é 1 por edição e **não é a citação**: são os campos `source`, `document.title` e `reference_date` da própria linha, com o selo de sempre (`grep -o 'mapa-fonte-curta' dist/index.html \| wc -l` → 1); (c) a FRASE DE NEUTRALIDADE passou a **2 por edição** na 2i — ficha e cartão localizador —, porque a ficha esconde-se na postura de localizador e a frase não pode desaparecer com o mapa que ela explica; é a mesma cadeia, palavra por palavra, e conta como a mesma relocação (achado 8 da leitura cruzada; célula «2i·3c» da matriz: 1 visível em cada uma das cinco posturas medidas) |
| R4 | `/` e `/en`, secção `#convergencia` (Instrumento n.º 1): a frase de cada região e as distâncias | `/` e `/en`, a banda da região (âmbito Região) e o Instrumento n.º 1 no âmbito País | `regioes.mjs` → `BandaDaRegiao.astro`, `InstrumentoConvergencia.astro` | País, Região | pt, en | **2 por região por edição** (a manchete do âmbito Região e o instrumento n.º 1); a de Portugal, 1 | `pib-pc-portugal-2024`, `pib-pc-grande-lisboa-2024`, `pib-pc-peninsula-de-setubal-2024`, `pib-pc-algarve-2024`, `pib-pc-madeira-2024`, `pib-pc-alentejo-2024`, **`pib-pc-alentejo-2000`**; `distancia-portugal-ue27-2024`, `distancia-grande-lisboa-ue27-2024`, `distancia-peninsula-de-setubal-ue27-2024`, `distancia-algarve-ue27-2024`, `distancia-madeira-ue27-2024`, `distancia-alentejo-ue27-2024`, **`distancia-alentejo-ue27-2000`**, `distancia-setubal-grande-lisboa-2024` | 2 | feita · **recontada na 2i, e a contagem antiga estava errada em dois sítios.** Estava «6 → 6 + 1 por região»; a construção dava **três** ocorrências por região e por edição — a manchete do âmbito, a PEÇA do painel regional (que recebia a mesma frase) e o instrumento n.º 1. A duplicação da peça foi **removida** e não autorizada: a frase da região é a manchete daquele âmbito, e a peça repetia-a logo por baixo, com o mesmo valor e o mesmo selo, no mesmo ecrã. É chamada de forma, e está escrita na nota. Medido depois: `grep -o 'O Alentejo está' dist/index.html \| wc -l` → **2** (era 3), e o mesmo para as outras quatro regiões; `grep -o 'Portugal está' dist/index.html \| wc -l` → **1**, porque Portugal deixou de ter âmbito e de ter manchete (achado 5). **Duas linhas que faltavam à lista**, e que o instrumento rende: `distancia-alentejo-ue27-2000` (2 por edição, na manchete do Alentejo e na frase do instrumento) e `pib-pc-alentejo-2000` (1, na proveniência por estudo do aparelho do instrumento) |
| R5 | `/` e `/en`: os textos das secções Municípios, Estudos e Agenda da página v2 | cortados: as portas de uma linha levam só contagens com porta; os textos vivem nas páginas próprias | `HomeView.astro` → `Portas.astro` | País | pt, en | 1 → 0 por edição | chaves `municipios_com_pagina`, `municipios_total`, `estudos`, `edicoes`, `agenda_em_curso`, `agenda_a_seguir`, `agenda_concluido`, `agenda_retirado` | 2 | feita · 1 → 0 por edição; as três portas levam só contagens com porta |
| R6 | `/municipios/evora`: a frase de abertura («Esta página mede o município de Évora e mostra de onde vem cada medida. Não interpreta: …») | `/` no âmbito Município = Évora, como lede | `municipios.mjs` → `Cabeca.astro` | Município (Évora) | pt, en | 1 → 1 + 1 (duplicação autorizada) | sem número | 2 | feita · 1 → 1 + 1; a frase passa a aparecer na primeira página e na página do município, e a régua dos defeitos conta-a como frase de moldura em 2 páginas |

## Recusadas, ou não relocadas de propósito

| o quê | porquê |
|---|---|
| A nota do lede de Évora da maqueta («Oito medidas. Seis vêm de organismos…») | contagens por extenso, estado escrito (`DECISIONS.md` §4, item das contagens em palavras); fica na página do município, onde já está registada como dívida da fase da voz |
| As frases curtas das peças Relance da maqueta (`SHORT_REL`: «Acima do limiar do painel europeu, e a descer.», etc.) | são cortes das frases existentes, isto é, frases novas; a peça leva a frase existente por inteiro (R1). Se a direção quiser as curtas, é chamada editorial e entra por «Texto novo» |
| As distâncias «+29,7 · −15,2 · +12,3 · +8,6», «+11,47», «−44,5» e a «+29,7» do telemóvel | não têm linha; decisão (e) do plano |
| «Total 308 · [a verificar]» da ficha do mapa | o marcador saiu das linhas da CAOP a 18.08; a contagem rende com o selo cheio |
| «Publicação: 2026-08-12» nas linhas de estudo cuja data é `null` | rende `[a verificar]`, nunca a data `updated` (etapa 4e) |
| «61,44%» com o símbolo dentro do valor | o símbolo fica fora do elemento (regra do `data-claim`) |
| A paráfrase do Sobre e «A direção é de Nuno dos Santos» no rodapé; o colofão «Maqueta v3 · protótipo · tipos substitutos»; «Protótipo: um toque num bloco muda só a densidade dele» | rodapé só navegação (15.08); estados de protótipo são recusados pelo portão |
| O quadrado de cobalto do sinal de tempo no cabeçalho | Emenda 1: cor só para limiares publicados |

## Texto novo (sem rota de origem; entra pelas cadeias, PT e EN no mesmo commit; revisão de voz antes da fusão)

### Etapa 2, subetapa 2i · uma cadeia aparada, e nenhuma nova

| chave | o que é |
| --- | --- |
| `ambito.regioesMeta` | **aparada**, nas duas edições. Dizia «As seis leituras publicadas na régua da convergência.» / «The six readings published on the convergence rule.», e a fila que ela legenda passou de seis pastilhas a cinco quando Portugal deixou de ser uma região (achado 5 da leitura cruzada, plano §13). Uma legenda que conta seis por cima de cinco é falsa; trocar «seis» por «cinco» seria escrever uma contagem à mão que volta a ficar errada na primeira mudança da lista. Ficou **«As regiões publicadas na régua da convergência.» / «The regions published on the convergence rule.»**, sem contagem: as leituras que a régua publica continuam a ser seis, e as regiões da fila são as que a fila mostra. **É a única mudança de texto desta subetapa, e vai assinalada em vez de decidida** |

### Etapa 2, subetapa 2g · uma cadeia nova, uma relocada, uma aparada

| chave | o que é |
| --- | --- |
| `inicio.cabeca.distritoDe` | **nova**, nas duas edições («distrito de » / «district of »). É o prefixo que fecha ISSUES I18: uma regra para os 308, com o servidor a dizer em `data-ilha` a qual dos dois casos cada concelho pertence e o script a trocar só o `hidden` |
| `inicio.mapa.deepTitulo` | **relocada** (R3), de `home.instr2.deepTitulo`, sem uma palavra mudada |
| `inicio.movel.proximos` | **aparada**: a primeira metade («Um toque no mapa devolve os concelhos mais próximos, para escolher.») descrevia o que a página deixou de fazer quando a regra da caixa vazia passou a ser a da prancha, e saiu. Ficou a segunda, que continua verdadeira. **É a única chamada editorial desta subetapa, e vai assinalada em vez de decidida** |

### Etapa 2 (subetapas 2a a 2c) · 32 cadeias novas, todas nas duas edições

Estão em `CHAVES-EN.md` com o inglês ao lado. Por família:

| família | chaves | o que é |
|---|---|---|
| `estado.*` | 4 | o vocabulário de estado decidido na etapa 0, sem uma palavra mudada |
| `cobertura.*` | 2 | o vocabulário de cobertura, o mesmo |
| `ambito.*` | 7 | os rótulos dos três âmbitos, a meta das regiões, e as duas cadeias da pesquisa |
| `densidade.*` | 6 | os rótulos das duas densidades, «abrir»/«fechar», e a nota do que não funciona sem script |
| `inicio.cabeca.*` | 12 | os rótulos de âmbito, as duas frases da manchete do País, a de Évora, a do estado vazio, e a lede da região |
| `inicio.mapa.*` | 3 novas + 13 relocadas | «Toque num ponto para escolher o concelho.», «trocar de concelho», «a página inteira, com quem governou»; as outras treze são `home.instr2.*` movidas sem mudar uma palavra (a décima terceira, `deepTitulo`, entrou na 2g com a camada de fundo do mapa) |
| `inicio.banda.*` | 2 | o rótulo da régua e a frase «As regiões não se desenham em pontos de concelho…» |
| `inicio.peca.*` | 2 | «o recibo completo está na linha» e a frase de quando não há referência publicada |
| `inicio.portas.*` | 4 | o rótulo das portas, «a página inteira», e os dois pedaços da contagem dos estudos |
| `inicio.vazio.*` | 2 | os dois pedaços da frase do concelho sem página |
| `sinal.agenda*` | 2 | «concluído» e «retirado», em minúsculas, para completar o par que a mobília já tinha |

**Uma frase da prancha que NÃO entra como texto novo**: «Toque num ponto para
abrir o concelho» passa a «Toque num ponto para ESCOLHER o concelho», porque na
primeira página um toque escolhe o âmbito e não abre a página do concelho — a
frase da prancha prometia uma coisa que o desenho não faz.

Preenchido por cada etapa, chave a chave, em `CHAVES-EN.md`. Na etapa 0 sabe-se já que entram: a frase-título por âmbito com a contagem por chave da prova; os rótulos de âmbito e densidade; as palavras de estado e de cobertura; a frase de neutralidade do mapa («O ponto aceso marca cobertura editorial, não qualidade nem importância», que já existe como `instr2.coberturaV` e pode ser relocada em vez de reescrita, R3); o estado vazio de um concelho sem página; os rótulos das portas de uma linha; a marca de água do recibo (as palavras do marcador); a linha constante do cartão de partilha.
