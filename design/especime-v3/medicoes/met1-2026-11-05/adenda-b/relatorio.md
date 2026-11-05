# MET1, adenda B: recibo de exemplo e build verde

O build inteiro e as quatro conferências dirigidas terminaram com código 0. O recibo de exemplo usa a linha `retribuicao-minima-mensal-garantida-continente-2026`, indicada no mandato. Não foi necessário escolher outra linha. Nenhuma condição de validação mudou e nenhuma porta da discussão entrou no Método. A expectativa literal do selo na conferência da incorporação passou da linha antiga à linha autorizada; o inventário de frases acompanha o novo nome.

O livro-razão tem título do documento, localizador, excerto e data de leitura. Os campos e as legendas mantêm a estrutura do exemplo anterior; o campo «onde está no documento» mostra a edição e o ano, como antes. O localizador com o artigo e a página encontra-se no recibo completo aberto pelo selo. A linha não declara `document.url`: o título fica como texto, e a fonte abre `source_url`. O publicador, o título, a edição e o excerto usam as funções de língua existentes.

| Conferência | Código |
| --- | --- |
| `npm run build` | 0 |
| `npm run check:discussao` | 0 |
| `npm run check:lingua` | 0 |
| `node tests/metodo/plantas.mjs` | 0 |
| `node tests/metodo/construido.mjs` | 0 |

## Recibo português copiado do dist

Retribuição mínima mensal garantida no continente · 2026
920,00 euros por mêsfonte · Diário da República
quem o publicou
Diário da República
o documento
Decreto-Lei n.º 139/2025, de 29 de dezembro
onde está no documento
Diário da República, 1.ª série, n.º 249, de 29-12-2025 · 2026
o excerto, como a fonte o escreveu
O valor da RMMG a que se refere o n.º 1 do artigo 273.º do Código do Trabalho, aprovado em anexo à Lei n.º 7/2009, de 12 de fevereiro, na sua redação atual, é de € 920,00.
a data em que foi lido
01.09.2026

## Recibo inglês copiado do dist

Guaranteed minimum monthly wage in mainland Portugal · 2026
920,00 euros per monthsource · Diário da República
who published it
Diário da República
the document
Decreto-Lei n.º 139/2025, de 29 de dezembro
where it is in the document
Diário da República, 1.ª série, n.º 249, de 29-12-2025 · 2026
the excerpt, as the source wrote it
O valor da RMMG a que se refere o n.º 1 do artigo 273.º do Código do Trabalho, aprovado em anexo à Lei n.º 7/2009, de 12 de fevereiro, na sua redação atual, é de € 920,00.
the date it was read
01.09.2026

Os ficheiros `recibo-pt.html` e `recibo-en.html` preservam os fragmentos HTML construídos, incluindo as ligações.

As 44 plantas passaram. O marcador antigo tem 0 ocorrências nas 4914 páginas portuguesas e 0 nas 4909 inglesas.

Cabeça de base registada no dist: `14df684f9dfccead6aa68509521b022aac88d185`. O commit da adenda é posterior à construção.

Três corridas de build, cinco conferências dirigidas e uma reprodução de diagnóstico, nove execuções de verificação. As duas primeiras corridas de build saíram a 1: a primeira pelo nome antigo no inventário, a segunda pelo identificador antigo esperado na conferência do selo. A primeira corrida dirigida da língua saiu a 1 pelo inventário; a repetição saiu a 0. A corrida final terminou depois do teto de vinte minutos; seguem apenas o relatório e o commit. Sem corrida dos três portões e sem capturas.

23 chamadas exteriores de ferramentas até à preparação do relatório. O pedido de commit e a verificação da cabeça são posteriores. A linha «tokens used» não foi exposta.
