# Mandato EVB-T: o estudo de Évora 2027 atravessa para o sítio, numa edição só (11.11.2026)

Acrescenta: frases
Medidas: medidas-evb-t.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede. A worktree de arranque é a do sítio (ramo `evb-2026-11-11`); a outra pasta com escrita é a worktree do motor `evb-2026-11-11`, que está na cabeça do `master` (`71df7b3`). O texto do estudo está julgado e fechado: nada nele se muda aqui. É o mesmo trabalho que atravessou o estudo das contas da Câmara a 11.11.2026; lê primeiro `design/especime-v3/medicoes/eva-2026-11-10/MANDATO-EVA-T.md` e as suas três adendas, que dizem o que existe e o que se aprendeu. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas, contadas com as de qualquer sessão auxiliar; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVB`. O teu relatório vai para `RELATORIO-EVB-T.txt`, nesta pasta; as tuas medidas, para `medidas-do-construtor-evb-t.json`, nunca para o ficheiro das medidas deste mandato.*

## Porquê

O estudo 19 está no `master` do motor com o texto que outra família de modelos julgou contra as fontes, e o motor recusa um texto composto diferente do julgado. O sítio ainda mostra o texto de 6 de novembro, com os erros que a auditoria achou. Esta passagem põe no sítio o que o motor prova, como a edição de lançamento do estudo: uma edição só, sem a história das edições de ensaio.

## §0 O que se mediu

1. **O estudo no motor.** O `master` do motor está em `71df7b3`, com o estudo 19 instalado pelo texto julgado. Os registos têm 165 blocos e 332 referências em português, e 165 e 332 em inglês. O motor prova para o HTML os resumos `16cc2b69faaf6ba624fb6a3d91e3a057444d7bb5890e8f43d809550660147bbb` (pt) e `ddc1b895165dd56b24f33e34887a69807fa4360b148105d511f71aa0727de306` (en).
2. **A história das edições do estudo no sítio.** Em `studies-src/manifest.yml`, as versões por língua são `[4, 4]`, com `6` ficheiros do estudo em `studies-src/_edicoes/`. Em `src/data/correcoes.mjs`, `3` entradas do estudo. Era o único estudo publicado com quatro versões por língua; os outros com história têm duas.
3. **As frases com afirmação.** `ledger/frases/por-registar.json` tem 228 entradas deste estudo, e a lista só encolhe.
4. **A voz e os endereços.** `scripts/voz-excecoes.json` tem `4` linhas com este estudo; o `vercel.json`, `12`; e `1` estudo retirado tem este como sucessor.
5. **O texto julgado** tem 465 linhas com identificador em cada língua; o quadro das afirmações tem cinco linhas (as unidades `C033` a `C037`).

Outras medidas da mesma coisa: este bloco não traz número novo para o livro do sítio. Os números do estudo vivem no documento alojado, com o livro do próprio estudo no motor; o sítio prova os bytes do documento, não cada número.

## O que fazes

1. **Os registos do 19.** Na worktree do motor, limpa e em `71df7b3`, corre o exportador dos registos com `OEDP_SITE` na worktree do sítio e `--write` (sem `OEDP_SITE` o exportador cai na árvore principal do sítio: põe sempre a variável). Fica só o que é do 19: os dois registos, os dois cortes e as duas entradas do manifesto. O que o exportador tocar de outros estudos volta ao que estava, por guião, salvo o campo `rh_manifest_sha256` das entradas que só mudem nele, se o `check:registo` as aceitar assim; se não aceitar, diz o que a régua pede e escolhe a forma que conserve os bytes dos outros estudos.

2. **Os documentos, por guião.** Corre `design/especime-v3/medicoes/eva-2026-11-10/atravessar-documentos.py <motor> evora-2027-capital-europeia-da-cultura 2026-11-12`, que copia o HTML de cada língua, confere os resumos contra os que o motor prova e reescreve as duas entradas do manifesto. Cada entrada fica com uma versão só, sem `primeira_edicao` e sem `natureza`, com `origin_ref` no commit do motor que escreveu os bytes. Os seis ficheiros do estudo em `studies-src/_edicoes/` saem. O `check:documentos` (D5) tem de bater. Se o guião precisar de mudar para servir este estudo, muda-o no seu lugar, conservando o que faz ao 16, e diz o quê.

3. **A história do estudo recomeça.** Com uma versão só:
   - em `src/data/studies.mjs`, `date: '2026-11-12'` e `updated: null` nas duas edições; em `src/data/datas-de-publicacao.json`, a mesma data para as duas, pela origem `edicao-unica`;
   - o cabeçalho da página imprime só a data de publicação; nenhuma faixa de atualização nem de correção, nenhuma porta para uma edição guardada;
   - as rotas datadas do documento deste estudo deixam de existir; em `vercel.json`, cada uma leva ao documento corrente da sua língua;
   - as três entradas do estudo em `CORRECOES_TEXTO` passam para `CORRECOES_TEXTO_ENSAIO`, a lista que nenhuma página lê; a conta que a linha `correcoes-publicadas` conserva não muda, sem selo novo;
   - os testes e as réguas que usam este estudo como testemunha de uma história com várias versões passam para outro estudo publicado que ainda as tenha, e dizes qual. Este era o único estudo com quatro versões: um teste que precise de mais versões do que as que qualquer estudo publicado tem passa a correr sobre uma cópia fixa da história deste estudo, guardada com os testes, para a maquinaria das edições continuar provada até haver histórias outra vez. As contagens que `tests/rec1/construido.mjs` fixa atualizam-se pela medição;
   - o teto da L1 desce pela medição, com a razão escrita.

4. **O nome, a manchete e a pergunta.** O `<h1>` do documento é a manchete (a unidade `C001`), e o nome do estudo é a linha em itálico logo abaixo (`C002`). Em `studies.mjs`, o `title` das duas edições fica como está: é o nome, letra por letra o da `C002`, e a régua do nome (`scripts/nome-do-estudo.mjs`) confere-o. A página do estudo e o documento mostram a manchete como o registo a traz. A `pergunta` passa a ser a unidade `C003`, transcrita do documento, com as duas entradas de `src/data/verbatim.mjs` a apontar para ela; a `description` fica se continuar verdadeira contra o texto novo, e dizes se a régua a prende a alguma frase que saiu. A pergunta, nas duas línguas:

   - pt:

   «Évora 2027 tem o dinheiro, as obras e o programa que prometeu?»

   - en:

   «Does Évora 2027 have the money, the works and the programme it promised?»

5. **A página do estudo na forma nova.** O documento abre com a pergunta e a resposta e segue pela ordem do texto julgado. Confere no HTML construído das duas edições: as listas, os quadros (cada um a deslizar dentro da sua caixa nas larguras estreitas), o quadro das afirmações com as cinco linhas e o veredicto de cada uma, a adaga e a sua nota, o anexo e o rodapé. Nenhum título salta um nível (o `check:alvos` mede-o; este estudo entra na amostra desse teste neste bloco). A edição inglesa imprime os números na forma do texto julgado.

6. **A leitura do estudo** (`src/data/leituras.mjs`, a entrada deste estudo). Continua sem medidas: o estudo não tem linhas no livro do sítio. A `frase` passa a ser a primeira frase da secção da leitura do documento (a unidade `C039`), com os dois anos como referências de ano da casa (`{ ref: '2024' }` e `{ ref: '2025' }`), nunca algarismos escritos à mão, e com a palavra da casa para quem governa o concelho no lugar da palavra do documento, como a entrada de hoje já faz. As frases:

   - pt:

   «A parte da cultura está paga pelos tetos de ⟦2024⟧ e ⟦2025⟧; a da câmara está por confirmar, e parte do dinheiro europeu depende de candidaturas.»

   - en:

   «The culture share is paid up to the ⟦2024⟧ and ⟦2025⟧ ceilings; the council's is still to be confirmed, and part of the European money depends on applications.»

   Cada ⟦ano⟧ é a referência de ano; nada mais na frase é token. A `origem` passa a citar a unidade `C039` do documento composto nas duas línguas, com a linha do ficheiro medida por guião e o texto do documento como ele o escreve. O comentário da entrada diz a troca de palavra e a razão.

7. **As frases com afirmação.** O estudo ganha as duas declarações de texto julgado em `ledger/frases/textos-julgados.json`, uma por língua: o resumo do documento julgado, o ficheiro do texto julgado nesta pasta com o seu resumo, quem julgou (`Codex gpt-6-astra, xhigh, quatro voltas`), a data do fecho (`2026-11-11`) e o commit do motor cujo portão prova o texto composto igual ao julgado (`71df7b3`). As entradas deste estudo em `ledger/frases/por-registar.json` saem, porque as frases deixam de estar na página. A régua já tem as plantas desta via; corre-as.

8. **A voz.** As exceções deste estudo em `scripts/voz-excecoes.json` que deixarem de ter frase saem. Uma frase do texto julgado que a régua da voz apanhe fica como foi julgada, e entra nas exceções por rota e texto com uma razão da lista fechada. Se nenhuma razão da lista servir, não inventes uma: lista as frases e as razões que faltam, e decide o lugar de direção. Os testes que procuram nas páginas deste estudo frases de blocos anteriores largam essas frases, com a razão: saíram com o texto julgado.

9. **O estudo como sucessor.** O estudo retirado que tem este como sucessor (`sucedidoPor`) continua a levar aqui, nas duas línguas; confere os redirecionamentos no `vercel.json` e a régua dos retirados.

## As listas fechadas que este bloco mexe

O manifesto dos registos e o dos documentos; `por-registar.json` (só encolhe); `voz-excecoes.json`; o teto da L1 (desce); as testemunhas de `check:edicoes` e de `check:datas`; as contagens de `tests/rec1/construido.mjs`; a amostra do `check:alvos`; `leituras-provadas.json`, se a frase da leitura lá estiver. Uma lista que eu não nomeei e que mexa: diz qual, o que pedia e o que fizeste.

## O que fica como está, por decisão

- O texto julgado, nas duas línguas, e os seus números.
- Os outros estudos: os registos, os documentos e as páginas ficam byte a byte, salvo o campo `rh_manifest_sha256` do ponto 1.
- As correções das linhas, a história selada e as reconferências: nenhum dado se apaga.
- O campo `emCurso` do estudo: o acompanhamento vai até ao fim de 2027.

## A prova

O `build` da cabeça, e por nome: `check:registo`, `check:documentos`, `check:edicoes`, `check:datas`, `check:indice`, `check:voz`, `check:frases-afirmacao`, `check:frases-reais`, `check:paridade`, `check:lingua`, `check:selos`, `check:lugar`, `check:largura`, `check:sobreposicao`, `check:alvos`, `check:rec2`, `check:privacidade`, `ledger:check`, `check:cruzamento` (com o motor), `gate:html`, `typecheck`, e o que mais a mudança tocar. A lista inteira do `verify` corre-a o lugar de direção por guião depois da tua passagem: não a corras. Cada código lido de um ficheiro; nenhum registo com caminhos da máquina nem com a estrutura das pastas locais (troca-os antes de comitar). No relatório, as frases dos pontos 4 e 6 tal como o HTML construído as imprime, nas duas edições.

## Quando paras

Só nisto: o D5 não bate (os bytes do documento no sítio não são os que o motor prova); um número das páginas do estudo que o `gate:html` só deixe passar por uma isenção nova; a frase da leitura que só passe mudando o que diz. Paras nesse ponto, dizes o que viste, e fazes os outros. Para tudo o resto: decide, anota e continua.

## O fim

Os nove pontos, cada um no seu commit, e o relatório: ponto a ponto o que ficou feito, cada planta e o que deu, as testemunhas novas, as listas que mexeram, as decisões pequenas que tomaste, os códigos. Se o tempo não chegar, a ordem é a dos números.
