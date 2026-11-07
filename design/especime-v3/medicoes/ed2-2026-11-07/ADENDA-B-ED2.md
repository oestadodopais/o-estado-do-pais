# Adenda B ao mandato ED2: os estudos de uma só edição atualizada, e as provas que faltam (07.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura a frio do lote 8 pelo Claude Opus 5.5 (cinco plantas em cinco). A mesma sessão e a mesma worktree da adenda A, `lote8-ed2-2026-11-07`, sobre 157602858 e o commit desta adenda.*

## §0 Medido (07.11.2026, por este lugar, por guião)

- `python3 design/especime-v3/medicoes/ed2-2026-11-07/medir-cabecalhos.py ../lote7-2026-11-06/dist dist`, entre o `dist/` de 2cc0806c2 (o que está no ar, na worktree irmã `lote7-2026-11-06`, só para ler) e o da ED2 (fbbd67ca2): das 38 páginas de estudo, 8 perdem a data de atualização sem ganhar a linha das edições, nos quatro estudos de uma só edição guardada cuja data é posterior à da publicação (`evora-orcamentado-pago-devido-2025`, `evora-prometido-pago-auditado-2026`, `evora-quinze-anos-cinco-mandatos`, `penalizacoes-por-reforma-antecipada-2026`, nas duas línguas). Em `main` dizem «Edição atual · publicado a 12.08.2026 · atualizado a 20.08.2026»; com a ED2 dizem «Edição tal como foi publicada · publicado a 12.08.2026». A porta passa a dizer uma coisa falsa: a edição guardada é a de 20.08.2026, e não a publicada. O registo e o código estão ao lado do guião.
- A leitura a frio (o achado 5): a planta da data de uma correção dita como atualização troca também o atributo, e por isso nenhuma planta prova que a régua confere a palavra antes da data sozinha. E (o achado 12): a tabela das provas da atualização saiu de `check-datas.mjs` sem outra que prove a recusa de uma data de atualização a mais numa página de uma só edição.
- A leitura a frio (o achado 11): a lista da voz da linha das edições só admite as duas formas de hoje, e a VOZ-2 vai dar a Évora 2027 uma quarta edição; as chaves novas de `rotulos-b1.mjs` não são usadas, e o renderizador escreve as mesmas palavras à mão.

## §1 O que fazes

1. **Os estudos de uma só edição.** Um estudo com uma só edição guardada cuja data é posterior à da publicação mostra exatamente o cabeçalho que tem em `main`: a porta «Edição atual» / «Current edition», «publicado a» com a data da publicação e «atualizado a» / «updated on» com a data da edição, com `data-estudo-atualizacao`. As réguas da ED2 esperam o mesmo, lido do manifesto e da publicação declarada, sem o renderizador. Nada mais muda nessas páginas. No fim, o guião do §0 sobre esse `dist/` e o teu tem de dar 0.
2. **As provas, cada uma vermelha sozinha:** num destes quatro estudos, a data de atualização tirada; num deles, a porta a dizer «Edição tal como foi publicada»; num estudo de uma só edição sem atualização (`onde-esta-a-agua`), uma data «atualizado a» a mais, com o atributo; em Évora 2027, «atualizado a» antes da data de 06.11.2026 com o atributo `data-estudo-correcao` intacto (só a palavra errada).
3. **As palavras da linha.** O renderizador tira as palavras da linha das chaves que a ED2 acrescentou a `rotulos-b1.mjs`, sem as escrever à mão; a lista da voz da linha admite qualquer linha feita dessas palavras na ordem do manifesto (a primeira, depois atualizações e correções, «atual» na última), e não só as duas formas de hoje. As provas: uma linha de quatro edições, como a VOZ-2 a fará, passa a voz; uma linha com outra palavra dá vermelho.
4. Constróis o `dist/` e corres `check:edicoes`, `check:datas`, `check:voz`, `check:lugar`, `check:mortos`, `typecheck` e as plantas, cada um com o seu código; no relatório, o cabeçalho dos quatro estudos nas duas línguas copiado do `dist/`, e o código do guião do §0.

## §2 Quando paras

Se manter o cabeçalho de `main` nesses estudos obrigar a enfraquecer uma régua (diz qual).

## §3 O fim

Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `ED2 B`. Quarenta e cinco minutos, setenta chamadas.
