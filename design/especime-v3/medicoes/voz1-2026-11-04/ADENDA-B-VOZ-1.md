# Adenda B ao mandato VOZ-1: as correções da leitura a frio do lote 4 (04.11.2026)

Acrescenta: frases

*Uma passagem nova na worktree `lote4-2026-11-04`, no ramo `lote4b-2026-11-04` (refeito por este lugar sobre o lote 3 aterrável, com as tuas passagens copiadas sem mudança), depois da adenda C da PAI2. A leitura a frio do Claude Opus 5.5 apanhou as cinco plantas e deu, na VOZ-1, achados reais que o leitor vê. Três vêm de frases deste lugar.*

## §1 O calendário das fontes

1. **A razão de não haver data.** Uma fonte que não publica data e uma fonte que não se conseguiu ler não são o mesmo, e o mandato juntou-as (contradizia o seu próprio §4). A razão está nos dados (`motivo_sem_data`: `nao_publica`, `nao_lida`):
   - pt `nao_publica` «sem data anunciada»; `nao_lida` «data por confirmar na fonte»
   - en `nao_publica` «no announced date»; `nao_lida` «date to be confirmed at the source»
2. **O passado não aparece como futuro.** A lista do que as fontes publicam a seguir mostra só os acontecimentos com data igual ou posterior à da construção da página, ou sem data. Os de data passada saem dessa lista; ficam nos dados.
3. **As páginas, e não as linhas.** Onde cada acontecimento lista as linhas do livro-razão (`taxa-de-desemprego-2025 · …`), passa a mostrar as páginas do sítio que atualiza, pelo título e com ligação. Uma linha sem página de leitor não se lista.

## §2 A agenda

Os cinco itens da agenda da investigação são o trabalho interno do projeto. Três estão sem pergunta registada, e os cinco não mudam desde agosto. A página deixa de os mostrar e fica com o calendário das fontes. Os itens ficam nos dados e no repositório, que é público. O título e a descrição da página dizem só o calendário.

## §3 O registo das correções

A lista das revisões de proveniência imprime identificadores das linhas (`credito-malparado-2024`). Passa a mostrar o título de cada linha, com a porta para o recibo, como as outras entradas do registo.

## §4 As frases

1. A frase da explicação de 2026 (a condição de hoje): "O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês, e a execução até agosto está acima." lia-se como "a execução está acima do orçamento". Passa a:
   - pt «O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês.»
   - en «The budget is a forecast: what is actually spent is read in the budget execution, month by month.»
2. A leitura da semana: "nenhum mudou de valor nem de proveniência; a fonte reviu 3 deles" lia-se como uma contradição. A frase passa a dizer as duas coisas sem se contradizer, com os tokens de hoje:
   - pt «Entre ⟦data⟧ e ⟦data⟧, ⟦n⟧ números foram relidos na fonte: nenhum valor publicado mudou, e a fonte reviu ⟦k⟧, ainda com o valor de antes da revisão.»
   - en «Between ⟦date⟧ and ⟦date⟧, ⟦n⟧ figures were re-read at the source: no published value changed, and the source revised ⟦k⟧, still showing the value from before the revision.»
   Os casos de uma só revisão e de mudanças de proveniência decides pela mesma forma, e anotas.
3. A lede de `/areas` (as cadeias `area` e `dominio`) falava da "carta dos conteúdos", um documento interno:
   - pt `area` «Uma área de governo é um ministério; um domínio é um tema, como os preços ou o emprego.»; `dominio` «Um domínio é um tema, como os preços ou o emprego; uma área de governo é um ministério.»
   - en com o mesmo sentido; a lista fechada das ledes acompanha.

## §5 A régua, do tamanho do mandato

A régua da voz mede hoje uma classe mais estreita do que a do mandato:
- isenta a leitura e o sumário da página de cada estudo sem os nomear na isenção;
- a sua expressão deixa passar frases da classe.

Passa a duas peças:
1. **Uma expressão larga**, a mesma com que este lugar mediu a classe a 03.11.2026: toda a frase com "não", "nem", "nenhum" ou "nunca" e uma marca do próprio sítio ou da peça ("este projeto", "esta página", "esta explicação", "este estudo", "este documento", "esta leitura", "aqui", "não entra", "não se lê", "inferência", "juízo").
2. **Uma lista fechada** das frases que essa expressão apanha e que ficam, cada uma com a razão:
   - um facto de uma fonte;
   - uma informação funcional a quem usa uma caixa ou um formulário, como "Nada é enviado deste sítio";
   - a definição de uma natureza do registo, como "Uma atualização não é um erro".

Uma frase nova que a expressão apanhe e que não esteja na lista faz o `build` falhar.

A isenção da VOZ-2 nomeia exatamente o que isenta: os documentos dos estudos e a leitura e o sumário da página de cada estudo, com a data e o bloco que a tira. As rotas do livro-razão e das séries são recibos, e a isenção diz isso. Planta: uma frase da classe numa explicação dá vermelho.

## §6 Quando paras

Se uma frase do §4 não puder ficar como está escrita, ou se um acontecimento do calendário não tiver motivo nos dados.

## §7 O fim

O `build` inteiro verde; as conferências que a mudança toca, com os códigos e as plantas; as medidas da régua larga antes e depois (as frases que apanha, as que ficam na lista e porquê); a página do calendário, a explicação de 2026, a leitura da semana e a lede de `/areas` copiadas do `dist/` nas duas edições, no relatório. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `VOZ-1`. Sessenta minutos, noventa chamadas.
