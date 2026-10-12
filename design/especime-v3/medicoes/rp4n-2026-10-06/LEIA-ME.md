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

O pacote desta passagem antiga foi retirado da história na reconstrução RP4-n-d: continha cópias com estragos e o diff do motor privado. Não existe na história do ramo reconstruído. O fecho e o pacote válido estão na secção «A passagem RP4-n-d».

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

## A passagem RP4-n-d

Esta secção substitui as conclusões de fecho das passagens anteriores. O lançamento foi a 07.10.2026, no ramo `rp4n-2026-10-07`, conforme a alteração expressa à data do mandato. O trabalho é de construção e correção, para conferência da direção. Não houve publicação nem envio ao remoto.

### A forma e a fusão

A base foi `d1becbf8`. A fusão `d28b9755` entrou primeiro, trazendo `main` em `f3aaa3e7`. Os 26 commits antigos foram reaplicados, um a um, sem a pasta `design/especime-v3/medicoes/rp4n-2026-10-06/leitura-frio/`. Não se fez uma eliminação posterior dessa pasta: os novos commits nunca a receberam. As referências anteriores deste relatório às cópias com estragos e ao diff privado descrevem o ramo abandonado e não são uma entrega desta passagem. Não foram criadas plantas de leitura a frio pelo construtor. `d/reconstrucao.json` emparelha as 26 reaplicações, com os assuntos conferidos.

Nos conflitos, as importações de EX2 e H4 e as de RP4-n ficaram juntas; `TituloDeTrabalho.astro` conserva o tratamento de língua de EX2 e a recusa de título não confirmado; `check-pais.mjs` conserva a proteção global A4 e a recusa da bandeira, retirando apenas a verificação redundante que usava uma variável inexistente; as plantas de `tests/pais/pais.mjs` foram reunidas. O inventário de frases e o seu registo de revisões conservam os dois conjuntos de entradas. Não se descartou um lado inteiro.

`package-lock.json` não mudou com a reconstrução, pelo que não houve `npm ci`. A primeira corrida integral encontrou uma divergência de língua do título inglês da água; o código passou a conservar `pt-PT` nos dados e a normalizá-lo para `pt` no HTML. A segunda encontrou a planta W4 de EX2 dependente de uma ausência real que RP4-n já tinha fechado; a planta passou a introduzir a ausência numa cópia de prova. A terceira corrida, na cabeça `8ffe7e48`, deu zero nos três portões. Só depois começaram as correções do mandato. As duas tentativas e o verde estão em `portoes-fusao-tentativa1/`, `portoes-fusao-tentativa2/` e `portoes-fusao/`.

A regra 9 exigiu também retirar restos de caminhos já abreviados dos ficheiros herdados. O limpador passou a reconhecer essas estruturas, os dois comandos que tinham destinos locais fixos passaram a descobrir o repositório ou a usar o ambiente, e os resumos dos briefs isentos foram atualizados após a alteração mecânica. As plantas do limpador passaram. Os textos históricos mantêm os factos e a sua atribuição; só os caminhos foram substituídos.

### Decisões por achado e proteção

| Achado | Resultado nesta passagem | Proteção e prova |
|---|---|---|
| 1, 2, 3, 4, 12 | Estragos plantados pela direção nas cópias, sem alteração pedida. | Nenhuma planta do construtor foi acrescentada ao pacote. |
| 5 | Água não faturada definida pela APA; nas duas contagens de avisos e no ciclo das condutas, ausência exata. | Busca em `busca-d.json`; RO1 e K16 prendem o excerto; K17 limita as ausências aos casos e às frases declaradas. |
| 6 | Pedido das pensões repetido, falha de certificado conservada. A cópia local do PDF com o mesmo resumo permitiu ler a medida. Saiu «sem custo para o sistema». | O teste `publisher.rp4n_origens_test` confere o PDF, a legenda da página física 273 e o valor impresso. K17 prende a frase ao excerto literal da figura; uma planta retira a legenda. |
| 7 | Os três nomes PRR seguem a seleção das frases. A data do instantâneo vem dos ficheiros da computação. RP4N-3 fecha para estas três linhas. | K17 recompõe a data marcada no recibo; a planta altera a data e é recusada contra o Excel selado. |
| 8 | `nota-alcance` deixou de ser uma exceção. As notas dizem a falta de leitura do diploma regional e da meta nacional. | Plantas de `tests/cartao/rp4nb.mjs` recusam a marca numa nota de alcance. |
| 9 | Lista fechada dos dois clientes reais, tipo do selo obrigatório e agente do utilizador separado do cliente nas dez origens. Saiu a comparação tautológica. | Plantas de cliente inventado, agente como cliente e selo incompleto; `rp4nd-disco.mjs` altera o exportado real, obtém a recusa pelo resumo e repõe os bytes. |
| 10 | Filtro deixa de ser fonte. A coluna só vale com cabeçalho lido no Excel selado. As frases citam os papéis, a sede e as colunas de datas efetivamente lidos. | Quatro plantas no motor e sete no sítio: cabeçalho, corpo, seleção, soma, data e filtro indevido. |
| 11 | História do ramo novo reconstruída sem a pasta indevida. A eliminação do ramo antigo continua bloqueada pelo gancho local, RP4N-10. | Comando e saída da prova de história abaixo. |
| 13 | Conferências de séries e travessia contra a origem nos dois repositórios. | Códigos e lista de ficheiros em `portoes-d/`. |
| 14 | A explicação não selada da despesa bruta deixa de se imprimir. | Exportação pelo motor e controlo da apresentação, sem alteração dos valores. |
| 15 | Saldo primário, consolidação, diferenças de consolidação e saldos de gerência explicados por palavras da fonte. | K17 verifica os literais; plantas retiram as definições das diferenças e dos saldos de gerência. |
| 16 | As duas famílias de VAB citam a frase que subtrai o consumo intermédio à produção. | Controlo das duas citações no teste RP4-n-d e conferência literal de K17. |
| 17 | Madeira termina antes de «EMPREGADOS». A conta anual usa o cabeçalho «Orçamento Inicial»; o recorte mensal fica restrito ao seu período. | Planta troca o recorte anual pelo mensal e obtém recusa; teste do motor confere o corte e o cabeçalho anual. |
| 18 | Ausência deixa de contar como definição inteiramente na fonte. | O teste exige as três famílias na lista que contém partes da casa. |
| 19 | `data-marca` é contado, com o mesmo critério de aceitação. Uma classe visual isolada não dá dispensa. | Plantas de atributo nas duas línguas, atributos indevidos e texto com atributo contado duas vezes. |
| 20 | Chips aceites pela direção nas páginas de estudos, áreas, correções, concelhos e índice. | Continuam ligados ao recibo de uma linha com proveniência incompleta; ficam para o bloco dos recibos. |
| 21 | A frase inglesa identifica a despesa prevista no Orçamento sem a oração relativa deslocada. | K17 recompõe as três famílias nas duas línguas. |
| 22 | Diferença anterior ao bloco entre nome e título documental, remetida ao bloco dos recibos. | Sem alteração fora do mandato. |
| 23 | Capturas refeitas na cabeça do código, nas duas edições e nas cinco larguras. | Manifesto com cabeça, rotas, resumo de cada PNG, frase e transbordos; PNG incluídos no pacote. |

As plantas acumuladas dos achados 5 a 18 estão em `tests/cartao/rp4n.mjs`; a alteração real do exportado está em `tests/cartao/rp4nd-disco.mjs`; a classificação das marcas e dos atributos está em `tests/cartao/rp4nb.mjs`. No motor, as proteções documentais estão em `publisher/rp4n_origens_test.py`, as computações PRR em `publisher/rp4n_prr_test.py` e a apresentação OE1 em `publisher/oe1_test.py`. Os controlos de cliente e selo também passam por `tests/cartao/origens-rp4n.mjs`, e os de cabeçalho e corpo da computação por `tests/cartao/computacoes-rp4n.mjs`.

### Documentos lidos e limites da busca

- **Água não faturada.** APA, «Eficiência hídrica, setor urbano», secção «Água não faturada», HTML obtido pelo cliente da casa em 07.10.2026. Define a percentagem da água entrada no sistema que não é faturada. Fica selado como `rp4n-agua-nao-faturada`. Não se atribui uma página a HTML.
- **Condutas.** Procurado RASARP 2025, volume 1 e Anexo X. O documento não estava alojado nas árvores consultadas; os pedidos ao sítio oficial da ERSAR não responderam. Não se inventa uma página lida. O `SOURCES.md` do estudo antigo descreve 239 como cálculo do projeto, não como número publicado. **RP4N-8, [verify]:** falta confirmar a fonte e a correspondência entre reabilitação e substituição. Por isso se escreveu «A fonte deste cálculo ainda não foi confirmada.», em vez de afirmar que a fonte publica o número.
- **Avisos PT2030.** Busca textual nos 646 PDFs selados do manifesto, correspondentes a 211 avisos, num total de 17 566 páginas. `busca-d.json` enumera cada documento, resumo, páginas lidas e páginas com os termos procurados. No MAR2030-2023-25, versão v0, a página física 6 define os beneficiários elegíveis, incluindo pessoas singulares; não define nem publica a contagem agregada do projeto. As duas frases dizem «Os avisos consultados não definem por palavras esta contagem.» A leitura foi textual e a contagem agregada não foi promovida a afirmação do publicador.
- **Pensões.** `Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf`, página física 273, página impressa 234, figura 8.4, «Decrementos por reforma antecipada: caso geral». O resumo da cópia recuperada coincide com o já declarado na linha. O pedido de 07.10.2026 voltou a falhar por certificado e ficou em `pensoes-d.pedido.json`; a cópia efetivamente lida ficou separada. **RP4N-2, [verify]:** o novo acesso HTTP continua por resolver; a leitura documental local deixou de estar impedida.
- **PRR.** `listagem-de-entidades-prr-20260819.xlsx` e `listagem-de-projetos-prr-20260819.xlsx`, folha `Sheet1`, cabeçalho na primeira linha. Os corpos originais foram recuperados da cache e conferidos contra os resumos e tamanhos das linhas. Não se inventou um recibo HTTP desta recuperação. O motor relê os corpos, seleciona os beneficiários intermediários e diretos com sede em Évora, cruza os projetos e refaz as três somas. `computacoes-rp4n.json` publica apenas a prova dos cabeçalhos, literais, seleção e resultados, sem a lista nominal dos beneficiários.
- **Termos do orçamento.** Síntese da Execução Orçamental de agosto de 2026: diferenças de consolidação na página física 83; saldo de gerência anterior na 87; conta consolidada e coluna de Orçamento Inicial na 49. São recortes novos do corpo já selado. A origem mensal não passa a ser uma origem anual genérica.
- **VAB.** SEC 2010, segunda frase do excerto já selado: produção a preços de base menos consumo intermédio a preços de aquisição. A frase sobre a base de valorização deixou de servir como definição.

### Verificações durante a construção

As plantas do sítio passaram com 32 recusas afirmadas e os controlos da classificação das ausências e da definição do VAB. A suite das marcas passou com 77 plantas. A planta em disco da K16 foi executada sob a tranca comum e terminou a zero, com a reposição byte a byte conferida. A primeira tentativa de commit do novo teste do PRR no motor foi recusada porque a sua linha `PASS` não imprimia a quantidade de conferências no formato exigido pelo portão; as conferências tinham passado. Corrigiu-se a linha e repetiu-se o portão inteiro. A corrida seguinte encontrou as expectativas antigas do OE1, que exigiam a nota retirada pelo achado 14. Foram substituídas por controlos que exigem a ausência da nota não selada e conservam os avisos restantes; a suite do OE1 passou nas 72 conferências.

Os primeiros portões do sítio após as correções detetaram a falta de localizador do novo rótulo manual da pensão e um erro de tipos no acesso à data do PRR. O localizador isolado não resolvia a regra de fundo: um `name` só entra por travessia do motor. Retirou-se esse campo manual e leu-se o recorte literal da página física 273, desde a legenda da figura até ao fim da nota de fonte. A frase apoia-se nesse `excerpt`. A regra da travessia ficou intacta; a conferência do livro passou. O acesso à data passou a ter tipo explícito e a verificar que os ficheiros são uma lista. As corridas estão em `portoes-d-tentativa1/` e `portoes-d-tentativa2/`.

A terceira corrida do sítio chegou à voz e recusou quatro declarações antigas ainda vivas das notas de alcance. Foram marcadas como retiradas e entraram as quatro formas atuais. O inventário de rótulos foi recontado depois de ler as vinte diferenças: só mudaram as dez formas, nas duas línguas, dos três nomes PRR, do nome da pensão e da ressalva do salário mínimo, com as contagens conservadas. A revisão da voz ficou como por ler pela direção. A conferência da voz corrigida deu zero.

**RP4N-9, resolvida na construção.** A tentativa seguinte passou o build, mas o `verify` encontrou três falhas na explicação herdada de `main`: dois apoios à ressalva retirada da despesa bruta, nas duas línguas, e a cópia do cliente anterior no selo da origem funcional. A origem passou a acompanhar o recibo corrigido no motor. Na explicação saiu apenas a oração final que afirmava a inclusão de operações financeiras e transferências na conta por ministério; conservou-se a distinção entre contas por função e por ministério, com os seus restantes apoios. A entrada histórica X12 continua a documentar a formulação anterior, e a entrada RP4N-9 explica a correção. Não se descartou a explicação nem a intenção da I215. X2 e X3 voltaram a zero contra os ficheiros do motor. O diagnóstico está em `portoes-d-tentativa4/verify.log`.

Depois das capturas, o guião auxiliar que enumera os ficheiros conferidos parou ao tratar `destino` como campo obrigatório de um registo antigo de travessia. Foi corrigido para usar `src/data` por omissão, tal como o verificador do repositório. As conferências de séries e de travessia foram repetidas e deram zero; o registo enumera também as linhas e as séries, além dos ficheiros inteiros e dos corpos pedidos.

### Pendências e custo

Ficam os limites documentais explicitamente assinalados em RP4N-2 e RP4N-8, os chips e a diferença de título do bloco dos recibos, e a conferência independente da direção. Nenhuma destas ausências se disfarça de definição confirmada. Não se alteraram os números publicados.

O mandato identifica o construtor como `gpt-6-astra`, raciocínio `high`. O runtime não expôs uma confirmação independente desse identificador nem uma linha «tokens used». Não se estima o custo nem se afirma que ficou abaixo do alvo de trezentos mil símbolos.

### Conferência visual

Foram vistas dez capturas: corte da pensão em português a 390 px e em inglês a 768 px; água em inglês a 1600 px; PRR contratado em português a 390 px e vencido em inglês a 1024 px; Madeira em português a 1024 px; orçamento em inglês a 1280 px; VAB em português a 1600 px; saldo primário em inglês a 390 px; diferenças de consolidação em português a 768 px. As frases e a data do PRR estão visíveis e não se encontrou corte de conteúdo nem sobreposição na amostra. Os recibos PRR continuam longos por conservarem a história das correções. A verificação automática cobre todas as 140 capturas. A página física 273 do PDF das pensões também foi renderizada e vista: confirma a legenda, a nota da fonte e o corte acumulado de 8,2% aos 65 anos.

### Cabeças e portões

Cabeça do código do sítio: `b72eac200831e8e5904ac0c1567b56eec1fac130`. Cabeça final do motor: `04a41eb7efcbe5097404614a73062a7f9bcef74a`. A cabeça final do sítio é o commit seguinte, apenas com relatório, capturas e registos das provas, comunicada na entrega.

| Portão | Ficheiro | Código lido |
|---|---|---:|
| build | `portoes-d/build.codigo` | 0 |
| verify | `portoes-d/verify.codigo` | 0 |
| typecheck | `portoes-d/typecheck.codigo` | 0 |
| motor | `portoes-d/motor.codigo` | 0 |
| series | `portoes-d/series.codigo` | 0 |
| cruzamento | `portoes-d/cruzamento.codigo` | 0 |

Os três portões do sítio correram pela tranca comum, com `RESEARCHHUB_DIR` apontado à worktree do motor. O portão inteiro do motor correu também pela tranca. O `verify` conservou a união dos passos, a imutabilidade da construção e a identidade da cabeça. `ficheiros-conferidos.json` nomeia os ficheiros relidos contra a origem e os corpos das séries. As conferências de séries e travessia voltam a correr após o commit das provas; essa contraprova acompanha o pacote, nas duas cabeças finais.

### Prova da história e da forma

```sh
git log --all -- design/especime-v3/medicoes/rp4n-2026-10-06/leitura-frio
```

A prova limitada a `HEAD` dá saída vazia, zero commits. A prova com `--all` ainda encontra um commit, `bf347dd8`, alcançável pelo ramo antigo do sítio. O registo está em `portoes-d/historia-sem-leitura-frio.txt`. A condição global do mandato ainda não está cumprida.

O mapa final, em `portoes-d/mapa.log`, tem 548 âncoras conferidas, zero longe, zero por encontrar e zero para lá do ficheiro. A procura das estruturas de caminhos locais nos ficheiros seguidos deu zero.

Na revisão das mensagens encontrou-se a falta do trailer de sessão em doze commits. Corrigiram-se só as mensagens, conservando as árvores e a autoria. `d/trailers-mapa.json` dá a correspondência; as tentativas conservam a cabeça efetivamente corrida. Todos os commits próprios, incluindo a fusão, têm os dois trailers.

### Capturas e marcas aceites

Foram refeitas 140 capturas, de catorze casos nas duas edições, a 390, 768, 1024, 1280 e 1600 píxeis. O manifesto `d/capturas.json` guarda a versão e os resumos. Não encontrou erros de página nem transbordos horizontais. Os HTML estão em `d/recibos/` e os PNG em `../../capturas/rp4n-2026-10-06/d/`.

O inventário `d/medidas.json` contou 244 ocorrências aceites em 38 páginas e zero recusadas, incluindo os atributos.

Os chips aceites que ficam para o bloco dos recibos, conforme o achado 20:

| Página | Chips |
|---|---:|
| `dist/areas/ambiente-e-energia/index.html` | 2 |
| `dist/areas/economia-e-coesao-territorial/index.html` | 5 |
| `dist/correcoes/index.html` | 9 |
| `dist/en/areas/ambiente-e-energia/index.html` | 2 |
| `dist/en/areas/economia-e-coesao-territorial/index.html` | 5 |
| `dist/en/corrections/index.html` | 9 |
| `dist/en/ledger/index.html` | 8 |
| `dist/en/municipalities/evora/index.html` | 4 |
| `dist/en/studies/evora-economia-e-dinheiro-publico-de-fora-da-camara/index.html` | 13 |
| `dist/en/studies/evora-prometido-pago-auditado-2026/index.html` | 8 |
| `dist/estudos/evora-economia-e-dinheiro-publico-de-fora-da-camara/index.html` | 13 |
| `dist/estudos/evora-prometido-pago-auditado-2026/index.html` | 8 |
| `dist/livro-razao/index.html` | 8 |
| `dist/municipios/evora/index.html` | 4 |

### Commits, fusão primeiro

Sítio, com as mensagens finais:

```text
d28b9755 Fundir main antes de reconstruir o bloco RP4-n
46a83b45 Selar as frases das famílias e séries nas palavras das fontes
212685dd Prender a frase da União à origem da própria série
47cb825c Recusar marcas de informação por confirmar nas páginas
186c26c2 Aplicar a recusa também aos documentos citados
ecb7811b Completar a receita efetiva com a exclusão dos saldos de gerência
92ca0dd5 Recusar o nome também nas alternativas e nos apoios misturados
f88f6841 Exigir o selo documental mesmo quando o apagam da origem
d6d4becd Guardar as medições e as provas do RP4-n bloqueado na recusa global
d417c4d8 Mostrar os títulos publicados dos estudos sem marca de tradução
eed7b34e Separar as marcas de afirmação das ausências autorizadas pela RP4N-1
eb99bae5 Distinguir a frase do cartão da frase de família no inventário
39f11f4c Exigir a ausência exata no campo e discriminar as marcas não abrangidas
87e4dfc7 Gerar o relatório da passagem com as contagens e os códigos medidos
ae1183c8 Contar uma marca partida sem duplicar a classe e manter a recusa
9a1fd50f Conferir os campos de data documentais e as duas formas de os render
b091d3d1 Recusar um título declarado por confirmar mesmo sem marca rendida
bc989e3d Ligar a medição anterior à cabeça com os trailers conferidos
3e6cfa9b Guardar também as plantas e os códigos da proteção dos títulos
f73f053b Guardar a medição final e os registos dos portões da RP4-n-b
3eaa2e7c Relatar a RP4-n-b e os códigos lidos com a RP4N-5 pendente
465b73c3 Completar os tipos de marcas aceites pela decisão RP4N-5
b268c343 Sincronizar o inventário da voz com as frases já publicadas
ffb7e67e Sincronizar o inventário dos rótulos com as dobras já publicadas
dd919d51 Guardar as medições e os registos dos portões da RP4-n-c
cef2d236 Fechar o relatório e os códigos da passagem RP4-n-c
6571b4d0 RP4-n: a leitura a frio do Claude Opus 5.5 sobre as três passagens (cinco plantas mordidas; os achados reais decididos achado a achado no mandato da passagem RP4-n-d, que reconstrói o ramo sem a pasta de leitura do construtor antes de o publicar), o registo das plantas e o mandato
5f148673 Acertar as âncoras do mapa depois da reconstrução RP4-n
a105e13d Conservar a língua canónica dos títulos ao integrar EX2 e RP4-n
8ffe7e48 Conservar a planta W4 quando todas as frases estão confirmadas
eb22db2e RP4-n-d 5: definir a água na fonte e registar a busca das ausências
7346cb15 RP4-n-d 6: nomear o decremento da pensão sem afirmar neutralidade
7a856784 RP4-n-d 7: alinhar nomes do PRR e ler a data do instantâneo
9b3c5c69 RP4-n-d 8: dizer a ausência nas notas de alcance e recusar a marca
2f1062ee RP4-n-d 16: apoiar o VAB na frase que o define
16c0dbe3 RP4-n-d 18: separar as ausências da contagem de famílias apoiadas na fonte
2096dcb0 RP4-n-d 21: ligar a previsão inglesa à despesa do orçamento
b0678be0 RP4-n-d 19: contar e classificar as marcas dos atributos
422efef8 Trazer os recortes documentais partilhados da passagem RP4-n-d
a4b95225 Confinar a conferência do instantâneo às famílias do PRR
90f4bc08 RP4-n-d 15: explicar saldos e consolidação pelas definições da fonte
0847e2a0 RP4-n-d 17: separar o recorte anual dos recortes de execução
ec0b62d7 RP4-n-d: fechar os clientes de K16 e provar a alteração em disco
24d0ce30 RP4-n-d: retirar restos de caminhos locais e tornar portáveis as ferramentas
be6d1c23 RP4-n-d: conferir as colunas e as palavras do PRR nos Excel selados
fee0b8f1 RP4-n-d: guardar as plantas dos recortes e das definições corrigidas
bb15589a RP4-n-d: preparar as capturas das duas edições na cabeça final
6d93e271 RP4-n-d: alinhar as âncoras do mapa e documentar a prova do PRR
b3a86d75 RP4-n-d: preparar o inventário final das marcas e dos chips aceites
6bf594c4 RP4-n-d: reconhecer no compositor o literal conferido no Excel
0f8d68d3 RP4-n-d: retirar dos recibos a nota não selada da despesa bruta
c3438fb9 RP4-n-d: declarar o localizador do rótulo da pensão e tipar a data PRR
97c997a9 RP4-n-d: apoiar a pensão no excerto literal sem criar um rótulo manual
5498ef6a RP4-n-d: sincronizar as notas de alcance no inventário da voz
5f131717 RP4-n-d: sincronizar os nomes e a nota de alcance no inventário dos rótulos
b72eac20 RP4-n-d: corrigir na explicação os apoios afetados pelos achados 9 e 14
```

Motor:

```text
7ee02de RP4-n-d 5: selar a definição oficial da água não faturada
42fdf0e RP4-n-d: corrigir clientes e recortes documentais dos achados 6, 9, 15 e 17
04a41eb RP4-n-d: conferir os Excel do PRR e retirar a nota não selada da despesa bruta
```

### RP4N-10: fecho da forma impedido pelo gancho

O gancho local `PreToolUse safety_guard.py` rejeitou a eliminação forçada do ramo antigo, com a razão «forced branch deletion», apesar da autorização expressa no lançamento. Não foi uma rejeição da revisão automática de aprovação. Não se contornou o gancho com outra via de eliminação. Foi pedida a eliminação externa do ramo antigo do sítio; o ramo homónimo do motor deve continuar. Enquanto esse ramo antigo existir, o comando com `--all` não pode dar zero e esta passagem não declara o bloco fechado. O trabalho do ramo novo, as provas de código e o pacote estão prontos para conferência.

### Números do relatório

`d/numeros-relatorio.json` transcreve o resultado do mapa e o valor da linha da pensão. Para o diagnóstico histórico da voz, lê o total no registo e deriva as ocorrências restantes subtraindo as duas declarações antigas retiradas no commit do inventário. Essa discriminação é uma derivação do diagnóstico guardado, não uma nova contagem dos HTML históricos. O pacote conserva a saída do conferidor numérico.

## A passagem RP4-n-e

### Resultado e âmbito da retoma

A passagem corrige a definição da água, retira as condutas da publicação, recorta a prova da pensão e fecha as alterações determinadas pelo mandato. A retoma conservou os commits anteriores. O estado inicial ainda tinha a definição da APA na família da ERSAR; a primeira corrida completa recusou-a. A corrida interrompida pelo limite de capacidade não tinha códigos e não foi contada como prova. A tentativa concluída e recusada fica em `portoes-e-tentativa-retoma/`. A tentativa seguinte passou a água e detetou declarações antigas da língua: a unidade dos avisos constava das duas tabelas e a unidade da linha retirada ainda constava do dicionário. Removeram-se as declarações obsoletas e a conferência passou a reconhecer também a forma singular produzida para as linhas traduzidas. O diagnóstico fica em `portoes-e-tentativa-lingua/`. A corrida seguinte terminou o build a zero e encontrou expectativas antigas no verify: a guarda dos campos ainda não incluía a retirada e a segunda fonte, e a acessibilidade não recebia o valor ao conferir a unidade singular. As expectativas foram alinhadas com o formato autorizado, sem retirar as verificações. Essa tentativa fica em `portoes-e-tentativa-guardas/`. A revisão final da lista de fontes encontrou entradas de concelhos sem nome de família, comparadas indevidamente com a primeira entrada antiga. O guião passou a identificar cada concelho e a recusar entradas anónimas; a lista foi regenerada só com as frases efetivamente alteradas. A corrida verde anterior conserva-se em `portoes-e-tentativa-inventario/`, e os portões do sítio repetiram-se na cabeça final do guião. O motor permaneceu na mesma cabeça; o registo final do seu portão foi conservado, sem apresentar a cópia como uma nova corrida.

O primeiro commit desta passagem foi o dos registos da direção, antes das alterações. A lista abaixo vem do histórico dos dois repositórios. Os identificadores dos achados são os da leitura a frio; as quantidades e códigos desta secção são lidos dos registos por guião, com a transcrição em `e/numeros-relatorio.json`.

### Achado a achado

| Achado | O que mudou ou ficou reservado | Proteção e prova |
|---|---|---|
| 1, 4, 5, 8 e 10 | Eram estragos plantados nas cópias do pacote. Não foram tratados como defeitos do código. | Decisão expressa do mandato e registo `PLANTAS-RP4N-d-2026-10-07.json`; conservadas as asserções reais. |
| 2 | A família da água passou da APA para o RASARP da ERSAR. O publicador, o documento, a página e o excerto chegam ao recibo nas duas edições. K17 exige o publicador da linha ou segunda fonte declarada nela com recibo. | Plantas de publicador diferente, segunda fonte apagada, água atribuída à APA, página do PDF trocada e origem visível retirada. |
| 3 | A linha das condutas conserva a marca no livro bruto, com `publication: withdrawn`; sai do carregador público, dos recibos, cartões e índices. As contagens do Método acompanham a publicação. | Planta de referência à linha retirada num cartão; inspeção de todos os HTML em `e/retirada.json`. |
| 6 | O excerto da pensão conserva apenas o rótulo da figura, o valor e a nota de fonte, com a página. O nome evita a neutralidade que a fonte não afirma. O identificador fica reservado para migração no bloco dos recibos, RP4N-11. | Plantas de legenda retirada e de despejo dos eixos; SHA do PDF e leitura da página no motor. |
| 7 | A ausência usa exatamente «A fonte publica este número sem o definir por palavras.» e «The source publishes this number without defining it in words.». A unidade concorda no singular e no plural nas duas edições. As marcas de publicador, documento e data do PT2030 continuam aceites pelo mandato para o bloco dos recibos. | Plantas de paráfrase da ausência e de unidade plural com um aviso; conferência de ausência versus excerto. |
| 9 | A eliminação do ramo antigo pertence ao diretor. Na conferência desta retoma, a referência já não existe, e a consulta da pasta de leitura por HEAD e por todos os ramos vem vazia. Esta sessão não apagou ramos. | RP4N-10 deixou de se observar: comandos, códigos e saídas em `e/historia.json`. |
| 11 | O inventário enumera por frase os corpos alojados no motor, os recibos e os resumos. O pacote seguinte tem de os incluir. | `inventariar-fontes-e.mjs` relê os bytes e recusa ficheiro ausente ou resumo diferente; lista em `e/fontes-por-frase.json` e `.md`. |
| 12 | O nome PRR vencido lê a data do instantâneo da computação. As derivadas conservam a seleção de beneficiários intermediários e diretos com sede em Évora. | Mutação da data com asserção do título, asserções das derivadas e plantas da seleção, da coluna, dos ficheiros e da soma. |
| 13 | O recorte do orçamento anual conserva o título e o quadro anual, sem o período da execução mensal. | Planta do recorte mensal numa linha anual; asserção do cabeçalho anual e da ausência do período mensal no motor. |
| 14 | Caminhos nos briefs antigos e `Path.home()` do extrator ficam para higiene, RP4N-12. Não foram corrigidos nesta passagem. | A limpeza desta entrega abrange os ficheiros novos e os registos, com prova em `e/privacidade-retoma.json` e nos registos de limpeza dos portões; não se declara saneada a dívida antiga. |
| 15 | Marcas em `meta` e `og:description` ficam para higiene, RP4N-13. | Sem expansão da célula nesta passagem, por decisão expressa. |
| 16 | A frase dos ministérios evita «despesa bruta» e refere o total inscrito no mapa por ministérios. | Planta que reintroduz o termo sem definição. |
| 17 | Mantida a integridade dos ficheiros do código. A forma do próximo pacote cabe à direção. | Histórico e inventário de corpos por frase; os estragos das cópias não foram importados para os repositórios. |
| 18 | Portões inteiros repetidos na cabeça atual do código. | Códigos e cabeças de início e fim em `portoes-e/`. |
| 19 | Séries com a metade do motor e travessia com origem repetidas em comandos separados. | `series.codigo`, `cruzamento.codigo` e registos correspondentes; nova execução após o commit final. |
| 20 | Conservados os resumos dos exportados e a lista fechada de clientes. A origem da água passa a ser a ERSAR. | Plantas de cliente, selo, resumo e página; conferência dos corpos no motor. |
| 21 | K17 conserva o controlo de coluna, seleção e ausência sem a contar como definição selada. | Plantas de coluna inventada, seleção alargada e ausência onde existe excerto. |
| 22 | Conservada a recusa das marcas abrangidas e a separação das ausências aceites. Metadados continuam reservados para higiene pelo achado 15. | Plantas de texto simples, partido, marca inglesa e marca sem texto; não se declara coberta a pendência das meta. |
| 23 | Conservadas as notas de alcance, a frase inglesa do orçamento, o VAB e o recorte da Madeira. A frase dos ministérios evita o termo sem definição. | Plantas das definições e da reintrodução de despesa bruta; auditoria das famílias nas duas edições. |
| 24 | Capturas refeitas na cabeça do código; histórico e trailers conservados. Não se inventou custo da retoma. | Manifesto com versão e SHA-256 de cada captura; confronto dos bytes e leitura visual. |

### A definição da água encontrada

A ERSAR define o indicador na página física e impressa 106 do RASARP, volume referido no título «RASARP 2025, volume 1, página 106, AA08 Água não faturada». A página foi extraída e vista renderizada. O excerto literal é:

> O indicador é definido como a percentagem de água entrada
> no sistema que não é faturada (conceito a aplicar a entidades
> gestoras de sistemas em alta e em baixa).

O corpo foi obtido pelo cliente `core.http.HttpClient.condicional`, em `2026-10-11T08:13:13Z`, e ficou em `content/13 Dominios/source/rp4n/rasarp2025-volume1.pdf`, SHA-256 `cd913fa3af3c782154fbf015c74d4b93005c2fc7f65741e33ac27aba6a829a67`. O recibo é `content/13 Dominios/source/rp4n/rasarp2025-volume1.pedido.json`. O endereço veio do índice oficial e da lista de publicações servida pela ERSAR. Os pedidos usaram a confiança TLS nativa do sistema, com validação ativa, sem desligar a verificação de certificados. A cópia da página vista fica em `e/rasarp-p106.png`.

Cadeia alojada de descoberta do documento:

- `content/13 Dominios/source/rp4n/rasarp-indice.html`, SHA-256 `64299e837cd2a212a3a46aec42302c5a010aad0ab9742e17b2899b8391dfefc5`.

- `content/13 Dominios/source/rp4n/rasarp-indice.pedido.json`, SHA-256 `91f6f5729e7ce611c14abeb1524cc5b8b3523b346355fb514056ae6421faf65f`.

- `content/13 Dominios/source/rp4n/rasarp-lista.json`, SHA-256 `00d709c57304a830defd9d8c4b493b70c356690bfb9a38f7cb97ce044263f050`.

- `content/13 Dominios/source/rp4n/rasarp-lista.pedido.json`, SHA-256 `3a2d679cc7217b625443b4354d118ae8ba7ff5847b6a1de3f3f5c80a86ef6c23`.

O acesso ao relatório não autoriza republicar as condutas: continua por resolver a correspondência entre a fonte, o cálculo e o rótulo da linha retirada, RP4N-8. Não se alargou o mandato a essa investigação.

### Plantas e mensagens observadas

As plantas do sítio produziram 43 recusas afirmadas. As mensagens seguintes são transcritas de `e/plantas-sitio.json`; incluem as novas plantas e as regressões conservadas. As mutações do título PRR e as asserções de valor, recorte e seleção têm de passar além destas recusas.

- **selo com outro cliente**: K16 · origem «rp4n-orcamento»: a origem exportada não identifica um cliente da lista fechada.

- **agente do utilizador como cliente**: K16 · origem «rp4n-orcamento»: a origem exportada não identifica um cliente da lista fechada.

- **tipo do selo apagado**: K16 · origem «rp4n-orcamento»: a origem exportada não tem o selo completo.

- **selo inteiro apagado**: K16 · origem «rp4n-orcamento»: a origem exportada não tem o selo completo.

- **nome do projeto de volta numa família**: K17 · famílias · oe-2026-despesa-funcao-01, oe-2026-despesa-funcao-02, oe-2026-despesa-funcao-03, oe-2026-despesa-funcao-04, oe-2026-despesa-funcao-05, oe-2026-despesa-funcao-06, oe-2026-despesa-funcao-07, oe-2026-despesa-funcao-08, oe-2026-despesa-funcao-09, oe-2026-despesa-funcao-10, parte 1 («É o que a administração central prevê gastar nesta função…»): o nome do projeto não pode apoiar uma frase.

- **nome do projeto de volta numa série**: K17 · séries · «serie-ihpc-rendas-variacao-homologa», parte 1 («É quanto mudaram»): o nome do projeto não pode apoiar uma frase.

- **ausência declarada quando há excerto**: K17 · famílias · avisos-pt2030-abertos, parte 1 («A fonte publica este número sem o definir por palavras.»): a ausência não corresponde à falta do excerto.

- **seleção calculada sem resumo do ficheiro**: K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): a seleção calculada não tem ficheiros selados iguais aos Excel lidos.

- **nome numa alternativa simples**: K17 · famílias · oe-2026-despesa-funcao-01, oe-2026-despesa-funcao-02, oe-2026-despesa-funcao-03, oe-2026-despesa-funcao-04, oe-2026-despesa-funcao-05, oe-2026-despesa-funcao-06, oe-2026-despesa-funcao-07, oe-2026-despesa-funcao-08, oe-2026-despesa-funcao-09, oe-2026-despesa-funcao-10, parte 1 («É o que a administração central prevê gastar nesta função…»): o nome do projeto não pode apoiar uma frase.

- **nome numa alternativa aninhada**: K17 · famílias · oe-2026-despesa-funcao-01, oe-2026-despesa-funcao-02, oe-2026-despesa-funcao-03, oe-2026-despesa-funcao-04, oe-2026-despesa-funcao-05, oe-2026-despesa-funcao-06, oe-2026-despesa-funcao-07, oe-2026-despesa-funcao-08, oe-2026-despesa-funcao-09, oe-2026-despesa-funcao-10, parte 1 («É o que a administração central prevê gastar nesta função…»): o nome do projeto não pode apoiar uma frase.

- **nome misturado com uma origem válida**: K17 · séries · «serie-ihpc-rendas-variacao-homologa», parte 1 («É quanto mudaram»): o nome do projeto não pode apoiar uma frase.

- **texto simples numa página construída (pt)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **marca em inglês numa página construída (pt)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **texto partido numa página construída (pt)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **marca sem texto numa página construída (pt)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **texto simples numa página construída (en)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **marca em inglês numa página construída (en)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **texto partido numa página construída (en)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **marca sem texto numa página construída (en)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **marca num documento citado (pt)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **marca num documento citado (en)**: RP4N: uma página de leitor contém uma marca de informação por confirmar.

- **PRR coluna inventada**: K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): a coluna calculada não está no cabeçalho selado.

- **PRR outro Excel plausível**: K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): a seleção calculada não tem ficheiros selados iguais aos Excel lidos.

- **PRR instantâneo alterado**: K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): a seleção calculada não tem ficheiros selados iguais aos Excel lidos.

- **PRR seleção alargada**: K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): a seleção da casa difere da conta refeita nos Excel.

- **PRR soma alterada**: K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): o valor difere da soma conferida nos Excel selados.

- **PRR filtro promovido a fonte**: K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): cita o campo «document.computed_over.filter», que não pode apoiar.

- **PRR cabeçalho inventado**: K17 · famílias · evora-prr-aprovado, parte 1 («São as verbas contratadas do Plano de Recuperação e Resil…»): o literal não foi lido no cabeçalho ou nas células do Excel selado.

- **recorte mensal numa linha anual**: K17 · famílias · oe-2026-despesa-efetiva-administracao-central-seguranca-social, parte 1 («É a despesa efetiva da administração central e da seguran…»): o recorte de janeiro a agosto não apoia uma linha anual.

- **definição retirada: rp4n-diferencas-consolidacao**: K17 · famílias · oe-2026-diferencas-consolidacao-funcional, execucao-2026-07-diferencas-consolidacao-funcional, parte 1 («É a diferença entre os registos de despesa e de receita d…»): apoia-se em «rp4n-diferencas-consolidacao», que não está declarada em ORIGENS_DAS_DEFINICOES.

- **definição retirada: rp4n-saldos-gerencia**: K17 · famílias · oe-2026-receita-efetiva-administracao-central, execucao-2026-07-receita-efetiva-administracao-central, execucao-2026-08-receita-efetiva-administracao-central, parte 2 («: o que ela recebe sem contar os recebimentos de ativos e…»): apoia-se em «rp4n-saldos-gerencia», que não está declarada em ORIGENS_DAS_DEFINICOES.

- **legenda da pensão retirada**: K17 · famílias · penalizacao-antecipacao-um-ano-neutra, parte 1 («É a redução da pensão calculada para a reforma antecipada…»): cita «Decrementos por reforma antecipada: caso geral», que não está no campo «excerpt» da linha «penalizacao-antecipacao-um-ano-neutra».

- **despejo dos eixos no excerto da pensão**: RP4N-e: o excerto da pensão deve conter só o rótulo, o valor e a nota da fonte.

- **paráfrase da ausência**: K17 · famílias · avisos-pt2030-abertos, parte 1 («Os avisos consultados não definem por palavras esta conta…»): a ausência não corresponde à falta do excerto.

- **despesa bruta reintroduzida sem definição**: oe-2026-cem-euros-ministerio-administracao-interna: termo sem definição.

- **origem de outro publicador**: K17 · famílias · oe-2026-cem-euros-funcao-01, oe-2026-cem-euros-funcao-02, oe-2026-cem-euros-funcao-03, oe-2026-cem-euros-funcao-04, oe-2026-cem-euros-funcao-05, oe-2026-cem-euros-funcao-06, oe-2026-cem-euros-funcao-07, oe-2026-cem-euros-funcao-08, oe-2026-cem-euros-funcao-09, oe-2026-cem-euros-funcao-10, parte 2 (« que o Orçamento prevê»): rp4n-orcamento, oe-2026-cem-euros-funcao-01: a origem tem outro publicador e não está declarada como segunda fonte com recibo.

- **segunda fonte sem declaração na linha**: K17 · famílias · evora-vab-empresarial, parte 2 («: o valor do que produzem menos o valor dos bens e serviç…»): rp4n-vab, evora-vab-empresarial-2024: a origem tem outro publicador e não está declarada como segunda fonte com recibo.

- **linha retirada num cartão plantado**: RP4N-e: uma linha retirada chegou a uma página: ciclo-substituicao-condutas.

- **unidade plural com um aviso (pt)**: RP4N-e: a unidade dos avisos não concorda com o valor.

- **unidade plural com um aviso (en)**: RP4N-e: a unidade dos avisos não concorda com o valor.

- **água novamente atribuída à APA**: K17 · famílias · agua-nao-faturada-portugal, parte 1 («É a parte da água que entra no sistema e não é faturada.»): rp4n-agua-nao-faturada, agua-nao-faturada-portugal-2024: a origem tem outro publicador e não está declarada como segunda fonte com recibo.

- **origem da água apagada do recibo (pt)**: K17 · recibo · pt · agua-nao-faturada-portugal-2024: a origem visível da definição perdeu o documento ou o excerto.

- **origem da água apagada do recibo (en)**: K17 · recibo · en · agua-nao-faturada-portugal-2024: a origem visível da definição perdeu o documento ou o excerto.

As plantas documentais do motor, lidas de `e/plantas-motor.log`:

- segunda fonte com bytes diferentes: segunda fonte sem recibo conferido no motor.

- água atribuída à APA: RO1: as origens ou os selos diferem da seleção e dos recibos.

- água com outra página: RO1: o excerto difere da leitura literal do documento.

- palavra acrescentada: RO1: o excerto difere da leitura literal do documento.

- resumo de outro documento: RO1: o sha256 da origem difere do documento.

- cliente inventado: RO1: as origens ou os selos diferem da seleção e dos recibos.

- origem apagada: RO1: as origens ou os selos diferem da seleção e dos recibos.

- caminho fora do motor: RO1: o ficheiro da origem não existe dentro do motor.

### Ficheiros alojados por frase

O inventário relido contém 32 entradas de frases e 42 caminhos distintos. A lista integral por frase, com caminho no motor e SHA-256, está em [fontes-por-frase.md](e/fontes-por-frase.md); a forma verificável é [fontes-por-frase.json](e/fontes-por-frase.json). O guião recusa qualquer corpo divergente. O pacote seguinte deve levar esses ficheiros e a cadeia de descoberta da ERSAR acima. As ausências e as frases da casa sem ficheiro citado ficam identificadas como tal; não se inventa uma origem.

### Capturas e prova da retirada

Foram geradas 12 capturas da água, do corte da pensão e do aviso, nas duas edições, às larguras 390, 1280 px. `e/capturas.json` guarda a versão da construção, cada resumo, a largura medida e os erros de página. Não houve erros de página nem transbordos horizontais. Os recibos HTML estão em `e/recibos/` e os PNG em `../../capturas/rp4n-2026-10-06/e/`.

Foram vistas todas as capturas desta passagem, incluindo as zonas da definição, da prova e os rodapés. A água mostra a ERSAR e a página do relatório junto da frase; a pensão apresenta o recorte curto da figura; o aviso mostra a frase exata da ausência e a unidade no singular. Não se observou corte de conteúdo nem sobreposição introduzida pela alteração. As marcas de proveniência continuam visíveis nos campos reservados ao bloco dos recibos, incluindo source_url e excerpt da linha da água; o selo da definição é separado desses campos históricos. A dobra do excerto da definição aparece fechada nas capturas; a presença e o texto da prova dentro dela são conferidos pela célula e pelas plantas das duas edições.

A prova `e/retirada.json` percorreu 7905 HTML e encontrou 0 referências ao identificador das condutas. A linha bruta continua conservada e retirada; não pertence ao carregador público. A identidade do conjunto foi selada como `255ef1faa5cefcb3494a2f5ae07b7d497543d414d6674409f088158d9ddc788b`. As páginas inexistentes são:

- `dist/livro-razao/ciclo-substituicao-condutas/index.html`.

- `dist/en/ledger/ciclo-substituicao-condutas/index.html`.

### Cabeças e portões

Cabeça do código do sítio: `5727174ad9a25376242c197f2fe285e58a2510ac`. Cabeça do código e final do motor: `cc68172ca59254770493d01581b4b1cbcc5761a6`. A cabeça final do sítio é o commit seguinte, apenas com relatório, capturas e registos de prova, comunicada na entrega. A captura e o conjunto HTML provêm da cabeça do código. O início e o fim da corrida conservam a mesma cabeça.

| Portão | Ficheiro | Código lido |
|---|---|---:|
| build | `portoes-e/build.codigo` | 0 |
| verify | `portoes-e/verify.codigo` | 0 |
| typecheck | `portoes-e/typecheck.codigo` | 0 |
| motor | `portoes-e/motor.codigo` | 0 |
| series | `portoes-e/series.codigo` | 0 |
| cruzamento | `portoes-e/cruzamento.codigo` | 0 |

Os portões inteiros do sítio correram pela tranca comum com `RESEARCHHUB_DIR` apontado ao motor. O motor correu o `core.gate` na cabeça do código, pela mesma tranca. Os códigos foram lidos depois de cada processo terminar. As conferências de séries e travessia com `--with-origin` são comandos separados, com ficheiro de código próprio, e voltam a correr na cabeça final depois do commit de provas.

### Commits

Registos primeiro, seguidos do código do sítio:

```text
a45cf028 docs(rp4n-e): registar leitura, plantas e mandato
2c815466 fix(rp4n-e): recortar o excerto da pensão à medida
a44d10a6 fix(rp4n-e): uniformizar ausências e concordar avisos
24f97316 fix(rp4n-e): receber o recorte anual sem o período mensal
5c95a6ab fix(rp4n-e): explicar a quota pelo total do mapa por ministérios
629557b3 fix(rp4n-e): retirar as condutas da publicação conservando o livro
cfd28a51 fix(rp4n-e): auditar também as linhas retiradas sem as publicar
0345e2fd fix(rp4n-e): concordar também os títulos e a conferência das unidades
c46a5ee5 fix(rp4n-e): datar o PRR vencido e alinhar as frases derivadas
650029fd fix(rp4n-e): exigir o publicador da medida ou segunda fonte com recibo
2aae0865 fix(rp4n-e): provar a retirada em qualquer página e conservar a auditoria do livro
050ac3df fix(rp4n-e): concordar avisos nos cartões e provar o plural errado
fcd54ba7 test(rp4n-e): plantar a reintrodução de despesa bruta sem definição
f6b6b845 fix(rp4n-e): ligar a data no nome PRR ao campo da computação em todas as vistas
4242cc24 docs(rp4n-e): sincronizar a voz e os rótulos com as linhas publicadas
ba71725b test(rp4n-e): preparar os registos das plantas, fontes e capturas finais
2f4383aa fix(rp4n-e): apoiar a água na ERSAR com a página junto da definição
86fc5173 fix(rp4n-e): alinhar o dicionário com os avisos e a linha retirada
60e41eb9 test(rp4n-e): conferir o novo formato e a unidade singular dos avisos
5727174a fix(rp4n-e): identificar os concelhos na lista de fontes por frase
```

Motor:

```text
508fa25 fix(rp4n-e): separar o cabeçalho anual do período da execução
38d3bf5 fix(rp4n-e): alinhar as contas PRR com os beneficiários selecionados
e25d96e fix(rp4n-e): declarar e conferir as segundas fontes das definições
cc68172 fix(rp4n-e): selar a definição da água no RASARP da ERSAR
```

Commits de código desta retoma no sítio:

```text
2f4383aa fix(rp4n-e): apoiar a água na ERSAR com a página junto da definição
86fc5173 fix(rp4n-e): alinhar o dicionário com os avisos e a linha retirada
60e41eb9 test(rp4n-e): conferir o novo formato e a unidade singular dos avisos
5727174a fix(rp4n-e): identificar os concelhos na lista de fontes por frase
```

Commits de código desta retoma no motor:

```text
cc68172 fix(rp4n-e): selar a definição da água no RASARP da ERSAR
```

### Pendências e custo

Ficam RP4N-8, a confirmação da fonte e do rótulo das condutas antes de qualquer republicação; RP4N-11, a migração do identificador da pensão; RP4N-12, a higiene dos caminhos antigos; RP4N-13, as marcas nos metadados; e os campos e chips de proveniência reservados ao bloco dos recibos. Mantém-se a pendência histórica RP4N-2 do novo acesso HTTP ao documento das pensões, cuja cópia local foi conferida. A revisão independente da direção e a composição do próximo pacote não são substituídas por esta construção. A definição da água deixou de ser pendência. A antiga RP4N-10 também não subsiste na conferência desta retoma: a referência do ramo antigo está ausente e a consulta da pasta de leitura vem vazia, sem eliminação feita por esta sessão. Não foi executado qualquer push.

O alvo de custo do mandato já tinha sido ultrapassado antes da retoma: a mensagem de retoma da direção comunica «572 662 símbolos até parar». Esse valor é uma informação fornecida pela direção, não uma medição desta ferramenta. A retoma não expôs a linha «tokens used»; não se estima o custo adicional nem um total. O trabalho adicional incluiu a procura da nova publicação oficial da ERSAR, o alojamento e a leitura da página, a substituição da origem que o portão recusava e a repetição das provas nas cabeças corrigidas.

A limitação de capacidade interrompeu a corrida anterior; uma execução sem ficheiro de código não foi convertida em sucesso. Esta secção substitui, para a entrega atual, as conclusões históricas sobre a APA e a disponibilidade do RASARP, sem apagar o registo das passagens anteriores.


## A passagem RP4-n-f

A reescrita precedeu o commit dos registos e todas as correções. A direção confirmou a conservação da base e da referência de cópia. As frases foram corrigidas nas duas edições e as ausências mantidas como ausências. Não houve publicação, push, eliminação de ramos ou de referências.

### As decisões e a sua execução

- Achado 6: saiu a emenda por `trechos`. O cabeçalho anual conserva o período, a unidade, CGE, Orçamento Inicial e os anos como a extração contígua os dá. A frase distingue a coluna do orçamento da execução acumulada ao lado. O localizador da linha conserva a coluna e a linha do quadro.
- Achado 7: o excerto da pensão ficou reduzido à legenda contígua. A figura foi relida visualmente e guardada como recorte no motor, com resumo criptográfico no manifesto e ligação por `document.crop`. O ensaio compara a legenda com a página e reproduz o recorte a partir dos bytes alojados.
- Achado 8: a estimativa preliminar de redução atuarialmente neutra ficou distinta da penalização legal. A leitura da fonte obrigou a precisar a orientação: a neutralidade é individual, em valor atual esperado, e a própria fonte diz que não garante a sustentabilidade do sistema. Por isso não se escreveu que o custo do sistema fica igual. A linha legal nova conserva a aproximação da fonte na ressalva e no nome; o livro não aceita uma bandeira livre para «cerca de». Os direitos são os que deixam de ser formados.
- Achado 9: todas as linhas sem publicador conhecido ficam retiradas, conservadas no livro bruto. Os cartões saíram das páginas. A K17 recusa atribuir a um publicador desconhecido a frase de que a fonte publica sem definir.
- Achado 10: as quotas dos ministérios dizem «pela despesa bruta da administração central», apoiadas na derivação literal. A definição em palavras de despesa bruta fica por confirmar na fonte. A procura registada nos documentos alojados não encontrou a expressão; não se apresenta isto como leitura de um relatório do Orçamento que não estava alojado. A planta agora retira o apoio literal, em vez de proibir as palavras do apoio.
- Achado 11: o recibo da água foi reexportado pelo motor. O nome na fonte é o rótulo AA08b, o excerto é a linha contígua do quadro e o endereço corresponde ao PDF alojado. A frase situa a baixa no continente, dá a cobertura em palavras e distingue a avaliação em alta. A releitura local está registada na nota da linha e no ensaio do motor. A data de acesso continua a ser a do pedido alojado; não se inventou uma nova resposta HTTP nem uma segunda leitura pública pelo corredor.
- Achado 12: a retirada é conferida em todos os ficheiros de texto de `dist/`, incluindo JSON, CSV e mapas XML. A planta injeta um identificador retirado no JSON do conjunto.
- Achado 14: os comandos de reconferência escrevem as cabeças reais antes e depois, e a lista de commits é extraída por guião, com um ficheiro para cada commit.
- Achado 15: os avisos usam a mesma palavra inglesa no título e na unidade, mesmo permanecendo retirados. O caminho não deixa um separador final sem destino; há planta nas duas edições.
- Achado 16: o título PRR diz que o prazo é anterior à data do instantâneo, que continua ligada ao campo da computação.
- Achado 17: a lista de páginas com marcas aceites foi refeita depois das retiradas, a partir da célula do portão.

Os achados declarados plantas pela direção não deram correções ao produto. O achado sobre a forma do pacote e o que fica para a integração de `main` mantêm a decisão do mandato.

O cabeçalho comum apoia 3 linhas anuais e 3 mensais, inventariadas em `f/medidas.json`. O inventário de documentos por frase foi refeito em [fontes-por-frase.md](f/fontes-por-frase.md), com os resumos efetivamente lidos no motor.

### RP4N-8: linhas sem publicador

A confirmação da fonte continua pendente antes de qualquer republicação:

- `avisos-pt2030-abertos`: `withdrawn`.
- `avisos-pt2030-pessoas-singulares`: `withdrawn`.
- `ciclo-substituicao-condutas`: `withdrawn`.

A medição leu 3196 linhas no livro bruto e 3193 publicadas. A conferência percorreu 12878 ficheiros de texto e encontrou 0 referências aos identificadores retirados. O Método conserva 4 linhas publicadas com proveniência incompleta. A água passou de incompleta a completa; os avisos deixaram o conjunto público. A comparação está em `f/metodo.json`.

### Texto percorrido

| Extensão | Ficheiros |
|---|---|
| .css | 9 |
| .csv | 7 |
| .html | 7903 |
| .js | 10 |
| .json | 4940 |
| .svg | 1 |
| .txt | 4 |
| .webmanifest | 2 |
| .xml | 2 |

### Privacidade e reescrita

Usou-se `filter-branch` com um guião limitado aos dois registos indicados. Os registos novos foram limpos antes de entrar no Git. A referência `refs/original/refs/heads/rp4n-2026-10-07` fica para a direção. A autorização de retoma distingue expressamente os legados temporários da cabeça e a história nova.

### Prova lida de ficheiro

| Âmbito | Contagem |
|---|---|
| História desde b84d21a3, grep -c dos quatro pedaços | 0 |
| Diff inteiro desde b84d21a3, grep -c dos quatro pedaços | 0 |
| Cabeça, nome do utilizador e prefixo da pasta pessoal | 0 |

Os quatro pedaços são o nome do utilizador, o prefixo temporário privado, o diretório dos projetos e o segmento das worktrees. A prova executável está em `privacidade-f.py` e a saída em `f/privacidade.json`. Não se declara limpa de todos os caminhos históricos a árvore herdada.

### Cabeças antigas e novas

| Antiga | Nova | Commit |
|---|---|---|
| a45cf02837fae63da5d506e7a5d2c59c11cabf1a | 0775309eb34c6bfc918b6ba9aa7ddb859542fae6 | docs(rp4n-e): registar leitura, plantas e mandato |
| 2c815466f33a54b6961725b3a526d893fdbc3ae6 | 0279a053db27fa7cbfef2ba447b750747da8b21a | fix(rp4n-e): recortar o excerto da pensão à medida |
| a44d10a64d62784c31fa6d3f574fa9e9a9c8fd88 | 892dfa0ac0604eda61bb92e19bdd296630c6baa8 | fix(rp4n-e): uniformizar ausências e concordar avisos |
| 24f97316b33530f2b108999a3c153833575d9e49 | 5e8d9b1493ba116bc50207f655a13fca5fe0894b | fix(rp4n-e): receber o recorte anual sem o período mensal |
| 5c95a6aba18ab1aa9b7cc02a70bd4a85754ca849 | ba3c557393647c23e9dc0c621016f5d0f0da05fe | fix(rp4n-e): explicar a quota pelo total do mapa por ministérios |
| 629557b3cfab84ec5e79acb984fca2c4bb084285 | ac383ec624631d25285b41ce07a8969b170cf2ac | fix(rp4n-e): retirar as condutas da publicação conservando o livro |
| cfd28a517f27e2e3fc14264965e91f0e63a1dbd5 | 58192aeb5a5a66c9dbae11bbfb2b2d47825a2496 | fix(rp4n-e): auditar também as linhas retiradas sem as publicar |
| 0345e2fd7efadac2c60555c112289dcb4acc9c75 | 862c26f0f268c242e9507a09555f80adb22e613d | fix(rp4n-e): concordar também os títulos e a conferência das unidades |
| c46a5ee5987b71216c50aadb92e33e3f777847c5 | 32578d1ddd7a6a686c9ecdbde36ec6a326f8147b | fix(rp4n-e): datar o PRR vencido e alinhar as frases derivadas |
| 650029fd89e0e67b98ffc4d3a30bce80a5a6f7a6 | 91c2871c96abf54d6e996492c8fba422c1c800f1 | fix(rp4n-e): exigir o publicador da medida ou segunda fonte com recibo |
| 2aae0865ec071dd2b90322ca4750752f14042b71 | 6c9a90465ccbd1d2f9021cafa660f4f8d1e09f2b | fix(rp4n-e): provar a retirada em qualquer página e conservar a auditoria do livro |
| 050ac3df5e90bf191dfb9328d5e11516d033e591 | 7399a556ca1bfd4b6322f4d43af88d422471de6c | fix(rp4n-e): concordar avisos nos cartões e provar o plural errado |
| fcd54ba7c649441d095a6850f9fb60dcab2c4ee5 | 2a35e83cbc26a6ba7669f61281ae54f3a193eb03 | test(rp4n-e): plantar a reintrodução de despesa bruta sem definição |
| f6b6b8455ac9b8ba62df9fcf17ba0d669a562165 | c62d323fd614a0b6b05578807562b896a81915da | fix(rp4n-e): ligar a data no nome PRR ao campo da computação em todas as vistas |
| 4242cc244273445e373b664249d8c80553573ae2 | 44c6ddc15a9b750dd5bbb9535ff138b2daeecb77 | docs(rp4n-e): sincronizar a voz e os rótulos com as linhas publicadas |
| ba71725be2038c8e4e2195afb6e9885c3e9fd7dc | d57d91bd897edeeaf3ee0781642cf2e239f5a89a | test(rp4n-e): preparar os registos das plantas, fontes e capturas finais |
| 2f4383aab0a7889d5208d9aae97ea59afd087113 | 8381f17adaf62cbac4c1c8c9e93bba4881725dca | fix(rp4n-e): apoiar a água na ERSAR com a página junto da definição |
| 86fc51735ced3e857e8b92f488aacd85aa971190 | 5a2baef72009bc1b0080100901693b36d0f73277 | fix(rp4n-e): alinhar o dicionário com os avisos e a linha retirada |
| 60e41eb9ae2824e1f08c450b7480b4e57cdf5be8 | 3f8eb89bd837eccf230c63759c0ef8b5ebe72328 | test(rp4n-e): conferir o novo formato e a unidade singular dos avisos |
| 5727174ad9a25376242c197f2fe285e58a2510ac | bcbfcc713edbe5c6d7fb57de9123c1375c7ab098 | fix(rp4n-e): identificar os concelhos na lista de fontes por frase |
| 8ed6ed6ae1d60f3a47ccc5c45face2be7fcecd51 | b1962dfabb5167968a1bdb4ace7574c514798e3f | docs(rp4n-e): fechar o relatório e as provas nas cabeças verificadas |

### RP4N-14: higiene dos legados

Os 16 ficheiros seguintes já tinham o prefixo temporário na base. Não foram alterados. O bloco de higiene deve trocar esses caminhos por `<scratchpad>`. A lista, incluindo cada linha encontrada, saiu do guião:

- `design/especime-v3/briefs/BRIEF-auditoria-ux-2026-08-25.md:61`.
- `design/especime-v3/briefs/BRIEF-etapa-2.md:66`.
- `design/especime-v3/briefs/BRIEF-mapa-navegacao-M4.md:7`.
- `design/especime-v3/briefs/BRIEF-maquetas.md:7`.
- `design/especime-v3/briefs/BRIEF-maquetas.md:120`.
- `design/especime-v3/critica/2026-09-04-fable-leitor-no-navegador.md:11`.
- `design/especime-v3/critica/2026-09-08-sonnet-medicao-f11e-distritos.md:20`.
- `design/especime-v3/critica/LEITURA-c1-2026-09-28.md:129`.
- `design/especime-v3/critica/LEITURA-rp1bc-2026-09-26.md:40`.
- `design/especime-v3/medicoes/b1-2026-09-21/prompts/PROMPT-b1-opus-peca2-correcao.md:13`.
- `design/especime-v3/medicoes/b1-2026-09-21/prompts/PROMPT-b1-opus-peca2-correcao.md:34`.
- `design/especime-v3/medicoes/correcoes-ux-M3-sonnet.md:319`.
- `design/especime-v3/medicoes/fontes-308-2026-08-26.md:357`.
- `design/especime-v3/medicoes/p1-2026-09-15/contagens-antes.txt:2`.
- `design/especime-v3/medicoes/parte3-M1-sonnet.md:6`.
- `design/especime-v3/medicoes/parte3-M2-sonnet.md:6`.
- `design/especime-v3/medicoes/rp1-2026-09-26/prompts/PROMPT-rp1c-codex.md:24`.
- `design/observatorio/evora/BRIEF-E1-evora-2027.md:13`.

No motor continuam para JD1-9 os caminhos antigos em `publisher/manifest.evora.json`, `indicators/generate_claims.py` e `publisher/export_site_rows.py`. Nenhum destes ficheiros foi alterado nesta passagem.

### Plantas novas ou refeitas no sítio

| Planta | Mensagem real |
|---|---|
| ausência atribuída a publicador desconhecido | K17 · famílias · avisos-pt2030-abertos, parte 1 («A fonte publica este número sem o definir por palavras.»): a ausência não corresponde à falta do excerto |
| legenda da pensão retirada | K17 · famílias · penalizacao-antecipacao-um-ano-neutra, parte 1 («É a estimativa preliminar do grupo de trabalho da redução…»): cita «Decrementos por reforma antecipada: caso geral», que não está no campo «excerpt» da linha «penalizacao-antecipacao-um-ano-neutra» |
| emenda do valor à legenda da pensão | RP4N-f: a pensão exige a legenda contígua e o recorte da figura |
| paráfrase da ausência | K17 · famílias · avisos-pt2030-abertos, parte 1 («Os avisos consultados não definem por palavras esta conta…»): a ausência exige a retirada da linha sem publicador |
| ministério sem apoio literal da despesa bruta | K17 · famílias · oe-2026-cem-euros-ministerio-administracao-interna, oe-2026-cem-euros-ministerio-agricultura-e-mar, oe-2026-cem-euros-ministerio-ambiente-e-energia, oe-2026-cem-euros-ministerio-cultura-juventude-e-desporto, oe-2026-cem-euros-ministerio-defesa-nacional, oe-2026-cem-euros-ministerio-economia-e-coesao-territorial, oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao, oe-2026-cem-euros-ministerio-financas, oe-2026-cem-euros-ministerio-infraestruturas-e-habitacao, oe-2026-cem-euros-ministerio-justica, oe-2026-cem-euros-ministerio-negocios-estrangeiros, oe-2026-cem-euros-ministerio-presidencia-do-conselho-de-ministros, oe-2026-cem-euros-ministerio-reforma-do-estado, oe-2026-cem-euros-ministerio-saude, oe-2026-cem-euros-ministerio-trabalho-solidariedade-e-seguranca-social, parte 1 («É quanto vai para este ministério em cada cem euros, divi…»): cita «pela despesa bruta da administração central, multiplicar …», que não está no campo «derivation» da linha «oe-2026-cem-euros-ministerio-saude» |
| água novamente atribuída à APA | K17 · famílias · agua-nao-faturada-portugal, parte 1 («É a parte da água entrada no sistema que não é faturada, …»): rp4n-agua-nao-faturada, agua-nao-faturada-portugal-2024: a origem tem outro publicador e não está declarada como segunda fonte com recibo |
| título do relatório em vez do rótulo da água (pt) | K17 · recibo · pt · agua-nao-faturada-portugal-2024: o nome na fonte da água não é o rótulo AA08b conferido |
| título do relatório em vez do rótulo da água (en) | K17 · recibo · en · agua-nao-faturada-portugal-2024: o nome na fonte da água não é o rótulo AA08b conferido |
| definição local da pensão adulterada | K16 · origem «pensao-neutralidade»: o excerto local difere da leitura da página alojada |
| definição local da pensão adulterada na K17 | K17 · origem «pensao-neutralidade»: o excerto local difere da leitura da página alojada |
| linha retirada no JSON do conjunto | RP4N-e: uma linha retirada chegou a uma página: avisos-pt2030-abertos |
| separador final solto (pt) | RP4N-f: o caminho termina num separador sem destino |
| separador final solto (en) | RP4N-f: o caminho termina num separador sem destino |

O registo integral está em `f/plantas-sitio.json`. As plantas do motor foram extraídas do ensaio executado:

```text
PLANTA pensão com valor emendado à legenda: RP4N-f: o excerto da pensão não é a legenda contígua da página
PLANTA segunda fonte com bytes diferentes: segunda fonte sem recibo conferido no motor
PLANTA excerto emendado por trechos: RO1: um excerto tem de ser uma sequência contígua, sem trechos
PLANTA água atribuída à APA: RO1: as origens ou os selos diferem da seleção e dos recibos
PLANTA água com outra página: RO1: o excerto difere da leitura literal do documento
PLANTA palavra acrescentada: RO1: o excerto difere da leitura literal do documento
PLANTA resumo de outro documento: RO1: o sha256 da origem difere do documento
PLANTA cliente inventado: RO1: as origens ou os selos diferem da seleção e dos recibos
PLANTA origem apagada: RO1: as origens ou os selos diferem da seleção e dos recibos
PLANTA caminho fora do motor: RO1: o ficheiro da origem não existe dentro do motor
```

### Capturas e cabeças

A captura anterior conserva a versão `5727174ad9a25376242c197f2fe285e58a2510ac` do conjunto que existia antes da retirada, sem a renomear como uma construção nova. São 4 capturas e 0 problemas medidos. Depois das correções foram recolhidas 12 capturas, com 0 problemas medidos, da água, da pensão e da área que mostrava os avisos, nas duas edições e nas larguras declaradas no manifesto. Os HTML completos acompanham-nas.

Cabeça do código do sítio: `a10b0ee3d3f9d30c9ab8b31edeb4901efb3d2199`. Cabeça do código e final do motor: `92933611d162016ae39801a55f372612f9317e8e`. Os portões inteiros correram pela tranca comum, com a mesma cabeça no início e no fim.

O commit desta secção é apenas documental. Para evitar atribuir-lhe antecipadamente um hash que ainda não existe, a cabeça final do sítio é lida depois dele no anexo `f-final/cabecas-e-commits.json`. Esse anexo posterior ao commit inclui a sua ficha, os registos de séries e cruzamento e a reconferência final de privacidade. Fica deliberadamente fora do próprio commit que identifica. As capturas finais são refeitas nessa cabeça e acompanhadas pelo manifesto final; não há um segundo commit que volte a mudar a cabeça.

### Códigos lidos dos ficheiros

| Portão | Ficheiro | Código |
|---|---|---|
| build | portoes-f/build.codigo | 0 |
| verify | portoes-f/verify.codigo | 0 |
| typecheck | portoes-f/typecheck.codigo | 0 |
| motor | portoes-f/motor.codigo | 0 |
| series | portoes-f/series.codigo | 0 |
| cruzamento | portoes-f/cruzamento.codigo | 0 |

As tentativas anteriores ficam em `portoes-f-tentativa1`, `portoes-f-tentativa2`, `portoes-f-tentativa3` e `portoes-f-tentativa4`, com as falhas reais: posição do cabeçalho executável, matéria em falta para a nova linha legal e integração das novas origens, rótulos e retiradas. A quarta isolou o autoteste que ainda procurava a contagem antiga dos formatos na mensagem, embora a célula recusasse os localizadores adulterados. A terceira acabou integralmente antes da tentativa de interrupção; não houve sinal enviado nem interrupção dessa corrida. Os códigos de recusa não foram convertidos em sucesso. A limpeza complementar de um registo, feita apenas depois da corrida, está documentada em `f/limpeza-complementar.json`: retirou preenchimento nulo introduzido por uma limpeza de caminhos prematura, sem alterar a saída textual dos ensaios nem os códigos.

### Capturas da cabeça do código

| Página | Edição | Largura | Ficheiro |
|---|---|---|---|
| /livro-razao/agua-nao-faturada-portugal-2024/ | pt | 390 | design/especime-v3/capturas/rp4n-2026-10-06/f/agua-pt-390.png |
| /livro-razao/agua-nao-faturada-portugal-2024/ | pt | 1280 | design/especime-v3/capturas/rp4n-2026-10-06/f/agua-pt-1280.png |
| /en/ledger/agua-nao-faturada-portugal-2024/ | en | 390 | design/especime-v3/capturas/rp4n-2026-10-06/f/agua-en-390.png |
| /en/ledger/agua-nao-faturada-portugal-2024/ | en | 1280 | design/especime-v3/capturas/rp4n-2026-10-06/f/agua-en-1280.png |
| /livro-razao/penalizacao-antecipacao-um-ano-neutra/ | pt | 390 | design/especime-v3/capturas/rp4n-2026-10-06/f/corte-pt-390.png |
| /livro-razao/penalizacao-antecipacao-um-ano-neutra/ | pt | 1280 | design/especime-v3/capturas/rp4n-2026-10-06/f/corte-pt-1280.png |
| /en/ledger/penalizacao-antecipacao-um-ano-neutra/ | en | 390 | design/especime-v3/capturas/rp4n-2026-10-06/f/corte-en-390.png |
| /en/ledger/penalizacao-antecipacao-um-ano-neutra/ | en | 1280 | design/especime-v3/capturas/rp4n-2026-10-06/f/corte-en-1280.png |
| /areas/economia-e-coesao-territorial/ | pt | 390 | design/especime-v3/capturas/rp4n-2026-10-06/f/area-pt-390.png |
| /areas/economia-e-coesao-territorial/ | pt | 1280 | design/especime-v3/capturas/rp4n-2026-10-06/f/area-pt-1280.png |
| /en/areas/economia-e-coesao-territorial/ | en | 390 | design/especime-v3/capturas/rp4n-2026-10-06/f/area-en-390.png |
| /en/areas/economia-e-coesao-territorial/ | en | 1280 | design/especime-v3/capturas/rp4n-2026-10-06/f/area-en-1280.png |

### Páginas com marcas aceites

| Página | Tipos e ocorrências |
|---|---|
| dist/a-verificar/index.html | pagina-da-marca: 2 |
| dist/agenda/index.html | data: 11 |
| dist/areas/economia-e-coesao-territorial/index.html | selo-proveniencia: 3 |
| dist/correcoes/index.html | selo-proveniencia: 9 |
| dist/en/agenda/index.html | data: 11 |
| dist/en/areas/economia-e-coesao-territorial/index.html | selo-proveniencia: 3 |
| dist/en/corrections/index.html | selo-proveniencia: 9 |
| dist/en/ledger/evora-prr-aprovado-2026/index.html | excerto: 2 |
| dist/en/ledger/evora-prr-pago-2026/index.html | excerto: 2 |
| dist/en/ledger/evora-prr-vencido-aprovado-2026/index.html | excerto: 2 |
| dist/en/ledger/index.html | data: 1, selo-proveniencia: 4, referencia-no-livro: 1 |
| dist/en/ledger/saldo-natural-portugal-2025/index.html | data: 1, excerto: 2, endereco: 2, selo-proveniencia: 1, titulo-documento: 1, edicao-documento: 1 |
| dist/en/method/index.html | referencia-metodo: 1 |
| dist/en/municipalities/evora/index.html | pessoa-I77: 1, selo-proveniencia: 4 |
| dist/en/studies/evora-economia-e-dinheiro-publico-de-fora-da-camara/index.html | selo-proveniencia: 13 |
| dist/en/studies/evora-prometido-pago-auditado-2026/index.html | selo-proveniencia: 8 |
| dist/en/to-verify/index.html | pagina-da-marca: 2 |
| dist/estudos/evora-economia-e-dinheiro-publico-de-fora-da-camara/index.html | selo-proveniencia: 13 |
| dist/estudos/evora-prometido-pago-auditado-2026/index.html | selo-proveniencia: 8 |
| dist/estudos/evora-quem-governou-a-camara-2009-2025/documento/index.html | pessoa-I77: 2 |
| dist/estudos/evora-quem-governou-a-camara-2009-2025/index.html | pessoa-I77: 2 |
| dist/livro-razao/evora-prr-aprovado-2026/index.html | excerto: 2 |
| dist/livro-razao/evora-prr-pago-2026/index.html | excerto: 2 |
| dist/livro-razao/evora-prr-vencido-aprovado-2026/index.html | excerto: 2 |
| dist/livro-razao/index.html | data: 1, selo-proveniencia: 4, referencia-no-livro: 1 |
| dist/livro-razao/saldo-natural-portugal-2025/index.html | data: 1, excerto: 2, endereco: 2, selo-proveniencia: 1, titulo-documento: 1, edicao-documento: 1 |
| dist/metodo/index.html | referencia-metodo: 1 |
| dist/municipios/evora/index.html | pessoa-I77: 1, selo-proveniencia: 4 |

A lista distingue as marcas aceites no corpo das páginas da procura bruta no HTML de `f/medidas.json`, que também encontra metadados e scripts. As marcas de proveniência que permanecem não se converteram em frases de definição.

### Commits do sitio

| Commit | Assunto | Ficha |
|---|---|---|
| 06b988e09a4f76568eb5342fc9f4632c86ab4c1d | docs(rp4n-f): registar leitura, plantas e mandato sem caminhos locais | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/06b988e09a4f76568eb5342fc9f4632c86ab4c1d.txt |
| c5278bef74106b59767d88968ba1f53615604a75 | fix(rp4n-f): distinguir a coluna anual no quadro da execução | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/c5278bef74106b59767d88968ba1f53615604a75.txt |
| 028f8bfd57c5969368f94a360f96ab98e88fb9f7 | fix(rp4n-f): provar a pensão pela legenda e pelo recorte da figura | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/028f8bfd57c5969368f94a360f96ab98e88fb9f7.txt |
| c5b08875b164ac3cad264445c8108f4aa8d499e8 | fix(rp4n-f): separar a estimativa atuarial da penalização legal | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/c5b08875b164ac3cad264445c8108f4aa8d499e8.txt |
| 46fc3ec5060b6174a6a56c70bbcc68c692722295 | fix(rp4n-f): retirar da publicação as linhas sem publicador | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/46fc3ec5060b6174a6a56c70bbcc68c692722295.txt |
| b76e370a946db5122eb3816ee8872056c1e54a32 | fix(rp4n-f): apoiar a conta dos ministérios na despesa bruta literal | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/b76e370a946db5122eb3816ee8872056c1e54a32.txt |
| 723b1f732a5af6d8b54cc413e3aca38c120ef7de | fix(rp4n-f): identificar AA08b, cobertura e prova da água | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/723b1f732a5af6d8b54cc413e3aca38c120ef7de.txt |
| 621e9cb4be383229d80364a204c9690889769ab3 | test(rp4n-f): recusar retiradas em todas as exportações de texto | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/621e9cb4be383229d80364a204c9690889769ab3.txt |
| ba3df6a4b1870bd19546e83fde418d5f515be78f | test(rp4n-f): preparar provas de cabeça, privacidade e capturas | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/ba3df6a4b1870bd19546e83fde418d5f515be78f.txt |
| 2d4565d178acb48e0ce3b1ebe2b4a2a6e94e4d49 | fix(rp4n-f): uniformizar notices e fechar o caminho sem separador solto | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/2d4565d178acb48e0ce3b1ebe2b4a2a6e94e4d49.txt |
| 155dbf8117e718b8d1b0742f99204c40bb98aab1 | fix(rp4n-f): explicitar a data de referência do prazo PRR vencido | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/155dbf8117e718b8d1b0742f99204c40bb98aab1.txt |
| de26e52bf675478ee1af329b62abd45293ae8a6f | test(rp4n-f): medir retiradas e páginas com marcas após a publicação | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/de26e52bf675478ee1af329b62abd45293ae8a6f.txt |
| b588abcf7227cf9e343c93f1c8e34955647766f1 | test(rp4n-f): registar as reconferências com as cabeças e corrigir a entrada do portão | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/b588abcf7227cf9e343c93f1c8e34955647766f1.txt |
| d07806c81c778b3392776bb34d7558493a60ffc5 | fix(rp4n-f): alinhar a língua com AA08b e com os avisos retirados | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/d07806c81c778b3392776bb34d7558493a60ffc5.txt |
| 77b90814ea5c18c05d545e4bbb34278576ee6857 | fix(rp4n-f): atualizar o inventário pela contagem publicada | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/77b90814ea5c18c05d545e4bbb34278576ee6857.txt |
| 91fd9d3aa3bf6727f5c327787055bad0989a8677 | fix(rp4n-f): atribuir a penalização legal à segurança social | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/91fd9d3aa3bf6727f5c327787055bad0989a8677.txt |
| c0aae32740eff8292ca0679537b90e595352d418 | fix(rp4n-f): mostrar e conferir AA08b no cabeçalho do recibo | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/c0aae32740eff8292ca0679537b90e595352d418.txt |
| 79e98237bc904fed4da1a2b1ed7365641e5844e8 | fix(rp4n-f): conferir a cópia local e a unidade legal em todas as células | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/79e98237bc904fed4da1a2b1ed7365641e5844e8.txt |
| a73fc55ace8dab236e92d1a42b1e2ad475cf1081 | test(rp4n-f): conservar os controlos depois da retirada dos avisos | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/a73fc55ace8dab236e92d1a42b1e2ad475cf1081.txt |
| 281b3a77e9b625d7e9308b4b19326a9ee4152e0c | test(rp4n-f): guardar a cabeça final em anexo posterior ao commit | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/281b3a77e9b625d7e9308b4b19326a9ee4152e0c.txt |
| 6f950485dcd4c31f7b035b5216e63a1871ab1cc2 | test(rp4n-f): registar os rótulos medidos das pensões e do prazo PRR | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/6f950485dcd4c31f7b035b5216e63a1871ab1cc2.txt |
| a10b0ee3d3f9d30c9ab8b31edeb4901efb3d2199 | test(rp4n-f): ler a contagem dos formatos na mensagem das plantas | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/sitio/a10b0ee3d3f9d30c9ab8b31edeb4901efb3d2199.txt |

### Commits do motor

| Commit | Assunto | Ficha |
|---|---|---|
| 7242ca737e2678d45b308bceea565c61c109e233 | fix(rp4n-f): exigir excertos contíguos no cabeçalho anual | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/motor/7242ca737e2678d45b308bceea565c61c109e233.txt |
| e93093ad80afaeb31416b9ca4611807174b615d5 | fix(rp4n-f): conferir a legenda e o recorte da pensão alojada | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/motor/e93093ad80afaeb31416b9ca4611807174b615d5.txt |
| 5ad2ca9e509ddef40f576b424b224e6a910d81c9 | fix(rp4n-f): separar a estimativa neutra da penalização legal | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/motor/5ad2ca9e509ddef40f576b424b224e6a910d81c9.txt |
| 92933611d162016ae39801a55f372612f9317e8e | fix(rp4n-f): reler AA08b e a cobertura na página alojada | design/especime-v3/medicoes/rp4n-2026-10-06/f/commits/motor/92933611d162016ae39801a55f372612f9317e8e.txt |

### Limites e custo

RP4N-2 continua com o novo acesso HTTP à cópia das pensões sem confirmação: a tentativa desta passagem está em `pensoes-f.pedido.json` no motor e falhou a validação do certificado. A releitura usa os bytes da cópia local com resumo conferido; não se criou um selo de acesso bem-sucedido. Ficam também a migração do identificador da pensão em RP4N-11, a higiene e os campos dos recibos já reservados à direção. A definição de despesa bruta continua explicitamente por confirmar na fonte.

A linha «tokens used» não foi exposta por esta execução. Não se estima um total nem se afirma que o custo-alvo foi cumprido. O trabalho adicional às correções incluiu a reescrita e a prova da história, a distinção dos legados decidida na retoma, a releitura das páginas alojadas, os portões obrigatórios por commit do motor e a repetição dos portões de integração após as falhas registadas.

## A passagem RP4-n-i

O Método inglês passa a usar `[to verify]` também nos atributos. A conferência lê todos os atributos de todos os elementos de todas as páginas construídas, além do texto, com estragos em `title`, `aria-label`, `alt`, `data-*` e `content`. A cobertura nova encontrou também a marca portuguesa nas descrições `meta content` do saldo natural inglês; a composição dessas descrições passou a usar a marca da edição. A afirmação excessiva do relato h foi corrigida também no seu gerador.

O recibo de uma linha com `access_date_kind: hosted-copy` e sem verificações próprias conserva a data da cópia alojada e declara a ausência de leitura na fonte. O estado do endereço deixa de ser uma verificação dessa linha, tanto na cabeça do recibo como no bloco das verificações. A pensão que tem uma verificação própria conserva o estado. A ambiguidade pequena do achado foi resolvida no âmbito das cópias alojadas; não se alterou a política das restantes linhas.

O nome na fonte da penalização legal passa a ser a expressão literal do parágrafo da fonte, também na edição inglesa, onde a transcrição conserva a língua original. Os localizadores têm redação própria em cada edição. A frase dos ministérios distingue o total antes da consolidação do total consolidado com as duas etiquetas impressas no MAPA.

### Os achados plantados na leitura h


| Repositório | Linha | Data | Tipo |
|---|---|---|---|
| sitio | penalizacao-antecipacao-um-ano-neutra | 2026-08-24 | hosted-copy |
| sitio | penalizacao-legal-um-ano-antecipacao-2026 | 2026-08-24 | hosted-copy |
| motor | penalizacao-antecipacao-um-ano-neutra | 2026-08-24 | hosted-copy |
| motor | penalizacao-legal-um-ano-antecipacao-2026 | 2026-08-24 | hosted-copy |

As definições do recibo português dizem: Cópia alojada a 24.08.2026; Cópia alojada a 24.08.2026; Cópia alojada a 24.08.2026; Cópia alojada a 24.08.2026. O localizador legal inglês é Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273, paragraph below Figure 8.4; Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273, paragraph below Figure 8.4. O relatório h diz 28 páginas com marca, como a sua medição. Os estragos da cópia não estavam no ramo. Prova: `i/plantas-da-direcao.json`.
### As frases e os campos, lidos do HTML

Método inglês, atributos `title`: rows with at least one field marked [to verify].

**agua-pt**

> É a parte da água entrada no sistema que não é faturada, nas entidades gestoras em baixa de Portugal continental. A avaliação global abrange noventa e três por cento das entidades gestoras; a página apresenta também a avaliação em alta. O valor situa-se na faixa «Qualidade do serviço mediana» da ERSAR: acima de vinte e até trinta por cento, incluindo o limite superior.

**agua-en**

> It is the share of water entering the system that is not billed by retail operators in mainland Portugal. The overall assessment covers ninety-three per cent of operators; the page also presents the wholesale assessment. The value falls in ERSAR’s “medium service quality” band: above twenty and up to thirty per cent, including the upper limit.

**pensao-pt**

> É a estimativa preliminar do grupo de trabalho da redução atuarialmente neutra para antecipar a reforma um ano: a redução que, nas contas do grupo, deixa a pessoa sem vantagem financeira esperada entre reformar-se já e adiar a reforma um ano, contando as contribuições que deixam de ser feitas e os direitos que deixam de ser formados. Não é a penalização legal por antecipação. A penalização que a lei aplica por um ano de antecipação, sem o fator de sustentabilidade, é de cerca de 6 % e é menor do que a redução atuarialmente neutra de 8,2 %.

**pensao-en**

> It is the working group’s preliminary estimate of the actuarially neutral reduction for retiring one year early: the reduction that, in the group’s calculations, leaves the person with no expected financial advantage between retiring now and postponing retirement by one year, including contributions no longer paid and pension rights no longer accrued. It is not the statutory early-retirement penalty. The statutory penalty for retiring one year early, excluding the sustainability factor, is about 6 % and is lower than the actuarially neutral reduction of 8,2 %.

**legal-pt**

> É a penalização legal por antecipar a reforma um ano, sem o fator de sustentabilidade, apresentada como aproximada pelo relatório do grupo de trabalho.

**legal-en**

> It is the statutory penalty for retiring one year early, excluding the sustainability factor, presented as approximate by the working group’s report.

**ministerios-pt**

> É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA».

**ministerios-en**

> It is the amount for this ministry out of every hundred euros of “DESPESA TOTAL” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “DESPESA TOTAL CONSOLIDADA”.

| Recibo | Nome na fonte | O que foi conferido |
|---|---|---|
| pensao-pt | dcum x : cumulative reduction | O que foi conferidoCópia alojada a24.08.2026 · Registo da cópiaSem resposta desde01.09.2026 · ao corredorReleitura tentada a01.09.2026, sem valor lido · conferência diária do ficheiro da fonte |
| pensao-en | dcum x : cumulative reduction | What was checkedCopy hosted on24.08.2026 · Copy recordNo answer since01.09.2026 · to the runnerRe-read attempted on01.09.2026, no value read · daily check of the source file |
| legal-pt | penalização legal | O que foi conferidoCópia alojada a24.08.2026 · Registo da cópiaLeitura na fonteNão há leitura na fonte registada para esta linha. A regra da releitura → |
| legal-en | penalização legal | What was checkedCopy hosted on24.08.2026 · Copy recordReading at the sourceNo reading at the source is recorded for this row. The re-reading rule → |

### Fontes para repetir a leitura
O inventário `i/fontes-por-frase.json`, medido no sítio `f99ad385789e293373951ddb77f25ac221181daf` e no motor `cc75e215caf71d5e8cfa77850f1896f3b418c75f`, lista 49 ficheiros alojados por frase ou decisão, todos conferidos pelos bytes. Inclui o PDF do MAPA, o PDF da pensão, o manifesto atual e a cópia literal do manifesto original recuperado do commit que prova o alojamento. O manifesto atual não foi confundido com a versão original.

| Ficheiro no motor | sha256 |
|---|---|
| content/11 Seguranca Social/source/MANIFEST.sha256 | 420695c2803d0b78b4b00e2289710ade3e77b53bd41d6b3396b5686772b0d8f4 |
| content/13 Dominios/source/bdp/bpstat-pagina-940.html | 36bed0374ac4a38bd8115bd3596a9f332a0c9f318428e3bca1ace1148684fdd5 |
| content/13 Dominios/source/ce/painel-pdm-scoreboard-2026-09-26.html | 0230bdfacf0da8f870387675a1c20a92545c23fb4ef764e29661f0edec8cd8fa |
| content/13 Dominios/source/eurostat/gov_10dd_edpt1.json | 63e91b9e39c42ad8f51d92c43a4278c8cc955572c7911fb7d9d1f29eb94fd9e5 |
| content/13 Dominios/source/eurostat/statistics-explained-government-finance-statistics.html | f1b107c69c196b756a56239bfac1bf0a2754bad9f0b90a3265ddc2e916b97372 |
| content/13 Dominios/source/eurostat/tesem060.json | 8a70357f6d32b524d09ad24041a9f38f13de052d2328114e5b6a5620c8c39df2 |
| content/13 Dominios/source/eurostat/tipsbp10.json | 7fe24c68ccf141c632aeae09633c0effdf2bfbfad814eecf93495c82897006ca |
| content/13 Dominios/source/eurostat/tipser10.json | 53e4d18a5f2d8c7702ed9e2ece42860570e9d5250e3aea088cafa24f69c86691 |
| content/13 Dominios/source/eurostat/tipsgo10.json | f855d74fb9fd741165b52dae03a853f0acb1442c319cf63ada7d7347f76ae82f |
| content/13 Dominios/source/eurostat/tipslm60.json | 3cadaa8dcec031d42b6c88a61b411458cc61efc27cfca8216c8ab598c30a64d6 |
| content/13 Dominios/source/ine/destaque-pde-2026-09-23.html | 880d30d8632f3e50aed26c93a527426dcb48e192097665693df7ed69f05400e5 |
| content/13 Dominios/source/rp1/010-ine-0013420-dados.json | 8fb5b0971209e2fa9843f94652b69710eee312ef874efb69ff0042b213e01a0a |
| content/13 Dominios/source/rp1/014-ine-0013420-minfo.html | 570b07a4e928a33ecb7c888ac590804e3737c92ab8186c4aff1cc6efca3276e8 |
| content/13 Dominios/source/rp3/183-ine-0013420-minfo.html | 2bff16870cf4e8bc4138c32727c8060a6e24f9cf1bbd04afc23533e6d9499e0c |
| content/13 Dominios/source/rp4n/eurostat-esa2010-KS-02-13-269-EN.pdf | 9569393aefd24d7fed20e55f30e68850148004e45c70dd5af4eda73214349858 |
| content/13 Dominios/source/rp4n/eurostat-esa2010-KS-02-13-269-EN.pdf.pedido.json | bd78c85a9bb3029e72cf50d4a5ee2403c3a54b6af09455ca15719b7837d87f0a |
| content/13 Dominios/source/rp4n/evora-contas.pdf | e63102753216d573a3cd6f60a886919cd88ec53df88692c800214a546d47b13f |
| content/13 Dominios/source/rp4n/evora-contas.pedido.json | 97e8d9528d78ba8faab6068d77e5b0e17bc91e722c7d753ee954de881ff3b0da |
| content/13 Dominios/source/rp4n/evora-gestao.pdf | be0c8f8228552a27e48de3cbd2ea3a994d9020d1f2385ef6103f69afd282964a |
| content/13 Dominios/source/rp4n/evora-gestao.pedido.json | 0fbcd0b46f4aec55125159b5a59905647db0bd34ff6f5b416240556e3378307a |
| content/13 Dominios/source/rp4n/madeira.pdf | c93c48e256d5b6e05522968dc39e0a0289d25899065faa1dc40ba78f7e84c6ae |
| content/13 Dominios/source/rp4n/madeira.pedido.json | 351f44e7b4c5e87c5b61864d14a7b2d188ad9ecb2f7354bed054b33414df1c74 |
| content/13 Dominios/source/rp4n/mapa4-g.pdf | 9e8005620a71179fc461f3b9f0472d253677ca35aa829d0b860864625dec5438 |
| content/13 Dominios/source/rp4n/mapa4-g.pedido.json | 37fa195cfbf496841b1bc6047563e55d7cac54d049c0fc6179b63a479fed7d6f |
| content/13 Dominios/source/rp4n/pensoes-copia-alojada.pdf | 555936bdc750f66826c4919fab5d288e0b726a76e72f224ba655c82390381366 |
| content/13 Dominios/source/rp4n/prr/listagem-de-entidades-prr-20260819.xlsx | 34f6e5b555f5cdbfcdc35535cd3e0e27717c6ad5ef681905d8d7620fffb7fe3b |
| content/13 Dominios/source/rp4n/prr/listagem-de-projetos-prr-20260819.xlsx | 121122320839671b5e86f114ee24dff5296cc30444327812872510e41b85d6ea |
| content/13 Dominios/source/rp4n/rasarp2025-volume1.pdf | cd913fa3af3c782154fbf015c74d4b93005c2fc7f65741e33ac27aba6a829a67 |
| content/13 Dominios/source/rp4n/rasarp2025-volume1.pedido.json | 92a4d4d4c2f4a1bde5a2c44bd58e4fb1b82c322872b41ca6810cd9e5f204586a |
| content/13 Dominios/source/text/destaque-pde-2026-09-23.txt | 3e8580f92458bba2da44f71d66171bec6cca62c03f5c61dfd3ab069d488f89d4 |
| content/20 Orcamento do Estado/source/dados-funcao.json | 43bb18f15b663e31b75ce6e09daaf68527aff412b1703319fcdb3e2496ddb8e7 |
| content/20 Orcamento do Estado/source/dados-funcao.json.pedido.json | 892dfaea8db0f3fe565fd1512c3a5d9d74fea32573781b17bbe520d48a454dbb |
| content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 |
| content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf.pedido.json | ff78d7a1f5629129d2c2a21f3dd06faae5623ebc1b5a3f83f92e471e2434d050 |
| indicators/out/c1c-2026-09-28/bce-competitividade-discurso.html | 4bf850e2ece146ef67a04485cb07085fb2911ce8dbc6fa0f84ccf477e06739eb |
| indicators/out/c1c-2026-09-28/dgal-limites-canonico.html | f03ce2507f02645dda63c8a366f05ea95e8e5e6e85817dd57c60b6bdf13ed818 |
| indicators/out/enquadramento-2026-09-28/corpos/53e4d18a5f2d8c7702ed9e2ece42860570e9d5250e3aea088cafa24f69c86691.txt | 53e4d18a5f2d8c7702ed9e2ece42860570e9d5250e3aea088cafa24f69c86691 |
| indicators/out/l1-2026-09-24/bdp-bpstat-pagina-940.html | 36bed0374ac4a38bd8115bd3596a9f332a0c9f318428e3bca1ace1148684fdd5 |
| indicators/out/l1-2026-09-24/ce-swd-2026-222-country-report-portugal.pdf | f249171d3e0e73af63707f051f56cd85eb758465f0389a930f1296462f18c647 |
| indicators/out/l1-2026-09-24/ce-swd-2026-222-country-report-portugal.txt | 20d07f2d43af23c216c737df41eaea46cd9900925128e237067bbb887c7b8725 |
| indicators/out/l1-2026-09-24/eurostat-tesem060.json | 8a70357f6d32b524d09ad24041a9f38f13de052d2328114e5b6a5620c8c39df2 |
| indicators/out/l1-2026-09-24/eurostat-tipsbp10.json | 7fe24c68ccf141c632aeae09633c0effdf2bfbfad814eecf93495c82897006ca |
| indicators/out/l1-2026-09-24/eurostat-tipser10.json | 53e4d18a5f2d8c7702ed9e2ece42860570e9d5250e3aea088cafa24f69c86691 |
| indicators/out/l1-2026-09-24/eurostat-tipsgo10.json | f855d74fb9fd741165b52dae03a853f0acb1442c319cf63ada7d7347f76ae82f |
| indicators/out/l1-2026-09-24/eurostat-tipslm60.json | 3cadaa8dcec031d42b6c88a61b411458cc61efc27cfca8216c8ab598c30a64d6 |
| indicators/out/l1-2026-09-24/eurostat-tipsna40.json | fbf5d6acd61b6dbbda1a6f8d4b6f9c659d10ab97f1dcad522838507797488239 |
| indicators/out/rp1-2026-09-26/014-ine-0013420-minfo.html | 570b07a4e928a33ecb7c888ac590804e3737c92ab8186c4aff1cc6efca3276e8 |
| indicators/out/rp1-2026-09-26/038-seguranca-social-rsi-conteudo-rp1c.json | 4fc174f6751fde822749d79161898406758d5aeec3ad456e22ac961429b8a9bc |
| indicators/out/rp1-2026-09-26/040-ine-idade-ativa-definicao-rp1c.html | 144f956c4f069addd42d9a5b72c000d6149ab7a842d629bea930d4c87f15e127 |

O original de `content/11 Seguranca Social/source/MANIFEST.sha256`, no commit `7c0b24700d76cb3a67442f2495178212169c7586`, está também em `design/especime-v3/medicoes/rp4n-2026-10-06/i/pensoes-manifesto-original.sha256`, SHA-256 `4b9bc26fe06aa5c809ca880e3c74bfb6e0f74068087081518bc2d2087594a0ac`. O pacote deve levar esta versão histórica juntamente com a atual.
### Cabeças e códigos lidos

| Repositório | Base | Cabeça do código |
|---|---|---|
| sitio | c263080105981e81d0c273e3b0cfc53ac399ce4a | f99ad385789e293373951ddb77f25ac221181daf |
| motor | e2fd95fde167ad54f36a426bc1487bd6c53c9f2a | cc75e215caf71d5e8cfa77850f1896f3b418c75f |


| Ficheiro | Código | Cabeça |
|---|---|---|
| portoes-i/build.codigo | 0 | f99ad385789e293373951ddb77f25ac221181daf |
| portoes-i/verify.codigo | 0 | f99ad385789e293373951ddb77f25ac221181daf |
| portoes-i/typecheck.codigo | 0 | f99ad385789e293373951ddb77f25ac221181daf |
| portoes-i/motor.codigo | 0 | cc75e215caf71d5e8cfa77850f1896f3b418c75f |
| i/reconferencia-codigo/series.codigo | 0 | f99ad385789e293373951ddb77f25ac221181daf; motor cc75e215caf71d5e8cfa77850f1896f3b418c75f |
| i/reconferencia-codigo/cruzamento.codigo | 0 | f99ad385789e293373951ddb77f25ac221181daf; motor cc75e215caf71d5e8cfa77850f1896f3b418c75f |

As árvores do código estavam limpas no início dos portões e as cabeças foram lidas antes e depois. As séries e o cruzamento com `--with-origin` correram depois do último commit que muda os ficheiros que leem. Os commits posteriores conservam apenas provas, capturas e este relato. A cabeça final é comunicada na resposta, sem inventar o hash do commit que contém o próprio relatório.
As tentativas anteriores foram conservadas: na primeira, o C1 ainda exigia a frase antiga de ausência, e a função nova precisava das declarações de tipos; na segunda, o índice recusou a forma nova do localizador do nome legal. A regra independente, a forma exata do localizador e as plantas foram corrigidas antes da repetição.

| Tentativa | build | verify | typecheck |
|---|---|---|---|
| portoes-i-tentativa1 | 1 | 125 | 1 |
| portoes-i-tentativa2 | 0 | 1 | 0 |

### Privacidade e questões
A RP4N-17 fecha como aceite, por decisão do mandato, apenas para os pares de commit e resumo de linha declarados em `i/privacidade.json`: 2 ocorrências. A planta recusa a mesma linha noutro commit e uma linha nova num commit aceite. Os códigos da procura real distinguem encontro, ausência e erro; um erro impede a conferência.

| Conferência | Valor |
|---|---|
| codigo_procura_cabeca | 0 |
| historico_grep_c | 100 |
| historico_sem_excecoes | 98 |
| diff_grep_c | 0 |
| cabeca_sem_excecoes_grep_c | 0 |
| Código em i/privacidade.codigo | 1 |

A RP4N-18 permanece aberta no histórico publicado: a fusão de `main` trouxe outros registos locais, incluindo um caminho temporário com identificador de utilizador no registo das plantas TP1. Os registos foram anonimizados na cabeça; `i/rp4n-18.json` conserva apenas nomes e hashes. A exceção da RP4N-17 não foi alargada. Não houve reescrita nem publicação. Esta entrega não autoriza a aterragem enquanto a direção não resolver a privacidade histórica.

A revisão automática recusou uma tentativa de commit por interpretar o ficheiro de diagnóstico anterior como preservação dos caminhos sensíveis. O comando não correu; o commit seguinte contém apenas os registos anonimizados e os hashes, sem esse ficheiro.
### Plantas e mensagens reais

| Planta | Mensagem |
|---|---|
| reconferência anterior à criação | RP4N-h: reconferência anterior à criação da linha legal |
| data local sem prova | a data local não tem prova de leitura ou alojamento |
| data local trocada | a data local não tem prova de leitura ou alojamento |
| manifesto local sem commit | a data de alojamento não aponta para o manifesto do commit |
| tipo da data local inventado | a data local não distingue alojamento de leitura |
| localizador trocado (penalizacao-antecipacao-um-ano-neutra, pt, name_source) | RP4N-h: localizador fora da língua da edição (pt, name_source) |
| localizador trocado (penalizacao-antecipacao-um-ano-neutra, pt, document.locator) | RP4N-h: localizador fora da língua da edição (pt, document.locator) |
| alojamento dito leitura (penalizacao-antecipacao-um-ano-neutra, pt) | RP4N-h: o recibo não distingue alojamento de leitura na fonte (pt) |
| localizador trocado (penalizacao-legal-um-ano-antecipacao-2026, pt, name_source) | RP4N-h: localizador fora da língua da edição (pt, name_source) |
| localizador trocado (penalizacao-legal-um-ano-antecipacao-2026, pt, document.locator) | RP4N-h: localizador fora da língua da edição (pt, document.locator) |
| alojamento dito leitura (penalizacao-legal-um-ano-antecipacao-2026, pt) | RP4N-h: o recibo não distingue alojamento de leitura na fonte (pt) |
| glosa a meio da K2 (pt) | RP4N-h: a glosa interrompe a frase K2 |
| marca traduzida incorretamente (pt, selo) | RP4N-h: marca fora da língua da edição (pt, texto) |
| marca traduzida incorretamente (pt, campo) | RP4N-h: marca fora da língua da edição (pt, texto) |
| marca traduzida incorretamente (pt, frase) | RP4N-h: marca fora da língua da edição (pt, texto fora do componente) |
| marca traduzida incorretamente (pt, marca de água) | RP4N-h: marca fora da língua da edição (pt, marca de água) |
| marca traduzida incorretamente (pt, title) | RP4N-i: marca fora da língua da edição (pt, atributo title) |
| marca traduzida incorretamente (pt, aria-label) | RP4N-i: marca fora da língua da edição (pt, atributo aria-label) |
| marca traduzida incorretamente (pt, alt) | RP4N-i: marca fora da língua da edição (pt, atributo alt) |
| marca traduzida incorretamente (pt, data-prova) | RP4N-i: marca fora da língua da edição (pt, atributo data-prova) |
| marca traduzida incorretamente (pt, content) | RP4N-i: marca fora da língua da edição (pt, atributo content) |
| localizador trocado (penalizacao-antecipacao-um-ano-neutra, en, name_source) | RP4N-h: localizador fora da língua da edição (en, name_source) |
| localizador trocado (penalizacao-antecipacao-um-ano-neutra, en, document.locator) | RP4N-h: localizador fora da língua da edição (en, document.locator) |
| alojamento dito leitura (penalizacao-antecipacao-um-ano-neutra, en) | RP4N-h: o recibo não distingue alojamento de leitura na fonte (en) |
| localizador trocado (penalizacao-legal-um-ano-antecipacao-2026, en, name_source) | RP4N-h: localizador fora da língua da edição (en, name_source) |
| localizador trocado (penalizacao-legal-um-ano-antecipacao-2026, en, document.locator) | RP4N-h: localizador fora da língua da edição (en, document.locator) |
| alojamento dito leitura (penalizacao-legal-um-ano-antecipacao-2026, en) | RP4N-h: o recibo não distingue alojamento de leitura na fonte (en) |
| glosa a meio da K2 (en) | RP4N-h: a glosa interrompe a frase K2 |
| marca traduzida incorretamente (en, selo) | RP4N-h: marca fora da língua da edição (en, texto) |
| marca traduzida incorretamente (en, campo) | RP4N-h: marca fora da língua da edição (en, texto) |
| marca traduzida incorretamente (en, frase) | RP4N-h: marca fora da língua da edição (en, texto fora do componente) |
| marca traduzida incorretamente (en, marca de água) | RP4N-h: marca fora da língua da edição (en, marca de água) |
| marca traduzida incorretamente (en, title) | RP4N-i: marca fora da língua da edição (en, atributo title) |
| marca traduzida incorretamente (en, aria-label) | RP4N-i: marca fora da língua da edição (en, atributo aria-label) |
| marca traduzida incorretamente (en, alt) | RP4N-i: marca fora da língua da edição (en, atributo alt) |
| marca traduzida incorretamente (en, data-prova) | RP4N-i: marca fora da língua da edição (en, atributo data-prova) |
| marca traduzida incorretamente (en, content) | RP4N-i: marca fora da língua da edição (en, atributo content) |
| estado do endereço sem verificação da linha (pt) | RP4N-i: a cópia sem verificação própria herdou o estado do endereço (pt) |
| estado do endereço sem verificação da linha (en) | RP4N-i: a cópia sem verificação própria herdou o estado do endereço (en) |
| utilizador | RP4N-i: caminho ou identificador local (utilizador) |
| casa | RP4N-i: caminho ou identificador local (casa) |
| temporario | RP4N-i: caminho ou identificador local (temporario) |
| projetos | RP4N-i: caminho ou identificador local (projetos) |
| worktrees | RP4N-i: caminho ou identificador local (worktrees) |
| prefixo novo num commit aceite | RP4N-i: ocorrência nova não recebe a exceção histórica |
| prefixo aceite noutro commit | RP4N-i: outro commit não recebe a exceção histórica |
| procura real na cabeça | RP4N-i: a procura da cabeça encontrou o conhecido-positivo |
| procura sem ocorrência | RP4N-i: ausência distinguida do erro |
| erro real do git grep | RP4N-i: erro na procura da cabeça, código 128 |
| pt-copia-diz-so-nenhuma | C1: a ausência de segunda leitura não corresponde ao registo; C1d: a ausência de releitura não tem o rótulo correspondente |
| pt-copia-herda-estado-endereco | C1i: a cópia sem verificação própria herdou o estado do endereço |
| en-copia-diz-so-nenhuma | C1: a ausência de segunda leitura não corresponde ao registo; C1d: a ausência de releitura não tem o rótulo correspondente |
| en-copia-herda-estado-endereco | C1i: a cópia sem verificação própria herdou o estado do endereço |
| Página legal trocada | ledger/claims/penalizacao-legal-um-ano-antecipacao-2026.yml: traz o rótulo "penalização legal" e o localizador "Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 272, parágrafo abaixo da Figura 8.4", que não é nenhuma das 14 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · AA08b, Quadro 49 do RASARP, baixa continental e cobertura · p.<n>, linha <n>, campo <n> · página e figura da redução cumulativa da pensão · página e parágrafo da penalização legal · <folha>, linha <n>, coluna <n>). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar. |
| Figura legal trocada | ledger/claims/penalizacao-legal-um-ano-antecipacao-2026.yml: traz o rótulo "penalização legal" e o localizador "Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273, parágrafo abaixo da Figura 8.5", que não é nenhuma das 14 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · AA08b, Quadro 49 do RASARP, baixa continental e cobertura · p.<n>, linha <n>, campo <n> · página e figura da redução cumulativa da pensão · página e parágrafo da penalização legal · <folha>, linha <n>, coluna <n>). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar. |
| nome legal trocado pelo título do relatório | RP4N-i: o nome legal não é a medida no parágrafo da fonte |

### Capturas
O manifesto `i/capturas-i.json` contém 35 capturas nas larguras 390, 768, 1024, 1280, 1600; construção `f99ad385789e293373951ddb77f25ac221181daf`. Inclui o Método inglês, os recibos da pensão e da penalização legal nas duas edições e a frase alterada dos ministérios nas duas edições. Problemas de carga ou transbordo medidos: 0. A inspeção está em `i/inspecao-visual.json`.

| Ficheiro | sha256 |
|---|---|
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-pt-390.png | 5a83480aba796d6d395ca07d381d8158f5c74c61d6d12f1086a57707af2c14a9 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-pt-768.png | 6d88558ca755d85d67f2984f985820c74f74b5d641422689b4989911f0ece606 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-pt-1024.png | 0e690e1d21f7b132879cb28f20e121e1ebe4b1302d845209c1061b5f56bdfcf1 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-pt-1280.png | fa8e36aaaa5aa11b9198e04e7480fbf6888e5e2aed8cdaa519483c96833fdd2f |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-pt-1600.png | 4ca4f2f7195793c63c28cf9c0256d09fd4990d1a042c79d74e4961a294536e15 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-en-390.png | 4bebc48cfd2ae644e384281b20511c5ed5b1f66cfb8c71434b8f23d8b30c95fa |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-en-768.png | f565475e275b22d8208b1e7ae652f319bac090a27920bb2e681d402ac5bbe581 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-en-1024.png | 612d0d858022a32f072c7ffa04496ee25f41ad5f1b16c8138d670beb2ce2ccde |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-en-1280.png | da29004b046e3ca20bdb01477159d51dc9c016efb23326cd3b66f4ad60a2d41c |
| design/especime-v3/capturas/rp4n-2026-10-06/i/corte-en-1600.png | 4677451a18493be246d7554306a0a35b2cb0f42323e22d62887abbba36f46063 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-pt-390.png | 6cb068da9da10b15639e4fe5bf866c970ed18ca1c9fd677999268202981bcabf |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-pt-768.png | d8d508505cceb99f1379fc195c35d4d2b605855a208d44f8a4505ec98ec92719 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-pt-1024.png | 778967b65d6290d1450140d4203343f7211da8938be4f535f0ee267ac0d72c25 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-pt-1280.png | 7e5ff935b046ced5f05a8f35d911a38b12a6b991a27175c7af939088623a6b44 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-pt-1600.png | 0926eacd61d9919351291b03da8231854f4437d23bd69bedde9b7d233683aaf3 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-en-390.png | b60039edaf6f6848511fa4438b7cccacf808af2d90ec8cbbe2a310d58bd26a69 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-en-768.png | 4f0fb640ffe191bd52200375d939aa6f24421d4c2da909c47a794231037e0c49 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-en-1024.png | 5d0e18e552e090c3fa8a3d8a735076c50e8637db71f92414925d70f264cd92fd |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-en-1280.png | f85c7da27b96cfea7b18dad69f70b291f9586cf39d7b51db6aaee7802725875c |
| design/especime-v3/capturas/rp4n-2026-10-06/i/legal-en-1600.png | 5291b66510b54c4fa0e570fb6ab2d415a8fefe7c00f06760807024bed388bceb |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-pt-390.png | 36ca12b395f752bc1173ba67a60e73e8666a9916b32f9d20f9635f0ae11152ed |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-pt-768.png | 9d0f015f608ce39d985bd7270f8b47a53e52d00530bd43b7f78b5082c2088fea |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-pt-1024.png | 23809c4915623d0f7ca261e06ebefb7a8c4de5b36505d0d301e1fe90d3945207 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-pt-1280.png | 17e9d85747f51807b3f65983e73d454777f24718c145b1517b6e3eb2473827c4 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-pt-1600.png | 8e986269e89b46c5cc1e9362370926122f80ffc1e1de7ea27eb9d5c40e5460f3 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-en-390.png | b3d87b29cf431f99cc858949344eda2dc8bd5d7df52f442587c2f9237404c2b2 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-en-768.png | 7e5c4f4ab68fb3733751a4ec4a8686a1a042995392e272c84a35f3262015a524 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-en-1024.png | a060875b389e133988447405445167f5f291fbfe8e7cae29cd1f66d691f4a9b3 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-en-1280.png | 109d903db1a89eb7d4ebf7ce3fa860c715ecdf6d03a42aa2e284d4e4bbc7567b |
| design/especime-v3/capturas/rp4n-2026-10-06/i/ministerios-en-1600.png | 077629c488891f69defcca905324e9d5de141c98f58b8b7b7416323f57543cd1 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/metodo-en-390.png | 9f6e3e01da734fb171232194354a83bd10e22de298d15d2c11f815193d5946ff |
| design/especime-v3/capturas/rp4n-2026-10-06/i/metodo-en-768.png | 34a420318ea05e926ec9514b10091d064c5b60f22107a2c224eda5271cb951a0 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/metodo-en-1024.png | 5e84550563b5d016f50c262393ed5bfb56691a5920369aa96d7a36c21ed5485d |
| design/especime-v3/capturas/rp4n-2026-10-06/i/metodo-en-1280.png | 876031fbf612b274e678bba9a45d57844cbab7e26af662d096041351d62e64f6 |
| design/especime-v3/capturas/rp4n-2026-10-06/i/metodo-en-1600.png | ead39995e64d833e924ab1f41d5ebfc9f943bc9aa61537014aeb6368e2dd98b6 |

### Custo e razões do excesso anterior
A passagem g consumiu 552 340 símbolos contra o alvo de 300 000, excesso de 252 340, segundo a medição da direção transcrita no mandato e lida por `medir-custo-i.py`. Os registos conservam 6 tentativas recusadas pelos portões. Foram repetidas construções e conferências, além das correções: `portoes-g-tentativa1`; `portoes-g-tentativa2`; `portoes-g-tentativa3`; `portoes-g-tentativa4`; `portoes-g-tentativa5`; `portoes-g-tentativa6`. As capturas estão em `g/capturas.json` (12 capturas). A reescrita e a conferência das árvores estão em `g/reescrita.json` (45 pares de commits). Estas são as operações documentadas que alargaram o trabalho; não há medição de símbolos por operação que permita repartir o total ou ordenar o seu custo.

A passagem h consumiu 398 154 símbolos contra o alvo de 200 000, excesso de 198 154, segundo a medição da direção transcrita no mandato e lida por `medir-custo-i.py`. Os registos conservam 2 tentativas recusadas pelos portões. Foram repetidas construções e conferências, além das correções: `portoes-h-tentativa1`; `portoes-h-tentativa2`. As capturas estão em `h/capturas-h.json` (60 capturas). Na h, as tentativas de reescrita recusadas e a correção por commit normal estão em `h/rp4n-17.json` e no relato h. Estas são as operações documentadas que alargaram o trabalho; não há medição de símbolos por operação que permita repartir o total ou ordenar o seu custo.

O custo desta passagem só será atribuído se a linha «tokens used» estiver visível. O identificador do modelo nos trailers reproduz o mandato; o runtime não expõe ao agente o identificador exato nem o nível de raciocínio.
### Commits

| sitio | Mensagem |
|---|---|
| 4d92610b3028c78d6dc2b02e3bf12624ea2e0049 | docs(rp4n-i): registar a leitura h, as plantas e o mandato |
| 6e27d16949d723cc699b2f0c108625d86e0e5cf3 | fix(rp4n-i): conferir a língua em todos os atributos |
| 40d0849688eb05e7fd58c2ddf32d30e0270ec6c7 | test(rp4n-i): distinguir falha e ausência na procura da cabeça |
| bddf20857f3ae54a1072840389e08e6b77228e83 | fix(rp4n-i): fechar RP4N-17 com a exceção histórica exata |
| bf1e71783aa02ce76b6ca05cfe5b07b26eb07cf8 | fix(rp4n-i): não atribuir à cópia a leitura do endereço |
| 667863d993d98a914d01b1ad2a3f108ee46c8e36 | fix(rp4n-i): anonimizar os registos recebidos de main na cabeça |
| 22d8cca115331daeecc0661d716e93dc8b81f18e | docs(rp4n-i): medir o excesso de custo e ligar as operações aos registos |
| 1e11e36c15824ea2b95765897ff30bdf2d1bd7b1 | fix(rp4n-i): explicar os dois totais e inventariar as fontes das decisões |
| bef0184c90c1aa7e16ddb4c6c7a4bcb8c71b7cdb | test(rp4n-i): exigir leitura própria também no portão das fontes |
| 333a885c7121663e5b5f61c10fc80efc1f7ebac9 | test(rp4n-i): preparar as medições e o relato pelos ficheiros |
| b34871dc4269ad715c2bd48e5da4208d8a717a65 | docs(rp4n-i): conservar a versão original do manifesto da pensão |
| 20d4fda36f183003f0688ece02e3291daaa09813 | fix(rp4n-i): medir as fontes do bloco contra o main recebido |
| 3eee2de63448b6e81e732879b9c846ee7b543d71 | fix(rp4n-i): apresentar o nome literal da medida e a sua língua |
| 2aeec1272abab138ccb82ea529433bbce174c624 | fix(rp4n-i): conferir a ausência de leitura própria no C1 |
| 1ddec358f67093ecc1b83d6850f5654db85b488d | fix(rp4n-i): usar a marca inglesa também nas descrições da página |
| f99ad385789e293373951ddb77f25ac221181daf | fix(rp4n-i): reconhecer e provar o localizador do nome legal no índice |


| motor | Mensagem |
|---|---|
| 0d1d54e7a5fb424a2905e3b527a232b88181f2c0 | fix(rp4n-i): selar o total consolidado e a nota do MAPA 4 |
| cc75e215caf71d5e8cfa77850f1896f3b418c75f | fix(rp4n-i): usar o nome da medida no parágrafo da penalização legal |


## A passagem RP4-n-h

A RP4N-15 fecha pelo ramo de alojamento autorizado no mandato. Não se recuperou o pedido HTTP original: recuperou-se o registo versionado da cópia com os mesmos bytes. A data é a do commit que introduziu esse registo, e os recibos distinguem alojamento de leitura na fonte.

### A prova das pensões

O PDF `content/13 Dominios/source/rp4n/pensoes-copia-alojada.pdf` tem 4521348 bytes e SHA-256 `555936bdc750f66826c4919fab5d288e0b726a76e72f224ba655c82390381366`. A cópia em `content/11 Seguranca Social/source/` existe na árvore principal, foi lida sem a alterar e coincide byte a byte; está excluída do Git, por isso não veio para a worktree. A worktree conserva o manifesto. O inventário das duas pastas e a procura de pedidos estão em `h/pensao-prova.json`: 0 pedidos com estes bytes. Os campos históricos `fetched_at` do livro não foram promovidos a recibos HTTP.

O commit `7c0b24700d76cb3a67442f2495178212169c7586`, datado `2026-08-24T11:31:53+01:00`, introduziu `content/11 Seguranca Social/source/MANIFEST.sha256`, cujo SHA-256 na introdução é `4b9bc26fe06aa5c809ca880e3c74bfb6e0f74068087081518bc2d2087594a0ac`. A linha com o resumo do PDF já está nesse commit e não está no pai. A mensagem diz: «Os PDFs ficam fora de git, com os resumos em source/MANIFEST.sha256.». As duas linhas ficam com `access_date: 2026-08-24` e `access_date_kind: hosted-copy`; a porta pública da prova é `/provas/pensao-alojamento.json`.

### As marcas e as linhas incompletas

| Medição | Antes | Depois |
|---|---|---|
| Páginas com marca | 38 | 28 |
| Linhas publicadas incompletas | 6 | 4 |

Antes: varredura do `dist/` conservado da cabeça `344081c34eef1f792feef6bfd2d77fd764f7a1b5`, com o ramo em `d430d6dd1e17e4f1f23acc7273321f5e4380beff`. Depois: varredura pela mesma expressão das duas grafias, em `medir-h.mjs`, construção `19723a9f3876bff3ad4364d00bb017c63cda56d3`. O contador lê páginas HTML, incluindo referências legítimas à marca; não confunde páginas com ocorrências. A lista das linhas usa `provenienciaIncompleta`, a mesma regra do livro.

Páginas que deixaram de ter marca:

- `/areas/trabalho-solidariedade-e-seguranca-social/index.html`.
- `/en/areas/trabalho-solidariedade-e-seguranca-social/index.html`.
- `/en/ledger/penalizacao-antecipacao-um-ano-neutra/index.html`.
- `/en/ledger/penalizacao-legal-um-ano-antecipacao-2026/index.html`.
- `/en/pay-pensions-and-benefits/index.html`.
- `/en/studies/index.html`.
- `/estudos/index.html`.
- `/livro-razao/penalizacao-antecipacao-um-ano-neutra/index.html`.
- `/livro-razao/penalizacao-legal-um-ano-antecipacao-2026/index.html`.
- `/salarios-pensoes-e-apoios/index.html`.

Linhas ainda incompletas:

- `evora-prr-aprovado-2026`.
- `evora-prr-pago-2026`.
- `evora-prr-vencido-aprovado-2026`.
- `saldo-natural-portugal-2025`.

Na passagem h, a marca inglesa passou a `[to verify]` nos textos dos componentes: campos, selos, frases, agenda, livro e marcas de água. Ficaram por corrigir os atributos `title` do Método, como a leitura a frio apurou. O texto do Método usa a mesma forma e a página explicativa já não promete manter a grafia portuguesa. Os dados e as transcrições históricas conservam a forma que lhes pertence. A planta da passagem h percorre o texto de todas as páginas construídas e o atributo `data-marca`, mas não os restantes atributos; as páginas dos temas não contêm a glosa dentro da frase K2, com conhecido-positivo que a volta a inserir.

### Os outros achados

Os achados plantados na cópia não estavam no ramo recebido: água com «noventa e três por cento»: `True`; pensão com «one year early»: `True`; data da linha na base: `"[a verificar]"`; divisão pela DESPESA TOTAL: `True`. A prova da reescrita tem 45 pares. As cabeças destas releituras são `66852410165e7f38b0bd42757e848681e0468db1` e `542fe4ee9d67ecf2245892fd98ccd1c442829704`.

A reconferência anterior à criação da linha legal saiu; não foi substituída por outra entrada manual. O localizador inglês do rótulo e o localizador do documento das pensões atravessam agora do motor em campos próprios, conferidos literalmente. A planta da sinopse chama a mesma função que o portão da voz: a mensagem antiga do teste era uma descrição sintética, embora a secção anterior a listasse entre mensagens reais; as mensagens abaixo são as devolvidas pelo portão.

A RP4N-16 regista `publisher/manifest.evora.json` na dívida JD1-9. O ficheiro não foi alterado: `h/rp4n-16.json` compara o blob da base com o atual. O achado relativo à divergência entre prompt e mandato pertence à direção.

A nota define as exclusões da despesa consolidada, não enumera diretamente o que a DESPESA TOTAL inclui. Conserva-se a frase, como manda o achado 13. A página foi também inspecionada visualmente. Excerto integral da nota, preservado como a fonte o escreveu:

> A "DESPESA TOTAL CONSOLIDADA" exclui os fluxos intrasetoriais e intersetoriais de juros, subsídios, transferências correntes e de capital, ativos e passivos no
>  âmbito da Administração Central, bem como da aquisição de bens e serviços efetuada no âmbito do Programa Saúde da Administração Central.

### As frases e os localizadores lidos do HTML

As definições da água, da pensão e dos ministérios mantêm a redação recebida. As mudanças de língua e de data estão lidas nos campos dos recibos:

| Recibo | Localizadores | Data rotulada nas definições | Verificações |
|---|---|---|---|
| pensao-pt | Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273, Figura 8.4; p. 273, Figura 8.4, rótulo da redução cumulativa | Cópia alojada a 24.08.2026 | Cópia alojada a24.08.2026 · Registo da cópiaSem resposta desde01.09.2026 · ao corredorReleitura tentada a01.09.2026, sem valor lido · conferência diária do ficheiro da fonte |
| pensao-en | Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273, Figure 8.4; p. 273, Figure 8.4, cumulative reduction label | Copy hosted on 24.08.2026 | Copy hosted on24.08.2026 · Copy recordNo answer since01.09.2026 · to the runnerRe-read attempted on01.09.2026, no value read · daily check of the source file |

**agua-pt**

> É a parte da água entrada no sistema que não é faturada, nas entidades gestoras em baixa de Portugal continental. A avaliação global abrange noventa e três por cento das entidades gestoras; a página apresenta também a avaliação em alta. O valor situa-se na faixa «Qualidade do serviço mediana» da ERSAR: acima de vinte e até trinta por cento, incluindo o limite superior.

**agua-en**

> It is the share of water entering the system that is not billed by retail operators in mainland Portugal. The overall assessment covers ninety-three per cent of operators; the page also presents the wholesale assessment. The value falls in ERSAR’s “medium service quality” band: above twenty and up to thirty per cent, including the upper limit.

**pensao-pt**

> É a estimativa preliminar do grupo de trabalho da redução atuarialmente neutra para antecipar a reforma um ano: a redução que, nas contas do grupo, deixa a pessoa sem vantagem financeira esperada entre reformar-se já e adiar a reforma um ano, contando as contribuições que deixam de ser feitas e os direitos que deixam de ser formados. Não é a penalização legal por antecipação. A penalização que a lei aplica por um ano de antecipação, sem o fator de sustentabilidade, é de cerca de 6 % e é menor do que a redução atuarialmente neutra de 8,2 %.

**pensao-en**

> It is the working group’s preliminary estimate of the actuarially neutral reduction for retiring one year early: the reduction that, in the group’s calculations, leaves the person with no expected financial advantage between retiring now and postponing retirement by one year, including contributions no longer paid and pension rights no longer accrued. It is not the statutory early-retirement penalty. The statutory penalty for retiring one year early, excluding the sustainability factor, is about 6 % and is lower than the actuarially neutral reduction of 8,2 %.

**ministerios-pt**

> É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central.

**ministerios-en**

> It is the amount for this ministry out of every hundred euros of “DESPESA TOTAL” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector.

### Cabeças, portões e repetições

| Repositório | Base | Cabeça do código |
|---|---|---|
| sitio | 66852410165e7f38b0bd42757e848681e0468db1 | 19723a9f3876bff3ad4364d00bb017c63cda56d3 |
| motor | 542fe4ee9d67ecf2245892fd98ccd1c442829704 | e2fd95fde167ad54f36a426bc1487bd6c53c9f2a |


| Ficheiro | Código lido | Cabeça |
|---|---|---|
| portoes-h/build.codigo | 0 | 19723a9f3876bff3ad4364d00bb017c63cda56d3 |
| portoes-h/verify.codigo | 0 | 19723a9f3876bff3ad4364d00bb017c63cda56d3 |
| portoes-h/typecheck.codigo | 0 | 19723a9f3876bff3ad4364d00bb017c63cda56d3 |
| portoes-h/motor.codigo | 0 | e2fd95fde167ad54f36a426bc1487bd6c53c9f2a |
| h/reconferencia-codigo/series.codigo | 0 | 19723a9f3876bff3ad4364d00bb017c63cda56d3; motor e2fd95fde167ad54f36a426bc1487bd6c53c9f2a |
| h/reconferencia-codigo/cruzamento.codigo | 0 | 19723a9f3876bff3ad4364d00bb017c63cda56d3; motor e2fd95fde167ad54f36a426bc1487bd6c53c9f2a |

Os portões correram com as árvores do código limpas, sob a tranca comum. As séries e o cruzamento correram depois do último commit que muda o que leem, com as duas cabeças escritas antes e depois; o cruzamento usou `--with-origin`. O commit posterior contém apenas registos e capturas, que estas duas conferências não leem. A cabeça final é o commit que contém este relatório, identificada na resposta, sem tentar escrever o hash do próprio commit no seu conteúdo.

As tentativas anteriores ficam conservadas, sem serem apresentadas como verdes. A primeira construção completa detetou entradas antigas reativadas a mais no inventário da voz; foram repostas como retiradas antes da repetição. A segunda construção passou; a conferência restante detetou a regra antiga da data local na K16 e a contagem antiga de campos. Ambas foram atualizadas, com plantas para a prova da data, antes da nova corrida.

| Tentativa | build | verify | typecheck |
|---|---|---|---|
| portoes-h-tentativa1 | 1 | 125 | 0 |
| portoes-h-tentativa2 | 0 | 1 | 0 |

### Capturas

O manifesto `h/capturas-h.json` regista 60 capturas, nas larguras 390, 768, 1024, 1280, 1600; construção `19723a9f3876bff3ad4364d00bb017c63cda56d3` e cabeça da captura `19723a9f3876bff3ad4364d00bb017c63cda56d3`. Inclui os dois recibos da pensão, os temas, a área Trabalho, os índices dos estudos e o Método, nas duas edições. Problemas medidos de carga, navegação ou transbordo: 0. A inspeção visual e os ficheiros vistos estão em `h/inspecao-visual.json`.

| Ficheiro | Largura | sha256 |
|---|---|---|
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-pt-390.png | 390 | bd041938dca0d9ea8768f327fe4ab479c64172ecea5497c6dabefe3ec01f75b3 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-pt-768.png | 768 | 9f15e1e971e281cf931b5023024aab89d53f82ef26d43fdae1b8e5a7fc4535d4 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-pt-1024.png | 1024 | 9e3d7ae154fd7d173f38dca93e24093f29b6f0ff893faa3a42e2982b4c2af7e3 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-pt-1280.png | 1280 | 4e102cb7419cefe7fb3742c3932e95c3ef57f1ecf260da8ef973d5daf31e2a46 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-pt-1600.png | 1600 | 606c450759775bb2b7233f4ae566a72c41bfc0e5bbc04c5b9aadff2689e79dbc |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-en-390.png | 390 | 21358068def1e82f89e2143218f601e3e0a7ed7984a075961cdd8c899b2c107d |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-en-768.png | 768 | 7e70835d5822e67f2a88ad98cd6638c9c542356f91d100b1e39c58aed10e9861 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-en-1024.png | 1024 | ff986f53d6c0849336a16ebb434a68401bc7298de44a09fa025558439668922f |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-en-1280.png | 1280 | 7f45c4a159bdf81cd77dee9aa50b0bf16d881c15b336cdc9220e1e0dd2e2d74a |
| design/especime-v3/capturas/rp4n-2026-10-06/h/corte-en-1600.png | 1600 | b6ed6bf51735c442585f6e58cef9b2c9184790f71f3a67e4553890fce2d8ffad |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-pt-390.png | 390 | 87571cedb9c801dfe5cacc672b3d17566caa0dadc5fccdcc0e7dbe271200f767 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-pt-768.png | 768 | 6cf7b797d7e817937b1369890afaaa1beabc6132de0c23d5d964b25fa26a9d3d |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-pt-1024.png | 1024 | 58e9b59727533fba0b6da93daa551e9fdb1862942d67b7c04e5519568b990931 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-pt-1280.png | 1280 | bf7c170cf8c7f46380a7d061d241915964fe6298d4718ca3791773157fd38cd8 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-pt-1600.png | 1600 | 62d17a9509b97932941e040cb7945bddfa4994afdb8d06ca235f2d3decc06c17 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-en-390.png | 390 | 9055c8270d9d71c767ed78364513d357585e0a1d186b1c6ed577ea1dc3a740b5 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-en-768.png | 768 | 2271cbc4c86b28f19a4b5596631fd7eb5581aab00c7ae452b30662ac8d6de669 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-en-1024.png | 1024 | 0198e0d54722af2b3a356de864dfd11c20c22495c1e8de54de7ec6bc8902a662 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-en-1280.png | 1280 | b734d024347497e174fdcc026e70d4fe0defb453747db1923c8dd38336f5f49a |
| design/especime-v3/capturas/rp4n-2026-10-06/h/legal-en-1600.png | 1600 | dad1a8f18f181605203f19d0e88e8dc63a67180f3e7fad923633c9180c496067 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-pt-390.png | 390 | f9b3fd8368487e41873e567fd07499540b7927cb9527ec63b6c05a647d010049 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-pt-768.png | 768 | 57dc3cc4fe6d26cc48edc189e05a3aa23d54da0bd8e5b013990c094a488f0357 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-pt-1024.png | 1024 | be86702080311dc30fd5b8ee1f0bda6924d14a7ee3f277c2eb8bf8aafaebe165 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-pt-1280.png | 1280 | c3695254735fa9eb3ab45c30a51c7f42049880cb595dcdac6b652f3b96febf7b |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-pt-1600.png | 1600 | d6a734f18b24d3fe60961869e6387b8713fcc451aa4c5b9ccb008c6bf4540512 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-en-390.png | 390 | d271bbc37124e447f7fc3f617350a2be817920caa307b4220accdc38aa27a118 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-en-768.png | 768 | bd8f2f3308d978bbb580925978f0f2212ccbafb36bf5d1dc0e48ab034879f4d4 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-en-1024.png | 1024 | 93fe5ca2b8c2d1da8894cc3460bcc4d5896f0d1b2f76683bbb3aaefa542cd019 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-en-1280.png | 1280 | 4e4cd75dd659e318d5f52c8da4dfb1217d7a21d280d57aa7ff748c01e6cd5d73 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/tema-en-1600.png | 1600 | 11545b3833da5ff465ad9ecbd9e708cd4960a41d8b22fed0882ba00880f36f2c |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-pt-390.png | 390 | 5e8955bb5b996a2db8db7e9e89963879b1fb3425e1a038d13e41aa190c33a53d |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-pt-768.png | 768 | 28e120863a70dee2e36035f4b20b43eb0bd0d84ff066e191e0227ae1be8cd6fd |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-pt-1024.png | 1024 | 86dadf04f70cc698c2c0b30a391eea873c4e63d95d92c0f56a5df0a200cc1203 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-pt-1280.png | 1280 | 4a9eb3daaa6b05b0aaecf054835db0f894f162aecd779456011bcf9c3ee8ffca |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-pt-1600.png | 1600 | 48756f9df25a75782f9a9edf3e89f184f6d6a692b3f3d47a9c1fae8372a53ba6 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-en-390.png | 390 | 5f1e12383fa325880d2bfae0ecb7f2616ad461b3db15d444b594d039fd3e32c4 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-en-768.png | 768 | e2b12eec716a1ef6e920a65193e9e9f16836e6618f1448f74412fb6f09e53af3 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-en-1024.png | 1024 | 661fa4d4caaaefdca971b416289ddd5ba995ed96d9d58b57967e75627b90e7e4 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-en-1280.png | 1280 | e9b74bffa4fcdfe707fb561745a8c692dde7e797e89086ad066f240ab688fd92 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/area-en-1600.png | 1600 | c69c663be7694b97046e55ce7f2874808f4a2ee7a5e11354e13dac4bbe7ac9b9 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-pt-390.png | 390 | e366f49ea3ac3ee71f588c3ae41a4a877942b93fb97d847f542679a99519c015 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-pt-768.png | 768 | 9278e0fe80d3322cea6f78dce30516965bf09476564f3590643684485bf5431c |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-pt-1024.png | 1024 | 65fc4a70e17a4625f53302087968ba2e199e6fb083712a02ea3bd27251bd93f9 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-pt-1280.png | 1280 | ceb2adbd10a2cbb34754be63d5007b11c4c28d08e9f11dc3d5f4041d2a92b145 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-pt-1600.png | 1600 | b7ed065dfcf40e54e6f39ae4a4648747d09982b33b6fce0f009688a967b66dad |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-en-390.png | 390 | 8d48bae03325ec3b4edf77d81657a02d2156837827a090af3c894b08d3d28f57 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-en-768.png | 768 | e5c6fb2add1be0ebd9837e1e5c106563eccef37b4364be5078be8dfeda11032c |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-en-1024.png | 1024 | ae8d1138187525f092a8ea860306d5685de39599ed98319b5767f83d2f531260 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-en-1280.png | 1280 | d58f6deb4742e2314d25a378868140c3a2f46258d18b63993282bf5ceb904d70 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/estudos-en-1600.png | 1600 | 28402416076933519735242fce4d3d8e4d2db274132f5f3a0081aa044deb4647 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-pt-390.png | 390 | 24cbe16c8519e50dd47946fd025c532210e825c600454ad77f200e0d7735d52f |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-pt-768.png | 768 | 1938d46034f2f0e33086aa17b4859dc7d2c7a3bda2d621fde91ded42e91c11b6 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-pt-1024.png | 1024 | cce601c70c2b1af30426c1ac2a47fc046ce9734b3a30710edebe0638d2c023c9 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-pt-1280.png | 1280 | 981751f087527614af75cd0c094c414a981809019b6fce41fe6cb81030fbcf9c |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-pt-1600.png | 1600 | 82929d2121f4957b3b0829299092fe3ad554be499ad21cf9cb70c402f90186f5 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-en-390.png | 390 | d4eb0eb322e1da9a54ae820ca4c73301a09f1a7dd0a5706341105a57b28598e5 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-en-768.png | 768 | 8342f6ad304858a8c898404f9d6dfd3771a6b2e59a014497968a799d45d6f5b9 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-en-1024.png | 1024 | 070c53d41eb97c84406dd0569c758589b80f16a289e97ac8c2ebb0a99bf4ed98 |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-en-1280.png | 1280 | 7a537942cdf6cf98688f1fe26df604650e45b454fdf807521b457e8ba978ffff |
| design/especime-v3/capturas/rp4n-2026-10-06/h/metodo-en-1600.png | 1600 | cd70d675e68a2fc6ba765e886ecafe2305145cb3d2bf234f70572a7695753e61 |

### Plantas e mensagens reais

| Planta | Mensagem |
|---|---|
| reconferência anterior à criação | RP4N-h: reconferência anterior à criação da linha legal |
| data local sem prova | a data local não tem prova de leitura ou alojamento |
| data local trocada | a data local não tem prova de leitura ou alojamento |
| manifesto local sem commit | a data de alojamento não aponta para o manifesto do commit |
| tipo da data local inventado | a data local não distingue alojamento de leitura |
| localizador trocado (penalizacao-antecipacao-um-ano-neutra, pt, name_source) | RP4N-h: localizador fora da língua da edição (pt, name_source) |
| localizador trocado (penalizacao-antecipacao-um-ano-neutra, pt, document.locator) | RP4N-h: localizador fora da língua da edição (pt, document.locator) |
| alojamento dito leitura (penalizacao-antecipacao-um-ano-neutra, pt) | RP4N-h: o recibo não distingue alojamento de leitura na fonte (pt) |
| localizador trocado (penalizacao-legal-um-ano-antecipacao-2026, pt, document.locator) | RP4N-h: localizador fora da língua da edição (pt, document.locator) |
| alojamento dito leitura (penalizacao-legal-um-ano-antecipacao-2026, pt) | RP4N-h: o recibo não distingue alojamento de leitura na fonte (pt) |
| glosa a meio da K2 (pt) | RP4N-h: a glosa interrompe a frase K2 |
| marca traduzida incorretamente (pt, selo) | RP4N-h: marca fora da língua da edição (pt, texto) |
| marca traduzida incorretamente (pt, campo) | RP4N-h: marca fora da língua da edição (pt, texto) |
| marca traduzida incorretamente (pt, frase) | RP4N-h: marca fora da língua da edição (pt, texto fora do componente) |
| marca traduzida incorretamente (pt, marca de água) | RP4N-h: marca fora da língua da edição (pt, marca de água) |
| localizador trocado (penalizacao-antecipacao-um-ano-neutra, en, name_source) | RP4N-h: localizador fora da língua da edição (en, name_source) |
| localizador trocado (penalizacao-antecipacao-um-ano-neutra, en, document.locator) | RP4N-h: localizador fora da língua da edição (en, document.locator) |
| alojamento dito leitura (penalizacao-antecipacao-um-ano-neutra, en) | RP4N-h: o recibo não distingue alojamento de leitura na fonte (en) |
| localizador trocado (penalizacao-legal-um-ano-antecipacao-2026, en, document.locator) | RP4N-h: localizador fora da língua da edição (en, document.locator) |
| alojamento dito leitura (penalizacao-legal-um-ano-antecipacao-2026, en) | RP4N-h: o recibo não distingue alojamento de leitura na fonte (en) |
| glosa a meio da K2 (en) | RP4N-h: a glosa interrompe a frase K2 |
| marca traduzida incorretamente (en, selo) | RP4N-h: marca fora da língua da edição (en, texto) |
| marca traduzida incorretamente (en, campo) | RP4N-h: marca fora da língua da edição (en, texto) |
| marca traduzida incorretamente (en, frase) | RP4N-h: marca fora da língua da edição (en, texto fora do componente) |
| marca traduzida incorretamente (en, marca de água) | RP4N-h: marca fora da língua da edição (en, marca de água) |
| utilizador | RP4N-h: caminho ou identificador local (utilizador) |
| casa | RP4N-h: caminho ou identificador local (casa) |
| temporario | RP4N-h: caminho ou identificador local (temporario) |
| projetos | RP4N-h: caminho ou identificador local (projetos) |
| worktrees | RP4N-h: caminho ou identificador local (worktrees) |
| glosa alterada na sinopse (pt) | B1 sinopse: evora-contas-da-camara-2010-2025 difere das duas primeiras frases. |
| glosa alterada na sinopse (en) | B1 sinopse: evora-contas-da-camara-2010-2025 difere das duas primeiras frases. |
| data escrita no guião em vez do pedido | RP4N-h: a data ou o tipo da pensão difere da prova da cópia |
| resumo da cópia trocado | RP4N-h: o corpo da pensão difere da prova de alojamento |
| manifesto do alojamento trocado | RP4N-h: o manifesto do commit não prova estes bytes da pensão |
| alojamento sem registo | RP4N-h: a pensão não tem pedido nem registo de alojamento; retirar as linhas |
| alojamento dito leitura HTTP | RP4N-h: a data ou o tipo da pensão difere da prova da cópia |

### Privacidade e commits
A RP4N-17 regista a ocorrência histórica do prefixo genérico das pastas pessoais na leitura recebida e no diff que a retirou. A cabeça foi anonimizada num commit normal; a revisão automática rejeitou a reescrita dos commits sem autorização explícita. O guião conserva a contagem histórica e o código de recusa, sem a apresentar como verde; não havia nome de utilizador nem caminho pessoal completo nessa ocorrência. A conferência da cabeça e a do diff final estão na tabela abaixo.

| Conferência | Valor |
|---|---|
| historico_grep_c | 2 |
| diff_grep_c | 0 |
| cabeca_sem_excecoes_grep_c | 0 |
| legados_ficheiros | 16 |

O guião leu integralmente 16 ficheiros legados na cabeça: 0 contêm o nome do utilizador. A lista está em `h/privacidade.json`; os conhecidos-positivos cobrem separadamente cada pedaço procurado. A prova dos trailers lê as mensagens, incluindo a adjacência dos dois trailers no sítio. A designação do modelo nos trailers reproduz a exigida pelo mandato; o identificador exato e o nível de raciocínio não estão expostos ao agente nesta sessão.

| sitio | Mensagem |
|---|---|
| d430d6dd1e17e4f1f23acc7273321f5e4380beff | docs(rp4n-h): registar a leitura, as plantas e o mandato |
| 4a27f399555bb3e30c9b41b1f7cf507a1499612e | fix(rp4n-h): datar as pensões como cópias alojadas e retirar as marcas |
| bfe7a6d6f06523641ae67b5041db4f9227c261d8 | fix(rp4n-h): usar a mesma marca inglesa em todas as formas rendidas |
| 85e88f1108b3925f51058adac83d4eac8a50ec6c | test(rp4n-h): guardar a mensagem real do portão da sinopse |
| f6ac96e2787c81cf3a94c71abc58242e0b41a4cd | test(rp4n-h): plantar cada identificador local e ler os ficheiros legados |
| 8b4e849f68c8a70a9a4774c0e6a0e012fcd8eccc | fix(rp4n-h): conservar a prova de alojamento e conferir a marca traduzida |
| 4e9b60d19e654ac1122eee89c09bf6e35c6295cb | fix(rp4n-h): não atribuir uma reconferência inventada à pensão legal |
| f6d824ccc013eea74886addcb0447e7cc525359e | fix(rp4n-h): mostrar e conferir os localizadores na língua da edição |
| 6806e5372550eb7349f6db0f8e2a74387959688d | fix(rp4n-h): abrir o registo da cópia a partir da data do recibo |
| 28846e8e8f8a2ee5acb739cadf47f7db7f686293 | test(rp4n-h): reconhecer a marca inglesa na conferência dos campos |
| 55b5412b6fcc146454fc0a208608c722b3bd8f48 | docs(rp4n-h): registar a frase K2 sem a glosa da data ausente |
| a6e57115d5008e5d3a2301d6ab5add88f4afad7b | test(rp4n-h): medir as marcas, as datas, as capturas e as cabeças lidas |
| 31050f105e92ae9f0e4e1ef884bc9806d5a97353 | docs(rp4n-h): conservar o retrato anterior e a prova encontrada no motor |
| b99fd62a0ba6c7ff64344679f221bcc0d98983c5 | fix(rp4n-h): manter retiradas as redações anteriores à explicação dos termos |
| d3d44fb47d445e375d68def515c4ea500569360f | test(rp4n-h): registar a tentativa e exigir a árvore limpa no motor |
| 5e4ccb25ef9134cbc1e6dccf031a28656535b85d | docs(rp4n-h): anonimizar o prefixo genérico na leitura recebida |
| 54e82a758aebe25bab888ab85621509e6b98359d | test(rp4n-h): conferir na K16 a prova de alojamento e os campos novos |
| 19723a9f3876bff3ad4364d00bb017c63cda56d3 | docs(rp4n-h): conservar as recusas e distinguir a cabeça do histórico |


| motor | Mensagem |
|---|---|
| 2db37fd69b2e228bfe4af580c13c5d0cb2a1f3c5 | fix(rp4n-h): provar a data de alojamento das pensões no manifesto original |
| 5669004b2b917584e466d685120a15dacffed920 | fix(rp4n-h): retirar a reconferência anterior à criação da linha legal |
| e2fd95fde167ad54f36a426bc1487bd6c53c9f2a | fix(rp4n-h): exportar os localizadores ingleses da pensão |

### Custo

O excesso de custo da passagem anterior decorreu da reescrita da história, do tratamento dos achados e das capturas repetidas. Essas operações alargaram o trabalho para além da correção curta prevista, sem a explicação de custo que o relatório devia ter dado.

Nesta passagem não foi observada uma linha «tokens used» no registo disponível. Não se atribui um custo nem se afirma cumprimento do alvo sem essa medição.

## A passagem RP4-n-g

O achado da data original da pensão permanece aberto como RP4N-15. A cópia alojada está conferida, mas não se encontrou o pedido bem-sucedido que a trouxe. Não se substituiu essa prova por uma data de construção, pela hora do ficheiro ou por um pedido falhado. A entrega corrige a afirmação falsa, mostra a ausência e deixa esta condição de fecho para a direção.

### A ordem e as cabeças

A reescrita das mensagens veio antes do commit dos registos, e os registos antes das correções. Não houve publicação nem mudança de worktree. Os hashes seguintes foram lidos do Git e dos ficheiros dos portões. A cabeça final de entrega é o commit que contém esta secção; não se inventa neste ficheiro o hash do próprio commit.

| Repositório | Cabeça recebida | Cabeça do código medida |
|---|---|---|
| sítio | 7d8994e835ee70b4673fc76fa2385713365917dc | 344081c34eef1f792feef6bfd2d77fd764f7a1b5 |
| motor | 9293361 | 542fe4ee9d67ecf2245892fd98ccd1c442829704 |

A cabeça do sítio depois da reescrita, antes dos novos commits, é `478c83688116401055a7ba26b9aa3318d59f1d37`. A prova comparou 45 pares; árvores idênticas: `true`. O guião foi `git filter-branch -f --msg-filter`, limitado a juntar os trailers. A cópia herdada foi reposta num nome separado depois de o comando substituir o espaço de referências originais. As duas referências de cópia permanecem:

- `refs/original/refs/heads/rp4n-2026-10-07 7d8994e835ee70b4673fc76fa2385713365917dc`.
- `refs/original/rp4n-f/refs/heads/rp4n-2026-10-07 8ed6ed6ae1d60f3a47ccc5c45face2be7fcecd51`.

### Cada decisão

- **Achados 1 a 5:** Eram as plantas da direção. Não deram correções ao produto.
- **Achado 6:** A data já não está escrita no gerador. O gerador exige estado bem-sucedido, bytes e sha256 coincidentes no pedido original e deriva a data da hora desse pedido. Sem esse recibo, ambas as linhas levam a ausência de data. A releitura falhada continua falhada e o estado da fonte conserva a reconferência histórica. A planta rejeita a data escrita no guião. RP4N-15 continua aberta.
- **Achado 7:** A regra geral escolhe o rótulo da medida, não o título do relatório. A K17 compara o nome conferido das linhas com definição selada. A água e a pensão têm plantas nas duas línguas. O índice reconhece o localizador restrito da figura e recusa a página ou a linha trocadas. O índice matemático do rótulo da pensão só sofreu normalização de espaço da extração; o recorte continua a provar a figura.
- **Achado 8:** A frase e a derivação usam DESPESA TOTAL e o nome do mapa. O apoio da frase saiu da derivação do projeto e passou para excertos contíguos do mapa alojado. A conta continua a conferir o denominador pelo campo check. A auditoria da explicação do orçamento também foi ligada às duas classificações das fontes, sem mudar a prosa da direção; a emenda identifica o construtor e fica por ler. A procura antiga de despesa bruta está em f/despesa-bruta-procura.json e foi feita nos documentos abaixo, não no MAPA 4.
- **Achado 9:** A definição da água ganhou o nome e os limites da faixa do quadro da ERSAR, com origem selada. A régua verifica que o valor pertence à faixa e recusa o limite inferior excluído.
- **Achado 10:** A pensão explica a indiferença financeira individual em palavras comuns. A comparação usa tokens das duas linhas; menor, maior ou igual são escolhidos pelos valores. A K17 recompõe independentemente a frase e exige os dois identificadores. Números sem token continuam recusados.
- **Achado 11:** O marcador dentro do selo vem da tabela da língua. Os selos aceites continuam, incluindo os da área. Há uma planta por edição.
- **Achado 12:** A unidade da quota do PRR foi corrigida no motor e reexportada. Diz valor contratado, de acordo com a coluna da computação, em ambas as edições.
- **Achado 13:** A cabeça, o diff e a história são varridos por todos os pedaços pedidos. A saída abaixo conserva as exceções herdadas individualmente, sem abrir novas exceções.
- **Achado 14:** A ausência passa com publicador conhecido e excerto ausente; falha com publicador desconhecido ou excerto existente. A planta do caminho parte agora do HTML próprio de cada edição.
- **Achado 15:** Os trailers foram juntos por reescrita de mensagens antes dos novos commits. O Git lê ambos e a prova verifica também a adjacência literal.
- **Achado 16:** A coordenada de página deixou de fazer parte do título transcrito. O número mantém a sua origem; a palavra página ou page vem da tabela, com plantas nas duas famílias e línguas.
- **Achado 17:** A retirada das contagens tinha retirado o estudo da área, porque a lista dependia das linhas. A lista depende agora também da declaração do estudo. O estudo voltou nas duas edições e a aterragem declara a ausência exata das contagens. A edição inglesa arquivada mantém o texto da sua data, sem ser apresentada como contagem atual.
- **Achado 18:** O nome do cartão e a derivação da quota dizem prazo de conclusão, o campo que a computação usa. Há planta para a redação antiga.

| Documentos da procura anterior | sha256 | Ocorrências |
|---|---|---|
| content/20 Orcamento do Estado/source/eo-sintese-agosto.pdf | 8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5 | 0 |
| content/20 Orcamento do Estado/source/eo-sintese-julho.pdf | b5ca757c64943e605ddff5dfd27cde4f49005d17946eeab3239d1b812640a5ce | 0 |

### RP4N-15: o pedido original da pensão

O documento `content/13 Dominios/source/rp4n/pensoes-copia-alojada.pdf` tem sha256 `555936bdc750f66826c4919fab5d288e0b726a76e72f224ba655c82390381366` e 4521348 bytes. O manifesto não nomeia o pedido original. Os recibos encontrados, copiados em `g/pensao-pedidos.json`, são:

| Recibo | Hora | Estado | Erro |
|---|---|---|---|
| content/13 Dominios/source/rp4n/pensoes-d.pedido.json | 2026-10-07T09:52:50Z | None | SSLError: HTTPSConnectionPool(host='www.dgcp.mtsss.gov.pt', port=443): Max retries exceeded with url: /documents/10182/331337/Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf/1e42612d-c6c0-4232-89df-810c44af07ef (Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1077)'))) |
| content/13 Dominios/source/rp4n/pensoes-f.pedido.json | 2026-10-12T11:42:09Z | None | SSLError: HTTPSConnectionPool(host='www.dgcp.mtsss.gov.pt', port=443): Max retries exceeded with url: /documents/10182/331337/Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf/1e42612d-c6c0-4232-89df-810c44af07ef (Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1077)'))) |
| content/13 Dominios/source/rp4n/pensoes.pedido.json | 2026-10-06T09:48:13Z | None | SSLError: HTTPSConnectionPool(host='www.dgcp.mtsss.gov.pt', port=443): Max retries exceeded with url: /documents/10182/331337/Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf/1e42612d-c6c0-4232-89df-810c44af07ef (Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1077)'))) |

A condição de fecho é recuperar o pedido que efetivamente trouxe esta cópia, com o mesmo sha256 e tamanho. A data permanece por confirmar enquanto esse recibo não for recuperado. Não se inventou essa data.


| Recibo | Nome na fonte | Datas das definições | Ausência declarada |
|---|---|---|---|
| agua-pt | AA08b – Água não faturada | 11.10.2026, 11.10.2026, 11.10.2026 |  |
| agua-en | AA08b – Água não faturada | 11.10.2026, 11.10.2026, 11.10.2026 |  |
| pensao-pt | dcum x : cumulative reduction |  | Data do pedido original por confirmar. |
| pensao-en | dcum x : cumulative reduction |  | Original request date to be confirmed. |
| ministerios-pt |  | 12.10.2026, 12.10.2026 |  |
| ministerios-en |  | 12.10.2026, 12.10.2026 |  |


| Recibo da pensão | Estado da fonte no HTML |
|---|---|
| penalizacao-antecipacao-um-ano-neutra/pt | Sem resposta desde 01.09.2026 |
| penalizacao-legal-um-ano-antecipacao-2026/pt | Sem resposta desde 01.09.2026 |
| penalizacao-antecipacao-um-ano-neutra/en | No answer since 01.09.2026 |
| penalizacao-legal-um-ano-antecipacao-2026/en | No answer since 01.09.2026 |

### As frases lidas dos recibos

**agua-pt**

> É a parte da água entrada no sistema que não é faturada, nas entidades gestoras em baixa de Portugal continental. A avaliação global abrange noventa e três por cento das entidades gestoras; a página apresenta também a avaliação em alta. O valor situa-se na faixa «Qualidade do serviço mediana» da ERSAR: acima de vinte e até trinta por cento, incluindo o limite superior.

**agua-en**

> It is the share of water entering the system that is not billed by retail operators in mainland Portugal. The overall assessment covers ninety-three per cent of operators; the page also presents the wholesale assessment. The value falls in ERSAR’s “medium service quality” band: above twenty and up to thirty per cent, including the upper limit.

**pensao-pt**

> É a estimativa preliminar do grupo de trabalho da redução atuarialmente neutra para antecipar a reforma um ano: a redução que, nas contas do grupo, deixa a pessoa sem vantagem financeira esperada entre reformar-se já e adiar a reforma um ano, contando as contribuições que deixam de ser feitas e os direitos que deixam de ser formados. Não é a penalização legal por antecipação. A penalização que a lei aplica por um ano de antecipação, sem o fator de sustentabilidade, é de cerca de 6 % e é menor do que a redução atuarialmente neutra de 8,2 %.

**pensao-en**

> It is the working group’s preliminary estimate of the actuarially neutral reduction for retiring one year early: the reduction that, in the group’s calculations, leaves the person with no expected financial advantage between retiring now and postponing retirement by one year, including contributions no longer paid and pension rights no longer accrued. It is not the statutory early-retirement penalty. The statutory penalty for retiring one year early, excluding the sustainability factor, is about 6 % and is lower than the actuarially neutral reduction of 8,2 %.

**ministerios-pt**

> É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central.

**ministerios-en**

> It is the amount for this ministry out of every hundred euros of “DESPESA TOTAL” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector.

### O estudo e as capturas

- `pt`: `/estudos/which-door-is-yours`. A página diz: «As contagens de avisos abertos e de avisos que admitem pessoas singulares neste estudo estão por confirmar na fonte. A edição arquivada conserva o texto publicado na sua data.».
- `en`: `/en/studies/which-door-is-yours`. A página diz: «The counts of open calls and of calls admitting natural persons in this study are to be confirmed at source. The archived edition preserves the text published on its date.».

Antes: 4 capturas da construção conservada `a10b0ee3d3f9d30c9ab8b31edeb4901efb3d2199`, captadas quando o ramo estava em `a58623ac55fa35a645ec073b50d9278117b704a5`. A captura anterior não é apresentada como uma construção dessa cabeça de captura. Depois: 12 capturas, cabeça `344081c34eef1f792feef6bfd2d77fd764f7a1b5`, versão construída `344081c34eef1f792feef6bfd2d77fd764f7a1b5`. Problemas de navegação ou transbordo medidos: 0. Foram inspecionadas visualmente as capturas da água e da pensão em largura estreita e a área em largura larga; a geometria das restantes foi medida pelo navegador. A primeira inspeção visual apanhou a figura adiada da pensão em branco numa captura. O guião passou a esperar pela descodificação das imagens e repetiu o conjunto; os estados de carga ficam em g/capturas.json. Esta correção da medição foi registada antes da nova corrida integral. A tentativa anterior passou os passos individuais mas fechou na guarda D porque o construtor editou o guião durante as conferências; não se aproveita essa corrida como verde. Os HTML completos ficam junto das capturas medidas.

| Captura | Largura | Largura do documento | sha256 |
|---|---|---|---|
| design/especime-v3/capturas/rp4n-2026-10-06/g-antes/area-pt-390.png | 390 | 390 | 54aa6657f8bbd86a0678ad2912fa3ff862f6d0f0d9da5374f0399acc5f4cb57f |
| design/especime-v3/capturas/rp4n-2026-10-06/g-antes/area-pt-1280.png | 1280 | 1280 | aff5b89b740f387b902d03a3afcb065f6cc2bc192022c49f726e7a9df9bb2e76 |
| design/especime-v3/capturas/rp4n-2026-10-06/g-antes/area-en-390.png | 390 | 390 | ff7364520d573099ed7128c9ebf64f7379e01c17a461d07c882c350945bb04ff |
| design/especime-v3/capturas/rp4n-2026-10-06/g-antes/area-en-1280.png | 1280 | 1280 | 8c0551fddbbe9bb086c968cdc691a20d4ba31bcb887b6c21c8ec808a40002d66 |
| design/especime-v3/capturas/rp4n-2026-10-06/g/agua-pt-390.png | 390 | 390 | 4e1d00f2a9db27936e73149c9c0eda3cad8506196d3528f06ca623f2b60c35cf |
| design/especime-v3/capturas/rp4n-2026-10-06/g/agua-pt-1280.png | 1280 | 1280 | 4e41a7050cd7af1244d1b0e783fedf701fb9bee86c80c2216d3a4ca3356ca004 |
| design/especime-v3/capturas/rp4n-2026-10-06/g/agua-en-390.png | 390 | 390 | 7b1bac95beff472368175c1e3985c3d13d5fc1eb62ef3f202697e0b7516e962a |
| design/especime-v3/capturas/rp4n-2026-10-06/g/agua-en-1280.png | 1280 | 1280 | 1432393ae1e99fb9934d51118436c87873a96a8da8450335c68a2abed358bf2c |
| design/especime-v3/capturas/rp4n-2026-10-06/g/corte-pt-390.png | 390 | 390 | 62cd01890722e1f0c1ef37421f2879793262b2c3daae11e50163d0e4ee33b4b6 |
| design/especime-v3/capturas/rp4n-2026-10-06/g/corte-pt-1280.png | 1280 | 1280 | 18911c809d1abae685d967af559a538073acf78e34d80960080d2e3f6d347350 |
| design/especime-v3/capturas/rp4n-2026-10-06/g/corte-en-390.png | 390 | 390 | f9f858bb3e1c607f44df68101bb8fbdda93ef23f6a7cf49bdcd44ea8aa561623 |
| design/especime-v3/capturas/rp4n-2026-10-06/g/corte-en-1280.png | 1280 | 1280 | bcd851a9531b60f913f32f33f9ecdb8e3748a6d9644dad5faacf9157ca4bdb9a |
| design/especime-v3/capturas/rp4n-2026-10-06/g/area-pt-390.png | 390 | 390 | cea59c8df0cc127dabb46b982cefec57e2ff9b1f7d73cff3f8165e3a55b83563 |
| design/especime-v3/capturas/rp4n-2026-10-06/g/area-pt-1280.png | 1280 | 1280 | 8b461c25f19571bf8d960d95f2de781d17f261f1f412af59f4a2a7652bee09c0 |
| design/especime-v3/capturas/rp4n-2026-10-06/g/area-en-390.png | 390 | 390 | 5ac779906129f4d02e1a6ba92e23ddb586d41645a818a76b1bb5678d24e8c305 |
| design/especime-v3/capturas/rp4n-2026-10-06/g/area-en-1280.png | 1280 | 1280 | f9c9cfc5b6765284c2cfb9f0156c89d59ba8625459a2bdfdce32359ba82188ec |

### Portões e reconferências


| Ficheiro | Código lido |
|---|---|
| build | 0 |
| verify | 0 |
| typecheck | 0 |
| motor | 0 |
| series | 0 |
| cruzamento | 0 |

Os portões inteiros correram sob a tranca comum. As séries e o cruzamento correram com RESEARCHHUB_DIR, este último com --with-origin, e os registos escrevem as duas cabeças antes e depois. Depois do commit de entrega, estas duas conferências voltam a correr na cabeça final; os seus códigos e cabeças são comunicados na resposta, sem alterar outra vez este anexo.


| Tentativa | build | verify | typecheck |
|---|---|---|---|
| portoes-g-tentativa1 | 1 | 125 | 0 |
| portoes-g-tentativa2 | 1 | 125 | 0 |
| portoes-g-tentativa3 | 1 | 125 | 0 |
| portoes-g-tentativa4 | 1 | 125 | 0 |
| portoes-g-tentativa5 | 0 | 1 | 0 |
| portoes-g-tentativa6 | 0 | 1 | 0 |

As tentativas vermelhas ficam conservadas em portoes-g-tentativa*: detetaram a quebra de linha do rótulo, o reconhecimento dos ficheiros YAML na travessia as frases novas do inventário, a língua do rótulo impresso e a declaração do prazo de conclusão. Não são apresentadas como portões verdes.

A varredura final leu 3196 linhas no livro bruto e 3193 publicadas, percorreu 12878 ficheiros de texto e encontrou 0 referências públicas às linhas retiradas.
### Plantas novas ou refeitas e mensagens reais


| Planta no sítio | Mensagem |
|---|---|
| ausência atribuída a publicador desconhecido | K17 · famílias · avisos-pt2030-abertos, parte 1 («A fonte publica este número sem o definir por palavras.»): a ausência não corresponde à falta do excerto |
| ausência falsa com excerto existente | K17 · famílias · avisos-pt2030-abertos, parte 1 («A fonte publica este número sem o definir por palavras.»): a ausência não corresponde à falta do excerto |
| ministério dividido por outro total | K17 · famílias · oe-2026-cem-euros-ministerio-administracao-interna, oe-2026-cem-euros-ministerio-agricultura-e-mar, oe-2026-cem-euros-ministerio-ambiente-e-energia, oe-2026-cem-euros-ministerio-cultura-juventude-e-desporto, oe-2026-cem-euros-ministerio-defesa-nacional, oe-2026-cem-euros-ministerio-economia-e-coesao-territorial, oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao, oe-2026-cem-euros-ministerio-financas, oe-2026-cem-euros-ministerio-infraestruturas-e-habitacao, oe-2026-cem-euros-ministerio-justica, oe-2026-cem-euros-ministerio-negocios-estrangeiros, oe-2026-cem-euros-ministerio-presidencia-do-conselho-de-ministros, oe-2026-cem-euros-ministerio-reforma-do-estado, oe-2026-cem-euros-ministerio-saude, oe-2026-cem-euros-ministerio-trabalho-solidariedade-e-seguranca-social, parte 1 («É quanto vai para este ministério em cada cem euros da «D…»): cita « / oe-2026-despesa-bruta-administracao-central * 100 , 2 )», que não está no campo «check» da linha «oe-2026-cem-euros-ministerio-saude» |
| total do mapa trocado por palavras do projeto | K17 · famílias · oe-2026-cem-euros-ministerio-administracao-interna, oe-2026-cem-euros-ministerio-agricultura-e-mar, oe-2026-cem-euros-ministerio-ambiente-e-energia, oe-2026-cem-euros-ministerio-cultura-juventude-e-desporto, oe-2026-cem-euros-ministerio-defesa-nacional, oe-2026-cem-euros-ministerio-economia-e-coesao-territorial, oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao, oe-2026-cem-euros-ministerio-financas, oe-2026-cem-euros-ministerio-infraestruturas-e-habitacao, oe-2026-cem-euros-ministerio-justica, oe-2026-cem-euros-ministerio-negocios-estrangeiros, oe-2026-cem-euros-ministerio-presidencia-do-conselho-de-ministros, oe-2026-cem-euros-ministerio-reforma-do-estado, oe-2026-cem-euros-ministerio-saude, oe-2026-cem-euros-ministerio-trabalho-solidariedade-e-seguranca-social, parte 1 («É quanto vai para este ministério em cada cem euros da «D…»): cita «DESPESA TOTAL», que não está no campo «excerto» da origem «rp4n-total-ministerios» |
| título do relatório em vez do rótulo da água (pt) | K17 · recibo · pt · agua-nao-faturada-portugal-2024: o nome na fonte não é o rótulo da medida conferido |
| título do relatório em vez do rótulo da água (en) | K17 · recibo · en · agua-nao-faturada-portugal-2024: o nome na fonte não é o rótulo da medida conferido |
| título do relatório em vez do rótulo da pensão (pt) | K17 · recibo · pt · penalizacao-antecipacao-um-ano-neutra: o nome na fonte não é o rótulo da medida conferido |
| título do relatório em vez do rótulo da pensão (en) | K17 · recibo · en · penalizacao-antecipacao-um-ano-neutra: o nome na fonte não é o rótulo da medida conferido |
| separador final solto (pt) | RP4N-f: o caminho termina num separador sem destino |
| separador final solto (en) | RP4N-f: o caminho termina num separador sem destino |
| selo na outra língua (pt) | RP4N-g: o selo não está na língua da edição pt |
| selo na outra língua (en) | RP4N-g: o selo não está na língua da edição en |
| quota contratada rotulada como aprovada | RP4N-g: o rótulo da quota não corresponde ao denominador contratado |
| página na outra língua (agua-nao-faturada-portugal-2024, pt) | RP4N-g: a coordenada da definição não diz página na língua pt |
| página na outra língua (penalizacao-antecipacao-um-ano-neutra, pt) | RP4N-g: a coordenada da definição não diz página na língua pt |
| página na outra língua (agua-nao-faturada-portugal-2024, en) | RP4N-g: a coordenada da definição não diz página na língua en |
| página na outra língua (penalizacao-antecipacao-um-ano-neutra, en) | RP4N-g: a coordenada da definição não diz página na língua en |
| prazo de execução em vez de conclusão | RP4N-g: o nome e a quota não dizem o prazo de conclusão da computação |
| estudo retirado da área (pt) | RP4N-g: o estudo desapareceu da área depois da retirada das contagens |
| estudo retirado da área (en) | RP4N-g: o estudo desapareceu da área depois da retirada das contagens |
| água no limite excluído da faixa mediana | RP4N-g: o valor da água não pertence à faixa mediana citada |
| lei dita maior que a estimativa (pt) | K17 · recibo · pt · penalizacao-antecipacao-um-ano-neutra: a frase rendida não é a que a conta desta célula dá: «É a estimativa preliminar do grupo de trabalho da redução…» contra «É a estimativa preliminar do grupo de trabalho da redução…» |
| valor da comparação sem token (pt) | K17 · recibo · pt · penalizacao-antecipacao-um-ano-neutra: a comparação não cita as duas linhas pelos seus tokens |
| lei dita maior que a estimativa (en) | K17 · recibo · en · penalizacao-antecipacao-um-ano-neutra: a frase rendida não é a que a conta desta célula dá: «It is the working group’s preliminary estimate of the act…» contra «It is the working group’s preliminary estimate of the act…» |
| valor da comparação sem token (en) | K17 · recibo · en · penalizacao-antecipacao-um-ano-neutra: a comparação não cita as duas linhas pelos seus tokens |
| glosa alterada na sinopse (pt) | RP4N-g: a glosa alterada permanece na comparação da sinopse |
| glosa alterada na sinopse (en) | RP4N-g: a glosa alterada permanece na comparação da sinopse |
| página da pensão trocada | RP4N-g: o localizador da pensão não corresponde à figura e à linha conferidas |
| rótulo da pensão atribuído a outra linha | RP4N-g: o localizador da pensão não corresponde à figura e à linha conferidas |

O caso positivo da ausência e os três ramos da comparação também passaram. As plantas do motor foram relidas do seu registo:


| Planta no motor | Mensagem |
|---|---|
| data escrita no guião em vez do pedido | RP4N-g: a data da pensão não vem do pedido que trouxe o corpo alojado |
| pensão com valor emendado à legenda | RP4N-f: o excerto da pensão não é a legenda contígua da página |
| segunda fonte com bytes diferentes | segunda fonte sem recibo conferido no motor |
| excerto emendado por trechos | RO1: um excerto tem de ser uma sequência contígua, sem trechos |
| água atribuída à APA | RO1: as origens ou os selos diferem da seleção e dos recibos |
| água com outra página | RO1: o excerto difere da leitura literal do documento |
| palavra acrescentada | RO1: o excerto difere da leitura literal do documento |
| resumo de outro documento | RO1: o sha256 da origem difere do documento |
| cliente inventado | RO1: as origens ou os selos diferem da seleção e dos recibos |
| origem apagada | RO1: as origens ou os selos diferem da seleção e dos recibos |
| caminho fora do motor | RO1: o ficheiro da origem não existe dentro do motor |

### Trailers e privacidade

Na cabeça do código, 69 commits desde a base e 69 trailers Claude-Session lidos pelo Git; 0 falhas de presença ou adjacência. A saída literal está em `g/trailers-codigo.log`, obtida com `git log --format=%(trailers:key=Claude-Session) b84d21a3..HEAD`.

| Conferência de privacidade | Saída |
|---|---|
| historico_grep_c | 0 |
| diff_grep_c | 0 |
| cabeca_sem_excecoes_grep_c | 0 |
| legados_ficheiros | 16 |

Padrões: utilizador, casa, temporario, projetos, worktrees. A lista herdada, saída de `privacidade-g.py`, é:

- `design/especime-v3/briefs/BRIEF-auditoria-ux-2026-08-25.md:61`.
- `design/especime-v3/briefs/BRIEF-etapa-2.md:66`.
- `design/especime-v3/briefs/BRIEF-mapa-navegacao-M4.md:7`.
- `design/especime-v3/briefs/BRIEF-maquetas.md:7`.
- `design/especime-v3/briefs/BRIEF-maquetas.md:120`.
- `design/especime-v3/critica/2026-09-04-fable-leitor-no-navegador.md:11`.
- `design/especime-v3/critica/2026-09-08-sonnet-medicao-f11e-distritos.md:20`.
- `design/especime-v3/critica/LEITURA-c1-2026-09-28.md:129`.
- `design/especime-v3/critica/LEITURA-rp1bc-2026-09-26.md:40`.
- `design/especime-v3/medicoes/b1-2026-09-21/prompts/PROMPT-b1-opus-peca2-correcao.md:13`.
- `design/especime-v3/medicoes/b1-2026-09-21/prompts/PROMPT-b1-opus-peca2-correcao.md:34`.
- `design/especime-v3/medicoes/correcoes-ux-M3-sonnet.md:319`.
- `design/especime-v3/medicoes/fontes-308-2026-08-26.md:357`.
- `design/especime-v3/medicoes/p1-2026-09-15/contagens-antes.txt:2`.
- `design/especime-v3/medicoes/parte3-M1-sonnet.md:6`.
- `design/especime-v3/medicoes/parte3-M2-sonnet.md:6`.
- `design/especime-v3/medicoes/rp1-2026-09-26/prompts/PROMPT-rp1c-codex.md:24`.
- `design/observatorio/evora/BRIEF-E1-evora-2027.md:13`.

### Mapa completo da reescrita

| Antiga | Nova |
|---|---|
| 0775309eb34c6bfc918b6ba9aa7ddb859542fae6 | 0775309eb34c6bfc918b6ba9aa7ddb859542fae6 |
| 0279a053db27fa7cbfef2ba447b750747da8b21a | 0279a053db27fa7cbfef2ba447b750747da8b21a |
| 892dfa0ac0604eda61bb92e19bdd296630c6baa8 | 892dfa0ac0604eda61bb92e19bdd296630c6baa8 |
| 5e8d9b1493ba116bc50207f655a13fca5fe0894b | 5e8d9b1493ba116bc50207f655a13fca5fe0894b |
| ba3c557393647c23e9dc0c621016f5d0f0da05fe | ba3c557393647c23e9dc0c621016f5d0f0da05fe |
| ac383ec624631d25285b41ce07a8969b170cf2ac | ac383ec624631d25285b41ce07a8969b170cf2ac |
| 58192aeb5a5a66c9dbae11bbfb2b2d47825a2496 | 58192aeb5a5a66c9dbae11bbfb2b2d47825a2496 |
| 862c26f0f268c242e9507a09555f80adb22e613d | 862c26f0f268c242e9507a09555f80adb22e613d |
| 32578d1ddd7a6a686c9ecdbde36ec6a326f8147b | 32578d1ddd7a6a686c9ecdbde36ec6a326f8147b |
| 91c2871c96abf54d6e996492c8fba422c1c800f1 | 2ffa3e311ae822278c1b2a07262f2346d26d244b |
| 6c9a90465ccbd1d2f9021cafa660f4f8d1e09f2b | 4ea6ce486c7251fe56f81c9fe65f02a1a61d9198 |
| 7399a556ca1bfd4b6322f4d43af88d422471de6c | b98aa6e8857e32d251f10b215c418988c9ae0b94 |
| 2a35e83cbc26a6ba7669f61281ae54f3a193eb03 | 3ec7bf6fb4e271ce45967c7052db8e5d0a659b80 |
| c62d323fd614a0b6b05578807562b896a81915da | 5b03263f1d3e0f68470367130e17c87e2a2a1fb1 |
| 44c6ddc15a9b750dd5bbb9535ff138b2daeecb77 | 11ecc41d9be047a3fddf5d29003342c7326a4463 |
| d57d91bd897edeeaf3ee0781642cf2e239f5a89a | 097e5c3403c712e98dff3dad53794077fd9dfed5 |
| 8381f17adaf62cbac4c1c8c9e93bba4881725dca | 0d71a2c552f4a92ae802a13850a0a21b0f404348 |
| 5a2baef72009bc1b0080100901693b36d0f73277 | 98a90cd74b6ccda5fb5d3ace068e97bbcd4a5dac |
| 3f8eb89bd837eccf230c63759c0ef8b5ebe72328 | 84bf61357f156c54653bc1340ed95fc200d3f837 |
| bcbfcc713edbe5c6d7fb57de9123c1375c7ab098 | e51faedcdfc04217a2ecbe28b9357f73291e2f3a |
| b1962dfabb5167968a1bdb4ace7574c514798e3f | d14e621f46303770690bba1c13d569f4f1213580 |
| 06b988e09a4f76568eb5342fc9f4632c86ab4c1d | 4d36ce02c29722416f5c92cddd4cdf4a4ef2c881 |
| c5278bef74106b59767d88968ba1f53615604a75 | dca49e935109778c8f29aedd9fdfa6c93179cac5 |
| 028f8bfd57c5969368f94a360f96ab98e88fb9f7 | 966cfc3c6b84f9883833d503fec2e0b9c8b0e1f8 |
| c5b08875b164ac3cad264445c8108f4aa8d499e8 | b0d85b09379f6af3c01a85dc4cf1e36ce861a094 |
| 46fc3ec5060b6174a6a56c70bbcc68c692722295 | eeb23e13bd305c07d8d1cc13ab9c124e28e74431 |
| b76e370a946db5122eb3816ee8872056c1e54a32 | 4aaa2ac3742b3ae563704269bb5a1bd869e83e75 |
| 723b1f732a5af6d8b54cc413e3aca38c120ef7de | 6f98ab805480c37cca3f1e28b8d69df166996e5d |
| 621e9cb4be383229d80364a204c9690889769ab3 | b14017fc6659cc74a5ff8f31f5e12a7d8f79fcce |
| ba3df6a4b1870bd19546e83fde418d5f515be78f | dfb3bb65b0907baeeaf59e242f327119c231f903 |
| 2d4565d178acb48e0ce3b1ebe2b4a2a6e94e4d49 | 1288e95d7b3a71a4cc35bfa117efadefe5813668 |
| 155dbf8117e718b8d1b0742f99204c40bb98aab1 | 6b28e6c24b18c155fe1a034477d42a22ed9637e1 |
| de26e52bf675478ee1af329b62abd45293ae8a6f | 219ff1db4d04bc058a97cbff3b11006243dc7837 |
| b588abcf7227cf9e343c93f1c8e34955647766f1 | 411d82adb5aecf1e0439e3208fff9549a505a62d |
| d07806c81c778b3392776bb34d7558493a60ffc5 | 1760f21e9df3f3b3b99b2b5e67f8589b79d83b21 |
| 77b90814ea5c18c05d545e4bbb34278576ee6857 | cedd13a41cc8a0ddcb256641ac4d54b3e12c796e |
| 91fd9d3aa3bf6727f5c327787055bad0989a8677 | 07a9179f3cc5748c6c3cdfb32efcc6f02d2a5ca1 |
| c0aae32740eff8292ca0679537b90e595352d418 | 8a0d914f9b1cc95659c679fa901dbd7a199e99bd |
| 79e98237bc904fed4da1a2b1ed7365641e5844e8 | 5fdf6fc0472aa1fa6f667ef68988e021ebe99ddb |
| a73fc55ace8dab236e92d1a42b1e2ad475cf1081 | 525ddcc528b3cf9989ddd649c42109b9b609aa48 |
| 281b3a77e9b625d7e9308b4b19326a9ee4152e0c | 8b824dc08056e8cd749fb6354ed74e93dc8a86c8 |
| 6f950485dcd4c31f7b035b5216e63a1871ab1cc2 | 008a0a01abac9d20811669256c7e7c0a593f7581 |
| a10b0ee3d3f9d30c9ab8b31edeb4901efb3d2199 | f06d8763e252d9149674eff7fd3e3b215b1014f6 |
| 5ddb51449330c2dda319b7e28a05c1913fefd9fd | db4b55d85cf1214c04e9c5c32c15f0edba075420 |
| 7d8994e835ee70b4673fc76fa2385713365917dc | 478c83688116401055a7ba26b9aa3318d59f1d37 |

### Commits desta passagem

| sitio | Mensagem |
|---|---|
| 071b9dfdade099b5b6b522da8dd376ecc80084b5 | docs(rp4n-g): registar a leitura, as plantas e o mandato |
| 9d907997bbd35f0392da8533766351614e04fda9 | fix(rp4n-g): preferir o rótulo da medida ao título do documento |
| a58623ac55fa35a645ec073b50d9278117b704a5 | fix(rp4n-g): render o selo na língua de cada edição |
| c5e5738785d468a640e4567e8f55b94c08ce4f4f | test(rp4n-g): provar a ausência válida e os caminhos das duas edições |
| 992ecd5acd24277eb32e7084bd04ca96eaaa74a9 | fix(rp4n-g): dizer contratado na unidade da execução PRR |
| 2bea05413c13608e90ee8980e4ad9c7274a33811 | fix(rp4n-g): separar a coordenada do documento e traduzir página |
| be7f53f398c0acf43c0632db84b6be27d8f45783 | fix(rp4n-g): alinhar o prazo PRR com a conclusão da computação |
| a925f0e14cf861f75f1696a270e9d177a7f7037b | test(rp4n-g): conferir todos os padrões de privacidade na cabeça |
| 0fbabb73df50ef1da36d7ca0fd1c6a645022e05a | fix(rp4n-g): conservar o estudo na área e declarar as contagens ausentes |
| a33711176a3eb9781c258ba09a075672e2800955 | fix(rp4n-g): situar a água na faixa mediana selada pela ERSAR |
| 78050c6439436bb02471aee8ac8925bed912e6a4 | fix(rp4n-g): apoiar a quota dos ministérios na DESPESA TOTAL do mapa |
| 8158c866e2e4922b18eb06d91446d10f3baeaaad | fix(rp4n-g): comparar por tokens a penalização legal e a estimativa neutra |
| ea709d649952f101f262be4006218d0d0e1a2222 | fix(rp4n-g): declarar os tipos da comparação e da coordenada |
| 6d4c59965a526e0db8f2b15245fb7e0bc828d151 | fix(rp4n-g): retirar a data da pensão sem pedido bem-sucedido |
| 67d22d625e30d1fcc9371c554ae6fb78495ee88f | fix(rp4n-g): conservar o rótulo matemático da pensão numa linha |
| f591e2cfdc3a2cac857ea46b63dd474ab5816943 | fix(rp4n-g): reconhecer os rótulos dos YAML atravessados por inteiro |
| ce1cf8d1816fce004255009cb17f3d288ebc8701 | test(rp4n-g): provar os tokens da comparação e as duas edições |
| be0d0b54d3e17f71cf41d04b4e8141bd39ac24cb | fix(rp4n-g): conferir a ausência do estudo e a glosa nas sinopses |
| 1b08a019d0400b7289ffc1639e536c0a69b558b7 | test(rp4n-g): preparar a medição das frases e as capturas finais |
| 793d2d7eba2ae075b89cdef47a29c409cced1244 | fix(rp4n-g): declarar a língua do rótulo impresso da pensão |
| e0e45accac3b19d96a0600ea2a287fbcc8d9b66d | test(rp4n-g): declarar os rótulos medidos do prazo de conclusão |
| e1c0959a0dd324120df160e3f19a68a7df2c767f | fix(rp4n-g): apoiar a explicação nas classificações das fontes |
| 6ab47eddb628edfcb2811f3631208aabc51d1dd8 | test(rp4n-g): conferir o localizador da figura da pensão no índice |
| 344081c34eef1f792feef6bfd2d77fd764f7a1b5 | test(rp4n-g): esperar pelas imagens antes das capturas integrais |


| motor | Mensagem |
|---|---|
| a5c4eadf7deb83d85e7369e49168e499c1d73118 | fix(rp4n-g): conferir o nome da pensão na figura alojada |
| 71a2be5f18d867a0e4010af467a0d892aa3780f5 | fix(rp4n-g): alinhar a unidade da quota PRR com o contratado |
| b0276ebe8c9e9d5fa5aa2934acb35c922061329a | fix(rp4n-g): selar a faixa mediana da água no Quadro 47 |
| 3e96a5e248d1d20129905f0b2fe31ad124566acd | fix(rp4n-g): prender a quota orgânica à DESPESA TOTAL do MAPA 4 |
| 9d56c0f1785c2e3719d741608895e5cfd015ffd4 | fix(rp4n-g): exigir o pedido para datar a cópia das pensões |
| 542fe4ee9d67ecf2245892fd98ccd1c442829704 | fix(rp4n-g): registar os resumos da releitura do MAPA 4 |

O commit final de provas, que contém esta tabela, é identificado na resposta de entrega.

### Custo

A linha «tokens used» não estava disponível no registo visível da execução ao preparar este relatório. O custo e o cumprimento do alvo não ficam demonstrados; não foi inventada uma contagem.
