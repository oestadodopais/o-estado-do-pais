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


portoes = {p: v(f'portao_{p}') for p in ('build', 'verify', 'typecheck')}
cabeca = portoes['build']['cabeca']
simb = v('simbolos_do_construtor') if 'simbolos_do_construtor' in M else None

texto = f"""# L1 · a leitura de cada medida · o relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 24.09.2026. Ramo `l1-2026-09-24` do sítio, sobre `f672bd38`, com o brief em `f0779f37`; ramo `l1-2026-09-24` do motor, sobre `0f08171`. Os portões inteiros (`npm run build`, `npm run verify` e `npm run typecheck`) correram na cabeça `{cabeca[:8]}` (`cabeca_medida`), e o commit que entrega estas provas vem a seguir a ela e só acrescenta ficheiros desta pasta. As capturas do antes são da cabeça `{v('paginas_antes_construidas_de')[:8]}` (`paginas_antes_construidas_de`), a de partida, e as do depois são da cabeça dos portões (`capturas_depois_de`). Cada número deste relatório sai de `medidas.json`, escrito por `medir-l1.py`, e o nome da medição vai ao lado dele; `conferir-relatorio.py` confere-os.*

## O que ficou feito

Por baixo do número de cada cartão nacional há agora uma leitura em palavras correntes: o que o número quer dizer, como se compara com o período anterior e com a média da União onde a régua tem essas linhas, e de que lado do valor de referência está onde ele existe. A página do país rende {n('leituras_pais_pt_depois')} leituras na edição portuguesa e {n('leituras_pais_en_depois')} na inglesa, e a dos temas {n('leituras_temas_pt_depois')} e {n('leituras_temas_en_depois')}; nenhum cartão fica sem leitura (`cartoes_sem_leitura_<página>_<edição>_depois`, como a dos temas em inglês: {n('cartoes_sem_leitura_temas_en_depois')}), nenhum tem mais de uma (`cartoes_com_mais_de_uma_leitura_<página>_<edição>_depois`), e antes do bloco não havia nenhuma: {n('leituras_pais_pt_antes')} na página do país em português, e o mesmo nas outras (`leituras_<página>_<edição>_antes`). As palavras são as do lugar de direção, com {n('acertos')} acertos em {n('acertos_trocas')} trocas, todos abaixo; os números e os ramos são da máquina.

## O mandato, item a item

| # | o que | a medida | estado |
|---|---|---|---|
| 0 | O mapa do repositório | as citações conferidas à volta da linha citada: {n('mapa_citacoes_conferidas')}; longe da linha: {n('mapa_citacoes_longe')}; não encontradas: {n('mapa_citacoes_nao_encontradas')}. A secção nova «A leitura de cada medida», a K17, a leitura na V2 e no `auditaSelo()`, a célula 10 do `check:voz` e três armadilhas | feito |
| 1 | A declaração e o resolvedor | as leituras declaradas: {n('leituras_declaradas')}, tantas quantas a tabela das medidas do país obriga, com o cartão das câmaras (`medidasComLeitura()`); a construção fecha sem uma (a planta «a declaração retirada fecha o resolvedor», abaixo) | feito |
| 2 | A leitura no cartão | as marcas da fonte dentro das leituras: {n('marcas_da_fonte_nas_leituras_pais_pt')} na página do país e {n('marcas_da_fonte_nas_leituras_temas_pt')} na dos temas (o mesmo nas edições inglesas); as plantas do `auditaSelo()` a morder: {n('plantas_portoes_l1_do_audita_selo_que_morderam')} de {n('plantas_portoes_l1_do_audita_selo')} | feito |
| 3 | A folha | as medições de leitura nas capturas do depois: {n('capturas_depois_com_leitura')}; a 14 px: {n('capturas_depois_a_14px')}; na tinta: {n('capturas_depois_na_tinta')}; a 58ch: {n('capturas_depois_a_58ch')}; com a medida da pergunta, onde há pergunta: {n('capturas_depois_com_a_medida_da_pergunta')} de {n('capturas_depois_com_pergunta')}; cartões que transbordam: {n('capturas_depois_cartoes_que_transbordam')}; páginas que transbordam a 390 px: {n('capturas_depois_paginas_que_transbordam_a_390')} | feito |
| 4 | A auditoria das origens | as medidas auditadas: {n('k17_auditoria_medidas')}; as folhas: {n('k17_auditoria_folhas')}; as partes: {n('k17_auditoria_partes')} ({n('k17_auditoria_diz')} dizem o que a medida é, {n('k17_auditoria_conta')} são contas, {n('k17_auditoria_liga')} ligam); os apoios: {n('k17_auditoria_apoios')}; as origens usadas: {n('k17_auditoria_origens_das_leituras')}; os erros: {n('k17_erros_da_auditoria')}. As origens novas: {n('origens_novas')}, conferidas contra o motor {n('origens_conferidas')} | feito |
| 5 | A leitura rendida | os cartões conferidos na página do país e na dos temas, nas duas edições: {n('k17_paginas_cartoes')}, em {n('k17_paginas_paginas')} páginas; os ramos recontados: {n('k17_paginas_ramos')}; os erros: {n('k17_erros_nas_paginas')}; as plantas da K17 a morder: {n('k17_plantas')} | feito |
| 6 | As idades e os algarismos | os algarismos declarados das leituras, conferidos um a um: {n('algarismos_das_leituras_contados')} (a lista inteira em `algarismos_das_leituras`, com o literal de cada um) | feito, com um ponto parado: ver «O que fica por fazer» |
| 7 | A voz | as linhas novas do inventário: {n('inventario_linhas_l1')}, das quais {n('inventario_linhas_l1_inglesas')} inglesas; as exceções da lista dos marcadores que nomeiam o bloco: {n('excecoes_da_voz_com_o_l1')}; «limiar» nas leituras: {n('palavra_limiar_nas_leituras_pais_pt')} na página do país em português (e o mesmo nas outras páginas e edições, com «threshold» nas inglesas); leituras que falam do projeto ou da página: {n('leituras_que_falam_do_projeto_pais_pt')}; o `check:voz`, o `check:palavras` e o `check:lingua` correm dentro da verificação, ligados por `&&`, e a verificação só sai com 0 com os três a 0 (abaixo) | feito |
| 8 | As capturas, o relatório, as cópias | as capturas de página do depois: {n('capturas_depois_paginas')}; os recortes dos cartões do diretor (o saldo e a disparidade salarial, a 390 e a 1 280 px): {n('capturas_depois_recortes')}; as mesmas do antes: {n('capturas_antes_paginas')} e {n('capturas_antes_recortes')}; as falhas de aceitação: {n('capturas_depois_falhas')}; as cópias congeladas das quatro páginas do depois em `paginas-depois/`, presas por sha256 (`paginas_depois_sha256`) | feito |

## Os portões

Corridos por `correr-portao-l1.py`, um de cada vez, cada um no seu comando, com o `.codigo` apagado antes e escrito do código do próprio processo:

- `npm run build`: código {n('portao_build', 'codigo')}, em {n('portao_build', 'segundos')} segundos;
- `npm run verify`: código {n('portao_verify', 'codigo')}, em {n('portao_verify', 'segundos')} segundos;
- `npm run typecheck`: código {n('portao_typecheck', 'codigo')}, em {n('portao_typecheck', 'segundos')} segundos.

Todos na mesma cabeça (`portoes_na_mesma_cabeca`). O verificador de tipos é rápido nesta máquina, e por isso se mediu que ele vê: um ficheiro de fora da árvore com um erro de tipo plantado, posto no mesmo programa, é apontado (`typecheck_ve_um_erro_plantado`). O registo de cada corrida está em `portoes/`, com a raiz da árvore trocada por «./» (`portao_build` diz quantas vezes, e o sha256 do registo antes e depois).

## Os acertos de palavras às leituras

O ficheiro do sítio é a cópia do do lugar de direção com estas trocas e comentários, e mais nada: `acertos-l1.py` aplica-as à cópia, tira os comentários de bloco aos dois ficheiros e exige que fiquem iguais: a conferência sai com {n('acertos_confere_codigo')}, e a mesma conferência sobre uma cópia com uma palavra a mais sai com 1 (o conhecido-positivo da mesma medição). A1 a A15 foram pedidos pela auditoria das origens; A16 e A17 pelo portão da voz, com a palavra do literal.

{acertos()}
## As formas que mudaram, e o que cada uma continua a proteger

- **O `auditaSelo()` do portão de HTML.** Aceita um valor dentro de `[data-cartao-leitura][data-selo-em]` só quando a leitura é do próprio cartão (`data-cartao-leitura` e `data-selo-em` iguais ao cartão), o valor é a linha do cartão, a do período anterior da mesma série ou o agregado da União da mesma medida, e o cartão tem a sua marca: a regra do item da régua. Protege a porta do recibo de cada número (**P**). Plantas: `l1-leitura-sem-selo-em`, `l1-leitura-de-outro-cartao`, `l1-leitura-com-linha-alheia`.
- **A V2 (`scripts/pais-camaras.mjs`).** A leitura das câmaras diz contagens e o período; a V2 separa as chaves da leitura das da linha do valor, confere cada contagem da leitura contra a recontagem, exige que não tenha porta própria nem cite linha nenhuma, e que o período seja o das linhas contadas. Protege as contagens (**P**). Plantas: as `l1-camaras-leitura-*` de `tests/pais/camaras.mjs` ({n('plantas_camaras_l1_que_passaram')} de {n('plantas_camaras_l1')}), e as plantas antigas da linha do valor passaram a escolher o nó fora da leitura, para morderem o que sempre morderam ({n('plantas_camaras_que_passaram')} de {n('plantas_camaras')} no ficheiro todo).
- **A K1 e a K10 do `check:cartao`.** A K1 admite a peça `cartao-medida-leitura` e mais nenhuma (a planta antiga de uma peça estranha continua a morder); a K10 não conta como segunda marca o valor do próprio cartão citado na leitura. Protegem a forma do cartão e a marca única (**M** e **P**).
- **A célula 10 do `check:voz`, o arame da classe por provar.** Media as leituras como prosa solta e mordia «subiu» e «média da União». Passa a tirar do arame as leituras dos cartões, e só elas, depois de a K17 as conferir na mesma corrida, porque a cadeia da construção chama o `check:voz` e não o `check:cartao`; uma leitura que a K17 recuse fica dentro do arame. Protege a regra do F0.9 (nenhuma comparação sem a linha que a prova). Plantas: `l1-leitura-que-a-k17-recusa` e `l1-leitura-fora-do-cartao` ({n('plantas_portoes_l1_do_arame_que_morderam')} de {n('plantas_portoes_l1_do_arame')}), e o autoteste do arame, que prova que uma leitura num cartão sai, que a mesma marca fora de um cartão não sai e que uma leitura que a K17 recuse não sai.
- **A K17 lê o texto descodificado** quando procura algarismos soltos, com a planta «um algarismo escrito como referência de carácter».

As {n('plantas_portoes_l1')} plantas do portão de HTML e do arame morderam todas ({n('plantas_portoes_l1_que_morderam')}), com os ficheiros de `dist/` repostos byte a byte.

## As plantas da K17

{n('k17_plantas')} plantas, todas a morder (`k17_plantas_nomes` dá os nomes): as do item 4 do brief sobre a auditoria (a origem tirada, a leitura mudada sem nova leitura, um literal que o campo não tem, um pedaço sem apoio, um algarismo sem literal), a declaração retirada (um processo filho carrega o resolvedor sem a leitura do saldo e o módulo recusa carregar, e o mesmo filho sem o estrago carrega), e as do item 5 sobre a página (um algarismo escrito à mão, o mesmo escrito como referência de carácter, o ramo trocado, uma linha de outra medida citada, um cartão sem leitura, a leitura com a marca da fonte).

## As origens seladas e as que não se acharam

As origens novas das leituras são {n('origens_novas')}: {n('origens_com_selo_de_pedido')} com o selo de um pedido feito pelo cliente da casa no motor e {n('origens_alojadas')} alojadas no estudo 13 antes deste bloco (os nomes em `origens_novas_nomes`). O motor registou {n('pedidos_do_bloco')} pedidos em `indicators/out/l1-2026-09-24/pedidos.jsonl`, todos com resposta 200 ({n('pedidos_do_bloco_com_http_200')}), e alojou {n('ficheiros_alojados_no_estudo_13')} ficheiros no estudo 13 com o sha256 no manifesto, num commit só (`motor_commits_do_bloco`). `origens-l1.py --confere` relê cada declaração contra os bytes do motor: {n('origens_com_faltas')} faltas.

Não se acharam, e por isso as palavras saíram ou mudaram (os acertos dizem quais): uma origem que diga que a despesa líquida é a que o Governo controla (A3); uma que diga o sentido de uma subida da taxa de câmbio efetiva real (A5); uma que chame investimento feito no país à formação bruta de capital fixo (A15); uma que explique o valor real pelos preços de um ano fixo (A1). Os endereços de glossário procurados e que não serviram estão em `sondas-l1.json`, pedidos pelo mesmo cliente com a hora e o sha256: {n('sondas')} endereços, {n('sondas_404')} com resposta 404 e {n('sondas_200')} com resposta 200 (o da taxa de câmbio efetiva real, que leva ao glossário da taxa de câmbio e não diz o sentido).

## As alturas das páginas

A leitura acrescenta altura às páginas (`alturas_das_paginas_px`, em px): a do país em português, a 390 px, passou de {n('alturas_das_paginas_px', 'antes', 'pais_pt_390')} para {n('alturas_das_paginas_px', 'depois', 'pais_pt_390')}, e a 1 280 px de {n('alturas_das_paginas_px', 'antes', 'pais_pt_1280')} para {n('alturas_das_paginas_px', 'depois', 'pais_pt_1280')}; a dos temas em português, a 390 px, de {n('alturas_das_paginas_px', 'antes', 'temas_pt_390')} para {n('alturas_das_paginas_px', 'depois', 'temas_pt_390')}. Nenhuma régua da cabeça ou do cartão mede alturas de modo que a leitura a partisse: o `check:cabeca`, o `check:alvos`, o `check:css` e o `design:feixe` correm dentro da verificação acima.

## O que fica por fazer, e porquê

1. **As idades de algumas leituras: parei nesse ponto.** O item 6 do brief manda tirar da leitura a idade que a linha não fixa. Há linhas que não a fixam nos seus campos, e a idade da leitura apoia-se então num literal selado de uma origem (`algarismos_das_leituras`): a do desemprego de longa duração («aged 15-74»), a da diferença de emprego entre sexos («aged 20-64») e a do abandono escolar precoce («a person aged 18 to 24»). As perguntas do desemprego de longa duração e do abandono já escrevem as mesmas idades, pela mesma origem, no mesmo cartão. Tirá-las fazia a leitura dizer menos do que a pergunta ao lado dela, e menos do que a fonte diz. Não as tirei; o lugar de direção decide. Se decidir tirá-las, são os algarismos dessas leituras nas duas edições, com as linhas do inventário e a auditoria.
2. **A leitura a frio de outra família** (o §6 do brief): o bloco não aterra sem ela.
3. **A leitura do inventário** pelo lugar de direção: a entrada `l1` de `REVISOES-DO-INVENTARIO.md` diz «por ler».
4. **Uma leitura com ramos muda de frase quando o valor muda de lado**, e a frase nova é uma cadeia que o inventário ainda não tem: o `check:voz` fecha a construção até ela entrar. É o preço de o inventário guardar as frases rendidas e não as declarações.
5. **Achados para o lugar de direção, que não mudei** (`achados_das_descricoes` tem os literais): a descrição do Eurostat da taxa de câmbio efetiva real diz «{v('achados_das_descricoes', 'tipser10_descricao')}», e a origem da Comissão que o sítio declara diz «{v('achados_das_descricoes', 'pdm_cambio_efectivo_real_declarada')}»; a descrição do desempenho das exportações diz «{v('achados_das_descricoes', 'tipsbp60_descricao')}», e a da Comissão «{v('achados_das_descricoes', 'pdm_exportacoes_declarada')}»; a resposta da taxa de atividade é da classe «{v('achados_das_descricoes', 'tipslm60_idade', 'Y15-64')}», que o excerto da linha não traz. A leitura das câmaras fixa o verbo no plural em «eram» e no singular em «não tem valor publicado», e as contagens que eles acompanham podem mudar de número: com outras contagens, uma das concordâncias sai errada. O ensaio a seco das frases do lugar de direção não está no repositório, e os ramos conferiram-se pela conta independente da K17.
6. **As páginas dos domínios e das áreas** rendem o mesmo cartão sem leitura: o brief manda a leitura na página do país e na dos temas, e só a `TemasDoPais.astro` passa a propriedade `leitura`.

## Os commits

{chr(10).join('- `' + c + '`' for c in v('commits_do_sitio'))}

No motor, `{v('motor_cabeca')[:7]}` (`motor_cabeca`). Os commits do sítio até à cabeça medida são {n('commits_do_sitio_no_bloco')}; o commit que entrega estas provas vem a seguir e só acrescenta ficheiros desta pasta.

## O custo

"""
if simb is not None:
    texto += (f"O total cumulativo de símbolos que a ferramenta reportou até à escrita deste relatório: {n('simbolos_do_construtor')}, "
              f"declarado e não medido por guião (`sessao.json` diz de onde vem). ")
texto += (f"O tempo de parede da sessão, do primeiro registo da transcrição ao fim do último portão: {n('tempo_de_parede_segundos')} segundos. "
          f"Modelo: Claude Opus 5.5, em tudo.\n")
(AQUI / 'LEIA-ME.md').write_text(texto, encoding='utf-8')
print('LEIA-ME.md escrito:', len(texto.splitlines()), 'linhas')
