#!/usr/bin/env python3
"""Escreve o relatório do bloco L1 (`LEIA-ME.md`) a partir de `medidas.json` e do registo dos acertos.

    python3 design/especime-v3/medicoes/l1-2026-09-24/escrever-leia-me-l1.py

Cada número do relatório sai de uma medição de `medidas.json`, pelo nome, e o nome
vai na mesma frase; os acertos saem de `acertos-l1.json`, palavra a palavra. O
guião recusa escrever se uma medição que o texto pede não existir. A prosa é do
construtor; os números não.
"""
import json
import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
M = {m['nome']: m['valor'] for m in json.loads((AQUI / 'medidas.json').read_text(encoding='utf-8'))['medidas']}
A = json.loads((AQUI / 'acertos-l1.json').read_text(encoding='utf-8'))


def v(nome, *chaves):
    if nome not in M:
        raise SystemExit(f'falta a medição «{nome}» em medidas.json')
    x = M[nome]
    for c in chaves:
        x = x[c]
    return x


def n(nome, *chaves):
    """Um número na forma portuguesa (vírgula decimal, espaço nos milhares), com o nome da medição."""
    x = v(nome, *chaves)
    if isinstance(x, float):
        s = f'{x:,.1f}'.replace(',', ' ').replace('.', ',')
    else:
        s = f'{x:,}'.replace(',', ' ')
    rotulo = nome + ('.' + '.'.join(str(c) for c in chaves) if chaves else '')
    return f'{s} (`{rotulo}`)'


def acertos():
    linhas = []
    for x in A['acertos']:
        lits = '; '.join(f"«{l['literal']}» (`{l['dono']}`, campo `{l['campo']}`)" for l in x['literais'])
        linhas.append(f"**{x['chave']}**, `{x['medida']}`. {x['porque']} Apoio: {lits}.")
        linhas.append('')
        for t in x['trocas']:
            vezes = f" ({t['vezes']} vezes, `acertos-l1.json`)" if t['vezes'] != 1 else ''
            linhas.append(f"- antes: `{t['antes']}`{vezes}")
            linhas.append(f"- depois: `{t['depois']}`")
        linhas.append('')
    return '\n'.join(linhas)


# O termo e as palavras de cada acerto da passagem de correção: prosa do
# construtor, e nenhum número; os literais saem de `termos_da_correcao`.
TERMOS = {
    'A18': ('7', '«em termos reais»', '«descontada a subida dos preços»'),
    'A19': ('8', '«em termos líquidos»', '«descontado o que reembolsaram»'),
    'A20': ('9', '«em termos líquidos»', '«descontado o que reembolsaram»'),
    'A21': ('10', '«rendimento mediano»', 'a frase «O rendimento mediano é o do meio: metade da população tem mais e metade tem menos.»'),
    'A22': ('11', '«outro cuidado formal»', '«um programa planeado por entidades públicas ou privadas reconhecidas, e não o cuidado dado pelos avós, por outros familiares, por amigos ou vizinhos, ou por uma ama profissional»'),
    'A23': ('12', '«rendimento disponível»', 'a frase «O rendimento disponível é o que o agregado recebe, do trabalho, de investimentos e de prestações sociais, depois de pagos os impostos e as contribuições sociais; os apoios à habitação descontam-se do rendimento e do que se gasta com a habitação.»'),
    'A24': ('13', '«rendimento disponível»', 'a mesma frase do A23'),
    'A25': ('14', '«produtores residentes»', '«as empresas, o Estado, as famílias e as instituições sem fim lucrativo que produzem no país»'),
    'A26': ('15', 'a população, sem a idade', '«dos `15` aos `64` anos», com os dois algarismos declarados'),
}


def tabela_dos_termos():
    linhas = ['| achado | acerto | medida | o termo | o que a leitura passa a dizer (PT) | os literais que o sustentam |', '|---|---|---|---|---|---|']
    for t in v('termos_da_correcao'):
        achado, termo, diz = TERMOS[t['chave']]
        lits = '; '.join(f"«{l['literal']}» (`{l['dono']}`, `{l['campo']}`{', no campo' if l['no_campo'] else ', FORA DO CAMPO'})" for l in t['literais'])
        linhas.append(f"| {achado} | {t['chave']} | `{t['medida']}` | {termo} | {diz} | {lits} |")
    return '\n'.join(linhas)


def testemunha(id_, nome):
    t = v('testemunhas_discordantes', id_)
    e, c = t['eurostat'], t['comissao']
    return (f"- **{nome}** (`{id_}`): a descrição do conjunto do Eurostat, criado a `{e['criado']}` (a anotação CREATED da resposta selada), diz "
            f"«{e['excerto']}»; a página da Comissão, lida a `{c['lido']}`, diz «{c['excerto']}»; manda a Comissão (`manda: {t['manda']}`).")


def planta_no_ramo(x):
    ok = 'sim' if x['ramo_e_o_antes'] and x['ramo_com_a_troca_e_o_depois'] else 'NÃO'
    return f"- **{x['id']}**, {x['descricao'].replace('<p>', '`<p>`')}: no pacote `{x['no_pacote']}`, no ramo `{x['no_ramo']}`; o ramo tem o sha256 de antes e, com a troca registada, dá o de depois: {ok}."


portoes = {p: v(f'portao_{p}') for p in ('build', 'verify', 'typecheck')}
cabeca = portoes['build']['cabeca']
simb = v('simbolos_do_construtor') if 'simbolos_do_construtor' in M else None

texto = f"""# L1 · a leitura de cada medida · o relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 24.09.2026, com a passagem de correção de 26.09.2026 depois da leitura a frio do Codex. Ramo `l1-2026-09-24` do sítio, rebaseado a 26.09.2026 sobre `main` em `1415e0c3` (o brief passou de `f0779f37` a `{v('brief_depois_do_rebase')[:8]}`, `brief_depois_do_rebase`); ramo `l1-2026-09-24` do motor, sobre `0f08171`. Os portões inteiros (`npm run build`, `npm run verify` e `npm run typecheck`) correram na cabeça `{cabeca[:8]}` (`cabeca_medida`), e o commit que entrega estas provas vem a seguir a ela e só acrescenta ficheiros desta pasta. As capturas do antes são da cabeça `{v('paginas_antes_construidas_de')[:8]}` (`paginas_antes_construidas_de`), a de partida, construída antes do rebase, e as do depois são da cabeça dos portões (`capturas_depois_de`). Cada número deste relatório sai de `medidas.json`, escrito por `medir-l1.py`, e o nome da medição vai ao lado dele; `conferir-relatorio.py` confere-os.*

## A passagem de correção (26.09.2026)

A leitura a frio do Codex (`gpt-5.6-sol`, `design/especime-v3/critica/LEITURA-l1-2026-09-26.md`) deu {n('achados_da_leitura')} achados numerados e apanhou as cinco plantas. Esta passagem segue o mandato do lugar de direção (`prompts/PROMPT-l1-opus-correcao.md`) achado a achado, sobre a cabeça que a leitura recebeu (`5a5185e0`, que o rebase reescreveu para `6584df72` com os mesmos ficheiros).

### O que era planta, confirmado no ramo (achados 1, 2, 5 e 6)

Os achados 1, 2, 5 e 6 são estragos plantados só nas cópias do pacote e não existem no ramo. Cada ficheiro estragado tem, no ramo, o sha256 de antes da planta ({n('plantas_da_leitura_confirmadas')} em {n('plantas_da_leitura')}), e a troca que o registo das plantas guarda, aplicada aos bytes do ramo, dá exatamente o sha256 da cópia estragada ({n('plantas_da_leitura_reproduzidas')} em {n('plantas_da_leitura')}); uma a uma (`plantas_da_leitura_no_ramo`):

{chr(10).join(planta_no_ramo(x) for x in v('plantas_da_leitura_no_ramo'))}

A segunda metade do achado 6 não é planta, e explica-se pelo próprio conferidor: o conhecido-positivo é o primeiro número, a partir de 987654321, que não está em nenhum JSON da pasta; a corrida do construtor escreveu o seu resultado em `conferencia-relatorio.json` e excluiu esse ficheiro de si própria, e a corrida do pacote leu-o. Na pasta como a leitura a recebeu há {n('achado6_ficheiros_json_na_pasta')} JSON; corrido como o pacote o corre, o conferidor lê {n('achado6_corrida_como_o_pacote', 'lidos')} e usa {n('achado6_corrida_como_o_pacote', 'conhecido_positivo')}; corrido como o construtor o correu, lê {n('achado6_corrida_como_o_construtor', 'lidos')} e usa {n('achado6_corrida_como_o_construtor', 'conhecido_positivo')}; e, sem o `conferencia-relatorio.json` na cópia, a corrida à maneira do pacote lê o mesmo que a do construtor e usa o mesmo número (o conhecido-positivo da medição `achado6_corrida_como_o_pacote`). O que o achado diz do conferidor é verdade e está no cabeçalho dele: achar um número num JSON não prova que ele mede o que a frase diz, e é por isso que o nome da medição vai ao lado de cada número.

### Os dois valores de referência (achados 3 e 4, I151)

A página do painel da Comissão foi pedida hoje pelo cliente da casa às `{v('comissao_hoje', 'hora')}`, HTTP {v('comissao_hoje', 'http')}, com o sha256 `{v('comissao_hoje', 'sha256_do_registo')}`; o endereço pedido redireciona para `{v('comissao_hoje', 'url_final')}`, e a cópia alojada no estudo 13 tem o mesmo resumo (`comissao_hoje`, `comissao_hoje_confirma`). Palavra por palavra, nos bytes, «{v('comissao_hoje', 'literais', 'taxa-de-cambio-efectiva-real-2025')}» aparece {n('comissao_hoje', 'ocorrencias', 'taxa-de-cambio-efectiva-real-2025')} vez e «{v('comissao_hoje', 'literais', 'desempenho-das-exportacoes-2025')}» {n('comissao_hoje', 'ocorrencias', 'desempenho-das-exportacoes-2025')} vez; a mesma procura numa cópia com os dois valores trocados não acha nenhum. A página de hoje confirma os dois valores, e a passagem não parou aí.

A discordância entra como terceira testemunha, declarada e datada, ao pé do `limiar` de cada medida em `src/data/figuras.mjs` (`testemunhaDiscordante`), e vai com a referência para `REFERENCIAS_DAS_MEDIDAS`, que é onde a K9 lê as testemunhas; os excertos e as datas recortam-se dos bytes selados por `origens-l1.py`, e `--confere` relê-os:

{testemunha('taxa-de-cambio-efectiva-real-2025', 'A taxa de câmbio efetiva real')}
{testemunha('desempenho-das-exportacoes-2025', 'O desempenho das exportações')}

Os veredictos ficam pela razão que os dois literais da Comissão dão: é a Comissão que fixa e revê os valores de referência do painel, e a página dela diz hoje «with thresholds of -/+3% for euro area countries and -/+10% for non-euro area countries» e «with a threshold of -3%». São esses os valores que os cartões rendem, e nenhum mudou. As descrições do Eurostat dizem outros, e a discordância deixou de estar escondida: fica declarada, com a data de cada fonte.

A K9 do `check:cartao` exige a uma testemunha discordante declarada as quatro coisas (o que a descrição do Eurostat diz, a data de criação do conjunto, o que a página da Comissão diz e a data de leitura) e quem manda, com os números de quem manda iguais aos que o cartão rende e os da outra diferentes, e o selo dos dois pedidos (ficheiro, campo, hora, cliente, sha256); e conhece as duas medidas pelo nome, como a K14 conhece as suas, para que tirar a testemunha a uma delas feche a construção. Testemunhas conferidas: {n('k9_testemunhas_discordantes_conferidas')}; plantas a morder: {n('k9_testemunhas_discordantes_plantas_mordidas')} de {n('k9_testemunhas_discordantes_plantas')} ({'; '.join('«' + x + '»' for x in v('k9_testemunhas_discordantes_plantas_nomes'))}). Nenhuma referência mudou de valor.

### O teste dos dois minutos (achados 7 a 14) e a idade da taxa de atividade (achado 15)

Cada termo ganhou a palavra corrente que um literal de origem selada sustenta, nas duas edições, e nenhum ficou como estava. As origens pediram-se hoje pelo cliente da casa (`indicators/out/l1-2026-09-26/` no motor, {n('pedidos_da_correcao')} pedidos, {n('pedidos_da_correcao_com_http_200')} com resposta 200, alojados no estudo 13 no commit do motor `{v('motor_commit_da_correcao')[:7]}`), e declaram-se em `ORIGENS_DAS_DEFINICOES` com o excerto literal e a data de leitura ({n('origens_da_correcao')} origens: `origens_da_correcao_nomes`; a da idade recorta-se da resposta de `tipslm60` que o bloco já tinha selado a 24.09.2026). Os acertos estão abaixo, palavra a palavra, em «Os acertos de palavras às leituras»; os {n('termos_da_correcao_literais')} literais que os sustentam estão todos no campo que citam ({n('termos_da_correcao_literais_no_campo')}, `termos_da_correcao`):

{tabela_dos_termos()}

O cuidado formal explica-se com a página do Eurostat que o bloco já tinha alojado, citada dela em vez de pedida de novo. O mandato apontava exemplos como o jardim de infância e os serviços organizados de cuidado, e a página não os dá: nenhuma das palavras procuradas aparece nela (`creches_palavras_na_pagina_alojada`), e a expressão «Formal childcare» aparece {n('creches_formal_childcare_na_pagina')} vezes. A leitura diz o que a página diz (o que o cuidado formal é, e o que fica fora dele) e não dá exemplos que ela não dá. A palavra «creche», que já estava na leitura, continua sem literal que a nomeie; fica para o lugar de direção.

A taxa de atividade passa a escrever «dos 15 aos 64 anos» nas duas edições, com os dois algarismos declarados e o literal na auditoria («economically active population aged 15-64»), como as outras idades. A pergunta da medida é do B2 e não muda: continua sem a idade.

### As duas leituras do lugar de direção (achados 16 e 19)

O lugar de direção reescreveu as duas no seu ficheiro, e elas vieram para `src/data/leituras-das-medidas.mjs` sem uma palavra mudada. A disparidade salarial fecha a oração com o valor, e o «provisório» da linha rende-se logo depois dele, antes do ponto; as câmaras dizem «o número de câmaras acima do limite era» e «o número sem valor publicado era», e concordam com «o número» seja qual for a contagem. Na disparidade, o A11 de sempre acompanha a frase nova (as empresas «com 10 ou mais trabalhadores», e a frase só no ramo do valor positivo): as trocas do A11 mudaram para a frase nova, e o que acertam é o mesmo. A auditoria relê as duas parte a parte: nas câmaras, «o número de câmaras acima do limite era» apoia-se na linha do limite legal, e as duas ligações seguintes seguem uma chave da prova e são contas. A V2 confere as contagens e não as palavras, e continua verde. `acertos-l1.py` sai com {n('acertos_confere_codigo')}, com {n('acertos')} acertos em {n('acertos_trocas')} trocas.

### O que não muda aqui (achados 17, 18 e 20)

Os achados 17 e 18 são sobre os recibos (a página de uma linha do livro-razão), que são do bloco B3, o recibo como página para pessoas, e não mudam aqui. O achado 20 é um limite do pacote de leitura, que não traz a história do repositório, e não do bloco: nada muda. Os achados 21 a 28 dizem o que está bem, e nada pedem.

### O ensaio a seco do lugar de direção sobre o ficheiro do sítio

O ensaio a seco (`design/observatorio/leituras/ensaio-a-seco.mjs`), que rende as leituras com um resolvedor independente do do sítio, corre sobre `src/data/leituras-das-medidas.mjs` com código {n('ensaio_a_seco_do_sitio_codigo')}: {n('ensaio_a_seco_do_sitio_cartoes_com_leitura')} cartões com leitura e {n('ensaio_a_seco_do_sitio_por_resolver')} frases com um pedaço por resolver; sobre uma cópia sem a leitura do PIB por habitante, conta um cartão a menos (o conhecido-positivo da mesma medição).

### Os ficheiros, as células, as plantas e os commits desta passagem

No sítio: `src/data/figuras.mjs` (as sete origens novas e as duas testemunhas), `src/data/referencias-das-medidas.mjs` (a testemunha vai com a referência), `src/data/leituras-das-medidas.mjs`, `tests/cartao/referencias.mjs` e `tests/cartao/cartao.mjs` (a K9), `tests/cartao/leituras-provadas.json` (a auditoria, reescrita por `escrever-auditoria-l1.mjs`), `design/especime-v3/INVENTARIO-FRASES.md` e `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`, e nesta pasta `origens-l1.py`, `acertos-l1.py` e o seu registo, `escrever-auditoria-l1.mjs`, `captar-l1.mjs`, `medir-l1.py` e este guião. No motor: `indicators/out/l1-2026-09-26/` e o estudo 13 (`motor_commit_da_correcao`). A célula que mudou de forma é a K9 (P: protege um número e a sua fonte), com as suas cinco plantas; a K17 não mudou de código, e as suas {n('k17_plantas')} plantas continuam a morder. Os commits desta passagem até à cabeça medida são {n('commits_da_correcao_contados')} (`commits_da_correcao`):

{chr(10).join('- `' + c + '`' for c in v('commits_da_correcao'))}

## O que ficou feito

Por baixo do número de cada cartão nacional há agora uma leitura em palavras correntes: o que o número quer dizer, como se compara com o período anterior e com a média da União onde a régua tem essas linhas, e de que lado do valor de referência está onde ele existe. A página do país rende {n('leituras_pais_pt_depois')} leituras na edição portuguesa e {n('leituras_pais_en_depois')} na inglesa, e a dos temas {n('leituras_temas_pt_depois')} e {n('leituras_temas_en_depois')}; nenhum cartão fica sem leitura (`cartoes_sem_leitura_<página>_<edição>_depois`, como a dos temas em inglês: {n('cartoes_sem_leitura_temas_en_depois')}), nenhum tem mais de uma (`cartoes_com_mais_de_uma_leitura_<página>_<edição>_depois`), e antes do bloco não havia nenhuma: {n('leituras_pais_pt_antes')} na página do país em português, e o mesmo nas outras (`leituras_<página>_<edição>_antes`). As palavras são as do lugar de direção, com {n('acertos')} acertos em {n('acertos_trocas')} trocas, todos abaixo; os números e os ramos são da máquina.

## O mandato, item a item

| # | o que | a medida | estado |
|---|---|---|---|
| 0 | O mapa do repositório | as citações conferidas à volta da linha citada: {n('mapa_citacoes_conferidas')}; longe da linha: {n('mapa_citacoes_longe')}; não encontradas: {n('mapa_citacoes_nao_encontradas')}. A secção nova «A leitura de cada medida», a K17, a leitura na V2 e no `auditaSelo()`, a célula 10 do `check:voz` e três armadilhas | feito |
| 1 | A declaração e o resolvedor | as leituras declaradas: {n('leituras_declaradas')}, tantas quantas a tabela das medidas do país obriga, com o cartão das câmaras (`medidasComLeitura()`); a construção fecha sem uma (a planta «a declaração retirada fecha o resolvedor», abaixo) | feito |
| 2 | A leitura no cartão | as marcas da fonte dentro das leituras: {n('marcas_da_fonte_nas_leituras_pais_pt')} na página do país e {n('marcas_da_fonte_nas_leituras_temas_pt')} na dos temas (o mesmo nas edições inglesas); as plantas do `auditaSelo()` a morder: {n('plantas_portoes_l1_do_audita_selo_que_morderam')} de {n('plantas_portoes_l1_do_audita_selo')} | feito |
| 3 | A folha | as medições de leitura nas capturas do depois: {n('capturas_depois_com_leitura')}; a 14 px: {n('capturas_depois_a_14px')}; na tinta: {n('capturas_depois_na_tinta')}; a 58ch: {n('capturas_depois_a_58ch')}; com a medida da pergunta, onde há pergunta: {n('capturas_depois_com_a_medida_da_pergunta')} de {n('capturas_depois_com_pergunta')}; cartões que transbordam: {n('capturas_depois_cartoes_que_transbordam')}; páginas que transbordam a 390 px: {n('capturas_depois_paginas_que_transbordam_a_390')} | feito |
| 4 | A auditoria das origens | as medidas auditadas: {n('k17_auditoria_medidas')}; as folhas: {n('k17_auditoria_folhas')}; as partes: {n('k17_auditoria_partes')} ({n('k17_auditoria_diz')} dizem o que a medida é, {n('k17_auditoria_conta')} são contas, {n('k17_auditoria_liga')} ligam); os apoios: {n('k17_auditoria_apoios')}; as origens usadas: {n('k17_auditoria_origens_das_leituras')}; os erros: {n('k17_erros_da_auditoria')}. As origens novas: {n('origens_novas')}; conferidas contra o motor, com as {n('testemunhas_conferidas_contra_o_motor')} testemunhas discordantes, {n('origens_conferidas')} | feito |
| 5 | A leitura rendida | os cartões conferidos na página do país e na dos temas, nas duas edições: {n('k17_paginas_cartoes')}, em {n('k17_paginas_paginas')} páginas; os ramos recontados: {n('k17_paginas_ramos')}; os erros: {n('k17_erros_nas_paginas')}; as plantas da K17 a morder: {n('k17_plantas')} | feito |
| 6 | As idades e os algarismos | os algarismos declarados das leituras, conferidos um a um: {n('algarismos_das_leituras_contados')} (a lista inteira em `algarismos_das_leituras`, com o literal de cada um) | feito, com um ponto parado: ver «O que fica por fazer» |
| 7 | A voz | as linhas do inventário: {n('inventario_linhas_l1')} do bloco `l1`, das quais {n('inventario_linhas_l1_inglesas')} inglesas, e {n('inventario_linhas_l1_correcao')} do bloco `l1-correcao`, as que a passagem de correção mudou, das quais {n('inventario_linhas_l1_correcao_inglesas')} inglesas; as exceções da lista dos marcadores que nomeiam o bloco: {n('excecoes_da_voz_com_o_l1')}; «limiar» nas leituras: {n('palavra_limiar_nas_leituras_pais_pt')} na página do país em português (e o mesmo nas outras páginas e edições, com «threshold» nas inglesas); leituras que falam do projeto ou da página: {n('leituras_que_falam_do_projeto_pais_pt')}; o `check:voz`, o `check:palavras` e o `check:lingua` correm dentro da verificação, ligados por `&&`, e a verificação só sai com 0 com os três a 0 (abaixo) | feito |
| 8 | As capturas, o relatório, as cópias | as capturas de página do depois: {n('capturas_depois_paginas')}; os recortes dos cartões, a 390 e a 1 280 px nas duas edições (o saldo e os onze cuja leitura mudou na passagem de correção): {n('capturas_depois_recortes')}; as do antes: {n('capturas_antes_paginas')} páginas e {n('capturas_antes_recortes')} recortes (os dois cartões do diretor); as falhas de aceitação: {n('capturas_depois_falhas')}; as cópias congeladas das quatro páginas do depois em `paginas-depois/`, presas por sha256 (`paginas_depois_sha256`) | feito |

## Os portões

Corridos por `correr-portao-l1.py`, um de cada vez, cada um no seu comando, com o `.codigo` apagado antes e escrito do código do próprio processo:

- `npm run build`: código {n('portao_build', 'codigo')}, em {n('portao_build', 'segundos')} segundos;
- `npm run verify`: código {n('portao_verify', 'codigo')}, em {n('portao_verify', 'segundos')} segundos;
- `npm run typecheck`: código {n('portao_typecheck', 'codigo')}, em {n('portao_typecheck', 'segundos')} segundos.

Todos na mesma cabeça (`portoes_na_mesma_cabeca`). O verificador de tipos é rápido nesta máquina, e por isso se mediu que ele vê: um ficheiro de fora da árvore com um erro de tipo plantado, posto no mesmo programa, é apontado (`typecheck_ve_um_erro_plantado`). O registo de cada corrida está em `portoes/`, com a raiz da árvore trocada por «./» (`portao_build` diz quantas vezes, e o sha256 do registo antes e depois).

## Os acertos de palavras às leituras

O ficheiro do sítio é a cópia do do lugar de direção com estas trocas e comentários, e mais nada: `acertos-l1.py` aplica-as à cópia, tira os comentários de bloco aos dois ficheiros e exige que fiquem iguais: a conferência sai com {n('acertos_confere_codigo')}, e a mesma conferência sobre uma cópia com uma palavra a mais sai com 1 (o conhecido-positivo da mesma medição). A1 a A15 foram pedidos pela auditoria das origens; A16 e A17 pelo portão da voz, com a palavra do literal; A18 a A26 pela leitura a frio do Codex, na passagem de correção de 26.09.2026.

{acertos()}
## As formas que mudaram, e o que cada uma continua a proteger

- **O `auditaSelo()` do portão de HTML.** Aceita um valor dentro de `[data-cartao-leitura][data-selo-em]` só quando a leitura é do próprio cartão (`data-cartao-leitura` e `data-selo-em` iguais ao cartão), o valor é a linha do cartão, a do período anterior da mesma série ou o agregado da União da mesma medida, e o cartão tem a sua marca: a regra do item da régua. Protege a porta do recibo de cada número (**P**). Plantas: `l1-leitura-sem-selo-em`, `l1-leitura-de-outro-cartao`, `l1-leitura-com-linha-alheia`.
- **A V2 (`scripts/pais-camaras.mjs`).** A leitura das câmaras diz contagens e o período; a V2 separa as chaves da leitura das da linha do valor, confere cada contagem da leitura contra a recontagem, exige que não tenha porta própria nem cite linha nenhuma, e que o período seja o das linhas contadas. Protege as contagens (**P**). Plantas: as `l1-camaras-leitura-*` de `tests/pais/camaras.mjs` ({n('plantas_camaras_l1_que_passaram')} de {n('plantas_camaras_l1')}), e as plantas antigas da linha do valor passaram a escolher o nó fora da leitura, para morderem o que sempre morderam ({n('plantas_camaras_que_passaram')} de {n('plantas_camaras')} no ficheiro todo).
- **A K1 e a K10 do `check:cartao`.** A K1 admite a peça `cartao-medida-leitura` e mais nenhuma (a planta antiga de uma peça estranha continua a morder); a K10 não conta como segunda marca o valor do próprio cartão citado na leitura. Protegem a forma do cartão e a marca única (**M** e **P**).
- **A célula 10 do `check:voz`, o arame da classe por provar.** Media as leituras como prosa solta e mordia «subiu» e «média da União». Passa a tirar do arame as leituras dos cartões, e só elas, depois de a K17 as conferir na mesma corrida, porque a cadeia da construção chama o `check:voz` e não o `check:cartao`; uma leitura que a K17 recuse fica dentro do arame. Protege a regra do F0.9 (nenhuma comparação sem a linha que a prova). Plantas: `l1-leitura-que-a-k17-recusa` e `l1-leitura-fora-do-cartao` ({n('plantas_portoes_l1_do_arame_que_morderam')} de {n('plantas_portoes_l1_do_arame')}), e o autoteste do arame, que prova que uma leitura num cartão sai, que a mesma marca fora de um cartão não sai e que uma leitura que a K17 recuse não sai.
- **A K17 lê o texto descodificado** quando procura algarismos soltos, com a planta «um algarismo escrito como referência de carácter».
- **A K9 do `check:cartao`** (passagem de correção). Além de comparar as duas testemunhas de cada valor de referência, exige a uma testemunha discordante declarada o que cada fonte diz, a data de criação do conjunto, a data de leitura da Comissão e quem manda, e conhece pelo nome as duas medidas em que a discordância existe. Protege o valor de referência e a sua fonte (**P**). Plantas: as cinco de «A passagem de correção», acima.

As {n('plantas_portoes_l1')} plantas do portão de HTML e do arame morderam todas ({n('plantas_portoes_l1_que_morderam')}), com os ficheiros de `dist/` repostos byte a byte.

## As plantas da K17

{n('k17_plantas')} plantas, todas a morder (`k17_plantas_nomes` dá os nomes): as do item 4 do brief sobre a auditoria (a origem tirada, a leitura mudada sem nova leitura, um literal que o campo não tem, um pedaço sem apoio, um algarismo sem literal), a declaração retirada (um processo filho carrega o resolvedor sem a leitura do saldo e o módulo recusa carregar, e o mesmo filho sem o estrago carrega), e as do item 5 sobre a página (um algarismo escrito à mão, o mesmo escrito como referência de carácter, o ramo trocado, uma linha de outra medida citada, um cartão sem leitura, a leitura com a marca da fonte).

## As origens seladas e as que não se acharam

As origens novas das leituras são {n('origens_novas')}: {n('origens_com_selo_de_pedido')} com o selo de um pedido feito pelo cliente da casa no motor e {n('origens_alojadas')} alojadas no estudo 13 antes deste bloco (os nomes em `origens_novas_nomes`). O motor registou {n('pedidos_do_bloco')} pedidos em `indicators/out/l1-2026-09-24/pedidos.jsonl`, todos com resposta 200 ({n('pedidos_do_bloco_com_http_200')}), e alojou {n('ficheiros_alojados_no_estudo_13')} ficheiros no estudo 13 com o sha256 no manifesto, no commit `{v('motor_commit_do_bloco')[:7]}`; a passagem de correção pediu {n('pedidos_da_correcao')} em `indicators/out/l1-2026-09-26/` e alojou {n('ficheiros_alojados_na_correcao')} no commit `{v('motor_commit_da_correcao')[:7]}` (os commits do motor no bloco: {n('motor_commits_do_bloco')}). `origens-l1.py --confere` relê cada declaração contra os bytes do motor: {n('origens_com_faltas')} faltas.

Não se acharam, e por isso as palavras saíram ou mudaram (os acertos dizem quais): uma origem que diga que a despesa líquida é a que o Governo controla (A3); uma que diga o sentido de uma subida da taxa de câmbio efetiva real (A5); uma que chame investimento feito no país à formação bruta de capital fixo (A15); uma que explique o valor real pelos preços de um ano fixo (A1; na passagem de correção, o A18 explica-o pela inflação, com a ficha nama10). Os endereços de glossário procurados e que não serviram estão em `sondas-l1.json`, pedidos pelo mesmo cliente com a hora e o sha256: {n('sondas')} endereços, {n('sondas_404')} com resposta 404 e {n('sondas_200')} com resposta 200 (o da taxa de câmbio efetiva real, que leva ao glossário da taxa de câmbio e não diz o sentido). Na passagem de correção, os endereços experimentados antes de escolher cada origem foram sondas de rascunho, pelo mesmo cliente, e não ficaram registados nesta pasta; as origens escolhidas foram pedidas de novo pelo guião do motor, e são essas que estão seladas.

## As alturas das páginas

A leitura acrescenta altura às páginas (`alturas_das_paginas_px`, em px): a do país em português, a 390 px, passou de {n('alturas_das_paginas_px', 'antes', 'pais_pt_390')} para {n('alturas_das_paginas_px', 'depois', 'pais_pt_390')}, e a 1 280 px de {n('alturas_das_paginas_px', 'antes', 'pais_pt_1280')} para {n('alturas_das_paginas_px', 'depois', 'pais_pt_1280')}; a dos temas em português, a 390 px, de {n('alturas_das_paginas_px', 'antes', 'temas_pt_390')} para {n('alturas_das_paginas_px', 'depois', 'temas_pt_390')}. Nenhuma régua da cabeça ou do cartão mede alturas de modo que a leitura a partisse: o `check:cabeca`, o `check:alvos`, o `check:css` e o `design:feixe` correm dentro da verificação acima.

## O que fica por fazer, e porquê

1. **As idades de algumas leituras: parei nesse ponto.** O item 6 do brief manda tirar da leitura a idade que a linha não fixa. Há linhas que não a fixam nos seus campos, e a idade da leitura apoia-se então num literal selado de uma origem (`algarismos_das_leituras`): a do desemprego de longa duração («aged 15-74»), a da diferença de emprego entre sexos («aged 20-64») e a do abandono escolar precoce («a person aged 18 to 24»). As perguntas do desemprego de longa duração e do abandono já escrevem as mesmas idades, pela mesma origem, no mesmo cartão. Tirá-las fazia a leitura dizer menos do que a pergunta ao lado dela, e menos do que a fonte diz. Não as tirei; o lugar de direção decide. Se decidir tirá-las, são os algarismos dessas leituras nas duas edições, com as linhas do inventário e a auditoria.
2. **A leitura a frio de outra família** correu a 26.09.2026 e esta passagem responde-lhe; o lugar de direção decide se a correção pede outra leitura antes de aterrar.
3. **A leitura do inventário** pelo lugar de direção: as entradas `l1` e `l1-correcao` de `REVISOES-DO-INVENTARIO.md` dizem «por ler».
4. **Uma leitura com ramos muda de frase quando o valor muda de lado** (I152), e a frase nova é uma cadeia que o inventário ainda não tem: o `check:voz` fecha a construção até ela entrar. A forma condicional do inventário que a I152 propõe não estava no mandato desta passagem e fica aberta; a concordância das câmaras resolveu-se com a frase nova do lugar de direção, e não com um ramo do singular.
5. **Os achados de 24.09.2026 sobre as descrições** (`achados_das_descricoes`) estão respondidos por esta passagem: a discordância dos dois valores de referência está declarada e a K9 exige-a, e a idade da taxa de atividade («{v('achados_das_descricoes', 'tipslm60_idade', 'Y15-64')}») está escrita na leitura. A pergunta da taxa de atividade continua sem a idade (é do B2), e a palavra «creche» continua sem literal que a nomeie.
6. **As páginas dos domínios e das áreas** rendem o mesmo cartão sem leitura: o brief manda a leitura na página do país e na dos temas, e só a `TemasDoPais.astro` passa a propriedade `leitura`.
7. **Os recibos** (os achados 17 e 18 da leitura a frio) são do bloco B3.

## Os commits

{chr(10).join('- `' + c + '`' for c in v('commits_do_sitio'))}

No motor, `{v('motor_cabeca')[:7]}` (`motor_cabeca`). Os commits do sítio depois do brief até à cabeça medida são {n('commits_do_sitio_no_bloco')}, com os dois do lugar de direção (o ensaio a seco e a leitura a frio) e os desta passagem; o commit que entrega estas provas vem a seguir e só acrescenta ficheiros desta pasta.

## O custo

"""
if simb is not None:
    texto += (f"A construção de 24.09.2026: {n('simbolos_do_construtor')} símbolos, declarados e não medidos por guião (`sessao.json` diz de onde vêm), "
              f"e {n('tempo_de_parede_segundos')} segundos de parede, a medição desse dia relida. ")
texto += (f"A passagem de correção de 26.09.2026: {n('simbolos_da_correcao')} símbolos, declarados da mesma maneira, e "
          f"{n('tempo_de_parede_da_correcao_segundos')} segundos de parede, do primeiro registo da transcrição desta sessão ao fim do último portão. "
          f"Modelo: Claude Opus 5.5, em tudo.\n")
(AQUI / 'LEIA-ME.md').write_text(texto, encoding='utf-8')
print('LEIA-ME.md escrito:', len(texto.splitlines()), 'linhas')
