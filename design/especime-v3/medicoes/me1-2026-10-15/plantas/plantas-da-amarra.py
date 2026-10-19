#!/usr/bin/env python3
"""As plantas da amarra das decisões depois do ME1 (`scripts/check-ledger.mjs`), que lê ficheiros seguidos e não o `dist/`.

`cadeiasDoTexto('metodo')` passou a percorrer o módulo inteiro de `src/data/metodo.mjs`, e, pela decisão do lugar de
direção sobre a questão ME1-21, a amarra carimba também `src/data/politica-ia.mjs`, com o nome `politica`. Cinco
estragos, cada um num ficheiro seguido, mudado no lugar, com o portão corrido sozinho e os bytes repostos e
conferidos pelo sha256:
  1. a citação do §5 da `IDENTIDADE.md` com uma palavra mudada tem de ser recusada (a frase já não existe no texto
     governado, que agora são as secções novas);
  2. uma citação sem marca de uma frase das secções novas tem de ser recusada (a omissão da marca);
  3. o texto governado mudado sem uma entrada que o carimbe tem de ser recusado (a amarra);
  4. uma recusa do Método com uma palavra mudada em `src/data/politica-ia.mjs`, sem entrada nova, tem de ser recusada
     (a amarra da política);
  5. a §1.196 com o resumo da política desatualizado (o de `src/data/politica-ia.mjs` na partida, `4b50b92e`) tem de
     ser recusada (idem).
Escreve `plantas-da-amarra.json` ao lado. Correr com a tranca da máquina e sem outra construção a ler os ficheiros.

uso: python3 plantas-da-amarra.py <raiz do sítio>"""
import hashlib, json, pathlib, re, subprocess, sys

RAIZ = pathlib.Path(sys.argv[1]).resolve()
AQUI = pathlib.Path(__file__).resolve().parent
sha = lambda b: hashlib.sha256(b).hexdigest()

def planta(nome, ficheiro, mudar, mordida):
    caminho = RAIZ / ficheiro
    original = caminho.read_bytes()
    try:
        novo = mudar(original.decode('utf-8'))
        assert novo != original.decode('utf-8'), f'{nome}: a planta não mudou nada'
        caminho.write_bytes(novo.encode('utf-8'))
        r = subprocess.run(['node', 'scripts/check-ledger.mjs'], cwd=RAIZ, capture_output=True, text=True)
    finally:
        caminho.write_bytes(original)
    saida = re.sub(r'\x1b\[[0-9;]*m', '', r.stdout + r.stderr)
    reposto = sha(caminho.read_bytes())
    passou = r.returncode == 1 and re.search(mordida, saida) is not None and reposto == sha(original)
    return {'nome': nome, 'ficheiro': ficheiro, 'comando': 'node scripts/check-ledger.mjs', 'codigo': r.returncode,
            'mordida': mordida, 'passou': passou, 'antes': sha(original), 'reposto': reposto,
            'queixa': next((l.strip() for l in saida.splitlines() if re.search(mordida, l)), None)}

CITACAO = 'há um selo que abre a sua entrada'
plantas = [
    planta('me1-citacao-do-selo-mudada', 'IDENTIDADE.md',
           lambda t: t.replace('de cada medição há um selo que abre a sua entrada', 'de cada medição há um selo que abre a sua linha', 1),
           r'IDENTIDADE\.md cita, como sendo do "metodo"'),
    planta('me1-citacao-sem-marca', 'IDENTIDADE.md',
           lambda t: t.rstrip('\n') + '\n\nO Método diz: «Cada valor é lido no documento onde a fonte o publicou, e não em quem o cita».\n',
           r'que é uma frase de "metodo", e não a marca'),
    planta('me1-texto-governado-sem-entrada', 'src/data/metodo.mjs',
           lambda t: t.replace("'Ver o livro-razão'", "'Abrir o livro-razão'", 1),
           r'"metodo": o texto mudou depois da última decisão que o governa'),
    planta('me1-recusa-mudada-sem-entrada', 'src/data/politica-ia.mjs',
           lambda t: t.replace("'Este projeto não aceita dinheiro de nenhuma entidade que mede.'",
                               "'Este projeto não aceita dinheiro de nenhuma entidade que avalia.'", 1),
           r'"politica": o texto mudou depois da última decisão que o governa'),
]
# O resumo da política na partida: o mesmo ficheiro antes do bloco, pela conta de resumoDoTexto().
antigo = subprocess.run(['git', 'show', '4b50b92e:src/data/politica-ia.mjs'], cwd=RAIZ, capture_output=True, check=True).stdout
RESUMO_ANTIGO = sha(antigo.decode('utf-8').replace('\r\n', '\n').encode('utf-8'))[:12]
def desatualiza(t):
    m = re.search(r'^\*\*Texto:\*\* metodo [0-9a-f]{12} · politica ([0-9a-f]{12})$', t, re.M)
    assert m and m.group(1) != RESUMO_ANTIGO, 'a §1.196 não carimba a política, ou já carimba o resumo antigo'
    return t[:m.start(1)] + RESUMO_ANTIGO + t[m.end(1):]
plantas.append(planta('me1-resumo-da-politica-desatualizado', 'DECISIONS.md', desatualiza,
                      r'§1\.196 carimba ' + RESUMO_ANTIGO))
(AQUI / 'plantas-da-amarra.json').write_text(json.dumps(plantas, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
for p in plantas:
    print(('OK' if p['passou'] else 'FALHA'), p['nome'], 'código', p['codigo'], '·', p['queixa'])
sys.exit(0 if all(p['passou'] for p in plantas) else 1)
