# Mandato HIG-6A: a camada 0 antes de cada lançamento, o teto das voltas, a paridade dos números e os pares na cadeia (escrito a 08.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Opus 5.5, pela palavra do financiador de 02.11.2026). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, na worktree do sítio `hig6a-2026-11-08` (por cima da MET2), com o motor da aterragem (`v2d`, no `master` cf5bd5b, só para ler). É o primeiro bloco do plano em vigor (`design/observatorio/PLANO-risco-zero-2026-11-08.md`, a §1.234): o risco de um erro chegar ao ar perto de zero, por camadas. Estas conferências guardam todas as outras: cada uma só conta quando uma planta prova que morde, e a leitura a frio será do Opus a `xhigh`.*

## §0 Medido (07 e 08.11.2026, por este lugar)

- A VOZ-2A custou dez passagens; as nove adendas corrigiram frases deste lugar que nenhum guião mediu antes do lançamento. Quatro classes: frases novas que a régua da voz recusa (21 nas duas listas originais; 10 na da VOZ-2A, a de ab948c410, medidas com a régua de hoje); números tirados numa língua e não na outra (a V194); quantificadores sem asserção no motor (três frases, a adenda G); pares das duas línguas em falta (20 blocos de documento, a adenda H).
- `scripts/leituras/pre-mandato.py` só confere o cabeçalho `Acrescenta:`, as contagens do §0 contra `Medidas:` e as marcas da voz nas linhas com aspas (pelo `voz-do-mandato.py`); não lê nenhuma lista de frases.
- A conferência das frases novas (`design/especime-v3/medicoes/voz2-adenda-a-2026-11-07/conferir-novas.mjs`) e a dos pares (`design/especime-v3/medicoes/voz2a-2026-11-07/conferir-pares.mjs`, só a lista da VOZ-2A, na cadeia do `check:voz`) existem e mordem; os quantificadores do motor estão em `core/assertions.py` (`QUANTIFIER_PATTERNS`), no motor.
- A paridade dos números entre as duas línguas, medida por este lugar no `dist/` de f87512ab1 com `design/especime-v3/medicoes/aud1-2026-11-08/paridade-numeros.mjs` (deste lugar, comitado com este mandato; seis plantas em seis): igual nos estudos de Évora, no Orçamento de 2027 e na economia; diferente em «Onde está a água», «Água não faturada» e «A casa em Portugal e na Europa», que a COR-AGUA vai corrigir depois deste bloco.
- A lista da VOZ-2B contra o `dist/` de f87512ab1 (este lugar, a 08.11): 14 frases que a régua apanha e a lista não nomeia, 8 entradas sem par na outra língua.
- `scripts/leituras/plantar.py` muda a hora dos ficheiros que planta; o leitor da adenda H viu as plantas pela data.
- O lançador não conta as voltas de um bloco: a VOZ-2A teve uma passagem e nove retomas sem nenhuma paragem pedida.

## §1 O que fazes

1. **A camada 0 no `pre-mandato.py`.** Um cabeçalho novo, `Frases: <lista.json>` (relativo à pasta do mandato; pode repetir-se), e quando existe o pré-mandato corre, por guião, sobre cada entrada da lista: (a) a régua da voz em cada `nova`, frase a frase, como a página a mede; (b) os números tirados por estudo e língua, iguais nas duas línguas, e os algarismos colados a letras; (c) os quantificadores do motor, lidos de `core/assertions.py` no motor (`RESEARCHHUB_DIR`), nunca copiados: uma `nova` com um quantificador recusa-se se a entrada não declarar a asserção que a cobre (um campo `assercao`, com o `id`); (d) os pares, no `dist/` da cabeça da worktree: para cada entrada de um estudo publicado nas duas línguas, o bloco gémeo na outra língua (pelo índice quando os blocos alinham, e pela vizinhança de três quando não) tem de ter uma entrada, ou nenhuma frase que a régua apanhe; e cada frase que a régua apanha num estudo da lista e que a lista não nomeia recusa-se. Junta o que hoje está nos dois guiões da VOZ-2 num guião da casa (`scripts/leituras/conferir-frases.mjs` ou o nome que servir), sem os mudar onde estão.
2. **As plantas da camada 0, com casos reais:** a lista da VOZ-2A em ab948c410 recusada pela régua (10 frases, medidas por este lugar com a régua de hoje); a lista da VOZ-2A antes da adenda G (em 14f931195) com os três quantificadores sem asserção; a lista da VOZ-2B de hoje contra o `dist/` da cabeça com as entradas sem par e as frases que a lista não nomeia (dizes quantas; este lugar mediu 8 e 14); e a lista da VOZ-2A de hoje a passar sem recusas. Mais uma planta por regra, em memória.
3. **O teto das voltas:** o lançador guarda, fora do repositório e ao lado do ficheiro de custo de cada passagem, quantas retomas teve cada bloco (`OEDP_BLOCO`); a terceira retoma de um bloco recusa-se sem `OEDP_RETOMA_DECISAO` (uma data e uma razão de vinte carateres ou mais, escrita no registo da passagem). Uma planta.
4. **A paridade dos números na cadeia:** o guião deste lugar passa a uma conferência da casa (`check:paridade` ou dentro de uma que o `build` já corre), sobre os documentos e as páginas dos estudos bilingues, com as seis plantas, e com uma exceção fechada e datada para os três estudos acima, que diz o que difere (os números de cada um, como este lugar os mediu) e que sai com a COR-AGUA; uma diferença nova em qualquer outro estudo, ou outra diferença nesses três, recusa.
5. **Os pares para qualquer lista:** o guião dos pares da VOZ-2A passa a ler uma lista e a data da sua edição como argumentos, e o `check:voz` chama-o para a VOZ-2A como hoje; nenhuma conferência fica mais fraca.
6. **As plantas sem rasto:** `plantar.py` repõe a hora de modificação do ficheiro plantado, com uma prova.
7. **A régua do repositório, alargada** (a leitura curta da MET2, 9): o endereço da organização também nas formas escapadas em JSON e codificadas por percentagem, em `oestadodopais.github.io` e em `raw.githubusercontent.com/oestadodopais`; as ligações também em `src`, `action` e no refresh de `meta`, e uma ligação mal formada conta como suspeita, não como limpa. Uma planta por forma nova.
8. **O fecho:** o `build` inteiro verde; `check:voz`, a conferência nova da paridade, o pré-mandato com as suas plantas, `typecheck`, com os códigos; e o pré-mandato corrido sobre este mandato e sobre o mandato da VOZ-2B (`design/especime-v3/medicoes/voz2b-2026-11-07/`, se lá estiver, ou a lista sozinha), com o que recusa. Os commits com o assunto a começar por `HIG-6A`; o relatório com as contagens e os comandos.

## §2 Quando paras

Se uma conferência que protege um número, uma fonte ou uma pessoa só passar mais fraca; se a régua da voz precisar de mudar para a camada 0 a usar (diz porquê); se o pré-mandato só correr com rede.

## §3 O fim

O §1, ponto 8. Setenta e cinco minutos, cento e vinte chamadas.
