"""Relatório V2-d a partir das medições e dos resultados inspecionados."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
def read(name):
    return json.loads((ROOT / name).read_text())

partida = read('partida.json')
final = read('frases-e-portas.json')
decisoes = read('decisoes.json')
results = read('resultados.json')
lines = ['# V2-d: análise da Saúde e das parcerias', '', '## Estado', '', results['estado'], '',
    '## Medida de partida e selagem', '',
    f"Conferência de {len(partida['rows'])} linhas, com {len(partida['divergencias_numericas'])} divergências numéricas. O guião lê o livro regenerado e compara os valores com os corpos e as componentes. `partida.json` conserva as linhas do PDF, os cabeçalhos, os seletores, as páginas, os recibos, as células e os valores brutos da folha da execução.", '',
    'A despesa efetiva de 2027 coincide com e sem PRR: 17 803,1 milhões de euros. A soma dos encargos brutos é 1 152 + 312 + 254 = 1 718. Nos seis pares de 2020 a 2025, a execução supera o orçamento inicial do mesmo ano. A quebra de perímetro entre anos não altera esta comparação interna.', '',
    'Foram seladas 56 linhas novas no motor: 36 documentais e 20 derivadas. As páginas dos riscos são 369 e 370 do PDF, 353 e 354 impressas. A coluna selecionada fica ligada ao cabeçalho, ao ano e à fase; a planta troca a coluna e o valor esperado e é recusada.', '',
    'O exportador comum atravessou 126 linhas e as provas de 142 linhas. Os corpos permanecem no motor; os excertos, os recibos, os resumos SHA-256 e as avaliações de direitos atravessam em `ledger/provas/v2d/provas.json`.', '',
    '## Integração', '',
    f"O inventário final contém {final['portas']['linhas_com_porta']} linhas com porta para os itens, das quais {final['portas']['linhas_novas_com_porta']} chegaram nesta travessia. As componentes das derivadas são acessíveis pelos respetivos recibos. Os seis pares anuais também integram a guarda da frase «todos os anos». Os títulos do topo e do menu vêm do mesmo resolvedor dos itens.", '',
    '## Conferências e capturas', '',
    '| Conferência | Código ou resultado |', '| --- | --- |']
for name, value in results['conferencias'].items():
    lines.append(f'| {name} | {value} |')
lines += ['', results.get('capturas', 'Capturas ainda não executadas.'), '',
    'Os registos extensos ficam fora do commit. Nenhum PNG é comitado. A corrida integral do sítio fica para o portão do GitHub na aterragem.', '',
    '## Decisões', '',
    'As decisões V2D-1 a V2D-6 ficaram documentadas na conferência do commit 3533f7a7. O §7 do mandato aceitou as correções da maior rubrica, da comparação das parcerias com 2025 e da designação «fora do PRR», e autorizou corrigir as restantes contradições. As redações efetivamente aplicadas e as decisões de integração seguem abaixo.', '']
for d in decisoes:
    lines += [f"### {d['id']}: {d['tema']}", '', f"Antes: {d['antes']}", '', f"Depois: {d['depois']}", '', d['razao'], '']
lines += ['## Valores lidos do livro selado', '', '| Identificador | Valor | Período |', '| --- | --- | --- |']
for row in partida['rows']:
    value = str(row['value']).replace('|', '\\|').replace('\n', ' ')
    lines.append(f"| {row['id']} | {value} | {row['period']} |")
for lang in ['pt', 'en']:
    lines += ['', f'## Frases renderizadas: {lang.upper()}', '']
    for item in final['edicoes'][lang]:
        lines += [f"### {item['titulo']}", '']
        for section in item['seccoes']:
            lines += [f"**{section['titulo']}**", '']
            for paragraph in section['paragrafos']:
                lines += [paragraph, '']
lines += ['## Reprodução', '',
    'Na raiz do sítio, passar `<motor>` ao guião `conferir-partida.py`, correr `medir-final.mjs` e depois `gerar-relatorio.py`, todos nesta pasta. No motor, `python3 -m publisher.v2d_export` prepara o manifesto e as provas; `python3 -m publisher.export_site_rows --manifest publisher/manifest.v2d.json --site <worktree> --write` atravessa pelo exportador comum.', '',
    'Os portões correm por `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> v2d`; as capturas usam `pedido-capturas.json` pelo guião do escrivão. `check:cruzamento --with-origin` recebe o motor em `RESEARCHHUB_DIR`. O motor inteiro corre pelo pre-commit do escrivão.', '']
(ROOT / 'LEIA-ME.md').write_text('\n'.join(lines))
print('Relatório regenerado a partir das medições.')
