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
