# Adenda D ao mandato EV2: a prova do texto lido lê o manifesto dos documentos como YAML (30.10.2026, 16:25 UTC)

Acrescenta: nada

*A mesma sessão, as mesmas worktrees (o sítio em 718114b87, limpo). Escrita pelo lugar de direção do dia (Claude Opus 5.5). A corrida inteira deste lugar na tua cabeça (54 passos, 2 180 s) deu um vermelho: `provar:eyetext` espera 14 edições e correu sobre 12. Medido por guião: as duas que saíram são as do estudo das contas de Évora, porque o exportador reescreveu as suas duas entradas em `studies-src/manifest.yml` com os valores entre aspas (`origin: "researchhub"`, `lang: "pt"`), e `bytesDoMotor` em `scripts/provar-eyetext.mjs` lê o manifesto com uma expressão que só aceita a forma sem aspas. `main` já tem quatro entradas entre aspas, de exportações anteriores. A prova apanhou-o pela contagem, como devia.*

## 1 · O que muda

Em `scripts/provar-eyetext.mjs`, `bytesDoMotor` (e o que mais nesse ficheiro ler o manifesto) passa a ler `studies-src/manifest.yml` pelo leitor de YAML que o sítio já usa (o `load` do `js-yaml`, como em `scripts/gate-html.mjs`), e não por expressões regulares: uma entrada com `origin: researchhub` e uma com `origin: "researchhub"` são a mesma. `EDICOES_DA_PROVA` fica em 14 e a prova volta a correr sobre as duas edições do estudo das contas de Évora, carácter a carácter contra o registo, como antes. As plantas: uma cópia do manifesto com a entrada entre aspas conta a edição; uma com `origin: outro` não a conta; e a contagem diferente de 14 continua a falhar. Procura por `grep` outros leitores de `studies-src/manifest.yml` que usem expressões para estes campos; se houver, dizes quais e não os mudas.

## 2 · O fim

Um commit. As conferências: `npm run provar:eyetext` (tem de dar 0 sobre 14 edições), `check:documentos` e `check:registo`, com os códigos em `.codigo`. Vinte e cinco minutos, quarenta chamadas. Paras e dizes se a prova, já sobre 14 edições, achar uma diferença entre a leitura e o registo do estudo das contas de Évora.
