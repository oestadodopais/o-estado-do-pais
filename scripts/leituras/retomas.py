#!/usr/bin/env python3
"""Conta os lançamentos por bloco fora do repositório, incluindo retomas a frio."""
import datetime
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile


def registar(pasta, bloco, base, retoma=False, decisao=''):
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]*', bloco):
        raise ValueError('OEDP_BLOCO inválido')
    pasta.mkdir(parents=True, exist_ok=True)
    with (pasta / 'tranca').open('a') as tranca:
        fcntl.flock(tranca, fcntl.LOCK_EX)
        ficheiro = pasta / 'blocos.json'
        dados = json.loads(ficheiro.read_text()) if ficheiro.exists() else {}
        anterior = dados.get(bloco)
        voltas = anterior['retomas'] + 1 if anterior else int(retoma)
        registo = {'bloco': bloco, 'retomas': voltas, 'data': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')}
        if voltas >= 3:
            m = re.fullmatch(r'(\d{4}-\d{2}-\d{2})\s+(.+)', decisao.strip())
            valido = False
            if m and len(m[2].strip()) >= 20:
                try:
                    datetime.date.fromisoformat(m[1])
                    valido = True
                except ValueError:
                    pass
            if not valido:
                registo['recusada'] = True
                Path(str(base) + '.retomas.json').write_text(json.dumps(registo, ensure_ascii=False, indent=2) + '\n')
                raise ValueError('terceira retoma ou seguinte: falta OEDP_RETOMA_DECISAO com data AAAA-MM-DD e razão de pelo menos vinte carateres')
            registo['decisao'] = decisao.strip()
        dados[bloco] = registo
        temporario = ficheiro.with_suffix('.tmp')
        temporario.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')
        temporario.replace(ficheiro)
        Path(str(base) + '.retomas.json').write_text(json.dumps(registo, ensure_ascii=False, indent=2) + '\n')
        return registo


if __name__ == '__main__':
    try:
        sitio, base, modo = sys.argv[1:]
        # O diretório Git comum dá a mesma chave em todas as worktrees.
        comum = subprocess.check_output(['git', '-C', sitio, 'rev-parse', '--path-format=absolute', '--git-common-dir'], text=True).strip()
        chave = hashlib.sha256(str(Path(comum).resolve()).encode()).hexdigest()[:20]
        pasta = Path(tempfile.gettempdir()) / ('oedp-retomas-' + chave)
        for destino in (pasta, Path(base).parent):
            if destino.resolve().is_relative_to(Path(sitio).resolve()):
                raise ValueError('o registo de retomas tem de ficar fora do repositório')
        r = registar(pasta, os.environ.get('OEDP_BLOCO', ''), base, modo == 'retoma', os.environ.get('OEDP_RETOMA_DECISAO', ''))
        print('retomas: ' + json.dumps(r, ensure_ascii=False))
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as e:
        print('retomas: ' + (str(e) if isinstance(e, ValueError) else 'registo ilegível'), file=sys.stderr)
        sys.exit(9)
