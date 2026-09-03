# Brief F1.2b · Os cartões, o menu e os estudos à vista (03.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5 (ou Sonnet 5 enquanto a falha do fornecedor durar), a partir do item 9 do `BRIEF-F1.2-pagina-do-dominio.md`, do que a segunda passagem do F1.2 deixou para depois do F1.1 (a entrada «Domínios» no menu) e da segunda metade da linha F1.9 do plano (os estudos alcançáveis da primeira página sem menu). Corre depois de o F1.1 se fundir em `main`. Sem travessões na prosa.*

## 0 · O que este bloco é

Três portas pequenas na primeira página, que só se podiam abrir depois de a primeira página ficar na forma do F1.1: os cartões da faixa a apontarem à página do domínio quando a medida é dele; a entrada «Domínios» no menu; os estudos alcançáveis de `/` em um toque e a menos de ecrã e meio a 390 × 664.

## 1 · O que entra

1. **Os cartões da faixa.** Os 13 cartões do Procedimento e os 8 do Painel Social apontam à página do domínio (`/dominios/economia-e-financas-publicas` e o par inglês) quando a medida pertence a esse domínio (as medidas E1 a E5 e T1 a T5 da `CARTA-DOS-CONTEUDOS.md`, tal como `src/data/dominios.mjs` as lista), e à leitura breve da linha, como hoje, quando não pertence a nenhum domínio no ar; o destino vive no sítio único que o F1.1 deixou para isso (uma função ou uma tabela). Um cartão que aponte a um domínio diz-o no seu rótulo de destino («Ver o domínio →» ou a palavra que o inventário da voz já tiver), sem frase nova sobre a casa.
2. **«Domínios» no menu**, nas duas edições, ao lado de Regiões, Distritos e Áreas (F1.1), a levar a `/dominios` e `/en/domains`.
3. **O selo fora da manchete do domínio.** A manchete de `/dominios/economia-e-financas-publicas` lê-se num leitor de ecrã com o texto do selo dentro da frase («89,7%fonte · Quadro institucional …», visto no HTML servido a 03.09); a manchete do domínio passa à forma que o F1.1 deu à manchete do país e à dos concelhos (o selo ao pé do número, fora da frase), nas duas edições, e a régua do F1.1 que o mede cobre também a página do domínio.
4. **Os estudos à vista.** Um cartão ou uma fila depois da faixa, com os estudos (`/estudos`), acima da dobra do telemóvel ou logo a seguir a ela: `/estudos` a ≤ 1 toque e ≤ 1,5 ecrãs de `/` a 390 × 664, medido.

## 2 · O que não entra

Nenhum número novo; nenhuma frase nova que não esteja no inventário da voz com origem; nenhuma mudança à cabeça, à faixa ou ao mapa além do destino dos cartões e da fila dos estudos; nada nos documentos alojados nem nas páginas de leitura.

## 3 · Onde se constrói

Ramo `portas-2026-09-03` numa worktree própria a partir de `origin/main` depois da fusão do F1.1 (confirma o SHA). Ficheiros: `src/views/HomeView.astro` e os componentes da primeira página que o F1.1 deixou (`src/components/inicio/*`, `src/components/Masthead.astro`), `src/i18n/strings.mjs` (chaves novas só), `src/data/figuras.mjs` (declarações), `tests/inicio/*.mjs`, `design/especime-v3/medicoes/portas-construtor.md`.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| E1 | cada cartão da faixa cujo id de linha está na lista de medidas do domínio aponta à página do domínio; os outros à leitura breve; contagem no `dist/index.html` e no `dist/en/index.html` | script |
| E2 | «Domínios» no menu nas duas edições, com destino que existe | HTML |
| E3 | `/estudos` a ≤ 1 toque e ≤ 1,5 ecrãs de `/` a 390 × 664 | geometria e o percurso escrito |
| E4 | a altura de `/` a 390 não sobe mais do que a altura da fila dos estudos, medida e dita | geometria |
| E5 | as réguas do F1.1 e as do sítio verdes; `npm run build`, `verify`, `typecheck` a 0 com os códigos lidos dos registos | os três comandos |
| E6 | uma planta por porta, vermelha e depois verde na régua da faixa: um cartão do domínio a apontar à linha; o menu sem «Domínios»; os estudos a mais de 1,5 ecrãs; o selo de volta dentro da manchete do domínio | a régua |
| E7 | a manchete do domínio sem texto de selo dentro da frase, medida pelo texto acessível do `<h1>` nas duas edições | script |

## 5 · O que se entrega e a disciplina

O relatório com E1 a E7 antes e depois, duas capturas (390 × 664 e 1 280) nas duas edições, o SHA e a corrida `portao` verde; commits pequenos em português sem travessões com os trailers `Co-Authored-By: Claude <modelo> <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido. Estimativa: da ordem de 0,2 a 0,4 M símbolos (S).
