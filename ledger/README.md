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
# Quando existe, tem de existir nas duas línguas — a página da linha publica-a.
derivation: null
derivation_en: null
derived_from: []
# Expressão verificada no build: tem de dar exactamente o valor acima.
check: null

study: "avaliacao-economica-regional-de-portugal-2026"
# Nota interna. NÃO é publicada: ver DECISIONS §1.24.
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
9. uma correcção não trouxer `date` (AAAA-MM-DD), `kind`, `old_value`,
   `new_value`, `reason` **e `reason_en`** — ou trouxer uma chave que não é
   nenhuma destas;
10. uma expressão `check` não der exactamente o valor publicado;
11. houver `derivation` sem `derivation_en`, ou o contrário.

## Cada linha tem uma página

Uma linha do livro-razão é publicada em `/livro-razao/<id>` e `/en/ledger/<id>`,
nas duas edições, da mesma construção. É para lá que aponta o selo de
proveniência junto a cada número — o Método promete que o selo é a porta, e a
porta é esta.

Daí uma consequência a ter presente ao escrever uma linha: **os campos são
publicados como estão**. O portão de HTML confere cada campo renderizado contra
o campo da linha, carácter a carácter, e não deixa passar nem uma paráfrase nem
um espaço a mais. Escrever no `excerpt` uma frase «parecida» com a da fonte não
passa a ser verdade por ficar bonita na página.

**`note` não é publicada.** É a única parte do formato que fica para dentro:
mistura detalhe de proveniência com recado para quem trabalha na linha
(«preencher antes de qualquer republicação»), e existe numa só língua. Ver
DECISIONS §1.24.

## `[a verificar]`

Um campo que não se conhece escreve-se `"[a verificar]"`. **Nunca um valor
plausível.** É aceite pelo validador e contado no fim de cada verificação, para
que a dívida de proveniência esteja sempre à vista em vez de desaparecer.

É o **único** marcador de incerteza do sítio (IDENTIDADE.md §6), e aparece com a
mesma cara em todo o lado: no campo da página da linha, e dentro do selo de
proveniência quando falta alguma coisa.

Uma linha com um campo por confirmar aparece com o selo a tracejado, diz na sua
página que campos lhe faltam, leva `noindex` e fica fora do sitemap — não porque
o valor seja duvidoso, mas porque a prova documental ainda não está lá. Volta ao
índice no dia em que o campo for preenchido, sem mais ninguém decidir nada.

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
derivation_en: "100 − 82 = 18. The EU-27 average is fixed at 100; the distance is the difference, in index points."
derived_from:
  - "pib-pc-portugal-2024"
check: "100 - pib-pc-portugal-2024"
study: "avaliacao-economica-regional-de-portugal-2026"
```

`check` é reavaliado a cada build. Se alguém corrigir o valor de origem e se
esquecer do derivado, o build pára. É a re-derivação cega, feita por máquina.

**`derivation_en` é obrigatório sempre que houver `derivation`**, e pela mesma
razão que `reason_en` (§1.17): a aritmética é prosa da casa, a página da linha
publica-a nas duas edições, e não há recurso à outra língua — uma edição
inglesa a mostrar a conta em português falha o portão.

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
    kind: "correcao"
    old_value: "26,5%"
    new_value: "27,1%"
    reason: "O RASARP 2025 foi revisto; a versão de Setembro corrige o valor nacional."
    reason_en: "The 2025 RASARP was revised; the September version corrects the national value."
```

### `reason` e `reason_en`: o motivo nas duas línguas

O motivo é a única parte do registo que é prosa da casa, e o sítio publica-se
em duas línguas. **Os dois campos são obrigatórios.** Não há tradução
automática nem recurso à outra língua: a edição inglesa mostra `reason_en`, e o
portão de HTML confere, em cada edição, o motivo daquela língua. Uma página
inglesa a mostrar o motivo português falha o build.

Tudo o resto de uma entrada — data, natureza, valor antigo, valor novo — é
igual nas duas edições, porque não é prosa: é o registo.

### `kind`: as duas naturezas

Campo obrigatório. Só dois valores, e a diferença não é cosmética:

| `kind` | o que aconteceu | onde aparece |
| --- | --- | --- |
| `correcao` | o valor publicado estava **errado** | grupo «Correções», com peso, e conta para «N correções publicadas» |
| `actualizacao` | o valor estava **certo** e deixou de estar, porque o que mede mudou | grupo «Atualizações», em surdina, e não conta |

Misturar as duas faz do registo um diário de alterações, e uma confissão
diluída vale menos. **Na dúvida, pergunte: o valor antigo estava errado quando
foi publicado?** Se sim, é `correcao`. Se não, é `actualizacao`.

**Uma actualização regista-se quando muda o valor de uma afirmação por razões
que não são erro.** As recontagens derivadas que se seguem — as contagens do
arquivo que mudam por arrastamento — não se registam em separado: já são
reavaliadas pelo build a cada corrida, e enchê-las no registo abafaria as
correções, que é o que o registo existe para mostrar.

O registo de correções vive em dois sítios, lido do livro-razão e nunca escrito
à mão: em `/metodo`, todas as entradas agrupadas por natureza; e na página de
cada linha, a história daquela linha.

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
