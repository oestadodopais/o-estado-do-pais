# Bloco F0.7 · higiene pública e de dados · o relatório do construtor

*Escrito pelo construtor (Claude Opus 5) a 03.09.2026, no ramo `higiene-2026-09-03` dos dois repositórios. O bloco é o F0.7 do `PLANO-fiabilidade-2026-09-02.md` §2, e os achados são os das secções 4 e 5 da `AUDITORIA-2026-09-02.md`. Cada número aqui foi medido com o comando que está ao lado; onde a auditoria disse uma coisa e a medição disse outra, está escrito qual foi qual. Sem travessões na prosa.*

## 0 · O que ficou feito, e o que não

| item | estado | onde |
|---|---|---|
| 1 · os 16 documentos com `noindex`, `lang` e o rótulo de IA | feito | `src/lib/documentos.mjs:584`, `:603`, `:565`; `scripts/gate-html.mjs:1131` |
| 2 · `engines` a um maior | **não feito, e é decisão do diretor** | a Vercel constrói em Node 24.x e o `.nvmrc` diz 22.23.1 |
| 3 · Astro 7.2.10 e `@astrojs/sitemap` 3.7.4 | feito | `package.json`; a construção não mudou um byte de conteúdo |
| 4 · o JSON-LD com `<` escapado | feito | `src/lib/jsonld.mjs` (novo, 40 linhas); `src/layouts/Base.astro:267-268` |
| 5 · os identificadores mortos e a varredura no `verify` | feito, e eram 18 e não 12 | `scripts/check-mortos.mjs` (novo, 264 linhas) |
| 6 · a excepção órfã, as razões envelhecidas, a regra nova, o `ledger/README` | feito, e a regra apanhou uma terceira órfã | `ledger/allowlist.yml`; `scripts/gate-html.mjs:218` e `:6778`; `ledger/README.md:747` |
| 7 · `.claude/` inteiro no `.gitignore` | feito | `.gitignore` |
| 8 · os dois `[a verificar]` das notas, à vista da régua | feito | `scripts/check-ledger.mjs:399` |
| 9 · `requirements.lock.txt` e o fluxo a instalar dele | feito | motor: `requirements.lock.txt` (novo), `.github/workflows/portao.yml` |
| 10 · as quatro saídas do painel confirmadas e commitadas | feito | motor: `63d3a34` |
| 11 · o painel a falhar alto quando fica por commitar | feito | motor: `indicators/refresh.py` |

## 1 · O item 2, que não se fez, e porquê

A medida do plano diz «`.nvmrc` e `engines` a um maior», e o brief mandava apertar `engines` para `>=22.12.0 <23` **depois** de conferir qual o Node que a Vercel usa de facto. Conferiu-se, e não é 22.

O `--logs` do `vercel inspect` devolve as últimas 10 000 linhas de uma construção, e uma construção do sítio tem mais do que isso: a fase de instalação, que é onde a versão se anuncia, fica cortada. A versão foi lida no próprio registo da implantação:

```
vercel ls 2>&1
  # a produção mais recente: o-estado-do-pais-ewgpuyl7n-...vercel.app (Ready, Production)
vercel inspect https://o-estado-do-pais-ewgpuyl7n-nunos-projects-b945a519.vercel.app --format json
  # .builds[0].config.nodeVersion = "24.x"
vercel project inspect o-estado-do-pais
  # Node.js Version    24.x
```

A implantação que está no ar, com o `alias` de `oestadodopaís.pt`, foi construída em **Node 24.x**. O `.nvmrc` diz `22.23.1` e é essa a versão desta máquina (`node -v` a `v22.23.1`). Hoje não há contradição, porque `>=22.12.0` é satisfeito por 24; apertar para `<23` criava uma, e a construção da Vercel passaria a declarar-se fora do intervalo que o próprio repositório escreve.

**Fica para o diretor**, porque a definição é dele (regra da casa: «As definições do Vercel são do diretor»). São dois caminhos e não há um terceiro: ou a Vercel passa a 22.x e o `engines` aperta para `>=22.12.0 <23`, e então o `.nvmrc`, a máquina e o ar dizem a mesma coisa; ou fica em 24.x e o `.nvmrc` sobe com ela. O que não se deve deixar é o que existe hoje, que é desenvolver numa versão maior e publicar noutra sem que nada o diga.

## 2 · Os 16 documentos alojados (item 1)

### 2.1 O que a auditoria disse e o que se mediu

A auditoria (§4 e o anexo) escreve «nenhuma marca `robots` nem `lang` nos 16 documentos alojados». **Metade disso não é verdade**, e a diferença importa para o desenho:

```
for f in studies-src/*/pt.html studies-src/*/en.html; do grep -o -m1 '<html[^>]*>' "$f"; done
  # 8 com lang (pt-PT ×3, pt ×3, en ×2) · 8 sem lang nenhum
grep -l -i 'name="robots"' studies-src/*/*.html   # nenhum ficheiro (exit 1)
```

A marca `robots` estava mesmo ausente nos 16. O `lang` estava ausente em 8. Uma contagem por `grep '<html[^>]*lang='` dá 9 e engana: `studies-src/onde-esta-a-agua/pt.html` tem `<html>` sem língua na linha 1, que é a raiz, e um segundo `<html lang="pt-PT">` na linha 3. Contam-se elementos, não linhas.

### 2.2 A regra que se escolheu para o `lang`

**Acrescenta-se onde falta; nunca se reescreve o que o autor declarou.** Três documentos dizem `lang="pt"` onde a casa escreve `pt-PT`. As duas etiquetas dizem português, e trocar uma pela outra seria editar a obra alojada para a fazer caber na grafia da casa, que é a única coisa que a regra destas páginas proíbe. O portão exige a RAIZ da etiqueta igual à da edição (`pt` ou `en`), e deixa a forma completa ao autor.

Medido na construção:

```
grep -l '<html lang=' dist/estudos/*/documento/index.html dist/en/studies/*/document/index.html | wc -l   # 16
grep -l 'content="noindex, follow"' dist/estudos/*/documento/index.html dist/en/studies/*/document/index.html | wc -l   # 16
grep -l 'name="robots"' dist/estudos/*/documento/index.html | wc -l   # 10 (a medida do plano, que é só a edição pt)
grep -l 'Texto gerado por IA sob' dist/estudos/*/documento/index.html | wc -l   # 10
grep -l 'AI-generated text under' dist/en/studies/*/document/index.html | wc -l   # 6
```

Dez mais seis são os 16. As três medidas do plano cumprem-se.

### 2.3 Onde cada marca entra, e porque o corpo não se toca

`comMarcasDaCasa()` (`src/lib/documentos.mjs:603`) mexe em duas coisas, as duas ACIMA do `<body>`: o `lang` do `<html>`, onde falta, e a marca dos robôs logo a seguir ao `<head>`. O rótulo de IA entra na FAIXA (`:565`), que já era markup nosso. Abaixo da faixa não muda um byte, e a comparação carácter a carácter do ponto 4 do `verificaDocumento()` continua exacta, porque a faixa entra dos dois lados da igualdade.

O texto do rótulo não é retipado: sai de `textoDoRotulo(lang)` em `src/data/politica-ia.mjs`, que é a mesma cadeia aprovada que o rodapé das outras 7 218 páginas rende. Não traz um algarismo, e por isso não toca na regra que dispensa o corpo do documento do varrimento. O nome de quem responde leva `lang="pt-PT"` nas seis edições inglesas.

### 2.4 O portão, e as três plantas

`verificaDocumento()` ganhou os pontos 6, 7 e 8 (`scripts/gate-html.mjs:1131`). **Não bastava acrescentar as marcas no módulo**: o ponto 4 compara o construído com o que aquele módulo produz, e uma marca tirada de lá mudava os dois lados da igualdade e passava em silêncio. Os três pontos novos leem o ficheiro construído e exigem a marca por si.

As plantas correram com o módulo estragado e os 16 documentos de `dist/` regenerados pela mesma função do endpoint, para que a igualdade continuasse verdadeira e o único vermelho fosse o da regra nova:

| planta | `npm run gate:html` | o que disse |
|---|---|---|
| o `lang` não entra | **EXIT=1**, 8 documentos | «o documento não declara a língua: falta `lang` no `<html>`» |
| a marca dos robôs não entra | **EXIT=1**, 16 documentos | «o documento tem 0 marca(s) `<meta name="robots">`; tem de ter exactamente uma» |
| o rótulo de IA sai da faixa | **EXIT=1**, 16 documentos | «a faixa do observatório não traz o rótulo de IA» |
| tudo reposto | **EXIT=0** | |

A planta do `lang` dá 8 e não 16, e é o resultado certo: os outros 8 declaram a sua língua e a régua não tem nada a apontar-lhes.

### 2.5 O advogado

O rótulo é o recuo seguro do artigo 50.º, n.º 4 e n.º 5 do Regulamento (UE) 2024/1689 enquanto a pergunta 11 da `DILIGENCIA-LEGAL.md` não tiver resposta, e o `noindex` é o recuo seguro sobre a indexação. **O advogado pode dispensar as duas**, e nesse dia tiram-se com uma decisão registada: o rótulo sai de `faixa()` e o ponto 8 do portão sai com ele; a marca dos robôs sai de `comMarcasDaCasa()` e o ponto 7 com ela. Nada disto é irreversível e nada disto custa um byte do corpo dos documentos.

## 3 · O Astro (item 3)

`npm install --save-exact astro@7.2.10 @astrojs/sitemap@3.7.4`. O `npm outdated` dava `astro 7.2.1 → 7.2.10` e `@astrojs/sitemap 3.7.3 → 3.7.4`, que são as últimas de cada série. `npm audit` a 0 vulnerabilidades antes e depois.

**A construção não mudou nada.** Medido sobre duas construções completas do mesmo commit, uma antes e uma depois, sem mais nenhuma alteração pelo meio:

| | Astro 7.2.1 | Astro 7.2.10 |
|---|---|---|
| páginas (`find dist -name index.html \| wc -l`) | 7 233 | 7 233 |
| a lista das páginas | `diff` sem diferença | |
| `dist/cadeia.json` (sha256) | `9c47cd36…33052f` | `9c47cd36…33052f`, igual |
| `dist/prova.json` | difere numa linha só: `construido_em` | |

`js-yaml` (5.2.3 → 5.4.1), `node-html-parser` (9.0.1 → 9.0.2) e `playwright` (1.60.0 → 1.62.1) continuam por atualizar: são dependências de desenvolvimento, estão fora do que este bloco pede, e a medida de aceitação («`npm outdated` sem o Astro») cumpre-se sem lhes tocar.

## 4 · O JSON-LD (item 4)

`Base.astro` serializava com `JSON.stringify` nu, nos dois blocos, sobre 7 866 blocos construídos. Passa por `jsonLd()` (`src/lib/jsonld.mjs`, novo).

**O conserto é dentro do JSON e não em HTML.** O conteúdo de um `<script>` não é HTML: o analisador não lhe decodifica entidades, e a única coisa que procura é a cadeia que fecha o elemento. Escapar `<` como `&lt;` seria o erro simétrico e pior, porque o JSON passaria a conter os cinco caracteres da entidade. Usa-se `<`, que é escape do JSON: o objecto lido é o mesmo, byte a byte, e o analisador de HTML nunca vê um `<`. Escapam-se `<`, `>` e `&`.

O conhecido-positivo, com um título de estudo que traz `</script>`:

```
node -e "import('./src/lib/jsonld.mjs').then(({jsonLd}) => { ... })"
  saida: {"name":"Estudo </script><img src=x onerror=alert(1)> fim", ...}
  tem < literal: false · tem > literal: false · tem & literal: false
  desserializa igual: true
```

## 5 · Os identificadores mortos (item 5)

### 5.1 Eram dezoito, e não doze

A auditoria contou 12. A varredura deste bloco encontrou **18**: os 12 da auditoria (2 em `gate-html.mjs`, 3 em `check-lingua.mjs`, 7 em vistas) e mais 6 importações de componente em ficheiros `.astro` que a contagem da auditoria não olhava (`Claim` em `Cabeca.astro`, `LivroConcelhoView` e `LivroConcelhosView`; `CampoDaLinha` nas duas últimas; `Provenance` em `LivroView`). Saíram os 18.

O brief dizia «os três `provenienciaIncompleta`/`POR_VERIFICAR` nas vistas do livro-razão». **São cinco**: `provenienciaIncompleta` em `LivroConcelhoView.astro` e `LivroConcelhosView.astro`, `POR_VERIFICAR` em `LivroView.astro`, `MarcadorView.astro` e `MunicipioView.astro`. Duas delas eram linhas compostas em que só uma das ligações estava morta (`allClaims` e `provenienciaIncompleta` continuam vivos em `LivroView`; `getClaim` e `parsePtNumber` em `MunicipioView`), e por isso tirou-se a ligação e não a linha.

### 5.2 Nenhuma conferência se perdeu, e como se soube

O brief mandava conferir, com `git log -p`, se alguma delas fazia uma conferência que tivesse parado em silêncio. Leram-se as cinco histórias. **Nenhuma se perdeu**, e as três razões não são a mesma:

- **`provenienciaIncompleta` nas duas vistas de concelho**: o uso saiu no commit `f4fb603e` (29.08.2026), que extraiu a linha-espécime, escrita duas vezes, para `src/components/ItemDoLivro.astro`. O atributo `data-estado={provenienciaIncompleta(c) ? 'por-confirmar' : 'completa'}` está lá hoje (`ItemDoLivro.astro:97`) e as duas vistas continuam a rendê-lo. O próprio commit diz que o corpo construído é idêntico byte a byte antes e depois.
- **`POR_VERIFICAR` em `LivroView` e `MarcadorView`**: o uso saiu no commit `46608f42` (25.08.2026), que trocou `<span class="marcador">{POR_VERIFICAR}</span>` por `<Marcador lang={lang} />`. O componente rende a mesma constante (`Marcador.astro:52`) e ganhou-lhe uma porta. A importação ficou por limpar no mesmo commit.
- **`POR_VERIFICAR` em `MunicipioView`**: este é o único que **não mudou de sítio, foi retirado**. O commit `34941981` (21.08.2026) tirou a peça vazia que punha o marcador no lugar do número, pela Emenda 15, e o componente que a substituiu (`Peca.astro`) nunca carregou marcador nenhum: rende «sem linha ainda», sem valor, sem selo e sem marcador, e as duas razões estão escritas em `Peca.astro:57-71` e em `MunicipioView.astro:163-165`. Não é uma perda porque as duas ausências são diferentes: o marcador diz que uma linha EXISTE e declarou um campo por verificar, e uma medida que não existe não tem linha nem campo. O marcador continua a render-se nas páginas de concelho para proveniência mesmo incompleta, por `Provenance.astro:167`, e o portão compara-o carácter a carácter em `gate-html.mjs:2807`.

Fica dito porque a apagar sem o dizer seria enterrar o terceiro caso.

### 5.3 A varredura, e o que ela deliberadamente não faz

`scripts/check-mortos.mjs`, dentro do `npm run verify`. Lê 173 ficheiros (`src/**` em `.mjs` e `.astro`, `scripts/**` em `.mjs`), tira de cada um as ligações de importação nas quatro formas e as constantes de topo não exportadas, e fecha a construção quando um nome não reaparece.

**A contagem é sobre o texto cru, e isso é uma precaução e não uma preguiça.** A primeira forma tinha um segundo escalão, de aviso, para o nome que só reaparecia dentro de um comentário, e para o separar era preciso tirar os comentários. Tirá-los sem um analisador a sério engana-se em duas coisas correntes: uma URL num literal (`https://${X}`, em que o `//` come o resto da linha) e um `/*` dentro de uma cadeia. Medido sobre estes 173 ficheiros, o escalão apontou oito nomes e **os oito eram falsos** (`SITE_HOST_DISPLAY` está vivo em `src/lib/conjunto.mjs:142`, `WORKS` em `scripts/check-registo.mjs:300`, e assim os outros seis). Um aviso que se engana oito vezes em oito ensina a não o ler, que é como um portão morre. Saiu, e a régua ficou com uma severidade só.

O conhecido-positivo corre sempre, com `--prova`, e planta a importação morta num ficheiro temporário FORA da árvore do sítio: a primeira forma escrevia-a em `src/lib/jsonld.mjs` e repunha-o num `finally`, o que deixava uma janela em que um ficheiro do repositório tinha código que ninguém escreveu.

```
node scripts/check-mortos.mjs --prova
  prova ✓ a importação plantada foi vista, fora da árvore do sítio.
  ✓ identificadores · 173 ficheiro(s) lidos, nenhuma importação nem constante de topo morta
```

## 6 · A `allowlist`, e a regra que a lê ao contrário (item 6)

### 6.1 O que saiu e o que se reescreveu

- **`data-de-edicao` saiu.** É a órfã da auditoria, e a sua razão era ao mesmo tempo a falsa: dizia «Data da edição no cabeçalho e no rodapé» e a cadeia não existe em lado nenhum do repositório (`grep -rn 'data-de-edicao'` devolve uma linha só, a da própria declaração). Era a órfã e a razão envelhecida, e as duas coisas resolvem-se tirando-a.
- **`licenca-do-conjunto` reescrita.** Dizia «quando a direcção a tiver decidido» e «enquanto `LICENCA` for `null` este motivo não é usado por nenhuma página». As duas metades deixaram de ser verdade: `LICENCA` tem valor (`src/data/licenca.mjs:62`, `CC BY 4.0`) e o motivo rende-se em `src/views/LivroView.astro:304`. A razão nova diz o que é hoje e cita o que dizia.
- **`CAOP` saiu da lista de tokens.** Não tem um algarismo, e o varrimento só pergunta pela lista quando o token TRAZ algarismos (`gate-html.mjs`, `tokensProibidos`): a entrada nunca era consultada. Não era uma excepção, era uma nota. O que ela esclarecia passou para o motivo `fonte-da-carta`, que é onde a sigla aparece com a edição atrás («CAOP 2025»).

### 6.2 A regra nova, e a terceira órfã que ela apanhou sozinha

Contadores de uso em `gate-html.mjs:218`, incrementados nos três sítios onde a lista é de facto consultada, e a recusa no relatório (`:6778`). **Fecha a construção**, ao contrário das duas varreduras vizinhas que avisam: uma entrada de ortografia a mais não dispensa nada, e uma excepção a mais é uma porta aberta no portão dos algarismos.

Na primeira corrida a regra pôs a construção vermelha num sítio que ninguém tinha previsto:

```
npm run build   # parou em gate:html
  O PORTÃO DE HTML FECHOU — 1 erro(s):
  ledger/allowlist.yml
    ✗ o token "PT2030 (scope: any)" está declarado e não dispensa nada: nenhuma página de dist/ o traz.
```

Conferido antes de lhe tocar: «PT2030» existe em quatro páginas construídas e as quatro são de classes que já saem do varrimento por outra via (três documentos alojados e uma página de leitura, comparada carácter a carácter contra o registo de conteúdo). As duas linhas do livro-razão que a trazem no id escrevem-no em minúsculas, que não é a mesma cadeia, e as suas páginas de linha têm zero ocorrências de «PT2030» maiúsculo. A entrada dispensava zero. Saiu, com a razão escrita no cabeçalho dos tokens.

**São três órfãs e a auditoria tinha visto uma.** Depois delas:

```
npm run gate:html   # EXIT=0
  allowlist · 14 motivo(s) e 5 token(s), com os usos que os provam vivos:
  data-de-publicacao 56 · data-de-atualizacao 7250 · data-da-conferencia 7226 · referencia-legal 18 ·
  titulo-de-estudo 5956 · escala-de-instrumento 880 · limiar-do-quadro 62 · data-de-referencia 9524 ·
  numeracao 40 · proveniencia 26416 · data-da-agenda 146 · identificador-tecnico 1920 ·
  fonte-da-carta 60 · licenca-do-conjunto 2 · UE-27 48 · EU-27 48 · 73/2013 614 · sha256 24 · 52.º 614
```

A planta deliberada, com um motivo `planta-orfa-f07` acrescentado à lista e nenhuma página a rendê-lo: `npm run gate:html` **EXIT=1**, «o motivo "planta-orfa-f07" está declarado e não dispensa nada». Reposta a lista, **EXIT=0**.

A régua vive em `gate-html.mjs` e não em `check-ledger.mjs`, e não é uma escolha de gosto: o `check-ledger` corre ANTES do `astro build` (é a primeira coisa do `build`), quando `dist/` ainda não existe, e por isso não pode saber quantas vezes uma excepção foi usada. Quem lê a lista e quem faz a correspondência é o portão de HTML.

### 6.3 O `ledger/README.md:747`

Dizia «Hoje são as 70 linhas de Évora». Medido:

```
node -e "…união das chaves de rows em ledger/cruzamentos/*.json…"
  concelhos.json 2458 · dominios.json 314 · evora.json 70 · regioes.json 8
  soma 2850 · união distinta 2850 · ficheiros de linha 2916 · cruzadas sem ficheiro de linha 0 · 97,74 %
```

São **2 850 linhas cruzadas a 03.09.2026**, de quatro ficheiros de travessia, e a soma dos quatro é igual à união deles: nenhuma linha atravessa duas vezes. Escrito na forma datada da casa, com o que dizia citado. A linha 761 dizia «hoje `cruzamentos/evora.json`» e são seis ficheiros: os quatro com linhas e dois que atravessam ficheiros e não linhas (`agenda.json`, `paridade.json`), corrigida também.

## 7 · O `.gitignore` (item 7)

Era `.claude/worktrees/` e passa a `.claude/` inteiro. Nenhum ficheiro `.claude` estava seguido pelo git quando a linha mudou (`git ls-files '.claude*'` a zero de saída), portanto isto não desliga o seguimento de coisa nenhuma: fecha a porta antes de alguém lá pôr as definições locais da sessão ou os caminhos da máquina do diretor num repositório público.

## 8 · Os dois `[a verificar]` das notas (item 8)

`check-ledger.mjs:399` conta e imprime, e **nunca fecha a construção**:

```
npm run ledger:check   # EXIT=0
  3 marcador(es) por resolver em notas não publicadas:
  disparidade-salarial-entre-sexos-2024, retribuicao-minima-mensal-garantida-continente-2026 (2)
```

São três marcadores em duas linhas (a da retribuição mínima tem dois). Ficavam invisíveis por duas peneiras ao mesmo tempo: `note` está em `CAMPOS_NAO_PUBLICADOS` e não vai à página, e `camposPorVerificar()` compara oito campos publicados por igualdade INTEIRA, o que nunca apanharia um marcador embebido em prosa. Nenhuma outra das 2 916 linhas esconde um marcador assim.

**Porque não sobem a campo visível.** As duas perguntas por resolver são sobre a LICENÇA dos termos do Diário da República e sobre o PRODUTOR de uma estimativa do Eurostat, e não sobre o valor: os dois números estão lidos na fonte, com excerto e data de acesso, e a página que os rende não fica menos verdadeira por a licença do diploma não ter sido procurada. Promovê-las a um campo publicado mudava o estado do selo e tirava as duas linhas do índice dos motores de busca, que é uma consequência desproporcionada à dúvida. O que faltava era o lugar de direção VER que existem, e é isso que a linha faz. O brief pedia exactamente esta indexação inalterada.

## 9 · O motor

### 9.1 `requirements.lock.txt` (item 9)

Escrito num ambiente limpo, e não nesta máquina, que tem 158 pacotes globais que ninguém declarou:

```
python3 -m venv <tmp> && <tmp>/bin/python -m pip install --upgrade pip
<tmp>/bin/python -m pip install -r requirements.txt
<tmp>/bin/python -m pip freeze          # 40 pacotes
```

São 40 pinos: os nove declarados e as 31 dependências que eles arrastam. Conferido a reinstalar de raiz num SEGUNDO ambiente a partir do lock: o `pip freeze` desse ambiente é igual, linha a linha, às 40 do ficheiro (`diff` sem diferença). O `requirements.txt` fica como está, porque é onde a razão de cada dependência está escrita, e os dois ficheiros dizem coisas diferentes.

`.github/workflows/portao.yml` passa a instalar do lock e a guardar a cache por ele. O ficheiro foi gerado em Python 3.14.0 e macOS arm64; a matriz corre 3.12 e 3.14 em `ubuntu-24.04`, e é a corrida do GitHub que prova que os pinos resolvem nas duas.

### 9.2 As quatro saídas do painel, confirmadas (item 10)

O `git status` da árvore principal dava três modificados e um por seguir. Confirmados contra `indicators/refresh.log` ANTES de commitar:

- **`canary_baseline.json`**: mudam 8 linhas e as 8 são o carimbo `updated` de uma série. **Nenhuma linha `value` muda**, e é isso que prova os 0 alarmes por estrutura e não pela palavra do log (`git diff -U0 … | grep -c '"value"'` a 0). As 8 séries são exactamente as 8 que o log de 24.08 nomeia como `notice`; quatro delas voltam no log de 31.08 e o seu carimbo avança duas vezes (08-17/18 → 08-20 → 08-28), as outras quatro só o de 24.08 tocou e ficam em 08-22. A cadeia reconcilia linha a linha com o estado commitado em `3e08bb3` (18.08).
- **`heartbeat.json`**: `last_run` de 2026-08-18T13:36:58 para 2026-08-31T08:30:12, o carimbo que o log de 31.08 diz ter escrito; 32 linhas, 0 alarmes, 4 avisos, os mesmos números.
- **`refresh_report.json`**: guarda só a última corrida, e traz os 4 avisos de 31.08, um a um iguais aos do log.
- **`vintages.json`**: 32 chaves com história e 36 entradas, que é o 32 + 4 que as duas corridas somam. **Nenhuma linha tem mais do que um valor distinto**: em 36 entradas nenhum valor mudou.

Copiados byte a byte, com o sha256 conferido dos dois lados:

```
5f3d447b558f156b3f7570f925183d2523d7fe61fb01a6ea5c4e38a69d82a73a  canary_baseline.json
54e9b4dbf1dda5814f4e455c9bd333d84447258527b08efc6e242b0bd43a9f91  heartbeat.json
16e7079a5338faaa60bca444741ed26965502895d4efafde65c053a902a13193  refresh_report.json
5c769591f8a733634bfcf456c62101318b714dbcf52c0f0697ffead127211dc1  vintages.json
```

`indicators/vintages.json` não estava a ser ignorado por nada (`git check-ignore -v` sai a 1), portanto bastou adicioná-lo; não houve nada a mudar no `.gitignore` do motor.

**Ficaram de fora, e não são deste bloco**: `sweeps/state.json`, `sweeps/sweep-2026-09-01.md`, `.maintenance-locks/` e `publisher/recortes/manifest.regioes.json`. Não se leram nem se tocaram.

### 9.3 A guarda das saídas por commitar (item 11)

`--check-heartbeat` passa a conferir também se as quatro saídas estão no registo, e sai a 1 quando alguma diverge dele há sete dias ou mais. Sai pelo mesmo interruptor que o `launchd` já chama, de propósito.

**A medida não é o `mtime`, e a razão é o próprio agente.** Sete dias é a cadência do `launchd`: cada corrida reescreve as quatro saídas e punha o relógio a zero, portanto a guarda nunca chegaria a disparar por muito tempo que a divergência durasse. Mede-se a data do último commit que tocou o ficheiro, que reescrevê-lo não muda. Um ficheiro nunca commitado não espera prazo nenhum.

O conhecido-positivo (`--prova-por-commitar`), num repositório temporário, em cinco casos:

```
python3 -m indicators.refresh --prova-por-commitar   # EXIT=0
  prova ok: vê o sujo de oito dias (mesmo reescrito hoje) e o nunca commitado;
  cala-se no commitado e no sujo de hoje.
```

E contra a árvore a sério, antes e depois do commit das saídas:

```
# ANTES
python3 -m indicators.refresh --check-por-commitar   # EXIT=1
  ALARM: 4 saída(s) da corrida fora do registo há 7 dias ou mais:
    canary_baseline.json: diferente do registo há 15 dia(s)
    heartbeat.json: diferente do registo há 15 dia(s)
    refresh_report.json: diferente do registo há 15 dia(s)
    vintages.json: nunca foi commitado
# DEPOIS
python3 -m indicators.refresh --check-por-commitar   # EXIT=0
```

**A linha para o `launchd`, que não se editou** (é a máquina do diretor). O plist já chama `--check-heartbeat`, e a guarda entra por aí sem uma linha nova: não é preciso mexer-lhe. Se o diretor a quiser separada, para a distinguir no log, a linha a acrescentar ao `ProgramArguments` de `~/Library/LaunchAgents/com.nunosantos.oedp-indicadores.plist`, a seguir ao `--check-heartbeat`, é:

```
; echo "== por commitar =="; python3 refresh.py --check-por-commitar
```

## 10 · Os portões e as corridas

| | comando | saída |
|---|---|---|
| sítio | `npm run build` | **0** |
| sítio | `npm run verify` | **0** (`VERIFY_EXIT=0`, com o `check:mortos` lá dentro) |
| sítio | `npm run typecheck` | **0** (`TYPECHECK_EXIT=0`) |
| motor | `python3 -m core.gate` | **0** (`GATE: PASS`), três vezes: uma solta e uma por cada um dos dois commits, pelo `pre-commit` |

As construções deste bloco, por ordem: uma de base em Astro 7.2.1, uma em 7.2.10 para isolar o efeito da atualização, e uma com todo o trabalho do bloco. A terceira parou vermelha à primeira, em `gate:html`, na órfã `PT2030` que a regra nova apanhou (§6.2), e ficou a 0 depois de a tirar.

**Uma nota de método, porque custou tempo e podia ter custado uma conclusão errada.** O padrão `npm run build > log 2>&1; echo "EXIT=$?"` num comando de fundo devolve o código do `echo` e não o do `npm`, e por isso a primeira construção do bloco foi anunciada como verde quando tinha fechado vermelha. O que a apanhou foi ler o fim do registo em vez de acreditar no anúncio. Os códigos desta tabela foram todos lidos do próprio registo.

## 11 · O que fica para quem revê

- **O item 2 é do diretor** (§1): a Vercel constrói em Node 24.x, o `.nvmrc` diz 22.23.1, e apertar `engines` sem ele decidir criava a contradição em vez de a fechar.
- **Um achado adjacente, fora deste bloco**: `src/components/Frase.astro:57` escreve os parênteses rectos do marcador à mão (`[{parte.marcador}]`) em vez de importar `POR_VERIFICAR`, o que está em tensão com a regra escrita em `src/data/marcador.mjs:18` («NUNCA se escreve o texto do marcador à mão num gabarito. Importa-se.»). Funciona hoje e é o que rende o único marcador vivo da página de Évora, mas é um segundo caminho para o texto do marcador que a constante não governa. Não se tocou: não é deste bloco.
- **A auditoria errou em dois números** que este bloco mediu: o `lang` faltava em 8 dos 16 documentos e não nos 16; os identificadores mortos eram 18 e não 12. As duas correcções estão nas §2.1 e §5.1.
