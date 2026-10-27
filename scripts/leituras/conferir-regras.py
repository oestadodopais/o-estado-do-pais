#!/usr/bin/env python3
"""Prova que a página das regras reduzida conserva cada regra em vigor da versão anterior (27.10.2026, §1.207).

uso: conferir-regras.py <CLAUDE.md antigo> <CLAUDE.md novo> [--planta]
  O antigo lê-se de `git show main:CLAUDE.md` guardado num ficheiro. Confere: (1) cada regra numerada com cabeça a negrito
  do antigo tem a mesma cabeça no novo; (2) cada referência § (decisões), M (melhorias) e I (questões) do antigo está no
  novo; (3) cada frase dura da lista abaixo (os «nunca», os comandos, os números das regras) está no novo; (4) o novo não
  tem travessões nem caminhos da máquina, e cabe em 21 000 bytes (de 31 143 passou a cerca de 20 400: um terço a menos; o resto é texto de regra, e cortar mais era cortar regras). `--planta` retira uma regra do novo em memória e exige
  que a conferência a apanhe (o conhecido-positivo). Saída 0 se tudo passar; 1 com a lista do que falta.
"""
import re
import sys
import unicodedata

FRASES_DURAS = [
    'nunca `max`', 'git add -A', 'git add .', 'ff-only', 'nada vermelho chega a `main`', 'uma construção de cada vez',
    'cinco estragos plantados', 'cinco larguras', 'em inglês', 'acordo ortográfico', 'sem travessões', 'co-authored-by',
    'claude-session', 'git worktree remove', 'nunca força um `push`', 'privacidade_proibidos', 'oedp_gate=adiado',
    'core.gate', 'verify:deploy', 'vercel ls 2>&1', 'check:series', 'check:cruzamento --with-origin', 'setenta e cinco minutos',
    'cento e vinte chamadas', 'trinta minutos', 'cem chamadas', 'dois blocos de conteúdo por semana', 'oitenta por cento',
    'noventa por cento', 'menos de 10 pontos', 'zero blocking e zero major', 'cinco plantas em cinco', 'por confirmar na fonte',
    '[a verificar]', '[verify]', 'prometeu x, entregou y à data, gastou z', 'nenhum correio sem o «sim» dele', 'google doc',
    'nenhum nome dele em página nenhuma', '390, 768, 1 024, 1 280 e 1 600', 'indicators/vintages.json', '.maintenance-locks/',
    'manifest.regioes.json', '§6 da estrutura', '«casa» é habitação', 'ex2-1', 'sha256', 'pacote.sh', 'conferir-tudo.sh',
    'portoes.sh', 'sondar-modelo.sh', 'estado.py', 'uso.py', 'caixa-das-sugestoes.md', 'pendentes-do-diretor.md', 'visao.md',
    'politica-da-autonomia.md', 'issues.md', 'registo-de-melhorias.md', 'gargalos.md', 'mapa-do-repositorio-para-construtores.md',
    'conferir-mapa.py', 'estrutura-e-vocabulario-2026-09-17.md', 'revisao-maquinaria-', 'reposição gratuita', 'gpt-6-astra',
    'sol 6.1', 'opus 5.5', 'argon', '`agy`', '`leitor`', '`construtor`', 'nunca se escreve um número que não foi medido',
    'nunca se enfraquece', 'nunca `git checkout` na árvore principal', 'os ramos por aterrar nunca se apagam',
    'o sítio não se explica a si próprio', 'nada sobre a vida privada de ninguém, nem rumores', 'nunca a imagem',
    'nunca escritos à mão', 'nunca de memória', 'nunca durante', 'não relê', 'suspensos',
]


def normal(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9 ]+', ' ', s).strip()


def cabecas(texto):
    return [normal(c) for c in re.findall(r'^\d+\. \*\*(.+?)\*\*', texto, flags=re.M)]


def refs(texto):
    return set(re.findall(r'§1\.\d+', texto)) | set(re.findall(r'\bM\d{2,3}\b', texto)) | set(re.findall(r'\bI\d{3}\b', texto))


def conferir(antigo, novo):
    faltas = []
    novas = cabecas(novo)
    for c in cabecas(antigo):
        if c not in novas:
            faltas.append('cabeça de regra em falta: ' + c)
    for r in sorted(refs(antigo) - refs(novo)):
        faltas.append('referência em falta: ' + r)
    baixo = novo.lower()
    for f in FRASES_DURAS:
        if f.lower() not in baixo:
            faltas.append('frase dura em falta: ' + f)
    if '—' in novo:
        faltas.append('travessão no novo')
    if '/Users/' in novo:
        faltas.append('caminho da máquina no novo')
    if len(novo.encode()) > 21000:
        faltas.append(f'novo com {len(novo.encode())} bytes, acima de 21 000')
    return faltas


def main(argv):
    if len(argv) < 3:
        print(__doc__); return 2
    antigo = open(argv[1], encoding='utf-8').read()
    novo = open(argv[2], encoding='utf-8').read()
    if '--planta' in argv:
        mutilado = re.sub(r'^8\. \*\*Uma construção de cada vez na máquina\*\*.*\n', '', novo, flags=re.M)
        assert mutilado != novo, 'a planta não encontrou a regra 8 para retirar'
        if not conferir(antigo, mutilado):
            print('PLANTA NÃO MORDEU: a regra 8 retirada passou'); return 1
        print('planta: a regra 8 retirada foi apanhada')
    faltas = conferir(antigo, novo)
    print(f'regras com cabeça a negrito no antigo: {len(cabecas(antigo))}; no novo: {len(cabecas(novo))}; referências no antigo: {len(refs(antigo))}; frases duras: {len(FRASES_DURAS)}; novo: {len(novo.encode())} bytes')
    for f in faltas:
        print('FALTA ·', f)
    print('PASS: nenhuma regra em vigor se perdeu' if not faltas else f'FALHOU: {len(faltas)} faltas')
    return 1 if faltas else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
