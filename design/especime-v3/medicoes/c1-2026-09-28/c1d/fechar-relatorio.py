"""Fecha a secção C1d a partir das provas e dos códigos lidos de ficheiro."""
import json
from pathlib import Path
AQUI=Path(__file__).resolve().parent
BLOCO=AQUI.parent
def ler(nome):return json.loads((AQUI/nome).read_text())
def fmt(n):return f'{n:,}'.replace(',',' ')
m=ler('medidas.json');custo=ler('custo.json');capturas=ler('capturas-depois.json')
assert not m['erros']
portoes={nome:int((BLOCO/'portoes/c1d'/f'{nome}.codigo').read_text()) for nome in ('build','verify','typecheck')}
assert set(portoes.values())=={0}
cabeca=m['portoes']['build']['cabeca']
text=f'''
## C1d

Esta secção regista a segunda passagem de correção, orientada pela leitura
`design/especime-v3/critica/LEITURA-c1c-2026-09-28.md` e pela triagem do lugar de
direção. Substitui o que a primeira entrega e a C1c dizem em contrário.
A dívida das famílias da União continua em **49,2**, com a atualização e a
proveniência do acesso da C1c. A C1d não mudou nenhum valor do livro.

| Item da triagem | Resultado | Prova |
| --- | --- | --- |
| Plantas, achados 1, 2, 3, 5 e 13 | São as cinco plantas do pacote, todas apanhadas. Não foram tratadas como defeitos do ramo. | `design/especime-v3/critica/LEITURA-c1c-2026-09-28.plantas.json`. |
| Achado 8 | Fora do mandato C1. Continua na I150; a nova primeira página e os blocos das séries tratam das referências em falta. | Triagem do lugar de direção e `design/especime-v3/ISSUES.md`. |
| 1. Painel e rede, achado 9 | O cliente conserva a causa tipada. Nome que não resolve e ligação cortada fazem três tentativas; a corrida termina em `SEM_REDE` ou `PARCIAL_SEM_REDE`, sem escrever uma falsa entrada `inacessivel`. Uma resposta HTTP de erro continua a ser uma resposta da fonte. Um tempo esgotado reconfirma a rede para distinguir os dois casos. | `c1d/motor-rede-real.log`: servidor local que corta a ligação, nome que não resolve, HTTP de erro, recuperação na terceira tentativa e códigos de paragem. `c1d/motor-commit.log` termina em `GATE: PASS`; código lido de `motor-commit.codigo`. |
| 2. História do valor, achado 12 | O valor publicado tem de ser o último `new_value`, na forma numérica da casa. Cada `old_value` tem de continuar o valor anterior. Um registo independente conserva as entradas já seladas e recusa a sua retirada. | `ledger/historias-valores.json`, `scripts/selar-historia-valores.mjs`, `c1d/historia-valores.json`. As plantas de valor editado e atualização retirada integram `ledger:check` e, por isso, `verify`. |
| 3. Excertos, achado 10 | Cada um dos 17 excertos ganhou a entrada `proveniencia` sobre `excerpt`, com a data e as razões exatas do mandato. Os valores e os acessos ficaram. | `c1d/excertos.json`, o guião `c1d/excertos.py`, as linhas e a conferência final do livro. |
| 4. Estimativa, achado 4 | A marca `e` rende «valor estimado» / «estimated value» a partir da nota selada, nas mesmas superfícies HTML da marca provisória: leitura, régua, título do recibo e país. | `c1d/plantas-confianca.json`, K17, M8 e `c1d/recibos-finais.json`; capturas das duas edições. |
| 5. Resultado da releitura, achados 6, 7 e 15 | A tentativa sem resposta só fala desse pedido. A releitura anterior à atualização confirma o valor anterior, que aparece ao lado. A ausência diz «Segunda leitura: ainda nenhuma» / «Second reading: none yet». | `c1d/recibos-finais.json`, plantas de ausência e de valor anterior; frases registadas no inventário. |
| 6. Limite municipal, achados 7 e 18 | A linha e a entrada no cruzamento voltaram exatamente a `a677770f`, com o anuário, o acesso de agosto e a releitura de setembro, sem as sete entradas posteriores. O cartão conserva o denominador sustentado no literal DGAL. A migração pelo motor está aberta na I168. | `c1d/limite-reposto.json`, `c1d/cruzamento.codigo`, comparação de bytes em `c1d/medir.py`, `c1d/lingua-reposta.json`, K17 e capturas de Évora. |
| 7. Objetivo do BCE, achado 11 | Tem a classe própria `objetivo-institucional`, definida nas duas edições. O cartão não usa a classe do painel macroeconómico nem dá um veredicto nacional. | `ledger/allowlist.yml`, `c1d/k17.json` e a conferência do cartão em `c1d/recibos-finais.json`. |
| 8. Competitividade, achado 21 | A origem passou a citar uma frase inteira e contígua do discurso alojado. A frase do Eurostat sustenta o sinal; a do BCE sustenta a ligação entre preços relativos e competitividade. | `c1d/origens.json`, `c1d/medidas.json` em `literais`, K17; resumo do corpo conservado. |
| 9. PRR, achado 19 | As cinco linhas conservam as entradas corretas de instantâneos. A regra documenta esse caso estreito, confere todas as cadeias e anuncia cada instantâneo aceite. Não há dispensa silenciosa. | Lista abaixo; `ledger/README.md`, `c1d/historia-proveniencia.json`, com plantas de outro conjunto, razão sem identificação e cadeia contraditória sem releitura anterior. |
| 10. História legível, achado 17 | Os campos têm nomes correntes. Mesmo dia, natureza e razões formam uma linha, preservando todos os campos e âncoras. Os nomes portugueses citados levam `lang` na edição inglesa. A norma diz quando o acesso acompanha a atualização. | `c1d/plantas-confianca.json`, `c1d/recibos-finais.json`, recibos PRR nas capturas e regra escrita no livro. |
| 11. Forma do encontrado, achado 14 | O valor encontrado usa a mesma vírgula decimal e o mesmo separador de milhares do valor selado, nas duas edições. | Plantas da forma numérica e recibo europeu: «49,2» em ambas as edições. |
| 12. Calendário, achado 16 | Os quatro inícios selados usam o dia de instalação. A dívida do fim de 2024 fica antes da instalação de outubro seguinte. O início sem data do primeiro mandato fica aberto na I169; o limite esquerdo é um recorte do eixo e a F18 não o prende a uma instalação inventada. | `c1d/datas-evora.json`, `c1d/calendario.json`, planta da faixa coerentemente deslocada para janeiro e capturas do calendário. |
| 13. Caminhos e nomes, achados 22 e 23 | O interpretador saiu do registo antigo. O detetor cobre caminhos absolutos fora do repositório, o anfitrião e os nomes lidos em memória do Git. As quatro referências nominais do inventário dizem «o diretor». | `c1d/medidas.json` em `caminhos`, com conhecidos-positivos e controlo negativo das ligações relativas do BCE. Nenhum nome usado como amostra foi copiado para a prova. |
| 14. Relatório e registos, achados 20, 24 e 25 | A primeira parte ficou identificada como histórica. O ramo com a União em 49,2 está dito abaixo. As contagens batem com o livro. As corridas novas guardam a árvore; as antigas têm complemento explicitamente reconstituído. Custos separados e corpos de todas as marcas entregues. | `c1d/ramo-divida.json`, `contagens-registo.json`, `corridas-c1c.json`, `custo.json`, `bandeiras-provadas.json` e `corpos-bandeiras/`. |

**As cinco cadeias PRR.**

| Linha | Decisão e conferência |
| --- | --- |
'''
for cid in ['evora-prr-aprovado-2026','evora-prr-pago-2026','evora-prr-vencido-aprovado-2026','evora-prr-municipio-contratado','evora-prr-universidade-contratado']:
    text+=f'| `{cid}` | Entradas conservadas. Os instantâneos datados apontam para o mesmo conjunto estável, identificado nas razões em ambas as línguas. A cadeia é conferida e os dois casos são anunciados pelo livro. |\n'
text+=f'''
A exceção não aceita outro conjunto, uma data posterior à entrada, um nome de
ficheiro sem a data, um documento que não seja ficheiro com cálculo sobre os
ficheiros, nem uma razão que omita o endereço do instantâneo. Os restantes
endereços continuam sujeitos à cadeia normal. As plantas guardam a falha exata.

**Números, origens e marcas.**
A comparação com a base C1d conferiu {fmt(m['linhas_conferidas'])} linhas: nenhum
valor mudou. A única mudança de `source_url` foi a reposição autorizada do limite
municipal. O livro tem {m['contagens_registo']['correcao']} correções,
{m['contagens_registo']['atualizacao']} atualizações e
{m['contagens_registo']['proveniencia']} revisões de proveniência. O inventário
retira as contagens substituídas e declara a contagem vigente.

Com Portugal em 53,9 e a União em 49,2, o ramo da dívida das famílias continua
«acima», nas duas edições; o ramo da referência da Comissão continua «abaixo ou
no limite». As frases resolvidas estão em `c1d/ramo-divida.json`.

Cada uma das 18 marcas tem a coordenada selada, as dimensões, a posição no
cubo, o valor e o estado copiados do corpo. São 17 marcas `p` e uma `e`.
`c1d/bandeiras-provadas.json` liga cada célula à cópia integral alojada em
`c1d/corpos-bandeiras/`, com o resumo conferido. Não se fez um novo pedido para
fabricar esta prova: são os corpos que o cliente da casa alojou na C1c.

**Árvores usadas nas corridas.**
As corridas do gerador às 13:45 e do painel às 13:52 usaram a árvore de trabalho
que veio a ser `cf1082be38dda1bf044f1fbfb9b258357faeb98a`, ainda por guardar no
Git, e não apenas a cabeça que o registo antigo mostrava. Os complementos
`c1c/gerador-rede.arvore.json` e `c1c/painel.arvore.json` dizem que são
reconstituições, identificam os ficheiros e o commit posterior, e não fingem um
resumo integral tirado na altura. `c1d/corridas-c1c.json` junta-os.

Nas corridas novas, `registar-c1.py` guarda antes de executar a cabeça, se a
árvore está limpa, o resumo da diferença e o resumo de cada ficheiro alterado
ou ainda não seguido pelo Git. O portão do motor correu no gancho que antecedeu
`{m['cabeca_motor']}`; os quatro ficheiros dessa árvore
conferem byte a byte com o commit. Código efetivo: **0**. A base do motor desta
passagem é `{m['base_motor']}`, já com as saídas do painel
que a direção juntou antes do lançamento. Nenhum ficheiro protegido mudou desde
essa base.

**Cabeças, portões e capturas.**
A base do sítio é `{m['base']}`. A cabeça de código final
é `{cabeca}`. Os códigos abaixo foram lidos dos ficheiros
acabados de escrever em `portoes/c1d/`, cada portão no seu comando. Antes de
cada corrida inteira foi consultado `pgrep -fl "astro build|npm run verify"`;
as corridas de outras worktrees foram deixadas terminar.

| Portão | Código | Cabeça medida |
| --- | --- | --- |
'''
for nome,codigo in portoes.items():text+=f"| `{nome}` | {codigo} | `{m['portoes'][nome]['cabeca']}` |\n"
text+=f'''
A construção preparatória e as conferências que a corrigiram ficam em `c1d/`,
com o seu código e estado da árvore. `c1d/tentativas.json` explica as falhas de
preparação, a anotação de tipo em falta, a declaração sem uso e a construção
interrompida pelo construtor para a retirar. Regista também o portão da língua:
a reposição do anuário precisava das declarações que o acompanhavam em
`a677770f`, repostas sem mudar a guarda, a fonte ou o número. Não são
apresentadas como os
portões finais. As capturas finais vêm da cabeça dos portões: {len(capturas['resultados'])}
páginas e {len(capturas['recortes'])} recortes, nas duas edições e nas larguras
390, 768, 1024, 1280 e 1600. Incluem os recibos alterados, os cartões, o país,
Évora e o calendário. `c1d/capturas-depois.json` contém a matriz e os resumos;
`c1d/paginas-depois/INDICE.json` sela as páginas e folhas realmente servidas.

A medição final está em `medidas.json`, secção `C1d`, e em `c1d/medidas.json`.
O relatório é conferido por `conferir-relatorio.py`, com zero números sem
ficheiro e conhecido-positivo encontrado, em `c1d/relatorio.json`. A medição de
caminhos e nomes tem zero achados no âmbito declarado. Os diretórios de
navegação relativa dos corpos BCE e os nomes portáveis dos intérpretes são
explicitados como controlos negativos; não dispensam nomes pessoais.

**Custos separados.**
A passagem C1c até à paragem consumiu 677 285 símbolos, conforme o registo do
lançamento fornecido pelo lugar de direção. Essa unidade não foi convertida
em tokens. A retoma C1c, entre a autorização e o início da C1d, teve
{fmt(custo['retoma_c1c']['total_tokens'])} tokens expostos pelo runtime. Esta
leitura substitui o corte parcial da retoma que a secção anterior registava,
sem apagar o seu instante de medição.

A C1d, até `{custo['ultima_leitura']['hora']}`, teve
{fmt(custo['passagem_c1d']['input_tokens'])} tokens de entrada, dos quais
{fmt(custo['passagem_c1d']['cached_input_tokens'])} em cache, e
{fmt(custo['passagem_c1d']['output_tokens'])} de saída, num total de
{fmt(custo['passagem_c1d']['total_tokens'])}. O raciocínio está incluído na
saída e a cache na entrada. `c1d/custo.json` guarda as fronteiras e os
cumulativos reais. Não se estima preço nem se contam revisões automáticas;
não houve agentes nesta passagem. O trabalho depois desse corte ainda consome.

**Commits do ramo.**
A lista seguinte inclui as cabeças da primeira entrega, da C1c, as entradas
da direção e os commits desta passagem. O commit de entrega da C1d é o que
contém esta versão do relatório e de `RESPOSTA-codex-c1d.md`, filho direto da
cabeça de código final acima. Só acrescenta as provas; o seu próprio resumo
não pode constar do conteúdo que o determina. A mensagem final da sessão,
fora do ramo, identifica-o sem reescrever a resposta guardada.

| Árvore | Commit | Assunto |
| --- | --- | --- |
'''
for arvore,lista in m['commits'].items():
    for c in lista:text+=f"| {arvore} | `{c['hash']}` | {c['assunto']} |\n"
text=text.replace('| sitio |','| sítio |')
text+='''
A C1d fecha o mandato com a I150 fora desta passagem, a migração de fonte na
I168 e a data inicial em falta na I169. O assunto dos sinais negativos da
primeira leitura continua aberto como já estava. Nenhuma mudança foi enviada
para o remoto.
'''
p=BLOCO/'LEIA-ME.md';antes=p.read_text().split('\n## C1d\n')[0];p.write_text(antes.rstrip()+'\n'+text)
resposta=f'''C1d concluída na cabeça de código `{cabeca}`.

Os três portões do sítio e o portão do motor terminaram a zero. Nenhum valor
do livro mudou nesta passagem. A dívida das famílias da União conserva 49,2.

Foram entregues as plantas, os corpos das marcas, as capturas nas duas edições
e nas cinco larguras, o relatório e a medição de caminhos e nomes a zero com
conhecidos-positivos. Ficam abertas I150, I168 e I169 no âmbito descrito no
relatório. Não houve envio para o remoto.
'''
(BLOCO/'RESPOSTA-codex-c1d.md').write_text(resposta)
