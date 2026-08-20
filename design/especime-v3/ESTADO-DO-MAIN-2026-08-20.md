# O estado de `main` ao fim de 20.08.2026, para a sessão do redesenho v3

*Escrito pelo lugar de direção (Claude Fable 5) ao fechar o dia, para que a
sessão que vai planear o redesenho leia factos verificados nesse dia e não
reconstrua o estado do sítio a partir do handoff, que foi escrito para um `main`
que já não existe. Tudo o que está aqui foi lido no repositório ou no sítio no ar
a 20.08.2026; onde diz «[a verificar]», não foi. Sem travessões.*

## 1. Onde está `main`

- `main` = `origin/main` = no ar = **`9b9f477`** (`verify:deploy` ✓ às 14:07 UTC). Os
  blocos do dia: `ad86efc` (decisões de 20.08, §1.48) e `510dda0` (republicação,
  §1.49), ambos fundidos pela palavra da direção por delegação, cada um depois
  de uma leitura cruzada do Codex com estragos plantados (sete de sete, cinco de
  cinco) e de uma pré-visualização protegida.
- Ramos fundidos e apagáveis: `confianca`, `decisoes-2026-08-20`,
  `republicacao-2026-08-20`, `identidade-v2`, `voz`, `municipio-evora`,
  `agenda-decisoes`, `selo-cabecalho`, `defeitos-medicao`, `design-bundle`,
  `design-explorations`, `arquivo-documentos-2026-08-12`.
- A constituição em vigor é a `IDENTIDADE.md` **v2** (direção S, §1.43), com o
  §12 «Os limites» reescrito a 20.08 para o estado do ar. O handoff e a
  Constituição visual v3.1 (cofre, com as Emendas de 20.08) **substituem-na**
  onde discordam; a sessão do plano diz em que pontos, um a um.

## 2. O que mudou desde que o handoff foi escrito (18 a 20.08)

O handoff foi escrito pela sessão de design em paralelo ao bloco T e antes dos
dois blocos de 20.08. O que ele não sabe:

1. **A página da linha é agora o recibo com dados a sério** (§1.47): recorte da
   linha impressa em 22 linhas de PDF, `verifications[]` em 53 linhas (as duas
   últimas rendidas), ficheiros alojados da CAOP com licença e atribuição,
   `document.computed_over` nas cinco somas do PRR, a página humana da série em
   42 linhas de API. E, de 20.08: a porta **«Esta linha em JSON»** em todas as
   264 páginas de linha (§1.48) e, nas cinco linhas do PRR, uma porta por
   ficheiro **«cópia arquivada pelo Internet Archive»** dentro de «Calculado
   sobre», rendida só quando o resumo bate certo (§1.49). A maqueta «Linha»
   (página «Páginas» do canvas) não tem nenhuma destas portas.
2. **O índice do livro-razão oferece o conjunto de dados**: CSV e JSON sob
   CC BY 4.0, com a frase de âmbito («a licença cobre o conjunto… os excertos
   transcritos continuam sob os termos de quem os publicou»). A maqueta do
   livro-razão não o tem.
3. **O Método mudou três frases** (§1.48): a primeira frase da regra 6 («Os
   números publicados são relidos na fonte…, linha a linha, e cada linha diz se
   já o foi…»); a regra 1 ganhou um limite com a conta `divida` ao lado; a regra
   10 diz «Não publica um número sem linha no livro-razão; onde a fonte ainda
   está por confirmar, a própria linha o diz com o marcador». A maqueta
   «Método» foi construída com o texto de 18.08. O handoff prevê ainda **uma**
   mudança do Método (o amarelo passa de medição a aviso, o oxblood sai): é
   texto governado, e segue o caminho da §1.38 (entrada com `Afecta: metodo`,
   resumo, leitura da direção na pré-visualização).
4. **A contagem «organismos citados» é 13**, não 14 (o marcador contava como
   organismo; corrigido nas duas cópias).
5. **O PRR está no instantâneo de 2026-08-19**, com cadência mensal decidida; os
   documentos do 04, 07 e 08 foram republicados e a sua prosa diz «a cada dia».
6. **O motor tem cliente em série do INE** (tranca por máquina, 2 s, recuo) e o
   INE respondeu de manhã e recusou à tarde; a vintage por linha existe no
   motor e não na página (é pergunta de formato, aberta).

## 3. O que o portão confere hoje (para o plano não abrir portões)

`npm run build` corre, por esta ordem: `ledger:check` (formato das 132 linhas;
amarra das decisões: toda a entrada a partir da §1.38 declara `Afecta:` e a
última que governa um texto traz o seu resumo; citações da constituição a um
texto governado conferidas palavra por palavra; `archived.url` só em
`web.archive.org`), `check:cruzamento` (as 70 linhas cruzadas e os ficheiros
vindos do motor, byte a byte; `--with-origin` compara com o motor),
`check:documentos` (os bytes de `studies-src/` contra `manifest.yml`),
`astro build`, `stamp:version`, `gate:html` (todo o algarismo das páginas com
proveniência; `data-claim` comparado como **cadeia**; selo em todo o valor e a
apontar para a sua linha; `data-prova` a bater com a contagem do próprio portão,
28 chaves relidas de `dist/prova.json`; portas internas resolvidas; ortografia
AO90 e nenhum travessão no texto rendido; nenhum `data-exemplo`; as portas da
cópia arquivada contra o campo), `check:dados` (os ficheiros de `/dados/` e do
conjunto recontados; a comutação da licença). Fora do build: `typecheck`,
`node scripts/ortografia.mjs --verificar`, `verify:deploy` (lançamento),
`scripts/medir-defeitos.mjs` (a régua dos defeitos: 307 páginas, porta de
correções 307/307, frases de moldura 77 distintas · 2 367, marcadores 358,
«[a verificar]» 458, 23 linhas com `#page=`, 22 com recorte) e
`scripts/medir-contraste.mjs` (a régua do contraste, todos os pares de texto AA
em claro e escuro). **Regra do roteiro:** nenhum portão novo; estende-se o que
existe e prova-se cada extensão num estrago plantado.

`src/i18n/strings.mjs` tem as cadeias das duas edições e `assertKeyParity()`
falha o build se as chaves não forem as mesmas: **todo o texto novo do v3 entra
nas duas línguas ou não entra** (ponto 9 do handoff). O vocabulário de estado
(fora do limiar / dentro do limiar / sem limiar / por ler) pede uma tradução
pensada uma vez.

## 4. Os oito defeitos do handoff, contra o sítio de hoje

| Defeito (crítica cruzada de 20.08) | Estado em `main` hoje | Verificado em |
|---|---|---|
| Excerto do Eurostat «2024: 82 p», provisório publicado como definitivo | A linha `pib-pc-portugal-2024` traz `source_flag: "p"`, o excerto «2024: 82 p» e a nota do Eurostat desde 13.08 (§1.28). O que falta é **como a primeira página mostra o sinal**; o plano decide a forma (a constituição v3.1 tem «por confirmar» como estado por forma) | `ledger/claims/pib-pc-portugal-2024.yml` |
| Correções ausentes da navegação do cabeçalho | **Mantém-se**: a navegação principal liga `/`, `/agenda`, `/estudos`, `/livro-razao`, `/metodo`, `/municipios`, `/sobre`; `/correcoes` só tem porta no rodapé e nas páginas | `dist/index.html` |
| Sem forma de selo para valores «calculado» | Mantém-se | [a verificar] na construção |
| Selo por frase versus selo por número | Mantém-se; a `IDENTIDADE.md` §5 e §10 fixam selo por valor e porta por contagem da casa | `IDENTIDADE.md` |
| Teaser da agenda sem critério, proponente e decisor | Mantém-se na primeira página; a página da agenda traz os três por item segundo o `PLANO-fases.md` (bloco V, entregável 5) [a verificar na construção] | `PLANO-fases.md` |
| Bloco dos estudos sem aparelho de proveniência | Mantém-se | [a verificar] |
| Três formulações para a cobertura municipal | Mantém-se; a §4.1 já regista as contagens por extenso da página do município como estado escrito | `DECISIONS.md` §4.1 |
| Percentagem inconsistente entre tile e teaser (61,44 vs 61,44%) | A regra do `data-claim` de 20.08 obriga o símbolo da unidade a ficar **fora** do elemento; a consistência visual é do desenho | §1.47 T4 |

## 5. O que a constituição v3.1 não diz, e o plano tem de assinalar (não improvisar)

- A **página da linha** com as portas de 20.08 (JSON, cópia arquivada) e os
  blocos do T (recorte, reconferências, ficheiro alojado, calculado sobre): a
  maqueta «Linha» é de antes; a v3.1 fala do recibo como destino do selo e não
  destas peças.
- O **índice do livro-razão** com o bloco do conjunto de dados e a licença.
- O **Método** com os três textos de 20.08 e a frase do amarelo por mudar.
- A **página das correções**, o **arquivo dos estudos** e a **página do
  documento alojado** (bytes exatos, sem a folha do sítio) fora das maquetas v3.
- A **vintage por linha** e o **campo `archived`**: onde se mostram, se se mostram.
- O **rodapé** (decidido em 15.08: só navegação) e a **linha de tempo** do
  cabeçalho («Painel europeu reconferido a …»).
- A regra **«Sem tipos de rede»** (`IDENTIDADE.md` §1, linha 38) que o handoff
  manda emendar para «só alojadas aqui, sem anfitriões de terceiros»: é
  mudança da constituição e da folha, com a política de segurança de conteúdo
  do `vercel.json` [a verificar].

## 6. Os ficheiros

- `design/especime-v3/direcao.md`: a constituição v3.1 com as Emendas (idêntica
  ao corpo da nota do cofre).
- `design/especime-v3/maquetas/`: todas as pranchas `.dc.html` (v1 «Páginas»,
  v2, v3 com `V3Completo.dc.html` e `V3Movel.dc.html`), `canvas.json`, o
  exportado do canvas, os geradores em `build/` e o `tpl/`.
- `design/especime-v3/briefs/`: os briefs das maquetas e do v2.
- `design/especime-v3/critica/`: as críticas cruzadas (Opus máx, Codex xhigh) e
  os seis renders que leram.
- `design/especime-v3/referencias/`: o dossiê de referências v2 e o seu
  registo, e o v1.
- O canvas alojado: https://claude.ai/code/artifact/3ea5c63c-635b-4135-9086-3f8767389585
  (página «v3» = direção adotada; página «Páginas» = interiores v1, a implementar
  sob as Emendas).
- Registos: `DECISIONS.md` §1.43 a §1.49 e §4; `PLANO-fases.md`; o cofre,
  `Experiments/O Estado do País.md` §Eleventh block (o handoff, os dez pontos)
  e §Twelfth block (o dia de 20.08).
