"""Relatório V2-d-d a partir das frases resolvidas e dos resultados observados."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
read=lambda name:json.loads((ROOT/name).read_text())
final=read('frases-e-portas.json');decisoes=read('decisoes.json');results=read('resultados-v2dd.json')
lines=['# V2-d: análise da Saúde e das parcerias','','## A terceira correção','',
'Esta passagem corrige apenas os Major 5 e 7 da leitura curta V2-d-c. Os achados 1 a 4 e 6 eram plantas. Os resultados anteriores permanecem nos ficheiros das passagens anteriores e no histórico Git.','',
f"Cabeça de código do sítio construída, testada e capturada: `{results['sitio_testado']}`. Motor aprovado pelo pre-commit: `{results['motor']}`. O commit posterior fecha o relatório e os recibos das verificações.",'',
'A página 88 do PDF, 72 impressa, foi conferida no corpo alojado e na imagem renderizada. A linha oe-2027-outras-despesas-dotacoes-execucao conserva a frase inteira do corpo, incluindo o marcador de chamada 26. A linha oe-2027-saude-dotacao-reforco-contratos-programa conserva as duas frases completas da nota 26. A derivada der-saude-outras-correntes-variacao-abs subtrai 32,4 a 303,7 e dá 271,3 milhões de euros.','',
'As duas edições recebem as frases pedidas na comparação e na opinião da Saúde. A oração antiga indicada no pedido já não estava na cabeça recebida; a oração presente, que aumenta as outras despesas correntes, foi substituída pela formulação pedida sobre contratos-programa ainda por fechar. As parcerias conservam as frases da passagem anterior.','',
'As linhas oe-2027-outras-despesas-correntes-reserva e oe-2027-saude-acao-reserva-orcamental permanecem no motor e saem do sítio. A primeira tentativa de exportação recusou a sua omissão sem retirada explícita; o manifesto passou a registá-las em retired com razão escrita, e a exportação seguinte passou.','',
'O validador do livro e a conferência da fonte também exigiam a igualdade indevida entre período e publicação; ambos foram corrigidos e receberam plantas que adulteram esses campos. O template LinhaView.astro chama continuacaoDoNomeV2a, em src/lib/v2a-palavras.mjs. O token periodo é resolvido a partir de reference_date, agora 2027 nas linhas textuais do relatório exportadas. A data de publicação permanece em published_at, 2026-10-08, e aparece separadamente na ficha. Os cabeçalhos dos dois recibos novos foram conferidos no HTML nas duas edições; as plantas trocam o ano pela data para provar a recusa.','',
'### Códigos observados','','| Conferência | Código |','| --- | --- |']
for k,v in results['codigos'].items():lines.append(f'| {k} | {v} |')
lines+=['',results['conferencias'],'',results['capturas'],'',
'Os códigos e as últimas linhas dos registos estão em `portoes-v2dd.json`. O manifesto das capturas está em `capturas-v2dd.json`, e a inspeção em `inspecao-visual-v2dd.json`. Os registos extensos e os PNG ficam na pasta temporária da corrida. O perfil V2-d foi executado; a corrida integral do sítio fica para o GitHub. Não foi feito push.','',
'### Decisões','']
for d in decisoes:
 if int(d['id'].split('-')[1])<43:continue
 lines += [f"**{d['id']}: {d['tema']}**",'',f"Antes: {d['antes']}",'',f"Depois: {d['depois']}",'',d['razao'],'']
lines+=['### Frases tal como renderizam','']
for lang in ['pt','en']:
 lines += [f'#### Edição {lang.upper()}','']
 for item in final['edicoes'][lang]:
  lines += [f"**{item['titulo']}**",'']
  for sec in item['seccoes']:
   lines += [f"**{sec['titulo']}**",'']
   for par in sec['paragrafos']:lines += [par,'']
lines+=['## Reprodução','',
'No motor, `python3 -m publisher.oe2027_analise_report --assemble --report`, `python3 -m publisher.v2d_export` e `python3 -m publisher.export_site_rows --manifest publisher/manifest.v2d.json --site <worktree> --write`. As células correm por `python3 -m publisher.oe2027_analise_test --write-proof`; o pre-commit do escrivão executa `core.gate`.','',
'No sítio, `scripts/compor-familias-v2d.mjs` e, nesta pasta, `auditar-palavras.mjs`, `medir-final.mjs`, `conferir-v2dd.mjs` e `gerar-relatorio.py` reproduzem as declarações, as frases e o relatório. `check:cruzamento --with-origin` recebe o motor em `RESEARCHHUB_DIR`. Os comandos de saída extensa correm por `scripts/leituras/curto.sh`.','',
'Portões: `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> v2d`. Capturas: `sh scripts/leituras/capturar-pelo-escrivao.sh <pedido.json> <temporario>`, depois da construção, nas duas edições e cinco larguras.','']
(ROOT/'LEIA-ME.md').write_text('\n'.join(lines))
print('Relatório da terceira correção regenerado a partir das medições.')
