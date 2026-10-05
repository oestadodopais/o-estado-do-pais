#!/usr/bin/env python3
"""C2 (05.10.2026): as nove releituras do motor postas nas linhas do livro-razão, cada uma com a correção datada.

O modelo é a atualização da dívida das famílias da União (o C1c, `design/especime-v3/medicoes/c1-2026-09-28/c1c/
enquadramento.py`). Este guião:

1. lê a releitura do motor (`indicators/out/c2-2026-10-05/releitura/releitura.json`, na worktree do motor dada por
   `--motor`), confere o sha256 de cada corpo contra o registo dos pedidos e REFAZ cada leitura sobre o corpo pelas
   funções do motor (`reler.ler_celula`: a coordenada selada, o literal, a bandeira e o carimbo), e exige que dê o que
   o registo diz: o número que vai para a linha sai do corpo, nunca do registo nem da mão;
2. lê cada linha na cabeça presa do sítio (`git show <cabeça>:ledger/claims/<id>.yml`) e compõe a linha nova:
   - `value`, o valor novo na forma da casa, do literal do corpo; `excerpt`, o excerto novo, pela forma do excerto
     publicado; `access_date`, o dia UTC do pedido que leu o valor;
   - a bandeira: a da mesma célula; onde a fonte a deixou de pôr, saem as três chaves (`source_flag`,
     `source_flag_note`, `source_flag_note_en`), porque o livro recusa uma bandeira declarada que o excerto não traz;
   - três entradas novas em `corrections`, do dia da releitura, pela ordem do modelo: a `atualizacao` (o valor antigo,
     o novo, e a razão com os dois carimbos do conjunto e a data em que o painel viu a revisão), a `proveniencia` do
     `access_date` (a decisão de 28.09.2026: a atualização descreve o número, a proveniência o acesso) e a
     `proveniencia` do `excerpt` (a cadeia de cada campo, C1e: o excerto mudou porque a fonte mudou o que imprime);
   - `verifications` ficam como estão, com a «diverge» de 05.10.2026;
3. confere cada linha composta por uma função sua (`conferir_linha`), que as plantas provam que morde, e só com
   `--aplicar` escreve as linhas.

As razões são as frases do modelo, com as datas, os valores e a geografia desta releitura; nenhuma palavra que a
régua da voz recuse (a casa, limiar, conferido a, lido na fonte a).

O PASSO DO `published_at` (`--published-at`, a passagem C2-b, depois da leitura a frio do Astra). O ponto 1 do brief
pedia o `published_at` posto em dia pelo corpo, e a primeira entrega deixou-o ausente. O `ledger/README.md` diz que a
origem do campo é o carimbo que o próprio conjunto publica (`updated`, no Eurostat) e mais nada, e é o carimbo que a
releitura já leu. Este passo lê cada linha na cabeça do ramo (sem mudanças por commitar), refaz a leitura sobre o corpo
alojado (o sha256 conferido), toma o dia como o carimbo o escreve, no fuso do próprio carimbo, que é a regra do motor
para as linhas do Eurostat (`publisher/dominios_rp1.py`: `published_at=sobre["updated"][:10]`), e escreve ao lado o
dia UTC do mesmo instante, para o relatório dizer se coincidem. Põe o campo logo a seguir ao `access_date`, onde as
linhas que o têm o põem, e mais nada muda: a sua conferência recusa outro campo mudado, e as plantas provam-no. O
campo não é um campo de proveniência com história tipada (o `field` de uma entrada `proveniencia` não o admite) nem
uma entrada do valor, e por isso não leva entrada em `corrections` nem muda o registo selado das histórias.

uso (da raiz do sítio):
  python3 design/especime-v3/medicoes/c2-2026-10-05/aplicar-releituras.py --motor <worktree do motor> [--aplicar]
  python3 design/especime-v3/medicoes/c2-2026-10-05/aplicar-releituras.py --motor <worktree do motor> --published-at [--aplicar]
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import re
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yaml

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[3]
CABECA = "3a253f73"  # a cabeça presa do brief (o livro é o mesmo em 006685ae, que só acrescenta o brief)
RELEITURA = "indicators/out/c2-2026-10-05/releitura"
SAIDA = AQUI / "aplicacao.json"
SAIDA_DO_PUBLISHED_AT = AQUI / "aplicacao-published-at.json"


def sha(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def data_pt(iso: str) -> str:
    """AAAA-MM-DD (ou um carimbo ISO) em DD.MM.AAAA, pela data que o próprio carimbo escreve."""
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", iso)
    if not m:
        raise SystemExit(f"PARAGEM: data ilegível {iso!r}")
    return f"{m.group(3)}.{m.group(2)}.{m.group(1)}"


def selado(cid: str) -> str:
    return subprocess.check_output(["git", "-C", str(SITIO), "show", f"{CABECA}:ledger/claims/{cid}.yml"], text=True)


def campo(texto: str, nome: str, valor: str) -> str:
    """Troca a única linha de topo `nome: …`, na forma das linhas (`json.dumps`, como o C1c)."""
    linhas = texto.split("\n")
    onde = [i for i, l in enumerate(linhas) if l.startswith(f"{nome}: ")]
    if len(onde) != 1:
        raise SystemExit(f"PARAGEM: a linha tem {len(onde)} campos `{nome}:` de topo")
    linhas[onde[0]] = f"{nome}: {json.dumps(valor, ensure_ascii=False)}"
    return "\n".join(linhas)


def sem_bandeira(texto: str) -> str:
    """Tira as três chaves da bandeira, cada uma uma linha de topo, e as linhas vazias que ficam a mais no fim."""
    linhas = texto.split("\n")
    fora = [i for i, l in enumerate(linhas) if re.match(r"^source_flag(_note(_en)?)?: ", l)]
    if len(fora) != 3:
        raise SystemExit(f"PARAGEM: a linha tem {len(fora)} chaves da bandeira e não três")
    resto = [l for i, l in enumerate(linhas) if i not in fora]
    corpo = "\n".join(resto).rstrip("\n")
    return corpo + "\n"


def com_entradas(texto: str, entradas: list[dict]) -> str:
    """Acrescenta as entradas ao fim do bloco `corrections`, na forma das que lá estão (`yaml.safe_dump`)."""
    novo = yaml.safe_dump(entradas, allow_unicode=True, sort_keys=False, default_flow_style=False, width=120).rstrip("\n")
    linhas = texto.split("\n")
    onde = [i for i, l in enumerate(linhas) if l.startswith("corrections:")]
    if len(onde) != 1:
        raise SystemExit("PARAGEM: a linha não tem um só bloco `corrections:`")
    i = onde[0]
    if linhas[i].strip() == "corrections: []":
        linhas[i:i + 1] = ["corrections:", *novo.split("\n")]
        return "\n".join(linhas)
    fim = i + 1
    while fim < len(linhas) and linhas[fim].startswith((" ", "-", "\t")):
        fim += 1
    linhas[fim:fim] = novo.split("\n")
    return "\n".join(linhas)


def razoes(r: dict, data_do_painel: str) -> list[dict]:
    """As três entradas desta releitura, com as frases do modelo."""
    dia_iso = r["pedido"]["quando"][:10]
    dia = data_pt(dia_iso)
    nova, antiga = data_pt(r["carimbo_novo"]), data_pt(r["carimbo_anterior"])
    geo = r["coordenadas"].get("geo")
    de_quem, whose = {"PT": ("de Portugal", "Portugal's value"), "EU27_2020": ("da União", "the EU value")}[geo]
    atualizacao = {
        "date": dia_iso, "kind": "atualizacao", "old_value": r["valor_antigo"], "new_value": r["valor_novo"],
        "reason": (f"O Eurostat reviu o valor {de_quem} a {nova} (o carimbo do conjunto passou de {antiga} a {nova}); "
                   f"a reconferência semanal de {data_do_painel} viu a revisão."),
        "reason_en": (f"Eurostat revised {whose} on {nova} (the dataset stamp moved from {antiga} to {nova}); "
                      f"the weekly check of {data_do_painel} caught the revision."),
    }
    acesso = {
        "date": dia_iso, "kind": "proveniencia", "field": "access_date", "old_value": r["acesso_antigo"], "new_value": dia_iso,
        "reason": (f"O valor novo foi lido a {dia}, no dia da reconferência que viu a revisão; a leitura anterior, "
                   f"de {data_pt(r['acesso_antigo'])}, é a do valor {r['valor_antigo']}."),
        "reason_en": (f"The new value was read on {dia}, the day of the check that caught the revision; the earlier "
                      f"reading, of {data_pt(r['acesso_antigo'])}, is that of the value {r['valor_antigo']}."),
    }
    if r["bandeira_antiga"] == r["bandeira_nova"]:
        pt, en = "", ""
    elif r["bandeira_antiga"] == "p" and r["bandeira_nova"] == "":
        pt, en = ", e a fonte deixou de a marcar como provisória", ", and the source no longer marks it as provisional"
    else:
        raise SystemExit(f"PARAGEM: {r['id']}: a bandeira passou de {r['bandeira_antiga']!r} a {r['bandeira_nova']!r}, "
                         f"e este guião só sabe dizer a saída da marca «p»")
    excerto = {
        "date": dia_iso, "kind": "proveniencia", "field": "excerpt", "old_value": r["excerto_antigo"], "new_value": r["excerto_novo"],
        "reason": f"O excerto passa a transcrever o valor revisto que a fonte imprime na mesma observação, lida a {dia}{pt}.",
        "reason_en": f"The excerpt now transcribes the revised value the source prints for the same observation, read on {dia}{en}.",
    }
    return [atualizacao, acesso, excerto]


def conferir_linha(antes: dict, depois: dict, r: dict, entradas: list[dict]) -> None:
    """O que a linha nova tem de ser, e nada mais: levanta `AssertionError` com a razão."""
    novas = depois["corrections"][len(antes["corrections"]):]
    assert depois["corrections"][: len(antes["corrections"])] == antes["corrections"], "uma correção antiga mudou"
    at = [c for c in novas if c["kind"] == "atualizacao"]
    assert len(at) == 1 and at[0]["old_value"] == antes["value"] and at[0]["new_value"] == depois["value"], \
        "o valor novo exige a atualização tipada do valor antigo para o novo"
    ac = [c for c in novas if c["kind"] == "proveniencia" and c.get("field") == "access_date"]
    assert len(ac) == 1 and ac[0]["old_value"] == antes["access_date"] and ac[0]["new_value"] == depois["access_date"], \
        "o acesso novo exige a proveniência do acesso"
    ex = [c for c in novas if c["kind"] == "proveniencia" and c.get("field") == "excerpt"]
    assert len(ex) == 1 and ex[0]["old_value"] == antes["excerpt"] and ex[0]["new_value"] == depois["excerpt"], \
        "o excerto novo exige a proveniência do excerto"
    assert depois["value"] == r["valor_novo"] and depois["excerpt"] == r["excerto_novo"], "o valor ou o excerto não são os do corpo"
    assert (depois.get("source_flag") or "") == r["bandeira_nova"], "a bandeira não é a da célula"
    if r["bandeira_nova"]:
        assert depois["excerpt"].endswith(" " + r["bandeira_nova"]), "a bandeira declarada não está no fim do excerto"
    else:
        assert not any(k in depois for k in ("source_flag", "source_flag_note", "source_flag_note_en")), \
            "a fonte deixou de pôr a bandeira e a linha ainda a declara"
    assert depois["verifications"] == antes["verifications"], "as reconferências mudaram"
    mudados = {k for k in set(antes) | set(depois) if antes.get(k) != depois.get(k)}
    permitidos = {"value", "excerpt", "access_date", "corrections", "source_flag", "source_flag_note", "source_flag_note_en"}
    assert mudados <= permitidos, f"mudou um campo fora do mandato: {sorted(mudados - permitidos)}"
    assert novas == entradas, "as entradas novas não são as três desta releitura"


def dia_publicado(carimbo: str) -> dict:
    """O dia do `published_at`, do carimbo `updated` do conjunto: o dia como o carimbo o escreve, no fuso do próprio
    carimbo (a regra do motor, `updated[:10]`), e o dia UTC do mesmo instante, ao lado."""
    m = re.fullmatch(r"(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}([+-]\d{4}|Z)", carimbo or "")
    if not m:
        raise SystemExit(f"PARAGEM: carimbo ilegível {carimbo!r}")
    instante = datetime.strptime(carimbo.replace("Z", "+0000"), "%Y-%m-%dT%H:%M:%S%z")
    utc = instante.astimezone(timezone.utc)
    return {"carimbo": carimbo, "dia": m.group(1), "fuso": m.group(2), "instante_utc": utc.isoformat(timespec="seconds"),
            "dia_utc": utc.date().isoformat(), "coincidem": m.group(1) == utc.date().isoformat()}


def com_published_at(texto: str, dia: str) -> str:
    """Põe `published_at: "<dia>"` logo a seguir ao `access_date`, na forma das linhas (`json.dumps`)."""
    linhas = texto.split("\n")
    if any(l.startswith("published_at: ") for l in linhas):
        raise SystemExit("PARAGEM: a linha já tem published_at; este passo não o reescreve")
    onde = [i for i, l in enumerate(linhas) if l.startswith("access_date: ")]
    if len(onde) != 1:
        raise SystemExit(f"PARAGEM: a linha tem {len(onde)} campos access_date de topo")
    linhas.insert(onde[0] + 1, f"published_at: {json.dumps(dia)}")
    return "\n".join(linhas)


def conferir_published_at(antes: dict, depois: dict, dia: str, hoje: str) -> None:
    """O que a linha tem de ser depois do passo, pela ordem da regra 21 do `ledger/README.md`, e nada mais."""
    v = str(depois.get("published_at"))
    assert re.fullmatch(r"\d{4}-\d{2}-\d{2}", v), "o published_at não é AAAA-MM-DD"
    try:
        datetime.strptime(v, "%Y-%m-%d")
    except ValueError:
        raise AssertionError("o published_at não é um dia que existe")
    assert v <= hoje, "o published_at é posterior ao dia de hoje (UTC)"
    assert v == dia, "o published_at não é o dia do carimbo do corpo"
    mudados = {k for k in set(antes) | set(depois) if antes.get(k) != depois.get(k)}
    assert mudados == {"published_at"}, f"mudou um campo fora do published_at: {sorted(mudados - {'published_at'})}"


def passo_do_published_at(args, reg: dict, reler, pasta: Path) -> int:
    """O passo `--published-at`: ver o cabeçalho do guião."""
    pedidos = {p["url"]: p for p in reg["pedidos"]}
    hoje = datetime.now(timezone.utc).date().isoformat()
    cabeca = subprocess.check_output(["git", "-C", str(SITIO), "rev-parse", "HEAD"], text=True).strip()
    resultado, plantas = [], []
    for r in reg["linhas"]:
        cid = r["id"]
        p = pedidos[r["url"]]
        corpo = (pasta / p["ficheiro"]).read_bytes()
        assert sha(corpo) == p["sha256"] == r["pedido"]["sha256"], f"{cid}: o corpo não tem o sha256 do registo"
        na_cabeca = subprocess.check_output(["git", "-C", str(SITIO), "show", f"HEAD:ledger/claims/{cid}.yml"], text=True)
        antes = yaml.safe_load(na_cabeca)
        # A LEITURA REFEITA SOBRE O CORPO, e o carimbo dela, que tem de ser o do registo da releitura.
        leitura = reler.ler_celula(corpo.decode("utf-8"), r["url"], antes)
        assert leitura["carimbo"] == r["carimbo_novo"], f"{cid}: o corpo refeito dá o carimbo {leitura['carimbo']!r}"
        d = dia_publicado(leitura["carimbo"])
        novo = com_published_at(na_cabeca, d["dia"])
        depois = yaml.safe_load(novo)
        conferir_published_at(antes, depois, d["dia"], hoje)
        amanha = (datetime.strptime(hoje, "%Y-%m-%d") + timedelta(days=1)).date().isoformat()
        for nome, estraga, razao in (
            ("o dia do acesso no lugar do do carimbo", lambda c: c.update(published_at=c["access_date"]), "não é o dia do carimbo"),
            ("a forma da casa no lugar de AAAA-MM-DD", lambda c: c.update(published_at=data_pt(d["dia"])), "AAAA-MM-DD"),
            ("um dia que não existe", lambda c: c.update(published_at="2026-02-31"), "não é um dia que existe"),
            ("um dia depois de hoje", lambda c: c.update(published_at=amanha), "posterior ao dia de hoje"),
            ("o campo tirado", lambda c: c.pop("published_at"), "AAAA-MM-DD"),
            ("outro campo mudado", lambda c: c.update(value="0"), "fora do published_at"),
        ):
            copia = json.loads(json.dumps(depois, default=str))
            estraga(copia)
            try:
                conferir_published_at(antes, copia, d["dia"], hoje)
            except AssertionError as e:
                plantas.append({"linha": cid, "planta": nome, "mordeu": razao in str(e), "razao": str(e)})
            else:
                plantas.append({"linha": cid, "planta": nome, "mordeu": False, "razao": None})
        aplicada = False
        if args.aplicar:
            destino = SITIO / "ledger" / "claims" / f"{cid}.yml"
            atual = destino.read_text(encoding="utf-8")
            if atual not in (na_cabeca, novo):
                raise SystemExit(f"PARAGEM: {cid} tem mudanças por commitar que não são este passo; não se sobrepõe")
            destino.write_text(novo, encoding="utf-8")
            aplicada = destino.read_text(encoding="utf-8") == novo
        resultado.append({"id": cid, **d, "published_at": d["dia"], "antes_sha256": sha(na_cabeca.encode("utf-8")),
                          "depois_sha256": sha(novo.encode("utf-8")), "aplicada": aplicada})
    saida = {
        "_": "Escrito por design/especime-v3/medicoes/c2-2026-10-05/aplicar-releituras.py --published-at. Não se edita à mão.",
        "cabeca_lida": cabeca, "hoje_utc": hoje, "regra_do_dia": "o dia como o carimbo do conjunto o escreve, no fuso do carimbo (updated[:10]), como publisher/dominios_rp1.py",
        "linhas": resultado, "plantas": plantas,
        "contagens": {
            "linhas": len(resultado), "aplicadas": sum(1 for x in resultado if x["aplicada"]),
            "dias_iguais_ao_dia_utc": sum(1 for x in resultado if x["coincidem"]),
            "com_o_dia_2026_10_02": sum(1 for x in resultado if x["dia"] == "2026-10-02"),
            "com_o_dia_2026_09_29": sum(1 for x in resultado if x["dia"] == "2026-09-29"),
            "plantas": len(plantas), "plantas_que_morderam": sum(1 for x in plantas if x["mordeu"]),
        },
    }
    SAIDA_DO_PUBLISHED_AT.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(saida["contagens"], ensure_ascii=False))
    return 0 if saida["contagens"]["plantas_que_morderam"] == len(plantas) else 1


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--motor", type=Path, required=True)
    ap.add_argument("--aplicar", action="store_true")
    ap.add_argument("--published-at", action="store_true", help="o passo do published_at (a passagem C2-b)")
    args = ap.parse_args()
    motor = args.motor.expanduser().resolve()
    pasta = motor / RELEITURA
    reg = json.loads((pasta / "releitura.json").read_text(encoding="utf-8"))
    if not reg["cabeca_do_sitio"].startswith(subprocess.check_output(["git", "-C", str(SITIO), "rev-parse", CABECA], text=True).strip()[:8]):
        raise SystemExit("PARAGEM: a releitura leu outra cabeça do sítio")
    if reg["paragens"]:
        raise SystemExit(f"PARAGEM: a releitura parou em {len(reg['paragens'])} linha(s)")
    # O leitor do motor, carregado do ficheiro (a pasta tem hífenes e não é um pacote).
    sys.path.insert(0, str(motor))
    spec = importlib.util.spec_from_file_location("reler_c2", motor / "indicators/out/c2-2026-10-05/reler.py")
    reler = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reler)
    if args.published_at:
        return passo_do_published_at(args, reg, reler, pasta)

    pedidos = {p["url"]: p for p in reg["pedidos"]}
    resultado, plantas = [], []
    for r in reg["linhas"]:
        cid = r["id"]
        p = pedidos[r["url"]]
        corpo = (pasta / p["ficheiro"]).read_bytes()
        assert sha(corpo) == p["sha256"] == r["pedido"]["sha256"], f"{cid}: o corpo não tem o sha256 do registo"
        texto = selado(cid)
        antes = yaml.safe_load(texto)
        assert sha(texto.encode("utf-8")) == r["linha_sha256_na_cabeca"], f"{cid}: a linha na cabeça não é a que o motor leu"
        # A LEITURA REFEITA SOBRE O CORPO, pelas funções do motor, e confrontada com o registo.
        leitura = reler.ler_celula(corpo.decode("utf-8"), r["url"], antes)
        refeito = {"literal_novo": leitura["literal"], "bandeira_nova": leitura["bandeira"], "carimbo_novo": leitura["carimbo"],
                   "valor_novo": reler.forma_da_casa(leitura["literal"]),
                   "excerto_novo": reler.excerto_composto(leitura, reler.dimensoes_publicadas(antes["excerpt"], leitura["recorte"]),
                                                          leitura["literal"], leitura["bandeira"])}
        for k, v in refeito.items():
            assert v == r[k], f"{cid}: o corpo refeito dá {k} = {v!r} e o registo diz {r[k]!r}"
        divergente = r["verificacao_divergente_no_sitio"]
        assert divergente and divergente["date"] == "2026-10-05" and r["found_igual_ao_literal_novo"], f"{cid}: sem a «diverge» de 05.10"
        entradas = razoes(r, data_pt(divergente["date"]))
        novo = campo(texto, "value", r["valor_novo"])
        novo = campo(novo, "excerpt", r["excerto_novo"])
        novo = campo(novo, "access_date", r["pedido"]["quando"][:10])
        if r["bandeira_antiga"] and not r["bandeira_nova"]:
            novo = sem_bandeira(novo)
        novo = com_entradas(novo, entradas)
        if texto.endswith("\n") and not novo.endswith("\n"):
            novo += "\n"
        depois = yaml.safe_load(novo)
        conferir_linha(antes, depois, r, entradas)
        # AS PLANTAS DA FUNÇÃO: cada estrago numa cópia da linha nova tem de ser recusado com a sua razão.
        for nome, estraga, razao in (
            ("atualização retirada", lambda c: c.update(corrections=[x for x in c["corrections"] if x["kind"] != "atualizacao"]), "exige a atualização"),
            ("valor antigo inventado", lambda c: c["corrections"][len(antes["corrections"])].update(old_value="0"), "exige a atualização"),
            ("valor novo diferente do da linha", lambda c: c.update(value="0"), "exige a atualização"),
            ("proveniência do acesso retirada", lambda c: c.update(corrections=[x for x in c["corrections"] if x.get("field") != "access_date" or x["date"] != entradas[1]["date"]]), "proveniência do acesso"),
            ("proveniência do excerto retirada", lambda c: c.update(corrections=[x for x in c["corrections"] if x.get("field") != "excerpt" or x["date"] != entradas[2]["date"]]), "proveniência do excerto"),
            ("reconferência apagada", lambda c: c.update(verifications=c["verifications"][:-1]), "reconferências mudaram"),
            ("bandeira declarada fora da célula", lambda c: c.update(source_flag="x"), "bandeira"),
            ("nota mudada", lambda c: c.update(note="outra"), "fora do mandato"),
        ):
            copia = json.loads(json.dumps(depois))
            estraga(copia)
            try:
                conferir_linha(antes, copia, r, entradas)
            except AssertionError as e:
                plantas.append({"linha": cid, "planta": nome, "mordeu": razao in str(e), "razao": str(e)})
            else:
                plantas.append({"linha": cid, "planta": nome, "mordeu": False, "razao": None})
        resultado.append({
            "id": cid, "antes_sha256": sha(texto.encode("utf-8")), "depois_sha256": sha(novo.encode("utf-8")),
            "valor_antigo": antes["value"], "valor_novo": depois["value"],
            "acesso_antigo": antes["access_date"], "acesso_novo": depois["access_date"],
            "bandeira_antiga": antes.get("source_flag") or "", "bandeira_nova": depois.get("source_flag") or "",
            "carimbo_anterior": r["carimbo_anterior"], "carimbo_novo": r["carimbo_novo"],
            "entradas_novas": entradas, "correcoes_antes": len(antes["corrections"]), "correcoes_depois": len(depois["corrections"]),
            "reconferencias": len(depois["verifications"]),
            "aplicada": False,
        })
        if args.aplicar:
            destino = SITIO / "ledger" / "claims" / f"{cid}.yml"
            atual = destino.read_text(encoding="utf-8")
            if atual not in (texto, novo):
                raise SystemExit(f"PARAGEM: {cid} mudou na árvore depois da cabeça presa; não se sobrepõe")
            destino.write_text(novo, encoding="utf-8")
            resultado[-1]["aplicada"] = (SITIO / "ledger" / "claims" / f"{cid}.yml").read_text(encoding="utf-8") == novo
    saida = {
        "_": "Escrito por design/especime-v3/medicoes/c2-2026-10-05/aplicar-releituras.py. Não se edita à mão.",
        "cabeca_presa": CABECA, "releitura_do_motor": RELEITURA + "/releitura.json",
        "releitura_quando": reg["quando"], "releitura_cabeca_do_motor": reg["cabeca_do_motor"],
        "linhas": resultado,
        "plantas": plantas,
        "contagens": {
            "linhas": len(resultado), "aplicadas": sum(1 for x in resultado if x["aplicada"]),
            "entradas_novas": sum(len(x["entradas_novas"]) for x in resultado),
            "atualizacoes_novas": sum(1 for x in resultado for e in x["entradas_novas"] if e["kind"] == "atualizacao"),
            "bandeiras_que_sairam": sum(1 for x in resultado if x["bandeira_antiga"] and not x["bandeira_nova"]),
            "plantas": len(plantas), "plantas_que_morderam": sum(1 for p in plantas if p["mordeu"]),
        },
    }
    SAIDA.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(saida["contagens"], ensure_ascii=False))
    return 0 if saida["contagens"]["plantas_que_morderam"] == len(plantas) else 1


if __name__ == "__main__":
    sys.exit(main())
