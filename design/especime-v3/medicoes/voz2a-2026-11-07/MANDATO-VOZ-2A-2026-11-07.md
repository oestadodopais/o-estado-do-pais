# Mandato VOZ-2A: os documentos de sete estudos de Évora deixam de falar de si próprios (escrito a 06.11.2026; lança depois das 00:00 UTC de 07.11.2026)

Acrescenta: frases

Medidas: medidas-voz2a.json

*Escrito pelo lugar de direção (Claude Opus 5.5, pela palavra do financiador de 02.11.2026). O construtor é o Codex `gpt-6-astra` (`high`), sem rede: o sítio na worktree `lote8-2026-11-07`, em `main` aterrado; o motor na worktree `voz2-2026-11-07`, no `master` aterrado. É a primeira metade da VOZ-2 (a fila, 1): a mesma classe que a VOZ-1 tirou das outras páginas do leitor, agora nos documentos e nas páginas de sete estudos, no texto do motor de onde saem. A segunda metade (VOZ-2B) faz os outros onze estudos e tira a isenção; esta estreita-a. Lança depois das 00:00 UTC para que cada edição nova tenha a data do dia em que fica no ar.*

## §0 Medido (06.11.2026, por este lugar, por guião, no `dist/` de b50d32c02 e nos ficheiros do motor de 983b19e)

- A expressão da classe da VOZ-1 (`CLASSE` de `scripts/voz-autorreferencia.mjs`), corrida frase a frase sobre as edições atuais dos documentos dos estudos e sobre a leitura e o sumário das páginas dos estudos, encontra 386 ocorrências de 306 frases distintas em 18 estudos, nas duas línguas; as edições datadas, que são arquivo, ficam fora e ficam como estão.
- Destas, as dos sete estudos deste bloco são 214 ocorrências de 158 frases distintas. Cada uma foi classificada (uma passagem do Claude Sonnet 5.5, revista por este lugar: as frases novas, as `FICA` e as `SAI` portuguesas uma a uma; seis decisões deste lugar por cima) numa de três classes, as da VOZ-1: `SAI` (o estudo a falar de si, do seu método, do que não faz; sai sem perda de um facto), 38; `REESCREVE` (um facto de uma fonte dito como coisa do projeto; passa a dizê-lo da fonte, sem acrescentar nada), 83; `FICA` (não fala do projeto: uma citação, um rótulo `(inferência)` de uma causa, `aqui` como lugar), 37. A lista inteira, com a página, a língua, a classe, a razão e a frase nova de cada uma, está em `design/especime-v3/medicoes/voz2a-2026-11-07/FRASES-VOZ-2A.json`.
- As frases saem do texto de cada estudo no motor (os `.md`, os `.record.json` e, onde o estudo os tem, os modelos e os guiões de `Technical Source/`), e não de um modelo comum: nenhum ficheiro fora de `content/` as escreve.
- O nome interno do motor imprime-se nas edições atuais de quatro destes estudos (`evora-prometido-pago-auditado-2026`, `evora-orcamentado-pago-devido-2025`, e nos dois da água, que são da VOZ-2B): como rótulo no cabeçalho do documento («Research Hub») e, no primeiro, numa frase sobre a «regra de entregáveis do Research Hub».

## §1 O que fazes, nos sete estudos (`evora-2027-capital-europeia-da-cultura`, `evora-2027-prometido-painel-dinheiro`, `evora-prometido-pago-auditado-2026`, `evora-orcamentado-pago-devido-2025`, `evora-contas-da-camara-2010-2025`, `evora-economia-e-dinheiro-publico-de-fora-da-camara`, `evora-economia-investidores-portas-abertas-2026`)

1. **As frases.** No motor, na fonte de cada frase: as `SAI` saem; as `REESCREVE` passam a ser, palavra por palavra, o campo `nova`; as `FICA` ficam. Uma frase que se repete em várias páginas muda em todas. Onde uma frase tem um token ou um selo de fonte (o texto da lista junta o algarismo e o rótulo do selo, «96%fonte · Município de Évora»), o token e o selo ficam e muda só a prosa à volta. Quando uma frase `SAI` é o título de uma secção: se todas as frases da secção forem `SAI`, a secção sai inteira; se ficar alguma, o título passa a ser pt «O que fica por saber», en «What remains unknown», e o relatório diz quais. Onde tirar uma frase deixar um parágrafo sem sentido, dizes qual e paras nessa frase: não escreves uma frase nova.
2. **O nome do motor.** O rótulo «Research Hub» sai do cabeçalho dos documentos destes estudos, e a frase sobre a «regra de entregáveis do Research Hub» sai, nas duas línguas.
3. **As edições e as entradas** (o processo da ED1, como na EV3-p): em cada um dos sete estudos, a edição atual fica guardada tal como foi publicada; a edição atual passa a ser a de 07.11.2026; e o registo ganha uma entrada de natureza «Estudo corrigido» por estudo, que diz:
   - pt «Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.»
   - en «The sentences in which the study talked about itself came out; no number and no conclusion changed.»

   A contagem das correções publicadas sobe sete, pela função partilhada; o `reason` da recontagem diz só o que entra na contagem, sem a frase «A recontagem não é uma correção adicional.» (as cinco entradas antigas que a têm ficam como estão: o registo é permanente).
4. **A régua.** A isenção `ISENCAO_VOZ2` de `scripts/voz-autorreferencia.mjs` deixa de cobrir as edições atuais destes sete estudos: a régua da voz passa a medi-las, e as frases `FICA` entram na lista declarada das exceções (`scripts/voz-excecoes.json`), uma a uma, com a razão da lista, nunca por uma expressão mais larga. As edições datadas continuam isentas, por serem arquivo. Uma régua nova recusa «Research Hub» e «ResearchHub» em qualquer página do leitor, fora das edições datadas. As plantas: uma frase `SAI` reposta num documento destes estudos, vermelho; o rótulo «Research Hub» reposto, vermelho; uma frase `FICA` fora da lista das exceções, vermelho.
5. **As contagens da prova.** A prova da voz e as contagens das páginas mudam por estas frases; o relatório diz cada contagem que muda, de quanto para quanto, e porquê. Nenhum número de um estudo muda: se a prova dos tokens ou o livro-razão mudarem, paras.

## §2 O que não muda

As edições datadas; os onze estudos da VOZ-2B (a isenção continua a cobri-los); os números, os tokens, os selos e as citações; as frases `FICA`.

## §3 Quando paras

Se uma frase da lista não estiver na fonte do motor nem na página, ou estiver numa forma diferente (diz qual); se tirar uma frase deixar um parágrafo sem sentido (diz qual); se a composição recusar um token; se uma régua só passar mais fraca; se um número de um estudo mudar.

## §4 O fim

Os commits do motor pelo `comitar.sh` (com `OEDP_GATE=adiado`), a travessia dos registos (`publisher/export_records_site.py --write`), o `origin_ref` das edições correntes a apontar ao commit do motor que contém os bytes; o `build` inteiro verde; `check:edicoes`, `check:voz`, `check:registo` e as conferências que a mudança toca, com os códigos; as plantas, com os códigos; e, no relatório, por um comando só para cada uma, a contagem das frases da classe nas edições atuais destes sete estudos antes e depois (zero depois, fora das `FICA`), e três frases `REESCREVE` copiadas do `dist/` em cada língua. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `VOZ-2A`. Setenta e cinco minutos, cento e vinte chamadas; se parares no teto, o relatório diz em que estudo e em que frase, e a retoma continua daí.
