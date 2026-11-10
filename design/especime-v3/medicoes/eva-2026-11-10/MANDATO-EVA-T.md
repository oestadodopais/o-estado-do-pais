# Mandato EVA-T: o estudo das contas da Câmara de Évora atravessa para o sítio, numa edição só (11.11.2026)

Acrescenta: linhas e frases
Medidas: medidas-eva-t.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede. A worktree de arranque é a do sítio (ramo `eva-2026-11-10`, com o `main` de 10.11.2026 dentro); a outra pasta com escrita é a worktree do motor `eva-2026-11-10`, que está na cabeça do `master` (`5925531`). O texto do estudo está julgado e fechado: nada nele se muda aqui. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas, um commit no fim de cada ponto numerado. O teu relatório vai para `RELATORIO-EVA-T.txt`, nesta pasta; as tuas medidas, se as guardares, para `medidas-do-construtor-eva-t.json`, nunca para o ficheiro das medidas deste mandato.*

## Porquê

O estudo 16 está no `master` do motor com o texto que outra família de modelos julgou contra as fontes, e o motor recusa um texto composto diferente do julgado. O sítio ainda mostra o texto antigo, com erros conhecidos. Esta passagem põe no sítio o que o motor prova, como a edição de lançamento do estudo: uma edição só, sem a história das edições de ensaio. E corrige a linha da execução da receita de 2021, que hoje compara duas medidas diferentes.

## §0 O que se mediu (10.11.2026, na cabeça `c34abd2dd` do sítio e `5925531` do motor)

1. **Os registos.** O registo do estudo no sítio tem 172 blocos e 490 referências na edição portuguesa; o do motor tem 198 blocos, 607 referências na portuguesa e 610 na inglesa. O texto julgado tem 502 unidades por língua.
2. **O exportador dos registos não escolhe estudos.** `OEDP_SITE=<sítio> python3 publisher/export_records_site.py --write` corre todas as edições. Medido em ensaio: mudam sete entradas do manifesto dos registos. As duas do 16 mudam nos bytes. A edição portuguesa de `evora-quem-governou-a-camara-2009-2025` também muda nos bytes (as passagens MOT1 e MOT2 nunca atravessaram). As quatro edições de `evora-economia-e-dinheiro-publico-de-fora-da-camara` e de `evora-2027-capital-europeia-da-cultura` mudam só no campo `rh_manifest_sha256`. Sem `OEDP_SITE`, o exportador cai na árvore principal do sítio: põe sempre a variável.
3. **Os documentos.** O motor prova para o HTML do 16 os resumos `e1cfc7392bdaa4b944cdda6d5310c0b00204685e51f79669d7bd42a0a74c4332` (pt) e `50a24a0160b1c86e69bdcbea4f8a7c2c0f8cd47871d129215dddab12083ee651` (en). Nenhum guião do sítio copia hoje os documentos de um estudo: o de `e1c` pede um `origin_ref` entre aspas e as entradas do 16 não as têm.
4. **A história das edições do estudo.** Em `studies-src/manifest.yml`, três versões por língua, uma `primeira_edicao` por língua, e quatro ficheiros em `studies-src/_edicoes/`. Em `src/data/correcoes.mjs`, duas entradas do estudo (uma `texto`, uma `texto_atualizado`). A linha `correcoes-publicadas` vale 50. `tests/edicoes/historia.mjs` e `scripts/datas-editoriais.mjs` usam este estudo como testemunha.
5. **As frases com afirmação.** `ledger/frases/por-registar.json` tem 139 entradas deste estudo, e a lista só encolhe. O texto novo tem dezenas de frases que o detetor marca, nas duas línguas, e nenhuma está nessa lista.
6. **A voz.** A régua da voz apanha uma frase do texto julgado em cada língua: a segunda frase da unidade `C055`, na secção dos limites.
7. **O teto da L1** é 3518.
8. **A linha de 2021.** `ledger/claims/evora-execucao-da-receita-2021.yml` vale `96`, do historial que a Prestação de Contas de 2025 recita na página 112 (a página do campo `page` da linha); atravessa por `publisher/manifest.evora.json` (`rh_id: exec-2021-pct`, do livro do estudo 07). No motor, a linha própria do 16 `exec-total-2021-pct` vale `87.72`, com o excerto `Total 65 108 759,70 57 113 924,56 87,72%` na página 60 do documento de título `RELATÓRIO DE GESTÃO 2021`.

Outras medidas da mesma coisa, e porque diferem: para a execução da receita de 2021 há quatro valores impressos. O Relatório de Gestão de 2021 imprime, na página 60, «87,72%» para o total e «95,61%» para as receitas correntes, e diz na prosa «88%»; na página 61 diz «a execução foi de 96%». A Prestação de Contas de 2025 recita «2021 (96%)». A linha de 2025 do sítio (`61,44`) é a do total. A medida igual à de 2025 é a do total.

## O que fazes

1. **Os registos do 16.** Na worktree do motor, limpa e em `5925531`, corre o exportador dos registos com `OEDP_SITE` na worktree do sítio e `--write`. Fica só o que é do 16: os dois registos, os dois cortes e as duas entradas do manifesto. O registo e a entrada da edição portuguesa de `evora-quem-governou-a-camara-2009-2025` voltam ao que estavam, por guião: esse estudo atravessa no seu bloco, depois de auditado. As quatro entradas que só mudam o `rh_manifest_sha256` ficam como o exportador as escreve, se o `check:registo` as aceitar ao lado da entrada reposta; se não aceitar, diz o que a régua pede e escolhe a forma que conserve os bytes dos outros estudos.

2. **Os documentos, por guião.** Um guião novo nesta pasta (`atravessar-documentos.py <motor> <slug> <data>`), que os blocos seguintes vão reutilizar: copia o HTML de cada língua do motor para `studies-src/_raw/<slug>.<língua>.html` e `studies-src/<slug>/<língua>.html`, confere os resumos contra os que o motor prova, e reescreve as duas entradas do manifesto. A data da edição é `2026-11-11`. Cada entrada fica com uma versão só (`data`, `sha256`, `file` no ficheiro corrente), sem `primeira_edicao` e sem `natureza`, com `origin_ref` no commit do motor que escreveu os bytes, e `fetched_utc`, `bytes_*` e `sha256_*` medidos. Os quatro ficheiros do estudo em `studies-src/_edicoes/` saem. O `check:documentos` (D5) tem de bater.

3. **A história do estudo recomeça.** Com uma versão só:
   - em `src/data/studies.mjs`, `date: '2026-11-11'` e `updated: null` nas duas edições; em `src/data/datas-de-publicacao.json`, a mesma data para as duas, pela origem que a régua das datas aceitar (a data de um estudo com uma versão só é a data dessa versão);
   - o cabeçalho da página imprime só a data de publicação; nenhuma faixa «atualizado a» nem «corrigido a», nenhuma porta para uma edição guardada;
   - as rotas datadas do documento deste estudo deixam de existir; em `vercel.json`, cada uma leva ao documento corrente da sua língua;
   - as duas entradas do estudo em `CORRECOES_TEXTO` ficam no ficheiro como história do ensaio, numa lista à parte que nenhuma página lê e nenhuma régua toma por órfã; a conta que a linha `correcoes-publicadas` conserva continua em 50, sem selo novo; uma entrada viva sem versão continua a recusar (planta);
   - os testes e as réguas que usam este estudo como testemunha de uma história com várias versões passam para outro estudo que ainda as tenha, e dizes qual; a ordem das novidades e as contagens que `tests/rec1/construido.mjs` fixa atualizam-se pela medição;
   - o teto da L1 desce pela medição, com a razão escrita.

4. **O nome, a manchete e a pergunta.** O `<h1>` do documento passou a ser a manchete (a unidade `C001`), e o nome do estudo é a linha em itálico logo abaixo (`C002`). Em `studies.mjs`, o `title` das duas edições fica como está: é o nome, e é ele que as listas, o índice, as portas, as novidades e o `<title>` continuam a imprimir. A régua que prende o `title` ao documento muda de forma, sem afrouxar: o `title` tem de ser, letra por letra, o `<h1>` ou a linha do nome logo abaixo dele (planta: um nome que o documento não imprime recusa). A página do estudo e o documento mostram a manchete como o registo a traz, com o número resolvido na sua referência. A `pergunta` passa a ser a unidade `C003`, transcrita do documento, com as duas entradas de `src/data/verbatim.mjs` a apontar para ela; a `description` fica. A pergunta, nas duas línguas:
   - pt: «A Câmara de Évora tem as contas em ordem?»
   - en: «Are the accounts of the Câmara de Évora in order?»

5. **A página do estudo na forma nova.** O documento já não abre com o título `Em resumo`: abre com a pergunta e a resposta, e segue pela ordem do texto julgado. A página mostra o documento por essa ordem, sem partir a abertura, com o índice feito dos títulos do registo. Confere no HTML construído das duas edições: as listas, os quadros (cada um a deslizar dentro da sua caixa nas larguras estreitas), o quadro das afirmações, as adagas e as notas. Uma régua de mobília que peça a forma antiga aceita a nova.

6. **A leitura do estudo** (`src/data/leituras.mjs`, a entrada deste estudo). As medidas e a nota das medidas ficam. A `frase` passa a ser, com os mesmos dois tokens e o mesmo sufixo de unidade que hoje tem:
   - pt: «A Câmara de Évora cumpre o limite legal da dívida e paga tarde a quem lhe vende: ⟦evora-prazo-medio-de-pagamento-2025⟧ dias, em média, para pagar a um fornecedor em ⟦ano⟧, e ⟦evora-pagamentos-em-atraso-2025⟧ em pagamentos em atraso no fim desse ano.»
   - en: «The Câmara de Évora keeps within the legal debt limit and pays those who sell to it late: ⟦evora-prazo-medio-de-pagamento-2025⟧ days, on average, to pay a supplier in ⟦ano⟧, and ⟦evora-pagamentos-em-atraso-2025⟧ in overdue payments at the end of that year.»
   
   O primeiro token dá só os algarismos da linha; o token do ano é a referência de ano que a casa usa (`{ ref: '2025' }`, como em `src/data/municipios.mjs`), nunca algarismos escritos à mão; o último dá o valor seguido de um espaço fixo e da unidade da linha na língua da página, como hoje. A `origem` passa a citar o parágrafo da unidade `C004` do documento composto, nas duas línguas, com a linha do ficheiro medida por guião.

7. **As frases com afirmação de um texto julgado.** A régua da CAM2-A ganha uma via, sem perder nenhuma: uma frase de uma página de estudo fica coberta quando o estudo tem uma declaração de texto julgado e a frase é, letra por letra, de um bloco do registo desse estudo nessa língua. A declaração vive em `ledger/frases/textos-julgados.json`, uma entrada por estudo e língua: o estudo, a língua, o resumo do documento julgado (o `sha256_normalized` do manifesto dos documentos e o `edicao_html_sha256` do manifesto dos registos, que têm de ser iguais entre si e ao declarado), o ficheiro do texto julgado nesta pasta com o seu resumo, quem julgou (`Codex gpt-6-astra, xhigh, três voltas`), a data do fecho (`2026-11-10`) e o commit do motor cujo portão prova o texto composto igual ao julgado. As 139 entradas do estudo em `por-registar.json` saem, porque as frases deixam de estar na página. Plantas: um byte diferente no resumo do documento deixa todas as frases do estudo sem cobertura; uma declaração sem quem julgou, sem data ou sem o ficheiro do texto recusa; uma frase com afirmação na página do estudo que não esteja no registo recusa; um estudo sem declaração fica como hoje.

8. **A voz.** A frase da unidade `C055` que a régua apanha fica como foi julgada, nas duas línguas: é o limite do que o estudo mede, na secção dos limites que a norma editorial pede. Entra em `scripts/voz-excecoes.json` por rota e texto, com uma classe nova na lista fechada das razões, «limite declarado do estudo», e a razão «O limite do que o estudo mede, na secção dos limites.». As exceções do texto antigo deste estudo que deixarem de ter frase saem. Os testes que procuram nas páginas do 16 frases de blocos anteriores (as listas aplicadas da VOZ-2A e do EV2) largam essas frases, com a razão: saíram com o texto julgado.

9. **A linha de 2021, no motor e no sítio** (por último, com os seus commits).
   - No motor: em `publisher/manifest.evora.json`, a entrada de `evora-execucao-da-receita-2021` passa a atravessar a linha `exec-total-2021-pct` do estudo 16, com o documento, a página, o excerto e o resumo que essa linha sela, o título do documento como o motor o prova, e `reference_date` 2021. A linha `exec-2021-pct` do 07 fica no seu livro. O exportador das linhas corre com `--site` e `--write`; fica só o que é desta linha (o ficheiro da linha, o recorte novo da página 60, a sua entrada em `ledger/cruzamentos/evora.json`); o que mais ele tocar volta ao que estava, e dizes o quê. As suites que tocares e o `core.gate` uma vez no fim; o registo do portão vai para esta pasta com o seu `.codigo`, sem caminhos da máquina (troca-os por `<pasta temporária>` antes de comitar).
   - No sítio: a linha passa a `87,72`, com a correção datada de `2026-11-11` na lista de correções da linha, na forma que a casa usa para uma correção (o valor antigo `96`, o novo `87,72`), e a razão:
     - pt: «O valor anterior, 96, é o do historial que o relatório das contas de 2025 recita na página 112. O Relatório de Gestão de 2021 imprime 87,72% para a execução da receita total (página 60, quadro 12), a medida da linha de 2025, e 95,61% para a receita corrente; a linha passa ao valor da receita total e a essa fonte.»
     - en: «The previous value, 96, is from the history that the report on the 2025 accounts recites on page 112. The 2021 Management Report prints 87.72% for the execution of total revenue (page 60, table 12), the measure of the 2025 row, and 95.61% for current revenue; the row now carries the total-revenue value and that source.»
   - Se a régua dos números recusar na razão um algarismo que não seja o valor antigo nem o novo, a razão passa a ser, sem mais mudança: «O valor anterior é o do historial que o relatório das contas de 2025 recita. O Relatório de Gestão de 2021 imprime outro valor para a execução da receita total, que é a medida da linha de 2025; a linha passa a esse valor e a essa fonte.» e «The previous value is from the history that the report on the 2025 accounts recites. The 2021 Management Report prints a different value for the execution of total revenue, which is the measure of the 2025 row; the row now carries that value and that source.», e dizes qual ficou.
   - A unidade e o nome da medida ficam. As frases de `src/data/municipios.mjs` e as medidas de `src/data/leituras.mjs` que leem a linha ficam como estão. Confere no HTML construído o que cada página imprime com a linha: a página da área, os dois recibos (o de 2021 e o de 2025, que a mostra como período anterior), os cartões e os índices.

## As listas fechadas que este bloco mexe

O manifesto dos registos e o dos documentos; `por-registar.json` (só encolhe); `voz-excecoes.json` e a lista das razões; o teto da L1 (desce); as testemunhas de `check:edicoes` e de `check:datas`; as contagens de `tests/rec1/construido.mjs`; o inventário das frases, se uma régua o ler; `leituras-provadas.json`, se a frase da leitura lá estiver. Uma lista que eu não nomeei e que mexa: diz qual, o que pedia e o que fizeste.

## O que fica como está, por decisão

- O texto julgado, nas duas línguas, e os seus números.
- Os outros estudos: os registos, os documentos e as páginas dos outros dezassete ficam byte a byte, salvo o campo `rh_manifest_sha256` do ponto 1.
- As correções das linhas, a história selada e as reconferências: nenhum dado se apaga.
- A página do registo das correções: em ensaio não mostra nada, e continua assim.

## A prova

O `build` da cabeça, e por nome: `check:registo`, `check:documentos`, `check:edicoes`, `check:datas`, `check:voz`, `check:frases-afirmacao`, `check:frases-reais`, `check:paridade`, `check:lingua`, `check:selos`, `check:lugar`, `check:largura`, `check:sobreposicao`, `ledger:check`, `check:cruzamento` (com o motor), `gate:html`, `typecheck`, e o que mais a mudança tocar. A lista inteira do `verify` corre-a o lugar de direção por guião depois da tua passagem: não a corras. Cada código lido de um ficheiro. No relatório, as frases dos pontos 4, 6 e 9 tal como o HTML construído as imprime, nas duas edições.

## Quando paras

Só nisto: o D5 não bate (os bytes do documento no sítio não são os que o motor prova); um número das páginas do estudo que o `gate:html` só deixe passar por uma isenção nova; a linha de 2021 sem o excerto, a página ou o resumo do documento do motor. Paras nesse ponto, dizes o que viste, e fazes os outros. Para tudo o resto: decide, anota e continua.

## O fim

Os nove pontos, cada um no seu commit (o assunto a começar por `EVA`), e o relatório: ponto a ponto o que ficou feito, cada planta e o que deu, as testemunhas novas, as listas que mexeram, as decisões pequenas que tomaste, os códigos. Se o tempo não chegar, a ordem é a dos números: os pontos 1 a 8 inteiros antes do 9.
