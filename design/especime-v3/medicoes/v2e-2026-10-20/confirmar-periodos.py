"""Acrescenta a definição temporal do catálogo à partida, sem alterar os valores."""
import hashlib
import json
import sys
from pathlib import Path

motor = Path(sys.argv[1])
pasta = Path(__file__).parent
file = "content/26 Saude e Parcerias Efeitos/source/saude/sns-catalogo.json"
body = (motor / file).read_bytes()
catalogo = json.loads(body)
partida = json.loads((pasta / "partida.json").read_text())
for serie in partida["natureza_series"]:
    dataset = Path(serie["ficheiro"]).stem.removeprefix("sns-")
    ds = next(r for r in catalogo["results"] if r["dataset_id"] == dataset)
    temporal = ds["metas"]["dcat"]["temporal"]
    assert "valores acumulados" in temporal
    serie["natureza"] = "Acumulado desde janeiro, confirmado no campo metas.dcat.temporal do catálogo do próprio conjunto."
    serie["definicao_temporal"] = dict(ficheiro=file, sha256=hashlib.sha256(body).hexdigest(),
                                      dataset=dataset, campo="metas.dcat.temporal", excerto=temporal)
(pasta / "partida.json").write_text(json.dumps(partida, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"conjuntos_confirmados": len(partida["natureza_series"])}))
