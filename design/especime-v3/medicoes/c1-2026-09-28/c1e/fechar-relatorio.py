"""Fecha a secção C1e com os códigos lidos e a paragem conservada."""
import json
from pathlib import Path
import subprocess
AQUI=Path(__file__).resolve().parent
BLOCO=AQUI.parent
SITIO=AQUI.parents[4]
def ler(p):return json.loads(p.read_text())
def git(*args):return subprocess.check_output(['git',*args],cwd=SITIO,text=True).strip()
m=ler(AQUI/'medidas.json')
portoes={n:int((BLOCO/'portoes/c1e'/f'{n}.codigo').read_text()) for n in ('build','verify','typecheck')}
cabecas={n:(BLOCO/'portoes/c1e'/f'{n}.cabeca').read_text().strip() for n in portoes}
assert len(set(cabecas.values()))==1
cabeca=cabecas['build']
p=ler(AQUI/'proveniencia.json');c=ler(AQUI/'plantas-confianca.json');priv=ler(AQUI/'privacidade-dist-anterior.json');rede=ler(AQUI/'motor-rede-real.json')
texto=f'''

## C1e

**Entrega parcial, com a história do PRR parada.** A nova guarda encontrou
{len(p['erros_do_livro'])} entradas de proveniência anteriores ao acesso em vigor,
nas cinco linhas do PRR. Não há história tipada que prove os acessos anteriores.
Nenhuma dessas entradas foi alterada e a guarda não foi dispensada. Os restantes
acertos estão implementados e têm as provas isoladas abaixo; a construção e as
capturas finais ficam dependentes desta paragem. A aceitação integral não está
satisfeita.

Esta secção substitui a C1d onde a terceira leitura a frio a corrigiu. Os achados
1, 2, 3, 4 e 6 correspondem às cinco plantas do pacote, registadas em
`design/especime-v3/critica/LEITURA-c1d-2026-09-28.plantas.json`; não foram
corrigidas como se fossem defeitos do ramo. O achado 6 revelou também a falta
real da conferência de todos os campos. O achado 7 fica na nova I170, para um
bloco próprio do cimo dos recibos. O achado 14 pertence ao guião do pacote do
lugar de direção.

| Ponto da triagem | Trabalho e limite | Prova |
| --- | --- | --- |
| 1, achado 5 | As duas edições dizem «Releitura tentada a DD.MM.AAAA, sem valor lido» / «Re-read attempted on DD.MM.AAAA, no value read». As células e o inventário seguem. | `c1e/plantas-confianca.json`: redação do pedido sem resposta e afirmação sobre o dia inteiro recusadas nas duas línguas. Capturas pendentes. |
| 2, achado 6 | Todas as cadeias de proveniência são percorridas, incluindo os campos do documento e o excerto. Continuidade, campo final e acesso em vigor são conferidos. A regra não interpreta a data escrita na razão. A aplicação encontrou a paragem do PRR, detalhada abaixo. | `c1e/proveniencia.json`, `c1e/paragem-prr.json`, `ledger/README.md`; o livro sai com erro. |
| 3, achado 8 | As plantas prometidas estão discriminadas abaixo. A alegação de prova do `lang` nos nomes portugueses da história inglesa sai do relatório: não há caso real nem planta dessa regra. O mecanismo existente não é apresentado como provado. | `c1e/plantas-confianca.json`, `c1e/proveniencia.json`; erratas na secção C1d. |
| 4, achado 9 | As calculadas dizem «Recalculada em cada construção a partir das suas origens» / «Recomputed at every build from its sources». | Controlo e planta de «ainda nenhuma» nas duas edições em `c1e/plantas-confianca.json`. Capturas pendentes. |
| 5, achado 10 | O transporte sem causa classificada volta ao vigia. O corte durante o corpo e o `URLError` sem causa ficam sem rede quando o vigia falha. O comentário enumera as falhas que se repetem; recusa de ligação e erro de certificado não se repetem neste circuito. | `c1e/motor-rede-real.json`: {rede['quantidade']} controlos; servidor real com corte depois da linha de estado, três tentativas e corrida parcial sem escrita falsa. `c1e/motor-commit.log`: `GATE: PASS`, código {m['motor']['codigo']}. |
| 6, achado 11 | O mesmo detetor lê os nomes do Git e confere os ficheiros de `dist/`, com plantas em cópias de páginas só em memória. Esta é a guarda das quatro frases retiradas do inventário. Integra `build` e `verify`. | `c1e/privacidade-dist-anterior.json`: {format(priv['ficheiros'], ',').replace(',', ' ')} ficheiros, {priv['quantidade']} achados, conhecidos-positivos detetados. A cabeça das páginas é a anterior, declarada abaixo. |
| 7, achado 12 | O início sem data leva a classe própria de limite aberto, com a mesma regra de traço descontínuo do fim em aberto. A I169 continua aberta para a data. | `c1e/calendario-memoria.json`: planta que retira essa marca nas duas edições. Captura real pendente. |
| 8, achado 13 | A razão inglesa do acesso da União escreve «49,3». | Comparação integral das linhas em `c1e/medidas.json`: só essa razão mudou. Nenhum valor nem endereço mudou. A travessia isolada passou, código lido de `c1e/cruzamento.codigo`. |

**A paragem, por linha.** O acesso atual é 20.08.2026 e nenhuma das cinco
linhas traz uma entrada `proveniencia` sobre `access_date`. O registo tipado
não sustenta os acessos anteriores. Não se deduz um dia de acesso da data de um
instantâneo, da razão ou da data de uma correção. A correção da história exige
prova e decisão pelo circuito do motor, sem apagar as entradas existentes.

| Linha | Entradas que a guarda recusa |
| --- | --- |
'''
for linha in ler(AQUI/'paragem-prr.json')['linhas']:
    lista='; '.join(f"`{c['field']}` de {c['date']}" for c in linha['entradas_anteriores'])
    texto+=f"| `{linha['id']}` | {lista} |\n"
texto+=f'''
**Plantas que existem.** A conferência de proveniência tem {p['contagens']['controlos']}
controlos e {p['contagens']['plantas']} plantas. Para cada campo há uma cadeia
coerente e plantas de continuidade quebrada, último valor diferente e entrada
anterior ao primeiro acesso. Para os instantâneos há plantas separadas de:
documento sem classe ficheiro; lista de ficheiros vazia; endereço novo diferente
do vigente; recurso de outro conjunto; recurso posterior à entrada; nome do
ficheiro sem a data; razão portuguesa sem endereço; razão inglesa sem endereço.
As razões são mantidas coerentes nas plantas que mudam o endereço, para não
confundir as condições.

A conferência de confiança tem {c['contagens']['controlos']} controlos e
{c['contagens']['plantas']} plantas detetadas. A C1e acrescenta plantas da forma
do encontrado (ponto decimal, sinal, precisão e separador de milhares), das duas
redações excessivas da tentativa, do rótulo e da frase vazios em desacordo e da
calculada apresentada como sem releitura. Todas correm nas duas edições. O
calendário tem sete plantas por edição, incluindo o início sem data desenhado
como fechado. A planta dos nomes lê os nomes do Git e injeta-os numa cópia em
memória de uma página construída. Os nomes não são escritos nos artefactos.

**Cabeças e portões.** A cabeça de código do sítio é `{cabeca}`; a do motor é
`{m['cabeca_motor']}`. A árvore que o portão do motor leu está em
`c1e/motor-commit.arvore.json`, com os resumos dos ficheiros ainda por guardar
nesse instante. A medição compara esses bytes com o commit final do motor.
Nenhum ficheiro protegido do motor mudou.

Antes de cada portão inteiro foi corrido `pgrep -fl "astro build|npm run verify"`.
As corridas aguardaram os portões dos outros construtores. Cada comando do sítio
ficou registado separadamente, com código acabado de escrever:

| Comando | Código lido | Cabeça | Ficheiro |
| --- | --- | --- | --- |
'''
for nome,codigo in portoes.items():texto+=f"| `npm run {nome}` | {codigo} | `{cabecas[nome]}` | `portoes/c1e/{nome}.codigo` |\n"
texto+=f'''
`build` e `verify` param no livro, pela falta de prova dos acessos anteriores do
PRR. Não chegaram às restantes células. O portão não foi contornado para
construir páginas. `typecheck` correu de forma independente. A primeira corrida, conservada em
`c1e/primeira-corrida/`, encontrou quatro parâmetros sem tipo na função
alargada. A anotação da lista foi corrigida; os dados e a guarda não mudaram.
`c1e/tentativas.json` distingue esses códigos dos finais.

**Capturas.** Não há capturas novas a apresentar como finais. `dist/` conserva
`{m['capturas']['dist_anterior']}`, uma construção anterior à C1e. A guarda nova
de privacidade foi exercida sobre essa construção e as suas cópias plantadas;
isso prova o detetor, não a apresentação das alterações da C1e.
`c1e/medidas.json`, em `capturas.recibos_a_captar`, enumera os
{m['capturas']['quantidade_de_recibos']} recibos cujo conteúdo muda. Depois de
resolvida a paragem, faltam a construção válida, as capturas nas duas edições e
nas cinco larguras e a captura da faixa de Évora. As plantas em memória não
substituem essas capturas.

**Custo e privacidade.** `c1e/custo.json` separa a passagem pelo pedido de
lançamento e pelos contadores acumulados do runtime. O corte é o instante
escrito no ficheiro; não inclui o fecho posterior, revisões automáticas ou um
preço que não foi exposto. `c1e/medidas.json` mede os ficheiros atuais do bloco,
os ficheiros do construtor e os ficheiros tocados do motor: zero caminhos ou
nomes, com conhecidos-positivos de caminhos, intérprete fora do repositório,
anfitrião e nomes lidos do Git. `c1e/relatorio.json` é a conferência dos números
deste relatório, com o seu próprio conhecido-positivo. A preparação detetou
um caminho absoluto da shell no guião de espera. Esse guião passou a usar
apenas o nome da shell; o detetor não mudou. A ocorrência está registada em
`c1e/privacidade-preparacao.json`.

**Commits.** A tabela anterior conserva todos os commits até à cabeça de código
da C1d. Os seguintes ligam essa cabeça à entrega da C1d, à leitura da direção e
à C1e. O último commit da C1e é o que contém esta versão do relatório e
`RESPOSTA-codex-c1e.md`, filho direto da cabeça de código acima; entrega apenas
as provas. O seu próprio resumo não pode ser escrito nos seus bytes. A resposta
da sessão indica-o fora do ramo.

| Cabeça | Assunto |
| --- | --- |
'''
for linha in git('log','--reverse','--format=%H %s','6bbe1cee..HEAD').splitlines():
    h,assunto=linha.split(' ',1);texto+=f'| `{h}` | {assunto} |\n'
texto+=f"\nMotor C1e: `{m['cabeca_motor']}`. Os commits anteriores do motor estão nas secções anteriores e na lista integral de `medidas.json`. Nenhum envio para o remoto.\n"
p=BLOCO/'LEIA-ME.md';base=p.read_text().split('\n## C1e\n')[0].rstrip()
base=base.replace('As secções «C1c» e «C1d» substituem-na','As secções «C1c», «C1d» e «C1e» substituem-na')
base=base.replace('Plantas da forma numérica e recibo europeu:', 'Controlos da forma numérica, sem plantas na C1d, e recibo europeu:')
base=base.replace('endereços continuam sujeitos à cadeia normal. As plantas guardam a falha exata.', 'endereços continuam sujeitos à cadeia normal. Na C1d havia apenas as plantas\nde outro conjunto, razão sem endereço e cadeia contraditória. A C1e acrescenta\nas condições que faltavam; a alegação anterior de cobertura completa estava errada.')
p.write_text(base+texto)
(BLOCO/'RESPOSTA-codex-c1e.md').write_text(f'''C1e entregue parcialmente na cabeça de código `{cabeca}`.

A nova guarda travou o livro: 16 entradas de proveniência nas cinco linhas do
PRR são anteriores ao acesso de 20.08.2026, sem história tipada que sustente
os acessos anteriores. Não alterei essas linhas nem dispensei a guarda.

Os restantes acertos e as plantas estão guardados. O motor passou o portão
completo. O sítio tem build {portoes['build']}, verify {portoes['verify']} e typecheck {portoes['typecheck']}; a paragem
impede a construção nova e as capturas finais. Nenhum valor ou endereço mudou.

O relatório C1e e as medições registam a paragem, as provas e o que falta.
A I170 está aberta. Não houve envio para o remoto.
''')
