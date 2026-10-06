#!/usr/bin/env python3
"""Escreve a comparação do M-A a partir das provas, sem transcrever tempos à mão.

Uso, da raiz: python3 design/especime-v3/medicoes/ma-2026-10-06/relatorio.py
Exige as três corridas completas, compara a união observada e os resultados
inteiros dos alvos e escreve o relatório, os dados da comparação e só o bloco
de tempos do M-A no §5 do mapa. Não constrói nem corre conferências do projeto.
"""
from collections import Counter
import gzip
import hashlib
import html
import json
from pathlib import Path
import re
import subprocess

P = Path(__file__).resolve().parent
RAIZ = Path.cwd()
def ler(p):
    p=Path(p)
    return json.loads(gzip.decompress(p.read_bytes()) if p.suffix=='.gz' else p.read_bytes())
def git(*args): return subprocess.check_output(['git',*args],text=True).strip()
def guardar(nome,valor): (P/nome).write_text(json.dumps(valor,ensure_ascii=False,indent=2)+'\n')
def segundos(n): return f'{n:.3f}'.replace('.',',')
nomes=['antes','portoes','portoes-antigo']
tempos={n:ler(P/n/'tempos.json') for n in nomes}
codigos={n:{g:int((P/n/(g+'.codigo')).read_text()) for g in ['build','verify','typecheck']} for n in nomes}
assert all(c==0 for cs in codigos.values() for c in cs.values()),'Há um código vermelho: relatar a falha antes de declarar a entrega.'
base=tempos['antes']['cabeca']; head=tempos['portoes']['cabeca']
assert head==tempos['portoes-antigo']['cabeca']
for n in nomes:
    assert (P/n/'cabeca').read_text().strip()==tempos[n]['cabeca']
    assert (P/n/'cabeca.fim').read_text().strip()==tempos[n]['cabeca']
    assert all(p['codigo']==0 for p in tempos[n]['passos'])
def passos(n,nome): return [p for p in tempos[n]['passos'] if p['passo']==nome]
medidas={n:{'inteira':tempos[n]['segundos'],**{rotulo:sum(p['segundos'] for p in passos(n,comando)) for rotulo,comando in [('build','cadeia:build'),('verify','cadeia:verify'),('briefs','npm run check:briefs'),('alvos','npm run check:alvos'),('auto_teste_pais','auto-teste:pais'),('typecheck','npm run typecheck')]},'auto_teste_pais_invocacoes':[{'cadeia':p['cadeia'],'segundos':p['segundos']} for p in passos(n,'auto-teste:pais')]} for n in nomes}
def conferencias(n): return Counter(p['passo'] for p in tempos[n]['passos'] if not p['passo'].startswith('cadeia:') and p['passo']!='npm run check:pais:auto-teste')
listas={n:conferencias(n) for n in nomes}
assert set(listas['antes'])==set(listas['portoes'])==set(listas['portoes-antigo'])
assert [p['cadeia'] for p in passos('portoes','auto-teste:pais')]==['verify']
assert [p['cadeia'] for p in passos('portoes-antigo','auto-teste:pais')]==['verify']
runner=ler(P/'portoes/verify.json')
assert runner['ok'] and all(c['ok'] for c in runner['celulas'].values())
assert git('show',f'{base}:.github/workflows/portao.yml')==git('show',f'{head}:.github/workflows/portao.yml')
assert not git('diff','--name-only',base,head,'--','src','public','ledger')
assert (P/'portoes-antigo.sh').read_bytes()==subprocess.check_output(['git','show',f'{base}:scripts/leituras/portoes.sh'])
paginas={n:ler(next(f for f in [P/n/'alvos.json',P/n/'alvos.json.gz'] if f.exists())) for n in nomes}
chaves=['paginas','rotas','larguras','celulas','axe','graves','alvos_maus']
alvos={n:{k:paginas['antes'][k]==paginas[n][k] for k in chaves} for n in nomes[1:]}
assert all(v for d in alvos.values() for v in d.values()),'Os alvos não deram as mesmas medições.'
resumo={'base':base,'cabeca_do_codigo':head,'codigos':codigos,'medidas':medidas,'menos_de_12_minutos':medidas['portoes']['inteira']<12*60,'conferencias_distintas':len(listas['antes']),'listas_iguais':True,'uniao':runner['celulas']['U'],'alvos_iguais':alvos,'passagens_alvos':len(paginas['antes']['paginas'])}
# A prosa apresenta milésimos; o JSON conserva também esse arredondamento
# declarado, além das durações integrais, para a régua do relatório o conferir.
resumo['segundos_apresentados']={n:{k:round(v,3) for k,v in m.items() if isinstance(v,(int,float))} for n,m in medidas.items()}
brief=(RAIZ/'design/observatorio/BRIEF-MA-a-maquinaria-sem-perda-de-protecao.md').read_text()
resumo['pontos_do_brief']=[int(n) for n in re.findall(r'^(\d+)\. \*\*',brief,re.M)]
guardar('resumo.json',resumo); guardar('conferencias.json',listas)
plantas=[]
for nome in ['plantas-runner.json','plantas-portoes.json','plantas-briefs.json','e1-h2c.json','plantas-aterrar.json','plantas-pacote-ma.json','plantas-pacote-h2.json','plantas-ferramentas.json']:
    for p in ler(P/nome)['casos']:
        mensagens=p.get('falhas') or p.get('mensagens') or p.get('queixas_e1') or [p.get('mensagem') or p.get('queixa') or ('Controlo sem queixa; condição conferida pelo ensaio.')]
        plantas.append({'ficheiro':nome,'nome':p.get('planta') or p.get('nome'),'mensagens':mensagens,'codigo':p.get('codigo')})
for p in paginas['portoes']['plantas_da_espera']:
    assert p['mordeu'] and p['folha_servida']
    plantas.append({'ficheiro':'portoes/alvos.json.gz','nome':p['nome'],'mensagens':[p['celula']+': '+p['mensagem']]})
plantas.append({'ficheiro':'tempos-planta.log','nome':'ambiente, falha e passo seguinte no instrumento','mensagens':[(P/'tempos-planta.log').read_text().strip()]})
guardar('plantas.json',plantas)
tabela=['| Medida, em segundos | Cabeça do brief | Código, guião novo | Mesmo código, guião antigo |','|---|---:|---:|---:|']
for rotulo,k in [('Corrida inteira','inteira'),('build','build'),('verify','verify'),('check:briefs','briefs'),('check:alvos','alvos'),('Auto-teste do país, soma','auto_teste_pais'),('typecheck','typecheck')]:
    tabela.append('| '+rotulo+' | '+' | '.join(segundos(medidas[n][k]) for n in nomes)+' |')
linhas=[
 '# M-A · maquinaria medida, com a proteção conferida','',
 f'Cabeça do brief: `{base}`. Cabeça do código nas duas corridas finais: `{head}`. A cabeça final da entrega é o commit que junta este relatório e as provas; é indicada na mensagem final da sessão. O código medido fica identificado independentemente dessa documentação.','',
 '## Resultado e método','',
 f'A corrida nova levou {segundos(medidas["portoes"]["inteira"])} s, lidos de `portoes/tempos.json`. '+('Cumpre o teto de doze minutos.' if resumo['menos_de_12_minutos'] else 'Não cumpre o teto de doze minutos; o ponto fica aberto, sem converter uma meta de tempo num portão vermelho.'),
 'Os códigos vêm dos ficheiros `*.codigo`, nunca de uma cadeia com pipe. As três corridas usaram a mesma máquina, a tranca comum e o motor em leitura por `RESEARCHHUB_DIR=<motor>`. Esta sessão não lançou outras conferências durante cada medição. A espera pela tranca antecede a primeira marca e não entra no tempo da corrida. A presença de processos normais do sistema não é uma garantia de máquina fisicamente ociosa.','',
 'O instrumento do ponto 1 foi aplicado à cabeça do brief antes de qualquer otimização. `tempos-shell.py` mede cada comando do npm, conserva a paragem e o código de falha e passa o ambiente inteiro. `tempos.mjs` mede os passos do executor paralelo e reúne as marcas. A duração inteira é o intervalo entre a primeira entrada instrumentada e o fim da última, incluindo os intervalos entre passos. Não é a soma das durações paralelas.','',
 'Fontes: `antes/tempos.json`, `portoes/tempos.json` e `portoes-antigo/tempos.json`. `resumo.json`, `conferencias.json` e esta tabela são escritos por `relatorio.py`; nenhum tempo é transcrito à mão.','',*tabela,'',
 'O guião antigo é a cópia exata de `scripts/leituras/portoes.sh` na cabeça do brief, conservada em `portoes-antigo.sh`; a igualdade dos bytes é conferida por `relatorio.py`. Na comparação final recebeu a mesma shell de instrumentação pelo ambiente. A limpeza foi chamada depois, porque o guião antigo não a conhece.','',
 '## Códigos lidos dos ficheiros','',
 '| Corrida | build.codigo | verify.codigo | typecheck.codigo |','|---|---:|---:|---:|',
 *['| '+n+' | '+' | '.join(str(codigos[n][g]) for g in ['build','verify','typecheck'])+' |' for n in nomes],'',
 'As cabeças de entrada e saída de cada corrida são iguais. O workflow `.github/workflows/portao.yml` é byte a byte o da cabeça do brief. Não há diferenças em `src/`, `public/` ou `ledger/`. Nenhuma página de leitor foi redesenhada.','',
 '## Os pontos do mandato','',
 '1. **Tempos.** Instrumento aplicado primeiro, com planta de código não nulo, herança do ambiente e paragem do passo seguinte. A linha inteira, o verify e cada conferência ficam identificados no mesmo JSON.',
 f'2. **Encadeamento.** Quatro processos locais, medidos nesta corrida. U confirma {runner["celulas"]["U"]["passos_do_verify"]} passos: {runner["celulas"]["U"]["cobertos_pelo_build"]} pagos pelo build verde e {runner["celulas"]["U"]["corridos_aqui"]} corridos aqui. D e C estão verdes em `portoes/verify.json`. Não se fez uma procura exaustiva do grau mais rápido; o grau escolhido cumpre o teto e não deu falhas de memória ou portas. O workflow continua a escolher o grau pelo seu anfitrião. `series-com-motor.codigo` e `series-sem-motor.codigo` conservam ambos os ensaios; o segundo declara a parte que não pode ler sem motor.',
 '3. **Briefs.** `presos.json` prende o brief, o guião, o JSON de medidas e a versão do conferidor por sha256. A forma do JSON, os conhecidos positivos e a ligação dos números às frases continuam a ser conferidos em cada corrida. Só a execução do guião é reutilizada. Uma alteração de qualquer selo volta a executar. Os selos novos gravam-se com `--escrever-presos` depois de tudo verde; a conferência habitual é só de leitura para conservar D. Ver MA-1.',
 '4. **País.** A chamada da célula E1 no conferidor real é a mesma. Cada caso do ensaio corre essa célula e copia só o carimbo, em vez de copiar a construção e repetir células alheias. As plantas de prazo e razão continuam a morder; a retirada da chamada numa cópia é detetada. A conferência normal continua inteira. O auto-teste mudou da importação dentro de `check:pais` para o passo explícito `check:pais:auto-teste` no verify.',
 f'5. **Alvos.** `load`, fontes e quadro de pintura substituem a espera fixa. As {len(paginas["antes"]["paginas"])} passagens são exatamente iguais nas páginas, rotas, larguras, células, axe e alvos maus das três corridas. A igualdade é de objetos completos, sem arredondar medidas. `comparacao-alvos.json` conserva também o ensaio seletivo, e `resumo.json` confere as duas corridas finais contra o antes. As folhas atrasadas, a etiqueta cortada e o botão pequeno falham nas células originais.',
 '6. **Aterragem.** Os códigos 14 a 18 e as etapas do motor, da publicação, da Vercel e do verify:deploy ficam. A consulta da corrida de main faz-se uma vez: imprime o endereço devolvido, ou a página de corridas quando o identificador ainda não existe. O ensaio substitui comandos externos e não faz uma aterragem real.',
 '7. **Pacote.** Os registos dos portões ficam fora das cópias inteiras e do diff, também por PACOTE_EXTRA. O pacote junta códigos, tempos e linhas citadas com o número da linha e o sha256 da origem. Citação inexistente recusa a montagem; linha retirada recusa a entrega. As plantas anteriores do pacote H2 continuam verdes.',
 '8. **Ferramentas comuns.** Custos Claude e Codex, limpeza de texto e gzip e capturas com recortes vivem em `scripts/leituras/`. O limpador corre ao terminar os portões, incluindo um vermelho, e antes de soltar a tranca. Os testes cobrem formatos, contadores repetidos e recuados, campos ausentes, idempotência, binários, ligações, as cinco larguras nas duas línguas, recortes, cabeça errada e pedidos externos. As cópias históricas ficam como evidência, sem serem pontos de manutenção para blocos seguintes.','',
 '## A mesma lista de conferências','',
 f'A união observada tem {len(listas["antes"])} comandos ou auto-testes distintos antes e depois. A tabela vem das entradas de `tempos.json`, não de uma promessa no package.json. O passo npm que envolve o auto-teste é normalizado para a entrada interna `auto-teste:pais`, que já existia no antes. O verify passa a ter um passo explícito adicional por essa mudança de lugar; as células protegidas são as mesmas. As repetições pagas pelo build e a segunda invocação do auto-teste deixam de gastar tempo.','',
 '| Conferência ou passo | Antes, execuções | Novo, execuções | Antigo na cabeça do código, execuções |','|---|---:|---:|---:|',
 *['| `'+c+'` | '+' | '.join(str(listas[n][c]) for n in nomes)+' |' for c in sorted(listas['antes'])],'',
 'Linhas de controlo para o pacote:','',
 '<!-- portao: portoes/verify.log | U ✓ -->',
 '<!-- portao: portoes/verify.log | D ✓ -->',
 '<!-- portao: portoes/verify.log | C ✓ -->',
 '<!-- portao: portoes/verify.log | npm run check:briefs · -->',
 '<!-- portao: portoes/verify.log | npm run check:series · -->',
 '<!-- portao: portoes/verify.log | npm run check:pais:auto-teste · -->',
 '<!-- portao: portoes/verify.log | npm run check:alvos · -->','',
 '## Plantas e mensagens','',
 'As mensagens abaixo vêm dos JSON ou registos de ensaio nomeados. Os controlos verdes provam a passagem limpa; as plantas vermelhas conservam a queixa. Não são falhas da entrega.','',
 '| Planta ou controlo | Mensagem observada | Ficheiro |','|---|---|---|',
 *['| '+html.escape(p['nome'],quote=False).replace('|','&#124;')+' | '+'<br>'.join(html.escape(m,quote=False).replace('|','&#124;').replace('\n','<br>') for m in p['mensagens'])+' | `'+p['ficheiro']+'` |' for p in plantas],'',
 '## Limites e questões abertas','',
 '- **MA-1.** Os selos de briefs novos ou alterados exigem `python3 scripts/check-briefs.py --escrever-presos` fora do verify. A gravação automática durante o verify não foi feita: escrever num ficheiro seguido fecharia D. Sem a gravação deliberada, o guião volta a correr e conserva a proteção; perde-se só o ganho até selar.',
 '- **MA-2.** A leitura a frio do Opus e a conferência do lugar de direção ficam pendentes. O construtor não as substitui por autoaprovação. O pacote da entrega inclui os guiões inteiros, os tempos e o workflow; a cópia com cinco estragos é preparada separadamente para a leitura.',
 '- **MA-3.** Não foi exposta nesta sessão uma linha final «tokens used» do lançador. O custo final fica por ler do lado que lançou; os contadores parciais de uma sessão não o substituem.','',
 'Não houve push, publicação, alteração do motor ou edição do ISSUES.md. Não se mediu o tempo de uma aterragem real, porque não faz parte da autorização do construtor.','',
 '## Commits do código e dos ensaios','',
 *['- `'+l.split(' ',1)[0]+'` '+l.split(' ',1)[1] for l in git('log','--reverse','--format=%h %s',f'{base}..{head}').splitlines()],'',
 'O commit final de documentação acrescenta este relatório e as medições. Os dois trailers estão em cada commit da entrega.','']
(P/'LEIA-ME.md').write_text('\n'.join(linhas))
mapa=RAIZ/'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'
s=mapa.read_text(); inicio='<!-- MA-TEMPOS-INICIO -->'; fim='<!-- MA-TEMPOS-FIM -->'
bloco='\n'.join([inicio,'### Medido no M-A, 06.10.2026','',f'Cabeça do brief `{base[:8]}`, cabeça do código `{head[:8]}`. Tempos lidos dos ficheiros `antes/tempos.json`, `portoes/tempos.json` e `portoes-antigo/tempos.json` em `design/especime-v3/medicoes/ma-2026-10-06/`, gerados por `relatorio.py`. A corrida nova usa a tranca e quatro processos, com a união, a imutabilidade e a cabeça conferidas.','',*tabela,'',fim,''])
if inicio in s: s=s[:s.index(inicio)]+bloco+s[s.index(fim)+len(fim)+1:]
else: s=s.replace('### Medições anteriores ao M-A',bloco+'\n### Medições anteriores ao M-A',1)
mapa.write_text(s)
print(json.dumps(resumo,ensure_ascii=False,indent=2))
