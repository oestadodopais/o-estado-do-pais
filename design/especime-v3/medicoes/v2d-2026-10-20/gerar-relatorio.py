"""Relatório V2-d-b a partir das linhas, frases, pesquisa e recibos inspecionados."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
read=lambda name:json.loads((ROOT/name).read_text())
partida=read('partida.json');final=read('frases-e-portas.json');decisoes=read('decisoes.json')
results=read('resultados-v2db.json');pesquisa=read('pesquisa-receitas-proprias-v2db.json')
lines=['# V2-d: análise da Saúde e das parcerias','','## A correção da leitura','',results['estado'],'',
'Os achados 1 a 5 da leitura a frio eram plantas nas cópias do pacote. Esta passagem corrige os cinco Major reais e os problemas de leitura delimitados no pedido V2-d-b. A execução anterior e os seus resultados permanecem no histórico Git e em `resultados.json`.','',
f"A conferência abrange {len(partida['rows'])} linhas, com {len(partida['divergencias_numericas'])} divergências numéricas. A travessia contém {results['linhas_exportadas']} linhas e {results['provas']} provas; {final['portas']['linhas_com_porta']} linhas têm porta nos itens, das quais {final['portas']['linhas_novas_com_porta']} pertencem à travessia V2-d. As restantes componentes são acessíveis pelos recibos das derivadas.",'',
'Os riscos referem o primeiro trimestre de 2026, com data de referência 31.03.2026. A reserva passa a ter a frase inteira do relatório, assim como as três citações da UTAO. As duas citações cujo valor textual mudou conservam o fragmento anterior no histórico de correções. As quatro percentagens novas têm a conta completa e arredondamento a uma casa decimal. As séries identificam os documentos pelas capas, em vez de rótulos editoriais.','',
'Os selos ficam depois das aspas e fora do título. As células conferem os valores, as citações, as atribuições, os recibos trimestrais, os títulos e os destinos dos selos. As famílias, as áreas, a auditoria das palavras e o inventário acompanham a nova redação.','',
'## Conferências e capturas','','| Conferência | Resultado |','| --- | --- |']
for k,v in results['conferencias'].items():lines.append(f'| {k} | {v} |')
lines+=['',results['capturas'],'','Os códigos dos portões são lidos dos ficheiros da corrida e conservados em `portoes-v2db.json`. A corrida integral do sítio fica para o GitHub. Os PNG e os registos extensos ficam fora do commit. Não foi feito push.','',
'## Pesquisa das receitas próprias','',
'Comando: `'+pesquisa['command']+'`. Pesquisa no texto integral por `receitas?\\s+próprias?`, sem distinção de maiúsculas, incluindo singular e plural e quebras de linha.','',
f"Foram pesquisadas {pesquisa['pages']} páginas e registadas {len(pesquisa['occurrences'])} ocorrências. {pesquisa['conclusion']}",'',
'A afirmação de ausência fica delimitada ao relatório alojado. A pesquisa e os contextos completos estão em `pesquisa-receitas-proprias-v2db.json`. As páginas abaixo são as do PDF.','','| Página PDF | Contexto da ocorrência |','| --- | --- |']
for o in pesquisa['occurrences']:lines.append(f"| {o['page']} | {o['context'].replace('|',' / ')} |")
lines+=['','## Decisões novas','']
for d in decisoes:
 if int(d['id'].split('-')[1])<27:continue
 lines += [f"### {d['id']}: {d['tema']}",'',f"Antes: {d['antes']}",'',f"Depois: {d['depois']}",'',d['razao'],'']
lines+=['As decisões V2D-7 a V2D-26 permanecem em `decisoes.json`; V2D-1 a V2D-6 estão documentadas na conferência do commit 3533f7a7.','','## Frases tal como renderizam','']
for lang in ['pt','en']:
 lines += [f'### Edição {lang.upper()}','']
 for item in final['edicoes'][lang]:
  lines += [f"**{item['titulo']}**",'']
  for sec in item['seccoes']:
   lines += [f"**{sec['titulo']}**",'']
   for par in sec['paragrafos']:lines += [par,'']
lines+=['## Reprodução','',
'No motor, `python3 -m publisher.oe2027_analise_report --assemble --report`, `python3 -m publisher.v2d_export` e `python3 -m publisher.export_site_rows --manifest publisher/manifest.v2d.json --site <worktree> --write`. O pre-commit do escrivão executa `core.gate`.','',
'No sítio, o compositor `scripts/compor-familias-v2d.mjs` e, nesta pasta, `conferir-partida.py <motor>`, `auditar-palavras.mjs`, `medir-final.mjs` e `gerar-relatorio.py` reproduzem as declarações e o relatório. `check:cruzamento --with-origin` recebe o motor em `RESEARCHHUB_DIR`.','',
'Portões: `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> v2d`. Capturas: `sh scripts/leituras/capturar-pelo-escrivao.sh <pedido.json> <temporario>`, depois da construção, nas duas edições e cinco larguras.','']
(ROOT/'LEIA-ME.md').write_text('\n'.join(lines))
print('Relatório da correção regenerado a partir das medições.')
