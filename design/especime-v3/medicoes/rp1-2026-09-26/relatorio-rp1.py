#!/usr/bin/env python3
"""Conserva a primeira entrega e escreve ou confere a secção RP1b."""
import json
import subprocess
import sys
from pathlib import Path
AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[3]
BASE='5c92e5ea'
m=json.loads((AQUI/'medidas.json').read_text())['rp1b']
ac=json.loads((AQUI/'acertos-rp1.json').read_text())
antigo=subprocess.check_output(['git','show',BASE+':design/especime-v3/medicoes/rp1-2026-09-26/LEIA-ME.md'],cwd=RAIZ,text=True)
def n(v):return f'{v:,}'.replace(',',' ')
def cel(v):return str(v).replace('|','\\|').replace('\n',' ')
linhas=['## RP1b','',
 f'Entrega concluída: {m["seladas"]} medidas novas seladas, {m["total_do_bloco"]} cartões do bloco nos temas e {m["linhas_novas"]} linhas novas (`rp1b.seladas`, `rp1b.total_do_bloco`, `rp1b.linhas_novas`). As {n(m["linhas_anteriores"])} linhas que já existiam foram comparadas byte a byte: {m["linhas_anteriores_alteradas"]} alteradas (`rp1b.linhas_anteriores`, `rp1b.linhas_anteriores_alteradas`).', '',
 'A secção anterior é o relato histórico da primeira entrega. Os seus dados e portões mantêm-se; as cópias em `paginas-depois/` são agora as desta peça. As cópias anteriores continuam no histórico da cabeça indicada naquela secção. O antes e as capturas da primeira entrega não foram repetidos.', '',
 '| Item do mandato | Resultado e medida |','|---|---|',
 f'| Pedidos e linhas | {m["pedidos_novos"]} pedidos novos pelo cliente do projeto; {m["corpos_conferidos"]} corpos do conjunto conferidos contra o registo e o alojamento (`rp1b.pedidos_novos`, `rp1b.corpos_conferidos`). O `core.gate` terminou a {m["motor_portao"]["codigo"]}, lido de `motor-rp1b.codigo`. |',
 f'| Réguas declaradas | {m["plantas"]["reguas"]} réguas no bloco (`rp1b.plantas.reguas`). O IHPC tem Portugal no mês anterior e a União no mesmo mês, sem cartão autónomo para a linha europeia. |',
 f'| Medidas e perguntas | As medidas novas estão nos temas pedidos. K16: {m["k16"]["erros"]} erros (`rp1b.k16.erros`). A regra de `temasDoPais()` permanece igual. |',
 f'| Leituras | {m["frases_resolvidas"]} frases resolvidas (`rp1b.frases_resolvidas`), iguais à segunda redação fora de {m["acertos"]["acertos"]} trocas auditadas (`rp1b.acertos.acertos`). K17: {m["k17"]["erros"]} erros nas palavras e {m["leituras_rendidas"]["erros"]} no HTML (`rp1b.k17.erros`, `rp1b.leituras_rendidas.erros`). |',
 '| I153 | O espaço faz parte do texto da bandeira no valor e na leitura. As plantas colam a bandeira à unidade e são recusadas. A caixa em linha conserva a margem visual existente. |',
 '| Mapa | Circuito reposto e conferido por `conferir-mapa.py`; saída em `mapa-rp1b.log`. |',
 f'| Capturas, relatório e provas | {m["capturas"]["paginas"]} capturas de página e {m["capturas"]["recortes"]} recortes, com {m["capturas"]["falhas"]} falhas (`rp1b.capturas`). Cópias congeladas e resumos conferidos por `medir-rp1.mjs`. |', '',
 '### As medidas e as fontes', '',
 '| Medida | Valor | Unidade | Período | Mês anterior | União no mesmo mês |','|---|---|---|---|---|---|']
for x in m['medidas']:
 linhas.append(f'| `{x["id"]}` | {x["valor"]} | {x["unidade"]} | `{x["periodo"]}` | {x["anterior"]["valor"]} ({x["anterior"]["periodo"]}) | '+(f'{x["ue"]["valor"]} ({x["ue"]["periodo"]})' if x['ue'] else 'Não declarada')+' |')
linhas+=['','Os valores, períodos, unidades e comparadores desta tabela são `rp1b.medidas`. O INE confirmou as categorias, a frequência mensal, «Percentagem (%)» e a escala zero. No IHPC, a resposta confirma `RCH_A`, `coicop18=TOTAL`, as geografias e o último mês publicado. A unidade percentual está descrita em `extension.description`; o excerto mantém «Annual rate of change», como a resposta o escreve. A publicação vem de `updated`.','',
 '| Pedido | Hora UTC | Cliente | Sha256 |','|---|---|---|---|']
for p in m['pedidos']:
 linhas.append(f'| [`{p["file"]}`]({p["url"]}) | `{p["timestamp_utc"]}` | `{p["cliente"]}` | `{p["sha256"]}` |')
linhas+=['',
 'Os corpos estão em `content/13 Dominios/source/rp1/` no motor, registados em `FETCH.json` e `MANIFEST.sha256`. As perguntas e as leituras citam a página `minfo.jsp` do INE, a ficha `prc_hicp_esms` e os campos publicados nas respostas. `origens-rp1.py` confere o excerto literal e o selo de cada origem, sem apresentar uma cópia de teste como resposta autêntica.', '',
 '### Os acertos que restaram', '',
 'A única decisão de acerto foi explicitar os lubrificantes, que pertencem à categoria publicada. A troca repete-se nos ramos do sinal e nas duas edições. As médias dos últimos doze meses e as frases curtas da linha de pobreza são as da segunda redação, com as folhas da auditoria atualizadas.', '',
 '| Medida e edição | Antes | Depois | Literal |','|---|---|---|---|']
for a in ac['acertos']:
 linhas.append(f'| `{a["id"]}` · {a["lang"]} · `{a["caminho"][2]}` | {cel(a["antes"])} | {cel(a["depois"])} | «{cel(a["apoios"][0]["literal"])}» (`propria.excerpt`) |')
linhas+=['','### Células, plantas e limites da conferência','',
 '| Célula | Forma nova e proteção conservada |','|---|---|',
 '| Réguas e portão de HTML | A declaração da União exige a mesma série, unidade e mês; o portão recompõe a associação sem chamar o resolvedor. As plantas recusam outro mês, série, unidade e a troca pela linha portuguesa anterior. |',
 '| K17 e voz | O resolvedor e a recomposição independente incluem o espaço. A K17 confere a bandeira no valor e na leitura, a palavra da edição e a igualdade dos conjuntos de linhas. A planta mostrou que o `check:voz` só a chamava na primeira página; passou a chamá-la também nos temas e a recusar ali a bandeira colada. |',
 '| M8 | Esta célula vive em `tests/inicio/areas.mjs`, não em `check:voz`. Exige agora o texto com espaço inicial e mantém a igualdade entre as linhas com ressalva e as bandeiras reconhecidas. A associação passa a reconhecer também o valor imediatamente anterior à bandeira na régua, que já era rendida mas não era contada. A medição está em `m8-rp1b.json`, e as plantas que colam ou retiram a bandeira estão em `plantas-m8-rp1b.json`. |',
 '| Áreas | A A6 continua a excluir as observações anteriores; as classes do IPC e o IHPC entram na exclusão declarada dos preços, e a União na exclusão dos agregados. Nenhuma matéria ministerial foi inventada. |',
 '| Motor, associações europeias | O teste antigo admitia uma só nota europeia. Exige agora exatamente os agregados declarados e recusa a nota numa linha de Portugal. A tentativa recusada está em `motor-rp1b-tentativa-1.log`; o commit entrou apenas depois do portão verde. |',
 '| Portas repetidas | A catraca continua a ser uma contagem de páginas. A composição admite apenas os recibos novos e recusa qualquer página anterior agravada. |', '',
 f'As {len(m["plantas"]["plantas"])} plantas de `plantas-rp1.json` e as {len(m["plantas_portoes"])} plantas integrais de `plantas-portoes-rp1b.json` foram recusadas com a mordida esperada (`rp1b.plantas`, `rp1b.plantas_portoes`). As plantas integrais repõem os bytes e conferem o sha256.', '',
 f'A catraca mede {m["catraca_l1"]["contagens"]["estudos"]} páginas (`rp1b.catraca_l1.contagens.estudos`), contra {m["catraca_l1"]["contagens"]["antes"]} na prova congelada de referência, com {m["catraca_l1"]["contagens"]["paginas_antigas_agravadas"]} páginas anteriores agravadas. Esta comparação conserva a base histórica do B2; não chama a essa base o antes desta peça.', '',
 'A primeira chamada ao exportador foi feita sem o manifesto do estudo e selecionou o estudo de Évora. As diferenças de comentários e do seu registo foram repostas byte a byte antes da travessia correta, com `--manifest publisher/manifest.dominios.json`. A comparação de todas as linhas anteriores no medidor confirma a reposição. Nenhum desses ficheiros entrou num commit desta peça.', '',
 '### Capturas e cabeças', '',
 f'Na I153, o navegador mediu {m["i153"]["ressalvas_medidas"]} ressalvas nos recortes da remuneração. O espaço inicial ocupa no máximo {m["i153"]["espaco_visual_max_px"]} px (`rp1b.i153`): separa o texto acessível sem alargar a margem visual.', '',
 'As capturas têm prefixo `rp1b-` e cobrem as larguras '+', '.join(n(v) for v in m['capturas']['larguras'])+' px, nas duas edições, no país e nos temas. Os recortes cobrem cada medida nova e a remuneração em todas essas larguras. `capturas-rp1b-depois.json` contém as dimensões, o texto e os resumos; `inspecao-visual-rp1b.json` identifica as imagens abertas para inspeção.', '',
 f'As cópias congeladas incluem {m["congeladas"]["html"]} páginas HTML e {m["congeladas"]["css"]} folhas de estilo (`rp1b.congeladas`), presas por sha256 em `paginas-depois/INDICE.json`. Cabeça do código e das capturas: `{m["cabeca_do_codigo"]}`. Cabeça do motor: `{m["cabeca_motor"]}`. O último commit entrega as provas sem mudar o código medido.', '',
 *['- Projeto: `'+c+'`.' for c in m['commits_sitio']],
 *['- Motor: `'+c+'`.' for c in m['commits_motor']], '',
 '| Portão | Código lido do ficheiro | Cabeça medida |','|---|---|---|']
for nome,p in m['portoes'].items():linhas.append(f'| `{nome}` | {p["codigo"]}, de `portoes/rp1b/{nome}.codigo` | `{p["cabeca"]}` |')
linhas+=['','Os comandos completos correram separadamente, uma vez nesta cabeça. As conferências de preparação estão em `portoes/rp1b/preparacao/`. Os portões da primeira entrega ficaram intactos.', '',
 '### Custo e trabalho pendente', '',
 f'A janela entre o primeiro pedido desta peça e o último portão durou {n(m["custo"]["segundos_da_janela"])} segundos (`rp1b.custo.segundos_da_janela`); não inclui a leitura inicial.', '']
c=m['custo']['sessao']
linhas+=[f'No registo `{c["registo"]}`, lido às `{c["hora"]}`, o modelo exposto é `{c["modelo"]}`: {n(c["input_tokens"])} tokens de entrada, {n(c["cached_input_tokens"])} em cache e {n(c["output_tokens"])} de saída (`rp1b.custo.sessao`). São contagens cumulativas, não um preço. O custo monetário não está exposto.', '',
 'Não ficaram medidas desta peça por construir. A variação real da remuneração foi retirada pelo §8 e continua fora. A leitura do país, a regra da primeira página e o rótulo de IA não foram alterados. Não houve `push` nem publicação. A leitura a frio e a aterragem pertencem ao lugar de direção.', '']
esperado=antigo.rstrip()+'\n\n'+'\n'.join(linhas)
if '--verifica' in sys.argv:
 assert (AQUI/'LEIA-ME.md').read_text()==esperado,'A secção RP1b não coincide com as medições e os acertos'
 print('Relatório RP1b: secção conferida contra as medições e os literais.')
else:
 (AQUI/'LEIA-ME.md').write_text(esperado)
 print('Relatório RP1b: secção escrita a partir das medições.')
