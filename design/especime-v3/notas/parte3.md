# Nota da parte 3 · as páginas de leitura, dos registos de conteúdo do motor

*Ficheiro de notas do bloco. Cada etapa acrescenta a sua secção; esta abre com a
P1. **Todos os números desta nota vêm de um comando que está escrito ao lado
deles.** Sem travessões na prosa; os nomes de ficheiro dentro de crases levam os
caracteres que têm.*

---

## P1 · a travessia dos registos de conteúdo

*Construtor: Claude Opus 5 (`claude-opus-5[1m]`). Sítio: ramo
`parte3-2026-08-24`, a partir de `8d724f2`. Motor: `master`, a partir de
`cbaf7ca`. Brief: `../briefs/BRIEF-parte3-P1.md`, com a §1 da
`../ESTIMATIVA-PARTE3-2026-08-24.md` como contrato e as onze decisões de
`../ESTADO-DO-MAIN-2026-08-24.md` fechadas.*

### Os commits

| repositório | commit | o quê |
|---|---|---|
| motor | `d64a4d2` | `publisher/export_records_site.py`, os oito conhecidos-positivos, o registo em `core/gate.py` e a secção nova do `publisher/REGISTOS.md` |
| sítio | `15063b2` | `registos/`: os oito registos, os oito ficheiros de operações, o `manifest.json` e o `README.md` |
| sítio | `4e8981b` | as seis conferências D1 a D6 e o modo `--with-origin` no `scripts/check-documentos.mjs` |
| sítio | `23385a1` | `src/lib/registos.mjs`, o leitor, para a P2 usar |
| sítio | (este) | o registo: `DECISIONS.md` §1.64, o `README.md`, esta nota e a `ISSUES.md` |

### O que atravessou, medido

`python3 publisher/export_records_site.py` (ensaio, motor `d64a4d2`):

| edição do motor | slug do sítio · língua | blocos | refs | `prova` | D5 |
|---|---|---:|---:|---|---|
| 03 pt | `avaliacao-economica-regional-de-portugal-2026/pt` | 55 | 411 | `edicao-html` | não corre |
| 04 en | `evora-prometido-pago-auditado-2026/en` | 102 | 326 | `render-sem-graficos` | corre e bate |
| 04 pt | `evora-prometido-pago-auditado-2026/pt` | 102 | 326 | `render-sem-graficos` | corre e bate |
| 06 pt | `evora-economia-investidores-portas-abertas-2026/pt` | 53 | 171 | `edicao-html` | corre e bate |
| 07 en | `evora-orcamentado-pago-devido-2025/en` | 91 | 194 | `edicao-html` | corre e bate |
| 07 pt | `evora-orcamentado-pago-devido-2025/pt` | 92 | 194 | `edicao-html` | corre e bate |
| 08 pt | `evora-quinze-anos-cinco-mandatos/pt` | 179 | 682 | `edicao-html` | corre e bate |
| 09 pt | `evora-os-pelouros-quem-os-teve-o-que-fizeram/pt` | 155 | 297 | `edicao-html` | corre e bate |
| **total** | | **829** | **2 601** | | **corre em 7, não corre em 1** |

As quatro edições do motor sem edição alojada (03 en, 06 en, 08 en, 09 en) não
atravessam, e a corrida nomeia cada uma em voz alta.

**O D5 corre em sete e não em seis.** O brief escreveu «seis edições com
`origin: researchhub`» no texto da §2 e listou **sete** na tabela da mesma
secção. Medido a 24.08 contra o `studies-src/manifest.yml`: sete linhas com
`origin: researchhub` (04 pt, 04 en, 06 pt, 07 pt, 07 en, 08 pt, 09 pt) e uma com
`artifact_url` (03 pt). O `edicao_html_sha256` bate com o `sha256_normalized` nas
sete. A tabela do brief estava certa e o número na prosa era um lapso de
contagem; nada disto contradiz a decisão 7 do diretor, que é o 06 republicado e o
03 a ficar.

`find registos -type f | wc -l` → **17** (dezasseis ficheiros de dados mais o
registo de travessia); `du -sh registos` → **1,5 MB**; mais o `README.md`.

### As seis plantas

Cada uma fechou `node scripts/check-documentos.mjs` com **exit 1**, e foi
revertida do git a seguir, com o portão a voltar a exit 0 e o
`git status --porcelain` limpo antes da planta seguinte.

| planta | o que se mudou | resumo do ficheiro antes | a frase do portão | exit |
|---|---|---|---|---|
| **D1** | um carácter do primeiro `"text"` de `registos/evora-quinze-anos-cinco-mandatos/pt.record.json` | `457ff2c2…64a5` | `D1 registos["evora-quinze-anos-cinco-mandatos/pt"]: os bytes de registos/evora-quinze-anos-cinco-mandatos/pt.record.json não são os que atravessaram.` | 1 |
| **D2** | uma pasta com um slug enganado, `registos/um-slug-enganado/pt.record.json` | (não existia) | `D2: existe registos/um-slug-enganado/pt.record.json e o registo de travessia não o nomeia. Um registo de conteúdo sem entrada no manifesto não tem proveniência: ou ficou de uma edição retirada, ou o slug está enganado.` | 1 |
| **D3** | `registos/evora-orcamentado-pago-devido-2025/pt.cortes.json` apagado | `cee6549b…a628` | `D3 registos["evora-orcamentado-pago-devido-2025/pt"]: falta registos/evora-orcamentado-pago-devido-2025/pt.cortes.json, que são as operações da passagem de voz que fizeram este registo. Volte a atravessar.` | 1 |
| **D4** | o `registos/manifest.json` passa a declarar `evora-quinze-anos-cinco-mandatos/en`, com os dois ficheiros ao lado, e o arquivo do sítio não tem essa edição | `040b3adb…4c11` | `D4 registos["evora-quinze-anos-cinco-mandatos/en"]: o trabalho "evora-quinze-anos-cinco-mandatos" não tem edição "en" no arquivo. Um registo de uma edição que o arquivo não tem não se serve.` | 1 |
| **D5** | o `edicao_html_sha256` do 08 pt no `registos/manifest.json`, de `ceab4d26…` para `0eab4d26…` | `040b3adb…4c11` | `D5 registos["evora-quinze-anos-cinco-mandatos/pt"]: o registo e os bytes alojados são de versões diferentes do documento.` (com os dois resumos e o remédio por baixo) | 1 |
| **D6** | as `referencias` do 04 pt no `registos/manifest.json`, de 326 para 325 | `040b3adb…4c11` | `D6 registos["evora-prometido-pago-auditado-2026/pt"]: o manifesto promete 325 referência(s) e o registo tem 326.` | 1 |

A planta do D4 fechou **dois** erros e não um: com a entrada nova o
`studies-src/manifest.yml` também não tem linha nenhuma para
`evora-quinze-anos-cinco-mandatos/en`, e por isso o segundo ramo do D5 fechou
com ela: `D5 registos["evora-quinze-anos-cinco-mandatos/en"]: não há linha
nenhuma para "evora-quinze-anos-cinco-mandatos/en" em studies-src/manifest.yml.`
É o ramo do D5 que a planta própria do D5 não exercita, e ficou exercitado por
esta.

**A primeira forma da planta do D4 não serviu, e a razão fica escrita.** Retirar
a edição inglesa do 04 de `src/data/studies.mjs` fecha a construção com exit 1,
mas por outra boca: `src/lib/documentos.mjs` **atira** ao encontrar
`studies-src/evora-prometido-pago-auditado-2026/en.html` sem edição declarada, e
esse `throw` acontece na linha 207 do portão, antes de o bloco dos registos
correr. O portão morre com um rasto de pilha em vez de imprimir a sua lista de
erros. É comportamento anterior a esta etapa e o resultado é o certo (a
construção pára, com a frase certa), mas fica registado como `I64` porque
qualquer pessoa que plante o mesmo estrago vai bater no mesmo sítio. A planta do
D4 mudou para onde o D4 a pode ver, que é o próprio registo de travessia, e é
também a forma mais fiel do estrago que o brief descreve: «um registo de uma
edição que o arquivo não tem».

### Os oito conhecidos-positivos do lado do motor

`python3 -m publisher.export_records_site_test --vermelhos` → **PASS, 8 checks**.
Cada um é plantado numa cópia temporária (o motor copiado e feito repositório
git próprio, o sítio sintetizado dos manifestos do motor); `content/` nunca é
escrito e o sítio real nunca é lido nem escrito.

1. manifesto do motor com `estado: rascunho` → recusa;
2. um byte mudado num registo em disco → recusa;
3. `.cortes.json` em falta → recusa;
4. um slug que o `studies.mjs` da cópia não tem → recusa;
5. idempotência: duas escritas seguidas dão 17 ficheiros iguais e o
   `exported_at` não mexe;
6. uma origem que mudou mesmo (registo novo, manifesto do motor a declará-lo)
   reescreve **só** o `pt.record.json` do 06 e o `manifest.json`, com data nova
   nessa entrada e nas outras sete a data antiga;
7. um ficheiro órfão no destino → recusa, nomeia-o, e **não o apaga**;
8. a cópia limpa passa, com o D5 dito edição a edição.

### As corridas verdes

```
motor   python3 -m core.gate                              PASS (74 s), com o export_records_site_test na lista
motor   python3 publisher/export_records_site.py --write  duas vezes, manifest.json byte a byte igual
sítio   npm run build                                     exit 0 · 334 páginas · 33 chaves da prova · 16 documentos
sítio   npm run typecheck                                 exit 0
sítio   node scripts/check-documentos.mjs                 exit 0 · 8 atravessados · D5 correu em 7 e não corre em 1
sítio   node scripts/check-documentos.mjs --with-origin   exit 0 · 8 registos conferidos contra o motor
sítio   RESEARCHHUB_DIR=/tmp/nao-existe … --with-origin   exit 0 · «NÃO CORREU, o motor não está em …»
```

As 334 páginas e as 33 chaves são as mesmas da construção de base: a P1 não
acrescenta página nenhuma, e não devia.

### O que fica por fazer, e é da P2 em diante

* **Nenhum consumidor.** O `src/lib/registos.mjs` não é importado por nenhuma
  página. Quem o vai usar é o renderizador da P2.
* **Nenhuma rota `texto`/`text`,** nenhuma porta «Ler no sítio», nenhum
  `data-registo`, nenhum recibo do motor: tudo isso é P2 e P3.
* **A régua do inventário de frases não aprendeu a origem `data-registo`.** Está
  na nota da estimativa e continua por fazer; se contar os blocos de prosa
  transcrita como frases da casa, a contagem de autorreferência salta.
* **As 46 ligações do corpo atravessaram dentro dos registos** (7 por edição do
  03, 16 por edição do 04), e nada do lado do sítio as rende ainda.
