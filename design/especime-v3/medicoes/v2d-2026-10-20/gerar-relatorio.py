"""Relatório V2-d-c a partir das frases resolvidas e dos resultados observados."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
read=lambda name:json.loads((ROOT/name).read_text())
final=read('frases-e-portas.json');decisoes=read('decisoes.json');results=read('resultados-v2dc.json')
lines=['# V2-d: análise da Saúde e das parcerias','','## A segunda correção','',
'Esta passagem corrige os Major 6 a 9 da leitura curta V2-d-b. Os achados 1 a 5 eram plantas; o achado 10 pertence ao pacote. As restantes observações ficam fora deste mandato. Os resultados da passagem anterior permanecem em `resultados-v2db.json` e no histórico Git.','',
f"Cabeça de código do sítio construída, testada e capturada: `{results['sitio_testado']}`. Motor aprovado pelo pre-commit: `{results['motor']}`. O commit posterior fecha o relatório e os recibos das verificações.",'',
'A frase das reservas passa a referir expressamente o conjunto das administrações públicas. A nova linha textual da Saúde transcreve «Reserva orçamental» do quadro 5.36, Ação 4.3, página 296 do PDF. A opinião deixa de atribuir a subida da rubrica às reservas. O recibo da explicação geral também identifica o seu âmbito.','',
'A comparação das parcerias e os recibos dizem receitas. O parágrafo sobre a revisão da previsão conserva receitas de portagem: a página 125 do PDF atribui o acréscimo dos encargos à cobrança de portagens e à remuneração por serviço ligada ao tráfego, e descreve um decréscimo das receitas de portagem. A página 119 do relatório de 2026 foi inspecionada visualmente: a primeira coluna traz 1 234 de encargos brutos e 392 de receitas. Os nomes e excertos são regenerados com palavras inteiras, confirmadas pela extração raw do mesmo corpo.','',
'A recomendação passa a identificar a síntese mensal da execução orçamental da Entidade Orçamental. As cinco linhas dgo-* já tinham essa entidade, nomes de rubrica sem DGO e origem em eo.gov.pt; os identificadores foram conservados.','',
'Não foi encontrada contradição numérica nas frases pedidas. A correção adicional da opinião, necessária para retirar a mesma causalidade indevida, fica registada em V2D-38.','',
'### Códigos observados','','| Conferência | Código |','| --- | --- |']
for k,v in results['codigos'].items():lines.append(f'| {k} | {v} |')
lines+=['',results['conferencias'],'',results['capturas'],'',
'Os códigos e as últimas linhas dos registos estão em `portoes-v2dc.json`. O manifesto das capturas está em `capturas-v2dc.json`, e a inspeção em `inspecao-visual-v2dc.json`. Os registos extensos e os PNG ficam na pasta temporária da corrida. O perfil V2-d foi executado; a corrida integral do sítio fica para o GitHub. Não foi feito push.','',
'### Decisões','']
for d in decisoes:
 if int(d['id'].split('-')[1])<38:continue
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
'No sítio, `scripts/compor-familias-v2d.mjs` e, nesta pasta, `auditar-palavras.mjs`, `medir-final.mjs` e `gerar-relatorio.py` reproduzem as declarações, as frases e o relatório. `check:cruzamento --with-origin` recebe o motor em `RESEARCHHUB_DIR`. Os comandos de saída extensa correm por `scripts/leituras/curto.sh`.','',
'Portões: `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> v2d`. Capturas: `sh scripts/leituras/capturar-pelo-escrivao.sh <pedido.json> <temporario>`, depois da construção, nas duas edições e cinco larguras.','']
(ROOT/'LEIA-ME.md').write_text('\n'.join(lines))
print('Relatório da segunda correção regenerado a partir das medições.')
