# CAM2-A, fecho da adenda D

Implementação construída: `c64f32c27991df2e52eeb41cd3ae8bf98bfde6cf`. O commit posterior contém apenas o fecho
documental. Base e construção em 2026-11-09 UTC. Não houve aterragem nem publicação.

## Resultado e juízo

O registo tem 22 entradas bilingues, todas `juizo: "por julgar"`,
incluindo a semente e a entrada da saúde sem o PRR. A conferência recusa o
campo ausente e qualquer outro valor. A citação presa continua obrigatória
quando há citação: prova aquelas palavras, não o resto da afirmação.
Só o juiz da CAM2-B poderá estabelecer a transição deste estado.

O âmbito mantém 872 páginas de prosa. Há 2479 frases cobertas,
1314 PT e 1165 EN, e 2435 pendentes:
1292 PT e 1143 EN.
O teto configurado é 4000, guardado nas medidas como limite,
não como observação. A semente continua gerada nas rotas de discussão das duas edições.

## Cobertura pelo par

A deteção direta encontra 1054 unidades PT e
1106 EN. O alinhamento acrescenta 260
frases PT e 59 EN, com os tipos da frase detetada na outra
língua. Todas passam pela mesma cobertura de registo ou lista pendente.
Repetições mantêm todas as ocorrências, sem multiplicar a dívida por página.

| Sentido | Pares diretos | Sem par | Falhas das marcas antes | Falhas das marcas depois | Pares sem cobertura |
| --- | ---: | ---: | ---: | ---: | ---: |
| PT para EN | 845 | 209 | 60 | 60 | 0 |
| EN para PT | 1045 | 61 | 260 | 260 | 0 |

O antes usa efetivamente as marcas de `155fd74a5` sobre os mesmos pares.
Nesta comparação D os valores das marcas coincidem; não são copiados. Uma planta
com detetor anterior distinto exige resultados distintos. As falhas das marcas
não são lacunas de cobertura: a extensão pelo par fecha-as. A contagem de pares
e a de novas frases únicas têm denominadores diferentes.

## Negativos, histórico e medidas

As locuções e nomes indicados na adenda são recusados como marcas de atribuição;
as atribuições com sujeito, como «A UTAO alerta para o risco», continuam a passar.
Os casos medidos pela direção são conservados com essa origem. No texto lido pelo
detetor, a busca encontrou 1 ocorrência do nome
próprio e 3 ocorrências da oração relativa.
Não encontrou `diz respeito`, `estado de alerta` ou `o alerta` nesse texto.
As plantas distinguem os exemplos publicados dos casos da adenda ausentes do
`dist/`; não se inventaram frases publicadas para preencher a exigência.

O pino das 178 marcas mudou no mesmo commit, com data e razão:
`1c4d452eca45b294fdf4a891c1cfbdf6f9df65fd43a4b6c155134e83f3dd27dc`. Mantêm-se 178 plantas isoladas.
A nova planta percorre um histórico simulado: o commit b muda as marcas sem
pino, c repara o pino, e a recusa de b continua no resultado. O controlo que
muda ambos no mesmo commit passa. A conferência não foi enfraquecida.

As medidas C agora guardam explicitamente as contagens por língua, o teto e o
total de marcas, obtidos dos ficheiros de 155fd74a5. O antes dos pares foi
corrigido a partir de `pares_antes_adenda_c`, já medido e guardado: PT para EN
103, EN para PT
381. A comparação inglesa
inicial foi preservada num campo próprio. As medidas D guardam os mesmos campos
explícitos, além da extensão pelo par e dos estados de juízo.

A lista inicial foi regenerada pela autorização da adenda D. A base da lista
passa a 155fd74a5; o histórico das marcas conserva f1b98c701. O resumo da lista é
`9d40631cd57635938632c39f4e4dddcb7cd5dc8d4e5062bffc11dfe2467cc312`. Depois desta adoção, a lista só encolhe. O controlo do índice,
a validação histórica no GitHub e a exigência de corpos lidos na aterragem mantêm-se.

## Contagens por coleção

Uma frase pode aparecer no estudo, documento e arquivo; a tabela de coleções
não é uma partição aditiva. A tabela por chave que se segue reparte o total único.

| Coleção | PT | EN |
| --- | ---: | ---: |
| `404` | 1 | 1 |
| `home` | 6 | 6 |
| `agenda` | 7 | 7 |
| `areas` | 1 | 1 |
| `correcoes` | 47 | 47 |
| `dossie` | 74 | 74 |
| `dossies` | 1 | 1 |
| `entradaEscolaESaude` | 5 | 5 |
| `entradaTrabalho` | 1 | 1 |
| `entradaEstado` | 4 | 4 |
| `estudos` | 5 | 5 |
| `explicacao` | 11 | 11 |
| `leituraDaSemana` | 1 | 1 |
| `explicacoes` | 1 | 1 |
| `entradaCasa` | 2 | 2 |
| `indice` | 2 | 2 |
| `lugares` | 1 | 1 |
| `metodo` | 8 | 8 |
| `discussao` | 89 | 89 |
| `entradaPobreza` | 2 | 2 |
| `entradaDinheiro` | 1 | 1 |
| `privacidade` | 2 | 2 |
| `regioes` | 1 | 1 |
| `entradaSalarios` | 3 | 3 |
| `sobre` | 3 | 3 |
| `sugestoesLimite` | 1 | 1 |
| `sugestoesNaoChegou` | 1 | 1 |
| `sugestoesObrigado` | 2 | 2 |
| `sugestoesVazia` | 1 | 1 |
| `sugestoes` | 1 | 1 |
| `temas` | 1 | 1 |
| `estudo` | 722 | 585 |
| `documento` | 832 | 696 |
| `arquivo` | 724 | 715 |
| `area` | 11 | 11 |
| `distrito` | 1 | 1 |
| `municipio` | 11 | 11 |
| `regiao` | 1 | 1 |
| `uniaoEuropeia` | 22 | 22 |

## Contagens por chave

| Estudo, página ou coleção geográfica | PT | EN | Registo bilingue | Pendentes PT | Pendentes EN |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 6 | 6 | 0 | 6 | 6 |
| `/404` | 1 | 1 | 0 | 1 | 1 |
| `/agenda` | 7 | 7 | 0 | 7 | 7 |
| `/areas` | 1 | 1 | 0 | 1 | 1 |
| `/correcoes` | 47 | 47 | 0 | 47 | 47 |
| `/dossies/orcamento-2027` | 74 | 74 | 0 | 74 | 74 |
| `/dossies` | 1 | 1 | 0 | 1 | 1 |
| `/educacao-e-saude` | 5 | 5 | 0 | 5 | 5 |
| `/emprego` | 1 | 1 | 0 | 1 | 1 |
| `/estado-e-economia` | 4 | 4 | 0 | 4 | 4 |
| `/estudos` | 5 | 5 | 0 | 5 | 5 |
| `/explicacoes/dinheiro-do-estado-2026` | 6 | 6 | 0 | 6 | 6 |
| `/explicacoes/dinheiro-do-estado-2027` | 5 | 5 | 0 | 5 | 5 |
| `/explicacoes/leitura-da-semana` | 1 | 1 | 0 | 1 | 1 |
| `/explicacoes` | 1 | 1 | 0 | 1 | 1 |
| `/habitacao` | 2 | 2 | 0 | 2 | 2 |
| `/indice` | 2 | 2 | 0 | 2 | 2 |
| `/lugares` | 1 | 1 | 0 | 1 | 1 |
| `/metodo` | 8 | 8 | 0 | 8 | 8 |
| `/o-que-se-discute` | 89 | 89 | 22 | 67 | 67 |
| `/pobreza-e-desigualdade` | 2 | 2 | 0 | 2 | 2 |
| `/precos` | 1 | 1 | 0 | 1 | 1 |
| `/privacidade` | 2 | 2 | 0 | 2 | 2 |
| `/regioes` | 1 | 1 | 0 | 1 | 1 |
| `/salarios-pensoes-e-apoios` | 3 | 3 | 0 | 3 | 3 |
| `/sobre` | 3 | 3 | 0 | 3 | 3 |
| `/sugestoes/limite` | 1 | 1 | 0 | 1 | 1 |
| `/sugestoes/nao-chegou` | 1 | 1 | 0 | 1 | 1 |
| `/sugestoes/obrigado` | 2 | 2 | 0 | 2 | 2 |
| `/sugestoes/vazia` | 1 | 1 | 0 | 1 | 1 |
| `/sugestoes` | 1 | 1 | 0 | 1 | 1 |
| `/temas` | 1 | 1 | 0 | 1 | 1 |
| `a-casa-em-portugal-e-na-europa` | 92 | 92 | 0 | 92 | 92 |
| `agua-nao-faturada` | 41 | 41 | 0 | 41 | 41 |
| `alentejo-algarve` | 1 | 39 | 0 | 1 | 39 |
| `avaliacao-economica-regional-de-portugal-2026` | 13 | 1 | 0 | 13 | 1 |
| `colecao-area` | 11 | 11 | 0 | 11 | 11 |
| `colecao-distrito` | 1 | 1 | 0 | 1 | 1 |
| `colecao-municipio` | 11 | 11 | 0 | 11 | 11 |
| `colecao-regiao` | 1 | 1 | 0 | 1 | 1 |
| `colecao-uniaoEuropeia` | 22 | 22 | 0 | 22 | 22 |
| `evolucao-de-portugal-desde-1981` | 4 | 1 | 0 | 4 | 1 |
| `evora-2027-capital-europeia-da-cultura` | 116 | 116 | 0 | 116 | 116 |
| `evora-2027-prometido-painel-dinheiro` | 112 | 111 | 0 | 112 | 111 |
| `evora-contas-da-camara-2010-2025` | 69 | 70 | 0 | 69 | 70 |
| `evora-economia-e-dinheiro-publico-de-fora-da-camara` | 45 | 45 | 0 | 45 | 45 |
| `evora-economia-investidores-portas-abertas-2026` | 5 | 2 | 0 | 5 | 2 |
| `evora-orcamentado-pago-devido-2025` | 36 | 36 | 0 | 36 | 36 |
| `evora-os-pelouros-quem-os-teve-o-que-fizeram` | 67 | 3 | 0 | 67 | 3 |
| `evora-prometido-pago-auditado-2026` | 74 | 74 | 0 | 74 | 74 |
| `evora-quem-governou-a-camara-2009-2025` | 53 | 1 | 0 | 53 | 1 |
| `evora-quinze-anos-cinco-mandatos` | 62 | 2 | 0 | 62 | 2 |
| `onde-esta-a-agua` | 74 | 81 | 0 | 74 | 81 |
| `orcamento-2027-o-que-muda-e-para-quem` | 107 | 107 | 0 | 107 | 107 |
| `penalizacoes-por-reforma-antecipada-2026` | 10 | 1 | 0 | 10 | 1 |
| `which-door-is-yours` | 1 | 10 | 0 | 1 | 10 |

## Conferências e igualdade dos bytes

Códigos zero: `npm run build`, incluindo `check:voz` e `check:paridade`;
`check:frases-afirmacao` e `ledger:check`, cada um com e sem `RESEARCHHUB_DIR`;
`check:pre-mandato` e `typecheck`. As plantas das mudanças estão na cadeia
`check:frases-afirmacao`. Foram lidos 795 de
795 corpos do livro e os excertos das
21 linhas da semente. Sem motor, os comandos dizem
`não leu os corpos` e `limpa=false`, sem apresentar essa ausência como limpa.

`tests/leituras/ferramentas.py` continua a cargo da direção fora da sandbox,
conforme a adenda B. Não se repetiu a suite de leituras inteira nem os portões.

```sh
node scripts/gerar-plantas-marcas.mjs dist
node scripts/gerar-frases-afirmacao.mjs dist <destino-novo> <medidas.json>
node scripts/medir-frases-afirmacao.mjs dist <medidas.json>
python3 scripts/comparar-dist-frases.py dist <comparacao.json>
```

Os comandos longos correram por `sh scripts/leituras/curto.sh`.
A regeneração final do registo e da lista é idêntica byte a byte aos ficheiros
comitados. O comparador usa `OEDP_DIST_BASE`, exige a base f362f5ccd do mesmo
dia UTC, exclui só `version.json` e `prova.json`, e permite apenas o campo do
Método de 67 para 68 nas duas edições.

Comparação: 25304 ficheiros, 25302 idênticos,
2 diferenças autorizadas, 0
outras diferenças, 0 novos e 0 apagados.
Abrange 9878 páginas HTML. Não restou diferença de relógio.

A amostra fixa mantém 30 frases por língua.
A estimativa editorial encontrou 22 afirmações
em PT e 23 em EN. Não é uma régua nem uma
verificação da verdade; as decisões estão nas medidas.

## Custo

Até à gravação deste relatório: 20 chamadas de ferramentas,
30 operações internas, 11 corridas de
conferências e 5 execuções dos guiões de geração ou medição. As cadeias npm
contam uma vez; as conferências automáticas dos commits não se somam.
O commit documental e a inspeção final são contados na resposta final.
Zero corridas integrais de portões, capturas ou ajudantes.
