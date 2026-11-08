# HIG-6A: relatório do construtor (08.11.2026)

O fecho está verde na cabeça de código `ba12379596b6927c5a463604aa0a3ff6afb90aba`. O `dist/version.json` corresponde a essa cabeça. O relatório e os registos são comitados depois das conferências. O motor ficou só em leitura, em `cf5bd5b`.

## O que mudou

- `pre-mandato.py` lê cabeçalhos `Frases:` repetidos, relativos à pasta do mandato, incluindo com `Acrescenta: nada`. `conferir-frases.mjs` recusa listas inválidas, um `dist/` de outra cabeça, frases novas recusadas pela voz, números retirados ou acrescentados de forma diferente, quantificadores sem declaração, pares em falta e frases que a lista não nomeia.
- A voz é importada da régua existente, sem a alterar. Os blocos dos pares conservam os seletores anteriores; a cobertura inclui também texto em `div`, `section` e `article`. Nas páginas, conserva-se a exclusão das transcrições fora da leitura que a régua já faz. Os selos são retirados para comparar o texto com as entradas da lista.
- A extração dos números das listas conserva a da VOZ-2, incluindo `sha256` e a distinção entre `1,2` e `12`. A paridade do sítio conserva a régua da AUD1 e as suas seis plantas.
- `quantificadores.py` lê `QUANTIFIER_PATTERNS` por AST no motor, sem copiar a lista nem executar o motor. O campo `assercao` declara o ID; a avaliação da asserção continua a pertencer ao motor. Acrescentaram-se oito declarações à lista atual da VOZ-2A, com os IDs lidos nos livros do motor: `base-sem-contratos`, `so-previsionais`, `hospital-registos-sem-identidade-declarada` e `e2027-no-consolidated-budget`.
- Os dois lançadores exportam o caminho do motor antes do pré-mandato. Partilham um contador por repositório e bloco fora da árvore, com cópia ao lado do custo de cada passagem. Uma nova sessão do mesmo bloco também conta. A terceira retoma e as seguintes exigem data válida e razão de pelo menos vinte carateres; a decisão fica registada. A planta usa o lançador real com serviços sintéticos e confirma que a recusa acontece antes de chamar o Codex.
- O guião histórico dos pares recebe `dist`, lista e data da edição; o `check:voz` mantém a VOZ-2A e `2026-11-08`. As plantas anteriores continuam a passar.
- `plantar.py` conserva `mtime` e `atime` em nanossegundos; a prova verifica bytes diferentes e tempos iguais.
- A régua do repositório cobre os três endereços, escapes JSON e percentagens, `src`, `action`, refresh e ligações mal formadas. São vinte plantas e controlos, incluindo as duas anteriores.

## Resultados das listas

| Lista | Voz | Números | Quantificadores sem declaração | Entradas sem par | Frases sem entrada |
| --- | ---: | ---: | ---: | ---: | ---: |
| VOZ-2A atual, com as declarações acrescentadas | 0 | 0 | 0 | 0 | 0 |
| VOZ-2B atual | 0 | 0 | 28 | 4 | 15 |
| VOZ-2A em `ab948c410` | 10 | 1 | 6 | 1 | 5 |

As dez recusas históricas da voz são `V043`, `V053`, `V057`, `V064`, `V164`, `V176`, `V182`, `V194`, `V195` e `V196`.

Em `14f931195`, o campo `assercao` ainda não existia: a lista bruta dá sete entradas sem declaração. Declarando apenas as coberturas já documentadas antes de G (`V030`, `V152` e `V188`), ficam quatro entradas: `V032`, `V040`, `V182` e `V195`. As primeiras duas repetem a mesma frase, com uma diferença de caráter invisível. São as três frases distintas da adenda G. A planta guarda ambas as contagens e prova as três frases, sem apresentar sete entradas como três.

Na VOZ-2B, os pares recusados são `V012`, `V293`, `V093` e `V100`. As quatro entradas e quinze frases diferem das oito e catorze indicadas no mandato. A contagem de pares é por ID, aceita uma entrada que nomeie o texto antigo ou o novo e só recusa o gémeo sem entrada quando a régua o apanha, como exige o mandato. A cobertura inclui os elementos sem parágrafo que a régua da página também mede. Os achados completos, incluindo a legenda inglesa de Alentejo e Algarve e a frase em `div` da evolução desde 1981, ficam em [reais.json](reais.json). A lista não foi corrigida nesta passagem e é recusada pelo pré-mandato.

## Paridade e exceções

Foram conferidos vinte documentos e páginas, de dez estudos publicados nas duas línguas. Uma página de indisponibilidade não conta como tradução publicada. As exceções são quatro comparações exatas, datadas de `2026-11-08`, para retirar com a COR-AGUA:

| Estudo e superfície | Números só em português | Números só em inglês |
| --- | ---: | ---: |
| A casa em Portugal e na Europa, documento | 0 | 4 |
| A casa em Portugal e na Europa, página | 0 | 4 |
| Água não faturada, documento | 3 | 7 |
| Onde está a água, documento | 51 | 14 |

Os multiconjuntos completos, as repetições e as diferenças por bloco estão em `scripts/paridade-excecoes.json`, copiados da medição da AUD1. Uma diferença nova, uma diferença alterada nos três estudos ou uma exceção já sem diferença recusa. A prova inclui também uma troca de números entre blocos que conserva os totais do documento.

## Códigos e comandos

Os comandos com saída longa correram por `sh scripts/leituras/curto.sh <registo> <comando...>`. Os códigos estão em [codigos.json](codigos.json).

| Comando | Código |
| --- | ---: |
| `sh scripts/leituras/portoes-pelo-escrivao.sh <pasta nova> build` | 0 |
| `npm run check:voz` | 0 |
| `npm run check:paridade` | 0 |
| `npm run check:pre-mandato` | 0 |
| `npm run typecheck` | 0 |
| `node tests/leituras/frases-reais.mjs <resultado.json>` | 0 |
| `node tests/metodo/repositorio.mjs` | 0 |
| `node tests/leituras/paridade.mjs` | 0 |
| `python3 scripts/leituras/pre-mandato.py . <mandato HIG-6A>` | 0 |
| Pré-mandato com `Frases:` para a VOZ-2A atual | 0 |
| Pré-mandato com `Frases:` para a VOZ-2B atual | 9, recusa esperada |
| Pares com lista incompleta fornecida como argumento | 1, recusa esperada |
| Pares com data `2026-02-30` | 1, recusa esperada |

A pasta da VOZ-2B só contém a lista. O seu ensaio usa uma cópia exata e um mandato temporário com `Frases:`, exercitando o pré-mandato completo. O mandato HIG-6A foi transcrito do pedido para [MANDATO-HIG-6A.md](MANDATO-HIG-6A.md), sem acrescentar um cabeçalho `Frases:` que o original não tinha.

As provas locais finais incluem 27 plantas e controlos da camada 0, quatro testes novos em Python, os 33 testes anteriores do pré-mandato, onze testes do lançador, doze provas da paridade e vinte do repositório. A régua da voz não mudou; nenhuma proteção de números, fontes ou pessoas foi afrouxada. Não houve rede, alteração do motor, publicação ou capturas.

## Commits e custo de execução

- `671a060e6`: implementação inicial.
- `041bf5eac`: distinção decimal e correções da seleção dos blocos da camada 0.
- `ba1237959`: provas, argumentos dos pares e documentação, cabeça do fecho.

Houve 34 invocações registadas de conferências ou medições, incluindo os diagnósticos e as recusas esperadas. A contagem considera cada chamada de `curto.sh` e cada pedido de construção; o invólucro do fecho dirigido não é contado outra vez sobre os seus oito comandos. Houve dois builds completos, ambos verdes, e um pedido anterior recusado por árvore suja antes de construir. Não houve corrida conjunta de `build`, `verify` e `typecheck`, nem capturas.

À preparação do relatório estavam registadas 89 chamadas de ferramentas, incluindo as esperas. A contagem final, após guardar e conferir estes registos, segue na resposta. A tranca global de uma aterragem reteve a primeira construção e os commits seguintes; a espera terminou pelo mecanismo existente, sem a remover ou contornar. O segundo build confirmou o `dist/` sobre a cabeça final do código.
