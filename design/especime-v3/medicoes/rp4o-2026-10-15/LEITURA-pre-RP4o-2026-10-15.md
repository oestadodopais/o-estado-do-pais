# A pré-leitura do mandato RP4-o pelo Codex `gpt-6-astra` (`xhigh`, só texto), 15.10.2026

*Lançada por `scripts/leituras/ler.sh` sobre uma pasta com o mandato, a linha do livro-razão, as linhas do estudo, a entrada do manifesto, a secção das correções do README e os campos das três linhas do PRR de Évora; a saída do Codex começou às 07:16:46 a 07:26:29 UTC. Nenhum Blocking; quatro Major (M1 a M4) e cinco Minor, aceites pelo lugar de direção e postos no mandato a 15.10.2026, salvo o m1 (o vocabulário interno «sítio» para o repositório web mantém-se, por ser o das regras do projeto) e a reescrita da frase do estudo proposta em M3 (a frase fica com a mudança mínima, sem a atribuição da PORDATA ao valor de 1981). O texto abaixo é a última mensagem do leitor, sem edição.*

## 1. Blocking

**Não encontro um Blocking demonstrado pelos quatro critérios pedidos.** Não vou transformar falta de prova numa contradição.

O YAML confirma o valor, a fonte declarada e os campos por confirmar descritos no §0.2. O excerto do estudo confirma a frase do §0.3. Os campos das três linhas do PRR são compatíveis com a descrição do §0.1. As afirmações sobre todo o repositório, os commits e as contagens globais não são verificáveis neste pacote, mas também não são desmentidas por ele.

Quanto às correções, o §1.2 manda conservar o valor anterior numa entrada e selar a história. O `kind: "correcao"` aparece no README. **Não posso declarar inválido o tipo destinado à revisão de proveniência:** o excerto do README termina precisamente antes de enumerar os três tipos, e o mandato manda consultar o código.

Também não há um número do INE apresentado inequivocamente como confirmado. O §0.4 chama-lhes «por confirmar na fonte» e proíbe a sua entrada nos ficheiros sem leitura documental. O «dizia» aplicado ao destaque mensal é menos cuidadoso do que o «diria» aplicado ao anual, mas está abrangido por essa ressalva.

As dependências externas ao pacote, incluindo a M83 e os mecanismos de publicação, limitam esta pré-leitura. A sua ausência aqui não demonstra que estejam indisponíveis ao construtor descrito no mandato.

## 2. Major

**M1. §1.2: a razão obrigatória publica uma origem e um arredondamento que não foram estabelecidos.**

**Citações:** «o número da PORDATA arredondado aos milhares»; «O valor publicado vinha da PORDATA, arredondado aos milhares»; «which prints the exact value».

O YAML prova que a PORDATA estava indicada como fonte. Não prova que o número tenha sido lido na PORDATA, nem como foi arredondado. Além disso, −34 100 não é um resultado de arredondamento ao milhar. Uma série expressa em milhares pode conservar casas decimais; isso não equivale a arredondar aos milhares. Também não se deve chamar «exato» ao valor antes de conhecer a precisão e o estatuto que o documento lhe atribui.

**Emenda proposta:**

Substituir «(o número da PORDATA arredondado aos milhares)» por:

> (o valor atualmente publicado na linha)

Substituir integralmente as duas razões por:

> PT «A linha publicava −34 100 pessoas com a PORDATA indicada como fonte, sem documento lido. O valor passa a ser o saldo natural de 2025 lido no documento do INE identificado nesta linha.»

> EN «The row displayed −34 100 people with PORDATA listed as its source, without a source document having been read. The value is now the natural population change for 2025 read in the INE document identified in this row.»

Estas razões descrevem a mudança verificável, sem inventar a origem do arredondamento.

**M2. §§1.2 e 2: falta separar igualdade numérica, transcrição literal e apresentação.**

**Citações:** «o `new_value` como o INE o imprime na formatação portuguesa da casa»; «Se o INE imprimir exatamente −34 100»; «o valor é o que o INE imprime».

Estas instruções não resolvem um PDF que use outro sinal de menos, outros separadores ou outra unidade. Uma diferença tipográfica não deve criar uma correção numérica. Uma mudança de unidade também não pode deixar `unit: "pessoas"` por mera inércia.

**Emenda proposta:**

> Compara o valor do INE com o valor atual numericamente, na mesma unidade, usando a normalização aceite pelo `ledger:check`. O `excerpt` conserva literalmente o texto do INE; o `value` usa a forma numérica do livro-razão, sem alterar a precisão. Diferenças apenas no sinal ou nos separadores não originam uma correção de valor. Se o documento não publicar o saldo em pessoas e for necessária uma conversão de unidade ou uma escolha de arredondamento, para sem alterar a linha.

Para fechar também o ramo de igualdade, substituir a última frase do §1.2 por:

> Se os valores forem numericamente iguais, conserva o `value`. Regista a revisão de proveniência com o `kind` e os campos expressamente documentados e aceites pelo validador. Se não existir um tipo aplicável, conserva `corrections` e regista a revisão no relatório e no commit. Executa a selagem apenas se acrescentares uma entrada.

Isto não declara inválido um tipo que não vimos. Define o comportamento caso ele não exista.

**M3. Preâmbulo e §1.3: corrigir esta linha não demonstra a promessa sobre todos os números publicados.**

**Citações:** «só são exatas quando esta linha estiver lida na fonte»; «sem mais nenhuma palavra mudada»; «o “+56 300” de 1981 fica (é o ficheiro do estudo, da PORDATA, e não tem linha)».

O mandato passa de uma conclusão sobre uma linha para duas afirmações sobre todo o projeto. Essa passagem não está demonstrada. O próprio texto conserva um número de 1981 sem linha. Isso não prova, por si só, que nunca tenha sido lido na fonte, mas impede usar esta intervenção como prova de que todos o foram.

O excerto fornecido também não identifica a PORDATA como fonte individual do valor de 1981. A atribuição deve permanecer por demonstrar.

**Emenda proposta no preâmbulo:** substituir «só são exatas quando esta linha estiver lida na fonte» por:

> não ficam demonstradas apenas pela leitura desta linha; a sua publicação exige verificar o restante âmbito a que se referem

**Emenda proposta no §1.3:** substituir a instrução sobre a frase e a manutenção de 1981 por:

> Na frase do estudo, substitui «Era <b>+56 300</b> em 1981 e é <b>−34 100</b> em 2025.» por «O ficheiro do estudo apresenta <b>+56 300</b> para 1981; para 2025, o INE publica <b>{value}</b>.». Substitui `{value}` pelo texto do campo `value` da linha validada. O valor de 1981 fica inalterado e sem linha nova; este bloco não verifica a sua fonte primária.

A emenda identifica separadamente as duas proveniências e mantém o âmbito numa única linha.

**M4. §§0.3 e 1.3: falta decidir o que acontece à série que a frase abre.**

**Citações:** «traz a série do saldo natural em milhares (56,3 em 1981; −34,1 em 2025)»; «sem mais nenhuma palavra mudada».

No excerto fornecido, a frase abre a vista `Saldo natural (milhares)`. Mudar o texto pode deixá-lo a apresentar um valor diferente do que aparece nessa vista. Não sabemos ainda se haverá incompatibilidade: o novo valor pode corresponder ao mesmo arredondamento. O mandato deve mandar verificar essa relação e definir o que fazer se ela falhar.

**Emenda proposta, a acrescentar ao §1.3:**

> Antes de alterar a frase, verifica o valor de 2025 na série e nas vistas que ela abre. Se essas vistas apresentarem o valor validado com o arredondamento correspondente à precisão declarada, conserva-as e regista essa correspondência no relatório. Se apresentarem um valor incompatível, ou se a precisão não estiver definida, para sem alterar a edição do estudo e assinala a necessidade de alargar o mandato.

Quanto aos outros dois testes pedidos:

- **Campos do YAML:** não encontro um preenchimento obrigatório em falta que o mandato tenha omitido. `derived_from: []` e `check: null` não são nomeados, mas já existem e são coerentes com uma linha de valor publicado diretamente. Não precisam de ser preenchidos para tornar a linha completa.
- **Ausência do destaque anual:** o §2 já determina a paragem, com os endereços lidos e sem mudança da linha. Não falta uma alternativa mensal; essa alternativa contrariaria o âmbito escolhido. Falta apenas esclarecer a entrega em caso de interrupção, como proponho abaixo.

## 3. Minor

**m1. Preâmbulo, §§0.2, 1.1, 1.2, 2 e 3: vocabulário do projeto.**

**Citações e emendas propostas:**

- «numa worktree do sítio cortada da cabeça nova de `main`» → «numa worktree do repositório web criada a partir da cabeça de `main`».
- «cópia bruta do livro do sítio» → «cópia bruta do livro-razão do projeto».
- «com o localizador que a casa usa para um PDF» → «com o formato de localizador de PDF adotado pelo projeto».
- «na formatação portuguesa da casa» → «na formatação portuguesa do livro-razão».
- «no sítio também» → «no repositório web também».
- «Os três portões do sítio» → «Os três portões do repositório web».

Estas substituições aplicam-se ao mandato, sem reescrever as fontes históricas citadas.

**m2. §§0.3 e 1.3: «resumo» é impreciso perante os campos concretos do manifesto.**

**Citações:** «que resumo o manifesto [...] exigem»; «com o resumo do manifesto».

O manifesto fornecido distingue tamanhos, SHA-256 dos bytes brutos e SHA-256 dos bytes normalizados. «Resumo» não identifica o que deve acompanhar a regeneração.

**Emenda proposta:** substituir essas referências por:

> os campos de tamanho e de SHA-256 correspondentes aos ficheiros que o mecanismo de publicação regenerar

**m3. §1.1: explicitar a conservação dos campos evita uma reconstrução desnecessária do YAML.**

**Citação:** «A nota reescreve-se para dizer o que a linha é hoje».

Não é um campo em falta. É uma precisão útil para um construtor que não pode perguntar.

**Emenda proposta, a acrescentar depois dessa frase:**

> Conservam-se `id`, `unit: "pessoas"`, `reference_date: "2025"`, `derivation: null`, `derived_from: []`, `check: null` e `study`. O saldo é transcrito do documento, não calculado a partir dos nascimentos e dos óbitos.

**m4. §3: a contagem de tokens não é, por si só, um custo monetário.**

**Citação:** «e o custo pela linha “tokens used”».

**Emenda proposta:**

> e a contagem de tokens indicada pela linha «tokens used»; se essa linha não estiver disponível, regista «não disponível», sem estimativa de custo monetário

**m5. §§2 e 3: distinguir interrupção de entrega concluída.**

**Citações:** «o construtor para, diz o que encontrou»; «O relatório [...] o documento do INE lido [...] a entrada das correções, a história selada».

A entrega enumera elementos que podem não existir quando se aplica a paragem prevista.

**Emenda proposta, a acrescentar ao §3:**

> Se ocorrer a paragem prevista no §2, entrega apenas o relatório da interrupção, com os endereços consultados, o motivo e o estado dos ficheiros eventualmente criados. Assinala os restantes elementos da entrega como «não executado» e o bloco como «não concluído».

## 4. O veredicto

**Ainda não está pronto para um construtor que não pode perguntar nada.** O percurso principal está definido, mas deixa decisões materiais sobre a comparação dos valores, a razão pública da correção e a relação entre a frase e a série do estudo.

Tiraria as razões que afirmam um arredondamento não documentado e a conclusão de que esta linha basta para validar as promessas gerais do ME1. Também retiraria os números candidatos do §0.4: estão assinalados como não confirmados, mas antecipam desnecessariamente o resultado da leitura.

**Citação do §0.4:** «diria 87 764 nados-vivos de mães residentes, 121 817 óbitos de residentes e um saldo natural de −34 053; o destaque mensal do INE de dezembro de 2025 (dados provisórios) dizia −34 244».

**Emenda proposta:**

> tem o conteúdo por confirmar no documento original. O destaque mensal não substitui o anual neste bloco.

Falta fechar as decisões identificadas em M1 a M4. Não falta inventar um novo `kind`, preencher campos que já estão corretamente vazios ou criar uma alternativa para a ausência do destaque anual. A paragem já está autorizada; deve contar como uma interrupção documentada, nunca como conclusão do mandato.