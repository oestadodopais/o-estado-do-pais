# BRIEF, bloco das decisões de 20.08.2026: a primeira frase da regra 6 e a licença do conjunto

*Escrito a 2026-08-20 pelo lugar de direção (Claude Fable 5, a delegar), depois de
a direção ter delegado nesse dia a condução da lista de decisões de 20.08 com a
recomendação ao lado de cada uma («drive all of it»). O que aqui se constrói são
as duas decisões que tocam texto governado ou estado público e cabem numa só
pré-visualização. Onde este ficheiro e a `IDENTIDADE.md` discordarem, ganha a
constituição. Grafia: Acordo de 1990. Sem travessões. Nada inventado;
`[a verificar]` para o que não se sabe.*

## 0. O que o bloco entrega, e como se sabe que entregou

1. **A primeira frase da regra 6 do Método** deixa de ser um absoluto que a
   própria página desmente (achados 7 e 13 da leitura cruzada do bloco T,
   `DECISIONS.md` §1.47). Passa a ser, nas duas edições e sem mais nenhuma
   palavra mudada nessa regra:

   - pt: «Os números publicados são relidos na fonte por um caminho diferente e
     por quem não os escreveu, linha a linha, e cada linha diz se já o foi,
     quando e com que resultado. O painel da primeira página é reconferido
     contra a fonte todas as semanas, e a página diz quando foi a última vez.»
   - en: «Published figures are read again at the source by a different route
     and by someone who did not write them, row by row, and each row says
     whether it has been yet, when and with what result. The panel on the front
     page is re-checked against the source every week, and the page says when
     the last time was.»

   A segunda frase de cada edição é a que já lá está; só a primeira muda.

2. **A licença do conjunto de dados** passa de `null` a CC BY 4.0, num só campo
   (`src/data/licenca.mjs`), na forma que o próprio ficheiro documenta:

   ```js
   export const LICENCA = {
     nome: 'CC BY 4.0',
     url: 'https://creativecommons.org/licenses/by/4.0/',
     atribuicao: 'O Estado do País, oestadodopaís.pt',
   };
   ```

   Com isto, e por construção do T4: o índice do livro-razão oferece o CSV e o
   JSON nas duas edições, com a licença ligada e a atribuição ao lado; cada uma
   das 264 páginas de linha ganha a porta «Esta linha em JSON» / «This row as
   JSON»; a linha de estado («a licença aguarda decisão da direção») sai. Entra
   **uma frase nova** ao pé da licença, nas duas edições, como cadeia em
   `src/i18n/strings.mjs` (não é texto governado):

   - pt: «A licença cobre o conjunto: a estrutura, os valores da casa, as
     derivações e as descrições. Os excertos transcritos das fontes continuam
     sob os termos de quem os publicou.»
   - en: «The licence covers the dataset: its structure, the house values, the
     derivations and the descriptions. Excerpts transcribed from sources remain
     under their publishers' terms.»

3. **Os registos**: uma entrada nova no `DECISIONS.md`, **§1.48**, com
   `**Afecta:** metodo` e `**Texto:** metodo <resumo>` (o `ledger:check` diz o
   resumo certo quando ele não bate; nunca se escreve de cabeça), que regista as
   duas decisões como tomadas pela direção a 20.08.2026 por delegação sobre a
   recomendação do lugar de direção, a redação, as contagens antes e depois
   (ligações do conjunto: 0 → N, páginas de linha com a porta do JSON: 0 → 264,
   frases de moldura pela régua) e os estragos plantados com a frase do portão;
   a `IDENTIDADE.md` §12, cujo ponto «O conjunto de dados existe e não é
   oferecido» deixa de ser verdade e passa a dizer o estado novo (a
   constituição descreve o que está, e não o que esteve); o `PLANO-fases.md`
   «The next session», item 3, alíneas (a) e (d), marcadas como decididas; e o
   `legal/rascunhos/2026-08-20-pedido-licenca-prr.md`, que já está no disco com
   o destinatário preenchido, entra no mesmo commit.

**Done means:** `npm run build` verde (inclui `ledger:check` com o resumo novo,
`check:documentos`, `gate:html`, `check:dados` a dizer que os dois índices
oferecem os ficheiros), `npm run typecheck`, `node scripts/ortografia.mjs
--verificar`, `npm run check:cruzamento -- --with-origin`, e a régua
`node scripts/medir-defeitos.mjs` corrida antes (em `main`) e depois, com as
duas tabelas na entrada §1.48.

## 1. As regras que valem

- **Nenhum portão novo, nenhuma conferência mudada.** As conferências que este
  estado precisa já existem e foram provadas no T4 (a comutação da licença no
  `check:dados`, o motivo de dispensa `licenca-do-conjunto` para os algarismos
  do nome da licença, a amarra das decisões com o resumo do Método). O que se
  prova aqui é que elas fecham **neste** estado, com estragos plantados e
  repostos:
  1. com a licença decidida, tirar a ligação do CSV do índice da edição inglesa
     (na construção, em `dist/`) e correr `npm run check:dados`: tem de fechar
     com «o índice do livro-razão da edição "en" não liga para "/livro-razao.csv"»;
  2. correr `npm run ledger:check` **antes** de atualizar o resumo em §1.48: tem
     de fechar por o resumo do Método não bater; depois de atualizado, passa;
  3. um travessão posto de propósito na frase nova da licença e
     `node scripts/ortografia.mjs --verificar`: fecha; reposto, passa.
  Cada estrago é reposto e a reposição conferida (diff vazio no ficheiro).
- **Estado renderizado, nunca escrito.** Nenhuma contagem nova à mão: as
  contagens da entrada vêm da régua e do `dist/prova.json`.
- **Nada inventado.** Se algo não se souber, escreve-se `[a verificar]`.
- **Sem travessões**, nas cadeias e nos registos.
- **Ramo:** `decisoes-2026-08-20`, criado de `main` (`0068d33`). Commits
  pequenos, mensagens em português na voz da casa (ver `git log`). **Não fundir,
  não empurrar para `main`.** No fim, `git push -u origin decisoes-2026-08-20`
  para a pré-visualização protegida do Vercel e parar.
- **Não tocar** em `ledger/claims/`, no motor (`~/Instruments/ResearchHub`), nem
  em mais nenhum texto governado além da regra 6.

## 2. O que fica para o lugar de direção, depois do builder parar

A leitura cruzada do Codex com estragos plantados sobre as páginas construídas;
a pré-visualização para a direção; a palavra dela; a fusão; `verify:deploy`; o
pacote de desenho e o DesignSync (a página de linha ganhou uma porta, e por isso
o pacote regenera-se); o registo no cofre.

## 3. O relatório do builder

No fim: os commits do ramo; o endereço da pré-visualização (a forma é
`https://o-estado-do-pais-git-<ramo>-nunos-projects-b945a519.vercel.app`); as
três provas plantadas com a frase de cada portão; as contagens antes e depois;
tudo o que ficou por fazer e porquê; e os tokens gastos.
