"""Relatório V2-d-f a partir das frases resolvidas e dos resultados observados."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
read=lambda name:json.loads((ROOT/name).read_text())
final=read('frases-e-portas.json');decisoes=read('decisoes.json');results=read('resultados-v2df.json')
lines=['# V2-d: análise da Saúde e das parcerias','','## A quinta correção','',
'Esta passagem corrige apenas os Major 5, 6 e 8 da leitura curta V2-d-e. Os achados 1 a 4 e o 7 eram plantas. Os resultados das passagens anteriores permanecem nos respetivos ficheiros e no histórico Git.','',
f"Cabeça de código do sítio construída, testada e capturada: `{results['sitio_testado']}`. Motor aprovado pelo pre-commit: `{results['motor']}`. O commit posterior fecha o relatório e os recibos das verificações.",'',
'A comparação nas duas edições deixa de atribuir aos acordos o financiamento das entidades do SNS. A redação identifica os acordos entre a ACSS e as entidades do SNS, seguindo o pedido. A auditoria separa as duas frases fixas: a dotação tem como apoio a nota 26; a identificação dos acordos tem como apoio a página 303. A célula verifica cada associação e recusa a falta de qualquer dos dois apoios. As parcerias mantêm o texto anterior.','',
'A linha oe-2027-saude-contrato-programa-acss conserva agora as duas frases inteiras da página 303 do PDF, 287 impressa, confirmadas na camada textual do corpo alojado. O antecedente identifica as receitas de impostos de 15 452,2 milhões de euros. O motor e a exportação foram regenerados do corpo. O recibo regista a correção, com o texto anterior e o novo. O período continua a ser 2027 e a publicação permanece no campo próprio, 2026-10-08. A célula recusa a retirada do antecedente.','',
'### Códigos observados','','| Conferência | Código |','| --- | --- |']
for k,v in results['codigos'].items():lines.append(f'| {k} | {v} |')
lines+=['',results['conferencias'],'',results['capturas'],'',
'Os códigos e as últimas linhas dos registos estão em `portoes-v2df.json`. O manifesto das capturas está em `capturas-v2df.json`, e a inspeção em `inspecao-visual-v2df.json`. Os registos extensos e os PNG ficam na pasta temporária da corrida. O perfil V2-d foi executado; a corrida integral do sítio fica para o GitHub. Não foi feito push.','',
'### Decisões','']
for d in decisoes:
 if int(d['id'].split('-')[1])<47:continue
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
'No sítio, `scripts/compor-familias-v2d.mjs` e, nesta pasta, `auditar-palavras.mjs`, `medir-final.mjs`, `conferir-v2df.mjs` e `gerar-relatorio.py` reproduzem as declarações, as frases e o relatório. `check:cruzamento --with-origin` recebe o motor em `RESEARCHHUB_DIR`. Os comandos de saída extensa correm por `scripts/leituras/curto.sh`.','',
'Portões: `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> v2d`. Capturas: `sh scripts/leituras/capturar-pelo-escrivao.sh <pedido.json> <temporario>`, depois da construção, nas duas edições e cinco larguras.','']
(ROOT/'LEIA-ME.md').write_text('\n'.join(lines))
print('Relatório da quinta correção regenerado a partir das medições.')
