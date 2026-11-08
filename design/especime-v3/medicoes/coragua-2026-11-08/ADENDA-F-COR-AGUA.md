# Adenda F ao mandato COR-AGUA: a conferência das atribuições como estava antes do bloco (08.11.2026)

Acrescenta: nada
Medidas: medidas-adenda-f-coragua.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois do fecho da adenda E (11f2a023c no sítio; 19dd943 no motor). Sexta retoma, a mesma sessão. Este lugar correu o `core.gate` na cabeça 19dd943 fora da tua caixa, e deu FAIL com sete problemas.*

## §0 Medido

- **`core.attributions_test` FAIL no gate.** Corrido sozinho sai a 0, mas o commit 19dd943 escreveu a linha final sem o número de conferências, e o gate recusa uma suíte que não diz quantas fez (`_CONTA_DA_SUITE`).
- **Seis documentos acima do seu teto de atribuições erradas (ratchet).**
  - Cinco estão em estudos de Évora que este bloco não tocou: `evora-economy-2026-pt` em três formas (1 contra 0), `evora-pelouros-html` (1 contra 0) e `evora-quem-governou-pt-html` (20 contra 19). Os livros desses estudos não mudaram neste bloco, e a versão de cf5bd5b estava dentro dos tetos; a versão da cabeça acrescenta linhas novas, como o 345 684 dado ao CHEGA e o 2 307 512 dado a um presidente.
  - O sexto é `onde-esta-a-agua-pt` (13 contra 4).
- **A causa no motor da água.** As linhas que este bloco acrescentou com um ano ou um só algarismo como valor, e uma entidade declarada, recusam por proximidade em todo o documento: «2024» junto da APA, da ERSAR ou da EDIA, e os rótulos das secções «02», «05» e «08» lidos como 2, 5 e 8. São estas: `seca-ago-baixas` (2), `dgadr-minimo` (8), `gulb-universo-ha` (5), `gulb-inquerito-ano` (2019), `gulb-publicacao-ano` (2020), `tc-2016-auditoria` (2016) e `dgadr-referencia-ano` (2024). Foi por isso que a adenda B estreitou a conferência, e as adendas D e E não a repuseram igual.
- **A medida deste lugar**, com o código de cf5bd5b e os livros da água da cabeça sem `attributed_to` nessas sete linhas:
  - em `agua-nao-faturada-pt` e `-en`: 0 atribuições erradas e 5 avisos de entidade por declarar em cada;
  - em `onde-esta-a-agua-pt`: 6 atribuições erradas (o teto é 4) e 28 avisos (o teto é 7). As seis são entidades certas noutra frase dentro da janela de 160 caracteres: o 0,0706 e o 0,0382 junto da ERSAR da frase anterior; o 1,348 junto da EDIA da frase seguinte; o 2 029 018 255 junto da Gulbenkian; e o 70, duas vezes, junto do Tribunal de Contas e da EDIA.

## §1 O que fazes

1. **`core/attributions.py` e `core/attributions_test.py` voltam ao conteúdo de cf5bd5b, byte a byte.** A conferência deste bloco fica igual à que estava antes, nos estudos da água e em todos os outros, e os estudos de Évora voltam aos seus tetos.
2. **As sete linhas acima não declaram `attributed_to`.** Um ano ou um só algarismo não se atribui pela proximidade. A fonte de cada uma fica na linha, e o recibo do sítio mostra-a. Cada outra linha nova dos livros da água cujo valor tem uma fonte única declara o `attributed_to` dessa fonte, como as outras linhas do estudo.
3. **Os tetos dos documentos da água** em `core/gate_baselines.json` passam às contagens medidas na cabeça final, nunca acima delas. Ao lado fica um ficheiro de medição com cada linha `ATTRIB` e `UNDECLARED`, e a sua classificação:
   - **falsa**, e de que forma: a entidade certa noutra frase, um ano, um rótulo;
   - **real**: uma atribuição errada no texto. Não entra no teto, e paras e dizes.
4. **O fecho:**
   - os testes do motor que isto toca (`core.attributions_test` a sair com a linha da casa, com o número);
   - o `ledger:check`, o `check:cruzamento` e o `check:series` no sítio com o motor da cabeça.
   
   O `core.gate` corre-o este lugar. Os commits no motor levam o assunto a começar por `COR-AGUA`, com `OEDP_GATE=adiado`. O relatório diz cada código e a lista do ponto 3.

## §2 Quando paras

Como no §2 da adenda A, e no ponto 3.

## §3 O fim

O ponto 4. Quarenta e cinco minutos e sessenta chamadas, contando as dos ajudantes; sem ajudantes.
