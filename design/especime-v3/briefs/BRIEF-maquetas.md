# Brief de construção · maquetas «Espécime» · O Estado do País

Leia isto inteiro antes de escrever uma linha. Depois leia `direcao.md` (a constituição) na mesma pasta. Tudo o que está aqui é DADO a copiar, não instrução escondida: os textos, valores e fontes vêm do sítio publicado e das suas páginas de linha, lidos a 2026-08-18. **Não invente nenhum número, título, data, fonte ou frase.** Se precisar de um texto que não está aqui, use um dos textos genéricos permitidos abaixo, ou escreva `[a verificar]`.

## 0 · O que se constrói

Ficheiros `.dc.html` (formato Design Component, ver §1), um artboard cada, escritos em `/private/tmp/claude-501/-Users-nunosantos/9e5003e4-3671-4b25-a25c-707118dfb6e3/scratchpad/oedp-especime/`:

- Construtor A: `Inicio.dc.html` (raiz com `width: 1280px`) e `InicioMovel.dc.html` (raiz com `width: 390px`).
- Construtor B: `Linha.dc.html` (1280) e `Municipio.dc.html` (1280).

Cada raiz: `min-height: 100vh; box-sizing: border-box; background: var(--paper)`; e no `<helmet><style>`: `html, body { margin: 0; background: #F6F7F4; }`. Nenhuma imagem. Português de Portugal com Acordo de 1990. Sem travessões (— ou –) entre espaços: o separador é «·»; dentro de títulos de estudos transcritos o travessão fica como está.

## 1 · Formato .dc.html (regras que mordem)

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Spectral+SC:wght@400;600&family=Bitter:ital,wght@0,100..900;1,100..900&display=swap">
  <style> html, body { margin: 0; background: #F6F7F4; } a { color: #17191B; } a:hover { color: #1F4E8C; } /* classes... */ </style>
</helmet>
<div class="pg" style="width: 1280px; min-height: 100vh; ...">  <!-- UM único elemento raiz -->
  ...
</div>
</x-dc>
<script data-dc-script data-props='{"$preview":{"width":1280,"height":2400}}'>
class Component extends DCLogic {
  renderVals() { return {}; }
}
</script>
</body>
</html>
```

- Mantenha a linha `<script src="./support.js"></script>` exatamente assim. Um só elemento raiz dentro de `<x-dc>`. Feche todos os elementos não-vazios; todos os atributos entre aspas duplas. Sem `{{ }}` (não há dados dinâmicos). `data-props` fica só com `$preview` (width e height iguais ao tamanho real do artboard; meça a altura no fim e escreva-a).
- Contentores de layout com `display: flex`/`grid` e `gap` em estilo inline (o editor edita estilos inline); tipografia e cores podem ir em classes no `<style>` do helmet.
- Ícones: nunca emoji; se precisar de um ícone, SVG inline simples (traço 1.5px, grelha 16/20px). O selo é CSS (abaixo), não é ícone.
- Alvos de toque na maqueta móvel ≥ 44px de altura.
- Sem modo escuro nesta maqueta (a constituição diz que existe; aqui só a claro).

## 2 · Tokens (copie tal e qual)

```css
:root, .pg { --paper: #F6F7F4; --ink: #17191B; --g1: #585D5B; --g2: #7F8681; --g3: #D9DDD8; --amb: #E0A21A; --ocre: #7A5300; --cob: #1F4E8C; }
```
- Papel: `--paper` domina a área. Tinta: `--ink`. Texto secundário: `--g1` (6,2:1). Eixos e linhas de referência (2px): `--g2`. Grelhas e filetes finos (1px): `--g3`.
- Estados (as ÚNICAS cores fora de tinta/cinzentos): **fora do limiar** = marcador `--amb` (nunca como texto) + palavra `--ocre`; **dentro / acima da média** = `--cob` (marcador e palavra); **sem limiar** = tinta/cinzento; **por confirmar** = sem cor, forma tracejada. Nada mais leva cor: nem títulos, nem fundos, nem cartões, nem ícones, nem links (links a tinta, sublinhado fino `text-decoration-thickness: 1px; text-underline-offset: 3px`).
- Fundos: só `--paper`. Sem cartões com sombra, sem cantos arredondados (raio 0), sem bordas coloridas, sem gradientes. Estrutura por filetes: 1px `--g3` entre linhas; 2px `--g2` para a linha forte que abre uma secção; 1px `--ink` para a linha da marca.

## 3 · Tipografia (substitutos OFL, declarados)

- **Spectral** substitui Parnaso: marca, títulos, ledes, prosa. Corpo 17px/1,55; lede 21–23px/1,4; títulos de secção 26–30px peso 500; marca 40px (interiores) e 64–72px (início). Algarismos na prosa: `font-variant-numeric: oldstyle-nums`.
- **Bitter** substitui Sebenta: TODOS os números medidos, rótulos, unidades, períodos, cabeçalhos de tabela, navegação, palavras de estado, selo, réguas. `font-variant-numeric: tabular-nums lining-nums`. Valores do Relance 44–56px peso 500; valores em linha (tabelas) 20–24px; rótulos 11–12px maiúsculas com `letter-spacing: .08em` peso 600 cor `--g1`.
- **Spectral SC** para versaletes de navegação secundária se precisar (opcional).
- Cada artboard leva, no canto inferior direito do rodapé, uma linha em 11px `--g1`: «Maqueta · tipos substitutos: Spectral por Parnaso, Bitter por Sebenta · valores publicados a 2026-08-18».
- Números: menos verdadeiro «−»; milhares com espaço fino «54 681 562»; vírgula decimal; percentagem colada «89,7%».

## 4 · Componentes (a mesma peça em todas as páginas)

**4.1 Cabeçalho (Início).** Linha 1, altura ~48px: navegação à esquerda em Bitter 12px maiúsculas espaçadas: Início · Municípios · Estudos · Livro-razão · Agenda · Método · Sobre; à direita «English». Filete 1px `--g3` por baixo. Linha 2: marca «O Estado do País» em Spectral 64px peso 500 (Início) com a linha de método por baixo em Spectral itálico 18px `--g1`: «Portugal, medido. Cada número tem fonte.» À direita da marca, alinhado à base, o **sinal do tempo**: um quadrado 12×12 `--cob` + «PAINEL EUROPEU RECONFERIDO A 2026-08-17» em Bitter 11px maiúsculas, e por baixo «AGENDA · 3 EM CURSO · 1 A SEGUIR» (sem quadrado). Filete 1px `--ink` a fechar o cabeçalho. Nas páginas interiores (Linha, Município): a marca encolhe para 24px numa linha com a navegação (marca à esquerda, nav ao centro, sinal do tempo à direita), altura total ≤ 72px, filete 1px `--ink`.

**4.2 Selo.** `<a class="selo" href="#">fonte</a>` com CSS:
```css
.selo { display: inline-flex; align-items: center; gap: 6px; font-family: "Bitter", Georgia, serif; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink); text-decoration: none; white-space: nowrap; }
.selo::before { content: ""; width: 9px; height: 9px; background: var(--ink); display: inline-block; }
.selo.pc::before { background: transparent; border: 1px dashed var(--ink); }   /* por confirmar */
```
Um selo ao pé de CADA valor publicado (nas linhas do painel, nos mosaicos, dentro das frases da Leitura breve, nas tabelas do Fundo). Estado «pc» só onde indicado.

**4.3 Régua-espécime (linha do painel).** Grelha de uma linha, colunas `minmax(220px, 1.4fr) 84px minmax(220px, 1fr) 210px 64px`, gap 16px, `padding: 12px 0`, filete 1px `--g3` por baixo; a primeira linha da lista abre com 2px `--g2`. Colunas: (1) nome do indicador em Spectral 18px peso 500 e por baixo em Bitter 11px `--g1` a unidade · período · fonte e código; (2) valor em Bitter 26px alinhado à direita; (3) o SVG da régua; (4) palavra de estado em Bitter 12px maiúsculas peso 600, `--ocre` para fora, `--cob` para dentro/acima da média, `--g1` para sem limiar; (5) o selo.
Régua SVG (`viewBox="0 0 300 30" width="100%" height="34" style="overflow: visible"`): linha base y=16 de x=0 a 300, `--g3` 1px; escala escrita em Bitter 9px `--g1` nas pontas (mín. à esquerda, máx. à direita, y=6) e, se houver limiar, o rótulo «limiar N» centrado sobre a linha do limiar (y=6); barra do valor: `rect y=12 height=8` de 0 até x(valor), fill `--ink` (para «sem limiar»: fill `--g2`); traço do limiar: `line` vertical x(limiar), y 4→28, `--g2` 2px; marcador do valor: círculo r=6,5 em x(valor), fill `--amb` com `stroke=#17191B stroke-width=1` (fora), fill `--cob` (dentro), ou círculo vazio `fill=#F6F7F4 stroke=#17191B stroke-dasharray="3 2"` (por confirmar). Escalas fixas por indicador (não normalize entre indicadores):
- Dívida pública: 0…120, limiar 60 → x(60)=150, x(89,7)=224,25.
- Posição de investimento internacional: −70…0 (o zero fica à direita), limiar −35 → x(−35)=150, x(−50,2)=84,9; a barra vai do zero (x=300) até ao valor: `rect x=84.9 width=215.1`.
- Custo unitário do trabalho: 0…30, limiar 9 → x(9)=90, x(21,3)=213.
- Preços da habitação: 0…30, limiar 9 → x(9)=90, x(17,6)=176.
- Taxa de emprego: 0…100 → x(79,6)=238,8; sem limiar; marcador `--cob`; estado «ACIMA DA MÉDIA UE · SEM LIMIAR».
- Crianças em creche: 0…100 → x(57,9)=173,7; marcador `--cob`; estado «DESTAQUE NO PAINEL SOCIAL · SEM LIMIAR».
- Abandono escolar precoce: 0…40 → x(6,1)=45,75; marcador tinta (círculo `--ink`); estado «SEM LIMIAR».
- Sobrecarga do custo da habitação: 0…40 → x(6,3)=47,25; marcador tinta; estado «ABAIXO DA MÉDIA UE · SEM LIMIAR».
Palavras de estado com limiar: «▲ ACIMA DO LIMIAR 60 · +29,7» (dívida), «▼ ABAIXO DO LIMIAR −35 · −15,2» (PII), «▲ ACIMA DO LIMIAR 9 · +12,3» (CUT), «▲ ACIMA DO LIMIAR 9 · +8,6» (preços). Os quatro em `--ocre`.

**4.4 Mosaico (Relance de município).** Grelha 4 colunas, gap 0, cada célula com filete 1px `--g3` à direita e em baixo, `padding: 16px 18px`: valor Bitter 44px; nome Spectral 17px peso 500; unidade · período em Bitter 11px `--g1`; uma frase de fonte em Spectral 14px `--g1`; selo.

**4.5 Tabela do Fundo (contas).** Linhas com rótulo à esquerda em Bitter 11px maiúsculas `--g1` (largura 220px) e valor em Bitter 18px tabular à direita + unidade + selo; filetes 1px `--g3`.

**4.6 Banda de mandatos.** Grelha `4fr 4fr 4fr 4fr 1.2fr`, gap 2px, cada célula com `border-top: 2px solid var(--g2)`, texto Bitter 11px «2009 · PS», «2013 · CDU», «2017 · CDU», «2021 · CDU», «2025 · PS» (a última com `border-top-style: dashed`, em funções). Sem cor por partido; o rótulo é registo.

**4.7 Marca de água (Linha, só se houver campo por confirmar).** Nesta linha (`divida-publica-2025`) NÃO há: a proveniência está completa. Não desenhe marca de água aqui. Só o campo «Reconferido a» leva o marcador `[a verificar]` (texto em Bitter 11px, dentro de colchetes, tinta, com `border: 1px dashed var(--ink); padding: 1px 5px`).

**4.8 Porta de correções (todas as páginas, palavras exatas).** Rótulo «ENCONTROU UM ERRO» e o texto: «Escreva para correcoes@oestadodopais.pt. Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.» + «O registo de correções →».

**4.9 Rodapé.** Navegação: Início · Municípios · Estudos · Livro-razão · Agenda · Método · Correções · Sobre · English (Bitter 12px maiúsculas), filete 1px `--ink` por cima; e a linha de autoria em Spectral 15px: «Produzido maioritariamente por inteligência artificial, com o mínimo de intervenção humana. A direção é de Nuno dos Santos.» + a linha da maqueta (§3).

## 5 · Conteúdo verificado (copiar tal e qual)

### 5.1 Início

Secção 1 (lede, molde de comunicado estatístico): rótulo «O PAÍS EM NÚMEROS VERIFICADOS · PAINEL EUROPEU · 2025». Título Spectral 40px: «Quatro limiares europeus ultrapassados.» Lede: «Dos oito indicadores do painel europeu que este sítio publica, quatro têm limiar da Comissão e os quatro estão fora dele: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação. Painel de 2025, lido do Eurostat a 2026-08-12.» Frase de enquadramento (permitida): «O painel de desequilíbrios macroeconómicos e o painel social europeu, com os limiares que as instituições publicam.»

As oito linhas (nome · valor · unidade · período · fonte e código):
1. Dívida pública · 89,7 · % do PIB · 2025 · Eurostat, tipsgo10
2. Posição de investimento internacional · −50,2 · % do PIB · 2025 · Eurostat, tipsii10
3. Custo unitário do trabalho · 21,3 · variação em três anos, % · 2025 · Eurostat, tipslm10
4. Preços da habitação · 17,6 · variação anual, % · 2025 · Eurostat, tipsho20
5. Taxa de emprego · 79,6 · % da população dos 20 aos 64 anos · 2025 · Eurostat, lfsi_emp_a
6. Crianças em creche · 57,9 · % das crianças com menos de 3 anos · 2025 · Eurostat, tepsr_sp210
7. Abandono escolar precoce · 6,1 · % dos 18 aos 24 anos · 2025 · Eurostat, edat_lfse_14
8. Sobrecarga do custo da habitação · 6,3 · % da população · 2025 · Eurostat, tespm140
Todos lidos a 2026-08-12. Nota sob a lista (Spectral 15px `--g1`): «A sobrecarga do custo da habitação (6,3) está abaixo da média europeia, e a própria Comissão adverte que só se lê ao lado do regime de propriedade: onde a taxa de proprietários é alta, esta medida não vê quem não conseguiu comprar.» E: «Painel europeu reconferido a 2026-08-17.»

Instrumento n.º 1 · A régua da convergência: «PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em 100. Selecione regiões para as pôr na mesma régua.» Portugal 82 · ÍNDICE · UE-27 = 100 · 2024 · Eurostat, nama_10r_2gdp, lido a 2026-08-13. Frase: «Portugal está 18 pontos abaixo da média da UE-27.» Regiões (2024): Grande Lisboa 129 · Algarve 89 · Madeira 88 · Alentejo 77 · Península de Setúbal 55. Distância Setúbal–Grande Lisboa: 74 pontos (linha calculada). Desenho: régua horizontal a tinta 50…130, o 100 a 2px `--g2` com rótulo «UE-27 = 100», marcador de Portugal (círculo tinta), regiões como pequenos círculos `--g2` com rótulo em Bitter 10px; a barra de 82 a 100 a tinta. Chips de região (botões) em Bitter 12px com borda 1px `--g2`, o ativo com fundo tinta e texto papel.

Instrumento n.º 2 · O país em pontos · 308: «Um ponto por município, na posição real do seu centróide. Sem fronteiras desenhadas: a forma do país é o que os dados fazem.» 1/308 municípios com estudo aprofundado publicado; «Aceso: Évora · 5 estudos aprofundados publicados (dois com edição em inglês). Os restantes 307 pontos marcam a posição do município; não representam cobertura.» Contagem: Continente 278 · Açores 19 · Madeira 11 · Total 308 (estas quatro contagens têm campo por confirmar: selo `pc` + «[a verificar]»). Posições: DGT, Carta Administrativa Oficial de Portugal 2025, lido a 2026-08-12. Mapa: os 308 pontos estão em `/private/tmp/claude-501/-Users-nunosantos/9e5003e4-3671-4b25-a25c-707118dfb6e3/scratchpad/oedp-redesign/pontos.json` (array de {x, y, m, d, lit}; viewBox 600×790; ilhas já em recortes: Madeira retângulo x=146.8 y=433.6 w=108.5 h=92.9, Açores x=14 y=584.9 w=250 h=164.3). Gere os `<circle>` com um script (Bash + node) e cole no SVG: pontos vazios `fill="#F6F7F4" stroke="#17191B" stroke-width="1" r="3.2"`; Évora (lit=true) cheia `fill="#17191B" r="9"` com rótulo «Évora» em Bitter 14px. Recortes das ilhas com `stroke=#D9DDD8`.

Municípios (chamada): «Évora» + intro «Esta página mede o município de Évora e mostra de onde vem cada medida. Não interpreta: onde uma fonte não estabelece uma coisa, a página di-lo em vez de a supor.» + quatro valores: 58 567 população residente · 2025 (INE); 105,5 índice de dívida · teto legal 150 · 2024 (calculado, DGAL); 137 dias prazo médio de pagamento · 2025 (Município de Évora); 61,44 % execução da receita · 2025 (Município de Évora). Ligação: «A página inteira, com quem governou →». E «307 municípios sem página ainda».

Estudos (11 trabalhos no arquivo · 15 edições): «Évora — Quinze Anos, Cinco Mandatos» (Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. · PT); «Évora — Os Pelouros, Quem Os Teve, O Que Fizeram» (Publicação: 2026-08-12 · PT); «Évora — Prometido, Pago, Auditado 2026» (Publicação: 2026-08-04 · PT · EN); «Água Não Faturada» (Água não faturada nos sistemas de abastecimento em Portugal. · PT · EN). Ligação «Todo o arquivo →».

Agenda («O que se mede a seguir» · 3 em curso · 1 a seguir · 1 concluído · 0 retirados): «O ficheiro de endividamento de 2025 da DGAL» (Vigilância · Em curso); «As contas de 2026 do Município de Évora» (Vigilância · Em curso; «Apreciação pela Assembleia Municipal entre 2027-04-01 e 2027-04-30.»). Frase: «Cada item traz o critério que o pôs aqui, quem o propôs e quem o decidiu. Nada sai desta lista em silêncio.» Ligação «A agenda e o calendário das fontes →».

Sobre (uma linha permitida no rodapé ou numa chamada): «O Estado do País mede a sociedade portuguesa, no seu contexto interno e na sua posição em relação ao exterior, e mantém dessa medição um registo contínuo, claro e permanente.»

### 5.2 Início móvel (390)

O mesmo conteúdo, uma coisa por linha: cabeçalho compacto (marca 32px, «English», menu como lista de sete itens em Bitter 12px maiúsculas com 44px de altura cada, ou uma linha rolável); sinal do tempo; lede; as oito linhas como blocos verticais: nome, valor grande (Bitter 40px) com o selo ao lado, a régua a toda a largura, a palavra de estado; depois régua da convergência (só Portugal 82 e a frase, com os chips em linha rolável), o mapa (largura 300, altura proporcional), Évora (quatro valores em 2×2), estudos (lista), agenda (lista), porta de correções, rodapé. Nada rola lateralmente; nenhum texto abaixo de 12px.

### 5.3 Linha do livro-razão · `divida-publica-2025` (o recibo)

Cabeçalho interior. Rótulo «LINHA DO LIVRO-RAZÃO». Valor: «89,7» Bitter 72px + unidade «% do PIB» Bitter 16px + selo (a porta é a própria linha: `href="#prova"`). Id em Bitter 12px `--g1`: `divida-publica-2025`. Frase de atribuição (Spectral 21px): «Publicado por Eurostat, em General government gross debt (EDP concept), consolidated - annual data (tipsgo10) · lido a 2026-08-12».
Corpo em duas colunas: esquerda (68ch) e coluna do aparelho (300px), como um impresso: filetes finos, rótulos Bitter 11px maiúsculas sempre à esquerda na mesma posição.
Esquerda, por ordem fixa:
- PROVA · CAMPO DEVOLVIDO: caixa com filete 1px `--g3` à esquerda (3px `--g2`), texto em Bitter 15px (o Mono substituto): «General government gross debt (EDP concept), consolidated - annual data — Percentage of gross domestic product (GDP) — Portugal — 2025: 89.7» (transcrito; os travessões ficam). Por baixo, Spectral 14px `--g1`: «Transcrito da fonte, palavra por palavra.»
- PEDIDO: `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tipsgo10?format=JSON&lang=EN&geo=PT&unit=PC_GDP` em Bitter 13px, sublinhado, com quebra `overflow-wrap: anywhere`.
- VERIFICAÇÕES: tabela de duas linhas: LIDO A · 2026-08-12; RECONFERIDO A · `[a verificar]` · «A regra da releitura →».
- CORREÇÕES E ATUALIZAÇÕES DESTA LINHA: «Esta linha nunca foi corrigida nem atualizada.» · «Correções: públicas, datadas, permanentes · A política inteira →».
Coluna do aparelho (rótulo PROVENIÊNCIA com filete 2px `--ink` por cima): FONTE · Eurostat; SÉRIE · General government gross debt (EDP concept), consolidated - annual data; EDIÇÃO · tipsgo10; LIDO A · 2026-08-12; DADOS DE · 2025; ESTUDO · Quadro institucional de indicadores, leitura direta da fonte; caixa «ESTADO DA PROVENIÊNCIA · Completa.»; porta de correções (§4.8); ligações «VOLTAR AO LIVRO-RAZÃO» · «COMO ISTO É FEITO».
Rodapé §4.9.

### 5.4 Município · Évora

Cabeçalho interior. Rótulo «MUNICÍPIO»; título «Évora» Spectral 56px; «DISTRITO DE ÉVORA · ALENTEJO CENTRAL» Bitter 12px; intro (5.1). RELANCE: «Oito medidas. Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas di-lo na sua linha.» Mosaico 4×2:
1. 58 567 · População residente · pessoas · 2025 · «Estimativa anual do INE para o concelho.» (INE)
2. 111,47 · Poder de compra por habitante · índice · média nacional = base · 2023 · «Poder de compra per capita, publicado pelo INE para todos os concelhos.» (INE)
3. 1 596 · Desemprego registado · pessoas · dezembro de 2024 · «Inscritos no fim do mês nos serviços de emprego, ficheiro mensal por concelho.» (IEFP)
4. 7 907 · Empresas sediadas · empresas · 2024 · «Sistema de contas integradas das empresas, por concelho da sede.» (INE)
5. 54 681 562 · Dívida total do município · euros · 2024 · «Série anual da Direção-Geral das Autarquias Locais, o regulador das contas municipais.» (DGAL)
6. 105,5 · Índice de dívida · percentagem, teto legal = 150 · 2024 · «Calculado sobre duas colunas do mesmo ficheiro do regulador. A aritmética está na linha.» (calculado)
7. 61,44 · Execução da receita · percentagem do orçamento · 2025 · «Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central.»
8. 137 · Prazo médio de pagamento · dias · 2025 · «Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central.»
LEITURA BREVE («Uma frase por medida. Todos os números são citações do livro-razão.»), cada número seguido do selo:
- «A população residente subiu de 55 711 em 2021 para 58 567 em 2025.»
- «O poder de compra por habitante está acima da média nacional, que é a base do índice: 111,47 no concelho, enquanto a sua região, o Alentejo Central, está abaixo dessa média, em 93,86.»
- «O desemprego registado no fim de dezembro caiu de 3 720 pessoas em 2013 para 1 596 em 2024.»
- «Estão sediadas no concelho 7 907 empresas.»
- «A execução da receita caiu de 96% do orçamento em 2021 para 61,44% em 2025.»
- «O índice de dívida do regulador desceu de 242,6% em 2014 para 105,5% em 2024, nos quatro anos que esta página publica.» + gráfico: barras a tinta 2014 242,6 · 2017 182,0 · 2021 141,9 · 2024 105,5, teto legal 150 como linha 2px `--g2` com rótulo «limite legal 150»; a barra acima do teto leva marcador `--amb`, a barra abaixo `--cob`? NÃO: as barras ficam a tinta; só a palavra de estado ao lado do último valor: «ABAIXO DO TETO LEGAL 150 · −44,5» em `--cob`.
Coluna do aparelho (300px): PROVENIÊNCIA: «Cada valor desta página tem uma linha no livro-razão. O selo ao lado do número é a porta para essa linha, onde estão a fonte, o documento, o sítio exato de onde o valor foi lido, o excerto e o dia em que foi lido. Nenhuma data de leitura é escrita aqui: quem quiser sabê-la, abre a linha.» Caixa «O QUE ESTA PÁGINA NÃO SABE»: «Não existe medida de desempenho por pessoa. As contas públicas não são cortadas dessa maneira.» · «A repartição de pelouros do mandato de 2009-2013 não foi estabelecida: o presidente desse mandato, e todos os outros membros dele, não foram identificados.» · «O nome legal completo do presidente interino de 2013 é [a verificar] nas palavras do próprio trabalho: duas fontes oficiais dão nomes completos diferentes.» + «MÉTODO E RESSALVAS →»; porta de correções; ligações «VOLTAR AO MAPA DOS MUNICÍPIOS» · «LIVRO-RAZÃO» · «COMO ISTO É FEITO».
FUNDO · «A última prestação de contas do município» («O que o município orçamentou, o que cobrou, o que pagou, e o que dizia dever no fim do ano. São números do próprio município sobre si mesmo: a prestação de contas é dele.»): ORÇAMENTO CORRIGIDO 109 483 314,95 € · RECEITA COBRADA 67 263 297,08 € · DESPESA PAGA 65 565 049,87 € · DÍVIDA TOTAL 54 379 034,55 € · LIMITE DE DÍVIDA 82 571 687,05 € · MARGEM DE ENDIVIDAMENTO 28 192 652,50 €. «A diferença entre as duas contas da mesma dívida» («O regulador e o município publicam a dívida do mesmo ano com uma diferença. A diferença é pequena, e mostra-se porque é o único sítio onde uma voz de fora e a voz do próprio medem a mesma coisa.»): O REGULADOR PUBLICA 54 681 562 € · 2024; O MUNICÍPIO PUBLICA 54 680 635,58 € · 2024; DIFERENÇA 926 € · «a diferença é publicada arredondada ao euro; os dois valores acima diferem em cêntimos».
MANDATOS, NO TEMPO: banda §4.6 e por baixo a primeira ficha: «2009–2013 · José Ernesto d'Oliveira, depois Manuel Melgão a partir de 2013-05-01 · PS» · LUGARES 3 · HERDOU «Antes do primeiro ano de contas legível nesta janela.» · DECIDIU «32 166 372,20 € de empréstimo do Programa de Apoio à Economia Local.» · DEIXOU «82 871 522,82 € de dívida total, medidos duas …» (o texto seguinte não está disponível: termine com «…» e não invente). Ligações «ABRIR CADA MANDATO: 2009–2013 · 2013–2017 · 2017–2021 · 2021–2025 · 2025– em funções».
Rodapé §4.9.

## 6 · Textos genéricos permitidos (e mais nenhum)

«Selecione regiões para as pôr na mesma régua.» · «Passe o cursor sobre um ponto para ler o município.» · «sem página ainda» · «sem limiar publicado» · «por confirmar» · «Todo o arquivo →» · «A agenda e o calendário das fontes →» · «Como isto é feito» · «Voltar ao livro-razão» · «Ver a linha».

## 7 · Entrega

Escreva os ficheiros; abra cada um num browser sem cabeça se conseguir (ou confie no HTML) e MEÇA a altura real (por exemplo com `node`+`puppeteer` se existir; se não, estime com rigor: some as alturas) e escreva-a em `$preview.height`. Devolva: os caminhos, a altura de cada artboard, e uma lista de qualquer texto que não conseguiu tirar deste brief (deve estar vazia).
