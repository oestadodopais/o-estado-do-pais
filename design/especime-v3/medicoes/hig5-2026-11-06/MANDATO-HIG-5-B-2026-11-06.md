# Mandato HIG-5 B: o estado da fonte sem resposta numa frase que se lê bem (06.11.2026)

Acrescenta: frases

Página: linha

*Escrito pelo lugar de direção (Claude Opus 5.5). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, no sítio, na worktree `lote7-2026-11-06`, por cima da HIG-5 A. É a segunda passagem da HIG-5: o Minor 66, da leitura a frio do lote 6 (13), que diz que um editor de um diário português não imprimia a frase da REL1 como está.*

## §0 Medido (06.11.2026, por este lugar, no `dist/` de b50d32c02)

- A REL1 rende no recibo, nos quatro recibos cuja fonte não respondeu, pt «Sem resposta a 01.09.2026 · à conferência automática» e en «No answer on 01.09.2026 · to the automated check», cada um em dois lugares por página (o bloco do selo e «O que foi conferido»), oito vezes por edição. A leitura a frio: em português, «resposta a» toma o seu complemento, e o leitor lê primeiro «sem resposta a 01.09.2026» e depois encontra um segundo «à» com outro papel; em inglês, «answer … to» parte-se à volta da data.
- A variante da máquina (`aEstaMaquinaK`, pt «a esta máquina», en «to this machine») não se rende em página nenhuma hoje, e tem a mesma forma.
- As cópias que nomeiam as duas frases: `src/i18n/strings.mjs:2556`, `:2557`, `:4290`, `:4291`, e `tests/linha/sem-resposta.mjs:81`, `:82`, `:88`, `:89`.

## §1 As frases (palavra por palavra; a cópia da `check:fontes` muda com a produção, no mesmo commit)

- `aoCorredorK`: pt «na conferência automática», en «in the automated check».
- `aEstaMaquinaK`: pt «nesta máquina», en «on this machine».
- `semRespostaK` e `respondeuComErroK` não mudam.

Rendido: pt «Sem resposta a 01.09.2026 · na conferência automática», en «No answer on 01.09.2026 · in the automated check»; com a máquina, pt «Sem resposta a dd.mm.aaaa · nesta máquina: X», en «No answer on dd.mm.aaaa · on this machine: X».

## §2 Quando paras

Se a frase se render fora do `LinhaView.astro` (diz onde), ou se uma régua só passar mais fraca.

## §3 O fim

O `build` inteiro, `check:fontes`, `check:cartao` e `gate:html`, com os códigos; as duas frases copiadas do `dist/` de `livro-razao/penalizacao-antecipacao-um-ano-neutra/` e de `en/ledger/penalizacao-antecipacao-um-ano-neutra/`, e a contagem, por um comando só para cada uma, das ocorrências de cada frase nova e de cada antiga em cada edição. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `HIG-5 B`. Vinte minutos, trinta chamadas.
