# Adenda D ao mandato VOZ-1: os três achados reais da leitura curta do lote 4 (05.11.2026)

Acrescenta: frases

*Uma passagem na worktree `lote4-2026-11-04`, no ramo `lote4b-2026-11-04`, sobre 25821b087. A leitura curta do Claude Opus 5.5 sobre as adendas C e D da PAI2, B e C da VOZ-1 e a VOZ-1-D deu três achados reais que o leitor vê. A PAI2 não muda nesta passagem.*

## §0 Medido por este lugar (no `dist/` de 25821b087 e nos ficheiros da cabeça, por guião)

- O registo das correções imprime duas notas sobre a maquinaria do projeto, nas duas edições, ambas da linha `estudos-evora-publicados` (`ledger/claims/estudos-evora-publicados.yml`): a de 2026-08-15 ('É o primeiro que não veio de um anfitrião de artefactos: foi produzido no motor de investigação deste projeto e atravessou como ficheiro, com as duas edições.') e a de 2026-09-16 ('Veio do motor de investigação deste projeto, com as duas edições, e põe lado a lado…'). A primeira está na lista fechada da voz (`scripts/voz-excecoes.json`) com a razão 'facto de uma fonte', que é falsa: nenhuma fonte o diz. Lidos os 404 motivos de todas as linhas: só estas duas descrevem a maquinaria; as 72 que dizem 'este projeto releu a fonte' dizem quem releu e quando, e ficam.
- O calendário lista em «Atualiza:» páginas de estudos que são edições datadas, sucedidas por outras (`sucedidoPor` em `src/data/studies.mjs`), e que nenhuma publicação da fonte atualiza: em português `/estudos/evora-economia-investidores-portas-abertas-2026`, `/estudos/evora-orcamentado-pago-devido-2025` e `/estudos/evora-quinze-anos-cinco-mandatos`; em inglês `/en/studies/evora-orcamentado-pago-devido-2025`. Nenhuma está no índice dos Estudos.
- No registo das correções, as revisões de proveniência imprimem 37 títulos em cada edição, dos quais só 25 distintos: 23 linhas repetem o texto de outra (por exemplo «Dívida das famílias» três vezes: 2024, 2025 e a da União Europeia). Os identificadores são distintos; o que as distinguia era o ano e a União, que o título do recibo não tem.

## §1 O que fazes

1. **As duas notas do registo.** Os motivos ficam assim (os títulos entre aspas como estão hoje):
   - 2026-08-15, pt «Entrou no arquivo «Évora — Prometido, Pago, Auditado 2026», o quinto trabalho cujo objeto é o município de Évora.»; en ««Évora — Promised, Paid, Audited 2026» entered the archive, the fifth work whose subject is the municipality of Évora.»
   - 2026-09-16, pt «Entrou no arquivo «Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em linhas», o sexto trabalho cujo objeto é o município de Évora. Põe lado a lado o que a candidatura a Capital Europeia da Cultura prometeu, o que o painel de peritos escreveu sobre isso, e o dinheiro escrito em atos públicos.»; en ««Évora 2027: what was promised, what the panel wrote, and the money line by line» entered the archive, the sixth work whose subject is the municipality of Évora. It puts side by side what the European Capital of Culture bid promised, what the expert panel wrote about it, and the money written into public acts.»
   - Sai da lista fechada da voz a entrada que deixa de se render, nas duas edições. Nenhum valor, data ou tipo de correção muda.
2. **O calendário sem edições datadas.** Uma página de um estudo cuja obra tem `sucedidoPor` não se lista em «Atualiza:» / «Updates:», nas duas edições; a régua do calendário recusa uma edição datada na lista, com planta.
3. **Cada linha do registo distinta.** Cada revisão de proveniência nomeia a sua linha como o aviso da revisão a nomeia: o nome da medida, «na União Europeia» / «in the European Union» quando a linha é a comparação da União de um cartão (`contextoDaRevisao`), e o período (`reference_date`), na forma «⟦nome⟧ na União Europeia, ⟦período⟧» / «⟦name⟧ in the European Union, ⟦period⟧», com a porta para o recibo como hoje. Medes por guião, depois, as linhas repetidas em cada lista do registo, nas duas edições: têm de ser zero. Uma régua no `build` recusa duas linhas iguais na mesma lista, com planta.

## §2 Quando paras

Se uma régua que protege o registo recusar a mudança dos dois motivos (diz qual e porquê, sem a enfraquecer); se depois do §1.3 ficarem linhas repetidas (diz quais).

## §3 O fim

O `build` inteiro verde; as conferências que a mudança toca (`check:registo`, `ledger:check`, `check:voz`, `tests/voz/agenda-voz1.mjs`, `gate:html`), com os códigos e as plantas; as linhas repetidas antes e depois, medidas; as duas notas e a lista 'Atualiza:' de um acontecimento copiados do `dist/` nas duas edições, no relatório. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `VOZ-1 E`. Quarenta minutos, cinquenta chamadas.
