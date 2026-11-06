# MET1 D: recibo e frase das conferências

O build inteiro e as verificações abaixo terminaram a zero. Falta a parte de navegador de `check:incorporar`: a passagem proíbe executá-la dentro da sandbox e o escrivão disponível não aceita conferências isoladas. A parte documental foi executada, incluindo a planta do exemplo nas duas edições. Não foi inventado um código para o comando completo.

| Verificação | Código |
| --- | --- |
| `npm run build` | 0 |
| `node tests/metodo/plantas.mjs` | 0 |
| `node tests/metodo/construido.mjs` | 0 |
| `npm run check:lingua` | 0 |
| `npm run check:discussao` | 0 |
| `node tests/incorporar/conferir.mjs` | 0 |
| `npm run check:incorporar`, completo | Não executado |

## O que mudou

O localizador usa a mesma escolha do recibo completo: `document.locator_en` em inglês quando existe; de outro modo, `document.locator` com `linguaDoLocalizador`. Nesta linha usa-se o localizador português nas duas edições. A edição e a data de referência saíram desse campo. A régua confere o campo escolhido, o texto e a posição junto da legenda, além da lista exata dos campos.

O nome deixou de estar escrito nos dados e no oráculo do Método. É obtido por `nomeNoRecibo`, como no h1 do recibo completo. Nesta linha não há campos `name` ou `name_en`; o resolvedor declara origem `medidas`. O teste construído compara o exemplo com o h1 real em cada edição, e compara também o localizador e a sua língua. O inventário acompanha os títulos resolvidos.

Só o passo seis mudou na prosa do percurso. A comparação do oráculo anterior com o atual, descontando essa frase e o nome removido do exemplo, confirmou que as restantes frases se mantêm.

Passaram 50 plantas: as anteriores e seis novas, a edição em vez do campo do localizador, o texto da edição sob a marca do localizador e o nome diferente do recibo, nas duas línguas.

## Português copiado do dist

Salário mínimo mensal (continente) · 2026
920,00 euros por mêsfonte · Diário da República
quem o publicou
Diário da República
o documento
Decreto-Lei n.º 139/2025, de 29 de dezembro
onde está no documento
artigo 3.º (o valor) e artigo 2.º, «Âmbito territorial» («O presente decreto-lei é aplicável a todo o território continental»), p. 2
o excerto, como a fonte o escreveu
O valor da RMMG a que se refere o n.º 1 do artigo 273.º do Código do Trabalho, aprovado em anexo à Lei n.º 7/2009, de 12 de fevereiro, na sua redação atual, é de € 920,00.
a data em que foi lido
01.09.2026

Antes de cada mudança ir para o ar, correm 62 conferências automáticas: um algarismo sem linha no livro-razão, ou com outro valor, trava a publicação.

## Inglês copiado do dist

Monthly minimum wage (mainland Portugal) · 2026
920,00 euros per monthsource · Diário da República
who published it
Diário da República
the document
Decreto-Lei n.º 139/2025, de 29 de dezembro
where it is in the document
artigo 3.º (o valor) e artigo 2.º, «Âmbito territorial» («O presente decreto-lei é aplicável a todo o território continental»), p. 2
the excerpt, as the source wrote it
O valor da RMMG a que se refere o n.º 1 do artigo 273.º do Código do Trabalho, aprovado em anexo à Lei n.º 7/2009, de 12 de fevereiro, na sua redação atual, é de € 920,00.
the date it was read
01.09.2026

Before each change goes live, 62 automated checks run: a digit without a ledger row, or with a different value, stops publication.

Os fragmentos HTML estão em `recibo-pt.html` e `recibo-en.html`, com as ligações e as marcas de língua.

## Custo e pendência

Uma corrida de build, duas execuções das plantas, uma do construído e duas de cada uma das verificações de língua, discussão e incorporação documental: dez execuções. As primeiras corridas destas três verificações falharam por uma importação duplicada introduzida nesta passagem; a importação foi corrigida e as repetições passaram. Não se repetiu o build.

14 chamadas exteriores de ferramentas até à preparação do relatório. O commit e a inspeção final são posteriores. A linha «tokens used» não foi exposta.

Falta obter fora da sandbox o código de `npm run check:incorporar`, com o navegador. Não houve corrida dos três portões nem capturas.
