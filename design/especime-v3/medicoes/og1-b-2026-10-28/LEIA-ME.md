# OG1-B: as aberturas e o Orçamento depois do voto, com paragem lexical

A retoma resolveu a falta das famílias, mas ficou interrompida pelo portão da voz: a expressão «resting on», na opinião inglesa do §4.10, é recusada. O §2.C do mandato manda parar quando uma régua recusa uma palavra. A redação não foi alterada e não foi criada uma exceção.

O marcador está em `design/especime-v3/VOZ-MARCADORES.md`. A exceção contextual existente, da OG1-A9, cobre «resting on assumptions that Parliament&#39;s own technical unit calls into question», não a frase nova «resting on three assumptions the UTAO calls into question». O lugar de direção tem de decidir a redação ou a exceção contextual. Esta é a questão OG1-B-q4.

## O que mudou e o que foi construído

Os três itens têm duas frases de abertura. A primeira página usa a primeira frase dessa abertura, conserva a data de publicação e ordena os itens pela reescrita, com desempate pela publicação. As definições da Saúde e das parcerias têm os recibos pedidos junto da abertura. O item do Orçamento inclui a aprovação na generalidade, as cinco posições novas, o Conselho das Finanças Públicas e os juros, com as seis secções conservadas.

O commit `71aced123` entregou ao escrivão os dados, a vista, o bloco inicial, a régua do FP2, as plantas preparadas, o gerador da auditoria, a contagem da travessia e as vinte e quatro famílias da adenda. São 57 nomes e 57 famílias; a cobertura passou. As correções posteriores das réguas, a auditoria das famílias e as listas fechadas permanecem na árvore de trabalho, sem commit. O commit final desta retoma entrega o relatório e os diagnósticos, não declara a implementação concluída.

A segunda tentativa de construção gerou o HTML com o carimbo `71aced123d3b917af8c1d036a0d0f2dc4406e87d`, mas terminou vermelha no portão de HTML. Havia alterações de trabalho durante esta construção. O carimbo identifica a base, não prova uma árvore limpa nem uma construção final aceite. As alterações posteriores da colocação dos selos nas glosas ainda não foram construídas.

## Confronto das frases

`frases-construidas.json` contém 46 entradas do HTML, com rota, edição, item, caminho e texto: os títulos e parágrafos novos ou mudados dos itens e as seis frases da primeira página. Todas coincidiram com a transcrição do mandato, substituindo os tokens pelos campos do livro.

`extrair-frases-construidas.mjs` faz a extração e o confronto; `mandato-frases.json` contém a transcrição usada como referência independente dos dados da aplicação. O resultado comprova as palavras desse HTML, não substitui os portões que ficaram vermelhos. `frases-resolvidas.json` e o seu guião conservam o diagnóstico anterior, sem HTML, da primeira passagem.

## Conferências da retoma

A lista completa, com os códigos lidos dos ficheiros e os registos correspondentes, está em `conferencias-retoma.json`. Foram 22 execuções de verificação nesta retoma; as cadeias internas de cada comando não são contadas de novo.

| Conferência | Código | Resultado |
| --- | ---: | --- |
| Cobertura das famílias | 0 | 57 famílias declaradas. |
| Plantas das glosas | 0 | Nove controlos e 60 plantas recusadas. |
| Declarações dos itens, primeira tentativa | 1 | O gerador tinha perdido os apoios dos anos intermédios da Saúde. |
| Gerador da auditoria | 0 | 751 folhas geradas e conferidas. |
| Declarações dos itens, segunda tentativa | 0 | Apoios contextuais conservados. |
| `build`, primeira tentativa | 1 | A régua OG1 não aceitava o caminho já selado do relatório nem a página na ligação do CFP. |
| `ledger:check` | 0 | Depois da adaptação: 72 plantas, nenhum erro. |
| `build`, segunda tentativa | 1 | HTML gerado; as marcas dos números nas glosas ainda eram recusadas pelo portão. |
| Prova dos perfis | 0 | Perfil fechado para as duas conferências que usam navegador; sem `verify`. |
| Confronto das frases | 0 | 46 entradas iguais ao mandato nas duas edições. |
| `typecheck` | 0 | Antes das últimas alterações de forma das glosas. |
| `check:rotulos` | 0 | 57 recibos e 57 entradas por edição; 69 plantas. |
| `gate:html` | 0 | Depois de conferir os fragmentos pelo parágrafo e pela edição declarados. |
| `check:discussao` | 1 | Unidades depois do selo em glosas e cinco plantas sem mordida. Correções preparadas, ainda sem nova construção. |
| `check:voz` | 1 | Inclui a recusa lexical que obriga à paragem; também encontrou auditorias de famílias e contagens do inventário por atualizar. |
| `check:palavras` | 0 | A lista das palavras proibidas passou; é diferente do marcador contextual da voz. |
| `check:lingua` | 1 | Unidade e declarações de língua das fontes novas em falta. |
| `check:registo` | 0 | Passou. |
| `check:cruzamento` | 0 | Linhas e ficheiros iguais aos exportados. |
| Gerador com prova da contagem | 0 | A prova numérica específica dos médicos foi conservada. |
| Planta da contagem adulterada | 1 | Vermelho esperado: a contagem adulterada foi recusada. |
| Auditoria das famílias | 0 | As frases da adenda ligadas aos excertos das próprias linhas. |

Não se repetiu a corrida inteira dos portões: nenhuma foi executada. Também não correram `verify`, `conferir-tudo.sh`, `check:frases-compostas` ou `check:primeira`. As duas últimas ficaram preparadas no perfil fechado `og1-b-navegador`, mas esse perfil não foi pedido ao escrivão.

## Plantas e alterações de forma

- As nove glosas conservam os números completos do fragmento, na mesma ordem e fonte. As 60 plantas trocam valor, fonte, campo, número, duplicação ou ordem e cortam números; todas foram recusadas. `plantas-glosas.json` guarda os resultados. A proteção dos números não foi dispensada.
- A régua das fontes aceita o caminho exato do relatório já alojado e exige a página declarada na ligação do CFP. Foram acrescentadas plantas para página trocada, ficheiro trocado e travessia de caminho. `ledger:check` passou.
- O portão de HTML passou a conferir cada fragmento no parágrafo e na edição declarados, incluindo os números das glosas. A conferência isolada passou. As plantas adicionadas ao teste OG1 para trecho e parágrafo trocados ainda não correram até ao fim, pois `check:discussao` parou antes desse segundo guião.
- Na primeira página, as plantas de data, duas frases, frase de outro item, valor e parágrafo em falta foram executadas contra o HTML. A saída global mediu 761 de 766 plantas com mordida. As cinco falhas eram a prova da contagem e as plantas de citação nos dois idiomas, que estavam a atingir o fragmento novo da abertura em vez de «Como foi dito». A seleção foi corrigida, mas falta repetir a conferência após a nova construção.
- A colocação da unidade antes do selo nas glosas foi preparada no resolvedor. Não se alteraram as palavras; falta construir e verificar essa forma.

## Listas fechadas

O inventário tem 30 linhas novas de parágrafos e 12 linhas reescritas: dez dos títulos e secções alterados e duas das portas que incluem o título do Orçamento. O rasto `og1-b` está «por ler», com a razão pedida. Faltam atualizar as duas linhas de contagem do livro: o HTML mediu 4 138 linhas, enquanto o inventário ainda declara 4 114. A atualização não foi feita depois da paragem lexical.

As 24 famílias foram também acrescentadas à auditoria `tests/cartao/leituras-provadas.json`, com a frase exata da adenda e o excerto da própria linha. Essa auditoria passou e não exigiu prosa adicional. A mudança está por comitar.

## Decisões e questões

- **OG1-B-1:** sai a data de generalidade não usada; entra a votação final global em `apenasDatas`. Aceite pela adenda.
- **OG1-B-2:** conservam-se os nomes e atributos FP2, com comentário; a prova aponta para `abertura[0]`. Aceite pela adenda.
- **OG1-B-3:** aberturas e recibos fornecidos pelo ajudante `item()`. Aceite pela adenda.
- **OG1-B-4:** os derivados usam os excertos das linhas de origem; as folhas intactas conservam os apoios contextuais e a prova específica da contagem. Sem excertos inventados.
- **OG1-B-5:** glosas numéricas apoiadas nos fragmentos. As plantas específicas morderam; a colocação das unidades e selos ainda precisa da construção final.
- **OG1-B-6:** reconhecer no portão OG1 o caminho exato do relatório já selado e a página exata do CFP; conservar as comparações de ficheiro, hash, data, valor e fonte.
- **OG1-B-7:** perfil fechado `og1-b-navegador`, apenas com `check:frases-compostas` e `check:primeira`, provado com comandos sintéticos. Não foi executado no sítio.
- **OG1-B-q1:** resolvida pela adenda: as 24 famílias estão declaradas e a cobertura passa.
- **OG1-B-q2:** aberta: concluir a verificação da forma das glosas e das plantas de citação, atualizar as contagens do inventário, construir uma cabeça limpa e repetir as conferências afetadas.
- **OG1-B-q3:** aberta: navegador e capturas. Não há capturas nem manifesto desta passagem; ficaram por fazer devido à paragem, não por esgotamento do orçamento.
- **OG1-B-q4:** bloqueio atual: decidir a expressão «resting on» no §4.10 ou uma exceção contextual expressamente autorizada. Nenhuma palavra foi trocada.
- **OG1-B-q5:** o portão da língua mediu 37 problemas. Falta a unidade «p.p. do PIB» no dicionário, a língua dos quatro títulos documentais novos e do organismo «CFP», e a declaração neutra da edição «2026-10-28». Os localizadores dependem dessas declarações. O registo completo está em `check-lingua.log`; nenhum campo do livro foi editado.

## Entrega e custo

A primeira passagem terminou com 23 chamadas e quinze execuções de verificação. Esta retoma tinha 32 chamadas concluídas antes da escrita deste recibo e 22 execuções de verificação. A escrita, o pedido de commit e a inspeção final são posteriores a essa contagem. O custo é escrito pelo lançador; não foi exposta uma linha «tokens used».

O relatório anterior, com a paragem das famílias, permanece no histórico `d443ffd42`. Os códigos e diagnósticos antigos foram conservados como histórico, não como estado atual. O registo público das correções não mudou. Nenhuma alteração à identidade, à navegação, ao Método, aos estudos ou ao motor. Leitura a frio por fazer.

Sem push.
