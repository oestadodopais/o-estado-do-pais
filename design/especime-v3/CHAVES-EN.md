# As chaves novas, PT → EN · redesenho v3, fase 1

*Cada etapa acrescenta aqui as chaves que criou em `src/i18n/strings.mjs`, com o português e o inglês lado a lado, no mesmo commit em que as cria. `assertKeyParity()` falha a construção se as duas línguas não tiverem as mesmas chaves; o que ela não vê, e este ficheiro mostra, é se o inglês foi pensado ou copiado. A lista inteira vai à direção para revisão de voz antes da fusão; a revisão de voz não desbloqueia nenhuma construção, e uma palavra mudada depois é uma cadeia, não uma etapa.*

## O vocabulário de estado, decidido uma vez (proposta da etapa 0, enviada à direção antes da etapa 2)

| chave | pt | en | nota |
|---|---|---|---|
| `estado.foraDoLimiar` | fora do limiar | outside the threshold | «outside» e não «above»: a posição de investimento ultrapassa o seu limiar por baixo (−35 é um chão), e «fora» cobre os dois sentidos |
| `estado.dentroDoLimiar` | dentro do limiar | within the threshold | |
| `estado.semLimiar` | sem limiar | no threshold | |
| `estado.porConfirmar` | por confirmar | unconfirmed | o marcador `[a verificar]` fica em português nas duas edições (decisão da página do marcador); esta é a palavra do estado, não o marcador |
| `cobertura.temPagina` | tem página | has a page | |
| `cobertura.semPaginaAinda` | sem página ainda | no page yet | já existe como `municipios.semPagina`; passa a ser a única cadeia de cobertura |

## Por etapa

### Etapa 1
**Uma chave nova, e só uma.** As subetapas 1a a 1d mudaram a letra, os tokens, o cabeçalho, o rodapé e o selo sem escrever uma palavra nova em nenhuma das duas edições; a 1e acrescentou `nav.menu`, e mais nada. As outras chaves de que a etapa precisou já existiam todas:

| chave | pt | en | onde foi usada |
|---|---|---|---|
| `nav.inicio` · `nav.municipios` · `nav.estudos` · `nav.livro` · `nav.agenda` · `nav.metodo` · `nav.sobre` | Início · Municípios · Estudos · Livro-razão · Agenda · Método · Sobre | Home · Municipalities · Studies · Ledger · Agenda · Method · About | a navegação do cabeçalho, agora rendida de uma lista de chaves de rota |
| `nav.correcoes` | Correções | Corrections | **já existe**, e é o oitavo item do cabeçalho no dia em que a decisão (a) chegar. Nenhuma cadeia nova é precisa para essa decisão: só uma linha de `Masthead.astro` |
| `prov.selo` | fonte | source | a palavra do selo, sem mudança |
| **`nav.menu`** | **Menu** | **Menu** | **chave nova (subetapa 1e)**: o comando que abre a navegação no telemóvel. Identidade aceite, e a razão está na lista abaixo |

Conferido: `assertKeyParity()` atira a cada `t()` e a construção está verde, o que quer dizer que as duas edições continuam com as mesmas chaves.

A ficha técnica pública da letra (a linha «A letra» do Método, plano §12) traria cadeias novas nas duas edições, e **não entra nesta etapa**: é texto governado e espera a palavra da direção.

### Etapa 2

**2a · o vocabulário de estado e o de cobertura.** As seis cadeias da proposta da etapa 0 entram tal como foram decididas, sem uma palavra mudada, e passam a viver no topo de `strings.mjs` (e não dentro de `home`), porque a mesma palavra tem de sair igual na primeira página, no índice dos concelhos e na página de um concelho.

| chave | pt | en | onde foi usada |
|---|---|---|---|
| `estado.foraDoLimiar` | fora do limiar | outside the threshold | a fila de estados e a palavra de estado das peças (2b, 2c) |
| `estado.dentroDoLimiar` | dentro do limiar | within the threshold | o mesmo |
| `estado.semLimiar` | sem limiar | no threshold | o mesmo |
| `estado.porConfirmar` | por confirmar | unconfirmed | a palavra do estado; o marcador `[a verificar]` continua em português nas duas edições |
| `cobertura.temPagina` | tem página | has a page | `/municipios`, a legenda do mapa, a ficha do mapa, os resultados da pesquisa |
| `cobertura.semPaginaAinda` | sem página ainda | no page yet | `/municipios`, a legenda do mapa, o estado vazio de um concelho |

**Saíram cinco chaves, nas duas edições**, e as cinco eram formulações concorrentes das duas de cima (defeito 7): `municipios.semPagina`, `municipios.comPagina`, `home.instr2.coberturaLabel`, `home.instr2.legendaAceso`, `home.instr2.legendaApagado`.

*(por preencher nas subetapas seguintes: `ambito.*`, `densidade.*`, `inicio.cabeca.*`, `inicio.mapa.*`, `inicio.portas.*`, `inicio.movel.*`)*

### Etapa 3
*(por preencher: `linha.*`, `livro.*`, `municipios.*`, `municipio.*`)*

### Etapa 4
*(por preencher: `metodo.*`, `agenda.*`, `correcoes.*`, `estudos.*`)*

### Etapa 5
*(por preencher: `cartao.*`)*

## Identidades aceites (PT = EN de propósito)
Nomes próprios, códigos de série, identificadores de linha, «Eurostat», «INE», «DGAL», «IEFP», «CAOP», «UE-27», «O Estado do País». A régua da invariância imprime todas as chaves cujo valor é igual nas duas línguas; as que não estiverem nesta lista são erro.

- **`nav.menu` = «Menu» nas duas edições** (etapa 1e). Não é português copiado do inglês nem inglês copiado do português: «menu» entrou no português pelo francês e é a palavra corrente em Portugal para esta coisa exacta, tanto no papel como no ecrã, e nenhuma alternativa portuguesa («opções», «secções», «navegação») diz o que este comando faz sem dizer outra coisa. Escreve-se igual e lê-se igual; o que muda entre as duas edições é o nome acessível do comando, que junta a palavra visível à etiqueta da região («Menu · Navegação principal» / «Menu · Main navigation»), e essa metade é diferente. Se a revisão de voz preferir outra palavra em português, é uma cadeia.
