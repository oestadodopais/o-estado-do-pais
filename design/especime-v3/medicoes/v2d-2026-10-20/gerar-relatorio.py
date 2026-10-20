"""Relatório V2-d-e a partir das frases resolvidas e dos resultados observados."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
read=lambda name:json.loads((ROOT/name).read_text())
final=read('frases-e-portas.json');decisoes=read('decisoes.json');results=read('resultados-v2de.json')
lines=['# V2-d: análise da Saúde e das parcerias','','## A quarta correção','',
'Esta passagem corrige apenas os Major 6 e 7 da leitura curta V2-d-d. Os achados 1 a 5 eram plantas. Os resultados das passagens anteriores permanecem nos respetivos ficheiros e no histórico Git.','',
f"Cabeça de código do sítio construída, testada e capturada: `{results['sitio_testado']}`. Motor aprovado pelo pre-commit: `{results['motor']}`. O commit posterior fecha o relatório e os recibos das verificações.",'',
'A opinião nas duas edições distingue a variação de toda a rubrica das outras despesas correntes, 271,3 milhões, da dotação de reforço dos contratos-programa, cujo montante o relatório não diz. A comparação explica os contratos-programa nas palavras do sítio. As frases seguem o pedido palavra por palavra; as parcerias mantêm o texto anterior.','',
'A nova linha oe-2027-saude-contrato-programa-acss conserva a frase inteira da página 303 do PDF, 287 impressa, confirmada na camada textual e na imagem. A linha oe-2027-saude-dotacao-reforco-contratos-programa conserva a nota 26 inteira no recibo. Ambas estão exportadas, têm porta de integração e apoiam a auditoria das duas frases. A página deixa de transcrever a nota sobre a Defesa. O período continua a ser 2027 e a publicação permanece separada.','',
'### Códigos observados','','| Conferência | Código |','| --- | --- |']
for k,v in results['codigos'].items():lines.append(f'| {k} | {v} |')
lines+=['',results['conferencias'],'',results['capturas'],'',
'Os códigos e as últimas linhas dos registos estão em `portoes-v2de.json`. O manifesto das capturas está em `capturas-v2de.json`, e a inspeção em `inspecao-visual-v2de.json`. Os registos extensos e os PNG ficam na pasta temporária da corrida. O perfil V2-d foi executado; a corrida integral do sítio fica para o GitHub. Não foi feito push.','',
'### Decisões','']
for d in decisoes:
 if int(d['id'].split('-')[1])<45:continue
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
'No sítio, `scripts/compor-familias-v2d.mjs` e, nesta pasta, `auditar-palavras.mjs`, `medir-final.mjs`, `conferir-v2de.mjs` e `gerar-relatorio.py` reproduzem as declarações, as frases e o relatório. `check:cruzamento --with-origin` recebe o motor em `RESEARCHHUB_DIR`. Os comandos de saída extensa correm por `scripts/leituras/curto.sh`.','',
'Portões: `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> v2d`. Capturas: `sh scripts/leituras/capturar-pelo-escrivao.sh <pedido.json> <temporario>`, depois da construção, nas duas edições e cinco larguras.','']
(ROOT/'LEIA-ME.md').write_text('\n'.join(lines))
print('Relatório da quarta correção regenerado a partir das medições.')
