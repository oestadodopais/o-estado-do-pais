#!/usr/bin/env python3
"""C2-b: varre as duas pastas de provas do bloco com o detetor de caminhos da casa (tem_caminho, do medir-c1.py do C1),
antes do commit das provas, e escreve o resultado em varrer-caminhos.json, ao lado.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/c2-2026-10-05/varrer-caminhos.py

Os conhecidos-positivos fazem-se aqui, em memória, com os caminhos desta máquina lidos no momento (a casa, o nome do
utilizador, a pasta temporária, o autor do Git, a worktree); nenhum fica escrito neste ficheiro nem na saída, que só
traz nomes relativos à raiz do sítio e contagens. Sai a 0 só se os 5 conhecidos-positivos forem apontados, o negativo
com as marcas da casa não for, e nenhum ficheiro das duas pastas tiver caminho.
"""
import importlib.util
import json
import os
import pathlib
import subprocess
import sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
spec = importlib.util.spec_from_file_location("medir_c1", RAIZ / "design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py")
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
casa = str(pathlib.Path.home())
autor = subprocess.check_output(["git", "config", "user.name"], cwd=RAIZ).decode().strip()
kps = {
    "a casa": (casa + "/x/y.txt").encode(),
    "o nome do utilizador": ("ficheiro de " + os.path.basename(casa)).encode(),
    "a pasta temporária": ("escrito em " + "/" + "private" + "/" + "tmp" + "/abc/def.log").encode(),
    "o autor do Git": ("feito por " + autor).encode(),
    "a worktree": (str(RAIZ) + "/a.json").encode(),
}
kp = {k: m.tem_caminho(v) for k, v in kps.items()}
negativo = m.tem_caminho("<worktree do sítio>/design/x.json, <casa>/y, <pasta temporária>/z e #!/usr/bin/env python3".encode())
pastas = ["design/especime-v3/medicoes/c2-2026-10-05", "design/especime-v3/capturas/c2-2026-10-05"]
total, achados = 0, []
for pasta in pastas:
    for p in sorted((RAIZ / pasta).rglob("*")):
        if p.is_file():
            total += 1
            if m.tem_caminho(p.read_bytes()):
                achados.append(str(p.relative_to(RAIZ)))
ok = all(kp.values()) and not negativo and not achados
saida = {"pastas": pastas, "conhecidos_positivos_apontados": kp, "negativo_com_as_marcas_apontado": negativo,
         "ficheiros_varridos": total, "ficheiros_com_caminho": achados, "passou": ok}
(AQUI / "varrer-caminhos.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"varrer-caminhos: {total} ficheiros, {len(achados)} com caminho, {sum(kp.values())} de {len(kp)} conhecidos-positivos apontados")
sys.exit(0 if ok else 1)
