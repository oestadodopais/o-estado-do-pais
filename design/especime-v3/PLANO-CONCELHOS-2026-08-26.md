# O plano das páginas dos 308 concelhos (decisão 5B de 25.08)

*Escrito a 26.08.2026 pelo lugar de direção (Claude Fable 5), a partir de duas leituras feitas hoje: o reconhecimento do sítio e do motor (Claude Sonnet, só leitura, ≈240k símbolos) e a verificação das fontes centrais, com descarga e leitura de cada ficheiro (Claude Opus, ≈285k símbolos; relatório em `medicoes/fontes-308-2026-08-26.md`). Nada aqui foi escrito de memória: cada facto sobre uma fonte tem o ficheiro descarregado atrás. Sem travessões na prosa deste ficheiro. É um plano para decisão do diretor; nada dele se constrói antes da palavra dele.*

## 0 · Numa frase

Uma página por concelho, `/municipios/<slug>` nas duas edições, com as medidas que as fontes centrais publicam para os 308 e a ausência dita em duas palavras onde não publicam; o motor produz as linhas (≈2 400, cada uma com o ficheiro da fonte alojado, a célula transcrita e a data de leitura), o sítio gera as páginas da vista que já existe, e o livro-razão ganha a página do conjunto com pesquisa, porque 136 linhas numa página são legíveis e 2 500 não são.

## 1 · O que já existe (verificado no reconhecimento)

* A rota, a vista (`src/views/MunicipioView.astro`, disposição B «Corpo e aparelho»), as peças, o cartão localizador e o índice `/municipios` são genéricos: um concelho novo é uma entrada em `src/data/municipios.mjs` (nome, distrito, região, `caopIndex`, as oito medidas com os identificadores das linhas) e as suas linhas em `ledger/claims/`. A vista lê `m.tempo`, `m.contas`, `m.leitura`, `m.estudos`, `m.metodo` e `m.naoSabe` sem os proteger: para um concelho sem estudos, tem de render só o que existe (trabalho do sítio, pequeno).
* As linhas de Évora chegaram pelo exportador do motor (`publisher/export_site_rows.py`); a página de linha `/livro-razao/<id>` é gerada para toda a linha que exista, sem lista escrita à mão. O índice `/livro-razao` rende todas as linhas numa página (D8 da auditoria, por resolver).
* A Carta (`src/data/caop-centroids.mjs`) tem os 308 com nome, distrito ou ilha e centróide, sem código. O INE dá o código: os quatro últimos caracteres do `geocod` NUTS 2024 são o DICO, e a tabela dos 308 já está construída e verificada (`fontes-308/ine_308_lookup.tsv`).
* O motor não tem nada que produza séries por concelho; tem o exportador de linhas, o alojamento de documentos com resumo, e o padrão de estudo por pasta (`content/<NN> <nome>/`). O próximo número livre é 12.

## 2 · O que as fontes centrais publicam para os 308 (verificado a 26.08, ficheiro a ficheiro)

| # | Medida | Fonte central · conjunto | Formato | Último período | 308? | Licença |
|---|---|---|---|---|---|---|
| 1 | População residente | INE, estimativas anuais, indicador `0012917` | API JSON | 2025 | sim | CC BY 4.0 |
| 2 | Poder de compra per capita | INE, estudo concelhio, indicador `0014580` | API JSON | 2023 (bienal) | sim | CC BY 4.0 |
| 3 | Desemprego registado | IEFP, estatísticas mensais por concelho | ODS mensal, sem código, só nome | julho de 2026 | **não: 278, só o continente** | nenhuma declarada |
| 4 | Empresas **não financeiras** | INE, SCIE, indicador `0014061` | API JSON | 2024, definitivos | sim | CC BY 4.0 |
| 5 | Dívida total do município | DGAL, «Evolução do endividamento total, prestação de contas 2024» | PDF, só nome | 2024 | sim (Penedono N.d.) | nenhuma declarada |
| 6 | Índice de dívida | derivado: coluna (5) ÷ limite (coluna (1)) × 150 | cálculo | 2024 | sim (Penedono N.d.) | |
| 7 | Execução da receita | **nenhuma fonte central desde 2019** (a DGAL deixou de publicar o lado do orçamento) | | 2019 | só 2019 | |
| 8 | Prazo médio de pagamentos | DGAL, «Lista do PMP registado por município», dezembro de 2025 | PDF anual, só nome | dez. 2025 | sim (9 N.d., **Évora entre eles**) | nenhuma declarada |

Três factos que mudam o desenho:

1. **A linha de Évora usa a coluna (5) da DGAL** («Dívida total, exclui dívidas não orçamentais, exceções e FAM»: 54 681 562), a que a lei compara com o limite; a coluna (2) («inclui») dá 55 559 123. A diferença é 1,6 % em Évora e 21 % em Lisboa. Os 308 têm de usar a mesma coluna que Évora, e dizê-lo.
2. **A peça 4 de Évora diz «Empresas sediadas» e a série do INE é «empresas não financeiras»**: os 308 valores somam 1 576 606, exatamente a linha «empresas não financeiras» do destaque do INE de 11.12.2025, e não o total de 1 593 415. «Sediadas» não é vocabulário do INE (a palavra «sede» não ocorre em nenhum dos 13 084 indicadores do catálogo); o que está provado é que cada empresa conta num único concelho. O rótulo tem de ser corrigido, com entrada no registo de correções.
3. **As duas medidas que Évora lê dos seus próprios documentos (7 e 8) não têm fonte central com o mesmo perímetro**: a execução da receita não tem fonte nenhuma; o PMP tem a lista anual da DGAL, em que Évora está «N.d.» a 31.12.2025 (e o trimestral seguinte preenche-o com 146, o que mostra que os valores são revistos para trás).

O que os ficheiros exigem ao motor: junção por nome para a DGAL e o IEFP (cinco nomes precisam de alias: as duas Lagoas, as duas Calhetas, Praia da Vitória; «Sertã» aparece duas vezes no IEFP), leitura de PDF com tabela (dois ficheiros da DGAL de 4 a 7 páginas, já lidos pelos scripts da verificação), e a lista do IEFP só se chega pelo índice da página (os URLs têm um UUID que não se constrói).

## 3 · O que se propõe

### 3.1 · A página de um concelho sem estudos

As oito peças da disposição-padrão (Emenda 14), cada uma com o seu selo, e «sem linha ainda» onde a fonte central não publica; o cartão localizador; a barra da dívida contra o limite (instrumento genérico, dois valores); as portas para `/municipios` e para o livro-razão. Sem frases de «Leitura breve» (as peças dizem o que há; uma frase que só repete a peça é enchimento), sem faixa de mandatos, sem estudos, sem «o que não se sabe» (a ausência já está dita nas peças). A página de Évora fica como está, mais as correções da §3.4.

### 3.2 · O motor: o estudo «12 Concelhos»

Uma pasta de estudo com a disciplina dos outros: os ficheiros das fontes alojados com resumo (as respostas JSON do INE, os dois PDF da DGAL, o ODS do IEFP), um leitor por fonte que escreve a tabela de linhas (a verificação de hoje deixou os leitores em `fontes-308/*.py`; são ponto de partida, não produto), a tabela de junção dos 308 (DICO do INE, nome da Carta, nome da DGAL, nome do IEFP, com os cinco alias escritos e o «Sertã» resolvido), e as linhas do livro-razão: por concelho e medida, o valor tal como publicado (`ind_string` do INE, a célula do PDF), a unidade, a fonte, o documento alojado com o localizador (página e linha), o endereço, a data de leitura, a data de referência e o excerto verbatim (a linha do ficheiro); as linhas derivadas do índice com a fórmula, as origens e a conta que o sítio reconfere. Contagem: 308 × 6 (1, 2, 4, 5, limite, 8) + 278 (3) + 307 (6) = **2 433 linhas**, menos as «N.d.», que não são linhas. Somas de controlo como portões: a população dos 308 é a linha «Portugal» (11 424 031), as empresas dos 308 são 1 576 606, o continente do IEFP é 324 162, o total da DGAL é o do ficheiro (universo de 307).

O exportador (`export_site_rows.py`) escreve as linhas em `ledger/claims/<slug>-<medida>-<periodo>.yml` e um JSON com a lista dos 308 para `src/data/municipios.mjs` (o sítio gera as entradas; ninguém escreve 308 entradas à mão). Os ficheiros de outra sessão no motor (`content/11 Seguranca Social/*`, `indicators/*`, `.maintenance-locks/`) não se tocam nem se preparam para commit.

### 3.3 · O sítio

As 308 entradas geradas; a vista a render só o que existe; o índice `/municipios` com os 308 «com página» (a secção «Com página» passa a ser a lista inteira, por distrito, com a pesquisa em cima); os pontos do mapa todos ligações (regra N4), o que faz do I70 (44 pontos com vizinho a menos de um diâmetro) o bloco seguinte, o mapa por distritos (decisão 1B). O livro-razão ganha a página do conjunto: `/livro-razao` continua a listar as linhas dos estudos e passa a ter uma linha «Concelhos · 2 433 linhas →» para `/livro-razao/concelhos`, com pesquisa por concelho (o padrão de `Pesquisa.astro`) e as contagens como chaves da prova; as páginas de linha, o CSV e o JSON continuam a incluir tudo. Os portões contam as chaves novas. A construção cresce de 341 para cerca de 5 800 páginas (616 de concelho e ≈4 870 de linha): o tempo de `gate:html` mede-se no primeiro dia e, se passar do que a Vercel dá, muda-se a forma antes de continuar (o portão sobre `dist/` é o passo que mais cresce).

### 3.4 · As correções em Évora

A peça 4 passa a «Empresas não financeiras» (o termo do INE), com entrada no registo de correções; as peças 7 e 8 seguem a decisão D2 de baixo; a dívida diz a coluna que usa.

### 3.5 · A ordem e as provas

1. **P1, motor** (Opus): fontes, leitores, junção, linhas, exportador, portão do motor verde. Medição cega (Sonnet): uma amostra de 30 concelhos × 6 medidas re-derivada dos ficheiros alojados com código próprio, e as somas de controlo.
2. **P2, sítio** (Opus): a exportação, as entradas geradas, a vista, o índice, o livro-razão do conjunto, os portões e as réguas (a matriz ganha a célula «concelho sem estudos»), as capturas. Leitura do Codex com plantas, sobre um pacote de dez páginas de concelho escolhidas ao acaso e a página do conjunto.
3. **P3, correções em Évora e registo**: DECISIONS §1.68, ISSUES, a nota de estado, o `NEXT.md` do motor, o cofre.

Cada passo com estragos plantados vistos vermelhos, commits com caminhos explícitos, sem fusão até os três estarem verdes e as leituras cruzadas pontuadas.

## 4 · As decisões que são do diretor

**D1 · As peças de um concelho sem fonte.** (A) As oito peças da Emenda 14 em todas as páginas, com «sem linha ainda» onde a fonte central não publica (a execução da receita em 307, o PMP em 9, o desemprego em 30). (B) Só as peças com fonte. Recomendação: **A**; a página declara o que lhe falta, e a falta é informação.

**D2 · As peças 7 e 8 de Évora.** (A) A peça-padrão lê sempre a fonte central: o PMP da lista da DGAL (Évora «sem linha ainda» a 31.12.2025) e a execução «sem linha ainda»; os valores que Évora lê das suas contas (137 dias, 90,5 %) descem para a camada das contas da página dela, com os seus selos. (B) Évora mantém os seus valores municipais na peça, com o selo a dizer a fonte, e os outros 307 leem a DGAL. Recomendação: **A**, porque a mesma peça em 308 páginas tem de medir a mesma coisa; com B, o leitor compara 137 dias de Évora (contas do município) com 5 dias de Lisboa (DGAL) sem saber que são duas definições.

**D3 · A coluna da dívida.** (A) A coluna (5), a que Évora já usa e a que a lei compara com o limite. (B) A coluna (2), que inclui as dívidas não orçamentais, as exceções e o FAM. Recomendação: **A**, dita na unidade ou na legenda («exclui dívidas não orçamentais e exceções legais»).

**D4 · O desemprego dos 30 concelhos das ilhas.** (A) Publicar os 278 do continente agora, «sem linha ainda» nas ilhas, e verificar as fontes regionais (DRQPE nos Açores, IEM na Madeira, ambas em PDF, ainda não lidas) num passo seguinte. (B) Segurar a medida até haver 308. Recomendação: **A**.

**D5 · A correção do rótulo de Évora** («Empresas sediadas» → «Empresas não financeiras»), com entrada no registo de correções. Recomendação: **sim**, e antes do bloco, porque é uma correção do que está no ar.

**D6 · O livro-razão do conjunto** (a página `/livro-razao/concelhos` com pesquisa) entra neste bloco, que é o que a D8 da auditoria adiou. Recomendação: **sim**; sem ela, o índice do livro-razão passa a 27 × 18 ecrãs.

**D7 · O custo.** Três passes de Opus (motor, sítio, correções) e duas verificações cruzadas. A estimativa do lugar de direção, com as contas dos dois últimos blocos à vista (a retirada da vista de escolha custou 485k para apagar; o bloco das correções de UX custou 1,6M contra 250 a 350k estimados): **motor 0,8 a 1,2M; sítio 0,8 a 1,2M; medições e leituras 0,8 a 1,0M; total 2,5 a 3,5M símbolos**. A estimativa da auditoria (250 a 500k) assumia dados prontos a ler; dois PDF e uma junção por nome não são dados prontos a ler.

**Suposições que ficam escritas, e que o diretor pode contrariar:** sem frases de «Leitura breve» nas 307 páginas; as páginas indexáveis como a de Évora (a política do sítio não muda por este bloco); a primeira edição é uma leitura fixa (data de leitura em agosto de 2026), e a releitura periódica (o INE em junho e dezembro, a DGAL em dezembro e abril, o IEFP todos os meses) é um ciclo próprio, desenhado depois, com a disciplina das canárias que o motor já tem para os indicadores nacionais.
