#!/usr/bin/env python3
"""A PLANTA NA CADEIA REAL, INTERROMPIDA A MEIO (bloco CI1, passagem CI1b, achado 12).
Lança `planta-na-cadeia-real.sh` num grupo de processos próprio, espera que o passo
esteja plantado no package.json e que o verify depois do build tenha lançado
conferências, manda um INT ao grupo inteiro (como um Ctrl-C num terminal), e confere
que o package.json e o dist/index.html voltaram aos bytes de antes (sha256). Escreve o
resultado no ficheiro dado. Uso, da raiz do sítio: python3 <este ficheiro> <saida.json>"""
import hashlib, json, os, signal, subprocess, sys, tempfile, time

saida = sys.argv[1]
sha = lambda f: hashlib.sha256(open(f, 'rb').read()).hexdigest()
antes = {'package.json': sha('package.json'), 'dist/index.html': sha('dist/index.html')}
destino = os.path.join(tempfile.mkdtemp(prefix='oedp-ci1-interrompida-'), 'planta.json')
aqui = os.path.dirname(os.path.abspath(__file__))
p = subprocess.Popen(['sh', os.path.join(aqui, 'planta-na-cadeia-real.sh'), destino],
                     start_new_session=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
plantado = lancadas = False
t0 = time.time()
while time.time() - t0 < 120 and p.poll() is None:
    if not plantado and 'oedp-ci1-planta-nova' in open('package.json', encoding='utf-8').read():
        plantado = True
    log = destino + '.log'
    if plantado and os.path.exists(log) and '▶ npm run check:alvos' in open(log, encoding='utf-8', errors='replace').read():
        lancadas = True
        break
    time.sleep(0.2)
pagina_plantada = 'As regras da casa estão no Método.' in open('dist/index.html', encoding='utf-8').read()
os.killpg(p.pid, signal.SIGINT)
try:
    codigo = p.wait(timeout=120)
except subprocess.TimeoutExpired:
    os.killpg(p.pid, signal.SIGKILL)
    codigo = p.wait()
time.sleep(1)
depois = {'package.json': sha('package.json'), 'dist/index.html': sha('dist/index.html')}
resultado = {
    'o_que': 'a planta na cadeia real interrompida com um INT ao grupo de processos, depois de o passo estar plantado no package.json, a frase em dist/index.html e as conferências lançadas; os dois ficheiros têm de voltar aos bytes de antes',
    'plantado_no_package_json_antes_do_sinal': plantado,
    'frase_plantada_na_pagina_antes_do_sinal': pagina_plantada,
    'conferencias_lancadas_antes_do_sinal': lancadas,
    'codigo_de_saida_da_planta': codigo,
    'antes': antes, 'depois': depois,
    'repostos': antes == depois,
}
resultado['mordeu'] = plantado and pagina_plantada and lancadas and resultado['repostos'] and codigo != 0
json.dump(resultado, open(saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
open(saida, 'a').write('\n')
print(json.dumps(resultado, ensure_ascii=False))
sys.exit(0 if resultado['mordeu'] else 1)
