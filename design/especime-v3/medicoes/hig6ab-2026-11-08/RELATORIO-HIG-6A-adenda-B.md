# HIG-6A, adenda B: fecho

Cabeça de código conferida: `bdf6ccab002d06d08be6a71db55fbfcd8e028327`. O `dist/version.json` coincide com essa cabeça. O commit deste relatório acrescenta apenas provas e registo.

Os pares são exclusivos por bloco, pela ordem e à menor distância, com FICA a contar e dispensa por `par: nenhum` fundamentada com pelo menos vinte carateres. Estudos sem as duas edições publicadas não exigem par. Duas entradas no mesmo bloco partilham o par. A cobertura da régua permanece exigida.

Limite declarado no guião: uma frase gémea por mudar dentro de um bloco com par, como a V122, só será resolvida pela correspondência pelo conteúdo na HIG-6B.

Os dois lançadores executam cópias temporárias de si próprios. As plantas alteram o original durante a execução: ambos conservam o código 17 do comando simulado, escrevem FIM e a linha dos pontos. Os dois controlos sem cópia perdem o fecho. A edição dos lançadores nesta passagem usou substituição atómica para preservar o descritor da passagem já em execução.

| Conferência | Código |
| --- | ---: |
| build integral, pelo escrivão | 0 |
| check:pre-mandato | 0 |
| typecheck | 0 |
| Pré-mandato da VOZ-2A na cabeça | 0 |
| Pré-mandato da VOZ-2B na cabeça, recusa esperada | 9 |
| Plantas reais e históricas | 0 |

VOZ-2A: zero recusas em todas as regras. VOZ-2B: voz 0, números 0, quantificadores sem declaração de asserção 28, entradas sem par 7, frases sem entrada 15. Sem par: V012, V093, V094, V100, V124, V293 e V296. A pasta da VOZ-2B contém apenas a lista; os dois invólucros `pre-voz2a.md` e `pre-voz2b.md` exercitam o pré-mandato real com `Frases:`.

O check:pre-mandato passou 41 plantas e controlos em memória e 52 testes Python (4 + 33 + 11 + 4). Inclui V228, dispensa sem razão, bloco reutilizado, FICA e entradas que partilham um bloco. As plantas históricas continuam a recusar as 10 frases da lista inicial e as três frases distintas com quantificadores antes da adenda G.

A primeira transposição trouxe o desempate do ensaio por entrada e recusou V249. A consulta do registo do segundo ensaio confirmou o desempate por bloco; a reposição desse algoritmo passou na VOZ-2A e deu os sete pares em falta na VOZ-2B. A régua da voz não mudou e nenhuma dispensa foi acrescentada às listas.

Comandos de fecho (saídas longas guardadas por `curto.sh`):

```sh
npm run check:pre-mandato
npm run typecheck
sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>/build build
python3 scripts/leituras/pre-mandato.py . design/especime-v3/medicoes/hig6ab-2026-11-08/pre-voz2a.md
python3 scripts/leituras/pre-mandato.py . design/especime-v3/medicoes/hig6ab-2026-11-08/pre-voz2b.md
node tests/leituras/frases-reais.mjs <temporario>/frases-reais.json
```

Custo da passagem: 10 corridas de conferências ou medições, incluindo uma construção integral; mais duas verificações de sintaxe `sh -n`. As dez incluem os dois ensaios iniciais dos pares e as execuções isoladas das plantas de frases e lançadores. Não houve corrida conjunta dos três portões, capturas ou alterações no motor. Contagem medida antes da redação deste fecho: 44 chamadas de ferramentas; a resposta final regista a contagem total depois do commit e da conferência da árvore.
