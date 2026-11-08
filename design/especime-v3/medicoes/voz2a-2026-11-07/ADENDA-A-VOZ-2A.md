# Adenda A aos mandatos VOZ-2A e VOZ-2B: as frases novas que a régua recusava, e o alcance da régua do nome do motor (07.11.2026)

Acrescenta: frases
Medidas: medidas-adenda-a-voz2.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois das duas paragens de 07.11.2026, entre as 00:00 e as 00:11 UTC. As duas paragens estavam certas: os dois impedimentos são erros deste lugar nos mandatos, e não do construtor. Retomas a mesma sessão e a mesma worktree, sobre a cabeça que lá está: as tuas provas da paragem e, por cima, a ED2 (6b0062385) e o commit desta adenda.*

## §0 Medido (07.11.2026, por este lugar, por guião)

- Os vinte e um campos `nova` que as duas passagens recusaram (VOZ-2A: V043, V053, V057, V064, V164, V176, V182, V194, V195, V196; VOZ-2B: V006, V088, V118, V128, V132, V207, V225, V267, V276, V277, V284) foram reescritos por este lugar e estão nas duas listas, no commit desta adenda; os textos estão também em `design/especime-v3/medicoes/voz2-adenda-a-2026-11-07/novas-adenda-a.json`.
- Corridos pela régua da página como ela mede uma página, frase a frase (`frasesDoTexto` e `medirPagina` de `scripts/voz-autorreferencia.mjs`), os 159 campos `nova` das duas listas dão zero recusas, e três plantas com as formas antigas dão vermelho: `node design/especime-v3/medicoes/voz2-adenda-a-2026-11-07/conferir-novas.mjs`, código 0 (o registo e o código ao lado).
- A causa das recusas: a régua dispara quando uma negação de um facto e o rótulo «(inferência)» estão na mesma frase, e o «no» português (a contração) conta como o «no» inglês. As frases novas põem o rótulo numa frase sua ou dizem o facto sem a negação. A régua fica como está.
- O nome do motor, no texto que o leitor vê (sem `script` nem `style`) das edições atuais, tem três formas: o sobrescrito «Research Hub · Portugal · Água» nos dois estudos da água, nas duas línguas; as duas palavras e o ponto com que abre o primeiro parágrafo em itálico, «Research Hub. », em `evora-prometido-pago-auditado-2026` e `evora-orcamentado-pago-devido-2025` (as duas línguas), `evora-os-pelouros-quem-os-teve-o-que-fizeram` e `evora-quinze-anos-cinco-mandatos` (o português); e as frases do §1.2 de cada mandato. Num comentário do `style` está também «Research Hub house style», que o leitor não vê.

## §1 O que fazes

1. **As frases.** Os vinte e um campos `nova` são os das listas no commit desta adenda; aplicam-se palavra por palavra, como o §1.1 de cada mandato diz. Na tua conferência do texto prescrito, um campo `nova` mede-se como a régua mede a página, frase a frase (`frasesDoTexto` vazio e `medirPagina` sem frases), e não com `CLASSE.test` sobre o campo inteiro: um campo com duas frases pode ter a negação numa e o rótulo na outra. O zero fora das `FICA` continua a ser o fim de cada metade.
2. **O alcance da régua do nome (o §1.4 da VOZ-2A).** Na VOZ-2A, a régua recusa «Research Hub» e «ResearchHub» no texto que o leitor vê de todas as páginas do leitor, exceto as edições datadas e as edições atuais que a `ISENCAO_VOZ2` ainda cobre (os onze estudos da VOZ-2B). Na VOZ-2B, quando a isenção sai das edições atuais, a régua passa a cobrir todas as edições atuais; onde o §1.4 da VOZ-2B diz «os seis estudos», lê-se «todas as edições atuais». O comentário do `style` fica.
3. **A forma da retirada (o §1.2 de cada mandato).** No sobrescrito, sai «Research Hub · » e o resto fica («Portugal · Água»). No primeiro parágrafo em itálico, saem as duas palavras, o ponto e o espaço, e o parágrafo começa na palavra seguinte, tal como está. As frases do §1.2 de cada mandato, como lá se diz.
4. **A ordem.** A VOZ-2A retoma agora e acaba como o §4 do seu mandato diz; a VOZ-2B retoma quando a VOZ-2A sair a 0, sobre a cabeça que a VOZ-2A deixar. O `check:edicoes` da ED2 corre nas duas, porque as edições de 07.11.2026 entram depois dela.

## §2 Quando paras

Como o §3 de cada mandato; e se uma frase nova não couber no seu parágrafo (diz qual, e não escreves outra).

## §3 O fim

O §4 de cada mandato, com o assunto a começar por `VOZ-2A` ou `VOZ-2B`, e no relatório a linha de cada uma das vinte e uma frases tal como sai do `dist/`. Setenta e cinco minutos e cento e vinte chamadas por metade.
