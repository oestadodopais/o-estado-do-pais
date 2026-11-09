# Adenda A ao mandato CAM2-A: o teto, o âmbito do detetor, as marcas com plantas e a semente (09.11.2026)

Acrescenta: nada
Medidas: medidas-direcao-adenda-a-cam2a.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da paragem da primeira passagem pelo §2 (ddf8b8edf). Primeira retoma, a mesma sessão.*

## §0 Medido

- **A paragem.** O ensaio da passagem achou 1 522 frases por registar, acima das 1 500 do §2: 641 portuguesas e 881 inglesas, depois de afinar as marcas inglesas (471 antes). O teto foi um erro deste lugar: escrito sem contar as duas línguas pelo corte da camada 0. A contagem, sozinha, não mostra nenhum defeito.
- **A semente deu zero.** Este lugar mediu porquê, no `dist/` de f362f5ccd, com `medir-semente.py` (na pasta das medidas desta passagem). As 92 linhas com `afirmacao: true` estão todas citadas em alguma página. Fora do livro-razão, só em 12 páginas: duas de estudos em cada edição, e uma em cada edição para os itens (`/o-que-se-discute/` e `/en/under-discussion/`), os dossiês, o índice e o registo das correções. O detetor da passagem não lia os itens nem os dossiês.

## §1 O que fazes

1. **Retoma o protótipo.** Aplica `CAM2-A-interrompida.patch` e continua a partir dele: o mandato inteiro, com esta adenda por cima.
2. **O teto do §2** passa a 3 000 frases por registar, nas duas línguas. É uma guarda contra um detetor que dispare, não um alvo.
3. **O âmbito do detetor** são todas as páginas do leitor com prosa:
   - os documentos e as páginas dos estudos;
   - os itens (`/o-que-se-discute/` e `/en/under-discussion/`);
   - os dossiês;
   - os temas, onde estiverem as suas rotas;
   - as explicações;
   - o registo das correções.
   
   Ficam fora as páginas do livro-razão, porque são os recibos. Listas as rotas pelas coleções do sítio e não pelos prefixos, e dizes quais ficam fora e porquê.
4. **As marcas, com plantas** de casos reais do `dist/`, em cada língua: pelo menos cinco frases que têm de ser apanhadas e cinco que não, por exemplo `segundo` como ordinal (`o segundo trimestre`).
   - Na dúvida, a marca apanha: uma frase a mais na lista custa uma linha na AUD1, e uma frase a menos é um erro que pode chegar ao ar.
   - Numa amostra de trinta frases por língua, escolhida por guião com uma semente fixa, dizes quantas são afirmações sobre uma fonte, uma pessoa ou uma causa. É uma estimativa tua, não uma régua.
5. **Os pares.** A cobertura não precisa deles, porque cada língua se cobre sozinha. A semente e o `en` de uma entrada precisam: o par encontra-se pelo alinhamento dos blocos da paridade e, onde este falhar, pela vizinhança, como a camada 0 faz. Dizes quantas frases ficam sem par; uma frase sem par não faz parar.
6. **A semente:** a mesma regra do mandato, agora com os itens e os dossiês. Dizes quantas frases entraram, por rota.
7. **A comparação das páginas** (o ponto 7 do mandato). Um `dist/` de f362f5ccd está, só para ler, na pasta que `OEDP_DIST_BASE` nomeia.

## §2 Quando paras

Como no §2 do mandato, com o teto de 3 000.

## §3 O fim

O ponto 7 do mandato. Setenta e cinco minutos e cento e vinte chamadas, sem ajudantes.
