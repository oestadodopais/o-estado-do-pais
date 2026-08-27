# Leitura cruzada do Codex · a grelha da voz (27.08.2026, madrugada)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre um pacote de seis ficheiros: o `git diff main...HEAD` de `INVENTARIO-FRASES.md` (576 linhas acrescentadas, 532 retiradas: a coluna «bloco» tocou todas), `VOZ-MARCADORES.md` (os marcadores e as exceções), a página de Évora construída no ramo, os excertos das Emendas 15 e 18 e o prompt. Custo: 151 198 símbolos, 680 s. Duas plantas, registadas com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | uma linha acrescentada ao diff com «Os números desta página foram reconferidos contra as fontes antes de serem publicados.» declarada como conteúdo (o empacotamento pôs a frase na coluna errada, o que a fez parecer uma linha corrompida) | **sim**: apontada como classe inválida e mandada inventariar como autorreferência |
| P2 | uma exceção a dispensar «Cada valor deste sítio é conferido pela equipa antes de ser publicado.» com a razão «descreve o que o sítio faz» | **sim**: «shifted columns and no valid reason», rejeitada |

**Pontuação: 2 de 2**, com a ressalva de que as duas plantas chegaram malformadas pelo empacotamento e a leitura as apanhou também por isso; da próxima vez as plantas seguem a forma exata das linhas.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **A página de Évora ainda fala de si em quatro sítios que o tripwire não vê** («A página mostra as duas: escolher uma em silêncio esconderia que a diferença existe.», «nos quatro anos que esta página publica», «a diferença é publicada arredondada ao euro», «Fora do que foi lido: …»): o marcador «sta página» não apanha «a página». **Real; V1 para o construtor**, com os marcadores que faltavam («a página», «publicamos», «selecionámos», «nosso/nossa», «este observatório»).
2. **«Painel europeu reconferido a <data>» no cabeçalho de todas as páginas**: uma frase de diligência. **Real; V2**: passa a «Painel europeu · <data>».
3. **A agenda e o índice dos estudos descrevem o processo do sítio** («as fontes que este sítio cita», «este observatório está a medir», «registo do motor», «tradução da casa», «página por escrever», «estado de migração»). **Real; V3.**
4. **Uma dispensa ao nível da rota** (`/estudos`, «o observatório») e a nota dos marcadores a dizer que «auditor independente» está dispensado quando já não está na lista. **Real; V4.**
5. **Os marcadores ruidosos** («confer», «garant», «independ», «método», «prova», «nós», «o trabalho»…): a leitura chama-lhes bloqueantes; o tripwire só obriga a uma razão escrita, e a medida do ruído são as oito exceções em 395 frases. **Fica como está, registado (V5).**
6. **As exceções que a leitura rejeita e o lugar de direção mantém:** `/correcoes` (a Emenda 17 do diretor faz da política de correções o conteúdo dessa página); as ledes e as contagens do livro-razão (à decisão do diretor, como no protocolo); «As regiões publicadas na régua da convergência» é a legenda do que a régua mostra (navegação).
7. **A lede do estudo transversal** («Uma leitura transversal de um município português… recolhidos em direto a…, relido a…») é o texto do próprio documento, transcrito: é a I69 do motor (a segunda passagem de voz), não deste bloco.
8. **Pedantismos que não se seguem:** «sem linha ainda» tem três palavras (a forma da casa é essa); «[a verificar] (to verify)» é um par pt · en no ficheiro dos marcadores e não numa página.

## O relatório, tal como veio

I could not create `REPORT.md`: the workspace is read-only, and the write was rejected. The completed report is below; verified at 899 words.

# Fresh-eye audit

## 1. Markers

- **[note] Good/narrow:** “ste sítio”, “this site”, “sta página”, “this page”, “não fabrica”, “manufactures none”, “não inventa”, “invents none”, “prosa da casa”, “house prose”, “este livro-razão”, “this ledger”. They target an explicit house subject or known phrase and seldom hit ordinary copy.
- **[should fix] Real hits, but context required:** “verific”, “reconfer”, “honest”, “rigor”, “rigour”, “diligên”, “diligen”, “transparen”, “fiáve”, “reliab”, “mostra-se porque”, “is shown because”. They also match ordinary source content; “reconfer” is redundant with “confer”.
- **[blocking] Too noisy:** “confer”, “garant”/“guarantee”, “independ”, “método”/“method”, “prova”/“proof”, “a equipa”/“the team”, “nós”/“we”/“our”/“us”, “o observatório”/“the observatory”, “assente”/“resting on”, “ainda não há”/“there are no”, “o trabalho”/“the work”, “atravessou”/“crossed into”, “mostra-o”/“shows it”, “avaliáve”/“assessable”. These commonly occur in legal, scientific, sports, quoted, or factual content (“conferência”; “proof of residence”; “independent auditor”); case-insensitive whole-word “us” also catches “US”.
- **[blocking] Missing:** Portuguese pro-drop/possessives and demonstratives: “selecionámos”, “publicamos”, “nossa”, “este observatório”. “Selecionámos estes quatro indicadores porque são os mais relevantes.” is forbidden intention/method and passes.

## 2. Exceptions

- **[note] Keep:** “a verificar” / “to verify”; reason: “diz que falta um campo de proveniência”. It is a short absence state.
- **[blocking] Reject:** “/correcoes”; reason: “A política de correções é o CONTEÚDO desta página”. Making site method the page’s object does not make it non-self-referential.
- **[blocking] Reject:** “/estudos”; reason: “O arquivo nomeia a publicação de que é o arquivo”. A route waiver also admits coverage/migration claims.
- **[note] Keep:** “Nesta página” / “On this page”; reason: “leva a outro sítio da mesma página”. It is navigation.
- **[blocking] Reject:** “O que as fontes que este sítio cita publicam a seguir.”; reason: “Nomeia o âmbito do calendário”. That is site coverage.
- **[blocking] Reject:** “Uma linha por número publicado. Cada linha guarda o valor tal como a fonte o publicou, quem o produziu, o documento e a edição, o endereço, a data em que o lemos e um excerto textual (e, quando o número é calculado por nós, a conta explicada e reavaliada a cada construção).”; reason admits “a leitura estrita chama-lhe o método do sítio”. The index is not a line receipt.
- **[blocking] Reject:** “Todas as afirmações publicadas neste sítio, uma linha cada: o valor tal como foi publicado, a fonte, o documento, o endereço, a data de acesso e o excerto.”; reason: “a mesma frase da lede noutra forma”. It states coverage/method.
- **[blocking] Reject:** “2552 afirmações · 325 calculadas · 2417 linhas de concelhos · 2544 de 2552 linhas com proveniência completa · 8 de 2552 linhas com campos por confirmar · 2417 linhas · 308 concelhos · 2417 com proveniência completa · 0 linhas · 0 concelhos · 0 com proveniência completa”; reason calls these “chaves da prova”. They advertise coverage/diligence.
- **[blocking] Reject:** “conteúdo: descreve o que o sítio faz”; its “reason” is “Cada valor deste sítio é conferido pela equipa…”. The row has shifted columns and no valid reason.

## 3. Inventory diff

**[blocking]** I audited all 454 added table rows. Changes:

- “An observatory of Portugal.” has the invalid declared class “Os números desta página foram reconferidos…”. Class it **navigation**; inventory the injected Portuguese claim separately as **self-reference** because it asserts verification.
- **navigation → self-reference:** “As regiões publicadas na régua da convergência.” / “The regions published on the convergence rule.” They state coverage.
- **content → self-reference:** the four rejected phrase exceptions above; every ledger count beginning “132/136/2552 afirmações/claims”; every provenance-completeness count; and the 2416/2417/0-row totals. These state coverage, calculation, or diligence.
- **content → self-reference:** “Fora do que foi lido.”, its longer capture sentence, and both English twins; “The recovery-plan totals that appear in that work’s reading…”; and “The difference is small, and it is shown because…”. They expose reading limits or editorial rationale.
- **content → self-reference:** correction-process prose; the agenda pairs containing “este observatório está a medir” or “registo do motor”; study/archive pairs containing “recolhidos em direto… relido”, “house translation”, “page not yet written”, “No files to download”, or “migration state”; and “Com página” / “With a page”. These are method, intention, or coverage. All other added classes hold.

## 4. Évora page

**[blocking] Exact offending text:** “Painel europeu reconferido a 2026-08-24”; “· a diferença é publicada arredondada ao euro; os dois valores acima diferem em cêntimos.”; “O índice de dívida da Direção-Geral desceu de 242,6% em 2014 para 105,5% em 2024, nos quatro anos que esta página publica.”; “A página mostra as duas: escolher uma em silêncio esconderia que a diferença existe.”; “Fora do que foi lido: as capturas que sustentam a repartição de pelouros começam no mandato seguinte.”; “Fora do que foi lido.”; “Uma leitura transversal de um município português: o registo de projetos do plano de recuperação, o registo de contratos públicos e o catálogo do tribunal de contas do Estado, recolhidos em direto a 2026-08-04, e o registo do plano de recuperação relido a 2026-08-20.”

**[note]** No “sede” or “sediad” occurrence exists anywhere in the HTML.

## 5. Other defects

- **[blocking]** EXCECOES.md starts mid-sentence, duplicates the marker document, and ends with the shifted row. MARCADORES.md says “auditor independente” is allowlisted, but it is absent.
- **[should fix]** “[a verificar] (to verify)” leaks English into Portuguese. “sem linha ainda” / “Sem linhas ainda.” / “no row yet” / “No rows yet.” have three words, contradicting the two-word rule.

**Verdict: blocking; the tripwire is noisy, bypassable, internally corrupt, and the built reader page still violates the rule.**