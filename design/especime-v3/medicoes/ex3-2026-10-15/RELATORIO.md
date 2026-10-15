# EX3: relatório da interrupção, 15.10.2026

**Estado do bloco: não concluído.** A auditoria das palavras recusa a forma de P2 fixada pelo mandato. A reprodução foi feita apenas em memória, antes de alterar a explicação ou criar linhas no motor. A entrega é só este relatório, como determina o §5.

## EX3-1: aplicar a paragem expressa

O §3 manda: «Se a auditoria das palavras recusar alguma parte, o construtor para nessa questão e diz qual, sem reescrever a frase.» A recusa está em P2: os rótulos portugueses são texto literal, enquanto os rótulos ingleses são tokens `{ nome }`. O §7 reafirma deliberadamente essa diferença. A célula X1 exige a mesma estrutura nas duas edições, incluindo a posição de cada texto literal e de cada token.

Em `tests/explicacoes/explicacao.mjs`, a função `folhasDaExplicacao`, linhas 138 a 150, exige vetores de igual extensão e, quando encontra texto português, exige texto inglês na mesma posição. A comparação seguinte exige também as mesmas chaves nos tokens. A função `conferirAuditoriaDasExplicacoes` chama esta verificação antes de ler os apoios das partes.

Resultados medidos com as funções existentes:

| Caso | Resultado |
|---|---|
| Auditoria da explicação existente, sem alterações | Lista de erros vazia |
| P2 completo do §3, acrescentado a uma cópia da explicação em memória, isoladamente e sem P1 | `X · dinheiro-do-estado-2026: X1 · as duas edições têm formas diferentes em seccoes[0].conteudo[2].paragrafo` |
| Fragmento de P2 com vetores de igual extensão, texto português contra token inglês na mesma posição | `X1 · as duas edições têm formas diferentes em seccoes[0].conteudo[2].paragrafo[0]` |

O índice `[2]` pertence ao ensaio isolado: o fragmento foi colocado logo depois do parágrafo existente sobre a defesa, sem acrescentar P1. Não representa uma alteração guardada na página.

O ensaio completo correu por `curto.sh`, com código 0 porque confirmou as recusas esperadas e a ausência de erros na auditoria original. Esse código não é um portão verde do bloco. O guião e a saída ficaram em `<temporario>/ex3-verificar-gramatica.mjs` e `<temporario>/ex3-gramatica.log`; a prova mínima reproduzível está abaixo.

Não se alterou a célula, não se reescreveu P2 e não se substituíram os rótulos portugueses por nomes ingleses. A retoma precisa de uma decisão sobre a gramática que admita esta correspondência entre línguas, conservando a auditoria dos rótulos e a identidade de cada divisão, ou de uma revisão explícita do mandato.

## EX3-2: o token existente não lê o campo `name` do Eurostat

Há um segundo impedimento independente. O mandato descreve `{ nome }` como um token que rende o `name` da linha. A implementação atual, `nomeDaLinhaNaExplicacao`, em `src/lib/explicacoes.mjs`, linhas 119 a 135, lê `NOMES_OE1[id][lang]` e extrai o trecho correspondente a uma função, ministério ou programa do Orçamento. Não lê `linha.name`.

Foram ensaiados os dez identificadores `despesa-por-funcao-2024-gf01-pt` a `despesa-por-funcao-2024-gf10-pt`, em inglês. Os dez foram recusados. Exemplo literal da primeira recusa:

> explicação · despesa-por-funcao-2024-gf01-pt: o nome do projeto «Public expenditure on general public services, as a percentage of GDP, Portugal» não tem nenhuma das formas do nome declarado (FORMAS_DO_NOME). Um defeito da declaração fecha a construção; uma condição falsa tira as palavras que guarda e deixa um sinal.

Mudar apenas a forma da auditoria não resolveria este impedimento. A retoma também precisa de definir como o nome oficial do Eurostat chega ao token sem alterar as linhas existentes nem perder a conferência independente da página.

Prova mínima, executável na raiz da worktree do sítio, sem escrever nos ficheiros do projeto:

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { DINHEIRO_DO_ESTADO_2026 as original } from './src/data/explicacoes/dinheiro-do-estado-2026.mjs';
import { conferirAuditoriaDasExplicacoes, folhasDaExplicacao } from './tests/explicacoes/explicacao.mjs';
import { nomeDaLinhaNaExplicacao } from './src/lib/explicacoes.mjs';
assert.deepEqual(conferirAuditoriaDasExplicacoes().erros, []);
const e = structuredClone(original);
const id = 'despesa-por-funcao-2024-gf01-pt';
e.seccoes[0].conteudo.push({ paragrafo: {
  pt: ['serviços gerais das administrações públicas', ' ', { claim: id }],
  en: [{ nome: id }, ' ', { claim: id }],
} });
assert.throws(() => folhasDaExplicacao(e), /X1 .*formas diferentes/);
for (let i = 1; i <= 10; i++) {
  const linha = `despesa-por-funcao-2024-gf${String(i).padStart(2, '0')}-pt`;
  assert.throws(() => nomeDaLinhaNaExplicacao(linha, 'en'), /FORMAS_DO_NOME/);
}
console.log('Auditoria original sem erros; assimetria de P2 recusada; dez nomes recusados.');
JS
```

## EX3-3: leitura preliminar da NATO, sem selagem

Antes da recusa da gramática, foram feitos dois pedidos reais com `core.http.HttpClient.condicional`, identidade `OEstadoDoPais/ex3`, sem cache de resposta. Os corpos e os recibos ficaram apenas numa pasta temporária. Não foram alojados no repositório do motor, não foi criada uma origem de definição e nenhuma linha foi selada.

| Pedido | Hora de acesso UTC | Estado HTTP | SHA256 dos bytes recebidos |
|---|---|---|---|
| `https://www.nato.int/robots.txt` | `2026-10-15T18:38:39.526940+00:00` | 200 | `c43a3893ed5ebdae4bb03ad426aa858da61b9e8c1a092c36e05bc43f5f6bd072` |
| `https://www.nato.int/en/what-we-do/introduction-to-nato/defence-expenditures-and-natos-5-commitment` | `2026-10-15T18:39:03.815307+00:00` | 200 | `456780ee9c0ed644d00871495cba09a54584f03d22957e476dd85a1e895ca566` |

O `robots.txt` recebido declara `User-agent: *` e `Disallow: */newsletter/*`. O endereço da definição foi conferido com `RobotFileParser.can_fetch` antes do pedido e foi permitido. Isto não é uma conclusão sobre direitos de reprodução; a leitura dos direitos ficou por executar.

O hash da definição indicado no mandato é `884a966ce2945fd485c69d236116392b92e2b7e412d0e3b0ac5453c9065ab7e4`. O recebido é o da tabela. A comparação do texto HTML, com os elementos inline unidos e os espaços normalizados, confirmou a presença das três frases exigidas no §0.3: a definição, a ligação de `core defence requirements` à definição e a inclusão das pensões. A diferença de hash, por si só, não causou a interrupção.

Recibos temporários: `<temporario>/ex3-nato/robots.pedido.json` e `<temporario>/ex3-nato/definicao.pedido.json`. Registam endereço, estado, hash, endereço final, redirecionamentos, duração, tipo de conteúdo, validadores quando presentes e hora de acesso. Não houve redirecionamentos em nenhum dos dois pedidos. Os ficheiros Excel e PDF não foram pedidos, e os seus valores, células e formas impressas não foram verificados nesta passagem.

## EX3-4: marcas do Eurostat observadas

A leitura de `loadClaims()` no ensaio dos nomes encontrou `source_flag: "p"` nas dez linhas, de GF01 a GF10. O mandato destaca a defesa e a proteção social, mas nesta cabeça as outras oito também têm essa marca. Nenhuma foi alterada. A conservação das marcas na nova página não foi executada, porque P2 não foi implementado.

## Estado dos itens de entrega

| Item do mandato | Estado |
|---|---|
| Documentos NATO alojados no motor, recibos e pasta de direitos | Não executado; apenas os dois pedidos preliminares acima |
| Excel, células, valores, `number_format` e forma impressa no PDF | Não executado |
| Três linhas NATO, ressalvas, estimativas e exportação | Não executado |
| Origem `nato-definicao-despesa-defesa` e apoios de P1 | Não executado |
| Abertura, títulos e denominador dos ministérios | Não executado |
| P1 e P2 nas duas edições | Não executado; P2 ensaiado apenas em memória |
| Mapa código a código dos rótulos portugueses e ingleses | Não executado |
| Frases antes e depois nas duas edições | Não executado; nenhuma frase alterada |
| Atualização das células e plantas pedidas no §4 | Não executado; os ensaios de diagnóstico acima não substituem essas plantas |
| `build`, `verify`, `typecheck`, códigos na cabeça final | Não executado |
| `check:series` e `check:cruzamento --with-origin` | Não executado |
| `core.gate` do motor | Não executado |
| Capturas das duas edições e dos três recibos, `capturas.json` | Não executado |
| Leitura a frio e pacote com cinco plantas | Não executado |

Cabeça de conteúdo do sítio inspecionada: `f8cb02f4e2345b617830a3927ecfd679091f26b3`. Cabeça do motor: `3d024fa093a23473565eab01f2d30fe92102daa0`. Antes de escrever este relatório, `git diff --stat` estava vazio nos dois repositórios; o motor estava limpo e o sítio tinha apenas o registo não seguido do escrivão, já presente no início. Esse registo não integra a entrega. O commit desta entrega contém só `RELATORIO.md`; a cabeça de conteúdo mantém-se a acima indicada, e a cabeça do relatório identifica-se por `git log -1 --format=%H -- design/especime-v3/medicoes/ex3-2026-10-15/RELATORIO.md`.

tokens used: não disponível
