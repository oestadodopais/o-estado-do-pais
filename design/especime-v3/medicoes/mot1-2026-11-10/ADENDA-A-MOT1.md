# Adenda A ao mandato MOT1, segunda passagem: os outros três estudos, as linhas próprias e o portão (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2), depois de ler o relatório da primeira passagem (`RELATORIO-MOT1.txt`, nesta pasta) e de recompor por si o estudo 16 na tua worktree: os dois gabaritos aplanados dão o `.md` publicado, letra por letra. A primeira passagem está comitada pelo lugar de direção no motor (`fdfad8d`), com os oito ficheiros que preparaste. Lê primeiro o mandato (`MANDATO-MOT1.md`) e o teu relatório.*

## O que mudou no ambiente

O escrivão desta passagem arranca com `OEDP_GATE=adiado`: o lançador exporta a variável e o escrivão herda-a. Comitas por `comitar.sh`, como as regras comuns dizem; o `core.gate` inteiro corre uma vez, no ponto 4.

## O que fazes

1. **Os estudos 18 e 19.** Aplana os gabaritos de `content/18 Évora Economia e Dinheiro de Fora` e de `content/19 Évora 2027 Capital Europeia da Cultura`, com a mesma aceitação do estudo 16: todos os ficheiros gerados iguais byte a byte (os `.md`, os `.html`, o livro, a proveniência, as decisões de figura, os registos, os cortes e o manifesto), os gabaritos de antes guardados ao lado como história, e o `make_html.py` de cada um a escolher só os gabaritos ativos. No 19, as correções de decisão que referem blocos antigos conservam-se: a decisão de cada figura fica a mesma, e a prova é o registo exportado igual.

2. **O estudo 17.** O publicado difere do que as fontes hoje dão em duas frases (a marca «\[a verificar\]», que a fonte já escreve «está por confirmar na fonte»). Primeiro recompõe-o pelo gabarito de hoje e escreve o resultado (`core.compor --escrever`, o `make_html.py`, a exportação dos registos): a diferença para o que está comitado tem de ser só essas duas frases, nos ficheiros que as imprimem e nos seus resumos; se for mais do que isso, páras e dizes o quê. Depois aplana-o, com a aceitação de sempre contra esse resultado.

3. **As linhas próprias.** Um estudo com o seu próprio texto precisa de poder ter uma linha primária sua, que nenhuma das fontes tem (as correções de conteúdo que vêm a seguir trazem números novos, lidos em documentos que as fontes não leram). Acrescenta ao compositor a forma mais estreita para isso, ao lado das derivações locais que já existem:
   - a linha declara-se em `Technical Source/ajustes.json` do estudo, com os campos de uma linha primária das fontes (o identificador, o valor, as formas alternativas, o endereço da fonte, a data de acesso, o excerto com o documento e a página, o tipo de fonte) e a forma impressa em cada língua, ou a regra de formatação que as fontes já usam;
   - o compositor recusa uma linha sem excerto, sem endereço ou sem data; uma linha cujo valor não está no seu excerto; um identificador que colida com uma linha de uma fonte, com uma derivação ou com outra linha própria; e uma linha própria que nenhum marcador do texto use;
   - a linha entra no `ledger.json` do estudo e na proveniência, dita como linha própria, e os módulos do `core.gate` que conferem as linhas do livro tratam-na como uma linha primária;
   - uma derivação local pode ter linhas próprias como componentes.
   Não acrescentes nenhuma linha real a nenhum estudo: prova a forma com plantas e com uma cópia de teste (uma linha própria usada num marcador compõe, exporta e passa o portão; cada recusa acima morde).

4. **O portão.** `python3 -m core.gate`, uma vez, no fim, por `curto.sh`. As contagens de base dos estudos 16, 18 e 19 não mudam; se as do 17 mudarem com as duas frases, dizes de quanto para quanto e porquê, e atualizas a base. Se o portão der vermelho por outra razão, lês as causas todas antes de mexer e corriges numa só volta.

5. **O guião da medição** (`medir-mot1.py`, nesta pasta do sítio) conta hoje todos os `documento.*.md.tmpl`, e passaria a contar também os históricos. Não o mudes: diz no relatório os valores que ele dá agora sobre os gabaritos ativos, se os medires.

6. **O que não tocas:** o mesmo do mandato (as pastas 04 a 14, os ficheiros de outras corridas, o sítio salvo o relatório).

7. **O fecho.** Os commits com o assunto a começar por `MOT1`. O relatório curto, num ficheiro novo (`RELATORIO-MOT1-A.txt`): por estudo, os resumos de antes e de depois dos ficheiros gerados (no 17, os dois estados); a forma das linhas próprias e as plantas; o código do `core.gate` e as suas últimas linhas; os commits; o que ficou aberto.

## Quando paras

As paragens do mandato, e mais estas: o 17 recomposto muda mais do que as duas frases; o `core.gate` vermelho por uma régua que protege um número ou uma fonte e que só passaria enfraquecida; o teto da passagem, num commit são.

## O fim

O ponto 7. Setenta e cinco minutos, cento e vinte chamadas.
