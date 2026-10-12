"""RP4-n-j: números, linhas, recibos e códigos lidos das provas conservadas."""
from pathlib import Path
import json
b=Path(__file__).parent;j=b/'j';p=b/'portoes-j'
def ler(n):return json.loads((j/n).read_text())
def tabela(cab,rows):
 return '\n| '+' | '.join(cab)+' |\n|'+'|'.join('---' for _ in cab)+'|\n'+''.join('| '+' | '.join(str(x).replace('|','\\|').replace('\n',' ') for x in row)+' |\n' for row in rows)+'\n'
i=ler('integracao.json');inv=ler('inventario.json');commits=ler('commits.json')
s='''\n## A passagem RP4-n-j (a integração com o JD1)

As definições do JD1 passam a declarar as segundas fontes no registo comum do motor, `publisher/definition_sources.json`, lido pelo exportador `publisher/export_site_rows.py`. Este é o caminho já usado pelas linhas da RP4-n. O exportador de séries no tempo também lê esse registo. O leitor numérico `publisher/jd1.py` não precisa de mudar: a declaração pertence à exportação, e os testes do JD1 conferem-na na travessia. Nenhum YAML do sítio foi editado à mão. A regra do publicador e o seu mapa de nomes permanecem intactos.

O inventário conserva as contagens anteriores como retiradas, com a razão «a fusão do JD1 e do RP4-n mudou a contagem», e declara as contagens lidas no HTML. O guião `inventario-j.mjs` segue o padrão de leitura do JD1 e pode voltar a conferir a contagem sem escrever.

### As segundas fontes declaradas pelo motor

'''
s+=f"Linhas alteradas: {sum(d['tipo']=='claims' for d in i['declaracoes'])}; séries alteradas: {sum(d['tipo']=='series' for d in i['declaracoes'])}. A conferência isolada das famílias reproduziu {len(i['recusas_antes'])} recusas antes e {len(i['recusas_depois'])} depois. As mensagens completas estão em `j/integracao.json`; esta contagem é a da conferência isolada, sem duplicar a chamada da construção. Recusas na conferência das definições das séries: {len(i['recusas_series_antes'])} antes e {len(i['recusas_series_depois'])} depois.\n"
s+=tabela(['Linha','Origem','Publicador','Recibo no motor','sha256','Hora','Cliente'],[(d['id'],', '.join(f['origens']),f['publisher'],f['receipt']['motor'],f['receipt']['sha256'],f['receipt']['hora'],f['receipt']['cliente']) for d in i['declaracoes'] for f in d['fontes']])
s+='\nOs endereços completos e os recibos, incluindo os campos de extração, estão em `j/integracao.json`. Cada recibo foi comparado com a origem do JD1 e o sha256 foi recalculado sobre os bytes do motor. O ensaio do motor planta recibos alterados e exige a sua recusa.\n'
s+='### As contagens do inventário\n'
s+=tabela(['Linha anterior','Bloco','Texto retirado','Razão'],[(r['linha'],r['bloco'],r['texto'],r['razao']) for r in inv['retiradas']])
s+=tabela(['HTML lido','Nova linha viva'],[(r['html'],r['texto']) for r in inv['novas']])
s+='### Recusas e decisões desta integração\n'
for q in ler('questoes.json'):s+=f"\n**{q['id']} · {q['estado']}.** {q['descricao']}\n"
r=ler('rotulos-divergencia.json')
s+=f"\nO registo dos rótulos passou de {r['antes']} para {r['depois']}, com {len(r['novos'])} entradas novas e {len(r['retirados'])} retiradas. São declarações dos corpos já alojados, não observações novas.\n"
s+=tabela(['Série','Dimensão','Código','Rótulo literal','sha256'],[(x['serie'],x['dimensao'],x['codigo'],x['rotulo'],x['sha256']) for x in r['novos']])
s+=tabela(['Conferência dirigida','Antes','Depois'],[(nome,(j/(nome+'-antes.codigo')).read_text().strip(),(j/(nome+'-depois.codigo')).read_text().strip()) for nome in ['rotulos','origens','ferramentas','ambiente','indice','definicao-serie']])
briefs=ler('briefs-divergencia.json')
s+=f"\nForam regenerados {len(briefs)} resumos de briefs isentos. A prova compara os bytes com a cabeça de main que foi fundida e afirma que a única diferença é a anonimização de caminhos. Código da conferência depois: `{(j/'briefs-depois.codigo').read_text().strip()}`.\n"
s+=tabela(['Brief','Resumo trazido por main','Resumo do texto anonimizado'],[(x['ficheiro'],x['sha256_prescrito'],x['sha256_depois']) for x in briefs])
s+=tabela(['Conferência adicional','Código'],[(nome,(j/(nome+'.codigo')).read_text().strip()) for nome in ['serie-jd1-final','cartao-final-dirigido','forma-serie-depois','forma-serie-ledger','forma-serie-typecheck']])
s+='### Comparação das páginas\n'
s+=f"O guião `auditar-j.mjs` comparou {len(i['comparacoes'])} páginas com a construção conservada da cabeça `{i['base']}`. As linhas YAML conservaram todos os campos exceto `definition_sources`. O HTML conserva o texto e a estrutura; a comparação só retira esse campo dos blocos JSON antes de exigir igualdade. Não foram necessárias capturas novas.\n"
s+=tabela(['Página','Bytes iguais','Igual sem o campo novo'],[(r['pagina'],r['iguais'],r['iguais_sem_definition_sources']) for r in i['comparacoes']])
s+=f"\nA comparação alargada encontrou {i['html_todo']['paginas_antes']} páginas HTML antes e {i['html_todo']['paginas_depois']} depois, com {len(i['html_todo']['alteradas'])} páginas alteradas. Nos {len(i['json'])} JSON comparados, o livro inteiro e os recibos do JD1, só definition_sources difere.\n"
s+='### Cabeças, commits e códigos lidos dos ficheiros\n'
s+=tabela(['Repositório','Base','Cabeça do código'],[(k,c['base'],c['cabeca']) for k,c in commits.items()])
s+=tabela(['Repositório','Commit','Assunto'],[(k,c['hash'],c['assunto']) for k,r in commits.items() for c in r['commits']])
codigos=[]
for nome in ['build','verify','typecheck','motor','series','cruzamento']:
 h=(p/('motor.cabeca' if nome=='motor' else 'cabeca')).read_text().strip()
 if nome in ['series','cruzamento']:h+='; motor '+(p/'motor.cabeca').read_text().strip()
 codigos.append((str((p/(nome+'.codigo')).relative_to(b)),(p/(nome+'.codigo')).read_text().strip(),h))
s+=tabela(['Ficheiro','Código','Cabeças'],codigos)
s+='### Tentativas anteriores à conferência final\n'
for tentativa in sorted(b.glob('portoes-j-previa*')):
 codigos={f.stem:f.read_text().strip() for f in tentativa.glob('*.codigo')}
 s+=tabela(['Pasta','Portão','Código'],[(tentativa.name,k,v) for k,v in sorted(codigos.items())])
s+='As tentativas prévias são diagnóstico, não prova final de ambas as árvores limpas. A primeira expôs os resumos de briefs incompatíveis com os textos anonimizados. A segunda parou na expectativa das marcas de anonimização. A tentativa com motor foi interrompida porque o teste sintético herdou a opção do motor real; conserva só os códigos que chegaram a ser escritos, incluindo o código de interrupção do executor. Outra comparação prévia detetou o efeito de apresentação das segundas fontes. A tentativa seguinte revelou a seleção de formatos por posições antigas nas plantas do índice; o portão do motor terminou nessa tentativa sobre a árvore limpa. O ensaio das etapas restantes encontrou a segunda fonte em falta na definição da série. Depois dessa correção, os portões foram repetidos nas novas cabeças. A conferência final foi repetida depois dos commits, sem ficheiros de produto por registar.\n'
s+='\nOs portões correram sobre as árvores limpas nas cabeças do código. A corrida do motor e a do sítio foram executadas em paralelo, cada uma com os seus estados, cabeças, horas e código real, sem alterações de ficheiros durante as medições. Foram lidos os estados e as cabeças no início e no fim. `verify` executou a cadeia integral de `npm run verify`. As séries e o cruzamento usaram `RESEARCHHUB_DIR=<motor>`, este último com `--with-origin`. Os commits posteriores guardam apenas as provas e o relato. A resposta comunica a cabeça final, sem inventar o hash do commit que contém este texto.\n'
s+='\nA primeira tentativa de cruzamento não tinha `RESEARCHHUB_DIR` e consultou outra árvore do motor. Foi recusada; a repetição com a worktree autorizada passou. Os códigos e registos de ambas estão em `j/`. Não se confundiu essa tentativa com a prova final.\n'
ambito=ler('ambito.json')
s+=f"\nA regra do publicador conserva o sha256 `{ambito['regra_sha256']}` da cabeça de partida. No motor mudaram apenas: "+', '.join('`'+x+'`' for x in ambito['ficheiros_motor_alterados'])+f". Ficheiros de outras corridas alterados: {len(ambito['ficheiros_proibidos_alterados'])}. Os trailers foram conferidos em `j/trailers.json`.\n"
s+='### Custo\n\nA linha `tokens used` não estava disponível nesta sessão. O custo não foi estimado nem confundido com o alvo do mandato.\n'
pagina=b/'LEIA-ME.md';texto=pagina.read_text();titulo='\n## A passagem RP4-n-j (a integração com o JD1)';seguinte='\n## A passagem RP4-n-i\n'
if titulo in texto:
 a=texto.index(titulo);z=texto.index(seguinte,a);texto=texto[:a]+texto[z:]
assert seguinte in texto
pagina.write_text(texto.replace(seguinte,s+seguinte,1))
