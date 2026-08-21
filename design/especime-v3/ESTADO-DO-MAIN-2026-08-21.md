# O estado de `main` ao fim de 21.08.2026, depois da fusão da fase 1 do redesenho v3

*Escrito pelo lugar de direção (Claude Fable 5) ao fechar a sessão de 20 e 21.08. Tudo lido no repositório ou no sítio no ar; sem travessões.*

## 1. Onde está `main`
- `main` = `origin/main` = no ar = **`eac5bfa`** (`ef7832a` + o registo da fusão); `verify:deploy` ✓ às 20:3x BST. Base da fase: `77e82eb`. O ramo `redesenho-v3` está fundido (fast-forward) e é apagável.
- A constituição em vigor: `IDENTIDADE.md` v2 emendada em §1, §2, §5 (20 e 21.08) **e** a Constituição visual v3.1 com as **Emendas 1 a 17** (cofre `Experiments/O Estado do País — Constituição visual v3.1.md`, fonte; cópia `design/especime-v3/direcao.md`). Onde discordam, as Emendas vencem; a regra da frase (nota à Emenda 15): uma frase sobrevive numa página do leitor se a sua remoção fizesse um leitor ler mal um número.
- Os registos: `DECISIONS.md` §1.50 a §1.56 e §4; `design/especime-v3/PLANO-redesenho-v3.md` (o plano e os factos por etapa, §14a/14b as pré-visualizações e a fusão); `notas/stage-0..5.md`; `RELOCACOES.md`, `CHAVES-EN.md`, `INVENTARIO-FRASES.md`, `ISSUES.md`; `critica/` com as seis leituras do Codex e as suas plantas.

## 2. O que o portão confere hoje (além do de 20.08)
`npm run build` = `ledger:check` (amarra com 24 entradas, 2 textos governados, 2 citações da constituição, o fecho do Método incluído) · `check:cruzamento` · `check:documentos` · `astro build` · `stamp:version` · **`cartoes`** (532 PNG e registos) · `gate:html` (33 chaves da prova recontadas, 2 listas de nomes recontadas, os cartões reconferidos valor a valor como cadeia) · `check:dados` (os ficheiros por rota declarada). Fora da construção: `typecheck`, `ortografia.mjs --verificar` (verde), `verify:deploy`, `medir-defeitos.mjs` (com o inventário de frases: 36 rotas a 0 autorreferência; frases de moldura 92 · 2 487), `medir-contraste.mjs` (0 falhas de texto; 4 pares de interface abaixo de 3:1, os mesmos), `medir-invariancia.mjs`, `tests/inicio/matriz.mjs` (107 células).

## 3. O que fica aberto
- **Deveres pós-fusão não feitos:** `scripts/design-bundle.mjs` e `README.md` descrevem a identidade v2 (o gerador procura a camada Fundo e pára); o pacote de desenho e o DesignSync esperam por eles (ISSUES I16).
- **Os estudos:** os documentos alojados são bytes do motor (tema escuro, letra própria, prosa que se explica); só a faixa do topo é da casa e ainda diz «Escrito por IA, dirigido por uma pessoa · About». Caminho: a faixa na v3 (sítio); um gabarito v3 no motor e a republicação das 15 edições com `ledger.json` ao lado (bloco de republicação, como a §1.49); páginas de leitura para os 6 trabalhos sem ela (conteúdo, da direção).
- **ISSUES pequenos:** I13/I14 (selos em prosa do instrumento v2 abaixo de 44px), I53 (sem rota 404 em inglês; pede regra no `vercel.json`), I57/I58/I59 (cartões: cópia das fontes, sem OCR, PNG 41 KB).
- **Pedidos ao motor:** I32 (as linhas do desemprego de longa duração e jovem; a identidade do 13.º indicador do PDM), I60 (a ilha `rcpt-data` duplicada num documento).
- **Da direção:** a fase da voz (frases de moldura 92 contra ≤ 12) agora ou depois da página de leitura da habitação; a rota 404 inglesa.
- **Segunda-feira 24.08:** o refresco semanal do painel reconstrói o sítio sobre a nova base; a primeira reconstrução automática com os cartões e a lede gerada é para observar.
