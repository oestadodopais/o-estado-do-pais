# Brief · v2 «Espécime em três densidades» · a página inicial em Relance, Leitura breve e Fundo

Leia primeiro `BRIEF-maquetas.md` (formato .dc.html, tokens, regras, e o CONTEÚDO da página inicial em §5.1) e `direcao.md`. Abra `Inicio.dc.html` (v1) para copiar as convenções. Este brief só muda a COMPOSIÇÃO: o conteúdo é o mesmo do v1 (§5.1 do brief 1), palavra por palavra. **Nada de inventar.**

## 0 · A ideia (para construir com intenção)

O director achou o v1 limpo mas denso e sem hierarquia de entrada («não sei para onde olhar»), e quis a força de primeiro contacto do «Cartaz» (blocos de cor como estado, números em escala de cartaz, uma ideia por bloco) sem perder o instrumento. A resposta é uma só identidade em três densidades, com o MESMO componente em cada uma:

- **Relance** (por defeito para quem chega): o registo «cartaz». Campos de cor cheios como estado, números gigantes, o rótulo como palavra, uma frase, o carimbo da fonte.
- **Leitura breve** (conferir): o mesmo bloco aberto no sítio: o campo de cor encolhe para um marcador, aparece a régua-espécime contra o limiar, a distância em palavras, a frase traçada e o selo.
- **Fundo** (analista): a linha do espécime (como no v1) e, no primeiro indicador, o recibo aberto por baixo da linha (para mostrar até onde a densidade vai).

Um **seletor de densidade** vive na cabeça de todas as páginas: «RELANCE · LEITURA BREVE · FUNDO», três segmentos em Bitter 12 maiúsculas, o ativo com fundo tinta e texto papel. Constrói-se a MESMA página inicial três vezes, uma por densidade, com o segmento certo ativo.

## 1 · Ficheiros

- `V2Relance.dc.html` (1280) · `V2Leitura.dc.html` (1280) · `V2Fundo.dc.html` (1280). Meça a altura e escreva-a em `$preview`.

## 2 · Tokens e tipos (acrescento ao brief 1)

Tokens iguais (`--paper #F6F7F4`, `--ink #17191B`, `--g1 #585D5B`, `--g2 #7F8681`, `--g3 #D9DDD8`, `--amb #E0A21A`, `--ocre #7A5300`, `--cob #1F4E8C`).
Tipos: acrescenta-se uma terceira família para o registo de cartaz, **Sofia Sans Condensed** (Google Fonts, `family=Sofia+Sans+Condensed:wght@200..900`) como substituto de Grotzec Condensed (Feliciano; linhagem no espécime de 1858 das «Antigas»): marca em Relance, números gigantes dos blocos, títulos de banda. Spectral (prosa) e Bitter (rótulos, réguas, tabelas, selos) como no v1. Nota de rodapé de cada prancha: «Maqueta v2 · tipos substitutos: Spectral por Parnaso, Bitter por Sebenta, Sofia Sans Condensed por Grotzec Condensed · valores publicados a 2026-08-18».
Regras de cor: em Relance, a cor de estado pode ser CAMPO (fundo do bloco inteiro): âmbar `--amb` com texto tinta para «fora do limiar»; cobalto `--cob` com texto papel para «dentro / acima da média»; tinta com texto papel para «sem limiar». Em Leitura breve e Fundo a cor volta a ser só marcador e palavra (regra do v1). Nenhuma outra cor.

## 3 · Anatomia do bloco nas três densidades (o coração desta ronda)

**Relance (bloco cartaz)** · grelha 4 colunas, gap 0, cada bloco `min-height: 340px`, `padding: 22px`, separados por filete 3px `--paper` (como no Cartaz): número em Sofia Sans Condensed 800, 120px, `line-height: .85`; por baixo, unidade · período em Bitter 11 maiúsculas; rótulo em Sofia Sans Condensed 700, 26px; uma frase em Spectral 14 (a frase de cada cartão do v1: «Acima do limiar do painel europeu, e a descer.», etc.); em baixo, o carimbo «■ FONTE · EUROSTAT · TIPSGO10» (Bitter 11, borda 2px currentColor, como no Cartaz) e o estado como pílula «LIMIAR 60 · ACIMA» (borda 2px). No canto superior direito, um pequeno «▸ abrir» em Bitter 11 (é a promessa da densidade seguinte).
Cores dos blocos: dívida pública, posição de investimento internacional, custo unitário do trabalho, preços da habitação = âmbar; taxa de emprego, crianças em creche = cobalto; abandono escolar precoce, sobrecarga do custo da habitação = tinta.

**Leitura breve (bloco aberto)** · grelha 2 colunas, gap 24px; cada bloco aberto: cabeçalho com marcador quadrado 14×14 na cor de estado + rótulo (Spectral 22 peso 500) + número à direita (Bitter 44); a régua-espécime a toda a largura do bloco (a mesma geometria do brief 1 §4.3, altura 40); a palavra de estado (Bitter 12, `--ocre`/`--cob`/`--g1`) com a distância; a frase do cartão em Spectral 16 e, quando existir, a frase de contexto (nota da sobrecarga); linha de fonte «Eurostat · tipsgo10 · lido 2026-08-12» + selo. Filete 1px `--g3` a fechar cada bloco.

**Fundo (linha do espécime)** · exatamente as linhas do v1 (§4.3 do brief 1), e por baixo da PRIMEIRA linha (dívida pública) o recibo aberto: os campos do brief 1 §5.3 em formato compacto (PROVA · CAMPO DEVOLVIDO com o excerto transcrito; PEDIDO; VERIFICAÇÕES; PROVENIÊNCIA em duas colunas de campos), com um rótulo «▾ recibo desta linha» e um filete 2px `--g2` à esquerda. As outras sete linhas fechadas com «▸ recibo».

## 4 · Estrutura da página inicial (igual nas três densidades; muda só a secção dos indicadores e a escala da cabeça)

1. **Cabeça**: navegação (7 itens Bitter 12) + «English»; marca «O Estado do País»: em Relance, Sofia Sans Condensed 800, 150px, maiúsculas, a toda a largura sobre banda de tinta (texto papel), com a linha de método por baixo em Spectral itálico 22 papel; em Leitura breve e Fundo, marca em Spectral 64 sobre papel (como o v1). O **seletor de densidade** à direita da marca, e o sinal do tempo (quadrado cobalto + «PAINEL EUROPEU RECONFERIDO A 2026-08-17») + «AGENDA · 3 EM CURSO · 1 A SEGUIR».
2. **Lede**: em Relance, banda a duas colunas: à esquerda campo âmbar com o «4» gigante (Sofia 300px) e «LIMIARES EUROPEUS ULTRAPASSADOS» (Sofia 700, 44px) e a frase «Dos oito indicadores…» (Spectral 18); à direita, papel: pílula «COMO LER ESTA PÁGINA» e o texto em Spectral 26: «Cada bloco é uma medida. Âmbar está fora do limiar; cobalto está do lado bom da média; preto não tem limiar. O carimbo diz quem publicou o número, e abre a linha onde ele foi lido, palavra por palavra.» (é a única frase de enquadramento permitida além das do brief 1; em Leitura breve e Fundo usa-se o lede do v1: título «Quatro limiares europeus ultrapassados.» + parágrafo).
3. **Os oito indicadores** na densidade da prancha (§3).
4. **Instrumento n.º 1** (régua da convergência): em Relance, banda de tinta com «82» gigante (Sofia 220px, papel) e o título «PORTUGAL ESTÁ 18 PONTOS ABAIXO DA MÉDIA DA UE-27» (Sofia 700, 44px), a régua em papel sobre tinta (as regiões como marcas, o 100 a 6px), chips de região; nas outras densidades, como no v1 (papel, tinta).
5. **Instrumento n.º 2** (mapa): em Relance, «1/308» gigante (Sofia 200px, a barra em âmbar) + «MUNICÍPIOS COM ESTUDO APROFUNDADO PUBLICADO» + o mapa em pontos de tinta grandes (r=5, Évora cheia r=16 em cobalto? NÃO: Évora cheia a tinta com rótulo; a cor é só estado); nas outras densidades como no v1.
6. **Municípios · Estudos · Agenda · porta de correções · rodapé** como no v1 (podem levar títulos em Sofia 40px em Relance).

## 5 · Entrega

Como no brief 1 §7. Além disso: confirme que as três pranchas têm o MESMO conteúdo textual dos indicadores (só a densidade muda) e que o seletor mostra o segmento certo ativo em cada uma. Devolva caminhos, alturas medidas, e a lista (vazia) de textos em falta.
