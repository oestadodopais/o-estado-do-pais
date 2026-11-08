"""Plantas dos lançadores que alteram o seu original durante a passagem."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

GUIOES = Path(__file__).resolve().parents[2] / 'scripts/leituras'


class CopiaDoLancador(unittest.TestCase):
    def ensaio(self, nome, protegido):
        with tempfile.TemporaryDirectory(prefix='hig6-lancador-') as tmp:
            pasta = Path(tmp)
            sitio = pasta / 'worktree'
            guioes = sitio / 'scripts/leituras'
            guioes.mkdir(parents=True)
            auxiliares = pasta / 'auxiliares'
            auxiliares.mkdir()
            binario = pasta / 'bin'
            binario.mkdir()
            for n in ('fila.py', 'pre-mandato.py'):
                (guioes / n).write_text('print("pré-voo sintético verde")\n')
            (auxiliares / 'pre-voo.sh').write_text('exit 0\n')
            (auxiliares / 'retomas.py').write_text('print("retoma sintética autorizada")\n')
            (auxiliares / 'PROMPT-construtor-comum.md').write_text('Planta do lançador.\n')
            (auxiliares / 'escrivao.py').write_text('import time\ntime.sleep(30)\n')
            (auxiliares / 'pontos.py').write_text('''import json,sys
from pathlib import Path
if '--json' in sys.argv:
    Path(sys.argv[sys.argv.index('--json') + 1]).write_text(json.dumps({'planta': True}))
    print('PONTOS: planta concluída')
''')
            # Só o serviço do teto é inerte; o corpo dos dois lançadores é o real.
            (auxiliares / 'com-teto.sh').write_text('shift\nexec "$@"\n')
            codex = binario / 'codex'
            codex.write_text('''#!/bin/sh
cat > /dev/null
printf '#!/bin/sh\nexit 99\n' > "$PLANTA_ORIGINAL"
exit 17
''')
            codex.chmod(0o700)
            original = auxiliares / nome
            texto = (GUIOES / nome).read_text()
            if not protegido:
                inicio = texto.index('# A passagem pode editar o original.')
                fim = texto.index('set -u\n', inicio)
                texto = texto[:inicio] + texto[fim:]
                texto = texto.replace('aqui="$OEDP_LANCADOR_ORIGEM"', 'aqui="$(cd "$(dirname "$0")" && pwd -P)" || exit 9')
            # Obriga a uma leitura posterior ao Codex; o controlo sem cópia perde o fecho.
            inicio = texto.index('cat "$comum" "$prompt" |')
            fim = texto.index('\n', inicio)
            texto = texto[:fim] + '\n' + '# margem de leitura da planta\n' * 4096 + texto[fim:]
            original.write_text(texto)
            prompt = pasta / 'prompt.md'
            prompt.write_text('Acrescenta: nada\n')
            args = [str(sitio)]
            if nome == 'retomar-codex.sh':
                args.append('sessao-sintetica')
            args += [str(prompt), str(pasta / 'resposta.md')]
            env = dict(os.environ, TMPDIR=str(pasta), CODEX_RACIOCINIO='high',
                       RESEARCHHUB_DIR=str(pasta / 'motor'), OEDP_BLOCO='PLANTA',
                       PLANTA_ORIGINAL=str(original), PATH=str(binario) + ':' + os.environ['PATH'])
            for chave in ('OEDP_LANCADOR_COPIA', 'OEDP_LANCADOR_ORIGEM'):
                env.pop(chave, None)
            r = subprocess.run(['sh', str(original), *args], env=env, capture_output=True, text=True, timeout=15)
            self.assertEqual(original.read_text(), '#!/bin/sh\nexit 99\n')
            if protegido:
                self.assertEqual(r.returncode, 17, r.stdout + r.stderr)
                self.assertIn('FIM exit=17', r.stdout)
                self.assertIn('PONTOS: planta concluída', r.stdout)
                custos = list(pasta.glob('oedp-*/RELATORIO.pontos.json'))
                self.assertEqual(len(custos), 1)
                self.assertEqual(json.loads(custos[0].read_text()), {'planta': True})
                self.assertEqual(list(pasta.glob('oedp-lancador.*')), [])
            else:
                self.assertNotIn('PONTOS: planta concluída', r.stdout)
                self.assertEqual(list(pasta.glob('oedp-*/RELATORIO.pontos.json')), [])

    def test_construcao_protegida(self):
        self.ensaio('construir-codex.sh', True)

    def test_retoma_protegida(self):
        self.ensaio('retomar-codex.sh', True)

    def test_construcao_sem_copia_perde_o_fecho(self):
        self.ensaio('construir-codex.sh', False)

    def test_retoma_sem_copia_perde_o_fecho(self):
        self.ensaio('retomar-codex.sh', False)


if __name__ == '__main__':
    unittest.main()
