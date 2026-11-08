# VOZ-2A, adenda H, 08.11.2026

Fecho verde no sítio `2729f6ed7c14dafc630596fa4f31a436d3fe4b53` e no motor `e64065a7a1cd30cc8fd723e2f0b79bf3eeeff176`. As treze edições atuais e as sete entradas de atualização têm a data de 08.11.2026. Os 19 arquivos dos sete estudos conservam os bytes. As 8382 referências dos 25 registos continuam iguais. A contagem de correções não sobe.

## O que mudou em cada estudo

| Estudo | Antes da VOZ-2A | Antes da H | Depois | Fora das FICA na H |
|---|---:|---:|---:|---:|
| evora-2027-capital-europeia-da-cultura | 51 | 8 | 4 | 4 → 0 |
| evora-2027-prometido-painel-dinheiro | 48 | 8 | 4 | 4 → 0 |
| evora-contas-da-camara-2010-2025 | 31 | 19 | 18 | 1 → 0 |
| evora-economia-e-dinheiro-publico-de-fora-da-camara | 15 | 8 | 8 | 0 → 0 |
| evora-economia-investidores-portas-abertas-2026 | 6 | 0 | 0 | 0 → 0 |
| evora-orcamentado-pago-devido-2025 | 25 | 13 | 10 | 3 → 0 |
| evora-prometido-pago-auditado-2026 | 55 | 14 | 13 | 1 → 0 |

04: as retiradas inglesas acompanham o português; «Dois pontos cegos.» volta ao documento e à página portuguesa. A asserção do hospital ganha a citação inglesa.
06: o conteúdo permanece igual; mudam a data da atualização e a referência do commit no manifesto.
07: aplicam-se os pares prescritos; a frase portuguesa do relatório de 2015 e a das tabelas plurianuais voltam à página nas formas anteriores. A página inglesa mantém as suas formas. A V198 conserva o facto sobre a coluna de 2024.
14: aplicam-se as formas portuguesas sobre os valores, os documentos previsionais e a decisão europeia, e saem os dois pares ingleses sobre percentagens. A asserção dos previsionais ganha a citação portuguesa e a revisão delimitada aos documentos municipais.
16: o contexto passa a «destes números»; o português de 2024 e a ausência inglesa recebem os pares prescritos. A forma inglesa da V330 já estava aplicada e conserva-se.
18: a composição volta a imprimir o parágrafo português dos pontos cegos; o bloco do Turismo de Portugal recupera integralmente a forma guardada, sem a frase da freguesia. O catálogo inglês recebe a V323. Os índices das decisões e das saídas declaradas acompanham o parágrafo reposto.
19: a composição importa as formas autorizadas e a asserção dos previsionais do 14.

## Régua, contagens e provas

A lista passa de 160 para 181 decisões: REESCREVE 84 → 99, SAI 39 → 43 e FICA 37 → 39.

A régua acrescenta as seis formas portuguesas com n, `do not enter`, `did not enter`, `cannot` e quatro contrações com os dois apóstrofos. As 17 plantas dão vermelho. A isenção exige o conjunto exato dos estudos da lista VOZ-2B. As V327 e V328 acrescentam quatro exceções exatas; as exceções passam de 64 para 68. As 39 FICA estão presentes literalmente em 60 combinações de frase e página.

Nas 26 páginas, pela régua alargada: classe 231 → 57; fora das FICA 174 → 0; páginas com ocorrências 19 → 15. Só nesta adenda: classe 70 → 57; fora das FICA 13 → 0. A medição histórica conserva a decisão FICA da forma antiga da V171; usar a lista atual literalmente na edição antiga contaria indevidamente essa frase como uma recusa adicional. A régua atual não recebe essa forma antiga como exceção.

Comandos, um por contagem:

```sh
node design/especime-v3/medicoes/voz2a-adenda-h-2026-11-08/medir-classe.mjs <temporario>/antes.json <worktree-anterior>/dist --antes
node design/especime-v3/medicoes/voz2a-adenda-h-2026-11-08/medir-classe.mjs <temporario>/depois.json
```

No sítio inteiro: 9838 páginas, 68 ocorrências captadas e 68 permitidas; zero frases, proteções ou ledes novas recusadas. Os pares: seis estudos bilingues, zero blocos sem par, zero mudanças sem entrada na lista, planta a 1 e controlo a 0. O guião entrou no `check:voz`. Os 175 campos `nova` das duas listas dão zero recusas e zero diferenças de números retirados entre línguas.

As contagens da prova da voz que mudam desde ce0cf75:

| Campo | Antes | Depois |
|---|---:|---:|
| contagens: blocos_antes | 2920 | 2922 |
| contagens: blocos_conferidos | 2817 | 2819 |
| contagens: blocos_depois | 2817 | 2819 |
| contagens: com_palavra | 150 | 149 |
| contagens: cortes | 463 | 462 |
| contagens: frases_depois | 17752 | 17749 |
| contagens: offsets_conferidos | 9761 | 9758 |
| contagens: substituicoes | 411 | 412 |
| estratos: S3·famílias-leituras·aprovado-24.08 | 77 | 76 |
| estratos: S6·terceira-voz·proposta-27.08 | 295 | 296 |

A reposição do parágrafo no 04 português (94 → 95 blocos) e na composição 18 portuguesa (160 → 161 blocos) acrescenta dois blocos. A V324 incorpora um corte inglês na fonte; a reposição da frase de 2015 na página portuguesa acrescenta uma substituição. Os números esperados do ensaio foram atualizados por estas medições, sem mudar a régua. As referências antes e depois da passagem de voz não mudam. Não entram rotas novas; o teto L1 permanece 3479.

## Livros, campo a campo

A diferença reproduz-se num comando:

```sh
python3 design/especime-v3/medicoes/voz2a-adenda-h-2026-11-08/conferir-livros.py <motor>
```

04: só `assertions`, acrescentando a citação inglesa a `hospital-registos-sem-identidade-declarada`, com a mesma revisão.
14: só `assertions`, acrescentando a citação portuguesa a `so-previsionais` e corrigindo a revisão. As duas citações antigas continuam noutra linha da tabela e conservam-se.
16: só `assertion_ignores`, retirando «o contexto de todos os números», que perdeu a sua frase.
18: só a asserção importada do 04 e o respetivo `ledger_sha256` em `composto_de`.
19: só a asserção importada do 14 e o respetivo `ledger_sha256` em `composto_de`. Todas as linhas, valores, ignores numéricos e restantes asserções conservam-se nesta adenda. As mudanças autorizadas pelas adendas D e E ficam como estavam.

Fonte 04 Évora Public Money: `689618106d38640d127531b80bc179215429eb71f773c7a023ac7bad69a19a44` → `f5413079fab9f35bf9a31dcd3850cd9f5950c511cc7e2bd69b51213b6d306db6`.
Fonte 14 Évora 2027: `8ca64d1794639d95f7d1ab83be97908bb7e6f3b4a070b02eee15d1ba195942ec` → `2ceb01c9c5e76f87adba8fcdefffa99e81674006e693ff3e40c8ea93fd29e01a`.

As duas asserções são idênticas nas fontes e nas composições e as citações novas estão ancoradas na prosa. As quatro plantas sobre as citações portuguesas têm controlo 0 e retirada 1. A palavra inglesa «neither» não pertence ao vocabulário atual de `core.assertions`; a sua citação foi declarada e conferida, mas não se atribui à régua uma recusa que ela não faz. O ensaio inicial dessa retirada inglesa foi corrigido para medir a cobertura portuguesa que a régua efetivamente protege.

## Conferências

Primeira corrida integral: build 1, verify 125 (não correu), typecheck 0 e motor 1. O build encontrou a data fixa de 07.11 no ensaio das portas da edição só portuguesa. O ensaio passou a ler a data do manifesto e conserva as plantas da língua, rota e hreflang; acrescenta a recusa de uma data inexistente. O motor encontrou as contagens antigas da voz e os índices antigos de três saídas na composição 18. Os ensaios isolados finais deram 0: 26 verificações de voz, 23 de composição.

Fecho dirigido pelo escrivão, sem repetir a corrida integral: build inteiro 0, typecheck 0, core.gate 0. Os dez comandos seguintes ficaram cobertos: cinco pelo build e cinco corridos pelo executor. A união, a cabeça e a imutabilidade do dist foram conferidas.

| Conferência | Código |
|---|---:|
| check:voz | 0 |
| check:lugar | 0 |
| check:edicoes | 0 |
| check:registo | 0 |
| check:datas | 0 |
| check:discussao | 0 |
| check:alvos | 0 |
| check:moldura | 0 |
| check:primeira | 0 |
| check:dossies | 0 |
| guião das frases novas | 0 |
| guião dos pares | 0 |
| plantas VOZ-2A e 17 formas novas | 0 |
| plantas das asserções | 0 |

As plantas recusadas têm código 1 e os controlos código 0. A primeira corrida vermelha fica guardada em `portoes-primeira/`; o fecho verde em `fecho/`. Não houve capturas. A consulta opcional dos processos foi recusada pela sandbox: `PermissionError: [Errno 1] Operation not permitted: ps`; não foi pedida escalada.

## Frases copiadas do dist

As linhas seguintes são fatias do texto efetivamente lido no dist, extraídas por `extrair-frases.mjs`. Incluem as dez reescritas da adenda A aplicáveis à VOZ-2A, a V308 e as reescritas novas da H. As decisões SAI e FICA não têm campo `nova`.

- V043 (en): Revenue execution fell from 96% in 2021 to 61.44% in 2025, and the accounts themselves show a pattern: the municipality budgets outside money before anyone has committed it, such as the recovery-plan works and the protocol for access roads to the new hospital, and then that money does not come in. That this pattern explains the fall is an inference.
- V053 (en): Revenue execution fell from 96%source · Município de Évora in 2021 to 61.44%source · Município de Évora in 2025, and the accounts themselves show a pattern: the municipality budgets outside money before anyone has committed it, such as the recovery-plan works and the protocol for access roads to the new hospital, and then that money does not come in. That this pattern explains the fall is an inference.
- V057 (en): The two registers use different names, and neither source states that they are the same entity. The contract objects themselves show that they are one body (inference).
- V064 (en): The PRR money attributed to Évora overwhelmingly flows through entities other than the municipality (the university, the health service, housing bodies, national agencies), and most of the part that is the Câmara's to spend has yet to arrive (inference).
- V164 (pt): A execução da receita caiu de 96% em 2021 para 61,44% em 2025, e as próprias contas mostram um padrão: o município orçamenta dinheiro de fora antes de alguém o ter comprometido, como as obras do plano de recuperação e o protocolo das acessibilidades ao novo hospital, e depois esse dinheiro não é recebido. Que este padrão explique a queda é uma inferência.
- V176 (pt): A execução da receita caiu de 96%fonte · Município de Évora em 2021 para 61,44%fonte · Município de Évora em 2025, e as próprias contas mostram um padrão: o município orçamenta dinheiro de fora antes de alguém o ter comprometido, como as obras do plano de recuperação e o protocolo das acessibilidades ao novo hospital, e depois esse dinheiro não é recebido. Que este padrão explique a queda é uma inferência.
- V182 (pt): Os dois registos usam nomes diferentes, e nenhuma das fontes afirma que são a mesma entidade. Os próprios objetos dos contratos mostram que são o mesmo organismo (inferência).
- V194 (pt): O relatório de 2015 traz 48,1%, um fundo mais fundo, um ano depois das tranches do resgate, pelo que os colapsos de execução já seguiram antes as crises de dívida de Évora (inferência; o valor é do próprio relatório de 2015).
- V195 (pt): Dez anos a pagar a dívida do resgate são o contexto destes números: do investimento a executar a 21,13%, do dinheiro do plano a ir para operações da dívida, e de uma margem de €28 192 653 ser uma conquista genuína em vez de uma delicadeza contabilística (inferência; a tabela é da fonte).
- V196 (pt): O dinheiro do PRR atribuído a Évora flui esmagadoramente através de entidades distintas do município (a universidade, o serviço de saúde, organismos de habitação, agências nacionais), e a maior parte do que cabe à Câmara gastar ainda está por chegar (inferência).
- V308 (en): Ten years of paying down the rescue debt is the context for these numbers:
- V309 (pt): Cada valor tem a construção que a sua própria fonte declara.
- V310 (pt): Os documentos do município que se leram são previsionais; nenhum deles é uma conta de execução​
- V311 (pt): Os documentos do município que se leram são previsionais; nenhum deles é uma conta de execução
- V312 (pt): A decisão da União que rege as capitais europeias da cultura devolveu um corpo vazio nos três caminhos tentados.
- V315 (pt): A opinião limpa de 2025 significa que os livros recuperaram a sua testemunha externa; não certifica 2024 retroativamente.
- V316 (pt): Nunca foi publicado um documento de contas de 2024, e cada valor de 2024 é uma coluna comparativa do relatório de 2025.
- V317 (en): The clean 2025 opinion restores the external witness going forward; it cannot restore it backward, and every multi-year table inherits that asterisk on its 2024 column.
- V320 (pt): Esse registo republica-se diariamente sem histórico, pelo que aqueles valores são os desse retrato.
- V321 (en): The 2015 report shows 48.1%, a deeper trough, in the year after the bailout instalments, so execution collapses have followed Évora's debt crises before (inference; the figure is the 2015 report's own).
- V322 (en): It is left unknown.
- V323 (en): The Tribunal de Contas catalogue consulted covers 4 of the Tribunal's product families rather than all of them.
- V325 (en): Two blind spots.
- V326 (pt): Dez anos a pagar a dívida do resgate são o contexto destes números:
- V330 (en): Ten years of paying down the rescue debt is the context for these numbers:
- V198 (pt): A opinião limpa de 2025 devolve a testemunha externa daqui para a frente; não a devolve para trás, e cada tabela plurianual herda esse asterisco na coluna de 2024.
- V238 (pt): Dois pontos cegos.

## Commits e orçamento

Motor: `8014144b`, `8e6cd348`, `e64065a7`. Sítio: `8e58b34c`, `9e8287a0`, `2729f6ed`; o commit deste relatório acrescenta apenas provas e relato. Os treze `origin_ref` apontam a `e64065a7a1cd30cc8fd723e2f0b79bf3eeeff176`, que contém os bytes publicados. Os commits foram feitos pelo escrivão, com os trailers pedidos.

108 chamadas de ferramentas de orquestração, medidas no registo desta passagem ({'exec': 79, 'wait': 29}). 47 comandos por curto.sh, incluindo gerações, conferências isoladas e medições; a lista está em medidas-adenda-h-voz2.json. Uma corrida integral dos portões e uma corrida dirigida de fecho; dois core.gate fora da sandbox. Nenhuma captura. A conferência adicional de privacidade terminou com código 0. tokens used: não observado.
