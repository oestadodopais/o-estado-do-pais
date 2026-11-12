#!/usr/bin/env python3
"""RET1 (12.11.2026): o que a retirada dos oito estudos que a auditoria condenou toca no sítio (adaptado de `rec2-2026-11-11/retirada-seis.py`; só mudam os estudos medidos).

Só lê. Para cada um dos oito slugs da lista abaixo:
  (a) as rotas que o `dist/` tem dele (ficheiros `index.html` debaixo de `/estudos/<slug>` e
      `/en/studies/<slug>`, por género), e os ficheiros do `dist/` fora das suas rotas com um `href`
      para ele (por género de rota), mais as frases visíveis dessas páginas que o nomeiam pelo título;
  (b) os ficheiros seguidos pelo git que nomeiam o slug (`git grep -c`), por pasta, e as linhas de
      `ledger/claims/` com `study:` igual ao slug.
Escreve o JSON de saída.

uso: python3 -B retirada-oito.py <sítio> <dist> <saída.json>
"""
import collections
import html as H
import json
import re
import subprocess
import sys
from pathlib import Path

sitio, dist, saida = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
OITO = {
    'evora-quem-governou-a-camara-2009-2025': ['Quem governou a Câmara de Évora, 2009 a 2025: as eleições, os executivos, os pelouros e as decisões'],
    'evora-economia-e-dinheiro-publico-de-fora-da-camara': ['A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara'],
    'agua-nao-faturada': ['Água Não Faturada'],
    'onde-esta-a-agua': ['Onde está a água?'],
    'avaliacao-economica-regional-de-portugal-2026': ['Avaliação Económica Regional de Portugal 2026'],
    'which-door-is-yours': ['Which Door Is Yours — public funding in Portugal, August 2026'],
    'alentejo-algarve': ['Alentejo & Algarve — Economy, Society, Strategy'],
    'evolucao-de-portugal-desde-1981': ['Evolução de Portugal desde 1981'],
}


def visivel(t):
    t = re.sub(r'<script\b.*?</script>|<style\b.*?</style>', ' ', t, flags=re.S | re.I)
    t = re.sub(r'<[^>]+>', ' ', t)
    return re.sub(r'\s+', ' ', H.unescape(t)).strip()


def genero(rel: str) -> str:
    partes = rel.split('/')
    if partes[0] == 'en':
        partes = partes[1:]
        lingua = 'en'
    else:
        lingua = 'pt'
    return f'{lingua}:{partes[0] if partes else ""}'


htmls = sorted(dist.rglob('*.html'))
textos = {p: p.read_text(encoding='utf-8', errors='replace') for p in htmls}
res = {}
for slug, titulos in OITO.items():
    proprias = [p for p in htmls if f'/estudos/{slug}/' in str(p) or f'/en/studies/{slug}/' in str(p)]
    por_genero = collections.Counter()
    for p in proprias:
        rel = str(p.relative_to(dist))
        resto = rel.split(slug + '/', 1)[1]
        g = 'página' if resto == 'index.html' else ('documento' if resto in ('documento/index.html', 'document/index.html') else
             ('edição datada do documento' if re.match(r'(documento|document)/\d{4}-\d{2}-\d{2}/index.html', resto) else resto))
        por_genero[('en ' if rel.startswith('en/') else 'pt ') + g] += 1
    href = re.compile(r'href="(?:https?://[^"/]+)?(/(?:en/studies|estudos)/' + re.escape(slug) + r'(?:/[^"#?]*)?)[^"]*"')
    fora = collections.Counter()
    fora_ex = collections.defaultdict(list)
    for p in htmls:
        if p in proprias:
            continue
        hs = href.findall(textos[p])
        if hs:
            rel = str(p.relative_to(dist))
            g = genero(rel)
            fora[g] += 1
            if len(fora_ex[g]) < 6:
                fora_ex[g].append(rel)
    # frases visíveis que o nomeiam pelo título, fora das suas páginas, nas páginas de estudo e de dossiê
    por_titulo = []
    for p in htmls:
        if p in proprias:
            continue
        rel = str(p.relative_to(dist))
        if not re.match(r'(en/)?(estudos|studies|dossies|dossiers|areas|metodo|method|correcoes|corrections|sobre|about|index)', rel):
            continue
        v = None
        for t in titulos:
            if t in textos[p]:
                v = v or visivel(textos[p])
                for m in re.finditer(re.escape(t), v):
                    por_titulo.append({'ficheiro': rel, 'titulo': t, 'contexto': v[max(0, m.start() - 140):m.end() + 60]})
    # o repositório
    g = subprocess.run(['git', '-C', str(sitio), 'grep', '-c', '-F', slug, '--', '.', ':!dist'], capture_output=True, text=True)
    if g.returncode not in (0, 1):
        raise SystemExit(f'git grep falhou: {g.stderr}')
    ficheiros = [l.rsplit(':', 1) for l in g.stdout.splitlines()]
    por_pasta = collections.Counter()
    for f, n in ficheiros:
        k = f.split('/')[0] if '/' in f else f
        if k in ('scripts', 'tests', 'src', 'design', 'ledger', 'studies-src', 'registos'):
            k = '/'.join(f.split('/')[:2])
        por_pasta[k] += 1
    claims = []
    for c in sorted((sitio / 'ledger/claims').glob('*.yml')):
        t = c.read_text(encoding='utf-8')
        if re.search(r'^study:\s*"' + re.escape(slug) + r'"', t, re.M):
            claims.append(c.stem)
    res[slug] = {'rotas_proprias': dict(por_genero), 'rotas_proprias_total': len(proprias),
                 'ficheiros_do_dist_com_ligacao': dict(fora), 'exemplos': dict(fora_ex),
                 'frases_que_o_nomeiam_pelo_titulo': por_titulo,
                 'ficheiros_do_git_que_o_nomeiam': len(ficheiros), 'por_pasta': dict(por_pasta.most_common()),
                 'lista_de_ficheiros': sorted(f for f, _ in ficheiros),
                 'linhas_do_livro_com_study_igual': claims}
    print(f"{slug}: rotas próprias {len(proprias)} {dict(por_genero)}; dist com ligação {sum(fora.values())} {dict(fora)}; "
          f"frases pelo título {len(por_titulo)}; ficheiros git {len(ficheiros)}; linhas do livro {len(claims)}")
saida.write_text(json.dumps(res, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
