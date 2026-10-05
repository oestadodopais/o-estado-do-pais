#!/usr/bin/env python3
"""H2, M49: pacote real de dois repositórios sintéticos, com controlos e plantas.
Não lê o motor do projeto. Não publica nada. Uso: python3 tests/leituras/pacote.py [--json ficheiro]."""
import hashlib, json, os
from pathlib import Path
import subprocess, sys, tempfile

RAIZ = Path(__file__).resolve().parents[2]
casos = []
def exige(nome, condicao):
    casos.append({'nome': nome, 'passou': bool(condicao)})
    if not condicao:
        raise AssertionError(nome)

def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), *args], stderr=subprocess.PIPE).decode().strip()

def escrever(repo, f, texto):
    p=repo/f; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(texto)

def commit(repo, ficheiros=None):
    if ficheiros is None:
        ficheiros = git(repo, 'ls-files', '-z', '--others', '--modified', '--exclude-standard').strip('\0').split('\0')
    subprocess.run(['git', '-C', str(repo), 'add', '--', *ficheiros], check=True, stdout=subprocess.PIPE)
    git(repo, '-c', 'user.name=Ensaio H2', '-c', 'user.email=ensaio@example.invalid', 'commit', '-m', 'Dados sintéticos de ensaio')
    return git(repo, 'rev-parse', 'HEAD')

with tempfile.TemporaryDirectory(prefix='oedp-pacote-h2-') as tmp:
    tmp=Path(tmp); sitio=tmp/'sitio'; motor=tmp/'motor com espaço'
    for repo in [sitio,motor]:
        repo.mkdir(); git(repo,'init','-q'); escrever(repo,'base.txt','base\n')
    base=commit(sitio); base_motor=commit(motor)
    escrever(sitio,'fonte.mjs','export const texto = "novo";\n')
    escrever(sitio,'gerados/cópia com espaço.json','{"sintetico": true}\n')
    escrever(sitio,'extra/apoio.md','apoio inteiro\n')
    escrever(sitio,'brief.md','# Ensaio sintético\n')
    escrever(sitio,'medicoes/relatorio.md','# Relatório sintético\n\nSem medições publicadas.\n')
    cabeca=commit(sitio)
    escrever(motor,'publisher/cópia com espaço.py','print("ensaio")\n')
    escrever(motor,'fontes/corpo.txt','corpo sintético excluído\n')
    cabeca_motor=commit(motor)
    escrever(sitio,'dist/index.html','<p>construção sintética</p>\n')
    # A ligação por seguir não torna a árvore suja para o pacote.
    (sitio/'node_modules').symlink_to(motor,target_is_directory=True)
    env={k:v for k,v in os.environ.items() if not k.startswith('PACOTE_')}
    cmd=['sh',str(RAIZ/'scripts/leituras/pacote.sh'),str(sitio),base,cabeca]
    def montar(dest, ambiente):
        r=subprocess.run([*cmd,str(dest),str(sitio/'brief.md'),str(sitio/'medicoes/relatorio.md'),'index.html'],env=ambiente,capture_output=True,text=True)
        exige('a montagem corre a zero',r.returncode==0)
        return dest
    normal=montar(tmp/'normal',env)
    exige('controlo sem variáveis conserva o diff gerado', 'gerados/' in (normal/'diff.patch').read_text())
    exige('controlo limpo: a cópia conserva os bytes esperados', (normal/'fonte.mjs').read_text()=='export const texto = "novo";\n')
    exige('a página construída chega', (normal/'built/index.html').read_bytes()==(sitio/'dist/index.html').read_bytes())
    relativo=tmp/'relativo'
    r=subprocess.run(['sh',str(RAIZ/'scripts/leituras/pacote.sh'),'.',base,cabeca,str(relativo),'brief.md','medicoes/relatorio.md','index.html'],cwd=sitio,env=env,capture_output=True,text=True)
    exige('planta do argumento ponto: a montagem conserva a pontuação',r.returncode==0 and 'código de saída do conferir-relatorio.py: 0' in (relativo/'numeros-do-relatorio.txt').read_text() and 'relatorio.md' in (relativo/'numeros-do-relatorio.txt').read_text())
    # A mesma conferência distingue o estado limpo da alteração seguida.
    escrever(sitio,'fonte.mjs','bytes posteriores ao commit\n')
    sujo=tmp/'sujo'
    r=subprocess.run([*cmd,str(sujo),str(sitio/'brief.md'),str(sitio/'medicoes/relatorio.md')],env=env,capture_output=True,text=True)
    exige('planta: bytes do sítio diferentes da cabeça são recusados antes da cópia',
          (sitio/'fonte.mjs').read_text()!=git(sitio,'show',f'{cabeca}:fonte.mjs')+'\n'
          and r.returncode!=0 and not sujo.exists()
          and 'O pacote recusa a árvore do repositório: há modificações em ficheiros seguidos por comitar.' in r.stderr)
    casos[-1].update(codigo=r.returncode, queixa=next(l for l in r.stderr.splitlines() if l.startswith('ValueError: O pacote recusa')))
    escrever(sitio,'fonte.mjs','export const texto = "novo";\n')
    env.update(PACOTE_RETIRA='gerados/*',PACOTE_MOTOR=f'"{motor}" {base_motor} {cabeca_motor} fontes/*',PACOTE_EXTRA='extra')
    escrever(motor,'publisher/cópia com espaço.py','bytes posteriores ao commit\n')
    r=subprocess.run([*cmd,str(tmp/'motor-sujo'),str(sitio/'brief.md'),str(sitio/'medicoes/relatorio.md')],env=env,capture_output=True,text=True)
    exige('planta: bytes do motor diferentes da cabeça são recusados antes da cópia',
          (motor/'publisher/cópia com espaço.py').read_text()!=git(motor,'show',f'{cabeca_motor}:publisher/cópia com espaço.py')+'\n'
          and r.returncode!=0 and not (tmp/'motor-sujo').exists()
          and 'O pacote recusa a árvore do motor: há modificações em ficheiros seguidos por comitar.' in r.stderr)
    casos[-1].update(codigo=r.returncode, queixa=next(l for l in r.stderr.splitlines() if l.startswith('ValueError: O pacote recusa')))
    escrever(motor,'publisher/cópia com espaço.py','print("ensaio")\n')
    pacote=montar(tmp/'com-motor',env)
    def conferir(p):
        falhas=[]
        if 'gerados/' in (p/'diff.patch').read_text(): falhas.append('secção retirada voltou ao diff')
        if (p/'gerados/cópia com espaço.json').read_text()!='{"sintetico": true}\n': falhas.append('cópia inteira ausente ou diferente')
        if (p/'motor/publisher/cópia com espaço.py').read_text()!='print("ensaio")\n': falhas.append('motor ausente ou diferente')
        if (p/'motor/fontes/corpo.txt').exists() or 'corpo sintético' in (p/'motor/diff.patch').read_text(): falhas.append('corpo excluído atravessou')
        return falhas
    exige('os dois lados e as exclusões conferem',not conferir(pacote))
    exige('a tabela nomeia o caminho e as linhas retiradas', '| `gerados/cópia com espaço.json` | 7 |' in (pacote/'RETIRADO-DO-PACOTE.md').read_text())
    exige('o diff do motor declara as exclusões na primeira linha', (pacote/'motor/diff.patch').read_text().splitlines()[0].endswith('fontes/*.'))
    exige('a conferência dos números chega ao pacote', 'código de saída do conferir-relatorio.py: 0' in (pacote/'numeros-do-relatorio.txt').read_text())
    exige('PACOTE_EXTRA conserva os bytes', (pacote/'extra/apoio.md').read_text()=='apoio inteiro\n')
    f=pacote/'diff.patch'; original=f.read_bytes(); f.write_bytes(original+(normal/'diff.patch').read_bytes())
    exige('planta: uma secção excluída que volte ao diff morde', 'secção retirada voltou ao diff' in conferir(pacote)); f.write_bytes(original)
    f=pacote/'motor/publisher/cópia com espaço.py'; original=f.read_bytes(); f.write_text('estrago\n')
    exige('planta: ficheiro do motor alterado morde', 'motor ausente ou diferente' in conferir(pacote)); f.write_bytes(original)
    exige('reposição dos dois lados',not conferir(pacote))
    exige('nenhum caminho temporário foi guardado', all(str(tmp).encode() not in p.read_bytes() for p in pacote.rglob('*') if p.is_file()))
    # A conferência anterior à cópia mantém os dois resultados distintos.
    escrever(sitio,'medicoes/relatorio.md','# Ensaio\n\n76543 ocorrências sem medição.\n')
    # O aviso do relatório é distinto de uma árvore suja: publica-se a ficha
    # sintética no repositório de ensaio antes de medir o aviso.
    cabeca_aviso=commit(sitio,['medicoes/relatorio.md'])
    cmd[-1]=cabeca_aviso
    aviso=montar(tmp/'com-aviso',env)
    exige('um relatório não conferido chega com o código de aviso', 'código de saída do conferir-relatorio.py: 1' in (aviso/'numeros-do-relatorio.txt').read_text())
    # O relatório inexistente não altera um ficheiro seguido. A recusa tem de
    # vir da conferência do relatório, e não da guarda da árvore limpa.
    assert git(sitio,'status','--porcelain','--untracked-files=no')==''
    recusado=tmp/'recusado'
    r=subprocess.run([*cmd,str(recusado),str(sitio/'brief.md'),str(sitio/'medicoes/relatorio-ausente.md')],env=env,capture_output=True,text=True)
    exige('planta: relatório inexistente recusa pela conferência do relatório',
          r.returncode!=0 and not recusado.exists()
          and 'conferir-relatorio.py: não existe o relatório' in r.stdout
          and 'código de saída do conferir-relatorio.py: 2' in r.stdout
          and 'O pacote não se cria.' in r.stderr
          and 'modificações em ficheiros seguidos' not in r.stderr
          and git(sitio,'status','--porcelain','--untracked-files=no')=='')
    casos[-1].update(codigo=r.returncode, queixa=next(l for l in r.stdout.splitlines() if l.startswith('conferir-relatorio.py: não existe o relatório')).replace(str(tmp), '<ensaio>'))
saida={'ok':all(c['passou'] for c in casos),'casos':casos}
if '--json' in sys.argv: Path(sys.argv[sys.argv.index('--json')+1]).write_text(json.dumps(saida,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(saida,ensure_ascii=False,indent=2))
