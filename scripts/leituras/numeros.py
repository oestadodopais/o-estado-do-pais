#!/usr/bin/env python3
"""Os números de um texto português, e os números de um ficheiro JSON.

Um só leitor, partilhado por `scripts/leituras/conferir-relatorio.py` (os números
de um relatório de construtor) e por `scripts/check-briefs.py` (os números do §0
de um brief). Vive aqui para que as duas conferências contem a mesma coisa: duas
extrações diferentes davam duas verdades para a mesma frase.

O QUE É UM NÚMERO, PARA ESTE LEITOR. Um inteiro ou um decimal escrito na
convenção portuguesa: o separador dos milhares é um espaço (normal, insecável ou
insecável estreito) e o decimal é a vírgula. «2 975», «8,7», «30» e «100» são
números. O ponto NÃO é separador decimal nem de milhares aqui, porque no
repositório o ponto separa secções («§1.120») e versões («22.23.1»); um número
escrito «1.500» não se confere, e isso está dito na saída como limite.

O QUE NÃO É UM NÚMERO, E POR ISSO SE APAGA ANTES DE CONTAR. Cada classe apaga-se
substituindo os seus caracteres por espaços, para que as posições não andem, e
cada classe é contada à parte e dita na saída: nada sai em silêncio.

  · código: os blocos cercados por ``` e os trechos entre crases;
  · endereços: tudo o que comece por `http://`, `https://` ou `www.`;
  · secções: `§` seguido de algarismos e pontos;
  · datas e horas: `dd.mm.aaaa`, `aaaa-mm-dd`, carimbos ISO, `hh:mm[:ss]`,
    `dd.mm` e `dd/mm/aaaa`;
  · resumos: uma corrida de sete ou mais algarismos e letras de `a` a `f` com
    pelo menos um de cada (um sha256, um commit);
  · ordinais e artigos de lei: `50.º`, `1.ª`, `n.º 2`;
  · identificadores: um sinal que mistura letras e algarismos («B1c», «I129»,
    «K13», «F1.10», «gpt-5.6-sol», «b1c-2026-09-22»), porque o algarismo lá
    dentro nomeia e não conta. Uma unidade colada a um número («12px», «8%»)
    NÃO é identificador: a unidade descola-se antes desta passagem;
  · anos isolados: um número de quatro algarismos entre 1900 e 2100 sozinho.
    É um limite conhecido e está dito: uma contagem que por acaso caia nesse
    intervalo não se confere, e sai na linha «anos» da saída.

Depois de tudo isto apagado, o que sobra conta-se, uma vez por ocorrência, com a
linha e o contexto de cada um que não se encontre.

COMO SE COMPARA COM UM JSON. De cada ficheiro tiram-se duas coisas: os valores
numéricos da árvore e os números escritos dentro das cadeias. Um número do texto
existe no JSON se a sua forma normalizada (sem separadores de milhares, com
ponto decimal) estiver entre as formas do JSON, ou se o seu valor for igual a um
dos valores do JSON.
"""
import json
import re
import unicodedata

ESPACOS_DE_MILHAR = '    '

_RE_CERCA = re.compile(r'```.*?```', re.S)
_RE_CRASE = re.compile(r'`[^`\n]*`')
_RE_URL = re.compile(r'(?:https?://|www\.)\S+')
_RE_SECCAO = re.compile(r'§\s?[\d.]+[a-z]*')
_RE_ISO = re.compile(r'\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?Z?)?')
_RE_DATA_PT = re.compile(r'\d{1,2}\.\d{2}(?:\.\d{4})?')
_RE_DATA_BARRA = re.compile(r'\d{1,2}/\d{1,2}(?:/\d{2,4})?')
_RE_HORA = re.compile(r'\d{1,2}:\d{2}(?::\d{2})?')
_RE_RESUMO = re.compile(
    r'(?<![0-9a-zA-Z])(?=[0-9a-f]{7,})(?=[0-9a-f]*[a-f])(?=[0-9a-f]*[0-9])[0-9a-f]{7,}(?![0-9a-zA-Z])')
_RE_ORDINAL = re.compile(r'\d+\.?\s?[ºª]')
_RE_ARTIGO = re.compile(r'(?:n\.?\s?[ºo]|art(?:igo)?s?\.?)\s?\d+', re.I)
_RE_IDENT = re.compile(r'[^\W\d_][\w.\-]*\d[\w.\-]*|\d[\w.\-]*[^\W\d_][\w.\-]*', re.U)
_RE_ANO = re.compile(r'(?<![\d.,])(19\d{2}|20\d{2}|2100)(?![\d.,])')

# Uma unidade colada ao número descola-se (as letras passam a espaços) para que a
# passagem dos identificadores não engula «12px» como se fosse um sinal.
_RE_UNIDADE = re.compile(
    r'(?<=\d)(px|pt|ms|s|h|min|KiB|MiB|GiB|kB|MB|GB|%)(?![\w])')

_RE_NUMERO = re.compile(
    r'(?<![\d.,])'
    r'(\d{1,3}(?:[' + ESPACOS_DE_MILHAR + r']\d{3})+(?:,\d+)?|\d+(?:,\d+)?)'
    r'(?![,.]?\d)'
)
_RE_DECIMAL_PONTO = re.compile(r'(?<![\w.])(\d+\.\d+)(?![\w.])')

CLASSES = ('codigo', 'enderecos', 'seccoes', 'datas', 'resumos', 'ordinais',
           'identificadores', 'anos')


def _apaga(texto, rx, contagem, chave):
    def _troca(m):
        contagem[chave] = contagem.get(chave, 0) + 1
        return ' ' * (m.end() - m.start())
    return rx.sub(_troca, texto)


def limpa(texto):
    """Apaga as classes que não são números e devolve (texto limpo, contagens)."""
    c = {k: 0 for k in CLASSES}
    texto = unicodedata.normalize('NFC', texto)
    for rx, chave in (
        (_RE_CERCA, 'codigo'), (_RE_CRASE, 'codigo'), (_RE_URL, 'enderecos'),
        (_RE_SECCAO, 'seccoes'), (_RE_ISO, 'datas'), (_RE_DATA_PT, 'datas'),
        (_RE_DATA_BARRA, 'datas'), (_RE_HORA, 'datas'), (_RE_RESUMO, 'resumos'),
        (_RE_ORDINAL, 'ordinais'), (_RE_ARTIGO, 'ordinais'),
    ):
        texto = _apaga(texto, rx, c, chave)
    texto = _RE_UNIDADE.sub(lambda m: ' ' * (m.end() - m.start()), texto)
    for rx, chave in ((_RE_IDENT, 'identificadores'), (_RE_ANO, 'anos')):
        texto = _apaga(texto, rx, c, chave)
    return texto, c


def normaliza(bruto):
    """A forma canónica de um número escrito: sem milhares, com ponto decimal."""
    s = bruto
    for e in ESPACOS_DE_MILHAR:
        s = s.replace(e, '')
    return s.replace(',', '.')


def valor(bruto):
    """O valor numérico de um número escrito, ou None."""
    try:
        return float(normaliza(bruto))
    except ValueError:
        return None


def do_texto(texto):
    """Os números de um texto, já limpo das classes que não contam.

    Devolve (lista de ocorrências, contagens do que se apagou). Cada ocorrência
    traz `bruto`, `forma`, `valor`, `linha` e `contexto`.
    """
    limpo, contagens = limpa(texto)
    originais = texto.split('\n')
    achados = []
    for m in _RE_NUMERO.finditer(limpo):
        n = limpo.count('\n', 0, m.start()) + 1
        contexto = originais[n - 1].strip() if n - 1 < len(originais) else ''
        achados.append({
            'bruto': m.group(1),
            'forma': normaliza(m.group(1)),
            'valor': valor(m.group(1)),
            'linha': n,
            'contexto': contexto[:160],
        })
    return achados, contagens


def _anda(no, formas, valores):
    if isinstance(no, bool):
        return
    if isinstance(no, (int, float)):
        formas.add(normaliza(repr(no)))
        formas.add(normaliza(str(no)))
        if float(no).is_integer():
            formas.add(str(int(no)))
        valores.add(float(no))
        return
    if isinstance(no, str):
        for m in _RE_NUMERO.finditer(no):
            formas.add(normaliza(m.group(1)))
            v = valor(m.group(1))
            if v is not None:
                valores.add(v)
        for m in _RE_DECIMAL_PONTO.finditer(no):
            formas.add(m.group(1))
            valores.add(float(m.group(1)))
        return
    if isinstance(no, dict):
        for k, v in no.items():
            _anda(k, formas, valores)
            _anda(v, formas, valores)
        return
    if isinstance(no, list):
        for v in no:
            _anda(v, formas, valores)


def do_json(caminhos):
    """As formas e os valores numéricos de uma lista de ficheiros JSON.

    Devolve (formas, valores, lidos, ilegíveis). `lidos` e `ilegíveis` existem
    para que uma pasta sem JSON legível nunca passe por «nada em falta».
    """
    formas, valores, lidos, ilegiveis = set(), set(), [], []
    for c in caminhos:
        try:
            with open(c, encoding='utf-8') as f:
                dados = json.load(f)
        except Exception as erro:  # noqa: BLE001 — a razão vai para a saída
            ilegiveis.append((c, f'{type(erro).__name__}: {erro}'))
            continue
        _anda(dados, formas, valores)
        lidos.append(c)
    return formas, valores, lidos, ilegiveis


def de_objeto(dados):
    """As formas e os valores numéricos de uma árvore já carregada."""
    formas, valores = set(), set()
    _anda(dados, formas, valores)
    return formas, valores


def em_falta(achados, formas, valores):
    """Os números do texto que não existem entre as formas nem entre os valores."""
    faltam = []
    for a in achados:
        if a['forma'] in formas:
            continue
        if a['valor'] is not None and a['valor'] in valores:
            continue
        faltam.append(a)
    return faltam
