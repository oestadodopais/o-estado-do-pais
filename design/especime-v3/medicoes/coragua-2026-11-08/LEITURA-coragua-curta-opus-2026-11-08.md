# A leitura curta das adendas D, E e F da COR-AGUA (08.11.2026)

*Leitor: Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote de 61689dfcb..11f2a023c (motor 63276ad..f9073da), com cinco plantas só nas cópias. Duas partes: a leitura (39 chamadas) e a continuação pedida pelo lugar de direção sobre os três corpos que o pacote não trazia (o edital, o anuário da DGADR e o Relatório 4/2016), lidos no pacote da leitura a frio com o mesmo sha256 (9 chamadas). O relatório do leitor vai abaixo, resumido em português, com as referências do original.*

## As plantas: cinco em cinco

| planta | o estrago | achado |
|---|---|---|
| D1 | o rácio da conclusão portuguesa passa a 19 a 53 vezes | 2 |
| D2 | o segundo escalão da EDIA na edição inglesa passa a mais 300 % | 4 |
| D3 | o excerto do simulador no livro do motor com o limite de 120 % | 5 |
| D4 | o inquérito volta a ser dado à Ipsos APEME na edição portuguesa | 3 |
| D5 | o localizador da ERSAR aponta a barra de 2023 | 6 |

## A decisão do lugar de direção sobre os achados reais

- **1 (Blocking), os corpos do edital, da DGADR e do Tribunal de Contas fora do pacote:** retirado pelo leitor na continuação. Os três corpos têm o sha256 que as linhas declaram, e os números e as citações conferem. O que fica é o Minor 21: o manifesto do pacote não percorre as linhas do motor. Vai para a CAM2, como a M83 no `ledger:check`.
- **7 (Major), a conclusão sem o consumo de referência:** real. Corrigida na adenda G.
- **17 (Major), a tarifa sem a população:** real. O 0,0706 e o 0,0382 são os dos blocos de rega, e o Anexo II tem os precários e as captações diretas. A conclusão, a frase dos preços e a dos valores base passam a dizê-lo, e também a entrada do registo (adenda G).
- **19 (Minor), o IVA:** corrigido na mesma frase («sem dizer se a tarifa inclui o IVA»). O edital não tem a palavra.
- **18 (Major), a citação de 2005 do Tribunal de Contas:** o relatório está guardado e passa a estar alojado no motor (adenda G). Lidas em ordem as duas colunas da página, a citação é verbatim. As linhas do livro para os números de 2005 (o 70, o 2,7 mil milhões e o 7) ficam para a auditoria da proveniência (COR-AGUA-3), como o 4212 (COR-AGUA-1). É texto anterior ao bloco.
- **8 (Major), as sete linhas sem `attributed_to`:** limite conhecido, e não impede a aterragem.
  - As linhas são novas neste bloco, e o `main` não perde nada.
  - Um ano ou um só algarismo não se confere pela proximidade.
  - A fonte de cada uma está na linha e no recibo.
  - A conferência da atribuição frase a frase é a CAM2.
- **13 (Minor), «Figura 55387»:** corrigido na adenda G.
- **10, 11, 12, 14, 15, 16, 20 e 21 (Minor):** vão para a lista dos Minor da higiene, ou para a auditoria da proveniência (10 e 20).
- **9:** segue dos achados 2, 3, 4 e 7. O «edital» por traduzir na edição inglesa fica, porque a página o usa em todo o lado.

## O relatório do leitor (resumo)

### Blocking

1. Os corpos do edital, do anuário da DGADR e do Relatório 4/2016 não estavam no pacote, para as linhas do motor que o bloco muda. *Retirado na continuação.*
2. **«19 a 53 vezes» na conclusão portuguesa** (planta D1). *built/estudos/onde-esta-a-agua/documento/index.html:1210*
3. **«pela Ipsos APEME» na edição portuguesa** de «Água não faturada» (planta D4). *built/estudos/agua-nao-faturada/documento/index.html:294*
4. **«the base price plus 300%» na edição inglesa** (planta D2). *built/en/studies/onde-esta-a-agua/document/index.html:944*

### Major

5. O excerto do simulador no livro do motor diz «De 110% até 120%» (planta D3).
6. O localizador da ERSAR diz «barra de 2023» (planta D5).
7. **A conclusão do rácio não diz que o encargo doméstico é para um consumo de 10 m³ por mês.** Com a parte fixa dentro, o valor por metro cúbico só vale a esse consumo (p. 410; §1.206).
8. **Sem `attributed_to` nas sete linhas de ano ou de um algarismo, nada recusa uma fonte errada ao lado desses valores.** Os tetos dos avisos subiram (7 para 28; 0 para 5). O `main` não perde nada.
9. O editor de um diário não imprimiria as páginas como estão construídas no pacote (os achados 2, 3, 4 e 7). Também nota o «edital» por traduzir.
17. **As conclusões tratam as tarifas dos blocos de rega como «a tarifa do Alqueva para a rega».** O Anexo II tem os precários e as captações diretas: 0,0923 €/m³ de média em alta pressão (de 0,0899 a 0,1107) e 0,0456 €/m³ em baixa pressão.
18. **A citação de 2005 do Tribunal de Contas, entre aspas na página portuguesa, não se pode conferir:** o documento não está alojado. A edição inglesa tira as aspas e acrescenta «for those years».

### Minor

10. Quatro linhas classificadas como falsas são números da página sem linha própria: o «mais de 70%» (duas vezes) e o «35 milhões» do relatório de 2005, e o «5%» do cartão citado.
11. Os códigos da adenda F não têm recibo escrito pela máquina no pacote.
12. A igualdade byte a byte com cf5bd5b não se reproduz a partir do pacote.
13. O excerto da ERSAR diz «Figura 55387», e a página inglesa do livro mostra o localizador em português.
14. As duas edições de «Água não faturada» guardam a caixa sobre o projeto («Os 69 factos desta página foram verificados…»).
15. A adenda D dá o boletim como de 8 de novembro, que é a data da descarga; a página diz bem 31 de outubro.
16. O teste novo da voz muda a data da entrada, mas nunca o estudo.
19. A conclusão diz o IVA do lado doméstico e nada do lado da rega, e o edital não fala de IVA.
20. O valor 2016 da linha `tc-2016-auditoria` vem do número do relatório na capa, e não do excerto nem da página localizada.
21. O manifesto do pacote não percorre as linhas do motor.

### O que está bem

- As sete cópias alojadas têm o sha256 declarado, e cada uma tem o seu `.pedido.json`.
- **Os planos de bacia:** 263 e 14 804,71 estão no Quadro 4 (p. 6), e 264 é o total do Quadro 16.
- **O boletim da APA:** 9 317 e 13 215 hm³ estão a 31 de outubro de 2026.
- **O relatório da seca:** os números estão na p. 21, com «(Fonte: APA)».
- **A imparidade da EDIA** está na p. 220, dita como o que indica e não como facto.
- **O excerto da ERSAR** está na fonte, e o 13,48 não está na camada de texto.
- **O simulador:** os 150 % e a citação são verbatim.
- **As contas do rácio** estão certas.
- **As palavras antigas** saíram das seis páginas construídas.
- **O registo** está letra por letra.
- **A exceção da voz** tem prova que recusa.
- **A classificação das 44 linhas:** nenhuma das 6 `ATTRIB` é real.
- **O C-Lab** está nas linhas e nas páginas do livro.
- **O edital e a DGADR conferem:** a conservação por hectare, a taxa de recursos hídricos, 0,0706, 0,0692, 0,0689, 0,0847 e 0,0382, e os 76 % na adução e distribuição.
- **A citação de 2016 do Tribunal de Contas** é exata nas duas edições.
