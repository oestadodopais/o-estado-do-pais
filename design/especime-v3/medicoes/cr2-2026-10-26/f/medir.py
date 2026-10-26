"""Acrescenta a continuação CR2-f sem apagar as medidas anteriores."""
import json
import subprocess
from pathlib import Path
p=Path(__file__).resolve().parent
base=p.parent
ler=lambda f:json.loads(f.read_text())
codigos={f.stem:int(f.read_text()) for f in sorted(p.glob('*.code'))}
r=ler(base/'medidas.json')
rec=ler(p/'recibos-cr2.json');frases=ler(p/'frases-depois.json');leituras=ler(p/'leituras-comparadas.json');lugares=ler(p/'lugares.json')
atual={'partida':ler(p/'partida.json'),'codigos':codigos,'lugares':{k:v for k,v in lugares.items() if k!='linhas'},'recibos':{k:v for k,v in rec.items() if k!='recibos'},'frases':{'total':len(frases['comparacao']),'iguais':sum(not f['mudou'] for f in frases['comparacao']),'mudadas':[f for f in frases['comparacao'] if f['mudou']],'todas_no_html':all(f['html_confere'] for f in frases['comparacao']),'paginas':len(frases['paginas'])},'leituras':{k:v for k,v in leituras.items() if k!='leituras'},'motor':{'cabeca':subprocess.check_output(['git','-C',str(Path.cwd().parents[1]/'ResearchHub-worktrees'/Path.cwd().name),'rev-parse','HEAD'],text=True).strip(),'alterado_nesta_passagem':False},'construcoes':1,'conferencias_pedidas':7,'conferencias_adicionais':{'categorias':6,'corridas':7},'corridas_inteiras':0,'capturas':0}
r.update(gerado_por='f/medir.py',estado='CR2-f: quinze revisões com lugares conferidos no HTML; duas dívidas pendentes da UE1-c',continuacao_cr2f=atual)
(base/'medidas.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
tabela='\n'.join(f'| `{k}` | {v} |' for k,v in codigos.items())
linhas='\n'.join(f"| `{l['id']}` | {l['lugar']} | {l['declaracao']} | "+', '.join('`'+t['ficheiro']+'`' for t in l['tematicas'] if t['lang']=='pt')+' |' for l in lugares['linhas'])
custo=ler(p/'custo.json')
res=f'''# CR2-f: lugares declarados e continuação do CR2-d

A construção única `f/build-f.log`, com código em `f/build-f.code`, deu {codigos['build-f']}. Os quinze lugares foram conferidos no HTML. Acrescentaram-se onze declarações em `src/data/lugar-das-linhas.mjs`: seis agregados da União, pela coordenada selada `EU27_2020`, seguindo a dívida das famílias da União; cinco valores de Portugal de 2024, pela única coordenada `PT`, seguindo as cinco declarações de 2024 do C2. Quatro linhas de 2025 já tinham lugar pela tabela `DOMINIO_DAS_MEDIDAS`. A mesma construção chegou depois a `check:voz` e recusou o inventário das frases: 102 revisões de proveniência no HTML contra 72 ainda declaradas. As duas frases antigas foram marcadas como retiradas, com a razão, e as duas novas classificadas como conteúdo, seguindo a forma do C2. Não se alteraram números, fontes, pessoas ou guardas. Não se repetiu a construção; o seu código 1 fica conservado. A voz e as cinco conferências seguintes que ficaram por executar na cadeia foram corridas isoladamente, com códigos próprios.

## As cinco paragens

1. Painel delimitado contra bases de 28.09: código 1; direção repetiu com bases vivas de 26.10, código 0 (91 reconferências, zero alarmes e avisos). Prova histórica em `painel-raiz.resumo.txt`.
2. CR2-b: série S6, código 1 na construção e no livro, porque as duas dívidas de 2025 diferiam dos pontos da série. A reposição de `3a8932b67` conservou os valores publicados; ambas esperam pela UE1-c.
3. CR2-c: gerador sem releitura e sem história VS6/S8. Ensaio válido 1; invocação anterior com caminho incorreto 2. Não se alterou o motor.
4. CR2-d: selos das atualizações retiradas, códigos 1 na construção e livro. A direção repôs os selos em `c63fa86e7`; CR2-e confirmou o livro com 0.
5. CR2-e: falta de lugar declarado, código 1 na construção. CR2-f acrescenta as onze entradas em falta, sem duplicar as quatro declarações existentes. `check:pais`, incluído na construção, valida a derivação independente das coordenadas e o lugar das mudanças.

## Os lugares e as páginas medidos

`f/lugares.mjs` lê as coordenadas do livro, as réguas e entradas do `src/` e exige valores `[data-claim]` nas páginas temáticas das duas edições. `f/lugares.json` guarda por linha os ficheiros de origem, cartões, páginas, painéis da primeira página e textos encontrados no HTML. A declaração da dívida pública de 2024 também se confirma no painel `estado` da primeira página. As ausências dos outros painéis são registadas, sem atribuir a uma linha uma presença que não tem. Não houve capturas.

| Linha | Lugar | Declaração | Página temática PT |
|---|---|---|---|
{linhas}

## Recibos, frases e comparações

`f/partida.json`: 15 linhas atualizadas, 45 entradas de 26.10 (uma atualização e duas proveniências por linha), duas pendentes; as 17 conservam «diverge» de 26.10. `recibos-cr2.mjs` leu {rec['recibos_lidos']} recibos: {rec['recibos_certos']} certos, {rec['atualizados_certos']} atualizados e {rec['pendentes_certos']} pendentes. A planta do recibo adulterado foi detetada. Os quatro recibos das duas dívidas conservam 89,7 e 81,7 e a divergência, sem atualização de 26.10; mostram o aviso do valor em uso e não mostram data de publicação, porque as linhas pendentes não a declaram. A primeira medição procurava o valor em h1, mas a página põe o nome no título e o valor em .linha-valor; o guião foi corrigido, com uma planta adicional que adultera o valor. As falhas intermédias e os códigos ficam preservados.

`frases-cr2.mjs depois`: {atual['frases']['total']} frases, {atual['frases']['iguais']} iguais à partida, {len(atual['frases']['mudadas'])} alteradas; todas conferidas no HTML: {'sim' if atual['frases']['todas_no_html'] else 'não'}. Inventário de {atual['frases']['paginas']} páginas que citam uma das 17 linhas, em `f/frases-depois.json` (inclui recibos e registos, não é uma comparação de páginas antes/depois). `leituras-cr2.mjs`: {leituras['leituras_comparadas']} leituras de {leituras['cartoes']} cartões, {leituras['leituras_com_texto_mudado']} textos alterados e {leituras['ramos_que_mudaram_de_sentido']} inversões em {leituras['ramos_lidos']} ramos. A planta do comparador foi detetada. Os guiões de leituras passaram a aceitar uma pasta de saída, preservando os resultados anteriores. O comparador de frases foi corrigido para ler o parágrafo das caixas sem incluir o título e comparar o texto sem notas de estatuto nas duas representações; guarda as notas de estimativa e de provisório separadamente, verificadas pelas conferências de explicações e cartões. As três recusas intermédias do guião ficam nos registos. A entrada cr2 no registo de revisões do inventário fica por ler, para a leitura cruzada antes da fusão. O comando sinais deu 0 e registou uma frase de naoDiz da explicação dinheiro-do-estado-2026 guardada fora da página; não é uma frase nova nem foi alterada nesta passagem.

## Códigos lidos dos ficheiros

| Corrida | Código |
|---|---|
{tabela}

Uma construção e sete conferências pedidas, uma vez cada, por `curto.sh`; sete corridas adicionais em seis conferências (voz duas vezes; nomes, língua, formato, navegação e sinais uma vez cada), para completar a cadeia interrompida; onze corridas em seis medições auxiliares (partida e lugares uma vez cada, recibos três vezes, frases quatro vezes, leituras e comparação uma vez cada). Os registos estão em `f/`, com caminhos locais substituídos por marcas. A construção inclui as suas próprias conferências encadeadas, identificadas no registo; não se executou a corrida inteira dos três portões. Não houve navegador, capturas, publicação ou gate do motor. O motor ficou em `{atual['motor']['cabeca']}`, sem alterações. `medidas.json` mantém as continuações anteriores e acrescenta `continuacao_cr2f`.

## O que continua aberto

A UE1-c deve reler as séries por país e conservar os recibos e a história de cada ponto para aplicar as duas revisões de dívida pública de 2025. A leitura a frio, corrida inteira, capturas e aterragem ficam com a direção. `src/data/verificacao.mjs` conserva os 17 alarmes semanais; esta passagem não corre o painel nem reescreve esse sinal.

Custo medido antes do commit: {custo['total_chamadas']} chamadas de ferramentas. tokens used: {custo['tokens']['total_tokens'] if custo['tokens'] else 'não exposto'} (total acumulado observado no registo, incluindo entrada em cache). O custo desta passagem está em `f/custo.json` e na continuação CR2-f de `custo.json`, com o momento da medição. A configuração declarada no mandato é Sol 6.1 medium; não se inventa identificador interno. Os valores antigos e novos das quinze linhas e as provas das passagens anteriores seguem no histórico do LEIA-ME.md.

'''
(base/'f/RELATORIO.md').write_text(res)
velho=(base/'LEIA-ME.md').read_text().split('## Histórico até CR2-e (estado anterior, conservado como prova)\n\n')[-1]
(base/'LEIA-ME.md').write_text(res+'---\n\n## Histórico até CR2-e (estado anterior, conservado como prova)\n\n'+velho)
print(json.dumps({'codigos':codigos,'recibos_certos':rec['recibos_certos'],'frases':atual['frases'],'ramos_invertidos':leituras['ramos_que_mudaram_de_sentido']},ensure_ascii=False))
