#!/usr/bin/env python3
"""Confere os ficheiros do bloco com o detetor de caminhos e nomes da casa."""
import importlib.util, json, pathlib, subprocess, sys
sys.dont_write_bytecode = True
R = pathlib.Path.cwd()
O = pathlib.Path(__file__).resolve().parent
BASE = '61519cea8c93badd0a049b8993790e4dfec46637'
spec = importlib.util.spec_from_file_location('detetor', R/'design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py')
detetor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(detetor)
git = lambda *args: subprocess.check_output(['git', *args], text=True).splitlines()
nomes = set(git('diff', '--name-only', BASE, '--'))
nomes.update(git('ls-files', '--others', '--exclude-standard'))
ficheiros = sorted(n for n in nomes if (R/n).is_file())
positivos = [detetor.tem_caminho(c) for c in detetor.proibidos()]
assert positivos and all(positivos)
assert not detetor.tem_caminho(b'Uma frase sem nome nem caminho.')
achados = [n for n in ficheiros if detetor.tem_caminho((R/n).read_bytes())]
saida = {'comando':'python3 design/especime-v3/medicoes/rp4-2026-10-04/conferir-higiene.py',
         'ficheiros':len(ficheiros), 'quantidade':len(achados), 'achados':achados,
         'conhecido_positivo':{'classes_detetadas':positivos,'frase_limpa_sem_achado':True}}
(O/'higiene.json').write_text(json.dumps(saida,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(saida,ensure_ascii=False))
sys.exit(bool(achados))
