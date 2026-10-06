# A entrada do registo para a aterragem do ER1 (escrita a 06.10.2026 pelo lugar de direção; o construtor da passagem ER1-b copia-a para `DECISIONS.md` com o número seguinte ao último do registo e o carimbo que `npm run ledger:check` pedir)

### 1.[N] O ER1 aterra: cada número do livro-razão pode ser incorporado noutra página com a sua fonte, a sua data e a porta para o recibo, e o Método di-lo numa frase

**Afecta:** sobre/metodo

**Texto:** metodo [CARIMBO]

**Data:** 06.10.2026 (o brief `BRIEF-ER1-o-recibo-incorporavel.md` escrito de manhã; o construtor lançado à tarde; a leitura a frio do Claude Opus 5.5 das 14:50 às 15:12 UTC, em `design/especime-v3/critica/LEITURA-ER1-2026-10-06.md`; a passagem ER1-b depois da reposição do Codex de 12.10.2026; a aterragem com a hora no prompt da sessão seguinte).

**O que aterrou.** O bloco ER1, construído pelo Codex `gpt-6-astra` pelo brief: (1) cada recibo do livro-razão, nas duas edições, traz o bloco «Incorporar este número» com o código que um jornal ou um blogue cola para mostrar o número com a sua unidade, o seu lugar, o seu período, a sua fonte, a data em que foi lido e a porta para o recibo; (2) um guião pequeno deste projeto (`/incorporar.js`) mantém o número em dia lendo o JSON da linha, só nos seus próprios parágrafos, sem credenciais, sem referenciador e sem outro pedido; (3) os ficheiros do livro-razão (o JSON de cada linha, o JSON e o CSV do conjunto) e o guião respondem a qualquer origem (a regra CORS da Vercel cobre só esses caminhos); (4) um recibo cuja fonte ou data de acesso esteja por confirmar na fonte não oferece código, e di-lo; (5) o portão recompõe o código de cada recibo a partir da linha e recusa qualquer diferença, qualquer marca «[a verificar]» e qualquer palavra que não esteja no inventário das frases; (6) a frase do Método, nas duas edições, diz o que o código é, o que o guião lê e pede, que a origem da página que incorpora chega ao alojamento (que não a guarda) e que a licença é a do conjunto de dados.

**As decisões do bloco.** A leitura a frio mordeu as cinco plantas e achou o que a passagem ER1-b corrigiu (os achados 4, 7, 8 e 10 a 15 da leitura, com a decisão do lugar de direção em `design/observatorio/mandatos/MANDATO-ER1-b-2026-10-06.md`); o achado 9 (o recibo do custo unitário do trabalho sem referência) é anterior ao ER1 e fica no bloco dos recibos.

**O custo.** O construtor: [CUSTO-ER1] e [CUSTO-ER1-B] símbolos nas duas passagens (as linhas «tokens used»); a leitura do Opus: 329 667 (o total reportado pela ferramenta). A corrida `portão` do GitHub verde na cabeça que aterra.
