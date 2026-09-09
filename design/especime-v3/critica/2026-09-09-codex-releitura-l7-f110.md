# A releitura do leitor de primeira vez ao bloco F1.10 (a régua L7), 09.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 08:42 a 09:02 UTC de 09.09.2026, 170 086 símbolos, sobre as mesmas treze páginas da passagem de 04.09 (`2026-09-04-fable-leitor-no-navegador.md`), construídas da cabeça `31656c8b` do ramo `lugar-2026-09-04` (edição portuguesa, sem guião), com o relatório de 04.09 e as tabelas do §1 e do §7 do brief como contexto; sem plantas, porque é uma contagem e não uma leitura de defeitos. O que conta: 2 das 6 repetições ficam (a segunda, as medidas do país na primeira página e no domínio, é a sobreposição decidida a 07.09 pelo item 8.16, a faixa com as medidas de cabeça dos domínios vivos, e não uma repetição; a terceira, a linha do livro-razão a mostrar o título do documento na página do domínio, é real); das dez mudanças do §7, 2 feitas, 7 em parte e 1 por fazer (a 10, os pequenos). Triagem do lugar de direção para a segunda passagem: o título do estudo a abrir a capa em vez do texto (a decisão do §7.4 diz o texto); «fonte Eurostat» com o título do documento nos blocos do domínio (passa a «publicado por» sem o título); a data de leitura repetida na página da linha; o conflito de Évora entre «N.d. · dezembro de 2025» e «137 dias · 2025» no prazo médio de pagamento; a dobra vazia da região; «livro-razão» ainda no título da própria página do índice; a fila solta de palavras no Método no telemóvel e «vaga» no Método; os cinco pequenos do §7.10; os contadores «1 de 5» e «3 de 10» a dizer que conjunto contam; a definição em palavras da dívida na página do domínio, se a linha a tiver. O que fica como está, por decisão: a busca sem guião leva à lista inteira agrupada (uma página estática não filtra), os selos da manchete do domínio agrupados depois da frase (o teto das três linhas prevalece, §7.7 item 4), as ligações dos cartões a dobras fechadas sem guião (a limitação medida no F1.1c), e os caminhos `/municipios` e `/livro-razao` (identificadores, não nomes).*

---

## The six repetitions

Two of the six remain outside the permitted appearances.

| content | places now | remains? | references |
|---|---|---:|---|
| The 308 municipalities | The complete visible list is on `/municipios`. Home has the permitted search and 29-name map drawer; domain tables are closed and municipality names are links; Évora has “trocar de concelho”. The canonical `/distritos` file was not supplied. | No, within the supplied pages | `built/municipios/index.html:2` — “308 de 308 concelhos”; `built/index.html:1` — “Os nomes no mapa”; `built/dominios/economia-e-financas-publicas/index.html:1` — “Os valores, concelho a concelho”; `built/municipios/evora/index.html:2` — “trocar de concelho →” |
| The 21 country measures | Home now contains five cards, while the domain contains ten full measures. “Saldo das administrações públicas” and “Ganho médio mensal” occur in both, beyond the three exceptions; no 21-measure place remains. | **Yes** | `built/index.html:1` — “1 de 5… Dívida pública… Saldo… Ganho médio mensal”; `built/dominios/economia-e-financas-publicas/index.html:1` — “1 de 10” and the same measures |
| Ledger lines | `/livro-razao` is the single index, but a consumption page still reproduces the publisher and exact document title, which the decision reserved for the line page. | **Yes** | `built/dominios/economia-e-financas-publicas/index.html:1` — “fonte Eurostat · General government gross debt…”; `built/livro-razao/divida-publica-2025/index.html:1` — “Publicado por Eurostat, em General government gross debt…” |
| The 29 territorial units | Home has the permitted map-name drawer and `/municipios` uses the units only as group headings. No additional full copy occurs in the supplied pages. | No | `built/index.html:1` — “Continente… Évora… Madeira… Açores”; `built/municipios/index.html:2` — group headings “Aveiro →… Évora →…” |
| The nine regions | The complete ruler is on `/regioes`; Alentejo has one sealed value and “Comparar as regiões →”, not another ruler. | No | `built/regioes/index.html:2` — “A régua da convergência”; `built/regioes/alentejo/index.html:2` — “77… Comparar as regiões →” |
| Studies | `/estudos` holds the catalogue. Évora contains titles only plus the permitted filtered index door; no synopses accompany those titles. | No | `built/estudos/index.html:1` — “Cada estudo publicado”; `built/municipios/evora/index.html:2` — “Os estudos sobre este concelho… Ver estes estudos no índice →” |

**Count: 2 of 6 repetitions remain.**

## The ten changes

Only two are fully done; seven are partial and one is not done.

| change | state | evidence |
|---|---|---|
| 1. Municipality page | Partly done | The eight-card rail remains and the former duplicate overview is now eight closed readings; “ABRIR/FECHAR” is gone. But card links target closed `<details>` blocks, the definitions are inside those closed bodies, and the payment conflict remains: “N.d.… dezembro de 2025” versus “137… em 2025” with “período de referência 2025-12”. `built/municipios/evora/index.html:2` |
| 2. The two meanings of “fonte” | Partly done | The ledger index and line say “Publicado por”, and the chip beneath the ledger page’s large number is gone. Domain blocks still say “fonte Eurostat” while also displaying a `FONTE` chip. `built/livro-razao/index.html:1` — “Publicado por Eurostat”; `built/livro-razao/divida-publica-2025/index.html:1`; `built/dominios/economia-e-financas-publicas/index.html:1` — “fonte Eurostat” |
| 3. Freshness dates | Partly done | The two freshness strings have left page headers, and measures now say “período de referência”, “lido na fonte a” and “verificado a”. The debt line nevertheless repeats the access date as “lido a 12.08.2026” and “Lido na fonte a 12.08.2026”. `built/dominios/economia-e-financas-publicas/index.html:1`; `built/livro-razao/divida-publica-2025/index.html:1` |
| 4. Studies | Partly done | Empty download sections and the visible “arquivo/trabalhos” catalogue wording are gone. But the title still opens the cover at `/estudos/…`, while “Ler no sítio →” separately opens `/texto`; the cover still carries editions, descriptions and “O que cada porta abre”. Method also still calls them “trabalhos”. `built/estudos/index.html:1`; `built/estudos/evora-orcamentado-pago-devido-2025/index.html:1`; `built/metodo/index.html:2` |
| 5. Menu, footer and hierarchy | Done | All thirteen pages use the same fourteen items in the same order; “Áreas de governo” is distinguishable from “Domínios”, whose index explains “Um domínio é um assunto…; uma área de governo é um ministério.” `built/index.html:1`; `built/dominios/index.html:1` |
| 6. Regions | Done | The full ruler occurs only on `/regioes`, “provisório” is explained there, and Alentejo presents 77 once with the comparison door. `built/regioes/index.html:2`; `built/regioes/alentejo/index.html:2` |
| 7. Domain page | Partly done | The rail and list both contain ten measures; “A leitura de cada medida” is now a real heading; each municipal table has one closed “Os valores…” door. The two headline source chips remain grouped after the whole sentence rather than beside their respective numbers. `built/dominios/economia-e-financas-publicas/index.html:1` |
| 8. Domain index | Partly done | `/dominios` now contains only Economy and the indented “Trabalho” door; the sixteen pending domains moved to Method. Method still prints “primeira/segunda/terceira vaga”, despite “vaga” being meant to leave the reader’s voice. `built/dominios/index.html:1`; `built/metodo/index.html:2` |
| 9. Method on mobile | Partly done | The machinery is now source-ordered as individual boxes such as “FONTES · 18 organismos” and “MOTOR · 2850 linhas atravessadas”. The detached legend row remains: “Portas organismos linhas atravessadas…”. `built/metodo/index.html:2` |
| 10. Small changes | Not done | Évora still has “Proveniência” above navigation, “Évora · 308 · fonte” lacks a noun, chart values remain SVG labels rather than text below, and `[a verificar]` is not defined beside first occurrences. The “9” in “9 regiões” still links to `/regioes#regua`. `built/municipios/evora/index.html:2`; `built/estudos/index.html:1`; `built/regioes/index.html:2` |

## Where a first-time reader stumbles now

1. **Without JavaScript, the Évora search does not perform the promised search.**  
   Home submits `concelho=Évora` to the static `/municipios` page, while its 308 suggestions are in a `hidden` list. The destination HTML still presents all 308 municipalities; filtering is assigned to a script that does not run in this reading.  
   References: `built/index.html:1` — “Escreva o nome do concelho… Procurar” and `<ul class="pesquisa-res" … hidden>`; `built/municipios/index.html:2` — “308 de 308 concelhos”.

2. **Évora still gives mutually incompatible answers for payment time.**  
   The seventh first-screen card says “N.d.” for “dezembro de 2025”. Its corresponding reading says 137 days in 2025 and labels the reference period `2025-12`; the later accounts table also says 137 days.  
   Reference: `built/municipios/evora/index.html:2` — “N.d.… Prazo médio de pagamento” versus “137… período de referência 2025-12”.

3. **The natural study-title route still stops at a cover instead of opening the study text.**  
   The title points to `/estudos/evora-orcamentado-pago-devido-2025`; a separate “Ler no sítio →” points to `/texto`. The resulting cover contains metrics, editions, descriptions and the machinery sentence “O que cada porta abre”, but not the study body.  
   References: `built/estudos/index.html:1`; `built/estudos/evora-orcamentado-pago-devido-2025/index.html:1`.

4. **The debt’s publisher and freshness are recoverable, but “source” still has two meanings and the dates still compete.**  
   The visible measure line names Eurostat, and the ledger makes authorship explicit with “Publicado por Eurostat”; the `FONTE` chip itself is only a door. Dates now have words, but the ledger repeats the read date and presents two “Verificado a” dates, 07.09.2026 and 01.09.2026, distinguished only by the following process descriptions. The domain asks “Quanto deve o Estado?” but supplies no Portuguese definition beyond an English dataset title.  
   References: `built/dominios/economia-e-financas-publicas/index.html:1`; `built/livro-razao/divida-publica-2025/index.html:1`.

5. **The national measure set has no stable visible scope.**  
   Home calls its cards “1 de 5”; the domain calls the same debt card “3 de 10”; the decided 21-measure set is absent. A reader can see that the contexts differ, but neither count states what was excluded.  
   References: `built/index.html:1`; `built/dominios/economia-e-financas-publicas/index.html:1`.

6. **Some things that look like disclosure controls reveal nothing.**  
   An Évora card links to a closed `<details>` element but an ordinary fragment link does not open it without script; the reader must activate the summary separately. Alentejo has a closed “abrir/fechar” disclosure whose body is an empty `<div class="peca-leitura"></div>`.  
   References: `built/municipios/evora/index.html:2`; `built/regioes/alentejo/index.html:2`.

7. **Names and paths still shift while house terminology occupies content positions.**  
   URLs say `/municipios` and `/livro-razao`, while navigation says “Concelhos” and “Números e fontes”; the ledger page itself returns to “livro-razão”. Home’s map drawer offers an unqualified “Évora” leading to `/distritos/evora`, beside a search explicitly for a concelho. The Évora page does clarify its identity, but later labels ordinary exit links “Proveniência”.  
   References: `built/index.html:1`; `built/livro-razao/index.html:1`; `built/municipios/evora/index.html:2`.

## «What is fine»

- The Évora breadcrumb and header clearly say “Concelhos › Évora” and “Concelho · Évora · distrito de Évora · Alentejo Central”. `built/municipios/evora/index.html:2`
- The complete municipal list reports “308 de 308 concelhos · tem página” and groups every entry under a territorial heading. `built/municipios/index.html:2`
- The domain’s rail count and full measure count now agree at ten. `built/dominios/economia-e-financas-publicas/index.html:1`
- The debt line clearly exposes the publisher, series page, returned field, request URL, verification history and correction history. `built/livro-razao/divida-publica-2025/index.html:1`
- The regions index explains both the index’s meaning and the word “provisório”. `built/regioes/index.html:2`
- The dedicated uncertainty page gives `[a verificar]` one clear meaning and says what happens to affected lines. `built/a-verificar/index.html:1`