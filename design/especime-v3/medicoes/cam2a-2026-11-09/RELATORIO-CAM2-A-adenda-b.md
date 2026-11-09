# CAM2-A: fecho da adenda B

A implementação está no commit `e6e7c914fddc1e2a5284f507cfe0786815e2d85c`. O build dessa cabeça terminou a zero. A comparação com a base de f362f5ccd, reconstruída no mesmo dia UTC, passou: apenas as duas diferenças autorizadas no número de conferências do Método. Nada foi publicado ou enviado para um ramo remoto.

## Comparação das páginas

- Dia UTC da base e da construção: 2026-11-09.
- Base construída em `2026-11-09T10:44:13.922Z`; cabeça construída em `2026-11-09T11:06:21.555Z`.
- 25304 ficheiros comparados; 25302 iguais byte a byte.
- 9878 páginas HTML. Apenas `metodo/index.html` e `en/method/index.html` diferem, cada uma só no elemento `data-prova="conferencias_da_corrida"`, de 67 para 68.
- Nenhum outro texto, número, ligação, ficheiro novo ou ficheiro apagado. Nenhuma diferença residual de relógio.
- Só `version.json` e `prova.json` foram excluídos, como autoriza a adenda B. Não houve normalização geral de datas ou HTML.

Comando: `python3 scripts/comparar-dist-frases.py dist <temporario>/cam2a-b-comparacao.json`, por `curto.sh`. A base vem de `OEDP_DIST_BASE`. Código 0. As onze plantas da comparação recusam alterações de texto, ligação, campo, número, ficheiro, data ou base fora da autorização.

## Frases, pares e semente

- Frases detetadas: 767 portuguesas e 900 inglesas, 1667 no total, em 115 páginas.
- Registo: 22 entradas bilingues, sustentadas por 21 linhas. Todas foram semeadas por guião em `/o-que-se-discute`, com os pares em `/en/under-discussion`.
- Por registar: 1623, abaixo do teto de 3 000.
- Pares portugueses encontrados: 600; sem par: 167. A cobertura não depende do par.
- Falhas do detetor inglês nos pares: 80 antes e 22 depois. Com as marcas anteriores, eram 647 frases inglesas.
- As 20 plantas reais incluem cinco positivos e cinco negativos por língua. As 21 plantas de estragos do registo, da cobertura e do histórico passaram.
- A semente foi regenerada sobre o dist desta cabeça e os ficheiros comparados byte a byte com `ledger/frases/`: registo e dívida idênticos. Nenhuma entrada foi escrita à mão.

Comandos: `node scripts/gerar-frases-afirmacao.mjs dist <temporario>/cam2a-b-semente-verificada <temporario>/cam2a-b-semente-medidas.json` e `node scripts/medir-frases-afirmacao.mjs dist <temporario>/cam2a-b-medidas.json`, ambos por `curto.sh` através do executor das conferências finais.

A amostra fixa de trinta por língua conserva a seleção por sha256 com a semente `CAM2-A-2026-11-09`. A seleção foi reproduzida e coincidiu exatamente com a da adenda A. A estimativa editorial é 24/30 afirmações substantivas em português e 22/30 em inglês. Classifica a frase; não confirma a sua verdade nem constitui uma régua. As frases e as razões estão nas medidas.

| Estudo ou página | PT | EN | Registo bilingue | Por registar PT | Por registar EN |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 5 | 6 | 0 | 5 | 6 |
| `/agenda` | 2 | 6 | 0 | 2 | 6 |
| `/correcoes` | 22 | 47 | 0 | 22 | 47 |
| `/dossies` | 1 | 1 | 0 | 1 | 1 |
| `/dossies/orcamento-2027` | 40 | 47 | 0 | 40 | 47 |
| `/educacao-e-saude` | 1 | 5 | 0 | 1 | 5 |
| `/emprego` | 1 | 1 | 0 | 1 | 1 |
| `/estado-e-economia` | 3 | 2 | 0 | 3 | 2 |
| `/estudos` | 4 | 5 | 0 | 4 | 5 |
| `/explicacoes` | 1 | 1 | 0 | 1 | 1 |
| `/explicacoes/dinheiro-do-estado-2026` | 3 | 4 | 0 | 3 | 4 |
| `/explicacoes/dinheiro-do-estado-2027` | 5 | 5 | 0 | 5 | 5 |
| `/explicacoes/leitura-da-semana` | 1 | 1 | 0 | 1 | 1 |
| `/habitacao` | 1 | 2 | 0 | 1 | 2 |
| `/indice` | 2 | 2 | 0 | 2 | 2 |
| `/lugares` | 1 | 1 | 0 | 1 | 1 |
| `/metodo` | 4 | 7 | 0 | 4 | 7 |
| `/o-que-se-discute` | 58 | 79 | 22 | 36 | 57 |
| `/pobreza-e-desigualdade` | 1 | 2 | 0 | 1 | 2 |
| `/precos` | 1 | 1 | 0 | 1 | 1 |
| `/privacidade` | 2 | 2 | 0 | 2 | 2 |
| `/salarios-pensoes-e-apoios` | 1 | 3 | 0 | 1 | 3 |
| `/sobre` | 1 | 2 | 0 | 1 | 2 |
| `/temas` | 1 | 1 | 0 | 1 | 1 |
| `a-casa-em-portugal-e-na-europa` | 47 | 75 | 0 | 47 | 75 |
| `agua-nao-faturada` | 18 | 34 | 0 | 18 | 34 |
| `alentejo-algarve` | 1 | 38 | 0 | 1 | 38 |
| `avaliacao-economica-regional-de-portugal-2026` | 11 | 1 | 0 | 11 | 1 |
| `evolucao-de-portugal-desde-1981` | 3 | 1 | 0 | 3 | 1 |
| `evora-2027-capital-europeia-da-cultura` | 83 | 100 | 0 | 83 | 100 |
| `evora-2027-prometido-painel-dinheiro` | 79 | 96 | 0 | 79 | 96 |
| `evora-contas-da-camara-2010-2025` | 36 | 61 | 0 | 36 | 61 |
| `evora-economia-e-dinheiro-publico-de-fora-da-camara` | 26 | 36 | 0 | 26 | 36 |
| `evora-economia-investidores-portas-abertas-2026` | 5 | 2 | 0 | 5 | 2 |
| `evora-orcamentado-pago-devido-2025` | 24 | 35 | 0 | 24 | 35 |
| `evora-os-pelouros-quem-os-teve-o-que-fizeram` | 60 | 3 | 0 | 60 | 3 |
| `evora-prometido-pago-auditado-2026` | 46 | 59 | 0 | 46 | 59 |
| `evora-quem-governou-a-camara-2009-2025` | 42 | 1 | 0 | 42 | 1 |
| `evora-quinze-anos-cinco-mandatos` | 43 | 2 | 0 | 43 | 2 |
| `onde-esta-a-agua` | 22 | 52 | 0 | 22 | 52 |
| `orcamento-2027-o-que-muda-e-para-quem` | 50 | 60 | 0 | 50 | 60 |
| `penalizacoes-por-reforma-antecipada-2026` | 8 | 1 | 0 | 8 | 1 |
| `which-door-is-yours` | 1 | 10 | 0 | 1 | 10 |

## Mecanismos instalados

`check:frases-afirmacao` está no `verify`, distribuído pelo planeador do portão do GitHub. O registo, os excertos, os corpos e os alinhamentos são conferidos pelos guiões instalados. As frases ficam no registo ou na dívida, exatamente na sua língua depois da normalização documentada. Uma reescrita exige registo; uma dívida sem frase atual é recusada.

A dívida inicial está presa pelo sha256 `376011bfe1729cde3f3ca97848c814f1fa39a4c4e72bee8d864d94c2193e0aff`. O guião confere todos os commits que tocaram a lista desde a base e a árvore de trabalho. Recusa aumentos desfeitos posteriormente, reposição depois de apagar a lista, aumentos em merges e histórico superficial. O GitHub usa `fetch-depth: 0`; o caminho local `comitar.sh` confere a lista mesmo com `OEDP_GATE=adiado`. A cobertura completa do dist corre no portão.

A M83 reutiliza `indice_dos_corpos` de `pacote.py`, sem o copiar. Com o motor `9cdd2328e19d0d9854a8ded6da526084d9364ca9`, o `ledger:check` encontrou 795 corpos em 795 linhas com sha256. A conferência do registo encontrou os excertos das 21 linhas de suporte nos corpos. Sem motor, ambos dizem `não leu os corpos` e `limpa=false`; o código zero não é tratado como prova dos corpos.

A aterragem chama `ledger:check` e `check:frases-afirmacao` em comandos próprios e relê `ledger-corpos.codigo` e `frases-afirmacao.codigo` antes da fusão. As plantas de aterragem conferem as duas recusas. O pacote conserva o comportamento anterior.

O âmbito é enumerado pelas coleções, incluindo itens, dossiês, entradas temáticas e correções. As rotas lidas e famílias excluídas estão nas medidas; o README documenta as razões. Ficam fora os recibos, páginas geográficas de indicadores fora das coleções editoriais enumeradas, formulário e respostas funcionais, a rota antiga `texto`, o alias de Método e documentos arquivados datados. O alinhamento é estrutural, com vizinhança de três blocos; não certifica a equivalência semântica da tradução.

## Códigos e limites da verificação

| Conferência | Código |
| --- | ---: |
| `npm run build` | 0 |
| `npm run check:frases-afirmacao`, com motor | 0 |
| `npm run check:frases-afirmacao`, sem motor | 0, corpos não lidos |
| `npm run ledger:check`, com motor | 0 |
| `npm run ledger:check`, sem motor | 0, corpos não lidos |
| `npm run check:pre-mandato` | 0 |
| `npm run typecheck` | 0 |
| `check:voz`, passo do build | 0 |
| `check:paridade`, passo do build | 0 |
| Comparação da adenda B | 0 |

Voz e paridade foram executadas na cadeia `&&` do build concluída a zero, sem uma segunda corrida redundante. Não foi corrida a cadeia inteira de `verify`, o GitHub, os três portões pelo escrivão, a suite do motor ou capturas.

Os guiões Python de `tests/leituras` foram corridos individualmente pelo executor temporário, preservando o ambiente de teste usado por `check:leituras`, com a única exclusão autorizada de `tests/leituras/ferramentas.py`. Esse guião fica delegado ao lugar de direção fora da sandbox, conforme a adenda B; não se atribui código zero a uma execução que não ocorreu aqui.

| Guião de leituras | Código |
| --- | ---: |
| `tests/leituras/apoio_ferramentas.py` | 0 |
| `tests/leituras/at1.py` | 0 |
| `tests/leituras/at1_aterrar.py` | 0 |
| `tests/leituras/at1_partes.py` | 0 |
| `tests/leituras/aterrar.py` | 0 |
| `tests/leituras/briefs-presos.py` | 0 |
| `tests/leituras/comparar-alvos.py` | 0 |
| `tests/leituras/comparar-dist-frases.py` | 0 |
| `tests/leituras/corpos-ledger.py` | 0 |
| `tests/leituras/ferramenta_aterrar.py` | 0 |
| `tests/leituras/ferramenta_fundir.py` | 0 |
| `tests/leituras/ferramenta_modelos_novos.py` | 0 |
| `tests/leituras/ferramenta_pre_voo.py` | 0 |
| `tests/leituras/ferramentas.py` | delegado, não executado |
| `tests/leituras/fila.py` | 0 |
| `tests/leituras/hig6a.py` | 0 |
| `tests/leituras/lancadores_copia.py` | 0 |
| `tests/leituras/listas-de-uma-linha.py` | 0 |
| `tests/leituras/medicoes-pl1.py` | 0 |
| `tests/leituras/pacote-portoes.py` | 0 |
| `tests/leituras/pacote-recibo.py` | 0 |
| `tests/leituras/pacote.py` | 0 |
| `tests/leituras/pl1.py` | 0 |
| `tests/leituras/portoes.py` | 0 |
| `tests/leituras/privacidade-jd1.py` | 0 |
| `tests/leituras/privacidade-rh1b.py` | 0 |
| `tests/leituras/privacidade-rh1c.py` | 0 |
| `tests/leituras/privacidade-rh1d.py` | 0 |
| `tests/leituras/privacidade-rh1e.py` | 0 |
| `tests/leituras/privacidade-segredo.py` | 0 |
| `tests/leituras/tempos.py` | 0 |

As medidas completas estão em `medidas-adenda-b-cam2a.json`, a comparação em `comparacao-adenda-b-cam2a.json` e os excertos dos registos em `conferencias-adenda-b-cam2a.json`. Nenhum contém caminhos locais.

O commit documental de fecho contém apenas estes registos e o relatório. O commit da implementação indicado no início é a cabeça construída e conferida; os metadados do dist não foram recarimbados para fingir uma construção posterior.


## Custo desta retoma

24 chamadas à ferramenta de orquestração, com 30 operações internas de execução
ou recolha, incluindo os dois pedidos de commit e a inspeção final. Foram
42 corridas funcionais: quatro iniciais, 33 dirigidas, um build, uma conferência
autónoma do histórico e três conferências finais. Além disso, uma regeneração
da semente e uma medição; as conferências da lista chamadas pelos dois commits
são pré-voos adicionais. O build durou 738 segundos. Nenhuma corrida inteira
dos portões, nenhuma captura, nenhuma instalação e nenhum ajudante.
