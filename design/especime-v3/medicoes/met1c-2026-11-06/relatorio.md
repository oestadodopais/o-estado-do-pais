# MET1 C: réguas do Método

O build inteiro, o índice, a parte documental da incorporação e as explicações passaram. Falta executar o comando completo `check:incorporar`, cuja segunda parte abre um navegador. A regra da passagem proíbe o navegador dentro da sandbox. O escrivão disponível aceita os três portões completos ou capturas, mas não conferências isoladas; esta passagem não autoriza a corrida dos três portões. Não foi tentado arrancar o navegador nem foi atribuído um código a uma execução que não ocorreu.

| Conferência | Código |
| --- | --- |
| `npm run build` | 0 |
| `npm run check:indice-do-sitio -- --json <temporario>/indice.json` | 0 |
| `node tests/incorporar/conferir.mjs --json <temporario>/incorporar.json` | 0 |
| `npm run check:explicacoes` | 0 |
| `npm run check:incorporar`, completo | Não executado |

## Alterações e plantas

A I7 continua a exigir 308 e o caminho do Método na mesma edição. Se houver fragmento, descodifica-o e procura o id no HTML do Método dessa edição. Âncora vazia, inexistente ou com codificação inválida recusa. O destino sem âncora continua aceite. A ausência da redireção, o destino trocado e o estado trocado continuam plantados.

As 40 plantas anteriores passaram; as duas novas plantas de âncora inexistente também passaram, uma por edição: 42 de 42. Nenhuma planta anterior foi retirada para manter artificialmente o total de 40.

A régua da incorporação exporta `LINHA_DO_EXEMPLO_METODO`, lida do oráculo `MET1.recibo.id`. A conferência e a planta usam essa exportação. As duas plantas de remoção do selo morderam com a mensagem original. Não se alteraram condições que protegem números, fontes ou pessoas.

## Procura pedida

Comando, corrido antes e depois da mudança:

```sh
rg -n 'divida-publica-2025|/metodo|/en/method' tests scripts --glob '*.{mjs,js,json,sh,py}'
```

Antes: 184 linhas em 49 ficheiros. Depois: 182 linhas em 47 ficheiros. A procura complementar por «a-verificar|to-verify|headers.*Location», no mesmo âmbito, encontrou 28 linhas candidatas. São contagens de linhas encontradas, não de defeitos.

Dois achados desatualizados: a comparação exata da I7 em `tests/indice/indice.mjs` e a dívida pública como exemplo em `tests/incorporar/conferir.mjs`. Ambos corrigidos. A literal da linha nova em `scripts/incorporar-do-portao.mjs` também foi centralizada na exportação. Não se encontrou outra régua ou planta com esses dois defeitos.

As restantes referências à dívida pública são ensaios dessa medida, da discussão, dos cartões ou dos recibos, e conservam-se. `scripts/indice-do-portao.mjs`, `tests/livro/indice.mjs` e `scripts/design-bundle.mjs` conferem ligações de navegação, não destinos de redireção, e conservam-se. `tests/metodo/construido.mjs` já exige os destinos com `#marcas`, pelo que não mudou. As outras comparações de Location em `tests/inicio/entradas.mjs` e `scripts/gate-html.mjs` protegem redireções de outras rotas.

## Custo e pendência

Uma corrida de build e três conferências dirigidas, quatro execuções. Sem corrida dos três portões e sem capturas. 13 chamadas exteriores de ferramentas até à preparação do relatório. O commit e a inspeção final são posteriores. A linha «tokens used» não foi exposta.

Pendência: o lugar de direção deve correr `npm run check:incorporar` fora da sandbox para obter o código completo, incluindo o navegador.
