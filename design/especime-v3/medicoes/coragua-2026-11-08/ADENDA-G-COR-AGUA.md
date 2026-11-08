# Adenda G ao mandato COR-AGUA: o consumo de referência, os blocos de rega e o IVA na conclusão do rácio (08.11.2026)

Acrescenta: frases
Frases: coragua/FRASES-COR-AGUA-g.json
Medidas: medidas-adenda-g-coragua.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta das adendas D, E e F. Cinco plantas em cinco. Sétima retoma, a mesma sessão. O `core.gate` deu PASS em f9073da; as dirigidas deram 22 passos a zero em 11f2a023c.*

## §0 Medido

- **A conclusão do rácio** (achado 7 da leitura curta). O nível médio de encargos da ERSAR é «para um consumo de 10 metros cúbicos» por mês (p. 410, sob o título «Encargos tarifários domésticos para consumos de 10 metros cúbicos»). Com a parte fixa dentro, o valor por metro cúbico só vale a esse consumo. A conclusão, escrita por este lugar na adenda D, diz o que o encargo inclui mas não o consumo; o parágrafo dos preços já o diz.
- **O excerto da ERSAR** (achado 13). O excerto, na linha do motor e em `coragua-ersar-encargo-mensal-2024`, diz «Figura 55387»: a chamada da nota 87 ficou colada ao número da figura, e o recibo apresenta-o como transcrito palavra por palavra.
- **A população da tarifa** (achado 17). O 0,0706 e o 0,0382 são as tarifas dos blocos de rega. O mesmo Anexo II tem linhas para os precários e as captações diretas. Três frases dizem «a tarifa do Alqueva para a rega» ou «um regante do Alqueva» sem o dizer: a conclusão, a frase dos preços e a dos valores base.
- **O IVA** (achado 19). O edital não tem a palavra «IVA» (0 ocorrências; o controlo «recursos hídricos» dá 1), e o encargo doméstico inclui-o.
- **O relatório de 2005 do Tribunal de Contas** (achado 18), de que a edição portuguesa do estudo cita «apenas cerca de 7% do volume de investimento previsto», está guardado (`tcontas-rel003-2005-2s.pdf`, na pasta das cópias), mas não alojado no motor. Lidas em ordem as duas colunas da folha, a citação é verbatim. As linhas do livro para os seus números ficam para a auditoria da proveniência (COR-AGUA-3).
- **A lista declarada acima:** seis REESCREVE (a conclusão, a frase dos preços e a dos valores base, nas duas edições) e uma FICA que a camada 0 pede.

## §1 O que fazes

1. **A lista nas páginas**, nas duas edições e nos corpos do motor, como na adenda D. A lista aplicada (`--aplicada`) dá zero na camada 0. O número que a lista acrescenta, o 10 do consumo de referência, resolve como o «10 m³» do parágrafo dos preços já resolve.
2. **O excerto da ERSAR** separa o número da figura da chamada da nota, na forma que a casa usa para uma chamada de nota num excerto. Se não houver forma da casa, escreve «Figura 553» seguida da chamada «87» em expoente, «⁸⁷». Faz-se nas duas linhas.
3. **O relatório de 2005** do Tribunal de Contas entra no git do motor na pasta das cópias da água, como as outras, com o `.pedido.json`.
4. **O registo das correções:** a entrada `onde-esta-a-agua` muda só no início, letra por letra; o resto fica como na adenda D.
   - pt: «O rácio entre o encargo médio de um utilizador doméstico por metro cúbico, ao consumo de referência da ERSAR, e a tarifa do Alqueva para a rega nos blocos de rega passou de 27 a 53 vezes para 19 a 35 vezes, …»
   - en: «The ratio between a household's average charge per cubic metre at ERSAR's reference consumption and Alqueva's irrigation tariff in the irrigation blocks went from 27 to 53 times to 19 to 35 times, …»
5. **O fecho:**
   - o build;
   - `check:pre-mandato`, `check:frases-reais`, `check:paridade`, `check:voz`, `check:formato`, `check:lingua`, `ledger:check`, `check:selos`, `check:edicoes` e `typecheck`.
   
   O `core.gate` corre-o este lugar. Os commits levam o assunto a começar por `COR-AGUA`, com `OEDP_GATE=adiado`.

## §2 Quando paras

Como no §2 da adenda A.

## §3 O fim

O ponto 5. Quarenta e cinco minutos e sessenta chamadas, contando as dos ajudantes; sem ajudantes.
