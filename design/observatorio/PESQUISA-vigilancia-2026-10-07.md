# O desenho do varrimento diário de vigilância: as fontes, os buscadores, o índice e o resumo (pesquisa de 07.10.2026)

**1. As fontes do varrimento**

O principal problema não é descobrir páginas: é garantir cobertura, conservar prova e distinguir acesso de autorização para reprodução. Um varrimento diário não oferece vigilância em tempo real; um RSS curto pode perder entradas entre corridas; uma cópia acessível não fica automaticamente licenciada para alojamento público.

Foram lidos `CLAUDE.md`, §1.181 de `DECISIONS.md`, carta §8, política da autonomia com a emenda de 07.10, mapa, cliente HTTP, corredor e fluxos do GitHub. Não foram escritos ficheiros.

**Todas as ligações e sondas abaixo foram consultadas em 07.10.2026.** D significa consulta diária proposta; S, semanal. A publicação é por acontecimento, salvo indicação contrária. «Lê» significa que o cliente recebeu conteúdo sem executar JavaScript, não que já exista um buscador especializado. `[verify]` identifica o que falta confirmar.

| Fonte | Endereço | Formato e conteúdo | Periodicidade | Licença ou termos | Cliente da casa | Risco |
|---|---|---|---|---|---|---|
| DAR | [I Série](https://www.parlamento.pt/DAR/Paginas/DAR1Serie.aspx), [dados abertos](https://www.parlamento.pt/Cidadania/Paginas/DAdar.aspx) | HTML, PDF; catálogo estruturado e `DAR.xsd` | Após sessões; D | Dados abertos reutilizáveis com atribuição | Lê listagens; PDF descarregável | Atraso editorial; catálogo estruturado incompleto |
| Iniciativas parlamentares | [Catálogo](https://www.parlamento.pt/Cidadania/Paginas/DAIniciativas.aspx) | `IniciativasXVII.xml`, `IniciativasXVII_json.txt`; documentos associados | D; frequência atual não declarada | Atribuição à AR | Ligações descobertas sem JavaScript | Ficheiro cumulativo; alterações retroativas |
| Intervenções parlamentares | [Catálogo](https://www.parlamento.pt/Cidadania/Paginas/DAIntervencoes.aspx) | `IntervencoesXVII.xml`, `IntervencoesXVII_json.txt` | D | Atribuição à AR | Catálogo legível | Metadados não substituem transcrição |
| Governo, Conselho de Ministros | [Comunicados](https://portugal.gov.pt/gc25/governo/comunicados-do-conselho-de-ministros) | HTML, conferências associadas | Por reunião; D | [Aviso legal](https://portugal.gov.pt/pt/gc25/aviso-legal) não esclarece espelhamento | Recebe estrutura, sem lista de comunicados | Listagem dinâmica; interface pública `[verify]` |
| Governo, discursos | [Intervenções](https://portugal.gov.pt/pt/gc25/comunicacao/intervencoes) | HTML; RSS `[verify]` | D | Reutilização integral `[verify]` | Página sem intervenções na resposta inicial | JavaScript; mudança de plataforma |
| Diário da República | [RSS I](https://files.diariodarepublica.pt/rss/serie1-html.xml), [RSS II](https://files.diariodarepublica.pt/rss/serie2-html.xml) | XML com ligações; HTML/PDF dos atos | Diários publicados; D | Textos oficiais; distinguir anexos de terceiros | Ambos os RSS passaram | Portal devolveu exigência de JavaScript; ficheiros RSS funcionam |

A AR autoriza reutilização com atribuição e declara atualização **mensal das legislaturas anteriores**; não encontrei compromisso equivalente para a atual. Os endereços de descarga incluem parâmetros opacos: descobrem-se pelo catálogo, não se reconstroem. O catálogo DAR consultado mostrava apenas «Sessão 01» da XVII, enquanto a página PDF já continha a segunda sessão. Nesta, o diário de 26.09 só ficou disponível em 06.10. [Dados abertos](https://www.parlamento.pt/Cidadania/Paginas/DadosAbertos.aspx), [DAR I](https://www.parlamento.pt/DAR/Paginas/DAR1Serie.aspx).

Os dez partidos abaixo constam da [composição parlamentar](https://www.parlamento.pt/DeputadoGP/Paginas/GruposParlamentaresI.aspx). A cobertura deve incluir comunicados, propostas e intervenções, sem confundir notícias partidárias com prova independente.

| Fonte | Endereço | Formato e conteúdo | Periodicidade | Licença ou termos | Cliente da casa | Risco |
|---|---|---|---|---|---|---|
| PSD | [Comunicados](https://www.psd.pt/pt/comunicados) | HTML; RSS `[verify]` | D, se autorizado | [Termos](https://www.psd.pt/index.php/pt/termos-e-condicoes-de-utilizacao) exigem autorização escrita para recolha automática | HTML recebido | **Excluir até autorização** |
| PS | [RSS](https://ps.pt/feed/), [comunicados](https://ps.pt/informacao/comunicados/) | XML/HTML | D | Arquivo/reutilização `[verify]` | Ambos legíveis | RSS limitado |
| Chega | [Sítio](https://partidochega.pt/) | Formatos e RSS `[verify]` | D pretendida | `[verify]` | Respondeu 403 | Bloqueio; não contornar |
| IL | [Sítio](https://iniciativaliberal.pt/), [RSS](https://iniciativaliberal.pt/feed/) | HTML; RSS vazio | D | `[verify]` | HTML legível | RSS verde com zero entradas |
| LIVRE | [Comunicados](https://partidolivre.pt/comunicados), [RSS](https://partidolivre.pt/feed) | HTML/XML | D | `[verify]` | Ambos legíveis | RSS não cobre os comunicados observados |
| PCP | [RSS](https://www.pcp.pt/rss.xml) | XML; intervenções e notas no sítio | D | `[verify]` | RSS legível | Janela curta |
| CDS-PP | [Sítio](https://www.cds.pt/) | HTML; RSS `[verify]` | D | `[verify]` | HTML recebido | Conteúdo gráfico; extração por provar |
| BE | [Notícias](https://bloco.org/noticias) | HTML; RSS `[verify]` | D | `[verify]` | Lista legível | Distinguir posição oficial de conteúdo ligado |
| PAN | [RSS](https://www.pan.com.pt/feed/) | XML/HTML | D | `[verify]` | RSS legível | Mistura atividade nacional e regional |
| JPP | [Comunicados](https://juntospelopovo.pt/comunicados/) | HTML; RSS `[verify]` | D | `[verify]` | Lista legível | Página pesada |

| Imprensa | Endereço | Formato | Periodicidade | Termos | Cliente da casa | Risco e decisão |
|---|---|---|---|---|---|---|
| Lusa | [Sítio](https://www.lusa.pt/), [robots](https://www.lusa.pt/robots.txt) | HTML; RSS público `[verify]` | Contínua; D | [Cópia requer autorização](https://www2.lusa.pt/terms-and-conditions) | Robots legível | `/article/` vedado ao agente genérico; intervalo de 120 segundos |
| Reuters | [Entrega licenciada](https://reutersagency.com/content-delivery-platforms/content-delivery), [robots](https://www.reuters.com/robots.txt) | RSS contratual | Contínua; D | [Licenciamento](https://www.reutersconnect.com/general-terms) | Não ensaiar artigos bloqueados | Recolha automática proibida sem consentimento |
| Público | [RSS](https://feeds.feedburner.com/PublicoRSS), [robots](https://www.publico.pt/robots.txt) | XML | Contínua; D | [Direitos reservados, exceções legais](https://api-cdn.publico.pt/nos/termos-e-condicoes) | RSS passou; robots 403 | Permissão automática `[verify]`; sem espelho integral |
| Observador | [RSS](https://observador.pt/feed/), [robots](https://observador.pt/robots.txt) | XML/HTML | Contínua; D | [Uso privado e consentimento](https://observador.pt/termos-e-condicoes/) | RSS passou | Robots admite caminhos públicos; isso não licencia arquivo público |
| Expresso | [Sítio](https://expresso.pt/), [robots](https://expresso.pt/robots.txt) | HTML/sitemaps; RSS `[verify]` | Contínua; D | [Impresa restringe reprodução](https://perfil.impresa.pt/ajuda/termos-de-utilizacao) | Página 403 | Robots varia por agente; acesso e arquivo por resolver |
| Diário de Notícias | [Sítio](https://www.dn.pt/), [robots](https://www.dn.pt/robots.txt) | HTML/sitemaps; RSS `[verify]` | Contínua; D | [Direitos reservados](https://www.dn.pt/termos-de-utilizacao) | HTML recebido | Robots permite `/`; espelhamento não autorizado |
| Jornal de Notícias | [Robots](https://www.jn.pt/robots.txt) | Sitemaps; RSS `[verify]` | Contínua | Proibição expressa de navegação automática | Só política consultada | **Excluir sem licença**, apesar das permissões técnicas parciais |
| RTP | [RSS País](https://www.rtp.pt/noticias/rss/pais), [Economia](https://www.rtp.pt/noticias/rss/economia), [robots](https://www.rtp.pt/robots.txt) | XML, texto, áudio/vídeo | Contínua; D | [Armazenamento para uso pessoal](https://media.rtp.pt/rgpd/termos-e-condicoes/) | RSS passaram | Vigiar via feed; publicação e arquivo institucional precisam de fundamento |

**Ler para descobrir não equivale a copiar para publicar.** Feeds públicos não conferem uma licença geral. Onde os termos não autorizam claramente o arquivo pretendido, conservar apenas o permitido, seguir a ligação até à fonte primária e marcar o recibo incompleto.

| Estudos | Endereço | Formato e conteúdo | Periodicidade | Licença ou termos | Cliente da casa | Risco |
|---|---|---|---|---|---|---|
| Banco de Portugal | [Publicações](https://www.bportugal.pt/publicacoes) | Boletins, estudos, relatórios; RSS `[verify]` | Conforme série; S | `[verify]` | Página respondeu 403 | Reputação/IP; não prometer acesso |
| CFP | [Publicações](https://www.cfp.pt/pt/publicacoes) | HTML/PDF; previsões, execução, setores | Conforme relatório; S | Espelhamento `[verify]` | Lista legível | Paginação; RSS não confirmado |
| UTAO | [Publicações](https://www.parlamento.pt/OrcamentoEstado/Paginas/UTAO_UnidadeTecnicadeApoioOrcamental.aspx) | Pastas HTML/PDF; orçamento e execução | Conforme calendário orçamental; S | Termos específicos `[verify]` | Pastas legíveis | Não herdar automaticamente licença dos dados abertos |
| FFMS | [Estudos](https://ffms.pt/pt-pt/estudos) | HTML/PDF | Irregular; S | [Autorização para conteúdos protegidos](https://ffms.pt/pt-pt/termos-e-condicoes-de-utilizacao) | Passou com perfil TLS existente `seclevel1` | Perfil normal deu 403 |
| ICS, Universidade de Lisboa | [Policy briefs](https://www.ics.ulisboa.pt/pubtab/policy-brief) | HTML/PDF; sociedade e políticas | Irregular; S | Por documento `[verify]` | Lista legível | RSS `[verify]` |
| Iscte, Observatório das Desigualdades | [Publicações](https://www.observatorio-das-desigualdades.com/e-working-papers-od/), [RSS](https://www.observatorio-das-desigualdades.com/feed/) | HTML/PDF/XML | Irregular; S | Por documento `[verify]` | RSS passou | Última entrada recebida de junho |
| CES, Coimbra | [Publicações](https://www.ces.uc.pt/pt/publicacoes), [feeds](https://www.ces.uc.pt/pt/rss) | HTML/PDF; RSS de destaques/eventos | Conforme coleção; S | Por publicação `[verify]` | Listas legíveis | Feed de eventos não é catálogo de estudos |
| Nova SBE, Economics for Policy | [Publicações](https://economicsforpolicy.novasbe.pt/publications/) | HTML/PDF; estudos e notas | Irregular; S | Por documento `[verify]` | Lista legível | RSS `[verify]` |
| OCDE | [Portugal](https://www.oecd.org/en/countries/portugal.html) | HTML/PDF; estudos económicos e temáticos | Conforme série; S | [Maioria desde julho de 2024: CC BY 4.0](https://www.oecd.org/en/about/terms-conditions.html) | Cliente recebeu 403 | Confirmar licença de cada obra; RSS `[verify]` |
| FMI | [Portugal](https://www.imf.org/en/Countries/PRT), [RSS anunciado](https://www.imf.org/en/social-hub) | Relatórios, Article IV, estudos | Conforme publicação; S | [Cópias sistemáticas exigem autorização](https://www.imf.org/en/about/copyright-and-terms) | Compatibilidade e endereço RSS `[verify]` | Não ativar descarga sistemática |
| Comissão Europeia | [Relatório Portugal](https://economy-finance.ec.europa.eu/economic-surveillance-eu-member-states/country-pages-including-country-reports/country-report-portugal_en) | HTML/PDF; Semestre Europeu | Anual; S | [Reutilização com condições](https://european-union.europa.eu/legal-notice_en) | Página passou | Outros estudos exigem catálogo adicional |
| Eurostat | [RSS de atualizações](https://ec.europa.eu/eurostat/api/dissemination/catalogue/rss/en/statistics-update.rss) | XML; alterações de conjuntos | Atualizações; D | [Reutilização com atribuição e exceções](https://ec.europa.eu/eurostat/about-us/communicating-disseminating-statistics) | Passou | Filtrar códigos; não duplicar corredor |

Dos calendários, falta sobretudo ligar cada anúncio ao documento ou conjunto correto. INE e Eurostat já têm leitores em `indicators/calendario.py`. Acrescentaria o [calendário BPstat](https://bpstat.bportugal.pt/api/media/files/Calendario_BPstat_dominio.html) apenas para fontes novas. O RSS Eurostat anuncia alterações ocorridas, não datas futuras.

| Audiovisual | Endereço | Formato | Periodicidade | Termos | Cliente | Risco |
|---|---|---|---|---|---|---|
| Parlamento | [Arquivo audiovisual](https://av.parlamento.pt/) | Vídeo por reunião/intervenção | Por sessão; D | Descarga/reutilização `[verify]` | Página recebida; ficheiros por ensaiar | Reprodução dinâmica; identificação de interveniente |
| Governo | [Canal oficial ligado pelo portal](https://www.youtube.com/channel/UCOE-JsBcVf4__OlrsiW59EQ) | Vídeo; legendas quando existentes | Por publicação; D | Plataforma e direitos do vídeo | Transcrição automática ainda por provar | Não presumir legendas nem autorização de descarga |

**2. O buscador diário como guião, sem modelo**

Proponho `python3 -m vigilancia.diario`, nome novo para não confundir com o `varrimento.yml` existente, que é mensal.

O registo de fontes declara endereço, formato, cadência, política de acesso, permissão de arquivo e publicação, seletores e limites. O guião:

1. Confere políticas e consulta índices com validadores HTTP.
2. Descobre novidades e revisões por identificador, ligação e conteúdo; percorre paginação até ao último ponto conhecido.
3. Obtém documentos permitidos com `core.http.HttpClient`, usando `CASA_UA = OEstadoDoPais/corredor`, sem identidade de navegador.
4. Arquiva bytes antes da extração, regista pedido, resposta, data, redirecionamentos e sha256.
5. Escreve `AAAA-MM-DD.json` e resumo textual determinístico.

Cada entrada contém `fonte`, `titulo`, `data_publicacao`, `data_recolha`, `ligacao`, `excerto`, `sha256`, `arquivo`, `localizador` e `tipo`: declaração, iniciativa, comunicado, estudo ou notícia. Junta estado de direitos, revisão e cobertura. Um erro não pode transformar-se em «sem novidades».

O cliente já oferece pedidos condicionais e sha256; **o alojamento persistente pertence ao corredor/guiões**, não acontece em qualquer chamada HTTP. Reutilizar esse arquivo, distinguindo acesso privado de cópia pública.

No motor, `corredor.yml` agenda 06:10 UTC; a segunda corrida está comentada. `vigia.yml` verifica a execução; `painel.yml` é semanal. Acrescentaria um trabalho independente no fluxo diário, sem reconstruir o sítio, com estado próprio observado pelo vigia. Os interruptores remotos atualmente ativos ficam `[verify]`: ler YAML não prova execução.

**3. A afirmação e o seu recibo**

Uma declaração precisa de texto literal, pessoa e cargo ou partido documentados, data do ato, data de publicação, documento, página ou intervalo temporal, cópia autorizada, pedido e sha256. Guardar também o contexto adjacente evita transformar uma condição numa promessa absoluta.

O sha256 demonstra integridade dos bytes capturados; não demonstra sozinho autoria, autenticidade ou verdade.

O confronto referencia linhas existentes do livro-razão e declara medida, unidade, território, população, período e versão estatística. Uma coincidência de palavras não basta. Sem correspondência, o estado é «não comparável» ou «evidência insuficiente».

A casa já dispõe de `excerpt`, `source_url`, `document.locator`, origens e verificações de transcrição em `publisher/export_site_rows.py`. Falta a entidade «afirmação», a selagem da passagem exata e a relação explícita entre afirmação e linhas comparáveis. Conclusão, recomendação e opinião pertencem à direção, separadas da citação.

**4. O custo e a cadência**

Medições desta pesquisa: RSS RTP País e Economia, juntos, **92 952 bytes**; RSS das duas séries do DR, **176 284 bytes**. São instantâneos, não médias diárias.

Cenário de dimensionamento, com **hipóteses**, não medições:

| Parcela diária | Conta |
|---|---|
| Pedidos | 24 índices + 50 documentos + 6 verificações = **80** |
| Corpos | 24 × 0,1 MB + 45 × 0,2 MB + 5 × 2 MB = **21,4 MB** |
| Execução | 80 × 2 segundos + 60 segundos de preparação = **3,7 minutos** |
| Modelo | 2500 símbolos de resumo + 500 de instruções + 500 de resposta = **3500** |
| Modelo, 30 dias | 30 × 3500 = **105 000 símbolos** |

PDF grandes, ficheiros parlamentares cumulativos, recusas e instalação de dependências podem ultrapassar o cenário. Medir pedidos, bytes e minutos reais; preço marginal das contas `[verify]`.

«Símbolos» deve seguir o contador de tokens do projeto, não caracteres. O guião gasta zero símbolos de modelo. **O modelo lê só o resumo para triagem**; investigar uma peça selecionada exige consultar provas, num orçamento editorial separado.

Declarações e notícias: D. Estudos: S, com exceção de divulgações calendarizadas relevantes. Recuperar intervalos perdidos por paginação/sitemap permitido; se impossível, declarar cobertura parcial.

Para transcrição local, [whisper.cpp](https://github.com/ggml-org/whisper.cpp) permite uma solução sem tarifa por minuto. Uma hora a 64 kbit/s representa 28,8 MB; é hipótese de codificação. Tempo de processamento = duração × fator medido na máquina; fator, energia e revisão `[verify]`. Exige áudio autorizado, marcações temporais e conferência auditiva dos números e palavras citados.

**5. Os riscos e as recusas**

O [CDADC](https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1985-34475475), artigos 7.º, 75.º e 76.º, distingue discursos, informação factual e obras protegidas. A citação tem de ser justificada e atribuída; não existe um número universal de palavras permitido. A exceção de prospeção pode ser reservada pelo titular. Não assumir que este projeto beneficia da exceção própria de organismos de investigação.

Não prometer «zero dados pessoais»: atribuir uma declaração já envolve identificação pessoal. Limitar ao ato público necessário, excluir contactos, comentários de leitores e vida privada; fundamento e retenção precisam de definição, conforme o [RGPD](https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:32016R0679).

A direção aceitou exposição legal; isso não elimina obrigações. A [Lei de Imprensa](https://diariodarepublica.pt/dr/detalhe/lei/2-1999-196218) prevê identificação editorial e direitos de resposta e retificação. A classificação concreta do sítio continua `[verify]`. Preservar resposta junto da peça, correção datada e comprovativo de receção, sem reintroduzir aprovação humana prévia contrariando a emenda.

Recusar bloqueios contornados, identidades falsas, recolha proibida e publicação automática pelo simples aparecimento no índice. O bloqueio do INE já documentado no motor exige serialização e recuo, não rotação de IP. Conteúdo recolhido é prova potencial, nunca instrução para o sistema. Não chamar jornalista à IA, escrever para alcance ou nomear alguém por rumor.

**6. O primeiro passo, concreto**

Briefar **Parlamento, DAR I e iniciativas, mais RSS da I Série do DR**. São três entradas operacionais de duas fontes primárias: declarações documentadas, propostas e atos publicados. O Governo fica para o bloco seguinte, porque a listagem dinâmica ainda não está resolvida.

Entregar apenas o guião, registo dessas entradas, arquivo por sha256, índice diário e resumo. Teto proposto para uma corrida incremental: **30 pedidos, 10 MB e cinco minutos**, com excedentes em fila e cobertura declarada. A primeira carga histórica fica fora desse teto.

Aceitação: novidade descoberta, revisão conservada, repetição sem duplicação, falha visível e citação localizada no documento. Plantar cinco defeitos: excerto alterado, autoria trocada, data errada, corpo truncado e falha apresentada como vazio; leitura a frio por outra família.

Custo-alvo de construção: **300 000 símbolos**, repartidos como orçamento proposto entre implementação, provas e correções, com leitura independente contabilizada separadamente. A primeira entrega deve permitir à direção escolher uma afirmação e abrir a sua prova. Nenhuma interface nova é necessária para começar.