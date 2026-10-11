"""Mede a sondagem e a preparação, sem copiar caminhos da máquina."""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--motor", type=Path, required=True)
    p.add_argument("--sonda", type=Path, required=True)
    a = p.parse_args()
    out = Path(__file__).parent
    fontes = {}
    for ficheiro in sorted(a.sonda.glob("*.json")):
        if ficheiro.name == "iniciativas-json":
            continue
        r = json.loads(ficheiro.read_text())
        if not isinstance(r, dict):
            continue
        fontes[ficheiro.stem] = {k: r.get(k) for k in
            ("url", "status", "bytes", "sha256", "segundos", "erro", "url_final", "redireccionamentos")}
        if "headers" in r:
            fontes[ficheiro.stem]["cabecalhos"] = r["headers"]
    bruto = a.sonda / "iniciativas-json"
    if bruto.exists():
        dados = json.loads(bruto.read_bytes())
        datas = [e["DataFase"] for d in dados for e in d.get("IniEventos") or []
                 if e.get("Fase") == "Entrada" and e.get("DataFase")]
        fontes["conteudo-iniciativas"] = {
            "bytes_descomprimidos": bruto.stat().st_size,
            "sha256_descomprimido": hashlib.sha256(bruto.read_bytes()).hexdigest(),
            "registos": len(dados), "ultima_entrada": max(datas),
            "entradas_desde_data_do_brief": sum(d >= "2026-10-07" for d in datas)}
    def git(*args):
        return subprocess.check_output(["git", "-C", str(a.motor), *args], text=True).strip()
    medicao = {"comando": "python3 <medicoes>/medir_inicial.py --motor <motor> --sonda <sonda>",
               "cabeca_motor": git("rev-parse", "HEAD"), "fontes": fontes,
               "ficheiros_protegidos": git("status", "--short", "--", "indicators/*.json",
                  "indicators/vintages.json", ".maintenance-locks/", "sweeps/",
                  "publisher/recortes/manifest.regioes.json"),
               "cliente": {"identidade": "core.http.CASA_UA", "condicionais": "HttpClient.condicional",
                   "arquivo": "indicators.arquivo.guardar", "indice": "indicators.arquivo.linha_de_captura",
                   "nota": "O cliente não aloja as respostas condicionais. O limite antigo rejeita depois de ler um bloco e não conta os bytes rejeitados."}}
    (out / "inicial.json").write_text(json.dumps(medicao, ensure_ascii=False, indent=2) + "\n")
    pdf = a.sonda / "dar-pdf"
    if pdf.exists():
        texto = subprocess.check_output(["pdftotext", "-layout", str(pdf), "-"], text=True)
        for numero, pagina in enumerate(texto.split("\f"), 1):
            m = re.search(r"((?:O Sr\.|A Sr\.ª) [^\n:]{1,180}\([^\n)]+\)):\s*—\s*(.*?)(?:\n\s*\n)", pagina, re.S)
            if m:
                prova = {"pdf_sha256": hashlib.sha256(pdf.read_bytes()).hexdigest(),
                         "pagina": numero, "autoria": m[1], "excerto": m[2][:300],
                         "metodo": "pdftotext -layout; página conferida visualmente por pdftoppm"}
                (out / "pdf-conferencia.json").write_text(json.dumps(prova, ensure_ascii=False, indent=2) + "\n")
                break


if __name__ == "__main__":
    main()
