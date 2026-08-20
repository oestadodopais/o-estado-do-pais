# Registo de relocações · redesenho v3, fase 1

*Regra (resposta 2 da direção à crítica cruzada, 20.08.2026): texto e números só se movem por uma relocação autorizada, escrita antes do movimento. Cada entrada diz a rota de origem, a rota de destino, o componente, o âmbito, a língua, a contagem de ocorrências (origem → destino, por edição) e a linha ou a chave da prova. O rótulo de âmbito visível e o valor movem-se como uma unidade. Não existe a exceção «já existia algures no sítio antigo». Uma frase de maqueta sem rota de origem e sem linha não é relocação: é texto novo, entra pelas cadeias com o seu inglês e fica listada em «Texto novo», para a revisão de voz.*

Estados: **autorizada** (escrita aqui antes da etapa), **feita** (a etapa confirmou as contagens na construção), **recusada** (com o motivo).

## Relocações

| id | origem (rota) | destino (rota) | componente | âmbito | língua | ocorrências (origem → destino) | linha ou chave | etapa | estado |
|---|---|---|---|---|---|---|---|---|---|
| R1 | `/` e `/en`, secção `#numeros`, células `.figura` | `/` e `/en`, o painel (`#painel`), peças Relance e Leitura breve | `figuras.mjs` → `Peca.astro` | País | pt, en | 8 nomes, 8 linhas de medida, 8 frases → 8 + 8 + 8 por edição (a peça aberta repete a frase da peça fechada; sem corte) | `divida-publica-2025`, `posicao-de-investimento-internacional-2025`, `custo-unitario-do-trabalho-2025`, `precos-da-habitacao-2025`, `taxa-de-emprego-2025`, `criancas-em-creche-2025`, `abandono-escolar-precoce-2025`, `sobrecarga-do-custo-da-habitacao-2025` | 2 | autorizada |
| R2 | `/municipios/evora` e `/en/municipalities/evora`, o relance (as oito medidas de `municipios.mjs`) | `/` e `/en`, o painel no âmbito Município = Évora, com o rótulo de âmbito «Évora · município» na mesma unidade | `municipios.mjs` → `Peca.astro` | Município (Évora) | pt, en | 8 → 8 + 8 (duplicação autorizada; a página do município mantém as suas) | `evora-populacao-2025`, `evora-poder-de-compra-2023`, `evora-desemprego-registado-2024`, `evora-empresas-2024`, `evora-divida-dgal-2024`, `evora-indice-de-divida-2024`, `evora-execucao-da-receita-2025`, `evora-prazo-medio-de-pagamento-2025` | 2 | autorizada |
| R3 | `/` e `/en`, secção `#mapa` (Instrumento n.º 2): a contagem da CAOP, as contagens por parcela, a legenda de cobertura, a frase «O que o mapa não diz», a fonte e a data de leitura | `/` e `/en`, a ficha do mapa na cabeça (âmbito País e escolha de concelho) | `InstrumentoMapa.astro` → `MapaRespira.astro` | País | pt, en | 1 → 1 por edição (a secção sai; a ficha entra) | `municipios-portugal-caop-2025`, `municipios-continente-caop-2025`, `municipios-acores-caop-2025`, `municipios-madeira-caop-2025`; chaves `municipios_com_pagina`, `municipios_total` | 2 | autorizada |
| R4 | `/` e `/en`, secção `#convergencia` (Instrumento n.º 1): a frase de cada região e as distâncias | `/` e `/en`, a banda da região (âmbito Região) e o Instrumento n.º 1 no âmbito País | `regioes.mjs` → `BandaDaRegiao.astro`, `InstrumentoConvergencia.astro` | País, Região | pt, en | 6 frases → 6 (País) + 1 por região escolhida | `pib-pc-portugal-2024`, `pib-pc-grande-lisboa-2024`, `pib-pc-peninsula-de-setubal-2024`, `pib-pc-algarve-2024`, `pib-pc-madeira-2024`, `pib-pc-alentejo-2024`; `distancia-portugal-ue27-2024`, `distancia-grande-lisboa-ue27-2024`, `distancia-peninsula-de-setubal-ue27-2024`, `distancia-algarve-ue27-2024`, `distancia-madeira-ue27-2024`, `distancia-alentejo-ue27-2024`, `distancia-setubal-grande-lisboa-2024` | 2 | autorizada |
| R5 | `/` e `/en`: os textos das secções Municípios, Estudos e Agenda da página v2 | cortados: as portas de uma linha levam só contagens com porta; os textos vivem nas páginas próprias | `HomeView.astro` → `Portas.astro` | País | pt, en | 1 → 0 por edição | chaves `municipios_com_pagina`, `municipios_total`, `estudos`, `edicoes`, `agenda_em_curso`, `agenda_a_seguir`, `agenda_concluido`, `agenda_retirado` | 2 | autorizada |
| R6 | `/municipios/evora`: a frase de abertura («Esta página mede o município de Évora e mostra de onde vem cada medida. Não interpreta: …») | `/` no âmbito Município = Évora, como lede | `municipios.mjs` → `Cabeca.astro` | Município (Évora) | pt, en | 1 → 1 + 1 (duplicação autorizada) | sem número | 2 | autorizada |

## Recusadas, ou não relocadas de propósito

| o quê | porquê |
|---|---|
| A nota do lede de Évora da maqueta («Oito medidas. Seis vêm de organismos…») | contagens por extenso, estado escrito (`DECISIONS.md` §4, item das contagens em palavras); fica na página do município, onde já está registada como dívida da fase da voz |
| As frases curtas das peças Relance da maqueta (`SHORT_REL`: «Acima do limiar do painel europeu, e a descer.», etc.) | são cortes das frases existentes, isto é, frases novas; a peça leva a frase existente por inteiro (R1). Se a direção quiser as curtas, é chamada editorial e entra por «Texto novo» |
| As distâncias «+29,7 · −15,2 · +12,3 · +8,6», «+11,47», «−44,5» e a «+29,7» do telemóvel | não têm linha; decisão (e) do plano |
| «Total 308 · [a verificar]» da ficha do mapa | o marcador saiu das linhas da CAOP a 18.08; a contagem rende com o selo cheio |
| «Publicação: 2026-08-12» nas linhas de estudo cuja data é `null` | rende `[a verificar]`, nunca a data `updated` (etapa 4e) |
| «61,44%» com o símbolo dentro do valor | o símbolo fica fora do elemento (regra do `data-claim`) |
| A paráfrase do Sobre e «A direção é de Nuno dos Santos» no rodapé; o colofão «Maqueta v3 · protótipo · tipos substitutos»; «Protótipo: um toque num bloco muda só a densidade dele» | rodapé só navegação (15.08); estados de protótipo são recusados pelo portão |
| O quadrado de cobalto do sinal de tempo no cabeçalho | Emenda 1: cor só para limiares publicados |

## Texto novo (sem rota de origem; entra pelas cadeias, PT e EN no mesmo commit; revisão de voz antes da fusão)

Preenchido por cada etapa, chave a chave, em `CHAVES-EN.md`. Na etapa 0 sabe-se já que entram: a frase-título por âmbito com a contagem por chave da prova; os rótulos de âmbito e densidade; as palavras de estado e de cobertura; a frase de neutralidade do mapa («O ponto aceso marca cobertura editorial, não qualidade nem importância», que já existe como `instr2.coberturaV` e pode ser relocada em vez de reescrita, R3); o estado vazio de um concelho sem página; os rótulos das portas de uma linha; a marca de água do recibo (as palavras do marcador); a linha constante do cartão de partilha.
