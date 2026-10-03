# S1 · a caixa das sugestões: relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 02.10.2026, ramo `s1-2026-10-02`, sobre o commit do brief `d0615da6`. O mandato é `design/observatorio/BRIEF-S1-a-caixa-das-sugestoes.md`. Cada número deste relatório está num JSON desta pasta, escrito por `medir-s1.mjs`; o nome da medida vai entre parênteses. Os números das secções do S1 são os do fim do bloco, guardados em `medidas-s1.json` (a cópia do `medidas.json` da cabeça `7fdd4794`); os da passagem S1-b, na secção «S1-b», em `medidas-s1b.json` (a cópia do `medidas.json` do commit `85b64d20`), com o prefixo `s1b_`; os da passagem S1-c, na secção «S1-c» no fim, em `medidas.json`, com o prefixo `s1c_`. Sem travessões.*

## Antes de tudo: o bloco não aterra sem duas decisões do diretor

*As duas foram decididas pelo diretor a 03.10.2026 (§1.154), e a passagem S1-c, no fim deste relatório, pô-las no sítio.*

1. **A nota do que fica guardado é um rascunho.** Os textos do §5.4 estão à letra em `src/data/sugestoes.mjs`, e o comentário do ficheiro diz «rascunho do lugar de direção de 02.10.2026, à espera do diretor». Ao ler a nota contra o que a função faz, achei duas coisas que o diretor deve ver antes do «sim», e não mudei uma palavra (o texto é dele): a nota diz «uma marca cifrada» / «an encrypted mark», e a marca não é cifrada, é um resumo `sha256` do sal e do endereço, que não se desfaz; mas um endereço IPv4 tem cerca de quatro mil milhões de valores, e quem tiver o sal acha o endereço de uma marca percorrendo-os, por isso a marca é um pseudónimo do endereço durante a hora em que existe, e não um anonimato. E o artigo 13.º do Regulamento (UE) 2016/679 (lido a 02.10.2026 na reprodução do texto do regulamento em gdpr-info.eu, porque a página do EUR-Lex chegou cortada) enumera o que se dá a quem deixa dados pessoais; a nota diz o que se guarda, por quanto tempo, para quê o contacto e a marca, e onde pedir o que se enviou ou que se apague; não diz quem é o responsável pelo tratamento, a base legal, quem recebe os dados (a Vercel e a Supabase tratam-nos por conta do projeto) nem o direito de reclamar a uma autoridade de controlo. Isto é uma comparação de textos, não um parecer: a exposição legal é do diretor, e a hora do advogado também.
2. **A caixa contradiz uma recusa publicada, e as recusas são do diretor.** O Método diz, nas duas edições, «Este projeto não guarda dados pessoais dos leitores nem os põe no repositório.» / «This project keeps no personal data of its readers and puts none in the repository.» (`src/data/politica-ia.mjs`, a última das cinco recusas, rendida por `MetodoView.astro` em `/metodo` e `/en/method`), que copia o §6 de `design/observatorio/POLITICA-DA-AUTONOMIA.md`. A caixa guarda o contacto de quem o deixa, o texto que o leitor escreve (que pode ter dados pessoais) e, durante uma hora, a marca do endereço. A política diz no §7 que uma mudança às recusas é do diretor, com data, e que o lugar de direção pode propor e não alterar; a emenda de 04.09.2026 repete que os dados pessoais continuam a ser dele. **Parei nesse ponto**: não toquei na recusa nem na política, e construí o resto, que só sai do ramo com o «sim» do diretor de qualquer maneira. Fica uma proposta de redação, que é só uma proposta: «Este projeto só guarda dados pessoais de quem usa a caixa das sugestões, pelo tempo e para o fim que a nota da caixa diz, e nunca os põe no repositório.» / «This project keeps personal data only of those who use the suggestions box, for the time and the purpose that the box's note states, and never puts it in the repository.» A mesma mudança vai ao §6 da política, com a data da decisão.

## O teste de aceitação, e onde se mede

| o que o teste pede (§2 do brief) | onde se mede | resultado |
|---|---|---|
| em qualquer página das duas edições, com ou sem JavaScript, no telemóvel ou no portátil, a porta «Sugestões» no rodapé ao lado da das correções | a conferência S1 do portão de HTML, em todas as páginas; a H16 do `check:alvos`, no disco e no navegador; as capturas do rodapé | a porta está nas mesmas páginas que levam a das correções (`paginas_com_uma_porta_das_sugestoes`, `paginas_com_a_porta_das_correcoes`), no `<footer>` de todas as páginas com rodapé (`alvos_paginas_com_a_porta_das_sugestoes_no_footer`, 0 fora dele em `alvos_paginas_com_a_porta_fora_do_footer`); as 25 sem ela são os documentos alojados, que também não têm a das correções (`alvos_paginas_sem_a_porta_das_sugestoes`); é uma ligação HTML, sem guião |
| uma página simples que diz em duas frases para que serve a caixa e para que não serve, com a porta das correções | `src/views/SugestoesView.astro`; a conferência S1 do formulário no portão de HTML | o parágrafo do §5.5 à letra, com a ligação para `/correcoes`; a página não carrega guião nenhum |
| três caixas, um contacto que se pode deixar ou não, a nota do que fica guardado, o botão | a conferência S1 do formulário; a H16 | as três caixas e o contacto `type="email"`, opcional, com os rótulos do brief; a nota à letra; o botão com 44 px em todas as larguras medidas (a H16, 10 medições) |
| «Enviar» leva a uma página que diz que a sugestão chegou | a célula da função (`check:sugestoes`); a prova do comportamento contra a base | `boa` e `boa-en` na célula; `04-boa-pt` e `05-boa-en` na prova, com a base a guardar os dois (`prova_envios_guardados_pela_base`) |
| a linha está na base com a língua, a página de onde veio e o texto, sem o endereço IP | a célula da função, caso `boa` | o pedido à base tem os sete parâmetros da função da base e mais nenhum: a língua, a página lida do `?de=` do `Referer`, os três textos, o contacto e a marca no lugar do endereço; os campos em branco vão como `null`. O que a linha guardou lê-se na base, a que o construtor não tem acesso: o lugar de direção confirma-o nas cinco linhas de ensaio (abaixo) |
| a sexta tentativa na hora leva a uma página que o diz | a prova do comportamento; a célula, caso `limite` | dos seis seguidos, o quarto é o sexto envio da hora na mesma marca, porque os dois bons já contaram (`prova_envios_antes_dos_seis_na_mesma_marca`, `prova_primeiro_dos_seis_recusado`): a base respondeu `limite` e a função mandou o leitor para `/sugestoes/limite` |
| uma sugestão vazia leva a uma página que o diz | a prova; a célula, caso `vazia` | `03-vazia` leva a `/sugestoes/vazia` sem chamar a base |
| um robô que preencha o campo armadilhado vai para o obrigado e nada fica na base | a prova; a célula, caso `armadilha`; a conferência S1 do formulário e a H16 | `02-armadilha` leva ao obrigado sem chamar a base (`prova_chamadas_a_base_da_armadilha_e_da_vazia`); o campo está fora do ecrã, fora do teclado e fora da árvore de acessibilidade, para nenhum leitor o preencher por engano |
| a função corre em Dublin | `vercel.json`; `vercel inspect` da pré-visualização | `"regions": ["dub1"]` ao nível de cima de `vercel.json`, e `vercel inspect` lista a função em `dub1` (`plataforma_funcao_em_dub1`, `prova-do-caminho/vercel-inspect.txt`) |
| as páginas do resultado não se indexam nem entram no mapa do sítio; a do formulário entra | a lista do `noindex` e a conferência do mapa no portão de HTML | as 10 páginas da caixa construídas (`paginas_da_caixa_construidas`), as 8 do resultado com `noindex, follow` (`paginas_da_caixa_com_noindex`), os 2 formulários no mapa do sítio (`formularios_no_mapa_do_sitio`) e nenhuma página do resultado nele (`paginas_do_resultado_no_mapa_do_sitio`) |
| nenhum ficheiro do repositório com segredo, caminho da máquina ou nome do utilizador | o `check:privacidade`, agora também em `api/`; o detetor da casa sobre os ficheiros mudados, antes de cada commit | `api/` sem segredo e sem caminho nem nome (`privacidade_segredos_em_api`, `privacidade_caminhos_e_nomes_em_api`), com a chave pública da base vista, que lá está de propósito |
| os portões continuam a contar a porta das correções e passam a contar a das sugestões | o portão de HTML; a H4 e a H16 do `check:alvos` | a conferência da porta das correções ficou como estava, e a das sugestões conta-se ao lado dela, nas mesmas páginas |
| os três portões a 0 | `portoes/`, a corrida final | na secção «Os portões», abaixo |
| a prova de caminho na pré-visualização, com as respostas gravadas | `prova-do-caminho/` | as duas metades, com o seu `LEIA-ME.md` |
| o relatório com o `medidas.json` | esta pasta | completos |

## O mandato, ponto por ponto

| # | o que | como ficou | a medida |
|---|---|---|---|
| 2 | A função | `api/sugestoes.js`, a partir do protótipo: cada resposta é um 303 relativo para uma página estática, pela tabela das rotas que a função importa (o GET para o formulário; o resto para o obrigado, a vazia, o limite ou o não chegou; a caixa cheia, uma falha de rede e a falta do sal vão ao não chegou); a leitura do `?de=` pelo `Referer` ficou, só para caminhos deste sítio; a marca é `sha256(sal \| ip)` do primeiro endereço de `x-forwarded-for`; os campos em branco vão como `null`; o corte conta caracteres e não unidades de UTF-16, como o `char_length` da base; nenhuma dependência nova; exporta o GET e o POST e mais nada. Entra no `typecheck` (o `include` do `tsconfig.check.json`, a 0 com `checkJs`) e corre em `dub1` | a célula do ponto 7 a 0 (`casos_da_celula_da_funcao_verdes`) |
| 3 | As rotas | cinco chaves na tabela, cada uma com o seu comentário: `sugestoes` (`/sugestoes`, `/en/suggestions`), `sugestoesObrigado` (`/sugestoes/obrigado`, `/en/suggestions/thank-you`), `sugestoesVazia` (`/sugestoes/vazia`, `/en/suggestions/empty`), `sugestoesLimite` (`/sugestoes/limite`, `/en/suggestions/limit`), `sugestoesNaoChegou` (`/sugestoes/nao-chegou`, `/en/suggestions/not-received`); o `check:mortos` lê agora `api/`; o mapa do sítio leva só o formulário; o portão de HTML tem a lista do `noindex` das quatro do resultado | as 10 páginas construídas (`paginas_da_caixa_construidas`); 35 rotas antes e 40 agora (`rotas_declaradas_antes`, `rotas_declaradas_agora`) |
| 4 | As páginas | `SugestoesView.astro` e `ResultadoDaSugestaoView.astro`, nas duas edições, com a folha `src/styles/sugestoes.css`; o formulário `method="post" action="/api/sugestoes"`, o campo escondido `lingua`, o campo armadilhado `sitio` (fora do ecrã, `aria-hidden`, `tabindex="-1"`, `autocomplete="off"`, rótulo «Deixe em branco»), as três caixas com rótulo e `maxlength`, o contacto opcional, a nota e o botão; as quatro do resultado com uma frase cada, a porta de volta ao formulário e à primeira página, e `noindex`. Os textos todos em `src/data/sugestoes.mjs`, à letra do brief | os textos da página iguais ao brief, byte a byte (`textos_da_pagina_iguais_ao_brief` de `textos_da_pagina_declarados`); as capturas |
| 5 | A porta do rodapé | `SiteFooter.astro`: `data-porta-sugestoes`, rótulo «Sugestões» / «Suggestions», para o formulário da edição com `?de=` igual ao caminho da página, ao lado da das correções. Dos cinco ficheiros que liam a porta das correções, conhecem a nova o portão de HTML (conta-a em todas as páginas, com o destino e o `?de=`) e a célula dos alvos (mede-a, a H16), cada um com plantas; o rodapé rende-a; o componente da porta das correções e o medidor dos defeitos não precisam de a conhecer (a porta nova não é a das correções, e não é um bloco de texto que o medidor conte) | o portão a contar (`portao_portas_das_sugestoes` em `portao_paginas_lidas_pela_porta`) |
| 6 | A privacidade e os mortos | o `check:privacidade` lê também `api/` (nenhum caminho da máquina, nenhum nome), e a célula dos segredos prova que `api/` não tem `sb_secret_`, `service_role` nem `SUGESTOES_SAL=` com valor, com plantas; o `check:mortos` lê `api/`, com a planta de uma pasta `api/` temporária; o `verify:deploy` faz um GET a `/api/sugestoes` e espera o 303 para o formulário, e lê a região da função do `x-vercel-id` | as células a 0 (`privacidade_plantas_de_api`, `mortos_ficheiros_lidos`); o `verify:deploy` a falhar hoje só nas três perguntas novas (`verify-deploy-antes-de-aterrar.log`), como tem de falhar antes de a função estar no ar |
| 7 | A célula da função | `tests/sugestoes/funcao.mjs`, `npm run check:sugestoes` no `verify`: 12 casos (`casos_da_celula_da_funcao`), com um `fetch` substituído e um sal gerado em cada corrida, e uma planta por caso, numa cópia da função numa pasta temporária; 15 plantas, todas a morder pela razão do seu caso (`plantas_da_celula_da_funcao_que_morderam`), e uma cópia de controlo sem troca que passa | a célula no `verify` |
| 8 | A prova de caminho | as duas metades em `prova-do-caminho/`: a pré-visualização com a função em `dub1`; o comportamento contra a base real, com 11 pedidos (`prova_pedidos`) | as respostas gravadas |
| 9 | As capturas | a página do formulário nas cinco larguras e nas duas edições, a do obrigado a 390 e a 1 280 px nas duas edições, e o rodapé com as duas portas a 390 px nas duas edições | as capturas (`capturas`) |
| 10 | O relatório | este ficheiro, o `medidas.json` por `medir-s1.mjs`, a resposta curta em `RESPOSTA-construtor-s1.md` | completos |

## Onde o brief não bate com o que se mediu, e o que fiz

- **A recusa do Método** (acima, no princípio): o brief não a nomeia, e a caixa contradi-la. É a proteção de uma pessoa e é do diretor: parei nesse ponto e fiz os outros.
- **A §1.29 não é a das correções.** O brief diz que as correções têm página e endereço próprios «desde a §1.29»; a §1.29 de `DECISIONS.md` é a das quatro linhas de PIB retiradas do livro-razão, e o endereço das correções é a §1.26 («O endereço das correções passou a existir, e é o domínio sem acento»). Não muda nada do que se construiu.
- **A região no `x-vercel-id` da pré-visualização** (ponto 2) não se lê: a pré-visualização está atrás da autenticação da Vercel e o pedido não chega à função. A linha de comandos só contorna a proteção criando um segredo de contorno no projeto (o código do `vercel curl` faz um `PATCH /v1/projects/<id>/protection-bypass` quando o projeto não tem nenhum), que é uma definição do projeto do diretor, e não o fiz. A região está provada pela linha do `vercel inspect`, e no ar vai prová-la o `verify:deploy`, que passou a lê-la do `x-vercel-id` da resposta da função.
- **O número da nota que o portão podia morder** não mordeu: os textos do brief já dizem os números por extenso. Em vez disso, o portão confere essas palavras contra o registo da base (abaixo).

## As decisões do construtor, e porquê

- **A função importa a tabela das rotas e o ficheiro dos textos** (para os limites), em vez de repetir os caminhos: a página e a função leem a mesma tabela, e a célula prova os destinos por `routePath`. A Vercel empacota os dois módulos com a função (17.5KB contra os 4.74KB do protótipo, no `vercel inspect`).
- **O `Location` vai relativo**, para servir igual no domínio e numa pré-visualização.
- **A ordem das perguntas**: a armadilha, a vazia, e só depois o sal, porque as duas primeiras não precisam dele; sem sal, a sugestão boa vai ao não chegou.
- **Cada caixa do formulário vive num `<p>`**, para os rótulos entrarem no inventário das frases (um `<label>` solto num `<div>` a régua não lê).
- **As páginas do resultado têm por título «Sugestões»**, e a frase do resultado por baixo; o caminho do cabeçalho acaba na migalha do formulário, como as páginas sem nome próprio já acabam.
- **A frase da página das correções é minha**, porque o §5.1 a pede e o §5.5 não a escreve, no molde da última frase do parágrafo do formulário, e está por ler pelo lugar de direção: «Para dizer o que procurou e não encontrou, ou que estudo gostava de ler, a porta é outra: a página das sugestões.» / «To say what you looked for and did not find, or which study you would like to read, the door is another one: the suggestions page.» A ligação leva `?de=/correcoes`, como a do rodapé.
- **Os textos à letra, apóstrofo incluído**: o inglês do brief escreve «project's» com o apóstrofo da máquina de escrever, e ficou assim; a régua das frases compara o texto como o HTML o escreve, e a linha do inventário leva `&#39;`, com a razão escrita no inventário.
- **A sentinela de «Language»**: a frase retirada com a segunda porta da língua mordia «the language» na nota inglesa, que é texto do diretor. Em vez de tirar a linha retirada, a dispensa é da frase inteira da nota, nas suas duas leituras (com e sem o endereço da ligação), e de mais nenhuma, com duas plantas: a palavra sozinha na mesma página e a nota com uma palavra mudada voltam a morder.
- **As regras da base, ditas por extenso, conferem-se contra o registo da base**: o portão lê de `supabase/migrations/2026-10-02-caixa-das-sugestoes.sql` os cinco envios por hora, a hora da marca, os noventa dias e o ano, e os `char_length` de cada coluna, e compara-os com as palavras da nota, da página do limite e com os limites do formulário e da função. Uma migração nova que mude uma regra sem mudar a nota fecha a construção.
- **O `.vercelignore` da pré-visualização** leva as quatro linhas que o lugar de direção provou e mais três (`dist`, `.astro`, `design-system`), porque esta worktree tinha uma construção local e a linha de comandos não lê o `.gitignore`; a Vercel reconstrói tudo. O arquivo ficou do mesmo tamanho que o do lugar de direção.
- **O guião do mapa** passou a conferir citações em `api/` e `supabase/`, para as do S1 se conferirem como as outras.

## Os portões que mudaram de forma, e a planta que prova que ainda mordem

| portão ou célula | o que mudou | classe | a planta |
|---|---|---|---|
| `gate:html`, a porta das sugestões | nova, em todas as páginas que levam a das correções: uma por página, à vista, no `<footer>`, ao lado da das correções, para o formulário da edição e com o `?de=` do caminho da página | **M** | as plantas em memória de cada corrida (`portao_plantas_em_memoria`, que contam também as das regras, cada grupo com o seu controlo): a porta a dobrar, com outro `?de=`, da outra edição, no `<main>` e escondida; e, sobre o `dist/`, a porta a dobrar e o `?de=` de outra página |
| `gate:html`, as páginas da caixa | novas: o formulário (os seis campos e mais nenhum, a armadilha fora da árvore de acessibilidade, os limites, a nota e os rótulos declarados, nenhum guião no `<main>`, sem `noindex`), as quatro do resultado (`noindex, follow`, a frase, as duas portas) e a frase das correções | **P** na nota e nos campos que o leitor manda; **M** no resto | sobre o `dist/`: o `noindex` tirado, a nota mudada, a armadilha anunciada, um campo a mais, a frase das correções tirada |
| `gate:html`, o mapa e as regras | novas: o formulário no mapa, as do resultado fora; as palavras da nota contra o registo da base | **P** nas regras, **M** no mapa | sobre o `dist/`, uma página do resultado posta no mapa; em memória, o limite, a retenção e a coluna mudados no SQL |
| `check:alvos`, a H16 | nova: a porta no disco e no navegador, o botão com 44 px, a armadilha fora do ecrã, do teclado e da árvore; e as duas famílias da caixa nas rotas medidas | **M** | os estragos da H16 (`plantas_da_h16`): a porta no `<main>`, o botão a 30 px, a armadilha à vista |
| `check:privacidade` | lê também `api/`, e a célula dos segredos | **P** | 10 plantas em memória (`privacidade_plantas_de_api`) |
| `check:mortos` | lê `api/` | **M** | a pasta `api/` temporária com uma função morta |
| `check:voz` e a régua das frases | as cinco rotas no inventário; duas exceções de contexto, cada uma na sua rota; a dispensa da frase inteira da nota inglesa na sentinela de «Language» | **M** | sobre o `dist/` (`plantas_da_sentinela_da_voz`): a palavra sozinha na página e a nota com uma palavra mudada |
| `verify:deploy` | o GET à função e a região da função | **M** | a corrida contra o sítio no ar, hoje, que falha nas três perguntas novas e só nelas |
| `check:sugestoes` | nova | **M** | as plantas da célula, uma ou mais por caso (`plantas_da_celula_da_funcao`) |

## As plantas

As do portão de HTML sobre o `dist/` estão em `plantas-portoes-s1.json` e `plantas-portoes-lista.json`, com o registo de cada uma em `planta-s1-*.log`: cada planta mudou um ficheiro do `dist/`, correu o portão sozinho, exigiu o código 1 com a queixa esperada e repôs os bytes, conferidos por sha256 (`plantas_do_portao_sobre_o_dist_que_morderam`, `plantas_da_sentinela_da_voz_que_morderam`). As da H16 estão em `alvos-plantas.json` (`plantas_da_h16_que_pegaram`). As da célula da função, da privacidade e do portão em memória correm em cada corrida, e os seus resultados estão em `celula-da-funcao.json`, `privacidade.json` e na saída do portão.

## Os commits

No ramo `s1-2026-10-02`, sobre o commit do brief `d0615da6`, por esta ordem:

- `23941c27` as decisões em vigor antes de mexer e a primeira leitura do contador;
- `c6e80bda` a caixa no sítio: os textos, as rotas, as páginas, a porta do rodapé, a frase das correções, o caminho e o mapa do sítio;
- `a1f742a3` a função, o `typecheck` e a região;
- `a505bc26` a célula da função, no `verify`;
- `3517b42e` o portão de HTML, com as plantas;
- `b61ea0b1` a privacidade, os mortos e o `verify:deploy`;
- `b4f56e92` as rotas no inventário da voz, as frases, as exceções e a dispensa da sentinela;
- `7b0f1fad` a H16 do `check:alvos`, a largura das portas do resultado e a marca da frase das correções;
- `0af061b3` o mapa do repositório;
- `ce74c218` as duas plantas da sentinela;
- `b4ab49e4` as provas, a prova de caminho, o captor, o medidor e o relatório antes da corrida final: a cabeça da corrida final dos portões;
- e o último, com os códigos da corrida final, as capturas, as medidas, o custo e a resposta curta, que só acrescenta provas a esta pasta e às capturas.

## As capturas

16 capturas (`capturas`) em `design/especime-v3/capturas/s1-2026-10-02/`, pelo captor `captar-s1.mjs`, sobre a construção da cabeça `b4ab49e4` da corrida final: a página do formulário nas cinco larguras e nas duas edições, a do obrigado a 390 e a 1 280 px nas duas edições, e o rodapé com as duas portas a 390 px nas duas edições. O manifesto `capturas-s1.json` guarda a cabeça, o resumo de cada imagem e as medidas de cada página (a altura do documento, o transbordo horizontal, a caixa do botão e a do campo armadilhado, o destino da porta do rodapé), com 0 problemas (`capturas_problemas`): nenhum transbordo, o botão com 44 px de altura em todas as larguras e o campo armadilhado fora do ecrã.

## As decisões em vigor nos ficheiros tocados

Lidas antes de mexer (`decisoes-em-vigor-antes.txt`) e outra vez sobre os ficheiros que o bloco tocou (`decisoes-em-vigor-depois.txt`, com a lista em `ficheiros-tocados.txt`); quase todas as citações são do mapa do repositório e do inventário das frases. As que o bloco tocou de perto ficam em vigor: a §1.39 (a porta para o Sobre em todas as páginas e a página das correções como casa da política: a porta nova entra ao lado e não mexe na das correções); a §1.36 e a §1.29 (o mapa do sítio com as exclusões escritas, e as páginas que estiveram no ar ganham reencaminhamento: nenhuma página saiu); a §1.68 (o cartão de partilha da rota: as páginas da caixa levam o da primeira página, pela regra que já existia); a §1.110 («a casa» não entra em cadeia nenhuma); a §1.138 (o nome e o utilizador fora da árvore pública: o detetor correu sobre cada ficheiro mudado, e a célula nova dos segredos é dessa família); e a §1.143 (uma coisa, um lugar, também na navegação: a porta das sugestões é uma só por página, no rodapé, e a frase das correções é a única porta dela no corpo dessa página).

## O custo

810 299 símbolos e 6091 segundos de parede (`simbolos_gastos`, `segundos_de_parede`), das duas leituras do contador de símbolos restantes que a ferramenta mostra ao construtor, em `custo-inicio.json` e `custo-fim.json`, e das horas lidas do relógio. A sessão foi uma só, sem resumo a meio, e o modelo foi o Claude Opus 5.5 em todo o bloco, sem subagentes. A semana da subscrição do Claude estava a 29 por cento no início e a 32 no fim (os dois ficheiros do custo).

## Os portões

A corrida final correu por `sh scripts/leituras/portoes.sh`, com a tranca da máquina (esperou pelo bloco P4, que a tinha), na cabeça `b4ab49e4`: `build` 0, `verify` 0 e `typecheck` 0 (`portao_build_codigo`, `portao_verify_codigo`, `portao_typecheck_codigo`), cada código lido de `portoes/<portão>.codigo`, escrito depois de o processo acabar, com as horas em `portoes/<portão>.inicio` e `.fim`. A cabeça no fim da corrida é a mesma do princípio (`portoes/cabeca` e `portoes/cabeca.fim`), e a árvore só tinha por seguir a pasta da própria corrida (`portoes/estado.fim`). Nos dois registos, o caminho absoluto da worktree, que três linhas imprimiam, está trocado por `<worktree>`. A pré-visualização da Vercel também passou a cadeia do `build` inteira (está `Ready`), sobre os ficheiros da worktree no momento do envio.

## O que ficou por fazer, e porquê

- **As duas decisões do diretor** do princípio: a nota e a recusa. Sem elas o bloco não aterra.
- **As cinco linhas de ensaio na base**, para o lugar de direção confirmar e apagar: os envios de `prova-do-caminho/respostas.json`, com as horas e os identificadores (`envios_que_a_base_guardou`): as horas são as do registo, ao segundo (acertadas na passagem S1-b, pelo achado 15 da leitura a frio):
  - `04-boa-pt` às 21:26:24 UTC (47d6bcee-b142-4c1e-b3cf-0ab4bf61dec2);
  - `05-boa-en` às 21:26:25 UTC (7bafb9bb-7536-4afd-9e35-560dcd2ba86f);
  - `06-limite-1` às 21:26:25 UTC (96c1302d-4dd4-4473-a529-6c8fac7af831);
  - `06-limite-2` às 21:26:25 UTC (07b04eb5-d235-4f94-a797-0c7bd5aa0eed);
  - `06-limite-3` às 21:26:25 UTC (ca579724-845c-47c2-91a3-936d7c8d61af). Todos levam «ensaio» e a hora no texto.
- **A pré-visualização** fica no projeto da Vercel, atrás da autenticação; apagá-la é do lugar de direção.
- **O passo da leitura da caixa no `CLAUDE.md`** do projeto entra ao aterrar, pelo lugar de direção (§5.6 do brief).
- **A frase da página das correções**, que é minha, e a releitura do diff do inventário (o bloco `s1` está «por ler» em `critica/REVISOES-DO-INVENTARIO.md`), fazem-se antes da fusão, com a leitura a frio por outra família.
- **O bloco P4 corre ao lado** e trata do menu principal; este bloco não tocou no menu, e o rodapé só ganhou a porta nova.

## S1-b · a passagem de correção depois da leitura a frio (03.10.2026)

*Claude Opus 5.5, sobre a cabeça `a0a85d20` do lugar de direção, que trouxe a leitura a frio do Codex `gpt-6.1-sol` com a triagem (`design/especime-v3/critica/LEITURA-S1-2026-10-03.md`: as cinco plantas achadas, nove achados reais para esta passagem), a segunda migração da base, já aplicada (`supabase/migrations/2026-10-03-chave-tranca-e-marca-horaria.sql`), e o identificador da equipa fora do registo do lugar de direção. Não toquei no brief, nas migrações nem na nota.*

### O que mudou, por achado

| achado | o que mudou | a planta que morde | a medida |
|---|---|---|---|
| 2 (Blocking), a chave | a função manda `p_chave` (a variável sensível `SUGESTOES_CHAVE`, limpa das pontas) em cada corpo; sem a chave, ou com uma chave só de espaços, não chegou, e a base não é chamada; a recusa `chave` da base leva ao não chegou | `chave-invertida`, `chave-sem-trim`, `corpo-sem-chave`, `chave-recusada-como-limite`, na célula da função; `regras-chave-tirada` e `regras-funcao-antiga-viva`, no portão | os casos `sem-chave` e `chave-recusada`, e a conferência de todos os casos (`s1b_casos_da_celula_da_funcao_verdes`) |
| 4, a marca de hora a hora | a marca é `sha256(sal \| ip \| hora)`, com a hora UTC inteira (`AAAA-MM-DDTHH`): igual dentro da mesma hora, outra na seguinte, sempre com 64 caracteres | `marca-sem-a-hora`, `marca-com-o-dia`, `marca-em-base64`, `marca-sem-separador`, `marca-do-ultimo-endereco` | o caso `marca-de-hora-a-hora` |
| 10, o endereço e a proveniência | sem `x-forwarded-for`, não chegou, e a base não é chamada; o `?de=` só se lê de um `Referer` cuja origem é a origem pública do pedido | `ip-em-falta-invertido`, `referer-de-outra-origem-aceite`, `origem-sem-o-esquema-publico` | os casos `sem-ip` e `referer-de-outra-origem` (outro anfitrião e outro esquema) |
| 6, o texto da página do limite | «Chegaram cinco sugestões deste endereço numa hora. Volte mais tarde.» / «Five suggestions arrived from this address within one hour. Please come back later.», no texto do lugar de direção; as duas frases antigas ficam retiradas no inventário, com a razão | `s1b-limite-antigo-de-volta`, sobre o `dist/`: a frase antiga de volta morde na sentinela das retiradas | `s1b_textos_da_pagina_iguais_a_decisao` |
| 8, as regras da base | a célula lê todas as migrações por ordem de nome, segue o que cada uma cria, apaga, agenda e desagenda, e confere as regras em vigor no fim contra a tabela declarada (`REGRAS_DA_CAIXA`) e contra os textos | em memória, em cada corrida do portão: o limite mudado, a limpeza tirada, o teto tirado, a tranca tirada, a chave tirada, a função antiga viva, a retenção desagendada e mudada, a tarefa das marcas diária, uma coluna mais curta | `s1b_migracoes_lidas`, `s1b_funcoes_vivas_no_fim_das_migracoes`, `s1b_tarefas_vivas_no_fim_das_migracoes`, `s1b_regras_em_falta`, `s1b_plantas_em_memoria_da_caixa_que_morderam` |
| 9, as fugas | em todos os casos da célula, nenhuma resposta (o corpo e os cabeçalhos) traz o sal, a chave ou um endereço do leitor; o detetor dos segredos apanha também a chave com valor e as duas formas entre aspas | `fuga-do-sal`, `fuga-da-chave`, `fuga-do-endereco`, na célula; `segredo-sal-entre-aspas`, `segredo-chave-com-valor`, `segredo-chave-entre-aspas`, no detetor, com os três controlos sem valor que não podem morder | `s1b_privacidade_plantas_de_api_que_morderam`, `s1b_privacidade_segredos_em_api` |
| 16, a H16 | as páginas sem a porta das sugestões comparam-se, uma a uma, com as que não têm a das correções | `sugestoes-identidades-trocadas`: uma página perde uma porta e outra perde a outra, com os mesmos totais | `s1b_alvos_paginas_so_sem_uma_das_portas`, `s1b_planta_das_identidades_pegou` |
| 17, a região no `verify:deploy` | antes de ir ao ar, a leitura da região corre sobre duas respostas reais da Vercel gravadas em `scripts/verify-deploy-regioes.json`, com o endereço, a hora, o cliente e o sha256 do que se guardou, uma de cada feitio do cabeçalho | a leitura errada (a primeira região em vez da última) tem de ser recusada pelo controlo, em cada corrida | `s1b_verify_deploy_controlos_gravados_verdes`, `s1b_verify_deploy_controlos_gravados_vermelhos` |
| 13, a equipa | o guião da prova da plataforma redige o endereço sem nomear a equipa; nenhum ficheiro do bloco tem o identificador, nem o nome que a redação do S1 trazia, que é o princípio dele (a história do ramo ainda o tem: abaixo, no que ficou por fazer) | a procura acha o identificador e o nome num ficheiro de outro bloco, que são os conhecidos-positivos | `s1b_ficheiros_do_bloco_com_o_identificador_da_equipa` e `s1b_ficheiros_do_bloco_com_o_nome_da_equipa_do_s1`, em `s1b_ficheiros_do_bloco_lidos_na_procura` |
| 15, as horas | as horas dos envios de ensaio, na secção do S1, são as do registo, ao segundo | (a medida é a planta: confere cada linha contra o registo) | `s1b_envios_de_ensaio_com_a_hora_do_registo_no_relatorio` |

### Uma coisa que achei ao medir antes de construir, e o que fiz com ela

O ponto 3 pede que o `?de=` só se leia de um `Referer` cuja origem é a do pedido. Antes de o construir li no código do `@vercel/node` que vem com a linha de comandos (a versão 5.5.28, na Vercel CLI 50.9.0) como um «Web Handler» recebe o `Request`: o `request.url` é composto com o `Host` do leitor e com `http` sempre que o `Host` não traz a porta `443`. A documentação da Vercel diz que o `host` é o domínio como o leitor o pediu e que o `x-forwarded-proto` é «typically `https` in production». Uma comparação com `new URL(request.url).origin` teria falhado em todos os envios no ar, e a página de onde o leitor veio perdia-se em silêncio. A função compara por isso com a origem pública, o esquema do `x-forwarded-proto` e o anfitrião do `request.url`, e a célula corre os casos com o pedido em `http` e o esquema público em `https`, como no ar; a planta `origem-sem-o-esquema-publico` prova que a outra comparação perderia a página. Que o código que corre no ar é este mesmo é inferido (é o ficheiro do construtor da função, `serverless-functions/helpers-web.ts`), não provado: prova-o o primeiro envio depois de aterrar.

### A prova do comportamento, e o que fica por provar contra a base real

A chave só existe na Vercel, numa variável sensível que ninguém lê de volta, e o construtor não a tem. Por isso **a prova desta passagem não chamou a base real**: correu a função nova em Node com uma chave e um sal de ensaio e uma base simulada que faz o que a última definição da função da base faz (`prova-do-caminho/prova-do-comportamento-b.mjs`, `respostas-b.json`, `prova-local-b.txt`). Fez 15 pedidos (`s1b_prova_pedidos`), e a base simulada guardou 6 (`s1b_prova_envios_guardados_pela_base_simulada`). O bom em português guardou a página do `?de=`, e o do `Referer` de outra origem guardou-a como nula. O pedido sem endereço e o pedido sem chave não chamaram a base (`s1b_prova_chamadas_a_base_sem_ip_e_sem_chave`). O sexto envio da hora na mesma marca foi o terceiro dos seis seguidos (`s1b_prova_primeiro_dos_seis_recusado`), porque os três bons já tinham contado. **O que não está provado, sem rodeios:**
- que a chave verdadeira chega à base verdadeira e que a base a aceita;
- que a base verdadeira guarda o que a simulada guardou.

O `verify:deploy`, depois de aterrar, prova que a função responde, leva ao formulário e corre em Dublin; mas faz só um GET e não manda sugestão nenhuma. O primeiro envio com a chave verdadeira contra a base verdadeira é o primeiro envio depois de aterrar, e confirma-o na base o lugar de direção.

### Duas consequências da migração nova, para o diretor ler com a nota

Não mudei nada por elas; a nota é dele e está a decidir-se.
- **O limite passa a ser cinco por marca e por hora do relógio.** Como a marca muda quando a hora muda, a mesma pessoa pode mandar cinco mesmo antes de uma hora em ponto e mais cinco logo a seguir. A prova mostra-o: depois de a hora mudar, o envio seguinte foi guardado, com duas marcas vivas ao mesmo tempo (`s1b_prova_marcas_vivas_depois_da_hora_mudar`). A frase da página do limite continua verdadeira.
- **Uma marca vive entre uma hora e quase duas.** A linha da marca expira uma hora depois do primeiro envio e apaga-se na chamada seguinte à função, ou na tarefa do minuto sete de cada hora. É inferido da agenda da tarefa e da função, não medido na base. A nota diz «fica durante uma hora».

### As plantas da passagem

- A célula da função, em `celula-da-funcao-b.json`: 17 casos verdes e 28 plantas (`s1b_casos_da_celula_da_funcao`, `s1b_plantas_da_celula_da_funcao`). Cada planta mordeu com a queixa que nomeia, e a cópia de controlo sem troca passou.
- O portão de HTML corre as plantas da caixa em memória em cada corrida (`s1b_plantas_em_memoria_da_caixa`), e todas morderam (`s1b_plantas_em_memoria_da_caixa_que_morderam`).
- O detetor dos segredos, em `privacidade-b.json`: as plantas de `api/` todas a morder, e nenhum segredo em `api/`.
- As plantas sobre o `dist/` correram outra vez sobre a construção desta passagem, todas a morder com os bytes repostos: as oito do portão de HTML e as duas da sentinela de «Language», em `plantas-b/`, e a da frase antiga do limite.
- A da H16, em `alvos-plantas-b.json`.
- A do `verify:deploy`, em cada corrida, no registo `verify-deploy-b.log`.

### Os commits da passagem

- `47a4a31d` a função e a sua célula;
- `a131a4f9` o texto do limite e o inventário;
- `cd17b9ba` a célula das regras sobre todas as migrações;
- `6ae70a5c` o detetor dos segredos, a H16 e o controlo do `verify:deploy`;
- `cc93092c` a redação sem a equipa e a prova do comportamento;
- `6d374df2` a planta da frase antiga do limite;
- `21f1a2c5` o mapa do repositório;
- `c4ff98b5` as provas, as medidas e este relatório, a cabeça da corrida final dos portões;
- e o último, com os códigos dessa corrida, as medidas postas em dia, o custo e a resposta curta.

### Os portões da passagem

A corrida final correu por `sh scripts/leituras/portoes.sh`, com a tranca da máquina, na cabeça `c4ff98b5`, o commit das provas e deste relatório: `build` 0, `verify` 0 e `typecheck` 0 (`s1b_portao_build_codigo`, `s1b_portao_verify_codigo`, `s1b_portao_typecheck_codigo`), lidos de `portoes-b/<portão>.codigo`, com a cabeça em `portoes-b/cabeca`. A cabeça foi a mesma no princípio e no fim da corrida (`s1b_portao_cabeca_igual_no_fim`), foi a que o portão da construção construiu (`s1b_portao_cabeca_e_a_construida`), e nenhum ficheiro mudou durante a corrida além da pasta dela (`s1b_portao_ficheiros_mudados_durante_a_corrida`). Nos registos da corrida, o caminho da worktree está trocado por `<worktree>`.

### O custo da passagem

282 775 símbolos e 3 246 segundos de parede (`s1b_simbolos_gastos`, `s1b_segundos_de_parede`), das duas leituras do contador de símbolos restantes, em `custo-inicio-b.json` e `custo-fim-b.json`, e das horas lidas do relógio. A passagem correu numa só sessão do Claude Opus 5.5, sem subagentes, com um resumo do contexto a meio; as duas leituras são do mesmo contador da sessão, que desceu de uma para a outra através do resumo. A semana da subscrição do Claude estava a 42 por cento no fim (`custo-fim-b.json`); a leitura do princípio da passagem não guardou a semana, e não a escrevo de memória.

### O que ficou por fazer

- **A prova contra a base real**, depois de aterrar (acima).
- **As duas decisões do diretor** do princípio deste relatório: a recusa do Método e a nota. As duas consequências acima juntam-se à nota.
- **O identificador da equipa fora do bloco.** Está ainda em ficheiros de outros blocos (`BRIEF-decisoes-2026-08-20.md`, `design/especime-v3/PLANO-redesenho-v3.md`, dois briefs em `design/especime-v3/briefs/`, `design/especime-v3/medicoes/higiene-construtor.md` e `design/especime-v3/notas/pos-fusao.md`). Não são registos meus, e não lhes toquei.
- **O nome da equipa na história do ramo.** Os ficheiros de agora não o têm, mas 2 versões da história do ramo têm-no (`s1b_versoes_da_historia_do_ramo_com_o_nome_da_equipa`, com a lista na medida): o registo do lugar de direção no commit do brief (`d0615da6`) e a redação do meu guião do S1 (`b4ab49e4`). Um `git merge --ff-only` leva-as para a história da `main`, onde o mesmo nome já está nos ficheiros de outros blocos do ponto anterior. Tirá-las pede reescrever o ramo, e a casa publica uma cabeça reescrita num ramo novo: é uma decisão da aterragem, e não a tomei.
- **A leitura a frio da passagem** e a releitura do diff do inventário (o bloco `s1-b` está «por ler»).
- **O que o S1 deixou por fazer**, e que esta passagem não tocou: apagar as linhas de ensaio do S1 na base e a pré-visualização do S1, e o passo da leitura da caixa no `CLAUDE.md` ao aterrar (a secção «O que ficou por fazer, e porquê», acima).

## S1-c · as decisões do diretor no sítio (03.10.2026)

*Claude Opus 5.5, sobre a cabeça `85b64d20`. O diretor decidiu a 03.10.2026: sim à frase nova do Método; o campo do contacto sai do formulário; a nota fica com a opção 3, a direção do projeto como responsável, pelo endereço das correções. A entrada §1.154 é do lugar de direção. Não toquei nas migrações.*

### O que mudou, ponto por ponto

| ponto | o que mudou | a planta que morde | a medida |
|---|---|---|---|
| 1, o contacto sai | o campo sai do formulário nas duas edições, com a regra da folha que só ele usava; o rótulo deixa de existir em `src/data/sugestoes.mjs`, e as duas frases ficam retiradas no inventário, com a razão; o limite do contacto sai da tabela dos limites; a função manda `p_contacto` sempre `null`, e a base fica como está; o procedimento da caixa perde as frases do contacto e da resposta por correio, e ganha uma que diz que a coluna fica vazia | na célula da função, `contacto-de-volta` e `contacto-escondido-noutro-parametro`; sobre o `dist/`, `s1c-contacto-de-volta` (o portão de HTML recusa um contacto pelo nome e pela lista dos campos) e `s1c-voz-rotulo-do-contacto-de-volta` (a sentinela das frases retiradas) | `s1c_rotulos_do_contacto_declarados`, `s1c_limite_do_contacto_declarado`, `s1c_funcao_com_o_contacto_null`, `s1c_formularios_construidos_com_campo_do_contacto`, `s1c_paginas_construidas_com_o_rotulo_do_contacto`, `s1c_frases_do_contacto_no_procedimento_da_caixa` |
| 1, a célula | os casos do contacto passam a provar que nada do que o leitor escreva num campo `contacto` chega à base: um caso novo, `contacto`, e duas conferências que valem para todos os casos (o parâmetro vazio, e o contacto de ensaio em corpo nenhum) | as duas de cima, cada uma com a sua queixa | `s1c_casos_da_celula_da_funcao`, `s1c_casos_da_celula_da_funcao_verdes`, `s1c_plantas_da_celula_da_funcao`, `s1c_plantas_da_celula_que_morderam_com_a_queixa` |
| 2, a nota | o texto aprovado, à letra, nas duas línguas, e o comentário do ficheiro diz «texto aprovado pelo diretor a 03.10.2026 (§1.154)»; o portão de HTML continua a conferir a hora, os noventa dias e o ano contra o SQL das migrações, e não mordeu em número nenhum, porque a nota já os diz por extenso | `s1-nota-mudada` (o portão de HTML) e `s1c-voz-nota-com-outra-palavra` (a linha viva do texto aprovado deixa de se render) | `s1c_notas_iguais_a_decisao` |
| 2, a voz | «alojam este sítio» / «host this site» acordou o arame da voz (os marcadores «ste sítio» e «this site»), e o texto é do diretor: uma exceção de contexto em `design/especime-v3/VOZ-MARCADORES.md`, só na rota da caixa; e a dispensa de «language» passou ao texto novo, nas suas duas leituras | `s1c-voz-este-sitio-fora-da-nota` («este sítio» noutra frase da mesma página morde), `s1-voz-language-de-volta` e `s1-voz-nota-mudada-com-language` | sem medida própria: o `check:voz` verde na corrida final e as três plantas |
| 3, a recusa do Método | a frase nova nas duas edições, em `src/data/politica-ia.mjs`, e no §6 de `design/observatorio/POLITICA-DA-AUTONOMIA.md` com a data da decisão; as duas edições entram vivas no inventário da voz | `s1c-voz-recusa-do-metodo-mudada` (com uma palavra mudada no Método, a linha viva deixa de se render) | `s1c_recusas_do_metodo_iguais_a_decisao`, `s1c_recusa_datada_no_s6_da_politica` |
| 4, as capturas | o formulário a 390 e a 1 280 px, nas duas edições, com o prefixo `s1c-`; as do S1 ficam como estavam, porque o manifesto do S1 prende o sha256 de cada uma | o captor planta um contacto em cada página, depois da imagem, e tem de o ver | `s1c_capturas`, `s1c_capturas_problemas`, `s1c_capturas_sem_o_campo_do_contacto`, `s1c_capturas_com_a_nota_aprovada`, `s1c_recusas_rendidas_iguais_a_declarada` |

### A amarra das decisões, medida antes de mexer

O ponto 3 mandava parar se a amarra (`scripts/check-ledger.mjs`) prendesse o ficheiro da política a um resumo carimbado numa entrada do `DECISIONS.md`. Li a amarra: governa só os ficheiros da sua tabela `TEXTOS`, o do Sobre e o do Método (`src/data/sobre.mjs` e `src/data/metodo.mjs`), e a sua segunda metade lê as citações da `IDENTIDADE.md`. Nem `design/observatorio/POLITICA-DA-AUTONOMIA.md` nem `src/data/politica-ia.mjs` estão nela, e nenhum ficheiro que a passagem tocou está na tabela (`s1c_ficheiros_tocados_que_a_amarra_governa`, em `s1c_ficheiros_tocados_pela_passagem`). Por isso não há resumo nenhum a pedir para a §1.154, e corri os portões inteiros.

### As plantas da passagem

- A célula da função, em `celula-da-funcao-c.json`: todos os casos verdes e todas as plantas a morder com a queixa que nomeiam, com a cópia de controlo verde.
- Sobre o `dist/` desta passagem, em `plantas-c/`: as cinco plantas novas, e outra vez as dez do S1 e a da S1-b, todas a morder com os bytes repostos (`s1c_plantas_do_dist_do_prefixo_s1c_que_morderam`, `s1c_plantas_do_dist_do_prefixo_s1_que_morderam`, `s1c_plantas_do_dist_do_prefixo_s1b_que_morderam`).

### Os commits da passagem

- `29b57384` o contacto sai e a nota aprovada (os textos, a vista, a folha, a função, a célula, o portão e o procedimento da caixa);
- `860f6724` a recusa do Método e o §6 da política;
- `92d19f0a` o inventário da voz, a exceção de contexto e a dispensa de «language»;
- `dd656d59` as cinco plantas sobre o `dist/`;
- `68b9148b` o mapa do repositório;
- o das provas, das medidas, do captor e deste relatório, que é a cabeça da corrida final dos portões;
- e o último, com os códigos dessa corrida, as capturas, as medidas postas em dia, o custo e a resposta curta.

### Os portões da passagem

A corrida final corre por `sh scripts/leituras/portoes.sh`, com a tranca da máquina, na cabeça do commit deste relatório. Os códigos, lidos de `portoes-c/<portão>.codigo`, entram no último commit com a cabeça ao lado: `s1c_portao_build_codigo`, `s1c_portao_verify_codigo` e `s1c_portao_typecheck_codigo`.

### O custo da passagem

Das duas leituras do contador de símbolos restantes, em `custo-inicio-c.json` e `custo-fim-c.json`, e das horas lidas do relógio: `s1c_simbolos_gastos` e `s1c_segundos_de_parede`. A passagem correu numa só sessão do Claude Opus 5.5, sem subagentes.

### O que ficou por fazer

- **A §1.154 no `DECISIONS.md`**, que é do lugar de direção; a amarra não pede resumo nenhum para ela, porque nenhum texto governado mudou.
- **A prova contra a base real**, depois de aterrar, como na S1-b: o primeiro envio verdadeiro confirma-se na base, agora também com o contacto vazio.
- **Uma consequência que fica com a nota aprovada**, dita na S1-b e que não muda nada aqui: a nota diz que o resumo do endereço fica durante uma hora e se apaga a seguir; a linha expira uma hora depois do primeiro envio e apaga-se na chamada seguinte à função ou na tarefa do minuto sete de cada hora, e por isso pode durar até quase uma hora depois de expirar (inferido da agenda da tarefa, não medido na base).
- **O procedimento da caixa** ainda diz que a marca é o `sha256` do sal e do endereço, sem a hora, e só fala da variável do sal; a S1-b não lhe tocou por decisão do lugar de direção, e esta passagem só tirou o contacto.
- **O nome da organização portuguesa na nota inglesa** («Comissão Nacional de Proteção de Dados») não leva a marca da língua; um leitor de ecrã lê-o com a pronúncia inglesa. Marcá-lo pedia partir a cadeia do diretor como se parte a do endereço de correio, e não foi pedido.
- **O nome da equipa na história do ramo**, da S1-b, fica como estava.
- **A leitura a frio das passagens** e a releitura do diff do inventário (os blocos `s1-b` e `s1-c` estão «por ler»).
- **O que o S1 deixou por fazer**: apagar as linhas de ensaio do S1 na base e a pré-visualização do S1, e o passo da leitura da caixa no `CLAUDE.md` ao aterrar.
