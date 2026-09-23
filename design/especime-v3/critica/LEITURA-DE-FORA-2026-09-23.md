# Leitura de fora · O Estado do País · 23.09.2026

*Escrita na manhã de 23.09.2026 por Claude Opus 5.5, numa sessão à parte, a pedido do diretor. Esta sessão não é nenhum dos lugares do projeto: não dirigiu, não construiu e não leu a frio nenhum bloco. O diretor visitou o sítio como leitor e pediu primeiro uma avaliação do conteúdo, depois uma do desenho, da interface e da experiência. Entrega as duas ao lugar de direção com um pedido: pensar sobre elas e chegar à melhor abordagem. Não é um brief nem uma ordem. Quem decide é o lugar de direção (§1.112), e o que é do diretor (o nome, a exposição legal) vai marcado como dele. Sem travessões na prosa; as citações do sítio ficam como o sítio as escreve.*

**O que se leu.** O sítio no ar a 23.09.2026, commit `d3481ba9` (lido em `/version.json` às 09:28 UTC, construído a 22.09 às 17:24 UTC), que é o estado de fecho do prompt de 22.09. Usei o Chrome do diretor a 1 440 e a 606 px e numa moldura da mesma origem a 390 px. Usei também o Playwright do repositório, só para ler: Chromium a 1 280 e a 390 px nos temas claro e escuro, e WebKit a 390 px. Nas fontes primárias usei a API do Eurostat, o ficheiro do IEFP e o PDF do Grupo de Trabalho. Nada foi escrito no repositório nem no motor.

**Como ler.** Cada afirmação foi medida ou lida nesse dia, salvo onde diz *(inferido)*, *(dos registos, não reconferido)* ou `[a verificar]`. O §9 diz como reproduzir cada medição, para o lugar de direção a reconferir antes de a usar num §0.

---

## 0 · O veredicto, em cinco linhas

1. **Os números estão certos e o caminho até à fonte funciona.** Conferi 28 valores na fonte primária e os 28 são iguais.
2. **O leitor quase nunca fica a saber o que um número quer dizer.** A primeira página e os temas não dizem que números estão bem ou mal. O único veredicto do sítio, «Portugal falha 4 valores de referência … e cumpre 9», está numa página que só o rodapé abre.
3. **Onde o sentido mais conta, a habitação, a primeira página leva o leitor à conclusão errada.** A Agenda do próprio sítio diz que não leva.
4. **A pesquisa de concelhos em Lugares não encontra concelho nenhum.** É um defeito de funcionamento, com a causa descrita no §3.
5. **O desenho é sóbrio, legível e acessível no contraste, mas tudo pesa o mesmo.** O número local não tem régua, e as famílias de páginas não falam a mesma língua visual.

---

## 1 · O que está certo (medido)

| valor no sítio | fonte primária | valor na fonte | igual |
|---|---|---|---|
| dívida pública 2025: 89,7 % do PIB | Eurostat `gov_10dd_edpt1` (atualizado a 22.04.2026) | 89.7 | sim |
| dívida pública 2024: 93,5 | idem | 93.5 | sim |
| dívida pública UE 2025: 81,7 | idem | 81.7 | sim |
| preços da habitação 2025: 17,6 % | Eurostat `prc_hpi_a`, `RCH_A_AVG` (02.07.2026) | 17.6 | sim |
| preços da habitação 2024: 9,1 | idem | 9.1 | sim |
| preços da habitação UE 2025: 5,5 | idem | 5.5 | sim |
| desemprego 2025: 6 % | Eurostat `une_rt_a`, 15 a 74 anos (10.09.2026) | 6.0 | sim |
| desemprego 2024: 6,5 | idem | 6.5 | sim |
| desemprego UE 2025: 6,0 | idem | 6.0 | sim |
| desemprego registado em Mourão, dezembro de 2025: 175 | IEFP, SIE de dezembro de 2025, `Quadro_I`, linha 263 | 175 | sim |
| penalizações: a tabela inteira do estudo, 18 valores (6,0 a 36,0; 8,2 a 39,6; 22,6 a 47,3) | relatório do Grupo de Trabalho, PDF p. 266 (Figura 8.1) e p. 273 (Figura 8.4) | iguais | sim |

A dívida foi conferida contra a edição de abril do Eurostat. A notificação do INE de hoje pode revê-la; é o item 4 do prompt.

**Também funciona:**
- **O caminho até à fonte.** Número, recibo, endereço, célula: fi-lo de ponta a ponta para Mourão.
- **O menu de cinco.**
- **O mapa como porta.** Vai do distrito ao concelho e à página, e funciona pelo teclado: 29 regiões focáveis, com contorno de foco de 2 px visível.
- **Nenhuma página transborda a 390 px.** Medi 12.
- **O contraste do texto passa com folga.** No tema claro, 16,4:1 no corpo e 6,2:1 no cinzento; no escuro, 15,4:1 e 9,5:1. Só os separadores «›» das migalhas ficam a 3,5:1, e são decorativos.
- **O estudo Évora 2027 é jornalismo de prestação de contas a sério.** Tem uma conclusão clara, recomendações e 53 ligações a fontes primárias. É o melhor que o sítio tem e o molde do resto.

---

## 2 · O sentido: onde o sítio falha o leitor, por ordem de dano

### 2.1 A habitação engana, e o sítio sabe

**O que se vê.** Na primeira página e em Temas: «Sobrecarga do custo da habitação 6,3 % em 2025 · 2024: 6,9 · União Europeia: 7,7». Um leitor conclui que a habitação pesa menos em Portugal do que na União.

**O que o sítio diz de si.** Na Agenda, no item «Habitação: o que cada instituição mede…», lê-se:

> «A análise de convergência do motor identifica este indicador como armadilha, e a razão é a que a primeira página já diz: a própria Comissão adverte que só se lê ao lado do regime de propriedade … O sítio não publica hoje a média europeia deste indicador, e por isso a comparação com ela não é feita aqui.»

As duas frases são falsas hoje:
- A primeira página não diz nada sobre o regime de propriedade. Há 0 ocorrências de «propriedade», «arrend», «inquilin» e «ocupa» na primeira página, em Temas, em `/uniao-europeia` e em `/en`.
- A primeira página publica a média europeia (7,7).

*(Dos registos, não reconferido.)* O H3 de 20.08 mediu a sobrecarga dos inquilinos a preço de mercado em 30,3 %, contra 19,2 % na União (dados de 2024). O número que corrige a leitura existe no motor e não está no sítio.

**Regras do projeto que falham:** NORMA §2.4 (a régua) e §4.1 (o sentido à frente).

**Proposta.**
- Hoje: a ressalva da Comissão volta ao lado do cartão, numa frase com fonte. Em alternativa, a comparação com a UE sai até a ressalva estar lá. As duas frases da Agenda corrigem-se no mesmo gesto.
- No B2: o cartão da habitação passa a mostrar o valor por regime de ocupação.

### 2.2 Nenhuma página principal diz o veredicto

**Os cartões não distinguem o bom do mau.** Na primeira página e em Temas, «acima do valor de referência (60%)» (a dívida pública, que está fora) e «abaixo do valor de referência (55%)» (a dívida das famílias, que está dentro) rendem-se da mesma maneira. O «acima/abaixo» diz a direção, não o estado.

**A cor não aparece.**
- Medi a cor calculada de todos os elementos de `/temas` e encontrei 0 cores que não sejam cinzentos.
- As classes do estado existem na folha `inicio.*.css`: `.sq-fora`, `.sq-dentro`, `.est-dentro` e `.regua-barra.barra-fora/.barra-dentro`.
- Nas 20 páginas que li, só `/uniao-europeia` as usa (39 usos). A primeira página liga-lhe uma vez, no rodapé.

**O Método afirma outra coisa.** Em «A forma · A cor»: «âmbar quando o valor está fora dele, cobalto quando está dentro». Isto é falso na primeira página e em Temas.

**Mesmo em `/uniao-europeia`, as palavras não dizem o veredicto.** «acima do valor de referência» aparece a âmbar na dívida pública (fora) e a cobalto na quota nas exportações (dentro). O estado vai só na cor, o que a NORMA §2.4 proíbe («nunca por cor sozinha»). O título dessa página diz o veredicto em palavras, e é a frase mais clara do sítio.

**A leitura da primeira página não diz o ano.**

**Proposta, para o B2.** O B2 dobra a página europeia nos temas (ESTRUTURA §2), e o veredicto tem de sobreviver à dobra:
- A leitura do país abre com ele, em palavras: por exemplo «Em 2025, Portugal está fora de 4 dos 13 valores de referência da Comissão», com os quatro nomeados.
- Cada cartão com referência diz o estado com a direção, por exemplo «fora do valor de referência (acima de 60 %)».
- A cor repete o que as palavras dizem, nunca o substitui.

A tabela do vocabulário proíbe «limiar», não proíbe «fora/dentro».

### 2.3 O concelho: números sem régua, e a prestação de contas só em Évora

**Números sem régua.**
- Mourão mostra nove números em unidades misturadas, por exemplo «Desemprego registado 175 pessoas», «Dívida total da câmara 4 307 719 euros» e «Empresas não financeiras 353». Lisboa tem o mesmo molde.
- Não há taxa, nem valor por habitante, nem valor do distrito ou do país ao lado, nem período anterior.
- O único cartão com referência é o índice de dívida (69,1 % contra o limite legal de 150 %), e é o mais legível da página.
- A NORMA §2.4 diz: «O número traz sempre a régua. O valor nacional ao lado do local, o período anterior … Um número sem régua não é informação.» A ESTRUTURA §1.3 também pede a régua. Nenhuma das duas se aplica ao concelho.
- *(Inferido.)* Os cerca de 307 concelhos além de Évora partilham o molde: o índice diz 2 767 de 2 975 linhas de concelhos, o que dá cerca de 9 por concelho.

**A prestação de contas só existe em Évora.** A secção «Quem administrou, e o que as contas registaram» só está na página de Évora. Nos outros concelhos falta a razão de ser do projeto: quem governou, o que herdou, o que deixou. O B4 é Évora, e nada do plano que li leva uma linha mínima aos restantes.

**Proposta, para o diretor e o advogado.** Uma linha mínima com fonte por concelho, por exemplo o presidente em funções, o partido e a data de instalação, tirados das fontes oficiais que o motor já usa em Évora (a SGMAI, para a composição do executivo). Depende da regra dos nomes de 15.09 e da hora do advogado antes da primeira peça que segue pessoas nomeadas.

**A frescura.** O recibo de Mourão diz «Último período publicado pela fonte: 2026-07; nesta linha: 2025-12». A página do concelho mostra «dezembro de 2025» sem dizer que há dados mais novos.
- Se dezembro é escolha (o fecho do ano), o cartão di-lo, por exemplo «dezembro de 2025 (há dados até julho de 2026)».
- Se não é, a linha atualiza-se.

**A leitura do concelho é técnica.** «índice de 71,53, com a média do país como base» não é frase falada (NORMA §1.2). Por exemplo: «o poder de compra por pessoa fica abaixo da média do país (71,53, com o país a 100)».

### 2.4 «O que mudou» na página do país fala da máquina

Na primeira página lê-se:

> «22.09.2026 O Eurostat intitula o quadro dos jovens que não trabalham nem estudam com o grupo dos 15 aos 24 anos, e a série que publica é a dos 15 aos 29. Doze linhas de quatro medidas passam a trazer no excerto o grupo etário que o pedido delas fixa, e as definições dessas medidas escrevem-no nas duas edições. Nenhum valor mudou.»
>
> «21.09.2026 Sete nomes do INE que não estavam conferidos como a mesma medida saíram dos recibos e dos cartões; três eram de outros indicadores. Nenhum valor mudou.»

**Para um leitor, isto são registos internos.**
- «recibos» e «cartões» numa página do leitor violam a ESTRUTURA §6: o recibo diz-se «Fonte e verificação», e «cartão» é palavra interna.
- Uma mudança que não mexe em nenhum valor é uma revisão de proveniência, e o lugar dela é o registo de Correções.

**Proposta.** O «O que mudou» do país mostra só o que um leitor notaria: um valor novo, um estudo novo, um valor corrigido.

### 2.5 A voz: o jargão e os marcadores ainda estão nas páginas do leitor

**Temas, «Dívida das empresas».** Lê-se:

> «A dívida consolidada das NFC, em percentagem do PIB; o nome por extenso da sigla permanece [a verificar] · um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado.»

O mesmo acontece em «Fluxo de crédito às empresas». Há dois problemas:
- É uma sigla inglesa numa frase portuguesa; em português diz-se SNF, sociedades não financeiras.
- É a admissão pública de que o sítio não confirmou o que a sigla quer dizer.

Se a I136 só cobre as notas internas, esta é outra entrada.

**O recibo não diz o que prova.**
- Abre com «Linha do livro-razão». A ESTRUTURA §6 põe «recibo» e «livro-razão» fora da página, e o título da página devia ser «Fonte e verificação».
- As migalhas dizem «Início › Números e fontes › Total».
- O H1 é «175 pessoas», e o assistente de leitura lê-o como «175pessoas».
- Em lado nenhum do primeiro ecrã o recibo diz em palavras o que conta. «Desemprego registado · Mourão · dezembro de 2025» só se deduz do identificador e do título do documento.

**O recibo dá duas linhas para o mesmo valor.**
- Diz «Onde no documento: … Quadro_I, linha 263, linha de MOURÃO, coluna Total» e, mais abaixo, «Onde no ficheiro: Quadro_I, linha 4, coluna 13».
- Abri o ficheiro do IEFP. A linha 263 é a de MOURÃO; a linha 4 é a dos cabeçalhos, onde está escrito «Total». O segundo campo é o `name_source`, o lugar do nome, e o rótulo apresenta-o como o lugar do valor.

**O excerto não se lê.** «4 MOURÃO 88 87 50 125 63 112 175» é verbatim, mas ilegível sem os cabeçalhos das colunas: Região, Concelho, Homens, Mulheres, < 1 Ano, 1 Ano E +, 1º Emprego, Novo Emprego, Total.

**Os controlos diários não aparecem.** Nas três linhas que abri, a verificação é uma só, de 01.09, e chama-se «conferência diária». Hoje é 23.09. *(Inferido.)* O corredor ou deixou de escrever nestas linhas, ou só escreve quando algo muda. O lugar de direção sabe qual das duas, e o leitor lê «diária» ao lado de uma data de há três semanas.

**Números e fontes.**
- Linhas com «Publicado por [a verificar] · Lido na fonte a [a verificar]» aparecem na primeira dúzia do índice. Exemplos: `ciclo-substituicao-condutas` (239 anos) e `avisos-pt2030-abertos` (211 avisos).
- Na edição portuguesa, os títulos das linhas alternam entre português e inglês, com os nomes do Eurostat («Early leavers from education and training by labour status»).

**Os valores do «O que mudou» de Évora não têm separador de milhares.** Aparecem assim: «84699317,63 → 86944668,69 euros», «166639411,36 → 167366755,84». Estão ao lado de caixas «[a verificar]», e noutro ponto da mesma página lê-se «54 681 562».

**A frase do marcador contradiz-se.** «um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado» lê-se como contradição.

**Proposta.**
- O portão do vocabulário do B5 apanhava «livro-razão», «recibos» e «cartões» nas páginas do leitor. É pequeno e mecânico; vale a pena antecipá-lo.
- Os `[a verificar]` em definições visíveis entram na regra da I136: levam data e ou se fecham na semana ou sobem a campo visível.

### 2.6 Os estudos

**O estudo para onde a primeira página manda o leitor não se pode conferir por dentro.** É «Penalizações por Reforma Antecipada em Portugal», de 24.08.
- A página `/estudos/penalizacoes-por-reforma-antecipada-2026` tem o título, uma linha e «Edição tal como foi publicada». A conclusão que a chamada da primeira página mostra (6,0 % ou 22,6 %, contra 8,2 %) não está na página do próprio estudo.
- O documento (`/documento`) tem 4 ligações, todas de navegação: 0 para o relatório do Grupo de Trabalho e 0 para linhas do livro-razão. Os números estão certos (§1), mas o leitor não os consegue conferir por dentro.
- O recibo de 8,2 % tem como excerto a nota de fonte da figura, que não contém «8,2».
- A única verificação desse recibo (01.09, `corredor-diario`) diz `inacessivel`. O PDF respondeu HTTP 200 a 23.09 (4 513 336 bytes).
- O estudo afirma: «Este resultado não foi noticiado.» É uma afirmação negativa sobre a imprensa, sem fonte à vista. `[a verificar]` como o estudo o sabe.

O M4b repara o livro-razão. O lado do leitor (a página de leitura com a abertura da NORMA §4.4 e as ligações no texto) é do B4. Sugiro este estudo em primeiro no B4, porque é para ele que a primeira página manda.

**A lista de estudos esconde os mais novos.**
- `/estudos` lista 6 estudos nacionais: as Penalizações (24.08) no topo e cinco de 12.08.
- Os sete estudos de lugar (Évora 6, Alentejo 1) só aparecem atrás de «Por lugar». Entre eles está o mais novo e o melhor, Évora 2027 (16.09).
- A ESTRUTURA §3 diz: «The studies list shows every study newest first». A decisão de 16 e 17.09 queria o estudo novo no topo da lista.

**Há três maneiras de mostrar a proveniência.**
- Évora 2027: 53 ligações a documentos e 0 marcas do livro-razão.
- O estudo do PRR de Évora: 17 marcas e 8 `[a verificar]`.
- As Penalizações: nenhuma das duas.

Uma só forma visível ajudava o leitor (NORMA §2.1: a marca da fonte é esse toque). O lugar de direção escolhe qual.

**Os títulos e as descrições.**
- Os títulos seguem a maiúscula à inglesa: «Penalizações por Reforma Antecipada em Portugal», «Évora — Prometido, Pago, Auditado 2026».
- Na lista portuguesa aparece «Which Door Is Yours — public funding in Portugal, August 2026 (em inglês)».
- As descrições dos estudos de 12.08 são rótulos de assunto («Financiamento público em Portugal.»), não resultados. A NORMA §1.2 diz que um título é o resultado, não o assunto; o B4 cobre isto com as aberturas.

### 2.7 A cobertura

Em `/dominios`, 9 dos 18 temas não têm medida nenhuma: População, Migração, Água, Espaço, Infraestruturas e ferrovia, Ambiente e sustentabilidade, Cultura, Segurança, e Governo e democracia. Saúde, Justiça, Investimento e Ciência têm uma medida cada.

Não é um defeito: o Método diz o que entra a seguir. Mas para um leitor de «o estado do país», a saúde com um número só, e nada sobre crime, eleições ou emissões, é a lacuna que primeiro se vê. Fica para a revisão editorial do lugar de direção.

---

## 3 · Funcionamento: a pesquisa de concelhos em Lugares não encontra nada

**Reproduzido** no Chrome real do diretor e no Playwright (Chromium, a 390 e a 1 280 px):
- Ao escrever «mour» ou «mourao», não aparece nada.
- Com Enter ou «Procurar», a página recarrega em `/lugares/?concelho=Mour%C3%A3o` com o campo vazio e nada encontrado.
- Acontece o mesmo com `?concelho=Lisboa` e `?concelho=Porto`.

**A causa**, lida em `public/js/municipios.js` e na página construída:
- A página não tem `[data-lista-agrupada]`, e por isso o guião segue o segundo ramo: a fila de resultados, com 308 elementos `.pesquisa-item`.
- O guião tira o `hidden` ao `<li>` que casa; em Mourão fica `hidden=false`.
- Mas nunca o tira ao pai, `<ul class="pesquisa-res" data-pesquisa-lista data-resultados hidden>`, que fica com `display: none`. Por isso nada aparece.
- Nesse ramo o `submit` não é impedido: o Enter recarrega a página, e nada lê o `?concelho=`.
- O «Nenhum concelho com esse nome.» também fica escondido.

**A consequência.** O R4 da ronda de leitores (ir direto ao meu concelho) falha na página que existe para isso. O mapa funciona; a pesquisa não. A pesquisa de Números e fontes funciona: passa de 208 linhas para 9 com «mourao». Mas os resultados chamam-se «Total» ou têm o título dos quadros do INE.

**Proposta, pequena.**
- Com texto escrito, o guião tira o `hidden` à lista.
- O Enter vai direto à página quando há um só resultado, que é o que um leitor espera; nos outros casos, o `submit` fica impedido.
- O caminho sem guião lê o `?concelho=`.
- Uma célula de portão escreve um nome conhecido e exige uma ligação visível (o conhecido-positivo da M18).

---

## 4 · Confiança e exposição: do diretor, para decisão dele

**Ninguém está nomeado.**
- É decisão do diretor (15.09: «no title and no name anywhere»), e um portão garante-a: 0 nomes em 7 354 páginas, pelos registos de 22.09.
- Mas o Método ainda diz «uma pessoa com nome define as regras e as recusas, e responde» e «é financiado pessoalmente pelo diretor». Sem nome em página nenhuma, a primeira frase é falsa tal como está publicada.
- Ou a frase muda, ou o nome aparece. A escolha é do diretor; a frase, o lugar de direção pode corrigi-la seja qual for a escolha.

**A minha leitura, para o diretor.** No Sobre lê-se que o sítio é produzido «com o mínimo de intervenção humana» e que nomeia quem exerce cargos públicos «no que fez bem e no que fez mal». Um sítio assim, sem nenhum humano nomeado, é o que os leitores associam a sítios de pouca confiança. Os recibos não respondem à primeira pergunta de um leitor, «quem está por trás». A DILIGÊNCIA LEGAL de 01.09 deixou em aberto se a Lei de Imprensa pede registo e diretor; isso é `[a verificar]` com o advogado, não aqui.

**O rótulo de IA.**
- Na primeira página, no concelho, em Temas e em Lugares está só no rodapé, a 97 a 99 % do texto da página. A primeira página mede 6 411 px a 390.
- Nas páginas de estudo está no topo, depois do achado de 17.09 («the AI disclosure removed from the top of study pages although its reason is legal»).
- O Método promete o rótulo «em cada página, no momento em que a página é vista».
- Se a razão legal vale para os estudos, vale também para o texto das páginas de concelho («A dívida da câmara de Mourão está dentro do limite legal…»), que é texto escrito por IA para informar o público.
- O cartão de partilha também não traz o rótulo.
- Se uma linha de rodapé cumpre o art. 50.º do Regulamento da IA é `[a verificar]` com o advogado.

**Proposta.** O rótulo de uma linha no topo de todas as páginas. A forma da NORMA §4.3 pode ficar.

**O Portal BASE.** O Método diz:

> «Uma fonte, o Portal BASE, recusa os pedidos feitos em nome deste projeto: é lida com a identidade de um navegador, e nenhuma outra o é.»

Entre as seis decisões de Évora postas ao diretor a 15.09 estava largar o BASE pela exportação semanal do IMPIC; as decisões foram tomadas a 16.09, e não conferi o resultado desta. Se o BASE foi largado, a frase está desatualizada.
- Se é verdade, é uma admissão pública de ler, fazendo-se passar por navegador, um portal do Estado que recusa o projeto. É exposição legal, e é do diretor.
- Se é falsa, é uma frase falsa num texto governado.

`[a verificar]` qual das duas.

---

## 5 · A edição inglesa

**A vírgula decimal em inglês.** Lê-se «Public debt fell from 93,5% … to 89,7% of GDP». Foi decisão de 22.09 («English values keep the ledger's decimal comma, site-wide»), e proponho reabri-la:
- Um leitor inglês lê «93,5» como gralha, e as páginas inglesas do Eurostat usam ponto.
- O portão pode continuar a comparar com a cadeia do livro-razão, com a página inglesa a mostrar a forma local como transformação declarada. É como os separadores de milhares, que o portão já normaliza desde 18.08.

A decisão é do lugar de direção.

**O jargão da casa traduzido à letra.** Por exemplo: «This map did not open. The door goes to its own page.»

**A única porta para o inglês na primeira página está no rodapé.**

---

## 6 · Desenho, interface e experiência: a avaliação pedida

### 6.1 Em duas frases

É sóbrio, legível e acessível. A letra (Spectral, Spectral SC, Bitter) e a contenção dão-lhe seriedade, e não parece um modelo de IA.

Mas tudo pesa o mesmo. O número, a marca da fonte, a unidade, a definição e a comparação são todos pequenos, cinzentos ou iguais, e o olho não tem onde pousar. A página nunca diz o que importa.

### 6.2 O que funciona e deve ficar

- **A letra e o contraste** (valores no §1), com algarismos tabulares do Bitter nos valores.
- **O mapa como porta:** o distrito, o concelho e a página, os nomes ao passar e o foco pelo teclado.
- **A página europeia a 1 280 px:** o título-veredicto e a grelha de cinco colunas. É a página mais bem composta a seguir à do estudo Évora 2027.
- **A página de leitura do Évora 2027:** «Nesta página» dobrável, contador «1/11», «Em resumo» à cabeça, uma medida de linha confortável e «Subir ↑» no fim de cada secção.
- **O cartão de partilha (1 200 × 630):** a frase do país, a fonte e a data, exato e na identidade.
- **A estrutura do recibo** (prova, endereço, verificações, correções), exemplar para um especialista.

### 6.3 Hierarquia e composição

**O primeiro ecrã da primeira página (1 280 × 800)** tem o título, a leitura e o mapa. A coluna esquerda fica vazia por baixo da leitura; isso já está na lista do B2. Não há veredicto, data ou estudo no primeiro ecrã, e cerca de metade dele fica em branco.

**As páginas interiores abrem com dois títulos empilhados.** O nome do sítio, «O Estado do País», e o H1 da página («Lugares», «Mourão») estão na mesma letra e quase do mesmo tamanho, a 1 280 e a 390, e o nome do sítio lê-se como título da página.
- **Proposta:** a marca mais pequena ou na fila do menu, e o H1 como único título.

**No cartão, cinco elementos pequenos (a marca, a unidade, o período, a definição, a comparação) rodeiam um número grande.** A comparação, «2024: 6,6 · União Europeia: 9,1», é o que dá sentido ao número e é o elemento mais pequeno (Bitter a 12 px).
- **Proposta, inverter:** a comparação com palavras (por exemplo «abaixo da UE (9,1)») ao tamanho da definição; a definição passa a ser a pergunta do leitor (NORMA §2.3) e vai para trás da marca ou para o recibo.

**Na página de Évora, o mesmo par (242,6 → 105,5) aparece quatro vezes:** na leitura do topo, no título de «Quem administrou», na frase da leitura e nos rótulos do gráfico. A regra do diretor de 17.09 é que a leitura de um lugar não repete os seus cartões.

**O cartão «Limite legal da dívida das câmaras 150 % em 2024»** é mostrado como medida do país, mas é o limite que a lei fixa, não uma medição. A medição é a que a lista do B2 já tem: dez câmaras fora do limite em 2024, 297 dentro, uma sem valor.

### 6.4 O número, a unidade e a marca

**A marca cai entre o valor e a unidade nos cartões.** Por exemplo: «6,1 ■ FONTE % em 2025», «0,7 ■ FONTE % do PIB», «20 600 ■ FONTE euros por habitante».
- A 390 px a unidade passa muitas vezes à linha seguinte, longe do número: «17,6 ■ FONTE / variação anual média, %».
- O diretor, a 17.09: «the sealed figure must carry its unit». Na leitura da primeira página a ordem está certa («89,7 % do PIB ■ FONTE»).
- **Proposta:** o valor e a unidade juntos, depois a marca. É a convenção do `Claim` que a I66 descreve; a I66 fala das páginas de leitura, e isto são os cartões.

**Sete marcas na leitura de três linhas; 34 na primeira página.** A leitura lê-se como uma frase com notas de rodapé.
- **Proposta:** uma marca por frase, ou uma forma mais leve na leitura. O lugar de direção escolhe, mas a leitura tem de correr.

**O dinheiro aparece em quatro formas:** «1 576,0 euros por mês», «920,00», «12 069 012,6 €» e «84699317,63».

**A precisão muda dentro do mesmo cartão:** «4,86» com «2024: 5,2» e «UE: 4,62»; «59,15» com «UE: 60,4». Se a precisão é a da fonte, diz-se uma vez no recibo; no cartão, uma precisão por cartão.

### 6.5 Cor

As páginas principais são monocromáticas (§2.2). A cor só aparece na página europeia, e aí leva o veredicto sozinha. O tema escuro segue o sistema (decidido a 22.09), e os dois temas passam no contraste.

**Proposta:** a cor onde o Método diz, com as palavras a levar o veredicto.

### 6.6 Navegação e arquitetura

**O menu de cinco está feito e é claro.** Mas o rodapé guarda oito destinos:
- alguns essenciais: Números e fontes (o que distingue o projeto), Portugal na União Europeia (o único veredicto), English, Método, Correções e Agenda;
- e dois que a ESTRUTURA retira: Domínios e Áreas de governo, que saem no B2.

**As migalhas não concordam.** Nas páginas de concelho: «Portugal › Alentejo › Évora › Mourão». Nas outras: «Início › …». O menu chama à mesma página «Portugal». Escolhe-se um.

**Temas, Domínios e Áreas de governo:** três taxonomias ainda alcançáveis. O B2 resolve.

**Estudos:** a lista esconde os estudos de lugar (§2.6).

**Os documentos dos estudos têm outra identidade visual.** O das Penalizações, no tema escuro, usa uma paleta castanha e dourada, com a tabela em letra sem serifa, e a faixa de cima usa as cores do sítio. Entrar num estudo parece sair do sítio. O B4 resolve se os documentos ficarem atrás de «Documento original».

### 6.7 Interação e estados

- **A pesquisa de Lugares está partida** (§3).
- **A página do estudo das Penalizações é um beco sem saída** (§2.6).
- **O recibo não nomeia a medida nem o lugar no título** (§2.5).
- **A página europeia mostra faixas vazias por baixo dos cartões, a 390 e a 606 px.** As definições estão em `<details class="dobra">` com `display: none` até alguma coisa as abrir, e o leitor vê três réguas vazias antes de «Painel europeu».

### 6.8 Telemóvel

**Nenhuma página transborda a 390 px** (12 medidas), e o WebKit rende como o Chromium.

**Comprimentos a 390 px:**

| página | ecrãs | altura |
|---|---|---|
| primeira página | 7,6 | 6 411 px |
| Temas | 7,7 | 6 516 px |
| Évora | 10,1 | 8 505 px |
| Números e fontes | 31,9 | 26 887 px |
| estudo Évora 2027 | 57,1 | 48 184 px |

No estudo, «Nesta página» e «Subir ↑» ajudam.

**A página europeia, a 390 px, põe os 21 cartões numa fila horizontal** («1 de 21»), com o segundo cortado na margem. É um carrossel, que as decisões de 20.08 recusavam, e 20 dos 21 valores ficam fora do ecrã, de lado.

**A leitura com sete marcas ocupa oito linhas.** O mapa toma um ecrã inteiro, e o primeiro cartão de número só aparece no segundo ecrã ou depois.

### 6.9 Acessibilidade: o que medi

- **O contraste passa** (§1).
- **O foco é visível** (2 px, sólido), há ligação para saltar para o conteúdo e `lang="pt-PT"`.
- **As regiões do mapa alcançam-se pelo teclado** (29).
- **A letra mais pequena mede 12 px a 390 e 10,5 px a 1 280.** A comparação, que é o que dá sentido ao cartão, está a 12 px.
- **O H1 do recibo lê-se «175pessoas»**, sem espaço no nome acessível.
- **Tamanho dos alvos: não concluo.** A minha medida conta as caixas dos elementos, não as áreas de toque alargadas que a folha possa dar em ponteiro grosso (a I104 cobriu parte disto). Fica para a régua do próprio projeto.

---

## 7 · Onde cada achado cai no plano de 22.09

| achado | onde cai | nota |
|---|---|---|
| 2.1 habitação | novo; hoje e B2 | corrige também duas frases da Agenda |
| 2.2 veredicto e cor | B2 (a página europeia dobra-se nos temas) | o veredicto tem de sobreviver à dobra; o Método fica falso até lá |
| 2.3 régua no concelho | B2 (comparações por pares, da revisão do Gemini) e B3 (a linha) | valor do país e do distrito em cada cartão do concelho; a linha da frescura |
| 2.3 quem administrou, nos 308 | fora do plano (o B4 é Évora) | diretor e advogado (regra dos nomes de 15.09) |
| 2.4 «O que mudou» | novo, pequeno | só mudanças que o leitor nota |
| 2.5 voz | I136 (marcadores), B3 (o recibo), B5 (portão do vocabulário, a antecipar) | «NFC [a verificar]» é visível, não nota interna |
| 2.6 estudos | M4b (livro-razão) e B4 (página de leitura) | as Penalizações primeiro no B4; a lista é pequena e pode ir já |
| 3 pesquisa | novo, pequeno, urgente | com célula de conhecido-positivo |
| 4 nome, rótulo, BASE | diretor; as frases do Método são do lugar de direção | |
| 5 inglês | decisão de 22.09, a reabrir ou não | |
| 6 desenho | sobretudo B2 e B3 | os dois títulos e a hierarquia do cartão cruzam todas as páginas |

A regra de 15.09 diz que os problemas de interface e de explicação que o diretor aponta vêm antes do bloco seguinte do plano. É o diretor que os aponta, por este documento.

---

## 8 · A abordagem que eu proporia (para o lugar de direção pesar)

O princípio: o lado do leitor primeiro, com os alicerces como estão, e nenhum portão novo além dos que mantêm estas correções corrigidas.

1. **Hoje, pequeno e reversível:**
   - a pesquisa de Lugares (§3);
   - a ressalva da habitação (ou tirar a comparação com a UE) e as duas frases da Agenda;
   - as frases do Método que hoje são falsas: «uma pessoa com nome…», «A cor» nas páginas principais e a do BASE, se estiver desatualizada;
   - o «O que mudou» do país só com mudanças para o leitor;
   - `/estudos` com todos os estudos, do mais novo para o mais antigo.
2. **O B2 como o bloco do veredicto:**
   - a leitura do país abre com «fora de 4, dentro de 9», em palavras;
   - cada cartão com referência diz fora/dentro com a direção, e a cor repete;
   - o valor e a unidade juntos, depois a marca;
   - a definição como pergunta do leitor;
   - a régua em todos os cartões. Os nacionais que ainda não a têm: o saldo, a despesa líquida, o ganho médio, o salário mínimo e a disparidade salarial.
3. **O B3 com o recibo como página para pessoas:**
   - o título diz a medida, o lugar e o período («Desemprego registado · Mourão · dezembro de 2025»), e a página chama-se «Fonte e verificação»;
   - o excerto aparece com os cabeçalhos, e o valor tem uma só localização;
   - os cartões do concelho trazem o valor do país (e do distrito) e a linha da frescura.
4. **O B4 a começar pelas Penalizações**, porque é para lá que a primeira página manda.
5. **O portão do vocabulário do B5, antecipado.** É o que impede o §2.5 de voltar.
6. **Ao diretor:** o nome, o rótulo no topo, o BASE, e se «quem administrou» se estende aos 308.

**O teste de aceitação que eu usaria** é o teste dos dois minutos, que o projeto já conhece desde 15.08: um leitor de primeira vez consegue dizer, em dois minutos, uma coisa que está mal no país e uma que está bem, e onde vive o número de cada uma? Hoje, na primeira página, não consegue.

---

## 9 · Como reproduzir

- **Eurostat** (JSON-stat):
  - `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10dd_edpt1?geo=PT&geo=EU27_2020&unit=PC_GDP&sector=S13&na_item=GD&time=2024&time=2025`
  - `…/prc_hpi_a?geo=PT&geo=EU27_2020&unit=RCH_A_AVG&purchase=TOTAL&time=2024&time=2025`
  - `…/une_rt_a?geo=PT&geo=EU27_2020&age=Y15-74&sex=T&unit=PC_ACT&time=2024&time=2025`
- **IEFP:** o endereço do recibo `mourao-desemprego-registado-2025-12`, lido com `pandas.read_excel(..., engine='odf', sheet_name=None, header=None)`. Em `Quadro_I`, a linha 263 da folha é a de MOURÃO e a linha 4 a dos cabeçalhos.
- **Grupo de Trabalho:** o endereço do recibo `penalizacao-antecipacao-um-ano-neutra`, sem o `#page`. Depois `pdftotext -layout -f 266 -l 266` (Figura 8.1) e `-f 273 -l 273` (Figura 8.4).
- **A linha de 8,2:** `/livro-razao/penalizacao-antecipacao-um-ano-neutra.json`, com os campos `excerpt` e `verifications`.
- **A cor:** em `/temas`, `getComputedStyle` de todos os elementos, contando as cores de `color`, `backgroundColor`, bordas, `fill` e `stroke` com saturação acima de 30 em 255, dá 0. Depois `grep` de `sq-fora|sq-dentro|est-dentro|barra-fora|barra-dentro` no HTML das páginas.
- **A pesquisa:** em `/lugares/`, na consola:
  `c=document.querySelector('[data-pesquisa]'); c.value='mourao'; c.dispatchEvent(new Event('input',{bubbles:true}));`
  Depois ver `document.querySelector('.pesquisa-res').hidden`, que dá `true`, e o `hidden` do `<li>` de `data-normal="mourao"`, que dá `false`.
- **O rótulo:** a posição de «Texto gerado por intelig» no texto visível de cada página, dividida pelo comprimento do texto.
- **A habitação:** `grep -i -E 'propriedade|arrend|inquilin|ocupa'` no texto de `/`, `/temas/`, `/uniao-europeia` e `/en` dá 0. A frase da Agenda está no item «Habitação: o que cada instituição mede…».
- **Os comprimentos e o contraste:** Playwright com `colorScheme` claro e escuro, `viewport` 1 280 × 800 e 390 × 844, e `isMobile`/`hasTouch` a 390. A altura vem de `documentElement.scrollHeight`, e o contraste da cor calculada contra o primeiro fundo opaco antepassado.

---

## 10 · O que não testei

- **Telemóveis reais:** só emulação no Chromium e no WebKit.
- **Leitores de ecrã.**
- **O envio de uma correção.**
- **A edição inglesa**, além da primeira página e de um recibo.
- **Redes lentas.**
- **As larguras de 768, 1 024 e 1 600 px:** o projeto capta cinco larguras, e eu vi 390, 606, 1 280 e 1 440.
- **Os documentos dos estudos antigos**, além do das Penalizações.
- **A notificação do INE de hoje** (item 4 do prompt).
