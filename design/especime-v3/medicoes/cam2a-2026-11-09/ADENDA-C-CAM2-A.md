# Adenda C ao mandato CAM2-A: as marcas presas, as marcas portuguesas, o âmbito inteiro, o corte depois das aspas e a entrada de uma frase nova (09.11.2026)

Acrescenta: nada
Medidas: medidas-direcao-adenda-c-cam2a.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura a frio do Opus (cinco plantas em cinco; `LEITURA-cam2a.md` ao lado desta adenda no pacote seguinte). Terceira retoma, a mesma sessão, por decisão escrita. O bloco ainda não aterrou: a lista inicial pode mudar nesta passagem, e só depois da aterragem fica a regra de que só encolhe.*

## §0 Medido (pela leitura a frio, no `dist/` de f1b98c701, com os módulos do bloco)

- **As marcas mortas.** `tiposDaFrase('Subiu por causa do aumento dos juros.','pt')` devolve `[]`: a antecipação `(?![\p{L}])` mata `por causa d`, `resulta d` e `resultado d`. Há 32 frases portuguesas no âmbito com estas formas. O guião da AUD1 tem o mesmo erro.
- **Os verbos que faltam.** Há 120 frases portuguesas no âmbito com `diz`, `refere`, `indica`, `conclui`, `estima` ou `alerta` que não são detetadas. Exemplo: na página inicial, «a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação», cujo par inglês se apanha por `says`.
- **O âmbito.** As páginas dos 308 concelhos dão 619 unidades portuguesas e 931 inglesas, das quais 308 portuguesas são o mesmo rodapé. `/en/european-union` dá 27.
- **O corte.** Há 115 unidades com a forma `.» Maiúscula`. Cinco entradas do registo juntam frases que os excertos não sustentam: a entrada da saúde sem o PRR leva dois números e duas afirmações sobre os números do ministro e do PCP, sob uma linha que não tem nenhum.

## §1 O que fazes

1. **As marcas presas.**
   - Os positivos: uma planta real por marca e por língua, uma frase do `dist/` que só essa marca apanhe; quando o `dist/` não tiver uma, uma sintética identificada.
   - Os negativos: os de hoje, mais um por cada exclusão de `segundo`.
   - O pino: as listas das marcas presas por sha256 num ficheiro com a data e a razão. Mudar uma marca exige mudar o pino e a razão no mesmo commit, e a conferência recusa uma mudança das marcas sem o pino novo.
2. **As marcas portuguesas.**
   - Corrige a antecipação, em `frases-com-afirmacao.mjs` e no guião da AUD1 (`design/especime-v3/medicoes/cam2a-2026-11-09/listar-frases.py`).
   - Acrescenta `diz`, `dizem`, `refere`, `referem`, `indica`, `indicam`, `conclui`, `concluem`, `estima`, `estimam`, `alerta` e `alertam`, com negativos para os falsos (por exemplo `Mecanismo de Alerta` como nome).
   - Mede os pares nos dois sentidos: a frase inglesa apanhada cujo par português não é apanhado também conta. Dizes os dois números.
3. **O âmbito inteiro:** as páginas dos concelhos, dos distritos, das regiões, das áreas e da União Europeia, nas duas edições.
   - A chave de uma frase destas coleções é a coleção, a língua e a frase. A mesma frase repetida em várias páginas da coleção conta uma vez, e o registo dela vale para todas.
   - Ficam fora só as páginas do livro-razão. O teto do §2 passa a 4 000.
4. **O corte depois das aspas.** O detetor corta também depois de `.»`, `!»` e `?»` seguidos de espaço e maiúscula. Não muda o corte de `frasesDoTexto` para a régua da voz: o corte novo é do detetor.
   - A semente regenera-se. As frases que saem de uma entrada passam a frases próprias: ou entram no registo pela regra da semente, ou vão para a lista das por registar.
5. **A entrada de uma frase nova ou reescrita** (o achado 10).
   - Cada entrada leva `origem`: `semente`, ou `mandato <nome do mandato>`.
   - Uma entrada cuja frase não tenha uma citação de doze ou mais carateres presa ao excerto de uma das suas linhas leva `juizo: "por julgar"`. Só o juiz da CAM2-B a muda; a conferência recusa outro valor.
   - O README diz o caminho: o lugar de direção escreve a entrada na lista `Frases:` do mandato, com o tipo, as linhas e o par; o construtor aplica-a; a conferência prende as citações; o resto fica por julgar até ao juiz. Diz também que uma entrada escrita sem mandato se recusa: a conferência confere a `origem` contra os mandatos da pasta das medidas.
6. **Os Minor 11, 12 e 13.**
   - A aterragem confere, além do código, que o `ledger:check` e o `check:frases-afirmacao` dizem `corpos lidos`, com uma planta.
   - O `comitar.sh` confere a lista no índice preparado (`git show :ledger/frases/por-registar.json`), e não só na árvore de trabalho.
   - A semente guarda todos os tipos de cada frase.
7. **A lista inicial** regenera-se no fim desta passagem, com o pino novo. Dizes as contagens por coleção e por língua, como na adenda B.
8. **O fecho:** o ponto 7 do mandato com a adenda B: a base de f362f5ccd do mesmo dia (a mesma pasta de `OEDP_DIST_BASE`, reconstruída hoje), as únicas diferenças nas páginas as do Método, e o `ledger:check` e o `check:frases-afirmacao` com e sem o motor. Os commits pelo `comitar.sh`, com o assunto a começar por `CAM2-A`.

## §2 Quando paras

Como no §2 do mandato, com o teto de 4 000 e as regras do ponto 3 da adenda B.

## §3 O fim

O ponto 8. Setenta e cinco minutos e cento e vinte chamadas, sem ajudantes.
