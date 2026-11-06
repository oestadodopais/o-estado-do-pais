# Adenda C ao mandato HIG-5: as contagens no fim de uma frase e as formas de frequência que faltam (06.11.2026)

Acrescenta: nada

*A mesma sessão da HIG-5 A e a mesma worktree, sobre 777d906a1. A leitura a frio do lote 7 pelo Claude Opus 5.5 apanhou as cinco plantas; um dos seus achados reais (6, Major) mostra que a conferência das contagens do §0 deixa passar a forma mais comum de uma contagem num §0, a do fim de uma alínea; e o 7 e o 8 são da mesma família.*

## §0 Medido (06.11.2026, por este lugar, com `numeros_do_zero` do `scripts/leituras/pre-mandato.py` desta cabeça)

| O §0 diz | Devolve hoje | Tem de devolver |
|---|---|---|
| `prova o limite em 4321.` | nada | `4321` |
| `São 1 234.` | nada | `1 234` |
| `1.234 linhas` | nada | `1.234` |
| `12.5 por cento e 123.4 também` | nada | `12.5` e `123.4` |
| `1.234,5 euros` | nada | `1.234,5` |
| `1 234 casos`, com um espaço inquebrável (U+00A0) | `234` | `1 234`, tal como escrito |
| `4321 casos` | `4321` | `4321` |
| `o Claude Sonnet 5.5 e o` `` `aterrar.py:274` ``, `a 06.11.2026 às 16:41:50, e 2026.` | nada | nada |

## §1 O que fazes

1. **A pontuação no fim de uma contagem.** Um ponto, uma vírgula, um ponto e vírgula ou dois pontos seguidos de um espaço, de uma quebra de linha ou do fim do texto são pontuação da frase, e não colam o número a nada.
2. **As outras formas de um número.** Contam também os grupos de três separados por um ponto (`1.234`, `12.345.678`), com ou sem vírgula decimal, um decimal com ponto de três ou mais algarismos ao todo (`12.5`, `123.4`), e o espaço inquebrável (U+00A0) como separador de grupos, ao lado do espaço e do espaço estreito. As datas (dd.mm, dd.mm.aaaa, aaaa-mm-dd), as horas, os anos, os números depois de «§» ou de «regra», o que estiver entre crases ou entre « e », e um número colado a uma letra, a um hífen ou a um sublinhado continuam fora, e um ponto entre algarismos de uma data nunca se lê como separador de grupos. O valor compara-se com o do ficheiro de medidas tal como está escrito no mandato.
3. **As formas de frequência.** A régua apanha também «mensalmente», «anualmente», «trimestralmente», «quinzenalmente», «semestralmente», «cada dia», «cada semana», «cada mês», «todos os meses», «cada ano», «todos os anos», «each week», «every month», «each month», «every year», «each year», e liga «semi-annual», «semi-annually», «half-yearly» e «biannual» a 182 dias, antes da leitura anual. Antes de procurar, o espaço inquebrável passa a espaço e os hífenes Unicode (U+2010, U+2011) a hífen.
4. **As provas.** As oito linhas da tabela do §0 entram nos testes do pré-mandato, cada uma com o que tem de devolver; e um teste da régua das frequências com cada forma nova do §1.3, incluindo «todos os dias» com espaços inquebráveis e «bi‑weekly» com U+2011.

Nenhuma régua fica mais fraca.

## §2 Quando paras

Se uma das formas do §1.2 colidir com uma exceção do mandato (diz qual).

## §3 O fim

`python3 -m unittest tests.leituras.pl1 tests.leituras.at1 tests.leituras.ferramenta_aterrar` (com `PYTHONPATH=tests/leituras`), os testes da régua das frequências e o `gate:html`, com os códigos; e, no relatório, a tabela do §0 com o que cada linha devolve depois. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `HIG-5 C`. Vinte minutos, quarenta chamadas.
