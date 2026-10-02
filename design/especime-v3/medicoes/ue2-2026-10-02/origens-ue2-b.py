#!/usr/bin/env python3
"""UE2-b: as duas origens novas das definições, conferidas contra os ficheiros que o motor selou.

As duas origens (`eurostat-tipslc10-privacao` e `eurostat-sec2010-ocde`, em `src/data/figuras.mjs`) são recortes
novos de ficheiros que o motor já tinha pedido e selado: a resposta do Eurostat ao pedido `tipslc10` (o bloco L1,
24.09.2026) e o PDF do SEC 2010 com a sua extração (o L1, 26.09.2026). Este guião lê as declarações do sítio
(pelo Node, a partir do módulo das figuras), abre cada ficheiro no motor, confere o sha256 do selo (e, no PDF, o
da extração), lê o campo pela regra escrita aqui, e exige que o excerto declarado esteja lá, carácter a carácter:
no campo JSON tal como a resposta o traz, e na extração com as quebras de linha lidas como espaços (é a forma das
origens irmãs do mesmo ficheiro, recortadas pelo `origens-l1.py`).

O CONHECIDO-POSITIVO corre primeiro: o excerto já declarado da origem irmã de cada ficheiro (`eurostat-tipslc10-
descricao` e `eurostat-sec2010-registo-liquido`) tem de ser encontrado pelo mesmo detetor, e uma cadeia que não está
no ficheiro tem de não ser.

Uso, da raiz da worktree:  python3 design/especime-v3/medicoes/ue2-2026-10-02/origens-ue2-b.py <raiz do motor>
Escreve `origens-ue2-b.json` nesta pasta, sem o caminho do motor. Sai 0 quando tudo bate; 1 com o que não bate.
"""
import hashlib
import json
import pathlib
import re
import subprocess
import sys

PASTA = pathlib.Path('design/especime-v3/medicoes/ue2-2026-10-02')
if len(sys.argv) != 2:
    raise SystemExit('uso: origens-ue2-b.py <raiz do motor>')
MOTOR = pathlib.Path(sys.argv[1])

js = "import('./src/data/figuras.mjs').then(m => process.stdout.write(JSON.stringify(m.ORIGENS_DAS_DEFINICOES)))"
ORIGENS = json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)

NOVAS = ['eurostat-tipslc10-privacao', 'eurostat-sec2010-ocde']
IRMAS = {'eurostat-tipslc10-privacao': 'eurostat-tipslc10-descricao', 'eurostat-sec2010-ocde': 'eurostat-sec2010-registo-liquido'}


def sha(caminho):
    return hashlib.sha256((MOTOR / caminho).read_bytes()).hexdigest()


def texto_do_campo(origem):
    """O texto onde o excerto tem de estar, pela regra de cada ficheiro."""
    selo = origem['selo']
    if 'extracao' in selo:
        t = (MOTOR / selo['extracao']['ficheiro']).read_text(encoding='utf-8')
        return re.sub(r'\s+', ' ', t)
    d = json.loads((MOTOR / selo['motor']).read_text(encoding='utf-8'))
    if selo['campo'] != 'extension.description':
        raise SystemExit(f"campo por ler: {selo['campo']}")
    return d['extension']['description']


erros = []
registo = []
for chave in NOVAS:
    o = ORIGENS.get(chave)
    if not o:
        erros.append(f'{chave}: não está declarada')
        continue
    s = o['selo']
    irma = ORIGENS[IRMAS[chave]]
    linha = {'origem': chave, 'irma': IRMAS[chave], 'ficheiro': s['motor'], 'campo': s['campo']}
    # O selo é o mesmo pedido da origem irmã: o mesmo ficheiro, a mesma hora, o mesmo cliente e o mesmo sha256.
    for k in ['motor', 'hora', 'cliente', 'sha256']:
        if s[k] != irma['selo'][k]:
            erros.append(f'{chave}: o selo diz {k}={s[k]!r} e a origem irmã diz {irma["selo"][k]!r}')
    medido = sha(s['motor'])
    linha['sha256_medido'] = medido
    if medido != s['sha256']:
        erros.append(f'{chave}: o sha256 do ficheiro é {medido} e o selo diz {s["sha256"]}')
    if 'extracao' in s:
        medido_x = sha(s['extracao']['ficheiro'])
        linha['sha256_da_extracao_medido'] = medido_x
        if medido_x != s['extracao']['sha256']:
            erros.append(f'{chave}: o sha256 da extração é {medido_x} e o selo diz {s["extracao"]["sha256"]}')
    texto = texto_do_campo(o)
    # O conhecido-positivo: o excerto da irmã está no mesmo campo, e uma cadeia inventada não está.
    positivo = irma['excerto'] in texto
    negativo = 'at least nine out of thirteen deprivation items' in texto or 'Organisation for Economic Development and Cooperation (OECD)' in texto
    linha['conhecido_positivo_encontrado'] = positivo
    linha['cadeia_inventada_encontrada'] = negativo
    if not positivo or negativo:
        erros.append(f'{chave}: o detetor não passou no conhecido-positivo (irmã {positivo}, inventada {negativo})')
    linha['excerto_no_campo'] = o['excerto'] in texto
    if not linha['excerto_no_campo']:
        erros.append(f'{chave}: o excerto declarado não está no campo')
    registo.append(linha)

saida = {'bloco': 'UE2-b', 'guiao': str(PASTA / 'origens-ue2-b.py'), 'origens': registo, 'erros': erros}
(PASTA / 'origens-ue2-b.json').write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
for e in erros:
    print(f'  {e}')
print(f'UE2-b: {len(registo)} origens conferidas contra os ficheiros do motor, {len(erros)} erro(s).')
raise SystemExit(1 if erros else 0)
