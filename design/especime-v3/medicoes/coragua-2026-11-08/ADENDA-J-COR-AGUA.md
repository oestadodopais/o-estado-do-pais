# Adenda J ao mandato COR-AGUA: o verbo do cartão da manchete e o «lhe» da conclusão (08.11.2026)

Acrescenta: frases
Frases: coragua/FRASES-COR-AGUA-j.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta da adenda I (cinco plantas em cinco). Décima retoma, a mesma sessão. As dirigidas de 67db1d1f6 deram 22 passos a zero; o `core.gate` deu PASS em 706b462.*

## §0 Medido

- **O cartão da manchete** (achado 6). Debaixo de «19–35×», diz que um agregado familiar «paga» mais por metro cúbico do que um regante dos blocos de rega do Alqueva. Mas o que o regante paga por metro cúbico é mais do que a tarifa que divide o rácio, porque acrescem a taxa de recursos hídricos e a componente de conservação por hectare. O que o cartão compara é o encargo doméstico com a tarifa, e é isso que deve dizer.
- **A conclusão** (achado 10). Em «o edital de 2026 acrescenta-lhe a taxa», o «lhe» lê-se também como o valor doméstico; o inglês «adds the water-resources levy» não diz a quê.
- **A lista declarada acima:** duas REESCREVE (a conclusão, nas duas edições) e uma FICA.

## §1 O que fazes

1. **A lista** nas páginas e nos três corpos do estudo no motor. A lista aplicada (`--aplicada`) dá zero na camada 0.
2. **O cartão da manchete**, letra por letra, nas fontes do sítio e nos corpos do motor. A linha da fonte e o valor que o guião escreve não mudam.
   - pt: a frase passa a «o encargo médio doméstico por metro cúbico, face à tarifa por metro cúbico nos blocos de rega do Alqueva»;
   - en: a frase passa a «a household's average charge per cubic metre, against the per-cubic-metre tariff in Alqueva's irrigation blocks».
3. **O fecho:**
   - o build;
   - `check:pre-mandato`, `check:frases-reais`, `check:paridade`, `check:voz`, `check:formato`, `check:lingua`, `check:edicoes` e `typecheck`.
   
   Os commits levam o assunto a começar por `COR-AGUA`, com `OEDP_GATE=adiado`.

## §2 Quando paras

Como no §2 da adenda A.

## §3 O fim

O ponto 3. Trinta minutos e quarenta chamadas, sem ajudantes.
