# Pesquisa das fontes: os juros e a dívida do Estado (06.10.2026)

*Pesquisa feita pelo Codex `gpt-6-astra` (xhigh, com rede, só leitura, 221 785 símbolos, das 09:59 às 10:12 UTC de 06.10.2026) a pedido do lugar de direção, pelo mandato `PESQUISA-juros-e-divida-fontes-2026-10-06-mandato.md`, para o brief JD1 e a segunda explicação («Porque é que o Estado se endivida e quanto custa», §1.167). Cada valor é o que a fonte imprime, com o endereço obtido e o estado HTTP; nada foi conferido pelo lugar de direção ainda, e nenhum destes números entra no sítio senão por uma linha do livro-razão selada pelo motor. Sem travessões na prosa do projeto; os travessões que houver no texto abaixo são do relatório da pesquisa.*

# Porque é que o Estado se endivida e quanto custa

Pesquisa em **6 de outubro de 2026**. Há uma revisão relevante: o INE e o BPstat já incorporam setembro; os juros anuais do Eurostat ainda correspondem à atualização de julho. Não misturar essas versões, contabilidade nacional com execução de caixa, nem administrações públicas com o subsetor Estado.

Nas tabelas, as designações entre aspas e os valores em código são excertos literais das fontes. Nas APIs conserva-se o ponto decimal. Os montantes mantêm as unidades publicadas, milhões ou mil milhões de euros, sem conversões ou estimativas. HTTP refere-se ao GET efetivamente realizado, após redirecionamentos. «Último» significa último período confirmado nesta pesquisa.

## 1. Despesa anual com juros e execução de 2026

| ID e publicador | Endereço e localização exata | Formato | Periodicidade | Último período | Valor publicado e unidade | Obtido em | HTTP |
|---|---|---|---|---|---|---|---|
| J1 Eurostat | [API gov_10a_main](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=PT&unit=MIO_EUR&unit=PC_GDP&sinceTimePeriod=2022), «Interest, expenditure» | JSON-stat | Anual | 2025 | 2022: `4608.0` milhões EUR e `1.9`% PIB; 2023: `5553.3` e `2.1`; 2024: `5934.8` e `2.0`; 2025: `5964.5` e `1.9` | 2026-10-06 | 200 |
| J2 Banco de Portugal, fonte INE | [API BPstat](https://bpstat.bportugal.pt/data/v1/domains/172/datasets/55ead4192827e5e6e356bf0246b83467/?lang=PT&series_ids=12645521,12645683&obs_last_n=4&decimal=true), «Juros pagos pelas administrações públicas» | JSON-stat | Anual | 2025 | 2022: `4608` milhões EUR e `1.9`% PIB; 2023: `5553` e `2.1`; 2024: `5983` e `2.1`; 2025: `6028` e `2.0` | 2026-10-06 | 200 |
| J3 INE, PDE, segunda notificação de 2026 | [PDF](https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816377733&att_display=n&att_download=y), quadro 9, p. 12, «Juros», D.41; [XLSX](https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816378100&att_display=n&att_download=y), folhas `2024` e `2025`, E30, «Juros, a pagar (1)» | PDF; XLSX | Anual, revisto nas notificações | 2025, provisório | PDF: 2024 `5 983,4`; 2025 `6 028,2`, milhões de euros. XLSX: E30 guarda `6028.165` em «Milhões de EUR», com formato sem decimais | 2026-10-06 | 200 ambos; repetições sem resposta |
| J4 Entidade Orçamental, portal que sucede à DGO | [SEO agosto, PDF](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf), quadro 1, p. 3; [anexo XLSX](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026_AnexoEstatistico_vPT_VUK.xlsx), `2 - Conta Consol AP`, B37/M37, «Juros e outros encargos» | PDF; XLSX | Mensal, acumulado | Janeiro a agosto de 2026 | `5 218,2` milhões de euros, administrações públicas consolidadas. Comparável de 2025: `4 727,8`. Célula M37: `5218.247559287129` | 2026-10-06 | 200 ambos |

J1: dimensões `freq=A`, `unit=MIO_EUR/PC_GDP`, `sector=S13`, **`na_item=D41PAY`**, `geo=PT`, `time`; atualização `2026-07-21`. J2: séries **12645521** e **12645683**, domínio **172**, conjunto **55ead4192827e5e6e356bf0246b83467**, atualização `2026-09-23`. O parâmetro `decimal=true` preserva a precisão apresentada pelo BPstat.

J3 documenta a revisão na p. 8: linha «Juros», valores `5 964,5` e `6 028,2`, respetivamente nas notificações anterior e atual. A diferença entre J1 e J2 não é apenas arredondamento. A expressão «pagos» da série J2 designa aqui juros em contas nacionais, não uma série de pagamentos de caixa.

**Automatização:** J1 e J2 têm pedidos estáveis, repetíveis semanalmente. J3 tem ficheiros identificados por documento; cada nova edição exige descobrir novos identificadores. Para J4, consultar a [página permanente da SEO](https://www.eo.gov.pt/execucaoorcamental/Paginas/Sintese-da-Execucao-Orcamental-Mensal.aspx), obtida em 2026-10-06, HTTP 200, e seguir o XLSX mais recente. O endereço do ficheiro muda mensalmente.

**Reutilização:** o [Eurostat](https://ec.europa.eu/eurostat/help/copyright-notice) autoriza reutilização comercial e não comercial com indicação da fonte, sujeita às exceções declaradas. O [INE](https://www.ine.pt/ine_novidades/semin/INEWS66/index.html), p. 4, declara «Atribuição 4.0 Internacional (CC BY 4.0)». Ambos: HTML, obtidos em 2026-10-06, HTTP 200. Não confirmei licença específica nos anexos da SEO nem licença geral aplicável a todas as séries BPstat.

## 2. Custo médio e saldo da dívida direta do Estado

| ID e publicador | Endereço e localização exata | Formato | Periodicidade | Último período | Valor publicado e unidade | Obtido em | HTTP |
|---|---|---|---|---|---|---|---|
| C1 IGCP | [Boletim Mensal de setembro](https://www.igcp.pt/sites/default/files/2026-09/BM_set26.pdf), p. 3, gráfico «Custo da dívida direta do Estado» | PDF | Boletim mensal; indicadores anuais/acumulados | Stock: 2025; emissão: 2026 até agosto | «Custo do stock da dívida»: `2,1`%; «Custo da dívida emitida»: `3,4`% | 2026-10-06 | 200 |
| C2 IGCP | [Mesmo boletim](https://www.igcp.pt/sites/default/files/2026-09/BM_set26.pdf), p. 2, «Movimento da dívida direta do Estado», linha «Dívida total», coluna saldo final | PDF | Mensal | 31/ago/26 | `315.856`, «EUR milhões». «Dívida total após cobertura cambial»: `315.850` | 2026-10-06 | 200 |

A nota 6 de C1 define o custo do stock pelo rácio entre juros do subsetor Estado em contas nacionais e saldo médio da dívida direta no final dos anos t e t−1. O Relatório Anual de 2025 (F1, p. 34) usa a expressão «taxa de juro implícita» e indica `2,1%`. O custo de emissão pondera BT, OT, OTRV e MTN pelo montante e maturidade. São indicadores diferentes. O gráfico foi também conferido visualmente; não apresenta custo do stock para 2026.

**Automatização e licença:** PDF diretamente descarregável, com endereço da edição; não confirmei API, CSV ou XLSX estável destes indicadores no IGCP. Não encontrei licença explícita nos documentos consultados.

## 3. Rendibilidade das obrigações a dez anos

| ID e publicador | Endereço e excerto identificador | Formato | Periodicidade | Último período | Valor publicado e unidade | Obtido em | HTTP |
|---|---|---|---|---|---|---|---|
| T1 Banco de Portugal | [API BPstat, série 12099464](https://bpstat.bportugal.pt/data/v1/domains/26/datasets/690b7b36fd36c0dbe249c48cbbc39524/?lang=PT&series_ids=12099464&obs_last_n=2&decimal=true), «Taxa de rendibilidade de obrigações do Tesouro com taxa fixa e prazo residual de 10 anos - mensal» | JSON-stat | Mensal, média | Setembro de 2026 | `"value":["3.54","3.85"]`, «Percentagem»; agosto e setembro, respetivamente | 2026-10-06 | 200 |
| T2 Eurostat | [API irt_lt_mcby_m](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/irt_lt_mcby_m?lang=EN&freq=M&int_rt=MCBY&geo=PT&sinceTimePeriod=2025), «EMU convergence criterion bond yields» | JSON-stat | Mensal | Agosto de 2026 | `"19":3.53700`, percentagem anual | 2026-10-06 | 200 |

T1: domínio **26**, conjunto **690b7b36fd36c0dbe249c48cbbc39524**, atualização `2026-10-02`; metadados identificam **LSEG** como fonte. T2: dimensões **`freq=M`, `int_rt=MCBY`, `geo=PT`, `time`**, atualização `2026-09-11`; não tem dimensão `unit`. Os [metadados Eurostat](https://ec.europa.eu/eurostat/cache/metadata/en/irt_lt_mcby_esms.htm), HTML, 2026-10-06, HTTP 200, dizem «All the yields are expressed in percentages per annum» e descrevem obrigações do governo central no mercado secundário, com maturidade residual próxima de dez anos.

**Automatização:** ambos os pedidos são estáveis e repetíveis semanalmente. **Reutilização:** T2 segue os termos Eurostat acima; em T1, a redistribuição de dados atribuídos à LSEG fica **[verify]**, sem presumir que acesso aberto à API concede licença irrestrita.

## 4. Necessidades de financiamento e emissões

| ID e publicador | Endereço e localização exata | Formato | Periodicidade | Último período | Valor publicado e unidade | Obtido em | HTTP |
|---|---|---|---|---|---|---|---|
| F1 IGCP | [Relatório Anual 2025](https://www.igcp.pt/sites/default/files/2026-08/RA2025_signed.pdf), quadro 9, p. 45, contabilidade orçamental pública | PDF | Anual | 2025 | «NECESSIDADES BRUTAS DE FINANCIAMENTO»: `67 601`; «EMISSÕES DE DÍVIDA NO ANO CIVIL (Dívida Fundada)»: `65 214`, milhões de euros | 2026-10-06 | 200 |
| F2 IGCP | [Programa de financiamento, atualização de 30/09/2026](https://www.igcp.pt/sites/default/files/2026-09/PF20264TPT.pdf), pp. 1 e 2 | PDF | Atualizações trimestrais | Agosto executado; setembro para OT; previsão anual 2026 | «Executado»: `23.9`, «mil milhões euros»; «Necessidades de financiamento do Estado», `2026 P`: `30.6`; texto de setembro: «já emitiu 18,4 mil milhões de euros de OT» | 2026-10-06 | 200 |
| F3 IGCP | [Boletim de setembro](https://www.igcp.pt/sites/default/files/2026-09/BM_set26.pdf), p. 2, linha «Dívida total», campo «Emissões» | PDF | Mensal | Agosto de 2026 | Janeiro a julho: `73.275`; agosto: `5.109`, «EUR milhões» | 2026-10-06 | 200 |
| F4 Entidade Orçamental | [Anexo SEO](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026_AnexoEstatistico_vPT_VUK.xlsx), `6 - R_Est`, B67/F67; `5 - Estado`, B69/F69. [PDF](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf), anexos V e VI | XLSX; PDF | Mensal, acumulado | Janeiro a agosto de 2026 | «Passivos financeiros», receita: `76 027,9`; «Passivos financeiros líquidos de amortizações»: `-1 822,9`, milhões de euros | 2026-10-06 | 200 ambos |

F1 inclui amortizações de dívida fundada; F2 combina emissões brutas de alguns instrumentos com financiamento líquido de outros e movimentos de tesouraria. Não são totais intercambiáveis. F3 publica separadamente os dois intervalos; não se calculou um acumulado adicional. F4 mede receita orçamental de passivos e o respetivo líquido, não apenas emissão de OT. Automatização: F1/F2/F3 exigem novas edições PDF; F4 permite extração XLSX através do índice SEO. Licenças específicas não confirmadas.

## O que a explicação pode dizer com estes números

- «Em 2025, as administrações públicas tiveram uma despesa com juros de 6 028,2 milhões de euros, segundo a revisão do INE de setembro de 2026; o BPstat apresenta 2,0% do PIB.» [J3, J2]
- «Até agosto de 2026, a execução consolidada registava 5 218,2 milhões de euros em juros e outros encargos.» [J4]
- «O custo médio do stock foi 2,1% em 2025; a taxa média de mercado das OT a dez anos foi 3,85% em setembro de 2026.» Não aplicar a segunda taxa a toda a dívida existente. [C1, T1]
- «No final de agosto, a dívida direta do Estado era 315.856 milhões de euros, antes da cobertura cambial.» [C2]
- «O Estado contrai dívida também para substituir dívida que vence: o quadro anual soma necessidades líquidas e amortizações para obter necessidades brutas.» [F1]
- «Até setembro, o IGCP tinha emitido 18,4 mil milhões de euros em OT.» Este valor não representa todo o financiamento do Estado. [F2]

O cliente Eurostat existente pode alimentar **J1 e T2** com os códigos acima. Não se confirmou no Eurostat uma série equivalente aos custos e saldos específicos do IGCP, à execução mensal da SEO ou às emissões brutas apresentadas aqui. Não substituir dívida direta por dívida de Maastricht.

## O que não se encontrou

- As páginas IGCP de [estatísticas](https://www.igcp.pt/pt/investidores/estatisticas) e [boletins](https://www.igcp.pt/pt/investidores/boletim-mensal) devolveram HTTP 200, em 2026-10-06, mas apenas um aviso de acesso. Os PDF citados foram obtidos diretamente. Não se confirmou uma tabela automática «Custo da Dívida» nem edição posterior a setembro.
- [www.dgo.gov.pt](https://www.dgo.gov.pt/): tentativa em 2026-10-06 falhou por certificado TLS incompatível; sem resposta HTTP, código curl `000`. A pesquisa prosseguiu no portal EO. Alguns pedidos repetidos ao INE também terminaram por tempo excedido, após downloads HTTP 200 bem-sucedidos.
- O [catálogo dados.gov.pt da execução da Administração Central](https://dados.gov.pt/api/1/datasets/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/) devolveu JSON, HTTP 200, em 2026-10-06: `"license":"cc-by"`, periodicidade mensal e recurso mais recente de julho de 2026, em XLS. É um endereço estável para descobrir recursos; não é o total das administrações públicas nem estava tão atualizado como J4.
- As [condições de utilização do Banco de Portugal](https://www.bportugal.pt/page/condicoes-de-utilizacao) devolveram HTTP 403 em 2026-10-06. Não se confirmou por essa via a licença de redistribuição de T1.
