#!/usr/bin/env python3
"""Compõe o relatório apenas a partir das medições guardadas e do histórico Git."""
import json
import subprocess
from pathlib import Path

B = Path(__file__).resolve().parent
R = B.parents[3]
m = json.loads((B/'medidas.json').read_text())
assert m['falhas_total'] == 0 and m['faltas_total'] == 0, 'Aceitação exige medições completas e verdes'
def n(v): return str(v).replace('.', ',')
def k(s): return '`' + s + '`'
a=m['antes']; d=m['depois']; t=d['paginas']['temas_pt']; c=m['capturas']['depois']; q=m['camaras']['depois']; motor=m['motor']
head=d['cabeca']; base=a['cabeca']; qa=m.get('qa_recibo')
commits=subprocess.check_output(['git','log','--reverse','--format=%h %s',f'{base}..{head}'],cwd=R,text=True).splitlines()
unidades=sorted({u for p in d['paginas'].values() for u in p['unidades_com_euro']})
portoes='\n'.join(f"| {x} | {m['portoes'][x]['codigo']} | `portoes.{x}.codigo`, lido de `portoes/{x}.codigo` |" for x in ('build','verify','typecheck'))
text=f'''# O veredicto: relatório da peça 1

**Estado: aceite pelo construtor; leitura a frio por fazer.** A passagem de correção executa as decisões do lugar de direção sobre a associação europeia e a hierarquia do título. A aceitação assenta nos portões e nas plantas desta passagem.

A medição regista {m['falhas_total']} falhas (`falhas_total`) e {m['faltas_total']} entradas obrigatórias por completar no medidor (`faltas_total`). As plantas antes bloqueadas foram executadas sobre o portão inteiro, com base limpa e reposição conferida.

## Cabeças e reprodução

O sítio partiu de `{base}`, sobre `main`. O HTML do depois e os portões atuais pertencem a `{head}` (`depois.cabeca`, `portoes`). As capturas do antes são da cabeça de partida, e não da cabeça anterior usada pelo brief. As cópias próprias e os respetivos resumos estão em `paginas-antes-peca1/` e `paginas-depois-peca1/`. As cópias congeladas em `paginas/` e o guião do brief não foram alterados.

O motor partiu de `aa35e2e72f09988a07d6706fe0a0b59feeca120d` e ficou em `{motor['cabeca']}`, na sua worktree própria sobre `master`. O diff está em `motor/diff.patch`. Não houve publicação nem envio para um remoto.

`python3 design/especime-v3/medicoes/b2-2026-09-23/medir.py` escreve `medidas.json`. `recolher-motor.py` recompõe a prova em `motor/medidas-motor.json`. Salvo indicação de outro ficheiro, os nomes de medição citados neste relatório pertencem a `medidas.json`. As provas finais são escritas depois do último commit para que os portões meçam literalmente a cabeça final. O relatório, as capturas e os logs finais ficam atualizados no disco, por incluir num eventual commit de entrega.

## Mandato e medida

| Item | Resultado e prova |
| --- | --- |
| Veredicto do país | A frase aparece antes da leitura existente, sem a reescrever, nas duas edições. As contagens, os nomes, a ordem e as portas são conferidos por V1; os textos completos estão em `depois.paginas.pais_pt.veredicto_do_pais` e `depois.paginas.pais_en.veredicto_do_pais`. |
| Estado em palavras | Os temas têm {t['cartoes_com_valor_de_referencia']} cartões com referência (`depois.paginas.temas_pt.cartoes_com_valor_de_referencia`) e {t['cores_sem_palavra']} casos de cor sem palavra (`depois.paginas.temas_pt.cores_sem_palavra`); a faixa europeia também tem {d['paginas']['europeia_pt']['faixa_cores_sem_palavra']} (`depois.paginas.europeia_pt.faixa_cores_sem_palavra`). As formas de dentro e fora, singular e plural, estão declaradas. A forma de fora de uma banda não ocorre nos valores publicados. Foi exercida nas plantas dos leitores das medições, em memória, mas não na rendição real do componente. |
| Valor, unidade e fonte | Há {t['cartoes_com_a_marca_entre_o_valor_e_a_unidade']} marcas entre valor e unidade nos temas, pelo predicado original do brief (`depois.paginas.temas_pt.cartoes_com_a_marca_entre_o_valor_e_a_unidade`), e {c['unidades_separadas_a_390']} unidades separadas do valor a 390 px (`capturas.depois.unidades_separadas_a_390`, `capturas.depois.larguras`). As plantas isoladas e a planta do portão de HTML inteiro passaram (`plantas`, `plantas_desbloqueadas`). |
| Perguntas | Os temas têm {t['cartoes_com_definicao']} definições e {t['definicoes_com_pergunta']} perguntas (`depois.paginas.temas_pt.cartoes_com_definicao`, `depois.paginas.temas_pt.definicoes_com_pergunta`), incluindo a medida nova dos inquilinos. Nas instâncias fotografadas há {c['perguntas_antes_da_regua']} perguntas antes da régua (`capturas.depois.perguntas_antes_da_regua`); as {c['perguntas_com_regua']} instâncias com régua têm a régua maior do que a pergunta (`capturas.depois.perguntas_com_regua`, `capturas.depois.reguas_maiores_que_pergunta`). As medidas sem definição continuam sem frase. |
| Réguas nacionais | Saldo, despesa líquida e disparidade salarial ganham o período anterior publicado; saldo e despesa usam a tabela única das referências. Restam {t['cartoes_sem_regua']} cartões sem régua (`depois.paginas.temas_pt.cartoes_sem_regua`, `.cartoes_sem_regua_lista`), pelas razões de fonte descritas abaixo. |
| Câmaras | A recontagem independente dá {q['camaras_acima_do_limite']} acima, {q['camaras_dentro_do_limite']} dentro e {q['camaras_sem_valor']} sem valor publicado (`camaras.depois.camaras_acima_do_limite`, `.camaras_dentro_do_limite`, `.camaras_sem_valor`). O cartão da contagem está presente e o do limite saiu das páginas do país e dos temas (`depois.paginas.temas_pt.cartao_das_camaras`, `.cartao_do_limite_legal`, `depois.paginas.pais_pt.cartao_do_limite_legal`). As plantas da contagem, da apresentação e do portão de HTML inteiro passaram (`plantas`, `plantas_desbloqueadas`). |
| Habitação | O tema abre com os inquilinos a preço de mercado e o total vem a seguir (`depois.paginas.temas_pt.habitacao_ordem`, `depois.paginas.pais_pt.habitacao_ordem`). O total continua sem a média europeia, conferido por K14. As linhas estão seladas e a associação do agregado europeu está provada pelo motor; a comparação passa no portão de HTML sem mudar a regra (`correcao`, `portoes.build.codigo`). |
| Hierarquia dos títulos | Fechado. Os {c['titulos_interiores_maiores']} casos interiores têm o título maior do que a marca (`capturas.depois.titulos_interiores_maiores`, `capturas.depois.paginas_interiores`). Só a página europeia passou à regra dos títulos dos temas. A planta do tamanho anterior morde (`hierarquia`). |
| Dinheiro | Há {t['cartoes_com_simbolo_euro']} cartões com o símbolo nos temas (`depois.paginas.temas_pt.cartoes_com_simbolo_euro`); os outros conjuntos medidos estão em `depois.paginas`, na mesma chave. As leituras alteradas recebem a unidade de `unidadeDaLinha()`. Os valores mantêm a precisão da linha. O texto servido dos estudos e as citações verbatim não foram reescritos. |
| Capturas, relatório e portões | Estão guardadas {m['capturas_total']} capturas do mandato (`capturas_total`), com {c['transbordos']} transbordos no depois (`capturas.depois.transbordos`). Os portões e a aceitação das capturas passaram (`portoes`, `capturas.depois.aceitacao`). O pacote inclui as cópias congeladas por `PACOTE_EXTRA`; a leitura a frio ainda não foi realizada. |

As frases lidas da construção são:

- `depois.paginas.pais_pt.veredicto_do_pais`: «{d['paginas']['pais_pt']['veredicto_do_pais'][0]}»
- `depois.paginas.pais_en.veredicto_do_pais`: «{d['paginas']['pais_en']['veredicto_do_pais'][0]}»

## Linhas, períodos anteriores e unidades

O sítio conserva os valores das {m['linhas']['antes']} linhas anteriores, acrescenta {m['linhas']['novas_n']} e não altera nenhum valor: {m['linhas']['valores_alterados']} (`linhas.antes`, `linhas.novas_n`, `linhas.valores_alterados`). Não há linhas retiradas (`linhas.retiradas`). O motor conserva o conteúdo das {motor['linhas']['antes']} linhas anteriores e acrescenta {motor['linhas']['novas_total']}, com {motor['linhas']['alteradas']} alterações às anteriores (`motor.linhas.antes`, `motor.linhas.novas_total`, `motor.linhas.alteradas`).

| Medida nacional | O que a fonte alojada permite |
| --- | --- |
| Saldo das administrações públicas | Período anterior da resposta do Eurostat, exportado como linha nova, e referência do Pacto. |
| Crescimento da despesa líquida | Período anterior do gráfico anual do Conselho das Finanças Públicas, exportado como linha nova, e referência do Conselho. O leitor confere título, anos, legenda e posição da série; o gráfico foi também inspecionado visualmente. |
| Disparidade salarial entre sexos | Período anterior da resposta alojada do Eurostat, exportado como linha nova. |
| Ganho médio mensal | Sem período anterior: o ficheiro do INE alojado só publica o período da linha existente (`motor.reguas_ausentes.ganho-medio-mensal-2024`). |
| Retribuição mínima mensal garantida | Sem período anterior: o preâmbulo do diploma menciona um compromisso, mas não aloja a norma que fixou o valor legal anterior (`motor.reguas_ausentes.retribuicao-minima-mensal-garantida-continente-2026`). Um compromisso não prova o valor aplicado. |

As respostas da habitação conservam os bytes dos pedidos originais. Endereço, hora, cliente, dimensão e resumo são conferidos contra `pedidos.jsonl` e o manifesto. O título é o publicado pelo Eurostat e o excerto inclui literalmente `Tenure status: Tenant, rent at market price` (`caso_portao_ue`).

As unidades monetárias lidas dos cartões medidos são {', '.join('«'+u+'»' for u in unidades)} (`depois.paginas`, chave `unidades_com_euro` de cada página). Não foi uniformizado o número de casas decimais. A ausência do símbolo nos temas já existia na cabeça de partida; não se atribui ao bloco uma redução nesse conjunto.

## Células, estragos e limites da prova

`auditaSelo()` conserva uma marca da própria linha junto do valor. O invólucro novo só é aceite com valor e unidade juntos e com a marca única depois do grupo, no pai imediato; quando há período, este também precede a marca. Um invólucro defeituoso não cai na regra antiga. A K10 conserva uma marca por cartão. As plantas isoladas retiram, trocam, duplicam e afastam a marca.

K6 compara a pergunta integral com a declaração; K7 conserva o estado e a cor; K9 confere as referências com uma segunda testemunha, incluindo a nota selada do saldo e o excerto do Conselho; K13 conserva os qualificadores; K14 mantém a retirada da média europeia do total; K15 exige palavra, direção e cor, também na faixa. A amarra do Método não mudou.

A pergunta nova dos inquilinos e as suas origens ficam no recibo principal. A célula das definições confere a pergunta e cada campo das origens. As plantas retiram a origem do regime em cada edição e exigem a deteção da falta. Os estilos da ligação e da seta acompanham agora o componente, incluindo o recibo novo. O ensaio do recibo abriu {qa['origens_abertas']} origens em {qa['paginas']} páginas e terminou com código {qa['codigo']} (`qa_recibo.origens_abertas`, `qa_recibo.paginas`, `qa_recibo.codigo`); as capturas mostram as dobras fechadas e abertas, com fontes carregadas, ligação sublinhada e seta a rodar (`qa_recibo.resultados`).

V1 recompõe a frase do país, as contagens, a seleção, a ordem e as portas. V2 recompõe a contagem e a régua das câmaras sobre os índices e o limite. O portão de HTML tem ainda uma implementação própria da contagem.

A L1 só reconhece os nós obrigatórios depois de V1 e V2 provarem os blocos inteiros. Ligações extras continuam contadas. A composição independente final conta {m['l1']['final']['contagens']['estudos']} páginas, com {m['l1']['final']['contagens']['recibos_de_linhas_novas']} entradas exclusivamente de recibos novos e {m['l1']['final']['contagens']['paginas_antigas_agravadas']} páginas antigas agravadas (`l1.final.contagens.estudos`, `.recibos_de_linhas_novas`, `.paginas_antigas_agravadas`). A exigência de ausência de horizonte mantém-se no `check:lugar`. As plantas repetem portas, alteram destinos e acrescentam ligações dentro e fora dos blocos.

Há {m['plantas_total']} ensaios de estragos medidos nos índices do sítio e {m['plantas_morderam']} mordidas (`plantas_total`, `plantas_morderam`). São execuções, não uma promessa de defeitos distintos. As plantas do motor detetaram {motor['plantas_vistas']} de {motor['plantas_total']} estragos, com {motor['provas']} provas positivas e {motor['problemas']} problemas (`motor.plantas_vistas`, `motor.plantas_total`, `motor.provas`, `motor.problemas`). O `core.gate` passou no pre-commit; o comando de commit terminou com código {motor['pre_commit_codigo']} (`motor.core_gate_passou`, `motor.pre_commit_codigo`). Esse código pertence ao comando de commit, não a uma invocação separada do portão.

## A passagem de correção

O lugar de direção confirmou que a regra do `gate:html` protege a associação entre a medida e a fonte e fica intacta. O erro estava na declaração gerada da linha europeia. `publisher/dominios_readers.py` devolve o quadro e as coordenadas efetivamente lidos; `publisher/dominios_build.py` compara quadro, regime, unidade e período, exige Portugal e União como geografias e exige a medida principal no mesmo livro. Só depois escreve a declaração inicial em `note_extra` do manifesto, pelo caminho já existente do exportador. A nota anterior fica inteira a seguir. O valor, a unidade, o período, o endereço, o título e o excerto não mudaram (`correcao.campos_inalterados`).

`publisher/dominios_b2_test.py`, chamado pela régua do estudo e pelo `core.gate`, planta uma divergência de cada dimensão e exige a razão específica. As {m['correcao']['plantas_associacao']} plantas mordem e o controlo positivo passa (`correcao.plantas_associacao`, `correcao.controlo_positivo`). O commit do motor é `{motor['cabeca']}`. A reexportação só altera a nota da linha europeia e o registo obrigatório da sua travessia (`correcao.ficheiros_ledger`). O `ledger:check` terminou com código {m['correcao']['ledger_codigo']} (`correcao.ledger_codigo`).

O lugar de direção corrigiu a premissa geral da hierarquia: temas e Mourão já cumpriam pela regra compacta da marca. `UniaoEuropeiaView.astro` passa o título europeu à classe `temas-titulo`, sem alterar a marca. O captor conserva a célula que exige marca menor do que título em cada página interior do mandato. `tests/inicio/hierarquia-b2.mjs` aplica o tamanho europeu anterior no navegador, verifica as mordidas nas edições e larguras medidas, retira a planta e exige a medida limpa original (`hierarquia`). O brief ficou intocado.

`desbloquear-plantas.py` exige HTML limpo antes e depois de correr `b2-contagens-das-camaras` e `b2-selo-do-cartao`. `plantas-bloqueadas.json` regista agora as execuções e as mordidas; o diagnóstico anterior está em `correcao/plantas-bloqueadas.json` (`plantas_desbloqueadas`). Os commits do sítio desta passagem constam de `correcao.commits_sitio` e da lista abaixo.

Só as imagens europeias foram refeitas. As restantes conservam a cabeça original de cada imagem; o captor voltou a medir as páginas e exigiu igualdade com as medidas anteriores antes de as reutilizar (`capturas.depois`, `correcao.capturas_refeitas`). As cópias HTML foram relidas da construção desta passagem. As medições históricas que explicaram a paragem continuam em `correcao/`.

## Portões, diagnósticos e tempo

Os códigos foram lidos de ficheiros recém-escritos; o executor apaga cada `.codigo` antes da corrida.

| Portão | Código | Medição e ficheiro |
| --- | --- | --- |
{portoes}

As tentativas anteriores estão nas pastas `portoes-*`. A primeira revelou declarações de tipos incorretas; foram corrigidas. A conferência posterior das folhas revelou dependências de estilo ausentes no recibo novo; foram corrigidas sem alterar a regra. Uma tentativa de acessibilidade não chegou a correr porque o ambiente recusou o servidor local; a repetição usa a permissão técnica apropriada. Os resultados estreitos e os seus logs vivem em `checks_de_trabalho`, com as cabeças e os códigos guardados nos ficheiros próprios.

O captor inicial confundiu o singular «valor» com uma palavra ausente. A expressão foi corrigida nos dois leitores e exercitada por plantas positivas e negativas. A corrida inicial permanece em `capturas-diagnostico-regex/`; `correcao-captor.json` mostra que se retiraram falsos alarmes, conservando as falhas reais. As imagens e as cópias dessa repetição coincidiram por SHA.

Os portões atuais consumiram {n(m['portoes_segundos'])} segundos (`portoes_segundos`). As tentativas integrais concluídas consumiram {n(m['portoes_tentativas']['segundos_documentados'])} segundos, sem duplicar cópias arquivadas (`portoes_tentativas.segundos_documentados`). A janela documentada, do início das capturas de partida ao fim do último ensaio incluído no medidor, é de {n(m['tempo_documentado']['janela_segundos'])} segundos (`tempo_documentado.janela_segundos`). Não é o tempo total desde o pedido: o início global não foi registado e esse total não pôde ser estabelecido, [verify].

## Commits e leitura a frio

Os commits até à cabeça medida são:

{chr(10).join('- `'+x.split(' ',1)[0]+'` '+x.split(' ',1)[1] for x in commits)}

O pacote é montado por `scripts/leituras/pacote.sh`, com `PACOTE_EXTRA` a incluir `paginas/` e o JSON congelado do brief. Leva também o diff do motor, os guiões, as medições, as cópias próprias e as páginas construídas. Não foi enviado a ninguém. Ficam por fazer a leitura a frio e a aterragem pelo lugar de direção. Nenhum push foi executado.
'''
(B/'LEIA-ME-peca1.md').write_text(text)
