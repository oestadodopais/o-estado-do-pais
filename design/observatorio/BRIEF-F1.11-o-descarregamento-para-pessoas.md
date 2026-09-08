# Brief F1.11 · O descarregamento para pessoas (08.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 08.09.2026, a partir da linha F1.11 do plano e do R1 da ronda de leitores de 07.09 («when we download the data, it comes in a spreadsheet, Excel, CSV, or something like that, without any formatting … tons of text and content with no rule. It's not easy for whoever downloads it to make sense of it or to be able to check them properly»). Corre depois de o F1.10 aterrar, porque toca nas páginas que o F1.10 reorganiza. Constrói o Opus; o Sonnet confere às cegas os números das folhas contra o livro-razão; o Codex lê a frio com cinco plantas e diz, como leitor de primeira vez, o que cada coluna é. Sem travessões na prosa.*

## 0 · O que este bloco é

Hoje o sítio descarrega o livro-razão como o motor o exporta: um CSV com 31 colunas de nomes técnicos (`id`, `value`, `name_source`, `document_locator`, `source_flag_note_en`, `derivation`, `check`, `verifications`), 3 MB inteiros, e um JSON por linha; é a forma certa para máquinas e a errada para uma pessoa que quer ver os números de Évora e conferi-los. Este bloco separa os dois: **uma folha de cálculo para pessoas**, gerada na construção do mesmo livro-razão, por página e para o todo, com cabeçalhos em palavras, as unidades, as três datas e a fonte de cada linha, e uma folha «Como ler»; e o CSV e o JSON crus, que ficam para as máquinas e se dizem como tal ao lado.

## 1 · O que entra

1. **A folha, e onde aparece.** Uma folha `.xlsx` por: cada concelho (as suas linhas, pela ordem da página), cada domínio, cada região, cada medida (a sua história e as suas linhas), cada estudo (o seu livro-razão de afirmações), a página europeia (os 21 e as suas linhas), e o índice dos números (o todo). A porta diz o que é e para quem: «Folha de cálculo (para ler e conferir)» ao lado de «CSV e JSON (para máquinas)», nas duas edições, com a mesma forma em todas as páginas (a regra do F1.10: uma coisa, um lugar); a edição inglesa descarrega uma folha em inglês.
2. **As colunas, em palavras, por esta ordem**: Medida; Valor; Unidade; Período de referência; Publicado pela fonte a; Lido na fonte a; Verificado a; Fonte (o publicador); Documento (o título e a edição); Estado (o selo, por extenso: «conferido», «a verificar», «corrigido»); Correções (se houver); Endereço da fonte; Excerto. As colunas dos algarismos são números (não texto), com a unidade na sua coluna; as datas são datas; a primeira linha fica fixa; as larguras medidas para o texto caber; sem cor além do filete do cabeçalho (a identidade não muda). Nada que não esteja na linha do livro-razão entra na folha.
3. **A folha «Como ler»**, a segunda de cada ficheiro: o que é cada coluna, numa frase; o que são as três datas; o que é o selo e onde está a prova (o endereço da página da linha); a fonte e a licença de cada linha são as que a linha cita (a licença da casa é do F4.6 e até lá não se afirma); «citar como» só quando a casa o decidir (F4.6). Frases de mobília do inventário da voz, nas duas edições, declaradas com origem.
4. **A geração, na construção**: um só gerador (`scripts/folhas.mjs`) que lê o livro-razão e escreve os `.xlsx` em `dist/` (o caminho de cada um dito ao lado da página). Um `.xlsx` é um zip de XML; o construtor mede primeiro se um escritor mínimo da casa (`node:zlib`, cadeias em linha, sem estilos além do cabeçalho fixo e das larguras) custa menos do que uma dependência, e decide com a razão escrita; uma dependência entra só presa a uma versão, com o que ela faz dito, como o Astro. O CSV e o JSON não mudam.
5. **O portão**: `check:folhas`, no `verify`, abre cada `.xlsx` gerado (o leitor é da casa, para não depender de quem escreveu) e confere que cada número resolve na sua linha do livro-razão com o mesmo valor e a mesma unidade (a mesma conta do `gate:html`), que as colunas estão pela ordem e com os nomes declarados, que a folha «Como ler» existe nas duas línguas, e que a folha de cada página tem exatamente as linhas que a página mostra; plantas: um valor trocado, uma coluna a menos, uma linha a mais, a folha «Como ler» em falta, um `.xlsx` que não abre.
6. **O telemóvel**: a folha de um concelho abre-se num telemóvel sem rolar para o lado nas colunas que importam: as sete primeiras colunas (até «Verificado a») cabem em 390 px de largura com as larguras que a folha declara, medido pela soma das larguras em caracteres contra o que o Numbers e o Excel do telemóvel mostram por omissão (o construtor mede uma vez, à mão, e escreve o número; a régua confere a soma das larguras); o endereço e o excerto ficam no fim.

## 2 · O que não entra

Nenhum número novo; nenhuma mudança ao CSV nem ao JSON; nenhum formato além do `.xlsx` (o `.ods` fica escrito como pergunta); nada nos documentos alojados; a licença e o «citar como» (F4.6).

## 3 · As medidas de aceitação (escritas antes)

| # | medida | como se mede |
|---|---|---|
| D1 | cada número de cada folha resolve numa linha do livro-razão com o mesmo valor e unidade; 0 órfãos | `check:folhas` |
| D2 | a folha de cada página tem as linhas que a página mostra, e só essas; o todo tem as 2 916 (ou o número do dia, lido do livro-razão) | `check:folhas` |
| D3 | as treze colunas pela ordem e com os nomes declarados, nas duas edições; a folha «Como ler» em cada ficheiro | `check:folhas` |
| D4 | a folha de um concelho: as sete primeiras colunas em ≤ 390 px pelas larguras declaradas, medido uma vez à mão no Numbers e no Excel do telemóvel e escrito | a régua da soma das larguras, e a medição à mão |
| D5 | a porta em cada página, com a mesma forma e as duas frases («para ler e conferir» / «para máquinas»), nas duas edições; 0 páginas com a porta antiga sozinha | script sobre o `dist/` |
| D6 | o Codex, como leitor de primeira vez, diz o que cada coluna é a partir da folha e da «Como ler», sem o brief | a leitura |
| D7 | o Sonnet confere às cegas 200 números ao acaso das folhas contra o livro-razão, 200 de 200 | a medição cega |
| D8 | os três portões a 0; `check:folhas` no `verify`; as plantas vermelhas e depois verdes; o tempo da construção medido antes e depois (o gerador não pode custar mais do que um minuto, ou di-lo com a razão) | os comandos |

## 4 · A disciplina e o custo

Como nos outros blocos: commits pequenos em português sem travessões, os trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`, nunca `git add -A`, nunca um número que não foi medido, o `typecheck` estrito, cada cadeia nova no inventário da voz, o relatório a começar pela tabela das medidas. Estimativa: Opus, duas passagens, da ordem de 0,4 a 0,8 M símbolos (S a M): o escritor do `.xlsx` e o portão são a parte grande.
