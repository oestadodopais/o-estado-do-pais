# O livro-razão

Um ficheiro YAML por afirmação, em `claims/`. **O nome do ficheiro é o id.**

Uma afirmação é um número que já foi publicado — pela casa ou por outrem — mais
tudo o que é preciso para o encontrar outra vez.

## Formato

```yaml
id: "pib-pc-portugal-2024"

# O valor tal como é publicado, com formatação portuguesa. String, nunca número.
value: "82"
unit: "índice (UE-27 = 100)"

# Proveniência. Em linhas derivadas fica a null: a proveniência é a das origens.
source: "[a verificar]"          # o organismo que publica
document:
  title: "[a verificar]"
  edition: "[a verificar]"
source_url: "[a verificar]"
access_date: "[a verificar]"     # AAAA-MM-DD — quando foi lido
reference_date: "2024"           # AAAA / AAAA-MM / AAAA-MM-DD — a que se refere

# Excerto textual da fonte, palavra por palavra. Nunca uma paráfrase.
excerpt: "[a verificar]"

# null quando o valor é publicado; a aritmética explicada quando é calculado.
derivation: null
derived_from: []
# Expressão verificada no build: tem de dar exactamente o valor acima.
check: null

study: "avaliacao-economica-regional-de-portugal-2026"
note: null

# Correcções datadas. Nunca apagar um valor: acrescentar aqui.
corrections: []
```

## Regras que o build impõe

`npm run ledger:check` falha — e nada é construído — se:

1. o nome do ficheiro não for o id, ou o id não for `minusculas-com-hifenes`;
2. houver um id repetido, ou uma chave que não pertence ao formato (apanha erros
   de escrita nas chaves);
3. faltar `value`, `unit`, `study` ou `corrections`;
4. `value` não tiver nenhum algarismo;
5. faltar qualquer campo de proveniência numa linha **não derivada**;
6. `study` não constar de `src/data/studies.mjs`;
7. `derived_from` apontar para uma afirmação que não existe;
8. uma linha derivada não explicar a aritmética em `derivation`;
9. uma correcção não trouxer `date` (AAAA-MM-DD), `old_value`, `new_value` e `reason`;
10. uma expressão `check` não der exactamente o valor publicado.

## `[a verificar]`

Um campo que não se conhece escreve-se `"[a verificar]"`. **Nunca um valor
plausível.** É aceite pelo validador e contado no fim de cada verificação, para
que a dívida de proveniência esteja sempre à vista em vez de desaparecer.

Uma etiqueta de proveniência com campos por confirmar aparece na página com o
quadrado a tracejado e a dizer-lo por palavras. O leitor vê o que nós vemos.

## Valores derivados

Quando um número é aritmética sobre outros, não deixa de ser uma afirmação —
passa a ser uma afirmação com pais:

```yaml
id: "distancia-portugal-ue27-2024"
value: "18"
unit: "pontos de índice"
source: null            # a proveniência é a das origens
document: null
source_url: null
access_date: null
excerpt: null
derivation: "100 − 82 = 18. A média da UE-27 está fixada em 100; a distância é a diferença, em pontos de índice."
derived_from:
  - "pib-pc-portugal-2024"
check: "100 - pib-pc-portugal-2024"
study: "avaliacao-economica-regional-de-portugal-2026"
```

`check` é reavaliado a cada build. Se alguém corrigir o valor de origem e se
esquecer do derivado, o build pára. É a re-derivação cega, feita por máquina.

**Sintaxe de `check`:** números, ids de afirmações, `+ - * /`, parênteses, e as
contagens `estudos_no_arquivo` e `edicoes_no_arquivo` (tiradas de
`src/data/studies.mjs`). Os operadores e os parênteses **têm de estar separados
por espaços** — os ids levam hífenes, e sem essa regra `a - b` seria ambíguo.

## Correcções

Um valor errado não se apaga. Corrige-se o `value` e acrescenta-se a linha:

```yaml
value: "27,1%"
corrections:
  - date: "2026-09-01"
    old_value: "26,5%"
    new_value: "27,1%"
    reason: "O RASARP 2025 foi revisto; a versão de Setembro corrige o valor nacional."
```

O registo de correções em `/metodo` está montado e vazio, à espera destas
entradas.

## O que NÃO é uma afirmação

- **A escala de um instrumento.** Os números do eixo, ou o `100` que define a
  média da UE-27, são a régua — não a medição. Vão em markup, marcados
  `data-nonledger="escala-de-instrumento"`.
- **Uma data de cabeçalho.** A data da edição é editorial.
- **Um título de estudo.** «Orçamentado, Pago, Devido 2025» é uma citação.
- **As coordenadas da CAOP.** São geometria. A proveniência delas é a citação
  transcrita em `src/data/verbatim.mjs`, que o portão confere carácter a
  carácter.

Cada uma destas excepções tem de justificar-se em `allowlist.yml`. Se a lista
começar a crescer, quase de certeza está lá alguma coisa que devia ser uma
afirmação.
