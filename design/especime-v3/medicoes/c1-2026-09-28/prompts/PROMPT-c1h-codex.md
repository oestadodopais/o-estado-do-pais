A quinta leitura a frio do C1 (a passagem C1g), pelo Claude Opus 5.5, está em `design/especime-v3/critica/LEITURA-c1g-2026-09-28.md`, com o registo das plantas. Retomas a mesma sessão e fazes a passagem **C1h**, com as regras de sempre (caminhos explícitos, nenhum `push`, uma construção de cada vez, os trailers, a resposta curta num ficheiro teu e o `-o` fora do ramo). A semana do Codex está a 94 %: faz só o que está abaixo, sem medições que o mandato não peça, e para num ponto limpo, com o que ficou por fazer escrito, se o contador se aproximar do fim.

## A triagem do lugar de direção

Os achados 1, 2, 3 e 4 são plantas. O 5 e o 10 alargam a I170, o 11 e o 12 alargam a I169, e o 7 abre a I173: ficam nos registos do lugar de direção. Fazes:

1. **A guarda da pasta pessoal volta a proteger o nome** (achados 6 e 8; o lugar de direção conferiu os dois nesta máquina, com a casa verdadeira e com uma casa de anfitrião do GitHub simulada: o nome da pasta sozinho já não era apanhado, e a pasta-mãe `/home/` virava cadeia proibida, sem ficheiro apanhado na construção de hoje). Em `proibidos()`: o nome da pasta pessoal sozinho entra sempre que tem pelo menos seis caracteres e não é um nome de conta genérica de uma lista curta declarada no código (pelo menos `runner`, e os outros que declares com a razão), seja qual for o nome do Git; a pasta-mãe só entra quando não é uma pasta genérica do sistema (a raiz, `/Users`, `/home`, e as que declares). A casa inteira continua a entrar como hoje. As plantas, todas pela função real `tem_caminho()`: (a) na casa verdadeira da máquina onde corre, uma página com o nome da pasta sozinho é apanhada (o nome lê-se de `Path.home()` na corrida e não se escreve em ficheiro nenhum); (b) uma casa pessoal inventada e portável (por exemplo `/Users/mariaexemplo`), com o nome sozinho numa página, é apanhada em qualquer máquina; (c) com a casa `/home/runner`, uma página com `https://example.org/home/x` não é apanhada; (d) as plantas das pastas genéricas continuam a passar. O relatório diz, por tipo e sem escrever nome nenhum, que cadeias cada máquina proíbe.
2. **As capturas dos cinco recibos do PRR que a C1g mudou** (achado 9), na cabeça final, nas duas edições e nas cinco larguras, com o guião de capturas do bloco; a frase da aceitação diz o que as capturas cobrem, e só isso.
3. **O custo da C1g e da C1h** (achado 13), em símbolos e em segundos, pelo contador da sessão e pelas horas, como a C1g fez para a C1e e a C1f.
4. **A prova isolada da travessia refeita sobre o registo comprometido** (achado 14), e a tabela cita essa corrida.

## Depois

Os três portões inteiros na cabeça final, cada um no seu comando com o código em `portoes/c1h/`; a secção C1h no `LEIA-ME.md`; o `medidas.json` com `conferir-relatorio.py` a zero faltas.
