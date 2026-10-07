#!/usr/bin/env python3
"""Escreve o LEIA-ME.md do bloco TP1 a partir dos ficheiros desta pasta: nenhum número do relatório é escrito à mão.
uso: python3 design/especime-v3/medicoes/tp1-2026-10-07/relatorio.py  (a partir da raiz da worktree)
Lê: conferencias/cabeca.json e conferencias/*.codigo (as conferências na cabeça do código), e o registo das capturas em
design/especime-v3/capturas/tp1-2026-10-07/ (o JSON que o captar.mjs escreve, com a cabeça e o sha256 de cada captura).
"""
import json, pathlib, sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
CONF = AQUI / 'conferencias'
CAPT = RAIZ / 'design' / 'especime-v3' / 'capturas' / 'tp1-2026-10-07'

cabeca = json.loads((CONF / 'cabeca.json').read_text(encoding='utf-8'))
codigos = {p.stem: (p.read_text(encoding='utf-8').strip()) for p in sorted(CONF.glob('*.codigo'))}
registos = sorted(CAPT.glob('*.json'))
capturas = None
for r in registos:
    d = json.loads(r.read_text(encoding='utf-8'))
    if isinstance(d, dict) and 'cabeca' in d:
        capturas = (r.name, d)
        break
pngs = sorted(p.name for p in CAPT.glob('*.png'))

linhas = []
linhas.append('# TP1 · os textos públicos dizem o que o projeto é (07.10.2026)')
linhas.append('')
linhas.append('*Relatório escrito pelo guião `relatorio.py` desta pasta a partir dos ficheiros que ela guarda; o construtor é o lugar de direção (Claude Fable 5.1), pela §1.181 (o acrescento (f)) e pela §1.182 de `DECISIONS.md`. Sem travessões na prosa.*')
linhas.append('')
linhas.append('## O que mudou para o leitor')
linhas.append('')
linhas.append('Nas duas edições, o Sobre diz o que o projeto é nas palavras do diretor (um projeto independente, conduzido por uma inteligência artificial e financiado em privado) e como se contacta (o endereço das correções, como ligação). O Método deixa de dizer que uma pessoa com nome define as regras e responde: a frase da política diz que nenhum humano revê cada mudança antes de se publicar e que as regras e as recusas estão na página; a secção da política diz primeiro os três papéis e depois o que se publica só pelas verificações automáticas (explicadas uma vez) e o que não se publica e a direção decide; «Nunca sem uma pessoa», «portões verdes» e «portão vermelho» saem; a regra 9 diz que a direção é de um modelo e que ninguém escreve números nem revê cada mudança; a regra 10 diz «financiado em privado». O texto do diretor no Sobre (15.08.2026), o rótulo de todas as páginas, os três papéis e as recusas não mudam. Os textos decididos estão em `brief.md` do pacote e na §1.182.')
linhas.append('')
linhas.append('## Onde parou')
linhas.append('')
linhas.append(f"A cabeça do código é `{cabeca['cabeca']}`, com {cabeca['entradas_por_registar']} entrada(s) por registar na árvore quando as conferências correram ({cabeca['corrido_em']}). O último commit do ramo leva só este relatório, as capturas e os códigos. A corrida `portão` do GitHub corre na cabeça que aterra; na máquina correram as conferências que a mudança toca, abaixo.")
linhas.append('')
linhas.append('## O que ficou aberto')
linhas.append('')
linhas.append('- TP1-1: a entrada do registo das revisões do inventário fica «por ler» até à leitura da outra família; passa a «lida» com o nome do ficheiro da leitura, antes da fusão.')
linhas.append('- TP1-2: o Sobre diz o endereço das correções como contacto; quando o diretor criar o endereço do próprio projeto, a frase e o oráculo mudam no mesmo commit, com a sua entrada no registo.')
linhas.append('- TP1-3: os comentários de `src/data/politica-ia.mjs` e de `src/views/SobreView.astro` conservam a história das redações anteriores; as frases do leitor são só as decididas.')
linhas.append('- TP1-4 (a leitura do Codex, o achado 6): o pacote da leitura não levou os PNG das capturas (o `pacote.sh` deixa os binários fora do diff e das cópias), só o registo com os sha256; na próxima leitura a pasta das capturas entra por `PACOTE_EXTRA`, e o guião do pacote ganha a regra no bloco de higiene.')
linhas.append('- TP1-5 (o achado 10): a etiqueta «The whole agenda →» do Método inglês está no inventário como retirada e rende-se na porta da regra 8; o `check:voz` não a conta (a seta sai na normalização, ou a etiqueta vem da lista das portas); anterior a este bloco, para o bloco de higiene.')
linhas.append('- TP1-6 (o achado 5, corrigido nesta passagem): o rótulo da prova da regra 10 dizia «valores com crédito atribuído na linha» sem dizer o que é o crédito; diz agora «linhas com o nome de quem decidiu o valor, tal como consta do documento», que é o que `src/lib/prova.mjs` conta (`attributed_to`).')
linhas.append('')
linhas.append('## As conferências, na cabeça do código')
linhas.append('')
linhas.append('Corridas por `conferir-tp1.sh` (a cópia está no pacote da leitura como `conferencias/conferir-tp1.sh`), cada uma com o código em `conferencias/<nome>.codigo` e a saída em `conferencias/<nome>.log`:')
linhas.append('')
linhas.append('| conferência | código |')
linhas.append('|---|---:|')
for nome, cod in codigos.items():
    linhas.append(f'| `{nome.replace("-", ":", 1) if nome.startswith("check-") or nome.startswith("gate-") or nome.startswith("ledger-") else nome}` | {cod} |')
linhas.append('')
linhas.append('## As capturas')
linhas.append('')
if capturas:
    nome, d = capturas
    r = d.get('resultados')
    n = len(r) if isinstance(r, (list, dict)) else 0
    linhas.append(f"O registo `design/especime-v3/capturas/tp1-2026-10-07/{nome}` diz a cabeça `{d.get('cabeca')}`, as larguras {', '.join(str(l) for l in d.get('larguras', []))} px, {n} resultados com o sha256 de cada captura, {len(d.get('falhas', []))} falhas e `ok` a {str(d.get('ok')).lower()}; a pasta tem {len(pngs)} ficheiros PNG (as duas páginas, as duas edições, as cinco larguras).")
else:
    linhas.append(f'A pasta `design/especime-v3/capturas/tp1-2026-10-07/` tem {len(pngs)} ficheiros PNG; o registo JSON com a cabeça não se encontrou, e o relatório di-lo em vez de o inventar.')
linhas.append('')
linhas.append('## O custo')
linhas.append('')
linhas.append('O construtor é o lugar de direção, e o seu custo é o total cumulativo da sessão que a ferramenta reporta, sem ficheiro nesta pasta; a leitura pela outra família traz a sua linha «tokens used» no registo `.eventos.log`, citada na §1.182 na aterragem.')
linhas.append('')
(AQUI / 'LEIA-ME.md').write_text('\n'.join(linhas) + '\n', encoding='utf-8')
print(f"LEIA-ME.md escrito: {len(codigos)} conferências, {len(pngs)} capturas")
