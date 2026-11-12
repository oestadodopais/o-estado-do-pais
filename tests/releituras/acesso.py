"""CR3-A: expectativas literais e mutação da escolha no próprio guião."""
import importlib.util
from copy import deepcopy
from pathlib import Path

caminho = Path(__file__).resolve().parents[2] / "scripts/aplicar-releituras.py"
spec = importlib.util.spec_from_file_location("aplicar", caminho)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
# Caso fixo de teste, sem depender das revisões atualmente pendentes.
r = dict(id="ensaio-cr3-a", pedido={"quando": "2026-11-12T10:00:00Z"},
         verificacao_divergente_no_sitio={"date": "2026-11-09"},
         acesso_antigo="2026-10-26", valor_antigo="17,1", valor_novo="17,0",
         carimbo_anterior="2026-10-01", carimbo_novo="2026-10-29",
         coordenadas={"geo": "PT"}, bandeira_antiga="", bandeira_nova="",
         excerto_antigo="ensaio anterior", excerto_novo="ensaio revisto")
novo = {
    "reason": "O valor novo foi lido a 12.11.2026, depois de a comparação semanal com a fonte de 09.11.2026 ter visto a revisão; a leitura anterior, de 26.10.2026, é a do valor 17,1.",
    "reason_en": "The new value was read on 12.11.2026, after the weekly comparison with the source of 09.11.2026 had caught the revision; the earlier reading, of 26.10.2026, is that of the value 17,1.",
}
antigo = {
    "reason": "O valor novo foi lido a 12.11.2026, no dia da reconferência que viu a revisão; a leitura anterior, de 26.10.2026, é a do valor 17,1.",
    "reason_en": "The new value was read on 12.11.2026, the day of the check that caught the revision; the earlier reading, of 26.10.2026, is that of the value 17,1.",
}
plantas = 0

def recusa(acao, motivo):
    global plantas
    try:
        acao()
    except (AssertionError, SystemExit) as e:
        assert motivo in str(e), str(e)
        plantas += 1
    else:
        raise AssertionError("planta aceite: " + motivo)

codigo = caminho.read_text()
assert codigo.count("if dia != data_do_painel:") == 1
mutante = {"__file__": str(caminho), "__name__": "mutante"}
exec(compile(codigo.replace("if dia != data_do_painel:", "if dia == data_do_painel:"), "<guião mutado>", "exec"), mutante)
for comparacao, esperado in [("2026-11-09", novo), ("2026-11-12", antigo)]:
    caso = deepcopy(r)
    caso["verificacao_divergente_no_sitio"]["date"] = comparacao
    painel = m.data_pt(comparacao)
    acesso = m.razoes(caso, painel)[1]
    for campo, valor in {"date": "2026-11-12", "kind": "proveniencia", "field": "access_date",
                         "old_value": "2026-10-26", "new_value": "2026-11-12", **esperado}.items():
        assert acesso[campo] == valor, campo
    m.conferir_razao_acesso(acesso, caso)
    recusa(lambda: mutante["conferir_razao_acesso"](mutante["razoes"](caso, painel)[1], caso), "razão do acesso")
    for lingua in ("reason", "reason_en"):
        for data in ("12.11.2026", "26.10.2026", *(["09.11.2026"] if comparacao != "2026-11-12" else [])):
            errado = dict(acesso)
            errado[lingua] = errado[lingua].replace(data, "01.01.1900")
            recusa(lambda: m.conferir_razao_acesso(errado, caso), "razão do acesso")
anterior = deepcopy(r)
anterior["pedido"]["quando"] = "2026-11-08T10:00:00Z"
recusa(lambda: m.razoes(anterior, "09.11.2026"), "leitura anterior ao dia da comparação")
recusa(lambda: m.conferir_razao_acesso(novo, anterior), "leitura anterior ao dia da comparação")
assert plantas >= 14
print(f"CR3-A acesso: dois moldes literais nas duas línguas; {plantas} plantas recusadas.")
