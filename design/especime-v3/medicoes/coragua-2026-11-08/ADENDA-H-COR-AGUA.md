# Adenda H ao mandato COR-AGUA: os selos do registo das correções como prosa corrida (08.11.2026)

Acrescenta: nada
Medidas: medidas-adenda-h-coragua.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da adenda G. Oitava retoma, a mesma sessão. O `core.gate` deu PASS em f57cb4b; as dirigidas de 9d3a76d05 deram 22 passos com um vermelho.*

## §0 Medido

- **`check:alvos`, a H2.** Na faixa de 641 a 1 023 px, um selo do registo das correções («row · O Estado do País», caixa de 44 por 44) falha: o quadrado de 44 px toca o vizinho. Na adenda G mudou o texto da entrada de «Onde está a água», e as linhas partem noutros sítios.
- **A causa vem da adenda C.** A regra de `src/styles/leitura.css` («COR-AGUA C: os selos do registo mantêm caixas de toque inteiras na faixa H2») dá aos selos do registo 44 px de altura dentro da frase. Na captura a 768 px, a entrada de «Água não faturada» tem a entrelinha rebentada em cada linha com selo: é o que a I127 recusou para a prosa corrida.
- **A forma da casa** para os selos dentro de prosa corrida está em `tests/acessibilidade/alvos.mjs`: a classe do contentor entra em `naProsaCorrida`; a entrelinha não se estica; cada selo conserva a sua área inteira a 390 px; e um estrago prova que é a classe que dispensa o selo, e só ela. Foi assim que a EX1 juntou `.explicacao-p`.

## §1 O que fazes

1. A regra da adenda C sai de `src/styles/leitura.css`.
2. O contentor da frase de cada entrada textual do registo (a que traz `data-texto-estudo`) entra em `naProsaCorrida`, com o comentário da razão, como o da EX1. Junta-se um estrago `registo-sem-classe`, que tira a classe e faz o selo voltar a falhar. Nenhum outro contentor muda de família, e a contagem dos selos em prosa corrida diz quantos entram.
3. **O fecho:**
   - o build;
   - `check:alvos`, `check:voz`, `check:formato`, `check:selos`, `check:edicoes` e `typecheck`.
   
   Os commits levam o assunto a começar por `COR-AGUA`. O relatório diz cada código e quantos selos do registo passaram à prosa corrida.

## §2 Quando paras

Como no §2 da adenda A. Paras também se o selo continuar a falhar com a classe, ou se outro selo fora do registo mudar de família.

## §3 O fim

O ponto 3. Trinta minutos e quarenta chamadas, contando as dos ajudantes; sem ajudantes.
