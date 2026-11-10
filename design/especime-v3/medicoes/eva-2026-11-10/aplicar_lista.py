#!/usr/bin/env python3
"""Aplicar uma lista de correções aos dois gabaritos aplanados de um estudo do motor (EVA, 10.11.2026).

uso:
  PYTHONDONTWRITEBYTECODE=1 python3 -B aplicar_lista.py <motor> "<pasta do estudo em content/>" <lista.json> \
      [--linhas linhas-proprias.json] [--decisoes decisoes.json] [--com-propostas] \
      [--saida <pasta>] [--relatorio <ficheiro.json>] [--escrever]
  PYTHONDONTWRITEBYTECODE=1 python3 -B aplicar_lista.py <motor> "<pasta>" --ligar --linhas <linhas-proprias.json> \
      [--assercoes <assercoes.json>] [--adaptador provisorio|simulacao] [--escrever]
      (o passo final, para quando a forma «linha própria» do core/compor.py existir: ver «a ligação final»
      no fim deste ficheiro)

O QUE FAZ, unidade a unidade e língua a língua:
  1. Compõe cada gabarito com o próprio `core.compor` (em memória) e reconstrói, linha a linha, a ponte
     entre o texto composto e o gabarito: cada marcador ⟦código:id⟧ ou ⟦nf:…⟧ com a forma que imprime,
     cada escape (\\*), cada ênfase (** e *) e cada ligação. A ponte tem de dar o texto composto byte a
     byte, ou recusa.
  2. Procura a frase atual no texto visível dessa edição: tem de aparecer exatamente uma vez, nas
     fronteiras de palavra (uma unidade de quadro, «.R<n>», só nas fronteiras de célula), sem cortar um
     marcador, no bloco que o identificador da unidade diz (B<bloco>, a linha R<n> do quadro, o item
     L<n> da lista). Se não aparecer, recusa e mostra o texto mais próximo.
  3. Escreve a frase nova no troço do gabarito: compara a frase atual e a nova por pedaços (cada número
     é um pedaço inteiro); o que fica igual copia-se do gabarito tal como estava (marcadores, escapes e
     ênfases); o que é novo escreve-se em Markdown escapado. Cada número novo resolve assim: um número
     que a frase atual já tinha conserva o marcador que tinha (ou recusa se tinha dois marcadores
     diferentes); um ano (1900 a 2099) e uma data ISO ficam como estão; um número declarado para essa
     unidade em --decisoes leva o marcador declarado (que tem de imprimir esse número); um número de uma
     linha própria (--linhas) declarada para essa unidade leva o marcador provisório ⟦<código>:<id>⟧;
     tudo o resto recusa. Uma ênfase só fica se o texto que cobre não muda; se muda, sai, e diz-se.
  4. As três formas: alterar (ou reescrever, apagar parte), apagar (a frase sai com um espaço; um item
     de lista que fica vazio sai inteiro) e acrescentar (depois da unidade anterior: a frase B114.3 vai
     depois da B114.2; uma linha de quadro «.R<n> (nova)» vai depois da linha R<n-1>). Um quadro cujas
     linhas passam todas a ter outro número de células ganha a linha separadora certa; se as linhas
     ficarem com números diferentes, recusa.
  5. Prova, antes de escrever: recompõe os gabaritos novos com o `core.compor` (a regra dos algarismos
     escritos à mão corre aí, linha a linha), com as linhas próprias como derivações locais em memória;
     confere no texto renderizado (`core.eyetext`) que cada frase nova está lá letra por letra e que cada
     frase apagada saiu; compara o texto composto antes e depois e lista cada linha que mude sem ser de
     uma unidade; e confere de novo, só sobre as linhas mudadas, que nenhum algarismo ficou à mão.
  Só com --escrever, e só se tudo isto passar sem uma única recusa, escreve os dois gabaritos. Sem
  --escrever escreve os gabaritos novos e o relatório na pasta --saida (fora do motor).

AS DUAS FORMAS DE LISTA:
  - a do estudo 16 (um objeto com `unidades`: `unidade_id`, `acao` alterar|apagar|nova, `pt_atual`,
    `pt_nova`, `en_unidade`, `en_atual`, `en_nova`);
  - a do estudo 19 (uma lista de objetos com `unidade`, `acao` reescrever|acrescentar|apagar|apagar
    parte|sem alteração…, `pt_atual`, `pt_nova`, `en_unidade`, `en_atual`, `en_nova`, `numeros_novos`,
    `numeros_com_linha`). «sem alteração» só confere que a frase atual está lá, uma vez. Uma unidade
    «(nova)» acrescenta-se. Uma unidade que é um bloco inteiro sem frase atual («B125», apagar) só se
    aplica com uma decisão que diga como o bloco começa (`bloco_comeca_por`), ou recusa.
  - `numeros_com_linha` da forma do 19, com uma só linha candidata que exista, conta como número
    declarado; `numeros_novos` da lista não basta: o número tem de estar no ficheiro --linhas.

O FICHEIRO --decisoes: {"decisoes": [{"unidade", "lingua" (pt|en|*), "estado" (decidido|proposto),
  "razao", e uma de: "troca": [velho, novo] no campo "campo" (atual|nova) da lista, que tem de aparecer
  uma vez; "valor" para o campo "campo"; "numero" + "marcador"; "depois_de"; "bloco_comeca_por"}]}.
  As «propostas» só entram com --com-propostas.

Saída: 0 se tudo se aplicou e provou; 1 se alguma coisa recusou (nada se escreve no motor).
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

C = None            # core.compor, carregado por carregar_motor()
node_tokens = None
eyetext = None
documento_md = None
ZWSP = "​"
RE_ID = re.compile(r"^B(\d+)(?:\.(R)(\d+)|\.L(\d+)(?:\.(\d+))?|\.(\d+)([a-z]?))?$")


def carregar_motor(motor: Path):
    global C, node_tokens, eyetext, documento_md
    sys.path.insert(0, str(motor))
    from core import compor as _C, eyetext as _e, documento_md as _d
    from core.receipts import node_tokens as _nt
    C, node_tokens, eyetext, documento_md = _C, _nt, _e, _d


class Recusa(Exception):
    pass


# ------------------------------------------------------------------ a lista --

@dataclass
class PorLingua:
    unidade: str | None          # o identificador nesta língua, se a lista o dá
    atual: str | None
    nova: str | None
    depois_de: str | None = None  # para acrescentar: o identificador da unidade anterior
    notas: list = field(default_factory=list)


@dataclass
class Unidade:
    id: str
    acao: str                    # alterar | apagar | acrescentar | conferir | apagar-bloco
    acao_da_lista: str
    linguas: dict
    numeros: list = field(default_factory=list)   # (lingua|*, impresso, marcador ou id)
    bloco_comeca_por: dict = field(default_factory=dict)


def _id_limpo(s):
    if not s:
        return None
    s = str(s).replace("(nova)", "").strip()
    m = re.search(r"depois da (B[\w.]+)", s)
    if m:
        return None
    return s if RE_ID.match(s) else None


def _anterior(uid):
    """O identificador da unidade a seguir à qual se acrescenta uma unidade nova."""
    m = RE_ID.match(uid)
    if not m:
        return None
    b = m.group(1)
    if m.group(2):                       # linha de quadro
        return f"B{b}.R{int(m.group(3)) - 1}"
    if m.group(6):
        n, letra = int(m.group(6)), m.group(7)
        return f"B{b}.{n}" if letra else f"B{b}.{n - 1}"
    return None


def normalizar(dados) -> list[Unidade]:
    out = []
    if isinstance(dados, dict) and "unidades" in dados:          # a forma do estudo 16
        for u in dados["unidades"]:
            acao = {"alterar": "alterar", "apagar": "apagar", "nova": "acrescentar"}[u["acao"]]
            ling = {}
            for l in ("pt", "en"):
                uni = u["unidade_id"] if l == "pt" else u.get("en_unidade")
                atual, nova = u.get(f"{l}_atual") or None, u.get(f"{l}_nova")
                if acao == "apagar":
                    nova = None
                pl = PorLingua(_id_limpo(uni), atual, nova)
                if acao == "acrescentar":
                    m = re.search(r"depois da (B[\w.]+)", str(uni or ""))
                    pl.depois_de = m.group(1) if m else _anterior(u["unidade_id"])
                ling[l] = pl
            out.append(Unidade(u["unidade_id"], acao, u["acao"], ling))
        return out
    for u in dados:                                              # a forma do estudo 19
        a = u["acao"]
        if a in ("reescrever", "apagar parte"):
            acao = "alterar"
        elif a == "acrescentar":
            acao = "acrescentar"
        elif a == "apagar":
            acao = "apagar" if (u.get("pt_atual") or u.get("en_atual")) else "apagar-bloco"
        elif a.startswith("sem alteração"):
            acao = "conferir"
        else:
            raise Recusa(f"{u['unidade']}: ação desconhecida {a!r}")
        uid = str(u["unidade"]).replace("(nova)", "").strip()
        ling = {}
        for l in ("pt", "en"):
            uni = uid if l == "pt" else str(u.get("en_unidade") or "").replace("(nova)", "").strip()
            pl = PorLingua(_id_limpo(uni), u.get(f"{l}_atual") or None, u.get(f"{l}_nova") or None)
            if acao == "apagar":
                pl.nova = None
            if acao == "acrescentar":
                pl.depois_de = _anterior(pl.unidade or uid)
            ling[l] = pl
        un = Unidade(uid, acao, a, ling)
        # um número que a lista também dá como novo (lido noutra passagem que a da linha existente)
        # não se declara sozinho: pede uma decisão ou uma linha própria
        novos_da_lista = {n["numero"] for n in (u.get("numeros_novos") or [])}
        for n in u.get("numeros_com_linha") or []:
            cands = [c for c in n.get("linhas_candidatas", []) if not c.startswith("linha nova")]
            if len(cands) == 1 and len(n.get("linhas_candidatas", [])) == 1 and n["numero"] not in novos_da_lista:
                un.numeros.append(("*", n["numero"], cands[0], "numeros_com_linha da lista"))
        out.append(un)
    # linhas e frases novas seguidas (B136.R54 a R59): cada uma vai depois da última que já existe,
    # e a ordem da lista conserva-se (as inserções no mesmo sítio entram pela ordem em que chegam)
    novas = {u.id for u in out if u.acao == "acrescentar"}
    for u in out:
        for pl in u.linguas.values():
            vistos = set()
            while pl.depois_de in novas and pl.depois_de not in vistos:
                vistos.add(pl.depois_de)
                pl.depois_de = _anterior(pl.depois_de)
    return out


def aplicar_decisoes(unidades, decisoes, com_propostas, registo):
    por_id = {u.id: u for u in unidades}
    for d in decisoes:
        if d.get("estado") == "proposto" and not com_propostas:
            registo.append({"decisao": d, "aplicada": False, "porque": "proposta: só com --com-propostas"})
            continue
        u = por_id.get(d["unidade"])
        if u is None:
            raise Recusa(f"decisão para uma unidade que a lista não tem: {d['unidade']}")
        linguas = ["pt", "en"] if d.get("lingua", "*") == "*" else [d["lingua"]]
        for l in linguas:
            pl = u.linguas[l]
            if "troca" in d:
                campo = d.get("campo", "nova")
                texto = getattr(pl, campo)
                velho, novo = d["troca"]
                if texto is None or texto.count(velho) != 1:
                    raise Recusa(f"decisão {d['unidade']} {l}: «{velho}» tem de aparecer uma vez em {campo}; "
                                 f"aparece {0 if texto is None else texto.count(velho)}")
                setattr(pl, campo, texto.replace(velho, novo))
            elif "valor" in d:
                setattr(pl, d["campo"], d["valor"])
            elif "numero" in d:
                u.numeros.append((l, d["numero"], d["marcador"], f"decisão: {d.get('razao', '')}"))
            elif "depois_de" in d:
                pl.depois_de = None
                pl.notas.append(("depois_de_texto", d["depois_de"]))
            elif "bloco_comeca_por" in d:
                u.bloco_comeca_por[l] = d["bloco_comeca_por"]
            else:
                raise Recusa(f"decisão sem efeito conhecido: {d}")
        registo.append({"decisao": d, "aplicada": True})


# ------------------------------------------------------------------ a ponte --

@dataclass
class Atomo:
    tpl: str
    vis: str
    md: str
    tipo: str        # texto | escape | marca | nf | enfase | ligacao
    par: int = -1    # para ênfases e ligações: o índice do átomo par


_LIGACAO_RE = re.compile(r"\[([^\]\n]*)\]\(([^)\n]*)\)")


def atomos(linha: str, comp, lingua: str) -> list[Atomo]:
    padrao = re.compile(C._NAO_FIGURA_RE.pattern + "|" + C._MARCA_RE.pattern)
    out: list[Atomo] = []

    def texto(s):
        ligs = {}
        for m in _LIGACAO_RE.finditer(s):
            ligs[m.start()] = ("abre", 1)
            ligs[m.end(1)] = ("fecha", m.end() - m.end(1))
        i = 0
        while i < len(s):
            if i in ligs:
                k, n = ligs[i]
                out.append(Atomo(s[i:i + n], "", s[i:i + n], "ligacao"))
                i += n
            elif s[i] == "\\" and i + 1 < len(s):
                out.append(Atomo(s[i:i + 2], s[i + 1], s[i:i + 2], "escape"))
                i += 2
            elif s.startswith("**", i):
                out.append(Atomo("**", "", "**", "enfase"))
                i += 2
            elif s[i] == "*":
                out.append(Atomo("*", "", "*", "enfase"))
                i += 1
            else:
                out.append(Atomo(s[i], s[i], s[i], "texto"))
                i += 1

    pos = 0
    for m in padrao.finditer(linha):
        texto(linha[pos:m.start()])
        nf = C._NAO_FIGURA_RE.fullmatch(m[0])
        if nf:
            cod, b, u, o = nf.groups()
            impresso = C.nao_figura(comp.fontes[cod], lingua, int(b), int(u), int(o))
            out.append(Atomo(m[0], impresso, impresso, "nf"))
        else:
            mm = C._MARCA_RE.fullmatch(m[0])
            impresso = C._impresso(comp.fontes[mm[1]], lingua, mm[2])
            out.append(Atomo(m[0], impresso, impresso, "marca"))
        pos = m.end()
    texto(linha[pos:])
    # emparelhar as ênfases (cada forma à parte) e as ligações
    for forma in ("**", "*"):
        aberta = None
        for i, a in enumerate(out):
            if a.tipo == "enfase" and a.tpl == forma:
                if aberta is None:
                    aberta = i
                else:
                    out[aberta].par, a.par = i, aberta
                    aberta = None
    aberta = None
    for i, a in enumerate(out):
        if a.tipo == "ligacao":
            if a.tpl == "[":
                aberta = i
            elif aberta is not None:
                out[aberta].par, a.par = i, aberta
                aberta = None
    return out


@dataclass
class Linha:
    n: int              # índice no gabarito (0-based)
    at: list
    vis: str
    vmap: list          # posição visível -> (átomo, deslocamento)
    bloco: int = -1
    no_bloco: int = -1  # a linha dentro do bloco
    tipo_bloco: str = ""


class Edicao:
    def __init__(self, gabarito_texto: str, nome: str, lingua: str, fontes_previas=None):
        self.lingua, self.nome = lingua, nome
        self.texto = gabarito_texto
        self.linhas_tpl = gabarito_texto.splitlines()
        if any(l.startswith("@@bloco ") for l in self.linhas_tpl):
            raise Recusa(f"{nome}: o gabarito não está aplanado (tem @@bloco)")
        self.comp = _compor_texto(gabarito_texto, nome, fontes_previas)
        prosa = [i for i, l in enumerate(self.linhas_tpl) if not C._DIRETIVA_RE.match(l) and not C._EMENDA_RE.match(l)]
        while prosa and self.linhas_tpl[prosa[0]] == "":
            prosa.pop(0)
        while prosa and self.linhas_tpl[prosa[-1]] == "":
            prosa.pop()
        self.linhas: list[Linha] = []
        for i in prosa:
            at = atomos(self.linhas_tpl[i], self.comp, lingua)
            vis, vmap = "", []
            for k, a in enumerate(at):
                for d in range(len(a.vis)):
                    vmap.append((k, d))
                vis += a.vis
            self.linhas.append(Linha(i, at, vis, vmap))
        md = "\n".join("".join(a.md for a in l.at) for l in self.linhas) + "\n"
        if md != self.comp.md:
            alvo = self.comp.md.splitlines()
            for k, l in enumerate(self.linhas):
                if k >= len(alvo) or "".join(a.md for a in l.at) != alvo[k]:
                    raise Recusa(f"{nome}: a ponte não dá o texto composto na linha {l.n + 1} do gabarito")
            raise Recusa(f"{nome}: a ponte não dá o texto composto")
        b, dentro, tipo = 0, 0, None
        for k, l in enumerate(self.linhas):
            if l.vis.strip() == "":
                if tipo is not None:
                    b += 1
                tipo, dentro = None, 0
                continue
            if tipo is None:
                s = l.vis.lstrip()
                tipo = ("quadro" if s.startswith("|") else "lista" if re.match(r"^(-|\d+\.) ", s)
                        else "titulo" if s.startswith("#") else "paragrafo")
            l.bloco, l.no_bloco, l.tipo_bloco = b, dentro, tipo
            dentro += 1

    def bloco(self, b):
        return [l for l in self.linhas if l.bloco == b]


def _compor_texto(texto: str, nome: str, fontes_previas=None):
    """Compõe um gabarito a partir do texto, no sítio do original (a pasta conta para @@derivadas)."""
    import tempfile
    gab = Path(nome)
    fontes = dict(fontes_previas or {})
    if gab.exists() and gab.read_text(encoding="utf-8") == texto:
        return C.compor(gab, fontes)
    with tempfile.TemporaryDirectory(prefix="eva-") as tmp:
        pasta = Path(tmp) / gab.parent.parent.name / gab.parent.name
        pasta.mkdir(parents=True)
        (pasta / "ajustes.json").write_bytes((gab.parent / "ajustes.json").read_bytes())
        g = pasta / gab.name
        g.write_text(texto, encoding="utf-8")
        return C.compor(g, fontes)


# ------------------------------------------------------------- a procura --

def _e_quadro(uid):
    m = RE_ID.match(uid or "")
    return bool(m and m.group(2))


def _interior(s):
    s = s.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|") and not s.endswith("\\|"):
        s = s[:-1]
    return s.strip()


def procurar(ed: Edicao, atual: str, quadro: bool):
    """[(linha, início, fim)] das ocorrências válidas de `atual` no texto visível."""
    achados = []
    alvo = _interior(atual) if quadro else atual.strip()
    for li, l in enumerate(ed.linhas):
        if quadro and l.tipo_bloco != "quadro":
            continue
        v = l.vis
        i = v.find(alvo)
        while i >= 0:
            j = i + len(alvo)
            ok = True
            if quadro:
                ok = v[:i].rstrip(" ").endswith("|") and v[j:].lstrip(" ").startswith("|")
            else:
                ok = (i == 0 or not v[i - 1].isalnum()) and (j == len(v) or not v[j].isalnum())
            if ok and alvo:
                ka, da = l.vmap[i]
                kz, dz = l.vmap[j - 1]
                if da != 0 or dz != len(l.at[kz].vis) - 1:
                    ok = False   # corta um marcador
            if ok:
                achados.append((li, i, j))
            i = v.find(alvo, i + 1)
    return achados, alvo


def mais_proximo(ed: Edicao, atual: str):
    melhor, r = None, 0.0
    alvo = atual.strip()
    for l in ed.linhas:
        if not l.vis.strip():
            continue
        sm = difflib.SequenceMatcher(None, alvo, l.vis, autojunk=False)
        a, b, n = sm.find_longest_match(0, len(alvo), 0, len(l.vis))
        ini = max(0, b - a)
        trecho = l.vis[ini:ini + len(alvo) + 10]
        rr = difflib.SequenceMatcher(None, alvo, trecho, autojunk=False).ratio()
        if rr > r:
            melhor, r = (l.n + 1, trecho), rr
    return melhor, round(r, 3)


def conferir_lugar(ed: Edicao, uid: str | None, li: int):
    """None se o lugar bate com o identificador; senão a razão."""
    l = ed.linhas[li]
    if not uid:
        return None
    m = RE_ID.match(uid)
    b = int(m.group(1))
    if l.bloco != b:
        return f"está no bloco {l.bloco}, e a unidade diz o bloco {b}"
    if m.group(2):
        r = int(m.group(3))
        esperado = 0 if r == 0 else r + 1
        if l.no_bloco != esperado:
            return f"está na linha {l.no_bloco} do quadro, e R{r} é a linha {esperado}"
    if m.group(4):
        if l.no_bloco != int(m.group(4)) - 1:
            return f"está no item {l.no_bloco + 1} da lista, e a unidade diz o item {m.group(4)}"
    return None


# ------------------------------------------------------------ a escrita --

@dataclass
class Peca:
    vis: str
    tpl: str
    tipo: str            # num | txt | marcacao
    idx: int = -1        # índice do átomo (para as marcações)


def _pedacos(s: str):
    """Pedaços de um texto simples: números (pelo node_tokens do motor), palavras, espaços, sinais."""
    out, pos = [], 0
    for a, z, _ in node_tokens(s):
        out += [("txt", w) for w in re.findall(r"\w+|\s+|[^\w\s]", s[pos:a])]
        out.append(("num", s[a:z]))
        pos = z
    out += [("txt", w) for w in re.findall(r"\w+|\s+|[^\w\s]", s[pos:])]
    return out


def pecas_do_gabarito(at: list, ka: int, kz: int) -> list[Peca]:
    out, corrida = [], []

    def fecha():
        if not corrida:
            return
        s = "".join(at[k].vis for k in corrida)
        for tipo, w in _pedacos(s):
            out.append(Peca(w, w, tipo))
        corrida.clear()

    for k in range(ka, kz):
        a = at[k]
        if a.tipo == "texto":
            corrida.append(k)
            continue
        fecha()
        if a.tipo in ("marca", "nf"):
            out.append(Peca(a.vis, a.tpl, "num", k))
        elif a.tipo == "escape":
            out.append(Peca(a.vis, a.tpl, "txt", k))
        else:
            out.append(Peca("", a.tpl, "marcacao", k))
    fecha()
    return out


def escapar(s: str, quadro: bool) -> str:
    return "".join("\\" + ch if ch in ("\\`[]*" + ("" if quadro else "|")) else ch for ch in s)


def _ano(s):
    return bool(C._ANO_RE.fullmatch(s))


def escrever_troco(at, ka, kz, nova_vis, quadro, resolver, notas):
    """O Markdown do gabarito que substitui os átomos [ka, kz) para imprimir `nova_vis`."""
    A = pecas_do_gabarito(at, ka, kz)
    Av = [p for p in A if p.tipo != "marcacao"]
    B = _pedacos(nova_vis)
    sm = difflib.SequenceMatcher(None, [p.vis for p in Av], [w for _, w in B], autojunk=False)
    ops = sm.get_opcodes()
    igual = set()
    for op, i1, i2, _, _ in ops:
        if op == "equal":
            igual.update(id(Av[i]) for i in range(i1, i2))
    # cada marcação par fica se tudo o que cobre ficou igual e no mesmo pedaço igual
    pos = {id(p): n for n, p in enumerate(A)}
    bloco_igual = {}
    for n, (op, i1, i2, _, _) in enumerate(ops):
        if op == "equal":
            for i in range(i1, i2):
                bloco_igual[id(Av[i])] = n
    fica = set()
    for p in A:
        if p.tipo != "marcacao":
            continue
        q = at[p.idx].par
        if q < 0:
            notas.append(f"marcação sem par ({p.tpl!r}) dentro do troço: sai")
            continue
        if not (ka <= q < kz):
            raise Recusa(f"uma ênfase atravessa a fronteira da unidade ({p.tpl!r})")
        ia = pos[id(p)]
        iz = pos[id(next(x for x in A if x.tipo == "marcacao" and x.idx == q))]
        lo, hi = min(ia, iz), max(ia, iz)
        cobertos = [x for x in A[lo + 1:hi] if x.tipo != "marcacao"]
        blocos = {bloco_igual.get(id(x)) for x in cobertos}
        if cobertos and None not in blocos and len(blocos) == 1:
            fica.add(id(p))
        elif p.idx < q:
            notas.append(f"a ênfase {p.tpl!r} sobre «{''.join(x.vis for x in cobertos)[:60]}» sai: o texto que cobria mudou")
    # âncoras: uma marcação que fica sai antes do próximo pedaço visível (abre) ou depois do anterior (fecha)
    antes, depois = {}, {}
    for n, p in enumerate(A):
        if p.tipo != "marcacao" or id(p) not in fica:
            continue
        abre = p.idx < at[p.idx].par
        if abre:
            alvo = next(x for x in A[n + 1:] if x.tipo != "marcacao")
            antes.setdefault(id(alvo), []).append(p.tpl)
        else:
            alvo = next(x for x in reversed(A[:n]) if x.tipo != "marcacao")
            depois.setdefault(id(alvo), []).append(p.tpl)
    saida = []
    for op, i1, i2, j1, j2 in ops:
        if op == "equal":
            for i in range(i1, i2):
                p = Av[i]
                saida.append("".join(antes.get(id(p), [])) + p.tpl + "".join(depois.get(id(p), [])))
        elif op in ("replace", "insert"):
            for tipo, w in B[j1:j2]:
                saida.append(resolver(w) if tipo == "num" else escapar(w, quadro))
    return "".join(saida)


def fazer_resolver(unidade: Unidade, lingua: str, A_pecas, linhas_proprias, ed: Edicao, usados):
    no_atual = {}
    for p in A_pecas:
        if p.tipo == "num":
            no_atual.setdefault(p.vis, set()).add(p.tpl)
    declarados = {imp: (alvo, razao) for (l, imp, alvo, razao) in unidade.numeros if l in ("*", lingua)}
    uid = unidade.linguas[lingua].unidade or unidade.id

    def resolver(w):
        if w in no_atual:
            tpls = no_atual[w]
            if len(tpls) > 1:
                raise Recusa(f"o número {w} tinha {len(tpls)} marcadores diferentes na frase atual: {sorted(tpls)}")
            return next(iter(tpls))
        if _ano(w):
            return w
        if w in declarados:
            alvo, razao = declarados[w]
            marca = alvo if alvo.startswith("⟦") else _marcador_por_id(ed, alvo, w)
            mm = C._MARCA_RE.fullmatch(marca)
            if not mm or mm[1] not in ed.comp.fontes:
                raise Recusa(f"o número {w} declarado com o marcador {marca}, que não resolve")
            impresso = C._impresso(ed.comp.fontes[mm[1]], lingua, mm[2])
            if impresso != w:
                raise Recusa(f"o número {w} declarado com {marca}, que imprime {impresso!r}")
            usados.append(("declarado", w, marca, razao))
            return marca
        for lp in linhas_proprias:
            if lp.get("impresso") and lp["impresso"].get(lingua) == w and unidade.id in lp.get("unidades", []):
                marca = f"⟦{lp['_codigo']}:{lp['id']}⟧"
                usados.append(("linha propria", w, marca, lp["id"]))
                return marca
        outras = [lp["id"] for lp in linhas_proprias if lp.get("impresso") and lp["impresso"].get(lingua) == w]
        raise Recusa(f"o número novo {w} não tem linha: não está na frase atual, não é um ano, não foi declarado"
                     + (f"; há linhas próprias com essa forma ({outras}) mas não declaradas para {unidade.id}" if outras else ""))
    return resolver


def _marcador_por_id(ed, rid, w):
    achados = []
    for cod, f in ed.comp.fontes.items():
        try:
            if C._impresso(f, ed.lingua, rid) == w:
                achados.append(f"⟦{cod}:{rid}⟧")
        except Exception:
            continue
    if len(achados) != 1:
        raise Recusa(f"a linha {rid} imprime {w} em {len(achados)} fonte(s) declaradas: {achados}")
    return achados[0]


_FRASE_RE = re.compile(r"(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ«\"“(])")


def frases(texto: str):
    """[(início, fim)] das frases de um parágrafo visível (fronteira: . ! ? seguido de maiúscula)."""
    out, pos = [], 0
    for m in _FRASE_RE.finditer(texto):
        out.append((pos, m.start()))
        pos = m.end()
    out.append((pos, len(texto)))
    return out


# -------------------------------------------------------------- aplicar --

@dataclass
class Edicao_nova:
    edits: dict = field(default_factory=dict)       # índice da linha -> [(a, z, novo, unidade)]
    inserir_depois: dict = field(default_factory=dict)  # índice da linha -> [(texto, unidade)]
    apagar_linhas: set = field(default_factory=set)
    quadros: set = field(default_factory=set)
    tocadas: dict = field(default_factory=dict)     # índice da linha do gabarito -> [unidades]


def _tpl_pos(at, k):
    return sum(len(a.tpl) for a in at[:k])


def aplicar_unidade(u: Unidade, l: str, ed: Edicao, nova_ed: Edicao_nova, linhas_proprias, res):
    pl = u.linguas[l]
    quadro = _e_quadro(u.id)
    r = {"unidade": u.id, "lingua": l, "unidade_na_lingua": pl.unidade, "acao": u.acao, "notas": list(n[1] for n in pl.notas if n[0] != "depois_de_texto")}
    res.append(r)
    try:
        if u.acao == "apagar-bloco":
            comeco = u.bloco_comeca_por.get(l)
            b = int(RE_ID.match(pl.unidade or u.id).group(1))
            linhas = ed.bloco(b)
            if not linhas:
                raise Recusa(f"o bloco {b} não existe nesta edição")
            texto = " / ".join(x.vis for x in linhas)
            if not comeco or not texto.startswith(comeco):
                raise Recusa(f"um bloco inteiro só sai com uma decisão que diga como começa; o bloco {b} começa por «{texto[:120]}»")
            for x in linhas:
                nova_ed.apagar_linhas.add(x.n)
                nova_ed.tocadas.setdefault(x.n, []).append(u.id)
            r.update(estado="aplicada", _vis=("apagar-linhas", [ed.linhas.index(x) for x in linhas]))
            return
        if u.acao == "acrescentar":
            if not pl.nova:
                raise Recusa("acrescentar sem frase nova")
            dt = dict(pl.notas).get("depois_de_texto")
            uid_ant = pl.depois_de
            if dt is None:
                if not uid_ant:
                    raise Recusa("acrescentar sem a unidade anterior")
                m = RE_ID.match(uid_ant)
                b = int(m.group(1))
                if m.group(2):          # linha de quadro: vai depois da linha R<n-1>
                    rr = int(m.group(3))
                    alvo = [x for x in ed.bloco(b) if x.no_bloco == (0 if rr == 0 else rr + 1)]
                    if len(alvo) != 1 or alvo[0].tipo_bloco != "quadro":
                        raise Recusa(f"o quadro {b} não tem a linha {uid_ant}")
                    li = ed.linhas.index(alvo[0])
                    A = []
                    resolver = fazer_resolver(u, l, A, linhas_proprias, ed, r.setdefault("numeros", []))
                    celulas = [c.strip() for c in _interior(pl.nova).split(" | ")]
                    novo = "| " + " | ".join(escrever_troco([], 0, 0, c, True, resolver, r["notas"]) for c in celulas) + " |"
                    nova_ed.inserir_depois.setdefault(alvo[0].n, []).append((novo, u.id))
                    nova_ed.quadros.add(b)
                    nova_ed.tocadas.setdefault(alvo[0].n, []).append(u.id)
                    r.update(estado="aplicada", ancora=f"depois da linha {uid_ant}: «{alvo[0].vis[:80]}»", gabarito_novo=novo,
                             _vis=("linha-depois", li, "| " + " | ".join(celulas) + " |"))
                    return
                n_ant = int(m.group(6))
                par = [x for x in ed.bloco(b) if x.tipo_bloco == "paragrafo"]
                if len(par) != 1:
                    raise Recusa(f"o bloco {b} não é um parágrafo de uma linha")
                fs = frases(par[0].vis)
                if n_ant > len(fs):
                    raise Recusa(f"o bloco {b} tem {len(fs)} frase(s); não há a {uid_ant}")
                a, z = fs[n_ant - 1]
                dt = par[0].vis[a:z]
            achados, _ = procurar(ed, dt, False)
            if len(achados) != 1:
                raise Recusa(f"a âncora «{dt}» aparece {len(achados)} vez(es)")
            li, i, j = achados[0]
            lugar = conferir_lugar(ed, f"B{RE_ID.match(uid_ant).group(1)}" if uid_ant else None, li)
            if lugar:
                raise Recusa(f"a âncora {lugar}")
            linha = ed.linhas[li]
            kz = linha.vmap[j - 1][0] + 1
            resolver = fazer_resolver(u, l, [], linhas_proprias, ed, r.setdefault("numeros", []))
            novo = " " + escrever_troco([], 0, 0, pl.nova, False, resolver, r["notas"])
            p = _tpl_pos(linha.at, kz)
            nova_ed.edits.setdefault(linha.n, []).append((p, p, novo, u.id))
            nova_ed.tocadas.setdefault(linha.n, []).append(u.id)
            r.update(estado="aplicada", ancora=f"depois de «{dt[-60:]}» (linha {linha.n + 1} do gabarito)", gabarito_novo=novo,
                     _vis=("troca", li, j, j, " " + pl.nova.strip()))
            return
        if not pl.atual:
            raise Recusa("a lista não traz a frase atual nesta língua")
        achados, alvo = procurar(ed, pl.atual, quadro)
        if len(achados) != 1:
            prox = mais_proximo(ed, pl.atual) if not achados else None
            onde = [f"linha {ed.linhas[li].n + 1} do gabarito, bloco {ed.linhas[li].bloco}" for li, _, _ in achados]
            raise Recusa(f"a frase atual aparece {len(achados)} vez(es) no texto composto"
                         + (f" ({'; '.join(onde)})" if onde else "")
                         + (f"; o texto mais próximo (linha {prox[0][0]} do gabarito, semelhança {prox[1]}): «{prox[0][1]}»" if prox and prox[0] else ""))
        li, i, j = achados[0]
        lugar = conferir_lugar(ed, pl.unidade, li)
        if lugar:
            raise Recusa(f"a frase atual {lugar}")
        linha = ed.linhas[li]
        r["onde"] = {"linha_do_gabarito": linha.n + 1, "bloco": linha.bloco, "linha_no_bloco": linha.no_bloco,
                     "unidade_conferida": bool(pl.unidade)}
        if not pl.unidade:
            r["notas"].append(f"a lista não dá a unidade nesta língua: o lugar (bloco {linha.bloco}) não se conferiu pelo identificador")
        ka, kz = linha.vmap[i][0], linha.vmap[j - 1][0] + 1
        # alargar a marcações encostadas cujo par está dentro
        mudou = True
        while mudou:
            mudou = False
            if ka > 0 and linha.at[ka - 1].tipo in ("enfase", "ligacao") and ka <= linha.at[ka - 1].par < kz:
                ka -= 1; mudou = True
            if kz < len(linha.at) and linha.at[kz].tipo in ("enfase", "ligacao") and ka <= linha.at[kz].par < kz:
                kz += 1; mudou = True
        a_tpl, z_tpl = _tpl_pos(linha.at, ka), _tpl_pos(linha.at, kz)
        r["gabarito_atual"] = linha_tpl = ed.linhas_tpl[linha.n][a_tpl:z_tpl]
        if u.acao == "conferir":
            if pl.nova and pl.nova.strip() != pl.atual.strip():
                raise Recusa("«sem alteração» com uma frase nova diferente da atual")
            r["estado"] = "conferida (sem alteração)"
            return
        if u.acao == "apagar":
            # sai com um espaço vizinho
            if kz < len(linha.at) and linha.at[kz].tpl == " ":
                z_tpl += 1
            elif ka > 0 and linha.at[ka - 1].tpl == " ":
                a_tpl -= 1
            nova_ed.edits.setdefault(linha.n, []).append((a_tpl, z_tpl, "", u.id))
            nova_ed.tocadas.setdefault(linha.n, []).append(u.id)
            v = linha.vis
            vi, vj = i, j
            if vj < len(v) and v[vj] == " ":
                vj += 1
            elif vi > 0 and v[vi - 1] == " ":
                vi -= 1
            r.update(estado="aplicada", gabarito_novo="", _vis=("troca", li, vi, vj, ""))
            return
        A = pecas_do_gabarito(linha.at, ka, kz)
        nova_vis = _interior(pl.nova) if quadro else pl.nova.strip()
        resolver = fazer_resolver(u, l, A, linhas_proprias, ed, r.setdefault("numeros", []))
        novo = escrever_troco(linha.at, ka, kz, nova_vis, quadro, resolver, r["notas"])
        nova_ed.edits.setdefault(linha.n, []).append((a_tpl, z_tpl, novo, u.id))
        nova_ed.tocadas.setdefault(linha.n, []).append(u.id)
        if quadro:
            nova_ed.quadros.add(linha.bloco)
        r.update(estado="aplicada", gabarito_novo=novo, _vis=("troca", li, i, j, nova_vis))
    except Recusa as exc:
        r.update(estado="recusada", razao=str(exc))


def montar(ed: Edicao, ne: Edicao_nova) -> tuple[str, list]:
    """O texto novo do gabarito e as recusas da montagem."""
    recusas = []
    linhas = list(ed.linhas_tpl)
    for n, eds in ne.edits.items():
        eds, rec = juntar(eds)
        recusas += [f"linha {n + 1}: {x}" for x in rec]
        s = linhas[n]
        for a, z, novo, _ in sorted(eds, key=lambda e: (e[0], e[1]), reverse=True):
            s = s[:a] + novo + s[z:]
        linhas[n] = s
    # itens de lista e parágrafos que ficaram vazios
    for n in ne.edits:
        if re.fullmatch(r"\s*(-|\d+\.)?\s*", linhas[n]):
            ne.apagar_linhas.add(n)
    # quadros: a separadora acompanha o número de células
    for b in sorted(ne.quadros):
        bl = ed.bloco(b)
        idx = [x.n for x in bl]
        novas_depois = {x.n: [t for t, _ in ne.inserir_depois.get(x.n, [])] for x in bl}
        filas = []
        for n in idx:
            filas.append(n)
        contagens = {}
        for n in idx:
            if n in ne.apagar_linhas or n == idx[1]:
                continue
            contagens[n] = _celulas(linhas[n])
            for k, t in enumerate(novas_depois[n]):
                contagens[(n, k)] = _celulas(t)
        valores = set(contagens.values())
        if len(valores) != 1:
            recusas.append(f"o quadro do bloco {b} fica com linhas de {sorted(valores)} células: "
                           + "; ".join(f"{(k + 1) if isinstance(k, int) else str(k[0] + 1) + '+' + str(k[1] + 1)}→{v}" for k, v in contagens.items()))
            continue
        nc = valores.pop()
        sep = linhas[idx[1]]
        celulas_sep = [c for c in sep.strip().strip("|").split("|")]
        if len(celulas_sep) != nc:
            linhas[idx[1]] = "|" + "|".join([celulas_sep[0]] * nc) + "|"
            ne.tocadas.setdefault(idx[1], []).append(f"separadora do quadro do bloco {b}")
    out = []
    for n, s in enumerate(linhas):
        if n in ne.apagar_linhas:
            continue
        out.append(s)
        for t, _ in ne.inserir_depois.get(n, []):
            out.append(t)
    return "\n".join(out) + ("\n" if ed.texto.endswith("\n") else ""), recusas


def juntar(eds):
    """Ordena as trocas de uma linha; duas que apagam e se tocam juntam-se numa (as duas frases de um
    item que sai); duas que se sobrepõem de outra maneira recusam."""
    eds = sorted(eds, key=lambda e: (e[0], e[1]))
    out, rec = [], []
    for e in eds:
        if out:
            a1, z1, t1, u1 = out[-1]
            a2, z2, t2, u2 = e
            if a2 < z1 or (a2 == z1 and t1 == "" and t2 == "" and a2 > a1):
                if t1 == "" and t2 == "":
                    out[-1] = (a1, max(z1, z2), "", f"{u1}+{u2}")
                    continue
                rec.append(f"as unidades {u1} e {u2} sobrepõem-se")
        out.append(e)
    return out, rec


def _celulas(linha_md: str) -> int:
    s = linha_md.strip()
    partes = re.split(r"(?<!\\)\|", s)
    return len(partes) - 2 if s.startswith("|") and s.endswith("|") else len(partes)


# --------------------------------------------------------------- provar --

def _visiveis(md: str):
    """(texto de cada unidade renderizada, por bloco): parágrafos e itens inteiros; linhas de quadro
    com as células juntas por « | »."""
    out = []
    for b in eyetext.parse(documento_md.render(md)):
        if b["kind"] in ("heading", "paragraph"):
            out.append([eyetext.Text(b["unit"]).text.replace(ZWSP, "")])
        elif b["kind"] == "list":
            out.append([eyetext.Text(it).text.replace(ZWSP, "") for it in b["items"]])
        elif b["kind"] == "table":
            out.append([" | ".join(eyetext.Text(c).text.replace(ZWSP, "").strip() for c in row) for row in b["rows"]])
        else:
            out.append([])
    return out


def provar(unidades, res, eds_antes, textos_novos, fontes_16, ne_por_lingua):
    prova = {"frases": [], "fora_das_unidades": [], "algarismos": [], "composicao": {}}
    eds_depois = {}
    for l, ed in eds_antes.items():
        try:
            eds_depois[l] = Edicao(textos_novos[l], ed.nome, l, fontes_16)
            prova["composicao"][l] = "compõe (core.compor, com a regra dos algarismos à mão)"
        except Exception as exc:
            prova["composicao"][l] = f"RECUSA: {exc}"
    for l in eds_antes:
        if l not in eds_depois:
            continue
        vis_antes = _visiveis(eds_antes[l].comp.md)
        vis_depois = _visiveis(eds_depois[l].comp.md)
        todos_depois = "\n".join(t for b in vis_depois for t in b)
        todos_antes = "\n".join(t for b in vis_antes for t in b)
        for u in unidades:
            pl = u.linguas[l]
            r = next((x for x in res if x["unidade"] == u.id and x["lingua"] == l), None)
            if r is None or r.get("estado") != "aplicada":
                continue
            quadro = _e_quadro(u.id)
            linha = {"unidade": u.id, "lingua": l}
            if u.acao in ("apagar", "apagar-bloco"):
                alvo = (_interior(pl.atual) if quadro else pl.atual.strip()) if pl.atual else None
                linha["frase"] = alvo
                linha["antes"] = todos_antes.count(alvo) if alvo else None
                linha["depois"] = todos_depois.count(alvo) if alvo else None
                linha["ok"] = bool(alvo) and linha["depois"] == 0 and linha["antes"] >= 1
            else:
                alvo = _interior(pl.nova) if quadro else pl.nova.strip()
                linha["frase"] = alvo
                if quadro:
                    linha["depois"] = sum(1 for b in vis_depois for t in b if t == alvo)
                else:
                    linha["depois"] = todos_depois.count(alvo)
                linha["ok"] = linha["depois"] >= 1
            prova["frases"].append(linha)
        # (b) o diff do texto composto: o texto visível de antes, com SÓ as trocas das unidades feitas
        # sobre ele (sem o gabarito), tem de dar o texto visível de depois, linha a linha
        antes = [x.vis for x in eds_antes[l].linhas]
        trocas, depois_de, fora = {}, {}, set()
        dono = {}
        for r in res:
            if r["lingua"] != l or r.get("estado") != "aplicada" or "_vis" not in r:
                continue
            v = r["_vis"]
            if v[0] == "troca":
                trocas.setdefault(v[1], []).append((v[2], v[3], v[4]))
                dono.setdefault(v[1], []).append(r["unidade"])
            elif v[0] == "linha-depois":
                depois_de.setdefault(v[1], []).append(v[2])
                dono.setdefault(v[1], []).append(r["unidade"])
            elif v[0] == "apagar-linhas":
                fora.update(v[1])
                for k in v[1]:
                    dono.setdefault(k, []).append(r["unidade"])
        esperado_l = list(antes)
        for k, ts in trocas.items():
            s = esperado_l[k]
            ts, _ = juntar([(a, z, t, "") for a, z, t in ts])
            for a, z, t, _u in sorted(ts, key=lambda e: (e[0], e[1]), reverse=True):
                s = s[:a] + t + s[z:]
            esperado_l[k] = s
            if re.fullmatch(r"\s*(-|\d+\.)?\s*", s):
                fora.add(k)
        # a separadora de cada quadro tocado acompanha o cabeçalho esperado
        quadros = {eds_antes[l].linhas[k].bloco for k in list(trocas) + list(depois_de)
                   if eds_antes[l].linhas[k].tipo_bloco == "quadro"}
        for b in quadros:
            ks = [k for k, x in enumerate(eds_antes[l].linhas) if x.bloco == b]
            nc = _celulas(esperado_l[ks[0]])
            cel = esperado_l[ks[1]].strip().strip("|").split("|")
            if len(cel) != nc:
                esperado_l[ks[1]] = "|" + "|".join([cel[0]] * nc) + "|"
                dono.setdefault(ks[1], []).append(f"separadora do quadro do bloco {b}")
        esperado, origem = [], []
        for k, s in enumerate(esperado_l):
            if k not in fora:
                esperado.append(s)
                origem.append(k)
            for t in depois_de.get(k, []):
                esperado.append(t)
                origem.append(k)
        obtido = [x.vis for x in eds_depois[l].linhas]
        sm = difflib.SequenceMatcher(None, esperado, obtido, autojunk=False)
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op == "equal":
                continue
            prova["fora_das_unidades"].append({
                "lingua": l, "esperado": esperado[i1:i2], "obtido": obtido[j1:j2],
                "explicada_por": None})
        # e o diff simples, para o relatório: cada linha que muda e as unidades que a mudam
        sm = difflib.SequenceMatcher(None, antes, obtido, autojunk=False)
        mudadas = []
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op != "equal":
                mudadas.append({"antes": [(k + 1, dono.get(k)) for k in range(i1, i2)],
                                "linhas_depois": list(range(j1 + 1, j2 + 1))})
        prova.setdefault("linhas_mudadas", {})[l] = mudadas
        sem_dono = [k for m in mudadas for k, d in m["antes"] if not d]
        if sem_dono:
            prova["fora_das_unidades"].append({"lingua": l, "linhas_sem_unidade": sem_dono, "explicada_por": None})
        # (c) os algarismos à mão, só nas linhas mudadas do gabarito
        g_a = eds_antes[l].linhas_tpl
        g_d = textos_novos[l].splitlines()
        sm = difflib.SequenceMatcher(None, g_a, g_d, autojunk=False)
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op in ("replace", "insert"):
                for k in range(j1, j2):
                    resto = C._MARCA_RE.sub(" ", g_d[k])
                    resto = C._NAO_FIGURA_RE.sub(" ", resto)
                    resto = C._ENDERECO_RE.sub(" ", resto)
                    resto = C._ISO_RE.sub(" ", resto)
                    resto = C._ANO_RE.sub(" ", resto)
                    prova["algarismos"].append({"lingua": l, "linha_do_gabarito_novo": k + 1,
                                                "algarismos_a_mao": re.findall(r"\d+", resto)})
    return prova, eds_depois


# ---------------------------------------------------------------- correr --

def carregar_linhas_proprias(caminho: Path | None):
    if not caminho:
        return [], []
    dados = json.loads(caminho.read_text(encoding="utf-8"))
    cod = dados.get("codigo_provisorio", "16")
    linhas = [dict(x, _codigo=cod) for x in dados.get("linhas", [])]
    derivadas = [dict(x, _codigo=cod) for x in dados.get("derivadas", [])]
    return linhas + derivadas, dados


def fontes_com_linhas_proprias(pasta: Path, linhas_proprias):
    """A fonte de derivações do estudo, em memória, com as linhas próprias como derivações locais
    (o valor impresso em português é o `value`; o `_impresso` do motor troca a vírgula em inglês)."""
    if not linhas_proprias:
        return None
    ajustes = json.loads((pasta / "Technical Source" / "ajustes.json").read_text(encoding="utf-8"))
    cod = linhas_proprias[0]["_codigo"]
    claims = list(ajustes.get("derivadas", []))
    existentes = {c["id"] for c in claims}
    for lp in linhas_proprias:
        if lp["id"] in existentes:
            raise Recusa(f"a linha própria {lp['id']} colide com uma derivação de ajustes.json")
        if lp.get("impresso"):
            if lp["impresso"]["pt"] != lp["value"] or lp["impresso"]["en"] != lp["value"].replace(",", "."):
                raise Recusa(f"a linha própria {lp['id']}: a forma impressa não é a que o compositor daria ao valor")
        claims.append({"id": lp["id"], "value": lp["value"]})
    livro = {"claims": claims}
    return {cod: C.Fonte(cod, pasta.name, livro=livro, livro_sha256=C.sha_da_linha(livro), derivadas=True)}


def correr(motor, pasta_rel, lista_p, linhas_p=None, decisoes_p=None, com_propostas=False,
           saida=None, relatorio=None, escrever=False, lista_dados=None, silencioso=False):
    carregar_motor(Path(motor))
    pasta = Path(motor) / "content" / pasta_rel if not Path(pasta_rel).is_absolute() else Path(pasta_rel)
    dados = lista_dados if lista_dados is not None else json.loads(Path(lista_p).read_text(encoding="utf-8"))
    unidades = normalizar(dados)
    reg_decisoes = []
    if decisoes_p:
        aplicar_decisoes(unidades, json.loads(Path(decisoes_p).read_text(encoding="utf-8"))["decisoes"],
                         com_propostas, reg_decisoes)
    linhas_proprias, _ = carregar_linhas_proprias(Path(linhas_p) if linhas_p else None)
    eds, ne_por_lingua, res, textos_novos, montagem = {}, {}, [], {}, []
    for l in ("pt", "en"):
        g = pasta / "Technical Source" / f"documento.{l}.md.tmpl"
        eds[l] = Edicao(g.read_text(encoding="utf-8"), str(g), l)
        ne = Edicao_nova()
        for u in unidades:
            if u.linguas[l].atual is None and u.linguas[l].nova is None and u.acao not in ("apagar-bloco",):
                res.append({"unidade": u.id, "lingua": l, "acao": u.acao, "estado": "recusada",
                            "razao": "a lista não traz nem a frase atual nem a nova nesta língua"})
                continue
            aplicar_unidade(u, l, eds[l], ne, linhas_proprias, res)
        textos_novos[l], rec = montar(eds[l], ne)
        montagem += [f"{l}: {x}" for x in rec]
        ne_por_lingua[l] = ne
    fontes_16 = fontes_com_linhas_proprias(pasta, linhas_proprias)
    prova, eds_depois = provar(unidades, res, eds, textos_novos, fontes_16 or {}, ne_por_lingua)
    recusadas = [r for r in res if r["estado"] == "recusada"]
    falhas_prova = ([f for f in prova["frases"] if not f["ok"]]
                    + [f for f in prova["fora_das_unidades"] if not f["explicada_por"]]
                    + [a for a in prova["algarismos"] if a["algarismos_a_mao"]]
                    + [v for v in prova["composicao"].values() if v.startswith("RECUSA")])
    usadas = {n[2] for r in res for n in r.get("numeros", [])}
    sem_uso = [f"⟦{lp['_codigo']}:{lp['id']}⟧" for lp in linhas_proprias
               if lp.get("impresso") and f"⟦{lp['_codigo']}:{lp['id']}⟧" not in usadas]
    relat = {"lista": str(lista_p), "estudo": str(pasta), "com_propostas": com_propostas,
             "decisoes": reg_decisoes, "unidades": res, "montagem": montagem, "prova": prova,
             "linhas_proprias_sem_uso": sem_uso,
             "resumo": {"unidades": len(unidades),
                        "aplicacoes": sum(1 for r in res if r["estado"] in ("aplicada", "conferida (sem alteração)")),
                        "recusadas": len(recusadas), "montagem": len(montagem),
                        "falhas_da_prova": len(falhas_prova)}}
    ok = not recusadas and not montagem and not falhas_prova
    relat["resultado"] = "PROVADO" if ok else "RECUSADO"
    if saida:
        s = Path(saida)
        s.mkdir(parents=True, exist_ok=True)
        for l, t in textos_novos.items():
            (s / f"documento.{l}.md.tmpl").write_text(t, encoding="utf-8")
        for l, ed in eds_depois.items():
            (s / f"composto-depois.{l}.md").write_text(ed.comp.md, encoding="utf-8")
        for l, ed in eds.items():
            (s / f"composto-antes.{l}.md").write_text(ed.comp.md, encoding="utf-8")
    if relatorio:
        Path(relatorio).write_text(json.dumps(relat, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    if escrever:
        if not ok:
            raise Recusa("não se escreve: há recusas (ver o relatório)")
        for l, t in textos_novos.items():
            (pasta / "Technical Source" / f"documento.{l}.md.tmpl").write_text(t, encoding="utf-8")
    if not silencioso:
        r = relat["resumo"]
        print(f"APLICAR: {r['unidades']} unidade(s); {r['aplicacoes']} aplicação(ões) por língua; "
              f"{r['recusadas']} recusa(s); {r['montagem']} recusa(s) da montagem; {r['falhas_da_prova']} falha(s) da prova")
        for x in recusadas:
            print(f"  RECUSADA {x['unidade']} {x['lingua']}: {x['razao']}")
        for x in montagem:
            print(f"  MONTAGEM {x}")
        for x in falhas_prova:
            print(f"  PROVA {x}")
        print(f"APLICAR: {relat['resultado']}" + (" e ESCRITO" if escrever and ok else "; nada escrito no motor"))
    return relat


# ------------------------------------------------------- a ligação final --
#
# O PASSO ÚNICO PARA QUANDO A FORMA «LINHA PRÓPRIA» DO core/compor.py EXISTIR:
#
#   aplicar_lista.py <motor> <pasta> --ligar --linhas linhas-proprias-16.json --assercoes assercoes-16.json [--escrever]
#
# Escreve, no `ajustes.json` do estudo, as linhas próprias (pelo ADAPTADOR), a derivação (na forma de
# `derivadas` que já existe) e as asserções (na forma de `assertions` que já existe); se o adaptador o
# pedir, troca o código dos marcadores provisórios nos dois gabaritos e guarda as componentes não impressas
# como acervo (`@@linhas`). Faz tudo primeiro numa cópia da pasta, compõe-a com o core.compor (gabaritos,
# livro, decisões de figura) e corre o core.assertions sobre cada edição; só escreve na pasta verdadeira, com
# --escrever, se tudo isso passar. Repetir é seguro: uma entrada igual que já lá esteja não se duplica, e
# uma diferente com o mesmo identificador recusa.
#
# A LIGAÇÃO FINAL É TROCAR `adaptador_provisorio` PELO QUE O COMPOSITOR PEDIR (a chave do ajustes.json e os
# campos de cada linha), acertar CODIGO e COMPONENTES_POR_ACERVO, e correr. `--adaptador simulacao` é só um
# ensaio de hoje: escreve as linhas primárias como derivações que se recontam a si próprias, para provar o
# resto da cadeia (livro, derivação de 70,42, decisões, asserções); recusa escrever dentro do motor.

def adaptador_provisorio(lp: dict) -> tuple[str, dict]:
    """(chave do ajustes.json, linha) na forma que o mandato do compositor descreve: identificador, valor,
    endereço, data de acesso, excerto com documento e página, tipo de fonte, forma impressa por língua.
    PROVISÓRIO: trocar pela forma que o core/compor.py pedir."""
    linha = {"id": lp["id"], "value": lp["value"], "unit": lp.get("unit"),
             "source_url": lp["source_url"], "fetched_at": lp["fetched_at"], "source_type": lp["source_type"],
             "excerpt": lp["excerpt"],
             "documento": {"ficheiro": lp["documento"], "sha256": lp["documento_sha256"], "pagina": lp["pagina"],
                           "excerto": lp["excerto_da_fonte"]},
             "impresso": lp.get("impresso")}
    for k in ("alternates", "derivation", "nota"):
        if lp.get(k):
            linha[k] = lp[k]
    return "linhas_proprias", linha


def adaptador_simulacao(lp: dict) -> tuple[str, dict]:
    """Só para ensaio: uma linha primária como uma derivação que se reconta a si própria."""
    return "derivadas", {"id": lp["id"], "value": lp["value"], "unit": lp.get("unit"), "components": [lp["id"]],
                         "check": lp["value"].replace(" ", "").replace(",", "."),
                         "derivation_text": "SIMULAÇÃO: linha primária escrita como derivação, só para o ensaio",
                         "derivation": "SIMULAÇÃO", "source_url": lp["source_url"], "fetched_at": lp["fetched_at"],
                         "source_type": lp["source_type"], "excerpt": lp["excerpt"]}


ADAPTADORES = {
    "provisorio": {"linha": adaptador_provisorio, "codigo": "16", "componentes_por_acervo": True},
    "simulacao": {"linha": adaptador_simulacao, "codigo": "16", "componentes_por_acervo": True},
}


def _derivacao_na_forma_de_hoje(d: dict) -> dict:
    campos = ("id", "value", "unit", "components", "check", "derivation_text", "derivation",
              "source_url", "fetched_at", "source_type", "excerpt", "note")
    return {k: d[k] for k in campos if k in d}


def _juntar_entradas(lista_atual: list, novas: list, onde: str) -> tuple[list, int]:
    por_id = {x["id"]: x for x in lista_atual}
    acrescentadas = 0
    out = list(lista_atual)
    for n in novas:
        if n["id"] in por_id:
            if por_id[n["id"]] != n:
                raise Recusa(f"{onde}: {n['id']} já existe com outro conteúdo")
            continue
        out.append(n)
        acrescentadas += 1
    return out, acrescentadas


def ligar(motor, pasta_rel, linhas_p, assercoes_p=None, adaptador="provisorio", escrever=False):
    carregar_motor(Path(motor))
    from core import assertions as AS
    import shutil
    import tempfile
    pasta = Path(pasta_rel) if Path(pasta_rel).is_absolute() else Path(motor) / "content" / pasta_rel
    ad = ADAPTADORES[adaptador]
    if adaptador == "simulacao" and escrever and Path(motor).resolve() in pasta.resolve().parents:
        raise Recusa("a simulação nunca escreve dentro do motor")
    dados = json.loads(Path(linhas_p).read_text(encoding="utf-8"))
    cod_prov = dados.get("codigo_provisorio", "16")
    tecnico = pasta / "Technical Source"
    ajustes = json.loads((tecnico / "ajustes.json").read_text(encoding="utf-8"))
    por_chave: dict = {}
    for lp in dados["linhas"]:
        chave, linha = ad["linha"](lp)
        por_chave.setdefault(chave, []).append(linha)
    por_chave.setdefault("derivadas", []).extend(_derivacao_na_forma_de_hoje(d) for d in dados.get("derivadas", []))
    ids_novos = [x["id"] for v in por_chave.values() for x in v]
    if len(set(ids_novos)) != len(ids_novos):
        raise Recusa("identificadores repetidos nas linhas próprias")
    for chave in ajustes:
        if chave in por_chave or not isinstance(ajustes[chave], list):
            continue
        for x in ajustes[chave]:
            if isinstance(x, dict) and x.get("id") in ids_novos:
                raise Recusa(f"o identificador {x['id']} já existe em ajustes.json[{chave!r}]")
    resumo = []
    for chave, novas in por_chave.items():
        ajustes[chave], n = _juntar_entradas(ajustes.get(chave, []), novas, f"ajustes.json[{chave!r}]")
        resumo.append(f"{chave}: +{n}")
    if assercoes_p:
        rows = [e["assercao"] for e in json.loads(Path(assercoes_p).read_text(encoding="utf-8"))["assercoes"]]
        ajustes["assertions"], n = _juntar_entradas(ajustes.get("assertions", []), rows, "ajustes.json['assertions']")
        resumo.append(f"assertions: +{n}")
    textos = {}
    proprias = {lp["id"] for lp in dados["linhas"]} | {d["id"] for d in dados.get("derivadas", [])}
    componentes = sorted({c for d in dados.get("derivadas", []) for c in d["components"]}
                         & {lp["id"] for lp in dados["linhas"] if not lp.get("impresso")})
    for l in ("pt", "en"):
        t = (tecnico / f"documento.{l}.md.tmpl").read_text(encoding="utf-8")
        if ad["codigo"] != cod_prov:
            n = 0
            for rid in proprias:
                velho, novo = f"⟦{cod_prov}:{rid}⟧", f"⟦{ad['codigo']}:{rid}⟧"
                n += t.count(velho)
                t = t.replace(velho, novo)
            resumo.append(f"{l}: {n} marcador(es) com o código {ad['codigo']}")
        if ad["componentes_por_acervo"] and componentes:
            linha_acervo = "@@linhas " + " ".join(f"⟦{ad['codigo']}:{c}⟧" for c in componentes)
            if linha_acervo not in t.splitlines():
                ls = t.splitlines()
                k = next((i for i, x in enumerate(ls) if x.startswith("@@derivadas ")), None)
                if k is None:
                    raise Recusa(f"documento.{l}.md.tmpl: sem @@derivadas para pôr o acervo das componentes")
                ls.insert(k + 1, linha_acervo)
                t = "\n".join(ls) + ("\n" if t.endswith("\n") else "")
                resumo.append(f"{l}: acervo das componentes ({', '.join(componentes)})")
        textos[l] = t
    serial = json.dumps(ajustes, ensure_ascii=False, indent=1) + "\n"
    with tempfile.TemporaryDirectory(prefix="eva-ligar-") as tmp:
        copia = Path(tmp) / pasta.name
        (copia / "Technical Source").mkdir(parents=True)
        (copia / "Technical Source" / "ajustes.json").write_text(serial, encoding="utf-8")
        for l, t in textos.items():
            (copia / "Technical Source" / f"documento.{l}.md.tmpl").write_text(t, encoding="utf-8")
        try:
            fontes = {}
            comps = [C.compor(g, fontes) for g in sorted((copia / "Technical Source").glob("documento.??.md.tmpl"))]
            livro, prov = C.construir_livro(copia, comps, fontes)
            ds = {c.lingua: C.decisoes_de_figura(c, livro, prov, fontes, ajustes) for c in comps}
        except C.Recusa as exc:
            print("LIGAR: " + "; ".join(resumo))
            raise Recusa(f"o core.compor recusa a pasta ligada: {exc}") from exc
        lp_ = Path(tmp) / "ledger.json"
        lp_.write_text(json.dumps(livro, ensure_ascii=False), encoding="utf-8")
        portao = {}
        for c in comps:
            md = Path(tmp) / f"{c.lingua}.md"
            md.write_text(c.md, encoding="utf-8")
            import contextlib
            import io
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                codigo = AS.run(md, lp_)
            portao[c.lingua] = (codigo, [x for x in buf.getvalue().splitlines() if x.startswith(("UNDECLARED", "FAILED", "ASSERTIONS"))])
    print("LIGAR: " + "; ".join(resumo))
    print(f"LIGAR: core.compor compõe a pasta ligada: livro com {len(livro['claims'])} linha(s) e "
          f"{len(livro['assertions'])} asserção(ões); decisões " + ", ".join(f"{l} {d['contagem']['figuras']} figura(s)" for l, d in ds.items()))
    for l, (codigo, ls) in portao.items():
        print(f"LIGAR: core.assertions {l}: " + " | ".join(ls))
    if any(c != 0 for c, _ in portao.values()):
        raise Recusa("o core.assertions recusa a pasta ligada")
    if escrever:
        (tecnico / "ajustes.json").write_text(serial, encoding="utf-8")
        for l, t in textos.items():
            (tecnico / f"documento.{l}.md.tmpl").write_text(t, encoding="utf-8")
        print(f"LIGAR: ESCRITO em {tecnico}; a seguir: python3 -B -m core.compor \"{pasta}\" --escrever")
    else:
        print("LIGAR: ENSAIO, nada escrito")
    return 0


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("motor")
    p.add_argument("pasta")
    p.add_argument("lista", nargs="?")
    p.add_argument("--linhas")
    p.add_argument("--decisoes")
    p.add_argument("--com-propostas", action="store_true")
    p.add_argument("--saida")
    p.add_argument("--relatorio")
    p.add_argument("--escrever", action="store_true")
    p.add_argument("--ligar", action="store_true", help="o passo final: escrever as linhas próprias e as asserções no ajustes.json")
    p.add_argument("--assercoes")
    p.add_argument("--adaptador", default="provisorio", choices=sorted(ADAPTADORES))
    a = p.parse_args(argv)
    try:
        if a.ligar:
            if not a.linhas:
                raise Recusa("--ligar precisa de --linhas")
            return ligar(a.motor, a.pasta, a.linhas, a.assercoes, a.adaptador, a.escrever)
        if not a.lista:
            raise Recusa("falta a lista")
        r = correr(a.motor, a.pasta, a.lista, a.linhas, a.decisoes, a.com_propostas, a.saida, a.relatorio, a.escrever)
    except Recusa as exc:
        print(f"APLICAR: RECUSADO: {exc}")
        return 1
    return 0 if r["resultado"] == "PROVADO" else 1


if __name__ == "__main__":
    raise SystemExit(main())
