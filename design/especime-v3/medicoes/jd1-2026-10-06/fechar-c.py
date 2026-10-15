"""JD1-c: recolhe as provas e escreve o relatório só a partir dos ficheiros.

RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/jd1-2026-10-06/fechar-c.py --provas
RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/jd1-2026-10-06/fechar-c.py --relatorio
"""
import hashlib
import importlib.metadata
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys

AQUI=Path(__file__).resolve().parent
SITE=AQUI.parents[3]
MOTOR=Path(os.environ['RESEARCHHUB_DIR'])
BASE_SITE='cad8dd95'
BASE_MOTOR='481e15e'
sys.path.insert(0,str(MOTOR))
from correr import limpa

def git(repo,*args):return subprocess.check_output(['git',*args],cwd=repo,text=True).strip()
def js(code):return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=SITE,text=True))
def write(name,obj): (AQUI/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def read(name):return json.loads((AQUI/name).read_text())

def provas():
    from publisher import jd1 as J, jd1_test
    controls=[]
    serie=git(SITE,'show',BASE_SITE+':ledger/series/serie-obrigacoes-do-tesouro-10-anos-rendibilidade.yml')
    assert re.search(r'periodo: [\"\']?2026-08[\"\']?\s+valor: [\"\']?3,53700',serie)
    controls.append(dict(achado=1,valor='3,53700',periodo='2026-08',passou=True,origem='ledger/series/serie-obrigacoes-do-tesouro-10-anos-rendibilidade.yml'))
    old=git(SITE,'show',BASE_SITE+':src/data/o-que-e-das-familias.mjs')
    assert 'ao ano em que o encargo é assumido' in old
    controls.append(dict(achado=2,frase='ao ano em que o encargo é assumido',passou=True))
    old=git(MOTOR,'show',BASE_MOTOR+':publisher/jd1.py')
    assert 'require(len(colors) == 1,' in old
    controls.append(dict(achado=3,guarda='len(colors) == 1',passou=True))
    old=git(MOTOR,'show',BASE_MOTOR+':publisher/jd1_test.py')
    assert 'debt["value"] == "315 856"' in old
    controls.append(dict(achado=4,valor='315 856',passou=True))
    old=git(SITE,'show',BASE_SITE+':design/especime-v3/medicoes/jd1-2026-10-06/LEIA-ME.md')
    assert '| `juros-das-administracoes-publicas-2024` | 5 983,4 |' in old
    controls.append(dict(achado=5,valor=next(r for r in J.read() if r['id']=='juros-das-administracoes-publicas-2024')['value'],passou=True))
    write('controlos-c.json',dict(sitio=BASE_SITE,motor=BASE_MOTOR,controlos=controls))
    deps=[]
    for nome in ['PyMuPDF','Pillow']:
        m=importlib.metadata.metadata(nome)
        deps.append(dict(nome=nome,versao=importlib.metadata.version(nome),licenca=m.get('License-Expression') or m.get('License')))
    write('dependencias-c.json',deps)
    site=json.loads(subprocess.check_output(['node','tests/linha/jd1c.mjs','--prova'],cwd=SITE,text=True))
    motor=jd1_test.run()
    temp=Path(os.environ.get('TMPDIR','/tmp'))/'jd1-c-plantas-tranca.json'
    subprocess.run(['python3','tests/leituras/portoes.py','--json',str(temp)],cwd=SITE,check=True,stdout=subprocess.DEVNULL)
    tranca=json.loads(temp.read_text())
    spec=importlib.util.spec_from_file_location('priv',SITE/'scripts/check-privacidade.py')
    priv=importlib.util.module_from_spec(spec);spec.loader.exec_module(priv)
    guarda=priv.medir_rastreados(SITE,True)
    assert guarda['passou']
    plantas=site['plantas']+[{**p,'nome':p['nome'],'mensagem':p['mensagem']} for p in motor if p.get('planta')]
    plantas += [dict(nome=p['planta'],mensagem=limpa(p['mensagem']),passou=True) for p in tranca['casos']]
    plantas += [dict(nome=p['id'],mensagem=p.get('mensagem','Fragmento de caminho recusado no registo; conhecido positivo conservado.'),passou=p['mordeu']) for p in guarda['plantas']]
    write('plantas-c.json',dict(sitio=git(SITE,'rev-parse','HEAD'),motor=git(MOTOR,'rev-parse','HEAD'),plantas=plantas))
    frases=js("""import fs from 'node:fs';import {parse} from 'node-html-parser';
const ids=Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/jd1.json')).rows);
const result=[];for(const id of ids)for(const lang of ['pt','en']){
 const root=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
 const text=s=>(root.querySelector(s)?.textContent??'').replace(/\\s+/g,' ').trim();
 result.push({id,lang,frase:text('[data-o-que-e-parte="o-que-e"]'),parcela:text('[data-jd1-parcela]'),evolucao:text('[data-jd1-evolucao]'),recorte:root.querySelector('.linha-recorte img')?.getAttribute('alt')??null});}
console.log(JSON.stringify(result));""")
    write('frases-c.json',frases)
    print('Controlos, dependências, frases e plantas recolhidos dos ficheiros e dos ensaios.')

def relatorio():
    portoes=AQUI/'portoes-c'
    codes={n:int((portoes/(n+'.codigo')).read_text()) for n in ['build','verify','typecheck','motor','series','cruzamento']}
    tentativa=portoes/'tentativa-1'
    falha={n:int((tentativa/(n+'.codigo')).read_text()) for n in ['build','verify','typecheck','motor']}
    falha2={n:int((portoes/('tentativa-2/'+n+'.codigo')).read_text()) for n in ['build','verify','typecheck']}
    falha3={n:int((portoes/('tentativa-3/'+n+'.codigo')).read_text()) for n in ['build','verify','typecheck']}
    assert all(v==0 for v in codes.values()),codes
    assert (portoes/'arvore.inicio').read_text().strip()=='limpa'
    code_head=(portoes/'cabeca').read_text().strip()
    motor_head=(portoes/'motor.cabeca').read_text().strip()
    assert code_head==(portoes/'cabeca.fim').read_text().strip()
    assert motor_head==(portoes/'motor.cabeca.fim').read_text().strip()
    reversoes=read('reversoes-c.json')['ficheiros']
    plantas=read('plantas-c.json')['plantas']
    caps=read('capturas-c.json')
    assert not caps['problemas'] and caps['cabeca_codigo']==code_head
    for c in caps['capturas']:assert hashlib.sha256((SITE/c['ficheiro']).read_bytes()).hexdigest()==c['sha256']
    frases=read('frases-c.json')
    deps=read('dependencias-c.json')
    controles=read('controlos-c.json')
    rows=json.loads((MOTOR/'publisher/manifest.jd1.json').read_text())['rows']
    lines=json.loads((MOTOR/'content/20 Orcamento do Estado/ledger.json').read_text())['claims']
    own=[r for r in lines if r['id'] in {r['site_id'] for r in rows}]
    commits={repo:git(path,'log','--reverse','--format=%h %s',base+'..HEAD').splitlines() for repo,path,base in [('sítio',SITE,BASE_SITE),('motor',MOTOR,BASE_MOTOR)]}
    sections=['## A passagem JD1-c','',
      'Os recibos distinguem o estado de cada ano, dizem a parcela do financiamento por valores selados e a direção da evolução. A dívida direta distingue-se expressamente da dívida de Maastricht. Os guiões fora do bloco recuperam o comportamento anterior.', '',
      f"Cabeça do código do sítio: `{code_head}`. Cabeça do código do motor: `{motor_head}`. O portão do motor começou em {(portoes / 'motor.inicio').read_text().strip()}, sobre a cabeça do código do motor, que não mudou depois; os portões do sítio começaram em {(portoes / 'build.inicio').read_text().strip()}. Houve recusa da árvore suja antes de cada corrida. `arvore.inicio` diz «limpa»; as diferenças no fim são apenas os registos produzidos pela própria conferência. Os suplementos têm os seus ficheiros de cabeça e de execução.", '',
      'A cabeça do último commit de provas não pode estar escrita dentro do próprio commit. Lê-se com `git rev-parse HEAD`; a resposta de entrega identifica-a. Não houve publicação nem envio.', '',
      f"A primeira corrida parou em A7: a linha nova não estava na declaração dos assuntos JD1 sem área ministerial. A linha passou a usar a mesma decisão já declarada para as outras contas do bloco. Os códigos reais dessa tentativa estão em `portoes-c/tentativa-1/`: {', '.join(f'{k}={v}' for k,v in falha.items())}. O sítio repetiu os portões completos na cabeça limpa corrigida. O motor conservou a mesma cabeça limpa e o verde obtido sob a tranca nessa primeira corrida; os seus registos são conservados integralmente, com as datas próprias. Não se apresenta a tentativa falhada como verde.", '',
      f"A segunda corrida apanhou a contagem antiga no inventário de frases do índice. `inventario.mjs --write` releu as duas contagens do HTML, sem números escritos à mão. A conferência dirigida seguinte encontrou a língua por declarar do novo rótulo da fonte; ficou declarada como português, para a marca linguística do recibo inglês. Os códigos de `portoes-c/tentativa-2/` são {', '.join(f'{k}={v}' for k,v in falha2.items())}. A corrida final usa a cabeça que inclui também estas atualizações.", '',
      f"A terceira corrida teve o build verde e o verify recusou os vínculos incompletos da K17 e a contagem antiga no inventário dos rótulos. A K17 passou a conferir os apoios das notas por linha, com plantas que retiram os literais; a origem orçamental sem uso saiu. O parágrafo calculado da parcela fica fora da definição da família, conservando os dois tokens e a guarda contra números escritos à mão. O conjunto fechado dos rótulos inclui a nova linha, com a planta da remoção conjunta conservada. Códigos de `portoes-c/tentativa-3/`: {', '.join(f'{k}={v}' for k,v in falha3.items())}.", '',
      '### Disposição dos achados','',
      '| Achado | Resultado |','|---|---|',
      '| 1 a 5 | Eram plantas do pacote. As asserções sobre a cabeça inicial estão em `controlos-c.json`; a definição dos juros é agora também ensaiada no recibo do ano seguinte. |',
      '| 6 | As frases do estado pertencem à linha. O estado final e o provisório têm os literais selados do INE. A frase europeia exige a linha comparável do mesmo ano. |',
      '| 7 | Nova linha de amortizações e anulações, com o documento, página, excerto e recibo. A frase usa os tokens do total e da parcela. Ver a divergência de redação abaixo. |',
      '| 8 | Reversão pelo guião `reverter-c.py`, com resumos antes/depois e a decisão de cada ficheiro em `reversoes-c.json`. Os dois guiões operacionais nomeados no mandato são idênticos à base. A guarda da estrutura fica nos registos, incluindo os antigos logs em texto simples. |',
      '| 9 | O recibo distingue dívida direta em contabilidade pública de Maastricht; não inventa qual delas é maior. A base contabilística apoia-se no título do quadro do IGCP, e a diferença de perímetro na nota do relatório anual. A evolução lê os valores exatos e rende ambos por token. |',
      '| 10 | Padrão genérico para as datas do cabeçalho, conferido com a leitura geométrica do PDF. O recibo mostra o texto intacto da última coluna. A planta troca a data extraída. |',
      '| 11 | Espaços do excerto conservados por apresentação pré-formatada, com deslocação horizontal; o texto alternativo descreve o gráfico e o rótulo. |',
      '| 12 | Recusa de árvore suja antes dos portões. Cada corrida toma a tranca comum; o verde do motor e o verde final do sítio pertencem a corridas distintas, com as horas acima. A corrida antiga da fusão tinha alterações locais; o seu verde não prova a árvore exata dessa cabeça. |',
      '| 13 | Saíram as duas afirmações históricas sem ficheiro de prova. Dependências e licenças declaradas no README do motor e abaixo. |',
      '| 14 | Perímetro apoiado na definição do INE, com inclusão e exclusão segundo as regras europeias; o custo conserva o subsetor Estado. |',
      '| 15 | Repetir a leitura substitui a entrada do mesmo autor, dia e âmbito, preservando os âmbitos distintos das famílias e séries. |',
      '| 16 | Pertence ao lugar de direção; não alterado. |',
      '| 17 | Os exemplos do exportador perderam a disposição local das pastas; os ficheiros protegidos do motor ficaram intactos. |','',
      '### Limite de fonte e decisões pequenas','',
      'JD1-10: o mandato pede chamar à parcela inteira «dívida que venceu». O quadro diz «amortizações e anulações», e o relatório anual também descreve amortizações antecipadas. A frase adotada diz «reembolsar ou extinguir dívida», com os dois montantes, sem reduzir o conteúdo da fonte. A questão anterior sobre esta distinção mantém a sua prova; esta passagem resolve a ausência da parcela no texto, mas não adota aquela simplificação.', '',
      'A reposição literal de alguns ficheiros antigos reintroduziria uma raiz pessoal. Nesses ficheiros, a única exceção à reposição é a substituição dessa raiz por uma referência à casa, conservando o destino executável; o inventário identifica cada caso. Os registos históricos em `.txt` foram tratados como os `.log`, pois contêm a mesma espécie de saída. O resumo do brief afetado acompanha apenas essa retirada da raiz.', '',
      '### Portões lidos de ficheiro','',
      '| Ficheiro em `portoes-c/` | Código |','|---|---:|']
    sections += [f'| `{n}.codigo` | {v} |' for n,v in codes.items()]
    sections += ['',f"Capturas verificadas: {len(caps['capturas'])}; problemas reportados: {len(caps['problemas'])}. Larguras: {', '.join(map(str,caps['larguras']))} px. O manifesto inclui as frases, medidas de largura, resumos e ensaios de interação. As imagens foram inspecionadas visualmente no fecho.", '',
      '### Dependências do motor','', '| Biblioteca | Versão instalada | Licença nos metadados |','|---|---|---|']
    sections += [f"| {d['nome']} | {d['versao']} | {d['licenca']} |" for d in deps]
    sections += ['', 'O mandato declara o motor privado e sem distribuição. Mantém-se PyMuPDF para a seleção por geometria e cor, também usada para provar o recorte. Trocar apenas a renderização não retiraria essa dependência; não se trocou o leitor sem uma prova equivalente. Pillow escreve o WebP. Nenhuma dependência nova nesta passagem.', '',
      '### Linhas lidas do motor','', '| Linha | Valor | Unidade | Localizador |','|---|---:|---|---|']
    sections += [f"| `{r['id']}` | {r['value']} | {r['unit']} | {r.get('document',{}).get('locator','Derivada das linhas declaradas')} |" for r in own]
    sections += ['', '### Frases nos recibos, lidas do HTML','']
    for f in frases:
        sections += [f"**`{f['id']}` · {f['lang']}**",'',f['frase']]
        sections += [v for v in [f['parcela'],f['evolucao'],f['recorte']] if v]
        sections += ['']
    sections += ['### Plantas e mensagens','', '| Planta | Mensagem | Resultado |','|---|---|---|']
    sections += [f"| {p['nome']} | {p['mensagem']} | {'mordeu' if p['passou'] else 'falhou'} |" for p in plantas]
    sections += ['', '### Ficheiros revertidos e conservados','', '| Ficheiro | Decisão | Razão |','|---|---|---|']
    sections += [f"| `{r['ficheiro']}` | {r['decisao']} | {r['razao']} |" for r in reversoes]
    sections += ['', '### Commits','']
    for repo,items in commits.items():
        sections += [f'**{repo}**','']+[f'- `{v}`' for v in items]+['']
    sections += ['### Custo','', 'A linha «tokens used» desta sessão não foi exposta durante a construção. O custo e a comparação com o alvo ficam por verificar; não se inferem dos ficheiros nem do número de chamadas.', '']
    report=AQUI/'LEIA-ME.md'
    old=report.read_text().split('## A passagem JD1-c')[0]
    old=re.sub(r'^Estado da passagem JD1-b,.*?\n', 'Estado atual: passagem JD1-c. As provas, decisões e limitações desta passagem estão na secção [A passagem JD1-c](#a-passagem-jd1-c). As secções anteriores conservam o histórico da JD1-b.\n', old, count=1, flags=re.M)
    old=re.sub(r' Uma planta real do gate, em leitura interceptada,.*?transcrição infiel\.','',old)
    old=re.sub(r'Os três seletores novos foram também comparados com a implementação anterior:.*?resultado\. ','',old)
    old=old.replace('cuja cabeça é a da fusão. São provas do ponto de partida, não provas das alterações posteriores.', 'cuja cabeça nominal é a da fusão. A árvore tinha alterações por registar, como mostra `estado.fim`; estes códigos não provam a árvore exata do commit.')
    report.write_text(old.rstrip()+'\n\n'+'\n'.join(sections))
    write('fecho-c.json',dict(cabeca_codigo_sitio=code_head,cabeca_codigo_motor=motor_head,codigos=codes,capturas=len(caps['capturas']),plantas=len(plantas),linhas=len(own),commits=commits))
    print('Relatório escrito com valores, códigos, frases, plantas e reversões lidos dos ficheiros.')

if __name__=='__main__':
    if '--provas' in sys.argv:provas()
    elif '--relatorio' in sys.argv:relatorio()
    else:raise SystemExit('Escolha --provas ou --relatorio.')
