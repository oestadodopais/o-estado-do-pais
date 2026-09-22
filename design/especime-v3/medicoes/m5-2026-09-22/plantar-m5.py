#!/usr/bin/env python3
"""As plantas do M5: cada célula nova recebe o estrago que ela tem de morder.

uso: python3 design/especime-v3/medicoes/m5-2026-09-22/plantar-m5.py   (na raiz)

A convenção é a de sempre (`MAPA-DO-REPOSITORIO`, §4): planta-se num ficheiro,
corre-se o portão sozinho, exige-se código diferente de zero COM A FALHA
ESPERADA e não com uma falha qualquer, repõem-se os bytes originais e confere-se
o sha256. Cada planta deixa a sua saída em `planta-<nome>.log` e uma entrada em
`plantas-m5.json` com `grupo`, `nome`, `ficheiro`, `comando`, `codigo`,
`mordida`, `passou`, `antes` e `reposto`.

O NOME DE QUEM RESPONDE não se escreve neste ficheiro: lê-se do oráculo
`scripts/textos-aprovados.json` no momento de plantar, que é o único sítio do
repositório onde ele mora desde 22.09.2026 (M5).

As oito plantas, e o que cada uma prova:

  1. um valor do `medidas.json` trocado · o `check:briefs` compara mesmo;
  2. um conhecido-positivo que não se encontra · o `check:briefs` não aceita um
     valor de um detetor cego, mesmo quando o valor não mudou;
  3. um número no §0 sem medição nomeada na sua frase · o `check:briefs` lê o §0
     frase a frase;
  4. um número CERTO ao lado do nome de OUTRA medição · a ligação é por frase e
     não uma procura no monte de todos os valores, que é o buraco que a leitura
     a frio de 22.09.2026 apontou no achado 4;
  5. um brief isento com um byte mudado · a isenção está presa pelo sha256, e
     emendar um brief antigo não passa em silêncio;
  6. um número num relatório sem ficheiro · o `conferir-relatorio.py` aponta-o;
  7. o nome numa cadeia de uma vista · o `gate:html` recusa o nome em `src/`;
  8. o nome numa página construída · o `gate:html` recusa o nome em `dist/`.
"""
import hashlib
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))))
AQUI = os.path.dirname(os.path.abspath(__file__))
NOME = json.load(open(os.path.join(RAIZ, 'scripts', 'textos-aprovados.json'),
                      encoding='utf-8'))['responsavel']


def sha(caminho):
    return hashlib.sha256(open(caminho, 'rb').read()).hexdigest()


def planta(grupo, nome, rel, estraga, comando, mordida):
    caminho = os.path.join(RAIZ, rel)
    antes = sha(caminho)
    original = open(caminho, encoding='utf-8').read()
    estragado = estraga(original)
    if estragado == original:
        raise SystemExit(f'planta «{nome}»: o estrago não mudou {rel}; a planta não vale nada.')
    open(caminho, 'w', encoding='utf-8').write(estragado)
    try:
        r = subprocess.run(comando, cwd=RAIZ, capture_output=True, text=True, timeout=1800)
        saida = r.stdout + r.stderr
        codigo = r.returncode
    finally:
        open(caminho, 'w', encoding='utf-8').write(original)
    reposto = sha(caminho)
    mordeu = bool(re.search(mordida, saida))
    passou = codigo != 0 and mordeu and antes == reposto
    with open(os.path.join(AQUI, f'planta-{nome}.log'), 'w', encoding='utf-8') as f:
        f.write(f'planta: {nome}\nficheiro: {rel}\ncomando: {" ".join(comando)}\n'
                f'código: {codigo}\nmordida esperada: {mordida}\nmordeu: {mordeu}\n'
                f'sha256 antes: {antes}\nsha256 reposto: {reposto}\n\n')
        f.write(saida)
    print(f'  {"✓" if passou else "✗"} {nome} · código {codigo} · mordeu {mordeu} · '
          f'bytes repostos {antes == reposto}')
    return {
        'grupo': grupo, 'nome': nome, 'ficheiro': rel, 'comando': ' '.join(comando),
        'codigo': codigo, 'mordida': mordida, 'mordeu': mordeu, 'passou': passou,
        'antes': antes, 'reposto': reposto,
    }


CHECK_BRIEFS = ['python3', 'scripts/check-briefs.py']
GATE_HTML = ['node', 'scripts/gate-html.mjs']
RELATORIO = 'design/especime-v3/medicoes/m5-2026-09-22/LEIA-ME.md'
CONFERIR = ['python3', 'scripts/leituras/conferir-relatorio.py', RELATORIO,
            'design/especime-v3/medicoes/m5-2026-09-22']


def main():
    # O índice da corrida anterior apaga-se antes de plantar, e não é higiene: o
    # `mordida` de cada entrada guarda o número plantado, e um índice velho na
    # pasta das medições punha esse número no monte contra o qual o
    # `conferir-relatorio.py` confere. A planta do número inventado deixava de
    # morder por causa do registo da própria planta (apanhado a 22.09.2026).
    velho = os.path.join(AQUI, 'plantas-m5.json')
    if os.path.isfile(velho):
        os.remove(velho)

    plantas = [
        planta(
            'o bloco medidas de um brief', 'valor-trocado',
            'design/observatorio/medidas/BRIEF-M5.json',
            lambda t: t.replace('"nome": "briefs_ate_22_09_2026",\n      "valor": 37,',
                                '"nome": "briefs_ate_22_09_2026",\n      "valor": 38,'),
            CHECK_BRIEFS,
            r'a medição «briefs_ate_22_09_2026» vale 37 hoje e o ficheiro diz 38'),
        planta(
            'o bloco medidas de um brief', 'conhecido-positivo-cego',
            'design/observatorio/medidas/BRIEF-M5.py',
            lambda t: t.replace("conta_o_nome(f'<p>{nome}</p>', nome) == 1",
                                "conta_o_nome('<p>uma linha sem ele</p>', nome) == 1"),
            CHECK_BRIEFS,
            r'conhecido-positivo da medição «ocorrencias_do_nome_de_quem_responde_em_src_e_public» '
            r'NÃO foi encontrado'),
        planta(
            'o bloco medidas de um brief', 'numero-do-zero-sem-medicao',
            'design/observatorio/BRIEF-M5-as-medicoes-provam-que-veem.md',
            lambda t: t.replace('O portão confere 1 brief',
                                'Ficaram 41 coisas por medir. O portão confere 1 brief'),
            CHECK_BRIEFS,
            r'escreve «41» e não nomeia medição nenhuma entre crases'),
        planta(
            'o bloco medidas de um brief', 'numero-certo-no-nome-errado',
            'design/observatorio/BRIEF-M5-as-medicoes-provam-que-veem.md',
            lambda t: t.replace('34 trazem uma secção de medições (`briefs_com_seccao_de_medicoes`)',
                                '34 trazem uma secção de medições (`briefs_isentos_por_data`)'),
            CHECK_BRIEFS,
            r'o §0 escreve «34» e esse número não é o valor de nenhuma das medições nomeadas na sua frase'),
        planta(
            'o bloco medidas de um brief', 'brief-isento-com-um-byte-mudado',
            'design/observatorio/BRIEF-F1.1-porta-da-frente.md',
            lambda t: t + '\n',
            CHECK_BRIEFS,
            r'BRIEF-F1\.1-porta-da-frente\.md: o brief mudou desde que foi isento'),
        planta(
            'os números de um relatório', 'numero-do-relatorio-sem-ficheiro',
            RELATORIO,
            lambda t: t.replace('## O que ficou feito',
                                '## O que ficou feito\n\nUma linha plantada com 314159 lá dentro.'),
            CONFERIR,
            r'«314159»'),
        planta(
            'o nome de quem responde', 'nome-numa-cadeia-de-uma-vista',
            'src/views/SobreView.astro',
            lambda t: t.replace('---\n', f"---\nconst plantaM5 = '{NOME}';\n", 1),
            GATE_HTML,
            r'escreve o nome de quem responde'),
        planta(
            'o nome de quem responde', 'nome-numa-pagina-construida',
            'dist/sobre/index.html',
            lambda t: t + f'\n<!-- {NOME} -->\n',
            GATE_HTML,
            r'rende o nome de quem responde'),
    ]
    saida = {
        'bloco': 'm5-2026-09-22',
        'cabeca': subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=RAIZ,
                                 capture_output=True, text=True).stdout.strip(),
        'plantas': plantas,
    }
    with open(os.path.join(AQUI, 'plantas-m5.json'), 'w', encoding='utf-8') as f:
        json.dump(saida, f, ensure_ascii=False, indent=2)
        f.write('\n')
    morderam = sum(1 for p in plantas if p['passou'])
    print(f'  {morderam} de {len(plantas)} plantas com código diferente de zero, a falha esperada '
          f'e os bytes repostos.')
    return 0 if morderam == len(plantas) else 1


if __name__ == '__main__':
    raise SystemExit(main())
