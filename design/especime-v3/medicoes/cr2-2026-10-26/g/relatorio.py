"""Compõe o relatório da CR2-g a partir das provas medidas."""
import json
from pathlib import Path
p=Path(__file__).resolve().parent
r=json.loads((p/'razoes.json').read_text());m=json.loads((p/'mudancas.json').read_text());f=json.loads((p/'frases-depois.json').read_text())
def data(s):return '.'.join(s[:10].split('-')[::-1])
s='''# CR2-g: datas das revisões, nomes da casa e notas de provisório

A CR2-f confundia o dia em que o painel viu a revisão com o dia da releitura pelo cliente da casa. Corrigiram-se por guião as razões das quinze atualizações de 26.10, a partir dos dois registos ALARM fornecidos pela direção. `date`, `kind`, `old_value` e `new_value` ficaram iguais; o guião confere também todos os outros campos, admitindo apenas as substituições pedidas nas razões de proveniência. A história selada passou sem alteração: quatro controlos e dezoito plantas.

## Datas e registos, linha a linha

Os carimbos seguintes são os que os registos escrevem no seu próprio fuso, apresentados na forma da casa. Nas nove linhas A, o guião confirmou que o valor novo de 19.10 é o valor novo de 26.10. Na linha B, o painel passou de 70,3 a 70,2 entre as duas leituras; o campo «valor antigo» do alarme de 26.10 continua a referir o valor publicado, 70,0, e não o último valor visto pelo painel.

| Linha | Caso | Registo de 19.10: carimbo anterior → novo | Registo de 26.10: carimbo anterior → novo |
|---|---|---|---|
'''
for x in r:
 def cel(reg):
  return f"{data(reg['antiga'])} → {data(reg['nova'])} (`{reg['ficheiro']}:{reg['linha']}`)" if reg else 'Ausente'
 s+=f"| `{x['id']}` | {x['caso']} | {cel(x['registo19'])} | {cel(x['registo26'])} |\n"
s+='''
## As quinze razões novas, nas duas línguas

'''
for x in r:s+=f"**`{x['id']}` (caso {x['caso']})**\n\nPT: {x['reason']}\n\nEN: {x['reason_en']}\n\n"
s+='''## «O que mudou», como imprime no dist

As onze observações irmãs reutilizam a declaração do nome do cartão principal na escada comum dos nomes. A associação está em `src/data/nomes-das-medidas.mjs`, sem criar nomes novos. Os lugares continuam em `src/data/lugar-das-linhas.mjs`; acrescentar as irmãs à lista de cartões de Portugal seria confundir uma observação anterior ou europeia com uma medida principal. Conferiram-se no HTML trinta entradas, quinze por edição, uma atualização por linha. A prova completa, incluindo o texto do par de valores, está em `g/mudancas.json`. A primeira implementação reutilizava a marca do ficheiro do cartão principal sem uma entrada para o identificador da irmã. A construção e a voz recusaram essa marca. A declaração final regista as onze irmãs em `NOMES_DO_PROJETO`, copiando o par de nomes da medida principal, e deixa a escada comum dos nomes intacta.

| Linha | PT | EN |
|---|---|---|
'''
for x in r:
 pt=next(e for e in m if e['id']==x['id'] and e['lang']=='pt');en=next(e for e in m if e['id']==x['id'] and e['lang']=='en')
 s+=f"| `{x['id']}` | {pt['texto']} | {en['texto']} |\n"
s+='''
## Ferramentas e frases que mudaram

`--published-at` recusa «a linha já tem published_at», exige que o conjunto dos campos alterados seja exatamente `{published_at}` e volta à planta do dia do acesso no lugar do carimbo. O cabeçalho explica a leitura da árvore de trabalho: a aplicação pode ainda não estar em HEAD e é conferida contra a base selada e o registo. A conferência auxiliar confirmou a inserção válida, a recusa de data existente, a recusa de nenhuma mudança, a planta do acesso e a alteração de outro campo.

O comparador conserva `.claim-provisorio` no texto lido do HTML. Reconstituiu-se a medição anterior, com notas, pela cabeça `442b284e229408018e8c97c59dadd285a526bf3c`, anterior à aplicação CR2, sem alterar o retrato histórico. A primeira medição de diagnóstico ainda só abrangia os cinquenta parágrafos dos resolvedores e encontrou zero mudanças; a medição final inclui as réguas das duas linhas que perderam «p»: cinquenta e quatro textos, quatro mudados, todos conferidos no HTML. As cinquenta frases dos resolvedores continuam iguais. Antes e depois visíveis:

| Linha | Edição | Antes | Depois |
|---|---|---|---|
'''
for x in f['comparacao']:
 if x['mudou']:s+=f"| `{x['id']}` | {x['lang']} | {x['antes']} | {x['texto']} |\n"
s+='''
## Corrida pela raiz, dívida pendente e higiene

A corrida pela raiz não escreveu reconferências: encontrou as 91 já escritas nesse dia, com zero novos alarmes e avisos. Os 17 «igual» de 26.10 vieram da corrida da worktree. A formulação «91 reconferências, zero alarmes» não descrevia o que a corrida pela raiz fez; foi corrigida no relatório consolidado.

As duas linhas de dívida pública de 2025 continuam adiadas porque são pontos da série por país: a regra S6 recusa valores que divirjam da série e o gerador atual não relê a fonte nem escreve a história de cada ponto (VS6). Aplicar só as linhas quebraria essa correspondência. Até à UE1-c, o leitor vê no cartão da dívida pública 2024 na leitura de outubro e 2025 na leitura de abril, sem uma leitura de outubro coerente dos dois períodos.

Minor 11 a 14 ficam declarados para a higiene, sem alteração nesta passagem: «Próxima verificação 21.10.2026» já passada nos recibos da dívida; duas releituras de 26.10 no mesmo recibo sem identificar qual é qual; `verificacao.mjs` conserva 17 alarmes até 02.11. O sinal global não foi reescrito por uma corrida delimitada.

## Códigos e custo desta passagem

'''
for nome in ['build','ledger-check','check-voz','check-registo','check-cartao','check-cruzamento','typecheck']:
 s+=f"- `{nome}`: {(p/(nome+'.codigo')).read_text().strip()}, registo `g/{nome}-g.log`.\n"
s+='''
A construção deu 1 na voz pelas marcas de origem dos nomes das irmãs. A corrida isolada da voz deu 1 pelo mesmo motivo; cartões deu 1 em doze títulos de recibos, porque a primeira implementação só alterava a escada do cartão e não a declaração comum do nome. A correção final põe os nomes na declaração comum `NOMES_DO_PROJETO`, usada pelas duas escadas. Não se repetiram a construção nem as seis conferências pedidas. `sincronizar-marcas.mjs` corrigiu apenas a origem declarada dos nomes em 28 páginas do HTML já gerado, conservando o texto, e sincronizou o espaço estreito dos milhares nas duas razões do PIB. O diagnóstico final `conferir-marcas.mjs` confere todas as marcas afetadas contra a declaração e chama a conferência dos recibos K17. O resultado está em `g/marcas-conferidas.json`; o código dos comandos anteriores não é apresentado como verde. A cadeia da construção depois da voz não foi executada. Uma nova construção integral fica para a aterragem.

Uma construção e seis conferências pedidas, uma vez cada; o cruzamento incluiu `--with-origin` e a construção usou a worktree do motor por `RESEARCHHUB_DIR`. A construção inclui as conferências da sua própria cadeia. Conferências auxiliares: história do valor uma vez; ferramenta uma vez; duas reconstituições do antes e duas comparações de frases (diagnóstico e versão final); duas conferências das trinta entradas (antes e depois da correção das marcas), mais um diagnóstico final das marcas e dos recibos K17. Não se correu a corrida inteira dos portões, nem capturas, nem o gate do motor. O motor conserva `d8f0513b0713bedbd73f0c510bed875659a2f04f`.

A tabela consolidada corrige CR2-d para as 21 chamadas medidas no ficheiro de custo antes do commit e da inspeção final; CR2-e tem 17 conforme este mandato. A contagem CR2-g e os tokens medidos estão em `g/custo.json`, com o momento da medição. A cabeça e o commit finais são inspecionados depois do pedido ao escrivão e comunicados na resposta.
'''
(p/'RELATORIO.md').write_text(s)
consolidado=p.parent/'LEIA-ME.md';antigo=consolidado.read_text();marcador='\n---\n\n## Histórico até CR2-f\n\n'
if marcador in antigo:antigo=antigo.split(marcador,1)[1]
consolidado.write_text(s+marcador+antigo)
print('Relatório CR2-g e relatório consolidado compostos com as provas medidas.')
