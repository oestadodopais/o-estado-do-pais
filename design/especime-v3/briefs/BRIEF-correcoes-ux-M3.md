# BRIEF · Correções de UX, M3 · a medição cega dos dois blocos

*Escrito a 25.08.2026 pelo lugar de direção (Claude Fable 5) para o medidor (Claude Sonnet). Corre depois dos blocos A e B, sobre a construção do ramo `correcoes-ux-2026-08-25` servida localmente, e sobre o sítio no ar para o «antes». Sem travessões na prosa deste ficheiro.*

## 0 · O que é

Uma medição cega: código teu, do zero, sem importar nada do sítio nem os detetores do leitor-utilizador (podes ler o relatório dele, `medicoes/auditoria-ux-2026-08-25-opus.md`, para saber **o que** medir, não **como**). Mede o «antes» no sítio no ar (`https://xn--oestadodopas-2fb.pt`, que é `main` antes das correções) e o «depois» na construção do ramo (`dist/` servido num porto livre com `python3 -m http.server`), com o Playwright do repositório (`devices["iPhone 13"]` para o telemóvel, 1280 × 800 para o computador), e diz o que mudou, número a número. Não lês os briefs dos blocos A e B nem as notas do construtor antes de medir; lês só a lista de baixo. Cada detetor é provado num caso conhecido **antes** de dar um zero (o caso conhecido de cada um está na lista).

## 1 · As medições

Em cada rota e largura, antes e depois:

1. **A altura da página** em px e em ecrãs, e **a distância até ao primeiro valor com selo** e até ao título da página (o `h1`).
2. **Alvos de toque abaixo de 44 × 44 px** no telemóvel, contando a **área efetiva** (o elemento mais os pseudo-elementos `::before`/`::after` posicionados: lê `getComputedStyle(el, '::after')` e soma a caixa); caso conhecido: no sítio no ar, os algarismos da manchete «4» e «9» (8 × 16 px).
3. **Texto abaixo de 12 px** visível no telemóvel; caso conhecido: no ar, «Painel europeu reconferido a» a 9,5 px.
4. **Sobreposições de texto** (caixas de linha de nós de texto que se cruzam, ignorando o que está recortado por um antepassado com `overflow` não visível); caso conhecido: no ar, o par «242,6 → 105,5» em `/municipios/evora` a 390.
5. **Bandas vazias** acima de 48 px entre dois blocos de conteúdo, medidas nos pixéis da captura de página inteira (só nas páginas até 50 000 px); caso conhecido: no ar, a banda de 96 px entre «308 concelhos» e o painel a 390.
6. **Transbordo horizontal** (`scrollWidth > innerWidth`).
7. **Os comandos da primeira página**, com toque real no telemóvel: depois de escolher «Concelho», o campo de pesquisa está dentro do ecrã (`top >= 0 && bottom <= innerHeight`) e tem o foco; o mapa não é rendido no telemóvel; no computador, o ponto de Évora é uma ligação para `/municipios/evora` (e quantos pontos são ligações); a régua não existe em `/`; o comando tem os estados «País» e «Concelho» nas duas larguras.
8. **As páginas de leitura** (`/estudos/evora-prometido-pago-auditado-2026/texto` e `/estudos/evora-quinze-anos-cinco-mandatos/texto`): «As linhas deste documento» está dentro de um `<details>` fechado por defeito; navegar para `#linha-<row>` (toca na porta de uma figura) abre a dobra e põe a entrada dentro do ecrã, no telemóvel e no computador; o índice «Nesta página» existe e cada âncora resolve; o caminho `.record.json` e os resumos de 64 hexadecimais não estão visíveis com a dobra fechada.
9. **O índice dos estudos**: uma linha por trabalho (12 e não 16), as edições dentro da linha; «Descrição: reformulação do título» não aparece visível.
10. **O marcador** `[a verificar]`: onde rende, é uma ligação para `/a-verificar` (conta as ocorrências e as que são ligação).
11. **O inglês**: `concelho` não aparece nas cadeias da interface de `/en` (conta as ocorrências em texto que não seja título de trabalho ou excerto).
12. **O livro-razão**: «Proveniência completa» tem denominador; nas páginas de linha o endereço da fonte não transborda.
13. **Évora**: «sem limiar» sem quadrado; o gráfico dos mandatos com os rótulos do mesmo lado.
14. **A régua do inventário**: corre `node scripts/medir-defeitos.mjs` na construção do ramo e regista autorreferência e blocos por classificar por rota (é o único script do sítio que corres, e só o corres, não o lês).

Rotas: `/`, `/municipios`, `/municipios/evora`, `/estudos`, `/estudos/evora-prometido-pago-auditado-2026`, a sua leitura, `/livro-razao`, `/livro-razao/divida-publica-2025`, `/agenda`, `/metodo`, `/correcoes`, `/en`, e as duas leituras longas para a 8.

## 2 · O relatório

`design/especime-v3/medicoes/correcoes-ux-M3-sonnet.md` e o programa ao lado: uma tabela por medição com antes, depois e a diferença, por rota e largura; a lista das discordâncias contra a lista da §1 (o que devia estar e não está), com coordenada e prova; as tuas falsas alarmes com a causa; os casos conhecidos de cada detetor, vistos vermelhos; o custo em símbolos. Nada é «ok» sem o número. Não corriges, não commitas, não tocas em nada fora de `medicoes/`.
