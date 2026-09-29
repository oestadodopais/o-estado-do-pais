# Resposta do construtor · F2.2d

A passagem está concluída no âmbito do mandato. A referência fixa de `68318e0`
troca só o nome do utilizador no rótulo por `<utilizador>` e o caminho do `cd`
por `<motor>`. Os restantes bytes conferem. O SHA-256 da cópia é validado pelas
plantas; o original, o comando que o reproduz e as linhas trocadas estão na
proveniência ao lado. O clone raso sem `master` local passou com código 0.

Motor: `7c43b0746f8c43d9ace5cfdcb4d71a79927a6813`. Commits F2.2d:
`f8a20fb2`, `7fddf67f` e `7c43b074`.
Sítio: `f97d7d60` e `ad4722fa`, seguidos do último commit desta passagem,
que contém esta resposta, o relatório atualizado e as provas. O SHA final do
sítio é comunicado fora do ramo. O relatório `LEIA-ME.md` cobre o bloco inteiro.

| Comando | Código lido de ficheiro |
|---|---:|
| `python3 -m core.gate` | 0 |
| `npm run build` | 0 |
| `npm run verify` | 0 |
| `npm run typecheck` | 0 |
| Plantas no clone raso sem `master` | 0 |

Os ficheiros são `provas/f22d/core-final.codigo`, `provas/f22d/clone.codigo`
e os três `.codigo` em `portoes/f22d/`, com cabeças e árvores ao lado.
O motor e o clone correspondem à cabeça final acima. Os portões do sítio são
os de `f97d7d60`, conservados conforme o mandato final: desde essa cabeça só
mudou o pacote de provas. Passaram 47 plantas das rotinas, 26 adicionais com
os estados reais, 25 no clone raso e 94 conferências dos fluxos.

A F2.2d consumiu até à fotografia `2026-09-29T23:53:41.789Z`
13670876 símbolos em 3929,194 segundos. O bloco inteiro
soma nessa fotografia 63666678 símbolos. Incluem cache; os segundos
incluem a pausa desta passagem. A fotografia antecede o último commit e a
resposta final. As árvores históricas não fotografadas continuam identificadas
como desconhecidas; as novas provas guardam a árvore antes da execução.

Não há pendências locais do mandato. Publicação, ensaios despachados, chaves,
interruptores e reforma de agentes reais continuam fora desta passagem.
Não houve `push`, despachos, alterações de interruptores ou agentes reais.
São declarações do construtor, separadas das medições.
