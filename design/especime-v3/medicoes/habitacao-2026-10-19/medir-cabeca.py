"""Regista a cabeça real e a saída dos testes existentes, sem acrescentar réguas."""
from pathlib import Path
from datetime import datetime, timezone
import argparse, hashlib, json, os, subprocess, sys, time

HERE = Path(__file__).resolve().parent

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--motor', type=Path, required=True)
    parser.add_argument('teste', choices=['habitacao', 'gate'])
    args = parser.parse_args()
    motor = args.motor.resolve()
    head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=motor, text=True).strip()
    module = 'publisher.habitacao_test' if args.teste == 'habitacao' else 'core.gate'
    start = datetime.now(timezone.utc).isoformat()
    clock = time.monotonic()
    print('Cabeça do motor: ' + head, flush=True)
    print('Comando: python3 -m ' + module, flush=True)
    print('Início UTC: ' + start, flush=True)
    process = subprocess.run([sys.executable, '-m', module], cwd=motor, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    output = process.stdout
    replacements = [(str(motor), '<motor>'), (str(HERE.parents[3]), '<worktree>'), (str(Path.home()), '<utilizador>')]
    if os.environ.get('TMPDIR'): replacements.append((os.environ['TMPDIR'], '<temporario>/'))
    for old, new in replacements: output = output.replace(old, new)
    print(output, end='' if output.endswith('\n') else '\n')
    end_head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=motor, text=True).strip()
    result = {'cabeca_motor': head, 'cabeca_motor_no_fim': end_head,
              'comando': 'python3 -m ' + module, 'inicio_utc': start,
              'fim_utc': datetime.now(timezone.utc).isoformat(),
              'segundos': round(time.monotonic() - clock, 3), 'codigo': process.returncode,
              'saida_sha256': hashlib.sha256(output.encode()).hexdigest(),
              'registo': 'correcao-' + args.teste + '.log'}
    (HERE / ('correcao-' + args.teste + '.json')).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print('Código: ' + str(process.returncode), flush=True)
    sys.exit(process.returncode)

if __name__ == '__main__': main()
