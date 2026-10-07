# RP4-n · selar as frases na fonte

A primeira passagem recompôs as frases e ficou bloqueada no portão HTML. O estado atual, a regra completa e os códigos estão na secção «A passagem RP4-n-c», no fim. Este pacote é uma entrega para leitura a frio, não uma aprovação nem uma publicação.

Relatório produzido por `relatar.py`. As contagens vêm de `antes/medidas.json`, `depois/medidas.json`, das origens exportadas e dos registos das plantas. `comparacao.json` conserva a comparação completa nas duas línguas.

## Contagens reproduzíveis

| Medida | Antes | Depois |
|---|---:|---:|
| Linhas na lista por confirmar | 174 | 0 |
| Séries na lista por confirmar | 6 | 0 |
| Partes das famílias apoiadas no nome | 46 | 0 |
| Partes das séries apoiadas no nome | 6 | 0 |
| Páginas construídas com marcadores | 398 | 46 |
| Ocorrências textuais nas páginas | 587 | 227 |

Há 24 origens novas, lidas em 11 documentos ou corpos. Saíram 25 partes inteiras da classe `diz`, contadas por entrada e folha da especificação, sem multiplicar pelas linhas nem pelas traduções. Há ainda 14 trechos reescritos, que podem perder qualificações sem eliminar a parte inteira. As duas listas detalhadas estão abaixo.

As 66 entradas que já não tinham partes por confirmar nem apoio no nome conservaram o texto das duas edições. O guião afirma essa igualdade. O guião do brief contou 45 partes com apoio direto no nome; o guião desta entrega também desce às alternativas `ou` e contou 46. A diferença está na parte «(desemprego registado)» da família dos concelhos. O inventário completo está em `antes/medidas.json`.

A ausência de excerto ficou explícita em 4 famílias: `avisos-pt2030-abertos`, `avisos-pt2030-pessoas-singulares`, `ciclo-substituicao-condutas`, `agua-nao-faturada-portugal`. A K17 só permite esta frase fixa quando o excerto da linha está ausente; a planta com um excerto existente prova que a exceção não é uma saída livre.

## Cabeças do código e portões

| Repositório | Cabeça conferida |
|---|---|
| sítio | `579c9dd463f98753c05c4e16ff2bb73a856adf6d` |
| motor | `eb4a5cbb0e4abe7cc44919a3679ce6fbad3bf369` |

| Portão | Código lido do ficheiro |
|---|---:|
| build | `1` |
| verify | `1` |
| typecheck | `0` |
| motor | `0` |

Os códigos são lidos de `portoes/*.codigo`, depois do processo terminar. Os registos são guardados sem caminhos da máquina. Se `build` ou `verify` parar no portão HTML, os comandos posteriores da cadeia não se executaram; não se reclama uma passagem integral desses comandos.

Comandos da medição e da conferência:

```sh
node design/especime-v3/medicoes/rp4n-2026-10-06/medir.mjs antes
node design/especime-v3/medicoes/r4-2026-10-05/compor-familias-r4.mjs
node design/especime-v3/medicoes/r4-2026-10-05/compor-series-r4.mjs
node design/especime-v3/medicoes/rp4n-2026-10-06/medir.mjs depois
node design/especime-v3/medicoes/rp4n-2026-10-06/captar.mjs antes
node design/especime-v3/medicoes/rp4n-2026-10-06/captar.mjs depois
npm run check:cartao
node tests/cartao/rp4n.mjs --registo
node design/especime-v3/medicoes/rp4n-2026-10-06/plantar-copias.mjs
RESEARCHHUB_DIR=<motor> sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4n-2026-10-06/portoes
# No motor:
python3 -m publisher.export_series --site <worktree> --write
python3 -m publisher.rp4n_origens <worktree>
python3 -m publisher.rotulos_series_test
python3 -m publisher.rp4n_origens_test
python3 -m core.gate
# No sítio:
RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/relatar.py
```

## Família a família e série a série

As origens referidas nesta tabela estão identificadas na tabela seguinte, com a página ou o caminho e o resumo do corpo. Os campos da própria linha continuam presos à proveniência e aos portões existentes. Os excertos literais completos estão em `src/data/origens-rp4n.json` e na cópia do motor.

| Família ou série | Palavra ou parte a confirmar | Antes | Depois | Apoio depois |
|---|---|---|---|---|
| oe-2026-cem-euros-funcao-01; oe-2026-cem-euros-funcao-02; oe-2026-cem-euros-funcao-03; oe-2026-cem-euros-funcao-04; oe-2026-cem-euros-funcao-05; oe-2026-cem-euros-funcao-06; oe-2026-cem-euros-funcao-07; oe-2026-cem-euros-funcao-08; oe-2026-cem-euros-funcao-09; oe-2026-cem-euros-funcao-10 | orçamentada; budgeted | É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | rp4n-consolidacao; rp4n-despesa-efetiva; rp4n-orcamento; derivation |
| execucao-2026-07-cem-euros-funcao-01; execucao-2026-07-cem-euros-funcao-02; execucao-2026-07-cem-euros-funcao-03; execucao-2026-07-cem-euros-funcao-04; execucao-2026-07-cem-euros-funcao-05; execucao-2026-07-cem-euros-funcao-06; execucao-2026-07-cem-euros-funcao-07; execucao-2026-07-cem-euros-funcao-08; execucao-2026-07-cem-euros-funcao-09; execucao-2026-07-cem-euros-funcao-10 | : a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | rp4n-consolidacao; rp4n-despesa-efetiva; derivation; unit |
| oe-2026-cem-euros-ministerio-administracao-interna; oe-2026-cem-euros-ministerio-agricultura-e-mar; oe-2026-cem-euros-ministerio-ambiente-e-energia; oe-2026-cem-euros-ministerio-cultura-juventude-e-desporto; oe-2026-cem-euros-ministerio-defesa-nacional; oe-2026-cem-euros-ministerio-economia-e-coesao-territorial; oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao; oe-2026-cem-euros-ministerio-financas; oe-2026-cem-euros-ministerio-infraestruturas-e-habitacao; oe-2026-cem-euros-ministerio-justica; oe-2026-cem-euros-ministerio-negocios-estrangeiros; oe-2026-cem-euros-ministerio-presidencia-do-conselho-de-ministros; oe-2026-cem-euros-ministerio-reforma-do-estado; oe-2026-cem-euros-ministerio-saude; oe-2026-cem-euros-ministerio-trabalho-solidariedade-e-seguranca-social | orçamentada; budgeted | É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. | É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê. | rp4n-orcamento; derivation |
| oe-2026-cem-euros-ministerio-encargos-gerais-do-estado | orçamentada; budgeted | É quanto vai para os encargos gerais do Estado em cada cem euros da despesa bruta da administração central que o Orçamento prevê; no mapa, estes encargos são iguais à despesa do programa dos órgãos de soberania; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. | É quanto vai para os encargos gerais do Estado em cada cem euros da despesa bruta da administração central que o Orçamento prevê; no mapa, estes encargos são iguais à despesa do programa dos órgãos de soberania. | rp4n-orcamento; derivation |
| oe-2026-despesa-funcao-01; oe-2026-despesa-funcao-02; oe-2026-despesa-funcao-03; oe-2026-despesa-funcao-04; oe-2026-despesa-funcao-05; oe-2026-despesa-funcao-06; oe-2026-despesa-funcao-07; oe-2026-despesa-funcao-08; oe-2026-despesa-funcao-09; oe-2026-despesa-funcao-10 | orçamentada; Budgeted; despesa efetiva consolidada; consolidated effective expenditure | É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | rp4n-consolidacao; rp4n-despesa-efetiva; rp4n-funcional; rp4n-orcamento; document.title |
| execucao-2026-07-despesa-funcao-01; execucao-2026-07-despesa-funcao-02; execucao-2026-07-despesa-funcao-03; execucao-2026-07-despesa-funcao-04; execucao-2026-07-despesa-funcao-05; execucao-2026-07-despesa-funcao-06; execucao-2026-07-despesa-funcao-07; execucao-2026-07-despesa-funcao-08; execucao-2026-07-despesa-funcao-09; execucao-2026-07-despesa-funcao-10 | despesa efetiva consolidada; consolidated effective expenditure | É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços. | rp4n-consolidacao; rp4n-despesa-efetiva; document.title; unit |
| oe-2026-diferencas-consolidacao-funcional; execucao-2026-07-diferencas-consolidacao-funcional | : o acerto que se soma às funções para chegar ao total da despesa efetiva consolidada, e não uma função. | É a diferença de consolidação da despesa por funções da administração central: o acerto que se soma às funções para chegar ao total da despesa efetiva consolidada, e não uma função. | É a diferença de consolidação da despesa por funções da administração central. | document.title; name |
| oe-2026-despesa-ministerio-administracao-interna; oe-2026-despesa-ministerio-agricultura-e-mar; oe-2026-despesa-ministerio-ambiente-e-energia; oe-2026-despesa-ministerio-cultura-juventude-e-desporto; oe-2026-despesa-ministerio-defesa-nacional; oe-2026-despesa-ministerio-economia-e-coesao-territorial; oe-2026-despesa-ministerio-educacao-ciencia-e-inovacao; oe-2026-despesa-ministerio-financas; oe-2026-despesa-ministerio-infraestruturas-e-habitacao; oe-2026-despesa-ministerio-justica; oe-2026-despesa-ministerio-negocios-estrangeiros; oe-2026-despesa-ministerio-presidencia-do-conselho-de-ministros; oe-2026-despesa-ministerio-reforma-do-estado; oe-2026-despesa-ministerio-saude; oe-2026-despesa-ministerio-trabalho-solidariedade-e-seguranca-social | orçamentada; Budgeted; despesa bruta; gross | É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. | É o que o Orçamento prevê que este ministério gaste num ano. | rp4n-orcamento; document.locator |
| oe-2026-despesa-ministerio-encargos-gerais-do-estado | orçamentada; Budgeted; despesa bruta; gross | É o que o Orçamento prevê para os encargos gerais do Estado num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. | É o que o Orçamento prevê para os encargos gerais do Estado num ano. | rp4n-orcamento; document.locator; name |
| oe-2026-despesa-programa-001; oe-2026-despesa-programa-002; oe-2026-despesa-programa-003; oe-2026-despesa-programa-004; oe-2026-despesa-programa-005; oe-2026-despesa-programa-006; oe-2026-despesa-programa-007; oe-2026-despesa-programa-008; oe-2026-despesa-programa-009; oe-2026-despesa-programa-010; oe-2026-despesa-programa-011; oe-2026-despesa-programa-012; oe-2026-despesa-programa-013; oe-2026-despesa-programa-014; oe-2026-despesa-programa-015; oe-2026-despesa-programa-016; oe-2026-despesa-programa-017; oe-2026-despesa-programa-018; oe-2026-despesa-programa-019; oe-2026-despesa-programa-020 | orçamentada do programa; Budgeted expenditure of the; despesa bruta; gross | É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. | É o que o Orçamento prevê gastar neste programa da administração central num ano. | rp4n-orcamento; document.title |
| execucao-2026-08-despesa-programa-001; execucao-2026-08-despesa-programa-002; execucao-2026-08-despesa-programa-003; execucao-2026-08-despesa-programa-004; execucao-2026-08-despesa-programa-005; execucao-2026-08-despesa-programa-006; execucao-2026-08-despesa-programa-007; execucao-2026-08-despesa-programa-008; execucao-2026-08-despesa-programa-009; execucao-2026-08-despesa-programa-010; execucao-2026-08-despesa-programa-011; execucao-2026-08-despesa-programa-012; execucao-2026-08-despesa-programa-013; execucao-2026-08-despesa-programa-014; execucao-2026-08-despesa-programa-015; execucao-2026-08-despesa-programa-016; execucao-2026-08-despesa-programa-017; execucao-2026-08-despesa-programa-018; execucao-2026-08-despesa-programa-019; execucao-2026-08-despesa-programa-020 | , em despesa efetiva consolidada dentro do programa; : sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam. | É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam. | É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa. | rp4n-despesa-efetiva; rp4n-programas; document.locator; unit |
| execucao-2026-08-subtotal-programas | : cada programa sem as suas transferências internas, mas com as transferências entre programas ainda por tirar. | É a soma da despesa efetiva consolidada de cada programa da administração central, de janeiro a agosto: cada programa sem as suas transferências internas, mas com as transferências entre programas ainda por tirar. | É a soma da despesa efetiva consolidada de cada programa da administração central, de janeiro a agosto: cada programa sem os seus fluxos internos. | rp4n-programas; name; unit |
| execucao-2026-08-diferencas-consolidacao-programas | Diferenças de consolidação da despesa entre programas; consolidation differences | São as diferenças de consolidação da despesa entre os programas da administração central, de janeiro a agosto. | São as diferenças de consolidação da despesa entre os programas da administração central, de janeiro a agosto. | name; unit |
| oe-2026-despesa-efetiva-administracao-central; execucao-2026-07-despesa-efetiva-administracao-central; execucao-2026-08-despesa-efetiva-administracao-central | : o que ela gasta sem contar as operações com ativos e passivos financeiros. | É a despesa efetiva da administração central: o que ela gasta sem contar as operações com ativos e passivos financeiros. | É a despesa efetiva da administração central: o que ela gasta sem contar as operações com ativos e passivos financeiros. | rp4n-despesa-efetiva; name |
| oe-2026-despesa-efetiva-administracao-central-seguranca-social; execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social | administração central e da segurança social; central administration and social security | É a despesa efetiva da administração central e da segurança social, somadas sem as transferências entre os seus serviços: o que gastam sem contar as operações com ativos e passivos financeiros. | É a despesa efetiva da administração central e da segurança social, somadas sem as transferências entre os seus serviços: o que gastam sem contar as operações com ativos e passivos financeiros. | rp4n-ac-ss; rp4n-despesa-efetiva; name; ressalva |
| oe-2026-receita-efetiva-administracao-central; execucao-2026-07-receita-efetiva-administracao-central; execucao-2026-08-receita-efetiva-administracao-central | : o que ela recebe sem contar os recebimentos de ativos e passivos financeiros. | É a receita efetiva da administração central: o que ela recebe sem contar os recebimentos de ativos e passivos financeiros. | É a receita efetiva da administração central: o que ela recebe sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência. | rp4n-receita-efetiva; name |
| oe-2026-receita-efetiva-administracao-central-seguranca-social; execucao-2026-08-receita-efetiva-administracao-central-seguranca-social | administração central e da segurança social; central administration and social security | É a receita efetiva da administração central e da segurança social: o que recebem sem contar os recebimentos de ativos e passivos financeiros. | É a receita efetiva da administração central e da segurança social: o que recebem sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência. | rp4n-ac-ss; rp4n-receita-efetiva; name |
| oe-2026-despesa-orcamental-administracao-central; execucao-2026-07-despesa-orcamental-administracao-central | , incluindo as operações com ativos e passivos financeiros, que a despesa efetiva não conta. | É toda a despesa orçamental da administração central, incluindo as operações com ativos e passivos financeiros, que a despesa efetiva não conta. | É toda a despesa orçamental da administração central, incluindo as operações com ativos e passivos financeiros, que a despesa efetiva não conta. | rp4n-despesa-efetiva; name |
| oe-2026-receita-orcamental-administracao-central; execucao-2026-07-receita-orcamental-administracao-central | , incluindo os recebimentos de ativos e passivos financeiros, que a receita efetiva não conta. | É toda a receita orçamental da administração central, incluindo os recebimentos de ativos e passivos financeiros, que a receita efetiva não conta. | É toda a receita orçamental da administração central, incluindo os recebimentos de ativos e passivos financeiros, que a receita efetiva não conta. | rp4n-receita-efetiva; name |
| oe-2026-despesa-primaria-administracao-central; execucao-2026-07-despesa-primaria-administracao-central | sem juros; excluding interest | É a despesa da administração central sem os juros da dívida, a que a fonte chama despesa primária. | É a despesa efetiva da administração central sem a rubrica de juros e outros encargos, a que a fonte chama despesa primária. | rp4n-despesa-primaria; name |
| oe-2026-saldo-global-administracao-central; execucao-2026-07-saldo-global-administracao-central; execucao-2026-08-saldo-global-administracao-central | Apoio ou formulação da parte | É o saldo global da administração central: a diferença entre o que ela recebe e o que gasta, sem contar as operações com ativos e passivos financeiros; negativo quer dizer que gastou mais do que recebeu. | É o saldo global da administração central: a diferença entre o que ela recebe e o que gasta, sem contar as operações com ativos e passivos financeiros; negativo quer dizer que gastou mais do que recebeu. | eurostat-gfs-saldo; rp4n-saldo; name; ressalva |
| oe-2026-saldo-global-administracao-central-seguranca-social; execucao-2026-08-saldo-global-administracao-central-seguranca-social | ; não é a dívida que se emitiu. | É o saldo global da administração central e da segurança social: a receita efetiva menos a despesa efetiva; não é a dívida que se emitiu. | É o saldo global da administração central e da segurança social: a receita efetiva menos a despesa efetiva. | rp4n-saldo; name |
| oe-2026-saldo-primario-administracao-central; execucao-2026-07-saldo-primario-administracao-central | Saldo sem juros; balance excluding interest | É o saldo da administração central sem os juros da dívida, a que a fonte chama saldo primário. | É a receita efetiva da administração central menos a despesa primária, a que a fonte chama saldo primário. | rp4n-saldo; name |
| execucao-2026-07-saldo-global-administracoes-publicas-contabilidade-publica | administrações públicas em contabilidade pública; general government on a public accounting basis | É o saldo global de todas as administrações públicas, contado em contabilidade pública: a diferença entre o que recebem e o que gastam. | É o saldo global de todas as administrações públicas, contado em contabilidade pública: a diferença entre o que recebem e o que gastam. | eurostat-gfs-saldo; name |
| oe-2026-ativos-e-passivos-da-despesa-administracao-central; execucao-2026-07-ativos-e-passivos-da-despesa-administracao-central | , que a despesa efetiva não conta. | É a parte da despesa orçamental da administração central feita em operações com ativos e passivos financeiros, que a despesa efetiva não conta. | É a parte da despesa orçamental da administração central feita em operações com ativos e passivos financeiros, que a despesa efetiva não conta. | rp4n-despesa-efetiva; name |
| oe-2026-ativos-e-passivos-da-receita-administracao-central; execucao-2026-07-ativos-e-passivos-da-receita-administracao-central | , que a receita efetiva não conta. | É a parte da receita orçamental da administração central que vem de operações com ativos e passivos financeiros, que a receita efetiva não conta. | É a parte da receita orçamental da administração central que vem de operações com ativos e passivos financeiros, que a receita efetiva não conta. | rp4n-receita-efetiva; name |
| oe-2026-ativos-financeiros-liquidos-administracao-central-seguranca-social; execucao-2026-08-ativos-financeiros-liquidos-administracao-central-seguranca-social | administração central e da segurança social; central administration and social security | É o que a administração central e a segurança social puseram em ativos financeiros, descontados os reembolsos que receberam (a fonte chama-lhes ativos financeiros líquidos de reembolsos). | É o que a administração central e a segurança social puseram em ativos financeiros, descontados os reembolsos que receberam (a fonte chama-lhes ativos financeiros líquidos de reembolsos). | rp4n-ac-ss; name |
| oe-2026-passivos-financeiros-liquidos-administracao-central-seguranca-social; execucao-2026-08-passivos-financeiros-liquidos-administracao-central-seguranca-social | ; não é a parte da despesa paga com dívida. | É o que a administração central e a segurança social receberam de novos passivos financeiros, menos o que amortizaram; não é a parte da despesa paga com dívida. | É o que a administração central e a segurança social receberam de novos passivos financeiros, menos o que amortizaram. | rp4n-passivos; name |
| oe-2026-despesa-bruta-administracao-central | orçamentada; Budgeted; Despesa bruta; Budgeted gross expenditure | É a soma de toda a despesa dos serviços da administração central que o Orçamento prevê para o ano, em bruto; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. | É a soma de toda a despesa dos serviços da administração central que o Orçamento prevê para o ano. | rp4n-orcamento; document.title; name |
| oe-2026-receita-bruta-administracao-central | orçamentada; Budgeted | É a soma de toda a receita dos serviços da administração central que o Orçamento prevê para o ano, em bruto; a receita bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. | É a soma de toda a receita dos serviços da administração central que o Orçamento prevê para o ano. | rp4n-orcamento; document.title; name |
| oe-2026-despesa-consolidada-administracao-central; oe-2026-despesa-consolidada-seguranca-social; oe-2026-despesa-total | orçamentada; Budgeted | É a despesa total que o Orçamento prevê para o ano, consolidada: sem as transferências entre os serviços de que é feita, mas com as operações financeiras. | É a despesa total que o Orçamento prevê para o ano, consolidada. | rp4n-orcamento; name |
| oe-2026-receita-consolidada-administracao-central; oe-2026-receita-consolidada-seguranca-social | orçamentada; Budgeted | É a receita total que o Orçamento prevê para o ano, consolidada: sem as transferências entre os serviços de que é feita, mas com as operações financeiras. | É a receita total que o Orçamento prevê para o ano, consolidada. | rp4n-orcamento; name |
| distancia-setubal-grande-lisboa | entre a Península de Setúbal e a Grande Lisboa; Distância do PIB por habitante | É a distância, em pontos, entre a Grande Lisboa e a Península de Setúbal, duas regiões vizinhas, no índice do valor de tudo o que cada uma produz por habitante, em que a média da União Europeia vale cem. | É a distância, em pontos, entre a Grande Lisboa e a Península de Setúbal, duas regiões vizinhas, no índice do valor de tudo o que cada uma produz por habitante, em que a média da União Europeia vale cem. | derivation; unit |
| evora-concentracao-vab4; portugal-concentracao-vab4 | ; o valor acrescentado bruto é o valor do que se produz menos o valor dos bens e serviços consumidos para o produzir. | É a parte do valor acrescentado bruto das empresas que cabe às quatro maiores; o valor acrescentado bruto é o valor do que se produz menos o valor dos bens e serviços consumidos para o produzir. | É a parte do valor acrescentado bruto das empresas que cabe às quatro maiores; o valor acrescentado bruto é o valor do que se produz menos o valor dos bens e serviços consumidos para o produzir. | rp4n-vab; name; unit |
| evora-vab-empresarial | : o valor do que produzem menos o valor dos bens e serviços consumidos para o produzir. | É o valor acrescentado bruto das empresas do concelho, somado sobre todas as atividades: o valor do que produzem menos o valor dos bens e serviços consumidos para o produzir. | É o valor acrescentado bruto das empresas do concelho, somado sobre todas as atividades: o valor do que produzem menos o valor dos bens e serviços consumidos para o produzir. | rp4n-vab; document.locator; name |
| evora-divida-31-10 | Dívida registada no início do mandato; Debt recorded at the start of the term | É a dívida que a câmara tinha registada no início do mandato, como o relatório de gestão a apresenta. | É a dívida que a câmara tinha registada no início do mandato, como o relatório de gestão a apresenta. | rp4n-evora-divida-inicio; document.title; excerpt |
| evora-divida-inicio-mandato-reexpressa | : reexpressa quer dizer apresentada de novo mais tarde. | É a dívida do início do mandato como a apresenta um relatório de gestão posterior: reexpressa quer dizer apresentada de novo mais tarde. | É a dívida do início do mandato como a apresenta um relatório de gestão posterior. | document.title; name |
| evora-excesso-endividamento | Dívida acima do limite legal; Debt above the legal limit | É o montante em que a dívida da câmara passava do limite legal, pelas contas da própria câmara. | É o montante em que a dívida da câmara passava do limite legal, pelas contas da própria câmara. | c1c-dgal-limites; document.title; excerpt; source |
| evora-execucao-da-receita | Receita cobrada face ao orçamento; Revenue collected against the budget | É a receita que a câmara cobrou no ano em percentagem da que o orçamento previa, pela prestação de contas. | É a receita que a câmara cobrou no ano em percentagem da que o orçamento previa, pela prestação de contas. | rp4n-evora-receita; document.title; unit |
| evora-margem-endividamento | Margem até ao limite da dívida; Headroom up to the debt limit | É quanto a câmara ainda podia dever até chegar ao limite legal da dívida, no fim do ano, pela prestação de contas. | É quanto a câmara ainda podia dever até chegar ao limite legal da dívida, no fim do ano, pela prestação de contas. | c1c-dgal-limites; document.title; excerpt |
| evora-orcamento | Orçamento do município; Budget of the municipality | É o orçamento da câmara para o ano, como a prestação de contas o apresenta. | É o orçamento da câmara para o ano, como a prestação de contas o apresenta. | rp4n-evora-orcamento; document.title; reference_date |
| evora-pael-emprestimo | Empréstimo do apoio à economia local; local economy support programme | É o montante do empréstimo que a câmara contraiu no programa de apoio à economia local, como o relatório de gestão o apresenta. | É o montante do empréstimo que a câmara contraiu no programa de apoio à economia local, como o relatório de gestão o apresenta. | rp4n-evora-pael; document.title; excerpt |
| evora-pelouros-2021-presidente; evora-pelouros-2021-vice-presidente; evora-pelouros-2025-presidente; evora-pelouros-2025-vice-presidente; evora-pelouros-2025-vereadora | Pelouros | É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo: cada pelouro é uma área da câmara a seu cargo. | É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo. | document.locator; document.title; excerpt |
| evora-prazo-medio-de-pagamento | Prazo médio de pagamento a fornecedores; Average time to pay suppliers; Prazo médio de pagamento | O número médio de dias que a câmara demora a pagar aos fornecedores (prazo médio de pagamento), pelas contas da própria câmara. | O número médio de dias que a câmara demora a pagar aos fornecedores (prazo médio de pagamento), pelas contas da própria câmara. | rp4n-evora-pmp; excerpt; source; unit |
| evora-prr-aprovado | Verbas do Plano de Recuperação e Resiliência (PRR) aprovadas para Évora; Recovery and Resilience Plan (PRR) funds approved for Évora | São as verbas do Plano de Recuperação e Resiliência aprovadas para projetos no concelho, pela listagem de entidades do plano. | São as verbas contratadas do Plano de Recuperação e Resiliência por beneficiários intermediários e diretos com sede no concelho, pela listagem de entidades do plano. | document.computed_over.column; document.computed_over.filter; document.title |
| evora-prr-pago | Verbas do Plano de Recuperação e Resiliência (PRR) pagas em Évora; Recovery and Resilience Plan (PRR) funds paid in Évora | São as verbas do Plano de Recuperação e Resiliência já pagas a projetos no concelho, pela listagem de entidades do plano. | São as verbas pagas do Plano de Recuperação e Resiliência a beneficiários intermediários e diretos com sede no concelho, pela listagem de entidades do plano. | document.computed_over.column; document.computed_over.filter; document.title |
| evora-prr-vencido-aprovado | Verbas aprovadas em projetos fora de prazo; Approved funds in projects past their deadline | São as verbas aprovadas em projetos no concelho cujo prazo de conclusão já passou, pela listagem de entidades do Plano de Recuperação e Resiliência. | São as verbas contratadas por beneficiários intermediários e diretos com sede no concelho, com prazo de conclusão anterior ao instantâneo e sem conclusão registada, pela listagem de entidades do Plano de Recuperação e Resiliência. | document.computed_over.column; document.computed_over.filter; document.title |
| evora-saneamento-financeiro | Empréstimo de saneamento financeiro; Financial recovery loan | É o montante do empréstimo de saneamento financeiro que a câmara contraiu, como o relatório de gestão o apresenta. | É o montante do empréstimo de saneamento financeiro que a câmara contraiu, como o relatório de gestão o apresenta. | rp4n-evora-saneamento; document.title; excerpt |
| avisos-pt2030-abertos | Avisos de candidatura abertos; Open calls for applications | É o número de avisos de candidatura que estavam abertos. | Não há excerto da fonte que permita explicar este número. | Ausência do excerto, conferida pela K17. |
| avisos-pt2030-pessoas-singulares | Avisos abertos a pessoas singulares; Open calls for individuals | É o número de avisos de candidatura abertos a pessoas singulares. | Não há excerto da fonte que permita explicar este número. | Ausência do excerto, conferida pela K17. |
| ciclo-substituicao-condutas | Ciclo de substituição das condutas; Replacement cycle of water mains | É o ciclo de substituição das condutas de água, em anos. | Não há excerto da fonte que permita explicar este número. | Ausência do excerto, conferida pela K17. |
| agua-nao-faturada-portugal | Água não faturada; Unbilled water | É a parte da água que não é faturada, pelo relatório anual dos serviços de águas e resíduos. | Não há excerto da fonte que permita explicar este número. | Ausência do excerto, conferida pela K17. |
| penalizacao-antecipacao-um-ano-neutra | sem custo para o sistema; at no cost to the system | É o corte na pensão por um ano de antecipação da reforma que deixaria o sistema de pensões sem ganhar nem perder, contando o que se deixa de descontar e os direitos que se acrescentam, pelas contas do relatório final sobre a reforma da segurança social. | São cálculos sobre o efeito da antecipação da idade de reforma, contando o que se deixa de descontar e os direitos que se acrescentam, pelas contas do relatório final sobre a reforma da segurança social. | document.locator; excerpt; source |
| factor-sustentabilidade | : abaixo de um, a pensão baixa, e o que falta para chegar a um é a parte que se corta. | É o fator que multiplica o montante das pensões de velhice que começam no ano e a que ele se aplica: abaixo de um, a pensão baixa, e o que falta para chegar a um é a parte que se corta. | É o fator que multiplica o montante das pensões de velhice que começam no ano e a que ele se aplica. | excerpt |
| desempregoRegistado | Desemprego registado | Conta as pessoas desempregadas inscritas nos serviços de emprego no fim do mês (desemprego registado). | Conta as pessoas desempregadas inscritas nos serviços de emprego no fim do mês (desemprego registado). | rp4n-madeira; rp4n-madeira-fim-mes; document.edition; document.title; name; source |
| empresas | Empresas não financeiras; Non-financial enterprises | Conta as empresas não financeiras atribuídas ao concelho (sistema de contas integradas das empresas). | Conta as empresas atribuídas ao concelho (sistema de contas integradas das empresas). | document.title; name |
| serie-ihpc-combustiveis-variacao-homologa-ue | combustíveis; Fuel prices | É quanto mudaram os preços dos combustíveis face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor); o valor da União é uma média dos países, ponderada pelo peso de cada um. | É quanto mudaram os preços dos combustíveis e lubrificantes para transporte pessoal face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor); o valor da União é uma média dos países, ponderada pelo peso de cada um. | rp1-ihpc-comparavel; rp1-ihpc-homologa; rp1-ihpc-uniao; rp4n-combustiveis-ue; document.edition; name |
| serie-ihpc-combustiveis-variacao-homologa | combustíveis; Fuel prices | É quanto mudaram, em Portugal, os preços dos combustíveis face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor). | É quanto mudaram, em Portugal, os preços dos combustíveis e lubrificantes para transporte pessoal face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor). | rp1-ihpc-comparavel; rp1-ihpc-homologa; rp4n-combustiveis; document.edition; name |
| serie-ihpc-energia-da-casa-variacao-homologa | energia em casa; Home energy prices | É quanto mudaram, em Portugal, os preços da energia usada em casa face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor). | É quanto mudaram, em Portugal, os preços da eletricidade, do gás e de outros combustíveis face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor). | rp1-ihpc-comparavel; rp1-ihpc-homologa; rp4n-energia; document.edition; name |
| serie-ihpc-rendas-variacao-homologa | rendas; Rent prices | É quanto mudaram, em Portugal, os preços das rendas face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor). | É quanto mudaram, em Portugal, os preços das rendas face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor). | rp1-ihpc-comparavel; rp1-ihpc-homologa; rp4n-rendas; document.edition; name |
| serie-precos-da-habitacao-variacao-homologa | variação num ano; change over a year | É quanto mudaram num ano os preços de transação das casas compradas pelas famílias em Portugal, novas e usadas, em cada trimestre (índice de preços da habitação). | É quanto mudaram num ano os preços de transação das casas compradas pelas famílias em Portugal, novas e usadas, em cada trimestre (índice de preços da habitação). | eurostat-tipsho20-descricao; glossario-hpi; rp4n-hpi-anual; document.edition; name |
| serie-remuneracao-bruta-mensal-media-real | em termos reais; in real terms | É a remuneração média antes de descontos de cada ano contada nos euros do ano que a unidade nomeia, isto é, descontada a subida dos preços desde esse ano (remuneração em termos reais). | É a remuneração média antes de descontos de cada ano contada nos euros do ano que a unidade nomeia, isto é, descontada a subida dos preços desde esse ano. | derivation; derivation_en; unit |

## Origens novas

| Origem | Documento ou corpo | Página ou caminho | sha256 |
|---|---|---|---|
| rp4n-orcamento | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 85 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-consolidacao | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 83 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-despesa-efetiva | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 83 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-despesa-primaria | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 83 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-receita-efetiva | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 86 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-saldo | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 87 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-ac-ss | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 49 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-funcional | Orçamento do Estado - Despesa por classificação funcional · content/20 Orcamento do Estado/source/dados-funcao.json | ["description"] | 43bb18f15b663e31b75ce6e09daaf68527aff412b1703319fcdb3e2496ddb8e7 |
| rp4n-madeira | BOLETIM MENSAL POR CONCELHOS · content/13 Dominios/source/rp4n/madeira.pdf | página física 15 | c93c48e256d5b6e05522968dc39e0a0289d25899065faa1dc40ba78f7e84c6ae |
| rp4n-madeira-fim-mes | BOLETIM MENSAL POR CONCELHOS · content/13 Dominios/source/rp4n/madeira.pdf | página física 15 | c93c48e256d5b6e05522968dc39e0a0289d25899065faa1dc40ba78f7e84c6ae |
| rp4n-evora-orcamento | PRESTAÇÃO DE CONTAS 2025 · content/13 Dominios/source/rp4n/evora-contas.pdf | página física 108 | e63102753216d573a3cd6f60a886919cd88ec53df88692c800214a546d47b13f |
| rp4n-evora-receita | PRESTAÇÃO DE CONTAS 2025 · content/13 Dominios/source/rp4n/evora-contas.pdf | página física 111 | e63102753216d573a3cd6f60a886919cd88ec53df88692c800214a546d47b13f |
| rp4n-evora-pmp | PRESTAÇÃO DE CONTAS 2025 · content/13 Dominios/source/rp4n/evora-contas.pdf | página física 141 | e63102753216d573a3cd6f60a886919cd88ec53df88692c800214a546d47b13f |
| rp4n-evora-pael | RELATÓRIO DE GESTÃO 2021 · content/13 Dominios/source/rp4n/evora-gestao.pdf | página física 66 | be0c8f8228552a27e48de3cbd2ea3a994d9020d1f2385ef6103f69afd282964a |
| rp4n-evora-saneamento | RELATÓRIO DE GESTÃO 2021 · content/13 Dominios/source/rp4n/evora-gestao.pdf | página física 81 | be0c8f8228552a27e48de3cbd2ea3a994d9020d1f2385ef6103f69afd282964a |
| rp4n-programas | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 72 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-passivos | Síntese da Execução Orçamental \| agosto 2026 · content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | página física 85 | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| rp4n-vab | European system of accounts: ESA 2010 · content/13 Dominios/source/rp4n/eurostat-esa2010-KS-02-13-269-EN.pdf | página física 313 | 9569393aefd24d7fed20e55f30e68850148004e45c70dd5af4eda73214349858 |
| rp4n-evora-divida-inicio | RELATÓRIO DE GESTÃO 2021 · content/13 Dominios/source/rp4n/evora-gestao.pdf | página física 30 | be0c8f8228552a27e48de3cbd2ea3a994d9020d1f2385ef6103f69afd282964a |
| rp4n-combustiveis | Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, monthly data · content/13 Dominios/source/rp3/174-eurostat-serie-ihpc-combustiveis-variacao-homologa.json | ["dimension", "coicop18", "category", "label", "CP0722"] | 5535ef96382360a8a8d1f59a993cb83caf181f86459ac98a21ac4444d277b4d1 |
| rp4n-combustiveis-ue | Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, monthly data · content/13 Dominios/source/rp3/175-eurostat-serie-ihpc-combustiveis-variacao-homologa-ue.json | ["dimension", "coicop18", "category", "label", "CP0722"] | 250d402db99b5d53e1a53cbbe67d2d2fbb272ca923e29ea7d616b2f89cc94a87 |
| rp4n-energia | Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, monthly data · content/13 Dominios/source/rp3/177-eurostat-serie-ihpc-energia-da-casa-variacao-homologa.json | ["dimension", "coicop18", "category", "label", "CP045"] | 11aebb54e809db8494f8171540ba030be142a6a75ad378ece7f4afa132b3be3e |
| rp4n-rendas | Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, monthly data · content/13 Dominios/source/rp3/176-eurostat-serie-ihpc-rendas-variacao-homologa.json | ["dimension", "coicop18", "category", "label", "CP041"] | 218c3642d68a874acc7e41b5c7dce682a2439776c13cfd5c34b4873b86639b26 |
| rp4n-hpi-anual | House price index - quarterly data · content/13 Dominios/source/rp3/178-eurostat-serie-precos-da-habitacao-variacao-homologa.json | ["dimension", "unit", "category", "label", "RCH_A"] | d43fd07bb52a2bb2f4788bd21cdd2cf441ce2fdb3eac25c85883a5fc7bfe5bd3 |

Os boletins e relatórios novos foram pedidos pelo cliente da casa, com corpo e recibo. O manual europeu foi copiado de um corpo já selado, conservando o recibo original. Os rótulos vêm dos corpos das próprias séries. A hora e o cliente são os dos recibos, incluindo o identificador histórico do corredor do Orçamento, sem o substituir por uma assinatura inventada.

## Partes que saíram

| Família ou série | Parte retirada |
|---|---|
| oe-2026-cem-euros-ministerio-administracao-interna; oe-2026-cem-euros-ministerio-agricultura-e-mar; oe-2026-cem-euros-ministerio-ambiente-e-energia; oe-2026-cem-euros-ministerio-cultura-juventude-e-desporto; oe-2026-cem-euros-ministerio-defesa-nacional; oe-2026-cem-euros-ministerio-economia-e-coesao-territorial; oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao; oe-2026-cem-euros-ministerio-financas; oe-2026-cem-euros-ministerio-infraestruturas-e-habitacao; oe-2026-cem-euros-ministerio-justica; oe-2026-cem-euros-ministerio-negocios-estrangeiros; oe-2026-cem-euros-ministerio-presidencia-do-conselho-de-ministros; oe-2026-cem-euros-ministerio-reforma-do-estado; oe-2026-cem-euros-ministerio-saude; oe-2026-cem-euros-ministerio-trabalho-solidariedade-e-seguranca-social | ; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. |
| oe-2026-cem-euros-ministerio-encargos-gerais-do-estado | ; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. |
| oe-2026-diferencas-consolidacao-funcional; execucao-2026-07-diferencas-consolidacao-funcional | : o acerto que se soma às funções para chegar ao total da despesa efetiva consolidada, e não uma função. |
| oe-2026-despesa-ministerio-administracao-interna; oe-2026-despesa-ministerio-agricultura-e-mar; oe-2026-despesa-ministerio-ambiente-e-energia; oe-2026-despesa-ministerio-cultura-juventude-e-desporto; oe-2026-despesa-ministerio-defesa-nacional; oe-2026-despesa-ministerio-economia-e-coesao-territorial; oe-2026-despesa-ministerio-educacao-ciencia-e-inovacao; oe-2026-despesa-ministerio-financas; oe-2026-despesa-ministerio-infraestruturas-e-habitacao; oe-2026-despesa-ministerio-justica; oe-2026-despesa-ministerio-negocios-estrangeiros; oe-2026-despesa-ministerio-presidencia-do-conselho-de-ministros; oe-2026-despesa-ministerio-reforma-do-estado; oe-2026-despesa-ministerio-saude; oe-2026-despesa-ministerio-trabalho-solidariedade-e-seguranca-social | , em despesa bruta |
| oe-2026-despesa-ministerio-administracao-interna; oe-2026-despesa-ministerio-agricultura-e-mar; oe-2026-despesa-ministerio-ambiente-e-energia; oe-2026-despesa-ministerio-cultura-juventude-e-desporto; oe-2026-despesa-ministerio-defesa-nacional; oe-2026-despesa-ministerio-economia-e-coesao-territorial; oe-2026-despesa-ministerio-educacao-ciencia-e-inovacao; oe-2026-despesa-ministerio-financas; oe-2026-despesa-ministerio-infraestruturas-e-habitacao; oe-2026-despesa-ministerio-justica; oe-2026-despesa-ministerio-negocios-estrangeiros; oe-2026-despesa-ministerio-presidencia-do-conselho-de-ministros; oe-2026-despesa-ministerio-reforma-do-estado; oe-2026-despesa-ministerio-saude; oe-2026-despesa-ministerio-trabalho-solidariedade-e-seguranca-social | ; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. |
| oe-2026-despesa-ministerio-encargos-gerais-do-estado | , em despesa bruta |
| oe-2026-despesa-ministerio-encargos-gerais-do-estado | ; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. |
| oe-2026-despesa-programa-001; oe-2026-despesa-programa-002; oe-2026-despesa-programa-003; oe-2026-despesa-programa-004; oe-2026-despesa-programa-005; oe-2026-despesa-programa-006; oe-2026-despesa-programa-007; oe-2026-despesa-programa-008; oe-2026-despesa-programa-009; oe-2026-despesa-programa-010; oe-2026-despesa-programa-011; oe-2026-despesa-programa-012; oe-2026-despesa-programa-013; oe-2026-despesa-programa-014; oe-2026-despesa-programa-015; oe-2026-despesa-programa-016; oe-2026-despesa-programa-017; oe-2026-despesa-programa-018; oe-2026-despesa-programa-019; oe-2026-despesa-programa-020 | , em despesa bruta |
| oe-2026-despesa-programa-001; oe-2026-despesa-programa-002; oe-2026-despesa-programa-003; oe-2026-despesa-programa-004; oe-2026-despesa-programa-005; oe-2026-despesa-programa-006; oe-2026-despesa-programa-007; oe-2026-despesa-programa-008; oe-2026-despesa-programa-009; oe-2026-despesa-programa-010; oe-2026-despesa-programa-011; oe-2026-despesa-programa-012; oe-2026-despesa-programa-013; oe-2026-despesa-programa-014; oe-2026-despesa-programa-015; oe-2026-despesa-programa-016; oe-2026-despesa-programa-017; oe-2026-despesa-programa-018; oe-2026-despesa-programa-019; oe-2026-despesa-programa-020 | ; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. |
| oe-2026-saldo-global-administracao-central-seguranca-social; execucao-2026-08-saldo-global-administracao-central-seguranca-social | ; não é a dívida que se emitiu. |
| oe-2026-passivos-financeiros-liquidos-administracao-central-seguranca-social; execucao-2026-08-passivos-financeiros-liquidos-administracao-central-seguranca-social | ; não é a parte da despesa paga com dívida. |
| oe-2026-despesa-bruta-administracao-central | , em bruto |
| oe-2026-despesa-bruta-administracao-central | ; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. |
| oe-2026-receita-bruta-administracao-central | , em bruto; a receita bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma. |
| oe-2026-despesa-consolidada-administracao-central; oe-2026-despesa-consolidada-seguranca-social; oe-2026-despesa-total | : sem as transferências entre os serviços de que é feita, mas com as operações financeiras. |
| oe-2026-receita-consolidada-administracao-central; oe-2026-receita-consolidada-seguranca-social | : sem as transferências entre os serviços de que é feita, mas com as operações financeiras. |
| evora-divida-inicio-mandato-reexpressa | : reexpressa quer dizer apresentada de novo mais tarde. |
| evora-pelouros-2021-presidente; evora-pelouros-2021-vice-presidente; evora-pelouros-2025-presidente; evora-pelouros-2025-vice-presidente; evora-pelouros-2025-vereadora | : cada pelouro é uma área da câmara a seu cargo. |
| avisos-pt2030-abertos | É o número de avisos de candidatura que estavam abertos. |
| avisos-pt2030-pessoas-singulares | É o número de avisos de candidatura abertos a pessoas singulares. |
| ciclo-substituicao-condutas | É o ciclo de substituição das condutas de água, em anos. |
| agua-nao-faturada-portugal | É a parte da água que não é faturada |
| agua-nao-faturada-portugal | , pelo relatório anual dos serviços de águas e resíduos. |
| factor-sustentabilidade | : abaixo de um, a pensão baixa, e o que falta para chegar a um é a parte que se corta. |
| serie-remuneracao-bruta-mensal-media-real |  (remuneração em termos reais) |

A contagem destas partes usa a comparação sequencial das partes em português: conta uma parte antiga `diz` quando o trecho correspondente passou a pontuação, ausência ou desapareceu. Uma substituição por outra parte `diz` conta como reescrita e fica na tabela seguinte. A falta de apoio literal motivou as supressões; não se pretende provar que a afirmação retirada é falsa.

## Trechos reescritos

| Família ou série | Antes | Depois |
|---|---|---|
| execucao-2026-08-despesa-programa-001; execucao-2026-08-despesa-programa-002; execucao-2026-08-despesa-programa-003; execucao-2026-08-despesa-programa-004; execucao-2026-08-despesa-programa-005; execucao-2026-08-despesa-programa-006; execucao-2026-08-despesa-programa-007; execucao-2026-08-despesa-programa-008; execucao-2026-08-despesa-programa-009; execucao-2026-08-despesa-programa-010; execucao-2026-08-despesa-programa-011; execucao-2026-08-despesa-programa-012; execucao-2026-08-despesa-programa-013; execucao-2026-08-despesa-programa-014; execucao-2026-08-despesa-programa-015; execucao-2026-08-despesa-programa-016; execucao-2026-08-despesa-programa-017; execucao-2026-08-despesa-programa-018; execucao-2026-08-despesa-programa-019; execucao-2026-08-despesa-programa-020 | : sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam. | : sem operações com ativos e passivos financeiros nem os fluxos internos ao programa. |
| execucao-2026-08-subtotal-programas | : cada programa sem as suas transferências internas, mas com as transferências entre programas ainda por tirar. | : cada programa sem os seus fluxos internos. |
| oe-2026-receita-efetiva-administracao-central; execucao-2026-07-receita-efetiva-administracao-central; execucao-2026-08-receita-efetiva-administracao-central | : o que ela recebe sem contar os recebimentos de ativos e passivos financeiros. | : o que ela recebe sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência. |
| oe-2026-receita-efetiva-administracao-central-seguranca-social; execucao-2026-08-receita-efetiva-administracao-central-seguranca-social | : o que recebem sem contar os recebimentos de ativos e passivos financeiros. | : o que recebem sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência. |
| oe-2026-despesa-primaria-administracao-central; execucao-2026-07-despesa-primaria-administracao-central | É a despesa da administração central sem os juros da dívida | É a despesa efetiva da administração central sem a rubrica de juros e outros encargos |
| oe-2026-saldo-primario-administracao-central; execucao-2026-07-saldo-primario-administracao-central | É o saldo da administração central sem os juros da dívida | É a receita efetiva da administração central menos a despesa primária |
| evora-prr-aprovado | São as verbas do Plano de Recuperação e Resiliência aprovadas para projetos no concelho | São as verbas contratadas do Plano de Recuperação e Resiliência por beneficiários intermediários e diretos com sede no concelho |
| evora-prr-pago | São as verbas do Plano de Recuperação e Resiliência já pagas a projetos no concelho | São as verbas pagas do Plano de Recuperação e Resiliência a beneficiários intermediários e diretos com sede no concelho |
| evora-prr-vencido-aprovado | São as verbas aprovadas em projetos no concelho cujo prazo de conclusão já passou | São as verbas contratadas por beneficiários intermediários e diretos com sede no concelho, com prazo de conclusão anterior ao instantâneo e sem conclusão registada |
| penalizacao-antecipacao-um-ano-neutra | É o corte na pensão por um ano de antecipação da reforma que deixaria o sistema de pensões sem ganhar nem perder | São cálculos sobre o efeito da antecipação da idade de reforma |
| empresas | Conta as empresas não financeiras | Conta as empresas |
| serie-ihpc-combustiveis-variacao-homologa-ue |  os preços dos combustíveis |  os preços dos combustíveis e lubrificantes para transporte pessoal |
| serie-ihpc-combustiveis-variacao-homologa |  os preços dos combustíveis |  os preços dos combustíveis e lubrificantes para transporte pessoal |
| serie-ihpc-energia-da-casa-variacao-homologa |  os preços da energia usada em casa |  os preços da eletricidade, do gás e de outros combustíveis |

## Plantas permanentes

A proibição do nome percorre também as alternativas `ou` e os apoios misturados. A obrigação do selo das origens novas vem da exportação do motor, para que apagar o selo não permita regressar ao tratamento das origens antigas. Cada planta afirma a mensagem pela qual falha.

| Planta | Mensagem pela qual falha |
|---|---|
| excerto com uma palavra inventada | K16 · origem «rp4n-orcamento»: o excerto ou o selo difere da origem exportada pelo motor |
| selo com outro cliente | K16 · origem «rp4n-orcamento»: o excerto ou o selo difere da origem exportada pelo motor |
| selo com outra página | K16 · origem «rp4n-orcamento»: o excerto ou o selo difere da origem exportada pelo motor |
| tipo do selo apagado | K16 · origem «rp4n-orcamento»: o excerto ou o selo difere da origem exportada pelo motor |
| selo inteiro apagado | K16 · origem «rp4n-orcamento»: o excerto ou o selo difere da origem exportada pelo motor |
| nome do projeto de volta numa família | K17 · famílias · oe-2026-despesa-funcao-01, oe-2026-despesa-funcao-02, oe-2026-despesa-funcao-03, oe-2026-despesa-funcao-04, oe-2026-despesa-funcao-05, oe-2026-despesa-funcao-06, oe-2026-despesa-funcao-07, oe-2026-despesa-funcao-08, oe-2026-despesa-funcao-09, oe-2026-despesa-funcao-10, parte 1 («É o que a administração central prevê gastar nesta função…»): o nome do projeto não pode apoiar uma frase |
| nome do projeto de volta numa série | K17 · séries · «serie-ihpc-rendas-variacao-homologa», parte 1 («É quanto mudaram»): o nome do projeto não pode apoiar uma frase |
| ausência declarada quando há excerto | K17 · famílias · avisos-pt2030-abertos, parte 1 («Não há excerto da fonte que permita explicar este número.»): a ausência não corresponde à falta do excerto |
| seleção calculada sem resumo do ficheiro | K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): a seleção calculada de «evora-prr-aprovado-2026» não tem ficheiros selados |
| nome numa alternativa simples | K17 · famílias · oe-2026-despesa-funcao-01, oe-2026-despesa-funcao-02, oe-2026-despesa-funcao-03, oe-2026-despesa-funcao-04, oe-2026-despesa-funcao-05, oe-2026-despesa-funcao-06, oe-2026-despesa-funcao-07, oe-2026-despesa-funcao-08, oe-2026-despesa-funcao-09, oe-2026-despesa-funcao-10, parte 1 («É o que a administração central prevê gastar nesta função…»): o nome do projeto não pode apoiar uma frase |
| nome numa alternativa aninhada | K17 · famílias · oe-2026-despesa-funcao-01, oe-2026-despesa-funcao-02, oe-2026-despesa-funcao-03, oe-2026-despesa-funcao-04, oe-2026-despesa-funcao-05, oe-2026-despesa-funcao-06, oe-2026-despesa-funcao-07, oe-2026-despesa-funcao-08, oe-2026-despesa-funcao-09, oe-2026-despesa-funcao-10, parte 1 («É o que a administração central prevê gastar nesta função…»): o nome do projeto não pode apoiar uma frase |
| nome misturado com uma origem válida | K17 · séries · «serie-ihpc-rendas-variacao-homologa», parte 1 («É quanto mudaram»): o nome do projeto não pode apoiar uma frase |
| texto simples numa página construída (pt) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| marca em inglês numa página construída (pt) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| texto partido numa página construída (pt) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| marca sem texto numa página construída (pt) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| texto simples numa página construída (en) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| marca em inglês numa página construída (en) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| texto partido numa página construída (en) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| marca sem texto numa página construída (en) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| marca num documento citado (pt) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| marca num documento citado (en) | RP4N: uma página de leitor contém uma marca de informação por confirmar |
| motor: rótulo trocado | VR1: o rótulo exportado difere do corpo |
| motor: resumo trocado | VR1: o sha256 do rótulo difere do corpo |
| motor: caminho inexistente | VR1: o caminho do rótulo não existe no corpo |
| motor: categoria retirada | VR1: os rótulos, as coordenadas ou os selos diferem das séries |
| motor: selo de outro pedido | VR1: os rótulos, as coordenadas ou os selos diferem das séries |
| motor: palavra acrescentada | RO1: o excerto difere da leitura literal do documento |
| motor: resumo de outro documento | RO1: o sha256 da origem difere do documento |
| motor: cliente inventado | RO1: as origens ou os selos diferem da seleção e dos recibos |
| motor: origem apagada | RO1: as origens ou os selos diferem da seleção e dos recibos |
| motor: caminho fora do motor | RO1: o ficheiro da origem não existe dentro do motor |

## Conferências diretamente tocadas

| Conferência | Cabeça | Código lido |
|---|---|---:|
| npm run check:series | `099289ef243a0c920719240b0aa8410b3e91d0b9` | 0 |
| node scripts/check-cruzamento.mjs --with-origin | `099289ef243a0c920719240b0aa8410b3e91d0b9` | 0 |
| npm run check:cartao | `579c9dd463f98753c05c4e16ff2bb73a856adf6d` | 0 |
| npm run check:privacidade | `579c9dd463f98753c05c4e16ff2bb73a856adf6d` | 0 |

## Pacote da leitura a frio

Há 5 cópias com estragos em `leitura-frio/`, com as mensagens esperadas em `leitura-frio/plantas.json`. `plantar-copias.mjs` volta a ler os ficheiros e afirma a mensagem de cada falha. O diff do motor está em `leitura-frio/motor.diff`; os corpos completos continuam na worktree do motor.

Os recibos HTML completos, antes e depois, estão nas pastas `antes/recibos/` e `depois/recibos/`. Incluem Orçamento, execução, Évora, Madeira, pensão e uma série do Eurostat, nas duas edições. As imagens estão em `design/especime-v3/capturas/rp4n-2026-10-06/`. Os tamanhos e resumos de cada captura estão nos respetivos `capturas.json`.

| Capturas | Total | Problemas medidos |
|---|---:|---:|
| antes | 60 | 0 |
| depois | 60 | 0 |

## Questões abertas

- **RP4N-1. Informação por confirmar fora das frases.** O portão HTML novo recusa também os marcadores antigos de excertos, endereços, datas, títulos e pessoas, além da referência à marca na página de método. A lista completa das páginas está em `depois/medidas.json`. Resolver estes casos exige confirmar as fontes ou rever a publicação desses conteúdos. A proteção anterior do nome de pessoa, I77, permanece intacta. Não se trocou um marcador por um vazio para declarar um portão verde.

- **RP4N-2. Relatório das pensões.** O pedido pelo cliente da casa falhou na validação do certificado. O recibo da falha fica no motor; não conta como origem selada. A frase passou a dizer apenas o que o excerto já alojado suporta, e a explicação sem apoio do fator saiu. Não se desativou a validação do certificado.

- **RP4N-3. Vocabulário do PRR fora destas frases.** As frases passaram a respeitar as colunas e os filtros selados, incluindo verbas contratadas e sede dos beneficiários. Os nomes e outras apresentações anteriores do indicador precisam de leitura própria; não se alterou a medida nem a sua conta neste bloco.

- **RP4N-4. Leitura independente e conferência da direção.** A leitura a frio do Opus e a conferência final da direção ainda não foram realizadas nesta sessão. O pacote está preparado para essas etapas. Esta nota é da primeira passagem. A passagem de correção pedida depois está documentada no fim.

Não houve publicação nem envio para o remoto. Não foi exposta uma linha «tokens used» nesta sessão; não se estima o custo.

## Commits do código disponíveis ao gerar o relatório

Sítio:

```text
6c55ab9762c752e0096716d2f469f015ed863723 Selar as frases das famílias e séries nas palavras das fontes
d3d1a17abdc64483be0455e9e596163113a15b0c Prender a frase da União à origem da própria série
099289ef243a0c920719240b0aa8410b3e91d0b9 Recusar marcas de informação por confirmar nas páginas
0b76a326c5713e7037052cf5d62bf69fbfe4be71 Aplicar a recusa também aos documentos citados
5579bf0498430fc5642dd392d0c0a645e27a95dc Completar a receita efetiva com a exclusão dos saldos de gerência
d95a46e3e0baf19c87af86033baa2b6c27eb2e4e Recusar o nome também nas alternativas e nos apoios misturados
579c9dd463f98753c05c4e16ff2bb73a856adf6d Exigir o selo documental mesmo quando o apagam da origem
```

Motor:

```text
6510a935282206f8cf41a2ab1881ef2760b53ea6 Selar os rótulos das coordenadas das séries do Eurostat
5561606136a357d6efbae8dbee4d84a0cd08693c Extrair e conferir as origens documentais das frases do RP4-n
eb4a5cbb0e4abe7cc44919a3679ce6fbad3bf369 Ler os combustíveis da União no corpo da própria série
```

## A passagem RP4-n-b

A célula e os títulos foram corrigidos, mas a passagem não fecha: há marcas fora dos tipos autorizados na RP4N-1. A RP4N-5 fica à decisão da direção. Não se declarou um portão verde nem se ampliou a lista de exceções.

A regra aplicada recusa sempre marcas nas frases «o que é», nos nomes e rótulos de medidas, séries e lugares, nos títulos de estudos, nas leituras de cartões, na primeira página e nas explicações. Uma exceção de recibo dentro dessas superfícies continua recusada. Fora delas, só se aceitam as ausências enumeradas na RP4N-1. Qualquer outro tipo é recusado.

O campo que recebe uma exceção tem de existir no livro e ser exatamente a marca de ausência. A proteção I77 dos mandatos permanece no portão; os parágrafos já publicados sobre essa identidade só são aceites na obra respetiva e com o texto intacto, conferido por resumo. A referência do Método está presa ao seu parágrafo, e uma demonstração isolada da marca no Método ou no Sobre não autoriza prosa por confirmar. As células anteriores de fontes e de pessoas mantêm-se.

Os títulos dos estudos da água conservaram o texto publicado. Na edição inglesa levam `lang="pt"`, sem marca nem ligação do título para a página «to verify». A mudança vive no componente comum, incluindo os índices, o registo e os recibos. Não se escreveu uma tradução.

As contagens abaixo aplicam a mesma célula aos dois estados do HTML. Os resumos de cada página anterior são comparados com `depois/medidas.json` da primeira passagem; o total também é afirmado. A célula anterior recusava todas as ocorrências, sem distinguir tipos.

| Estado | Páginas com marcas | Aceites pela RP4N-1 | Recusadas pela RP4N-1 |
|---|---:|---:|---:|
| Antes | 46 | 78 | 149 |
| Depois | 42 | 78 | 136 |

| Decisão | Tipo | Antes | Depois |
|---|---|---:|---:|
| aceites | data | 44 | 44 |
| aceites | excerto | 16 | 16 |
| aceites | endereco | 10 | 10 |
| aceites | pessoa-I77 | 6 | 6 |
| aceites | referencia-metodo | 2 | 2 |
| aceites | referencia-sobre | 0 | 0 |
| recusadas | o-que-e-linha | 0 | 0 |
| recusadas | o-que-e-familia | 0 | 0 |
| recusadas | o-que-e-serie | 0 | 0 |
| recusadas | nome-medida | 0 | 0 |
| recusadas | nome-serie | 0 | 0 |
| recusadas | nome-lugar | 0 | 0 |
| recusadas | titulo-estudo | 13 | 0 |
| recusadas | leitura-cartao | 0 | 0 |
| recusadas | primeira-pagina | 0 | 0 |
| recusadas | explicacao | 0 | 0 |
| recusadas | fora-dos-tipos | 136 | 136 |

**RP4N-5. Tipos que a lista da decisão não abrange.** A enumeração do mandato não inclui todos os contextos existentes. Segue a discriminação medida. A marca do publicador ausente e a do título de um documento ausente não foram tratadas como endereços. Os selos são projeções da proveniência incompleta, mas não foram aceites como campos de recibo. A página da própria marca e a referência no livro também não foram acrescentadas às páginas autorizadas. As notas de alcance continuaram recusadas.

| Superfície fora dos tipos | Antes | Depois |
|---|---:|---:|
| document.edition | 8 | 8 |
| document.title | 8 | 8 |
| nota-alcance | 4 | 4 |
| pagina-da-marca | 4 | 4 |
| referencia-no-livro | 2 | 2 |
| selo-proveniencia | 98 | 98 |
| source | 12 | 12 |

Foi pedida decisão para dizer a ausência exata por palavras nos casos não abrangidos, conservando as conferências de proveniência. Sem resposta registada, essa alteração não foi executada. A decisão é necessária porque a RP4N-1 manda recusar qualquer tipo fora da lista e porque os portões envolvidos protegem uma fonte.

### Cabeças do código e códigos lidos

| Repositório | Cabeça do código conferido |
|---|---|
| sítio | `04d28781e576904f97d944d7493bb1d39c204343` |
| motor, intacto | `eb4a5cbb0e4abe7cc44919a3679ce6fbad3bf369` |

| Portão | Ficheiro | Código lido |
|---|---|---:|
| build | `portoes-b/build.codigo` | 1 |
| verify | `portoes-b/verify.codigo` | 1 |
| typecheck | `portoes-b/typecheck.codigo` | 0 |
| língua, conferência afetada corrida separadamente | `conferencias-b/lingua.codigo` | 0 |
| motor, corrida anterior na mesma cabeça | `portoes/motor.codigo` | 0 |

O motor não mudou e não teve nova corrida. Os comandos posteriores a um portão que falhou numa cadeia não se consideram executados. Os registos dos portões são conservados com os caminhos da máquina substituídos, sem códigos de cor nem espaços no fim das linhas.

### Plantas e mensagens

As 50 plantas afirmam a mensagem, o lado da decisão e a contagem da ocorrência e da página. Correm também dentro do `gate:html`.

| Planta | Decisão | Mensagem | Contagem afirmada |
|---|---|---|---:|
| o-que-e-linha (pt) | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| o-que-e-linha (en) | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| o-que-e-familia (pt) | recusadas | RP4N: marca recusada em o-que-e-familia | 1 |
| o-que-e-familia (en) | recusadas | RP4N: marca recusada em o-que-e-familia | 1 |
| o-que-e-serie (pt) | recusadas | RP4N: marca recusada em o-que-e-serie | 1 |
| o-que-e-serie (en) | recusadas | RP4N: marca recusada em o-que-e-serie | 1 |
| nome-medida (pt) | recusadas | RP4N: marca recusada em nome-medida | 1 |
| nome-medida (en) | recusadas | RP4N: marca recusada em nome-medida | 1 |
| nome-serie (pt) | recusadas | RP4N: marca recusada em nome-serie | 1 |
| nome-serie (en) | recusadas | RP4N: marca recusada em nome-serie | 1 |
| nome-lugar (pt) | recusadas | RP4N: marca recusada em nome-lugar | 1 |
| nome-lugar (en) | recusadas | RP4N: marca recusada em nome-lugar | 1 |
| titulo-estudo (pt) | recusadas | RP4N: marca recusada em titulo-estudo | 1 |
| titulo-estudo (en) | recusadas | RP4N: marca recusada em titulo-estudo | 1 |
| leitura-cartao (pt) | recusadas | RP4N: marca recusada em leitura-cartao | 1 |
| leitura-cartao (en) | recusadas | RP4N: marca recusada em leitura-cartao | 1 |
| primeira-pagina (pt) | recusadas | RP4N: marca recusada em primeira-pagina | 1 |
| primeira-pagina (en) | recusadas | RP4N: marca recusada em primeira-pagina | 1 |
| explicacao (pt) | recusadas | RP4N: marca recusada em explicacao | 1 |
| explicacao (en) | recusadas | RP4N: marca recusada em explicacao | 1 |
| fora-dos-tipos (pt) | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| fora-dos-tipos (en) | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| data published_at | aceites | RP4N: marca aceite provisoriamente (data) | 1 |
| data access_date | aceites | RP4N: marca aceite provisoriamente (data) | 1 |
| data reference_date | aceites | RP4N: marca aceite provisoriamente (data) | 1 |
| data document.computed_over.files.0.snapshot_date | aceites | RP4N: marca aceite provisoriamente (data) | 1 |
| data pelo componente de datas | aceites | RP4N: marca aceite provisoriamente (data) | 1 |
| excerto ausente | aceites | RP4N: marca aceite provisoriamente (excerto) | 1 |
| marca partida entre elementos de um excerto | aceites | RP4N: marca aceite provisoriamente (excerto) | 1 |
| declaração proibida numa parte da marca | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| endereço ausente | aceites | RP4N: marca aceite provisoriamente (endereco) | 1 |
| data ausente na agenda | aceites | RP4N: marca aceite provisoriamente (data) | 1 |
| proteção da pessoa na I77 | aceites | RP4N: marca aceite provisoriamente (pessoa-I77) | 1 |
| referência à marca em metodo | aceites | RP4N: marca aceite provisoriamente (referencia-metodo) | 1 |
| referência à marca em sobre | aceites | RP4N: marca aceite provisoriamente (referencia-sobre) | 1 |
| texto partido | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| entidades | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| classe vazia | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| declaração sem texto | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| campo permitido dentro de o-que-e-linha | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| campo permitido dentro de leitura-cartao | recusadas | RP4N: marca recusada em leitura-cartao | 1 |
| campo permitido dentro de titulo-estudo | recusadas | RP4N: marca recusada em titulo-estudo | 1 |
| campo permitido dentro de primeira-pagina | recusadas | RP4N: marca recusada em primeira-pagina | 1 |
| campo permitido dentro de explicacao | recusadas | RP4N: marca recusada em explicacao | 1 |
| campo sem linha no livro | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| campo não permitido | recusadas | RP4N: marca recusada em nome-medida | 1 |
| afirmação acrescentada ao campo de excerto | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| pessoa fora do mandato protegido | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| afirmação em metodo | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| afirmação em sobre | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |

A conferência dos títulos também correu sobre cópias do HTML construído. Código lido de `conferencias-b/titulos.codigo`: 0. As 4 plantas da A4 abaixo confirmam a recusa da marca nas páginas e de uma declaração de título por confirmar, mesmo sem marca rendida.

| Planta da A4 | Mensagens afirmadas | Código esperado e observado |
|---|---|---:|
| marca num título de estudo no registo | A4: en/corrections/index.html: evora-2027-capital-europeia-da-cultura/en tem uma marca num título de estudo. | 1 |
| marca num título de estudo no país | A4: index.html: evora-2027-capital-europeia-da-cultura/pt tem uma marca num título de estudo. | 1 |
| marca num título de estudo no índice inglês | A4: en/studies/index.html: evora-contas-da-camara-2010-2025/en tem uma marca num título de estudo. | 1 |
| título declarado por confirmar mesmo sem marca | A4: correcoes/index.html: o título de evora-2027-prometido-painel-dinheiro/pt está declarado por confirmar. | 1 |

### Páginas com marcas aceites para o bloco dos recibos

| Página | Ocorrências aceites por tipo |
|---|---|
| `dist/agenda/index.html` | data: 11 |
| `dist/areas/ambiente-e-energia/index.html` | data: 1 |
| `dist/en/agenda/index.html` | data: 11 |
| `dist/en/areas/ambiente-e-energia/index.html` | data: 1 |
| `dist/en/ledger/agua-nao-faturada-portugal-2024/index.html` | endereco: 1; excerto: 1 |
| `dist/en/ledger/avisos-pt2030-abertos/index.html` | data: 1; endereco: 1; excerto: 1 |
| `dist/en/ledger/avisos-pt2030-pessoas-singulares/index.html` | data: 1; endereco: 1; excerto: 1 |
| `dist/en/ledger/ciclo-substituicao-condutas/index.html` | data: 2; endereco: 1; excerto: 1 |
| `dist/en/ledger/evora-prr-aprovado-2026/index.html` | excerto: 1 |
| `dist/en/ledger/evora-prr-pago-2026/index.html` | excerto: 1 |
| `dist/en/ledger/evora-prr-vencido-aprovado-2026/index.html` | excerto: 1 |
| `dist/en/ledger/index.html` | data: 5 |
| `dist/en/ledger/saldo-natural-portugal-2025/index.html` | data: 1; endereco: 1; excerto: 1 |
| `dist/en/method/index.html` | referencia-metodo: 1 |
| `dist/en/municipalities/evora/index.html` | pessoa-I77: 1 |
| `dist/estudos/evora-quem-governou-a-camara-2009-2025/documento/index.html` | pessoa-I77: 2 |
| `dist/estudos/evora-quem-governou-a-camara-2009-2025/index.html` | pessoa-I77: 2 |
| `dist/livro-razao/agua-nao-faturada-portugal-2024/index.html` | endereco: 1; excerto: 1 |
| `dist/livro-razao/avisos-pt2030-abertos/index.html` | data: 1; endereco: 1; excerto: 1 |
| `dist/livro-razao/avisos-pt2030-pessoas-singulares/index.html` | data: 1; endereco: 1; excerto: 1 |
| `dist/livro-razao/ciclo-substituicao-condutas/index.html` | data: 2; endereco: 1; excerto: 1 |
| `dist/livro-razao/evora-prr-aprovado-2026/index.html` | excerto: 1 |
| `dist/livro-razao/evora-prr-pago-2026/index.html` | excerto: 1 |
| `dist/livro-razao/evora-prr-vencido-aprovado-2026/index.html` | excerto: 1 |
| `dist/livro-razao/index.html` | data: 5 |
| `dist/livro-razao/saldo-natural-portugal-2025/index.html` | data: 1; endereco: 1; excerto: 1 |
| `dist/metodo/index.html` | referencia-metodo: 1 |
| `dist/municipios/evora/index.html` | pessoa-I77: 1 |

A lista com cada ocorrência, contexto e resumo da página está em `depois-b/medidas.json`. As ausências aceites ficam para o bloco dos recibos as dizer por palavras. Continuam abertas a questão do relatório das pensões (RP4N-2), a leitura do vocabulário do PRR (RP4N-3) e a leitura a frio com a conferência da direção (RP4N-4). Não se fez fusão nem publicação.

### Comandos e commits

```sh
node design/especime-v3/medicoes/rp4n-2026-10-06/medir-b.mjs antes <copia-do-HTML-anterior>
node tests/cartao/rp4nb.mjs --registo
RESEARCHHUB_DIR=<motor> sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4n-2026-10-06/portoes-b
node design/especime-v3/medicoes/rp4n-2026-10-06/medir-b.mjs depois
node design/especime-v3/medicoes/rp4n-2026-10-06/conferir-titulos-b.mjs
node scripts/check-lingua.mjs
RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/relatar-b.py
```

Commits desta passagem antes do commit final do relatório e dos códigos:

```text
f16184581c55bd85512049713001341960130dc8 Mostrar os títulos publicados dos estudos sem marca de tradução
50a76a9ed1dc783452b87ee261974286f92bbe73 Separar as marcas de afirmação das ausências autorizadas pela RP4N-1
049da3f073a2c4a7abaa343beb8a626240a77d9a Distinguir a frase do cartão da frase de família no inventário
12fb070175d279dd1da3bc773e5d1a7424d1e17d Exigir a ausência exata no campo e discriminar as marcas não abrangidas
902971ccd7edda2c40901d19066e2ceb3b7a0384 Gerar o relatório da passagem com as contagens e os códigos medidos
5de3a2ac369ab7d5b3ed5009bbd88454eff8fcf7 Contar uma marca partida sem duplicar a classe e manter a recusa
f8830e02027e2b45c56faf8c7c4b540d497ae4d0 Conferir os campos de data documentais e as duas formas de os render
6b00cd640018ad9ee45fc46884ff9bcd27d99fe6 Recusar um título declarado por confirmar mesmo sem marca rendida
2084ba6b2f31bb461d4013f88dcde581db1f9789 Ligar a medição anterior à cabeça com os trailers conferidos
04d28781e576904f97d944d7493bb1d39c204343 Guardar também as plantas e os códigos da proteção dos títulos
3f755bb7ef20c08890ef9f7b6655a82a5dc2ba4e Guardar a medição final e os registos dos portões da RP4-n-b
```

O último commit contém apenas o relatório e os registos dos códigos. A cabeça final do sítio é a desse commit e comunica-se no fecho; a cabeça final do motor é a indicada acima. O modelo do construtor foi indicado no mandato como `gpt-6-astra`, com raciocínio `xhigh`. Não foi exposta uma linha de consumo acumulado nesta sessão e não se estima o custo.

## A passagem RP4-n-c

A construção fecha a RP4N-5 com os portões a zero. A leitura independente e a conferência final da direção continuam por fazer.

A lista da RP4N-1 era incompleta. A decisão RP4N-5 conserva o critério: a célula recusa a marca nas frases «o que é», nos nomes e rótulos de medidas, séries e lugares, nos títulos de estudos, nas leituras de cartões, na primeira página e nas explicações. Estas recusas têm prioridade sobre qualquer tipo aceite. Tudo o que não pertence a um tipo aceite continua recusado.

Aceita e conta as ausências de proveniência nos recibos e os lugares onde a casa explica a marca: datas, excertos, endereços, a pessoa protegida pela I77, as referências do Método e do Sobre e, agora, os selos de proveniência dos recibos (pedido, hora, cliente, sha256 e ficheiro), o publicador, o título e a edição do documento citado, as notas de alcance, a referência no livro-razão e a própria página da marca, nas duas edições.

Os campos de publicador, título e edição têm de coincidir exatamente com a ausência declarada na linha. Um selo precisa de apontar para uma linha existente com proveniência incompleta; as células anteriores continuam a conferir o seu texto, etiqueta e destino. A nota de alcance fica no recibo de uma linha existente. A referência do livro é uma amostra isolada, com a glosa inglesa opcional. A proteção I77 mantém-se. Nenhuma página, frase, medida ou fonte foi reescrita nesta passagem.

### Contagens antes e depois

O antes foi relido no HTML da passagem anterior e comparado com `depois-b/medidas.json`, incluindo o resumo de cada página. O depois foi medido após os portões. A medição exige as mesmas páginas e os mesmos contextos de ocorrência. A tabela discrimina retrospetivamente as superfícies recusadas no antes pelos tipos agora autorizados; não volta a somá-las em «fora-dos-tipos». Todos os algarismos abaixo vêm dos ficheiros de medição.

| Estado | Páginas com marcas | Aceites | Recusadas |
|---|---:|---:|---:|
| Antes | 42 | 78 | 136 |
| Depois | 42 | 214 | 0 |

| Tipo | Antes aceites | Antes recusadas | Depois aceites | Depois recusadas |
|---|---:|---:|---:|---:|
| data | 44 | 0 | 44 | 0 |
| excerto | 16 | 0 | 16 | 0 |
| endereco | 10 | 0 | 10 | 0 |
| pessoa-I77 | 6 | 0 | 6 | 0 |
| referencia-metodo | 2 | 0 | 2 | 0 |
| referencia-sobre | 0 | 0 | 0 | 0 |
| selo-proveniencia | 0 | 98 | 98 | 0 |
| publicador | 0 | 12 | 12 | 0 |
| titulo-documento | 0 | 8 | 8 | 0 |
| edicao-documento | 0 | 8 | 8 | 0 |
| nota-alcance | 0 | 4 | 4 | 0 |
| referencia-no-livro | 0 | 2 | 2 | 0 |
| pagina-da-marca | 0 | 4 | 4 | 0 |
| o-que-e-linha | 0 | 0 | 0 | 0 |
| o-que-e-familia | 0 | 0 | 0 | 0 |
| o-que-e-serie | 0 | 0 | 0 | 0 |
| nome-medida | 0 | 0 | 0 | 0 |
| nome-serie | 0 | 0 | 0 | 0 |
| nome-lugar | 0 | 0 | 0 | 0 |
| titulo-estudo | 0 | 0 | 0 | 0 |
| leitura-cartao | 0 | 0 | 0 | 0 |
| primeira-pagina | 0 | 0 | 0 | 0 |
| explicacao | 0 | 0 | 0 | 0 |
| fora-dos-tipos | 0 | 0 | 0 | 0 |

### Plantas novas e mensagens

As 20 plantas novas integram as 70 plantas da célula. Cada uma afirma a mensagem, a decisão, a contagem da ocorrência e a lista de páginas. As plantas anteriores permanecem intactas e todas correm dentro do portão HTML.

| Planta | Decisão | Mensagem | Contagem afirmada |
|---|---|---|---:|
| selo de proveniência incompleta | aceites | RP4N: marca aceite provisoriamente (selo-proveniencia) | 1 |
| selo de proveniência incompleta dentro de uma afirmação | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| publicador ausente | aceites | RP4N: marca aceite provisoriamente (publicador) | 1 |
| publicador ausente dentro de uma afirmação | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| título de documento ausente | aceites | RP4N: marca aceite provisoriamente (titulo-documento) | 1 |
| título de documento ausente dentro de uma afirmação | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| edição de documento ausente | aceites | RP4N: marca aceite provisoriamente (edicao-documento) | 1 |
| edição de documento ausente dentro de uma afirmação | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| nota de alcance no recibo | aceites | RP4N: marca aceite provisoriamente (nota-alcance) | 1 |
| nota de alcance no recibo dentro de uma afirmação | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| referência do livro | aceites | RP4N: marca aceite provisoriamente (referencia-no-livro) | 1 |
| referência do livro dentro de uma afirmação | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| página da própria marca | aceites | RP4N: marca aceite provisoriamente (pagina-da-marca) | 1 |
| página da própria marca dentro de uma afirmação | recusadas | RP4N: marca recusada em o-que-e-linha | 1 |
| selo sem recibo no livro | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| selo de proveniência completa | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| nota de alcance fora do recibo | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| referência do livro com afirmação | recusadas | RP4N: uma página de leitor contém uma marca de informação por confirmar | 1 |
| referência do livro com glosa | aceites | RP4N: marca aceite provisoriamente (referencia-no-livro) | 1 |
| página inglesa da própria marca | aceites | RP4N: marca aceite provisoriamente (pagina-da-marca) | 1 |

### Páginas com marcas aceites para o bloco dos recibos

| Página | Ocorrências aceites por tipo |
|---|---|
| `dist/a-verificar/index.html` | pagina-da-marca: 2 |
| `dist/agenda/index.html` | data: 11 |
| `dist/areas/ambiente-e-energia/index.html` | data: 1; selo-proveniencia: 2 |
| `dist/areas/economia-e-coesao-territorial/index.html` | selo-proveniencia: 5 |
| `dist/correcoes/index.html` | selo-proveniencia: 9 |
| `dist/en/agenda/index.html` | data: 11 |
| `dist/en/areas/ambiente-e-energia/index.html` | data: 1; selo-proveniencia: 2 |
| `dist/en/areas/economia-e-coesao-territorial/index.html` | selo-proveniencia: 5 |
| `dist/en/corrections/index.html` | selo-proveniencia: 9 |
| `dist/en/ledger/agua-nao-faturada-portugal-2024/index.html` | endereco: 1; excerto: 1 |
| `dist/en/ledger/avisos-pt2030-abertos/index.html` | data: 1; edicao-documento: 1; endereco: 1; excerto: 1; publicador: 1; titulo-documento: 1 |
| `dist/en/ledger/avisos-pt2030-pessoas-singulares/index.html` | data: 1; edicao-documento: 1; endereco: 1; excerto: 1; publicador: 1; titulo-documento: 1 |
| `dist/en/ledger/ciclo-substituicao-condutas/index.html` | data: 2; edicao-documento: 1; endereco: 1; excerto: 1; publicador: 1; titulo-documento: 1 |
| `dist/en/ledger/evora-prr-aprovado-2026/index.html` | excerto: 1 |
| `dist/en/ledger/evora-prr-pago-2026/index.html` | excerto: 1 |
| `dist/en/ledger/evora-prr-vencido-aprovado-2026/index.html` | excerto: 1 |
| `dist/en/ledger/index.html` | data: 5; publicador: 3; referencia-no-livro: 1; selo-proveniencia: 8 |
| `dist/en/ledger/retribuicao-minima-mensal-garantida-continente-2026/index.html` | nota-alcance: 1 |
| `dist/en/ledger/saldo-natural-portugal-2025/index.html` | data: 1; edicao-documento: 1; endereco: 1; excerto: 1; titulo-documento: 1 |
| `dist/en/ledger/taxa-de-emprego-2025/index.html` | nota-alcance: 1 |
| `dist/en/method/index.html` | referencia-metodo: 1 |
| `dist/en/municipalities/evora/index.html` | pessoa-I77: 1; selo-proveniencia: 4 |
| `dist/en/studies/evora-economia-e-dinheiro-publico-de-fora-da-camara/index.html` | selo-proveniencia: 13 |
| `dist/en/studies/evora-prometido-pago-auditado-2026/index.html` | selo-proveniencia: 8 |
| `dist/en/to-verify/index.html` | pagina-da-marca: 2 |
| `dist/estudos/evora-economia-e-dinheiro-publico-de-fora-da-camara/index.html` | selo-proveniencia: 13 |
| `dist/estudos/evora-prometido-pago-auditado-2026/index.html` | selo-proveniencia: 8 |
| `dist/estudos/evora-quem-governou-a-camara-2009-2025/documento/index.html` | pessoa-I77: 2 |
| `dist/estudos/evora-quem-governou-a-camara-2009-2025/index.html` | pessoa-I77: 2 |
| `dist/livro-razao/agua-nao-faturada-portugal-2024/index.html` | endereco: 1; excerto: 1 |
| `dist/livro-razao/avisos-pt2030-abertos/index.html` | data: 1; edicao-documento: 1; endereco: 1; excerto: 1; publicador: 1; titulo-documento: 1 |
| `dist/livro-razao/avisos-pt2030-pessoas-singulares/index.html` | data: 1; edicao-documento: 1; endereco: 1; excerto: 1; publicador: 1; titulo-documento: 1 |
| `dist/livro-razao/ciclo-substituicao-condutas/index.html` | data: 2; edicao-documento: 1; endereco: 1; excerto: 1; publicador: 1; titulo-documento: 1 |
| `dist/livro-razao/evora-prr-aprovado-2026/index.html` | excerto: 1 |
| `dist/livro-razao/evora-prr-pago-2026/index.html` | excerto: 1 |
| `dist/livro-razao/evora-prr-vencido-aprovado-2026/index.html` | excerto: 1 |
| `dist/livro-razao/index.html` | data: 5; publicador: 3; referencia-no-livro: 1; selo-proveniencia: 8 |
| `dist/livro-razao/retribuicao-minima-mensal-garantida-continente-2026/index.html` | nota-alcance: 1 |
| `dist/livro-razao/saldo-natural-portugal-2025/index.html` | data: 1; edicao-documento: 1; endereco: 1; excerto: 1; titulo-documento: 1 |
| `dist/livro-razao/taxa-de-emprego-2025/index.html` | nota-alcance: 1 |
| `dist/metodo/index.html` | referencia-metodo: 1 |
| `dist/municipios/evora/index.html` | pessoa-I77: 1; selo-proveniencia: 4 |

### Cabeças e códigos lidos

| Repositório | Cabeça do código conferido |
|---|---|
| sítio | `1296ca052d21e4eb5a63f9890638e8d04e3b0307` |
| motor, intacto | `eb4a5cbb0e4abe7cc44919a3679ce6fbad3bf369` |

| Portão | Ficheiro | Código lido |
|---|---|---:|
| build | `portoes-c/build.codigo` | 0 |
| verify | `portoes-c/verify.codigo` | 0 |
| typecheck | `portoes-c/typecheck.codigo` | 0 |

As cabeças de início e fim da corrida são iguais. Os portões correram inteiros pela tranca. Os registos foram conservados com os caminhos da máquina substituídos. O motor não mudou e não teve nova corrida.

### RP4N-6. Inventário da voz desfasado

A primeira corrida, na cabeça `7267f3c2c08b41f76abfac370c169aeee9e6aeec`, encontrou 618 problemas no portão da voz: 616 ocorrências das frases já publicadas por classificar e 2 declarações antigas ainda vivas que deixaram de se render. O diagnóstico completo está em `conferencias-c/voz-antes.json`.

As declarações antigas, com a qualificação não sustentada, passaram a retiradas; as frases já publicadas em `src/data/concelhos.mjs` e já conferidas em `tests/cartao/leituras-provadas.json` entraram como conteúdo. A revisão ficou registada como por ler. Não se alterou a frase das páginas, a medida, o número ou a fonte. A repetição integral dos portões confere esta sincronização.

| Frase já publicada | Ocorrências por classificar na primeira corrida |
|---|---:|
| Counts the enterprises attributed to the municipality (integrated business accounts system). | 308 |
| Conta as empresas atribuídas ao concelho (sistema de contas integradas das empresas). | 308 |

| Portão da primeira corrida | Ficheiro | Código lido |
|---|---|---:|
| build | `portoes-c-iniciais/build.codigo` | 1 |
| verify | `portoes-c-iniciais/verify.codigo` | 1 |
| typecheck | `portoes-c-iniciais/typecheck.codigo` | 0 |

Os comandos posteriores à falha da voz nas cadeias da primeira corrida não se consideram executados. Os códigos do fecho são os de `portoes-c`, na cabeça do código indicada acima.

### RP4N-7. A mesma sincronização no inventário dos rótulos

A segunda corrida, na cabeça `372777e1c896ac6b5d64dc8ec0ae0193e49ab0a1`, passou a voz e encontrou 4 diferenças no inventário dos rótulos. Eram as mesmas frases: a forma atual aparecia nas páginas e a forma antiga continuava na declaração. O comando `node scripts/inventario-rotulos.mjs --escrever` recontou o inventário. A comparação dos objetos afirma que só mudaram as 2 formas da dobra, com as contagens conservadas; todos os outros campos das entradas ficaram iguais. Os metadados da cabeça e das páginas também foram recontados pelo comando. O diagnóstico está em `conferencias-c/rotulos.json`.

| Chave | Antes na declaração | Depois na declaração |
|---|---:|---:|
| `concelho\|pt\|concelho:empresas` | 308 | 308 |
| `concelho\|en\|concelho:empresas` | 308 | 308 |

| Portão da segunda corrida | Ficheiro | Código lido |
|---|---|---:|
| build | `portoes-c-rotulos/build.codigo` | 0 |
| verify | `portoes-c-rotulos/verify.codigo` | 1 |
| typecheck | `portoes-c-rotulos/typecheck.codigo` | 0 |

A conferência dos rótulos e os passos que esta corrida não alcançou foram corridos separadamente antes da repetição integral. Não substituem os portões do fecho.

| Conferência | Ficheiro | Código lido |
|---|---|---:|
| rotulos | `conferencias-c/rotulos.codigo` | 0 |
| series | `conferencias-c/series.codigo` | 0 |
| indice-do-sitio | `conferencias-c/indice-do-sitio.codigo` | 0 |
| explicacoes | `conferencias-c/explicacoes.codigo` | 0 |
| frases-compostas | `conferencias-c/frases-compostas.codigo` | 0 |

### Pendências

Não sobrou nenhuma ocorrência fora dos tipos nem em superfície de afirmação. A RP4N-5 fica resolvida. A RP4N-6 e a RP4N-7 foram corrigidas pela sincronização dos inventários da voz e dos rótulos. As ausências aceites ficam inventariadas para o bloco dos recibos as dizer por palavras. Permanecem fora desta passagem o relatório das pensões (RP4N-2, falha de certificado já registada), a leitura do vocabulário do PRR (RP4N-3) e a leitura independente com a conferência final da direção (RP4N-4). Não houve fusão nem publicação.

### Comandos e commits

```sh
node design/especime-v3/medicoes/rp4n-2026-10-06/medir-c.mjs antes
node tests/cartao/rp4nb.mjs --registo-c
node scripts/inventario-rotulos.mjs --escrever
RESEARCHHUB_DIR=<motor> sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4n-2026-10-06/portoes-c
node design/especime-v3/medicoes/rp4n-2026-10-06/medir-c.mjs depois
RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/relatar-c.py
```

Commits da passagem antes do commit final do relatório e dos códigos:

```text
7267f3c2c08b41f76abfac370c169aeee9e6aeec Completar os tipos de marcas aceites pela decisão RP4N-5
372777e1c896ac6b5d64dc8ec0ae0193e49ab0a1 Sincronizar o inventário da voz com as frases já publicadas
1296ca052d21e4eb5a63f9890638e8d04e3b0307 Sincronizar o inventário dos rótulos com as dobras já publicadas
6de65f31a2596948293812c4d8f1e54e9638593c Guardar as medições e os registos dos portões da RP4-n-c
```

O último commit contém apenas este relatório e os ficheiros dos códigos. A cabeça final comunica-se no fecho. O mandato identifica o construtor como Codex `gpt-6-astra`, com raciocínio `xhigh`.
