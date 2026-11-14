# Verificação de 13 linhas e de seis linhas «historico»: veredictos (14.11.2026)

Verificador independente (Claude Opus 5.5). Não escrevi nenhuma destas linhas. Só leitura no repositório. Os 50 pedidos estão em `pedidos.jsonl` (46 com 200 e 4 com 404, todos 404 em URLs adivinhados de edições mais recentes) e os corpos estão em `corpos/`.

Cópias guardadas no motor (`ResearchHub/content/01 Energy Water and Climate/source/agua-2026-11-08/`): o sha256 das cinco bate certo com o ledger. O PDF ao vivo de cada uma, buscado hoje, é **idêntico byte a byte** à cópia guardada (EDIA a6619e4b…, DGADR 2cdd510e…, ERSAR cd913fa3…, Gulbenkian 623abfec…, TC 963da78c…).

Etiquetas: V = verificado na fonte; I = inferido; NC = não conferido.

| id | valor no sítio | valor na fonte (onde) | veredicto | razão |
|---|---|---|---|---|
| coragua-alqueva-alta-pressao-2026 | 0,0706 €/m³ | 0,0706, Edital EDIA 2026, PDF p.5, Anexo II «Tarifário para 2026, Blocos de Rega EFMA», linha «Fornecimento de água em alta pressão», período «Valor médio», coluna «Consumos até 100% do volume atribuído (€/m3)» (V) | CONFIRMADO (com qualificadores omitidos) | O recibo diz «a tarifa por metro cúbico para fornecimento em alta pressão», mas a fonte tem quatro tarifas de alta pressão (vazio 0,0692; cheia 0,0689; ponta 0,0847; «Valor médio» 0,0706), e o 0,0706 «será aplicado sempre que não seja possível obter um perfil associado ao fornecimento». É só a «Componente Exploração»: exclui a «Componente Conservação» de 65,83 €/ha e a TRH («Às tarifas enunciadas, acresce a taxa de recursos hídricos») (V). |
| coragua-alqueva-baixa-pressao-2026 | 0,0382 €/m³ | 0,0382, mesma p.5, linha «Fornecimento de água em baixa pressão», coluna «Consumos até 100% do volume atribuído» (V) | CONFIRMADO (com qualificadores omitidos) | Valor certo. O 23,94 do excerto é a componente de conservação em €/ha, que o recibo não nomeia. Exclui a TRH. Aplica-se aos beneficiários: os precários pagam 0,0456 (V). |
| coragua-dgadr-eficiencia-2024 | 76 % | 76 %, Anuário DGADR 2024, PDF e folio p.27: «a média do conjunto dos AHs situa-se nos 76%, … mínimos de 8% (Alvor) e máximos de 98% (Alfândega da Fé)» (V) | CONFIRMADO | Valor e sentido certos: é a média dos 33 aproveitamentos inquiridos («abrangeu 33 aproveitamentos hidroagrícolas», PDF p.6), não ponderada pelo volume (I: a fonte não diz «ponderada»). O excerto imprime «E昀椀ciência» (U+6600, U+6900, uma ligadura partida na camada de texto), onde a página impressa diz «Eficiência» (V, imagem renderizada). O texto de incorporação diz «Portugal continental», mas a fonte cobre 33 AHs públicos e não todo o regadio. |
| coragua-ersar-encargo-mensal-2024 | 13,48 € | 13,48, RASARP 2025 vol.1, PDF e folio p.410, Figura 553, rótulo da barra «Abastecimento de água» de 2024 (V, lido na imagem renderizada; a figura não tem camada de texto) | CONFIRMADO | «nível médio de encargos tarifários mensais suportado pelo utilizador final para um consumo de 10 metros cúbicos», Portugal continental, a preços correntes. A nota 87 diz que, desde 2022, inclui o «IVA e a repercussão … (Taxa de Recursos Hídricos…)». O excerto junta o texto do corpo, a legenda e o texto da nota de rodapé 87 como se fosse um parágrafo, e salta um parágrafo sem reticências. Frescura: não encontrei o RASARP 2026 (pesquisa, e o URL adivinhado deu 404; isto não prova nada). |
| coragua-ersar-encargo-metro-cubico-2024 | 1,348 €/m³ | derivado: 13,48 / 10 = 1,348 (V, refeito) | CONFIRMADO (aritmética) | Não é uma tarifa por m³: é o encargo mensal total (fixo, variável, IVA e TRH) a 10 m³ dividido por 10. **A edição inglesa imprime «1,348 euros per m³»**, que um leitor inglês lê como 1 348 euros. |
| coragua-gulbenkian-inquerito-ano | 2019 | 2019, Gulbenkian (março de 2020), PDF e folio p.22: «Calendário: Entrevistas realizadas entre 31 de Julho e 13 de Dezembro de 2019» (V) | CONFIRMADO | O excerto é palavra por palavra (só se juntaram os espaços). |
| coragua-gulbenkian-sem-contador | 71 % | 71 %, p.57: «71% Não tem contador de saída de água (caudalímetro)» (V) | CONFIRMADO | O universo do inquérito é o de agricultores que regam, com explorações de «iguais ou superiores a 5 ha», no continente (p.22). O excerto acaba a meio da frase («representam»). A fonte continua «44% da superfície de regadio]». |
| coragua-gulbenkian-universo-hectares | 5 ha | 5, p.22: «com explorações iguais ou superiores a 5 ha, em Portugal Continental» (V) | CONFIRMADO | É o universo do estudo quantitativo (o qualitativo não tem limite de área). Está certo. |
| coragua-racio-maximo-2026 | 35 vezes | derivado: 1,348 / 0,0382 = 35,29 → 35 (V, refeito) | SENTIDO ERRADO | A aritmética está certa. A definição diz «nível médio de encargos domésticos dividido pela tarifa», mas o «nível médio de encargos» da ERSAR são 13,48 €/mês, e 13,48/0,0382 dá ≈353. Compara um encargo doméstico total de 2024 (com IVA, TRH e parte fixa) com uma componente de exploração de rega de 2026 sem a conservação nem a TRH. «Limite superior» não é um limite: a tarifa «AH Confinantes» de 0,0360 da mesma tabela daria 37. O recibo diz «dados de 2026». |
| coragua-racio-minimo-2026 | 19 vezes | derivado: 1,348 / 0,0706 = 19,09 → 19 (V, refeito) | SENTIDO ERRADO | Os mesmos problemas. «Limite inferior» não é um limite: a tarifa de ponta dos beneficiários (0,0847) dá 15,9 → 16, e a de ponta dos precários (0,1107) dá 12. |
| coragua-tc-auditoria-ano | 2016 | 2016, capa «Relatório n.º 04/2016 - 2.ª Secção», e PDF p.38 (folio 32): «Tribunal de Contas, em 18 de fevereiro de 2016» (V) | CONFIRMADO | O excerto citado (o §214, PDF p.37) não contém o ano. O «p. 37» é a página do PDF, cujo folio impresso é **31**. |
| evora-populacao-2021 | 55 711 | 55 711, INE 0012918, Évora 1C40705, 2021, HM, Total (V, API ao vivo hoje; última atualização 22.06.2026) | CONFIRMADO | «Estimativas anuais da população residente», «Valor estimado». Não há revisão desde o acesso de 10.08.2026. Já existia um período mais recente antes do acesso: 2025 = 58 567 (2024 = 58 661). |
| saldo-natural-portugal-2025 | −34 100 pessoas | INE: **−34 053**, «Estatísticas Vitais – 2025», 30.04.2026, p.1 e §3, e INE BDD 0012432 (Portugal 2025 = −34 053, atualizado a 22.06.2026, sem mudança hoje). PORDATA: «−34.1» em «Individuals – Thousands», atualizado a 2026-08-05 (V) | VALOR ARREDONDADO, SEM FONTE | −34 100 é o −34,1 milhares da PORDATA escrito em pessoas, ou seja, o −34 053 do INE arredondado à centena. Nenhuma fonte imprime «−34 100». O INE não lhe chama provisório; os dados são os «registada[os] nas Conservatórias … até março de 2026» e avisa que há «eventuais revisões dos dados da mortalidade». A linha não tem URL, excerto, data de acesso nem documento. |

## As seis linhas «historico» (conferência leve)

| id | o que o recibo diz que o número é | o link da fonte hoje |
|---|---|---|
| coragua-historico-eficiencia-83 | «o limite inferior da eficiência ponderada pelo volume que a edição arquivada imprimia. Conserva-se como prova da correção, não como valor atual.» | source_url `/estudos/agua-nao-faturada/documento/2026-08-12` → **301 → /estudos/** (200, o índice dos estudos; a passagem não está lá) |
| coragua-historico-eficiencia-85 | «o limite superior da eficiência ponderada pelo volume que a edição arquivada imprimia…» | o mesmo, 301 → /estudos/ |
| coragua-historico-eficiencia-95 | «a eficiência ponderada pelo volume que a edição arquivada imprimia…» | `/estudos/onde-esta-a-agua/documento/2026-08-12` → 301 → /estudos/ |
| coragua-historico-inquerito-2021 | «o ano que a edição arquivada atribuía ao inquérito…» | agua-nao-faturada, 301 → /estudos/ |
| coragua-historico-racio-maximo | «o limite superior do rácio de preços que a edição arquivada imprimia…» | onde-esta-a-agua, 301 → /estudos/ |
| coragua-historico-racio-minimo | «o limite inferior do rácio de preços que a edição arquivada imprimia…» | onde-esta-a-agua, 301 → /estudos/ |

Em nenhum destes seis recibos há link para a edição arquivada (a única ligação a estudos é a do menu, `/estudos`), e todos dizem «Estado da proveniência: Completa». As cópias arquivadas existem no repositório público (`studies-src/_edicoes/*.pt.2026-08-12.html`), o sha256 delas bate certo com o do ledger e as quatro passagens citadas estão lá (V). O leitor é que não tem como lá chegar.

## O que um editor cuidadoso não imprimiria como está (do mais grave para o menos grave)

1. Os rácios 19 e 35 («limite inferior/superior»): os limites não são limites, a definição não bate com as unidades, a comparação mistura coisas diferentes (um total doméstico com IVA e TRH contra uma componente de exploração da rega sem conservação nem TRH) e mistura anos (2024 contra 2026), mas o recibo diz «dados de 2026».
2. A edição inglesa imprime vírgulas decimais: «1,348 euros per m³», «13,48 euros», «0,0706 euros per m³». Um leitor inglês lê o primeiro como 1 348 euros.
3. O saldo natural de −34 100 «pessoas» não tem fonte, e nenhuma fonte o imprime assim: o número do INE é −34 053.
4. Os seis recibos «historico»: o link da fonte vai dar ao índice dos estudos, os recibos não têm link para a edição arquivada e dizem «Proveniência completa».
5. O excerto da DGADR imprime «E昀椀ciência» com glifos partidos.
6. As tarifas do Alqueva são apresentadas como «a tarifa» sem «valor médio», sem «componente exploração» e sem dizer que não incluem a conservação nem a TRH.
7. O TC está localizado na página 37 do PDF (o folio impresso é o 31) e o excerto não contém o 2016. O excerto da ERSAR junta a nota de rodapé ao corpo do texto sem o assinalar.

## O que não conferi
- A média de 76 % recalculada a partir da Tabela 4 da DGADR (a tabela é uma imagem). Não fiz OCR dela.
- Se há edições mais recentes da ERSAR (RASARP 2026), da DGADR (Anuário 2025) ou da EDIA (Edital 2027): não as encontrei pela pesquisa, e os URLs que adivinhei deram 404. Isto não é uma prova de que não existam. O site de listagem da ERSAR deu 404 no caminho que tentei.
- Se a EDIA aplica IVA às tarifas de rega (o edital não o diz).
- A base amostral exata (N) dos 71 % da Gulbenkian (a p.57 não a dá).
- Os números das seis linhas «historico» (fora do âmbito).
