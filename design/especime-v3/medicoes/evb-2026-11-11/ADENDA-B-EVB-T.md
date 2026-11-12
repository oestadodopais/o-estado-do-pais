# Adenda B do EVB-T: a régua do texto da página e a frase do cartão (12.11.2026)

Acrescenta: frases

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `evb-2026-11-11`, sobre a cabeça que tem esta adenda; a outra pasta com escrita é a worktree do motor `evb-2026-11-11`, onde não tens nada a mudar. Uma correção: trinta minutos e sessenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVB`. O teu relatório vai para `RELATORIO-EVB-T-B.txt`, nesta pasta, com dez linhas; as tuas medidas, para `medidas-do-construtor-evb-t-b.json`. Não corras o `build` nem as conferências que precisam do navegador: a sandbox recusa-os, e este lugar corre-os a seguir.*

## Porquê

O Claude Opus 5.5 leu a travessia a frio e apanhou as cinco plantas. Duas delas mudavam uma palavra numa página construída do estudo, e a régua da página não as via: diz que confere o texto do registo julgado, e compara a manchete, a pergunta, as contagens e a última coluna de um quadro. E a frase do cartão do estudo, sozinha na página de entrada, não se percebe sem contexto.

## §0 O que se mediu

1. `tests/evb/pagina.mjs` não compara o texto dos blocos. O leitor comparou-os por si: os blocos da página do estudo e os do registo são os mesmos, pela mesma ordem, nas duas línguas, fora as duas plantas.
2. Este lugar correu o `build` e quinze conferências sobre a cabeça `6a37212a7`, fora da sandbox: dezasseis passos, todos com código zero, o `build` e o `check:leituras` incluídos. O resumo está em `conferir-dirigidas-evb-t-a/`, nesta pasta.
3. A frase do cartão imprime-se na página de entrada, na lista dos estudos e na página do concelho, nas duas línguas.

## O que fazes

1. **O texto de cada bloco, em todos os estudos com texto julgado.** Uma régua compara, bloco a bloco, o texto de cada bloco da página construída de um estudo com o texto do mesmo bloco do registo, nas duas línguas, para cada estudo com declaração em `ledger/frases/textos-julgados.json` (hoje, o das contas da Câmara e este). Compara o texto inteiro: os parágrafos, os títulos, os itens de lista e cada célula de cada quadro. A normalização é só a que a apresentação obriga (o espaço, os carateres invisíveis, o que os selos acrescentam), e fica escrita na régua. Plantas, sobre uma cópia da página: uma palavra trocada num parágrafo recusa; uma palavra trocada numa célula que não seja a última da linha recusa; um número trocado recusa; um bloco fora de ordem recusa. Entra na cadeia do `check:registo` ou na que couber, e dizes qual. O relatório não diz que comparou o que não comparou.

2. **A frase do cartão.** A leitura do estudo em `src/data/leituras.mjs` passa a ser a unidade `C005` do texto julgado, que diz por inteiro quem escreve e o que está em causa. Sem medidas, sem troca de palavras, com o ano como referência de ano da casa. As frases:

   - pt:

   «A associação escreve que reabriu em ⟦2025⟧ o diálogo com a Câmara para obter o dinheiro de que precisa para honrar os compromissos com entidades artísticas, culturais, educativas e sociais.»

   - en:

   «The association writes that in ⟦2025⟧ it reopened dialogue with the Câmara to obtain the money it needs to honour its commitments to artistic, cultural, educational and social bodies.»

   O ⟦ano⟧ é a referência de ano; nada mais é token. A `origem` cita a unidade `C005` nas duas línguas, com a linha do ficheiro medida por guião. A lista fechada das trocas fica, sem uso neste estudo. As provas e as plantas da leitura e das cópias julgadas passam para esta unidade; o inventário das frases reconcilia-se como fizeste na travessia.

3. **A prova.** As conferências que não precisam do navegador nem do `build`: as da leitura e das cópias, `check:frases-afirmacao` se correr sobre o `dist/` que existe, a régua nova sobre o `dist/` que existe, `check:lugar` e o `typecheck`. Cada código lido de um ficheiro, em `evb-t-b-conferencias`. Diz o que ficou por correr.

## O que fica como está, por decisão

O texto julgado e os outros estudos. Os achados menores da leitura a frio ficam para o bloco de higiene, e não lhes toques: as duas frases de limite que estão na secção das fontes; as duas proteções que saíram com a história do estudo; a planta da porta das datas; a manchete portuguesa sem a unidade repetida.

## Quando paras

Se a régua nova achar uma diferença verdadeira entre a página e o registo, em qualquer dos dois estudos: não a escondas na normalização. Pára, diz o bloco e as duas versões.

## O fim

O relatório em dez linhas: os dois pontos, as plantas, os códigos, o que ficou por correr.
