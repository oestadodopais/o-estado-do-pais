# MET1 E: passo dois

O passo dois foi substituído pela redação literal da adenda nas duas edições e no oráculo. A comparação com a cabeça anterior confirmou que nenhuma outra frase da lista fechada mudou. A vista, o CSS do percurso e a régua do Método mantêm-se iguais à cabeça anterior. Os SVG construídos não imprimem texto sobre a cópia ou o recibo do pedido.

| Verificação | Código |
| --- | --- |
| `npm run build`, inteiro | 0 |
| `node tests/metodo/plantas.mjs` | 0 |
| `node tests/metodo/construido.mjs` | 0 |

## Passo dois copiado do dist

Português:

Um programa descarrega o documento da fonte e mede o número no próprio documento.

Inglês:

A program downloads the source document and measures the number in the document itself.

As 50 plantas do Método passaram. O teste construído confirmou as duas edições e encontrou 0 ocorrências do marcador antigo em português e 0 em inglês.

## Custo

O build demorou 660,8 segundos e ultrapassou o teto de dez minutos da passagem. Depois dele foram apenas concluídos a verificação construída, o relatório e o commit.

Uma corrida de build e duas conferências dirigidas, três execuções de verificação. Sem corrida dos três portões e sem capturas. 5 chamadas exteriores de ferramentas até à preparação do relatório; o commit e a inspeção final são posteriores. A linha «tokens used» não foi exposta.
