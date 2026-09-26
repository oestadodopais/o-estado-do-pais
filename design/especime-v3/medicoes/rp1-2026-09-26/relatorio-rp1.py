#!/usr/bin/env python3
"""Escreve ou confere o RP1c, incluindo toda a história do ramo e a entrega."""
import json
import subprocess
import sys
sys.dont_write_bytecode = True
from pathlib import Path
from importlib.util import spec_from_file_location, module_from_spec
AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[3]
spec=spec_from_file_location('registar',AQUI/'registar-rp1.py'); registar=module_from_spec(spec);spec.loader.exec_module(registar)
def git(*args):return subprocess.check_output(['git',*args],cwd=RAIZ,text=True).strip()
def n(v):return f'{v:,}'.replace(',',' ')
def cel(v):return str(v).replace('|','\\|').replace('\n',' ')
m=json.loads((AQUI/'medidas.json').read_text())['rp1c']
a=json.loads((AQUI/'acertos-rp1.json').read_text())
cabeca=m['cabeca_do_codigo']
commits=git('log','--reverse','--format=%H %s','334cc740..'+cabeca).splitlines()
assert commits==m['commits_sitio'],'A lista do projeto não cobre os commits até à cabeça medida'
motor_commits=subprocess.check_output(['git','log','--reverse','--format=%H %s','1d10b3f..HEAD'],cwd=registar.MOTOR,text=True).strip().splitlines()
assert motor_commits==m['commits_motor'],'A lista do motor não cobre o ramo completo'
head=git('rev-parse','HEAD')
if head!=cabeca:
 assert git('rev-parse','HEAD^')==cabeca and git('show','-s','--format=%s','HEAD')==m['entrega']['titulo'],'Há commits depois dos portões que o relatório não lista'
 mudados=git('diff','--name-only',cabeca,'HEAD').splitlines()
 assert all(p.startswith('design/especime-v3/medicoes/rp1-2026-09-26/') for p in mudados),'O commit de entrega alterou código medido'
antigo=registar.publico(subprocess.check_output(['git','show','42b3cadf:design/especime-v3/medicoes/rp1-2026-09-26/LEIA-ME.md'],cwd=RAIZ,text=True))
antigo=antigo.replace('`enquadramento-b2.json` guarda também os casos de `tests/pais/enquadramento-b2.mjs`.','`enquadramento-b2.json` guardava então apenas os casos do B2. A cobertura das réguas declaradas do RP1 foi acrescentada na peça RP1c; esta prova antiga não a cobria.')
resultados=[
('1, 2, 3, 4, 12','São as cinco plantas do pacote, todas achadas; não se transportou nenhum desses estragos para o ramo. Registo: `design/especime-v3/critica/LEITURA-rp1-2026-09-26.plantas.json`.'),
('5','Confirmado «subiram» e «rose» nas duas médias, em `leituras-seladas.json`.'),
('6','Terceira redação do RSI, com as idades sustentadas pelo INE e «pobreza extrema» pela página atual da Segurança Social. Acertos literais abaixo.'),
('7','Confirmadas as frases curtas e a correspondência das duas edições em `leituras-seladas.json`.'),
('8','Ressalva entre parênteses, com espaço acessível, no valor, na leitura e no recibo. K17 e M8 conferem a forma e recusam a bandeira colada.'),
('9','Expurgo de todo o bloco e das leituras a frio RP1. O medidor percorre todos os ficheiros, incluindo binários, e exerce o mesmo detetor sobre um ficheiro de ensaio fora do repositório. Não se tocaram outros blocos por esta razão.'),
('10','Os corpos alojados não dão o literal pedido para ligar a taxa homóloga à palavra inflação. Aplicada a alternativa prescrita «É a subida geral dos preços…», apoiada pela definição do IPC.'),
('11','Listas de ligação separadas por língua. «no» só na portuguesa. A planta inglesa «There were no» conserva a composição da folha e é recusada pela negação sem literal.'),
('13','O documento e o excerto no recibo usam a língua declarada da origem. L10, chamada por `check:lingua`, recusa a origem portuguesa marcada como inglesa nas duas edições.'),
('14','O recibo ordena valor, unidade e ressalva. O motor conserva o objeto JSON inteiro; as plantas recusam o corte dentro da cadeia, outro valor e outra nota. A reexportação muda o excerto da remuneração, não o valor; a V16 não exige entrada de correção.'),
('15','A preposição acompanha o período: «no» e «in the» nos trimestres, «em» e «in» nos restantes. A F1 recompõe-a e recusa «em 2.º trimestre» e «in 2nd quarter».'),
('16','Nomes corrigidos para «Pensão média anual» / «Average annual pension» e «Preços dos alimentos e das bebidas não alcoólicas» / «Prices of food and non-alcoholic drinks», incluindo as linhas anteriores. A inspeção do código encontrou uma diferença em relação à tabela do mandato: estes nomes não estão em `lingua-dos-titulos.mjs`, que declara títulos e rótulos da fonte; a K7 só proíbe «limiar» e «threshold». Não se mudou essa proteção. Os nomes são conferidos pela K1, a língua pela K4, e o ensaio RP1c fixa as quatro redações pedidas.'),
('17','Sem mudança nesta peça. Os excertos Eurostat montados a partir de etiquetas continuam assunto do motor, registado pelo lugar de direção.'),
('18','O glossário Eurostat foi pedido novamente no próprio bloco. `origens-rp1.py` confere todos os selos pelo manifesto, registo e bytes alojados, sem exceção por pasta; a planta sem ficheiro alojado é recusada.'),
('19','A origem dos tipos de pensão cita as categorias da dimensão do INE: «Total», «Invalidez», «Velhice», «Sobrevivência». O literal da doença profissional saiu deste apoio.'),
('20','`tests/pais/enquadramento-b2.mjs` percorre agora `REGUAS_DECLARADAS` e confere a ausência dos comparadores nas áreas e nos temas. O registo `enquadramento-b2.json` enumera as linhas RP1.'),
('21','A regra de publicação mantém-se. Os controlos aceitam publicação dentro do mês e do trimestre; a planta anterior ao período continua a falhar. As notas dos períodos anteriores explicam que `published_at` é a última atualização do quadro.'),
('22','A lista abaixo inclui os commits do lugar de direção e do construtor, nas três peças. O último é identificado por `HEAD`, o commit que contém esta entrega; o conferidor resolve-o no Git e exige o pai e o âmbito das alterações.'),
('23','O guarda procura os códigos literais «045», «0722», «041» na dimensão terceira do INE `0014663`, com conhecidos-positivos. Saíram as funções não chamadas de `medir-l1-rp1.mjs`; a referência B2 é citada abaixo.'),
]
linhas=['## RP1c','',
 f'Passagem de correção concluída. As {n(m["linhas_conferidas"])} linhas do projeto foram comparadas com a cabeça de entrada: {m["valores_alterados"]} valores alterados e {m["linhas_novas"]} linhas novas (`rp1c.linhas_conferidas`, `rp1c.valores_alterados`, `rp1c.linhas_novas`). Os únicos campos reexportados foram o excerto da remuneração e as notas dos períodos anteriores, discriminados em `rp1c.alteradas`.', '',
 'As secções anteriores descrevem entregas históricas. As provas atuais estão na chave `rp1c` de `medidas.json`; as cópias em `paginas-depois/` são desta cabeça. Os registos antigos foram expurgados de caminhos pessoais: `sanitizacao-rp1c.json` conserva os resumos antes e depois; os resumos dos registos em `medidas.json` foram recalculados, sem mudar códigos ou cabeças.', '',
 '| Achado | Resultado e prova |','|---|---|',*[f'| {i} | {r} |' for i,r in resultados],'',
 f'K16: {m["k16"]["erros"]} erros. K17: {m["k17"]["erros"]} erros nas palavras e {m["leituras_rendidas"]["erros"]} no HTML. As {m["frases_resolvidas"]} frases do bloco coincidem com a terceira redação fora dos {m["acertos"]["acertos"]} acertos abaixo; as {m["acertos"]["leituras_antigas_intactas"]} leituras anteriores estão intactas (`rp1c.acertos`).', '',
 '### Literais e acertos', '',
 'A metainformação `014-ine-0013420-minfo.html` não explicita as idades. A pesquisa no SMI devolveu conceitos relacionados; o conceito de juventude da população em idade ativa divide o intervalo entre as metades jovem e idosa. A página do INE `040-ine-idade-ativa-definicao-rp1c.html` diz literalmente «população residente em idade ativa (entre 15 e 64 anos)» e apoia os dois algarismos. Não se inferiu a idade dos beneficiários: o denominador continua a ser a população em idade ativa.', '',
 'A página atual do RSI carrega o conteúdo por um pedido público, selado em `038-seguranca-social-rsi-conteudo-rp1c.json`, campo `breadcrumb.description`. Os endereços antigos e a tentativa de guia que respondeu sem documento ficaram registados. O conceito do INE conserva o apoio ao programa de inserção no trabalho e na comunidade.', '',
 '| Medida e edição | Antes | Depois | Literal |','|---|---|---|---|']
for x in a['acertos']:
 linhas.append(f'| `{x["id"]}` · {x["lang"]} | {cel(x["antes"])} | {cel(x["depois"])} | '+ '; '.join(f'«{cel(ap["literal"])}» (`{ap["origem"]}.{ap["campo"]}`)' for ap in x['apoios'])+' |')
linhas += ['', 'As categorias da pensão são os objetos literais de `Dimensoes.Categoria_Dim` da resposta de metainformação `003-ine-0014532-meta.json`, também correspondentes às etiquetas de `009-ine-0014532-dados.json`. A nova origem `rp1-pensoes-tipos` conserva os campos, sem compor uma citação a partir de palavras dispersas.', '',
 'A ressalva usa «Dado provisório» da resposta do INE e «Provisional data» já declarada pelo motor, em minúsculas dentro dos parênteses. O valor mantém-se sozinho na marca `data-claim`.', '',
 '### Células e plantas', '',
 '| Célula | Forma nova | Proteção conservada |','|---|---|---|',
 '| Livro e exportador | Conferem os campos do objeto JSON completo do INE. | O valor, a bandeira e a nota têm de coincidir; um excerto cortado não passa. A regra dos excertos Eurostat mantém-se. |',
 '| K17 | Listas de ligação por língua e ressalva entre parênteses. | Palavras com conteúdo precisam de literal; cada marca continua presa à linha e à língua certa. |',
 '| M8 | Exige espaço, parênteses e palavras da nota. | Igualdade entre as linhas com bandeira e as ressalvas visíveis. |',
 '| L10 | Lê a língua declarada da origem, no documento e no excerto. | Uma transcrição portuguesa nunca passa marcada como inglesa. |',
 '| F1 | Recompõe também a preposição pela forma do período. | O período continua a vir do campo da linha, sem dia inventado. |',
 '| Réguas B2 | Percorre também a tabela declarada. | Nenhum comparador RP1 ganha cartão próprio. |',
 '| Origens | Confere todos os selos no alojamento, incluindo extrações. | Resumo, pedido e corpo têm de concordar, qualquer que seja a pasta. |','',
 f'As {len(m["plantas"]["plantas"])} plantas de `plantas-rp1.json` morderam. Os controlos da publicação dentro do período passaram. `planta-origens-rp1c.json`, `plantas-m8-rp1c.json` e a saída F1 em `portoes/rp1c/build.log` guardam as restantes provas. O portão do motor, executado pelo pre-commit, terminou a {m["motor_portao"]["codigo"]}, em `motor-rp1c.log`.', '',
 f'O medidor encontrou {m["caminhos"]["ficheiros_com_caminho_ou_utilizador"]} ficheiros com caminho pessoal ou nome do utilizador da máquina (`rp1c.caminhos`). O conhecido-positivo foi encontrado. As classes procuradas deram {m["classes_0014663"]["encontradas"]} ocorrências na dimensão indicada (`rp1c.classes_0014663`); cada código foi ainda introduzido num conjunto de ensaio e detetado.', '',
 'A referência da composição das portas é `design/especime-v3/medicoes/b2-2026-09-23/l1-depois.json`, citada aqui pelo caminho para integrar o pacote de leitura. Não é o antes desta peça. `l1-rp1.json` conserva essa referência e a cabeça dela; não houve agravamento de páginas anteriores.', '',
 '### Capturas, commits e portões', '',
 f'Foram guardadas {m["capturas"]["paginas"]} capturas de página e {m["capturas"]["recortes"]} recortes, nas duas edições e nas larguras '+', '.join(n(v) for v in m['capturas']['larguras'])+f' px, com {m["capturas"]["falhas"]} falhas. Os recortes com prefixo `rp1c-` cobrem remuneração, pensão, RSI, alimentos e inflação. `capturas-rp1c-depois.json` guarda as medidas e os resumos; `inspecao-visual-rp1c.json` identifica as imagens abertas.', '',
 f'Cabeça medida do projeto: `{cabeca}`. Cabeça do motor: `{m["cabeca_motor"]}`. O `INDICE.json` das páginas congeladas aponta para a mesma cabeça dos portões.', '',
 *['- Projeto: `'+c+'`.' for c in m['commits_sitio']],
 '- Projeto: `HEAD '+m['entrega']['titulo']+'`. Este é o commit que contém as provas; o pai é a cabeça medida acima.',
 *['- Motor: `'+c+'`.' for c in m['commits_motor']], '',
 '| Portão | Código lido do ficheiro | Cabeça medida |','|---|---|---|']
for nome,p in m['portoes'].items():linhas.append(f'| `{nome}` | {p["codigo"]}, de `portoes/rp1c/{nome}.codigo` | `{p["cabeca"]}` |')
linhas += ['', 'Cada portão completo correu no seu comando, uma vez nesta cabeça, com o código escrito de novo. As conferências de preparação estão na subpasta `preparacao/`. O último commit só entrega provas; `relatorio-rp1.py --verifica` confere a lista inteira contra o Git e recusa um commit de código posterior aos portões.', '',
 '### Custo e limites', '',
 f'A janela medida, do primeiro pedido RP1c ao último portão, durou {n(m["custo"]["segundos_da_janela"])} segundos (`rp1c.custo.segundos_da_janela`); exclui a leitura inicial. As contagens da sessão estão em `custo-rp1c.json`, cumulativas e sem estimativa monetária.', '',
 'Não ficaram correções desta tabela por fazer. O achado dos excertos Eurostat fica fora desta peça, por decisão do mandato. Não houve alteração de valores, novas medidas, gráficos, mudança da regra da primeira página, da leitura do país ou do rótulo de IA. Não houve `push`.', '']
esperado=antigo.rstrip()+'\n\n'+'\n'.join(linhas)
if '--verifica' in sys.argv:
 assert (AQUI/'LEIA-ME.md').read_text()==esperado,'O relatório não coincide com as medições, os literais e a história do ramo'
 print('RP1c: relatório, literais e lista completa de commits conferidos; entrega '+('na cabeça medida' if head==cabeca else head))
else:
 (AQUI/'LEIA-ME.md').write_text(esperado)
 print('RP1c: relatório escrito a partir das medições, dos literais e do Git.')
