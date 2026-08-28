# BRIEF · As áreas de governo: uma página por área, só onde há conteúdo

*Escrito a 28.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus). Corre depois da passagem `pequenas-3`, num ramo `areas-2026-08-28` saído de `main`. É a decisão 6 da auditoria de 25.08 (`AUDITORIA-UX-2026-08-25.md`, §3.6 e §4), forma A, mandada pelo diretor a 27.08 e 28.08 («go, follow your recommendation on all of them»; «we can do them all»); a lista das áreas é a que o conteúdo já sustenta, e o diretor acrescenta ou tira. Sem travessões na prosa.*

## 0 · O que é

Uma página por área de governo, com o nome da área tal como o Governo o publica, só para as áreas que já têm conteúdo no sítio: os trabalhos, as leituras, as linhas do livro-razão e as medidas dos concelhos cujas fontes pertencem a essa área. Nada de páginas vazias, nada de frases sobre cobertura, nenhuma taxonomia inteira (forma B, recusada). A página de uma área é navegação e conteúdo: o nome, o que existe, com selo, e as portas.

## 1 · O que está verificado

* **Os dezasseis ministérios do XXV Governo Constitucional**, lidos a 28.08.2026 em `https://www.portugal.gov.pt/pt/gc25/governo/composicao` (renderizado no navegador; a lista está em `design/especime-v3/briefs/ministerios-xxv-2026-08-28.md`, copiada do lugar de direção). Em funções desde 2025-06-05. Os nomes das áreas são estes, sem abreviar nem traduzir por conta própria; a edição inglesa usa a tradução que o Governo publica na página inglesa do mesmo endereço (`/en/gc25/...`), se existir, e senão a tradução literal, dita como tal na linha do inventário.
* **A tutela da DGAL** (que decide a área das autarquias) não está verificada: o lugar de direção não a encontrou numa fonte primária. Verifica-a na lei orgânica do XXV Governo (o decreto-lei publicado no Diário da República em 2025; procura «Direção-Geral das Autarquias Locais» no texto) antes de pôr Évora e os concelhos numa área; se a lei não a nomear, as autarquias ficam numa área própria «Autarquias locais», dita como divisão do sítio e não do Governo, e o relatório di-lo.

## 2 · O conteúdo, e a área de cada peça

O mapa é um ficheiro de dados, `src/data/areas.mjs`, com uma entrada por área (o nome do Governo nas duas edições, o `slug`, a fonte do nome com a data) e, por área, as peças que lá cabem, cada uma com a razão (a fonte da peça e o organismo que a publica). Ponto de partida do lugar de direção, a confirmar por ti contra as fontes de cada linha:

| área (nome do Governo) | o que já existe |
|---|---|
| Ministro de Estado e das Finanças | `which-door-is-yours` (financiamento público), as linhas do PRR de Évora, os indicadores de dívida pública e de contas do painel da primeira página, `quadro-institucional` onde a fonte é o Ministério das Finanças ou a UTAO |
| Ministro da Economia e da Coesão Territorial | `avaliacao-economica-regional-de-portugal-2026`, `alentejo-algarve`, as páginas das regiões e a régua de convergência |
| Ministra do Ambiente e Energia | `onde-esta-a-agua`, `agua-nao-faturada` (a ERSAR é tutelada por esta área: verifica) |
| Ministra do Trabalho, Solidariedade e Segurança Social | `penalizacoes-por-reforma-antecipada-2026`, o desemprego registado dos 308 concelhos (IEFP, DRQPE e IEM: as duas direções regionais são dos governos regionais, e a linha da área di-lo) |
| Ministro das Infraestruturas e Habitação | as linhas do painel da habitação, se existirem no livro-razão; senão, a área não tem página ainda |
| Autarquias locais (ou a área da tutela da DGAL, verificada) | os cinco trabalhos de Évora, `concelhos-2026`, os 308 concelhos, a dívida e o PMP (DGAL) |

O que não cabe em nenhuma (`evolucao-de-portugal-desde-1981`, o INE em geral) fica fora: uma área não é uma gaveta para tudo.

## 3 · O que constróis

1. `src/data/areas.mjs` e as rotas `/areas` (índice: a lista das áreas com conteúdo, o número de peças de cada, sem frase de cobertura) e `/areas/<slug>` (`/en/areas/<slug>`), na disposição das páginas de região: o nome, as peças agrupadas por tipo (trabalhos, leituras, medidas), cada medida com o valor e o selo tal como aparece na sua página de origem, as portas para os trabalhos e para os concelhos.
2. A navegação: «Áreas» no comando da primeira página ao lado de «Região» e «Concelho», e no rodapé onde as regiões estão. Nada muda nas páginas existentes além das portas.
3. `scripts/check-areas.mjs` na cadeia: cada peça do mapa existe e tem a sua página; cada área tem pelo menos uma peça; nenhuma peça em duas áreas sem razão escrita; o nome de cada área igual ao da lista verificada; nenhuma frase de cobertura (a régua da voz já o mede; o inventário classifica as frases novas, bloco `areas`).
4. `tests/inicio/areas.mjs`: as células com casos plantados (uma área sem peças, uma peça fantasma, um nome trocado, uma frase de cobertura).
5. O relatório `design/especime-v3/medicoes/areas-construtor.md`: o mapa com as razões, a verificação da tutela da DGAL com a citação da lei, o que ficou de fora e porquê, o custo em símbolos.

## 4 · O que é «feito»

* As páginas existem nas duas edições, com os nomes verificados, e cada peça leva ao seu selo; `npm run build`, `verify`, `typecheck` verdes; `check:voz` verde com o inventário atualizado; uma linha `| areas | n | por ler | … |` em `critica/REVISOES-DO-INVENTARIO.md`.
* Commits com caminhos explícitos e os dois trailers; `DECISIONS.md` é do lugar de direção (a Emenda 22 escreve-se lá com a lista final, depois de o diretor a ver).
