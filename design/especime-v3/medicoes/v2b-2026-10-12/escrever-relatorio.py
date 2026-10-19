"""Escreve o relatório de paragem a partir das medições desta passagem."""
import json
from pathlib import Path

base = Path(__file__).resolve().parent
data = json.loads((base / 'partida.json').read_text())
cross = json.loads((base / 'cruzamento.json').read_text())
checks = json.loads((base / 'verificacoes.json').read_text())
cfp = data['cfp']

text = f'''# V2-b: paragem antes da construção

A entrega dos três itens está bloqueada. A afirmação qualitativa do CFP não cabe na forma numérica usada pelo V2-a, e a conferência de origem já falha em ficheiros das pensões na cabeça de partida. Nenhuma página nova foi construída, nenhuma linha foi criada ou exportada e nenhum portão foi alterado.

## As provas da paragem

### V2B-1: a linha obrigatória do CFP não tem grandeza numérica

O §0.4 pede `afirmacao-cfp-parecer-05-2026-oe2027`. A linha continua ausente. O documento e as palavras existem: o problema é a forma da linha. A marca do V2-a é `afirmacao: true`, confirmada em `src/lib/ledger.mjs`, nas três linhas e no relatório do V2-a. Não é só o prefixo.

`publisher/oe1_common.py`, função `observation`, exige `value` e `unit` e chama `number(value)`. O validador do sítio, `src/lib/ledger.mjs`, exige uma cadeia de valor não vazia, uma unidade e a presença do valor no excerto. O V2-a já registou esta limitação no seu `LEIA-ME.md`: a conclusão do CFP ficou como apoio, sem número inventado nem afirmação independente.

`medir-partida.py` executa a recusa numérica real do motor e um ensaio do validador real do sítio, só em memória. O ensaio usa o excerto e a data lidos do PDF, deixa `value` e `unit` vazios e não escreve uma linha. As mensagens são:

'''
for result in data['prova_motor']:
    text += f"- Motor: `{result['mensagem']}`.\n"
for error in data['prova_sitio']['errors']:
    text += f'- Sítio: `{error}`.\n'
text += '''
O número do parecer, o ano e a previsão do PIB não são valores desta afirmação. Atribuir-lhe qualquer um deles seria mudar o significado dos dados. Também não se substituiu a citação obrigatória por uma linha do PIB nem por prosa sem token.

Decisão: parar nesta questão, pelo §1 e pela regra dos portões que protegem números. O mandato prevê alargar o resolvedor para ler campos literais, mas não define a forma de uma afirmação sem grandeza nem a apresentação do seu recibo. A solução recomendada para um mandato corrigido é uma forma explícita de afirmação textual, sem `value` nem `unit`, com proveniência, atribuição, data e excerto obrigatórios e plantas próprias nos dois lados da exportação. Isso altera o contrato do livro e dos recibos; não foi tratado como uma ambiguidade pequena nem implementado nesta passagem.

### V2B-2: o endosso e o aviso são uma frase contínua

'''
text += f'''A capa, lida por `pdftotext -layout` e vista na renderização, diz Parecer n.º {cfp['numero']}, de {cfp['data']}. A conclusão foi lida e vista na página {cfp['pagina_pdf']} do PDF. O corpo corresponde ao recibo do pedido e ao resumo da linha do PIB: `{cfp['sha256']}`.

O parágrafo integral é:

> {cfp['excerto']}

O §0.4 fala em duas frases e manda acabar a do endosso em «endossa as previsões macroeconómicas». O PDF continua «apresentadas, dando nota que os riscos…» na mesma frase. Decisão pequena: a citação fiel é o parágrafo contínuo acima, sem o dividir, repetir ou truncar. Esta decisão não resolve a falta de forma da linha.

A extração selada na linha atual do PIB contém «número 4do artigo»; a leitura por `pdftotext` e a imagem da página mostram o espaço em «número 4 do artigo». A linha existente não foi corrigida nem reexportada nesta passagem. O novo excerto, quando houver forma para o alojar, deve preservar o espaço confirmado.

Documento no motor: `{cfp['ficheiro_motor']}`. Recibo: `{cfp['recibo']}`. `cfp-inspecao.json` regista as imagens da capa e da conclusão vistas nesta passagem, com dimensões e sha256; as imagens ficam fora do repositório. As páginas de direitos já alojadas em `source/v2a/direitos/` ficaram intactas. Nenhum pedido novo à rede; a tranca HTTP alternativa não foi usada.

### V2B-3: a origem das pensões já não coincide na partida

`RESEARCHHUB_DIR=<motor> npm run check:cruzamento -- --with-origin` saiu a {cross['codigo']}. `cruzamento.log` guarda a saída e `cruzamento.json` os resumos. Os ficheiros divergentes são:

'''
for e in cross['divergencias']:
    text += f"- `{e['origem']}`: registo `{e['registo']}`; motor `{e['motor']}`.\n"
text += '''
Os bytes do commit anterior do motor coincidem com o resumo registado no sítio em ambos os casos. O diff do commit `101887c` troca as referências ao commit antigo pelas referências traduzidas da história nova. Não se alteraram os números; os bytes da proveniência mudaram e o cruzamento acusa essa mudança.

Decisão: manter a recusa. Não atualizar resumos à mão nem tocar nos ficheiros de outra corrida. A retoma precisa de uma travessia regular destes artefactos corrigidos, com a conferência de origem verde. Este erro antecede qualquer alteração do V2-b.

## A repetição do §0

'''
text += f'''Cabeça do sítio: `{data['cabeca_sitio']}`. Cabeça do motor: `{data['cabeca_motor']}`. `git merge-base --is-ancestor main HEAD` no sítio e `git merge-base --is-ancestor master HEAD` no motor deram {data['ancestral_main']} e {data['ancestral_master']}. Não houve fusão.

O guião conferiu individualmente {data['total']} identificadores: {data['afirmacoes']} afirmações e {data['numericas']} linhas numéricas. `partida.json` guarda, por linha, valor, unidade, período, fonte, documento, atribuição, data, excerto, ressalva e sha256 do YAML. Os valores das quinze linhas coincidem com o §0 após normalizar apenas os espaços de milhares. Todas têm ressalva.

| Identificador | Valor | Unidade | Período |
|---|---|---|---|
'''
for ident, row in data['linhas'].items():
    text += f"| `{ident}` | {row['value']} | {row['unit']} | {row['reference_date']} |\n"
text += '\nAs três afirmações, lidas dos ficheiros:\n\n'
for ident, row in data['linhas'].items():
    if not row['afirmacao']:
        continue
    text += f"- `{ident}`: {row['source']}; «{row['document']['title']}»; {row['document']['locator']}; atribuição «{' / '.join(row['attributed_to'])}»; data {row['reference_date']}; excerto «{row['excerpt']}».\n"
comparison = data['item_2']
text += f'''
A comparação do item 2 foi refeita como números, retirando os espaços de milhares e interpretando a vírgula decimal. Os valores {', '.join(comparison['valores_do_quadro'].values())} são todos diferentes de {comparison['valor_afirmado']}. As condições individuais estão em `partida.json`, campo `item_2.diferentes`. Esta condição não bloqueia o item.

**V2B-4, diferença medida:** a explicação tem as secções `{', '.join(data['explicacao_dinheiro_estado']['seccoes'])}`. O §0 enumera só as três primeiras; existe também `divida-e-saldo`. Nenhuma linha citada pela explicação coincide com as linhas do V2-a. A porta temática continuaria a ser necessária, exatamente na secção `por-funcao` fixada pelo mandato. Não foi acrescentada enquanto os itens estão bloqueados.

## Verificações e entrega

'''
for label, result in checks['comandos'].items():
    text += f"- `{label}`: {result['estado']}; código {result['codigo'] if result['codigo'] is not None else 'não disponível'}; registo `{result['registo']}`.\n"
text += '''
**V2B-5:** o pedido dos portões de partida foi feito pelo escrivão, com o motor, numa pasta temporária, com a árvore limpa. Estava à espera da tranca de outra worktree quando se confirmou o bloqueio de origem. Tentou-se encerrar apenas esse processo em espera; a sandbox recusou `PermissionError: [Errno 1] Operation not permitted`. Não se pediu escalada nem se removeu a tranca de outra construção. O resultado efetivamente recebido consta da lista acima.

Os ficheiros do lançador foram afastados por mudança de nome, conservando o descritor aberto, e repostos no fim. `registos-lancador.json` compara o sha256 imediatamente antes e depois de cada mudança de nome. O registo pode crescer durante a corrida; não se afirma que o seu conteúdo ficou imóvel entre a saída e o regresso. Nenhum ficheiro `RELATORIO.*` entra no commit.

A medição pode repetir-se com `python3 design/especime-v3/medicoes/v2b-2026-10-12/medir-partida.py --motor <motor> --saida <temporario>/partida.json`. As duas provas da recusa não escrevem nos livros. `escrever-relatorio.py` gera este relatório a partir dos JSON guardados.

| Entrega do mandato | Estado |
|---|---|
| Nova afirmação do CFP e exportação | Bloqueadas pela V2B-1 |
| Três itens e sete partes em cada edição | Não construídos |
| Auditoria das palavras e cinco plantas dos itens | Não implementadas |
| Primeira página, rodapé e portas de integração | Não alterados |
| Capturas das páginas e manifesto | Não realizados, pois as páginas não existem |
| Prova dos toques no telefone | Não realizada |
| Portões na cabeça final de implementação | Não há cabeça de implementação |
| Leitura da direção e leitura a frio | Não lançadas |

Nenhuma parte obrigatória foi omitida numa página publicada, pois nenhuma página foi construída. As frases opcionais não foram selecionadas. Os bloqueios não foram contornados com conclusões, recomendações ou opiniões de substituição. Não houve publicação, push ou commit no motor. A entrega é este relatório de paragem e as medições, não a aceitação do V2-b.

tokens used: não disponível.
'''
(base / 'LEIA-ME.md').write_text(text)
