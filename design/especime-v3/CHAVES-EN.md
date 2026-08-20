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
**Nenhuma chave nova, e é um resultado e não um esquecimento.** A etapa 1 mudou a letra, os tokens, o cabeçalho, o rodapé e o selo, e não escreveu uma palavra nova em nenhuma das duas edições. As chaves de que precisou já existiam todas:

| chave | pt | en | onde foi usada |
|---|---|---|---|
| `nav.inicio` · `nav.municipios` · `nav.estudos` · `nav.livro` · `nav.agenda` · `nav.metodo` · `nav.sobre` | Início · Municípios · Estudos · Livro-razão · Agenda · Método · Sobre | Home · Municipalities · Studies · Ledger · Agenda · Method · About | a navegação do cabeçalho, agora rendida de uma lista de chaves de rota |
| `nav.correcoes` | Correções | Corrections | **já existe**, e é o oitavo item do cabeçalho no dia em que a decisão (a) chegar. Nenhuma cadeia nova é precisa para essa decisão: só uma linha de `Masthead.astro` |
| `prov.selo` | fonte | source | a palavra do selo, sem mudança |

Conferido: `assertKeyParity()` atira a cada `t()` e a construção está verde, o que quer dizer que as duas edições continuam com as mesmas chaves.

A ficha técnica pública da letra (a linha «A letra» do Método, plano §12) traria cadeias novas nas duas edições, e **não entra nesta etapa**: é texto governado e espera a palavra da direção.

### Etapa 2
*(por preencher: `ambito.*`, `densidade.*`, `inicio.cabeca.*`, `inicio.mapa.*`, `inicio.portas.*`, `inicio.movel.*`)*

### Etapa 3
*(por preencher: `linha.*`, `livro.*`, `municipios.*`, `municipio.*`)*

### Etapa 4
*(por preencher: `metodo.*`, `agenda.*`, `correcoes.*`, `estudos.*`)*

### Etapa 5
*(por preencher: `cartao.*`)*

## Identidades aceites (PT = EN de propósito)
Nomes próprios, códigos de série, identificadores de linha, «Eurostat», «INE», «DGAL», «IEFP», «CAOP», «UE-27», «O Estado do País». A régua da invariância imprime todas as chaves cujo valor é igual nas duas línguas; as que não estiverem nesta lista são erro.
